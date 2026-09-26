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
await pag.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 });
await wait(8000); await pag.keyboard.press("Escape"); await wait(400);
const vis = () => pag.evaluate(() => { const b=document.getElementById("hk-ribbon"); return b && getComputedStyle(b).display !== "none"; });
const npts = () => pag.evaluate(() => (window.__hekatanDrawingPoints?.val ?? []).length);
const ok = (q, v, d="") => console.log(`${v ? "  ok  " : "FALLA "} ${q} ${d}`);
ok("la cinta arranca ABIERTA en lienzo nuevo", await vis());
// 1) sin herramienta (select): un clic en el lienzo NO la pliega
await pag.mouse.click(700, 650); await wait(300);
ok("clic en el lienzo con Seleccionar no la pliega", await vis());
// 2) herramienta linea + primer clic -> se pliega y el clic cuenta
await pag.evaluate(() => window.__hekatanSetView("plan")); await wait(800);
await pag.keyboard.type("l ", { delay: 40 }); await wait(300);
await pag.mouse.click(700, 650); await wait(500);
ok("primer clic con Linea: la cinta se pliega", !(await vis()));
ok("y el clic SI puso el punto", (await npts()) === 1, "puntos=" + await npts());
ok("aparece el boton ✏ Dibujar", await pag.evaluate(() => getComputedStyle(document.getElementById("hk-ribbon-abrir")).display !== "none"));
await pag.screenshot({ path: "cli/shots_bench/cinta_plegada.png" });
// 3) abrir a mano: no se vuelve a plegar sola
await pag.evaluate(() => document.getElementById("hk-ribbon-abrir").click()); await wait(300);
ok("✏ Dibujar la abre", await vis());
await pag.mouse.click(900, 650); await wait(500);
ok("abierta a mano: el siguiente clic NO la pliega", await vis(), "puntos=" + await npts());
console.log("pageerrors:", err.length);
await nav.close(); srv.close();
