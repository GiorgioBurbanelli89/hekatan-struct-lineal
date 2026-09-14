/**
 * SAP2000 .s2k File Exporter (v24 TABLE format)
 * Format matches SAP2000 v24.1.0 native .$2k export exactly.
 *
 * Soporta:
 *  - Frames + shells homogeneos (Shell-Thin / Shell-Thick)
 *  - Shell-Layered: pasar `layeredSection` con array de capas y este modulo
 *    genera la tabla "AREA SECTION PROPERTY LAYERS" que SAP parsea
 *    correctamente al hacer File.OpenFile(*.s2k) (workaround del bug
 *    SetShellLayer_1 en COM/PowerShell).
 *  - Area loads uniformes (q presion sobre placa)
 */
import type { Node, Element, NodeInputs, ElementInputs } from "hekatan-fem";

/** Capa de un Shell-Layered. */
export interface S2kLayer {
  name: string;
  distance: number;     // desde mid-plane (m). + = arriba, - = abajo
  thickness: number;    // m
  material: string;     // nombre material (debe estar en `materials`)
  angle?: number;       // rad, default 0
  numIntPts?: number;   // Gauss thru-thickness, default 3
}

export interface S2kLayeredSection {
  name: string;          // ej. "BIMETAL"
  totalThickness: number;
  layers: S2kLayer[];
  /** Materiales con E/nu propios (ademas de los implicitos en elementInputs) */
  materials?: Array<{ name: string; E: number; nu: number; rho?: number }>;
}

export interface S2kAreaLoad {
  /** Indice del elemento Q4 (0-based en hekatan) */
  elementIdx: number;
  loadPattern: string;   // "DEAD", "Q", etc.
  value: number;         // kN/m² (positivo = aplicacion, signo segun Dir)
  dir?: number;          // 10 = Gravity, 6 = +Z proyect, default 10
}

export interface S2kExportInput {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  title?: string;
  units?: { force: string; length: string };
  /**
   * Si se provee, los elementos shell usaran esta seccion layered en lugar
   * de la seccion homogenea derivada de `elementInputs.thicknesses`.
   * Aplica a TODOS los shells (mismo laminado).
   */
  layeredSection?: S2kLayeredSection;
  /** Cargas uniformes sobre areas (q presion). */
  areaLoads?: S2kAreaLoad[];
  /** Multiplicador de peso propio del LoadPat DEAD. Default 1 (SAP convencional). */
  selfWtMult?: number;
  /** Columnas CFT (tubo relleno) en el .s2k: "sd" = Section Designer (tubo + relleno; SAP
   *  recalcula A, I, As, J de las formas) [defecto, lo mas parecido al Filled Steel Tube de
   *  ETABS] · "general" = seccion General con las propiedades que calcula Hekatan (A, I, As, J). */
  cftAs?: "sd" | "general";
}

