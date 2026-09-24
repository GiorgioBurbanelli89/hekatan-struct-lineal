import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const m = await empaquetar(`export * from "${R}/examples/src/shared/e2kParser";\n`, "gs");
const ol = console.log, ow = console.warn; console.log = () => {}; console.warn = () => {};
const r = m.parseE2k(readFileSync(process.argv[2], "utf-8"));
console.log = ol; console.warn = ow;
// componentes conexas y cuáles no llegan a apoyo
const ady = new Map(); for (const e of r.elements) for (const a of e) for (const b of e) if (a !== b) { if (!ady.has(a)) ady.set(a, []); ady.get(a).push(b); }
const usados = new Set(r.elements.flat()); const sup = new Set([...(r.nodeInputs?.supports ?? new Map()).keys()]);
const visto = new Set(); const trozos = [];
for (const s of usados) { if (visto.has(s)) continue; const pila = [s], c = []; visto.add(s);
  while (pila.length) { const v = pila.pop(); c.push(v); for (const w of ady.get(v) ?? []) if (!visto.has(w)) { visto.add(w); pila.push(w); } }
  trozos.push(c); }
const zs = (c) => { const z = c.map(i => r.nodes[i][2]); return [Math.min(...z).toFixed(3), Math.max(...z).toFixed(3)]; };
console.log("nudos", r.nodes.length, "elementos", r.elements.length, "trozos", trozos.length);
trozos.forEach((c, k) => { const apoyo = c.some(i => sup.has(i)); console.log(`trozo ${k}: ${c.length} nudos · z ${zs(c).join("..")} · ${apoyo ? "con apoyo" : "SUELTO"}` + (apoyo ? "" : " · ej: " + c.slice(0, 3).map(i => r.nodes[i].map(v => v.toFixed(2)).join(",")).join(" | "))); });
// nudos de borde de cada trozo en las cotas de corte, y el nudo MÁS CERCANO de otro trozo
const trozoDe = new Map(); trozos.forEach((c, k) => c.forEach(i => trozoDe.set(i, k)));
for (const zc of [6.0, 7.3125, 8.25, 8.8125, 9.0]) {
  const en = [...usados].filter(i => Math.abs(r.nodes[i][2] - zc) < 1e-3);
  const porTrozo = {}; en.forEach(i => { const k = trozoDe.get(i); (porTrozo[k] ??= []).push(i); });
  const pares = [];
  for (const i of en) { let d = 1e9, j0 = -1; for (const j of en) { if (trozoDe.get(j) === trozoDe.get(i)) continue; const q = Math.hypot(...[0,1,2].map(c => r.nodes[i][c] - r.nodes[j][c])); if (q < d) { d = q; j0 = j; } }
    if (j0 >= 0 && d < 0.5) pares.push(`${r.nodes[i].map(v => v.toFixed(3)).join(",")}(t${trozoDe.get(i)})~t${trozoDe.get(j0)} d=${d.toFixed(4)}`); }
  console.log(`z=${zc}: ${en.length} nudos en trozos ${JSON.stringify(Object.fromEntries(Object.entries(porTrozo).map(([k, v]) => [k, v.length])))} · coincidencias entre trozos: ${pares.length ? pares.slice(0, 4).join(" | ") : "NINGUNA a < 0.5 m"}`);
}
