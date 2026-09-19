// Corre stripDesign.ts sobre el radier (fuerzas de SAFE) y vuelca estaciones + Start/Middle/End a JSON para la evidencia.
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../../../../tests/lib/bundle.mjs";
const D = JSON.parse(readFileSync("tests/datos/radier_franjas_safe.json", "utf-8"));
const mod = await empaquetar(`export * from "${R}/examples/src/shared/stripDesign";\n`, "sd");
const K = ["F11","F22","F12","M11","M22","M12","V13","V23"]; const toF = a => Object.fromEntries(K.map((k,i)=>[k,a[i]]));
const elems = D.elems.map(e => ({ id:e.id, xy:e.xy, h:e.h, design:e.design, footing:e.footing,
  forces: e.forces.Dead.map((_,k)=>toF(K.map((_,i)=>Object.entries(D.combo).reduce((s,[c,f])=>s+f*e.forces[c][k][i],0)))) }));
const cut = new mod.StripCutter(elems, D.prefs); const S = Object.fromEntries(D.strips.map(s=>[s.name,s]));
const est = {};
for (const r of D.stations) (est[r.strip] ??= []).push(cut.designStation(S[r.strip], r.station));
const zonas = [];
for (const n of Object.keys(est)) for (const z of mod.summarizeSpans(est[n], D.spans.filter(s=>s.strip===n), 0.1)) zonas.push({ strip:n, ...z });
writeFileSync(process.argv[2], JSON.stringify({ est: Object.fromEntries(Object.entries(est).map(([k,v])=>[k, v.map(s=>({station:s.station,x:s.x,y:s.y,AsTop:s.AsTop,AsBot:s.AsBot,width:s.width,V:s.V}))])), zonas }));
console.log("ok", zonas.length);
