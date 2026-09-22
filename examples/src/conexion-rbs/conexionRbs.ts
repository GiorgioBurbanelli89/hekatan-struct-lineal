/**
 * Conexión RBS — Reduced Beam Section precalificación según AISC 358-22.
 *
 * Geometría 3D REAL de la conexión usando shells:
 *   - Columna W-shape vertical (2 patines + alma)
 *   - Viga W-shape horizontal (2 patines + alma)
 *   - Corte dogbone circular VISIBLE en los patines de la viga (zona RBS)
 *   - Esfera roja = rótula plástica en el centro del RBS (ASCE 41-17 LS/CP)
 *   - Torus naranja = indicador de zona de rotación plástica
 *
 * Análisis:
 *   - Protocolo cíclico AISC 341-22 App. K3 desplazamiento-controlado
 *   - Material Menegotto-Pinto (1973) uniaxial en la fibra extrema RBS
 *   - M-θ histerético registrado en __rbsHistory para plot futuro
 *
 * Referencias:
 *   - AISC 358-22 Ch. 5 (RBS Moment Connection — prequalified)
 *   - AISC 341-22 App. K3 (Loading History — 30 ciclos, 0.00375→0.06 rad)
 *   - FEMA 350 §3.3.2 (RBS design procedure)
 *   - Engelhardt et al. 1998 Rep. SAC/BD-98/01
 */
import {
  initMpState, mpStep, mpHistory,
  aiscK3StrainHistory,
  deform, analyze,
  type MenegottoPintoParams,
} from "hekatan-fem";
import { secantPlasticSolve } from "../shared/secantPlasticity";
import { incrementalPushover } from "../shared/incrementalPushover";
import { buildPushoverChart3D } from "../shared/pushoverChart3D";
import {
  classifyRbsZones,
  computeStrengthRatios,
  governingComponent,
  failureMode,
} from "../shared/componentZones";
import { buildGoverningMarker } from "../shared/governingMarker";
import {
  buildHysteresisChart3D,
  buildLoadingProtocolChart3D,
} from "../shared/hysteresisChart3D";
import { colormapPercentileRange } from "../shared/colorMapPercentile";
import type { ExampleDef } from "../workspace/exampleRegistry";
import type { Node, Element } from "hekatan-fem";
import * as THREE from "three";

