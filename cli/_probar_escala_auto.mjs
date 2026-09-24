// La escala de la deformada se reajusta sola al cambiar parametros (si el usuario no la toco).
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 850 });
const errs = []; p.on("pageerror", e => errs.push(String(e)));
const esc = () => p.evaluate(() => { const s = window.__hekatanSettings(); return [+s.deformScale.val.toFixed(2), s.deformScaleZ.val]; });
const cambia = (o) => p.evaluate((o) => { Object.assign(window.__hekatanParams(), o); window.__hekatanRebuild(); }, o);
await p.goto("http://localhost:4600/workspace/?t=plate-thick", { waitUntil: "networkidle2", timeout: 120000 });
await new Promise(r => setTimeout(r, 5000));
console.log("carga (4x4, t 0.30):       ", await esc());
await cambia({ Lx: 6, Ly: 4, t: 0.1, E: 35e6, nu: 0.15, q: 10, nx: 6, ny: 4 }); await new Promise(r => setTimeout(r, 2500));
console.log("t 0.10, 6x4 (auto):        ", await esc());
await p.screenshot({ path: process.env.TEMP + "/escala_auto.png" });
await p.evaluate(() => { window.__hekatanSettings().deformScale.val = 20; });   // el usuario la mueve
await cambia({ q: 20 }); await new Promise(r => setTimeout(r, 2500));
console.log("usuario pone 20 y q=20:    ", await esc(), "(debe seguir en 20)");
console.log("errores:", errs.length, errs.slice(0, 3).join(" | "));
await b.close();
