/**
 * Columna CFT (Concrete-Filled Tube) — modelado MIXTO Q4 + H8.
 *
 * Tubo HSS rectangular hueco en acero (shells Q4):
 *   - 4 paredes verticales: 2 normales a X (caras y=±hc/2), 2 normales a Y (caras x=±bc/2)
 *   - Espesor t (atributo del shell)
 *
 * Relleno de concreto (H8 sólidos):
 *   - Mesh hexaédrico que llena el interior del tubo
 *   - Comparte NODOS con la cara interior de cada pared del tubo (composite action)
 *
 * Validación: AISC 360-22 §I2.1b composite axial capacity Pno y EI_eff.
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 */
import van, { State } from "vanjs-core";
import { Pane } from "tweakpane";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { hex8Solve, type Vec3, type Hex8 } from "../solid-cube-fem/h8";
import {
  getToolbar, getParameters, Parameters, getViewer,
  colorMapForceUnit, colorMapDispUnit, colorMapStressUnit, enableDraggableAllPanes,
} from "hekatan-ui";
import { ecHormigonACI } from "../shared/materials";

// Acero HSS (kN/m², kN/m³)
const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;
const Fy_s = 350000;  // 350 MPa, ASTM A500 Gr. C
// Concreto
const Ec_default = 25e6;
const nu_c = 0.20;

