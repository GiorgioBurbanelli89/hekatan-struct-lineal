#!/usr/bin/env node
/**
 * ctl_cmdwindow.mjs — la VENTANA DE COMANDOS nueva (8-sep-2026) probada con
 * teclas REALES (CDP) sobre la web construida, como la usaría alguien:
 *
 *   L Enter · 0,0,0 · 6,0,0 · @0,5,0 · C          → polilínea cerrada de 3 tramos
 *   Enter vacío                                     → repite el último comando (L)
 *   (selección por JS) M · 0,0,0 · @1,1,0           → mueve el nudo
 *   CO · 0,0,0 · @0,0,3                             → copia el nudo tres metros arriba
 *   Ctrl+Z / Ctrl+Y                                 → deshace y rehace
 *   1 y 4 con la caja vacía                         → planta (orto) y 3D (persp)
 *   clic en ORTO F8 de la barra de estado           → __hekatanOrthoMode
 *   F2                                              → historial desplegado
 *
 * Deja cli/shots/cmdwindow/*.png para MIRARLOS y sale con código 1 si algo
 * no cuadra. Sirve la web construida (website/src/examples) en local, como
 * video_escenas.mjs.
 *
 *   node cli/ctl_cmdwindow.mjs
 */
import puppeteer from "puppeteer";
import { mkdirSync, readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "cmdwindow"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4733;
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml",
  ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2", ".heks":"application/json" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(PUERTO, r));

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
         "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1400, height: 820, deviceScaleFactor: 1 });
const errores = [];
pag.on("pageerror", (e) => errores.push(e.message));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (cond, que, detalle = "") => {
  console.log(`${cond ? "  ✓" : "  ✗"} ${que}${detalle ? "  —  " + detalle : ""}`);
  if (!cond) fallos.push(que);
};

await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`,
               { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
let n = 0;
const foto = async (nombre) => pag.screenshot({ path: join(OUT, `${String(n++).padStart(2, "0")}_${nombre}.png`) });

// la guía «Cómo usar» se abre sola en el archivo nuevo
const guiaAbierta = await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.style.display === "block");
ok(guiaAbierta, "la guía «Cómo usar el archivo nuevo» se abre sola");
await foto("guia");
await pag.keyboard.press("Escape");
await espera(300);

const estado = () => pag.evaluate(() => ({
  tool: window.__hekatanCadState?.get?.()?.tool,
  prompt: document.getElementById("hk3-cmd-prompt")?.textContent,
  ops: document.getElementById("hk3-cmd-ops")?.textContent,
  pts: window.__hekatanDrawingPoints?.val ?? [],
  polys: window.__hekatanDrawingPolylines?.val ?? [],
  foco: document.activeElement?.id,
  hist: document.getElementById("hk3-cmd-hist")?.children.length,
}));
const teclea = async (txt) => {
  await pag.keyboard.type(txt, { delay: 30 });
  await pag.keyboard.press("Enter");
  await espera(250);
};
const limpia = () => pag.evaluate(() => {
  window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = [];
  window.__hekatanSelection?.clear?.(); window.__hekatanRefreshSelection?.();
});
await limpia();

// 1. LÍNEA por teclado con cierre
await teclea("l");
let e = await estado();
ok(e.tool === "line" && /Precise primer punto/.test(e.prompt), "L Enter → LÍNEA Precise primer punto", e.prompt);
await teclea("0,0,0");
await teclea("6,0,0");
e = await estado();
ok(/punto siguiente/.test(e.prompt) && /Cerrar/.test(e.ops), "tras dos puntos: «punto siguiente o [Cerrar/desHacer]»", e.prompt + " " + e.ops);
await foto("linea_dos_puntos");
await teclea("@0,5,0");
await teclea("c");
e = await estado();
ok(JSON.stringify(e.polys[0]) === "[0,1,2,0]" && e.tool === "select", "C cierra la polilínea y suelta la herramienta", JSON.stringify(e.polys) + " tool=" + e.tool);
await foto("linea_cerrada");

// 2. Enter vacío repite el último comando
await pag.keyboard.press("Enter");
await espera(200);
e = await estado();
ok(e.tool === "line", "Enter vacío repite el último comando (L)", "tool=" + e.tool);
await pag.keyboard.press("Escape");
await espera(200);

// 3. MOVER con selección
await pag.evaluate(() => { window.__hekatanSelection.clear(); window.__hekatanSelection.add("pt:1"); window.__hekatanRefreshSelection(); });
await teclea("m");
e = await estado();
ok(/MOVER Precise punto base/.test(e.prompt), "M → MOVER Precise punto base", e.prompt);
await teclea("0,0,0");
e = await estado();
ok(/segundo punto/.test(e.prompt), "MOVER pide el segundo punto", e.prompt);
await teclea("@1,1,0");
e = await estado();
ok(JSON.stringify(e.pts[1]) === "[7,1,0]", "el nudo 1 se movió de (6,0,0) a (7,1,0)", JSON.stringify(e.pts[1]));

// 4. deshacer / rehacer con teclas
await pag.keyboard.down("Control"); await pag.keyboard.press("z"); await pag.keyboard.up("Control");
await espera(200);
e = await estado();
ok(JSON.stringify(e.pts[1]) === "[6,0,0]", "Ctrl+Z deshace el movimiento", JSON.stringify(e.pts[1]));
await pag.keyboard.down("Control"); await pag.keyboard.press("y"); await pag.keyboard.up("Control");
await espera(200);
e = await estado();
ok(JSON.stringify(e.pts[1]) === "[7,1,0]", "Ctrl+Y lo rehace", JSON.stringify(e.pts[1]));

// 5. COPIAR
await pag.evaluate(() => { window.__hekatanSelection.clear(); window.__hekatanSelection.add("pt:0"); window.__hekatanRefreshSelection(); });
await teclea("co");
await teclea("0,0,0");
await teclea("@0,0,3");
e = await estado();
ok(e.pts.length === 4 && JSON.stringify(e.pts[3]) === "[0,0,3]", "CO copia el nudo 0 tres metros arriba", JSON.stringify(e.pts));

// 6. vistas por dígito con la caja vacía y sin comando
const cam = () => pag.evaluate(() => { const c = document.querySelector("#viewer").__ctx.camera; return c.isOrthographicCamera ? "orto" : "persp"; });
await pag.keyboard.press("1"); await espera(400);
ok((await cam()) === "orto", "tecla 1 sin comando → planta (cámara ortográfica)");
await pag.keyboard.press("4"); await espera(400);
ok((await cam()) === "persp", "tecla 4 → 3D (perspectiva)");
// y con una herramienta activa el dígito NO cambia la vista
await teclea("l");
await pag.keyboard.press("1"); await espera(200);
const v = await pag.evaluate(() => document.getElementById("hk3-cmd-input").value);
ok(v === "1" && (await cam()) === "persp", "con LÍNEA activa, el 1 es una coordenada, no una vista", `caja=«${v}»`);
await pag.keyboard.press("Escape"); await espera(200);
await pag.evaluate(() => { document.getElementById("hk3-cmd-input").value = ""; });

// 7. barra de estado: ORTO por clic, y F2 abre el historial
const orto0 = await pag.evaluate(() => !!window.__hekatanOrthoMode);
await pag.click("#hk-statusbar button:nth-child(2)");
await espera(200);
const orto1 = await pag.evaluate(() => !!window.__hekatanOrthoMode);
ok(orto0 !== orto1, "clic en ORTO F8 de la barra de estado conmuta el orto");
await pag.click("#hk-statusbar button:nth-child(2)");
await pag.keyboard.press("F2"); await espera(200);
const hAlto = await pag.evaluate(() => document.getElementById("hk3-cmd-hist").style.maxHeight);
ok(hAlto === "240px", "F2 despliega el historial", hAlto);
await foto("historial_f2");
await pag.keyboard.press("F2");
e = await estado();
ok(e.hist >= 8, "el historial guarda lo tecleado y los mensajes", "líneas=" + e.hist);
await foto("final");

console.log(errores.length ? `\nerrores de página: ${errores.slice(0, 3).join(" | ")}` : "\nsin errores de página");
console.log(fallos.length ? `\nFALLAN ${fallos.length}: ${fallos.join(" · ")}` : "\nTODO OK");
await nav.close();
srv.close();
process.exit(fallos.length ? 1 : 0);
