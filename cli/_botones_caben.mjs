import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { join, extname } from "path";
const BASE = "/hekatan-struct-lineal/";
const raiz = "website/src/examples";
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req,res)=>{ let p=decodeURIComponent((req.url||"/").split("?")[0]); if(p.startsWith(BASE)) p=p.slice(BASE.length-1);
  let f=join(raiz,p); if(existsSync(f)&&statSync(f).isDirectory()) f=join(f,"index.html");
  if(!existsSync(f)){res.writeHead(404);return res.end("404");} res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); res.end(readFileSync(f)); });
await new Promise(r=>srv.listen(4739,r));
const nav=await puppeteer.launch({headless:"new",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag=await nav.newPage();
for (const [w,h] of [[1280,720],[1280,760],[1600,900]]) {
  await pag.setViewport({width:w,height:h,deviceScaleFactor:1});
  await pag.goto(`http://localhost:4739${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
  await new Promise(r=>setTimeout(r,6000));
  await pag.evaluate(()=>document.getElementById("hk-ribbon-guia")?.remove());
  const r = await pag.evaluate((W,H)=>{
    const rib=document.getElementById("hk-ribbon"); const est=document.getElementById("hk-ribbon-estado"); const cmd=document.getElementById("hk3-cmdline");
    const bs=[...(rib?.querySelectorAll("button")||[])];
    const fuera=bs.filter(b=>{const q=b.getBoundingClientRect(); return q.right>W-2||q.bottom>H-2||q.left<0||q.width===0;});
    const rr=rib?.getBoundingClientRect(), cc=cmd?.getBoundingClientRect();
    return {botones:bs.length, fuera:fuera.length, nombresFuera:fuera.slice(0,6).map(b=>b.textContent?.trim().slice(0,12)),
            ribbon:rr?`${Math.round(rr.width)}x${Math.round(rr.height)} @${Math.round(rr.top)}`:null,
            cmdTop: cc?Math.round(cc.top):null, estado: !!est};
  }, w, h);
  console.log(`${w}x${h}:`, JSON.stringify(r));
}
await nav.close(); srv.close();
