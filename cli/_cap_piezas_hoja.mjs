// Captura las PIEZAS de una hoja de Hekatan LISP (dibujos y superficies 3D)
// como PNG sueltos, para montar un vídeo con ellas.
import puppeteer from "puppeteer";
import { pathToFileURL } from "url";
const HTML = process.argv[2], OUT = process.argv[3];
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox","--disable-setuid-sandbox","--force-device-scale-factor=2"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1500, height: 1100, deviceScaleFactor: 2 });
await pag.goto(pathToFileURL(HTML).href, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise(r => setTimeout(r, 6000));
const dib = await pag.$$("svg.hk-dib-svg");
for (let i = 0; i < dib.length; i++) await dib[i].screenshot({ path: `${OUT}_dib${i}.png` });
const surf = await pag.$$("canvas.hk-surf");
for (let i = 0; i < surf.length; i++) await surf[i].screenshot({ path: `${OUT}_surf${i}.png` });
console.log(JSON.stringify({ dibujos: dib.length, superficies: surf.length }));
await nav.close();
