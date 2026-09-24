/**
 * EL MENÚ DEL CLIC DERECHO (estilo Assign de ETABS): ¿abre lo que dice?
 *
 * Jorge, 17-sep-2026: «revísame qué sucedió con este menú, no funciona, parece que
 * se descontinuó».
 *
 * Se abre el menú con el botón derecho sobre el modelo y se pulsa CADA entrada,
 * comprobando después si quedó abierta alguna carpeta del panel. Una entrada que
 * no abre nada es una entrada muerta, y hay que verlo entrada por entrada, no «el
 * menú funciona».
 *
 *   node cli/_menu_contextual.mjs [id_ejemplo]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "menu_contextual");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const ID = process.argv[2] || "edificio-aporticado";
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => srv.listen(4877, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 140)));
const avisos = [];
pag.on("console", (m) => { if (/\[menu\]/.test(m.text())) avisos.push(m.text().slice(0, 120)); });
const esp = (m) => new Promise((r) => setTimeout(r, m));

await pag.goto(`http://localhost:4877${BASE}workspace/?t=${ID}`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(9000);

const centro = await pag.evaluate(() => {
  const r = document.querySelector("#viewer canvas").getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});

/** Abre el menú con el derecho y devuelve sus entradas. */
const abrirMenu = async () => {
  await pag.mouse.move(centro.x, centro.y); await esp(150);
  await pag.mouse.click(centro.x, centro.y, { button: "right" }); await esp(500);
  return pag.evaluate(() => {
    const m = [...document.querySelectorAll("div")].find((d) =>
      d.style.position === "fixed" && d.style.display === "block" &&
      /FRAME|AREA/.test(d.textContent || ""));
    if (!m) return null;
    return { entradas: [...m.children].map((c) => (c.textContent || "").trim()).filter(Boolean) };
  });
};

const m0 = await abrirMenu();
console.log(m0 ? `   el menú abre con ${m0.entradas.length} entradas` : "   EL MENÚ NO ABRE");
if (!m0) { console.log("   pageerror:", err.slice(0, 3)); await nav.close(); srv.close(); process.exit(1); }
await pag.screenshot({ path: join(OUT, "00_menu.png") });

/** Qué carpetas del panel están abiertas ahora mismo. */
const abiertas = () => pag.evaluate(() =>
  [...document.querySelectorAll(".tp-fldv")]
    .filter((f) => !f.classList.contains("tp-fldv-expanded") === false)
    .map((f) => (f.querySelector(".tp-fldv_t")?.textContent || "").trim())
    .filter(Boolean));

let muertas = 0, vivas = 0;
for (const texto of m0.entradas) {
  if (/^(FRAME|AREA)/.test(texto) || !texto) continue;
  avisos.length = 0;
  const hay = await abrirMenu();
  if (!hay) { console.log(`  --  «${texto}»: el menú ya no abre`); muertas++; continue; }
  const ok = await pag.evaluate((t) => {
    const m = [...document.querySelectorAll("div")].find((d) =>
      d.style.position === "fixed" && d.style.display === "block" && /FRAME|AREA/.test(d.textContent || ""));
    const it = [...(m?.children ?? [])].find((c) => (c.textContent || "").trim() === t);
    if (!it) return false;
    it.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    return true;
  }, texto);
  await esp(700);
  const ab = await abiertas();
  // ⚠️ Algunas entradas ABREN UNA VENTANA encima del lienzo (el diagrama 2D de
  // «Frame Forces»). Si no se cierra, el siguiente clic derecho cae en esa
  // ventana y no en el visor: el test daba «el menú ya no abre» para todas las
  // entradas siguientes, y eso es un fallo del test, no de la app.
  await pag.evaluate(() => {
    for (const sel of ["#hk-diagrama2d", "#hk-klocal", "#hk-diag2d"]) {
      const e = document.querySelector(sel);
      if (e) { e.hidden = true; e.style.display = "none"; }
    }
    document.querySelectorAll("div").forEach((d) => {
      if (d.style.position === "fixed" && +d.style.zIndex > 9000 &&
          /Diagrama|K local/i.test(d.textContent || "")) d.style.display = "none";
    });
  });
  await esp(250);
  const fallo = avisos.some((a) => /no encontre la carpeta/.test(a));
  if (!ok || fallo || ab.length === 0) {
    muertas++;
    console.log(`  --  «${texto}»  →  ${fallo ? avisos.find((a) => /no encontre/.test(a)) : "no abrió ninguna carpeta"}`);
  } else {
    vivas++;
    console.log(`  OK  «${texto}»  →  abre: ${ab.slice(0, 3).join(" · ")}`);
  }
}
await pag.screenshot({ path: join(OUT, "01_final.png") });
console.log(`\n   ${vivas} entradas vivas · ${muertas} muertas`);
console.log("   pageerror:", err.length, err.slice(0, 2));
await nav.close(); srv.close();
process.exit(muertas ? 1 : 0);
