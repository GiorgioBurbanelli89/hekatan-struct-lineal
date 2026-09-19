/**
 * De las 19 opciones de «Shell results», ¿cuales DAN datos en este modelo y cuales
 * salen vacias? (Jorge: «en algunos elementos no me estas dando para escoger otros
 * resultados»). Se elige cada una y se mira si hay valores en el colormap.
 *   node cli/_resultados_vacios.mjs [id]
 */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname=dirname(fileURLToPath(import.meta.url));
const BASE="/hekatan-struct-lineal/"; const raiz=join(__dirname,"..","website","src","examples");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});r.end(fs.readFileSync(f));});
await new Promise(r=>srv.listen(4827,r));
const nav=await puppeteer.launch({headless:"new",executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage(); await pag.setViewport({width:1300,height:850});
const esp=m=>new Promise(r=>setTimeout(r,m));
const ID = process.argv[2] || "edificio-aporticado";
await pag.goto(`http://localhost:4827${BASE}workspace/?t=${ID}`,{waitUntil:"networkidle2",timeout:180000});
await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000}); await esp(8000);
const CAMPOS=["membraneXX","membraneYY","membraneXY","membranePrincipalMax","membranePrincipalMin","vonMises",
  "tranverseShearX","tranverseShearY","transverseShearMax","bendingXX","bendingYY","bendingXY",
  "bendingPrincipalMax","bendingPrincipalMin","pressure","displacementX","displacementY","displacementZ"];
console.log(`modelo: ${ID}`);
const hayShells = await pag.evaluate(()=> (window.__hekatanStates?.elements?.rawVal??[]).filter(e=>e.length>=3).length);
const hayBarras = await pag.evaluate(()=> (window.__hekatanStates?.elements?.rawVal??[]).filter(e=>e.length===2).length);
console.log(`  ${hayShells} cascaras · ${hayBarras} barras`);
const vacios=[], conDatos=[];
for (const campo of CAMPOS) {
  await pag.evaluate(c=>{ const s=window.__hekatanSettings?.(); if (s?.shellResults) s.shellResults.val=c; }, campo);
  await esp(500);
  const r = await pag.evaluate(()=>{
    let n=0, min=Infinity, max=-Infinity, nan=0;
    document.querySelector("#viewer").__ctx.scene.traverse(o=>{
      const a=o.geometry?.attributes?.scalar; if(!a) return;
      for (let i=0;i<a.count;i++){ const v=a.getX(i); if(!isFinite(v)){nan++;continue;} n++; if(v<min)min=v; if(v>max)max=v; }
    });
    return {n, min:isFinite(min)?+min.toPrecision(3):null, max:isFinite(max)?+max.toPrecision(3):null, nan};
  });
  const vacio = r.n===0 || (r.min===0 && r.max===0);
  (vacio?vacios:conDatos).push(campo);
  console.log(`  ${vacio?"--":"OK"}  ${campo.padEnd(24)} n=${String(r.n).padStart(5)}  rango ${r.min} .. ${r.max}${r.nan?`  NaN=${r.nan}`:""}`);
}
console.log(`\n  CON datos (${conDatos.length}): ${conDatos.join(", ")}`);
console.log(`  VACIOS   (${vacios.length}): ${vacios.join(", ")}`);
await nav.close(); srv.close();
