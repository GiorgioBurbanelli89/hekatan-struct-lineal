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
    c.style.cssText = "position:fixed;width:22px;height:22px;pointer-events:none;z-index:99999;" +
      "border:3px solid #d3a53c;border-radius:50%;transform:translate(-50%,-50%);" +
      "background:radial-gradient(circle,#ef4444 35%,transparent 70%);box-shadow:0 0 10px #ef4444;" +
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
