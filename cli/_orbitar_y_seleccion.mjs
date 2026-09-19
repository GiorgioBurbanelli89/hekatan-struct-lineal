/**
 * ¿CON QUE SE GIRA Y CON QUE SE SELECCIONA? (Jorge: «no hay forma de girar el objeto»)
 * Mide los tres gestos sobre el lienzo:
 *   izquierdo arrastrando  -> debe SELECCIONAR (ventana), sin mover la camara
 *   rueda pulsada          -> debe GIRAR (orbitar)
 *   Shift + rueda pulsada  -> debe MOVER (pan)
 */
import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/"; const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((q,r)=>{ let p=decodeURIComponent((q.url||"/").split("?")[0]);
  if(p.startsWith(BASE))p=p.slice(BASE.length-1); let f=join(raiz,p);
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");
  if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}
  r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); r.end(fs.readFileSync(f)); });
await new Promise(r=>srv.listen(4813,r));
const nav = await puppeteer.launch({ headless:"new",
  executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({width:1400,height:880});
const err=[]; pag.on("pageerror",e=>err.push(String(e).slice(0,140)));
const esp=m=>new Promise(r=>setTimeout(r,m));
const fallos=[]; const ok=(c,q,d="")=>{console.log((c?"  OK  ":"  --  ")+q+(d?"  |  "+d:"")); if(!c)fallos.push(q);};
await pag.goto(`http://localhost:4813${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000}); await esp(6000);
await pag.evaluate(()=>document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle","#hk-pane-toggle"]) {
  const b=await pag.evaluate(s=>{const e=document.querySelector(s); if(!e)return null;
    const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2};},id);
  if(b){await pag.mouse.click(b.x,b.y); await esp(500);} }
await pag.evaluate(()=>{ const v=document.querySelector("#viewer"),c=v.__ctx.camera;
  v.__ctx.controls.target.set(0,0,0); c.position.set(18,-16,12); c.up.set(0,0,1);
  c.lookAt(0,0,0); v.__ctx.controls.update?.(); v.__ctx.render?.();
  window.__hekatanDrawingPoints.val=[[-4,-4,0],[4,-4,0],[4,4,0],[-4,4,0]];
  window.__hekatanDrawingPolylines.val=[[0,1],[1,2],[2,3],[3,0]];
  window.__hekatanRebuild?.(); });
await esp(1200);
const cam=()=>pag.evaluate(()=>{const c=document.querySelector("#viewer").__ctx.camera;
  return [c.position.x,c.position.y,c.position.z].map(v=>+v.toFixed(2));});
const sel=()=>pag.evaluate(()=>window.__hekatanSelection?.size??0);
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);

// 1) IZQUIERDO arrastrando: debe seleccionar y NO mover la camara
const c0=await cam();
await pag.mouse.move(500,300); await pag.mouse.down();
await pag.mouse.move(900,600,{steps:10}); await esp(200); await pag.mouse.up(); await esp(700);
const c1=await cam(); const s1=await sel();
ok(s1>0, "IZQUIERDO arrastrando SELECCIONA", `${s1} objetos`);
ok(dist(c0,c1)<0.01, "...y NO mueve la camara", `${c0} -> ${c1}`);

// 2) RUEDA PULSADA = GIRAR (orbitar): la camara se mueve y el punto de mira NO
await pag.keyboard.press("Escape"); await esp(300);
const mira=()=>pag.evaluate(()=>{const t=document.querySelector("#viewer").__ctx.controls.target;
  return [t.x,t.y,t.z].map(v=>+v.toFixed(2));});
const c2=await cam(), t2=await mira();
await pag.mouse.move(700,450); await pag.mouse.down({button:"middle"});
await pag.mouse.move(850,380,{steps:12}); await esp(250); await pag.mouse.up({button:"middle"}); await esp(700);
const c3=await cam(), t3=await mira();
ok(dist(c2,c3)>0.5, "RUEDA PULSADA = GIRAR (orbitar)", `${c2} -> ${c3}`);
ok(dist(t2,t3)<0.05, "...y el punto de mira no se mueve (es giro, no encuadre)", `mira ${t2} -> ${t3}`);

// 3) BOTON DERECHO = ENCUADRAR (pan): el punto de mira SI se mueve
await pag.mouse.move(700,450); await pag.mouse.down({button:"right"});
await pag.mouse.move(800,520,{steps:10}); await esp(250); await pag.mouse.up({button:"right"}); await esp(700);
const t4=await mira();
ok(dist(t3,t4)>0.2, "BOTON DERECHO = ENCUADRAR (pan)", `mira ${t3} -> ${t4}`);
ok(err.length===0,"sin errores de pagina",err.slice(0,2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length?`\n${fallos.length} FALLO(S)`:"\nTodo correcto");
process.exit(fallos.length?1:0);
