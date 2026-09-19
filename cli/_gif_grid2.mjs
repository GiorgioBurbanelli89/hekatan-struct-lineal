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
const out = join(__dirname, "shots", "gif_grid2_" + new Date().toISOString().slice(11,16).replace(":",""));
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
await new Promise((r) => srv.listen(4803, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 860 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
await pag.goto(`http://localhost:4803${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
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
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(4, 3, 3); c.position.set(22, -19, 14);
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
});
await esp(700);


const proj = (P) => pag.evaluate((P) => {
  const h = document.querySelector("#viewer"), c = h.__ctx;
  const r = h.querySelector("canvas").getBoundingClientRect();
  const V = Object.getPrototypeOf(c.camera.position).constructor;
  return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera);
    return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; });
}, P);
await nota("Grilla auxiliar, ejes auxiliares y como se QUITAN"); await mover(700, 520); await foto("inicio");

// 1) una grilla auxiliar a 3 m
let p = await senala("#hk-dist-plano", "");
await nota("1) escribe la cota: 3"); await mover(p.x, p.y + 44); await clic(p.x, p.y, "casilla");
await pag.keyboard.down("Control"); await pag.keyboard.press("KeyA"); await pag.keyboard.up("Control");
await pag.keyboard.type("3", { delay: 90 }); await pag.keyboard.press("Enter"); await esp(700); await foto("cota3");
p = await senala("#hk-ribbon button", "grilla auxiliar(?!.*Replicar)");
await nota("2) ▦+ deja la grilla puesta ahi"); await clic(p.x, p.y, "pone_grilla");
await senala(null); await esp(500); await foto("grilla_3");

// 2) replicar: tres MAS, sin mover la tuya
p = await senala("#hk-ribbon button", "Replicar la grilla auxiliar");
await nota("3) ▦× deja OTRAS tres, aparte (cada 3 m)"); await clic(p.x, p.y, "replica");
await senala(null); await esp(700); await foto("replicadas");
console.log("grillas:", JSON.stringify(await pag.evaluate(() => (window.__hekatanPlanosAux ?? []).map((g) => g.plano + " " + g.d))));

// 3) quitarlas TODAS
p = await senala("#hk-ribbon button", "Quitar TODAS");
await nota("4) ▦− las quita TODAS de una vez"); await clic(p.x, p.y, "quita_todas");
await senala(null); await esp(700); await foto("quitadas");
await nota("…y Ctrl+Z las devuelve si te arrepientes");
await pag.keyboard.down("Control"); await pag.keyboard.press("KeyZ"); await pag.keyboard.up("Control");
await esp(800); await foto("ctrlz_devuelve");
p = await senala("#hk-ribbon button", "Quitar TODAS"); await clic(p.x, p.y); await senala(null); await esp(400);

// 4) EJES CARTESIANOS AUXILIARES (origen local)
p = await senala("#hk-ribbon button", "Origen local");
await nota("5) ⌖ ejes auxiliares: toca un punto y ahi va el 0,0,0"); await clic(p.x, p.y, "boton_scu");
await senala(null);
const q = await proj([[6, 4, 0]]);
await nota("toca el punto (el osnap engancha)"); await clic(q[0].x, q[0].y, "pone_origen");
await esp(800); await foto("ejes_auxiliares");
for (let i = 0; i < 3; i++) { await esp(350); await foto("ejes_auxiliares"); }
await nota("ahora «0,0,0» es ESE punto; ⌖ otra vez vuelve al global");
await esp(600); await foto("ejes_nota");

// 5) la REJILLA (🏗) y como eliminarla
p = await senala("#hk-ribbon button", "Genera ejes");
await nota("6) 🏗 Rejilla: ejes, niveles y columnas de golpe"); await clic(p.x, p.y, "rejilla");
await senala(null); await esp(1500); await foto("rejilla_puesta");
await nota("7) ¿y si me equivoco? Ctrl+Z la elimina ENTERA");
await pag.keyboard.down("Control"); await pag.keyboard.press("KeyZ"); await pag.keyboard.up("Control");
await esp(1500); await foto("rejilla_deshecha");
const fin = await pag.evaluate(() => ({ nudos: (window.__hekatanDrawingPoints?.rawVal ?? []).length,
  ejes: (window.__hekatanAxisGrids ?? []).length, grillas: (window.__hekatanPlanosAux ?? []).length }));
await nota(`Listo: ${fin.nudos} nudos, ${fin.ejes} ejes, ${fin.grillas} grillas`);
for (let i = 0; i < 3; i++) await foto("final");
console.log("final:", JSON.stringify(fin), "· pageerror:", err.length, "· fotogramas:", n);
await pag.evaluate(() => window.__vn(""));
await nav.close(); srv.close();

const FF = "C:/Users/j-b-j/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const lista = fs.readdirSync(out).filter((f) => f.endsWith(".png")).sort();
fs.writeFileSync(`${out}/lista.txt`, lista.map((f) => `file '${f}'\nduration 0.42`).join("\n") + `\nfile '${lista.at(-1)}'\n`);
execFileSync(FF, ["-y", "-f", "concat", "-safe", "0", "-i", `${out}/lista.txt`,
  "-vf", "scale=1100:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer",
  `${out}/grid_donde.gif`], { stdio: "ignore" });
console.log("GIF:", `${out}/grid_donde.gif`, Math.round(fs.statSync(`${out}/grid_donde.gif`).size / 1024), "KB");
