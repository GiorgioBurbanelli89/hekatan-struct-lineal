#!/usr/bin/env node
/**
 * El registro de ejemplos, sin navegador: id · categoría · nombre · cómo corre.
 *
 *   node cli/lista_registro.mjs              todos
 *   node cli/lista_registro.mjs --embebidos  solo los que todavía van en un marco
 *   node cli/lista_registro.mjs --medir      además construye cada uno y cuenta sus elementos
 *
 * «embebido» = trae `standaloneUrl`: no corre dentro del workspace, se ve en un marco.
 */
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const args = process.argv.slice(2);
const SOLO = args.includes("--embebidos");
const MEDIR = args.includes("--medir");
// El registro arrastra módulos que tocan `window` y `document` al cargarse: en Node se les da
// un sustituto vacío, el mismo de `tests/casos/categorias_arbol.mjs`.
const { examplesRegistry } = await empaquetar(`
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
const m = await import("${R}/examples/src/workspace/exampleRegistry");
export const examplesRegistry = m.examplesRegistry;
`, "registro");

const st = () => ({ val: undefined, rawVal: undefined });
let nEmb = 0, nIn = 0;
for (const ex of examplesRegistry) {
  const emb = !!ex.standaloneUrl;
  if (emb) nEmb++; else nIn++;
  if (SOLO && !emb) continue;
  let medida = "";
  if (MEDIR && !emb && typeof ex.build === "function") {
    try {
      const p = Object.fromEntries(Object.entries(ex.params ?? {}).map(([k, d]) => [k, d.default]));
      const s = { nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(), deformOutputs: st(), analyzeOutputs: st(), objects3D: st() };
      const log = console.log, warn = console.warn; console.log = () => {}; console.warn = () => {};
      try { ex.build(p, s); } finally { console.log = log; console.warn = warn; }
      const e = s.elements.val ?? [];
      const c = (n) => e.filter((x) => x.length === n).length;
      medida = `  ${(s.nodes.val ?? []).length} nudos · ${c(2)} barras · ${c(3) + c(4)} cáscaras · ${c(8)} sólidos`;
    } catch (err) { medida = `  build falló: ${String(err?.message ?? err).slice(0, 60)}`; }
  }
  console.log(`${emb ? "EMBEBIDO" : "workspace"}  ${ex.id.padEnd(34)} ${String(ex.category).padEnd(34)} ${ex.name}${medida}`);
}
console.log(`\n${examplesRegistry.length} ejemplos: ${nIn} dentro del workspace, ${nEmb} embebidos en un marco`);
process.exit(0);
