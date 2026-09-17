/**
 * GIF: cómo se ve la MATRIZ DE RIGIDEZ LOCAL de una barra y de un paño.
 *
 * Jorge, 17-sep-2026: «hazme un gif de cómo usar el botón para ver el análisis
 * de la matriz de rigidez local».
 *
 * El guion es el de un usuario, con el cursor pintado: se toca una barra → sale
 * el botón «📐 Ver K local» → se pulsa → la ventana con la 12×12. Y lo mismo con
 * un paño, donde salen DOS matrices (flexión y membrana).
 *
 *   node cli/_gif_k_local.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "shots", "gif_klocal_" + new Date().toISOString().slice(11, 16).replace(":", ""));
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
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
await new Promise((r) => srv.listen(4853, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));

const cursorPintado = () => pag.evaluate(() => {
  const c = document.createElement("div"); c.id = "vc";
  c.innerHTML = '<svg width="26" height="34" viewBox="0 0 26 34"><path id="vcf" d="M1 1 L1 27 L8 20 L13 32 L18 30 L13 18 L23 18 Z" fill="#fff" stroke="#000" stroke-width="1.6"/></svg>';
  c.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;";
  const a = document.createElement("div"); a.id = "va";
  a.style.cssText = "position:fixed;width:34px;height:34px;margin:-17px 0 0 -17px;border:3px solid #ff2d55;border-radius:50%;z-index:2147483646;pointer-events:none;display:none;";
  const r = document.createElement("div"); r.id = "vr";
  r.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);top:8px;z-index:2147483647;pointer-events:none;background:#0b0e14;color:#e6c463;border:1px solid #e6c463;border-radius:8px;padding:6px 16px;font:600 17px Segoe UI,system-ui;display:none;";
  document.body.append(c, a, r);
  window.__vc = (x, y, clic) => { c.style.left = x + "px"; c.style.top = y + "px";
    document.getElementById("vcf").setAttribute("fill", clic ? "#ff2d55" : "#fff");
    a.style.display = clic ? "block" : "none"; a.style.left = x + "px"; a.style.top = y + "px"; };
  window.__rot = (t) => { r.textContent = t || ""; r.style.display = t ? "block" : "none"; };
});
let cur = { x: 700, y: 500 }, n = 0;
const foto = async (t) => { await esp(90); await pag.screenshot({ path: `${out}/${String(n++).padStart(3, "0")}_${t}.png` }); };
const rotulo = (t) => pag.evaluate((q) => window.__rot(q), t);
const mover = async (x, y, k = 12) => {
  for (let i = 1; i <= k; i++) {
    const px = cur.x + (x - cur.x) * i / k, py = cur.y + (y - cur.y) * i / k;
    await pag.mouse.move(px, py);
    await pag.evaluate((q) => window.__vc(q.x, q.y, false), { x: px, y: py });
    if (i % 3 === 0) await foto("mv");
  }
  cur = { x, y };
};
const clic = async (x, y, t) => {
  await mover(x, y);
  await pag.evaluate((q) => window.__vc(q.x, q.y, true), { x, y });
  await foto("clic"); await pag.mouse.click(x, y); await esp(300); await foto(t);
  await pag.evaluate((q) => window.__vc(q.x, q.y, false), { x, y });
};
const cargar = async (id) => {
  await pag.goto(`http://localhost:4853${BASE}workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
  await esp(9000);
  await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
  await cursorPintado();
};
/** Punto de pantalla de un elemento, por su centro proyectado. */
const puntoElem = (idx) => pag.evaluate((i) => {
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const st = window.__hekatanStates;
  const el = st.elements.val[i], N = st.nodes.val;
  const c = [0, 1, 2].map((k) => el.reduce((s, m) => s + N[m][k], 0) / el.length);
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const V = Object.getPrototypeOf(cam.position).constructor;
  const q = new V(c[0], c[1], c[2]).project(cam);
  return { x: (q.x * .5 + .5) * r.width + r.left, y: (-q.y * .5 + .5) * r.height + r.top };
}, idx);
const chip = () => pag.evaluate(() => {
  const b = document.getElementById("hk-klocal-chip");
  if (!b || b.hidden) return null;
  const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});

// ── 1. una BARRA ──────────────────────────────────────────────────────────
await cargar("edificio-aporticado");
await rotulo("1 · Toca una BARRA"); await foto("ini");
const iB = await pag.evaluate(() => window.__hekatanStates.elements.val.findIndex((e) => e.length === 2));
const pB = await puntoElem(iB);
await clic(pB.x, pB.y, "barra_tocada");
for (let i = 0; i < 3; i++) await foto("espera");
await rotulo("2 · Sale el botón: púlsalo");
let c = await chip();
if (c) await clic(c.x, c.y, "abre_k_barra");
else console.log("no salió el botón tras tocar la barra");
await rotulo("3 · La K local 12×12 de esa barra");
for (let i = 0; i < 8; i++) await foto("k_barra");

// ── 2. un PAÑO ────────────────────────────────────────────────────────────
await cargar("plate-thin");
await rotulo("4 · Ahora un PAÑO de cáscara"); await foto("ini2");
const iP = await pag.evaluate(() => window.__hekatanStates.elements.val.findIndex((e) => e.length === 4));
const pP = await puntoElem(iP);
await clic(pP.x, pP.y, "pano_tocado");
for (let i = 0; i < 3; i++) await foto("espera2");
await rotulo("5 · El mismo botón");
c = await chip();
if (c) await clic(c.x, c.y, "abre_k_pano");
else console.log("no salió el botón tras tocar el paño");
await rotulo("6 · DOS matrices: flexión y membrana");
for (let i = 0; i < 10; i++) await foto("k_pano");

console.log("pageerror:", err.length, err.slice(0, 2), "· fotogramas:", n);
await nav.close(); srv.close();
const FF = "C:/Users/j-b-j/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const lista = fs.readdirSync(out).filter((f) => f.endsWith(".png")).sort();
const linea = (f) => "file " + String.fromCharCode(39) + f + String.fromCharCode(39);
fs.writeFileSync(`${out}/lista.txt`,
  lista.map((f) => linea(f) + "\nduration 0.28").join("\n") + "\n" + linea(lista.at(-1)) + "\n");
execFileSync(FF, ["-y", "-f", "concat", "-safe", "0", "-i", `${out}/lista.txt`,
  "-vf", "scale=1100:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer",
  `${out}/k_local.gif`], { stdio: "ignore" });
console.log("GIF:", `${out}/k_local.gif`, Math.round(fs.statSync(`${out}/k_local.gif`).size / 1024), "KB");