const parameters: Parameters = {
  bc:       { value: van.state(0.40),  min: 0.20,  max: 0.80,  step: 0.05, label: "bc tubo (m, eje X)" },
  hc:       { value: van.state(0.40),  min: 0.20,  max: 0.80,  step: 0.05, label: "hc tubo (m, eje Y)" },
  Lz:       { value: van.state(3.00),  min: 1.5,   max: 6.0,   step: 0.5,  label: "Altura Lz (m)" },
  t:        { value: van.state(0.012), min: 0.006, max: 0.030, step: 0.002, label: "t pared HSS (m)" },
  // Mesh — debe ser divisor para alinear interfaz Q4↔H8
  nx:       { value: van.state(4),     min: 2,     max: 8,     step: 2,    label: "nx (X)" },
  ny:       { value: van.state(4),     min: 2,     max: 8,     step: 2,    label: "ny (Y)" },
  nz:       { value: van.state(8),     min: 4,     max: 16,    step: 2,    label: "nz (Z)" },
  // Materiales
  fc:       { value: van.state(28000), min: 17000, max: 50000, step: 1000, label: "f'c concreto (kN/m²)" },
  // Cargas
  Pu:       { value: van.state(2000),  min: 0,     max: 10000, step: 100,  label: "Pu axial (kN, -Z)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

const benchValues: State<{
  As: number; Ac: number; Is: number; Ic: number;
  EI_eff: number; Pno_AISC: number; demandCap: number;
  uz_top_he: number; uz_axial_an: number; errPct: number;
}> = van.state({ As: 0, Ac: 0, Is: 0, Ic: 0, EI_eff: 0, Pno_AISC: 0, demandCap: 0, uz_top_he: 0, uz_axial_an: 0, errPct: 0 });

van.derive(() => {
  const bc = parameters.bc.value.val;
  const hc = parameters.hc.value.val;
  const Lz = parameters.Lz.value.val;
  const t = parameters.t.value.val;
  const nx = Math.round(parameters.nx.value.val);
  const ny = Math.round(parameters.ny.value.val);
  const nz = Math.round(parameters.nz.value.val);
  const fc = parameters.fc.value.val;
  const Pu = parameters.Pu.value.val;
  // E concreto AISC: Ec = 4700·√(fc en MPa) [MPa] = 4700·√(fc/1000) [MPa] → kN/m² = MPa·1000
  const Ec = ecHormigonACI(fc / 1000);
  void Ec_default;

  // ── Geometría: tubo HSS y H8 concreto comparten nodos en interfaz interna ──
  // Para simplicidad CBFEM: shell del tubo se ubica en la cara INTERIOR del tubo
  // (x = ±(bc/2 - t), y = ±(hc/2 - t)). Espesor t como atributo. Concreto H8
  // llena exactamente el interior y comparte estos nodos.
  const x_int = bc / 2 - t;  // X interior face
  const y_int = hc / 2 - t;  // Y interior face

  // Mesh dedup espacial
  const nodes: Node[] = [];
  const nodeMap = new Map<string, number>();
  const KEY_DEC = 5;
  function addNode(x: number, y: number, z: number): number {
    const key = `${x.toFixed(KEY_DEC)},${y.toFixed(KEY_DEC)},${z.toFixed(KEY_DEC)}`;
    let id = nodeMap.get(key);
    if (id === undefined) {
      nodes.push([x, y, z]);
      id = nodes.length - 1;
      nodeMap.set(key, id);
    }
    return id;
  }

  // Q4 shell elements (steel walls)
  const shellElements: Element[] = [];
  const shellThicknesses = new Map<number, number>();
  const shellElast = new Map<number, number>();
  const shellNu = new Map<number, number>();
  const shellRho = new Map<number, number>();
  const shellG = new Map<number, number>();
  const dummyA = new Map<number, number>();
  const dummyIz = new Map<number, number>();
  const dummyIy = new Map<number, number>();
  const dummyJ = new Map<number, number>();

  function addShell(n0: number, n1: number, n2: number, n3: number) {
    shellElements.push([n0, n1, n2, n3]);
    const i = shellElements.length - 1;
    shellThicknesses.set(i, t);
    shellElast.set(i, Es);
    shellNu.set(i, nu_s);
    shellRho.set(i, rho_s);
    shellG.set(i, Gs);
    dummyA.set(i, 0); dummyIz.set(i, 0); dummyIy.set(i, 0); dummyJ.set(i, 0);
  }

  // ── Generar grid 3D de nodos del CONCRETO interior (incluye caras coincidentes
  // con tubo interior) ──
  const dx = (2 * x_int) / nx;
  const dy = (2 * y_int) / ny;
  const dz = Lz / nz;
  const concIdx = (i: number, j: number, k: number) =>
    addNode(-x_int + i * dx, -y_int + j * dy, k * dz);

  // ── H8 concrete elements ──
  const concH8: Hex8[] = [];
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        concH8.push([
          concIdx(i, j, k),
          concIdx(i + 1, j, k),
          concIdx(i + 1, j + 1, k),
          concIdx(i, j + 1, k),
          concIdx(i, j, k + 1),
          concIdx(i + 1, j, k + 1),
          concIdx(i + 1, j + 1, k + 1),
          concIdx(i, j + 1, k + 1),
        ]);
      }
    }
  }

  // ── Q4 shells de las 4 paredes del tubo HSS (en caras interiores) ──
  // Pared x=-x_int (frontal): para cada (j,k) celda en plano YZ
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      addShell(concIdx(0, j, k), concIdx(0, j + 1, k),
               concIdx(0, j + 1, k + 1), concIdx(0, j, k + 1));
    }
  }
  // Pared x=+x_int (trasera)
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      addShell(concIdx(nx, j, k), concIdx(nx, j + 1, k),
               concIdx(nx, j + 1, k + 1), concIdx(nx, j, k + 1));
    }
  }
  // Pared y=-y_int (izq)
  for (let k = 0; k < nz; k++) {
    for (let i = 0; i < nx; i++) {
      addShell(concIdx(i, 0, k), concIdx(i + 1, 0, k),
               concIdx(i + 1, 0, k + 1), concIdx(i, 0, k + 1));
    }
  }
  // Pared y=+y_int (der)
  for (let k = 0; k < nz; k++) {
    for (let i = 0; i < nx; i++) {
      addShell(concIdx(i, ny, k), concIdx(i + 1, ny, k),
               concIdx(i + 1, ny, k + 1), concIdx(i, ny, k + 1));
    }
  }

  // ── BCs: empotrar todos los nodos en z=0 ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  nodes.forEach((p, id) => {
    if (Math.abs(p[2]) < 1e-7) supports.set(id, [true, true, true, true, true, true]);
  });

  // ── Carga axial Pu en nodos del top z=Lz ──
  const topNodes: number[] = [];
  nodes.forEach((p, id) => {
    if (Math.abs(p[2] - Lz) < 1e-6) topNodes.push(id);
  });
  const fz = -Pu / Math.max(1, topNodes.length);
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (const id of topNodes) loads.set(id, [0, 0, fz, 0, 0, 0]);

  // ── Solver: usamos sólo el solver de shells Hekatan (deform/analyze) sobre el
  // tubo HSS. El concreto H8 se solveará por separado con hex8Solve para mostrar
  // la composición visual. Para el TFM la simulación pura solver-mixto requiere
  // ensamblaje conjunto K_shell + K_h8 — TODO pro version. ──
  //
  // Simplificación: usamos `deform` con sólo los shells (asume rigidez tubo)
  // para validar la rigidez del CONJUNTO contra AISC §I2 vía homogenización.
  const nodeInputs: NodeInputs = { supports, loads };
  const shellElementInputs: ElementInputs = {
    elasticities: shellElast,
    poissonsRatios: shellNu,
    densities: shellRho,
    shearModuli: shellG,
    thicknesses: shellThicknesses,
    areas: dummyA, momentsOfInertiaZ: dummyIy, momentsOfInertiaY: dummyIz, torsionalConstants: dummyJ,
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, shellElements, nodeInputs, shellElementInputs);
    analyzeOutputs = analyze(nodes, shellElements, shellElementInputs, deformOutputs);
  } catch (e: any) {
    console.warn("CFT shell deform/analyze:", e?.message ?? e);
  }

  // Solver H8 separado para concreto (informativo, no acoplado en esta versión)
  try {
    const h8Supports = new Map<number, [boolean, boolean, boolean]>();
    supports.forEach((v, id) => h8Supports.set(id, [v[0], v[1], v[2]]));
    const h8Loads = new Map<number, [number, number, number]>();
    loads.forEach((v, id) => h8Loads.set(id, [v[0], v[1], v[2]]));
    const concRes = hex8Solve({
      nodes: nodes as Vec3[], elements: concH8, E: Ec, nu: nu_c,
      supports: h8Supports, loads: h8Loads,
    });
    console.log(`CFT concreto H8: ${concH8.length} elem · ${concRes.elapsedMs.toFixed(0)}ms`);
  } catch (e: any) {
    console.warn("CFT concreto H8:", e?.message ?? e);
  }

  // ── BENCHMARK AISC §I2.1b ──
  // As (área acero), Ac (área concreto), Is, Ic
  const Ac = (bc - 2 * t) * (hc - 2 * t);    // área concreto interior
  const Atot = bc * hc;
  const As = Atot - Ac;                      // área acero (anillo)
  // Inercias respecto al eje fuerte (Iy global, en plano XZ): I = b·h³/12
  const Itot = (bc * hc * hc * hc) / 12;
  const Ic = ((bc - 2 * t) * (hc - 2 * t) ** 3) / 12;
  const Is = Itot - Ic;

  // EI_eff per AISC §I2.1b: EI_eff = Es·Is + C3·Ec·Ic, C3 = min(0.9, 0.45+3·(As+Asr)/(As+Ac))
  // Sin refuerzo Asr=0 → C3 = min(0.9, 0.45 + 3·As/(As+Ac))
  const C3 = Math.min(0.9, 0.45 + 3 * As / (As + Ac));
  const EI_eff = Es * Is + C3 * Ec * Ic;

  // Pno = Pp = Fy·As + 0.85·fc·Ac (compact, AISC eq I2-9a)
  const Pno = Fy_s * As + 0.85 * fc * Ac;
  const phi_c = 0.75;
  const phiPno = phi_c * Pno;
  const demandCap = Pu / Math.max(1, phiPno);

  // δ axial homogenizado: δ = Pu·Lz / (Es·As + Ec·Ac)
  const EA_eff = Es * As + Ec * Ac;
  const uz_axial_an = -Pu * Lz / EA_eff;

  // δ Hekatan: max |Uz| en top
  let uz_top_he = 0;
  for (const id of topNodes) {
    const u = deformOutputs.deformations?.get(id);
    if (u && Math.abs(u[2]) > Math.abs(uz_top_he)) uz_top_he = u[2];
  }
  // El solver Hekatan (sin H8 acoplado) mide sólo rigidez del tubo HSS.
  // Por eso el "% error" es informativo: H8 puro daría rigidez del concreto solo;
  // CFT real es Es·As + Ec·Ac. Esta versión calcula los dos por separado.
  const errPct = Math.abs(uz_top_he - uz_axial_an) / Math.abs(uz_axial_an || 1) * 100;

  benchValues.val = { As, Ac, Is, Ic, EI_eff, Pno_AISC: Pno, demandCap, uz_top_he, uz_axial_an, errPct };

  nodesState.val = nodes;
  elementsState.val = shellElements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = shellElementInputs;
  deformOutputsState.val = deformOutputs;
  analyzeOutputsState.val = analyzeOutputs;
});

