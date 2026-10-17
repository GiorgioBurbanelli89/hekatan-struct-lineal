/**
 * ¿Se puede DIBUJAR cada ejemplo? (17-oct-2026). Por cada id: abre el ejemplo, lee su modelo con
 * cli/piloto_redibujo.js, abre un lienzo nuevo y el piloto lo redibuja pulsando «Línea»/«Losa» y tecleando
 * las coordenadas en la línea de órdenes; luego compara barra a barra y cáscara a cáscara.
 *   node cli/ctl_redibujar.mjs portico-2d galpon ...   [--ms 0] [--base URL] [--json salida.json]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : d; };
const BASE = opt("--base", "http://localhost:4600"), MS = +opt("--ms", "0"), JSON_OUT = opt("--json", null);
const ids = args;
const PILOTO = fs.readFileSync(new URL("./piloto_redibujo.js", import.meta.url), "utf8");
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const filas = [];
for (const id of ids) {
  const t0 = Date.now(); const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
  const errs = []; pag.on("pageerror", (e) => errs.push(e.message));
  let fila = { id };
  try {
    await pag.goto(`${BASE}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(4000);
    await pag.evaluate(PILOTO); fila.leido = await pag.evaluate(() => window.__piloto.leer());
    const n = fila.leido.barras + fila.leido.cascaras;
    if (!n) { fila.nota = "sin barras ni cáscaras"; }
    else if (n > +(process.env.MAXEL ?? 1500)) { fila.nota = `grande (${n} elementos): aparte`; }
    else {
      await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(3500);
      await pag.evaluate(PILOTO);
      fila.dibujo = await pag.evaluate((ms) => window.__piloto.dibujar({ ms }), MS);
      if (fila.dibujo.error) fila.dibujo.error += " [paso " + fila.dibujo.paso + "] revit=" + await pag.evaluate(() => document.body.classList.contains("hk-revit-on")) + " cinta=" + await pag.evaluate(() => { const r = document.getElementById("hk-ribbon"); return r ? getComputedStyle(r).display + "/" + document.querySelectorAll("#hk-ribbon button").length : "no"; });
      await espera(800);
      fila.cmp = await pag.evaluate(() => window.__piloto.comparar());
    }
  } catch (e) { fila.error = String(e.message).slice(0, 160); }
  fila.s = +((Date.now() - t0) / 1000).toFixed(1); fila.errs = errs.slice(0, 2);
  const c = fila.cmp;
  console.log(`${c?.ok ? "  ✓" : "  ✗"} ${id.padEnd(34)} ${fila.leido ? `${fila.leido.barras} barras ${fila.leido.cascaras} cáscaras` : ""}${fila.leido && Object.keys(fila.leido.otros).length ? " otros " + JSON.stringify(fila.leido.otros) : ""}` +
    `${c ? ` · faltan ${c.faltanBarras}/${c.faltanCascaras} sobran ${c.sobranBarras}` : ""}${fila.dibujo?.error ? " · " + fila.dibujo.error : ""}${fila.nota ? " · " + fila.nota : ""}${fila.error ? " · " + fila.error : ""} (${fila.s} s)`);
  filas.push(fila); await pag.close();
  if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(filas, null, 1));
}
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(filas, null, 1));
console.log(`${filas.filter((f) => f.cmp?.ok).length}/${filas.length} se redibujan igual`);
await nav.close();
