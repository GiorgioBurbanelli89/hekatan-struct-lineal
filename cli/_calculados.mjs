// computedLabels (📊 Calculados) de un ejemplo. node cli/_calculados.mjs <id> [k=v ...]
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const [id, ...kv] = process.argv.slice(2); const over = {};
for (const a of kv) { const m = a.match(/^(\w+)=(.+)$/); if (m) over[m[1]] = isNaN(+m[2]) ? m[2] : +m[2]; }
const mod = await empaquetar(`
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function calc(id, over) {
  const ex = examplesRegistry.find(e => e.id === id); const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.texto ?? d.default; Object.assign(p, over);
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  let F = [0,0,0]; const L = st.nodeInputs.val.loads; if (L) for (const f of (L.values ? L.values() : Object.values(L))) for (let c=0;c<3;c++) F[c]+=f[c];
  let um = 0; const D = st.deformOutputs.val?.deformations; if (D) for (const u of D.values()) um = Math.max(um, Math.hypot(u[0],u[1],u[2]));
  return { calculados: ex.computedLabels ? ex.computedLabels(p, st) : {}, sumaCargas: F, umax_mm: um*1000, nudos: st.nodes.val.length, elems: st.elements.val.length };
}`, "calc" + Date.now());
console.log(JSON.stringify(mod.calc(id, over), null, 1));
