/**
 * Ej.5 Guerra MDI (pag.93-112) - ZAPATA COMBINADA TRAPEZOIDAL
 * L=5m, B1=3.75m → B2=1.60m. Cols 50×50 en x=0.25 (Col1) y x=4.75 (Col2).
 * f'c=210, q_adm=20.
 * IMPL: malla trapezoidal (nudos de −B(x)/2 a +B(x)/2 en cada x); muelles ks·A_trib con el área
 * tributaria de cada nudo sacada de sus elementos.
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
  const lines = new THREE.LineSegments(
    new THREE.EdgesGeometry(geom),
    new THREE.LineBasicMaterial({ color: 0xb0b0b0, linewidth: 2 }),
  );
  lines.position.set(x, y, h / 2);
  return [lines];
}

/** Malla TRAPEZOIDAL: cada columna de nudos abarca el ancho B(x) de esa sección. */
export const guerraEj5ZapataTrapezoidal: ExampleDef = {
  id: "guerra-ej5-zapata-combinada-trapezoidal",
  name: "Ej.5 · Zapata Trapezoidal (L=5, B1=3.75→B2=1.60)",
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
    "EJ.5 pag.93-112. Zapata combinada TRAPEZOIDAL.",
    "L=5m, ancho varia linealmente de B1=3.75 (col1) a B2=1.60 (col2).",
    "Cols 50×50cm. Col 1: P_D=108 M_D=-4.3, P_L=45 M_L=-2. Col 2: P_D=78 M_D=3.2 P_L=36 M_L=2.4",
    "Libro pag.95: σ uniforme = 19.96 t/m² (< q_adm=20).",
  ],
  params: {
    L:           { default: 5.00, min: 3.00, max: 7.00, step: 0.05, label: "L (m)" },
    B1:          { default: 3.75, min: 2.00, max: 5.00, step: 0.05, label: "B1 (m)" },
    B2:          { default: 1.60, min: 1.00, max: 3.00, step: 0.05, label: "B2 (m)" },
    h:           { default: 1.15, min: 0.50, max: 1.50, step: 0.05, label: "h espesor (m)" },
    col1_x:      { default: 0.25, min: 0.10, max: 1.50, step: 0.05, label: "col1 x (m)" },
    col2_x:      { default: 4.75, min: 3.00, max: 6.00, step: 0.05, label: "col2 x (m)" },
    col_size:    { default: 0.50, min: 0.20, max: 1.00, step: 0.05, label: "col lado (m)" },
    ks_tm3:      { default: 2920, min: 500, max: 8000, step: 50, label: "ks (tonf/m³)" },
    P_D_C1:      { default: 108.0, min: 0, max: 300, step: 1, label: "P_D col1 (tonf)" },
    M_D_C1:      { default: -4.3, min: -30, max: 30, step: 0.5, label: "M_D col1 (tonf·m)" },
    P_L_C1:      { default: 45.0, min: 0, max: 150, step: 1, label: "P_L col1 (tonf)" },
    M_L_C1:      { default: -2.0, min: -30, max: 30, step: 0.5, label: "M_L col1 (tonf·m)" },
    P_D_C2:      { default: 78.0, min: 0, max: 300, step: 1, label: "P_D col2 (tonf)" },
    M_D_C2:      { default: 3.2, min: -30, max: 30, step: 0.5, label: "M_D col2 (tonf·m)" },
    P_L_C2:      { default: 36.0, min: 0, max: 150, step: 1, label: "P_L col2 (tonf)" },
    M_L_C2:      { default: 2.4, min: -30, max: 30, step: 0.5, label: "M_L col2 (tonf·m)" },
    fc_kgcm2:    { default: 210, min: 175, max: 600, step: 5, label: "f'c (kg/cm²)" },
    nx:          { default: 24, min: 12, max: 40, step: 2, label: "nx mesh" },
    ny:          { default: 14, min: 6, max: 24, step: 2, label: "ny mesh" },
    h_col:       { default: 0.6, min: 0.2, max: 2.0, step: 0.1, label: "Hcol viz (m)" },
  },
  build(p, states) {
    const Lz = p.L, B1 = p.B1, B2 = p.B2;
    const Bmax = Math.max(B1, B2);
    const tz = p.h;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nxn = nx + 1, nyn = ny + 1;
    const dx = Lz / nx, dy = Bmax / ny;

    const P_kN_c1 = (p.P_D_C1 + p.P_L_C1) * TONF_TO_KN;
    const M_kNm_c1 = (p.M_D_C1 + p.M_L_C1) * TONF_TO_KN;
    const P_kN_c2 = (p.P_D_C2 + p.P_L_C2) * TONF_TO_KN;
    const M_kNm_c2 = (p.M_D_C2 + p.M_L_C2) * TONF_TO_KN;
    const ks_kNm3 = p.ks_tm3 * TONF_TO_KN;
    const E_kgcm2 = 14100 * Math.sqrt(p.fc_kgcm2);
    const E_kNm2 = E_kgcm2 * 98.0665;
    const nu = 0.20;

    // TRAPECIO de verdad (22-sep-2026, Jorge: «debe ser trapezoidal»). Antes se mallaba el
    // rectángulo B1 × L y se apagaban los muelles fuera del trapecio: la PLACA seguía siendo
    // rectangular (pesaba, rigidizaba y se dibujaba entera). SAFE recibía esa misma malla, así que
    // el 0.86 % del test comparaba dos veces el mismo modelo equivocado.
    // Ahora cada columna de nudos va de −B(x)/2 a +B(x)/2 alrededor del eje: elementos trapezoidales.
    const yc = Bmax / 2;
    const halfB_at = (x: number) => (B1 + (B2 - B1) * (x / Lz)) / 2;
    const nodes: [number, number][] = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i) {
        const x = i * dx, hb = halfB_at(x);
        nodes.push([x, yc - hb + (2 * hb) * j / ny]);
      }
    const elements: [number, number, number, number][] = [];
    for (let j = 0; j < ny; ++j)
      for (let i = 0; i < nx; ++i) {
        const n0 = j * nxn + i;
        elements.push([n0, n0 + 1, n0 + nxn + 1, n0 + nxn]);
      }
    // área tributaria = ¼ del área de cada elemento que toca el nudo (los elementos ya no son iguales)
    const A_trib = new Array(nodes.length).fill(0);
    for (const el of elements) {
      let A2 = 0;
      for (let k = 0; k < 4; k++) { const [x1, y1] = nodes[el[k]], [x2, y2] = nodes[el[(k + 1) % 4]]; A2 += x1 * y2 - x2 * y1; }
      for (const n of el) A_trib[n] += Math.abs(A2) / 2 / 4;
    }

    const GAMMA_C_KN_M3 = 2.4 * TONF_TO_KN;
    const sw_pressure_kN_m2 = GAMMA_C_KN_M3 * tz;

    const springs: Array<{ node: number; dof: number; k: number }> = [];
    const selfWeightLoads: Array<{ node: number; dof: number; value: number }> = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i) {
        const eI = (i === 0 || i === nxn - 1);
        const eJ = (j === 0 || j === nyn - 1);
        const nodeIdx = j * nxn + i;
        springs.push({ node: nodeIdx, dof: 0, k: ks_kNm3 * A_trib[nodeIdx] });
        selfWeightLoads.push({ node: nodeIdx, dof: 0, value: -sw_pressure_kN_m2 * A_trib[nodeIdx] });
        if (eI && eJ) {
          const k_theta = 1e-6 * ks_kNm3 * dx * dy;
          springs.push({ node: nodeIdx, dof: 1, k: k_theta });
          springs.push({ node: nodeIdx, dof: 2, k: k_theta });
        }
      }

    const cy = Bmax / 2;
    const findColNodes = (cxCol: number) => {
      const r: number[] = [];
      for (let n = 0; n < nodes.length; n++) {
        const xn = nodes[n][0], yn = nodes[n][1];
        if (Math.abs(xn - cxCol) <= p.col_size/2 + 1e-6 &&
            Math.abs(yn - cy) <= p.col_size/2 + 1e-6) r.push(n);
      }
      return r;
    };
    const col1Nodes = findColNodes(p.col1_x);
    const col2Nodes = findColNodes(p.col2_x);
    const columnLoads: Array<{ node: number; dof: number; value: number }> = [];
    if (col1Nodes.length > 0) {
      const Pp = P_kN_c1 / col1Nodes.length;
      const Mp = M_kNm_c1 / col1Nodes.length;
      for (const n of col1Nodes) {
        columnLoads.push({ node: n, dof: 0, value: -Pp });
        columnLoads.push({ node: n, dof: 2, value: Mp });   // My (mano derecha): gradiente a lo largo de X, el M2 de SAFE
      }
    }
    if (col2Nodes.length > 0) {
      const Pp = P_kN_c2 / col2Nodes.length;
      const Mp = M_kNm_c2 / col2Nodes.length;
      for (const n of col2Nodes) {
        columnLoads.push({ node: n, dof: 0, value: -Pp });
        columnLoads.push({ node: n, dof: 2, value: Mp });   // My (mano derecha): gradiente a lo largo de X, el M2 de SAFE
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
    objs.push(...buildColumnFrame(p.col1_x, cy, p.h_col, p.col_size));
    objs.push(...buildColumnFrame(p.col2_x, cy, p.h_col, p.col_size));
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
    const sigUnif = ref?.manual_libro?.sigma_uniforme_tm2 as number | undefined;
    return {
      "📊 σ_max Hekatan":        `${sMax.toFixed(3)} t/m²`,
      "📊 σ_min Hekatan":        `${sMin.toFixed(3)} t/m²`,
      "📘 σ uniforme libro p.95": sigUnif ? `${sigUnif.toFixed(2)} t/m²` : "—",
      "📐 Geometría":            "trapecio real (malla trapezoidal)",
    };
  },
};
