// Fotogramas del tutor en marcha (▶ Reproducir): uno cada 1.5 s, hasta el paso N.
import puppeteer from "puppeteer";
const [id, hasta, dir] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs=[]; p.on("pageerror", e => errs.push(String(e).slice(0,200)));
await p.goto(`http://localhost:4600/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 12000));
await p.evaluate(() => window.__hekatanTutorTest(true));
let k = 0; const t0 = Date.now();
while (Date.now() - t0 < 200000) {
  await new Promise(r => setTimeout(r, 1500));
  const n = await p.evaluate(() => parseInt(document.querySelector("[data-cuerpo] div:nth-child(2)")?.textContent || "0"));
  if (n > +hasta) break;
  await p.screenshot({ path: `${dir}/f_${String(++k).padStart(3,"0")}_p${n}.png` });
}
console.log("fotogramas", k, "errores", errs); await b.close();
