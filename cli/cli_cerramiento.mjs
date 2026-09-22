#!/usr/bin/env node
/**
 * Hekatan Struct — CLI Cerramiento
 *
 * Genera el modelo del ejemplo "cerramiento" (pórtico plano N vanos, columnas
 * + viga superior empotrada en la base), corre el análisis estático con el
 * solver WASM (Eigen C++) y extrae:
 *
 *   - JSON con fuerzas internas por elemento (N, Vy, Vz, T, My, Mz)
 *     en los dos extremos (i = inicio, j = fin) en convención LOCAL.
 *   - SVG del diagrama de momentos bendingsY (eje fuerte en el plano).
 *   - PNG del mismo diagrama (via puppeteer si --png se pide).
 *
 * Uso:
 *   node cli_cerramiento.mjs \
 *        --nVanos 3 --H 3 \
 *        --L 4,5,4 \
 *        --bCol 0.30 --hCol 0.30 \
 *        --bViga 0.20 --hViga 0.30 \
 *        --factorE 14100 --fc 210 --nu 0.20 --rho 24 \
 *        --q_vert -7 --Ex 5 \
 *        --json out.json --svg out.svg --png out.png
 *
 * Por defecto: nVanos=3, L=4,5,4, H=3, bCol=hCol=0.30 m, viga 0.20×0.30 m,
 *              factor=14100, f'c=210 kgf/cm², q_vert=-7 kN/m, Ex=0 kN.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── 0. Parse args ──────────────────────────────────────────────────────
function parseArgs(args) {
  const o = {
    nVanos: 3, H: 3.0,
    L: [4.0, 5.0, 4.0],
    bCol: 0.30, hCol: 0.30,
    bViga: 0.20, hViga: 0.30,
    factorE: 14100, fc: 210, nu: 0.20, rho: 24,
    q_vert: -7, Ex: 0, Ey: 0,
    nSubV: 2,
    diagram: "bendingsY",   // bendingsY (in-plane) | bendingsZ (out-of-plane)
    json: null, svg: null, png: null,
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i], next = () => args[++i];
    if (a === "--nVanos") o.nVanos = parseInt(next());
    else if (a === "--H") o.H = parseFloat(next());
    else if (a === "--L") o.L = next().split(",").map(Number);
    else if (a === "--bCol") o.bCol = parseFloat(next());
    else if (a === "--hCol") o.hCol = parseFloat(next());
    else if (a === "--bViga") o.bViga = parseFloat(next());
    else if (a === "--hViga") o.hViga = parseFloat(next());
    else if (a === "--factorE") o.factorE = parseFloat(next());
    else if (a === "--fc") o.fc = parseFloat(next());
    else if (a === "--nu") o.nu = parseFloat(next());
    else if (a === "--rho") o.rho = parseFloat(next());
    else if (a === "--q_vert") o.q_vert = parseFloat(next());
    else if (a === "--Ex") o.Ex = parseFloat(next());
    else if (a === "--Ey") o.Ey = parseFloat(next());
    else if (a === "--diagram") o.diagram = next();
    else if (a === "--nSubV") o.nSubV = parseInt(next());
    else if (a === "--json") o.json = next();
    else if (a === "--svg") o.svg = next();
    else if (a === "--png") o.png = next();
    else if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
  }
  if (o.L.length < o.nVanos) {
    while (o.L.length < o.nVanos) o.L.push(o.L[o.L.length - 1] ?? 4.0);
  }
  return o;
}

function printHelp() {
  console.log(`
Hekatan Struct — CLI Cerramiento
================================
Uso: node cli_cerramiento.mjs [opciones]

Geometría:
  --nVanos 3              N vanos
  --H 3.0                 Altura (m)
  --L 4,5,4               Luces de vano (m, csv)
  --nSubV 2               Div. viga por vano

Secciones (m):
  --bCol 0.30 --hCol 0.30
  --bViga 0.20 --hViga 0.30

Hormigón:
  --factorE 14100         E = factorE · √(f'c)  [kgf/cm²]
  --fc 210                f'c (kgf/cm²)
  --nu 0.20               Poisson
  --rho 24                γ (kN/m³)

Cargas:
  --q_vert -7             Carga vertical en viga (kN/m), negativa = abajo
  --Ex 0                  Lateral X tope izquierdo (kN, in-plane → My)
  --Ey 0                  Lateral Y tope izquierdo (kN, out-of-plane → Mz)
  --diagram bendingsY     Diagrama a renderizar: bendingsY | bendingsZ

Output:
  --json out.json         Fuerzas internas por elemento
  --svg out.svg           Diagrama de momentos (bendingsY)
  --png out.png           Igual que SVG pero rasterizado (requiere puppeteer)
`);
}

const opts = parseArgs(process.argv.slice(2));

// ── 1. Cargar WASM (deform) ─────────────────────────────────────────────
const wasmPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.js");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

function alloc(data, Ctor, heap) {
  const buf = new Ctor(data);
  const ptr = mod._malloc(buf.length * buf.BYTES_PER_ELEMENT);
  heap.set(buf, ptr / buf.BYTES_PER_ELEMENT);
  return ptr;
}
function pMap(m) {
  const keys = m ? [...m.keys()] : [];
  const vals = m ? [...m.values()] : [];
  return {
    keysPtr: alloc(keys, Uint32Array, mod.HEAPU32),
    valuesPtr: alloc(vals, Float64Array, mod.HEAPF64),
    size: keys.length,
  };
}

// ── 2. Construir modelo cerramiento (réplica de examples/cerramiento.ts) ─
const KGFCM2_TO_KNM2 = 98.0665;
const n = Math.max(1, Math.round(opts.nVanos));
const H = opts.H;
const nSubV = Math.max(1, opts.nSubV);

const xCol = [0];
for (let i = 0; i < n; i++) xCol.push(xCol[xCol.length - 1] + opts.L[i]);

const nodes = [];
const baseIdx = [], topIdx = [];
for (let i = 0; i < xCol.length; i++) {
  baseIdx.push(nodes.length); nodes.push([xCol[i], 0, 0]);
  topIdx.push(nodes.length);  nodes.push([xCol[i], 0, H]);
}

const elements = [];
const colIdx = new Set(), beamIdx = new Set();
// Columnas
for (let i = 0; i < xCol.length; i++) {
  colIdx.add(elements.length);
  elements.push([baseIdx[i], topIdx[i]]);
}
// Vigas con subdivisión
for (let v = 0; v < n; v++) {
  const xA = xCol[v], xB = xCol[v + 1];
  let prev = topIdx[v];
  for (let k = 1; k < nSubV; k++) {
    const t = k / nSubV;
    const midIdx = nodes.length;
    nodes.push([xA + t * (xB - xA), 0, H]);
    beamIdx.add(elements.length); elements.push([prev, midIdx]);
    prev = midIdx;
  }
  beamIdx.add(elements.length); elements.push([prev, topIdx[v + 1]]);
}

// Apoyos empotrados en bases
const supports = new Map();
for (const idx of baseIdx) supports.set(idx, [1, 1, 1, 1, 1, 1]);

// Cargas — q_vert como DISTRIBUIDA REAL en vigas via Fixed-End Moments (FEM):
//   F_z = q · L_e / 2 en cada extremo
//   M_y = ±q · L_e² / 12 en extremos i / j
const loads = new Map();
const addLoad = (idx, dFx, dFy, dFz, dMx, dMy, dMz) => {
  const prev = loads.get(idx) ?? [0, 0, 0, 0, 0, 0];
  loads.set(idx, [prev[0]+dFx, prev[1]+dFy, prev[2]+dFz, prev[3]+dMx, prev[4]+dMy, prev[5]+dMz]);
};

if (opts.q_vert !== 0) {
  for (let i = 0; i < elements.length; i++) {
    if (!beamIdx.has(i)) continue;
    const [n0, n1] = elements[i];
    const x0 = nodes[n0][0], x1 = nodes[n1][0];
    const L_e = Math.abs(x1 - x0);
    if (L_e < 1e-12) continue;
    const iIdx = x0 < x1 ? n0 : n1;
    const jIdx = x0 < x1 ? n1 : n0;
    const Fz_half = opts.q_vert * L_e / 2;
    const My_FEM  = opts.q_vert * L_e * L_e / 12;
    addLoad(iIdx, 0, 0, Fz_half, 0,  My_FEM, 0);
    addLoad(jIdx, 0, 0, Fz_half, 0, -My_FEM, 0);
  }
}

// Tope-izquierdo para Ex/Ey
const topNodeIdxs = [];
for (let i = 0; i < nodes.length; i++) if (Math.abs(nodes[i][2] - H) < 1e-9) topNodeIdxs.push(i);
const topLeftIdx = topNodeIdxs.reduce((min, idx) => nodes[idx][0] < nodes[min][0] ? idx : min, topNodeIdxs[0]);
if (opts.Ex !== 0) addLoad(topLeftIdx, opts.Ex, 0, 0, 0, 0, 0);
if (opts.Ey !== 0) addLoad(topLeftIdx, 0, opts.Ey, 0, 0, 0, 0);

// Materiales / secciones
const E_kgfcm2 = opts.factorE * Math.sqrt(opts.fc);
const E = E_kgfcm2 * KGFCM2_TO_KNM2;
const G = E / (2 * (1 + opts.nu));
// Convención Hekatan (Paz 6.3): momentsOfInertiaY = AISC Iz = eje FUERTE,
// momentsOfInertiaZ = AISC Iy = eje DÉBIL. Para rectángulo (b ancho, h alto):
//   I_strong = b·h³/12, I_weak = h·b³/12.
const cA = opts.bCol * opts.hCol;
const cI_strong = (opts.bCol * opts.hCol ** 3) / 12;
const cI_weak   = (opts.hCol * opts.bCol ** 3) / 12;
const cJ = 0.14 * Math.pow(Math.min(opts.bCol, opts.hCol), 4);
const vA = opts.bViga * opts.hViga;
const vI_strong = (opts.bViga * opts.hViga ** 3) / 12;
const vI_weak   = (opts.hViga * opts.bViga ** 3) / 12;
const vJ = 0.14 * Math.pow(Math.min(opts.bViga, opts.hViga), 4);

const Em = new Map(), Gm = new Map(), Am = new Map(), Izm = new Map(), Iym = new Map(),
      Jm = new Map(), rhom = new Map(), nuM = new Map();
for (let i = 0; i < elements.length; i++) {
  Em.set(i, E); Gm.set(i, G); rhom.set(i, opts.rho); nuM.set(i, opts.nu);
  if (colIdx.has(i)) { Am.set(i, cA); Iym.set(i, cI_strong); Izm.set(i, cI_weak); Jm.set(i, cJ); }
  else                { Am.set(i, vA); Iym.set(i, vI_strong); Izm.set(i, vI_weak); Jm.set(i, vJ); }
}

// ── 3. Llamar _deform via WASM ──────────────────────────────────────────
const gc = [];
const nodesPtr = alloc(nodes.flat(), Float64Array, mod.HEAPF64); gc.push(nodesPtr);
const elemIdx = elements.flat();
const elementsPtr = alloc(elemIdx, Uint32Array, mod.HEAPU32); gc.push(elementsPtr);
const elementSizes = elements.map(e => e.length);
const elemSizesPtr = alloc(elementSizes, Uint32Array, mod.HEAPU32); gc.push(elemSizesPtr);

const supKeys = [...supports.keys()];
const supVals = [...supports.values()].flat();
const supKeysPtr = alloc(supKeys, Uint32Array, mod.HEAPU32); gc.push(supKeysPtr);
const supValsPtr = alloc(supVals, Uint8Array, mod.HEAPU8); gc.push(supValsPtr);

const ldKeys = [...loads.keys()];
const ldVals = [...loads.values()].flat();
const ldKeysPtr = alloc(ldKeys, Uint32Array, mod.HEAPU32); gc.push(ldKeysPtr);
const ldValsPtr = alloc(ldVals, Float64Array, mod.HEAPF64); gc.push(ldValsPtr);

const Ep = pMap(Em); const Ap = pMap(Am); const Izp = pMap(Izm);
const Iyp = pMap(Iym); const Gp = pMap(Gm); const Jp = pMap(Jm);
const thickp = pMap(new Map()); const nup = pMap(nuM); const eOp = pMap(new Map());
const asYp = pMap(new Map()); const asZp = pMap(new Map());
const plateFp = pMap(new Map());
for (const p of [Ep, Ap, Izp, Iyp, Gp, Jp, thickp, nup, eOp, asYp, asZp, plateFp])
  gc.push(p.keysPtr, p.valuesPtr);

// Springs vacíos — el WASM exige un puntero válido aunque length=0
const springsPtr = alloc([0], Float64Array, mod.HEAPF64); gc.push(springsPtr);

const dPtrOut = mod._malloc(4); gc.push(dPtrOut);
const dSizeOut = mod._malloc(4); gc.push(dSizeOut);
const rPtrOut = mod._malloc(4); gc.push(rPtrOut);
const rSizeOut = mod._malloc(4); gc.push(rSizeOut);

mod._deform(
  nodesPtr, nodes.length,
  elementsPtr, elemIdx.length,
  elemSizesPtr, elements.length,
  supKeysPtr, supValsPtr, supKeys.length,
  ldKeysPtr, ldValsPtr, ldKeys.length,
  Ep.keysPtr, Ep.valuesPtr, Ep.size,
  Ap.keysPtr, Ap.valuesPtr, Ap.size,
  Izp.keysPtr, Izp.valuesPtr, Izp.size,
  Iyp.keysPtr, Iyp.valuesPtr, Iyp.size,
  Gp.keysPtr, Gp.valuesPtr, Gp.size,
  Jp.keysPtr, Jp.valuesPtr, Jp.size,
  thickp.keysPtr, thickp.valuesPtr, thickp.size,
  nup.keysPtr, nup.valuesPtr, nup.size,
  eOp.keysPtr, eOp.valuesPtr, eOp.size,
  asYp.keysPtr, asYp.valuesPtr, asYp.size,
  asZp.keysPtr, asZp.valuesPtr, asZp.size,
  springsPtr, 0,
  plateFp.keysPtr, plateFp.valuesPtr, plateFp.size,
  dPtrOut, dSizeOut, rPtrOut, rSizeOut
);

const dPtr = mod.HEAPU32[dPtrOut / 4];
const dSize = mod.HEAPU32[dSizeOut / 4];
const rPtr = mod.HEAPU32[rPtrOut / 4];
const rSize = mod.HEAPU32[rSizeOut / 4];

const deformations = new Map();
if (dSize > 0 && dPtr) {
  const flat = new Float64Array(mod.HEAPF64.buffer, dPtr, dSize);
  for (let i = 0; i < dSize; i += 7)
    deformations.set(flat[i], Array.from(flat.slice(i + 1, i + 7)));
  gc.push(dPtr);
}
const reactions = new Map();
if (rSize > 0 && rPtr) {
  const flat = new Float64Array(mod.HEAPF64.buffer, rPtr, rSize);
  for (let i = 0; i < rSize; i += 7)
    reactions.set(flat[i], Array.from(flat.slice(i + 1, i + 7)));
  gc.push(rPtr);
}
gc.forEach(p => mod._free(p));

// ── 4. analyze() inline (port de hekatan-fem/src/analyze.ts) ────────────
// Transformación frame (port de getTransformationMatrix.ts)
function transformFrame(n0, n1) {
  const dx = n1[0] - n0[0], dy = n1[1] - n0[1], dz = n1[2] - n0[2];
  const L = Math.hypot(dx, dy, dz);
  const l = dx / L, m = dy / L, nn = dz / L;
  const D = Math.sqrt(l * l + m * m);
  let lam;
  if (nn === 1) lam = [[0, 0, 1], [0, 1, 0], [-1, 0, 0]];
  else if (nn === -1) lam = [[0, 0, -1], [0, 1, 0], [1, 0, 0]];
  else lam = [[l, m, nn], [-m / D, l / D, 0], [-l * nn / D, -m * nn / D, D]];
  // T = block-diag(lam, lam, lam, lam) → 12×12
  const T = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let b = 0; b < 4; b++)
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        T[b * 3 + i][b * 3 + j] = lam[i][j];
  return { T, L };
}

function localStiffnessFrame(L, E, A, G, Iy, Iz, J, nuv) {
  // Timoshenko coeffs con As = 5/6·A por defecto
  const AsY = (5 / 6) * A, AsZ = (5 / 6) * A;
  const phiZ = (12 * E * Iz) / (G * AsZ * L * L);
  const phiY = (12 * E * Iy) / (G * AsY * L * L);
  const EA = E * A / L, GJ = G * J / L;
  const tz = (12 * E * Iz / L ** 3) / (1 + phiZ);
  const bz = (6 * E * Iz / L ** 2) / (1 + phiZ);
  const kz = (4 * E * Iz / L) * (1 + phiZ / 4) / (1 + phiZ);
  const az = (2 * E * Iz / L) * (1 - phiZ / 2) / (1 + phiZ);
  const ty = (12 * E * Iy / L ** 3) / (1 + phiY);
  const by = (6 * E * Iy / L ** 2) / (1 + phiY);
  const ky = (4 * E * Iy / L) * (1 + phiY / 4) / (1 + phiY);
  const ay = (2 * E * Iy / L) * (1 - phiY / 2) / (1 + phiY);
  return [
    [ EA,  0,    0,    0,    0,    0,   -EA,  0,    0,    0,    0,    0  ],
    [ 0,   tz,   0,    0,    0,    bz,   0,  -tz,   0,    0,    0,    bz ],
    [ 0,   0,    ty,   0,   -by,   0,    0,   0,   -ty,   0,   -by,   0  ],
    [ 0,   0,    0,    GJ,   0,    0,    0,   0,    0,   -GJ,   0,    0  ],
    [ 0,   0,   -by,   0,    ky,   0,    0,   0,    by,   0,    ay,   0  ],
    [ 0,   bz,   0,    0,    0,    kz,   0,  -bz,   0,    0,    0,    az ],
    [-EA,  0,    0,    0,    0,    0,    EA,   0,    0,    0,    0,    0  ],
    [ 0,  -tz,   0,    0,    0,   -bz,   0,   tz,   0,    0,    0,   -bz ],
    [ 0,   0,   -ty,   0,    by,   0,    0,   0,    ty,   0,    by,   0  ],
    [ 0,   0,    0,   -GJ,   0,    0,    0,   0,    0,    GJ,   0,    0  ],
    [ 0,   0,   -by,   0,    ay,   0,    0,   0,    by,   0,    ky,   0  ],
    [ 0,   bz,   0,    0,    0,    az,   0,  -bz,   0,    0,    0,    kz ],
  ];
}

function matVec(M, v) {
  const n = M.length, m = v.length;
  const r = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < m; j++) s += M[i][j] * v[j];
    r[i] = s;
  }
  return r;
}

const internal = [];
elements.forEach((e, i) => {
  const [iI, iJ] = e;
  const n0 = nodes[iI], n1 = nodes[iJ];
  const d0 = deformations.get(iI) ?? [0, 0, 0, 0, 0, 0];
  const d1 = deformations.get(iJ) ?? [0, 0, 0, 0, 0, 0];
  const { T, L } = transformFrame(n0, n1);
  const uG = [...d0, ...d1];
  const uL = matVec(T, uG);
  const K = localStiffnessFrame(L, Em.get(i), Am.get(i), Gm.get(i), Iym.get(i), Izm.get(i), Jm.get(i), nuM.get(i));
  const fL = matVec(K, uL);
  internal.push({
    elem: i,
    type: colIdx.has(i) ? "col" : "beam",
    nodes: [iI, iJ],
    L,
    N_i: fL[0], N_j: fL[6],
    Vy_i: fL[1], Vy_j: fL[7],
    Vz_i: fL[2], Vz_j: fL[8],
    T_i: fL[3], T_j: fL[9],
    My_i: fL[4], My_j: fL[10],
    Mz_i: fL[5], Mz_j: fL[11],
  });
});

// ── 5. JSON output ──────────────────────────────────────────────────────
const summary = {
  model: { nVanos: n, H, L_vanos: opts.L.slice(0, n), xCol },
  material: {
    factor: opts.factorE, fc_kgfcm2: opts.fc,
    E_kgfcm2: E_kgfcm2, E_kNm2: E,
    nu: opts.nu, rho: opts.rho, G_kNm2: G,
  },
  secciones: {
    col: { b: opts.bCol, h: opts.hCol, A: cA, Iy_strong: cI_strong, Iz_weak: cI_weak, J: cJ },
    viga: { b: opts.bViga, h: opts.hViga, A: vA, Iy_strong: vI_strong, Iz_weak: vI_weak, J: vJ },
  },
  cargas: { q_vert_kNm: opts.q_vert, Ex_kN: opts.Ex, nodos_con_carga: loads.size },
  nodes,
  elements,
  reactions: Object.fromEntries([...reactions.entries()].map(([k, v]) => [k, v])),
  internal,
};

// ── 6. SVG moment diagram (bendingsY = in-plane) ────────────────────────
function buildSvg() {
  const W = 1200, Hsvg = 700, pad = 60;
  const xs = nodes.map(n => n[0]);
  const zs = nodes.map(n => n[2]);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const zMin = Math.min(...zs), zMax = Math.max(...zs);
  const scaleX = (W - 2 * pad) / (xMax - xMin || 1);
  const scaleZ = (Hsvg - 2 * pad) / (zMax - zMin || 1);
  const sc = Math.min(scaleX, scaleZ);
  // proyección: x_svg = pad + (x - xMin) * sc ; y_svg = Hsvg - pad - (z - zMin) * sc
  const sx = x => pad + (x - xMin) * sc;
  const sy = z => Hsvg - pad - (z - zMin) * sc;

  // ── Selección de diagrama (My in-plane vs Mz out-of-plane) ──
  const useMz = opts.diagram === "bendingsZ";
  const pickI = r => useMz ? r.Mz_i : r.My_i;
  const pickJ = r => useMz ? r.Mz_j : r.My_j;
  const diagTitle = useMz ? "Momentos Mz (kN·m) · out-of-plane (col bends in Y)"
                          : "Momentos My (kN·m) · in-plane (col bends in X)";
  // Escala momentos: max |M| → offset visual de 50 px perpendicular al elemento
  const allM = internal.flatMap(r => [Math.abs(pickI(r)), Math.abs(pickJ(r))]);
  const Mmax = Math.max(...allM, 1e-6);
  const Mscale = 50 / Mmax;   // px por kN·m

  const lines = [];
  // Frame
  for (const e of elements) {
    const [a, b] = e;
    lines.push(`<line x1="${sx(nodes[a][0])}" y1="${sy(nodes[a][2])}" x2="${sx(nodes[b][0])}" y2="${sy(nodes[b][2])}" stroke="#222" stroke-width="2"/>`);
  }
  // Apoyos triángulos
  for (const idx of baseIdx) {
    const x = sx(nodes[idx][0]), y = sy(nodes[idx][2]);
    lines.push(`<polygon points="${x - 8},${y + 14} ${x + 8},${y + 14} ${x},${y}" fill="#444"/>`);
    lines.push(`<line x1="${x - 14}" y1="${y + 14}" x2="${x + 14}" y2="${y + 14}" stroke="#444" stroke-width="2"/>`);
  }

  // Diagrama de momentos (bendingsY = My local = momento en el plano del pórtico)
  // Convención: My positivo dibuja en lado convexo (tracción) del elemento.
  for (const r of internal) {
    const [a, b] = elements[r.elem];
    const x0 = nodes[a][0], z0 = nodes[a][2];
    const x1 = nodes[b][0], z1 = nodes[b][2];
    // Vector unitario del elemento y perpendicular en el plano XZ
    const dx = x1 - x0, dz = z1 - z0;
    const L = Math.hypot(dx, dz);
    const tx = dx / L, tz = dz / L;
    // Perpendicular: rotar 90° en sentido antihorario → (-tz, tx) en XZ
    const nx_p = -tz, nz_p = tx;
    // Convención de signo: en awatif/hekatan f_local[4..5] y f_local[10..11]
    // son los momentos de extremo. Para que el diagrama quede del "lado
    // tracción" del elemento, -valor en extremo i y +valor en extremo j.
    const M_i = -pickI(r);
    const M_j =  pickJ(r);
    // Puntos en SVG: nodos a y b, y los dos puntos perpendiculares del diagrama
    const ox_i = x0 + nx_p * (M_i * Mscale / sc);
    const oz_i = z0 + nz_p * (M_i * Mscale / sc);
    const ox_j = x1 + nx_p * (M_j * Mscale / sc);
    const oz_j = z1 + nz_p * (M_j * Mscale / sc);
    lines.push(`<polygon points="${sx(x0)},${sy(z0)} ${sx(ox_i)},${sy(oz_i)} ${sx(ox_j)},${sy(oz_j)} ${sx(x1)},${sy(z1)}" fill="rgba(220,80,80,0.35)" stroke="#c44" stroke-width="1"/>`);
    // Etiquetas de momentos en los extremos
    lines.push(`<text x="${sx(ox_i)}" y="${sy(oz_i)}" font-size="11" font-family="monospace" fill="#a00" text-anchor="middle">${pickI(r).toFixed(2)}</text>`);
    lines.push(`<text x="${sx(ox_j)}" y="${sy(oz_j)}" font-size="11" font-family="monospace" fill="#a00" text-anchor="middle">${pickJ(r).toFixed(2)}</text>`);
  }

  // Nodos
  for (let i = 0; i < nodes.length; i++) {
    lines.push(`<circle cx="${sx(nodes[i][0])}" cy="${sy(nodes[i][2])}" r="3" fill="#222"/>`);
  }

  // Cotas (dimensiones de vanos)
  const yCot = Hsvg - pad / 2;
  for (let i = 0; i < xCol.length - 1; i++) {
    const xA = sx(xCol[i]), xB = sx(xCol[i + 1]);
    lines.push(`<line x1="${xA}" y1="${yCot}" x2="${xB}" y2="${yCot}" stroke="#888" stroke-width="0.7" marker-start="url(#tick)" marker-end="url(#tick)"/>`);
    lines.push(`<text x="${(xA + xB) / 2}" y="${yCot - 6}" font-size="11" font-family="monospace" fill="#555" text-anchor="middle">${opts.L[i].toFixed(2)} m</text>`);
  }

  const title = `Cerramiento N=${n}  H=${H}m  ·  ${diagTitle}  ·  E=${opts.factorE}·√${opts.fc}=${E_kgfcm2.toFixed(0)} kgf/cm²`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hsvg}" viewBox="0 0 ${W} ${Hsvg}">
  <defs>
    <marker id="tick" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><line x1="0" y1="0" x2="0" y2="6" stroke="#888"/></marker>
  </defs>
  <rect width="${W}" height="${Hsvg}" fill="white"/>
  <text x="${W / 2}" y="28" font-size="15" font-family="sans-serif" fill="#222" text-anchor="middle" font-weight="600">${title}</text>
  ${lines.join("\n  ")}
</svg>`;
}

// ── 7. Consola: imprime resumen ─────────────────────────────────────────
console.log("\n" + "═".repeat(80));
console.log("  HEKATAN STRUCT — CERRAMIENTO CLI");
console.log("═".repeat(80));
console.log(`  N vanos: ${n}    H: ${H} m    L: [${opts.L.slice(0, n).map(x => x.toFixed(2)).join(", ")}] m`);
console.log(`  Hormigón f'c = ${opts.fc} kgf/cm²   factor E = ${opts.factorE}`);
console.log(`  E = ${opts.factorE}·√${opts.fc} = ${E_kgfcm2.toFixed(0)} kgf/cm²   (${(E/1e6).toFixed(2)} GPa)`);
console.log(`  Col ${opts.bCol}×${opts.hCol} m    Viga ${opts.bViga}×${opts.hViga} m`);
console.log(`  q viga = ${opts.q_vert} kN/m   Ex tope = ${opts.Ex} kN`);
console.log("─".repeat(80));
console.log(`  Nodos: ${nodes.length}   Elementos: ${elements.length}   Apoyos: ${supports.size}   Nodos cargados: ${loads.size}`);
console.log("─".repeat(80));

// Convención awatif (eje vertical Z+):
//   COLUMNAS: local_x=+Z, local_y=+Y, local_z=-X
//     · bendingsY (My) = flexión en plano XZ → columna se flexa en X ("bend in X")
//     · bendingsZ (Mz) = flexión en plano YZ → columna se flexa en Y ("bend in Y")
//   VIGAS HORIZONTALES (X): local_x=+X, local_y=+Y, local_z=+Z
//     · bendingsY (My) = flexión vertical (sagging/hogging) — main diagram
//     · bendingsZ (Mz) = flexión lateral en plano XY
console.log("\n  FUERZAS INTERNAS — convencion local Hekatan");
console.log(`  ${"#".padStart(3)}  ${"tipo".padStart(4)}  ${"L(m)".padStart(6)}  ${"N_i".padStart(9)}  ${"My_i".padStart(9)}  ${"My_j".padStart(9)}  ${"Mz_i".padStart(9)}  ${"Mz_j".padStart(9)}  ${"T_i".padStart(9)}`);
console.log("  " + "─".repeat(82));
for (const r of internal) {
  console.log(`  ${String(r.elem).padStart(3)}  ${r.type.padStart(4)}  ${r.L.toFixed(2).padStart(6)}  ${r.N_i.toFixed(3).padStart(9)}  ${r.My_i.toFixed(3).padStart(9)}  ${r.My_j.toFixed(3).padStart(9)}  ${r.Mz_i.toFixed(3).padStart(9)}  ${r.Mz_j.toFixed(3).padStart(9)}  ${r.T_i.toFixed(3).padStart(9)}`);
}
console.log("\n  Leyenda:");
console.log("    My (bendingsY) = flexión en plano XZ (in-plane del pórtico)");
console.log("    Mz (bendingsZ) = flexión en plano YZ (out-of-plane = lateral en Y)");
console.log("    T  (torsions)  = torsión alrededor del eje del elemento");

// Extremos máximos
const absMaxMy = internal.reduce((mx, r) => Math.max(mx, Math.abs(r.My_i), Math.abs(r.My_j)), 0);
const absMaxMz = internal.reduce((mx, r) => Math.max(mx, Math.abs(r.Mz_i), Math.abs(r.Mz_j)), 0);
console.log("\n  Max |My| (in-plane) = " + absMaxMy.toFixed(3) + " kN·m");
console.log("  Max |Mz| (out-of-plane) = " + absMaxMz.toFixed(3) + " kN·m   (≈ 0 esperado en pórtico plano)");

// Reacciones
console.log("\n  Reacciones (apoyos empotrados):");
console.log(`  ${"Nodo".padStart(5)}  ${"Rx".padStart(10)}  ${"Rz".padStart(10)}  ${"My".padStart(10)}`);
console.log("  " + "─".repeat(43));
for (const [idx, r] of reactions.entries()) {
  console.log(`  ${String(idx).padStart(5)}  ${r[0].toFixed(3).padStart(10)}  ${r[2].toFixed(3).padStart(10)}  ${r[4].toFixed(3).padStart(10)}`);
}

// ── 8. Escribir archivos ────────────────────────────────────────────────
if (opts.json) {
  writeFileSync(resolve(opts.json), JSON.stringify(summary, null, 2));
  console.log("\n  → JSON: " + resolve(opts.json));
}
if (opts.svg || opts.png) {
  const svgStr = buildSvg();
  const svgPath = opts.svg ? resolve(opts.svg) : resolve("cerramiento-moments.svg");
  writeFileSync(svgPath, svgStr);
  console.log("  → SVG : " + svgPath);

  if (opts.png) {
    // Rasterizar con puppeteer
    const pngPath = resolve(opts.png);
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 700, deviceScaleFactor: 2 });
    await page.setContent(`<html><body style="margin:0">${svgStr}</body></html>`);
    await page.screenshot({ path: pngPath, omitBackground: false });
    await browser.close();
    console.log("  → PNG : " + pngPath);
  }
}

console.log("");
