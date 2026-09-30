/**
 * CAPA NEC — 2: espectro de diseño y cortante basal ESTÁTICO, NEC-15 y borrador NEC-SE-DS 12-09-2023 (30-sep-2026).
 *
 * Fuentes (leídas en los PDF, no de memoria):
 *   NEC-15  §3.3.1 (Sa: η·Z·Fa hasta Tc; η·Z·Fa·(Tc/T)^r después; T0 = 0.10·Fs·Fd/Fa, Tc = 0.55·Fs·Fd/Fa),
 *           Tablas 3-5 (Fa Fd Fs), §6.3.2 (V = I·Sa(Ta)/(R·φP·φE)·W), §6.3.3 (Ta = Ct·hn^α; Ct 0.055, α 0.9 pórtico
 *           especial H.A. sin muros; 0.75 con muros; T del método 2 ≤ 1.3·Ta), §6.3.5 (k).
 *   Borrador §3.4.1 (Sa: 2.4·Z·Fa hasta Tc = 0.40·Fs·Fd/Fa; (Tc/T)^r hasta TL = 2.4·Fd; r por región: Costa 1.2),
 *           Tablas 3.3-3.5, §6.2.1 (Ta = Ct·hn^x, Tabla 6.2: 0.0466 / 0.90 pórtico H.A.; T ≤ Cu·Ta, Cu = 1.4,
 *           Tabla 6.3), §6.2.2 (V = Ie·Sa(T)·W/R, ec. 6.4; Vmin = 0.03·W, ec. 6.5), Tabla 6.4 (k), Tabla 4.4 (R).
 */
export type Norma = "NEC-15" | "borrador";

export type DatosSitio = {
  norma: Norma;
  Z: number; Fa: number; Fd: number; Fs: number;
  eta?: number;     // NEC-15: 1.80 Costa, 2.48 Sierra, 2.60 Oriente
  r: number;        // NEC-15: 1 (1.5 suelo E) · borrador: 1.2 Costa, 1.0 Sierra/Oriente
  I: number; R: number; phiP?: number; phiE?: number;
  Ct: number; alfa: number;
};

export function espectro(d: DatosSitio) {
  if (d.norma === "NEC-15") {
    const eta = d.eta ?? 1.8;
    const T0 = 0.10 * d.Fs * d.Fd / d.Fa, Tc = 0.55 * d.Fs * d.Fd / d.Fa;
    const Sa = (T: number) => (T <= Tc ? eta * d.Z * d.Fa : eta * d.Z * d.Fa * Math.pow(Tc / T, d.r));
    return { T0, Tc, TL: Infinity, Sa, meseta: eta * d.Z * d.Fa };
  }
  const T0 = 0.10 * d.Fs * d.Fd / d.Fa, Tc = 0.40 * d.Fs * d.Fd / d.Fa, TL = 2.4 * d.Fd, m = 2.4 * d.Z * d.Fa;
  const Sa = (T: number) => T < T0 ? d.Z * d.Fa * (1 + 1.4 * T / T0)
    : T < Tc ? m : T < TL ? m * Math.pow(Tc / T, d.r) : m * Math.pow(Tc / TL, d.r) * Math.pow(TL / T, 2);
  return { T0, Tc, TL, Sa, meseta: m };
}

export const kDe = (T: number) => (T <= 0.5 ? 1 : T >= 2.5 ? 2 : 0.75 + 0.5 * T);

/** Periodo para el CORTANTE: NEC-15 min(Tcomp, 1.3·Ta); borrador Tabla 6.3 (Ta si Tcomp ≤ Ta; Tcomp; tope Cu·Ta). */
export function periodoDeDiseno(d: DatosSitio, hn: number, Tcomp?: number) {
  const Ta = d.Ct * Math.pow(hn, d.alfa);
  if (!Tcomp) return { Ta, T: Ta, tope: d.norma === "NEC-15" ? 1.3 * Ta : 1.4 * Ta };
  if (d.norma === "NEC-15") return { Ta, T: Math.min(Tcomp, 1.3 * Ta), tope: 1.3 * Ta };
  const T = Tcomp <= Ta ? Ta : Math.min(Tcomp, 1.4 * Ta);
  return { Ta, T, tope: 1.4 * Ta };
}

export type Estatico = { Ta: number; T: number; Sa: number; k: number; W: number; V: number; Cs: number; Vmin?: number;
  pisos: { k: number; z: number; w: number; F: number; Vpiso: number }[] };

export function cortanteEstatico(d: DatosSitio, pisos: { k: number; z: number; peso: number }[], Tcomp?: number): Estatico {
  const hn = Math.max(...pisos.map((p) => p.z));
  const { Ta, T } = periodoDeDiseno(d, hn, Tcomp);
  const Sa = espectro(d).Sa(T);
  const W = pisos.reduce((s, p) => s + p.peso, 0);
  let Cs = d.norma === "NEC-15" ? d.I * Sa / (d.R * (d.phiP ?? 1) * (d.phiE ?? 1)) : d.I * Sa / d.R;
  const Vmin = d.norma === "borrador" ? 0.03 * W : undefined;
  let V = Cs * W; if (Vmin !== undefined && V < Vmin) { V = Vmin; Cs = Vmin / W; }
  const k = kDe(T);
  const suma = pisos.reduce((s, p) => s + p.peso * Math.pow(p.z, k), 0);
  const F = pisos.map((p) => V * p.peso * Math.pow(p.z, k) / suma);
  const out = pisos.map((p, i) => ({ k: p.k, z: p.z, w: p.peso, F: F[i], Vpiso: F.slice(i).reduce((a, b) => a + b, 0) }));
  return { Ta, T, Sa, k, W, V, Cs, Vmin, pisos: out };
}

/** Portoviejo, suelo D, pórtico especial de H.A. sin muros (el edificio del curso). */
export const PORTOVIEJO_D: Record<Norma, DatosSitio> = {
  "NEC-15": { norma: "NEC-15", Z: 0.5, Fa: 1.12, Fd: 1.11, Fs: 1.40, eta: 1.80, r: 1, I: 1, R: 8, phiP: 1, phiE: 1, Ct: 0.055, alfa: 0.9 },
  borrador: { norma: "borrador", Z: 0.5, Fa: 1.0, Fd: 1.0, Fs: 1.44, r: 1.2, I: 1, R: 8, Ct: 0.0466, alfa: 0.90 },
};
