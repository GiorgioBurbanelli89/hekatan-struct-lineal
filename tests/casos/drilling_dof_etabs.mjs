/**
 * DRILLING DOF: 2 muros + viga de acople, contra SAP2000 (arbitro) y ETABS (informativo).
 *
 * El drilling es el giro NORMAL a la cascara. La membrana por defecto es el ITW
 * 1990 con la proyeccion del drilling de FEAP (`drillingTypes = 8`, gamma = 0.4 mu
 * medido por flexibilidad).
 *
 * ARBITRO = SAP2000 24 con la MISMA malla (92 nudos, 64 Shell-Thick, 3 barras),
 * armado por OAPI desde el volcado de Hekatan, SIN automallado
 * (`galpon-bodega-electoral/sap_drilling.py`):
 *
 *     Ux maximo = 5.802662e-04 m      Hekatan: 5.802662e-04 (peor nudo 2.5e-12 %)
 *
 * ETABS 22 da 5.359904e-04 (-7.6 %) con los MISMOS objetos (por e2k y por OAPI,
 * `etabs_drilling_oapi.py`). No es la celda ni el drilling: los muros SIN viga
 * dan lo mismo en ETABS y Hekatan (6.016323e-04, y el giro bajo un momento
 * nodal -8.739795e-04, identicos). Es como ETABS ata la VIGA al muro: en ETABS
 * el giro del nudo sigue la cuerda del muro (R2 -1.5e-4 vs -2.25e-4) y la viga
 * lleva 3x el cortante (20.2 vs 6.56 kN). Queda registrado como dato de ETABS,
 * no como limite.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

const SAP_UX = 5.802662e-4;     // m, SAP2000 24, misma malla, sin automallado (arbitro)
const ETABS_UX = 5.359904e-4;   // m, ETABS 22.6.0, caso Dead (informativo: ETABS ata la viga distinto)
// Limite contra SAP2000: es la misma malla y el mismo elemento, asi que solo
// cabe el redondeo. Antes (19-ago) el limite era 4 % contra ETABS con el tipo 8.
const LIMITE = 0.01;            // %

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

export function correrEjemplo(id) {
  const ex = examplesRegistry.find(e => e.id === id);
  if (!ex) throw new Error("no existe el ejemplo " + id);
  const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
               deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const def = st.deformOutputs.val?.deformations;
  let uxMax = 0;
  for (let i = 0; i < st.nodes.val.length; i++) {
    const d = def?.get(i); if (!d) continue;
    if (Math.abs(d[0]) > Math.abs(uxMax)) uxMax = d[0];
  }
  return { uxMax, nNodos: st.nodes.val.length, nElem: st.elements.val.length };
}
`;

export const nombre = "drilling-dof-etabs";
export const descripcion =
  "el giro normal de la membrana, contra ETABS: 2 muros + viga de acople";

export async function correr() {
  const mod = await empaquetar(FUENTE, "drilling-dof");
  const r = mod.correrEjemplo("drilling-dof");
  const err = Math.abs(r.uxMax / SAP_UX - 1) * 100;
  const errE = (r.uxMax / ETABS_UX - 1) * 100;
  // Desde el 3-sep-2026 la union viga-muro de ETABS va ENCENDIDA por defecto (decision de
  // Jorge), asi que el ejemplo tal cual reproduce a ETABS; SAP2000 queda como dato.
  return [{
    que: "Ux de la punta contra ETABS 22 (misma malla, union viga-muro por defecto)",
    medido: Math.abs(errE),
    limite: LIMITE,
    ok: Math.abs(errE) <= LIMITE,
    detalle: `Hekatan ${r.uxMax.toExponential(6)} m vs ETABS `
      + `${ETABS_UX.toExponential(6)} m — ${r.nNodos} nudos, ${r.nElem} elementos`,
  }, {
    que: "…y SAP2000 se queda a (informativo: sin la union, `etabsjoint 0`, es exacto)",
    crudo: true, medido: err.toFixed(2) + " %", limite: "dato", ok: true,
    detalle: `SAP2000 ${SAP_UX.toExponential(6)} m; ver el caso etabs-wall-joint`,
  }];
}
