// Comprobador headless del Tutorial 7 (sin fotogramas): corre los pasos, saca
// una captura tras cada uno y vuelca los nudos. Uso: node cli/_cap17_check.mjs
import { createServer } from "http"; import { readFileSync, existsSync, statSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url"; import { dirname, join, extname } from "path"; import puppeteer from "puppeteer";
const __dirname = dirname(fileURLToPath(import.meta.url));
const T = await import(pathToFileURL(join(__dirname, "tutoriales", "cap17_ifc_referencia.mjs")).href);
const BASE = "/hekatan-struct-lineal/"; const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const srv = createServer((q, s) => { let p = decodeURIComponent((q.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1); let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!existsSync(f)) { s.writeHead(404); return s.end("404"); } s.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); s.end(readFileSync(f)); });
const PORT = 4825; await new Promise((r) => srv.listen(PORT, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
await pag.goto(`http://localhost:${PORT}${BASE}${T.ruta}`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 2500));
// Los globales del harness que usa el guion (cursor/caja/clic): versiones mudas.
await pag.evaluate(() => { window.__tutCursor = () => {}; window.__tutClick = () => {}; window.__tutCaja = () => {}; window.__tutSinCaja = () => {}; });
const a = { pag, quieto: async () => { await new Promise((r) => setTimeout(r, 40)); }, general: async () => {}, portada: async () => {} };
let k = 0;
for (const paso of T.pasos) {
  const t0 = Date.now();
  try { await paso.hacer(a); } catch (e) { console.log("  ✖ paso", k, e.message); }
  await new Promise((r) => setTimeout(r, 300));
  await pag.screenshot({ path: `cli/shots/cap17_p${k}.png` });
  console.log(`paso ${k} (${((Date.now() - t0) / 1000).toFixed(0)} s): ${paso.rotulo.slice(0, 70)}`);
  k++;
}
console.log("nudos:", JSON.stringify(await T.nudos(a)));
console.log("polilíneas:", JSON.stringify(await pag.evaluate(() => (window.__hekatanDrawingPolylines?.rawVal || []))));
console.log("errs:", errs);
await nav.close(); srv.close();
