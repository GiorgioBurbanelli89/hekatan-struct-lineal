#!/usr/bin/env node
/**
 * TEST: ¿sirven las gráficas del Vite de Hekatan Struct lineal para los vídeos?
 *
 *   node cli/frames_tutorial.mjs [ejemplo] [n_frames] [salida]
 *
 * Saca frames de 1280x720 —la medida del vídeo— de la APLICACIÓN ENTERA: el
 * ribbon, el Tweakpane y el visor 3D, que es lo que hay que enseñar en un
 * tutorial. No vale capturar solo el canvas: el que mira tiene que ver DÓNDE
 * está el botón que se toca.
 *
 * Y comprueba lo único que de verdad puede salir mal sin que se note: que los
 * frames sean DISTINTOS. Un visor que no re-renderiza da una secuencia idéntica
 * y el vídeo sale congelado pareciendo correcto.
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, readdirSync, unlinkSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EJEMPLO = process.argv[2] || "test-m-dual";
const N = parseInt(process.argv[3] || "24", 10);
const OUT = join(__dirname, "..", process.argv[4] || "frames_tutorial");
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (/\.png$/.test(f)) unlinkSync(join(OUT, f));

const BASE_PUB = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
if (!existsSync(raiz)) { console.error("no hay bundle: npm run build:deploy"); process.exit(2); }
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
               ".wasm": "application/wasm", ".json": "application/json",
               ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
const servidor = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE_PUB)) p = p.slice(BASE_PUB.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404 " + p); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => servidor.listen(4698, r));
const url = `http://localhost:4698${BASE_PUB}workspace/?t=${EJEMPLO}`;

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const consola = [];
// Chrome headless no da WebGL sin swiftshader: sin esto three.js se cae y el
// pane ni se arma.
const nav = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
         "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist",
         "--window-size=1280,720"],
});
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
pag.on("console", (m) => consola.push(`[${m.type()}] ${m.text()}`));
pag.on("pageerror", (e) => consola.push(`[pageerror] ${e.message}`));

console.log("abriendo", url);
await pag.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await espera(8000);

// ¿qué hay en pantalla? Un tutorial necesita que el PANE se vea.
const inv = await pag.evaluate(() => ({
  canvas: document.querySelectorAll("canvas").length,
  filasPane: document.querySelectorAll(".tp-lblv").length,
  botones: Array.from(document.querySelectorAll(".tp-btnv_b, button"))
             .map((b) => (b.textContent || "").trim()).filter(Boolean).slice(0, 24),
  carpetas: Array.from(document.querySelectorAll(".tp-fldv_t"))
             .map((b) => (b.textContent || "").trim()).filter(Boolean),
}));
console.log("canvas:", inv.canvas, "· filas de pane:", inv.filasPane);
console.log("carpetas del pane:", JSON.stringify(inv.carpetas));
console.log("botones:", JSON.stringify(inv.botones));

// Giro de camara: se mueve el raton sobre el visor, que es como gira de verdad.
const caja = await pag.evaluate(() => {
  const cs = Array.from(document.querySelectorAll("canvas"));
  const c = cs.sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
  if (!c) return null;
  const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
console.log("visor:", JSON.stringify(caja));

const cx = caja ? caja.x + caja.w / 2 : 640, cy = caja ? caja.y + caja.h / 2 : 360;
await pag.mouse.move(cx, cy);
await pag.mouse.down();
for (let i = 0; i < N; i++) {
  await pag.mouse.move(cx + (i + 1) * 7, cy + Math.sin(i / 5) * 4);
  await espera(120);
  await pag.screenshot({ path: join(OUT, `f${String(i).padStart(3, "0")}.png`) });
}
await pag.mouse.up();

writeFileSync(join(OUT, "_consola.txt"), consola.join("\n"), "utf8");
await nav.close();
servidor.close();

// ¿SE MUEVE? Frames iguales = video congelado que parece bueno.
const fs = readdirSync(OUT).filter((f) => /\.png$/.test(f)).sort();
let iguales = 0;
for (let i = 1; i < fs.length; i++) {
  const a = readFileSync(join(OUT, fs[i - 1])), b = readFileSync(join(OUT, fs[i]));
  if (a.length === b.length && a.equals(b)) iguales++;
}
console.log(`\n${fs.length} frames en ${OUT}`);
console.log(iguales === 0 ? "OK: todos los frames son distintos"
                          : `AVISO: ${iguales} pares de frames IDENTICOS`);
console.log("errores de consola:", consola.filter((c) => /pageerror|\[error\]/.test(c)).length);
