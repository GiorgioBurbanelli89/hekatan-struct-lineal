/**
 * EL BOTÓN DE AYUDA QUE PREGUNTA: «toca el botón del que quieres asistencia».
 *
 * Comprueba lo que importa, que es lo que no se ve en un JSON:
 *   · el ? entra en modo ayuda y lo DICE en la barra;
 *   · tocar un botón en ese modo NO lo ejecuta (pedir ayuda de Borrar no borra);
 *   · sale el cuadro con su título, su texto y un lienzo que SE MUEVE
 *     (se comparan dos capturas del SVG separadas en el tiempo);
 *   · «▶ Probar ahora» cierra el cuadro y activa la herramienta de verdad.
 *
 *   node cli/_ayuda_senalando.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "ayuda"); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4769;
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
await new Promise((r) => srv.listen(PUERTO, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 180)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

// ⚠️ El panel derecho TAPA el extremo de la cinta: sobre el botón «?»,
// elementFromPoint devuelve el panel («Categoría»), así que el clic por
// coordenadas nunca llega al botón. Se cierran los dos paneles, como haría
// cualquiera antes de dibujar. (Defecto de interfaz anotado aparte.)
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => {
    const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
await esp(400);

const centro = (sel, filtro) => pag.evaluate((sel, filtro) => {
  const b = [...document.querySelectorAll(sel)].find((e) => {
    if (e.offsetParent === null) return false;
    const r = e.getBoundingClientRect();
    if (r.left + r.width / 2 > window.innerWidth || r.top + r.height / 2 > window.innerHeight) return false;
    return !filtro || new RegExp(filtro).test((e.textContent || "") + " " + (e.title || ""));
  });
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}, sel, filtro);

// 1. el ? entra en modo ayuda
const bA = await centro("#hk-ribbon button", "^\\?$|ejemplo animado");
ok(!!bA, "está el botón «?» en la cinta");

// Entrar en modo ayuda de forma FIABLE: Esc para limpiar lo anterior y, si el clic
// no prendió (el panel derecho puede tapar el botón), reintentar una vez.
const entrarAyuda = async () => {
  await pag.keyboard.press("Escape"); await esp(300);
  for (let i = 0; i < 3; i++) {
    if (await pag.evaluate(() => window.__hekatanAyudaModo === true)) return true;
    await pag.mouse.click(bA.x, bA.y); await esp(450);
  }
  return await pag.evaluate(() => window.__hekatanAyudaModo === true);
};
await pag.mouse.click(bA.x, bA.y); await esp(600);
const barra = await pag.evaluate(() => document.getElementById("hk-ribbon-estado")?.textContent || "");
ok(/toca el bot/i.test(barra), "la barra PREGUNTA qué quieres saber", barra.slice(0, 90));
await pag.screenshot({ path: join(OUT, "01_modo_ayuda.png") });

// 2. tocar «Borrar» en modo ayuda NO borra: abre su ayuda
const antes = await pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal ?? []).length);
const bBorrar = await centro("#hk-ribbon button", "Borrar");
await pag.mouse.click(bBorrar.x, bBorrar.y); await esp(900);
const tool = await pag.evaluate(() => window.__hekatanCadState?.get?.()?.tool);
ok(tool !== "delete", "tocar «Borrar» en modo ayuda NO activa la herramienta", "tool = " + tool);
const visible = await pag.evaluate(() => document.getElementById("hk-ayuda-anim")?.style.display);
ok(visible === "block", "sale el cuadro de ayuda");
const titulo = await pag.evaluate(() => document.querySelector("#hk-ayuda-anim div")?.textContent || "");
ok(/Borrar/.test(titulo), "con el nombre del botón que tocaste", titulo.slice(0, 60));

// 3. ¿la animación se MUEVE? dos capturas del SVG separadas en el tiempo
const svg1 = await pag.evaluate(() => document.querySelector("#hk-ayuda-anim svg")?.outerHTML || "");
await esp(1100);
const svg2 = await pag.evaluate(() => document.querySelector("#hk-ayuda-anim svg")?.outerHTML || "");
ok(svg1 !== "" && svg1 !== svg2, "el ejemplo ANIMA (el dibujo cambia solo)",
   svg1 === svg2 ? "el SVG es idéntico un segundo después" : `${svg1.length} → ${svg2.length} caracteres`);
await pag.screenshot({ path: join(OUT, "02_ayuda_borrar.png") });

// 4. una herramienta con ejemplo de dibujo: Rectángulo
ok(await entrarAyuda(), "se puede volver a entrar en modo ayuda");
const bRect = await centro("#hk-ribbon button", "Rect");
await pag.mouse.click(bRect.x, bRect.y); await esp(2600);
await pag.screenshot({ path: join(OUT, "03_ayuda_rect.png") });
// el pie va cambiando con el ejemplo: se muestrea un rato y se junta todo
let pie = "";
for (let i = 0; i < 12; i++) {
  pie += " " + await pag.evaluate(() => [...document.querySelectorAll("#hk-ayuda-anim div")]
    .map((d) => d.textContent).join(" | "));
  await esp(400);
}
ok(/esquina/i.test(pie), "el ejemplo del Rectángulo explica los dos clics",
   [...new Set(pie.split("|").map((s) => s.trim()).filter(Boolean))].join(" · ").slice(0, 110));
const trazos = await pag.evaluate(() => document.querySelectorAll("#hk-ayuda-anim svg rect, #hk-ayuda-anim svg circle").length);
ok(trazos > 0, "y dibuja de verdad en el lienzo del ejemplo", trazos + " trazos");

// 5. «Probar ahora» activa la herramienta
const bProbar = await centro("#hk-ayuda-anim button", "Probar");
ok(!!bProbar, "el cuadro ofrece «▶ Probar ahora»");
if (bProbar) {
  await pag.mouse.click(bProbar.x, bProbar.y); await esp(800);
  const t2 = await pag.evaluate(() => window.__hekatanCadState?.get?.()?.tool);
  ok(t2 === "rect", "«Probar ahora» activa la herramienta de verdad", "tool = " + t2);
  const cerrado = await pag.evaluate(() => document.getElementById("hk-ayuda-anim")?.style.display);
  ok(cerrado === "none", "y cierra el cuadro y el modo ayuda");
}
await pag.screenshot({ path: join(OUT, "04_probar_ahora.png") });

// 6. un mando que no es herramienta: el botón ▦+ de grilla auxiliar
ok(await entrarAyuda(), "y otra vez, para el mando ▦+");
const antesNiv = await pag.evaluate(() => (window.__hekatanLevels ?? []).length);
const bAux = await centro("#hk-ribbon button", "grilla auxiliar");
if (bAux) {
  await pag.mouse.click(bAux.x, bAux.y); await esp(1800);
  const niveles = await pag.evaluate(() => (window.__hekatanLevels ?? []).length);
  ok(niveles === antesNiv, "pedir ayuda de ▦+ tampoco EJECUTA el botón", antesNiv + " -> " + niveles + " niveles");
  const t = await pag.evaluate(() => document.querySelector("#hk-ayuda-anim div")?.textContent || "");
  ok(/Grilla auxiliar/i.test(t), "y sale su ficha", t.slice(0, 50));
  await pag.screenshot({ path: join(OUT, "05_ayuda_grilla_aux.png") });
}

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
