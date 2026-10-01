// Valor de cáscara de Hekatan EN EL NUDO (sin promediar y promediado) para comparar con SAP2000. node cli/_fernan_nudo.mjs
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const mod = await empaquetar(`
const g = globalThis; g.window = g;
const nodo = () => new Proxy({ style:{}, classList:{add(){},remove(){},toggle(){},contains:()=>false} }, { get:(t,k)=> k in t ? t[k] : (()=>nodo()) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function leer(over, el, nudo) {
  const ex = examplesRegistry.find(e => e.id === "muro-manabi"); const p = {}; for (const [k, d] of Object.entries(ex.params)) p[k] = d.default; Object.assign(p, over);
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const a = st.analyzeOutputs.val, e = st.elements.val[el], k = e.indexOf(nudo);
  const G = 9.80665, f = (m) => m?.get(el)?.[k] / G;
  const prom = (m) => m?.get(nudo) / G;
  return { elemento: el, nudos: e, k, M22_sinprom: f(a.bendingYYjoint), V23_sinprom: f(a.shearYjoint), M22_centro: a.bendingYYcentro?.get(el) / G, V23_joint: (a.tranverseShearYjoint ?? a.transverseShearYjoint)?.get(el)?.[k] / G, prom_M22: a.bendingYY?.get(nudo) / G,
           claves: Object.keys(a).filter(x => /hear/i.test(x)) };
}`, "fernan" + Date.now());
console.log(JSON.stringify(mod.leer({ modelo: 1, cf: 1, L: 3, sCf: 1.5, ms: 0.15 }, 459, 467), null, 1));
