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

const GIFENC = "https://cdn.jsdelivr.net/npm/gifenc@1.0.3/dist/gifenc.esm.js";

const ANCHO = 640;          // el alto sale de la proporción de lo que se graba
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
    b.title = "Grabar un GIF (640 px, 10 cuadros/s). Para LinkedIn: máximo 5 MB y 400 cuadros.";
  }
}

async function grabar(b: HTMLButtonElement) {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    aviso("Este navegador no sabe grabar la pantalla. En Chrome o Edge sí.", true);
    return;
  }
  let lib: any;
  try {
    lib = await import(/* @vite-ignore */ GIFENC);
  } catch {
    aviso("No se pudo cargar el codificador de GIF (¿sin internet?). El MP4 sí funciona.", true);
    return;
  }

  let flujo: MediaStream;
  try {
    flujo = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: FPS }, audio: false });
  } catch (e: any) {
    if (e?.name === "NotAllowedError") aviso("Grabación cancelada.");
    else aviso("No se pudo empezar: " + (e?.message ?? e), true);
    return;
  }

  const vid = document.createElement("video");
  vid.srcObject = flujo;
  vid.muted = true;
  await vid.play().catch(() => {});
  await new Promise((r) => setTimeout(r, 250));      // que llegue el primer cuadro

  const alto = Math.max(2, Math.round(ANCHO * (vid.videoHeight || 9) / (vid.videoWidth || 16) / 2) * 2);
  const c = document.createElement("canvas");
  c.width = ANCHO; c.height = alto;
  const g = c.getContext("2d", { willReadFrequently: true })!;

  const gif = lib.GIFEncoder();
  let n = 0;
  grabando = true;
  pinta(b, 0);
  aviso(`Grabando GIF ${ANCHO}×${alto} a ${FPS} cuadros/s. Pulsa otra vez para guardar.`);

  const fin = () => new Promise<void>((listo) => {
    const reloj = setInterval(() => {
      if (!grabando || n >= MAX_CUADROS) { clearInterval(reloj); listo(); return; }
      g.drawImage(vid, 0, 0, ANCHO, alto);
      const d = g.getImageData(0, 0, ANCHO, alto).data;
      // 256 colores: es lo que admite el formato
      const paleta = lib.quantize(d, 256);
      gif.writeFrame(lib.applyPalette(d, paleta), ANCHO, alto,
                     { palette: paleta, delay: Math.round(1000 / FPS) });
      pinta(b, ++n);
    }, 1000 / FPS);
    parar = () => { grabando = false; };
  });

  await fin();
  for (const p of flujo.getTracks()) p.stop();
  gif.finish();

  const blob = new Blob([gif.bytes()], { type: "image/gif" });
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
  if (mb > MAX_MB)
    aviso(`GIF guardado: ${n} cuadros, ${mb.toFixed(1)} MB. OJO: LinkedIn admite 5 MB — ` +
          `por encima lo congela en el primer cuadro. Graba menos segundos.`, true);
  else if (n >= MAX_CUADROS)
    aviso(`GIF guardado: ${n} cuadros (el tope de LinkedIn), ${mb.toFixed(1)} MB.`);
  else
    aviso(`GIF guardado: ${n} cuadros, ${(n / FPS).toFixed(0)} s, ${mb.toFixed(1)} MB. Entra en LinkedIn.`);
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
  const poner = () => { if (document.body) { document.body.appendChild(b); colocar(b); } };
  if (document.body) poner();
  else document.addEventListener("DOMContentLoaded", poner);
}
