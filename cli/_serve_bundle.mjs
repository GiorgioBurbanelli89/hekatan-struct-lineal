// Sirve website/src/examples bajo /hekatan-struct-lineal/ (como el sitio público) en el puerto dado.
import { createServer } from "http"; import { existsSync, statSync, readFileSync } from "fs"; import { join, extname } from "path";
const RAIZ = join(import.meta.dirname, "..", "website", "src", "examples"), BASE = "/hekatan-struct-lineal/";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(RAIZ, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f));
}).listen(+(process.argv[2] ?? 4801), () => console.log("sirviendo", RAIZ));
