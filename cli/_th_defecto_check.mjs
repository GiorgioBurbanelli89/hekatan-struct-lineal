import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); const err = []; pag.on("pageerror", (e) => err.push(String(e)));
await pag.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 6000));
console.log(await pag.evaluate(() => { const th = window.__hekatanTiempoHistoria; return th.params.registro + " | " + th.params.info; }));
await pag.evaluate(() => window.__hekatanTiempoHistoria.correr()); await new Promise((r) => setTimeout(r, 3000));
console.log(await pag.evaluate(() => window.__hekatanTiempoHistoria.params.info)); console.log("errores", err.length); await nav.close();
