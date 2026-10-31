// Vuelca las hojas simbólica y numérica de DKT, DKQ y triángulo grueso con los datos de un paño y la K del solver (diagonal)
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { writeFileSync } from "node:fs";
const pn = await empaquetar(`export * from "${R}/hekatan-ui/src/cad/kLocalPano";\n`, "kLocalPano");
const casos = [
  ["dkt", [[0,0,0],[2,0.5,0],[0.5,1.5,0]], 1], ["dkq", [[0,0,0],[4,0,0],[3.2,2.5,0],[0.6,2.2,0]], 1], ["thick", [[0,0,0],[2,0.5,0],[0.5,1.5,0]], 0],
];
const E = 24850000, NU = 0.2, T = 0.1;
for (const [nom, P, tipo] of casos) {
  const m = (v) => new Map([[0, v]]);
  const ei = { elasticities: m(E), thicknesses: m(T), poissonsRatios: m(NU), shearModuli: m(E/(2*(1+NU))), plateFormulations: m(tipo) };
  const st = { nodes: { val: P }, elements: { val: [P.map((_, i) => i)] }, elementInputs: { val: ei } };
  const d = pn.datosPano(st, 0);
  writeFileSync(`${process.env.HP}/${nom}_num.lisp`, pn.hojaPanoNumerica(d));
  writeFileSync(`${process.env.HP}/${nom}_simb.lisp`, pn.hojaPanoSimbolica(d));
  const F = d.k.flexion;
  console.log(nom, "diag K solver:", [0,1,2].map((i) => F[i][i].toFixed(6)).join(" "));
}
