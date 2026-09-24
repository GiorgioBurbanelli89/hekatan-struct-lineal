import puppeteer from "puppeteer"; import { createServer } from "http";
import { existsSync, statSync, readFileSync } from "fs"; import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE="/hekatan-struct-lineal/"; const raiz=join(__dirname,"..","website","src","examples");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);
 let f=join(raiz,p); if(existsSync(f)&&statSync(f).isDirectory())f=join(f,"index.html");
 if(!existsSync(f)){r.writeHead(404);return r.end("404");} r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); r.end(readFileSync(f));});
await new Promise(r=>srv.listen(4783,r));
const nav=await puppeteer.launch({headless:"new",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
const pag=await nav.newPage(); await pag.setViewport({width:1280,height:720,deviceScaleFactor:2});
const esp=ms=>new Promise(r=>setTimeout(r,ms));
await pag.goto("http://localhost:4783"+BASE+"workspace/?t=test-m-dual",{waitUntil:"networkidle2",timeout:180000}).catch(()=>{});
await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000}); await esp(9000);
const est=(t)=>pag.evaluate((t)=>{
  const tit=[...document.querySelectorAll(".tp-fldv_t")].filter(x=>x.offsetParent!==null&&(x.textContent||"").includes(t))[0];
  if(!tit) return "NO ESTA"; const f=tit.closest(".tp-fldv");
  const cont=f.querySelector(":scope > .tp-fldv_c");
  return {cpl:f.classList.contains("tp-fldv-cpl"), exp:f.classList.contains("tp-fldv-expanded"),
          alto:Math.round(cont?cont.getBoundingClientRect().height:0)};},t);
for(const t of ["Analyze","Modal + Animación","Sísmico NEC","Grid"]) console.log(t.padEnd(22), JSON.stringify(await est(t)));
await nav.close(); srv.close(); console.log("FIN");
