#!/usr/bin/env node
// e2k -> parseE2k -> exportE2k -> e2k (sin navegador). uso: node cli/e2k_roundtrip_mercado.mjs in.e2k out.e2k
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const m = await empaquetar(`export { parseE2k } from "${R}/examples/src/shared/e2kParser";\nexport { exportE2k } from "${R}/examples/src/shared/e2kExporter";\n`, "rt");
const model = m.parseE2k(readFileSync(process.argv[2], "utf-8"));
console.log("nodos", model.info.nNodes, "frames", model.info.nFrames, "areas", model.info.nAreas);
const out = m.exportE2k({ nodes: model.nodes, elements: model.elements, nodeInputs: model.nodeInputs,
  elementInputs: model.elementInputs, title: model.info.title,
  units: { force: model.units.force, length: model.units.length }, ...(process.argv[4]==="scratch" ? {} : { e2kModel: model }) });
writeFileSync(process.argv[3], out); console.log("escrito", out.length);
