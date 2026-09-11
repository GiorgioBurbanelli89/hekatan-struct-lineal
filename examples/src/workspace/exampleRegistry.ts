/**
 * Registry de ejemplos llamables desde el workspace Tweakpane.
 * Cada ejemplo es un módulo que exporta un ExampleDef con su build().
 */
import type { State } from "vanjs-core";
import type * as THREE from "three";
import type {
  Node, Element, NodeInputs, ElementInputs,
  DeformOutputs, AnalyzeOutputs,
  LoadPattern, LoadCase, LoadCombination,
} from "hekatan-fem";

export interface ParamDef {
  default: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  /** Si se define, Tweakpane lo renderiza como dropdown (numeric enum) */
  options?: Record<string, number>;
  /** Si `true`, se renderiza como CHECKBOX (on/off) en Tweakpane.
   *  El valor se guarda como 0 (off) o 1 (on) en `params`. Ejemplo: toggles
   *  para activar/desactivar patrones de carga D/L/S. */
  boolean?: boolean;
  /** Folder del Tweakpane donde va (e.g. "Geometría", "Luces", "Cargas").
   *  Si no se define, va en el folder raíz "Parámetros". */
  folder?: string;
  /** Si true, el param NO va en el panel de parámetros; se rinde dentro del folder
   *  "⚡ Modal + Animación" en Settings (p.ej. N° de modos, Método modal). */
  inModal?: boolean;
  /**
   * Si `true`, el workspace agrega en el folder "📏 Rangos" (o el folder
   * equivalente) dos sliders readonly "<label> min" y "<label> max" que le
   * permiten al usuario ampliar o reducir el rango del slider principal.
   *
   * Inspirado en el panel "Rangos" de beams/FEM-Studio donde el usuario podía
   * extender CM de (−20, 0) a (−50, 0) sin editar código. Default: los
   * parámetros con unitType="force"|"moment" lo activan automáticamente.
   */
  rangeAdjustable?: boolean;
  /**
   * Si `true`, el workspace RECONSTRUYE el pane entero tras cada cambio en
   * este param. Útil para params "estructurales" (nPisos, nVanosX, nVanosY)
   * que regeneran `dynamicParams(currentParams)`.
   *
   * Sin esta flag, el cambio solo dispara `scheduleRebuild()` (re-ejecuta
   * ex.build) pero el pane mantiene los mismos sliders.
   */
  regenOnChange?: boolean;
  /**
   * Tipo de unidad del parámetro. Cuando se setea:
   *   - El valor almacenado en `currentParams` se convierte automáticamente
   *     a la unidad base SI (kN para fuerza, kN·m para momento, m para
   *     desplazamiento, etc.) cuando ex.build() lo lee.
   *   - El slider del Tweakpane muestra el valor en la unidad UI
   *     seleccionada por el usuario (forceUnit/dispUnit). Al cambiar unidad,
   *     los sliders se reescalan automáticamente.
   *   - El label recibe el sufijo de unidad actual, p. ej. "F lateral (kN)"
   *     → "F lateral (tonf)" tras switch.
   *
   * Valores soportados:
   *   "force"   → kN / tonf / kip         (base SI: kN)
   *   "moment"  → kN·m / tonf·m / kip·ft  (base SI: kN·m)
   *   "disp"    → mm / cm / µm            (base SI: m)
   *
   * Si no se define, el parámetro es adimensional y no sufre conversión.
   */
  unitType?: "force" | "moment" | "disp";
  /** Si la función retorna true, el binding se oculta (Tweakpane `.hidden = true`).
   *  Se re-evalúa en cada rebuild. Útil para mostrar `ks_factor` solo en Custom,
   *  o sliders de carga simple solo si useSimple=ON. */
  hiddenIf?: (params: Record<string, number>) => boolean;
  /** Tooltip que aparece en hover sobre el binding. Aplicado como `title`
   *  attribute en el DOM. Texto plano (no HTML). Útil para explicar qué
   *  representa el parámetro, sus unidades, y orden de magnitud típico.
   *  Ej: "Distancia entre ejes de columnas, en metros. Típico 3-6 m." */
  description?: string;
}

