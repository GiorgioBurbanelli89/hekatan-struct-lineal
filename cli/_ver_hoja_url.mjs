// Igual que _ver_hoja_lisp pero leyendo la URL de un fichero (las urls con #h=
// son larguisimas y por la linea de ordenes se rompen).
import puppeteer from "puppeteer";
import fs from "fs";
const url = fs.readFileSync(process.argv[2], "utf8").trim();
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1100, height: +(process.argv[4] ?? 1200) });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 26000));
await p.screenshot({ path: process.argv[3] });
console.log("errores:", errs.slice(0, 2));
console.log("texto:", await p.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " ").slice(120, 700)));
await b.close();
