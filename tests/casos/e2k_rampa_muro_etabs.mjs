/**
 * Muro con una RAMPA de escalera inclinada apoyada en el (caso de Jorge, 16-oct-2026).
 *
 * La esquina superior de la rampa cae a mitad del borde superior del muro, no en una esquina.
 * ETABS la cose al muro (auto edge constraint); sin eso, en Struct la rampa era un MECANISMO
 * (desplazamientos de 1e13). Es lo que hacia que el TACNA saliera 10 % mas flexible por piso:
 * sus rampas tienen una esquina sobre el borde de un muro. Arreglo: hekatan-fem utils/atarAristas.
 *
 * Referencia: ETABS 22.6 por OAPI, el MISMO e2k, sin mallar (NOAUTOMESH), empuje FX 1, FY 1, FZ -2 tonf
 * en la esquina libre de la rampa. Hoy la rampa queda a ~4 % y la esquina del muro (0,0,3) a ~9 %.
 *
 * Ese resto se investigo el 16-oct-2026 (registros/TACNA_e2k_struct_vs_etabs.md, parte 5) y NO es del muro
 * ni de la rampa: el muro solo = ETABS exacto, la rampa apoyada en la esquina = ETABS a 0.07 %. Es la ATADURA.
 * Caja negra con 30 casos de ETABS: el nudo colgado NO es funcion solo de los dos extremos de la arista
 * (residuo 4 %): ETABS interpola con el campo interno de su elemento (modos incompatibles). Lo mas cercano con
 * nudos (Hermite tambien en el plano, con el drilling, y en los giros) baja la rampa a 1.4 % pero deja la
 * esquina del muro en 8.4 % y no cambia el TACNA (0.03 %): no se adopto. No volver a probar variantes nodales.
 */
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const nombre = "e2k-rampa-muro-etabs";
export const descripcion = "rampa inclinada con una esquina sobre el borde de un muro: atada como en ETABS";

const E2K = `$ File generado para test

$ PROGRAM INFORMATION
  PROGRAM  "ETABS"  VERSION "22.6.0"

$ CONTROLS
  UNITS  "TONF"  "M"  "C"
$ STORIES - IN SEQUENCE FROM TOP
  STORY "P1"  HEIGHT 3
  STORY "Base"  ELEV 0
$ MATERIAL PROPERTIES
  MATERIAL  "C280"    TYPE "Concrete"    WEIGHTPERVOLUME 2.4
  MATERIAL  "C280"    SYMTYPE "Isotropic"  E 2526713.2  U 0.15  A 9.9E-06
$ SLAB PROPERTIES
  SHELLPROP  "RAMPA"  PROPTYPE  "Slab"  MATERIAL "C280"  MODELINGTYPE "ShellThin"  SLABTYPE "Slab"  SLABTHICKNESS 0.15
$ WALL PROPERTIES
  SHELLPROP  "MURO"  PROPTYPE  "Wall"  MATERIAL "C280"  MODELINGTYPE "ShellThin"  WALLTHICKNESS 0.25
$ POINT COORDINATES
  POINT "1"  0 0
  POINT "2"  0 4
  POINT "5"  0 1
  POINT "6"  1.2 1
  POINT "7"  1.2 3
  POINT "8"  0 3
$ AREA CONNECTIVITIES
  AREA "W1"  PANEL  4  "1"  "2"  "2"  "1"  1  1  0  0
  AREA "R1"  PANEL  4  "5"  "6"  "7"  "8"  1  1  0  0
$ POINT ASSIGNS
  POINTASSIGN  "1"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "2"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "5"  "Base"  RESTRAINT "UX UY UZ"
  POINTASSIGN  "6"  "Base"  RESTRAINT "UX UY UZ"
$ AREA ASSIGNS
  AREAASSIGN  "W1"  "P1"  SECTION "MURO"  OBJMESHTYPE "NOAUTOMESH"  ADDRESTRAINT "No"
  AREAASSIGN  "R1"  "P1"  SECTION "RAMPA"  OBJMESHTYPE "NOAUTOMESH"  ADDRESTRAINT "No"
$ LOAD PATTERNS
  LOADPATTERN "PP"  TYPE  "Dead"  SELFWEIGHT  0
  LOADPATTERN "EMPUJE"  TYPE  "Other"  SELFWEIGHT  0
$ POINT OBJECT LOADS
  POINTLOAD  "7"  "P1"  TYPE "FORCE"  LC "EMPUJE"  FX 1  FY 1  FZ -2
$ LOAD CASES
  LOADCASE "EMPUJE"  TYPE  "Linear Static"  INITCOND  "PRESET"
  LOADCASE "EMPUJE"  LOADPAT  "EMPUJE"  SF 1
  END
$ END OF MODEL FILE
`;

