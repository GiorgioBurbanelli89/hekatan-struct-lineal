/**
 * Placa base anclada — Diseño según AISC 360-22 §J8 + ACI 318-22 §17.
 *
 * Geometría 3D REAL con shells:
 *   - Placa rectangular B × H con ORIFICIOS CIRCULARES para pernos de anclaje
 *   - Columna W-shape stub encima (para visualizar la interacción)
 *   - Pernos de anclaje modelados como cilindros pasando por los orificios
 *   - Tuercas visibles encima de la placa
 *   - Pedestal de concreto (base) como caja transparente
 *
 * Cálculos de diseño AISC 360-22 §J8:
 *   - Aplastamiento de concreto: P_p = 0.85 · f'c · A1 · sqrt(A2/A1) ≤ 1.7·f'c·A1
 *   - Voladizo crítico: m = (N - 0.95·d)/2 ; n = (B - 0.80·bf)/2
 *   - Espesor requerido: t_req = ℓ · sqrt(2·P_u / (φ·F_y · B·N))
 *   - Chequeo cantidad de pernos según Mu (tensión neta en pernos) AISC 360 §J3
 *
 * Referencias:
 *   - AISC Design Guide 1 (3rd ed.) — Base Plate and Anchor Rod Design
 *   - AISC 360-22 §J8 (Column Bases and Bearing on Concrete)
 *   - ACI 318-22 §17.4 (Anchor strength design)
 *   - Fisher & Kloiber, "Base Plate and Anchor Rod Design", 2006
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import type { Node, Element } from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import { secantPlasticSolve } from "../shared/secantPlasticity";
import { colormapPercentileRange } from "../shared/colorMapPercentile";
import * as THREE from "three";

export const placaBase: ExampleDef = {
  id: "placa-base",
  name: "Placa base anclada (AISC 360-22 §J8 + ACI 318)",
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
    // ── Placa ──
    B: { default: 0.50, min: 0.25, max: 1.20, step: 0.02, label: "B placa (m, eje X)", folder: "Placa" },
    H: { default: 0.50, min: 0.25, max: 1.20, step: 0.02, label: "H placa (m, eje Y)", folder: "Placa" },
    t_plate: { default: 0.025, min: 0.012, max: 0.060, step: 0.002, label: "Espesor placa (m)", folder: "Placa" },
    // ── Columna W-shape (footprint) ──
    d_col: { default: 0.30, min: 0.18, max: 0.50, step: 0.02, label: "d columna (m)", folder: "Columna" },
    bf_col: { default: 0.25, min: 0.15, max: 0.40, step: 0.01, label: "bf columna (m)", folder: "Columna" },
    tf_col: { default: 0.022, min: 0.012, max: 0.040, step: 0.002, label: "tf (m)", folder: "Columna" },
    tw_col: { default: 0.014, min: 0.008, max: 0.025, step: 0.001, label: "tw (m)", folder: "Columna" },
    L_col_stub: { default: 0.50, min: 0.30, max: 1.00, step: 0.05, label: "L col stub (m)", folder: "Columna" },
    // ── Pernos de anclaje ──
    bolt_layout: {
      default: 4,
      label: "Disposición pernos",
      options: { "4 (2×2)": 4, "6 (3×2)": 6, "8 (4×2)": 8, "9 (3×3)": 9 },
      folder: "Pernos",
      regenOnChange: true,
    },
    d_bolt: { default: 0.024, min: 0.012, max: 0.050, step: 0.002, label: "Ø perno (m)", folder: "Pernos" },
    d_hole: { default: 0.036, min: 0.020, max: 0.080, step: 0.002, label: "Ø orificio (m)", folder: "Pernos" },
    edge_dist: { default: 0.07, min: 0.03, max: 0.20, step: 0.01, label: "Dist borde (m)", folder: "Pernos" },
    L_bolt: { default: 0.30, min: 0.15, max: 0.60, step: 0.02, label: "L embebido (m)", folder: "Pernos" },
    // ── Pedestal de concreto ──
    B_ped: { default: 0.80, min: 0.40, max: 1.80, step: 0.05, label: "B pedestal (m)", folder: "Pedestal" },
    H_ped: { default: 0.80, min: 0.40, max: 1.80, step: 0.05, label: "H pedestal (m)", folder: "Pedestal" },
    h_ped: { default: 0.50, min: 0.30, max: 1.50, step: 0.05, label: "h pedestal (m)", folder: "Pedestal" },
    // ── Material ──
    Fy_plate: { default: 250_000, min: 240_000, max: 450_000, step: 5_000, label: "Fy placa (kN/m²)", folder: "Material" },
    Fu_bolt: { default: 830_000, min: 600_000, max: 1_030_000, step: 10_000, label: "Fu perno A307/A449 (kN/m²)", folder: "Material" },
    E_steel: { default: 200_000_000, min: 190e6, max: 210e6, step: 1e6, label: "E (kN/m²)", folder: "Material" },
    fc: { default: 28_000, min: 17_000, max: 50_000, step: 1_000, label: "f'c pedestal (kN/m²)", folder: "Material" },
    // ── Cargas de diseño ──
    Pu: { default: 800, min: 0, max: 5000, step: 25, label: "Pu (compresión)", folder: "Cargas", unitType: "force" },
    Mu: { default: 80, min: 0, max: 800, step: 5, label: "Mu (momento)", folder: "Cargas", unitType: "moment" },
    // ── Malla (más denso permite ver concentración de tensiones alrededor de los pernos) ──
    mesh_n: { default: 48, min: 20, max: 80, step: 2, label: "Divisiones por lado", folder: "Malla" },
    // ── Solver ──
    // Defecto LINEAL (23-sep-2026): el «secante» rebaja la rigidez sin devolver la tension a la superficie
    // de fluencia -> von Mises queda en 3.7·Fy y la flecha pasa de 4 mm a 204 mm. No es J2 ni esta validado
    // contra Abaqus; la plasticidad J2 con retorno radial + contacto se esta validando aparte (prueba local).
    use_nonlinear: { default: 0, label: "Solver", options: { "Lineal (elástico)": 0, "Secante experimental (NO validado)": 1 }, folder: "Solver" },
    nl_max_iter: { default: 12, min: 3, max: 30, step: 1, label: "Max iteraciones NL", folder: "Solver" },
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
    const rho_steel = 7.85;   // MASA t/m³ (antes 77: el PESO kN/m³, metido ×9.81)

    const addNode = (x: number, y: number, z: number): number => {
      nodes.push([x, y, z]);
      return nodes.length - 1;
    };
    // Buscar un nodo existente en proximidad ≤ tol; si no, crear uno nuevo.
    // Se usa para conectar la base de la columna con la malla de la placa.
    const findOrSnap = (x: number, y: number, z: number, tol: number): number => {
      for (let idx = 0; idx < nodes.length; idx++) {
        const n = nodes[idx];
        const dxn = n[0] - x, dyn = n[1] - y, dzn = n[2] - z;
        if (dxn * dxn + dyn * dyn + dzn * dzn < tol * tol) return idx;
      }
      nodes.push([x, y, z]);
      return nodes.length - 1;
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

    // ── Disposición de los pernos ──
    // Retorna posiciones (x, y) en el plano de la placa centrado en origen
    const boltLayout = (n: number): Array<[number, number]> => {
      const d = p.edge_dist;
      const x_edge = p.B / 2 - d;
      const y_edge = p.H / 2 - d;
      if (n === 4) {
        return [[-x_edge, -y_edge], [+x_edge, -y_edge], [+x_edge, +y_edge], [-x_edge, +y_edge]];
      }
      if (n === 6) {
        // 3 cols × 2 filas
        return [
          [-x_edge, -y_edge], [0, -y_edge], [+x_edge, -y_edge],
          [-x_edge, +y_edge], [0, +y_edge], [+x_edge, +y_edge],
        ];
      }
      if (n === 8) {
        // 4 cols × 2 filas
        return [
          [-x_edge, -y_edge], [-x_edge/3, -y_edge], [+x_edge/3, -y_edge], [+x_edge, -y_edge],
          [-x_edge, +y_edge], [-x_edge/3, +y_edge], [+x_edge/3, +y_edge], [+x_edge, +y_edge],
        ];
      }
      if (n === 9) {
        // 3 × 3
        return [
          [-x_edge, -y_edge], [0, -y_edge], [+x_edge, -y_edge],
          [-x_edge, 0], [0, 0], [+x_edge, 0],
          [-x_edge, +y_edge], [0, +y_edge], [+x_edge, +y_edge],
        ];
      }
      return [[-x_edge, -y_edge], [+x_edge, -y_edge], [+x_edge, +y_edge], [-x_edge, +y_edge]];
    };
    const bolts = boltLayout(p.bolt_layout);
    const r_hole = p.d_hole / 2;

    // ── Malla cartesiana de la placa z = 0, con huecos circulares proyectados ──
    const nx = Math.max(14, Math.round(p.mesh_n));
    const ny = Math.max(14, Math.round(p.mesh_n));
    const dx = p.B / nx;
    const dy = p.H / ny;

    // Grid de nodos [ny+1][nx+1], cada nodo: índice o -1 (dentro de hueco)
    const nodeGrid: number[][] = [];
    for (let j = 0; j <= ny; j++) {
      const row: number[] = [];
      for (let i = 0; i <= nx; i++) {
        let x = -p.B / 2 + i * dx;
        let y = -p.H / 2 + j * dy;
        // Si el nodo está cerca de un hueco, proyectarlo al borde del círculo
        // (garantiza que los nodos del borde del hueco sean efectivamente circulares)
        let insideHole = false;
        for (const [bx, by] of bolts) {
          const dxh = x - bx;
          const dyh = y - by;
          const d_ = Math.sqrt(dxh * dxh + dyh * dyh);
          // d_ < 0.35·r_hole → muy dentro, descartar (se forma el HUECO)
          if (d_ < r_hole * 0.35) {
            insideHole = true;
            break;
          }
          // 0.35·r_hole ≤ d_ < r_hole → DENTRO del círculo pero cerca del borde,
          //   empujar HACIA AFUERA hasta el borde (crea el anillo circular del hueco)
          // d_ ≥ r_hole → FUERA del círculo, NO tocar (mantiene el mallado rectangular)
          if (d_ < r_hole && d_ > 1e-9) {
            x = bx + (dxh / d_) * r_hole;
            y = by + (dyh / d_) * r_hole;
            break; // un nodo solo se proyecta a un perno (el más cercano)
          }
        }
        if (insideHole) {
          row.push(-1);
        } else {
          row.push(addNode(x, y, 0));
        }
      }
      nodeGrid.push(row);
    }

    // Crear shells (descartar celdas cuyos 4 nodos estén dentro de un hueco)
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const n0 = nodeGrid[j][i];
        const n1 = nodeGrid[j][i + 1];
        const n2 = nodeGrid[j + 1][i + 1];
        const n3 = nodeGrid[j + 1][i];
        if (n0 < 0 || n1 < 0 || n2 < 0 || n3 < 0) continue;
        // Verificar si el centro de la celda está dentro de algún hueco
        const xc = -p.B / 2 + (i + 0.5) * dx;
        const yc = -p.H / 2 + (j + 0.5) * dy;
        let skip = false;
        for (const [bx, by] of bolts) {
          const d_ = Math.sqrt((xc - bx) ** 2 + (yc - by) ** 2);
          if (d_ < r_hole * 0.95) { skip = true; break; }
        }
        if (skip) continue;
        addShell(n0, n1, n2, n3, p.t_plate);
      }
    }

    // ── Columna W-shape (CONECTADA a la placa por node-merging en z=0) ──
    // Ahora la columna empieza en z=0 (mismo plano que la placa) y sus nodos
    // basales se snapean al nodo más cercano de la malla de la placa, creando
    // continuidad estructural. La carga (Pu, Mu) se aplica en el TOP.
    const z_plate_top = 0;
    const z_col_top = p.L_col_stub;
    const nz_col = 6;
    const ny_col = Math.max(2, Math.round(p.mesh_n / 12)); // divisiones en Y por patín
    const tolSnap = Math.max(dx, dy) * 0.7; // tolerancia de fusión con placa
    const xF_col = +p.d_col / 2 - p.tf_col / 2; // plano medio patín frontal
    const xB_col = -p.d_col / 2 + p.tf_col / 2; // plano medio patín trasero

    // Patín frontal (+x)
    const colFront: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = (iz * p.L_col_stub) / nz_col;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_col; iy++) {
        const y = -p.bf_col / 2 + (iy * p.bf_col) / ny_col;
        if (iz === 0) row.push(findOrSnap(xF_col, y, 0, tolSnap));
        else row.push(addNode(xF_col, y, z));
      }
      colFront.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++) {
      for (let iy = 0; iy < ny_col; iy++) {
        addShell(
          colFront[iz][iy], colFront[iz][iy + 1],
          colFront[iz + 1][iy + 1], colFront[iz + 1][iy],
          p.tf_col,
        );
      }
    }

    // Patín trasero (-x)
    const colBack: number[][] = [];
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = (iz * p.L_col_stub) / nz_col;
      const row: number[] = [];
      for (let iy = 0; iy <= ny_col; iy++) {
        const y = -p.bf_col / 2 + (iy * p.bf_col) / ny_col;
        if (iz === 0) row.push(findOrSnap(xB_col, y, 0, tolSnap));
        else row.push(addNode(xB_col, y, z));
      }
      colBack.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++) {
      for (let iy = 0; iy < ny_col; iy++) {
        addShell(
          colBack[iz][iy], colBack[iz][iy + 1],
          colBack[iz + 1][iy + 1], colBack[iz + 1][iy],
          p.tf_col,
        );
      }
    }

    // Alma (y=0, plano XZ) — entre los planos medios de los patines
    // Su base se snapea a la placa también
    const colWeb: number[][] = [];
    const nxc = 2 + Math.round(p.mesh_n / 16);
    for (let iz = 0; iz <= nz_col; iz++) {
      const z = (iz * p.L_col_stub) / nz_col;
      const row: number[] = [];
      for (let ix = 0; ix <= nxc; ix++) {
        const x = xB_col + (xF_col - xB_col) * (ix / nxc);
        if (iz === 0) row.push(findOrSnap(x, 0, 0, tolSnap));
        else row.push(addNode(x, 0, z));
      }
      colWeb.push(row);
    }
    for (let iz = 0; iz < nz_col; iz++) {
      for (let ix = 0; ix < nxc; ix++) {
        addShell(
          colWeb[iz][ix], colWeb[iz][ix + 1],
          colWeb[iz + 1][ix + 1], colWeb[iz + 1][ix],
          p.tw_col,
        );
      }
    }

    // ── Supports: pernos de anclaje = resortes "rígidos" (fijamos Z, X, Y)
    //   en los nodos del contorno del orificio más cercanos a cada perno ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (const [bx, by] of bolts) {
      // Busca los 6 nodos más cercanos al borde del orificio (el anillo proyectado)
      const candidatos: Array<{ idx: number; d: number }> = [];
      for (let idx = 0; idx < nodes.length; idx++) {
        if (Math.abs(nodes[idx][2]) > 1e-4) continue; // solo nodos de la placa (z=0)
        const dx_ = nodes[idx][0] - bx;
        const dy_ = nodes[idx][1] - by;
        const d_ = Math.sqrt(dx_ * dx_ + dy_ * dy_);
        // Nodos muy cercanos al borde del orificio (r_hole ± 10%)
        if (Math.abs(d_ - r_hole) < r_hole * 0.15) {
          candidatos.push({ idx, d: d_ });
        }
      }
      for (const c of candidatos) {
        // Fijación vertical (Z) + horizontal (X,Y) simulando el perno
        supports.set(c.idx, [true, true, true, false, false, false]);
      }
    }

    // ── Cargas aplicadas al TOP de la columna (la columna transmite a placa) ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    // Top nodes de la columna (z = L_col_stub) — patines + alma
    const topColNodes: number[] = [
      ...colFront[nz_col], ...colBack[nz_col], ...colWeb[nz_col],
    ];
    if (topColNodes.length > 0) {
      const F_per = -p.Pu / topColNodes.length; // kN hacia abajo
      const lever_X = p.d_col / 2;
      for (const idx of topColNodes) {
        const x_ = nodes[idx][0];
        // Mu como par: ±Fz según x (alrededor del eje Y)
        const F_mu = (p.Mu / (topColNodes.length * lever_X)) * (x_ > 0 ? 1 : -1);
        loads.set(idx, [0, 0, F_per + F_mu, 0, 0, 0]);
      }
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      thicknesses, elasticities, poissonsRatios, densities,
      areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants, shearModuli,
    } as any;
    // ── Ejecutar solver (lineal o no-lineal secante) ──
    try {
      if (p.use_nonlinear > 0.5) {
        // Solver no-lineal: secant plasticity (J2 perfect, stiffness reduction)
        const nlResult = secantPlasticSolve({
          nodes, elements, nodeInputs: { supports, loads },
          elementInputs: states.elementInputs.val,
          Fy: p.Fy_plate,
          maxIter: Math.round(p.nl_max_iter),
          tol: 0.03,
          softeningFactor: 0.90,
        });
        states.deformOutputs.val = nlResult.deformOutputs;
        const aOut = nlResult.analyzeOutputs;
        // Percentile clamp evita que singularidades en bordes de pernos saturen el rango
        const [vmin, vmax] = colormapPercentileRange((aOut as any).vonMises, 90, p.Fy_plate);
        (aOut as any).colorMapRanges = { ...(aOut as any).colorMapRanges, vonMises: [vmin, vmax] };
        states.analyzeOutputs.val = aOut;
        (states as any).__nlInfo = {
          iterations: nlResult.iterations,
          converged: nlResult.converged,
          elementsYielded: nlResult.elementsYielded,
          maxRatio: nlResult.maxRatio,
        };
        console.log(
          `[placa-base NL] iter=${nlResult.iterations}, converged=${nlResult.converged}, yielded=${nlResult.elementsYielded}, maxRatio=${nlResult.maxRatio.toFixed(2)}`,
        );
      } else {
        states.deformOutputs.val = deform(
          nodes, elements, { supports, loads }, states.elementInputs.val,
        );
        const aOut = analyze(
          nodes, elements, states.elementInputs.val, states.deformOutputs.val,
        );
        const [vmin, vmax] = colormapPercentileRange((aOut as any).vonMises, 90, p.Fy_plate);
        (aOut as any).colorMapRanges = { ...(aOut as any).colorMapRanges, vonMises: [vmin, vmax] };
        states.analyzeOutputs.val = aOut;
        (states as any).__nlInfo = null;
      }
    } catch (e: any) {
      console.error("[placa-base] solver error:", e?.message || e);
      states.deformOutputs.val = {} as any;
      states.analyzeOutputs.val = {} as any;
    }

    // ── Objetos 3D: pernos (cilindros) + tuercas + pedestal ──
    const objects: THREE.Object3D[] = [];

    // Pedestal de concreto
    const pedGeom = new THREE.BoxGeometry(p.B_ped, p.H_ped, p.h_ped);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0xbbaa88, transparent: true, opacity: 0.35,
      metalness: 0.1, roughness: 0.9,
    });
    const pedMesh = new THREE.Mesh(pedGeom, pedMat);
    pedMesh.position.set(0, 0, -p.h_ped / 2);
    objects.push(pedMesh);

    // Edges pedestal
    const pedEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(pedGeom),
      new THREE.LineBasicMaterial({ color: 0x444444 }),
    );
    pedEdges.position.set(0, 0, -p.h_ped / 2);
    objects.push(pedEdges);

    // Pernos de anclaje
    const boltMat = new THREE.MeshStandardMaterial({ color: 0x7a7a7a, metalness: 0.8, roughness: 0.3 });
    const nutMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });

    for (const [bx, by] of bolts) {
      // Cilindro (vástago) desde -L_bolt hasta +nut_h encima de la placa
      const nut_h = p.d_bolt * 1.0;
      const boltLenTotal = p.L_bolt + p.t_plate + nut_h + 0.015;
      const boltGeom = new THREE.CylinderGeometry(p.d_bolt / 2, p.d_bolt / 2, boltLenTotal, 16);
      const bolt = new THREE.Mesh(boltGeom, boltMat);
      bolt.rotation.x = Math.PI / 2; // eje a Z
      const z_center = -p.L_bolt + boltLenTotal / 2;
      bolt.position.set(bx, by, z_center);
      objects.push(bolt);

      // Tuerca (hexágono) encima de la placa
      const nutGeom = new THREE.CylinderGeometry(p.d_bolt * 0.9, p.d_bolt * 0.9, nut_h, 6);
      const nut = new THREE.Mesh(nutGeom, nutMat);
      nut.rotation.x = Math.PI / 2;
      nut.position.set(bx, by, p.t_plate + nut_h / 2);
      objects.push(nut);

      // Arandela (disco)
      const washGeom = new THREE.CylinderGeometry(p.d_hole / 2 * 1.4, p.d_hole / 2 * 1.4, 0.004, 20);
      const washMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
      const wash = new THREE.Mesh(washGeom, washMat);
      wash.rotation.x = Math.PI / 2;
      wash.position.set(bx, by, p.t_plate + 0.002);
      objects.push(wash);

      // Marca circular en placa (anillo alrededor del orificio para destacar)
      const ringG = new THREE.RingGeometry(r_hole, r_hole * 1.05, 32);
      const ringM = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringG, ringM);
      ring.position.set(bx, by, p.t_plate + 0.0005);
      objects.push(ring);
    }

    // ── Diagrama de compresión del concreto (cono 45° bajo placa, ACI 318-22) ──
    const L_load = Math.sqrt(p.B * p.H); // dim equivalente
    const L2 = Math.min(L_load + 2 * p.h_ped, Math.min(p.B_ped, p.H_ped));
    const coneGeom = new THREE.BoxGeometry(L2, L2, 0.002);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xff8800, transparent: true, opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const cone = new THREE.Mesh(coneGeom, coneMat);
    cone.position.set(0, 0, -p.h_ped + 0.001);
    objects.push(cone);

    states.objects3D.val = objects;

    // ── Log ──
    console.log(
      `[Placa Base AISC §J8] Shells=${elements.length}, Nodos=${nodes.length}\n` +
        `  Placa ${p.B}×${p.H}×${p.t_plate}m, Pernos=${p.bolt_layout} Ø${p.d_bolt * 1000}mm\n` +
        `  Pedestal ${p.B_ped}×${p.H_ped}×${p.h_ped}m f'c=${p.fc / 1000} MPa`,
    );
  },
  computedLabels(p, states) {
    const nlInfo = (states as any).__nlInfo;
    // Cálculos AISC 360-22 §J8 + ACI 318-22
    const phi_c = 0.65; // bearing on concrete (§J8)
    const phi_b = 0.90; // bending of plate
    const phi_t = 0.75; // tension on bolt (AISC §J3)

    const A1 = p.B * p.H;
    const A2 = Math.min(p.B_ped * p.H_ped, A1 * 4);
    const sqrtRatio = Math.min(Math.sqrt(A2 / A1), 2.0);

    // Aplastamiento sobre concreto
    const Pp = 0.85 * p.fc * A1 * sqrtRatio;
    const phiPp = phi_c * Pp;

    // Voladizos críticos (AISC DG-1)
    const m = Math.max(0, (p.B - 0.95 * p.d_col) / 2);
    const n_ = Math.max(0, (p.H - 0.80 * p.bf_col) / 2);
    const lambda_n_prime = Math.sqrt(p.d_col * p.bf_col) / 4;
    const l_crit = Math.max(m, n_, lambda_n_prime);

    // Presión uniforme
    const f_p = p.Pu / A1;
    // Espesor requerido
    const t_req = l_crit * Math.sqrt((2 * f_p) / (phi_b * p.Fy_plate));
    const ratio_t = p.t_plate / t_req;

    // Tensión en pernos por Mu (modelo simple)
    const e = p.Mu / Math.max(p.Pu, 1e-3); // excentricidad
    const n_bolts_tension = p.bolt_layout / 2; // asumimos mitad en tensión
    const L_arm = p.H / 2 - p.edge_dist;
    const T_bolt = Math.max(0, (p.Mu - p.Pu * L_arm) / (2 * L_arm));
    const T_per_bolt = T_bolt / Math.max(n_bolts_tension, 1);

    // Capacidad de 1 perno (AISC J3)
    const A_bolt = Math.PI * (p.d_bolt / 2) ** 2;
    const Rn_bolt = 0.75 * p.Fu_bolt * A_bolt;
    const phiRn_bolt = phi_t * Rn_bolt;

    const ratio_bearing = p.Pu / phiPp;
    const ratio_bolt = T_per_bolt / phiRn_bolt;

    return {
      "── Geometría ──": "",
      "A1 (área placa)": `${(A1 * 10000).toFixed(0)} cm²`,
      "A2 (área pedestal)": `${(A2 * 10000).toFixed(0)} cm²`,
      "√(A2/A1)": sqrtRatio.toFixed(2),
      "m (voladizo X)": `${(m * 1000).toFixed(0)} mm`,
      "n (voladizo Y)": `${(n_ * 1000).toFixed(0)} mm`,
      "λn' (Thornton)": `${(lambda_n_prime * 1000).toFixed(0)} mm`,
      "ℓ crítico": `${(l_crit * 1000).toFixed(0)} mm`,
      "── Aplastamiento concreto AISC §J8 ──": "",
      "Pp (nominal)": `${Pp.toFixed(0)} kN`,
      "φPp (diseño)": `${phiPp.toFixed(0)} kN`,
      "Pu aplicado": `${p.Pu.toFixed(0)} kN`,
      "Ratio Pu/φPp": `${ratio_bearing.toFixed(3)} ${ratio_bearing <= 1 ? "✓" : "✗"}`,
      "── Espesor placa AISC DG-1 ──": "",
      "f_p (presión)": `${(f_p / 1000).toFixed(0)} kPa (${(f_p / 1000).toFixed(0)} kN/m²)`,
      "t req.": `${(t_req * 1000).toFixed(1)} mm`,
      "t dado": `${(p.t_plate * 1000).toFixed(1)} mm`,
      "Ratio t/t_req": `${ratio_t.toFixed(2)} ${ratio_t >= 1 ? "✓" : "✗"}`,
      "── Pernos anclaje AISC §J3 / ACI §17 ──": "",
      "e = Mu/Pu": `${(e * 1000).toFixed(0)} mm`,
      "Brazo a pernos": `${(L_arm * 1000).toFixed(0)} mm`,
      "Tu total (tensión neta)": `${T_bolt.toFixed(1)} kN`,
      "Tu por perno": `${T_per_bolt.toFixed(1)} kN`,
      "A_perno": `${(A_bolt * 1e6).toFixed(1)} mm²`,
      "φRn perno": `${phiRn_bolt.toFixed(1)} kN`,
      "Ratio Tu/φRn": `${ratio_bolt.toFixed(3)} ${ratio_bolt <= 1 ? "✓" : "✗"}`,
      "── Dictamen ──": "",
      "Criterio global": `${ratio_bearing <= 1 && ratio_t >= 1 && ratio_bolt <= 1 ? "✓ OK" : "✗ REVISAR"}`,
      "── Solver FEM ──": "",
      "Tipo": nlInfo ? "NO-LINEAL (J2 secante)" : "Lineal elástico",
      ...(nlInfo
        ? {
            "Iteraciones NL": `${nlInfo.iterations}${nlInfo.converged ? " ✓ convergió" : " ✗ max-iter"}`,
            "Elementos plastificados": `${nlInfo.elementsYielded}`,
            "Max σ/Fy (lineal inicial)": nlInfo.maxRatio.toFixed(2),
            "Interpretación": nlInfo.elementsYielded > 0
              ? `${nlInfo.elementsYielded} shells alcanzaron fluencia → redistribución`
              : "Toda la placa en rango elástico",
          }
        : {}),
    };
  },
};
