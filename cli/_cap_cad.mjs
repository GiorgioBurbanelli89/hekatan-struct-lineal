// Despliega Herramientas CAD y recorta el panel, para el tutorial.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 1000 });
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 16000));
// abrir las carpetas de dibujo
await p.evaluate(() => {
  document.querySelectorAll(".tp-fldv_t").forEach((t) => {
    const s = (t.textContent || "");
    if (/Herramientas CAD|Dibujar|Áreas|Modificar/i.test(s)) {
      const f = t.closest(".tp-fldv");
      if (f && !f.classList.contains("tp-fldv-expanded")) t.click();
    }
  });
});
await new Promise((r) => setTimeout(r, 2000));
const caja = await p.evaluate(() => {
  const f = [...document.querySelectorAll(".tp-fldv_t")]
    .find((t) => /Herramientas CAD/i.test(t.textContent || ""))?.closest(".tp-fldv");
  if (!f) return null;
  const r = f.getBoundingClientRect();
  return { x: Math.round(r.left) - 6, y: Math.round(r.top) - 6,
           w: Math.round(r.width) + 12, h: Math.round(r.height) + 12 };
});
console.log("panel:", JSON.stringify(caja));
if (caja && caja.h > 40)
  await p.screenshot({ path: process.argv[3], clip: {
    x: Math.max(0, caja.x), y: Math.max(0, caja.y),
    width: Math.min(caja.w, 1600 - Math.max(0, caja.x)),
    height: Math.min(caja.h, 1000 - Math.max(0, caja.y)) } });
else await p.screenshot({ path: process.argv[3] });
await b.close();
