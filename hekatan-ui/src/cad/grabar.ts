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
 * Formato (30-sep-2026): MP4 1920×1080, 30 fps fijos, H.264 + AAC, fast start
 * (WebCodecs + mp4-muxer). Sin WebCodecs: MediaRecorder (MP4 o WebM).
 */

import { Muxer, ArrayBufferTarget } from "mp4-muxer";

/*
 * 30-sep-2026 — Jorge: «traté de subirlo y no pude». El MP4 de MediaRecorder salía como lo grabó la pantalla:
 * 2560×1528, fotogramas a ritmo variable (21.6 de media), SIN pista de audio y fragmentado (moov vacío + moof).
 * Las redes (WhatsApp, TikTok, LinkedIn, Facebook) lo rechazan o lo suben roto. Ahora, si el navegador tiene
 * WebCodecs (Chrome, Edge), se codifica aparte: 1920×1080 con bandas negras, 30 fotogramas FIJOS, H.264 High,
 * audio AAC 48 kHz estéreo en silencio y el índice al principio (fast start). Sin WebCodecs, lo de antes.
 */
const FPS = 30, SR = 48000;
let cod: { parar: () => Promise<void> } | null = null;

async function arrancarWebCodecs(flujo: MediaStream, b: HTMLButtonElement): Promise<boolean> {
  const VE = (window as any).VideoEncoder, AE = (window as any).AudioEncoder, TP = (window as any).MediaStreamTrackProcessor;
  if (!VE || !AE || !TP) return false;
  // CALIDAD (Jorge, 30-sep: «se ve feo»): encoger una pantalla de 2560 px a 1920 emborrona el texto de los paneles.
  // Pantalla grande → 2560×1440 (sin encoger; H.264 nivel 5.0, 16 Mbps); si no, 1920×1080 a 10 Mbps.
  const ajustes = flujo.getVideoTracks()[0]?.getSettings?.() ?? {};
  const grande = (ajustes.width ?? 1920) > 1920 || (ajustes.height ?? 1080) > 1080;
  const W = grande ? 2560 : 1920, H = grande ? 1440 : 1080, BR = grande ? 16e6 : 10e6;
  const vcfg = grande ? ["avc1.640032", "avc1.4d0032"] : ["avc1.640028", "avc1.4d0028", "avc1.42E028"];
  let codec = "";
  for (const c of vcfg) {
    try { if ((await VE.isConfigSupported({ codec: c, width: W, height: H, bitrate: BR, framerate: FPS })).supported) { codec = c; break; } } catch { /* sigue */ }
  }
  let aac = false;
  try { aac = (await AE.isConfigSupported({ codec: "mp4a.40.2", sampleRate: SR, numberOfChannels: 2, bitrate: 128000 })).supported; } catch { /* sin audio */ }
  if (!codec) return false;

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { codec: "avc", width: W, height: H, frameRate: FPS },
    ...(aac ? { audio: { codec: "aac", numberOfChannels: 2, sampleRate: SR } } : {}),
    fastStart: "in-memory",
    firstTimestampBehavior: "offset",
  });
  const venc = new VE({ output: (ch: any, meta: any) => muxer.addVideoChunk(ch, meta), error: (e: any) => console.error("[grabar] vídeo", e) });
  venc.configure({ codec, width: W, height: H, bitrate: BR, framerate: FPS, latencyMode: "quality" });
  const aenc = aac ? new AE({ output: (ch: any, meta: any) => muxer.addAudioChunk(ch, meta), error: (e: any) => console.error("[grabar] audio", e) }) : null;
  aenc?.configure({ codec: "mp4a.40.2", sampleRate: SR, numberOfChannels: 2, bitrate: 128000 });

  // la pantalla llega a su ritmo; se toma el ÚLTIMO fotograma y se sella a 30 por segundo exactos
  const lienzo = new OffscreenCanvas(W, H), ctx = lienzo.getContext("2d")!;
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
  const lector = new TP({ track: flujo.getVideoTracks()[0] }).readable.getReader();
  let vivo = true;
  (async () => {
    while (vivo) {
      const r = await lector.read(); if (r.done) break;
      const f = r.value; const esc = Math.min(W / f.displayWidth, H / f.displayHeight);
      const w = f.displayWidth * esc, h = f.displayHeight * esc;
      ctx.fillRect(0, 0, W, H); ctx.drawImage(f, (W - w) / 2, (H - h) / 2, w, h); f.close();
    }
  })();
  let n = 0, na = 0;
  const silencio = new Float32Array(1024 * 2);
  const tic = window.setInterval(() => {
    const vf = new (window as any).VideoFrame(lienzo, { timestamp: Math.round(n * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
    venc.encode(vf, { keyFrame: n % (FPS * 2) === 0 }); vf.close(); n++;
    // audio en silencio al mismo reloj: 1024 muestras por trozo
    while (aenc && na * 1024 < n * SR / FPS) {
      const ad = new (window as any).AudioData({ format: "f32-planar", sampleRate: SR, numberOfFrames: 1024, numberOfChannels: 2,
        timestamp: Math.round(na * 1024 * 1e6 / SR), data: silencio });
      aenc.encode(ad); ad.close(); na++;
    }
  }, 1000 / FPS);

  cod = {
    parar: async () => {
      vivo = false; clearInterval(tic);
      try { lector.cancel(); } catch { /* ya cerrado */ }
      for (const p of flujo.getTracks()) p.stop();
      await venc.flush(); if (aenc) await aenc.flush();
      muxer.finalize();
      const blob = new Blob([(muxer.target as ArrayBufferTarget).buffer], { type: "video/mp4" });
      descargar(blob, "mp4", `${W}×${H}, 30 fps${aac ? ", audio 48 kHz" : ""}`);
      cod = null;
      if (reloj) { clearInterval(reloj); reloj = undefined; }
      pintarBoton(b);
    },
  };
  flujo.getVideoTracks()[0]?.addEventListener("ended", () => { cod?.parar(); });
  t0 = Date.now();
  reloj = window.setInterval(() => pintarBoton(b), 1000);
  pintarBoton(b);
  aviso(`Grabando en MP4 ${W}×${H} (listo para redes). Pulsa otra vez el botón rojo para parar y guardar.`);
  return true;
}

function descargar(blob: Blob, ext: string, detalle = "") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nombreArchivo(ext);
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
  const mb = (blob.size / 1048576).toFixed(1);
  const s = Math.round((Date.now() - t0) / 1000);
  aviso(`Vídeo guardado: ${s} s, ${mb} MB${detalle ? " · " + detalle : ""} (${a.download}).`);
}

let grabadora: MediaRecorder | null = null;
let trozos: BlobPart[] = [];
let t0 = 0;
let reloj: number | undefined;

const dos = (n: number) => String(n).padStart(2, "0");

function nombreArchivo(ext: string): string {
  const d = new Date();
  return `hekatan_struct_${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}` +
         `_${dos(d.getHours())}-${dos(d.getMinutes())}-${dos(d.getSeconds())}.${ext}`;
}

/**
 * El primer formato de la lista que el navegador sepa grabar.
 *
 * MP4 PRIMERO. Jorge, 21-sep-2026: «solo guarda mp4, Hekatan no guarda gifs».
 * Chrome sabe grabar MP4 (H.264) desde hace unas cuantas versiones, y es el
 * que se abre en cualquier sitio y el que aceptan WhatsApp, LinkedIn y YouTube
 * sin convertir. El WebM se queda solo de repuesto, por si el navegador no
 * trae el codificador de H.264.
 */
function formato(): string {
  const opciones = [
    "video/mp4;codecs=avc1.42E01E",     // H.264 base — el mas compatible
    "video/mp4;codecs=avc1",
    "video/mp4",
    "video/webm;codecs=vp9,opus",       // de repuesto
    "video/webm;codecs=vp9",
    "video/webm",
  ];
  for (const m of opciones) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
}

/** La extension que le toca al archivo, segun lo que se pudo grabar. */
function extension(mime: string): string {
  return /mp4/i.test(mime) ? "mp4" : "webm";
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
  if (grabadora || cod) {
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
      video: { frameRate: 30, width: { ideal: 2560 }, height: { ideal: 1600 } },
      audio: false,                       // solo imagen: el micro se pide aparte y casi nunca hace falta
    });
  } catch (e: any) {
    // cancelar el diálogo NO es un error que haya que gritar
    if (e?.name === "NotAllowedError") aviso("Grabación cancelada.");
    else aviso("No se pudo empezar a grabar: " + (e?.message ?? e), true);
    return;
  }

  // primero el MP4 listo para redes (WebCodecs); si el navegador no lo trae, el grabador de siempre
  try { if (await arrancarWebCodecs(flujo, b)) return; } catch (e) { console.warn("[grabar] WebCodecs no disponible:", e); }
  trozos = [];
  const mime = formato();
  grabadora = new MediaRecorder(flujo, mime ? { mimeType: mime, videoBitsPerSecond: 4_000_000 } : undefined);
  grabadora.ondataavailable = (ev) => { if (ev.data.size) trozos.push(ev.data); };
  grabadora.onstop = () => {
    for (const p of flujo.getTracks()) p.stop();
    const blob = new Blob(trozos, { type: mime || "video/mp4" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nombreArchivo(extension(mime || "video/mp4"));
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
  if (cod) { cod.parar(); return; }
  if (grabadora && grabadora.state !== "inactive") grabadora.stop();
}

/**
 * Busca un HUECO de verdad para el botón.
 *
 * Jorge, 21-sep-2026: «estás juntando los botones». La primera versión lo puso
 * a la derecha del 📋 y se salía de la pantalla; la segunda lo mandó a la
 * izquierda del 🤖 y cayó ENCIMA de «Explícame». El fallo de las dos fue el
 * mismo: mirar solo a dos vecinos en vez de a todos.
 *
 * Aquí se prueban varios sitios en orden y se acepta el primero que no pise a
 * NINGUNO de los flotantes ni se salga del borde.
 */
const VECINOS = ["hk-agente-explicar", "hk-agente-lanzador", "hk-caja-negra-btn"];

function rects(): DOMRect[] {
  return VECINOS.map((id) => document.getElementById(id))
    .filter((e): e is HTMLElement => !!e && e.style.display !== "none")
    .map((e) => e.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0);
}

const pisa = (a: DOMRect, b: { l: number; t: number; w: number; h: number }, m = 6) =>
  a.left < b.l + b.w + m && b.l < a.right + m && a.top < b.t + b.h + m && b.t < a.bottom + m;

function colocar(b: HTMLElement) {
  const recolocar = () => {
    const vs = rects();
    if (!vs.length) return;
    const w = b.offsetWidth || 34, h = b.offsetHeight || 34;
    const fila = Math.round(vs.reduce((s, r) => s + r.top + r.height / 2, 0) / vs.length - h / 2);
    const izq = Math.min(...vs.map((r) => r.left));
    const der = Math.max(...vs.map((r) => r.right));
    const arr = Math.min(...vs.map((r) => r.top));

    // La IZQUIERDA primero, y a proposito: a la derecha de la fila esta el panel
    // de propiedades, que aunque no sea un flotante tapa igual (21-sep-2026, se
    // vio en el deploy publico). A la izquierda esta el visor, que es campo libre.
    const sitios = [
      { l: Math.round(izq - w - 10), t: fila },
      { l: Math.round(der + 10), t: fila },
      { l: Math.round(izq - w - 10), t: Math.round(arr - h - 10) },
    ];
    for (const s of sitios) {
      const cabe = s.l >= 6 && s.l + w <= window.innerWidth - 6 &&
                   s.t >= 6 && s.t + h <= window.innerHeight - 6;
      if (!cabe) continue;
      if (vs.some((r) => pisa(r, { ...s, w, h }))) continue;
      b.style.right = "auto"; b.style.bottom = "auto";
      b.style.left = s.l + "px"; b.style.top = s.t + "px";
      // y que ademas SE VEA: no basta con no pisar a los otros flotantes, el
      // panel de la derecha tambien lo tapa (medido el 21-sep-2026). Se le
      // pregunta al navegador quien manda en ese punto.
      const cx = s.l + w / 2, cy = s.t + h / 2;
      const quien = document.elementFromPoint(cx, cy);
      if (quien === b || b.contains(quien)) return;
    }
    // ningún sitio limpio: arriba del todo, lejos de la fila
    b.style.right = "auto"; b.style.bottom = "auto";
    b.style.left = Math.max(6, Math.round(der - w)) + "px";
    b.style.top = Math.max(6, Math.round(arr - h - 10)) + "px";
  };
  recolocar();
  window.addEventListener("resize", recolocar);
  for (const ms of [700, 2000, 5000]) setTimeout(recolocar, ms);
  setInterval(recolocar, 3000);
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
  b.onclick = () => { if (grabadora || cod) pararGrabacion(); else arrancar(b); };
  const poner = () => { if (document.body) { document.body.appendChild(b); colocar(b); } };
  if (document.body) poner();
  else document.addEventListener("DOMContentLoaded", poner);
  (window as any).hkGrabar = () => b.click();
  // ensayo sin diálogo de pantalla: graba un MediaStream dado (p. ej. canvas.captureStream()) con el mismo camino
  (window as any).hkGrabarDesde = (flujo: MediaStream) => arrancarWebCodecs(flujo, b);
}
