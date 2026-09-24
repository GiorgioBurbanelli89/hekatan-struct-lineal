import { writeFileSync } from "node:fs";
import { resolverHeks } from "../../tests/lib/heks.mjs";
const [heks, out] = process.argv.slice(2);
const m = await resolverHeks(heks);
const a = m.analyzeOutputs;
const campos = { N: a.normals, V2: a.shearsY, V3: a.shearsZ, T: a.torsions, M2: a.bendingsY, M3: a.bendingsZ };
const barras = {};
m.elements.forEach((el, i) => {
  if (el.length !== 2) return;
  const r = {};
  for (const [k, mp] of Object.entries(campos)) { const v = mp?.get?.(i); if (v) r[k] = [v[0], v[1]]; }
  if (Object.keys(r).length) barras[i] = r;
});
const sh = {};
m.elements.forEach((el, i) => {
  if (el.length !== 4) return;
  const j = { M11: a.bendingXXjoint?.get(i), M22: a.bendingYYjoint?.get(i), M12: a.bendingXYjoint?.get(i),
              F11: a.membraneXXjoint?.get(i), F22: a.membraneYYjoint?.get(i), F12: a.membraneXYjoint?.get(i) };
  if (Object.values(j).some(Boolean)) sh[i] = j;
});
writeFileSync(out, JSON.stringify({ barras, shells: sh, campos_analyze: Object.keys(a) }, null, 1));
console.log(`${Object.keys(barras).length} barras, ${Object.keys(sh).length} shells -> ${out}`);
