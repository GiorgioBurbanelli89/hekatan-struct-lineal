/**
 * CAPA NEC — 4: análisis ESPECTRAL por piso (30-sep-2026), como el caso «Response Spectrum» de SAP2000/ETABS.
 *
 * Modo j, dirección del sismo d:
 *   A_j = I·Sa(T_j)·g / (R·φP·φE)                  aceleración de diseño (NEC-15 §3.3.2; borrador ec. 6.4 sin φ)
 *   f_nj = m_n · φ_nj · Γ_jd · A_j                  fuerza en el nudo n (en X y en Y: un modo acoplado empuja en las dos)
 *   u_nj = φ_nj · Γ_jd · A_j / ω_j²                 desplazamiento
 * con φ masa-normalizado (φᵀMφ = 1) y Γ_jd = φ_jᵀ·M·r_d (con signo: sin él los modos acoplados no combinan bien).
 * Cada respuesta (cortante de piso, deriva de cada eje de columna) se calcula MODO A MODO y se combina con CQC
 * (Der Kiureghian, ζ = 5 %). Nunca se combinan fuerzas y luego se suman: el CQC no es lineal.
 *
 * Control del cortante dinámico (por dirección):
 *   NEC-15 §6.2.2.b: V_din ≥ 80 % V_est (regular) / 85 % (irregular) → si no, se escala TODO por el factor.
 *   Borrador 2023: 100 % del estático.
 */
import type { Piso } from "./pisos";
import { rhoCQC } from "../responseSpectrum";

const G = 9.80665;

export function cqc(R: number[], T: number[], zeta = 0.05): number {
  let s = 0;
  for (let i = 0; i < R.length; i++) for (let j = 0; j < R.length; j++) s += rhoCQC(T[i], T[j], zeta) * R[i] * R[j];
  return Math.sqrt(Math.max(s, 0));
}

export type Espectral = {
  T: number[]; Vmodo: number[]; V: number;
  pisos: { k: number; V: number; deriva: number; derivaInel: number }[];
  u?: number[];   // desplazamiento CQC de cada nudo en la dirección del sismo (solo si se pide)
};

/**
 * @param out     salida de modalAnalysis (frequencies, modeShapes, modeScales, participationFactors)
 * @param masas   jointMass [n][6] (la MISMA fuente de masa del modal)
 * @param Sa      espectro elástico en g;  red = I/(R·φP·φE)
 */
export function espectralPorPiso(nodes: number[][], pisos: Piso[], out: any, masas: number[][], Sa: (T: number) => number,
  red: number, dir: 0 | 1, amp: number, esDia?: (n: number) => boolean, zeta = 0.05, conNudos = false): Espectral {
  const f: number[] = out.frequencies ?? [];
  const T = f.map((v) => (v > 0 ? 1 / v : 0));
  const zs = [0, ...pisos.map((p) => p.z)];
  // ejes de columna: nudo arriba / nudo abajo con la misma planta
  const clave = (p: number[]) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
  const nivel = zs.map((z) => { const m = new Map<string, number>(); nodes.forEach((p, n) => { if (Math.abs(p[2] - z) < 1e-3 && (!esDia || z < 1e-6 || esDia(n))) m.set(clave(p), n); }); return m; });
  const ejes = pisos.map((_, i) => { const pares: [number, number][] = []; nivel[i + 1].forEach((n, c) => { const b = nivel[i].get(c); if (b !== undefined) pares.push([n, b]); }); return pares; });
  const Vmodo: number[] = [], Vp: number[][] = pisos.map(() => []), Dp: number[][][] = ejes.map((e) => e.map(() => []));
  T.forEach((Tj, j) => {
    const phi: number[] = out.modeShapes[j], esc = out.modeScales?.[j] ?? 1, Gam = out.participationFactors?.[j]?.[dir] ?? 0;
    const A = red * Sa(Tj) * G, w2 = (2 * Math.PI * f[j]) ** 2;
    const fz = pisos.map(() => 0); let V = 0;
    nodes.forEach((p, n) => {
      const fn = masas[n][dir] * phi[6 * n + dir] * esc * Gam * A;
      V += fn;
      pisos.forEach((_, i) => { if (p[2] > zs[i] + 1e-3) fz[i] += fn; });   // cortante del piso i = fuerzas por encima de su base
    });
    Vmodo.push(V); fz.forEach((v, i) => Vp[i].push(v));
    ejes.forEach((pares, i) => pares.forEach(([a, b], q) => {
      const du = (phi[6 * a + dir] - phi[6 * b + dir]) * esc * Gam * A / w2;
      Dp[i][q].push(du / (zs[i + 1] - zs[i]));
    }));
  });
  const V = Math.abs(cqc(Vmodo, T, zeta));
  let u: number[] | undefined;
  if (conNudos) u = nodes.map((_, n) => cqc(T.map((_, j) => {
    const A = red * Sa(T[j]) * G, w2 = (2 * Math.PI * f[j]) ** 2;
    return out.modeShapes[j][6 * n + dir] * (out.modeScales?.[j] ?? 1) * (out.participationFactors?.[j]?.[dir] ?? 0) * A / w2;
  }), T, zeta));
  const pz = pisos.map((p, i) => {
    const deriva = Math.max(...Dp[i].map((r) => cqc(r, T, zeta)));
    return { k: p.k, V: cqc(Vp[i], T, zeta), deriva, derivaInel: amp * deriva };
  });
  return { T, Vmodo, V, pisos: pz, u };
}

/** Factor de escala del dinámico: NEC-15 80 % / 85 %, borrador 100 %. */
export function escalaDinamico(Vdin: number, Vest: number, minimo: number) {
  const r = Vdin / Vest;
  return { relacion: r, factor: r < minimo ? minimo / r : 1, cumple: r >= minimo };
}
