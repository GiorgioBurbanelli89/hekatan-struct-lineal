// Genera los e2k minimos de la «pieza B» inclinada (regla de 20 grados de ETABS): node tests/datos/e2k_losa_pendiente20_genera.mjs
// Paño 2 m (y) x 4 m (planta, x) inclinado `inc` grados bajando hacia +x; 5 correas Tubo 100x3 SUBIENDO por la pendiente (y = 0, .5, 1, 1.5, 2)
// con T/M2/M3 liberados en los dos extremos; 2 principales Tubo 150x5 en x = 0 y x = 4 (4 tramos cada una); 4 franjas de membrana con
// ONEWAYLOADDIST "Yes" entre correas; Live 1 kN/m2 (N, mm). Mismo montaje que cli/pieza_b_hek.mjs `--pend --franjas` y que pieza_b_pend.py de ETABS.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
export function e2kPiezaB(inc, ang = 90) {
  const t = Math.tan(inc * Math.PI / 180), ys = [0, 500, 1000, 1500, 2000], xs = [0, 4000], L = [];
  const pid = (xi, j) => `P${xi}_${j}`;
  L.push('$ PROGRAM INFORMATION', '  PROGRAM  "ETABS"  VERSION "22.6.0"', '', '$ CONTROLS', '  UNITS  "N"  "MM"  "C"', '',
    '$ STORIES - IN SEQUENCE FROM TOP', '  STORY "S1"  HEIGHT 3000 MASTERSTORY "Yes"', '  STORY "Base"  ELEV 0', '',
    '$ MATERIAL PROPERTIES', '  MATERIAL  "A36"    TYPE "Steel"    WEIGHTPERVOLUME 7.6972865E-05',
    '  MATERIAL  "A36"    SYMTYPE "Isotropic"  E 199947.98  U 0.3  A 1.17E-05', '',
    '$ FRAME SECTIONS', '  FRAMESECTION  "Princ"  MATERIAL "A36"  SHAPE "Steel Pipe"  D 150 T 5',
    '  FRAMESECTION  "Correa"  MATERIAL "A36"  SHAPE "Steel Pipe"  D 100 T 3', '',
    '$ SLAB PROPERTIES', '  SHELLPROP  "Cubierta"  PROPTYPE  "Slab"  MATERIAL "A36"  MODELINGTYPE "Membrane"  ONEWAYLOADDIST "Yes"  SLABTYPE "Slab"  SLABTHICKNESS 4', '',
    '$ POINT COORDINATES');
  xs.forEach((x, xi) => ys.forEach((y, j) => L.push(`  POINT "${pid(xi, j)}"  ${x} ${y} ${(x * t).toFixed(4)}`)));   // 3er numero = caida bajo la cota de la planta
  L.push('', '$ LINE CONNECTIVITIES');
  const lineas = [];
  xs.forEach((x, xi) => { for (let j = 0; j < 4; j++) { const n = `B${xi}_${j}`; L.push(`  LINE  "${n}"  BEAM  "${pid(xi, j)}"  "${pid(xi, j + 1)}"  0`); lineas.push([n, "Princ", ""]); } });
  ys.forEach((y, j) => { const n = `C${j}`; L.push(`  LINE  "${n}"  BEAM  "${pid(0, j)}"  "${pid(1, j)}"  0`); lineas.push([n, "Correa", ' RELEASE "TI M2I M3I TJ M2J M3J"']); });
  L.push('', '$ AREA CONNECTIVITIES');
  for (let j = 0; j < 4; j++) L.push(`  AREA "F${j}"  FLOOR  4  "${pid(0, j)}"  "${pid(1, j)}"  "${pid(1, j + 1)}"  "${pid(0, j + 1)}"  0  0  0  0`);
  L.push('', '$ POINT ASSIGNS');
  const apoyo = { [pid(0, 0)]: "UX UY UZ RY", [pid(0, 4)]: "UX UZ RY", [pid(1, 0)]: "UY UZ RY", [pid(1, 4)]: "UZ RY" };
  for (const [p, r] of Object.entries(apoyo)) L.push(`  POINTASSIGN  "${p}"  "S1"  RESTRAINT "${r}"`);
  L.push('', '$ LINE ASSIGNS');
  for (const [n, sec, rel] of lineas) L.push(`  LINEASSIGN  "${n}"  "S1"  SECTION "${sec}"${rel}  MINNUMSTA 3 AUTOMESH "NO"`);
  L.push('', '$ AREA ASSIGNS');
  for (let j = 0; j < 4; j++) L.push(`  AREAASSIGN  "F${j}"  "S1"  SECTION "Cubierta"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  LINECONSTRAINT  "No"  ANG ${ang}`);
  L.push('', '$ LOAD PATTERNS', '  LOADPATTERN "Dead"  TYPE  "Dead"  SELFWEIGHT  1', '  LOADPATTERN "Live"  TYPE  "Live"  SELFWEIGHT  0', '',
    '$ SHELL OBJECT LOADS');
  for (let j = 0; j < 4; j++) L.push(`  AREALOAD  "F${j}"  "S1"  TYPE "UNIFF"  DIR "GRAV"  LC "Live"  FVAL 0.001`);
  L.push('', '$ LOAD CASES', '  LOADCASE "Live"  TYPE  "Linear Static"  INITCOND  "NONE"', '  LOADCASE "Live"  LOADPAT  "Live"  SF  1', '', '$ END OF MODEL FILE', '');
  return L.join("\r\n");
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  for (const inc of [3, 19.9, 20.1, 25]) writeFileSync(join(AQUI, `e2k_losa_pendiente20_${String(inc).replace(".", "p")}.e2k`), e2kPiezaB(inc));
