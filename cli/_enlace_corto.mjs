// Abre un enlace largo (#h=) en el sitio público, pide el enlace de «Compartir» (corto, ?k=) y abre ESE para comprobar que calcula.
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync } from "node:fs";
const [largoF, salida, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
await p.goto(readFileSync(largoF, "utf8").trim(), { waitUntil: "networkidle2", timeout: 240000 });
await new Promise((r) => setTimeout(r, 30000));
const corto = await p.evaluate(async () => await window.__hekatanEnlaceModelo());
console.log("corto:", corto, "largo", corto.length);
const q = await b.newPage(); await q.setViewport({ width: 1600, height: 950 });
q.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
await q.goto(corto, { waitUntil: "networkidle2", timeout: 240000 });
await new Promise((r) => setTimeout(r, 40000));
const r = await q.evaluate(() => { const S = window.__hekatanStates; let rz = 0; for (const [, v] of (S.deformOutputs.val?.reactions ?? [])) rz += v[2];
  return { nudos: S.nodes.val.length, elems: S.elements.val.length, reacRz: rz }; });
console.log(JSON.stringify(r), "errores", errs.slice(0, 3));
writeFileSync(salida, corto); await q.screenshot({ path: png }); await b.close();
