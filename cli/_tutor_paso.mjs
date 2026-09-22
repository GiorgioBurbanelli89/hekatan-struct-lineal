import puppeteer from "puppeteer";
const [id, paso, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs=[]; p.on("pageerror", e => errs.push(String(e).slice(0,200)));
await p.goto(`http://localhost:4600/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 12000));
await p.evaluate(() => window.__hekatanTutorTest(false));
for (let k = 1; k < +paso; k++) { await new Promise(r => setTimeout(r, 1500)); await p.evaluate(() => document.querySelector("[data-sig]").click()); }
await new Promise(r => setTimeout(r, +(process.env.ESPERA || 9000)));
await p.screenshot({ path: png }); console.log("errores", errs); await b.close();
