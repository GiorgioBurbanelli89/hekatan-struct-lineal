/**
 * El EJEMPLO visible `placa-navier` de la app (mismo modelo que placa-momentos-navier) tiene que dar
 * lo mismo que el caso del .heks: si alguien cambia el ejemplo y se separa del test, se ve aqui.
 * Arbitros: Navier (serie cerrada) y SAP2000 24 (M11 del nudo central = 7.4169, media de 4 joints).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

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

export function correr(id, over) {
  const ex = examplesRegistry.find(e => e.id === id);
  if (!ex) throw new Error("no existe el ejemplo " + id);
  const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
  Object.assign(p, over || {});
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
               deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const def = st.deformOutputs.val?.deformations;
  const d = []; for (let i=0;i<st.nodes.val.length;i++) d.push(Array.from(def?.get(i)||[0,0,0,0,0,0]));
  const bx = st.analyzeOutputs.val?.bendingXX, els = st.elements.val, N = Math.round(Math.sqrt(els.length)), c = (N/2)*(N+1)+N/2;
  const vs = []; els.forEach((el,e)=>{ const k = el.indexOf(c); if (k>=0) vs.push(bx?.get(e)?.[k]); });
  return { nodos: st.nodes.val, nElem: els.length, d, m11: vs.reduce((a,b)=>a+b,0)/vs.length, wc: d[c][2] };
}
`;

export const nombre = "placa-navier-ejemplo";
export const descripcion = "el ejemplo visible placa-navier de Struct = el caso placa-momentos-navier";

export async function correr() {
  const mod = await empaquetar(FUENTE, "placa-navier-ej");
  const r = mod.correr("placa-navier");
  const filas = [];
  const NAV_M = 7.0724, NAV_W /* E = 2.5e7, el de SAP */ = -0.5990e-3, SAP_M = 7.4169, HEKS_M = 7.1991;
  const pc = (a, b) => (100 * (a - b)) / b;
  filas.push({ que: "M11 centro del ejemplo = M11 centro del caso .heks", medido: Math.abs(pc(r.m11, HEKS_M)), limite: 0.1,
    ok: Math.abs(pc(r.m11, HEKS_M)) <= 0.1, detalle: `${r.m11.toFixed(4)} vs ${HEKS_M} (Navier ${NAV_M}, SAP2000 ${SAP_M})` });
  filas.push({ que: "M11 centro vs Navier", medido: Math.abs(pc(r.m11, NAV_M)), limite: 6,
    ok: Math.abs(pc(r.m11, NAV_M)) <= 6, detalle: `${pc(r.m11, NAV_M).toFixed(2)} % (SAP2000: ${pc(SAP_M, NAV_M).toFixed(2)} %)` });
  filas.push({ que: "flecha centro vs Navier", medido: Math.abs(pc(r.wc, NAV_W)), limite: 4,
    ok: Math.abs(pc(r.wc, NAV_W)) <= 4, detalle: `${(r.wc * 1000).toFixed(4)} mm vs ${(NAV_W * 1000).toFixed(4)}` });
  filas.push({ que: "64 elementos (8x8)", medido: r.nElem, limite: 64, crudo: true, ok: r.nElem === 64, detalle: `${r.nElem}` });
  return filas;
}