export function exportS2k(input: S2kExportInput): string {
  const { nodes, elements, nodeInputs, elementInputs } = input;
  // ⚠️ `units.force` SOLO pone la etiqueta `CurrUnits` del bloque PROGRAM
  // CONTROL — no convierte NADA. Ni las cargas, ni el módulo, ni las densidades:
  // todos los valores se escriben tal cual salen del modelo, que trabaja en
  // **kN y m**. Declarar "Tonf" ahí escribía un fichero que se contradice a sí
  // mismo, y SAP2000 hace lo correcto con él: lo lee como toneladas.
  //
  // Medido el 2026-08-27 con las 8 plantillas (`cli/plantillas_sap2000.py`):
  // el modelo tiene 6480 kN, el `.s2k` escribía `ΣF3 = -6480` bajo
  // `CurrUnits="Tonf, m, C"`, y SAP2000 devolvía **ΣRz = 63547.09 kN** — que es
  // 6480 × 9.80665, o sea 6480 **toneladas**. El solver de SAP estaba bien: el
  // fichero estaba mal.
  //
  // ⚠️ Y las FLECHAS salían BIEN igualmente, lo que lo hacía invisible: el
  // módulo `E1` viaja con el mismo desajuste, así que en `u = F/K` el factor se
  // cancela y los desplazamientos cierran a 4 decimales con Hekatan. Lo único
  // que se iba eran las FUERZAS y las REACCIONES, ×9.80665.
  //
  // El arreglo es etiquetar lo que de verdad se escribe. Convertir los valores
  // sería lo otro, pero hay que convertir TODAS las magnitudes a la vez
  // (fuerza, momento kN·m, E kN/m², peso específico kN/m³…) y basta con que
  // falte una para volver a un fichero incoherente sin avisar.
  const units = { force: "KN", length: "m" };
  if (input.units && (input.units.force !== "KN" || input.units.length !== "m"))
    console.warn(`[s2k] el modelo va en kN·m y el exportador NO convierte: se ` +
      `declara CurrUnits="KN, m, C" y se ignora "${input.units.force}, ${input.units.length}". ` +
      `Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const title = input.title || "Awatif Model";
  const L: string[] = [];

  const push = (s: string) => L.push(s);
  const blank = () => L.push(" ");

  // Header (same as SAP2000)
  push(`File ${title}.$2k was saved on m/d/yy at h:mm:ss`);
  blank();

  // ── ACTIVE DEGREES OF FREEDOM ──
  push(`TABLE:  "ACTIVE DEGREES OF FREEDOM"`);
  push(`   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes`);
  blank();

  // ── Separate frames and shells ──
  const frameIdx: number[] = [];
  /**
   * Clave e identidad del material de un elemento. Una sola funcion para que
   * las tres partes del fichero (barras, cascaras y la tabla de materiales)
   * nombren el material IGUAL — si no, el .s2k referencia un material que no
   * existe y SAP lo sustituye en silencio por el suyo por defecto.
   *
   * El Poisson sale de `poissonsRatios` (que es donde lo ponen las cascaras) y
   * solo se deduce de `shearModuli` cuando no esta declarado (las barras).
   */
  const matDe = (i: number) => {
    const E = elementInputs.elasticities?.get(i) || 0;
    const nuDecl = elementInputs.poissonsRatios?.get(i);
    const Gdecl = elementInputs.shearModuli?.get(i) || 0;
    const nu = nuDecl !== undefined ? nuDecl
             : (E > 0 && Gdecl > 0 ? Math.max(0, Math.min(0.5, E / (2 * Gdecl) - 1)) : 0.2);
    const G = Gdecl > 0 ? Gdecl : (E > 0 ? E / (2 * (1 + nu)) : 0);
    const rho = elementInputs.densities?.get(i) || 0;
    return { E, nu, G, rho, key: `MAT_${Math.round(E)}_n${nu.toFixed(4)}` };
  };

  const shellIdx: number[] = [];
  /** Hexaedros H8 (8 nudos): salen como SOLID de SAP2000. */
  const solidIdx: number[] = [];
  elements.forEach((el, i) => {
    if (el.length === 2) frameIdx.push(i);
    else if (el.length === 8) solidIdx.push(i);
    else shellIdx.push(i);
  });

  // ── CONNECTIVITY - FRAME ──
  if (frameIdx.length > 0) {
    push(`TABLE:  "CONNECTIVITY - FRAME"`);
    for (const i of frameIdx) {
      const el = elements[i];
      push(`   Frame=${i + 1}   JointI=${el[0] + 1}   JointJ=${el[1] + 1}   IsCurved=No`);
    }
    blank();
  }

  // ── CONNECTIVITY - AREA ──
  if (shellIdx.length > 0) {
    push(`TABLE:  "CONNECTIVITY - AREA"`);
    for (const i of shellIdx) {
      const el = elements[i];
      const jParts = el.map((n, j) => `Joint${j + 1}=${n + 1}`).join("   ");
      push(`   Area=${i + 1}   NumJoints=${el.length}   ${jParts}`);
    }
    blank();
  }

  // ── CONNECTIVITY - SOLID ──
  // Orden de nudos de CSI = TENSORIAL (j1 (0,0,0), j2 (1,0,0), j3 (0,1,0), j4 (1,1,0),
  // j5..j8 arriba); el H8 de Hekatan va antihorario 0-1-2-3 / 4-5-6-7. Se cruzan
  // 3<->4 y 7<->8: medido el 2-sep-2026 (un cubo con el orden de Hekatan salia
  // retorcido y las presiones no cargaban nada).
  if (solidIdx.length > 0) {
    push(`TABLE:  "CONNECTIVITY - SOLID"`);
    for (const i of solidIdx) {
      const e = elements[i];
      const o = [e[0], e[1], e[3], e[2], e[4], e[5], e[7], e[6]];
      push(`   Solid=${i + 1}   ${o.map((n, j) => `Joint${j + 1}=${n + 1}`).join("   ")}`);
    }
    blank();
  }

  // ── COORDINATE SYSTEMS ──
  push(`TABLE:  "COORDINATE SYSTEMS"`);
  push(`   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0`);
  blank();

  // ── DATABASE FORMAT TYPES ──
  push(`TABLE:  "DATABASE FORMAT TYPES"`);
  push(`   UnitsCurr=Yes   OverrideE=No`);
  blank();

  // ── Collect unique frame sections ──
  type SdCft = { b: number; h: number; t: number; Ec: number; nuC: number; matFill: string; D?: number };   // D: tubo REDONDO
  const frameSecs = new Map<string, { A: number; Iz: number; Iy: number; J: number; b: number; h: number; matKey: string; As2: number; As3: number; sd?: SdCft }>();
  // materiales que solo existen por las secciones SD (el relleno de hormigon del CFT)
  const matExtra = new Map<string, { E: number; nu: number; G: number; rho: number }>();
  const elemToFrameSec = new Map<number, string>();
  for (const i of frameIdx) {
    const A = elementInputs.areas?.get(i) || 0;
    const Iz = elementInputs.momentsOfInertiaZ?.get(i) || 0;
    const Iy = elementInputs.momentsOfInertiaY?.get(i) || 0;
    const J = elementInputs.torsionalConstants?.get(i) || 0;
    const E = elementInputs.elasticities?.get(i) || 0;
    const matKey = matDe(i).key;
    // ⚠️ Las AREAS DE CORTANTE entran en la CLAVE de la seccion. Dos perfiles
    // con la misma A e Iz pero distinta alma NO son la misma seccion, y si se
    // funden se pierde el dato que mas ablanda.
    const As2r = elementInputs.shearAreasZ?.get(i) ?? 0;   // As2 -> V2 (con I33)
    const As3r = elementInputs.shearAreasY?.get(i) ?? 0;   // As3 -> V3 (con I22)
    // CFT (tubo de acero relleno): en SAP2000 NO hay seccion parametrica para eso
    // (leido del binario, 2-sep-2026): se escribe como SECTION DESIGNER, tubo de
    // acero + rectangulo de hormigon. SAP2000 recalcula A, I, As y J de las
    // formas (ignora los que lleve la fila, medido): A e I salen iguales a la
    // transformada; As y J son los de Timoshenko/Saint-Venant, que es lo que
    // pone el comando `cft` del .heks. La razon modular sale del E del relleno
    // si viene (`fillE`) y si no se deduce del area: n = (A - As) / Ac.
    const shp = (elementInputs as any).sectionShapes?.get(i);
    let sd: SdCft | undefined;
    const esCftc = shp?.type === "CFT" && shp.d > 0 && shp.tw > 0 && shp.tw < shp.d / 2 && !(shp.b > 0 && shp.h > 0);
    if (input.cftAs !== "general" && shp?.type === "CFT" && E > 0 && (esCftc || (shp.b > 0 && shp.h > 0 && shp.tw > 0 && shp.tw < Math.min(shp.b, shp.h) / 2))) {
      const di = esCftc ? shp.d - 2 * shp.tw : 0;
      const bi = esCftc ? 0 : shp.b - 2 * shp.tw, hi = esCftc ? 0 : shp.h - 2 * shp.tw;
      const AsAcero = esCftc ? Math.PI * (shp.d * shp.d - di * di) / 4 : shp.b * shp.h - bi * hi;
      const Ac = esCftc ? Math.PI * di * di / 4 : bi * hi;
      const n = shp.fillE > 0 ? shp.fillE / E : Math.max(0.01, Math.min(1, (A - AsAcero) / Ac));
      const Ec = n * E, nuC = 0.2;
      const matFill = `MAT_${Math.round(Ec)}_n${nuC.toFixed(4)}`;
      // la masa: Hekatan pone rho sobre el area TRANSFORMADA; SAP suma rho_i*A_i de
      // cada forma. Con rho_relleno = n*rho la masa por metro sale identica.
      const rho = matDe(i).rho;
      if (!matExtra.has(matFill)) matExtra.set(matFill, { E: Ec, nu: nuC, G: Ec / (2 * (1 + nuC)), rho: rho * n });
      sd = esCftc ? { b: shp.d, h: shp.d, t: shp.tw, Ec, nuC, matFill, D: shp.d } : { b: shp.b, h: shp.h, t: shp.tw, Ec, nuC, matFill };
    }
    const key = `A${A.toPrecision(6)}_Iz${Iz.toPrecision(6)}_s${As2r.toPrecision(6)}_${As3r.toPrecision(6)}${sd ? (sd.D ? `_SDC${sd.D}x${sd.t}` : `_SD${sd.b}x${sd.h}x${sd.t}`) : ""}`;
    if (!frameSecs.has(key)) {
      let h = 0.3, b = 0.3;
      if (A > 0 && Iz > 0) { h = Math.sqrt(12 * Iz / A); b = A / h; }
      frameSecs.set(key, { A, Iz, Iy, J, b, h, matKey,
                           As2: As2r > 0 ? As2r : A * 5 / 6,
                           As3: As3r > 0 ? As3r : A * 5 / 6, sd });
    }
    const secIdx = [...frameSecs.keys()].indexOf(key) + 1;
    elemToFrameSec.set(i, `SEC${secIdx}`);
  }

  // ── FRAME SECTION ASSIGNMENTS ──
  if (frameIdx.length > 0) {
    push(`TABLE:  "FRAME SECTION ASSIGNMENTS"`);
    for (const i of frameIdx) {
      const sec = elemToFrameSec.get(i) || "SEC1";
      push(`   Frame=${i + 1}   AutoSelect=N.A.   AnalSect=${sec}   MatProp=Default`);
    }
    blank();
  }

  // ── FRAME SECTION PROPERTIES 01 - GENERAL ──
  if (frameSecs.size > 0) {
    push(`TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"`);
    let idx = 0;
    for (const [, sec] of frameSecs) {
      idx++;
      // Las areas de cortante REALES, no 5/6·A. Sin esto el alma de un perfil
      // I se sustituye por cinco sextos de TODA la seccion — el doble o mas —
      // y el modelo sale sistematicamente mas rigido. Es el mismo dato que en
      // el .heks costaba un 20 % de flecha en el galpon.
      // ⚠️ Shape=General, NO Rectangular.
      //
      // Con `Shape=Rectangular` SAP2000 trata la seccion como PARAMETRICA y
      // **recalcula** I22 y TorsConst desde t3/t2, tirando los valores
      // escritos. Como el t3/t2 que se emite es un rectangulo EQUIVALENTE
      // ajustado para clavar A e I33, el resultado es que A e I33 salen
      // exactos y I22 y J salen los del rectangulo — que para un perfil no
      // tienen nada que ver. Medido en el galpon (COL-CFT):
      //     Area  0.00978997 -> 0.00978997  OK
      //     I33   4.81008e-5 -> 4.81008e-5  OK
      //     I22   4.81008e-5 -> 1.32620e-…  MAL
      //     J     5.66231e-5 -> 4.74992e-…  MAL
      // y la flecha del modelo reimportado se iba un 6.55 %.
      //
      // Con `Shape=General` SAP2000 respeta las ocho propiedades tal cual.
      if (sec.sd) {
        // la fila de una seccion SD: SAP2000 la rellena el solo con lo que sale de
        // las formas (Area, I, AS, J). Se escriben los de Hekatan para que el
        // fichero sea legible; SAP los pisa (medido en cft_sd_hekatan.s2k).
        push(`   SectionName=SEC${idx}   Material=${sec.matKey}   Shape="SD Section"   Area=${fmt(sec.A)}   TorsConst=${fmt(sec.J)}   I33=${fmt(sec.Iz)}   I22=${fmt(sec.Iy)}   I23=0   AS2=${fmt(sec.As2)}   AS3=${fmt(sec.As3)} _`);
        push(`        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1`);
        continue;
      }
      push(`   SectionName=SEC${idx}   Material=${sec.matKey}   Shape=General   t3=${fmt(sec.h)}   t2=${fmt(sec.b)}   Area=${fmt(sec.A)}   TorsConst=${fmt(sec.J)}   I33=${fmt(sec.Iz)}   I22=${fmt(sec.Iy)}   I23=0   AS2=${fmt(sec.As2)}   AS3=${fmt(sec.As3)} _`);
      push(`        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1`);
    }
    blank();
  }

  // ── SECTION DESIGNER: el CFT como tubo de acero + rectangulo de hormigon ──
  // Tablas y campos copiados del .$2k que escribe SAP2000 24 al analizar una SD
  // Section hecha a mano (galpon-bodega-electoral/sap_cft/cft.$2k).
  const sdSecs = [...frameSecs.values()].map((sec, k) => ({ sec, name: `SEC${k + 1}` })).filter(x => x.sec.sd);
  if (sdSecs.length > 0) {
    push(`TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"`);
    for (const { name } of sdSecs)
      push(`   SectionName=${name}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    blank();
    const rect = sdSecs.filter(x => !x.sec.sd!.D), circ = sdSecs.filter(x => x.sec.sd!.D);
    if (rect.length > 0) {
      push(`TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"`);
      for (const { sec, name } of rect) {
        const d = sec.sd!;
        push(`   SectionName=${name}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${sec.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${fmt(d.h)}   Width=${fmt(d.b)}   FlngThick=${fmt(d.t)}   WebThick=${fmt(d.t)}   Rotation=0 _`);
        push(`        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0`);
      }
      blank();
    }
    if (circ.length > 0) {
      // tablas y campos copiados del .$2k de SAP2000 24 (sap_cft_circ/cftc.$2k)
      push(`TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"`);
      for (const { sec, name } of circ) {
        const d = sec.sd!;
        push(`   SectionName=${name}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${sec.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${fmt(d.D!)}   WallThick=${fmt(d.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`);
        push(`        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0`);
      }
      blank();
    }
    if (rect.length > 0) {
      push(`TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"`);
      for (const { sec, name } of rect) {
        const d = sec.sd!;
        push(`   SectionName=${name}   ShapeName=RELLENO   ShapeMat=${d.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${fmt(d.h - 2 * d.t)}   Width=${fmt(d.b - 2 * d.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`);
        push(`        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0`);
      }
      blank();
    }
    if (circ.length > 0) {
      push(`TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"`);
      for (const { sec, name } of circ) {
        const d = sec.sd!;
        push(`   SectionName=${name}   ShapeName=RELLENO   ShapeMat=${d.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${fmt(d.D! - 2 * d.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      blank();
    }
    push(`TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"`);
    for (const { name } of sdSecs)
      push(`   SectionName=${name}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    blank();
  }

  // ── FRAME LOCAL AXES ASSIGNMENTS ──
  // El "local axis angle" de CSI. Sin el, una C 200×50 girada 90° se calcula
  // con la inercia del eje que no es: once veces mas rigida. El galpon lleva
  // 156 barras giradas, asi que no es un detalle.
  {
    const conAng = frameIdx.filter(i => {
      const a = elementInputs.localAngles?.get(i);
      return a !== undefined && isFinite(a) && Math.abs(a) > 1e-9;
    });
    if (conAng.length > 0) {
      push(`TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"`);
      for (const i of conAng) {
        push(`   Frame=${i + 1}   Angle=${fmt(elementInputs.localAngles!.get(i)!)}   AdvanceAxes=No`);
      }
      blank();
    }
  }

  // ── END LENGTH OFFSETS ───────────────────────────────────────────────────
  //
  // ⚠️ Esto NO se escribia, y en SAP2000 hay que escribirlo: **SAP no pone
  // brazos rigidos por defecto y ETABS si**. Medido con `cli/defaults_csi.py`
  // sobre los tres programas —una barra recien dibujada—:
  //
  //     ajuste                 ETABS 22.6   SAP2000 24.1   SAFE 20
  //     end length offset      AUTO         manual (0,0)   AUTO
  //     edge constraint        True         False          -
  //
  // O sea que el mismo modelo exportado a los dos programas NO era la misma
  // estructura: ETABS le ponia los brazos por su cuenta (y no pesaba el tramo
  // de viga que cae dentro) y SAP2000 no. De ahi que el .s2k cerrara el peso y
  // el .e2k no.
  //
  // El formato es el que escribe el propio SAP2000, leido de su tabla «Frame
  // Offset Along Length Assignments»:
  //
  //     Frame,Type,LengthI,LengthJ,RigidFactor
  //     VIGA,User,0.075,0.075,0
  //
  // `Type = User` porque los da el modelo, no los deduce SAP de la
  // conectividad. Y `RigidFactor` es el rz del modelo — 0 en Hekatan, como el
  // defecto de ETABS: con 0 el brazo no rigidiza, solo quita peso.
  {
    const eo = (elementInputs as any).endOffsets as Map<number, number[]> | undefined;
    const conOff = frameIdx.filter((i) => {
      const v = eo?.get(i);
      return !!v && (Math.abs(v[0]) > 1e-9 || Math.abs(v[1]) > 1e-9);
    });
    if (conOff.length > 0) {
      push(`TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"`);
      for (const i of conOff) {
        const v = eo!.get(i)!;
        push(`   Frame=${i + 1}   Type=User   LengthI=${fmt(v[0])}   ` +
             `LengthJ=${fmt(v[1])}   RigidFactor=${fmt(v.length > 2 ? v[2] : 0)}`);
      }
      blank();
    }
  }

  // ── LAYERED SHELL: si se provee, todos los shells usan la misma seccion ──
  const isLayered = !!input.layeredSection && shellIdx.length > 0;
  const layeredSec = input.layeredSection;

  // ── Collect unique shell sections (homogeneo) ──
  // La FORMULACION entra en la clave: dos paños del mismo espesor pero uno
  // membrana y otro cáscara son DOS secciones distintas para SAP, no una.
  const shellSecs = new Map<string, { t: number; matKey: string; formulacion: number }>();
  const elemToShellSec = new Map<number, string>();
  // Modificadores: los DIRECCIONALES (shellmod ID f11 … v23) y los ESCALARES (shellmod ID mem flex).
  const smods = (elementInputs as any).shellModifiers as Map<number, number[]> | undefined;
  const memMods = (elementInputs as any).membraneModifiers as Map<number, number> | undefined;
  const flexMods = (elementInputs as any).bendingModifiers as Map<number, number> | undefined;
  // `shellmod ID 1 0` (flexion 0 escalar): el motor NO arma la placa (shellQ4.cpp, `sinFlexion`), es
  // una membrana pura → en SAP2000 va `Type=Membrane`. Antes salia Shell-Thick SIN modificadores
  // (los escalares no llegaban a la tabla): SAP2000 recibia el muro con flexion entera.
  const esMembrana = (i: number) => !smods?.has(i) && Math.abs(flexMods?.get(i) ?? 1) < 1e-9;
  if (!isLayered) {
    for (const i of shellIdx) {
      const t = elementInputs.thicknesses?.get(i) || 0.1;
      const E = elementInputs.elasticities?.get(i) || 0;
      const matKey = matDe(i).key;
      const formulacion = esMembrana(i) ? 2 : ((elementInputs as any).plateFormulations?.get(i) ?? 0);
      const key = `t${t.toPrecision(6)}_f${formulacion}`;
      if (!shellSecs.has(key)) shellSecs.set(key, { t, matKey, formulacion });
      const secIdx = [...shellSecs.keys()].indexOf(key) + 1;
      elemToShellSec.set(i, `SSEC${secIdx}`);
    }
  }

  // ── AREA SECTION ASSIGNMENTS ──
  if (shellIdx.length > 0) {
    push(`TABLE:  "AREA SECTION ASSIGNMENTS"`);
    for (const i of shellIdx) {
      const sec = isLayered ? layeredSec!.name : (elemToShellSec.get(i) || "SSEC1");
      push(`   Area=${i + 1}   Section=${sec}   MatProp=Default`);
    }
    blank();

    // ── AREA STIFFNESS MODIFIERS ── (nombre de tabla medido en el .$2k que SAP2000
    // escribe al analizar: f11 f22 f12 m11 m22 m12 v13 v23 MassMod WeightMod).
    // Sin esto el deck del galpon (shellmod 1 1 1 0 0 0 1 1, membrana sin flexion)
    // entraba a SAP con la flexion entera: el ciclo salia 0.38 % mas rigido.
    // Escalar → 8 valores: f11 f22 f12 = membrana; m11 m22 m12 v13 v23 = flexion (el motor escala la
    // placa entera, `Kb *= bFactor`, cortante incluido). En una Membrane la flexion no existe: va 1.
    const modsDe = (i: number): number[] | undefined => {
      const d = smods?.get(i); if (d) return d;
      const mm = memMods?.get(i) ?? 1, bb = esMembrana(i) ? 1 : (flexMods?.get(i) ?? 1);
      return [mm, mm, mm, bb, bb, bb, bb, bb];
    };
    const conMods = shellIdx.filter(i => { const m = modsDe(i); return m && m.some(v => Math.abs(v - 1) > 1e-12); });
    if (conMods.length > 0) {
      push(`TABLE:  "AREA STIFFNESS MODIFIERS"`);
      for (const i of conMods) {
        const m = modsDe(i)!;
        push(`   Area=${i + 1}   f11=${fmt(m[0])}   f22=${fmt(m[1])}   f12=${fmt(m[2])}   m11=${fmt(m[3])}   m22=${fmt(m[4])}   m12=${fmt(m[5])}   v13=${fmt(m[6])}   v23=${fmt(m[7])}   MassMod=1   WeightMod=1`);
      }
      blank();
    }

    push(`TABLE:  "AREA SECTION PROPERTIES"`);
    if (isLayered) {
      const sec = layeredSec!;
      const matBase = sec.layers[0]?.material || "MAT_DEFAULT";
      push(`   Section=${sec.name}   Material=${matBase}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${fmt(sec.totalThickness)}   BendThick=${fmt(sec.totalThickness)}   Color=Magenta`);
    } else {
      let idx = 0;
      for (const [, sec] of shellSecs) {
        idx++;
        // ⚠️ `Shell-Thin` con GUION, y el tipo el que tenga el modelo. Antes iba
        // `Type=ShellThin` fijo (sin guion y sin mirar el modelo). SAP escribe
        // `Shell-Thin` / `Shell-Thick` / `Membrane` — verificado pidiendole a
        // SAP que exportara su propio .s2k de cada tipo
        // (galpon-bodega-electoral/tipos_cascara_export.py).
        // ⚠️ SAP2000 tiene MAS tipos que ETABS: ademas de Shell-Thin/Thick y
        // Membrane, tiene **Plate-Thin** y **Plate-Thick**. La diferencia:
        //
        //   Membrane   solo membrana, sin flexion
        //   Plate      solo FLEXION, sin membrana y sin drilling
        //   Shell      flexion + membrana
        //
        // `Plate` sirve para AISLAR la placa: comparando contra Plate-Thin se
        // mide la formulacion de flexion sola, sin que la membrana ni el
        // drilling contaminen. ETABS no lo tiene, asi que esto solo vale para
        // el .s2k.
        //
        // El motor de Hekatan siempre monta shell (flexion + membrana); estos
        // dos valores cambian solo lo que se le PIDE a SAP2000, y por eso el
        // solver los trata como su Thin/Thick equivalente.
        const tipoS2k = sec.formulacion === 2 ? "Membrane"
                      : sec.formulacion === 3 ? "Plate-Thin"
                      : sec.formulacion === 4 ? "Plate-Thick"
                      : sec.formulacion === 1 ? "Shell-Thin" : "Shell-Thick";
        // en Plate no hay grado de libertad de drilling: no hay membrana
        const drill = (sec.formulacion === 3 || sec.formulacion === 4) ? "No" : "Yes";
        push(`   Section=SSEC${idx}   Material=${sec.matKey}   MatAngle=0   AreaType=Shell   Type=${tipoS2k}   DrillDOF=${drill}   Thickness=${fmt(sec.t)}   BendThick=${fmt(sec.t)}   Color=Cyan`);
      }
    }
    blank();

    // ── AREA SECTION PROPERTY LAYERS (solo si layered) ──
    if (isLayered) {
      push(`TABLE:  "AREA SECTION PROPERTY LAYERS"`);
      const sec = layeredSec!;
      for (const L0 of sec.layers) {
        const ang = L0.angle ?? 0;
        const np = L0.numIntPts ?? 3;
        push(`   Section=${sec.name}   LayerName=${L0.name}   Distance=${fmt(L0.distance)}   Thickness=${fmt(L0.thickness)}   Type=Shell   NumIntPts=${np}   Material=${L0.material}   MatAngle=${fmt(ang * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      blank();
    }
  }

  // ── JOINT COORDINATES ──
  push(`TABLE:  "JOINT COORDINATES"`);
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    push(`   Joint=${i + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${fmt(n[0])}   Y=${fmt(n[1])}   Z=${fmt(n[2])}   SpecialJt=No`);
  }
  blank();

  // ── JOINT RESTRAINT ASSIGNMENTS ──
  if (nodeInputs.supports && nodeInputs.supports.size > 0) {
    push(`TABLE:  "JOINT RESTRAINT ASSIGNMENTS"`);
    for (const [idx, sup] of nodeInputs.supports) {
      if (!sup.some(s => s)) continue;
      const yn = (b: boolean) => b ? "Yes" : "No";
      push(`   Joint=${idx + 1}   U1=${yn(sup[0])}   U2=${yn(sup[1])}   U3=${yn(sup[2])}   R1=${yn(sup[3])}   R2=${yn(sup[4])}   R3=${yn(sup[5])}`);
    }
    blank();
  }

  // ── JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED (muelles nodales, Winkler) ──
  // Columnas leidas de SAP2000 24 por OAPI (`DatabaseTables.GetTableForDisplayArray`):
  // Joint, CoordSys, U1, U2, U3, R1, R2, R3. Hasta el 5-sep-2026 el .s2k no los
  // escribia y una zapata sobre Winkler llegaba a SAP2000 sin apoyo (inestable).
  {
    const kNudo = new Map<number, number[]>();
    for (const sp of (nodeInputs as any).springs ?? []) {
      if (!(sp.k > 0)) continue;
      const v = kNudo.get(sp.node) ?? [0, 0, 0, 0, 0, 0];
      v[sp.dof] += sp.k; kNudo.set(sp.node, v);
    }
    if (kNudo.size > 0) {
      push(`TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"`);
      for (const [idx, v] of [...kNudo].sort((a, b) => a[0] - b[0]))
        push(`   Joint=${idx + 1}   CoordSys=Global   U1=${fmt(v[0])}   U2=${fmt(v[1])}   U3=${fmt(v[2])}   R1=${fmt(v[3])}   R2=${fmt(v[4])}   R3=${fmt(v[5])}`);
      blank();
    }
  }

  // ── CONSTRAINT DEFINITIONS + JOINT CONSTRAINT ASSIGNMENTS (diafragma rigido) ──
  // `nodeInputs.diaphragms` (nudo -> grupo; grupo NEGATIVO = solo ux, uy). En SAP2000 es
  // un Diaphragm constraint con eje Z (ata ux, uy, rz). Hasta el 3-sep-2026 el .s2k NO lo
  // escribia: el mezanine con diafragma salia 1 % mas rigido en Hekatan que en SAP2000 —
  // y no era el solver, era una restriccion que no viajaba en el fichero.
  const diafr = (nodeInputs as any).diaphragms as Map<number, number> | undefined;
  if (diafr && diafr.size > 0) {
    const grupos = new Map<number, number[]>();
    for (const [nd, g] of diafr) {
      const gi = Math.round(g); if (gi === 0) continue;
      const k = Math.abs(gi);
      if (!grupos.has(k)) grupos.set(k, []);
      grupos.get(k)!.push(nd);
    }
    const conDos = [...grupos].filter(([, v]) => v.length >= 2);
    if (conDos.length > 0) {
      push(`TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"`);
      for (const [g] of conDos) push(`   Name=DIAPH${g}   CoordSys=GLOBAL   Axis=Z`);
      blank();
      push(`TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"`);
      for (const [g, nds] of conDos) for (const nd of nds) push(`   Joint=${nd + 1}   Constraint=DIAPH${g}`);
      blank();
    }
  }

  // ── LOAD PATTERN DEFINITIONS ──
  const selfWtMult = input.selfWtMult ?? 1;
  push(`TABLE:  "LOAD PATTERN DEFINITIONS"`);
  push(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${selfWtMult}`);
  blank();

  // ── LOAD CASE DEFINITIONS ──
  push(`TABLE:  "LOAD CASE DEFINITIONS"`);
  push(`   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes`);
  blank();

  // ── CASE - STATIC 1 - LOAD ASSIGNMENTS ──
  push(`TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"`);
  push(`   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1`);
  blank();

  // ── JOINT LOADS - FORCE ──
  // ⚠️ Esto leia `nodeInputs.forces`, que NO EXISTE en el modelo de datos: el
  // campo es `loads` (ver hekatan-fem/src/data-model.ts). Como el objeto era
  // `undefined`, el `if` nunca entraba y el .s2k salia SIN NINGUNA carga nodal
  // — y SAP no protesta: abre el modelo, resuelve y da todo cero. No se habia
  // notado porque el galpon, que es con lo que se valido el exportador, carga
  // por `frameload` y no tiene ni una fuerza nodal.
  // ⚠️ Desde que el cliModeler reparte `frameload` a los nudos (fuerzas w·L/2
  // y momentos ±L²/12·(t×w)), `nodeInputs.loads` YA las lleva. Como abajo se
  // escriben ademas como FRAME LOADS - DISTRIBUTED, SAP las contaba DOS veces:
  // galpon ΣRz 8157 kN por 4078 (medido 2-sep-2026, csi_ida_vuelta.py). Aqui se
  // descuenta de cada nudo lo que le llego de sus barras cargadas.
  const fLoadsPre: Map<number, [number, number, number]> | undefined = (elementInputs as any).frameLoads;
  const cargasNodales = new Map<number, number[]>();
  nodeInputs.loads?.forEach((v, i) => cargasNodales.set(i, [...v]));
  if (fLoadsPre && fLoadsPre.size > 0) {
    const resta = (i: number, v: number[]) => {
      const a = cargasNodales.get(i) ?? [0, 0, 0, 0, 0, 0];
      cargasNodales.set(i, a.map((x, k) => x - v[k]));
    };
    for (const [idx, w] of fLoadsPre) {
      const el = elements[idx];
      if (!el || el.length !== 2) continue;
      const a = nodes[el[0]], b = nodes[el[1]];
      const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const L = Math.hypot(d[0], d[1], d[2]);
      if (L < 1e-9) continue;
      const t = [d[0] / L, d[1] / L, d[2] / L], c = L * L / 12;
      const txw = [t[1] * w[2] - t[2] * w[1], t[2] * w[0] - t[0] * w[2], t[0] * w[1] - t[1] * w[0]];
      resta(el[0], [w[0] * L / 2, w[1] * L / 2, w[2] * L / 2, c * txw[0], c * txw[1], c * txw[2]]);
      resta(el[1], [w[0] * L / 2, w[1] * L / 2, w[2] * L / 2, -c * txw[0], -c * txw[1], -c * txw[2]]);
    }
  }
  if (cargasNodales.size > 0) {
    push(`TABLE:  "JOINT LOADS - FORCE"`);
    for (const [idx, force] of cargasNodales) {
      if (!force.some(v => Math.abs(v) > 1e-12)) continue;
      push(`   Joint=${idx + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${fmt(force[0])}   F2=${fmt(force[1])}   F3=${fmt(force[2])}   M1=${fmt(force[3])}   M2=${fmt(force[4])}   M3=${fmt(force[5])}`);
    }
    blank();
  }

  // ── FRAME LOADS - DISTRIBUTED ──
  // Sin esta tabla el .s2k salia SIN CARGA en cuanto el modelo cargaba por
  // `frameload` en vez de por fuerzas nodales: el galpon tiene 195 frameload y
  // 0 force, o sea que se perdian los 4078 kN enteros y SAP abria el modelo con
  // cero carga. Y no da error: da un modelo que resuelve y sale todo a cero.
  //
  // `elementInputs.frameLoads` viene en GLOBALES (kN/m), que es como lo guarda
  // el cliModeler, asi que se escribe una fila por componente no nula con
  // CoordSys=GLOBAL y Dir=X/Y/Z. La carga es uniforme (FOverLA = FOverLB) y va
  // de extremo a extremo, que es lo que genera el comando `frameload`.
  const fLoads: Map<number, [number, number, number]> | undefined =
    (elementInputs as any).frameLoads;
  if (fLoads && fLoads.size > 0) {
    push(`TABLE:  "FRAME LOADS - DISTRIBUTED"`);
    for (const [idx, w] of fLoads) {
      const el = elements[idx];
      if (!el || el.length !== 2) continue;
      const a = nodes[el[0]], b = nodes[el[1]];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      // Numeracion de SAP: el Frame=N de CONNECTIVITY - FRAME es el indice del
      // elemento +1, el mismo que ya usa FRAME SECTION ASSIGNMENTS.
      (["X", "Y", "Z"] as const).forEach((dir, k) => {
        if (Math.abs(w[k]) < 1e-12) return;
        push(`   Frame=${idx + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${dir}` +
             `   DistType=RelDist   RelDistA=0   RelDistB=1` +
             `   AbsDistA=0   AbsDistB=${fmt(L)}` +
             `   FOverLA=${fmt(w[k])}   FOverLB=${fmt(w[k])}`);
      });
    }
    blank();
  }

  // ── Collect unique materials ──
  const matSet = new Map<string, { E: number; nu: number; G: number; rho: number }>();
  for (let i = 0; i < elements.length; i++) {
    // ⚠️ El Poisson se leia SOLO deduciendolo de `shearModuli`, y ese mapa lo
    // llenan las BARRAS, no las cascaras. Para un modelo de cascaras el `nu`
    // real (`poissonsRatios`) se ignoraba y salia el 0.2 por defecto. No es
    // cosmetico: en el patch test del ITW, con nu = 0, SAP daba 1.491651 en
    // vez de 1.500000 — y ese 0.5 % parecia del exportador de geometria o del
    // tipo de cascara, cuando era el MATERIAL. Ahora manda el declarado.
    const { E, nu, G, rho, key } = matDe(i);
    if (!matSet.has(key)) matSet.set(key, { E, nu, G, rho });
  }

  // ── SOLID PROPERTY DEFINITIONS / ASSIGNMENTS ──
  // Una propiedad por material; InComp = los modos incompatibles de flexion
  // (Wilson-Taylor), que SAP2000 trae por defecto y el H8 de Hekatan tambien.
  // `elementInputs.solidIncompatible = false` los apaga en los dos.
  if (solidIdx.length > 0) {
    const inc = (elementInputs as any).solidIncompatible === false ? "No" : "Yes";
    const solidProps = new Map<string, string>();   // matKey -> SolidProp
    for (const i of solidIdx) {
      const { E, nu, G, rho, key } = matDe(i);
      if (!matSet.has(key)) matSet.set(key, { E, nu, G, rho });
      if (!solidProps.has(key)) solidProps.set(key, `SOL${solidProps.size + 1}`);
    }
    push(`TABLE:  "SOLID PROPERTY DEFINITIONS"`);
    for (const [key, name] of solidProps)
      push(`   SolidProp=${name}   Material=${key}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${inc}   Color=Yellow`);
    blank();
    push(`TABLE:  "SOLID PROPERTY ASSIGNMENTS"`);
    for (const i of solidIdx) push(`   Solid=${i + 1}   SolidProp=${solidProps.get(matDe(i).key)}`);
    blank();
  }

  // el relleno de hormigon de las CFT (Section Designer) es un material mas
  for (const [k, v] of matExtra) if (!matSet.has(k)) matSet.set(k, v);

  // ── MATERIAL PROPERTIES 01 ──
  push(`TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"`);
  for (const [name] of matSet) {
    push(`   Material=${name}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  }
  blank();

  // ── MATERIAL PROPERTIES 02 ──
  push(`TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"`);
  for (const [name, mat] of matSet) {
    push(`   Material=${name}   UnitWeight=${fmt(mat.rho * 9.81)}   UnitMass=${fmt(mat.rho)}   E1=${fmt(mat.E)}   G12=${fmt(mat.G)}   U12=${fmt(mat.nu)}   A1=9.9E-06`);
  }
  blank();

  // ── MATERIAL PROPERTIES 03B ──
  push(`TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"`);
  for (const [name] of matSet) {
    push(`   Material=${name}   Fc=27579   eFc=27579   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0`);
  }
  blank();

  // ── PROGRAM CONTROL (at end, like SAP2000 does) ──
  push(`TABLE:  "PROGRAM CONTROL"`);
  push(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${units.force}, ${units.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`);
  blank();

  push(`END TABLE DATA`);
  push("");

  return L.join("\r\n");
}

function fmt(v: number): string {
  if (v === 0 || Math.abs(v) < 1e-15) return "0";
  if (Math.abs(v) >= 1e6 || (Math.abs(v) < 1e-3 && Math.abs(v) > 0)) {
    return v.toExponential(8);
  }
  return parseFloat(v.toPrecision(10)).toString();
}
