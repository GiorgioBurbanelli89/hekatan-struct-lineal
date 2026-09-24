/** ¿ESC cancela? (Jorge: «ahora esc no sirve para cancelar»). Se prueban los tres casos. */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE="/hekatan-struct-lineal/"; const raiz=join(__dirname,"..","website","src","examples");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});r.end(fs.readFileSync(f));});
await new Promise(r=>srv.listen(4817,r));
const nav=await puppeteer.launch({headless:"new",executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage(); await pag.setViewport({width:1400,height:880});
const err=[]; pag.on("pageerror",e=>err.push(String(e).slice(0,140)));
const esp=m=>new Promise(r=>setTimeout(r,m));
const fallos=[]; const ok=(c,q,d="")=>{console.log((c?"  OK  ":"  --  ")+q+(d?"  |  "+d:"")); if(!c)fallos.push(q);};
await pag.goto(`http://localhost:4817${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000}); await esp(6000);
await pag.evaluate(()=>document.getElementById("hk-ribbon-guia")?.remove());
for(const id of ["#hk-settings-toggle","#hk-pane-toggle"]){const b=await pag.evaluate(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};},id); if(b){await pag.mouse.click(b.x,b.y); await esp(500);} }
const boton=(f)=>pag.evaluate(f=>{const b=[...document.querySelectorAll("#hk-ribbon button")].find(e=>e.offsetParent!==null&&new RegExp(f).test((e.textContent||"")+" "+(e.title||"")));if(!b)return null;const r=b.getBoundingClientRect();const c={x:r.left+r.width/2,y:r.top+r.height/2};return c.x<=window.innerWidth?c:null;},f);
const tool=()=>pag.evaluate(()=>window.__hekatanCadState?.get?.()?.tool??null);
const nSel=()=>pag.evaluate(()=>window.__hekatanSelection?.size??0);
const nPts=()=>pag.evaluate(()=>(window.__hekatanDrawingPoints?.rawVal??[]).length);

// 1) Esc cancela la HERRAMIENTA activa
const bl=await boton("Línea"); await pag.mouse.click(bl.x,bl.y); await esp(600);
const t1=await tool();
await pag.keyboard.press("Escape"); await esp(600);
const t2=await tool();
ok(t1==="line","se activa la herramienta Línea",`tool=${t1}`);
ok(t2!=="line","Esc CANCELA la herramienta",`${t1} -> ${t2}`);

// 2) Esc cancela un dibujo a medias (un punto puesto, sin cerrar)
const bl2=await boton("Línea"); await pag.mouse.click(bl2.x,bl2.y); await esp(500);
await pag.mouse.click(600,400); await esp(400);       // primer punto
const p1=await nPts();
await pag.keyboard.press("Escape"); await esp(600);
await pag.mouse.move(800,500); await esp(300);
const p2=await nPts();
ok(p2<=p1,"Esc corta el dibujo a medias (no sigue la goma)",`${p1} -> ${p2} nudos`);

// 3) Esc limpia la SELECCIÓN
await pag.evaluate(()=>{window.__hekatanDrawingPoints.val=[[-3,-3,0],[3,-3,0]];window.__hekatanDrawingPolylines.val=[[0,1]];window.__hekatanRebuild?.();});
await esp(800);
await pag.evaluate(()=>window.__hekatanCadState?.setTool?.("select")); await esp(300);
await pag.mouse.move(400,300); await pag.mouse.down(); await pag.mouse.move(1000,600,{steps:8}); await pag.mouse.up(); await esp(700);
const s1=await nSel();
console.log("       foco antes de Esc:", await pag.evaluate(()=>{const a=document.activeElement; return a? (a.id||a.tagName):"?";}));
// ¿llega el Escape a window? se cuenta con un espia
await pag.evaluate(()=>{ window.__escVistos=0;
  window.addEventListener("keydown", e=>{ if(e.key==="Escape") window.__escVistos++; }); });
await pag.keyboard.press("Escape"); await esp(600);
console.log("       Escape que llegaron a window:", await pag.evaluate(()=>window.__escVistos));
const s2=await nSel();
ok(s1>0,"hay algo seleccionado",`${s1}`);
ok(s2===0,"Esc LIMPIA la selección",`${s1} -> ${s2}`);
ok(err.length===0,"sin errores de página",err.slice(0,2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length?`\n${fallos.length} FALLO(S)`:"\nTodo correcto");
process.exit(fallos.length?1:0);
