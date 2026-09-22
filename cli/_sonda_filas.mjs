// Sonda de 2 min: ¿los rectángulos de los mandos del modal se ven dentro de los 640 px?
import puppeteer from "puppeteer";
import { createServer } from "http";
import { existsSync, statSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2" };
const srv = createServer((req,res)=>{ let p=decodeURIComponent((req.url||"/").split("?")[0]);
  if(p.startsWith(BASE)) p=p.slice(BASE.length-1); let f=join(raiz,p);
  if(existsSync(f)&&statSync(f).isDirectory()) f=join(f,"index.html");
  if(!existsSync(f)){res.writeHead(404);return res.end("404");}
  res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); res.end(readFileSync(f)); });
await new Promise(r=>srv.listen(4782,r));
const nav = await puppeteer.launch({ headless:"new", args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width:1280, height:720, deviceScaleFactor:2 });
const esp = ms=>new Promise(r=>setTimeout(r,ms));
await pag.goto("http://localhost:4782"+BASE+"workspace/?t=test-m-dual",{waitUntil:"networkidle2",timeout:180000}).catch(()=>{});
await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000});
await esp(9000);
// abrir Sísmico NEC (derecha) como hace el capítulo
await pag.evaluate(()=>{ const f=[...document.querySelectorAll(".tp-fldv")].find(e=>(e.querySelector(".tp-fldv_t")?.textContent||"").includes("Sísmico NEC"));
  if(f&&f.classList.contains("tp-fldv-cpl")) f.querySelector(".tp-fldv_b").click(); });
await esp(1500);
const mira = (t,que)=>pag.evaluate((q)=>{
  const vis=e=>{const b=e.getBoundingClientRect(); return e.offsetParent!==null&&b.width>2&&b.height>2&&b.top>=0&&b.bottom<=640;};
  let cand=[];
  if(q.que==="boton") cand=[...document.querySelectorAll("button, .tp-btnv_b")].filter(x=>(x.textContent||"").includes(q.t));
  else if(q.que==="casilla"){ const f=[...document.querySelectorAll(".tp-lblv")].filter(x=>((x.querySelector(".tp-lblv_l")||{}).textContent||"").includes(q.t)&&x.offsetParent!==null)[0];
    const c=f&&(f.querySelector(".tp-ckbv_w")||f.querySelector("input[type=checkbox]")); cand=c?[c]:[]; }
  else cand=[...document.querySelectorAll(".tp-lblv")].filter(x=>((x.querySelector(".tp-lblv_l")||{}).textContent||"").includes(q.t));
  return cand.map(e=>{const b=e.getBoundingClientRect(); return {top:Math.round(b.top),bottom:Math.round(b.bottom),w:Math.round(b.width),vis:vis(e)};});
},{t,que});
console.log("--- ANTES ---");
for(const [t,q] of [["Mostrar espectro","casilla"],["Tabla de modos","casilla"],["Correr modal","boton"],["NEC Z","fila"]])
  console.log(t.padEnd(20), q.padEnd(8), JSON.stringify(await mira(t,q)));
// reproducir el destrozo de abrir(): desplazar el panel IZQUIERDO como hace el motor
const sc = await pag.evaluate(()=>{ const h=document.getElementById("hk-pane-host"); if(!h) return "no hay host";
  h.scrollTop += 640; return {id:"hk-pane-host", scrollTop:h.scrollTop, alto:h.scrollHeight, clase:h.className}; });
console.log("--- tras desplazar hk-pane-host:", JSON.stringify(sc));
for(const [t,q] of [["Mostrar espectro","casilla"],["Correr modal","boton"]])
  console.log(t.padEnd(20), q.padEnd(8), JSON.stringify(await mira(t,q)));
// ahora el ARREGLO: recolocar el contenedor propio y medir
const fix = (t,que)=>pag.evaluate((q)=>{
  const colocar=(e)=>{ let p=e.parentElement;
    while(p&&p!==document.body){ if(p.scrollHeight>p.clientHeight+4){
      const rp=p.getBoundingClientRect(), re=e.getBoundingClientRect();
      p.scrollTop += re.top-(rp.top+Math.min(rp.height,520)*0.35); break;} p=p.parentElement; } };
  let e=null;
  if(q.que==="boton") e=[...document.querySelectorAll("button, .tp-btnv_b")].filter(x=>(x.textContent||"").includes(q.t)&&x.offsetParent!==null)[0];
  else if(q.que==="casilla"){ const f=[...document.querySelectorAll(".tp-lblv")].filter(x=>((x.querySelector(".tp-lblv_l")||{}).textContent||"").includes(q.t)&&x.offsetParent!==null)[0];
    e=f&&(f.querySelector(".tp-ckbv_w")||f.querySelector("input[type=checkbox]")); }
  else e=[...document.querySelectorAll(".tp-lblv")].filter(x=>((x.querySelector(".tp-lblv_l")||{}).textContent||"").includes(q.t)&&x.offsetParent!==null&&x.getBoundingClientRect().width>2)[0];
  if(!e) return "no esta";
  colocar(e); const b=e.getBoundingClientRect();
  const ok = b.width>2&&b.height>2&&b.top>=0&&b.bottom<=640;
  return {top:Math.round(b.top),bottom:Math.round(b.bottom),w:Math.round(b.width),ok};
},{t,que});
console.log("--- CON EL ARREGLO ---");
for(const [t,q] of [["Mostrar espectro","casilla"],["Tabla de modos","casilla"],["Correr modal","boton"],["NEC Z","fila"]])
  console.log(t.padEnd(20), q.padEnd(8), JSON.stringify(await fix(t,q)));
await nav.close(); srv.close(); console.log("FIN");
