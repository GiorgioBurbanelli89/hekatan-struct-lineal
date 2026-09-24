import puppeteer from "puppeteer";
const EJ = process.argv[2];
const OUT = process.argv[3] || "ej";
const URL = "https://giorgioburbanelli89.github.io/hekatan-lisp/#ej=" + encodeURIComponent(EJ);
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox","--disable-setuid-sandbox","--window-size=1600,1000"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", e => err.push(e.message));
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 40000));
await pag.screenshot({ path: `${OUT}.png` });
const t = await pag.evaluate(() => document.body.innerText || "");
console.log(JSON.stringify({ err: err.slice(0,3),
  lineas: t.split("\n").filter(l => /=\s*[\d⚠]/.test(l)).slice(0, 12) }, null, 1));
await nav.close();
