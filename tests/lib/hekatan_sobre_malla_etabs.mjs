// Uso: node tests/lib/hekatan_sobre_malla_etabs.mjs malla_etabs.json [q=-10] [t=0.20] [E=25e6] [tipo=thin]
// Resuelve en Hekatan LA MALLA QUE HIZO ETABS (nudos + cascaras de analisis de malla_etabs_poligono.py)
// con los mismos apoyos que ETABS puso y la misma carga de area, y compara desplazamientos nudo a nudo.
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "./heks.mjs";
const J = JSON.parse(readFileSync(process.argv[2], "utf-8"));
const kv = Object.fromEntries(process.argv.slice(3).map((a) => a.split("=")));
const q = parseFloat(kv.q ?? "-10"), t = kv.t ?? "0.20", E = kv.E ?? "25e6";
const N = J.etabs.nudos, EL = J.etabs.elementos, R = J.etabs.restricciones ?? [];
const lineas = [];
N.forEach((p, i) => lineas.push(`node ${i + 1} ${p[0]} ${p[1]} ${p[2]}`));
let k = 0;
for (const e of EL) {
  if (e.length !== 4 && e.length !== 3) continue;
  k++; lineas.push(`${e.length === 4 ? "shell" : "tri"} ${k} ${e.map((i) => i + 1).join(" ")} ${t} ${E}`, `areaload ${k} ${q}`);
  if (kv.tipo === "thin") lineas.push(`shelltype ${k} thin`);
}
const tri = EL.filter((e) => e.length === 3).length;
let nap = 0;
// OJO: `support N uxuyuz` (pegado) NO lo entiende el lector; `pinned`, `fixed` o los DOF separados sí.
const spec = (r) => r.every(Boolean) ? "fixed" : (r[0] && r[1] && r[2] && !r[3] && !r[4] && !r[5]) ? "pinned"
                 : ["ux","uy","uz","rx","ry","rz"].filter((_, c) => r[c]).join(" ");
R.forEach((r, i) => { if (r && r.some(Boolean)) { nap++; lineas.push(`support ${i + 1} ${spec(r)}`); } });
lineas.push("solve", "");
const DIR = mkdtempSync(join(tmpdir(), "hkEtabsMalla-")); const heks = join(DIR, "malla_etabs.heks");
writeFileSync(heks, lineas.join("\n"));
const r = await resolverHeks(heks);
const U = r.deformOutputs.deformations; const RE = r.deformOutputs.reactions;
let sumRz = 0; if (RE) for (const [, v] of RE) sumRz += v[2];
let um = 0; for (const [, u] of U) um = Math.max(um, ...u.slice(0, 3).map(Math.abs));
let peor = 0, peorI = -1, n = 0, wE = 0, wH = 0;
const filas = [];
J.etabs.desplaz.forEach((d, i) => {
  const u = U.get(i); if (!d || !u) return; n++;
  wE = Math.max(wE, Math.abs(d[2])); wH = Math.max(wH, Math.abs(u[2]));
  let e = 0; for (let c = 0; c < 3; c++) e = Math.max(e, Math.abs(u[c] - d[c]) / um * 100);
  filas.push({ i, x: N[i][0], y: N[i][1], hk: u[2], etabs: d[2], e });
  if (e > peor) { peor = e; peorI = i; }
});
filas.sort((a, b) => b.e - a.e);
console.log(`malla de ETABS en Hekatan: ${N.length} nudos, ${k} cáscaras (${tri} triángulos + ${k - tri} cuadriláteros), ${nap} apoyos (los de ETABS)`);
console.log(`ΣRz Hekatan ${sumRz.toFixed(4)} · ΣRz ETABS ${J.etabs.sumRz}`);
console.log(`w máx: Hekatan ${wH.toExponential(4)} · ETABS ${wE.toExponential(4)} · dif ${((wH - wE) / wE * 100).toFixed(2)} %`);
console.log(`peor nudo ${peor.toFixed(3)} % del máximo (nudo ${peorI} en ${N[peorI]?.slice(0, 2)}) sobre ${n} nudos`);
const hist = [0, 0, 0, 0]; for (const f of filas) hist[f.e < 0.5 ? 0 : f.e < 2 ? 1 : f.e < 5 ? 2 : 3]++;
console.log(`<0.5 %: ${hist[0]} · 0.5–2 %: ${hist[1]} · 2–5 %: ${hist[2]} · >5 %: ${hist[3]}`);
console.table(filas.slice(0, 6).map((f) => ({ ...f, hk: f.hk.toExponential(3), etabs: f.etabs.toExponential(3), e: f.e.toFixed(2) })));
writeFileSync(process.argv[2].replace(/\.json$/, kv.tipo === "thin" ? "_vs_hekatan_thin.json" : "_vs_hekatan.json"), JSON.stringify({ sumRz, sumRzEtabs: J.etabs.sumRz, wH, wE, peor, peorI, n, filas }, null, 1));
