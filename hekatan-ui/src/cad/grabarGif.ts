/**
 * Grabar en GIF, al lado del MP4.
 *
 * Jorge, 21-sep-2026: «quiero que guarde gifs también».
 *
 * ## Por qué el GIF se hace aparte del MP4
 *
 * El MP4 lo graba el navegador solo (MediaRecorder). El GIF no: hay que sacar los
 * fotogramas uno a uno, reducir cada uno a 256 colores y armar el archivo. Por eso
 * este módulo captura a mano y codifica con `gifenc`.
 *
 * ## Los límites son de LinkedIn, no míos (consultados el 21-sep-2026)
 *
 *   · 5 MB de peso — es el que aprieta de verdad;
 *   · 400 fotogramas: pasado eso LinkedIn sube el GIF pero lo CONGELA en el primero;
 *   · proporción 1.91:1, 1:1 o 4:5.
 *
 * Con 10 fotogramas por segundo, 400 cuadros son 40 s; pero un visor 3D con mapa de
 * colores se come los 5 MB mucho antes. Por eso se graba a 640 px de ancho y 10 fps,
 * y se avisa al pasar de 5 MB en vez de dejar que LinkedIn lo congele sin decir nada.
 */

import * as gifenc from "gifenc";

/* 30-sep-2026 — Jorge: «deben tener la misma calidad tanto la grabación en GIF como en MP4». Antes: 640 px (la pantalla
 * de 2560 encogida al 25 %, texto ilegible) y una paleta NUEVA por cuadro (parpadeo). Ahora: el ancho del MP4 (hasta
 * 1920 px), escalado de alta calidad, UNA paleta para todo el GIF y cada cuadro guarda SOLO lo que cambió (el resto,
 * transparente sobre el anterior): en una interfaz casi todo está quieto y el archivo sigue siendo pequeño.
 * gifenc va dentro de la app (antes se bajaba de un CDN al grabar). */
const ANCHO_MAX = 1920;     // el alto sale de la proporción de lo que se graba
const FPS = 10;
const MAX_CUADROS = 400;    // el tope de LinkedIn
const MAX_MB = 5;           // idem

let grabando = false;
let parar: (() => void) | null = null;

const dos = (n: number) => String(n).padStart(2, "0");

function aviso(texto: string, error = false) {
  let t = document.getElementById("hk-grabar-aviso");
  if (!t) {
    t = document.createElement("div");
    t.id = "hk-grabar-aviso";
    t.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:110px;z-index:9700;" +
      "padding:7px 13px;border-radius:6px;font:12px system-ui,Segoe UI,sans-serif;" +
      "box-shadow:0 4px 14px rgba(0,0,0,.4);pointer-events:none;max-width:82vw;text-align:center;";
    document.body.appendChild(t);
  }
  t.style.background = error ? "#7f1d1d" : "#14532d";
  t.style.color = error ? "#fecaca" : "#d1fae5";
  t.style.opacity = "1";
  t.textContent = texto;
  setTimeout(() => { if (t) { t.style.transition = "opacity .6s"; t.style.opacity = "0"; } }, error ? 8000 : 4000);
}

function pinta(b: HTMLButtonElement, n: number) {
  if (grabando) {
    const s = Math.round(n / FPS);
    b.textContent = `⏹ GIF ${dos(Math.floor(s / 60))}:${dos(s % 60)}`;
    b.style.background = "#7c2d12";
    b.style.borderColor = "#f97316";
    b.style.width = "auto";
    b.style.padding = "0 8px";
    b.style.borderRadius = "17px";
    b.title = `Parar y guardar el GIF (${n} de ${MAX_CUADROS} cuadros)`;
  } else {
    b.textContent = "🎞";
    b.style.background = "#0b1220";
    b.style.borderColor = "#64748b";
    b.style.width = "34px";
    b.style.padding = "0";
    b.style.borderRadius = "50%";
    b.title = "Grabar un GIF (hasta 1920 px, 10 cuadros/s, como el MP4). Para LinkedIn: máximo 5 MB y 400 cuadros.";
  }
}

async function grabar(b: HTMLButtonElement) {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    aviso("Este navegador no sabe grabar la pantalla. En Chrome o Edge sí.", true);
    return;
  }
  const lib: any = gifenc;

  let flujo: MediaStream;
  try {
    flujo = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: FPS, width: { ideal: 2560 }, height: { ideal: 1600 } }, audio: false });
  } catch (e: any) {
    if (e?.name === "NotAllowedError") aviso("Grabación cancelada.");
    else aviso("No se pudo empezar: " + (e?.message ?? e), true);
    return;
  }

  await grabarFlujo(flujo, b);
}

