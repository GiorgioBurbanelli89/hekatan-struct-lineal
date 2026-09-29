/**
 * Didactic FEM Solver — TypeScript wrapper for C++/WASM
 *
 * Calls the C++ didactic_solve() via Emscripten and parses the flat output
 * arrays into structured TypeScript objects with all intermediate FEM steps.
 *
 * JS is slow at matrix math (multiply, factorize, solve) → all done in Eigen C++.
 * JS only handles: data marshalling, UI display, string formatting.
 */

import {
  Node,
  Element,
  ElementInputs,
  NodeInputs,
} from "./data-model.js";
import createModule from "./cpp/built/deform.js";

// @ts-ignore
const mod = await createModule();

// ═══════════════════════════════════════════════════════
// OUTPUT TYPES (structured intermediate results)
// ═══════════════════════════════════════════════════════

export interface DidacticElementData {
  index: number;
  type: "frame" | "shell-Q4";
  nDOF: number;

  // Matrices (row-major flat → can be reshaped to nDOF×nDOF)
  K_local: number[][];     // local stiffness matrix
  T: number[][];           // transformation matrix
  K_global: number[][];    // global element stiffness = T^T · K_local · T
  lambda: number[][];      // direction cosines (3×3)

  // Properties
  L: number;       // element length (frames only)
  E: number;       // Young's modulus
  A: number;       // cross-section area
  Iz: number;      // moment of inertia Z
  Iy: number;      // moment of inertia Y
  G: number;       // shear modulus
  J: number;       // torsional constant
  t: number;       // thickness (shells)
  nu: number;      // Poisson's ratio
  phiZ: number;    // Timoshenko shear param Z
  phiY: number;    // Timoshenko shear param Y
}

export interface SparseEntry {
  row: number;
  col: number;
  value: number;
}

export interface DidacticSolverResult {
  nNodes: number;
  nElements: number;
  nDOF: number;

  // Per-element step data
  elements: DidacticElementData[];

  // Global assembled K (sparse triplets — efficient for large models)
  K_assembled_sparse: SparseEntry[];
  K_assembled_nnz: number;

  // Force, displacement, reaction vectors
  F_applied: number[];
  U_full: number[];
  R_full: number[];

  // DOF classification
  freeDOFs: number[];
  fixedDOFs: number[];
}

// ═══════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════

