#!/usr/bin/env node
/**
 * Convergencia de malla: Hekatan clone vs OpenSees
 * Misma placa, diferentes subdivisiones
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

const Lx=5, Ly=4, E=25e6, nu=0.2, t=0.15, G=E/(2*(1+nu));
const q = -10; // kN/m2

// OpenSees reference values
const opsRef = {
  2: 1.6589, 3: 1.5018, 4: 2.0786, 6: 2.1113, 8: 2.1249, 10: 2.1333
};

console.log("=".repeat(65));
console.log("  CONVERGENCIA: Hekatan Clone vs OpenSees (Shell Q4)");
console.log("=".repeat(65));
console.log(`  Placa ${Lx}x${Ly}m, t=${t}m, q=${q} kN/m2\n`);

const meshes = [2, 3, 4, 6, 8, 10];

console.log(`  ${"nDiv".padEnd(6)} ${"Elems".padEnd(7)} ${"Hekatan mm".padEnd(12)} ${"OPS mm".padEnd(10)} ${"Ratio".padEnd(8)}`);
console.log("  " + "-".repeat(45));

for (const nDiv of meshes) {
  const nx = nDiv, ny = nDiv;
  const dx = Lx/nx, dy = Ly/ny;

  const nodes = [];
  for(let iy=0;iy<=ny;iy++) for(let ix=0;ix<=nx;ix++) nodes.push([ix*dx, iy*dy, 0]);

  const elements = [];
  for(let iy=0;iy<ny;iy++) for(let ix=0;ix<nx;ix++){
    const n0=iy*(nx+1)+ix;
    elements.push([n0, n0+1, n0+nx+2, n0+nx+1]);
  }

  const supports = new Map();
  for(let iy=0;iy<=ny;iy++) for(let ix=0;ix<=nx;ix++){
    if(ix===0||ix===nx||iy===0||iy===ny)
      supports.set(iy*(nx+1)+ix, [true,true,true,false,false,false]);
  }

  const loads = new Map();
  for(let iy=0;iy<=ny;iy++) for(let ix=0;ix<=nx;ix++){
    let ax = dx, ay = dy;
    if(ix===0||ix===nx) ax=dx/2;
    if(iy===0||iy===ny) ay=dy/2;
    loads.set(iy*(nx+1)+ix, [0, 0, q*ax*ay, 0, 0, 0]);
  }

  const ei = {
    elasticities: new Map(elements.map((_,i)=>[i,E])),
    poissonsRatios: new Map(elements.map((_,i)=>[i,nu])),
    thicknesses: new Map(elements.map((_,i)=>[i,t])),
    shearModuli: new Map(elements.map((_,i)=>[i,G])),
    elasticitiesOrthogonal: new Map(),
  };

  const nf=nodes.flat(),ef=elements.flat(),es=elements.map(e=>e.length);
  const sk=[],sv=[];for(const[k,v]of supports){sk.push(k);for(const b of v)sv.push(b?1:0);}
  const lk=[],lv=[];for(const[k,v]of loads){lk.push(k);for(const x of v)lv.push(x);}
  const Em=mkMap(ei.elasticities),A=mkMap(new Map()),Iz=mkMap(new Map());
  const Iy=mkMap(new Map()),Gm=mkMap(ei.shearModuli),J=mkMap(new Map());
  const T=mkMap(ei.thicknesses),Nu=mkMap(ei.poissonsRatios),Eo=mkMap(ei.elasticitiesOrthogonal);
  const pDO=mod._malloc(4),pDS=mod._malloc(4),pRO=mod._malloc(4),pRS=mod._malloc(4);

  try {
    mod._deform(allocD(nf),nodes.length,allocU(ef),ef.length,allocU(es),elements.length,
      allocU(sk),allocB(sv),sk.length,allocU(lk),allocD(lv),lk.length,
      Em.k,Em.v,Em.n,A.k,A.v,A.n,Iz.k,Iz.v,Iz.n,Iy.k,Iy.v,Iy.n,
      Gm.k,Gm.v,Gm.n,J.k,J.v,J.n,T.k,T.v,T.n,Nu.k,Nu.v,Nu.n,Eo.k,Eo.v,Eo.n,
      pDO,pDS,pRO,pRS);

    const sz=new Int32Array(mod.HEAPU8.buffer,pDS,1)[0];
    const ptr=mod.HEAPU32[pDO/4];
    const d=sz>0?Array.from(mod.HEAPF64.subarray(ptr/8,ptr/8+sz)):[];

    // Find center node displacement
    const cx = Math.floor(nx/2), cy = Math.floor(ny/2);
    const centerIdx = cy*(nx+1)+cx;
    let w_center = 0;
    for(let i=0;i<d.length;i+=7){
      if(Math.round(d[i])===centerIdx){ w_center=Math.abs(d[i+3]); break; }
    }

    const opsVal = opsRef[nDiv] || 0;
    const ratio = opsVal > 0 ? (w_center*1000/opsVal).toFixed(4) : "N/A";
    console.log(`  ${nDiv.toString().padEnd(6)} ${(nx*ny).toString().padEnd(7)} ${(w_center*1000).toFixed(4).padEnd(12)} ${opsVal.toFixed(4).padEnd(10)} ${ratio}`);
  } catch(e) {
    console.log(`  ${nDiv.toString().padEnd(6)} ERROR: ${e.message}`);
  }
}

console.log("\n  Ratio = Hekatan / OpenSees (1.0 = identico)");
console.log("=".repeat(65));
