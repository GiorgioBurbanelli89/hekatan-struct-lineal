/**
 * Viga Doble T ASIMÉTRICA modelada con shells Q4.
 *
 * Sección con patines superior e inferior INDEPENDIENTES (CBFEM-style):
 *   - Patín superior: bf_sup × tb_sup
 *   - Alma: hw × tw
 *   - Patín inferior: bf_inf × tb_inf  (puede ser diferente al superior)
 *
 * Soldadura alma↔patines = nodos compartidos en y=0 (centerline alma).
 *
 * Empotrada en x=0, carga puntual P en x=L (extremo libre, dirección -Z).
 *
 * Benchmark: tensión flexional σ = M·c/I con eje neutro desplazado
 * (sección asimétrica → centroid no está en h/2).
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 */
import van, { State } from "vanjs-core";
import { Pane } from "tweakpane";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import {
  getToolbar, getParameters, Parameters, getViewer,
  colorMapForceUnit, colorMapDispUnit, colorMapStressUnit, enableDraggableAllPanes,
} from "hekatan-ui";

// Material acero (kN/m², kN/m³)
const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;

const parameters: Parameters = {
  // ── Geometría ──
  L:        { value: van.state(4.0),   min: 1.0,   max: 10.0,  step: 0.5,  label: "Luz L (m)" },
  hw:       { value: van.state(0.40),  min: 0.20,  max: 1.20,  step: 0.05, label: "hw alma (m)" },
  tw:       { value: van.state(0.012), min: 0.006, max: 0.030, step: 0.002, label: "tw alma (m)" },
  // Patín superior
  bf_sup:   { value: van.state(0.20),  min: 0.10,  max: 0.50,  step: 0.02, label: "bf SUP (m)" },
  tb_sup:   { value: van.state(0.018), min: 0.008, max: 0.040, step: 0.002, label: "tb SUP (m)" },
  // Patín inferior (puede ser ASIMÉTRICO al superior)
  bf_inf:   { value: van.state(0.30),  min: 0.10,  max: 0.50,  step: 0.02, label: "bf INF (m)" },
  tb_inf:   { value: van.state(0.022), min: 0.008, max: 0.040, step: 0.002, label: "tb INF (m)" },
  // ── Mesh ──
  nx:       { value: van.state(20),    min: 8,     max: 48,    step: 2,    label: "Mesh nx (luz)" },
  ny_w:     { value: van.state(6),     min: 2,     max: 12,    step: 1,    label: "Mesh ny alma" },
  ny_f:     { value: van.state(4),     min: 2,     max: 10,    step: 1,    label: "Mesh ny patín" },
  // ── Cargas ──
  P:        { value: van.state(50),    min: 0,     max: 500,   step: 10,   label: "P punta (kN, -Z)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

// ── Live benchmark ──
const benchValues: State<{
  A: number; y_c: number;        // área total + centroide (desde fibra inf)
  I: number;                     // I respecto al eje neutro
  M_max: number; sigma_top_an: number; sigma_bot_an: number;
  sigma_max_he: number;
  delta_an: number; delta_he: number; errPct: number;
}> = van.state({
  A: 0, y_c: 0, I: 0,
  M_max: 0, sigma_top_an: 0, sigma_bot_an: 0,
  sigma_max_he: 0, delta_an: 0, delta_he: 0, errPct: 0,
});

van.derive(() => {
  const L = parameters.L.value.val;
  const hw = parameters.hw.value.val;
  const tw = parameters.tw.value.val;
  const bf_sup = parameters.bf_sup.value.val;
  const tb_sup = parameters.tb_sup.value.val;
  const bf_inf = parameters.bf_inf.value.val;
  const tb_inf = parameters.tb_inf.value.val;
  const nx = Math.round(parameters.nx.value.val);
  const ny_w = Math.round(parameters.ny_w.value.val);
  const ny_f = Math.round(parameters.ny_f.value.val);
  const P = parameters.P.value.val;

  // ── Geometría: viga horizontal en eje X, sección en YZ ──
  // Z = altura (vertical), Y = ancho (transversal).
  // Patín inferior:  z = 0..tb_inf (rectángulo de bf_inf × tb_inf en Y×Z)
  // Alma: z = tb_inf..tb_inf+hw (rectángulo tw en Y, hw en Z)
  // Patín superior: z = tb_inf+hw..tb_inf+hw+tb_sup (rectángulo bf_sup × tb_sup)
  const z_inf_bot = 0;
  const z_inf_top = tb_inf;
  const z_web_top = tb_inf + hw;
  const z_sup_top = tb_inf + hw + tb_sup;

  // Posiciones X uniformes a lo largo de L
  const dx = L / nx;

  const nodes: Node[] = [];
  const elements: Element[] = [];
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
  function addShell(n0: number, n1: number, n2: number, n3: number, t: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    thicknesses.set(i, t);
    elasticities.set(i, Es);
    poissonsRatios.set(i, nu_s);
    densities.set(i, rho_s);
    shearModuli.set(i, Gs);
    areas.set(i, 0); Iz.set(i, 0); Iy.set(i, 0); J.set(i, 0);
  }

  const thicknesses = new Map<number, number>();
  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iz = new Map<number, number>();
  const Iy = new Map<number, number>();
  const J = new Map<number, number>();

  // ── ALMA: plano y=0, malla nx × ny_w ──
  // Filas Z desde z_inf_top hasta z_web_top (división en ny_w celdas)
  const dz_w = hw / ny_w;
  // Construir grid alma
  const webGrid: number[][] = [];
  for (let iz = 0; iz <= ny_w; iz++) {
    const row: number[] = [];
    const z = z_inf_top + iz * dz_w;
    for (let ix = 0; ix <= nx; ix++) {
      row.push(addNode(ix * dx, 0, z));
    }
    webGrid.push(row);
  }
  for (let iz = 0; iz < ny_w; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      addShell(webGrid[iz][ix], webGrid[iz][ix+1], webGrid[iz+1][ix+1], webGrid[iz+1][ix], tw);
    }
  }

  // ── PATÍN INFERIOR: en plano z=z_inf_top (altura tb_inf por debajo, idealizado como shell) ──
  // Modelado como shell horizontal en z = z_inf_top, ancho bf_inf en Y.
  // Soldadura: la fila central del patín (y=0) coincide con la fila inferior del alma.
  const dy_inf = bf_inf / ny_f;
  // ny_f debe ser par para tener nodo central en y=0
  const ny_f_even = ny_f % 2 === 0 ? ny_f : ny_f + 1;
  const dy_inf_e = bf_inf / ny_f_even;
  const infGrid: number[][] = [];
  for (let iy = 0; iy <= ny_f_even; iy++) {
    const row: number[] = [];
    const y = -bf_inf / 2 + iy * dy_inf_e;
    for (let ix = 0; ix <= nx; ix++) {
      // Si iy está en el medio (y=0), reusar nodo del alma fila inferior
      if (Math.abs(y) < 1e-7) {
        row.push(webGrid[0][ix]);  // soldadura ↔ alma
      } else {
        row.push(addNode(ix * dx, y, z_inf_top));
      }
    }
    infGrid.push(row);
  }
  for (let iy = 0; iy < ny_f_even; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      addShell(infGrid[iy][ix], infGrid[iy][ix+1], infGrid[iy+1][ix+1], infGrid[iy+1][ix], tb_inf);
    }
  }

  // ── PATÍN SUPERIOR: plano z=z_web_top, ancho bf_sup ──
  const ny_f_even2 = ny_f % 2 === 0 ? ny_f : ny_f + 1;
  const dy_sup_e = bf_sup / ny_f_even2;
  const supGrid: number[][] = [];
  for (let iy = 0; iy <= ny_f_even2; iy++) {
    const row: number[] = [];
    const y = -bf_sup / 2 + iy * dy_sup_e;
    for (let ix = 0; ix <= nx; ix++) {
      if (Math.abs(y) < 1e-7) {
        row.push(webGrid[ny_w][ix]);  // soldadura ↔ alma fila superior
      } else {
        row.push(addNode(ix * dx, y, z_web_top));
      }
    }
    supGrid.push(row);
  }
  for (let iy = 0; iy < ny_f_even2; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      addShell(supGrid[iy][ix], supGrid[iy][ix+1], supGrid[iy+1][ix+1], supGrid[iy+1][ix], tb_sup);
    }
  }

  // ── BCs: empotrar todos los nodos en x=0 ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  nodes.forEach((p, id) => {
    if (Math.abs(p[0]) < 1e-7) supports.set(id, [true, true, true, true, true, true]);
  });

  // ── Carga: distribuir P en nodos del extremo x=L del alma + flange superior central ──
  const tipNodes: number[] = [];
  nodes.forEach((p, id) => {
    if (Math.abs(p[0] - L) < 1e-6) tipNodes.push(id);
  });
  const loads = new Map<number, [number, number, number, number, number, number]>();
  const fz = -P / Math.max(1, tipNodes.length);
  for (const id of tipNodes) loads.set(id, [0, 0, fz, 0, 0, 0]);

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities, shearModuli, areas,
    momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
    densities, poissonsRatios, thicknesses,
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
  } catch (e: any) {
    console.warn("Viga doble T asim deform/analyze:", e?.message ?? e);
  }

  // ── BENCHMARK: σ flexional con eje neutro asimétrico ──
  // Áreas por componente
  const A_inf = bf_inf * tb_inf;
  const A_w = tw * hw;
  const A_sup = bf_sup * tb_sup;
  const A_total = A_inf + A_w + A_sup;
  // Centroides z desde fibra inferior (z=0)
  const zc_inf = tb_inf / 2;
  const zc_w = tb_inf + hw / 2;
  const zc_sup = tb_inf + hw + tb_sup / 2;
  // Centroide global y_c
  const y_c = (A_inf * zc_inf + A_w * zc_w + A_sup * zc_sup) / A_total;
  // Inercias propias de cada parte respecto a su centroide local
  const I_inf_own = (bf_inf * tb_inf ** 3) / 12;
  const I_w_own = (tw * hw ** 3) / 12;
  const I_sup_own = (bf_sup * tb_sup ** 3) / 12;
  // Teorema de Steiner: I_total = Σ (I_own + A·d²)
  const I = I_inf_own + A_inf * (zc_inf - y_c) ** 2 +
            I_w_own + A_w * (zc_w - y_c) ** 2 +
            I_sup_own + A_sup * (zc_sup - y_c) ** 2;
  // Momento máx en el empotramiento: M = P · L (cantilever)
  const M_max = P * L;
  // Distancias a fibras extremas desde eje neutro
  const c_top = (tb_inf + hw + tb_sup) - y_c;  // hasta fibra superior
  const c_bot = y_c;                            // hasta fibra inferior
  // Tensiones flexionales: σ = M·c/I (positivo = tracción)
  // Para carga -Z en cantilever, fibra superior tracciona, inferior comprime.
  const sigma_top_an = (M_max * c_top) / I;
  const sigma_bot_an = -(M_max * c_bot) / I;
  // Deflexión punta E-B
  const delta_an = -(P * L * L * L) / (3 * Es * I);

  // σ máx Hekatan: max von Mises
  let sigma_max_he = 0;
  const vmMap = (analyzeOutputs as any)?.vonMises as Map<number, number[]> | undefined;
  if (vmMap) vmMap.forEach((arr) => arr.forEach((v) => { if (v > sigma_max_he) sigma_max_he = v; }));

  // δ Hekatan: max |Uz| en x=L
  let delta_he = 0;
  for (const id of tipNodes) {
    const u = deformOutputs.deformations?.get(id);
    if (u && Math.abs(u[2]) > Math.abs(delta_he)) delta_he = u[2];
  }
  const errPct = Math.abs(delta_he - delta_an) / Math.abs(delta_an || 1) * 100;

  benchValues.val = {
    A: A_total, y_c, I,
    M_max, sigma_top_an, sigma_bot_an,
    sigma_max_he, delta_an, delta_he, errPct,
  };

  nodesState.val = nodes;
  elementsState.val = elements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = elementInputs;
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
    gridSize: 2,
    deformScale: 50,
    loads: true,
    supports: true,
    displayScale: 0.4,
  },
});

