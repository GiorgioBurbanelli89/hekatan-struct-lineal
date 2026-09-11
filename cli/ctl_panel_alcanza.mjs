/**
 * ¿Se llega a TODO el panel? La última carpeta de cada paleta tiene que poderse pulsar.
 *
 * 11-sep-2026: en 1280×720 la ventana de comandos (con su historial) tapaba el final
 * del panel derecho y «Cargas» del pórtico 2D no se podía pulsar — el clic caía en el
 * historial. Las paletas acababan en un `bottom:66px` fijo, de cuando la ventana medía
 * 40 px. Se baja cada paleta hasta el fondo y se mira QUÉ hay bajo el centro de su
 * último título.
 *
 *   node cli/ctl_panel_alcanza.mjs            (el build local)
 *   node cli/ctl_panel_alcanza.mjs publico    (GitHub Pages)
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "panel"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4778;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
let srv = null;
if (!PUB) {
  srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(raiz, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => srv.listen(PUERTO, r));
}
const URL_ = PUB
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=portico-2d"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=portico-2d`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(6000);


for (const [w, h] of [[1280, 720], [1400, 900], [1920, 1080]]) {
  await pag.setViewport({ width: w, height: h });
  await espera(1500);
  const r = await pag.evaluate(() => ["#hk-pane-host", "#settings"].map((sel) => {
    const host = document.querySelector(sel);
    if (!host) return { sel, falta: true };
    host.scrollTop = host.scrollHeight;
    const tits = [...host.querySelectorAll(".tp-fldv_b, .tp-btnv_b")].filter((b) => b.offsetParent !== null && b.getBoundingClientRect().height > 0);
    const b = tits[tits.length - 1];
    const q = b.getBoundingClientRect();
    const el = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
    return { sel, ultimo: (b.textContent || "").trim().slice(0, 30), ok: b.contains(el) || el === b,
      encima: el ? el.id || el.className : null, abajo: Math.round(host.getBoundingClientRect().bottom),
      cmd: Math.round(document.querySelector("#hk3-cmdline")?.getBoundingClientRect().top ?? -1) };
  }));
  for (const x of r) ok(!!x.ok, `${w}×${h} ${x.sel}: se puede pulsar «${x.ultimo}»`,
    `panel acaba en ${x.abajo}, comandos desde ${x.cmd}${x.ok ? "" : ", encima: " + x.encima}`);
}
await nav.close(); srv?.close();
console.log(fallos.length ? `\nFALLAN ${fallos.length}` : "\nTODO OK");
process.exit(fallos.length ? 1 : 0);
