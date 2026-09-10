// ¿CUÁNTOS botones hay, y en cuántos ejemplos se han probado? Cuenta los mandos
// que ofrece la ventana en varios ejemplos: botones del ribbon, botones del panel
// y desplegables/casillas de Tweakpane.
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { join, extname } from "path";
const BASE = "/hekatan-struct-lineal/";
const raiz = join(process.cwd(), "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req,res)=>{let p=decodeURIComponent((req.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,"index.html");if(!existsSync(f)){res.writeHead(404);return res.end("404");}res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});res.end(readFileSync(f));});
await new Promise(r=>srv.listen(4757,r));
const nav = await puppeteer.launch({headless:"new",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const esperar=(ms)=>new Promise(r=>setTimeout(r,ms));
const ids = process.argv.slice(2);
let total = 0;
for (const id of ids) {
  const pag = await nav.newPage(); await pag.setViewport({width:1500,height:1000});
  await pag.goto(`http://localhost:4757${BASE}workspace/?t=${id}`,{waitUntil:"networkidle2",timeout:180000});
  await esperar(6000);
  const c = await pag.evaluate(() => {
    const vis = (e) => e.offsetParent !== null && e.getBoundingClientRect().width > 0;
    const ribbon = [...document.querySelectorAll("#hk-ribbon button")].filter(vis);
    const todos  = [...document.querySelectorAll("button")].filter(vis);
    const tw     = [...document.querySelectorAll(".tp-btnv_b")].filter(vis);
    const sel    = [...document.querySelectorAll("select")].filter(vis);
    const chk    = [...document.querySelectorAll("input[type=checkbox]")].filter(vis);
    const num    = [...document.querySelectorAll(".tp-lblv input[type=text],.tp-lblv input[type=number]")].filter(vis);
    return { ribbon: ribbon.length, botones: todos.length, tweakpane: tw.length,
             desplegables: sel.length, casillas: chk.length, numeros: num.length };
  });
  const mandos = c.botones + c.desplegables + c.casillas + c.numeros;
  total += mandos;
  console.log(`${id.padEnd(28)} ribbon ${String(c.ribbon).padStart(3)} · botones ${String(c.botones).padStart(3)} · desplegables ${String(c.desplegables).padStart(3)} · casillas ${String(c.casillas).padStart(3)} · números ${String(c.numeros).padStart(3)}  →  ${mandos} mandos`);
  await pag.close();
}
console.log(`\nmedia por ejemplo: ${(total/ids.length).toFixed(0)} mandos`);
await nav.close(); srv.close();
