// El modal de un .heks por el MISMO camino que la app: cliModeler (lector) + modalAnalysis (WASM), masa 3D.
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const [heks, salida, nArg] = process.argv.slice(2);
const mod = await empaquetar(`
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";
`, "modal-wasm-entrega");
globalThis.window.__hekatanCliScript = readFileSync(heks, "utf-8");
globalThis.window.__hekatanCliModalModes = nArg || "80";
const st = (v) => ({ val: v, rawVal: v });
const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
mod.cliModeler.build({}, states);
let out = null;
mod.cliModeler.runModal({}, states, { render: (o) => { out = o; } });
const f = out.frequencies;
writeFileSync(salida, JSON.stringify({ camino: "cliModeler.runModal (WASM, masa 3D)", periods: f.map(x => 1 / x), massParticipation: out.massParticipation }, null, 1));
console.log(`${f.length} modos · T1 = ${(1 / f[0]).toFixed(6)} s · T80 = ${(1 / f[f.length - 1]).toFixed(6)} s -> ${salida}`);
