// Sirve ../_ghpages_wt (lo que va a gh-pages) en http://localhost:4790/hekatan-struct-lineal/ para probar ANTES de subir.
import { createServer } from "http"; import { readFileSync, existsSync, statSync } from "fs"; import { join, extname } from "path";
const RAIZ = join(process.cwd(), "..", "_ghpages_wt"), BASE = "/hekatan-struct-lineal/";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
createServer((q, r) => { let p = decodeURIComponent(q.url.split("?")[0]); if (!p.startsWith(BASE)) { r.writeHead(404); return r.end(); }
  let f = join(RAIZ, p.slice(BASE.length)); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { r.writeHead(404); return r.end("404"); } r.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); r.end(readFileSync(f)); }).listen(4790);
console.log("sirviendo en http://localhost:4790" + BASE);
