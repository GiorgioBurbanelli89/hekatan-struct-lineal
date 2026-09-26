#!/usr/bin/env node
/**
 * El ribbon CAD (`?ribbon=1`), probado como lo usaria alguien: TECLAS de una
 * letra como en AutoCAD y clics reales sobre el lienzo. Deja PNG por paso y
 * el GIF.
 *
 *   node cli/bench.mjs
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, rmSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
import { execFileSync } from "child_process";

const __dirname = "C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-struct/cli";
const OUT = join(__dirname, "shots_bench");
const FR = join(OUT, "bench");
rmSync(FR, { recursive: true, force: true });
mkdirSync(FR, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
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
await new Promise((r) => srv.listen(4709, r));
const MODO = process.env.GL || "swift";   // swift | gpu
const args = ["--no-sandbox","--window-size=1500,1000"];
if (MODO === "swift") args.push("--enable-unsafe-swiftshader","--use-angle=swiftshader");
else args.push("--use-angle=d3d11","--enable-gpu-rasterization","--ignore-gpu-blocklist");
const nav = await puppeteer.launch({ headless: "new", args });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };

// instrumenta la pagina: latencia evento->fotograma, intervalos de fotograma, tareas largas
const INSTR = () => {
  window.__b = { lat: [], fr: [], lt: [], on: false };
  try { new PerformanceObserver((l) => { if (window.__b.on) l.getEntries().forEach((e) => window.__b.lt.push(e.duration)); }).observe({ entryTypes: ["longtask"] }); } catch {}
  let last = 0;
  const tick = (t) => { if (window.__b.on) { if (last) window.__b.fr.push(t - last); } last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  addEventListener("mousemove", (e) => { if (!window.__b.on) return; const ts = e.timeStamp;
    requestAnimationFrame(() => requestAnimationFrame(() => window.__b.lat.push(performance.now() - ts))); }, true);
};
async function medirMovimiento(pag, x0, y0, x1, y1, n = 300, pausa = 8) {
  await pag.evaluate(() => { const b = window.__b; b.lat = []; b.fr = []; b.lt = []; b.on = true; });
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    await pag.mouse.move(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + 60 * Math.sin(t * 12));
    await wait(pausa);
  }
  await wait(150);
  const r = await pag.evaluate(() => { window.__b.on = false; return { lat: window.__b.lat, fr: window.__b.fr, lt: window.__b.lt }; });
  const fps = r.fr.length ? 1000 / (r.fr.reduce((s, v) => s + v, 0) / r.fr.length) : 0;
  return { fps: +fps.toFixed(1), lat_med: +pct(r.lat, .5).toFixed(1), lat_p95: +pct(r.lat, .95).toFixed(1), lat_max: +Math.max(0, ...r.lat).toFixed(1),
           frame_p95: +pct(r.fr, .95).toFixed(1), tareas_largas: r.lt.length, tarea_max: +Math.max(0, ...r.lt).toFixed(0) };
}

const out = {};
// ═════════════ A) HEKATAN STRUCT ═════════════
{
  const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 1000 });
  const errores = []; pag.on("pageerror", (e) => errores.push(e.message));
  await pag.goto(`http://localhost:4709${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 });
  await wait(8000);
  await pag.keyboard.press("Escape"); await wait(400);
  await pag.evaluate(INSTR);
  const gl = await pag.evaluate(() => { const c = document.createElement("canvas"); const g = c.getContext("webgl"); const e = g && g.getExtension("WEBGL_debug_renderer_info"); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : "?"; });
  // vista Planta
  await pag.evaluate(() => { const b = Array.from(document.querySelectorAll("#hk-ribbon button")).find((x) => /Planta/.test(x.textContent || "")); b && b.click(); });
  await pag.evaluate(() => window.__hekatanSetView && window.__hekatanSetView("plan")); await wait(1200);
  const idle = await medirMovimiento(pag, 600, 500, 601, 500, 1, 1500);   // casi quieto: fps en reposo
  // herramienta linea y primer clic
  await pag.keyboard.type("l ", { delay: 40 }); await wait(300);
  const mod = () => pag.evaluate(() => { const g = (k) => { const v = window[k]; return v && v.val ? v.val : []; };
    return { n: g("__hekatanDrawingPoints").length, t: g("__hekatanDrawingPolylines").reduce((s, p) => s + Math.max(0, p.length - 1), 0),
             pts: g("__hekatanDrawingPoints").map((p) => Array.from(p).map((v) => +(+v).toFixed(3))) }; });
  // Puntos DESEADOS en el mundo; el clic se da a unos pixeles de distancia (mano imprecisa).
  const META = [[0,0],[0,4],[6,4],[6,0]], RUIDO = [[5,-4],[-6,5],[4,6],[-5,-5]];
  const aPantalla = (w) => pag.evaluate((w) => { const c = window.__hekatanViewerCtx().camera, el = window.__hekatanViewerElm();
    const r = el.getBoundingClientRect(); const v = { x: w[0], y: w[1], z: 0 };
    const V = c.position.constructor; const q = new V(w[0], w[1], 0).project(c);
    return [r.left + (q.x * .5 + .5) * r.width, r.top + (-q.y * .5 + .5) * r.height]; }, w);
  const tiempos = []; let clics = 0;
  for (let i = 0; i < META.length; i++) {
    const [px, py] = await aPantalla(META[i]); const x = px + RUIDO[i][0], y = py + RUIDO[i][1];
    console.error('click',i,[px|0,py|0],await pag.evaluate(()=>{const c=window.__hekatanViewerCtx().camera;return [c.type,c.position.toArray().map(v=>+v.toFixed(1)),c.zoom]}));
    const a = await mod(); const ts = Date.now();
    await pag.mouse.move(x, y, { steps: 6 }); await wait(60);
    await pag.mouse.click(x, y); clics++;
    let dt = -1; for (let k = 0; k < 200; k++) { const b = await mod(); if (b.n > a.n) { dt = Date.now() - ts - 60; break; } await wait(5); }
    tiempos.push(dt); await wait(400);
  }
  await pag.keyboard.press("Enter"); await wait(500);
  const fin = await mod();
  const mov = await medirMovimiento(pag, 300, 400, 1100, 800);   // con la herramienta lista, mover el raton
  await pag.screenshot({ path: join(FR, `struct_${MODO}.png`) });
  out.struct = { modo: MODO, gpu: gl, reposo: idle, clics, ms_por_clic: tiempos, tramos: fin.t, nudos: fin.n, puntos: fin.pts, movimiento: mov, errores: errores.length };
  await pag.close();
}
// ═════════════ B) LISP (LispCad.js) ═════════════
{
  const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 1000 });
  const errores = []; pag.on("pageerror", (e) => errores.push(e.message));
  const js = readFileSync("C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-lisp/LispCad.js", "utf8");
  await pag.setContent(`<!doctype html><html><body style="margin:0;background:#fff"><script type="application/json" id="t-cad">${JSON.stringify({ nombre: "prueba", ud: "m", ents: [], capas: [{ n: "0", c: 7 }], rejilla: 1 })}</script></body></html>`);
  await pag.addScriptTag({ content: js });
  await pag.evaluate(INSTR);
  await pag.evaluate(() => window.hkCad.abrir("t")); await wait(800);
  const box = await pag.evaluate(() => { const r = document.querySelector(".hkcad canvas").getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  const idle = await medirMovimiento(pag, 600, 500, 601, 500, 1, 1500);
  await pag.keyboard.type("l ", { delay: 40 }); await wait(300);   // clic en el lienzo primero para foco: la orden va al input
  const ents = () => pag.evaluate(() => window.hkCad.estado().ents.length);
  // los mismos 4 puntos, en el mismo sitio de la pantalla relativo al lienzo
  const [bx, by, bw, bh] = box;
  const P = [[.25,.75],[.25,.25],[.75,.25],[.75,.75]].map(([u, v]) => [bx + bw * u, by + bh * v]);
  const tiempos = []; let clics = 0;
  await pag.evaluate(() => document.querySelector(".hkcad-inp").focus());
  await pag.keyboard.type("l", { delay: 30 }); await pag.keyboard.press("Enter"); await wait(200);
  for (const [x, y] of P) {
    const ts = Date.now();
    await pag.mouse.move(x, y, { steps: 6 }); await wait(60);
    await pag.mouse.click(x, y); clics++;
    await wait(30); tiempos.push(Date.now() - ts - 90);
  }
  await pag.keyboard.press("Enter"); await wait(400);
  const est = await pag.evaluate(() => window.hkCad.estado());
  const mov = await medirMovimiento(pag, bx + 100, by + 100, bx + bw - 100, by + bh - 100);
  await pag.screenshot({ path: join(FR, `lisp.png`) });
  out.lisp = { reposo: idle, clics, entidades: est.ents.length, tipos: est.ents.map((e) => JSON.stringify(e).slice(0, 90)), movimiento: mov, errores };
  await pag.close();
}
console.log(JSON.stringify(out, null, 1));
await nav.close(); srv.close();
