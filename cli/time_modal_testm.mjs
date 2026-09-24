#!/usr/bin/env node
/**
 * Cronómetro del modal WASM (método 3 = lateralMass=1, Guyan) sobre el Test M dual,
 * a distintas mallas. Objetivo: ver si el método 3 corre RÁPIDO a malla fina antes
 * de cambiar el default y redesplegar (la vez pasada el eigen denso se colgaba).
 *
 * Uso:  node time_modal_testm.mjs [ms1 ms2 ...]   (default: 2.5 1.25 1.0 0.75)
 */
import { readFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// ⚠️ `..` a proposito: el WASM es el del PAQUETE, no una copia dentro de cli/.
// Habia una copia duplicada en `cli/hekatan-fem/` (ignorada por git) y el CLI
// cargaba ESA. Hoy 19-ago-2026 daban el mismo binario byte a byte, pero por
// sincronizacion a mano: en cuanto se recompile el paquete y no se copie, el
// CLI resuelve con un motor VIEJO y no avisa. El caso `cli-igual-que-wasm` de
// la suite vigila que no vuelva a pasar.
const wasmPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.js");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

function allocate(data, Ctor, heap) {
  const buf = new Ctor(data);
  const ptr = mod._malloc(buf.length * buf.BYTES_PER_ELEMENT);
  heap.set(buf, ptr / buf.BYTES_PER_ELEMENT);
  return ptr;
}

// Wrapper con la firma ACTUAL de _modal (shells + lateralMass), copiada de modalCpp.ts
function modalAnalysis(nodes, elements, nodeInputs, ei, numModes, lateralMass) {
  const gc = [];
  const nodesPtr = allocate(nodes.flat(), Float64Array, mod.HEAPF64); gc.push(nodesPtr);
  const elIdx = elements.flat();
  const elementsPtr = allocate(elIdx, Uint32Array, mod.HEAPU32); gc.push(elementsPtr);
  const elSizes = elements.map(e => e.length);
  const elSizesPtr = allocate(elSizes, Uint32Array, mod.HEAPU32); gc.push(elSizesPtr);
  const sK = nodeInputs.supports ? Array.from(nodeInputs.supports.keys()) : [];
  const sV = nodeInputs.supports ? Array.from(nodeInputs.supports.values()).flat().map(b => b ? 1 : 0) : [];
  const sKp = allocate(sK, Uint32Array, mod.HEAPU32); gc.push(sKp);
  const sVp = allocate(sV, Uint8Array, mod.HEAPU8); gc.push(sVp);
  const P = (m) => {
    const keys = m ? Array.from(m.keys()) : [], vals = m ? Array.from(m.values()) : [];
    const kp = allocate(keys, Uint32Array, mod.HEAPU32); gc.push(kp);
    const vp = allocate(vals, Float64Array, mod.HEAPF64); gc.push(vp);
    return { kp, vp, size: keys.length };
  };
  const elast = P(ei.elasticities), areas = P(ei.areas), moiZ = P(ei.momentsOfInertiaZ),
    moiY = P(ei.momentsOfInertiaY), shear = P(ei.shearModuli), tors = P(ei.torsionalConstants),
    dens = P(ei.densities), thick = P(ei.thicknesses), pois = P(ei.poissonsRatios),
    memMod = P(ei.membraneModifiers), bendMod = P(ei.bendingModifiers);
  const pfMap = ei.plateFormulations;
  const pfK = pfMap ? Array.from(pfMap.keys()) : [], pfV = pfMap ? Array.from(pfMap.values()) : [];
  const pfKp = allocate(pfK, Uint32Array, mod.HEAPU32); gc.push(pfKp);
  const pfVp = allocate(pfV, Uint32Array, mod.HEAPU32); gc.push(pfVp);
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
    pfKp, pfVp, pfK.length,
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

// ── Test M dual geometry (= testM.ts buildEdificio, sys={slab:true,walls:true}) ──
const E = 2534564, NU = 0.20, RHO = 2.40277, G = E / (2 * (1 + NU)), GRAV = 9.80665;
const xC = [0, 5, 10], yC = [0, 5, 10], zC = [0, 3, 6, 9, 12];
function meshLine(c, ms) { const out = [c[0]]; for (let i = 0; i < c.length - 1; i++) { const n = Math.max(1, Math.round((c[i + 1] - c[i]) / ms)); for (let s = 1; s <= n; s++) out.push(c[i] + (c[i + 1] - c[i]) * s / n); } return out; }

function build(ms) {
  const nodes = [], key = new Map();
  const nid = (x, y, z) => { const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`; let i = key.get(k); if (i === undefined) { i = nodes.length; nodes.push([x, y, z]); key.set(k, i); } return i; };
  const elements = [], kinds = [];
  const nbx = 2, nby = 2, nF = 4;
  for (let i = 0; i <= nbx; i++) for (let j = 0; j <= nby; j++) for (let f = 0; f < nF; f++) { elements.push([nid(xC[i], yC[j], zC[f]), nid(xC[i], yC[j], zC[f + 1])]); kinds.push("col"); }
  const xm = meshLine(xC, ms), ym = meshLine(yC, ms);
  for (let f = 1; f <= nF; f++) { const z = zC[f];
    for (let i = 0; i <= nbx; i++) for (let j = 0; j < ym.length - 1; j++) { elements.push([nid(xC[i], ym[j], z), nid(xC[i], ym[j + 1], z)]); kinds.push("beam"); }
    for (let j = 0; j <= nby; j++) for (let i = 0; i < xm.length - 1; i++) { elements.push([nid(xm[i], yC[j], z), nid(xm[i + 1], yC[j], z)]); kinds.push("beam"); }
  }
  for (let f = 1; f <= nF; f++) { const z = zC[f];
    for (let i = 0; i < xm.length - 1; i++) for (let j = 0; j < ym.length - 1; j++) { elements.push([nid(xm[i], ym[j], z), nid(xm[i + 1], ym[j], z), nid(xm[i + 1], ym[j + 1], z), nid(xm[i], ym[j + 1], z)]); kinds.push("slab"); }
  }
  // muro default: dir0 (x=0), Y[0,5], toda la altura
  const zm = meshLine(zC, ms);
  const ymw = ym.filter(y => y <= 5.0 + 1e-9);
  for (let j = 0; j < ymw.length - 1; j++) for (let k = 0; k < zm.length - 1; k++) {
    elements.push([nid(0, ymw[j], zm[k]), nid(0, ymw[j + 1], zm[k]), nid(0, ymw[j + 1], zm[k + 1]), nid(0, ymw[j], zm[k + 1])]); kinds.push("wall");
  }
  const bCol = 0.40, bBeam = 0.30, hBeam = 0.50, tSlab = 0.20, tWall = 0.25;
  const A_c = bCol * bCol, I_c = bCol ** 4 / 12, J_c = 0.141 * bCol ** 4;
  const A_v = bBeam * hBeam, Iy_v = bBeam * hBeam ** 3 / 12, Iz_v = hBeam * bBeam ** 3 / 12, J_v = bBeam * hBeam ** 3 / 12 + hBeam * bBeam ** 3 / 12;
  const M = () => new Map();
  const ei = { elasticities: M(), poissonsRatios: M(), shearModuli: M(), densities: M(), areas: M(), momentsOfInertiaY: M(), momentsOfInertiaZ: M(), torsionalConstants: M(), thicknesses: M(), plateFormulations: M() };
  kinds.forEach((k, e) => {
    ei.elasticities.set(e, E); ei.poissonsRatios.set(e, NU); ei.densities.set(e, RHO / GRAV); ei.shearModuli.set(e, G);
    if (k === "slab" || k === "wall") { ei.thicknesses.set(e, k === "wall" ? tWall : tSlab); ei.plateFormulations.set(e, 2); }
    else if (k === "col") { ei.areas.set(e, A_c); ei.momentsOfInertiaY.set(e, I_c); ei.momentsOfInertiaZ.set(e, I_c); ei.torsionalConstants.set(e, J_c); }
    else { ei.areas.set(e, A_v); ei.momentsOfInertiaZ.set(e, Iy_v); ei.momentsOfInertiaY.set(e, Iz_v); ei.torsionalConstants.set(e, J_v); }
  });
  const supports = new Map();
  nodes.forEach((p, i) => { if (Math.abs(p[2]) < 1e-9) supports.set(i, [true, true, true, true, true, true]); });
  return { nodes, elements, ei, nodeInputs: { supports }, nSlab: kinds.filter(k => k === "slab").length, nWall: kinds.filter(k => k === "wall").length };
}

const mss = process.argv.slice(2).map(Number);
const list = mss.length ? mss : [2.5, 1.25, 1.0, 0.75];
console.log("Test M dual — modal WASM método 3 (lateralMass=1, Guyan), 12 modos");
// Regla de Jorge (18-sep-2026): la masa participativa se imprime con las SEIS
// sumatorias (SUx SUy SUz SRx SRy SRz). El 90 % se juzga en X e Y, que son las
// direcciones de analisis; las otras cuatro delatan si faltan modos.
console.log("ms(m)  nodos   GDL    T1(s)    T2(s)    T3(s)   tiempo(ms)  |  las SEIS sumatorias (%)");
console.log("-".repeat(70));
for (const ms of list) {
  const m = build(ms);
  const t0 = performance.now();
  const out = modalAnalysis(m.nodes, m.elements, m.nodeInputs, m.ei, 12, 1);
  const dt = performance.now() - t0;
  const T = out.frequencies.map(f => f > 0 ? 1 / f : 0);
  const mp = out.massParticipation;
  const sum = (d) => mp.reduce((s, r) => s + (r[d] || 0), 0) * 100;
  const S6 = ["Ux","Uy","Uz","Rx","Ry","Rz"].map((k, d) => `Σ${k} ${sum(d).toFixed(1)}`).join("  ");
  console.log(`${ms.toFixed(2).padStart(5)} ${String(m.nodes.length).padStart(6)} ${String(m.nodes.length * 6).padStart(6)} ${(T[0] || 0).toFixed(4).padStart(8)} ${(T[1] || 0).toFixed(4).padStart(8)} ${(T[2] || 0).toFixed(4).padStart(8)} ${dt.toFixed(0).padStart(11)}  |  ${S6}`);
}
