#!/usr/bin/env node
/**
 * Un EJEMPLO del workspace contra lo que ETABS/SAP2000 resolvieron de su .e2k/.s2k.
 *
 *   node cli/ejemplo_vs_csi.mjs <id> <json-de-plantillas_etabs|sap2000> [clave=valor ...]
 *
 * Construye el ExampleDef con sus parametros (los mismos `clave=valor` que se dieron a
 * `exportar_csi.mjs`), casa los nudos por COORDENADAS (0.1 mm) con los joints del JSON
 * (`puntos` + `disp_nudos`) y compara, contra el maximo del modelo: desplazamientos del
 * caso Dead/DEAD, suma de reacciones y periodos (por participacion, si el JSON los trae).
 */
import { readFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const [id, jsonPath, ...kv] = process.argv.slice(2);
if (!id || !jsonPath) { console.error("uso: node cli/ejemplo_vs_csi.mjs <id> <json> [k=v ...]"); process.exit(2); }
const over = {};
for (const a of kv) { const m = a.match(/^([A-Za-z_]\w*)=(.+)$/); if (m && !isNaN(+m[2])) over[m[1]] = +m[2]; }

const mod = await empaquetar(`
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
const { modalAnalysis } = await import("${R}/hekatan-fem/src/index");
export function construir(id, over) {
  const ex = examplesRegistry.find(e => e.id === id); if (!ex) throw new Error("no existe " + id);
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default; Object.assign(p, over);
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  let T = [];
  try { const m = modalAnalysis(st.nodes.val, st.elements.val, st.nodeInputs.val, st.elementInputs.val, 6); T = (m.frequencies || []).map(f => 1 / f); } catch (e) { T = ["modal: " + (e?.message || e)]; }
  return { nodes: st.nodes.val, elements: st.elements.val, U: st.deformOutputs.val?.deformations, Rq: st.deformOutputs.val?.reactions, T,
           nodeInputs: st.nodeInputs.val, elementInputs: st.elementInputs.val };
}`, "ejemplo-vs-csi");

const H = mod.construir(id, over);
// Modal con los DEFAULTS de masa de ETABS (solo masa lateral, INCLUDEVERTICALMASS "No"): el
// camino de subespacio del WASM (`lateral = 1`), el mismo que las plantillas cierran al cuarto
// decimal. Con masa completa (arriba, `T`) salen ademas los modos verticales de losa, que ETABS
// no tiene por defecto y por eso "no emparejaban" (8-sep-2026).
let T_lat = [];
try {
  const { modal } = await import("../tests/lib/wasm.mjs");
  const f = await modal(H.nodes, H.elements, H.nodeInputs, H.elementInputs, 6, 1);   // devuelve las frecuencias
  T_lat = (f || []).map((v) => 1 / v);
} catch (e) { T_lat = ["modal lateral: " + (e?.message || e)]; }
const J = JSON.parse(readFileSync(jsonPath, "utf-8"));
const k4 = (x, y, z) => [x, y, z].map(v => (Math.round(v * 1e4) / 1e4).toFixed(4)).join(",");
const porCoord = new Map();
for (const p of J.puntos || []) porCoord.set(k4(p.x, p.y, p.z), String(p.n));
const dispE = J.disp_nudos || {};
let umax = 0; for (const [, u] of H.U) umax = Math.max(umax, ...u.slice(0, 3).map(Math.abs));
let peor = 0, peorN = -1, n = 0, sinPareja = 0, dentro = 0;
const enBarra = new Set(), enShell = new Set();
for (const el of H.elements) (el.length === 2 ? enBarra : enShell).forEach ? null : null;
for (const el of H.elements) for (const nd of el) (el.length === 2 ? enBarra : enShell).add(nd);
const peores = [];
for (let i = 0; i < H.nodes.length; i++) {
  const nm = porCoord.get(k4(...H.nodes[i]));
  const e = nm !== undefined ? dispE[nm] : undefined;
  if (!e) { sinPareja++; continue; }
  const ue = Array.isArray(e) ? e : [e.ux ?? e.u1 ?? 0, e.uy ?? e.u2 ?? 0, e.uz ?? e.u3 ?? 0];
  const uh = H.U.get(i);
  for (let c = 0; c < 3; c++) { const d = Math.abs(uh[c] - ue[c]) / umax * 100; n++; if (d <= 0.01) dentro++; if (d > peor) { peor = d; peorN = i; } peores.push([d, i, c, uh[c], ue[c]]); }
}
peores.sort((a, b) => b[0] - a[0]);
const tipo = (i) => (enBarra.has(i) && enShell.has(i)) ? "barra+shell" : enBarra.has(i) ? "barra" : enShell.has(i) ? "shell" : "?";
let sumRz = 0; for (const [, r] of H.Rq || []) sumRz += r[2];
const rE = (J.react || []).find(r => /dead/i.test(r.case));
console.log(`${id} ${JSON.stringify(over)} vs ${jsonPath.split(/[\\/]/).pop()}`);
console.log(`  nudos ${H.nodes.length} (sin pareja en CSI: ${sinPareja}) · u_max ${umax.toExponential(4)} m`);
console.log(`  desplazamientos: peor nudo ${peor.toFixed(4)} % del maximo (nudo ${peorN}); ${dentro}/${n} componentes dentro del 0.01 %`);
console.log(`  sumRz Hekatan ${sumRz.toFixed(3)} kN · CSI ${rE ? (+rE.Fz).toFixed(3) : "-"}`);
for (const [d, i, c, a, b] of peores.slice(0, 5)) console.log(`    peor: nudo ${i} (${H.nodes[i].map(v => v.toFixed(2)).join(",")}) ${tipo(i)} u${"xyz"[c]} ${d.toFixed(3)} %  Hek ${a.toExponential(4)}  CSI ${b.toExponential(4)}`);
const soloBarras = peores.filter(q => enBarra.has(q[1]) && !enShell.has(q[1]));
if (soloBarras.length) console.log(`  solo nudos de BARRA (${soloBarras.length / 3}): peor ${soloBarras[0][0].toFixed(4)} %`);
const TE = (J.modal || []).map(m => m.T);
if (TE.length && Array.isArray(H.T) && typeof H.T[0] === "number") {
  console.log("  T Hekatan:", H.T.slice(0, 6).map(t => t.toFixed(4)).join("  "), " (masa completa)");
  console.log("  T Hek.lat:", T_lat.slice(0, 6).map(t => (typeof t === "number" ? t.toFixed(4) : String(t))).join("  "), " (solo masa lateral, como ETABS)");
  console.log("  T CSI    :", TE.slice(0, 6).map(t => (+t).toFixed(4)).join("  "));
} else if (Array.isArray(H.T) && typeof H.T[0] === "string") console.log("  " + H.T[0]);
