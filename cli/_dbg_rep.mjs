import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http"; import { join, extname } from "path";
const BASE="/hekatan-struct-lineal/", raiz="website/src/examples";
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]); if(p.startsWith(BASE))p=p.slice(BASE.length-1);
 let f=join(raiz,p); if(existsSync(f)&&statSync(f).isDirectory())f=join(f,"index.html");
 if(!existsSync(f)){r.writeHead(404);return r.end("404");} r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); r.end(readFileSync(f));});
await new Promise(r=>srv.listen(4748,r));
const nav=await puppeteer.launch({headless:"new",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage(); await pag.setViewport({width:1280,height:720});
const esp=(ms)=>new Promise(r=>setTimeout(r,ms));
await pag.goto(`http://localhost:4748${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
await esp(6000);
await pag.evaluate(()=>document.getElementById("hk-ribbon-guia")?.remove());
// una linea por la API interna, sin pasar por el input
await pag.evaluate(()=>{ const R=window.__hekatanCadRun;
  R("l"); R("0,0,0"); R("0,0,3.2"); });
await esp(900);
console.log("tras dibujar:", await pag.evaluate(()=>({ n:(window.__hekatanDrawingPoints?.val||[]).length })));
// seleccionar por VENTANA (clic-clic), como el usuario
await pag.evaluate(()=>window.__hekatanCadRun("s")); await esp(400);
await pag.mouse.click(380, 300); await esp(300);
await pag.mouse.click(950, 590); await esp(600);
const s1 = await pag.evaluate(()=>window.__hekatanSelectionSize?.());
console.log("seleccion tras ventana:", s1);
// por la API, que es lo que hace el input al pulsar Enter
await pag.evaluate(()=>window.__hekatanCadRun("rep 0,0,3.1")); await esp(1000);
console.log("A) rep con argumentos:", await pag.evaluate(()=>{
  const p=window.__hekatanDrawingPoints?.val||[];
  return { n:p.length, cotas:[...new Set(p.map(q=>+q[2].toFixed(2)))].sort((a,b)=>a-b) }; }));
// y ahora por el INPUT, como el usuario
await pag.evaluate(()=>window.__hekatanCadRun("s")); await esp(300);
await pag.mouse.click(380,300); await esp(250); await pag.mouse.click(950,590); await esp(500);
console.log("   seleccion:", await pag.evaluate(()=>window.__hekatanSelectionSize?.()));
await pag.evaluate(()=>{ const i=document.getElementById("hk3-cmd-input"); i.value=""; i.dispatchEvent(new Event("input",{bubbles:true})); });
await pag.focus("#hk3-cmd-input");
await pag.type("#hk3-cmd-input","rep 0,0,2",{delay:15});
console.log("   caja antes de Enter:", await pag.evaluate(()=>document.getElementById("hk3-cmd-input").value));
await pag.keyboard.press("Enter"); await esp(1200);
console.log("B) rep por el input:", await pag.evaluate(()=>{
  const p=window.__hekatanDrawingPoints?.val||[];
  return { n:p.length, cotas:[...new Set(p.map(q=>+q[2].toFixed(2)))].sort((a,b)=>a-b) }; }));
console.log("   ecos:", await pag.evaluate(()=>[...document.querySelectorAll("#hk3-cmd-hist div")].slice(-2).map(d=>d.textContent?.slice(0,70))));
await nav.close(); srv.close();
