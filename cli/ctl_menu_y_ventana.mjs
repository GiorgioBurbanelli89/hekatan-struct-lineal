/**
 * El MENÚ del clic derecho y la SELECCIÓN por ventana.
 *
 *  · El menú se abría y no había forma de cerrarlo: se cerraba con el `click` de la
 *    ventana en burbuja, y el lienzo del CAD se queda con el clic.
 *  · La ventana izq→der (Window) parecía «no funcionar»: coge solo lo que queda
 *    ENTERO dentro, que es lo correcto — pero no lo decía.
 *
 *   node cli/ctl_menu_y_ventana.mjs            (local)
 *   node cli/ctl_menu_y_ventana.mjs publico
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
const PUERTO = 4773;
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
const cmd = async (t, ms = 380) => {
  await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (i) i.value = ""; });
  await pag.focus("#hk3-cmd-input");
  await pag.type("#hk3-cmd-input", t, { delay: 10 });
  await pag.keyboard.press("Enter"); await espera(ms);
};
// un pórtico, para tener qué seleccionar
await cmd("l"); await cmd("0,0,0"); await cmd("0,0,3"); await pag.keyboard.press("Escape"); await espera(250);
await cmd("l"); await cmd("0,0,3"); await cmd("6,0,3"); await pag.keyboard.press("Escape"); await espera(250);
await cmd("l"); await cmd("6,0,3"); await cmd("6,0,0"); await pag.keyboard.press("Escape"); await espera(350);
await pag.evaluate(() => window.__hekatanRibbon?.vista?.(3)); await espera(800);
await pag.evaluate(() => window.__hekatanAutoFit?.()); await espera(800);
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

// ── 1. el menú del clic derecho: abre y CIERRA ─────────────────────────────
const centro = await proy([3, 0, 1.5]);
await pag.mouse.click(centro.x, centro.y, { button: "right" });
await espera(500);
ok(await menuVisible(), "el clic derecho abre el menú");
await pag.screenshot({ path: join(OUT, PUB ? "menu_publico.png" : "menu_local.png") });
await pag.mouse.click(centro.x - 220, centro.y + 150);   // clic fuera, sobre el lienzo
await espera(400);
ok(!(await menuVisible()), "un clic fuera lo CIERRA (antes se quedaba abierto para siempre)");
await pag.mouse.click(centro.x, centro.y, { button: "right" }); await espera(400);
ok(await menuVisible(), "vuelve a abrir");
await pag.keyboard.press("Escape"); await espera(300);
ok(!(await menuVisible()), "y Esc también lo cierra");
await pag.mouse.click(centro.x, centro.y, { button: "right" }); await espera(400);
await pag.mouse.wheel({ deltaY: -120 }); await espera(400);
ok(!(await menuVisible()), "y la rueda (zoom) lo cierra");
await pag.evaluate(() => window.__hekatanAutoFit?.()); await espera(600);

// ── 2. ventana izq→der y captura der→izq ───────────────────────────────────
await pag.evaluate(() => window.__hekatanRibbon?.usar?.("select")); await espera(400);
const A = await proy([6, 0, 3]), B = await proy([6, 0, 0]);
const R = { x0: Math.min(A.x, B.x) - 40, y0: Math.max(300, Math.min(A.y, B.y) - 25),
            x1: Math.max(A.x, B.x) + 40, y1: Math.max(A.y, B.y) + 25 };
const limpiar = () => pag.evaluate(() => { window.__hekatanSelection?.clear?.(); window.__hekatanRefreshSelection?.(); });
const sel = () => pag.evaluate(() => ({ n: window.__hekatanSelectionSize?.() ?? -1,
  estado: (window.__hekatanCadStatusText || "").slice(0, 120) }));
await limpiar();
await pag.mouse.click(R.x0, R.y0); await espera(350);
await pag.mouse.move(R.x1, R.y1, { steps: 8 }); await espera(250);
await pag.mouse.click(R.x1, R.y1); await espera(500);
const s1 = await sel();
ok(s1.n > 0 && /Window/.test(s1.estado), "IZQ→DER: ventana azul, coge lo que queda ENTERO dentro",
   `${s1.n} objetos · ${s1.estado.slice(0, 46)}`);
await limpiar();
await pag.mouse.click(R.x1, R.y1); await espera(350);
await pag.mouse.move(R.x0, R.y0, { steps: 8 }); await espera(250);
await pag.mouse.click(R.x0, R.y0); await espera(500);
const s2 = await sel();
ok(s2.n > s1.n && /Crossing/.test(s2.estado), "DER→IZQ: captura verde, coge también lo que TOCA",
   `${s2.n} objetos · ${s2.estado.slice(0, 46)}`);

// ── 3. y si la ventana no coge nada, lo EXPLICA ────────────────────────────
await limpiar();
// hueco vacío a la izquierda del pórtico: fuera del panel (que llega a x=301) y
// lejos de la línea de órdenes de abajo
const L = await proy([0, 0, 0]);
const V = { x0: Math.max(320, L.x - 130), y0: L.y - 70,
            x1: Math.max(400, L.x - 60), y1: L.y - 15 };
await pag.mouse.click(V.x0, V.y0); await espera(350);
await pag.mouse.move(V.x1, V.y1, { steps: 6 }); await espera(250);
await pag.mouse.click(V.x1, V.y1); await espera(500);
const s3 = await sel();
ok(s3.n === 0 && /ENTERO dentro/.test(s3.estado),
   "una ventana vacía dice POR QUÉ, en vez de callarse", s3.estado.slice(0, 70));
await nav.close(); srv?.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : `\nTodo correcto (${PUB ? "sitio público" : "local"})`);
process.exit(fallos.length ? 1 : 0);
