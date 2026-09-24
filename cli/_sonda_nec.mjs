// Sonda de 2 min: ¿existen en el bundle LOCAL los mandos que va a tocar el tutorial NEC?
// No graba nada: solo dice si cada etiqueta/botón está y dónde.
//   node cli/_sonda_nec.mjs
import puppeteer from "puppeteer";
import { createServer } from "http";
import { existsSync, statSync, readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise(r => srv.listen(4781, r));
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const espera = ms => new Promise(r => setTimeout(r, ms));
await pag.goto("http://localhost:4781" + BASE + "workspace/?t=test-m-dual", { waitUntil: "networkidle2", timeout: 180000 }).catch(e => console.log("goto:", String(e).slice(0,70)));
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(9000);

const inv = async () => pag.evaluate(() => {
  const filas = [...document.querySelectorAll(".tp-lblv")].map(e =>
    (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim()).filter(Boolean);
  const carpetas = [...document.querySelectorAll(".tp-fldv_b, .tp-fldv_t")].map(e => (e.textContent||"").trim()).filter(Boolean);
  const botones = [...document.querySelectorAll("button")].map(e => (e.innerText||"").trim()).filter(Boolean);
  return { filas, carpetas, botones };
});
const i0 = await inv();
console.log("CARPETAS:", JSON.stringify(i0.carpetas));
console.log("FILAS:", JSON.stringify(i0.filas));
console.log("BOTONES:", JSON.stringify(i0.botones));

// abrir la carpeta «Sísmico NEC» y volver a mirar
const abre = (t) => pag.evaluate((t) => {
  const f = [...document.querySelectorAll(".tp-fldv")].find(e =>
    (e.querySelector(".tp-fldv_b, .tp-fldv_t")?.textContent || "").includes(t));
  if (!f) return "NO ESTA";
  const b = f.querySelector(".tp-fldv_b, .tp-fldv_t");
  if (f.classList.contains("tp-fldv-expanded")) return "ya abierta";
  b.click(); return "abierta";
}, t);
console.log("Sísmico NEC ->", await abre("Sísmico NEC"));
await espera(1500);
const i1 = await inv();
console.log("FILAS tras abrir NEC:", JSON.stringify(i1.filas.filter(f => /NEC|Normativa|Irregular|ASCE/.test(f))));
mkdirSync(join(__dirname, "shots"), { recursive: true });
await pag.screenshot({ path: join(__dirname, "shots", "_sonda_nec_1.png") });

// correr modal y ver qué filas/botones aparecen
console.log("corriendo modal...");
await pag.evaluate(() => window.__hekatanRunModalAnimate?.());
await espera(80000);
const i2 = await inv();
console.log("FILAS tras modal:", JSON.stringify(i2.filas));
console.log("BOTONES tras modal:", JSON.stringify(i2.botones.filter(b => b.length < 60)));
const modo = await pag.evaluate(() => {
  const f = [...document.querySelectorAll(".tp-lblv")].find(e => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() === "Modo");
  const s = f?.querySelector("select");
  return s ? [...s.options].map(o => o.textContent.trim()).slice(0, 5) : null;
});
console.log("opciones de Modo:", JSON.stringify(modo));
const panel = await pag.evaluate(() => (document.getElementById("modal-results")?.innerText || "").slice(0, 3000));
console.log("--- panel modal ---\n" + panel);
await pag.screenshot({ path: join(__dirname, "shots", "_sonda_nec_2.png") });
await nav.close(); srv.close();
console.log("FIN SONDA");
