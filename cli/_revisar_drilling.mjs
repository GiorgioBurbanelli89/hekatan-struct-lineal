// Busca ejemplos con el GIRO EN EL PLANO de la cáscara (drilling) fijo en nudos que NO están empotrados:
// esos apoyos falsos se llevan momento (el error del muro-q4, 1-oct-2026). node cli/_revisar_drilling.mjs [id ...]
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const ids = process.argv.slice(2);
const mod = await empaquetar(`
const g = globalThis; g.window = g;
const nodo = () => new Proxy({ style:{}, classList:{add(){},remove(){},toggle(){},contains:()=>false} }, { get:(t,k)=> k in t ? t[k] : (()=>nodo()) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
g.requestAnimationFrame = () => 0; g.setTimeout = g.setTimeout;
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export const lista = () => examplesRegistry.map(e => e.id);
export function revisar(id) {
  const ex = examplesRegistry.find(e => e.id === id); const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.texto ?? d.default;
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const N = st.nodes.val, E = st.elements.val, S = st.nodeInputs.val?.supports; if (!S) return null;
  const normales = new Map(), barra = new Set();
  for (const e of E) {
    if (e.length === 2) { e.forEach(n => barra.add(n)); continue; }
    if (e.length < 3 || e.length > 4) continue;
    const a = N[e[0]], b = N[e[1]], c = N[e[2]]; if (!a || !b || !c) continue;
    const u = [0,1,2].map(i => b[i]-a[i]), v = [0,1,2].map(i => c[i]-a[i]);
    const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; const l = Math.hypot(...n) || 1;
    for (const k of e) { const L = normales.get(k) ?? []; L.push(n.map(x => x / l)); normales.set(k, L); }
  }
  let malos = 0, total = 0; const ej = [];
  S.forEach((s, k) => {
    const ns = normales.get(k); if (!ns || barra.has(k)) return;
    if (s[0] && s[1] && s[2]) return;                       // empotrado / articulado en las 3 traslaciones: no cuenta
    const n0 = ns[0]; if (ns.some(n => Math.abs(Math.abs(n[0]*n0[0]+n[1]*n0[1]+n[2]*n0[2]) - 1) > 1e-6)) return;   // arista entre planos
    total++;
    const ax = n0.map(Math.abs), d = ax.indexOf(Math.max(...ax));
    const libres = [0, 1, 2].filter((i) => i !== d && !s[i]).length;   // traslaciones EN el plano libres
    if (ax[d] > 0.999 && libres === 2 && s[3 + d]) { malos++; if (ej.length < 3) ej.push(k); }
  });
  return { malos, total, ej, nudos: N.length };
}`, "drill" + Date.now());
const todos = ids.length ? ids : mod.lista();
for (const id of todos) {
  try { const r = mod.revisar(id); if (r && r.malos) console.log("MAL", id, JSON.stringify(r)); }
  catch (e) { console.log("err", id, String(e).slice(0, 80)); }
}
console.log("fin", todos.length);
