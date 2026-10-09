import { insertionSprings } from "./utils/insertionPoint";
import {
  Node,
  Element,
  ElementInputs,
  NodeInputs,
  DeformOutputs,
} from "./data-model.js";
import createModule from "./cpp/built/deform.js";
import { releasesA12 } from "./utils/releasesA12";

// @ts-ignore, load wasm
const mod = await createModule();

export function deformCpp(
  nodes: Node[],
  elements: Element[],
  nodeInputs: NodeInputs,
  elementInputs: ElementInputs,
  springs?: Array<{ node: number; dof: number; k: number }>
): DeformOutputs {
  if (nodes.length === 0) return;

  const gc: number[] = []; // Garage Collector

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

  // NodeInputs.loads
  const loadKeys = nodeInputs.loads ? Array.from(nodeInputs.loads.keys()) : [];
  const loadValues = nodeInputs.loads
    ? Array.from(nodeInputs.loads.values()).flat()
    : [];
  const loadKeysPtr = allocate(loadKeys, Uint32Array, mod.HEAPU32);
  gc.push(loadKeysPtr);
  const loadValuesPtr = allocate(loadValues, Float64Array, mod.HEAPF64);
  gc.push(loadValuesPtr);

  // ElementInputs
  const processElementInput = (inputMap: Map<number, number> | undefined) => {
    const keys = inputMap ? Array.from(inputMap.keys()) : [];
    const values = inputMap ? Array.from(inputMap.values()) : [];
    const keysPtr = allocate(keys, Uint32Array, mod.HEAPU32);
    gc.push(keysPtr);
    const valuesPtr = allocate(values, Float64Array, mod.HEAPF64);
    gc.push(valuesPtr);

    return {
      keysPtr,
      valuesPtr,
      size: keys.length,
    };
  };

  const elasticities = processElementInput(elementInputs.elasticities);
  const elasticitiesOrthogonal = processElementInput(
    elementInputs.elasticitiesOrthogonal
  );
  const areas = processElementInput(elementInputs.areas);
  const moiZ = processElementInput(elementInputs.momentsOfInertiaZ);
  const moiY = processElementInput(elementInputs.momentsOfInertiaY);
  const shearMod = processElementInput(elementInputs.shearModuli);
  const torsion = processElementInput(elementInputs.torsionalConstants);
  const thickness = processElementInput(elementInputs.thicknesses);
  const poisson = processElementInput(elementInputs.poissonsRatios);
  const shearAreasY = processElementInput(elementInputs.shearAreasY);
  const shearAreasZ = processElementInput(elementInputs.shearAreasZ);

  // Rigid offsets: Map<number, [factorI, factorJ]> → flat [factI, factJ, factI, factJ, ...]
  const rigidOffsetKeys = elementInputs.rigidOffsets ? Array.from(elementInputs.rigidOffsets.keys()) : [];
  const rigidOffsetValues = elementInputs.rigidOffsets ? Array.from(elementInputs.rigidOffsets.values()).flat() : [];
  const rigidOffsetKeysPtr = allocate(rigidOffsetKeys, Uint32Array, mod.HEAPU32); gc.push(rigidOffsetKeysPtr);
  const rigidOffsetValuesPtr = allocate(rigidOffsetValues, Float64Array, mod.HEAPF64); gc.push(rigidOffsetValuesPtr);

  // END RELEASES. Al C++ van SIEMPRE 12 banderas por barra, en el orden de
  // ETABS: [U1 U2 U3 R1 R2 R3] en el nudo I + los mismos seis en el nudo J.
  // El modelo de datos admite ademas la forma corta de 6 —solo rotaciones,
  // [TI,M2I,M3I,TJ,M2J,M3J]—, asi que aqui se expande a las 12 posiciones.
  const releaseKeys = elementInputs.momentReleases ? Array.from(elementInputs.momentReleases.keys()) : [];
  const releaseValues = elementInputs.momentReleases
    ? Array.from(elementInputs.momentReleases.values()).flatMap(releasesA12)
    : [];
  const releaseKeysPtr = allocate(releaseKeys, Uint32Array, mod.HEAPU32); gc.push(releaseKeysPtr);
  const releaseValuesPtr = allocate(releaseValues, Uint8Array, mod.HEAPU8); gc.push(releaseValuesPtr);

  // Allocate memory for the pointers that C++ will write the results pointers to
  const deformationsDataPtrOutPtr = mod._malloc(4); // Pointer to a pointer (size 4 for 32-bit WASM)
  gc.push(deformationsDataPtrOutPtr);
  const deformationsSizeOutPtr = mod._malloc(4); // Pointer to an int (size 4)
  gc.push(deformationsSizeOutPtr);
  const reactionsDataPtrOutPtr = mod._malloc(4);
  gc.push(reactionsDataPtrOutPtr);
  const reactionsSizeOutPtr = mod._malloc(4);
  gc.push(reactionsSizeOutPtr);

  // Springs (Winkler foundation, nodal). Layout: [node, dof, k, ...]
  // + el PUNTO DE INSERCION de las barras (nudo negativo, gdl -5/-6): utils/insertionPoint.ts
  const springsAll = [...(springs ?? []), ...insertionSprings(elementInputs)];
  const springsFlat: number[] = springsAll.flatMap((s) => [s.node, s.dof, s.k]);
  const springsPtr = allocate(
    springsFlat.length > 0 ? springsFlat : [0],
    Float64Array,
    mod.HEAPF64
  );
  gc.push(springsPtr);

  // Plate formulation per shell: 0=Mindlin (Shell-Thick), 1=Kirchhoff MZC (Shell-Thin)
  // Map<elemIdx, int>
  const plateFormulations = (elementInputs as any).plateFormulations as
    | Map<number, number> | undefined;
  const plateFormKeys = plateFormulations ? Array.from(plateFormulations.keys()) : [];
  const plateFormValues = plateFormulations ? Array.from(plateFormulations.values()) : [];
  const plateFormKeysPtr = allocate(plateFormKeys, Uint32Array, mod.HEAPU32);
  gc.push(plateFormKeysPtr);
  // C++ espera int* — usamos HEAPU32 ya que valores son 0/1 (positivos)
  const plateFormValuesPtr = allocate(plateFormValues, Uint32Array, mod.HEAPU32);
  gc.push(plateFormValuesPtr);

  // Drilling DOF formulation per shell:
  //   0 = penalty 1e-6 legacy, 1 = PyNite weak, 2 = Hughes-Brezzi (default C++)
  // Mapa puede estar vacío → C++ usa default = 2 (Hughes-Brezzi) en todos los shells.
  const drillingTypes = (elementInputs as any).drillingTypes as
    | Map<number, number> | undefined;
  const drillTypeKeys = drillingTypes ? Array.from(drillingTypes.keys()) : [];
  const drillTypeValues = drillingTypes ? Array.from(drillingTypes.values()) : [];
  const drillTypeKeysPtr = allocate(drillTypeKeys, Uint32Array, mod.HEAPU32);
  gc.push(drillTypeKeysPtr);
  const drillTypeValuesPtr = allocate(drillTypeValues, Uint32Array, mod.HEAPU32);
  gc.push(drillTypeValuesPtr);

  // Drilling penalty scale (factor sobre γ=G·t para Hughes-Brezzi)
  // Map vacío → default 1.0 (HB original).
  const drillingPenaltyScales = (elementInputs as any).drillingPenaltyScales as
    | Map<number, number> | undefined;
  const drillScaleKeys = drillingPenaltyScales ? Array.from(drillingPenaltyScales.keys()) : [];
  const drillScaleValues = drillingPenaltyScales ? Array.from(drillingPenaltyScales.values()) : [];
  const drillScaleKeysPtr = allocate(drillScaleKeys, Uint32Array, mod.HEAPU32);
  gc.push(drillScaleKeysPtr);
  const drillScaleValuesPtr = allocate(drillScaleValues, Float64Array, mod.HEAPF64);
  gc.push(drillScaleValuesPtr);

  // Property Modifiers estilo ETABS: multiplican la rigidez de membrana y de
  // flexion del shell. Existian en el C++ y los aplicaba shellQ4, pero SOLO
  // llegaban por el camino modal — el estatico no los recibia y valian 1.0.
  // Sin ellos no se puede representar un deck (poca flexion) ni una membrana.
  const memMods = (elementInputs as any).membraneModifiers as Map<number, number> | undefined;
  const bendMods = (elementInputs as any).bendingModifiers as Map<number, number> | undefined;
  const memModKeys = memMods ? Array.from(memMods.keys()) : [];
  const memModValues = memMods ? Array.from(memMods.values()) : [];
  const memModKeysPtr = allocate(memModKeys, Uint32Array, mod.HEAPU32);
  gc.push(memModKeysPtr);
  const memModValuesPtr = allocate(memModValues, Float64Array, mod.HEAPF64);
  gc.push(memModValuesPtr);
  const bendModKeys = bendMods ? Array.from(bendMods.keys()) : [];
  const bendModValues = bendMods ? Array.from(bendMods.values()) : [];
  const bendModKeysPtr = allocate(bendModKeys, Uint32Array, mod.HEAPU32);
  gc.push(bendModKeysPtr);
  const bendModValuesPtr = allocate(bendModValues, Float64Array, mod.HEAPF64);
  gc.push(bendModValuesPtr);

  // Modificadores DIRECCIONALES: 8 valores por elemento, en el orden del e2k
  // de ETABS -> F11 F22 F12 M11 M22 M12 V13 V23.
  const dirMods = (elementInputs as any).shellModifiers as Map<number, number[]> | undefined;
  const dirModKeys = dirMods ? Array.from(dirMods.keys()) : [];
  const dirModValues: number[] = [];
  if (dirMods) for (const k of dirModKeys) {
    const v8 = dirMods.get(k) as number[];
    for (let i = 0; i < 8; i++) dirModValues.push(v8[i] ?? 1);
  }
  const dirModKeysPtr = allocate(dirModKeys, Uint32Array, mod.HEAPU32);
  gc.push(dirModKeysPtr);
  const dirModValuesPtr = allocate(dirModValues, Float64Array, mod.HEAPF64);
  gc.push(dirModValuesPtr);

  // Angulo de eje local por barra, en grados (Map<elemIdx, deg>). Sin esto el
  // C++ montaba todas las barras sin girar y un modelo venido de ETABS con
  // perfiles en C o 2L a 90 grados no era la misma estructura.
  const locAng = (elementInputs as any).localAngles as Map<number, number> | undefined;
  const locAngKeys = locAng ? Array.from(locAng.keys()) : [];
  const locAngValues = locAng ? Array.from(locAng.values()) : [];
  const locAngKeysPtr = allocate(locAngKeys, Uint32Array, mod.HEAPU32);
  gc.push(locAngKeysPtr);
  const locAngValuesPtr = allocate(locAngValues, Float64Array, mod.HEAPF64);
  gc.push(locAngValuesPtr);

  // Diafragma rigido por nudo (`diaph` del .heks): nodo -> grupo
  const diaph = processElementInput((nodeInputs as any).diaphragms);

  // END LENGTH OFFSETS de CSI: [offI, offJ, rz] por barra. Solo viajan las barras que
  // rigidizan de verdad (rz > 0 y algun offset): con rz = 0 la matriz es la de siempre.
  const endOff = (elementInputs as any).endOffsets as Map<number, number[]> | undefined;
  const endOffKeys: number[] = [];
  const endOffValues: number[] = [];
  if (endOff) for (const [k, v] of endOff) {
    if (!v || !(v[2] > 0) || !(v[0] > 0 || v[1] > 0)) continue;
    endOffKeys.push(k);
    endOffValues.push(v[0] ?? 0, v[1] ?? 0, v[2] ?? 0);
  }
  const endOffKeysPtr = allocate(endOffKeys, Uint32Array, mod.HEAPU32);
  gc.push(endOffKeysPtr);
  const endOffValuesPtr = allocate(endOffValues, Float64Array, mod.HEAPF64);
  gc.push(endOffValuesPtr);

  // 2- Call C++ Function
  mod._deform(
    nodesPtr,
    nodes.length,
    elementsPtr,
    elementIndices.length,
    elementSizesPtz,
    elements.length,
    supportKeysPtr,
    supportValuesPtr,
    supportKeys.length,
    loadKeysPtr,
    loadValuesPtr,
    loadKeys.length,
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
    thickness.keysPtr,
    thickness.valuesPtr,
    thickness.size,
    poisson.keysPtr,
    poisson.valuesPtr,
    poisson.size,
    elasticitiesOrthogonal.keysPtr,
    elasticitiesOrthogonal.valuesPtr,
    elasticitiesOrthogonal.size,
    // shearAreasY/Z: As=0 (default) → Timoshenko 5/6·A; As<0 → Bernoulli puro
    shearAreasY.keysPtr,
    shearAreasY.valuesPtr,
    shearAreasY.size,
    shearAreasZ.keysPtr,
    shearAreasZ.valuesPtr,
    shearAreasZ.size,
    // NOTE: `rigidOffsets` (los del fork original) no llega al C++. Los brazos rigidos de
    // CSI son `endOffsets` y van al final de la llamada. Los RELEASES van mas abajo,
    // detras del angulo de eje local.
    // Springs (Winkler): flat [node, dof, k, ...] array
    springsPtr,
    springsAll.length,
    // Plate formulation switch (Shell-Thin vs Shell-Thick): map<elemIdx, int>
    plateFormKeysPtr,
    plateFormValuesPtr,
    plateFormKeys.length,
    // Drilling DOF: 0=penalty1e6, 1=PyNiteWeak, 2=Hughes-Brezzi (default si map vacío)
    drillTypeKeysPtr,
    drillTypeValuesPtr,
    drillTypeKeys.length,
    // Drilling penalty scale (factor sobre γ=G·t)
    drillScaleKeysPtr,
    drillScaleValuesPtr,
    drillScaleKeys.length,
    // Property modifiers (membrana / flexion)
    memModKeysPtr,
    memModValuesPtr,
    memModKeys.length,
    bendModKeysPtr,
    bendModValuesPtr,
    bendModKeys.length,
    // Modificadores direccionales (8 por elemento)
    dirModKeysPtr,
    dirModValuesPtr,
    dirModKeys.length,
    // Angulo de eje local por barra (grados)
    locAngKeysPtr,
    locAngValuesPtr,
    locAngKeys.length,
    // End releases: 12 banderas por barra [U1 U2 U3 R1 R2 R3]_I + _J
    releaseKeysPtr,
    releaseValuesPtr,
    releaseKeys.length,
    // La union viga-muro de ETABS (`etabsjoint 1` en el .heks); apagada por defecto
    (elementInputs as any).etabsWallJoint === false ? 0 : 1,   // encendida salvo que se apague: por defecto como ETABS
    // Diafragma rigido (ux, uy, rz atados por planta; ver utils/rigidDiaphragm.h)
    diaph.keysPtr, diaph.valuesPtr, diaph.size,
    // Solidos H8 (elementos de 8 nudos): modos incompatibles salvo que se apaguen
    (elementInputs as any).solidIncompatible === false ? 0 : 1,
    // Output pointers
    deformationsDataPtrOutPtr,
    deformationsSizeOutPtr,
    reactionsDataPtrOutPtr,
    reactionsSizeOutPtr,
    // End length offsets (brazos rigidos de CSI): al final, detras de las salidas
    endOffKeysPtr,
    endOffValuesPtr,
    endOffKeys.length
  );

  // 3- Read Output Data
  // Read the pointers and sizes written by C++
  const deformationsDataPtr = mod.HEAPU32[deformationsDataPtrOutPtr / 4];
  const deformationsSize = mod.HEAPU32[deformationsSizeOutPtr / 4];
  const reactionsDataPtr = mod.HEAPU32[reactionsDataPtrOutPtr / 4];
  const reactionsSize = mod.HEAPU32[reactionsSizeOutPtr / 4];

  // Read the actual data from the pointers
  const deformationsFlat = new Float64Array(
    mod.HEAPF64.buffer,
    deformationsDataPtr,
    deformationsSize
  );
  const reactionsFlat = new Float64Array(
    mod.HEAPF64.buffer,
    reactionsDataPtr,
    reactionsSize
  );

  // 4- Convert flat output arrays back to Map format
  const deformations: DeformOutputs["deformations"] = new Map();
  for (let i = 0; i < deformationsSize; i += 7) {
    const nodeIndex = deformationsFlat[i];
    deformations.set(
      nodeIndex,
      Array.from(deformationsFlat.slice(i + 1, i + 7)) as [
        number,
        number,
        number,
        number,
        number,
        number
      ]
    );
  }

  const reactions: DeformOutputs["reactions"] = new Map();
  for (let i = 0; i < reactionsSize; i += 7) {
    const nodeIndex = reactionsFlat[i];
    reactions.set(
      nodeIndex,
      Array.from(reactionsFlat.slice(i + 1, i + 7)) as [
        number,
        number,
        number,
        number,
        number,
        number
      ]
    );
  }
  if (deformationsDataPtr) gc.push(deformationsDataPtr);
  if (reactionsDataPtr) gc.push(reactionsDataPtr);

  // Free Memory
  gc.forEach((ptr) => mod._free(ptr));

  return {
    deformations,
    reactions,
  };
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
