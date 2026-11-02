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
        d.style.cssText = "position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;border:2px solid #fbbf24;border-radius:50%;background:rgba(239,68,68,.75);box-shadow:0 0 10px #ef4444;pointer-events:none;z-index:2147483647;transition:left .35s,top .35s";
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

async function lanzar() {
  const args = ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader", "--window-size=1500,1000"];
  const headless = process.env.HEKATAN_VISIBLE ? false : "new";
  try { return await puppeteer.launch({ headless, args, channel: "chrome" }); }
  catch { return await puppeteer.launch({ headless, args }); }
}
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
    cerrar_paneles: z.boolean().default(true) },
  async ({ ejemplo, cerrar_paneles }) => {
    if (nav) { try { await nav.close(); } catch {} }
    nav = await lanzar();
    pag = await nav.newPage();
    await pag.setViewport({ width: 1500, height: 1000 });
    consola.length = 0;
    pag.on("pageerror", (e) => consola.push("[error] " + e.message));
    pag.on("console", (m) => { if (m.type() === "error") consola.push("[console.error] " + m.text()); });
    const url = `${BASE}?t=${encodeURIComponent(ejemplo)}`;
    if (new URL(url).origin !== ORIGEN) return falla("URL fuera de HEKATAN_URL.");
    await pag.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
    await esperar(6000);
    await pag.evaluate(() => {   // apagar imanes que deforman los clics
      window.__hekatanAxisSnap = false; window.__hekatanOrthoMode = false;
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
  if (nav) { try { await nav.close(); } catch {} }
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

srv.tool("modelo", "Lee lo dibujado: nº de nudos, polilíneas (tramos) y áreas.", {}, async () => {
  const e = necesitaPagina(); if (e) return e;
  return texto(await pag.evaluate(() => {
    const g = (k) => { const v = window[k]; return v && v.val ? v.val : []; };
    const pts = g("__hekatanDrawingPoints"), pls = g("__hekatanDrawingPolylines"), ars = g("__hekatanDrawingAreas");
    return { nodos: pts.length, polilineas: pls.length,
      tramos: pls.reduce((s, p) => s + Math.max(0, p.length - 1), 0), areas: ars.length,
      primeros_nodos: pts.slice(0, 10) };
  }));
});

srv.tool("errores", "Errores de consola/página desde que se abrió.", {}, async () => texto(consola.length ? consola.join("\n") : "Sin errores."));

// ── elegir herramientas ─────────────────────────────────────────────────────
async function botonPorTexto(txt, selector) {
  const r = await pag.evaluate((t, sel) => {
    const vis = (x) => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const b = [...document.querySelectorAll(sel)].filter(vis).find((x) => (x.textContent || "").includes(t));
    if (!b) return null;
    b.scrollIntoView({ block: "center" });   // si está al borde, la barra de comandos de abajo tapa el clic
    const q = b.getBoundingClientRect();
    return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
  }, txt, selector);
  if (!r) return false;
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

// ── clic en coordenadas del MUNDO (x,y,z en m): proyecta con la cámara ───────
srv.tool("clic_mundo",
  "Un clic real sobre el lienzo en el punto del modelo (x, y, z) en metros: se proyecta con la cámara actual. Sirve para dibujar con las herramientas (Línea, Viga, Columna…) sobre puntos exactos.",
  { x: z.number(), y: z.number(), z: z.number().default(0) },
  async ({ x, y, z: zz }) => {
    const e = necesitaPagina(); if (e) return e;
    const p = await pag.evaluate((x, y, zz) => {
      const ctx = window.__hekatanViewerCtx || (window.__hekatanViewerElm && window.__hekatanViewerElm.__ctx);
      const cam = ctx && ctx.camera; if (!cam) return null;
      cam.updateMatrixWorld && cam.updateMatrixWorld(true);
      const V = cam.matrixWorldInverse.elements, P = cam.projectionMatrix.elements;
      const m = (M, [a, b, c, d]) => [M[0] * a + M[4] * b + M[8] * c + M[12] * d, M[1] * a + M[5] * b + M[9] * c + M[13] * d, M[2] * a + M[6] * b + M[10] * c + M[14] * d, M[3] * a + M[7] * b + M[11] * c + M[15] * d];
      const q = m(P, m(V, [x, y, zz, 1]));
      if (q[3] <= 0) return { detras: true };
      const c = document.querySelector("#viewer canvas") || document.querySelector("canvas"); const r = c.getBoundingClientRect();
      return { px: r.left + ((q[0] / q[3] + 1) / 2) * r.width, py: r.top + ((1 - q[1] / q[3]) / 2) * r.height, w: r.width, h: r.height, l: r.left, t: r.top };
    }, x, y, zz);
    if (!p) return falla("No encuentro la cámara del visor (__hekatanViewerCtx).");
    if (p.detras) return falla("Ese punto queda detrás de la cámara.");
    if (p.px < p.l || p.px > p.l + p.w || p.py < p.t || p.py > p.t + p.h) return falla(`El punto cae fuera de la pantalla (${Math.round(p.px)}, ${Math.round(p.py)}). Mueve la cámara o usa la vista adecuada.`);
    await mover(p.px, p.py);
    await pag.mouse.click(p.px, p.py); await esperar(250);
    return texto(`Clic en (${x}, ${y}, ${zz}) → pantalla (${Math.round(p.px)}, ${Math.round(p.py)})`);
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

const salir = async () => { try { if (nav) await nav.close(); } catch {} process.exit(0); };
process.on("SIGINT", salir); process.on("SIGTERM", salir);
await srv.connect(new StdioServerTransport());
