/**
 * Ejercicio 3 del libro Guerra MDI (pag.69-72).
 *
 * ZAPATA RECTANGULAR EXCENTRICIDAD GRANDE.
 * Misma geometria que Ej.2: L=4.60m, B=4.00m, h=0.55m, columna 1.20×0.60.
 * Cargas con M MUCHO MAYOR:
 *   D: P=91 t, M=60 t·m
 *   L: P=30 t, M=96 t·m  (vs 36 en Ej.2)
 *   S: P=3 t,  M=9 t·m
 * Material: f'c=280, q_adm=20 t/m² (suelo MEJOR que Ej.2)
 * Excentricidad e_DL = 1.289 m >> L/6=0.767m → despegue importante.
 */
import * as THREE from "three";
import { plateQ4Solve } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import safeRef from "./safe-reference.json";

const TONF_TO_KN = 9.80665;
const KN_TO_TONF = 1 / TONF_TO_KN;

function buildColumnFrame(x: number, y: number, h: number, sx: number, sy: number): THREE.Object3D[] {
  const geom = new THREE.BoxGeometry(sx, sy, h);
  const lines = new THREE.LineSegments(
    new THREE.EdgesGeometry(geom),
    new THREE.LineBasicMaterial({ color: 0xb0b0b0, linewidth: 2 }),
  );
  lines.position.set(x, y, h / 2);
  return [lines];
}

export const guerraEj3ZapataRectangularEccGrande: ExampleDef = {
  id: "guerra-ej3-zapata-rectangular-eccentricidad-grande",
  name: "Ej.3 · Zapata Rectangular EXCENTRICIDAD GRANDE (4.60×4.00×0.55)",
  category: "📚 Libros · SAFE - Marcelo Guerra",
  benchmark: true,
  defaultShellResult: "pressure",
  availableShellResults: ["pressure", "bendingXX", "bendingYY", "bendingXY", "vonMises", "displacementZ"],
  hasModal: false,
  guide: [
    "EJ.3 Guerra MDI - pag. 69-72. Excentricidad MUY GRANDE.",
    "Mismas dim Ej.2 (L=4.60, B=4.00) pero M_live=96t·m (vs 36 en Ej.2).",
    "q_adm=20 t/m² (suelo mejor para soportar la mayor demanda).",
    "e_DL=1.289 m >> L/6=0.767 m → zona de despegue grande.",
    "El libro pag.69 muestra que aunque e es enorme, σ_max sigue cumpliendo.",
  ],
  params: {
    L:         { default: 4.60, min: 3.50, max: 6.00, step: 0.05, label: "L (m)" },
    B:         { default: 4.00, min: 3.00, max: 5.50, step: 0.05, label: "B (m)" },
    h:         { default: 0.55, min: 0.40, max: 0.90, step: 0.05, label: "h espesor (m)" },
    col_x:     { default: 1.20, min: 0.40, max: 2.00, step: 0.05, label: "col Lx (m)" },
    col_y:     { default: 0.60, min: 0.30, max: 1.50, step: 0.05, label: "col Ly (m)" },
    ks_tm3:    { default: 4400, min: 500, max: 12000, step: 100, label: "ks (tonf/m³)" },
    P_dead:    { default: 91.0, min: 0, max: 300, step: 1, label: "P_D (tonf)" },
    M_dead:    { default: 60.0, min: 0, max: 200, step: 1, label: "M_D (tonf·m)" },
    P_live:    { default: 30.0, min: 0, max: 150, step: 1, label: "P_L (tonf)" },
    M_live:    { default: 96.0, min: 0, max: 200, step: 1, label: "M_L (tonf·m)" },
    P_sismo:   { default: 3.0,  min: 0, max: 100, step: 0.5, label: "P_S (tonf)" },
    M_sismo:   { default: 9.0,  min: 0, max: 80, step: 0.5, label: "M_S (tonf·m)" },
    combo:     { default: 1, min: 0, max: 1, step: 1, label: "combo (0=DL, 1=DLS)" },
    fc_kgcm2:  { default: 280, min: 175, max: 600, step: 5, label: "f'c (kg/cm²)" },
    nx:        { default: 18, min: 8, max: 32, step: 2, label: "nx mesh" },
    ny:        { default: 16, min: 8, max: 32, step: 2, label: "ny mesh" },
    h_col:     { default: 0.6, min: 0.2, max: 2.0, step: 0.1, label: "Hcol viz (m)" },
  },
  build(p, states) {
    const Lz = p.L, Bz = p.B, tz = p.h;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nxn = nx + 1, nyn = ny + 1;
    const dx = Lz / nx, dy = Bz / ny;

    const combo = Math.round(p.combo);
    let P_tonf: number, M_tonfm: number;
    if (combo === 1) {
      P_tonf = p.P_dead + p.P_live + p.P_sismo;
      M_tonfm = p.M_dead + p.M_live + p.M_sismo;
    } else {
      P_tonf = p.P_dead + p.P_live;
      M_tonfm = p.M_dead + p.M_live;
    }
    const P_kN = P_tonf * TONF_TO_KN;
    const M_kNm = M_tonfm * TONF_TO_KN;
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

    const cx = Lz / 2, cy = Bz / 2;
    const colNodesArr: number[] = [];
    for (let n = 0; n < nodes.length; n++) {
      const xn = nodes[n][0], yn = nodes[n][1];
      if (Math.abs(xn - cx) <= p.col_x/2 + 1e-6 && Math.abs(yn - cy) <= p.col_y/2 + 1e-6) {
        colNodesArr.push(n);
      }
    }
    const P_per_node = P_kN / colNodesArr.length;
    const M_per_node = M_kNm / colNodesArr.length;
    const columnLoads: Array<{ node: number; dof: number; value: number }> = [];
    for (const n of colNodesArr) {
      columnLoads.push({ node: n, dof: 0, value: -P_per_node });
      columnLoads.push({ node: n, dof: 1, value: M_per_node });
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
    objs.push(...buildColumnFrame(cx, cy, p.h_col, p.col_x, p.col_y));
    states.objects3D.val = objs;
  },

  computedLabels(_p, states) {
    const pressureMap = states.analyzeOutputs.val.pressure;
    let sMax = -Infinity, sMin = Infinity;
    if (pressureMap) {
      for (const arr of pressureMap.values())
        for (const v of arr) {
          const v_tm2 = Math.abs(v) * KN_TO_TONF;
          if (v_tm2 > sMax) sMax = v_tm2;
          if (v_tm2 < sMin) sMin = v_tm2;
        }
    }
    if (sMax === -Infinity) { sMax = 0; sMin = 0; }
    const ref = safeRef as any;
    return {
      "📊 σ_max Hekatan":  `${sMax.toFixed(3)} t/m²`,
      "📊 σ_min Hekatan":  `${sMin.toFixed(3)} t/m²`,
      "📘 e (D+L) libro":     `${ref?.manual_libro?.e_DL_m?.toFixed(3)} m`,
      "📘 e (D+L+S) libro":   `${ref?.manual_libro?.e_DLS_m?.toFixed(3)} m`,
      "📘 L/6":               `${ref?.manual_libro?.L_sobre_6_m?.toFixed(3)} m`,
      "⚠️ Excentricidad":     "e >> L/6 → DESPEGUE GRANDE",
    };
  },
};
