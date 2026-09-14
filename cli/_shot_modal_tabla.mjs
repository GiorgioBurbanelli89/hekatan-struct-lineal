// Captura el panel de la tabla modal en el deploy PÚBLICO (o la URL que se pase).
// Uso: node cli/_shot_modal_tabla.mjs <url> <salida.png> [ancho alto]
import puppeteer from "puppeteer";

const [url, out, w = "1366", h = "768"] = process.argv.slice(2);
const browser = await puppeteer.launch({ headless: "new", args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h });
await page.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await page.waitForFunction(() => document.querySelector("#modal-results table"), { timeout: 240000 });
await new Promise((r) => setTimeout(r, 1500));
const info = await page.evaluate(() => {
  const d = document.querySelector("#modal-results");
  const r = d.getBoundingClientRect();
  const filas = [...d.querySelectorAll("table tr")].map((tr) => {
    const b = tr.getBoundingClientRect();
    return { top: Math.round(b.top - r.top), bottom: Math.round(b.bottom - r.top), c0: tr.cells[0]?.textContent };
  });
  const ths = [...d.querySelectorAll("table th")];
  const srz = ths.find((t) => t.textContent.trim() === "ΣRz")?.getBoundingClientRect();
  return {
    panel: { w: Math.round(r.width), h: Math.round(r.height) },
    filasVisibles: filas.filter((f) => f.bottom <= r.height).map((f) => f.c0),
    sRzVisible: srz ? srz.right <= r.right : false,
    fontTabla: getComputedStyle(d.querySelector("table")).fontSize,
  };
});
console.log(JSON.stringify(info));
await page.screenshot({ path: out });
await browser.close();
