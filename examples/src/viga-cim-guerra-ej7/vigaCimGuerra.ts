/**
 * Viga de Cimentación · Ejercicio 7 del libro de Ing. Marcelo Guerra Avendaño (MDI).
 * Figura 190 — viga corrida con 4 columnas de 60×60cm, cargas CM+CV con momentos por columna.
 *
 * Modelo: zapata corrida (shell Q4 + Winkler) + viga (frame longitudinal) + pedestales (frames).
 * Solver mixto deform+analyze (mismo enfoque que safe-bench-losa-cimentacion).
 *
 * DATOS DEL LIBRO (Figura 190):
 *   L = 17.20 m, columnas 60×60 cm, f'c = 240 kg/cm², q_adm = 18 t/m²
 *   Cargas (CM + CV) en cada columna [P (tonf), M (tonf·m)]:
 *     Col 1: P = 127.50, M =  4.50
 *     Col 2: P = 187.50, M =  6.75
 *     Col 3: P = 210.00, M = -9.00
 *     Col 4: P = 128.00, M = -4.50
 *   Momentos del libro orientados como flexión en plano XZ (alrededor de eje Y global).
 */
import * as THREE from "three";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const TONF_TO_KN = 9.80665;

function buildBeamWireframe(x1: number, x2: number, yC: number, zBottom: number, b: number, h: number, color: number = 0x8b4513): THREE.Object3D[] {
  const Lx = Math.abs(x2 - x1);
  const geom = new THREE.BoxGeometry(Lx, b, h);
  const edges = new THREE.EdgesGeometry(geom);
  const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, linewidth: 2 }));
  lines.position.set((x1 + x2) / 2, yC, zBottom + h / 2);
  return [lines];
}

function buildPedestalWireframe(x: number, y: number, zBottom: number, h: number, side: number, color: number = 0x4682b4): THREE.Object3D[] {
  const geom = new THREE.BoxGeometry(side, side, h);
  const edges = new THREE.EdgesGeometry(geom);
  const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, linewidth: 2 }));
  lines.position.set(x, y, zBottom + h / 2);
  return [lines];
}

function buildZapataWireframe(L: number, B: number, t: number, color: number = 0xff8c00): THREE.Object3D[] {
  // Zapata corrida 3D: prisma extruido HACIA ARRIBA desde z=0 hasta z=t_zap.
  // Convención: z=0 es la cara INFERIOR (base de la cimentación, donde se anclan
  // los aceros de viga y columna). Todos los frames también arrancan en z=0.
  const geom = new THREE.BoxGeometry(L, B, t);
  const edges = new THREE.EdgesGeometry(geom);
  const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, linewidth: 2 }));
  lines.position.set(L / 2, B / 2, t / 2);
  return [lines];
}

