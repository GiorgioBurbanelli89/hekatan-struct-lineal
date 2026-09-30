/**
 * Placa base + columna HSS HUECA + pernos de anclaje (estilo CBFEM).
 *
 * Componentes:
 *   - Placa base (cáscara Q4 horizontal, sin orificio), a z = z_gap sobre el pedestal
 *   - Columna HSS rectangular hueca (4 paredes de cáscara)
 *   - 8 cartelas (Q4 degeneradas [A, B, C, C])
 *   - Pedestal de hormigón: sus 6 caras como láminas Q4 de 1 mm. ENTRAN en el análisis (van a
 *     `deform`), pero no tocan ningún nudo de la placa ni de los pernos: solo se apoyan en su base.
 *     Sin resultado de cáscara (se borran tras `analyze`, como hacía la página).
 *   - Pernos de anclaje: barras de 3 nudos (tuerca → placa → embebido), empotradas abajo
 *
 * Cargas en la cabeza del tubo: Pu, Mx, My repartidos por igual entre sus nudos.
 *
 * Comprobaciones (folder «📊 Calculados»): AISC 360-22 §J8, AISC Design Guide 1, ACI 318 §17.
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
import { rangoSoloLosas, cortarPorYCero } from "./comunPlacaBase";

const Es = 200e6, nu_s = 0.3, Gs = Es / (2 * (1 + nu_s)), rho_s = 7.85;   // MASA del acero en t/m³ (kN·s²/m⁴). Iba 78 = su PESO en kN/m³: 10 veces de más (29-sep-2026)
const Fy_steel = 250000, fut_anchor = 600000;

/** Separación visible entre la placa y el pedestal. */
const z_gap = 0.04;

export interface PlacaBaseHuecaParams {
  B: number; H: number; t_plate: number;
  bc: number; hc: number; t_col: number; L_col: number;
  nBoltsX: number; nBoltsY: number; sx: number; sy: number;
  d_bolt: number; L_bolt: number; L_proj: number;
  B_ped: number; H_ped: number; h_ped: number; fc: number;
  Pu: number; Mx: number; My: number;
  nx: number; ny: number; nz_col: number;
}

export interface PlacaBaseHuecaMalla {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  boltPositions: [number, number][];
  /** Caras del pedestal (láminas de 1 mm): sin resultado de cáscara. */
  concreteShells: Set<number>;
}

