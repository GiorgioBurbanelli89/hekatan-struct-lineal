#!/usr/bin/env node
// e2k -> importar -> editar (borra la ultima barra y mueve el nudo 0 en +X) -> exportar. uso: node cli/e2k_edicion_demo.mjs in.e2k out.e2k
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const m = await empaquetar(`export { parseE2k } from "${R}/examples/src/shared/e2kParser";\nexport { exportE2k } from "${R}/examples/src/shared/e2kExporter";\n`, "rt");
const md = m.parseE2k(readFileSync(process.argv[2], "utf-8"));
const nodes = md.nodes.map((n) => [...n]); nodes[md.nodes.length - 1][0] += 0.1;
const avisos = [];
const out = m.exportE2k({ nodes, elements: md.elements.slice(0, -1), nodeInputs: md.nodeInputs, elementInputs: md.elementInputs, title: md.info.title, units: md.units, e2kModel: md, avisos });
writeFileSync(process.argv[3], out); console.log("escrito", out.length, "avisos", avisos);
