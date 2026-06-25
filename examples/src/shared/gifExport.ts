/**
 * =============================================================================
 *  gifExport — Exporta la animación de un MODO de vibración como GIF animado
 * =============================================================================
 *
 *  Estilo "Abaqus / ETABS": el usuario corre el modal, elige un modo, y descarga
 *  un .gif con el modo oscilando (un ciclo completo, en loop infinito).
 *
 *  Funciona OFFLINE (renderiza frame por frame con awaits) → NO congela el
 *  navegador aunque el modelo tenga shells densos (a diferencia del tiempo-real).
 *
 *  Pipeline:
 *    1. Para N fases del ciclo: nodos = originales + modeShape·sin(fase)·escala.
 *       Se setea mesh.nodes.val, se espera el rebuild reactivo, se renderiza y se
 *       captura el canvas (preserveDrawingBuffer=true en getViewer).
 *    2. Paleta global de 256 colores por median-cut (los frames comparten colores).
 *    3. Cada frame se mapea a índices de paleta y se comprime con LZW (GIF89a).
 *    4. Se arma el GIF (loop NETSCAPE) y se descarga como Blob.
 * =============================================================================
 */
import type { State } from "vanjs-core";
import type { Node, ModalOutputs } from "hekatan-fem";

export interface GifExportOpts {
  mesh: { nodes: State<Node[]> };
  viewerElm: HTMLElement;
  results: ModalOutputs;
  mode: number;            // 0-indexed
  scalePercent?: number;   // amplitud como % del diagonal (default 6)
  frames?: number;         // frames por ciclo (default 24)
  delayMs?: number;        // delay entre frames (default 60)
  maxWidth?: number;       // ancho máx del GIF en px (default 560)
  filename?: string;
  onProgress?: (done: number, total: number) => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getCtx(viewerElm: HTMLElement): any {
  return (viewerElm as any).__ctx;
}

// NOTA: NO usamos requestAnimationFrame para esperar el rebuild — rAF se PAUSA
// en pestañas en segundo plano y colgaría el export. Usamos setTimeout (sleep),
// que corre siempre, y forzamos el render explícito antes de capturar.

// ── Captura el canvas WebGL a un ImageData (downscaled a maxWidth) ──────────
function captureFrame(canvas: HTMLCanvasElement, maxWidth: number): ImageData {
  const scale = Math.min(1, maxWidth / canvas.width);
  const w = Math.max(2, Math.round(canvas.width * scale));
  const h = Math.max(2, Math.round(canvas.height * scale));
  const off = document.createElement("canvas");
  off.width = w; off.height = h;
  const c2d = off.getContext("2d")!;
  c2d.drawImage(canvas, 0, 0, w, h);
  return c2d.getImageData(0, 0, w, h);
}

// ── Median-cut: paleta de hasta 256 colores a partir de píxeles muestreados ──
function medianCutPalette(samples: number[][], maxColors: number): number[][] {
  if (samples.length === 0) return [[0, 0, 0]];
  interface Box { px: number[][]; }
  let boxes: Box[] = [{ px: samples }];
  while (boxes.length < maxColors) {
    // elegir la caja con mayor rango de color
    let bi = -1, bestRange = -1;
    for (let i = 0; i < boxes.length; i++) {
      const px = boxes[i].px; if (px.length < 2) continue;
      let rmin = 255, rmax = 0, gmin = 255, gmax = 0, bmin = 255, bmax = 0;
      for (const p of px) {
        if (p[0] < rmin) rmin = p[0]; if (p[0] > rmax) rmax = p[0];
        if (p[1] < gmin) gmin = p[1]; if (p[1] > gmax) gmax = p[1];
        if (p[2] < bmin) bmin = p[2]; if (p[2] > bmax) bmax = p[2];
      }
      const range = Math.max(rmax - rmin, gmax - gmin, bmax - bmin);
      if (range > bestRange) { bestRange = range; bi = i; }
    }
    if (bi < 0 || bestRange <= 0) break;
    // partir esa caja por su eje más ancho, en la mediana
    const px = boxes[bi].px;
    let rmin = 255, rmax = 0, gmin = 255, gmax = 0, bmin = 255, bmax = 0;
    for (const p of px) {
      if (p[0] < rmin) rmin = p[0]; if (p[0] > rmax) rmax = p[0];
      if (p[1] < gmin) gmin = p[1]; if (p[1] > gmax) gmax = p[1];
      if (p[2] < bmin) bmin = p[2]; if (p[2] > bmax) bmax = p[2];
    }
    const ranges = [rmax - rmin, gmax - gmin, bmax - bmin];
    const axis = ranges[0] >= ranges[1] && ranges[0] >= ranges[2] ? 0 : ranges[1] >= ranges[2] ? 1 : 2;
    px.sort((a, b) => a[axis] - b[axis]);
    const mid = px.length >> 1;
    boxes.splice(bi, 1, { px: px.slice(0, mid) }, { px: px.slice(mid) });
  }
  // promedio de cada caja → color de paleta
  return boxes.map((bx) => {
    let r = 0, g = 0, b = 0; const n = bx.px.length || 1;
    for (const p of bx.px) { r += p[0]; g += p[1]; b += p[2]; }
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
  });
}

// ── Mapear color → índice de paleta más cercano (con cache) ─────────────────
function makeNearest(palette: number[][]) {
  const cache = new Map<number, number>();
  return (r: number, g: number, b: number): number => {
    const key = (r << 16) | (g << 8) | b;
    const hit = cache.get(key); if (hit !== undefined) return hit;
    let best = 0, bestD = Infinity;
    for (let i = 0; i < palette.length; i++) {
      const p = palette[i];
      const dr = r - p[0], dg = g - p[1], db = b - p[2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestD) { bestD = d; best = i; }
    }
    cache.set(key, best);
    return best;
  };
}

// ── Escritor de bytes con stream de bloques LZW ─────────────────────────────
class ByteBuf {
  bytes: number[] = [];
  byte(b: number) { this.bytes.push(b & 0xff); }
  word(w: number) { this.byte(w); this.byte(w >> 8); }
  str(s: string) { for (let i = 0; i < s.length; i++) this.byte(s.charCodeAt(i)); }
}

/** LZW GIF (diccionario por ENTEROS, rápido): comprime y escribe sub-bloques ≤255. */
function lzwEncode(out: ByteBuf, minCodeSize: number, indices: Uint8Array) {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;
  // clave = (prefixCode << 8) | byte  → mapa entero→entero (sin strings)
  let dict = new Map<number, number>();

  // bits → bytes → sub-bloques de ≤255
  const block: number[] = [];
  let bitBuf = 0, bitCnt = 0;
  const flushFull = () => {
    while (block.length >= 255) {
      out.byte(255);
      for (let i = 0; i < 255; i++) out.byte(block[i]);
      block.splice(0, 255);
    }
  };
  const emit = (code: number) => {
    bitBuf |= code << bitCnt;
    bitCnt += codeSize;
    while (bitCnt >= 8) { block.push(bitBuf & 0xff); bitBuf >>= 8; bitCnt -= 8; }
    flushFull();
  };

  emit(clearCode);
  let prefix = indices[0];
  for (let i = 1; i < indices.length; i++) {
    const k = indices[i];
    const key = (prefix << 8) | k;
    const found = dict.get(key);
    if (found !== undefined) {
      prefix = found;
    } else {
      emit(prefix);
      dict.set(key, nextCode++);
      if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
      if (nextCode >= 4096) { emit(clearCode); dict = new Map(); codeSize = minCodeSize + 1; nextCode = eoiCode + 1; }
      prefix = k;
    }
  }
  emit(prefix);
  emit(eoiCode);
  if (bitCnt > 0) { block.push(bitBuf & 0xff); }
  // flush final (bloques completos + resto)
  flushFull();
  if (block.length > 0) { out.byte(block.length); for (const b of block) out.byte(b); }
  out.byte(0); // block terminator
}

// ── Arma el GIF89a completo ─────────────────────────────────────────────────
function buildGif(
  frames: Uint8Array[], palette: number[][], w: number, h: number, delayCs: number
): Blob {
  const out = new ByteBuf();
  // Header
  out.str("GIF89a");
  // Logical Screen Descriptor
  out.word(w); out.word(h);
  // tamaño de paleta: potencia de 2 ≥ palette.length
  let bits = 1; while ((1 << bits) < palette.length) bits++;
  const gctSize = 1 << bits; // entradas de la tabla global
  out.byte(0x80 | ((bits - 1) & 0x07)); // GCT presente, color res, size
  out.byte(0); // background color index
  out.byte(0); // pixel aspect ratio
  // Global Color Table (padded a gctSize)
  for (let i = 0; i < gctSize; i++) {
    const p = palette[i] || [0, 0, 0];
    out.byte(p[0]); out.byte(p[1]); out.byte(p[2]);
  }
  // NETSCAPE2.0 loop forever
  out.byte(0x21); out.byte(0xff); out.byte(0x0b);
  out.str("NETSCAPE2.0");
  out.byte(0x03); out.byte(0x01); out.word(0x0000); out.byte(0x00);

  const minCodeSize = Math.max(2, bits);
  for (const idx of frames) {
    // Graphic Control Extension (delay)
    out.byte(0x21); out.byte(0xf9); out.byte(0x04);
    out.byte(0x00); // sin transparencia
    out.word(delayCs); // delay en centésimas de seg
    out.byte(0x00); out.byte(0x00);
    // Image Descriptor
    out.byte(0x2c);
    out.word(0); out.word(0); out.word(w); out.word(h);
    out.byte(0x00); // sin LCT, sin interlace
    // LZW data
    out.byte(minCodeSize);
    lzwEncode(out, minCodeSize, idx);
  }
  out.byte(0x3b); // trailer
  return new Blob([new Uint8Array(out.bytes)], { type: "image/gif" });
}

/**
 * Renderiza el modo `mode` en un ciclo completo y descarga un GIF animado.
 * Devuelve el Blob (por si el caller quiere subirlo/mostrarlo).
 */
export async function exportModeAnimationGif(opts: GifExportOpts): Promise<Blob | null> {
  const { mesh, viewerElm, results, mode } = opts;
  const scalePct = opts.scalePercent ?? 6;
  const nFrames = opts.frames ?? 24;
  const delayCs = Math.max(2, Math.round((opts.delayMs ?? 60) / 10));
  const maxWidth = opts.maxWidth ?? 560;

  const shape = results?.modeShapes?.[mode];
  if (!shape || !shape.length) { console.warn("[GIF] sin modeShape para modo", mode); return null; }
  const ctx = getCtx(viewerElm);
  const canvas: HTMLCanvasElement | undefined = ctx?.renderer?.domElement;
  if (!canvas || !ctx?.render) { console.warn("[GIF] sin canvas/render"); return null; }

  const original = mesh.nodes.rawVal.map((n) => [...n] as Node);
  const nNodes = original.length;

  // amplitud: scalePct% del diagonal / max desplazamiento del modo
  let xMin = Infinity, yMin = Infinity, zMin = Infinity, xMax = -Infinity, yMax = -Infinity, zMax = -Infinity;
  for (const n of original) {
    if (n[0] < xMin) xMin = n[0]; if (n[0] > xMax) xMax = n[0];
    if (n[1] < yMin) yMin = n[1]; if (n[1] > yMax) yMax = n[1];
    if (n[2] < zMin) zMin = n[2]; if (n[2] > zMax) zMax = n[2];
  }
  const extent = Math.sqrt((xMax - xMin) ** 2 + (yMax - yMin) ** 2 + (zMax - zMin) ** 2) || 1;
  let maxDisp = 0;
  for (let i = 0; i < nNodes; i++) {
    const dx = shape[i * 6] || 0, dy = shape[i * 6 + 1] || 0, dz = shape[i * 6 + 2] || 0;
    const m = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (m > maxDisp) maxDisp = m;
  }
  const mScale = maxDisp > 1e-12 ? (extent * scalePct / 100) / maxDisp : 1;

  // 1. Capturar frames. CRÍTICO: restaurar SIEMPRE los nodos originales en el
  // finally — si el export se interrumpe/throwea y deja el modelo DEFORMADO, el
  // siguiente modal corre sobre geometría degenerada → el WASM tira excepción y
  // ABORTA (mata el FEM de la sesión).
  const imgs: ImageData[] = [];
  try {
    for (let f = 0; f < nFrames; f++) {
      const amp = Math.sin((2 * Math.PI * f) / nFrames) * mScale;
      const nn: Node[] = new Array(nNodes);
      for (let i = 0; i < nNodes; i++) {
        const o = original[i];
        nn[i] = [o[0] + (shape[i * 6] || 0) * amp, o[1] + (shape[i * 6 + 1] || 0) * amp, o[2] + (shape[i * 6 + 2] || 0) * amp];
      }
      mesh.nodes.val = nn;
      await sleep(35);   // deja correr el van.derive (rebuild) + setTimeout(viewerRender)
      ctx.render();      // render explícito de la geometría ya reconstruida
      imgs.push(captureFrame(canvas, maxWidth));
      opts.onProgress?.(f + 1, nFrames);
    }
  } finally {
    // restaurar modelo a su geometría ORIGINAL (sí o sí)
    mesh.nodes.val = original.map((n) => [...n] as Node);
    await sleep(35);
    ctx.render();
  }

  // 2. Paleta global (muestreo de todos los frames)
  const w = imgs[0].width, h = imgs[0].height;
  const samples: number[][] = [];
  const step = Math.max(1, Math.floor((w * h * nFrames) / 12000)); // ~12k muestras
  let si = 0;
  for (const im of imgs) {
    const d = im.data;
    for (let p = 0; p < d.length; p += 4 * step) {
      samples.push([d[p], d[p + 1], d[p + 2]]); si++;
    }
  }
  const palette = medianCutPalette(samples, 256);
  const nearest = makeNearest(palette);

  // 3. Mapear cada frame a índices
  const frames: Uint8Array[] = imgs.map((im) => {
    const d = im.data; const idx = new Uint8Array(w * h);
    for (let p = 0, q = 0; p < d.length; p += 4, q++) idx[q] = nearest(d[p], d[p + 1], d[p + 2]);
    return idx;
  });

  // 4. Construir + descargar
  const blob = buildGif(frames, palette, w, h, delayCs);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = opts.filename ?? "modo_vibracion.gif";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return blob;
}
