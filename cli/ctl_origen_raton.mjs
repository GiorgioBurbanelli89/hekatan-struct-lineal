/**
 * ¿Se puede empezar a dibujar DESDE EL ORIGEN con el ratón, en isométrico, sin
 * teclear una coordenada?
 *
 * Es la pregunta de Jorge: la rejilla de fondo no es una referencia, y en un lienzo
 * vacío no hay nada a lo que engancharse — así que el primer punto solo se podía
 * teclear. Ahora el ORIGEN y los CRUCES de la rejilla son referencias (OSNAP), como
 * los cruces de ejes en ETABS.
 *
 *   node cli/ctl_origen_raton.mjs            (local)
 *   node cli/ctl_origen_raton.mjs publico
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
const PUERTO = 4771;
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
  document.getElementById("hk-ribbon-guia")?.remove();
  const c = document.querySelector("#viewer").__ctx.controls;
  if (c) { c.enableDamping = false; c.update?.(); }
});
// ISOMÉTRICO, que es donde pregunta Jorge
await pag.evaluate(() => window.__hekatanRibbon?.vista?.(3));
await espera(1200);
const proy = (P) => pag.evaluate((Q) => {
  const [wx, wy, wz] = Q;
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
  const tx = mv[0]*wx+mv[4]*wy+mv[8]*wz+mv[12], ty = mv[1]*wx+mv[5]*wy+mv[9]*wz+mv[13];
  const tz = mv[2]*wx+mv[6]*wy+mv[10]*wz+mv[14], tw = mv[3]*wx+mv[7]*wy+mv[11]*wz+mv[15];
  const cx = m[0]*tx+m[4]*ty+m[8]*tz+m[12]*tw, cy = m[1]*tx+m[5]*ty+m[9]*tz+m[13]*tw;
  const cw = m[3]*tx+m[7]*ty+m[11]*tz+m[15]*tw;
  return { x: r.left+(cx/cw+1)/2*r.width, y: r.top+(1-cy/cw)/2*r.height };
}, P);
const leerMarcador = () => pag.evaluate(() => {
  const s = window.__hekatanSnapMarker;
  const e = document.getElementById("hk-osnap-etiqueta");
  return { pos: s?.visible ? [s.position.x, s.position.y, s.position.z].map((q) => +q.toFixed(4)) : null,
           etiqueta: e && e.style.display !== "none" ? e.textContent : null };
});
// herramienta LÍNEA desde el ribbon (a ratón)
await pag.evaluate(() => window.__hekatanRibbon?.usar?.("line"));
await espera(600);

// ── 1. cerca del ORIGEN, sin teclear nada ──────────────────────────────────
const o = await proy([0, 0, 0]);
await pag.mouse.move(o.x + 4, o.y - 3, { steps: 8 });
await espera(500);
const m1 = await leerMarcador();
ok(!!m1.pos && Math.hypot(m1.pos[0], m1.pos[1], m1.pos[2]) < 1e-9,
   "acercando el ratón al origen, el punto se ENGANCHA a (0,0,0)", JSON.stringify(m1.pos));
ok(m1.etiqueta === "Origen (0,0,0)", "y dice a qué se engancha", String(m1.etiqueta));
await pag.screenshot({ path: join(OUT, PUB ? "origen_publico.png" : "origen_local.png"),
  clip: { x: Math.max(0, o.x - 170), y: Math.max(0, o.y - 130), width: 340, height: 240 } });

// ── 2. un CRUCE de la rejilla, a 3 m del origen ───────────────────────────
// El cruce es referencia SOLO con el enganche (F9) encendido: la cuadrícula cubre
// todo el plano y si valiera siempre no quedaría dibujo a mano alzada.
await pag.evaluate(() => window.__hekatanToggleSnap?.());
await espera(300);
const g = await proy([3, -2, 0]);
await pag.mouse.move(g.x + 3, g.y + 2, { steps: 8 });
await espera(500);
const m2 = await leerMarcador();
ok(!!m2.pos && Math.abs(m2.pos[0] - 3) < 1e-6 && Math.abs(m2.pos[1] + 2) < 1e-6,
   "y a un CRUCE de la rejilla, como en ETABS", JSON.stringify(m2.pos));
ok(m2.etiqueta === "Cruce de rejilla", "…con su nombre", String(m2.etiqueta));

// ── 3. dibujar la línea 0,0,0 → 3,-2,0 SOLO con el ratón ──────────────────
await pag.mouse.move(o.x + 4, o.y - 3, { steps: 6 }); await espera(300);
await pag.mouse.click(o.x + 4, o.y - 3); await espera(400);
await pag.mouse.move(g.x + 3, g.y + 2, { steps: 6 }); await espera(300);
await pag.mouse.click(g.x + 3, g.y + 2); await espera(500);
await pag.keyboard.press("Escape"); await espera(300);
const pts = await pag.evaluate(() => (window.__hekatanDrawingPoints?.val || []).map((q) => q.map((c) => +c.toFixed(4))));
ok(pts.length >= 2 && Math.hypot(...pts[0]) < 1e-9,
   "la línea ARRANCA en el origen exacto, dibujada a ratón", JSON.stringify(pts[0]));
ok(pts.length >= 2 && Math.abs(pts[1][0] - 3) < 1e-6 && Math.abs(pts[1][1] + 2) < 1e-6,
   "y termina en el cruce exacto (3, −2, 0)", JSON.stringify(pts[1]));

// ── 4. con el enganche APAGADO, el cruce ya no tira ───────────────────────
await pag.evaluate(() => window.__hekatanToggleSnap?.());
await espera(300);
const g2 = await proy([-3, 2, 0]);
await pag.mouse.move(g2.x + 3, g2.y + 2, { steps: 6 });
await espera(400);
const m3b = await leerMarcador();
ok(!!m3b.pos && (Math.abs(m3b.pos[0] + 3) > 1e-6 || Math.abs(m3b.pos[1] - 2) > 1e-6),
   "con el enganche apagado el cruce NO tira: sigue el dibujo a mano alzada",
   JSON.stringify(m3b.pos));

// ── 5. el CENTRO de un área (centroide) también es referencia ─────────────
// Se dibuja una losa de 4 clics con la rejilla encendida y se busca su centro.
await pag.evaluate(() => window.__hekatanToggleSnap?.());   // F9 ON para clavar las esquinas
await pag.evaluate(() => window.__hekatanRibbon?.usar?.("area"));
await espera(600);
for (const P of [[-6, -6, 0], [-2, -6, 0], [-2, -2, 0], [-6, -2, 0]]) {
  const q = await proy(P);
  await pag.mouse.move(q.x, q.y, { steps: 5 }); await espera(250);
  await pag.mouse.click(q.x, q.y); await espera(350);
}
await pag.keyboard.press("Escape"); await espera(400);
const hayArea = await pag.evaluate(() => (window.__hekatanDrawingAreas?.val || []).length);
ok(hayArea >= 1, "se dibuja una losa de cuatro clics", `${hayArea} área(s)`);
await pag.evaluate(() => window.__hekatanToggleSnap?.());   // F9 OFF: que mande el centroide
await pag.evaluate(() => window.__hekatanRibbon?.usar?.("line"));
await espera(500);
const c = await proy([-4, -4, 0]);
await pag.mouse.move(c.x + 3, c.y + 2, { steps: 6 });
await espera(500);
const mc = await leerMarcador();
ok(!!mc.pos && Math.abs(mc.pos[0] + 4) < 1e-6 && Math.abs(mc.pos[1] + 4) < 1e-6,
   "el CENTRO del paño engancha (centroide)", JSON.stringify(mc.pos));
ok(mc.etiqueta === "Centro", "…con su nombre", String(mc.etiqueta));
await pag.keyboard.press("Escape"); await espera(300);

// ── 6. ALT sigue soltando el cursor ───────────────────────────────────────
await pag.evaluate(({ x, y }) => {
  const cv = document.querySelector("#viewer").querySelector("canvas");
  cv.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, altKey: true, bubbles: true, pointerId: 1 }));
}, { x: o.x + 4, y: o.y - 3 });
await espera(400);
const m4 = await leerMarcador();
ok(!m4.pos || Math.hypot(...m4.pos) > 1e-4, "con ALT no engancha: el punto cae en crudo", JSON.stringify(m4.pos));
await nav.close(); srv?.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : `\nTodo correcto (${PUB ? "sitio público" : "local"})`);
process.exit(fallos.length ? 1 : 0);
