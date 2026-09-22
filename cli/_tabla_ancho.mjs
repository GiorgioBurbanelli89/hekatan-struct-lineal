import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1500, height: 950 });
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 20000));
const medir = (etq) => p.evaluate((etq) => {
  const d = document.getElementById("modal-results");
  if (!d) return { etq, falta: true };
  const t = d.querySelector("table");
  const filas = t ? t.querySelectorAll("tr").length - 1 : 0;
  const r = d.getBoundingClientRect();
  return { etq, panel: [Math.round(r.width), Math.round(r.height)], filas,
           cortada: d.scrollHeight > d.clientHeight + 4, scroll: [d.scrollHeight, d.clientHeight] };
}, etq);
console.log(JSON.stringify(await medir("normal")));
await p.evaluate(() => document.querySelector("#modal-wide")?.click());
await new Promise((r) => setTimeout(r, 1500));
console.log(JSON.stringify(await medir("ancho")));
await p.screenshot({ path: process.argv[3] });
await b.close();
