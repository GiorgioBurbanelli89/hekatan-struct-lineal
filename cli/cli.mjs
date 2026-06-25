#!/usr/bin/env node
/**
 * Awatif FEM — CLI Unificado
 * Analisis estatico + modal sin UI, desde Node.js con WASM (Eigen C++)
 *
 * Uso:
 *   node cli.mjs help
 *   node cli.mjs edificio                    # modelo default
 *   node cli.mjs edificio --static           # solo estatico
 *   node cli.mjs edificio --modal            # solo modal
 *   node cli.mjs edificio --json out.json    # exportar resultados
 *   node cli.mjs edificio svx=5,3 svy=4,4 np=3 hp=3
 *   node cli.mjs frame nv=3 sv=6 np=4 hp=3
 *   node cli.mjs file model.json             # cargar desde archivo
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load WASM ──────────────────────────────────────────────────────
const wasmPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.js");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

// ── WASM Helpers ───────────────────────────────────────────────────
function allocate(data, TypedArrayCtor, heapTypedArray) {
  const buffer = new TypedArrayCtor(data);
  const pointer = mod._malloc(buffer.length * buffer.BYTES_PER_ELEMENT);
  heapTypedArray.set(buffer, pointer / buffer.BYTES_PER_ELEMENT);
  return pointer;
}

function processInput(inputMap) {
  const keys = inputMap ? Array.from(inputMap.keys()) : [];
  const values = inputMap ? Array.from(inputMap.values()) : [];
  const keysPtr = allocate(keys, Uint32Array, mod.HEAPU32);
  const valuesPtr = allocate(values, Float64Array, mod.HEAPF64);
  return { keysPtr, valuesPtr, size: keys.length, gc: [keysPtr, valuesPtr] };
}

// ── Static Analysis (deform) ────────────────────────────────────────
function runDeform(nodes, elements, nodeInputs, elementInputs) {
  const gc = [];

  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64); gc.push(nodesPtr);
  const elementIndices = elements.flat();
  const elementsPtr = allocate(elementIndices, Uint32Array, mod.HEAPU32); gc.push(elementsPtr);
  const elementSizes = elements.map(e => e.length);
  const elementSizesPtr = allocate(elementSizes, Uint32Array, mod.HEAPU32); gc.push(elementSizesPtr);

  // Supports
  const supportKeys = nodeInputs.supports ? Array.from(nodeInputs.supports.keys()) : [];
  const supportValues = nodeInputs.supports
    ? Array.from(nodeInputs.supports.values()).flat().map(b => b ? 1 : 0) : [];
  const supportKeysPtr = allocate(supportKeys, Uint32Array, mod.HEAPU32); gc.push(supportKeysPtr);
  const supportValuesPtr = allocate(supportValues, Uint8Array, mod.HEAPU8); gc.push(supportValuesPtr);

  // Loads
  const loadKeys = nodeInputs.loads ? Array.from(nodeInputs.loads.keys()) : [];
  const loadValues = nodeInputs.loads ? Array.from(nodeInputs.loads.values()).flat() : [];
  const loadKeysPtr = allocate(loadKeys, Uint32Array, mod.HEAPU32); gc.push(loadKeysPtr);
  const loadValuesPtr = allocate(loadValues, Float64Array, mod.HEAPF64); gc.push(loadValuesPtr);

  // Element inputs
  const ei = elementInputs;
  const E = processInput(ei.elasticities); gc.push(...E.gc);
  const A = processInput(ei.areas); gc.push(...A.gc);
  const Iz = processInput(ei.momentsOfInertiaZ); gc.push(...Iz.gc);
  const Iy = processInput(ei.momentsOfInertiaY); gc.push(...Iy.gc);
  const G = processInput(ei.shearModuli); gc.push(...G.gc);
  const J = processInput(ei.torsionalConstants); gc.push(...J.gc);
  // Extra inputs required by _deform signature (thickness, poisson, elasticitiesOrthogonal)
  const thick = processInput(ei.thicknesses || new Map()); gc.push(...thick.gc);
  const poiss = processInput(ei.poissonsRatios || new Map()); gc.push(...poiss.gc);
  const eOrtho = processInput(ei.elasticitiesOrthogonal || new Map()); gc.push(...eOrtho.gc);

  // Output pointers
  const deformPtrOut = mod._malloc(4); gc.push(deformPtrOut);
  const deformSizeOut = mod._malloc(4); gc.push(deformSizeOut);
  const reactPtrOut = mod._malloc(4); gc.push(reactPtrOut);
  const reactSizeOut = mod._malloc(4); gc.push(reactSizeOut);

  mod._deform(
    nodesPtr, nodes.length,
    elementsPtr, elementIndices.length,
    elementSizesPtr, elements.length,
    supportKeysPtr, supportValuesPtr, supportKeys.length,
    loadKeysPtr, loadValuesPtr, loadKeys.length,
    E.keysPtr, E.valuesPtr, E.size,
    A.keysPtr, A.valuesPtr, A.size,
    Iz.keysPtr, Iz.valuesPtr, Iz.size,
    Iy.keysPtr, Iy.valuesPtr, Iy.size,
    G.keysPtr, G.valuesPtr, G.size,
    J.keysPtr, J.valuesPtr, J.size,
    thick.keysPtr, thick.valuesPtr, thick.size,
    poiss.keysPtr, poiss.valuesPtr, poiss.size,
    eOrtho.keysPtr, eOrtho.valuesPtr, eOrtho.size,
    deformPtrOut, deformSizeOut,
    reactPtrOut, reactSizeOut
  );

  const dPtr = mod.HEAPU32[deformPtrOut / 4];
  const dSize = mod.HEAPU32[deformSizeOut / 4];
  const rPtr = mod.HEAPU32[reactPtrOut / 4];
  const rSize = mod.HEAPU32[reactSizeOut / 4];

  // Output format: [nodeIndex, v0, v1, v2, v3, v4, v5, nodeIndex, ...] stride=7
  const deformations = new Map();
  if (dSize > 0 && dPtr) {
    const flat = new Float64Array(mod.HEAPF64.buffer, dPtr, dSize);
    for (let i = 0; i < dSize; i += 7) {
      const idx = flat[i];
      deformations.set(idx, Array.from(flat.slice(i + 1, i + 7)));
    }
    gc.push(dPtr);
  }

  const reactions = new Map();
  if (rSize > 0 && rPtr) {
    const flat = new Float64Array(mod.HEAPF64.buffer, rPtr, rSize);
    for (let i = 0; i < rSize; i += 7) {
      const idx = flat[i];
      reactions.set(idx, Array.from(flat.slice(i + 1, i + 7)));
    }
    gc.push(rPtr);
  }

  gc.forEach(ptr => mod._free(ptr));
  return { deformations, reactions };
}

// ── Modal Analysis ──────────────────────────────────────────────────
function runModal(nodes, elements, nodeInputs, elementInputs, numModes = 6) {
  const gc = [];

  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64); gc.push(nodesPtr);
  const elementIndices = elements.flat();
  const elementsPtr = allocate(elementIndices, Uint32Array, mod.HEAPU32); gc.push(elementsPtr);
  const elementSizes = elements.map(e => e.length);
  const elementSizesPtr = allocate(elementSizes, Uint32Array, mod.HEAPU32); gc.push(elementSizesPtr);

  const supportKeys = nodeInputs.supports ? Array.from(nodeInputs.supports.keys()) : [];
  const supportValues = nodeInputs.supports
    ? Array.from(nodeInputs.supports.values()).flat().map(b => b ? 1 : 0) : [];
  const supportKeysPtr = allocate(supportKeys, Uint32Array, mod.HEAPU32); gc.push(supportKeysPtr);
  const supportValuesPtr = allocate(supportValues, Uint8Array, mod.HEAPU8); gc.push(supportValuesPtr);

  const ei = elementInputs;
  const E = processInput(ei.elasticities); gc.push(...E.gc);
  const A = processInput(ei.areas); gc.push(...A.gc);
  const Iz = processInput(ei.momentsOfInertiaZ); gc.push(...Iz.gc);
  const Iy = processInput(ei.momentsOfInertiaY); gc.push(...Iy.gc);
  const G = processInput(ei.shearModuli); gc.push(...G.gc);
  const J = processInput(ei.torsionalConstants); gc.push(...J.gc);
  const rho = processInput(ei.densities); gc.push(...rho.gc);

  const freqPtrOut = mod._malloc(4); gc.push(freqPtrOut);
  const numFreqOut = mod._malloc(4); gc.push(numFreqOut);
  const modesPtrOut = mod._malloc(4); gc.push(modesPtrOut);
  const modesRowsOut = mod._malloc(4); gc.push(modesRowsOut);
  const modesColsOut = mod._malloc(4); gc.push(modesColsOut);
  const massPtrOut = mod._malloc(4); gc.push(massPtrOut);
  const massRowsOut = mod._malloc(4); gc.push(massRowsOut);
  const massColsOut = mod._malloc(4); gc.push(massColsOut);

  mod._modal(
    nodesPtr, nodes.length,
    elementsPtr, elementIndices.length,
    elementSizesPtr, elements.length,
    supportKeysPtr, supportValuesPtr, supportKeys.length,
    E.keysPtr, E.valuesPtr, E.size,
    A.keysPtr, A.valuesPtr, A.size,
    Iz.keysPtr, Iz.valuesPtr, Iz.size,
    Iy.keysPtr, Iy.valuesPtr, Iy.size,
    G.keysPtr, G.valuesPtr, G.size,
    J.keysPtr, J.valuesPtr, J.size,
    rho.keysPtr, rho.valuesPtr, rho.size,
    numModes,
    freqPtrOut, numFreqOut,
    modesPtrOut, modesRowsOut, modesColsOut,
    massPtrOut, massRowsOut, massColsOut
  );

  const freqPtr = mod.HEAPU32[freqPtrOut / 4];
  const nFreq = mod.HEAPU32[numFreqOut / 4];
  const modesPtr = mod.HEAPU32[modesPtrOut / 4];
  const nRows = mod.HEAPU32[modesRowsOut / 4];
  const nCols = mod.HEAPU32[modesColsOut / 4];
  const massPtr = mod.HEAPU32[massPtrOut / 4];
  const massRows = mod.HEAPU32[massRowsOut / 4];
  const massCols = mod.HEAPU32[massColsOut / 4];

  let frequencies = [], modeShapes = [], massParticipation = [];
  if (nFreq > 0 && freqPtr) {
    frequencies = Array.from(new Float64Array(mod.HEAPF64.buffer, freqPtr, nFreq));
    gc.push(freqPtr);
  }
  if (nRows > 0 && nCols > 0 && modesPtr) {
    const flat = new Float64Array(mod.HEAPF64.buffer, modesPtr, nRows * nCols);
    for (let i = 0; i < nRows; i++)
      modeShapes.push(Array.from(flat.slice(i * nCols, (i + 1) * nCols)));
    gc.push(modesPtr);
  }
  if (massRows > 0 && massCols > 0 && massPtr) {
    const flat = new Float64Array(mod.HEAPF64.buffer, massPtr, massRows * massCols);
    for (let i = 0; i < massRows; i++)
      massParticipation.push(Array.from(flat.slice(i * massCols, (i + 1) * massCols)));
    gc.push(massPtr);
  }

  gc.forEach(ptr => mod._free(ptr));
  return { frequencies, modeShapes, massParticipation };
}

// ══════════════════════════════════════════════════════════════════════
// MODEL GENERATORS
// ══════════════════════════════════════════════════════════════════════

/** Default steel properties (kN, m) */
const STEEL = {
  E: 200e6, G: 77e6, A: 0.01, Iz: 8.33e-5, Iy: 8.33e-5, J: 1.41e-4, rho: 7.85
};

