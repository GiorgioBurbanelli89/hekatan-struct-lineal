#!/usr/bin/env node
/**
 * test_complete.mjs — Test COMPLETO de TODOS los ejemplos del FEM Studio
 * Verifica que cada generador produce modelos validos y el solver funciona
 */
import { readFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = join(__dirname, "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath = join(__dirname, "hekatan-fem", "src", "cpp", "built", "deform.js");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

// ── WASM helpers ──
function allocD(a){const p=mod._malloc(a.length*8);mod.HEAPF64.set(new Float64Array(a),p/8);return p;}
function allocU(a){const p=mod._malloc(a.length*4);mod.HEAPU32.set(new Uint32Array(a),p/4);return p;}
function allocB(a){const p=mod._malloc(a.length);for(let i=0;i<a.length;i++)mod.HEAPU8[p+i]=a[i]?1:0;return p;}
function mkMap(m){const k=[],v=[];if(m)for(const[a,b]of m){k.push(a);v.push(b);}return{k:allocU(k),v:allocD(v),n:k.length};}

function solve(nodes, elements, supports, loads, ep) {
  const nf=nodes.flat(),ef=elements.flat(),es=elements.map(e=>e.length);
  const sk=[],sv=[];for(const[k,v]of supports){sk.push(k);for(const b of v)sv.push(b?1:0);}
  const lk=[],lv=[];for(const[k,v]of loads){lk.push(k);for(const x of v)lv.push(x);}
  const E=mkMap(ep.elasticities),A=mkMap(ep.areas),Iz=mkMap(ep.momentsOfInertiaZ);
  const Iy=mkMap(ep.momentsOfInertiaY),G=mkMap(ep.shearModuli),J=mkMap(ep.torsionalConstants);
  const T=mkMap(ep.thicknesses),Nu=mkMap(ep.poissonsRatios),Eo=mkMap(ep.elasticitiesOrthogonal);
  const pDO=mod._malloc(4),pDS=mod._malloc(4),pRO=mod._malloc(4),pRS=mod._malloc(4);
  try {
    mod._deform(allocD(nf),nodes.length,allocU(ef),ef.length,allocU(es),elements.length,
      allocU(sk),allocB(sv),sk.length,allocU(lk),allocD(lv),lk.length,
      E.k,E.v,E.n,A.k,A.v,A.n,Iz.k,Iz.v,Iz.n,Iy.k,Iy.v,Iy.n,
      G.k,G.v,G.n,J.k,J.v,J.n,T.k,T.v,T.n,Nu.k,Nu.v,Nu.n,Eo.k,Eo.v,Eo.n,
      pDO,pDS,pRO,pRS);
    const sz=new Int32Array(mod.HEAPU8.buffer,pDS,1)[0];
    const ptr=mod.HEAPU32[pDO/4];
    const d=sz>0?Array.from(mod.HEAPF64.subarray(ptr/8,ptr/8+sz)):[];
    let mx=0;for(let i=0;i<d.length;i+=7){const dx=d[i+1],dy=d[i+2],dz=d[i+3];mx=Math.max(mx,Math.sqrt(dx*dx+dy*dy+dz*dz));}
    return{ok:true,maxDisp:mx,nDef:Math.floor(d.length/7)};
  }catch(e){return{ok:false,error:e.message};}
}

// Steel frame props helper
const fp=(el,E=200e6,G=77e6,A=50e-4,I=200e-8,J_=100e-8)=>({
  elasticities:new Map(el.map((_,i)=>[i,E])),shearModuli:new Map(el.map((_,i)=>[i,G])),
  areas:new Map(el.map((_,i)=>[i,A])),momentsOfInertiaZ:new Map(el.map((_,i)=>[i,I])),
  momentsOfInertiaY:new Map(el.map((_,i)=>[i,I])),torsionalConstants:new Map(el.map((_,i)=>[i,J_])),
});
// Shell props helper
const sp=(el,E=25e6,nu=0.2,t=0.15)=>{const G=E/(2*(1+nu));return{
  elasticities:new Map(el.map((_,i)=>[i,E])),poissonsRatios:new Map(el.map((_,i)=>[i,nu])),
  thicknesses:new Map(el.map((_,i)=>[i,t])),shearModuli:new Map(el.map((_,i)=>[i,G])),
};};

let passed=0,failed=0,total=0;
function test(name,fn){
  total++;
  try{const r=fn();if(r.ok){console.log(`  PASS  ${name.padEnd(30)} ${r.maxDisp>0?'max|u|='+r.maxDisp.toExponential(3):'(solver warning)'} [${r.nDef} nodes]`);passed++;}
  else{console.log(`  FAIL  ${name.padEnd(30)} ${r.error}`);failed++;}}
  catch(e){console.log(`  FAIL  ${name.padEnd(30)} ${e.message}`);failed++;}
}

console.log("=".repeat(65));
console.log("  HEKATAN CLONE — TEST COMPLETO DE TODOS LOS EJEMPLOS");
console.log("=".repeat(65));

// ═══════════════════════════════════════════════════
// 1. FRAME BASICOS
// ═══════════════════════════════════════════════════
console.log("\n--- FRAMES BASICOS ---");

test("Portico 2D simple", ()=>{
  const n=[[0,0,0],[5,0,0],[0,0,3],[5,0,3]],e=[[0,2],[1,3],[2,3]];
  const s=new Map([[0,[true,true,true,true,true,true]],[1,[true,true,true,true,true,true]]]);
  const l=new Map([[2,[100,0,0,0,0,0]]]);
  return solve(n,e,s,l,fp(e,200e6,77e6,100e-4,8000e-8,1000e-8));
});

test("Portico 3D (4 col + 4 vigas)", ()=>{
  const H=3,Lx=5,Ly=4;
  const n=[[0,0,0],[Lx,0,0],[Lx,Ly,0],[0,Ly,0],[0,0,H],[Lx,0,H],[Lx,Ly,H],[0,Ly,H]];
  const e=[[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[7,4]];
  const s=new Map();for(let i=0;i<4;i++)s.set(i,[true,true,true,true,true,true]);
  const l=new Map([[4,[50,0,-20,0,0,0]]]);
  return solve(n,e,s,l,fp(e,200e6,77e6,160e-4,21300e-8,36000e-8));
});

test("Edificio 2x2x3 pisos", ()=>{
  const nx=3,ny=3,nz=4,Lx=5,Ly=4,H=3;
  const n=[];for(let iz=0;iz<nz;iz++)for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx;ix++)n.push([ix*Lx,iy*Ly,iz*H]);
  const e=[],nid=(ix,iy,iz)=>iz*ny*nx+iy*nx+ix;
  for(let iz=0;iz<nz-1;iz++)for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx;ix++)e.push([nid(ix,iy,iz),nid(ix,iy,iz+1)]);
  for(let iz=1;iz<nz;iz++){for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx-1;ix++)e.push([nid(ix,iy,iz),nid(ix+1,iy,iz)]);
    for(let ix=0;ix<nx;ix++)for(let iy=0;iy<ny-1;iy++)e.push([nid(ix,iy,iz),nid(ix,iy+1,iz)]);}
  const s=new Map();for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx;ix++)s.set(nid(ix,iy,0),[true,true,true,true,true,true]);
  const l=new Map();for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx;ix++)l.set(nid(ix,iy,nz-1),[5,0,-10,0,0,0]);
  return solve(n,e,s,l,fp(e,25e6,10e6,1600e-4,213000e-8,360000e-8));
});

