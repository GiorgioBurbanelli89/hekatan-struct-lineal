// Comprueba el control Vdin/Vest POR DIRECCIÓN (NEC §6.2.2.b) en la app, test-m-dual.
// Uso: node cli/_control_vdin_dir.mjs [url] [salida.png]
import puppeteer from "puppeteer";

const url = process.argv[2] ?? "http://localhost:4600/workspace/?t=test-m-dual";
const png = process.argv[3] ?? "cli/shots/control_vdin_dir.png";
const browser = await puppeteer.launch({ headless: "new", protocolTimeout: 900000, args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage();
const errores = [];
page.on("pageerror", (e) => errores.push(e.message));
await page.setViewport({ width: 1600, height: 900 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 240000 });
await new Promise((r) => setTimeout(r, 5000));
if (process.env.ARTICULO) console.log("config artículo:", await page.evaluate(() => {
  const fila = (t) => [...document.querySelectorAll(".tp-lblv")].find((e) => e.querySelector(".tp-lblv_l")?.textContent.trim().startsWith(t));
  const n = fila("cantidad")?.querySelector("input"); if (n) { n.value = "12"; n.dispatchEvent(new Event("change", { bubbles: true })); }
  const sel = fila("Método modal")?.querySelector("select");
  let opts = [];
  if (sel) { opts = [...sel.options].map((o) => o.textContent); const i = opts.findIndex((t) => /autovector|Eigen/i.test(t) && !/ETABS|faltante|Ritz/i.test(t)); if (i >= 0) { sel.selectedIndex = i; sel.dispatchEvent(new Event("change", { bubbles: true })); } }
  return { n: n?.value, metodo: sel?.selectedOptions[0]?.textContent, opts };
}));
await new Promise((r) => setTimeout(r, 3000));
console.log("click Correr modal:", await page.evaluate(() => { const b = [...document.querySelectorAll("button, .tp-btnv_b")].find((e) => e.textContent.includes("Correr modal")); if (b) { b.click(); return true; } return false; }));
await page.waitForFunction(() => (window).__hekatanSeismic?.base, { timeout: 600000, polling: 5000 });
const r = await page.evaluate(() => {
  const b = (window).__hekatanSeismic.base;
  const linea = [...document.querySelectorAll("*")].map((e) => e.childNodes).flatMap((n) => [...n])
    .filter((n) => n.nodeType === 3 && n.textContent.includes("CONTROL Vdin/Vest")).map((n) => n.textContent.trim())[0];
  return { Vest: b.Vest, Vx: b.Vx, Vy: b.Vy, ratioX: b.ratioX, ratioY: b.ratioY, fEscX: b.fEscX, fEscY: b.fEscY, Edis: b.Edis, linea };
});
console.log(JSON.stringify(r, null, 1));
console.log("pageerror:", errores.length, errores.slice(0, 3));
await page.screenshot({ path: png });
await browser.close();
