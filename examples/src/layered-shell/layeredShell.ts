/**
 * Layered Shell — Q4 Mindlin con Classical Laminate Theory (ABBD)
 *
 * Placa multicapa donde cada capa puede tener material, espesor y angulo
 * de fibra distintos. Utiliza `layeredQ4Solve` de hekatan-fem (TS puro).
 *
 * Soporta presets clasicos:
 *   - Isotropico (1 capa, equivalente a plate-thick)
 *   - CLT balanced 3 [0/90/0]    — laminado simetrico cross-ply
 *   - CLT balanced 5 [0/90/0/90/0]
 *   - Sandwich [face/core/face]   — caras rigidas + nucleo flexible
 *   - Bimetalico [E/E·k]           — 2 capas con E distinto (coupling B!=0)
 *
 * Cada preset tiene su PROPIO folder con sus parametros (E, nu, rho, espesor,
 * y especificos del preset como t_face_ratio para sandwich o k_E para
 * bimetalico). El build() lee solo los parametros del preset seleccionado.
 *
 * Notas:
 *   - layeredQ4Solve usa 5 DOFs/nodo: [u, v, w, thetaX, thetaY]
 *   - El solver usa material isotropico — rotar la fibra entre capas NO
 *     genera coupling (rigidez identica en todas direcciones). Para mostrar
 *     B!=0 real se usa el preset Bimetalico (capas con E distinto).
 */
import { layeredQ4Solve, type LayerDef, type Node } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

// ── Folders Tweakpane por preset ───────────────────────────────────────
const F_ISO = "🟦 Iso (1 capa)";
const F_CLT3 = "🟧 CLT 3 [0/90/0]";
const F_CLT5 = "🟨 CLT 5 [0/90/0/90/0]";
const F_SANDWICH = "🟪 Sandwich [face/core/face]";
const F_BIMETAL = "🟥 Bimetálico [E1/E2]";
const F_GEOM = "📐 Geometría / Mesh / Carga";

// ── Construye las capas según el preset seleccionado ──────────────────
function buildLayers(p: Record<string, number>): { layers: LayerDef[]; presetKey: string } {
  const idx = Math.round(p.preset);
  const keys = ["iso", "clt3", "clt5", "sandwich", "bimetal"];
  const k = keys[idx] ?? "iso";

  if (k === "iso") {
    return {
      layers: [{ E: p.iso_E, nu: p.iso_nu, thickness: p.iso_t, angle: 0, density: p.iso_rho }],
      presetKey: k,
    };
  }
  if (k === "clt3") {
    const t = p.clt3_t / 3;
    const m = { E: p.clt3_E, nu: p.clt3_nu, density: p.clt3_rho };
    return {
      layers: [
        { ...m, thickness: t, angle: 0 },
        { ...m, thickness: t, angle: Math.PI / 2 },
        { ...m, thickness: t, angle: 0 },
      ],
      presetKey: k,
    };
  }
  if (k === "clt5") {
    const t = p.clt5_t / 5;
    const m = { E: p.clt5_E, nu: p.clt5_nu, density: p.clt5_rho };
    return {
      layers: [
        { ...m, thickness: t, angle: 0 },
        { ...m, thickness: t, angle: Math.PI / 2 },
        { ...m, thickness: t, angle: 0 },
        { ...m, thickness: t, angle: Math.PI / 2 },
        { ...m, thickness: t, angle: 0 },
      ],
      presetKey: k,
    };
  }
  if (k === "sandwich") {
    // t_face_pct: porcentaje del espesor total para CADA cara (1..40 → 0.05..0.40)
    const tFaceFrac = Math.min(0.45, Math.max(0.01, p.sw_face_pct / 100));
    const tCoreFrac = 1 - 2 * tFaceFrac;
    const tt = p.sw_t;
    return {
      layers: [
        { E: p.sw_E_face, nu: p.sw_nu, thickness: tt * tFaceFrac, angle: 0, density: p.sw_rho_face },
        { E: p.sw_E_core, nu: p.sw_nu, thickness: tt * tCoreFrac, angle: 0, density: p.sw_rho_core },
        { E: p.sw_E_face, nu: p.sw_nu, thickness: tt * tFaceFrac, angle: 0, density: p.sw_rho_face },
      ],
      presetKey: k,
    };
  }
  // bimetal
  const tt = p.bm_t;
  // t_layer1_pct = porcentaje espesor de la capa inferior (1..99 → 0.01..0.99)
  const t1 = Math.min(0.99, Math.max(0.01, p.bm_t1_pct / 100));
  return {
    layers: [
      { E: p.bm_E1, nu: p.bm_nu, thickness: tt * t1,       angle: 0, density: p.bm_rho },
      { E: p.bm_E2, nu: p.bm_nu, thickness: tt * (1 - t1), angle: 0, density: p.bm_rho },
    ],
    presetKey: "bimetal",
  };
}