export interface BuildStates {
  nodes: State<Node[]>;
  elements: State<Element[]>;
  nodeInputs: State<NodeInputs>;
  elementInputs: State<ElementInputs>;
  deformOutputs: State<DeformOutputs>;
  analyzeOutputs: State<AnalyzeOutputs>;
  objects3D: State<THREE.Object3D[]>;
  /** Load Patterns — definidos en el panel "📋 Load Patterns" del workspace.
   *  Los ejemplos pueden leer `loadPatterns.val` para aplicar peso propio
   *  según `selfWeightMultiplier` del pattern "Dead" (o el que corresponda). */
  loadPatterns?: State<LoadPattern[]>;
  /** Load Cases — definidos en el panel "📊 Load Cases". El case "activo"
   *  se elige con un selector y determina qué patterns aplicar al `build()`. */
  loadCases?: State<LoadCase[]>;
  /** Case activo cuyos resultados se visualizan en el viewer. */
  activeLoadCase?: State<string>;
  /** Load Combinations — combos lineales de cases para diseño (ej. 1.2D+1.6L) */
  loadCombinations?: State<LoadCombination[]>;
}

// ═══════════════════════════════════════════════════════════════════════════
// Defaults ETABS-like (Dead/Live patterns + Dead/Live/Modal cases)
// ═══════════════════════════════════════════════════════════════════════════
export const DEFAULT_LOAD_PATTERNS: LoadPattern[] = [
  { name: "Dead", type: "Dead", selfWeightMultiplier: 1, autoLateralLoad: "None" },
  { name: "Live", type: "Live", selfWeightMultiplier: 0, autoLateralLoad: "None" },
];

export const DEFAULT_LOAD_CASES: LoadCase[] = [
  { name: "Dead", type: "Linear Static", patterns: [{ pattern: "Dead", scaleFactor: 1 }], initialCondition: "Zero" },
  { name: "Live", type: "Linear Static", patterns: [{ pattern: "Live", scaleFactor: 1 }], initialCondition: "Zero" },
  { name: "Modal", type: "Modal - Eigen", initialCondition: "Zero", maxModes: 12 },
];

export const DEFAULT_LOAD_COMBINATIONS: LoadCombination[] = [
  // Servicio = "CARGA VERTICAL" del libro Guerra/SAFE (1.0D+1.0L). Es la combinación con la
  // que se verifica la PRESIÓN del suelo vs q_adm (Figura 180 del libro = CARGA VERTICAL).
  { name: "Servicio D+L", type: "Linear Add", cases: [
    { case: "Dead", scaleFactor: 1.0 }, { case: "Live", scaleFactor: 1.0 }] },
  { name: "1.4D", type: "Linear Add", cases: [{ case: "Dead", scaleFactor: 1.4 }] },
  { name: "1.2D+1.6L", type: "Linear Add", cases: [
    { case: "Dead", scaleFactor: 1.2 }, { case: "Live", scaleFactor: 1.6 }] },
  // Última = "CARGA ÚLTIMA" del libro (ACI 318 clásico, 1.4D+1.7L) — para el diseño estructural.
  { name: "1.4D+1.7L", type: "Linear Add", cases: [
    { case: "Dead", scaleFactor: 1.4 }, { case: "Live", scaleFactor: 1.7 }] },
];

export interface ModalPanelApi {
  div: HTMLElement;
  render: (out: any, meta: { title: string; properties?: string[] }) => void;
}

// Re-export de activeExampleVersion (vive en ./exampleVersion para evitar TDZ).
// Los ejemplos que lo usan DEBEN importarlo desde ./exampleVersion directamente,
// no desde aquí (para cortar la circularidad registry ← ejemplo ← registry).
export { activeExampleVersion } from "./exampleVersion";

