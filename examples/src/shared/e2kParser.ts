/**
 * ETABS .e2k File Parser
 * Converts ETABS text model files into awatif mesh data.
 *
 * Supported sections:
 *   CONTROLS (units), STORIES, MATERIAL PROPERTIES, FRAME SECTIONS,
 *   POINT COORDINATES, LINE CONNECTIVITIES, AREA CONNECTIVITIES,
 *   POINT ASSIGNS (restraints), LINE ASSIGNS (section assignment),
 *   FRAME OBJECT LOADS
 */
import type { Node, Element, NodeInputs, ElementInputs, SectionShape } from "hekatan-fem";
import { cftSectionEc, cftPipeSectionEc } from "./cadSections";
import { propiedadesSD, formaDesdeE2k, type PiezaSD } from "./sectionDesigner";

export interface E2kGrid {
  label: string;   // "A", "B", "1", "2", etc.
  dir: "X" | "Y";
  coord: number;
}

/**
 * Un NIVEL AUXILIAR de ETABS. En el `.e2k` es `REFERENCEPLANE ... Z <z>` y va
 * dentro de `$ GRIDS`, **no** dentro de `$ STORIES`. La gramatica esta sacada
 * del binario (`ETABS.dll`, la tabla de tokens del e2k):
 *
 *     GRIDSYSTEM  TOWER  CARTESIAN CYLINDRICAL ... TOPSTORY BOTTOMSTORY
 *     GENGRID  LABEL  X1 Y1 X2 Y2  VISIBLE  BUBBLELOC
 *     REFERENCEPLANE   Z
 *     REFERENCEPOINT   X  Y
 *     GRID  DIR  COORD
 *
 * Y esa es la respuesta a por que **no cortan nada**: son entidades de
 * REJILLA, ayudas de dibujo, igual que una linea de ejes. Lo unico que parte un
 * elemento es una PLANTA de verdad, y solo a las columnas que la atraviesan
 * (`nStories`). Un arco o una cascara curva pasan por la cota de una planta sin
 * que eso sea una union, y partirlos ahi estropea el modelo.
 */
export interface E2kPlanoRef {
  z: number;
}

export interface E2kModel {
  units: { force: string; length: string };
  stories: { name: string; height: number; elev: number }[];
  grids: E2kGrid[];
  /** Los niveles AUXILIARES (`REFERENCEPLANE`). Se dibujan; NO cortan nada. */
  planosRef: E2kPlanoRef[];
  materials: Map<string, { type: string; E: number; G: number; nu: number; fy?: number; fc?: number; density?: number }>;
  frameSections: Map<string, { material: string; shape: string; D: number; B: number; TF: number; TW: number; T?: number; R?: number; fillMaterial?: string; modI2?: number; modI3?: number;
                               /** SHAPE "General": las propiedades vienen escritas (unidades del fichero). */
                               AREA?: number; AS2?: number; AS3?: number; I33?: number; I22?: number; TORSION?: number }>;
  nodes: Node[];
  nodeNames: string[];           // e2k point name → index in nodes[]
  nodeNameToIdx: Map<string, number>;
  elements: Element[];
  elementNames: string[];
  elementTypes: string[];        // "COLUMN" | "BEAM" | "BRACE"
  elementStories: string[];
  elementSections: Map<number, string>;  // elemIdx → section name
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  sectionShapes: Map<number, SectionShape>;
  /**  = las que hay en el fichero ·  = las que llegaron
   *  a ser elementos. Si no coinciden, algo se perdio por el camino. */
  /** Las propiedades de muelle del fichero, por nombre. Ver `e2kMuelles.ts`. */
  springProps: Map<string, { tipo: "point" | "line" | "area"; k: number[] }>;
  info: { nNodes: number; nFrames: number; nAreas: number; nAreasMontadas?: number;
          nSDCompuestas?: number; nSDLeidas?: number;
          /** Trozos del modelo que no llegan a ningun apoyo (ver `piezasFlotantes`). */
          nPiezasFlotantes?: number; nNudosFlotantes?: number;
          title: string };
  /** Raw text blocks from original e2k for round-trip export */
  rawSections?: Map<string, string[]>;
}

