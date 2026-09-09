// ¿El marcador del cursor cae EN el punto? Se pone el ratón justo encima de un nudo
// conocido y se compara, en píxeles: dónde está el nudo, dónde se pinta el marcador y
// qué coordenada dice la etiqueta.
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { join, extname } from "path";
const BASE = "/hekatan-struct-lineal/";
const raiz = join(process.cwd(), "website", "src", "examples");
const OUT = join(process.cwd(), "cli", "shots", "glifo"); mkdirSync(OUT, { recursive: true });
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req,res)=>{let p=decodeURIComponent((req.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,"index.html");if(!existsSync(f)){res.writeHead(404);return res.end("404");}res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});res.end(readFileSync(f));});
await new Promise(r=>srv.listen(4755,r));
const nav = await puppeteer.launch({headless:"new",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag = await nav.newPage(); await pag.setViewport({width:1280,height:720});
const esperar=(ms)=>new Promise(r=>setTimeout(r,ms));
await pag.goto(`http://localhost:4755${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
await esperar(6000);
await pag.evaluate(()=>document.getElementById("hk-ribbon-guia")?.remove());
const cmd=async(t)=>{await pag.evaluate(()=>{const i=document.getElementById("hk3-cmd-input");if(i)i.value="";});await pag.focus("#hk3-cmd-input");await pag.type("#hk3-cmd-input",t,{delay:10});await pag.keyboard.press("Enter");await esperar(400);};
// dos líneas que se CRUZAN, para probar también la intersección
await cmd("l"); await cmd("0,0,0"); await cmd("8,6,0"); await pag.keyboard.press("Escape"); await esperar(300);
await cmd("l"); await cmd("0,6,0"); await cmd("8,0,0"); await pag.keyboard.press("Escape"); await esperar(400);
const proy = (x,y,z) => pag.evaluate(([wx,wy,wz])=>{
  const v=document.querySelector("#viewer"), cv=v.querySelector("canvas");
  const r=cv.getBoundingClientRect(), cam=v.__ctx.camera; cam.updateMatrixWorld();
  const T=window.__hekatanTHREE;
  const m=cam.projectionMatrix.elements, mv=cam.matrixWorldInverse.elements;
  const tx=mv[0]*wx+mv[4]*wy+mv[8]*wz+mv[12], ty=mv[1]*wx+mv[5]*wy+mv[9]*wz+mv[13];
  const tz=mv[2]*wx+mv[6]*wy+mv[10]*wz+mv[14], tw=mv[3]*wx+mv[7]*wy+mv[11]*wz+mv[15];
  const cx=m[0]*tx+m[4]*ty+m[8]*tz+m[12]*tw, cy=m[1]*tx+m[5]*ty+m[9]*tz+m[13]*tw;
  const cw=m[3]*tx+m[7]*ty+m[11]*tz+m[15]*tw;
  return { x:r.left+(cx/cw+1)/2*r.width, y:r.top+(1-cy/cw)/2*r.height };
}, [x,y,z]);
for (const vista of ["Planta","3D"]) {
  await pag.evaluate((b)=>[...document.querySelectorAll("#hk-ribbon button")].find(q=>(q.textContent||"").includes(b))?.click(), vista);
  await esperar(900);
  await pag.evaluate(()=>window.__hekatanAutoFit?.()); await esperar(800);
  // Con la GOMA activa, que es el caso de la captura de Jorge: se clica un primer
  // punto y se mueve el ratón cerca de un nudo. Así se ve si la goma acaba donde el
  // marcador (el punto enganchado) o donde está el ratón (el punto crudo).
  await cmd("l");
  const p0 = await proy(0, 0, 0);
  await pag.mouse.click(p0.x, p0.y); await esperar(400);
  for (const [nom,P,dx,dy] of [["nudo-encima",[8,6,0],0,0], ["nudo-CERCA",[8,6,0],7,-6],
                               ["cruce-encima",[4,3,0],0,0], ["cruce-CERCA",[4,3,0],8,5]]) {
    const s0 = await proy(...P);
    const s = { x: s0.x + dx, y: s0.y + dy };     // el ratón CERCA, no encima: así se ve si
    await pag.mouse.move(s.x, s.y); await esperar(500);   // la goma acaba donde el marcador
    const r = await pag.evaluate(()=>{
      const sm=window.__hekatanSnapMarker, om=window.__hekatanOsnapMarkerRef;
      const et=[...document.querySelectorAll("div")].map(d=>d.textContent||"").filter(t=>/X=.*Y=.*Z=/.test(t)).pop()||"";
      // el final de la GOMA (la línea elástica que sigue al cursor)
      let goma = null;
      const rb = window.__hekatanRubberBand;
      if (rb?.visible) {
        const a = rb.geometry?.attributes?.position;
        if (a && a.count >= 2) goma = [a.getX(a.count-1), a.getY(a.count-1), a.getZ(a.count-1)].map(q=>+q.toFixed(3));
      }
      return { marcador: sm?.visible ? [sm.position.x,sm.position.y,sm.position.z].map(q=>+q.toFixed(3)) : null,
               glifo: om?.visible ? [om.position.x,om.position.y,om.position.z].map(q=>+q.toFixed(3)) : null,
               goma, etiqueta: et.slice(0,44) };
    });
    const sm = r.marcador ? await proy(...r.marcador) : null;
    // ¿cae el marcador SOBRE EL PUNTO que se quiere coger? (no sobre el ratón)
    const d = sm ? Math.hypot(sm.x-s0.x, sm.y-s0.y) : null;
    const gm = r.goma ? await proy(...r.goma) : null;
    const dg = gm && sm ? Math.hypot(gm.x-sm.x, gm.y-sm.y) : null;
    console.log(`${vista} · ${nom}: marcador=${JSON.stringify(r.marcador)}`
      + (d!=null?` · del punto ${d.toFixed(1)} px`:" · SIN marcador")
      + (dg!=null?` · goma-marcador ${dg.toFixed(1)} px`:" · goma ?")
      + ` | ${r.etiqueta}`);
    await pag.screenshot({ path: join(OUT, `${vista}_${nom.split(" ")[0]}.png`),
      clip:{ x:Math.max(0,s.x-70), y:Math.max(0,s.y-70), width:140, height:140 } });
  }
  await pag.keyboard.press("Escape"); await esperar(300);
}
await nav.close(); srv.close();
