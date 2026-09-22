// Abre un modelo con modal, pone la piel CLARA y recorta la tabla modal.
import puppeteer from "puppeteer";
const [url, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1500, height: 950 });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 20000));
// piel clara, por el mismo camino que el botón
await p.evaluate(() => {
  document.documentElement.setAttribute("data-hk-piel", "claro");
  window.dispatchEvent(new CustomEvent("hk-piel", { detail: "claro" }));
});
await new Promise((r) => setTimeout(r, 2500));
const caja = await p.evaluate(() => {
  const t = [...document.querySelectorAll("div")]
    .find((d) => /MODAL/.test(d.textContent || "") && d.querySelector("table"));
  if (!t) return null;
  const r = t.getBoundingClientRect();
  const st = getComputedStyle(t);
  return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
           fondo: st.background.slice(0, 40), letra: st.color };
});
console.log("panel:", JSON.stringify(caja));
if (caja) await p.screenshot({ path: png, clip: { x: Math.max(0, caja.x), y: Math.max(0, caja.y),
  width: Math.min(caja.w, 1500 - Math.max(0, caja.x)), height: Math.min(caja.h, 950 - Math.max(0, caja.y)) } });
else await p.screenshot({ path: png });
await b.close();
