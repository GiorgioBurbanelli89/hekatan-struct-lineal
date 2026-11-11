#!/usr/bin/env node
/**
 * MCP de Hekatan Struct (CAD web).
 *
 * Abre el CAD publicado en un Chrome controlado y deja que Claude:
 *   - VEA (captura de pantalla) y sepa qué botones existen;
 *   - ELIJA herramientas (botones del panel) y DIBUJE con clics reales;
 *   - LEA lo dibujado (nudos, polilíneas, áreas).
 *
 * Seguridad: solo abre el sitio de HEKATAN_URL (o localhost). No ejecuta JavaScript
 * arbitrario, no lee ni escribe archivos del disco.
 *
 *   HEKATAN_URL   base del workspace   (def. https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/)
 *   HEKATAN_VISIBLE=1  ventana visible (def. sin ventana)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import puppeteer from "puppeteer";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.env.HEKATAN_URL ||
  "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";
const ORIGEN = new URL(BASE).origin;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

let nav = null, pag = null;
const consola = [];


const VISIBLE = !!process.env.HEKATAN_VISIBLE;
/** Mueve el ratón. Con ventana visible: movimiento lento y un punto rojo para seguirlo con la vista. */
async function mover(x, y) {
  if (VISIBLE) {
    await pag.evaluate((x, y) => {
      let d = document.getElementById("mcp-punto");
      if (!d) { d = document.createElement("div"); d.id = "mcp-punto";
        d.style.cssText = "position:fixed;width:2px;height:2px;margin:-1px 0 0 -1px;border:0;border-radius:50%;background:#ef4444;box-shadow:none;pointer-events:none;z-index:2147483647;transition:left .35s,top .35s";
        document.body.appendChild(d); }
      d.style.left = x + "px"; d.style.top = y + "px";
    }, x, y);
    await pag.mouse.move(x, y, { steps: 12 });
    await esperar(450);
  } else { await pag.mouse.move(x, y); await esperar(120); }
}

const srv = new McpServer({ name: "hekatan-struct", version: "0.1.0" });
const texto = (t) => ({ content: [{ type: "text", text: typeof t === "string" ? t : JSON.stringify(t, null, 2) }] });
const falla = (t) => ({ isError: true, content: [{ type: "text", text: t }] });

let procChrome = null;   // el Chrome que abrimos nosotros (el único que se cierra al terminar)
async function lanzar() {
  if (!VISIBLE) {
    const args = ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--window-size=1500,1000"];
    try { return await puppeteer.launch({ headless: "new", args, channel: "chrome" }); }
    catch { return await puppeteer.launch({ headless: "new", args }); }
  }
  // Ventana VISIBLE: se abre Chrome como lo abriría una persona (con las opciones de automatización
  // de puppeteer la ventana se queda en blanco) y luego se conecta por el puerto de depuración.
  const candidatos = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].filter(Boolean);
  const exe = candidatos.find((c) => existsSync(c));
  if (!exe) throw new Error("No encuentro chrome.exe (define CHROME_PATH).");
  const puerto = 9300 + Math.floor(Math.random() * 90);
  // perfil UNICO por lanzamiento: con solo el puerto (90 valores) se reusaba un perfil viejo y el CAD "nuevo"
  // abria con el dibujo de otra sesion (localStorage: se vieron los arcos del galpon curvo en new-blank)
  const perfil = join(tmpdir(), `hekatan-mcp-chrome-${process.pid}-${Date.now()}`);
  procChrome = spawn(exe, [`--remote-debugging-port=${puerto}`, `--user-data-dir=${perfil}`, "--no-first-run",
    "--no-default-browser-check", "--window-size=1500,950", "--window-position=60,40", "about:blank"], { stdio: "ignore" });
  const url = `http://127.0.0.1:${puerto}`;
  for (let i = 0; i < 60; i++) { try { if ((await fetch(url + "/json/version")).ok) break; } catch {} await esperar(500); }
  const b = await puppeteer.connect({ browserURL: url, defaultViewport: null });
  return b;
}
const cerrarChrome = async () => {
  try { if (nav) await nav.close(); } catch {}
  try { if (procChrome) procChrome.kill(); } catch {}
  procChrome = null;
};
const necesitaPagina = () => (pag && !pag.isClosed() ? null : falla("No hay CAD abierto. Llama primero a `abrir`."));

/** Rectángulo del lienzo 3D en píxeles de la página. */
const lienzo = () => pag.evaluate(() => {
  const c = document.querySelector("#viewer canvas") || document.querySelector("canvas");
  if (!c) return null;
  const r = c.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
});

async function clicEn(fx, fy) {
  const cv = await lienzo();
  if (!cv) throw new Error("No encuentro el lienzo.");
  const x = cv.x + cv.w * fx, y = cv.y + cv.h * fy;
  await mover(x, y);
  await pag.mouse.click(x, y);
  await esperar(250);
}

