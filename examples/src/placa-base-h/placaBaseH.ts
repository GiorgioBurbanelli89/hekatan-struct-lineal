/**
 * Placa base anclada con columna H (perfil W) — estilo IDEA StatiCa CBFEM.
 *
 * Componentes modelados:
 *   - Placa base (cáscara Q4 horizontal)
 *   - Columna H (3 piezas de cáscara: patín frontal, patín trasero, alma)
 *   - Pernos de anclaje como BARRAS de 3 nudos (embebido → placa → proyección), empotrados en
 *     su extremo inferior (representa el embebido en el pedestal)
 *   - Pedestal de hormigón: SOLO DIBUJADO (caja en `objects3D`), no entra en el análisis
 *
 * Cargas: compresión Pu (kN) + momento Mu (kN·m) en la cabeza del tramo de columna.
 *
 * Comprobaciones (folder «📊 Calculados»):
 *   - AISC 360-22 §J8: aplastamiento del hormigón
 *   - AISC Design Guide 1: espesor de la placa
 *   - ACI 318-22 §17: tracción del anclaje
 *
 * Graduado el 28-sep-2026 desde la página propia (`main.ts` de antes): el modelo se movió tal
 * cual — mismo orden de nudos, mismos valores por defecto, misma llamada al solver.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import * as THREE from "three";
import { ecHormigonACI } from "../shared/materials";

// Material acero (kN/m², kN/m³)
const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 7.85;   // MASA del acero en t/m³ (kN·s²/m⁴). Iba 78 = su PESO en kN/m³: 10 veces de más (29-sep-2026)

// Comprobaciones: acero de la placa y del anclaje
const Fy_steel = 250000;     // kN/m² (Fy = 250 MPa, A36/A992 placa base típica)
const fut_anchor = 600000;   // kN/m² (F1554 Gr.36 → fut ≈ 600 MPa nominal)

export interface PlacaBaseHParams {
  B: number; H: number; t_plate: number;
  d_col: number; bf_col: number; tf_col: number; tw_col: number; L_col: number;
  nBoltsX: number; nBoltsY: number; sx: number; sy: number;
  d_bolt: number; L_bolt: number; L_proj: number;
  B_ped: number; H_ped: number; h_ped: number; fc: number;
  Pu: number; Mu: number; nx: number; ny: number;
}

export interface PlacaBaseHMalla {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  boltPositions: [number, number][];
  /** Módulo del hormigón del pedestal (ACI 318). La página lo calculaba y no lo usaba. */
  Ec_kNm2: number;
}

