/**
 * La unidad ESCRITA en la etiqueta de un parámetro, pasada al sistema elegido en «Unidades» (2-oct-2026).
 *
 * Unos 1600 parámetros de 129 ejemplos llevan la unidad fija en la etiqueta —«E (kN/m²)», «Luz (m)»,
 * «ks (tonf/m³)», «f'c (kg/cm²)»— y no seguían el sistema: con «Kip, ft» seguían saliendo en kN y m (lo destapó
 * `cli/test_unidades_ui.mjs`). En vez de tocar ejemplo por ejemplo, el panel LEE esa unidad y enseña el número en
 * el sistema actual, como hace CSI con todo campo de entrada. El valor que recibe el ejemplo NO cambia: sigue en
 * la unidad de su etiqueta, así que ni `build()` ni `onParamChange()` se enteran.
 *
 * Qué unidad se enseña, por dimensión (fuerza F, longitud L):
 *   F → fuerza · F·L → momento · F/L → fuerza por longitud · F/L² → la unidad de TENSIÓN elegida ·
 *   F/L³ → la de módulo de balasto · L (m o ft) → longitud del modelo · L (mm, cm, in) y L², L³, L⁴ → la de SECCIÓN.
 * Lo que no se entienda («kN/nodo», «lb·s²/in», «×10⁻⁵ m⁴», «segmentos») se deja como está.
 */
const F: Record<string, number> = { kN: 1, N: 1e-3, MN: 1e3, tonf: 9.80665, kgf: 0.00980665, kg: 0.00980665, kip: 4.4482216, lb: 0.0044482216, lbf: 0.0044482216 };
const L: Record<string, number> = { m: 1, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048 };
const ALIAS: Record<string, [number, number, number]> = {   // [kN/m² por unidad, dimF, dimL]
  kPa: [1, 1, -2], MPa: [1000, 1, -2], GPa: [1e6, 1, -2], psi: [6.894757, 1, -2], ksi: [6894.757, 1, -2], pci: [271.4471, 1, -3],
};
/** kN/m² por unidad de tensión, kN/m³ por unidad de balasto (las de units.ts) */
const TENSION: Record<string, number> = { "kN/m²": 1, kPa: 1, MPa: 1000, GPa: 1e6, "kgf/cm²": 98.0665, "tonf/m²": 9.80665, psi: 6.894757, ksi: 6894.757, "kip/ft²": 47.88026 };
const BALASTO: Record<string, number> = { "kN/m³": 1, "tonf/m³": 9.80665, "kgf/cm³": 9806.65, "kip/ft³": 157.0875, pci: 271.4471 };

const EXP: Record<string, number> = { "²": 2, "³": 3, "⁴": 4 };

/** «kN/m²» → { si: kN·m factor, dF, dL, longitudGrande } o null si no es una unidad pura de F y L */
export function analizarUnidad(u: string): { si: number; dF: number; dL: number; grande: boolean } | null {
  u = u.trim().replace(/\s+/g, "").replace(/\^(\d)/g, (_, d) => ({ 2: "²", 3: "³", 4: "⁴" } as any)[d] ?? "").replace(/([a-z])([234])$/i, (_, a, d) => a + ({ 2: "²", 3: "³", 4: "⁴" } as any)[d]);
  if (!u) return null;
  if (ALIAS[u]) { const [f, dF, dL] = ALIAS[u]; return { si: f, dF, dL, grande: false }; }
  let si = 1, dF = 0, dL = 0, grande = false, ok = true;
  u.split("/").forEach((parte, k) => {
    const sg = k === 0 ? 1 : -1;
    for (let tok of parte.split(/[·*]/)) {
      let ex = 1; const ul = tok.slice(-1); if (EXP[ul]) { ex = EXP[ul]; tok = tok.slice(0, -1); }
      if (F[tok] !== undefined) { si *= F[tok] ** (sg * ex); dF += sg * ex; }
      else if (L[tok] !== undefined) { si *= L[tok] ** (sg * ex); dL += sg * ex; if (tok === "m" || tok === "ft") grande = true; }
      else ok = false;
    }
  });
  return ok && (dF !== 0 || dL !== 0) ? { si, dF, dL, grande } : null;
}

export interface Sistema { F: string; L: string; LS: string; S: string; SG: string }

/** La unidad que toca enseñar para esa dimensión y cuántas unidades SI vale una */
function unidadDelSistema(a: { dF: number; dL: number; grande: boolean }, s: Sistema): { u: string; si: number } | null {
  const f = F[s.F], l = L[s.L], ls = L[s.LS];
  const pot = (x: number) => (x === 1 ? "" : ({ 2: "²", 3: "³", 4: "⁴" } as any)[x] ?? `^${x}`);
  if (a.dF === 1 && a.dL === 0) return { u: s.F, si: f };
  if (a.dF === 1 && a.dL === 1) return { u: `${s.F}·${s.L}`, si: f * l };
  if (a.dF === 1 && a.dL === -1) return { u: `${s.F}/${s.L}`, si: f / l };
  if (a.dF === 1 && a.dL === -2 && TENSION[s.S]) return { u: s.S, si: TENSION[s.S] };
  if (a.dF === 1 && a.dL === -3 && BALASTO[s.SG]) return { u: s.SG, si: BALASTO[s.SG] };
  if (a.dF === 0 && a.dL === 1) return a.grande ? { u: s.L, si: l } : { u: s.LS, si: ls };
  if (a.dF === 0 && a.dL >= 2 && a.dL <= 4) return { u: s.LS + pot(a.dL), si: ls ** a.dL };
  return null;
}

/**
 * Para una etiqueta «Algo (kN/m²)»: la etiqueta nueva y el factor k (valor que se enseña = valor del ejemplo × k).
 * null si no lleva unidad entendible o si ya está en la del sistema.
 */
export function convertirEtiqueta(label: string, s: Sistema): { base: string; u: string; k: number } | null {
  const m = label.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  if (!m) return null;
  const a = analizarUnidad(m[2]);
  if (!a) return null;
  const d = unidadDelSistema(a, s);
  if (!d || d.u === m[2].trim()) return null;
  const k = a.si / d.si;
  if (!Number.isFinite(k) || k <= 0 || Math.abs(k - 1) < 1e-12) return null;
  return { base: m[1], u: d.u, k };
}

/** Un paso «redondo» (1, 2 o 5 × 10ⁿ) cercano al paso convertido, para que el deslizador no muestre 0.01020 */
export function pasoRedondo(x: number): number {
  if (!(x > 0)) return x;
  const e = Math.floor(Math.log10(x)), b = x / 10 ** e;
  return (b < 1.5 ? 1 : b < 3.5 ? 2 : b < 7.5 ? 5 : 10) * 10 ** e;
}