// ── abrir / cerrar ──────────────────────────────────────────────────────────
srv.tool("abrir",
  "Abre el CAD web de Hekatan Struct. `ejemplo` es el plantilla (?t=): new-blank, plane, etc. Cierra los paneles laterales para que no tapen el lienzo.",
  { ejemplo: z.string().regex(/^[\w.-]+$/).default("new-blank").describe("plantilla, p. ej. new-blank"),
    cerrar_paneles: z.boolean().default(true),
    limpio: z.boolean().default(true).describe("borra el dibujo guardado de sesiones anteriores (def. true)"),
    vista: z.enum(["iso", "planta", "frontal", "lateral", "ninguna"]).default("iso").describe("vista inicial (def. iso, encuadrada); «ninguna» = la que traiga el ejemplo") },
  async ({ ejemplo, cerrar_paneles, limpio, vista }) => {
    await cerrarChrome();
    nav = await lanzar();
    pag = VISIBLE ? ((await nav.pages())[0] || await nav.newPage()) : await nav.newPage();
    if (!VISIBLE) await pag.setViewport({ width: 1500, height: 1000 });
    consola.length = 0;
    pag.on("pageerror", (e) => consola.push("[error] " + e.message));
    pag.on("console", (m) => { if (m.type() === "error") consola.push("[console.error] " + m.text()); });
    if (limpio) await pag.evaluateOnNewDocument(() => {   // dibujo/niveles/ejes guardados de antes: fuera
      try { for (const k of ["hk_drawingPoints", "hk_drawingPolylines", "hk_drawingAreas", "hk_levels", "hk_axisGrids"]) localStorage.removeItem(k); } catch {}
    });
    const url = `${BASE}?t=${encodeURIComponent(ejemplo)}`;
    if (new URL(url).origin !== ORIGEN) return falla("URL fuera de HEKATAN_URL.");
    await pag.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
    await esperar(6000);
    await pag.evaluate(() => {   // apagar imanes que deforman los clics
      // El enganche a ejes (rojo/verde/azul) se queda ENCENDIDO: es lo que deja dibujar en 3D en la isométrica.
      window.__hekatanOrthoMode = false;
    });
    if (cerrar_paneles) {
      // Las lengüetas están en los bordes cuando el panel está CERRADO: solo se pulsa si está abierto.
      await pag.evaluate(() => {
        const W = window.innerWidth;
        const izq = document.getElementById("hk-settings-toggle"), der = document.getElementById("hk-pane-toggle");
        if (izq && izq.getBoundingClientRect().left > 100) izq.click();
        if (der && der.getBoundingClientRect().left < W - 100) der.click();
      });
      await esperar(700);
    }
    if (vista !== "ninguna") {
      await ponerVista(vista, true);
      return texto({ abierto: url, vista, camara: await leerCamara() });
    }
    return texto(`Abierto ${url}`);
  });

srv.tool("panel",
  "Abre o cierra un panel lateral (izquierdo = Resultados/Vista, derecho = Herramientas CAD/Dibujar). Los botones de un panel cerrado no se ven ni se pueden apretar.",
  { lado: z.enum(["izquierdo", "derecho"]), abrir: z.boolean() },
  async ({ lado, abrir }) => {
    const e = necesitaPagina(); if (e) return e;
    const r = await pag.evaluate((lado, abrir) => {
      const W = window.innerWidth;
      const t = document.getElementById(lado === "izquierdo" ? "hk-settings-toggle" : "hk-pane-toggle");
      if (!t) return "no encuentro la lengüeta";
      const x = t.getBoundingClientRect().left;
      const abierto = lado === "izquierdo" ? x > 100 : x < W - 100;
      if (abierto !== abrir) t.click();
      return abierto === abrir ? "ya estaba así" : (abrir ? "abierto" : "cerrado");
    }, lado, abrir);
    await esperar(700);
    return texto(`${lado}: ${r}`);
  });

srv.tool("cerrar", "Cierra el navegador del CAD.", {}, async () => {
  await cerrarChrome();
  nav = pag = null;
  return texto("Cerrado.");
});

// ── ver ─────────────────────────────────────────────────────────────────────
srv.tool("captura", "Captura de pantalla del CAD (para ver qué hay y qué falta).",
  { solo_lienzo: z.boolean().default(false) },
  async ({ solo_lienzo }) => {
    const e = necesitaPagina(); if (e) return e;
    let opts = { type: "png" };
    if (solo_lienzo) { const c = await lienzo(); if (c) opts.clip = { x: c.x, y: c.y, width: c.w, height: c.h }; }
    const b64 = await pag.screenshot({ ...opts, encoding: "base64" });
    return { content: [{ type: "image", data: b64, mimeType: "image/png" }] };
  });

srv.tool("botones",
  "Lista los botones y carpetas VISIBLES del panel (Tweakpane) y los botones del ribbon. Sirve para saber qué herramientas existen y qué falta.",
  {},
  async () => {
    const e = necesitaPagina(); if (e) return e;
    const r = await pag.evaluate(() => {
      const vis = (el) => { const q = el.getBoundingClientRect(); return q.width > 0 && q.height > 0; };
      const t = (el) => (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);
      return {
        botones: [...document.querySelectorAll("button.tp-btnv_b")].filter(vis).map(t),
        carpetas: [...document.querySelectorAll("button.tp-fldv_b")].filter(vis).map((b) => ({
          nombre: t(b), abierta: !!b.closest(".tp-fldv")?.classList.contains("tp-fldv-expanded") })),
        ribbon: [...document.querySelectorAll(".rv-bar button, [id*=ribbon] button")]
          .filter(vis).map(t).filter(Boolean).slice(0, 80),
      };
    });
    return texto(r);
  });

srv.tool("modelo", "Lee lo dibujado: nº de nudos, polilíneas (tramos) y áreas. Con `todo` = true devuelve además las coordenadas de todos los nudos, las polilíneas (índices), las áreas, las auxiliares, apoyos y cargas.",
  { todo: z.boolean().default(false) }, async ({ todo }) => {
  const e = necesitaPagina(); if (e) return e;
  return texto(await pag.evaluate((todo) => {
    const g = (k) => { const v = window[k]; return v && v.val ? v.val : []; };
    const pts = g("__hekatanDrawingPoints"), pls = g("__hekatanDrawingPolylines"), ars = g("__hekatanDrawingAreas");
    const r = (p) => p.map((v) => +(+v).toFixed(4));
    const base = { nodos: pts.length, polilineas: pls.length,
      tramos: pls.reduce((s, p) => s + Math.max(0, p.length - 1), 0), areas: ars.length,
      primeros_nodos: pts.slice(0, 10).map(r) };
    if (!todo) return base;
    return { ...base, primeros_nodos: undefined, puntos: pts.map(r), polilineas_idx: pls.filter((q) => q.length), areas_idx: ars,
      aux_lineas: g("__hekatanDrawingAuxLines"), aux_puntos: g("__hekatanDrawingAuxPoints"),
      apoyos: Object.fromEntries(window.__hekatanManualSupports || []), cargas: Object.fromEntries(window.__hekatanManualLoads || []) };
  }, todo));
});

srv.tool("errores", "Errores de consola/página desde que se abrió.", {}, async () => texto(consola.length ? consola.join("\n") : "Sin errores."));

