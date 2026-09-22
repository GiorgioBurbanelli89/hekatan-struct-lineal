/**
 * Ej.8 Guerra MDI (pag.149-170) - LOSA DE CIMENTACIÓN (Raft)
 * Losa rectangular grande con 16 columnas en grid 4×4.
 * f'c=240, q_adm=7 t/m². R_total = 2535t. σ_promedio = 5.85 t/m².
 */
import * as THREE from "three";
import { plateQ4Solve } from "hekatan-fem";
import { f2kDelPlateQ4 } from "../shared/f2kPlateQ4";
import type { ExampleDef } from "../workspace/exampleRegistry";
import safeRef from "./safe-reference.json";

const TONF_TO_KN = 9.80665;
const KN_TO_TONF = 1 / TONF_TO_KN;

function buildColumnFrame(x: number, y: number, h: number, s: number): THREE.Object3D[] {
  const geom = new THREE.BoxGeometry(s, s, h);
  const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geom),
    new THREE.LineBasicMaterial({ color: 0xb0b0b0, linewidth: 2 }));
  lines.position.set(x, y, h / 2);
  return [lines];
}

// Grid 4×4 con coordenadas del libro (origen en esquina inferior izq)
const COL_GRID = [
  { name: "A1", x:  1.00, y: 19.40, P: 142 },
  { name: "A2", x:  1.00, y: 14.90, P: 153 },
  { name: "A3", x:  1.00, y:  7.10, P: 112 },
  { name: "A4", x:  1.00, y:  1.60, P: 107 },
  { name: "B1", x:  7.00, y: 19.40, P: 201 },
  { name: "B2", x:  7.00, y: 14.90, P: 219 },
  { name: "B3", x:  7.00, y:  7.10, P: 137 },
  { name: "B4", x:  7.00, y:  1.60, P: 147 },
  { name: "C1", x: 14.50, y: 19.40, P: 233 },
  { name: "C2", x: 14.50, y: 14.90, P: 253 },
  { name: "C3", x: 14.50, y:  7.10, P: 161 },
  { name: "C4", x: 14.50, y:  1.60, P: 164 },
  { name: "D1", x: 21.50, y: 19.40, P: 161 },
  { name: "D2", x: 21.50, y: 14.90, P: 219 },
  { name: "D3", x: 21.50, y:  7.10, P: 129 },
  { name: "D4", x: 21.50, y:  1.60, P: 129 },
];

