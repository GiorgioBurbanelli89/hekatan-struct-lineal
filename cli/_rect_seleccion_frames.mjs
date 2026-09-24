/**
 * ¿SE PINTA EL RECTÁNGULO AL ARRASTRAR? — fotograma a fotograma, sin tocar nada.
 *
 * Jorge, 17-sep-2026: «al hacer click de izquierda a derecha no se resalta ningún
 * rectángulo igual que AutoCAD».
 *
 * AutoCAD, con PICKAUTO = 5 y PICKFIRST = 1:
 *   · izq→der = Window   → recuadro AZUL de línea CONTINUA
 *   · der→izq = Crossing → recuadro VERDE de línea DISCONTINUA
 * y el recuadro se ve MIENTRAS se arrastra, no solo al soltar.
 *
 * Aquí se mide, en medio del arrastre: ¿existe el elemento del recuadro en el DOM?
 * ¿tiene tamaño? ¿de qué color? ¿y se ve en el píxel del canvas?
 *
 *   node cli/_rect_seleccion_frames.mjs [id_ejemplo]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "rect_seleccion");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const ID = process.argv[2] || "new-blank";
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
await new Promise((r) => srv.listen(4867, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };
let n = 0;
const foto = async (t) => { await esp(80); await pag.screenshot({ path: join(OUT, `${String(n++).padStart(2, "0")}_${t}.png`) }); };

await pag.goto(`http://localhost:4867${BASE}workspace/?t=${ID}`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(8000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

// tres barras para tener algo que designar
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(0, 0, 0); c.position.set(0, 0, 60);
  c.up.set(0, 1, 0); c.lookAt(0, 0, 0); v.__ctx.controls.update?.(); v.__ctx.render?.();
  window.__hekatanDrawingPoints.val = [[-8, 4, 0], [8, 4, 0], [-1, 0, 0], [1, 0, 0], [-8, -4, 0], [8, -4, 0]];
  window.__hekatanDrawingPolylines.val = [[0, 1], [2, 3], [4, 5]];
  window.__hekatanRebuild?.();
});
await esp(1800);
// ⚠️ La herramienta se pone SOLO si se pide por argumento. Por defecto se prueba
// SIN herramienta activa, que es como llega el usuario tras dibujar o tras Esc —
// y en AutoCAD arrastrar sobre el vacío sin ninguna orden es justo lo que abre la
// ventana de designación.
const CON_SELECT = process.argv.includes("--select");
if (CON_SELECT) await pag.evaluate(() => window.__hekatanCadState?.setTool?.("select"));
else await pag.keyboard.press("Escape");
await esp(500);
console.log("   herramienta activa:", await pag.evaluate(() =>
  window.__hekatanCadState?.tool?.val ?? window.__hekatanCadState?.getTool?.() ?? "(ninguna)"));
await foto("modelo");

/** ¿Qué hay pintado como recuadro de designación AHORA MISMO?
 *  ⚠️ Se busca el elemento POR SU ID (`hk-window-select`). La primera versión
 *  filtraba por /selection|seleccion|rect/ y no casaba con «select»: daba
 *  «no hay nada pintado» con el recuadro delante. Un filtro mal escrito es un
 *  fallo inventado. */
const recuadro = () => pag.evaluate(() => {
  const e = document.getElementById("hk-window-select");
  if (!e) return null;
  const r = e.getBoundingClientRect(), s = getComputedStyle(e);
  const visible = s.display !== "none" && s.visibility !== "hidden" && +s.opacity > 0;
  return { w: Math.round(r.width), h: Math.round(r.height), visible,
           borde: `${s.borderColor} ${s.borderStyle} ${s.borderWidth}`, fondo: s.backgroundColor,
           z: s.zIndex, tapado: (() => {
             const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
             const top = document.elementFromPoint(cx, cy);
             return top ? (top.id || top.tagName) : "?";
           })() };
});
const centroCanvas = await pag.evaluate(() => {
  const r = document.querySelector("#viewer canvas").getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});

const arrastre = async (nombre, dx1, dy1, dx2, dy2) => {
  await pag.keyboard.press("Escape"); await esp(250);
  const a = { x: centroCanvas.x + dx1, y: centroCanvas.y + dy1 };
  const b = { x: centroCanvas.x + dx2, y: centroCanvas.y + dy2 };
  await pag.mouse.move(a.x, a.y, { steps: 3 }); await esp(200);
  await pag.mouse.down();
  // A MITAD del arrastre es donde tiene que verse el recuadro
  await pag.mouse.move((a.x + b.x) / 2, (a.y + b.y) / 2, { steps: 6 }); await esp(250);
  const medio = await recuadro();
  await foto(nombre + "_a_mitad");
  await pag.mouse.move(b.x, b.y, { steps: 6 }); await esp(250);
  const final = await recuadro();
  await foto(nombre + "_antes_de_soltar");
  await pag.mouse.up(); await esp(600);
  const sel = await pag.evaluate(() => {
    const s = [...(window.__hekatanSelection ?? [])];
    return { total: s.length, barras: s.filter((k) => k.startsWith("seg:")).length };
  });
  await foto(nombre + "_soltado");
  return { medio, final, sel };
};

console.log("\n── IZQ → DER (debe salir recuadro AZUL CONTINUO, y coger solo lo entero dentro)");
const w = await arrastre("izq_der", -220, -150, 220, 150);
console.log("   recuadro a mitad del arrastre:", JSON.stringify(w.medio));
console.log("   designado al soltar:", JSON.stringify(w.sel));
ok(!!w.medio?.visible && w.medio.w > 50, "IZQ→DER: se PINTA un recuadro mientras se arrastra",
   w.medio ? `${w.medio.w}×${w.medio.h} visible=${w.medio.visible}` : "el div no existe");
if (w.medio) console.log("   borde:", w.medio.borde, "| fondo:", w.medio.fondo, "| encima:", w.medio.tapado);
ok(/solid/.test(w.medio?.borde ?? ""), "IZQ→DER: línea CONTINUA, como el Window de AutoCAD", w.medio?.borde);
ok(/63, *119, *196/.test(w.medio?.fondo ?? ""), "IZQ→DER: AZUL (color 150 de AutoCAD)", w.medio?.fondo);

console.log("\n── DER → IZQ (debe salir recuadro VERDE DISCONTINUO, y coger lo que TOQUE)");
const c = await arrastre("der_izq", 220, 150, -220, -150);
console.log("   recuadro a mitad del arrastre:", JSON.stringify(c.medio));
console.log("   designado al soltar:", JSON.stringify(c.sel));
ok(!!c.medio?.visible && c.medio.w > 50, "DER→IZQ: se PINTA un recuadro mientras se arrastra",
   c.medio ? `${c.medio.w}×${c.medio.h} visible=${c.medio.visible}` : "el div no existe");
if (c.medio) console.log("   borde:", c.medio.borde, "| fondo:", c.medio.fondo, "| encima:", c.medio.tapado);
ok(/dashed/.test(c.medio?.borde ?? ""), "DER→IZQ: línea DISCONTINUA, como el Crossing de AutoCAD", c.medio?.borde);
ok(/63, *175, *70/.test(c.medio?.fondo ?? ""), "DER→IZQ: VERDE (color 100 de AutoCAD)", c.medio?.fondo);

ok(w.sel.barras > 0 || c.sel.barras > 0, "al soltar se designa algo",
   `window ${w.sel.barras} · crossing ${c.sel.barras}`);
ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(`\nfotogramas en ${OUT}`);
console.log(fallos.length ? `${fallos.length} FALLO(S)` : "Todo correcto");
process.exit(fallos.length ? 1 : 0);
