/**
 * REPLICAR LA GRILLA AUXILIAR (▦×), con la regla que puso Jorge:
 *   «si está en XY debe replicarse en las posiciones Z; si tengo XZ se desplaza en Y
 *    y YZ en X».
 *
 * Se mide en los tres planos: que las grillas queden separadas la altura de las
 * casillas, que sean del plano correcto y que no se dupliquen al repetir.
 *
 *   node cli/_replicar_grilla.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "replicar_grilla");
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
await new Promise((r) => srv.listen(4785, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:4785${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(4, 3, 4); c.position.set(24, -20, 16);
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
});
const boton = (f) => pag.evaluate((f) => {
  const b = [...document.querySelectorAll("#hk-ribbon button")].find((e) => e.offsetParent !== null &&
    new RegExp(f).test((e.textContent || "") + " " + (e.title || "")));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, f);
const escribir = async (sel, v) => {
  const c = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  if (!c) return false;
  await pag.mouse.click(c.x, c.y, { clickCount: 3 }); await pag.keyboard.type(String(v));
  await pag.keyboard.press("Enter"); await esp(500); return true;
};
const aux = () => pag.evaluate(() => (window.__hekatanPlanosAux ?? []).map((g) => `${g.plano} ${g.d}`));

const bRep = await boton("Replicar la grilla auxiliar");
ok(!!bRep, "está el botón ▦× de replicar la grilla");

// ── PLANTA: de 0, cada 3, tres veces → 0, 3, 6, 9 en Z ────────────────────
await escribir("#hk-dist-plano", "0");
const casillas = await pag.evaluate(() => [...document.querySelectorAll("#hk-ribbon input[type=text]")]
  .map((e, i) => ({ i, title: (e.title || "").slice(0, 40) })));
console.log("       casillas: " + JSON.stringify(casillas));
await pag.mouse.click(bRep.x, bRep.y); await esp(900);
const a1 = await aux();
console.log("       grillas: " + JSON.stringify(a1));
ok(a1.length === 3 && a1.every((g) => g.startsWith("xy")), "en PLANTA replica en Z", a1.join(" · "));
const zs = a1.map((g) => parseFloat(g.split(" ")[1])).sort((x, y) => x - y);
ok(zs.join(",") === "3,6,9", "grillas NUEVAS aparte (3, 6, 9), sin duplicar la de trabajo (0)", zs.join(" · "));
const wz0 = await pag.evaluate(() => window.__hekatanCadState?.get?.()?.workZ ?? 0);
ok(Math.abs(wz0) < 1e-6, "y replicar NO mueve la grilla de trabajo (sigue en Z = 0)", "workZ = " + wz0);
await pag.screenshot({ path: join(OUT, "01_planta_z.png") });

// repetir no duplica
await pag.mouse.click(bRep.x, bRep.y); await esp(800);
ok((await aux()).length === a1.length, "pulsarlo otra vez no duplica las que ya están", (await aux()).length + " grillas");

// ── ALZADO FRONTAL: replica en Y ──────────────────────────────────────────
const bFrente = await boton("Frente");
await pag.mouse.click(bFrente.x, bFrente.y); await esp(1100);
await escribir("#hk-dist-plano", "2");
await pag.mouse.click(bRep.x, bRep.y); await esp(900);
const a2 = (await aux()).filter((g) => g.startsWith("xz"));
ok(a2.length === 3, "en ALZADO FRONTAL replica en Y", a2.join(" · "));
const ys = a2.map((g) => parseFloat(g.split(" ")[1])).sort((x, y) => x - y);
ok(ys.join(",") === "5,8,11", "desde la distancia escrita (2) → 5, 8, 11", ys.join(" · "));

// ── LATERAL: replica en X ─────────────────────────────────────────────────
const bLado = await boton("Lado");
await pag.mouse.click(bLado.x, bLado.y); await esp(1100);
await escribir("#hk-dist-plano", "1");
await pag.mouse.click(bRep.x, bRep.y); await esp(900);
const a3 = (await aux()).filter((g) => g.startsWith("yz"));
ok(a3.length === 3, "en LATERAL replica en X", a3.join(" · "));

// y las tres familias conviven, cada una en su plano
const todas = await aux();
const porPlano = { xy: 0, xz: 0, yz: 0 };
for (const g of todas) porPlano[g.split(" ")[0]]++;
ok(porPlano.xy === 3 && porPlano.xz === 3 && porPlano.yz === 3,
   "las tres familias conviven", JSON.stringify(porPlano));
const enEscena = await pag.evaluate(() => { let n = 0;
  document.querySelector("#viewer").__ctx.scene.traverse((o) => {
    if (typeof o.name === "string" && o.name.startsWith("hekatan-grid")) n++; });
  return n; });
ok(enEscena >= 7, "y se DIBUJAN en la escena", enEscena + " rejillas");
await pag.screenshot({ path: join(OUT, "02_tres_familias.png") });

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
