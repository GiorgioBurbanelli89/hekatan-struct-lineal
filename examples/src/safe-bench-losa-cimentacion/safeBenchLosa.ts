/**
 * Losa de Cimentación 6×8×0.50m, 6 columnas grilla 2×3 (BENCHMARK SAFE).
 *
 * Caso 2 del framework Hekatan vs SAFE 20 (paridad <0.33%).
 * Ver benchmarks/safe/losa-cimentacion/ para detalles del benchmark
 * SAFE API (cli_losa.mjs + safe_api_losa.py).
 *
 * Usa plateQ4Solve (Mindlin Q4 + Winkler springs) — mismo solver que
 * validó <0.33% vs SAFE 20.
 */
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const TONF_TO_KN = 9.80665;

export const safeBenchLosa: ExampleDef = {
  id: "safe-bench-losa-cimentacion",
  name: "SAFE Benchmark · Losa Cimentación 6×8×0.50m, 6 cols (Δ +0.33%)",
  category: "4️⃣ Mixtos · 🧰 Cimentaciones",
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
    "Caso 2 del framework Hekatan vs SAFE 20 (paridad <0.33% en w_max)",
    "Losa rectangular 6×8m × 0.50m espesor sobre Winkler arena media (ks=2000 tonf/m³)",
    "6 columnas en grilla 2×3 (luz 3m×4m), P=20 tonf c/u (P_total=120 tonf)",
    "Resultado SAFE referencia: w_max col centrales = -1.587 mm (Hekatan -1.582)",
    "El colormap muestra Uz (desplazamiento vertical), max en bajo cols 3,4 (centrales)",
  ],
  params: {
    Lz: { default: 6.0, min: 3, max: 15, step: 0.5, label: "Lz (m, eje x)" },
    Bz: { default: 8.0, min: 3, max: 20, step: 0.5, label: "Bz (m, eje y)" },
    tz: { default: 0.50, min: 0.2, max: 1.5, step: 0.05, label: "t (m, espesor)" },
    ks_tonfm3: { default: 2000, min: 500, max: 10000, step: 100, label: "ks (tonf/m³)" },
    P_tonf: { default: 20, min: 1, max: 100, step: 1, label: "P por col (tonf)" },
    nx: { default: 12, min: 6, max: 24, step: 2, label: "nx mesh" },
    ny: { default: 16, min: 6, max: 32, step: 2, label: "ny mesh" },
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
    const h_ped = p.h_ped, b_ped = p.b_ped;

    const colXs = [Lz / 4, 3 * Lz / 4];
    const colYs = [Bz / 4, Bz / 2, 3 * Bz / 4];
    const colPositions: Array<[number, number]> = [];
    for (const cx of colXs) for (const cy of colYs) colPositions.push([cx, cy]);

    // ── Nodes 3D: zapata en z=0 + TOPs columnas en z=h_ped ──
    const nodes: [number, number, number][] = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i)
        nodes.push([i * dx, j * dy, 0]);

    const findNode = (xT: number, yT: number) => {
      let best = -1, bestD = Infinity;
      for (let k = 0; k < nxn * nyn; ++k) {
        const d = (nodes[k][0] - xT) ** 2 + (nodes[k][1] - yT) ** 2;
        if (d < bestD) { bestD = d; best = k; }
      }
      return best;
    };
    const colBaseIdx = colPositions.map(([cx, cy]) => findNode(cx, cy));
    const colTopIdx = colPositions.map(([cx, cy]) => {
      nodes.push([cx, cy, h_ped]);
      return nodes.length - 1;
    });

    // ── Elements: shells Q4 + frames verticales (columnas) ──
    const elements: number[][] = [];
    const elemStart_shell = 0;
    for (let j = 0; j < ny; ++j)
      for (let i = 0; i < nx; ++i) {
        const n0 = j * nxn + i;
        elements.push([n0, n0 + 1, n0 + nxn + 1, n0 + nxn]);
      }
    const elemStart_frame = elements.length;
    colBaseIdx.forEach((bIdx, k) => elements.push([bIdx, colTopIdx[k]]));

    // ── Springs Winkler en nodos de zapata (dof=2 = uz global 6-DOF) ──
    const springs: Array<{ node: number; dof: number; k: number }> = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i) {
        const onEdgeI = (i === 0 || i === nxn - 1);
        const onEdgeJ = (j === 0 || j === nyn - 1);
        const factor = onEdgeI && onEdgeJ ? 0.25 : (onEdgeI || onEdgeJ ? 0.5 : 1.0);
        const A_trib = dx * dy * factor;
        const nodeIdx = j * nxn + i;
        springs.push({ node: nodeIdx, dof: 2, k: ks * A_trib });
        if (onEdgeI && onEdgeJ) {
          const k_theta = 1e-6 * ks * dx * dy;
          springs.push({ node: nodeIdx, dof: 3, k: k_theta });
          springs.push({ node: nodeIdx, dof: 4, k: k_theta });
        }
      }

    // ── Cargas en TOPs de columnas (Fz negativo = abajo) ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    colTopIdx.forEach(idx => loads.set(idx, [0, 0, -P_kN, 0, 0, 0]));

    // ── Element inputs: shells + frames ──
    const E_kNm2 = 24855e3, nu = 0.20;
    const G = E_kNm2 / (2 * (1 + nu));
    const A_c = b_ped * b_ped;
    const I_c = b_ped ** 4 / 12;
    const J_c = 0.141 * b_ped ** 4;

    const elasticities = new Map<number, number>();
    const poissonsRatios = new Map<number, number>();
    const thicknesses = new Map<number, number>();
    const areas = new Map<number, number>();
    const momentsOfInertiaY = new Map<number, number>();
    const momentsOfInertiaZ = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const torsionalConstants = new Map<number, number>();

    // Shells (zapatas Q4)
    for (let i = elemStart_shell; i < elemStart_frame; ++i) {
      elasticities.set(i, E_kNm2);
      poissonsRatios.set(i, nu);
      thicknesses.set(i, tz);
    }
    // Frames (columnas verticales)
    for (let i = elemStart_frame; i < elements.length; ++i) {
      elasticities.set(i, E_kNm2);
      poissonsRatios.set(i, nu);
      areas.set(i, A_c);
      momentsOfInertiaY.set(i, I_c);
      momentsOfInertiaZ.set(i, I_c);
      shearModuli.set(i, G);
      torsionalConstants.set(i, J_c);
    }

    const nodeInputs = { supports: new Map(), loads, springs };   // springs tambien al .f2k (SAFE)
    const elementInputs = {
      elasticities, poissonsRatios, thicknesses,
      areas, momentsOfInertiaZ, momentsOfInertiaY,
      shearModuli, torsionalConstants,
    };

    // ── Solver mixto shells + frames ──
    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs as any;
    states.elementInputs.val = elementInputs;

    try {
      const r = deform(nodes, elements, nodeInputs as any, elementInputs, springs);
      states.deformOutputs.val = r;
      const ao = analyze(nodes, elements, elementInputs, r);

      // Pressure custom (no la computa analyze, la agrego)
      const pressure = new Map<number, number[]>();
      for (let e = elemStart_shell; e < elemStart_frame; ++e) {
        const el = elements[e];
        if (el.length !== 4) continue;
        const qPerNode = el.map(n => {
          const d = r.deformations?.get(n);
          return d ? ks * d[2] : 0;
        });
        pressure.set(e, qPerNode);
      }
      (ao as any).pressure = pressure;
      states.analyzeOutputs.val = ao;
    } catch (e) {
      console.error("safe-bench-losa solver error:", e);
    }

    states.objects3D.val = [];
  },
};
