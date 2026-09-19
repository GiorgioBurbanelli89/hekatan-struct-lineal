/**
 * ¿SE RESALTA lo seleccionado? (Jorge: «selecciono todos los elementos y no se resaltan»)
 * Dibuja barras + un area + un solido, selecciona TODO de izq→der, y saca fotogramas
 * ANTES y DESPUES para compararlos, midiendo ademas cuantos objetos hay en el grupo de
 * resaltado de la escena.
 */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname,"shots","resaltado"); fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
const BASE="/hekatan-struct-lineal/"; const raiz=join(__dirname,"..","website","src","examples");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});r.end(fs.readFileSync(f));});
await new Promise(r=>srv.listen(4819,r));
const nav=await puppeteer.launch({headless:"new",executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage(); await pag.setViewport({width:1400,height:880});
const err=[]; pag.on("pageerror",e=>err.push(String(e).slice(0,140)));
const esp=m=>new Promise(r=>setTimeout(r,m));
const fallos=[]; const ok=(c,q,d="")=>{console.log((c?"  OK  ":"  --  ")+q+(d?"  |  "+d:"")); if(!c)fallos.push(q);};
await pag.goto(`http://localhost:4819${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000}); await esp(6000);
await pag.evaluate(()=>document.getElementById("hk-ribbon-guia")?.remove());
for(const id of ["#hk-settings-toggle","#hk-pane-toggle"]){const b=await pag.evaluate(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};},id); if(b){await pag.mouse.click(b.x,b.y); await esp(500);} }
// un portico con BARRAS y un PANO (area)
await pag.evaluate(()=>{
  const v=document.querySelector("#viewer"),c=v.__ctx.camera;
  v.__ctx.controls.target.set(3,2,1.5); c.position.set(16,-14,10); c.up.set(0,0,1);
  c.lookAt(3,2,1.5); v.__ctx.controls.update?.(); v.__ctx.render?.();
  window.__hekatanDrawingPoints.val=[[0,0,0],[6,0,0],[6,4,0],[0,4,0],   // 0-3 pano
                                     [0,0,0],[0,0,3],[6,0,0],[6,0,3]];  // 4-7 dos columnas
  window.__hekatanDrawingPolylines.val=[[0,1,2,3,0],[4,5],[6,7]];
  window.__hekatanDrawingAreas.val=[0];
  window.__hekatanRebuild?.();
});
await esp(2000);
const resaltados=()=>pag.evaluate(()=>{
  let n=0; document.querySelector("#viewer").__ctx.scene.traverse(o=>{
    const nm=String(o.name||"");
    if (/sel|highlight|resalt/i.test(nm) && o.visible && (o.children?.length || o.geometry)) n++;
  });
  return n; });
await pag.screenshot({path:join(OUT,"01_antes.png")});
const r0=await resaltados();
await pag.evaluate(()=>window.__hekatanCadState?.setTool?.("select")); await esp(400);
// izq -> der abarcando TODO
await pag.mouse.move(250,180); await pag.mouse.down();
await pag.mouse.move(1250,760,{steps:12}); await esp(300); await pag.mouse.up(); await esp(1200);
const sel=await pag.evaluate(()=>[...(window.__hekatanSelection??[])]);
const r1=await resaltados();
await pag.screenshot({path:join(OUT,"02_despues.png")});
console.log("       seleccionados:", JSON.stringify(sel));
console.log(`       objetos de resaltado en la escena: ${r0} -> ${r1}`);
ok(sel.length>0,"la ventana izq→der selecciona",`${sel.length} objetos`);
ok(sel.some(k=>k.startsWith("poly:")),"…incluye el PAÑO (área)",sel.filter(k=>k.startsWith("poly:")).join(","));
ok(sel.filter(k=>k.startsWith("seg:")).length>=2,"…incluye las BARRAS",sel.filter(k=>k.startsWith("seg:")).length+" barras");
ok(r1>r0,"y aparece resaltado en la escena",`${r0} -> ${r1}`);
// ¿cambian los PIXELES? dos capturas comparadas
const [a,b]=[fs.readFileSync(join(OUT,"01_antes.png")),fs.readFileSync(join(OUT,"02_despues.png"))];
ok(Buffer.compare(a,b)!==0,"y la imagen CAMBIA (se ve distinto)",`${a.length} vs ${b.length} bytes`);
ok(err.length===0,"sin errores de página",err.slice(0,2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length?`\n${fallos.length} FALLO(S)`:"\nTodo correcto");
