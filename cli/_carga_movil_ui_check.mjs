// Carga móvil (Multi-step Static) en la app: abre el ejemplo carga-movil-sap2000, lee 📊 Calculados (Hekatan vs SAP2000),
// calcula en el panel 🚚, mira un paso y anima. node cli/_carga_movil_ui_check.mjs [BASE] [DIR]
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/carga-movil"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const abrir = (txt) => pag.evaluate((txt) => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.innerText.includes(txt)); if (!t) return false; const f = t.closest(".tp-fldv"); if (!f.classList.contains("tp-fldv-expanded")) t.click(); t.scrollIntoView({ block: "start" }); return true; }, txt);
await pag.goto(`${BASE}/workspace/?t=carga-movil-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(8000);
const calculados = await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")].map((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() + " = " + (e.querySelector("input,textarea")?.value ?? "")).filter((s) => /SAP2000|Pasos|Referencia/.test(s)));
await pag.screenshot({ path: `${DIR}/01_ejemplo.png` });
const hay = await pag.evaluate(() => !!window.__hekatanCargaMovil);
await abrir("Carga móvil"); await espera(500);
const info = await pag.evaluate(() => { const c = window.__hekatanCargaMovil; c.calcular(); return c.params.info; });
await espera(500); await abrir("Carga móvil"); await espera(300);
await pag.evaluate(() => { window.__hekatanCargaMovil.verPaso(30); }); await espera(800);
await pag.screenshot({ path: `${DIR}/02_paso31.png` });
await pag.evaluate(() => window.__hekatanCargaMovil.parar(true)); await espera(400);
const tipos = await pag.evaluate(() => { const t = window.__hekatanTiposCaso; t.elegir(2); return t.params.info; });
const r = { hay, calculados, info, tipos, errores };
writeFileSync(`${DIR}/datos.json`, JSON.stringify(r, null, 1)); console.log(JSON.stringify(r, null, 1));
await nav.close();
