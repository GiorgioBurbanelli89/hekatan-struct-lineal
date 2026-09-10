/**
 * ¿La guía «Cómo usar» se puede APARTAR con el ratón?
 *
 * Tapaba el centro del lienzo y lo único que se podía hacer era cerrarla: o la leías
 * o dibujabas. Se arrastra por su barra de título, doble clic la devuelve al centro,
 * y dónde la dejas se recuerda.
 *
 *   node cli/ctl_guia_movible.mjs            (local)
 *   node cli/ctl_guia_movible.mjs publico
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "napkin"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4770;
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
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 800 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(5000);

// la guía sale sola la primera vez; si no, se abre con el botón «?»
await pag.evaluate(() => { window.__hekatanRibbon?.guia?.(true); });
await espera(600);
const caja = () => pag.evaluate(() => {
  const g = document.getElementById("hk-ribbon-guia");
  if (!g || g.style.display === "none") return null;
  const b = g.querySelector("#hk-guia-barra");
  const r = g.getBoundingClientRect(), rb = b?.getBoundingClientRect();
  return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
           barra: rb ? { x: rb.x + rb.width / 2, y: rb.y + rb.height / 2 } : null };
});
const c0 = await caja();
ok(!!c0, "la guía está abierta");
ok(!!c0?.barra, "tiene barra de título para cogerla");
await pag.screenshot({ path: join(OUT, PUB ? "guia_publico_antes.png" : "guia_antes.png") });

// ── arrastrarla ────────────────────────────────────────────────────────────
await pag.mouse.move(c0.barra.x, c0.barra.y, { steps: 4 });
await pag.mouse.down();
await pag.mouse.move(c0.barra.x - 330, c0.barra.y + 190, { steps: 14 });
await pag.mouse.up();
await espera(400);
const c1 = await caja();
const dx = c1.x - c0.x, dy = c1.y - c0.y;
ok(Math.abs(dx + 330) < 24 && Math.abs(dy - 190) < 24,
   "se arrastra por la barra y va donde la sueltas", `movida (${dx.toFixed(0)}, ${dy.toFixed(0)}) px`);
ok(c1.x >= 0 && c1.y >= 0 && c1.x + c1.w <= 1280 + 1,
   "y no se sale de la ventana", JSON.stringify([c1.x, c1.y]));
await pag.screenshot({ path: join(OUT, PUB ? "guia_publico_movida.png" : "guia_movida.png") });

// ── se recuerda al cerrarla y volver a abrirla ─────────────────────────────
await pag.evaluate(() => window.__hekatanRibbon?.guia?.(false)); await espera(300);
await pag.evaluate(() => window.__hekatanRibbon?.guia?.(true)); await espera(500);
const c2 = await caja();
ok(Math.abs(c2.x - c1.x) < 3 && Math.abs(c2.y - c1.y) < 3,
   "al volver a abrirla sigue donde la dejaste", JSON.stringify([c2.x, c2.y]));

// ── doble clic en la barra: al centro ──────────────────────────────────────
await pag.mouse.click(c2.barra.x, c2.barra.y, { clickCount: 2 });
await espera(400);
const c3 = await caja();
ok(Math.abs((c3.x + c3.w / 2) - 640) < 6, "doble clic en la barra la devuelve al centro",
   `centro en x = ${(c3.x + c3.w / 2).toFixed(0)}`);

// ── y el lienzo sigue debajo: la guía no se lleva los clics del dibujo ─────
// se aparta otra vez y se mira un punto FUERA de ella (a su derecha)
await pag.evaluate(() => window.__hekatanGuiaMover?.(0, 400));
await espera(400);
const tapa = await pag.evaluate(() => {
  const g = document.getElementById("hk-ribbon-guia").getBoundingClientRect();
  const px = Math.min(window.innerWidth - 40, g.right + 60), py = g.top + g.height / 2;
  const e = document.elementFromPoint(px, py);
  return { fuera: e ? e.tagName : null, punto: [Math.round(px), Math.round(py)],
           guia: [g.x, g.y, g.width, g.height].map((q) => Math.round(q)) };
});
ok(tapa.fuera === "CANVAS", "apartada, queda lienzo libre al lado para dibujar",
   `${tapa.fuera} en ${JSON.stringify(tapa.punto)} · guía ${JSON.stringify(tapa.guia)}`);
await nav.close(); srv?.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : `\nTodo correcto (${PUB ? "sitio público" : "local"})`);
process.exit(fallos.length ? 1 : 0);
