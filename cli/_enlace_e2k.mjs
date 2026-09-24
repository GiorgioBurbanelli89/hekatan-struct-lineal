// Importa un .e2k en el sitio PÚBLICO y genera el enlace #h= (modelo dentro del enlace; nada se sube).
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";
const [fichero, salida, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("pageerror", e => errs.push(String(e).slice(0,150)));
p.on("dialog", async d => { console.log("aviso:", d.message().slice(0,160).replace(/\n/g," ")); await d.accept(); });
await p.goto("https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-frame-nec", { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 12000));
const ch = p.waitForFileChooser({ timeout: 20000 });
console.log("boton:", await p.evaluate(() => { const b = [...document.querySelectorAll("button,.tp-btnv_b")].find(e => /Importar/i.test(e.textContent) && /E2K/i.test(e.textContent) && e.textContent.length < 45); if (b) { b.click(); return b.textContent.trim(); } return null; }));
await (await ch).accept([fichero]);
await new Promise(r => setTimeout(r, 25000));
const info = await p.evaluate(async () => { const S = window.__hekatanStates;
  const heks = window.__hekatanModeloAHeks?.() ?? "";
  let enlace = null; try { enlace = await window.__hekatanEnlaceModelo?.(); } catch (e) { enlace = "ERR " + e.message; }
  return { n: S.nodes.val.length, e: S.elements.val.length, heks: heks.length, enlace }; });
console.log(JSON.stringify({ n: info.n, e: info.e, heks: info.heks, largo: info.enlace?.length }), "errores", errs.slice(0,3));
if (info.enlace && !info.enlace.startsWith("ERR")) writeFileSync(salida, info.enlace);
await p.screenshot({ path: png }); await b.close();
