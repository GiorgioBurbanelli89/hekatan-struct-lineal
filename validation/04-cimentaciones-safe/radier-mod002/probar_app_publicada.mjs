// Abre un .heks en la app PUBLICADA (GitHub Pages) con el enlace #h= (el .heks comprimido va en el hash,
// como el boton «Compartir» de la app) y mide: cuanto tarda en resolver, errores, y el rango de presion que
// imprime cliModeler («presion Winkler: N shells, σ min..max kN/m²»). Deja un PNG.
//   node probar_app_publicada.mjs modelo.heks salida.png [url_base]
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";
const [heks, png, base0] = process.argv.slice(2);
const base = base0 ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";
const b64 = deflateRawSync(Buffer.from(readFileSync(heks, "utf-8"))).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const url = base + "#h=" + b64;
writeFileSync(png.replace(/\.png$/, ".url.txt"), url);
const nav = await puppeteer.launch({ headless: "new", protocolTimeout: 600000, executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage();
await p.setViewport({ width: 1500, height: 950 });
const errs = [], logs = [];
const t0 = Date.now();
let tSolve = null, presion = null;
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => {
  const s = m.text();
  if (/CLI Modeler|Winkler|error|Error/.test(s)) logs.push(`${((Date.now() - t0) / 1000).toFixed(1)}s ${s.slice(0, 200)}`);
  if (/Solve OK|presi[oó]n Winkler/.test(s) && tSolve === null) tSolve = (Date.now() - t0) / 1000;
  const mm = s.match(/presi[oó]n Winkler: (\d+) shells, σ (-?[\d.]+)\.\.(-?[\d.]+)/);
  if (mm) presion = { shells: +mm[1], min: +mm[2], max: +mm[3] };
});
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
for (let i = 0; i < 180 && presion === null; i++) await new Promise((r) => setTimeout(r, 1000));
await new Promise((r) => setTimeout(r, 5000));
await p.screenshot({ path: png });
// numeros del motor de la PAGINA (states del workspace): Uz minimo y presion minima (kN/m2)
const num = await p.evaluate(() => {
  const st = (window).__hekatanStates; if (!st) return null;
  let uz = 0, pmin = 0, nd = 0;
  st.deformOutputs?.val?.deformations?.forEach((u) => { nd++; if (u[2] < uz) uz = u[2]; });
  st.analyzeOutputs?.val?.pressure?.forEach((v) => v.forEach((q) => { if (q < pmin) pmin = q; }));
  return { nudos: nd, uz_min_m: uz, pmin_kN_m2: pmin };
});
console.log(JSON.stringify({ motor_pagina: num, url_len: url.length, t_resuelto_s: tSolve, presion_kN_m2: presion, pageerror: errs.slice(0, 3), logs: logs.slice(0, 15) }, null, 1));
writeFileSync(png.replace(/.png$/, ".json"), JSON.stringify({ motor_pagina: num, t_resuelto_s: tSolve }));
await nav.close();
