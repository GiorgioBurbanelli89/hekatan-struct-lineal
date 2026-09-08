#!/usr/bin/env node
/**
 * video_escenas.mjs — la interfaz de Hekatan Struct, CAPTURADA EN MOVIMIENTO
 * para los vídeos de Hekatan School.
 *
 *   node cli/video_escenas.mjs inventario          vuelca los mandos del panel (json + png)
 *   node cli/video_escenas.mjs ventana plantilla   una o varias escenas
 *   node cli/video_escenas.mjs todas
 *
 * Cada escena deja sus fotogramas en
 *   hekatan-school/frames_struct_<escena>/f000.png, f001.png, …
 * y el guion .hs los usa con:   centro  struct3d frames_struct_<escena> fps 6
 *
 * Reglas (GUIA_VIDEO.md): ventana ENTERA, tema oscuro, 1280x720 con
 * deviceScaleFactor 2 (sale a 2560x1440, nítido al reducir). Se sirve la web
 * construida (website/src/examples) en local, como hace ctl_ribbon.mjs, con
 * un cursor pintado para que se vea DÓNDE se hace clic.
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, rmSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHOOL = join(__dirname, "..", "..", "hekatan-school");
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4731;
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

let nav = null, pag = null;
const errores = [];
async function navegador() {
  if (nav) { try { await nav.close(); } catch (e) { /* EBUSY del perfil temporal: da igual */ } }
  nav = await puppeteer.launch({ headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
           "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  pag = await nav.newPage();
  await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  pag.on("pageerror", (e) => errores.push(e.message));
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ utiles
let carpeta = null, nf = 0;
function abre(escena) {
  carpeta = join(SCHOOL, `frames_struct_${escena}`);
  rmSync(carpeta, { recursive: true, force: true });
  mkdirSync(carpeta, { recursive: true });
  nf = 0;
  console.log(`\n== ${escena} -> ${carpeta}`);
}
async function foto(n = 1) {
  for (let i = 0; i < n; i++) {
    await pag.screenshot({ path: join(carpeta, `f${String(nf++).padStart(3, "0")}.png`) });
  }
}
async function cargar(query) {
  await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/${query || ""}`,
                 { waitUntil: "networkidle2", timeout: 180000 });
  await espera(6000);
  // el cursor pintado: un punto rojo con aro dorado, grande para que se vea
  // cuando el fotograma se reduce a 1280
  await pag.evaluate(() => {
    if (document.getElementById("vd-cursor")) return;
    const c = document.createElement("div");
    c.id = "vd-cursor";
    // 12 px, no 22: el fotograma ya se graba a 1280x720 y no se reduce después,
    // así que el cursor de 22 px con borde de 3 y sombra de 10 tapaba lo que se
    // estaba dibujando y era más grande que los propios marcadores del programa
    // (7 px). Se queda visible pero a escala de lo que dibuja.
    c.style.cssText = "position:fixed;width:12px;height:12px;pointer-events:none;z-index:99999;" +
      "border:2px solid #d3a53c;border-radius:50%;transform:translate(-50%,-50%);" +
      "background:radial-gradient(circle,#ef4444 35%,transparent 70%);box-shadow:0 0 5px #ef4444;" +
      "left:-80px;top:-80px;transition:none";
    document.body.appendChild(c);
    window.__vdAt = (x, y) => { c.style.left = x + "px"; c.style.top = y + "px"; };
  });
  await pag.keyboard.press("Escape");        // la guía del ribbon, si se abrió sola
  await espera(400);
}
let cur = { x: 640, y: 400 };
async function mover(x, y, pasos = 4, fotos = true) {
  for (let i = 1; i <= pasos; i++) {
    const t = i / pasos, s = t * t * (3 - 2 * t);       // arranca y frena suave
    const px = cur.x + (x - cur.x) * s, py = cur.y + (y - cur.y) * s;
    await pag.evaluate((a, b) => window.__vdAt(a, b), px, py);
    await pag.mouse.move(px, py);
    if (fotos) await foto();
  }
  cur = { x, y };
}
async function centroDe(sel, texto) {
  return pag.evaluate((sel, texto) => {
    let els = Array.from(document.querySelectorAll(sel));
    if (texto) els = els.filter((e) => (e.textContent || "").includes(texto));
    const e = els.find((e) => e.offsetParent !== null && e.getBoundingClientRect().width > 0);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, sel, texto || "");
}
async function clic(sel, texto, esperaMs = 1500, fotosTras = 3) {
  const c = await centroDe(sel, texto);
  if (!c) { console.log(`   [!] no encuentro ${sel} «${texto || ""}»`); return false; }
  await mover(c.x, c.y);
  await foto();
  await pag.mouse.click(c.x, c.y);
  await espera(esperaMs);
  await foto(fotosTras);
  return true;
}
async function boton(texto, esperaMs = 1800, fotosTras = 3) {
  return clic("button.tp-btnv_b, #hk-ribbon button, button", texto, esperaMs, fotosTras);
}
async function tecla(k, esperaMs = 500) {
  await pag.keyboard.press(k);
  await espera(esperaMs);
}
async function escribeComando(txt) {
  const c = await centroDe("#hk3-cmd-input");
  if (!c) { console.log("   [!] no hay línea de comando"); return; }
  await mover(c.x, c.y);
  await pag.mouse.click(c.x, c.y);
  for (const ch of txt) { await pag.keyboard.type(ch); await espera(60); if (Math.random() < 0.5) await foto(); }
  await foto();
  await pag.keyboard.press("Enter");
  await espera(900);
  await foto(2);
}
const modelo = () => pag.evaluate(() => {
  const g = (k) => { const v = window[k]; return v && v.val ? v.val : []; };
  const pls = g("__hekatanDrawingPolylines");
  return { nudos: g("__hekatanDrawingPoints").length,
           tramos: pls.reduce((s, p) => s + Math.max(0, p.length - 1), 0),
           ejes: (window.__hekatanAxisGrids || []).length,
           niveles: (window.__hekatanLevels || []).length };
});
async function desenfoca() {
  // la caja de comandos se queda con el foco y se traga las teclas de vista
  await pag.evaluate(() => document.activeElement && document.activeElement.blur());
  await espera(150);
}
async function autofit() {
  await pag.evaluate(() => window.__hekatanAutoFit?.());
  await espera(900);
}
// Un mando de Tweakpane por su ETIQUETA. Los numeros se escriben con TECLADO
// REAL (clic en la casilla, seleccionar todo, teclear, Enter): un evento
// sintetico no llega al binding y el modelo no cambiaba. Se lee el valor
// despues para comprobar que entro.
async function ajusta(etiqueta, valor, fotosTras = 2) {
  const info = await pag.evaluate((etiqueta) => {
    const fila = Array.from(document.querySelectorAll(".tp-lblv"))
      .find((f) => (f.querySelector(".tp-lblv_l")?.textContent || "").trim().startsWith(etiqueta));
    if (!fila) return null;
    const sel = fila.querySelector("select");
    const inp = fila.querySelector("input[type=text], input[type=number]");
    const chk = fila.querySelector("input[type=checkbox]");
    const e = sel || inp || chk;
    if (!e) return { tipo: "?" };
    const r = e.getBoundingClientRect();
    return { tipo: sel ? "select" : inp ? "input" : "checkbox", x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, etiqueta);
  if (!info || info.tipo === "?") { console.log(`   [!] «${etiqueta}»: sin mando`); return false; }
  await mover(info.x, info.y, 3);
  if (info.tipo === "select") {
    const ok = await pag.evaluate((etiqueta, valor) => {
      const fila = Array.from(document.querySelectorAll(".tp-lblv"))
        .find((f) => (f.querySelector(".tp-lblv_l")?.textContent || "").trim().startsWith(etiqueta));
      const sel = fila.querySelector("select");
      const op = Array.from(sel.options).find((o) => o.textContent.includes(String(valor)) || o.value == valor);
      if (!op) return false;
      sel.value = op.value;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      return sel.options[sel.selectedIndex].textContent;
    }, etiqueta, valor);
    console.log(`   ${etiqueta} = ${ok}`);
  } else if (info.tipo === "checkbox") {
    await pag.mouse.click(info.x, info.y);
  } else {
    // como grabar_ventana.mjs: el setter NATIVO del input y los eventos que
    // Tweakpane escucha; teclear a mano no entraba
    await pag.evaluate((etiqueta, valor) => {
      const fila = Array.from(document.querySelectorAll(".tp-lblv"))
        .find((f) => (f.querySelector(".tp-lblv_l")?.textContent || "").trim().startsWith(etiqueta));
      const i = fila.querySelector("input[type=text], input[type=number]");
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      set.call(i, String(valor));
      i.dispatchEvent(new Event("input", { bubbles: true }));
      i.dispatchEvent(new Event("change", { bubbles: true }));
      i.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    }, etiqueta, valor);
    await espera(300);
    const leido = await pag.evaluate((etiqueta) => {
      const fila = Array.from(document.querySelectorAll(".tp-lblv"))
        .find((f) => (f.querySelector(".tp-lblv_l")?.textContent || "").trim().startsWith(etiqueta));
      return fila.querySelector("input[type=text], input[type=number]").value;
    }, etiqueta);
    console.log(`   ${etiqueta} = ${leido}`);
  }
  await espera(900);
  await foto(fotosTras);
  return true;
}
async function cursorA(etiqueta) {
  const c = await pag.evaluate((etiqueta) => {
    const fila = Array.from(document.querySelectorAll(".tp-lblv"))
      .find((f) => (f.querySelector(".tp-lblv_l")?.textContent || "").trim().startsWith(etiqueta));
    if (!fila) return null;
    const r = (fila.querySelector(".tp-lblv_v") || fila).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, etiqueta);
  if (c) await mover(c.x, c.y);
  return !!c;
}
async function carpetaPane(titulo) {
  // abre (si está cerrada) una carpeta de Tweakpane por su título; si ya está
  // abierta solo lleva el cursor, para no cerrarla
  const abierta = await pag.evaluate((t) => {
    const f = Array.from(document.querySelectorAll(".tp-fldv"))
      .find((x) => (x.querySelector(".tp-fldv_t")?.textContent || "").includes(t));
    return f ? f.classList.contains("tp-fldv-expanded") : null;
  }, titulo);
  if (abierta === null) { console.log(`   [!] no hay carpeta «${titulo}»`); return false; }
  if (abierta) { const c = await centroDe(".tp-fldv_t", titulo); if (c) await mover(c.x, c.y, 3); return true; }
  return clic(".tp-fldv_t", titulo, 800, 2);
}

// ------------------------------------------------------------------ inventario
async function inventario() {
  const salida = join(SCHOOL, "struct_inventario");
  mkdirSync(salida, { recursive: true });
  const dump = async (nombre) => {
    const inv = await pag.evaluate(() => {
      const vis = (e) => e.offsetParent !== null && e.getBoundingClientRect().width > 0;
      const box = (e) => { const r = e.getBoundingClientRect();
        return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
      const paneles = Array.from(document.querySelectorAll(".tp-rotv")).filter(vis).map((p) => ({
        titulo: (p.querySelector(".tp-rotv_t") || {}).textContent, caja: box(p),
        carpetas: Array.from(p.querySelectorAll(".tp-fldv")).map((f) => ({
          titulo: (f.querySelector(".tp-fldv_t") || {}).textContent?.trim(),
          abierta: f.classList.contains("tp-fldv-expanded"),
          mandos: Array.from(f.querySelectorAll(".tp-lblv, .tp-btnv"))
            .filter((m) => m.closest(".tp-fldv") === f)
            .map((m) => {
              const et = m.querySelector(".tp-lblv_l")?.textContent?.trim();
              const b = m.querySelector(".tp-btnv_b");
              const sel = m.querySelector("select");
              const inp = m.querySelector("input");
              return { etiqueta: et || (b ? "[botón] " + b.textContent.trim() : "?"),
                       tipo: b ? "boton" : sel ? "select" : inp ? inp.type : "?",
                       valor: sel ? sel.options[sel.selectedIndex]?.textContent : inp ? inp.value : undefined,
                       opciones: sel ? Array.from(sel.options).map((o) => o.textContent) : undefined };
            }),
        })),
      }));
      const ribbon = Array.from(document.querySelectorAll("#hk-ribbon button")).filter(vis)
        .map((b) => ({ texto: b.textContent.trim().slice(0, 30), caja: box(b) }));
      const ids = Array.from(document.querySelectorAll("[id]")).filter(vis)
        .map((e) => ({ id: e.id, caja: box(e) })).filter((e) => e.caja[2] > 30 && e.caja[3] > 10);
      const selects = Array.from(document.querySelectorAll("select")).filter(vis)
        .map((s) => ({ opciones: Array.from(s.options).map((o) => o.textContent), caja: box(s) }));
      return { titulo: document.title, paneles, ribbon, ids, selects };
    });
    writeFileSync(join(salida, `${nombre}.json`), JSON.stringify(inv, null, 1));
    await pag.screenshot({ path: join(salida, `${nombre}.png`) });
    const n = inv.paneles.reduce((s, p) => s + p.carpetas.reduce((t, c) => t + c.mandos.length, 0), 0);
    console.log(`   ${nombre}: ${inv.paneles.length} paneles, ${n} mandos, ${inv.ribbon.length} botones ribbon, ${inv.selects.length} selects`);
  };
  await cargar("");
  await dump("defecto");
  await cargar("?t=plantillas");
  await dump("plantillas");
  // abrir todas las carpetas del panel de la izquierda para ver sus mandos
  await pag.evaluate(() => document.querySelectorAll(".tp-fldv:not(.tp-fldv-expanded) > .tp-fldv_b").forEach((b) => b.click()));
  await espera(800);
  await dump("plantillas_abierto");
  await cargar("?t=new-blank");
  await dump("blanco");
  console.log("->", salida);
}

// ------------------------------------------------------------------ escenas
const ESCENAS = {
  async sonda() {
    abre("sonda");
    await cargar("?t=plantillas");
    const g = await pag.evaluate(() => ({
      settings: window.__hekatanSettings ? Object.keys(window.__hekatanSettings).slice(0, 40) : null,
      settingsVal: window.__hekatanSettings?.val ? Object.keys(window.__hekatanSettings.val).slice(0, 60) : null,
      params: window.__hekatanParams ? Object.keys(window.__hekatanParams).slice(0, 40) : null,
      rebuild: typeof window.__hekatanRebuild,
    }));
    console.log(JSON.stringify(g, null, 1));
    await carpetaPane("Analyze");
    await ajusta("Scale Z", 200, 1);
    await ajusta("Frame results", "Moment 3-3 (diagram)", 1);
  },
  // 1. la ventana al abrir: recorrido del cursor por las zonas
  async ventana() {
    abre("ventana");
    await cargar("");
    await foto(4);
    const zonas = [
      [".tp-rotv_t", "Settings"], [".tp-fldv_t", "Nuevo modelo"], ["#viewer canvas", ""],
      ["#hk3-cmd-input", ""],
    ];
    for (const [sel, txt] of zonas) {
      const c = await centroDe(sel, txt);
      if (c) { await mover(c.x, c.y, 5); await foto(3); }
    }
  },
  // 2. una plantilla: se pulsa y la estructura llega armada; luego las vistas
  async plantilla() {
    abre("plantilla");
    await cargar("");
    await foto(2);
    await boton("Pórtico 3D", 9000, 4);
    await autofit();
    await foto(4);
    await carpetaPane("Vista");
    for (const v of ["Planta (X-Y)", "Elevación X", "Isométrica"]) {
      if (await boton(v, 1500, 3)) { await autofit(); await foto(2); }
    }
  },
  // 3. la deformada: se enciende y se amplifica paso a paso
  async deformada() {
    abre("deformada");
    await cargar("?t=plantillas");
    await autofit();
    await foto(3);
    await carpetaPane("Analyze");
    await cursorA("Deformed shape");
    await foto(2);
    await cursorA("Scale XY");
    for (const v of [1, 10, 30, 60, 120, 250]) await ajusta("Scale XY", v, 2);
  },
  // 4. los resultados: caso, diagramas en barras, colores en cáscaras
  async resultados() {
    abre("resultados");
    await cargar("?t=plantillas");
    await autofit();
    await foto(2);
    await carpetaPane("Analyze");
    await cursorA("Frame results");
    for (const v of ["Moment 3-3 (diagram)", "Shear 2-2 (diagram)", "Axial Force (diagram)"]) await ajusta("Frame results", v, 3);
    await ajusta("Frame results", "none", 1);
    await cursorA("Shell results");
    for (const v of ["Uz", "M11", "MMax"]) await ajusta("Shell results", v, 3);
    await cursorA("Case results");
    for (const v of ["Live", "1.2D+1.6L", "Dead"]) await ajusta("Case results", v, 3);
  },
  // 5. el modal: se corre y la estructura vibra
  async modal() {
    abre("modal");
    await cargar("?t=plantillas");
    await autofit();
    await foto(2);
    await carpetaPane("Modal + Animación");
    await boton("Correr modal + animar", 6000, 2);
    for (let i = 0; i < 14; i++) { await espera(160); await foto(); }
    await cursorA("Modo #");
    await ajusta("Modo #", 2, 2);
    for (let i = 0; i < 10; i++) { await espera(160); await foto(); }
    await boton("Detener y restaurar", 1200, 2);
  },
  // 6. las tablas: reacciones en la base, periodos
  async tablas() {
    abre("tablas");
    await cargar("?t=plantillas");
    await autofit();
    await foto(2);
    // las tablas piden el modal corrido: sin el, «Base Reactions» solo avisa
    await carpetaPane("Modal + Animación");
    await boton("Correr modal + animar", 7000, 2);
    await boton("Detener y restaurar", 1500, 1);
    await carpetaPane("Tablas");
    await boton("Base Reactions", 2500, 4);
    await tecla("Escape", 800); await foto(1);
    await boton("Modal Periods", 5000, 4);
    await tecla("Escape", 800); await foto(1);
  },
  // 7-9. el lienzo en blanco, en TRES escenas (vídeo 2 «Dibujar desde cero»):
  //   cad_rejilla: los tres campos (vanos X, vanos Y, pisos) y el botón Rejilla
  //   cad_vistas : teclas 1 2 3 4 (planta, frente, lado, 3D) con el cursor en su botón
  //   cad_linea  : tecla L y dos vigas escritas en la línea de comando
  // Lo aprendido con la escena `cad` vieja: (a) la cámara no encuadra la
  // rejilla si el autofit va antes de que el modelo se haya dibujado; (b) las
  // teclas 1-4 y L NO sirven aquí: la caja de comandos se vuelve a enfocar
  // sola 60 ms después de cualquier blur (keepCmdFocus en main.ts) y, con la
  // caja enfocada, el ribbon ignora los dígitos a propósito (getCadRibbon.ts:
  // «4,0,6» perdía el 4). Medido: la tecla acababa ESCRITA en la caja («4l»).
  // Así que vistas y herramientas van por sus BOTONES del ribbon, con el cursor.
  async cad_rejilla() {
    abre("cad_rejilla");
    await cargar("?t=new-blank");
    await foto(4);
    console.log("   antes:", JSON.stringify(await modelo()));
    // el cursor pasa por los tres campos para que se lea qué son
    for (const t of ["Vanos en X", "Vanos en Y", "Alturas de piso"]) {
      const c = await centroInput(t);
      if (c) { await mover(c.x, c.y, 5); await foto(3); }
    }
    await clic("#hk-ribbon button", "Rejilla", 2500, 2);
    console.log("   tras Rejilla:", JSON.stringify(await modelo()));
    await encuadra(); await foto(5);
    // y la vista 3D encuadrada, por su botón
    await vistaBoton("3D"); await foto(5);
  },
  async cad_vistas() {
    abre("cad_vistas");
    await cargar("?t=new-blank");
    await rejillaRapida();
    await vistaBoton("3D"); await foto(3);
    for (const nom of ["Planta", "Frente", "Lado", "3D"]) { await vistaBoton(nom); await foto(5); }
  },
  async cad_linea() {
    abre("cad_linea");
    await cargar("?t=new-blank");
    await rejillaRapida();
    await vistaBoton("3D"); await foto(3);
    const antes = await modelo();
    console.log("   antes:", JSON.stringify(antes));
    // el botón «Línea» del ribbon (la tecla L no entra: ver nota de arriba)
    await limpiaComando();
    await clic("#hk-ribbon button", "Línea", 700, 3);
    console.log("   herramienta:", await pag.evaluate(() => window.__hekatanCadState?.get?.()?.tool));
    // dos vigas del primer piso, de A a B y de B hacia el eje 2, escritas.
    // Coordenadas ABSOLUTAS: el relativo «@6,0,0» tras un punto TECLEADO no
    // entraba (drawing.ts solo fijaba rubberStart con el ratón; corregido en
    // la fuente el 8-sep, pero la web construida que se captura es la anterior).
    await escribeComando("0,0,3");
    await escribeComando("6,0,3");
    await escribeComando("6,5,3");
    await tecla("Escape", 600);
    const despues = await modelo();
    console.log("   tras línea:", JSON.stringify(despues), "tramos nuevos:", despues.tramos - antes.tramos);
    await desenfoca();
    await encuadra(); await foto(6);
  },
  // 10. UNA CERCHA desde cero, con la ventana de comandos nueva (8-sep-2026):
  //   cordones por POLILINEA tecleada, un montante por LINEA, seleccion por
  //   VENTANA con el raton y COPIAR, diagonales, APOYOS y CARGAS por clic en los
  //   nudos, y el diagrama de axiles y momentos. Pensada para un GIF: la
  //   ventana ENTERA (ribbon, paneles, ventana de comandos, barra de estado).
  // MODELO NUEVO de cero, con la ventana ENTERA a la vista: los 25 botones del
  // ribbon caben a 1280x720 (medido con `cli/_botones_caben.mjs`).
  //
  // Lo aprendido en el primer intento, para no repetirlo:
  //  · las teclas de vista (1/2/3/4) se ESCRIBEN en la caja de comandos si tiene
  //    el foco: salió «4col» y activó CÍRCULO. Se usan los BOTONES (`vistaBoton`),
  //    que además es lo que se quiere enseñar.
  //  · sin `encuadra()` el modelo de 6x5 m sale como un punto en una rejilla de 20 m.
  async modelo_nuevo() {
    abre("modelo_nuevo");
    await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    await cargar("?t=new-blank");
    await espera(600);
    await pag.keyboard.press("Escape");            // la guía «Cómo usar»
    await espera(400);
    await foto(10);                                 // la ventana entera, quieta

    // Y hacia ABAJO en pantalla, lejos del ribbon
    const ESQUINAS = [[0, 0], [6, 0], [6, -5], [0, -5]];
    const cmd = async (txt, tras = 400) => {
      await limpiaComando();
      const c = await centroDe("#hk3-cmd-input");
      if (c) await pag.mouse.click(c.x, c.y);
      await pag.keyboard.type(txt, { delay: 32 });
      await foto();
      await pag.keyboard.press("Enter");
      await espera(tras);
      await foto();
    };
    const esc = async () => { await pag.keyboard.press("Escape"); await espera(300); await foto(); };
    const pantalla = (x, y, z) => pag.evaluate((wx, wy, wz) => {
      const v = document.querySelector("#viewer"); const cv = v.querySelector("canvas");
      const r = cv.getBoundingClientRect(); const cam = v.__ctx.camera; cam.updateMatrixWorld();
      const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
      const tx = mv[0]*wx + mv[4]*wy + mv[8]*wz + mv[12], ty = mv[1]*wx + mv[5]*wy + mv[9]*wz + mv[13];
      const tz = mv[2]*wx + mv[6]*wy + mv[10]*wz + mv[14], tw = mv[3]*wx + mv[7]*wy + mv[11]*wz + mv[15];
      const cx = m[0]*tx + m[4]*ty + m[8]*tz + m[12]*tw, cy = m[1]*tx + m[5]*ty + m[9]*tz + m[13]*tw;
      const cw = m[3]*tx + m[7]*ty + m[11]*tz + m[15]*tw;
      return { x: r.left + (cx / cw + 1) / 2 * r.width, y: r.top + (1 - cy / cw) / 2 * r.height };
    }, x, y, z);
    // ⚠️ El ribbon ocupa el centro-ARRIBA del lienzo (y de 40 a 276): un punto del
    // modelo que caiga ahí recibe el clic el BOTÓN, no el dibujo — en el primer
    // intento solo entraron 2 de los 4 vértices y nadie avisó. Se comprueba antes
    // de clicar y se dice en el log.
    const clicMundo = async (x, y, z, fotos = 2) => {
      const c = await pantalla(x, y, z);
      const tapado = await pag.evaluate(({ x: px, y: py }) => {
        const e = document.elementFromPoint(px, py);
        return e ? !(e.tagName === "CANVAS") : true;
      }, c);
      if (tapado) { console.log(`   ⚠️ (${x},${y},${z}) cae bajo un panel: no se clica`); return false; }
      await mover(c.x, c.y, 4);
      await pag.mouse.click(c.x, c.y);
      await espera(380);
      await foto(fotos);
      return true;
    };

    // ── 1) el cursor pasea por los botones, para que se vean uno a uno ──────
    const cajas = await pag.evaluate(() => [...document.querySelectorAll("#hk-ribbon button")]
      .slice(0, 12).map((b) => { const r = b.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }));
    for (const c of cajas) { await mover(c.x, c.y, 2); await foto(); }

    // ── 2) el contorno en planta, por polilínea, con el ratón ───────────────
    await vistaBoton("Planta"); await foto(4);
    await cmd("pl");
    for (const [x, y] of ESQUINAS) await clicMundo(x, y, 0);
    // la opción «Cerrar» que ahora se PULSA junto al cursor (8-sep-2026)
    const bCerrar = await pag.evaluate(() => {
      const b = [...document.querySelectorAll("#hk-dyn-ops button")].find((q) => /cerrar/i.test(q.textContent || ""));
      if (!b) return null; const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (bCerrar) { await mover(bCerrar.x, bCerrar.y, 6); await foto(4); await pag.mouse.click(bCerrar.x, bCerrar.y); await espera(600); await foto(5); }
    else { await cmd("c"); }
    console.log("   tras el contorno:", JSON.stringify(await modelo()));

    // ── 3) las cuatro columnas, en 3D ──────────────────────────────────────
    await vistaBoton("3D"); await foto(5);
    // Las columnas POR COORDENADAS: en 3D el ribbon tapa parte del modelo y los
    // clics caían sobre él (medido: 4 de 8). Tecleadas siempre entran, y de paso
    // se ve trabajar la ventana de comandos.
    await cmd("col");
    for (const [x, y] of ESQUINAS) { await cmd(`${x},${y},0`, 300); await cmd(`${x},${y},3`, 450); }
    await esc();
    await encuadra(); await foto(6);
    console.log("   tras las columnas:", JSON.stringify(await modelo()));

    // ── 4) apoyos empotrados en la base ────────────────────────────────────
    await cmd("ap");
    for (const [x, y] of ESQUINAS) await cmd(`${x},${y},0`, 400);
    await esc();
    await foto(8);
    console.log("   final:", JSON.stringify(await modelo()));
  },
  async cercha() {
    abre("cercha");
    await pag.setViewport({ width: 1280, height: 760, deviceScaleFactor: 1 });
    await cargar("?t=new-blank");
    await espera(800);
    await pag.keyboard.press("Escape");           // la guia «Como usar»
    await espera(400);
    await foto(3);
    const cmd = async (txt) => {
      const c = await centroDe("#hk3-cmd-input");
      if (c) { await pag.mouse.click(c.x, c.y); }
      await pag.keyboard.type(txt, { delay: 35 });
      await foto();
      await pag.keyboard.press("Enter");
      await espera(350);
      await foto();
    };
    const esc = async () => { await pag.keyboard.press("Escape"); await espera(250); };
    const pantalla = (x, y, z) => pag.evaluate((wx, wy, wz) => {
      const v = document.querySelector("#viewer"); const cv = v.querySelector("canvas"); const r = cv.getBoundingClientRect();
      const cam = v.__ctx.camera; cam.updateMatrixWorld();
      const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
      const tx = mv[0]*wx + mv[4]*wy + mv[8]*wz + mv[12], ty = mv[1]*wx + mv[5]*wy + mv[9]*wz + mv[13];
      const tz = mv[2]*wx + mv[6]*wy + mv[10]*wz + mv[14], tw = mv[3]*wx + mv[7]*wy + mv[11]*wz + mv[15];
      const cx = m[0]*tx + m[4]*ty + m[8]*tz + m[12]*tw, cy = m[1]*tx + m[5]*ty + m[9]*tz + m[13]*tw;
      const cw = m[3]*tx + m[7]*ty + m[11]*tz + m[15]*tw;
      return { x: r.left + (cx / cw + 1) / 2 * r.width, y: r.top + (1 - cy / cw) / 2 * r.height };
    }, x, y, z);
    const clicMundo = async (x, y, z) => {
      const c = await pantalla(x, y, z);
      await mover(c.x, c.y, 3);
      await pag.mouse.click(c.x, c.y);
      await espera(400);
      await foto(2);
    };
    const modelo3 = () => pag.evaluate(() => ({
      nudos: window.__hekatanDrawingPoints.val.length,
      tramos: window.__hekatanDrawingPolylines.val.reduce((s, p) => s + Math.max(0, p.length - 1), 0),
    }));

    // vista de FRENTE (X-Z): la cercha vive en ese plano
    await pag.keyboard.press("2"); await espera(600); await foto(2);
    // cordon inferior y superior por polilinea tecleada
    await cmd("pl"); for (const p of ["0,0,0", "3,0,0", "6,0,0", "9,0,0", "12,0,0"]) await cmd(p); await esc();
    await autofit(); await foto(2);
    await cmd("pl"); for (const p of ["0,0,2", "3,0,2", "6,0,2", "9,0,2", "12,0,2"]) await cmd(p); await esc();
    await autofit(); await foto(2);
    console.log("   cordones:", JSON.stringify(await modelo3()));
    // un montante por linea, y se COPIA dos veces con seleccion por ventana
    await cmd("l"); await cmd("3,0,0"); await cmd("3,0,2"); await esc();
    // seleccion por VENTANA: clic en una esquina, mover, clic en la otra
    // (izquierda -> derecha = ventana). Arrastrar con el boton apretado ORBITA.
    const a = await pantalla(1.8, 0, 3.2), b = await pantalla(4.2, 0, -1.2);   // lejos de los nudos: el iman (0,75 m) los cogeria
    await mover(a.x, a.y, 3); await pag.mouse.click(a.x, a.y); await espera(200); await foto();
    await mover(b.x, b.y, 6); await pag.mouse.click(b.x, b.y); await espera(400); await foto(2);
    console.log("   seleccion:", await pag.evaluate(() => [...window.__hekatanSelection]));
    await cmd("co"); await cmd("3,0,0"); await cmd("6,0,0");
    await cmd("co"); await cmd("3,0,0"); await cmd("9,0,0");
    await esc(); await foto(2);
    // diagonales tipo Pratt, hacia el centro
    for (const [p1, p2] of [["0,0,0", "3,0,2"], ["3,0,0", "6,0,2"], ["9,0,0", "6,0,2"], ["12,0,0", "9,0,2"]]) {
      await cmd("l"); await cmd(p1); await cmd(p2); await esc();
    }
    await foto(2);
    console.log("   cercha:", JSON.stringify(await modelo3()));
    // apoyos en los extremos y cargas en los nudos superiores, por clic
    await cmd("ap");
    await clicMundo(0, 0, 0); await clicMundo(12, 0, 0);
    await cmd("cg");
    await clicMundo(3, 0, 2); await clicMundo(6, 0, 2); await clicMundo(9, 0, 2);
    await esc(); await desenfoca(); await espera(800); await foto(3);
    // resultados: axil y momento en las barras
    await carpetaPane("Analyze");
    await cursorA("Frame results");
    await ajusta("Frame results", "Axial Force (diagram)", 4);
    await ajusta("Frame results", "Moment 3-3 (diagram)", 4);
    await foto(4);
  },
};
async function centroInput(titulo) {
  return pag.evaluate((t) => {
    const e = Array.from(document.querySelectorAll("#hk-ribbon input"))
      .find((i) => (i.title || "").startsWith(t) && i.getBoundingClientRect().width > 0);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, titulo);
}
const camara = () => pag.evaluate(() => {
  const c = document.querySelector("#viewer")?.__ctx?.camera;
  return c ? [c.isOrthographicCamera ? "orto" : "persp",
              ...[c.position.x, c.position.y, c.position.z].map((v) => +v.toFixed(1))] : null;
});
async function encuadra() {
  // el modelo tarda en dibujarse: autofit dos veces con pausa, y una foto entre medias
  await espera(1200); await autofit(); await espera(600); await autofit(); await espera(400);
}
async function vistaBoton(nom) {
  await clic("#hk-ribbon button", nom, 1200, 2);
  await encuadra();
  console.log(`   vista ${nom} -> cámara ${JSON.stringify(await camara())}`);
}
async function limpiaComando() {
  await pag.evaluate(() => {
    for (const id of ["hk3-cmd-input", "hk-dyn-input"]) {
      const i = document.getElementById(id); if (i) i.value = "";
    }
    const g = document.getElementById("hk3-cmd-ghost"); if (g) g.innerHTML = "";
  });
}
async function rejillaRapida() {
  // la rejilla sin ceremonia (ya se enseñó en cad_rejilla)
  await pag.evaluate(() => Array.from(document.querySelectorAll("#hk-ribbon button"))
    .find((b) => (b.textContent || "").includes("Rejilla"))?.click());
  await espera(2500);
  console.log("   rejilla:", JSON.stringify(await modelo()));
}

// ------------------------------------------------------------------ main
const pedidas = process.argv.slice(2);
try {
  if (!pedidas.length || pedidas.includes("inventario")) { await navegador(); await inventario(); }
  const lista = pedidas.includes("todas") ? Object.keys(ESCENAS).filter((e) => e !== "sonda") : pedidas.filter((e) => ESCENAS[e]);
  for (const e of lista) {
    await navegador();
    try { await ESCENAS[e](); console.log(`   ${nf} fotogramas`); }
    catch (err) { console.log(`   [!] la escena ${e} falló: ${String(err).slice(0, 200)}`); }
  }
} finally {
  if (errores.length) console.log("errores de página:", errores.slice(0, 5));
  try { if (nav) await nav.close(); } catch (e) { /* EBUSY */ }
  srv.close();
}
