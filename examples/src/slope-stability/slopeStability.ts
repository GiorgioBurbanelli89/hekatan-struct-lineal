/**
 * Estabilidad de talud — método de reducción de resistencia (SRM), Mohr-Coulomb.
 *
 * Geometría: talud de altura H, ángulo α°, banco superior bTop e inferior bBot; profundidad
 * bajo el pie igual a H. Polígono cerrado en sentido antihorario:
 *   [0,−D] → [W,−D] → [W,H] → [bBot + H/tanα, H] → [bBot, 0] → [0,0]
 *
 * Malla de triángulos con `getMesh` (hekatan-mesh). Apoyos: fondo fijo, lados con rodillo
 * (ux = 0). El solver C++ `slopeSRM` reduce c y tanφ por el factor SRF desde 0.5 en pasos de
 * 0.1 (hasta 5.0) y, al primer paso que no converge, biseca 8 veces: el factor de seguridad
 * es el último SRF que converge. Devuelve el FS, los desplazamientos y la deformación
 * plástica equivalente por elemento (no devuelve cuántos pasos dio).
 *
 * Vista: el plano del talud (x, y) se dibuja en el plano vertical (x, z) del visor, y la
 * deformación plástica va por el canal de colormap «membraneXX» (tres vértices, mismo valor).
 *
 * Portado desde FEM Studio `generateSlope()` en getCad3d.ts. Desde el 28-sep-2026 corre dentro
 * del workspace; el modelo (malla, apoyos, material, llamada al solver) es el mismo de la página.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type { Node, Element, DeformOutputs, AnalyzeOutputs } from "hekatan-fem";
import { slopeSRM } from "hekatan-fem";
import { getMesh } from "hekatan-mesh";

export interface TaludParams {
  H: number; angle: number; bTop: number; bBot: number; meshSize: number;
  E: number; nu: number; gamma: number; c: number; phi: number; qs: number;
}

export const TALUD_DEFAULT: TaludParams = {
  H: 6, angle: 45, bTop: 3, bBot: 3, meshSize: 2.0,
  E: 50000, nu: 0.3, gamma: 18, c: 15, phi: 30, qs: 0,
};

export interface TaludMalla {
  /** Nudos en el plano del talud (x, y, 0), tal como salen de getMesh. */
  meshNodes: Node[];
  elements: Element[];
  srmSupports: { node: number; fixX: boolean; fixY: boolean }[];
  viewSupports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
  surfaceYThreshold: number;
  totalW: number;
  D: number;
}

/** La malla, pura (sin estados ni DOM): la misma cuenta que llevaba la página. */
export function mallaTalud(p: TaludParams): TaludMalla {
  const { H, angle, bTop, bBot, meshSize } = p;
  const slopeRun = H / Math.tan((angle * Math.PI) / 180);
  const totalW = bBot + slopeRun + bTop;
  const D = H; // profundidad bajo el pie

  const pts: [number, number, number][] = [
    [0, -D, 0],                  // 0: fondo izquierdo
    [totalW, -D, 0],             // 1: fondo derecho
    [totalW, H, 0],              // 2: coronación derecha
    [bBot + slopeRun, H, 0],     // 3: borde de la coronación
    [bBot, 0, 0],                // 4: pie del talud
    [0, 0, 0],                   // 5: superficie izquierda (a nivel del pie)
  ];

  const result = getMesh({
    points: pts,
    polygon: [0, 1, 2, 3, 4, 5],
    maxMeshSize: meshSize,
  });
  const meshNodes = result.nodes;
  const elements = result.elements;

  // Apoyos: fondo fijo, lados con rodillo en X
  const srmSupports: { node: number; fixX: boolean; fixY: boolean }[] = [];
  const viewSupports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let i = 0; i < meshNodes.length; i++) {
    const x = meshNodes[i][0];
    const y = meshNodes[i][1];
    if (Math.abs(y + D) < 1e-6) {
      srmSupports.push({ node: i, fixX: true, fixY: true });
      viewSupports.set(i, [true, true, true, true, true, true]);
    } else if (Math.abs(x) < 1e-6 || Math.abs(x - totalW) < 1e-6) {
      srmSupports.push({ node: i, fixX: true, fixY: false });
      viewSupports.set(i, [true, false, true, true, true, true]);
    }
  }

  const surfaceYThreshold = H - meshSize * 0.3;
  return { meshNodes, elements, srmSupports, viewSupports, surfaceYThreshold, totalW, D };
}

export interface TaludResultado {
  ok: boolean;
  error?: string;
  fos: number;
  maxDisp: number;
  maxPlastic: number;
  viewDeforms: Map<number, [number, number, number, number, number, number]>;
  plasticMap: Map<number, [number, number, number]>;
}

/** La llamada al solver de la página, con sus mismos argumentos. */
export function resolverTalud(p: TaludParams, m: TaludMalla): TaludResultado {
  const out: TaludResultado = {
    ok: false, fos: NaN, maxDisp: 0, maxPlastic: 0, viewDeforms: new Map(), plasticMap: new Map(),
  };
  try {
    const nodes2D: [number, number][] = m.meshNodes.map((n) => [n[0], n[1]]);
    const tris: [number, number, number][] = m.elements.map(
      (el: number[]) => [el[0], el[1], el[2]] as [number, number, number],
    );
    const result = slopeSRM({
      nodes: nodes2D,
      elements: tris,
      E: p.E, nu: p.nu, gamma: p.gamma, c: p.c, phi: p.phi,
      thickness: 1.0,
      supports: m.srmSupports,
      surcharge: p.qs,
      surfaceYThreshold: m.surfaceYThreshold,
    });
    // Desplazamientos 2D → 6 GDL, la y del talud pasa a la z del visor
    for (let i = 0; i < result.displacements.length; i++) {
      const [ux, uy] = result.displacements[i];
      out.viewDeforms.set(i, [ux, 0, uy, 0, 0, 0]);
    }
    // Deformación plástica por elemento → los 3 vértices con el mismo valor
    for (let e = 0; e < result.plasticStrain.length; e++) {
      const eps = result.plasticStrain[e];
      out.plasticMap.set(e, [eps, eps, eps]);
    }
    for (const [ux, uy] of result.displacements) {
      out.maxDisp = Math.max(out.maxDisp, Math.sqrt(ux * ux + uy * uy));
    }
    for (const eps of result.plasticStrain) out.maxPlastic = Math.max(out.maxPlastic, eps);
    out.fos = result.fos;
    out.ok = true;
  } catch (e: any) {
    out.error = e?.message ?? String(e);
    console.warn("Talud SRM failed:", out.error);
  }
  return out;
}