export interface ExampleDef {
  id: string;
  name: string;
  category: string;
  /**
   * Los PATRONES de carga del ejemplo, además de Dead y Live (que siempre están, como
   * en ETABS): p. ej. `[{ nombre: "Ex", tipo: "Seismic" }]`. El workspace crea un caso por
   * patrón y las combinaciones sísmicas, y el ejemplo reparte sus cargas con
   * `cargasDelCaso()` (shared/cargasPorCaso.ts) para que cada caso muestre SOLO lo suyo.
   */
  patrones?: Array<{ nombre: string; tipo: LoadPattern["type"] }>;
  /**
   * Si `true`, este ejemplo es un caso de **benchmark validado** — se compara
   * contra una referencia conocida (Paz 6.3, Serquen SF-70, OpenSees, CalculiX,
   * Bowles, etc.). En el selector del workspace aparece con un emoji 🏁
   * adelante para distinguirlo. Útil para que el usuario pueda elegir
   * directamente "Benchmarks" desde la categoría y validar el solver.
   */
  benchmark?: boolean;
  /**
   * Exportador E2K custom — si está definido, el botón "Exportar E2K" del
   * toolbar ETABS lo invoca en vez del genérico `e2kExporter.ts`. Útil para
   * benchmarks que necesitan emitir formato exacto de ETABS (p.ej. HSS hueco
   * con `SHAPE "Steel Tube"`, CFT con `Filled Steel Tube`, etc.).
   *
   * La función debe encargarse de descargar el archivo (e.g. via Blob+
   * download anchor) — el toolbar solo dispara la invocación.
   */
  customE2kExport?: (params: Record<string, number>, states: BuildStates) => void;
  /** Devuelve el bloque sísmico NEC (espectro USER + caso Modal Eigen/Ritz + RS) para
   *  inyectar en el e2k del export genérico — así el e2k trae el mismo sismo/modal que Settings. */
  e2kSeismic?: (params: Record<string, number>, states: BuildStates) => any;
  /**
   * Exportador F2K (SAFE) custom — si está definido, el botón "📤 Exportar F2K"
   * del folder SAFE lo invoca en vez del genérico `downloadZapataF2k` (que solo
   * sabe de zapatas individuales con `p.Lz`, `p.Bz`).
   *
   * Útil para ejemplos de cimentación con geometría compuesta (zapata + viga de
   * amarre, losa de cimentación, viga de cimentación, zapata combinada, etc.).
   * La función recibe los params actuales del Tweakpane y se encarga de
   * descargar el archivo (típicamente vía `downloadEdificioCimentacionF2k`).
   */
  exportF2k?: (params: Record<string, number>) => void | Promise<void>;
  /**
   * Pasos numerados de uso del ejemplo. Se renderiza como folder "📖 Guía"
   * en Tweakpane, expandido por default cuando el ejemplo es nuevo para el
   * usuario (gobierno por localStorage flag por id).
   * Cada string es un paso conciso (idealmente < 80 chars).
   *   ej: ["Mové q_adm para fijar la presión admisible del suelo",
   *        "ks_factor = 10.5 es Bowles típico, ajustá según ensayo de placa",
   *        "El folder Calculados muestra σ_max — debe cumplir σ/q_adm ≤ 1"]
   */
  guide?: string[];
  /**
   * Si se define, este ejemplo NO usa el flujo Tweakpane del workspace.
   * Es un ejemplo "legacy" del upstream awatif (1d-mesh, 2d-mesh, beams, color-map…)
   * con su propia UI VanJS toolbar. Al seleccionarlo en el selector, el workspace
   * muestra un botón "Abrir ejemplo →" que navega a la página standalone
   * (`/<id>/index.html`). Cuando esto está presente, `params` y `build` son
   * ignorados (pueden estar vacíos o no existir).
   */
  standaloneUrl?: string;
  params?: Record<string, ParamDef>;
  /** Construye el modelo y ejecuta el análisis estático */
  build?: (params: Record<string, number>, states: BuildStates, modalPanel?: ModalPanelApi) => void;
  /** ¿Soporta análisis modal? */
  hasModal?: boolean;
  /** Si hasModal=true, función que corre el modal y actualiza modalPanel */
  runModal?: (params: Record<string, number>, states: BuildStates, modalPanel: ModalPanelApi) => void;
  /**
   * Callback que permite que un param derive/actualice otros params.
   * Se llama DESPUÉS de cada cambio, ANTES del rebuild. El ejemplo muta `params` in-place
   * y el workspace refresca la UI para reflejar los cambios.
   * Ejemplo: al cambiar soilType, actualizar q_adm y ks_factor.
   */
  onParamChange?: (changedKey: string, params: Record<string, number>) => void;
  /**
   * Genera params adicionales dinámicamente en función del estado actual de
   * `currentParams`. Se llama en CADA rebuild del pane (después de cambiar
   * parámetros de estructura como nPisos, nVanosX, nVanosY).
   *
   * Caso de uso clásico: secciones por piso. Si `currentParams.nPisos = 3`,
   * `dynamicParams` retorna { bCol_p1, hCol_p1, bCol_p2, hCol_p2, bCol_p3, hCol_p3 }.
   * Al cambiar nPisos a 5, se regeneran los sliders automáticamente.
   *
   * IMPORTANT: los keys retornados deben ser ÚNICOS y no colisionar con los
   * params estáticos. Convención: usar sufijos tipo `_p1`, `_p2`, `_vx1`, etc.
   *
   * Los valores actuales en currentParams se preservan si la key existía antes;
   * solo las nuevas keys usan `default` del ParamDef retornado.
   */
  dynamicParams?: (currentParams: Record<string, number>) => Record<string, ParamDef>;
  /**
   * Devuelve valores DERIVADOS (calculados) que se muestran como read-only en
   * el Tweakpane en el folder "📊 Calculados". Se llama después de cada build.
   * Ejemplo zapata: ks (módulo balasto), D (rigidez flexural), k_r (Biot), q_max.
   * Las keys son el label visible; los values se muestran como texto (ya formateados
   * con unidades, e.g. "ks = 2205 kN/m³").
   */
  computedLabels?: (params: Record<string, number>, states: BuildStates) => Record<string, string>;
  /**
   * Valores calculados INLINE — se muestran como read-only justo DESPUÉS del
   * parámetro indicado por `after` (en su mismo folder del Tweakpane). Útil para
   * mostrar ks calculado debajo de q_adm/ks_factor, o Mu debajo de la carga, etc.
   * Se actualizan en cada rebuild.
   */
  inlineComputed?: Array<{
    after: string;                                                        // key del param después del cual insertar
    label: string;                                                        // etiqueta visible
    compute: (params: Record<string, number>, states: BuildStates) => string;
    hiddenIf?: (params: Record<string, number>) => boolean;                // oculta dinámicamente
  }>;
  /** Shell colormap por defecto para este ejemplo (e.g. "bendingXX", "pressure"). */
  /** Desde qué octante mira la cámara isométrica (signos de x, y, z). Defecto [+1, −1, +1]: ve las caras
   *  x = máx e y = 0. Un ejemplo cuyo muro vive en x = 0 (test-m-dual) pone [−1, −1, +1] para que se VEA. */
  viewFrom?: [number, number, number];
  defaultShellResult?: string;
  /**
   * Resultado de BARRA por defecto (e.g. "normal", "shearY", "bendingZ").
   *
   * Hace falta para los ejemplos que no tienen ni una cascara: sin esto el
   * visor abre con un campo de cascara y la barra de color sale entera a CERO,
   * que es peor que no salir — parece un resultado nulo y es que no hay a que
   * aplicarlo. Le paso al muro de largueros, que son 94 barras y 0 cascaras.
   */
  defaultFrameResult?: string;
  /**
   * Lista explícita de opciones de Shell results que aplican a este ejemplo.
   * El dropdown filtra el resto. Si no se declara, se muestran todas.
   * Ej: placas flexión → ["bendingXX", "bendingYY", "bendingXY", "displacementZ"]
   *     zapatas Winkler → ["pressure", "displacementZ"]
   *     membrana → ["membraneXX", "membraneYY", "membraneXY", "vonMises"]
   */
  availableShellResults?: string[];
}