// ── elegir herramientas ─────────────────────────────────────────────────────
async function botonPorTexto(txt, selector) {
  const r = await pag.evaluate((t, sel) => {
    const vis = (x) => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const todos = [...document.querySelectorAll(sel)];
    const b = todos.filter(vis).find((x) => (x.textContent || "").includes(t))
      || todos.filter(vis).find((x) => ((x.title || "") + (x.getAttribute("aria-label") || "")).includes(t));
    if (!b) return null;
    b.scrollIntoView({ block: "center" });   // si está al borde, la barra de comandos de abajo tapa el clic
    const q = b.getBoundingClientRect();
    const x = q.left + q.width / 2, y = q.top + q.height / 2;
    const el = document.elementFromPoint(x, y);
    // si otro elemento tapa el botón (panel cerrado, cinta encima), el clic caería en otro lado: se activa directo
    if (!el || !(b === el || b.contains(el) || el.contains(b))) { b.click(); return { directo: true }; }
    return { x, y };
  }, txt, selector);
  if (!r) return false;
  if (r.directo) { await esperar(VISIBLE ? 900 : 500); return true; }
  await mover(r.x, r.y);
  await pag.mouse.click(r.x, r.y); await esperar(VISIBLE ? 900 : 500);
  return true;
}

srv.tool("boton", "Aprieta un botón del panel por su texto (p. ej. 'Línea (frame)', 'Plano XY (planta)'). Usa `botones` para ver los nombres.",
  { texto: z.string().min(1).max(60) },
  async ({ texto: t }) => {
    const e = necesitaPagina(); if (e) return e;
    const ok = await botonPorTexto(t, "button.tp-btnv_b, button");
    return ok ? texto(`Apretado: ${t}`) : falla(`No encuentro un botón visible con «${t}». Abre la carpeta o mira \`botones\`.`);
  });

srv.tool("subir_archivo",
  "Pulsa un botón que pide un archivo (p. ej. '📥 Importar E2K', '📂 Abrir .heks') y le entrega el archivo de `ruta` (ruta corta, sin espacios). Atrapa el selector de archivos del navegador, que el MCP no puede manejar a mano.",
  { boton: z.string().min(1).max(60), ruta: z.string().min(3).max(300) },
  async ({ boton: t, ruta }) => {
    const e = necesitaPagina(); if (e) return e;
    if (!existsSync(ruta)) return falla(`No existe el archivo: ${ruta}`);
    await pag.evaluate(() => {
      if (window.__hkParcheArchivo) { window.__hkUltimoInputArchivo = null; return; }
      window.__hkParcheArchivo = true;
      const orig = HTMLInputElement.prototype.click;
      HTMLInputElement.prototype.click = function () {
        if (this.type === "file") { window.__hkUltimoInputArchivo = this; return; }   // no abre el selector: lo atrapamos
        return orig.call(this);
      };
    });
    const ok = await pag.evaluate((t) => {   // clic directo en el DOM: sirve aunque el panel esté cerrado
      const b = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(t));
      if (b) b.click(); return !!b;
    }, t);
    if (!ok) return falla(`No encuentro el botón «${t}».`);
    await esperar(400);
    const h = await pag.evaluateHandle(() => window.__hkUltimoInputArchivo);
    const el = h.asElement();
    if (!el) return falla(`«${t}» no pidió ningún archivo.`);
    await el.uploadFile(ruta);
    await esperar(3000);
    return texto(`Archivo entregado a «${t}»: ${ruta}`);
  });

srv.tool("carpeta", "Abre una carpeta del panel por su título (p. ej. 'Dibujar').",
  { titulo: z.string().min(1).max(60) },
  async ({ titulo }) => {
    const e = necesitaPagina(); if (e) return e;
    const ya = await pag.evaluate((t) => {
      const b = [...document.querySelectorAll("button.tp-fldv_b")].find((x) => (x.textContent || "").includes(t));
      return b ? !!b.closest(".tp-fldv")?.classList.contains("tp-fldv-expanded") : null;
    }, titulo);
    if (ya === null) return falla(`No existe la carpeta «${titulo}».`);
    if (ya) return texto("Ya estaba abierta.");
    return (await botonPorTexto(titulo, "button.tp-fldv_b")) ? texto(`Abierta: ${titulo}`) : falla("No se pudo abrir.");
  });

// ── menús desplegables de la barra de arriba (Menú, Análisis, Diseño, Exportar…) ──
srv.tool("menu",
  "Abre un menú de la barra de arriba (Menú, Análisis, Diseño, Exportar, Fundamentos) y lista sus opciones. Con `elegir` pulsa esa opción (por parte de su texto).",
  { nombre: z.string().min(1).max(30), elegir: z.string().max(80).optional() },
  async ({ nombre, elegir }) => {
    const e = necesitaPagina(); if (e) return e;
    const ok = await pag.evaluate((n) => { const b = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(n) && x.getBoundingClientRect().top < 40 && x.getBoundingClientRect().width > 0); if (b) b.click(); return !!b; }, nombre);
    if (!ok) return falla(`No encuentro el menú «${nombre}» en la barra de arriba.`);
    await esperar(500);
    // el desplegable es el contenedor flotante que cuelga justo debajo del botón (no la barra de estado de abajo)
    const buscar = (n) => {
      const b = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(n) && x.getBoundingClientRect().top < 40 && x.getBoundingClientRect().width > 0);
      if (!b) return null; const rb = b.getBoundingClientRect();
      return [...document.querySelectorAll("*")].find((x) => { const q = x.getBoundingClientRect();
        return q.width > 100 && x.children.length > 1 && (+getComputedStyle(x).zIndex >= 50 || getComputedStyle(x).position === "fixed") && q.top >= rb.bottom - 6 && q.top <= rb.bottom + 80 && q.left <= rb.right && q.right >= rb.left; }) || null;
    };
    const items = await pag.evaluate((n, src) => { const f = (0, eval)("(" + src + ")")(n); return f ? [...f.children].map((c) => (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90)).filter(Boolean) : []; }, nombre, buscar.toString());
    if (!elegir) { await pag.keyboard.press("Escape"); return texto(items); }
    const p = await pag.evaluate((n, t, src) => { const f = (0, eval)("(" + src + ")")(n); const c = f && [...f.children].find((x) => (x.textContent || "").includes(t)); if (!c) return null; const q = c.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; }, nombre, elegir, buscar.toString());
    if (!p) { await pag.keyboard.press("Escape"); return falla(`El menú «${nombre}» no tiene «${elegir}». Opciones: ${items.join(" | ")}`); }
    await mover(p.x, p.y); await pag.mouse.click(p.x, p.y); await esperar(900);
    return texto(`Elegido: ${nombre} › ${elegir}`);
  });

