// Se RESALTA algo al arrastrar? Se mira el rectangulo de seleccion mientras
// se arrastra, y el grupo de resaltado despues de soltar.
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { join, extname } from "path";
const BASE = "/hekatan-struct-lineal/";
const raiz = (process.env.USERPROFILE ?? "") + "/Documents/Hekatan Calc 1.0.0/hekatan-struct/website/src/examples";
const OUT = (process.env.USERPROFILE ?? "") + "/Documents/Hekatan Calc 1.0.0/hekatan-struct/cli/shots/realce";
mkdirSync(OUT, { recursive: true });
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml",
  ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4717, r));
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox","--disable-setuid-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1500, height: 1000 });
await pag.goto(`http://localhost:4717${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
await pag.keyboard.press("Escape");
const boton = async (t) => {
  const r = await pag.evaluate((x) => {
    const b = Array.from(document.querySelectorAll("#hk-ribbon button"))
      .find((e) => (e.textContent || "").includes(x));
    if (!b) return null; const q = b.getBoundingClientRect();
    return q.width ? { x: q.left + q.width/2, y: q.top + q.height/2 } : null; }, t);
  if (!r) return false;
  await pag.mouse.click(r.x, r.y); await new Promise(k => setTimeout(k, 450)); return true;
};
const cv = await pag.evaluate(() => { const c = document.querySelector("#viewer canvas");
  const r = c.getBoundingClientRect(); return { x:r.left, y:r.top, w:r.width, h:r.height }; });
// Portico
await boton("Planta"); await new Promise(r => setTimeout(r, 1400));
await boton("Línea");
for (const [dx,dy] of [[0.40,0.62],[0.40,0.40],[0.60,0.40],[0.60,0.62]]) {
  await pag.mouse.click(cv.x+cv.w*dx, cv.y+cv.h*dy); await new Promise(r=>setTimeout(r,450)); }
await pag.keyboard.press("Escape"); await new Promise(r=>setTimeout(r,700));
console.log("tras Escape:", JSON.stringify(await pag.evaluate(() => ({
  tool: window.__hekatanCadState?.get?.()?.tool ?? null,
  rectExplicit: window.__hekatanRectSelectExplicit ?? null,
  foco: document.activeElement?.id || document.activeElement?.tagName,
}))));

// Arrastrar y capturar A MITAD del arrastre
await pag.mouse.move(cv.x+cv.w*0.30, cv.y+cv.h*0.32);
await pag.mouse.down();
for (let i=1;i<=5;i++){ await pag.mouse.move(cv.x+cv.w*(0.30+0.42*i/5), cv.y+cv.h*(0.32+0.40*i/5));
  await new Promise(r=>setTimeout(r,110)); }
const rect = await pag.evaluate(() => {
  const d = document.querySelector("div[style*='position: fixed'][style*='border']");
  const cand = Array.from(document.querySelectorAll("div")).filter(e => {
    const s = getComputedStyle(e);
    return s.position === "fixed" && s.display !== "none" &&
           /22d3ee|34d399/i.test(s.borderColor + s.backgroundColor) && e.offsetWidth > 80;
  });
  return cand.map(e => ({ id: e.id || "(sin id)", w: e.offsetWidth, h: e.offsetHeight,
                          borde: getComputedStyle(e).border, fondo: getComputedStyle(e).backgroundColor }));
});
await pag.screenshot({ path: join(OUT, "durante_arrastre.png") });
await pag.mouse.up();
await new Promise(r=>setTimeout(r,700));
const tras = await pag.evaluate(() => {
  const s = window.__hekatanSelection;
  const ctx = document.querySelector("#viewer").__ctx;
  let resaltados = 0, nombres = [];
  ctx?.scene.traverse((o) => {
    if (/selection|highlight|sel-/i.test(o.name || "") && o.visible) { resaltados++; nombres.push(o.name); }
  });
  return { seleccion: s ? s.size : -1, resaltados, nombres: nombres.slice(0,5) };
});
await pag.screenshot({ path: join(OUT, "tras_soltar.png") });
console.log("rectangulo mientras arrastro:", JSON.stringify(rect));
console.log("tras soltar:", JSON.stringify(tras));
await nav.close(); srv.close();