/** La malla, pura: la misma cuenta que llevaba la página. */
export function mallaPlacaBaseHueca(p: PlacaBaseHuecaParams): PlacaBaseHuecaMalla {
  const B = p.B, H = p.H, t_plate = p.t_plate;
  const bc = p.bc, hc = p.hc, t_col = p.t_col;
  const L_col = p.L_col;
  const nBoltsX = Math.round(p.nBoltsX), nBoltsY = Math.round(p.nBoltsY);
  const sx = p.sx, sy = p.sy;
  const d_bolt = p.d_bolt, L_bolt = p.L_bolt, L_proj = p.L_proj;
  const B_ped = p.B_ped, H_ped = p.H_ped, h_ped = p.h_ped;
  const fc = p.fc;
  const Pu = p.Pu;
  const Mx = p.Mx;
  const My = p.My;
  const nx = Math.round(p.nx), ny = Math.round(p.ny);
  const nz_col = Math.round(p.nz_col);

  const nodes: Node[] = [];
  const elements: Element[] = [];
  const thicknesses = new Map<number, number>();
  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iz = new Map<number, number>();
  const Iy = new Map<number, number>();
  const J = new Map<number, number>();
  // Caras del pedestal: láminas de 1 mm que dibujan el volumen de hormigón. Sin resultado de
  // cáscara (ver tras `analyze`): el visor las pinta en su gris neutro.
  const concreteShells = new Set<number>();

  function addNode(x: number, y: number, z: number): number {
    nodes.push([x, y, z]);
    return nodes.length - 1;
  }
  function addShell(n0: number, n1: number, n2: number, n3: number, t: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    thicknesses.set(i, t); elasticities.set(i, Es); poissonsRatios.set(i, nu_s);
    densities.set(i, rho_s); shearModuli.set(i, Gs);
    areas.set(i, 0); Iy.set(i, 0); Iz.set(i, 0); J.set(i, 0);
  }
  function addFrame(n0: number, n1: number, A: number, I: number, Jt: number) {
    elements.push([n0, n1]);
    const i = elements.length - 1;
    elasticities.set(i, Es); poissonsRatios.set(i, nu_s);
    densities.set(i, rho_s); shearModuli.set(i, Gs);
    areas.set(i, A); Iy.set(i, I); Iz.set(i, I); J.set(i, Jt);
    thicknesses.set(i, 0);
  }

  // ── PLACA BASE: rejilla nx × ny en el plano z = z_gap (SIN orificio) ──
  const dxp = B / nx, dyp = H / ny;
  const plateGrid: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    const row: number[] = [];
    for (let i = 0; i <= nx; i++) row.push(addNode(-B / 2 + i * dxp, -H / 2 + j * dyp, z_gap));
    plateGrid.push(row);
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      addShell(plateGrid[j][i], plateGrid[j][i+1], plateGrid[j+1][i+1], plateGrid[j+1][i], t_plate);
    }
  }

  function snapToPlate(x: number, y: number): number {
    let best = -1; let dmin = Infinity;
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const idx = plateGrid[j][i];
      const d = Math.hypot(nodes[idx][0]-x, nodes[idx][1]-y);
      if (d < dmin) { dmin = d; best = idx; }
    }
    return best;
  }

  // ── COLUMNA HSS HUECA: 4 paredes de cáscara ──
  const nx_col = Math.max(2, Math.round(bc / dxp));
  const ny_col = Math.max(2, Math.round(hc / dyp));
  const dx_c = bc / nx_col, dy_c = hc / ny_col, dz_c = L_col / nz_col;

  // Cara y=-hc/2
  const wallS: number[][] = [];
  for (let iz = 0; iz <= nz_col; iz++) {
    const row: number[] = [];
    for (let ix = 0; ix <= nx_col; ix++) {
      const x = -bc/2 + ix*dx_c;
      if (iz === 0) row.push(snapToPlate(x, -hc/2));
      else row.push(addNode(x, -hc/2, z_gap + iz*dz_c));
    }
    wallS.push(row);
  }
  for (let iz = 0; iz < nz_col; iz++) for (let ix = 0; ix < nx_col; ix++)
    addShell(wallS[iz][ix], wallS[iz][ix+1], wallS[iz+1][ix+1], wallS[iz+1][ix], t_col);

  // Cara y=+hc/2
  const wallN: number[][] = [];
  for (let iz = 0; iz <= nz_col; iz++) {
    const row: number[] = [];
    for (let ix = 0; ix <= nx_col; ix++) {
      const x = -bc/2 + ix*dx_c;
      if (iz === 0) row.push(snapToPlate(x, hc/2));
      else row.push(addNode(x, hc/2, z_gap + iz*dz_c));
    }
    wallN.push(row);
  }
  for (let iz = 0; iz < nz_col; iz++) for (let ix = 0; ix < nx_col; ix++)
    addShell(wallN[iz][ix], wallN[iz][ix+1], wallN[iz+1][ix+1], wallN[iz+1][ix], t_col);

  // Cara x=-bc/2 (comparte las aristas con las paredes S y N)
  const wallW: number[][] = [];
  for (let iz = 0; iz <= nz_col; iz++) {
    const row: number[] = [];
    for (let iy = 0; iy <= ny_col; iy++) {
      const y = -hc/2 + iy*dy_c;
      if (iz === 0) row.push(snapToPlate(-bc/2, y));
      else if (iy === 0) row.push(wallS[iz][0]);
      else if (iy === ny_col) row.push(wallN[iz][0]);
      else row.push(addNode(-bc/2, y, z_gap + iz*dz_c));
    }
    wallW.push(row);
  }
  for (let iz = 0; iz < nz_col; iz++) for (let iy = 0; iy < ny_col; iy++)
    addShell(wallW[iz][iy], wallW[iz][iy+1], wallW[iz+1][iy+1], wallW[iz+1][iy], t_col);

  // Cara x=+bc/2
  const wallE: number[][] = [];
  for (let iz = 0; iz <= nz_col; iz++) {
    const row: number[] = [];
    for (let iy = 0; iy <= ny_col; iy++) {
      const y = -hc/2 + iy*dy_c;
      if (iz === 0) row.push(snapToPlate(bc/2, y));
      else if (iy === 0) row.push(wallS[iz][nx_col]);
      else if (iy === ny_col) row.push(wallN[iz][nx_col]);
      else row.push(addNode(bc/2, y, z_gap + iz*dz_c));
    }
    wallE.push(row);
  }
  for (let iz = 0; iz < nz_col; iz++) for (let iy = 0; iy < ny_col; iy++)
    addShell(wallE[iz][iy], wallE[iz][iy+1], wallE[iz+1][iy+1], wallE[iz+1][iy], t_col);

  // ── CARTELAS: Q4 degenerada [A, B, C, C] ──
  const h_stiff_target = Math.min(0.20, L_col * 0.4);
  const w_stiff = Math.min(0.10, (B - bc) / 2 * 0.7);
  const k_stiff = Math.max(1, Math.round(h_stiff_target / dz_c));

  function addStiffenerShell(
    facePos: [number, number],
    outDir: [number, number],
    wallGrid: number[][],
    iWall: number,
  ) {
    const [fx, fy] = facePos;
    const [ox, oy] = outDir;
    const nA = wallGrid[0][iWall];
    const nB = snapToPlate(fx + ox * w_stiff, fy + oy * w_stiff);
    const nC = wallGrid[Math.min(k_stiff, wallGrid.length - 1)][iWall];
    addShell(nA, nB, nC, nC, t_col);
  }
  const oN = Math.max(1, Math.round(nx_col * 0.25));
  const oE = Math.max(1, Math.round(ny_col * 0.25));
  const i1N = Math.round(nx_col / 2) - oN, i2N = Math.round(nx_col / 2) + oN;
  const i1E = Math.round(ny_col / 2) - oE, i2E = Math.round(ny_col / 2) + oE;
  const x1N = -bc/2 + i1N * dx_c, x2N = -bc/2 + i2N * dx_c;
  addStiffenerShell([x1N, hc/2], [0, 1], wallN, i1N);
  addStiffenerShell([x2N, hc/2], [0, 1], wallN, i2N);
  addStiffenerShell([x1N, -hc/2], [0, -1], wallS, i1N);
  addStiffenerShell([x2N, -hc/2], [0, -1], wallS, i2N);
  const y1E = -hc/2 + i1E * dy_c, y2E = -hc/2 + i2E * dy_c;
  addStiffenerShell([bc/2, y1E], [1, 0], wallE, i1E);
  addStiffenerShell([bc/2, y2E], [1, 0], wallE, i2E);
  addStiffenerShell([-bc/2, y1E], [-1, 0], wallW, i1E);
  addStiffenerShell([-bc/2, y2E], [-1, 0], wallW, i2E);

  // ── PERNOS: rejilla nBoltsX × nBoltsY ──
  const A_bolt = Math.PI * d_bolt * d_bolt / 4;
  const I_bolt = Math.PI * d_bolt ** 4 / 64;
  const J_bolt = 2 * I_bolt;
  const boltPositions: [number, number][] = [];
  const dxBolt = (B - 2 * sx) / Math.max(1, nBoltsX - 1);
  const dyBolt = (H - 2 * sy) / Math.max(1, nBoltsY - 1);
  for (let ix = 0; ix < nBoltsX; ix++) {
    for (let iy = 0; iy < nBoltsY; iy++) {
      const bx = -B / 2 + sx + ix * dxBolt;
      const by = -H / 2 + sy + iy * dyBolt;
      if (Math.abs(bx) < bc / 2 + 0.005 && Math.abs(by) < hc / 2 + 0.005) continue;
      boltPositions.push([bx, by]);
    }
  }
  const pendingBolts: [number, number][] = [...boltPositions];

  // ── PEDESTAL DE HORMIGÓN (caras Q4 de 1 mm) ──
  const Ec = ecHormigonACI(fc / 1000);
  const nu_c = 0.20;
  const Gc = Ec / (2 * (1 + nu_c));
  const nx_p = 10, ny_p = 10, nz_p = 6;
  const dxp_e = B_ped / nx_p, dyp_e = H_ped / ny_p, dzp_e = h_ped / nz_p;

  const pedGrid: number[][][] = [];
  for (let k = 0; k <= nz_p; k++) {
    const layer: number[][] = [];
    for (let j = 0; j <= ny_p; j++) {
      const row: number[] = [];
      for (let i = 0; i <= nx_p; i++) {
        row.push(addNode(-B_ped/2 + i*dxp_e, -H_ped/2 + j*dyp_e, -h_ped + k*dzp_e));
      }
      layer.push(row);
    }
    pedGrid.push(layer);
  }
  function addPedShell(n0: number, n1: number, n2: number, n3: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    concreteShells.add(i);
    thicknesses.set(i, 0.001);
    elasticities.set(i, Ec);
    poissonsRatios.set(i, nu_c);
    densities.set(i, 24 / 9.80665);
    shearModuli.set(i, Gc);
    areas.set(i, 0); Iy.set(i, 0); Iz.set(i, 0); J.set(i, 0);
  }
  for (let j = 0; j < ny_p; j++) for (let i = 0; i < nx_p; i++)
    addPedShell(pedGrid[0][j][i], pedGrid[0][j][i+1], pedGrid[0][j+1][i+1], pedGrid[0][j+1][i]);
  function cellAtBoltPosition(cx: number, cy: number): boolean {
    for (const [bx, by] of boltPositions) {
      if (Math.hypot(cx - bx, cy - by) < dxp_e * 0.6) return true;
    }
    return false;
  }
  for (let j = 0; j < ny_p; j++) for (let i = 0; i < nx_p; i++) {
    const cx = -B_ped/2 + (i + 0.5) * dxp_e;
    const cy = -H_ped/2 + (j + 0.5) * dyp_e;
    if (cellAtBoltPosition(cx, cy)) continue;
    addPedShell(pedGrid[nz_p][j][i], pedGrid[nz_p][j][i+1], pedGrid[nz_p][j+1][i+1], pedGrid[nz_p][j+1][i]);
  }
  for (let k = 0; k < nz_p; k++) for (let i = 0; i < nx_p; i++)
    addPedShell(pedGrid[k][0][i], pedGrid[k][0][i+1], pedGrid[k+1][0][i+1], pedGrid[k+1][0][i]);
  for (let k = 0; k < nz_p; k++) for (let i = 0; i < nx_p; i++)
    addPedShell(pedGrid[k][ny_p][i], pedGrid[k][ny_p][i+1], pedGrid[k+1][ny_p][i+1], pedGrid[k+1][ny_p][i]);
  for (let k = 0; k < nz_p; k++) for (let j = 0; j < ny_p; j++)
    addPedShell(pedGrid[k][j][0], pedGrid[k][j+1][0], pedGrid[k+1][j+1][0], pedGrid[k+1][j][0]);
  for (let k = 0; k < nz_p; k++) for (let j = 0; j < ny_p; j++)
    addPedShell(pedGrid[k][j][nx_p], pedGrid[k][j+1][nx_p], pedGrid[k+1][j+1][nx_p], pedGrid[k+1][j][nx_p]);

  // ── PERNOS DE ANCLAJE: tuerca → placa → embebido ──
  for (const [bx, by] of pendingBolts) {
    const nTop = addNode(bx, by, z_gap + L_proj);
    const nMid = snapToPlate(bx, by);
    const nBot = addNode(bx, by, z_gap - L_bolt);
    addFrame(nTop, nMid, A_bolt, I_bolt, J_bolt);
    addFrame(nMid, nBot, A_bolt, I_bolt, J_bolt);
  }

  // ── APOYOS: fondo de los pernos + base del pedestal, empotrados ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  nodes.forEach((pt, id) => {
    const onBoltBot = Math.abs(pt[2] - (z_gap - L_bolt)) < 1e-6 &&
                      boltPositions.some(([bx, by]) => Math.abs(pt[0]-bx) < 1e-6 && Math.abs(pt[1]-by) < 1e-6);
    const onPedBot = Math.abs(pt[2] - (-h_ped)) < 1e-6;
    if (onBoltBot || onPedBot) supports.set(id, [true, true, true, true, true, true]);
  });

  // ── CARGAS en la cabeza del tubo ──
  const colTopNodes: number[] = [];
  nodes.forEach((pt, id) => {
    if (Math.abs(pt[2] - (z_gap + L_col)) < 1e-6 &&
        Math.abs(pt[0]) <= bc / 2 + 1e-6 && Math.abs(pt[1]) <= hc / 2 + 1e-6) {
      colTopNodes.push(id);
    }
  });
  const N_top = Math.max(1, colTopNodes.length);
  const fz_col = -Pu / N_top;
  const mx_col = Mx / N_top;
  const my_col = My / N_top;
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (const id of colTopNodes) loads.set(id, [0, 0, fz_col, mx_col, my_col, 0]);

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities, shearModuli, areas,
    momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
    densities, poissonsRatios, thicknesses,
  };
  return { nodes, elements, nodeInputs, elementInputs, boltPositions, concreteShells };
}