// ── Import de ejemplos (cada uno en su propia carpeta estilo awatif) ──
import { csiImporter } from "../csi-importer/csiImporter";
import { cliModeler } from "../cli-modeler/cliModeler";
import { cadDraw } from "../cad-draw/cadDraw";
import { vigaMedioElastico } from "../viga-medio-elastico/vigaMedioElastico";
import { zapataVigaAmarre } from "../zapata-viga-amarre/zapataVigaAmarre";
import { zapataAislada } from "../zapata-aislada/zapataAislada";
import { zapataAisladaValidacion } from "../zapata-aislada-validacion/zapataAisladaValidacion";
// ── SAFE Benchmarks (validación cruzada Hekatan vs SAFE 20 API, paridad <0.33%) ──
import { safeBenchLosa } from "../safe-bench-losa-cimentacion/safeBenchLosa";
import { safeBenchViga } from "../safe-bench-viga-cimentacion/safeBenchViga";
import { safeBenchCombinada } from "../safe-bench-zapata-combinada/safeBenchCombinada";
import { safeBenchConectada } from "../safe-bench-zapata-conectada/safeBenchConectada";
import { safeBenchComparativa } from "../safe-bench-zapata-comparativa/safeBenchComparativa";
// ── Benchmarks libro Marcelo Guerra Avendaño MDI ──
import { guerraEj1ZapataCuadrada } from "../guerra-ej1-zapata-cuadrada/guerraEj1";
import { guerraEj2ZapataRectangular } from "../guerra-ej2-zapata-rectangular-sismo/guerraEj2";
import { guerraEj3ZapataRectangularEccGrande } from "../guerra-ej3-zapata-rectangular-eccentricidad-grande/guerraEj3";
import { guerraEj4ZapataCombinada } from "../guerra-ej4-zapata-combinada-rectangular/guerraEj4";
import { guerraEj5ZapataTrapezoidal } from "../guerra-ej5-zapata-combinada-trapezoidal/guerraEj5";
import { guerraEj6ZapataUnida } from "../guerra-ej6-zapata-unida-viga-amarre/guerraEj6";
import { benchmarkSafeEx01Plate } from "../benchmark-safe-ex01-plate/benchmarkSafeEx01Plate";
import { benchmarkSafeEx04PlateBeams } from "../benchmark-safe-ex04-plate-beams/benchmarkSafeEx04PlateBeams";
import { guerraEj7VigaCimentacion } from "../guerra-ej7-viga-cimentacion-new/guerraEj7";
import { guerraEj8LosaCimentacion } from "../guerra-ej8-losa-cimentacion/guerraEj8";
import { vigaCimGuerraEj7 } from "../viga-cim-guerra-ej7/vigaCimGuerra";
import { vigaCimGuerraEj7Tinv } from "../viga-cim-guerra-ej7-tinv/vigaCimGuerraTinv";
import { edificioConLosa } from "../edificio-con-losa/edificioConLosa";
import { edificioConMuros } from "../edificio-con-muros/edificioConMuros";
import { plane } from "../plane/plane";
import { membranaCSI } from "../membrana-csi/membranaCSI";
import { plateThin } from "../plate-thin/plateThin";
import { plateWithBeams } from "../plate-with-beams/plateWithBeams";
import { slabBeamsColumns } from "../slab-beams-columns/slabBeamsColumns";
import { plateThick } from "../plate-thick/plateThick";
import { membrana } from "../membrana-pstress/membrana";
import { drillingDof } from "../test/drillingDof";
import { itwPatchTest, itwCantilever, itwCook, itwHemisferio } from "../test/itwBenchmarks";
import { shellThin } from "../shell-thin/shellThin";
import { benchmark3way } from "../benchmark-3way/benchmark3way";
import { benchmarkCft } from "../benchmark-cft/benchmarkCft";
import { benchmarkCftCantilever } from "../benchmark-cft-cantilever/benchmarkCftCantilever";
import { benchmarkSteelCantilever } from "../benchmark-steel-cantilever/benchmarkSteelCantilever";
import { benchmarkConcreteCantilever } from "../benchmark-concrete-cantilever/benchmarkConcreteCantilever";
// ── Benchmarks Paz (validación contra "Structural Dynamics" 6ª ed) ──
import { benchmarkPaz4_1 } from "../benchmark-paz-4-1/benchmarkPaz4_1";
import { benchmarkPaz6_1 } from "../benchmark-paz-6-1/benchmarkPaz6_1";
import { benchmarkPaz7_1 } from "../benchmark-paz-7-1/benchmarkPaz7_1";
import { benchmarkPaz8_1 } from "../benchmark-paz-8-1/benchmarkPaz8_1";
import { benchmarkPaz9_3 } from "../benchmark-paz-9-3/benchmarkPaz9_3";
import { benchmarkPaz10_7 } from "../benchmark-paz-10-7/benchmarkPaz10_7";
import { benchmarkPaz11_1 } from "../benchmark-paz-11-1/benchmarkPaz11_1";
import { benchmarkPaz12_1 } from "../benchmark-paz-12-1/benchmarkPaz12_1";
import { benchmarkPaz13_1 } from "../benchmark-paz-13-1/benchmarkPaz13_1";
import { muroLargueros } from "../muro-largueros/muroLargueros";
import { estructuraMixta } from "../estructura-mixta/estructuraMixta";
import { mesaTorsion } from "../mesa-torsion/mesaTorsion";
import { shellThick } from "../shell-thick/shellThick";
import { layeredShell } from "../layered-shell/layeredShell";
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import { edificioLadera } from "../edificio-ladera/edificioLadera";
import { edificioComparativaFem } from "../edificio-comparativa-fem/edificioComparativaFem";
// Variantes limpias de edificios por tipo estructural
import { edificioHormigon } from "../edificio-hormigon/edificioHormigon";
import { edificioAceroV2 } from "../edificio-acero-v2/edificioAceroV2";
import { edificioMixto } from "../edificio-mixto/edificioMixto";
import { edificioMuros } from "../edificio-muros/edificioMuros";
import { edificioDual } from "../edificio-dual/edificioDual";
import { columnaCft } from "../columna-cft/columnaCft";
import { triangularPlate } from "../triangular-plate/triangularPlate";
import { conexionRbs } from "../conexion-rbs/conexionRbs";
import { conexionBfp } from "../conexion-bfp/conexionBfp";
import { conexionEndPlate } from "../conexion-end-plate/conexionEndPlate";
import { placaBase } from "../placa-base/placaBase";
import { trussGen } from "../truss-gen/trussGen";
import { barraAxial } from "../W1_barra_axial/barraAxial";
import { vigaAxialCantilever } from "../W2_viga_axial_cantilever/vigaAxialCantilever";
import { vigaAxialConcreteCantilever } from "../W2_viga_axial_concrete_cantilever/vigaAxialConcreteCantilever";
import { vigaAxialCompositeCantilever } from "../W2_viga_axial_composite_cantilever/vigaAxialCompositeCantilever";
import { vigaAxialCompositeEncasedCantilever } from "../W2_viga_axial_composite_encased_cantilever/vigaAxialCompositeEncasedCantilever";
import { vigaFlexionConcreteCantilever } from "../W2_viga_flexion_concrete_cantilever/vigaFlexionConcreteCantilever";
import { vigaFlexionSteelCantilever } from "../W2_viga_flexion_steel_cantilever/vigaFlexionSteelCantilever";
import { vigaFlexionCompositeSlabCantilever } from "../W2_viga_flexion_composite_slab_cantilever/vigaFlexionCompositeSlabCantilever";
import { vigaFlexionCompositeEncasedCantilever } from "../W2_viga_flexion_composite_encased_cantilever/vigaFlexionCompositeEncasedCantilever";
import { portico2D } from "../portico-2d/portico2D";
import { cerramiento } from "../cerramiento/cerramiento";
import { tower3D } from "../tower-3d/tower3D";
import { galpon } from "../galpon/galpon";
import { galponBodega } from "../galpon-bodega/galponBodega";
import { edifAcero } from "../edif-acero/edifAcero";
import { mezanine } from "../mezanine/mezanine";
// 🎓 Test M — modelos de los objetivos específicos de la tesis
import { edificioFrameNec } from "../edificio-frame-nec/edificioFrameNec";
// Lienzo en blanco para dibujar (CAD interactivo)
import { newBlank } from "../new-blank/newBlank";
// 🎓 Test M — edificio paramétrico (pórticos / +losa / dual) con sísmico NEC-15 + selector NEC/ASCE
import { testMPortico, testMLosa, testMDual } from "../test-m/testM";
// Los seis casos del elemento ITW-1990 (membrana con drilling), traidos de
// `calcpad-ceinci-lab/*.cpd`. Ver la cabecera de `itwTests.ts`.
import { itwTodos } from "../itw/itwTests";
// La PLANTILLA: no es un ejemplo cerrado, es el punto de partida de un modelo
// nuevo. La abre el boton "Nuevo modelo" de la portada.
import { plantillas } from "../plantillas/plantillas";
// Legacy del upstream awatif (rebrandeados, abren standalone)
import {
  legacyAwatifExamples,
  legacyBeams,           // Paz 6.3 Space Frame (FRAME 1D)
  solidCubeFEM,          // Cubo H8 (SOLIDO)
  bulboPresionesSuelo,   // Bulbo presiones (COMBINADO area+spring)
  muroContencionSolido,  // Muro de contencion en solidos H8 (vs SAP2000)
} from "./legacyAwatif";

