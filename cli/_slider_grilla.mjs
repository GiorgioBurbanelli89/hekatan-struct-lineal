/**
 * COLOCAR LA GRILLA ARRASTRANDO (Jorge: «cómo posiciono la grilla auxiliar, o con
 * un slider puede ser»).
 *
 * Se mide lo que importa:
 *   1. el slider está en la cinta, al lado de la casilla;
 *   2. MIENTRAS se arrastra, la rejilla se mueve (se leen posiciones intermedias);
 *   3. la casilla y el slider van atados en los dos sentidos;
 *   4. en alzado (plano XZ) el slider mueve la Y, no la Z;
 *   5. ▦+ deja puesta la grilla donde la dejaste con el dedo.
 *
 *   node cli/_slider_grilla.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "slider_grilla");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4779;
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
// una referencia dibujada, para ver la grilla respecto de algo
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(4, 3, 2); c.position.set(20, -17, 13);
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
});

const caja = (sel) => pag.evaluate((s) => {
  const e = document.querySelector(s); if (!e) return null;
  const r = e.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, x0: r.left, x1: r.right, w: r.width };
}, sel);

const sl = await caja("#hk-dist-slider");
ok(!!sl, "el slider está en la cinta, junto a la casilla", sl ? `ancho ${Math.round(sl.w)} px` : "");
const gz = () => pag.evaluate(() => window.__hekatanDrawingGridTarget?.rawVal?.position ?? null);

// ── 2. arrastrar y leer posiciones INTERMEDIAS ────────────────────────────
await pag.mouse.move(sl.x, sl.y); await pag.mouse.down();
const camino = [];
for (let i = 1; i <= 6; i++) {
  await pag.mouse.move(sl.x + i * 6, sl.y); await esp(140);
  const p = await gz(); camino.push(p ? +p[2].toFixed(2) : null);
}
await pag.mouse.up(); await esp(400);
console.log("       cota de la rejilla mientras se arrastra: " + JSON.stringify(camino));
const distintos = new Set(camino.filter((v) => v !== null)).size;
ok(distintos > 1, "la rejilla se mueve MIENTRAS arrastras (no al soltar)", distintos + " posiciones distintas");
const fin = await gz();
const casilla = await pag.evaluate(() => document.getElementById("hk-dist-plano")?.value);
ok(Math.abs(parseFloat(casilla) - fin[2]) < 0.051, "la casilla dice dónde quedó", `casilla ${casilla} · rejilla z = ${fin[2].toFixed(2)}`);
await pag.screenshot({ path: join(OUT, "01_arrastrado.png") });

// ── 3. escribir en la casilla mueve el slider ─────────────────────────────
const cz = await caja("#hk-dist-plano");
await pag.mouse.click(cz.x, cz.y, { clickCount: 3 });
await pag.keyboard.type("7.5"); await pag.keyboard.press("Enter"); await esp(700);
const vSlider = await pag.evaluate(() => document.getElementById("hk-dist-slider")?.value);
ok(Math.abs(parseFloat(vSlider) - 7.5) < 1e-6, "y al revés: escribir en la casilla mueve el slider", "slider = " + vSlider);

// ── 4. en alzado, el slider mueve la Y ────────────────────────────────────
const bFrente = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("#hk-ribbon button")].find((e) => /Frente/.test(e.textContent || ""));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
await pag.mouse.click(bFrente.x, bFrente.y); await esp(1200);
const sl2 = await caja("#hk-dist-slider");
await pag.mouse.move(sl2.x, sl2.y); await pag.mouse.down();
await pag.mouse.move(sl2.x + 22, sl2.y); await esp(300); await pag.mouse.up(); await esp(500);
const st = await pag.evaluate(() => { const s = window.__hekatanCadState?.get?.() ?? {};
  return { plano: s.workPlane, Y: s.workY, Z: s.workZ }; });
const pos = await gz();
ok(st.plano === "xz" && Math.abs(pos[1] - st.Y) < 1e-6 && Math.abs(pos[1]) > 0.01,
   "en alzado el slider mueve la Y del plano (no la cota Z)", JSON.stringify(st) + " · rejilla " + JSON.stringify(pos));

// ── 5. ▦+ la deja puesta donde la dejaste ─────────────────────────────────
const bAux = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("#hk-ribbon button")].find((e) => (e.title || "").includes("grilla auxiliar"));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
await pag.mouse.click(bAux.x, bAux.y); await esp(700);
const aux = await pag.evaluate(() => window.__hekatanPlanosAux ?? []);
ok(aux.some((g) => g.plano === "xz" && Math.abs(g.d - st.Y) < 0.051),
   "▦+ deja la grilla donde la dejó el dedo", JSON.stringify(aux));
await pag.screenshot({ path: join(OUT, "02_alzado_slider.png") });

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
