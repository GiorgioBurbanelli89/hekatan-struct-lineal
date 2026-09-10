#!/usr/bin/env node
/**
 * MOTOR de tutoriales de Hekatan Struct — la plantilla de la que salen los vídeos.
 *
 * Graba la APLICACIÓN DE VERDAD (ribbon + panel + visor 3D) en fotogramas de
 * 1280×720, con el cursor DIBUJADO, siguiendo una lista de pasos declarada aparte.
 * Cada capítulo vive en `cli/tutoriales/<nombre>.mjs` y solo dice QUÉ se hace; el
 * cómo (servidor, navegador, cursor, encuadres, comprobaciones) está aquí.
 *
 *     node cli/tutorial_struct.mjs plantillas_modal
 *
 * Deja `frames_tut_<nombre>/f000.png…` + `pasos.json` (en qué fotograma empieza y
 * acaba cada paso, para que la voz del guion `.hs` cuadre con lo que se ve).
 *
 * Por qué fotogramas y no un iframe dentro de la escena HTML: el motor de vídeo
 * (`hsweb.js`) carga la escena por `file://` y la app se sirve por `http://`; desde
 * una no se puede tocar la otra. Con fotogramas, además, la captura se revisa antes
 * de gastar un render — que es la regla de la GUIA_VIDEO: mirar los frames.
 *
 * Reglas de la GUIA_VIDEO que este motor cumple solo:
 *   · 1280×720 con `deviceScaleFactor 2` (se captura al doble y se reduce: el texto
 *     se conserva; ampliar lo borra);
 *   · la VENTANA ENTERA, no solo el lienzo — el que mira tiene que ver dónde está
 *     el botón que se toca;
 *   · y comprueba que los fotogramas sean DISTINTOS: un visor que no repinta da una
 *     secuencia idéntica y el vídeo sale congelado pareciendo correcto.
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, readdirSync, unlinkSync } from "fs";
import { createServer } from "http";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAP = process.argv[2];
if (!CAP) { console.error("uso: node cli/tutorial_struct.mjs <capitulo>"); process.exit(1); }
const cap = await import(pathToFileURL(join(__dirname, "tutoriales", CAP + ".mjs")).href);
const OUT = join(__dirname, "..", "frames_tut_" + CAP);
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (/\.(png|json)$/.test(f)) unlinkSync(join(OUT, f));

const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
if (!existsSync(raiz)) { console.error("no hay bundle: npm run build:deploy"); process.exit(2); }
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
await new Promise((r) => srv.listen(4780, r));

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
         "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const avisos = [];
pag.on("pageerror", (e) => avisos.push("pageerror: " + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto("http://localhost:4780" + BASE + "workspace/?t=" + (cap.ejemplo || "plantillas"),
  { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(7000);

// ── El cursor, DIBUJADO ──────────────────────────────────────────────────────
// El ratón de verdad no sale en las capturas: sin esto los clics ocurren solos y el
// tutorial no enseña nada. La flecha sigue al ratón de puppeteer y suelta un aro al
// pulsar, que se mantiene unos fotogramas para que se VEA el clic.
await pag.evaluate(() => {
  const c = document.createElement("div");
  c.id = "hk-tut-cursor";
  c.style.cssText = "position:fixed;left:-100px;top:-100px;z-index:2147483647;" +
    "pointer-events:none;width:22px;height:22px";
  c.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22">' +
    '<path d="M4 2 L4 19 L9 14.5 L12 21.5 L15 20 L12 13.5 L18.5 13.5 Z" fill="#fff" ' +
    'stroke="#0b1220" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  document.body.appendChild(c);
  const a = document.createElement("div");
  a.id = "hk-tut-aro";
  a.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;display:none;" +
    "width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;" +
    "border:2.5px solid #22d3ee;background:rgba(34,211,238,.18)";
  document.body.appendChild(a);
  const r = document.createElement("div");
  r.id = "hk-tut-rotulo";
  r.style.cssText = "position:fixed;left:22px;top:14px;z-index:2147483645;color:#e6c463;" +
    "font:600 19px ui-monospace,Consolas,monospace;text-shadow:0 1px 4px #000;" +
    "pointer-events:none;max-width:900px";
  document.body.appendChild(r);
  window.__tutCursor = (x, y) => { c.style.left = x + "px"; c.style.top = y + "px"; };
  window.__tutAro = (x, y) => { a.style.left = x + "px"; a.style.top = y + "px"; a.style.display = "block"; };
  window.__tutSoltar = () => { a.style.display = "none"; };
  // El rótulo es para REVISAR los fotogramas. En el vídeo estorba: repite el
  // subtítulo de School y se pisa con la barra de la app. `TUT_ROTULO=0` lo apaga.
  window.__tutRotulo = (t) => { r.textContent = t; };
  window.__tutSinRotulo = () => { r.style.display = "none"; };
});

if (process.env.TUT_ROTULO === "0") await pag.evaluate(() => window.__tutSinRotulo());

let k = 0;
const foto = async (n = 1) => {
  for (let i = 0; i < n; i++)
    await pag.screenshot({ path: join(OUT, "f" + String(k++).padStart(3, "0") + ".png") });
};
const raton = async (x, y, pasos = 12) => {
  const p0 = await pag.evaluate(() => {
    const c = document.getElementById("hk-tut-cursor");
    return [parseFloat(c.style.left) || 640, parseFloat(c.style.top) || 360];
  });
  for (let i = 1; i <= pasos; i++) {
    const t = i / pasos;
    const px = p0[0] + (x - p0[0]) * t, py = p0[1] + (y - p0[1]) * t;
    await pag.mouse.move(px, py);
    await pag.evaluate((q) => window.__tutCursor(q.x, q.y), { x: px, y: py });
    if (i % 4 === 0) await foto();
  }
  await foto(2);
};
const clic = async (x, y) => {
  await pag.evaluate((q) => window.__tutAro(q.x, q.y), { x, y });
  await foto(3);
  await pag.mouse.click(x, y);
  await espera(200);
  await foto(3);
  await pag.evaluate(() => window.__tutSoltar());
};
/** Punto del centro de un control buscado por su TEXTO (botón) o su etiqueta (fila). */
const punto = (que, texto) => pag.evaluate((q) => {
  const dentro = (e) => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
  };
  let e = null;
  if (q.q === "boton") {
    e = [...document.querySelectorAll("button, .tp-btnv_b")]
      .filter((x) => x.offsetParent !== null && (x.textContent || "").includes(q.t) && dentro(x))[0];
  } else {
    const fila = [...document.querySelectorAll(".tp-lblv")]
      .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q.t));
    e = fila && dentro(fila) ? fila : null;
  }
  if (!e) return null;
  const r = e.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}, { q: que, t: texto });