// mm, ETABS 22.6 (tonf, m)
const ETABS = {"[0.0, 4.0, 3.0]": [-0.013102, 0.015521, -0.004713], "[0.0, 0.0, 3.0]": [0.384454, 0.01041, 0.007189], "[1.2, 3.0, 3.0]": [0.152142, 1.080048, -0.807447], "[0.0, 3.0, 3.0]": [0.149169, 0.015523, 0.001015]};

export async function correr() {
  const mod = await empaquetar(
    `export { parseE2k } from "${R}/examples/src/shared/e2kParser";
` +
    `export { coserModelo } from "${R}/examples/src/shared/e2kCoser";
` +
    `export { deformCpp } from "${R}/hekatan-fem/src/deformCpp";
`, "rampaMuro");
  const m = mod.parseE2k(E2K); mod.coserModelo(m);
  const loads = new Map();
  for (const p of m.elementInputs.cargasPorPatron.puntuales) if (p.lc === "EMPUJE") loads.set(p.node, p.v);
  const out = mod.deformCpp(m.nodes, m.elements, { ...m.nodeInputs, loads }, m.elementInputs, m.nodeInputs.springs);
  const u = (c) => { const i = m.nodes.findIndex((n) => n.every((v, j) => Math.abs(v - c[j]) < 1e-3)); return out.deformations.get(i).slice(0, 3).map((v) => v * 1000); };
  const filas = [];
  const libre = u([1.2, 3, 3]), e = ETABS["[1.2, 3.0, 3.0]"];
  const finito = libre.every((v) => Math.abs(v) < 100);
  filas.push({ que: "la rampa no es mecanismo (esquina libre < 100 mm)", crudo: true, medido: finito ? "si" : "no", limite: "si", ok: finito,
    detalle: "sin la atadura salian 1e13 mm" });
  const nE = Math.hypot(...e), d = Math.hypot(...libre.map((v, k) => v - e[k])) / nE * 100;
  filas.push({ que: "esquina libre de la rampa vs ETABS (|du|/|u|)", medido: d, limite: 5, ok: d < 5,
    detalle: `Struct ${libre.map((v) => v.toFixed(4)).join(" ")} · ETABS ${e.map((v) => v.toFixed(4)).join(" ")}` });
  const pm = u([0, 3, 3]), em = ETABS["[0.0, 3.0, 3.0]"], dm = Math.hypot(...pm.map((v, k) => v - em[k])) / Math.hypot(...em) * 100;
  filas.push({ que: "esquina de la rampa sobre el muro vs ETABS", medido: dm, limite: 5, ok: dm < 5,
    detalle: `Struct ${pm.map((v) => v.toFixed(4)).join(" ")} · ETABS ${em.map((v) => v.toFixed(4)).join(" ")}` });
  // El camino de la APP (Importar E2K): e2k -> .heks (e2kAHeks) -> cliModeler. Hasta el 16-oct-2026 el .heks no
  // llevaba la atadura y la rampa colgaba ahi aunque el lector directo si la atara.
  const { e2kAHeks } = await empaquetar(`export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";
`, "rampaHeks");
  const hk = e2kAHeks(E2K, "rampa.e2k").heks;
  const lleva = /^edge muros$/m.test(hk);
  filas.push({ que: "el .heks de la app lleva `edge muros`", crudo: true, medido: lleva ? "si" : "no", limite: "si", ok: lleva });
  const dir = mkdtempSync(join(tmpdir(), "hkRampa-")), ruta = join(dir, "rampa.heks");
  writeFileSync(ruta, hk.split(/\r?\n/).filter((l) => !/^load /.test(l) || / EMPUJE$/.test(l)).join("\n"));
  delete globalThis.__hekatanFactoresPatron;   // otro test de la suite lo deja puesto y EMPUJE entraria con factor 0
  const r = await resolverHeks(ruta);
  const iH = r.nodes.findIndex((n) => Math.abs(n[0] - 1.2) < 1e-3 && Math.abs(n[1] - 3) < 1e-3 && Math.abs(n[2] - 3) < 1e-3);
  const uh = (r.deformOutputs.deformations.get(iH) ?? [NaN, NaN, NaN]).slice(0, 3).map((v) => v * 1000);
  const dh = Math.hypot(...uh.map((v, k) => v - e[k])) / nE * 100;
  filas.push({ que: "camino de la app: esquina libre de la rampa vs ETABS", medido: dh, limite: 5, ok: dh < 5,
    detalle: `Struct (.heks) ${uh.map((v) => v.toFixed(4)).join(" ")}` });
  return filas;
}
