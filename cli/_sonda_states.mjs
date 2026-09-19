import puppeteer from "puppeteer"; import fs from "node:fs"; import { createServer } from "http"; import { join, extname } from "path";
const raiz="C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-struct-deploy/website/src/examples", BASE="/hekatan-struct-lineal/";
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end("404");}r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});r.end(fs.readFileSync(f));});
await new Promise(r=>srv.listen(4795,r));
const nav=await puppeteer.launch({headless:"new",executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const p=await nav.newPage(); await p.setViewport({width:1400,height:880});
p.on("console", m => { const t=m.text(); if (/convertir|Editar|states/i.test(t)) console.log("  [consola]", t.slice(0,120)); });
const esp=m=>new Promise(r=>setTimeout(r,m));
await p.goto(`http://localhost:4795${BASE}workspace/?t=edificio-aporticado`,{waitUntil:"networkidle2",timeout:180000});
await p.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000}); await esp(9000);
console.log("states:", await p.evaluate(()=>{ const s=window.__hekatanStates; if(!s) return "NO EXISTE";
  return { claves:Object.keys(s).slice(0,12), nodos:s.nodes?.rawVal?.length ?? null, elems:s.elements?.rawVal?.length ?? null,
           apoyos:(s.nodeInputs?.rawVal?.supports?.size ?? null), cargas:(s.nodeInputs?.rawVal?.loads?.size ?? null) }; }));
console.log("convertir existe:", await p.evaluate(()=>typeof window.__hekatanConvertirEditable));
console.log("llamada:", JSON.stringify(await p.evaluate(()=>{ try { return window.__hekatanConvertirEditable?.(); } catch(e) { return "ERROR "+e.message; } })));
await nav.close(); srv.close();
