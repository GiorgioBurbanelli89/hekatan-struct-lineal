import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { join, extname } from "path";
const BASE = "/hekatan-struct-lineal/";
const raiz = join(process.cwd(), "website", "src", "examples");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json" };
const srv = createServer((req,res)=>{ let p=decodeURIComponent((req.url||"/").split("?")[0]); if(p.startsWith(BASE))p=p.slice(BASE.length-1); let f=join(raiz,p); if(existsSync(f)&&statSync(f).isDirectory())f=join(f,"index.html"); if(!existsSync(f)){res.writeHead(404);return res.end("404");} res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); res.end(readFileSync(f)); });
await new Promise(r=>srv.listen(4775,r));
const nav = await puppeteer.launch({ headless:"new", args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await nav.newPage();
await p.goto("http://localhost:4775"+BASE+"workspace/?t=galpon",{waitUntil:"networkidle2",timeout:180000});
await p.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000});
await new Promise(r=>setTimeout(r,6000));
const info = await p.evaluate(()=>{
  const ctx = document.querySelector("#viewer").__ctx;
  const st = window.__hekatanStates;
  return {
    ctxKeys: Object.keys(ctx).slice(0,60),
    nNodes: st?.nodes?.val?.length ?? -1,
    nEls: st?.elements?.val?.length ?? -1,
    primerNodo: st?.nodes?.val?.[0] ?? null,
    primerEl: st?.elements?.val?.[0] ?? null,
    longsEl: (st?.elements?.val ?? []).map(e=>e.length).slice(0,12),
    hayFH: typeof window.__hekatanFindHovered,
    hayDesignar: typeof window.__hekatanDesignarExacto,
  };
});
console.log(JSON.stringify(info,null,1));
await nav.close(); srv.close();
