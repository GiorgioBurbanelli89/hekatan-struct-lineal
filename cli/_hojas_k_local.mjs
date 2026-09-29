// Escribe la hoja LISP de un paño y de una barra (los del test) para pintarlas con _hoja_lisp_png.
import { writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const pn = await empaquetar(`export * from "${R}/hekatan-ui/src/cad/kLocalPano";\n`, "kLocalPano");
const br = await empaquetar(`export * from "${R}/hekatan-ui/src/cad/kLocalBarra";\n`, "kLocalBarra");
const m = (v) => new Map([[0, v]]);
const P = [[0, 0, 0], [4, 0, 0], [3.2, 2.5, 0], [0.6, 2.2, 0]];
for (const [tipo, nom] of [[0, "thick"], [1, "thin"]]) {
  const ei = { elasticities: m(2.2e7), thicknesses: m(0.2), poissonsRatios: m(0.2) };
  if (tipo) ei.plateFormulations = m(1);
  const d = pn.datosPano({ nodes: { val: P }, elements: { val: [[0, 1, 2, 3]] }, elementInputs: { val: ei } }, 0);
  writeFileSync(`cli/shots/hoja_k/pano_${nom}_sim.hoja`, pn.hojaPanoSimbolica(d));
  writeFileSync(`cli/shots/hoja_k/pano_${nom}_num.hoja`, pn.hojaPanoNumerica(d));
}
const E = 2.0e8, G = E / 2.6;
const ei = { elasticities: m(E), shearModuli: m(G), areas: m(0.0096), momentsOfInertiaZ: m(1.2e-4), momentsOfInertiaY: m(2.1e-5),
  torsionalConstants: m(3.4e-6), shearAreasZ: m(0.004), shearAreasY: m(0.006), localAngles: m(0) };
const st = { nodes: { val: [[0, 0, 0], [5, 0, 0]] }, elements: { val: [[0, 1]] }, elementInputs: { val: ei } };
writeFileSync("cli/shots/hoja_k/barra_sim.hoja", br.hojaBarraSimbolica(br.datosBarra(st, 0), br.kLocalBarra(st, 0)));
writeFileSync("cli/shots/hoja_k/barra_num.hoja", br.hojaBarraNumerica(br.datosBarra(st, 0), br.kLocalBarra(st, 0), br.elementosDelModelo(st)));
console.log("hojas escritas");
