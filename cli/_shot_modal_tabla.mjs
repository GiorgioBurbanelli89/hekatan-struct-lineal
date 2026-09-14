// Captura el panel de la tabla modal en el deploy PÚBLICO (o la URL que se pase).
// Uso: node cli/_shot_modal_tabla.mjs <url> <salida.png> [ancho alto]
import puppeteer from "puppeteer";

// 5º argumento «movil»: celular táctil (DPR 3), como abre el enlace desde WhatsApp
const [url, out, w = "1366", h = "768", modo = ""] = process.argv.slice(2);
const movil = modo === "movil";
const browser = await puppeteer.launch({ headless: "new", args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage();
if (movil) await page.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36");
await page.setViewport({ width: +w, height: +h, isMobile: movil, hasTouch: movil, deviceScaleFactor: movil ? 3 : 1 });
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
  // una fila se VE si su centro, en pantalla, es de verdad la tabla (no la tapa la barra de comandos)
  const visibles = [...d.querySelectorAll("table tr")].filter((tr) => {
    const b = tr.getBoundingClientRect();
    const y = (b.top + b.bottom) / 2, x = b.left + 8;
    if (b.bottom > r.bottom || y > window.innerHeight) return false;
    const el = document.elementFromPoint(x, y);
    return !!el && d.contains(el);
  }).map((tr) => tr.cells[0]?.textContent);
  return {
    panel: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(window.innerHeight - r.bottom) },
    filasVisibles: visibles,
    sRzVisible: srz ? srz.right <= r.right && srz.right <= window.innerWidth : false,
    fontTabla: getComputedStyle(d.querySelector("table")).fontSize,
  };
});
console.log(JSON.stringify(info));
await page.screenshot({ path: out });
await browser.close();
