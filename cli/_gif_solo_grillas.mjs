/**
 * ¿DÓNDE HAY QUE IR CON EL CURSOR PARA COLOCAR Y REPLICAR LA GRILLA?
 *
 * Jorge (16-sep-2026): «necesito ver dónde debo ir con el cursor para hacer la
 * réplica de grid». Así que el GIF SEÑALA cada control con un recuadro rojo antes
 * de tocarlo, y dice qué hace:
 *
 *   casilla (valor exacto) · slider (a ojo) · ↕ (arrastrar con el cursor) · ▦+ (dejarla)
 *   y al final tres grillas puestas a 3, 6 y 9 m.
 *
 *   node cli/_gif_grid_donde.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "shots", "gif_solo_grillas_" + new Date().toISOString().slice(11,16).replace(":",""));
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
await new Promise((r) => srv.listen(4805, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 860 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
await pag.goto(`http://localhost:4805${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
// cursor, cartel y RECUADRO que señala el control
await pag.evaluate(() => {
  const c = document.createElement("div"); c.id = "vc";
  c.innerHTML = '<svg width="26" height="34" viewBox="0 0 26 34"><path id="vcf" d="M1 1 L1 27 L8 20 L13 32 L18 30 L13 18 L23 18 Z" fill="#fff" stroke="#000" stroke-width="1.6"/></svg>';
  c.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;";
  const a = document.createElement("div"); a.id = "va";
  a.style.cssText = "position:fixed;width:34px;height:34px;margin:-17px 0 0 -17px;border:3px solid #ff2d55;border-radius:50%;z-index:2147483646;pointer-events:none;display:none;";
  const marco = document.createElement("div"); marco.id = "vm";
  marco.style.cssText = "position:fixed;z-index:2147483645;pointer-events:none;display:none;" +
    "border:3px solid #ff2d55;border-radius:8px;box-shadow:0 0 0 3px rgba(255,45,85,.25)";
  const n = document.createElement("div"); n.id = "vn";
  n.style.cssText = "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2147483647;pointer-events:none;" +
    "background:rgba(15,23,42,.96);color:#facc15;border:2px solid #facc15;border-radius:9px;padding:9px 20px;font:600 20px system-ui;";
  document.body.append(c, a, marco, n);
  window.__vc = (x, y, r) => { c.style.left = x + "px"; c.style.top = y + "px";
    document.getElementById("vcf").setAttribute("fill", r ? "#ff2d55" : "#fff");
    a.style.display = r ? "block" : "none"; a.style.left = x + "px"; a.style.top = y + "px"; };
  window.__vn = (t) => { const e = document.getElementById("vn"); e.textContent = t; e.style.display = t ? "block" : "none"; };
  window.__vm = (sel, filtro) => {
    const e = document.getElementById("vm");
    if (!sel) { e.style.display = "none"; return null; }
    const cand = [...document.querySelectorAll(sel)].filter((q) => q.offsetParent !== null &&
      (!filtro || new RegExp(filtro).test((q.textContent || "") + " " + (q.title || ""))));
    const b = cand.find((q) => { const r = q.getBoundingClientRect();
      return r.width > 0 && r.left + r.width / 2 <= window.innerWidth && r.top + r.height / 2 <= window.innerHeight; });
    if (!b) return null;
    const r = b.getBoundingClientRect();
    e.style.left = (r.left - 5) + "px"; e.style.top = (r.top - 5) + "px";
    e.style.width = (r.width + 4) + "px"; e.style.height = (r.height + 4) + "px";
    e.style.display = "block";
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
});
let cur = { x: 700, y: 520 }, n = 0;
const foto = async (t) => { await esp(120); await pag.screenshot({ path: `${out}/${String(n++).padStart(3, "0")}_${t}.png` }); };
const nota = (t) => pag.evaluate((t) => window.__vn(t), t);
const senala = (sel, filtro) => pag.evaluate(([s, f]) => window.__vm(s, f), [sel, filtro]);
const mover = async (x, y, k = 12) => {
  for (let i = 1; i <= k; i++) { const px = cur.x + (x - cur.x) * i / k, py = cur.y + (y - cur.y) * i / k;
    await pag.mouse.move(px, py); await pag.evaluate((q) => window.__vc(q.x, q.y, false), { x: px, y: py }); await esp(16); }
  cur = { x, y };
};
const clic = async (x, y, t) => { await mover(x, y); await pag.evaluate((q) => window.__vc(q.x, q.y, true), { x, y });
  await pag.mouse.click(x, y); await esp(200); if (t) await foto(t); await pag.evaluate((q) => window.__vc(q.x, q.y, false), { x, y }); };

// cámara iso: en planta pura el eje Z apunta a la cámara y no se puede arrastrar
// ⚠️ La cámara MANDA en un GIF de grillas: con la vista alta y lejana los planos se
// ven de canto y no se distingue nada (la primera toma salió inservible). Iso baja y
// cerca, mirando a media altura, que es donde van a quedar las grillas.
const camara = async () => pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  // Mirando DESDE ARRIBA en ángulo: con la cámara a la altura de los planos estos se
  // ven de canto (una raya) y el GIF no enseña nada — pasó dos veces. La altura de la
  // cámara tiene que estar MUY por encima de la grilla más alta.
  // Rejilla de 14 m (la de 30 llena la pantalla de líneas) y cámara lejos y alta: las
  // grillas tienen que verse como PLANOS separados, no como una maraña.
  try { const st = window.__hekatanSettings?.(); if (st?.gridSize) st.gridSize.val = 14; } catch {}
  // ⚠️ Fuera los PLANOS DE REFERENCIA ortogonales (XY/XZ/YZ del último punto): son dos
  // planos VERTICALES enormes que en la toma parecen grillas y tapan las de verdad.
  window.__hekatanShowOrthoPlanes = false;
  try { window.__hekatanOcultarRef?.(); } catch {}
  v.__ctx.controls.target.set(0, 0, 6); c.position.set(30, -26, 26);
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
});
await camara();
await esp(700);


const proj = (P) => pag.evaluate((P) => {
  const h = document.querySelector("#viewer"), c = h.__ctx;
  const r = h.querySelector("canvas").getBoundingClientRect();
  const V = Object.getPrototypeOf(c.camera.position).constructor;
  return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera);
    return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; });
}, P);

// ⚠️ SOLO GRILLAS AUXILIARES. Nada de 🏗 Rejilla: son cosas distintas y mezclarlas en
// el mismo GIF confunde (Jorge, 16-sep: «la grilla auxiliar es muy aparte de rejilla,
// ojo con eso»). La grilla auxiliar es un PLANO PARA DIBUJAR y no toca el modelo.
await nota("GRILLA AUXILIAR: un plano para dibujar a la altura que quieras");
await mover(700, 520); await foto("inicio");
await esp(400); await foto("inicio");

// 1) la casilla: la cota exacta
let p = await senala("#hk-dist-plano", "");
await nota("1) la casilla: escribe la cota  ->  3");
await mover(p.x, p.y + 44); await clic(p.x, p.y, "casilla");
await pag.keyboard.down("Control"); await pag.keyboard.press("KeyA"); await pag.keyboard.up("Control");
await pag.keyboard.type("3", { delay: 100 }); await pag.keyboard.press("Enter");
await esp(700); await foto("cota_3");

// 2) ▦+ la deja puesta
p = await senala("#hk-ribbon button", "grilla auxiliar(?!.*Replicar)");
await nota("2) ▦+  deja la grilla puesta a 3.00 m");
await clic(p.x, p.y, "pone_grilla"); await senala(null);
await camara(); await esp(500); await foto("grilla_3"); await esp(400); await foto("grilla_3b");

// 3) el slider: buscarla a ojo
p = await senala("#hk-dist-slider", "");
await nota("3) el slider: la mueve EN VIVO, para buscarla a ojo");
await mover(p.x, p.y + 44); await mover(p.x, p.y);
await pag.mouse.down();
for (const dx of [8, 16, 24, 32]) { await pag.mouse.move(p.x + dx, p.y); await esp(200); await foto("slider"); }
await pag.mouse.up(); await senala(null); await esp(400);

// 4) ↕ con el cursor y la distancia tecleada
p = await senala("#hk-ribbon button", "paralela a si misma");
await nota("4) ↕  la coges con el CURSOR y la mueves paralela");
await clic(p.x, p.y, "boton_mover"); await senala(null);
for (const y of [520, 470, 420, 380]) { await mover(780, y, 6); await foto("arrastrando"); }
await nota("teclea la distancia exacta: 4.5 + Enter");
await pag.keyboard.press("Digit4"); await esp(200);
await pag.keyboard.press("Period"); await esp(150);
await pag.keyboard.press("Digit5"); await esp(250); await foto("tecleando");
await pag.keyboard.press("Enter"); await camara(); await esp(700); await foto("colocada_45");

// 5) ▦× replicar: OTRAS grillas, aparte
p = await senala("#hk-ribbon button", "Replicar la grilla auxiliar");
await nota("5) ▦×  deja OTRAS grillas aparte (cada 3 m), sin mover la tuya");
await clic(p.x, p.y, "replicar"); await senala(null);
await camara(); await esp(800); await foto("replicadas"); await esp(400); await foto("replicadas2");
const puestas = await pag.evaluate(() => (window.__hekatanPlanosAux ?? []).map((g) => g.plano + " " + g.d));
console.log("grillas puestas:", JSON.stringify(puestas));

// 6) ▦− quitarlas todas, y Ctrl+Z las devuelve
p = await senala("#hk-ribbon button", "Quitar TODAS");
await nota("6) ▦−  las quita TODAS de una vez");
await clic(p.x, p.y, "quitar"); await senala(null);
await camara(); await esp(700); await foto("quitadas");
await nota("y Ctrl+Z las devuelve si te arrepientes");
await pag.keyboard.down("Control"); await pag.keyboard.press("KeyZ"); await pag.keyboard.up("Control");
await camara(); await esp(900); await foto("ctrlz");
const vuelven = await pag.evaluate(() => (window.__hekatanPlanosAux ?? []).length);
await nota(`Las grillas auxiliares NO tocan el modelo: son para dibujar`);
for (let i = 0; i < 3; i++) await foto("final");
console.log("tras Ctrl+Z vuelven:", vuelven, "· pageerror:", err.length, "· fotogramas:", n);
await pag.evaluate(() => window.__vn(""));
await nav.close(); srv.close();

const FF = "C:/Users/j-b-j/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const lista = fs.readdirSync(out).filter((f) => f.endsWith(".png")).sort();
fs.writeFileSync(`${out}/lista.txt`, lista.map((f) => `file '${f}'\nduration 0.42`).join("\n") + `\nfile '${lista.at(-1)}'\n`);
execFileSync(FF, ["-y", "-f", "concat", "-safe", "0", "-i", `${out}/lista.txt`,
  "-vf", "scale=1100:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer",
  `${out}/grid_donde.gif`], { stdio: "ignore" });
console.log("GIF:", `${out}/grid_donde.gif`, Math.round(fs.statSync(`${out}/grid_donde.gif`).size / 1024), "KB");