export function parseE2k(text: string): E2kModel {
  const lines = text.split(/\r?\n/);

  // State
  const units = { force: "TONF", length: "M" };
  const stories: E2kModel["stories"] = [];
  const materials: E2kModel["materials"] = new Map();
  const frameSections: E2kModel["frameSections"] = new Map();
  /**
   * name → [x, y, dz] en planta. El TERCER numero de un `POINT` es la CAIDA de
   * ese punto por debajo de la cota de su planta, y hasta el 2026-08-28 se
   * ignoraba.
   *
   *     POINT "227"  12.325 4.064 3.288
   *
   * No daba error: colocaba el punto a la cota de la planta y la barra que
   * nacia ahi se quedaba flotando, porque los demas nudos SI estaban donde
   * tocaba. En el edificio real lo llevan 398 de sus 605 puntos.
   */
  const pointCoords = new Map<string, [number, number, number]>();
  const lineConns: { name: string; type: string; pt1: string; pt2: string; nStories: number }[] = [];
  // ── LAS AREAS ────────────────────────────────────────────────────────
  // `areaConns` guardaba los puntos y NO SE USABA para nada mas que contar
  // (`info.nAreas`): el `.e2k` se escribia con sus 900 losas, el parser las
  // VEIA, y al releerlo salian CERO shells — sin espesor, sin tipo de cascara,
  // sin modificadores y sin un solo aviso. El ciclo
  // Hekatan → .e2k → ETABS → .e2k → Hekatan perdia la losa entera y lo unico
  // que se notaba era un modelo mas flojo. Medido el 2026-08-28 con las 4
  // plantillas que llevan area (`cli/roundtrip_areas.mjs`).
  //
  // `dz` son los numeros del final de cada linea AREA: el SALTO DE PLANTA de
  // cada punto (0 = la del assign, 1 = una arriba). Es lo que distingue un
  // PANEL de muro —dos puntos en planta y dos plantas, `1 1 0 0`— de un FLOOR,
  // que los lleva todos a 0.
  const areaConns: { name: string; tipo: string; pts: string[]; dz: number[] }[] = [];
  const areaAssigns = new Map<string, { story: string; section: string; spring?: string }>();
  /** SHELLPROP: espesor (m), material, tipo de cascara y los 8 modificadores. */
  const shellProps = new Map<string, {
    t: number; material: string; modeling: string; mods?: number[];
    /** cotas del DECK en unidades del fichero (tc, hr, wrt, wrb, sr en L; w en F/L²) */
    deck?: { tc: number; hr: number; wrt: number; wrb: number; sr: number; w: number };
  }>();
  /**
   * SECTION DESIGNER: una seccion DIBUJADA, hecha de varias piezas.
   *
   * Su `FRAMESECTION` no trae ni una cota — solo `SHAPE "SD Section"` — y las
   * piezas viven en `$ SECTION DESIGNER SECTIONS`, cada una con su forma, su
   * MATERIAL y su posicion `XC`/`YC`. Sin leerlas, esas barras entraban con
   * area e inercia CERO: sin rigidez, y la matriz salia singular. En el modelo
   * real de `estructura-mixta` son 54 barras — entre ellas la que lleva la
   * MADERA (`DOBLE C_250X50X5mm+MADERA`, cuatro piezas: dos C de acero y dos
   * rectangulos, uno de ellos de otro material).
   */
  const sdShapes = new Map<string, Array<{
    shapeType: string; material: string;
    D: number; B: number; TF: number; TW: number; XC: number; YC: number;
  }>>();
  const restraints = new Map<string, string[]>(); // pointName+story → restrained DOFs
  const lineAssigns = new Map<string, { story: string; section: string; rigidZone: number; releases: string[]; angle: number; spring?: string; mallaEnCruces?: boolean; offsets?: [number, number] }>(); // lineName+story → assignment
  /**
   * Los MUELLES. ETABS los declara como propiedades con nombre y luego los
   * asigna con `SPRINGPROP "..."`. Sin ellos, una cimentación sobre Winkler no
   * llega a ningún apoyo y la matriz sale singular — es lo que le pasaba al
   * edificio real: 45 de sus nudos de cota −1.00 m los sujeta el terreno, no un
   * empotramiento.
   *
   * Las unidades salen del propio fichero (aquí, KGF/M):
   *   POINTSPRING  → fuerza/longitud            (kgf/m)
   *   LINESPRING   → fuerza/longitud POR metro  (kgf/m/m)
   *   AREASPRING   → fuerza/longitud POR m²     (kgf/m/m²)
   *
   * ⚠️ `NONLINEAROPT "Compression Only"` se lee y se IGNORA: esto es un
   * programa lineal, así que el muelle trabaja también a tracción. Es lo que
   * hace ETABS en un caso lineal, y por eso comparan; en no lineal no.
   */
  const springProps = new Map<string, { tipo: "point" | "line" | "area"; k: number[] }>();
  /** `nombreDeNudo@planta` → nombre de la propiedad de muelle asignada. */
  const pointSprings = new Map<string, string>();
  /** Todo joint que el fichero declara con un `POINTASSIGN`, tenga o no apoyo. */
  const puntosDeclarados = new Set<string>();
  const frameLoads: { line: string; story: string; type: string; dir: string; lc: string; val: number }[] = [];
  /**
   * Las cargas de LOSA. Son la mayor parte de la carga de un edificio y no se
   * leian: el modelo real entraba con 48 kN en total cuando sus losas llevan
   * cientos de kgf/m2. Con esa carga los desplazamientos no significan nada.
   *
   * ETABS las escribe de DOS maneras y hay que leer las dos:
   *
   *     AREALOAD "F16" "N+7.10m" TYPE "UNIFF" DIR "GRAV" LC "SCP" FVAL 200
   *     AREALOAD "F1"  "N+3.65m" TYPE "UNIFLOADSET" "CARGAS DE OFICINAS"
   *
   * La segunda no lleva valor: apunta a un JUEGO con nombre, declarado aparte,
   * que puede traer varios patrones a la vez.
   *
   *     SHELLUNIFORMLOADSET "CARGA DE CUBIERTA" LOADPAT "SCP" VALUE 30
   *     SHELLUNIFORMLOADSET "CARGA DE CUBIERTA" LOADPAT "CV"  VALUE 70
   */
  const areaLoads: { area: string; story: string; tipo: string; dir: string;
                     lc: string; val: number; set?: string }[] = [];
  const loadSets = new Map<string, { lc: string; val: number }[]>();
  // POINTLOAD "pt" "story" TYPE "FORCE" LC "Dead" FX .. FY .. FZ .. MX .. MY .. MZ ..
  // Hasta el 2-sep-2026 el parser NO las leia: un e2k con cargas nodales (el
  // modo "manual" del exportador, o cualquier ETABS con cargas puntuales)
  // entraba a Hekatan SIN carga y el ciclo e2k -> Hekatan -> e2k las perdia.
  const pointLoads: { pt: string; story: string; lc: string; v: number[] }[] = [];
  // LOADPATTERN "Dead" TYPE "Dead" SELFWEIGHT 1 -> el peso propio lo calcula
  // ETABS. Hasta el 2-sep-2026 el parser lo ignoraba: un e2k en modo "auto"
  // entraba a Hekatan sin el peso de la estructura (mezanine: 2252 de 3473 kN).
  let selfWeightMult = 0;
  const grids: E2kGrid[] = [];
  const planosRef: E2kPlanoRef[] = [];
  let title = "";

  let currentSection = "";

  // Capture raw lines for sections we can't reconstruct perfectly
  const rawSections = new Map<string, string[]>();
  const capturedSectionNames = [
    "PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP",
    "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS",
    "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS",
    "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES",
    "LINE CONNECTIVITIES", "AREA CONNECTIVITIES",
    "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS",
    "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS",
    "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE",
    "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS",
  ];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("$")) {
      if (line.startsWith("$ ")) currentSection = line.substring(2).trim();
      continue;
    }
    // Capture raw line for current section
    if (currentSection) {
      if (!rawSections.has(currentSection)) rawSections.set(currentSection, []);
      rawSections.get(currentSection)!.push(rawLine);
    }

    // ── CONTROLS ──
    if (currentSection === "CONTROLS") {
      const um = line.match(/UNITS\s+"([^"]+)"\s+"([^"]+)"/);
      if (um) { units.force = um[1]; units.length = um[2]; }
      const tm = line.match(/TITLE2\s+"([^"]+)"/);
      if (tm) title = tm[1];
    }

    // ── STORIES ──
    if (currentSection === "STORIES - IN SEQUENCE FROM TOP") {
      const sm = line.match(/STORY\s+"([^"]+)"\s+(?:HEIGHT\s+([\d.]+)|ELEV\s+([-\d.]+))/);
      if (sm) {
        const name = sm[1];
        const height = sm[2] ? parseFloat(sm[2]) : 0;
        const elev = sm[3] ? parseFloat(sm[3]) : undefined;
        stories.push({ name, height, elev: elev ?? 0 });
      }
    }

    // ── MATERIAL PROPERTIES ──
    if (currentSection === "MATERIAL PROPERTIES") {
      const mm = line.match(/MATERIAL\s+"([^"]+)"\s+(?:TYPE\s+"([^"]+)")?/);
      if (mm) {
        const name = mm[1];
        if (!materials.has(name)) materials.set(name, { type: mm[2] || "", E: 0, G: 0, nu: 0 });
        const mat = materials.get(name)!;
        if (mm[2]) mat.type = mm[2];
        const eMatch = line.match(/\bE\s+([\d.eE+-]+)/);
        if (eMatch) mat.E = parseFloat(eMatch[1]);
        const uMatch = line.match(/\bU\s+([\d.eE+-]+)/);
        if (uMatch) { mat.nu = parseFloat(uMatch[1]); mat.G = mat.E / (2 * (1 + mat.nu)); }
        const fyMatch = line.match(/\bFY\s+([\d.eE+-]+)/);
        if (fyMatch) mat.fy = parseFloat(fyMatch[1]);
        const fcMatch = line.match(/\bFC\s+([\d.eE+-]+)/);
        if (fcMatch) mat.fc = parseFloat(fcMatch[1]);
        const wMatch = line.match(/WEIGHTPERVOLUME\s+([\d.eE+-]+)/);
        if (wMatch) mat.density = parseFloat(wMatch[1]);
      }
    }

    // ── FRAME SECTIONS ──
    if (currentSection === "FRAME SECTIONS") {
      const fsm = line.match(/FRAMESECTION\s+"([^"]+)"/);
      if (fsm) {
        const name = fsm[1];
        if (!frameSections.has(name)) frameSections.set(name, { material: "", shape: "", D: 0, B: 0, TF: 0, TW: 0 });
        const sec = frameSections.get(name)!;
        const matM = line.match(/MATERIAL\s+"([^"]+)"/);
        if (matM) sec.material = matM[1];
        const shM = line.match(/SHAPE\s+"([^"]+)"/);
        if (shM) sec.shape = shM[1];
        const dM = line.match(/\bD\s+([\d.eE+-]+)/);
        if (dM) sec.D = parseFloat(dM[1]);
        const bM = line.match(/\bB\s+([\d.eE+-]+)/);
        if (bM) sec.B = parseFloat(bM[1]);
        const tfM = line.match(/\bTF\s+([\d.eE+-]+)/);
        if (tfM) sec.TF = parseFloat(tfM[1]);
        const twM = line.match(/\bTW\s+([\d.eE+-]+)/);
        if (twM) sec.TW = parseFloat(twM[1]);
        const rM = line.match(/\bR\s+([\d.eE+-]+)/);
        if (rM) sec.R = parseFloat(rM[1]);
        const fillM = line.match(/FILLMATERIAL\s+"([^"]+)"/);
        if (fillM) sec.fillMaterial = fillM[1];
        const i2M = line.match(/I2MOD\s+([\d.eE+-]+)/);
        if (i2M) sec.modI2 = parseFloat(i2M[1]);
        const i3M = line.match(/I3MOD\s+([\d.eE+-]+)/);
        if (i3M) sec.modI3 = parseFloat(i3M[1]);
        // SHAPE "General" (lo que escribe Hekatan y lo que ETABS escribe para
        // Section Designer/CFT): A, As2, As3, I33, I22 y J vienen EN EL FICHERO.
        // Hasta el 2-sep-2026 se ignoraban y la seccion se rehacia como un
        // rectangulo D x B: el COL-CFT del galpon entraba con A = 0.0121 en vez
        // de 0.00979 e I = 6e-5 en vez de 4.8e-5.
        for (const [k, re] of [["AREA", /\bAREA\s+([\d.eE+-]+)/], ["AS2", /\bAS2\s+([\d.eE+-]+)/], ["AS3", /\bAS3\s+([\d.eE+-]+)/],
                               ["I33", /\bI33\s+([\d.eE+-]+)/], ["I22", /\bI22\s+([\d.eE+-]+)/], ["TORSION", /\bTORSION\s+([\d.eE+-]+)/]] as const) {
          const mm = line.match(re);
          if (mm) (sec as any)[k] = parseFloat(mm[1]);
        }
        // ⚠️ Un perfil CONFORMADO EN FRIO no trae `TF`/`TW`: trae un espesor
        // unico `T` y el labio `LIP`. Se leia solo TF/TW, salian 0, y el area
        // y las inercias tambien — la barra entraba en el modelo SIN RIGIDEZ y
        // la matriz salia singular. Medido en el modelo real de
        // `estructura-mixta` (2026-08-28): `TR_100X400X4mm` es
        // `D 0.4 B 0.1 T 0.004 LIP 0.195`.
        const tM = line.match(/\bT\s+([\d.eE+-]+)/);
        if (tM && !sec.TF && !sec.TW) { sec.TF = parseFloat(tM[1]); sec.TW = parseFloat(tM[1]); }
        const lipM = line.match(/\bLIP\s+([\d.eE+-]+)/);
        if (lipM) (sec as any).LIP = parseFloat(lipM[1]);
      }
    }

    // ── POINT COORDINATES ──
    if (currentSection === "POINT COORDINATES") {
      const pm = line.match(/POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)(?:\s+([-\d.eE+]+))?/);
      if (pm) pointCoords.set(pm[1],
        [parseFloat(pm[2]), parseFloat(pm[3]), parseFloat(pm[4] ?? "0") || 0]);
    }

    // ── LINE CONNECTIVITIES ──
    if (currentSection === "LINE CONNECTIVITIES") {
      const lm = line.match(/LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
      if (lm) lineConns.push({ name: lm[1], type: lm[2], pt1: lm[3], pt2: lm[4], nStories: parseInt(lm[5]) });
    }

    // ── POINT ASSIGNS ──
    if (currentSection === "POINT ASSIGNS") {
      const rm = line.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*RESTRAINT\s+"([^"]+)"/);
      if (rm) restraints.set(`${rm[1]}@${rm[2]}`, rm[3].split(/\s+/));
      // TODO `POINTASSIGN` declara un JOINT, traiga o no un RESTRAINT. La
      // mayoria dicen solo `USERJOINT "Yes"`: son puntos que el proyectista
      // puso a mano y que ETABS tiene en su modelo aunque ningun elemento los
      // nombre todavia. Sin leerlos faltaban 12 de los 787 joints del edificio
      // real — y no por un fallo de geometria, sino porque no existian.
      const pj = line.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)"/);
      if (pj) puntosDeclarados.add(`${pj[1]}@${pj[2]}`);
      const pm = line.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*SPRINGPROP\s+"([^"]+)"/);
      if (pm) pointSprings.set(`${pm[1]}@${pm[2]}`, pm[3]);
    }

    // ── MUELLES: las propiedades, vengan de la seccion que vengan ──
    // Van FUERA de los `if (currentSection === ...)` a proposito: cada tipo
    // esta en su propio bloque del fichero, y la regex ya es especifica.
    {
      const spm = line.match(/(POINTSPRING|LINESPRING|AREASPRING)\s+"([^"]+)"/);
      if (spm) {
        const tipo = spm[1] === "POINTSPRING" ? "point"
                   : spm[1] === "LINESPRING" ? "line" : "area";
        const k = springProps.get(spm[2])?.k ?? [0, 0, 0, 0, 0, 0];
        // UX/UY/UZ en los de punto (GLOBALES); U1/U2/U3 en los de linea y area
        // (LOCALES del elemento). R* para los de giro.
        const gdl: Record<string, number> = { UX: 0, UY: 1, UZ: 2, U1: 0, U2: 1, U3: 2,
                                              RX: 3, RY: 4, RZ: 5, R1: 3, R2: 4, R3: 5 };
        for (const mm of line.matchAll(/(UX|UY|UZ|U1|U2|U3|RX|RY|RZ|R1|R2|R3)\s+([\d.eE+-]+)/g)) {
          const i = gdl[mm[1]];
          if (i !== undefined) k[i] = parseFloat(mm[2]);
        }
        springProps.set(spm[2], { tipo, k });
      }
    }

    // ── LINE ASSIGNS ──
    if (currentSection === "LINE ASSIGNS") {
      const lam = line.match(/LINEASSIGN\s+"([^"]+)"\s+"([^"]+)".*SECTION\s+"([^"]+)"/);
      if (lam) {
        const entry: typeof lineAssigns extends Map<string, infer V> ? V : never = {
          story: lam[2], section: lam[3], rigidZone: 0, releases: [], angle: 0,
        };
        const rzm = line.match(/RIGIDZONE\s+([\d.eE+-]+)/);
        if (rzm) entry.rigidZone = parseFloat(rzm[1]);
        // LENGTHOFFI/J: las longitudes del brazo (unidades del fichero). Van a
        // `endOffsets` [offI, offJ, rz]: con rz = 0 no rigidizan, pero la viga
        // PESA por su luz libre (ETABS no pesa el brazo rigido).
        const loi = line.match(/LENGTHOFFI\s+([\d.eE+-]+)/); const loj = line.match(/LENGTHOFFJ\s+([\d.eE+-]+)/);
        if (loi || loj) entry.offsets = [loi ? parseFloat(loi[1]) : 0, loj ? parseFloat(loj[1]) : 0];
        const relm = line.match(/RELEASE\s+"([^"]+)"/);
        if (relm) entry.releases = relm[1].split(/\s+/);
        const angm = line.match(/ANG\s+([-\d.eE+]+)/);
        if (angm) entry.angle = parseFloat(angm[1]);
        const spr = line.match(/SPRINGPROP\s+"([^"]+)"/);
        if (spr) entry.spring = spr[1];
        // `MESHATINTERSECTIONS "YES"` es la orden de ETABS de crear un nudo
        // donde esta barra cruza a otra. Sin leerla, las vigas secundarias
        // entran enteras y quedan flotando (ver `e2kCoser`).
        entry.mallaEnCruces = /MESHATINTERSECTIONS\s+"?YES/i.test(line);
        lineAssigns.set(`${lam[1]}@${lam[2]}`, entry);
      }
    }

    // ── GRIDS ──
    if (currentSection === "GRIDS") {
      const gm = line.match(/^\s*GRID\s+"[^"]+"\s+LABEL\s+"([^"]+)"\s+DIR\s+"([XY])"\s+COORD\s+([-\d.eE+]+)/);
      if (gm) {
        grids.push({ label: gm[1], dir: gm[2] as "X" | "Y", coord: parseFloat(gm[3]) });
      }
      // Los NIVELES AUXILIARES. Se leen para poder dibujarlos, y punto: no
      // entran en `stories` a proposito, porque lo que esta en `stories` es lo
      // que parte las columnas.
      const rp = line.match(/^\s*REFERENCEPLANE\s.*\sZ\s+([-\d.eE+]+)/);
      if (rp) planosRef.push({ z: parseFloat(rp[1]) });
    }

    // ── FRAME OBJECT LOADS ──
    if (currentSection === "FRAME OBJECT LOADS") {
      const flm = line.match(/LINELOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      if (flm) {
        frameLoads.push({
          line: flm[1], story: flm[2], type: flm[3], dir: flm[4],
          lc: flm[5], val: parseFloat(flm[6]),
        });
      }
    }

    // ── SHELL UNIFORM LOAD SETS ──
    // Los juegos de carga con nombre a los que apunta un AREALOAD UNIFLOADSET.
    {
      const sm = line.match(/SHELLUNIFORMLOADSET\s+"([^"]+)"\s+LOADPAT\s+"([^"]+)"\s+VALUE\s+([-\d.eE+]+)/);
      if (sm) {
        if (!loadSets.has(sm[1])) loadSets.set(sm[1], []);
        loadSets.get(sm[1])!.push({ lc: sm[2], val: parseFloat(sm[3]) });
      }
    }

    // ── LOAD PATTERNS: peso propio ──
    if (currentSection === "LOAD PATTERNS") {
      const lp = line.match(/LOADPATTERN\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+SELFWEIGHT\s+([\d.eE+-]+)/);
      if (lp && /dead/i.test(lp[2])) selfWeightMult = Math.max(selfWeightMult, parseFloat(lp[3]));
    }

    // ── POINT OBJECT LOADS ──
    if (currentSection === "POINT OBJECT LOADS") {
      // Las componentes van POR NOMBRE: ETABS solo escribe las que no son cero
      // (`FZ -10793.023  MX -884914.3`). Con las seis obligatorias en su orden,
      // el e2k que exporta ETABS entraba a Hekatan sin UNA sola carga puntual
      // (bóveda, 13-sep-2026: 135 de 135 perdidas).
      const pl = line.match(/POINTLOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"FORCE"\s+LC\s+"([^"]+)"(.*)$/);
      if (pl) {
        const comp = (k: string) => {
          const m = pl[4].match(new RegExp(`\\b${k}\\s+([-\\d.eE+]+)`));
          return m ? parseFloat(m[1]) : 0;
        };
        pointLoads.push({ pt: pl[1], story: pl[2], lc: pl[3],
                          v: ["FX", "FY", "FZ", "MX", "MY", "MZ"].map(comp) });
      }
    }

    // ── SHELL OBJECT LOADS ──
    if (currentSection === "SHELL OBJECT LOADS") {
      const au = line.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFF"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      if (au) {
        areaLoads.push({ area: au[1], story: au[2], tipo: "UNIFF", dir: au[3],
                         lc: au[4], val: parseFloat(au[5]) });
      } else {
        const as2 = line.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFLOADSET"\s+"([^"]+)"/);
        if (as2) areaLoads.push({ area: as2[1], story: as2[2], tipo: "UNIFLOADSET",
                                  dir: "GRAV", lc: "", val: 0, set: as2[3] });
      }
    }

    // ── AREA CONNECTIVITIES ──
    if (currentSection === "AREA CONNECTIVITIES") {
      // ETABS: AREA "F1" FLOOR 4 "1" "6" "7" "2" 0 0 0 0  (tipo FLOOR/PANEL/RAMP
      // OPCIONAL entre el nombre y el contador). El regex anterior exigía un dígito
      // justo tras el nombre → no matcheaba NINGÚN área con tipo (losas/muros reales).
      const am = line.match(/AREA\s+"([^"]+)"\s+(?:([A-Za-z]\w*)\s+)?\d+\s+(.+)/);
      if (am) {
        const pts = am[3].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, "")) || [];
        // Lo que queda DESPUES de las comillas son los saltos de planta, uno
        // por punto y en el mismo orden.
        const dz = (am[3].replace(/"[^"]*"/g, " ").trim().split(/\s+/)
          .filter(Boolean).map(Number).filter(v => Number.isFinite(v)));
        areaConns.push({ name: am[1], tipo: am[2] || "FLOOR", pts,
                         dz: dz.length === pts.length ? dz : pts.map(() => 0) });
      }
    }

    // ── SECTION DESIGNER: las piezas de una seccion dibujada ──
    // La primera linea de cada seccion es la cabecera (`TYPE "FRAME"
    // NUMSHAPES n`) y no lleva `SHAPETYPE`: se salta sola.
    if (line.startsWith("SDSECTION")) {
      const nm = line.match(/SDSECTION\s+"([^"]+)"/)?.[1];
      const st = line.match(/SHAPETYPE\s+"([^"]+)"/)?.[1];
      if (nm && st) {
        const num = (re: RegExp) => { const m = line.match(re); return m ? parseFloat(m[1]) : 0; };
        if (!sdShapes.has(nm)) sdShapes.set(nm, []);
        sdShapes.get(nm)!.push({
          shapeType: st,
          material: line.match(/MATERIAL\s+"([^"]+)"/)?.[1] ?? "",
          D: num(/\bD\s+([\d.eE+-]+)/), B: num(/\bB\s+([\d.eE+-]+)/),
          TF: num(/\bTF\s+([\d.eE+-]+)/), TW: num(/\bTW\s+([\d.eE+-]+)/),
          XC: num(/\bXC\s+(-?[\d.eE+-]+)/), YC: num(/\bYC\s+(-?[\d.eE+-]+)/),
        });
      }
    }

    // ── AREA ASSIGNS: que SECCION lleva cada area, y en que planta ──
    if (currentSection === "AREA ASSIGNS") {
      const aa = line.match(/AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION\s+"([^"]+)"/);
      if (aa) areaAssigns.set(aa[1], { story: aa[2], section: aa[3],
        spring: line.match(/SPRINGPROP\s+"([^"]+)"/)?.[1] });
    }

    // ── SHELLPROP: las propiedades de losa, muro y deck ──
    // Van en bloques distintos segun el tipo (`$ SLAB PROPERTIES`,
    // `$ WALL PROPERTIES`, `$ DECK PROPERTIES`), asi que se mira la LINEA, no
    // la seccion. Y ETABS escribe DOS lineas con el mismo nombre: la de la
    // propiedad y otra solo con los modificadores, que omite los que valen 1.
    if (line.startsWith("SHELLPROP")) {
      const nm = line.match(/SHELLPROP\s+"([^"]+)"/)?.[1];
      if (nm) {
        const num = (re: RegExp) => {
          const m = line.match(re); return m ? parseFloat(m[1]) : undefined;
        };
        const esp = num(/SLABTHICKNESS\s+([\d.eE+-]+)/) ??
                    num(/WALLTHICKNESS\s+([\d.eE+-]+)/) ??
                    // Un DECK: la membrana es SOLO la loseta tc (DECKSLABDEPTH), sin el
                    // nervio. MEDIDO en ETABS 22 (13-sep-2026): un deck Filled tc 65 /
                    // hr 55 se desplaza en su plano igual que una membrana de 65 mm, y
                    // GetDeck devuelve 0.065. Antes se tomaba tc + hr: más rígido.
                    num(/DECKSLABDEPTH\s+([\d.eE+-]+)/);
        const esDeck = /PROPTYPE\s+"Deck"/.test(line);
        const deck = esDeck ? {
          tc: num(/DECKSLABDEPTH\s+([\d.eE+-]+)/) ?? 0, hr: num(/DECKRIBDEPTH\s+([\d.eE+-]+)/) ?? 0,
          wrt: num(/DECKRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0, wrb: num(/DECKRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0,
          sr: num(/DECKRIBSPACING\s+([\d.eE+-]+)/) ?? 0, w: num(/DECKUNITWEIGHT\s+([\d.eE+-]+)/) ?? 0,
        } : undefined;
        const MODS = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD",
                      "M12MOD", "V13MOD", "V23MOD"];
        const leidos = MODS.map(k => num(new RegExp(k + "\\s+([\\d.eE+-]+)")));
        const prev = shellProps.get(nm);
        if (leidos.some(v => v !== undefined)) {
          // Linea de modificadores: completa la propiedad ya leida.
          const mods = leidos.map(v => v ?? 1);
          shellProps.set(nm, { t: prev?.t ?? 0, material: prev?.material ?? "",
                               modeling: prev?.modeling ?? "ShellThin", mods, deck: prev?.deck });
        } else if (esp !== undefined) {
          shellProps.set(nm, {
            t: esp, mods: prev?.mods, deck: deck ?? prev?.deck,
            material: line.match(/MATERIAL\s+"([^"]+)"/)?.[1] ??
                      line.match(/CONCMATERIAL\s+"([^"]+)"/)?.[1] ?? "",
            modeling: line.match(/MODELINGTYPE\s+"([^"]+)"/)?.[1] ??
                      (/PROPTYPE\s+"Deck"/.test(line) ? "Membrane" : "ShellThin"),
          });
        }
      }
    }
  }

  // ── Compute story elevations ──
  // Stories are listed top-to-bottom in the file. Each story's HEIGHT is
  // the floor-to-floor distance from the story below to this story.
  // The last story ("Base") has an absolute ELEV.
  // Elevation of story[i] = elevation of story[i+1] + height of story[i]
  const storyElevs = new Map<string, number>();
  if (stories.length > 0) {
    // Base story has its absolute elevation
    const baseIdx = stories.length - 1;
    storyElevs.set(stories[baseIdx].name, stories[baseIdx].elev);
    // Accumulate upward: each story's elev = story_below.elev + this_story.height
    for (let i = baseIdx - 1; i >= 0; i--) {
      const belowElev = storyElevs.get(stories[i + 1].name)!;
      const thisElev = belowElev + stories[i].height;
      stories[i].elev = thisElev;
      storyElevs.set(stories[i].name, thisElev);
    }
  }

  // ── Build 3D nodes & elements ──
  // ETABS POINT COORDINATES are 2D plan (X, Y). 3D position depends on story.
  // For COLUMN/BRACE at story S with nStories N:
  //   bottom node (pt1) at elevation of story N levels below S
  //   top node (pt2) at elevation of story S
  // For BEAM at story S: both nodes at elevation of story S
  const nodes: Node[] = [];
  const nodeNames: string[] = [];
  const nodeNameToIdx = new Map<string, number>();

  const nodeKey = (pt: string, story: string) => `${pt}@${story}`;
  const allNodeKeys = new Set<string>();

  // Build a lookup: line name → lineConn (for nStories access)
  const lineConnMap = new Map<string, typeof lineConns[0]>();
  for (const lc of lineConns) lineConnMap.set(lc.name, lc);

  // Collect all unique (point, story) pairs needed
  for (const lc of lineConns) {
    for (const [key, la] of lineAssigns) {
      if (!key.startsWith(lc.name + "@")) continue;
      const story = la.story;
      const storyIdx = stories.findIndex(s => s.name === story);
      if (storyIdx < 0) continue;

      if (lc.type === "COLUMN" || lc.type === "BRACE") {
        // Top node at this story's elevation
        allNodeKeys.add(nodeKey(lc.pt2, story));
        // Bottom node at nStories levels below this story
        // ⚠️ `nStories 0` significa LAS DOS CARAS EN LA MISMA PLANTA, no «una
        // por debajo». Aqui habia un `Math.max(nStories, 1)` que forzaba a
        // bajar un piso entero: la diagonal `D15` acababa en z = -1.83 cuando
        // ETABS la tiene en 1.62 (comprobado joint a joint por OAPI), su nudo
        // inferior no lo compartia nadie y el modelo entero salia SINGULAR por
        // ella. Lo llevan 16 BRACE y 3 COLUMN del edificio real; la diferencia
        // de cota entre las dos caras ya la pone la CAIDA de cada punto.
        const bottomIdx = Math.min(storyIdx + lc.nStories, stories.length - 1);
        allNodeKeys.add(nodeKey(lc.pt1, stories[bottomIdx].name));
        // ── Y las plantas de en medio ──
        //
        // Una `LINE ... COLUMN` puede ser una columna entera de cuatro pisos
        // (`nStories 4`). ETABS NO la analiza asi: la parte en cada planta que
        // atraviesa y pone un joint. Traerla de una pieza deja sin existir los
        // nudos donde acometen las vigas de esos pisos, y ahi es donde se
        // quedaban trozos del modelo flotando.
        //
        // ⚠️ Esto se hace SOLO con las columnas y solo por los pisos que el
        // propio fichero dice que atraviesan (`nStories`). No se corta por
        // «todas las plantas todo lo que suba»: un arco o una cascara curva
        // atraviesan cotas de planta sin que eso sea una union, y cortarlos ahi
        // estropea el modelo en vez de arreglarlo. ETABS tampoco lo hace.
        for (let k = storyIdx + 1; k < bottomIdx; k++)
          allNodeKeys.add(nodeKey(lc.pt1, stories[k].name));
      } else {
        // BEAM: both nodes at this story's elevation
        allNodeKeys.add(nodeKey(lc.pt1, story));
        allNodeKeys.add(nodeKey(lc.pt2, story));
      }
    }
  }

  // Also from restraints
  for (const [key] of restraints) {
    allNodeKeys.add(key);
  }
  // Y de TODOS los `POINTASSIGN`. Algunos no los toca ningun elemento; se
  // quedan huerfanos y el propio solver los aparta antes de resolver, pero
  // TIENEN que existir: son joints del modelo de ETABS, y sin ellos la
  // comparacion nudo a nudo miente por 12.
  for (const key of puntosDeclarados) allNodeKeys.add(key);

  // ── Nudos de las AREAS ──
  // Cada punto del area vive en la planta del assign MAS su salto `dz`. Las
  // plantas van de arriba abajo en el fichero, asi que subir una planta es
  // RESTAR uno al indice.
  //
  // `dz` cuenta plantas HACIA ABAJO desde la del AREAASSIGN. MEDIDO, no
  // supuesto: el `.e2k` trae
  //     AREA "W901" PANEL 4 "1" "2" "2" "1"  1 1 0 0
  //     AREAASSIGN "W901" "Level_1"            (Level_1 esta en Z = 3.5)
  // y ETABS coloca ese muro entre **Z = 0.0 y 3.5**, o sea que los puntos con
  // `dz = 1` caen en la Base — una planta por DEBAJO.
  //
  // Como `stories` viene de arriba abajo, bajar es SUMAR al indice. Con el
  // signo cambiado los 10 muros de la ultima planta se salian del array y se
  // perdian, y los otros 30 se montaban una planta MAS ARRIBA de donde van.
  const storyDe = (story: string, dz: number) => {
    const i = stories.findIndex(s => s.name === story);
    if (i < 0) return undefined;
    const j = i + (dz || 0);
    if (j < 0 || j > stories.length - 1) return undefined;   // fuera del edificio
    return stories[j].name;
  };
  for (const ac of areaConns) {
    const aa = areaAssigns.get(ac.name);
    if (!aa) continue;
    ac.pts.forEach((pt, k) => {
      const st = storyDe(aa.story, ac.dz[k] ?? 0);
      if (st) allNodeKeys.add(nodeKey(pt, st));
    });
  }

  /** Nudo → nombre de la propiedad de muelle de PUNTO. */
  const nodeSprings = new Map<number, string>();
  // Create nodes — deduplicate by (point, story) key
  for (const nk of allNodeKeys) {
    const [pt, story] = nk.split("@");
    const xy = pointCoords.get(pt);
    const elev = storyElevs.get(story);
    if (xy === undefined || elev === undefined) continue;
    // La caida del punto se RESTA de la cota de su planta.
    nodes.push([xy[0], xy[1], elev - (xy[2] ?? 0)]);
    nodeNames.push(nk);
    nodeNameToIdx.set(nk, nodes.length - 1);
    const ps = pointSprings.get(nk);
    if (ps) nodeSprings.set(nodes.length - 1, ps);
  }

  // ── Build elements ──
  const elements: Element[] = [];
  const elementNames: string[] = [];
  const elementTypes: string[] = [];
  const elementStoriesArr: string[] = [];
  const elementSections = new Map<number, string>();
  /**
   * Elemento → nombre de la propiedad de muelle asignada (`SPRINGPROP`).
   *
   * Se guarda el NOMBRE y no la rigidez ya repartida a nudos a proposito: un
   * muelle de linea vale «tanto por metro» y un muelle de area «tanto por m²»,
   * asi que el reparto depende de la LONGITUD o el AREA del elemento — y esos
   * cambian cuando se cose el modelo (`e2kCoser` parte las barras). Repartirlo
   * aqui daria muelles de la geometria vieja.
   */
  const springAssigns = new Map<number, string>();
  /** Elemento → lleva `MESHATINTERSECTIONS "YES"`. Lo usa `e2kCoser`. */
  const mallaEnCruces = new Map<number, boolean>();
  // Declarados ANTES del loop: el loop los puebla (rigidZone/releases). Estaban
  // más abajo y daban TDZ "Cannot access 'rigidOffsets' before initialization"
  // al parsear cualquier e2k con brazos rígidos o liberaciones (ej. BARRIO CENTRAL).
  const rigidOffsets = new Map<number, [number, number]>();
  const momentReleases = new Map<number, boolean[]>();
  // `ANG` de la LINEASSIGN: el local axis angle de CSI. Se leia (entry.angle)
  // pero NO se emitia: las 156 barras giradas del galpon (cordones en C,
  // diagonales 2L) entraban sin girar y el modelo importado salia 2x mas rigido.
  const localAngles = new Map<number, number>();
  const endOffsets = new Map<number, [number, number, number]>();

  for (const lc of lineConns) {
    for (const [key, la] of lineAssigns) {
      if (!key.startsWith(lc.name + "@")) continue;
      const story = la.story;
      const storyIdx = stories.findIndex(s => s.name === story);
      if (storyIdx < 0) continue;

      // ── La CADENA de nudos de este objeto, de abajo arriba ──
      //
      // Una viga son dos nudos. Una columna con `nStories 4` **no es una
      // barra**: ETABS la parte en cada planta que atraviesa y pone un joint,
      // que es donde acometen las vigas de esos pisos. Traerla entera dejaba
      // esos nudos sin existir y el modelo con trozos flotando.
      //
      // ⚠️ Solo las COLUMNAS, y solo por los pisos que el fichero dice
      // (`nStories`). Aqui NO se corta «por todas las plantas todo lo que
      // suba»: un arco o una cascara curva atraviesan cotas de planta sin que
      // eso sea una union, y partirlos ahi ESTROPEA el modelo. ETABS tampoco
      // lo hace: sus niveles auxiliares no cortan lo que no es de planta.
      const cadenaKeys: string[] = [];
      if (lc.type === "COLUMN" || lc.type === "BRACE") {
        // `nStories 0` = las dos caras en la misma planta (ver arriba).
        const bottomIdx = Math.min(storyIdx + lc.nStories, stories.length - 1);
        // `stories` va de arriba abajo: del indice grande (abajo) al pequeño.
        for (let k = bottomIdx; k > storyIdx; k--)
          cadenaKeys.push(nodeKey(lc.pt1, stories[k].name));
        cadenaKeys.push(nodeKey(lc.pt2, story));            // el de arriba
      } else {
        cadenaKeys.push(nodeKey(lc.pt1, story), nodeKey(lc.pt2, story));
      }
      // Los nudos que no existan (no todas las plantas tienen ese punto) se
      // saltan: la cadena se cierra por los que si estan.
      const cadena = cadenaKeys.map((k) => nodeNameToIdx.get(k))
                               .filter((v): v is number => v !== undefined);
      if (cadena.length < 2) continue;

      const releaseMap: Record<string, number> = {
        "PI": 0,  "V2I": 1,  "V3I": 2,  "TI": 3,  "M2I": 4,  "M3I": 5,
        "PJ": 6,  "V2J": 7,  "V3J": 8,  "TJ": 9,  "M2J": 10, "M3J": 11,
      };
      for (let t = 0; t < cadena.length - 1; t++) {
        const i1 = cadena[t], i2 = cadena[t + 1];
        if (i1 === i2) continue;
        const elemIdx = elements.length;
        elements.push([i1, i2]);
        elementNames.push(cadena.length > 2 ? `${lc.name}-${t + 1}` : lc.name);
        elementTypes.push(lc.type);
        elementStoriesArr.push(story);
        elementSections.set(elemIdx, la.section);
        if (la.spring) springAssigns.set(elemIdx, la.spring);
        if (la.mallaEnCruces) mallaEnCruces.set(elemIdx, true);
        if (la.rigidZone > 0) rigidOffsets.set(elemIdx, [la.rigidZone, la.rigidZone]);
        if (la.angle) localAngles.set(elemIdx, la.angle);
        if (la.offsets) endOffsets.set(elemIdx, [la.offsets[0], la.offsets[1], la.rigidZone]);
        // Releases (12: FxI,FyI,FzI,TI,M2I,M3I, FxJ,FyJ,FzJ,TJ,M2J,M3J).
        // ⚠️ El de la cara I va SOLO en el primer tramo y el de la J SOLO en el
        // ultimo: copiarlos a los tres tramos de una columna de cuatro pisos
        // serian dos rotulas internas de mas, o sea un mecanismo.
        if (la.releases.length > 0) {
          const rel: boolean[] = new Array(12).fill(false);
          for (const r of la.releases) {
            const idx = releaseMap[r];
            if (idx === undefined) continue;
            if (idx < 6 && t !== 0) continue;
            if (idx >= 6 && t !== cadena.length - 2) continue;
            rel[idx] = true;
          }
          if (rel.some(Boolean)) momentReleases.set(elemIdx, rel);
        }
      }
    }
  }

  // ── Build element inputs (properties) ──
  const elasticities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const shearAreasY = new Map<number, number>();
  const shearAreasZ = new Map<number, number>();
  const momentsOfInertiaZ = new Map<number, number>();
  const momentsOfInertiaY = new Map<number, number>();
  const torsionalConstants = new Map<number, number>();
  const sectionShapes = new Map<number, SectionShape>();
  let sdCompuestas = 0;

  for (const [elemIdx, secName] of elementSections) {
    const sec = frameSections.get(secName);
    if (!sec) continue;
    const mat = materials.get(sec.material);
    if (mat) {
      elasticities.set(elemIdx, mat.E);
      shearModuli.set(elemIdx, mat.G);
    }

    // Compute section properties from dimensions
    const D = sec.D, B = sec.B, tf = sec.TF, tw = sec.TW;
    let A = 0, Iz = 0, Iy = 0, J = 0, AsY = 0, AsZ = 0;
    let shapeType: SectionShape["type"] = "rect";
    let fillE = 0;   // CFT: E del relleno, para que el s2k salga como Section Designer
    let esPipeRelleno = false;
    // ⚠️ Bandera, NO `break`: esto vive dentro de un `for...of` sobre TODAS las
    // secciones, asi que un `break` no saltaria el switch — cortaria el bucle
    // entero y dejaria sin propiedades a todas las barras siguientes.
    let compuesta = false;

    // ── SECTION DESIGNER: la seccion se COMPONE de sus piezas ───────────
    //
    // Cada pieza aporta su area y su inercia trasladadas al centro de la
    // seccion (Steiner), y ponderadas por su modulo: una pieza de madera y una
    // de acero en la misma seccion no cuentan igual. Es la SECCION
    // TRANSFORMADA de toda la vida, con el material de la `FRAMESECTION` de
    // referencia:  n_i = E_i / E_ref.
    //
    // Sin esto esas barras entraban con A = I = 0, o sea SIN RIGIDEZ, y la
    // matriz salia singular. 54 barras del modelo real de `estructura-mixta`.
    const piezas = sdShapes.get(secName);
    if (sec.shape === "SD Section" && piezas?.length) {
      // Se delega en `sectionDesigner`, que es el modulo compartido: las mismas
      // cuentas valen para leer un `.e2k` y para una seccion dibujada a mano.
      // Antes habia aqui una version casera que solo sabia de tres formas.
      const Eref = mat?.E || materials.get(sec.material)?.E || 0;
      const lista: PiezaSD[] = [];
      for (const q of piezas) {
        const forma = formaDesdeE2k(q.shapeType, q.D, q.B, q.TF, q.TW);
        if (!forma) continue;
        lista.push({ forma, xc: q.XC, yc: q.YC, E: materials.get(q.material)?.E || Eref });
      }
      if (lista.length) {
        const pr = propiedadesSD(lista, Eref);
        if (pr.A > 0) {
          A = pr.A; Iz = pr.Iz; Iy = pr.Iy; J = pr.J;
          AsY = pr.As2; AsZ = pr.As3;
          shapeType = "rect";
          compuesta = true;
          sdCompuestas++;
        }
      }
    }

    if (!compuesta) switch (sec.shape) {
      case "Concrete Rectangular":
        A = D * B;
        Iz = B * D ** 3 / 12;
        Iy = D * B ** 3 / 12;
        J = (B * D ** 3) * (1/3 - 0.21 * (D/B) * (1 - D**4 / (12 * B**4)));
        AsY = AsZ = 5 / 6 * A; // rectangular shear area factor
        shapeType = "rect";
        break;
      case "Concrete Circle":
        A = Math.PI * D ** 2 / 4;
        Iz = Iy = Math.PI * D ** 4 / 64;
        J = Math.PI * D ** 4 / 32;
        AsY = AsZ = 0.9 * A; // circular shear area factor ~0.9
        shapeType = "circ";
        break;
      case "Steel I/Wide Flange":
        A = 2 * B * tf + (D - 2 * tf) * tw;
        Iz = (B * D ** 3 - (B - tw) * (D - 2 * tf) ** 3) / 12;
        Iy = (2 * tf * B ** 3 + (D - 2 * tf) * tw ** 3) / 12;
        J = (2 * B * tf ** 3 + (D - 2 * tf) * tw ** 3) / 3;
        AsY = (D - 2 * tf) * tw; // web area (shear in Y = strong axis bending)
        AsZ = 2 * B * tf * 5/6; // flange area (shear in Z = weak axis bending)
        shapeType = "I";
        break;
      case "Steel Tube":
        A = D * B - (D - 2 * tw) * (B - 2 * tw);
        Iz = (B * D ** 3 - (B - 2 * tw) * (D - 2 * tw) ** 3) / 12;
        Iy = (D * B ** 3 - (D - 2 * tw) * (B - 2 * tw) ** 3) / 12;
        J = 2 * tw * (D - tw) * (B - tw) * ((D - tw) * (B - tw)) / ((D - tw) + (B - tw));
        AsY = 2 * D * tw; // two webs
        AsZ = 2 * B * tw; // two flanges
        shapeType = "HSS";
        break;
      case "Filled Steel Pipe": {
        // tubo redondo relleno: A e I exactas del circulo transformado, As Timoshenko,
        // J = Js + g·Jc. ETABS poligoniza el circulo (32 lados): su A sale 0.6 % menor.
        const Es = mat?.E || 0;
        const fill = sec.fillMaterial ? materials.get(sec.fillMaterial) : undefined;
        const Ef = fill?.E || Es * 0.125;
        const t = sec.T || tw || tf;
        const c = cftPipeSectionEc(D, t, Es || 1, mat?.nu ?? 0.3, Ef || 0.125, fill?.nu ?? 0.2);
        A = c.A; Iz = c.Iz; Iy = c.Iy; J = c.J; AsZ = c.As2; AsY = c.As3;
        fillE = Ef; esPipeRelleno = true;
        shapeType = "CFT";
        break;
      }
      case "Filled Steel Tube": {
        // Hasta el 2-sep-2026 esto era un RECTANGULO MACIZO de acero (A = D·B con
        // el E del acero: 4 veces el area real) y el As sumaba el hormigon sin
        // transformar. Lo que hace ETABS (medido por OAPI): A e I transformadas al
        // acero con n = E_relleno/E_acero, As por Timoshenko sobre la seccion
        // transformada y J de Saint-Venant del compuesto. Es cftSectionEc.
        const Es = mat?.E || 0;
        const fill = sec.fillMaterial ? materials.get(sec.fillMaterial) : undefined;
        const Ef = fill?.E || Es * 0.125;
        const t = tw || tf;
        const c = cftSectionEc(B, D, t, Es || 1, mat?.nu ?? 0.3, Ef || 0.125, fill?.nu ?? 0.2);
        A = c.A; Iz = c.Iz; Iy = c.Iy; J = c.J; AsZ = c.As2; AsY = c.As3;
        fillE = Ef;
        shapeType = "CFT";
        break;
      }
      case "Steel Angle": {
        const t = tf || tw;
        A = t * (D + B - t);
        Iz = t * (D ** 3 + B * t ** 2 + t ** 2 * (D - t)) / 12;
        Iy = t * (B ** 3 + D * t ** 2 + t ** 2 * (B - t)) / 12;
        J = (D + B - t) * t ** 3 / 3;
        AsY = D * t; // vertical leg
        AsZ = B * t; // horizontal leg
        shapeType = "L";
        break;
      }
      case "Steel Channel":
      case "Cold Formed C":
        A = 2 * B * tf + (D - 2 * tf) * tw;
        Iz = (tw * D ** 3 + 2 * B * tf * (D - tf) ** 2) / 12;
        Iy = (2 * tf * B ** 3 + (D - 2 * tf) * tw ** 3) / 12;
        J = (2 * B * tf ** 3 + (D - 2 * tf) * tw ** 3) / 3;
        AsY = (D - 2 * tf) * tw; // web
        AsZ = 2 * B * tf * 5/6; // flanges
        shapeType = sec.shape === "Cold Formed C" ? "coldC" : "C";
        break;
      case "Steel Double Channel":
        A = 2 * (2 * B * tf + (D - 2 * tf) * tw);
        Iz = 2 * (tw * D ** 3 + 2 * B * tf * (D - tf) ** 2) / 12;
        Iy = 2 * (2 * tf * B ** 3 + (D - 2 * tf) * tw ** 3) / 12;
        J = 2 * (2 * B * tf ** 3 + (D - 2 * tf) * tw ** 3) / 3;
        AsY = 2 * (D - 2 * tf) * tw; // two webs
        AsZ = 4 * B * tf * 5/6; // four flanges
        shapeType = "2C";
        break;
      case "General":
        if (sec.AREA && sec.AREA > 0) {
          A = sec.AREA; Iz = sec.I33 ?? 0; Iy = sec.I22 ?? 0; J = sec.TORSION ?? 0;
          AsZ = sec.AS2 ?? 0;   // AS2 -> V2 (con I33)
          AsY = sec.AS3 ?? 0;   // AS3 -> V3 (con I22)
          shapeType = "general";
          break;
        }
        // sin propiedades escritas: cae al rectangulo de abajo
      default:
        if (D > 0 && B > 0) {
          A = D * B; Iz = B * D ** 3 / 12; Iy = D * B ** 3 / 12;
          J = Math.min(D, B) * Math.max(D, B) ** 3 / 3 * 0.3;
          AsY = AsZ = 5 / 6 * A;
        }
        break;
    }

    // Apply modifiers
    if (sec.modI2) Iy *= sec.modI2;
    if (sec.modI3) Iz *= sec.modI3;

    areas.set(elemIdx, A);
    momentsOfInertiaZ.set(elemIdx, Iz);
    momentsOfInertiaY.set(elemIdx, Iy);
    torsionalConstants.set(elemIdx, J);
    if (AsY > 0) shearAreasY.set(elemIdx, AsY);
    if (AsZ > 0) shearAreasZ.set(elemIdx, AsZ);

    sectionShapes.set(elemIdx, {
      type: shapeType,
      ...(fillE > 0 ? { fillE } : {}),
      b: esPipeRelleno ? undefined : (B || undefined),
      h: esPipeRelleno ? undefined : (D || undefined),
      d: (shapeType === "circ" || shapeType === "pipe" || esPipeRelleno) ? D : undefined,   // el tubo redondo relleno va por d
      tw: tw || undefined,
      tf: tf || undefined,
      r: sec.R,
      name: secName,
    });
  }

  // ── Build node inputs (supports) ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (const [key, dofs] of restraints) {
    const nodeIdx = nodeNameToIdx.get(key);
    if (nodeIdx === undefined) continue;
    const fix: [boolean, boolean, boolean, boolean, boolean, boolean] = [false, false, false, false, false, false];
    for (const d of dofs) {
      if (d === "UX") fix[0] = true;
      if (d === "UY") fix[1] = true;
      if (d === "UZ") fix[2] = true;
      if (d === "RX") fix[3] = true;
      if (d === "RY") fix[4] = true;
      if (d === "RZ") fix[5] = true;
    }
    supports.set(nodeIdx, fix);
  }

  // ── Convert LINELOAD to equivalent nodal loads ──
  // LINELOAD "B120" "N+13.00m" TYPE "UNIFF" DIR "GRAV" LC "SCP" FVAL 0.0148
  // UNIFF = uniform full length, w (force/length)
  // Equivalent nodal: F = w*L/2 at each end node, applied in gravity direction (-Z)
  // Combine all load cases (SCP + CV = total service load)
  const loads = new Map<number, [number, number, number, number, number, number]>();

  // Build element lookup: "lineName@story" → element index
  const elemLookup = new Map<string, number>();
  for (let ei = 0; ei < elementNames.length; ei++) {
    elemLookup.set(`${elementNames[ei]}@${elementStoriesArr[ei]}`, ei);
  }

  for (const fl of frameLoads) {
    const elemIdx = elemLookup.get(`${fl.line}@${fl.story}`);
    if (elemIdx === undefined) continue;

    const [n1, n2] = elements[elemIdx];
    const p1 = nodes[n1], p2 = nodes[n2];
    const L = Math.sqrt((p2[0]-p1[0])**2 + (p2[1]-p1[1])**2 + (p2[2]-p1[2])**2);
    if (L < 1e-10) continue;

    // La carga repartida w (vector GLOBAL): GRAV/GRAVITY = hacia -Z; X, Y, Z
    // son los ejes globales tal cual (Z positivo hacia ARRIBA: antes se leia
    // como -F y una carga hacia arriba entraba hacia abajo).
    const w: [number, number, number] = [0, 0, 0];
    if (fl.dir === "GRAV" || fl.dir === "GRAVITY") w[2] = -fl.val;
    else if (fl.dir === "X") w[0] = fl.val;
    else if (fl.dir === "Y") w[1] = fl.val;
    else if (fl.dir === "Z") w[2] = fl.val;

    // Fuerzas Y MOMENTOS de empotramiento perfecto (la misma formula del
    // cliModeler y del s2kParser): F = w*L/2, M = +-L^2/12 * (t x w). Sin los
    // momentos el galpon leido del e2k daba -25.1 mm por -29.05 (13.6 %).
    const t = [(p2[0]-p1[0]) / L, (p2[1]-p1[1]) / L, (p2[2]-p1[2]) / L], c = L * L / 12;
    const txw = [t[1] * w[2] - t[2] * w[1], t[2] * w[0] - t[0] * w[2], t[0] * w[1] - t[1] * w[0]];
    const acum = (ni: number, v: number[]) => {
      const prev = loads.get(ni) || [0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number];
      for (let k = 0; k < 6; k++) prev[k] += v[k];
      loads.set(ni, prev);
    };
    acum(n1, [w[0] * L / 2, w[1] * L / 2, w[2] * L / 2,  c * txw[0],  c * txw[1],  c * txw[2]]);
    acum(n2, [w[0] * L / 2, w[1] * L / 2, w[2] * L / 2, -c * txw[0], -c * txw[1], -c * txw[2]]);
  }

  // ── Add material densities to element inputs ──
  const densities = new Map<number, number>();
  const deckSections = new Map<number, { tc: number; hr: number; wrt: number; wrb: number; sr: number; w: number }>();
  for (const [elemIdx, secName] of elementSections) {
    const sec = frameSections.get(secName);
    if (!sec) continue;
    const mat = materials.get(sec.material);
    if (mat?.density) densities.set(elemIdx, mat.density);
  }

  // ── ELEMENTOS DE AREA ────────────────────────────────────────────────
  // Se montan al final, DESPUES de las barras, para no tocar la numeracion
  // que ya usan `elementSections` y compania.
  //
  // `MODELINGTYPE` de ETABS → `plateFormulations` del motor:
  //   ShellThin  → 1  Kirchhoff        ShellThick → 0  Mindlin MITC4
  //   Membrane   → 0  y ademas se anulan los modificadores de FLEXION, que es
  //                lo que hace que no aporte rigidez fuera del plano. Un
  //                `Membrane` que entre como placa seria otra estructura.
  const thicknesses = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const plateFormulations = new Map<number, number>();
  const shellModifiers = new Map<number, number[]>();
  const areaNames: string[] = [];
  // Se cuenta POR CAUSA: «2 de 79 no se montaron» no dice si falta un dato, si
  // el fichero esta mal o si el motor no tiene ese elemento — y son cosas
  // distintas. En el modelo real de Rio Chico la causa era una sola area de
  // SEIS lados, que no es un fallo de nadie: hekatan-fem tiene Q4 y T3.
  const perdidas = { sinAssign: 0, sinNudo: 0, colapsada: 0, poligono: 0 };
  for (const ac of areaConns) {
    const aa = areaAssigns.get(ac.name);
    if (!aa) { perdidas.sinAssign++; continue; }
    // Poligonos de mas de 4 lados: ETABS los admite, el motor no. Habria que
    // triangularlos, y triangular a ciegas un poligono no convexo da elementos
    // volteados — mejor decirlo que inventarlo.
    if (ac.pts.length > 4) { perdidas.poligono++; continue; }
    const idx = ac.pts.map((pt, k) => {
      const st = storyDe(aa.story, ac.dz[k] ?? 0);
      return st === undefined ? undefined : nodeNameToIdx.get(nodeKey(pt, st));
    });
    // Un area con un nudo sin resolver no es media area: es ninguna.
    if (idx.some(v => v === undefined)) { perdidas.sinNudo++; continue; }
    // Un PANEL de muro se escribe con el punto repetido (pt1 pt2 pt2 pt1) y el
    // salto de planta 1 1 0 0: al resolverlo salen 4 nudos DISTINTOS. Si aun
    // asi quedan repetidos, el Q4 esta colapsado y no es un elemento definido.
    const unicos = [...new Set(idx as number[])];
    if (unicos.length < 3) { perdidas.colapsada++; continue; }
    const nodosArea = (unicos.length === 3 ? unicos : (idx as number[]).slice(0, 4));
    const ei = elements.length;
    elements.push(nodosArea as unknown as Element);
    elementNames.push(ac.name);
    elementTypes.push(ac.tipo);
    elementStoriesArr.push(aa.story);
    areaNames.push(ac.name);
    if (aa.spring) springAssigns.set(ei, aa.spring);

    const sp = shellProps.get(aa.section);
    if (sp) {
      thicknesses.set(ei, sp.t);
      const mat = materials.get(sp.material);
      if (mat?.E) elasticities.set(ei, mat.E);
      if (mat?.G) shearModuli.set(ei, mat.G);
      if (mat?.nu !== undefined) poissonsRatios.set(ei, mat.nu);
      if (mat?.density) densities.set(ei, mat.density);
      if (sp.deck && sp.deck.tc > 0) {
        // El DECK pesa loseta + hormigón de los nervios + lámina, repartido en la membrana
        // de espesor tc: densidad equivalente = [γc·(tc + hr·(wrt+wrb)/2/sr) + w] / tc
        // (MEDIDO en ETABS 22: 39.1842 kN en 16 m² con tc 65, hr 55, wrt 150, wrb 100, sr 200).
        const d = sp.deck;
        const hormigon = d.tc + (d.sr > 0 ? d.hr * (d.wrt + d.wrb) / 2 / d.sr : 0);
        densities.set(ei, ((mat?.density ?? 0) * hormigon + d.w) / d.tc);
        deckSections.set(ei, { ...d });
      }
      const esMembrana = /membrane/i.test(sp.modeling);
      plateFormulations.set(ei, /thick/i.test(sp.modeling) || esMembrana ? 0 : 1);
      const m = sp.mods ? sp.mods.slice(0, 8) : [1, 1, 1, 1, 1, 1, 1, 1];
      if (esMembrana) { m[3] = 0; m[4] = 0; m[5] = 0; m[6] = 0; m[7] = 0; }
      if (sp.mods || esMembrana) shellModifiers.set(ei, m);
    }
  }
  // ⚠️ ESTE BLOQUE VA AQUI Y NO ARRIBA. Las areas se montan mas abajo que
  // las cargas de barra, asi que puesto junto a ellas el `areaLookup` sale
  // VACIO y las 66 cargas de losa se pierden — sin error: el modelo entra con
  // 48 kN cuando sus losas llevan cientos de kgf/m2, y los desplazamientos no
  // significan nada.
  // ── Las cargas de LOSA, repartidas a los nudos del area ──
  //
  // Para un Q4 con carga uniforme, el vector nodal consistente ∫N_i·q·dA da
  // EXACTAMENTE q·A/4 en cada nudo — no hace falta integrar por Gauss para
  // este caso, y decirlo asi evita una funcion que aparenta mas precision de
  // la que hay. Para el T3 es q·A/3.
  //
  // ⚠️ Se suman TODOS los patrones de gravedad (SCP + CV + ...), que es la
  // carga de SERVICIO. Es lo mismo que ya hacia con las cargas de barra, y hay
  // que saberlo: no es una combinacion mayorada.
  const areaLookup = new Map<string, number>();
  for (let k = 0; k < elementNames.length; k++)
    if ((elements[k] as unknown as number[]).length > 2)
      areaLookup.set(`${elementNames[k]}@${elementStoriesArr[k]}`, k);

  // Cargas PUNTUALES: al nudo (punto@planta), en unidades del fichero; la
  // conversion a kN / kN·m la hace el bloque de unidades de mas abajo junto
  // con las de area y de barra.
  let puntualesSinNudo = 0;
  for (const pl of pointLoads) {
    const ni = nodeNameToIdx.get(nodeKey(pl.pt, pl.story));
    if (ni === undefined) { puntualesSinNudo++; continue; }
    const prev = loads.get(ni) || [0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number];
    for (let k = 0; k < 6; k++) prev[k] += pl.v[k];
    loads.set(ni, prev);
  }
  if (pointLoads.length)
    console.log(`[e2kParser] cargas puntuales: ${pointLoads.length - puntualesSinNudo} aplicadas · ${puntualesSinNudo} sin nudo (punto@planta que no existe)`);

  let cargaAreaTotal = 0, sinArea = 0, sinValor = 0, aplicadas = 0;
  for (const al of areaLoads) {
    const ei2 = areaLookup.get(`${al.area}@${al.story}`) ?? areaLookup.get(`${al.area}@`);
    const idx = ei2 !== undefined ? ei2 : [...areaLookup].find(([k]) => k.startsWith(al.area + "@"))?.[1];
    if (idx === undefined) { sinArea++; continue; }
    const el = elements[idx] as unknown as number[];
    const p = el.map((n) => nodes[n]).filter(Boolean) as number[][];
    if (p.length < 3) continue;
    // Area del poligono por el modulo del doble producto vectorial acumulado.
    let nx = 0, ny = 0, nz = 0;
    for (let k = 0; k < p.length; k++) {
      const a = p[k], b = p[(k + 1) % p.length];
      nx += a[1] * b[2] - a[2] * b[1];
      ny += a[2] * b[0] - a[0] * b[2];
      nz += a[0] * b[1] - a[1] * b[0];
    }
    const A = Math.hypot(nx, ny, nz) / 2;
    if (!(A > 0)) continue;

    // El valor: directo, o el del juego con nombre (que puede traer varios).
    const trozos = al.tipo === "UNIFLOADSET"
      ? (loadSets.get(al.set ?? "") ?? [])
      : [{ lc: al.lc, val: al.val }];
    let q = 0;
    for (const t of trozos) q += t.val;
    if (!q) { sinValor++; continue; }
    aplicadas++;

    const F = q * A / p.length;
    cargaAreaTotal += q * A;
    let fx = 0, fy = 0, fz = 0;
    if (al.dir === "GRAV" || al.dir === "GRAVITY" || al.dir === "Z") fz = -F;
    else if (al.dir === "X") fx = F;
    else if (al.dir === "Y") fy = F;
    for (const n of el) {
      const prev = loads.get(n) || [0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number];
      prev[0] += fx; prev[1] += fy; prev[2] += fz;
      loads.set(n, prev);
    }
  }
  if (areaLoads.length)
    console.info(`[e2kParser] cargas de losa: ${aplicadas} aplicadas · ${sinArea} sin area que las lleve · ` +
      `${sinValor} sin valor · total ${cargaAreaTotal.toFixed(0)} (unidades del fichero) · ` +
      `${loadSets.size} juegos con nombre`);


  const nPerdidas = perdidas.sinAssign + perdidas.sinNudo + perdidas.colapsada + perdidas.poligono;
  if (nPerdidas) {
    const por = [
      perdidas.poligono && `${perdidas.poligono} son POLIGONOS de mas de 4 lados ` +
        `(ETABS los admite, hekatan-fem tiene Q4 y T3: habria que triangularlos)`,
      perdidas.sinAssign && `${perdidas.sinAssign} sin AREAASSIGN`,
      perdidas.sinNudo && `${perdidas.sinNudo} con algun nudo que no resuelve a planta`,
      perdidas.colapsada && `${perdidas.colapsada} colapsadas (menos de 3 nudos distintos)`,
    ].filter(Boolean).join(" · ");
    console.warn(`[e2kParser] ${nPerdidas} de ${areaConns.length} areas no se montaron: ${por}. ` +
      `Se pierden, y el modelo sale mas flojo sin que la geometria lo delate.`);
  }

  // ── A LAS UNIDADES DEL MOTOR: kN y m ─────────────────────────────────
  //
  // ⚠️ El parser NO convertia NADA: devolvia los numeros tal cual venian del
  // fichero. Y un `.e2k` va en **N y MM** (ETABS ignora el header UNITS y
  // siempre escribe en sus unidades base), asi que un modelo importado entraba
  // con las cotas MIL VECES mas grandes: X de 0 a 18000 donde el modelo tiene
  // 18 m, espesores de 200, y el modulo en N/mm2. Medido el 2026-08-28
  // (`cli/roundtrip_areas.mjs`). No daba error: daba otro edificio.
  //
  // Cada magnitud lleva su potencia: una inercia va en L^4 y un modulo en
  // F/L^2. Convertir solo las coordenadas seria peor que no convertir nada —
  // quedaria un modelo con la geometria en metros y las secciones en mm.
  const FL: Record<string, number> = { MM: 1e-3, CM: 1e-2, M: 1, IN: 0.0254, FT: 0.3048 };
  const FF: Record<string, number> = { N: 1e-3, KN: 1, KGF: 9.80665e-3, TONF: 9.80665,
                                       LB: 4.44822e-3, KIP: 4.44822 };
  const L = FL[(units.length || "M").toUpperCase()] ?? 1;
  const F = FF[(units.force || "KN").toUpperCase()] ?? 1;
  if (L !== 1 || F !== 1) {
    const esc = (m: Map<number, number> | undefined, k: number) => {
      if (!m) return;
      for (const [i, v] of m) m.set(i, v * k);
    };
    for (const n of nodes) { n[0] *= L; n[1] *= L; n[2] *= L; }   // la caida ya va dentro de z
    for (const s of stories) { s.height *= L; s.elev *= L; }
    for (const g of grids) g.coord *= L;
    for (const r of planosRef) r.z *= L;
    esc(thicknesses, L);
    esc(areas, L * L);
    // Muelles: punto F/L (giros F·L); linea F/L por L; area F/L por L².
    for (const d of springProps.values()) {
      const fT = d.tipo === "point" ? F / L : d.tipo === "line" ? F / (L * L) : F / (L * L * L);
      for (let i = 0; i < 6; i++) d.k[i] *= i < 3 ? fT : (d.tipo === "point" ? F * L : F);
    }
    esc(shearAreasY, L * L); esc(shearAreasZ, L * L);
    esc(momentsOfInertiaY, L ** 4); esc(momentsOfInertiaZ, L ** 4);
    esc(torsionalConstants, L ** 4);
    esc(elasticities, F / (L * L)); esc(shearModuli, F / (L * L));
    esc(densities, F / (L ** 3));
    for (const d of deckSections.values()) {
      d.tc *= L; d.hr *= L; d.wrt *= L; d.wrb *= L; d.sr *= L; d.w *= F / (L * L);
    }
    // ⚠️ `rigidOffsets` es un Map de PARES `[i, j]`, no de numeros. El
    // `as Map<number, number>` que habia aqui callaba al compilador y `esc`
    // hacia `[0.3, 0.3] * 1` = **NaN**. 317 barras del edificio real entraban
    // con el brazo rigido en NaN, y UN solo NaN envenena la factorizacion
    // entera: el solver decia «Matrix decomposition failed» y no habia forma de
    // saber por que, porque la geometria estaba bien.
    //
    // Solo pasaba con ficheros que NO van en kN-m: en kN-m este bloque entero
    // no se ejecuta. Por eso las plantillas y el galpon nunca lo vieron.
    for (const [i, par] of rigidOffsets) rigidOffsets.set(i, [par[0] * L, par[1] * L]);
    for (const [i, v] of endOffsets) endOffsets.set(i, [v[0] * L, v[1] * L, v[2]]);
    // Cargas: las fuerzas en F y los momentos en F*L, en el mismo vector.
    for (const [i, v] of loads) {
      loads.set(i, v.map((x, k) => x * (k < 3 ? F : F * L)) as typeof v);
    }
    // Los MUELLES. Cada tipo lleva su potencia de la longitud, porque cada uno
    // vale una cosa distinta:
    //   punto  F/L        (kgf/m)     -> * F / L
    //   linea  F/L por L  (kgf/m/m)   -> * F / L^2
    //   area   F/L por L2 (kgf/m/m2)  -> * F / L^3
    // Y los tres de GIRO van en F*L/rad, o sea * F * L.
    for (const [, sp] of springProps) {
      const pot = sp.tipo === "point" ? 1 : sp.tipo === "line" ? 2 : 3;
      for (let i = 0; i < 6; i++)
        sp.k[i] *= i < 3 ? F / L ** pot : F * L / L ** (pot - 1);
    }
    // Las cotas de la seccion dibujada tambien son longitudes.
    for (const [, sh] of sectionShapes) {
      // `h` faltaba en esta lista: la forma salia con b en metros y h en mm.
      for (const k of ["d", "b", "h", "tf", "tw", "t", "r", "lip", "dis", "D", "B", "TF", "TW"]) {
        const o = sh as unknown as Record<string, number>;
        if (typeof o[k] === "number") o[k] *= L;
      }
      if (typeof sh.fillE === "number") sh.fillE *= F / (L * L);   // el E del relleno del CFT
    }
  }

  // El mismo aviso que con las areas: si algo se pierde, que lo DIGA. Un trozo
  // flotante no se ve en el dibujo y hace singular la matriz entera.
  //
  // Y lo mismo con los MECANISMOS, que son peores porque el modelo si resuelve:
  // `deform` elimina los GDL sin rigidez y les pone 0 —igual que ETABS—, asi
  // que si la carga cae en uno de ellos se pierde EN SILENCIO. Medido en una
  // viga con rotulas en cada tramo: 9 de 9 nudos a cero, sin un aviso
  // (`tests/casos/frame_releases.mjs`).
  {
    const fl = piezasFlotantes(elements, supports);
    if (fl.nPiezasFlotantes)
      console.warn(`[e2kParser] ${fl.nPiezasFlotantes} trozos (${fl.nNudosFlotantes} nudos) ` +
        `no llegan a ningun apoyo: la matriz sale SINGULAR y el modelo no resuelve. ` +
        `En ETABS los sujetan links, muelles de pilote o diafragmas, que este lector aun no importa.`);
  }

  /** El PESO PROPIO (SELFWEIGHT del patron Dead), ya en kN y m: rho*A*L/2 a
   *  cada extremo de barra y rho*t*A/4 a cada nudo de cascara, hacia -Z. Es lo
   *  que hace ETABS con el patron y lo que hace `apply_selfweight` en Hekatan. */
  const conPesoPropio = () => {
    if (!(selfWeightMult > 0)) return loads;
    let total = 0;
    const suma = (n: number, fz: number) => {
      const prev = loads.get(n) || [0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number];
      prev[2] += fz; loads.set(n, prev); total += fz;
    };
    elements.forEach((el, i) => {
      const rho = densities.get(i);
      if (!rho) return;
      const e = el as unknown as number[];
      if (e.length === 2) {
        const A = areas.get(i) ?? 0; const a = nodes[e[0]], b = nodes[e[1]];
        const off = endOffsets.get(i);
        // Luz LIBRE solo en las VIGAS (< 20 grados con la horizontal): ETABS no
        // pesa el tramo dentro del brazo rigido. Columnas y diagonales, entera.
        // La misma regla del cliModeler y de apply_selfweight.
        const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
        const dh = Math.hypot(dx, dy);
        const esViga = dh > 1e-9 && Math.atan2(Math.abs(dz), dh) * 180 / Math.PI < 20;
        const Lb = Math.max(0, Math.hypot(dx, dy, dz) - (off && esViga ? off[0] + off[1] : 0));
        const w = rho * A * Lb * selfWeightMult;
        suma(e[0], -w / 2); suma(e[1], -w / 2);
      } else if (e.length >= 3) {
        const t = thicknesses.get(i) ?? 0; const p = e.map(n => nodes[n]);
        let nx = 0, ny = 0, nz = 0;
        for (let k = 0; k < p.length; k++) {
          const a = p[k], b = p[(k + 1) % p.length];
          nx += a[1] * b[2] - a[2] * b[1]; ny += a[2] * b[0] - a[0] * b[2]; nz += a[0] * b[1] - a[1] * b[0];
        }
        const Ar = Math.hypot(nx, ny, nz) / 2;
        const w = rho * t * Ar * selfWeightMult;
        for (const n of e) suma(n, -w / e.length);
      }
    });
    console.log(`[e2kParser] peso propio (SELFWEIGHT ${selfWeightMult}): ${total.toFixed(3)} kN repartidos a los nudos`);
    return loads;
  };

  const springsDePunto = () => {
    const out: Array<{ node: number; dof: number; k: number }> = [];
    for (const [nd, nm] of nodeSprings) {
      const d = springProps.get(nm);
      if (!d || d.tipo !== "point") continue;
      d.k.forEach((k, dof) => { if (k > 0) out.push({ node: nd, dof, k }); });
    }
    return out.length ? out : undefined;
  };
  return {
    units,
    stories: stories.reverse(), // bottom to top
    materials,
    frameSections,
    nodes,
    nodeNames,
    nodeNameToIdx,
    elements,
    elementNames,
    elementTypes: elementTypes,
    elementStories: elementStoriesArr,
    elementSections,
    // Los muelles de PUNTO van ya como `springs` (lo que lee el motor); los de
    // linea/area siguen necesitando `muellesDelModelo` (dependen de la malla).
    nodeInputs: { supports, loads: conPesoPropio(), springNames: nodeSprings,
                  springs: springsDePunto() },
    elementInputs: {
      elasticities,
      shearModuli,
      areas,
      momentsOfInertiaZ,
      momentsOfInertiaY,
      torsionalConstants,
      shearAreasY,
      shearAreasZ,
      rigidOffsets,
      momentReleases,
      localAngles,
      endOffsets,
      // El e2k trae PESO por volumen (WEIGHTPERVOLUME, kN/m³ tras escalar) y el
      // resto de Hekatan lee `densities` como MASA (t/m³): el solver arma M con
      // ella, e2kExporter escribe WEIGHTPERVOLUME = ρ·9.80665 y csiImporter pone
      // ρ = 2.4. Entregar el peso metía 9.81 veces la masa y el e2k re-exportado
      // pesaba 9.81 veces más (bóveda, 13-sep-2026: 23.536 en vez de 2.4).
      // El peso propio de arriba (conPesoPropio) sí va con el peso.
      densities: new Map([...densities].map(([k, w]) => [k, w / 9.80665] as [number, number])),
      // cotas del deck en m y kN/m² (para volver a escribir la «Deck Section» de ETABS tal cual)
      deckSections,
      sectionShapes,
      thicknesses,
      poissonsRatios,
      plateFormulations,
      shellModifiers,
      springNames: springAssigns,
      mallaEnCruces,
    },
    sectionShapes,
    grids,
    planosRef,
    springProps,
    info: {
      ...piezasFlotantes(elements, supports),
      nNodes: nodes.length,
      nFrames: elements.length - areaNames.length,
      nAreas: areaConns.length,
      nAreasMontadas: areaNames.length,
      // Cuantas secciones del Section Designer se compusieron. Si el modelo
      // trae `SD Section` y esto sale 0, esas barras entran SIN RIGIDEZ.
      nSDCompuestas: sdCompuestas,
      nSDLeidas: sdShapes.size,
      title,
    },
    rawSections,
  };
}


