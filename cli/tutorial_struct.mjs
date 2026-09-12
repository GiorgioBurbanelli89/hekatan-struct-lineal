#!/usr/bin/env node
/**
 * MOTOR de tutoriales de Hekatan Struct — la app DE VERDAD, en alta definición.
 *
 *     node cli/tutorial_struct.mjs plantillas_modal
 *
 * Graba el deploy tal cual (panel + visor + mandos) y le pinta encima lo que un
 * vídeo necesita y una captura pelada no tiene: el cursor, un CUADRO sobre el mando
 * del que se habla y una nota al lado. Deja `frames_tut_<nombre>/f000.png…` a
 * 1920×1080 y `pasos.json` con el fotograma en que empieza y acaba cada paso.
 *
 * ── POR QUÉ SE VE NÍTIDO (que era el problema) ──────────────────────────────
 *
 * Jorge: «esa resolución está horrible». El texto de los menús mide 11-12 px de CSS;
 * en un máster de 1280×720 eso es papilla y no hay compresor que lo arregle. Aquí:
 *
 *   · se captura con `deviceScaleFactor 2`: la ventana de 1280×720 sale a 2560×1440;
 *   · la vista general se REDUCE a 1920×1080 — reducir conserva el texto, ampliar lo
 *     borra;
 *   · y el primer plano de un menú es un RECORTE 1:1: 960×540 de CSS son exactamente
 *     1920×1080 píxeles del fichero. Es un zoom ×2 sin un solo píxel inventado.
 *
 * Con eso el texto del menú pasa de 11 px a 22 px reales en pantalla.
 *
 * ⚠️ El máster sale a 1920×1080, no a los 1280×720 que fija la GUIA_VIDEO. Es la
 * única forma de que un menú se lea; queda anotado para decidirlo, no escondido.
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, readdirSync, unlinkSync } from "fs";
import { createServer } from "http";
import { execFileSync } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAP = process.argv[2];
if (!CAP) { console.error("uso: node cli/tutorial_struct.mjs <capitulo>"); process.exit(1); }
const cap = await import(pathToFileURL(join(__dirname, "tutoriales", CAP + ".mjs")).href);
const OUT = join(__dirname, "..", "frames_tut_" + CAP);
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (/\.(png|json)$/.test(f)) unlinkSync(join(OUT, f));

const FFMPEG = process.env.FFMPEG ||
  "C:/Users/j-b-j/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const ANCHO = 1280, ALTO = 720;          // la ventana, en CSS
// Se graba la ventana SIN la banda de órdenes de abajo (640 de 720): esos 80 px de CSS
// se convierten en la franja negra donde va el subtítulo. Así el subtítulo no se come
// la interfaz y —lo que importa— no hay que encoger la imagen para hacerle sitio.
// 588 y no 640 (11-sep-2026): la franja de abajo lleva DOS subtítulos, español e
// inglés (Jorge: «subtítulos en inglés en la parte inferior»), y necesita ~200 px.
// Se graba 52 px de CSS menos por abajo en vez de encoger la imagen: la interfaz
// sale al mismo tamaño y nítida. 588 × 1.5 = 882 px de imagen + 198 de franja.
// Solo inglés (11-sep-2026): con UN idioma basta la franja de 120 px → 640 de interfaz.
const ALTO_UTIL = 640;
const H_OUT = Math.round(ALTO_UTIL * 1.5);
const ZW = 960, ZH = 480;                // primer plano en CSS; ×2 = 1920×960 NATIVOS

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
const PUERTO = Number(process.env.HK_PUERTO || 4780);
await new Promise((r) => srv.listen(PUERTO, r));

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
         "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: ANCHO, height: ALTO, deviceScaleFactor: 2 });
const avisos = [];
pag.on("pageerror", (e) => avisos.push("pageerror: " + e.message.slice(0, 160)));
// Un alert() (p. ej. «exportado») deja la página parada hasta que alguien lo cierre.
let ultimoDialogo = null;
pag.on("dialog", (d) => { ultimoDialogo = d.message(); avisos.push("dialogo: " + d.message().slice(0, 120)); d.accept().catch(() => {}); });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
// `cap.ruta` deja abrir cualquier página del deploy — la PORTADA, por ejemplo, que es
// donde se elige con qué trabajar y no tiene visor 3D que esperar.
const RUTA = cap.ruta || ("workspace/?t=" + (cap.ejemplo || "plantillas"));
// ⚠️ A veces la primera carga sale «net::ERR_ABORTED» (la página se redirige a sí
// misma al arrancar, sobre todo con la máquina cargada). No es un fallo: se sigue
// esperando al visor.
try {
  await pag.goto("http://localhost:" + PUERTO + BASE + RUTA, { waitUntil: "networkidle2", timeout: 180000 });
} catch (e) {
  if (!/ERR_ABORTED/.test(String(e))) throw e;
  console.log("  (carga abortada y rehecha: " + String(e).slice(0, 60) + ")");
  await espera(3000);
}
if (!cap.ruta || /workspace/.test(cap.ruta))
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(cap.ruta && !/workspace/.test(cap.ruta) ? 2500 : 7000);

// ── Lo que en un tutorial ESTORBA ────────────────────────────────────────────
// La etiqueta «X=… Y=… Z=…» y la cruz roja siguen al ratón por el lienzo: dibujando
// sirven, pero en el vídeo el cursor pasa por encima de los botones del panel y la
// etiqueta los tapa («Pórtico 3D» salía debajo de «X=4.50 Y=39.50»). Se ocultan.
await pag.addStyleTag({ content:
  // (y la entrada dinámica #hk-dyn, «Designe objetos…», que también sigue al ratón)
  "#hk-coord-readout, #hk-coord-fixed, #hk-dyn { display:none !important }" +
  // Se graban 588 de los 720 px (abajo va la franja de dos subtítulos): las últimas
  // filas de cada panel quedaban fuera del cuadro aunque el panel bajara del todo
  // («Ex lateral» del pórtico). Un margen al final deja subirlas. No cambia nada de
  // lo que el usuario puede hacer: solo añade hueco para desplazar.
  "#hk-pane-host, #settings { padding-bottom: 72px !important; box-sizing: border-box !important }" });

// ── La capa que se pinta ENCIMA de la app ───────────────────────────────────
// Cursor, cuadro y nota. El ratón de verdad no sale en las capturas, y sin cuadro no
// se sabe de qué mando se está hablando: era lo que Jorge pedía («resaltando o con
// cuadros»). Va como overlay sobre la app real, no sobre una imitación.
await pag.evaluate(() => {
  const capa = document.createElement("div");
  capa.id = "hk-tut-capa";
  capa.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none";
  document.body.appendChild(capa);
  const cur = document.createElement("div");
  cur.style.cssText = "position:fixed;left:-100px;top:-100px;width:26px;height:26px";
  cur.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26">' +
    '<path d="M4 2 L4 19 L9 14.5 L12 21.5 L15 20 L12 13.5 L18.5 13.5 Z" fill="#fff" ' +
    'stroke="#0b1220" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  capa.appendChild(cur);
  // Anillo de CLIC: cuando se pulsa, el cursor se pone ROJO y sale un aro, para
  // que en el vídeo se vea CUÁNDO se está haciendo clic (Jorge, 11-sep-2026).
  const aro = document.createElement("div");
  aro.style.cssText = "position:fixed;display:none;border:3px solid #ff2d55;border-radius:50%;" +
    "box-shadow:0 0 10px rgba(255,45,85,.8);pointer-events:none;transform:translate(-50%,-50%)";
  capa.appendChild(aro);
  const curPath = cur.querySelector("path");
  const caja = document.createElement("div");
  caja.style.cssText = "position:fixed;display:none;border:3px solid #22d3ee;border-radius:6px;" +
    "box-shadow:0 0 0 4px rgba(34,211,238,.18),0 0 22px rgba(34,211,238,.55)";
  capa.appendChild(caja);
  const nota = document.createElement("div");
  nota.style.cssText = "position:fixed;display:none;background:rgba(8,12,18,.96);" +
    "border:1px solid #22d3ee;border-left:5px solid #22d3ee;border-radius:6px;color:#e8f6fb;" +
    "font:600 15px 'Segoe UI',system-ui,sans-serif;padding:9px 13px;max-width:420px;" +
    "box-shadow:0 8px 26px rgba(0,0,0,.7);line-height:1.35";
  capa.appendChild(nota);
  // Flecha grande que apunta al botón/fila resaltado (Jorge: «no se sabe dónde es»).
  const flecha = document.createElement("div");
  flecha.style.cssText = "position:fixed;display:none;font-size:58px;line-height:1;color:#facc15;" +
    "filter:drop-shadow(0 0 7px rgba(250,204,21,.95));z-index:2147483646;pointer-events:none;" +
    "transform:translateY(-50%);font-family:'Segoe UI Symbol',system-ui";
  flecha.textContent = "➤";   // ➤
  capa.appendChild(flecha);
  window.__tutFlecha = (x, y) => { flecha.style.display = "block"; flecha.style.left = (x - 60) + "px"; flecha.style.top = y + "px"; };
  // Mover el cursor = estado NORMAL (blanco, sin aro).
  window.__tutCursor = (x, y) => {
    cur.style.left = x + "px"; cur.style.top = y + "px";
    curPath.setAttribute("fill", "#fff"); aro.style.display = "none";
  };
  // Estado PULSADO: cursor ROJO + aro sobre el punto de clic. Es de ESTADO (no
  // temporizado) para que SIEMPRE lo pillen los fotogramas del vídeo; el
  // siguiente `__tutCursor` (mover) lo devuelve a blanco.
  window.__tutClick = (x, y) => {
    if (x != null) { cur.style.left = x + "px"; cur.style.top = y + "px"; }
    else { x = parseFloat(cur.style.left) || 0; y = parseFloat(cur.style.top) || 0; }
    curPath.setAttribute("fill", "#ff2d55");
    aro.style.display = "block";
    aro.style.left = x + "px"; aro.style.top = y + "px";
    aro.style.width = "34px"; aro.style.height = "34px";
  };
  window.__tutSinCaja = () => { caja.style.display = "none"; nota.style.display = "none"; flecha.style.display = "none"; };
  /** Cuadro sobre el rectángulo `r` y, si hay texto, una nota al lado que no lo tape. */
  window.__tutCaja = (r, txt, lim) => {
    caja.style.display = "block";
    caja.style.left = (r.x - 5) + "px"; caja.style.top = (r.y - 4) + "px";
    caja.style.width = (r.w + 10) + "px"; caja.style.height = (r.h + 8) + "px";
    // Flecha a la izquierda del recuadro, apuntándolo.
    window.__tutFlecha(r.x, r.y + r.h / 2);
    if (!txt) { nota.style.display = "none"; return; }
    nota.style.display = "block"; nota.textContent = txt;
    const n = nota.getBoundingClientRect();
    // al LADO antes que debajo: debajo tapa la fila siguiente, que suele ser justo
    // la que se está explicando
    let x, y = Math.max(lim.y + 6, Math.min(lim.y + lim.h - n.height - 6, r.y + r.h / 2 - n.height / 2));
    if (r.x + r.w + 20 + n.width < lim.x + lim.w - 6) x = r.x + r.w + 20;
    else if (r.x - 20 - n.width > lim.x + 6) x = r.x - 20 - n.width;
    else { x = Math.max(lim.x + 6, Math.min(lim.x + lim.w - n.width - 6, r.x));
           y = r.y + r.h + 16 + n.height < lim.y + lim.h ? r.y + r.h + 16 : r.y - n.height - 16; }
    nota.style.left = x + "px"; nota.style.top = y + "px";
  };
});

