import { State } from "vanjs-core";

// Analytical Model
export type Mesh = {
  nodes?: State<Node[]>;
  elements?: State<Element[]>;
  nodeInputs?: State<NodeInputs>;
  elementInputs?: State<ElementInputs>;
  deformOutputs?: State<DeformOutputs>;
  analyzeOutputs?: State<AnalyzeOutputs>;
};

// The geometry of any structure can be represented by these two entities:
export type Node = [number, number, number]; // position coordinates [x,y,z]
export type Element = number[]; // indices of the nodes list

export type NodeInputs = {
  supports?: Map<
    number,
    [boolean, boolean, boolean, boolean, boolean, boolean]
  >;
  loads?: Map<number, [number, number, number, number, number, number]>;
  /**
   * Masa concentrada en el nudo, en toneladas. La que NO sale del peso propio
   * de los elementos.
   *
   * En ETABS la fuente de masa son dos interruptores independientes:
   * `INCLUDEELEMENTS` (rho*A*L) e `INCLUDELOADS` (patrones de carga entre g).
   * El CIMENTAC del GAD RIOCHICO tiene el primero en "No" y el segundo en "Yes"
   * con PP y SCP: alli la masa no es el peso propio, son las cargas.
   */
  masses?: Map<number, number>;
  /**
   * Diafragma rigido al que pertenece cada nudo (0 o ausente = ninguno).
   *
   * Un diafragma rigido ata Ux, Uy y Rz de todos los nudos del mismo id: la
   * planta se mueve como un solido en su plano. ETABS lo pone como
   * RESTRICCION, no como rigidez, y sin el un modelo con losas de diafragma
   * sale mucho mas flexible.
   */
  diaphragms?: Map<number, number>;
};

export type SectionShape = {
  type: "rect" | "circ" | "I" | "HSS" | "CFT" | "L" | "2L" | "C" | "2C" | "T" | "pipe" | "coldC";
  // rect: rectangular | circ: circular | I: I/W beam | HSS: hollow rect tube
  // CFT: concrete-filled tube | L: angle | 2L: double angle
  // C: channel | 2C: double channel | T: tee | pipe: circular hollow
  // coldC: cold-formed C/Z
  b?: number;   // width (rect) or flange width (I/C/T) or leg width (L) or outer width (HSS)
  h?: number;   // height (rect) or depth (I/C/T) or leg height (L) or outer height (HSS)
  d?: number;   // diameter (circ/pipe)
  tw?: number;  // web thickness (I/C/T) or wall thickness (HSS/pipe) or leg thickness (L)
  tf?: number;  // flange thickness (I/C/T)
  t?: number;   // uniform thickness (L/coldC)
  r?: number;   // corner radius (HSS/CFT/coldC)
  lip?: number; // lip length (coldC)
  dis?: number; // separation between shapes (2L/2C)
  name?: string; // profile name e.g. "W14x82", "L50x3", "C100x50x2"
  fillE?: number; // CFT: E del hormigon de relleno (mismas unidades que E); con el, el s2k sale como Section Designer
};