export function didacticSolveCpp(
  nodes: Node[],
  elements: Element[],
  nodeInputs: NodeInputs,
  elementInputs: ElementInputs
): DidacticSolverResult {
  if (nodes.length === 0) {
    return {
      nNodes: 0, nElements: 0, nDOF: 0,
      elements: [],
      K_assembled_sparse: [], K_assembled_nnz: 0,
      F_applied: [], U_full: [], R_full: [],
      freeDOFs: [], fixedDOFs: [],
    };
  }

  const gc: number[] = []; // pointers to free

  // --- Allocate input data ---
  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64);
  gc.push(nodesPtr);

  const elementIndices = elements.flat();
  const elementsPtr = allocate(elementIndices, Uint32Array, mod.HEAPU32);
  gc.push(elementsPtr);
  const elementSizes = elements.map((e) => e.length);
  const elementSizesPtr = allocate(elementSizes, Uint32Array, mod.HEAPU32);
  gc.push(elementSizesPtr);

  // Supports
  const supportKeys = nodeInputs.supports ? Array.from(nodeInputs.supports.keys()) : [];
  const supportValues = nodeInputs.supports
    ? Array.from(nodeInputs.supports.values()).flat().map((b) => (b ? 1 : 0))
    : [];
  const supportKeysPtr = allocate(supportKeys, Uint32Array, mod.HEAPU32);
  gc.push(supportKeysPtr);
  const supportValuesPtr = allocate(supportValues, Uint8Array, mod.HEAPU8);
  gc.push(supportValuesPtr);

  // Loads
  const loadKeys = nodeInputs.loads ? Array.from(nodeInputs.loads.keys()) : [];
  const loadValues = nodeInputs.loads ? Array.from(nodeInputs.loads.values()).flat() : [];
  const loadKeysPtr = allocate(loadKeys, Uint32Array, mod.HEAPU32);
  gc.push(loadKeysPtr);
  const loadValuesPtr = allocate(loadValues, Float64Array, mod.HEAPF64);
  gc.push(loadValuesPtr);

  // Element Inputs helper
  const processMap = (inputMap: Map<number, number> | undefined) => {
    const keys = inputMap ? Array.from(inputMap.keys()) : [];
    const values = inputMap ? Array.from(inputMap.values()) : [];
    const keysPtr = allocate(keys, Uint32Array, mod.HEAPU32);
    gc.push(keysPtr);
    const valuesPtr = allocate(values, Float64Array, mod.HEAPF64);
    gc.push(valuesPtr);
    return { keysPtr, valuesPtr, size: keys.length };
  };

  const elasticities = processMap(elementInputs.elasticities);
  const areas = processMap(elementInputs.areas);
  const moiZ = processMap(elementInputs.momentsOfInertiaZ);
  const moiY = processMap(elementInputs.momentsOfInertiaY);
  const shearMod = processMap(elementInputs.shearModuli);
  const torsion = processMap(elementInputs.torsionalConstants);
  const thickness = processMap(elementInputs.thicknesses);
  const poisson = processMap(elementInputs.poissonsRatios);
  const shearAreaY = processMap(elementInputs.shearAreasY);
  const shearAreaZ = processMap(elementInputs.shearAreasZ);
  // formulación de la cáscara: enteros (placa, drilling) y el factor del drilling
  const processMapInt = (inputMap: Map<number, number> | undefined) => {
    const keys = inputMap ? Array.from(inputMap.keys()) : [];
    const values = inputMap ? Array.from(inputMap.values()).map((v) => Math.round(Number(v))) : [];
    const keysPtr = allocate(keys, Uint32Array, mod.HEAPU32);
    gc.push(keysPtr);
    const valuesPtr = allocate(values, Uint32Array, mod.HEAPU32);
    gc.push(valuesPtr);
    return { keysPtr, valuesPtr, size: keys.length };
  };
  const plateForm = processMapInt((elementInputs as any).plateFormulations);
  const drillType = processMapInt((elementInputs as any).drillingTypes);
  const drillScale = processMap((elementInputs as any).drillingPenaltyScales);

  // Output pointers (6 pairs: ptr + size)
  const elemDataPtrOut = mod._malloc(4); gc.push(elemDataPtrOut);
  const elemDataSizeOut = mod._malloc(4); gc.push(elemDataSizeOut);
  const kTripletsPtrOut = mod._malloc(4); gc.push(kTripletsPtrOut);
  const kTripletsSizeOut = mod._malloc(4); gc.push(kTripletsSizeOut);
  const solutionPtrOut = mod._malloc(4); gc.push(solutionPtrOut);
  const solutionSizeOut = mod._malloc(4); gc.push(solutionSizeOut);

  // --- Call C++ didactic_solve ---
  mod._didactic_solve(
    nodesPtr, nodes.length,
    elementsPtr, elementIndices.length,
    elementSizesPtr, elements.length,
    // Node Inputs
    supportKeysPtr, supportValuesPtr, supportKeys.length,
    loadKeysPtr, loadValuesPtr, loadKeys.length,
    // Element Inputs
    elasticities.keysPtr, elasticities.valuesPtr, elasticities.size,
    areas.keysPtr, areas.valuesPtr, areas.size,
    moiZ.keysPtr, moiZ.valuesPtr, moiZ.size,
    moiY.keysPtr, moiY.valuesPtr, moiY.size,
    shearMod.keysPtr, shearMod.valuesPtr, shearMod.size,
    torsion.keysPtr, torsion.valuesPtr, torsion.size,
    thickness.keysPtr, thickness.valuesPtr, thickness.size,
    poisson.keysPtr, poisson.valuesPtr, poisson.size,
    shearAreaY.keysPtr, shearAreaY.valuesPtr, shearAreaY.size,
    shearAreaZ.keysPtr, shearAreaZ.valuesPtr, shearAreaZ.size,
    // Outputs
    elemDataPtrOut, elemDataSizeOut,
    kTripletsPtrOut, kTripletsSizeOut,
    solutionPtrOut, solutionSizeOut,
    // formulación de la cáscara (al final: el wasm viejo los ignora)
    plateForm.keysPtr, plateForm.valuesPtr, plateForm.size,
    drillType.keysPtr, drillType.valuesPtr, drillType.size,
    drillScale.keysPtr, drillScale.valuesPtr, drillScale.size,
  );

  // --- Read outputs ---
  const elemDataPtr = mod.HEAPU32[elemDataPtrOut / 4];
  const elemDataSize = mod.HEAPU32[elemDataSizeOut / 4];
  const kTripletsPtr = mod.HEAPU32[kTripletsPtrOut / 4];
  const kTripletsSize = mod.HEAPU32[kTripletsSizeOut / 4];
  const solutionPtr = mod.HEAPU32[solutionPtrOut / 4];
  const solutionSize = mod.HEAPU32[solutionSizeOut / 4];

  // Parse elem_data
  const elemDataRaw = elemDataPtr && elemDataSize > 0
    ? Array.from(new Float64Array(mod.HEAPF64.buffer, elemDataPtr, elemDataSize))
    : [];

  // Parse K triplets
  const kTripletsRaw = kTripletsPtr && kTripletsSize > 0
    ? Array.from(new Float64Array(mod.HEAPF64.buffer, kTripletsPtr, kTripletsSize))
    : [];

  // Parse solution
  const solutionRaw = solutionPtr && solutionSize > 0
    ? Array.from(new Float64Array(mod.HEAPF64.buffer, solutionPtr, solutionSize))
    : [];

  // Free WASM memory
  if (elemDataPtr) gc.push(elemDataPtr);
  if (kTripletsPtr) gc.push(kTripletsPtr);
  if (solutionPtr) gc.push(solutionPtr);
  gc.forEach((ptr) => mod._free(ptr));

  // --- Parse structured data ---
  return parseDidacticOutput(
    elemDataRaw, kTripletsRaw, solutionRaw,
    nodes.length, elements.length
  );
}

