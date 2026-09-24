// ─────────────────────────────────────────────────────────────────────────────
//  _v6_fases_sap.mjs — Hekatan Struct dibujado en LAS MISMAS 7 FASES que SAP2000
// ─────────────────────────────────────────────────────────────────────────────
//
//   node _v6_fases_sap.mjs <carpeta_salida> [--modo N] [--pref NOMBRE]
//
// POR QUÉ 7 FASES Y NO «grabar mientras anima»:
// SAP2000 no interpola: precalcula N fotogramas y los repite en ping-pong. Con el
// valor por defecto del diálogo «Display Deformed Shape» (Animation Controls ▸
// Cyclic Increments = «3 (30 degrees)») el binario devuelve N = 7 —
// `cAnimate.GetNumberRequiredFrames`, SAP2000.exe v24 — y la amplitud del cuadro k
// es `cos((k−1)/(N−1)·π)` (`cAnimate.StartAnimationDefForGDI`). O sea las fases
// 0°, 30°, 60°, 90°, 120°, 150°, 180° → cos = 1, .866, .5, 0, −.5, −.866, −1.
//
// Aquí se le pide a `animateMode.ts` esas MISMAS 7 fases con `showStaticPhase`, así
// que cada PNG de Hekatan es comparable uno a uno con el PNG de SAP de la misma fase.
// Grabar contra la animación viva no sirve: la captura tarda más que un cuadro y las
// fases salen a capricho (así se grabaron los v3/v5, por eso no se les puede medir
// el periodo).
//
// Además imprime, en METROS, los números del modo (diagonal 3-D del modelo, |φ|máx,
// desplazamiento del centro de la cubierta) para poder comparar con SAP sin píxeles.
import puppeteer from "puppeteer";
import { mkdirSync, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || join(__dirname, "_v6");
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const MODO = Number(arg("--modo", "1")) - 1;          // 0-indexed
const PREF = arg("--pref", "hek");
mkdirSync(join(OUT, "fases"), { recursive: true });
const dormir = (ms) => new Promise((s) => setTimeout(s, ms));

// ── servidor del bundle local (igual que cli/tutorial_struct.mjs) ─────────────
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
const PUERTO = Number(process.env.HK_PUERTO || 4793);
await new Promise((r) => srv.listen(PUERTO, r));
const URL = `http://localhost:${PUERTO}/workspace/?t=test-m-dual`;
console.log("→", URL);

const b = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
    || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=angle",
    "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
    "--enable-webgl", "--ignore-gpu-blocklist", "--window-size=1920,1080"],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});
const p = await b.newPage();
p.on("pageerror", (e) => console.log("PAGEERROR " + e.message));
await p.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await dormir(25000);

console.log("modal:", await p.evaluate(() => {
  const f = window.__hekatanRunModalAnimate;
  if (typeof f === "function") { f(); return "global"; }
  const e = [...document.querySelectorAll("button")].find((e) => (e.innerText || "").includes("Correr modal"));
  if (e) { e.click(); return "boton"; } return "NO";
}));

