// Parsea un e2k (parser TS probado) → corre el C++ → vuelca el modelo a JSON para numpy.
// Uso: npx tsx cli/dump_e2k.mts <archivo.e2k> <salida.json>
import { parseE2k } from "../examples/src/shared/e2kParser";
import { deform } from "../hekatan-fem/src/index";
import * as fs from "fs";

const inPath = process.argv[2];
const outPath = process.argv[3] ?? "C:/tmp/e2k_model.json";
const txt = fs.readFileSync(inPath, "utf-8");
const m: any = parseE2k(txt);

// Referencia C++ Hekatan sobre el MISMO modelo
const d: any = deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs, m.springsList);
let uc = 0; d.deformations.forEach((v: number[]) => { if (v[2] < uc) uc = v[2]; });
let Fz = 0; for (const [n] of m.nodeInputs.supports) { const r = d.reactions.get?.(n) ?? d.reactions[n]; }
// reacción base: sumar Rz de nodos restringidos
const reac: any = d.reactions;
m.nodeInputs.supports.forEach((_: any, n: number) => {
  const r = reac instanceof Map ? reac.get(n) : reac[n];
  if (r) Fz += r[2];
});

const mapToObj = (mp: Map<number, number> | undefined) => {
  const o: any = {}; if (mp) for (const [k, v] of mp) o[k] = v; return o;
};
const ei = m.elementInputs;
const supportsObj: any = {};
m.nodeInputs.supports.forEach((mask: boolean[], n: number) => { supportsObj[n] = mask; });
const loadsObj: any = {};
m.nodeInputs.loads.forEach((v: number[], n: number) => { loadsObj[n] = v; });

const out = {
  nodes: m.nodes, elements: m.elements,
  elementInputs: {
    elasticities: mapToObj(ei.elasticities), shearModuli: mapToObj(ei.shearModuli),
    poissonsRatios: mapToObj(ei.poissonsRatios), areas: mapToObj(ei.areas),
    momentsOfInertiaY: mapToObj(ei.momentsOfInertiaY), momentsOfInertiaZ: mapToObj(ei.momentsOfInertiaZ),
    torsionalConstants: mapToObj(ei.torsionalConstants), shearAreasY: mapToObj(ei.shearAreasY),
    thicknesses: mapToObj(ei.thicknesses),
  },
  supports: supportsObj, loads: loadsObj,
  springs: m.springsList,   // Winkler {node, dof, k}
};
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(`parseE2k: ${m.nodes.length} nodos, ${m.elements.length} elementos (${m.info?.nFrames} frames, ${m.info?.nAreas} areas)`);
console.log(`C++ Hekatan:  U3 = ${(uc * 1000).toFixed(4)} mm   Fz_base = ${Fz.toFixed(2)} kN`);
console.log(`JSON → ${outPath}`);
