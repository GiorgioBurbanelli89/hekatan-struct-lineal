/**
 * Lo que un .e2k de ETABS trae y Struct perdia al leerlo o al volver a escribirlo,
 * medido en el TACNA contra ETABS 22 (registros/TACNA_e2k_struct_vs_etabs.md):
 *
 *   - columna con salto 0 (el nudo de abajo cuelga de la misma planta): se descartaba (16 barras)
 *   - plantas: se deducian de las cotas y los puntos a media altura salian como plantas (8 → 15)
 *   - DIAPH de los POINTASSIGN: no se leia (252 joints sin diafragma)
 *   - RIGIDZONE 1 (brazo automatico): salia como LENGTHOFFI 1000 RIGIDZONE 0
 *   - CARDINALPT / MIRROR3 y ADDRESTRAINT "Yes": no se devolvian
 *   - «Concrete L» con IGNOREFLANGEAREA y TYPE "Beam": entraba como rectangulo lleno D×B
 *
 *   - J del rectangulo con D > B: la formula de Roark iba con a = D como lado corto (×8 a ×277)
 *
 * Con todo eso, el TACNA reexportado da en ETABS peso propio −0.24 %, T1 −0.13 %, T3 −3.1 %
 * (antes −16 % y ×3.8).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "e2k-fidelidad-etabs";
export const descripcion =
  "e2k de ETABS → Struct → e2k: salto 0, plantas, diafragmas, brazo automatico, insercion, Concrete L";

const cargar = () => empaquetar(
  `export { parseE2k } from "${R}/examples/src/shared/e2kParser";\n` +
  `export { exportE2k } from "${R}/examples/src/shared/e2kExporter";\n`, "e2kFidelidad");

// 2 plantas de 4 m (TONF, M). La columna "C5" va de media altura (POINT "5" cae 2 m) a la planta.
const E2K = `$ CONTROLS
  UNITS  "TONF"  "M"  "C"
$ STORIES - IN SEQUENCE FROM TOP
  STORY "PISO 2"  HEIGHT 4
  STORY "PISO 1"  HEIGHT 4
  STORY "Base"  ELEV 0
$ MATERIAL PROPERTIES
  MATERIAL  "C280"    TYPE "Concrete"    WEIGHTPERVOLUME 2.4
  MATERIAL  "C280"    SYMTYPE "Isotropic"  E 2526713.2  U 0.15  A 9.9E-06
$ FRAME SECTIONS
  FRAMESECTION  "COL"  MATERIAL "C280"  SHAPE "Concrete Rectangular"  D 0.5 B 0.5
  FRAMESECTION  "VIG"  MATERIAL "C280"  SHAPE "Concrete Rectangular"  D 0.8 B 0.3
  FRAMESECTION  "CL"  MATERIAL "C280"  SHAPE "Concrete L"  D 1.4 B 1 TF 0.4 TW 0.4 TWB 0.4 IGNOREFLANGEAREA  "Yes"  MIRROR3 "Yes"
$ SLAB PROPERTIES
  SHELLPROP  "ESC"  PROPTYPE  "Slab"  MATERIAL "C280"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS 0.3
$ CONCRETE SECTIONS
  CONCRETESECTION  "CL"  TYPE "Beam"  COVERTOP 0.06 COVERBOTTOM 0.06
$ POINT COORDINATES
  POINT "1"  0 0
  POINT "2"  6 0
  POINT "3"  6 5
  POINT "4"  0 5
  POINT "5"  3 0 2
  POINT "6"  3 0
$ LINE CONNECTIVITIES
  LINE  "C1"  COLUMN  "1"  "1"  1
  LINE  "C2"  COLUMN  "2"  "2"  1
  LINE  "C3"  COLUMN  "3"  "3"  1
  LINE  "C4"  COLUMN  "4"  "4"  1
  LINE  "C5"  COLUMN  "5"  "6"  0
  LINE  "B1"  BEAM  "1"  "6"  0
  LINE  "B5"  BEAM  "6"  "2"  0
  LINE  "B2"  BEAM  "2"  "3"  0
  LINE  "B3"  BEAM  "3"  "4"  0
  LINE  "B4"  BEAM  "4"  "1"  0
$ AREA CONNECTIVITIES
  AREA "W1"  PANEL  4  "1"  "2"  "3"  "4"  0  0  0  0
$ POINT ASSIGNS
  POINTASSIGN  "1"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "2"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "3"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "4"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "1"  "PISO 1"  DIAPH "D1"
  POINTASSIGN  "2"  "PISO 1"  DIAPH "D1"
  POINTASSIGN  "3"  "PISO 1"  DIAPH "D1"
  POINTASSIGN  "4"  "PISO 1"  DIAPH "D1"
  POINTASSIGN  "1"  "PISO 2"  DIAPH "D1"
  POINTASSIGN  "2"  "PISO 2"  DIAPH "D1"
  POINTASSIGN  "3"  "PISO 2"  DIAPH "D1"
  POINTASSIGN  "4"  "PISO 2"  DIAPH "D1"
  POINTASSIGN  "5"  "PISO 2"  DIAPH "DISCONNECTED"
$ LINE ASSIGNS
  LINEASSIGN  "C1"  "PISO 1"  SECTION "CL"  RIGIDZONE 1 CARDINALPT 5    MIRROR3 "Yes"
  LINEASSIGN  "C1"  "PISO 2"  SECTION "CL"  RIGIDZONE 1 CARDINALPT 5    MIRROR3 "Yes"
  LINEASSIGN  "C2"  "PISO 1"  SECTION "COL"  RIGIDZONE 1
  LINEASSIGN  "C2"  "PISO 2"  SECTION "COL"  RIGIDZONE 1
  LINEASSIGN  "C3"  "PISO 1"  SECTION "COL"  RIGIDZONE 1
  LINEASSIGN  "C3"  "PISO 2"  SECTION "COL"  RIGIDZONE 1
  LINEASSIGN  "C4"  "PISO 1"  SECTION "COL"  RIGIDZONE 1
  LINEASSIGN  "C4"  "PISO 2"  SECTION "COL"  RIGIDZONE 1
  LINEASSIGN  "C5"  "PISO 2"  SECTION "COL"  RIGIDZONE 1
  LINEASSIGN  "B1"  "PISO 1"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B5"  "PISO 1"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B2"  "PISO 1"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B3"  "PISO 1"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B4"  "PISO 1"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B1"  "PISO 2"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B5"  "PISO 2"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B2"  "PISO 2"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B3"  "PISO 2"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
  LINEASSIGN  "B4"  "PISO 2"  SECTION "VIG"  RIGIDZONE 1 CARDINALPT 8
$ AREA ASSIGNS
  AREAASSIGN  "W1"  "PISO 1"  SECTION "ESC"
$ LOAD PATTERNS
  LOADPATTERN "PP"  TYPE  "Dead"  SELFWEIGHT  1
  SEISMIC "SX"  "User Coefficient"    DIR "X"    TOPSTORY "PISO 2"    BOTTOMSTORY "PISO 1"    SHEARCOEFF 0.2  HEIGHTEXPONENT 1
  LOADPATTERN "SX"  TYPE  "Seismic"  SELFWEIGHT  0
  LOADPATTERN "CV"  TYPE  "Live"  SELFWEIGHT  0
$ SHELL OBJECT LOADS
  AREALOAD  "W1"  "PISO 1"  TYPE "UNIFF"  DIR "GRAV"  LC "CV"  FVAL 0.25
  END
$ END OF MODEL FILE
`;

export async function correr() {
  const { parseE2k, exportE2k } = await cargar();
  const m = parseE2k(E2K);
  const txt = exportE2k({ nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs,
    elementInputs: m.elementInputs, title: "fidelidad", units: { force: m.units.force, length: m.units.length } });
  const filas = [];
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });
  const nBarras = m.elements.filter((e) => e.length === 2).length;
  fila("barras leidas (C5 de salto 0 incluida)", nBarras, 19, nBarras === 19, "8 columnas + C5 + 10 vigas");

  const st = (txt.match(/^\s*STORY\s+"([^"]+)"/gm) ?? []).map((l) => l.match(/"([^"]+)"/)[1]).join("|");
  fila("plantas del fichero, con su nombre", st, "PISO 2|PISO 1|Base", st === "PISO 2|PISO 1|Base",
    "el punto a media altura cuelga con descenso, no es planta");
  const col0 = /LINE\s+"[^"]+"\s+COLUMN\s+"[^"]+"\s+"[^"]+"\s+0\s*$/m.test(txt);
  fila("C5 sale como COLUMN con salto 0", col0 ? "si" : "no", "si", col0, "como BEAM ETABS le cambia los ejes");

  const nd = [...(m.nodeInputs.diaphragms ?? new Map()).values()];
  const grupos = new Set(nd).size;
  fila("diafragmas leidos: nudos / grupos (uno por planta)", `${nd.length}/${grupos}`, "8/2", nd.length === 8 && grupos === 2);
  const nDiaf = (txt.match(/DIAPH "D1"/g) ?? []).length;
  fila("DIAPH en el e2k exportado", nDiaf, 8, nDiaf === 8);

  const offs = /LENGTHOFFI/.test(txt), rz = (txt.match(/RIGIDZONE 1\b/g) ?? []).length;
  fila("brazo automatico: RIGIDZONE 1 sin LENGTHOFFI", `${rz} / ${offs ? "con" : "sin"} LENGTHOFF`, "19 / sin",
    rz === 19 && !offs, "antes LENGTHOFFI 1000 RIGIDZONE 0");
  const cp8 = (txt.match(/CARDINALPT 8/g) ?? []).length, cp5 = (txt.match(/CARDINALPT 5\s+MIRROR3 "Yes"/g) ?? []).length;
  fila("CARDINALPT 8 en vigas y 5 + MIRROR3 en la L", `${cp8}/${cp5}`, "10/2", cp8 === 10 && cp5 === 2);

  const iL = m.elementNames.findIndex((n, i) => n === "C1" && m.elements[i].length === 2);
  const A = m.elementInputs.areas.get(iL), I33 = m.elementInputs.momentsOfInertiaZ.get(iL), I22 = m.elementInputs.momentsOfInertiaY.get(iL);
  // ETABS 22 GetSectProps (TACNA «C ELE 1.00X1.40M»): A 0.40, I33 0.136667, I22 0.056667
  const okL = Math.abs(A - 0.4) < 1e-9 && Math.abs(I33 - 0.1366666667) < 1e-9 && Math.abs(I22 - 0.0566666667) < 1e-9;
  fila("Concrete L: A, I33, I22 = ETABS", `${A.toFixed(4)} ${I33.toFixed(6)} ${I22.toFixed(6)}`, "0.4000 0.136667 0.056667", okL,
    "A solo el alma: IGNOREFLANGEAREA + TYPE Beam");
  const okSec = /SHAPE "Concrete L"\s+D 1400 B 1000 TF 400 TW 400/.test(txt) && /CONCRETESECTION\s+"CL"\s+TYPE "Beam"/.test(txt);
  fila("se devuelve la Concrete L y su TYPE Beam", okSec ? "si" : "no", "si", okSec);
  // J de una viga PERALTADA (D > B): la formula usaba a = D como lado corto y salia ×59.
  const iV = m.elementNames.findIndex((n, i) => n === "B1" && m.elements[i].length === 2);
  const Jv = m.elementInputs.torsionalConstants.get(iV), dJ = Math.abs(Jv / 0.005508134264954427 - 1) * 100;
  fila("J viga 0.3×0.8 vs ETABS 22 (0.005508)", `${Jv.toFixed(6)} (${dJ.toFixed(2)} %)`, "< 0.2 %", dJ < 0.2, "antes 0.3277 (×59)");
  // Losa de escalera escrita por ETABS como objeto MURO (PANEL, membrana): sigue siendo PANEL y con su carga.
  const pan = /AREA "W\d+"\s+PANEL\s+4/.test(txt) && /AREALOAD\s+"W\d+".*LC "CV"/.test(txt) && /PROPTYPE\s+"Slab".*MODELINGTYPE "Membrane"/.test(txt);
  fila("PANEL horizontal (escalera) sigue PANEL, con AREALOAD y prop. losa", pan ? "si" : "no", "si", pan, "como FLOOR: T3 −3.1 % en el TACNA");
  const sx = /SEISMIC "SX".*TOPSTORY "PISO 2"/.test(txt);
  fila("sismo estatico copiado (nombres de planta)", sx ? "si" : "no", "si", sx);
  return filas;
}