// ── Las DESCARGAS: se capturan para enseñar el archivo ──────────────────────
// Exportar (.e2k, .s2k, .f2k) crea un <a download> con un blob y lo pulsa. En el vídeo
// eso no se ve: no hay barra de descargas. Se intercepta el clic, se lee el blob y el
// motor enseña el principio del archivo (api.archivo) — lo que el usuario abriría.
await pag.evaluate(() => {
  const orig = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && /^blob:/.test(this.href)) {
      const nombre = this.download;
      fetch(this.href).then((r) => r.text()).then((texto) => { window.__tutDescarga = { nombre, texto }; });
      return;
    }
    return orig.call(this);
  };
});

// ── La captura ───────────────────────────────────────────────────────────────
let k = 0;
let zona = null;      // null = ventana entera; si no, el recorte 1:1 de 960×540
const clipDe = () => zona
  ? { x: zona.x, y: zona.y, width: ZW, height: ZH }
  : { x: 0, y: 0, width: ANCHO, height: ALTO_UTIL };
const foto = async (n = 1) => {
  for (let i = 0; i < n; i++)
    // ⚠️ `captureBeyondViewport: false`. Con el valor por defecto, puppeteer cambia las
    // métricas de la ventana para cada captura con recorte: eso dispara «resize», la app
    // reencuadra la cámara (scheduleRefit → autoFitCamera, que no mira si el usuario la
    // movió) y el alzado volvía a la isométrica en la foto siguiente.
    await pag.screenshot({ path: join(OUT, "f" + String(k++).padStart(3, "0") + ".png"),
                           clip: clipDe(), captureBeyondViewport: false });
};
/** El recuadro que se ve ahora, para que la nota no se salga de cuadro. */
const limite = () => zona ? { x: zona.x, y: zona.y, w: ZW, h: ZH }
                          : { x: 0, y: 0, w: ANCHO, h: ALTO_UTIL };

