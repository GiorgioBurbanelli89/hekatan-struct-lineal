/**
 * CASOS DE CARGA: al elegir un caso se ve SOLO su carga; una combinación, la suma con
 * sus factores. (Jorge, 11-sep-2026: «si coloco caso tal solo debe mostrar esa carga;
 * me muestra la suma de la lateral y la vertical».)
 *
 *   node cli/ctl_casos_carga.mjs            (build local)
 *   node cli/ctl_casos_carga.mjs publico    (GitHub Pages)
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "casos"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4785;
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
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=portico-2d"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=portico-2d`;
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
pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
const elegirCaso = async (texto) => {
  const v = await pag.evaluate((t) => {
    const f = [...document.querySelectorAll(".tp-lblv")].find((x) => (x.querySelector(".tp-lblv_l")?.textContent || "").trim() === "Case results");
    const s = f?.querySelector("select"); if (!s) return null;
    document.querySelectorAll("#hk-caso").forEach((x) => x.removeAttribute("id")); s.id = "hk-caso";
    const o = [...s.options].find((o) => o.textContent.trim() === t); return o ? o.value : null;
  }, texto);
  if (v == null) return false;
  await pag.select("#hk-caso", v); await espera(2500); return true;
};
const resumen = () => pag.evaluate(() => {
  const L = window.__hekatanStates.nodeInputs.rawVal?.loads ?? new Map();
  let fx = 0, fz = 0; L.forEach((c) => { fx += c[0]; fz += c[2]; });
  const M = window.__hekatanStates.analyzeOutputs.rawVal?.bendingsZ; let mm = 0;
  M?.forEach((r) => { for (const x of r) mm = Math.max(mm, Math.abs(x)); });
  return { fx: +fx.toFixed(3), fz: +fz.toFixed(3), mmax: +mm.toFixed(2) };
});
const casos = await pag.evaluate(() => {
  const f = [...document.querySelectorAll(".tp-lblv")].find((x) => (x.querySelector(".tp-lblv_l")?.textContent || "").trim() === "Case results");
  return f ? [...f.querySelector("select").options].map((o) => o.textContent.trim()) : [];
});
ok(casos.includes("Ex") && casos.some((c) => c.includes("1.2D+1L+1Ex")), "el pórtico trae el caso Ex y la combinación sísmica", casos.join(" | "));
// pórtico 2D por defecto: CM −10 y CV −5 por nudo (5 nudos cargados), Ex 30 en el tope
await elegirCaso("Dead"); const d = await resumen();
ok(d.fx === 0 && Math.abs(d.fz + 50) < 1e-6, "Dead: solo la muerta (sin lateral)", JSON.stringify(d));
await elegirCaso("Live"); const l = await resumen();
ok(l.fx === 0 && Math.abs(l.fz + 25) < 1e-6, "Live: solo la viva", JSON.stringify(l));
await elegirCaso("Ex"); const e = await resumen();
ok(Math.abs(e.fx - 30) < 1e-6 && e.fz === 0, "Ex: solo la lateral", JSON.stringify(e));
await elegirCaso("Σ 1.2D+1L+1Ex"); const c = await resumen();
ok(Math.abs(c.fx - 30) < 1e-6 && Math.abs(c.fz - (1.2 * -50 - 25)) < 1e-6, "1.2D+1L+1Ex: la suma con sus factores", JSON.stringify(c));
ok(d.mmax !== e.mmax && c.mmax > 0, "los resultados cambian con el caso", `M máx Dead ${d.mmax} · Ex ${e.mmax} · combo ${c.mmax}`);
// las flechas: una por COMPONENTE (la vertical y la horizontal por separado), no una inclinada
const flechas = await pag.evaluate(() => {
  const g = document.querySelector("#viewer").__ctx.scene.getObjectByName("loadsGroup");
  const out = [];
  g?.children.forEach((o) => { if (o.type === "ArrowHelper") { const d = o.userData?.dir; if (d) out.push([d.x, d.y, d.z]); } });
  return out;
});
const inclinadas = flechas.filter((d) => [d[0], d[1], d[2]].filter((x) => Math.abs(x) > 1e-9).length > 1).length;
ok(flechas.length > 0 && inclinadas === 0, "combinación: flechas separadas por sentido (ninguna inclinada)", `${flechas.length} flechas, ${inclinadas} inclinadas`);
await pag.screenshot({ path: join(OUT, (PUB ? "pub_" : "") + "combo_flechas.png") });
await pag.screenshot({ path: join(OUT, (PUB ? "pub_" : "") + "combo.png") });
// el edificio NEC: peso de piso (Dead) y fuerzas sísmicas (Ex), por separado
await pag.goto(URL_.replace("portico-2d", "edificio-frame-nec"), { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(5000);
const d2 = await resumen();
ok(d2.fx === 0 && d2.fz < 0, "edificio al abrir (Dead): solo el peso, sin sismo", JSON.stringify(d2));
const esc = () => pag.evaluate(() => window.__hekatanSettings?.()?.deformScale?.val);
await elegirCaso("Live"); await elegirCaso("Dead"); const escD = await esc();
await elegirCaso("Ex"); const e2 = await resumen(); const escE = await esc();
ok(escE > 0 && escE < escD, "cada caso con su escala de deformada (el sismo no sale tumbado)", `Dead ${escD} · Ex ${escE}`);
ok(e2.fx > 0 && e2.fz === 0, "edificio, Ex: solo las fuerzas sísmicas", JSON.stringify(e2));
await pag.screenshot({ path: join(OUT, (PUB ? "pub_" : "") + "edificio_ex.png") });
ok(errores.length === 0, "sin errores de página", errores.join(" | "));
await nav.close(); srv?.close();
console.log(fallos.length ? `\nFALLAN ${fallos.length}` : "\nTODO OK");
process.exit(fallos.length ? 1 : 0);
