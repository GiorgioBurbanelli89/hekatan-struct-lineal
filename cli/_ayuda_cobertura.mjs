/**
 * ¿TIENE VÍDEO **CADA** BOTÓN? (Jorge: «si presiono cualquier botón debe tener un
 * recuadro con vídeo, así uno ve»).
 *
 * Recorre TODOS los botones visibles de la cinta en modo ayuda y, para cada uno,
 * comprueba tres cosas: que se abre el cuadro, que tiene título, y que el lienzo
 * ANIMA (dos capturas del SVG separadas en el tiempo tienen que diferir). Al final
 * lista los que se quedan sin ejemplo propio.
 *
 *   node cli/_ayuda_cobertura.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "ayuda_cobertura");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => srv.listen(4789, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));

await pag.goto(`http://localhost:4789${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
// todos los botones de la cinta que estén dentro de la pantalla (menos el propio «?»)
const lista = await pag.evaluate(() => [...document.querySelectorAll("#hk-ribbon button")]
  .map((b, i) => { const r = b.getBoundingClientRect();
    return { i, rot: (b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 22),
             tit: (b.title || "").slice(0, 30),
             x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; })
  .filter((b) => b.w > 0 && b.x <= window.innerWidth && b.y <= window.innerHeight && !/ejemplo animado/.test(b.tit)));
console.log(`Botones de la cinta a revisar: ${lista.length}\n`);
const bA = await pag.evaluate(() => { const b = [...document.querySelectorAll("#hk-ribbon button")]
  .find((e) => /ejemplo animado/.test(e.title || "")); const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });

const sinEjemplo = [], sinCuadro = [], quietos = [];
for (const b of lista) {
  // entrar en modo ayuda de forma fiable
  await pag.keyboard.press("Escape"); await esp(160);
  for (let k = 0; k < 3 && !(await pag.evaluate(() => window.__hekatanAyudaModo === true)); k++) {
    await pag.mouse.click(bA.x, bA.y); await esp(260);
  }
  await pag.mouse.click(b.x, b.y); await esp(500);
  const abierto = await pag.evaluate(() => document.getElementById("hk-ayuda-anim")?.style.display === "block");
  if (!abierto) { sinCuadro.push(b.rot); console.log(`  --  ${b.rot.padEnd(14)} no abre cuadro`); continue; }
  const svg1 = await pag.evaluate(() => document.querySelector("#hk-ayuda-anim svg")?.outerHTML ?? "");
  await esp(900);
  const svg2 = await pag.evaluate(() => document.querySelector("#hk-ayuda-anim svg")?.outerHTML ?? "");
  const txt = await pag.evaluate(() => [...document.querySelectorAll("#hk-ayuda-anim div")].map((d) => d.textContent).join(" "));
  const generico = /Todavía no hay un ejemplo animado/.test(txt);
  const anima = svg1 !== "" && svg1 !== svg2;
  if (generico) sinEjemplo.push(b.rot);
  if (!anima && !generico) quietos.push(b.rot);
  console.log(`  ${generico ? "··" : anima ? "OK" : "--"}  ${b.rot.padEnd(14)} ${generico ? "sin ejemplo propio (solo texto)" : anima ? "vídeo OK" : "el lienzo NO se mueve"}`);
}
await pag.screenshot({ path: join(OUT, "ultimo.png") });
console.log("");
console.log("sin abrir cuadro : " + (sinCuadro.length ? sinCuadro.join(", ") : "ninguno"));
console.log("sin ejemplo      : " + (sinEjemplo.length ? sinEjemplo.join(", ") : "ninguno"));
console.log("cuadro quieto    : " + (quietos.length ? quietos.join(", ") : "ninguno"));
console.log("pageerror        : " + err.length);
await nav.close(); srv.close();
const mal = sinCuadro.length + sinEjemplo.length + quietos.length;
console.log(mal ? `\n${mal} boton(es) sin video` : "\nTodos los botones tienen video");
process.exit(mal ? 1 : 0);
