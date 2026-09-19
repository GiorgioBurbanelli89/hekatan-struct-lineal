#!/usr/bin/env node
/**
 * UN caso del barrido de Test M — Dual, FIEL a examples/src/test-m/testM.ts.
 * Mide por separado las 3 fases que corren cuando el usuario aprieta "Modal":
 *   1) build+deform en malla de DISPLAY (p.ms, default 0.75)  ← lo que ya está en pantalla
 *   2) build+deform en malla del MODAL   (ms=1.0 si método 3) ← runModalEdificio → buildEdificio
 *   3) _modal (Eigen C++ + Guyan, lateralMass=1)
 *   4) deform extra de las DERIVAS (necLineas/dynLines)
 *
 * Uso:  node sweep_case.mjs <nbx> <nby> <nFloors> [msDisplay] [nModes]
 * Salida: una línea JSON.
 */
import { readFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.js");
const wasmPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

function allocate(data, Ctor, heap) {
  const buf = new Ctor(data);
  const ptr = mod._malloc(buf.length * buf.BYTES_PER_ELEMENT);
  heap.set(buf, ptr / buf.BYTES_PER_ELEMENT);
  return ptr;
}
const P = (gc, m) => {
  const keys = m ? Array.from(m.keys()) : [], vals = m ? Array.from(m.values()) : [];
  const kp = allocate(keys, Uint32Array, mod.HEAPU32); gc.push(kp);
  const vp = allocate(vals, Float64Array, mod.HEAPF64); gc.push(vp);
  return { kp, vp, size: keys.length };
};
const Pi = (gc, m) => {
  const keys = m ? Array.from(m.keys()) : [], vals = m ? Array.from(m.values()) : [];
  const kp = allocate(keys, Uint32Array, mod.HEAPU32); gc.push(kp);
  const vp = allocate(vals, Uint32Array, mod.HEAPU32); gc.push(vp);
  return { kp, vp, size: keys.length };
};

function deform(nodes, elements, ni, ei) {
  const gc = [];
  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64); gc.push(nodesPtr);
  const elIdx = elements.flat();
  const elementsPtr = allocate(elIdx, Uint32Array, mod.HEAPU32); gc.push(elementsPtr);
  const elSizesPtr = allocate(elements.map(e => e.length), Uint32Array, mod.HEAPU32); gc.push(elSizesPtr);
  const sK = ni.supports ? Array.from(ni.supports.keys()) : [];
  const sV = ni.supports ? Array.from(ni.supports.values()).flat().map(b => b ? 1 : 0) : [];
  const sKp = allocate(sK, Uint32Array, mod.HEAPU32); gc.push(sKp);
  const sVp = allocate(sV, Uint8Array, mod.HEAPU8); gc.push(sVp);
  const lK = ni.loads ? Array.from(ni.loads.keys()) : [];
  const lV = ni.loads ? Array.from(ni.loads.values()).flat() : [];
  const lKp = allocate(lK, Uint32Array, mod.HEAPU32); gc.push(lKp);
  const lVp = allocate(lV, Float64Array, mod.HEAPF64); gc.push(lVp);
  const elast = P(gc, ei.elasticities), areas = P(gc, ei.areas), moiZ = P(gc, ei.momentsOfInertiaZ),
    moiY = P(gc, ei.momentsOfInertiaY), shear = P(gc, ei.shearModuli), tors = P(gc, ei.torsionalConstants),
    thick = P(gc, ei.thicknesses), pois = P(gc, ei.poissonsRatios), eOrt = P(gc, undefined),
    sAy = P(gc, ei.shearAreasY), sAz = P(gc, ei.shearAreasZ);
  const springsPtr = allocate([0], Float64Array, mod.HEAPF64); gc.push(springsPtr);
  const pf = Pi(gc, ei.plateFormulations), dt = Pi(gc, ei.drillingTypes), ds = P(gc, undefined);
  const O = () => { const p = mod._malloc(4); gc.push(p); return p; };
  const dPtrO = O(), dSzO = O(), rPtrO = O(), rSzO = O();
  mod._deform(
    nodesPtr, nodes.length, elementsPtr, elIdx.length, elSizesPtr, elements.length,
    sKp, sVp, sK.length, lKp, lVp, lK.length,
    elast.kp, elast.vp, elast.size, areas.kp, areas.vp, areas.size,
    moiZ.kp, moiZ.vp, moiZ.size, moiY.kp, moiY.vp, moiY.size,
    shear.kp, shear.vp, shear.size, tors.kp, tors.vp, tors.size,
    thick.kp, thick.vp, thick.size, pois.kp, pois.vp, pois.size,
    eOrt.kp, eOrt.vp, eOrt.size, sAy.kp, sAy.vp, sAy.size, sAz.kp, sAz.vp, sAz.size,
    springsPtr, 0, pf.kp, pf.vp, pf.size, dt.kp, dt.vp, dt.size, ds.kp, ds.vp, ds.size,
    dPtrO, dSzO, rPtrO, rSzO
  );
  const dPtr = mod.HEAPU32[dPtrO / 4], dSz = mod.HEAPU32[dSzO / 4];
  const rPtr = mod.HEAPU32[rPtrO / 4];
  const deformations = new Map();
  if (dPtr && dSz) {
    const f = new Float64Array(mod.HEAPF64.buffer, dPtr, dSz);
    for (let i = 0; i < dSz; i += 7) deformations.set(f[i], Array.from(f.slice(i + 1, i + 7)));
    gc.push(dPtr);
  }
  if (rPtr) gc.push(rPtr);
  gc.forEach(p => mod._free(p));
  return { deformations };
}

