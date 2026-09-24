/**
 * Zapata Conectada 5×1m con thickness variable (BENCHMARK SAFE).
 * Caso 4 — paridad -0.25%. Extremos t=0.40m (zapatas), centro t=0.20m (viga).
 */
import { plateQ4Solve } from "hekatan-fem";
import { f2kDelPlateQ4 } from "../shared/f2kPlateQ4";
import type { ExampleDef } from "../workspace/exampleRegistry";

const TONF_TO_KN = 9.80665;

export const safeBenchConectada: ExampleDef = {
  id: "safe-bench-zapata-conectada",
  name: "SAFE Benchmark · Zapata Conectada 5×1m t variable (Δ -0.25%)",
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
    "Caso 4 del framework Hekatan vs SAFE — paridad -0.25%",
    "Losa con espesor variable: zapatas extremas t=0.40m, viga centro t=0.20m",
    "2 columnas centradas en cada zapata: x=0.5 y x=4.5",
    "MUESTRA artefacto físico: viga delgada genera rotación, esquinas hunden MÁS que las cargas",
  ],
  params: {
    Lz: { default: 5.0, min: 3, max: 10, step: 0.25, label: "Lz total (m)" },
    Bz: { default: 1.0, min: 0.5, max: 2, step: 0.25, label: "Bz ancho (m)" },
    t_zap: { default: 0.40, min: 0.2, max: 1, step: 0.05, label: "t zapata (m)" },
    t_vig: { default: 0.20, min: 0.1, max: 0.5, step: 0.05, label: "t viga centro (m)" },
    Lzap: { default: 1.0, min: 0.5, max: 2, step: 0.25, label: "L zapata extremo (m)" },
    ks_tonfm3: { default: 105, min: 50, max: 5000, step: 50, label: "ks (tonf/m³)" },
    P_tonf: { default: 20, min: 1, max: 50, step: 1, label: "P por col (tonf)" },
    nx: { default: 20, min: 10, max: 40, step: 2, label: "nx mesh" },
    ny: { default: 4, min: 2, max: 8, step: 1, label: "ny mesh" },
  },
  build(p, states) {
    const Lz = p.Lz, Bz = p.Bz;
    const t_zap = p.t_zap, t_vig = p.t_vig, Lzap = p.Lzap;
    const ks = p.ks_tonfm3 * TONF_TO_KN;
    const P_kN = p.P_tonf * TONF_TO_KN;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nxn = nx + 1, nyn = ny + 1;
    const dx = Lz / nx, dy = Bz / ny;
    const nodes: [number, number][] = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i)
        nodes.push([i * dx, j * dy]);
    const elements: [number, number, number, number][] = [];
    const thicknesses_arr: number[] = [];
    for (let j = 0; j < ny; ++j)
      for (let i = 0; i < nx; ++i) {
        const n0 = j * nxn + i;
        elements.push([n0, n0 + 1, n0 + nxn + 1, n0 + nxn]);
        const xCenter = (i + 0.5) * dx;
        const isZap = xCenter < Lzap || xCenter > (Lz - Lzap);
        thicknesses_arr.push(isZap ? t_zap : t_vig);
      }
    const springs: Array<{ node: number; dof: number; k: number }> = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i) {
        const onEdgeI = (i === 0 || i === nxn - 1);
        const onEdgeJ = (j === 0 || j === nyn - 1);
        const factor = onEdgeI && onEdgeJ ? 0.25 : (onEdgeI || onEdgeJ ? 0.5 : 1.0);
        const A_trib = dx * dy * factor;
        const nodeIdx = j * nxn + i;
        springs.push({ node: nodeIdx, dof: 0, k: ks * A_trib });
        if (onEdgeI && onEdgeJ) {
          const k_theta = 1e-6 * ks * dx * dy;
          springs.push({ node: nodeIdx, dof: 1, k: k_theta });
          springs.push({ node: nodeIdx, dof: 2, k: k_theta });
        }
      }
    const findNode = (xT: number, yT: number) => {
      let best = -1, bestD = Infinity;
      for (let k = 0; k < nodes.length; ++k) {
        const d = (nodes[k][0] - xT) ** 2 + (nodes[k][1] - yT) ** 2;
        if (d < bestD) { bestD = d; best = k; }
      }
      return best;
    };
    const pointLoads = [
      { node: findNode(Lzap / 2, Bz / 2), dof: 0, value: -P_kN },
      { node: findNode(Lz - Lzap / 2, Bz / 2), dof: 0, value: -P_kN },
    ];
    const E_kNm2 = 24855e3, nu = 0.20;
    const result = plateQ4Solve({
      E: E_kNm2, nu, thickness: t_zap, theoryType: 0,
      bcType: "none", nodes, elements,
      bcs: [], pointLoads, springs, thicknesses: thicknesses_arr,
    });
    const N3D: [number, number, number][] = nodes.map(n => [n[0], n[1], 0]);
    states.nodes.val = N3D;
    states.elements.val = elements as unknown as number[][];
    states.nodeInputs.val = { supports: new Map(), loads: new Map(),
      // Para «Exportar F2K» (SAFE): muelles y cargas del SOLVER en la convencion de 6 gdl.
      ...f2kDelPlateQ4(springs, pointLoads) } as any;
    states.elementInputs.val = {
      elasticities: new Map(elements.map((_, i) => [i, E_kNm2])),
      poissonsRatios: new Map(elements.map((_, i) => [i, nu])),
      thicknesses: new Map(elements.map((_, i) => [i, thicknesses_arr[i]])),
    };
    const deformations = new Map<number, [number, number, number, number, number, number]>();
    // `PlateQ4NodeResult` es {x, y, w, bx, by}: NO trae `node`. Poniendo
    // `r.node` (undefined) las 289 deformaciones se guardaban todas bajo la
    // MISMA clave y el visor no encontraba ninguna: la zapata salia PLANA con
    // la deformada encendida. El indice del array es el del nudo.
    result.nodeResults.forEach((r, i) => deformations.set(i, [0, 0, r.w, r.bx, r.by, 0]));
    states.deformOutputs.val = { deformations, reactions: new Map() };
    const pressure = new Map<number, number[]>();
    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    const vonMises = new Map<number, number[]>();
    elements.forEach((el, i) => {
      pressure.set(i, el.map(n => ks * result.nodeResults[n].w));
      const er = result.elementResults[i];
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
      const vm = Math.sqrt(er.Mxx**2 + er.Myy**2 - er.Mxx*er.Myy + 3*er.Mxy**2);
      vonMises.set(i, [vm, vm, vm, vm]);
    });
    states.analyzeOutputs.val = { pressure, bendingXX, bendingYY, bendingXY, vonMises };
    states.objects3D.val = [];
  },
};
