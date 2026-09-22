/**
 * Ejercicio 2 del libro Guerra MDI - "Cimentaciones Sismo Resistentes
 * utilizando SAFE" (2013), pag. 42-58.
 *
 * ZAPATA AISLADA RECTANGULAR con ACCIÓN SÍSMICA.
 * L=4.60m, B=4.00m, h=0.55m, columna 1.20×0.60m centrada.
 * Dead: P=91 t, M=60 t·m
 * Live: P=30 t, M=36 t·m
 * Sismo: P=3 t, M=9 t·m
 * Combos servicio: 1.0D+1.0L y 1.0D+1.0L+1.0S
 * Excentricidad e_DL = 0.79 > L/6=0.65 → zona de despegue (no contact)
 */
import * as THREE from "three";
import { plateQ4Solve } from "hekatan-fem";
import { f2kDelPlateQ4 } from "../shared/f2kPlateQ4";
import { cargaColumnaConsistente } from "../shared/cargaColumnaConsistente";
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

export const guerraEj2ZapataRectangular: ExampleDef = {
  id: "guerra-ej2-zapata-rectangular-sismo",
  name: "Ej.2 · Zapata Rectangular + Sismo (4.60×4.00×0.55)",
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
    "EJ.2 Guerra MDI - pag. 42-58. Zapata rectangular bajo carga sísmica.",
    "L=4.60m, B=4.00m, h=0.55m. Columna 1.20×0.60m (rectangular).",
    "Cargas D+L+S: P=124t, M=105t·m → excentricidad e=0.84m > L/6=0.65m",
    "Excentricidad grande → zona de despegue (parte de zapata no en contacto).",
    "Libro: σ_max iter1 (L=3.90, B=3.30) = 21.07 t/m² >q_adm. Iter2 dimensiones finales.",
    "Combo seleccion: D+L (servicio) o D+L+S (servicio+sismo) en el slider 'combo'.",
  ],
  params: {
    L:         { default: 4.60, min: 3.50, max: 6.00, step: 0.05, label: "L (m)" },
    B:         { default: 4.00, min: 3.00, max: 5.50, step: 0.05, label: "B (m)" },
    h:         { default: 0.55, min: 0.40, max: 0.90, step: 0.05, label: "h espesor (m)" },
    col_x:     { default: 1.20, min: 0.40, max: 2.00, step: 0.05, label: "col Lx (m)" },
    col_y:     { default: 0.60, min: 0.30, max: 1.50, step: 0.05, label: "col Ly (m)" },
    ks_tm3:    { default: 2920, min: 500, max: 8000, step: 50, label: "ks (tonf/m³)" },
    P_dead:    { default: 91.0, min: 0, max: 300, step: 1, label: "P_D (tonf)" },
    M_dead:    { default: 60.0, min: 0, max: 200, step: 1, label: "M_D (tonf·m)" },
    P_live:    { default: 30.0, min: 0, max: 150, step: 1, label: "P_L (tonf)" },
    M_live:    { default: 36.0, min: 0, max: 100, step: 1, label: "M_L (tonf·m)" },
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

    // Cargas según combo seleccionado
    const combo = Math.round(p.combo);
    let P_tonf: number, M_tonfm: number;
    if (combo === 1) {  // D + L + S
      P_tonf = p.P_dead + p.P_live + p.P_sismo;
      M_tonfm = p.M_dead + p.M_live + p.M_sismo;
    } else {  // D + L
      P_tonf = p.P_dead + p.P_live;
      M_tonfm = p.M_dead + p.M_live;
    }
    // Convertir a kN explicitamente (independiente del forceUnit del workspace)
    const P_kN = P_tonf * TONF_TO_KN;
    const M_kNm = M_tonfm * TONF_TO_KN;
    const ks_kNm3 = p.ks_tm3 * TONF_TO_KN;

    const E_kgcm2 = 14100 * Math.sqrt(p.fc_kgcm2);
    const E_kNm2 = E_kgcm2 * 98.0665;
    const nu = 0.20;

    // ── Nodos + elementos ──
    const nodes: [number, number][] = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i)
        nodes.push([i * dx, j * dy]);
    const elements: [number, number, number, number][] = [];
    for (let j = 0; j < ny; ++j)
      for (let i = 0; i < nx; ++i) {
        const n0 = j * nxn + i;
        elements.push([n0, n0 + 1, n0 + nxn + 1, n0 + nxn]);
      }

    // Self-weight
    const GAMMA_C_KN_M3 = 2.4 * TONF_TO_KN;
    const sw_pressure_kN_m2 = GAMMA_C_KN_M3 * tz;

    // Resortes Winkler + self-weight
    const springs: Array<{ node: number; dof: number; k: number }> = [];
    const selfWeightLoads: Array<{ node: number; dof: number; value: number }> = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i) {
        const onEdgeI = (i === 0 || i === nxn - 1);
        const onEdgeJ = (j === 0 || j === nyn - 1);
        const factor = onEdgeI && onEdgeJ ? 0.25 : (onEdgeI || onEdgeJ ? 0.5 : 1.0);
        const A_trib = dx * dy * factor;
        const nodeIdx = j * nxn + i;
        springs.push({ node: nodeIdx, dof: 0, k: ks_kNm3 * A_trib });
        selfWeightLoads.push({ node: nodeIdx, dof: 0, value: -sw_pressure_kN_m2 * A_trib });
        if (onEdgeI && onEdgeJ) {
          const k_theta = 1e-6 * ks_kNm3 * dx * dy;
          springs.push({ node: nodeIdx, dof: 1, k: k_theta });
          springs.push({ node: nodeIdx, dof: 2, k: k_theta });
        }
      }

    // Distribuir P + M sobre huella columna 1.20×0.60 m centrada
    const cx = Lz / 2, cy = Bz / 2;
    const colNodesArr: number[] = [];
    for (let n = 0; n < nodes.length; n++) {
      const xn = nodes[n][0], yn = nodes[n][1];
      if (Math.abs(xn - cx) <= p.col_x/2 + 1e-6 &&
          Math.abs(yn - cy) <= p.col_y/2 + 1e-6) {
        colNodesArr.push(n);
      }
    }
    // ⚠️ El reparto A PARTES IGUALES no es el vector consistente: los nudos del
    // BORDE de la huella reciben menos que los de dentro. Medido contra
    // `∫N_i·q·dA` en la zapata validada contra SAP2000: **0.100 %**. Poco, pero
    // es gratis quitarlo, y asi las zapatas meten la carga como la meten SAFE,
    // SAP2000 y el propio `.heks`.
    // El MOMENTO se sigue repartiendo a partes iguales: llevarlo a presion
    // lineal sobre la huella es otro cambio, no esta medido, y estos ejemplos
    // estan calibrados contra el libro de Guerra.
    const cargaP = cargaColumnaConsistente(nodes, elements, P_kN, cx, cy,
                                           p.col_x, p.col_y);
    const M_per_node = M_kNm / colNodesArr.length;
    const columnLoads: Array<{ node: number; dof: number; value: number }> = [
      ...cargaP.pointLoads,
    ];
    for (const n of colNodesArr) {
      columnLoads.push({ node: n, dof: 2, value: M_per_node });   // My (mano derecha): gradiente a lo largo de X, el M2 de SAFE
    }
    const pointLoads = [...columnLoads, ...selfWeightLoads];

    // Solve
    const result = plateQ4Solve({
      E: E_kNm2, nu, thickness: tz, theoryType: 0,
      bcType: "none", nodes, elements,
      bcs: [], pointLoads, springs,
    });

    // Pressure FEM raw (negativo = compresion)
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

    // Push al workspace
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
    objs.push(...buildColumnFrame(cx, cy, p.h_col, p.col_x, p.col_y));
    states.objects3D.val = objs;
  },

  computedLabels(_p, states) {
    const pressureMap = states.analyzeOutputs.val.pressure;
    let sMax = -Infinity, sMin = Infinity;
    if (pressureMap) {
      for (const arr of pressureMap.values()) {
        for (const v of arr) {
          const v_tm2 = Math.abs(v) * KN_TO_TONF;
          if (v_tm2 > sMax) sMax = v_tm2;
          if (v_tm2 < sMin) sMin = v_tm2;
        }
      }
    }
    if (sMax === -Infinity) { sMax = 0; sMin = 0; }
    const ref = safeRef as any;
    const sigma_iter1 = ref?.manual_libro?.iteration_1?.sigma_max_tm2 as number | undefined;
    const e_DL = ref?.manual_libro?.e_DL_m as number | undefined;
    const e_DLS = ref?.manual_libro?.e_DLS_m as number | undefined;
    const L_6 = ref?.manual_libro?.L_sobre_6_m as number | undefined;
    return {
      "📊 σ_max Hekatan":  `${sMax.toFixed(3)} t/m²`,
      "📊 σ_min Hekatan":  `${sMin.toFixed(3)} t/m²`,
      "📘 σ_max iter1 (libro)":  sigma_iter1 ? `${sigma_iter1.toFixed(2)} t/m² (L=3.90)` : "—",
      "📘 e (D+L) libro":     e_DL  ? `${e_DL.toFixed(3)} m`  : "—",
      "📘 e (D+L+S) libro":   e_DLS ? `${e_DLS.toFixed(3)} m` : "—",
      "📘 L/6":               L_6   ? `${L_6.toFixed(3)} m`   : "—",
      "⚠️ Excentricidad":     "e > L/6 → zona de despegue (libro pag.43)",
    };
  },
};
