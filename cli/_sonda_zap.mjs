import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "sonda"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4779;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
let srv = null;
if (!PUB) {
  srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(raiz, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => srv.listen(PUERTO, r));
}
const URL_ = PUB
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/"
  : `http://localhost:${PUERTO}${BASE}workspace/`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(6000);



await pag.evaluate(() => [...document.querySelectorAll("button, .tp-btnv_b, a.card")].find((x) => x.offsetParent !== null && x.textContent.includes("Ejemplos")).click());
await espera(5000);
const ops = () => pag.evaluate(() => {
  const r = {};
  for (const et of ["Categoría", "Ejemplo"]) {
    const f = [...document.querySelectorAll(".tp-lblv")].filter((x) => x.offsetParent !== null).find((x) => (x.querySelector(".tp-lblv_l")?.textContent || "").includes(et));
    r[et] = f ? [...f.querySelector("select").options].map((o) => o.textContent.trim() + " = " + o.value) : null;
  }
  return r;
});

const sel = async (et, t) => pag.evaluate((q) => {
  const f = [...document.querySelectorAll(".tp-lblv")].filter((x) => x.offsetParent !== null).find((x) => (x.querySelector(".tp-lblv_l")?.textContent || "").includes(q.et));
  const s = f.querySelector("select"); const n = (x) => x.replace(/\s+/g, " ").trim();
  const o = [...s.options].find((o) => n(o.textContent).includes(q.t)); s.value = o.value; s.dispatchEvent(new Event("change", { bubbles: true }));
}, { et, t });
await sel("Categoría", "Cimentaciones (4"); await espera(3000);
await sel("Ejemplo", "Zapata Aislada (Ecuador"); await espera(7000);
console.log(JSON.stringify(await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")]
  .filter((x) => /Lz|Bz|Tipo de suelo|P \(tonf\)/.test(x.querySelector(".tp-lblv_l")?.textContent || ""))
  .map((x) => ({ l: x.querySelector(".tp-lblv_l").textContent.trim(), vis: x.offsetParent !== null, h: Math.round(x.getBoundingClientRect().height),
    host: x.closest("#hk-pane-host") ? "pane" : x.closest("#settings") ? "settings" : "otro",
    inputs: [...x.querySelectorAll("input,select")].map((i) => i.tagName + ":" + i.type + ":" + i.className + ":" + (i.offsetParent !== null)) }))), null, 1));
await nav.close(); srv?.close();