/** La malla, pura: la misma cuenta que llevaba la página. */
export function mallaPlacaBaseH(p: PlacaBaseHParams): PlacaBaseHMalla {
  const B = p.B;
  const H = p.H;
  const t_plate = p.t_plate;
  const d_col = p.d_col;
  const bf_col = p.bf_col;
  const tf_col = p.tf_col;
  const tw_col = p.tw_col;
  const L_col = p.L_col;
  const d_bolt = p.d_bolt;
  const L_bolt = p.L_bolt;
  const L_proj = p.L_proj;
  const fc = p.fc;
  const sx = p.sx;
  const sy = p.sy;
  const nBoltsX = Math.max(2, Math.round(p.nBoltsX));
  const nBoltsY = Math.max(2, Math.round(p.nBoltsY));
  const Pu = p.Pu;
  const Mu = p.Mu;
  const nx = Math.round(p.nx);
  const ny = Math.round(p.ny);

  const nodes: Node[] = [];
  const elements: Element[] = [];
  const thicknesses = new Map<number, number>();
  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iz = new Map<number, number>();
  const Iy = new Map<number, number>();
  const J = new Map<number, number>();
  const shearModuli = new Map<number, number>();

  function addNode(x: number, y: number, z: number): number {
    nodes.push([x, y, z]);
    return nodes.length - 1;
  }
  function addShell(n0: number, n1: number, n2: number, n3: number, t: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    thicknesses.set(i, t);
    elasticities.set(i, Es);
    poissonsRatios.set(i, nu_s);
    densities.set(i, rho_s);
    areas.set(i, 0);
    Iy.set(i, 0); Iz.set(i, 0); J.set(i, 0);
    shearModuli.set(i, Gs);
  }
  function addFrame(n0: number, n1: number, A: number, I: number, Jt: number) {
    elements.push([n0, n1]);
    const i = elements.length - 1;
    elasticities.set(i, Es);
    shearModuli.set(i, Gs);
    poissonsRatios.set(i, nu_s);
    densities.set(i, rho_s);
    areas.set(i, A);
    Iy.set(i, I); Iz.set(i, I); J.set(i, Jt);
    thicknesses.set(i, 0);
  }

  // ── 1. PLACA BASE (malla Q4 nx × ny) ──
  // Centrada en (0, 0, 0), plano XY, espesor t_plate
  const dx = B / nx, dy = H / ny;
  const plateGrid: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    const row: number[] = [];
    const y = -H / 2 + j * dy;
    for (let i = 0; i <= nx; i++) {
      const x = -B / 2 + i * dx;
      row.push(addNode(x, y, 0));
    }
    plateGrid.push(row);
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      addShell(
        plateGrid[j][i], plateGrid[j][i + 1],
        plateGrid[j + 1][i + 1], plateGrid[j + 1][i],
        t_plate,
      );
    }
  }

  // Nudo de la malla de la placa más cercano a (x, y)
  function snapToPlate(x: number, y: number): number {
    let best = -1;
    let dmin = Infinity;
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const idx = plateGrid[j][i];
        const [nx_, ny_] = nodes[idx];
        const d = Math.hypot(nx_ - x, ny_ - y);
        if (d < dmin) { dmin = d; best = idx; }
      }
    }
    return best;
  }

  // ── 2. COLUMNA H (3 piezas de cáscara SOLDADAS) ──
  // Patín frontal en x=+d_col/2, patín trasero en x=-d_col/2, alma en plano XZ con y=0.
  // El alma comparte nudos con los patines en su punto medio (y=0) → la soldadura.
  // nyFlange debe ser PAR para tener un nudo exacto en y=0.
  const nzCol = 6;
  const nyFlange = 4;          // par → nudo medio iy = nyFlange/2 = 2
  const nxWeb = 3;
  const flangeMidIy = nyFlange / 2;

  const xF = +d_col / 2 - tf_col / 2;
  const xB = -d_col / 2 + tf_col / 2;

  // Patín frontal (z, y)
  const frontGrid: number[][] = [];
  for (let iz = 0; iz <= nzCol; iz++) {
    const z = (iz / nzCol) * L_col + 0; // desde la placa hacia arriba
    const row: number[] = [];
    for (let iy = 0; iy <= nyFlange; iy++) {
      const y = -bf_col / 2 + (iy * bf_col) / nyFlange;
      // Nivel z=0: al nudo de la placa
      if (iz === 0) {
        row.push(snapToPlate(xF, y));
      } else {
        row.push(addNode(xF, y, z));
      }
    }
    frontGrid.push(row);
  }
  for (let iz = 0; iz < nzCol; iz++) {
    for (let iy = 0; iy < nyFlange; iy++) {
      addShell(
        frontGrid[iz][iy], frontGrid[iz][iy + 1],
        frontGrid[iz + 1][iy + 1], frontGrid[iz + 1][iy],
        tf_col,
      );
    }
  }

  // Patín trasero
  const backGrid: number[][] = [];
  for (let iz = 0; iz <= nzCol; iz++) {
    const z = (iz / nzCol) * L_col;
    const row: number[] = [];
    for (let iy = 0; iy <= nyFlange; iy++) {
      const y = -bf_col / 2 + (iy * bf_col) / nyFlange;
      if (iz === 0) {
        row.push(snapToPlate(xB, y));
      } else {
        row.push(addNode(xB, y, z));
      }
    }
    backGrid.push(row);
  }
  for (let iz = 0; iz < nzCol; iz++) {
    for (let iy = 0; iy < nyFlange; iy++) {
      addShell(
        backGrid[iz][iy], backGrid[iz][iy + 1],
        backGrid[iz + 1][iy + 1], backGrid[iz + 1][iy],
        tf_col,
      );
    }
  }

  // Alma (plano XZ con y=0, espesor tw_col). Comparte los nudos de la línea media de los patines.
  const webGrid: number[][] = [];
  for (let iz = 0; iz <= nzCol; iz++) {
    const z = (iz / nzCol) * L_col;
    const row: number[] = [];
    for (let ix = 0; ix <= nxWeb; ix++) {
      const x = xB + (ix * (xF - xB)) / nxWeb;
      if (ix === 0) {
        row.push(backGrid[iz][flangeMidIy]);       // soldadura con el patín trasero
      } else if (ix === nxWeb) {
        row.push(frontGrid[iz][flangeMidIy]);      // soldadura con el patín frontal
      } else if (iz === 0) {
        row.push(snapToPlate(x, 0));
      } else {
        row.push(addNode(x, 0, z));
      }
    }
    webGrid.push(row);
  }
  for (let iz = 0; iz < nzCol; iz++) {
    for (let ix = 0; ix < nxWeb; ix++) {
      addShell(
        webGrid[iz][ix], webGrid[iz][ix + 1],
        webGrid[iz + 1][ix + 1], webGrid[iz + 1][ix],
        tw_col,
      );
    }
  }

  // ── 3. PERNOS DE ANCLAJE (rejilla nBoltsX × nBoltsY) ──
  // Empotrados en el extremo inferior (z = -L_bolt, el embebido en el pedestal).
  const A_bolt = Math.PI * d_bolt * d_bolt / 4;
  const I_bolt = Math.PI * Math.pow(d_bolt, 4) / 64;
  const J_bolt = 2 * I_bolt;

  const xMin = -B / 2 + sx, xMax = +B / 2 - sx;
  const yMin = -H / 2 + sy, yMax = +H / 2 - sy;
  const dxBolt = (xMax - xMin) / (nBoltsX - 1);
  const dyBolt = (yMax - yMin) / (nBoltsY - 1);

  const boltPositions: [number, number][] = [];
  for (let ix = 0; ix < nBoltsX; ix++) {
    const bx = xMin + ix * dxBolt;
    for (let iy = 0; iy < nBoltsY; iy++) {
      const by = yMin + iy * dyBolt;
      // Fuera los pernos que caen DENTRO de la huella de la columna H
      const insideColX = Math.abs(bx) < d_col / 2 + 0.005;
      const insideColY = Math.abs(by) < bf_col / 2 + 0.005;
      if (insideColX && insideColY) continue;
      boltPositions.push([bx, by]);
    }
  }

  const boltAnchorIds: number[] = [];   // nudos del fondo (z=-L_bolt) — se empotran
  const boltPlateIds: number[] = [];    // nudos en la placa (z=0)
  const boltProjIds: number[] = [];     // nudos arriba (z=+L_proj, la tuerca)

  for (const [bx, by] of boltPositions) {
    const plateNode = snapToPlate(bx, by);
    const anchorNode = addNode(bx, by, -L_bolt);
    const projNode = addNode(bx, by, L_proj);
    boltPlateIds.push(plateNode);
    boltAnchorIds.push(anchorNode);
    boltProjIds.push(projNode);
    // Barra del perno: embebido (abajo) → placa → proyección (tuerca, arriba)
    addFrame(anchorNode, plateNode, A_bolt, I_bolt, J_bolt);
    addFrame(plateNode, projNode, A_bolt, I_bolt, J_bolt);
  }

  // Pedestal: la página calculaba E_c y dibujaba la caja; el hormigón NO entra en el análisis.
  const Ec_kNm2 = ecHormigonACI(fc / 1000); // ACI 318: E_c (kN/m²)

  // ── 4. APOYOS: empotramiento en el fondo de los pernos ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  const fix6: [boolean, boolean, boolean, boolean, boolean, boolean] = [true, true, true, true, true, true];
  for (const id of boltAnchorIds) supports.set(id, fix6);

  // ── 5. CARGAS en la cabeza de la columna ──
  const topNodes: number[] = [];
  for (let iy = 0; iy <= nyFlange; iy++) topNodes.push(frontGrid[nzCol][iy]);
  for (let iy = 0; iy <= nyFlange; iy++) topNodes.push(backGrid[nzCol][iy]);
  for (let ix = 1; ix < nxWeb; ix++) topNodes.push(webGrid[nzCol][ix]);

  const loads = new Map<number, [number, number, number, number, number, number]>();
  const fz = -Pu / topNodes.length;
  for (const id of topNodes) {
    loads.set(id, [0, 0, fz, 0, 0, 0]);
  }
  // Mu: par de fuerzas axiales en los patines (M = ΔP × d_col)
  const dP = Mu / d_col / (nyFlange + 1);
  for (let iy = 0; iy <= nyFlange; iy++) {
    const fId = frontGrid[nzCol][iy];
    const bId = backGrid[nzCol][iy];
    const cur1 = loads.get(fId) || [0, 0, 0, 0, 0, 0];
    loads.set(fId, [cur1[0], cur1[1], cur1[2] + dP, cur1[3], cur1[4], cur1[5]]);
    const cur2 = loads.get(bId) || [0, 0, 0, 0, 0, 0];
    loads.set(bId, [cur2[0], cur2[1], cur2[2] - dP, cur2[3], cur2[4], cur2[5]]);
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities, shearModuli, areas,
    momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
    densities, poissonsRatios, thicknesses,
  };
  return { nodes, elements, nodeInputs, elementInputs, boltPositions, Ec_kNm2 };
}

