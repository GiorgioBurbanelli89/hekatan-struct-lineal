/**
 * Placa Base + Columna HSS HUECA + Pernos de Anclaje (CBFEM-style).
 *
 * VERSIÓN HUECA = clon de placa-base-cft sin el concreto interior.
 * Diferencias vs placa-base-cft:
 *   - SIN concreto fill FEM dentro del HSS (columna metálica vacía)
 *   - SIN orificio circular en la placa (no hay continuidad concreto col↔pedestal)
 *   - SIN PLUG cilíndrico que conecta fill ↔ pedestal
 *   - SIN benchmark AISC §I2.1b composite (Pno = Fy·As + 0.85·fc·Ac no aplica)
 *   - SIN rebar longitudinal interior
 *
 * Componentes IDÉNTICOS a CFT:
 *   - Placa base (shell Q4 horizontal) ✓
 *   - Columna HSS rectangular hueca (4 paredes shell verticales) ✓
 *   - Cartelas (stiffeners) Q4 alrededor ✓
 *   - Pedestal de concreto sólido H8 (cara superficial Q4) ✓
 *   - Pernos de anclaje (frame elements + cilindros + tuercas) ✓
 *
 * Validación AISC §J8 + DG-1 + ACI 318 §17 (sin §I2.1b).
 */
import van, { State } from "vanjs-core";
import { Pane } from "tweakpane";
import * as THREE from "three";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import {
  getToolbar, getParameters, Parameters, getViewer,
  colorMapForceUnit, colorMapDispUnit, colorMapStressUnit, enableDraggableAllPanes,
} from "hekatan-ui";
import { ecHormigonACI } from "../shared/materials";

const Es = 200e6, nu_s = 0.3, Gs = Es / (2 * (1 + nu_s)), rho_s = 78;
const Fy_steel = 250000, fut_anchor = 600000;

const parameters: Parameters = {
  // Placa base
  B:        { value: van.state(0.50),  min: 0.30, max: 1.20, step: 0.02, label: "B placa (m)" },
  H:        { value: van.state(0.50),  min: 0.30, max: 1.20, step: 0.02, label: "H placa (m)" },
  t_plate:  { value: van.state(0.025), min: 0.012, max: 0.060, step: 0.002, label: "t placa (m)" },
  // Columna HSS hueca
  bc:       { value: van.state(0.30),  min: 0.20, max: 0.50, step: 0.02, label: "bc col (m)" },
  hc:       { value: van.state(0.30),  min: 0.20, max: 0.50, step: 0.02, label: "hc col (m)" },
  t_col:    { value: van.state(0.012), min: 0.006, max: 0.030, step: 0.002, label: "t pared HSS (m)" },
  L_col:    { value: van.state(0.50),  min: 0.30, max: 1.50, step: 0.05, label: "L stub col (m)" },
  // Pernos
  nBoltsX:  { value: van.state(2),     min: 2, max: 4, step: 1, label: "Pernos en X" },
  nBoltsY:  { value: van.state(2),     min: 2, max: 4, step: 1, label: "Pernos en Y" },
  sx:       { value: van.state(0.07),  min: 0.03, max: 0.20, step: 0.01, label: "sx borde (m)" },
  sy:       { value: van.state(0.07),  min: 0.03, max: 0.20, step: 0.01, label: "sy borde (m)" },
  d_bolt:   { value: van.state(0.024), min: 0.012, max: 0.040, step: 0.002, label: "Ø perno (m)" },
  L_bolt:   { value: van.state(0.30),  min: 0.15, max: 0.60, step: 0.02, label: "L embebido (m)" },
  L_proj:   { value: van.state(0.05),  min: 0.02, max: 0.10, step: 0.005, label: "L proyec (m)" },
  // Pedestal
  B_ped:    { value: van.state(0.80),  min: 0.40, max: 1.80, step: 0.05, label: "B pedestal (m)" },
  H_ped:    { value: van.state(0.80),  min: 0.40, max: 1.80, step: 0.05, label: "H pedestal (m)" },
  h_ped:    { value: van.state(0.50),  min: 0.30, max: 1.50, step: 0.05, label: "h pedestal (m)" },
  fc:       { value: van.state(28000), min: 17000, max: 50000, step: 1000, label: "f'c (kN/m²)" },
  // Cargas en cabeza columna (carga puntual axial + momentos biaxiales)
  Pu:       { value: van.state(300),   min: 0, max: 5000, step: 25, label: "Pu axial (kN)" },
  Mx:       { value: van.state(20),    min: 0, max: 500,  step: 5,  label: "Mx (kN·m)" },
  My:       { value: van.state(30),    min: 0, max: 500,  step: 5,  label: "My (kN·m)" },
  // Mesh
  nx:       { value: van.state(10),    min: 6, max: 20, step: 2, label: "Mesh nx" },
  ny:       { value: van.state(10),    min: 6, max: 20, step: 2, label: "Mesh ny" },
  nz_col:   { value: van.state(6),     min: 4, max: 12, step: 2, label: "nz col" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});
