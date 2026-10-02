// e2k → heks (la tubería de la app) y lo resuelve por cliModeler. Uso: node cli/_e2k_a_heks.mjs modelo.e2k salida.heks
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const mod = await empaquetar(`export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";\n`, "e2k-a-heks");
const t0 = Date.now();
const r = mod.e2kAHeks(readFileSync(process.argv[2], "latin1"), process.argv[2].split(/[\/]/).pop());
writeFileSync(process.argv[3], r.heks);
const m = r.modelo;
const sum = (mp) => { let s = [0, 0, 0]; for (const [, v] of mp) for (let k = 0; k < 3; k++) s[k] += v[k]; return s.map((x) => +x.toFixed(3)); };
console.log("ms", Date.now() - t0, "nudos", m.nodes.length, "elems", m.elements.length, "cosido", JSON.stringify(r.cosido), "heks KB", (r.heks.length / 1024).toFixed(0));
for (const [p, mp] of m.cargasPatron) console.log("patron", p, mp.size, sum(mp));
console.log("diaf", m.diafragmas?.size, "analisis", JSON.stringify({ ...m.analisis, espectros: [...m.analisis.espectros.keys()] }).slice(0, 900));
console.log("avisos", r.avisos);
{ // peso dentro de los brazos: columnas y vigas
  const ei = m.elementInputs; let col = 0, vig = 0, colTot = 0, vigTot = 0;
  m.elements.forEach((el, e) => { if (el.length !== 2) return; const a = m.nodes[el[0]], b = m.nodes[el[1]];
    const Lt = Math.hypot(b[0]-a[0], b[1]-a[1], b[2]-a[2]); const w = (ei.densities.get(e) ?? 0) * 9.80665 * (ei.areas.get(e) ?? 0);
    const o = ei.endOffsets.get(e); const esCol = Math.abs(b[2]-a[2]) > 0.5 * Lt;
    if (esCol) { colTot += w * Lt; if (o) col += w * (o[0] + o[1]); } else { vigTot += w * Lt; if (o) vig += w * (o[0] + o[1]); } });
  console.log("peso col", colTot.toFixed(2), "en brazos col", col.toFixed(2), "| vigas", vigTot.toFixed(2), "en brazos vig", vig.toFixed(2));
}
