// Qué pinta Hekatan alrededor del cursor mientras se dibuja, y de qué tamaño.
//   node cli/_dom_cursor.mjs
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "cursor"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4742, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto(`http://localhost:4742${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

// dibujar una línea y quedarse estirando la goma
await pag.focus("#hk3-cmd-input");
await pag.type("#hk3-cmd-input", "l", { delay: 15 });
await pag.keyboard.press("Enter"); await espera(500);
await pag.mouse.move(560, 430); await espera(300);
await pag.mouse.click(560, 430); await espera(400);
await pag.mouse.move(760, 500); await espera(500);

const info = await pag.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("body > *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.width > 400) continue;
    out.push({ id: el.id || "(sin id)", tag: el.tagName,
      w: +r.width.toFixed(1), h: +r.height.toFixed(1),
      x: +r.x.toFixed(0), y: +r.y.toFixed(0), font: cs.fontSize, z: cs.zIndex });
  }
  const cv = document.querySelector("#viewer canvas");
  return { flotantes: out, cursorCss: cv ? getComputedStyle(cv).cursor : null };
});
console.log("cursor CSS del lienzo:", info.cursorCss);
console.log("elementos flotantes cerca del cursor (960,500 aprox):");
for (const e of info.flotantes) console.log(`   ${e.id.padEnd(20)} ${e.tag.padEnd(6)} ${String(e.w).padStart(6)}x${String(e.h).padEnd(6)} @(${e.x},${e.y}) font ${e.font} z ${e.z}`);
await pag.screenshot({ path: join(OUT, "cursor_dibujando.png") });
console.log("->", join(OUT, "cursor_dibujando.png"));
await nav.close(); srv.close();