export interface ComprobacionesH {
  vmMax: number;
  A1: number; A2: number; sqrtA2A1: number;
  phiPp: number; demandCapPp: number;
  m_cantilever: number; fp: number;
  t_req: number; t_actual: number; demandCapT: number;
  T_anchor: number; phiNn: number; demandCapAnchor: number;
}

/** Las comprobaciones del panel de la página, tal cual (AISC §J8 + DG-1 + ACI 318 §17). */
export function comprobacionesPlacaBaseH(p: PlacaBaseHParams, vmMax: number): ComprobacionesH {
  const { B, H, t_plate, d_col, B_ped, H_ped, fc, sx, d_bolt, Pu, Mu } = p;
  const nBoltsY = Math.max(2, Math.round(p.nBoltsY));

  // AISC §J8: φPp = φ · 0.85 · f'c · A1 · √(A2/A1) ≤ 1.7·φ·f'c·A1, con φ=0.65
  const phi_brg = 0.65;
  const A1 = B * H;
  const A2 = B_ped * H_ped;
  const sqrtA2A1 = Math.min(2, Math.sqrt(A2 / A1));
  const Pp_nom = 0.85 * fc * A1 * sqrtA2A1;
  const Pp_cap = Math.min(Pp_nom, 1.7 * fc * A1);
  const phiPp = phi_brg * Pp_cap;
  const demandCapPp = Pu / Math.max(1, phiPp);

  // DG-1: m = (B - 0.95·d_col)/2, fp = Pu/A1, t_req = m · √(2·fp / (φ·Fy)), φ=0.9
  const m_cantilever = Math.max(0, (B - 0.95 * d_col) / 2);
  const fp = Pu / A1;
  const t_req = m_cantilever * Math.sqrt((2 * Math.max(0, fp)) / (0.9 * Fy_steel));
  const demandCapT = t_req / Math.max(1e-6, t_plate);

  // ACI 318 §17 — tracción por perno (simplificado): T_total = Mu/brazo − Pu/2, brazo ≈ B − 2·sx
  const arm = Math.max(0.05, B - 2 * sx);
  const T_total = Math.max(0, Mu / arm - Pu / 2);
  const T_anchor = T_total / Math.max(1, nBoltsY);
  // A_se ≈ 0.75 · π/4 · d² (área efectiva a tracción, F1554 nominal)
  const A_se = 0.75 * Math.PI / 4 * d_bolt * d_bolt;
  const phi_t = 0.75;
  const phiNn = phi_t * A_se * fut_anchor;
  const demandCapAnchor = T_anchor / Math.max(1, phiNn);

  return {
    vmMax,
    A1, A2, sqrtA2A1, phiPp, demandCapPp,
    m_cantilever, fp, t_req, t_actual: t_plate, demandCapT,
    T_anchor, phiNn, demandCapAnchor,
  };
}

