// Comprobador headless del Tutorial 7 (sin fotogramas): corre los pasos, saca
// una captura tras cada uno y vuelca los nudos. Uso: node cli/_cap17_check.mjs
import { createServer } from "http"; import { readFileSync, existsSync, statSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url"; import { dirname, join, extname } from "path"; import puppeteer from "puppeteer";
const __dirname = dirname(fileURLToPath(import.meta.url));
const T = await import(pathToFileURL(join(__dirname, "tutoriales", "cap17_ifc_referencia.mjs")).href);
const BASE = "/hekatan-struct-lineal/"; const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const srv = createServer((q, s) => { let p = decodeURIComponent((q.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1); let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!existsSync(f)) { s.writeHead(404); return s.end("404"); } s.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); s.end(readFileSync(f)); });
const PORT = 4826; await new Promise((r) => srv.listen(PORT, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
await pag.goto(`http://localhost:${PORT}${BASE}${T.ruta}`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 2500));
// Los globales del harness que usa el guion (cursor/caja/clic): versiones mudas.
await pag.evaluate(() => { window.__tutCursor = () => {}; window.__tutClick = () => {}; window.__tutCaja = () => {}; window.__tutSinCaja = () => {}; });
await pag.evaluate(() => { window.__tutCursor = () => {}; window.__tutClick = () => {}; window.__tutCaja = () => {}; window.__tutSinCaja = () => {}; });
const a = { pag, quieto: async () => { await new Promise((r) => setTimeout(r, 30)); }, general: async () => {}, portada: async () => {} };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await T.pasos[1].hacer(a);
// vista iso del programa (sin corte) y barrido del cursor: ¿bordes y vértices?
await pag.evaluate(() => window.__hekatanSetView?.("iso")); await espera(300);
const t0 = Date.now(); await pag.mouse.move(640, 360); await espera(300); const t1 = Date.now() - t0;
console.log("bordes calculados:", await pag.evaluate(() => window.__hekatanBordesIfc?.()), "ms 1er move:", t1);
const etiq = {}; let tmax = 0;
for (let y = 150; y <= 600; y += 30) for (let x = 200; x <= 1000; x += 40) { const s = Date.now(); await pag.mouse.move(x, y); await espera(25); tmax = Math.max(tmax, Date.now() - s - 25); const e = await pag.evaluate(() => { const e = document.getElementById("hk-osnap-etiqueta"); return e && e.style.display !== "none" ? e.textContent : ""; }); etiq[e] = (etiq[e] || 0) + 1; }
console.log("etiquetas:", JSON.stringify(etiq), "peor move ms:", tmax);
await pag.mouse.move(640, 380); await espera(200);
await pag.screenshot({ path: "cli/shots/ref_ifc_bordes.png" });
await nav.close(); srv.close();
