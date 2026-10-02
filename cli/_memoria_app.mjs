// La MEMORIA TÉCNICA en la app: importa un e2k, pulsa «📄 Memoria técnica (PDF)» del panel Sismo NEC y captura la
// ventana que abre. Uso: node cli/_memoria_app.mjs modelo.e2k salida.png [base]
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";
const [fichero, png, base = "http://localhost:4600"] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
p.on("dialog", async (d) => { errs.push("aviso: " + d.message().slice(0, 200)); await d.accept(); });
await p.goto(`${base}/workspace/?t=edificio-frame-nec`, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise((r) => setTimeout(r, 10000));
const ch = p.waitForFileChooser({ timeout: 20000 });
await p.evaluate(() => { const b = [...document.querySelectorAll("button,.tp-btnv_b")].find((e) => /Importar/i.test(e.textContent) && /E2K/i.test(e.textContent) && e.textContent.length < 45); b?.click(); });
await (await ch).accept([fichero]);
await new Promise((r) => setTimeout(r, 25000));
const inv = await p.evaluate(() => ({ secciones: window.__hekatanInventario?.secciones?.length ?? 0, nec: !!window.__hekatanNEC }));
// el botón del panel (la ventana se abre con window.open: se espera la pestaña nueva)
const nueva = new Promise((res) => b.once("targetcreated", async (t) => res(await t.page())));
const pulsado = await p.evaluate(() => { const b = [...document.querySelectorAll("button,.tp-btnv_b")].find((e) => /Memoria técnica/.test(e.textContent)); b?.click(); return !!b; });
const w = await Promise.race([nueva, new Promise((r) => setTimeout(() => r(null), 60000))]);
let info = null;
if (w) {
  await new Promise((r) => setTimeout(r, 3000));
  await w.setViewport({ width: 1200, height: 900 });
  info = await w.evaluate(() => ({ titulo: document.title, h2: document.querySelectorAll("h2").length, tablas: document.querySelectorAll("table").length, svg: document.querySelectorAll("svg").length, indice: document.querySelectorAll("#indice li").length }));
  await w.screenshot({ path: png, fullPage: true });
}
writeFileSync(png.replace(/\.png$/, ".json"), JSON.stringify({ inv, pulsado, info, errs }, null, 1));
console.log(JSON.stringify({ inv, pulsado, info, errs }));
await b.close();