const viewerEl = getViewer({
  mesh: {
    nodes: nodesState,
    elements: elementsState,
    nodeInputs: nodeInputsState,
    elementInputs: elementInputsState,
    deformOutputs: deformOutputsState,
    analyzeOutputs: analyzeOutputsState,
  },
  settingsObj: {
    deformedShape: true,
    shellResults: "vonMises",
    gridSize: 4,
    deformScale: 200,
    loads: true,
    supports: true,
    displayScale: 0.4,
  },
});

// ── Tweakpane Benchmark ──
const benchContainer = document.createElement("div");
benchContainer.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
const benchPane = new Pane({ title: "🧪 Benchmark — CFT (HSS+H8)", container: benchContainer, expanded: true });
const benchObj = {
  As: 0, Ac: 0, Is: 0, Ic: 0,
  EI_eff: 0, Pno_AISC: 0, demandCap: 0,
  uz_top_he: 0, uz_axial_an: 0, errPct: 0,
};
const fmtSci = (v: number) => v.toExponential(3);

const fSec = benchPane.addFolder({ title: "Sección compuesta" });
fSec.addBinding(benchObj, "As", { readonly: true, label: "As acero (m²)", format: fmtSci });
fSec.addBinding(benchObj, "Ac", { readonly: true, label: "Ac concreto (m²)", format: fmtSci });
fSec.addBinding(benchObj, "Is", { readonly: true, label: "Is (m⁴)", format: fmtSci });
fSec.addBinding(benchObj, "Ic", { readonly: true, label: "Ic (m⁴)", format: fmtSci });

