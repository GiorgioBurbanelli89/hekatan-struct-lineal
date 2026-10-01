import puppeteer from "puppeteer";
const URL = `${process.argv[2]}/workspace/?t=muro-manabi&p=` + Buffer.from(JSON.stringify({ modelo: 1, L: 1, ms: 0.1, cf: 0, caso: 0, lat: 0, apoyos: 1 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
console.log(await pag.evaluate(() => { const c = window.__hekatanCorte; if (!c) return "sin panel"; c.params.eje = 2; c.params.pos = 0.25; c.calcular(); return c.params.info; }));
console.log("errores", err.length, err.slice(0, 2));
await nav.close();
