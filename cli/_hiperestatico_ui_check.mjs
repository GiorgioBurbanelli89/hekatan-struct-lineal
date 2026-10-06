// Hyperstatic en la app: ejemplo hiperestatico-sap2000 (📊 Calculados vs SAP2000) y el panel 🔩. node cli/_hiperestatico_ui_check.mjs [BASE] [DIR]
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/hiperestatico"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto(`${BASE}/workspace/?t=hiperestatico-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
const calculados = await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")].map((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() + " = " + (e.querySelector("input,textarea")?.value ?? "")).filter((s) => /SAP2000/.test(s)));
const info = await pag.evaluate(() => { const h = window.__hekatanHiper; h.calcular(); return h.params.info; });
await espera(1200); await pag.screenshot({ path: `${DIR}/01_secundario.png` });
const tipos = await pag.evaluate(() => { const t = window.__hekatanTiposCaso; t.elegir(12); return t.params.info; });
const r = { calculados, info, tipos, errores };
writeFileSync(`${DIR}/datos.json`, JSON.stringify(r, null, 1)); console.log(JSON.stringify(r, null, 1));
await nav.close();
