// Valida CM/CR (centroMasaRigidez.ts) con el motor C++ + diafragma rígido sobre edificio_muro.
// Python: CM=(1.854,2.000)  CR=(0.063,2.000)
import { deformCpp } from "./src/deformCpp.ts";
import { computeCMCR } from "../examples/src/shared/centroMasaRigidez.ts";

const E=2534564,nu=0.20,rho=2.40277,G=E/(2*(1+nu)),LX=4,LY=4,H=3,ms=1,tW=0.25,tS=0.10;
const nx=LX/ms,ny=LY/ms,nz=H/ms;
const nodes:number[][]=[]; const key=new Map<string,number>();
const nid=(x:number,y:number,z:number)=>{const k=`${x},${y},${z}`;let i=key.get(k);if(i===undefined){i=nodes.length;nodes.push([x,y,z]);key.set(k,i);}return i;};
const elements:number[][]=[]; const kinds:string[]=[];
for(let j=0;j<ny;j++)for(let k=0;k<nz;k++){elements.push([nid(0,j,k),nid(0,j+1,k),nid(0,j+1,k+1),nid(0,j,k+1)]);kinds.push("wall");}
for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){elements.push([nid(i,j,H),nid(i+1,j,H),nid(i+1,j+1,H),nid(i,j+1,H)]);kinds.push("slab");}
for(const yv of [0,LY])for(let k=0;k<nz;k++){elements.push([nid(LX,yv,k),nid(LX,yv,k+1)]);kinds.push("col");}
for(let i=0;i<nx;i++){elements.push([nid(i,0,H),nid(i+1,0,H)]);kinds.push("beam");}
for(let i=0;i<nx;i++){elements.push([nid(i,LY,H),nid(i+1,LY,H)]);kinds.push("beam");}
for(let j=0;j<ny;j++){elements.push([nid(LX,j,H),nid(LX,j+1,H)]);kinds.push("beam");}
for(let j=0;j<ny;j++){elements.push([nid(0,j,H),nid(0,j+1,H)]);kinds.push("beam");}
const nNodes0=nodes.length;
const top=nodes.map((p,i)=>[p,i] as [number[],number]).filter(([p])=>Math.abs(p[2]-H)<1e-9).map(([,i])=>i);

// masa lateral por nudo top (tributaria de losa + muro top)
const masses=new Map<number,number>();
kinds.forEach((k,e)=>{ if(k!=="wall"&&k!=="slab")return; const t=k==="wall"?tW:tS; const p=elements[e].map(n=>nodes[n]);
  const a=Math.hypot(...[0,1,2].map(d=>p[2][d]-p[0][d])), b=Math.hypot(...[0,1,2].map(d=>p[3][d]-p[1][d]));
  const A=0.5*Math.abs(a*b); const me=rho*A*t/4; for(const n of elements[e]){ if(Math.abs(nodes[n][2]-H)<1e-9) masses.set(n,(masses.get(n)??0)+me);} });

// DIAFRAGMA RIGIDO: master en (centroide, H) + links rigidos a cada nudo top
const xg=top.reduce((s,n)=>s+nodes[n][0],0)/top.length, yg=top.reduce((s,n)=>s+nodes[n][1],0)/top.length;
const master=nid(xg,yg,H);
const thicknesses=new Map(),elasticities=new Map(),poissonsRatios=new Map(),densities=new Map(),
  plateFormulations=new Map(),drillingTypes=new Map(),areas=new Map(),momentsOfInertiaY=new Map(),
  momentsOfInertiaZ=new Map(),torsionalConstants=new Map(),shearModuli=new Map();
const Ac=0.16,Ic=0.4**4/12,Jc=0.141*0.4**4,Av=0.15,Iyv=0.3*0.5**3/12,Izv=0.5*0.3**3/12,Jv=0.3*0.5**3/12+0.5*0.3**3/12;
kinds.forEach((k,e)=>{elasticities.set(e,E);poissonsRatios.set(e,nu);densities.set(e,rho);
  if(k==="wall"||k==="slab"){thicknesses.set(e,k==="wall"?tW:tS);plateFormulations.set(e,1);drillingTypes.set(e,2);}
  else{shearModuli.set(e,G);if(k==="col"){areas.set(e,Ac);momentsOfInertiaY.set(e,Ic);momentsOfInertiaZ.set(e,Ic);torsionalConstants.set(e,Jc);}else{areas.set(e,Av);momentsOfInertiaY.set(e,Iyv);momentsOfInertiaZ.set(e,Izv);torsionalConstants.set(e,Jv);}}});
// links rigidos (frames muy rigidos master->top)
const ER=E*1e4;
for(const t of top){ const e=elements.length; elements.push([master,t]); kinds.push("link");
  elasticities.set(e,ER);shearModuli.set(e,ER/(2*(1+nu)));areas.set(e,10);momentsOfInertiaY.set(e,10);momentsOfInertiaZ.set(e,10);torsionalConstants.set(e,10);}

const supports=new Map<number,boolean[]>();
nodes.forEach((p,i)=>{ if(Math.abs(p[2])<1e-9) supports.set(i,[true,true,true,true,true,true]); });
const ei={thicknesses,elasticities,poissonsRatios,densities,plateFormulations,drillingTypes,areas,momentsOfInertiaY,momentsOfInertiaZ,torsionalConstants,shearModuli};

async function rzFor(load:[number,number,number,number,number,number]):Promise<number>{
  const loads=new Map<number,number[]>(); loads.set(master,load);
  const out=await deformCpp(nodes as any,elements as any,{supports,loads} as any,ei as any);
  return out.deformations.get(master)![5];
}
const rzFx=await rzFor([1,0,0,0,0,0]), rzFy=await rzFor([0,1,0,0,0,0]), rzMz=await rzFor([0,0,0,0,0,1]);
const res=computeCMCR(nodes as any,masses,top,{idx:master,x:xg,y:yg,z:H},()=>0); // cm only here
res.cr={x:xg-rzFy/rzMz,y:yg+rzFx/rzMz}; res.ecc={ex:res.cm.x-res.cr.x,ey:res.cm.y-res.cr.y};
console.log("Hekatan Struct (C++) — CM/CR del edificio_muro (diafragma rígido):");
console.log(`  CM = (${res.cm.x.toFixed(3)}, ${res.cm.y.toFixed(3)})   Python (1.854, 2.000)`);
console.log(`  CR = (${res.cr.x.toFixed(3)}, ${res.cr.y.toFixed(3)})   Python (0.063, 2.000)`);
console.log(`  e  = (${res.ecc.ex.toFixed(3)}, ${res.ecc.ey.toFixed(3)})  [excentricidad natural]`);
