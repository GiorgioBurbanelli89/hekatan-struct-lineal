/**
 * Codificador de GIF en segundo plano (30-sep-2026): el hilo de la página solo copia la pantalla; aquí se hace
 * lo caro (paleta, diferencia con el cuadro anterior, LZW) sin frenar la captura.
 *
 *   {tipo:"cuadro", rgba:ArrayBuffer, ancho, alto, delay}  → encola
 *   {tipo:"fin"}                                           → responde {tipo:"gif", bytes:ArrayBuffer}
 * Responde {tipo:"hecho"} tras cada cuadro (la página lo usa para no acumular cuadros si esto va lento).
 */
import * as gifenc from "gifenc";

const TRANSP = 255;
let gif: any = null;
let paleta: number[][] = [];
let previoRGBA: Uint32Array | null = null;
let previoIdx: Uint8Array | null = null;
let pendiente: { idx: Uint8Array; ancho: number; alto: number; delay: number; primero: boolean } | null = null;

function escribir(p: NonNullable<typeof pendiente>) {
  if (p.primero) gif.writeFrame(p.idx, p.ancho, p.alto, { palette: paleta, delay: p.delay, dispose: 1 });
  else gif.writeFrame(p.idx, p.ancho, p.alto, { delay: p.delay, transparent: true, transparentIndex: TRANSP, dispose: 1 });
}

self.onmessage = (ev: MessageEvent) => {
  const m = ev.data;
  if (m.tipo === "cuadro") {
    const rgba = new Uint8ClampedArray(m.rgba), px = new Uint32Array(m.rgba);
    if (!gif) {
      gif = gifenc.GIFEncoder();
      paleta = gifenc.quantize(rgba, 255);
      while (paleta.length < 255) paleta.push([0, 0, 0]);
      paleta.push([0, 0, 0]);                                   // 255 = transparente («igual que antes»)
      previoIdx = gifenc.applyPalette(rgba, paleta);
      previoRGBA = px.slice();
      pendiente = { idx: previoIdx.slice(), ancho: m.ancho, alto: m.alto, delay: m.delay, primero: true };
    } else {
      // el retraso del cuadro ANTERIOR es lo que duró en pantalla: se escribe al llegar el siguiente
      pendiente!.delay = m.delay;
      escribir(pendiente!);
      const out = new Uint8Array(px.length).fill(TRANSP);
      let cambiados = 0;
      const cache = new Map<number, number>();
      for (let k = 0; k < px.length; k++) {
        const v = px[k];
        if (v === previoRGBA![k]) continue;                     // sin cambio: transparente
        previoRGBA![k] = v;
        let i = cache.get(v);
        if (i === undefined) {
          const r = v & 255, g = (v >> 8) & 255, b = (v >> 16) & 255;
          i = gifenc.nearestColorIndex(paleta.slice(0, 255), [r, g, b]); cache.set(v, i);
        }
        if (i !== previoIdx![k]) { out[k] = i; previoIdx![k] = i; cambiados++; }
      }
      pendiente = { idx: out, ancho: m.ancho, alto: m.alto, delay: 100, primero: false };
      void cambiados;
    }
    (self as any).postMessage({ tipo: "hecho" });
  } else if (m.tipo === "fin") {
    if (pendiente) escribir(pendiente);
    if (!gif) { (self as any).postMessage({ tipo: "gif", bytes: new ArrayBuffer(0) }); return; }
    gif.finish();
    const b = gif.bytes();
    (self as any).postMessage({ tipo: "gif", bytes: b.buffer }, [b.buffer]);
    gif = null; paleta = []; previoRGBA = null; previoIdx = null; pendiente = null;
  }
};
