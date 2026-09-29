/**
 * ¿Aguanta la PESTAÑA el modal por encima de 40 000 GDL? El solver en Node hace 226 704 GDL en 28 s con
 * menos de 1 GB (`cli/_modal_memoria.mjs`, 29-sep-2026). Aquí lo mismo en Chrome, con el build de
 * `website/src/examples`, el tope quitado y midiendo: si terminó (T₁ en el panel), cuánto tardó, el heap
 * de JS y si la página sigue respondiendo después (la animación del modo pinta la malla entera).
 *
 *   TAM='[[8,8,8,1.25]]' node cli/ctl_modal_techo_sin_tope.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4774;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(PUERTO, r));
const URL_ = `http://localhost:${PUERTO}${BASE}workspace/?t=plantillas`;
const nav = await puppeteer.launch({ headless: "new", protocolTimeout: 600000,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl", "--enable-precise-memory-info"] });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const TAM = JSON.parse(process.env.TAM || "[[6,6,6,1.25],[8,8,8,1.25]]");

for (const [nx, ny, pisos, ms] of TAM) {
  const pag = await nav.newPage();
  await pag.setViewport({ width: 1200, height: 800 });
  let muerta = false;
  pag.on("error", () => { muerta = true; });
  pag.on("dialog", (d) => d.accept().catch(() => {}));      // «va a tardar ~N s»: seguir
  let fila = "";
  try {
    await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
    await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
    await espera(4000);
    await pag.evaluate((v) => {
      window.__hekatanDofMaxModal = 1e9;
      window.__hekatanSetParam("tipo", 6);
      window.__hekatanSetParam("nx", v.nx); window.__hekatanSetParam("ny", v.ny);
      window.__hekatanSetParam("pisos", v.pisos); window.__hekatanSetParam("msModal", v.ms);
    }, { nx, ny, pisos, ms });
    await espera(15000);
    const t0 = Date.now();
    await pag.evaluate(() => window.__hekatanRunModalAnimate?.());
    // esperar a que el panel diga T₁ (o un aviso), hasta 5 min
    await pag.waitForFunction(() => /T₁ = [0-9.]+ s|no se ejecutó|no salio/.test(document.body.textContent), { timeout: 300000, polling: 1000 });
    const seg = (Date.now() - t0) / 1000;
    await espera(5000);                                       // que anime un rato
    const r = await pag.evaluate(() => ({
      info: window.__hekatanModalInfo,
      heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 2 ** 20) : -1,
      panel: document.body.textContent.match(/T₁ = [0-9.]+ s|no se ejecutó[^\n]*|no salio[^\n]*/)?.[0],
    }));
    // ¿la página sigue respondiendo con la animación en marcha?
    const t1 = Date.now();
    await pag.evaluate(() => 1);
    fila = `${r.info?.nudos} nudos · ${r.info?.dof?.toLocaleString()} GDL · modal ${seg.toFixed(0)} s · heap JS ${r.heap} MB · ` +
      `responde en ${Date.now() - t1} ms · ${r.panel}`;
  } catch (e) {
    fila = (muerta ? "✗ LA PESTAÑA SE MURIÓ" : "✗ " + String(e.message).slice(0, 90));
  }
  console.log(`  ${nx}x${ny}x${pisos} malla ${ms}: ${fila}`);
  try { await pag.close(); } catch { /* ya no está */ }
}
await nav.close(); srv.close();