// ── campos del panel (Tweakpane) por su etiqueta ────────────────────────────
srv.tool("campos",
  "Lista los campos VISIBLES del panel con su etiqueta y valor (texto, número, casilla, lista). Se cambian con `campo`. Abre el panel y la carpeta antes (`panel`, `carpeta`).",
  {},
  async () => {
    const e = necesitaPagina(); if (e) return e;
    return texto(await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")].filter((r) => r.getBoundingClientRect().width > 0).map((r) => {
      const l = ((r.querySelector(".tp-lblv_l") || {}).textContent || "").trim();
      const i = r.querySelector("input,select");
      return i ? `${l} = ${i.type === "checkbox" ? i.checked : i.value}` : null;
    }).filter(Boolean)));
  });

srv.tool("campo",
  "Cambia un campo del panel por su etiqueta (p. ej. «Vanos X (m)» = «6,6,6»). Texto o número: se escribe; casilla: true/false; lista: texto de la opción.",
  { etiqueta: z.string().min(1).max(80), valor: z.union([z.string().max(200), z.number(), z.boolean()]) },
  async ({ etiqueta, valor }) => {
    const e = necesitaPagina(); if (e) return e;
    const r = await pag.evaluate((et, v) => {
      const fila = [...document.querySelectorAll(".tp-lblv")].filter((x) => x.getBoundingClientRect().width > 0)
        .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").trim().includes(et));
      if (!fila) return "no encuentro un campo visible con esa etiqueta";
      const i = fila.querySelector("input,select");
      if (!i) return "esa fila no tiene campo editable";
      if (i.type === "checkbox") { if (i.checked !== !!v) i.click(); return "ok"; }
      if (i.tagName === "SELECT") {
        const o = [...i.options].find((o) => o.text.includes(String(v)) || o.value === String(v));
        if (!o) return "opción inválida: " + [...i.options].map((o) => o.text).join(" | ");
        i.value = o.value; i.dispatchEvent(new Event("change", { bubbles: true })); return "ok";
      }
      i.focus(); i.value = String(v);
      i.dispatchEvent(new Event("input", { bubbles: true })); i.dispatchEvent(new Event("change", { bubbles: true })); i.blur();
      return "ok";
    }, etiqueta, valor);
    await esperar(300);
    return r === "ok" ? texto(`${etiqueta} = ${valor}`) : falla(r);
  });

srv.tool("estado",
  "Lee la barra de estado (nº de nudos, frames, resultado de solve…) y las últimas líneas de la ventana de comandos.",
  {},
  async () => {
    const e = necesitaPagina(); if (e) return e;
    return texto(await pag.evaluate(() => {
      const vis = (x) => { const q = x.getBoundingClientRect(); return q.width > 0 && q.height > 0; };
      const cuenta = [...document.querySelectorAll("input")].map((i) => i.value).find((v) => /nodos .* frames/.test(v)) || null;
      const lineas = [...document.querySelectorAll("div,span,pre")].filter((x) => vis(x) && x.children.length === 0 && /(Tool|Dibujo|solve|nudo|frame|columna|viga|Rejilla|rejilla|cread|Error|error)/.test(x.textContent || "")).map((x) => x.textContent.trim().slice(0, 120));
      return { cuenta, mensajes: [...new Set(lineas)].slice(-8) };
    }));
  });

// ── cámara: vistas, encuadre, órbita, zoom ──────────────────────────────────
// Todo por los MISMOS ganchos que usan los botones de la app (cinta 1-4, «Z» de zoom extensión):
// lo que se prueba aquí es lo que ve quien dibuja con el ratón.
const VISTAS_MCP = { planta: 0, frontal: 1, lateral: 2, iso: 3 };
const PRESET = { planta: "plan", frontal: "elevX", lateral: "elevY", iso: "iso" };

/** Espera a que la cámara deje de moverse (las vistas y el encuadre se animan). */
async function camaraQuieta() {
  await pag.evaluate(async () => {
    const f = window.__hekatanViewerCtx;
    const cam = ((typeof f === "function" ? f() : f) || document.querySelector("#viewer")?.__ctx)?.camera; if (!cam) return;
    const firma = () => { const c = ((typeof f === "function" ? f() : f) || document.querySelector("#viewer")?.__ctx)?.camera || cam; c.updateMatrixWorld && c.updateMatrixWorld(true); return [...c.matrixWorld.elements, ...c.projectionMatrix.elements].map((v) => v.toFixed(5)).join(","); };
    let ant = firma(), quieto = 0;
    for (let i = 0; i < 60 && quieto < 4; i++) { await new Promise((r) => setTimeout(r, 100)); const s = firma(); quieto = s === ant ? quieto + 1 : 0; ant = s; }
  });
}

/** Cámara actual: tipo, posición, objetivo y dirección (para saber en qué vista se está). */
const leerCamara = () => pag.evaluate(() => {
  const f = window.__hekatanViewerCtx;
  const ctx = (typeof f === "function" ? f() : f) || document.querySelector("#viewer")?.__ctx;
  const c = ctx?.camera; if (!c) return null;
  const t = ctx.controls?.target || { x: 0, y: 0, z: 0 };
  const d = [t.x - c.position.x, t.y - c.position.y, t.z - c.position.z]; const n = Math.hypot(...d) || 1;
  const r = (v) => +v.toFixed(3);
  return { tipo: c.isPerspectiveCamera ? "perspectiva" : "ortográfica", posicion: [c.position.x, c.position.y, c.position.z].map(r),
    objetivo: [t.x, t.y, t.z].map(r), mira_hacia: d.map((v) => r(v / n)), zoom: r(c.zoom || 1),
    plano_trabajo: window.__hekatanCadState?.get?.()?.workPlane ?? null, cota_z: window.__hekatanCadState?.get?.()?.workZ ?? null };
});

