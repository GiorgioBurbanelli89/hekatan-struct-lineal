/**
 * Los alias de AutoCAD, contra el CAD de Hekatan.
 *
 * La lista NO se escribe de memoria: sale del `acad.pgp` de la instalación de AutoCAD
 * (`%APPDATA%\Autodesk\AutoCAD 2027\R26.0\enu\Support\acad.pgp`, 221 alias de 1-3 letras).
 * Si no está el fichero, el caso se salta.
 *
 * Lo que comprueba:
 *  1. los alias que AutoCAD y Hekatan comparten hacen lo mismo (L línea, PL polilínea, C círculo…);
 *  2. **Z encuadra, no deshace** — hasta el 8-sep-2026 Z estaba puesto como DESHACER (por Ctrl+Z) y
 *     en AutoCAD es ZOOM: quien viene de AutoCAD teclea Z para encuadrar y le borraba lo dibujado;
 *  3. un comando de AutoCAD que aquí no existe (MI, RO, AR…) responde QUÉ es y con qué se hace,
 *     no «desconocido».
 *
 *   node cli/ctl_alias_autocad.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PGP = join(process.env.APPDATA || "", "Autodesk", "AutoCAD 2027", "R26.0", "enu", "Support", "acad.pgp");
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4741;
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
await new Promise((r) => srv.listen(PUERTO, r));

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
         "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1400, height: 820 });
const errores = [];
pag.on("pageerror", (e) => errores.push(e.message));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (cond, que, detalle = "") => {
  console.log(`${cond ? "  ✓" : "  ✗"} ${que}${detalle ? "  —  " + detalle : ""}`);
  if (!cond) fallos.push(que);
};
const URL_BASE = process.env.URL_BASE || `http://localhost:${PUERTO}${BASE}`;
console.log("probando", URL_BASE);
await pag.goto(`${URL_BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

const teclea = async (txt) => {
  await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (i) i.value = ""; });
  await pag.focus("#hk3-cmd-input");
  await pag.type("#hk3-cmd-input", txt, { delay: 10 });
  await pag.keyboard.press("Enter");
  await espera(450);
  return pag.evaluate(() => ({
    tool: (window).__hekatanCadState?.get?.()?.tool,
    ultima: [...document.querySelectorAll("#hk3-cmd-hist div")].pop()?.textContent || "",
  }));
};
const esc = async () => { await pag.keyboard.press("Escape"); await espera(250); };

// 1) los que comparten AutoCAD y Hekatan
for (const [alias, tool, nombre] of [["l", "line", "LINE"], ["pl", "polyline", "PLINE"],
     ["c", "circle", "CIRCLE"], ["a", "arc", "ARC"], ["rec", "rect", "RECTANG"],
     ["m", "move", "MOVE"], ["co", "copy", "COPY"], ["o", "offset", "OFFSET"],
     ["tr", "trim", "TRIM"], ["ex", "extend", "EXTEND"], ["e", "delete", "ERASE"]]) {
  const r = await teclea(alias);
  ok(r.tool === tool, `${alias.toUpperCase()} = ${nombre} de AutoCAD`, `herramienta: ${r.tool}`);
  await esc();
}

// 2) Z encuadra, NO deshace (el choque que había)
await teclea("l");
for (const p of ["0,0,0", "4,0,0", "4,3,0"]) await teclea(p);
await esc();
const antes = await pag.evaluate(() => (window).__hekatanDrawingPoints?.val?.length ?? -1);
const rz = await teclea("z");
const despues = await pag.evaluate(() => (window).__hekatanDrawingPoints?.val?.length ?? -1);
ok(antes > 0 && despues === antes, "Z ENCUADRA y no borra nada (en AutoCAD Z = ZOOM)",
   `puntos ${antes} → ${despues}; eco: ${rz.ultima.slice(0, 40)}`);
const ru = await teclea("u");
const trasU = await pag.evaluate(() => (window).__hekatanDrawingPoints?.val?.length ?? -1);
ok(trasU < despues, "U DESHACE (en AutoCAD U = UNDO)", `puntos ${despues} → ${trasU}`);

// 3) un comando de AutoCAD que aquí no está: respuesta útil
for (const [c, esperado] of [["mi", /MIRROR/i], ["ar", /ARRAY/i], ["sc", /SCALE/i]]) {
  const r = await teclea(c);
  ok(esperado.test(r.ultima) && !/desconocido/i.test(r.ultima),
     `${c.toUpperCase()} (de AutoCAD, aquí sin implementar) explica qué es y qué usar`,
     r.ultima.slice(0, 72));
}
// y uno que no es de AutoCAD ni de aquí: sigue diciendo desconocido
const rx = await teclea("zzz");
ok(/desconocido/i.test(rx.ultima), "un comando inventado sigue siendo «desconocido»", rx.ultima.slice(0, 50));

if (existsSync(PGP)) {
  const txt = readFileSync(PGP, "utf-8");
  const n = [...txt.matchAll(/^\s*([A-Za-z0-9_]{1,3})\s*,\s*\*([A-Za-z0-9_]+)/gm)].length;
  ok(n > 100, "la lista sale del acad.pgp de AutoCAD, no de memoria", `${n} alias de 1-3 letras`);
} else {
  console.log(`  · acad.pgp no encontrado (${PGP}): no se comprueba la fuente`);
}
ok(errores.length === 0, "sin errores de página", errores.slice(0, 2).join(" | "));

await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
