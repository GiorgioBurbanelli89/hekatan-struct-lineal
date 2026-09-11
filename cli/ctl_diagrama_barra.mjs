/**
 * La vista 2D del diagrama y el GRÁFICO POR BARRA (el «Diagram for Frame Object» de ETABS).
 *
 * Jorge (11-sep-2026): «¿cómo elijo qué pórtico plano quiero ver?». El desplegable dice
 * «Pórtico n · y = … m» y las flechas ◀ ▶ pasan de uno a otro; un clic en una barra del
 * alzado abre su gráfico (axil, cortante, momento) de nudo a nudo.
 *
 *   node cli/ctl_diagrama_barra.mjs            (el build local)
 *   node cli/ctl_diagrama_barra.mjs publico    (el sitio de GitHub Pages)
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "diagrama2d"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4777;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
let srv = null;
if (!PUB) {
  srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(raiz, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => srv.listen(PUERTO, r));
}
const URL_ = PUB
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-frame-nec"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=edificio-frame-nec`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1400, height: 900 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(6000);


const errores = [];
pag.on("pageerror", (e) => errores.push(String(e)));
// Momento 3-3 encendido y la vista 2D abierta en el alzado XZ
await pag.evaluate(() => { window.__hekatanSettings().frameResults.val = "bendingsZ"; });
await espera(2500);
await pag.evaluate(() => window.__hekatanDiagrama2D({ plano: "XZ" }));
await espera(1500);
const porticos = await pag.$$eval("#hk-diagrama-2d .hk-d2-en option", (o) => o.map((x) => x.textContent));
ok(porticos.length >= 2 && porticos.every((t, n) => t.startsWith("Pórtico " + (n + 1) + " · y = ")),
  "el desplegable nombra cada pórtico", porticos.join(" | "));
const tit0 = await pag.$eval("#hk-diagrama-2d .hk-d2-tit", (e) => e.textContent);
await pag.click("#hk-diagrama-2d .hk-d2-sig"); await espera(800);
const tit1 = await pag.$eval("#hk-diagrama-2d .hk-d2-tit", (e) => e.textContent);
ok(tit0 !== tit1 && tit1.includes("y = " + porticos[1].split("y = ")[1].replace(" m", "")),
  "▶ pasa al pórtico siguiente", tit1);
await pag.click("#hk-diagrama-2d .hk-d2-ant"); await espera(800);
const tit2 = await pag.$eval("#hk-diagrama-2d .hk-d2-tit", (e) => e.textContent);
ok(tit2 === tit0, "◀ vuelve al anterior", tit2);
// clic en una VIGA del alzado (la línea de toque más horizontal)
const nToque = await pag.$$eval("#hk-diagrama-2d line", (ls) => ls.filter((l) => l.getAttribute("stroke") === "transparent").length);
ok(nToque > 0, "cada barra del alzado se puede pulsar", nToque + " barras");
await pag.evaluate(() => {
  const ls = [...document.querySelectorAll("#hk-diagrama-2d line")].filter((l) => l.getAttribute("stroke") === "transparent");
  const viga = ls.find((l) => Math.abs(+l.getAttribute("y1") - +l.getAttribute("y2")) < 0.5);
  viga.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});
await espera(1000);
const barra = await pag.evaluate(() => {
  const h = document.querySelector("#hk-diagrama-barra");
  if (!h || h.hidden) return null;
  return { tit: h.querySelector(".hk-b-tit").textContent,
    filas: [...h.querySelectorAll(".hk-b-cuerpo > div")].map((d) => d.textContent), svgs: h.querySelectorAll("svg polygon").length };
});
ok(!!barra && barra.svgs === 3, "el clic abre el gráfico de la barra (3 gráficos)", barra ? barra.tit : "no se abrió");
if (barra) {
  const num = (s, k) => Number((s.match(new RegExp(k + " (-?[0-9.]+)")) || [])[1]);
  const V = barra.filas[1], M = barra.filas[2];
  const L = Number(barra.tit.match(/L = ([\d.]+)/)[1]);
  // viga sin carga repartida dentro del tramo: V constante y el M cambia V·L de punta a punta
  const dM = num(M, "máx") - num(M, "mín"), vv = Math.abs(num(V, "máx"));
  ok(Math.abs(dM - vv * L) < 0.02 * dM + 0.05, "dM = V·L en la viga (el momento cuadra con el cortante)",
    `ΔM ${dM.toFixed(2)} · V·L ${(vv * L).toFixed(2)}`);
  console.log("    " + barra.filas.join("\n    "));
}
await pag.screenshot({ path: join(OUT, PUB ? "publico.png" : "local.png") });
ok(errores.length === 0, "sin errores de página", errores.join(" | "));
await nav.close(); srv?.close();
console.log(fallos.length ? `\nFALLAN ${fallos.length}` : "\nTODO OK");
process.exit(fallos.length ? 1 : 0);