const raton = async (x, y, pasos = 12) => {
  const p0 = await pag.evaluate(() => window.__tutXY || { x: 640, y: 360 });
  for (let i = 1; i <= pasos; i++) {
    const t = i / pasos;
    const px = p0.x + (x - p0.x) * t, py = p0.y + (y - p0.y) * t;
    await pag.mouse.move(px, py);
    await pag.evaluate((q) => { window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: px, y: py });
    if (i % 4 === 0) await foto();
  }
  await pag.evaluate((q) => { window.__tutXY = q; }, { x, y });
  await foto(2);
};
/**
 * Clic CON aviso visual: el cursor se pone ROJO y sale el aro (se ve en el
 * vídeo CUÁNDO se pulsa), se captura ese fotograma, y recién ahí se hace el clic
 * de verdad. (Jorge, 11-sep-2026: «que se cambie de color mi cursor así sabremos
 * si estás dando click».)
 */
const clic = async (x, y) => {
  await pag.evaluate((q) => window.__tutClick(q.x, q.y), { x, y });
  await foto(2);
  await pag.mouse.click(x, y);
  await foto(1);
};
/**
 * Rectángulo (CSS) de un control.
 *
 *   "boton"  por el texto del botón
 *   "fila"   por la etiqueta de la fila del panel
 *   "sel"    por un selector CSS — hace falta para la PORTADA, que no es un panel de
 *            mandos sino tres tarjetas: «Modelo nuevo», «Modelo existente», «Ejemplos».
 */
const rect = (que, texto) => pag.evaluate((q) => {
  let e = null;
  if (q.q === "sel") {
    e = [...document.querySelectorAll(q.t)].filter((x) => x.offsetParent !== null)[0];
  } else if (q.q === "carpeta") {
    // el TÍTULO de una carpeta del panel («¿Con qué vas a trabajar?», «Nuevo modelo»)
    e = [...document.querySelectorAll(".tp-fldv_b, .tp-fldv_t")]
      .filter((x) => x.offsetParent !== null && (x.textContent || "").includes(q.t))[0];
    if (e && e.classList.contains("tp-fldv_t")) e = e.closest(".tp-fldv_b") || e;
  } else if (q.q === "boton") {
    e = [...document.querySelectorAll("button, .tp-btnv_b, a.card")]
      .filter((x) => x.offsetParent !== null && (x.textContent || "").includes(q.t))[0];
  } else {
    // ⚠️ La fila VISIBLE. Al cambiar de ejemplo desde el menú queda un panel viejo,
    // oculto, con las mismas etiquetas: cogiendo la primera se medía esa (0×0) y la
    // fila «Ex lateral» salía «no se ve» aunque estaba ahí.
    const filas = [...document.querySelectorAll(".tp-lblv")]
      .filter((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q.t));
    e = filas.find((x) => x.offsetParent !== null && x.closest("#hk-pane-host")) ||
        filas.find((x) => x.offsetParent !== null) || filas[0];
  }
  if (!e) return null;
  // Primero, que el navegador lo traiga al centro de su panel (mueve todos los
  // contenedores que haga falta). El bucle de abajo queda para lo que no se mueva así.
  if (q.q !== "sel") { try { e.scrollIntoView({ block: "center", inline: "nearest" }); } catch {} }
  // Los paneles llevan más mandos de los que caben. Sin traerlo a la vista, medir un
  // mando que está por debajo del corte daba un rectángulo fuera de pantalla: el
  // recorte iba a parar a un trozo negro y el paso se perdía («separación X (m)»).
  let p = e.parentElement;
  while (p && p !== document.body) {
    if (p.scrollHeight > p.clientHeight + 4) {
      // a media altura, lejos del borde de abajo — ahí la barra de órdenes lo tapa y
      // además cae fuera de los 640 px que se graban
      const rp = p.getBoundingClientRect(), re = e.getBoundingClientRect();
      if (re.top < rp.top + 40 || re.bottom > Math.min(rp.bottom, 560))
        p.scrollTop += re.top - (rp.top + Math.min(rp.height, 540) * 0.4);
      break;
    }
    p = p.parentElement;
  }
  const r = e.getBoundingClientRect();
  // 0×0 = está dentro de una carpeta PLEGADA: no es un sitio, es que no se ve
  if (r.width < 2 || r.height < 2) return null;
  if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return null;
  // por debajo de lo que se graba (la banda de órdenes): el cuadro saldría cortado
  if (r.bottom > q.lim) return null;
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}, { q: que, t: texto, lim: ALTO_UTIL });

