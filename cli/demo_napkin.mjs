/**
 * DEMOSTRACIÓN de lo que se trajo del cuaderno Napkin, en movimiento.
 *
 * Levanta un pórtico, lo sube con «x5», enciende los diagramas con A S D F y enseña el
 * destello dorado al poner los apoyos. Deja los fotogramas en `cli/shots/napkin/` para
 * mirarlos y montar el GIF.
 *
 *   node cli/demo_napkin.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync, rmSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "napkin");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4768;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(PUERTO, r));
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1180, height: 680 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const consola = [];
pag.on("console", (m) => consola.push(m.text()));
let k = 0;
const foto = async (n = 1) => {
  for (let i = 0; i < n; i++) {
    await pag.screenshot({ path: join(OUT, `f${String(k++).padStart(3, "0")}.png`) });
  }
};
await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);

// ⚠️ Se capturaba la ventana entera CON los paneles y no se leía nada: el de la
// izquierda (301 px), el de la derecha (321 px) y el ribbon (850×192, centrado
// arriba) dejaban el pórtico en un hilo. Y recortar al LIENZO tampoco sirve: los
// paneles FLOTAN encima, el lienzo mide toda la ventana. Se apagan los paneles y
// se deja solo la línea de órdenes, que es lo que hay que leer.
await pag.evaluate(() => {
  for (const id of ["hk-ribbon-guia", "hk-ribbon", "settings", "hk-pane-host"])
    document.getElementById(id)?.remove();
  const r = document.createElement("div");
  r.id = "hk-rotulo";
  r.style.cssText = "position:fixed;left:22px;top:18px;z-index:99999;color:#e6c463;" +
    "font:600 20px ui-monospace,Consolas,monospace;letter-spacing:.5px;" +
    "text-shadow:0 1px 3px #000;pointer-events:none";
  document.body.appendChild(r);
});
const rotulo = (t) => pag.evaluate((t) => { document.getElementById("hk-rotulo").textContent = t; }, t);

const cmd = async (t, tras = 420) => {
  await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (i) i.value = ""; });
  await pag.focus("#hk3-cmd-input");
  await pag.type("#hk3-cmd-input", t, { delay: 14 });
  await foto();
  await pag.keyboard.press("Enter");
  await espera(tras);
  await foto();
};
const desenfocar = () => pag.evaluate(() => document.activeElement && document.activeElement.blur());

// La cámara, encuadrada sobre lo DIBUJADO. El encuadre automático mira la REJILLA
// cuando el modelo es más chico que ella, y un pórtico de 5 × 3 lo es. Aquí se
// toma la caja de los puntos y se retira la cámara lo justo para que quepa:
//   d = r / sin(semiángulo)   con el semiángulo menor de los dos (vertical y horizontal)
const encuadrar = (margen = 1.15, subir = 0.06) => pag.evaluate(({ margen, subir }) => {
  const P = (window.__hekatanDrawingPoints?.val || []);
  if (!P.length) return null;
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (const p of P) for (let i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], p[i]); mx[i] = Math.max(mx[i], p[i]); }
  const c = mn.map((v, i) => (v + mx[i]) / 2);
  const r = Math.max(0.5, Math.hypot(...mn.map((v, i) => (mx[i] - v) / 2)));
  const v = document.querySelector("#viewer"), cam = v.__ctx.camera;
  const cv = v.querySelector("canvas"), asp = cv.clientWidth / cv.clientHeight;
  const fv = ((cam.fov ?? 45) * Math.PI) / 180 / 2;
  const fh = Math.atan(Math.tan(fv) * asp);
  const d = (r * margen) / Math.sin(Math.min(fv, fh));
  // el objetivo baja un pelo: la línea de órdenes se come la franja de abajo
  const t = [c[0], c[1], c[2] + r * subir];
  v.__ctx.controls.target.set(...t);
  cam.position.set(t[0] + d * 0.60, t[1] - d * 0.72, t[2] + d * 0.35);
  if (cam.isOrthographicCamera) { cam.zoom = 1; cam.updateProjectionMatrix(); }
  cam.up.set(0, 0, 1);
  cam.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
  return { r: +r.toFixed(2), d: +d.toFixed(2) };
}, { margen, subir });

// ── el pórtico: dos montantes y la viga ─────────────────────────────────────
await rotulo("1 · el portico, por la linea de ordenes");
const ESQ = [[0, 0], [5, 0]];
for (const [x, y] of ESQ) {
  await cmd("l"); await cmd(`${x},${y},0`, 260); await cmd(`${x},${y},3`, 340);
  await pag.keyboard.press("Escape"); await espera(250);
}
await cmd("l"); await cmd("0,0,3", 260); await cmd("5,0,3", 360);
await pag.keyboard.press("Escape"); await espera(300);
await encuadrar();
await espera(700); await foto(4);

// ── «x5»: el pórtico se convierte en un edificio ────────────────────────────
await rotulo("2 · designar TODO y replicar 3 m arriba");
await cmd("s");
await cmd("todo", 600);
await foto(2);
await cmd("rep"); await cmd("0,0,3"); await cmd("1", 900);
await encuadrar();
await espera(600); await foto(3);
// ⚠️ Sin volver a designar: la designación sigue siendo EL PÓRTICO. Si se vuelve
// a designar todo (ya son dos plantas) y el paso es de una, cada copia se solapa
// con la anterior — salían 36 barras donde hay 21.
await rotulo("3 · «x5»: repite ESA distancia cinco veces mas");
await cmd("x5", 1400);
await encuadrar(0.72);
await espera(800); await foto(8);
await pag.keyboard.press("Escape"); await espera(250);
await desenfocar();

// ── APOYOS y CARGAS: se ve el DESTELLO dorado al aplicarlos ─────────────────
// Es el MISMO evento que dispara el panel de propiedades y el botón «Apoyo» del
// ribbon (`aplicarASeleccion` en getCadRibbon.ts): así el destello se prueba por
// donde de verdad pasa, no por una puerta de atrás.
const marcar = (filtro) => pag.evaluate((f) => {
  const P = window.__hekatanDrawingPoints?.val || [];
  const ids = [];
  P.forEach((p, i) => { if (eval(f)) ids.push("pt:" + i); });
  return ids;
}, filtro);
const aplicar = (ids, prop, value) => pag.evaluate(({ ids, prop, value }) => {
  window.dispatchEvent(new CustomEvent("hk:property-applied",
    { detail: { kind: "nodes", ids, prop, value } }));
}, { ids, prop, value });

await rotulo("4 · apoyos en la base: lo aplicado PARPADEA en dorado");
await foto(2);
const base = await marcar("p[2] < 0.01");
await aplicar(base, "supports", [true, true, true, true, true, true]);
await espera(110); await foto(6);            // el parpadeo, mientras dura
await espera(700); await foto(2);

await rotulo("5 · viento: 12 kN por planta en la fachada izquierda");
const izq = await marcar("p[0] < 0.01 && p[2] > 0.01");
await aplicar(izq, "loads", [12, 0, -8, 0, 0, 0]);
await espera(110); await foto(6);
await pag.evaluate(() => window.__hekatanRebuild?.());
await espera(1800); await foto(3);

// ── A S D F: los diagramas a una tecla ──────────────────────────────────────
// El tamaño del diagrama es `0.05 · gridSize · displayScale` (frameResults.ts):
// con la rejilla de 20 m y la escala de fábrica el momento salía más ancho que el
// edificio. Se baja para que se lea la FORMA, que es de lo que va esto.
const escala = await pag.evaluate(() => {
  const s = window.__hekatanSettings?.();
  if (s?.displayScale) s.displayScale.val = 0.35;
  // y la deformada, a ojo: 5 cm de desplome en 21 m no se ve sin amplificar
  if (s?.deformScale) s.deformScale.val = 60;
  return s?.displayScale?.rawVal ?? null;
});
const NOM = { a: "6 · «A» axil", s: "7 · «S» cortante", d: "8 · «D» momento" };
for (const t of ["a", "s", "d"]) {
  await rotulo(NOM[t]);
  await pag.keyboard.press(t);
  await espera(900);
  await foto(6);
}
await rotulo("9 · «F» deformada");
await pag.keyboard.press("f"); await espera(900);
// «F» CONMUTA: si venía encendida, esa pulsación la apaga. Se mira y se corrige.
const defOn = await pag.evaluate(() => !!window.__hekatanSettings?.()?.deformedShape?.rawVal);
if (!defOn) { await pag.keyboard.press("f"); await espera(900); }
await foto(8);

const cotas = await pag.evaluate(() => [...new Set((window.__hekatanDrawingPoints?.val || [])
  .map((q) => +q[2].toFixed(2)))].sort((a, b) => a - b));
const solve = consola.filter((t) => /\[NewBlank\] (Solve OK|Solver)/.test(t)).slice(-1)[0] || "SIN resolver";
console.log("fotogramas:", k);
console.log("apoyos/cargas:", base.length, "/", izq.length, "nudos");
console.log("solver:", solve);
console.log("escala de diagrama:", escala, "· deformada encendida:", defOn ||
  (await pag.evaluate(() => !!window.__hekatanSettings?.()?.deformedShape?.rawVal)));
console.log("cotas del edificio:", cotas.join(", "));
await nav.close(); srv.close();