const objects3DState: State<THREE.Object3D[]>    = van.state([]);

const benchValues: State<{
  vmMax: number; A1: number; A2: number; phiPp: number; demandCapPp: number;
  m_cant: number; t_req: number; demandCapT: number;
  T_anchor: number; phiNn: number; demandCapAnchor: number;
}> = van.state({
  vmMax: 0, A1: 0, A2: 0, phiPp: 0, demandCapPp: 0,
  m_cant: 0, t_req: 0, demandCapT: 0,
  T_anchor: 0, phiNn: 0, demandCapAnchor: 0,
});

van.derive(() => {
  const B = parameters.B.value.val, H = parameters.H.value.val, t_plate = parameters.t_plate.value.val;
  const bc = parameters.bc.value.val, hc = parameters.hc.value.val, t_col = parameters.t_col.value.val;
  const L_col = parameters.L_col.value.val;
  const nBoltsX = Math.round(parameters.nBoltsX.value.val), nBoltsY = Math.round(parameters.nBoltsY.value.val);
  const sx = parameters.sx.value.val, sy = parameters.sy.value.val;
  const d_bolt = parameters.d_bolt.value.val, L_bolt = parameters.L_bolt.value.val, L_proj = parameters.L_proj.value.val;
  const B_ped = parameters.B_ped.value.val, H_ped = parameters.H_ped.value.val, h_ped = parameters.h_ped.value.val;
  const fc = parameters.fc.value.val;
  const Pu = parameters.Pu.value.val;
  const Mx = parameters.Mx.value.val;
  const My = parameters.My.value.val;
  const nx = Math.round(parameters.nx.value.val), ny = Math.round(parameters.ny.value.val);
  const nz_col = Math.round(parameters.nz_col.value.val);

  // GAP visible entre placa y pedestal — separación visual del contacto.
  const z_gap = 0.04;

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

  // ── PLACA BASE: grid nx × ny en plano XY z=z_gap (SIN orificio) ──
  // En la versión HUECA NO hay orificio circular central — la columna
  // descansa sobre la placa completa (típico para HSS soldada a placa base).
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

  // Snap a la placa
  function snapToPlate(x: number, y: number): number {
    let best = -1; let dmin = Infinity;
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const idx = plateGrid[j][i];
      const d = Math.hypot(nodes[idx][0]-x, nodes[idx][1]-y);
      if (d < dmin) { dmin = d; best = idx; }
    }
    return best;
  }

  // ── COLUMNA HSS HUECA: 4 paredes shell verticales (sin fill interior) ──
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

  // Cara x=-bc/2 (compartiendo nodos en aristas con paredes S y N)
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

  // ── CARTELAS (stiffeners) Q4 — IDÉNTICAS a CFT ──
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

  // ── PERNOS: grid nBoltsX × nBoltsY ──
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

  // ── PEDESTAL DE CONCRETO COMO SÓLIDO (caras Q4) ──
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

  // ── PERNOS DE ANCLAJE ──
  for (const [bx, by] of pendingBolts) {
    const nTop = addNode(bx, by, z_gap + L_proj);
    const nMid = snapToPlate(bx, by);
    const nBot = addNode(bx, by, z_gap - L_bolt);
    addFrame(nTop, nMid, A_bolt, I_bolt, J_bolt);
    addFrame(nMid, nBot, A_bolt, I_bolt, J_bolt);
  }

  // ── BCs: bolt nBot + pedestal bottom empotrados ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  nodes.forEach((p, id) => {
    const onBoltBot = Math.abs(p[2] - (z_gap - L_bolt)) < 1e-6 &&
                      boltPositions.some(([bx, by]) => Math.abs(p[0]-bx) < 1e-6 && Math.abs(p[1]-by) < 1e-6);
    const onPedBot = Math.abs(p[2] - (-h_ped)) < 1e-6;
    if (onBoltBot || onPedBot) supports.set(id, [true, true, true, true, true, true]);
  });

  // ── Cargas en top de columna ──
  const colTopNodes: number[] = [];
  nodes.forEach((p, id) => {
    if (Math.abs(p[2] - (z_gap + L_col)) < 1e-6 &&
        Math.abs(p[0]) <= bc / 2 + 1e-6 && Math.abs(p[1]) <= hc / 2 + 1e-6) {
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

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
  } catch (e: any) { console.warn("placa-base-hueca:", e?.message ?? e); }

  // ── 3D decoraciones: símbolos contacto + tuercas pernos ──
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
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geom, matContact);
    objs.push(line);
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
    const nutGeom = new THREE.CylinderGeometry(r_nut, r_nut, t_nut, 6);
    const nut = new THREE.Mesh(nutGeom, matNut);
    nut.position.set(bx, by, nutZ);
    nut.rotation.x = Math.PI / 2;
    objs.push(nut);
  }
  void fc;

  // ── BENCHMARK AISC §J8 + DG-1 + ACI §17 (sin §I2.1b composite) ──
  let vmMax = 0;
  const vmMap = (analyzeOutputs as any)?.vonMises as Map<number, number[]> | undefined;
  if (vmMap) vmMap.forEach(arr => arr.forEach(v => { if (v > vmMax) vmMax = v; }));

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

  benchValues.val = { vmMax, A1, A2, phiPp, demandCapPp, m_cant, t_req, demandCapT, T_anchor, phiNn, demandCapAnchor };

  nodesState.val = nodes;
  elementsState.val = elements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = elementInputs;
  deformOutputsState.val = deformOutputs;
  analyzeOutputsState.val = analyzeOutputs;
  objects3DState.val = objs;
});

