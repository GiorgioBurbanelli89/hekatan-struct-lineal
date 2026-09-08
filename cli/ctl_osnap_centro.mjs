/**
 * OSNAP «centro» sin depender del registro en memoria.
 *
 * El círculo se guarda TESELADO (una polilínea): el centro no es ningún punto del dibujo. Hasta el
 * 8-sep-2026 se anotaba en un array de JS (`__hekatanCirculos`), que se pierde al recargar la
 * página y no existe si el dibujo viene de fuera — el OSNAP «centro» dejaba de funcionar sin avisar.
 * Ahora el centro se DEDUCE de la geometría: una polilínea cerrada cuyos vértices están todos a la
 * misma distancia de su promedio es un polígono regular, y ese promedio es el centro.
 *
 * Esta prueba dibuja un círculo, VACÍA el registro (que es lo que pasa al recargar) y comprueba que
 * el centro se sigue encontrando y con las coordenadas exactas.
 *
 *   node cli/ctl_osnap_centro.mjs            # contra el build local
 *   URL_BASE=https://…/hekatan-struct-lineal/ node cli/ctl_osnap_centro.mjs   # contra el público
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4736;
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

const r = await pag.evaluate(() => {
  const w = window;
  if (typeof w.__hekatanDrawCircle !== "function") return { err: "sin __hekatanDrawCircle" };
  w.__hekatanDrawCircle(3, 2, 0, 1.5, 24, "xy");          // círculo de radio 1.5 en (3,2,0)
  const enRegistro = (w.__hekatanCirculos || []).length;
  if (w.__hekatanCirculos) w.__hekatanCirculos.length = 0;  // como si se hubiera recargado
  const ded = typeof w.__hekatanCentrosDeducidos === "function" ? w.__hekatanCentrosDeducidos() : null;
  return { enRegistro, hayFuncion: !!ded, ded: ded ? ded.map((k) => ({ c: k.c, r: k.r })) : [] };
});

if (r.err) { ok(false, "el lienzo CAD expone __hekatanDrawCircle", r.err); }
else {
  ok(r.enRegistro === 1, "el círculo se dibuja y se anota en el registro", `${r.enRegistro} en registro`);
  ok(r.hayFuncion, "existe __hekatanCentrosDeducidos (el centro se deduce de la geometría)");
  const c = r.ded.find((k) => Math.abs(k.c[0] - 3) < 1e-6 && Math.abs(k.c[1] - 2) < 1e-6 && Math.abs(k.r - 1.5) < 1e-6);
  ok(!!c, "CON EL REGISTRO VACÍO (como tras recargar) el centro se sigue deduciendo",
     r.ded.length ? `${r.ded.length} centro(s): ${JSON.stringify(r.ded[0])}` : "ninguno");
}
ok(errores.length === 0, "sin errores de página", errores.slice(0, 2).join(" | "));

await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
