/**
 * Torre retorcida (Turning Torso style), graduada al workspace (28-sep-2026).
 *
 * Anillos hexagonales (o el nº de columnas que se pida) que rotan progresivamente con la
 * altura (twist), conectados con columnas + diagonales que cruzan al siguiente nivel.
 * Núcleo central conectado a cada anillo + viga vertical de núcleo. Barras de 2 nudos,
 * `deform` + `analyze` de hekatan-fem.
 *
 * EL MODELO NO CAMBIA: viene tal cual de la página propia (antes de graduarlo,
 * `examples/src/twisted-tower/main.ts`), portada a su vez de FEM Studio
 * `generateTwistedTower()` (getCad3d.ts, líneas 10142-10241). Mismo orden de nudos, mismos
 * apoyos, misma carga nodal, misma sección (A e I fijas, no eran parámetros en la página vieja).
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
const A = 80e-4, I = 1000e-8; // sección fija, como en la página original (no era parámetro)

export interface TwistedTowerMallaParams {
  nFloors: number;
  H_floor: number;
  R: number;
  nCols: number;
  twistPerFloor: number;
  windFactor: number;
}

export interface TwistedTowerMalla {
  nodes: Node[];
  elements: Element[];
  supports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
  loads: Map<number, [number, number, number, number, number, number]>;
  nFloors: number;
  nCols: number;
  coreStart: number;
}

/**
 * Malla pura: anillos con twist progresivo + columnas + diagonales + núcleo central.
 * Sin estados ni DOM — la usan el ejemplo y su test.
 */
export function mallaTwistedTower(p: TwistedTowerMallaParams): TwistedTowerMalla {
  const nFloors = Math.round(p.nFloors);
  const H_floor = p.H_floor;
  const R = p.R;
  const nCols = Math.round(p.nCols);
  const twistPerFloor = p.twistPerFloor;
  const windFactor = p.windFactor;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // Anillos rotantes con twist
  for (let iz = 0; iz <= nFloors; iz++) {
    const z = iz * H_floor;
    const angle0 = (iz * twistPerFloor * Math.PI) / 180;
    for (let ic = 0; ic < nCols; ic++) {
      const angle = angle0 + (2 * Math.PI * ic) / nCols;
      nodes.push([R * Math.cos(angle), R * Math.sin(angle), z]);
    }
  }

  // Vigas de anillo + columnas + diagonales
  for (let iz = 0; iz <= nFloors; iz++) {
    const base = iz * nCols;
    for (let ic = 0; ic < nCols; ic++) {
      elements.push([base + ic, base + ((ic + 1) % nCols)]); // anillo
    }
    if (iz < nFloors) {
      const next = (iz + 1) * nCols;
      for (let ic = 0; ic < nCols; ic++) {
        elements.push([base + ic, next + ic]); // columna
        elements.push([base + ic, next + ((ic + 1) % nCols)]); // diagonal
      }
    }
  }

  // Núcleo central
  const coreStart = (nFloors + 1) * nCols;
  for (let iz = 0; iz <= nFloors; iz++) {
    nodes.push([0, 0, iz * H_floor]);
    const base = iz * nCols;
    for (let ic = 0; ic < nCols; ic++) {
      elements.push([coreStart + iz, base + ic]);
    }
  }
  for (let iz = 0; iz < nFloors; iz++) {
    elements.push([coreStart + iz, coreStart + iz + 1]);
  }

  // Apoyos en la base (iz=0)
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let ic = 0; ic < nCols; ic++) supports.set(ic, [true, true, true, true, true, true]);
  supports.set(coreStart, [true, true, true, true, true, true]);

  // Cargas: viento creciente con altura + gravedad
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let iz = 1; iz <= nFloors; iz++) {
    const Fw = (windFactor * iz) / nFloors;
    const base = iz * nCols;
    for (let ic = 0; ic < nCols; ic++) {
      loads.set(base + ic, [Fw, 0, -5, 0, 0, 0]);
    }
  }

  return { nodes, elements, supports, loads, nFloors, nCols, coreStart };
}

/** Resumen de ingeniería a partir de los `states` ya resueltos — folder «📊 Calculados». */
function resumenTwistedTower(states: BuildStates): Record<string, string> {
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

export const twistedTower: ExampleDef = {
  id: "twisted-tower",
  name: "Torre Retorcida",
  // solo barras: la categoría la manda el tipo de elemento MEDIDO, no el tema
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  defaultFrameResult: "contour:normals",
  params: {
    nFloors:       P("Geometría", "Pisos", 12, 4, 30, 1),
    H_floor:       P("Geometría", "Altura piso (m)", 3.5, 2, 6, 0.5),
    R:             P("Geometría", "Radio anillo (m)", 5, 2, 15, 0.5),
    nCols:         P("Geometría", "Columnas / piso", 6, 4, 12, 1),
    twistPerFloor: P("Torsión", "Twist por piso (°)", 5, 0, 20, 1),
    windFactor:    P("Cargas", "Carga viento top (kN)", 10, 0, 50, 2),
  },
  guide: [
    "Cada piso es un anillo de columnas que gira «twistPerFloor» grados respecto al anterior",
    "El núcleo central (eje z) va atado a cada anillo y queda empotrado en la base",
    "El viento crece linealmente con la altura y se reparte entre las columnas de cada piso",
    "En 📊 Calculados: reacciones, flecha máxima y el axil extremo de toda la malla",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaTwistedTower({
      nFloors: p.nFloors, H_floor: p.H_floor, R: p.R, nCols: p.nCols,
      twistPerFloor: p.twistPerFloor, windFactor: p.windFactor,
    });
    const { nodes, elements, supports, loads } = malla;

    const nodeInputs: NodeInputs = { supports, loads };
    const elementInputs: ElementInputs = {
      elasticities:       new Map(elements.map((_, i) => [i, Es])),
      shearModuli:        new Map(elements.map((_, i) => [i, Gs])),
      areas:              new Map(elements.map((_, i) => [i, A])),
      momentsOfInertiaY:  new Map(elements.map((_, i) => [i, I])),
      momentsOfInertiaZ:  new Map(elements.map((_, i) => [i, I])),
      torsionalConstants: new Map(elements.map((_, i) => [i, 2 * I])),
      densities:          new Map(elements.map((_, i) => [i, rho_s])),
      poissonsRatios:     new Map(elements.map((_, i) => [i, nu_s])),
    };

    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
      analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    } catch (e: any) {
      console.warn("Twisted Tower deform/analyze:", e?.message ?? e);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs;
    states.elementInputs.val = elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = [];
  },
  computedLabels: (_params: Record<string, number>, states: BuildStates) => resumenTwistedTower(states),
};
