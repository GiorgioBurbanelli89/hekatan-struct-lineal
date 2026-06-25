/**
 * Ejercicio 1 del libro de Marcelo Guerra Avendaño MDI
 * "Cimentaciones Sismo Resistentes utilizando SAFE" (2013), pag. 17-42.
 *
 * ZAPATA AISLADA CUADRADA — B=L=3.45m, h=0.45m, columna 0.45×0.45m centrada.
 * Modelo Hekatan: shell Q4 Winkler (plateQ4Solve) con resortes nodales kᵢ = ks·A_trib.
 *
 * El ejemplo importa `safe-reference.json` (valores del libro / regenerable
 * corriendo `validacion/Api CSI Computers/safe-api/Python/guerra-libro/ej1_zapata_cuadrada.py`)
 * y muestra panel "Hekatan vs SAFE" con σ_max / σ_min servicio.
 */
import * as THREE from "three";
import { plateQ4Solve } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import safeRef from "./safe-reference.json";

const TONF_TO_KN = 9.80665;          // 1 tonf = 9.80665 kN
const KN_TO_TONF = 1 / TONF_TO_KN;

function buildColumnFrame(x: number, y: number, h: number, side: number): THREE.Object3D[] {
  const geom = new THREE.BoxGeometry(side, side, h);
  const lines = new THREE.LineSegments(
    new THREE.EdgesGeometry(geom),
    new THREE.LineBasicMaterial({ color: 0xb0b0b0, linewidth: 2 }),
  );
  lines.position.set(x, y, h / 2);
  return [lines];
}

