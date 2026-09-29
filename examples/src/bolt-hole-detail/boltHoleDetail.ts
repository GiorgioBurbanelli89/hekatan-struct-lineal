/**
 * Detalle Perno + Orificio — concentración de tensiones alrededor del agujero.
 *
 * Modelo simplificado de una porción de placa cuadrada con orificio circular
 * central por donde pasa un perno de anclaje. La placa se modela con shells Q4
 * en plano XY. La malla se construye en coordenadas POLARES (anular) para que
 * el orificio sea EXACTAMENTE circular sin "stair-stepping".
 *
 * Elementos:
 *   - Placa: anular Q4 mesh (radial × angular)
 *   - Perno: frame element vertical pasando por el centro del orificio,
 *     conectado a los nodos del borde interno del orificio (rigid spider)
 *
 * Cargas: tracción uniforme en los bordes opuestos de la placa (caso clásico
 * de Kirsch — concentración de tensiones teórica Kt = 3 en placa INFINITA).
 *
 * Kt MEDIDO (nuevo, 28-sep-2026): la página vieja nunca calculaba Kt en pantalla.
 * Aquí se mide como σ_vM máxima en el borde del orificio / σ_nominal, con
 * σ_nominal = Pull / (L · t_plate) (área bruta de la placa, sin descontar el
 * agujero). El valor de referencia Kt=3.00 es el de Kirsch (1898) para una
 * placa INFINITA con carga uniaxial remota; esta placa es FINITA (L/d_hole
 * finito) y la malla es gruesa cerca del borde exterior, así que el número
 * medido no tiene por qué salir exactamente 3.00 — se reporta tal cual da.
 *
 * NOTA (heredada, no corregida): en el `.heks`/elementInputs de este ejemplo
 * `momentsOfInertiaY` recibe el mapa llamado `Iz` y `momentsOfInertiaZ` recibe
 * el mapa llamado `Iy` (nombres cruzados). No afecta el resultado — la placa
 * es shell (I no se usa) y el perno es un frame circular con Iy=Iz=I_bolt — pero
 * queda igual que la página original porque el modelo NO se toca al graduar.
 *
 * Graduado el 28-sep-2026 desde `main.ts` (página con panel propio).
 * Categoría: aunque el registro viejo lo archivaba en "3️⃣ Sólidos", este
 * modelo NO tiene hexaedros — es shells (placa) + frames (perno) — así que
 * pasa a "2️⃣ Shells · 🔩 Conexiones".
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type { Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs } from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import * as THREE from "three";

const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;

export interface BoltHoleParams {
  L: number; t_plate: number; d_hole: number; d_bolt: number; L_bolt: number;
  nRadial: number; nTheta: number; Pull: number;
}

export interface BoltHoleMalla {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  holeRing: number[];      // nodos del borde interno del orificio (r = r_hole)
  decorators: THREE.Object3D[];
  L: number; t_plate: number; d_hole: number; Pull: number;
}

/** Malla pura (placa anular + perno), sin estados ni DOM. */
export function mallaBoltHole(p: BoltHoleParams): BoltHoleMalla {
  const { L, t_plate, d_hole, d_bolt, L_bolt, Pull } = p;
  const nR = Math.round(p.nRadial);
  const nT = Math.round(p.nTheta);

  const r_hole = d_hole / 2;
  const r_outer = L / 2;  // radio del círculo inscrito en el cuadrado (aproximación)

  const nodes: Node[] = [];
  const elements: Element[] = [];
  const thicknesses = new Map<number, number>();
  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iz = new Map<number, number>();
  const Iy = new Map<number, number>();
  const J = new Map<number, number>();
  const shearModuli = new Map<number, number>();

  function addNode(x: number, y: number, z: number): number {
    nodes.push([x, y, z]);
    return nodes.length - 1;
  }
  function addShell(n0: number, n1: number, n2: number, n3: number, t: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    thicknesses.set(i, t);
    elasticities.set(i, Es);
    poissonsRatios.set(i, nu_s);
    densities.set(i, rho_s);
    areas.set(i, 0); Iy.set(i, 0); Iz.set(i, 0); J.set(i, 0);
    shearModuli.set(i, Gs);
  }
  function addFrame(n0: number, n1: number, A: number, II: number, JJ: number) {
    elements.push([n0, n1]);
    const i = elements.length - 1;
    elasticities.set(i, Es); shearModuli.set(i, Gs);
    poissonsRatios.set(i, nu_s); densities.set(i, rho_s);
    areas.set(i, A); Iy.set(i, II); Iz.set(i, II); J.set(i, JJ);
    thicknesses.set(i, 0);
  }

  // ── PLACA ANULAR (mesh polar) ──
  const grid: number[][] = []; // grid[ir][it]
  for (let ir = 0; ir <= nR; ir++) {
    const r = r_hole + (ir / nR) * (r_outer - r_hole);
    const row: number[] = [];
    for (let it = 0; it < nT; it++) {
      const angle = (it / nT) * 2 * Math.PI;
      row.push(addNode(r * Math.cos(angle), r * Math.sin(angle), 0));
    }
    grid.push(row);
  }
  for (let ir = 0; ir < nR; ir++) {
    for (let it = 0; it < nT; it++) {
      const itNext = (it + 1) % nT;
      addShell(
        grid[ir][it], grid[ir][itNext],
        grid[ir + 1][itNext], grid[ir + 1][it],
        t_plate,
      );
    }
  }

  // ── PERNO (frame vertical por el centro del orificio) ──
  const A_bolt = Math.PI * d_bolt * d_bolt / 4;
  const I_bolt = Math.PI * Math.pow(d_bolt, 4) / 64;
  const J_bolt = 2 * I_bolt;

  const boltBottom = addNode(0, 0, -L_bolt / 2);
  const boltCenter = addNode(0, 0, 0);                 // en el plano de la placa
  const boltTop = addNode(0, 0, L_bolt / 2);

  addFrame(boltBottom, boltCenter, A_bolt, I_bolt, J_bolt);
  addFrame(boltCenter, boltTop,    A_bolt, I_bolt, J_bolt);

  // Spider rigid: frames del centro a cada nodo del borde interno (ir=0)
  const I_rigid = I_bolt * 100;
  const A_rigid = A_bolt * 10;
  for (let it = 0; it < nT; it++) {
    addFrame(boltCenter, grid[0][it], A_rigid, I_rigid, I_rigid * 2);
  }

  // ── APOYOS: empotrar el extremo inferior del perno ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  supports.set(boltBottom, [true, true, true, true, true, true]);

  // ── CARGAS: tracción uniforme en los bordes superior+inferior (Y=±r_outer) ──
  const loads = new Map<number, [number, number, number, number, number, number]>();
  const itCenterTop = Math.round(nT * 0.25);
  const itCenterBot = Math.round(nT * 0.75);
  const halfBand = Math.max(2, Math.round(nT * 0.15));
  let countTop = 0, countBot = 0;
  for (let dir = -halfBand; dir <= halfBand; dir++) {
    countTop++; countBot++;
  }
  const fTop = Pull / countTop;
  const fBot = -Pull / countBot;
  for (let dir = -halfBand; dir <= halfBand; dir++) {
    const itT = (itCenterTop + dir + nT) % nT;
    const itB = (itCenterBot + dir + nT) % nT;
    const idT = grid[nR][itT];
    const idB = grid[nR][itB];
    const curT = loads.get(idT) || [0, 0, 0, 0, 0, 0];
    loads.set(idT, [curT[0], curT[1] + fTop, curT[2], curT[3], curT[4], curT[5]]);
    const curB = loads.get(idB) || [0, 0, 0, 0, 0, 0];
    loads.set(idB, [curB[0], curB[1] + fBot, curB[2], curB[3], curB[4], curB[5]]);
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities, shearModuli, areas,
    momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
    densities, poissonsRatios, thicknesses,
  };

  // ── DECORADORES 3D ──
  const decorators: THREE.Object3D[] = [];
  const matHole = new THREE.LineBasicMaterial({ color: 0xff8000, linewidth: 3 });
  const holePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI;
    holePts.push(new THREE.Vector3(r_hole * Math.cos(a), r_hole * Math.sin(a), 0.0005));
  }
  decorators.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(holePts), matHole));
  const matBolt = new THREE.LineBasicMaterial({ color: 0xffaa00, linewidth: 2 });
  const r_b = d_bolt / 2;
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * 2 * Math.PI;
    const x = r_b * Math.cos(a), y = r_b * Math.sin(a);
    const seg = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, y, -L_bolt / 2),
      new THREE.Vector3(x, y,  L_bolt / 2),
    ]);
    decorators.push(new THREE.Line(seg, matBolt));
  }
  for (const z of [-L_bolt / 2, 0, L_bolt / 2]) {
    const ringPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * 2 * Math.PI;
      ringPts.push(new THREE.Vector3(r_b * Math.cos(a), r_b * Math.sin(a), z));
    }
    decorators.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), matBolt));
  }

  return { nodes, elements, nodeInputs, elementInputs, holeRing: grid[0].slice(), decorators, L, t_plate, d_hole, Pull };
}

