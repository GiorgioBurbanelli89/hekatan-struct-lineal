import puppeteer from "puppeteer";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 }); const err = []; pag.on("pageerror", (e) => err.push(String(e)));
const P = Buffer.from(JSON.stringify({ tipo: 0, nx: 3, pisos: 3, sx: 5, offsets: 0 })).toString("base64");
await pag.goto(`${BASE}/workspace/?t=plantillas&p=${P}`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 9000));
const info = await pag.evaluate(() => { const s = window.__hekatanEstacionario; s.params.tipo = 1; s.params.carga = 1; s.params.f1 = 0.2; s.params.f2 = 15; s.calcular(); return s.params.info; });
await new Promise((r) => setTimeout(r, 1500)); await pag.screenshot({ path: "cli/shots/ss/03_psd.png" });
console.log(JSON.stringify({ info, err })); await nav.close();