/** El aviso de la página, en palabras. */
export function veredictoTalud(fos: number): string {
  if (fos === -1) return "el solver no pudo factorizar K";
  if (fos === 99) return "sin fuerzas exteriores";
  // El solver empieza en SRF = 0.5: si ni ahí converge, devuelve 0.5 igual (FS ≤ 0.5).
  if (fos <= 0.5) return "inestable (FS ≤ 0.5, el arranque de la búsqueda)";
  if (fos < 1.0) return "inestable (FS < 1.0)";
  if (fos < 1.5) return "por debajo del mínimo habitual (1.0 ≤ FS < 1.5)";
  return "estable (FS ≥ 1.5)";
}

const D0 = TALUD_DEFAULT;
const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

let ultimo: { p: TaludParams; malla: TaludMalla; res: TaludResultado } | null = null;

export const slopeStability: ExampleDef = {
  id: "slope-stability",
  name: "Estabilidad de Talud (SRM)",
  category: "2️⃣ Shells · 🕸 Membranas",
  benchmark: false,
  defaultShellResult: "membraneXX",
  params: {
    H:        P("Geometría", "Altura H (m)", D0.H, 1, 25, 0.5),
    angle:    P("Geometría", "Ángulo (°)", D0.angle, 20, 80, 1),
    bTop:     P("Geometría", "Banco superior (m)", D0.bTop, 1, 15, 0.5),
    bBot:     P("Geometría", "Banco inferior (m)", D0.bBot, 1, 15, 0.5),
    meshSize: P("Malla", "Tamaño de malla (m)", D0.meshSize, 0.5, 5, 0.25),
    E:        P("Material", "E (kPa)", D0.E, 1000, 500000, 1000),
    nu:       P("Material", "ν", D0.nu, 0.0, 0.49, 0.05),
    gamma:    P("Material", "γ (kN/m³)", D0.gamma, 12, 25, 0.5),
    c:        P("Material", "Cohesión c (kPa)", D0.c, 0, 100, 1),
    phi:      P("Material", "Fricción φ (°)", D0.phi, 0, 45, 1),
    qs:       P("Cargas", "Sobrecarga (kN/m²)", D0.qs, 0, 100, 5),
  },
  guide: [
    "El solver reduce c y tanφ hasta que el talud deja de converger: ese factor es el FS",
    "El colormap («membraneXX») es la deformación plástica equivalente: marca la superficie de falla",
    "La sobrecarga actúa sobre la coronación",
    "Con una malla más fina la banda plástica se define mejor (y tarda más)",
  ],
  build: (params: Record<string, number>, states: BuildStates) => {
    const p: TaludParams = {
      H: params.H, angle: params.angle, bTop: params.bTop, bBot: params.bBot, meshSize: params.meshSize,
      E: params.E, nu: params.nu, gamma: params.gamma, c: params.c, phi: params.phi, qs: params.qs,
    };
    let malla: TaludMalla;
    try {
      malla = mallaTalud(p);
    } catch (e: any) {
      console.warn("getMesh failed:", e?.message ?? e);
      ultimo = null;
      return;
    }
    const res = resolverTalud(p, malla);
    ultimo = { p, malla, res };
    // Nudos (x, y) → (x, 0, y) para verlo en vertical con Z hacia arriba
    const viewNodes: Node[] = malla.meshNodes.map((n) => [n[0], 0, n[1]] as Node);
    states.nodes.val = viewNodes;
    states.elements.val = malla.elements;
    states.nodeInputs.val = { supports: malla.viewSupports };
    states.elementInputs.val = {};
    states.deformOutputs.val = { deformations: res.viewDeforms } as DeformOutputs;
    states.analyzeOutputs.val = { membraneXX: res.plasticMap } as AnalyzeOutputs;
  },
  computedLabels: () => {
    if (!ultimo) return { "Malla": "getMesh falló" };
    const { malla, res } = ultimo;
    const out: Record<string, string> = {
      "Nudos": String(malla.meshNodes.length),
      "Triángulos": String(malla.elements.length),
      "Ancho W × profundidad D": `${malla.totalW.toFixed(2)} × ${malla.D.toFixed(2)} m`,
    };
    if (!res.ok) { out["Solver"] = `falló: ${res.error ?? "?"}`; return out; }
    out["Factor de seguridad FS (SRM)"] = res.fos.toFixed(3);
    out["Veredicto"] = veredictoTalud(res.fos);
    out["|u| máximo (en SRF = FS)"] = `${(res.maxDisp * 1000).toFixed(3)} mm`;
    out["ε plástica equivalente máx"] = res.maxPlastic.toExponential(3);
    out["Búsqueda del SRF"] = "0.5 → 5.0 en pasos de 0.1 + 8 bisecciones";
    return out;
  },
};