function modalAnalysis(nodes, elements, ni, ei, numModes, lateralMass) {
  const gc = [];
  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64); gc.push(nodesPtr);
  const elIdx = elements.flat();
  const elementsPtr = allocate(elIdx, Uint32Array, mod.HEAPU32); gc.push(elementsPtr);
  const elSizesPtr = allocate(elements.map(e => e.length), Uint32Array, mod.HEAPU32); gc.push(elSizesPtr);
  const sK = ni.supports ? Array.from(ni.supports.keys()) : [];
  const sV = ni.supports ? Array.from(ni.supports.values()).flat().map(b => b ? 1 : 0) : [];
  const sKp = allocate(sK, Uint32Array, mod.HEAPU32); gc.push(sKp);
  const sVp = allocate(sV, Uint8Array, mod.HEAPU8); gc.push(sVp);
  const elast = P(gc, ei.elasticities), areas = P(gc, ei.areas), moiZ = P(gc, ei.momentsOfInertiaZ),
    moiY = P(gc, ei.momentsOfInertiaY), shear = P(gc, ei.shearModuli), tors = P(gc, ei.torsionalConstants),
    dens = P(gc, ei.densities), thick = P(gc, ei.thicknesses), pois = P(gc, ei.poissonsRatios),
    memMod = P(gc, undefined), bendMod = P(gc, undefined);
  const pf = Pi(gc, ei.plateFormulations);
  const O = () => { const p = mod._malloc(4); gc.push(p); return p; };
  const freqO = O(), nFreqO = O(), modO = O(), modRO = O(), modCO = O(), massO = O(), massRO = O(), massCO = O();
  mod._modal(
    nodesPtr, nodes.length, elementsPtr, elIdx.length, elSizesPtr, elements.length,
    sKp, sVp, sK.length,
    elast.kp, elast.vp, elast.size, areas.kp, areas.vp, areas.size,
    moiZ.kp, moiZ.vp, moiZ.size, moiY.kp, moiY.vp, moiY.size,
    shear.kp, shear.vp, shear.size, tors.kp, tors.vp, tors.size, dens.kp, dens.vp, dens.size,
    thick.kp, thick.vp, thick.size, pois.kp, pois.vp, pois.size,
    memMod.kp, memMod.vp, memMod.size, bendMod.kp, bendMod.vp, bendMod.size,
    pf.kp, pf.vp, pf.size,
    numModes, lateralMass,
    freqO, nFreqO, modO, modRO, modCO, massO, massRO, massCO
  );
  const freqPtr = mod.HEAPU32[freqO / 4], nFreq = mod.HEAPU32[nFreqO / 4];
  const massPtr = mod.HEAPU32[massO / 4], massR = mod.HEAPU32[massRO / 4], massC = mod.HEAPU32[massCO / 4];
  let frequencies = [], massPart = [];
  if (nFreq > 0 && freqPtr) { frequencies = Array.from(new Float64Array(mod.HEAPF64.buffer, freqPtr, nFreq)); gc.push(freqPtr); }
  if (massR > 0 && massC > 0 && massPtr) {
    const f = new Float64Array(mod.HEAPF64.buffer, massPtr, massR * massC);
    for (let i = 0; i < massR; i++) massPart.push(Array.from(f.slice(i * massC, (i + 1) * massC)));
    gc.push(massPtr);
  }
  gc.forEach(p => mod._free(p));
  return { frequencies, massParticipation: massPart };
}

