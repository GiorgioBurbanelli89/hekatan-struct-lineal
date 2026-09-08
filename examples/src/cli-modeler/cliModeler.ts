/**
 * CLI Modeler — modelar estructuras con comandos tipo SAP/ETABS.
 *
 * Permite construir un modelo 3D desde cero escribiendo comandos en una
 * textarea (ver workspace/main.ts donde se agrega el folder de comandos).
 *
 * SINTAXIS DE COMANDOS:
 *   node ID X Y Z              (nodo en coordenada X, Y, Z)
 *   frame ID nI nJ E A I       (frame entre nodos nI y nJ)
 *   frame ID nI nJ E A Iz Iy J nu rho    (forma larga, tokens opcionales)
 *       El ORDEN de los tokens NO cambia: el 6º sigue siendo la inercia de la
 *       flexión HORIZONTAL de una viga y el 7º la de la VERTICAL (el canto va
 *       en el 7º). Los .heks ya escritos se leen igual.
 *       En nomenclatura CSI, que es la que usan ahora los ejes locales:
 *       el 6º es I22 (flexión en el plano 1-3: V3 y M2) y el 7º es I33
 *       (plano 1-2: V2 y M3). Antes iban al revés en el motor, no aquí.
 *       Sin los tokens extra: Iy=Iz, J=0.14·(√A)⁴, nu=0.2, rho=2.45 (hormigón).
 *   shell ID n1 n2 n3 n4 t E   (shell Q4 con 4 nodos y espesor t)
 *   shell ID n1 n2 n3 n4 t E q rho   (forma larga, tokens opcionales)
 *       q   = carga de superficie del propio shell, kN/m2 (+z). 0 = ninguna.
 *       rho = densidad, t/m3. Sin el token: 2.45 (hormigón macizo).
 *       Para dar rho sin carga hay que escribir q = 0: los tokens son
 *       posicionales. Un DECK metálico colaborante NO es losa maciza — su
 *       hormigón son la loseta más los nervios, así que pesa menos a igual
 *       canto y se declara con la densidad homogeneizada.
 *   support nodeID DOFs        (DOFs = "fixed" o "pinned" o "uxuyuz")
 *   load nodeID FX FY FZ MX MY MZ
 *   frameload frameID WX WY WZ (carga repartida sobre la barra, kN/m, globales)
 *       Es el `SetLoadDistributed` de ETABS. Se convierte a las fuerzas Y
 *       MOMENTOS de empotramiento de la barra, que es exacto para los
 *       desplazamientos y las reacciones. Usarlo en vez de repartir a mano por
 *       ancho tributario: el tributario ignora que la viga es CONTINUA sobre
 *       sus apoyos y se equivoca al lado de un vano ancho.
 *   shelltype shellID thin|thick  (ShellType de ETABS: Kirchhoff o Mindlin)
 *   deck etabs [oneway]        (los panos MEMBRANA como los pisos de ETABS: se parten en los
 *                               nudos de sus bordes y su peso/areaload va a las barras de
 *                               borde por area tributaria — bidireccional, o en UN sentido
 *                               con `oneway` (eje local 1 = borde 0->1 girado `shellang`,
 *                               el ONEWAYLOADDIST de ETABS); sin esto = SAP2000)
 *   spring nodeID dof k        (Winkler nodal, dof: ux/uy/uz/rx/ry/rz)
 *   release frameID <12 bits>  (end releases, orden ETABS: U1 U2 U3 R1 R2 R3
 *                               en el nudo I y los mismos seis en el J)
 *   release frameID pin fix    (forma corta: articula un extremo, M2 y M3)
 *   solve                      (corre el FEM)
 *   reset                      (limpia todo)
 *
 * EJEMPLO mínimo (cantilever 5m con carga al extremo):
 *   node 1 0 0 0
 *   node 2 5 0 0
 *   support 1 fixed
 *   frame 1 1 2 25e6 0.04 0.001
 *   load 2 0 0 -100
 *   solve
 */
