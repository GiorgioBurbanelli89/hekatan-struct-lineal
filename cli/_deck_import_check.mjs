import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const m = await empaquetar(`export * from "${R}/examples/src/shared/e2kParser";\nexport * from "${R}/examples/src/shared/e2kExporter";\n`, "dk");
const txt = readFileSync(process.argv[2], "utf-8");
const fn = m.parseE2k || m.parseE2K || Object.values(m).find(f => typeof f === "function" && /parse/i.test(f.name));
const r = fn(txt);
const ei = r.elementInputs ?? r;
const nodes = r.nodes, els = r.elements;
let peso = 0, n = 0;
for (const [i, t] of ei.thicknesses ?? []) {
  const e = els[i]; if (!e || e.length !== 4) continue;
  const P = e.map(k => nodes[k]);
  const cr = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const sub = (a, b) => a.map((v, k) => v - b[k]);
  const c = cr(sub(P[2], P[0]), sub(P[3], P[1]));
  const A = Math.hypot(...c) / 2;
  peso += ei.densities.get(i) * 9.80665 * t * A; n++;
  if (n === 1) console.log("t =", t, "rho(t/m3) =", ei.densities.get(i), "deck =", JSON.stringify(ei.deckSections?.get(i)));
}
console.log("shells", n, "peso membrana kN =", peso.toFixed(4));
const exp = m.exportE2k || m.exportToE2k || Object.values(m).find(f => typeof f === "function" && /e2k/i.test(f.name) && /export|write|to/i.test(f.name));
console.log("exporter:", exp?.name);
