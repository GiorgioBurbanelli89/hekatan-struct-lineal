#!/usr/bin/env node
/**
 * CLI Modal Analysis — Hekatan FEM (Eigen WASM)
 * Runs Example 6.3 Space Frame (Paz & Leigh) directly from Node.js
 * Uses the same C++/Eigen WASM solver as the browser version.
 *
 * Usage:  node cli_modal.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load WASM module manually (Emscripten ES6 module) ──────────────
// ⚠️ `..` a proposito: el WASM es el del PAQUETE, no una copia dentro de cli/.
// Habia una copia duplicada en `cli/hekatan-fem/` (ignorada por git) y el CLI
// cargaba ESA. Hoy 19-ago-2026 daban el mismo binario byte a byte, pero por
// sincronizacion a mano: en cuanto se recompile el paquete y no se copie, el
// CLI resuelve con un motor VIEJO y no avisa. El caso `cli-igual-que-wasm` de
// la suite vigila que no vuelva a pasar.
const wasmPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.js");

// Dynamic import of the Emscripten module factory
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({
  wasmBinary: readFileSync(wasmPath),
});

// ── Allocator helper (same as modalCpp.ts) ─────────────────────────
function allocate(data, TypedArrayCtor, heapTypedArray) {
  const buffer = new TypedArrayCtor(data);
  const pointer = mod._malloc(buffer.length * buffer.BYTES_PER_ELEMENT);
  heapTypedArray.set(buffer, pointer / buffer.BYTES_PER_ELEMENT);
  return pointer;
}

// ── Modal analysis wrapper ─────────────────────────────────────────
function modalAnalysis(nodes, elements, nodeInputs, elementInputs, numModes) {
  const gc = [];

  // Nodes
  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64);
  gc.push(nodesPtr);

  // Elements
  const elementIndices = elements.flat();
  const elementsPtr = allocate(elementIndices, Uint32Array, mod.HEAPU32);
  gc.push(elementsPtr);
  const elementSizes = elements.map(e => e.length);
  const elementSizesPtr = allocate(elementSizes, Uint32Array, mod.HEAPU32);
  gc.push(elementSizesPtr);

  // Supports
  const supportKeys = nodeInputs.supports ? Array.from(nodeInputs.supports.keys()) : [];
  const supportValues = nodeInputs.supports
    ? Array.from(nodeInputs.supports.values()).flat().map(b => b ? 1 : 0)
    : [];
  const supportKeysPtr = allocate(supportKeys, Uint32Array, mod.HEAPU32);
  gc.push(supportKeysPtr);
  const supportValuesPtr = allocate(supportValues, Uint8Array, mod.HEAPU8);
  gc.push(supportValuesPtr);

  // Element inputs helper
  const processInput = (inputMap) => {
    const keys = inputMap ? Array.from(inputMap.keys()) : [];
    const values = inputMap ? Array.from(inputMap.values()) : [];
    const keysPtr = allocate(keys, Uint32Array, mod.HEAPU32);
    gc.push(keysPtr);
    const valuesPtr = allocate(values, Float64Array, mod.HEAPF64);
    gc.push(valuesPtr);
    return { keysPtr, valuesPtr, size: keys.length };
  };

  const elasticities = processInput(elementInputs.elasticities);
  const areas = processInput(elementInputs.areas);
  const moiZ = processInput(elementInputs.momentsOfInertiaZ);
  const moiY = processInput(elementInputs.momentsOfInertiaY);
  const shearMod = processInput(elementInputs.shearModuli);
  const torsion = processInput(elementInputs.torsionalConstants);
  const densities = processInput(elementInputs.densities);

  // Estos cinco los pide modal() desde que se le anadieron los shells y sus
  // modificadores. Este CLI no los pasaba y el WASM leia fuera de memoria
  // ("memory access out of bounds"). El modelo de Paz es todo barras, asi que
  // van vacios — pero tienen que ir.
  const thicknesses = processInput(elementInputs.thicknesses);
  const poissons = processInput(elementInputs.poissonsRatios);
  const memmods = processInput(elementInputs.membraneModifiers);
  const bendmods = processInput(elementInputs.bendingModifiers);
  const plateFormKeysPtr = allocate([], Uint32Array, mod.HEAPU32);
  gc.push(plateFormKeysPtr);
  // HEAP32 no esta exportado por el build; el array va vacio, asi que no se
  // escribe nada y HEAPU32 sirve igual para reservar el puntero.
  const plateFormValsPtr = allocate([], Uint32Array, mod.HEAPU32);
  gc.push(plateFormValsPtr);
  const LATERAL_MASS = 0;   // masa 3D completa, no la lateral por piso de ETABS

  // Output pointers
  const freqPtrOut = mod._malloc(4); gc.push(freqPtrOut);
  const numFreqOut = mod._malloc(4); gc.push(numFreqOut);
  const modesPtrOut = mod._malloc(4); gc.push(modesPtrOut);
  const modesRowsOut = mod._malloc(4); gc.push(modesRowsOut);
  const modesColsOut = mod._malloc(4); gc.push(modesColsOut);
  const massPtrOut = mod._malloc(4); gc.push(massPtrOut);
  const massRowsOut = mod._malloc(4); gc.push(massRowsOut);
  const massColsOut = mod._malloc(4); gc.push(massColsOut);

  // Call C++ modal()
  mod._modal(
    nodesPtr, nodes.length,
    elementsPtr, elementIndices.length,
    elementSizesPtr, elements.length,
    supportKeysPtr, supportValuesPtr, supportKeys.length,
    elasticities.keysPtr, elasticities.valuesPtr, elasticities.size,
    areas.keysPtr, areas.valuesPtr, areas.size,
    moiZ.keysPtr, moiZ.valuesPtr, moiZ.size,
    moiY.keysPtr, moiY.valuesPtr, moiY.size,
    shearMod.keysPtr, shearMod.valuesPtr, shearMod.size,
    torsion.keysPtr, torsion.valuesPtr, torsion.size,
    densities.keysPtr, densities.valuesPtr, densities.size,
    thicknesses.keysPtr, thicknesses.valuesPtr, thicknesses.size,
    poissons.keysPtr, poissons.valuesPtr, poissons.size,
    memmods.keysPtr, memmods.valuesPtr, memmods.size,
    bendmods.keysPtr, bendmods.valuesPtr, bendmods.size,
    plateFormKeysPtr, plateFormValsPtr, 0,
    numModes, LATERAL_MASS,
    freqPtrOut, numFreqOut,
    modesPtrOut, modesRowsOut, modesColsOut,
    massPtrOut, massRowsOut, massColsOut
  );

  // Read outputs
  const freqPtr = mod.HEAPU32[freqPtrOut / 4];
  const nFreq = mod.HEAPU32[numFreqOut / 4];
  const modesPtr = mod.HEAPU32[modesPtrOut / 4];
  const nRows = mod.HEAPU32[modesRowsOut / 4];
  const nCols = mod.HEAPU32[modesColsOut / 4];
  const massPtr = mod.HEAPU32[massPtrOut / 4];
  const massRows = mod.HEAPU32[massRowsOut / 4];
  const massCols = mod.HEAPU32[massColsOut / 4];

  let frequencies = [];
  let modeShapes = [];
  let massParticipation = [];

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

// ============================================================================
// MODEL — Example 6.3 Space Frame (Paz & Leigh) — NO diagonals
// ============================================================================

const E = 29500;
const nu = 0.3;
const G_val = E / (2 * (1 + nu));
const H = 180, BX = 114, BY = 240;
const RHO = 490 / 1000 / (12 ** 3) / 386.4;

const COL_A = 43.0, COL_Iz = 5630, COL_Iy = 391, COL_J = 34.8;
const GIR_A = 24.7, GIR_Iz = 928,  GIR_Iy = 225, GIR_J = 5.90;

const NUM_MODES = 6;

const nodes = [
  [0,  0,  0],  [0,  0,  H],
  [0,  BY, 0],  [0,  BY, H],
  [BX, 0,  0],  [BX, 0,  H],
  [BX, BY, 0],  [BX, BY, H],
];

const elements = [
  [0, 1], [2, 3], [4, 5], [6, 7],   // 4 columns
  [1, 5], [3, 7], [1, 3], [5, 7],   // 4 top girders
];

const nodeInputs = {
  supports: new Map([
    [0, [true,true,true,true,true,true]],
    [2, [true,true,true,true,true,true]],
    [4, [true,true,true,true,true,true]],
    [6, [true,true,true,true,true,true]],
  ]),
};

const eMap = (colVal, girVal) =>
  new Map(elements.map((_, i) => [i, i < 4 ? colVal : girVal]));

const elementInputs = {
  elasticities:       eMap(E, E),
  shearModuli:        eMap(G_val, G_val),
  areas:              eMap(COL_A, GIR_A),
  momentsOfInertiaY:  eMap(COL_Iy, GIR_Iy),   // debil  -> I22
  momentsOfInertiaZ:  eMap(COL_Iz, GIR_Iz),   // fuerte -> I33
  torsionalConstants: eMap(COL_J, GIR_J),
  densities:          new Map(elements.map((_, i) => [i, RHO])),
};

// ============================================================================
// RUN
// ============================================================================

console.log("=".repeat(72));
console.log("  HEKATAN (Eigen WASM) Modal Analysis — CLI");
console.log("  Example 6.3 Space Frame (Paz & Leigh) — No diagonals");
console.log("=".repeat(72));
console.log(`  E=${E} ksi, G=${G_val.toFixed(2)} ksi, rho=${RHO.toExponential(4)}`);
console.log(`  Cols: W24x146 (A=${COL_A}, Iz=${COL_Iz}, Iy=${COL_Iy}, J=${COL_J})`);
console.log(`  Girs: W14x84  (A=${GIR_A}, Iz=${GIR_Iz}, Iy=${GIR_Iy}, J=${GIR_J})`);
console.log("-".repeat(72));

const result = modalAnalysis(nodes, elements, nodeInputs, elementInputs, NUM_MODES);

const dirs = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"];

console.log(`\n  ${"Mode".padStart(4)}  ${"Freq (Hz)".padStart(12)}  ${"Period (s)".padStart(12)}  ${"omega (rad/s)".padStart(14)}`);
console.log("  " + "-".repeat(46));

const freqValues = [];
for (let i = 0; i < result.frequencies.length; i++) {
  const f = result.frequencies[i];
  const omega = f * 2 * Math.PI;
  const T = f > 0 ? 1 / f : 0;
  freqValues.push(f);
  console.log(`  ${String(i+1).padStart(4)}  ${f.toFixed(4).padStart(12)}  ${T.toFixed(4).padStart(12)}  ${omega.toFixed(4).padStart(14)}`);
}

if (result.massParticipation.length > 0) {
  console.log(`\n  Mass Participation Factors:`);
  console.log(`  ${"Mode".padStart(4)}  ${dirs.map(d => d.padStart(8)).join("  ")}`);
  console.log("  " + "-".repeat(56));
  for (let i = 0; i < result.massParticipation.length; i++) {
    const mp = result.massParticipation[i];
    const vals = mp.map(v => (v * 100).toFixed(1).padStart(7) + "%").join("  ");
    console.log(`  ${String(i+1).padStart(4)}  ${vals}`);
  }
}

// Output for piping to comparison script
console.log("\n" + "-".repeat(72));
console.log("  For comparison, run:");
console.log(`  python test_modal_comparison.py --awatif ${freqValues.map(f => f.toFixed(4)).join(" ")}`);
