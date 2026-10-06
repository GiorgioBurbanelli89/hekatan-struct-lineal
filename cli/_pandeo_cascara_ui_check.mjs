// Pandeo de cáscaras en la app: ejemplo pandeo-cascara-sap2000 (📊 Calculados vs SAP2000, forma de pandeo 3D) y el
// panel ⟂ Pandeo (lineal) sobre el mismo modelo de cáscaras.
//   node cli/_pandeo_cascara_ui_check.mjs [BASE] [DIR]
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/pandeo_cascara"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const leer = () => pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")].map((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() + " = " + (e.querySelector("input,textarea")?.value ?? "")).filter((s) => /SAP2000|Timoshenko/.test(s)));
const r = {};
await pag.goto(`${BASE}/workspace/?t=pandeo-cascara-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(8000);
for (const [k, q] of [["placa", {}], ["placa_modo2", { modo: 2 }], ["muro", { tipo: 1 }], ["losa", { tipo: 2 }]]) {
  for (const [c, v] of Object.entries(q)) {
    await pag.evaluate((c, v) => window.__hekatanSetParam(c, v), c, v);
    if (c === "tipo") {   // lo que hace onParamChange al elegir en la lista: las medidas de la validación
      const D = [{}, { a: 2, b: 3, t: 0.15, q: 1000, nx: 8, ny: 12 }, { a: 4, b: 4, t: 0.02, q: 100, nx: 12, ny: 12 }][v];
      for (const [c2, v2] of Object.entries(D)) await pag.evaluate((c, v) => window.__hekatanSetParam(c, v), c2, v2);
    }
  }
  await espera(2500); r[k] = await leer(); await pag.screenshot({ path: `${DIR}/${k}.png` });
}
r.panel = await pag.evaluate(() => { const h = window.__hekatanPandeo; if (!h) return "sin panel"; h.calcular(); return h.params.info; });
r.errores = errores;
writeFileSync(`${DIR}/datos.json`, JSON.stringify(r, null, 1)); console.log(JSON.stringify(r, null, 1));
await nav.close();
