#!/usr/bin/env node
/**
 * Test: Edificio 2x2 vanos, 1 piso, frames + losa Q4
 * Mismo modelo exacto que test_slab_ops.py
 * nSubBeam=3 para que los nodos coincidan
 */
import { readFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = join(__dirname, "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath = join(__dirname, "hekatan-fem", "src", "cpp", "built", "deform.js");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

function allocD(a){const p=mod._malloc(a.length*8);mod.HEAPF64.set(new Float64Array(a),p/8);return p;}
function allocU(a){const p=mod._malloc(a.length*4);mod.HEAPU32.set(new Uint32Array(a),p/4);return p;}
function allocB(a){const p=mod._malloc(a.length);for(let i=0;i<a.length;i++)mod.HEAPU8[p+i]=a[i]?1:0;return p;}
function mkMap(m){const k=[],v=[];if(m)for(const[a,b]of m){k.push(a);v.push(b);}return{k:allocU(k),v:allocD(v),n:k.length};}

// === Same parameters as test_slab_ops.py ===
const Lx=5, Ly=4, H=3;
const Es=200e6, Gs=77e6, Ec=25e6, nu_c=0.2, Gc=Ec/(2*(1+nu_c));
const rho_s=7.85, rho_c=2.45;
const col_A=0.16, col_I=2.13e-3, col_J=3.6e-3;
const beam_A=0.12, beam_I=1.6e-3, beam_J=2.0e-3;
const t_slab=0.15;
const nSub=3; // same as OpenSees test

// Build nodes: base (3x3) + top (4x4 grid with subdivisions)
const nodes = [];
const nid = {};

// Base nodes (2x2 grid corners)
const nx=3, ny=3; // grid lines
for(let iy=0;iy<ny;iy++) for(let ix=0;ix<nx;ix++){
  nid[`${ix},${iy},0`]=nodes.length;
  nodes.push([ix*Lx/(nx-1), iy*Ly/(ny-1), 0]);
}

// Top nodes: full grid with beam subdivisions (nSub+1 per bay)
const nTopX = (nx-1)*nSub + 1; // for 2 bays with 3 subdiv = 7
const nTopY = (ny-1)*nSub + 1;
const topStart = nodes.length;
const topNid = {};
for(let iy=0;iy<nTopY;iy++) for(let ix=0;ix<nTopX;ix++){
  const x = ix * Lx / ((nx-1)*nSub);
  const y = iy * Ly / ((ny-1)*nSub);
  topNid[`${ix},${iy}`] = nodes.length;
  nodes.push([x, y, H]);
}

const elements = [];

// Columns (base corner → top corner)
for(let iy=0;iy<ny;iy++) for(let ix=0;ix<nx;ix++){
  const topIx = ix * nSub;
  const topIy = iy * nSub;
  elements.push([nid[`${ix},${iy},0`], topNid[`${topIx},${topIy}`]]);
}

// Beams X (subdivided, along each Y grid line)
for(let iy_grid=0;iy_grid<ny;iy_grid++){
  const topIy = iy_grid * nSub;
  for(let ix=0;ix<nTopX-1;ix++){
    elements.push([topNid[`${ix},${topIy}`], topNid[`${ix+1},${topIy}`]]);
  }
}

// Beams Y (subdivided, along each X grid line)
for(let ix_grid=0;ix_grid<nx;ix_grid++){
  const topIx = ix_grid * nSub;
  for(let iy=0;iy<nTopY-1;iy++){
    elements.push([topNid[`${topIx},${iy}`], topNid[`${topIx},${iy+1}`]]);
  }
}

const nFrameElems = elements.length;

// Slab Q4: nSub x nSub per bay (same as OpenSees)
for(let by=0;by<ny-1;by++) for(let bx=0;bx<nx-1;bx++){
  for(let jy=0;jy<nSub;jy++) for(let jx=0;jx<nSub;jx++){
    const ix0 = bx*nSub + jx;
    const iy0 = by*nSub + jy;
    elements.push([
      topNid[`${ix0},${iy0}`],
      topNid[`${ix0+1},${iy0}`],
      topNid[`${ix0+1},${iy0+1}`],
      topNid[`${ix0},${iy0+1}`]
    ]);
  }
}

console.log(`Nodes: ${nodes.length} (${nx*ny} base + ${nTopX*nTopY} top)`);
console.log(`Elements: ${elements.length} (${nFrameElems} frames + ${elements.length-nFrameElems} Q4 shells)`);

// Supports
const supports = new Map();
for(let iy=0;iy<ny;iy++) for(let ix=0;ix<nx;ix++){
  supports.set(nid[`${ix},${iy},0`], [true,true,true,true,true,true]);
}

// Loads: same as OpenSees (-10 kN gravity on all top nodes + 20 kN lateral)
const loads = new Map();
for(let iy=0;iy<nTopY;iy++) for(let ix=0;ix<nTopX;ix++){
  loads.set(topNid[`${ix},${iy}`], [0, 0, -10, 0, 0, 0]);
}
// Lateral on corner
const corner = topNid[`0,0`];
const prev = loads.get(corner) || [0,0,0,0,0,0];
prev[0] = 20;
loads.set(corner, prev);

// Element properties
const ei = {
  elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
  momentsOfInertiaZ: new Map(), momentsOfInertiaY: new Map(),
  torsionalConstants: new Map(), thicknesses: new Map(),
  poissonsRatios: new Map(), elasticitiesOrthogonal: new Map(),
};

for(let i=0;i<nFrameElems;i++){
  const isCol = i < nx*ny;
  ei.elasticities.set(i, Es);
  ei.shearModuli.set(i, Gs);
  ei.areas.set(i, isCol ? col_A : beam_A);
  ei.momentsOfInertiaZ.set(i, isCol ? col_I : beam_I);
  ei.momentsOfInertiaY.set(i, isCol ? col_I : beam_I);
  ei.torsionalConstants.set(i, isCol ? col_J : beam_J);
}
for(let i=nFrameElems;i<elements.length;i++){
  ei.elasticities.set(i, Ec);
  ei.shearModuli.set(i, Gc);
  ei.thicknesses.set(i, t_slab);
  ei.poissonsRatios.set(i, nu_c);
}

// Solve
const nf=nodes.flat(), ef=elements.flat(), es=elements.map(e=>e.length);
const sk=[],sv=[];for(const[k,v]of supports){sk.push(k);for(const b of v)sv.push(b?1:0);}
const lk=[],lv=[];for(const[k,v]of loads){lk.push(k);for(const x of v)lv.push(x);}
const E=mkMap(ei.elasticities),A=mkMap(ei.areas),Iz=mkMap(ei.momentsOfInertiaZ);
const Iy=mkMap(ei.momentsOfInertiaY),G=mkMap(ei.shearModuli),J=mkMap(ei.torsionalConstants);
const T=mkMap(ei.thicknesses),Nu=mkMap(ei.poissonsRatios),Eo=mkMap(ei.elasticitiesOrthogonal);
const pDO=mod._malloc(4),pDS=mod._malloc(4),pRO=mod._malloc(4),pRS=mod._malloc(4);

mod._deform(allocD(nf),nodes.length,allocU(ef),ef.length,allocU(es),elements.length,
  allocU(sk),allocB(sv),sk.length,allocU(lk),allocD(lv),lk.length,
  E.k,E.v,E.n,A.k,A.v,A.n,Iz.k,Iz.v,Iz.n,Iy.k,Iy.v,Iy.n,
  G.k,G.v,G.n,J.k,J.v,J.n,T.k,T.v,T.n,Nu.k,Nu.v,Nu.n,Eo.k,Eo.v,Eo.n,
  pDO,pDS,pRO,pRS);

const sz=new Int32Array(mod.HEAPU8.buffer,pDS,1)[0];
const ptr=mod.HEAPU32[pDO/4];
const d=sz>0?Array.from(mod.HEAPF64.subarray(ptr/8,ptr/8+sz)):[];

const deforms = new Map();
for(let i=0;i<d.length;i+=7) deforms.set(Math.round(d[i]), d.slice(i+1,i+7));

// OpenSees reference values from test_slab_ops.py
const opsRef = {
  corner_00: { ux: 0.0650, uz: -0.0036 },
  corner_30: { ux: 0.0617, uz: -0.0039 },
  corner_33: { ux: 0.0294, uz: -0.0040 },
  corner_03: { ux: 0.0308, uz: -0.0035 },
  interior_11: { ux: 0.0526, uz: -0.2550 },
  interior_22: { ux: 0.0410, uz: -0.2449 },
};

console.log("\n" + "=".repeat(65));
console.log("  COMPARACION: Hekatan Clone vs OpenSees (edificio + losa Q4)");
console.log("=".repeat(65));

// Corner nodes (on grid intersections = connected to columns)
const corners = [
  { name: "Corner (0,0)", awIdx: topNid["0,0"], ops: opsRef.corner_00 },
  { name: "Corner (3,0)", awIdx: topNid[`${(nx-1)*nSub},0`], ops: opsRef.corner_30 },
  { name: "Corner (3,3)", awIdx: topNid[`${(nx-1)*nSub},${(ny-1)*nSub}`], ops: opsRef.corner_33 },
  { name: "Corner (0,3)", awIdx: topNid[`0,${(ny-1)*nSub}`], ops: opsRef.corner_03 },
];

console.log(`\n  ${"Nodo".padEnd(16)} ${"Hekatan ux mm".padEnd(14)} ${"OPS ux mm".padEnd(12)} ${"Hekatan uz mm".padEnd(14)} ${"OPS uz mm".padEnd(12)} ${"uz ratio"}`);
console.log("  " + "-".repeat(80));

for(const c of corners){
  const aw = deforms.get(c.awIdx);
  if(aw){
    const ux_aw = (aw[0]*1000).toFixed(4);
    const uz_aw = (aw[2]*1000).toFixed(4);
    const ratio = (aw[2]*1000 / c.ops.uz).toFixed(4);
    console.log(`  ${c.name.padEnd(16)} ${ux_aw.padEnd(14)} ${c.ops.ux.toFixed(4).padEnd(12)} ${uz_aw.padEnd(14)} ${c.ops.uz.toFixed(4).padEnd(12)} ${ratio}`);
  } else {
    console.log(`  ${c.name.padEnd(16)} NO DATA`);
  }
}

// Interior slab nodes
const interiors = [
  { name: "Interior (1,1)", awIdx: topNid["1,1"], ops: opsRef.interior_11 },
  { name: "Interior (2,2)", awIdx: topNid["2,2"], ops: opsRef.interior_22 },
];

console.log();
for(const c of interiors){
  const aw = deforms.get(c.awIdx);
  if(aw){
    const ux_aw = (aw[0]*1000).toFixed(4);
    const uz_aw = (aw[2]*1000).toFixed(4);
    const ratio = c.ops.uz !== 0 ? (aw[2]*1000 / c.ops.uz).toFixed(4) : "N/A";
    console.log(`  ${c.name.padEnd(16)} ${ux_aw.padEnd(14)} ${c.ops.ux.toFixed(4).padEnd(12)} ${uz_aw.padEnd(14)} ${c.ops.uz.toFixed(4).padEnd(12)} ${ratio}`);
  }
}

// Check all nodes go DOWN
let allDown = true;
for(const [ni, dd] of deforms){
  if(nodes[ni] && nodes[ni][2] > 0.1 && dd[2] > 1e-8){
    allDown = false;
    console.log(`  WARNING: node ${ni} moves UP: uz=${(dd[2]*1000).toFixed(4)}mm`);
  }
}
console.log(`\n  All top nodes move DOWN: ${allDown ? "YES" : "NO"}`);
console.log("=".repeat(65));