const hayModo = () => p.evaluate(() => !!window.__hekatanModalResultados?.()?.frequencies?.length);
const t0 = Date.now();
let listo = false;
for (let i = 0; i < 90; i++) {
  await dormir(10000);
  try { if (await hayModo()) { listo = true; break; } } catch (e) { console.log("sonda:", e.message); }
  if (i % 6 === 0) console.log(`   … ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
if (!listo) { console.log("✗ el modal no terminó"); await b.close(); srv.close(); process.exit(3); }
console.log(`✓ modal listo en ${((Date.now() - t0) / 1000).toFixed(0)} s`);

// ── los NÚMEROS del modo, en metros, sin pasar por píxeles ────────────────────
const num = await p.evaluate((MODO) => {
  const R = window.__hekatanModalResultados();
  const nodes = window.__hekatanStates.nodes.rawVal ?? window.__hekatanStates.nodes.val;
  const phi = R.modeShapes[MODO];
  let xm = [Infinity, -Infinity], ym = [Infinity, -Infinity], zm = [Infinity, -Infinity];
  for (const n of nodes) {
    xm = [Math.min(xm[0], n[0]), Math.max(xm[1], n[0])];
    ym = [Math.min(ym[0], n[1]), Math.max(ym[1], n[1])];
    zm = [Math.min(zm[0], n[2]), Math.max(zm[1], n[2])];
  }
  const Lx = xm[1] - xm[0], Ly = ym[1] - ym[0], H = zm[1] - zm[0];
  const D = Math.sqrt(Lx * Lx + Ly * Ly + H * H);
  let max = 0;
  for (let i = 0; i < nodes.length; i++) {
    const d = Math.hypot(phi[i * 6] || 0, phi[i * 6 + 1] || 0, phi[i * 6 + 2] || 0);
    if (d > max) max = d;
  }
  // centro de la cubierta = media de φ sobre los nudos del nivel más alto.
  // ⚠️ con tolerancia: los nudos de la losa no están todos en z exacto (espesor,
  // offsets), y con `< 1e-6` caía UN solo nudo — que puede ser una esquina y llevar
  // torsión encima, no la traslación del piso.
  const tol = 0.02 * H;
  let sx = 0, sy = 0, sz = 0, n0 = 0;
  for (let i = 0; i < nodes.length; i++) {
    if (Math.abs(nodes[i][2] - zm[1]) < tol) {
      sx += phi[i * 6] || 0; sy += phi[i * 6 + 1] || 0; sz += phi[i * 6 + 2] || 0; n0++;
    }
  }
  return { nNodos: nodes.length, Lx, Ly, H, D, phiMax: max, nCubierta: n0,
    phiCub: [sx / n0, sy / n0, sz / n0], f: R.frequencies[MODO], T: 1 / R.frequencies[MODO] };
}, MODO);
// escala que aplica animateMode.ts: mScale = (D · pct/100) / |φ|máx
const pct = Number(process.env.HK_PCT || 0);   // solo informativo si se conoce
const info = {
  ...num,
  // amplitud del nudo que MÁS se mueve, y del centro de la cubierta, por 1 % de diagonal
  ampMax_por_1pct: num.D * 0.01,
  ampCubierta_por_1pct: num.D * 0.01 * Math.hypot(...num.phiCub) / num.phiMax,
  ampCubiertaHoriz_por_1pct: num.D * 0.01 * Math.hypot(num.phiCub[0], num.phiCub[1]) / num.phiMax,
};
console.log("NUM " + JSON.stringify(info, null, 1));
writeFileSync(join(OUT, `_${PREF}_modo${MODO + 1}_num.json`), JSON.stringify(info, null, 1));

// ── las 7 fases de SAP ───────────────────────────────────────────────────────
const N = 7;
const clip = await p.evaluate(() => {
  const c = document.querySelector("canvas"); const r = c.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
});
console.log("clip:", JSON.stringify(clip));
for (let k = 0; k < N; k++) {
  const fase = Math.cos((k / (N - 1)) * Math.PI);
  // ⚠️ Se pide DOS veces con un respiro en medio, y se comprueba la amplitud que el
  // animador dejó publicada (`__modoAnim.amp`). Con una sola llamada + 1.2 s salían
  // `f0` y `f1` IDÉNTICOS: el visor es reactivo (van.derive) y la primera escritura
  // de `mesh.nodes` todavía no había llegado al canvas cuando disparó la captura, así
  // que cada PNG llevaba la fase ANTERIOR. Un vídeo así no es comparable con SAP.
  const ok = await p.evaluate(async (m, f) => {
    const a = window.__hekatanModalAnimator;
    if (!a?.showStaticPhase) return "sin animador";
    a.showStaticPhase(m, f);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    a.showStaticPhase(m, f);
    const v = document.querySelector("#viewer");
    const s = v?.__settings ?? v?.__ctx?.settings;
    return `amp ${(s?.__modoAnim?.amp ?? NaN).toFixed(5)}`;
  }, MODO, fase);
  await dormir(2500);
  await p.screenshot({ path: join(OUT, "fases", `${PREF}_m${MODO + 1}_f${k}.png`), clip });
  console.log(`  fase ${k}  cos=${fase.toFixed(4)}  ${ok}`);
}
await p.evaluate(() => { try { window.__hekatanModalStop?.(); } catch {} });
await b.close(); srv.close();
console.log("FIN");
