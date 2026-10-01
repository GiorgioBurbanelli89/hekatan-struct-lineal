import puppeteer from "puppeteer";
const URL = `${process.argv[2]}/workspace/?t=muro-manabi&p=eyJtb2RlbG8iOjEsImNmIjoxLCJMIjozLCJzQ2YiOjEuNSwibXMiOjAuMTV9`;
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
const prueba = (on) => pag.evaluate((on) => new Promise((ok) => {
  window.__hekatanHoverPrefs.kAreas.val = on;
  window.dispatchEvent(new CustomEvent("hk:hover", { detail: { type: "shell", idx: 20, x: 700, y: 400 } }));
  setTimeout(() => { const a = window.__hkKLocalHover?.abierta?.(); window.dispatchEvent(new CustomEvent("hk:hover", { detail: null })); ok({ api: !!window.__hkKLocalHover, abierta: a }); }, 1200);
}), on);
console.log("K áreas encendida:", JSON.stringify(await prueba(true)));
await new Promise((r) => setTimeout(r, 1500));
console.log("K áreas apagada:", JSON.stringify(await prueba(false)));
await pag.evaluate(() => { window.__hekatanHoverPrefs.kAreas.val = true; });
await nav.close();
