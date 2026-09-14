import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
const DL = "C:/Users/j-b-j/Downloads";
const files = [];
const walk = (d, depth) => { for (const f of readdirSync(d)) { const p = join(d, f); let s; try { s = statSync(p); } catch { continue; } if (s.isDirectory() && depth < 1) walk(p, depth + 1); else if (/\.e2k$/i.test(f)) files.push(p); } };
walk(DL, 0);
const vistos = new Set(); const lista = files.filter(f => { const k = basename(f) + statSync(f).size; if (vistos.has(k)) return false; vistos.add(k); return true; });
const m = await empaquetar(`export * from "${R}/examples/src/shared/e2kParser";\n`, "p");
const filas = [];
for (const f of lista) {
  const avisos = []; const ow = console.warn, ol = console.log;
  console.warn = (...a) => avisos.push(a.join(" ")); console.log = (...a) => { const s = a.join(" "); if (/no se montaron|no llegan|sin nudo|perdid|ignor|no soport/i.test(s)) avisos.push(s); };
  let fila = { archivo: basename(f), KB: Math.round(statSync(f).size / 1024) };
  const t0 = Date.now();
  try {
    const r = m.parseE2k(readFileSync(f, "utf-8"));
    const el = r.elements || [];
    fila.nudos = r.nodes.length; fila.barras = el.filter(e => e.length === 2).length;
    fila.areas = el.filter(e => e.length === 3 || e.length === 4).length;
    fila.apoyos = r.nodeInputs?.supports?.size ?? 0;
    const fl = m.piezasFlotantes(el, r.nodeInputs?.supports); fila.sueltos = fl.nNudosFlotantes;
    fila.unidades = r.units ? JSON.stringify(r.units) : "";
  } catch (e) { fila.ERROR = String(e.message || e).slice(0, 120); }
  console.warn = ow; console.log = ol;
  fila.ms = Date.now() - t0;
  fila.avisos = avisos.map(s => s.replace(/\s+/g, " ").slice(0, 140));
  filas.push(fila);
  console.log(JSON.stringify(fila));
}
writeFileSync("cli/shots/descargas_e2k_import.json", JSON.stringify(filas, null, 1));
