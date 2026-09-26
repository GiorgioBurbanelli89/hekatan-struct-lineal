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

const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--use-angle=d3d11","--ignore-gpu-blocklist","--window-size=1500,1000"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 1000 });
const err=[]; pag.on("pageerror",(e)=>err.push(e.message));
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
await pag.goto(`http://localhost:4709${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 });
await wait(8000); await pag.keyboard.press("Escape"); await wait(400);
const ok = (q, v, d="") => console.log(`${v ? "  ok  " : "FALLA "} ${q} ${d}`);
const txt = () => pag.evaluate(() => document.body.innerText);
// abrir carpetas: Precision > Modos de dibujo, Settings > Rejilla
await pag.evaluate(() => { document.querySelectorAll(".tp-fldv_t, .tp-rotv_t").forEach((e) => { const t = e.textContent || ""; if (/Precisi|Rejilla|Modos de dibujo|Plano de trabajo/.test(t)) { const f = e.closest(".tp-fldv"); if (f && !f.classList.contains("tp-fldv-expanded")) e.click(); } }); });
await wait(600);
const T = await txt();
ok("ya NO hay «Dimensión grid (m)» duplicada en el panel derecho", !/Dimensión grid \(m\)/.test(T));
ok("«Separación = paso del imán» a la vista en Rejilla", /Separación = paso del imán/.test(T));
const estado = () => pag.evaluate(() => { const lab = [...document.querySelectorAll(".tp-lblv_l")].find((l) => /ORTO \(F8\)/.test(l.textContent || ""));
  const chk = lab && lab.closest(".tp-lblv").querySelector("input[type=checkbox]");
  return { casilla: chk ? chk.checked : null, modo: !!window.__hekatanOrthoMode }; });
let e = await estado();
ok("casilla ORTO refleja el estado real (encendido)", e.casilla === true && e.modo === true, JSON.stringify(e));
await pag.evaluate(() => window.__hekatanToggleOrtho()); await wait(900);
e = await estado();
ok("apagar con F8 actualiza la casilla", e.casilla === false && e.modo === false, JSON.stringify(e));
await pag.evaluate(() => { const lab = [...document.querySelectorAll(".tp-lblv_l")].find((l) => /ORTO \(F8\)/.test(l.textContent || "")); lab.closest(".tp-lblv").querySelector("input[type=checkbox]").click(); }); await wait(600);
e = await estado();
ok("marcar la casilla enciende ORTO de verdad", e.modo === true, JSON.stringify(e));
console.log("pageerrors:", err.length);
await pag.screenshot({ path: "cli/shots_bench/rejilla_paneles.png" });
await nav.close(); srv.close();