function generateEdificio(params = {}) {
  const svx = params.svx || [5, 5];
  const svy = params.svy || [4, 4];
  const sp = params.sp || [3, 3, 3];
  const mat = { ...STEEL, ...params.mat };

  // Build coordinate arrays
  const xCoords = [0]; for (const s of svx) xCoords.push(xCoords[xCoords.length - 1] + s);
  const yCoords = [0]; for (const s of svy) yCoords.push(yCoords[yCoords.length - 1] + s);
  const zCoords = [0]; for (const s of sp)  zCoords.push(zCoords[zCoords.length - 1] + s);

  const nodes = [];
  const nid = {};
  for (let iz = 0; iz < zCoords.length; iz++)
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length; ix++) {
        nid[`${ix},${iy},${iz}`] = nodes.length;
        nodes.push([xCoords[ix], yCoords[iy], zCoords[iz]]);
      }

  const elements = [];
  // Columns
  for (let iz = 0; iz < zCoords.length - 1; iz++)
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length; ix++)
        elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy},${iz + 1}`]]);
  // Beams X
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length - 1; ix++)
        elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix + 1},${iy},${iz}`]]);
  // Beams Y
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let ix = 0; ix < xCoords.length; ix++)
      for (let iy = 0; iy < yCoords.length - 1; iy++)
        elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy + 1},${iz}`]]);

  // Supports at z=0
  const supports = new Map();
  for (let iy = 0; iy < yCoords.length; iy++)
    for (let ix = 0; ix < xCoords.length; ix++)
      supports.set(nid[`${ix},${iy},0`], [true, true, true, true, true, true]);

  // Gravity loads (CM = weight per node on floors)
  const loads = new Map();
  const totalFloorArea = (xCoords[xCoords.length-1] - xCoords[0]) * (yCoords[yCoords.length-1] - yCoords[0]);
  const nodesPerFloor = xCoords.length * yCoords.length;
  const CM = params.CM || -10; // kN/m2 default
  const loadPerNode = CM * totalFloorArea / nodesPerFloor;
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length; ix++)
        loads.set(nid[`${ix},${iy},${iz}`], [0, 0, loadPerNode, 0, 0, 0]);

  const nodeInputs = { supports, loads };
  const eMap = (v) => new Map(elements.map((_, i) => [i, v]));
  const elementInputs = {
    elasticities: eMap(mat.E), shearModuli: eMap(mat.G),
    areas: eMap(mat.A), momentsOfInertiaZ: eMap(mat.Iz),
    momentsOfInertiaY: eMap(mat.Iy), torsionalConstants: eMap(mat.J),
    densities: eMap(mat.rho),
  };

  return { nodes, elements, nodeInputs, elementInputs,
    info: { type: "edificio", svx, svy, sp, xCoords, yCoords, zCoords,
            totalNodes: nodes.length, totalElements: elements.length } };
}

function generateFrame(params = {}) {
  const nv = params.nv || 3, sv = params.sv || 6;
  const np = params.np || 3, hp = params.hp || 3;
  const mat = { ...STEEL, ...params.mat };

  const xCoords = []; for (let i = 0; i <= nv; i++) xCoords.push(i * sv);
  const zCoords = []; for (let i = 0; i <= np; i++) zCoords.push(i * hp);

  const nodes = [];
  const nid = {};
  for (let iz = 0; iz < zCoords.length; iz++)
    for (let ix = 0; ix < xCoords.length; ix++) {
      nid[`${ix},${iz}`] = nodes.length;
      nodes.push([xCoords[ix], 0, zCoords[iz]]);
    }

  const elements = [];
  for (let iz = 0; iz < zCoords.length - 1; iz++)
    for (let ix = 0; ix < xCoords.length; ix++)
      elements.push([nid[`${ix},${iz}`], nid[`${ix},${iz + 1}`]]);
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let ix = 0; ix < xCoords.length - 1; ix++)
      elements.push([nid[`${ix},${iz}`], nid[`${ix + 1},${iz}`]]);

  const supports = new Map();
  for (let ix = 0; ix < xCoords.length; ix++)
    supports.set(nid[`${ix},0`], [true, true, true, true, true, true]);

  const loads = new Map();
  const CM = params.CM || -10;
  const loadPerNode = CM * sv / 2;
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let ix = 0; ix < xCoords.length; ix++)
      loads.set(nid[`${ix},${iz}`], [0, 0, loadPerNode, 0, 0, 0]);

  const nodeInputs = { supports, loads };
  const eMap = (v) => new Map(elements.map((_, i) => [i, v]));
  const elementInputs = {
    elasticities: eMap(mat.E), shearModuli: eMap(mat.G),
    areas: eMap(mat.A), momentsOfInertiaZ: eMap(mat.Iz),
    momentsOfInertiaY: eMap(mat.Iy), torsionalConstants: eMap(mat.J),
    densities: eMap(mat.rho),
  };

  return { nodes, elements, nodeInputs, elementInputs,
    info: { type: "frame", nv, sv, np, hp,
            totalNodes: nodes.length, totalElements: elements.length } };
}

// ══════════════════════════════════════════════════════════════════════
// OUTPUT / PRINTING
// ══════════════════════════════════════════════════════════════════════

function printModel(model) {
  const { info, nodes, elements, nodeInputs } = model;
  const nSup = nodeInputs.supports ? nodeInputs.supports.size : 0;
  const nLoads = nodeInputs.loads ? nodeInputs.loads.size : 0;
  console.log("=".repeat(72));
  console.log(`  AWATIF FEM CLI | Modelo: ${info.type}`);
  console.log("=".repeat(72));
  console.log(`  Nodos: ${nodes.length}  |  Elementos: ${elements.length}  |  Apoyos: ${nSup}  |  Cargas: ${nLoads}`);
  if (info.svx) console.log(`  svx = [${info.svx.join(", ")}]  svy = [${info.svy.join(", ")}]  sp = [${info.sp.join(", ")}]`);
  if (info.nv) console.log(`  nv=${info.nv}  sv=${info.sv}  np=${info.np}  hp=${info.hp}`);
}

function printStatic(result, nodes, nodeInputs) {
  console.log("\n" + "-".repeat(72));
  console.log("  ANALISIS ESTATICO (Ku=F)");
  console.log("-".repeat(72));

  let maxU = 0, maxNode = 0;
  result.deformations.forEach((d, i) => {
    const mag = Math.sqrt(d[0]**2 + d[1]**2 + d[2]**2);
    if (mag > maxU) { maxU = mag; maxNode = i; }
  });
  console.log(`  Max |U| = ${maxU.toExponential(4)}  (nodo ${maxNode})`);

  // Top 10 displacements
  const sorted = [...result.deformations.entries()]
    .map(([i, d]) => ({ i, mag: Math.sqrt(d[0]**2 + d[1]**2 + d[2]**2), d }))
    .sort((a, b) => b.mag - a.mag)
    .slice(0, 10);

  console.log(`\n  Top 10 desplazamientos:`);
  console.log(`  ${"Nodo".padStart(6)}  ${"Ux".padStart(12)}  ${"Uy".padStart(12)}  ${"Uz".padStart(12)}  ${"|U|".padStart(12)}`);
  console.log("  " + "-".repeat(56));
  for (const s of sorted) {
    console.log(`  ${String(s.i).padStart(6)}  ${s.d[0].toExponential(4).padStart(12)}  ${s.d[1].toExponential(4).padStart(12)}  ${s.d[2].toExponential(4).padStart(12)}  ${s.mag.toExponential(4).padStart(12)}`);
  }

  // Reactions
  if (result.reactions.size > 0) {
    console.log(`\n  Reacciones (${result.reactions.size} apoyos):`);
    console.log(`  ${"Nodo".padStart(6)}  ${"Rx".padStart(12)}  ${"Ry".padStart(12)}  ${"Rz".padStart(12)}`);
    console.log("  " + "-".repeat(44));
    let sumRz = 0;
    result.reactions.forEach((r, i) => {
      console.log(`  ${String(i).padStart(6)}  ${r[0].toFixed(3).padStart(12)}  ${r[1].toFixed(3).padStart(12)}  ${r[2].toFixed(3).padStart(12)}`);
      sumRz += r[2];
    });
    console.log("  " + "-".repeat(44));
    console.log(`  ${"TOTAL".padStart(6)}  ${"".padStart(12)}  ${"".padStart(12)}  ${sumRz.toFixed(3).padStart(12)}`);
  }
}

function printModal(result) {
  console.log("\n" + "-".repeat(72));
  console.log("  ANALISIS MODAL (K*phi = w2*M*phi)");
  console.log("-".repeat(72));

  const dirs = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"];
  console.log(`\n  ${"Modo".padStart(4)}  ${"f (Hz)".padStart(10)}  ${"T (s)".padStart(10)}  ${"w (rad/s)".padStart(12)}`);
  console.log("  " + "-".repeat(40));
  for (let i = 0; i < result.frequencies.length; i++) {
    const f = result.frequencies[i];
    const T = f > 0 ? 1 / f : 0;
    const w = f * 2 * Math.PI;
    console.log(`  ${String(i + 1).padStart(4)}  ${f.toFixed(4).padStart(10)}  ${T.toFixed(4).padStart(10)}  ${w.toFixed(4).padStart(12)}`);
  }

  if (result.massParticipation.length > 0) {
    console.log(`\n  Masa Participativa (%):`);
    console.log(`  ${"Modo".padStart(4)}  ${dirs.map(d => d.padStart(8)).join("  ")}`);
    console.log("  " + "-".repeat(56));
    for (let i = 0; i < result.massParticipation.length; i++) {
      const mp = result.massParticipation[i];
      const vals = mp.map(v => (v * 100).toFixed(1).padStart(7) + "%").join("  ");
      console.log(`  ${String(i + 1).padStart(4)}  ${vals}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════

