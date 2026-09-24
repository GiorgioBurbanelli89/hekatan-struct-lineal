#!/usr/bin/env node
/**
 * Foto de la DEFORMADA de varios ejemplos, para mirarla.
 *
 *   node cli/shot_deformadas.mjs id1,id2,id3
 *
 * Abre el bundle compilado, carga cada ejemplo, enciende "Deformed shape" y
 * saca un PNG del canvas. Mirar el .ts no dice si la deformada se DIBUJA bien:
 * eso solo se ve en la imagen.
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "deformadas"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml",
  ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4702, r));

const IDS = (process.argv[2] || "portico-2d").split(",").map(s => s.trim()).filter(Boolean);
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox","--disable-setuid-sandbox","--enable-unsafe-swiftshader",
         "--use-angle=swiftshader","--window-size=1400,900"] });
const resumen = [];
for (const id of IDS) {
  const pag = await nav.newPage();
  await pag.setViewport({ width: 1400, height: 900 });
  const errores = [];
  pag.on("pageerror", (e) => errores.push(e.message));
  try {
    await pag.goto(`http://localhost:4702${BASE}workspace/?t=${id}`,
                   { waitUntil: "networkidle2", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 7000));
    // encender la deformada por el checkbox de Settings, buscandolo por texto
    const enc = await pag.evaluate(() => {
      const filas = Array.from(document.querySelectorAll(".tp-lblv"));
      const f = filas.find((x) => /Deformed shape|Deformada/i.test(x.textContent || ""));
      if (!f) return "no esta el toggle";
      const chk = f.querySelector("input[type=checkbox]");
      if (!chk) return "sin checkbox";
      if (!chk.checked) chk.click();
      return chk.checked ? "encendida" : "no se pudo";
    });
    await new Promise((r) => setTimeout(r, 2500));
    await pag.screenshot({ path: join(OUT, `${id}.png`) });
    resumen.push(`${id.padEnd(38)} ${enc}   errores JS: ${errores.length}`);
  } catch (e) {
    resumen.push(`${id.padEnd(38)} FALLO: ${String(e.message).slice(0, 60)}`);
  }
  await pag.close();
}
writeFileSync(join(OUT, "_resumen.txt"), resumen.join("\n"), "utf-8");
for (const r of resumen) console.log("  " + r);
console.log(`\n-> ${OUT}`);
await nav.close(); srv.close();
