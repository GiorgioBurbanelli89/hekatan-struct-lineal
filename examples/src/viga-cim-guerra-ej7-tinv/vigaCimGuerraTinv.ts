/**
 * Viga de Cimentación · Ej.7 Guerra — modelo VIGA T INVERTIDA (sin shell).
 *
 * Alternativa al caso shell+frame: aquí la zapata + viga forman una única
 * sección T invertida modelada como un frame longitudinal sobre Winkler 1D.
 * Pedestales como frames verticales en cada columna.
 *
 * Comparación con `viga-cim-guerra-ej7`:
 *   Caso 1 (shell+frame): Shell Q4 zapata + Frame viga + Frame pedestal.
 *     - Más detallado, muestra distribución de presión 2D sobre la zapata.
 *     - Costo: shell con nx·ny elementos = más DOFs.
 *   Caso 2 (T invertida) : Frame T-section + Frame pedestal.
 *     - Simplificación clásica de "viga sobre fundación elástica" (Hetényi).
 *     - Pierde la distribución transversal de presión (solo longitudinal).
 *     - Más rápido, menos DOFs.
 *
 * SECCIÓN T INVERTIDA:
 *   Ala (patín inferior): B × t_zap (ej. 2.00 × 0.40 m)
 *   Alma (web vertical):  b_viga × h_viga (ej. 0.40 × 0.80 m)
 *   Origen: cara inferior del patín en z=0. Centroide y̅ calculado analíticamente.
 *
 * WINKLER 1D:
 *   K_z por nodo del frame = ks × B × Δx_trib (la presión se reparte en el ancho B)
 */
import * as THREE from "three";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const TONF_TO_KN = 9.80665;

function buildTSectionWireframe(L: number, B: number, t_zap: number, b_viga: number, h_viga: number, color: number = 0xff8c00): THREE.Object3D[] {
  // Sección T invertida 3D: ala horizontal (B × t_zap) + alma vertical (b_viga × h_viga).
  // Ambos prismas dibujados como wireframes, extruidos hacia arriba desde z=0.
  const out: THREE.Object3D[] = [];
  const mat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
  // Ala (patín inferior): de z=0 a z=t_zap, ancho B
  const gAla = new THREE.BoxGeometry(L, B, t_zap);
  const lAla = new THREE.LineSegments(new THREE.EdgesGeometry(gAla), mat);
  lAla.position.set(L / 2, B / 2, t_zap / 2);
  out.push(lAla);
  // Alma: de z=t_zap a z=t_zap+h_viga, ancho b_viga, en y=B/2
  const gAlma = new THREE.BoxGeometry(L, b_viga, h_viga);
  const lAlma = new THREE.LineSegments(new THREE.EdgesGeometry(gAlma), new THREE.LineBasicMaterial({ color: 0x8b4513, linewidth: 2 }));
  lAlma.position.set(L / 2, B / 2, t_zap + h_viga / 2);
  out.push(lAlma);
  return out;
}

function buildPedestalWireframe(x: number, y: number, zBottom: number, h: number, side: number, color: number = 0x4682b4): THREE.Object3D[] {
  const geom = new THREE.BoxGeometry(side, side, h);
  const edges = new THREE.EdgesGeometry(geom);
  const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, linewidth: 2 }));
  lines.position.set(x, y, zBottom + h / 2);
  return [lines];
}

