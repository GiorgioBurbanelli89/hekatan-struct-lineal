/**
 * Compara CADA zapata de Guerra (ejemplos de Hekatan Struct) contra el LIBRO de Marcelo
 * Guerra («Cimentaciones Sismo Resistentes utilizando SAFE», 2013), ejemplo a ejemplo
 * empezando por el primero, y saca el campo de presión (σ = ks·|Uz|) para el mapa de color.
 *
 *   node cli/guerra_libro_check.mjs            (tabla + JSON del campo σ)
 *
 * Árbitro: validacion/guerra-libro/referencia_libro.json (σ manual y σ de SAFE del libro).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const LIBRO = JSON.parse(readFileSync(join(R, "..", "validacion", "guerra-libro", "referencia_libro.json"), "utf-8")).ejemplos;
const OUT = join(AQUI, "shots", "guerra"); mkdirSync(OUT, { recursive: true });

const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });

const FUENTE = `
const ctx2d = ${ctx2d.toString()};
const nodo = ${nodo.toString()};
globalThis.window = globalThis;
globalThis.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
globalThis.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; globalThis.addEventListener = () => {}; globalThis.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function campo(id) {
  const ex = examplesRegistry.find(e => e.id === id); if (!ex) return null;
  const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
  const S = (v) => { let _v = v; return { get val(){return _v;}, set val(x){_v=x;}, get rawVal(){return _v;}, derive(){}, }; };
  const st = { nodes:S([]), elements:S([]), nodeInputs:S({}), elementInputs:S({}), deformOutputs:S({}), analyzeOutputs:S({}), objects3D:S([]), springs:S([]),
    loadPatterns:S([]), loadCases:S([]), loadCombinations:S([]), activeLoadCase:S("Dead") };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const ks = p.ks_tm3;                       // tonf/m3 (para pasar Uz[m] a tonf/m2)
  const nodes = st.nodes.val.map(n => [n[0], n[1]]);
  const uz = new Array(nodes.length).fill(0);
  st.deformOutputs.val?.deformations?.forEach((u,i) => { uz[i] = u[2]; });
  const sig = uz.map(v => ks * Math.abs(v));  // σ nodal = ks·|Uz|
  const smax = Math.max(...sig), smin = Math.min(...sig.filter((_,i)=>true));
  return { id, ks, nodes, sigma: sig, smax, smin };
}`;

const mod = await empaquetar(FUENTE, "guerra-libro-check");
const IDS = Object.keys(LIBRO);
const filas = [];
for (const id of IDS) {
  const c = mod.campo(id);
  if (!c) { console.log("  x sin ejemplo:", id); continue; }
  const ref = LIBRO[id];
  const sSafe = ref.sigma_safe?.max ?? null, sMan = ref.sigma_manual?.max ?? null;
  const dSafe = sSafe ? (c.smax - sSafe) / sSafe * 100 : null;
  filas.push({ id, smax: c.smax, smin: c.smin, sSafe, sMan, dSafe, nudos: c.nodes.length });
  writeFileSync(join(OUT, id + ".json"), JSON.stringify({ nodes: c.nodes, sigma: c.sigma, smax: c.smax, ref }, null, 0));
}
console.log("\nEjemplo".padEnd(46), "σmax Hek", " σ SAFE-libro", " σ manual", "  Δ vs SAFE");
for (const f of filas) {
  console.log(f.id.padEnd(46),
    f.smax.toFixed(2).padStart(8),
    (f.sSafe ?? "—").toString().padStart(11),
    (f.sMan ?? "—").toString().padStart(9),
    (f.dSafe == null ? "—" : (f.dSafe>=0?"+":"") + f.dSafe.toFixed(1) + "%").padStart(11),
    Math.abs(f.dSafe ?? 0) <= 8 ? "  OK" : "  ⚠️");
}
