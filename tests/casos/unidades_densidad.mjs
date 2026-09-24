/**
 * UNIDADES de la densidad: `elementInputs.densities` es MASA en t/m³ (materials.ts).
 *
 * Por qué existe (22-sep-2026): el ejemplo drilling-dof ponía `densities = 24`
 * (el PESO en kN/m³). El exportador multiplica por g → el .e2k salió con
 * γ = 235 kN/m³ (×9.81) y ETABS dio FZ = 103 tonf donde el muro pesa 10.3. Nadie
 * lo vio porque el Dead de ese ejemplo solo tenía carga lateral; al activar
 * SELFWEIGHT en ETABS los colormaps dejaron de coincidir con Hekatan.
 *
 * Dos comprobaciones, sin referencia externa (son de UNIDADES, no de FEM):
 *   1. Cada ejemplo, con sus parámetros por defecto: toda ρ ∈ {0} ∪ [0.3, 12] t/m³.
 *      0.3 = madera liviana, 12 = plomo. 24 (kN/m³ del hormigón) o 78.5 (acero)
 *      caen fuera → es un peso metido como masa.
 *   2. El exportador e2k: γ escrito = ρ·g, para el hormigón del drilling-dof.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

const RHO_MIN = 0.3, RHO_MAX = 12;   // t/m³
// Fuera de rango A PROPÓSITO, con su motivo. Todo lo demás fuera de rango es un error.
const EXCEPCIONES = {
  "benchmark-paz-4-1": "Paz: masa concentrada en nudos; ρ ≈ 0 para que las barras no pesen",
  "benchmark-paz-6-1": "Paz: ídem", "benchmark-paz-7-1": "Paz: ídem", "benchmark-paz-8-1": "Paz: ídem", "benchmark-paz-9-3": "Paz: ídem",
  "benchmark-paz-10-7": "Paz: unidades kip-in del libro (validado contra ETABS)",
  "benchmark-paz-11-1": "Paz: unidades del libro", "benchmark-paz-12-1": "Paz: unidades del libro", "benchmark-paz-13-1": "Paz: unidades del libro",
  "benchmark-cft-cantilever": "CFT: densidad EQUIVALENTE (ρs·As + ρc·Ac)/A_tr",
  "W2_viga_flexion_composite_slab_cantilever": "mixta: densidad equivalente de la sección transformada",
  "W2_viga_flexion_composite_encased_cantilever": "mixta: densidad equivalente de la sección transformada",
};
const G = 9.80665;

const FUENTE = `
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}),
  createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) },
  { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){},
  addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false},
  getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){},
  cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(),
  documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[],
  addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} };
g.addEventListener = () => {};
g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
const { exportE2k } = await import("${R}/examples/src/shared/e2kExporter");

export const ids = () => examplesRegistry.map(e => e.id);

export function construir(id) {
  const ex = examplesRegistry.find(e => e.id === id);
  const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
               deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  return st;
}

export function densidades(id) {
  const st = construir(id);
  const d = st.elementInputs.val?.densities;
  return d ? [...d.values()] : [];
}

export function e2kDe(id) {
  const st = construir(id);
  return exportE2k({ nodes: st.nodes.val, elements: st.elements.val,
    nodeInputs: st.nodeInputs.val, elementInputs: st.elementInputs.val });
}
`;

export const nombre = "unidades-densidad";
export const descripcion = "densities = MASA t/m³ en todos los ejemplos; γ del e2k = ρ·g";

export async function correr() {
  const m = await empaquetar(FUENTE, "unidades-densidad");
  const filas = [];
  const malos = [], rotos = [];
  let revisados = 0;
  for (const id of m.ids()) {
    let vals;
    try { vals = m.densidades(id); } catch (e) { rotos.push(id); continue; }
    revisados++;
    const fuera = [...new Set(vals.filter(v => v !== 0 && (v < RHO_MIN || v > RHO_MAX)).map(v => +v.toFixed(4)))];
    if (fuera.length && !EXCEPCIONES[id]) malos.push(`${id} (ρ = ${fuera.slice(0, 3).join(", ")})`);
  }
  filas.push({ que: "ρ fuera de 0.3-12 t/m³", medido: malos.length, limite: 0, crudo: true,
    ok: malos.length === 0,
    detalle: malos.length ? malos.join(" · ") : `${revisados} ejemplos revisados` +
      (rotos.length ? ` (${rotos.length} no arman sin navegador: ${rotos.slice(0, 5).join(", ")}…)` : "") });

  // γ del e2k del drilling-dof: WEIGHTPERVOLUME del hormigón, en las unidades del fichero
  const txt = m.e2kDe("drilling-dof");
  const u = /UNITS\s+"(\w+)"\s+"(\w+)"/.exec(txt);
  const w = +/TYPE "Concrete"\s+WEIGHTPERVOLUME\s+([0-9.eE+-]+)/.exec(txt)[1];
  const fF = { N: 1000, KN: 1, TONF: 1 / G, KGF: 1000 / G }[u[1].toUpperCase()];
  const fL = { MM: 1000, M: 1, CM: 100 }[u[2].toUpperCase()];
  const w_kNm3 = w / fF * fL ** 3;
  const rho = m.densidades("drilling-dof")[0];
  const err = Math.abs(w_kNm3 - rho * G) / (rho * G) * 100;
  filas.push({ que: "γ e2k = ρ·g", medido: err, limite: 0.01, ok: err <= 0.01,
    detalle: `e2k ${w_kNm3.toFixed(3)} kN/m³ · ρ·g = ${(rho * G).toFixed(3)} kN/m³` });
  return filas;
}
