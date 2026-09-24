import * as fs from "fs";
import { parseE2k } from "../examples/src/shared/e2kParser";
const m = parseE2k(fs.readFileSync(process.argv[2],"utf-8"));
let fr=0,tri=0,quad=0; for(const e of m.elements){ if(e.length===2)fr++; else if(e.length===3)tri++; else if(e.length===4)quad++; }
let xmin=1e9,xmax=-1e9,ymin=1e9,ymax=-1e9,zmin=1e9,zmax=-1e9;
for(const n of m.nodes){xmin=Math.min(xmin,n[0]);xmax=Math.max(xmax,n[0]);ymin=Math.min(ymin,n[1]);ymax=Math.max(ymax,n[1]);zmin=Math.min(zmin,n[2]);zmax=Math.max(zmax,n[2]);}
const ni:any=m.nodeInputs, ei:any=m.elementInputs;
let sumFz=0; for(const [,v] of (ni.loads||[])) sumFz+=(v[2]||0);
const E0=[...(ei.elasticities?.values()||[])][0];
console.log("unidades(post-conv):", m.units.force, m.units.length);
console.log("nodos:", m.nodes.length, "| frames:", fr, "| areas(quad):", quad, "tri:", tri);
console.log("extent:", (xmax-xmin).toFixed(1),"x",(ymax-ymin).toFixed(1),"m  alto:",(zmax-zmin).toFixed(1),"m");
console.log("apoyos:", ni.supports?.size||0, "| nodos c/carga:", ni.loads?.size||0, "| ΣFz:", sumFz.toFixed(0),"kN (~",(sumFz/9.80665).toFixed(0),"tonf)");
console.log("E:", E0? (E0/1e6).toFixed(1)+" GPa":"?");
