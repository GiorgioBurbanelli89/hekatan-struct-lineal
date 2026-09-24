/**
 * LAS ZAPATAS DE GUERRA CONTRA SAFE 20, NUDO A NUDO.
 * Referencia: `safe_node_driver.py` (validacion/safe-api, ago-2026) replica en SAFE la
 * MISMA malla de Hekatan, los mismos muelles nodales ks·A_trib, las mismas cargas y
 * el mismo peso propio nodal; sigma = ks·|Uz|. Sus sigma_max estan en
 * tests/datos/guerra_safe_nodal.json. Lo que vigila: que la presion maxima de cada
 * ejemplo del workspace siga donde SAFE la puso.
 *   todos < 0.5 %. ej5 (22-sep-2026): era un rectangulo con los muelles apagados fuera del
 *   trapecio (Hekatan) contra un trapecio escalonado (SAFE); ahora malla trapezoidal en los dos: 0.07 %. ej6 no tiene replica valida en SAFE (sin
 *   viga de amarre).
 *   El «ej4 -17 %, formulacion de placa» que estuvo abierto de ago a sep-2026 era el
 *   SIGNO del momento: el gdl 1 de plateQ4Solve iba directo a la pendiente bx de
 *   Bathe, cuya fuerza conjugada es -My, y SAFE recibia +My. Con el mismo signo:
 *   28.405 = 28.405. Desde el 3-sep-2026 plateQ4Solve es mano derecha (1 = Mx,
 *   2 = My) y los ejemplos ponen el momento de la columna en My. De paso ej7 paso
 *   de 3.2 % a 0.000 % y ej5 de 1.5 % a 0.86 %.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "guerra-vs-safe";
export const descripcion = "zapatas de Guerra (ej1-8): sigma_max = ks·|Uz| contra SAFE 20 con la misma malla y los mismos muelles";
const pct = (a, b) => (a / b - 1) * 100;

const FUENTE = `
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function sigmaMax(id) {
  const ex = examplesRegistry.find(e => e.id === id); if (!ex) return null;
  const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  let uzMax = 0; st.deformOutputs.val?.deformations?.forEach(u => { if (Math.abs(u[2]) > uzMax) uzMax = Math.abs(u[2]); });
  return { sigma: p.ks_tm3 * uzMax, nudos: st.nodes.val.length, elems: st.elements.val.length };
}`;

export async function correr() {
  const S = JSON.parse(readFileSync(join(AQUI, "..", "datos", "guerra_safe_nodal.json"), "utf-8"));
  const mod = await empaquetar(FUENTE, "guerra-vs-safe");
  const limites = { ej1: 0.5, ej2: 0.5, ej3: 0.5, ej4: 0.5, ej5: 0.5, ej7: 0.5, ej8: 0.5 };
  const filas = [];
  for (const k of ["ej1", "ej2", "ej3", "ej4", "ej5", "ej7", "ej8"]) {
    const ref = S[k]; const r = mod.sigmaMax(ref.ej_key);
    if (!r) { filas.push({ que: `${k}: ${ref.ej_key}`, crudo: true, medido: "no existe", limite: "ejemplo", ok: false, detalle: "" }); continue; }
    const d = pct(r.sigma, ref.sigma_max);
    const detalle = `sigma_max ${r.sigma.toFixed(3)} vs SAFE ${ref.sigma_max.toFixed(3)} t/m2 (Hekatan ago-2026: ${ref.hekatan_sigma_max}); ${r.nudos} nudos, ${r.elems} elementos`;
    filas.push({ que: `${k} ${ref.ej_key.replace("guerra-", "")}: sigma_max vs SAFE nudo a nudo`, medido: Math.abs(d), limite: limites[k], ok: Math.abs(d) <= limites[k], detalle });
  }
  return filas;
}
