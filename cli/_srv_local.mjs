import http from "node:http"; import { readFile } from "node:fs/promises"; import { join, extname } from "node:path";
const ROOT = "website/src/examples", BASE = "/hekatan-struct-lineal/";
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".heks": "text/plain" };
http.createServer(async (q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]); if (p.startsWith(BASE)) p = "/" + p.slice(BASE.length);
  if (p.endsWith("/")) p += "index.html";
  try { const b = await readFile(join(ROOT, p)); r.writeHead(200, { "Content-Type": T[extname(p)] || "application/octet-stream" }); r.end(b); }
  catch { r.writeHead(404); r.end("404"); }
}).listen(4795, () => console.log("srv 4795"));
