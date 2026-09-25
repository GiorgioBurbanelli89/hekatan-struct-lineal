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
p.on("console", m => { const t=m.text(); if (/\[menu\]/.test(t)) console.log("PAGE:", t.slice(0,120)); });
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
const centro = await p.evaluate((W)=>{
  const [wx,wy,wz]=W;
  const v=document.querySelector("#viewer"), cv=v.querySelector("canvas");
  const r=cv.getBoundingClientRect(), cam=v.__ctx.camera; cam.updateMatrixWorld();
  const m=cam.projectionMatrix.elements, mv=cam.matrixWorldInverse.elements;
  const tx=mv[0]*wx+mv[4]*wy+mv[8]*wz+mv[12], ty=mv[1]*wx+mv[5]*wy+mv[9]*wz+mv[13];
  const tz=mv[2]*wx+mv[6]*wy+mv[10]*wz+mv[14], tw=mv[3]*wx+mv[7]*wy+mv[11]*wz+mv[15];
  const cx=m[0]*tx+m[4]*ty+m[8]*tz+m[12]*tw, cy=m[1]*tx+m[5]*ty+m[9]*tz+m[13]*tw;
  const cw=m[3]*tx+m[7]*ty+m[11]*tz+m[15]*tw;
  return {x:r.left+(cx/cw+1)/2*r.width, y:r.top+(1-cy/cw)/2*r.height};
},[3,0,1.5]);
console.log("centro:", JSON.stringify(centro));
const pre = await p.evaluate((x,y)=>{
  const el = document.elementFromPoint(x,y);
  const h = window.__hekatanFindHovered?.(x,y);
  const els = window.__hekatanStates?.elements?.val ?? [];
  return { sobre: el?.tagName+"#"+(el?.id??"")+"."+String(el?.className??"").slice(0,30),
    fh: h ? h.type+":"+h.idx : null, nEls: els.length,
    longs: els.map(e=>e.length).join(",") };
}, centro.x, centro.y);
console.log("pre:", JSON.stringify(pre));
await p.mouse.click(centro.x, centro.y, { button:"right" });
await espera(600);
const post = await p.evaluate(()=>({
  menu: !!window.__hekatanMenuVisible?.(),
  seccion: (()=>{ const c=document.getElementById("hk-seccion"); return c && c.style.display!=="none" ? (c.querySelector("b")?.textContent??"") : null; })(),
  sel: (window.__hekatanModelSelection??[]).map(s=>s.type+":"+s.idx),
  status: (window.__hekatanCadStatusText||"").slice(0,80),
}));
console.log("post:", JSON.stringify(post));
await nav.close(); srv.close();