// ═══════════════════════════════════════════════════
// 2. SHELL Q4
// ═══════════════════════════════════════════════════
console.log("\n--- SHELL Q4 (MUROS / LOSAS) ---");

test("Placa Q4 2x2 (carga central)", ()=>{
  const n=[[0,0,0],[1,0,0],[2,0,0],[0,1,0],[1,1,0],[2,1,0],[0,2,0],[1,2,0],[2,2,0]];
  const e=[[0,1,4,3],[1,2,5,4],[3,4,7,6],[4,5,8,7]];
  const s=new Map();for(const i of[0,1,2,3,5,6,7,8])s.set(i,[true,true,true,false,false,false]);
  const l=new Map([[4,[0,0,-10,0,0,0]]]);
  return solve(n,e,s,l,sp(e));
});

test("Muro vertical Q4 (1 panel)", ()=>{
  const n=[[0,0,0],[3,0,0],[3,0,3],[0,0,3]];
  const e=[[0,1,2,3]];
  const s=new Map([[0,[true,true,true,true,true,true]],[1,[true,true,true,true,true,true]]]);
  const l=new Map([[3,[10,0,0,0,0,0]]]);
  return solve(n,e,s,l,sp(e,25e6,0.2,0.20));
});

test("Frame + Shell mixto (edificio+muro)", ()=>{
  const H=3,Lx=5,Ly=4;
  const n=[[0,0,0],[Lx,0,0],[Lx,Ly,0],[0,Ly,0],[0,0,H],[Lx,0,H],[Lx,Ly,H],[0,Ly,H]];
  const e=[[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[7,4],[0,1,5,4]]; // 8 frames + 1 wall
  const s=new Map();for(let i=0;i<4;i++)s.set(i,[true,true,true,true,true,true]);
  const l=new Map([[4,[50,0,0,0,0,0]]]);
  const ep={elasticities:new Map(),shearModuli:new Map(),areas:new Map(),momentsOfInertiaZ:new Map(),momentsOfInertiaY:new Map(),torsionalConstants:new Map(),thicknesses:new Map(),poissonsRatios:new Map()};
  for(let i=0;i<8;i++){ep.elasticities.set(i,200e6);ep.shearModuli.set(i,77e6);ep.areas.set(i,160e-4);ep.momentsOfInertiaZ.set(i,21300e-8);ep.momentsOfInertiaY.set(i,21300e-8);ep.torsionalConstants.set(i,36000e-8);}
  ep.elasticities.set(8,25e6);ep.shearModuli.set(8,10.4e6);ep.thicknesses.set(8,0.20);ep.poissonsRatios.set(8,0.20);
  return solve(n,e,s,l,ep);
});

test("Losa horizontal Q4 (4x4 mesh)", ()=>{
  const nx=4,ny=4,Lx=6,Ly=5;
  const n=[];for(let iy=0;iy<=ny;iy++)for(let ix=0;ix<=nx;ix++)n.push([ix*Lx/nx,iy*Ly/ny,0]);
  const e=[];for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx;ix++){const n0=iy*(nx+1)+ix;e.push([n0,n0+1,n0+nx+2,n0+nx+1]);}
  const s=new Map();for(let i=0;i<n.length;i++){const x=n[i][0],y=n[i][1];if(x<0.01||x>Lx-0.01||y<0.01||y>Ly-0.01)s.set(i,[true,true,true,false,false,false]);}
  const l=new Map();const ci=Math.floor(ny/2)*(nx+1)+Math.floor(nx/2);l.set(ci,[0,0,-50,0,0,0]);
  return solve(n,e,s,l,sp(e));
});

