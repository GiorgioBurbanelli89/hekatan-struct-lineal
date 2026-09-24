/**
 * Conexión BFP (Bolted Flange Plate) — AISC 358-22 §7
 *
 * Precalificada para SMF (Special Moment Frame) e IMF (Intermediate Moment
 * Frame). El patín de la viga se conecta a la columna mediante DOS placas
 * de patín (top y bottom) atornilladas a los patines de la viga y soldadas
 * (CJP) al patín de la columna.
 *
 * Las rótulas plásticas se forman en la viga a una distancia Sh = a + s/2
 * desde la cara de la columna, donde:
 *   - a = distancia desde la cara de columna al primer perno
 *   - s = espacio entre filas de pernos
 *
 * Referencia: F. Crisafulli (2018) + AISC 358-22 §7.
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import type { Node, Element } from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import { colormapPercentileRange } from "../shared/colorMapPercentile";
import * as THREE from "three";

export const conexionBfp: ExampleDef = {
  id: "conexion-bfp",
  name: "Conexión BFP (Bolted Flange Plate · AISC 358 §7)",
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
    d_beam:  { default: 0.50, min: 0.30, max: 0.90, step: 0.02, label: "d viga (m)", folder: "Viga" },
    bf_beam: { default: 0.20, min: 0.12, max: 0.40, step: 0.01, label: "bf patín viga (m)", folder: "Viga" },
    tf_beam: { default: 0.018, min: 0.010, max: 0.040, step: 0.002, label: "tf patín viga (m)", folder: "Viga" },
    tw_beam: { default: 0.012, min: 0.008, max: 0.025, step: 0.001, label: "tw alma viga (m)", folder: "Viga" },
    L_beam:  { default: 3.50, min: 2.0, max: 6.0, step: 0.10, label: "L viga (m)", folder: "Viga" },
    // ── Columna W-shape ──
    d_col:   { default: 0.40, min: 0.30, max: 0.70, step: 0.02, label: "d columna (m)", folder: "Columna" },
    bf_col:  { default: 0.40, min: 0.25, max: 0.60, step: 0.01, label: "bf col (m)", folder: "Columna" },
    tf_col:  { default: 0.025, min: 0.012, max: 0.050, step: 0.002, label: "tf col (m)", folder: "Columna" },
    tw_col:  { default: 0.018, min: 0.010, max: 0.035, step: 0.001, label: "tw col (m)", folder: "Columna" },
    // ── Placa de patín (BFP §7.6) ──
    bp:      { default: 0.20, min: 0.12, max: 0.40, step: 0.01, label: "bp ancho placa (m)", folder: "Placa BFP" },
    tp:      { default: 0.025, min: 0.015, max: 0.050, step: 0.002, label: "tp espesor placa (m)", folder: "Placa BFP" },
    Lp:      { default: 0.40, min: 0.20, max: 0.80, step: 0.02, label: "Lp largo placa (m)", folder: "Placa BFP" },
    // ── Pernos ──
    n_rows:  { default: 4, label: "Filas de pernos", options: { "2": 2, "3": 3, "4": 4, "5": 5 }, folder: "Pernos" },
    n_cols:  { default: 2, label: "Columnas de pernos", options: { "1": 1, "2": 2, "3": 3 }, folder: "Pernos" },
    d_bolt:  { default: 0.022, min: 0.012, max: 0.040, step: 0.002, label: "Ø perno (m)", folder: "Pernos" },
    s_pitch: { default: 0.07, min: 0.04, max: 0.15, step: 0.01, label: "s pitch (m)", folder: "Pernos" },
    a_edge:  { default: 0.05, min: 0.025, max: 0.10, step: 0.005, label: "a edge (m)", folder: "Pernos" },
    // ── Material ──
    Fy:      { default: 345_000, min: 250_000, max: 450_000, step: 5_000, label: "Fy acero (kN/m²)", folder: "Material" },
    Fu_bolt: { default: 830_000, min: 600_000, max: 1_030_000, step: 10_000, label: "Fu perno (kN/m²)", folder: "Material" },
    E_steel: { default: 200_000_000, min: 190e6, max: 210e6, step: 1e6, label: "E (kN/m²)", folder: "Material" },
    // ── Cargas ──
    Mu:      { default: 400, min: 0, max: 2000, step: 25, label: "Mu demanda (kN·m)", folder: "Cargas", unitType: "moment" },
    // ── Malla ──
    mesh_density: { default: 2, min: 1, max: 5, step: 1, label: "Densidad malla (2 = rápido, 4 = denso)", folder: "Malla" },
  },
  build(p, states) {
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
    const rho_steel = 77 / 9.81; // ton/m³

    // Node merging
    const NODE_EPS = 1e-4;
    const nodeMap = new Map<string, number>();
    const addNode = (x: number, y: number, z: number): number => {
      const key = `${Math.round(x/NODE_EPS)},${Math.round(y/NODE_EPS)},${Math.round(z/NODE_EPS)}`;
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

    const md = Math.max(1, Math.round(p.mesh_density));
    const L_col = 4.0;
    const xF_col = +p.d_col / 2 - p.tf_col / 2;
    const xB_col = -p.d_col / 2 + p.tf_col / 2;
    const nz_col = 8 * md;
    const ny_col = 2 * md;

    // Columna patín frontal
    const colF: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_col; iy++) {
        row.push(addNode(xF_col, -p.bf_col/2 + (iy*p.bf_col)/ny_col, z));
      }
      colF.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++)
      for (let iy = 0; iy < ny_col; iy++)
        addShell(colF[iz][iy], colF[iz][iy+1], colF[iz+1][iy+1], colF[iz+1][iy], p.tf_col);

    // Columna patín trasero
    const colB: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_col; iy++) {
        row.push(addNode(xB_col, -p.bf_col/2 + (iy*p.bf_col)/ny_col, z));
      }
      colB.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++)
      for (let iy = 0; iy < ny_col; iy++)
        addShell(colB[iz][iy], colB[iz][iy+1], colB[iz+1][iy+1], colB[iz+1][iy], p.tf_col);

    // Alma columna
    const nxc = md + 1;
    const colW: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let ix = 0; ix <= nxc; ix++) {
        const x = xB_col + (xF_col - xB_col) * (ix / nxc);
        row.push(addNode(x, 0, z));
      }
      colW.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++)
      for (let ix = 0; ix < nxc; ix++)
        addShell(colW[iz][ix], colW[iz][ix+1], colW[iz+1][ix+1], colW[iz+1][ix], p.tw_col);

    // Viga (eje X) — empieza en x = xF_col
    const x0 = xF_col;
    const zTop_b = +p.d_beam / 2 - p.tf_beam / 2;
    const zBot_b = -p.d_beam / 2 + p.tf_beam / 2;
    const nx_beam = 8 * md;
    const ny_beam = 2 * md;
    const nz_beam_web = 2 * md;

    // Patines + alma viga
    const beamTop: number[][] = [];
    const beamBot: number[][] = [];
    const beamWeb: number[][] = [];
    for (let i = 0; i <= nx_beam; i++) {
      const x = x0 + (i * p.L_beam) / nx_beam;
      const topRow: number[] = [];
      const botRow: number[] = [];
      for (let iy = 0; iy <= ny_beam; iy++) {
        const y = -p.bf_beam/2 + (iy*p.bf_beam)/ny_beam;
        topRow.push(addNode(x, y, zTop_b));
        botRow.push(addNode(x, y, zBot_b));
      }
      beamTop.push(topRow);
      beamBot.push(botRow);
      const webRow: number[] = [];
      for (let iz = 0; iz <= nz_beam_web; iz++) {
        const z = zBot_b + (zTop_b - zBot_b) * (iz / nz_beam_web);
        webRow.push(addNode(x, 0, z));
      }
      beamWeb.push(webRow);
    }
    for (let i = 0; i < nx_beam; i++) {
      for (let iy = 0; iy < ny_beam; iy++) {
        addShell(beamTop[i][iy], beamTop[i][iy+1], beamTop[i+1][iy+1], beamTop[i+1][iy], p.tf_beam);
        addShell(beamBot[i][iy], beamBot[i][iy+1], beamBot[i+1][iy+1], beamBot[i+1][iy], p.tf_beam);
      }
      for (let iz = 0; iz < nz_beam_web; iz++) {
        addShell(beamWeb[i][iz], beamWeb[i][iz+1], beamWeb[i+1][iz+1], beamWeb[i+1][iz], p.tw_beam);
      }
    }

    // PLACAS de patín (top + bottom) — extendidas
    const z_plate_top = zTop_b + p.tf_beam/2 + p.tp/2; // por encima del patín superior
    const z_plate_bot = zBot_b - p.tf_beam/2 - p.tp/2; // por debajo del patín inferior
    const ny_p = 2 * md;
    const nx_p = 4 * md;
    const platesTop: number[][] = [];
    const platesBot: number[][] = [];
    for (let i = 0; i <= nx_p; i++) {
      const x = x0 + (i * p.Lp) / nx_p;
      const topRow: number[] = [];
      const botRow: number[] = [];
      for (let iy = 0; iy <= ny_p; iy++) {
        const y = -p.bp/2 + (iy*p.bp)/ny_p;
        topRow.push(addNode(x, y, z_plate_top));
        botRow.push(addNode(x, y, z_plate_bot));
      }
      platesTop.push(topRow);
      platesBot.push(botRow);
    }
    for (let i = 0; i < nx_p; i++) {
      for (let iy = 0; iy < ny_p; iy++) {
        addShell(platesTop[i][iy], platesTop[i][iy+1], platesTop[i+1][iy+1], platesTop[i+1][iy], p.tp);
        addShell(platesBot[i][iy], platesBot[i][iy+1], platesBot[i+1][iy+1], platesBot[i+1][iy], p.tp);
      }
    }

    // ── Supports: empotrar viga en cara columna ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const iFix = 0;
    for (let iy = 0; iy <= ny_beam; iy++) {
      supports.set(beamTop[iFix][iy], [true, true, true, true, true, true]);
      supports.set(beamBot[iFix][iy], [true, true, true, true, true, true]);
    }
    for (let iz = 0; iz <= nz_beam_web; iz++) {
      supports.set(beamWeb[iFix][iz], [true, true, true, true, true, true]);
    }
    // Empotrar también top y bot de columna
    for (let i = 0; i < nodes.length; i++) {
      if (Math.abs(Math.abs(nodes[i][2]) - L_col/2) < 1e-4 && Math.abs(nodes[i][0]) >= p.d_col/2 - p.tf_col - 1e-4) {
        if (!supports.has(i)) supports.set(i, [true, true, true, true, true, true]);
      }
    }

    // ── Cargas: par de fuerzas en patines del extremo (genera momento) ──
    const lever = p.L_beam - p.Lp;
    const F_target = p.Mu / Math.max(p.d_beam - p.tf_beam, 0.1) * 0.5; // 50% Mu
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const iTip = nx_beam;
    const F_per = F_target / (ny_beam + 1);
    for (let iy = 0; iy <= ny_beam; iy++) {
      loads.set(beamTop[iTip][iy], [0, 0, -F_per, 0, 0, 0]);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      thicknesses, elasticities, poissonsRatios, densities,
      areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants, shearModuli,
    } as any;

    try {
      const dOut = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.deformOutputs.val = dOut;
      const aOut = analyze(nodes, elements, states.elementInputs.val, dOut);
      // Percentile clamp para evitar saturación por singularidades en cargas
      const [vmin, vmax] = colormapPercentileRange((aOut as any).vonMises, 85, p.Fy);
      (aOut as any).colorMapRanges = { ...(aOut as any).colorMapRanges, vonMises: [vmin, vmax] };
      states.analyzeOutputs.val = aOut;
    } catch (e: any) {
      console.error("[BFP] solver error:", e?.message);
    }

    // ── Pernos visualizados ──
    const objects: THREE.Object3D[] = [];
    const boltMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 });
    const nRows = Math.round(p.n_rows);
    const nCols = Math.round(p.n_cols);
    for (let row = 0; row < nRows; row++) {
      const x_b = x0 + p.a_edge + row * p.s_pitch;
      for (let col = 0; col < nCols; col++) {
        const y_b = (col - (nCols - 1) / 2) * p.s_pitch;
        for (const z_b of [z_plate_top, z_plate_bot]) {
          const cyl = new THREE.Mesh(
            new THREE.CylinderGeometry(p.d_bolt/2, p.d_bolt/2, p.tp + p.tf_beam + 0.01, 12),
            boltMat
          );
          cyl.rotation.x = Math.PI / 2;
          cyl.position.set(x_b, y_b, z_b);
          objects.push(cyl);
        }
      }
    }
    states.objects3D.val = objects;
  },
  computedLabels(p) {
    // AISC 358-22 §7 Bolted Flange Plate
    const A_p = p.bp * p.tp;
    const Z_beam = p.bf_beam * p.tf_beam * (p.d_beam - p.tf_beam) + p.tw_beam * Math.pow(p.d_beam - 2 * p.tf_beam, 2) / 4;
    const Mp_beam = p.Fy * Z_beam;
    const M_pr = 1.1 * 1.2 * Mp_beam; // Cpr·Ry·Mp  (simplificado)
    const Sh = p.a_edge + Math.round(p.n_rows) * p.s_pitch / 2;
    // Capacidad placa
    const phi_p = 0.9;
    const T_plate = phi_p * p.Fy * A_p;
    // Capacidad pernos
    const A_b = Math.PI * Math.pow(p.d_bolt / 2, 2);
    const N_bolts = Math.round(p.n_rows) * Math.round(p.n_cols);
    const phi_v = 0.75;
    const Rn_per_bolt = 0.6 * p.Fu_bolt * A_b;
    const T_bolts = phi_v * Rn_per_bolt * N_bolts;
    // Demanda en placa
    const T_demand = M_pr / Math.max(p.d_beam - p.tf_beam, 0.1);
    return {
      "── Geometría BFP (AISC 358 §7) ──": "",
      "Sh (rótula plástica)": `${(Sh*1000).toFixed(0)} mm desde cara col`,
      "Lp largo placa": `${(p.Lp*1000).toFixed(0)} mm`,
      "bp × tp placa": `${(p.bp*1000).toFixed(0)} × ${(p.tp*1000).toFixed(0)} mm`,
      "── Capacidades ──": "",
      "Mp viga": `${Mp_beam.toFixed(0)} kN·m`,
      "M_pr (Cpr·Ry·Mp)": `${M_pr.toFixed(0)} kN·m`,
      "T demanda en placa": `${T_demand.toFixed(0)} kN`,
      "── Placa de patín §7.6 ──": "",
      "A_p": `${(A_p*1e4).toFixed(0)} cm²`,
      "φRn placa fluencia": `${T_plate.toFixed(0)} kN`,
      "Ratio T/φRn": `${(T_demand/T_plate).toFixed(3)} ${T_demand <= T_plate ? "✓" : "✗"}`,
      "── Pernos §7.5 ──": "",
      "N pernos por patín": `${N_bolts}`,
      [`A_b (Ø ${(p.d_bolt*1000).toFixed(0)} mm)`]: `${(A_b*1e6).toFixed(0)} mm²`,
      "φRn por perno": `${(phi_v * Rn_per_bolt).toFixed(1)} kN`,
      "ΣφRn pernos": `${T_bolts.toFixed(0)} kN`,
      "Ratio T/ΣφRn": `${(T_demand/T_bolts).toFixed(3)} ${T_demand <= T_bolts ? "✓" : "✗"}`,
      "── Dictamen AISC 358 §7 ──": "",
      "Status": (T_demand <= T_plate && T_demand <= T_bolts) ? "✓ PASA precalificación BFP" : "✗ REVISAR",
    };
  },
};