/** σ von Mises máximo de los valores por nudo de cada cáscara (como la página). */
export function vonMisesMaximo(ao: AnalyzeOutputs): number {
  let vmMax = 0;
  const vmMap = (ao as any)?.vonMises as Map<number, number[]> | undefined;
  if (vmMap) vmMap.forEach((arr) => arr.forEach((v) => { if (v > vmMax) vmMax = v; }));
  return vmMax;
}

/** Pernos, tuercas, orificios y el pedestal (solo dibujo). */
function decoradores(p: PlacaBaseHParams, boltPositions: [number, number][]): THREE.Object3D[] {
  const { t_plate, d_bolt, L_bolt, L_proj, B_ped, H_ped, h_ped } = p;
  const decorators: THREE.Object3D[] = [];
  const r_hole = (d_bolt * 1.5) / 2;  // orificio típico = 1.5× Ø perno
  const r_nut  = (d_bolt * 1.8) / 2;  // tuerca hexagonal
  const h_nut  = 0.020;               // espesor tuerca 20 mm

  const matBolt = new THREE.MeshBasicMaterial({ color: 0xff8800 });
  const matNutMesh = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const matHoleEdge = new THREE.LineBasicMaterial({ color: 0xff4400, linewidth: 3 });
  const matNutEdge = new THREE.LineBasicMaterial({ color: 0x665500, linewidth: 1 });

  for (const [bx, by] of boltPositions) {
    // Perno cilíndrico completo (embebido → placa → proyección)
    const totalLen = L_bolt + L_proj;
    const boltMid = (-L_bolt + L_proj) / 2;
    const boltGeom = new THREE.CylinderGeometry(d_bolt / 2, d_bolt / 2, totalLen, 12);
    const boltMesh = new THREE.Mesh(boltGeom, matBolt);
    boltMesh.position.set(bx, by, boltMid);
    boltMesh.rotation.x = Math.PI / 2;
    decorators.push(boltMesh);

    // Tuerca hexagonal arriba
    const nutGeom = new THREE.CylinderGeometry(r_nut, r_nut, h_nut, 6);
    const nutMesh = new THREE.Mesh(nutGeom, matNutMesh);
    nutMesh.position.set(bx, by, L_proj - h_nut / 2);
    nutMesh.rotation.x = Math.PI / 2;
    decorators.push(nutMesh);

    const nutEdges = new THREE.EdgesGeometry(nutGeom);
    const nutEdgesLines = new THREE.LineSegments(nutEdges, matNutEdge);
    nutEdgesLines.position.set(bx, by, L_proj - h_nut / 2);
    nutEdgesLines.rotation.x = Math.PI / 2;
    decorators.push(nutEdgesLines);

    // Orificio en la placa (cara superior e inferior)
    const holePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * 2 * Math.PI;
      holePts.push(new THREE.Vector3(bx + r_hole * Math.cos(a), by + r_hole * Math.sin(a), t_plate / 2 + 0.0005));
    }
    decorators.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(holePts), matHoleEdge));
    const holePtsBot: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * 2 * Math.PI;
      holePtsBot.push(new THREE.Vector3(bx + r_hole * Math.cos(a), by + r_hole * Math.sin(a), -t_plate / 2 - 0.0005));
    }
    decorators.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(holePtsBot), matHoleEdge));
  }

  // Pedestal de hormigón (solo dibujo): caja B_ped × H_ped × h_ped con la cara superior en z=0
  const pedGeom = new THREE.BoxGeometry(B_ped, H_ped, h_ped);
  const pedMat = new THREE.MeshBasicMaterial({
    color: 0x8a8a8a, transparent: true, opacity: 0.35, side: THREE.DoubleSide,
  });
  const pedMesh = new THREE.Mesh(pedGeom, pedMat);
  pedMesh.position.set(0, 0, -h_ped / 2);
  decorators.push(pedMesh);
  const pedEdgesLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(pedGeom),
    new THREE.LineBasicMaterial({ color: 0x444444, linewidth: 1 }),
  );
  pedEdgesLines.position.set(0, 0, -h_ped / 2);
  decorators.push(pedEdgesLines);
  return decorators;
}

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