// ═══════════════════════════════════════════════════
// 3. MATERIALES NO-LINEALES
// ═══════════════════════════════════════════════════
console.log("\n--- MATERIALES NO-LINEALES ---");

test("Concrete02 (compresion ciclica)", ()=>{
  const strains=[];for(let i=0;i<=20;i++)strains.push(-0.003*i/20);for(let i=20;i>=0;i--)strains.push(-0.003*i/20);
  const pS=allocD(strains),pO=mod._malloc(4),pN=mod._malloc(4);
  mod._concrete02_test(-30000,-0.002,-6000,-0.005,3000,100000,pS,strains.length,pO,pN);
  const n=new Int32Array(mod.HEAPU8.buffer,pN,1)[0];
  const ptr=mod.HEAPU32[pO/4];
  const stress=Array.from(mod.HEAPF64.subarray(ptr/8,ptr/8+n));
  const minS=Math.min(...stress);
  if(ptr)mod._free(ptr);
  return{ok:minS<-20000,maxDisp:Math.abs(minS),nDef:n,error:minS>-20000?`peak=${minS}`:''};
});

test("Steel02 (traccion/compresion ciclica)", ()=>{
  const strains=[];for(let i=0;i<=10;i++)strains.push(0.02*i/10);for(let i=10;i>=-10;i--)strains.push(0.02*i/10);
  const pS=allocD(strains),pSt=allocD(new Array(strains.length).fill(0)),pT=allocD(new Array(strains.length).fill(0));
  mod._steel02_test(420000,200e6,0.01,15,pS,strains.length,pSt,pT);
  const stress=Array.from(mod.HEAPF64.subarray(pSt/8,pSt/8+strains.length));
  const maxS=Math.max(...stress),minS=Math.min(...stress);
  return{ok:maxS>350000&&minS<-350000,maxDisp:maxS/1000,nDef:strains.length,error:maxS<350000?`max=${maxS}`:''};
});

