/**
 * Servidor del build LOCAL, para probarlo en el navegador de verdad.
 *   node cli/_servir_local.mjs [puerto]
 * ⚠️ `python -m http.server` NO sirve aquí: en Windows manda los .js como
 * text/plain y el sitio no carga (ya pasó el 15-sep).
 */
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = join(__dirname, "..", "website", "src", "examples");
const BASE = "/hekatan-struct-lineal/";
const PUERTO = Number(process.argv[2] || 4610);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".ttf": "font/ttf", ".map": "application/json", ".heks": "text/plain", ".ifc": "text/plain" };
createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404 " + p); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream",
                       "cache-control": "no-store" });
  res.end(fs.readFileSync(f));
}).listen(PUERTO, () => {
  console.log(`Hekatan Struct (build local) en  http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`);
  console.log("Ctrl+C para pararlo.");
});
