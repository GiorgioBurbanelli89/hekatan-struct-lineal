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
  await pag.mouse.move(x, y);
  await esperar(120);
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
      await pag.evaluate(() => {
        for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) document.getElementById(id)?.click();
      });
      await esperar(600);
    }
    return texto(`Abierto ${url}`);
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
        ribbon: [...document.querySelectorAll("[id*=ribbon] button, .ribbon button, [class*=ribbon] button")]
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
    const b = [...document.querySelectorAll(sel)].find((x) => (x.textContent || "").includes(t));
    if (!b) return null;
    const q = b.getBoundingClientRect();
    if (!q.width) return null;
    return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
  }, txt, selector);
  if (!r) return false;
  await pag.mouse.move(r.x, r.y); await esperar(150);
  await pag.mouse.click(r.x, r.y); await esperar(500);
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