// ────────── buildEdificio, copia fiel de testM.ts ──────────
const E = 2534564, NU = 0.20, RHO = 2.40277, G = E / (2 * (1 + NU)), GRAV = 9.80665;
const MAXB = 6, MAXWALLS = 6;

function dynWallDefaults(p) {
  const nW = Math.max(0, Math.min((p.nWalls ?? 1) | 0, MAXWALLS));
  const nbxD = p.nbx | 0, nbyD = p.nby | 0;
  const walls = [];
  for (let k = 1; k <= nW; k++) {
    const dirD = k === 1 ? 0 : (k % 2 === 1 ? 0 : 1);
    const lineMaxD = dirD === 0 ? nbxD : nbyD;
    const lineD = k === 1 ? 0 : (Math.floor((k - 1) / 2) % 2 === 0 ? 0 : lineMaxD);
    const spanD = k === 1 ? 1 : (dirD === 0 ? nbyD : nbxD);
    walls.push({ dir: dirD, line: lineD, start: 0, span: Math.max(1, spanD), off: 0, extra: 0 });
  }
  return walls;
}

function coordsFrom(p) {
  const nbx = p.nbx | 0, nby = p.nby | 0, nF = p.nFloors | 0;
  const svx = Array.from({ length: nbx }, () => 5);
  const svy = Array.from({ length: nby }, () => 5);
  const sp = Array.from({ length: nF }, () => 3);
  const cum = a => a.reduce((acc, v) => (acc.push(acc[acc.length - 1] + v), acc), [0]);
  return { nbx, nby, nF, xC: cum(svx), yC: cum(svy), zC: cum(sp) };
}

