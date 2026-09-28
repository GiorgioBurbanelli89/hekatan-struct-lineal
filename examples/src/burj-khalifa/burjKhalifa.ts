/**
 * Burj Khalifa style — torre escalonada con planta en Y (3 alas), graduada al workspace
 * (28-sep-2026).
 *
 * Reducción de radio con la altura + dos setbacks (40 % y 70 % de altura) que reducen el
 * radio adicional. 3 alas a 120° conectan núcleo y extremos con punto medio (buttress) y
 * diagonales en cada ala. Barras de 2 nudos, `deform` + `analyze` de hekatan-fem.
 * Material: hormigón armado (E = 35 GPa).
 *
 * EL MODELO NO CAMBIA: viene tal cual de la página propia (antes de graduarlo,
 * `examples/src/burj-khalifa/main.ts`), portada a su vez de FEM Studio
 * `generateBurjKhalifa()` (getCad3d.ts, líneas 10244-10319). Mismo orden de nudos, mismos
 * apoyos, misma carga nodal, misma sección (A e I fijas, no eran parámetros en la página vieja).
 */
import type {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";

const Ec = 35e6; // hormigón kN/m²
const nu_c = 0.2;
const Gc = Ec / (2 * (1 + nu_c));
const rho_c = 24 / 9.81; // ton/m³
const A = 200e-4, I = 5000e-8; // sección fija, como en la página original (no era parámetro)
const nWings = 3;

export interface BurjKhalifaMallaParams {
  nFloors: number;
  H_floor: number;
  baseR: number;
  windFactor: number;
}

export interface BurjKhalifaMalla {
  nodes: Node[];
  elements: Element[];
  supports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
  loads: Map<number, [number, number, number, number, number, number]>;
  nFloors: number;
  nodesPerFloor: number;
}

/**
 * Malla pura: torre de 3 alas con setbacks + núcleo + buttress + diagonales por ala.
 * Sin estados ni DOM — la usan el ejemplo y su test.
 */
export function mallaBurjKhalifa(p: BurjKhalifaMallaParams): BurjKhalifaMalla {
  const nFloors = Math.round(p.nFloors);
  const H_floor = p.H_floor;
  const baseR = p.baseR;
  const windFactor = p.windFactor;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  for (let iz = 0; iz <= nFloors; iz++) {
    const t = iz / nFloors;
    const z = iz * H_floor;
    // Setbacks: reducción de radio
    let R = baseR * (1 - t * 0.7);
    if (t > 0.4) R *= 0.85; // primer setback
    if (t > 0.7) R *= 0.7; // segundo setback

    const coreIdx = nodes.length;
    nodes.push([0, 0, z]);

    // 3 alas (puntas + midpoints)
    for (let w = 0; w < nWings; w++) {
      const angle = (w * 2 * Math.PI) / nWings - Math.PI / 2;
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);
      const tipIdx = nodes.length;
      nodes.push([x, y, z]);
      elements.push([coreIdx, tipIdx]);
      const midIdx = nodes.length;
      nodes.push([x * 0.5, y * 0.5, z]);
      elements.push([coreIdx, midIdx]);
      elements.push([midIdx, tipIdx]);
    }

    // Perímetro: conectar puntas
    for (let w = 0; w < nWings; w++) {
      const tip1 = coreIdx + 1 + w * 2;
      const tip2 = coreIdx + 1 + ((w + 1) % nWings) * 2;
      elements.push([tip1, tip2]);
    }

    // Columnas al siguiente piso
    if (iz < nFloors) {
      const nodesPerFloor = 1 + nWings * 2;
      const nextCore = coreIdx + nodesPerFloor;
      elements.push([coreIdx, nextCore]); // núcleo
      for (let w = 0; w < nWings; w++) {
        elements.push([coreIdx + 1 + w * 2, nextCore + 1 + w * 2]); // tip
        elements.push([coreIdx + 2 + w * 2, nextCore + 2 + w * 2]); // mid
        elements.push([coreIdx + 1 + w * 2, nextCore + 2 + w * 2]); // diagonal
      }
    }
  }

  const nodesPerFloor = 1 + nWings * 2;
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let i = 0; i < nodesPerFloor; i++) {
    supports.set(i, [true, true, true, true, true, true]);
  }

  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let iz = 1; iz <= nFloors; iz++) {
    const base = iz * nodesPerFloor;
    const Fw = (windFactor * iz) / nFloors;
    loads.set(base, [Fw, 0, -10, 0, 0, 0]);
  }

  return { nodes, elements, supports, loads, nFloors, nodesPerFloor };
}

/** Resumen de ingeniería a partir de los `states` ya resueltos — folder «📊 Calculados». */
function resumenBurjKhalifa(states: BuildStates): Record<string, string> {
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
    ? `${(dMax * 1000).toFixed(3)} mm (nudo ${nodoDMax}, z=${nodes[nodoDMax][2].toFixed(2)} m)`
    : "—";

  let nMax = -Infinity, nMin = Infinity;
  if (an.normals) for (const [, v] of an.normals) for (const val of v) { if (val > nMax) nMax = val; if (val < nMin) nMin = val; }
  out["Axil máximo (tracción)"] = isFinite(nMax) ? `${nMax.toFixed(2)} kN` : "—";
  out["Axil mínimo (compresión)"] = isFinite(nMin) ? `${nMin.toFixed(2)} kN` : "—";

  return out;
}

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const burjKhalifa: ExampleDef = {
  id: "burj-khalifa",
  name: "Burj Khalifa style",
  category: "4️⃣ Mixtos · 🌉 Puentes e icónicos",
  defaultFrameResult: "contour:normals",
  params: {
    nFloors:    P("Geometría", "Pisos", 20, 8, 50, 1),
    H_floor:    P("Geometría", "Altura piso (m)", 3, 2.5, 6, 0.5),
    baseR:      P("Geometría", "Radio base (m)", 8, 4, 20, 1),
    windFactor: P("Cargas", "Carga viento top (kN)", 5, 0, 30, 1),
  },
  guide: [
    "Planta en Y: 3 alas a 120° con núcleo central, cada ala con su punto medio (buttress)",
    "El radio se reduce con la altura y dos setbacks (40 % y 70 % de la altura total)",
    "Los nudos del piso 0 (núcleo + 6 puntos de ala) quedan empotrados",
    "En 📊 Calculados: reacciones, flecha máxima y el axil extremo de toda la malla",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaBurjKhalifa({
      nFloors: p.nFloors, H_floor: p.H_floor, baseR: p.baseR, windFactor: p.windFactor,
    });
    const { nodes, elements, supports, loads } = malla;

    const nodeInputs: NodeInputs = { supports, loads };
    const elementInputs: ElementInputs = {
      elasticities:       new Map(elements.map((_, i) => [i, Ec])),
      shearModuli:        new Map(elements.map((_, i) => [i, Gc])),
      areas:              new Map(elements.map((_, i) => [i, A])),
      momentsOfInertiaY:  new Map(elements.map((_, i) => [i, I])),
      momentsOfInertiaZ:  new Map(elements.map((_, i) => [i, I])),
      torsionalConstants: new Map(elements.map((_, i) => [i, 2 * I])),
      densities:          new Map(elements.map((_, i) => [i, rho_c])),
      poissonsRatios:     new Map(elements.map((_, i) => [i, nu_c])),
    };

    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
      analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    } catch (e: any) {
      console.warn("Burj Khalifa deform/analyze:", e?.message ?? e);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs;
    states.elementInputs.val = elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = [];
  },
  computedLabels: (_params: Record<string, number>, states: BuildStates) => resumenBurjKhalifa(states),
};
