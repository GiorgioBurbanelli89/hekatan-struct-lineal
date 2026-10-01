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
  springs?: Array<{ node: number; dof: number; k: number }>,
  // TIEMPO-HISTORIA LINEAL (30-sep-2026): ver timeHistoryAnalysis() abajo y cpp/utils/tiempoHistoria.h
  th?: THOpciones,
  // PANDEO LINEAL (1-oct-2026, cpp/utils/pandeo.h): axial P-delta por elemento (tracción +). Si viene, no hay modal.
  pandeoP?: number[],
  // ESTADO ESTACIONARIO (1-oct-2026, cpp: sección 8b de modal.cpp)
  ss?: EstacionarioOpciones
): ModalOutputs & { timeHistory?: THResultado; buckling?: PandeoResultado; steadyState?: EstacionarioResultado } {
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
  // tiempo-historia: configuración plana (ver modal.cpp) y salida
  let thCfgPtr = 0, thCfgLen = 0;
  if (th) {
    const cfg = thConfigPlana(th, nodes.length);
    thCfgPtr = allocate(cfg, Float64Array, mod.HEAPF64); gc.push(thCfgPtr); thCfgLen = cfg.length;
  }
  let pandeoPPtr = 0;
  if (pandeoP) { pandeoPPtr = allocate(pandeoP, Float64Array, mod.HEAPF64); gc.push(pandeoPPtr); }
  const pandeoOutPtr = mod._malloc(4); gc.push(pandeoOutPtr);
  const pandeoOutLen = mod._malloc(4); gc.push(pandeoOutLen);
  mod.HEAPU32[pandeoOutPtr / 4] = 0; mod.HEAPU32[pandeoOutLen / 4] = 0;
  let ssCfgPtr = 0, ssCfgLen = 0;
  if (ss) { const cfg = ssConfigPlana(ss, nodes.length); ssCfgPtr = allocate(cfg, Float64Array, mod.HEAPF64); gc.push(ssCfgPtr); ssCfgLen = cfg.length; }
  const ssOutPtr = mod._malloc(4); gc.push(ssOutPtr);
  const ssOutLen = mod._malloc(4); gc.push(ssOutLen);
  mod.HEAPU32[ssOutPtr / 4] = 0; mod.HEAPU32[ssOutLen / 4] = 0;
  const thOutPtr = mod._malloc(4); gc.push(thOutPtr);
  const thOutLen = mod._malloc(4); gc.push(thOutLen);
  mod.HEAPU32[thOutPtr / 4] = 0; mod.HEAPU32[thOutLen / 4] = 0;
  const massRowsOut = mod._malloc(4);
  gc.push(massRowsOut);
  const massColsOut = mod._malloc(4);
  gc.push(massColsOut);
  // Salidas NUEVAS (17-sep-2026): Γ masa-normalizado, masa total por dirección y
  // la escala que lleva la forma «máx = 1» a la masa-normalizada. Ver modal.cpp.
  const gammaPtrOut = mod._malloc(4);
  gc.push(gammaPtrOut);
  const totalMassPtrOut = mod._malloc(4);
  gc.push(totalMassPtrOut);
  const modeScalesPtrOut = mod._malloc(4);
  gc.push(modeScalesPtrOut);
  mod.HEAPU32[gammaPtrOut / 4] = 0;
  mod.HEAPU32[totalMassPtrOut / 4] = 0;
  mod.HEAPU32[modeScalesPtrOut / 4] = 0;

  // 2- Call C++ modal()

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

  // Modificadores DIRECCIONALES (8 por cáscara, orden e2k: F11 F22 F12 M11 M22 M12 V13 V23), como en deformCpp
  const dirMods = (elementInputs as any).shellModifiers as Map<number, number[]> | undefined;
  const dirModKeys = dirMods ? Array.from(dirMods.keys()) : [];
  const dirModValues: number[] = [];
  if (dirMods) for (const k of dirModKeys) { const v8 = dirMods.get(k) as number[]; for (let i = 0; i < 8; i++) dirModValues.push(v8[i] ?? 1); }
  const dirModKeysPtr = mod._malloc(Math.max(1, dirModKeys.length) * 4);
  mod.HEAPU32.set(new Uint32Array(dirModKeys), dirModKeysPtr / 4); gc.push(dirModKeysPtr);
  const dirModValuesPtr = mod._malloc(Math.max(1, dirModValues.length) * 8);
  mod.HEAPF64.set(new Float64Array(dirModValues), dirModValuesPtr / 8); gc.push(dirModValuesPtr);

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
    massColsOut,
    gammaPtrOut,
    totalMassPtrOut,
    modeScalesPtrOut,
    // End length offsets (brazos rigidos de CSI): al final, detras de las salidas
    endOffKeysPtr,
    endOffValuesPtr,
    endOffKeys.length,
    // tiempo-historia (opcional)
    thCfgPtr,
    thCfgLen,
    thOutPtr,
    thOutLen,
    dirModKeysPtr,
    dirModValuesPtr,
    dirModKeys.length,
    pandeoPPtr,
    pandeoOutPtr,
    pandeoOutLen,
    ssCfgPtr,
    ssCfgLen,
    ssOutPtr,
    ssOutLen
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

  // Salidas nuevas: Γ (masa-normalizado), masa total por dirección, escala de φ.
  let participationFactors: number[][] = [];
  let totalMass: number[] = [];
  let modeScales: number[] = [];
  const gammaPtr = mod.HEAPU32[gammaPtrOut / 4];
  if (gammaPtr && massRows > 0) {
    const f = new Float64Array(mod.HEAPF64.buffer, gammaPtr, massRows * 6);
    for (let i = 0; i < massRows; i++)
      participationFactors.push(Array.from(f.slice(i * 6, (i + 1) * 6)));
    gc.push(gammaPtr);
  }
  const tmPtr = mod.HEAPU32[totalMassPtrOut / 4];
  if (tmPtr) {
    totalMass = Array.from(new Float64Array(mod.HEAPF64.buffer, tmPtr, 6));
    gc.push(tmPtr);
  }
  const msPtr = mod.HEAPU32[modeScalesPtrOut / 4];
  if (msPtr && nFreq > 0) {
    modeScales = Array.from(new Float64Array(mod.HEAPF64.buffer, msPtr, nFreq));
    gc.push(msPtr);
  }

  // Tiempo-historia
  let timeHistory: THResultado | undefined;
  const thPtr = mod.HEAPU32[thOutPtr / 4], thLen = mod.HEAPU32[thOutLen / 4];
  if (th && thPtr && thLen > 0) {
    const o = Array.from(new Float64Array(mod.HEAPF64.buffer, thPtr, thLen));
    gc.push(thPtr);
    timeHistory = thLeerSalida(o, th, nodes.length);
  }

  // Pandeo
  let buckling: PandeoResultado | undefined;
  const pbPtr = mod.HEAPU32[pandeoOutPtr / 4], pbLen = mod.HEAPU32[pandeoOutLen / 4];
  if (pandeoP && pbPtr && pbLen > 0) {
    const o = new Float64Array(mod.HEAPF64.buffer, pbPtr, pbLen);
    const m = Math.round(o[0]), dof = nodes.length * 6;
    buckling = { factors: Array.from(o.slice(1, 1 + m)), modeShapes: [] };
    for (let k = 0; k < m; k++) buckling.modeShapes.push(Array.from(o.slice(1 + m + k * dof, 1 + m + (k + 1) * dof)));
    gc.push(pbPtr);
  }

  // Estado estacionario
  let steadyState: EstacionarioResultado | undefined;
  const sP = mod.HEAPU32[ssOutPtr / 4], sL = mod.HEAPU32[ssOutLen / 4];
  if (ss && sP && sL > 0) {
    const o = Array.from(new Float64Array(mod.HEAPF64.buffer, sP, sL)); gc.push(sP);
    const nF = Math.round(o[0]), nN = Math.round(o[1]); const freqs = o.slice(2, 2 + nF);
    const re = new Map<number, number[][]>(), im = new Map<number, number[][]>();
    const nudos = ss.nudos ?? nodes.map((_, i) => i);
    nudos.slice(0, nN).forEach((q) => { re.set(q, []); im.set(q, []); });
    let q = 2 + nF;
    for (let k = 0; k < nF; k++) for (let j = 0; j < nN; j++) { re.get(nudos[j])!.push(o.slice(q, q + 6)); im.get(nudos[j])!.push(o.slice(q + 6, q + 12)); q += 12; }
    steadyState = { frecuencias: freqs, re, im };
  }

  // Free memory
  gc.forEach((ptr) => mod._free(ptr));

  return {
    steadyState,
    buckling,
    frequencies,
    modeShapes,
    massParticipation,
    participationFactors,
    totalMass,
    modeScales,
    timeHistory,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// TIEMPO-HISTORIA LINEAL — los dos métodos de SAP2000/ETABS (CSI Analysis Reference, cap. 21)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/** Una función de tiempo: puntos (t, v). Antes del primero vale 0 y después del último se mantiene. */
export interface THFuncion { t: number[]; v: number[] }

/** Un término de r(t) = Σ fᵢ(t)·pᵢ (ec. 21-2). */
export type THCarga =
  | { tipo: "patron"; fuerzas: Map<number, number[]>; funcion: THFuncion; sf?: number }   // nudo → [Fx,Fy,Fz,Mx,My,Mz]
  | { tipo: "aceleracion"; dir: 0 | 1 | 2; funcion: THFuncion; sf?: number };           // üg (respuesta RELATIVA)

export interface THOpciones {
  metodo: "modal" | "directa";
  dt: number;                 // paso de SALIDA
  nPasos: number;
  cargas: THCarga[];
  nudosSalida: number[];      // nudos cuya serie se devuelve (u, 6 componentes)
  xi?: number;                // modal: amortiguamiento constante de todos los modos
  cM?: number; cK?: number;   // proporcional: C = cM·M + cK·K (directa) / ξₘ = cM/2ω + cK·ω/2 (modal)
  alpha?: number;             // directa: HHT-α ∈ [−1/3, 0]; 0 = Newmark (γ = ½, β = ¼)
  gamma?: number; beta?: number;
  envolvente?: boolean;       // máx |u| de TODOS los nudos (cuesta: pasa por todos los GDL en cada paso)
  paso?: number;              // guardar la serie cada `paso` pasos
  /** De quién es la reacción en la base (medido 30-sep-2026): "sap" (defecto, el juez) = elástica; "etabs" = en la
   *  DIRECTA suma el amortiguamiento proporcional a la rigidez cK·K·v de los apoyos, como ETABS. */
  semantica?: "sap" | "etabs";
}

export interface THResultado {
  t: number[];
  u: Map<number, number[][]>;   // nudo → [paso][6]
  base: number[][];             // [paso][Fx, Fy, Fz, Mx, My, Mz] reacción en la base (apoyos + muelles), momentos en el origen
  envolvente?: number[][];      // [nudo][6] máx |u|
  nModos: number;
}

/** Parámetros HHT por defecto: γ = (1 − 2α)/2, β = (1 − α)²/4 (Hilber, Hughes & Taylor 1977). */
function thConfigPlana(o: THOpciones, nNodos: number): number[] {
  const a = o.alpha ?? 0;
  const g = o.gamma ?? (1 - 2 * a) / 2, b = o.beta ?? (1 - a) * (1 - a) / 4;
  const out = [o.metodo === "directa" ? 2 : 1, o.dt, o.nPasos, o.xi ?? 0, o.cM ?? 0, o.cK ?? 0, a, g, b,
               o.envolvente ? 1 : 0, o.cargas.length, o.nudosSalida.length, Math.max(1, o.paso ?? 1), o.semantica === "etabs" ? 1 : 0];
  for (const c of o.cargas) {
    const f = c.funcion;
    if (c.tipo === "aceleracion") {
      out.push(1, c.dir, c.sf ?? 1, f.t.length);
      f.t.forEach((t, i) => out.push(t, f.v[i]));
    } else {
      const pares: number[] = [];
      c.fuerzas.forEach((v, n) => { if (n >= 0 && n < nNodos) v.forEach((x, k) => { if (x) pares.push(n * 6 + k, x); }); });
      out.push(0, pares.length / 2, c.sf ?? 1, f.t.length);
      f.t.forEach((t, i) => out.push(t, f.v[i]));
      out.push(...pares);
    }
  }
  out.push(...o.nudosSalida);
  return out;
}

function thLeerSalida(o: number[], opc: THOpciones, nNodos: number): THResultado {
  const nOut = o[0], nNud = o[1], nModos = o[2];
  let q = 3;
  const t = o.slice(q, q + nOut); q += nOut;
  const u = new Map<number, number[][]>();
  opc.nudosSalida.slice(0, nNud).forEach((n) => u.set(n, []));
  for (let k = 0; k < nOut; ++k)
    for (let j = 0; j < nNud; ++j) { u.get(opc.nudosSalida[j])!.push(o.slice(q, q + 6)); q += 6; }
  const base: number[][] = [];
  for (let k = 0; k < nOut; ++k) { base.push(o.slice(q, q + 6)); q += 6; }
  let envolvente: number[][] | undefined;
  if (opc.envolvente && q + nNodos * 6 <= o.length) {
    envolvente = [];
    for (let i = 0; i < nNodos; ++i) { envolvente.push(o.slice(q, q + 6)); q += 6; }
  }
  return { t, u, base, envolvente, nModos };
}

/** Estado estacionario (Steady State de SAP2000). Frecuencias en Hz; amortiguamiento HISTERÉTICO D = dK·K + dM·M. */
export type EstacionarioCarga = { tipo?: 0 | 1; dir?: number; pares?: Array<[number, number]>; s?: number; fase?: number; funcion?: Array<[number, number]> };
export type EstacionarioOpciones = { frecuencias: number[]; dK?: number; dM?: number; cargas: EstacionarioCarga[]; nudos?: number[] };
export type EstacionarioResultado = { frecuencias: number[]; re: Map<number, number[][]>; im: Map<number, number[][]> };

function ssConfigPlana(o: EstacionarioOpciones, nNodos: number): number[] {
  const c: number[] = [o.frecuencias.length, ...o.frecuencias, o.dK ?? 0, o.dM ?? 0, o.cargas.length];
  for (const g of o.cargas) {
    const pares = g.pares ?? []; const fn = g.funcion ?? [];
    c.push(g.tipo ?? 0, (g.tipo ?? 0) === 1 ? (g.dir ?? 0) : pares.length, g.s ?? 1, g.fase ?? 0, fn.length);
    for (const [f, v] of fn) c.push(f, v);
    if ((g.tipo ?? 0) !== 1) for (const [gdl, v] of pares) c.push(gdl, v);
  }
  const nud = o.nudos ?? Array.from({ length: nNodos }, (_, i) => i);
  c.push(nud.length, ...nud);
  return c;
}

/**
 * ESTADO ESTACIONARIO como SAP2000 (CSiRefer cap. XXV): [K − ω²M + i(dK·K + dM·M)]·a = Σ s·f(ω)·e^{iθ}·p.
 * Mismo modelo que el modal (masa concentrada de CSI, apoyos, diafragmas, muelles). Sin `cargas` usa nodeInputs.loads × 1.
 */
export function steadyStateAnalysis(
  nodes: Node[], elements: Element[], nodeInputs: NodeInputs, elementInputs: ElementInputs, opc: Partial<EstacionarioOpciones> & { frecuencias: number[] }
): EstacionarioResultado | undefined {
  const ni: any = nodeInputs;
  let cargas = opc.cargas;
  if (!cargas) {
    const pares: Array<[number, number]> = [];
    (ni.loads as Map<number, number[]> | undefined)?.forEach((f, q) => f.forEach((v, k) => { if (v) pares.push([6 * q + k, v]); }));
    cargas = [{ tipo: 0, pares, s: 1, fase: 0 }];
  }
  const r = modalCpp(nodes, elements, nodeInputs, elementInputs, 1, 0, 0, 1, ni.diaphragms, ni.springs, undefined, undefined,
    { frecuencias: opc.frecuencias, dK: opc.dK ?? 0, dM: opc.dM ?? 0, cargas, nudos: opc.nudos });
  return r.steadyState;
}

/**
 * DENSIDAD ESPECTRAL DE POTENCIA (Load Case «Power Spectral Density» de SAP2000, CSiRefer cap. XXV).
 * Carga con f(ω) = √S(ω) (S interpolada LINEALMENTE, como SAP2000) sobre el mismo K̄(ω)·a = p del estado estacionario.
 * Respuesta: √PSD = |a| en cada frecuencia y RMS = √(∫ |a|² df) con la regla del TRAPECIO (medido contra SAP2000).
 */
export type PSDResultado = { frecuencias: number[]; raizPSD: Map<number, number[][]>; rms: Map<number, number[]> };
export function psdAnalysis(
  nodes: Node[], elements: Element[], nodeInputs: NodeInputs, elementInputs: ElementInputs,
  opc: { frecuencias: number[]; psd: Array<[number, number]>; dK?: number; dM?: number; carga?: { tipo: 0 | 1; dir?: number }; nudos?: number[] }
): PSDResultado | undefined {
  const S = (f: number) => { const p = opc.psd; if (!p.length) return 1; if (f <= p[0][0]) return p[0][1]; if (f >= p[p.length - 1][0]) return p[p.length - 1][1];
    for (let k = 1; k < p.length; k++) if (f <= p[k][0]) { const t = (f - p[k - 1][0]) / (p[k][0] - p[k - 1][0]); return p[k - 1][1] + t * (p[k][1] - p[k - 1][1]); } return 1; };
  const funcion = opc.frecuencias.map((f) => [f, Math.sqrt(Math.max(0, S(f)))] as [number, number]);
  const ni: any = nodeInputs;
  let cargas: EstacionarioCarga[];
  if (opc.carga?.tipo === 1) cargas = [{ tipo: 1, dir: opc.carga.dir ?? 0, s: 1, fase: 0, funcion }];
  else {
    const pares: Array<[number, number]> = [];
    (ni.loads as Map<number, number[]> | undefined)?.forEach((f, q) => f.forEach((v, k) => { if (v) pares.push([6 * q + k, v]); }));
    cargas = [{ tipo: 0, pares, s: 1, fase: 0, funcion }];
  }
  const r = steadyStateAnalysis(nodes, elements, nodeInputs, elementInputs, { frecuencias: opc.frecuencias, dK: opc.dK ?? 0, dM: opc.dM ?? 0, cargas, nudos: opc.nudos });
  if (!r) return undefined;
  const raizPSD = new Map<number, number[][]>(), rms = new Map<number, number[]>();
  r.re.forEach((re, q) => {
    const im = r.im.get(q)!; const h = re.map((a, k) => a.map((x, c) => Math.hypot(x, im[k][c])));
    raizPSD.set(q, h);
    const v = [0, 0, 0, 0, 0, 0];
    for (let k = 1; k < h.length; k++) { const df = r.frecuencias[k] - r.frecuencias[k - 1]; for (let c = 0; c < 6; c++) v[c] += 0.5 * df * (h[k][c] ** 2 + h[k - 1][c] ** 2); }
    rms.set(q, v.map(Math.sqrt));
  });
  return { frecuencias: r.frecuencias, raizPSD, rms };
}

/** Resultado del pandeo lineal: factores λ (por |λ| creciente) y formas (dof completo, máx |Ψ| = 1). */
export type PandeoResultado = { factors: number[]; modeShapes: number[][] };

/**
 * PANDEO LINEAL como SAP2000 (Load Case «Buckling»): [K − λ·G(r)]·Ψ = 0, con r = nodeInputs.loads.
 * La axial P-delta de cada barra es la del estático de r (promedio de los dos extremos, CSIRefer cap. XXII)
 * y G se arma en el C++ (utils/pandeo.h) sobre el MISMO K que el modal (muelles, diafragmas, releases…).
 * `axiales`: las del estático de r, por elemento: [N_I, N_J] (fuerzas de extremo de analyze()).
 */
export function bucklingAnalysis(
  nodes: Node[], elements: Element[], nodeInputs: NodeInputs, elementInputs: ElementInputs,
  axiales: Map<number, number[]>, numModes = 6
): PandeoResultado | undefined {
  const ni: any = nodeInputs;
  const P = elements.map((_, e) => { const n = axiales.get(e); return n ? (-n[0] + n[1]) / 2 : 0; });
  const r = modalCpp(nodes, elements, nodeInputs, elementInputs, numModes, 0, 0, 1, ni.diaphragms, ni.springs, undefined, P);
  return r.buckling;
}

/**
 * Tiempo-historia lineal sobre el MISMO modelo que el modal (masa, diafragmas, apoyos, muelles).
 * `numModes` solo cuenta en el método modal (los modos que se superponen).
 */
export function timeHistoryAnalysis(
  nodes: Node[], elements: Element[], nodeInputs: NodeInputs, elementInputs: ElementInputs,
  opc: THOpciones & { numModes?: number; lateralMass?: number; lumpStories?: number; includeElements?: number }
): THResultado | undefined {
  const ni: any = nodeInputs;
  const r = modalCpp(nodes, elements, nodeInputs, elementInputs, opc.numModes ?? 12, opc.lateralMass ?? 0,
    opc.lumpStories ?? 0, opc.includeElements ?? 1, ni.diaphragms, ni.springs, opc);
  return r.timeHistory;
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

/**
 * Masa ENSAMBLADA por nudo [nudo][6] (UX UY UZ RX RY RZ): la tabla «Assembled Joint Masses» de ETABS/SAP2000, con la
 * MISMA `ensamblarMasa()` del modal (30-sep-2026, para la capa NEC: peso y centro de masa por piso). No resuelve nada.
 */
export function jointMass(nodes: Node[], elements: Element[], elementInputs: ElementInputs,
                          opc: { lateral?: number; lump?: number; incluyeElementos?: number; masaNodal?: Map<number, number[]> } = {}): number[][] {
  if (!nodes.length) return [];
  const gc: number[] = [];
  const alloc = (a: ArrayLike<number>, T: any, heap: any) => {
    const t = new T(a.length ? a : [0]); const p = mod._malloc(t.length * t.BYTES_PER_ELEMENT);
    heap.set(t, p / t.BYTES_PER_ELEMENT); gc.push(p); return p;
  };
  const nP = alloc(nodes.flat(), Float64Array, mod.HEAPF64);
  const eI = elements.flat();
  const eP = alloc(eI, Uint32Array, mod.HEAPU32);
  const eS = alloc(elements.map((e) => e.length), Uint32Array, mod.HEAPU32);
  const P = (m?: Map<number, any>) => {
    const k = m ? [...m.keys()] : []; const v = m ? [...m.values()].flat() : [];
    return { kp: alloc(k, Uint32Array, mod.HEAPU32), vp: alloc(v, Float64Array, mod.HEAPF64), size: k.length };
  };
  const ar = P(elementInputs.areas as any), de = P(elementInputs.densities as any), th = P(elementInputs.thicknesses as any);
  const nm = P(opc.masaNodal);
  const out = mod._malloc(nodes.length * 6 * 8); gc.push(out);
  mod._assembled_joint_mass(nP, nodes.length, eP, eI.length, eS, elements.length,
    ar.kp, ar.vp, ar.size, de.kp, de.vp, de.size, th.kp, th.vp, th.size, nm.kp, nm.vp, nm.size,
    opc.incluyeElementos ?? 1, opc.lateral ?? 0, opc.lump ?? 0, out);
  const m = new Float64Array(mod.HEAPF64.buffer, out, nodes.length * 6);
  const res = Array.from({ length: nodes.length }, (_, i) => Array.from(m.subarray(i * 6, i * 6 + 6)));
  gc.forEach((p) => mod._free(p));
  return res;
}
