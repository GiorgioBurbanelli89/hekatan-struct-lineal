#!/usr/bin/env node
/**
 * compare_drilling.mjs — corre el modelo "2 muros + viga de acople" en el solver
 * C++/WASM de Hekatan (mismo deform.wasm que el workspace) CON viga vs SIN viga,
 * para medir si el drilling acopla el momento de la viga al muro.
 *
 * Métrica (independiente de unidades): rigidez relativa = δ_sin / δ_con.
 *   Si el drilling funciona  → acoplado MÁS rígido (ratio > 1, ~1.33 como ETABS).
 *   Si el drilling NO acopla  → ratio ≈ 1.0 (la viga no aporta nada = bug).
 * También reporta el giro θy (RY=drilling) en el nudo de unión.
 *
 * Uso:  node compare_drilling.mjs
 */
import { readFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

const wasmPath = join(__dirname, "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath   = join(__dirname, "hekatan-fem", "src", "cpp", "built", "deform.js");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

function allocate(data, Ctor, heap) {
  const buf = new Ctor(data);
  const ptr = mod._malloc(buf.length * buf.BYTES_PER_ELEMENT);
  heap.set(buf, ptr / buf.BYTES_PER_ELEMENT);
  return ptr;
}
function processInput(m) {
  const keys = m ? Array.from(m.keys()) : [];
  const values = m ? Array.from(m.values()) : [];
  const keysPtr = allocate(keys, Uint32Array, mod.HEAPU32);
  const valuesPtr = allocate(values, Float64Array, mod.HEAPF64);
  return { keysPtr, valuesPtr, size: keys.length, gc: [keysPtr, valuesPtr] };
}
function runDeform(nodes, elements, nodeInputs, ei, drillScaleMap = null) {
  const gc = [];
  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64); gc.push(nodesPtr);
  const elIdx = elements.flat();
  const elementsPtr = allocate(elIdx, Uint32Array, mod.HEAPU32); gc.push(elementsPtr);
  const elSizes = elements.map(e => e.length);
  const elementSizesPtr = allocate(elSizes, Uint32Array, mod.HEAPU32); gc.push(elementSizesPtr);
  const sK = nodeInputs.supports ? Array.from(nodeInputs.supports.keys()) : [];
  const sV = nodeInputs.supports ? Array.from(nodeInputs.supports.values()).flat().map(b => b ? 1 : 0) : [];
  const sKp = allocate(sK, Uint32Array, mod.HEAPU32); gc.push(sKp);
  const sVp = allocate(sV, Uint8Array, mod.HEAPU8); gc.push(sVp);
  const lK = nodeInputs.loads ? Array.from(nodeInputs.loads.keys()) : [];
  const lV = nodeInputs.loads ? Array.from(nodeInputs.loads.values()).flat() : [];
  const lKp = allocate(lK, Uint32Array, mod.HEAPU32); gc.push(lKp);
  const lVp = allocate(lV, Float64Array, mod.HEAPF64); gc.push(lVp);
  const E = processInput(ei.elasticities); gc.push(...E.gc);
  const A = processInput(ei.areas); gc.push(...A.gc);
  const Iz = processInput(ei.momentsOfInertiaZ); gc.push(...Iz.gc);
  const Iy = processInput(ei.momentsOfInertiaY); gc.push(...Iy.gc);
  const G = processInput(ei.shearModuli); gc.push(...G.gc);
  const J = processInput(ei.torsionalConstants); gc.push(...J.gc);
  const thick = processInput(ei.thicknesses || new Map()); gc.push(...thick.gc);
  const poiss = processInput(ei.poissonsRatios || new Map()); gc.push(...poiss.gc);
  const eOrtho = processInput(new Map()); gc.push(...eOrtho.gc);
  // firma actual (deformCpp.ts): + shearAreasY/Z, springs, plateForm, drillType, drillScale, rigidOffset
  const saY = processInput(new Map()); gc.push(...saY.gc);
  const saZ = processInput(new Map()); gc.push(...saZ.gc);
  const springsPtr = allocate([0], Float64Array, mod.HEAPF64); gc.push(springsPtr);
  const pf = processInput(new Map()); gc.push(...pf.gc);             // plateFormulations (default C++)
  const dt = processInput(new Map()); gc.push(...dt.gc);             // drillingTypes (default 2 = HB)
  const ds = processInput(drillScaleMap || new Map()); gc.push(...ds.gc);  // drillingPenaltyScales (default 1.0)
  const ro = processInput(new Map()); gc.push(...ro.gc);             // rigidOffsets
  const dPo = mod._malloc(4); gc.push(dPo);
  const dSo = mod._malloc(4); gc.push(dSo);
  const rPo = mod._malloc(4); gc.push(rPo);
  const rSo = mod._malloc(4); gc.push(rSo);
  mod._deform(
    nodesPtr, nodes.length, elementsPtr, elIdx.length, elementSizesPtr, elements.length,
    sKp, sVp, sK.length, lKp, lVp, lK.length,
    E.keysPtr, E.valuesPtr, E.size, A.keysPtr, A.valuesPtr, A.size,
    Iz.keysPtr, Iz.valuesPtr, Iz.size, Iy.keysPtr, Iy.valuesPtr, Iy.size,
    G.keysPtr, G.valuesPtr, G.size, J.keysPtr, J.valuesPtr, J.size,
    thick.keysPtr, thick.valuesPtr, thick.size, poiss.keysPtr, poiss.valuesPtr, poiss.size,
    eOrtho.keysPtr, eOrtho.valuesPtr, eOrtho.size,
    saY.keysPtr, saY.valuesPtr, saY.size, saZ.keysPtr, saZ.valuesPtr, saZ.size,
    springsPtr, 0,
    pf.keysPtr, pf.valuesPtr, pf.size,
    dt.keysPtr, dt.valuesPtr, dt.size,
    ds.keysPtr, ds.valuesPtr, ds.size,
    ro.keysPtr, ro.valuesPtr, ro.size,
    dPo, dSo, rPo, rSo
  );
  const dPtr = mod.HEAPU32[dPo / 4], dSize = mod.HEAPU32[dSo / 4];
  const deformations = new Map();
  if (dSize > 0 && dPtr) {
    const flat = new Float64Array(mod.HEAPF64.buffer, dPtr, dSize);
    for (let i = 0; i < dSize; i += 7) deformations.set(flat[i], Array.from(flat.slice(i + 1, i + 7)));
    gc.push(dPtr);
  }
  gc.forEach(p => mod._free(p));
  return { deformations };
}

// ── modelo común (SI: m, kN) — IGUAL al de drillingDof.ts y al ETABS ──
const W = 2.0, H = 4.0, gap = 1.5, t = 0.25, bH = 0.8;
const E = 24850e3, nu = 0.20, FtopNode = 50; // kN por nudo superior
const nx = 2, nz = 4, nb = 3;                // malla (chica para igualar ETABS)
const dxL = W / nx, dz = H / nz, x0R = W + gap;

function buildModel(withBeam) {
  const nodes = [], idx = new Map();
  const add = (x, z) => { const k = `${x.toFixed(4)},${z.toFixed(4)}`; let id = idx.get(k); if (id === undefined) { id = nodes.length; nodes.push([x, 0, z]); idx.set(k, id); } return id; };
  const elements = [];
  function pier(x0) { const g = []; for (let k = 0; k <= nz; k++) { const r = []; for (let i = 0; i <= nx; i++) r.push(add(x0 + i * dxL, k * dz)); g.push(r); } for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) elements.push([g[k][i], g[k][i + 1], g[k + 1][i + 1], g[k + 1][i]]); return g; }
  const gL = pier(0), gR = pier(x0R);
  const beamStart = elements.length;
  if (withBeam) {
    const nL = gL[nz][nx], nR = gR[nz][0], chain = [nL];
    for (let i = 1; i < nb; i++) chain.push(add(W + gap * i / nb, H));
    chain.push(nR);
    for (let i = 0; i < nb; i++) elements.push([chain[i], chain[i + 1]]);
  }
  const supports = new Map();
  for (let i = 0; i <= nx; i++) { supports.set(gL[0][i], [1,1,1,1,1,1].map(Boolean)); supports.set(gR[0][i], [1,1,1,1,1,1].map(Boolean)); }
  const loads = new Map();
  for (const g of [gL, gR]) for (let i = 0; i <= nx; i++) { const id = g[nz][i]; const c = loads.get(id) || [0,0,0,0,0,0]; c[0] += FtopNode; loads.set(id, c); }
  const thicknesses = new Map(), elasticities = new Map(), poissons = new Map();
  const areas = new Map(), Iy = new Map(), Iz = new Map(), J = new Map(), Gm = new Map();
  for (let e = 0; e < beamStart; e++) { thicknesses.set(e, t); elasticities.set(e, E); poissons.set(e, nu); }
  const b = t, h = bH, Gv = E / (2 * (1 + nu));
  for (let e = beamStart; e < elements.length; e++) {
    areas.set(e, b * h); Iy.set(e, b * h ** 3 / 12); Iz.set(e, h * b ** 3 / 12);
    J.set(e, b * h ** 3 / 12 + h * b ** 3 / 12); elasticities.set(e, E); Gm.set(e, Gv);
  }
  return {
    nodes, elements,
    nodeInputs: { supports, loads },
    elementInputs: { thicknesses, elasticities, poissonsRatios: poissons, areas, momentsOfInertiaY: Iy, momentsOfInertiaZ: Iz, torsionalConstants: J, shearModuli: Gm },
    joint: gL[nz][nx], topL: gL[nz][0], nShells: beamStart,
  };
}

