// Abre un enlace #h= (fichero con la URL) en el navegador y comprueba que el modelo ESTÁ y SE CALCULA.
// Uso: node cli/_abrir_enlace_check.mjs enlace.txt captura.png
import puppeteer from "puppeteer";
import { readFileSync } from "node:fs";
const [fEnlace, png] = process.argv.slice(2);
const url = readFileSync(fEnlace, "utf-8").trim();
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("pageerror", e => errs.push(String(e).slice(0, 200)));
await p.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 25000));
const r = await p.evaluate(() => { const S = window.__hekatanStates; let rz = 0, n = 0;
  for (const [, v] of (S.deformOutputs.val?.reactions ?? [])) { rz += v[2]; n++; }
  return { nudos: S.nodes.val.length, elems: S.elements.val.length, reacRz: rz, nReac: n, caso: window.__hekatanActiveCase,
           orificios: (window.__hekatanCliScript ?? "").split("\n").find((l) => l.startsWith("# orificios")) ?? null }; });
console.log(JSON.stringify(r), "errores", errs.slice(0, 3));
await p.screenshot({ path: png }); await b.close();