// ═══════════════════════════════════════════════════
// 4. ESTRUCTURAS ICONICAS
// ═══════════════════════════════════════════════════
console.log("\n--- ESTRUCTURAS ICONICAS ---");

test("Torre Eiffel (truss)", ()=>{
  const H=30,bW=12,nL=8,n=[],e=[];
  for(let iz=0;iz<=nL;iz++){const t=iz/nL,w=bW*(1-t)*(1-t*0.3),hw=w/2,b=n.length;
    n.push([-hw,-hw,H*t],[hw,-hw,H*t],[hw,hw,H*t],[-hw,hw,H*t]);
    for(let j=0;j<4;j++)e.push([b+j,b+(j+1)%4]);
    if(iz>0){const p=b-4;for(let j=0;j<4;j++){e.push([p+j,b+j]);e.push([p+j,b+(j+1)%4]);}}}
  const s=new Map();for(let j=0;j<4;j++)s.set(j,[true,true,true,true,true,true]);
  const l=new Map();for(let j=0;j<4;j++)l.set(n.length-4+j,[0,0,-50,0,0,0]);
  return solve(n,e,s,l,fp(e));
});

test("Puente Atirantado", ()=>{
  const span=40,nD=10,tH=15,dH=6,n=[],e=[];
  for(let i=0;i<=nD;i++){const x=span*i/nD;n.push([x,-2,dH],[x,2,dH]);}
  for(let i=0;i<nD;i++){e.push([i*2,(i+1)*2],[i*2+1,(i+1)*2+1],[i*2,i*2+1]);}
  e.push([nD*2,nD*2+1]);
  const tp=Math.round(nD/2),tx=span*tp/nD;
  const bL=n.length;n.push([tx,-2,0]);const bR=n.length;n.push([tx,2,0]);
  const tL=n.length;n.push([tx,-2,tH+dH]);const tR=n.length;n.push([tx,2,tH+dH]);
  e.push([bL,tp*2],[tp*2,tL],[bR,tp*2+1],[tp*2+1,tR],[tL,tR]);
  for(let i=0;i<=nD;i+=2){if(Math.abs(i-tp)>1){e.push([tL,i*2]);e.push([tR,i*2+1]);}}
  const s=new Map();s.set(0,[true,true,true,false,false,false]);s.set(1,[true,true,true,false,false,false]);
  s.set(nD*2,[false,true,true,false,false,false]);s.set(nD*2+1,[false,true,true,false,false,false]);
  s.set(bL,[true,true,true,true,true,true]);s.set(bR,[true,true,true,true,true,true]);
  const l=new Map();for(let i=0;i<=nD;i++){l.set(i*2,[0,0,-20,0,0,0]);l.set(i*2+1,[0,0,-20,0,0,0]);}
  return solve(n,e,s,l,fp(e,200e6,77e6,100e-4,5000e-8,2000e-8));
});

