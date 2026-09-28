#!/usr/bin/env node
/**
 * Mismo modelo que test_connection_ops.py:
 * 1 piso, 1 vano, 4 col + 4 vigas + 1 losa Q4
 * Compara desplazamientos con OpenSees
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

const Lx=5, Ly=4, H=3;
const Es=200e6, Gs=77e6, Ec=25e6, nu_c=0.2, Gc=Ec/(2*(1+nu_c));
const rho_s=7.85, rho_c=2.45;
const col_A=0.16, col_I=2.13e-3, col_J=3.6e-3;
const beam_A=0.12, beam_I=1.6e-3, beam_J=2.0e-3;
const t_slab=0.15;
const g=9.81;
const P_grav=-50, F_lat=20;

// Same 8 nodes as OpenSees
const nodes = [[0,0,0],[Lx,0,0],[Lx,Ly,0],[0,Ly,0],[0,0,H],[Lx,0,H],[Lx,Ly,H],[0,Ly,H]];
// Same elements: 4 cols + 4 beams + 1 Q4
const elements = [[0,4],[1,5],[2,6],[3,7],[4,5],[6,7],[4,7],[5,6],[4,5,6,7]];

// Supports
const supports = new Map();
for(let i=0;i<4;i++) supports.set(i,[true,true,true,true,true,true]);

// Loads: self-weight + surcharge + lateral (IDENTICAL to OpenSees)
const loads = new Map();
// Column self-weight: rho*A*H*g/2 per top node
const w_col = -rho_s * col_A * H * g / 2;
// Beam self-weight: rho*A*L*g/2 per end node
const w_beamX = -rho_s * beam_A * Lx * g / 2;
const w_beamY = -rho_s * beam_A * Ly * g / 2;
// Slab self-weight: rho*t*Lx*Ly*g/4 per corner node
const w_slab = -rho_c * t_slab * Lx * Ly * g / 4;

// Node 4 (=OpenSees node 5): col + 2 beams + slab + surcharge + lateral
loads.set(4, [F_lat, 0, w_col + w_beamX + w_beamY + w_slab + P_grav, 0, 0, 0]);
// Node 5 (=OpenSees node 6): col + 2 beams + slab + surcharge
loads.set(5, [0, 0, w_col + w_beamX + w_beamY + w_slab + P_grav, 0, 0, 0]);
// Node 6 (=OpenSees node 7)
loads.set(6, [0, 0, w_col + w_beamX + w_beamY + w_slab + P_grav, 0, 0, 0]);
// Node 7 (=OpenSees node 8)
loads.set(7, [0, 0, w_col + w_beamX + w_beamY + w_slab + P_grav, 0, 0, 0]);

// Element properties
const ei = {
  elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
  momentsOfInertiaZ: new Map(), momentsOfInertiaY: new Map(),
  torsionalConstants: new Map(), thicknesses: new Map(), poissonsRatios: new Map(),
  elasticitiesOrthogonal: new Map(),
};
// Frames (0-7)
for(let i=0;i<8;i++){
  ei.elasticities.set(i,Es); ei.shearModuli.set(i,Gs);
  ei.areas.set(i, i<4?col_A:beam_A);
  ei.momentsOfInertiaZ.set(i, i<4?col_I:beam_I);
  ei.momentsOfInertiaY.set(i, i<4?col_I:beam_I);
  ei.torsionalConstants.set(i, i<4?col_J:beam_J);
}
// Slab Q4 (element 8)
ei.elasticities.set(8,Ec); ei.shearModuli.set(8,Gc);
ei.thicknesses.set(8,t_slab); ei.poissonsRatios.set(8,nu_c);

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

console.log("=".repeat(60));
console.log("  Hekatan Clone: 1 piso, 1 vano, frames + losa Q4");
console.log("=".repeat(60));
console.log(`  Loads identical to OpenSees test`);
console.log();

// Parse deformations
const deforms = new Map();
for(let i=0;i<d.length;i+=7){
  const ni=Math.round(d[i]);
  deforms.set(ni, d.slice(i+1,i+7));
}

// OpenSees reference values
const ops_ref = [
  [4.11208439e-05, -1.33804811e-05, -1.17735808e-05],
  [3.94617457e-05,  1.33443855e-05, -1.22437639e-05],
  [1.60926572e-05,  1.33804811e-05, -1.23235812e-05],
  [1.60005380e-05, -1.33443855e-05, -1.16937634e-05],
];

console.log(`  ${"Node".padEnd(6)} ${"ux (mm)".padEnd(12)} ${"uy (mm)".padEnd(12)} ${"uz (mm)".padEnd(12)} | ${"OPS ux".padEnd(10)} ${"OPS uz".padEnd(10)}`);
console.log("  " + "-".repeat(70));

for(let i=4;i<=7;i++){
  const dd = deforms.get(i);
  const ref = ops_ref[i-4];
  if(dd){
    const ux=(dd[0]*1000).toFixed(4), uy=(dd[1]*1000).toFixed(4), uz=(dd[2]*1000).toFixed(4);
    const rux=(ref[0]*1000).toFixed(4), ruz=(ref[2]*1000).toFixed(4);
    console.log(`  ${i.toString().padEnd(6)} ${ux.padEnd(12)} ${uy.padEnd(12)} ${uz.padEnd(12)} | ${rux.padEnd(10)} ${ruz.padEnd(10)}`);
  } else {
    console.log(`  ${i}  NO DATA`);
  }
}

// Check: uz should be NEGATIVE (downward)
const uz4 = deforms.get(4)?.[2] ?? 0;
const uz_ops = ops_ref[0][2];
console.log();
console.log(`  uz node 4 (Hekatan): ${(uz4*1000).toFixed(4)} mm`);
console.log(`  uz node 5 (OPS):    ${(uz_ops*1000).toFixed(4)} mm`);
console.log(`  Direction: ${uz4 < 0 ? "DOWN (correct)" : "UP (WRONG!)"}`);

if(uz4 < 0 && Math.abs(uz4) > 1e-8){
  const ratio = uz4 / uz_ops;
  console.log(`  Ratio Hekatan/OPS: ${ratio.toFixed(4)}`);
}

console.log("=".repeat(60));
