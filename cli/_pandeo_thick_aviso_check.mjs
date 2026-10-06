// Aviso Shell-Thick del panel ⟂ Pandeo en el sitio (6-oct-2026): abre un ejemplo de cáscara GRUESA, calcula y lee el texto.
//   node cli/_pandeo_thick_aviso_check.mjs [BASE] [id]
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const ID = process.argv[3] ?? "shell-thick";
mkdirSync("cli/shots/pandeo_cascara", { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
await pag.goto(`${BASE}/workspace/?t=${ID}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const info = await pag.evaluate(() => { const h = window.__hekatanPandeo; if (!h) return "sin panel"; h.calcular(); return h.params.info; });
await pag.screenshot({ path: `cli/shots/pandeo_cascara/aviso_thick_${ID}.png` });
console.log(JSON.stringify({ id: ID, info, errores }, null, 1));
await nav.close();
