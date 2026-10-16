/**
 * Muro con una RAMPA de escalera inclinada apoyada en el (caso de Jorge, 16-oct-2026).
 *
 * La esquina superior de la rampa cae a mitad del borde superior del muro, no en una esquina.
 * ETABS la cose al muro (auto edge constraint); sin eso, en Struct la rampa era un MECANISMO
 * (desplazamientos de 1e13). Es lo que hacia que el TACNA saliera 10 % mas flexible por piso:
 * sus rampas tienen una esquina sobre el borde de un muro. Arreglo: hekatan-fem utils/atarAristas.
 *
 * Referencia: ETABS 22.6 por OAPI, el MISMO e2k, sin mallar (NOAUTOMESH), empuje FX 1, FY 1, FZ -2 tonf
 * en la esquina libre de la rampa. Hoy la rampa queda a ~4 % y el borde del muro a ~10 %: la flexion
 * fuera del plano que pasa por la atadura (Hermite) no es exactamente la de ETABS (pendiente).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

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
  return filas;
}
