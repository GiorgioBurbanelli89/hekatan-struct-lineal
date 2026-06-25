/**
 * Ej.7 Guerra MDI (pag.135-148) - VIGAS DE CIMENTACIÓN (versión nueva)
 * L=17.20m, B=1.50m, h=0.85m. 4 cols 60×60cm en x=0.30, 5.30, 11.30, 16.90.
 * f'c=240, q_adm=18. Suma cargas: P_D=460t, P_L=192.5t → R=652.5t.
 */
import * as THREE from "three";
import { plateQ4Solve } from "hekatan-fem";
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

interface ColData { x: number; P: number; M: number; }

export const guerraEj7VigaCimentacion: ExampleDef = {
  id: "guerra-ej7-viga-cimentacion-new",
  name: "Ej.7 NEW · Viga Cimentación L=17.20m (4 cols)",
  category: "📚 Libros · SAFE - Marcelo Guerra",
  benchmark: true,
  defaultShellResult: "pressure",
  availableShellResults: ["pressure", "bendingXX", "bendingYY", "bendingXY", "vonMises", "displacementZ"],
  hasModal: false,
  guide: [
    "EJ.7 pag.135-148. Viga de cimentación con 4 columnas.",
    "L=17.20m, B=1.50m. Cols 60×60cm.",
    "Cargas (P_D, M_D, P_L, M_L): C1(90,3,37.5,1.5), C2(130,4,57.5,2.75), C3(145,-6,65,-3), C4(95,-3,33,-1.5)",
  ],
  params: {
    L:        { default: 17.20, min: 10.00, max: 25.00, step: 0.10, label: "L (m)" },
    B:        { default: 1.50, min: 1.00, max: 3.00, step: 0.05, label: "B (m)" },
    h:        { default: 0.85, min: 0.50, max: 1.50, step: 0.05, label: "h (m)" },
    col_size: { default: 0.60, min: 0.30, max: 1.00, step: 0.05, label: "col lado (m)" },
    ks_tm3:   { default: 3640, min: 500, max: 8000, step: 50, label: "ks (tonf/m³)" },
    fc_kgcm2: { default: 240, min: 175, max: 600, step: 5, label: "f'c (kg/cm²)" },
    nx:       { default: 32, min: 12, max: 48, step: 2, label: "nx mesh" },
    ny:       { default: 8,  min: 4, max: 16, step: 2, label: "ny mesh" },
    h_col:    { default: 0.8, min: 0.2, max: 2.0, step: 0.1, label: "Hcol viz (m)" },
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

    // 4 columnas con cargas D+L (servicio)
    const cols: ColData[] = [
      { x: 0.30,  P: (90 + 37.5) * TONF_TO_KN, M: (3 + 1.5) * TONF_TO_KN },
      { x: 5.30,  P: (130 + 57.5) * TONF_TO_KN, M: (4 + 2.75) * TONF_TO_KN },
      { x: 11.30, P: (145 + 65) * TONF_TO_KN,   M: (-6 + -3) * TONF_TO_KN },
      { x: 16.90, P: (95 + 33) * TONF_TO_KN,    M: (-3 + -1.5) * TONF_TO_KN },
    ];

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

    const cy = Bz / 2;
    const findColNodes = (cxCol: number) => {
      const r: number[] = [];
      for (let n = 0; n < nodes.length; n++) {
        const xn = nodes[n][0], yn = nodes[n][1];
        if (Math.abs(xn - cxCol) <= p.col_size/2 + 1e-6 &&
            Math.abs(yn - cy) <= p.col_size/2 + 1e-6) r.push(n);
      }
      return r;
    };
    const columnLoads: Array<{ node: number; dof: number; value: number }> = [];
    for (const c of cols) {
      const cnodes = findColNodes(c.x);
      if (cnodes.length === 0) continue;
      const Pp = c.P / cnodes.length;
      const Mp = c.M / cnodes.length;
      for (const n of cnodes) {
        columnLoads.push({ node: n, dof: 0, value: -Pp });
        columnLoads.push({ node: n, dof: 1, value: Mp });
      }
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
    states.nodeInputs.val = { supports: new Map(), loads: new Map() };
    states.elementInputs.val = {
      elasticities: new Map(elements.map((_, i) => [i, E_kNm2])),
      poissonsRatios: new Map(elements.map((_, i) => [i, nu])),
      thicknesses: new Map(elements.map((_, i) => [i, tz])),
    };
    const deformations = new Map<number, [number, number, number, number, number, number]>();
    for (const r of result.nodeResults) deformations.set(r.node, [0, 0, r.w, r.bx, r.by, 0]);
    states.deformOutputs.val = { deformations, reactions: new Map() };
    // Colormap libro Fig.180 (Guerra): -12 (cyan) a -26 t/m² (magenta), jet_r discreto.
    const colorMapRanges = { pressure: [-12 * TONF_TO_KN, -26 * TONF_TO_KN] as [number, number] };
    states.analyzeOutputs.val = { pressure, bendingXX, bendingYY, bendingXY, vonMises, colorMapRanges } as any;

    const objs: THREE.Object3D[] = [];
    for (const c of cols) objs.push(...buildColumnFrame(c.x, cy, p.h_col, p.col_size));
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
      "📘 Ru último libro": `${ref?.manual_libro?.Ru_tonf} t`,
      "📘 x centroide": `${ref?.manual_libro?.x_centroide_m} m`,
    };
  },
};
