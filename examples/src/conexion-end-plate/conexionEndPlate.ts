/**
 * Conexión End Plate — AISC 358-22 §6
 *
 * Configuraciones precalificadas:
 *   - 4E:  Four-Bolt Extended Unstiffened (4 pernos sin rigidizadores)
 *   - 4ES: Four-Bolt Extended Stiffened (4 pernos con rigidizadores)
 *   - 8ES: Eight-Bolt Extended Stiffened (futuro)
 *
 * La placa de extremo (end plate) se suelda al extremo de la viga (CJP en
 * los patines, filete o CJP en el alma) y se atornilla a la columna con
 * pernos de alta resistencia (A325/A490).
 *
 * Fluencia gobernante en el patín de la columna o en la placa de extremo;
 * la rótula plástica se forma en la VIGA a una distancia Sh = mín(d/2, 3·bf)
 * desde la cara de la columna.
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import type { Node, Element } from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import { colormapPercentileRange } from "../shared/colorMapPercentile";
import * as THREE from "three";

export const conexionEndPlate: ExampleDef = {
  id: "conexion-end-plate",
  name: "Conexión End Plate 4E/4ES (AISC 358 §6)",
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
    config: {
      default: 0,
      label: "Configuración AISC 358",
      options: { "4E (Unstiffened)": 0, "4ES (Stiffened)": 1, "8ES (Eight-Bolt Stiff.)": 2 },
      folder: "Configuración",
    },
    // ── Viga ──
    d_beam:  { default: 0.50, min: 0.30, max: 0.90, step: 0.02, label: "d viga (m)", folder: "Viga" },
    bf_beam: { default: 0.20, min: 0.12, max: 0.40, step: 0.01, label: "bf patín (m)", folder: "Viga" },
    tf_beam: { default: 0.018, min: 0.010, max: 0.040, step: 0.002, label: "tf patín (m)", folder: "Viga" },
    tw_beam: { default: 0.012, min: 0.008, max: 0.025, step: 0.001, label: "tw alma (m)", folder: "Viga" },
    L_beam:  { default: 3.50, min: 2.0, max: 6.0, step: 0.10, label: "L viga (m)", folder: "Viga" },
    // ── Columna ──
    d_col:   { default: 0.40, min: 0.30, max: 0.70, step: 0.02, label: "d col (m)", folder: "Columna" },
    bf_col:  { default: 0.40, min: 0.25, max: 0.60, step: 0.01, label: "bf col (m)", folder: "Columna" },
    tf_col:  { default: 0.025, min: 0.012, max: 0.050, step: 0.002, label: "tf col (m)", folder: "Columna" },
    tw_col:  { default: 0.018, min: 0.010, max: 0.035, step: 0.001, label: "tw col (m)", folder: "Columna" },
    // ── End Plate (§6.6) ──
    bp:      { default: 0.25, min: 0.15, max: 0.50, step: 0.01, label: "bp ancho placa (m)", folder: "End Plate" },
    hp:      { default: 0.65, min: 0.30, max: 1.00, step: 0.02, label: "hp altura placa (m)", folder: "End Plate" },
    tp:      { default: 0.030, min: 0.015, max: 0.060, step: 0.002, label: "tp espesor (m)", folder: "End Plate" },
    pf:      { default: 0.06, min: 0.03, max: 0.15, step: 0.01, label: "pf bolt to flange (m)", folder: "End Plate" },
    g:       { default: 0.10, min: 0.06, max: 0.20, step: 0.01, label: "g gauge (m)", folder: "End Plate" },
    // ── Pernos ──
    d_bolt:  { default: 0.025, min: 0.016, max: 0.040, step: 0.002, label: "Ø perno (m)", folder: "Pernos" },
    Fu_bolt: { default: 1030_000, min: 830_000, max: 1100_000, step: 10_000, label: "Fu perno A490 (kN/m²)", folder: "Pernos" },
    // ── Material ──
    Fy:      { default: 345_000, min: 250_000, max: 450_000, step: 5_000, label: "Fy acero (kN/m²)", folder: "Material" },
    E_steel: { default: 200_000_000, min: 190e6, max: 210e6, step: 1e6, label: "E (kN/m²)", folder: "Material" },
    // ── Cargas ──
    Mu:      { default: 350, min: 0, max: 2000, step: 25, label: "Mu demanda (kN·m)", folder: "Cargas", unitType: "moment" },
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
    const rho_steel = 77 / 9.81;

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
    const cfg = Math.round(p.config); // 0=4E, 1=4ES, 2=8ES
    const stiffened = cfg >= 1;
    const eightBolt = cfg === 2;

    const L_col = 4.0;
    const xF_col = +p.d_col / 2 - p.tf_col / 2;
    const xB_col = -p.d_col / 2 + p.tf_col / 2;
    const nz_col = 8 * md;
    const ny_col = 2 * md;

    // Columna patines + alma (similar al BFP)
    const colF: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_col; iy++) row.push(addNode(xF_col, -p.bf_col/2 + (iy*p.bf_col)/ny_col, z));
      colF.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++)
      for (let iy = 0; iy < ny_col; iy++)
        addShell(colF[iz][iy], colF[iz][iy+1], colF[iz+1][iy+1], colF[iz+1][iy], p.tf_col);

    const colB: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_col; iy++) row.push(addNode(xB_col, -p.bf_col/2 + (iy*p.bf_col)/ny_col, z));
      colB.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++)
      for (let iy = 0; iy < ny_col; iy++)
        addShell(colB[iz][iy], colB[iz][iy+1], colB[iz+1][iy+1], colB[iz+1][iy], p.tf_col);

    const nxc = md + 1;
    const colW: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = -L_col / 2 + (iz * L_col) / nz_col;
      const row: number[] = [];
      for (let ix = 0; ix <= nxc; ix++) row.push(addNode(xB_col + (xF_col - xB_col) * (ix/nxc), 0, z));
      colW.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++)
      for (let ix = 0; ix < nxc; ix++)
        addShell(colW[iz][ix], colW[iz][ix+1], colW[iz+1][ix+1], colW[iz+1][ix], p.tw_col);

    // END PLATE — placa vertical en x = xF_col
    const ny_p = 3 * md;
    const nz_p = 6 * md;
    const endPlate: number[][] = [];
    for (let iz = 0; iz <= nz_p; iz++) {
      const z = -p.hp/2 + (iz * p.hp) / nz_p;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_p; iy++) {
        const y = -p.bp/2 + (iy*p.bp)/ny_p;
        row.push(addNode(xF_col, y, z));
      }
      endPlate.push(row);
    }
    for (let iz = 0; iz < nz_p; iz++)
      for (let iy = 0; iy < ny_p; iy++)
        addShell(endPlate[iz][iy], endPlate[iz][iy+1], endPlate[iz+1][iy+1], endPlate[iz+1][iy], p.tp);

    // VIGA — empieza en x = xF_col + tp (después de la end plate)
    const x0 = xF_col + p.tp;
    const zTop_b = +p.d_beam / 2 - p.tf_beam / 2;
    const zBot_b = -p.d_beam / 2 + p.tf_beam / 2;
    const nx_beam = 8 * md;
    const ny_beam = 2 * md;
    const nz_beam_web = 2 * md;

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

    // STIFFENERS (rigidizadores triangulares en 4ES y 8ES)
    if (stiffened) {
      const stiffH = (p.hp - p.d_beam) / 2 - 0.02;  // altura del rigidizador
      const stiffL = stiffH * 1.5; // longitud (típicamente √3 × h)
      const stiff_top_z = zTop_b + p.tf_beam/2 + stiffH/2;
      const stiff_bot_z = zBot_b - p.tf_beam/2 - stiffH/2;
      // Triangular stiffener — modelado simplificado como rectángulo vertical de espesor t_st
      const t_st = p.tw_beam;
      // Top stiffener
      const yc = 0;
      addShell(
        addNode(x0, yc, zTop_b + p.tf_beam/2),
        addNode(x0 + stiffL, yc, zTop_b + p.tf_beam/2),
        addNode(x0 + stiffL, yc, zTop_b + p.tf_beam/2),  // mismo x para que sea triangular
        addNode(x0, yc, zTop_b + p.tf_beam/2 + stiffH),
        t_st
      );
      // Bottom stiffener
      addShell(
        addNode(x0, yc, zBot_b - p.tf_beam/2 - stiffH),
        addNode(x0 + stiffL, yc, zBot_b - p.tf_beam/2),
        addNode(x0 + stiffL, yc, zBot_b - p.tf_beam/2),
        addNode(x0, yc, zBot_b - p.tf_beam/2),
        t_st
      );
    }

    // ── Supports y cargas ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let iy = 0; iy <= ny_beam; iy++) {
      supports.set(beamTop[0][iy], [true, true, true, true, true, true]);
      supports.set(beamBot[0][iy], [true, true, true, true, true, true]);
    }
    for (let iz = 0; iz <= nz_beam_web; iz++) supports.set(beamWeb[0][iz], [true, true, true, true, true, true]);
    // Top/bot col
    for (let i = 0; i < nodes.length; i++) {
      if (Math.abs(Math.abs(nodes[i][2]) - L_col/2) < 1e-4 && Math.abs(nodes[i][0]) >= p.d_col/2 - p.tf_col - 1e-4) {
        if (!supports.has(i)) supports.set(i, [true, true, true, true, true, true]);
      }
    }

    const F_target = p.Mu / Math.max(p.d_beam - p.tf_beam, 0.1) * 0.4;
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const F_per = F_target / (ny_beam + 1);
    for (let iy = 0; iy <= ny_beam; iy++) loads.set(beamTop[nx_beam][iy], [0, 0, -F_per, 0, 0, 0]);

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
      const [vmin, vmax] = colormapPercentileRange((aOut as any).vonMises, 85, p.Fy);
      (aOut as any).colorMapRanges = { ...(aOut as any).colorMapRanges, vonMises: [vmin, vmax] };
      states.analyzeOutputs.val = aOut;
    } catch (e: any) {
      console.error("[EndPlate] solver error:", e?.message);
    }

    // PERNOS — 4 (4E/4ES) u 8 (8ES)
    const objects: THREE.Object3D[] = [];
    const boltMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 });
    const nutMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const boltLen = p.tp + p.tf_col + 0.02;
    const z_top_in  = +p.d_beam/2 + p.pf;
    const z_top_ext = +p.d_beam/2 - p.pf;  // adentro
    const z_bot_in  = -p.d_beam/2 - p.pf;
    const z_bot_ext = -p.d_beam/2 + p.pf;
    const z_extra   = +p.d_beam/2 + p.pf*2;
    const z_extra_b = -p.d_beam/2 - p.pf*2;
    const yL = -p.g/2;
    const yR = +p.g/2;
    const x_b = xF_col - p.tp/2 - 0.005;

    const boltPositions: Array<[number, number, number]> = [
      [x_b, yL, z_top_in], [x_b, yR, z_top_in],
      [x_b, yL, z_top_ext], [x_b, yR, z_top_ext],
      [x_b, yL, z_bot_in], [x_b, yR, z_bot_in],
      [x_b, yL, z_bot_ext], [x_b, yR, z_bot_ext],
    ];
    if (eightBolt) {
      // 8ES: 4 más pernos extras
      boltPositions.push(
        [x_b, yL, z_extra], [x_b, yR, z_extra],
        [x_b, yL, z_extra_b], [x_b, yR, z_extra_b],
      );
    }
    for (const [bx, by, bz] of boltPositions) {
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(p.d_bolt/2, p.d_bolt/2, boltLen, 12),
        boltMat
      );
      cyl.rotation.z = Math.PI / 2;  // eje en X
      cyl.position.set(bx, by, bz);
      objects.push(cyl);
      const nut = new THREE.Mesh(
        new THREE.CylinderGeometry(p.d_bolt*0.85, p.d_bolt*0.85, p.d_bolt*0.8, 6),
        nutMat
      );
      nut.rotation.z = Math.PI / 2;
      nut.position.set(bx + boltLen/2 + 0.005, by, bz);
      objects.push(nut);
    }

    // Marca de la rótula plástica esperada (Sh = mín(d/2, 3·bf))
    const Sh = Math.min(p.d_beam/2, 3 * p.bf_beam);
    const hingeMat = new THREE.MeshStandardMaterial({
      color: 0xff2200, emissive: 0x551100, transparent: true, opacity: 0.7,
    });
    const hingeMarker = new THREE.Mesh(
      new THREE.SphereGeometry(Math.min(p.bf_beam, p.d_beam) * 0.25, 16, 12),
      hingeMat
    );
    hingeMarker.position.set(x0 + Sh, 0, 0);
    objects.push(hingeMarker);

    states.objects3D.val = objects;
  },
  computedLabels(p) {
    const cfg = Math.round(p.config);
    const cfgName = cfg === 0 ? "4E (Unstiffened)" : cfg === 1 ? "4ES (Stiffened)" : "8ES";
    // AISC 358 §6 simplified
    const A_b = Math.PI * Math.pow(p.d_bolt/2, 2);
    const N_b = cfg === 2 ? 8 : 4;
    const phi_v = 0.75;
    const Rn_per_bolt = 0.6 * p.Fu_bolt * A_b;
    const T_bolts = phi_v * Rn_per_bolt * (N_b/2);
    const Z_beam = p.bf_beam * p.tf_beam * (p.d_beam - p.tf_beam) + p.tw_beam * Math.pow(p.d_beam - 2 * p.tf_beam, 2) / 4;
    const Mp = p.Fy * Z_beam;
    const M_pr = 1.1 * 1.2 * Mp;
    const T_demand = M_pr / Math.max(p.d_beam, 0.1);
    const Sh = Math.min(p.d_beam/2, 3 * p.bf_beam);
    // Espesor placa requerido (AISC 358 §6.7)
    const tp_min = Math.sqrt((1.11 * 1.2 * Mp) / (0.9 * p.Fy * (p.bp/2)));
    return {
      "── Configuración AISC 358 §6 ──": "",
      "Tipo": cfgName,
      "Pernos totales": `${N_b} (${N_b/2} arriba + ${N_b/2} abajo)`,
      "── Geometría End Plate ──": "",
      "Sh (rótula plástica)": `${(Sh*1000).toFixed(0)} mm desde cara col`,
      "bp × hp × tp": `${(p.bp*1000).toFixed(0)} × ${(p.hp*1000).toFixed(0)} × ${(p.tp*1000).toFixed(0)} mm`,
      "pf bolt-flange": `${(p.pf*1000).toFixed(0)} mm`,
      "g gauge": `${(p.g*1000).toFixed(0)} mm`,
      "── Capacidades ──": "",
      "Mp viga": `${Mp.toFixed(0)} kN·m`,
      "M_pr (Cpr·Ry·Mp)": `${M_pr.toFixed(0)} kN·m`,
      "T demanda": `${T_demand.toFixed(0)} kN`,
      "── Espesor placa §6.7 ──": "",
      "tp requerido (Yc)": `${(tp_min*1000).toFixed(1)} mm`,
      "tp dado": `${(p.tp*1000).toFixed(1)} mm`,
      "Ratio tp/tp_req": `${(p.tp/tp_min).toFixed(2)} ${p.tp >= tp_min ? "✓" : "✗"}`,
      "── Pernos §6.7 ──": "",
      [`A_b (Ø ${(p.d_bolt*1000).toFixed(0)} mm)`]: `${(A_b*1e6).toFixed(0)} mm²`,
      "φRn por perno": `${(phi_v * Rn_per_bolt).toFixed(1)} kN`,
      "ΣφRn (N/2 pernos por patín)": `${T_bolts.toFixed(0)} kN`,
      "Ratio T/ΣφRn": `${(T_demand/T_bolts).toFixed(3)} ${T_demand <= T_bolts ? "✓" : "✗"}`,
      "── Dictamen ──": "",
      "Status": (p.tp >= tp_min && T_demand <= T_bolts) ? `✓ PASA ${cfgName}` : "✗ REVISAR",
    };
  },
};
