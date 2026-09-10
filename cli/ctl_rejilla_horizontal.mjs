/**
 * ¿La rejilla del lienzo en blanco sale HORIZONTAL, y el clic cae en Z = 0?
 *
 * Nada más abrir, sin tocar ninguna vista. Salía DE PIE: la geometría del plano
 * viene pre-rotada (está en X-Z) y el estado inicial la dejaba con rotación cero,
 * así que la rejilla flotaba de canto y el clic aterrizaba en un plano vertical —
 * con la barra de estado diciendo «Plano XY». No se cazó antes porque todas las
 * pruebas empiezan pulsando «Planta», que lo corregía por el camino.
 *
 *   node cli/ctl_rejilla_horizontal.mjs           (local)
 *   node cli/ctl_rejilla_horizontal.mjs publico   (el sitio de GitHub Pages)
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
const PUERTO = 4769;
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
await pag.evaluate(() => {
  for (const id of ["hk-ribbon-guia", "settings", "hk-pane-host"]) document.getElementById(id)?.remove();
});

// ── 1. la rejilla, tumbada ─────────────────────────────────────────────────
const g = await pag.evaluate(() => {
  const v = document.querySelector("#viewer");
  let o = null;
  v.__ctx.scene.traverse((x) => { if (x.name === "hekatan-grid") o = x; });
  if (!o) return null;
  o.updateMatrixWorld();
  const e = o.matrixWorld.elements;
  return { normal: [e[8], e[9], e[10]].map((q) => +q.toFixed(3)),
           plano: window.__hekatanCadState?.get?.()?.workPlane };
});
ok(!!g && Math.abs(g.normal[2]) > 0.999,
   "la rejilla sale HORIZONTAL nada más abrir", g ? `normal ${g.normal.join(", ")}` : "no está");
ok(g?.plano === "xy", "y la barra de estado dice lo mismo que el plano", String(g?.plano));

// ── 2. el clic cae en Z = 0 ────────────────────────────────────────────────
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera, ct = v.__ctx.controls;
  if (ct) { ct.enableDamping = false; ct.target.set(0, 0, 0); }
  c.up.set(0, 0, 1); c.position.set(12, -15, 7);
  if (c.isOrthographicCamera) { c.zoom = 1; c.updateProjectionMatrix(); }
  c.lookAt(0, 0, 0); ct?.update?.(); v.__ctx.render?.();
});
await espera(600);
const cv = await pag.evaluate(() => {
  const r = document.querySelector("#viewer").querySelector("canvas").getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height * 0.62 };
});
await pag.mouse.move(cv.x, cv.y, { steps: 6 });
await espera(500);
const m = await pag.evaluate(() => {
  const s = window.__hekatanSnapMarker;
  return s?.visible ? [s.position.x, s.position.y, s.position.z].map((q) => +q.toFixed(3)) : null;
});
ok(!!m && Math.abs(m[2]) < 1e-6, "el cursor aterriza en el suelo (Z = 0)", JSON.stringify(m));
ok(!!m && Math.abs(m[0]) < 60 && Math.abs(m[1]) < 60,
   "y en coordenadas de la obra, no a 200 m", JSON.stringify(m));
await pag.screenshot({ path: join(OUT, PUB ? "rejilla_publico.png" : "rejilla_local.png") });

// ── 3. y las elevaciones siguen poniéndola de pie, que para eso están ──────
const normal = () => pag.evaluate(() => {
  const v = document.querySelector("#viewer");
  let o = null; v.__ctx.scene.traverse((x) => { if (x.name === "hekatan-grid") o = x; });
  o?.updateMatrixWorld();
  const e = o.matrixWorld.elements;
  return { n: [e[8], e[9], e[10]].map((q) => +q.toFixed(2)),
           plano: window.__hekatanCadState?.get?.()?.workPlane };
});
const vista = async (i) => { await pag.evaluate((k) => window.__hekatanRibbon?.vista?.(k), i); await espera(1400); };
await vista(1); const fr = await normal();
ok(Math.abs(fr.n[1]) > 0.9 && fr.plano === "xz", "«Frente» la pone de pie en X-Z", JSON.stringify(fr));
await vista(2); const la = await normal();
ok(Math.abs(la.n[0]) > 0.9 && la.plano === "yz", "«Lado» la pone de pie en Y-Z", JSON.stringify(la));
await vista(3); const iso = await normal();
ok(Math.abs(iso.n[2]) > 0.9 && iso.plano === "xy", "«3D» la devuelve al suelo", JSON.stringify(iso));
await vista(0); const pl = await normal();
ok(Math.abs(pl.n[2]) > 0.9 && pl.plano === "xy", "«Planta» la deja en el suelo", JSON.stringify(pl));
await nav.close(); srv?.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : `\nTodo correcto (${PUB ? "sitio público" : "local"})`);
process.exit(fallos.length ? 1 : 0);
