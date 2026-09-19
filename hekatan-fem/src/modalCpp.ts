import {
  Node,
  Element,
  ElementInputs,
  NodeInputs,
  ModalOutputs,
} from "./data-model.js";
import createModule from "./cpp/built/deform.js";
import { releasesA12 } from "./utils/releasesA12";

// @ts-ignore, load wasm
const mod = await createModule();

export function modalCpp(
  nodes: Node[],
  elements: Element[],
  nodeInputs: NodeInputs,
  elementInputs: ElementInputs,
  numModes: number = 10,
  lateralMass: number = 0,  // 1 = solo masa lateral Ux,Uy (como ETABS INCLUDEVERTICALMASS No)
  lumpStories: number = 0,  // 1 = agrupar la masa por pisos (como ETABS LUMPATSTORIES Yes)
  // La fuente de masa de ETABS son DOS interruptores independientes, y hasta
  // ahora Hekatan solo sabia hacer el primero:
  //    INCLUDEELEMENTS   la masa de los elementos, rho*A*L
  //    INCLUDELOADS      patrones de carga convertidos en masa (carga / g)
  // El CIMENTAC del GAD RIOCHICO tiene INCLUDEELEMENTS "No" e INCLUDELOADS
  // "Yes" con PP y SCP: alli la masa NO es el peso propio, son las cargas.
  includeElements: number = 1,
  // Diafragma rigido por nudo: Map<nudo, idDiafragma>. 0 o ausente = ninguno.
  // Ata Ux, Uy y Rz de todos los nudos del mismo id, que es lo que hace ETABS
  // con sus diafragmas (el CIMENTAC del GAD RIOCHICO tiene dos, D1 y D2).
  diaphragms?: Map<number, number>,
  // Resortes nodales (Winkler). El estatico ya los recibia y el modal no: sin
  // ellos, un modelo apoyado en balasto FLOTA y da periodos absurdos.
  springs?: Array<{ node: number; dof: number; k: number }>
): ModalOutputs {
  if (nodes.length === 0) return { frequencies: [], modeShapes: [], massParticipation: [] };

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
  // Shells: thicknesses + poissons + property modifiers (estilo ETABS)
  const thicknesses = processElementInput((elementInputs as any).thicknesses);
  const poissons = processElementInput((elementInputs as any).poissonsRatios);
  const memMods = processElementInput((elementInputs as any).membraneModifiers);
  const bendMods = processElementInput((elementInputs as any).bendingModifiers);
  // plateFormulations: Map<number, number> (0=Mindlin, 1=Kirchhoff Shell-Thin)
  // Procesado manualmente (valores son INT, no double como processElementInput)
  const plateFormMap = (elementInputs as any).plateFormulations as Map<number, number> | undefined;
  const plateFormKeys = plateFormMap ? Array.from(plateFormMap.keys()) : [];
  const plateFormValues = plateFormMap ? Array.from(plateFormMap.values()) : [];
  const plateFormKeysPtr = allocate(plateFormKeys, Uint32Array, mod.HEAPU32);
  gc.push(plateFormKeysPtr);
  const plateFormValuesPtr = allocate(plateFormValues, Uint32Array, mod.HEAPU32);
  gc.push(plateFormValuesPtr);

  // DRILLING DOF (theta_z, el giro normal al plano del shell).
  //   drillingTypes:          0 = penalty 1e-6, 1 = muelle debil PyNite,
  //                           2 = Hughes-Brezzi  [defecto en C++ si va vacio]
  //   drillingPenaltyScales:  factor sobre gamma = G*t
  //
  // El SEPTIMO dato que el estatico recibia y el modal no (as, ang, masa nodal,
  // diafragma, resortes, releases... y este). Se caza cambiando el dato y
  // mirando si el resultado se mueve: con escala 100 y con escala 0 el modal
  // daba las MISMAS frecuencias hasta la ultima cifra, porque no llegaba.
  //
  // Importa aunque el defecto no cambie nada: medido contra ETABS en una celda
  // de 1x1 m, el drilling de Hekatan es 2.03 veces el suyo, y sin este
  // parametro no habia forma de tocarlo desde el modal.
  const drillingTypes = (elementInputs as any).drillingTypes as
    | Map<number, number> | undefined;
  const drillTypeKeys = drillingTypes ? Array.from(drillingTypes.keys()) : [];
  const drillTypeValues = drillingTypes ? Array.from(drillingTypes.values()) : [];
  const drillTypeKeysPtr = allocate(drillTypeKeys, Uint32Array, mod.HEAPU32);
  gc.push(drillTypeKeysPtr);
  const drillTypeValuesPtr = allocate(drillTypeValues, Uint32Array, mod.HEAPU32);
  gc.push(drillTypeValuesPtr);
  const drillingPenaltyScales = (elementInputs as any).drillingPenaltyScales as
    | Map<number, number> | undefined;
  const drillScaleKeys = drillingPenaltyScales ? Array.from(drillingPenaltyScales.keys()) : [];
  const drillScaleValues = drillingPenaltyScales ? Array.from(drillingPenaltyScales.values()) : [];
  const drillScaleKeysPtr = allocate(drillScaleKeys, Uint32Array, mod.HEAPU32);
  gc.push(drillScaleKeysPtr);
  const drillScaleValuesPtr = allocate(drillScaleValues, Float64Array, mod.HEAPF64);
  gc.push(drillScaleValuesPtr);

  // Areas de cortante y angulo de eje local. El estatico (deformCpp) ya las
  // mandaba y el modal NO, asi que los dos armaban una K DISTINTA del mismo
  // modelo. Sin `as` el motor supone 5/6*A —el doble del alma real en estos
  // perfiles— y sin `ang` los perfiles van mal orientados: una C 200x50 girada
  // 90 grados es once veces mas floja. Por eso el modal del galpon salia rigido
  // de mas del modo 2 en adelante mientras el estatico cerraba al 0.9 %.
  const shearAreasY = processElementInput(elementInputs.shearAreasY);
  const shearAreasZ = processElementInput(elementInputs.shearAreasZ);
  const localAngles = processElementInput(
    (elementInputs as any).localAngles as Map<number, number> | undefined);

  // END RELEASES: 12 banderas por barra, [U1 U2 U3 R1 R2 R3] en I + en J.
  // El sexto dato de la lista, y el unico que hasta ahora no aplicaba NINGUNO
  // de los dos solvers: una barra biarticulada entraba empotrada en todo el
  // programa, porque `deformCpp.ts` preparaba los punteros y luego decia que de
  // los releases se encargaba "el solver de TS" — y todo va por WASM.
  const releaseKeys = elementInputs.momentReleases
    ? Array.from(elementInputs.momentReleases.keys()) : [];
  const releaseValues = elementInputs.momentReleases
    ? Array.from(elementInputs.momentReleases.values()).flatMap(releasesA12) : [];
  const releaseKeysPtr = allocate(releaseKeys, Uint32Array, mod.HEAPU32);
  gc.push(releaseKeysPtr);
  const releaseValuesPtr = allocate(releaseValues, Uint8Array, mod.HEAPU8);
  gc.push(releaseValuesPtr);

  // Masa nodal en toneladas: la que NO sale del peso propio (ver includeElements).
  // Va indexada por NUDO, no por elemento, pero el empaquetado es el mismo.
  const nodalMasses = processElementInput(nodeInputs.masses);
  const diaph = processElementInput(diaphragms ?? (nodeInputs as any).diaphragms);
  const resortes = springs ?? (nodeInputs as any).springs;
  const springsFlat: number[] = resortes
    ? resortes.flatMap((s: any) => [s.node, s.dof, s.k]) : [];
  const springsPtr = allocate(springsFlat.length > 0 ? springsFlat : [0],
                              Float64Array, mod.HEAPF64);
  gc.push(springsPtr);

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
  // Mass participation output pointers
  const massPtrOut = mod._malloc(4);
  gc.push(massPtrOut);
  const massRowsOut = mod._malloc(4);
  gc.push(massRowsOut);
  const massColsOut = mod._malloc(4);
  gc.push(massColsOut);

  // 2- Call C++ modal()
  mod._modal(
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
    // plateFormulations (Shell-Thin DKE Kirchhoff vs Shell-Thick DSE Mindlin)
    plateFormKeysPtr,
    plateFormValuesPtr,
    plateFormKeys.length,
    // drilling: tipo (0/1/2, defecto 2 Hughes-Brezzi) y escala del penalty γ=G·t
    drillTypeKeysPtr,
    drillTypeValuesPtr,
    drillTypeKeys.length,
    drillScaleKeysPtr,
    drillScaleValuesPtr,
    drillScaleKeys.length,
    // areas de cortante (As=0 → Timoshenko 5/6·A; As<0 → Bernoulli) y angulo local
    shearAreasY.keysPtr,
    shearAreasY.valuesPtr,
    shearAreasY.size,
    shearAreasZ.keysPtr,
    shearAreasZ.valuesPtr,
    shearAreasZ.size,
    localAngles.keysPtr,
    localAngles.valuesPtr,
    localAngles.size,
    // end releases: 12 banderas por barra
    releaseKeysPtr,
    releaseValuesPtr,
    releaseKeys.length,
    // masa nodal (t) + si se cuenta o no la masa de los elementos
    nodalMasses.keysPtr,
    nodalMasses.valuesPtr,
    nodalMasses.size,
    includeElements,
    diaph.keysPtr,
    diaph.valuesPtr,
    diaph.size,
    springsPtr,
    resortes ? resortes.length : 0,
    // la union viga-muro de ETABS (`etabsjoint 1`), apagada por defecto
    (elementInputs as any).etabsWallJoint === false ? 0 : 1,   // por defecto como ETABS
    // control
    numModes,
    lateralMass,
    lumpStories,
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
