#!/usr/bin/env node
/**
 * Miniatura de CADA plantilla, con NUESTRO modelo.
 *
 *   node cli/shot_plantillas.mjs
 *
 * Por que existe: el `New Model Quick Templates` de ETABS ensena la tipologia con
 * un dibujo, y ese dibujo dice de un vistazo lo que tres lineas de texto no
 * dicen. Las suyas son de CSI.
 *
 * Asi que las nuestras salen de NUESTRO motor, que ademas es lo honesto: la
 * miniatura ensena lo que Hekatan construye de verdad, no lo que construye otro.
 *
 * Sale: cli/shots/plantillas/<n>_<id>.png   ← MIRARLAS
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "plantillas"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml",
  ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((q, r) => {
  let p = decodeURIComponent((q.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { r.writeHead(404); return r.end("404"); }
  r.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  r.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4707, r));

const NOM = ["portico-2d", "portico-3d", "portico-losa", "solo-rejilla",
             "losa-plana", "losa-vigas-borde", "dual-muros", "arriostrado-cbf"];
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox","--disable-setuid-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1300, height: 860 });
const errs = []; pag.on("pageerror", (e) => errs.push(e.message));
await pag.goto(`http://localhost:4707${BASE}workspace/?t=plantillas`,
               { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 10000));

for (let t = 0; t < NOM.length; t++) {
  const ok = await pag.evaluate((tt) => {
    const q = window.__hekatanParams?.();
    if (!q) return "sin __hekatanParams()";
    q.tipo = tt;
    window.__hekatanRebuild?.(); window.__hekatanAutoFit?.();
    return "ok";
  }, t);
  if (ok !== "ok") { console.error(ok); break; }
  await new Promise((r) => setTimeout(r, 3500));
  // Solo el LIENZO, sin los paneles: es una miniatura, no una captura de pantalla.
  const caja = await pag.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return null;
    const r = c.getBoundingClientRect();
    // El lienzo ocupa todo el ancho, pero los paneles flotan ENCIMA: a la
    // izquierda Settings y a la derecha el de parámetros. La ventana util es la
    // franja de en medio, y el modelo se auto-encuadra centrado en ella.
    const izq = 0.24, der = 0.74, arr = 0.16, aba = 0.94;
    return { x: r.x + r.width * izq, y: r.y + r.height * arr,
             width: r.width * (der - izq), height: r.height * (aba - arr) };
  });
  await pag.screenshot({ path: join(OUT, `${t}_${NOM[t]}.png`), clip: caja ?? undefined });
  console.log(`  ${t} ${NOM[t]}`);
}
console.log(`\npageerror: ${errs.length}\n-> ${OUT}`);
await nav.close(); srv.close();
