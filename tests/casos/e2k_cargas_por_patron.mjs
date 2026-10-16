/**
 * Un .e2k de ETABS con VARIOS patrones (CM, CV, CV TECHO...) vuelve a salir con
 * sus patrones y sus cargas, cada una en el suyo, al exportarlo desde el modelo.
 *
 * Hasta el 16-oct-2026 el lector fundia todos los patrones en una carga por nudo
 * y el exportador, en modo "auto", omitia toda FZ creyendola peso propio: el
 * TACNA (8 patrones, 80 LINELOAD, 224 AREALOAD) salia con Dead/Live y ΣFZ = 0.
 *
 * Se mide la FUERZA TOTAL de cada patron releyendo el fichero exportado
 * (w·L por barra, q·A por area, F puntual), no el texto: los nombres de LINE,
 * AREA y planta cambian al exportar. El arbitro de verdad es ETABS
 * (registros/TACNA_e2k_struct_vs_etabs.md).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "e2k-cargas-por-patron";
export const descripcion =
  "e2k de ETABS → Struct → e2k: mismos patrones y misma carga total por patron";

const cargar = () => empaquetar(
  `export { parseE2k } from "${R}/examples/src/shared/e2kParser";\n` +
  `export { exportE2k } from "${R}/examples/src/shared/e2kExporter";\n`, "e2kPorPatron");

// Portico de 1 piso 6×5 m (TONF, M): 4 columnas, 4 vigas y una losa encima.
const E2K = `$ CONTROLS
  UNITS  "TONF"  "M"  "C"
$ STORIES - IN SEQUENCE FROM TOP
  STORY "P1"  HEIGHT 3
  STORY "Base"  ELEV 0
$ MATERIAL PROPERTIES
  MATERIAL  "C280"    TYPE "Concrete"    WEIGHTPERVOLUME 2.4
  MATERIAL  "C280"    SYMTYPE "Isotropic"  E 2526713.2  U 0.15  A 9.9E-06
$ FRAME SECTIONS
  FRAMESECTION  "COL"  MATERIAL "C280"  SHAPE "Concrete Rectangular"  D 0.5 B 0.5
  FRAMESECTION  "VIG"  MATERIAL "C280"  SHAPE "Concrete Rectangular"  D 0.6 B 0.3
$ SLAB PROPERTIES
  SHELLPROP  "LOSA"  PROPTYPE  "Slab"  MATERIAL "C280"  MODELINGTYPE "ShellThin"  SLABTYPE "Slab"  SLABTHICKNESS 0.2
$ POINT COORDINATES
  POINT "1"  0 0
  POINT "2"  6 0
  POINT "3"  6 5
  POINT "4"  0 5
$ LINE CONNECTIVITIES
  LINE  "C1"  COLUMN  "1"  "1"  1
  LINE  "C2"  COLUMN  "2"  "2"  1
  LINE  "C3"  COLUMN  "3"  "3"  1
  LINE  "C4"  COLUMN  "4"  "4"  1
  LINE  "B1"  BEAM  "1"  "2"  0
  LINE  "B2"  BEAM  "2"  "3"  0
  LINE  "B3"  BEAM  "3"  "4"  0
  LINE  "B4"  BEAM  "4"  "1"  0
$ AREA CONNECTIVITIES
  AREA "F1"  FLOOR  4  "1"  "2"  "3"  "4"  0  0  0  0
$ POINT ASSIGNS
  POINTASSIGN  "1"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "2"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "3"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "4"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
$ LINE ASSIGNS
  LINEASSIGN  "C1"  "P1"  SECTION "COL"
  LINEASSIGN  "C2"  "P1"  SECTION "COL"
  LINEASSIGN  "C3"  "P1"  SECTION "COL"
  LINEASSIGN  "C4"  "P1"  SECTION "COL"
  LINEASSIGN  "B1"  "P1"  SECTION "VIG"
  LINEASSIGN  "B2"  "P1"  SECTION "VIG"
  LINEASSIGN  "B3"  "P1"  SECTION "VIG"
  LINEASSIGN  "B4"  "P1"  SECTION "VIG"
$ AREA ASSIGNS
  AREAASSIGN  "F1"  "P1"  SECTION "LOSA"
$ LOAD PATTERNS
  LOADPATTERN "PESO PROPIO"  TYPE  "Dead"  SELFWEIGHT  1
  LOADPATTERN "CM"  TYPE  "Super Dead"  SELFWEIGHT  0
  LOADPATTERN "CV"  TYPE  "Reducible Live"  SELFWEIGHT  0
$ POINT OBJECT LOADS
  POINTLOAD  "3"  "P1"  TYPE "FORCE"  LC "CV"  FZ -2
$ FRAME OBJECT LOADS
  LINELOAD  "B1"  "P1"  TYPE "UNIFF"  DIR "GRAV"  LC "CM"  FVAL 0.45
  LINELOAD  "B3"  "P1"  TYPE "UNIFF"  DIR "GRAV"  LC "CM"  FVAL 0.45
  LINELOAD  "B2"  "P1"  TYPE "TRAPF"  DIR "GRAV"  LC "CV"  FSTART 0.2  FEND 0.6  RDSTART 0  RDEND 1
$ SHELL OBJECT LOADS
  AREALOAD  "F1"  "P1"  TYPE "UNIFF"  DIR "GRAV"  LC "CM"  FVAL 0.2
  AREALOAD  "F1"  "P1"  TYPE "UNIFF"  DIR "GRAV"  LC "CV"  FVAL 0.25
$ MASS SOURCE
  MASSSOURCE  "MASA 01"    INCLUDEELEMENTS "Yes"    INCLUDEADDEDMASS "No"    INCLUDELOADS "Yes"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "No"    LUMPATSTORIES "Yes"    ISDEFAULT "Yes"
  MASSSOURCELOAD  "MASA 01"  "CM"  1
  MASSSOURCELOAD  "MASA 01"  "CV"  0.5
  END
$ END OF MODEL FILE
`;

/** Fuerza vertical total por patron (kN, hacia abajo +), con la geometria del motor. */
function totales(m) {
  const c = m.elementInputs.cargasPorPatron, t = {};
  const add = (lc, v) => { t[lc] = (t[lc] ?? 0) + v; };
  const L = (e) => { const [a, b] = e.map((n) => m.nodes[n]); return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); };
  for (const b of c.barras) {
    const l = L(m.elements[b.elem]);
    add(b.lc, b.type === "TRAPF" ? (b.fs + b.fe) / 2 * ((b.re ?? 1) - (b.rs ?? 0)) * l : b.val * l);
  }
  for (const a of c.areas) {
    const p = m.elements[a.elem].map((n) => m.nodes[n]);
    let nz = 0;
    for (let k = 0; k < p.length; k++) { const u = p[k], v = p[(k + 1) % p.length]; nz += u[0] * v[1] - u[1] * v[0]; }
    add(a.lc, a.q * Math.abs(nz) / 2);
  }
  for (const p of c.puntuales) add(p.lc, -p.v[2]);
  return t;
}

