// Capturas del ejemplo `placa-base-tubular` (presión, desplazamiento, Von Mises) en local o en el sitio público.
//   node cli/_placa_tubular_shots.mjs [baseURL] [caso=0|1]
//   baseURL por defecto: el deploy público. Local: http://127.0.0.1:4617
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const base = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const caso = process.argv[3] ?? "0";
const dir = "cli/shots/placa_tubular"; mkdirSync(dir, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + String(e.message).slice(0, 200)));
p.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 200)); });
await p.goto(`${base}/workspace/?t=placa-base-tubular${caso === "1" ? "&caso=1" : ""}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
const info = await p.evaluate(() => ({
  contacto: (window).__hekatanCliContacto,
  labels: [...document.querySelectorAll(".tp-lblv")].map((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() + " = " + (e.querySelector("input")?.value ?? e.querySelector("select")?.value ?? "")).filter((t) => /Hormigón|Pernos|ΣFz|levantados|uz pernos|Juez|Iteraciones/.test(t)),
}));
const sufijo = caso === "1" ? "_rhs" : "_shs";
for (const campo of ["pressure", "displacementZ", "vonMises"]) {
  await p.evaluate((c) => { const s = (window).__hekatanSettings?.(); if (s?.shellResults) s.shellResults.val = c; }, campo);
  await new Promise((r) => setTimeout(r, 1500));
  await p.screenshot({ path: `${dir}/${campo}${sufijo}.png` });
}
writeFileSync(`${dir}/info${sufijo}.json`, JSON.stringify({ base, errs, ...info }, null, 1));
console.log(JSON.stringify({ base, errs, ...info }, null, 1));
await nav.close();
