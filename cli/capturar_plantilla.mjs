#!/usr/bin/env node
/**
 * Captura la plantilla de interfaz CUADRO A CUADRO, a demanda.
 *
 *   node capturar.mjs [escena.html] [salida/]
 *
 * La clave está en que aquí NO hay tiempo real. Se llama a `window.__paso(i)`,
 * se espera a que el navegador haya pintado ese cuadro, y se guarda. Si la
 * máquina va lenta, tarda más — pero no se pierde ni un cuadro. Grabando la
 * pantalla en vivo pasaba lo contrario: de once balizas metidas a propósito en
 * la grabación solo se recogieron siete.
 */
import puppeteer from "puppeteer";
import { mkdirSync, readdirSync, unlinkSync, existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML = resolve(process.argv[2] || join(__dirname, "escena.html"));
const OUT = resolve(process.argv[3] || join(__dirname, "cuadros"));
mkdirSync(OUT, { recursive: true });
if (existsSync(OUT)) for (const f of readdirSync(OUT)) if (f.endsWith(".png")) unlinkSync(join(OUT, f));

const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
const errs = [];
pag.on("pageerror", (e) => errs.push(e.message));
pag.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });

await pag.goto(pathToFileURL(HTML).href, { waitUntil: "networkidle0", timeout: 60000 });
// las dos imagenes de fondo tienen que estar CARGADAS antes de empezar: si no,
// los primeros cuadros salen en blanco y no se nota hasta ver el video
await pag.evaluate(async () => {
  const cargar = (src) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = src; });
  await Promise.all(["app.png", "app_vacia.png"].map(cargar));
});

const n = await pag.evaluate(() => window.__n);
const fps = await pag.evaluate(() => window.__fps);
console.log(`${n} cuadros a ${fps} fps = ${(n / fps).toFixed(1)} s`);

for (let i = 0; i < n; i++) {
  await pag.evaluate((i) => window.__paso(i), i);
  // esperar a que el navegador PINTE: sin esto se guarda el cuadro anterior
  await pag.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await pag.screenshot({ path: join(OUT, "c" + String(i).padStart(5, "0") + ".png") });
  if (i % 60 === 0) process.stdout.write(String.fromCharCode(13) + "  " + i + "/" + n);
}
process.stdout.write(String.fromCharCode(10));
console.log("errores:", errs.length, errs.slice(0, 3).join(" | "));
console.log("->", OUT);
await nav.close();
