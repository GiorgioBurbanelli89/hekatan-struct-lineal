// Steady State / PSD en la app: ejemplo estacionario-sap2000 (📊 Calculados vs SAP2000, gráfica módulo/fase) y el panel 〜.
//   node cli/_estacionario_ui_check.mjs [BASE] [DIR]
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/estacionario"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const leer = () => pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")].map((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() + " = " + (e.querySelector("input,textarea")?.value ?? "")).filter((s) => /SAP2000/.test(s)));
const r = {};
await pag.goto(`${BASE}/workspace/?t=estacionario-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(8000);
for (const [k, q] of [["ss", {}], ["fase", { graf: 1 }], ["acel", { graf: 0, carga: 1 }], ["psd", { carga: 0, caso: 1 }]]) {
  for (const [c, v] of Object.entries(q)) await pag.evaluate((c, v) => window.__hekatanSetParam(c, v), c, v);
  await espera(2500); r[k] = await leer(); await pag.screenshot({ path: `${DIR}/${k}.png` });
}
r.panel = await pag.evaluate(() => { const h = window.__hekatanEstacionario; if (!h) return "sin panel"; h.params.tipo = 0; h.calcular(); return h.params.info; });
await espera(800); await pag.screenshot({ path: `${DIR}/panel.png` });
r.tipos = await pag.evaluate(() => { const t = window.__hekatanTiposCaso; if (!t) return "sin panel de tipos"; t.elegir(10); return t.params.info; });
r.errores = errores;
writeFileSync(`${DIR}/datos.json`, JSON.stringify(r, null, 1)); console.log(JSON.stringify(r, null, 1));
await nav.close();
