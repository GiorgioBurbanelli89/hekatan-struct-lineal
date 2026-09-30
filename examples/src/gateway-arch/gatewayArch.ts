/**
 * Gateway Arch — arco catenario/parabólico (St. Louis), graduado al workspace (28-sep-2026).
 *
 * 2 arcos paralelos en Y conectados por transversales y X-bracing. Curva del arco:
 * parábola simplificada z(x) = H · (1 − (2x/span − 1)²). Barras de 2 nudos, `deform` +
 * `analyze` de hekatan-fem.
 *
 * EL MODELO NO CAMBIA: viene tal cual de la página propia (antes de graduarlo,
 * `examples/src/gateway-arch/main.ts`), portada a su vez de FEM Studio
 * `generateGatewayArch()` (getCad3d.ts, líneas 9967-10031). Mismo orden de nudos, mismos
 * apoyos, misma carga nodal, mismas propiedades de barra.
 */
import type {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";

const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 7.85;   // MASA del acero en t/m³ (kN·s²/m⁴). Iba 78 = su PESO en kN/m³: 10 veces de más (29-sep-2026)

export interface GatewayArchMallaParams {
  H: number;
  span: number;
  depth: number;
  nDiv: number;
  load: number;
}

export interface GatewayArchMalla {
  nodes: Node[];
  elements: Element[];
  supports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
  loads: Map<number, [number, number, number, number, number, number]>;
  nDiv: number;
}

/**
 * Malla pura: 2 arcos parabólicos paralelos (Y = ±depth/2) + transversales + X-bracing.
 * Sin estados ni DOM — la usan el ejemplo y su test.
 */
export function mallaGatewayArch(p: GatewayArchMallaParams): GatewayArchMalla {
  const nDiv = Math.round(p.nDiv);
  const { H, span, depth, load } = p;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // 2 arcos paralelos (front + back en Y)
  for (let i = 0; i <= nDiv; i++) {
    const t = i / nDiv;
    const x = span * t;
    const z = H * (1 - Math.pow(2 * t - 1, 2));
    nodes.push([x, -depth / 2, z]);
    nodes.push([x, depth / 2, z]);
  }

  // Elementos de cada arco + bracing
  for (let i = 0; i < nDiv; i++) {
    elements.push([i * 2, (i + 1) * 2]); // arco frontal
    elements.push([i * 2 + 1, (i + 1) * 2 + 1]); // arco trasero
    elements.push([i * 2, i * 2 + 1]); // transversal
    elements.push([i * 2, (i + 1) * 2 + 1]); // X-brace
    elements.push([i * 2 + 1, (i + 1) * 2]); // X-brace
  }
  elements.push([nDiv * 2, nDiv * 2 + 1]); // último transversal

  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  supports.set(0, [true, true, true, true, true, true]);
  supports.set(1, [true, true, true, true, true, true]);
  supports.set(nDiv * 2, [true, true, true, true, true, true]);
  supports.set(nDiv * 2 + 1, [true, true, true, true, true, true]);

  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let i = 0; i <= nDiv; i++) {
    loads.set(i * 2, [0, 0, load, 0, 0, 0]);
    loads.set(i * 2 + 1, [0, 0, load, 0, 0, 0]);
  }

  return { nodes, elements, supports, loads, nDiv };
}

