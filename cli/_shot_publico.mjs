// La ventana POR DEFECTO del deploy publico, tal cual la ve quien entra por
// primera vez: sin ?t=, sin tocar nada. Y el inventario de sus partes.
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "publico"); mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise(r => setTimeout(r, ms));
const URL = process.argv[2] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox",
  "--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const errs = []; pag.on("pageerror", e => errs.push(e.message));
console.log("abriendo", URL);
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await espera(12000);
await pag.screenshot({ path: join(OUT, "defecto.png") });

// las partes: todo lo que ocupa sitio y se ve
const partes = await pag.evaluate(() => {
  const vis = (e) => { const r = e.getBoundingClientRect();
    return e.offsetParent !== null && r.width > 40 && r.height > 14; };
  const cajas = [];
  document.querySelectorAll("body *").forEach((e) => {
    if (!vis(e)) return;
    const r = e.getBoundingClientRect();
    const id = e.id, cls = (e.className || "").toString();
    if (!id && !/tp-rotv|tp-fldv_t|legend|toolbar|ribbon/.test(cls)) return;
    cajas.push({ id, cls: cls.slice(0, 34), x: Math.round(r.x), y: Math.round(r.y),
                 w: Math.round(r.width), h: Math.round(r.height),
                 txt: (e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60) });
  });
  return {
    cajas: cajas.filter(c => c.w > 60 && c.h > 18).slice(0, 40),
    carpetas: Array.from(document.querySelectorAll(".tp-fldv_t")).map(f => f.textContent.trim()),
    ejemplo: (document.querySelector(".tp-rotv_t") || {}).textContent,
    titulo: document.title,
  };
});
console.log("titulo:", partes.titulo, "· ejemplo por defecto:", partes.ejemplo);
console.log("carpetas:", partes.carpetas.length);
console.log(JSON.stringify(partes.cajas, null, 1).slice(0, 3000));
writeFileSync(join(OUT, "partes.json"), JSON.stringify(partes, null, 1));
console.log("errores:", errs.length);
await nav.close();