const viewerEl = getViewer({
  mesh: {
    nodes: nodesState, elements: elementsState,
    nodeInputs: nodeInputsState, elementInputs: elementInputsState,
    deformOutputs: deformOutputsState, analyzeOutputs: analyzeOutputsState,
  },
  objects3D: objects3DState,
  settingsObj: {
    deformedShape: false, shellResults: "vonMises",
    gridSize: 1, deformScale: 1, custom3D: true,
    loads: true, supports: false, showCotas: false, displayScale: 0.15,
  },
});

const benchContainer = document.createElement("div");
benchContainer.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
const benchPane = new Pane({ title: "🧪 Placa base + col HSS hueca", container: benchContainer, expanded: true });
const benchObj = {
  vmMax: 0, A1: 0, A2: 0, phiPp: 0, demandCapPp: 0,
  m_cant: 0, t_req: 0, demandCapT: 0,
  T_anchor: 0, phiNn: 0, demandCapAnchor: 0,
};
const ratioFmt = (r: number) => r < 1 ? `${r.toFixed(2)} ✓` : r < 1.2 ? `${r.toFixed(2)} ⚠` : `${r.toFixed(2)} ✗`;

const fJ8 = benchPane.addFolder({ title: "AISC §J8 bearing concreto" });
fJ8.addBinding(benchObj, "A1",          { readonly: true, label: "A1 (m²)", format: (v: number) => v.toFixed(4) });
fJ8.addBinding(benchObj, "A2",          { readonly: true, label: "A2 (m²)", format: (v: number) => v.toFixed(4) });
fJ8.addBinding(benchObj, "phiPp",       { readonly: true, label: "φPp (kN)", format: (v: number) => v.toFixed(0) });
fJ8.addBinding(benchObj, "demandCapPp", { readonly: true, label: "Pu/φPp",   format: ratioFmt });

