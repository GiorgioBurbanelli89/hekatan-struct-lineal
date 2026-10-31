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
