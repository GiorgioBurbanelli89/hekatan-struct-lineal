// Un paño no puede depender de por qué esquina se empiezan a numerar sus nudos. Losa trapecial 2×2
// paños, empotrada en un borde, carga en el otro: se resuelve con la numeración de siempre y con la
// de cada paño girada una esquina. Tipos: 0 MITC4, 1 DKQ, 3 DKMQ, 4 DSE. Y membrana (carga en el plano).
import { cargarFem } from "../tests/lib/bundle.mjs";
const fem = await cargarFem();
const P = [[0, 0, 0], [2.2, 0, 0], [4, 0, 0], [0.3, 1.4, 0], [2.0, 1.6, 0], [3.6, 1.7, 0], [0.8, 3, 0], [2.1, 3.1, 0], [3.1, 3.3, 0]];
const E0 = [[0, 1, 4, 3], [1, 2, 5, 4], [3, 4, 7, 6], [4, 5, 8, 7]];
const gira = (e, k) => e.map((_, i) => e[(i + k) % 4]);
const fijos = [0, 3, 6];
const carga = new Map([[2, [5, 3, -20, 1, 2, 0.5]], [5, [4, -2, -30, 0, 1, 0]], [8, [3, 1, -20, -1, 2, 0.3]]]);
for (const tipo of [0, 1, 3, 4]) {
  const sol = [];
  for (const k of [0, 1, 2]) {
    const el = E0.map((e) => gira(e, k));
    const m = (v) => new Map(el.map((_, i) => [i, v]));
    const ei = { elasticities: m(2.2e7), thicknesses: m(0.25), poissonsRatios: m(0.2), shearModuli: m(2.2e7 / 2.4), plateFormulations: m(tipo) };
    const out = fem.deform(P, el, { supports: new Map(fijos.map((i) => [i, [true, true, true, true, true, true]])), loads: carga }, ei);
    sol.push(out.deformations.get(8));
  }
  const mx = Math.max(...sol[0].map(Math.abs));
  const d = Math.max(...sol.slice(1).flatMap((s) => s.map((v, i) => Math.abs(v - sol[0][i])))) / mx;
  console.log(`tipo ${tipo}: nudo 9 = [${sol[0].map((v) => v.toExponential(4)).join(", ")}] · cambia al girar la numeración ${(d * 100).toExponential(2)} %`);
}
