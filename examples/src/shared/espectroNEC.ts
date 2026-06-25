/**
 * espectroNEC.ts — Espectro de diseño elástico NEC-SE-DS 2015 (Ecuador) + cortante basal.
 *
 * AUTOCONTENIDO: no necesita el modal ni el solver. Calcula Sa(T) a partir de Z (zona
 * sísmica), tipo de suelo (A–E), región (η) y devuelve el cortante basal estático
 * V = (I·Sa(Ta)) / (R·φP·φE) · W.   Sa en fracción de g.
 *
 * Referencia: NEC-SE-DS 2015, §3.3 (espectro) y §6.3 (cortante basal). Tablas 3,4,5
 * (Fa, Fd, Fs) interpoladas linealmente en Z.
 */

export type SoilType = "A" | "B" | "C" | "D" | "E";
export type Region = "Costa" | "Sierra" | "Oriente";

// η = razón de amplificación espectral Sa/Z (NEC-SE-DS §3.3.1)
const ETA: Record<Region, number> = { Costa: 1.80, Sierra: 2.48, Oriente: 2.60 };

// Z de muestreo de las tablas (NEC-SE-DS Tablas 3,4,5)
const Z_TBL = [0.15, 0.25, 0.30, 0.40, 0.50];

// Fa — coeficiente de amplificación de suelo en la zona de período corto (Tabla 3)
const FA: Record<SoilType, number[]> = {
  A: [0.9, 0.9, 0.9, 0.9, 0.9],
  B: [1.0, 1.0, 1.0, 1.0, 1.0],
  C: [1.4, 1.3, 1.25, 1.23, 1.2],
  D: [1.6, 1.4, 1.3, 1.22, 1.11],
  E: [1.8, 1.4, 1.25, 1.0, 0.85],
};
// Fd — amplificación de las ordenadas del espectro de desplazamientos (Tabla 4)
const FD: Record<SoilType, number[]> = {
  A: [0.9, 0.9, 0.9, 0.9, 0.9],
  B: [1.0, 1.0, 1.0, 1.0, 1.0],
  C: [1.36, 1.28, 1.19, 1.15, 1.11],
  D: [1.62, 1.45, 1.36, 1.28, 1.19],
  E: [2.1, 1.75, 1.7, 1.65, 1.6],
};
// Fs — comportamiento no lineal del suelo (Tabla 5)
const FS: Record<SoilType, number[]> = {
  A: [0.75, 0.75, 0.75, 0.75, 0.75],
  B: [0.75, 0.75, 0.75, 0.75, 0.75],
  C: [0.85, 0.94, 1.02, 1.06, 1.11],
  D: [1.02, 1.06, 1.11, 1.19, 1.28],
  E: [1.5, 1.6, 1.7, 1.8, 1.9],
};

function interpZ(tbl: number[], Z: number): number {
  if (Z <= Z_TBL[0]) return tbl[0];
  if (Z >= Z_TBL[Z_TBL.length - 1]) return tbl[tbl.length - 1];
  for (let i = 0; i < Z_TBL.length - 1; i++) {
    if (Z <= Z_TBL[i + 1]) {
      const f = (Z - Z_TBL[i]) / (Z_TBL[i + 1] - Z_TBL[i]);
      return tbl[i] + (tbl[i + 1] - tbl[i]) * f;
    }
  }
  return tbl[tbl.length - 1];
}

export interface NecSpectrumParams {
  Z: number;            // aceleración de la zona sísmica (g): 0.15..0.50
  soil: SoilType;       // tipo de suelo A–E
  region: Region;       // Costa/Sierra/Oriente (define η)
  I: number;            // factor de importancia (1.0, 1.3, 1.5)
  R: number;            // factor de reducción de respuesta
  phiP: number;         // irregularidad en planta φP (≤1)
  phiE: number;         // irregularidad en elevación φE (≤1)
  r?: number;           // exponente: 1 (suelos A–D) o 1.5 (suelo E)
}

export interface NecSpectrum {
  Fa: number; Fd: number; Fs: number; eta: number;
  T0: number; Tc: number;
  /** Sa elástico (g) en función del período T. */
  Sa: (T: number) => number;
  /** Sa de diseño (g) reducido por R·φP·φE. */
  Sad: (T: number) => number;
}

/** Construye el espectro elástico NEC-SE-DS 2015. */
export function necSpectrum(p: NecSpectrumParams): NecSpectrum {
  const Fa = interpZ(FA[p.soil], p.Z);
  const Fd = interpZ(FD[p.soil], p.Z);
  const Fs = interpZ(FS[p.soil], p.Z);
  const eta = ETA[p.region];
  const r = p.r ?? (p.soil === "E" ? 1.5 : 1.0);
  const T0 = 0.1 * Fs * Fd / Fa;     // NEC-SE-DS ec. 3
  const Tc = 0.55 * Fs * Fd / Fa;    // NEC-SE-DS ec. 4
  const Sa = (T: number): number => {
    if (T < 0) T = 0;
    if (T <= T0) return p.Z * Fa * (1 + (eta - 1) * (T / T0));   // rama ascendente
    if (T <= Tc) return eta * p.Z * Fa;                          // meseta
    return eta * p.Z * Fa * Math.pow(Tc / T, r);                 // rama descendente
  };
  const denom = Math.max(p.R * p.phiP * p.phiE, 1e-6);
  const Sad = (T: number): number => Sa(T) / denom;
  return { Fa, Fd, Fs, eta, T0, Tc, Sa, Sad };
}

