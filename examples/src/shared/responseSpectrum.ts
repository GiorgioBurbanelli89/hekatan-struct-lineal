/**
 * Análisis espectral dinámico lineal (response spectrum) — motor.
 * Replica las combinaciones de ETABS:
 *   - MODAL (combina modos en una dirección): SRSS, CQC, ABS
 *   - DIRECCIONAL (combina X, Y, Z): SRSS, Absolute, CQC3
 *
 * Flujo:  espectro Sa(T) [espectroNec.ts] + modal {T, φ, Γ por modo} [modal.cpp]
 *   → respuesta modal Rᵢ = Γᵢ · Sa(Tᵢ)/ωᵢ² · φᵢ (desplazamiento) o fuerza modal
 *   → combinación MODAL → respuesta por dirección Rx, Ry, Rz
 *   → combinación DIRECCIONAL → respuesta de diseño
 */

export type ModalCombo = "SRSS" | "CQC" | "ABS";
export type DirectionalCombo = "SRSS" | "Absolute" | "CQC3";

/** Coeficiente de correlación de Der Kiureghian (CQC), amortiguamientos iguales ζ. */
export function rhoCQC(Ti: number, Tj: number, zeta: number): number {
  const r = Tj / Ti;                       // = ωi/ωj
  const num = 8 * zeta * zeta * (1 + r) * Math.pow(r, 1.5);
  const den = (1 - r * r) ** 2 + 4 * zeta * zeta * r * (1 + r) ** 2;
  return num / den;
}

/** Combinación MODAL: combina las respuestas modales Rᵢ (de una dirección). */
export function combineModal(R: number[], T: number[], method: ModalCombo, zeta = 0.05): number {
  if (method === "ABS") return R.reduce((s, r) => s + Math.abs(r), 0);
  if (method === "SRSS") return Math.sqrt(R.reduce((s, r) => s + r * r, 0));
  // CQC
  let sum = 0;
  for (let i = 0; i < R.length; i++)
    for (let j = 0; j < R.length; j++) {
      const rho = i === j ? 1 : rhoCQC(T[i], T[j], zeta);
      sum += rho * R[i] * R[j];
    }
  return Math.sqrt(Math.max(sum, 0));
}

/**
 * Combinación DIRECCIONAL: combina las respuestas de las direcciones ortogonales.
 *  - SRSS:     √(Rx² + Ry² + Rz²)
 *  - Absolute: |Rx| + |Ry| + |Rz|
 *  - CQC3:     respuesta CRÍTICA sobre todos los ángulos de incidencia (Menun &
 *              Der Kiureghian). Para 2 direcciones horizontales con factor de
 *              correlación direccional ρ_d, el pico crítico es:
 *                R_crit = √( ½(Rx²+Ry²) + √( ¼(Rx²−Ry²)² + ρ_d²·Rx²·Ry² ) )
 *              (con ρ_d=0 → SRSS de Rx,Ry). Rz se combina por SRSS encima.
 */
export function combineDirectional(
  Rx: number, Ry: number, Rz = 0, method: DirectionalCombo = "SRSS", rhoD = 0
): number {
  const ax = Math.abs(Rx), ay = Math.abs(Ry), az = Math.abs(Rz);
  if (method === "Absolute") return ax + ay + az;
  if (method === "SRSS") return Math.hypot(ax, ay, az);
  // CQC3 — peak crítico horizontal + Rz por SRSS
  const a = 0.5 * (Rx * Rx + Ry * Ry);
  const b = Math.sqrt(0.25 * (Rx * Rx - Ry * Ry) ** 2 + rhoD * rhoD * Rx * Rx * Ry * Ry);
  const hor = Math.sqrt(Math.max(a + b, 0));
  return Math.hypot(hor, az);
}

export interface SpectralMode { T: number; Gamma: number; phi: number; }  // por GDL de interés

/** Respuesta modal de un GDL: Rᵢ = Γᵢ · Sa(Tᵢ)/ωᵢ² · φᵢ  (desplazamiento espectral). */
export function modalResponses(modes: SpectralMode[], Sa: (T: number) => number): number[] {
  return modes.map(m => {
    const w2 = (2 * Math.PI / m.T) ** 2;
    return m.Gamma * Sa(m.T) / w2 * m.phi;
  });
}

/** Análisis espectral completo de un GDL: modal + (opcional) direccional. */
export function spectralAnalysis(
  modesX: SpectralMode[], modesY: SpectralMode[] | null, Sa: (T: number) => number,
  opt: { modal?: ModalCombo; directional?: DirectionalCombo; zeta?: number; rhoD?: number } = {}
): { Rx: number; Ry: number; R: number } {
  const modal = opt.modal ?? "CQC", dir = opt.directional ?? "SRSS", zeta = opt.zeta ?? 0.05;
  const rX = modalResponses(modesX, Sa);
  const Rx = combineModal(rX, modesX.map(m => m.T), modal, zeta);
  let Ry = 0;
  if (modesY) { const rY = modalResponses(modesY, Sa); Ry = combineModal(rY, modesY.map(m => m.T), modal, zeta); }
  const R = modesY ? combineDirectional(Rx, Ry, 0, dir, opt.rhoD ?? 0) : Rx;
  return { Rx, Ry, R };
}
