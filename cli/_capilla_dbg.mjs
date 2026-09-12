// Depuración corta: setup + UN eje, vuelca los fallos con lo que guardó la polilínea.
import { createServer } from "http"; import { readFileSync, existsSync, statSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url"; import { dirname, join, extname } from "path"; import puppeteer from "puppeteer";
const __dirname = dirname(fileURLToPath(import.meta.url));
const T = await import(pathToFileURL(join(__dirname, "tutoriales", "cap16_iglesia.mjs")).href);
const BASE = "/hekatan-struct-lineal/"; const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const srv = createServer((q, s) => { let p = decodeURIComponent((q.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1); let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!existsSync(f)) { s.writeHead(404); return s.end("404"); } s.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); s.end(readFileSync(f)); });
const PORT = 4823; await new Promise((r) => srv.listen(PORT, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
await pag.goto(`http://localhost:${PORT}${BASE}${T.ruta}`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 2500));
const a = { pag, quieto: async () => {}, general: async () => {}, portada: async () => {} };
await T.setup(a);
await T.eje(a, T.EJES[0]);
const st = await pag.evaluate(() => ({ pts: (window.__hekatanDrawingPoints?.rawVal || []).length, pl: (window.__hekatanDrawingPolylines?.rawVal || []).length, ult3: (window.__hekatanDrawingPolylines?.rawVal || []).slice(-3) }));
console.log("estado:", JSON.stringify(st));
console.log("fallos:", T.fallos.length); for (const f of T.fallos) console.log(JSON.stringify(f));
await nav.close(); srv.close();
