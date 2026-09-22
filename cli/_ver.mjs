// Abre un navegador VISIBLE (no oculto) en una URL de Hekatan y lo deja abierto, para que se vea
// lo que se está revisando (Jorge, 22-sep-2026: «vas a poner en primer plano todo lo que hagas»).
// Cada N segundos guarda un fotograma, así queda constancia de lo que se veía.
//   node cli/_ver.mjs "http://localhost:4600/workspace/?t=solid-cube-fem" cli/shots/en_vivo 600
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const [url, dir = "cli/shots/en_vivo", segs = "600"] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const b = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ["--no-sandbox", "--start-maximized", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"],
});
const p = (await b.pages())[0] ?? (await b.newPage());
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
p.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 200)); });
await p.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
console.log("abierto:", url);

let k = 0;
const t0 = Date.now();
while (Date.now() - t0 < +segs * 1000) {
  await new Promise((r) => setTimeout(r, 15000));
  await p.screenshot({ path: `${dir}/v_${String(++k).padStart(3, "0")}.png` });
  if (errs.length) { console.log("ERRORES:", errs.splice(0, 5)); }
}
console.log("fin, fotogramas:", k);
await b.close();
