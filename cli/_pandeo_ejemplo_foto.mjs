// Foto del ejemplo pandeo-sap2000 (público): Calculados + panel Pandeo animando. node cli/_pandeo_ejemplo_foto.mjs <png>
import puppeteer from "puppeteer";
const BASE = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const abrir = (txt) => pag.evaluate((txt) => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.innerText.includes(txt)); if (!t) return false; const f = t.closest(".tp-fldv"); if (!f.classList.contains("tp-fldv-expanded")) t.click(); return true; }, txt);
await pag.goto(`${BASE}/workspace/?t=pandeo-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(8000);
await pag.evaluate(() => { for (const t of document.querySelectorAll("#parameters .tp-fldv_t")) { const f = t.closest(".tp-fldv"); if (f.classList.contains("tp-fldv-expanded") && /CLI|Guía/.test(t.innerText)) t.click(); } });
await abrir("Calculados"); await abrir("Resultados"); await abrir("Pandeo (lineal)"); await espera(500);
await pag.evaluate(() => { const p = window.__hekatanPandeo; p.calcular(); p.refrescar(); p.animar(); }); await espera(1150);
await pag.screenshot({ path: process.argv[2] });
await nav.close();