// Lo último construido, para computedLabels.
let ultimo: {
  malla: BoltHoleMalla;
  deformOutputs: DeformOutputs;
  analyzeOutputs: AnalyzeOutputs;
} | null = null;

const F = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const boltHoleDetail: ExampleDef = {
  id: "bolt-hole-detail",
  name: "Detalle Perno + Orificio (Kirsch)",
  // cáscaras + barras (los pernos): Mixtos. La categoría la manda el tipo de elemento MEDIDO
  category: "4️⃣ Mixtos · 🔩 Conexiones",
  defaultShellResult: "vonMises",
  params: {
    L:       F("Geometría", "L placa (m, lado)", 0.20, 0.10, 0.50, 0.02),
    t_plate: F("Geometría", "Espesor placa (m)", 0.020, 0.008, 0.050, 0.002),
    d_hole:  F("Geometría", "Ø orificio (m)", 0.030, 0.012, 0.080, 0.002),
    d_bolt:  F("Geometría", "Ø perno (m)", 0.024, 0.010, 0.060, 0.002),
    L_bolt:  F("Geometría", "L perno (m)", 0.150, 0.05, 0.40, 0.01),
    nRadial: F("Malla", "Mesh radial", 8, 4, 20, 1),
    nTheta:  F("Malla", "Mesh angular", 24, 12, 48, 4),
    Pull:    { ...F("Cargas", "Tracción borde (kN)", 50, 0, 500, 5), unitType: "force" },
  },
  guide: [
    "Malla POLAR: el orificio sale circular exacto, sin escalones",
    "La tracción entra por los bordes Y=±r_outer, como el problema de Kirsch",
    "«📊 Calculados» mide Kt = σ_vM(borde del orificio) / σ_nominal contra el 3.00 teórico de placa infinita",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaBoltHole(p as unknown as BoltHoleParams);
    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(malla.nodes, malla.elements, malla.nodeInputs, malla.elementInputs);
      analyzeOutputs = analyze(malla.nodes, malla.elements, malla.elementInputs, deformOutputs);
    } catch (e: any) {
      console.warn("Bolt-hole detail deform/analyze:", e?.message ?? e);
    }
    ultimo = { malla, deformOutputs, analyzeOutputs };

    states.nodes.val = malla.nodes;
    states.elements.val = malla.elements;
    states.nodeInputs.val = malla.nodeInputs;
    states.elementInputs.val = malla.elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = malla.decorators;
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { malla, analyzeOutputs } = ultimo;
    const vmMap = (analyzeOutputs as any)?.vonMises as Map<number, number[]> | undefined;

    // σ_vM máxima en los NUDOS del borde del orificio (holeRing)
    let vmHoleMax = 0;
    if (vmMap) {
      const holeSet = new Set(malla.holeRing);
      // vonMises viene por ELEMENTO (array de valores en sus nudos); recorremos
      // los elementos de la placa (shells, len 4) y nos quedamos con los valores
      // en los nudos que están en holeRing.
      malla.elements.forEach((el, ei) => {
        if (el.length !== 4) return; // solo shells de la placa
        const vals = vmMap.get(ei);
        if (!vals) return;
        el.forEach((n, k) => { if (holeSet.has(n) && vals[k] > vmHoleMax) vmHoleMax = vals[k]; });
      });
    }
    const sigma_nom = malla.Pull / (malla.L * malla.t_plate); // área BRUTA (sin descontar el hueco)
    const Kt_medido = sigma_nom > 0 ? vmHoleMax / sigma_nom : 0;

    return {
      "── Nominal ──": "",
      "σ_nominal = Pull/(L·t)": `${sigma_nom.toFixed(1)} kN/m²`,
      "── Kirsch (concentración de tensiones) ──": "",
      "σ_vM máx borde orificio": `${vmHoleMax.toFixed(1)} kN/m²`,
      "Kt medido (FEM, placa finita)": Kt_medido.toFixed(3),
      "Kt teórico (Kirsch, placa infinita)": "3.00",
      "Diferencia vs teórico": `${((Kt_medido - 3) / 3 * 100).toFixed(1)} %`,
    };
  },
};
