import puppeteer from "puppeteer";
const [url, tag] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 900 });
const errs = []; p.on("pageerror", e => errs.push(String(e).slice(0, 150))); p.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0, 150)); });
const W = (ms) => new Promise(r => setTimeout(r, ms));
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 }); await W(4000);
await p.screenshot({ path: `${process.env.TEMP}/muro_${tag}_1_inicio.png` });
// pushover completo
await p.evaluate(() => document.getElementById("pushPlay")?.click()); await W(15000);
const st1 = await p.evaluate(() => document.getElementById("status")?.innerText?.slice(0, 200));
await p.screenshot({ path: `${process.env.TEMP}/muro_${tag}_2_pushover.png` });
// sismico no lineal + El Centro + histeresis
await p.select("#analysis", "dinnl"); await W(8000);
await p.evaluate(() => document.getElementById("recElc")?.click()); await W(12000);
await p.evaluate(() => document.querySelector('[data-seis="histeresis"]')?.click()); await W(4000);
const st2 = await p.evaluate(() => document.getElementById("status")?.innerText?.slice(0, 200));
await p.screenshot({ path: `${process.env.TEMP}/muro_${tag}_3_histeresis.png` });
console.log(tag, "| pushover:", st1, "| sismo:", st2, "| errores:", errs.length, errs.slice(0, 4).join(" || "));
await b.close();