export type ElementInputs = {
  elasticities?: Map<number, number>;
  elasticitiesOrthogonal?: Map<number, number>;
  shearModuli?: Map<number, number>;
  areas?: Map<number, number>;
  momentsOfInertiaZ?: Map<number, number>;
  momentsOfInertiaY?: Map<number, number>;
  torsionalConstants?: Map<number, number>;
  thicknesses?: Map<number, number>;
  poissonsRatios?: Map<number, number>;
  densities?: Map<number, number>; // mass density per element (rho)
  polarMomentsOfInertia?: Map<number, number>; // I0 (polar moment of inertia, Paz formulation)
  shearAreasY?: Map<number, number>; // shear area in Y direction (Timoshenko beam)
  shearAreasZ?: Map<number, number>; // shear area in Z direction (Timoshenko beam)
  /** Carga uniformemente repartida sobre la barra, [wx, wy, wz] en GLOBALES.
   *
   *  No la usa el solver —esa carga entra al sistema como fuerzas nodales
   *  equivalentes, que es lo correcto y ya se hacia— sino `analyze()`, para
   *  poder devolver los esfuerzos de verdad. Sin ella, `analyze()` daba solo
   *  k*u y le faltaba el termino de EMPOTRAMIENTO PERFECTO: en una viga de 5 m
   *  con 20 kN/m salia V = 3.71 donde ETABS da 53.71, porque faltaban los
   *  wL/2 = 50, y M = 15.06 donde ETABS da 45.17, porque faltaban los
   *  wL^2/12 = 41.67. Los desplazamientos si eran exactos. */
  frameLoads?: Map<number, [number, number, number]>;
  rigidOffsets?: Map<number, [number, number]>; // [offsetI, offsetJ] rigid zone factors (0-1) at each end
  // END LENGTH OFFSETS de CSI: [offI, offJ, rigidZoneFactor] — longitudes en
  // unidades del modelo y factor 0-1. NO es `rigidOffsets` (el de awatif, que
  // ALARGA la barra): aqui el brazo va DENTRO de la luz y lo que se acorta es
  // el tramo flexible. Con rz = 0 —el defecto de ETABS— no cambia la rigidez.
  endOffsets?: Map<number, [number, number, number]>;
  /**
   * Angulo de eje local de barra, en GRADOS, alrededor del eje 1 — el "local
   * axis angle" de CSI (`FrameObj.SetLocalAxes` de ETABS). Ausente = 0.
   * Gira la seccion sin mover la barra: una C 200x50 a 90 grados pasa de
   * I = 6.20e6 a 0.53e6 mm4, asi que sin esto un modelo importado de ETABS no
   * es la misma estructura por mucho que las secciones coincidan.
   */
  localAngles?: Map<number, number>;
  // Frame releases via static condensation. Two formats:
  //  6 flags: [TI,M2I,M3I, TJ,M2J,M3J]  (rotational only, legacy)
  // 12 flags: [FxI,FyI,FzI,TI,M2I,M3I, FxJ,FyJ,FzJ,TJ,M2J,M3J] (all DOFs, like ETABS)
  momentReleases?: Map<number, boolean[]>;
  // Partial fixity springs (semi-rigid connections), kip/in or kN/m, kip-in/rad or kN-m/rad
  // 12 values: [kFxI,kFyI,kFzI,kTI,kM2I,kM3I, kFxJ,kFyJ,kFzJ,kTJ,kM2J,kM3J]
  // 0 = no spring (fully released if release=true, fully fixed if release=false)
  // >0 = partial fixity spring stiffness
  partialFixitySprings?: Map<number, number[]>;
  insertionPoints?: Map<number, [number, number]>; // [dy, dz] offset from centroid in local coords
  sectionShapes?: Map<number, SectionShape>; // visual section data for rendering
  /** Plate formulation per shell element:
   *   0 (default) = Mindlin-Reissner = ETABS "Shell-Thick" (DSE Wilson Ch10)
   *   1           = MZC Kirchhoff    = ETABS "Shell-Thin"  (DKE Wilson Ch10)
   *
   * Para Mesa Torsión (slab delgado t/L=0.017) usar 1 → matchea ETABS Shell-Thin
   * dentro de < 1.5% en V/M/T (validado vs hekatan-struct-py).
   */
  /**
   * Tipo de cascara, con los MISMOS numeros que la OAPI de CSI:
   *   0 = Shell-Thick (Mindlin)   [defecto]
   *   1 = Shell-Thin  (Kirchhoff)
   *   2 = MEMBRANA (sin flexion)
   *
   * No es solo para el solver: los exportadores .e2k y .s2k lo escriben tal
   * cual lo escriben ETABS y SAP —`MODELINGTYPE "Membrane"` y `Type=Membrane`—
   * porque si no, el mismo modelo daba 1.500000 por la OAPI y 1.491651 al
   * pasar por el fichero, y la comparacion no medía el exportador: medía dos
   * elementos distintos.
   */
  plateFormulations?: Map<number, number>;
  /** Drilling DOF (rotación θz normal al shell) por elemento:
   *   0 = penalty 1e-6 legacy (drilling efectivamente desacoplado — usar para
   *       compatibilidad con resultados previos)
   *   1 = PyNite weak spring (k_Rz = min(diag_rot)/1000)
   *   2 = Hughes-Brezzi 1989 / Ibrahimbegovic-Taylor-Wilson 1990  [DEFAULT]
   *       penalty acoplado al residual θz - 0.5·(∂v/∂x − ∂u/∂y),
   *       γ = G·t · drillingPenaltyScales[idx] (default scale=1.0).
   *
   * El modo 2 es el ÚNICO que transmite torsión losa↔viga consistente con
   * ETABS/SAP (referencia: CSI Analysis Reference Manual §10.1.1 cita
   * Taylor & Simo 1985 / Ibrahimbegovic & Wilson 1991; Wilson Cap 9
   * "Elemento de Membrana con Rotaciones Normales").
   */
  drillingTypes?: Map<number, number>;
  drillingPenaltyScales?: Map<number, number>;
  /**
   * La union viga-muro de ETABS (medida el 2-sep-2026): en cada nudo de un muro
   * donde entra una barra, ETABS ata el giro drilling al giro de la arista
   * horizontal con c = E·t·(H/L)³/32. `etabsjoint 1` en el .heks. Apagado por
   * defecto: SAP2000 no lo hace. Ver addEtabsWallJoint en deform.cpp.
   */
  etabsWallJoint?: boolean;
  /** Solidos H8 (elementos de 8 nudos): modos incompatibles de Wilson-Taylor, como SAP2000 (defecto true). */
  solidIncompatible?: boolean;
  /**
   * Property modifiers de cascara, estilo ETABS
   * (Assign -> Area -> Stiffness Modifiers). Multiplican la rigidez de
   * MEMBRANA y de FLEXION del shell. Por defecto 1.0.
   *
   * Ya los usaban `shellQ4.cpp` y `shellThin.cpp`, y `deformCpp.ts` ya los
   * pasa al WASM, pero **no estaban declarados aqui**, asi que solo se podian
   * poner con un `as any`. Hacen falta para:
   *
   *   - **pure-plate**: `membraneModifiers = 0` deja la FLEXION sola. Es lo
   *     que SAP2000 llama Plate-Thin / Plate-Thick, y lo que el manual de CSI
   *     describe como «pure-plate behavior» (§10.1.1).
   *   - **deck / nervada / waffle**: una losa nervada no es una placa maciza
   *     de su canto total; sin poder bajarle la rigidez en una direccion sale
   *     rigida de mas.
   */
  membraneModifiers?: Map<number, number>;
  bendingModifiers?: Map<number, number>;
  /**
   * Property modifiers DIRECCIONALES por elemento, en el orden del .e2k:
   *
   *   [0..2] F11MOD F22MOD F12MOD   membrana
   *   [3..5] M11MOD M22MOD M12MOD   flexion
   *   [6..7] V13MOD V23MOD          cortante transversal
   *
   * Es lo que define una losa NERVADA o un DECK: rigido en el sentido del
   * nervio (M11 ~ 1) y blando cruzado (M22 ~ 0). Con un escalar no se puede
   * expresar — o se multiplica todo o nada, y poniendo 0 la matriz sale
   * singular. Si un elemento esta en este mapa, MANDAN estos y los escalares
   * de arriba quedan en 1.0.
   *
   * Ya estaba en el C++ (`shellModifiers`) y `deformCpp.ts` ya lo pasaba al
   * WASM; faltaba declararlo aqui.
   */
  shellModifiers?: Map<number, number[]>;
};