import * as THREE from "three";
import { cftSectionEc, cftPipeSectionEc } from "../shared/cadSections";
import { hex8Solve, hex8Stress } from "../solid-cube-fem/h8";
import { deform, analyze, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

interface ParsedModel {
  nodes: Map<number, [number, number, number]>;
  frames: Array<{
    id: number; nI: number; nJ: number; E: number; A: number; I: number;
    /** opcionales: sección asimétrica y material distinto al hormigón por defecto */
    Iy?: number; J?: number; nu?: number; rho?: number;
    /** canto y ancho reales; solo para exportar (brazos de ETABS), no para calcular */
    D?: number; B?: number;
    /** nombre de la seccion, del comentario `# VA-250`. Solo para exportar. */
    sec?: string;
  }>;
  shells: Array<{ id: number; pts: number[]; t: number; E: number; rho?: number }>;
  /** Carga de SUPERFICIE por shell, en kN/m2 (+z arriba). Ver areaload. */
  shellLoads: Map<number, number>;
  /** Modificadores de rigidez por shell: [membrana, flexion]. Default 1,1.
   *  Es el «Assign -> Area -> Stiffness Modifiers» de ETABS. Un DECK aporta
   *  poca flexion: con bending 0 trabaja como membrana y entrega la carga a
   *  las secundarias, en vez de rigidizar como losa maciza en dos sentidos. */
  /** Formulacion de placa por cascara: 0 = Mindlin (Shell-Thick, con cortante),
   *  1 = Kirchhoff (Shell-Thin). Es el ShellType de ETABS. Sin declararlo,
   *  Hekatan usa su defecto (Mindlin). */
  shellTypes: Map<number, number>;
  shellMods: Map<number, [number, number]>;
  /** Modificadores DIRECCIONALES por shell, 8 valores en el orden del e2k
   *  de ETABS: F11 F22 F12 M11 M22 M12 V13 V23. Es lo que define un DECK:
   *  rigido en el sentido del nervio y blando cruzado. */
  shellModsDir: Map<number, number[]>;
  /** Angulo del eje local 1 del shell, en grados. En Hekatan no cambia el
   *  calculo (la unidireccionalidad sale del reparto en la malla, no de un
   *  modificador: `shellmod 1 1 1 0 0 0 1 1` es isotropo en membrana), pero
   *  ETABS lo NECESITA — es lo que decide a que vigas les entrega la carga un
   *  deck. Sin declararlo, el e2k exportado sale con ANG 0 y en ETABS el deck
   *  salva al reves. */
  shellAngles: Map<number, number>;
  /** angulo local de cada barra, en grados (comando `ang`) */
  frameAngles: Map<number, number>;
  /** areas de CORTANTE de cada barra: [As2, As3] en m2 (comando `as`).
   *  Sin ellas Hekatan supone 5/6*A, que para un perfil abierto es el doble o
   *  mas de lo real — en una VA-250 el alma son 1170 mm2 y 5/6*A son 2442. Los
   *  programas CSI usan el area real, asi que Hekatan salia sistematicamente
   *  MAS RIGIDO, hasta un 14 % nudo a nudo en el galpon. */
  frameShearAreas: Map<number, [number, number]>;
  /** `cft ID b h t Ec [nuC]`: tubo de acero relleno de hormigon. Pisa A, I22, I33,
   *  J y las areas de cortante con lo que usan SAP2000 (Section Designer) y ETABS
   *  (Filled Steel Tube), y marca la forma para que el s2k salga como SD. */
  frameCft: Map<number, { b: number; h: number; t: number; Ec: number; nuC: number }>;
  /** `cftc ID D t Ec [nuC]`: tubo REDONDO relleno (Filled Steel Pipe de ETABS; Pipe + Solid Circle en el SD de SAP2000) */
  frameCftc: Map<number, { D: number; t: number; Ec: number; nuC: number }>;
  frameEndOffsets: Map<number, [number, number, number]>;   // [offI, offJ, rigidZone]
  selfWeight: number;                    // multiplicador de peso propio (`selfweight`)
  etabsWallJoint: boolean;               // `etabsjoint 1`: la union viga-muro de ETABS
  /** `meshcross 0/1`: partir con un nudo las barras que se CRUZAN sin compartirlo (las X de
   *  arriostramiento). ETABS lo hace por defecto (MESHATINTERSECTIONS "YES"); SAP2000 no.
   *  Por defecto como ETABS (decision de Jorge, 3-sep-2026). */
  meshCross: boolean;
  /** `deck etabs`: los panos MEMBRANA (shellmod m11=m22=m12=0) se tratan como los pisos
   *  membrana/deck de ETABS: (1) se PARTEN en los nudos que caen sobre dos bordes opuestos
   *  (correas/viguetas partidas en los porticos, vigas que cruzan el pano) — es el cookie-cut
   *  y el edge constraint de ETABS; (2) su peso propio y su `areaload` van a las BARRAS DE
   *  BORDE por area tributaria (bisectrices a 45 grados) como vector nodal consistente de
   *  Hermite, no a las 4 esquinas. SAP2000 no hace ninguna de las dos cosas (4-sep-2026:
   *  galpon 4.5 % y mezanine Dead 75 % explicados con esto). */
  deckEtabs: boolean;
  deckOneWay: boolean;                   // `deck etabs oneway`: reparto en un sentido (eje local 1 del pano)
  /** `automesh <tam_m>` (0 = apagado): parte los panos Q4 mas grandes que `tam` en una rejilla,
   *  como el AUTOMESHOPTIONS de ETABS (FLOORMESHMAXSIZE / WALLMESHMAXSIZE, 1.25 m de fabrica).
   *  Hekatan resuelve la malla que se le da: si un `.e2k` de ETABS trae la losa como UN pano,
   *  ETABS la parte y Hekatan no, y no son el mismo modelo. Con la directiva si lo son. */
  autoMesh: number;
  /** `torsion safe` (= 0.1) o `torsion <factor>`: multiplica la J de TODAS las barras. SAFE 20
   *  analiza las vigas con 0.1·J (medido el 5-sep-2026: Hekatan con J×0.1 = giros de SAFE a
   *  4 cifras). Con la directiva, Hekatan reproduce a SAFE; sin ella = SAP2000/ETABS. */
  torsionFactor: number;
  deckTributario: Set<number>;           // ids de shell cuya carga ya fue a las barras de borde
  /** `areaspring <shellID> <ks> [nodal]`: muelle de AREA (Winkler, kN/m3) sobre la cascara.
   *  Por defecto CONSISTENTE, ks·∫NᵀN dA sobre la normal (el de SAFE); con `nodal` se reparte a
   *  los nudos por ∫N_i dA (lo que hacen SAP2000 y ETABS, = `spring` a mano). Viaja al WASM por la
   *  lista de muelles con nudo NEGATIVO (utils/springsExtra.h). */
  areaSprings: Array<{ id: number; ks: number; nodal: boolean }>;
  /** `edge etabs`: nudos COLGADOS sobre la arista de una cascara (malla no conforme) atados a
   *  la arista como el edge constraint de ETABS con OBJMESHTYPE "NONE": w = Hermite cubica con
   *  los giros de los extremos, in-plano y giros lineales (medido 8-sep-2026, 0.11 %). Sin la
   *  directiva un nudo colgado queda suelto, como en SAP2000. */
  edgeEtabs: boolean;
  /** `hex ID n1..n8 [E nu rho]`: hexaedros H8 (solidos). Se resuelven con hex8Solve
   *  (Wilson–Taylor por defecto; `incompatible 0` lo quita). */
  solids: Array<{ id: number; pts: number[]; E: number; nu: number; rho: number }>;
  solidIncompatible: boolean;
  /** End releases por barra: 12 banderas [U1 U2 U3 R1 R2 R3]_I + _J, el orden
   *  de ETABS. Una bandera en true libera ese grado LOCAL por condensacion
   *  estatica. Ver el comando `release`. */
  frameReleases: Map<number, boolean[]>;
  /** Objetos de area: el area COMO LA DIBUJO el usuario, antes de mallarla.
   *  Hekatan resuelve con las celdas (`shells`), pero ETABS guarda UN objeto y
   *  lo malla por dentro. Sin esto el e2k exportado saca 90 areas donde ETABS
   *  saca 1: analiza igual, pero el modelo ya no es el mismo, y reimportarlo
   *  deja la malla congelada. `cells` son los IDs de shell que lo implementan. */
  areaObjs: Array<{ id: number; pts: number[]; cells: number[] }>;
  supports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
  loads: Map<number, [number, number, number, number, number, number]>;
  /** Carga uniformemente repartida sobre una BARRA, kN/m, en ejes GLOBALES.
   *  Es el `SetLoadDistributed` de ETABS. Hasta ahora solo habia carga nodal,
   *  asi que quien generaba el modelo tenia que repartir la carga a mano por
   *  ancho tributario — y eso IGNORA que la viga es continua sobre sus apoyos:
   *  medido contra ETABS, un tributario simple manda 16 % menos carga al apoyo
   *  interior del vano ancho y 23 % mas al extremo. */
  frameLoads: Map<number, [number, number, number]>;
  springs: Array<{ node: number; dof: number; k: number }>;
  /** Masa concentrada en un nudo, en toneladas — la que NO sale del peso propio.
   *  En ETABS la fuente de masa son dos interruptores: `INCLUDEELEMENTS`
   *  (rho*A*L) e `INCLUDELOADS` (patrones de carga entre g). El CIMENTAC del GAD
   *  RIOCHICO tiene el primero en "No": alli la masa son las CARGAS, no el peso
   *  propio, y sin poder darla a mano no hay forma de reproducir su modal. */
  masses: Map<number, number>;
  // Diafragma rigido por nudo: id del diafragma al que pertenece (0 = ninguno).
  // Ata Ux, Uy y Rz de todos los nudos con el mismo id, como ETABS.
  diaphragms: Map<number, number>;
  doSolve: boolean;
  errors: string[];
}

const DOF_NAMES: Record<string, number> = {
  ux: 0, uy: 1, uz: 2, rx: 3, ry: 4, rz: 5,
  fx: 0, fy: 1, fz: 2, mx: 3, my: 4, mz: 5,
};

function parseSupportSpec(spec: string): [boolean, boolean, boolean, boolean, boolean, boolean] {
  const s = spec.toLowerCase().trim();
  if (s === "fixed" || s === "empotrado") return [true, true, true, true, true, true];
  if (s === "pinned" || s === "articulado") return [true, true, true, false, false, false];
  if (s === "roller" || s === "rodillo") return [false, false, true, false, false, false];
  // DOFs explícitos: "uxuyuz" o "ux,uy,uz" o "111000" o "1 1 1 0 0 0"
  const out: [boolean, boolean, boolean, boolean, boolean, boolean] = [false,false,false,false,false,false];
  const tokens = s.split(/[\s,]+/).filter(Boolean);

  // UN BIT POR GDL, separados: "1 1 1 0 0 0" o "1,1,1,0,0,0". Es lo que escribe
  // el importador de ETABS (`edb_a_heks.py`, que copia el Restraint de la OAPI)
  // y lo que NO se entendia: el patron compacto se probaba con /^[01]+$/ sobre
  // la cadena ENTERA, asi que cualquier separador lo tumbaba y el apoyo salia
  // LIBRE en los seis grados, sin un solo aviso.
  //
  // Lo que costo: el CIMENTAC del GAD RIOCHICO tiene 29 apoyos escritos asi.
  // Ninguno llegaba al solver, y el modal daba tres modos de frecuencia ~0 con
  // participacion UX 0.99 / UY 0.99 / RZ 0.79 — el edificio entero trasladando
  // y girando como un solido libre, porque no habia nada que lo sujetara. El
  // estatico tampoco chistaba: los 612 resortes de balasto le daban rigidez
  // vertical suficiente para "resolver" y devolver numeros sin sentido.
  if (tokens.length > 1 && tokens.length <= 6 &&
      tokens.every((t) => t === "0" || t === "1")) {
    tokens.forEach((t, i) => { out[i] = t === "1"; });
    return out;
  }
  for (const t of tokens) {
    if (DOF_NAMES[t] !== undefined) out[DOF_NAMES[t]] = true;
  }
  // patron compacto "111000"
  if (/^[01]+$/.test(s) && s.length <= 6) {
    for (let i = 0; i < s.length; i++) out[i] = s[i] === "1";
  }
  return out;
}

export function parseCliCommands(text: string): ParsedModel {
  const m: ParsedModel = {
    nodes: new Map(),
    frames: [],
    shells: [],
    shellLoads: new Map(),
    shellTypes: new Map(),
    shellMods: new Map(),
    shellModsDir: new Map(),
    shellAngles: new Map(),
    frameAngles: new Map(),
    frameShearAreas: new Map(),
    frameCft: new Map(),
    frameCftc: new Map(),
    frameEndOffsets: new Map(),
    selfWeight: 0,
    meshCross: true,
    deckEtabs: false,
    deckOneWay: false,
    torsionFactor: 1,
    deckTributario: new Set(),
    autoMesh: 0,
    areaSprings: [],
    edgeEtabs: false,
    solids: [],
    solidIncompatible: true,
    etabsWallJoint: true,     // por DEFECTO como ETABS (decision de Jorge, 3-sep-2026); `etabsjoint 0` = modo SAP2000
    frameReleases: new Map(),
    areaObjs: [],
    supports: new Map(),
    loads: new Map(),
    frameLoads: new Map(),
    springs: [],
    masses: new Map(),
    diaphragms: new Map(),
    doSolve: false,
    errors: [],
  };
  // Modo BLOQUE estilo awatif (nodes ENCABEZADO, luego solo coords):
  //   nodes
  //   0 0 0
  //   5 0 0
  //   elements         (frames)
  //   0 1
  //   1 2
  //   areas            (shells Q4)
  //   0 1 2 3
  // Mantiene compatibilidad con la sintaxis explicita por linea:
  //   node 1 0 0 0
  //   frame 1 1 2 25e6 0.16 0.001
  let blockMode: "nodes" | "elements" | "areas" | "supports" | "loads" | "springs" | null = null;
  let autoNodeIdx = 0;  // 0-based para modo bloque (awatif compatible)
  let autoFrameIdx = 0;
  let autoShellIdx = 0;

  const lines = text.split(/\r?\n/);
  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    let raw = lines[lineNo].trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("//")) continue;
    raw = raw.replace(/[;]+$/, "");
    const tokens = raw.split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    // Detectar headers de bloque
    if (cmd === "nodes" && tokens.length === 1) { blockMode = "nodes"; continue; }
    if ((cmd === "elements" || cmd === "frames") && tokens.length === 1) { blockMode = "elements"; continue; }
    if (cmd === "areas" && tokens.length === 1) { blockMode = "areas"; continue; }
    if (cmd === "supports" && tokens.length === 1) { blockMode = "supports"; continue; }
    if (cmd === "loads" && tokens.length === 1) { blockMode = "loads"; continue; }
    if (cmd === "springs" && tokens.length === 1) { blockMode = "springs"; continue; }
    // Modo bloque: linea = solo numeros (coords o índices)
    if (blockMode && /^[\-\d]/.test(tokens[0])) {
      const nums = tokens.map(parseFloat);
      if (blockMode === "nodes" && nums.length >= 3) {
        autoNodeIdx++;
        m.nodes.set(autoNodeIdx, [nums[0], nums[1], nums[2]]);
        continue;
      }
      if (blockMode === "elements" && nums.length >= 2) {
        // En modo awatif los índices son 0-based; los convertimos a IDs 1-based
        autoFrameIdx++;
        m.frames.push({
          id: autoFrameIdx, nI: nums[0]+1, nJ: nums[1]+1,
          E: 25e6, A: 0.16, I: 0.0021,
        });
        continue;
      }
      if (blockMode === "areas" && nums.length >= 4) {
        autoShellIdx++;
        m.shells.push({
          id: autoShellIdx,
          pts: [nums[0]+1, nums[1]+1, nums[2]+1, nums[3]+1],
          t: 0.20, E: 25e6,
        });
        continue;
      }
      if (blockMode === "loads" && nums.length >= 4) {
        // Sintaxis: nodeId FX FY FZ [MX MY MZ]
        m.loads.set(nums[0], [
          nums[1] ?? 0, nums[2] ?? 0, nums[3] ?? 0,
          nums[4] ?? 0, nums[5] ?? 0, nums[6] ?? 0,
        ]);
        continue;
      }
      if (blockMode === "springs" && nums.length >= 3) {
        // Sintaxis: nodeId dof_idx k (dof_idx 0=ux .. 5=rz, default 2=uz)
        m.springs.push({ node: nums[0], dof: nums[1], k: nums[2] });
        continue;
      }
    }
    // Bloque "supports" — sintaxis: "nodeId DOFs" (ej. "1 fixed")
    if (blockMode === "supports" && /^\d/.test(tokens[0])) {
      const nodeId = parseInt(tokens[0], 10);
      const spec = tokens.slice(1).join(" ");
      m.supports.set(nodeId, parseSupportSpec(spec));
      continue;
    }
    // Si la linea no encaja con bloque, salimos del modo bloque y la procesamos
    // como comando explicito (compatibilidad atras).
    if (blockMode && !/^[\-\d]/.test(tokens[0])) blockMode = null;
    try {
      switch (cmd) {
        case "node":
        case "n": {
          const id = parseInt(tokens[1], 10);
          const x = parseFloat(tokens[2]);
          const y = parseFloat(tokens[3]);
          const z = parseFloat(tokens[4]);
          if (!isFinite(id) || !isFinite(x) || !isFinite(y) || !isFinite(z)) {
            m.errors.push(`L${lineNo+1}: node mal formado: ${raw}`);
          } else m.nodes.set(id, [x, y, z]);
          break;
        }
        case "frame":
        case "beam":
        case "column":
        case "f": {
          const id = parseInt(tokens[1], 10);
          const nI = parseInt(tokens[2], 10);
          const nJ = parseInt(tokens[3], 10);
          const E = parseFloat(tokens[4] ?? "25e6");
          const A = parseFloat(tokens[5] ?? "0.16");
          const I = parseFloat(tokens[6] ?? "0.001");
          // Tokens opcionales: una sola I solo sirve para secciones simétricas.
          // Un perfil de acero (2L en cajón: Ix/Iy = 15×) necesita las dos, y
          // el acero no tiene ν=0.2 ni ρ=2.45. Si no vienen, se comporta como
          // antes — los .heks viejos siguen leyéndose igual.
          const Iy = tokens[7] !== undefined ? parseFloat(tokens[7]) : undefined;
          const J = tokens[8] !== undefined ? parseFloat(tokens[8]) : undefined;
          const nu = tokens[9] !== undefined ? parseFloat(tokens[9]) : undefined;
          const rho = tokens[10] !== undefined ? parseFloat(tokens[10]) : undefined;
          // Canto y ancho REALES de la seccion. No entran al calculo — Hekatan
          // resuelve con A, I y J — pero ETABS saca de ahi los BRAZOS de los
          // extremos (el tramo que queda dentro del nudo). Sin declararlos hay
          // que deducir un rectangulo equivalente de A e I, y para un perfil I
          // eso da otro canto: la VA-250 salia con 0.357 m en vez de 0.250, y
          // ETABS le ponia un brazo de 0.357. No cambia la rigidez (el factor
          // de zona rigida es 0 por defecto, medido) pero si donde se reportan
          // momentos y cortantes, o sea el diseno.
          const D = tokens[11] !== undefined ? parseFloat(tokens[11]) : undefined;
          const B = tokens[12] !== undefined ? parseFloat(tokens[12]) : undefined;
          // NOMBRE de la seccion, del comentario de la linea: `... # VA-250`.
          // No entra al calculo, pero sin el, el exportador de e2k no tiene con
          // que nombrar las secciones y las saca como S_G1..S_G7 — un modelo
          // reimportado en ETABS con secciones anonimas, imposible de casar
          // contra el original. El tokenizador no descarta el comentario
          // inline (solo salta las lineas que EMPIEZAN por #), asi que esta ahi.
          const iCom = tokens.indexOf("#");
          const sec = iCom >= 0 && tokens[iCom + 1] ? tokens[iCom + 1] : undefined;
          m.frames.push({ id, nI, nJ, E, A, I, Iy, J, nu, rho, D, B, sec });
          break;
        }
        // ── ANGULO LOCAL de una barra: `ang <frameID> <grados>` ──
        // Es el "local axis angle" de CSI: gira la seccion alrededor del eje de
        // la barra. Hace falta para las cerchas de cordon en C — con angulo 0 la
        // hendidura de la C mira fuera del plano de la cercha y el alma no
        // sujeta las diagonales 2L. Sin este comando no habia forma de decirlo
        // en un .heks y el e2k exportado salia con ANG 0 en todas las barras,
        // mientras el de ETABS llevaba 294 con ANG 90.
        // ── AREAS DE CORTANTE de una barra: `as <frameID> <As2> <As3>` ──
        // As2 resiste V2 (plano 1-2, el de I33) y As3 resiste V3 (plano 1-3,
        // el de I22), como en CSI. En m2. Un valor negativo = Bernoulli puro.
        case "cftc": {
          // cftc <frameID> <D> <t> <Ec> [nuC]   (m, kN/m2) — tubo redondo relleno
          const fid = parseInt(tokens[1], 10);
          const D = parseFloat(tokens[2] ?? ""), t = parseFloat(tokens[3] ?? "");
          const Ec = parseFloat(tokens[4] ?? "25e6"), nuC = parseFloat(tokens[5] ?? "0.2");
          if (isFinite(fid) && D > 0 && t > 0 && t < D / 2 && Ec > 0)
            m.frameCftc.set(fid, { D, t, Ec, nuC: isFinite(nuC) ? nuC : 0.2 });
          else m.errors.push(`cftc ${tokens[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
          break;
        }
        case "cft": {
          // cft <frameID> <b> <h> <t> <Ec> [nuC]   (m, kN/m2)
          const fid = parseInt(tokens[1], 10);
          const b = parseFloat(tokens[2] ?? ""), h = parseFloat(tokens[3] ?? ""), t = parseFloat(tokens[4] ?? "");
          const Ec = parseFloat(tokens[5] ?? "25e6"), nuC = parseFloat(tokens[6] ?? "0.2");
          if (isFinite(fid) && b > 0 && h > 0 && t > 0 && t < Math.min(b, h) / 2 && Ec > 0)
            m.frameCft.set(fid, { b, h, t, Ec, nuC: isFinite(nuC) ? nuC : 0.2 });
          else m.errors.push(`cft ${tokens[1]}: hace falta b h t (m) y Ec (kN/m2), con t < min(b,h)/2`);
          break;
        }
        case "as":
        case "shearareas": {
          const fid = parseInt(tokens[1], 10);
          const a2 = parseFloat(tokens[2] ?? "0");
          const a3 = parseFloat(tokens[3] ?? "0");
          if (isFinite(fid) && isFinite(a2) && isFinite(a3))
            m.frameShearAreas.set(fid, [a2, a3]);
          break;
        }
        // ── END RELEASES: `release <frameID> <12 banderas>` ──
        // El orden es el de ETABS: U1 U2 U3 R1 R2 R3 en el nudo I y los mismos
        // seis en el nudo J. Se admite tambien la palabra `pin` en un extremo,
        // que es lo de siempre: libera los tres momentos de ese lado.
        //
        //   release 17 0 0 0 0 1 1 0 0 0 0 1 1     (biarticulada)
        //   release 17 pin pin                      (lo mismo, corto)
        //   release 17 pin fix                      (rotula solo en I)
        case "release":
        case "rel": {
          const fid = parseInt(tokens[1], 10);
          const resto = tokens.slice(2).map((t) => t.toLowerCase());
          if (!isFinite(fid) || resto.length === 0) {
            m.errors.push(`release: se esperaba "release frameID <12 bits> | pin fix"`);
            break;
          }
          const v = new Array<boolean>(12).fill(false);
          if (resto.length === 2 && resto.every((t) => /^(pin|fix|libre|rigido)$/.test(t))) {
            // extremo articulado = los TRES momentos sueltos (R1,R2,R3 no: la
            // torsion se deja tomada, como hace ETABS con "Moment 22/33")
            resto.forEach((t, lado) => {
              if (t === "pin" || t === "libre") {
                v[lado * 6 + 4] = true;   // M2
                v[lado * 6 + 5] = true;   // M3
              }
            });
          } else {
            const bits = resto.filter((t) => t === "0" || t === "1");
            if (bits.length !== 12) {
              m.errors.push(`release ${fid}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${bits.length}`);
              break;
            }
            for (let i = 0; i < 12; i++) v[i] = bits[i] === "1";
          }
          if (v.some(Boolean)) m.frameReleases.set(fid, v);
          break;
        }
        // ── PESO PROPIO: `selfweight [mult]` ──
        // El patron `Dead` de ETABS (selfweight x 1). Hekatan NUNCA lo aplicaba
        // en el estatico: habia que meterlo a mano en las cargas, y en el
        // galpon directamente no estaba (faltaban 385.5 kN de acero mas la
        // losa). Las VIGAS con `endoffset` pesan por su LUZ LIBRE, como ETABS.
        case "hex":
        case "solid":
        case "h8": {
          // hex <ID> <n1..n8> [E] [nu] [rho]   — orden del H8 de Hekatan (0-3 abajo antihorario, 4-7 arriba)
          const id = parseInt(tokens[1], 10);
          const pts = tokens.slice(2, 10).map(x => parseInt(x, 10));
          if (!isFinite(id) || pts.length !== 8 || pts.some(x => !isFinite(x))) { m.errors.push(`hex ${tokens[1]}: hacen falta 8 nudos`); break; }
          m.solids.push({ id, pts, E: parseFloat(tokens[10] ?? "25e6"), nu: parseFloat(tokens[11] ?? "0.2"), rho: parseFloat(tokens[12] ?? "2.45") });
          break;
        }
        case "incompatible": {
          const v = (tokens[1] ?? "1").toLowerCase();
          m.solidIncompatible = !(v === "0" || v === "no" || v === "off" || v === "false");
          break;
        }
        case "torsion":
        case "jmod": {
          const v = (tokens[1] ?? "safe").toLowerCase();
          const f = v === "safe" ? 0.1 : parseFloat(v);
          m.torsionFactor = isFinite(f) && f > 0 ? f : 1;
          break;
        }
        case "deck":
        case "deckmode": {
          const v = (tokens[1] ?? "etabs").toLowerCase();
          m.deckEtabs = v === "etabs" || v === "1" || v === "on" || v === "si";
          m.deckOneWay = tokens.slice(2).some(t => /^(oneway|1way|unidireccional)$/i.test(t));
          break;
        }
        // areaspring <shellID> <ks kN/m3> [nodal]
        // Los cuatro nombres valen, y en los DOS motores: hasta el 8-sep-2026 el TS solo entendia
        // `areaspring` y el Python solo `springarea`, asi que el MISMO .heks no se leia igual.
        case "areaspring":
        case "winkler":
        case "springarea":
        case "winklerarea": {
          const id = parseInt(tokens[1], 10);
          const ks = parseFloat(tokens[2] ?? "0");
          const nodal = tokens.slice(3).some(t => /^(nodal|lumped|sap|etabs)$/i.test(t));
          if (isFinite(id) && isFinite(ks) && ks !== 0) m.areaSprings.push({ id, ks, nodal });
          else m.errors.push(`areaspring: uso areaspring <shellID> <ks> [nodal]`);
          break;
        }
        // edge etabs | edge none : nudos colgados en aristas de cascara atados (Hermite) o sueltos
        case "edge":
        case "edgeconstraint": {
          const v = (tokens[1] ?? "etabs").toLowerCase();
          m.edgeEtabs = v === "etabs" || v === "1" || v === "on" || v === "si" || v === "hermite";
          break;
        }
        // automesh [tam_m | off]   — 1.25 m es el defecto de ETABS
        case "automesh":
        case "automallado": {
          const v = (tokens[1] ?? "1.25").toLowerCase();
          if (v === "off" || v === "no" || v === "0") { m.autoMesh = 0; break; }
          const f = parseFloat(v);
          m.autoMesh = isFinite(f) && f > 0 ? f : 1.25;
          break;
        }
        case "meshcross":
        case "meshatintersections": {
          const v = (tokens[1] ?? "1").toLowerCase();
          m.meshCross = !(v === "0" || v === "no" || v === "off" || v === "false");
          break;
        }
        case "etabsjoint":
        case "etabswalljoint": {
          // etabsjoint [0|1] -> la penalizacion viga-muro de ETABS (ver data-model.ts)
          const v = (tokens[1] ?? "1").toLowerCase();
          m.etabsWallJoint = !(v === "0" || v === "no" || v === "off" || v === "false");
          break;
        }
        case "selfweight":
        case "peso":
        case "sw": {
          const v = parseFloat(tokens[1] ?? "1");
          m.selfWeight = isFinite(v) ? v : 1;
          break;
        }
        // ── END LENGTH OFFSETS de CSI: `endoffset <frameID> <offI> <offJ> [rz]` ──
        // `rz` es el rigid-zone factor (0-1). ETABS lo trae en 0 por defecto, y
        // con 0 el brazo NO rigidiza: solo descuenta el peso propio de las
        // VIGAS (luz libre) y mueve la estacion de reporte de los esfuerzos.
        //
        //   endoffset 17 0.20 0.20        (brazos de 20 cm, flexibles)
        //   endoffset 17 0.20 0.20 1.0    (y rigidos de verdad)
        case "endoffset":
        case "offset":
        case "lengthoff": {
          const fid = parseInt(tokens[1], 10);
          const oI = parseFloat(tokens[2] ?? "0");
          const oJ = parseFloat(tokens[3] ?? "0");
          const rz = parseFloat(tokens[4] ?? "0");
          if (!isFinite(fid) || !isFinite(oI) || !isFinite(oJ)) {
            m.errors.push(`endoffset: se esperaba "endoffset frameID offI offJ [rz]"`);
            break;
          }
          m.frameEndOffsets.set(fid, [oI, oJ, isFinite(rz) ? rz : 0]);
          break;
        }
        case "ang":
        case "localaxis": {
          const fid = parseInt(tokens[1], 10);
          const g = parseFloat(tokens[2] ?? "0");
          if (isFinite(fid) && isFinite(g)) m.frameAngles.set(fid, g);
          break;
        }
        case "shell":
        case "plate":
        case "s": {
          const id = parseInt(tokens[1], 10);
          const pts = [
            parseInt(tokens[2], 10),
            parseInt(tokens[3], 10),
            parseInt(tokens[4], 10),
            parseInt(tokens[5], 10),
          ];
          const t = parseFloat(tokens[6] ?? "0.20");
          const E = parseFloat(tokens[7] ?? "25e6");
          // token opcional 9: densidad. Sin el, hormigon macizo (2.45 t/m3).
          // Hace falta para el DECK colaborante, que a igual canto pesa menos
          // que una losa maciza porque su hormigon son loseta + nervios.
          const rhoTok = tokens[9] !== undefined ? parseFloat(tokens[9]) : undefined;
          const rho = rhoTok !== undefined && isFinite(rhoTok) ? rhoTok : undefined;
          m.shells.push({ id, pts, t, E, rho });
          // token opcional 8: carga de superficie del propio shell
          if (tokens[8] !== undefined) {
            const q = parseFloat(tokens[8]);
            if (isFinite(q) && q !== 0) m.shellLoads.set(id, q);
          }
          break;
        }
        // ── carga de SUPERFICIE sobre un area: areaload shellID q ──
        // q en kN/m2, positivo hacia +z. Antes solo existia `load` nodal, asi
        // que una losa habia que repartirla a mano entre sus nudos: eso ignora
        // la forma del area, los huecos y a quien le toca cargar.
        // shellmod ID mem bend  — modificadores de rigidez del shell
        // ── FORMULACION DE PLACA: `shelltype <shellID> thin|thick` ──
        // Es el ShellType de ETABS. `thin` = Kirchhoff (Shell-Thin), que
        // desprecia la deformacion por cortante; `thick` = Mindlin
        // (Shell-Thick), que la incluye. Son dos TEORIAS distintas y dan
        // resultados distintos: sin poder declararlo, un modelo importado de
        // ETABS con losas Shell-Thin entraba por el defecto de Hekatan, Mindlin,
        // y la losa salia mas rigida — medido en el peldaño 2 de la escalera,
        // 4 % menos de flecha en los nudos de losa y +1.1 % en el modo 1.
        case "shelltype":
        case "plateform": {
          const id = parseInt(tokens[1], 10);
          const q = (tokens[2] ?? "").toLowerCase();
          if (!isFinite(id)) break;
          let v: number | undefined;
          if (q === "thin" || q === "delgada" || q === "kirchhoff" || q === "1") v = 1;
          else if (q === "thick" || q === "gruesa" || q === "mindlin" || q === "0") v = 0;
          if (v === undefined) {
            m.errors.push(`shelltype ${id}: se esperaba thin o thick`);
            break;
          }
          m.shellTypes.set(id, v);
          break;
        }
        case "shellmod": {
          // Dos formas:
          //   shellmod ID membrana flexion                       (escalar)
          //   shellmod ID f11 f22 f12 m11 m22 m12 v13 v23        (direccional)
          const id = parseInt(tokens[1], 10);
          if (!isFinite(id)) break;
          const vals = tokens.slice(2).map(parseFloat);
          if (vals.length >= 8) {
            m.shellModsDir.set(id, vals.slice(0, 8).map(v => isFinite(v) ? v : 1));
          } else {
            const mm = vals[0], bb = vals[1];
            m.shellMods.set(id, [isFinite(mm) ? mm : 1, isFinite(bb) ? bb : 1]);
          }
          break;
        }
        case "areaobj": {
          // areaobj ID n1 n2 n3 n4 desdeShell hastaShell
          const v = tokens.slice(1).map(t => parseInt(t, 10));
          if (v.length < 7 || v.some(x => !isFinite(x))) {
            m.errors.push(`areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"`);
            break;
          }
          const [id, a1, a2, a3, a4, desde, hasta] = v;
          const cells: number[] = [];
          for (let k = desde; k <= hasta; k++) cells.push(k);
          m.areaObjs.push({ id, pts: [a1, a2, a3, a4], cells });
          break;
        }
        case "shellang": {
          // shellang ID grados — angulo del eje local 1 (como SetLocalAxes de ETABS)
          // OJO: `ang` NO es alias de esto. Lo fue, y al añadirse `ang` para el
          // angulo local de BARRA (mas arriba en este mismo switch) el alias
          // quedo inalcanzable — el primer `case` gana. Se quita para que no
          // parezca que sigue existiendo: el angulo de cascara es `shellang`.
          const id = parseInt(tokens[1], 10);
          const deg = parseFloat(tokens[2]);
          if (!isFinite(id) || !isFinite(deg)) {
            m.errors.push(`shellang: se esperaba "shellang shellID grados"`);
            break;
          }
          m.shellAngles.set(id, deg);
          break;
        }
        case "areaload":
        case "qarea": {
          const id = parseInt(tokens[1], 10);
          const q = parseFloat(tokens[2]);
          if (!isFinite(id) || !isFinite(q)) {
            m.errors.push(`areaload: se esperaba "areaload shellID q"`);
            break;
          }
          m.shellLoads.set(id, q);
          break;
        }
        case "support":
        case "fix": {
          const nodeId = parseInt(tokens[1], 10);
          const spec = tokens.slice(2).join(" ");
          m.supports.set(nodeId, parseSupportSpec(spec));
          break;
        }
        case "load":
        case "l": {
          const nodeId = parseInt(tokens[1], 10);
          const fx = parseFloat(tokens[2] ?? "0");
          const fy = parseFloat(tokens[3] ?? "0");
          const fz = parseFloat(tokens[4] ?? "0");
          const mx = parseFloat(tokens[5] ?? "0");
          const my = parseFloat(tokens[6] ?? "0");
          const mz = parseFloat(tokens[7] ?? "0");
          m.loads.set(nodeId, [fx, fy, fz, mx, my, mz]);
          break;
        }
        case "frameload":
        case "fl": {
          // frameload frameID wx wy wz   (kN/m, ejes globales)
          const fid = parseInt(tokens[1], 10);
          const wx = parseFloat(tokens[2] ?? "0");
          const wy = parseFloat(tokens[3] ?? "0");
          const wz = parseFloat(tokens[4] ?? "0");
          const ant = m.frameLoads.get(fid) ?? [0, 0, 0];
          m.frameLoads.set(fid, [ant[0] + wx, ant[1] + wy, ant[2] + wz]);
          break;
        }
        case "spring": {
          const nodeId = parseInt(tokens[1], 10);
          const dofName = (tokens[2] ?? "uz").toLowerCase();
          const dof = DOF_NAMES[dofName] ?? 2;
          const k = parseFloat(tokens[3] ?? "1000");
          m.springs.push({ node: nodeId, dof, k });
          break;
        }
        // diaph <nudo> <idDiafragma>  — diafragma rigido (ata Ux, Uy, Rz)
        case "diaph":
        case "diaphragm": {
          const nodeId = parseInt(tokens[1], 10);
          const d = parseInt(tokens[2] ?? "1", 10);
          if (isFinite(nodeId) && isFinite(d) && d > 0) m.diaphragms.set(nodeId, d);
          break;
        }
        case "mass": {
          // mass <nudo> <m>   masa concentrada en toneladas
          const nodeId = parseInt(tokens[1], 10);
          const mm = parseFloat(tokens[2] ?? "0");
          if (Number.isFinite(nodeId) && Number.isFinite(mm))
            m.masses.set(nodeId, (m.masses.get(nodeId) ?? 0) + mm);
          else
            m.errors.push(`L${lineNo+1}: mass necesita <nudo> <toneladas>`);
          break;
        }
        case "solve":
        case "run":
        case "analyze": {
          m.doSolve = true;
          break;
        }
        case "reset":
        case "clear":
          m.nodes.clear(); m.frames.length = 0; m.shells.length = 0; m.solids.length = 0;
          m.supports.clear(); m.loads.clear(); m.frameLoads.clear();
          m.springs.length = 0; m.masses.clear(); m.diaphragms.clear();
          break;
        default:
          m.errors.push(`L${lineNo+1}: comando desconocido "${cmd}"`);
      }
    } catch (e: any) {
      m.errors.push(`L${lineNo+1}: error "${raw}" — ${e.message}`);
    }
  }
  return m;
}

