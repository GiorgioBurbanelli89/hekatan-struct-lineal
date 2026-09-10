/**
 * Correr modal + animar, y DESPUÉS mover los parámetros. ¿Se rompe el dibujo?
 *
 * El bug (10-sep-2026, reportado sobre «Pórtico + losa + muros (dual)»): con la
 * animación modal puesta, subir «líneas en X» dejaba los NUDOS VIEJOS con los
 * ELEMENTOS NUEVOS — barras apuntando a nudos que ya no existen. Medido: 68 nudos
 * contra 124 elementos, 51 de ellos fuera de rango. En pantalla, un destrozo.
 *
 * La causa no era el modal: el animador guarda una foto de los nudos para poder
 * restaurarlos al parar, y al regenerarse el modelo debajo volcaba esa foto vieja
 * encima del modelo nuevo. Ahora solo restaura si la foto es de ESTA malla.
 *
 * Se prueba en TODAS las plantillas, porque el animador es el mismo para todas.
 *
 *   node cli/ctl_modal_parametros.mjs            (el build local)
 *   node cli/ctl_modal_parametros.mjs publico    (el sitio de GitHub Pages)
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "modal"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4772;
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
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plantillas"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=plantillas`;

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
let pag = await nav.newPage();
await pag.setViewport({ width: 1400, height: 900 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };

/** Abre (o reabre, si la pestaña se murió) el workspace con las plantillas. */
async function abrir() {
  pag = await nav.newPage();
  await pag.setViewport({ width: 1400, height: 900 });
  await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
  await espera(6000);
}
await pag.close();
await abrir();

/**
 * Radiografía del modelo que hay AHORA en el viewer.
 *
 * Devuelve `{ muerta: true }` si la pestaña se cayó: con mallas grandes el solver
 * modal se lleva por delante al renderer, y sin esto el test explota con un
 * «detached Frame» de puppeteer en vez de contarlo como el fallo que es.
 */
const estado = async () => {
  try { return await radiografia(); }
  catch (e) { return { muerta: true, motivo: String(e.message || e).slice(0, 60) }; }
};
const radiografia = () => pag.evaluate(() => {
  const st = window.__hekatanStates || {};
  const nodes = st.nodes?.rawVal ?? st.nodes?.val ?? [];
  const els = st.elements?.rawVal ?? st.elements?.val ?? [];
  return {
    n: nodes.length,
    e: els.length,
    nan: nodes.filter((x) => x.some((v) => !Number.isFinite(v))).length,
    fuera: els.filter((x) => x.some((i) => i >= nodes.length || i < 0)).length,
  };
});

// `tipo` es un NÚMERO, no la etiqueta del desplegable: pasarle el texto dejaba
// `Math.round(p.tipo)` en NaN y las seis plantillas salían siendo la misma.
const PLANTILLAS = [
  [0, "Pórtico plano (2D)"],
  [1, "Pórtico 3D"],
  [2, "Pórtico + losa (aporte de losa)"],
  [4, "Losa plana sobre columnas"],
  [6, "Pórtico + losa + muros (dual)"],
  [7, "Pórtico arriostrado (CBF)"],
];
// Los mismos gestos que hace el usuario: correr modal, animar, y mover los vanos.
const GESTOS = [["nx", 6], ["sx", 8], ["pisos", 6], ["ny", 5]];

for (const [tipo, plant] of PLANTILLAS) {
  console.log(`\n── ${plant} ${"─".repeat(Math.max(0, 46 - plant.length))}`);
  await pag.evaluate((t) => { window.__hekatanSetParam("tipo", t);
    window.__hekatanSetParam("nx", 4); window.__hekatanSetParam("sx", 6);
    window.__hekatanSetParam("ny", 4); window.__hekatanSetParam("pisos", 4); }, tipo);
  await espera(9000);
  const base = await estado();
  ok(!base.muerta && base.fuera === 0 && base.nan === 0, "el modelo arranca sano",
     base.muerta ? `la pestaña se murió (${base.motivo})` : `${base.n} nudos · ${base.e} elementos`);
  if (base.muerta) { await abrir(); continue; }

  await pag.evaluate(() => window.__hekatanRunModalAnimate?.());
  await espera(14000);
  const anim = await estado();
  ok(!anim.muerta && anim.fuera === 0 && anim.nan === 0, "con el modal animando sigue sano",
     anim.muerta ? `la pestaña se murió (${anim.motivo})` : `${anim.n} nudos · ${anim.e} elementos`);
  if (anim.muerta) { await abrir(); continue; }

  let cayo = false;
  for (const [par, val] of GESTOS) {
    try { await pag.evaluate((p, v) => window.__hekatanSetParam(p, v), par, val); }
    catch { /* la pestaña ya no está: lo cuenta el estado() de abajo */ }
    await espera(13000);
    const e = await estado();
    ok(!e.muerta && e.fuera === 0 && e.nan === 0,
       `«${par}» → ${val} con la animación puesta no rompe el dibujo`,
       e.muerta ? `LA PESTAÑA SE MURIÓ (${e.motivo})`
                : `${e.n} nudos · ${e.e} elementos · ${e.fuera} elementos fuera de rango · ${e.nan} nudos NaN`);
    if (e.muerta) { cayo = true; break; }
  }
  if (cayo) { await abrir(); continue; }
  try {
    await pag.screenshot({ path: join(OUT, `${plant.replace(/[^\w]/g, "_").slice(0, 28)}.png`) });
    await pag.evaluate(() => window.__hekatanModalStop?.());
  } catch { /* nada que parar */ }
  await espera(1500);
}

console.log(`\n${fallos.length ? "FALLOS" : "OK"}: ${fallos.length ? fallos.join(" · ") : "todas las plantillas aguantan el cambio de parámetros con el modal animando"}`);
await nav.close(); if (srv) srv.close();
process.exit(fallos.length ? 1 : 0);
