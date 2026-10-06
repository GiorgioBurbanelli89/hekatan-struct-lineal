// Moving Load en la app: ejemplo carga-movil-sap2000 con caso = Moving Load (📊 Calculados vs SAP2000) y el botón del panel 🚚.
//   node cli/_moving_load_ui_check.mjs [BASE] [DIR]
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/moving-load"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const P = Buffer.from(JSON.stringify({ caso: 1 })).toString("base64");
await pag.goto(`${BASE}/workspace/?t=carga-movil-sap2000&p=${P}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
const calculados = await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")].map((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() + " = " + (e.querySelector("input,textarea")?.value ?? "")).filter((s) => /SAP2000|Moving|Referencia/.test(s)));
const info = await pag.evaluate(() => { const c = window.__hekatanCargaMovil; c.envolvente(); return c.params.info; });
await espera(1200); await pag.screenshot({ path: `${DIR}/01_envolvente_min.png` });
const tipos = await pag.evaluate(() => { const t = window.__hekatanTiposCaso; t.elegir(8); return t.params.info; });
const r = { calculados, info, tipos, errores };
writeFileSync(`${DIR}/datos.json`, JSON.stringify(r, null, 1)); console.log(JSON.stringify(r, null, 1));
await nav.close();
