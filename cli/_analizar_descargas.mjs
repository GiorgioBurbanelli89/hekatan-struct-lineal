import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
const DL = "C:/Users/j-b-j/Downloads";
const files = [];
const walk = (d, depth) => { for (const f of readdirSync(d)) { const p = join(d, f); let s; try { s = statSync(p); } catch { continue; } if (s.isDirectory() && depth < 1) walk(p, depth + 1); else if (/\.e2k$/i.test(f)) files.push(p); } };
walk(DL, 0);
const vistos = new Set(); const lista = files.filter(f => { const k = basename(f) + statSync(f).size; if (vistos.has(k)) return false; vistos.add(k); return true; });
const m = await empaquetar(`export * from "${R}/examples/src/shared/e2kParser";\nexport * from "${R}/examples/src/shared/e2kAnalisis";\nexport { deform } from "${R}/hekatan-fem/src/index";\n`, "an");
const filas = [];
for (const f of lista) {
  const fila = { archivo: basename(f) };
  const ow = console.warn, ol = console.log, oe = console.error; console.warn = () => {}; console.log = () => {}; console.error = () => {};
  const t0 = Date.now();
  try {
    const mod = m.parseE2k(readFileSync(f, "utf-8"));
    fila.nudos = mod.nodes.length; fila.elems = mod.elements.length;
    if (!mod.nodes.length) { fila.estado = "sin modelo (tabla de resultados o vacio)"; }
    else {
      const { listo, informe } = m.prepararAnalisis(mod, { podar: false, vueltasMecanismo: 0 }, m.deform);
      fila.informe = { apoyos: informe.apoyos, muelles: informe.muelles, sueltos: informe.trozosSueltos, shells: informe.shells, barras: informe.barras };
      const out = m.deform(listo.nodes, listo.elements, listo.nodeInputs, listo.elementInputs, listo.muelles);
      let umax = 0, nan = 0;
      for (const [, u] of out.deformations) for (let k = 0; k < 3; k++) { const v = u[k]; if (!Number.isFinite(v)) nan++; else umax = Math.max(umax, Math.abs(v)); }
      fila.umax_mm = +(umax * 1000).toPrecision(5); fila.nan = nan;
      fila.estado = nan ? "NO RESUELVE (NaN)" : umax === 0 ? "resuelve pero todo 0 (sin carga?)" : umax > 10 ? "RARO (>10 m)" : "OK";
    }
  } catch (e) { fila.estado = "ERROR"; fila.error = String(e?.message || e).slice(0, 140); }
  console.warn = ow; console.log = ol; console.error = oe;
  fila.s = +((Date.now() - t0) / 1000).toFixed(1);
  filas.push(fila); console.log(JSON.stringify(fila));
}
writeFileSync("cli/shots/descargas_e2k_analisis.json", JSON.stringify(filas, null, 1));
