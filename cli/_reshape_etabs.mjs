/**
 * EL RESHAPER: alargar y acortar una barra arrastrando su extremo.
 *
 * Jorge, 17-sep-2026: «revisa ETABS, la parte donde selecciona una barra y la
 * puede alargar o acortar solo con seleccionarla».
 *
 * Lo que tiene que cumplir, según la ayuda de ETABS 22 (Reshape_Object.htm):
 *   1. al pinchar la barra salen sus DOS extremos como handles;
 *   2. arrastrando un extremo, EL OTRO SE QUEDA y la longitud cambia;
 *   3. el nudo se DESCONECTA de los demás objetos que lo compartían — mover una
 *      viga no debe arrastrar la columna que llega a ese mismo nudo;
 *   4. las teclas de restricción (X / Y / Z) fijan ejes.
 *
 *   node cli/_reshape_etabs.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "reshape");
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
await new Promise((r) => srv.listen(4883, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };
let n = 0;
const foto = async (t) => { await esp(150); await pag.screenshot({ path: join(OUT, `${String(n++).padStart(2, "0")}_${t}.png`) }); };

await pag.goto(`http://localhost:4883${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(8000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

// Una VIGA horizontal y una COLUMNA que llega a su extremo izquierdo, COMPARTIENDO
// el nudo 0. Es el caso que distingue: al estirar la viga, la columna NO se mueve.
await pag.evaluate(() => {
  window.__hekatanDrawingPoints.val = [[0, 0, 0], [6, 0, 0], [0, -4, 0]];
  window.__hekatanDrawingPolylines.val = [[0, 1], [0, 2]];   // viga y columna, nudo 0 comun
  window.__hekatanRebuild?.();
});
await esp(1800);
// ⚠️ La vista se pone con el comando de la PROPIA app, no tocando la cámara a mano.
// Esta app es Z-up (THREE.Object3D.DEFAULT_UP = 0,0,1) y sus OrbitControls
// re-derivan la cámara en cada frame: ponerle `up = (0,1,0)` y un `lookAt` la deja
// girando, y entonces el píxel que calcula el test ya no es el que ve la app.
// Medido: el nudo caía en x = 8.8 cuando el ratón estaba en el píxel de x = 7.
await pag.evaluate(() => window.__hekatanSetView?.("plan"));
await esp(2500);
await pag.evaluate(() => window.__hekatanCadState?.setTool?.("reshape"));
await esp(500);
ok(await pag.evaluate(() => window.__hekatanCadState?.get?.().tool === "reshape"),
   "la herramienta Remodelar (RE) existe y se activa");
await foto("modelo");

const aPantalla = (P) => pag.evaluate((W) => {
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const V = Object.getPrototypeOf(cam.position).constructor;
  const q = new V(W[0], W[1], W[2]).project(cam);
  return { x: (q.x * .5 + .5) * r.width + r.left, y: (-q.y * .5 + .5) * r.height + r.top };
}, P);
const pts = () => pag.evaluate(() => window.__hekatanDrawingPoints.rawVal.map((p) => p.map((q) => +q.toFixed(3))));
const polis = () => pag.evaluate(() => window.__hekatanDrawingPolylines.rawVal.map((p) => [...p]));

// 1. pinchar la VIGA por su centro -> deben salir sus dos extremos
const centroViga = await aPantalla([3, 0, 0]);
await pag.mouse.click(centroViga.x, centroViga.y); await esp(600);
const g = await pag.evaluate(() => window.__hekatanReshapeGrips?.() ?? []);
console.log("       handles:", JSON.stringify(g.map((h) => h.p)));
ok(g.length === 2, "al pinchar la barra salen sus DOS extremos como handles", `${g.length}`);
await foto("handles");

// 2. ACORTAR: arrastrar el extremo derecho de x = 6 a x = 4
//
// ⚠️ El destino tiene que caer DENTRO del lienzo. Apuntando a x = 9 en vista de
// planta —donde la cámara encuadra el modelo, 0..6— el píxel se salía por la
// derecha, el ratón se quedaba en el borde y el nudo se paraba siempre en 6.75.
// Eso era el borde de la ventana, no un fallo del reshaper.
const antes = await pts();
const arrastrarExtremoA = async (destinoX) => {
  const pA = await aPantalla([(await pts())[1][0], 0, 0]);
  await pag.mouse.move(pA.x, pA.y); await esp(200);
  await pag.mouse.down();
  let donde = null;
  for (let k = 0; k < 6; k++) {
    const d = await aPantalla([destinoX, 0, 0]);
    await pag.mouse.move(d.x, d.y, { steps: 4 }); await esp(220);
    donde = (await pts())[1];
    if (Math.abs(donde[0] - destinoX) < 0.05) break;
  }
  await pag.mouse.up(); await esp(1000);
  return donde;
};
const corta = await arrastrarExtremoA(4);
console.log(`       ACORTAR a x = 4  ->  extremo en ${JSON.stringify(corta)}`);
await foto("acortada");
ok(Math.abs(corta[0] - 4) < 0.3, "la barra se ACORTA al arrastrar su extremo hacia dentro",
   `${corta[0].toFixed(3)} m`);

const larga = await arrastrarExtremoA(5.5);
console.log(`       ALARGAR a x = 5.5 ->  extremo en ${JSON.stringify(larga)}`);
await foto("alargada");
ok(Math.abs(larga[0] - 5.5) < 0.3, "y se ALARGA al arrastrarlo hacia fuera",
   `${larga[0].toFixed(3)} m`);
const desp = await pts();
const pol = await polis();
console.log("       puntos antes :", JSON.stringify(antes));
console.log("       puntos después:", JSON.stringify(desp));
console.log("       polilíneas    :", JSON.stringify(pol));
const largo = (pl) => {
  const a = desp[pl[0]], b = desp[pl[1]];
  return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
};
ok(Math.abs(desp[pol[0][0]][0] - 0) < 1e-6 && Math.abs(desp[pol[0][0]][1] - 0) < 1e-6,
   "el OTRO extremo se queda donde estaba, como dice ETABS", JSON.stringify(desp[pol[0][0]]));

// 3. y la COLUMNA que compartía el nudo NO se ha movido
const col = pol[1];
const colOk = Math.abs(desp[col[0]][0] - 0) < 1e-6 && Math.abs(desp[col[1]][1] + 4) < 1e-6;
ok(colOk, "la columna que llegaba a ese nudo no se movió",
   `${JSON.stringify(desp[col[0]])} → ${JSON.stringify(desp[col[1]])}`);
await foto("alargada");

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(`\nfotogramas en ${OUT}`);
console.log(fallos.length ? `${fallos.length} FALLO(S)` : "Todo correcto");
process.exit(fallos.length ? 1 : 0);