/** Período aproximado NEC-SE-DS ec. 6.3.3 (método 1): Ta = Ct·hn^α. */
export function periodoAproximado(hn: number, Ct = 0.055, alpha = 0.9): number {
  return Ct * Math.pow(hn, alpha);  // pórtico de hormigón con muros → Ct=0.055, α=0.9
}

/** Cortante basal estático NEC-SE-DS §6.3.2:  V = (I·Sa(Ta))/(R·φP·φE) · W. */
export function cortanteBasal(
  sp: NecSpectrum, Ta: number, W: number, p: { I: number; R: number; phiP: number; phiE: number }
): { Cs: number; V: number; SaTa: number } {
  const SaTa = sp.Sa(Ta);
  const Cs = (p.I * SaTa) / Math.max(p.R * p.phiP * p.phiE, 1e-6);   // coeficiente sísmico
  return { Cs, V: Cs * W, SaTa };
}

/** Distribución del cortante en altura NEC-SE-DS ec. 6.3.6:  Fx = V·(wx·hx^k)/Σ(wi·hi^k). */
export function distribucionVertical(
  V: number, pesos: number[], alturas: number[], T: number
): number[] {
  const k = T <= 0.5 ? 1 : T >= 2.5 ? 2 : 0.75 * T + 0.75;   // NEC-SE-DS k(T)
  const denom = pesos.reduce((s, w, i) => s + w * Math.pow(alturas[i], k), 0) || 1;
  return pesos.map((w, i) => V * (w * Math.pow(alturas[i], k)) / denom);
}

/** Gráfica SVG del espectro elástico NEC-15 Sa(T) [g], con la meseta (T0–Tc) y el
 *  período fundamental T₁ del modal marcado (línea cian + punto sobre la curva). */
export function espectroSvg(sp: NecSpectrum, T1?: number): string {
  const W = 300, H = 172, mL = 42, mB = 26, mT = 16, mR = 8;
  const Tmax = 3.0, n = 120;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) { const T = (Tmax * i) / n; pts.push([T, sp.Sa(T)]); }
  const saMax = Math.max(...pts.map((p) => p[1])) * 1.15 || 1;
  const X = (T: number) => mL + (T / Tmax) * (W - mL - mR);
  const Y = (sa: number) => H - mB - (sa / saMax) * (H - mB - mT);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join("");
  let ticks = "";
  for (let k = 0; k <= 3; k++) ticks += `<text x="${X(k).toFixed(1)}" y="${H - mB + 13}" fill="#9ab" font-size="9" text-anchor="middle">${k}</text>`;
  for (let k = 0; k <= 4; k++) { const sa = (saMax * k) / 4; ticks += `<text x="${mL - 5}" y="${(Y(sa) + 3).toFixed(1)}" fill="#9ab" font-size="9" text-anchor="end">${sa.toFixed(2)}</text>`; }
  const t0x = X(sp.T0).toFixed(1), tcx = X(sp.Tc).toFixed(1);
  const dash = `<line x1="${t0x}" y1="${mT}" x2="${t0x}" y2="${H - mB}" stroke="#456" stroke-dasharray="3 3"/><line x1="${tcx}" y1="${mT}" x2="${tcx}" y2="${H - mB}" stroke="#456" stroke-dasharray="3 3"/>`;
  let t1 = "";
  if (T1 && T1 > 0 && T1 <= Tmax) {
    const x = X(T1).toFixed(1), y = Y(sp.Sa(T1)).toFixed(1);
    t1 = `<line x1="${x}" y1="${mT}" x2="${x}" y2="${H - mB}" stroke="#0ff" stroke-width="1.3"/><circle cx="${x}" cy="${y}" r="3.5" fill="#0ff"/><text x="${(+x + 5).toFixed(1)}" y="${(+y - 5).toFixed(1)}" fill="#0ff" font-size="9">T1=${T1.toFixed(2)}s</text>`;
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="background:#0a0e12;border:1px solid #234;border-radius:4px;margin:6px 0;max-width:100%">
<text x="${W / 2}" y="11" fill="#cde" font-size="10" text-anchor="middle">Espectro NEC-15 — Sa(T) [g]</text>
${dash}
<line x1="${mL}" y1="${H - mB}" x2="${W - mR}" y2="${H - mB}" stroke="#567"/><line x1="${mL}" y1="${mT}" x2="${mL}" y2="${H - mB}" stroke="#567"/>
${ticks}
<path d="${path}" fill="none" stroke="#ff7" stroke-width="2"/>
${t1}
<text x="${W - mR}" y="${H - 3}" fill="#9ab" font-size="9" text-anchor="end">T [s]</text>
</svg>`;
}
