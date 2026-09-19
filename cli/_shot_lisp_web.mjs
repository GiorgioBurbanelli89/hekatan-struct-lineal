// Abre una hoja .lisp en Hekatan LISP web (publicado) por #h= (hoja comprimida en el enlace) y guarda PNG.
//   node cli/_shot_lisp_web.mjs hoja.lisp salida_prefijo [alto]
import puppeteer from "puppeteer";
import { readFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";
const [ruta, pref, alto = "1400"] = process.argv.slice(2);
const h = deflateRawSync(Buffer.from(readFileSync(ruta, "utf-8"))).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const url = `https://giorgioburbanelli89.github.io/hekatan-lisp/#h=${h}&solo=1`;
console.log("enlace:", url.length, "caracteres");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: +alto });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 200)));
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise((r) => setTimeout(r, 15000));
await pag.screenshot({ path: `${pref}_1.png` });
// el render va en un iframe: se hace scroll dentro y se captura por tramos
const fr = pag.frames().find((f) => f !== pag.mainFrame());
const H = fr ? await fr.evaluate(() => document.body.scrollHeight) : 0;
console.log("alto del render:", H);
for (let k = 1, y = +alto - 100; fr && y < H && k < 12; k++, y += +alto - 100) {
  await fr.evaluate((y) => window.scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 1500));
  await pag.screenshot({ path: `${pref}_${k + 1}.png` });
}
const txt = fr ? await fr.evaluate(() => document.body.innerText) : "";
console.log("errores:", errs.length, errs.slice(0, 5));
console.log("texto (extracto):", txt.replace(/\s+/g, " ").slice(0, 400));
await nav.close();
