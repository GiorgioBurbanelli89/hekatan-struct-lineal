/**
 * =============================================================================
 *  Módulo 1 · Espectro de diseño NEC-SE-DS  (Peligro Sísmico)
 * =============================================================================
 *  Núcleo de cálculo PURO (sin UI). Implementa el espectro elástico de
 *  aceleraciones Sa(T) conforme a:
 *    - NEC-15 (NEC-SE-DS 2014)  ← norma legalmente vigente (default)
 *    - Borrador 2023            ← propuesta de actualización (selector)
 *
 *  Cada valor lleva su referencia de norma (sección + página PDF) para la
 *  transparencia del Módulo 11. Fuente de las referencias:
 *  ../../../COMPARATIVA_PELIGRO_SISMICO_NEC15_vs_BORRADOR2023.md
 * =============================================================================
 */

export type Norma = "NEC15" | "BORRADOR2023";
export type Suelo = "A" | "B" | "C" | "D" | "E";
export type Region = "Costa" | "Sierra" | "Oriente" | "Esmeraldas" | "Galapagos";

// ──────────────────────────────────────────────────────────────────────────
//  TABLAS NEC-15 (NEC-SE-DS 2014)
// ──────────────────────────────────────────────────────────────────────────
// Factor Z por zona sísmica I..VI — Tabla 1, §3.1.1 (PDF p.35)
export const Z_NEC15: Record<number, number> = { 1: 0.15, 2: 0.25, 3: 0.30, 4: 0.35, 5: 0.40, 6: 0.50 };
// Columnas de Z usadas para indexar Fa/Fd/Fs (interpolación lineal entre ellas)
const ZCOL_NEC15 = [0.15, 0.25, 0.30, 0.35, 0.40, 0.50];