export type DeformOutputs = {
  deformations?: Map<number, [number, number, number, number, number, number]>;
  reactions?: Map<number, [number, number, number, number, number, number]>;
};

export type AnalyzeOutputs = {
  normals?: Map<number, [number, number]>;
  shearsY?: Map<number, [number, number]>;
  shearsZ?: Map<number, [number, number]>;
  torsions?: Map<number, [number, number]>;
  bendingsY?: Map<number, [number, number]>;
  bendingsZ?: Map<number, [number, number]>;
  bendingXX?: Map<number, number[]>;
  bendingYY?: Map<number, number[]>;
  bendingXY?: Map<number, number[]>;
  membraneXX?: Map<number, number[]>;
  membraneYY?: Map<number, number[]>;
  membraneXY?: Map<number, number[]>;
  tranverseShearX?: Map<number, number[]>;
  tranverseShearY?: Map<number, number[]>;
  vonMises?: Map<number, number[]>;
  /** Momentos de cascara SIN promediar entre elementos: en el centroide (un numero por
   *  elemento) y en sus 4 joints (Shell-Thick de CSI). Signo de CSI. Para comparar con
   *  AreaForceShell de ETABS/SAP2000 elemento a elemento; el colormap usa bendingXX. */
  bendingXXcentro?: Map<number, number>;
  bendingYYcentro?: Map<number, number>;
  bendingXYcentro?: Map<number, number>;
  bendingXXjoint?: Map<number, number[]>;
  bendingYYjoint?: Map<number, number[]>;
  bendingXYjoint?: Map<number, number[]>;
  /** Presión de contacto Winkler/soil (kN/m² o tonf/m²). Usado por zapatas con springs. */
  pressure?: Map<number, number[]>;
  /**
   * Override opcional del rango [min, max] del colormap por campo específico.
   * Keys: "pressure", "bendingXX", "vonMises", etc. (los del shell results dropdown).
   * Cualquier campo no listado aquí usa auto-escala.
   * Útil p.ej. para zapata: { pressure: [0, -q_adm] } fija rango de pressure pero NO afecta bendingXX.
   */
  colorMapRanges?: Record<string, [number, number]>;
};

