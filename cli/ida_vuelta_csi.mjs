#!/usr/bin/env node
/**
 * HEKATAN COMO ESTACIÓN DE LA IDA Y VUELTA: lee un .e2k o .s2k con el parser de
 * la app y lo vuelve a escribir con el exportador de la app, en el MISMO formato.
 *
 *   node cli/ida_vuelta_csi.mjs entrada.e2k salida.e2k
 *   node cli/ida_vuelta_csi.mjs entrada.s2k salida.s2k
 *   node cli/ida_vuelta_csi.mjs base-sin-extension        (los dos: base_vuelta.e2k/.s2k)
 *
 * Qué cambió en el camino lo dice cli/comparar_csi_canonico.mjs (por coordenadas).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const [a, b] = process.argv.slice(2);
if (!a) { console.error("uso: node cli/ida_vuelta_csi.mjs entrada.(e2k|s2k) salida.(e2k|s2k)  |  base"); process.exit(2); }

const mod = await empaquetar(`
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
export { parseE2k } from "${R}/examples/src/shared/e2kParser";
export { parseS2k } from "${R}/examples/src/shared/s2kParser";
export { exportE2k } from "${R}/examples/src/shared/e2kExporter";
export { exportS2k } from "${R}/examples/src/shared/s2kExporter";
`, "ida-vuelta-csi");

function pasar(entrada, salida) {
  const esE2k = /\.e2k$|\.\$et$/i.test(entrada);
  const m = (esE2k ? mod.parseE2k : mod.parseS2k)(readFileSync(entrada, "utf-8"));
  const comun = { nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs,
                  elementInputs: m.elementInputs, title: "Hekatan heks" };
  // Sin rawSections: el exportador ESCRIBE el modelo desde los datos leídos, no
  // re-emite el texto de entrada tal cual (eso no probaría nada).
  const txt = esE2k ? mod.exportE2k({ ...comun, weightMode: "manual" }) : mod.exportS2k({ ...comun, selfWtMult: 0 });
  writeFileSync(salida, txt, "utf-8");
  console.log(`${entrada} -> Hekatan (${m.nodes.length} nudos, ${m.elements.length} elementos) -> ${salida}`);
}

if (b) pasar(a, b);
else for (const ext of ["e2k", "s2k"]) if (existsSync(`${a}.${ext}`)) pasar(`${a}.${ext}`, `${a}_vuelta.${ext}`);