async function ponerVista(modo, encuadrar) {
  const r = await pag.evaluate((i, preset) => {
    const R = window.__hekatanRibbon;
    if (R?.vista) { R.vista(i); return "cinta"; }          // = botón 1-4 de la cinta (también pone el plano)
    if (window.__hekatanSetView) { window.__hekatanSetView(preset); return "setView"; }
    return null;
  }, VISTAS_MCP[modo], PRESET[modo]);
  if (!r) return false;
  await esperar(400); await camaraQuieta();
  if (encuadrar) { await pag.evaluate(() => window.__hekatanAutoFit?.()); await esperar(300); await camaraQuieta(); }
  return true;
}

srv.tool("vista",
  "Pone la cámara en una vista: iso (isométrica 3D, perspectiva), planta (XY desde arriba), frontal (XZ) o lateral (YZ). Es lo mismo que las teclas 1-4 / botones de la cinta. Con `encuadrar` (def. true) hace además «zoom extensión» sobre lo dibujado.",
  { modo: z.enum(["iso", "planta", "frontal", "lateral"]), encuadrar: z.boolean().default(true) },
  async ({ modo, encuadrar }) => {
    const e = necesitaPagina(); if (e) return e;
    if (!(await ponerVista(modo, encuadrar))) return falla("La app no expone vistas (__hekatanRibbon.vista / __hekatanSetView).");
    return texto({ vista: modo, camara: await leerCamara() });
  });

srv.tool("encuadrar",
  "Zoom extensión: encuadra todo lo dibujado/modelado sin cambiar la orientación. Con `caja` = [xmin,ymin,zmin,xmax,ymax,zmax] (m) encuadra además esa caja (útil ANTES de dibujar en isométrico, para que los puntos que vas a clicar caigan en pantalla).",
  { caja: z.array(z.number()).length(6).optional() },
  async ({ caja }) => {
    const e = necesitaPagina(); if (e) return e;
    const ok = await pag.evaluate((caja) => {
      if (caja) {
        if (!window.__hekatanEncuadrarCaja) return false;
        const [a, b, c, d, e2, f2] = caja;
        window.__hekatanEncuadrarCaja([[a, b, c], [d, e2, f2], [a, e2, c], [d, b, f2]]); return true;
      }
      if (!window.__hekatanAutoFit) return false; window.__hekatanAutoFit(); return true;
    }, caja ?? null);
    if (!ok) return falla("La app no expone el encuadre (__hekatanAutoFit / __hekatanEncuadrarCaja).");
    await esperar(300); await camaraQuieta();
    return texto({ encuadrado: caja ?? "todo", camara: await leerCamara() });
  });

srv.tool("orbitar",
  "Gira la cámara alrededor del objetivo a un azimut y elevación ABSOLUTOS (grados). azimut 0 = mirando desde +X, 90 = desde +Y, -45 = la isométrica de la app (desde +X −Y). elevación 35 ≈ isométrica, 90 = desde arriba. Pasa a perspectiva si estaba en planta/alzado.",
  { azimut: z.number().min(-360).max(360), elevacion: z.number().min(-89).max(89.9) },
  async ({ azimut, elevacion }) => {
    const e = necesitaPagina(); if (e) return e;
    const tipo = (await leerCamara())?.tipo;
    if (tipo !== "perspectiva") await ponerVista("iso", false);
    const ok = await pag.evaluate((az, el) => {
      const f = window.__hekatanViewerCtx;
      const ctx = (typeof f === "function" ? f() : f) || document.querySelector("#viewer")?.__ctx;
      const c = ctx?.camera, ctl = ctx?.controls; if (!c || !ctl) return false;
      const t = ctl.target; const d = Math.hypot(c.position.x - t.x, c.position.y - t.y, c.position.z - t.z) || 20;
      const A = az * Math.PI / 180, E = el * Math.PI / 180;
      c.position.set(t.x + d * Math.cos(E) * Math.cos(A), t.y + d * Math.cos(E) * Math.sin(A), t.z + d * Math.sin(E));
      c.up.set(0, 0, 1); c.lookAt(t.x, t.y, t.z); c.updateProjectionMatrix?.(); ctl.update?.(); ctx.render?.();
      return true;
    }, azimut, elevacion);
    if (!ok) return falla("No encuentro la cámara.");
    await esperar(250);
    return texto({ azimut, elevacion, camara: await leerCamara() });
  });

srv.tool("zoom",
  "Acerca (factor > 1) o aleja (factor < 1) la cámara hacia el objetivo, sin girarla.",
  { factor: z.number().min(0.05).max(20) },
  async ({ factor }) => {
    const e = necesitaPagina(); if (e) return e;
    await pag.evaluate((k) => {
      const f = window.__hekatanViewerCtx;
      const ctx = (typeof f === "function" ? f() : f) || document.querySelector("#viewer")?.__ctx;
      const c = ctx?.camera, ctl = ctx?.controls; if (!c || !ctl) return;
      if (c.isPerspectiveCamera) { const t = ctl.target; c.position.set(t.x + (c.position.x - t.x) / k, t.y + (c.position.y - t.y) / k, t.z + (c.position.z - t.z) / k); }
      else { c.zoom = (c.zoom || 1) * k; c.updateProjectionMatrix(); }
      ctl.update?.(); ctx.render?.();
    }, factor);
    await esperar(200);
    return texto({ factor, camara: await leerCamara() });
  });

srv.tool("plano_trabajo",
  "Fija el PLANO DE TRABAJO donde cae el ratón, SIN mover la cámara (para dibujar en isométrico): xy a la cota z, xz por y = cota, yz por x = cota. Es la orden PT de la app (z=3 · y=0 · x=5).",
  { plano: z.enum(["xy", "xz", "yz"]), cota: z.number().default(0) },
  async ({ plano, cota }) => {
    const e = necesitaPagina(); if (e) return e;
    const r = await pag.evaluate((k, c) => window.__hekatanPlanoTrabajo?.(k, c) ?? null, plano, cota);
    if (!r) return falla("La app no expone __hekatanPlanoTrabajo (versión vieja del CAD).");
    await esperar(200);
    return texto({ plano_trabajo: r, camara: await leerCamara() });
  });

