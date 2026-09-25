/**
 * EL CLIC DERECHO: sobre una BARRA abre la SECCIÓN TRANSVERSAL acotada
 * (sin pasar por el menú, como pidió Jorge el 25-sep-2026: «la sección
 * transversal tiene que ir en click derecho»), y sobre VACÍO sigue abriendo
 * el menú Assign estilo ETABS de siempre.
 *
 *   node cli/ctl_click_derecho_seccion.mjs            (local)
 *   node cli/ctl_click_derecho_seccion.mjs publico
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "seccion"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4774;
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
// galpon: todos los frames tienen sectionShapes (galpon.ts:194)
const url = process.argv[2] === "publico"
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=galpon"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=galpon`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1440, height: 900 });
const errores = [];
pag.on("pageerror", (e) => errores.push(String(e).slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };

await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(5000);
await pag.evaluate(() => {
  document.getElementById("hk-ribbon-guia")?.remove();
  const c = document.querySelector("#viewer").__ctx.controls;
  if (c) { c.enableDamping = false; c.update?.(); }
  window.__hekatanAutoFit?.();
});
await espera(1200);

const proy = (Q) => pag.evaluate((W) => {
  const [wx, wy, wz] = W;
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
  const tx = mv[0]*wx+mv[4]*wy+mv[8]*wz+mv[12], ty = mv[1]*wx+mv[5]*wy+mv[9]*wz+mv[13];
  const tz = mv[2]*wx+mv[6]*wy+mv[10]*wz+mv[14], tw = mv[3]*wx+mv[7]*wy+mv[11]*wz+mv[15];
  const cx = m[0]*tx+m[4]*ty+m[8]*tz+m[12]*tw, cy = m[1]*tx+m[5]*ty+m[9]*tz+m[13]*tw;
  const cw = m[3]*tx+m[7]*ty+m[11]*tz+m[15]*tw;
  return { x: r.left+(cx/cw+1)/2*r.width, y: r.top+(1-cy/cw)/2*r.height };
}, Q);
const menuVisible = () => pag.evaluate(() => !!window.__hekatanMenuVisible?.());
const secInfo = () => pag.evaluate(() => {
  const c = document.getElementById("hk-seccion");
  if (!c || c.style.display === "none") return null;
  return { titulo: c.querySelector("b")?.textContent ?? "",
    perfil: c.querySelector("div div")?.textContent ?? "",
    svg: !!c.querySelector("svg path"),
    sel: (window.__hekatanModelSelection ?? []).map((s) => `${s.type}:${s.idx}`) };
});
const hoverEn = (x, y) => pag.evaluate((a, b) => {
  const h = window.__hekatanFindHovered?.(a, b);
  return h ? { type: h.type, idx: h.idx } : null;
}, x, y);

// ── 1. una barra con forma, cuyo centro detecta findHovered como "frame" ──
const candidatos = await pag.evaluate(() => {
  const els = window.__hekatanStates?.elements?.val ?? [];
  const nds = window.__hekatanStates?.nodes?.val ?? [];
  const shp = (window.__hekatanStates?.elementInputs?.val ?? {}).sectionShapes;
  const out = [];
  for (let i = 0; i < els.length && out.length < 15; i++) {
    const el = els[i];
    if (!el || el.length < 2 || !shp?.get?.(i)) continue;
    const a = nds[el[0]], b = nds[el[1]];
    if (!a || !b) continue;
    out.push({ i, mid: [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2] });
  }
  return out;
});
let barra = null;
for (const c of candidatos) {
  const s = await proy(c.mid);
  // tiene que caer SOBRE el canvas: si el ribbon/ventana tapa el punto, el
  // contextmenu no llega al visor (y el usuario tampoco vería la barra).
  const sobreCanvas = await pag.evaluate((x, y) =>
    document.elementFromPoint(x, y) === document.querySelector("#viewer canvas"), s.x, s.y);
  if (!sobreCanvas) continue;
  const h = await hoverEn(s.x, s.y);
  if (h?.type === "frame" && h.idx === c.i) { barra = { ...c, x: s.x, y: s.y }; break; }
}
ok(!!barra, "hay una barra cuyo medio la detecta findHovered como frame",
   candidatos.length ? `${candidatos.length} candidatas probadas` : "sin candidatas");
if (!barra) { await nav.close(); srv?.close(); process.exit(1); }

// ── 2. clic derecho SOBRE la barra → ventana de sección, sin menú ──
await pag.mouse.move(barra.x, barra.y); await espera(250);
await pag.mouse.click(barra.x, barra.y, { button: "right" }); await espera(600);
ok(!(await menuVisible()), "sobre la BARRA no se abre el menú");
const sec1 = await secInfo();
ok(!!sec1, "se abre el cuadro 📐 Sección");
ok(!!sec1?.svg, "el dibujo SVG de la sección está pintado", sec1?.perfil ?? "");
ok(sec1?.sel.length === 1 && sec1?.sel[0] === `frame:${barra.i}`,
   "queda designada EXACTAMENTE esa barra (el cancel del botón derecho no la vacía)",
   JSON.stringify(sec1?.sel));
await pag.screenshot({ path: join(OUT, PUB ? "barra_publico.png" : "barra_local.png") });

// ── 3. clic derecho sobre VACÍO → el menú de siempre ──
const vacio = await pag.evaluate(() => {
  const cv = document.querySelector("#viewer canvas");
  const r = cv.getBoundingClientRect(), fh = window.__hekatanFindHovered;
  const grilla = [[0.92,0.08],[0.08,0.08],[0.92,0.9],[0.5,0.06],[0.06,0.5],[0.5,0.92],
                  [0.75,0.25],[0.25,0.75],[0.75,0.6],[0.6,0.15],[0.4,0.85],[0.15,0.35]];
  for (const [fx, fy] of grilla) {
    const x = r.left + r.width*fx, y = r.top + r.height*fy;
    // tiene que caer SOBRE el canvas: Tweakpane y demás ventanas se superponen
    // y el contextmenu les llega a ellas, no al visor.
    const el = document.elementFromPoint(x, y);
    if (el !== cv) continue;
    if (!fh || !fh(x, y)) return { x, y };
  }
  return null;
});
ok(!!vacio, "encontré un punto vacío en el lienzo");
if (vacio) {
  await pag.mouse.click(vacio.x, vacio.y, { button: "right" }); await espera(600);
  ok(await menuVisible(), "sobre VACÍO sigue abriendo el menú Assign estilo ETABS");
  await pag.screenshot({ path: join(OUT, PUB ? "vacio_publico.png" : "vacio_local.png") });
  await pag.keyboard.press("Escape"); await espera(300);
  ok(!(await menuVisible()), "Esc cierra el menú");
}
ok(errores.length === 0, "sin errores de página", errores[0] ?? "");
await nav.close(); srv?.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : `\nTodo correcto (${PUB ? "sitio público" : "local"})`);
process.exit(fallos.length ? 1 : 0);
