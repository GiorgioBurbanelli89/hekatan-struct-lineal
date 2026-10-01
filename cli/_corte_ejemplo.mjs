// Corte de sección de un ejemplo sin navegador. node cli/_corte_ejemplo.mjs <id> <eje> <pos> [k=v ...]
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const [id, eje, pos, ...kv] = process.argv.slice(2); const over = {};
for (const a of kv) { const m = a.match(/^(\w+)=(.+)$/); if (m) over[m[1]] = +m[2]; }
const mod = await empaquetar(`
const g = globalThis; g.window = g;
const nodo = () => new Proxy({ style:{}, classList:{add(){},remove(){},toggle(){},contains:()=>false} }, { get:(t,k)=> k in t ? t[k] : (()=>nodo()) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
const { corteDeSeccion } = await import("${R}/examples/src/shared/corteSeccion");
export function corte(id, eje, pos, over) {
  const ex = examplesRegistry.find(e => e.id === id); const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.texto ?? d.default; Object.assign(p, over);
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const ni = st.nodeInputs.val, d = st.deformOutputs.val;
  return corteDeSeccion(st.nodes.val, st.elements.val, ni.loads, d.reactions, ni.supports, st.springs?.val ?? ni.springs, d.deformations, eje, pos);
}`, "corte" + Date.now());
console.log(JSON.stringify(mod.corte(id, +eje, +pos, over)));