export const vigaCimGuerraEj7: ExampleDef = {
  id: "viga-cim-guerra-ej7",
  name: "Ej.7 · Viga Cimentación (L=17.20m, 4 cols c/M)",
  category: "4️⃣ Mixtos · 🧰 Cimentaciones",
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
    "Ejercicio 7 — Ing. Marcelo Guerra Avendaño MDI (Figura 190)",
    "Viga de cimentación L = 17.20 m, 4 columnas 60×60cm con CM+CV y momentos.",
    "Cargas totales por columna (P, M):",
    "  Col 1: P=127.50 t, M= 4.50 t·m   Col 2: P=187.50 t, M= 6.75 t·m",
    "  Col 3: P=210.00 t, M=-9.00 t·m   Col 4: P=128.00 t, M=-4.50 t·m",
    "Materiales: f'c=240 kg/cm² (E≈23 GPa) · q_adm=18 t/m² → ks≈2160 t/m³ (Bowles 120·q_adm)",
    "Modelo: zapata corrida (shell+Winkler) + viga (frame) + pedestales (frames). ΣP=653 t.",
  ],
  params: {
    L: { default: 17.20, min: 10, max: 25, step: 0.20, label: "L viga (m)" },
    Bz: { default: 2.00, min: 0.8, max: 3.5, step: 0.10, label: "B ancho zapata (m)" },
    t_zap: { default: 0.40, min: 0.2, max: 1.0, step: 0.05, label: "t_zap espesor (m)" },
    b_viga: { default: 0.40, min: 0.2, max: 0.8, step: 0.05, label: "b_viga ancho (m)" },
    h_viga: { default: 0.80, min: 0.4, max: 1.5, step: 0.05, label: "h_viga canto (m)" },
    h_ped: { default: 0.50, min: 0.2, max: 1.5, step: 0.05, label: "Hp pedestal (m)" },
    b_ped: { default: 0.60, min: 0.4, max: 0.8, step: 0.05, label: "b_ped columna (m)" },
    // Posiciones de columnas (default: equiespaciadas a lo largo de L con voladizos iguales)
    x1: { default: 3.44, min: 0.5, max: 8,  step: 0.10, label: "x col 1 (m)", folder: "Posiciones" },
    x2: { default: 6.88, min: 0.5, max: 12, step: 0.10, label: "x col 2 (m)", folder: "Posiciones" },
    x3: { default: 10.32, min: 0.5, max: 16, step: 0.10, label: "x col 3 (m)", folder: "Posiciones" },
    x4: { default: 13.76, min: 0.5, max: 17, step: 0.10, label: "x col 4 (m)", folder: "Posiciones" },
    // Cargas axiales (CM + CV) en tonf
    P1: { default: 127.50, min: 0, max: 500, step: 1, label: "P1 (tonf)", folder: "Cargas axiales (D+L)" },
    P2: { default: 187.50, min: 0, max: 500, step: 1, label: "P2 (tonf)", folder: "Cargas axiales (D+L)" },
    P3: { default: 210.00, min: 0, max: 500, step: 1, label: "P3 (tonf)", folder: "Cargas axiales (D+L)" },
    P4: { default: 128.00, min: 0, max: 500, step: 1, label: "P4 (tonf)", folder: "Cargas axiales (D+L)" },
    // Momentos (CM + CV) en tonf·m
    M1: { default:  4.50, min: -30, max: 30, step: 0.10, label: "M1 (tonf·m)", folder: "Momentos (D+L)" },
    M2: { default:  6.75, min: -30, max: 30, step: 0.10, label: "M2 (tonf·m)", folder: "Momentos (D+L)" },
    M3: { default: -9.00, min: -30, max: 30, step: 0.10, label: "M3 (tonf·m)", folder: "Momentos (D+L)" },
    M4: { default: -4.50, min: -30, max: 30, step: 0.10, label: "M4 (tonf·m)", folder: "Momentos (D+L)" },
    // Suelo
    ks_tonfm3: { default: 2160, min: 500, max: 10000, step: 100, label: "ks (tonf/m³)", folder: "Suelo" },
    q_adm: { default: 18, min: 5, max: 50, step: 0.5, label: "q_adm (tonf/m²)", folder: "Suelo" },
    nx: { default: 48, min: 16, max: 96, step: 4, label: "nx mesh (long)", folder: "Mesh" },
    ny: { default: 6, min: 4, max: 12, step: 2, label: "ny mesh (transv)", folder: "Mesh" },
  },
  computedLabels(p) {
    const Ptot = p.P1 + p.P2 + p.P3 + p.P4;
    const Mtot = p.M1 + p.M2 + p.M3 + p.M4;
    const Ac = p.L * p.Bz;
    const q_med = Ptot / Ac;  // tonf/m²
    return {
      "ΣP (tonf)": Ptot.toFixed(1),
      "ΣM (tonf·m)": Mtot.toFixed(2),
      "Área zapata (m²)": Ac.toFixed(2),
      "q_med = ΣP/A (tonf/m²)": q_med.toFixed(2),
      "ratio q_med/q_adm": (q_med / p.q_adm).toFixed(3),
    };
  },
  build(p, states) {
    const L = p.L, Bz = p.Bz, t_zap = p.t_zap;
    const b_viga = p.b_viga, h_viga = p.h_viga;
    const h_ped = p.h_ped, b_ped = p.b_ped;
    const ks = p.ks_tonfm3 * TONF_TO_KN;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nxn = nx + 1, nyn = ny + 1;
    const dx = L / nx, dy = Bz / ny;
    const yCenter = Bz / 2;
    const jCenter = Math.round(ny / 2);

    // Posiciones y cargas por columna
    const colPositions: Array<[number, number]> = [
      [p.x1, yCenter], [p.x2, yCenter], [p.x3, yCenter], [p.x4, yCenter],
    ];
    const colLoadsP_kN = [p.P1, p.P2, p.P3, p.P4].map(v => v * TONF_TO_KN);
    const colLoadsM_kNm = [p.M1, p.M2, p.M3, p.M4].map(v => v * TONF_TO_KN);

    // ── Nodos shell (z=0) ──
    const nodes: [number, number, number][] = [];
    for (let j = 0; j < nyn; ++j)
      for (let i = 0; i < nxn; ++i)
        nodes.push([i * dx, j * dy, 0]);

    const findShellNode = (xT: number, yT: number) => {
      let best = -1, bestD = Infinity;
      for (let k = 0; k < nxn * nyn; ++k) {
        const d = (nodes[k][0] - xT) ** 2 + (nodes[k][1] - yT) ** 2;
        if (d < bestD) { bestD = d; best = k; }
      }
      return best;
    };

    // ── Nodos top de pedestales ──
    // Convención: z=0 es la cara INFERIOR (base cimentación) — donde están TODOS
    // los nodos del shell y la base de las columnas. Los pedestales se extruyen
    // hacia arriba como un único frame de longitud (h_viga + h_ped) cuyo top
    // queda justo encima del canto de la viga + altura expuesta del pedestal.
    const zPedTop = h_viga + h_ped;
    const colBaseIdx = colPositions.map(([cx, cy]) => findShellNode(cx, cy));
    const colTopIdx = colPositions.map(([cx, cy]) => {
      nodes.push([cx, cy, zPedTop]);
      return nodes.length - 1;
    });

    // ── Elementos: shells + viga + pedestales ──
    const elements: number[][] = [];
    const elemStart_shell = 0;
    for (let j = 0; j < ny; ++j)
      for (let i = 0; i < nx; ++i) {
        const n0 = j * nxn + i;
        elements.push([n0, n0 + 1, n0 + nxn + 1, n0 + nxn]);
      }
    const elemStart_viga = elements.length;
    for (let i = 0; i < nx; ++i) {
      const n0 = jCenter * nxn + i;
      const n1 = jCenter * nxn + (i + 1);
      elements.push([n0, n1]);
    }
    const elemStart_ped = elements.length;
    colBaseIdx.forEach((bIdx, k) => elements.push([bIdx, colTopIdx[k]]));

    // ── Winkler springs ──
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

    // ── Cargas en top de pedestales: [Fx, Fy, Fz, Mx, My, Mz] ──
    // Momento del libro orientado como flexión XZ → My global (dof=4)
    const loads = new Map<number, [number, number, number, number, number, number]>();
    colTopIdx.forEach((idx, k) => {
      loads.set(idx, [0, 0, -colLoadsP_kN[k], 0, colLoadsM_kNm[k], 0]);
    });

    // ── Materiales: f'c = 240 kg/cm² ──
    // E_concreto ACI: E = 4700·√f'c MPa con f'c en MPa
    // f'c = 240 kg/cm² ≈ 23.54 MPa → E ≈ 4700·√23.54 ≈ 22,800 MPa ≈ 22.8 GPa = 22.8e6 kN/m²
    const E_kNm2 = 22800e3;
    const nu = 0.20;
    const G = E_kNm2 / (2 * (1 + nu));

    const A_v = b_viga * h_viga;
    const Iz_v = (b_viga * h_viga ** 3) / 12;
    const Iy_v = (h_viga * b_viga ** 3) / 12;
    const J_v = 0.28 * b_viga * h_viga ** 3;
    const A_p = b_ped * b_ped;
    const I_p = b_ped ** 4 / 12;
    const J_p = 0.141 * b_ped ** 4;

    const elasticities = new Map<number, number>();
    const poissonsRatios = new Map<number, number>();
    const thicknesses = new Map<number, number>();
    const areas = new Map<number, number>();
    const momentsOfInertiaY = new Map<number, number>();
    const momentsOfInertiaZ = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const torsionalConstants = new Map<number, number>();

    for (let i = elemStart_shell; i < elemStart_viga; ++i) {
      elasticities.set(i, E_kNm2);
      poissonsRatios.set(i, nu);
      thicknesses.set(i, t_zap);
    }
    for (let i = elemStart_viga; i < elemStart_ped; ++i) {
      elasticities.set(i, E_kNm2);
      poissonsRatios.set(i, nu);
      areas.set(i, A_v);
      momentsOfInertiaY.set(i, Iz_v);
      momentsOfInertiaZ.set(i, Iy_v);
      shearModuli.set(i, G);
      torsionalConstants.set(i, J_v);
    }
    for (let i = elemStart_ped; i < elements.length; ++i) {
      elasticities.set(i, E_kNm2);
      poissonsRatios.set(i, nu);
      areas.set(i, A_p);
      momentsOfInertiaY.set(i, I_p);
      momentsOfInertiaZ.set(i, I_p);
      shearModuli.set(i, G);
      torsionalConstants.set(i, J_p);
    }

    const nodeInputs = { supports: new Map(), loads, springs };   // springs tambien al .f2k (SAFE)
    const elementInputs = {
      elasticities, poissonsRatios, thicknesses,
      areas, momentsOfInertiaZ, momentsOfInertiaY,
      shearModuli, torsionalConstants,
    };

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs as any;
    states.elementInputs.val = elementInputs;

    try {
      const r = deform(nodes, elements, nodeInputs as any, elementInputs, springs);
      states.deformOutputs.val = r;
      const ao = analyze(nodes, elements, elementInputs, r);

      const pressure = new Map<number, number[]>();
      for (let e = elemStart_shell; e < elemStart_viga; ++e) {
        const el = elements[e];
        if (el.length !== 4) continue;
        const qPerNode = el.map(n => {
          const d = r.deformations?.get(n);
          return d ? ks * d[2] : 0;
        });
        pressure.set(e, qPerNode);
      }
      (ao as any).pressure = pressure;
      // Override range del colormap. Orden [-q_adm, 0] (más-negativo primero) → máx
      // compresión = magenta (como SAFE/ETABS). [0,-q_adm] quedaba invertido (máx=azul).
      (ao as any).colorMapRanges = { pressure: [-p.q_adm * TONF_TO_KN, 0] };
      states.analyzeOutputs.val = ao;
    } catch (e) {
      console.error("viga-cim-guerra solver error:", e);
    }

    // ── Visualización: wireframes extruidos HACIA ARRIBA desde z=0 ──
    // Convención: z=0 es la cara INFERIOR de todo (base cimentación).
    // Cada elemento parte de ahí y se extruye hacia arriba con sus dimensiones reales.
    const objs: THREE.Object3D[] = [];
    // Zapata corrida: prisma de z=0 a z=t_zap (naranja)
    objs.push(...buildZapataWireframe(L, Bz, t_zap));
    // Viga: prisma de z=0 a z=h_viga, ancho b_viga, en y=B/2 (marrón)
    objs.push(...buildBeamWireframe(0, L, yCenter, 0, b_viga, h_viga));
    // Pedestales: prismas de z=0 a z=h_viga+h_ped, en cada posición de columna (azul)
    for (const [cx, cy] of colPositions) {
      objs.push(...buildPedestalWireframe(cx, cy, 0, h_viga + h_ped, b_ped));
    }
    states.objects3D.val = objs;
  },
};