function parseArgs(args) {
  const params = {};
  let doStatic = false, doModal = false, jsonOut = null;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--static") { doStatic = true; continue; }
    if (a === "--modal") { doModal = true; continue; }
    if (a === "--json" && i + 1 < args.length) { jsonOut = args[++i]; continue; }
    if (a === "--modes" && i + 1 < args.length) { params.modes = parseInt(args[++i]); continue; }
    if (a.includes("=")) {
      const [k, v] = a.split("=");
      if (v.includes(",")) params[k] = v.split(",").map(Number);
      else params[k] = Number(v);
    }
  }

  // Default: both
  if (!doStatic && !doModal) { doStatic = true; doModal = true; }

  return { params, doStatic, doModal, jsonOut };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "help") {
    console.log(`
Awatif FEM CLI — Analisis Estructural sin UI
=============================================
Uso: node cli.mjs <generador> [parametros] [opciones]

Generadores:
  edificio   Edificio 3D (svx, svy, sp, CM)
  frame      Portico 2D  (nv, sv, np, hp, CM)

Parametros (edificio):
  svx=5,5,3    Luces individuales en X (m)
  svy=4,4      Luces individuales en Y (m)
  sp=3,3,3     Alturas de piso (m)
  CM=-10       Carga muerta (kN/m2)

Parametros (frame):
  nv=3         Numero de vanos
  sv=6         Luz de vano (m)
  np=3         Numero de pisos
  hp=3         Altura de piso (m)
  CM=-10       Carga muerta (kN/m)

Opciones:
  --static     Solo analisis estatico
  --modal      Solo analisis modal
  --modes 12   Numero de modos (default 6)
  --json f.json  Exportar resultados a JSON

Ejemplos:
  node cli.mjs edificio
  node cli.mjs edificio svx=6,4,6 svy=5,5 sp=3,3,3,3
  node cli.mjs edificio --modal --modes 12
  node cli.mjs frame nv=4 sv=5 np=5 hp=3.2
  node cli.mjs frame --json results.json
`);
    return;
  }

  const gen = args[0];
  const { params, doStatic, doModal, jsonOut } = parseArgs(args.slice(1));

  let model;
  if (gen === "edificio") {
    const p = {};
    if (params.svx) p.svx = Array.isArray(params.svx) ? params.svx : [params.svx];
    if (params.svy) p.svy = Array.isArray(params.svy) ? params.svy : [params.svy];
    if (params.sp) p.sp = Array.isArray(params.sp) ? params.sp : [params.sp];
    if (params.CM) p.CM = params.CM;
    if (params.np) p.sp = Array(params.np).fill(params.hp || 3);
    model = generateEdificio(p);
  } else if (gen === "frame") {
    model = generateFrame(params);
  } else {
    console.log(`Generador desconocido: ${gen}. Use: edificio, frame`);
    return;
  }

  printModel(model);

  const output = { model: model.info };
  const t0 = performance.now();

  if (doStatic) {
    const ts = performance.now();
    const staticResult = runDeform(model.nodes, model.elements, model.nodeInputs, model.elementInputs);
    const staticTime = performance.now() - ts;
    printStatic(staticResult, model.nodes, model.nodeInputs);
    console.log(`  Tiempo: ${(staticTime).toFixed(1)} ms`);

    output.static = {
      maxDisplacement: [...staticResult.deformations.values()].reduce((max, d) => {
        const m = Math.sqrt(d[0]**2 + d[1]**2 + d[2]**2);
        return m > max ? m : max;
      }, 0),
      deformations: Object.fromEntries(staticResult.deformations),
      reactions: Object.fromEntries(staticResult.reactions),
    };
  }

  if (doModal) {
    const numModes = params.modes || 6;
    const tm = performance.now();
    const modalResult = runModal(model.nodes, model.elements, model.nodeInputs, model.elementInputs, numModes);
    const modalTime = performance.now() - tm;
    printModal(modalResult);
    console.log(`  Tiempo: ${(modalTime).toFixed(1)} ms`);

    output.modal = {
      frequencies: modalResult.frequencies,
      periods: modalResult.frequencies.map(f => f > 0 ? 1/f : 0),
      massParticipation: modalResult.massParticipation,
    };
  }

  const totalTime = performance.now() - t0;
  console.log("\n" + "=".repeat(72));
  console.log(`  TOTAL: ${totalTime.toFixed(1)} ms`);
  console.log("=".repeat(72));

  if (jsonOut) {
    writeFileSync(jsonOut, JSON.stringify(output, null, 2));
    console.log(`  Resultados exportados: ${jsonOut}`);
  }
}

main();