// ═══════════════════════════════════════════════════════
// PARSE flat arrays into structured output
// ═══════════════════════════════════════════════════════

function parseDidacticOutput(
  elemData: number[],
  kTriplets: number[],
  solution: number[],
  nNodes: number,
  nElements: number
): DidacticSolverResult {
  const nDOF = nNodes * 6;

  // --- Parse element data ---
  const elements: DidacticElementData[] = [];

  if (elemData.length > 0) {
    const nElems = elemData[0];
    const offsets: number[] = [];
    for (let i = 0; i < nElems; i++) {
      offsets.push(elemData[1 + i]);
    }

    for (let e = 0; e < nElems; e++) {
      let pos = offsets[e];
      const elemIdx = elemData[pos++];
      const typeCode = elemData[pos++];
      const nLocalDOF = elemData[pos++];
      const n2 = nLocalDOF * nLocalDOF;

      // K_local (nDOF × nDOF)
      const K_local = reshapeMatrix(elemData.slice(pos, pos + n2), nLocalDOF);
      pos += n2;

      // T (nDOF × nDOF)
      const T = reshapeMatrix(elemData.slice(pos, pos + n2), nLocalDOF);
      pos += n2;

      // K_global (nDOF × nDOF)
      const K_global = reshapeMatrix(elemData.slice(pos, pos + n2), nLocalDOF);
      pos += n2;

      // lambda (3×3)
      const lambda = reshapeMatrix(elemData.slice(pos, pos + 9), 3);
      pos += 9;

      // Properties (11 values)
      const L = elemData[pos++];
      const E = elemData[pos++];
      const A = elemData[pos++];
      const Iz = elemData[pos++];
      const Iy = elemData[pos++];
      const G = elemData[pos++];
      const J = elemData[pos++];
      const t = elemData[pos++];
      const nu = elemData[pos++];
      const phiZ = elemData[pos++];
      const phiY = elemData[pos++];

      elements.push({
        index: elemIdx,
        type: typeCode === 0 ? "frame" : "shell-Q4",
        nDOF: nLocalDOF,
        K_local, T, K_global, lambda,
        L, E, A, Iz, Iy, G, J, t, nu, phiZ, phiY,
      });
    }
  }

  // --- Parse K triplets ---
  const K_assembled_sparse: SparseEntry[] = [];
  let K_assembled_nnz = 0;
  if (kTriplets.length > 0) {
    K_assembled_nnz = kTriplets[0];
    for (let i = 0; i < K_assembled_nnz; i++) {
      const base = 1 + i * 3;
      K_assembled_sparse.push({
        row: kTriplets[base],
        col: kTriplets[base + 1],
        value: kTriplets[base + 2],
      });
    }
  }

  // --- Parse solution ---
  let F_applied: number[] = [];
  let U_full: number[] = [];
  let R_full: number[] = [];
  let freeDOFs: number[] = [];
  let fixedDOFs: number[] = [];

  if (solution.length > 0) {
    let pos = 0;
    const solDOF = solution[pos++];

    F_applied = solution.slice(pos, pos + solDOF);
    pos += solDOF;

    U_full = solution.slice(pos, pos + solDOF);
    pos += solDOF;

    R_full = solution.slice(pos, pos + solDOF);
    pos += solDOF;

    const nFree = solution[pos++];
    freeDOFs = solution.slice(pos, pos + nFree).map(Math.round);
    pos += nFree;

    const nFixed = solution[pos++];
    fixedDOFs = solution.slice(pos, pos + nFixed).map(Math.round);
  }

  return {
    nNodes, nElements, nDOF,
    elements,
    K_assembled_sparse, K_assembled_nnz,
    F_applied, U_full, R_full,
    freeDOFs, fixedDOFs,
  };
}