const DEFAULT_SCRIPT = `# CLI Modeler — escribí comandos para construir un modelo
# Ejemplo: pórtico 2D con carga lateral

# ── Nodos (ID  X  Y  Z) ──
node 1   0   0   0
node 2   0   0   3
node 3   5   0   3
node 4   5   0   0

# ── Apoyos ──
support 1 fixed
support 4 fixed

# ── Frames (ID  nI  nJ  E  A  I) ──
# E=25e6 kN/m², A=0.16 m², I=0.0021 m⁴ (col 0.40×0.40)
frame 1  1 2  25e6  0.16  0.0021
frame 2  2 3  25e6  0.15  0.0028
frame 3  3 4  25e6  0.16  0.0021

# ── Cargas (ID  FX  FY  FZ  MX  MY  MZ) ──
load 2  10  0  -50  0  0  0
load 3  10  0  -50  0  0  0

solve
`;

// ─────────────────────────────────────────────────────────────────────────────
// `deck etabs` — el deck como lo entiende ETABS (4-sep-2026)
//
// Con la MISMA malla, ETABS y SAP2000 daban distinto en el galpon (4.5 %) y en un mezanine
// (Dead 75 %). No era el elemento: ETABS conecta el pano de piso a TODO nudo que toca (edge
// constraint en los inclinados, cookie-cut en la viga que cruza un piso horizontal) y lleva
// el peso de la membrana a las vigas de borde por area tributaria. SAP2000 y Hekatan solo
// conectan los 4 nudos y pesan en las 4 esquinas. Esta funcion hace lo de ETABS sobre el
// modelo parseado, antes de armar el FEM. Medido: galpon partido ETABS 2e-5 %, mezanines
// Dead 0.003-0.005 %.
// ─────────────────────────────────────────────────────────────────────────────
type V3 = [number, number, number];
const v3sub = (a: V3, b: V3): V3 => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
const v3dot = (a: V3, b: V3) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
const v3cross = (a: V3, b: V3): V3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const v3norm = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const v3scale = (a: V3, k: number): V3 => [a[0]*k, a[1]*k, a[2]*k];