function topUX(model, scale = null) {
  // scale: aplica drillingPenaltyScale a TODOS los shells (elementos < beamStart)
  let dsMap = null;
  if (scale !== null) { dsMap = new Map(); for (let e = 0; e < model.nShells; e++) dsMap.set(e, scale); }
  const r = runDeform(model.nodes, model.elements, model.nodeInputs, model.elementInputs, dsMap);
  const dTop = r.deformations.get(model.topL) || [0,0,0,0,0,0];
  const dJoint = r.deformations.get(model.joint) || [0,0,0,0,0,0];
  return { ux: dTop[0], ry: dJoint[4] };  // ux global X ; ry = θy global (drilling para muro X-Z)
}

console.log("=== HEKATAN (C++/WASM) — muro acoplado, drilling default (HB, scale=1.0) ===");
console.log(`    2 machones ${W}x${H}m malla ${nx}x${nz}, abertura ${gap}m, viga ${t}x${bH}m, carga ${FtopNode}kN/nudo\n`);
const con = topUX(buildModel(true));
const sin = topUX(buildModel(false));
console.log(`[CON viga de acople] δ_top = ${(con.ux*1000).toFixed(4)} mm   θy(unión) = ${con.ry.toExponential(3)} rad`);
console.log(`[SIN viga de acople] δ_top = ${(sin.ux*1000).toFixed(4)} mm   θy(unión) = ${sin.ry.toExponential(3)} rad`);
console.log(`\n=== EFECTO DE LA VIGA (vía drilling) en Hekatan ===`);
console.log(`    rigidez relativa  δ_sin/δ_con = ${(sin.ux/con.ux).toFixed(3)}x`);
console.log(`    (ETABS dio 1.33x — si Hekatan ≈1.0 el drilling NO acopla el frame)`);

console.log(`\n=== SENSIBILIDAD AL drillScale (con viga) vs ETABS (θy=-8.30e-5, δ=0.6547mm) ===`);
const mCon = buildModel(true);
for (const s of [0.26, 0.5, 1.0, 2.0, 4.0]) {
  const r = topUX(mCon, s);
  console.log(`    scale=${s.toFixed(2)}·G·t:  δ_top=${(r.ux*1000).toFixed(4)} mm   θy(unión)=${r.ry.toExponential(3)} rad`);
}
