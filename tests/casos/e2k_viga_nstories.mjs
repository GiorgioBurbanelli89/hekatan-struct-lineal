/**
 * E2K: una BEAM con nStories 1 tiene su primer punto UNA planta mas abajo (medido en ETABS 22, mercado.e2k:
 * `LINE "B134" BEAM "13" "203" 1` en N6 va de Z=11940 a 12640-1476.7). Y una columna que atraviesa plantas no crea
 * joints intermedios si nadie los usa (14745 frames de ETABS = 14745 LINEASSIGN).
 */
import { empaquetar, R } from "../lib/bundle.mjs";
const mod = await empaquetar(`export { parseE2k } from "${R}/examples/src/shared/e2kParser";\n`, "e2k-vnst");
const e2k = `$ STORIES - IN SEQUENCE FROM TOP
  STORY "S2"  HEIGHT 3000 MASTERSTORY "Yes"
  STORY "S1"  HEIGHT 3000 MASTERSTORY "Yes"
  STORY "Base"  ELEV 0

$ POINT COORDINATES
  POINT "1"  0 0
  POINT "2"  1000 0 500
  POINT "3"  0 0 1000

$ LINE CONNECTIVITIES
  LINE  "B1"  BEAM  "1"  "2"  1
  LINE  "C1"  COLUMN  "3"  "3"  2

$ LINE ASSIGNS
  LINEASSIGN  "B1"  "S2"  SECTION "X"  MINNUMSTA 3
  LINEASSIGN  "C1"  "S2"  SECTION "X"  MINNUMSTA 3

$ END OF MODEL FILE
`;
export const nombre = "e2k-viga-nstories";
export const descripcion = "BEAM con nStories 1 baja una planta el primer punto; la columna de varias plantas no se parte sin motivo";

export async function correr() {
  const m = mod.parseE2k(e2k);
  const viga = m.elements.findIndex((_, i) => m.elementTypes[i] === "BEAM");
  const [a, b] = m.elements[viga].map((n) => m.nodes[n][2]);
  const col = m.elements.filter((_, i) => m.elementTypes[i] === "COLUMN").length;
  return [
    { que: "viga nStories 1: Z del punto 1 (mm)", crudo: true, medido: a, limite: "3000", ok: Math.abs(a - 3000) < 1e-6, detalle: `esperado 3000` },
    { que: "viga nStories 1: Z del punto 2 (mm)", crudo: true, medido: b, limite: "5500", ok: Math.abs(b - 5500) < 1e-6, detalle: `esperado 5500` },
    { que: "columna de 2 plantas sin partir (trozos)", crudo: true, medido: col, limite: "1", ok: col === 1, detalle: `esperado 1` },
  ];
}
