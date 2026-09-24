import { testMDual } from "../examples/src/test-m/testM";
import { modalAnalysis } from "../hekatan-fem/src/index";  // C++ WASM (el real del workspace)
const store:any={}; const states:any=new Proxy(store,{get(t,k:string){if(!(k in t))t[k]={val:undefined};return t[k];}});
const params:any={}; for(const[k,d]of Object.entries(testMDual.params))params[k]=(d as any).default;
const dyn=(testMDual as any).dynamicParams?.(params)??{}; for(const[k,d]of Object.entries(dyn))if(!(k in params))params[k]=(d as any).default;
params.ms=2.5;
testMDual.build(params,states);
const nodes=states.nodes.val, elements=states.elements.val, ni=states.nodeInputs.val, ei=states.elementInputs.val;
const eiMass={...ei, densities:new Map([...ei.densities].map(([k,v]:[number,number])=>[k,v/9.80665]))};
const out:any=modalAnalysis(nodes, elements, ni, eiMass, 12);
console.log("=== MODAL C++ Hekatan Struct (test-m-dual, ms=2.5) ===");
console.log("Modo | f(Hz) | T(s) | MPF Ux% | MPF Uy% | MPF Rz%");
const mp=out.massParticipation||[];
out.frequencies.slice(0,6).forEach((f:number,i:number)=>{
  const m=mp[i]||{}; const ux=((m.ux??m.Ux??0)*100), uy=((m.uy??m.Uy??0)*100), rz=((m.rz??m.Rz??0)*100);
  console.log(`  ${i+1}  | ${f.toFixed(4)} | ${(1/f).toFixed(4)} | ${ux.toFixed(1)} | ${uy.toFixed(1)} | ${rz.toFixed(1)}`);
});
console.log("ETABS ref: T1=0.5343 T2=0.4798 T3=0.1699 s");
