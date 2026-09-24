/**
 * Placa Base + Columna CFT (HSS rellena de concreto) + Pernos de Anclaje.
 *
 * Diferencias vs placa-base-hueca:
 *   - Concreto fill como THREE.Mesh visualmente (caja interior translúcida)
 *   - Benchmark adicional: AISC §I2.1b EI_eff y Pno composite
 *   - Capacidad axial Pno = Fy·As + 0.85·fc·Ac (mucho mayor que HSS hueco)
 *
 * (versión simple: el concreto NO se acopla al solver — sólo placa+HSS+pernos.
 * Para acoplamiento mixto Q4+H8 ver columna-cft-h8.)
 *
 * Placa Base + Columna HSS rellena de concreto + Pernos (CBFEM-style).
 *
 * Componentes:
 *   - Placa base (shell Q4 horizontal) con orificios en posiciones de pernos
 *   - Columna HSS rectangular hueca (4 paredes shell verticales soldadas a placa)
 *   - Pedestal de concreto (visualización THREE.Mesh)
 *   - Pernos de anclaje (frame elements + cilindros 3D + tuercas hexagonales)
 *
 * Validación AISC §J8 + DG-1 + ACI 318 §17 (igual que placa-base-h).
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
  // Orificio circular en placa (continuidad concreto col↔pedestal)
  d_hole:   { value: van.state(0.20),  min: 0.10, max: 0.40, step: 0.02, label: "Ø orificio placa (m)" },
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
  // Composite CFT (AISC §I2.1b)
  As: number; Ac: number; Pno_composite: number; demandCapPno: number;
}> = van.state({
  vmMax: 0, A1: 0, A2: 0, phiPp: 0, demandCapPp: 0,
  m_cant: 0, t_req: 0, demandCapT: 0,
  T_anchor: 0, phiNn: 0, demandCapAnchor: 0,
  As: 0, Ac: 0, Pno_composite: 0, demandCapPno: 0,
});

van.derive(() => {
  const B = parameters.B.value.val, H = parameters.H.value.val, t_plate = parameters.t_plate.value.val;
  const bc = parameters.bc.value.val, hc = parameters.hc.value.val, t_col = parameters.t_col.value.val;
  const L_col = parameters.L_col.value.val;
  const nBoltsX = Math.round(parameters.nBoltsX.value.val), nBoltsY = Math.round(parameters.nBoltsY.value.val);
  const sx = parameters.sx.value.val, sy = parameters.sy.value.val;
  const d_bolt = parameters.d_bolt.value.val, L_bolt = parameters.L_bolt.value.val, L_proj = parameters.L_proj.value.val;
  const d_hole = parameters.d_hole.value.val;
  const r_hole = d_hole / 2;
  const B_ped = parameters.B_ped.value.val, H_ped = parameters.H_ped.value.val, h_ped = parameters.h_ped.value.val;
  const fc = parameters.fc.value.val;
  const Pu = parameters.Pu.value.val;
  const Mx = parameters.Mx.value.val;
  const My = parameters.My.value.val;
  const nx = Math.round(parameters.nx.value.val), ny = Math.round(parameters.ny.value.val);
  const nz_col = Math.round(parameters.nz_col.value.val);

  // GAP visible entre placa y pedestal — separación visual del contacto.
  // La placa+col+pernos se elevan z_gap; el pedestal queda en z∈[-h_ped, 0].
  // El contacto se modela como anclaje exclusivo via pernos (nBot empotrado).
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

  // ── PLACA BASE: grid nx × ny en plano XY z=0 ──
  const dxp = B / nx, dyp = H / ny;
  const plateGrid: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    const row: number[] = [];
    for (let i = 0; i <= nx; i++) row.push(addNode(-B / 2 + i * dxp, -H / 2 + j * dyp, z_gap));
    plateGrid.push(row);
  }
  // Generar shells de la placa SALVO las celdas dentro del orificio circular
  // central (continuidad de concreto entre columna CFT y pedestal).
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const cx = -B/2 + (i + 0.5) * dxp;
      const cy = -H/2 + (j + 0.5) * dyp;
      if (Math.hypot(cx, cy) < r_hole) continue;  // dentro del orificio
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

  // ── COLUMNA HSS: 4 paredes shell verticales ──
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
      else if (iy === 0) row.push(wallS[iz][0]);  // arista compartida con wallS
      else if (iy === ny_col) row.push(wallN[iz][0]);  // arista con wallN
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

  // ── CONCRETO FILL DEL CFT como cuerpo FEM (Q4 boundary faces) ──
  // Cara inferior (k=0) del fill comparte nodos con la placa via snap
  // (contacto compresivo aproximado como shared nodes en linear FEA).
  // El plug que conecta fill ↔ pedestal vía orificio se genera DESPUÉS del
  // pedestal (necesita pedGrid declarado) — ver bloque "PLUG diferido" abajo.
  const Ec_fill = ecHormigonACI(fc / 1000);
  const nu_c_fill = 0.20;
  const Gc_fill = Ec_fill / (2 * (1 + nu_c_fill));
  // Fill ligeramente más pequeño que el interior HSS para que sea VISIBLE
  // (gap visual entre fill y HSS interior, simula la separación real con
  // recubrimiento aire/imperfección de colado).
  const gap_visual = 2 * t_col;
  const fill_bc = bc - 2 * t_col - gap_visual;
  const fill_hc = hc - 2 * t_col - gap_visual;
  const nx_fill = 4, ny_fill = 4, nz_fill = nz_col;
  const dxf = fill_bc / nx_fill, dyf = fill_hc / ny_fill, dzf = L_col / nz_fill;
  const inHole = (x: number, y: number) => Math.hypot(x, y) < r_hole + dxf * 0.5;

  const fillGrid: number[][][] = [];
  for (let k = 0; k <= nz_fill; k++) {
    const layer: number[][] = [];
    for (let j = 0; j <= ny_fill; j++) {
      const row: number[] = [];
      for (let i = 0; i <= nx_fill; i++) {
        const x = -fill_bc/2 + i*dxf;
        const y = -fill_hc/2 + j*dyf;
        const z = z_gap + t_plate + k*dzf;
        if (k === 0 && !inHole(x, y)) {
          row.push(snapToPlate(x, y));   // contacto placa fuera del hueco
        } else {
          row.push(addNode(x, y, z));    // libre o futuro plug-top dentro del hueco
        }
      }
      layer.push(row);
    }
    fillGrid.push(layer);
  }
  function addFillShell(n0: number, n1: number, n2: number, n3: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    thicknesses.set(i, 0.001);
    elasticities.set(i, Ec_fill); poissonsRatios.set(i, nu_c_fill);
    densities.set(i, 24/9.80665); shearModuli.set(i, Gc_fill);
    areas.set(i, 0); Iy.set(i, 0); Iz.set(i, 0); J.set(i, 0);
  }
  // 6 caras del fill: bottom + top + 4 laterales (cuerpo cerrado para visualizar).
  for (let j = 0; j < ny_fill; j++) for (let i = 0; i < nx_fill; i++) {
    addFillShell(fillGrid[0][j][i], fillGrid[0][j][i+1], fillGrid[0][j+1][i+1], fillGrid[0][j+1][i]);
    // Cara TOP del fill (z = z_gap+L_col) — visualiza el sólido concreto desde arriba
    addFillShell(fillGrid[nz_fill][j][i], fillGrid[nz_fill][j][i+1], fillGrid[nz_fill][j+1][i+1], fillGrid[nz_fill][j+1][i]);
  }
  for (let k = 0; k < nz_fill; k++) for (let i = 0; i < nx_fill; i++) {
    addFillShell(fillGrid[k][0][i], fillGrid[k][0][i+1], fillGrid[k+1][0][i+1], fillGrid[k+1][0][i]);
    addFillShell(fillGrid[k][ny_fill][i], fillGrid[k][ny_fill][i+1], fillGrid[k+1][ny_fill][i+1], fillGrid[k+1][ny_fill][i]);
  }
  for (let k = 0; k < nz_fill; k++) for (let j = 0; j < ny_fill; j++) {
    addFillShell(fillGrid[k][j][0], fillGrid[k][j+1][0], fillGrid[k+1][j+1][0], fillGrid[k+1][j][0]);
    addFillShell(fillGrid[k][j][nx_fill], fillGrid[k][j+1][nx_fill], fillGrid[k+1][j+1][nx_fill], fillGrid[k+1][j][nx_fill]);
  }

  // ── CARTELAS (stiffeners) como Q4 shells FEM ──
  // Triángulo: A=esquina col-placa, B=borde placa, C=top sobre col.
  // Q4 degenerada [A, B, C, C]. Comparte nodos con placa (snapToPlate)
  // y con paredes col (snap a fila inferior wall iz=0).
  const h_stiff_target = Math.min(0.20, L_col * 0.4);
  const w_stiff = Math.min(0.10, (B - bc) / 2 * 0.7);
  // h_stiff snap al z más cercano de la columna
  const k_stiff = Math.max(1, Math.round(h_stiff_target / dz_c));
  const h_stiff = k_stiff * dz_c;

  function addStiffenerShell(
    facePos: [number, number],   // (x, y) de la esquina sobre col-placa
    outDir: [number, number],    // dirección hacia afuera (unit)
    wallGrid: number[][],        // grid de la pared, fila iz=0 sobre placa
    iWall: number,               // índice en la fila iz=0 que coincide con facePos
  ) {
    const [fx, fy] = facePos;
    const [ox, oy] = outDir;
    // A: esquina inferior interior — del wall en iz=0 (snap)
    const nA = wallGrid[0][iWall];
    // B: borde placa hacia afuera (snap a placa)
    const nB = snapToPlate(fx + ox * w_stiff, fy + oy * w_stiff);
    // C: arriba sobre col, mismo i (snap a wall en iz=k_stiff)
    const nC = wallGrid[Math.min(k_stiff, wallGrid.length - 1)][iWall];
    // Q4 degenerada
    addShell(nA, nB, nC, nC, t_col);
  }
  // Cara +Y (front, wallN): centro x=0 → iWall en mitad de fila
  // 2 cartelas por cara × 4 caras = 8 stiffeners (estilo ABAQUS reference).
  // Offset desde el centro: índices ~1/4 y ~3/4 de la longitud de la pared.
  const oN = Math.max(1, Math.round(nx_col * 0.25));   // offset Y-faces
  const oE = Math.max(1, Math.round(ny_col * 0.25));   // offset X-faces
  const i1N = Math.round(nx_col / 2) - oN, i2N = Math.round(nx_col / 2) + oN;
  const i1E = Math.round(ny_col / 2) - oE, i2E = Math.round(ny_col / 2) + oE;
  // Cara +Y (wallN): 2 stiffeners offset
  const x1N = -bc/2 + i1N * dx_c, x2N = -bc/2 + i2N * dx_c;
  addStiffenerShell([x1N, hc/2], [0, 1], wallN, i1N);
  addStiffenerShell([x2N, hc/2], [0, 1], wallN, i2N);
  // Cara -Y (wallS)
  addStiffenerShell([x1N, -hc/2], [0, -1], wallS, i1N);
  addStiffenerShell([x2N, -hc/2], [0, -1], wallS, i2N);
  // Cara +X (wallE): 2 stiffeners
  const y1E = -hc/2 + i1E * dy_c, y2E = -hc/2 + i2E * dy_c;
  addStiffenerShell([bc/2, y1E], [1, 0], wallE, i1E);
  addStiffenerShell([bc/2, y2E], [1, 0], wallE, i2E);
  // Cara -X (wallW)
  addStiffenerShell([-bc/2, y1E], [-1, 0], wallW, i1E);
  addStiffenerShell([-bc/2, y2E], [-1, 0], wallW, i2E);

  // ── PERNOS: grid nBoltsX × nBoltsY, frame elements ──
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
      // Skip si está adentro de la columna HSS
      if (Math.abs(bx) < bc / 2 + 0.005 && Math.abs(by) < hc / 2 + 0.005) continue;
      boltPositions.push([bx, by]);
    }
  }
  // Para cada perno (creado DESPUÉS del pedestal para poder snap a éste):
  //   nTop (z=L_proj)        → tuerca, nodo libre
  //   nMid (z=0)             → snap a placa (penetra placa)
  //   nBot (z=-L_bolt)       → snap a nodo interior del pedestal H8 (embebido)
  // Los pernos se conectan al pedestal SOLO por embebido (shared node).
  // Nota: este block se ejecuta DESPUÉS de generar el grid del pedestal.
  const pendingBolts: [number, number][] = [...boltPositions];

  // ── PEDESTAL DE CONCRETO COMO SÓLIDO H8 ──
  // Conexiones físicas con el resto del modelo:
  //   1) CONTACTO con la placa base: nodos de la cara top dentro del footprint
  //      de la placa hacen snap a los nodos de la placa (compresión + adherencia
  //      simplificada). Sin este contacto la placa flota y la deformada se
  //      vuelve inestable bajo Mx+My.
  //   2) EMBEBIDO de pernos: cada bolt nBot snap a nodo interior del pedestal.
  const Ec = ecHormigonACI(fc / 1000);
  const nu_c = 0.20;
  const Gc = Ec / (2 * (1 + nu_c));
  const nx_p = 10, ny_p = 10, nz_p = 6;
  const dxp_e = B_ped / nx_p, dyp_e = H_ped / ny_p, dzp_e = h_ped / nz_p;

  // Lista placa para snap-to-placa en cara top del pedestal
  const placaNodeList: { id: number; x: number; y: number }[] = [];
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
    const id = plateGrid[j][i];
    placaNodeList.push({ id, x: nodes[id][0], y: nodes[id][1] });
  }

  // Pedestal independiente — no snap a placa (placa ahora está en z=z_gap,
  // separada del pedestal top z=0 por el gap visible). Anclaje vía pernos.
  void placaNodeList;
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
  // Función para EMBEBER un perno en el pedestal: encuentra el nodo del
  // pedestal H8 más cercano a (x, y, z) y devuelve su ID.
  function snapToPedestal(x: number, y: number, z: number): number {
    let best = -1; let dmin = Infinity;
    for (let k = 0; k <= nz_p; k++) for (let j = 0; j <= ny_p; j++) for (let i = 0; i <= nx_p; i++) {
      const id = pedGrid[k][j][i];
      const p = nodes[id];
      const d = Math.hypot(p[0]-x, p[1]-y) + Math.abs(p[2]-z) * 0.5;
      if (d < dmin) { dmin = d; best = id; }
    }
    return best;
  }
  // Generar caras boundary del hex (no duplicadas) → Q4 shells con concreto
  // Caras: bottom (k=0), top (k=nz_p), 4 laterales
  function addPedShell(n0: number, n1: number, n2: number, n3: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    thicknesses.set(i, 0.001);   // muy delgado (visual only)
    elasticities.set(i, Ec);
    poissonsRatios.set(i, nu_c);
    densities.set(i, 24 / 9.80665);
    shearModuli.set(i, Gc);
    areas.set(i, 0); Iy.set(i, 0); Iz.set(i, 0); J.set(i, 0);
  }
  // Bottom (k=0) — cara completa
  for (let j = 0; j < ny_p; j++) for (let i = 0; i < nx_p; i++)
    addPedShell(pedGrid[0][j][i], pedGrid[0][j][i+1], pedGrid[0][j+1][i+1], pedGrid[0][j+1][i]);
  // Top (k=nz_p) — cara COMPLETA. La placa está separada por z_gap arriba,
  // ya no hay overlap. Solo omitimos pequeñas celdas en posiciones de pernos
  // (donde los pernos atraviesan el pedestal para embeberse adentro).
  function cellAtBoltPosition(cx: number, cy: number): boolean {
    for (const [bx, by] of boltPositions) {
      if (Math.hypot(cx - bx, cy - by) < dxp_e * 0.6) return true;
    }
    return false;
  }
  for (let j = 0; j < ny_p; j++) for (let i = 0; i < nx_p; i++) {
    const cx = -B_ped/2 + (i + 0.5) * dxp_e;
    const cy = -H_ped/2 + (j + 0.5) * dyp_e;
    if (cellAtBoltPosition(cx, cy)) continue;  // pequeño hueco solo en posición perno
    addPedShell(pedGrid[nz_p][j][i], pedGrid[nz_p][j][i+1], pedGrid[nz_p][j+1][i+1], pedGrid[nz_p][j+1][i]);
  }
  // Lateral y=-H_ped/2 (j=0)
  for (let k = 0; k < nz_p; k++) for (let i = 0; i < nx_p; i++)
    addPedShell(pedGrid[k][0][i], pedGrid[k][0][i+1], pedGrid[k+1][0][i+1], pedGrid[k+1][0][i]);
  // Lateral y=+H_ped/2 (j=ny_p)
  for (let k = 0; k < nz_p; k++) for (let i = 0; i < nx_p; i++)
    addPedShell(pedGrid[k][ny_p][i], pedGrid[k][ny_p][i+1], pedGrid[k+1][ny_p][i+1], pedGrid[k+1][ny_p][i]);
  // Lateral x=-B_ped/2 (i=0)
  for (let k = 0; k < nz_p; k++) for (let j = 0; j < ny_p; j++)
    addPedShell(pedGrid[k][j][0], pedGrid[k][j+1][0], pedGrid[k+1][j+1][0], pedGrid[k+1][j][0]);
  // Lateral x=+B_ped/2 (i=nx_p)
  for (let k = 0; k < nz_p; k++) for (let j = 0; j < ny_p; j++)
    addPedShell(pedGrid[k][j][nx_p], pedGrid[k][j+1][nx_p], pedGrid[k+1][j+1][nx_p], pedGrid[k+1][j][nx_p]);

  // ── PLUG diferido: cuerpo de concreto cilíndrico que cruza el orificio ──
  // Pedestal ya está creado (pedGrid disponible). Para cada nodo del fill_bottom
  // dentro del hueco, generar columna vertical hasta el pedestal top (snap).
  function snapToPedTop(x: number, y: number): number {
    let best = -1; let dmin = Infinity;
    for (let j = 0; j <= ny_p; j++) for (let i = 0; i <= nx_p; i++) {
      const id = pedGrid[nz_p][j][i];
      const p = nodes[id];
      const d = Math.hypot(p[0]-x, p[1]-y);
      if (d < dmin) { dmin = d; best = id; }
    }
    return best;
  }
  type PlugPt = { idTop: number; idBot: number; x: number; y: number };
  const plugMap = new Map<string, PlugPt>();
  for (let j = 0; j <= ny_fill; j++) {
    for (let i = 0; i <= nx_fill; i++) {
      const x = -fill_bc/2 + i*dxf;
      const y = -fill_hc/2 + j*dyf;
      if (!inHole(x, y)) continue;
      plugMap.set(`${i},${j}`, { idTop: fillGrid[0][j][i], idBot: snapToPedTop(x, y), x, y });
    }
  }
  // Mantos del plug: 4 caras laterales por cada celda del fill grid donde
  // los 4 vértices son del plug. Caras top y bottom del plug.
  const getPlug = (i: number, j: number) => plugMap.get(`${i},${j}`) ?? null;
  for (let j = 0; j < ny_fill; j++) {
    for (let i = 0; i < nx_fill; i++) {
      const p00 = getPlug(i, j),     p10 = getPlug(i+1, j);
      const p01 = getPlug(i, j+1),   p11 = getPlug(i+1, j+1);
      if (!p00 || !p10 || !p01 || !p11) continue;
      // Caras top y bottom del cilindro (concreto del orificio)
      addFillShell(p00.idTop, p10.idTop, p11.idTop, p01.idTop);
      addFillShell(p00.idBot, p10.idBot, p11.idBot, p01.idBot);
      // Caras laterales solo en el contorno del plug
      if (!getPlug(i-1, j) || !getPlug(i-1, j+1)) addFillShell(p00.idBot, p00.idTop, p01.idTop, p01.idBot);
      if (!getPlug(i+2, j) || !getPlug(i+2, j+1)) addFillShell(p10.idBot, p11.idBot, p11.idTop, p10.idTop);
      if (!getPlug(i, j-1) || !getPlug(i+1, j-1)) addFillShell(p00.idBot, p10.idBot, p10.idTop, p00.idTop);
      if (!getPlug(i, j+2) || !getPlug(i+1, j+2)) addFillShell(p01.idBot, p01.idTop, p11.idTop, p11.idBot);
    }
  }

  // ── PERNOS DE ANCLAJE (frames) — empotrados en su nBot Y embebidos visualmente ──
  // nTop (z=L_proj, tuerca) → nMid (z=0, placa) → nBot (z=-L_bolt, empotrado)
  // El nBot es nodo PROPIO del perno empotrado al suelo (estabiliza el sistema
  // independientemente del pedestal). Visualmente queda embebido en el pedestal.
  for (const [bx, by] of pendingBolts) {
    const nTop = addNode(bx, by, z_gap + L_proj);
    const nMid = snapToPlate(bx, by);
    const nBot = addNode(bx, by, z_gap - L_bolt);
    addFrame(nTop, nMid, A_bolt, I_bolt, J_bolt);
    addFrame(nMid, nBot, A_bolt, I_bolt, J_bolt);
  }
  void snapToPedestal;  // mantener helper por si se usa en el futuro

  // ── CONCRETO FILL DEL CFT (visualización THREE.Mesh translúcido) ──
  // El fill como sólido FEM independiente generaba inestabilidad numérica
  // (nodos sin conectividad rígida con HSS+placa). Por simplicidad lo
  // representamos como mesh decorativo. La capacidad composite ya está
  // contemplada en el benchmark AISC §I2.1b (Pno = Fy·As + 0.85·fc·Ac).

  // ── BCs: AMBAS bases empotradas para máxima estabilidad numérica ──
  //   - Bolt nBot (z=-L_bolt): empotramiento de pernos
  //   - Pedestal bottom (z=-h_ped): empotramiento del bloque concreto
  // El pedestal contacta con la placa via shared nodes (snap top→placa).
  // Los pernos son elementos paralelos que también empotran. Sistema estable.
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
  // Cargas en cabeza columna distribuidas en N nodos del top:
  //   - Pu axial (-Z): repartida como fz = -Pu/N por nodo (sum total = -Pu)
  //   - Mx (sobre eje X): repartida como mx = Mx/N por nodo
  //   - My (sobre eje Y): repartida como my = My/N por nodo
  // Todos VALORES REALES (sum total = Pu, Mx, My definidos por usuario).
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

  // ── 3D decoraciones: placa base destacada + concreto fill CFT + tuercas ──
  const objs: THREE.Object3D[] = [];
  // PLACA BASE como BoxGeometry destacada (acero gris) sobre el pedestal,
  // de espesor t_plate y dimensiones B×H. Esto la hace visible como contacto
  // entre columna y pedestal (la shell FEM es muy delgada para verse sola).
  // SÍMBOLOS DE CONTACTO: pequeños resortes zigzag entre placa (z=z_gap) y
  // pedestal (z=0) en las esquinas y centro de la placa, para indicar
  // visualmente que es un CONTACTO compresivo (no soldadura).
  const matContact = new THREE.LineBasicMaterial({ color: 0xffaa00 });
  function addContactSymbol(cx: number, cy: number) {
    const N = 5;  // numero de zigzags
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= N * 2; i++) {
      const t = i / (N * 2);
      const z = z_gap * (1 - t);  // de z=z_gap (placa) a z=0 (pedestal)
      const dx = (i % 2 === 0) ? 0 : 0.008;
      pts.push(new THREE.Vector3(cx + dx, cy, z));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geom, matContact);
    objs.push(line);
  }
  // 4 esquinas + centro de la placa
  addContactSymbol(B/2 - 0.04, H/2 - 0.04);
  addContactSymbol(-B/2 + 0.04, H/2 - 0.04);
  addContactSymbol(B/2 - 0.04, -H/2 + 0.04);
  addContactSymbol(-B/2 + 0.04, -H/2 + 0.04);
  addContactSymbol(0, 0);

  // (Placa decorativa removida — la placa FEM Q4 ya se ve con vonMises).

  // CARTELAS (stiffeners) Q4 SHELLS — mallado FEM real, refuerzo AISC.
  // Triángulo modelado como Q4 degenerada [A, B, C, C] (top-inner colapsado).
  // 4 cartelas, una por cara del HSS, vertical hacia afuera del centroide.

  // REBAR longitudinal (4 barras Ø1/2" en esquinas del fill concreto)
  const matRebar = new THREE.MeshStandardMaterial({ color: 0x884422, roughness: 0.6 });
  const d_rebar = 0.012;
  const cover = 0.025;
  const rx = bc/2 - t_col - cover;
  const ry = hc/2 - t_col - cover;
  for (const [bx, by] of [[rx, ry], [-rx, ry], [rx, -ry], [-rx, -ry]] as [number, number][]) {
    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(d_rebar/2, d_rebar/2, L_col, 8), matRebar);
    bar.position.set(bx, by, z_gap + L_col / 2 + t_plate);
    bar.rotation.x = Math.PI / 2;
    objs.push(bar);
  }

  // CONCRETO ahora es FEM real (Q4 boundary faces de plug + fill arriba) —
  // se ve con vonMises colormap como los demás elementos. Eliminamos el
  // THREE.Mesh translúcido que antes tapaba la malla FEM.
  const matBolt = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5 });
  const matNut  = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.3 });
  const t_nut = d_bolt * 0.8;       // espesor tuerca ≈ 0.8·Ø (típico ASTM)
  const r_nut = d_bolt * 0.85;      // radio across flats ≈ 1.7·Ø
  const nutZ = z_gap + L_proj + t_nut / 2;  // tuerca encima de la proyección
  for (const [bx, by] of boltPositions) {
    // Cilindro vástago perno (penetra placa y baja al pedestal)
    const geom = new THREE.CylinderGeometry(d_bolt/2, d_bolt/2, L_bolt + L_proj, 12);
    const m = new THREE.Mesh(geom, matBolt);
    m.position.set(bx, by, z_gap + (-L_bolt + L_proj) / 2);
    m.rotation.x = Math.PI / 2;
    objs.push(m);
    // Tuerca hexagonal en el top (CylinderGeometry con 6 lados = hexágono)
    const nutGeom = new THREE.CylinderGeometry(r_nut, r_nut, t_nut, 6);
    const nut = new THREE.Mesh(nutGeom, matNut);
    nut.position.set(bx, by, nutZ);
    nut.rotation.x = Math.PI / 2;
    objs.push(nut);
  }
  void fc;

  // ── BENCHMARK AISC §J8 + DG-1 + ACI §17 ──
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
  // Momento resultante biaxial M = √(Mx² + My²) — usado para tracción anclaje
  const M_resultant = Math.sqrt(Mx * Mx + My * My);
  const T_total = Math.max(0, M_resultant / arm - Pu / 2);
  const T_anchor = T_total / Math.max(1, nBoltsY);
  const A_se = 0.75 * Math.PI * d_bolt * d_bolt / 4;
  const phiNn = 0.75 * A_se * fut_anchor;
  const demandCapAnchor = T_anchor / Math.max(1, phiNn);

  // ── Composite CFT (AISC 360-22 §I2.1b) ──
  // As = anillo HSS, Ac = interior concreto
  const Atot_col = bc * hc;
  const Ac_cft = (bc - 2 * t_col) * (hc - 2 * t_col);
  const As_cft = Atot_col - Ac_cft;
  const Fy_hss = 350000; // 350 MPa A500 Gr.C
  // Pno = Fy·As + 0.85·fc·Ac (compact, eq I2-9a)
  const Pno_composite = Fy_hss * As_cft + 0.85 * fc * Ac_cft;
  const phiPno = 0.75 * Pno_composite;
  const demandCapPno = Pu / Math.max(1, phiPno);

  benchValues.val = { vmMax, A1, A2, phiPp, demandCapPp, m_cant, t_req, demandCapT, T_anchor, phiNn, demandCapAnchor,
                       As: As_cft, Ac: Ac_cft, Pno_composite, demandCapPno };

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
    // deformedShape off por defecto (las amplificaciones generaban "líneas
    // tomate" confusas). Supports SI activos en la base del pedestal —
    // displayScale chico para que los markers no saturen visualmente.
    deformedShape: false, shellResults: "vonMises",
    gridSize: 1, deformScale: 1, custom3D: true,
    loads: true, supports: false, showCotas: false, displayScale: 0.15,
  },
});

const benchContainer = document.createElement("div");
benchContainer.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
const benchPane = new Pane({ title: "🧪 Placa base + col CFT", container: benchContainer, expanded: true });
const benchObj = {
  vmMax: 0, A1: 0, A2: 0, phiPp: 0, demandCapPp: 0,
  m_cant: 0, t_req: 0, demandCapT: 0,
  T_anchor: 0, phiNn: 0, demandCapAnchor: 0,
  As: 0, Ac: 0, Pno_composite: 0, demandCapPno: 0,
};
const ratioFmt = (r: number) => r < 1 ? `${r.toFixed(2)} ✓` : r < 1.2 ? `${r.toFixed(2)} ⚠` : `${r.toFixed(2)} ✗`;

const fI2 = benchPane.addFolder({ title: "AISC §I2.1b composite CFT" });
fI2.addBinding(benchObj, "As",            { readonly: true, label: "As acero (m²)", format: (v: number) => v.toExponential(3) });
fI2.addBinding(benchObj, "Ac",            { readonly: true, label: "Ac concreto (m²)", format: (v: number) => v.toExponential(3) });
fI2.addBinding(benchObj, "Pno_composite", { readonly: true, label: "Pno (kN)", format: (v: number) => v.toFixed(0) });
fI2.addBinding(benchObj, "demandCapPno",  { readonly: true, label: "Pu/φPno", format: ratioFmt });

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
  getToolbar({ sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-base-cft/main.ts" }),
);

setTimeout(() => enableDraggableAllPanes(), 200);
setTimeout(() => {
  const ctx = (viewerEl as any).__ctx;
  if (ctx?.camera && ctx?.controls) {
    ctx.camera.up.set(0, 0, 1);
    // Vista alta tilted (3/4 desde arriba) para ver: pedestal + placa +
    // HSS + fill concreto VISIBLE en el top abierto del HSS.
    ctx.camera.position.set(1.5, -1.5, 2.0);
    ctx.controls.target.set(0, 0, 0.4);
    ctx.controls.update(); ctx.render?.();
  }
  // CORTE Y POR DEFECTO: abre el HSS por la mitad para EXPONER el concreto FILL
  // como sólido FEM. Sin esto el tubo exterior tapa el cuerpo Q4 boundary del concreto.
  const cs = (window as any).__hekatanClip;
  const apply = (window as any).__hekatanClipApply;
  if (cs && apply) {
    cs.enableY = true;
    cs.posY = 0;
    cs.invertY = false;
    apply();
  }
}, 800);
