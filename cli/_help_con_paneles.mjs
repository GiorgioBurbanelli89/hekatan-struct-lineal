/**
 * EL BOTÓN «?» CON LOS PANELES ABIERTOS (que es como lo va a encontrar Jorge).
 * Antes el panel derecho lo tapaba: se veía el botón y el clic iba al panel.
 *   node cli/_help_con_paneles.mjs
 */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "help_paneles"); fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((q, r) => { let p = decodeURIComponent((q.url||"/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length-1); let f = join(raiz, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end("404"); }
  r.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
await new Promise((r) => srv.listen(4797, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0,160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = []; const ok = (c,q,d="") => { console.log((c?"  OK  ":"  --  ")+q+(d?"  |  "+d:"")); if(!c) fallos.push(q); };
await pag.goto(`http://localhost:4797${BASE}workspace/?t=new-blank`, { waitUntil:"networkidle2", timeout:180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout:120000 }); await esp(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
await esp(1200);   // dejar que la cinta se encaje

// SIN tocar los paneles: tal como abre el programa
const b = await pag.evaluate(() => {
  const e = [...document.querySelectorAll("#hk-ribbon button")].find((x) => /ejemplo animado/.test(x.title || ""));
  if (!e) return null; const r = e.getBoundingClientRect();
  const c = { x: r.left + r.width/2, y: r.top + r.height/2 };
  const arriba = document.elementFromPoint(c.x, c.y);
  return { ...c, tapado: !e.contains(arriba) && arriba !== e,
           quienTapa: arriba ? (arriba.id || arriba.className || arriba.tagName).toString().slice(0,40) : null };
});
ok(!!b, "el botón «?» existe");
ok(b && !b.tapado, "y NO está tapado por el panel (con los paneles como abren)",
   b ? `en (${Math.round(b.x)}, ${Math.round(b.y)}) · encima: ${b.quienTapa}` : "");
await pag.screenshot({ path: join(OUT, "01_cinta_encajada.png") });
await pag.mouse.click(b.x, b.y); await esp(700);
ok(await pag.evaluate(() => window.__hekatanAyudaModo === true), "el clic del ratón SÍ llega: entra en modo ayuda");
const bRect = await pag.evaluate(() => { const e = [...document.querySelectorAll("#hk-ribbon button")]
  .find((x) => /Rect/.test(x.textContent || "")); const r = e.getBoundingClientRect();
  return { x: r.left + r.width/2, y: r.top + r.height/2 }; });
await pag.mouse.click(bRect.x, bRect.y); await esp(1200);
ok(await pag.evaluate(() => document.getElementById("hk-ayuda-anim")?.style.display === "block"),
   "y al tocar «Rectángulo» sale su vídeo");
await pag.screenshot({ path: join(OUT, "02_ayuda_con_paneles.png") });
ok(err.length === 0, "sin errores de página", err.slice(0,2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
