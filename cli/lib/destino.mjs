/**
 * destino.mjs — el MISMO guion, contra el build LOCAL o contra el sitio PÚBLICO, sin tocarlo.
 *
 * POR QUÉ (28-sep-2026): de los `ctl_*` solo 14 aceptaban `publico`, 4 iban por `URL_BASE`
 * y 21 llevaban `http://localhost:<puerto>` escrito a mano. Lo que prueban esos 21 no se
 * podía repetir en el sitio que ve Jorge. Reescribir 40 guiones es arriesgado; esto se pone
 * DELANTE de ellos:
 *
 *     node --import ./cli/lib/destino.mjs cli/ctl_cad.mjs
 *
 * con tres variables de entorno:
 *
 *     HK_DESTINO = local | publico     a dónde va `page.goto`
 *     HK_SALIDA  = <carpeta>           copia de cada captura + `_destino.json`
 *     HK_GUION   = <nombre>            (opcional) el nombre que sale en el registro
 *
 * Sin `HK_DESTINO` ni `HK_SALIDA` no hace nada.
 *
 * Qué hace:
 *   1. Reescribe la URL de `page.goto`. El guion, sus clics y sus medidas son los mismos;
 *      cambia solo el sitio.
 *        publico:  http://localhost:<p>/[hekatan-struct-lineal/]resto  →  <sitio público>/resto
 *        local:    <sitio público>/resto  y  http://localhost:4600/resto (servidor de desarrollo)
 *                  →  un servidor propio sobre `website/src/examples` (el BUILD)
 *   2. Apunta `pageerror`, `console.error`, peticiones rotas y HTTP ≥ 400 de TODAS las páginas,
 *      los pida el guion o no.
 *   3. Copia cada `page.screenshot` a `HK_SALIDA` y saca una captura final al cerrar la página:
 *      local y público escriben en la misma ruta de `cli/shots`, y sin la copia el segundo
 *      pisaría al primero.
 */
import puppeteer from "puppeteer";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, basename } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DESTINO = (process.env.HK_DESTINO || "").toLowerCase();
const SALIDA = process.env.HK_SALIDA || "";
const PUBLICA = (process.env.HK_URL_PUBLICA ||
  "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/").replace(/\/*$/, "/");
const BASE = "/hekatan-struct-lineal/";
const RAIZ_BUNDLE = join(AQUI, "..", "..", "website", "src", "examples");
const PUERTO_DEV = "4600";
const MAX_CAPTURAS = 400;
const MAX_EVENTOS = 300;

// Peticiones a terceros que el navegador corta: no son del producto.
const RUIDO = /google-analytics|googletagmanager|google\.com\/g\/collect|localhost:11434|ERR_ADDRESS_INVALID|favicon\.ico/;

const activo = DESTINO === "local" || DESTINO === "publico" || !!SALIDA;

// ── el servidor del build, solo si el destino es local ──────────────────────
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".heks": "application/json", ".txt": "text/plain",
};
let puertoLocal = 0;
if (DESTINO === "local") {
  const srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(RAIZ_BUNDLE, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => srv.listen(0, r));
  puertoLocal = srv.address().port;
  srv.unref();   // que no mantenga vivo el proceso cuando el guion termina
}

const RE_LOCAL = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::(\d+))?\/(.*)$/i;
const sinBase = (resto) => (resto.startsWith(BASE.slice(1)) ? resto.slice(BASE.length - 1) : resto);

/** La URL que pide el guion → la del destino elegido. */
export function destinar(url) {
  if (typeof url !== "string") return url;
  if (DESTINO === "publico") {
    const m = RE_LOCAL.exec(url);
    return m ? PUBLICA + sinBase(m[2]) : url;
  }
  if (DESTINO === "local") {
    if (url.startsWith(PUBLICA)) return `http://localhost:${puertoLocal}${BASE}${url.slice(PUBLICA.length)}`;
    if (url + "/" === PUBLICA) return `http://localhost:${puertoLocal}${BASE}`;
    const m = RE_LOCAL.exec(url);
    if (m && m[1] === PUERTO_DEV) return `http://localhost:${puertoLocal}${BASE}${sinBase(m[2])}`;
  }
  return url;
}

// ── el registro ─────────────────────────────────────────────────────────────
const reg = {
  guion: process.env.HK_GUION || basename(process.argv[1] || ""),
  destino: DESTINO || null,
  sitio: DESTINO === "publico" ? PUBLICA : DESTINO === "local" ? `http://localhost:${puertoLocal}${BASE}` : null,
  inicio: new Date().toISOString(),
  navegaciones: [], errores: [], avisos: [], ruido: 0, capturas: [],
};
if (SALIDA) mkdirSync(SALIDA, { recursive: true });
const guardar = () => {
  if (!SALIDA) return;
  try { writeFileSync(join(SALIDA, "_destino.json"), JSON.stringify({ ...reg, fin: new Date().toISOString() }, null, 1)); }
  catch { /* el disco lleno no tiene que tumbar la prueba */ }
};
const apuntar = (lista, que) => {
  if (RUIDO.test(que.texto || "") || RUIDO.test(que.url || "")) { reg.ruido++; return; }
  if (lista.length < MAX_EVENTOS) { lista.push(que); guardar(); }
};

let nCap = 0;
const dosCifras = (n) => String(n).padStart(3, "0");
const limpio = (s) => String(s).replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 70) || "pagina";
/** De la URL, solo lo que distingue una página de otra: la ruta tras la base y la consulta. */
const deUrl = (u) => {
  try { const x = new URL(u); return limpio((x.pathname + x.search).replace(BASE, "/")); }
  catch { return limpio(u); }
};