export interface ComprobacionesHueca {
  vmMax: number; A1: number; A2: number; phiPp: number; demandCapPp: number;
  m_cant: number; t_req: number; demandCapT: number;
  T_anchor: number; phiNn: number; demandCapAnchor: number;
}

/** Las comprobaciones del panel de la página, tal cual (AISC §J8 + DG-1 + ACI §17). */
export function comprobacionesPlacaBaseHueca(p: PlacaBaseHuecaParams, vmMax: number): ComprobacionesHueca {
  const { B, H, t_plate, bc, hc, sx, d_bolt, B_ped, H_ped, fc, Pu, Mx, My } = p;
  const nBoltsY = Math.round(p.nBoltsY);

  const phi_brg = 0.65;
  const A1 = B * H, A2 = B_ped * H_ped;
  const sqrtA2A1 = Math.min(2, Math.sqrt(A2 / A1));
  const Pp = Math.min(0.85 * fc * A1 * sqrtA2A1, 1.7 * fc * A1);
  const phiPp = phi_brg * Pp;
  const demandCapPp = Pu / Math.max(1, phiPp);

  const m_cant = Math.max(0, (B - 0.95 * Math.max(bc, hc)) / 2);
  const fp = Pu / A1;
  const t_req = m_cant * Math.sqrt(2 * Math.max(0, fp) / (0.9 * Fy_steel));
  const demandCapT = t_req / Math.max(1e-6, t_plate);

  const arm = Math.max(0.05, B - 2 * sx);
  const M_resultant = Math.sqrt(Mx * Mx + My * My);
  const T_total = Math.max(0, M_resultant / arm - Pu / 2);
  const T_anchor = T_total / Math.max(1, nBoltsY);
  const A_se = 0.75 * Math.PI * d_bolt * d_bolt / 4;
  const phiNn = 0.75 * A_se * fut_anchor;
  const demandCapAnchor = T_anchor / Math.max(1, phiNn);

  return { vmMax, A1, A2, phiPp, demandCapPp, m_cant, t_req, demandCapT, T_anchor, phiNn, demandCapAnchor };
}

