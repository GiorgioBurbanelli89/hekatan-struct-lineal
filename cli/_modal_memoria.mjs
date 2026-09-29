/**
 * ¿De dónde sale el tope de 40 000 GDL del modal? Se corre el modal del dual (la plantilla más
 * pesada) en NODE, sin navegador, subiendo el tamaño, y se anota la memoria del proceso y el tiempo.
 * Si Node revienta en el mismo tamaño que la pestaña, el límite es el WASM (MAXIMUM_MEMORY = 2 GB
 * en build_wasm.sh), no el navegador.
 *   node cli/_modal_memoria.mjs "6,6,4" "6,6,6" "7,7,6" ...
 */
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const FUENTE = `
const g = globalThis; g.window = g;
// Memoria de cada instancia WASM (no cambia el solver: solo mira lo que devuelve instantiate)
g.__memsWasm = [];
for (const k of ["instantiate", "instantiateStreaming"]) {
  const orig = WebAssembly[k]; if (!orig) continue;
  WebAssembly[k] = async (...a) => { const r = await orig.apply(WebAssembly, a);
    const ex = (r.instance ?? r).exports; if (ex?.memory) g.__memsWasm.push(ex.memory); return r; };
}
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
const { plantillas } = await import("${R}/examples/src/plantillas/plantillas");
export { plantillas };
`;
const { plantillas } = await empaquetar(FUENTE, "modal_memoria");
globalThis.__hekatanDofMaxModal = 1e9;   // sin tope: se quiere ver dónde revienta de verdad
const tam = process.argv.slice(2).map((s) => s.split(",").map(Number));
for (const [nx, ny, pisos] of tam) {
  const p = {}; for (const [k, d] of Object.entries(plantillas.params)) p[k] = d.default;
  Object.assign(p, { tipo: 6, nx, ny, pisos, rz: Number(process.env.RZ ?? 0) });
  const estado = (v) => ({ get val() { return v; }, set val(x) { v = x; }, get rawVal() { return v; } });
  const st = { nodes: estado([]), elements: estado([]), nodeInputs: estado({}), elementInputs: estado({}),
    deformOutputs: estado({}), analyzeOutputs: estado({}), objects3D: estado([]) };
  plantillas.build({ ...p, ms: p.msModal, __soloModelo: true }, st, { render() {}, clear() {}, show() {}, hide() {} });
  const nn = st.nodes.val.length;
  let info = "";
  const panel = { render: (out, x) => { info = (x?.properties ?? []).join(" | ").slice(0, 120); } };
  const m0 = process.memoryUsage().rss;
  const t0 = Date.now();
  try { plantillas.runModal({ ...p, ms: p.msModal }, st, panel); } catch (e) { info = "EXCEPCIÓN " + e.message; }
  const m1 = process.memoryUsage().rss;
  console.log(`${nx}x${ny}x${pisos}: ${nn} nudos · ${(6 * nn).toLocaleString()} GDL · ${((Date.now() - t0) / 1000).toFixed(1)} s · memoria del proceso ${(m1 / 2 ** 20).toFixed(0)} MB · WASM ${(globalThis.__memsWasm ?? []).map((m) => (m.buffer.byteLength / 2 ** 20).toFixed(0)).join('+')} MB · PICO ${(process.resourceUsage().maxRSS / 1024).toFixed(0)} MB (antes ${(m0 / 2 ** 20).toFixed(0)}) · ${info}`);
}
