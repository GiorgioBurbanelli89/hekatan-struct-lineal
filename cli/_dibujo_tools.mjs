// Que se puede DIBUJAR desde cero en el CAD de Hekatan Struct.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 950 });
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 16000));
const r = await p.evaluate(() => {
  const txt = (e) => (e.textContent || "").replace(/\s+/g, " ").trim();
  const carpetas = {};
  document.querySelectorAll(".tp-fldv").forEach((f) => {
    const t = txt(f.querySelector(".tp-fldv_t") || {});
    if (!t) return;
    const btns = [...f.querySelectorAll(".tp-btnv_b,button")]
      .map(txt).filter((x) => x && x.length < 42);
    if (btns.length) carpetas[t] = [...new Set(btns)].slice(0, 20);
  });
  return carpetas;
});
for (const [k, v] of Object.entries(r)) {
  if (/dibuj|CAD|area|modific|herramient/i.test(k)) console.log("\n[" + k + "]\n  " + v.join(" | "));
}
await b.close();
