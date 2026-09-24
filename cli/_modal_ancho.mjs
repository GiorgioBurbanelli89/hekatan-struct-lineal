// Pulsa «⤢ Ancho» y mide si la tabla modal se ve ENTERA o queda cortada.
import puppeteer from "puppeteer";
const [url, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1500, height: 950 });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 20000));
const medir = (etq) => p.evaluate((etq) => {
  const d = document.getElementById("modal-results");
  if (!d) return { etq, falta: true };
  const t = d.querySelector("table");
  const filas = t ? t.querySelectorAll("tr").length - 1 : 0;
  return {
    etq,
    panel: [Math.round(d.getBoundingClientRect().width), Math.round(d.getBoundingClientRect().height)],
    filas,
    // ¿hay que hacer scroll para ver el final?
    cortada: d.scrollHeight > d.clientHeight + 4,
    scroll: [d.scrollHeight, d.clientHeight],
  };
}, etq);
console.log(JSON.stringify(await medir("normal")));
await p.evaluate(() => document.querySelector("#modal-wide")?.click());
await new Promise((r) => setTimeout(r, 1500));
console.log(JSON.stringify(await medir("ancho")));
await p.screenshot({ path: png });
await b.close();