// Lo último que se construyó, para el folder «Calculados».
let ultimo: { malla: PlacaBaseHMalla; bench: ComprobacionesH; p: PlacaBaseHParams } | null = null;

const ratioFmt = (r: number) => r < 1.0 ? `${r.toFixed(2)} ✓` : r < 1.2 ? `${r.toFixed(2)} ⚠` : `${r.toFixed(2)} ✗`;

export const placaBaseH: ExampleDef = {
  id: "placa-base-h",
  name: "Placa Base + Columna H (CBFEM)",
  // cáscaras + barras (los pernos): Mixtos. La categoría la manda el tipo de elemento MEDIDO
  category: "4️⃣ Mixtos · 🔩 Conexiones",
  defaultShellResult: "vonMises",
  viewFrom: [1, -1, 1],
  params: {
    B:       P("Placa", "B placa (m, eje X)", 0.50, 0.25, 1.20, 0.02),
    H:       P("Placa", "H placa (m, eje Y)", 0.50, 0.25, 1.20, 0.02),
    t_plate: P("Placa", "Espesor placa (m)", 0.025, 0.012, 0.060, 0.002),
    d_col:   P("Columna H", "d columna (m)", 0.30, 0.18, 0.50, 0.02),
    bf_col:  P("Columna H", "bf columna (m)", 0.25, 0.15, 0.40, 0.01),
    tf_col:  P("Columna H", "tf patín (m)", 0.022, 0.012, 0.040, 0.002),
    tw_col:  P("Columna H", "tw alma (m)", 0.014, 0.008, 0.025, 0.001),
    L_col:   P("Columna H", "L tramo de columna (m)", 0.50, 0.30, 1.50, 0.05),
    nBoltsX: P("Pernos", "Pernos en X (filas)", 2, 2, 6, 1),
    nBoltsY: P("Pernos", "Pernos en Y (columnas)", 2, 2, 6, 1),
    sx:      P("Pernos", "sx — dist borde X (m)", 0.07, 0.03, 0.25, 0.01),
    sy:      P("Pernos", "sy — dist borde Y (m)", 0.07, 0.03, 0.25, 0.01),
    d_bolt:  P("Pernos", "Ø perno (m)", 0.024, 0.012, 0.050, 0.002),
    L_bolt:  P("Pernos", "L embebido (m)", 0.30, 0.15, 0.60, 0.02),
    L_proj:  P("Pernos", "L proyección sobre placa (m, tuerca)", 0.05, 0.02, 0.15, 0.005),
    B_ped:   P("Pedestal", "B pedestal (m)", 0.80, 0.40, 1.80, 0.05),
    H_ped:   P("Pedestal", "H pedestal (m)", 0.80, 0.40, 1.80, 0.05),
    h_ped:   P("Pedestal", "h pedestal (m, profundidad)", 0.50, 0.30, 1.50, 0.05),
    fc:      P("Pedestal", "f'c hormigón (kN/m²)", 28000, 17000, 50000, 1000),
    Pu:      P("Cargas", "Pu compresión (kN)", 300, 0, 5000, 25),
    Mu:      P("Cargas", "Mu momento (kN·m)", 30, 0, 800, 5),
    nx:      P("Malla", "Malla nx (placa)", 12, 6, 24, 2),
    ny:      P("Malla", "Malla ny (placa)", 12, 6, 24, 2),
  },
  guide: [
    "Pu y Mu entran por la cabeza del tramo de columna; Mu como par en los patines",
    "Los pernos son barras de 3 nudos empotradas al fondo del embebido",
    "El pedestal solo se dibuja: su f'c y su área entran en el aplastamiento (AISC §J8)",
    "En «📊 Calculados»: aplastamiento, espesor de placa (DG-1) y tracción del anclaje (ACI §17)",
  ],
  build: (params: Record<string, number>, states: BuildStates) => {
    const p = params as unknown as PlacaBaseHParams;
    const malla = mallaPlacaBaseH(p);
    const { nodes, elements, nodeInputs, elementInputs } = malla;

    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
      analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    } catch (e: any) {
      console.warn("Placa base deform/analyze:", e?.message ?? e);
    }

    const bench = comprobacionesPlacaBaseH(p, vonMisesMaximo(analyzeOutputs));
    ultimo = { malla, bench, p };

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs;
    states.elementInputs.val = elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = decoradores(p, malla.boltPositions);
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { bench: v, p } = ultimo;
    return {
      "Demanda": `Pu = ${p.Pu} kN · Mu = ${p.Mu} kN·m`,
      "── Aplastamiento del hormigón (AISC 360-22 §J8) ──": "",
      "A₁ = B·H (AISC §J8)": `${v.A1.toFixed(4)} m²`,
      "A₂ = B_ped·H_ped (AISC §J8)": `${v.A2.toFixed(4)} m²`,
      "√(A₂/A₁) ≤ 2 (AISC §J8)": v.sqrtA2A1.toFixed(3),
      "φPp (AISC §J8)": `${v.phiPp.toFixed(0)} kN`,
      "Aplastamiento Pu/φPp (AISC §J8)": ratioFmt(v.demandCapPp),
      "── Espesor de la placa (AISC Design Guide 1) ──": "",
      "m voladizo (DG-1)": `${v.m_cantilever.toFixed(4)} m`,
      "fp = Pu/A₁ (DG-1)": `${v.fp.toFixed(0)} kN/m²`,
      "t requerido (DG-1)": `${(v.t_req * 1000).toFixed(1)} mm`,
      "t de la placa": `${(v.t_actual * 1000).toFixed(1)} mm`,
      "Espesor t_req/t (DG-1)": ratioFmt(v.demandCapT),
      "── Tracción del anclaje (ACI 318-22 §17, F1554) ──": "",
      "T por perno (ACI 318 §17)": `${v.T_anchor.toFixed(1)} kN`,
      "φNn por perno (ACI 318 §17)": `${v.phiNn.toFixed(1)} kN`,
      "Tracción del anclaje T/φNn (ACI 318 §17)": ratioFmt(v.demandCapAnchor),
      "── FEM ──": "",
      "σ von Mises máx": `${v.vmMax.toFixed(0)} kN/m²`,
      "σ von Mises máx / Fy (Fy = 250000 kN/m²)": ratioFmt(v.vmMax / 250000),
    };
  },
};
