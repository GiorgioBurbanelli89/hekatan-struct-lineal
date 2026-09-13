// Comprobador headless del Tutorial 7 (sin fotogramas): corre los pasos, saca
// una captura tras cada uno y vuelca los nudos. Uso: node cli/_cap17_check.mjs
import { createServer } from "http"; import { readFileSync, existsSync, statSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url"; import { dirname, join, extname } from "path"; import puppeteer from "puppeteer";
const __dirname = dirname(fileURLToPath(import.meta.url));
const T = await import(pathToFileURL(join(__dirname, "tutoriales", "cap17_ifc_referencia.mjs")).href);
const BASE = "/hekatan-struct-lineal/"; const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const srv = createServer((q, s) => { let p = decodeURIComponent((q.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1); let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!existsSync(f)) { s.writeHead(404); return s.end("404"); } s.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); s.end(readFileSync(f)); });
const PORT = 4827; await new Promise((r) => srv.listen(PORT, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
await pag.goto(`http://localhost:${PORT}${BASE}${T.ruta}`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 2500));
// Los globales del harness que usa el guion (cursor/caja/clic): versiones mudas.
await pag.evaluate(() => { window.__tutCursor = () => {}; window.__tutClick = () => {}; window.__tutCaja = () => {}; window.__tutSinCaja = () => {}; });
await pag.evaluate(() => { window.__tutCursor = () => {}; window.__tutClick = () => {}; window.__tutCaja = () => {}; window.__tutSinCaja = () => {}; });
const a = { pag, quieto: async () => { await new Promise((r) => setTimeout(r, 30)); }, general: async () => {}, portada: async () => {} };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await T.pasos[1].hacer(a); await T.pasos[2].hacer(a);      // IFC + corte X=16.5 + alzado lateral real
const proj = (P) => pag.evaluate((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const P = await pag.evaluate(() => window.__hekatanSeccionIfcPuntos?.(20000) || []);
const interior = (y, zRef) => { const c = P.filter((p) => Math.abs(p[1] - y) < 0.6 && Math.abs(p[2] - zRef) < 1.5).map((p) => p[2]).sort((u, v) => v - u); const zo = c[0]; const zi = c.find((z) => z <= zo - 0.15) ?? zo; let b = null, m = 1e9; for (const p of P) { const d = Math.hypot(p[1] - y, p[2] - zi); if (d < m) { m = d; b = p; } } return b; };
console.log("P:", P.length, "ys:", [...new Set(P.map((p) => p[1].toFixed(0)))].slice(0, 6).join(","), "clip:", JSON.stringify(await pag.evaluate(() => { const c = window.__hekatanClip; return [c.enableX, c.posX, c.enableY]; })));
const objetivos = [interior(121, 7.1), interior(130, 4.3), interior(118, 5.7)]; console.log("objetivos:", JSON.stringify(objetivos));
const px = await proj(objetivos);
await pag.evaluate(() => { window.__hekatanCadState?.setTool?.("ifcline"); window.__hekatanArcSegs = 6; });
for (let i = 0; i < objetivos.length; i++) {
  await pag.mouse.move(px[i].x, px[i].y); await espera(150);
  const cad = await pag.evaluate(() => window.__hekatanCadenaIfc?.() || []);
  const etiq = await pag.evaluate(() => { const e = document.getElementById("hk-osnap-etiqueta"); return e && e.style.display !== "none" ? e.textContent : ""; });
  const L = cad.reduce((s, p, k) => k ? s + Math.hypot(p[0] - cad[k - 1][0], p[1] - cad[k - 1][1], p[2] - cad[k - 1][2]) : 0, 0);
  console.log(`objetivo ${JSON.stringify(objetivos[i].map((v) => +v.toFixed(2)))} → ${etiq} | cadena ${cad.length} pts, L=${L.toFixed(2)} m, de ${JSON.stringify(cad[0]?.map((v) => +v.toFixed(2)))} a ${JSON.stringify(cad[cad.length - 1]?.map((v) => +v.toFixed(2)))}`);
  if (i < 2) { await pag.mouse.click(px[i].x, px[i].y); await espera(200); }
}
console.log("nudos:", JSON.stringify(await pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal || []).map((p) => p.map((v) => +v.toFixed(3))))));
console.log("polilíneas:", JSON.stringify(await pag.evaluate(() => window.__hekatanDrawingPolylines?.rawVal || [])));
await pag.mouse.move(px[2].x, px[2].y); await espera(150);
await pag.screenshot({ path: "cli/shots/ifcline_1.png" });
await nav.close(); srv.close();