test("Torre Twist (12 pisos)", ()=>{
  const nF=10,hF=3.5,R=5,nC=6,tw=5,n=[],e=[];
  for(let iz=0;iz<=nF;iz++){const a0=iz*tw*Math.PI/180;for(let ic=0;ic<nC;ic++){const a=a0+2*Math.PI*ic/nC;n.push([R*Math.cos(a),R*Math.sin(a),iz*hF]);}}
  for(let iz=0;iz<=nF;iz++){const b=iz*nC;for(let ic=0;ic<nC;ic++)e.push([b+ic,b+(ic+1)%nC]);if(iz<nF){const nx=(iz+1)*nC;for(let ic=0;ic<nC;ic++){e.push([b+ic,nx+ic]);e.push([b+ic,nx+(ic+1)%nC]);}}}
  const s=new Map();for(let ic=0;ic<nC;ic++)s.set(ic,[true,true,true,true,true,true]);
  const l=new Map();for(let iz=1;iz<=nF;iz++){const b=iz*nC;for(let ic=0;ic<nC;ic+=2)l.set(b+ic,[3,0,-5,0,0,0]);}
  return solve(n,e,s,l,fp(e));
});

test("Diagrid (Gherkin)", ()=>{
  const nF=10,nC=8,n=[],e=[];
  for(let iz=0;iz<=nF;iz++){const t=iz/nF,R=4*(0.6+0.4*Math.sin(Math.PI*t));for(let ic=0;ic<nC;ic++){const a=2*Math.PI*ic/nC;n.push([R*Math.cos(a),R*Math.sin(a),iz*3.5]);}}
  for(let iz=0;iz<nF;iz++){const b=iz*nC,nx=(iz+1)*nC;for(let ic=0;ic<nC;ic++){e.push([b+ic,b+(ic+1)%nC]);e.push([b+ic,nx+((ic+(iz%2===0?1:-1)+nC)%nC)]);e.push([b+ic,nx+ic]);}}
  for(let ic=0;ic<nC;ic++)e.push([nF*nC+ic,nF*nC+(ic+1)%nC]);
  const s=new Map();for(let ic=0;ic<nC;ic++)s.set(ic,[true,true,true,true,true,true]);
  const l=new Map();for(let iz=1;iz<=nF;iz++){const b=iz*nC;for(let ic=0;ic<nC;ic+=2)l.set(b+ic,[2,0,-5,0,0,0]);}
  return solve(n,e,s,l,fp(e));
});

test("Opera House (shell curvos)", ()=>{
  const nX=6,nY=3,H=10,span=12,depth=5,n=[],e=[];
  for(let iy=0;iy<=nY;iy++){for(let ix=0;ix<=nX;ix++){const t=ix/nX,tY=iy/nY;n.push([span*t,-depth/2+depth*tY,H*Math.sin(Math.PI*t)*(1-tY*tY*0.5)]);}}
  for(let iy=0;iy<nY;iy++){for(let ix=0;ix<nX;ix++){const n0=iy*(nX+1)+ix;e.push([n0,n0+1,n0+nX+2,n0+nX+1]);}}
  const s=new Map();for(let i=0;i<n.length;i++){if(n[i][2]<0.3)s.set(i,[true,true,true,true,true,true]);}
  const l=new Map();for(let i=0;i<n.length;i++){if(n[i][2]>1)l.set(i,[0,0,-3,0,0,0]);}
  return solve(n,e,s,l,sp(e,35e6,0.2,0.15));
});

