// Capturas del vídeo «Hekatan Struct: pandeo lineal» (app pública, 1280×720 a ×2). node cli/_video_pandeo_capturas.mjs <dir>
// Cada escena: PNG + rectángulos (CSS px, ×2 en el PNG) de los controles que se señalan. La deformada del modo se pone
// a mano (fase k/24) para que la animación salga fluida y repetible.
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const DIR = process.argv[2]; mkdirSync(DIR, { recursive: true });
const BASE = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const R = (tipo, txt) => pag.evaluate((tipo, txt) => {
  let e = null;
  if (tipo === "fila") e = [...document.querySelectorAll(".tp-lblv")].filter((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim().replace(/\s+/g, " ").startsWith(txt)).find((x) => x.getBoundingClientRect().width);
  else if (tipo === "carpeta") e = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes(txt) && x.getBoundingClientRect().width);
  else if (tipo === "boton") e = [...document.querySelectorAll(".tp-btnv_b, button")].find((x) => x.innerText.includes(txt) && x.getBoundingClientRect().width);
  else if (tipo === "texto") e = [...document.querySelectorAll("textarea")].find((x) => x.value.includes(txt) && x.getBoundingClientRect().width);
  else if (tipo === "lienzo") e = [...document.querySelectorAll("canvas")].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom];
}, tipo, txt);
const datos = { escenas: {} };
const foto = async (n, marcas = {}) => { const m = {}; for (const [k, [t, x]] of Object.entries(marcas)) m[k] = await R(t, x);
  await pag.screenshot({ path: `${DIR}/${n}.png` }); datos.escenas[n] = m; console.log("foto", n, Object.values(m).filter(Boolean).length + "/" + Object.keys(m).length); };
const clic = (t, x) => pag.evaluate((t, x) => { const e = t === "carpeta" ? [...document.querySelectorAll(".tp-fldv_t")].find((y) => y.innerText.includes(x)) : [...document.querySelectorAll(".tp-btnv_b")].find((y) => y.innerText.includes(x)); e?.click(); }, t, x);
const cerrarCarpetas = (re) => pag.evaluate((re) => { for (const t of document.querySelectorAll(".tp-fldv_t")) { const f = t.closest(".tp-fldv"); if (f.classList.contains("tp-fldv-expanded") && new RegExp(re).test(t.innerText)) t.click(); } }, re);

await pag.goto(`${BASE}/workspace/?t=pandeo-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; if (p) for (const k in p) p[k].val = false; const s = window.__hekatanSettings(); s.loads.val = true; s.supports.val = true; s.deformedShape.val = false; });
await cerrarCarpetas("Guía|Herramientas|Tablas|Al pasar|Rejilla|Datos de entrada|Ver$"); await espera(500);
await pag.evaluate(() => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.trim().endsWith("Resultados")); const f = t?.closest(".tp-fldv"); if (f && !f.classList.contains("tp-fldv-expanded")) t.click(); });
await pag.evaluate(() => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes("CLI Comandos")); t?.closest(".tp-fldv")?.classList.contains("tp-fldv-expanded") && t.click(); });
const verPandeo = () => pag.evaluate(() => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes("Pandeo (lineal)")); t?.scrollIntoView({ block: "start" }); });
await espera(800);
await foto("e1_abrir", { ejemplo: ["fila", "Ejemplo"], modelo: ["carpeta", "Modelo"] });
await foto("e2_modelo", { lienzo: ["lienzo", ""] });
await verPandeo(); await espera(400);
await foto("e3a_carpeta", { pandeo: ["carpeta", "Pandeo (lineal)"] });
await clic("carpeta", "Pandeo (lineal)"); await espera(700); await verPandeo(); await espera(300);
await foto("e3b_abierta", { calcular: ["boton", "Calcular pandeo"] });
await clic("boton", "Calcular pandeo"); await espera(900);
datos.info = await pag.evaluate(() => window.__hekatanPandeo.params.info);
await foto("e4_lambda", { calcular: ["boton", "Calcular pandeo"], info: ["texto", "factor de pandeo"] });
// animación controlada: fase k/24 sobre el modo m
const orig = await pag.evaluate(() => window.__hekatanStates.nodes.val.map((n) => [...n]));
const pon = (m, s) => pag.evaluate((m, s, orig) => {
  const r = window.__hekatanPandeo.resultado(); const psi = r.modeShapes[m];
  let dmax = 0; const xs = orig.map((n) => n[0]), ys = orig.map((n) => n[1]), zs = orig.map((n) => n[2]);
  const diag = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), Math.max(...zs) - Math.min(...zs));
  for (let i = 0; i < orig.length; i++) dmax = Math.max(dmax, Math.hypot(psi[6 * i], psi[6 * i + 1], psi[6 * i + 2]));
  const e = 0.15 * diag / (dmax || 1);
  window.__hekatanStates.nodes.val = orig.map((n, i) => [n[0] + e * s * psi[6 * i], n[1] + e * s * psi[6 * i + 1], n[2] + e * s * psi[6 * i + 2]]);
  return { e, dmax, n4: window.__hekatanStates.nodes.val[4] };
}, m, s, orig);
for (const m of [0, 1]) {
  await pag.evaluate((m) => { const p = window.__hekatanPandeo.params; p.modo = m + 1; window.__hekatanPandeo.refrescar(); }, m);
  for (let k = 0; k < 24; k++) { const q = await pon(m, Math.sin((2 * Math.PI * k) / 24)); if (k === 6) console.log("pon", m, JSON.stringify(q)); await espera(700);
    await foto(`e5_m${m + 1}_${String(k).padStart(2, "0")}`, k === 0 ? { animar: ["boton", "Animar el modo"], modo: ["fila", "Modo a ver"] } : {}); }
  await pag.evaluate((orig) => { window.__hekatanStates.nodes.val = orig; }, orig);
}
await clic("carpeta", "Pandeo (lineal)"); await espera(300);
await pag.evaluate(() => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes("Calculados")); const f = t?.closest(".tp-fldv"); if (f && !f.classList.contains("tp-fldv-expanded")) t.click(); t?.scrollIntoView({ block: "start" }); });
await espera(700);
await foto("e6_calculados", { calc: ["carpeta", "Calculados"], m1: ["fila", "modo 1: λ"], m2: ["fila", "modo 2: λ"] });
await clic("carpeta", "Tipos de caso"); await espera(600); await pag.evaluate(() => [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes("Tipos de caso"))?.scrollIntoView({ block: "start" })); await espera(300);
await foto("e7a_tipos", { lista: ["fila", "Load Case Type"], info: ["texto", "Pandeo"] });
await pag.evaluate(() => window.__hekatanTiposCaso.elegir(1)); await espera(500);
await foto("e7b_pro", { lista: ["fila", "Load Case Type"], info: ["texto", "Módulo Pro"] });
datos.errores = errores;
writeFileSync(`${DIR}/datos.json`, JSON.stringify(datos, null, 1)); console.log(JSON.stringify({ info: datos.info, errores }, null, 1));
await nav.close();
