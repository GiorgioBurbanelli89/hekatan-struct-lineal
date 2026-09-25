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
  const ei = window.__hekatanStates?.elementInputs?.val;
  const els = ctx.mesh?.elements?.rawVal;
  const shp = ei?.sectionShapes;
  return {
    tieneEI: !!ei, claves: ei ? Object.keys(ei).slice(0,40) : null,
    shpTipo: shp ? (shp instanceof Map ? "Map" : typeof shp) : "no",
    shpSize: shp ? (shp.size ?? Object.keys(shp).length) : -1,
    nEls: els?.length ?? -1,
    primeros: els?.slice(0,6) ?? null,
    nNodes: ctx.derivedNodes?.rawVal?.length ?? -1,
    ej: window.__hekatanCurrentExample?.id ?? "?",
  };
});
console.log(JSON.stringify(info,null,1));
await nav.close(); srv.close();
