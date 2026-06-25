/**
 * Combinaciones de carga NEC-SE-CG / ASCE 7 (las que ETABS auto-genera).
 * INCLUYE el sismo VERTICAL Ev = 0.2·SDS·D (igual que ETABS):
 *   sismo "hacia arriba":  (1.2 + 0.2·SDS)·D + ρ·QE + L
 *   sismo "hacia abajo":   (0.9 − 0.2·SDS)·D + ρ·QE
 * QE = ±Eh por dirección (EQX, EQY); ρ = factor de redundancia.
 */
export interface ComboFactor { pattern: string; sf: number; }
export interface LoadCombo { name: string; type: "Linear Add"; factors: ComboFactor[]; }

export interface NecComboOptions {
  dead: string;
  live?: string;
  roofLive?: string;
  snow?: string;
  wind?: string;          // patrón de viento (o EQ de viento por dirección si aplica)
  eqx?: string;           // sismo dirección X
  eqy?: string;           // sismo dirección Y
  /** Aceleración espectral de diseño en periodos cortos (para Ev = 0.2·SDS·D). */
  SDS?: number;
  /** Factor de redundancia ρ (NEC §; ASCE 12.3.4). */
  rho?: number;
}

export function generateNecSeCgCombos(o: NecComboOptions): LoadCombo[] {
  const D = o.dead, L = o.live, Lr = o.roofLive, S = o.snow, W = o.wind;
  const SDS = o.SDS ?? 0.5, rho = o.rho ?? 1.0;
  const cEvUp = +(1.2 + 0.2 * SDS).toFixed(4);   // factor de D con Ev hacia arriba
  const cEvDn = +(0.9 - 0.2 * SDS).toFixed(4);   // factor de D con Ev hacia abajo
  const C: LoadCombo[] = [];
  const add = (name: string, factors: ComboFactor[]) =>
    C.push({ name, type: "Linear Add", factors: factors.filter(f => f.pattern) });

  // --- Gravitatorias (ASCE 7-16 / NEC-SE-CG) ---
  add("1.4D", [{ pattern: D, sf: 1.4 }]);
  add("1.2D+1.6L+0.5Lr", [{ pattern: D, sf: 1.2 }, { pattern: L!, sf: 1.6 }, { pattern: (Lr || S)!, sf: 0.5 }]);
  add("1.2D+1.6Lr+L", [{ pattern: D, sf: 1.2 }, { pattern: (Lr || S)!, sf: 1.6 }, { pattern: L!, sf: 1.0 }]);
  if (W) {
    add("1.2D+1.0W+L+0.5Lr", [{ pattern: D, sf: 1.2 }, { pattern: W, sf: 1.0 }, { pattern: L!, sf: 1.0 }, { pattern: (Lr || S)!, sf: 0.5 }]);
    add("0.9D+1.0W", [{ pattern: D, sf: 0.9 }, { pattern: W, sf: 1.0 }]);
  }

  // --- Sísmicas con Ev = 0.2·SDS·D (X e Y, ±) ---
  const eqs: Array<[string | undefined, string]> = [[o.eqx, "X"], [o.eqy, "Y"]];
  for (const [eq, dir] of eqs) {
    if (!eq) continue;
    for (const s of [1, -1]) {
      const sign = s > 0 ? "+" : "−";
      add(`(${cEvUp})D ${sign}${rho}E${dir} +L`, [
        { pattern: D, sf: cEvUp }, { pattern: eq, sf: rho * s }, { pattern: L!, sf: 1.0 },
      ]);
      add(`(${cEvDn})D ${sign}${rho}E${dir}`, [
        { pattern: D, sf: cEvDn }, { pattern: eq, sf: rho * s },
      ]);
    }
  }
  return C;
}
