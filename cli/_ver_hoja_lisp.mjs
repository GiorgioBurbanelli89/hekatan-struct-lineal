// Abre una hoja de Hekatan LISP por enlace, espera al motor y guarda PNG + errores.
//   node cli/_ver_hoja_lisp.mjs "<url>" salida.png
import puppeteer from "puppeteer";
const [url, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1100, height: +(process.argv[4] ?? 1400) });
const errs = [], cons = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
p.on("console", (m) => { if (m.type() === "error") cons.push(m.text().slice(0, 160)); });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 25000));            // el WASM del motor tarda
const info = await p.evaluate(() => {
  const s = document.querySelector(".salida") || document.body;
  return {
    imgs: s.querySelectorAll("img,canvas,svg").length,
    tablas: s.querySelectorAll("table").length,
    txt: (s.innerText || "").replace(/\s+/g, " ").slice(0, 700),
  };
});
await p.screenshot({ path: png, fullPage: true });
console.log("graficas/canvas:", info.imgs, "| tablas:", info.tablas);
console.log("errores JS:", errs.slice(0, 3), "| consola:", cons.slice(0, 3));
console.log("texto:", info.txt);
await b.close();
