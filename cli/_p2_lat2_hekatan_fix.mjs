// Hekatan: dual 4 pisos con las cargas de P2_lat2.json (forma del 2o modo), diafragma en ejes (1) y total (2); careo nudo a nudo con ETABS.
import { readFileSync } from "node:fs";
import { empaquetar, R, cargarFem } from "../tests/lib/bundle.mjs";
const FUENTE = `
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function modelo(over) {
  const ex = examplesRegistry.find(e => e.id === "plantillas");
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default; Object.assign(p, over);
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  return { nodes: st.nodes.val, elements: st.elements.val, ei: st.elementInputs.val, ni: st.nodeInputs.val };
}`;
const mod = await empaquetar(FUENTE, "dual4-lat2"); const { deform } = await cargarFem();
const E = JSON.parse(readFileSync("validation/modelos/plantillas/etabs_fix/P2_lat2.json", "utf8"));
const key = (x, y, z) => `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`; const eMap = new Map(E.nudos.map(d => [key(d.x, d.y, d.z), d]));
const mx = Math.max(...E.nudos.map(d => Math.abs(d.ux)));
for (const [diaf, ej] of [[1, 1], [1, 0]]) {
  const m = mod.modelo({ tipo: 2, diafragma: diaf, etabsjoint: ej });
  const loads = new Map();
  for (const [z, [x, y, zz, F]] of Object.entries(E.cargas)) { const i = m.nodes.findIndex(n => key(n[0], n[1], n[2]) === key(x, y, zz)); if (i < 0) { console.log("sin nudo para", x, y, zz); continue; } loads.set(i, [F, 0, 0, 0, 0, 0]); }
  const r = deform(m.nodes, m.elements, { ...m.ni, loads }, m.ei);
  const porZ = {};
  m.nodes.forEach((nd, i) => { const e = eMap.get(key(nd[0], nd[1], nd[2])); if (!e) return; const u = r.deformations.get(i); const z = nd[2].toFixed(1); porZ[z] = porZ[z] || { n: 0, peor: 0, sum: 0, uxH: 0, uxE: 0 }; const d = Math.abs(u[0] - e.ux); porZ[z].n++; porZ[z].sum += d; porZ[z].peor = Math.max(porZ[z].peor, d); if (Math.abs(e.ux) > Math.abs(porZ[z].uxE)) { porZ[z].uxE = e.ux; porZ[z].uxH = u[0]; } });
  console.log(`diaf=${diaf} etabsjoint=${ej}:`, Object.entries(porZ).map(([z, s]) => `z=${z}: ux max Hek ${s.uxH.toExponential(4)} / ETABS ${s.uxE.toExponential(4)} (${((s.uxH / s.uxE - 1) * 100).toFixed(2)} %), peor nudo ${(s.peor / mx * 100).toFixed(2)} % del max`).join(" | "));
}
