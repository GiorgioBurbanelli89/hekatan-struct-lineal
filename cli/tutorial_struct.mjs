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
const ALTO_UTIL = 640;
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
await new Promise((r) => srv.listen(4780, r));

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
         "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: ANCHO, height: ALTO, deviceScaleFactor: 2 });
const avisos = [];
pag.on("pageerror", (e) => avisos.push("pageerror: " + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
// `cap.ruta` deja abrir cualquier página del deploy — la PORTADA, por ejemplo, que es
// donde se elige con qué trabajar y no tiene visor 3D que esperar.
const RUTA = cap.ruta || ("workspace/?t=" + (cap.ejemplo || "plantillas"));
await pag.goto("http://localhost:4780" + BASE + RUTA, { waitUntil: "networkidle2", timeout: 180000 });
if (!cap.ruta || /workspace/.test(cap.ruta))
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(cap.ruta && !/workspace/.test(cap.ruta) ? 2500 : 7000);

// ── Lo que en un tutorial ESTORBA ────────────────────────────────────────────
// La etiqueta «X=… Y=… Z=…» y la cruz roja siguen al ratón por el lienzo: dibujando
// sirven, pero en el vídeo el cursor pasa por encima de los botones del panel y la
// etiqueta los tapa («Pórtico 3D» salía debajo de «X=4.50 Y=39.50»). Se ocultan.
await pag.addStyleTag({ content:
  // (y la entrada dinámica #hk-dyn, «Designe objetos…», que también sigue al ratón)
  "#hk-coord-readout, #hk-coord-fixed, #hk-dyn { display:none !important }" });

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
  window.__tutCursor = (x, y) => { cur.style.left = x + "px"; cur.style.top = y + "px"; };
  window.__tutSinCaja = () => { caja.style.display = "none"; nota.style.display = "none"; };
  /** Cuadro sobre el rectángulo `r` y, si hay texto, una nota al lado que no lo tape. */
  window.__tutCaja = (r, txt, lim) => {
    caja.style.display = "block";
    caja.style.left = (r.x - 5) + "px"; caja.style.top = (r.y - 4) + "px";
    caja.style.width = (r.w + 10) + "px"; caja.style.height = (r.h + 8) + "px";
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
    e = [...document.querySelectorAll(".tp-lblv")]
      .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q.t));
  }
  if (!e) return null;
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
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}, { q: que, t: texto });

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
      const tits = [...document.querySelectorAll(".tp-fldv_t")];
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
      await pag.mouse.click(r.x + r.w / 2, r.y + r.h / 2);
      await espera(ms);
    }
    await pag.evaluate(() => {
      document.querySelectorAll("[data-tut-abrir]").forEach((x) => x.removeAttribute("data-tut-abrir"));
      window.__tutSinCaja();
    });
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
    await pag.mouse.click(r.x + r.w / 2, r.y + r.h / 2);
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
    await pag.mouse.click(r.x + r.w / 2, r.y + r.h / 2);
    await espera(250); await foto(3);
    await pag.evaluate(() => window.__tutSinCaja());
    await espera(ms);
    return true;
  },
  /** Cambia un parámetro; el cursor se para en su fila para que se vea cuál es. */
  param: async (etiqueta, clave, valor, ms = 3000) => {
    const r = await rect("fila", etiqueta);
    if (r) {
      await raton(r.x + r.w - 30, r.y + r.h / 2);
      await pag.evaluate((q) => window.__tutCaja(q.r, "", q.l), { r, l: limite() });
      await foto(2);
    }
    await pag.evaluate((q) => window.__hekatanSetParam(q.c, q.v), { c: clave, v: valor });
    await espera(ms);
    await foto(3);
    return !!r;
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
      const o = [...s.options].find((x) => (x.textContent || "").trim() === q.t) ||
                [...s.options].find((x) => (x.textContent || "").includes(q.t));
      return o ? o.value : null;
    }, { e: etiqueta, t: textoOpcion });
    if (val == null) { console.log("  x no se ve la opcion: " + textoOpcion); return false; }
    await pag.select("#hk-tut-select", val);
    await espera(ms);
    const quedo = await pag.evaluate((e) => {
      const fila = [...document.querySelectorAll(".tp-lblv")]
        .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(e));
      const s = fila && fila.querySelector("select");
      return s ? (s.options[s.selectedIndex] || {}).textContent : null;
    }, etiqueta);
    if (!quedo || quedo.trim() !== textoOpcion && !quedo.includes(textoOpcion))
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
let escalados = 0;
// El primer plano ya viene a 1920×1080 nativos; la vista general, a 2560×1440. Se
// normaliza uno a uno: mezclar tamaños en la misma carpeta rompe el vídeo.
for (const f of listado) {
  const p = join(OUT, f);
  const tmp = join(OUT, "_t.png");
  execFileSync(FFMPEG, ["-y", "-v", "error", "-i", p,
    // 1920×960 (la general se REDUCE 0.75 exacto; el primer plano ya viene así, 1:1)
    // y debajo una franja negra de 120 px para el subtítulo.
    "-vf", "scale=1920:960:flags=lanczos,pad=1920:1080:0:0:black", tmp], { stdio: "pipe" });
  execFileSync("cmd", ["/c", "move", "/y", tmp, p], { stdio: "pipe" });
  escalados++;
}
console.log("\n" + escalados + " fotogramas a 1920x1080 en " + OUT);
if (avisos.length) console.log("avisos:", avisos.slice(0, 5));
