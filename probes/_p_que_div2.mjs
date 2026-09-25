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
await p.setViewport({ width: 1280, height: 800 });
await p.goto("http://localhost:4775"+BASE+"workspace/?t=new-blank",{waitUntil:"networkidle2",timeout:180000});
await p.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000});
await new Promise(r=>setTimeout(r,5000));
await p.evaluate(()=>{ document.getElementById("hk-ribbon-guia")?.remove();
  const c=document.querySelector("#viewer").__ctx.controls; if(c){c.enableDamping=false;c.update?.();} });
const espera=(ms)=>new Promise(r=>setTimeout(r,ms));
const cmd = async (t, ms=380) => {
  await p.evaluate(()=>{const i=document.getElementById("hk3-cmd-input"); if(i)i.value="";});
  await p.focus("#hk3-cmd-input"); await p.type("#hk3-cmd-input", t, {delay:10});
  await p.keyboard.press("Enter"); await espera(ms);
};
await cmd("l"); await cmd("0,0,0"); await cmd("0,0,3"); await p.keyboard.press("Escape"); await espera(250);
await cmd("l"); await cmd("0,0,3"); await cmd("6,0,3"); await p.keyboard.press("Escape"); await espera(250);
await cmd("l"); await cmd("6,0,3"); await cmd("6,0,0"); await p.keyboard.press("Escape"); await espera(350);
await p.evaluate(()=>window.__hekatanRibbon?.vista?.(3)); await espera(800);
await p.evaluate(()=>window.__hekatanAutoFit?.()); await espera(800);
const info = await p.evaluate(()=>{
  const el = document.elementFromPoint(640,400);
  const cadena = []; let n = el;
  while (n && n !== document.body) { cadena.push(n.tagName + (n.id?"#"+n.id:"") + "." + String(n.className||"").slice(0,50)); n = n.parentElement; }
  const r = el?.getBoundingClientRect();
  return { cadena, rect: r ? [Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)] : null,
    enViewer: !!el?.closest("#viewer"), esCanvas: el === document.querySelector("#viewer canvas"),
    html: (el?.outerHTML ?? "").slice(0,300),
    guiaExiste: !!document.getElementById("hk-ribbon-guia") };
});
console.log(JSON.stringify(info,null,1));
await nav.close(); srv.close();
