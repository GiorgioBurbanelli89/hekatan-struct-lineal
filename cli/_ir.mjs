// Lleva el navegador VIVO a una URL y guarda un fotograma.  node cli/_ir.mjs <url> [nombre]
import puppeteer from "puppeteer";
const b = await puppeteer.connect({ browserURL: "http://localhost:9222", defaultViewport: null });
const p = (await b.pages()).find(x => !x.url().startsWith("devtools")) ?? (await b.newPage());
const errs = []; p.on("pageerror", e => errs.push(String(e).slice(0,160)));
await p.bringToFront();
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, +(process.argv[4] ?? 12000)));
const n = process.argv[3] ?? "vivo";
await p.screenshot({ path: `cli/shots/en_vivo/${n}.png` });
console.log(n, "errores:", errs.slice(0,3));
b.disconnect();
