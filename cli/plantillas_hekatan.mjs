#!/usr/bin/env node
/**
 * Las 8 PLANTILLAS resueltas por Hekatan Struct lineal, headless.
 *
 *   node cli/plantillas_hekatan.mjs [salida.json] [clave=valor ...]
 *
 * Para cada tipologia corre el MISMO `build()` que la interfaz (que por dentro
 * llama a `deform` + `analyze`) y luego el modal por `_modal` del WASM, y anota
 * lo que se puede arbitrar contra ETABS abriendo el `.e2k` hermano:
 *
 *   SumFz aplicado - SumR reacciones en la base - Uz minimo (flecha) - T1..T3
 *
 * Es el lado izquierdo de la comparacion. El derecho lo saca
 * `plantillas_etabs.py` con ETABS de verdad, sobre el `.e2k` que exporta
 * `cli/exportar_csi.mjs plantillas ... tipo=N`.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const salida = process.argv[2] || join(__dirname, "..", "validation/modelos/plantillas", "hekatan.json");
const over = Object.fromEntries(process.argv.slice(3).map((a) => {
  const [k, v] = a.split("="); return [k, isNaN(Number(v)) ? v : Number(v)];
}));

const TIPOS = [
  [0, "portico-2d"], [1, "portico-3d"], [2, "portico-losa"], [3, "solo-rejilla"],
  [4, "losa-plana"], [5, "losa-vigas-borde"], [6, "dual"], [7, "arriostrado"],
].filter(([t]) => over.solo === undefined || t === over.solo);   // solo=6: una sola tipologia

const mod0 = await empaquetar(`
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
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");

export function correr(tipo, over) {
  const ex = examplesRegistry.find(e => e.id === "plantillas");
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default;
  p.tipo = tipo; Object.assign(p, over);
  const estado = (ini) => { let v = ini;
    return { get val(){ return v; }, set val(x){ v = x; },
             get rawVal(){ return v; }, set rawVal(x){ v = x; } }; };
  const st = { nodes: estado([]), elements: estado([]), nodeInputs: estado({}),
               elementInputs: estado({}), deformOutputs: estado({}),
               analyzeOutputs: estado({}), objects3D: estado([]) };
  const t0 = Date.now();
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const ms = Date.now() - t0;
  // etabsWallJoint es un booleano, no un Map: se pasa tal cual (antes reventaba con etabsjoint=1)
  const M = m => (m && typeof m.entries === "function") ? [...m.entries()] : (m ?? []);
  const ei = st.elementInputs.val, ni = st.nodeInputs.val;

  let fz = 0; for (const [, v] of (ni.loads ?? [])) fz += v[2] || 0;
  const R6 = [0,0,0,0,0,0];
  for (const [, v] of (st.deformOutputs.val.reactions ?? [])) for (let i=0;i<6;i++) R6[i] += v[i] || 0;
  let uzMin = 0, uzNodo = -1, uxMax = 0, uxNodo = -1;
  for (const [k, v] of (st.deformOutputs.val.deformations ?? [])) {
    if (v[2] < uzMin) { uzMin = v[2]; uzNodo = k; }
    if (Math.abs(v[0]) > Math.abs(uxMax)) { uxMax = v[0]; uxNodo = k; }
  }

  // NUDO a NUDO, indexado por coordenada: es la unica clave que ETABS y
  // Hekatan comparten (los nombres de joint los pone ETABS al importar).
  const k3 = (n) => n.map(v => v.toFixed(3)).join(",");
  const disp = {};
  for (const [k, v] of (st.deformOutputs.val.deformations ?? []))
    if (st.nodes.val[k]) disp[k3(st.nodes.val[k])] = v.slice(0, 6);

  // FUERZAS DE BARRA: de extremo (f = k*u), como las devuelve analyze().
  // La conversion a DIAGRAMA y el signo de M2 se hacen al comparar, no aqui:
  // aqui se guarda lo que el motor produce, sin tocar.
  const a = st.analyzeOutputs.val || {};
  const campos = { N: a.normals, Vy: a.shearsY, Vz: a.shearsZ,
                   T: a.torsions, My: a.bendingsY, Mz: a.bendingsZ };
  const frames = [];
  st.elements.val.forEach((el, i) => {
    if (el.length !== 2) return;
    const reg = { i: st.nodes.val[el[0]], j: st.nodes.val[el[1]] };
    let algo = false;
    for (const [k, m] of Object.entries(campos)) {
      const v = m?.get?.(i);
      if (v) { reg[k] = [v[0], v[1]]; algo = true; }
    }
    if (algo) frames.push(reg);
  });

  // CASCARAS: por elemento, el centroide y los campos nodales que da analyze().
  const shells = [];
  st.elements.val.forEach((el, i) => {
    if (el.length !== 3 && el.length !== 4) return;
    const c = [0, 1, 2].map(d => el.reduce((s, n) => s + st.nodes.val[n][d], 0) / el.length);
    const g = (m) => m?.get?.(i) ?? null;
    // pts: los nudos, para casar joint a joint con AreaForceShell. bXXc: el centroide
    // (media de los 4 joints). bXXj: los 4 joints SIN promediar (lo que lista CSI).
    // bXX: lo que pinta el colormap (media en el nudo de los joints de los vecinos).
    shells.push({ c, n: el.length, pts: el.map(n => st.nodes.val[n]),
      bXX: g(a.bendingXX), bYY: g(a.bendingYY), bXY: g(a.bendingXY),
      bXXc: g(a.bendingXXcentro), bYYc: g(a.bendingYYcentro), bXYc: g(a.bendingXYcentro),
      bXXj: g(a.bendingXXjoint), bYYj: g(a.bendingYYjoint), bXYj: g(a.bendingXYjoint),
      mXX: g(a.membraneXX), mYY: g(a.membraneYY), mXY: g(a.membraneXY) });
  });

  // diaf=1: diafragma rigido por planta (todos los nudos de cada cota > 0), como el
  // D1 que el e2k le asigna a las losas en ETABS (ojo: sin acentos graves aqui, es un template). Sin esto el bench comparaba una losa
  // FLEXIBLE en el plano contra el diafragma rigido de ETABS.
  const zs = [...new Set(st.nodes.val.map(n => Math.round(n[2] * 100) / 100))].sort((a, b) => a - b);
  // sin diaf=1 se pasan los diafragmas de la PROPIA plantilla (parametro diafragma), que es lo que ve el usuario
  const diaphragms = over.diaf ? st.nodes.val.map((n, i) => [i, zs.indexOf(Math.round(n[2] * 100) / 100)]).filter(([, k]) => k > 0) : M(ni.diaphragms);
  return { nodes: st.nodes.val, elements: st.elements.val,
           supports: M(ni.supports), diaphragms,
           ei: Object.fromEntries(Object.entries(ei).map(([k, v]) => [k, M(v)])),
           params: p, ms, fz, R6, uzMin, uzNodo, uxMax, uxNodo,
           disp, frames, shells,
           nNodos: st.nodes.val.length, nElem: st.elements.val.length,
           nBarras: st.elements.val.filter(e => e.length === 2).length,
           nShells: st.elements.val.filter(e => e.length === 3 || e.length === 4).length,
           nApoyos: (ni.supports ? ni.supports.size : 0),
           resuelto: !!(st.deformOutputs.val.deformations) };
}`, "plantillas-hekatan");

// -- WASM para el modal ------------------------------------------------------
const wasmPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.js");
const mod = await (await import(pathToFileURL(jsPath).href)).default({ wasmBinary: readFileSync(wasmPath) });

function modal(d, nModos = 12) {
  const alloc = (a, C, h) => { const b = new C(a); const p = mod._malloc(b.length * b.BYTES_PER_ELEMENT); h.set(b, p / b.BYTES_PER_ELEMENT); return p; };
  const gc = [];
  const P = (e) => { const k = (e || []).map(x => x[0]), v = (e || []).map(x => x[1]);
    const kp = alloc(k, Uint32Array, mod.HEAPU32), vp = alloc(v, Float64Array, mod.HEAPF64); gc.push(kp, vp); return { kp, vp, size: k.length }; };
  const PI = (e) => { const k = (e || []).map(x => x[0]), v = (e || []).map(x => x[1]);
    const kp = alloc(k, Uint32Array, mod.HEAPU32), vp = alloc(v, Uint32Array, mod.HEAPU32); gc.push(kp, vp); return { kp, vp, size: k.length }; };
  const nodes = d.nodes, elements = d.elements, ei = d.ei;
  const nP = alloc(nodes.flat(), Float64Array, mod.HEAPF64); gc.push(nP);
  const eI = elements.flat();
  const eP = alloc(eI, Uint32Array, mod.HEAPU32), eS = alloc(elements.map(e => e.length), Uint32Array, mod.HEAPU32); gc.push(eP, eS);
  const sK = d.supports.map(x => x[0]), sV = d.supports.flatMap(x => x[1].map(b => b ? 1 : 0));
  const sKp = alloc(sK, Uint32Array, mod.HEAPU32), sVp = alloc(sV, Uint8Array, mod.HEAPU8); gc.push(sKp, sVp);
  const el = P(ei.elasticities), ar = P(ei.areas), mz = P(ei.momentsOfInertiaZ), my = P(ei.momentsOfInertiaY),
    sh = P(ei.shearModuli), to = P(ei.torsionalConstants), de = P(ei.densities), th = P(ei.thicknesses),
    po = P(ei.poissonsRatios), mm = P(), bm = P(), pf = PI(ei.plateFormulations), dt = PI(), ds = P(),
    sy = P(ei.shearAreasY), sz = P(ei.shearAreasZ), la = P(), rel = P(), nm = P(), dia = P(d.diaphragms);
  const relVp = alloc([], Uint8Array, mod.HEAPU8); gc.push(relVp);
  const O = () => { const p = mod._malloc(4); gc.push(p); return p; };
  const fo = O(), nfo = O(), moo = O(), mro = O(), mco = O(), mao = O(), maro = O(), maco = O();
  const t = Date.now();
  mod._modal(nP, nodes.length, eP, eI.length, eS, elements.length, sKp, sVp, sK.length,
    el.kp, el.vp, el.size, ar.kp, ar.vp, ar.size, mz.kp, mz.vp, mz.size, my.kp, my.vp, my.size,
    sh.kp, sh.vp, sh.size, to.kp, to.vp, to.size, de.kp, de.vp, de.size,
    th.kp, th.vp, th.size, po.kp, po.vp, po.size, mm.kp, mm.vp, mm.size, bm.kp, bm.vp, bm.size,
    pf.kp, pf.vp, pf.size, dt.kp, dt.vp, dt.size, ds.kp, ds.vp, ds.size,
    sy.kp, sy.vp, sy.size, sz.kp, sz.vp, sz.size, la.kp, la.vp, la.size,
    rel.kp, relVp, 0, nm.kp, nm.vp, nm.size, 1, dia.kp, dia.vp, dia.size,
    alloc([0], Float64Array, mod.HEAPF64), 0, (ei.etabsWallJoint === false ? 0 : 1) /* union viga-muro de ETABS */, nModos, 1, (over.lump ?? 0) /* LUMPATSTORIES: lump=1 */,
    fo, nfo, moo, mro, mco, mao, maro, maco);
  const msModal = Date.now() - t;
  const fp = mod.HEAPU32[fo / 4], nf = mod.HEAPU32[nfo / 4];
  const mp = mod.HEAPU32[mao / 4], mr = mod.HEAPU32[maro / 4], mc = mod.HEAPU32[maco / 4];
  const f = nf > 0 && fp ? Array.from(new Float64Array(mod.HEAPF64.buffer, fp, nf)) : [];
  const part = [];
  if (mr > 0 && mc > 0 && mp) { const a = new Float64Array(mod.HEAPF64.buffer, mp, mr * mc);
    for (let i = 0; i < mr; i++) part.push(Array.from(a.slice(i * mc, (i + 1) * mc))); }
  const T = f.map(v => v > 0 ? 1 / v : 0);
  const suma = (j) => +(part.reduce((s, v) => s + (v[j] || 0), 0) * 100).toFixed(2);
  // `part[i]` = [UX, UY, UZ, RX, RY, RZ] del modo i, en tanto por uno. Se
  // guarda ENTERO: comparar T1 con T1 solo vale si los dos son el MISMO modo, y
  // eso lo dice la participacion, no el numero de orden.
  return { T, msModal, sumUx: suma(0), sumUy: suma(1), sumRz: suma(5), part };
}