const fDG1 = benchPane.addFolder({ title: "DG-1 espesor placa" });
fDG1.addBinding(benchObj, "m_cant",     { readonly: true, label: "m cant (m)", format: (v: number) => v.toFixed(4) });
fDG1.addBinding(benchObj, "t_req",      { readonly: true, label: "t_req (mm)", format: (v: number) => (v*1000).toFixed(1) });
fDG1.addBinding(benchObj, "demandCapT", { readonly: true, label: "t_req/t_act", format: ratioFmt });

const fACI = benchPane.addFolder({ title: "ACI §17 anclaje" });
fACI.addBinding(benchObj, "T_anchor",       { readonly: true, label: "T (kN/perno)", format: (v: number) => v.toFixed(1) });
fACI.addBinding(benchObj, "phiNn",          { readonly: true, label: "φNn (kN)", format: (v: number) => v.toFixed(1) });
fACI.addBinding(benchObj, "demandCapAnchor",{ readonly: true, label: "T/φNn", format: ratioFmt });

const fH = benchPane.addFolder({ title: "FEM" });
fH.addBinding(benchObj, "vmMax", { readonly: true, label: "σ vM max (kN/m²)", format: (v: number) => v.toExponential(3) });

const fU = benchPane.addFolder({ title: "Unidades", expanded: false });
const unitsObj = { stress: colorMapStressUnit.val, disp: colorMapDispUnit.val };
fU.addBinding(unitsObj, "stress", { options: { "kN/m²":"kN/m²","MPa":"MPa","kgf/cm²":"kgf/cm²","ksi":"ksi" }, label: "σ" })
  .on("change", (e: any) => { colorMapStressUnit.val = e.value; });
fU.addBinding(unitsObj, "disp", { options: { m:"m",cm:"cm",mm:"mm" }, label: "u" })
  .on("change", (e: any) => { colorMapDispUnit.val = e.value; });
void colorMapForceUnit;

document.body.append(benchContainer);

van.derive(() => {
  const v = benchValues.val;
  Object.assign(benchObj, v);
  benchPane.refresh();
});

document.body.append(
  getParameters(parameters), viewerEl,
  getToolbar({ sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-base-hueca/main.ts" }),
);

setTimeout(() => enableDraggableAllPanes(), 200);
setTimeout(() => {
  const ctx = (viewerEl as any).__ctx;
  if (ctx?.camera && ctx?.controls) {
    ctx.camera.up.set(0, 0, 1);
    ctx.camera.position.set(1.5, -1.5, 2.0);
    ctx.controls.target.set(0, 0, 0.4);
    ctx.controls.update(); ctx.render?.();
  }
  // CORTE Y POR DEFECTO: abre el HSS por la mitad para mostrar el INTERIOR
  // VACÍO del tubo (no hay concreto fill) — clave didáctica para diferenciarlo
  // de placa-base-cft donde sí se ve concreto adentro.
  const cs = (window as any).__hekatanClip;
  const apply = (window as any).__hekatanClipApply;
  if (cs && apply) {
    cs.enableY = true;
    cs.posY = 0;
    cs.invertY = false;
    apply();
  }
}, 800);
