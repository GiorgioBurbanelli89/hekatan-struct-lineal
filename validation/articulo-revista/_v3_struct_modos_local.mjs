// B — Hekatan Struct: MODOS 1, 2 y 3 ANIMADOS, contra el BUNDLE LOCAL.
//
//   node _v3_struct_modos_local.mjs <carpeta_salida>
//
// Por qué local y no el sitio público: contra GitHub Pages, tras lanzar el modal la
// página deja de contestar a puppeteer (medido 25 y 40 min, bitácora 18-sep). El mismo
// chunk servido por un http.createServer propio —como hace cli/tutorial_struct.mjs—
// responde en ~5 min. Es el MISMO binario, no otro programa.
//
// Encuadre y resolución: los mismos del modo 1 ya aprobado — viewport 1920×1080 con
// deviceScaleFactor 2 y recorte del canvas ⇒ PNG de 3840×2160.
import puppeteer from "puppeteer";
import { mkdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2];
mkdirSync(`${OUT}/anim`, { recursive: true });
const dormir = ms => new Promise(s => setTimeout(s, ms));

// ── el servidor del bundle local (idéntico al de cli/tutorial_struct.mjs) ─────
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "..", "website", "src", "examples");
if (!existsSync(raiz)) { console.error("no hay bundle: npm run build:deploy"); process.exit(2); }
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
const PUERTO = Number(process.env.HK_PUERTO || 4781);
await new Promise(r => srv.listen(PUERTO, r));
const URL = `http://localhost:${PUERTO}/workspace/?t=test-m-dual`;
console.log("→ sirviendo", raiz, "en", URL);

const b = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=angle",
         "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
         "--enable-webgl", "--ignore-gpu-blocklist", "--window-size=1920,1080"],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
});
const p = await b.newPage();
p.on("pageerror", e => console.log("PAGEERROR " + e.message));

await p.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await dormir(25000);
console.log("modal:", await p.evaluate(() => {
  const f = window.__hekatanRunModalAnimate;
  if (typeof f === "function") { f(); return "global"; }
  const e = [...document.querySelectorAll("button")].find(e => (e.innerText || "").includes("Correr modal"));
  if (e) { e.click(); return "boton"; } return "NO";
}));

// esperar a que exista el select de «Modo» — señal de que el modal terminó.
// ⚠️ la regex exige «(T = 0.»: con /T\s*=/ engancha «Auto (SELFWEIGHT=1)».
const hayModo = () => p.evaluate(() =>
  [...document.querySelectorAll("select")].some(s => [...s.options].some(o => /\(T\s*=\s*0?\./.test(o.text))));
const t0 = Date.now();
let listo = false;
for (let i = 0; i < 90; i++) {           // hasta 15 min
  await dormir(10000);
  try { if (await hayModo()) { listo = true; break; } } catch (e) { console.log("sonda:", e.message); }
  if (i % 6 === 0) console.log(`   … ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
console.log(listo ? `✓ modal listo en ${((Date.now() - t0) / 1000).toFixed(0)} s` : "✗ el modal no terminó");
if (!listo) { await b.close(); srv.close(); process.exit(3); }

const ponModo = (i) => p.evaluate((i) => {
  const s = [...document.querySelectorAll("select")]
    .find(s => [...s.options].some(o => /\(T\s*=\s*0?\./.test(o.text)));
  if (!s) return "sin select";
  s.selectedIndex = i; s.value = s.options[i].value;
  s.dispatchEvent(new Event("input", { bubbles: true }));
  s.dispatchEvent(new Event("change", { bubbles: true }));
  return s.options[i].text;
}, i);

const clip = await p.evaluate(() => {
  const c = document.querySelector("canvas"); const r = c.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
});
console.log("clip:", JSON.stringify(clip));

const NF = Number(process.env.V3_FRAMES || 8);
const M0 = Number(process.env.V3_M0 || 0), M1 = Number(process.env.V3_M1 || 3);
const periodos = {};
for (let m = M0; m < M1; m++) {
  const txt = await ponModo(m);
  periodos[m + 1] = txt;
  console.log(`── modo ${m + 1}: ${txt}`);
  await dormir(5000);
  const t = Date.now();
  for (let f = 0; f < NF; f++)
    await p.screenshot({ path: `${OUT}/anim/struct_m${m + 1}_${String(f).padStart(3, "0")}.png`, clip });
  console.log(`   ${NF} frames en ${((Date.now() - t) / 1000).toFixed(1)} s`);
}
console.log("PERIODOS " + JSON.stringify(periodos));
await b.close(); srv.close();
console.log("FIN");
