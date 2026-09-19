#!/usr/bin/env node
/**
 * Un .heks a los textos de CSI (.e2k, .s2k y .f2k) por el MISMO camino que la app (cliModeler +
 * exportE2k/exportS2k), sin navegador. Cargas en modo manual (nodales, sin peso propio de CSI).
 *   node cli/heks_a_csi.mjs modelo.heks salida-sin-extension [cftas=general] [meshtype=NONE] [patrones=1]
 * `patrones=1`: s2k y f2k con TODOS los patrones, combinaciones (`combo`), peso propio calculado por CSI,
 * muelle de AREA (con «Compression Only» si el .heks dice `compresion`), losa Mat/Footing y Stiff, y
 * ademas `salida_SAFE20.f2k` (nombres de campo de SAFE 20; el .f2k normal va con los de SAFE 22).
 * `meshtype=X` reemplaza OBJMESHTYPE de todas las areas del e2k (p.ej. NONE para que ETABS
 * no remalle los panos).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const [heks, salida, ...kv] = process.argv.slice(2);
if (!heks || !salida) { console.error("uso: node cli/heks_a_csi.mjs modelo.heks salida [cftas=general] [meshtype=NONE]"); process.exit(2); }
const opt = Object.fromEntries(kv.map(a => a.split("=")));
const mod = await empaquetar(`
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { cliModeler } = await import("${R}/examples/src/cli-modeler/cliModeler");
const { exportE2k } = await import("${R}/examples/src/shared/e2kExporter");
const { exportS2k } = await import("${R}/examples/src/shared/s2kExporter");
const { exportF2k } = await import("${R}/examples/src/shared/f2kExporter");
export function desdeHeks(texto, cftAs, patrones) {
  const st = (v) => ({ val: v });
  const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  globalThis.window = { __hekatanCliScript: texto };   // como tests/lib/heks.mjs
  cliModeler.build({}, states);
  const comun = { nodes: states.nodes.val, elements: states.elements.val, nodeInputs: states.nodeInputs.val, elementInputs: states.elementInputs.val, title: "Hekatan heks" };
  return { e2k: exportE2k({ ...comun, weightMode: "manual" }), s2k: exportS2k({ ...comun, selfWtMult: 0, cftAs, patrones }),
           f2k: exportF2k({ ...comun, patrones, versionSafe: 22 }), f2k20: patrones ? exportF2k({ ...comun, patrones, versionSafe: 20 }) : null,
           n: states.nodes.val.length, e: states.elements.val.length };
}`, "heks-a-csi");
const texto = readFileSync(heks, "utf-8");
const r = mod.desdeHeks(texto, opt.cftas === "general" ? "general" : "sd", opt.patrones === "1");
let e2k = r.e2k;
if (opt.meshtype) e2k = e2k.replace(/OBJMESHTYPE "[A-Z]+"/g, `OBJMESHTYPE "${opt.meshtype}"`).replace(/(AREAASSIGN\s+"[^"]+"\s+"[^"]+"(?![^\n]*OBJMESHTYPE)[^\n]*)/g, `$1  OBJMESHTYPE "${opt.meshtype}"`);
writeFileSync(salida + ".e2k", e2k, "utf-8"); writeFileSync(salida + ".s2k", r.s2k, "utf-8"); writeFileSync(salida + ".f2k", r.f2k, "utf-8");
if (r.f2k20) writeFileSync(salida + "_SAFE20.f2k", r.f2k20, "utf-8");
console.log(`${heks}: ${r.n} nudos, ${r.e} elementos -> ${salida}.e2k + .s2k + .f2k${opt.meshtype ? " (OBJMESHTYPE " + opt.meshtype + ")" : ""}`);
