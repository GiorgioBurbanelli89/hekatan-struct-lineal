/**
 * E2K: el PUNTO DE INSERCION (CARDINALPT) llega al motor. ETABS cuelga la viga del nudo (CARDINALPT 8 = arriba al
 * centro): el centroide queda D/2 por debajo, d2 = -D/2 en ejes locales. Antes `e2kAHeks` guardaba el CARDINALPT como
 * texto y el .heks no llevaba el canto, asi que `insertionOffsets` quedaba vacio y mercado.e2k daba Uy 34.8 mm contra
 * 7.0 de ETABS (con el desfase: 7.2). Se prueba por el MISMO camino de la app (e2k -> .heks -> cliModeler).
 */
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "e2k-punto-insercion";
export const descripcion = "e2k: viga CARDINALPT 8 sobre dos columnas -> insertionOffsets d2 = -D/2 y la respuesta cambia respecto a CARDINALPT 10";

const e2k = (cp) => `$ CONTROLS
  UNITS  "N"  "MM"  "C"

$ STORIES - IN SEQUENCE FROM TOP
  STORY "Level_1"  HEIGHT 3000 MASTERSTORY "Yes"
  STORY "Base"  ELEV 0

$ MATERIAL PROPERTIES
  MATERIAL  "Conc_1"    TYPE "Concrete"    WEIGHTPERVOLUME 0
  MATERIAL  "Conc_1"    SYMTYPE "Isotropic"  E 25000  U 0.2  A 0.00001
  MATERIAL  "Conc_1"    FC 24

$ FRAME SECTIONS
  FRAMESECTION  "VIGA"  MATERIAL "Conc_1"  SHAPE "Concrete Rectangular"  D 600 B 300
  FRAMESECTION  "COL"  MATERIAL "Conc_1"  SHAPE "Concrete Rectangular"  D 400 B 400

$ POINT COORDINATES
  POINT "1"  0 0
  POINT "2"  6000 0

$ LINE CONNECTIVITIES
  LINE  "C1"  COLUMN  "1"  "1"  1
  LINE  "C2"  COLUMN  "2"  "2"  1
  LINE  "B1"  BEAM  "1"  "2"  0

$ POINT ASSIGNS
  POINTASSIGN  "1"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "2"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"

$ LINE ASSIGNS
  LINEASSIGN  "C1"  "Level_1"  SECTION "COL"
  LINEASSIGN  "C2"  "Level_1"  SECTION "COL"
  LINEASSIGN  "B1"  "Level_1"  SECTION "VIGA"  CARDINALPT ${cp}

$ POINT OBJECT LOADS
  POINTLOAD  "1"  "Level_1"  TYPE "FORCE"  LC "Dead"  FX 50000  FY 0  FZ 0  MX 0  MY 0  MZ 0

$ FRAME OBJECT LOADS
  LINELOAD  "B1"  "Level_1"  TYPE "UNIFF"  DIR "GRAV"  LC "Dead"  FVAL 30

$ LOAD PATTERNS
  LOADPATTERN "Dead"  TYPE  "Dead"  SELFWEIGHT  0

$ LOAD CASES
  LOADCASE "Dead"  TYPE  "Linear Static"  INITCOND  "PRESET"
  LOADCASE "Dead"  LOADPAT  "Dead"  SF 1

$ END OF MODEL FILE
`;

export async function correr() {
  const { e2kAHeks } = await empaquetar(`export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";\n`, "e2k-ins");
  const dir = mkdtempSync(join(tmpdir(), "e2kins-"));
  const warn = console.warn; console.warn = () => {};
  const resolver = async (cp) => {
    const r = e2kAHeks(e2k(cp), `ins${cp}.e2k`);
    const f = join(dir, `ins${cp}.heks`); writeFileSync(f, r.heks);
    return { r, s: await resolverHeks(f) };
  };
  let a, b;
  try { a = await resolver(8); b = await resolver(10); } finally { console.warn = warn; }

  const ei = a.s.elementInputs, vigas = [];
  a.s.elements.forEach((el, e) => { const p = a.s.nodes[el[0]], q = a.s.nodes[el[1]];
    if (el.length === 2 && Math.abs(p[2] - q[2]) < 1e-6) vigas.push(e); });
  const d2 = vigas.map((e) => ei.insertionOffsets?.get(e)?.[0]);
  const uMax = (s, k) => { let m = 0; for (const [, v] of s.deformOutputs.deformations) m = Math.max(m, Math.abs(v[k])); return m; };
  const sway8 = uMax(a.s, 0) * 1000, sway10 = uMax(b.s, 0) * 1000;
  const sinIns10 = !b.s.elementInputs.insertionOffsets || b.s.elementInputs.insertionOffsets.size === 0;
  const dif = Math.abs(sway8 - sway10) / sway10;
  return [
    { que: "viga CARDINALPT 8: tiene insertionOffsets", crudo: true, medido: d2.length, limite: ">= 1 con d2",
      ok: vigas.length > 0 && d2.every((v) => v !== undefined), detalle: `${vigas.length} tramos de viga` },
    { que: "viga D=0.6 m: d2 = -D/2 = -0.3 m", crudo: true, medido: d2.map((v) => v?.toFixed(4)).join(","), limite: "-0.3000",
      ok: d2.length > 0 && d2.every((v) => v !== undefined && Math.abs(v + 0.3) < 1e-6), detalle: "cardinal 7-9: centroide D/2 por debajo del nudo" },
    { que: "CARDINALPT 10 (centroide): sin insertionOffsets", crudo: true, medido: sinIns10 ? "vacio" : "con desfase", limite: "vacio", ok: sinIns10, detalle: "" },
    { que: "el desplazamiento horizontal cambia 8 vs 10 (mm)", crudo: true, medido: `${sway8.toFixed(4)} vs ${sway10.toFixed(4)} (${(dif * 100).toFixed(2)} %)`,
      limite: "> 0.5 %", ok: dif > 0.005, detalle: "mismo modelo, solo cambia el punto de insercion" },
  ];
}
