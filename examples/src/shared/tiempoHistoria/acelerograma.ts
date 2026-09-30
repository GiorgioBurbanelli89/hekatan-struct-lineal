// Copiado de hekatan-geotechnic/src/dyn/acelerograma.ts (30-sep-2026), el mismo lector en los dos programas.
// Acelerogramas para el dinámico: lectura de archivos del usuario (RENAC y dos columnas t, a) y un pulso de ejemplo.
// Todo sale en pares [t0, a0, t1, a1, …] con a en m/s² (el `history` de GEO5 y de GeoFem.dynamic).
// NO se incorpora ningún registro real al sitio (los de RENAC tienen política de uso): solo se leen si el usuario los carga.
export const G = 9.80665;
export type Unidad = "g" | "m/s2" | "cm/s2";
export type Acel = { pares: number[]; dt: number; fuente: string; aviso?: string };
const aMs2 = (u: Unidad) => (u === "g" ? G : u === "cm/s2" ? 0.01 : 1);

/** Lee un archivo de texto. RENAC: cabecera de texto con «Frecuencia de muestreo (Hz)» y «Unidades», luego valores
 *  (varios por línea) a paso constante. Dos columnas: t, a por línea (la unidad de `a` la elige el usuario). */
export function leerAcelerograma(texto: string, unidad2col: Unidad = "m/s2", nombre = "archivo"): Acel {
  const lineas = texto.split(/\r?\n/);
  const num = (s: string) => Number(s.replace(",", "."));
  const filas: number[][] = [];
  let fs = NaN, unidadCab: Unidad | null = null;
  for (const l of lineas) {
    const t = l.trim(); if (!t) continue;
    const toks = t.split(/[\s;\t]+/).filter(Boolean);
    const vals = toks.map(num);
    if (vals.length && vals.every(Number.isFinite)) { filas.push(vals); continue; }
    // cabecera (o texto): frecuencia y unidades si las dice
    const mf = t.match(/frecuencia[^:]*:\s*([-+\d.eE]+)/i) ?? t.match(/sampl[^:]*:\s*([-+\d.eE]+)/i); if (mf) fs = num(mf[1]);
    const mdt = t.match(/\b(?:dt|delta\s*t|intervalo)[^:=]*[:=]\s*([-+\d.eE]+)/i); if (mdt && !Number.isFinite(fs)) fs = 1 / num(mdt[1]);
    const mu = t.match(/unidad[^:]*:\s*(\S+)/i) ?? t.match(/units?[^:]*:\s*(\S+)/i);
    if (mu) { const u = mu[1].toLowerCase(); unidadCab = /cm|gal/.test(u) ? "cm/s2" : /^g\b|^g$/.test(u) ? "g" : /m\/s/.test(u) ? "m/s2" : unidadCab; }
    if (filas.length) filas.length = 0;   // texto después de números: lo de antes era otra cosa; se empieza de nuevo
  }
  if (!filas.length) throw new Error("no hay números en el archivo");
  const dosCol = filas.every((f) => f.length === 2) && !Number.isFinite(fs) && filas.length > 2 && filas[1][0] > filas[0][0] && filas[2][0] > filas[1][0];
  const pares: number[] = [];
  if (dosCol) {
    const k = aMs2(unidad2col);
    for (const f of filas) pares.push(f[0] - filas[0][0], f[1] * k);
    const dt = (filas[filas.length - 1][0] - filas[0][0]) / (filas.length - 1);
    return { pares, dt, fuente: `${nombre} · dos columnas t, a (${unidad2col}) · ${filas.length} puntos` };
  }
  if (!Number.isFinite(fs) || fs <= 0) throw new Error("formato de valores seguidos sin «Frecuencia de muestreo (Hz)» en la cabecera; si es de dos columnas, que cada línea sea «t a»");
  const u = unidadCab ?? "cm/s2", k = aMs2(u), dt = 1 / fs;
  const v = filas.flat();
  v.forEach((a, i) => pares.push(+(i * dt).toFixed(6), a * k));
  return { pares, dt, fuente: `${nombre} · ${v.length} valores a ${fs} Hz (${u})`, aviso: unidadCab ? undefined : "la cabecera no dice las unidades: se toman cm/s²" };
}

/** Pulso de medio seno: amplitud [g], duración [s], total [s], a paso dt. */
export function pulso(ampG: number, dur: number, total: number, dt: number): Acel {
  const pares: number[] = [];
  const n = Math.round(total / dt);
  for (let i = 0; i <= n; i++) { const t = i * dt; pares.push(+t.toFixed(6), t <= dur + 1e-12 ? ampG * G * Math.sin(Math.PI * t / dur) : 0); }
  return { pares, dt, fuente: `pulso de medio seno ${ampG} g, ${dur} s (total ${total} s)` };
}

/** Recorta [desde, hasta] y pone t = 0 en `desde` (interpola en los extremos). */
export function ventana(a: Acel, desde: number, hasta: number): Acel {
  const p = a.pares, out: number[] = [];
  const at = (t: number) => { for (let i = 2; i < p.length; i += 2) if (t <= p[i]) { const t0 = p[i - 2], t1 = p[i]; return t1 > t0 ? p[i - 1] + (p[i + 1] - p[i - 1]) * (t - t0) / (t1 - t0) : p[i + 1]; } return p[p.length - 1]; };
  const tfin = Math.min(hasta, p[p.length - 2]);
  if (!(tfin > desde)) throw new Error("la ventana de tiempo está fuera del registro");
  out.push(0, at(desde));
  for (let i = 0; i < p.length; i += 2) if (p[i] > desde + 1e-9 && p[i] < tfin - 1e-9) out.push(+(p[i] - desde).toFixed(6), p[i + 1]);
  out.push(+(tfin - desde).toFixed(6), at(tfin));
  return { ...a, pares: out, fuente: `${a.fuente} · ventana ${desde}–${tfin} s` };
}

export const pico = (a: Acel) => { let m = 0, t = 0; for (let i = 0; i < a.pares.length; i += 2) if (Math.abs(a.pares[i + 1]) > Math.abs(m)) { m = a.pares[i + 1]; t = a.pares[i]; } return { a: m, t }; };
