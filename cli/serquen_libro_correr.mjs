// Resuelve el .heks de Serquen (cli/serquen_libro_heks.py) por cliModeler, patron a patron, y compara con SAP2000 (GUI).
//   node --max-old-space-size=6000 cli/serquen_libro_correr.mjs modelo.heks [PATRON ...]
import { resolverHeks } from "../tests/lib/heks.mjs";
const [ruta, ...pats] = process.argv.slice(2);
const casos = pats.length ? pats : ["RECTANGULAR", "PUNTUAL", "LINEAL"];
const SAP = { RECTANGULAR: [-14.0951, -1.0189, -2.9878], PUNTUAL: [-155.7742, -0.4850, -2.3926], LINEAL: [-0.1129, -1.1517, -0.1451] };
const PUNTOS = [[0, 0, 10], [5, 0, 10], [0, 0, 5]];
const res = {};
for (const p of casos) {
  globalThis.__hekatanFactoresPatron = { [p]: 1 };
  const t0 = Date.now(); const ol = console.log; const lg = []; console.log = (...a) => lg.push(a.join(" "));
  const H = await resolverHeks(ruta);
  console.log = ol; if (!H.deformOutputs?.deformations) { console.log(lg.slice(-15).join("\n")); console.log(Object.keys(H.deformOutputs||{}), H.nodes.length, H.elements.length); continue; }
  const idx = new Map(); H.nodes.forEach((xyz, i) => idx.set(xyz.map((v) => v.toFixed(3)).join("|"), i));
  const uz = PUNTOS.map((q) => 1000 * (H.deformOutputs.deformations.get(idx.get(q.map((v) => v.toFixed(3)).join("|")))?.[2] ?? NaN));
  res[p] = uz;
  const s = SAP[p] ?? [];
  console.log(`${p.padEnd(12)} ${((Date.now() - t0) / 1000).toFixed(1)} s  ` + uz.map((v, k) => `Uz${JSON.stringify(PUNTOS[k])} ${v.toFixed(4)} mm (SAP ${s[k]}, ${(100 * (v - s[k]) / s[k]).toFixed(4)} %)`).join("   "));
}