// ── Tweakpane Benchmark ──
const benchContainer = document.createElement("div");
benchContainer.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
const benchPane = new Pane({ title: "🧪 Benchmark — viga doble T asim", container: benchContainer, expanded: true });
const benchObj = {
  A: 0, y_c: 0, I: 0, M_max: 0,
  sigma_top_an: 0, sigma_bot_an: 0, sigma_max_he: 0,
  delta_an: 0, delta_he: 0, errPct: 0, status: "—",
};
const fmtSci = (v: number) => v.toExponential(3);
const fmtFix4 = (v: number) => v.toFixed(4);

const fSec = benchPane.addFolder({ title: "Sección asimétrica" });
fSec.addBinding(benchObj, "A",   { readonly: true, label: "Área total (m²)", format: fmtSci });
fSec.addBinding(benchObj, "y_c", { readonly: true, label: "Centroide y_c (m)", format: fmtFix4 });
fSec.addBinding(benchObj, "I",   { readonly: true, label: "I (m⁴)", format: fmtSci });

const fAn = benchPane.addFolder({ title: "Analítico (Euler-Bernoulli)" });
fAn.addBinding(benchObj, "M_max",        { readonly: true, label: "M_max (kN·m)", format: fmtSci });
fAn.addBinding(benchObj, "sigma_top_an", { readonly: true, label: "σ top (kN/m²)", format: fmtSci });
fAn.addBinding(benchObj, "sigma_bot_an", { readonly: true, label: "σ bot (kN/m²)", format: fmtSci });
fAn.addBinding(benchObj, "delta_an",     { readonly: true, label: "δ punta (m)", format: fmtSci });

