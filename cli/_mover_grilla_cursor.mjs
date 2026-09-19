/**
 * MOVER LA GRILLA CON EL CURSOR, CON RECUADRO DE DISTANCIA.
 *
 * Jorge (16-sep-2026): «o con el teclado, así como el cursor: selecciono la grilla y
 * me desplaza, va a hacer paralelo perpendicularmente a una distancia que elija, en
 * un recuadro para colocar la distancia».
 *
 * Se mide:
 *   1. el botón ↕ enciende el modo y sale el recuadro de distancia;
 *   2. al mover el ratón la grilla SE DESPLAZA (y solo en su normal: X e Y quietas);
 *   3. tecleando 4.75 + Enter queda EXACTAMENTE a esa distancia;
 *   4. Esc devuelve la grilla donde estaba;
 *   5. en alzado (XZ) mueve la Y, no la Z.
 *
 *   node cli/_mover_grilla_cursor.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "mover_grilla");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4781;
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
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
// vista isométrica: en planta pura el eje Z apunta a la cámara y no se puede mover
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(4, 3, 2); c.position.set(20, -17, 13);
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
});
await esp(600);

const boton = (f) => pag.evaluate((f) => {
  const b = [...document.querySelectorAll("#hk-ribbon button")].find((e) => e.offsetParent !== null &&
    new RegExp(f).test((e.textContent || "") + " " + (e.title || "")));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, f);
const pos = () => pag.evaluate(() => (window.__hekatanDrawingGridTarget?.rawVal?.position ?? []).map((v) => +v.toFixed(3)));
const cajaTxt = () => pag.evaluate(() => {
  const c = document.getElementById("hk-grid-dist");
  return c && c.style.display !== "none" ? c.value : null; });

// ── 1. encender el modo ───────────────────────────────────────────────────
const bMover = await boton("paralela a si misma");
ok(!!bMover, "está el botón ↕ de mover la grilla");
await pag.mouse.click(bMover.x, bMover.y); await esp(600);
ok(await pag.evaluate(() => window.__hekatanMoviendoGrilla === true), "el modo se enciende");
await pag.mouse.move(700, 500); await esp(300);
const c1 = await cajaTxt();
ok(!!c1 && /Z =/.test(c1), "sale el recuadro con la distancia junto al cursor", c1 ?? "no hay recuadro");

// ── 2. mover el ratón desplaza la grilla, y SOLO en su normal ─────────────
const camino = [];
for (const y of [470, 430, 390, 350]) { await pag.mouse.move(700, y); await esp(200); camino.push(await pos()); }
console.log("       posición de la grilla al mover: " + JSON.stringify(camino));
const zs = new Set(camino.map((p) => p[2]));
ok(zs.size > 1, "la grilla se desplaza mientras mueves el ratón", [...zs].join(" · "));
ok(camino.every((p) => Math.abs(p[0]) < 1e-6 && Math.abs(p[1]) < 1e-6),
   "y se mueve PARALELA: solo cambia su normal (X e Y quietas)", JSON.stringify(camino.at(-1)));
await pag.screenshot({ path: join(OUT, "01_moviendo.png") });

// ── 3. teclear la distancia exacta ────────────────────────────────────────
for (const k of ["4", ".", "7", "5"]) { await pag.keyboard.press(k === "." ? "Period" : "Digit" + k); await esp(120); }
const c2 = await cajaTxt();
ok(!!c2 && /4\.75/.test(c2), "lo tecleado se ve en el recuadro", c2 ?? "");
await pag.screenshot({ path: join(OUT, "02_tecleando.png") });
await pag.keyboard.press("Enter"); await esp(500);
const pFin = await pos();
ok(Math.abs(pFin[2] - 4.75) < 1e-6, "Enter la deja EXACTAMENTE a esa distancia", JSON.stringify(pFin));
ok(await pag.evaluate(() => window.__hekatanMoviendoGrilla !== true), "y el modo se apaga solo");
const wz = await pag.evaluate(() => window.__hekatanCadState?.get?.()?.workZ);
ok(Math.abs(wz - 4.75) < 1e-6, "la cota de trabajo queda en ese valor", "workZ = " + wz);

// ── 4. Esc devuelve la grilla donde estaba ────────────────────────────────
await pag.mouse.click(bMover.x, bMover.y); await esp(500);
await pag.mouse.move(700, 300); await esp(300);
const movida = await pos();
await pag.keyboard.press("Escape"); await esp(500);
const vuelta = await pos();
ok(Math.abs(vuelta[2] - 4.75) < 1e-6 && Math.abs(movida[2] - 4.75) > 0.05,
   "Esc la devuelve donde estaba", `movida a ${movida[2]} → vuelve a ${vuelta[2]}`);

// ── 5. en alzado mueve la Y ───────────────────────────────────────────────
const bFrente = await boton("Frente");
await pag.mouse.click(bFrente.x, bFrente.y); await esp(1200);
await pag.evaluate(() => {   // sacar la cámara del alzado puro: si no, el eje Y apunta a la cámara
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(4, 3, 2); c.position.set(20, -17, 13);
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
});
await esp(500);
await pag.mouse.click(bMover.x, bMover.y); await esp(500);
await pag.mouse.move(760, 430); await esp(300);
for (const k of ["6"]) await pag.keyboard.press("Digit" + k);
await pag.keyboard.press("Enter"); await esp(600);
const pY = await pos();
const st = await pag.evaluate(() => { const s = window.__hekatanCadState?.get?.() ?? {}; return { plano: s.workPlane, Y: s.workY }; });
ok(st.plano === "xz" && Math.abs(pY[1] - 6) < 1e-6, "en alzado mueve la Y (no la cota Z)",
   JSON.stringify(st) + " · rejilla " + JSON.stringify(pY));
await pag.screenshot({ path: join(OUT, "03_alzado_y6.png") });

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
