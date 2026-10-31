/**
 * Esfuerzos del triángulo de placa en los 3 joints (momentos y V13/V23), signo de CSI.
 * El cálculo vive en C++ (`tri_recovery`, getLocalStiffnessMatrix.cpp, al lado de la K): una sola copia del elemento.
 *   thin = true  → DKT (Shell-Thin)
 *   thin = false → Shell-Thick de CSI en forma cerrada
 * Verificado contra SAP2000 24 y ETABS 22 (tests/casos/dkt_momentos_vs_csi.mjs).
 */
import mod from "../wasmModule";

export interface TriMods { m11?: number; m22?: number; m12?: number; v13?: number; v23?: number }

export function triRecovery(
  thin: boolean, xl: number[], yl: number[], u9: number[], E: number, nu: number, t: number, mods?: TriMods
): { M: number[][]; V: number[] } {
  const m = mod as any;
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
  const m = mod as any;
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
