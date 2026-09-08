/**
 * La ENTRADA DINÁMICA pegada al cursor: que sus opciones se puedan PULSAR.
 *
 * El panel entero lleva `pointer-events:none` (si no, taparía el clic de dibujar), así que las
 * opciones —[Cerrar/desHacer]— eran texto muerto: solo se podían pulsar en la barra de abajo.
 * Y aunque recibieran el ratón no servirían de nada mientras el panel PERSIGUE al cursor: el botón
 * se apartaría justo al ir a pulsarlo. Arreglado el 8-sep-2026: la fila de opciones sí recibe el
 * ratón, y mientras haya opciones el panel se ancla. Y el fallo de raíz: el panel es hijo de
 * `body`, así que IR a pulsar una opción sale del lienzo y el `pointerleave` lo escondía justo
 * antes del clic — no llegaba ni un `mousedown` (medido: 0 de 1).
 *
 * Esta prueba dibuja dos tramos de polilínea (que es cuando aparece [Cerrar/desHacer]), comprueba
 * que los botones existen, que el panel deja de seguir al ratón, y PULSA «Cerrar» para ver que
 * cierra la polilínea de verdad.
 *
 *   node cli/ctl_dyn_opciones.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "dyn"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4737;
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

// PL + dos tramos por coordenadas: es cuando el prompt ofrece [Cerrar/desHacer]
const teclea = async (txt) => {
  await pag.focus("#hk3-cmd-input");
  await pag.type("#hk3-cmd-input", txt, { delay: 12 });
  await pag.keyboard.press("Enter");
  await espera(700);
};
await teclea("PL");
// …y los puntos con el RATON, como se dibuja de verdad: asi aparece la goma
for (const [x, y] of [[520, 400], [760, 400], [760, 560]]) {
  await pag.mouse.move(x, y); await espera(220);
  await pag.mouse.click(x, y); await espera(420);
}
await pag.mouse.move(700, 420); await espera(400);

const est1 = await pag.evaluate(() => {
  const d = document.getElementById("hk-dyn");
  const o = document.getElementById("hk-dyn-ops");
  const bs = [...(o?.querySelectorAll("button") || [])].map((b) => b.textContent);
  const r = d?.getBoundingClientRect();
  return { visible: d && getComputedStyle(d).display !== "none", ops: bs,
           pe: o ? getComputedStyle(o).pointerEvents : null, x: r?.x, y: r?.y };
});
ok(est1.visible, "la entrada dinámica se ve al mover el ratón");
ok(est1.ops.length >= 2, "ofrece las opciones del comando", est1.ops.join(" / ") || "ninguna");
ok(est1.pe === "auto", "la fila de opciones SÍ recibe el ratón", `pointer-events: ${est1.pe}`);

// al mover el ratón con opciones a la vista, el panel NO debe seguirlo
await pag.mouse.move(900, 520); await espera(350);
const est2 = await pag.evaluate(() => {
  const r = document.getElementById("hk-dyn")?.getBoundingClientRect();
  return { x: r?.x, y: r?.y };
});
ok(Math.abs(est2.x - est1.x) < 1 && Math.abs(est2.y - est1.y) < 1,
   "con opciones a la vista el panel se ANCLA (si huyera no se podría pulsar)",
   `(${est1.x?.toFixed(0)},${est1.y?.toFixed(0)}) → (${est2.x?.toFixed(0)},${est2.y?.toFixed(0)})`);
await pag.screenshot({ path: join(OUT, "01_opciones.png") });

// pulsar «Cerrar»: la polilínea tiene que cerrarse
const antes = await pag.evaluate(() => (window).__hekatanStates?.nodes?.val?.length ?? -1);
const cerrado = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("#hk-dyn-ops button")].find((q) => /cerrar/i.test(q.textContent || ""));
  if (!b) return false;
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
if (cerrado && cerrado.x) {
  await pag.mouse.click(cerrado.x, cerrado.y);
  await espera(900);
  const est3 = await pag.evaluate(() => ({
    ops: document.querySelectorAll("#hk-dyn-ops button").length,
    prompt: document.getElementById("hk3-cmd-prompt")?.textContent,
  }));
  ok(est3.ops === 0, "al pulsar «Cerrar» el comando termina y las opciones desaparecen",
     `prompt ahora: ${est3.prompt}`);
} else {
  ok(false, "se encuentra el botón «Cerrar» para pulsarlo");
}
await pag.screenshot({ path: join(OUT, "02_tras_cerrar.png") });
ok(errores.length === 0, "sin errores de página", errores.slice(0, 2).join(" | "));

await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