function esMembranaDeck(m: ParsedModel, id: number): boolean {
  const d = m.shellModsDir.get(id);
  return !!d && Math.abs(d[3]) < 1e-12 && Math.abs(d[4]) < 1e-12 && Math.abs(d[5]) < 1e-12;
}

/** Puntos del pano (rejilla n x n en su plano) asignados al borde mas cercano = regiones
 *  tributarias por bisectrices. Devuelve por borde k (k -> k+1) los puntos 3D y el dA. */
function muestrasTributarias(P: V3[], n = 200, spanDir?: V3): Array<{ pts: V3[]; dA: number }> {
  const c: V3 = [0, 1, 2].map(k => (P[0][k] + P[1][k] + P[2][k] + P[3][k]) / 4) as V3;
  let e1 = v3sub(P[1], P[0]); let nrm = v3cross(e1, v3sub(P[3], P[0]));
  nrm = v3scale(nrm, 1 / v3norm(nrm)); e1 = v3scale(e1, 1 / v3norm(e1)); const e2 = v3cross(nrm, e1);
  const Q = P.map(p => [v3dot(v3sub(p, c), e1), v3dot(v3sub(p, c), e2)] as [number, number]);
  // one-way: solo cuentan los DOS bordes de apoyo (los menos paralelos a la direccion de vano)
  let candidatos = [0, 1, 2, 3];
  if (spanDir) {
    const par = [0, 1, 2, 3].map(i => { const d = v3sub(P[(i + 1) % 4], P[i]); return Math.abs(v3dot(d, spanDir)) / v3norm(d); });
    candidatos = [0, 1, 2, 3].sort((a, b) => par[a] - par[b]).slice(0, 2);
  }
  const xs = Q.map(q => q[0]), ys = Q.map(q => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const out = [0, 1, 2, 3].map(() => ({ pts: [] as V3[], dA: 0 }));
  let total = 0;
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
    const x = x0 + (x1 - x0) * (a + 0.5) / n, y = y0 + (y1 - y0) * (b + 0.5) / n;
    // dentro del cuadrilatero convexo: mismo signo del producto cruzado en los 4 bordes
    let pos = 0, neg = 0;
    for (let i = 0; i < 4; i++) {
      const A = Q[i], B = Q[(i + 1) % 4];
      const cr = (B[0]-A[0]) * (y - A[1]) - (B[1]-A[1]) * (x - A[0]);
      if (cr >= 0) pos++; else neg++;
    }
    if (pos !== 4 && neg !== 4) continue;
    let mejor = candidatos[0], dmin = Infinity;
    for (const i of candidatos) {
      const A = Q[i], B = Q[(i + 1) % 4]; const dx = B[0]-A[0], dy = B[1]-A[1]; const L2 = dx*dx + dy*dy;
      const t = Math.max(0, Math.min(1, ((x-A[0])*dx + (y-A[1])*dy) / L2));
      const d = Math.hypot(x - (A[0] + t*dx), y - (A[1] + t*dy));
      if (d < dmin) { dmin = d; mejor = i; }
    }
    out[mejor].pts.push([c[0] + x*e1[0] + y*e2[0], c[1] + x*e1[1] + y*e2[1], c[2] + x*e1[2] + y*e2[2]]);
    total++;
  }
  const area = 0.5 * v3norm(v3cross(v3sub(P[2], P[0]), v3sub(P[3], P[1])));
  for (const o of out) o.dA = total ? area / total : 0;
  return out;
}

/**
 * `automesh <tam>`: parte cada pano Q4 en una rejilla de celdas de lado <= `tam`, como el
 * automallado de ETABS (`AUTOMESHOPTIONS ... FLOORMESHMAXSIZE 1250`, 1.25 m de fabrica, medido
 * en su `.$et` el 8-sep-2026: una losa de 5x5 sale con 16 elementos y 25 nudos).
 *
 * Por que hace falta: Hekatan resuelve LA MALLA QUE SE LE DA. Al importar un `.e2k` con la losa
 * como un solo pano, ETABS la malla y Hekatan no: no son el mismo modelo y la diferencia es de
 * convergencia de malla, no del elemento.
 *
 * Reparto: la geometria por interpolacion BILINEAL de las 4 esquinas (un pano plano y recto sale
 * exacto; uno alabeado, aproximado, igual que ETABS). Las celdas heredan espesor, material,
 * modificadores, tipo, angulo y la PRESION del `areaload` (que es por unidad de area: la misma en
 * cada trozo). Los nudos que ya existen se reutilizan, no se duplican.
 */