/**
 * Los TROZOS del modelo que no llegan a ningún apoyo.
 *
 * Un trozo suelto flota: sus 6 GDL por nudo no los sujeta nadie, la K sale
 * singular y el solver devuelve cero desplazamientos — y la geometría no lo
 * delata, porque el dibujo se ve entero. Es lo que le pasa al modelo grande de
 * ETABS importado: la planta baja sola resuelve (0 trozos flotantes) y al
 * añadir la siguiente aparecen 47 trozos de 110 nudos y deja de resolver.
 *
 * La causa de fondo no es el grafo: en ETABS esos trozos SÍ están sujetos, pero
 * por cosas que este lector todavía no importa (links, muelles de pilote,
 * diafragmas). Contarlos es lo que convierte «no resuelve» en «faltan estos
 * 110 nudos por sujetar», que ya es un problema con nombre.
 */
export function piezasFlotantes(
  elements: number[][],
  supports?: Map<number, boolean[]>,
): { nPiezasFlotantes: number; nNudosFlotantes: number } {
  const ady = new Map<number, number[]>();
  for (const el of elements)
    for (const a of el) for (const b of el)
      if (a !== b) { if (!ady.has(a)) ady.set(a, []); ady.get(a)!.push(b); }
  const usado = new Set<number>();
  for (const el of elements) for (const n of el) usado.add(n);
  const apoyo = new Set<number>([...(supports ?? new Map())].map(([k]) => k));

  const visto = new Set<number>();
  let nPiezasFlotantes = 0, nNudosFlotantes = 0;
  for (const s of usado) {
    if (visto.has(s)) continue;
    const pila = [s], comp: number[] = [];
    visto.add(s);
    while (pila.length) {
      const v = pila.pop()!;
      comp.push(v);
      for (const w of ady.get(v) ?? []) if (!visto.has(w)) { visto.add(w); pila.push(w); }
    }
    if (!comp.some((n) => apoyo.has(n))) { nPiezasFlotantes++; nNudosFlotantes += comp.length; }
  }
  return { nPiezasFlotantes, nNudosFlotantes };
}