// ── clic en coordenadas del MUNDO (x,y,z en m): proyecta con la cámara ───────
/** Píxel de pantalla del punto (x,y,z) con la cámara actual. */
const proyectar = (x, y, zz) => pag.evaluate((x, y, zz) => {
  const f = window.__hekatanViewerCtx;
  const ctx = (typeof f === "function" ? f() : f) || document.querySelector("#viewer")?.__ctx;
  const cam = ctx && ctx.camera; if (!cam) return null;
  cam.updateMatrixWorld && cam.updateMatrixWorld(true);
  const V = cam.matrixWorldInverse.elements, P = cam.projectionMatrix.elements;
  const m = (M, [a, b, c, d]) => [M[0] * a + M[4] * b + M[8] * c + M[12] * d, M[1] * a + M[5] * b + M[9] * c + M[13] * d, M[2] * a + M[6] * b + M[10] * c + M[14] * d, M[3] * a + M[7] * b + M[11] * c + M[15] * d];
  const q = m(P, m(V, [x, y, zz, 1]));
  if (q[3] <= 0) return { detras: true };
  const c = document.querySelector("#viewer canvas") || document.querySelector("canvas"); const r = c.getBoundingClientRect();
  const px = r.left + ((q[0] / q[3] + 1) / 2) * r.width, py = r.top + ((1 - q[1] / q[3]) / 2) * r.height;
  // ¿lo tapa algo (cinta, barra de órdenes, paneles)? Entonces el clic caería en otro sitio.
  const el = document.elementFromPoint(px, py);
  const tapado = !!el && el !== c && !c.contains(el) && !(el.closest && el.closest("#viewer") && el.tagName === "CANVAS");
  return { px, py, w: r.width, h: r.height, l: r.left, t: r.top, tapado, tapa: tapado ? (el.id || el.className || el.tagName).toString().slice(0, 40) : null };
}, x, y, zz);

/** Puntos del dibujo (copia). */
const puntosDibujo = () => pag.evaluate(() => (window.__hekatanDrawingPoints?.val || []).map((p) => [+p[0], +p[1], +p[2]]));
const resumenModelo = () => pag.evaluate(() => {
  const g = (k) => { const v = window[k]; return v && v.val ? v.val : []; };
  const pls = g("__hekatanDrawingPolylines");
  const tam = (m) => (m && (m.size ?? Object.keys(m).length)) | 0;
  return { nudos: g("__hekatanDrawingPoints").length, polilineas: pls.filter((q) => q.length).length,
    tramos: pls.reduce((s, p) => s + Math.max(0, p.length - 1), 0), areas: g("__hekatanDrawingAreas").length,
    aux: g("__hekatanDrawingAuxLines").length, auxp: g("__hekatanDrawingAuxPoints").length, apoyos: tam(window.__hekatanManualSupports) + tam(window.__hekatanCadSupports),
    cargas: tam(window.__hekatanManualLoads), cargas_q: tam(window.__hekatanManualDistLoads) };
});

/** Escribe un texto en la línea de órdenes y pulsa Enter (lo mismo que teclear). */
async function teclearOrden(t) {
  const ok = await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (!i) return false; i.focus(); i.value = ""; return true; });
  if (!ok) throw new Error("No encuentro la línea de comandos (#hk3-cmd-input).");
  if (t) await pag.keyboard.type(t, { delay: 5 });
  await pag.keyboard.press("Enter"); await esperar(250);
}

const fmt = (v) => +(+v).toFixed(4);
/**
 * Un punto (x,y,z): con el RATÓN (proyectado; si cae fuera de pantalla o tapado, encuadra y
 * reintenta) o TECLEADO en la línea de órdenes (exacto, no depende de la cámara).
 * Devuelve el punto que el CAD creó de verdad y cuánto se aparta del pedido.
 */
async function puntoMundo(x, y, zz, porComando, tol = 0.01) {
  const antes = await puntosDibujo();
  let via = porComando ? "comando" : "ratón", pantalla = null;
  if (porComando) await teclearOrden(`${fmt(x)},${fmt(y)},${fmt(zz)}`);
  else {
    await camaraQuieta();
    let p = await proyectar(x, y, zz);
    if (!p) throw new Error("No encuentro la cámara del visor (__hekatanViewerCtx).");
    const fuera = (p) => p.detras || p.px < p.l + 4 || p.px > p.l + p.w - 4 || p.py < p.t + 4 || p.py > p.t + p.h - 4 || p.tapado;
    if (fuera(p)) {   // encuadrar lo dibujado + este punto y volver a proyectar
      await pag.evaluate((q) => { const pts = (window.__hekatanDrawingPoints?.val || []).slice(); pts.push(q); window.__hekatanEncuadrarCaja?.(pts); }, [x, y, zz]);
      await esperar(300); await camaraQuieta();
      p = await proyectar(x, y, zz);
    }
    if (fuera(p)) throw new Error(p.detras ? "Ese punto queda detrás de la cámara." : p.tapado ? `El punto cae debajo de «${p.tapa}» (no es el lienzo). Usa por_comando o mueve la cámara.` : `El punto cae fuera de la pantalla (${Math.round(p.px)}, ${Math.round(p.py)}).`);
    await mover(p.px, p.py);
    await pag.mouse.click(p.px, p.py); await esperar(300);
    pantalla = [Math.round(p.px), Math.round(p.py)];
  }
  const despues = await puntosDibujo();
  // el punto creado: el nuevo más cercano al pedido, o (si no hay nuevo) el existente más cercano
  const d = (q) => Math.hypot(q[0] - x, q[1] - y, q[2] - zz);
  const nuevos = despues.slice(antes.length);
  const cand = nuevos.length ? nuevos : despues;
  let mejor = null; for (const q of cand) if (!mejor || d(q) < d(mejor)) mejor = q;
  const desvio = mejor ? d(mejor) : null;
  return { pedido: [x, y, zz], via, pantalla, nuevos: nuevos.length, creado: mejor ? mejor.map(fmt) : null, desvio: desvio == null ? null : fmt(desvio),
    ok: desvio != null && desvio <= tol,
    aviso: desvio == null ? "no hay ningún punto en el dibujo (la herramienta puede crear el nudo al cerrar)"
      : desvio > tol ? (nuevos.length ? `el clic cayó en OTRO punto (${mejor.map(fmt)}): en isométrico el ratón cae en el plano de trabajo; usa plano_trabajo, un eje (flechas) o por_comando` : "no se creó punto nuevo en ese sitio") : null };
}

