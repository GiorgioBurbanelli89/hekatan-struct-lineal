// Matriz de piso (Aguiar) en la app: dual del test M, Calcular NEC y luego el botón Aguiar; captura y texto.
//   node cli/_aguiar_ui_check.mjs <dir> [base]
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const DIR = process.argv[2] ?? "cli/shots/aguiar"; mkdirSync(DIR, { recursive: true });
const BASE = process.argv[3] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto(`${BASE}/workspace/?t=test-m-dual&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
const info = await pag.evaluate(() => { const n = window.__hekatanNEC; n.correr(); n.aguiar(); return n.params.info; });
await espera(1200);
const txt = await pag.evaluate(() => document.querySelector("#hk-nec-panel")?.innerText.slice(0, 900));
await pag.screenshot({ path: `${DIR}/aguiar.png` });
console.log(JSON.stringify({ info, txt, err }, null, 1)); await nav.close();