const api = {
  pag, espera, foto,
  /** Deja el rótulo del paso y unos fotogramas para leerlo. */
  rotulo: async (t) => { await pag.evaluate((s) => window.__tutRotulo(s), t); await foto(3); },
  /** Quieto n fotogramas (para que la voz pueda hablar sobre lo que se ve). */
  quieto: async (n, ms = 260) => { for (let i = 0; i < n; i++) { await espera(ms); await foto(); } },
  /** Va al control y lo pulsa, con el cursor a la vista. */
  pulsar: async (texto, ms = 900) => {
    const p = await punto("boton", texto);
    if (!p) { console.log("  x no se ve el boton: " + texto); return false; }
    await raton(p.x, p.y); await clic(p.x, p.y); await espera(ms); return true;
  },
  /** Lleva el cursor a la fila del parámetro y lo cambia (se ve dónde está). */
  param: async (etiqueta, clave, valor, ms = 3000) => {
    const p = await punto("fila", etiqueta);
    if (p) { await raton(p.x, p.y); await pag.evaluate((q) => window.__tutAro(q.x, q.y), p); await foto(3); }
    await pag.evaluate((q) => window.__hekatanSetParam(q.c, q.v), { c: clave, v: valor });
    await espera(ms);
    await pag.evaluate(() => window.__tutSoltar());
    await foto(3);
    return !!p;
  },
  /** Elige una opción de un desplegable del panel, por su texto. */
  elegir: async (etiqueta, textoOpcion, ms = 3500) => {
    const p = await punto("fila", etiqueta);
    if (p) { await raton(p.x, p.y); await clic(p.x, p.y); }
    const val = await pag.evaluate((q) => {
      const fila = [...document.querySelectorAll(".tp-lblv")]
        .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q.e));
      const s = fila && fila.querySelector("select");
      if (!s) return null;
      s.id = "hk-tut-select";
      const o = [...s.options].find((x) => (x.textContent || "").includes(q.t));
      return o ? o.value : null;
    }, { e: etiqueta, t: textoOpcion });
    if (val == null) { console.log("  x no se ve la opcion: " + textoOpcion); return false; }
    await pag.select("#hk-tut-select", val);
    await espera(ms);
    await foto(4);
    return true;
  },
};

const marcas = [];
console.log("== " + (cap.titulo || CAP) + " ==");
for (const paso of cap.pasos) {
  const desde = k;
  await api.rotulo(paso.rotulo);
  await paso.hacer(api);
  marcas.push({ rotulo: paso.rotulo, desde, hasta: k - 1, cuadros: k - desde });
  console.log("  " + String(desde).padStart(4) + "-" + String(k - 1).padStart(4) + "  " + paso.rotulo);
}
writeFileSync(join(OUT, "pasos.json"), JSON.stringify({ titulo: cap.titulo, pasos: marcas }, null, 1));
await nav.close(); srv.close();

// ── ¿se mueve? Fotogramas iguales = vídeo congelado que parece bueno ─────────
const listado = readdirSync(OUT).filter((f) => /\.png$/.test(f)).sort();
let iguales = 0;
for (let i = 1; i < listado.length; i++) {
  const a = readFileSync(join(OUT, listado[i - 1])), b = readFileSync(join(OUT, listado[i]));
  if (a.length === b.length && a.equals(b)) iguales++;
}
console.log("\n" + listado.length + " fotogramas en " + OUT);
console.log(iguales ? "AVISO: " + iguales + " pares IDENTICOS" : "OK: todos distintos");
if (avisos.length) console.log("avisos:", avisos.slice(0, 5));