/** Propiedades de la sección T invertida (origen z=0 en cara inferior del patín). */
function tSectionProps(B: number, t_zap: number, b_viga: number, h_viga: number) {
  const A_ala  = B * t_zap;
  const A_alma = b_viga * h_viga;
  const A = A_ala + A_alma;
  // Centroide y̅ medido desde z=0 (cara inferior del patín)
  const y_ala  = t_zap / 2;
  const y_alma = t_zap + h_viga / 2;
  const ybar = (A_ala * y_ala + A_alma * y_alma) / A;
  // Momento de inercia alrededor del eje horizontal (Y global del modelo) — flexión vertical
  // Teorema de ejes paralelos
  const I_ala_local  = (B * t_zap ** 3) / 12;
  const I_alma_local = (b_viga * h_viga ** 3) / 12;
  const Iy = I_ala_local + A_ala * (ybar - y_ala) ** 2
           + I_alma_local + A_alma * (ybar - y_alma) ** 2;
  // Momento de inercia alrededor del eje vertical (Z global) — flexión lateral
  // (simétrico respecto al eje vertical central, no hay corrección por excentricidad)
  const Iz = (t_zap * B ** 3) / 12 + (h_viga * b_viga ** 3) / 12;
  // Constante torsional J: suma de Saint-Venant para rectángulos delgados
  const J_rect = (b: number, h: number) => {
    const a = Math.max(b, h) / 2, c = Math.min(b, h) / 2;
    return a * c ** 3 * (16 / 3 - 3.36 * (c / a) * (1 - (c / a) ** 4 / 12));
  };
  const J = J_rect(B, t_zap) + J_rect(b_viga, h_viga);
  return { A, ybar, Iy, Iz, J };
}

