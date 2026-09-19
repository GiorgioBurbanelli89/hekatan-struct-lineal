/** ¿Que opciones quedan activas y cuales en gris «(sin datos)» en cada modelo? */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname=dirname(fileURLToPath(import.meta.url));
const BASE="/hekatan-struct-lineal/"; const raiz=join(__dirname,"..","website","src","examples");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});r.end(fs.readFileSync(f));});
await new Promise(r=>srv.listen(4831,r));
const nav=await puppeteer.launch({headless:"new",executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage(); await pag.setViewport({width:1300,height:850});
const esp=m=>new Promise(r=>setTimeout(r,m));
const fallos=[]; const ok=(c,q,d="")=>{console.log((c?"  OK  ":"  --  ")+q+(d?"  |  "+d:"")); if(!c)fallos.push(q);};
const ver=()=>pag.evaluate(()=>{
  const s=[...document.querySelectorAll("select")].find(x=>[...x.options].some(o=>o.value==="M11"));
  if(!s) return null;
  return { activas:[...s.options].filter(o=>!o.disabled).map(o=>o.value),
           grises:[...s.options].filter(o=>o.disabled).map(o=>o.value) }; });
for (const id of ["plate-thin","zapata-aislada","edificio-aporticado"]) {
  await pag.goto(`http://localhost:4831${BASE}workspace/?t=${id}`,{waitUntil:"networkidle2",timeout:150000});
  await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:100000}); await esp(8000);
  const v=await ver();
  console.log(`\n${id}`);
  console.log(`   activas (${v.activas.length}): ${v.activas.join(", ")}`);
  console.log(`   grises  (${v.grises.length}): ${v.grises.join(", ")}`);
  if (id==="plate-thin") {
    ok(v.activas.includes("M12"),"la placa ofrece M12 (momento TORSOR)");
    ok(v.activas.includes("M11")&&v.activas.includes("M22"),"…y M11 / M22");
  }
  if (id==="edificio-aporticado") ok(v.activas.length<=1,"el portico sin cascaras no ofrece resultados de cascara",`${v.activas.length} activas`);
}
await nav.close(); srv.close();
console.log(fallos.length?`\n${fallos.length} FALLO(S)`:"\nTodo correcto");