function aplicarAutomesh(m: ParsedModel, tam: number) {
  if (!(tam > 0)) return;
  const TOL = 1e-6;
  const P = (id: number) => m.nodes.get(id) as V3;
  let nextNode = Math.max(0, ...m.nodes.keys()) + 1;
  let nextShell = m.shells.reduce((mx, s) => Math.max(mx, s.id), 0) + 1;
  const nudoEn = (q: V3): number => {
    for (const [id, v] of m.nodes) if (v3norm(v3sub(v as V3, q)) < TOL) return id;
    const id = nextNode++; m.nodes.set(id, [q[0], q[1], q[2]]); return id;
  };
  const hereda = (de: number, a: number) => {
    const d = m.shellModsDir.get(de); if (d) m.shellModsDir.set(a, [...d]);
    const mm = m.shellMods.get(de); if (mm) m.shellMods.set(a, [...mm] as [number, number]);
    const q = m.shellLoads.get(de); if (q !== undefined) m.shellLoads.set(a, q);
    const ty = m.shellTypes.get(de); if (ty !== undefined) m.shellTypes.set(a, ty);
    const an = m.shellAngles.get(de); if (an !== undefined) m.shellAngles.set(a, an);
  };
  const nuevos: typeof m.shells = [];
  let partidos = 0;
  for (const sh of m.shells) {
    if (sh.pts.length !== 4) { nuevos.push(sh); continue; }
    const Q = sh.pts.map(P) as [V3, V3, V3, V3];
    if (Q.some((q) => !q)) { nuevos.push(sh); continue; }
    // lados medios: 0-1 y 3-2 son "u"; 0-3 y 1-2 son "v"
    const Lu = (v3norm(v3sub(Q[1], Q[0])) + v3norm(v3sub(Q[2], Q[3]))) / 2;
    const Lv = (v3norm(v3sub(Q[3], Q[0])) + v3norm(v3sub(Q[2], Q[1]))) / 2;
    const nu = Math.max(1, Math.ceil(Lu / tam - 1e-9));
    const nv = Math.max(1, Math.ceil(Lv / tam - 1e-9));
    if (nu === 1 && nv === 1) { nuevos.push(sh); continue; }
    const punto = (u: number, v: number): V3 => [0, 1, 2].map((k) =>
      Q[0][k] * (1 - u) * (1 - v) + Q[1][k] * u * (1 - v) + Q[2][k] * u * v + Q[3][k] * (1 - u) * v) as V3;
    const rej: number[][] = [];
    for (let i = 0; i <= nu; i++) {
      const fila: number[] = [];
      for (let j = 0; j <= nv; j++) fila.push(nudoEn(punto(i / nu, j / nv)));
      rej.push(fila);
    }
    for (let i = 0; i < nu; i++)
      for (let j = 0; j < nv; j++) {
        const id = (i === 0 && j === 0) ? sh.id : nextShell++;
        nuevos.push({ ...sh, id, pts: [rej[i][j], rej[i + 1][j], rej[i + 1][j + 1], rej[i][j + 1]] });
        if (id !== sh.id) hereda(sh.id, id);
      }
    partidos++;
  }
  if (partidos) {
    m.shells = nuevos;
    console.log(`[CLI Modeler] automesh ${tam} m: ${partidos} pano(s) partido(s) -> ${m.shells.length} cascaras, ${m.nodes.size} nudos`);
  }
}

function aplicarDeckEtabs(m: ParsedModel) {
  const TOL = 1e-4;
  const P = (id: number) => m.nodes.get(id) as V3;
  const ids = [...m.nodes.keys()];
  /** posiciones s en (0,1) de los nudos (no del pano) que caen sobre el segmento a-b */
  const sobreBorde = (a: V3, b: V3, excl: number[]): number[] => {
    const d = v3sub(b, a); const L = v3norm(d); const t = v3scale(d, 1 / L); const out: number[] = [];
    for (const id of ids) {
      if (excl.includes(id)) continue;
      const v = v3sub(P(id), a); const s = v3dot(v, t);
      if (s > 1e-6 && s < L - 1e-6 && v3norm(v3sub(v, v3scale(t, s))) < TOL) out.push(s / L);
    }
    return out.sort((x, y) => x - y);
  };
  const comunes = (a: number[], b: number[]) => {
    const out: number[] = [];
    for (const v of a) if (b.some(w => Math.abs(v - w) < 1e-5) && !out.some(u => Math.abs(v - u) < 1e-5)) out.push(v);
    return out;
  };
  const nudoEn = (p: V3): number | undefined => {
    for (const id of ids) if (v3norm(v3sub(P(id), p)) < TOL) return id;
    return undefined;
  };
  // ── 1) partir los panos membrana en las posiciones comunes a dos bordes opuestos ──
  let nextId = m.shells.reduce((mx, s) => Math.max(mx, s.id), 0) + 1;
  const nuevos: typeof m.shells = [];
  const hereda = (de: number, a: number) => {
    const d = m.shellModsDir.get(de); if (d) m.shellModsDir.set(a, [...d]);
    const mm = m.shellMods.get(de); if (mm) m.shellMods.set(a, [...mm] as [number, number]);
    const q = m.shellLoads.get(de); if (q !== undefined) m.shellLoads.set(a, q);
    const ty = m.shellTypes.get(de); if (ty !== undefined) m.shellTypes.set(a, ty);
    const an = m.shellAngles.get(de); if (an !== undefined) m.shellAngles.set(a, an);
  };
  for (const s of m.shells) {
    if (!esMembranaDeck(m, s.id) || s.pts.length !== 4 || s.pts.some(id => !m.nodes.has(id))) { nuevos.push(s); continue; }
    const p = s.pts.map(P);
    const s0 = sobreBorde(p[0], p[1], s.pts), s2 = sobreBorde(p[2], p[3], s.pts).map(v => 1 - v);
    const t1 = sobreBorde(p[1], p[2], s.pts), t3 = sobreBorde(p[3], p[0], s.pts).map(v => 1 - v);
    let S = [0, ...comunes(s0, s2), 1], T = [0, ...comunes(t1, t3), 1];
    if (S.length === 2 && T.length === 2) { nuevos.push(s); continue; }
    const bil = (u: number, v: number): V3 => [0, 1, 2].map(k =>
      (1-u)*(1-v)*p[0][k] + u*(1-v)*p[1][k] + u*v*p[2][k] + (1-u)*v*p[3][k]) as V3;
    // los puntos interiores de la rejilla tienen que EXISTIR (no se inventan nudos flotando en
    // la membrana: sin rigidez fuera del plano se disparan). Si falta alguno, se parte solo en
    // la direccion con mas cortes.
    let G = T.map(v => S.map(u => nudoEn(bil(u, v))));
    if (G.some(f => f.some(x => x === undefined))) {
      if (S.length >= T.length) T = [0, 1]; else S = [0, 1];
      G = T.map(v => S.map(u => nudoEn(bil(u, v))));
      if (G.some(f => f.some(x => x === undefined))) { nuevos.push(s); continue; }
    }
    let primero = true;
    for (let a = 0; a < T.length - 1; a++) for (let b = 0; b < S.length - 1; b++) {
      const q = [G[a][b]!, G[a][b+1]!, G[a+1][b+1]!, G[a+1][b]!];
      const id = primero ? s.id : nextId++;
      if (!primero) hereda(s.id, id);
      primero = false;
      nuevos.push({ id, pts: q, t: s.t, E: s.E, rho: s.rho });
    }
  }
  m.shells = nuevos;
  // ── 2) peso propio y areaload de las membranas -> barras de borde, tributario, Hermite ──
  const G0 = 9.80665;
  const acum = (id: number, v: number[]) => {
    const a = m.loads.get(id) ?? [0, 0, 0, 0, 0, 0];
    m.loads.set(id, [a[0]+v[0], a[1]+v[1], a[2]+v[2], a[3]+v[3], a[4]+v[4], a[5]+v[5]] as [number,number,number,number,number,number]);
  };
  const barrasEn = (a: V3, b: V3) => {
    const d = v3sub(b, a); const L = v3norm(d); const t = v3scale(d, 1 / L);
    return m.frames.filter(f => [f.nI, f.nJ].every(id => {
      const pt = m.nodes.get(id); if (!pt) return false;
      const v = v3sub(pt, a); const s = v3dot(v, t);
      return s > -TOL && s < L + TOL && v3norm(v3sub(v, v3scale(t, s))) < TOL;
    }));
  };
  for (const s of m.shells) {
    if (!esMembranaDeck(m, s.id) || s.pts.length !== 4) continue;
    const qsw = m.selfWeight ? (s.rho ?? 2.45) * s.t * G0 * m.selfWeight : 0;   // hacia abajo (magnitud)
    const qa = m.shellLoads.get(s.id) ?? 0;                                       // +z
    const qz = -qsw + qa;                                                         // kN/m2, global z
    if (Math.abs(qz) < 1e-15) continue;
    const p = s.pts.map(P);
    let spanDir: V3 | undefined;
    if (m.deckOneWay) {   // eje local 1 = borde 0->1 girado `shellang` en el plano del pano
      const e1 = v3sub(p[1], p[0]); let nrm = v3cross(e1, v3sub(p[3], p[0]));
      nrm = v3scale(nrm, 1 / v3norm(nrm)); const u1 = v3scale(e1, 1 / v3norm(e1)); const u2 = v3cross(nrm, u1);
      const ang = ((m.shellAngles.get(s.id) ?? 0) * Math.PI) / 180;
      spanDir = [0, 1, 2].map(k => Math.cos(ang) * u1[k] + Math.sin(ang) * u2[k]) as V3;
    }
    const regiones = muestrasTributarias(p, 200, spanDir);
    for (let k = 0; k < 4; k++) {
      const { pts, dA } = regiones[k]; if (!pts.length) continue;
      const a = p[k], b = p[(k + 1) % 4];
      const fr = barrasEn(a, b);
      if (!fr.length) {   // borde sin viga: a sus dos esquinas a medias (fuerza sola)
        const W = qz * dA * pts.length;
        acum(s.pts[k], [0, 0, W / 2, 0, 0, 0]); acum(s.pts[(k + 1) % 4], [0, 0, W / 2, 0, 0, 0]);
        continue;
      }
      const d = v3sub(b, a); const Lb = v3norm(d); const tb = v3scale(d, 1 / Lb);
      const sPts = pts.map(q => v3dot(v3sub(q, a), tb));
      for (const f of fr) {
        const pi = P(f.nI), pj = P(f.nJ);
        const si = v3dot(v3sub(pi, a), tb), sj = v3dot(v3sub(pj, a), tb);
        const lo = Math.min(si, sj), hi = Math.max(si, sj); const L = hi - lo;
        if (L < 1e-9) continue;
        const ultimo = hi >= Lb - 1e-6;
        const tv = v3scale(v3sub(pj, pi), 1 / L); const txw = v3cross(tv, [0, 0, 1]);
        let F1 = 0, M1 = 0, F3 = 0, M4 = 0;
        for (const sv of sPts) {
          if (sv < lo - 1e-9 || (ultimo ? sv > hi + 1e-9 : sv >= hi - 1e-9)) continue;
          let x = sv - lo; if (si > sj) x = L - x;   // desde el nudo I de la barra
          const xi = x / L;
          F1 += 1 - 3*xi*xi + 2*xi*xi*xi;  M1 += L * (xi - 2*xi*xi + xi*xi*xi);
          F3 += 3*xi*xi - 2*xi*xi*xi;      M4 += L * (-xi*xi + xi*xi*xi);
        }
        const dP = qz * dA;
        acum(f.nI, [0, 0, dP * F1, txw[0] * dP * M1, txw[1] * dP * M1, txw[2] * dP * M1]);
        acum(f.nJ, [0, 0, dP * F3, txw[0] * dP * M4, txw[1] * dP * M4, txw[2] * dP * M4]);
      }
    }
    m.deckTributario.add(s.id);
    m.shellLoads.delete(s.id);   // ya esta en m.loads: que el e2k no la escriba dos veces
  }
}

