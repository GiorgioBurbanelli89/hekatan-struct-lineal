#!/usr/bin/env node
/**
 * ¿QUE SOBRA EN EL PANE?
 *
 *   node cli/auditar_pane.mjs [base]
 *
 * Abre la aplicacion en dos situaciones —un modelo YA HECHO (una plantilla) y
 * uno NUEVO (lienzo en blanco)— y saca el arbol entero del Tweakpane: carpeta
 * por carpeta, fila por fila, con su tipo de control y si esta a la vista.
 *
 * Y marca lo que sobra con criterios que se pueden COMPROBAR, no de opinion:
 *
 *   VACIA      la fila no tiene control ninguno, o su valor es "—"
 *   REPETIDA   la misma etiqueta sale mas de una vez en el mismo escenario
 *   NO-APLICA  control de GEOMETRIA PARAMETRICA (vanos, alturas, n de pisos)
 *              con un modelo que NO es parametrico: moverlo no ajusta nada,
 *              RECONSTRUYE y se lleva por delante lo que hubiera dibujado
 *   SOLO-OTRO  aparece en un escenario y en el otro no tiene sentido
 *
 * La salida es una tabla para decidir que se quita, no un veredicto.
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "pane");
mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || "http://localhost:4600/workspace/";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// geometria parametrica: lo que RECONSTRUYE el modelo al tocarlo
const RE_PARAM = /vano|van?os |altura|piso \d|n[ºo°]? de pisos|nx|ny|div\.|divisiones|luz |crujia|separaci[oó]n/i;

const nav = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader",
         "--enable-webgl", "--ignore-gpu-blocklist"],
});

async function inventario(t, mote) {
  const pag = await nav.newPage();
  await pag.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  const url = `${BASE}?t=${t}`;
  await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
  await espera(10000);
  // abrir TODAS las carpetas: lo que esta plegado tambien ocupa sitio y confunde
  await pag.evaluate(() => {
    document.querySelectorAll(".tp-fldv_t").forEach((f) => {
      const c = f.parentElement && f.parentElement.querySelector(".tp-fldv_c");
      if (c && getComputedStyle(c).display === "none") f.click();
    });
  });
  await espera(1800);

  // Recorrer la estructura de Tweakpane por sus contenedores no funciono: el
  // arbol cambia de forma entre versiones. Se enumera en ORDEN DE DOM y la
  // carpeta se deduce del ultimo titulo de carpeta visto, que es lo que ve el
  // que mira la pantalla de arriba abajo.
  const datos = await pag.evaluate(() => {
    const sel = ".tp-fldv_t, .tp-lblv, .tp-btnv_b, .tp-rotv_t";
    const nodos = Array.from(document.querySelectorAll(sel));
    const filas = [];
    let carpeta = "(raiz)";
    for (const n of nodos) {
      const cls = (n.className || "").toString();
      const vis = n.offsetParent !== null;
      if (cls.includes("tp-fldv_t") || cls.includes("tp-rotv_t")) {
        carpeta = n.textContent.trim();
        filas.push({ tipo: "carpeta", carpeta: "", et: carpeta, vis });
      } else if (cls.includes("tp-lblv")) {
        const l = n.querySelector(".tp-lblv_l");
        const ctl = n.querySelector("select") ? "lista"
                  : n.querySelector('input[type="checkbox"]') ? "casilla"
                  : n.querySelector("input") ? "texto"
                  : n.querySelector("textarea") ? "area" : "";
        filas.push({ tipo: "fila", carpeta, et: l ? l.textContent.trim() : "",
                     ctl, val: (n.querySelector("input") || {}).value || "", vis });
      } else {
        filas.push({ tipo: "boton", carpeta, et: n.textContent.trim(), vis });
      }
    }
    return filas;
  });
  await pag.screenshot({ path: join(OUT, `pane_${mote}.png`), fullPage: false });
  await pag.close();
  return datos;
}

const hecho = await inventario("test-m-dual", "hecho");
const nuevo = await inventario("new-blank", "nuevo");
await nav.close();

function analiza(filas, mote) {
  const vistas = new Map();
  const marcas = [];
  for (const f of filas) {
    if (f.tipo !== "fila" && f.tipo !== "boton") continue;
    const clave = (f.carpeta + "|" + f.et).toLowerCase();
    const n = (vistas.get(f.et.toLowerCase()) || 0) + 1;
    vistas.set(f.et.toLowerCase(), n);
    const m = [];
    if (f.tipo === "fila" && !f.ctl) m.push("VACIA");
    if (f.tipo === "fila" && (f.val === "—" || f.val === "-")) m.push("VACIA");
    if (n > 1 && f.et) m.push("REPETIDA");
    if (RE_PARAM.test(f.et)) m.push("PARAM");
    if (m.length) marcas.push({ ...f, marcas: m.join("+") });
  }
  console.log(`\n═══ ${mote} · ${filas.length} entradas ` +
              `(${filas.filter(f=>f.tipo==="carpeta").length} carpetas, ` +
              `${filas.filter(f=>f.tipo==="fila").length} filas, ` +
              `${filas.filter(f=>f.tipo==="boton").length} botones)`);
  console.log(`   marcadas: ${marcas.length}`);
  for (const m of marcas.slice(0, 45))
    console.log(`   ${m.marcas.padEnd(16)} ${(m.carpeta || "(raiz)").slice(0, 34).padEnd(35)} ${m.et.slice(0, 46)}`);
  return marcas;
}

const mh = analiza(hecho, "MODELO YA HECHO (test-m-dual)");
const mn = analiza(nuevo, "MODELO NUEVO (lienzo en blanco)");

// lo que sale en el NUEVO y es geometria parametrica no tiene a que aplicarse
const paramEnNuevo = mn.filter((m) => m.marcas.includes("PARAM"));
console.log(`\n>> geometria parametrica visible en LIENZO EN BLANCO: ${paramEnNuevo.length}`);

writeFileSync(join(OUT, "auditoria.json"),
  JSON.stringify({ hecho, nuevo, marcasHecho: mh, marcasNuevo: mn }, null, 1));
console.log("->", join(OUT, "auditoria.json"));