function buildEdificio(p, sys) {
  const { bCol, bBeam, hBeam, tSlab, tWall, ms, q } = p;
  const { nbx, nby, nF, xC, yC, zC } = coordsFrom(p);
  const nodes = []; const key = new Map();
  const nid = (x, y, z) => {
    const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    let i = key.get(k); if (i === undefined) { i = nodes.length; nodes.push([x, y, z]); key.set(k, i); } return i;
  };
  const elements = []; const kinds = [];
  for (let i = 0; i <= nbx; i++) for (let j = 0; j <= nby; j++)
    for (let f = 0; f < nF; f++) { elements.push([nid(xC[i], yC[j], zC[f]), nid(xC[i], yC[j], zC[f + 1])]); kinds.push("col"); }
  const meshLine = c => { const out = [c[0]]; for (let i = 0; i < c.length - 1; i++) { const n = Math.max(1, Math.round((c[i + 1] - c[i]) / ms)); for (let s = 1; s <= n; s++) out.push(c[i] + (c[i + 1] - c[i]) * s / n); } return out; };
  const xm = meshLine(xC), ym = meshLine(yC);
  const bxm = sys.slab ? xm : xC, bym = sys.slab ? ym : yC;
  for (let f = 1; f <= nF; f++) {
    const z = zC[f];
    for (let i = 0; i <= nbx; i++) for (let j = 0; j < bym.length - 1; j++) { elements.push([nid(xC[i], bym[j], z), nid(xC[i], bym[j + 1], z)]); kinds.push("beam"); }
    for (let j = 0; j <= nby; j++) for (let i = 0; i < bxm.length - 1; i++) { elements.push([nid(bxm[i], yC[j], z), nid(bxm[i + 1], yC[j], z)]); kinds.push("beam"); }
  }
  if (sys.slab) {
    for (let f = 1; f <= nF; f++) { const z = zC[f];
      for (let i = 0; i < xm.length - 1; i++) for (let j = 0; j < ym.length - 1; j++) {
        elements.push([nid(xm[i], ym[j], z), nid(xm[i + 1], ym[j], z), nid(xm[i + 1], ym[j + 1], z), nid(xm[i], ym[j + 1], z)]); kinds.push("slab");
      }
    }
  }
  if (sys.walls) {
    const zm = meshLine(zC);
    const clampI = (v, lo, hi) => Math.max(lo, Math.min(v | 0, hi));
    for (const w of dynWallDefaults(p)) {
      const alongY = w.dir === 0;
      const axisC = alongY ? yC : xC;
      const axisMesh = alongY ? ym : xm;
      const axisMax = axisC[axisC.length - 1];
      const lineMax = alongY ? nbx : nby;
      const spanMax = alongY ? nby : nbx;
      const lineCoord = alongY ? xC[clampI(w.line, 0, lineMax)] : yC[clampI(w.line, 0, lineMax)];
      const s0 = clampI(w.start, 0, spanMax - 1);
      const nv = Math.max(1, Math.min(w.span, spanMax - s0));
      let a0 = axisC[s0] + w.off;
      let a1 = axisC[s0 + nv] + w.off + w.extra;
      a0 = Math.max(0, Math.min(a0, axisMax));
      a1 = Math.max(a0 + 0.1, Math.min(a1, axisMax));
      const inRange = axisMesh.filter(c => c > a0 + 1e-6 && c < a1 - 1e-6);
      const axisNodes = [a0, ...inRange, a1];
      const N4 = (s, z) => alongY ? [lineCoord, s, z] : [s, lineCoord, z];
      for (let j = 0; j < axisNodes.length - 1; j++) for (let k = 0; k < zm.length - 1; k++) {
        elements.push([
          nid(...N4(axisNodes[j], zm[k])), nid(...N4(axisNodes[j + 1], zm[k])),
          nid(...N4(axisNodes[j + 1], zm[k + 1])), nid(...N4(axisNodes[j], zm[k + 1])),
        ]); kinds.push("wall");
      }
    }
  }
  const A_c = bCol * bCol, I_c = bCol ** 4 / 12, J_c = 0.141 * bCol ** 4;
  const A_v = bBeam * hBeam, Iy_v = bBeam * hBeam ** 3 / 12, Iz_v = hBeam * bBeam ** 3 / 12, J_v = bBeam * hBeam ** 3 / 12 + hBeam * bBeam ** 3 / 12;
  const M = () => new Map();
  const ei = { elasticities: M(), poissonsRatios: M(), shearModuli: M(), densities: M(), areas: M(),
    momentsOfInertiaY: M(), momentsOfInertiaZ: M(), torsionalConstants: M(), thicknesses: M(),
    plateFormulations: M(), drillingTypes: M(), shearAreasY: M(), shearAreasZ: M() };
  kinds.forEach((k, e) => {
    ei.elasticities.set(e, E); ei.poissonsRatios.set(e, NU); ei.densities.set(e, RHO); ei.shearModuli.set(e, G);
    if (k === "slab" || k === "wall") { ei.thicknesses.set(e, k === "wall" ? tWall : tSlab); ei.plateFormulations.set(e, 0);  /* era 2: el 2 es membrana desde el 19-sep-2026; el 0 es el MITC4 que se calculaba */ ei.drillingTypes.set(e, 2); }
    else if (k === "col") { ei.areas.set(e, A_c); ei.momentsOfInertiaY.set(e, I_c); ei.momentsOfInertiaZ.set(e, I_c); ei.torsionalConstants.set(e, J_c); ei.shearAreasY.set(e, 5/6*A_c); ei.shearAreasZ.set(e, 5/6*A_c); }
    else { ei.areas.set(e, A_v); ei.momentsOfInertiaY.set(e, Iy_v); ei.momentsOfInertiaZ.set(e, Iz_v); ei.torsionalConstants.set(e, J_v); ei.shearAreasY.set(e, 5/6*A_v); ei.shearAreasZ.set(e, 5/6*A_v); }
  });
  const supports = new Map();
  nodes.forEach((pt, i) => { if (Math.abs(pt[2]) < 1e-9) supports.set(i, [true, true, true, true, true, true]); });
  const loads = new Map();
  const addN = (n, fz) => { const c = loads.get(n) ?? [0, 0, 0, 0, 0, 0]; c[2] -= fz; loads.set(n, c); };
  kinds.forEach((k, e) => {
    if (k === "slab" || k === "wall") {
      const pp = elements[e].map(n => nodes[n]);
      const a = Math.hypot(pp[1][0] - pp[0][0], pp[1][1] - pp[0][1]);
      const b = Math.hypot(pp[3][0] - pp[0][0], pp[3][1] - pp[0][1]);
      const wt = RHO * (k === "wall" ? tWall : tSlab) * a * b; for (const n of elements[e]) addN(n, wt / 4);
    } else {
      const L = Math.hypot(...[0, 1, 2].map(d => nodes[elements[e][1]][d] - nodes[elements[e][0]][d]));
      const wt = RHO * (k === "col" ? A_c : A_v) * L; for (const n of elements[e]) addN(n, wt / 2);
    }
  });
  return { nodes, elements, kinds, ei, ni: { supports, loads } };
}


export { buildEdificio, deform, modalAnalysis, mod };