export const cliModeler: ExampleDef = {
  id: "cli-modeler",
  name: "CLI Modeler (comandos)",
  category: "🧪 Utilidades",
  defaultShellResult: "none",
  availableShellResults: [],
  params: {},
  build(_p, states) {
    // Lee el script de window (lo escribe el folder Tweakpane).
    const script = (window as any).__hekatanCliScript ?? DEFAULT_SCRIPT;
    (window as any).__hekatanCliLastScript = script;
    const m = parseCliCommands(script);
    if (m.autoMesh > 0) aplicarAutomesh(m, m.autoMesh);
    if (m.deckEtabs) aplicarDeckEtabs(m);

    // Ordenar nodos por ID y asignar índices internos
    const idToIdx = new Map<number, number>();
    const shellIdxOf = new Map<number, number>();   // id de shell -> indice de elemento
    const nodes: Node[] = [];
    const sortedIds = Array.from(m.nodes.keys()).sort((a, b) => a - b);
    for (const id of sortedIds) {
      idToIdx.set(id, nodes.length);
      nodes.push(m.nodes.get(id)!);
    }

    // Frames y shells → elements + elementInputs
    const elements: Element[] = [];
    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    // Nombres CSI para que no haya duda de cual va a que plano: I22 es la
    // flexion en el plano 1-3 (V3, M2) y I33 la del plano 1-2 (V2, M3).
    const I22 = new Map<number, number>();
    const I33 = new Map<number, number>();
    const J = new Map<number, number>();
    const densities = new Map<number, number>();
    // Canto y ancho reales de cada barra: NO entran al calculo (mandan A, I y
    // J), solo al e2k — ETABS saca de ahi los brazos de los extremos.
    const cantos = new Map<number, number>();
    const anchos = new Map<number, number>();
    const sectionShapes = new Map<number, any>();
    const localAngles = new Map<number, number>();
    const momentReleases = new Map<number, boolean[]>();
    const endOffsets = new Map<number, [number, number, number]>();
    // 0 = Mindlin (defecto del C++), 1 = Kirchhoff Shell-Thin
    const plateFormulations = new Map<number, number>();
    // Carga de vano por ELEMENTO (globales). No la usa el solver —esa carga
    // entra como fuerzas nodales equivalentes— sino `analyze()`, para poder
    // sumar las fuerzas de empotramiento al recuperar los esfuerzos.
    const frameLoadsElem = new Map<number, [number, number, number]>();
    // AsY va con Iy (plano 1-3) = As3 de CSI; AsZ va con Iz (plano 1-2) = As2.
    const shearAreasY = new Map<number, number>();
    const shearAreasZ = new Map<number, number>();
    const poissons = new Map<number, number>();
    const thicknesses = new Map<number, number>();

    for (const f of m.frames) {
      const ni = idToIdx.get(f.nI), nj = idToIdx.get(f.nJ);
      if (ni === undefined || nj === undefined) {
        const have = sortedIds.length
          ? `IDs disponibles: ${sortedIds.join(", ")}`
          : "ningún nodo definido";
        const missing: number[] = [];
        if (ni === undefined) missing.push(f.nI);
        if (nj === undefined) missing.push(f.nJ);
        m.errors.push(
          `frame ${f.id}: nodo(s) inexistente(s) [${missing.join(", ")}] — ${have}`
        );
        continue;
      }
      const eIdx = elements.length;
      elements.push([ni, nj]);
      const nu = f.nu ?? 0.2;
      elasticities.set(eIdx, f.E);
      shearModuli.set(eIdx, f.E / (2 * (1 + nu)));
      areas.set(eIdx, f.A);
      I22.set(eIdx, f.I);            // token 6
      I33.set(eIdx, f.Iy ?? f.I);    // token 7 (el del canto)
      J.set(eIdx, f.J ?? 0.14 * Math.pow(Math.sqrt(f.A), 4));
      densities.set(eIdx, f.rho ?? 2.45);
      poissons.set(eIdx, nu);
      if (f.D !== undefined && isFinite(f.D)) cantos.set(eIdx, f.D);
      if (f.B !== undefined && isFinite(f.B)) anchos.set(eIdx, f.B);
      const angF = m.frameAngles.get(f.id);
      if (angF !== undefined && isFinite(angF)) localAngles.set(eIdx, angF);
      const relF = m.frameReleases.get(f.id);
      if (relF) momentReleases.set(eIdx, relF);
      const eoF = m.frameEndOffsets.get(f.id);
      if (eoF) endOffsets.set(eIdx, eoF);
      const wF = m.frameLoads.get(f.id);
      if (wF) frameLoadsElem.set(eIdx, wF);
      const asF = m.frameShearAreas.get(f.id);
      if (asF) {
        shearAreasZ.set(eIdx, asF[0]);   // As2 -> V2, plano 1-2 (I33)
        shearAreasY.set(eIdx, asF[1]);   // As3 -> V3, plano 1-3 (I22)
      }
      // Forma de la seccion CON SU NOMBRE, para el exportador de e2k. Sin esto
      // sale `S_G1..S_G7` y el modelo reimportado en ETABS no se puede casar
      // contra el original.
      if (f.sec || (f.D !== undefined && f.B !== undefined)) {
        const sh: any = { type: "general" };
        if (f.sec) sh.name = f.sec;
        if (f.D !== undefined && isFinite(f.D)) sh.h = f.D;
        if (f.B !== undefined && isFinite(f.B)) sh.b = f.B;
        sectionShapes.set(eIdx, sh);
      }
      const cftcF = m.frameCftc.get(f.id);
      if (cftcF) {
        // `cftc`: tubo redondo relleno. A e I transformadas exactas, As de Timoshenko
        // sobre la seccion transformada y J = Js + (Gc/Gs)·Jc (exacto en circulos
        // concentricos). OJO: SAP2000 (SD) y ETABS (Filled Steel Pipe) POLIGONIZAN
        // el circulo (48 y 32 lados, medido): su A queda 0.3 / 0.6 % por debajo.
        const c = cftPipeSectionEc(cftcF.D, cftcF.t, f.E, nu, cftcF.Ec, cftcF.nuC);
        areas.set(eIdx, c.A); I33.set(eIdx, c.Iz); I22.set(eIdx, c.Iy); J.set(eIdx, c.J);
        shearAreasZ.set(eIdx, c.As2); shearAreasY.set(eIdx, c.As3);
        cantos.set(eIdx, cftcF.D); anchos.set(eIdx, cftcF.D);
        sectionShapes.set(eIdx, { type: "CFT", d: cftcF.D, tw: cftcF.t, fillE: cftcF.Ec,
          name: f.sec ?? `CFTC ${Math.round(cftcF.D * 1000)}X${Math.round(cftcF.t * 1000)}` });
      }
      const cftF = m.frameCft.get(f.id);
      if (cftF) {
        // `cft`: A e I transformadas al acero, As por Timoshenko sobre la seccion
        // transformada y J de Saint-Venant del compuesto — lo que usan SAP2000
        // (Section Designer) y ETABS (Filled Steel Tube). Pisa lo que dijera `frame`.
        const c = cftSectionEc(cftF.b, cftF.h, cftF.t, f.E, nu, cftF.Ec, cftF.nuC);
        areas.set(eIdx, c.A); I33.set(eIdx, c.Iz); I22.set(eIdx, c.Iy); J.set(eIdx, c.J);
        shearAreasZ.set(eIdx, c.As2); shearAreasY.set(eIdx, c.As3);
        cantos.set(eIdx, cftF.h); anchos.set(eIdx, cftF.b);
        sectionShapes.set(eIdx, { type: "CFT", b: cftF.b, h: cftF.h, tw: cftF.t, fillE: cftF.Ec,
          name: f.sec ?? `CFT ${Math.round(cftF.h * 1000)}X${Math.round(cftF.b * 1000)}X${Math.round(cftF.t * 1000)}` });
      }
    }
    // ── Cruces de barras SIN nudo comun (las X de arriostramiento) ─────────────
    // ETABS parte las dos barras en el cruce y les pone un nudo (MESHATINTERSECTIONS
    // "YES", su defecto); SAP2000 las deja cruzarse sin tocarse. Medido en el galpon
    // (2-sep-2026): con la misma malla Hekatan = SAP2000 exacto y ETABS -0.2 %, y la
    // diferencia era esto. Por defecto se hace como ETABS; `meshcross 0` = SAP2000.
    if (m.meshCross) {
      const dot = (u: number[], v: number[]) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
      const mapas: Map<number, any>[] = [elasticities, shearModuli, areas, I22, I33, J, densities, poissons,
        cantos, anchos, localAngles, shearAreasY, shearAreasZ, sectionShapes, frameLoadsElem];
      const copiar = (de: number, a: number) => { for (const mp of mapas) if (mp.has(de)) mp.set(a, mp.get(de)); };
      const nudoEn = (p: number[]) => {
        for (let i = 0; i < nodes.length; i++)
          if (Math.hypot(nodes[i][0] - p[0], nodes[i][1] - p[1], nodes[i][2] - p[2]) < 1e-6) return i;
        nodes.push([p[0], p[1], p[2]]); return nodes.length - 1;
      };
      const bb = (e: number[]) => { const A = nodes[e[0]], B = nodes[e[1]]; return [Math.min(A[0], B[0]), Math.min(A[1], B[1]), Math.min(A[2], B[2]), Math.max(A[0], B[0]), Math.max(A[1], B[1]), Math.max(A[2], B[2])]; };
      let nCruces = 0;
      for (let a = 0; a < elements.length; a++) {
        if (elements[a].length !== 2) continue;
        const ba = bb(elements[a]);
        for (let b = a + 1; b < elements.length; b++) {
          if (elements[b].length !== 2) continue;
          const [a0, a1] = elements[a], [b0, b1] = elements[b];
          if (a0 === b0 || a0 === b1 || a1 === b0 || a1 === b1) continue;
          const bbB = bb(elements[b]);
          if (ba[0] > bbB[3] + 1e-6 || bbB[0] > ba[3] + 1e-6 || ba[1] > bbB[4] + 1e-6 || bbB[1] > ba[4] + 1e-6 || ba[2] > bbB[5] + 1e-6 || bbB[2] > ba[5] + 1e-6) continue;
          const P = nodes[a0], Q = nodes[a1], R = nodes[b0], S = nodes[b1];
          const d1 = [Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]], d2 = [S[0] - R[0], S[1] - R[1], S[2] - R[2]], r = [P[0] - R[0], P[1] - R[1], P[2] - R[2]];
          const aa = dot(d1, d1), bd = dot(d1, d2), cc = dot(d2, d2), dd = dot(d1, r), ee = dot(d2, r);
          const den = aa * cc - bd * bd;
          if (den < 1e-10 * aa * cc) continue;                       // paralelas
          const sP = (bd * ee - cc * dd) / den, tP = (aa * ee - bd * dd) / den;
          if (sP < 1e-6 || sP > 1 - 1e-6 || tP < 1e-6 || tP > 1 - 1e-6) continue;   // el cruce cae fuera de alguna
          const X = [P[0] + sP * d1[0], P[1] + sP * d1[1], P[2] + sP * d1[2]], Y = [R[0] + tP * d2[0], R[1] + tP * d2[1], R[2] + tP * d2[2]];
          if (Math.hypot(X[0] - Y[0], X[1] - Y[1], X[2] - Y[2]) > 1e-6) continue;    // se cruzan en planta pero no se tocan
          const nx = nudoEn(X);
          for (const e of [a, b]) {
            const [n0, n1] = elements[e]; const nuevo = elements.length;
            elements[e] = [n0, nx]; elements.push([nx, n1]); copiar(e, nuevo);
            const rel = momentReleases.get(e);
            if (rel) { momentReleases.set(e, [...rel.slice(0, 6), ...Array(6).fill(false)]); momentReleases.set(nuevo, [...Array(6).fill(false), ...rel.slice(6)]); }
            const eo = endOffsets.get(e);
            if (eo) { endOffsets.set(e, [eo[0], 0, eo[2]]); endOffsets.set(nuevo, [0, eo[1], eo[2]]); }
          }
          nCruces++;
        }
      }
      if (nCruces > 0) console.log(`[CLI Modeler] ${nCruces} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
    }
    for (const s of m.shells) {
      const idxs = s.pts.map(id => idToIdx.get(id));
      if (idxs.some(i => i === undefined)) {
        m.errors.push(`shell ${s.id}: algun nodo inexistente`);
        continue;
      }
      const eIdx = elements.length;
      shellIdxOf.set(s.id, eIdx);
      elements.push(idxs as Element);
      elasticities.set(eIdx, s.E);
      shearModuli.set(eIdx, s.E / (2 * 1.2));
      thicknesses.set(eIdx, s.t);
      densities.set(eIdx, s.rho ?? 2.45);
      poissons.set(eIdx, 0.2);
      const tipo = m.shellTypes.get(s.id);
      if (tipo !== undefined) plateFormulations.set(eIdx, tipo);
    }

    // Supports/loads/springs: traducir IDs a indices internos
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (const [id, sp] of m.supports.entries()) {
      const idx = idToIdx.get(id);
      if (idx !== undefined) supports.set(idx, sp);
    }
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (const [id, ld] of m.loads.entries()) {
      const idx = idToIdx.get(id);
      if (idx !== undefined) loads.set(idx, [...ld]);
    }
    const diaphragms = new Map<number, number>();
    for (const [id, d] of m.diaphragms.entries()) {
      const idx = idToIdx.get(id);
      if (idx !== undefined) diaphragms.set(idx, d);
    }
    const masses = new Map<number, number>();
    for (const [id, mm] of m.masses.entries()) {
      const idx = idToIdx.get(id);
      if (idx !== undefined) masses.set(idx, mm);
    }

    // ── frameload -> cargas nodales CONSISTENTES (fuerzas + momentos) ────────
    // Una carga repartida w sobre una barra de longitud L se sustituye por sus
    // fuerzas de empotramiento perfecto:
    //     F_i = F_j = w·L/2
    //     M_i = +(L²/12)·(t × w)      M_j = −(L²/12)·(t × w)
    // con t = versor de la barra. Esto es EXACTO para los desplazamientos y las
    // reacciones nodales, y es lo que distingue una viga continua de un reparto
    // por ancho tributario: sin los MOMENTOS, el apoyo interior de un vano ancho
    // recibe de menos y el extremo de mas (medido: −16 % y +23 % en el galpon).
    // Comprobacion del signo, viga en +x con carga hacia abajo w=(0,0,−q):
    // t×w = (0,+q,0) -> M_i = +qL²/12 alrededor de +y, que es el empotramiento
    // que da la teoria de vigas.
    if (m.frameLoads.size) {
      const acum = (idx: number, v: number[]) => {
        const a = loads.get(idx) ?? [0, 0, 0, 0, 0, 0];
        loads.set(idx, [a[0]+v[0], a[1]+v[1], a[2]+v[2],
                        a[3]+v[3], a[4]+v[4], a[5]+v[5]] as
                       [number,number,number,number,number,number]);
      };
      for (const [fid, w] of m.frameLoads.entries()) {
        const f = m.frames.find(fr => fr.id === fid);
        if (!f) { m.errors.push(`frameload ${fid}: no existe esa barra`); continue; }
        const iI = idToIdx.get(f.nI), iJ = idToIdx.get(f.nJ);
        if (iI === undefined || iJ === undefined) continue;
        const a = nodes[iI], b = nodes[iJ];
        const d = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
        const L = Math.hypot(d[0], d[1], d[2]);
        if (L < 1e-9) continue;
        const t = [d[0]/L, d[1]/L, d[2]/L];
        const c = L*L/12;
        const txw = [t[1]*w[2] - t[2]*w[1],
                     t[2]*w[0] - t[0]*w[2],
                     t[0]*w[1] - t[1]*w[0]];
        acum(iI, [w[0]*L/2, w[1]*L/2, w[2]*L/2,  c*txw[0],  c*txw[1],  c*txw[2]]);
        acum(iJ, [w[0]*L/2, w[1]*L/2, w[2]*L/2, -c*txw[0], -c*txw[1], -c*txw[2]]);
      }
    }

    // ── CARGA DE SUPERFICIE -> vector de fuerzas nodales CONSISTENTE ────────
    // Una carga de area entra al FEM por un unico camino: su vector de fuerzas
    // nodales equivalente, f_i = integral(N_i * q * dA). No hay otro. Por eso
    // calcularlo aca, antes de llamar al solver, da el MISMO resultado que
    // hacerlo dentro del kernel: es la definicion, no un atajo.
    //
    // Se integra en el cuadrado patron con Gauss 2x2 y el jacobiano REAL. En un
    // rectangulo sale q*A/4 en cada nudo; en un cuadrilatero deformado NO, y ahi
    // esta la diferencia con repartir el area entre 4. Verificado contra ETABS
    // (galpon-bodega-electoral/re_carga_area_etabs.py): la suma da q por el area
    // exacta del poligono, tambien en trapecio y en triangulo.
    const cargaDeArea = new Map<number, number>();
    const G2 = 1 / Math.sqrt(3);
    const GAUSS: Array<[number, number]> = [[-G2, -G2], [G2, -G2], [G2, G2], [-G2, G2]];
    for (const s of m.shells) {
      const q = m.shellLoads.get(s.id);
      if (!q) continue;
      if (m.deckTributario.has(s.id)) continue;   // `deck etabs`: ya fue a las barras de borde
      const idx = s.pts.map((p) => idToIdx.get(p));
      if (idx.some((i) => i === undefined)) {
        m.errors.push(`areaload ${s.id}: algun nodo inexistente`);
        continue;
      }
      const P = idx.map((i) => nodes[i as number]);
      const f = [0, 0, 0, 0];
      for (const [xi, eta] of GAUSS) {
        const N = [0.25 * (1 - xi) * (1 - eta), 0.25 * (1 + xi) * (1 - eta),
                   0.25 * (1 + xi) * (1 + eta), 0.25 * (1 - xi) * (1 + eta)];
        const dNx = [-0.25 * (1 - eta), 0.25 * (1 - eta), 0.25 * (1 + eta), -0.25 * (1 + eta)];
        const dNe = [-0.25 * (1 - xi), -0.25 * (1 + xi), 0.25 * (1 + xi), 0.25 * (1 - xi)];
        // vectores tangentes: sirven para cualquier plano, no solo el XY
        const a = [0, 1, 2].map((k) => dNx.reduce((s2, d, i) => s2 + d * P[i][k], 0));
        const b = [0, 1, 2].map((k) => dNe.reduce((s2, d, i) => s2 + d * P[i][k], 0));
        const cr = [a[1] * b[2] - a[2] * b[1],
                    a[2] * b[0] - a[0] * b[2],
                    a[0] * b[1] - a[1] * b[0]];
        const detJ = Math.hypot(cr[0], cr[1], cr[2]);   // area diferencial real
        for (let i = 0; i < 4; i++) f[i] += N[i] * q * detJ;
      }
      for (let i = 0; i < 4; i++) {
        const k = idx[i] as number;
        const prev = loads.get(k) ?? [0, 0, 0, 0, 0, 0];
        prev[2] += f[i];                                 // Fz
        loads.set(k, prev as [number,number,number,number,number,number]);
        // Se anota APARTE cuanto de la carga de ese nudo vino del area. El
        // solver usa `loads` y no le importa, pero el exportador e2k si: ahi
        // la carga se escribe como AREALOAD sobre el objeto, y si ademas
        // saliera como POINTLOAD quedaria contada DOS VECES.
        cargaDeArea.set(k, (cargaDeArea.get(k) ?? 0) + f[i]);
      }
    }
    // PESO PROPIO. Igual que `apply_selfweight` del motor de Python: barras
    // rho*A*L*g repartido a medias, cascaras rho*t*A/4 a cada esquina. La barra
    // con `endoffset` pesa por su luz libre si es VIGA (< 20 grados con la
    // horizontal); columna y diagonal por la longitud entera.
    if (m.selfWeight) {
      const G = 9.80665;
      const swSkip = new Set<number>();   // `deck etabs`: membranas cuyo peso ya fue a las barras
      for (const [sid, eIdx] of shellIdxOf) if (m.deckTributario.has(sid)) swSkip.add(eIdx);
      const addFz = (k: number, fz: number) => {
        const prev = loads.get(k) ?? [0, 0, 0, 0, 0, 0];
        prev[2] += fz;
        loads.set(k, prev as [number,number,number,number,number,number]);
      };
      elements.forEach((e, i) => {
        const rho = densities.get(i) ?? 0;
        if (!rho) return;
        if (swSkip.has(i)) return;
        if (e.length === 2) {
          const A = areas.get(i) ?? 0;
          const p0 = nodes[e[0]], p1 = nodes[e[1]];
          const d = [p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]];
          let L = Math.hypot(d[0], d[1], d[2]);
          const eo = endOffsets.get(i);
          if (eo) {
            const dh = Math.hypot(d[0], d[1]);
            const esViga = dh > 1e-9 &&
              Math.abs(Math.atan2(Math.abs(d[2]), dh)) * 180 / Math.PI < 20;
            if (esViga) L = Math.max(L - eo[0] - eo[1], 0);
          }
          // CONSISTENTE, como `frameload` y como CSI: fuerzas w·L/2 Y los momentos de
          // empotramiento (L²/12)·(t×w). Solo fuerzas daba 0.66 % en los nudos del
          // mezanine 1x1 contra SAP2000/ETABS con el MISMO peso total (4-sep-2026).
          const Lfull = Math.hypot(d[0], d[1], d[2]);
          const wz = -A * rho * G * m.selfWeight;          // kN/m, global -z
          const t = [d[0] / Lfull, d[1] / Lfull, d[2] / Lfull];
          const c = L * L / 12;
          const txw = [t[1] * wz, -t[0] * wz, 0];        // t × (0,0,wz)
          const acumSW = (k: number, v: number[]) => {
            const prev = loads.get(k) ?? [0, 0, 0, 0, 0, 0];
            loads.set(k, [prev[0]+v[0], prev[1]+v[1], prev[2]+v[2], prev[3]+v[3], prev[4]+v[4], prev[5]+v[5]] as
                      [number,number,number,number,number,number]);
          };
          acumSW(e[0], [0, 0, wz * L / 2,  c * txw[0],  c * txw[1], 0]);
          acumSW(e[1], [0, 0, wz * L / 2, -c * txw[0], -c * txw[1], 0]);
        } else if (e.length === 4) {
          const t = thicknesses.get(i) ?? 0;
          const P = e.map(n => nodes[n]);
          let area2 = 0;
          for (let k = 1; k < 3; k++) {
            const u = [P[k][0]-P[0][0], P[k][1]-P[0][1], P[k][2]-P[0][2]];
            const v = [P[k+1][0]-P[0][0], P[k+1][1]-P[0][1], P[k+1][2]-P[0][2]];
            const cr = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
            area2 += Math.hypot(cr[0], cr[1], cr[2]) / 2;
          }
          const W = area2 * t * rho * G * m.selfWeight;
          for (const n of e) addFz(n, -W / 4);
        }
      });
    }
    const springsList: Array<{node:number; dof:number; k:number}> = [];
    for (const sp of m.springs) {
      const idx = idToIdx.get(sp.node);
      if (idx !== undefined) springsList.push({ node: idx, dof: sp.dof, k: sp.k });
    }
    // Muelles de AREA: registro con nudo negativo = -(elemento+1); gdl -1 consistente, -3 nodal
    for (const as of m.areaSprings) {
      const eIdx = shellIdxOf.get(as.id);
      if (eIdx === undefined) { m.errors.push(`areaspring ${as.id}: no existe esa cascara`); continue; }
      springsList.push({ node: -(eIdx + 1), dof: as.nodal ? -3 : -1, k: as.ks });
    }
    // `edge etabs`: nudos colgados sobre aristas de cascara -> registro gdl -2, k = indice del nudo
    if (m.edgeEtabs) {
      const enShell = new Set<number>();
      const shellsIdx: number[] = [];
      elements.forEach((el, e) => { if (el.length === 3 || el.length === 4) { shellsIdx.push(e); for (const n of el) enShell.add(n); } });
      let nColgados = 0;
      for (const e of shellsIdx) {
        const el = elements[e] as number[];
        const P = el.map(n => nodes[n]);
        const bb = [0, 1, 2].map(d => [Math.min(...P.map(q => q[d])), Math.max(...P.map(q => q[d]))]);
        for (let h = 0; h < nodes.length; h++) {
          if (el.includes(h)) continue;
          const X = nodes[h];
          if (X[0] < bb[0][0] - 1e-6 || X[0] > bb[0][1] + 1e-6 || X[1] < bb[1][0] - 1e-6 || X[1] > bb[1][1] + 1e-6 || X[2] < bb[2][0] - 1e-6 || X[2] > bb[2][1] + 1e-6) continue;
          // sobre alguna arista (i, j), estrictamente dentro
          let colgado = false;
          for (let k = 0; k < el.length && !colgado; k++) {
            const A = P[k], B = P[(k + 1) % el.length];
            const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]; const L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2]; if (L2 < 1e-24) continue;
            const q = [X[0] - A[0], X[1] - A[1], X[2] - A[2]]; const t = (q[0] * d[0] + q[1] * d[1] + q[2] * d[2]) / L2;
            if (t <= 1e-6 || t >= 1 - 1e-6) continue;
            const r = [q[0] - t * d[0], q[1] - t * d[1], q[2] - t * d[2]];
            if (Math.hypot(r[0], r[1], r[2]) <= 1e-6 * Math.sqrt(L2)) colgado = true;
          }
          if (!colgado) continue;
          // solo si el nudo pertenece a OTRO elemento (si no, esta suelto y no hay que atarlo)
          const usado = elements.some((el2, e2) => e2 !== e && (el2 as number[]).includes(h));
          if (!usado) continue;
          springsList.push({ node: -(e + 1), dof: -2, k: h }); nColgados++;
        }
      }
      if (nColgados) console.log(`[CLI Modeler] edge etabs: ${nColgados} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
    }

    // ── Solidos H8 (`hex`): 8 nudos, 3 GDL por nudo ────────────────────────
    const solidIdx: number[] = [];
    for (const so of m.solids) {
      const idxs = so.pts.map(id => idToIdx.get(id));
      if (idxs.some(i => i === undefined)) { m.errors.push(`hex ${so.id}: algun nodo inexistente`); continue; }
      const eIdx = elements.length;
      elements.push(idxs as unknown as Element);
      elasticities.set(eIdx, so.E); poissons.set(eIdx, so.nu);
      shearModuli.set(eIdx, so.E / (2 * (1 + so.nu))); densities.set(eIdx, so.rho);
      solidIdx.push(eIdx);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    // Los resortes van DENTRO de nodeInputs. Antes `springsList` era una
    // variable local que solo se le pasaba a `deform`, asi que el modal no podia
    // verlos por mucho que el .heks los trajera: la cimentacion del RIOCHICO se
    // apoya en 612 resortes de balasto y el modal la veia flotando.
    states.nodeInputs.val = { supports, loads, masses, diaphragms,
                              springs: springsList } as any;
    if ((states as any).springs) (states as any).springs.val = springsList;
    // Modificadores por elemento, indexados como los shells en `elements`
    const membraneModifiers = new Map<number, number>();
    const bendingModifiers = new Map<number, number>();
    const shellModifiers = new Map<number, number[]>();
    // Se guardan para el EXPORTADOR e2k, no para el solver: la carga de area
    // ya se repartio a los nudos arriba, pero ETABS la escribe como AREALOAD
    // sobre el objeto. Si se exporta ya repartida, al reimportar queda clavada
    // en los nudos y deja de redistribuirse al cambiar la malla.
    const shellSurfaceLoads = new Map<number, number>();
    const shellAngles = new Map<number, number>();
    for (const s of m.shells) {
      const eIdx = shellIdxOf.get(s.id);
      if (eIdx === undefined) continue;
      const qs = m.shellLoads.get(s.id);
      if (qs !== undefined) shellSurfaceLoads.set(eIdx, qs);
      const ang = m.shellAngles.get(s.id);
      if (ang !== undefined) shellAngles.set(eIdx, ang);
      const dir = m.shellModsDir.get(s.id);
      if (dir) {
        shellModifiers.set(eIdx, dir);
        // Y ADEMAS el par escalar equivalente. `deform` lee los 8 direccionales,
        // pero el MODAL solo lee membraneModifiers/bendingModifiers: si aqui se
        // hacia `continue`, esos dos mapas quedaban vacios y el modal armaba el
        // deck con flexion 1 (losa maciza) mientras el estatico lo armaba con la
        // flexion 0 declarada. Salian dos rigideces distintas para el MISMO
        // modelo — en el mezanine, +12.6 % en UY y +28 % en el modo vertical.
        // Promediar F11/F22 y M11/M22 es exacto cuando el shell es isotropo
        // (el caso de un `shellmod ID 1 1 1 0 0 0 1 1`) y aproximado solo si es
        // de verdad ortotropo.
        membraneModifiers.set(eIdx, (dir[0] + dir[1]) / 2);
        bendingModifiers.set(eIdx, (dir[3] + dir[4]) / 2);
        continue;
      }
      const mods = m.shellMods.get(s.id);
      if (mods) {
        membraneModifiers.set(eIdx, mods[0]);
        bendingModifiers.set(eIdx, mods[1]);
      }
    }

    states.elementInputs.val = {
      elasticities, shearModuli, areas,
      // Con los ejes locales en convencion CSI, momentsOfInertiaY gobierna la
      // flexion en el plano 1-3 (= I22) y momentsOfInertiaZ la del 1-2 (= I33).
      // Antes era al reves, y por eso el mapeo aqui esta cruzado respecto a la
      // version anterior: el token del .heks no cambio, cambio el motor.
      momentsOfInertiaY: I22, momentsOfInertiaZ: I33,
      torsionalConstants: m.torsionFactor !== 1 ? new Map([...J].map(([k, v]) => [k, v * m.torsionFactor])) : J,   // `torsion safe`
      densities, poissonsRatios: poissons, thicknesses,
      membraneModifiers, bendingModifiers, shellModifiers,
      shellSurfaceLoads, shellAngles, cargaDeArea, cantos, anchos, sectionShapes, localAngles,
      shearAreasY, shearAreasZ, momentReleases, endOffsets, plateFormulations,
      frameLoads: frameLoadsElem,
      meshAtIntersections: m.meshCross,
      solidIncompatible: m.solidIncompatible,
      // El `selfweight` del .heks, para que el exportador e2k en modo "auto"
      // escriba SELFWEIGHT con el multiplicador del MODELO (0 si no lo lleva)
      // y descuente de las cargas nodales lo que ETABS va a calcular solo.
      selfWeight: m.selfWeight,
      etabsWallJoint: m.etabsWallJoint,
      areaObjects: m.areaObjs.map(o => ({
        nodes: o.pts.map(id => idToIdx.get(id)).filter(i => i !== undefined) as number[],
        cells: o.cells.map(id => shellIdxOf.get(id)).filter(i => i !== undefined) as number[],
        q: o.cells.map(id => m.shellLoads.get(id)).find(v => v !== undefined),
        ang: o.cells.map(id => m.shellAngles.get(id)).find(v => v !== undefined),
      })).filter(o => o.nodes.length === 4 && o.cells.length > 0),
    } as any;

    if (m.doSolve && solidIdx.length > 0 && solidIdx.length === elements.length) {
      // Un modelo de SOLO solidos va por hex8Solve (da ademas tensiones y von Mises
      // por elemento). Si hay barras o cascaras mezcladas, todo va por `deform`,
      // que desde el 3-sep-2026 ensambla el H8 en la misma K (sin tensiones de solido).
      {
        try {
          const E0 = elasticities.get(solidIdx[0]) ?? 25e6, nu0 = poissons.get(solidIdx[0]) ?? 0.2;
          if (solidIdx.some(i => Math.abs((elasticities.get(i) ?? E0) - E0) > 1e-9 * E0 || Math.abs((poissons.get(i) ?? nu0) - nu0) > 1e-12))
            m.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
          const sup = new Map<number, [boolean, boolean, boolean]>();
          for (const [n, v] of states.nodeInputs.val.supports ?? []) sup.set(n, [!!v[0], !!v[1], !!v[2]]);
          const ld = new Map<number, [number, number, number]>();
          for (const [n, v] of states.nodeInputs.val.loads ?? []) ld.set(n, [v[0] ?? 0, v[1] ?? 0, v[2] ?? 0]);
          const r = hex8Solve({ nodes: nodes as any, elements: elements as any, E: E0, nu: nu0, supports: sup, loads: ld, incompatible: m.solidIncompatible });
          const deformations = new Map<number, number[]>();
          r.displacements.forEach(([ux, uy, uz], n) => deformations.set(n, [ux, uy, uz, 0, 0, 0]));
          states.deformOutputs.val = { deformations, reactions: new Map() } as any;
          states.analyzeOutputs.val = { solidStress: r.stressPerElement, solidVonMises: r.vonMisesPerElement } as any;
          console.log(`[CLI Modeler] Solve OK — ${elements.length} solidos H8, ${nodes.length} nodos (${r.elapsedMs.toFixed(0)} ms)`);
        } catch (e: any) { m.errors.push(`hex8Solve: ${e?.message ?? e}`); }
      }
    } else if (m.doSolve && nodes.length && elements.length) {
      try {
        states.deformOutputs.val = deform(
          nodes, elements, states.nodeInputs.val, states.elementInputs.val,
          springsList.length ? springsList : undefined,
        );
        // Y los RESULTADOS: momentos, cortantes, tensiones. El CLI solo corria
        // `deform` (desplazamientos), asi que `analyzeOutputs` quedaba vacio y
        // los paneles de «Frame results» y «Shell results» no tenian nada que
        // dibujar — parecian rotos cuando en realidad nadie los habia
        // calculado.
        try {
          states.analyzeOutputs.val = analyze(
            nodes, elements, states.elementInputs.val,
            states.deformOutputs.val,
          );
        } catch (e: any) {
          console.warn("[CLI Modeler] analyze:", e?.message ?? e);
        }
        // Tensiones de los solidos MEZCLADOS (analyze no sabe de H8): la misma
        // recuperacion que hex8Solve, elemento a elemento, con sus desplazamientos.
        if (solidIdx.length > 0) {
          try {
            const U = states.deformOutputs.val.deformations;
            const solidStress = new Map<number, number[][]>(), solidVonMises = new Map<number, number[]>();
            for (const i of solidIdx) {
              const el = elements[i];
              const coords = el.map(n => nodes[n]) as [number, number, number][];
              const u = el.flatMap(n => { const d = U.get(n) ?? [0, 0, 0]; return [d[0], d[1], d[2]]; });
              const r = hex8Stress(coords, elasticities.get(i) ?? 25e6, poissons.get(i) ?? 0.2, u, m.solidIncompatible);
              solidStress.set(i, r.stress); solidVonMises.set(i, r.vonMises);
            }
            states.analyzeOutputs.val = { ...(states.analyzeOutputs.val ?? {}), solidStress, solidVonMises } as any;
          } catch (e: any) {
            console.warn("[CLI Modeler] tensiones de solidos:", e?.message ?? e);
          }
        }
        console.log("[CLI Modeler] Solve OK —", elements.length, "elementos,", nodes.length, "nodos");
      } catch (e: any) {
        m.errors.push(`solve falló: ${e.message}`);
      }
    }

    // El viewer dibuja nodos/elementos automaticamente desde states.nodes
    // y states.elements (mismo render que zapata-aislada, plate, etc.).
    // No agregamos objects3D extra — ese campo se reserva para overlays
    // específicos de cada ejemplo (zigzag springs, cotas, labels).
    states.objects3D.val = [];

    // Reportar errores en consola
    if (m.errors.length) {
      console.warn("[CLI Modeler] Errores:");
      for (const e of m.errors) console.warn("  -", e);
    }
    (window as any).__hekatanCliErrors = m.errors;
    // Resultado en las stats: sin esto, abrir un .heks solo dice cuántas
    // barras entraron, y uno no sabe si el modelo se resolvió BIEN. Con la
    // flecha y la suma de reacciones a la vista, un modelo flojo o mal
    // apoyado se nota de una (ΣRz debe dar la carga aplicada).
    let maxUz = 0, sumRz = 0;
    const dOut = states.deformOutputs.val;
    if (dOut?.deformations?.size) {
      for (const [, v] of dOut.deformations) {
        if (Math.abs(v[2]) > Math.abs(maxUz)) maxUz = v[2];
      }
    }
    if (dOut?.reactions?.size) {
      for (const [, v] of dOut.reactions) sumRz += v[2] || 0;
    }
    (window as any).__hekatanCliStats = {
      nodes: nodes.length, frames: m.frames.length, shells: m.shells.length,
      supports: supports.size, loads: loads.size, springs: springsList.length,
      solved: m.doSolve, errors: m.errors.length,
      maxUzMm: +(maxUz * 1000).toFixed(3), sumRz: +sumRz.toFixed(1),
    };
  },
};
