import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
const errs = []; p.on("pageerror", e => errs.push(e.message));
await p.goto("https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej1-zapata-cuadrada", { waitUntil: "domcontentloaded", timeout: 120000 });
await new Promise(r => setTimeout(r, 20000));
await p.screenshot({ path: "cli/shots/guerra_video_ej1_publico.png" });
console.log(JSON.stringify({ errs: errs.slice(0, 3) }));
await nav.close();
