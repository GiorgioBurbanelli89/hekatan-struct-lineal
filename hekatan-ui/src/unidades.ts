/**
 * Unidades de PANTALLA del visor (2-oct-2026, test minucioso de unidades).
 *
 * El motor trabaja siempre en SI estructural: kN, m, kN·m, kN/m². Lo que se ENSEÑA sale en el sistema elegido en
 * «Unidades» del workspace, que lo publica en `window.__hekatan*Unit` y en localStorage (`hk_*`). Este módulo es el
 * ÚNICO sitio del visor que convierte: antes cada pieza tenía su tabla (o ninguna) y las cargas, reacciones y
 * diagramas salían en kN y m aunque se eligiera kip-ft, sin unidad escrita.
 *
 * Regla de CSI (ETABS/SAP2000/SAFE): un sistema es «Fuerza, Longitud»; el MOMENTO es fuerza × longitud del
 * sistema, la fuerza de membrana F/L y el momento por ancho F·L/L. Las tensiones y presiones van en la unidad de
 * tensión elegida aparte (como el «Display Units» de SAFE). Las flechas en la unidad de desplazamiento.
 */
export type UnidadFuerza = "kN" | "tonf" | "kip";
export type UnidadLong = "mm" | "cm" | "m" | "in" | "ft";

export const KN_POR: Record<string, number> = { kN: 1, tonf: 9.80665, kip: 4.4482216 };
export const M_POR: Record<string, number> = { mm: 1e-3, cm: 1e-2, m: 1, in: 0.0254, ft: 0.3048 };
/** kN/m² que vale 1 unidad de tensión */
export const KPA_POR: Record<string, number> = {
  "kN/m²": 1, kPa: 1, MPa: 1000, GPa: 1e6, "kgf/cm²": 98.0665, "tonf/m²": 9.80665,
  psi: 6.894757, ksi: 6894.757, "kip/ft²": 47.88026,
};

function ls(k: string): string | null { try { return localStorage.getItem(k); } catch { return null; } }

/** El sistema de unidades que se ve AHORA */
export function unidades() {
  const w = window as any;
  const F = (w.__hekatanForceUnit ?? ls("hk_forceUnit") ?? "tonf") as UnidadFuerza;
  const D = (w.__hekatanDispUnit ?? ls("hk_dispUnit") ?? "mm") as UnidadLong;
  const L = (ls("hk_lengthStructureUnit") ?? "m") as UnidadLong;
  const S = (w.__hekatanStressUnit ?? ls("hk_stressUnit") ?? "tonf/m²") as string;
  return {
    F, D, L, S,
    fuerza: (kN: number) => kN / KN_POR[F],
    longitud: (m: number) => m / M_POR[L],
    desp: (m: number) => m / M_POR[D],
    momento: (kNm: number) => kNm / (KN_POR[F] * M_POR[L]),
    porLong: (kNpm: number) => (kNpm * M_POR[L]) / KN_POR[F],      // F/L (membrana, cortante de placa)
    momPorLong: (kN: number) => kN / KN_POR[F],                     // F·L/L (momento de placa por ancho)
    tension: (kPa: number) => kPa / (KPA_POR[S] ?? 1),
    uF: F, uL: L, uD: D, uM: `${F}·${L}`, uFL: `${F}/${L}`, uML: `${F}·${L}/${L}`, uS: S,
  };
}

/** Número corto para una etiqueta: 3–4 cifras útiles, sin notación científica salvo valores extremos */
export function num(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a === 0) return "0";
  if (a >= 1e5 || a < 1e-4) return v.toExponential(3);
  return a >= 100 ? v.toFixed(1) : a >= 10 ? v.toFixed(2) : a >= 1 ? v.toFixed(3) : v.toPrecision(4);
}
