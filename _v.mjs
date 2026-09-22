import puppeteer from "puppeteer";
const ej = process.argv[2], png = process.argv[3], marca = process.argv[4];
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 1050 });
await p.goto("https://giorgioburbanelli89.github.io/hekatan-lisp/?cb=" + Date.now() + "#ej=" + encodeURIComponent(ej) + "&solo=1", { waitUntil: "networkidle0" });
await p.waitForFunction((m) => new RegExp(m).test(document.body.innerText), { timeout: 150000 }, marca).catch(() => console.log("(no llego la marca:", marca + ")"));
await new Promise(r => setTimeout(r, 3000));
const r = await p.evaluate(() => ({
  enlaces: document.querySelectorAll("a.m-link").length,
  crudo: (document.body.innerText.match(/\]\(http|dec\s*\(/g) || []).length,
  matriz: document.querySelectorAll("table").length,
  largo: document.body.innerText.length,
}));
console.log(JSON.stringify(r));
await p.screenshot({ path: png });
await b.close();
