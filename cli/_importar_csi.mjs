// Mete un .e2k / .s2k / .f2k en Hekatan Struct por su boton de importar y
// comprueba que el modelo entra (nudos y elementos), con captura.
import puppeteer from "puppeteer";
const [url, fichero, clave, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 150)));
p.on("dialog", async (d) => { console.log("aviso:", d.message().slice(0, 120).replace(/\n/g, " ")); await d.accept(); });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 16000));

const antes = await p.evaluate(() => ({
  n: (window.__hekatanStates?.nodes?.val ?? []).length,
  e: (window.__hekatanStates?.elements?.val ?? []).length,
}));
console.log("antes:", JSON.stringify(antes));

// pulsar «Importar <clave>»
const hay = await p.evaluate((c) => {
  const b = [...document.querySelectorAll("button,.tp-btnv_b")].find((e) => {
    const t = (e.textContent || "").replace(/\s+/g, " ").trim();
    return /Importar/i.test(t) && t.includes(c) && t.length < 45;
  });
  if (b) { b.click(); return true; } return false;
}, clave);
console.log("boton Importar " + clave + ":", hay ? "pulsado" : "NO ESTA");
await new Promise((r) => setTimeout(r, 2500));

// el selector de fichero
const inputs = await p.$$('input[type=file]');
if (inputs.length) {
  await inputs[inputs.length - 1].uploadFile(fichero);
  console.log("fichero entregado:", fichero.split(/[\/]/).pop());
  await new Promise((r) => setTimeout(r, 20000));
} else console.log("no aparecio el selector de fichero");

await new Promise((r) => setTimeout(r, 12000));   // deja que navegue a csi-importer
console.log('URL tras importar:', await p.evaluate(() => location.search));
const desp = await p.evaluate(() => ({
  n: (window.__hekatanStates?.nodes?.val ?? []).length,
  e: (window.__hekatanStates?.elements?.val ?? []).length,
}));
console.log("despues:", JSON.stringify(desp));
console.log("errores:", errs.slice(0, 2));
await p.screenshot({ path: png });
await b.close();
