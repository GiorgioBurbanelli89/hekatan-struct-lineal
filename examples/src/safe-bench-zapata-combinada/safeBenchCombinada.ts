/**
 * Zapata Combinada 4×2×0.40m, 2 cols alineadas (BENCHMARK SAFE).
 * Caso 3 — paridad <0.08% Hekatan vs SAFE 20.
 */
import * as THREE from "three";
import { plateQ4Solve } from "hekatan-fem";
import { f2kDelPlateQ4 } from "../shared/f2kPlateQ4";
import type { ExampleDef } from "../workspace/exampleRegistry";

const TONF_TO_KN = 9.80665;

function buildPedestalFrame(x: number, y: number, h: number, side: number): THREE.Object3D[] {
  // Pedestal como frame: solo aristas (wireframe del prisma corto), SIN mesh sólido.
  // h pequeño (~0.5m) representa el pedestal que va por debajo del contrapiso.
  const geom = new THREE.BoxGeometry(side, side, h);
  const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: 0x808080, linewidth: 2 }));
  lines.position.set(x, y, h / 2);
  return [lines];
}

export const safeBenchCombinada: ExampleDef = {
  id: "safe-bench-zapata-combinada",
  name: "SAFE Benchmark · Zapata Combinada 4×2×0.40m, 2 cols (Δ +0.08%)",
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
    "Caso 3 del framework Hekatan vs SAFE — paridad <0.08%",
    "Zapata rectangular 4×2m × 0.40m espesor sobre Winkler arena media",
    "2 columnas alineadas en (1.0, 1.0) y (3.0, 1.0), P=30 tonf c/u",
    "Caso típico: medianera o muro de propiedad",
  ],
  params: {
    Lz: { default: 4.0, min: 2, max: 8, step: 0.25, label: "Lz (m)" },
    Bz: { default: 2.0, min: 1, max: 5, step: 0.25, label: "Bz (m)" },
    tz: { default: 0.40, min: 0.2, max: 1, step: 0.05, label: "t espesor (m)" },
    ks_tonfm3: { default: 2000, min: 500, max: 10000, step: 100, label: "ks (tonf/m³)" },
    P_tonf: { default: 30, min: 1, max: 100, step: 1, label: "P por col (tonf)" },
    nx: { default: 16, min: 8, max: 32, step: 2, label: "nx mesh" },
    ny: { default: 8, min: 4, max: 16, step: 2, label: "ny mesh" },
    h_ped: { default: 0.5, min: 0.2, max: 1.5, step: 0.05, label: "Hp pedestal (m)" },
    b_ped: { default: 0.40, min: 0.2, max: 0.8, step: 0.05, label: "lado pedestal (m)" },
  },
  build(p, states) {
    const Lz = p.Lz, Bz = p.Bz, tz = p.tz;
    const ks = p.ks_tonfm3 * TONF_TO_KN;
    const P_kN = p.P_tonf * TONF_TO_KN;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nxn = nx + 1, nyn = ny + 1;
    const dx = Lz / nx, dy = Bz / ny;
    const colPositions: Array<[number, number]> = [
      [Lz / 4, Bz / 2], [3 * Lz / 4, Bz / 2],
    ];
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
        const dxN = nodes[k][0] - xT, dyN = nodes[k][1] - yT;
        const d = dxN * dxN + dyN * dyN;
        if (d < bestD) { bestD = d; best = k; }
      }
      return best;
    };
    const pointLoads = colPositions.map(([cx, cy]) => ({
      node: findNode(cx, cy), dof: 0, value: -P_kN,
    }));
    const E_kNm2 = 24855e3, nu = 0.20;
    const result = plateQ4Solve({
      E: E_kNm2, nu, thickness: tz, theoryType: 0,
      bcType: "none", nodes, elements,
      bcs: [], pointLoads, springs,
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
      thicknesses: new Map(elements.map((_, i) => [i, tz])),
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
    const objs: THREE.Object3D[] = [];
    for (const [cx, cy] of colPositions) objs.push(...buildPedestalFrame(cx, cy, p.h_ped, p.b_ped));
    states.objects3D.val = objs;
  },
};