export const guerraEj8LosaCimentacion: ExampleDef = {
  id: "guerra-ej8-losa-cimentacion",
  name: "Ej.8 · Losa de Cimentación (Raft 23×21m, 16 cols)",
  category: "2️⃣ Shells · 🧰 Cimentaciones",
  benchmark: true,
  defaultShellResult: "pressure",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
  hasModal: false,
  guide: [
    "EJ.8 pag.149-170. Losa de cimentación (raft).",
    "L=23m × B=21m, h=0.80m. Grid 4×4 = 16 columnas 60×60cm.",
    "f'c=240, q_adm=7 (suelo flojo → losa grande).",
    "Libro pag.151: σ uniforme ~5.85 t/m² (entre 5.45-6.01 por col).",
  ],
  params: {
    L:        { default: 23.00, min: 15.00, max: 35.00, step: 0.50, label: "L total (m)" },
    B:        { default: 21.00, min: 15.00, max: 30.00, step: 0.50, label: "B total (m)" },
    h:        { default: 0.80, min: 0.50, max: 1.50, step: 0.05, label: "h (m)" },
    col_size: { default: 0.60, min: 0.30, max: 1.00, step: 0.05, label: "col lado (m)" },
    ks_tm3:   { default: 1500, min: 500, max: 4000, step: 50, label: "ks (tonf/m³)" },
    fc_kgcm2: { default: 240, min: 175, max: 600, step: 5, label: "f'c (kg/cm²)" },
    P_scale:  { default: 1.0, min: 0.1, max: 2.0, step: 0.1, label: "P scale" },
    nx:       { default: 40, min: 20, max: 64, step: 2, label: "nx mesh" },
    ny:       { default: 36, min: 16, max: 56, step: 2, label: "ny mesh" },
    h_col:    { default: 0.6, min: 0.2, max: 2.0, step: 0.1, label: "Hcol viz (m)" },
  },
  build(p, states) {
    const Lz = p.L, Bz = p.B, tz = p.h;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nxn = nx + 1, nyn = ny + 1;
    const dx = Lz / nx, dy = Bz / ny;
    const ks_kNm3 = p.ks_tm3 * TONF_TO_KN;
    const E_kgcm2 = 14100 * Math.sqrt(p.fc_kgcm2);
    const E_kNm2 = E_kgcm2 * 98.0665;
    const nu = 0.20;

    const nodes: [number, number][] = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i) nodes.push([i * dx, j * dy]);
    const elements: [number, number, number, number][] = [];
    for (let j = 0; j < ny; ++j)
      for (let i = 0; i < nx; ++i) {
        const n0 = j * nxn + i;
        elements.push([n0, n0 + 1, n0 + nxn + 1, n0 + nxn]);
      }

    const GAMMA_C_KN_M3 = 2.4 * TONF_TO_KN;
    const sw_pressure_kN_m2 = GAMMA_C_KN_M3 * tz;
    const springs: Array<{ node: number; dof: number; k: number }> = [];
    const selfWeightLoads: Array<{ node: number; dof: number; value: number }> = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i) {
        const eI = (i === 0 || i === nxn - 1);
        const eJ = (j === 0 || j === nyn - 1);
        const factor = eI && eJ ? 0.25 : (eI || eJ ? 0.5 : 1.0);
        const A_trib = dx * dy * factor;
        const nodeIdx = j * nxn + i;
        springs.push({ node: nodeIdx, dof: 0, k: ks_kNm3 * A_trib });
        selfWeightLoads.push({ node: nodeIdx, dof: 0, value: -sw_pressure_kN_m2 * A_trib });
        if (eI && eJ) {
          const k_theta = 1e-6 * ks_kNm3 * dx * dy;
          springs.push({ node: nodeIdx, dof: 1, k: k_theta });
          springs.push({ node: nodeIdx, dof: 2, k: k_theta });
        }
      }

    const findColNodes = (cx: number, cy: number) => {
      const r: number[] = [];
      for (let n = 0; n < nodes.length; n++) {
        const xn = nodes[n][0], yn = nodes[n][1];
        if (Math.abs(xn - cx) <= p.col_size/2 + 1e-6 &&
            Math.abs(yn - cy) <= p.col_size/2 + 1e-6) r.push(n);
      }
      return r;
    };
    const columnLoads: Array<{ node: number; dof: number; value: number }> = [];
    for (const col of COL_GRID) {
      const P_kN = col.P * p.P_scale * TONF_TO_KN;
      const cnodes = findColNodes(col.x, col.y);
      if (cnodes.length === 0) continue;
      const Pp = P_kN / cnodes.length;
      for (const n of cnodes) columnLoads.push({ node: n, dof: 0, value: -Pp });
    }
    const pointLoads = [...columnLoads, ...selfWeightLoads];

    const result = plateQ4Solve({
      E: E_kNm2, nu, thickness: tz, theoryType: 0,
      bcType: "none", nodes, elements,
      bcs: [], pointLoads, springs,
    });

    const pressure = new Map<number, number[]>();
    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    const vonMises = new Map<number, number[]>();
    elements.forEach((el, i) => {
      pressure.set(i, el.map(n => -Math.abs(ks_kNm3 * result.nodeResults[n].w)));
      const er = result.elementResults[i];
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
      const vm = Math.sqrt(er.Mxx**2 + er.Myy**2 - er.Mxx*er.Myy + 3*er.Mxy**2);
      vonMises.set(i, [vm, vm, vm, vm]);
    });

    const N3D: [number, number, number][] = nodes.map(n => [n[0], n[1], 0]);
    states.nodes.val = N3D;
    states.elements.val = elements as unknown as number[][];
    const viewerLoads = new Map<number, [number, number, number, number, number, number]>();
    const dofToViewer = [2, 3, 4];
    for (const cl of columnLoads) {
      const c = viewerLoads.get(cl.node) ?? [0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number];
      c[dofToViewer[cl.dof] ?? 2] += cl.value;
      viewerLoads.set(cl.node, c);
    }
    states.nodeInputs.val = { supports: new Map(), loads: viewerLoads,
      // Para «Exportar F2K» (SAFE): muelles y cargas del SOLVER en la convencion de 6 gdl.
      ...f2kDelPlateQ4(springs, pointLoads) } as any;
    states.elementInputs.val = {
      elasticities: new Map(elements.map((_, i) => [i, E_kNm2])),
      poissonsRatios: new Map(elements.map((_, i) => [i, nu])),
      thicknesses: new Map(elements.map((_, i) => [i, tz])),
    };
    const deformations = new Map<number, [number, number, number, number, number, number]>();
    // `PlateQ4NodeResult` es {x, y, w, bx, by}: NO trae `node`. Poniendo
    // `r.node` (undefined) las 289 deformaciones se guardaban todas bajo la
    // MISMA clave y el visor no encontraba ninguna: la zapata salia PLANA con
    // la deformada encendida. El indice del array es el del nudo.
    result.nodeResults.forEach((r, i) => deformations.set(i, [0, 0, r.w, r.bx, r.by, 0]));
    states.deformOutputs.val = { deformations, reactions: new Map() };
    states.analyzeOutputs.val = { pressure, bendingXX, bendingYY, bendingXY, vonMises };

    const objs: THREE.Object3D[] = [];
    for (const col of COL_GRID) objs.push(...buildColumnFrame(col.x, col.y, p.h_col, p.col_size));
    states.objects3D.val = objs;
  },

  computedLabels(_p, states) {
    const pressureMap = states.analyzeOutputs.val.pressure;
    let sMax = -Infinity, sMin = Infinity;
    if (pressureMap)
      for (const arr of pressureMap.values())
        for (const v of arr) {
          const v_tm2 = Math.abs(v) * KN_TO_TONF;
          if (v_tm2 > sMax) sMax = v_tm2;
          if (v_tm2 < sMin) sMin = v_tm2;
        }
    if (sMax === -Infinity) { sMax = 0; sMin = 0; }
    const ref = safeRef as any;
    return {
      "📊 σ_max Hekatan": `${sMax.toFixed(3)} t/m²`,
      "📊 σ_min Hekatan": `${sMin.toFixed(3)} t/m²`,
      "📘 σ promedio libro": `${ref?.manual_libro?.sigma_promedio_tm2} t/m²`,
      "📘 q_adm libro": `${ref?.inputs?.q_adm_tm2} t/m²`,
      "📘 R_total libro": `${ref?.inputs?.R_total_servicio_tonf} t`,
    };
  },
};
