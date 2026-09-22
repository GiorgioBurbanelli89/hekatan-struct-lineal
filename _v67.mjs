import puppeteer from "puppeteer";
const ej = process.argv[2];
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1450, height: 1050 });
const errs = [];
p.on("pageerror", e => errs.push(String(e).slice(0, 140)));
await p.goto("https://giorgioburbanelli89.github.io/hekatan-lisp/?cb=" + Date.now() + "#ej=" + encodeURIComponent(ej) + "&solo=1", { waitUntil: "networkidle0" });
await p.waitForFunction(() => !/Cargando/.test(document.body.innerText) && document.body.innerText.length > 900, { timeout: 120000 }).catch(() => {});
await new Promise(r => setTimeout(r, 6000));
const r = await p.evaluate(() => {
  const t = document.body.innerText;
  return { largo: t.length, tablas: document.querySelectorAll("table").length,
           hastaDonde: t.slice(-160).replace(/\s+/g, " "), errs: 0 };
});
console.log("largo:", r.largo, "| tablas:", r.tablas, "| errores JS:", errs.length);
console.log("acaba en: ...", r.hastaDonde);
await p.screenshot({ path: process.argv[3] });
await b.close();
