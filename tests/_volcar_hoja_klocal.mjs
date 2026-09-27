// Vuelca la hoja de Hekatan LISP de una barra de ejemplo (para renderizarla con el motor y mirarla).
import { writeFileSync } from "node:fs";
import { empaquetar, R } from "./lib/bundle.mjs";
const tj = await empaquetar(`export * from "${R}/hekatan-ui/src/cad/kLocalBarra";\n`, "kLocalBarra");
const E = 2.0e8, G = E / 2.6, m = (v) => new Map([[0, v]]);
const st = { nodes: { val: [[0, 0, 0], [0, 0, 3.5]] }, elements: { val: [[0, 1], [0, 1]] },
  elementInputs: { val: { elasticities: m(E), shearModuli: m(G), areas: m(0.0096), momentsOfInertiaZ: m(1.2e-4),
    momentsOfInertiaY: m(2.1e-5), torsionalConstants: m(3.4e-6), shearAreasZ: m(0.004), shearAreasY: m(0.006), localAngles: m(0) } } };
const d = tj.datosBarra(st, 0), K = tj.kLocalBarra(st, 0);
writeFileSync(process.argv[2], tj.hojaBarra(d, K, tj.elementosDelModelo(st)), "utf-8");
console.log("hoja escrita:", process.argv[2]);
