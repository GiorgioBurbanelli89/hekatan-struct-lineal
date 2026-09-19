/**
 * ¿SE PUEDEN QUITAR LAS GRILLAS Y LA REJILLA? (Jorge, 16-sep-2026:
 * «¿qué es eso de rejilla, no se puede eliminar cuando ya se coloca?»)
 *
 * Diagnóstico, sin arreglar nada todavía:
 *   1. ▦+ pone una grilla auxiliar y pulsarlo otra vez A LA MISMA cota, ¿la quita?
 *   2. con varias puestas (▦×), ¿hay manera de quitarlas todas?
 *   3. 🏗 Rejilla genera ejes, niveles y columnas: ¿se deshace con Anterior (Ctrl+Z)?
 *   4. repaso de TODOS los botones de acceso rápido: ¿alguno deja la página rota?
 *
 *   node cli/_quitar_grillas.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "quitar_grillas");
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
await new Promise((r) => srv.listen(4801, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 140)));
pag.on("dialog", (d) => d.dismiss().catch(() => {}));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const marca = (t) => console.log("\n── " + t);

await pag.goto(`http://localhost:4801${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(500); }
}
const boton = (f) => pag.evaluate((f) => {
  const b = [...document.querySelectorAll("#hk-ribbon button")].find((e) => e.offsetParent !== null &&
    new RegExp(f).test((e.textContent || "") + " " + (e.title || "")));
  if (!b) return null; const r = b.getBoundingClientRect();
  const c = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  return (c.x <= window.innerWidth && c.y <= window.innerHeight) ? c : null; }, f);
const clic = async (f, ms = 700) => { const b = await boton(f); if (!b) { console.log("   (no está el botón " + f + ")"); return false; }
  await pag.mouse.click(b.x, b.y); await esp(ms); return true; };
const escribir = async (v) => {
  const c = await pag.evaluate(() => { const e = document.getElementById("hk-dist-plano"); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  if (!c) return false;
  await pag.mouse.click(c.x, c.y, { clickCount: 3 }); await pag.keyboard.type(String(v));
  await pag.keyboard.press("Enter"); await esp(500); return true;
};
const grillas = () => pag.evaluate(() => ({
  aux: (window.__hekatanPlanosAux ?? []).map((g) => `${g.plano} ${g.d}`),
  niveles: (window.__hekatanLevels ?? []).length,
  ejes: (window.__hekatanAxisGrids ?? []).length,
  enEscena: (() => { let n = 0; document.querySelector("#viewer").__ctx.scene.traverse((o) => {
    if (typeof o.name === "string" && o.name.startsWith("hekatan-grid")) n++; }); return n; })(),
  nudos: (window.__hekatanDrawingPoints?.rawVal ?? []).length,
}));

// ── 1. poner y quitar UNA ─────────────────────────────────────────────────
marca("1) ▦+ poner y volver a pulsar a la MISMA cota");
await escribir(3); await clic("grilla auxiliar(?!.*Replicar)");
console.log("   tras poner : " + JSON.stringify(await grillas()));
await clic("grilla auxiliar(?!.*Replicar)");
const g2 = await grillas();
console.log("   tras repetir: " + JSON.stringify(g2));
console.log(g2.aux.length === 0 ? "   ✓ se quita pulsando otra vez a la misma cota"
                                : "   ✗ NO se quita");

// ── 2. varias con ▦× y cómo quitarlas ─────────────────────────────────────
marca("2) ▦× deja varias — ¿hay forma de quitarlas todas?");
await escribir(0); await clic("Replicar la grilla auxiliar");
const g3 = await grillas();
console.log("   puestas    : " + JSON.stringify(g3.aux));
const hayLimpiar = await pag.evaluate(() => {
  const t = [...document.querySelectorAll("#hk-ribbon button")].map((b) => (b.title || "") + " " + (b.textContent || ""));
  return t.some((x) => /limpiar|quitar todas|borrar grillas/i.test(x));
});
console.log(hayLimpiar ? "   ✓ hay un botón para limpiarlas" :
  "   ✗ NO hay botón de limpiar: hay que acertar la cota exacta de cada una");
// ¿Ctrl+Z las quita?
await pag.keyboard.down("Control"); await pag.keyboard.press("KeyZ"); await pag.keyboard.up("Control"); await esp(800);
const g4 = await grillas();
console.log("   tras Ctrl+Z: " + JSON.stringify(g4.aux) +
  (g4.aux.length < g3.aux.length ? "   ✓ deshacer las quita" : "   ✗ deshacer NO las toca"));

// ── 3. la REJILLA generada (🏗) ───────────────────────────────────────────
marca("3) 🏗 Rejilla: ¿se puede deshacer lo que genera?");
const antes = await grillas();
await clic("Rejilla", 1800);
const desp = await grillas();
console.log("   antes: " + JSON.stringify(antes));
console.log("   tras 🏗 Rejilla: " + JSON.stringify(desp));
await pag.keyboard.down("Control"); await pag.keyboard.press("KeyZ"); await pag.keyboard.up("Control"); await esp(1000);
const desh = await grillas();
console.log("   tras Ctrl+Z: " + JSON.stringify(desh) +
  (desh.nudos < desp.nudos ? "   ✓ se deshace" : "   ✗ NO se deshace con Ctrl+Z"));
await pag.screenshot({ path: join(OUT, "01_rejilla.png") });

// ── 4. repaso de TODOS los botones de acceso rápido ───────────────────────
marca("4) repaso de los botones de la cinta (¿alguno rompe la página?)");
const lista = await pag.evaluate(() => [...document.querySelectorAll("#hk-ribbon button")]
  .map((b) => { const r = b.getBoundingClientRect();
    return { rot: (b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 18),
             x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; })
  .filter((b) => b.w > 0 && b.x <= window.innerWidth && b.y <= window.innerHeight));
const rotos = [];
for (const b of lista) {
  const n0 = err.length;
  await pag.mouse.click(b.x, b.y); await esp(280);
  await pag.keyboard.press("Escape"); await esp(120);
  if (err.length > n0) rotos.push(`${b.rot}: ${err[err.length - 1]}`);
}
console.log(`   ${lista.length} botones pulsados`);
console.log(rotos.length ? "   ✗ dan error: " + rotos.join(" | ") : "   ✓ ninguno da error de página");
const vivo = await pag.evaluate(() => !!document.querySelector("#viewer")?.__ctx?.camera);
console.log(vivo ? "   ✓ la página sigue viva al final" : "   ✗ la página se quedó sin visor");
await pag.screenshot({ path: join(OUT, "02_final.png") });
console.log("\npageerror totales: " + err.length + " " + JSON.stringify(err.slice(0, 3)));
await nav.close(); srv.close();