/** Símbolos de contacto placa–pedestal, pernos y tuercas (solo dibujo). */
function decoradores(p: PlacaBaseHuecaParams, boltPositions: [number, number][]): THREE.Object3D[] {
  const { B, H, d_bolt, L_bolt, L_proj } = p;
  const objs: THREE.Object3D[] = [];
  const matContact = new THREE.LineBasicMaterial({ color: 0xffaa00 });
  function addContactSymbol(cx: number, cy: number) {
    const N = 5;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= N * 2; i++) {
      const t = i / (N * 2);
      const z = z_gap * (1 - t);
      const dx = (i % 2 === 0) ? 0 : 0.008;
      pts.push(new THREE.Vector3(cx + dx, cy, z));
    }
    objs.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matContact));
  }
  addContactSymbol(B/2 - 0.04, H/2 - 0.04);
  addContactSymbol(-B/2 + 0.04, H/2 - 0.04);
  addContactSymbol(B/2 - 0.04, -H/2 + 0.04);
  addContactSymbol(-B/2 + 0.04, -H/2 + 0.04);
  addContactSymbol(0, 0);

  const matBolt = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5 });
  const matNut  = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.3 });
  const t_nut = d_bolt * 0.8;
  const r_nut = d_bolt * 0.85;
  const nutZ = z_gap + L_proj + t_nut / 2;
  for (const [bx, by] of boltPositions) {
    const geom = new THREE.CylinderGeometry(d_bolt/2, d_bolt/2, L_bolt + L_proj, 12);
    const m = new THREE.Mesh(geom, matBolt);
    m.position.set(bx, by, z_gap + (-L_bolt + L_proj) / 2);
    m.rotation.x = Math.PI / 2;
    objs.push(m);
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(r_nut, r_nut, t_nut, 6), matNut);
    nut.position.set(bx, by, nutZ);
    nut.rotation.x = Math.PI / 2;
    objs.push(nut);
  }
  return objs;
}

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