const fAISC = benchPane.addFolder({ title: "AISC 360-22 §I2.1b" });
fAISC.addBinding(benchObj, "EI_eff",   { readonly: true, label: "EI_eff (kN·m²)", format: fmtSci });
fAISC.addBinding(benchObj, "Pno_AISC", { readonly: true, label: "Pno (kN)", format: (v: number) => v.toFixed(0) });
fAISC.addBinding(benchObj, "demandCap",{ readonly: true, label: "Pu / φPno", format: (v: number) => v.toFixed(3) });

const fH = benchPane.addFolder({ title: "Hekatan (medido)" });
fH.addBinding(benchObj, "uz_axial_an", { readonly: true, label: "δ axial AISC (m)", format: fmtSci });
fH.addBinding(benchObj, "uz_top_he",   { readonly: true, label: "δ top medido (m)", format: fmtSci });
fH.addBinding(benchObj, "errPct",      { readonly: true, label: "Δ vs AISC (%)", format: (v: number) => v.toFixed(1) });

const fU = benchPane.addFolder({ title: "Unidades color map", expanded: false });
const unitsObj = { stress: colorMapStressUnit.val, disp: colorMapDispUnit.val, force: colorMapForceUnit.val };
fU.addBinding(unitsObj, "stress", {
  options: { "kN/m²":"kN/m²","kPa":"kPa","MPa":"MPa","GPa":"GPa","kgf/cm²":"kgf/cm²","tonf/m²":"tonf/m²","ksi":"ksi","psi":"psi" },
  label: "Tensión",
}).on("change", (e: any) => { colorMapStressUnit.val = e.value; });
fU.addBinding(unitsObj, "disp", {
  options: { m:"m", cm:"cm", mm:"mm", "µm":"µm" }, label: "Desplaz.",
}).on("change", (e: any) => { colorMapDispUnit.val = e.value; });

document.body.append(benchContainer);

van.derive(() => {
  const v = benchValues.val;
  Object.assign(benchObj, v);
  benchPane.refresh();
});

document.body.append(
  getParameters(parameters),
  viewerEl,
  getToolbar({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/columna-cft-h8/main.ts",
  }),
);

setTimeout(() => enableDraggableAllPanes(), 200);
setTimeout(() => {
  const ctx = (viewerEl as any).__ctx;
  if (ctx?.camera && ctx?.controls) {
    ctx.camera.up.set(0, 0, 1);
    ctx.camera.position.set(2.0, -2.0, 1.8);
    ctx.controls.target.set(0, 0, 1.5);
    ctx.controls.update();
    ctx.render?.();
  }
}, 800);