export type ModalOutputs = {
  frequencies?: number[];    // natural frequencies [Hz]
  modeShapes?: number[][];   // mode shapes [mode_index][dof_index]
  massParticipation?: number[][]; // [mode_index][6] ratios (ux,uy,uz,rx,ry,rz)
};

// ═══════════════════════════════════════════════════════════════════════════
// LOAD PATTERNS & LOAD CASES — equivalente conceptual al diálogo ETABS
// ═══════════════════════════════════════════════════════════════════════════
// Pattern = "origen físico" de la carga (Dead, Live, Wind, EQX, ...). Los
//   códigos de diseño (ASCE/ACI/AISC/NEC) los combinan con factores
//   distintos, por eso hay que mantenerlos separados desde el origen.
// Case = "operación de análisis" (Linear Static, Modal, THA, RS, Pushover...)
//   que aplica uno o más patterns con factores de escala. Un mismo pattern
//   puede usarse en muchos cases (Dead service vs Dead pushover).

export type LoadPatternType =
  | "Dead"
  | "Live"
  | "Live (Roof)"
  | "Wind"
  | "Seismic"
  | "Snow"
  | "Rain"
  | "Temperature"
  | "Other";

export type LoadPattern = {
  /** Nombre único, e.g. "Dead", "Live", "EQX". Coincide con el `LC` que
   *  pueden referenciar las cargas nodales (nodeInputs.loads → POINTLOAD).  */
  name: string;
  type: LoadPatternType;
  /** Multiplicador de peso propio aplicado por el solver (γ·V·SW_mult).
   *  Típicamente 1.0 para Dead, 0 para los demás. */
  selfWeightMultiplier: number;
  /** Auto-lateral load — string informativo por ahora (e.g. "ASCE 7-22",
   *  "NSR-10", "None"). En el futuro: trigger de generación automática de
   *  fuerzas estáticas equivalentes. */
  autoLateralLoad?: string;
};

export type LoadCaseType =
  | "Linear Static"
  | "Modal - Eigen"
  | "Modal - Ritz"
  | "Response Spectrum"
  | "Time History - Linear"
  | "Time History - Nonlinear"
  | "Nonlinear Static (Pushover)"
  | "Buckling";

export type LoadCase = {
  name: string;
  type: LoadCaseType;
  /** Patterns aplicados con factor de escala. Vacío si el case no usa
   *  patterns (e.g. Modal-Eigen). */
  patterns?: Array<{ pattern: string; scaleFactor: number }>;
  /** Condición inicial — "Zero" parte del estado descargado, "Preset"
   *  hereda del case anterior (típico en multi-stage analyses). */
  initialCondition?: "Zero" | "Preset";
  /** Sólo para Modal cases — número máximo de modos a calcular. */
  maxModes?: number;
};

// ═══════════════════════════════════════════════════════════════════════════
// LOAD COMBINATIONS (combinaciones lineales de cases para diseño)
// ═══════════════════════════════════════════════════════════════════════════
// Combo = Σ (case_i × SF_i). No requiere re-análisis, solo suma de
// resultados. Típico de códigos: ASCE 7-22 LRFD genera ~12 combos, ACI 318
// otros ~8, AISC 360 LRFD/ASD ~10 cada uno.

export type LoadCombinationType =
  | "Linear Add"
  | "Envelope"
  | "Absolute Add"
  | "SRSS";

export type LoadCombination = {
  name: string;          // e.g. "1.2D+1.6L", "0.9D+1.0W"
  type: LoadCombinationType;
  cases: Array<{ case: string; scaleFactor: number }>;
};
