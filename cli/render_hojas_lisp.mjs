/**
 * Renderiza TODAS las hojas de la conferencia en Hekatan LISP web y dice cual
 * falla. Mirar el JSON no basta: deja un PNG de cada una para VERLAS.
 *
 *   node cli/render_hojas_lisp.mjs
 *   node cli/render_hojas_lisp.mjs 67 68        # solo esas
 */
import puppeteer from "puppeteer";
import fs from "node:fs";

const BASE = "https://giorgioburbanelli89.github.io/hekatan-lisp/";
const SALIDA = "cli/shots/hojas_lisp";
fs.mkdirSync(SALIDA, { recursive: true });

const filtro = process.argv.slice(2);
const ejemplos = await (await fetch(BASE + "ejemplos.json?cb=" + Date.now())).json();
const hojas = ejemplos.filter((n) => (filtro.length ? filtro.some((f) => n.startsWith(f)) : /^(11|39|40|41|42|43|44|60|64|65|66|67|68) /.test(n)));

const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const filas = [];

for (const hoja of hojas) {
  const p = await b.newPage();
  await p.setViewport({ width: 1450, height: 1100 });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  let r = { hoja, texto: 0, tablas: 0, graficas: 0, sinResolver: 0, errs: [] };
  try {
    await p.goto(BASE + "?cb=" + Date.now() + "#ej=" + encodeURIComponent(hoja) + "&solo=1",
      { waitUntil: "networkidle0", timeout: 90000 });
    // el motor LISP tarda: se espera a que el resultado TENGA contenido propio
    await p.waitForFunction(
      () => {
        const t = document.body.innerText;
        return !/Cargando/.test(t) && t.length > 2500;
      },
      { timeout: 120000 }
    ).catch(() => {});
    await new Promise((x) => setTimeout(x, 4000));

    r = await p.evaluate(() => {
      const t = document.body.innerText;
      // la interfaz sola (menus + lista de ejemplos) ronda los 4000 caracteres:
      // si no se pasa mucho de ahi, la hoja NO se pinto
      return {
        texto: t.length,
        tablas: document.querySelectorAll("table").length,
        graficas: document.querySelectorAll("canvas, svg").length,
        sinResolver: (t.match(/dec\s*\(|\]\(http/g) || []).length,
        titulo: (document.querySelector("h1, .ws-h1")?.textContent || "").trim().slice(0, 48),
      };
    });
    r.hoja = hoja;
    r.errs = errs.slice(0, 1);
    await p.screenshot({ path: `${SALIDA}/${hoja.slice(0, 2)}.png` });
  } catch (e) {
    r.errs = [String(e).slice(0, 100)];
  }
  // criterio: una hoja pintada tiene contenido propio y nada sin resolver
  const pintada = r.texto > 5200 && !r.sinResolver;
  filas.push({ ...r, pintada });
  console.log(
    (pintada ? "  ok  " : "FALLA ") + hoja.slice(0, 44).padEnd(46) +
    String(r.texto).padStart(6) + " car " + String(r.tablas).padStart(3) + " tablas " +
    String(r.graficas).padStart(3) + " graf" +
    (r.sinResolver ? "  SIN RESOLVER: " + r.sinResolver : "") +
    (r.errs.length ? "  ERR " + r.errs[0] : "")
  );
  await p.close();
}
await b.close();

const mal = filas.filter((f) => !f.pintada);
console.log("\n=========================================");
console.log(`${filas.length - mal.length} de ${filas.length} se pintan · PNG en ${SALIDA}/`);
if (mal.length) { console.log("\nNO se pintan:"); mal.forEach((f) => console.log("  ·", f.hoja)); }
fs.writeFileSync(`${SALIDA}/_informe.json`, JSON.stringify(filas, null, 1));
process.exit(mal.length ? 1 : 0);
