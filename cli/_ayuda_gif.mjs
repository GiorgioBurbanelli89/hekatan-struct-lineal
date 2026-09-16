/**
 * GIF del BOTÓN DE AYUDA: se pulsa «?», se tocan tres botones distintos y se ve el
 * ejemplo animado de cada uno. Para que Jorge decida antes de publicar.
 *   node cli/_ayuda_gif.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// ⚠️ Carpeta NUEVA cada vez: si el GIF anterior está abierto en el visor de Fotos,
// Windows bloquea la carpeta y `rmSync` casca con EBUSY.
const out = join(__dirname, "shots", "ayuda_gif_" + new Date().toISOString().slice(11, 16).replace(":", ""));
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
await new Promise((r) => srv.listen(4775, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
await pag.goto(`http://localhost:4775${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
// cursor pintado en el DOM
await pag.evaluate(() => {
  const c = document.createElement("div"); c.id = "vc";
  c.innerHTML = '<svg width="26" height="34" viewBox="0 0 26 34"><path id="vcf" d="M1 1 L1 27 L8 20 L13 32 L18 30 L13 18 L23 18 Z" fill="#fff" stroke="#000" stroke-width="1.6"/></svg>';
  c.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;";
  const a = document.createElement("div"); a.id = "va";
  a.style.cssText = "position:fixed;width:34px;height:34px;margin:-17px 0 0 -17px;border:3px solid #ff2d55;border-radius:50%;z-index:2147483646;pointer-events:none;display:none;";
  document.body.append(c, a);
  window.__vc = (x, y, r) => { c.style.left = x + "px"; c.style.top = y + "px";
    document.getElementById("vcf").setAttribute("fill", r ? "#ff2d55" : "#fff");
    a.style.display = r ? "block" : "none"; a.style.left = x + "px"; a.style.top = y + "px"; };
});
let cur = { x: 700, y: 500 }, n = 0;
const foto = async (t) => { await esp(120); await pag.screenshot({ path: `${out}/${String(n++).padStart(3, "0")}_${t}.png` }); };
const mover = async (x, y, k = 10) => {
  for (let i = 1; i <= k; i++) { const px = cur.x + (x - cur.x) * i / k, py = cur.y + (y - cur.y) * i / k;
    await pag.mouse.move(px, py); await pag.evaluate((q) => window.__vc(q.x, q.y, false), { x: px, y: py }); await esp(16); }
  cur = { x, y };
};
const clic = async (x, y, t) => { await mover(x, y); await pag.evaluate((q) => window.__vc(q.x, q.y, true), { x, y });
  await pag.mouse.click(x, y); await esp(220); if (t) await foto(t); await pag.evaluate((q) => window.__vc(q.x, q.y, false), { x, y }); };
const centro = (sel, f) => pag.evaluate((sel, f) => {
  const b = [...document.querySelectorAll(sel)].find((e) => e.offsetParent !== null &&
    new RegExp(f).test((e.textContent || "") + " " + (e.title || "")));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel, f);

const bA = await centro("#hk-ribbon button", "ejemplo animado");
await foto("inicio");
await clic(bA.x, bA.y, "pulsa_ayuda");
await foto("pregunta");                                   // la barra pregunta
for (const [filtro, nombre] of [["Rect", "rect"], ["Columna", "columna"],
     ["paralela a si misma", "mover_grilla"], ["Replicar la grilla auxiliar", "replicar_grilla"],
     ["Origen local", "origen_local"], ["Apoyo", "apoyo"]]) {
  if (!await pag.evaluate(() => window.__hekatanAyudaModo === true)) { await clic(bA.x, bA.y); await esp(300); }
  const b = await centro("#hk-ribbon button", filtro);
  if (!b) { console.log("no está el botón", filtro); continue; }
  await clic(b.x, b.y, "toca_" + nombre);
  for (let i = 0; i < 9; i++) { await esp(330); await foto("anim_" + nombre); }   // el ejemplo corriendo
  await pag.keyboard.press("Escape"); await esp(400);
}
console.log("pageerror:", err.length, err.slice(0, 2), "· fotogramas:", n);
await nav.close(); srv.close();
const FF = "C:/Users/j-b-j/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const lista = fs.readdirSync(out).filter((f) => f.endsWith(".png")).sort();
fs.writeFileSync(`${out}/lista.txt`, lista.map((f) => `file '${f}'\nduration 0.33`).join("\n") + `\nfile '${lista.at(-1)}'\n`);
execFileSync(FF, ["-y", "-f", "concat", "-safe", "0", "-i", `${out}/lista.txt`,
  "-vf", "scale=1000:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer",
  `${out}/ayuda.gif`], { stdio: "ignore" });
console.log("GIF:", `${out}/ayuda.gif`, Math.round(fs.statSync(`${out}/ayuda.gif`).size / 1024), "KB");
