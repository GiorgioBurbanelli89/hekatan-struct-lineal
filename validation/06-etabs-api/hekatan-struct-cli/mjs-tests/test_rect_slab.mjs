#!/usr/bin/env node
/**
 * Rectangular Slab FEA — Kirchhoff vs Mindlin vs Navier vs Calcpad
 * 6×4 m, t=0.1 m, q=10 kN/m², E=35000 MPa, ν=0.15, simply supported
 */
import { readFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsPath = join(__dirname, "hekatan-fem", "src", "cpp", "built", "deform.js");
const wasmPath = join(__dirname, "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

function allocate(data, TypedArrayCtor, heapTypedArray) {
  const buffer = new TypedArrayCtor(data);
  const ptr = mod._malloc(buffer.length * buffer.BYTES_PER_ELEMENT);
  heapTypedArray.set(buffer, ptr / buffer.BYTES_PER_ELEMENT);
  return ptr;
}

function runPlateQ4(E, nu, thickness, pressure, meshLx, meshLy, meshNx, meshNy, theoryType) {
  const gc = [];
  // No custom nodes/elements — use mesh generator (pass empty)
  const nodesPtr = allocate([0], Float64Array, mod.HEAPF64); gc.push(nodesPtr);
  const elemsPtr = allocate([0], Uint32Array, mod.HEAPU32); gc.push(elemsPtr);
  const bcsPtr = allocate([0], Float64Array, mod.HEAPF64); gc.push(bcsPtr);
  const plPtr = allocate([0], Float64Array, mod.HEAPF64); gc.push(plPtr);
  const spPtr = allocate([0], Float64Array, mod.HEAPF64); gc.push(spPtr);

  const dispPtrOut = mod._malloc(4); gc.push(dispPtrOut);
  const dispSizeOut = mod._malloc(4); gc.push(dispSizeOut);
  const srPtrOut = mod._malloc(4); gc.push(srPtrOut);
  const srSizeOut = mod._malloc(4); gc.push(srSizeOut);

  // Signature from plateQ4Cpp.ts
  mod._plate_q4_solve(
    nodesPtr, 0,          // nodes, numNodes (0 = use mesh generator)
    elemsPtr, 0,          // elements, numElements
    E, nu, thickness,
    bcsPtr, 0,            // bcs, numBcs
    pressure,
    plPtr, 0,             // pointLoads, numPointLoads
    meshLx, meshLy, meshNx, meshNy,
    1,                    // bcType: 1 = simply-supported
    theoryType,           // 0=Mindlin, 1=Kirchhoff
    spPtr, 0,             // springs, numSprings
    dispPtrOut, dispSizeOut,
    srPtrOut, srSizeOut
  );

  const dPtr = mod.HEAPU32[dispPtrOut / 4];
  const dSize = mod.HEAPU32[dispSizeOut / 4];
  const sPtr = mod.HEAPU32[srPtrOut / 4];
  const sSize = mod.HEAPU32[srSizeOut / 4];

  // Parse displacements: [nNodes, nElems, x1,y1,w1,bx1,by1, ...]
  const dispFlat = new Float64Array(mod.HEAPF64.buffer, dPtr, dSize);
  const nNodes = dispFlat[0];
  const nElems = dispFlat[1];
  const nodeResults = [];
  let maxW = 0;
  for (let i = 0; i < nNodes; i++) {
    const base = 2 + i * 5;
    const nr = { x: dispFlat[base], y: dispFlat[base+1], w: dispFlat[base+2], bx: dispFlat[base+3], by: dispFlat[base+4] };
    nodeResults.push(nr);
    if (Math.abs(nr.w) > Math.abs(maxW)) maxW = nr.w;
  }

  // Parse stress resultants: [n1,n2,n3,n4, Mxx,Myy,Mxy,Qx,Qy] × nElems
  const srFlat = new Float64Array(mod.HEAPF64.buffer, sPtr, sSize);
  const elemResults = [];
  let maxMxx = 0, maxMyy = 0, maxMxy = 0;
  for (let e = 0; e < nElems; e++) {
    const base = e * 9;
    const er = { Mxx: srFlat[base+4], Myy: srFlat[base+5], Mxy: srFlat[base+6], Qx: srFlat[base+7], Qy: srFlat[base+8] };
    elemResults.push(er);
    if (Math.abs(er.Mxx) > Math.abs(maxMxx)) maxMxx = er.Mxx;
    if (Math.abs(er.Myy) > Math.abs(maxMyy)) maxMyy = er.Myy;
    if (Math.abs(er.Mxy) > Math.abs(maxMxy)) maxMxy = er.Mxy;
  }

  gc.forEach(p => mod._free(p));
  return { nodeResults, elemResults, maxW, maxMxx, maxMyy, maxMxy, nNodes, nElems };
}

// ══════════════════════════════════════════════════════════════
// MODEL
// ══════════════════════════════════════════════════════════════
const Lx = 6, Ly = 4, t = 0.1, q = 10;
const E = 35000 * 1000; // MPa → kN/m²
const nu = 0.15;
const nx = 6, ny = 4;

// Navier analytical
const D = E * (t**3) / (12 * (1 - nu**2));
let w_nav = 0, Mx_nav = 0, My_nav = 0;
for (let m = 1; m <= 99; m += 2) {
  for (let n = 1; n <= 99; n += 2) {
    const amn = ((m * Math.PI / Lx)**2) + ((n * Math.PI / Ly)**2);
    const qmn = 16 * q / (m * n * (Math.PI**2));
    const wmn = qmn / (D * (amn**2));
    const sm = Math.sin(m * Math.PI / 2), sn = Math.sin(n * Math.PI / 2);
    w_nav += wmn * sm * sn;
    const d2x = -((m * Math.PI / Lx)**2) * wmn * sm * sn;
    const d2y = -((n * Math.PI / Ly)**2) * wmn * sm * sn;
    Mx_nav += -D * (d2x + nu * d2y);
    My_nav += -D * (d2y + nu * d2x);
  }
}

// Calcpad reference
const CP = { w: 6.629, Mx: 6.275, My: 12.744, Mxy: 8.378 };

console.log("=".repeat(72));
console.log("  RECTANGULAR SLAB FEA — Comparison");
console.log("  6×4 m, t=0.1 m, q=10 kN/m², E=35000 MPa, ν=0.15");
console.log("  Simply supported, mesh " + nx + "×" + ny);
console.log("=".repeat(72));

console.log(`\n  Navier (exact):  w=${(w_nav*1000).toFixed(3)} mm  Mx=${Mx_nav.toFixed(3)}  My=${My_nav.toFixed(3)} kNm/m`);
console.log(`  Calcpad (BFS):   w=${CP.w}       mm  Mx=${CP.Mx}      My=${CP.My}   kNm/m`);

for (const [name, theory] of [["Kirchhoff (thin)", 1], ["Mindlin-Reissner (thick)", 0]]) {
  console.log(`\n${"─".repeat(72)}`);
  console.log(`  Hekatan plateQ4 — ${name}`);
  console.log(`${"─".repeat(72)}`);

  const r = runPlateQ4(E, nu, t, q, Lx, Ly, nx, ny, theory);

  console.log(`  Mesh: ${r.nNodes} nodes, ${r.nElems} elements`);
  console.log(`  Max w  = ${(Math.abs(r.maxW)*1000).toFixed(3)} mm`);
  console.log(`  Max Mxx = ${Math.abs(r.maxMxx).toFixed(3)} kNm/m`);
  console.log(`  Max Myy = ${Math.abs(r.maxMyy).toFixed(3)} kNm/m`);
  console.log(`  Max Mxy = ${Math.abs(r.maxMxy).toFixed(3)} kNm/m`);

  const dw = ((Math.abs(r.maxW)*1000 - w_nav*1000) / (w_nav*1000) * 100).toFixed(1);
  const dwCP = ((Math.abs(r.maxW)*1000 - CP.w) / CP.w * 100).toFixed(1);
  console.log(`\n  vs Navier:  Δw = ${dw}%`);
  console.log(`  vs Calcpad: Δw = ${dwCP}%`);

  // Print w grid
  console.log(`\n  Displacements w (mm):`);
  for (let j = 0; j <= ny; j++) {
    let line = "  ";
    for (let i = 0; i <= nx; i++) {
      const idx = j * (nx + 1) + i;
      const nr = r.nodeResults[idx];
      line += nr ? (nr.w * 1000).toFixed(3).padStart(10) : "     ?    ";
    }
    console.log(line);
  }
}

console.log("\n" + "=".repeat(72));