srv.tool("clic_mundo",
  "Un clic sobre el punto del modelo (x, y, z) en metros, en CUALQUIER vista (también isométrica). Con el ratón se proyecta con la cámara (si cae fuera, encuadra y reintenta); con `por_comando` = true teclea «x,y,z» en la línea de órdenes (exacto, no depende de la cámara). Devuelve el punto que el CAD creó de verdad y el desvío respecto al pedido: si no coincide, el clic cayó en otro plano.",
  { x: z.number(), y: z.number(), z: z.number().default(0), por_comando: z.boolean().default(false), tolerancia: z.number().min(0).default(0.01) },
  async ({ x, y, z: zz, por_comando, tolerancia }) => {
    const e = necesitaPagina(); if (e) return e;
    try { return texto(await puntoMundo(x, y, zz, por_comando, tolerancia)); }
    catch (err) { return falla(String(err.message || err)); }
  });

// ── dibujar con una herramienta, puntos 3D en metros ────────────────────────
// herramienta MCP → id de la herramienta del CAD (el mismo que pone el botón de la cinta)
const HERR = {
  nodo: "node", linea: "line", viga: "line", polilinea: "polyline", rectangulo: "rect", circulo: "circle",
  arco3: "arc", arco2h: "arc2h", parabola: "parabola", cubica: "cubica", columna: "col", muro: "wall",
  losa: "area", losa_rect: "rectarea", aux: "aux", punto_aux: "auxp", medir: "medir", apoyo: "apoyo", carga: "carga",
};
// las que dejan un NUDO en cada punto pedido (se comprueban todos)
const VERIFICA_TODOS = new Set(["nodo", "linea", "viga", "polilinea", "losa", "parabola", "cubica", "muro"]);

srv.tool("dibujar",
  "Dibuja con una herramienta del CAD dando los puntos en METROS (x,y,z), en la vista actual (pensado para isométrico). " +
  "Herramientas: nodo, linea, viga (=línea), polilinea, rectangulo (2 esquinas; en el plano que forman), circulo (centro + `valor`=radio, o 2º punto), " +
  "arco3 (3 ptos), arco2h (2 ptos + `valor`=flecha), parabola (3), cubica (4), columna (base + `valor`=altura), muro (2 ptos de la base + `valor`=altura), " +
  "losa (4 vértices antihorario), losa_rect (2 esquinas), aux (2 ptos), punto_aux, medir (2), apoyo / carga (clic en nudos existentes). " +
  "`modo`: raton (clics reales proyectados con la cámara) o comando (coordenadas tecleadas, exacto). Devuelve lo creado y si cada punto quedó donde se pidió.",
  { herramienta: z.enum(Object.keys(HERR)), puntos: z.array(z.tuple([z.number(), z.number(), z.number()])).min(1).max(60),
    valor: z.number().optional().describe("radio / altura / flecha según la herramienta"),
    modo: z.enum(["raton", "comando"]).default("raton"), tolerancia: z.number().min(0).default(0.01) },
  async ({ herramienta, puntos, valor, modo, tolerancia }) => {
    const e = necesitaPagina(); if (e) return e;
    const id = HERR[herramienta];
    const antes = await resumenModelo();
    const pasos = [];
    try {
      // 1. elegir la herramienta como el botón de la cinta (o la orden equivalente)
      const elegido = await pag.evaluate((id) => {
        const R = window.__hekatanRibbon;
        if (R?.herramientas && R.herramientas().includes(id)) { R.usar(id); return "cinta"; }
        if (window.__hekatanCadState?.setTool) { window.__hekatanCadState.setTool(id); return "setTool"; }
        return null;
      }, id);
      if (!elegido) return falla(`No puedo elegir la herramienta «${id}».`);
      await esperar(400);
      // 2. la altura de columna / muro se teclea ANTES de los clics (lo dice la ayuda de la cinta)
      if ((herramienta === "columna" || herramienta === "muro") && valor != null) { await teclearOrden(String(valor)); pasos.push(`altura ${valor}`); }
      // 3. los puntos
      for (let i = 0; i < puntos.length; i++) {
        const [x, y, zz] = puntos[i];
        const r = await puntoMundo(x, y, zz, modo === "comando", tolerancia);
        pasos.push(r);
        // el radio / la flecha van después del 1er (círculo) o del 2º punto (arco 2P+h)
        if (valor != null && ((herramienta === "circulo" && i === 0 && puntos.length === 1) || (herramienta === "arco2h" && i === 1))) {
          await teclearOrden(String(valor)); pasos.push(`${herramienta === "circulo" ? "radio" : "flecha"} ${valor}`);
        }
      }
      // 4. terminar el trazo (línea / polilínea encadenan; el resto se cierra solo)
      if (["linea", "viga", "polilinea", "aux"].includes(herramienta)) { await pag.evaluate(() => window.__hekatanFinalizeDraw?.()); await esperar(250); }
      await pag.keyboard.press("Escape"); await esperar(300);
    } catch (err) { return falla(`${String(err.message || err)} · pasos: ${JSON.stringify(pasos)}`); }
    const despues = await resumenModelo();
    const todos = await puntosDibujo();
    const tiene = (p) => todos.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) <= tolerancia);
    const esperados = herramienta === "columna" && valor != null ? [puntos[0], [puntos[0][0], puntos[0][1], puntos[0][2] + valor]]
      : herramienta === "muro" && valor != null && puntos.length >= 2 ? [puntos[0], puntos[1], [puntos[1][0], puntos[1][1], puntos[1][2] + valor], [puntos[0][0], puntos[0][1], puntos[0][2] + valor]]
      : VERIFICA_TODOS.has(herramienta) || herramienta === "rectangulo" || herramienta === "arco3" || herramienta === "arco2h" ? (herramienta === "arco3" || herramienta === "arco2h" ? [puntos[0], puntos[puntos.length - 1]] : puntos) : [];
    const faltan = esperados.filter((p) => !tiene(p));
    const delta = Object.fromEntries(Object.keys(despues).map((k) => [k, despues[k] - antes[k]]));
    const hizoAlgo = Object.values(delta).some((v) => v !== 0);
    const msg = await pag.evaluate(() => (document.getElementById("hk3-cmd-hist")?.innerText || "").trim().split("\n").slice(-3));
    return texto({ herramienta, modo, ok: hizoAlgo && faltan.length === 0, creado: delta, modelo: despues,
      puntos_que_no_estan: faltan, ventana_de_comandos: msg, pasos });
  });

