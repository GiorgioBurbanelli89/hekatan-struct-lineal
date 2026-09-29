// Fotogramas del GIF del botón Compartir, del SITIO PÚBLICO: botón a la vista, parámetros cambiados, aviso con
// el enlace, el enlace abierto en otra pestaña (mismo modelo) y la barra en 4 anchos sin choques.
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const B = process.env.B || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = "cli/shots/gif_compartir"; mkdirSync(DIR, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const esc = []; let k = 0;
const caja = (sel) => pag.evaluate((s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? [r.x, r.y, r.width, r.height] : null; }, sel);
const foto = async (p, es, en, marco, dur = 2600) => { const f = `${String(++k).padStart(2, "0")}.png`; await p.screenshot({ path: `${DIR}/${f}` }); esc.push({ f, es, en, marco, dur }); };
await pag.goto(`${B}/workspace/index.html?t=plantillas`, { waitUntil: "domcontentloaded", timeout: 180000 });
await pag.waitForFunction(() => !!document.getElementById("hk-compartir-btn") && window.__hekatanStates?.nodes?.val?.length, { timeout: 180000 }); await espera(6000);
await foto(pag, "Nuevo: botón «Compartir», a la vista en la barra", "New: «Share» button, always visible in the top bar", await caja("#hk-compartir-btn"));
await pag.evaluate(() => { window.__hekatanSetParam("pisos", 5); window.__hekatanSetParam("nx", 3); }); await espera(6000);
await foto(pag, "Cambias el modelo: 5 pisos, 3 vanos", "Change the model: 5 storeys, 3 bays", null, 2400);
await pag.click("#hk-compartir-btn"); await espera(1500);
const url = await pag.evaluate(() => document.querySelector("#hk-compartir-aviso input")?.value);
await foto(pag, "Compartir: copia el enlace del ejemplo con tus parámetros", "Share: copies the example link with your parameters", await caja("#hk-compartir-aviso"), 3400);
const p2 = await nav.newPage(); await p2.setViewport({ width: 1600, height: 900 });
await p2.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await p2.waitForFunction(() => window.__hekatanStates?.nodes?.val?.length, { timeout: 180000 }); await espera(8000);
const n1 = await pag.evaluate(() => window.__hekatanStates.nodes.val.length), n2 = await p2.evaluate(() => window.__hekatanStates.nodes.val.length);
await foto(p2, `Quien abre el enlace ve el mismo modelo (${n2} nudos = ${n1})`, "Whoever opens the link sees the same model", null, 3200);
// la barra en 4 anchos
for (const w of [1920, 1280, 900, 800]) {
  await p2.setViewport({ width: w, height: 700 }); await espera(1200);
  await p2.screenshot({ path: `${DIR}/barra_${w}.png`, clip: { x: 0, y: 0, width: w, height: 34 } });
}
writeFileSync(`${DIR}/escenas.json`, JSON.stringify({ esc, url, n1, n2 }, null, 1));
console.log(esc.length, "escenas ·", url, "·", n1, n2);
await nav.close();
