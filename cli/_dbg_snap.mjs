import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { join, extname } from "path";
const BASE="/hekatan-struct-lineal/", raiz="website/src/examples";
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2"};
const srv=createServer((q,r)=>{let p=decodeURIComponent((q.url||"/").split("?")[0]); if(p.startsWith(BASE))p=p.slice(BASE.length-1);
 let f=join(raiz,p); if(existsSync(f)&&statSync(f).isDirectory())f=join(f,"index.html");
 if(!existsSync(f)){r.writeHead(404);return r.end("404");} r.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); r.end(readFileSync(f));});
await new Promise(r=>srv.listen(4744,r));
const nav=await puppeteer.launch({headless:"new",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage(); await pag.setViewport({width:1280,height:720});
await pag.goto(`http://localhost:4744${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
await new Promise(r=>setTimeout(r,6000));
console.log(await pag.evaluate(() => {
  const ctx = document.querySelector("#viewer").__ctx;
  const grupos = [];
  ctx.scene.traverse(o => { if (o.type==="Group") grupos.push({ n: o.children.length,
    tipos: [...new Set(o.children.map(c=>c.geometry?.type||c.type))].join("/"), esc: +o.scale.x.toFixed(3), vis: o.visible }); });
  return { hayFn: typeof window.__hekatanUpdateSnapScale, grupos: grupos.slice(0,8) };
}));
await nav.close(); srv.close();
