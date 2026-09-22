// Como _ver_hoja_lisp pero recorriendo la salida: una captura por pantalla.
//   node cli/_ver_hoja_lisp2.mjs "<url>" prefijo
import puppeteer from "puppeteer";
const [url, pre] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1100, height: 1300 });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 28000));
const caja = await p.evaluate(() => {
  const cand = [...document.querySelectorAll("div,section")]
    .filter((e) => e.scrollHeight > e.clientHeight + 50 && e.clientHeight > 300);
  const s = cand.sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
  if (s) s.id = s.id || "hk-scroll-salida";
  return s ? { id: s.id, alto: s.scrollHeight, visible: s.clientHeight } : null;
});
console.log("panel:", JSON.stringify(caja));
const n = caja ? Math.ceil(caja.alto / caja.visible)
  : await p.evaluate(() => Math.ceil(document.body.scrollHeight / window.innerHeight));
for (let i = 0; i < Math.min(n, 6); i++) {
  if (caja) await p.evaluate((id, i, h) => { document.getElementById(id).scrollTop = i * h * 0.92; }, caja.id, i, caja.visible);
  else await p.evaluate((i) => window.scrollTo(0, i * window.innerHeight * 0.92), i);
  await new Promise((r) => setTimeout(r, 900));
  await p.screenshot({ path: `${pre}_${i}.png` });
}
console.log("capturas:", Math.min(n, 6));
await b.close();