const fH = benchPane.addFolder({ title: "Hekatan Q4 (medido)" });
fH.addBinding(benchObj, "sigma_max_he", { readonly: true, label: "σ vM max (kN/m²)", format: fmtSci });
fH.addBinding(benchObj, "delta_he",     { readonly: true, label: "δ punta (m)", format: fmtSci });
fH.addBinding(benchObj, "errPct",       { readonly: true, label: "Δ vs E-B (%)", format: (v: number) => v.toFixed(2) });
fH.addBinding(benchObj, "status",       { readonly: true, label: "Status" });

const fU = benchPane.addFolder({ title: "Unidades color map", expanded: false });
const unitsObj = { stress: colorMapStressUnit.val, disp: colorMapDispUnit.val, force: colorMapForceUnit.val };
fU.addBinding(unitsObj, "stress", {
  options: { "kN/m²":"kN/m²", "kPa":"kPa", "MPa":"MPa", "GPa":"GPa", "kgf/cm²":"kgf/cm²", "tonf/m²":"tonf/m²", "ksi":"ksi", "psi":"psi" },
  label: "Tensión",
}).on("change", (e: any) => { colorMapStressUnit.val = e.value; });
fU.addBinding(unitsObj, "disp", {
  options: { m:"m", cm:"cm", mm:"mm", "µm":"µm" }, label: "Desplaz.",
}).on("change", (e: any) => { colorMapDispUnit.val = e.value; });
fU.addBinding(unitsObj, "force", {
  options: { kN:"kN", tonf:"tonf", kip:"kip" }, label: "Fuerza",
}).on("change", (e: any) => { colorMapForceUnit.val = e.value; });

