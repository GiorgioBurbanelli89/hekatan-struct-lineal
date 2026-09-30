// Abre el ENLACE del tiempo-historia (?th=elcentro…&thr=1) y lee el resultado del panel. node cli/_th_enlace_check.mjs <url> <png>
import puppeteer from "puppeteer";
const [URL, PNG] = process.argv.slice(2);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 12000));
console.log(await pag.evaluate(() => window.__hekatanTiempoHistoria?.params?.info));
console.log("errores", err.length, err.slice(0, 2));
await pag.screenshot({ path: PNG }); await nav.close();
