// Flexibilidad 9x9 de UN Q4 de membrana en Hekatan vs ETABS (memb12.json), por drillingType.
import { readFileSync } from "node:fs";
import { empaquetar, R } from "./lib/bundle.mjs";
const { deform } = await empaquetar(`export { deform } from "${R}/hekatan-fem/src/index";\n`, "flex");
const ref = JSON.parse(readFileSync(process.argv[2] ?? "C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/galpon-bodega-electoral/memb12.json", "utf-8"));
const tipos = (process.argv[3] ?? "0,1,2,3,8,13,14").split(",").map(Number);
const SUJ = [[0,0],[0,1],[1,1]];
function flex(c, tipo, escala) {
  const nodes = c.pts.map((p) => [p[0],p[1],p[2]??0]);
  const sup = new Map(); 
  c.pts.forEach((_,i)=>{ const r=[false,false,true,true,true,false]; SUJ.forEach(([n,k])=>{ if(n===i) r[k]=true;}); sup.set(i,r);});
  const m = (v)=>new Map([[0,v]]);
  const n = c.libres.length, F = Array.from({length:n},()=>Array(n).fill(0));
  c.libres.forEach(([nn,kk],col)=>{
    const f=[0,0,0,0,0,0]; f[kk<2?kk:5]=1;
    const d = deform(nodes,[[0,1,2,3]],{supports:sup,loads:new Map([[nn,f]])},{
      thicknesses:m(c.t),elasticities:m(c.E),poissonsRatios:m(c.nu),densities:m(0),
      drillingTypes:m(tipo), ...(process.env.MEMB?{bendingModifiers:m(0)}:{}), ...(escala!=null?{drillingPenaltyScales:m(escala)}:{})});
    c.libres.forEach(([n2,k2],fila)=>{ F[fila][col]=d.deformations.get(n2)[k2<2?k2:5]; });
  });
  return F;
}
export { flex };
if (process.argv[1].endsWith("_membrana_flex.mjs")) {
  for (const [nom,c] of Object.entries(ref)) {
    const out=[];
    for (const t of tipos) {
      const F=flex(c,t); let mx=0, mxd=0;
      for(let i=0;i<9;i++)for(let j=0;j<9;j++){ const e=Math.abs(F[i][j]-c.F[i][j]); mx=Math.max(mx,e/Math.abs(c.F[i][i]*c.F[j][j])**0.5); }
      for(let i=0;i<9;i++){ mxd=Math.max(mxd,Math.abs(F[i][i]/c.F[i][i]-1)*100); }
      out.push(`t${t}: diag ${mxd.toFixed(1)}% full ${(mx*100).toFixed(1)}%`);
    }
    console.log(nom.padEnd(15), out.join(" | "));
  }
}
