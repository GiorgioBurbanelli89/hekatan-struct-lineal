import puppeteer from "puppeteer";
const EJ = process.argv[2];
const URL = "https://giorgioburbanelli89.github.io/hekatan-lisp/#ej=" + encodeURIComponent(EJ);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--disable-setuid-sandbox"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1500, height: 950 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 45000));
const main = await pag.evaluate(() => ({
  iframes: document.querySelectorAll("iframe").length,
  canvas: document.querySelectorAll("canvas").length,
  shadow: !!document.querySelector("*")?.shadowRoot,
}));
let dentro = null;
for (const f of pag.frames()) {
  if (f === pag.mainFrame()) continue;
  dentro = await f.evaluate(() => ({
    canvas: document.querySelectorAll("canvas").length,
    clases: [...new Set([...document.querySelectorAll("canvas")].map(c => c.className))],
  })).catch(() => null);
}
console.log(JSON.stringify({ main, dentro }, null, 1));
await nav.close();