// Tabla 3 — Fa (§3.2.2, PDF p.39)
const FA_NEC15: Record<Suelo, number[]> = {
  A: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
  B: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  C: [1.4, 1.3, 1.25, 1.23, 1.2, 1.18],
  D: [1.6, 1.4, 1.3, 1.25, 1.2, 1.12],
  E: [1.8, 1.4, 1.25, 1.1, 1.0, 0.85],
};
// Tabla 4 — Fd (§3.2.2, PDF p.39)
const FD_NEC15: Record<Suelo, number[]> = {
  A: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
  B: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  C: [1.36, 1.28, 1.19, 1.15, 1.11, 1.06],
  D: [1.62, 1.45, 1.36, 1.28, 1.19, 1.11],
  E: [2.1, 1.75, 1.7, 1.65, 1.6, 1.5],
};
// Tabla 5 — Fs (§3.2.2, PDF p.40)
const FS_NEC15: Record<Suelo, number[]> = {
  A: [0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
  B: [0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
  C: [0.85, 0.94, 1.02, 1.06, 1.11, 1.23],
  D: [1.02, 1.06, 1.11, 1.19, 1.28, 1.40],
  E: [1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
};

// ──────────────────────────────────────────────────────────────────────────
//  TABLAS BORRADOR 2023
// ──────────────────────────────────────────────────────────────────────────
// Zonas I..V como rangos continuos — Tabla 3.1 (PDF p.53). Para interpolar
// Fa/Fd/Fs usamos el centro de cada rango como nodo.
export const Z_BORR: Record<number, number> = { 1: 0.15, 2: 0.25, 3: 0.35, 4: 0.45, 5: 0.55 };
const ZCOL_BORR = [0.15, 0.25, 0.35, 0.45, 0.55];

// Tabla 3.3 — Fa (PDF p.56)
const FA_BORR: Record<Suelo, number[]> = {
  A: [0.9, 0.9, 0.9, 0.9, 0.9],
  B: [1.0, 1.0, 1.0, 1.0, 1.0],
  C: [1.4, 1.3, 1.23, 1.19, 1.13],
  D: [1.6, 1.4, 1.25, 1.14, 1.0],
  E: [1.8, 1.4, 1.1, 0.9, 0.62],
};
// Tabla 3.4 — Fd (PDF p.56)
const FD_BORR: Record<Suelo, number[]> = {
  A: [0.9, 0.9, 0.9, 0.9, 0.9],
  B: [1.0, 1.0, 1.0, 1.0, 1.0],
  C: [1.36, 1.28, 1.15, 1.08, 1.0],
  D: [1.62, 1.45, 1.28, 1.15, 1.0],
  E: [2.1, 1.75, 1.65, 1.52, 1.36],
};
// Tabla 3.5 — Fs (PDF p.56-57)
const FS_BORR: Record<Suelo, number[]> = {
  A: [0.75, 0.75, 0.75, 0.75, 0.75],
  B: [0.75, 0.75, 0.75, 0.75, 0.75],
  C: [0.85, 0.94, 1.06, 1.17, 1.28],
  D: [1.02, 1.06, 1.19, 1.32, 1.44],
  E: [1.5, 1.6, 1.8, 1.94, 2.09],
};

// Factor de importancia I — NEC-15 Tabla 6 (PDF p.47) / Borrador Tabla 4.1 (PDF p.61)
export const IMPORTANCIA: Record<string, number> = {
  "Otras (1.0)": 1.0,
  "Especial (1.3 / 1.25)": 1.3,
  "Esencial (1.5)": 1.5,
};

// Interpolación lineal de un vector de coeficientes según Z
function interp(Z: number, cols: number[], row: number[]): number {
  if (Z <= cols[0]) return row[0];
  if (Z >= cols[cols.length - 1]) return row[row.length - 1];
  for (let i = 0; i < cols.length - 1; i++) {
    if (Z >= cols[i] && Z <= cols[i + 1]) {
      const t = (Z - cols[i]) / (cols[i + 1] - cols[i]);
      return row[i] + t * (row[i + 1] - row[i]);
    }
  }
  return row[row.length - 1];
}

export interface EspectroParams {
  norma: Norma;
  Z: number;          // factor de zona (g)
  suelo: Suelo;
  region: Region;
  R: number;          // factor de reducción de respuesta
  I: number;          // factor de importancia
  phiP: number;       // coef. irregularidad en planta (NEC-15)
  phiE: number;       // coef. irregularidad en elevación (NEC-15)
  Tmax?: number;      // periodo máximo a graficar (s), default 4
  dT?: number;        // paso (s), default 0.02
}

export interface EspectroResult {
  norma: Norma;
  Fa: number; Fd: number; Fs: number;
  eta: number;        // η (NEC-15) ; en borrador la meseta usa 2.4 → eta=2.4
  r: number;
  T0: number; Tc: number; TL: number;
  SaPlateau: number;  // valor de la meseta (Sa máx)
  pga: number;        // Z (aceleración pico en roca)
  elastico: [number, number][];   // [T, Sa] elástico
  diseno: [number, number][];     // [T, Sa] reducido (inelástico) = Sa·I/(R·φP·φE)
  refs: Record<string, string>;   // referencias de norma por cantidad
}

// η por región (NEC-15) — §3.3.1 (PDF p.42)
function etaNEC15(region: Region): number {
  if (region === "Costa") return 1.8;          // Costa excepto Esmeraldas
  if (region === "Oriente") return 2.6;         // Oriente
  return 2.48;                                   // Sierra, Esmeraldas, Galápagos
}
// r por región (Borrador) — §3.4.1 / Fig C3.1 (PDF p.58)
function rBorrador(region: Region): number {
  return region === "Costa" ? 1.2 : 1.0;        // Costa(≠Esmeraldas)=1.2 ; resto=1.0
}

/** Calcula el espectro Sa(T) elástico y de diseño según la norma seleccionada. */
export function computeEspectro(p: EspectroParams): EspectroResult {
  const Tmax = p.Tmax ?? 4;
  const dT = p.dT ?? 0.02;
  const isNEC = p.norma === "NEC15";

  const cols = isNEC ? ZCOL_NEC15 : ZCOL_BORR;
  const FA = isNEC ? FA_NEC15 : FA_BORR;
  const FD = isNEC ? FD_NEC15 : FD_BORR;
  const FS = isNEC ? FS_NEC15 : FS_BORR;

  const Fa = interp(p.Z, cols, FA[p.suelo]);
  const Fd = interp(p.Z, cols, FD[p.suelo]);
  const Fs = interp(p.Z, cols, FS[p.suelo]);

  // Periodos límite
  const T0 = 0.10 * Fs * Fd / Fa;
  const Tc = (isNEC ? 0.55 : 0.40) * Fs * Fd / Fa;
  let TL = 2.4 * Fd;
  if (isNEC && (p.suelo === "D" || p.suelo === "E")) TL = Math.min(TL, 4.0); // tope NEC-15

  // Factores de forma
  const eta = isNEC ? etaNEC15(p.region) : 2.4;        // meseta = eta·Z·Fa (borrador eta=2.4)
  const r = isNEC ? (p.suelo === "E" ? 1.5 : 1.0) : rBorrador(p.region);
  const SaPlateau = eta * p.Z * Fa;

  const red = (p.R * p.phiP * p.phiE) / p.I;           // factor de reducción del espectro de diseño

  const sa = (T: number): number => {
    if (isNEC) {
      if (T <= T0) return p.Z * Fa * (1 + (eta - 1) * (T / T0));
      if (T <= Tc) return SaPlateau;
      return SaPlateau * Math.pow(Tc / T, r);
    } else {
      if (T < T0) return p.Z * Fa * (1 + 1.4 * (T / T0));
      if (T < Tc) return SaPlateau;
      if (T < TL) return SaPlateau * Math.pow(Tc / T, r);
      return SaPlateau * Math.pow(Tc / TL, r) * Math.pow(TL / T, 2); // 4ª rama
    }
  };

  const elastico: [number, number][] = [];
  const diseno: [number, number][] = [];
  for (let T = 0; T <= Tmax + 1e-9; T += dT) {
    const s = sa(T);
    elastico.push([+T.toFixed(4), +s.toFixed(5)]);
    diseno.push([+T.toFixed(4), +(s / red).toFixed(5)]);
  }

  const refs = isNEC
    ? {
        Z: "NEC-SE-DS §3.1.1, Tabla 1 (p.27)",
        suelo: "NEC-SE-DS §3.2.1, Tabla 2 (p.29)",
        FaFdFs: "NEC-SE-DS §3.2.2, Tablas 3-4-5 (p.31)",
        eta: "NEC-SE-DS §3.3.1 (p.34) — η Costa 1.80 / Sierra 2.48 / Oriente 2.60",
        espectro: "NEC-SE-DS §3.3.1, Fig.3 (p.34) — Sa=η·Z·Fa ; Sa=η·Z·Fa·(Tc/T)^r",
        periodos: "NEC-SE-DS §3.3.1 — T0=0.10·Fs·Fd/Fa ; Tc=0.55·Fs·Fd/Fa ; TL=2.4·Fd",
      }
    : {
        Z: "Borrador 2023 §3.1, Tabla 3.1 (p.53)",
        suelo: "Borrador 2023 §3.3.1, Tabla 3.2 (p.54)",
        FaFdFs: "Borrador 2023 §3.3.2, Tablas 3.3-3.4-3.5 (p.56)",
        eta: "Borrador 2023 §3.4.1 — meseta = 2.4·Z·Fa (sin η)",
        espectro: "Borrador 2023 §3.4.1, Fig.3.2 (p.57) — 4 ramas",
        periodos: "Borrador 2023 §3.4.1 — T0=0.10·Fs·Fd/Fa ; Tc=0.40·Fs·Fd/Fa ; TL=2.4·Fd",
      };

  return { norma: p.norma, Fa, Fd, Fs, eta, r, T0, Tc, TL, SaPlateau, pga: p.Z, elastico, diseno, refs };
}

// ──────────────────────────────────────────────────────────────────────────
//  Período fundamental aproximado Ta = Ct·hn^α
// ──────────────────────────────────────────────────────────────────────────
export const TIPOS_TA_NEC15: Record<string, { Ct: number; a: number }> = {
  "Acero sin arriostramientos": { Ct: 0.072, a: 0.8 },
  "Acero con arriostramientos": { Ct: 0.073, a: 0.75 },
  "Hormigón sin muros": { Ct: 0.055, a: 0.9 },
  "Hormigón con muros / mampostería": { Ct: 0.055, a: 0.75 },
};

export function periodoTa(hn: number, tipo: string): number {
  const t = TIPOS_TA_NEC15[tipo] ?? TIPOS_TA_NEC15["Hormigón sin muros"];
  return t.Ct * Math.pow(hn, t.a);
}

/** Sa elástico interpolado en un periodo T a partir de un EspectroResult. */
export function saAtPeriod(res: EspectroResult, T: number): number {
  const a = res.elastico;
  if (T <= a[0][0]) return a[0][1];
  if (T >= a[a.length - 1][0]) return a[a.length - 1][1];
  for (let i = 0; i < a.length - 1; i++) {
    if (T >= a[i][0] && T <= a[i + 1][0]) {
      const t = (T - a[i][0]) / (a[i + 1][0] - a[i][0]);
      return a[i][1] + t * (a[i + 1][1] - a[i][1]);
    }
  }
  return a[a.length - 1][1];
}

// ──────────────────────────────────────────────────────────────────────────
//  Módulo 3 · Cortante basal y distribución de fuerzas sísmicas
//  NEC-SE-DS §6.3.2 (V) y §6.3.5 (distribución Fx)
// ──────────────────────────────────────────────────────────────────────────
export interface CortanteParams extends EspectroParams {
  N: number;       // número de pisos
  he: number;      // altura de entrepiso (m)
  wPiso: number;   // peso sísmico reactivo por piso (W = D + 0.25L), kN
  tipoTa: string;  // tipo estructural para Ta
}
export interface PisoResult {
  piso: number; hi: number; wi: number; whk: number; Cvx: number; Fx: number; Vi: number;
}
export interface CortanteResult {
  Ta: number; SaTa: number; W: number; V: number; coefV: number; k: number;
  pisos: PisoResult[]; refs: Record<string, string>;
}

export function computeCortanteBasal(p: CortanteParams): CortanteResult {
  const esp = computeEspectro(p);
  const Ta = periodoTa(p.N * p.he, p.tipoTa);
  const SaTa = saAtPeriod(esp, Ta);
  const W = p.N * p.wPiso;

  // Cortante basal: V = (I·Sa(Ta)) / (R·ΦP·ΦE) · W   — NEC-SE-DS §6.3.2
  const coefV = (p.I * SaTa) / (p.R * p.phiP * p.phiE);
  const V = coefV * W;

  // Exponente k para distribución vertical — NEC-SE-DS §6.3.5
  let k: number;
  if (Ta <= 0.5) k = 1.0;
  else if (Ta >= 2.5) k = 2.0;
  else k = 0.75 + 0.5 * Ta;

  // w·h^k por piso
  const whk: number[] = [];
  let sum = 0;
  for (let i = 1; i <= p.N; i++) {
    const hi = i * p.he;
    const v = p.wPiso * Math.pow(hi, k);
    whk.push(v);
    sum += v;
  }

  const pisos: PisoResult[] = [];
  for (let i = 1; i <= p.N; i++) {
    const Cvx = whk[i - 1] / sum;            // Cvx = w·h^k / Σ(w·h^k)
    const Fx = Cvx * V;                       // Fx = Cvx · V
    pisos.push({ piso: i, hi: i * p.he, wi: p.wPiso, whk: whk[i - 1], Cvx, Fx, Vi: 0 });
  }
  // Cortante de piso Vi = Σ Fx desde ese piso hacia arriba (debe dar V en la base)
  for (let i = 0; i < pisos.length; i++) {
    let s = 0;
    for (let j = i; j < pisos.length; j++) s += pisos[j].Fx;
    pisos[i].Vi = s;
  }

  return {
    Ta, SaTa, W, V, coefV, k, pisos,
    refs: {
      V: "NEC-SE-DS §6.3.2 — V = (I·Sa(Ta))/(R·ΦP·ΦE)·W (p.61)",
      W: "NEC-SE-DS §6.1.7 — W = D + 0.25·L (peso sísmico reactivo)",
      dist: "NEC-SE-DS §6.3.5 — Fx=Cvx·V ; Cvx=w·h^k/Σ(w·h^k)",
      k: "NEC-SE-DS §6.3.5 — k=1 (Ta≤0.5) ; k=0.75+0.5·Ta (0.5<Ta<2.5) ; k=2 (Ta≥2.5)",
      ...esp.refs,
    },
  };
}
