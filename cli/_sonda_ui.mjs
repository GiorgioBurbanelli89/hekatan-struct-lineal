import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "ui"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4784;
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
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-frame-nec"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=edificio-frame-nec`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(6000);


await pag.evaluate(() => { const s = window.__hekatanSettings(); s.deformedShape.val = false; s.frameResults.val = "bendingsZ"; });
await espera(2500);
const info = await pag.evaluate(() => {
  const cuenta = (sel) => {
    const h = document.querySelector(sel); if (!h) return null;
    const carpetas = [...h.querySelectorAll(".tp-fldv")];
    return { carpetas: carpetas.length, principales: carpetas.filter((f) => !f.parentElement.closest(".tp-fldv")).length,
      botones: h.querySelectorAll(".tp-btnv_b").length, filas: h.querySelectorAll(".tp-lblv").length,
      titulos: carpetas.filter((f) => !f.parentElement.closest(".tp-fldv")).map((f) => f.querySelector(":scope > .tp-fldv_b")?.textContent.trim()) };
  };
  return { derecho: cuenta("#hk-pane-host"), izquierdo: cuenta("#settings") };
});
console.log(JSON.stringify(info, null, 1));
await pag.screenshot({ path: join(OUT, "antes.png") });
const v = await pag.evaluate(() => { const r = document.querySelector("#viewer canvas").getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
// solo el 3D, para la maqueta: sin paneles encima
await pag.addStyleTag({ content: "#hk-pane-host,#settings,#hk3-cmdline,#hk-cad-est,#toolbar,#legend,#hk-ribbon-abrir,.hk-titulo,#hk-coord-readout{display:none!important}" });
await espera(800);
await pag.screenshot({ path: join(OUT, "solo3d.png"), clip: { x: 300, y: 30, width: 660, height: 600 } });
await nav.close(); srv?.close();
