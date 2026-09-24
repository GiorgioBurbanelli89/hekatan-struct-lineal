/**
 * Viga de Cimentación: zapata corrida (shell) + viga (frame longitudinal) + pedestales (frames verticales).
 *
 * Modelo estructural realista:
 *   • Zapata corrida → shell Q4 sobre Winkler (z=0)
 *   • Viga de cimentación → frame longitudinal corriendo a lo largo del eje central
 *   • Pedestales → frames verticales cortos (debajo del contrapiso)
 *
 * Solver mixto deform+analyze (mismo enfoque que safe-bench-losa-cimentacion).
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
  // Zapata: prisma extruido HACIA ARRIBA desde z=0 hasta z=t_zap.
  // z=0 es la cara INFERIOR (base cimentación, donde se anclan aceros).
  const geom = new THREE.BoxGeometry(L, B, t);
  const edges = new THREE.EdgesGeometry(geom);
  const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, linewidth: 2 }));
  lines.position.set(L / 2, B / 2, t / 2);
  return [lines];
}

export const safeBenchViga: ExampleDef = {
  id: "safe-bench-viga-cimentacion",
  name: "Viga de Cimentación · Zapata corrida + Viga + Pedestales",
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
    "Modelo estructural compuesto típico de cimentación corrida:",
    " • Zapata corrida → shell Q4 sobre Winkler springs (Lz × Bz × t_zap)",
    " • Viga de cimentación → frame longitudinal a lo largo del eje central (b_viga × h_viga)",
    " • Pedestales → frames verticales cortos debajo del contrapiso (b_ped × h_ped)",
    "Las cargas P bajan por los pedestales → viga → distribuidas a la zapata vía Winkler.",
  ],
  params: {
    Lz: { default: 8.0, min: 4, max: 20, step: 0.5, label: "Lz longitudinal (m)" },
    Bz: { default: 1.0, min: 0.5, max: 3, step: 0.25, label: "Bz ancho zapata (m)" },
    t_zap: { default: 0.40, min: 0.2, max: 1.0, step: 0.05, label: "t_zap espesor (m)" },
    b_viga: { default: 0.30, min: 0.2, max: 0.6, step: 0.05, label: "b_viga ancho (m)" },
    h_viga: { default: 0.50, min: 0.3, max: 1.0, step: 0.05, label: "h_viga canto (m)" },
    h_ped: { default: 0.50, min: 0.2, max: 1.5, step: 0.05, label: "Hp pedestal (m)" },
    b_ped: { default: 0.40, min: 0.2, max: 0.8, step: 0.05, label: "lado pedestal (m)" },
    ks_tonfm3: { default: 2000, min: 500, max: 10000, step: 100, label: "ks (tonf/m³)" },
    P_tonf: { default: 20, min: 1, max: 100, step: 1, label: "P por col (tonf)" },
    nCols: { default: 4, min: 2, max: 8, step: 1, label: "N pedestales" },
    nx: { default: 32, min: 8, max: 64, step: 4, label: "nx mesh (longitudinal)" },
    ny: { default: 4, min: 2, max: 10, step: 1, label: "ny mesh (transversal)" },
  },
  build(p, states) {
    const Lz = p.Lz, Bz = p.Bz, t_zap = p.t_zap;
    const b_viga = p.b_viga, h_viga = p.h_viga;
    const h_ped = p.h_ped, b_ped = p.b_ped;
    const ks = p.ks_tonfm3 * TONF_TO_KN;
    const P_kN = p.P_tonf * TONF_TO_KN;
    const nCols = Math.round(p.nCols);
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nxn = nx + 1, nyn = ny + 1;
    const dx = Lz / nx, dy = Bz / ny;

    // Asegurar que ny es par para que exista la línea central exacta y=Bz/2
    const yCenter = Bz / 2;
    const jCenter = Math.round(ny / 2);   // índice fila central del shell (aprox)

    // Pedestales equiespaciados a lo largo de la línea central
    const colPositions: Array<[number, number]> = [];
    for (let k = 1; k <= nCols; ++k) {
      const cx = (k * Lz) / (nCols + 1);
      colPositions.push([cx, yCenter]);
    }

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

    // ── Nodos top-pedestal ──
    // Convención: z=0 es la cara INFERIOR de la cimentación (base donde se anclan
    // los aceros). Todos los frames arrancan ahí. Top del pedestal queda en
    // z = h_viga + h_ped (la altura visible sobre la cimentación).
    const zPedTop = h_viga + h_ped;
    const colBaseIdx = colPositions.map(([cx, cy]) => findShellNode(cx, cy));
    const colTopIdx = colPositions.map(([cx, cy]) => {
      nodes.push([cx, cy, zPedTop]);
      return nodes.length - 1;
    });

    // ── Elementos: shells Q4 + viga frame + pedestal frames ──
    const elements: number[][] = [];
    const elemStart_shell = 0;
    for (let j = 0; j < ny; ++j)
      for (let i = 0; i < nx; ++i) {
        const n0 = j * nxn + i;
        elements.push([n0, n0 + 1, n0 + nxn + 1, n0 + nxn]);
      }
    const elemStart_viga = elements.length;
    // Viga longitudinal: frames consecutivos en la línea central (j=jCenter)
    for (let i = 0; i < nx; ++i) {
      const n0 = jCenter * nxn + i;
      const n1 = jCenter * nxn + (i + 1);
      elements.push([n0, n1]);
    }
    const elemStart_ped = elements.length;
    // Pedestales: frames verticales
    colBaseIdx.forEach((bIdx, k) => elements.push([bIdx, colTopIdx[k]]));

    // ── Winkler springs en nodos zapata (dof=2 = uz global) ──
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

    // ── Cargas P en top de pedestales (Fz negativo) ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    colTopIdx.forEach(idx => loads.set(idx, [0, 0, -P_kN, 0, 0, 0]));

    // ── Propiedades de materiales y secciones ──
    const E_kNm2 = 24855e3, nu = 0.20;
    const G = E_kNm2 / (2 * (1 + nu));
    const A_v = b_viga * h_viga;
    const Iz_v = (b_viga * h_viga ** 3) / 12;     // flexión vertical (sobre eje horizontal)
    const Iy_v = (h_viga * b_viga ** 3) / 12;     // flexión horizontal
    const J_v = 0.28 * b_viga * h_viga ** 3;       // torsión rectangular aprox
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

    // Shells zapata corrida
    for (let i = elemStart_shell; i < elemStart_viga; ++i) {
      elasticities.set(i, E_kNm2);
      poissonsRatios.set(i, nu);
      thicknesses.set(i, t_zap);
    }
    // Viga frame longitudinal
    for (let i = elemStart_viga; i < elemStart_ped; ++i) {
      elasticities.set(i, E_kNm2);
      poissonsRatios.set(i, nu);
      areas.set(i, A_v);
      momentsOfInertiaY.set(i, Iz_v);
      momentsOfInertiaZ.set(i, Iy_v);
      shearModuli.set(i, G);
      torsionalConstants.set(i, J_v);
    }
    // Pedestales frames verticales
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

    // ── Solver mixto shells + frames ──
    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs as any;
    states.elementInputs.val = elementInputs;

    try {
      const r = deform(nodes, elements, nodeInputs as any, elementInputs, springs);
      states.deformOutputs.val = r;
      const ao = analyze(nodes, elements, elementInputs, r);

      // Pressure custom: q = ks × w por nodo del shell
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
      states.analyzeOutputs.val = ao;
    } catch (e) {
      console.error("safe-bench-viga solver error:", e);
    }

    // ── Visualización: wireframes extruidos HACIA ARRIBA desde z=0 ──
    // Convención: z=0 es la cara INFERIOR de todo (base cimentación).
    // Cada elemento parte de ahí y se extruye hacia arriba con sus dimensiones reales.
    const objs: THREE.Object3D[] = [];
    // Zapata corrida: prisma de z=0 a z=t_zap (naranja)
    objs.push(...buildZapataWireframe(Lz, Bz, t_zap));
    // Viga: prisma de z=0 a z=h_viga, ancho b_viga, en y=B/2 (marrón)
    objs.push(...buildBeamWireframe(0, Lz, yCenter, 0, b_viga, h_viga));
    // Pedestales: prismas de z=0 a z=h_viga+h_ped, en cada posición de columna (azul)
    for (const [cx, cy] of colPositions) {
      objs.push(...buildPedestalWireframe(cx, cy, 0, h_viga + h_ped, b_ped));
    }
    states.objects3D.val = objs;
  },
};