/** Todo lo que va después de elegir pantalla (separado para ensayarlo con un MediaStream cualquiera). */
async function grabarFlujo(flujo: MediaStream, b: HTMLButtonElement) {
  const lib: any = gifenc;
  const vid = document.createElement("video");
  vid.srcObject = flujo;
  vid.muted = true;
  await vid.play().catch(() => {});
  await new Promise((r) => setTimeout(r, 250));      // que llegue el primer cuadro

  const vw = vid.videoWidth || 1920, vh = vid.videoHeight || 1080;
  const ANCHO = Math.min(ANCHO_MAX, vw - (vw % 2));
  const alto = Math.max(2, Math.round(ANCHO * vh / vw / 2) * 2);
  const c = document.createElement("canvas");
  c.width = ANCHO; c.height = alto;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";

  // la codificación va en un WORKER (gifWorker.ts): aquí solo se copia la pantalla y se anota el tiempo REAL
  const w = new Worker(new URL("./gifWorker.ts", import.meta.url), { type: "module" });
  let n = 0, enCola = 0, tPrev = 0;
  grabando = true;
  pinta(b, 0);
  aviso(`Grabando GIF ${ANCHO}×${alto} a ${FPS} cuadros/s. Pulsa otra vez para guardar.`);
  w.onmessage = (ev) => { if (ev.data.tipo === "hecho") enCola--; };

  const fin = () => new Promise<void>((listo) => {
    const reloj = setInterval(() => {
      if (!grabando || n >= MAX_CUADROS) { clearInterval(reloj); listo(); return; }
      if (enCola > 2) return;                          // el worker va atrás: se salta; el cuadro anterior dura más
      const ahora = performance.now();
      g.drawImage(vid, 0, 0, ANCHO, alto);
      const d = g.getImageData(0, 0, ANCHO, alto).data;
      const delay = n === 0 ? Math.round(1000 / FPS) : Math.round(ahora - tPrev);
      tPrev = ahora;
      enCola++;
      w.postMessage({ tipo: "cuadro", rgba: d.buffer, ancho: ANCHO, alto, delay }, [d.buffer]);
      pinta(b, ++n);
    }, 1000 / FPS);
    parar = () => { grabando = false; };
  });

  await fin();
  for (const p of flujo.getTracks()) p.stop();
  aviso("Terminando el GIF…");
  const bytes: ArrayBuffer = await new Promise((ok) => {
    w.onmessage = (ev) => { if (ev.data.tipo === "gif") ok(ev.data.bytes); };
    w.postMessage({ tipo: "fin" });
  });
  w.terminate();

  const blob = new Blob([bytes], { type: "image/gif" });
  const mb = blob.size / 1048576;
  const d = new Date();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `hekatan_struct_${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}` +
               `_${dos(d.getHours())}-${dos(d.getMinutes())}-${dos(d.getSeconds())}.gif`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000);

  grabando = false; parar = null;
  pinta(b, 0);
  // LinkedIn (ayuda oficial a564109, 30-sep-2026): «The limit for a GIF is 500 frames or 36,152,320 pixels» — píxeles de
  // TODOS los cuadros sumados. Si se pasa, LinkedIn lo reduce y se ve borroso: para LinkedIn conviene el MP4.
  const LI_PX = 36_152_320, px = ANCHO * alto * n;
  if (px > LI_PX || n > 500) {
    const s10 = Math.round(Math.sqrt(LI_PX / (10 * FPS) * (ANCHO / alto)));
    aviso(`GIF guardado: ${ANCHO}×${alto}, ${n} cuadros, ${mb.toFixed(1)} MB. OJO LinkedIn: admite ${(LI_PX / 1e6).toFixed(0)} millones de píxeles ` +
          `SUMANDO todos los cuadros; este tiene ${(px / 1e6).toFixed(0)}: lo reducirá y perderá nitidez. Sube el MP4, o un GIF de ` +
          `${Math.floor(LI_PX / (ANCHO * alto))} cuadros a este tamaño (10 s caben a ~${s10} px de ancho).`, true);
  } else
    aviso(`GIF guardado: ${ANCHO}×${alto}, ${n} cuadros, ${mb.toFixed(1)} MB. Cabe en LinkedIn sin reducirse.`);
}

/** Coloca el 🎞 a la izquierda del ⏺, siguiendo su rect real. */
function colocar(b: HTMLElement) {
  const recolocar = () => {
    const ref = document.getElementById("hk-grabar-btn")?.getBoundingClientRect();
    if (!ref || ref.width === 0) return;
    const w = b.offsetWidth || 34;
    b.style.right = "auto"; b.style.bottom = "auto";
    b.style.left = Math.max(6, Math.round(ref.left - w - 8)) + "px";
    b.style.top = Math.round(ref.top) + "px";
  };
  recolocar();
  window.addEventListener("resize", recolocar);
  setInterval(recolocar, 3000);
}

export function montarBotonGif() {
  if (document.getElementById("hk-gif-btn")) return;
  const b = document.createElement("button");
  b.id = "hk-gif-btn";
  b.style.cssText = [
    "position:fixed", "right:150px", "bottom:18px", "z-index:9600",
    "height:34px", "border:1px solid #64748b", "color:#f1f5f9",
    "font:13px system-ui,Segoe UI,sans-serif", "cursor:pointer", "opacity:.85",
    "box-shadow:0 3px 10px rgba(0,0,0,.35)",
  ].join(";");
  pinta(b, 0);
  b.onclick = () => { if (grabando) parar?.(); else grabar(b); };
  (window as any).hkGifDesde = (flujo: MediaStream) => grabarFlujo(flujo, b);   // ensayo sin diálogo de pantalla
  (window as any).hkGifParar = () => parar?.();
  const poner = () => { if (document.body) { document.body.appendChild(b); colocar(b); } };
  if (document.body) poner();
  else document.addEventListener("DOMContentLoaded", poner);
}
