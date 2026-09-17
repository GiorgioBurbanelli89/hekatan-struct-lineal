/**
 * SELECCIÓN COMO AUTOCAD: ventana (izq→der) vs captura (der→izq).
 *
 * Jorge (17-sep-2026): «cuando selecciono de derecha a izquierda debe ser como AutoCAD».
 * La regla de AutoCAD, que es la que hay que calcar:
 *   · IZQ→DER = Window   (azul, línea CONTINUA): solo lo que queda ENTERO dentro.
 *   · DER→IZQ = Crossing (verde, línea DISCONTINUA): todo lo que TOQUE el recuadro,
 *                         aunque solo lo cruce por el medio y sus dos extremos queden fuera.
 *
 * El caso que lo distingue —y que ninguna prueba cubría— es una barra que ATRAVIESA el
 * recuadro con los dos extremos fuera: Window NO la coge, Crossing SÍ.
 *
 *   node cli/_seleccion_crossing.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "crossing");
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
await new Promise((r) => srv.listen(4811, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 150)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:4811${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(500); }
}
// vista de planta y tres barras LARGAS paralelas: el recuadro cortará la del medio
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(0, 0, 0); c.position.set(0, 0, 60);
  c.up.set(0, 1, 0); c.lookAt(0, 0, 0); v.__ctx.controls.update?.(); v.__ctx.render?.();
  // barras de −10 a +10 en X, a distintas Y: dos largas y una corta dentro
  window.__hekatanDrawingPoints.val = [
    [-10, 4, 0], [10, 4, 0],     // 0-1 barra larga (cruza de lado a lado)
    [-1, 0, 0], [1, 0, 0],       // 2-3 barra corta, entera dentro del recuadro
    [-10, -4, 0], [10, -4, 0],   // 4-5 otra barra larga
  ];
  window.__hekatanDrawingPolylines.val = [[0, 1], [2, 3], [4, 5]];
  window.__hekatanRebuild?.();
});
await esp(1500);
const proy = (P) => pag.evaluate((W) => {
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const V = Object.getPrototypeOf(cam.position).constructor;
  const q = new V(W[0], W[1], W[2]).project(cam);
  return { x: (q.x * .5 + .5) * r.width + r.left, y: (-q.y * .5 + .5) * r.height + r.top };
}, P);
const selN = () => pag.evaluate(() => window.__hekatanSelection?.size ?? 0);
const limpiar = async () => { await pag.keyboard.press("Escape"); await esp(300);
  await pag.evaluate(() => { window.__hekatanSelection?.clear(); window.__hekatanRefreshSelection?.(); }); await esp(200); };
// ARRASTRANDO, como en AutoCAD (PICKAUTO=5). Antes habia que hacer clic-clic porque
// arrastrar orbitaba la camara; ahora el izquierdo es para seleccionar.
const ventana = async (desde, hasta) => {
  await limpiar();
  const a = await proy(desde), b = await proy(hasta);
  await pag.mouse.move(a.x, a.y, { steps: 3 }); await esp(200);
  await pag.mouse.down();
  await pag.mouse.move(b.x, b.y, { steps: 8 }); await esp(250);
  await pag.mouse.up(); await esp(700);
  return selN();
};
// y el reparto: cuantos son BARRAS y cuantos NUDOS (AutoCAD selecciona objetos; aqui
// los nudos son objetos tambien, asi que se cuentan aparte para no confundir el numero)
const detalle = () => pag.evaluate(() => {
  const s = [...(window.__hekatanSelection ?? [])];
  return { barras: s.filter((k) => k.startsWith("seg:")).length,
           nudos: s.filter((k) => k.startsWith("pt:")).length, total: s.length };
});
await pag.evaluate(() => window.__hekatanCadState?.setTool?.("select")); await esp(400);

// el recuadro va de (−3,−6) a (3,6): la barra corta queda DENTRO; las dos largas lo ATRAVIESAN
console.log("  modelo: 2 barras largas que atraviesan el recuadro + 1 corta dentro");
const nWin = await ventana([-3, -6, 0], [3, 6, 0]);        // izq → der
const dWin = await detalle();
console.log(`       Window  (izq→der): ${JSON.stringify(dWin)}`);
await pag.screenshot({ path: join(OUT, "01_window.png") });
const nCross = await ventana([3, 6, 0], [-3, -6, 0]);      // der → izq
const dCross = await detalle();
console.log(`       Crossing(der→izq): ${JSON.stringify(dCross)}`);
await pag.screenshot({ path: join(OUT, "02_crossing.png") });

ok(nWin > 0, "ARRASTRANDO con el izquierdo ya se selecciona (antes orbitaba)", `${nWin} objetos`);
ok(dWin.barras === 1, "Window (izq→der): SOLO la barra que queda entera dentro", `${dWin.barras} barra(s)`);
ok(dCross.barras === 3, "Crossing (der→izq): también las que lo ATRAVIESAN", `${dCross.barras} barra(s)`);
ok(dCross.barras > dWin.barras, "y crossing coge más que window", `${dWin.barras} → ${dCross.barras}`);
ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
