// Masa y modos de la plantilla «Pórtico + losa» con la losa Shell-Thin / Shell-Thick / Membrana, por el MISMO
// modalAnalysis de la app (con los modificadores de cáscara), con masa vertical (SAP2000) o solo lateral (ETABS opción).
// Uso: node cli/_masa_losa_hk.mjs salida.json [clave=valor ...]   (p. ej. pisos=1 nx=5 ny=4)
import { writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const over = Object.fromEntries(process.argv.slice(3).map((a) => { const [k, v] = a.split("="); return [k, isNaN(Number(v)) ? v : Number(v)]; }));
const mod = await empaquetar(`
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false},
  getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {};
g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export { modalAnalysis, jointMass } from "${R}/hekatan-fem/src/index";
export function construir(over) {
  const ex = examplesRegistry.find(e => e.id === "plantillas");
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default;
  p.tipo = 2; Object.assign(p, over);
  const estado = (ini) => { let v = ini; return { get val(){ return v; }, set val(x){ v = x; }, get rawVal(){ return v; }, set rawVal(x){ v = x; } }; };
  const st = { nodes: estado([]), elements: estado([]), nodeInputs: estado({}), elementInputs: estado({}), deformOutputs: estado({}), analyzeOutputs: estado({}), objects3D: estado([]) };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  return st;
}
`, "masa-losa-hk");
const out = {};
for (const f of [1, 0, 2]) for (const lateral of [0, 1]) {
  const st = mod.construir({ ...over, formLosa: f });
  const n = st.nodes.val, el = st.elements.val, ni = st.nodeInputs.val, ei = st.elementInputs.val;
  const lg = console.log; console.log = () => {};
  let m; try { m = mod.modalAnalysis(n, el, ni, ei, 12, lateral, 0, 1, ni.diaphragms instanceof Map && ni.diaphragms.size ? ni.diaphragms : undefined); } finally { console.log = lg; }
  const T = m.frequencies.map((x) => 1 / x), mp = m.massParticipation ?? [];
  // masa ensamblada (la de la báscula de CSI): total y la de un nudo INTERIOR de la losa
  const jm = mod.jointMass(n, el, ei, { lateral: 0, lump: 0, incluyeElementos: 1 });
  const tot = jm.reduce((a, v) => a + v[0], 0);
  // reacción del estático (se pierde carga en la membrana mallada)
  let fz = 0, rz = 0; for (const [, v] of ni.loads ?? []) fz += v[2] || 0; for (const [, v] of st.deformOutputs.val.reactions ?? []) rz += v[2] || 0;
  const k = `L${f}_${lateral ? "lat" : "vert"}`;
  out[k] = { T, mp: mp.map((v) => [v[0], v[1], v[2], v[5]]), masaTotal: tot, fz, rz, nNodos: n.length };
  console.log(k.padEnd(10), "M", tot.toFixed(3), "Fz", fz.toFixed(1), "Rz", rz.toFixed(1), "T", T.slice(0, 8).map((t) => t.toFixed(4)).join(" "));
  console.log("           Uz modos 1-8:", mp.slice(0, 8).map((v) => (v[2] * 100).toFixed(1)).join(" "), "· ΣUz", (mp.reduce((a, v) => a + v[2], 0) * 100).toFixed(1), "% · ΣUx", (mp.reduce((a, v) => a + v[0], 0) * 100).toFixed(1));
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
