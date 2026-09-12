import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { fileURLToPath } from "url"; import { dirname, join, extname } from "path";
import puppeteer from "puppeteer";
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2" };
const srv = createServer((req,res)=>{ let p=decodeURIComponent((req.url||"/").split("?")[0]); if(p.startsWith(BASE))p=p.slice(BASE.length-1); let f=join(raiz,p); if(existsSync(f)&&statSync(f).isDirectory())f=join(f,"index.html"); if(!existsSync(f)){res.writeHead(404);return res.end("404");} res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); res.end(readFileSync(f)); });
const PORT=4791; await new Promise(r=>srv.listen(PORT,r));
const nav=await puppeteer.launch({headless:"new",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader"]});
const pag=await nav.newPage(); await pag.setViewport({width:1280,height:720,deviceScaleFactor:1});
const errs=[]; pag.on("pageerror",e=>errs.push("PE:"+e.message.slice(0,120)));
const esperar=ms=>new Promise(r=>setTimeout(r,ms));
async function probar(ruta, checks){
  await pag.goto(`http://localhost:${PORT}${BASE}${ruta}`,{waitUntil:"networkidle2",timeout:120000});
  await esperar(2500);
  const r={}; for(const [k,sel] of Object.entries(checks)) r[k]=await pag.$(sel).then(x=>!!x);
  return r;
}
// 1) IFC viewer: panel de objetos + botones min/slide
await pag.goto(`http://localhost:${PORT}${BASE}workspace/?t=ifc-viewer`,{waitUntil:"networkidle2",timeout:120000});
await esperar(2000);
await pag.evaluate(async(base)=>{ const M=await fetch(base+"ifc_church.json").then(r=>r.json()); window.__hekatanIfcMesh=M; try{window.__hekatanRebuild&&window.__hekatanRebuild();}catch(e){} try{window.__hekatanAutoFit&&window.__hekatanAutoFit();}catch(e){} }, BASE);
await esperar(2500);
const ifc={
  panelObjs: await pag.$("#hk-ifc-objs").then(x=>!!x),
  btnMin: await pag.$("#hk-ifc-min").then(x=>!!x),
  btnSlide: await pag.$("#hk-ifc-slide").then(x=>!!x),
};
// probar slide: clic → panel translateX negativo, aparece tab
if(ifc.btnSlide){
  await pag.evaluate(()=>document.getElementById("hk-ifc-slide").click()); await esperar(500);
  ifc.trasSlide_tab = await pag.$("#hk-ifc-tab").then(x=>!!x);
  ifc.trasSlide_transform = await pag.evaluate(()=>{const p=document.getElementById("hk-ifc-objs"); return p?getComputedStyle(p).transform:"?";});
}
if(ifc.btnMin){ await pag.evaluate(()=>document.getElementById("hk-ifc-min").click()); await esperar(400); ifc.trasMin = true; }
// 2) workspace normal: pane derecho + settings izq + back/home
const ws = await probar("workspace/?t=plantillas", {
  paneToggle:"#hk-pane-toggle", settingsToggle:"#hk-settings-toggle",
  backBtn:"#hk-back-btn", homeBtn:"#hk-home-btn",
});
// probar toggle settings
if(ws.settingsToggle){ await pag.evaluate(()=>document.getElementById("hk-settings-toggle").click()); await esperar(400);
  ws.settingsTransform = await pag.evaluate(()=>{const p=document.getElementById("settings"); return p?getComputedStyle(p).transform:"?";}); }
console.log(JSON.stringify({ifc,ws,errs},null,2));
await nav.close(); srv.close();
