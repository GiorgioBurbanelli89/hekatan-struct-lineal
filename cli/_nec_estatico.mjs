// Capa NEC 2: cortante estático NEC-15 y borrador del volcado. node cli/_nec_estatico.mjs dump.json [Tcomp]
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync(process.argv[2], "utf-8")), Tc = process.argv[3] ? +process.argv[3] : undefined;
const m = await empaquetar(`export { pisosDeModelo } from "${R}/examples/src/shared/nec/pisos";
export { cortanteEstatico, espectro, PORTOVIEJO_D } from "${R}/examples/src/shared/nec/estatico";\n`, "nece" + Date.now());
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const P = m.pisosDeModelo(D.nodes, D.elements, { supports: aMap(D.nodeInputs.supports), diaphragms: aMap(D.nodeInputs.diaphragms) }, ei);
for (const norma of ["NEC-15", "borrador"]) {
  const d = m.PORTOVIEJO_D[norma], e = m.cortanteEstatico(d, P, Tc), sp = m.espectro(d);
  console.log(`== ${norma}: meseta ${sp.meseta.toFixed(3)} g, Tc ${sp.Tc.toFixed(3)} s · Ta ${e.Ta.toFixed(4)} s, T ${e.T.toFixed(4)} s, Sa ${e.Sa.toFixed(4)} g, k ${e.k.toFixed(3)} · W ${e.W.toFixed(1)} kN · Cs ${e.Cs.toFixed(4)} · V ${e.V.toFixed(1)} kN${e.Vmin ? ` (Vmin ${e.Vmin.toFixed(1)})` : ""}`);
  for (const p of e.pisos.slice().reverse()) console.log(`   piso ${p.k}  z ${p.z.toFixed(2)}  w ${p.w.toFixed(1)}  F ${p.F.toFixed(2)}  V ${p.Vpiso.toFixed(2)}`);
}