export async function correr() {
  const { parseE2k, exportE2k } = await cargar();
  const m1 = parseE2k(E2K);
  // SIN e2kModel: que escriba desde el modelo, no copiando el texto de ETABS.
  const txt = exportE2k({ nodes: m1.nodes, elements: m1.elements, nodeInputs: m1.nodeInputs,
    elementInputs: m1.elementInputs, title: "por patron",
    units: { force: m1.units.force, length: m1.units.length } });
  const m2 = parseE2k(txt);
  const filas = [];

  const pat = (m) => (m.elementInputs.cargasPorPatron?.patrones ?? []).map((p) => `${p.name}:${p.type}:${p.sw}`).join("|");
  filas.push({ que: "mismos patrones (nombre, tipo, SELFWEIGHT)", crudo: true,
    medido: pat(m2), limite: pat(m1), ok: pat(m1) === pat(m2), detalle: "antes salian Dead y Live" });

  const t1 = totales(m1), t2 = totales(m2);
  // A mano (tonf → kN): CM = 0.45·6·2 + 0.2·30 = 11.4 ; CV = 0.4·5 + 0.25·30 + 2 = 11.5
  const g = 9.80665, esperado = { CM: 11.4 * g, CV: 11.5 * g };
  for (const lc of ["CM", "CV"]) {
    const d = Math.abs(t2[lc] - esperado[lc]) / esperado[lc] * 100;
    filas.push({ que: `ΣFZ ${lc} tras la ida y vuelta, dif. vs a mano`, medido: d,
      limite: 1e-6, ok: d < 1e-6, detalle: `${(t2[lc] ?? 0).toFixed(4)} kN, a mano ${esperado[lc].toFixed(4)}, al leer ${t1[lc].toFixed(4)}` });
  }
  const nLin = (txt.match(/^\s*LINELOAD\s/gm) ?? []).length, nArea = (txt.match(/^\s*AREALOAD\s/gm) ?? []).length;
  filas.push({ que: "LINELOAD y AREALOAD escritas", crudo: true, medido: `${nLin}/${nArea}`, limite: "3/2",
    ok: nLin === 3 && nArea === 2, detalle: "una TRAPF incluida" });
  const masa = /MASSSOURCELOAD\s+"MASA 01"\s+"CV"\s+0\.5/.test(txt);
  filas.push({ que: "fuente de masa del fichero (CM 1 + CV 0.5)", crudo: true, medido: masa ? "si" : "no",
    limite: "si", ok: masa, detalle: "antes: Dead 1, que ya no existe" });
  return filas;
}
