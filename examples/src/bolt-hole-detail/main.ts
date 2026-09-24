/**
 * Detalle Perno + Orificio — concentración de tensiones alrededor del agujero.
 *
 * Modelo simplificado de una porción de placa cuadrada con orificio circular
 * central por donde pasa un perno de anclaje. La placa se modela con shells Q4
 * en plano XZ. La malla se construye en coordenadas polares (anular) para que
 * el orificio sea EXACTAMENTE circular sin "stair-stepping".
 *
 * Elementos:
 *   - Placa: anular Q4 mesh (radial × angular)
 *   - Perno: frame element vertical pasando por el centro del orificio,
 *     conectado a los 8 nodos del borde interno del orificio (rigid web)
 *
 * Cargas: tracción uniforme en los bordes opuestos de la placa (caso clásico
 * de Kirsch — concentración de tensiones 3× alrededor del agujero en infinito).
 *
 * Patron de ejemplo con panel propio.
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";
import * as THREE from "three";

const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;

const parameters: Parameters = {
  L:        { value: van.state(0.20),  min: 0.10, max: 0.50, step: 0.02, label: "L placa (m, lado)" },
  t_plate:  { value: van.state(0.020), min: 0.008, max: 0.050, step: 0.002, label: "Espesor placa (m)" },
  d_hole:   { value: van.state(0.030), min: 0.012, max: 0.080, step: 0.002, label: "Ø orificio (m)" },
  d_bolt:   { value: van.state(0.024), min: 0.010, max: 0.060, step: 0.002, label: "Ø perno (m)" },
  L_bolt:   { value: van.state(0.150), min: 0.05, max: 0.40, step: 0.01,  label: "L perno (m)" },
  nRadial:  { value: van.state(8),     min: 4,    max: 20,   step: 1,    label: "Mesh radial" },
  nTheta:   { value: van.state(24),    min: 12,   max: 48,   step: 4,    label: "Mesh angular" },
  Pull:     { value: van.state(50),    min: 0,    max: 500,  step: 5,    label: "Tracción borde (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});
const objects3DState: State<THREE.Object3D[]>    = van.state([]);

van.derive(() => {
  const L = parameters.L.value.val;
  const t_plate = parameters.t_plate.value.val;
  const d_hole = parameters.d_hole.value.val;
  const d_bolt = parameters.d_bolt.value.val;
  const L_bolt = parameters.L_bolt.value.val;
  const nR = Math.round(parameters.nRadial.value.val);
  const nT = Math.round(parameters.nTheta.value.val);
  const Pull = parameters.Pull.value.val;

  const r_hole = d_hole / 2;
  const r_outer = L / 2;  // radio del círculo inscrito en el cuadrado (aproximación)

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
    areas.set(i, 0); Iy.set(i, 0); Iz.set(i, 0); J.set(i, 0);
    shearModuli.set(i, Gs);
  }
  function addFrame(n0: number, n1: number, A: number, II: number, JJ: number) {
    elements.push([n0, n1]);
    const i = elements.length - 1;
    elasticities.set(i, Es); shearModuli.set(i, Gs);
    poissonsRatios.set(i, nu_s); densities.set(i, rho_s);
    areas.set(i, A); Iy.set(i, II); Iz.set(i, II); J.set(i, JJ);
    thicknesses.set(i, 0);
  }

  // ── PLACA ANULAR (mesh polar) ──
  // Anillos radiales de r_hole a r_outer, dividido en nR×nT Q4 elementos.
  // Plano XY, espesor t_plate.
  const grid: number[][] = []; // grid[ir][it]
  for (let ir = 0; ir <= nR; ir++) {
    const r = r_hole + (ir / nR) * (r_outer - r_hole);
    const row: number[] = [];
    for (let it = 0; it < nT; it++) {
      const angle = (it / nT) * 2 * Math.PI;
      row.push(addNode(r * Math.cos(angle), r * Math.sin(angle), 0));
    }
    grid.push(row);
  }
  for (let ir = 0; ir < nR; ir++) {
    for (let it = 0; it < nT; it++) {
      const itNext = (it + 1) % nT;
      addShell(
        grid[ir][it], grid[ir][itNext],
        grid[ir + 1][itNext], grid[ir + 1][it],
        t_plate,
      );
    }
  }

  // ── PERNO (frame vertical por el centro del orificio) ──
  // Pasa por (0, 0, z) desde z=-L_bolt/2 hasta z=+L_bolt/2.
  // Conectado al borde interno del orificio (ir=0) con frame "rigid spider"
  // para distribuir la carga radialmente.
  const A_bolt = Math.PI * d_bolt * d_bolt / 4;
  const I_bolt = Math.PI * Math.pow(d_bolt, 4) / 64;
  const J_bolt = 2 * I_bolt;

  const boltBottom = addNode(0, 0, -L_bolt / 2);
  const boltCenter = addNode(0, 0, 0);                 // en el plano de la placa
  const boltTop = addNode(0, 0, L_bolt / 2);

  // Tramos del perno (3 frames)
  addFrame(boltBottom, boltCenter, A_bolt, I_bolt, J_bolt);
  addFrame(boltCenter, boltTop,    A_bolt, I_bolt, J_bolt);

  // Spider rigid: frames del centro a cada nodo del borde interno (ir=0)
  // Modela el contacto radial bolt → orificio (simplificado como rigid)
  const I_rigid = I_bolt * 100;
  const A_rigid = A_bolt * 10;
  for (let it = 0; it < nT; it++) {
    addFrame(boltCenter, grid[0][it], A_rigid, I_rigid, I_rigid * 2);
  }

  // ── APOYOS: empotrar el extremo inferior del perno ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  supports.set(boltBottom, [true, true, true, true, true, true]);

  // ── CARGAS: tracción uniforme en los bordes superior+inferior (en Y=±r_outer) ──
  // Concentración de tensiones tipo problema de Kirsch — distribuir Pull entre los
  // nodos cercanos a los polos angle=π/2 y angle=3π/2 (Y máximo y Y mínimo)
  const loads = new Map<number, [number, number, number, number, number, number]>();
  // Cara superior: it cerca de π/2 (90°), 5 nodos del anillo más externo
  const itCenterTop = Math.round(nT * 0.25);
  const itCenterBot = Math.round(nT * 0.75);
  const halfBand = Math.max(2, Math.round(nT * 0.15));
  let countTop = 0, countBot = 0;
  for (let dir = -halfBand; dir <= halfBand; dir++) {
    countTop++; countBot++;
  }
  const fTop = Pull / countTop;
  const fBot = -Pull / countBot;
  for (let dir = -halfBand; dir <= halfBand; dir++) {
    const itT = (itCenterTop + dir + nT) % nT;
    const itB = (itCenterBot + dir + nT) % nT;
    const idT = grid[nR][itT];
    const idB = grid[nR][itB];
    const curT = loads.get(idT) || [0, 0, 0, 0, 0, 0];
    loads.set(idT, [curT[0], curT[1] + fTop, curT[2], curT[3], curT[4], curT[5]]);
    const curB = loads.get(idB) || [0, 0, 0, 0, 0, 0];
    loads.set(idB, [curB[0], curB[1] + fBot, curB[2], curB[3], curB[4], curB[5]]);
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
  } catch (e: any) {
    console.warn("Bolt-hole detail deform/analyze:", e?.message ?? e);
  }

  // ── DECORADORES 3D ──
  const decorators: THREE.Object3D[] = [];
  const matHole = new THREE.LineBasicMaterial({ color: 0xff8000, linewidth: 3 });
  // Círculo del orificio en plano de la placa (visible naranja)
  const holePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI;
    holePts.push(new THREE.Vector3(r_hole * Math.cos(a), r_hole * Math.sin(a), 0.0005));
  }
  decorators.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(holePts), matHole));
  // Cilindro perno (líneas verticales como wireframe)
  const matBolt = new THREE.LineBasicMaterial({ color: 0xffaa00, linewidth: 2 });
  const r_b = d_bolt / 2;
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * 2 * Math.PI;
    const x = r_b * Math.cos(a), y = r_b * Math.sin(a);
    const seg = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, y, -L_bolt / 2),
      new THREE.Vector3(x, y,  L_bolt / 2),
    ]);
    decorators.push(new THREE.Line(seg, matBolt));
  }
  // Anillos del perno (top y bottom + medio)
  for (const z of [-L_bolt / 2, 0, L_bolt / 2]) {
    const ringPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * 2 * Math.PI;
      ringPts.push(new THREE.Vector3(r_b * Math.cos(a), r_b * Math.sin(a), z));
    }
    decorators.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), matBolt));
  }
  objects3DState.val = decorators;

  console.log(
    `Bolt-hole: ${nodes.length} nodos, ${elements.length} elem | ` +
    `placa=${L * 1000}mm, hole=Ø${(d_hole * 1000).toFixed(0)}mm, bolt=Ø${(d_bolt * 1000).toFixed(0)}mm`,
  );

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
  objects3D: objects3DState,
  settingsObj: {
    deformedShape: true,
    shellResults: "vonMises",
    gridSize: 0.5,
    deformScale: 100,
    custom3D: true,
  },
});

document.body.append(
  getParameters(parameters),
  viewerEl,
  getToolbar({
    sourceCode:
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/bolt-hole-detail/main.ts",
  }),
);

setTimeout(() => {
  const ctx = (viewerEl as any).__ctx;
  if (ctx?.camera && ctx?.controls) {
    ctx.camera.up.set(0, 0, 1);
    ctx.camera.position.set(0.4, -0.4, 0.3);
    ctx.controls.target.set(0, 0, 0);
    ctx.controls.update();
    ctx.render?.();
  }
}, 800);