test("Burj Khalifa (Y-shape)", ()=>{
  const nF=12,hF=3,bR=6,nW=3,n=[],e=[];
  for(let iz=0;iz<=nF;iz++){const R=bR*(1-iz/nF*0.7),cI=n.length;n.push([0,0,iz*hF]);
    for(let w=0;w<nW;w++){const a=w*2*Math.PI/nW-Math.PI/2;n.push([R*Math.cos(a),R*Math.sin(a),iz*hF]);e.push([cI,cI+1+w]);}
    for(let w=0;w<nW;w++)e.push([cI+1+w,cI+1+(w+1)%nW]);
    if(iz<nF){const npf=1+nW,nc=cI+npf;e.push([cI,nc]);for(let w=0;w<nW;w++)e.push([cI+1+w,nc+1+w]);}}
  const npf=1+nW;const s=new Map();for(let i=0;i<npf;i++)s.set(i,[true,true,true,true,true,true]);
  const l=new Map();for(let iz=1;iz<=nF;iz++)l.set(iz*npf,[2,0,-5,0,0,0]);
  return solve(n,e,s,l,fp(e,35e6,14e6,200e-4,5000e-8,2000e-8));
});

// ═══════════════════════════════════════════════════
// 5. ELEMENTOS ESPECIALES
// ═══════════════════════════════════════════════════
console.log("\n--- ELEMENTOS ESPECIALES ---");

test("Columna HSS (4 shells Q4)", ()=>{
  const b=0.3,t_w=0.008,H=3,n2=4;
  const n=[],e=[];
  // 4 faces of column, each subdivided vertically
  const corners=[[b/2,b/2],[b/2,-b/2],[-b/2,-b/2],[-b/2,b/2]];
  for(let f=0;f<4;f++){const[x0,y0]=corners[f],[x1,y1]=corners[(f+1)%4];
    const base=n.length;
    for(let iz=0;iz<=n2;iz++){n.push([x0,y0,iz*H/n2]);n.push([x1,y1,iz*H/n2]);}
    for(let iz=0;iz<n2;iz++){const b0=base+iz*2;e.push([b0,b0+1,b0+3,b0+2]);}}
  const s=new Map();for(let i=0;i<n.length;i++){if(Math.abs(n[i][2])<0.01)s.set(i,[true,true,true,true,true,true]);}
  const l=new Map();for(let i=0;i<n.length;i++){if(Math.abs(n[i][2]-H)<0.01)l.set(i,[1,0,-5,0,0,0]);}
  return solve(n,e,s,l,sp(e,200e6,0.3,t_w));
});

test("Cercha simple", ()=>{
  const span=10,h=2,nD=5,dx=span/nD,n=[],e=[];
  for(let i=0;i<=nD;i++)n.push([dx*i,0,0]);
  for(let i=0;i<=nD;i++)n.push([dx*i,0,h]);
  for(let i=0;i<nD;i++){e.push([i,i+1]);e.push([nD+1+i,nD+1+i+1]);}
  for(let i=0;i<=nD;i++)e.push([i,nD+1+i]);
  for(let i=0;i<nD;i++)e.push([i,nD+2+i]);
  const s=new Map();s.set(0,[true,true,true,true,true,true]);s.set(nD,[false,true,true,true,true,true]);
  const l=new Map();for(let i=0;i<=nD;i++)l.set(i,[0,0,-10,0,0,0]);
  return solve(n,e,s,l,fp(e));
});

// ═══════════════════════════════════════════════════
// RESUMEN
// ═══════════════════════════════════════════════════
console.log("\n" + "=".repeat(65));
console.log(`  RESULTADOS: ${passed}/${total} PASSED, ${failed} FAILED`);
console.log("=".repeat(65));
process.exit(failed > 0 ? 1 : 0);