// ═══════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════

/** Reshape flat array to n×n matrix (row-major) */
function reshapeMatrix(flat: number[], n: number): number[][] {
  const M: number[][] = [];
  for (let i = 0; i < n; i++) {
    M.push(flat.slice(i * n, (i + 1) * n));
  }
  return M;
}

type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

function allocate<T extends TypedArrayConstructor>(
  data: number[],
  TypedArrayCtor: T,
  heapTypedArray: InstanceType<T>
): number {
  const buffer = new TypedArrayCtor(data);
  const pointer = mod._malloc(buffer.length * buffer.BYTES_PER_ELEMENT);
  // Releer la vista del heap DESPUES del _malloc. Con -s ALLOW_MEMORY_GROWTH, si el
  // malloc necesita agrandar la memoria, emscripten crea un ArrayBuffer NUEVO y todas
  // las vistas viejas (mod.HEAPF64, HEAPU32, HEAPU8) quedan DETACHED. Como el argumento
  // `heapTypedArray` se evalua en el sitio de llamada (antes del malloc), usarlo tal cual
  // lanza "Cannot perform %TypedArray%.prototype.set on a detached ArrayBuffer" — y pasa
  // justo con los modelos grandes, que son los que obligan a crecer el heap.
  const heap: any =
    (TypedArrayCtor as any) === Float64Array ? mod.HEAPF64 :
    (TypedArrayCtor as any) === Uint32Array  ? mod.HEAPU32 :
    (TypedArrayCtor as any) === Uint8Array   ? mod.HEAPU8  :
    heapTypedArray;
  heap.set(buffer, pointer / buffer.BYTES_PER_ELEMENT);

  return pointer;
}
