/**
 * modalPazCpp.ts — TypeScript wrapper for modal_paz WASM function
 *
 * Alternative to modalCpp.ts that uses the Paz formulation:
 *   - Accepts polarMomentsOfInertia (I0) in ElementInputs
 *   - If I0 is provided, uses it for torsional mass (Paz formulation)
 *   - If I0 is not provided, falls back to Ip = Iy + Iz (same as default)
 *
 * Usage:
 *   import { modalPazCpp } from "./modalPazCpp.js";
 *   const result = modalPazCpp(nodes, elements, nodeInputs, elementInputs, 6);
 */

import {
  Node,
  Element,
  ElementInputs,
  NodeInputs,
  ModalOutputs,
} from "./data-model.js";
import createModule from "./cpp/built/deform.js";

// @ts-ignore, load wasm
const mod = await createModule();

export function modalPazCpp(
  nodes: Node[],
  elements: Element[],
  nodeInputs: NodeInputs,
  elementInputs: ElementInputs,
  numModes: number = 10
): ModalOutputs {
  if (nodes.length === 0)
    return { frequencies: [], modeShapes: [], massParticipation: [] };

  const gc: number[] = [];

  // 1- Allocate data
  // Nodes
  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64);
  gc.push(nodesPtr);

  // Elements
  const elementIndices = elements.flat();
  const elementsPtr = allocate(elementIndices, Uint32Array, mod.HEAPU32);
  gc.push(elementsPtr);
  const elementSizes = elements.map((e) => e.length);
  const elementSizesPtz = allocate(elementSizes, Uint32Array, mod.HEAPU32);
  gc.push(elementSizesPtz);

  // NodeInputs.supports
  const supportKeys = nodeInputs.supports
    ? Array.from(nodeInputs.supports.keys())
    : [];
  const supportValues = nodeInputs.supports
    ? Array.from(nodeInputs.supports.values())
        .flat()
        .map((b) => (b ? 1 : 0))
    : [];
  const supportKeysPtr = allocate(supportKeys, Uint32Array, mod.HEAPU32);
  gc.push(supportKeysPtr);
  const supportValuesPtr = allocate(supportValues, Uint8Array, mod.HEAPU8);
  gc.push(supportValuesPtr);

  // ElementInputs
  const processElementInput = (inputMap: Map<number, number> | undefined) => {
    const keys = inputMap ? Array.from(inputMap.keys()) : [];
    const values = inputMap ? Array.from(inputMap.values()) : [];
    const keysPtr = allocate(keys, Uint32Array, mod.HEAPU32);
    gc.push(keysPtr);
    const valuesPtr = allocate(values, Float64Array, mod.HEAPF64);
    gc.push(valuesPtr);
    return { keysPtr, valuesPtr, size: keys.length };
  };

  const elasticities = processElementInput(elementInputs.elasticities);
  const areas = processElementInput(elementInputs.areas);
  const moiZ = processElementInput(elementInputs.momentsOfInertiaZ);
  const moiY = processElementInput(elementInputs.momentsOfInertiaY);
  const shearMod = processElementInput(elementInputs.shearModuli);
  const torsion = processElementInput(elementInputs.torsionalConstants);
  const densities = processElementInput(elementInputs.densities);
  // Shells: thicknesses + poissons + property modifiers
  const thicknesses = processElementInput((elementInputs as any).thicknesses);
  const poissons = processElementInput((elementInputs as any).poissonsRatios);
  const memMods = processElementInput((elementInputs as any).membraneModifiers);
  const bendMods = processElementInput((elementInputs as any).bendingModifiers);
  // NEW: polar moment of inertia (I0)
  const polarMoi = processElementInput(elementInputs.polarMomentsOfInertia);
  const shearY = processElementInput(elementInputs.shearAreasY);
  const shearZ = processElementInput(elementInputs.shearAreasZ);

  // Output pointers
  const freqPtrOut = mod._malloc(4);
  gc.push(freqPtrOut);
  const numFreqOut = mod._malloc(4);
  gc.push(numFreqOut);
  const modesPtrOut = mod._malloc(4);
  gc.push(modesPtrOut);
  const modesRowsOut = mod._malloc(4);
  gc.push(modesRowsOut);
  const modesColsOut = mod._malloc(4);
  gc.push(modesColsOut);
  const massPtrOut = mod._malloc(4);
  gc.push(massPtrOut);
  const massRowsOut = mod._malloc(4);
  gc.push(massRowsOut);
  const massColsOut = mod._malloc(4);
  gc.push(massColsOut);

  // 2- Call C++ modal_paz()
  mod._modal_paz(
    nodesPtr,
    nodes.length,
    elementsPtr,
    elementIndices.length,
    elementSizesPtz,
    elements.length,
    // supports
    supportKeysPtr,
    supportValuesPtr,
    supportKeys.length,
    // element inputs
    elasticities.keysPtr,
    elasticities.valuesPtr,
    elasticities.size,
    areas.keysPtr,
    areas.valuesPtr,
    areas.size,
    moiZ.keysPtr,
    moiZ.valuesPtr,
    moiZ.size,
    moiY.keysPtr,
    moiY.valuesPtr,
    moiY.size,
    shearMod.keysPtr,
    shearMod.valuesPtr,
    shearMod.size,
    torsion.keysPtr,
    torsion.valuesPtr,
    torsion.size,
    densities.keysPtr,
    densities.valuesPtr,
    densities.size,
    thicknesses.keysPtr,
    thicknesses.valuesPtr,
    thicknesses.size,
    poissons.keysPtr,
    poissons.valuesPtr,
    poissons.size,
    memMods.keysPtr,
    memMods.valuesPtr,
    memMods.size,
    bendMods.keysPtr,
    bendMods.valuesPtr,
    bendMods.size,
    // NEW: polar moment of inertia
    polarMoi.keysPtr,
    polarMoi.valuesPtr,
    polarMoi.size,
    shearY.keysPtr,
    shearY.valuesPtr,
    shearY.size,
    shearZ.keysPtr,
    shearZ.valuesPtr,
    shearZ.size,
    // control
    numModes,
    // output pointers
    freqPtrOut,
    numFreqOut,
    modesPtrOut,
    modesRowsOut,
    modesColsOut,
    massPtrOut,
    massRowsOut,
    massColsOut
  );

  // 3- Read outputs
  const freqPtr = mod.HEAPU32[freqPtrOut / 4];
  const nFreq = mod.HEAPU32[numFreqOut / 4];
  const modesPtr = mod.HEAPU32[modesPtrOut / 4];
  const nRows = mod.HEAPU32[modesRowsOut / 4];
  const nCols = mod.HEAPU32[modesColsOut / 4];
  const massPtr = mod.HEAPU32[massPtrOut / 4];
  const massRows = mod.HEAPU32[massRowsOut / 4];
  const massCols = mod.HEAPU32[massColsOut / 4];

  let frequencies: number[] = [];
  let modeShapes: number[][] = [];
  let massParticipation: number[][] = [];

  if (nFreq > 0 && freqPtr) {
    const freqFlat = new Float64Array(mod.HEAPF64.buffer, freqPtr, nFreq);
    frequencies = Array.from(freqFlat);
    gc.push(freqPtr);
  }

  if (nRows > 0 && nCols > 0 && modesPtr) {
    const modesFlat = new Float64Array(
      mod.HEAPF64.buffer,
      modesPtr,
      nRows * nCols
    );
    for (let i = 0; i < nRows; i++) {
      modeShapes.push(Array.from(modesFlat.slice(i * nCols, (i + 1) * nCols)));
    }
    gc.push(modesPtr);
  }

  if (massRows > 0 && massCols > 0 && massPtr) {
    const massFlat = new Float64Array(
      mod.HEAPF64.buffer,
      massPtr,
      massRows * massCols
    );
    for (let i = 0; i < massRows; i++) {
      massParticipation.push(
        Array.from(massFlat.slice(i * massCols, (i + 1) * massCols))
      );
    }
    gc.push(massPtr);
  }

  // Free memory
  gc.forEach((ptr) => mod._free(ptr));

  return { frequencies, modeShapes, massParticipation };
}

// Utils
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
