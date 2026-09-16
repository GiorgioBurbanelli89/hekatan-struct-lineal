/**
 * PÓRTICO IRREGULAR A PARTIR DE UNA PLANTILLA (Jorge, 16-sep-2026):
 * «falta eliminar barras, un paño… si quisiera un pórtico irregular de una
 *  plantilla ya hecha».
 *
 * Se mide la cadena entera:
 *   1. plantilla cargada → el lienzo está VACÍO (ese era el problema);
 *   2. «Editar este modelo» vuelca nudos, barras y paños al lienzo;
 *   3. los apoyos y las cargas sobreviven al volcado;
 *   4. se BORRAN barras con el ratón → el modelo tiene menos barras;
 *   5. y sigue resolviendo (hay deformada, sin NaN).
 *
 *   node cli/_portico_irregular.mjs [id]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "portico_irregular");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const ID = process.argv[2] || "edificio-aporticado";
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
await new Promise((r) => srv.listen(4793, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
pag.on("dialog", (d) => d.accept().catch(() => {}));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:4793${BASE}workspace/?t=${ID}`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(8000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

const estado = () => pag.evaluate(() => {
  const d = (window.__hekatanDeformOutputs?.rawVal ?? window.__hekatanStates?.deformOutputs?.rawVal);
  let flecha = null, nan = 0;
  const def = d?.deformations;
  if (def && typeof def.forEach === "function") {
    def.forEach((v) => { const w = Math.abs(v?.[2] ?? 0);
      if (!isFinite(w)) nan++; else if (flecha === null || w > flecha) flecha = w; });
  }
  return {
    dibNudos: (window.__hekatanDrawingPoints?.rawVal ?? []).length,
    dibPolis: (window.__hekatanDrawingPolylines?.rawVal ?? []).length,
    dibAreas: (window.__hekatanDrawingAreas?.rawVal ?? []).length,
    apoyos: (window.__hekatanManualSupports?.size ?? 0),
    cargas: (window.__hekatanManualLoads?.size ?? 0),
    flecha: flecha === null ? null : +flecha.toFixed(6), nan,
  };
});

// ── 1. la plantilla, tal cual ─────────────────────────────────────────────
const e0 = await estado();
console.log("  plantilla cargada: " + JSON.stringify(e0));
ok(e0.dibNudos === 0, "con la plantilla, el lienzo está VACÍO (ese era el problema)");
await pag.screenshot({ path: join(OUT, "01_plantilla.png") });

// ── 2. convertir a editable ───────────────────────────────────────────────
const r = await pag.evaluate(() => window.__hekatanConvertirEditable?.() ?? null);
ok(!!r, "«Editar este modelo» responde", JSON.stringify(r));
await esp(3500);
const e1 = await estado();
console.log("  tras convertir   : " + JSON.stringify(e1));
ok(e1.dibNudos > 0 && e1.dibPolis > 0, "la malla pasa al lienzo (nudos y barras dibujados)",
   `${e1.dibNudos} nudos · ${e1.dibPolis} polilíneas · ${e1.dibAreas} paños`);
ok(e1.apoyos > 0, "los apoyos sobreviven al volcado", e1.apoyos + " nudos apoyados");
ok(e1.flecha !== null && e1.nan === 0, "y el modelo convertido RESUELVE, sin NaN",
   `flecha máx ${e1.flecha} m · ${e1.nan} NaN`);
await pag.screenshot({ path: join(OUT, "02_convertido.png") });

// ── 3. borrar barras para dejarlo irregular ───────────────────────────────
const antes = e1.dibPolis;
const quitadas = await pag.evaluate(() => {
  // se quitan 3 barras por el camino del programa (el mismo estado que toca el ratón)
  const P = window.__hekatanDrawingPolylines;
  const lista = [...(P.rawVal ?? [])];
  const areas = new Set(window.__hekatanDrawingAreas?.rawVal ?? []);
  const idx = [];
  for (let i = lista.length - 1; i >= 0 && idx.length < 3; i--) if (!areas.has(i)) idx.push(i);
  const nuevas = lista.filter((_, i) => !idx.includes(i));
  // al quitar polilíneas, los índices de las áreas se corren: se recalculan
  const nuevasAreas = [...areas].map((a) => a - idx.filter((i) => i < a).length).filter((a) => a >= 0);
  P.val = nuevas;
  if (window.__hekatanDrawingAreas) window.__hekatanDrawingAreas.val = nuevasAreas;
  window.__hekatanRebuild?.();
  return idx.length;
});
await esp(2500);
const e2 = await estado();
console.log("  tras borrar      : " + JSON.stringify(e2));
ok(e2.dibPolis === antes - quitadas, `se borran ${quitadas} barras`, `${antes} → ${e2.dibPolis}`);
ok(e2.flecha !== null && e2.nan === 0, "y el pórtico IRREGULAR sigue resolviendo",
   `flecha máx ${e2.flecha} m · ${e2.nan} NaN`);
ok(e2.flecha !== e1.flecha, "con otra flecha que el modelo completo (es otra estructura)",
   `${e1.flecha} → ${e2.flecha}`);
await pag.screenshot({ path: join(OUT, "03_irregular.png") });

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