const filas = [];
console.log("tipo                 nudos  elem    GDL   SFz[kN]  SRz[kN]   Uz[mm]    T1[s]    T2[s]    T3[s] est(ms) mod(ms)");
console.log("-".repeat(112));
for (const [t, nombre] of TIPOS) {
  const d = mod0.correr(t, over);
  let m = { T: [], msModal: 0, sumUx: 0, sumUy: 0, sumRz: 0 };
  try { m = modal(d, 12); } catch (e) { m.err = String(e?.message || e).slice(0, 80); }
  // La BASCULA: la masa que ensambla el motor, con los MISMOS tres pasos de
  // ETABS (solo lateral, agrupada por piso, de los elementos). Va antes que los
  // modos a proposito: si la masa no cuadra, comparar periodos no informa.
  // `masaEnsamblada` devuelve un array plano: la masa Ux de cada nudo (con masa
  // lumped Ux = Uy = Uz, por eso una sola cifra basta).
  let masa = null, masaErr;
  try {
    const { masaEnsamblada } = await import("../tests/lib/wasm.mjs");
    const aMapa = (pares) => new Map(pares);
    masa = await masaEnsamblada(d.nodes, d.elements, {
      areas: aMapa(d.ei.areas), densities: aMapa(d.ei.densities),
      thicknesses: aMapa(d.ei.thicknesses),
    }, { lateral: 1, lump: 1, incluyeElementos: 1 });
  } catch (e) { masaErr = String(e?.message || e).slice(0, 80); }
  const masaPorNudo = {};
  let masaTotal = 0;
  if (Array.isArray(masa)) {
    const k3 = (n) => n.map((v) => v.toFixed(3)).join(",");
    for (let i = 0; i < d.nodes.length; i++) {
      masaPorNudo[k3(d.nodes[i])] = masa[i];
      masaTotal += masa[i] || 0;
    }
  }

  const fila = { tipo: t, nombre, nNodos: d.nNodos, nElem: d.nElem, nBarras: d.nBarras,
    nShells: d.nShells, nApoyos: d.nApoyos, gdl: d.nNodos * 6, resuelto: d.resuelto,
    fz: d.fz, R6: d.R6, uzMin: d.uzMin, uzNodo: d.uzNodo, uxMax: d.uxMax,
    T: m.T.slice(0, 12), sumUx: m.sumUx, sumUy: m.sumUy, sumRz: m.sumRz,
    part: (m.part || []).slice(0, 12),
    disp: d.disp, frames: d.frames, shells: d.shells,
    masa: masaPorNudo, masaTotal, masaErr,
    msEstatico: d.ms, msModal: m.msModal, params: d.params };
  filas.push(fila);
  const f = (v, n = 4) => (v === undefined || v === null) ? "-" : (+v).toFixed(n);
  console.log(
    `${(t + " " + nombre).padEnd(20)} ${String(d.nNodos).padStart(5)} ${String(d.nElem).padStart(5)} ` +
    `${String(d.nNodos * 6).padStart(6)} ${f(d.fz, 1).padStart(9)} ${f(d.R6[2], 1).padStart(8)} ` +
    `${f(d.uzMin * 1000, 3).padStart(9)} ${f(m.T[0]).padStart(8)} ${f(m.T[1]).padStart(8)} ${f(m.T[2]).padStart(8)} ` +
    `${String(d.ms).padStart(7)} ${String(m.msModal).padStart(7)}`);
}
writeFileSync(salida, JSON.stringify(filas, null, 1));
console.log("\n-> " + salida);
