/**
 * ¿SE PUEDE BORRAR UNA BARRA O UN PAÑO DE UNA PLANTILLA YA HECHA?
 * (Jorge: «falta eliminar barras, un paño… si quisiera un pórtico irregular de una
 *  plantilla ya hecha»). Diagnóstico: mide qué pasa hoy, no arregla nada.
 *   node cli/_borrar_en_plantilla.mjs [id]
 */
import puppeteer from "puppeteer";
import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "borrar_plantilla"); fs.mkdirSync(OUT, { recursive: true });
const ID = process.argv[2] || "edificio-aporticado";
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((q, r) => { let p = decodeURIComponent((q.url||"/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length-1); let f = join(raiz, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end("404"); }
  r.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
await new Promise((r) => srv.listen(4791, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0,160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
await pag.goto(`http://localhost:4791${BASE}workspace/?t=${ID}`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(8000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

const estado = () => pag.evaluate(() => {
  const v = document.querySelector("#viewer");
  const m = window.__hekatanMesh ?? v?.__mesh ?? null;
  return {
    dibujoNudos: (window.__hekatanDrawingPoints?.rawVal ?? []).length,
    dibujoTramos: (window.__hekatanDrawingPolylines?.rawVal ?? []).reduce((s,p)=>s+Math.max(0,p.length-1),0),
    dibujoAreas: (window.__hekatanDrawingAreas?.rawVal ?? []).length,
    meshNudos: m?.nodes?.rawVal?.length ?? null,
    meshElem: m?.elements?.rawVal?.length ?? null,
    hayBorrar: typeof window.__hekatanBorrarSeleccion === "function",
    seleccion: window.__hekatanSelection?.size ?? null,
  };
});
console.log(`PLANTILLA «${ID}»`);
const e0 = await estado(); console.log("  al cargar        : " + JSON.stringify(e0));

// intentar designar una barra: clic en el centro de la pantalla sobre el modelo
await pag.evaluate(() => window.__hekatanCadState?.setTool?.("select"));
await esp(400);
const puntos = [[700,430],[700,470],[660,450],[740,450],[700,520]];
let sel = 0;
for (const [x,y] of puntos) {
  await pag.mouse.move(x,y); await esp(180); await pag.mouse.click(x,y); await esp(400);
  sel = await pag.evaluate(() => window.__hekatanSelection?.size ?? 0);
  if (sel > 0) { console.log(`  designado con clic en (${x},${y}): ${sel} objeto(s)`); break; }
}
if (!sel) console.log("  NO se pudo designar nada con el raton sobre la plantilla");
const claves = await pag.evaluate(() => [...(window.__hekatanSelection ?? [])].slice(0,4));
console.log("  claves de seleccion: " + JSON.stringify(claves));

// probar Supr y el botón Borrar
await pag.keyboard.press("Delete"); await esp(900);
const e1 = await estado(); console.log("  tras Supr        : " + JSON.stringify(e1));
const bBorrar = await pag.evaluate(() => { const b=[...document.querySelectorAll("#hk-ribbon button")]
  .find(e=>/Borrar/.test(e.textContent||"")); if(!b) return null; const r=b.getBoundingClientRect();
  return {x:r.left+r.width/2,y:r.top+r.height/2}; });
if (bBorrar) { await pag.mouse.click(bBorrar.x,bBorrar.y); await esp(500);
  for (const [x,y] of puntos) { await pag.mouse.move(x,y); await esp(200); await pag.mouse.click(x,y); await esp(500); } }
const e2 = await estado(); console.log("  tras boton Borrar: " + JSON.stringify(e2));
await pag.screenshot({ path: join(OUT, `${ID}.png`) });
console.log("  pageerror: " + err.length + " " + JSON.stringify(err.slice(0,2)));
await nav.close(); srv.close();