const api = {
  pag, espera, foto,
  /** Quieto n fotogramas, para que la voz pueda hablar sobre lo que se ve. */
  quieto: async (n, ms = 260) => { for (let i = 0; i < n; i++) { await espera(ms); await foto(); } },
  /** Vista general: la ventana entera. */
  general: async () => { zona = null; await pag.evaluate(() => window.__tutSinCaja()); },
  /**
   * PRIMER PLANO de un mando: recorte 1:1 de 960×540 CSS centrado en él. Los píxeles
   * son los del fichero, así que se ve como en la pantalla, no ampliado.
   */
  cerca: async (que, texto) => {
    const r = await rect(que, texto);
    if (!r) { console.log("  x no se ve: " + texto); return false; }
    zona = { x: Math.max(0, Math.min(ANCHO - ZW, Math.round(r.x + r.w / 2 - ZW / 2))),
             y: Math.max(0, Math.min(ALTO_UTIL - ZH, Math.round(r.y + r.h / 2 - ZH / 2))) };
    return true;
  },
  /** Primer plano por selector CSS (tarjetas de la portada, cabeceras, lo que sea). */
  cercaSel: async (sel) => {
    const r = await rect("sel", sel);
    if (!r) { console.log("  x no se ve: " + sel); return false; }
    zona = { x: Math.max(0, Math.min(ANCHO - ZW, Math.round(r.x + r.w / 2 - ZW / 2))),
             y: Math.max(0, Math.min(ALTO_UTIL - ZH, Math.round(r.y + r.h / 2 - ZH / 2))) };
    return true;
  },
  /** Cuadro + nota sobre un mando (y el cursor va hasta él). */
  marcar: async (que, texto, nota) => {
    const r = await rect(que, texto);
    if (!r) { console.log("  x no se ve: " + texto); return false; }
    await raton(r.x + r.w - 14, r.y + r.h / 2);
    await pag.evaluate((q) => window.__tutCaja(q.r, q.n, q.l), { r, n: nota || "", l: limite() });
    await foto(3);
    return true;
  },
  sinCuadro: async () => { await pag.evaluate(() => window.__tutSinCaja()); },
  /**
   * ABRE una carpeta del panel, con el cursor, si está plegada.
   *
   * Media app arranca plegada — es lo que hay que enseñar: el mando no está escondido,
   * está en su carpeta. Y sin abrirla, sus filas miden 0×0 y el primer plano se iba a
   * un trozo negro (pasó con «separación X (m)»).
   */
  abrir: async (titulo, ms = 700) => {
    // ⚠️ Las carpetas van ANIDADAS («Cargas» está dentro de «Parámetros»). Abrir solo la
    // de dentro no sirve si la de fuera sigue plegada: la fila seguía midiendo 0×0 y el
    // recorte se iba a una esquina, con la nota diciendo «de 30 a 120 kN» sobre nada.
    // Se abren TODAS las carpetas plegadas del camino, de fuera hacia dentro, y luego
    // se desplaza el panel para que el título quede a la vista.
    const plan = await pag.evaluate((t) => {
      // los títulos VISIBLES (un panel viejo oculto repite los mismos nombres)
      const tits = [...document.querySelectorAll(".tp-fldv_t")].filter((x) => x.offsetParent !== null);
      // el título que ES esa carpeta (igual) antes que el que solo la contiene
      const tit = tits.find((x) => (x.textContent || "").trim() === t) ||
                  tits.find((x) => (x.textContent || "").trim().endsWith(t)) ||
                  tits.find((x) => (x.textContent || "").includes(t));
      if (!tit) return null;
      const cadena = [];
      let f = tit.closest(".tp-fldv");
      while (f) { cadena.unshift(f); f = f.parentElement && f.parentElement.closest(".tp-fldv"); }
      cadena.forEach((c, i) => { c.dataset.tutAbrir = String(i); });
      // ⚠️ En esta versión de Tweakpane la plegada LLEVA `tp-fldv-cpl`; no es que le
      // falte `tp-fldv-expanded`. Con la comprobación al revés todas parecían plegadas
      // y se pulsaban también las abiertas — que se CERRABAN.
      return cadena.map((c) => c.classList.contains("tp-fldv-cpl"));
    }, titulo);
    if (!plan) { console.log("  x no se ve la carpeta: " + titulo); return false; }
    for (let i = 0; i < plan.length; i++) {
      // traer el título a la vista ANTES de ir con el ratón
      const r = await pag.evaluate((n) => {
        const f = document.querySelector('[data-tut-abrir="' + n + '"]');
        const b = f && f.querySelector(":scope > .tp-fldv_b");
        if (!b) return null;
        const host = document.getElementById("hk-pane-host") || b.closest("[style*=overflow]");
        if (host) {
          // SIEMPRE a un tercio de altura, no «que asome». El panel sigue por DEBAJO de
          // la barra de órdenes: una carpeta que asomaba en el borde de abajo quedaba
          // tapada por la barra y el clic caía en la barra (pasó con «Cargas»).
          const rh = host.getBoundingClientRect(), rb = b.getBoundingClientRect();
          host.scrollTop += rb.top - (rh.top + Math.min(rh.height, 540) * 0.3);
        }
        const q = b.getBoundingClientRect();
        return { x: q.left, y: q.top, w: q.width, h: q.height };
      }, i);
      if (!r || !plan[i]) continue;          // ya estaba abierta: no se toca
      await raton(r.x + r.w / 2, r.y + r.h / 2);
      await pag.evaluate((q) => window.__tutCaja(q.r, "", q.l), { r, l: limite() });
      await foto(2);
      await clic(r.x + r.w / 2, r.y + r.h / 2);
      await espera(ms);
    }
    await pag.evaluate(() => {
      document.querySelectorAll("[data-tut-abrir]").forEach((x) => x.removeAttribute("data-tut-abrir"));
      window.__tutSinCaja();
    });
    await foto(2);
    return true;
  },
  /**
   * PLIEGA una carpeta abierta (con el cursor). Para hacer sitio: «CLI Comandos» viene
   * abierta con su cuadro de texto y empuja «Cargas» por debajo de lo que se graba.
   */
  cerrar: async (titulo, ms = 600) => {
    const r = await pag.evaluate((t) => {
      const tit = [...document.querySelectorAll(".tp-fldv_t")].find((x) => (x.textContent || "").trim().endsWith(t));
      const f = tit && tit.closest(".tp-fldv");
      if (!f || f.classList.contains("tp-fldv-cpl")) return null;
      const q = f.querySelector(":scope > .tp-fldv_b").getBoundingClientRect();
      return { x: q.left, y: q.top, w: q.width, h: q.height };
    }, titulo);
    if (!r) return false;
    await raton(r.x + r.w / 2, r.y + r.h / 2);
    await pag.evaluate((q) => window.__tutCaja(q.r, "", q.l), { r, l: limite() });
    await foto(2);
    await clic(r.x + r.w / 2, r.y + r.h / 2);
    await espera(ms);
    await pag.evaluate(() => window.__tutSinCaja());
    await foto(2);
    return true;
  },
  /** Cuadro + nota por selector CSS. */
  marcarSel: async (sel, nota) => {
    const r = await rect("sel", sel);
    if (!r) { console.log("  x no se ve: " + sel); return false; }
    await raton(r.x + r.w - 22, r.y + r.h / 2);
    await pag.evaluate((q) => window.__tutCaja(q.r, q.n, q.l), { r, n: nota || "", l: limite() });
    await foto(3);
    return true;
  },
  /** Va al botón y lo pulsa, con el cursor y el cuadro a la vista. */
  pulsar: async (texto, ms = 900, que = "boton") => {
    const r = await rect(que, texto);
    if (!r) { console.log("  x no se ve el boton: " + texto); return false; }
    await raton(r.x + r.w / 2, r.y + r.h / 2);
    await pag.evaluate((q) => window.__tutCaja(q.r, "", q.l), { r, l: limite() });
    await foto(3);
    await clic(r.x + r.w / 2, r.y + r.h / 2);
    await espera(250); await foto(3);
    await pag.evaluate(() => window.__tutSinCaja());
    await espera(ms);
    return true;
  },
  /**
   * Cuadro + nota sobre un RECTÁNGULO cualquiera (CSS). Para lo que no es un mando del
   * panel: una barra del alzado 2D es una línea de SVG, y su caja mide 0 de alto.
   */
  marcarR: async (r, nota) => {
    if (!r) { console.log("  x no hay rectangulo"); return false; }
    await raton(r.x + r.w / 2, r.y + r.h / 2);
    await pag.evaluate((q) => window.__tutCaja(q.r, q.n, q.l), { r, n: nota || "", l: limite() });
    await foto(3);
    return true;
  },
  /** Va a un rectángulo y hace clic en su centro, con el cursor y el cuadro a la vista. */
  pulsarR: async (r, ms = 900) => {
    if (!r) { console.log("  x no hay rectangulo"); return false; }
    await raton(r.x + r.w / 2, r.y + r.h / 2);
    await pag.evaluate((q) => window.__tutCaja(q.r, "", q.l), { r, l: limite() });
    await foto(3);
    await clic(r.x + r.w / 2, r.y + r.h / 2);
    await espera(250); await foto(3);
    await pag.evaluate(() => window.__tutSinCaja());
    await espera(ms);
    return true;
  },
  /**
   * Enseña el archivo que se acaba de exportar: una ventana con su nombre, su tamaño y
   * sus primeras líneas, al lado derecho. `marcas` resalta las líneas que contienen
   * esas palabras (p. ej. ["JOINT", "FRAME"]).
   */
  archivo: async (nota, { lineas = 18, desde = 0, marcas = [], buscar = null } = {}) => {
    for (let i = 0; i < 30 && !(await pag.evaluate(() => !!window.__tutDescarga)); i++) await espera(200);
    const info = await pag.evaluate((q) => {
      const d = window.__tutDescarga;
      if (!d) return null;
      const todas = d.texto.split(/\r?\n/);
      if (q.buscar) { const k = todas.findIndex((l) => l.includes(q.buscar)); if (k > 0) q.desde = Math.max(0, k - 1); }
      const ver = todas.slice(q.desde, q.desde + q.lineas);
      let w = document.getElementById("hk-tut-archivo");
      if (!w) {
        w = document.createElement("div"); w.id = "hk-tut-archivo";
        w.style.cssText = "position:fixed;right:18px;top:64px;width:600px;z-index:2147483646;" +
          "background:#0b1018;border:1px solid #22d3ee;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.7);" +
          "font:12px Consolas,monospace;color:#cfe3ee;overflow:hidden";
        document.body.appendChild(w);
      }
      const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      w.innerHTML = '<div style="padding:8px 12px;background:#12202c;border-bottom:1px solid #22d3ee;' +
        'font:600 14px Segoe UI,system-ui,sans-serif;color:#e8f6fb">📄 ' + esc(d.nombre) +
        '<span style="float:right;color:#8fb3c6;font-weight:400">' + todas.length + " líneas · " +
        (d.texto.length / 1024).toFixed(1) + " KB</span></div>" +
        '<pre style="margin:0;padding:8px 12px;white-space:pre;overflow:hidden;line-height:17px">' +
        ver.map((l) => {
          const m = q.marcas.some((k) => l.includes(k));
          return '<span style="' + (m ? "color:#ffd166;font-weight:700" : "") + '">' + esc(l.slice(0, 78)) + "</span>";
        }).join("\n") + "</pre>";
      return { nombre: d.nombre, lineas: todas.length, kb: +(d.texto.length / 1024).toFixed(1), texto: d.texto };
    }, { lineas, desde, marcas, buscar });
    if (!info) { console.log("  x no se capturo ninguna descarga"); return null; }
    if (nota) await pag.evaluate((n) => {
      const r = document.getElementById("hk-tut-archivo").getBoundingClientRect();
      window.__tutCaja({ x: r.left, y: r.top, w: r.width, h: r.height }, n,
        { x: 0, y: 0, w: innerWidth, h: 640 });
    }, nota);
    await foto(3);
    return info;
  },
  /**
   * PORTADA: «Bienvenidos a Hekatan Struct» — el logo con el nombre y de qué trata el
   * capítulo, sobre la app ya abierta. Dura lo que dure su frase.
   */
  portada: async (titulo, capitulo, n = 14) => {
    await pag.evaluate((q) => {
      const w = document.createElement("div"); w.id = "hk-tut-portada";
      w.style.cssText = "position:fixed;inset:0;z-index:2147483644;background:radial-gradient(ellipse at 50% 40%,#16202e 0%,#070a10 75%);" +
        "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;font-family:'Segoe UI',system-ui,sans-serif";
      w.innerHTML = '<img src="' + q.logo + '" style="height:210px;border-radius:26px;box-shadow:0 14px 40px rgba(0,0,0,.6)">' +
        '<div style="color:#e6c463;font:600 20px Segoe UI,system-ui,sans-serif;letter-spacing:3px;text-transform:uppercase">' + q.cap + "</div>" +
        '<div style="color:#f2f5fa;font:700 40px Segoe UI,system-ui,sans-serif;text-align:center;max-width:1000px;line-height:1.2">' + q.tit + "</div>";
      document.body.appendChild(w);
    }, { tit: titulo, cap: capitulo, logo: LOGO_CUADRADO });
    await espera(600);
    await foto(n);
    await pag.evaluate(() => document.getElementById("hk-tut-portada")?.remove());
    await foto(1);
  },
  /**
   * El AVISO (alert) que la app acaba de dar. El navegador sin pantalla lo acepta solo
   * y no sale en la foto; la persona sí lo ve y pulsa «Aceptar». Se dibuja como el de
   * Chrome, el cursor va al botón y lo pulsa.
   */
  dialogo: async (quieto = 6) => {
    for (let i = 0; i < 15 && !ultimoDialogo; i++) await espera(200);
    if (!ultimoDialogo) { console.log("  x no hubo aviso"); return null; }
    const msg = ultimoDialogo; ultimoDialogo = null;
    const b = await pag.evaluate((m) => {
      const w = document.createElement("div"); w.id = "hk-tut-alert";
      w.style.cssText = "position:fixed;left:50%;top:22px;transform:translateX(-50%);width:440px;z-index:2147483646;" +
        "background:#2b2b2b;color:#e8e8e8;border-radius:8px;box-shadow:0 10px 36px rgba(0,0,0,.75);" +
        "font:13px 'Segoe UI',system-ui,sans-serif;padding:18px 20px 14px";
      const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      w.innerHTML = '<div style="font-weight:600;margin-bottom:10px">Este sitio dice</div>' +
        '<div style="white-space:pre-wrap;line-height:1.45">' + esc(m) + "</div>" +
        '<div style="text-align:right;margin-top:14px"><span id="hk-tut-alert-ok" style="display:inline-block;' +
        'background:#8ab4f8;color:#202124;border-radius:16px;padding:6px 20px;font-weight:600">Aceptar</span></div>';
      document.body.appendChild(w);
      const r = document.getElementById("hk-tut-alert-ok").getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, msg);
    await foto(quieto);
    await raton(b.x, b.y, 10);
    await foto(2);
    await pag.evaluate(() => document.getElementById("hk-tut-alert")?.remove());
    await foto(1);
    return msg;
  },
  /** Quita la ventana del archivo y vacía la descarga capturada. */
  sinArchivo: async () => {
    await pag.evaluate(() => { document.getElementById("hk-tut-archivo")?.remove(); window.__tutDescarga = null; window.__tutSinCaja(); });
  },
  /**
   * Cambia un parámetro COMO LO HARÍA UNA PERSONA: el cursor va a la casilla del
   * número, clic, se borra, se escribe el valor y Enter. Antes el valor se ponía por
   * dentro (`__hekatanSetParam`) con el cursor quieto encima: Jorge — «tiene que ser
   * realista, usando el clic del mouse».
   */
  param: async (etiqueta, clave, valor, ms = 3000) => {
    const r = await rect("fila", etiqueta);
    const caja = r && await pag.evaluate((q) => {
      const filas = [...document.querySelectorAll(".tp-lblv")]
        .filter((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q) && x.offsetParent !== null);
      const f = filas.find((x) => x.closest("#hk-pane-host")) || filas[0];
      const i = f && [...f.querySelectorAll("input")].filter((x) => x.type !== "checkbox" && x.offsetParent !== null).pop();
      if (!i) return null;
      document.querySelectorAll("#hk-tut-num").forEach((x) => x.removeAttribute("id"));
      i.id = "hk-tut-num";
      const b = i.getBoundingClientRect();
      return { x: b.left, y: b.top, w: b.width, h: b.height };
    }, etiqueta);
    if (!caja) {
      console.log("  x sin casilla de numero: " + etiqueta + " (se pone por dentro)");
      await pag.evaluate((q) => window.__hekatanSetParam(q.c, q.v), { c: clave, v: valor });
      await espera(ms); await foto(3);
      return false;
    }
    await raton(caja.x + caja.w / 2, caja.y + caja.h / 2);
    await pag.evaluate((q) => window.__tutCaja(q.r, "", q.l), { r: caja, l: limite() });
    await foto(2);
    await pag.click("#hk-tut-num", { clickCount: 3 });
    await pag.keyboard.down("Control"); await pag.keyboard.press("KeyA"); await pag.keyboard.up("Control");
    await foto(1);
    for (const c of String(valor)) { await pag.keyboard.type(c); await espera(90); await foto(1); }
    await pag.keyboard.press("Enter");
    await espera(ms);
    await pag.evaluate(() => window.__tutSinCaja());
    await foto(3);
    return true;
  },
  /** Clic en la CASILLA de una fila (encender/apagar), con el cursor a la vista. */
  casilla: async (etiqueta, ms = 1200) => {
    // primero la fila a la vista (desplaza su panel si hace falta), luego su casilla
    if (!(await rect("fila", etiqueta))) { console.log("  x no se ve la fila: " + etiqueta); return false; }
    const r = await pag.evaluate((q) => {
      const filas = [...document.querySelectorAll(".tp-lblv")]
        .filter((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q) && x.offsetParent !== null);
      const f = filas[0];
      const c = f && (f.querySelector(".tp-ckbv_w") || f.querySelector("input[type=checkbox]"));
      if (!c) return null;
      const b = c.getBoundingClientRect();
      return { x: b.left, y: b.top, w: Math.max(b.width, 16), h: Math.max(b.height, 16) };
    }, etiqueta);
    if (!r) { console.log("  x no se ve la casilla: " + etiqueta); return false; }
    await raton(r.x + r.w / 2, r.y + r.h / 2);
    await pag.evaluate((q) => window.__tutCaja(q.r, "", q.l), { r, l: limite() });
    await foto(2);
    await clic(r.x + r.w / 2, r.y + r.h / 2);
    await espera(ms);
    await pag.evaluate(() => window.__tutSinCaja());
    await foto(2);
    return true;
  },
  /**
   * Cambia la VISTA con los botones de la app (carpeta «Vista» del panel): el cursor
   * abre la carpeta y pulsa el botón. Nada de mover la cámara por dentro: si la vista
   * cambia, se tiene que ver quién la cambió.
   */
  vista: async (boton, ms = 1200) => {
    await api.abrir("Vista");
    return api.pulsar(boton, ms);
  },
  /** Elige una opción de un desplegable del panel, por su texto. */
  elegir: async (etiqueta, textoOpcion, ms = 3500) => {
    const r = await rect("fila", etiqueta);
    if (r) {
      await raton(r.x + r.w - 30, r.y + r.h / 2);
      await pag.evaluate((q) => window.__tutCaja(q.r, "", q.l), { r, l: limite() });
      await foto(2);
    }
    const val = await pag.evaluate((q) => {
      const fila = [...document.querySelectorAll(".tp-lblv")]
        .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q.e));
      const s = fila && fila.querySelector("select");
      if (!s) return null;
      // ⚠️ Quitar el id al desplegable de la vez ANTERIOR. Si no, quedan dos con el
      // mismo id y `page.select` cambia el primero —el viejo—: «Frame results» se
      // quedaba en «none» mientras el vídeo decía que se encendía el diagrama.
      document.querySelectorAll("#hk-tut-select").forEach((x) => x.removeAttribute("id"));
      s.id = "hk-tut-select";
      // la opción IGUAL antes que la que solo la contiene: «Moment 3-3» también está
      // dentro de «Moment 3-3 (diagram)», que es otra cosa (pinta colores)
      // el texto con los espacios juntados: «Cimentaciones  (4️⃣)» lleva dos
      const n = (t) => (t || "").replace(/\s+/g, " ").trim();
      const o = [...s.options].find((x) => n(x.textContent) === n(q.t)) ||
                [...s.options].find((x) => n(x.textContent).includes(n(q.t)));
      return o ? o.value : null;
    }, { e: etiqueta, t: textoOpcion });
    if (val == null) { console.log("  x no se ve la opcion: " + textoOpcion); return false; }
    // LA LISTA ABIERTA. El navegador sin pantalla no pinta la lista de un <select> al
    // pulsarlo, y en el vídeo el valor cambiaba «solo». Se dibuja la lista con SUS
    // opciones debajo del desplegable, el cursor baja hasta la elegida y hace clic.
    const lista = await pag.evaluate((v) => {
      window.__tutSinCaja();                       // el cuadro de la fila, fuera: la lista lo tapa
      const s = document.getElementById("hk-tut-select");
      const r = s.getBoundingClientRect();
      const ops = [...s.options].map((o) => ({ t: (o.textContent || "").trim(), v: o.value }));
      const alto = 22, n = ops.length;
      const top = Math.max(40, Math.min(r.bottom + 2, 580 - Math.min(n, 14) * alto));
      const w = document.createElement("div"); w.id = "hk-tut-lista";
      w.style.cssText = "position:fixed;z-index:2147483645;left:" + Math.min(r.left, innerWidth - 240) + "px;top:" + top + "px;width:" +
        Math.max(r.width, 230) + "px;overflow:hidden;background:#1b2230;" +
        "border:1px solid #3a4a66;border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,.6);" +
        "font:12px 'Segoe UI',system-ui,sans-serif;color:#dbe6f5";
      const i0 = Math.max(0, ops.findIndex((o) => o.v === v) - 10);
      ops.slice(i0, i0 + 14).forEach((o) => {
        const d = document.createElement("div");
        d.textContent = o.t; d.dataset.v = o.v;
        d.style.cssText = "height:" + alto + "px;line-height:" + alto + "px;padding:0 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
        w.appendChild(d);
      });
      document.body.appendChild(w);
      const el = [...w.children].find((d) => d.dataset.v === v);
      const q = el.getBoundingClientRect();
      return { x: q.left + Math.min(q.width - 20, 80), y: q.top + q.height / 2 };
    }, val);
    await foto(2);
    await raton(lista.x, lista.y, 10);
    await pag.evaluate((v) => {
      const el = [...document.querySelectorAll("#hk-tut-lista > div")].find((d) => d.dataset.v === v);
      if (el) { el.style.background = "#22d3ee"; el.style.color = "#06121a"; el.style.fontWeight = "700"; }
    }, val);
    await foto(2);
    await pag.evaluate(() => document.getElementById("hk-tut-lista")?.remove());
    await pag.select("#hk-tut-select", val);
    await espera(ms);
    const quedo = await pag.evaluate((e) => {
      const fila = [...document.querySelectorAll(".tp-lblv")]
        .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(e));
      const s = fila && fila.querySelector("select");
      return s ? (s.options[s.selectedIndex] || {}).textContent : null;
    }, etiqueta);
    const nn = (t) => (t || "").replace(/\s+/g, " ").trim();
    if (!quedo || nn(quedo) !== nn(textoOpcion) && !nn(quedo).includes(nn(textoOpcion)))
      console.log("  x el desplegable «" + etiqueta + "» quedo en «" + quedo + "», no en «" + textoOpcion + "»");
    await foto(4);
    return true;
  },
  /**
   * Cámara de FRENTE (alzado XZ), encuadrada al modelo. Un pórtico plano visto en
   * isométrica no se lee: la viga y las columnas se cruzan en diagonal.
   */
  alzado: async () => {
    await pag.evaluate(() => {
      const st = window.__hekatanStates || {};
      const N = st.nodes?.rawVal || [];
      if (!N.length) return;
      const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
      for (const n of N) for (let i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], n[i]); mx[i] = Math.max(mx[i], n[i]); }
      const c = mn.map((v, i) => (v + mx[i]) / 2);
      const ext = Math.max(mx[0] - mn[0], mx[2] - mn[2], 1);
      const v = document.querySelector("#viewer"), cam = v.__ctx.camera, ctl = v.__ctx.controls;
      cam.up.set(0, 0, 1);
      ctl.target.set(c[0], c[1], c[2]);
      cam.position.set(c[0], c[1] - ext * 2.1, c[2] + ext * 0.12);
      cam.lookAt(c[0], c[1], c[2]);
      ctl.update?.(); v.__ctx.render?.();
      // Que la app lo tome como una vista PUESTA A MANO: cada rebuild (cambiar un
      // parámetro, apagar la deformada) llama a autoFitCamera salvo que el usuario haya
      // movido la cámara, y eso se sabe por el evento «start» de los controles. Sin él
      // la vista volvía a la isométrica ~1 s después y el vídeo salía en diagonal.
      ctl.dispatchEvent?.({ type: "start" });
    });
    await espera(400);
  },
  /** El mayor |valor| del resultado de barras que está puesto (para decirlo en la voz). */
  maximo: async (clave = "bendingsZ") => pag.evaluate((k) => {
    const R = window.__hekatanStates?.analyzeOutputs?.rawVal?.[k];
    let m = 0;
    if (R) for (const v of (R instanceof Map ? R.values() : Object.values(R)))
      for (const x of v || []) m = Math.max(m, Math.abs(+x || 0));
    return +m.toFixed(2);
  }, clave),
  /** Ajusta un mando de «Settings» del visor (deformada, escalas…). */
  ajuste: async (clave, valor) => {
    await pag.evaluate((q) => {
      const s = window.__hekatanSettings?.();
      if (s && s[q.k]) s[q.k].val = q.v;
    }, { k: clave, v: valor });
    await espera(600);
  },
};

