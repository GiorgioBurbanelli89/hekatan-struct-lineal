/**
 * Esfuerzos del triángulo de placa en los 3 joints (momentos y V13/V23), signo de CSI.
 * El cálculo vive en C++ (`tri_recovery`, getLocalStiffnessMatrix.cpp, al lado de la K): una sola copia del elemento.
 *   thin = true  → DKT (Shell-Thin)
 *   thin = false → Shell-Thick de CSI en forma cerrada
 * Verificado contra SAP2000 24 y ETABS 22 (tests/casos/dkt_momentos_vs_csi.mjs).
 */
import mod_ from "../wasmModule";

export interface TriMods { m11?: number; m22?: number; m12?: number; v13?: number; v23?: number }

export function triRecovery(
  thin: boolean, xl: number[], yl: number[], u9: number[], E: number, nu: number, t: number, mods?: TriMods
): { M: number[][]; V: number[] } {
  const m = mod_ as any;
  const entrada = [xl[0], yl[0], xl[1], yl[1], xl[2], yl[2], ...u9, mods?.m11 ?? 1, mods?.m22 ?? 1, mods?.m12 ?? 1, mods?.v13 ?? 1, mods?.v23 ?? 1];
  const pIn = m._malloc(8 * entrada.length), pOut = m._malloc(8 * 11);
  try {
    m.HEAPF64.set(entrada, pIn / 8);
    const pXY = pIn, pU = pIn + 8 * 6, pMods = pIn + 8 * 15;
    m._tri_recovery(thin ? 1 : 0, pXY, pU, E, nu, t, pMods, pOut);
    const o = Array.from(m.HEAPF64.subarray(pOut / 8, pOut / 8 + 11)) as number[];
    return { M: [o.slice(0, 3), o.slice(3, 6), o.slice(6, 9)], V: [o[9], o[10]] };
  } finally { m._free(pIn); m._free(pOut); }
}

/**
 * Esfuerzos del Q4 de placa en los 4 joints, signo de CSI (ya aplicado). El cálculo vive en C++ (`q4_recovery`).
 *   thick = false → DKQ (Shell-Thin): M en Gauss 2×2 extrapolado ("gauss") o en la esquina ("esquinas") y V13/V23 de la receta de CSI
 *   thick = true  → MITC4 (Shell-Thick): curvatura bilineal en Gauss extrapolada; sin V
 */
export function q4Recovery(
  thick: boolean, xl: number[], yl: number[], u12: number[], E: number, nu: number, t: number, modo: "gauss" | "esquinas" = "gauss"
): { M: number[][]; V: number[][] | null } {
  const m = mod_ as any;
  const entrada = [xl[0], yl[0], xl[1], yl[1], xl[2], yl[2], xl[3], yl[3], ...u12];
  const pIn = m._malloc(8 * entrada.length), pOut = m._malloc(8 * 20);
  try {
    m.HEAPF64.set(entrada, pIn / 8);
    const hayV = m._q4_recovery(thick ? 1 : 0, modo === "esquinas" ? 1 : 0, pIn, pIn + 8 * 8, E, nu, t, pOut);
    const o = Array.from(m.HEAPF64.subarray(pOut / 8, pOut / 8 + 20)) as number[];
    return {
      M: [0, 1, 2, 3].map((j) => o.slice(3 * j, 3 * j + 3)),
      V: hayV ? [0, 1, 2, 3].map((j) => [o[12 + 2 * j], o[13 + 2 * j]]) : null,
    };
  } finally { m._free(pIn); m._free(pOut); }
}

function conHeap<T>(doubles: number[], nOut: number, f: (pIn: number, pOut: number) => T): { r: T; out: number[] } {
  const m = mod_ as any;
  const pIn = m._malloc(8 * doubles.length), pOut = m._malloc(8 * nOut);
  try {
    m.HEAPF64.set(doubles, pIn / 8);
    const r = f(pIn, pOut);
    return { r, out: Array.from(m.HEAPF64.subarray(pOut / 8, pOut / 8 + nOut)) as number[] };
  } finally { m._free(pIn); m._free(pOut); }
}

export interface ItwOpts { tipo?: number; gammaFac?: number; mod?: number[] | null }

/**
 * Fuerzas de MEMBRANA [F11, F22, F12] en los 4 joints (ITW, Gauss 2×2 extrapolado, sin burbuja), cálculo en C++ (`itw_recovery`).
 * `u12` = [u, v, θz]×4 en ejes locales. null si el tipo de drilling no es ITW.
 */
export function itwJointForces(xl: number[], yl: number[], u12: number[], E: number, nu: number, t: number, opts: ItwOpts = {}): number[][] | null {
  const mod = opts.mod ?? null;
  const entrada = [...mod ?? [0, 0, 0], xl[0], yl[0], xl[1], yl[1], xl[2], yl[2], xl[3], yl[3], ...u12];
  const { r, out } = conHeap(entrada, 12, (pIn, pOut) =>
    (mod_ as any)._itw_recovery(opts.tipo ?? 13, opts.gammaFac ?? 0.4, mod ? 1 : 0, pIn, pIn + 8 * 3, pIn + 8 * 11, E, nu, t, pOut));
  return r ? [0, 1, 2, 3].map((j) => out.slice(3 * j, 3 * j + 3)) : null;
}

/** K de membrana ITW 12×12 condensada ([u, v, θz]×4, ejes locales), cálculo en C++ (`itw_k12`). null si el tipo no es ITW. */
export function itwMembraneK(xl: number[], yl: number[], E: number, nu: number, t: number, opts: ItwOpts = {}): number[][] | null {
  const mod = opts.mod ?? null;
  const entrada = [...mod ?? [0, 0, 0], xl[0], yl[0], xl[1], yl[1], xl[2], yl[2], xl[3], yl[3]];
  const { r, out } = conHeap(entrada, 144, (pIn, pOut) =>
    (mod_ as any)._itw_k12(opts.tipo ?? 13, opts.gammaFac ?? 0.4, mod ? 1 : 0, pIn, pIn + 8 * 3, E, nu, t, pOut));
  return r ? Array.from({ length: 12 }, (_, i) => out.slice(12 * i, 12 * i + 12)) : null;
}

/**
 * Momentos [Mx, My, Mxy] de la placa de Auricchio-Taylor en las 4 esquinas (signo del solver; el que llama pone el de CSI),
 * con burbujas y cortante mixto recuperados. Cálculo en C++ (`at_recovery`). `mod` = [m11, m22, m12, v13, v23] opcional.
 */
export function atJointMoments(xl: number[], yl: number[], u12: number[], E: number, nu: number, t: number, mod?: number[]): number[][] {
  const entrada = [...mod ?? [0, 0, 0, 0, 0], xl[0], yl[0], xl[1], yl[1], xl[2], yl[2], xl[3], yl[3], ...u12];
  const { out } = conHeap(entrada, 12, (pIn, pOut) =>
    (mod_ as any)._at_recovery(mod ? 1 : 0, pIn, pIn + 8 * 5, pIn + 8 * 13, E, nu, t, pOut));
  return [0, 1, 2, 3].map((j) => out.slice(3 * j, 3 * j + 3));
}
