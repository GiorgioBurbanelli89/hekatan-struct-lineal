// Servidor estático mínimo del build (website/src/examples) en /hekatan-struct-lineal/, con los MIME bien puestos
// (python http.server en Windows da text/plain a los .js y los módulos no cargan). Uso: node cli/_servir_local.mjs [puerto]
import http from "node:http"; import { readFile, stat } from "node:fs/promises"; import { join, extname, dirname } from "node:path"; import { fileURLToPath } from "node:url";
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "application/javascript", ".mjs": "application/javascript", ".css": "text/css", ".wasm": "application/wasm",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain" };
http.createServer(async (q, r) => {
  let u = decodeURIComponent(q.url.split("?")[0]).replace(/^\/hekatan-struct-lineal/, "");
  let f = join(RAIZ, u);
  try { if ((await stat(f)).isDirectory()) f = join(f, "index.html"); const b = await readFile(f);
    r.writeHead(200, { "Content-Type": MIME[extname(f)] ?? "application/octet-stream" }); r.end(b);
  } catch { r.writeHead(404); r.end("404"); }
}).listen(+(process.argv[2] ?? 8765));