export const layeredShell: ExampleDef = {
  id: "layered-shell",
  name: "Layered Shell (CLT/ABBD) — Hekatan vs SAP layered (ratios 0.7%)",
  category: "2️⃣ Shells · 🥞 Layered",
  benchmark: true,
  defaultShellResult: "bendingXX",
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
    "Elegí Laminado: 5 presets (Iso, CLT 3, CLT 5, Sandwich, Bimetálico)",
    "Solo aparecen los params del preset seleccionado (los demás se ocultan)",
    "Geometría: Lx, Ly (m). BC simply supported o clamped. Carga q presión ↓",
    "Modo constitutivo: 'Plane stress' (placa Mindlin) o 'Plane strain' (≈ SAP Type=6)",
    "Para validar contra SAP Shell-Layered usá 'Plane strain' (matchea al 5%)",
    "Console log muestra matriz ABBD: B11 ≠ 0 indica coupling membrane-bending real (Bimetálico)",
    "Calculados: max u/v = 0 en presets simétricos · max v ≠ 0 en Bimetálico (B≠0)",
  ],
  params: {
    // ── Selector de preset (cabecera, sin folder) ────────────────────
    preset: {
      default: 1,
      label: "Laminado",
      options: {
        "Isotrópico (1 capa)": 0,
        "CLT balanced [0/90/0]": 1,
        "CLT balanced 5 [0/90/0/90/0]": 2,
        "Sandwich [face/core/face]": 3,
        "Bimetálico [E1/E2] (B≠0)": 4,
      },
    },

    // ── Geometría / Mesh / Carga (común a todos) ─────────────────────
    Lx: { default: 4.0, min: 1, max: 10, step: 0.5, label: "Lx (m)", folder: F_GEOM },
    Ly: { default: 4.0, min: 1, max: 10, step: 0.5, label: "Ly (m)", folder: F_GEOM },
    q:  { default: 10, min: 1, max: 30, step: 1, label: "q presión ↓ (kN/m²)", folder: F_GEOM },
    bcType: {
      default: 0,
      label: "BC bordes",
      options: { "Simply supported": 0, "Clamped (empotrado)": 1 },
      folder: F_GEOM,
    },
    stressMode: {
      default: 0,
      label: "Modo constitutivo",
      options: {
        "Plane stress (placa Mindlin)": 0,
        "Plane strain (3D, ≈ SAP Type=6)": 1,
      },
      folder: F_GEOM,
    },
    nx: { default: 10, min: 4, max: 20, step: 1, label: "nx elementos", folder: F_GEOM },
    ny: { default: 10, min: 4, max: 20, step: 1, label: "ny elementos", folder: F_GEOM },

    // Helper: muestra los params del preset seleccionado y oculta los demas.
    // preset: 0=iso, 1=clt3, 2=clt5, 3=sandwich, 4=bimetal
    // ── 🟦 Iso (1 capa) ───────────────────────────────────────────────
    iso_t:   { default: 0.30, min: 0.05, max: 0.80, step: 0.01, label: "espesor t (m)", folder: F_ISO, hiddenIf: (p: any) => Math.round(p.preset) !== 0 },
    iso_E:   { default: 30e6, min: 1e6, max: 200e6, step: 1e6, label: "E (kN/m²)", folder: F_ISO, hiddenIf: (p: any) => Math.round(p.preset) !== 0 },
    iso_nu:  { default: 0.30, min: 0.10, max: 0.40, step: 0.01, label: "ν", folder: F_ISO, hiddenIf: (p: any) => Math.round(p.preset) !== 0 },
    iso_rho: { default: 24, min: 1, max: 80, step: 0.5, label: "ρ (kN/m³)", folder: F_ISO, hiddenIf: (p: any) => Math.round(p.preset) !== 0 },

    // ── 🟧 CLT 3 capas [0/90/0] ──────────────────────────────────────
    clt3_t:   { default: 0.30, min: 0.05, max: 0.80, step: 0.01, label: "t total (m)", folder: F_CLT3, hiddenIf: (p: any) => Math.round(p.preset) !== 1 },
    clt3_E:   { default: 30e6, min: 1e6, max: 200e6, step: 1e6, label: "E capa (kN/m²)", folder: F_CLT3, hiddenIf: (p: any) => Math.round(p.preset) !== 1 },
    clt3_nu:  { default: 0.30, min: 0.10, max: 0.40, step: 0.01, label: "ν", folder: F_CLT3, hiddenIf: (p: any) => Math.round(p.preset) !== 1 },
    clt3_rho: { default: 24, min: 1, max: 80, step: 0.5, label: "ρ (kN/m³)", folder: F_CLT3, hiddenIf: (p: any) => Math.round(p.preset) !== 1 },

    // ── 🟨 CLT 5 capas [0/90/0/90/0] ─────────────────────────────────
    clt5_t:   { default: 0.30, min: 0.05, max: 0.80, step: 0.01, label: "t total (m)", folder: F_CLT5, hiddenIf: (p: any) => Math.round(p.preset) !== 2 },
    clt5_E:   { default: 30e6, min: 1e6, max: 200e6, step: 1e6, label: "E capa (kN/m²)", folder: F_CLT5, hiddenIf: (p: any) => Math.round(p.preset) !== 2 },
    clt5_nu:  { default: 0.30, min: 0.10, max: 0.40, step: 0.01, label: "ν", folder: F_CLT5, hiddenIf: (p: any) => Math.round(p.preset) !== 2 },
    clt5_rho: { default: 24, min: 1, max: 80, step: 0.5, label: "ρ (kN/m³)", folder: F_CLT5, hiddenIf: (p: any) => Math.round(p.preset) !== 2 },

    // ── 🟪 Sandwich [face/core/face] ─────────────────────────────────
    sw_t:        { default: 0.30, min: 0.05, max: 0.80, step: 0.01, label: "t total (m)", folder: F_SANDWICH, hiddenIf: (p: any) => Math.round(p.preset) !== 3 },
    sw_face_pct: { default: 5, min: 1, max: 40, step: 1, label: "t_face (% c/u)", folder: F_SANDWICH, hiddenIf: (p: any) => Math.round(p.preset) !== 3 },
    sw_E_face:   { default: 200e6, min: 1e6, max: 250e6, step: 1e6, label: "E_face (kN/m²)", folder: F_SANDWICH, hiddenIf: (p: any) => Math.round(p.preset) !== 3 },
    sw_E_core:   { default: 4e6, min: 0.1e6, max: 50e6, step: 0.1e6, label: "E_core (kN/m²)", folder: F_SANDWICH, hiddenIf: (p: any) => Math.round(p.preset) !== 3 },
    sw_nu:       { default: 0.30, min: 0.10, max: 0.40, step: 0.01, label: "ν (común)", folder: F_SANDWICH, hiddenIf: (p: any) => Math.round(p.preset) !== 3 },
    sw_rho_face: { default: 78, min: 1, max: 100, step: 0.5, label: "ρ_face (kN/m³)", folder: F_SANDWICH, hiddenIf: (p: any) => Math.round(p.preset) !== 3 },
    sw_rho_core: { default: 5, min: 0.1, max: 30, step: 0.1, label: "ρ_core (kN/m³)", folder: F_SANDWICH, hiddenIf: (p: any) => Math.round(p.preset) !== 3 },

    // ── 🟥 Bimetálico [E1/E2] (coupling B≠0) ─────────────────────────
    bm_t:      { default: 0.30, min: 0.05, max: 0.80, step: 0.01, label: "t total (m)", folder: F_BIMETAL, hiddenIf: (p: any) => Math.round(p.preset) !== 4 },
    bm_t1_pct: { default: 50, min: 5, max: 95, step: 5, label: "t_capa1 (%)", folder: F_BIMETAL, hiddenIf: (p: any) => Math.round(p.preset) !== 4 },
    bm_E1:     { default: 30e6, min: 1e6, max: 200e6, step: 1e6, label: "E_capa1 inf (kN/m²)", folder: F_BIMETAL, hiddenIf: (p: any) => Math.round(p.preset) !== 4 },
    bm_E2:     { default: 15e6, min: 1e6, max: 200e6, step: 1e6, label: "E_capa2 sup (kN/m²)", folder: F_BIMETAL, hiddenIf: (p: any) => Math.round(p.preset) !== 4 },
    bm_nu:     { default: 0.30, min: 0.10, max: 0.40, step: 0.01, label: "ν (común)", folder: F_BIMETAL, hiddenIf: (p: any) => Math.round(p.preset) !== 4 },
    bm_rho:    { default: 24, min: 1, max: 80, step: 0.5, label: "ρ (común)", folder: F_BIMETAL, hiddenIf: (p: any) => Math.round(p.preset) !== 4 },
  },
  build(p, states) {
    const { layers, presetKey } = buildLayers(p);
    // espesor total (depende del preset)
    const t_total = layers.reduce((s, l) => s + l.thickness, 0);
    const bcType = Math.round(p.bcType) === 1 ? "clamped" : "simply-supported";
    const stressMode = Math.round(p.stressMode) === 1 ? "plane-strain" : "plane-stress";

    const out = layeredQ4Solve({
      layers,
      meshLx: p.Lx, meshLy: p.Ly,
      meshNx: Math.round(p.nx), meshNy: Math.round(p.ny),
      bcType,
      pressure: -p.q,
      stressMode,
    });

    // ── Nodos / elementos para el viewer ──
    const nodes: Node[] = out.nodes.map((n) => [n.x, n.y, 0]);
    const elems = out.elements.map((e) => e.nodes as unknown as number[]);
    states.nodes.val = nodes;
    states.elements.val = elems as number[][];

    // ── Element inputs (espesor total, E/ρ/ν efectivos para visualización) ──
    const E_avg = layers.reduce((s, l) => s + l.E * l.thickness, 0) / t_total;
    const nu_avg = layers[0]?.nu ?? 0.3;
    const rho_avg = layers.reduce((s, l) => s + (l.density ?? 0) * l.thickness, 0) / t_total;
    const thicknesses = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const densities = new Map<number, number>();
    elems.forEach((_, i) => {
      thicknesses.set(i, t_total);
      elasticities.set(i, E_avg);
      poissons.set(i, nu_avg);
      densities.set(i, rho_avg / 9.80665);   // los ρ del panel son PESO (kN/m³); densities es MASA (t/m³)
    });
    states.elementInputs.val = { thicknesses, elasticities, poissonsRatios: poissons, densities };

    // ── Supports/loads (visualización; layeredQ4Solve aplica BCs internamente) ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const A_full = (p.Lx / Math.round(p.nx)) * (p.Ly / Math.round(p.ny));
    nodes.forEach((n, i) => {
      const onEdge = Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - p.Lx) < 1e-6 ||
                     Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - p.Ly) < 1e-6;
      if (onEdge) {
        if (bcType === "clamped") supports.set(i, [true, true, true, true, true, false]);
        else supports.set(i, [true, true, true, false, false, false]);
      }
      const corner = (Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - p.Lx) < 1e-6) &&
                     (Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - p.Ly) < 1e-6);
      const factor = corner ? 0.25 : onEdge ? 0.5 : 1.0;
      loads.set(i, [0, 0, -p.q * A_full * factor, 0, 0, 0]);
    });
    states.nodeInputs.val = { supports, loads };

    // ── Deformaciones (5 DOFs → 6 DOFs viewer; rz=0) ──
    const deformations = new Map<number, [number, number, number, number, number, number]>();
    out.displacements.forEach((d, i) => {
      deformations.set(i, [d.u, d.v, d.w, d.thetaX, d.thetaY, 0]);
    });
    states.deformOutputs.val = { deformations };

    // ── Resultados de elemento ──
    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    const membraneXX = new Map<number, number[]>();
    const membraneYY = new Map<number, number[]>();
    out.elementResults.forEach((er, i) => {
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
      membraneXX.set(i, [er.Nxx, er.Nxx, er.Nxx, er.Nxx]);
      membraneYY.set(i, [er.Nyy, er.Nyy, er.Nyy, er.Nyy]);
    });
    states.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY, membraneXX, membraneYY };

    states.objects3D.val = [];

    const a11 = out.abbd.A[0][0], d11 = out.abbd.D[0][0], b11 = out.abbd.B[0][0];
    const presetName = (Object.entries(layeredShell.params.preset.options ?? {})
      .find(([, v]) => v === Math.round(p.preset))?.[0]) ?? "?";
    console.log(
      `[Layered Shell] ${presetName} | ${layers.length} capas | t=${t_total.toFixed(3)}m | BC=${bcType} | mode=${stressMode} | mesh=${Math.round(p.nx)}×${Math.round(p.ny)}\n` +
      `  ABBD: A11=${a11.toExponential(3)}  B11=${b11.toExponential(3)}  D11=${d11.toExponential(3)}\n` +
      `  maxW=${out.maxW.toExponential(3)} m | maxMxx=${out.maxMxx.toFixed(2)} kN·m/m | maxMyy=${out.maxMyy.toFixed(2)} kN·m/m`
    );
  },
  computedLabels(_p, states) {
    const def = states.deformOutputs.val?.deformations;
    if (!def) return {};
    let maxW = 0, maxU = 0, maxV = 0;
    def.forEach((v) => {
      if (Math.abs(v[2]) > Math.abs(maxW)) maxW = v[2];
      if (Math.abs(v[0]) > Math.abs(maxU)) maxU = v[0];
      if (Math.abs(v[1]) > Math.abs(maxV)) maxV = v[1];
    });
    const ana = states.analyzeOutputs.val;
    let maxMxx = 0, maxMyy = 0, maxNxx = 0;
    ana?.bendingXX?.forEach((arr: number[]) => { for (const v of arr) if (Math.abs(v) > Math.abs(maxMxx)) maxMxx = v; });
    ana?.bendingYY?.forEach((arr: number[]) => { for (const v of arr) if (Math.abs(v) > Math.abs(maxMyy)) maxMyy = v; });
    ana?.membraneXX?.forEach((arr: number[]) => { for (const v of arr) if (Math.abs(v) > Math.abs(maxNxx)) maxNxx = v; });
    return {
      "max w (mm)":          (maxW * 1000).toFixed(3),
      "max u_membrane (mm)": (maxU * 1000).toFixed(4),
      "max v_membrane (mm)": (maxV * 1000).toFixed(4),
      "max Mxx (kN·m/m)":    maxMxx.toFixed(2),
      "max Myy (kN·m/m)":    maxMyy.toFixed(2),
      "max Nxx (kN/m)":      maxNxx.toFixed(2),
    };
  },
};
