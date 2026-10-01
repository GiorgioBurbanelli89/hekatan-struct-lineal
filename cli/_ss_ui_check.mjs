// Estado estacionario en la app: pórtico de plantillas, calcular, gráfica, animar, captura. node cli/_ss_ui_check.mjs <dir> [base]
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const DIR = process.argv[2] ?? "cli/shots/ss"; mkdirSync(DIR, { recursive: true });
const BASE = process.argv[3] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const P = Buffer.from(JSON.stringify({ tipo: 0, nx: 3, pisos: 3, sx: 5, offsets: 0 })).toString("base64");
await pag.goto(`${BASE}/workspace/?t=plantillas&p=${P}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
const info = await pag.evaluate(() => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes("Estado estacionario")); t?.click(); t?.scrollIntoView({ block: "start" });
  const s = window.__hekatanEstacionario; s.params.carga = 1; s.params.f1 = 0.2; s.params.f2 = 15; s.params.n = 150; s.calcular(); return s.params.info; });
await espera(1500); await pag.screenshot({ path: `${DIR}/01_curva.png` });
await pag.evaluate(() => window.__hekatanEstacionario.animar()); await espera(1200); await pag.screenshot({ path: `${DIR}/02_anim.png` });
await pag.evaluate(() => window.__hekatanEstacionario.parar(true));
console.log(JSON.stringify({ info, err }, null, 1)); await nav.close();
