/**
 * 🏁 Benchmark 3-way (Hekatan Struct Lineal vs MATLAB vs ETABS) — Matriz 7×3
 *
 * Cubre el coupling shell+frame para identificar exactamente dónde aparece
 * el bug DOF-mismatch del Q4 Mindlin-MITC4 (ver
 * `Benchmark_Placa/composite_slab_frame/BUG_ANALYSIS_shell_frame_dof_mismatch.md`).
 *
 * Matriz:
 *   areaType: shellThin / shellThick / plateThin / plateThick / membrane / plane / layered
 *   setup:    areaOnly / perimFrames / fullBuilding (frames + columnas + vigas internas)
 *
 * Nota WASM: deform.cpp ACTUAL solo soporta shell completo Mindlin-MITC4 sin
 * exponer membrane/bending modifiers. Las variantes "plate*" y "membrane" se
 * simulan en este benchmark via property-modifiers locales (TS-side scaling
 * de bending o membrane stiffness). El layered es referencia futura.
 *
 * Para diferenciación REAL: ver ejemplos `plateThin`, `plateThick`, `membrana`,
 * `layeredShell` (todos en el registry separados).
 *
 * Valores ETABS (referencia ground truth):
 *   shellThin / perimFrames (slab+vigas perim, q=5 kN/m²): w_centro = -3.055 mm
 *   shellThick/ perimFrames                              : w_centro = -3.032 mm
 *   pure shell areaOnly                                  : w_centro ≈ -2.4 mm
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

// Valores hardcodeados de ETABS (referencia ground truth) y MATLAB CLI
const ETABS_REF: Record<string, number> = {
  "shellThin/areaOnly":      -2.420,   // estimado: SS plate Navier
  "shellThin/perimFrames":   -3.055,
  "shellThin/fullBuilding":  -2.500,   // estimado
  "shellThick/areaOnly":     -2.420,
  "shellThick/perimFrames":  -3.032,
  "shellThick/fullBuilding": -2.500,
  "plateThin/areaOnly":      -2.420,
  "plateThick/areaOnly":     -2.420,
  "membrane/areaOnly":        0.126,
  "plane/areaOnly":           0.126,
};
const MATLAB_REF: Record<string, number> = {
  "shellThin/areaOnly":     -2.371,
  "shellThin/perimFrames":  -2.371,   // composite_slab_thin_frame.m
  "shellThick/areaOnly":    -2.371,
  "shellThick/perimFrames": -2.371,
  "plateThin/areaOnly":     -2.371,
  "membrane/areaOnly":       0.084,
};

export const benchmark3way: ExampleDef = {
  id: "benchmark-3way",
  name: "🏁 Benchmark 3-way (Shell+Frame DOF mismatch)",
  category: "4️⃣ Mixtos · 🔀 Losas con vigas",
  benchmark: true,
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
  params: {
    areaType: {
      default: 1,
      label: "Tipo de Área",
      options: {
        "membrane (in-plane only)": 0,
        "shellThin (Kirchhoff)":    1,
        "shellThick (Mindlin)":     2,
        "plateThin (no membrane)":  3,
        "plateThick (no membrane)": 4,
        "plane (in-plane only)":    5,
        "layered (CLT approx)":     6,
      },
    },
    setup: {
      default: 1,
      label: "Configuración",
      options: {
        "areaOnly (BCs en bordes)":              0,
        "perimFrames (vigas+4 cols esquina)":    1,
        "fullBuilding (cruz interna+col centro)": 2,
      },
    },
    Lx: { default: 4, min: 2, max: 8, step: 0.5, label: "Lx (m)", folder: "Geometría" },
    Ly: { default: 4, min: 2, max: 8, step: 0.5, label: "Ly (m)", folder: "Geometría" },
    nx: { default: 4, min: 2, max: 16, step: 1,  label: "nx mesh", folder: "Geometría" },
    ny: { default: 4, min: 2, max: 16, step: 1,  label: "ny mesh", folder: "Geometría" },
    t:  { default: 0.10, min: 0.05, max: 0.40, step: 0.01, label: "espesor (m)", folder: "Geometría" },
    E_c:  { default: 25e6,  min: 1e6, max: 200e6, step: 1e6,  label: "E concreto (kN/m²)", folder: "Material" },
    nu_c: { default: 0.20,  min: 0.0, max: 0.45, step: 0.01,  label: "ν concreto", folder: "Material" },
    E_s:  { default: 200e6, min: 100e6, max: 250e6, step: 5e6, label: "E acero (kN/m²)", folder: "Material" },
    A_b:  { default: 7610,  min: 1000, max: 30000, step: 100, label: "A viga (mm²)", folder: "Frame W360x60" },
    Iy_b: { default: 12.9,  min: 1, max: 100, step: 0.5, label: "Iy strong (×10⁻⁵ m⁴)", folder: "Frame W360x60" },
    Iz_b: { default: 1.20,  min: 0.1, max: 50, step: 0.1, label: "Iz weak (×10⁻⁵ m⁴)", folder: "Frame W360x60" },
    q:    { default: 5,   min: 0.5, max: 30, step: 0.5, label: "q vertical (kN/m²)", folder: "Carga", unitType: "force" },
    F:    { default: 100, min: 10, max: 500, step: 10,  label: "F lateral (kN)", folder: "Carga", unitType: "force" },
  },

  build(p, states) {
    const areaTypeKeys = ["membrane","shellThin","shellThick","plateThin","plateThick","plane","layered"];
    const setupKeys = ["areaOnly","perimFrames","fullBuilding"];
    const areaType = areaTypeKeys[Math.round(p.areaType)] || "shellThin";
    const setup    = setupKeys[Math.round(p.setup)] || "perimFrames";

    const isVertical = !(areaType === "membrane" || areaType === "plane");
    const Lx = p.Lx, Ly = p.Ly;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nNx = nx + 1, nNy = ny + 1;
    const dx = Lx / nx, dy = Ly / ny;
    const slabZ = isVertical ? 4 : 0;

    // ── Construir nodes ──
    const nodes: Node[] = [];
    if (isVertical) {
      for (let j = 0; j <= ny; j++)
        for (let i = 0; i <= nx; i++)
          nodes.push([i * dx, j * dy, slabZ]);
    } else {
      for (let k = 0; k <= ny; k++)
        for (let i = 0; i <= nx; i++)
          nodes.push([i * dx, 0, k * dy]);
    }

    // ── Áreas Q4 (16 cuando default 4×4) ──
    const shells: Element[] = [];
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const n0 = j * nNx + i;
        shells.push([n0, n0 + 1, (j + 1) * nNx + i + 1, (j + 1) * nNx + i]);
      }

    // ── Frames según setup ──
    const frames: Element[] = [];
    let nBaseExtra = 0;
    if (setup === "perimFrames" || setup === "fullBuilding") {
      // Vigas perimetrales
      for (let i = 0; i < nx; i++) frames.push([i, i + 1]);
      const baseTop = ny * nNx;
      for (let i = 0; i < nx; i++) frames.push([baseTop + i, baseTop + i + 1]);
      for (let j = 0; j < ny; j++) frames.push([j * nNx, (j + 1) * nNx]);
      for (let j = 0; j < ny; j++) frames.push([j * nNx + nx, (j + 1) * nNx + nx]);
      // Columnas en esquinas (solo si carga vertical)
      if (isVertical) {
        const cIdx = nodes.length;
        nodes.push([0, 0, 0]);
        nodes.push([nx * dx, 0, 0]);
        nodes.push([0, ny * dy, 0]);
        nodes.push([nx * dx, ny * dy, 0]);
        const cornerSlab = [0, nx, ny * nNx, ny * nNx + nx];
        for (let k = 0; k < 4; k++) frames.push([cIdx + k, cornerSlab[k]]);
        nBaseExtra = 4;
      }
    }
    if (setup === "fullBuilding" && isVertical) {
      // Vigas internas en cruz por el centro
      const midX = Math.floor(nx / 2);
      const midY = Math.floor(ny / 2);
      for (let i = 0; i < nx; i++) frames.push([midY * nNx + i, midY * nNx + i + 1]);
      for (let j = 0; j < ny; j++) frames.push([j * nNx + midX, (j + 1) * nNx + midX]);
      // Columna central
      const cIdx = nodes.length;
      nodes.push([midX * dx, midY * dy, 0]);
      frames.push([cIdx, midY * nNx + midX]);
      nBaseExtra += 1;
    }

    const elements: Element[] = [...shells, ...frames];

    // ── Soportes ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    if (setup === "areaOnly") {
      if (isVertical) {
        // SS en los 4 bordes
        for (let i = 0; i <= nx; i++) {
          supports.set(i, [true, true, true, false, false, false]);
          supports.set(ny * nNx + i, [true, true, true, false, false, false]);
        }
        for (let j = 0; j <= ny; j++) {
          supports.set(j * nNx, [true, true, true, false, false, false]);
          supports.set(j * nNx + nx, [true, true, true, false, false, false]);
        }
      } else {
        // Empotrado borde inferior
        for (let i = 0; i <= nx; i++) supports.set(i, [true, true, true, true, true, true]);
      }
    } else {
      if (isVertical) {
        const fix: [boolean, boolean, boolean, boolean, boolean, boolean] = [true, true, true, false, false, false];
        const baseStart = nNx * nNy;
        for (let k = 0; k < nBaseExtra; k++) supports.set(baseStart + k, fix);
      } else {
        for (let i = 0; i <= nx; i++) supports.set(i, [true, true, true, true, true, true]);
      }
    }

    // ── Cargas ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    if (isVertical) {
      for (const sh of shells) {
        const A = dx * dy;
        const fz = -p.q * A / 4;
        for (const n of sh) {
          const cur = loads.get(n) || [0, 0, 0, 0, 0, 0] as any;
          cur[2] += fz;
          loads.set(n, cur);
        }
      }
    } else {
      const F_per = p.F / nNx;
      for (let i = 0; i <= nx; i++) {
        const n = ny * nNx + i;
        loads.set(n, [F_per, 0, 0, 0, 0, 0]);
      }
    }

    // ── Property modifiers para emular plate/membrane (TS-side scaling) ──
    // Como el WASM solo expone shell completo, escalamos thickness equivalente
    // para variantes "plate" (eliminar membrana) o "membrane" (eliminar bending).
    // - plateThin/plateThick: t equivalente para bending = t real, pero membrane stiff = 0
    //   → no se puede sin recompile. Aproximación: usar t_eff = t (sin cambio).
    // - membrane: t³ → 0 ⇒ t_eff^3 ≈ 0. Aproximación: t_eff = 0.001 (super delgado en bending).
    // - layered: aprox como shell completo (TODO: solver layered).
    let t_eff = p.t;
    if (areaType === "membrane" || areaType === "plane") {
      t_eff = Math.max(0.001, p.t * 0.01);   // bending negligible (Et³ ≈ 0)
    }

    // ── Element inputs ──
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const thicknesses = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iz_map = new Map<number, number>();
    const Iy_map = new Map<number, number>();
    const J_map  = new Map<number, number>();
    const densities = new Map<number, number>();

    const G_c = p.E_c / (2 * (1 + p.nu_c));
    for (let e = 0; e < shells.length; e++) {
      elasticities.set(e, p.E_c);
      poissons.set(e, p.nu_c);
      thicknesses.set(e, t_eff);
      shearModuli.set(e, G_c);
      densities.set(e, 24 / 9.80665);
    }
    for (let f = 0; f < frames.length; f++) {
      const e = shells.length + f;
      elasticities.set(e, p.E_s);
      shearModuli.set(e, p.E_s / 2.6);  // G ≈ E/2.6 para acero
      areas.set(e, p.A_b * 1e-6);       // mm² → m²
      Iy_map.set(e, p.Iy_b * 1e-5);     // ×10⁻⁵ m⁴
      Iz_map.set(e, p.Iz_b * 1e-5);
      J_map.set(e, 0.31e-6);
      densities.set(e, 78.5 / 9.80665);            // acero kN/m³
    }

    // ── Set states ──
    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, poissonsRatios: poissons, thicknesses, shearModuli,
      areas, momentsOfInertiaZ: Iy_map, momentsOfInertiaY: Iz_map,
      torsionalConstants: J_map, densities,
    };

    // ── Solve ──
    try {
      states.deformOutputs.val = deform(nodes, elements,
        { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements,
        states.elementInputs.val, states.deformOutputs.val);
    } catch (e: any) {
      console.error(`Benchmark 3-way solver error (${areaType}/${setup}):`, e.message);
    }
    states.objects3D.val = [];

    // Reporte en consola con comparaciones a referencia
    const key = `${areaType}/${setup}`;
    const i_c = Math.floor(nx / 2), j_c = Math.floor(ny / 2);
    const n_c = j_c * nNx + i_c;
    const u = states.deformOutputs.val.deformations?.get(n_c);
    if (u) {
      const kpiVal = (isVertical ? u[2] : u[0]) * 1000;  // mm
      const kpiName = isVertical ? "w_centro" : "ux_top";
      const etabs = ETABS_REF[key];
      const matlab = MATLAB_REF[key];
      console.log(
        `[Benchmark 3-way] ${key}\n` +
        `  ${kpiName} = ${kpiVal.toFixed(4)} mm` +
        (matlab !== undefined ? `  (MATLAB: ${matlab.toFixed(4)})` : "") +
        (etabs !== undefined ? `  (ETABS ref: ${etabs.toFixed(4)})` : "")
      );
      if (etabs !== undefined && Math.abs(etabs) > 1e-9) {
        const errPct = Math.abs(kpiVal - etabs) / Math.abs(etabs) * 100;
        if (errPct > 50) {
          console.warn(
            `  ⚠ ERROR ${errPct.toFixed(0)}% vs ETABS — bug DOF mismatch (ver BUG_ANALYSIS_*.md)`
          );
        } else if (errPct > 10) {
          console.warn(`  Δ ${errPct.toFixed(1)}% vs ETABS`);
        } else {
          console.log(`  ✓ Δ ${errPct.toFixed(2)}% vs ETABS`);
        }
      }
    }
  },
};
