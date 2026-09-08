/**
 * FUERZAS DE CASCARA joint a joint contra ETABS 22 (AreaForceShell), misma malla.
 *
 * Lo que guarda: que `analyze()` reporte M11/M22/M12 y F11/F22/F12 en los 4 joints de
 * cada cascara como CSI (DKQ en Gauss 2x2 extrapolado; membrana ITW sin burbuja en la
 * recuperacion), con el SIGNO de CSI (M11 > 0 = traccion abajo) y que el valor por nudo
 * (el colormap) sea la media de los joints de los vecinos.
 *
 * Referencia: `validation/modelos/plantillas/etabs/P6_dual.json` y `P4_losa-plana.json`,
 * leidos de ETABS 22 por OAPI el 8-sep-2026 sobre el .e2k de la plantilla (columnas piso a
 * piso, D1 en los ejes, brazos rigidos anulados). Dual: 940 cascaras (900 de losa + 40 de
 * muro), 3760 joints; losa plana: 900 cascaras, 3600 joints. Antes del 8-sep esto daba
 * «invertido 68-103 %»: el signo al reves y el centroide promediado a nudos.
 */
import { readFileSync } from "node:fs";
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "fuerzas-cascara-joints-etabs";
export const descripcion = "M11/M22/M12 y F11/F22/F12 en los 4 joints de cada cascara vs ETABS 22 (dual y losa plana)";

const CAB = `
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function modelo(tipo) {
  const ex = examplesRegistry.find(e => e.id === "plantillas");
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default; p.tipo = tipo;
  const estado = (ini) => { let v = ini; return { get val(){ return v; }, set val(x){ v = x; }, get rawVal(){ return v; }, set rawVal(x){ v = x; } }; };
  const st = { nodes: estado([]), elements: estado([]), nodeInputs: estado({}), elementInputs: estado({}), deformOutputs: estado({}), analyzeOutputs: estado({}), objects3D: estado([]) };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  return st;
}`;

function comparar(st, J, campo) {
  const N = st.nodes.val, EL = st.elements.val, a = st.analyzeOutputs.val;
  const porNombre = new Map(J.puntos.map((p) => [p.n, p]));
  const k3 = (x, y, z) => [x, y, z].map((v) => Math.round(v * 1000)).join(",");
  const idx = new Map(); EL.forEach((el, i) => { if (el.length === 4) idx.set(k3(...[0, 1, 2].map((d) => el.reduce((s, n) => s + N[n][d], 0) / 4)), i); });
  const M = campo === "M";
  const hj = M ? [a.bendingXXjoint, a.bendingYYjoint, a.bendingXYjoint] : [a.membraneXXjoint, a.membraneYYjoint, a.membraneXYjoint];
  const col = M ? [4, 5, 6] : [1, 2, 3];
  const nodal = M ? a.bendingXX : a.membraneXX;
  let n = 0, peor = 0, max = 1e-12, peorN = 0; const nudoH = new Map(), nudoE = new Map();
  for (const ar of J.areas || []) {
    const pts = ar.pts.map((p) => porNombre.get(p)).filter(Boolean); if (pts.length !== 4) continue;
    const c = [0, 1, 2].map((d) => pts.reduce((s, p) => s + [p.x, p.y, p.z][d], 0) / 4);
    const i = idx.get(k3(...c)), fe = (J.shells || {})[ar.n]; if (i === undefined || !fe) continue;
    const el = EL[i]; const H = hj.map((m) => m?.get(i)); if (!H[0]) continue;
    for (const v of fe) {
      const p = porNombre.get(v[0]); const pos = el.findIndex((k) => k3(...N[k]) === k3(p.x, p.y, p.z)); if (pos < 0) continue;
      n++;
      for (let q = 0; q < 3; q++) { max = Math.max(max, Math.abs(v[col[q]])); peor = Math.max(peor, Math.abs(v[col[q]] - H[q][pos])); }
      const kn = k3(...N[el[pos]]);
      (nudoH.get(kn) ?? nudoH.set(kn, []).get(kn)).push(nodal.get(i)[pos]);
      (nudoE.get(kn) ?? nudoE.set(kn, []).get(kn)).push(v[col[0]]);
    }
  }
  const media = (l) => l.reduce((s, q) => s + q, 0) / l.length;
  for (const [kn, l] of nudoH) { const e = nudoE.get(kn); if (e) peorN = Math.max(peorN, Math.abs(media(l) - media(e))); }
  return { n, peor: (100 * peor) / max, peorN: (100 * peorN) / max, max };
}

export async function correr() {
  const mod = await empaquetar(CAB, "fuerzas-cascara-joints");
  const lee = (f) => JSON.parse(readFileSync(new URL("../../validation/modelos/plantillas/etabs/" + f, import.meta.url), "utf-8").replace(/\bNaN\b/g, "null"));
  const filas = [];
  for (const [tipo, fichero, nom, campos, nMin] of [[6, "P6_dual.json", "dual (losa + muros)", ["M", "F"], 3700], [4, "P4_losa-plana.json", "losa plana", ["M"], 3500]]) {
    const st = mod.modelo(tipo), J = lee(fichero);
    for (const campo of campos) {
      const r = comparar(st, J, campo);
      const et = campo === "M" ? "M11/M22/M12" : "F11/F22/F12";
      filas.push({ que: `${nom}: ${et} joint a joint vs ETABS`, medido: r.peor, limite: 0.001,
                   ok: r.n >= nMin && r.peor <= 0.001,
                   detalle: `${r.n} joints, peor ${r.peor.toFixed(5)} % del maximo ${r.max.toFixed(3)}` });
      filas.push({ que: `${nom}: ${et.split("/")[0]} por nudo (colormap) vs ETABS`, medido: r.peorN, limite: 0.001,
                   ok: r.n >= nMin && r.peorN <= 0.001, detalle: `peor ${r.peorN.toFixed(5)} %` });
    }
  }
  return filas;
}
