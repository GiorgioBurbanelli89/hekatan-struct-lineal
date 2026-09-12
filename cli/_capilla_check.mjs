// Comprobador headless del Tutorial 6 (capilla real): ejecuta la MISMA receta
// del vídeo (clics reales, sin fotogramas) y MIDE nudo a nudo contra el EDB:
// para cada nudo del EDB, distancia al nudo dibujado más cercano (max/media,
// % dentro de 2 cm y 5 cm) y nº de barras. Uso: node cli/_capilla_check.mjs
import { createServer } from "http"; import { readFileSync, existsSync, statSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url"; import { dirname, join, extname } from "path"; import puppeteer from "puppeteer";
const __dirname = dirname(fileURLToPath(import.meta.url));
const T = await import(pathToFileURL(join(__dirname, "tutoriales", "cap16_iglesia.mjs")).href);
const BASE = "/hekatan-struct-lineal/"; const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const srv = createServer((q, s) => { let p = decodeURIComponent((q.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1); let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!existsSync(f)) { s.writeHead(404); return s.end("404"); } s.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); s.end(readFileSync(f)); });
const PORT = 4822; await new Promise((r) => srv.listen(PORT, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 120)));
await pag.goto(`http://localhost:${PORT}${BASE}${T.ruta}`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 2500));
const a = { pag, quieto: async () => {}, general: async () => {}, portada: async () => {} };
const st = () => pag.evaluate(() => ({ pts: (window.__hekatanDrawingPoints?.rawVal || []).length, pl: (window.__hekatanDrawingPolylines?.rawVal || []).length }));
const t0 = Date.now();
await T.setup(a);
for (const Y of T.EJES) await T.eje(a, Y);
console.log("XZ listo:", await st(), ((Date.now() - t0) / 1000).toFixed(0) + " s");
await T.planosYZ(a); await T.plantas(a); console.log("+YZ+XY:", await st());
await T.diagonales(a); console.log("+diag:", await st());
// ── Medición nudo a nudo contra el EDB ──
const med = await pag.evaluate((EDBn) => {
  const P = (window.__hekatanDrawingPoints?.rawVal || []);
  const key = (p) => p.map((v) => Math.round(v * 1e4) / 1e4).join(",");
  const uniq = [...new Map(P.map((p) => [key(p), p])).values()];
  const d = EDBn.map((n) => { let m = 1e9; for (const p of uniq) { const dd = Math.hypot(n[0] - p[0], n[1] - p[1], n[2] - p[2]); if (dd < m) m = dd; } return m; });
  const peor = d.map((v, i) => [v, i]).sort((x, y) => y[0] - x[0]).slice(0, 5).map(([v, i]) => ({ edb: EDBn[i].map((x) => +x.toFixed(2)), dist_cm: +(v * 100).toFixed(1) }));
  return { nudosEDB: EDBn.length, nudosDibujados: uniq.length, max_cm: +(Math.max(...d) * 100).toFixed(1), media_cm: +(d.reduce((s, v) => s + v, 0) / d.length * 100).toFixed(2), dentro2cm: d.filter((v) => v <= 0.02).length, dentro5cm: d.filter((v) => v <= 0.05).length, peor };
}, T.EDB.nodes);
console.log("barras EDB:", T.EDB.elements.length, "| dibujadas:", (await st()).pl, "| fallos irrecuperables:", T.fallos.length, JSON.stringify(T.fallos.slice(0,5)));
console.log("MEDICIÓN nudo a nudo:", JSON.stringify(med));
const { ISO, vista, limpiar } = T.vistas;
await limpiar(a); await vista(a, ...ISO); await new Promise((r) => setTimeout(r, 400));
await pag.screenshot({ path: "cli/shots/capilla_iso.png" });
console.log("errs:", errs, "| total", ((Date.now() - t0) / 1000).toFixed(0) + " s");
await nav.close(); srv.close();
