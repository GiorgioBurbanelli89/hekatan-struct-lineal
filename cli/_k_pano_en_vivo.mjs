/**
 * LA K DEL PAÑO EN LA WEB: que al TOCAR una cáscara salga el botón y la matriz.
 *
 * Mide tres cosas, no una:
 *   1. el botón «📐 Ver K local · paño N» aparece al designar una cáscara;
 *   2. la ventana enseña DOS tablas de 12×12 (flexión y membrana) con números;
 *   3. y esas matrices son de verdad matrices de rigidez: simétricas y con
 *      exactamente 3 modos de energía nula (los sólidos rígidos del plano).
 *
 *   node cli/_k_pano_en_vivo.mjs [id_ejemplo]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "k_pano");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const ID = process.argv[2] || "plate-thin";
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
await new Promise((r) => srv.listen(4823, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:4823${BASE}workspace/?t=${ID}`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(8000);

// 1. el botón sale al designar una cáscara (el mismo aviso que emite el ratón)
await pag.evaluate(() => window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: { type: "shell", idx: 0 } } })));
await esp(500);
const chip = await pag.evaluate(() => { const b = document.getElementById("hk-klocal-chip");
  return b && !b.hidden ? b.textContent : null; });
ok(!!chip && /paño/.test(chip), "al designar una cáscara sale el botón de la K", chip || "no sale");

// 2. se pulsa y salen las dos tablas
await pag.evaluate(() => document.getElementById("hk-klocal-chip").click()); await esp(700);
const win = await pag.evaluate(() => {
  const h = document.getElementById("hk-klocal");
  if (!h || h.hidden) return null;
  const tablas = [...h.querySelectorAll("table")].map((t) => ({
    filas: t.querySelectorAll("tr").length - 1,
    cols: t.querySelectorAll("tr")[1]?.querySelectorAll("td").length ?? 0,
  }));
  return { titulo: h.querySelector("b")?.textContent, tablas, texto: h.textContent.slice(0, 140) };
});
ok(!!win, "la ventana se abre");
ok(win?.tablas.length === 2, "con DOS tablas (flexión y membrana)", JSON.stringify(win?.tablas));
ok(win?.tablas.every((t) => t.filas === 12 && t.cols === 12), "las dos son 12×12");
await pag.screenshot({ path: join(OUT, "01_k_pano.png") });

// 3. ¿son matrices de rigidez? simetría y 3 modos de energía nula
const fis = await pag.evaluate(() => {
  const r = window.__hekatanKPano(0);
  const prop = (K) => {
    let sim = 0, m = 0;
    for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
      m = Math.max(m, Math.abs(K[i][j])); sim = Math.max(sim, Math.abs(K[i][j] - K[j][i]));
    }
    // autovalores por Jacobi (matriz pequeña y simétrica)
    const A = K.map((f) => f.slice());
    for (let it = 0; it < 200; it++) {
      let p = 0, q = 1, mx = 0;
      for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) if (Math.abs(A[i][j]) > mx) { mx = Math.abs(A[i][j]); p = i; q = j; }
      if (mx < 1e-14 * m) break;
      const th = 0.5 * Math.atan2(2 * A[p][q], A[q][q] - A[p][p]), c = Math.cos(th), s = Math.sin(th);
      for (let k = 0; k < 12; k++) { const ap = A[p][k], aq = A[q][k]; A[p][k] = c * ap - s * aq; A[q][k] = s * ap + c * aq; }
      for (let k = 0; k < 12; k++) { const ap = A[k][p], aq = A[k][q]; A[k][p] = c * ap - s * aq; A[k][q] = s * ap + c * aq; }
    }
    const ev = A.map((f, i) => f[i]).sort((a, b) => a - b);
    return { simRel: sim / m, nulos: ev.filter((v) => Math.abs(v) < 1e-9 * m).length, ev0: ev.slice(0, 4).map((v) => +(v / m).toExponential(2)) };
  };
  return { formulacion: r.formulacion, area: r.area, flexion: prop(r.flexion), membrana: prop(r.membrana) };
});
console.log("       " + fis.formulacion + " · área " + fis.area.toFixed(4) + " m²");
for (const [n, p] of [["flexión", fis.flexion], ["membrana", fis.membrana]]) {
  ok(p.simRel < 1e-12, `${n}: la matriz es simétrica`, p.simRel.toExponential(2));
  ok(p.nulos === 3, `${n}: 3 modos de energía nula (sólido rígido), ni más ni menos`,
     `${p.nulos} nulos · autovalores/máx ${p.ev0.join(", ")}`);
}
ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
