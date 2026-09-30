#!/usr/bin/env node
/**
 * Vuelca un EJEMPLO del workspace (resuelto) al mismo JSON que `tests/lib/dump_heks.mjs`:
 * nudos, elementos, nodeInputs, elementInputs, deformaciones y reacciones. Es la entrada de
 * `galpon-bodega-electoral/csi_desde_dump.py sap|etabs`, que lo arma por OAPI con la MISMA
 * malla y las MISMAS cargas nodales (el arbitro limpio, sin automallado ni cargas de CSI).
 *
 *   node cli/dump_ejemplo.mjs <id> <salida.json> [clave=valor ...]
 */
import { writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const [id, salida, ...kv] = process.argv.slice(2);
if (!id || !salida) { console.error("uso: node cli/dump_ejemplo.mjs <id> <salida.json> [k=v ...]"); process.exit(2); }
const over = {};
for (const a of kv) { const m = a.match(/^([A-Za-z_]\w*)=(.+)$/); if (m) over[m[1]] = isNaN(+m[2]) ? m[2] : +m[2]; }   // texto también (ejesX=0,5,11)

const mod = await empaquetar(`
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function construir(id, over) {
  const ex = examplesRegistry.find(e => e.id === id); if (!ex) throw new Error("no existe " + id);
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default; Object.assign(p, over);
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  return st;
}`, "dump-ejemplo");

const st = mod.construir(id, over);
const plano = (o) => {
  if (o instanceof Map) return Object.fromEntries([...o].map(([k, v]) => [k, plano(v)]));
  if (Array.isArray(o)) return o.map(plano);
  if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, plano(v)]));
  return o;
};
const d = st.deformOutputs.val || {};
const out = {
  nodes: st.nodes.val, elements: st.elements.val,
  nodeInputs: plano(st.nodeInputs.val), elementInputs: plano(st.elementInputs.val),
  deformations: plano(d.deformations || new Map()), reactions: plano(d.reactions || new Map()),
};
writeFileSync(salida, JSON.stringify(out));
console.log(`${id} ${JSON.stringify(over)}: ${out.nodes.length} nudos, ${out.elements.length} elementos -> ${salida}`);