function guardarCaptura(ruta, dato, tipo, nombre) {
  if (!SALIDA || nCap >= MAX_CAPTURAS) return;
  nCap++;
  const ext = ruta ? extname(ruta) || ".png" : tipo === "jpeg" ? ".jpg" : tipo === "webp" ? ".webp" : ".png";
  const base = nombre || (ruta ? basename(ruta, extname(ruta)) : "captura");
  const destino = join(SALIDA, `${dosCifras(nCap)}_${limpio(base)}${ext}`);
  try {
    if (ruta && existsSync(ruta)) copyFileSync(ruta, destino);
    else if (typeof dato === "string") writeFileSync(destino, Buffer.from(dato, "base64"));
    else if (dato) writeFileSync(destino, dato);
    else return;
    reg.capturas.push({ archivo: basename(destino), origen: ruta || null });
    guardar();
  } catch { /* sin sitio en disco: se sigue */ }
}

const MARCA = Symbol.for("hk.destino");

function instrumentarPagina(pag) {
  if (!pag || pag[MARCA]) return pag;
  pag[MARCA] = { navego: false, final: false };

  pag.on("pageerror", (e) => apuntar(reg.errores, { tipo: "pageerror", texto: String(e?.message ?? e).slice(0, 300), url: pag.url() }));
  pag.on("console", (m) => {
    if (m.type() === "error") apuntar(reg.avisos, { tipo: "console.error", texto: m.text().slice(0, 300), url: pag.url() });
  });
  pag.on("requestfailed", (q) => apuntar(reg.avisos, { tipo: "peticion rota", texto: q.failure()?.errorText ?? "", url: q.url().slice(0, 300) }));
  pag.on("response", (r) => {
    if (r.status() >= 400) apuntar(reg.avisos, { tipo: `HTTP ${r.status()}`, texto: "", url: r.url().slice(0, 300) });
  });

  const ir = pag.goto.bind(pag);
  pag.goto = async (url, ...resto) => {
    const a = destinar(url);
    const t0 = Date.now();
    const nav = { pedida: url, abierta: a, estado: null, ms: null };
    reg.navegaciones.push(nav);
    try {
      const resp = await ir(a, ...resto);
      nav.estado = resp ? resp.status() : null;
      pag[MARCA].navego = true;
      return resp;
    } catch (e) {
      nav.estado = "error: " + String(e?.message ?? e).slice(0, 160);
      throw e;
    } finally { nav.ms = Date.now() - t0; guardar(); }
  };

  const foto = pag.screenshot.bind(pag);
  pag.screenshot = async (op = {}) => {
    const r = await foto(op);
    guardarCaptura(op?.path, r, op?.type);
    return r;
  };

  // la captura final: lo que había en pantalla cuando el guion dio la página por terminada
  pag[MARCA].fotoFinal = async () => {
    const m = pag[MARCA];
    if (!SALIDA || m.final || !m.navego || pag.isClosed()) return;
    m.final = true;
    try {
      const r = await Promise.race([
        foto({}), new Promise((_, no) => setTimeout(() => no(new Error("tarda")), 15000)),
      ]);
      guardarCaptura(null, r, "png", "final_" + deUrl(pag.url()));
    } catch { /* página colgada o ya cerrada */ }
  };
  const cerrar = pag.close.bind(pag);
  pag.close = async (...a) => { await pag[MARCA].fotoFinal(); return cerrar(...a); };
  return pag;
}

function instrumentarContexto(ctx) {
  if (!ctx || ctx[MARCA]) return ctx;
  ctx[MARCA] = true;
  const nueva = ctx.newPage.bind(ctx);
  ctx.newPage = async (...a) => instrumentarPagina(await nueva(...a));
  return ctx;
}

function instrumentarNavegador(nav) {
  if (!nav || nav[MARCA]) return nav;
  nav[MARCA] = true;
  const nueva = nav.newPage.bind(nav);
  nav.newPage = async (...a) => instrumentarPagina(await nueva(...a));
  const paginas = nav.pages.bind(nav);
  nav.pages = async (...a) => (await paginas(...a)).map(instrumentarPagina);
  if (typeof nav.createBrowserContext === "function") {
    const crear = nav.createBrowserContext.bind(nav);
    nav.createBrowserContext = async (...a) => instrumentarContexto(await crear(...a));
  }
  const cerrar = nav.close.bind(nav);
  nav.close = async (...a) => {
    try { for (const p of await paginas()) if (p[MARCA]?.fotoFinal) await p[MARCA].fotoFinal(); } catch { /* ya cerrado */ }
    guardar();
    return cerrar(...a);
  };
  return nav;
}

if (activo) {
  const lanzar = puppeteer.launch.bind(puppeteer);
  puppeteer.launch = async (...a) => instrumentarNavegador(await lanzar(...a));
  process.on("exit", guardar);
  guardar();
}