/** Resumen de ingeniería a partir de los `states` ya resueltos — folder «📊 Calculados». */
function resumenGatewayArch(states: BuildStates): Record<string, string> {
  const nodes = states.nodes.val ?? [];
  const elements = states.elements.val ?? [];
  const ni = states.nodeInputs.val ?? {};
  const def = states.deformOutputs.val ?? {};
  const an = states.analyzeOutputs.val ?? {};

  const out: Record<string, string> = {
    "Nudos": String(nodes.length),
    "Barras": String(elements.length),
  };

  let cargaTotal = 0;
  if (ni.loads) for (const [, v] of ni.loads) cargaTotal += Math.hypot(v[0], v[1], v[2]);
  out["Carga total aplicada"] = `${cargaTotal.toFixed(2)} kN`;

  let sumRz = 0;
  if (def.reactions) for (const [, v] of def.reactions) sumRz += v[2];
  out["Suma reacciones verticales"] = `${sumRz.toFixed(2)} kN`;

  let dMax = 0, nodoDMax = -1;
  if (def.deformations) {
    for (const [n, v] of def.deformations) {
      const d = Math.hypot(v[0], v[1], v[2]);
      if (d > dMax) { dMax = d; nodoDMax = n; }
    }
  }
  out["Desplazamiento máximo"] = nodoDMax >= 0
    ? `${(dMax * 1000).toFixed(3)} mm (nudo ${nodoDMax}, x=${nodes[nodoDMax][0].toFixed(2)} z=${nodes[nodoDMax][2].toFixed(2)})`
    : "—";

  let nMax = -Infinity, nMin = Infinity;
  if (an.normals) for (const [, v] of an.normals) for (const val of v) { if (val > nMax) nMax = val; if (val < nMin) nMin = val; }
  out["Axil máximo (tracción)"] = isFinite(nMax) ? `${nMax.toFixed(2)} kN` : "—";
  out["Axil mínimo (compresión)"] = isFinite(nMin) ? `${nMin.toFixed(2)} kN` : "—";

  return out;
}

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const gatewayArch: ExampleDef = {
  id: "gateway-arch",
  name: "Gateway Arch",
  // solo barras (101): la categoría la manda el tipo de elemento MEDIDO, no el tema
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  defaultFrameResult: "contour:normals",
  params: {
    H:     P("Geometría", "Altura H (m)", 20, 5, 50, 1),
    span:  P("Geometría", "Luz (m)", 20, 5, 60, 1),
    depth: P("Geometría", "Profundidad arcos (m)", 2, 0.5, 8, 0.5),
    nDiv:  P("Malla", "Subdivisiones", 20, 6, 50, 1),
    A:     P("Sección", "Área (m²)", 100e-4, 10e-4, 500e-4, 10e-4),
    I:     P("Sección", "Inercia (m⁴)", 500e-8, 50e-8, 5000e-8, 50e-8),
    load:  P("Cargas", "Carga por nodo (kN)", -20, -100, 0, 5),
  },
  guide: [
    "Dos arcos parabólicos paralelos en Y, unidos por transversales y bracing en X",
    "Los 4 nudos de la base (ambos arcos, los dos extremos) quedan empotrados",
    "La carga vertical entra en TODOS los nudos de los dos arcos",
    "En 📊 Calculados: reacciones, flecha máxima y el axil extremo de toda la malla",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaGatewayArch({ H: p.H, span: p.span, depth: p.depth, nDiv: p.nDiv, load: p.load });
    const { nodes, elements, supports, loads } = malla;

    const nodeInputs: NodeInputs = { supports, loads };
    const elementInputs: ElementInputs = {
      elasticities:       new Map(elements.map((_, i) => [i, Es])),
      shearModuli:        new Map(elements.map((_, i) => [i, Gs])),
      areas:              new Map(elements.map((_, i) => [i, p.A])),
      momentsOfInertiaY:  new Map(elements.map((_, i) => [i, p.I])),
      momentsOfInertiaZ:  new Map(elements.map((_, i) => [i, p.I])),
      torsionalConstants: new Map(elements.map((_, i) => [i, 2 * p.I])),
      densities:          new Map(elements.map((_, i) => [i, rho_s])),
      poissonsRatios:     new Map(elements.map((_, i) => [i, nu_s])),
    };

    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
      analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    } catch (e: any) {
      console.warn("Gateway Arch deform/analyze:", e?.message ?? e);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs;
    states.elementInputs.val = elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = [];
  },
  computedLabels: (_params: Record<string, number>, states: BuildStates) => resumenGatewayArch(states),
};