document.body.append(benchContainer);

van.derive(() => {
  const v = benchValues.val;
  benchObj.A = v.A; benchObj.y_c = v.y_c; benchObj.I = v.I;
  benchObj.M_max = v.M_max;
  benchObj.sigma_top_an = v.sigma_top_an;
  benchObj.sigma_bot_an = v.sigma_bot_an;
  benchObj.sigma_max_he = v.sigma_max_he;
  benchObj.delta_an = v.delta_an; benchObj.delta_he = v.delta_he;
  benchObj.errPct = v.errPct;
  benchObj.status = v.errPct < 5 ? "✓ PASA (<5%)"
                  : v.errPct < 15 ? "⚠ ACEPTABLE (5-15%)"
                  : "✗ revisar (>15%)";
  benchPane.refresh();
});

document.body.append(
  getParameters(parameters),
  viewerEl,
  getToolbar({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/viga-doble-t/main.ts",
  }),
);

setTimeout(() => enableDraggableAllPanes(), 200);
setTimeout(() => {
  const ctx = (viewerEl as any).__ctx;
  if (ctx?.camera && ctx?.controls) {
    ctx.camera.up.set(0, 0, 1);
    ctx.camera.position.set(2.0, 3.0, 1.5);
    ctx.controls.target.set(2.0, 0, 0.25);
    ctx.controls.update();
    ctx.render?.();
  }
}, 800);
