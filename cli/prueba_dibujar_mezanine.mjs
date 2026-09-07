#!/usr/bin/env node
/**
 * ¿SE PUEDE DIBUJAR UN MEZANINE SIN MANUAL?
 *
 *   node cli/prueba_dibujar_mezanine.mjs [url]
 *
 * No prueba el solver: prueba la INTERFAZ. Hace lo que haría alguien que abre
 * el programa por primera vez —pulsar el botón de la herramienta y picar en el
 * lienzo— y después de cada paso MIDE el modelo (`__hekatanStates`) para saber
 * si de verdad se creó algo. Un botón que se pulsa y no crea nada no da error:
 * simplemente no pasa nada, y eso es lo que hay que cazar.
 *
 * Y por el camino contesta la otra pregunta: una vez dibujada una barra, ¿por
 * dónde se le cambia la sección?
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "dibujar");
mkdirSync(OUT, { recursive: true });
const URL_APP = process.argv[2] || "http://localhost:4600/workspace/?t=new-blank";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const nav = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader",
         "--enable-webgl", "--ignore-gpu-blocklist"],
});
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const errores = [];
pag.on("pageerror", (e) => errores.push(e.message));
pag.on("console", (m) => { if (m.type() === "error") errores.push("[console] " + m.text()); });

console.log("abriendo", URL_APP);
await pag.goto(URL_APP, { waitUntil: "networkidle2", timeout: 120000 });
await espera(9000);

// ── utilidades DENTRO de la pagina ────────────────────────────────────────
await pag.evaluate(() => {
  // los controles se buscan por su ETIQUETA: las clases de Tweakpane cambian
  // de nombre al actualizar la libreria, el texto no
  window.__btn = (txt) =>
    Array.from(document.querySelectorAll(".tp-btnv_b, button"))
      .find((b) => (b.textContent || "").includes(txt));
  window.__fila = (txt) =>
    Array.from(document.querySelectorAll(".tp-lblv")).find((r) =>
      ((r.querySelector(".tp-lblv_l") || {}).textContent || "").includes(txt));
  window.__carpeta = (txt) =>
    Array.from(document.querySelectorAll(".tp-fldv_t"))
      .find((f) => (f.textContent || "").includes(txt));
  window.__estado = () => {
    const s = window.__hekatanStates;
    const val = (x) => (x && "val" in x ? x.val : x) || [];
    return {
      nudos: val(s?.nodes).length,
      elementos: val(s?.elements).length,
      barras: val(s?.elements).filter((e) => e.length === 2).length,
      cascaras: val(s?.elements).filter((e) => e.length >= 3).length,
    };
  };
});

const estado = () => pag.evaluate(() => window.__estado());
const abrir = (c) => pag.evaluate((c) => { const f = window.__carpeta(c); if (f) { f.click(); return true; } return false; }, c);
const pulsar = (t) => pag.evaluate((t) => { const b = window.__btn(t); if (b) { b.click(); return true; } return false; }, t);

const bitacora = [];
function anota(paso, ok, antes, despues, nota) {
  const d = {
    paso, ok,
    creado: { nudos: despues.nudos - antes.nudos,
              barras: despues.barras - antes.barras,
              cascaras: despues.cascaras - antes.cascaras },
    nota: nota || "",
  };
  bitacora.push(d);
  console.log(
    `${ok ? "OK " : "NO "} ${paso.padEnd(46)} +${d.creado.nudos}n +${d.creado.barras}b +${d.creado.cascaras}s ${d.nota}`
  );
}

// donde esta el lienzo y donde picar
const lz = await pag.evaluate(() => {
  const c = Array.from(document.querySelectorAll("canvas"))
    .sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
  const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
const P = (fx, fy) => [lz.x + lz.w * fx, lz.y + lz.h * fy];

console.log("\nmodelo de partida:", JSON.stringify(await estado()), "\n");

// ═══ 1. las herramientas de dibujo, ¿estan a la vista? ═══════════════════
const inventario = await pag.evaluate(() => ({
  carpetas: Array.from(document.querySelectorAll(".tp-fldv_t")).map((f) => f.textContent.trim()),
  visibles: Array.from(document.querySelectorAll(".tp-btnv_b"))
    .filter((b) => b.offsetParent !== null).map((b) => b.textContent.trim()),
}));
console.log("carpetas:", inventario.carpetas.length,
            "· botones VISIBLES sin abrir nada:", inventario.visibles.length);

// ═══ 2. dibujar las COLUMNAS ═════════════════════════════════════════════
await abrir("Herramientas CAD");
await abrir("Dibujar");
await espera(600);

let a = await estado();
const okCol = await pulsar("Columna 3D");
await espera(700);
if (okCol) {
  for (const [fx, fy] of [[0.36, 0.62], [0.60, 0.62], [0.36, 0.44], [0.60, 0.44]]) {
    const [x, y] = P(fx, fy);
    await pag.mouse.click(x, y);
    await espera(500);
  }
}
await espera(900);
let b = await estado();
anota("Columna 3D · 4 clics", okCol, a, b,
      okCol ? "" : "no encontre el boton");
await pag.screenshot({ path: join(OUT, "1_columnas.png") });

// ═══ 3. dibujar las VIGAS ════════════════════════════════════════════════
a = b;
const okLin = await pulsar("Línea (frame)");
await espera(700);
if (okLin) {
  for (const [p, q] of [[[0.36, 0.44], [0.60, 0.44]], [[0.36, 0.62], [0.60, 0.62]]]) {
    await pag.mouse.click(...P(...p)); await espera(450);
    await pag.mouse.click(...P(...q)); await espera(450);
    await pag.keyboard.press("Escape"); await espera(350);
  }
}
await espera(800);
b = await estado();
anota("Línea (frame) · 2 vigas", okLin, a, b, okLin ? "" : "no encontre el boton");
await pag.screenshot({ path: join(OUT, "2_vigas.png") });

// ═══ 4. la LOSA ══════════════════════════════════════════════════════════
a = b;
const okArea = await pulsar("Área rectangular");
await espera(700);
if (okArea) {
  await pag.mouse.click(...P(0.36, 0.44)); await espera(500);
  await pag.mouse.click(...P(0.60, 0.62)); await espera(900);
}
await espera(800);
b = await estado();
anota("Área rectangular · 2 clics", okArea, a, b, okArea ? "" : "no encontre el boton");
await pag.screenshot({ path: join(OUT, "3_losa.png") });

// ═══ 5. ¿POR DONDE SE CAMBIA LA SECCION? ════════════════════════════════
const secciones = await pag.evaluate(() => {
  const filas = Array.from(document.querySelectorAll(".tp-lblv")).map((r) => ({
    et: ((r.querySelector(".tp-lblv_l") || {}).textContent || "").trim(),
    visible: r.offsetParent !== null,
    control: r.querySelector("select") ? "lista"
           : r.querySelector('input[type="checkbox"]') ? "casilla"
           : r.querySelector("input") ? "texto" : "?",
  }));
  const botones = Array.from(document.querySelectorAll(".tp-btnv_b"))
    .map((b) => ({ t: b.textContent.trim(), visible: b.offsetParent !== null }));
  const re = /secci|perfil|catalog|asign|material/i;
  return {
    filas: filas.filter((f) => re.test(f.et)),
    botones: botones.filter((b) => re.test(b.t)),
    manualSections: JSON.stringify(window.__hekatanManualSections || null).slice(0, 200),
  };
});
console.log("\n── ¿como se asigna una seccion? ──");
console.log("filas que suenan a seccion:",
  JSON.stringify(secciones.filas.slice(0, 14), null, 1));
console.log("botones:", JSON.stringify(secciones.botones.slice(0, 14)));
console.log("__hekatanManualSections:", secciones.manualSections);

// ═══ 6. ¿y si se SELECCIONA una barra, aparece algo? ════════════════════
a = await estado();
await pag.mouse.click(...P(0.48, 0.44));
await espera(900);
const traSeleccion = await pag.evaluate(() => {
  const nuevos = Array.from(document.querySelectorAll(".tp-lblv, .tp-btnv_b"))
    .filter((e) => e.offsetParent !== null)
    .map((e) => (e.textContent || "").trim())
    .filter((t) => /secci|perfil|asign|propiedad/i.test(t));
  return { conSeleccion: nuevos.slice(0, 10),
           sel: JSON.stringify(window.__hekatanCadState?.selection || null).slice(0, 120) };
});
console.log("\ntras picar una barra:", JSON.stringify(traSeleccion, null, 1));
await pag.screenshot({ path: join(OUT, "4_seleccion.png") });

const fin = await estado();
console.log("\nmodelo final:", JSON.stringify(fin));
console.log("errores de pagina:", errores.length);
errores.slice(0, 5).forEach((e) => console.log("   " + e));

writeFileSync(join(OUT, "informe.json"),
  JSON.stringify({ bitacora, secciones, traSeleccion, fin, errores }, null, 1));
console.log("\n->", join(OUT, "informe.json"));
await nav.close();
