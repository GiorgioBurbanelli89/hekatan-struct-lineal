/**
 * Cerramiento — pórtico plano de hormigón armado (columnas + vigas) sin
 * mampostería estructural, empotrado en la base. Pensado para diseño rápido
 * de cerramientos perimetrales de albañilería confinada (la mampostería de
 * ladrillo NO aporta rigidez al pórtico — solo es relleno).
 *
 * En este primer paso se modela SOLO el pórtico (columnas + viga superior).
 * La zapata se calcula aparte como cimentación (próximo paso).
 *
 * Módulo de elasticidad del hormigón:
 *   E = factorE · √(f'c)         [kgf/cm²]
 *   factorE = 14100 (NEC-Ecuador / ACI-318 para hormigón normal-weight)
 *   f'c en kgf/cm², E resultante en kgf/cm²
 *
 * Conversión a unidades SI del solver:
 *   1 kgf/cm² = 98.0665 kPa = 98.0665 kN/m²
 */
import * as THREE from "three";
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { makeLabel, makeCotaLine } from "../shared/cotas3D";

// 1 kgf/cm² = 98.0665 kN/m²
const KGFCM2_TO_KNM2 = 98.0665;

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const cerramiento: ExampleDef = {
  id: "cerramiento",
  name: "Cerramiento (pórtico plano N vanos)",
  category: "🧱 Construcción",
  defaultShellResult: "none",
  availableShellResults: [],
  hasModal: true,
  guide: [
    "Cambiá 'N vanos' para agregar/quitar columnas — se regeneran los sliders de luces.",
    "Cada vano (L₁, L₂, …) ajusta su luz independientemente.",
    "Columnas: hormigón 30×30 cm por defecto (b_col, h_col editables).",
    "E = factor·√(f'c) en kgf/cm². Factor=14100 (NEC Ecuador). f'c=210 kgf/cm² típico.",
    "Empotrado en la base. La zapata se diseña aparte (próximo módulo).",
  ],
  params: {
    // ── Geometría ──
    nVanos: { ...P("Geometría", "N vanos", 3, 1, 10, 1), regenOnChange: true },
    H:      P("Geometría", "Altura H (m)", 3.0, 2.0, 6.0, 0.1),
    nSubV:  P("Geometría", "Div. viga (1=sin discretizar)", 1, 1, 8, 1),
    nSubC:  P("Geometría", "Div. columna (1=sin discretizar)", 1, 1, 8, 1),

    // ── Secciones ──
    bCol:  P("Secciones", "b columna (m)", 0.30, 0.20, 0.60, 0.05),
    hCol:  P("Secciones", "h columna (m)", 0.30, 0.20, 0.60, 0.05),
    bViga: P("Secciones", "b viga (m)",    0.20, 0.15, 0.40, 0.05),
    hViga: P("Secciones", "h viga (m)",    0.30, 0.20, 0.60, 0.05),

    // ── Material (hormigón) — E = factor·√(f'c) en kgf/cm² ──
    factorE: P("Materiales", "factor E (NEC=14100)", 14100, 8000, 18000, 100),
    fc_kgcm2: P("Materiales", "f'c (kgf/cm²)", 210, 140, 420, 10),
    nu: P("Materiales", "ν Poisson", 0.20, 0.15, 0.25, 0.01),
    rho: P("Materiales", "γ (kN/m³)", 24, 20, 26, 0.5),

    // ── Cargas ──
    // Carga vertical distribuida sobre la viga superior (peso mampostería).
    // Mampostería burrito ladrillo ~ 0.13 m × γ_alb 18 kN/m³ × H_muro
    //   ≈ 0.13·18·3 = 7 kN/m por metro lineal de viga.
    q_vert: P("Cargas", "q viga (kN/m)", -7, -50, 0, 0.5),
    Ex: P("Cargas", "Ex lateral tope X (kN, in-plane→My)", 0, -100, 100, 1),
    Ey: P("Cargas", "Ey lateral tope Y (kN, out-of-plane→Mz)", 0, -100, 100, 1),
  },
  /**
   * Por cada vano genera un slider L_v{i} de longitud (m). Default 4 m.
   * El workspace preserva el valor existente al cambiar nVanos.
   */
  dynamicParams(cur) {
    const out: Record<string, any> = {};
    const n = Math.max(1, Math.round(cur.nVanos ?? 3));
    for (let i = 1; i <= n; i++) {
      out[`L_v${i}`] = P("Luces de vano", `L vano ${i} (m)`, 4.0, 1.0, 12.0, 0.25);
    }
    return out;
  },
  /**
   * Folder "📊 Calculados": muestra E en kgf/cm² (la unidad del usuario) y en
   * MPa para referencia. Así el ingeniero ve el valor que el solver usó.
   */
  computedLabels(p) {
    const E_kgfcm2 = p.factorE * Math.sqrt(p.fc_kgcm2);
    const E_kNm2 = E_kgfcm2 * KGFCM2_TO_KNM2;
    const E_MPa = E_kNm2 / 1000;
    return {
      "E = factor·√(f'c)": `${p.factorE.toFixed(0)} · √${p.fc_kgcm2.toFixed(0)} = ${E_kgfcm2.toFixed(0)} kgf/cm²`,
      "E (MPa)": `${E_MPa.toFixed(0)} MPa  (≈ ${(E_MPa / 1000).toFixed(2)} GPa)`,
      "G = E/(2(1+ν))": `${(E_kgfcm2 / (2 * (1 + p.nu))).toFixed(0)} kgf/cm²`,
    };
  },
  build(p, states) {
    const n = Math.max(1, Math.round(p.nVanos));
    const H = p.H;
    const nSubV = Math.max(1, Math.round(p.nSubV));
    const nSubC = Math.max(1, Math.round(p.nSubC ?? 1));

    // Posiciones X de las columnas (acumuladas)
    const xCol: number[] = [0];
    for (let i = 1; i <= n; i++) {
      const L = (p[`L_v${i}`] as number) ?? 4.0;
      xCol.push(xCol[xCol.length - 1] + L);
    }

    // Nodos: por cada columna agrega base (z=0) y tope (z=H)
    const nodes: Node[] = [];
    const baseIdx: number[] = [];
    const topIdx: number[] = [];
    for (let i = 0; i < xCol.length; i++) {
      baseIdx.push(nodes.length); nodes.push([xCol[i], 0, 0]);
      topIdx.push(nodes.length);  nodes.push([xCol[i], 0, H]);
    }

    const elements: Element[] = [];
    const colIdx = new Set<number>();
    const beamIdx = new Set<number>();

    // Columnas (base → tope), subdivididas por nSubC
    for (let i = 0; i < xCol.length; i++) {
      let prev = baseIdx[i];
      for (let k = 1; k < nSubC; k++) {
        const t = k / nSubC;
        const midIdx = nodes.length;
        nodes.push([xCol[i], 0, t * H]);
        colIdx.add(elements.length); elements.push([prev, midIdx]);
        prev = midIdx;
      }
      colIdx.add(elements.length); elements.push([prev, topIdx[i]]);
    }

    // Vigas superiores con subdivisión por vano
    for (let v = 0; v < n; v++) {
      const xA = xCol[v], xB = xCol[v + 1];
      let prev = topIdx[v];
      for (let k = 1; k < nSubV; k++) {
        const t = k / nSubV;
        const midIdx = nodes.length;
        nodes.push([xA + t * (xB - xA), 0, H]);
        beamIdx.add(elements.length); elements.push([prev, midIdx]);
        prev = midIdx;
      }
      beamIdx.add(elements.length); elements.push([prev, topIdx[v + 1]]);
    }

    // Empotramientos en todas las bases
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (const idx of baseIdx) supports.set(idx, [true, true, true, true, true, true]);

    // ── Cargas ────────────────────────────────────────────────────────
    //
    // q_vert es una carga DISTRIBUIDA REAL sobre cada elemento viga (kN/m),
    // no una carga nodal "tributaria". Se aplica vía Fixed-End Moments (FEM)
    // — método estándar del análisis matricial cuando hay cargas en el span:
    //
    //   Para un elemento viga de longitud L_e con carga q (kN/m signed en
    //   dirección global Z), las cargas nodales equivalentes en globales:
    //     · F_z en cada extremo:        q · L_e / 2
    //     · M_y en extremo i (izq):     +q · L_e² / 12
    //     · M_y en extremo j (der):     -q · L_e² / 12
    //
    // Esto transfiere correctamente el momento de empotramiento a las
    // columnas (la columna "siente" la restricción del extremo de la viga).
    // En nodos interiores de subdivisión, los M_y de los dos elementos
    // adyacentes se cancelan (signos opuestos) y solo quedan las F_z.
    //
    // Ex y Ey son cargas PUNTUALES en el tope-izquierdo (no distribuidas).
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const addLoad = (idx: number, dFx: number, dFy: number, dFz: number,
                     dMx: number, dMy: number, dMz: number) => {
      const prev = loads.get(idx) ?? [0, 0, 0, 0, 0, 0];
      loads.set(idx, [prev[0] + dFx, prev[1] + dFy, prev[2] + dFz,
                      prev[3] + dMx, prev[4] + dMy, prev[5] + dMz]);
    };

    if (p.q_vert !== 0) {
      for (const elemIdx of beamIdx) {
        const [n0, n1] = elements[elemIdx];
        const x0 = nodes[n0][0], x1 = nodes[n1][0];
        const L_e = Math.abs(x1 - x0);
        if (L_e < 1e-12) continue;
        // Vigas horizontales en +X: local_x = +X, local_y = +Y, local_z = +Z
        // q_vert está en global Z (= local Z). FEM en convención local = global.
        const iIdx = x0 < x1 ? n0 : n1;   // start (izquierda)
        const jIdx = x0 < x1 ? n1 : n0;   // end   (derecha)
        const Fz_half = p.q_vert * L_e / 2;
        const My_FEM  = p.q_vert * L_e * L_e / 12;
        addLoad(iIdx, 0, 0, Fz_half, 0,  My_FEM, 0);
        addLoad(jIdx, 0, 0, Fz_half, 0, -My_FEM, 0);
      }
    }

    // Ex / Ey en el tope-izquierdo (la columna más a la izquierda)
    const topLeftIdx = topIdx.reduce(
      (min, idx) => nodes[idx][0] < nodes[min][0] ? idx : min, topIdx[0]
    );
    if (p.Ex !== 0) addLoad(topLeftIdx, p.Ex, 0, 0, 0, 0, 0);
    if (p.Ey !== 0) addLoad(topLeftIdx, 0, p.Ey, 0, 0, 0, 0);

    // Material hormigón: E = factor·√(f'c) en kgf/cm² → kN/m²
    const E_kgfcm2 = p.factorE * Math.sqrt(p.fc_kgcm2);
    const E = E_kgfcm2 * KGFCM2_TO_KNM2;
    const nu = p.nu;
    const G = E / (2 * (1 + nu));
    const rho = p.rho;

    // Secciones — convención Hekatan (Paz 6.3 benchmark):
    //   momentsOfInertiaY = AISC Iz = eje FUERTE (perpendicular al alma)
    //                       → controla la flexión en el plano del pórtico (vertical para vigas, sway-X para cols)
    //   momentsOfInertiaZ = AISC Iy = eje DÉBIL (paralelo al alma)
    //                       → controla la flexión out-of-plane
    // Para una sección rectangular (b ancho × h alto):
    //   I_strong = b·h³/12  (resistencia a flexión donde h es la dimensión perpendicular al eje)
    //   I_weak   = h·b³/12
    const cA = p.bCol * p.hCol;
    const cI_strong = (p.bCol * p.hCol ** 3) / 12;   // → momentsOfInertiaY (in-plane bending)
    const cI_weak   = (p.hCol * p.bCol ** 3) / 12;   // → momentsOfInertiaZ (out-of-plane)
    const cJ = 0.14 * Math.pow(Math.min(p.bCol, p.hCol), 4);

    const vA = p.bViga * p.hViga;
    const vI_strong = (p.bViga * p.hViga ** 3) / 12;
    const vI_weak   = (p.hViga * p.bViga ** 3) / 12;
    const vJ = 0.14 * Math.pow(Math.min(p.bViga, p.hViga), 4);

    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const poissons = new Map<number, number>();
    const densities = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const J = new Map<number, number>();
    for (let i = 0; i < elements.length; i++) {
      elasticities.set(i, E);
      shearModuli.set(i, G);
      poissons.set(i, nu);
      densities.set(i, rho);
      if (colIdx.has(i)) {
        areas.set(i, cA); Iy.set(i, cI_strong); Iz.set(i, cI_weak); J.set(i, cJ);
      } else {
        areas.set(i, vA); Iy.set(i, vI_strong); Iz.set(i, vI_weak); J.set(i, vJ);
      }
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, shearModuli, areas,
      momentsOfInertiaZ: Iz, momentsOfInertiaY: Iy, torsionalConstants: J,
      densities, poissonsRatios: poissons,
    };

    const deformOut = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
    states.deformOutputs.val = deformOut;
    states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, deformOut);

    // ── COTAS 3D ──────────────────────────────────────────────────────────
    // Muestra:
    //   • Luz de cada vano L_v_i (m) entre columnas adyacentes — bajo la base
    //   • Altura H total — a la izquierda de la columna 1
    //   • Luz total L_tot (sum L_v) — abajo de todas las cotas
    // El usuario puede toggle el sidebar Settings → Cotas para mostrar/ocultar.
    const cotas: THREE.Object3D[] = [];
    // Offset Y para colocar las cotas POR DEBAJO del pórtico (en plano Y=0
    // de momento; cuando el viewer está en Plan XY el offset Z negativo es
    // más visible. Usamos Y=-0.6m que en plan view aparece "debajo").
    const yCotaBase = -0.8;     // cotas de vanos (justo debajo de la base)
    const yCotaTotal = -1.5;    // cota total (más abajo aún)
    const xCotaH = -0.8;        // cota de altura H (a la izquierda)

    // Cota por cada vano
    for (let v = 0; v < n; v++) {
      const xA = xCol[v];
      const xB = xCol[v + 1];
      const L = xB - xA;
      // Línea de cota horizontal
      cotas.push(makeCotaLine([xA, yCotaBase, 0], [xB, yCotaBase, 0], 0x00e5ff));
      // Marcas verticales en los extremos (tick marks)
      cotas.push(makeCotaLine([xA, yCotaBase - 0.15, 0], [xA, yCotaBase + 0.15, 0], 0x00e5ff));
      cotas.push(makeCotaLine([xB, yCotaBase - 0.15, 0], [xB, yCotaBase + 0.15, 0], 0x00e5ff));
      // Label centrado con la luz
      const xMid = (xA + xB) / 2;
      cotas.push(makeLabel(`L${v + 1} = ${L.toFixed(2)} m`, xMid, yCotaBase - 0.05, 0, "#00e5ff"));
    }

    // Cota total (suma de luces)
    const xStart = xCol[0];
    const xEnd = xCol[xCol.length - 1];
    const L_tot = xEnd - xStart;
    cotas.push(makeCotaLine([xStart, yCotaTotal, 0], [xEnd, yCotaTotal, 0], 0xffaa00));
    cotas.push(makeCotaLine([xStart, yCotaTotal - 0.15, 0], [xStart, yCotaTotal + 0.15, 0], 0xffaa00));
    cotas.push(makeCotaLine([xEnd,   yCotaTotal - 0.15, 0], [xEnd,   yCotaTotal + 0.15, 0], 0xffaa00));
    cotas.push(makeLabel(`L_tot = ${L_tot.toFixed(2)} m  (${n} vanos)`, (xStart + xEnd) / 2, yCotaTotal - 0.05, 0, "#ffaa00"));

    // Cota de altura H (vertical, a la izquierda de la primera columna)
    cotas.push(makeCotaLine([xCotaH, 0, 0], [xCotaH, H, 0], 0x80ff80));
    cotas.push(makeCotaLine([xCotaH - 0.15, 0, 0], [xCotaH + 0.15, 0, 0], 0x80ff80));
    cotas.push(makeCotaLine([xCotaH - 0.15, H, 0], [xCotaH + 0.15, H, 0], 0x80ff80));
    cotas.push(makeLabel(`H = ${H.toFixed(2)} m`, xCotaH - 0.4, H / 2, 0, "#80ff80"));

    states.objects3D.val = cotas;
  },
  runModal(p, states, modalPanel) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ni.supports?.size || !ei.densities?.size) return;
    try {
      const out = modalAnalysis(nodes, elements, ni, ei, 8);
      const n = Math.round(p.nVanos);
      const Ltot = (() => {
        let s = 0;
        for (let i = 1; i <= n; i++) s += (p[`L_v${i}`] as number) ?? 4;
        return s;
      })();
      modalPanel.render(out, {
        title: `Cerramiento ${n} vanos · L_tot=${Ltot.toFixed(2)} m · H=${p.H} m`,
        properties: [
          `Hormigón col ${p.bCol}×${p.hCol} m · viga ${p.bViga}×${p.hViga} m`,
          `E = ${p.factorE}·√${p.fc_kgcm2} = ${(p.factorE * Math.sqrt(p.fc_kgcm2)).toFixed(0)} kgf/cm²`,
        ],
      });
    } catch (e: any) { console.warn("Modal cerramiento error:", e.message); }
  },
};
