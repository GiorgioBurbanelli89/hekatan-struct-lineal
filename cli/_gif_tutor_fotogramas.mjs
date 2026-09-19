// Fotogramas del GIF «Tutor FEM»: ejemplo abierto → clic en 🎓 Tutor FEM → hoja → iteraciones animadas.
// Guarda PNG + posiciones del cursor en cli/shots/gif_tutor/. El GIF lo arma cli/_gif_tutor_montar.py.
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const D = "cli/shots/gif_tutor"; mkdirSync(D, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fr = []; let k = 0;
const foto = async (cursor, nota, ms = 900) => { const f = `${D}/f${String(k++).padStart(3, "0")}.png`; await pag.screenshot({ path: f }); fr.push({ f, cursor, nota, ms }); };
await pag.goto("http://localhost:4617/workspace/?t=zapata-excentrica", { waitUntil: "networkidle2", timeout: 180000 });
await pag.evaluate(() => { try { localStorage.setItem("hk_tutor_lang", "es"); } catch {} });
await espera(5000);
const bt = await pag.evaluate(() => { const r = document.getElementById("hk-tutor-btn").getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
await foto([800, 450], "Das 6.10: zapata con un borde levantado", 1800);
await foto([bt[0] - 200, bt[1] + 120], "", 500);
await foto(bt, "clic en «🎓 Tutor FEM»", 700);
await pag.click("#hk-tutor-btn"); await espera(12000);
await foto(bt, "la hoja se escribe con ESTE modelo", 1800);
// bajar dentro del iframe hasta la tabla de vueltas y la animación
let f = null;
for (const x of pag.frames()) { try { if (await x.evaluate(() => /NO es lineal/i.test(document.body?.innerText ?? ""))) f = x; } catch {} }
if (!f) throw new Error("no encontré el marco con la hoja");
const y = await f.evaluate(() => { const h = [...document.querySelectorAll("h2,h3,h1")].find((e) => /no es lineal|NO es lineal/i.test(e.textContent)); return h ? h.getBoundingClientRect().top + window.scrollY : 0; });
await f.evaluate((y) => window.scrollTo(0, y - 10), y); await espera(1500);
await foto([700, 500], "a) resortes  b) placa  c) ensamble  d) no lineal", 2200);
const y2 = await f.evaluate(() => { const s = document.querySelector("svg"); return s ? s.getBoundingClientRect().top + window.scrollY : 0; });
await f.evaluate((y) => window.scrollTo(0, y - 40), y2); await espera(800);
for (let i = 0; i < 10; i++) { await foto([700, 520], "vueltas del solver: la tracción se apaga", 450); await espera(450); }
writeFileSync(`${D}/fotogramas.json`, JSON.stringify(fr));
console.log(fr.length, "fotogramas");
await nav.close();
