/**
 * ¿Cuantas opciones ofrece «Shell results» y «Frame results» en cada ejemplo?
 * (Jorge: «en algunos elementos no me estas dando para escoger otros resultados»)
 * El catalogo completo es 19 shell + 13 frame; algunos ejemplos lo recortan con
 * `availableShellResults`, y otros lo dejan VACIO.
 */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname=dirname(fileURLToPath(import.meta.url));
const BASE="/hekatan-struct-lineal/"; const raiz=join(__dirname,"..","website","src","examples");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});r.end(fs.readFileSync(f));});
await new Promise(r=>srv.listen(4825,r));
const nav=await puppeteer.launch({headless:"new",executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage(); await pag.setViewport({width:1300,height:850});
const esp=m=>new Promise(r=>setTimeout(r,m));
const IDS = process.argv.slice(2).length ? process.argv.slice(2)
  : ["zapata-aislada","edificio-aporticado","plantillas","conexion-bfp","columna-cft","galpon","cerramiento","new-blank"];
const opciones=()=>pag.evaluate(()=>{
  const out={};
  for (const s of document.querySelectorAll("select")) {
    const fila = s.closest(".tp-lblv")?.querySelector(".tp-lblv_l")?.textContent?.trim();
    if (!fila) continue;
    if (/Shell results|Frame results|Node results/i.test(fila))
      out[fila] = [...s.options].map(o=>o.textContent.trim());
  }
  return out; });
console.log("ejemplo".padEnd(24), "shell", "frame");
for (const id of IDS) {
  try {
    await pag.goto(`http://localhost:4825${BASE}workspace/?t=${id}`,{waitUntil:"networkidle2",timeout:120000});
    await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:90000}); await esp(5000);
    const o = await opciones();
    const sh = Object.entries(o).find(([k])=>/Shell/i.test(k))?.[1] ?? [];
    const fr = Object.entries(o).find(([k])=>/Frame/i.test(k))?.[1] ?? [];
    console.log(id.padEnd(24), String(sh.length).padStart(5), String(fr.length).padStart(5),
                sh.length<=1 ? "  <-- SIN opciones de shell" : (sh.length<19?"  <-- recortado":""));
  } catch(e) { console.log(id.padEnd(24), " error:", String(e).slice(0,60)); }
}
await nav.close(); srv.close();
