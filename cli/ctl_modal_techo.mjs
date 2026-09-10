/**
 * ¿Hasta qué tamaño aguanta el modal antes de matar la pestaña?
 *
 * No es cuestión de tiempo sino de MEMORIA: el solver modal corre en WASM sobre el
 * hilo principal y, pasado cierto tamaño, no lanza un error que se pueda atrapar —
 * se queda sin memoria y se lleva el renderer. Por eso hace falta un TECHO en GDL,
 * y por eso hay que medirlo en vez de ponerlo a ojo.
 *
 * Se prueba el dual (pórtico + losa + muros), que es la plantilla más pesada.
 * Cada tamaño va en una pestaña NUEVA: si la anterior murió, no contamina.
 *
 *   node cli/ctl_modal_techo.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4773;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
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
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// (nx, ny, pisos, malla del modal) de menos a más
const TAMANOS = [
  [4, 4, 4, 1.0], [5, 5, 4, 1.0], [6, 6, 4, 1.0],
  [6, 6, 6, 1.0], [7, 7, 6, 1.0], [8, 8, 8, 1.0],
];
console.log("  nx ny pisos  malla     nudos      GDL   resultado");
let ultimoVivo = 0;
for (const [nx, ny, pisos, ms] of TAMANOS) {
  const pag = await nav.newPage();
  await pag.setViewport({ width: 1000, height: 700 });
  let info = null, muerta = false;
  try {
    await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
    await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
    await espera(5000);
    await pag.evaluate((v) => {
      window.__hekatanSetParam("tipo", 6);
      window.__hekatanSetParam("nx", v.nx); window.__hekatanSetParam("ny", v.ny);
      window.__hekatanSetParam("pisos", v.pisos); window.__hekatanSetParam("msModal", v.ms);
    }, { nx, ny, pisos, ms });
    await espera(9000);
    await pag.evaluate(() => window.__hekatanRunModalAnimate?.());
    await espera(30000);
    info = await pag.evaluate(() => window.__hekatanModalInfo ?? null);
  } catch (e) {
    muerta = true;
  }
  const gdl = info?.dof ?? 0;
  console.log(`  ${String(nx).padStart(2)} ${String(ny).padStart(2)} ${String(pisos).padStart(5)}` +
    `  ${String(ms).padStart(5)}  ${String(info?.nudos ?? "?").padStart(8)} ${String(gdl || "?").padStart(8)}` +
    `   ${muerta ? "✗ LA PESTAÑA SE MURIÓ" : "✓ sobrevive"}`);
  if (!muerta && gdl) ultimoVivo = Math.max(ultimoVivo, gdl);
  try { await pag.close(); } catch { /* ya no está */ }
  if (muerta) break;
}
console.log(`\n  Último tamaño que sobrevive: ${ultimoVivo.toLocaleString()} GDL.`);
console.log(`  El tope DOF_MAX_MODAL de plantillas.ts debe quedar por DEBAJO de eso.`);
await nav.close(); srv.close();