export const vigaCimGuerraEj7Tinv: ExampleDef = {
  id: "viga-cim-guerra-ej7-tinv",
  name: "Ej.7 · Viga Cimentación (T invertida + pedestales)",
  // Medido: 52 BARRAS y ninguna cascara. La viga T invertida esta modelada
  // con frames sobre resortes, no con placas.
  category: "1️⃣ Frames · 🎯 2 GDL Flexión",
  defaultShellResult: "displacementZ",
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
    "Ejercicio 7 Guerra MDI — variante VIGA T INVERTIDA (Hetényi sobre Winkler)",
    "Sección T invertida (ala B×t_zap + alma b_viga×h_viga) como UN solo frame longitudinal.",
    "Comparar con `viga-cim-guerra-ej7` (caso shell+frame), mismas cargas y propiedades.",
    "Sin shell: pierde distribución transversal de presión, pero más rápido y simple.",
    "Cargas (CM+CV) por columna idénticas al caso shell — para comparación 1-a-1.",
  ],
  params: {
    L: { default: 17.20, min: 10, max: 25, step: 0.20, label: "L viga (m)" },
    Bz: { default: 2.00, min: 0.8, max: 3.5, step: 0.10, label: "B ancho ala/patín (m)" },
    t_zap: { default: 0.40, min: 0.2, max: 1.0, step: 0.05, label: "t_zap espesor patín (m)" },
    b_viga: { default: 0.40, min: 0.2, max: 0.8, step: 0.05, label: "b_viga ancho alma (m)" },
    h_viga: { default: 0.80, min: 0.4, max: 1.5, step: 0.05, label: "h_viga canto alma (m)" },
    h_ped: { default: 0.50, min: 0.2, max: 1.5, step: 0.05, label: "Hp pedestal (m)" },
    b_ped: { default: 0.60, min: 0.4, max: 0.8, step: 0.05, label: "b_ped columna (m)" },
    x1: { default: 3.44, min: 0.5, max: 8,  step: 0.10, label: "x col 1 (m)", folder: "Posiciones" },
    x2: { default: 6.88, min: 0.5, max: 12, step: 0.10, label: "x col 2 (m)", folder: "Posiciones" },
    x3: { default: 10.32, min: 0.5, max: 16, step: 0.10, label: "x col 3 (m)", folder: "Posiciones" },
    x4: { default: 13.76, min: 0.5, max: 17, step: 0.10, label: "x col 4 (m)", folder: "Posiciones" },
    P1: { default: 127.50, min: 0, max: 500, step: 1, label: "P1 (tonf)", folder: "Cargas axiales (D+L)" },
    P2: { default: 187.50, min: 0, max: 500, step: 1, label: "P2 (tonf)", folder: "Cargas axiales (D+L)" },
    P3: { default: 210.00, min: 0, max: 500, step: 1, label: "P3 (tonf)", folder: "Cargas axiales (D+L)" },
    P4: { default: 128.00, min: 0, max: 500, step: 1, label: "P4 (tonf)", folder: "Cargas axiales (D+L)" },
    M1: { default:  4.50, min: -30, max: 30, step: 0.10, label: "M1 (tonf·m)", folder: "Momentos (D+L)" },
    M2: { default:  6.75, min: -30, max: 30, step: 0.10, label: "M2 (tonf·m)", folder: "Momentos (D+L)" },
    M3: { default: -9.00, min: -30, max: 30, step: 0.10, label: "M3 (tonf·m)", folder: "Momentos (D+L)" },
    M4: { default: -4.50, min: -30, max: 30, step: 0.10, label: "M4 (tonf·m)", folder: "Momentos (D+L)" },
    ks_tonfm3: { default: 2160, min: 500, max: 10000, step: 100, label: "ks (tonf/m³)", folder: "Suelo" },
    q_adm: { default: 18, min: 5, max: 50, step: 0.5, label: "q_adm (tonf/m²)", folder: "Suelo" },
    nx: { default: 48, min: 16, max: 96, step: 4, label: "nx (segmentos viga)", folder: "Mesh" },
  },
  computedLabels(p) {
    const Ptot = p.P1 + p.P2 + p.P3 + p.P4;
    const Mtot = p.M1 + p.M2 + p.M3 + p.M4;
    const Ac = p.L * p.Bz;
    const q_med = Ptot / Ac;
    const props = tSectionProps(p.Bz, p.t_zap, p.b_viga, p.h_viga);
    return {
      "ΣP (tonf)": Ptot.toFixed(1),
      "ΣM (tonf·m)": Mtot.toFixed(2),
      "Área zapata (m²)": Ac.toFixed(2),
      "q_med (tonf/m²)": q_med.toFixed(2),
      "ratio q_med/q_adm": (q_med / p.q_adm).toFixed(3),
      "A_T (m²)": props.A.toFixed(4),
      "ȳ centroide (m)": props.ybar.toFixed(4),
      "Iy_T (m⁴) flex.vert": props.Iy.toFixed(5),
      "Iz_T (m⁴) flex.lat": props.Iz.toFixed(5),
    };
  },
  build(p, states) {
    const L = p.L, Bz = p.Bz, t_zap = p.t_zap;
    const b_viga = p.b_viga, h_viga = p.h_viga;
    const h_ped = p.h_ped, b_ped = p.b_ped;
    const ks = p.ks_tonfm3 * TONF_TO_KN;
    const nx = Math.round(p.nx);
    const nxn = nx + 1;
    const dx = L / nx;
    const yCenter = Bz / 2;

    const colPositions: Array<[number, number]> = [
      [p.x1, yCenter], [p.x2, yCenter], [p.x3, yCenter], [p.x4, yCenter],
    ];
    const colLoadsP_kN = [p.P1, p.P2, p.P3, p.P4].map(v => v * TONF_TO_KN);
    const colLoadsM_kNm = [p.M1, p.M2, p.M3, p.M4].map(v => v * TONF_TO_KN);

    // ── Nodos del frame longitudinal (z=0) ──
    const nodes: [number, number, number][] = [];
    for (let i = 0; i < nxn; ++i) nodes.push([i * dx, yCenter, 0]);

    // Map de búsqueda de nodo frame por x
    const findFrameNode = (xT: number) => {
      let best = -1, bestD = Infinity;
      for (let k = 0; k < nxn; ++k) {
        const d = Math.abs(nodes[k][0] - xT);
        if (d < bestD) { bestD = d; best = k; }
      }
      return best;
    };

    // ── Nodos top de pedestales (z = h_viga + h_ped, midiendo desde z=0 cara inferior cimentación) ──
    // El TOP del pedestal queda sobre la zapata corrida: t_zap (espesor zapata) + h_viga (alma viga) + h_ped (pedestal expuesto)
    // PERO como el frame de la viga T tiene su eje en z=0 (cara inferior patín), el "top viga" está a z=t_zap+h_viga,
    // y el pedestal arranca ahí. Su top en z = t_zap + h_viga + h_ped.
    // Para mantener consistencia con el caso shell (donde base ped = z=0 share node), aquí:
    //   - Base pedestal en el nodo del frame viga (z=0)
    //   - Top pedestal en z = t_zap + h_viga + h_ped (TOP REAL incluyendo todo)
    const zPedTop = t_zap + h_viga + h_ped;
    const colBaseIdx = colPositions.map(([cx]) => findFrameNode(cx));
    const colTopIdx = colPositions.map(([cx, cy]) => {
      nodes.push([cx, cy, zPedTop]);
      return nodes.length - 1;
    });

    // ── Elementos ──
    const elements: number[][] = [];
    const elemStart_viga = 0;
    for (let i = 0; i < nx; ++i) elements.push([i, i + 1]);
    const elemStart_ped = elements.length;
    colBaseIdx.forEach((bIdx, k) => elements.push([bIdx, colTopIdx[k]]));

    // ── Winkler 1D: K_z por nodo = ks × B × Δx_trib ──
    const springs: Array<{ node: number; dof: number; k: number }> = [];
    for (let i = 0; i < nxn; ++i) {
      const dx_trib = (i === 0 || i === nxn - 1) ? dx / 2 : dx;
      const A_trib = Bz * dx_trib;        // ancho del patín × largo tributario
      springs.push({ node: i, dof: 2, k: ks * A_trib });
      // Anti-singularidad de rotación (kRot suave)
      if (i === 0 || i === nxn - 1) {
        const kRot = 1e-6 * ks * Bz * dx;
        springs.push({ node: i, dof: 3, k: kRot });
        springs.push({ node: i, dof: 5, k: kRot });
      }
    }

    // ── Cargas en top pedestales ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    colTopIdx.forEach((idx, k) => {
      loads.set(idx, [0, 0, -colLoadsP_kN[k], 0, colLoadsM_kNm[k], 0]);
    });

    // ── Materiales y propiedades T-section ──
    const E_kNm2 = 22800e3;
    const nu = 0.20;
    const G = E_kNm2 / (2 * (1 + nu));
    const T = tSectionProps(Bz, t_zap, b_viga, h_viga);
    const A_p = b_ped * b_ped;
    const I_p = b_ped ** 4 / 12;
    const J_p = 0.141 * b_ped ** 4;

    const elasticities = new Map<number, number>();
    const poissonsRatios = new Map<number, number>();
    const areas = new Map<number, number>();
    const momentsOfInertiaY = new Map<number, number>();
    const momentsOfInertiaZ = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const torsionalConstants = new Map<number, number>();

    // Frame viga T-section
    for (let i = elemStart_viga; i < elemStart_ped; ++i) {
      elasticities.set(i, E_kNm2);
      poissonsRatios.set(i, nu);
      areas.set(i, T.A);
      momentsOfInertiaY.set(i, T.Iz);     // flexión horizontal (lateral)
      momentsOfInertiaZ.set(i, T.Iy);     // flexión vertical (sobre eje horizontal)
      shearModuli.set(i, G);
      torsionalConstants.set(i, T.J);
    }
    // Pedestales
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
      elasticities, poissonsRatios,
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
      states.analyzeOutputs.val = ao;
    } catch (e) {
      console.error("viga-cim-guerra-tinv solver error:", e);
    }

    // ── Visualización: wireframes T-section + pedestales ──
    const objs: THREE.Object3D[] = [];
    objs.push(...buildTSectionWireframe(L, Bz, t_zap, b_viga, h_viga));
    for (const [cx, cy] of colPositions) {
      objs.push(...buildPedestalWireframe(cx, cy, t_zap + h_viga, h_ped, b_ped));
    }
    states.objects3D.val = objs;
  },
};
