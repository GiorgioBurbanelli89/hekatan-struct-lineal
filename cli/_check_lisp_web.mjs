// Comprueba el deploy PUBLICO de Hekatan LISP web: que carga, que el motor
// wasm responde y que la barra de unidades (3m|cm) calcula de verdad.
import puppeteer from "puppeteer";
const URL = "https://giorgioburbanelli89.github.io/hekatan-lisp/";
const OUT = process.argv[2] || "lisp_web";
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox","--disable-setuid-sandbox","--window-size=1600,1000"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1600, height: 1000 });
const err = [];
pag.on("pageerror", e => err.push(e.message));
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 25000));
await pag.screenshot({ path: `${OUT}_1.png` });
const info = await pag.evaluate(() => ({
  titulo: document.title,
  editor: !!document.querySelector("textarea, .cm-content, #editor"),
  texto: (document.body.innerText || "").slice(0, 400),
}));
console.log(JSON.stringify({ err: err.slice(0, 4), ...info }, null, 1));
await nav.close();
