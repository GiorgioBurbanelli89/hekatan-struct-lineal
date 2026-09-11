/**
 * IMPORTAR un .e2k (ETABS) y un .s2k (SAP2000) con los botones del panel, y que el
 * modelo LLEGUE: nudos y barras en el visor, no una escena vacía.
 *
 *   node cli/ctl_importar_csi.mjs            (build local)
 *   node cli/ctl_importar_csi.mjs publico    (GitHub Pages)
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "importar"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4779;
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


const RAIZ = join(__dirname, "..", "..");
const errores = [];
pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
pag.on("dialog", (d) => { console.log("    aviso: " + d.message().slice(0, 150)); d.accept(); });
const pulsarBoton = async (texto) => pag.evaluate((t) => {
  const b = [...document.querySelectorAll(".tp-btnv_b")].find((x) => x.textContent.includes(t));
  if (!b) return false;
  const f = b.closest(".tp-fldv"); if (f && f.classList.contains("tp-fldv-cpl")) f.querySelector(":scope > .tp-fldv_b").click();
  b.click(); return true;
}, texto);
const cuenta = () => pag.evaluate(() => {
  const st = window.__hekatanStates;
  return { t: new URLSearchParams(location.search).get("t"), nudos: st?.nodes?.rawVal?.length ?? 0, elems: st?.elements?.rawVal?.length ?? 0,
    dib: window.__hekatanDrawingPoints?.rawVal?.length ?? 0 };
});
for (const [boton, archivo] of [["Importar E2K", "galpon-bodega-electoral/galpon_bodega.e2k"], ["Importar S2K", "galpon-bodega-electoral/galpon_struct.s2k"]]) {
  await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
  await espera(4000);
  const [chooser] = await Promise.all([pag.waitForFileChooser({ timeout: 15000 }), pulsarBoton(boton)]);
  await chooser.accept([join(RAIZ, archivo)]);
  await espera(4000);
  try { await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 60000 }); } catch {}
  await espera(6000);
  const c = await cuenta();
  ok(c.nudos > 50 || c.dib > 50, `${boton}: el modelo llega al visor (${archivo.split("/").pop()})`, JSON.stringify(c));
  await pag.screenshot({ path: join(OUT, boton.replace(/\s/g, "_") + (PUB ? "_pub" : "") + ".png") });
}
ok(errores.length === 0, "sin errores de página", errores.join(" | "));
await nav.close(); srv?.close();
console.log(fallos.length ? `\nFALLAN ${fallos.length}` : "\nTODO OK");
process.exit(fallos.length ? 1 : 0);
