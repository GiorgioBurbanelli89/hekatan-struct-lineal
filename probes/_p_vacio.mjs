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
p.on("console", m => { const t = m.text(); if (/\[menu\]|contextmenu|Cancelado/i.test(t)) console.log("PAGE:", t.slice(0,150)); });
await p.goto("http://localhost:4775"+BASE+"workspace/?t=galpon",{waitUntil:"networkidle2",timeout:180000});
await p.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000});
await new Promise(r=>setTimeout(r,6000));
await p.evaluate(()=>{
  document.getElementById("hk-ribbon-guia")?.remove();
  window.__hekatanAutoFit?.();
  // trampas
  document.addEventListener("contextmenu", (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    console.log("TRAMPA contextmenu en", e.clientX, e.clientY, "->", el?.tagName, el?.id, el?.className?.toString?.().slice(0,60));
  }, true);
});
await new Promise(r=>setTimeout(r,1500));
const vacio = await p.evaluate(() => {
  const cv = document.querySelector("#viewer canvas");
  const r = cv.getBoundingClientRect(), fh = window.__hekatanFindHovered;
  for (const [fx, fy] of [[0.92,0.08],[0.08,0.08],[0.92,0.9]]) {
    const x = r.left + r.width*fx, y = r.top + r.height*fy;
    if (!fh || !fh(x, y)) {
      const el = document.elementFromPoint(x, y);
      return { x, y, sobre: el?.tagName + "#" + (el?.id ?? "") + "." + String(el?.className ?? "").slice(0,40) };
    }
  }
  return null;
});
console.log("vacio:", JSON.stringify(vacio));
if (vacio) {
  await p.mouse.move(vacio.x, vacio.y);
  await p.mouse.click(vacio.x, vacio.y, { button: "right" });
  await new Promise(r=>setTimeout(r,700));
  const est = await p.evaluate(() => ({
    visible: !!window.__hekatanMenuVisible?.(),
    tool: ((window.__hekatanCadState?.get?.()?.tool) ?? "sin-cadstate"),
    status: (window.__hekatanCadStatusText || "").slice(0,90),
    fh: window.__hekatanFindHovered ? "si" : "no",
    tDerProbable: "n/d",
  }));
  console.log("estado:", JSON.stringify(est));
}
await nav.close(); srv.close();