// El logo CUADRADO de Hekatan Struct (branding/products/struct), no el rótulo apaisado
// de la barra de herramientas: Jorge, 11-sep-2026 — «es cuadrado y lo mostraste rectangular».
const LOGO_CUADRADO = "data:image/png;base64," + readFileSync(join(__dirname, "..", "..",
  "branding", "products", "struct", "hekatan_struct_logo_300.png")).toString("base64");

const marcas = [];
console.log("== " + (cap.titulo || CAP) + " ==");
for (const paso of cap.pasos) {
  const desde = k;
  await paso.hacer(api);
  marcas.push({ rotulo: paso.rotulo, desde, hasta: k - 1, cuadros: k - desde });
  console.log("  " + String(desde).padStart(4) + "-" + String(k - 1).padStart(4) + "  " + paso.rotulo);
}
writeFileSync(join(OUT, "pasos.json"), JSON.stringify({ titulo: cap.titulo, pasos: marcas }, null, 1));
await nav.close(); srv.close();

// ── Todo a 1920×1080 ────────────────────────────────────────────────────────
// La vista general viene a 2560×1440 y se REDUCE (conserva el texto); el primer plano
// ya viene a 1920×1080 nativos y no se toca. Mezclar tamaños rompe el vídeo, así que
// se normalizan aquí y no en el guion.
const listado = readdirSync(OUT).filter((f) => /^f\d+\.png$/.test(f)).sort();
// UN solo ffmpeg para todos: lanzar uno por foto (300 veces) costaba ~5 min por
// capítulo solo en arrancar el programa. 1920×960 (la general se REDUCE 0.75 exacto;
// el primer plano ya viene así, 1:1) y debajo una franja negra de 120 px para el
// subtítulo.
const TMP = join(OUT, "_1080");
mkdirSync(TMP, { recursive: true });
execFileSync(FFMPEG, ["-y", "-v", "error", "-start_number", "0", "-i", join(OUT, "f%03d.png"),
  "-vf", "scale=1920:" + H_OUT + ":flags=lanczos,pad=1920:1080:0:0:black", "-start_number", "0",
  join(TMP, "f%03d.png")], { stdio: "pipe" });
let escalados = 0;
for (const f of listado) {
  const p = join(TMP, f);
  if (!existsSync(p)) continue;
  writeFileSync(join(OUT, f), readFileSync(p)); unlinkSync(p);
  escalados++;
}
console.log("\n" + escalados + " fotogramas a 1920x1080 en " + OUT);
if (avisos.length) console.log("avisos:", avisos.slice(0, 5));
