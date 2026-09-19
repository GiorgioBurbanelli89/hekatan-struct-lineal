/** Los desplegables deben DECIR lo que el modelo puede dar. */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname=dirname(fileURLToPath(import.meta.url));
const BASE="/hekatan-struct-lineal/"; const raiz=join(__dirname,"..","website","src","examples");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});r.end(fs.readFileSync(f));});
await new Promise(r=>srv.listen(4829,r));
const nav=await puppeteer.launch({headless:"new",executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage(); await pag.setViewport({width:1300,height:850});
const esp=m=>new Promise(r=>setTimeout(r,m));
const fallos=[]; const ok=(c,q,d="")=>{console.log((c?"  OK  ":"  --  ")+q+(d?"  |  "+d:"")); if(!c)fallos.push(q);};
const estado=()=>pag.evaluate(()=>{
  const el=(window.__hekatanStates?.elements?.rawVal??[]);
  const sels=[...document.querySelectorAll("select")];
  const mira=(marca)=>{ const s=sels.find(x=>[...x.options].some(o=>o.value===marca)); if(!s) return null;
    const rot=s.closest(".tp-lblv")?.querySelector(".tp-lblv_l")?.textContent?.trim();
    return {rotulo:rot, apagadas:[...s.options].filter(o=>o.disabled).length, total:s.options.length, valor:s.value}; };
  return { cascaras: el.filter(e=>e.length>=3).length, barras: el.filter(e=>e.length===2).length,
           shell: mira("M11"), frame: mira("Axial Force") }; });
for (const [id,desc] of [["edificio-aporticado","portico SIN cascaras"],["zapata-aislada","placa CON cascaras"]]) {
  await pag.goto(`http://localhost:4829${BASE}workspace/?t=${id}`,{waitUntil:"networkidle2",timeout:150000});
  await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:100000}); await esp(7000);
  const e=await estado();
  console.log(`\n${id} (${desc}): ${e.cascaras} cascaras, ${e.barras} barras`);
  console.log(`   shell -> ${JSON.stringify(e.shell)}`);
  console.log(`   frame -> ${JSON.stringify(e.frame)}`);
  if (e.cascaras===0) {
    ok(/sin cáscaras/i.test(e.shell?.rotulo||""),"sin cáscaras: el rótulo lo DICE",e.shell?.rotulo);
    ok(e.shell?.apagadas>0,"…y las opciones de cáscara están apagadas",`${e.shell?.apagadas}/${e.shell?.total}`);
  } else {
    ok(!/sin cáscaras/i.test(e.shell?.rotulo||""),"con losa: el desplegable de cáscara está disponible",e.shell?.rotulo);
    ok(e.shell?.apagadas===0,"…y ninguna opción apagada",`${e.shell?.apagadas} apagadas`);
  }
  ok(e.barras===0 ? /sin barras/i.test(e.frame?.rotulo||"") : e.frame?.apagadas===0,
     "el de barras concuerda con el modelo", e.frame?.rotulo);
}
await nav.close(); srv.close();
console.log(fallos.length?`\n${fallos.length} FALLO(S)`:"\nTodo correcto");
