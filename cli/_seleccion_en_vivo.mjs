/**
 * SELECCION EN VIVO, con la ventana ABIERTA para que Jorge lo vea:
 * izq→der (Window, azul) y der→izq (Crossing, verde), con cursor pintado y un
 * fotograma por paso. Deja el navegador abierto al terminar.
 *   node cli/_seleccion_en_vivo.mjs [url]
 */
import puppeteer from "puppeteer"; import fs from "node:fs";
const url = process.argv[2] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank";
const out = "cli/shots/seleccion_vivo2"; fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});
const nav = await puppeteer.launch({ headless:false, defaultViewport:null,
  executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args:["--window-size=1500,950","--window-position=40,30","--no-first-run",
        "--disable-backgrounding-occluded-windows","--disable-renderer-backgrounding"] });
const [pag] = await nav.pages();
const esp=m=>new Promise(r=>setTimeout(r,m));
const err=[]; pag.on("pageerror",e=>err.push(String(e).slice(0,140)));
await pag.goto(url,{waitUntil:"networkidle2",timeout:180000});
await pag.waitForFunction(()=>!!document.querySelector("#viewer")?.__ctx,{timeout:120000}); await esp(5000);
await pag.evaluate(()=>{ try{window.__hekatanRibbon?.guia?.(false);}catch(e){} document.getElementById("hk-ribbon-guia")?.remove(); });
for(const id of ["#hk-settings-toggle","#hk-pane-toggle"]){const b=await pag.evaluate(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};},id); if(b){await pag.mouse.click(b.x,b.y); await esp(600);} }
// cursor y cartel
await pag.evaluate(()=>{
  const c=document.createElement("div"); c.id="vc";
  c.innerHTML='<svg width="26" height="34" viewBox="0 0 26 34"><path id="vcf" d="M1 1 L1 27 L8 20 L13 32 L18 30 L13 18 L23 18 Z" fill="#fff" stroke="#000" stroke-width="1.6"/></svg>';
  c.style.cssText="position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;";
  const n=document.createElement("div"); n.id="vn";
  n.style.cssText="position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2147483647;pointer-events:none;background:rgba(15,23,42,.96);color:#facc15;border:2px solid #facc15;border-radius:9px;padding:9px 20px;font:600 19px system-ui;";
  document.body.append(c,n);
  window.__vc=(x,y,r)=>{c.style.left=x+"px";c.style.top=y+"px";document.getElementById("vcf").setAttribute("fill",r?"#ff2d55":"#fff");};
  window.__vn=t=>{const e=document.getElementById("vn");e.textContent=t;e.style.display=t?"block":"none";};
});
let cur={x:700,y:500}, n=0;
const foto=async t=>{await esp(200); await pag.screenshot({path:`${out}/${String(n++).padStart(2,"0")}_${t}.png`});};
const nota=t=>pag.evaluate(t=>window.__vn(t),t);
const mover=async(x,y,k=14)=>{for(let i=1;i<=k;i++){const px=cur.x+(x-cur.x)*i/k,py=cur.y+(y-cur.y)*i/k;
  await pag.mouse.move(px,py); await pag.evaluate(q=>window.__vc(q.x,q.y,false),{x:px,y:py}); await esp(28);} cur={x,y};};
// modelo: un portico con pano y dos columnas largas
await pag.evaluate(()=>{
  const v=document.querySelector("#viewer"),c=v.__ctx.camera;
  v.__ctx.controls.target.set(3,2,1); c.position.set(15,-13,9); c.up.set(0,0,1); c.lookAt(3,2,1);
  v.__ctx.controls.update?.(); v.__ctx.render?.();
  window.__hekatanDrawingPoints.val=[[0,0,0],[6,0,0],[6,4,0],[0,4,0],[0,0,0],[0,0,3],[6,0,0],[6,0,3]];
  window.__hekatanDrawingPolylines.val=[[0,1,2,3,0],[4,5],[6,7]];
  window.__hekatanDrawingAreas.val=[0];
  window.__hekatanRebuild?.(); window.__hekatanCadState?.setTool?.("select");
});
await esp(1500);
await nota("Modelo: un paño y dos columnas"); await mover(700,500); await foto("modelo");

// ── 1) IZQUIERDA → DERECHA = WINDOW (azul): solo lo que queda ENTERO dentro
await nota("1) IZQUIERDA → DERECHA = Window (azul): solo lo que queda ENTERO dentro");
await mover(300,200); await pag.evaluate(q=>window.__vc(q.x,q.y,true),cur);   // esquina VACIA
await pag.mouse.down(); await foto("izq_der_inicio");
for(const p of [[600,400],[900,600],[1180,780]]){ await mover(p[0],p[1],8); await foto("izq_der_arrastrando"); }
await pag.mouse.up(); await esp(900); await foto("izq_der_resultado");
const s1=await pag.evaluate(()=>[...(window.__hekatanSelection??[])]);
await nota(`Window: ${s1.length} objetos (${s1.filter(k=>k.startsWith("seg:")).length} barras, ${s1.filter(k=>k.startsWith("poly:")).length} paño)`);
await esp(1200); await foto("izq_der_cuenta");

// ── 2) DERECHA → IZQUIERDA = CROSSING (verde): todo lo que TOQUE
await pag.keyboard.press("Escape"); await esp(600);
await nota("2) DERECHA → IZQUIERDA = Crossing (verde): todo lo que TOQUE el recuadro");
await mover(1180,780); await pag.evaluate(q=>window.__vc(q.x,q.y,true),cur);   // esquina VACIA
await pag.mouse.down(); await foto("der_izq_inicio");
for(const p of [[900,600],[600,400],[300,200]]){ await mover(p[0],p[1],8); await foto("der_izq_arrastrando"); }
await pag.mouse.up(); await esp(900); await foto("der_izq_resultado");
const s2=await pag.evaluate(()=>[...(window.__hekatanSelection??[])]);
await nota(`Crossing: ${s2.length} objetos (${s2.filter(k=>k.startsWith("seg:")).length} barras, ${s2.filter(k=>k.startsWith("poly:")).length} paño)`);
await esp(1500); await foto("der_izq_cuenta");
console.log("Window  :", s1.length, JSON.stringify(s1));
console.log("Crossing:", s2.length, JSON.stringify(s2));
console.log("pageerror:", err.length, "· fotogramas:", n, "·", out);
console.log("La ventana queda ABIERTA para que la mires.");
