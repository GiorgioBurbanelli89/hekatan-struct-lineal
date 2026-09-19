// Sirve ../_ghpages_wt en http://localhost:4700/hekatan-struct-lineal/ (probar el deploy ANTES del push).
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const R = path.resolve("../_ghpages_wt"), P = "/hekatan-struct-lineal";
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp4": "video/mp4" };
http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split("?")[0]); if (!u.startsWith(P)) { r.writeHead(404); return r.end(); }
  let f = path.join(R, u.slice(P.length)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "content-type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r);
}).listen(4700, () => console.log("http://localhost:4700" + P + "/"));