srv.tool("tecla", "Pulsa una tecla (Escape, Enter, Delete, 1-4, Control+z…).",
  { tecla: z.string().min(1).max(30) },
  async ({ tecla }) => {
    const e = necesitaPagina(); if (e) return e;
    if (tecla.includes("+")) {
      const partes = tecla.split("+"); const k = partes.pop();
      for (const m of partes) await pag.keyboard.down(m);
      await pag.keyboard.press(k);
      for (const m of partes.reverse()) await pag.keyboard.up(m);
    } else await pag.keyboard.press(tecla);
    await esperar(300);
    return texto(`Tecla: ${tecla}`);
  });

// ── dibujar ─────────────────────────────────────────────────────────────────
srv.tool("clic", "Un clic real sobre el lienzo. x,y son fracciones 0–1 del lienzo (0,0 = esquina superior izquierda).",
  { x: z.number().min(0).max(1), y: z.number().min(0).max(1) },
  async ({ x, y }) => {
    const e = necesitaPagina(); if (e) return e;
    try { await clicEn(x, y); } catch (err) { return falla(String(err.message || err)); }
    return texto(`Clic en (${x}, ${y})`);
  });

srv.tool("clic_derecho", "Un clic DERECHO real sobre el lienzo (menú rápido / cancelar). x,y fracciones 0–1 del lienzo.",
  { x: z.number().min(0).max(1), y: z.number().min(0).max(1) },
  async ({ x, y }) => {
    const e = necesitaPagina(); if (e) return e;
    try {
      const cv = await lienzo(); if (!cv) return falla("No encuentro el lienzo.");
      const px = cv.x + cv.w * x, py = cv.y + cv.h * y;
      await mover(px, py); await pag.mouse.click(px, py, { button: "right" }); await esperar(300);
    } catch (err) { return falla(String(err.message || err)); }
    return texto(`Clic derecho en (${x}, ${y})`);
  });

srv.tool("dibujar_linea",
  "Con la herramienta Línea ya elegida (botón 'Línea (frame)'), hace clic en cada punto y cierra con Escape. Puntos en fracciones 0–1 del lienzo. Devuelve cuántos tramos hay.",
  { puntos: z.array(z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)])).min(2).max(60) },
  async ({ puntos }) => {
    const e = necesitaPagina(); if (e) return e;
    const antes = await pag.evaluate(() => (window.__hekatanDrawingPolylines?.val || []).length);
    try { for (const [x, y] of puntos) await clicEn(x, y); } catch (err) { return falla(String(err.message || err)); }
    await pag.keyboard.press("Escape"); await esperar(300);
    const despues = await pag.evaluate(() => (window.__hekatanDrawingPolylines?.val || []).length);
    return texto({ clics: puntos.length, polilineas_nuevas: despues - antes });
  });

// ── como el MCP de AutoCAD: órdenes por la línea de comandos, sin ratón ──────
srv.tool("comando",
  "Escribe órdenes en la línea de comandos del CAD, como el MCP de AutoCAD. Un elemento por cada Enter. OJO: el Espacio también ejecuta, así que cada dato va en su propio elemento. Ej.: [\"l\",\"0,0,0\",\"0,0,3\",\"4,0,3\",\"\"] dibuja un pórtico en 3D; [\"all\",\"rep\",\"0,0,3\",\"2\"] replica 2 pisos; [\"all\",\"mi\",\"x=6\"] simetría en x=6 (también y=0, z=3 o x1,y1,x2,y2); [\"?\"] ayuda. Devuelve las últimas líneas de la ventana de comandos y el nº de nudos/barras.",
  { lineas: z.array(z.string().max(200)).min(1).max(80) },
  async ({ lineas }) => {
    const e = necesitaPagina(); if (e) return e;
    const salida = [];
    for (const l of lineas) {
      const ok = await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (!i) return false; i.focus(); i.value = ""; return true; });
      if (!ok) return falla("No encuentro la línea de comandos (#hk3-cmd-input). ¿Abriste el CAD con `abrir`?");
      if (l) await pag.keyboard.type(l, { delay: 5 });
      await pag.keyboard.press("Enter"); await esperar(250);
    }
    await esperar(200);
    return texto(await pag.evaluate((n) => {
      // el historial de la ventana de órdenes (#hk3-cmd-hist): leerlo por posición en pantalla
      // devolvía lo que hubiera ahí (paneles, botones), no la respuesta de la orden
      const h = document.getElementById("hk3-cmd-hist");
      const lin = h ? (h.innerText || "").split(/\n/).map((t) => t.trim()).filter(Boolean) : [];
      const pr = (document.getElementById("hk3-cmd-prompt")?.textContent || "").trim();
      const pts = (window.__hekatanDrawingPoints?.val || []).length;
      const barras = (window.__hekatanDrawingPolylines?.val || []).filter((q) => q.length).length;
      return { ventana_de_comandos: lin.slice(-Math.max(3, n)), pregunta: pr, nudos: pts, polilineas: barras };
    }, lineas.length + 1));
  });

const salir = async () => { await cerrarChrome(); process.exit(0); };
process.on("SIGINT", salir); process.on("SIGTERM", salir);
await srv.connect(new StdioServerTransport());
