// Importa un .e2k/.s2k en Hekatan Struct interceptando el selector de fichero
// NATIVO (el input se crea y se pulsa sin estar en el DOM: por eso buscarlo
// con querySelector no vale).
import puppeteer from "puppeteer";
const [url, fichero, clave, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 150)));
p.on("dialog", async (d) => { console.log("aviso:", d.message().slice(0, 130).replace(/\n/g, " ")); await d.accept(); });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 16000));

const chooser = p.waitForFileChooser({ timeout: 20000 });
const ok = await p.evaluate((c) => {
  const b = [...document.querySelectorAll("button,.tp-btnv_b")].find((e) => {
    const t = (e.textContent || "").replace(/\s+/g, " ").trim();
    return /Importar/i.test(t) && t.includes(c) && t.length < 45;
  });
  if (b) { b.click(); return true; } return false;
}, clave);
console.log("boton:", ok ? "pulsado" : "NO ESTA");
const fc = await chooser;
await fc.accept([fichero]);
console.log("fichero entregado:", fichero.split(/[\/]/).pop());
await new Promise((r) => setTimeout(r, 22000));

console.log("URL:", await p.evaluate(() => location.search));
console.log("modelo:", JSON.stringify(await p.evaluate(() => ({
  n: (window.__hekatanStates?.nodes?.val ?? []).length,
  e: (window.__hekatanStates?.elements?.val ?? []).length,
}))));
console.log("errores:", errs.slice(0, 2));
await p.screenshot({ path: png });
await b.close();