export const examplesRegistry: ExampleDef[] = [
  plantillas,             // 📐 Nuevo modelo → Plantillas
  // 🌀 DRILLING ITW — los seis casos del elemento de Ibrahimbegovic,
  // Taylor & Wilson (1990). Los cuatro tests miden la formulacion contra
  // su referencia; los dos muros ensenan PARA QUE sirve el drilling.
  ...itwTodos,
  // 🎓 TEST M — modelos de los objetivos específicos de la tesis de maestría
  testMDual,              // Dual (pórtico+losa+muros) — sísmico NEC-15 completo + selector NEC/ASCE
  testMPortico,           // Solo pórticos (sin losa)
  testMLosa,              // Pórtico + losa
  edificioFrameNec,       // Edificio pórtico paramétrico (frame puro) + carga lateral NEC
  // 🧪 TEST — casos de prueba / desarrollo (categoría "test")
  drillingDof,            // 2 muros + viga de acople (drilling DOF + test exportador e2k)
  itwPatchTest,           // ITW I   — patch test de orden superior (exacto 1.5 / 0.6)
  itwCantilever,          // ITW II  — cantilever corto (exacto 0.3553)
  itwCook,                // ITW III — membrana de Cook (referencia 23.91 en C)
  itwHemisferio,          // ITW IV  — hemisferio pinzado 18 grados (referencia 0.094)
  // 📐 NewBlank — lienzo en blanco al inicio (más visible)
  newBlank,
  // Importador CSI (F2K/E2K/S2K) — al inicio para acceso rápido
  csiImporter,
  // CLI Modeler — modelar con comandos tipo SAP (sin importar ningun archivo)
  cliModeler,
  // CAD Drawer — dibujar con mouse + Tweakpane (sincronizado con CLI)
  cadDraw,
  // Cimentaciones (zapataAisladaValidacion va en sección Benchmarks Combinados)
  zapataAislada,
  zapataVigaAmarre,
  vigaMedioElastico,
  // SAFE Benchmarks (cross-validation Hekatan vs SAFE 20)
  safeBenchLosa,
  safeBenchViga,
  safeBenchCombinada,
  safeBenchConectada,
  safeBenchComparativa,
  // Libro Guerra MDI — categoría "📚 Libros · SAFE - Marcelo Guerra"
  guerraEj1ZapataCuadrada,
  guerraEj2ZapataRectangular,
  guerraEj3ZapataRectangularEccGrande,
  guerraEj4ZapataCombinada,
  guerraEj5ZapataTrapezoidal,
  guerraEj6ZapataUnida,
  benchmarkSafeEx01Plate,
  benchmarkSafeEx04PlateBeams,
  guerraEj7VigaCimentacion,
  guerraEj8LosaCimentacion,
  vigaCimGuerraEj7,
  vigaCimGuerraEj7Tinv,
  // 🎯 Benchmarks por DOFs — agrupados por número de grados de libertad efectivos
  // 1 DOF — Vigas axial puro (carga puntual sin peso propio)
  barraAxial,                       // Barra axial horizontal genérica
  vigaAxialConcreteCantilever,      // Viga Hormigón 30×30 axial puntual
  vigaAxialCantilever,              // Viga Acero I-450 axial puntual
  vigaAxialCompositeCantilever,        // Viga Compuesta Slab (IPE+losa colaborante) transformed-section
  vigaAxialCompositeEncasedCantilever, // Viga Compuesta SRC Encased (bloque hormigón + IPE embed)
  // 2 DOF — Vigas flexión (peso propio + cargas verticales)
  vigaFlexionConcreteCantilever,        // Viga Hormigón 30×60 peso propio
  vigaFlexionSteelCantilever,           // Viga Acero IPE 300 peso propio
  vigaFlexionCompositeSlabCantilever,   // Viga Compuesta Slab (IPE+losa colaborante) peso propio
  vigaFlexionCompositeEncasedCantilever,// Viga Compuesta SRC Encased (bloque hormigón + IPE) peso propio
  // 🧱 Construcción — cerramientos / pórticos planos de uso cotidiano
  cerramiento,
  // Frames 1D (resto)
  trussGen,
  portico2D,
  tower3D,
  galpon,
  galponBodega,
  // Columnas (diseño individual)
  columnaCft,
  // Conexiones (prequalificación sísmica)
  conexionRbs,           // AISC 358 §5 — Reduced Beam Section
  conexionBfp,           // AISC 358 §7 — Bolted Flange Plate
  conexionEndPlate,      // AISC 358 §6 — End Plate 4E/4ES/8ES
  placaBase,
  // Edificios — variantes limpias por tipo estructural
  edificioAporticado,
  edificioLadera,
  edificioComparativaFem,  // 🧪 Comparativa cruzada Hekatan vs OpenSees / CalculiX / Code Aster
  edificioHormigon,
  edificioAceroV2,
  edificioMixto,
  edificioMuros,
  edificioDual,
  // Legacy (se mantienen por compatibilidad con URLs existentes)
  edificioConLosa,
  edificioConMuros,
  edifAcero,
  mezanine,
  // Placas (no-benchmark: triangularPlate, membranaCSI, plane)
  triangularPlate,
  membranaCSI,
  plane,

  // ════════════════════════════════════════════════════════════════════
  // 🏁 BENCHMARKS — Validación cruzada Hekatan vs ETABS / OpenSees / analítico
  // Orden visual en el dropdown (categoría "🏁 Benchmarks"):
  //   1) FRAMES (1D)         — vigas, columnas, frame3D
  //   2) ÁREAS (Shell 2D)    — placas, membranas, cáscaras
  //   3) SÓLIDOS (3D)        — H8 cube
  //   4) COMBINADOS          — Area + Spring + Frame (zapatas, bulbo, edificios)
  //   5) LAYERED             — layered shells (CLT, sandwich, ABBD)
  // ════════════════════════════════════════════════════════════════════

  // ── 1) FRAMES (1D) ──────────────────────────────────────────────
  benchmarkSteelCantilever,    // Frame · Columna ACERO Cantilever (HSS hueco)
  benchmarkConcreteCantilever, // Frame · Columna HORMIGÓN Cantilever (rectangular)
  benchmarkCftCantilever,      // Frame · Columna CFT Cantilever (HSS + concrete fill)
  legacyBeams,                 // Paz 6.3 Space Frame (validación 4 solvers)
  // ── 6) Benchmarks Paz (Mario Paz "Structural Dynamics" 6ª ed) ──
  // 1-DOF / time history canónicos
  benchmarkPaz4_1,             // 1-DOF rectangular impulse
  benchmarkPaz6_1,             // Newmark-β canonical (trapezoidal load)
  // Shear buildings (frame + DIAPHRAGM RIGID, sin shells)
  benchmarkPaz7_1,             // 2-story shear building (modal + TH)
  benchmarkPaz8_1,             // 2-DOF triangular impulse (mismo modelo 7.1)
  benchmarkPaz9_3,             // 4-story uniform shear building (modal)
  // Vigas y frames con datos completos
  benchmarkPaz10_7,            // Fixed-fixed beam (4 elementos + TH)
  benchmarkPaz11_1,            // Plane frame inclinado 45°
  benchmarkPaz12_1,            // Grid frame 3D (parrilla horizontal)
  benchmarkPaz13_1,            // Space frame 3D (5 nodos, 4 vigas radiando)

  // ── 2) ÁREAS (Shell 2D) — orden canónico de los 6 benchmarks ──
  plateThin,               // 1) Plate Thin (Kirchhoff)
  plateThick,              // 2) Plate Thick (Mindlin-Reissner)
  membrana,                // 3) Membrana (Plane Stress)
  shellThin,               // 4) Shell Thin (Kirchhoff-Love)
  shellThick,              // 5) Shell Thick (MITC4)
  layeredShell,            // 6) Layered (CLT/Sandwich/ABBD multi-capa)
  plateWithBeams,          // 7) Placa + vigas perimetrales (vs SAP benchmark)
  slabBeamsColumns,        // 8) Slab + vigas perimetrales + columnas (edificio 1 piso)

  // ── 3) SÓLIDOS (3D) ─────────────────────────────────────────────
  solidCubeFEM,            // Cubo Sólido H8 (validación CalculiX)

  // ── 4) COMBINADOS — Area + Spring + Frame ─────────────────────
  zapataAisladaValidacion, // Zapata aislada (Area + Winkler springs + Frame)
  bulboPresionesSuelo,     // Bulbo de Presiones — Serquen SF-70
  muroContencionSolido,    // Muro de contencion en solidos H8 — vs SAP2000 (2-sep-2026)
  benchmark3way,           // Shell+Frame DOF mismatch (Area + Frame)
  benchmarkCft,            // CFT cols + I-beams + losa (Area + Frame composite)
  mesaTorsion,             // 🌀 Mesa de torsión (validación ETABS — Gabriela/Seproinca 2020)
  // Un encargo REAL anonimizado (786 nudos, 746 barras, 76 areas, 15
  // materiales, 90 secciones, con CFT, conformado en frio y MADERA), leido de
  // su `.e2k` con el MISMO `parseE2k` del boton «Importar E2K»: si el lector se
  // rompe, este ejemplo deja de salir.
  //
  // Entra ENTERO y se ve; el analisis NO cierra, y esta declarado como tal en
  // `SOLO_IMPORTACION` de `salud_ejemplos` con su motivo medido (116 trozos que
  // no llegan a ningun apoyo). El panel lo dice tambien, para que nadie lo
  // confunda con un ejemplo roto.
  // Muro cortante con huecos grandes por el modelo de LARGUEROS: barras que
  // solo trabajan a axil (donde ira la varilla) y paneles que solo llevan
  // cortante. Las dos condiciones salen de lo que ya hay —releases de momento
  // y modificadores de cascara F11=F22=0, F12=1—, sin elementos nuevos.
  muroLargueros,
  estructuraMixta,
  // Falta: coser el modelo (releases, muelles de pilote, links) y que el
  // exportador reparta bien deck y losa por grupo.

  // ── Legacy upstream awatif (resto que no son benchmarks) ────
  ...legacyAwatifExamples.filter(e =>
    e.id !== "beams" && e.id !== "solid-cube-fem" && e.id !== "bulbo-presiones-suelo" && e.id !== "muro-contencion-solido"
  ),
];
