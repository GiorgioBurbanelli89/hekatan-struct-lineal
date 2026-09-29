/**
 * Pinta una hoja de Hekatan LISP con el motor WEB (el mismo que abre Struct en su hoja) y
 * guarda el PNG y los errores de consola. Para MIRAR lo que ve el usuario, no el texto.
 *
 *   node cli/_hoja_lisp_png.mjs hoja.txt salida.png [ancho]
 */
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";

const [, , entrada, salida, anchoTxt] = process.argv;
const codigo = readFileSync(entrada, "utf-8");
const h = deflateRawSync(Buffer.from(codigo, "utf-8")).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const url = "https://giorgioburbanelli89.github.io/hekatan-lisp/#h=" + h + "&solo=1&embed=1";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await nav.newPage();
await p.setViewport({ width: Number(anchoTxt) || 900, height: Number(process.env.ALTO) || 900 });
const errores = [];
p.on("pageerror", (e) => errores.push("pageerror: " + e.message));
p.on("console", (m) => { if (m.type() === "error") errores.push("console: " + m.text()); });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
await p.screenshot({ path: salida, fullPage: true });
const texto = await p.evaluate(() => document.body.innerText);
writeFileSync(salida.replace(/\.png$/, ".txt"), texto);
writeFileSync(salida.replace(/\.png$/, ".errores.txt"), errores.join("\n") || "0 errores");
console.log(`${salida} · ${errores.length} errores · url ${url.length} caracteres`);
await nav.close();
