// PNG del ejemplo y de la plantilla de la zapata desde el BUILD de deploy (website/src/examples), no el dev server.
import puppeteer from "puppeteer";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";
const raiz = "website/src/examples", BASE = "/hekatan-struct-lineal/", PUERTO = 4736;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".heks": "text/plain" };
const srv = createServer(async (q, r) => { let u = decodeURIComponent(q.url.split("?")[0]); if (u.startsWith(BASE)) u = u.slice(BASE.length - 1); if (u.endsWith("/")) u += "index.html";
  try { const b = await readFile(join(raiz, u)); r.writeHead(200, { "Content-Type": MIME[extname(u)] ?? "application/octet-stream" }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise((ok) => srv.listen(PUERTO, ok));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 200)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [id, png] of [["zapata-excentrica", "build_ejemplo_das610"], ["zapata-levantamiento", "build_plantilla"]]) {
  await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(7000);
  const info = await pag.evaluate(() => ({ contacto: window.__hekatanCliContacto?.nudosEnContacto, eq: window.__hekatanCliEquilibrio?.pctErr }));
  await pag.screenshot({ path: `registros/zapata_levantamiento_png/${png}.png` });
  console.log(id, JSON.stringify(info));
}
await pag.click("#hk-diseno-btn"); await espera(700);
await pag.screenshot({ path: "registros/zapata_levantamiento_png/build_menu_diseno.png" });
console.log("errores:", errs.length, errs.slice(0, 5));
await nav.close(); srv.close();
