import { testMDual } from "../examples/src/test-m/testM";
import { deform as deformTS } from "../hekatan-fem/src/deform";  // mathjs TS (shellQ4 MITC4)
const store:any={}; const states:any=new Proxy(store,{get(t,k:string){if(!(k in t))t[k]={val:undefined};return t[k];}});
const params:any={}; for(const[k,d]of Object.entries(testMDual.params))params[k]=(d as any).default;
const dyn=(testMDual as any).dynamicParams?.(params)??{}; for(const[k,d]of Object.entries(dyn))if(!(k in params))params[k]=(d as any).default;
params.ms=2.5;
testMDual.build(params,states);  // setea nodes/elements/inputs (el solve interno es C++)
const nodes=states.nodes.val, elements=states.elements.val, ni=states.nodeInputs.val, ei=states.elementInputs.val;
// ETABS default: Timoshenko (corte de viga) → inyectar shearAreas=5/6·A en frames
const saZ=new Map<number,number>(), saY=new Map<number,number>();
elements.forEach((e:number[],i:number)=>{ if(e.length===2){ const A=ei.areas?.get(i)??0; saZ.set(i,5/6*A); saY.set(i,5/6*A); } });
ei.shearAreasZ=saZ; ei.shearAreasY=saY;
console.log(`modelo: ${nodes.length} nodos, ${elements.length} elem · Timoshenko shearAreas=5/6·A`);
const t0=Date.now();
const dout:any=deformTS(nodes,elements,ni,ei);  // ← deform TS (mathjs, shellQ4 MITC4)
let uz=0; dout.deformations.forEach((d:number[])=>{if(d[2]<uz)uz=d[2];});
console.log(`Hekatan deform.ts (mathjs, shellQ4 MITC4): U3=${(uz*1000).toFixed(4)}mm  (${Date.now()-t0}ms)`);
console.log(`numpy (port shellQ4 MITC4):                U3=-1.7435mm`);
console.log(`Hekatan C++ deformCpp (Kirchhoff pf=1):    U3=-3.90mm  (otra formulación)`);
