import puppeteer from "puppeteer";
const ej = "66 De donde sale cada formula de Hekatan Struct - las fuentes.lisp";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 1000 });
await p.goto("https://giorgioburbanelli89.github.io/hekatan-lisp/?cb=" + Date.now() + "#ej=" + encodeURIComponent(ej) + "&solo=1", { waitUntil: "networkidle0" });
await p.waitForFunction(() => !/Cargando/.test(document.body.innerText), { timeout: 90000 }).catch(() => {});
await new Promise(r => setTimeout(r, 7000));
const r = await p.evaluate(() => ({
  enlaces: [...document.querySelectorAll("a.m-link")].map(a => a.textContent.trim()),
  crudo: (document.body.innerText.match(/\]\(http/g) || []).length,
  seccion: document.body.innerText.includes("Cada formulaci"),
}));
console.log("enlaces:", r.enlaces.length, "| markdown crudo:", r.crudo, "| seccion presente:", r.seccion);
r.enlaces.forEach(t => console.log("   ->", t));
await p.evaluate(() => { const e = [...document.querySelectorAll("a.m-link")][0]; if (e) e.scrollIntoView({ block: "center" }); });
await new Promise(r => setTimeout(r, 600));
await p.screenshot({ path: process.argv[2] });
await b.close();
