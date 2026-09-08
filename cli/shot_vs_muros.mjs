#!/usr/bin/env node
/**
 * La figura «VS»: el mismo edificio de 6 pisos con losa, muros en X (A) contra
 * muros en X e Y (B), capturado en Hekatan Struct desde la isometrica y con el
 * campo de membrana F22 en las cascaras (los muros se ven de color). Es la
 * pareja de `validation/modelos/vs_muros/{A_murosX,B_murosXY}.{e2k,s2k}`, que
 * se resuelven en ETABS 22 y SAP2000 24 con `plantillas_etabs.py` y
 * `plantillas_sap2000.py`.
 *
 *   node cli/shot_vs_muros.mjs   → validation/modelos/vs_muros/hekatan_{A,B}.png + hekatan.json
 */
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "validation", "modelos", "vs_muros");
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png" };
const srv = createServer((q, r) => {
  let p = decodeURIComponent((q.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { r.writeHead(404); return r.end("404"); }
  r.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); r.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4739, r));
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 });
const w = (ms) => new Promise((r) => setTimeout(r, ms));
const VARIANTES = [
  { clave: "A", nombre: "Muros en X", murosMode: 1 },
  { clave: "B", nombre: "Muros en X e Y", murosMode: 3 },
];
const resumen = {};
for (const v of VARIANTES) {
  await pag.goto(`http://localhost:4739${BASE}workspace/?t=edificio-aporticado&ribbon=0`, { waitUntil: "networkidle2", timeout: 180000 });
  await w(6000);
  await pag.keyboard.press("Escape");
  await pag.evaluate((mm) => {
    const p = window.__hekatanParams();
    p.murosMode = mm; p.nPisos = 6; p.slabOn = 1; p.bracesMode = 0;
    window.__hekatanRebuild();
  }, v.murosMode);
  await w(9000);
  // solo el visor: se esconden los paneles para que la figura sea el edificio
  await pag.evaluate(() => {
    for (const id of ["settings", "parameters", "hk3-cmdline", "hk-statusbar", "hk-cad-tit", "hk-pane-host", "toolbar", "hk-coord-fixed"]) {
      const e = document.getElementById(id); if (e) e.style.display = "none";
    }
    document.querySelectorAll(".tp-rotv").forEach((e) => (e.style.display = "none"));
    const s = window.__hekatanSettings?.();
    if (s?.shellResults) s.shellResults.val = "membraneYY";
    if (s?.deformedShape) s.deformedShape.val = false;
    window.__hekatanAutoFit?.();
  });
  await w(2500);
  await pag.screenshot({ path: join(OUT, `hekatan_${v.clave}.png`) });
  resumen[v.clave] = await pag.evaluate(() => ({
    ejemplo: window.__hekatanExample?.(),
    params: (({ murosMode, nPisos, slabOn, bracesMode, tMuro }) => ({ murosMode, nPisos, slabOn, bracesMode, tMuro }))(window.__hekatanParams()),
  }));
  console.log(v.clave, v.nombre, JSON.stringify(resumen[v.clave]));
}
writeFileSync(join(OUT, "hekatan_capturas.json"), JSON.stringify(resumen, null, 2));
await nav.close(); srv.close();
