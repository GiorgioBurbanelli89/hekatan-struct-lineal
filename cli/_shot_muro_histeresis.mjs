// Muro agrietado (pandeo-nolineal/web/muro3d.html): sismico no lineal El Centro, histéresis a varias intensidades.
//   node cli/_shot_muro_histeresis.mjs <url> <tag>
import puppeteer from "puppeteer";
const [url, tag] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 900 });
const e404 = []; p.on("response", r => { if (r.status() >= 400) e404.push(r.status() + " " + r.url()); });
const W = (ms) => new Promise(r => setTimeout(r, ms));
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 }); await W(4000);
await p.select("#analysis", "dinnl"); await W(8000);
await p.evaluate(() => document.getElementById("recElc")?.click()); await W(10000);
for (const k of [1, 3, 6]) {
  await p.evaluate((k) => { const s = document.querySelector('input[data-dyn="scale"]'); s.value = String(k); s.dispatchEvent(new Event("input", { bubbles: true })); s.dispatchEvent(new Event("change", { bubbles: true })); }, k);
  await W(15000);
  await p.evaluate(() => document.querySelector('[data-seis="histeresis"]')?.click()); await W(3000);
  const tabla = await p.evaluate(() => [...document.querySelectorAll("div")].map(d => d.innerText).find(t => /^HIST[ÉE]RESIS/.test(t ?? ""))?.replace(/\s+/g, " ").slice(0, 200));
  await p.screenshot({ path: `${process.env.TEMP}/muro_${tag}_hist_x${k}.png` });
  console.log(tag, "Sismo ×" + k, "|", tabla);
}
console.log("respuestas >= 400:", [...new Set(e404)].join(" | "));
await b.close();
