/** Metricas Hekatan vs ETABS por patron para la comparacion plana vs pendiente (reusa vano_cmp.medir). */
import { cargarMod, medir } from "./vano_cmp.mjs";
export { cargarMod };
const clase = (sec) => sec.startsWith("1G") ? "correa" : sec.startsWith("VP") ? "VP" : sec.startsWith("CC") ? "col" : sec.startsWith("Tubo") ? "tubo" : "otra";
export function resumenAxil(axil) {
  const o = {};
  for (const a of axil) { const c = clase(a.sec); const e = Math.abs(a.hek - a.etabs); (o[c] ??= { n: 0, errMax: 0, etMax: 0, sq: 0, sr: 0 }); const q = o[c];
    q.n++; q.errMax = Math.max(q.errMax, e); q.etMax = Math.max(q.etMax, a.etabs); q.sq += e * e; q.sr += a.etabs ** 2; }
  for (const q of Object.values(o)) q.rms = 100 * Math.sqrt(q.sq / (q.sr || 1e-30));
  return o;
}
/** pref: prefijo de datos; nom: variante. Devuelve {pat: {U,peor,max,R,Rtot,Etot,axil}} */
export async function medirModelo(mod, pref, nom, opc = {}, pats = ["Dead", "Live", "LATX", "LATY"]) { return medir(mod, nom, opc, pats, pref); }
