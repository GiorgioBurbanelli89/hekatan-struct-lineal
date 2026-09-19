/**
 * Placa Base anclada con Columna H (W-shape) — estilo IDEA StatiCa CBFEM.
 *
 * Componentes modelados:
 *   - Placa base (shell Q4 horizontal)
 *   - Columna H (3 piezas shell: patín frontal, patín trasero, alma)
 *   - 4 pernos de anclaje (frame elements verticales) con apoyos empotrados
 *     en su extremo inferior (representan el embebimiento al pedestal)
 *
 * Cargas: axial compresión Pu (kN) + momento Mu (kN·m) aplicados en el top
 * de la columna stub.
 *
 * Patron de ejemplo con panel propio: todo en main.ts (parametros + geometria + viewer).
 *
 * Referencias normativas:
 *   - AISC 360-22 §J8 (column base plates)
 *   - ACI 318-22 §17 (anchor bolt design)
 *   - IDEA StatiCa CBFEM methodology (visual reference)
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";
import * as THREE from "three";
import { ecHormigonACI } from "../shared/materials";

// Material acero (kN/m², kN/m³)
const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;

const parameters: Parameters = {
  // ── Placa base ──
  B:        { value: van.state(0.50),  min: 0.25, max: 1.20, step: 0.02, label: "B placa (m, eje X)" },
  H:        { value: van.state(0.50),  min: 0.25, max: 1.20, step: 0.02, label: "H placa (m, eje Y)" },
  t_plate:  { value: van.state(0.025), min: 0.012, max: 0.060, step: 0.002, label: "Espesor placa (m)" },
  // ── Columna H (W-shape) ──
  d_col:    { value: van.state(0.30),  min: 0.18, max: 0.50, step: 0.02, label: "d columna (m)" },
  bf_col:   { value: van.state(0.25),  min: 0.15, max: 0.40, step: 0.01, label: "bf columna (m)" },
  tf_col:   { value: van.state(0.022), min: 0.012, max: 0.040, step: 0.002, label: "tf patín (m)" },
  tw_col:   { value: van.state(0.014), min: 0.008, max: 0.025, step: 0.001, label: "tw alma (m)" },
  L_col:    { value: van.state(0.50),  min: 0.30, max: 1.50, step: 0.05, label: "L stub columna (m)" },
  // ── Pernos de anclaje (grid nBoltsX × nBoltsY con dist al borde sx, sy) ──
  nBoltsX:  { value: van.state(2),     min: 2,    max: 6,    step: 1,    label: "Pernos en X (filas)" },
  nBoltsY:  { value: van.state(2),     min: 2,    max: 6,    step: 1,    label: "Pernos en Y (columnas)" },
  sx:       { value: van.state(0.07),  min: 0.03, max: 0.25, step: 0.01, label: "sx — dist borde X (m)" },
  sy:       { value: van.state(0.07),  min: 0.03, max: 0.25, step: 0.01, label: "sy — dist borde Y (m)" },
  d_bolt:   { value: van.state(0.024), min: 0.012, max: 0.050, step: 0.002, label: "Ø perno (m)" },
  L_bolt:   { value: van.state(0.30),  min: 0.15, max: 0.60, step: 0.02, label: "L embebido (m)" },
  L_proj:   { value: van.state(0.05),  min: 0.02, max: 0.15, step: 0.005, label: "L proyección sobre placa (m, tuerca)" },
  // ── Pedestal de concreto ──
  B_ped:    { value: van.state(0.80),  min: 0.40, max: 1.80, step: 0.05, label: "B pedestal (m)" },
  H_ped:    { value: van.state(0.80),  min: 0.40, max: 1.80, step: 0.05, label: "H pedestal (m)" },
  h_ped:    { value: van.state(0.50),  min: 0.30, max: 1.50, step: 0.05, label: "h pedestal (m, profundidad)" },
  fc:       { value: van.state(28000), min: 17000, max: 50000, step: 1000, label: "f'c concreto (kN/m²)" },
  // ── Cargas (defaults moderados — la placa de 25mm con Fy=250 MPa apenas plastifica con Pu=300 kN, Mu=30 kN·m) ──
  Pu:       { value: van.state(300),   min: 0,    max: 5000, step: 25,   label: "Pu compresión (kN)" },
  Mu:       { value: van.state(30),    min: 0,    max: 800,  step: 5,    label: "Mu momento (kN·m)" },
  // ── Malla ──
  nx:       { value: van.state(12),    min: 6,    max: 24,   step: 2,    label: "Mesh nx (placa)" },
  ny:       { value: van.state(12),    min: 6,    max: 24,   step: 2,    label: "Mesh ny (placa)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});
// Decoradores 3D: orificios en la placa, tuercas/cabeza de pernos
const objects3DState: State<THREE.Object3D[]>    = van.state([]);

// ── Live benchmark: AISC §J8 + ACI 318 §17 numérico ──
const Fy_steel = 250000;     // kN/m² (Fy = 250 MPa, A36/A992 base plate típica)
const fut_anchor = 600000;   // kN/m² (F1554 Gr.36 → fut ≈ 600 MPa nominal)
const benchValues: State<{
  // FEM stress
  vmMax: number;
  // AISC §J8 bearing (concrete)
  A1: number; A2: number; sqrtA2A1: number;
  phiPp: number; demandCapPp: number;
  // Plate flexural yielding (DG-1)
  m_cantilever: number; fp: number;
  t_req: number; t_actual: number; demandCapT: number;
  // ACI 318 §17 anchor tension
  T_anchor: number; phiNn: number; demandCapAnchor: number;
}> = van.state({
  vmMax: 0,
  A1: 0, A2: 0, sqrtA2A1: 0, phiPp: 0, demandCapPp: 0,
  m_cantilever: 0, fp: 0, t_req: 0, t_actual: 0, demandCapT: 0,
  T_anchor: 0, phiNn: 0, demandCapAnchor: 0,
});

van.derive(() => {
  const B = parameters.B.value.val;
  const H = parameters.H.value.val;
  const t_plate = parameters.t_plate.value.val;
  const d_col = parameters.d_col.value.val;
  const bf_col = parameters.bf_col.value.val;
  const tf_col = parameters.tf_col.value.val;
  const tw_col = parameters.tw_col.value.val;
  const L_col = parameters.L_col.value.val;
  const d_bolt = parameters.d_bolt.value.val;
  const L_bolt = parameters.L_bolt.value.val;
  const L_proj = parameters.L_proj.value.val;
  const B_ped = parameters.B_ped.value.val;
  const H_ped = parameters.H_ped.value.val;
  const h_ped = parameters.h_ped.value.val;
  const fc = parameters.fc.value.val;
  const sx = parameters.sx.value.val;
  const sy = parameters.sy.value.val;
  const nBoltsX = Math.max(2, Math.round(parameters.nBoltsX.value.val));
  const nBoltsY = Math.max(2, Math.round(parameters.nBoltsY.value.val));
  const Pu = parameters.Pu.value.val;
  const Mu = parameters.Mu.value.val;
  const nx = Math.round(parameters.nx.value.val);
  const ny = Math.round(parameters.ny.value.val);

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

  // ── 1. PLACA BASE (Q4 mesh nx × ny) ──
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

  // Helper: encontrar nodo del grid de placa más cercano a (x, y)
  function snapToPlate(x: number, y: number): number {
    let best = -1;
    let dmin = Infinity;
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const idx = plateGrid[j][i];
        const [nx_, ny_, nz_] = nodes[idx];
        const d = Math.hypot(nx_ - x, ny_ - y);
        if (d < dmin) { dmin = d; best = idx; }
      }
    }
    return best;
  }

  // ── 2. COLUMNA H (3 piezas shell SOLDADAS) ──
  // Patín frontal en x=+d_col/2, patín trasero en x=-d_col/2, alma en plano XZ con y=0
  // CLAVE: el alma comparte nodos con los patines en su punto medio (y=0)
  // → simula la soldadura física entre alma y patines.
  // nyFlange debe ser PAR para tener un nodo exacto en y=0 (middle).
  const nzCol = 6;
  const nyFlange = 4;          // par → middle iy = nyFlange/2 = 2
  const nxWeb = 3;
  const flangeMidIy = nyFlange / 2;

  const xF = +d_col / 2 - tf_col / 2;
  const xB = -d_col / 2 + tf_col / 2;

  // Patín frontal grid (z, y)
  const frontGrid: number[][] = [];
  for (let iz = 0; iz <= nzCol; iz++) {
    const z = (iz / nzCol) * L_col + 0; // desde top placa hacia arriba
    const row: number[] = [];
    for (let iy = 0; iy <= nyFlange; iy++) {
      const y = -bf_col / 2 + (iy * bf_col) / nyFlange;
      // Nivel z=0: snap al grid de la placa
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

  // Alma (plano XZ con y=0, espesor tw_col)
  // SOLDADURA: el alma comparte nodos con los patines en y=0 (su línea media)
  //   - ix=0      → mismo nodo que back flange en iy=flangeMidIy
  //   - ix=nxWeb  → mismo nodo que front flange en iy=flangeMidIy
  // Esto crea continuidad estructural simulando la soldadura física.
  const webGrid: number[][] = [];
  for (let iz = 0; iz <= nzCol; iz++) {
    const z = (iz / nzCol) * L_col;
    const row: number[] = [];
    for (let ix = 0; ix <= nxWeb; ix++) {
      const x = xB + (ix * (xF - xB)) / nxWeb;
      if (ix === 0) {
        // SOLDADURA con patín trasero (compartir nodo middle)
        row.push(backGrid[iz][flangeMidIy]);
      } else if (ix === nxWeb) {
        // SOLDADURA con patín frontal (compartir nodo middle)
        row.push(frontGrid[iz][flangeMidIy]);
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

  // ── 3. PERNOS DE ANCLAJE (grid nBoltsX × nBoltsY) ──
  // Empotrados en el extremo inferior (z = -L_bolt, simulan el embebido al pedestal).
  // Distribuidos en grid uniforme dentro del rectángulo (B−2·edge) × (H−2·edge),
  // con los pernos extremos en las esquinas a edge del borde.
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
      // Saltar los pernos que caen DENTRO del footprint de la columna H
      // (donde alma o patines ocupan el espacio físicamente)
      const insideColX = Math.abs(bx) < d_col / 2 + 0.005;
      const insideColY = Math.abs(by) < bf_col / 2 + 0.005;
      if (insideColX && insideColY) continue;
      boltPositions.push([bx, by]);
    }
  }

  const boltAnchorIds: number[] = [];   // nodos al fondo (z=-L_bolt) — se empotran
  const boltPlateIds: number[] = [];    // nodos en la placa (z=0, donde está el orificio)
  const boltProjIds: number[] = [];     // nodos arriba (z=+L_proj, donde va la tuerca)

  for (const [bx, by] of boltPositions) {
    const plateNode = snapToPlate(bx, by);
    const anchorNode = addNode(bx, by, -L_bolt);
    const projNode = addNode(bx, by, L_proj);
    boltPlateIds.push(plateNode);
    boltAnchorIds.push(anchorNode);
    boltProjIds.push(projNode);
    // Frame del perno entero: anchor (abajo) → plate → projection (tuerca arriba)
    addFrame(anchorNode, plateNode, A_bolt, I_bolt, J_bolt);
    addFrame(plateNode, projNode, A_bolt, I_bolt, J_bolt);
  }

  // ── 3.bis. DECORADORES 3D: pernos cilíndricos + tuercas hexagonales + orificios ──
  const decorators: THREE.Object3D[] = [];
  const r_hole = (d_bolt * 1.5) / 2;  // orificio típico = 1.5× Ø perno
  const r_nut  = (d_bolt * 1.8) / 2;  // tuerca hexagonal
  const h_nut  = 0.020;               // espesor tuerca 20mm

  // Materiales
  const matBolt = new THREE.MeshBasicMaterial({ color: 0xff8800 });          // perno acero color naranja
  const matNutMesh = new THREE.MeshBasicMaterial({ color: 0xffaa00 });        // tuerca color amarillo
  const matHoleEdge = new THREE.LineBasicMaterial({ color: 0xff4400, linewidth: 3 });
  const matNutEdge = new THREE.LineBasicMaterial({ color: 0x665500, linewidth: 1 });

  for (const [bx, by] of boltPositions) {
    // ── 1. PERNO CILÍNDRICO completo (anchor → plate → projection) ──
    // Cylinder Three.js eje Y por default — rotamos 90° para que sea vertical (eje Z)
    const totalLen = L_bolt + L_proj;
    const boltMid = (-L_bolt + L_proj) / 2;  // centro del cilindro completo
    const boltGeom = new THREE.CylinderGeometry(d_bolt / 2, d_bolt / 2, totalLen, 12);
    const boltMesh = new THREE.Mesh(boltGeom, matBolt);
    boltMesh.position.set(bx, by, boltMid);
    boltMesh.rotation.x = Math.PI / 2;  // eje Y → eje Z (vertical)
    decorators.push(boltMesh);

    // ── 2. TUERCA HEXAGONAL arriba (mesh sólido) ──
    const nutGeom = new THREE.CylinderGeometry(r_nut, r_nut, h_nut, 6);
    const nutMesh = new THREE.Mesh(nutGeom, matNutMesh);
    nutMesh.position.set(bx, by, L_proj - h_nut / 2);
    nutMesh.rotation.x = Math.PI / 2;
    decorators.push(nutMesh);

    // Bordes de la tuerca (wireframe)
    const nutEdges = new THREE.EdgesGeometry(nutGeom);
    const nutEdgesLines = new THREE.LineSegments(nutEdges, matNutEdge);
    nutEdgesLines.position.set(bx, by, L_proj - h_nut / 2);
    nutEdgesLines.rotation.x = Math.PI / 2;
    decorators.push(nutEdgesLines);

    // ── 3. ORIFICIO ROJO en placa (visible top + bottom) ──
    const holePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * 2 * Math.PI;
      holePts.push(new THREE.Vector3(bx + r_hole * Math.cos(a), by + r_hole * Math.sin(a), t_plate / 2 + 0.0005));
    }
    decorators.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(holePts), matHoleEdge));
    // Orificio cara inferior placa
    const holePtsBot: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * 2 * Math.PI;
      holePtsBot.push(new THREE.Vector3(bx + r_hole * Math.cos(a), by + r_hole * Math.sin(a), -t_plate / 2 - 0.0005));
    }
    decorators.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(holePtsBot), matHoleEdge));
  }

  // ── PEDESTAL DE CONCRETO (sólido visual + Winkler springs FEM) ──
  // Caja sólida B_ped × H_ped × h_ped centrada en (0, 0), top a z=0 (mismo nivel
  // que la placa). El concreto se modela como un BLOQUE VISUAL (THREE.Mesh) +
  // resortes Winkler en las bases de los pernos (k = E_c × A / L_eff).
  // E_c = 4700 √f'c (ACI 318) en MPa, convertido a kN/m².
  const Ec_kNm2 = ecHormigonACI(fc / 1000); // ACI 318: E_c (kN/m²)

  const pedGeom = new THREE.BoxGeometry(B_ped, H_ped, h_ped);
  const pedMat = new THREE.MeshBasicMaterial({
    color: 0x8a8a8a,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });
  const pedMesh = new THREE.Mesh(pedGeom, pedMat);
  pedMesh.position.set(0, 0, -h_ped / 2); // top del pedestal en z=0
  decorators.push(pedMesh);

  // Bordes wireframe del pedestal (edges visibles)
  const pedEdges = new THREE.EdgesGeometry(pedGeom);
  const pedEdgesLines = new THREE.LineSegments(
    pedEdges,
    new THREE.LineBasicMaterial({ color: 0x444444, linewidth: 1 }),
  );
  pedEdgesLines.position.set(0, 0, -h_ped / 2);
  decorators.push(pedEdgesLines);

  objects3DState.val = decorators;

  // ── 4. APOYOS ──
  // Empotramiento en los 4 nodos al fondo de los pernos
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  const fix6: [boolean, boolean, boolean, boolean, boolean, boolean] = [true, true, true, true, true, true];
  for (const id of boltAnchorIds) supports.set(id, fix6);

  // ── 5. CARGAS ──
  // Pu (compresión) + Mu (momento) aplicadas en el top de la columna
  // Distribuir Pu entre los 12 nodos del top de la columna (4 patin front, 4 patin back, 4 web)
  const topNodes: number[] = [];
  for (let iy = 0; iy <= nyFlange; iy++) topNodes.push(frontGrid[nzCol][iy]);
  for (let iy = 0; iy <= nyFlange; iy++) topNodes.push(backGrid[nzCol][iy]);
  for (let ix = 1; ix < nxWeb; ix++) topNodes.push(webGrid[nzCol][ix]);

  const loads = new Map<number, [number, number, number, number, number, number]>();
  const fz = -Pu / topNodes.length;
  for (const id of topNodes) {
    loads.set(id, [0, 0, fz, 0, 0, 0]);
  }
  // Mu: aplicar como par de fuerzas axiales en patines (M = ΔP × d_col)
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

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    console.log(
      `Placa base H: ${nodes.length} nodos, ${elements.length} elementos | ` +
      `Pu=${Pu}kN, Mu=${Mu}kN·m | t_plate=${(t_plate * 1000).toFixed(0)}mm`,
    );
  } catch (e: any) {
    console.warn("Placa base deform/analyze:", e?.message ?? e);
  }

  // ── BENCHMARK NUMÉRICO: AISC §J8 + DG-1 + ACI 318 §17 ──
  // 1) σ_max von Mises en placa (FEM)
  let vmMax = 0;
  const vmMap = (analyzeOutputs as any)?.vonMises as Map<number, number[]> | undefined;
  if (vmMap) vmMap.forEach((arr) => arr.forEach((v) => { if (v > vmMax) vmMax = v; }));

  // 2) AISC §J8: bearing en concreto
  //    φPp = φ · 0.85 · f'c · A1 · √(A2/A1) ≤ 1.7·φ·f'c·A1, con φ=0.65
  const phi_brg = 0.65;
  const A1 = B * H;
  const A2 = B_ped * H_ped;
  const sqrtA2A1 = Math.min(2, Math.sqrt(A2 / A1));
  const Pp_nom = 0.85 * fc * A1 * sqrtA2A1;
  const Pp_cap = Math.min(Pp_nom, 1.7 * fc * A1);
  const phiPp = phi_brg * Pp_cap;
  const demandCapPp = Pu / Math.max(1, phiPp);

  // 3) DG-1: cantilever m, presión bearing fp y espesor requerido
  //    m = (B - 0.95·d_col)/2, fp = Pu/A1
  //    t_req = m · √(2·fp / (φ·Fy)),  φ=0.9 flexural yielding
  const m_cantilever = Math.max(0, (B - 0.95 * d_col) / 2);
  const fp = Pu / A1;
  const t_req = m_cantilever * Math.sqrt((2 * Math.max(0, fp)) / (0.9 * Fy_steel));
  const demandCapT = t_req / Math.max(1e-6, t_plate);

  // 4) ACI 318 §17 — tracción por perno (simplificado)
  //    Asumir Mu vence — par tensión de pernos en lado tracción
  //    Distancia entre filas ≈ B - 2·sx; n_tens = nBoltsY (fila trasera)
  //    T_total = Mu / arm,  arm ≈ B - 2·sx  (entre filas extremas)
  //    Por perno: T_anchor = T_total / nBoltsY
  const arm = Math.max(0.05, B - 2 * sx);
  const T_total = Math.max(0, Mu / arm - Pu / 2);  // sustracción de compresión axial
  const T_anchor = T_total / Math.max(1, nBoltsY);
  //    A_se ≈ 0.75 · π/4 · d² (área efectiva tensión, F1554 nominal)
  const A_se = 0.75 * Math.PI / 4 * d_bolt * d_bolt;
  const phi_t = 0.75;
  const phiNn = phi_t * A_se * fut_anchor;
  const demandCapAnchor = T_anchor / Math.max(1, phiNn);

  benchValues.val = {
    vmMax,
    A1, A2, sqrtA2A1, phiPp, demandCapPp,
    m_cantilever, fp, t_req, t_actual: t_plate, demandCapT,
    T_anchor, phiNn, demandCapAnchor,
  };

  nodesState.val = nodes;
  elementsState.val = elements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = elementInputs;
  deformOutputsState.val = deformOutputs;
  analyzeOutputsState.val = analyzeOutputs;
});

const viewerEl = getViewer({
  mesh: {
    nodes: nodesState,
    elements: elementsState,
    nodeInputs: nodeInputsState,
    elementInputs: elementInputsState,
    deformOutputs: deformOutputsState,
    analyzeOutputs: analyzeOutputsState,
  },
  objects3D: objects3DState,   // orificios + tuercas + pedestal concreto
  settingsObj: {
    deformedShape: true,
    shellResults: "vonMises",
    gridSize: 1,
    deformScale: 20,
    custom3D: true,            // mostrar objects3D
  },
});

// ── Panel BENCHMARK con valores numéricos LIVE (AISC §J8 + DG-1 + ACI 318 §17) ──
const benchmarkPanel = document.createElement("div");
benchmarkPanel.style.cssText = "position:fixed;top:8px;right:8px;background:rgba(20,20,20,0.94);color:#ddd;font:11px/1.4 ui-monospace,Menlo,monospace;padding:10px 14px;border-radius:6px;border:1px solid #444;z-index:9999;min-width:340px;max-width:420px;";
const ratioFmt = (r: number) => {
  if (r < 1.0) return `<span style="color:#7eff7e">${r.toFixed(2)} ✓</span>`;
  if (r < 1.2) return `<span style="color:#ffcc00">${r.toFixed(2)} ⚠</span>`;
  return `<span style="color:#ff5555">${r.toFixed(2)} ✗</span>`;
};
van.derive(() => {
  const v = benchValues.val;
  const Pu_now = parameters.Pu.value.val;
  const Mu_now = parameters.Mu.value.val;
  benchmarkPanel.innerHTML = `
    <div style="font-weight:bold;color:#ffaa00;margin-bottom:6px;">
      🧪 BENCHMARK — placa-base-h (CBFEM)
    </div>
    <div style="font-size:10px;color:#aaa;margin-bottom:4px;">
      Demanda: Pu=${Pu_now}kN · Mu=${Mu_now}kN·m
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10.5px;">
      <tr style="color:#aaa;border-bottom:1px solid #444;">
        <td colspan="3" style="padding:3px 0;font-weight:bold;color:#ffcc77;">AISC 360-22 §J8 (bearing concreto)</td>
      </tr>
      <tr><td>A₁ = B·H (m²)</td><td colspan="2" style="text-align:right;">${v.A1.toFixed(4)}</td></tr>
      <tr><td>A₂ = B_ped·H_ped (m²)</td><td colspan="2" style="text-align:right;">${v.A2.toFixed(4)}</td></tr>
      <tr><td>√(A₂/A₁) (≤2)</td><td colspan="2" style="text-align:right;">${v.sqrtA2A1.toFixed(3)}</td></tr>
      <tr><td>φPp (kN)</td><td colspan="2" style="text-align:right;">${v.phiPp.toFixed(0)}</td></tr>
      <tr><td>Pu/φPp</td><td colspan="2" style="text-align:right;">${ratioFmt(v.demandCapPp)}</td></tr>
      <tr style="color:#aaa;border-top:1px solid #333;">
        <td colspan="3" style="padding:3px 0;font-weight:bold;color:#ffcc77;">DG-1 espesor placa</td>
      </tr>
      <tr><td>m cantilever (m)</td><td colspan="2" style="text-align:right;">${v.m_cantilever.toFixed(4)}</td></tr>
      <tr><td>fp = Pu/A₁ (kN/m²)</td><td colspan="2" style="text-align:right;">${v.fp.toFixed(0)}</td></tr>
      <tr><td>t_req (mm)</td><td colspan="2" style="text-align:right;">${(v.t_req * 1000).toFixed(1)}</td></tr>
      <tr><td>t actual (mm)</td><td colspan="2" style="text-align:right;">${(v.t_actual * 1000).toFixed(1)}</td></tr>
      <tr><td>t_req/t_actual</td><td colspan="2" style="text-align:right;">${ratioFmt(v.demandCapT)}</td></tr>
      <tr style="color:#aaa;border-top:1px solid #333;">
        <td colspan="3" style="padding:3px 0;font-weight:bold;color:#ffcc77;">ACI 318-22 §17 (anclaje F1554)</td>
      </tr>
      <tr><td>T anclaje (kN/perno)</td><td colspan="2" style="text-align:right;">${v.T_anchor.toFixed(1)}</td></tr>
      <tr><td>φNn (kN/perno)</td><td colspan="2" style="text-align:right;">${v.phiNn.toFixed(1)}</td></tr>
      <tr><td>T/φNn</td><td colspan="2" style="text-align:right;">${ratioFmt(v.demandCapAnchor)}</td></tr>
      <tr style="color:#aaa;border-top:1px solid #333;">
        <td colspan="3" style="padding:3px 0;font-weight:bold;color:#ffcc77;">FEM</td>
      </tr>
      <tr><td>σ vonMises max (kN/m²)</td><td colspan="2" style="text-align:right;">${v.vmMax.toFixed(0)}</td></tr>
      <tr><td>vs Fy=250000</td><td colspan="2" style="text-align:right;">${ratioFmt(v.vmMax / 250000)}</td></tr>
    </table>
  `;
});
document.body.append(benchmarkPanel);

document.body.append(
  getParameters(parameters),
  viewerEl,
  getToolbar({
    sourceCode:
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-base-h/main.ts",
  }),
);

// ── Auto-fit camera al modelo (modelo es ~0.5m, default camera está lejos) ──
setTimeout(() => {
  const ctx = (viewerEl as any).__ctx;
  if (ctx?.camera && ctx?.controls) {
    ctx.camera.up.set(0, 0, 1);
    ctx.camera.position.set(2.0, -2.0, 1.2);
    ctx.controls.target.set(0, 0, 0.25);
    ctx.controls.update();
    ctx.render?.();
  }
}, 800);
