// placa-base: ¿que tapa el colormap de la placa? apaga capas y captura.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 850 });
await p.goto("http://localhost:4600/workspace/?t=placa-base", { waitUntil: "networkidle2", timeout: 120000 });
await new Promise(r => setTimeout(r, 6000));
const claves = await p.evaluate(() => Object.keys(window.__hekatanSettings()).join(","));
console.log("settings:", claves);
for (const [nom, fn] of [["base", null], ["sin_custom3D", "custom3D"], ["sin_deformada", "deformedShape"], ["sin_elements", "elements"]]) {
  if (fn) await p.evaluate((fn) => { const s = window.__hekatanSettings(); if (s[fn]) s[fn].val = false; }, fn);
  await new Promise(r => setTimeout(r, 1500));
  await p.screenshot({ path: `${process.env.TEMP}/pb_${nom}.png`, clip: { x: 450, y: 250, width: 550, height: 350 } });
}
await b.close();
