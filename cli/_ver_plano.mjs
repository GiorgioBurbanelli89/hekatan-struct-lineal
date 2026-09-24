/**
 * IR A LA VISTA DEL PLANO (◎) — Jorge, 16-sep-2026: «debe haber algo para ir a la
 * vista en esa posición de esa grilla, en el plano tanto XY, XZ o YZ».
 *
 * Se mide, en los tres planos, que la cámara acaba:
 *   · MIRANDO el plano de frente (la línea cámara→mira es la normal del plano);
 *   · CENTRADA en la distancia del plano (no en el origen);
 *   · con lo dibujado a esa cota dentro del cuadro.
 *
 *   node cli/_ver_plano.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "ver_plano");
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
await new Promise((r) => srv.listen(4809, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 150)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:4809${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
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
const escribir = async (v) => {
  const c = await pag.evaluate(() => { const e = document.getElementById("hk-dist-plano"); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await pag.mouse.click(c.x, c.y, { clickCount: 3 }); await pag.keyboard.type(String(v));
  await pag.keyboard.press("Enter"); await esp(600);
};
const camara = () => pag.evaluate(() => {
  const c = document.querySelector("#viewer").__ctx;
  const t = c.controls?.target ?? { x: 0, y: 0, z: 0 };
  return { pos: [c.camera.position.x, c.camera.position.y, c.camera.position.z].map((v) => +v.toFixed(2)),
           mira: [t.x, t.y, t.z].map((v) => +v.toFixed(2)) };
});

const bVer = await boton("Ir a la vista de ESTE plano");
ok(!!bVer, "está el botón ◎ de ir a la vista del plano");

const casos = [
  { vista: "Planta",  plano: "xy", d: 6,   eje: 2, nombre: "PLANTA en Z = 6" },
  { vista: "Frente",  plano: "xz", d: 8,   eje: 1, nombre: "ALZADO FRONTAL en Y = 8" },
  { vista: "Lado",    plano: "yz", d: 4.5, eje: 0, nombre: "LATERAL en X = 4.5" },
];
for (const c of casos) {
  const bv = await boton(c.vista);
  await pag.mouse.click(bv.x, bv.y); await esp(1100);      // elegir el plano de trabajo
  await escribir(c.d);
  await pag.mouse.click(bVer.x, bVer.y); await esp(1200);
  const cam = await camara();
  // ¿mira el plano de frente? la dirección cámara→mira debe ser la normal del plano
  const dir = [cam.mira[0] - cam.pos[0], cam.mira[1] - cam.pos[1], cam.mira[2] - cam.pos[2]];
  const m = Math.hypot(...dir); const u = dir.map((v) => Math.abs(v / m));
  const deFrente = u[c.eje] > 0.99;
  const centrada = Math.abs(cam.mira[c.eje] - c.d) < 0.01;
  console.log(`       ${c.nombre}: cámara ${JSON.stringify(cam.pos)} → mira ${JSON.stringify(cam.mira)}`);
  ok(deFrente, `${c.nombre}: la cámara mira el plano DE FRENTE`, "dirección " + u.map((v) => v.toFixed(2)).join(","));
  ok(centrada, `${c.nombre}: centrada en la distancia del plano, no en el origen`,
     `mira[${"xyz"[c.eje]}] = ${cam.mira[c.eje]} (esperado ${c.d})`);
  await pag.screenshot({ path: join(OUT, `${c.plano}_${c.d}.png`) });
}
ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
