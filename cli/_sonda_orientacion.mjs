import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http"; import { join, extname } from "path";
const raiz="C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-struct-deploy/website/src/examples", BASE="/hekatan-struct-lineal/";
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});r.end(fs.readFileSync(f));});
await new Promise(r=>srv.listen(4807,r));
const nav=await puppeteer.launch({headless:"new",executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const p=await nav.newPage(); await p.setViewport({width:1200,height:800});
const esp=m=>new Promise(r=>setTimeout(r,m));
await p.goto(`http://localhost:4807${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
await p.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000}); await esp(6000);
await p.evaluate(()=>{ window.__hekatanGrillaAux?.(3,"xy"); window.__hekatanGrillaAux?.(6,"xy"); });
await esp(900);
console.log(JSON.stringify(await p.evaluate(()=>{
  const out=[]; const V=document.querySelector("#viewer").__ctx;
  V.scene.traverse(o=>{ if(typeof o.name==="string" && o.name.startsWith("hekatan-grid")){
    // normal del plano = eje Z local del objeto, en mundo
    const n = new (Object.getPrototypeOf(V.camera.position).constructor)(0,0,1).applyQuaternion(o.quaternion);
    out.push({ n: o.name, pos:[o.position.x,o.position.y,o.position.z].map(v=>+v.toFixed(2)),
               normal:[n.x,n.y,n.z].map(v=>+v.toFixed(2)),
               orientacion: Math.abs(n.z)>0.9 ? "TUMBADA (bien)" : "DE PIE (mal)" }); }});
  return out; }), null, 1));
await nav.close(); srv.close();
