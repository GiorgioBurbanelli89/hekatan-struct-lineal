/**
 * El botón de GRABAR: deja un vídeo de lo que se hace en Hekatan Struct.
 *
 * Jorge, 21-sep-2026: «el botón para grabar lo que hago en Hekatan Struct,
 * dentro no hay». Lo había fuera (Hekatan Recorder, de escritorio) y estaba el
 * 📋, que anota lo que pasa pero en TEXTO. Esto graba la imagen.
 *
 * Lo hace el propio navegador, con getDisplayMedia + MediaRecorder: al pulsar,
 * Chrome pregunta qué compartir (la pestaña, la ventana o la pantalla) y desde
 * ahí graba. **Nada sale del ordenador**: el vídeo se arma en memoria y se
 * descarga como un archivo, no se sube a ningún sitio.
 *
 * Formato: WebM (VP9 si el navegador lo trae, si no VP8). Es el que graba
 * Chrome sin recodificar; se abre en el propio navegador y lo tragan tanto
 * YouTube como ffmpeg.
 */

let grabadora: MediaRecorder | null = null;
let trozos: BlobPart[] = [];
let t0 = 0;
let reloj: number | undefined;

const dos = (n: number) => String(n).padStart(2, "0");

function nombreArchivo(): string {
  const d = new Date();
  return `hekatan_struct_${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}` +
         `_${dos(d.getHours())}-${dos(d.getMinutes())}-${dos(d.getSeconds())}.webm`;
}

/** El primer formato de la lista que el navegador sepa grabar. */
function formato(): string {
  const opciones = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const m of opciones) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
}

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
  t.textContent = texto;
  t.style.opacity = "1";
  setTimeout(() => { if (t) t.style.opacity = "0"; t!.style.transition = "opacity .6s"; }, error ? 7000 : 3500);
}

function pintarBoton(b: HTMLButtonElement) {
  if (grabadora) {
    const s = Math.round((Date.now() - t0) / 1000);
    b.textContent = `⏹ ${dos(Math.floor(s / 60))}:${dos(s % 60)}`;
    b.style.background = "#7f1d1d";
    b.style.borderColor = "#ef4444";
    b.style.width = "auto";
    b.style.padding = "0 8px";
    b.style.borderRadius = "17px";
    b.title = "Parar la grabación y descargar el vídeo";
  } else {
    b.textContent = "⏺";
    b.style.background = "#0b1220";
    b.style.borderColor = "#64748b";
    b.style.width = "34px";
    b.style.padding = "0";
    b.style.borderRadius = "50%";
    b.title = "Grabar en vídeo lo que haces (el navegador preguntará qué pantalla o pestaña compartir)";
  }
}

async function arrancar(b: HTMLButtonElement) {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    aviso("Este navegador no sabe grabar la pantalla. En Chrome o Edge sí funciona.", true);
    return;
  }
  let flujo: MediaStream;
  try {
    flujo = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },
      audio: false,                       // solo imagen: el micro se pide aparte y casi nunca hace falta
    });
  } catch (e: any) {
    // cancelar el diálogo NO es un error que haya que gritar
    if (e?.name === "NotAllowedError") aviso("Grabación cancelada.");
    else aviso("No se pudo empezar a grabar: " + (e?.message ?? e), true);
    return;
  }

  trozos = [];
  const mime = formato();
  grabadora = new MediaRecorder(flujo, mime ? { mimeType: mime, videoBitsPerSecond: 4_000_000 } : undefined);
  grabadora.ondataavailable = (ev) => { if (ev.data.size) trozos.push(ev.data); };
  grabadora.onstop = () => {
    for (const p of flujo.getTracks()) p.stop();
    const blob = new Blob(trozos, { type: mime || "video/webm" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nombreArchivo();
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
    const mb = (blob.size / 1048576).toFixed(1);
    const s = Math.round((Date.now() - t0) / 1000);
    aviso(`Vídeo guardado: ${s} s, ${mb} MB (${a.download}).`);
    grabadora = null;
    trozos = [];
    if (reloj) { clearInterval(reloj); reloj = undefined; }
    pintarBoton(b);
  };
  // si se para desde la barra del navegador («Dejar de compartir») hay que enterarse
  flujo.getVideoTracks()[0]?.addEventListener("ended", () => {
    if (grabadora && grabadora.state !== "inactive") grabadora.stop();
  });

  grabadora.start(1000);                  // un trozo por segundo: si algo peta, no se pierde todo
  t0 = Date.now();
  reloj = window.setInterval(() => pintarBoton(b), 1000);
  pintarBoton(b);
  aviso("Grabando. Pulsa otra vez el botón rojo para parar y guardar.");
}

export function pararGrabacion() {
  if (grabadora && grabadora.state !== "inactive") grabadora.stop();
}

/**
 * Coloca el botón en la fila del 🤖 y el 📋.
 *
 * A la DERECHA del 📋 solo si cabe: el 21-sep-2026 el 📋 ya estaba pegado al
 * borde y el ⏺ se salía de la pantalla (Jorge: «no hay grabar»). Si no cabe,
 * se va al otro extremo de la fila, a la izquierda del 🤖.
 */
function colocar(b: HTMLElement) {
  const recolocar = () => {
    const caja = document.getElementById("hk-caja-negra-btn")?.getBoundingClientRect();
    const ag = document.getElementById("hk-agente-lanzador")?.getBoundingClientRect();
    const ancho = b.offsetWidth || 34;
    const r = caja && caja.width > 0 ? caja : (ag && ag.width > 0 ? ag : null);
    if (!r) return;
    b.style.right = "auto";
    b.style.bottom = "auto";
    b.style.top = Math.round(r.top) + "px";
    const derecha = Math.round(r.right + 8);
    if (derecha + ancho <= window.innerWidth - 6) {
      b.style.left = derecha + "px";
      return;
    }
    // no cabe: al otro extremo, antes del primero de la fila
    const primero = ag && ag.width > 0 ? ag : r;
    b.style.left = Math.max(6, Math.round(primero.left - ancho - 8)) + "px";
  };
  recolocar();
  window.addEventListener("resize", recolocar);
  for (const ms of [700, 2000, 5000]) setTimeout(recolocar, ms);
  setInterval(recolocar, 4000);           // el 📋 se recoloca solo; hay que seguirlo
}

export function montarBotonGrabar() {
  if (document.getElementById("hk-grabar-btn")) return;
  const b = document.createElement("button");
  b.id = "hk-grabar-btn";
  b.style.cssText = [
    "position:fixed", "right:112px", "bottom:18px", "z-index:9600",
    "height:34px", "border:1px solid #64748b", "color:#f1f5f9",
    "font:13px system-ui,Segoe UI,sans-serif", "cursor:pointer", "opacity:.85",
    "box-shadow:0 3px 10px rgba(0,0,0,.35)",
  ].join(";");
  pintarBoton(b);
  b.onclick = () => { if (grabadora) pararGrabacion(); else arrancar(b); };
  const poner = () => { if (document.body) { document.body.appendChild(b); colocar(b); } };
  if (document.body) poner();
  else document.addEventListener("DOMContentLoaded", poner);
  (window as any).hkGrabar = () => b.click();
}