export const conexionRbs: ExampleDef = {
  id: "conexion-rbs",
  name: "Conexión RBS (AISC 358-22 · Protocolo K3)",
  category: "2️⃣ Shells · 🔩 Conexiones",
  hasModal: false,
  defaultShellResult: "vonMises",
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
    // ── Viga W-shape ──
    d_beam:  { default: 0.60, min: 0.30, max: 1.00, step: 0.02, label: "d viga (m)", folder: "Viga" },
    bf_beam: { default: 0.22, min: 0.12, max: 0.40, step: 0.01, label: "bf patín viga (m)", folder: "Viga" },
    tf_beam: { default: 0.020, min: 0.010, max: 0.040, step: 0.002, label: "tf patín viga (m)", folder: "Viga" },
    tw_beam: { default: 0.012, min: 0.006, max: 0.025, step: 0.001, label: "tw alma viga (m)", folder: "Viga" },
    L_beam:  { default: 3.50, min: 2.0, max: 6.0, step: 0.10, label: "L viga (m)", folder: "Viga" },
    // ── Columna W-shape ──
    d_col:   { default: 0.42, min: 0.30, max: 0.70, step: 0.02, label: "d columna (m)", folder: "Columna" },
    bf_col:  { default: 0.40, min: 0.25, max: 0.60, step: 0.01, label: "bf patín col (m)", folder: "Columna" },
    tf_col:  { default: 0.025, min: 0.012, max: 0.050, step: 0.002, label: "tf patín col (m)", folder: "Columna" },
    tw_col:  { default: 0.018, min: 0.010, max: 0.035, step: 0.001, label: "tw alma col (m)", folder: "Columna" },
    // ── RBS geometría (AISC 358-22 §5.8) ──
    a_rbs:   { default: 0.625, min: 0.50, max: 0.75, step: 0.025, label: "a/bf", folder: "RBS" },
    b_rbs:   { default: 0.75,  min: 0.65, max: 0.85, step: 0.025, label: "b/d", folder: "RBS" },
    c_rbs:   { default: 0.25,  min: 0.20, max: 0.25, step: 0.025, label: "c/bf (reducción)", folder: "RBS" },
    // ── Material ──
    Fy:      { default: 345_000, min: 250_000, max: 450_000, step: 5_000, label: "Fy (kN/m²)", folder: "Material" },
    E_steel: { default: 200_000_000, min: 190e6, max: 210e6, step: 1e6, label: "E (kN/m²)", folder: "Material" },
    b_hard:  { default: 0.01, min: 0.005, max: 0.05, step: 0.005, label: "b strain hardening", folder: "Material" },
    // ── Protocolo de carga ──
    // ── Soldadura (AISC 360-22 §J2 + AISC 358-22 §3.7) ──
    weld_type: {
      default: 0,
      label: "Tipo soldadura",
      options: { "CJP (penetración completa)": 0, "PJP (parcial)": 1, "Filete": 2 },
      folder: "Soldadura",
    },
    electrode_Fexx: {
      default: 480_000,
      label: "Electrodo Fexx (kN/m²)",
      options: { "E60XX (414 MPa)": 414_000, "E70XX (483 MPa)": 483_000, "E80XX (552 MPa)": 552_000 },
      folder: "Soldadura",
    },
    weld_throat: { default: 0.008, min: 0.004, max: 0.020, step: 0.001, label: "Garganta tw (m, filete/PJP)", folder: "Soldadura" },
    weld_access_hole: { default: 1, label: "Weld access hole", options: { "No": 0, "Sí (AWS D1.8)": 1 }, folder: "Soldadura" },
    classification: { default: 1, label: "Clasificación sismo", options: { "IMF (0.02 rad)": 0, "SMF (0.04 rad)": 1, "Extendido (0.06 rad)": 2 }, folder: "Ensayo K3" },
    story_h: { default: 3.66, min: 2.5, max: 5.0, step: 0.1, label: "h piso (m)", folder: "Ensayo K3" },
    steps_per_cycle: { default: 40, min: 20, max: 100, step: 10, label: "Steps/ciclo", folder: "Ensayo K3" },
    // ── Malla (para ver concentración de tensiones / fracturas) ──
    mesh_density: { default: 2, min: 1, max: 5, step: 1, label: "Densidad malla (2 = rápido, 4 = denso)", folder: "Malla" },
    // ── Solver FEM ──
    use_nonlinear: {
      default: 2,
      label: "Solver",
      options: {
        "Lineal (elástico)": 0,
        "No-lineal J2 secante": 1,
        "IDEA StatiCa (pushover)": 2,
      },
      folder: "Solver",
    },
    nl_max_iter: { default: 10, min: 3, max: 25, step: 1, label: "Max iter NL", folder: "Solver" },
    load_factor: { default: 0.50, min: 0.02, max: 0.80, step: 0.02, label: "Factor carga (×Mp)", folder: "Solver" },
    // ── IDEA StatiCa mode ──
    idea_steps: { default: 12, min: 4, max: 30, step: 1, label: "N pasos pushover", folder: "Solver" },
    // ── Animación cíclica (K3 protocol) ──
    animate_k3: {
      default: 0,
      label: "Animación K3",
      options: { "Off": 0, "On (40 Hz)": 1, "On (lenta 10 Hz)": 2 },
      folder: "Solver",
    },
    anim_amp: { default: 30, min: 5, max: 120, step: 5, label: "Amplificación visual", folder: "Solver" },
    colormap_mode: {
      default: 0,
      label: "Colormap",
      options: {
        "σvm por shell (FEM clásico)": 0,
        "Utilization por componente (IDEA)": 1,
      },
      folder: "Solver",
    },
  },
  build(p, states) {
    // ── 1. Geometría 3D REAL con shells ──────────────────
    const nodes: Node[] = [];
    const elements: Element[] = [];
    const thicknesses = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const poissonsRatios = new Map<number, number>();
    const densities = new Map<number, number>();
    const areas = new Map<number, number>();
    const momentsOfInertiaY = new Map<number, number>();
    const momentsOfInertiaZ = new Map<number, number>();
    const torsionalConstants = new Map<number, number>();
    const shearModuli = new Map<number, number>();

    const G_steel = p.E_steel / 2.6;
    const rho_steel = 7.85;   // MASA t/m³ (antes 77: el PESO kN/m³, metido ×9.81)

    // ── Node merging: nodos coincidentes se fusionan (une patines con alma) ──
    const NODE_EPS = 1e-4;
    const nodeMap = new Map<string, number>();
    const addNode = (x: number, y: number, z: number): number => {
      const kx = Math.round(x / NODE_EPS);
      const ky = Math.round(y / NODE_EPS);
      const kz = Math.round(z / NODE_EPS);
      const key = `${kx},${ky},${kz}`;
      let idx = nodeMap.get(key);
      if (idx === undefined) {
        nodes.push([x, y, z]);
        idx = nodes.length - 1;
        nodeMap.set(key, idx);
      }
      return idx;
    };
    const addShell = (n0: number, n1: number, n2: number, n3: number, t: number) => {
      elements.push([n0, n1, n2, n3]);
      const idx = elements.length - 1;
      thicknesses.set(idx, t);
      elasticities.set(idx, p.E_steel);
      poissonsRatios.set(idx, 0.3);
      densities.set(idx, rho_steel);
      areas.set(idx, 0);
      momentsOfInertiaY.set(idx, 0);
      momentsOfInertiaZ.set(idx, 0);
      torsionalConstants.set(idx, 0);
      shearModuli.set(idx, G_steel);
    };

    // ── Columna W-shape (eje longitudinal Z) ──
    // Patines en planos x = ±d_col/2, alma en y = 0
    const L_col = p.story_h;
    const md = Math.max(1, Math.round(p.mesh_density));
    const nz_col = 6 * md;
    const ny_col_flange = 2 * md;
    const nxc_web = md + 1;

    // Planos medios para merging correcto
    const xF_col = +p.d_col / 2 - p.tf_col / 2; // plano medio patín frontal col
    const xB_col = -p.d_col / 2 + p.tf_col / 2; // plano medio patín trasero col
    const xWebL = xB_col;                         // alma se conecta al patín trasero
    const xWebR = xF_col;                         // alma se conecta al patín frontal

    // Patín frontal (+x) — plano medio
    const colFrontGrid: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_col_flange; iy++) {
        const y = -p.bf_col / 2 + (iy * p.bf_col) / ny_col_flange;
        row.push(addNode(xF_col, y, z));
      }
      colFrontGrid.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++) {
      for (let iy = 0; iy < ny_col_flange; iy++) {
        addShell(
          colFrontGrid[iz][iy], colFrontGrid[iz][iy + 1],
          colFrontGrid[iz + 1][iy + 1], colFrontGrid[iz + 1][iy],
          p.tf_col,
        );
      }
    }

    // Patín trasero (-x) — plano medio
    const colBackGrid: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_col_flange; iy++) {
        const y = -p.bf_col / 2 + (iy * p.bf_col) / ny_col_flange;
        row.push(addNode(xB_col, y, z));
      }
      colBackGrid.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++) {
      for (let iy = 0; iy < ny_col_flange; iy++) {
        addShell(
          colBackGrid[iz][iy], colBackGrid[iz][iy + 1],
          colBackGrid[iz + 1][iy + 1], colBackGrid[iz + 1][iy],
          p.tf_col,
        );
      }
    }

    // Alma columna (plano XZ, y=0) — va de xB_col a xF_col (planos medios de patines)
    const colWebGrid: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let ix = 0; ix <= nxc_web; ix++) {
        const x = xWebL + (xWebR - xWebL) * (ix / nxc_web);
        row.push(addNode(x, 0, z));
      }
      colWebGrid.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++) {
      for (let ix = 0; ix < nxc_web; ix++) {
        addShell(
          colWebGrid[iz][ix], colWebGrid[iz][ix + 1],
          colWebGrid[iz + 1][ix + 1], colWebGrid[iz + 1][ix],
          p.tw_col,
        );
      }
    }

    // ── Viga W-shape con RBS (eje longitudinal X) ──
    const x0 = p.d_col / 2; // cara de la columna

    // Función bf(x_local) dogbone circular (AISC 358-22 Eq. 5.8-1)
    const x_a_loc = p.a_rbs * p.bf_beam;
    const x_b_loc = x_a_loc + p.b_rbs * p.d_beam;
    const x_rbs_center_local = (x_a_loc + x_b_loc) / 2;
    const c_cut = p.c_rbs * p.bf_beam;
    const b_dim = p.b_rbs * p.d_beam;
    const R_cut = (4 * c_cut * c_cut + b_dim * b_dim) / (8 * c_cut);

    const bfAt = (x_local: number): number => {
      if (x_local < x_a_loc || x_local > x_b_loc) return p.bf_beam;
      const dx = x_local - x_rbs_center_local;
      // Dogbone circular AISC 358-22 Fig. 5.1:
      //   reducción máxima (=c) en el CENTRO del RBS (dx=0)
      //   reducción CERO en los extremos (dx = ±b/2)
      // Centro del arco a distancia (R - c) del plano del patín original.
      const reduction = Math.sqrt(Math.max(0, R_cut * R_cut - dx * dx)) - (R_cut - c_cut);
      return p.bf_beam - 2 * Math.max(0, reduction);
    };

    // Discretización X con densidad en zona RBS (escala con mesh_density)
    const xList: number[] = [0];
    const n_before = 2 * md;
    for (let i = 1; i <= n_before; i++) xList.push((x_a_loc * i) / n_before);
    const n_rbs = 8 * md + 4; // más denso en la zona del dogbone (donde se ven fracturas)
    for (let i = 1; i < n_rbs; i++) xList.push(x_a_loc + ((x_b_loc - x_a_loc) * i) / n_rbs);
    xList.push(x_b_loc);
    const n_after = 5 * md;
    for (let i = 1; i <= n_after; i++) xList.push(x_b_loc + ((p.L_beam - x_b_loc) * i) / n_after);

    xList.sort((a, b) => a - b);
    const xUnique: number[] = [];
    for (const x of xList) {
      if (xUnique.length === 0 || xUnique[xUnique.length - 1] < x - 1e-6) xUnique.push(x);
    }

    // Nodos viga (patines con divisiones en Y, alma con divisiones en Z)
    // Planos medios: top flange en z=+d/2-tf/2, bot flange en z=-d/2+tf/2, web en y=0
    const zTop_b = +p.d_beam / 2 - p.tf_beam / 2;
    const zBot_b = -p.d_beam / 2 + p.tf_beam / 2;

    const topFlangeGrid: number[][] = [];
    const botFlangeGrid: number[][] = [];
    const webGrid: number[][] = [];
    const ny_beam_flange = 2 * md;
    const nz_beam_web = 2 * md;

    for (const x_local of xUnique) {
      const bf_local = bfAt(x_local);
      const x = x0 + x_local;

      const topRow: number[] = [];
      const botRow: number[] = [];
      for (let iy = 0; iy <= ny_beam_flange; iy++) {
        const y = -bf_local / 2 + (iy * bf_local) / ny_beam_flange;
        topRow.push(addNode(x, y, zTop_b));
        botRow.push(addNode(x, y, zBot_b));
      }
      topFlangeGrid.push(topRow);
      botFlangeGrid.push(botRow);

      // Alma: de zBot_b a zTop_b → el TOP del alma coincide con el centro (y=0) del patín superior
      // y el BOTTOM coincide con el centro del patín inferior → nodos se fusionan automáticamente
      const webRow: number[] = [];
      for (let iz = 0; iz <= nz_beam_web; iz++) {
        const z = zBot_b + (zTop_b - zBot_b) * (iz / nz_beam_web);
        webRow.push(addNode(x, 0, z));
      }
      webGrid.push(webRow);
    }

    for (let i = 0; i < xUnique.length - 1; i++) {
      for (let iy = 0; iy < ny_beam_flange; iy++) {
        addShell(
          topFlangeGrid[i][iy], topFlangeGrid[i][iy + 1],
          topFlangeGrid[i + 1][iy + 1], topFlangeGrid[i + 1][iy],
          p.tf_beam,
        );
        addShell(
          botFlangeGrid[i][iy], botFlangeGrid[i][iy + 1],
          botFlangeGrid[i + 1][iy + 1], botFlangeGrid[i + 1][iy],
          p.tf_beam,
        );
      }
      for (let iz = 0; iz < nz_beam_web; iz++) {
        addShell(
          webGrid[i][iz], webGrid[i][iz + 1],
          webGrid[i + 1][iz + 1], webGrid[i + 1][iz],
          p.tw_beam,
        );
      }
    }

    // ── Supports: la viga se empotra EN LA CARA DE LA COLUMNA (x = x0, i.e. xUnique[0]=0)
    //     Esto simula la conexión RBS completa (columna solo visual).
    //     Además empotramos la base de la columna para que no flote. ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    // Empotrar nodos de la viga en la cara de columna (primer índice X de la viga)
    const iFix = 0;
    for (let iy = 0; iy <= ny_beam_flange; iy++) {
      supports.set(topFlangeGrid[iFix][iy], [true, true, true, true, true, true]);
      supports.set(botFlangeGrid[iFix][iy], [true, true, true, true, true, true]);
    }
    for (let iz = 0; iz <= nz_beam_web; iz++) {
      supports.set(webGrid[iFix][iz], [true, true, true, true, true, true]);
    }
    // Empotrar base y top de columna (soporte visual, no afecta la viga)
    for (let i = 0; i < nodes.length; i++) {
      const z = nodes[i][2];
      const isCol = Math.abs(nodes[i][0]) > p.d_col / 2 - 1e-4 - 1e-6 || Math.abs(nodes[i][1]) < 1e-6;
      if (Math.abs(Math.abs(z) - L_col / 2) < 1e-4 && isCol && nodes[i][0] <= p.d_col / 2 + 1e-4) {
        if (!supports.has(i)) supports.set(i, [true, true, true, true, true, true]);
      }
    }

    // ── Cargas: fuerza vertical suave en el extremo de la viga (20% Mp_rbs para quedar en rango elástico) ──
    const bf_rbs_min = p.bf_beam * (1 - 2 * p.c_rbs);
    const Zx_rbs_est = bf_rbs_min * p.tf_beam * (p.d_beam - p.tf_beam);
    const Mp_rbs_est = p.Fy * Zx_rbs_est;
    const lever_arm = p.L_beam - p.a_rbs * p.bf_beam - (p.b_rbs * p.d_beam) / 2;
    const F_tip = (p.load_factor * Mp_rbs_est) / Math.max(lever_arm, 0.5);

    const loads = new Map<number, [number, number, number, number, number, number]>();
    const iTip = xUnique.length - 1; // último índice X (extremo libre)
    const F_per_node = F_tip / (ny_beam_flange + 1);
    for (let iy = 0; iy <= ny_beam_flange; iy++) {
      loads.set(topFlangeGrid[iTip][iy], [0, 0, -F_per_node, 0, 0, 0]);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      thicknesses, elasticities, poissonsRatios, densities,
      areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants, shearModuli,
    } as any;

    // ── Ejecutar solver (lineal / NL secante / IDEA pushover incremental) ──
    try {
      const mode = Math.round(p.use_nonlinear);
      if (mode === 2) {
        // ═══════════════════════════════════════════════════════════════
        // MODO IDEA StatiCa: pushover incremental con curva P-δ
        // ═══════════════════════════════════════════════════════════════
        const trackNode = topFlangeGrid[iTip][0]; // nodo del tip de la viga
        const ipo = incrementalPushover({
          nodes, elements,
          supports,
          elementInputs: states.elementInputs.val,
          buildLoads: (lam: number) => {
            const L = new Map<number, [number, number, number, number, number, number]>();
            const F_per = (F_tip * lam) / (ny_beam_flange + 1);
            for (let iy = 0; iy <= ny_beam_flange; iy++) {
              L.set(topFlangeGrid[iTip][iy], [0, 0, -F_per, 0, 0, 0]);
            }
            return L;
          },
          Fy: p.Fy,
          trackNode,
          trackDof: 2, // Z (desplazamiento vertical)
          nSteps: Math.round(p.idea_steps),
          maxIterPerStep: Math.round(p.nl_max_iter),
          softeningFactor: 0.90,
        });
        states.deformOutputs.val = ipo.finalDeformOutputs;
        const aOut = ipo.finalAnalyzeOutputs;
        // Percentile clamp para evitar que singularidades en supports saturen el rango
        const [vmin, vmax] = colormapPercentileRange((aOut as any).vonMises, 90, p.Fy);
        (aOut as any).colorMapRanges = { ...(aOut as any).colorMapRanges, vonMises: [vmin, vmax] };
        states.analyzeOutputs.val = aOut;
        (states as any).__ideaInfo = ipo;
        (states as any).__nlInfo = null;

        // Renderizar curva P-δ 3D al lado del modelo
        const chartCenter: [number, number, number] = [
          x0 + p.L_beam * 0.55,
          -p.bf_beam * 2.5,
          0,
        ];
        const chartObjects = buildPushoverChart3D({
          lambdas: ipo.lambdas,
          displacements: ipo.displacements,
          firstYieldStep: ipo.firstYieldStep,
          center: chartCenter,
          size: Math.max(p.L_beam * 0.4, 1.0),
          plane: "xz",
        });
        // Agregar a objects3D existentes (junto con la rótula y soldaduras)
        states.objects3D.val = [...states.objects3D.val, ...chartObjects];

        console.log(
          `[conexion-rbs IDEA] ${ipo.lambdas.length} pasos | ` +
            `λ_max=${ipo.ultimateLoadFactor.toFixed(2)} | ` +
            `δ_max=${(ipo.displacements[ipo.displacements.length - 1] * 1000).toFixed(2)}mm | ` +
            `1er yield en paso ${ipo.firstYieldStep + 1}/${ipo.lambdas.length} | ` +
            `k_elástica=${ipo.elasticStiffness.toFixed(1)}`,
        );
      } else if (mode === 1) {
        const nl = secantPlasticSolve({
          nodes, elements,
          nodeInputs: { supports, loads },
          elementInputs: states.elementInputs.val,
          Fy: p.Fy,
          maxIter: Math.round(p.nl_max_iter),
          tol: 0.03,
          softeningFactor: 0.90,
        });
        states.deformOutputs.val = nl.deformOutputs;
        const aOut = nl.analyzeOutputs;
        const [vmin1, vmax1] = colormapPercentileRange((aOut as any).vonMises, 90, p.Fy);
        (aOut as any).colorMapRanges = { ...(aOut as any).colorMapRanges, vonMises: [vmin1, vmax1] };
        states.analyzeOutputs.val = aOut;
        (states as any).__nlInfo = {
          iterations: nl.iterations, converged: nl.converged,
          elementsYielded: nl.elementsYielded, maxRatio: nl.maxRatio,
        };
        (states as any).__ideaInfo = null;
      } else {
        const dOut = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
        states.deformOutputs.val = dOut;
        const aOut = analyze(nodes, elements, states.elementInputs.val, dOut);
        const [vmin2, vmax2] = colormapPercentileRange((aOut as any).vonMises, 90, p.Fy);
        (aOut as any).colorMapRanges = { ...(aOut as any).colorMapRanges, vonMises: [vmin2, vmax2] };
        states.analyzeOutputs.val = aOut;
        (states as any).__nlInfo = null;
        (states as any).__ideaInfo = null;
      }
    } catch (e: any) {
      console.error("[conexion-rbs] solver error:", e?.message || e, e);
      states.deformOutputs.val = {} as any;
      states.analyzeOutputs.val = {} as any;
    }

    // ═══════════════════════════════════════════════════════════════
    // Component-based analysis (CBFEM-style tipo IDEA StatiCa Sprint 2)
    // ═══════════════════════════════════════════════════════════════
    try {
      const zoneMap = classifyRbsZones({
        nodes, elements,
        x_col_face: x0,
        d_col: p.d_col, bf_col: p.bf_col, tf_col: p.tf_col,
        d_beam: p.d_beam, bf_beam: p.bf_beam, tf_beam: p.tf_beam,
        x_rbs_start: x0 + x_a_loc,
        x_rbs_end: x0 + x_b_loc,
        weld_tol: p.tf_beam * 1.5,
      });
      const vmMap = (states.analyzeOutputs.val as any)?.vonMises;
      if (vmMap) {
        const ratios = computeStrengthRatios(zoneMap, vmMap, p.Fy);
        const gov = governingComponent(ratios);
        const mode = failureMode(gov);
        (states as any).__componentRatios = ratios;
        (states as any).__governingComponent = gov;
        (states as any).__failureMode = mode;

        // ═══ IDEA-style colormap: cada shell muestra el ratio DE SU ZONA ═══
        // Esto hace que el componente entero se vea de UN color (según su ratio),
        // no shell-por-shell. Reemplaza temporalmente el vonMises con este campo.
        if (p.colormap_mode > 0.5) {
          const ratioByZone = new Map<string, number>();
          for (const r of ratios) ratioByZone.set(r.zone, r.ratio);
          const utilizationMap = new Map<number, number[]>();
          for (let ei = 0; ei < elements.length; ei++) {
            const zone = zoneMap.get(ei);
            const r = zone ? (ratioByZone.get(zone) ?? 0) : 0;
            // Valor en la unidad σ_vm equivalente (ratio × Fy) → el slider
            // [0, Fy] del colormap lo mapea directamente al código IDEA:
            //   azul = 0 (0% util)  · verde = 0.5·Fy (50%)
            //   amarillo = 0.8·Fy (80%) · rojo = Fy (100% = fluencia)
            const nNodes = elements[ei].length;
            const vals: number[] = new Array(nNodes).fill(r * p.Fy);
            utilizationMap.set(ei, vals);
          }
          // Sobrescribir vonMises con el utilization por componente
          (states.analyzeOutputs.val as any).vonMises = utilizationMap;
          // Mantener colorMapRanges en [0, Fy] para que 100% util = rojo
          (states.analyzeOutputs.val as any).colorMapRanges = {
            ...(states.analyzeOutputs.val as any).colorMapRanges,
            vonMises: [0, p.Fy],
          };
        }

        // Marcar gobernante con halo rojo 3D
        const govObjs = buildGoverningMarker(nodes, elements, zoneMap, gov?.zone ?? null);
        states.objects3D.val = [...states.objects3D.val, ...govObjs];
      }
    } catch (e: any) {
      console.warn("[conexion-rbs] component analysis skipped:", e?.message || e);
    }

    // ── Rótula plástica visual en el centro del RBS ──
    const objects: THREE.Object3D[] = [];
    const x_rbs_center = x0 + x_rbs_center_local;
    const r_hinge = Math.min(p.bf_beam, p.d_beam) * 0.28;

    // Esfera roja — zona de rótula plástica
    const hingeGeom = new THREE.SphereGeometry(r_hinge, 20, 16);
    const hingeMat = new THREE.MeshStandardMaterial({
      color: 0xff2200, emissive: 0x661100, metalness: 0.2, roughness: 0.5,
      transparent: true, opacity: 0.85,
    });
    const hingeSphere = new THREE.Mesh(hingeGeom, hingeMat);
    hingeSphere.position.set(x_rbs_center, 0, 0);
    objects.push(hingeSphere);

    // Anillo naranja horizontal (marca de rotación plástica)
    const ringGeom = new THREE.TorusGeometry(r_hinge * 1.25, 0.015, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x442200 });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.set(x_rbs_center, 0, 0);
    ring.rotation.y = Math.PI / 2;
    objects.push(ring);

    // ── Soldaduras de la conexión (cordones visibles) ──
    const weldColor = p.weld_type < 0.5 ? 0xffaa00 : p.weld_type < 1.5 ? 0xff7700 : 0xff5500;
    const weldGarganta =
      p.weld_type < 0.5 ? p.tf_beam * 0.95 : p.weld_type < 1.5 ? p.tf_beam * 0.6 : p.weld_throat;
    // Cordón del ala superior (cara de columna, y∈[-bf/2, +bf/2], z = zTop_b)
    const mkWeldFlange = (zCenter: number) => {
      const geom = new THREE.BoxGeometry(weldGarganta * 1.1, p.bf_beam, weldGarganta * 1.2);
      const mat = new THREE.MeshStandardMaterial({
        color: weldColor, emissive: 0x331100, metalness: 0.7, roughness: 0.45,
      });
      const m = new THREE.Mesh(geom, mat);
      m.position.set(x0 - weldGarganta / 2, 0, zCenter);
      return m;
    };
    objects.push(mkWeldFlange(+p.d_beam / 2 - p.tf_beam / 2));
    objects.push(mkWeldFlange(-p.d_beam / 2 + p.tf_beam / 2));

    // Cordón del alma (vertical, z∈[-d/2+tf, +d/2-tf])
    const webWeldH = p.d_beam - 2 * p.tf_beam - (p.weld_access_hole > 0.5 ? 2 * (p.tf_beam * 1.5) : 0);
    const webWeldGeom = new THREE.BoxGeometry(weldGarganta * 1.1, weldGarganta * 1.2, webWeldH);
    const webWeldMat = new THREE.MeshStandardMaterial({
      color: weldColor, emissive: 0x331100, metalness: 0.7, roughness: 0.45,
    });
    const webWeld = new THREE.Mesh(webWeldGeom, webWeldMat);
    webWeld.position.set(x0 - weldGarganta / 2, 0, 0);
    objects.push(webWeld);

    // Weld access holes (muescas de acceso AWS D1.8) como anillos oscuros
    if (p.weld_access_hole > 0.5) {
      const holeR = p.tf_beam * 1.2;
      for (const zC of [+p.d_beam / 2 - p.tf_beam - holeR, -p.d_beam / 2 + p.tf_beam + holeR]) {
        const hg = new THREE.TorusGeometry(holeR, 0.003, 10, 24);
        const hm = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.6 });
        const hole = new THREE.Mesh(hg, hm);
        hole.position.set(x0 + 0.002, 0, zC);
        hole.rotation.y = Math.PI / 2;
        objects.push(hole);
      }
    }

    // Backup bar (barra de respaldo, típico en CJP)
    if (p.weld_type < 0.5) {
      const bbGeom = new THREE.BoxGeometry(0.025, p.bf_beam + 0.02, 0.01);
      const bbMat = new THREE.MeshStandardMaterial({ color: 0x554433, metalness: 0.3, roughness: 0.8 });
      for (const zC of [+p.d_beam / 2 - p.tf_beam / 2, -p.d_beam / 2 + p.tf_beam / 2]) {
        const bb = new THREE.Mesh(bbGeom, bbMat);
        const zSign = zC > 0 ? -1 : +1; // backup bar fuera del patín (opuesto a la carga)
        bb.position.set(x0 - 0.015, 0, zC + zSign * p.tf_beam * 0.7);
        objects.push(bb);
      }
    }

    // Marcas guía de inicio y fin del RBS (líneas amarillas en los patines)
    const mkLine = (x_local: number) => {
      const bf_l = bfAt(x_local);
      const x = x0 + x_local;
      const pts = [
        new THREE.Vector3(x, -bf_l / 2, +p.d_beam / 2 + 0.005),
        new THREE.Vector3(x, +bf_l / 2, +p.d_beam / 2 + 0.005),
        new THREE.Vector3(x, +bf_l / 2, -p.d_beam / 2 - 0.005),
        new THREE.Vector3(x, -bf_l / 2, -p.d_beam / 2 - 0.005),
        new THREE.Vector3(x, -bf_l / 2, +p.d_beam / 2 + 0.005),
      ];
      const lg = new THREE.BufferGeometry().setFromPoints(pts);
      const lm = new THREE.LineBasicMaterial({ color: 0xffff00 });
      return new THREE.Line(lg, lm);
    };
    objects.push(mkLine(x_a_loc));
    objects.push(mkLine(x_b_loc));

    states.objects3D.val = objects;

    // ── 2. Protocolo K3 + material cíclico Menegotto-Pinto ──
    const finalDrift = p.classification < 0.5 ? 0.02 : p.classification < 1.5 ? 0.04 : 0.06;
    const driftHistory = aiscK3StrainHistory(p.story_h, Math.round(p.steps_per_cycle), finalDrift);
    const L_p = p.b_rbs * p.d_beam;
    const eps_factor = p.d_beam / 2 / L_p;

    const mp_params: MenegottoPintoParams = {
      Fy: p.Fy, E: p.E_steel, b: p.b_hard, R0: 15, cR1: 0.925, cR2: 0.15,
    };

    const bf_rbs = p.bf_beam * (1 - 2 * p.c_rbs);
    const Zx_rbs_simple = bf_rbs * p.tf_beam * (p.d_beam - p.tf_beam);
    const Mp_rbs = p.Fy * Zx_rbs_simple;

    const thetaHistory: number[] = [];
    const MHistory: number[] = [];
    let state = initMpState(mp_params);
    for (const theta of driftHistory) {
      const eps = theta * eps_factor;
      state = mpStep(eps, state, mp_params);
      thetaHistory.push(theta);
      MHistory.push(state.sigma * Zx_rbs_simple);
    }

    (states as any).__rbsHistory = {
      theta: thetaHistory, M: MHistory, Mp: Mp_rbs,
      targetDrift: finalDrift,
      classification: p.classification < 0.5 ? "IMF" : p.classification < 1.5 ? "SMF" : "Extended",
    };

    // ── Gráficos 3D animables: histéresis M-θ + protocolo K3 ──
    const chartSize = Math.max(p.L_beam * 0.6, 1.5);
    const hystHandle = buildHysteresisChart3D({
      theta: thetaHistory,
      M: MHistory,
      Mp: Mp_rbs,
      targetDrift: finalDrift,
      center: [x0 + p.L_beam + chartSize * 0.7, 0, 0],
      size: chartSize,
      plane: "xz",
    });
    const protocolHandle = buildLoadingProtocolChart3D({
      drifts: thetaHistory,
      center: [x0 + p.L_beam * 0.5 - chartSize / 2, 0, -p.story_h / 2 - chartSize * 0.7],
      size: chartSize,
      plane: "xz",
    });
    states.objects3D.val = [
      ...states.objects3D.val,
      ...hystHandle.objects,
      ...protocolHandle.objects,
    ];
    // Guardar handles para usarlos en la animación
    (window as any).__rbsCharts = { hyst: hystHandle, prot: protocolHandle };
    // Si la animación está OFF, mostrar curvas completas; si está ON, partir vacías
    if (p.animate_k3 < 0.5) {
      hystHandle.setProgress(thetaHistory.length - 1);
      protocolHandle.setProgress(thetaHistory.length - 1);
      hystHandle.moveCursor(thetaHistory.length - 1);
      protocolHandle.moveCursor(thetaHistory.length - 1);
    } else {
      hystHandle.setProgress(0);
      protocolHandle.setProgress(0);
    }

    // ── Animación K3: el deformScale del viewer pulsa con el protocolo ──
    // Limpiar animación previa si existe (al re-build)
    const prevAnim = (window as any).__rbsK3Anim;
    if (prevAnim) {
      clearInterval(prevAnim);
      (window as any).__rbsK3Anim = null;
    }
    if (p.animate_k3 > 0.5) {
      const periodMs = p.animate_k3 < 1.5 ? 25 : 100; // 40 Hz vs 10 Hz
      const driftMax = Math.max(...thetaHistory.map((d) => Math.abs(d)));
      const ampFactor = p.anim_amp;
      let step = 0;
      const charts = (window as any).__rbsCharts;
      setTimeout(() => {
        const findViewer = (): any => {
          const divs = document.querySelectorAll("div");
          for (const d of divs) if ((d as any).__settings && (d as any).__ctx) return d;
          return null;
        };
        const viewerEl = findViewer();
        if (!viewerEl) return;
        const settings = viewerEl.__settings;
        const ctx = viewerEl.__ctx;
        if (!settings?.deformScale || !ctx?.render) return;
        if (settings.deformedShape) settings.deformedShape.val = true;
        const id = setInterval(() => {
          const driftNow = thetaHistory[step] ?? 0;
          const scale = (driftNow / driftMax) * ampFactor;
          settings.deformScale.val = scale;
          // Sincronizar gráficas
          if (charts?.hyst) {
            charts.hyst.moveCursor(step);
            charts.hyst.setProgress(step);
          }
          if (charts?.prot) {
            charts.prot.moveCursor(step);
            charts.prot.setProgress(step);
          }
          ctx.render?.();
          step = (step + 1) % thetaHistory.length;
        }, periodMs);
        (window as any).__rbsK3Anim = id;
      }, 600);
    }

    // Log verificación
    let M_at_target = 0;
    for (let i = 0; i < thetaHistory.length; i++) {
      if (Math.abs(thetaHistory[i] - finalDrift) < 0.005) {
        if (Math.abs(MHistory[i]) > Math.abs(M_at_target)) M_at_target = MHistory[i];
      }
    }
    const ratio = Math.abs(M_at_target) / Mp_rbs;
    console.log(
      `[RBS AISC 358-22] Shells=${elements.length}, Nodos=${nodes.length}\n` +
        `  bf_rbs=${bf_rbs.toFixed(3)}m, Mp_rbs=${Mp_rbs.toFixed(1)} kN·m\n` +
        `  M@${(finalDrift * 100).toFixed(1)}%=${M_at_target.toFixed(1)} kN·m · Ratio=${ratio.toFixed(3)} → ${ratio >= 0.8 ? "PASA" : "FALLA"}`,
    );
  },
  computedLabels(p, states) {
    const hist = (states as any).__rbsHistory as any;
    if (!hist) return { "Status": "—" };

    const bf_rbs = p.bf_beam * (1 - 2 * p.c_rbs);
    const Zx_rbs = bf_rbs * p.tf_beam * (p.d_beam - p.tf_beam);
    const Mp = hist.Mp;
    const targetTheta = hist.targetDrift;

    let M_max = 0;
    for (const M of hist.M as number[]) {
      if (Math.abs(M) > Math.abs(M_max)) M_max = M;
    }
    let M_at_target = 0;
    for (let i = 0; i < hist.theta.length; i++) {
      if (Math.abs(hist.theta[i] - targetTheta) < 0.005) {
        if (Math.abs(hist.M[i]) > Math.abs(M_at_target)) M_at_target = hist.M[i];
      }
    }
    const ratio = Math.abs(M_at_target) / Mp;

    return {
      "── Geometría RBS (AISC 358-22 §5) ──": "",
      "Clasificación ensayo": hist.classification,
      "Target drift θ": `${(targetTheta * 100).toFixed(1)} %`,
      "bf patín original": `${(p.bf_beam * 1000).toFixed(0)} mm`,
      "bf patín reducido RBS": `${(bf_rbs * 1000).toFixed(0)} mm (-${(p.c_rbs * 100 * 2).toFixed(0)}%)`,
      "a (inicio dogbone)": `${(p.a_rbs * p.bf_beam * 1000).toFixed(0)} mm desde cara col`,
      "b (long. dogbone)": `${(p.b_rbs * p.d_beam * 1000).toFixed(0)} mm`,
      "c (corte máx c/lado)": `${(p.c_rbs * p.bf_beam * 1000).toFixed(0)} mm`,
      "Zx_rbs": `${(Zx_rbs * 1e6).toFixed(0)} cm³`,
      "Mp_rbs": `${Mp.toFixed(1)} kN·m`,
      "── Protocolo AISC 341 K3 ──": "",
      "M_max en historia": `${Math.abs(M_max).toFixed(1)} kN·m`,
      "M @ target drift": `${Math.abs(M_at_target).toFixed(1)} kN·m`,
      "Ratio M/Mp @ target": `${ratio.toFixed(3)}`,
      "Criterio (≥ 0.80)": `${ratio >= 0.8 ? "✓ PASA" : "✗ FALLA"} — ${hist.classification}`,
      "Data points generados": `${hist.theta.length}`,
      "── Soldadura AISC 360 §J2 ──": "",
      ...(() => {
        const weldType = p.weld_type < 0.5 ? "CJP" : p.weld_type < 1.5 ? "PJP" : "Filete";
        const garganta = p.weld_type < 0.5 ? p.tf_beam : p.weld_type < 1.5 ? p.tf_beam * 0.7 : p.weld_throat;
        const Fexx = p.electrode_Fexx;
        const phi = 0.75;
        // CJP con electrodo matching = capacidad full del patín
        // PJP/Filete: 0.60·Fexx en sección efectiva
        const L_flange = p.bf_beam; // longitud cordón patín
        const A_flange = garganta * L_flange;
        const Rn_flange =
          p.weld_type < 0.5
            ? p.Fy * p.bf_beam * p.tf_beam // CJP desarrolla patín completo
            : 0.6 * Fexx * A_flange;
        const phiRn_flange = phi * Rn_flange;
        // Tensión máxima en el patín = M / (d - tf) — par de fuerzas en las dos alas
        const M_design = 0.8 * Mp;
        const F_flange = M_design / Math.max(p.d_beam - p.tf_beam, 0.1);
        const ratio_weld = F_flange / phiRn_flange;
        const electrodoTxt =
          Fexx < 440_000 ? "E60XX" : Fexx < 520_000 ? "E70XX" : "E80XX";
        return {
          "Tipo soldadura": weldType,
          "Electrodo": `${electrodoTxt} (Fexx=${(Fexx / 1000).toFixed(0)} MPa)`,
          "Garganta efectiva": `${(garganta * 1000).toFixed(1)} mm`,
          "L cordón (patín)": `${(L_flange * 1000).toFixed(0)} mm`,
          "Ae (patín)": `${(A_flange * 1e6).toFixed(0)} mm²`,
          "Rn cordón (nominal)": `${Rn_flange.toFixed(0)} kN`,
          "φRn (diseño)": `${phiRn_flange.toFixed(0)} kN`,
          "F_demand en patín (0.8Mp)": `${F_flange.toFixed(0)} kN`,
          "Ratio F/φRn": `${ratio_weld.toFixed(3)} ${ratio_weld <= 1 ? "✓" : "✗"}`,
          "Weld access hole": p.weld_access_hole > 0.5 ? "Sí (AWS D1.8 §6.10)" : "No",
          "Dictamen soldadura": p.weld_type < 0.5
            ? "CJP ✓ Demand-critical (AISC 358 §3.7)"
            : ratio_weld <= 1 ? "✓ OK" : "✗ REVISAR garganta / electrodo",
        };
      })(),
      ...(() => {
        // Tabla de componentes tipo IDEA StatiCa
        const ratios = (states as any).__componentRatios;
        const gov = (states as any).__governingComponent;
        const fMode = (states as any).__failureMode;
        if (!ratios || ratios.length === 0) return {};
        const out: Record<string, string> = {
          "── Componentes (σvm/Fy) tipo IDEA StatiCa ──": "",
        };
        for (const r of ratios.slice(0, 8)) {
          out[`${r.statusIcon} ${r.label}`] = `${(r.ratio * 100).toFixed(0)}% (${r.nElements} shells)`;
        }
        if (gov) out["🎯 Componente gobernante"] = gov.label;
        if (fMode) out["🔎 Modo de falla estimado"] = fMode;
        return out;
      })(),
      ...(() => {
        const idea = (states as any).__ideaInfo;
        const nl = (states as any).__nlInfo;
        if (idea) {
          const lastD = idea.displacements[idea.displacements.length - 1] ?? 0;
          const lastλ = idea.lambdas[idea.lambdas.length - 1] ?? 0;
          const yieldλ =
            idea.firstYieldStep >= 0 ? idea.lambdas[idea.firstYieldStep] : null;
          const yieldδ =
            idea.firstYieldStep >= 0 ? idea.displacements[idea.firstYieldStep] : null;
          const maxVM = Math.max(...idea.vonMisesMax);
          const lastYielded = idea.elementsYielded[idea.elementsYielded.length - 1] ?? 0;
          const allConverged = idea.converged.every((c: boolean) => c);
          return {
            "── IDEA StatiCa (pushover incremental) ──": "",
            "Pasos ejecutados": `${idea.lambdas.length}`,
            "Convergencia": allConverged ? "✓ todos los pasos" : "✗ algún paso no convergió",
            "λ inicio fluencia": yieldλ !== null ? `${(yieldλ * 100).toFixed(0)}% (paso ${idea.firstYieldStep + 1})` : "no fluyó",
            "δ @ 1er yield": yieldδ !== null ? `${(yieldδ * 1000).toFixed(2)} mm` : "—",
            "λ final": `${(lastλ * 100).toFixed(0)}%`,
            "δ final (tip)": `${(lastD * 1000).toFixed(2)} mm`,
            "k elástica (λ/δ)": `${idea.elasticStiffness.toFixed(2)} 1/m`,
            "σvm_max (todo el pushover)": `${(maxVM / 1000).toFixed(1)} MPa`,
            "σvm / Fy": `${(maxVM / p.Fy).toFixed(2)}`,
            "Shells plastificados (final)": `${lastYielded}`,
            "Modo falla (estimado)": lastYielded > 0
              ? "RBS (dogbone) — donde concentra plastificación"
              : "Rango elástico (aumentá load_factor)",
          };
        }
        if (!nl) return { "── Solver FEM shells ──": "", "Tipo": "Lineal elástico" };
        return {
          "── Solver FEM shells (NO-LINEAL J2) ──": "",
          "Iteraciones NL": `${nl.iterations}${nl.converged ? " ✓ convergió" : " ✗ max-iter"}`,
          "Elementos plastificados": `${nl.elementsYielded}`,
          "Max σ/Fy (lineal inicial)": nl.maxRatio.toFixed(2),
          "Interpretación": nl.elementsYielded > 0
            ? `${nl.elementsYielded} shells fluyeron → redistribución`
            : "Rango elástico (sin plastificar)",
        };
      })(),
    };
  },
};

// Suppress unused
void mpHistory;