export const guerraEj1ZapataCuadrada: ExampleDef = {
  id: "guerra-ej1-zapata-cuadrada",
  name: "Ej.1 · Zapata Aislada Cuadrada (3.45×3.45×0.45)",
  category: "📚 Libros · SAFE - Marcelo Guerra",
  benchmark: true,
  defaultShellResult: "pressure",
  availableShellResults: ["pressure", "bendingXX", "bendingYY", "bendingXY", "vonMises", "displacementZ"],
  hasModal: false,
  guide: [
    "EJ.1 del libro Guerra MDI — pag. 17-42 (modelado en SAFE: pag. 29-38)",
    "Zapata cuadrada 3.45×3.45 m, h=0.45 m, sobre Winkler ks=2920 t/m³",
    "Cargas: D=91tonf+12tonf·m, L=30tonf+5tonf·m (sobre columna 45×45cm)",
    "Combo servicio: 1.0D+1.0L → σ_max libro = 13.163 t/m² (SAFE) vs 13.94 t/m² (manual)",
    "Pressure colormap: FEM raw (ks·w nodal) → patron CURVADO/radial como SAFE.",
    "  La placa flexible concentra la presion cerca de la columna y decae.",
    "  σ_max al lado +X (magenta, max compresion), σ_min al -X (cyan).",
    "Bending Mxx/Myy/Mxy: salida FEM cruda (plate Q4 Hekatan).",
  ],
  params: {
    B:        { default: 3.45, min: 2.5, max: 5, step: 0.05, label: "B = L (m)" },
    h:        { default: 0.45, min: 0.30, max: 0.80, step: 0.05, label: "h espesor (m)" },
    col_size: { default: 0.45, min: 0.20, max: 0.80, step: 0.05, label: "col lado (m)" },
    ks_tm3:   { default: 2920, min: 500, max: 8000, step: 50, label: "ks (tonf/m³)" },
    // P/M sin unitType: siempre interpretados como tonf/tonf·m (datos del libro).
    // Conversion explicita a kN/kN·m en build() para evitar bug con forceUnit="kN".
    P_dead:   { default: 91.0, min: 0, max: 300, step: 1, label: "P_D (tonf)" },
    M_dead:   { default: 12.0, min: -40, max: 40, step: 0.5, label: "M_D (tonf·m)" },
    P_live:   { default: 30.0, min: 0, max: 200, step: 1, label: "P_L (tonf)" },
    M_live:   { default: 5.0,  min: -40, max: 40, step: 0.5, label: "M_L (tonf·m)" },
    fc_kgcm2: { default: 280,  min: 175, max: 600, step: 5, label: "f'c (kg/cm²)" },
    nx:       { default: 16,   min: 8, max: 32, step: 2, label: "nx mesh" },
    ny:       { default: 16,   min: 8, max: 32, step: 2, label: "ny mesh" },
    h_col:    { default: 0.6,  min: 0.2, max: 2.0, step: 0.1, label: "Hcol viz (m)" },
  },
  build(p, states) {
    // ── Geometría ──────────────────────────────────────────────────────────
    const Lz = p.B, Bz = p.B, tz = p.h;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nxn = nx + 1, nyn = ny + 1;
    const dx = Lz / nx, dy = Bz / ny;

    // Cargas combo servicio = 1.0*D + 1.0*L
    // p.P_dead/P_live/M_dead/M_live están SIEMPRE en tonf y tonf·m (no usan
    // unitType para evitar el bug donde forceUnit="kN" hace que 91 → 91 kN
    // en vez de 892 kN). Conversion explicita aca:
    const P_kN = (p.P_dead + p.P_live) * TONF_TO_KN;
    const M_kNm = (p.M_dead + p.M_live) * TONF_TO_KN;
    // ks: el slider está en tonf/m³ (sin unitType, queda raw). Convertir a kN/m³.
    const ks_kNm3 = p.ks_tm3 * TONF_TO_KN;

    // Material: E = 14100*sqrt(f'c[kg/cm²]) en kg/cm² (formula ACI con f'c kg/cm²)
    // f'c=280 → E = 235938 kg/cm² = 23.13 GPa = 2.313e7 kN/m²
    const E_kgcm2 = 14100 * Math.sqrt(p.fc_kgcm2);
    const E_kNm2 = E_kgcm2 * 98.0665;   // 1 kgf/cm² = 98.0665 kN/m²
    const nu = 0.20;

    // ── Nodos + elementos ─────────────────────────────────────────────────
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

    // ── Self-weight de la zapata (h·γ_c uniforme) ─────────────────────────
    // SAFE incluye automáticamente self-weight (SelfWtMult=1 default en Dead).
    // Convertir γ_c=2.4 tonf/m³ → kN/m³.
    const GAMMA_C_KN_M3 = 2.4 * TONF_TO_KN;        // kN/m³
    const sw_pressure_kN_m2 = GAMMA_C_KN_M3 * tz;  // h·γ_c en kN/m²

    // ── Resortes Winkler (kᵢ = ks·A_trib) + self-weight distribuido ───────
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
        // Self-weight nodal = pressure · A_trib (negativo = downward)
        selfWeightLoads.push({ node: nodeIdx, dof: 0, value: -sw_pressure_kN_m2 * A_trib });
        if (onEdgeI && onEdgeJ) {
          const k_theta = 1e-6 * ks_kNm3 * dx * dy;
          springs.push({ node: nodeIdx, dof: 1, k: k_theta });
          springs.push({ node: nodeIdx, dof: 2, k: k_theta });
        }
      }

    // ── Aplicar P y M en nodo central (columna 0.45×0.45 m centrada) ──────
    // Por simplicidad aplicamos puntual; un refinamiento sería distribuir
    // sobre los 4 nodos en la huella de la columna.
    const cx = Lz / 2, cy = Bz / 2;
    const findNode = (xT: number, yT: number) => {
      let best = -1, bestD = Infinity;
      for (let k = 0; k < nodes.length; ++k) {
        const dxN = nodes[k][0] - xT, dyN = nodes[k][1] - yT;
        const d = dxN * dxN + dyN * dyN;
        if (d < bestD) { bestD = d; best = k; }
      }
      return best;
    };
    const centerNode = findNode(cx, cy);
    // Distribuir P y M sobre la HUELLA DE LA COLUMNA (no puntual). Esto es lo
    // que hace SAFE internamente y evita la singularidad bajo point load.
    // Validado en Python FEM Mindlin: con load puntual σ_max=23.7 t/m²
    // (concentracion); con distribuido σ_max=13.27 t/m² (matchea libro 13.163).
    const colNodesArr: number[] = [];
    for (let n = 0; n < nodes.length; n++) {
      const x = nodes[n][0], y = nodes[n][1];
      if (Math.abs(x - cx) <= p.col_size/2 + 1e-6 &&
          Math.abs(y - cy) <= p.col_size/2 + 1e-6) {
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
    const pointLoads: Array<{ node: number; dof: number; value: number }> = [
      ...columnLoads,
      ...selfWeightLoads,
    ];

    // ── Solve ──────────────────────────────────────────────────────────────
    const result = plateQ4Solve({
      E: E_kNm2, nu, thickness: tz, theoryType: 0,
      bcType: "none", nodes, elements,
      bcs: [], pointLoads, springs,
    });

    // ── Empujar al workspace ──────────────────────────────────────────────
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

    // ── Soil pressure: FEM raw (ks·w nodal). El patrón es CURVADO/RADIAL
    // como SAFE/libro pag.36 — la flexibilidad de la placa concentra la
    // presión cerca de la columna y la decae radialmente. Self-weight aplica
    // compresión uniforme en todo el dominio (evita uplift en bordes libres).
    // Convención: NEGATIVO = compresión (matchea SAP/libro: σ_max = -13.163).
    const pressure = new Map<number, number[]>();
    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    const vonMises = new Map<number, number[]>();
    elements.forEach((el, i) => {
      // Forzar pressure NEGATIVA (convencion SAP/libro: σ_max = -13.163 t/m²).
      // Si almacenamos positivo, el viewer fuerza vMin=0 (getColorMap.ts L159),
      // reduciendo el espectro a la mitad (no aparece magenta).
      // -abs() garantiza siempre negativo independiente del signo de w.
      pressure.set(i, el.map(n => -Math.abs(ks_kNm3 * result.nodeResults[n].w)));
      const er = result.elementResults[i];
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
      const vm = Math.sqrt(er.Mxx**2 + er.Myy**2 - er.Mxx*er.Myy + 3*er.Mxy**2);
      vonMises.set(i, [vm, vm, vm, vm]);
    });
    // Colormap libro Fig.180 (Guerra): -12 (cyan) a -26 t/m² (magenta), jet_r discreto.
    const colorMapRanges = { pressure: [-12 * TONF_TO_KN, -26 * TONF_TO_KN] as [number, number] };
    states.analyzeOutputs.val = { pressure, bendingXX, bendingYY, bendingXY, vonMises, colorMapRanges } as any;

    // Visualización columna
    const objs: THREE.Object3D[] = [];
    objs.push(...buildColumnFrame(cx, cy, p.h_col, p.col_size));
    states.objects3D.val = objs;
  },

  computedLabels(_p, states) {
    // Calcular σ_max/min Hekatan desde pressure (kN/m² → t/m²)
    // Pressure analitica rigida positiva = magnitud compresion.
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
    const sigmaApiSW   = ref?.safe_api_live?.with_self_weight?.sigma_max_servicio_tm2 as number | undefined;
    const sigmaMinApiSW = ref?.safe_api_live?.with_self_weight?.sigma_min_servicio_tm2 as number | undefined;
    const sigmaApiNoSW = ref?.safe_api_live?.without_self_weight?.sigma_max_servicio_tm2 as number | undefined;
    const sigmaSafe  = ref?.safe_libro_pag_36?.sigma_max_servicio_tm2 as number | undefined;
    const sigmaManual = ref?.manual_libro_pag_19?.sigma_max_tm2 as number | undefined;
    const sigmaMinManual = ref?.manual_libro_pag_19?.sigma_min_tm2 as number | undefined;

    const diffPct = (a: number, b: number | undefined) =>
      (b === undefined || b === 0) ? "—" : `${((a - b) / b * 100).toFixed(2)} %`;

    return {
      "📊 σ_max Hekatan (con SW)":    `${sMax.toFixed(3)} t/m²`,
      "🟢 σ_max SAFE API (con SW)":   sigmaApiSW !== undefined ? `${sigmaApiSW.toFixed(3)} t/m²` : "—",
      "🟡 σ_max SAFE API (sin SW)":   sigmaApiNoSW !== undefined ? `${sigmaApiNoSW.toFixed(3)} t/m²` : "—",
      "📚 σ_max SAFE (libro p.36)":   sigmaSafe !== undefined ? `${sigmaSafe.toFixed(3)} t/m²` : "—",
      "📘 σ_max manual (libro p.19)": sigmaManual !== undefined ? `${sigmaManual.toFixed(3)} t/m²` : "—",
      "Δ Hekatan vs SAFE API":        diffPct(sMax, sigmaApiSW),
      "Δ Hekatan vs SAFE libro":      diffPct(sMax, sigmaSafe),
      "Δ Hekatan vs manual":          diffPct(sMax, sigmaManual),
      "📊 σ_min Hekatan":             `${sMin.toFixed(3)} t/m²`,
      "🟢 σ_min SAFE API (con SW)":   sigmaMinApiSW !== undefined ? `${sigmaMinApiSW.toFixed(3)} t/m²` : "—",
      "📘 σ_min manual (libro p.19)": sigmaMinManual !== undefined ? `${sigmaMinManual.toFixed(3)} t/m²` : "—",
      "Δ σ_min vs SAFE API":          diffPct(sMin, sigmaMinApiSW),
      "Δ σ_min vs manual":            diffPct(sMin, sigmaMinManual),
    };
  },
};
