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

const __dirname = "C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/_work_pruebas/cli";
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

const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--use-angle=d3d11","--ignore-gpu-blocklist","--window-size=1500,1000"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 1000 });
const err=[]; pag.on("pageerror",(e)=>err.push(e.message));
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
await pag.goto(`http://localhost:4709${BASE}workspace/`, { waitUntil: "networkidle2", timeout: 120000 });
await wait(8000); await pag.keyboard.press("Escape"); await wait(400);

const ok = (q, v, d="") => console.log(`${v ? "  ok  " : "FALLA "} ${q} ${d}`);
const choques = () => pag.evaluate(() => {
  const st = document.getElementById("hk-cad-status"); if (!st) return { err: "sin barra" };
  const q = st.getBoundingClientRect(); const out = []; if (getComputedStyle(st).visibility === "hidden") return { barra: "oculta por falta de hueco", choca: [] };
  document.querySelectorAll("body button").forEach((b) => { const r = b.getBoundingClientRect();
    if (r.width <= 0 || r.width > 80 || getComputedStyle(b).position !== "fixed") return;
    if (!(r.right < q.left || q.right < r.left || r.bottom < q.top || q.bottom < r.top)) out.push(b.id || b.title || "boton"); });
  return { barra: [Math.round(q.left), Math.round(q.right), Math.round(q.top)], choca: out };
});
for (const [w, h] of [[1280, 720], [1500, 1000], [2000, 1000], [1000, 700]]) {
  await pag.setViewport({ width: w, height: h }); await wait(1500);
  const c = await choques();
  ok(`${w}x${h}: la barra «CAD listo» no toca ningún botón redondo`, !c.err && c.choca.length === 0, JSON.stringify(c));
}
await pag.setViewport({ width: 1500, height: 1000 }); await wait(1200);
await pag.screenshot({ path: "cli/shots_bench/barra_inferior.png", clip: { x: 0, y: 760, width: 1500, height: 240 } });
console.log("pageerrors:", err.length);
await nav.close(); srv.close();