let ultimo: { malla: PlacaBaseHuecaMalla; bench: ComprobacionesHueca } | null = null;

const ratioFmt = (r: number) => r < 1 ? `${r.toFixed(2)} ✓` : r < 1.2 ? `${r.toFixed(2)} ⚠` : `${r.toFixed(2)} ✗`;

export const placaBaseHueca: ExampleDef = {
  id: "placa-base-hueca",
  name: "Placa Base + Columna HSS Hueca (acero)",
  // cáscaras + barras (los pernos): Mixtos. La categoría la manda el tipo de elemento MEDIDO
  category: "4️⃣ Mixtos · 🔩 Conexiones",
  defaultShellResult: "vonMises",
  viewFrom: [1, -1, 1],
  params: {
    B:       P("Placa", "B placa (m)", 0.50, 0.30, 1.20, 0.02),
    H:       P("Placa", "H placa (m)", 0.50, 0.30, 1.20, 0.02),
    t_plate: P("Placa", "t placa (m)", 0.025, 0.012, 0.060, 0.002),
    bc:      P("Columna HSS", "bc columna (m)", 0.30, 0.20, 0.50, 0.02),
    hc:      P("Columna HSS", "hc columna (m)", 0.30, 0.20, 0.50, 0.02),
    t_col:   P("Columna HSS", "t pared HSS (m)", 0.012, 0.006, 0.030, 0.002),
    L_col:   P("Columna HSS", "L tramo de columna (m)", 0.50, 0.30, 1.50, 0.05),
    nBoltsX: P("Pernos", "Pernos en X", 2, 2, 4, 1),
    nBoltsY: P("Pernos", "Pernos en Y", 2, 2, 4, 1),
    sx:      P("Pernos", "sx borde (m)", 0.07, 0.03, 0.20, 0.01),
    sy:      P("Pernos", "sy borde (m)", 0.07, 0.03, 0.20, 0.01),
    d_bolt:  P("Pernos", "Ø perno (m)", 0.024, 0.012, 0.040, 0.002),
    L_bolt:  P("Pernos", "L embebido (m)", 0.30, 0.15, 0.60, 0.02),
    L_proj:  P("Pernos", "L proyección (m)", 0.05, 0.02, 0.10, 0.005),
    B_ped:   P("Pedestal", "B pedestal (m)", 0.80, 0.40, 1.80, 0.05),
    H_ped:   P("Pedestal", "H pedestal (m)", 0.80, 0.40, 1.80, 0.05),
    h_ped:   P("Pedestal", "h pedestal (m)", 0.50, 0.30, 1.50, 0.05),
    fc:      P("Pedestal", "f'c (kN/m²)", 28000, 17000, 50000, 1000),
    Pu:      P("Cargas", "Pu axial (kN)", 300, 0, 5000, 25),
    Mx:      P("Cargas", "Mx (kN·m)", 20, 0, 500, 5),
    My:      P("Cargas", "My (kN·m)", 30, 0, 500, 5),
    nx:      P("Malla", "Malla nx", 10, 6, 20, 2),
    ny:      P("Malla", "Malla ny", 10, 6, 20, 2),
    nz_col:  P("Malla", "nz columna", 6, 4, 12, 2),
  },
  guide: [
    "Pu, Mx y My entran por la cabeza del tubo, repartidos por igual entre sus nudos",
    "Abre cortado por y = 0 para ver el tubo vacío: el corte se mueve en «✂️ Cortes X/Y/Z»",
    "La barra de von Mises toma el rango de la PLACA BASE (la cabeza del tubo se satura)",
    "En «📊 Calculados»: aplastamiento (AISC §J8), espesor (DG-1) y anclaje (ACI §17)",
  ],
  build: (params: Record<string, number>, states: BuildStates) => {
    const p = params as unknown as PlacaBaseHuecaParams;
    const malla = mallaPlacaBaseHueca(p);
    const { nodes, elements, nodeInputs, elementInputs, concreteShells } = malla;

    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
      analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
      for (const v of Object.values(analyzeOutputs as any))
        if (v instanceof Map) for (const i of concreteShells) v.delete(i);
    } catch (e: any) { console.warn("placa-base-hueca:", e?.message ?? e); }

    // σ von Mises máximo del acero (las caras del pedestal ya no tienen resultado)
    let vmMax = 0;
    const vmMap = (analyzeOutputs as any)?.vonMises as Map<number, number[]> | undefined;
    if (vmMap) vmMap.forEach(arr => arr.forEach(v => { if (v > vmMax) vmMax = v; }));

    // El rango «solo losas» de la página, fijado en el campo con que abre.
    const rango = rangoSoloLosas(nodes, elements, vmMap);
    if (rango) (analyzeOutputs as any).colorMapRanges = { ...(analyzeOutputs as any).colorMapRanges, vonMises: rango };

    ultimo = { malla, bench: comprobacionesPlacaBaseHueca(p, vmMax) };

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs;
    states.elementInputs.val = elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = decoradores(p, malla.boltPositions);

    cortarPorYCero();
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const v = ultimo.bench;
    return {
      "── Aplastamiento del hormigón (AISC 360-22 §J8) ──": "",
      "A1 (AISC §J8)": `${v.A1.toFixed(4)} m²`,
      "A2 (AISC §J8)": `${v.A2.toFixed(4)} m²`,
      "φPp (AISC §J8)": `${v.phiPp.toFixed(0)} kN`,
      "Aplastamiento Pu/φPp (AISC §J8)": ratioFmt(v.demandCapPp),
      "── Espesor de la placa (AISC Design Guide 1) ──": "",
      "m voladizo (DG-1)": `${v.m_cant.toFixed(4)} m`,
      "t requerido (DG-1)": `${(v.t_req * 1000).toFixed(1)} mm`,
      "Espesor t_req/t (DG-1)": ratioFmt(v.demandCapT),
      "── Tracción del anclaje (ACI 318-22 §17) ──": "",
      "T por perno (ACI 318 §17)": `${v.T_anchor.toFixed(1)} kN`,
      "φNn (ACI 318 §17)": `${v.phiNn.toFixed(1)} kN`,
      "Tracción del anclaje T/φNn (ACI 318 §17)": ratioFmt(v.demandCapAnchor),
      "── FEM ──": "",
      "σ von Mises máx del acero": `${v.vmMax.toExponential(3)} kN/m²`,
    };
  },
};
