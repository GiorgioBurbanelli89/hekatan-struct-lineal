// Sonda del tutor de la Mesa de Torsión contra el dev server (:4600): abre ?tutor=1, deja que
// reproduzca solo (autoplay permitido en el navegador de prueba) y captura cada paso a mitad
// y al final. PNG en cli/shots/tutor_mesa/; errores de consola en errores.txt.
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";
const OUT = "cli/shots/tutor_mesa"; mkdirSync(OUT, { recursive: true });
const URL = process.env.HK_URL || "http://localhost:4600/workspace/?t=mesa-torsion&tutor=1";
const nav = await puppeteer.launch({ headless: "new", args: ["--autoplay-policy=no-user-gesture-required",
  "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1600, height: 900 });
const errores = [];
pag.on("pageerror", (e) => errores.push("pageerror: " + e.message));
pag.on("console", (m) => { if (m.type() === "error" || /tutor|audio/i.test(m.text())) errores.push(m.type() + ": " + m.text()); });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 180000 }).catch((e) => errores.push("goto: " + e.message));
const titulo = () => pag.evaluate(() => document.querySelector("[data-cuerpo] > div:nth-child(2)")?.textContent || "");
let ultimo = "", n = 0; const t0 = Date.now();
while (Date.now() - t0 < 240000) {
  await new Promise((r) => setTimeout(r, 1500));
  const t = await titulo();
  const sonando = await pag.evaluate(() => [...document.querySelectorAll("audio")].length);
  if (t && t !== ultimo) { ultimo = t; n = 0; console.log(((Date.now() - t0) / 1000).toFixed(0) + " s  " + t); }
  n++;
  if (t && (n === 3 || n === 7)) {
    const k = t.split("/")[0];
    await pag.screenshot({ path: `${OUT}/paso${k}_${n === 3 ? "a" : "b"}.png` });
  }
  if (/^8\//.test(t) && n > 16) break;
}
writeFileSync(`${OUT}/errores.txt`, errores.join("\n") || "(sin errores)");
console.log("errores:", errores.length); errores.slice(0, 10).forEach((e) => console.log("  " + e.slice(0, 200)));
await nav.close();
