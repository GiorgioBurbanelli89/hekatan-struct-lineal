# -*- coding: utf-8 -*-
"""Genera hekatan_lib.cpd: motor FEM real (deform.wasm) OCULTO en el include,
y macros de MODELADO visibles/editables: frames (hk_node/hk_elem/hk_load/hk_support/hk_material)
y SHELLS (hk_shell/hk_plate_material) + benchmark parametrico hk_plate_ss.
Solo .cpd + #def + #include — sin tocar source de Calcpad ni de Hekatan."""
import base64, gzip, os

HERE = os.path.dirname(os.path.abspath(__file__))
glue = open(os.path.join(HERE, "deform.js"), "r", encoding="utf-8").read()
wasm = open(os.path.join(HERE, "deform.wasm"), "rb").read()
glue = glue.replace("import.meta", '({url:"https://localhost/x.js"})')
glue = glue.replace("export default Module;", ";self.__hekModule=Module;")
gz_glue = base64.b64encode(gzip.compress(glue.encode("utf-8"), 9)).decode()
gz_wasm = base64.b64encode(gzip.compress(wasm, 9)).decode()

# Reglas Calcpad: SOLO comillas dobles plain o backticks (`). NUNCA \" ni "" (Calcpad -> &quot;). Placeholder id = __ID__.
JS_BEGIN = r'''(async function(){function st(s){var d=document.getElementById("__ID__");if(d)d.innerText=s;}try{
st("cargando motor FEM de Hekatan...");
function b2u(b){return Uint8Array.from(atob(b),function(c){return c.charCodeAt(0);});}
async function unz(b){var s=new Blob([b2u(b)]).stream().pipeThrough(new DecompressionStream("gzip"));return new Uint8Array(await new Response(s).arrayBuffer());}
(0,eval)(new TextDecoder().decode(await unz(__GLUE__)));
var mod=await self.__hekModule({wasmBinary:await unz(__WASM__)});
function alloc(d,C,h){var b=new C(d);var p=mod._malloc(Math.max(1,b.length)*b.BYTES_PER_ELEMENT);if(b.length)h.set(b,p/b.BYTES_PER_ELEMENT);return p;}
function pmap(m){var k=Array.from(m.keys()),v=Array.from(m.values());return {k:alloc(k,Uint32Array,mod.HEAPU32),v:alloc(v,Float64Array,mod.HEAPF64),s:k.length};}
var nodes=[],elements=[],supdat=new Map(),loaddat=new Map(),mat={E:2.1e11,A:0.01,I:1e-5,G:8.08e10,J:2e-5,nu:0.2,t:0.2,plate:1};var wTheory=null,gridN=0;
'''

JS_END = r'''
st("resolviendo FEM ("+nodes.length+" nodos, "+elements.length+" elementos)...");
var elemIdx=[];for(var i=0;i<elements.length;i++){for(var k=0;k<elements[i].length;k++)elemIdx.push(elements[i][k]);}
var esz=[];for(var i=0;i<elements.length;i++)esz.push(elements[i].length);
var eEl=new Map(),eA=new Map(),eIz=new Map(),eIy=new Map(),eG=new Map(),eJ=new Map(),eTh=new Map(),ePo=new Map(),ePf=new Map();
var hasShell=false;
for(var i=0;i<elements.length;i++){eEl.set(i,mat.E);if(elements[i].length<=2){eA.set(i,mat.A);eIz.set(i,mat.I);eIy.set(i,mat.I);eG.set(i,mat.G);eJ.set(i,mat.J);}else{hasShell=true;eTh.set(i,mat.t);ePo.set(i,mat.nu);ePf.set(i,mat.plate);}}
var flat=[];for(var i=0;i<nodes.length;i++){flat.push(nodes[i][0]);flat.push(nodes[i][1]);flat.push(nodes[i][2]);}
var nodesPtr=alloc(flat,Float64Array,mod.HEAPF64);
var elementsPtr=alloc(elemIdx,Uint32Array,mod.HEAPU32);
var elemSizesPtr=alloc(esz,Uint32Array,mod.HEAPU32);
var supKeys=Array.from(supdat.keys());var supKeysPtr=alloc(supKeys,Uint32Array,mod.HEAPU32);
var supVals=[];supdat.forEach(function(a){for(var j=0;j<6;j++)supVals.push(a[j]);});var supValsPtr=alloc(supVals,Uint8Array,mod.HEAPU8);
var ldKeys=Array.from(loaddat.keys());var ldKeysPtr=alloc(ldKeys,Uint32Array,mod.HEAPU32);
var ldVals=[];loaddat.forEach(function(a){for(var j=0;j<6;j++)ldVals.push(a[j]);});var ldValsPtr=alloc(ldVals,Float64Array,mod.HEAPF64);
var el=pmap(eEl),ar=pmap(eA),mz=pmap(eIz),my=pmap(eIy),sm=pmap(eG),to=pmap(eJ),th=pmap(eTh),po=pmap(ePo),pf=pmap(ePf);
var em=function(){return pmap(new Map());};var eo=em(),say=em(),saz=em(),dt=em(),ds=em();
var springsPtr=alloc([0],Float64Array,mod.HEAPF64);
var dOut=mod._malloc(4),dSz=mod._malloc(4),rOut=mod._malloc(4),rSz=mod._malloc(4);
mod._deform(nodesPtr,nodes.length,elementsPtr,elemIdx.length,elemSizesPtr,elements.length,supKeysPtr,supValsPtr,supKeys.length,ldKeysPtr,ldValsPtr,ldKeys.length,el.k,el.v,el.s,ar.k,ar.v,ar.s,mz.k,mz.v,mz.s,my.k,my.v,my.s,sm.k,sm.v,sm.s,to.k,to.v,to.s,th.k,th.v,th.s,po.k,po.v,po.s,eo.k,eo.v,eo.s,say.k,say.v,say.s,saz.k,saz.v,saz.s,springsPtr,0,pf.k,pf.v,pf.s,dt.k,dt.v,dt.s,ds.k,ds.v,ds.s,dOut,dSz,rOut,rSz);
var dPtr=mod.HEAPU32[dOut/4],dN=mod.HEAPU32[dSz/4];var df=new Float64Array(mod.HEAPF64.buffer,dPtr,dN);
var U=new Map();for(var i=0;i<dN;i+=7){U.set(df[i],[df[i+1],df[i+2],df[i+3]]);}
var html=``;
if(hasShell){
var minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;
for(var i=0;i<nodes.length;i++){var n=nodes[i];if(n[0]<minx)minx=n[0];if(n[0]>maxx)maxx=n[0];if(n[1]<miny)miny=n[1];if(n[1]>maxy)maxy=n[1];}
var spanx=Math.max(maxx-minx,1e-6),spany=Math.max(maxy-miny,1e-6);
var W=480,H=400,mg=34,cb=22;var sc=Math.min((W-2*mg-cb-30)/spanx,(H-2*mg)/spany);
function SX(x){return mg+(x-minx)*sc;}function SY(y){return mg+(maxy-y)*sc;}
var wv=[];U.forEach(function(u){wv.push(u[2]);});var wmin=Math.min.apply(null,wv),wmax=Math.max.apply(null,wv);
var NLEV=12,dl=(wmax-wmin)/NLEV;
function rb(t){t=Math.max(0,Math.min(1,t));var r=Math.max(0,Math.min(1,(t-0.5)*4)),g=Math.max(0,Math.min(1,Math.min(t*4,(1-t)*4))),bb=Math.max(0,Math.min(1,(0.5-t)*4));return `rgb(`+Math.round(255*r)+`,`+Math.round(255*g)+`,`+Math.round(255*bb)+`)`;}
function band(v){return Math.max(0,Math.min(NLEV-1,Math.floor((v-wmin)/dl)));}
function bcol(k){return rb((k+0.5)/NLEV);}
var gg=``;
if(gridN>0){
var Ng=gridN;var wn=[];for(var i=0;i<=Ng;i++){wn[i]=[];for(var j=0;j<=Ng;j++){var u=U.get(j*(Ng+1)+i);wn[i][j]=u?u[2]:0;}}
function bil(fi,fj){var i0=Math.min(Ng-1,Math.floor(fi)),j0=Math.min(Ng-1,Math.floor(fj));var fx=fi-i0,fy=fj-j0;return wn[i0][j0]*(1-fx)*(1-fy)+wn[i0+1][j0]*fx*(1-fy)+wn[i0][j0+1]*(1-fx)*fy+wn[i0+1][j0+1]*fx*fy;}
var M=52;var G=[];for(var i=0;i<=M;i++){G[i]=[];for(var j=0;j<=M;j++)G[i][j]=bil(i/M*Ng,j/M*Ng);}
function GX(i){return SX(minx+i/M*spanx);}function GY(j){return SY(miny+j/M*spany);}
for(var i=0;i<M;i++){for(var j=0;j<M;j++){var cv=(G[i][j]+G[i+1][j]+G[i+1][j+1]+G[i][j+1])/4;gg+=`<rect x="`+GX(i)+`" y="`+GY(j+1)+`" width="`+(spanx*sc/M+0.8)+`" height="`+(spany*sc/M+0.8)+`" fill="`+bcol(band(cv))+`"/>`;}}
function EC(e,v0,v1,v2,v3,x0,y0,x1,y1,L){if(e==0){var t=(L-v0)/(v1-v0);return [x0+t*(x1-x0),y0];}if(e==1){var t=(L-v1)/(v2-v1);return [x1,y0+t*(y1-y0)];}if(e==2){var t=(L-v2)/(v3-v2);return [x1+t*(x0-x1),y1];}var t=(L-v3)/(v0-v3);return [x0,y1+t*(y0-y1)];}
var EP={1:[[3,0]],2:[[0,1]],3:[[3,1]],4:[[1,2]],5:[[3,0],[1,2]],6:[[0,2]],7:[[3,2]],8:[[2,3]],9:[[2,0]],10:[[0,1],[2,3]],11:[[2,1]],12:[[1,3]],13:[[1,0]],14:[[0,3]]};
var cx=SX((minx+maxx)/2),cy=SY((miny+maxy)/2);
for(var k=1;k<NLEV;k++){var L=wmin+k*dl;var lab=null,lbd=99,ta=-2.4+k*0.42;
for(var i=0;i<M;i++){for(var j=0;j<M;j++){var v0=G[i][j],v1=G[i+1][j],v2=G[i+1][j+1],v3=G[i][j+1];var cc=(v0>L?1:0)|(v1>L?2:0)|(v2>L?4:0)|(v3>L?8:0);var pr=EP[cc];if(!pr)continue;var x0=GX(i),y0=GY(j),x1=GX(i+1),y1=GY(j+1);for(var s=0;s<pr.length;s++){var pa=EC(pr[s][0],v0,v1,v2,v3,x0,y0,x1,y1,L),pb=EC(pr[s][1],v0,v1,v2,v3,x0,y0,x1,y1,L);gg+=`<line x1="`+pa[0]+`" y1="`+pa[1]+`" x2="`+pb[0]+`" y2="`+pb[1]+`" stroke="#222" stroke-width="0.8"/>`;var mxx=(pa[0]+pb[0])/2,myy=(pa[1]+pb[1])/2,ang=Math.atan2(myy-cy,mxx-cx),da=Math.abs(ang-ta);if(da>Math.PI)da=2*Math.PI-da;if(da<lbd){lbd=da;lab=[mxx,myy];}}}}
if(lab){var lv=(L*1e4).toFixed(1);gg+=`<rect x="`+(lab[0]-10)+`" y="`+(lab[1]-7)+`" width="20" height="11" rx="2" fill="#fff" opacity="0.8"/><text x="`+(lab[0]-8)+`" y="`+(lab[1]+2)+`" font-size="8" fill="#000">`+lv+`</text>`;}
}
}else{
for(var i=0;i<elements.length;i++){var e=elements[i];if(e.length<4)continue;var av=0;for(var k=0;k<4;k++)av+=U.get(e[k])[2];av/=4;var pts=``;for(var k=0;k<4;k++){var nn=nodes[e[k]];pts+=SX(nn[0])+`,`+SY(nn[1])+` `;}gg+=`<polygon points="`+pts+`" fill="`+bcol(band(av))+`" stroke="#444" stroke-width="0.5"/>`;}
}
gg+=`<rect x="`+SX(minx)+`" y="`+SY(maxy)+`" width="`+(spanx*sc)+`" height="`+(spany*sc)+`" fill="none" stroke="#333" stroke-width="1"/>`;
var cbx=W-cb-12,cby=mg,cbh=H-2*mg,sh=cbh/NLEV;
for(var k=0;k<NLEV;k++){gg+=`<rect x="`+cbx+`" y="`+(cby+(NLEV-1-k)*sh)+`" width="`+cb+`" height="`+(sh+0.4)+`" fill="`+bcol(k)+`" stroke="#fff" stroke-width="0.3"/>`;}
gg+=`<rect x="`+cbx+`" y="`+cby+`" width="`+cb+`" height="`+cbh+`" fill="none" stroke="#333" stroke-width="0.5"/>`;
for(var k=0;k<=NLEV;k+=2){var vv=wmin+k*dl;gg+=`<text x="`+(cbx+cb+3)+`" y="`+(cby+(NLEV-k)*sh+3)+`" font-size="8" fill="#333">`+vv.toExponential(1)+`</text>`;}
var wc=Math.max(Math.abs(wmin),Math.abs(wmax));
var svg=`<svg viewBox="0 0 `+W+` `+H+`" style="width:`+W+`px;border:1px solid #ddd;background:#fff">`+gg+`</svg>`;
var cmp=``;if(wTheory!=null){var dif=100*(wc-Math.abs(wTheory))/Math.abs(wTheory);cmp=`<br>Kirchhoff teorico:  `+Math.abs(wTheory).toExponential(4)+` m<br>Diferencia: `+dif.toFixed(2)+` %`;}
html=svg+`<div style="font-family:Consolas,monospace;font-size:13px;margin-top:6px">Placa FEM (shells) — `+nodes.length+` nodos, `+elements.length+` elementos. `+NLEV+` bandas de contorno (estilo Mathcad).<br>Flecha max (Hekatan): `+wc.toExponential(4)+` m`+cmp+`</div>`;
}else{
var minx=1e9,maxx=-1e9,minz=1e9,maxz=-1e9;
for(var i=0;i<nodes.length;i++){var n=nodes[i];if(n[0]<minx)minx=n[0];if(n[0]>maxx)maxx=n[0];if(n[2]<minz)minz=n[2];if(n[2]>maxz)maxz=n[2];}
var span0=Math.max(maxx-minx,maxz-minz,1e-6);var umax=0;U.forEach(function(u){var m=Math.hypot(u[0],u[2]);if(m>umax)umax=m;});var dsc=umax>0?(0.2*span0)/umax:0;
for(var i=0;i<nodes.length;i++){var n=nodes[i],u=U.get(i)||[0,0,0];var dx=n[0]+u[0]*dsc,dz=n[2]+u[2]*dsc;if(dx<minx)minx=dx;if(dx>maxx)maxx=dx;if(dz<minz)minz=dz;if(dz>maxz)maxz=dz;}
var spanx=Math.max(maxx-minx,1e-6),spanz=Math.max(maxz-minz,1e-6);var W=540,H=300,ml=35,mr=35,mt=55,mb=35;var sc=Math.min((W-ml-mr)/spanx,(H-mt-mb)/spanz);
function SX(x){return ml+(x-minx)*sc;}function SY(z){return H-mb-(z-minz)*sc;}
var gg=``;
for(var i=0;i<elements.length;i++){var a=nodes[elements[i][0]],b=nodes[elements[i][1]];gg+=`<line x1="`+SX(a[0])+`" y1="`+SY(a[2])+`" x2="`+SX(b[0])+`" y2="`+SY(b[2])+`" stroke="#bbb" stroke-dasharray="5,4" stroke-width="2"/>`;}
function dp(i){var n=nodes[i],u=U.get(i)||[0,0,0];return [SX(n[0]+u[0]*dsc),SY(n[2]+u[2]*dsc)];}
for(var i=0;i<elements.length;i++){var pa=dp(elements[i][0]),pb=dp(elements[i][1]);gg+=`<line x1="`+pa[0]+`" y1="`+pa[1]+`" x2="`+pb[0]+`" y2="`+pb[1]+`" stroke="crimson" stroke-width="3"/>`;}
for(var i=0;i<nodes.length;i++){var p=dp(i);gg+=`<circle cx="`+p[0]+`" cy="`+p[1]+`" r="3" fill="navy"/>`;}
supdat.forEach(function(v,k){var p=[SX(nodes[k][0]),SY(nodes[k][2])];gg+=`<polygon points="`+p[0]+`,`+p[1]+` `+(p[0]-11)+`,`+(p[1]+17)+` `+(p[0]+11)+`,`+(p[1]+17)+`" fill="none" stroke="#333" stroke-width="2"/>`;});
loaddat.forEach(function(v,k){var p=[SX(nodes[k][0]),SY(nodes[k][2])];gg+=`<line x1="`+p[0]+`" y1="`+(p[1]-42)+`" x2="`+p[0]+`" y2="`+p[1]+`" stroke="green" stroke-width="2.5"/><polygon points="`+p[0]+`,`+p[1]+` `+(p[0]-5)+`,`+(p[1]-9)+` `+(p[0]+5)+`,`+(p[1]-9)+`" fill="green"/>`;});
var umx=0;U.forEach(function(u){var m=Math.hypot(u[0],u[2]);if(m>umx)umx=m;});
var svg=`<svg viewBox="0 0 `+W+` `+H+`" style="width:`+W+`px;border:1px solid #ddd;background:#fcfcfc">`+gg+`</svg>`;
html=svg+`<div style="font-family:Consolas,monospace;font-size:13px;margin-top:6px">Solver FEM REAL de Hekatan Struct — `+nodes.length+` nodos, `+elements.length+` elementos. Desplazamiento maximo: `+umx.toExponential(4)+` m  (deformada x`+(dsc>0?dsc.toExponential(1):0)+`)</div>`;
}
document.getElementById("__ID__").innerHTML=html;
}catch(e){document.getElementById("__ID__").innerText=`Error Hekatan: `+e+` | `+(e.stack||``);}})();'''

# ---- JS_END3D: mismo marshalling (con secciones por-elemento via self.emat) + viewer 3D Three.js estilo awatif ----
JS_END3D = r'''
st("resolviendo FEM ("+nodes.length+" nodos, "+elements.length+" elementos)...");
var elemIdx=[];for(var i=0;i<elements.length;i++){for(var k=0;k<elements[i].length;k++)elemIdx.push(elements[i][k]);}
var esz=[];for(var i=0;i<elements.length;i++)esz.push(elements[i].length);
var eEl=new Map(),eA=new Map(),eIz=new Map(),eIy=new Map(),eG=new Map(),eJ=new Map(),eTh=new Map(),ePo=new Map(),ePf=new Map();
var hasShell=false;
for(var i=0;i<elements.length;i++){eEl.set(i,mat.E);if(elements[i].length<=2){var ms=(self.emat&&self.emat[i])?self.emat[i]:mat;eA.set(i,ms.A);eIz.set(i,ms.Iz!==undefined?ms.Iz:ms.I);eIy.set(i,ms.Iy!==undefined?ms.Iy:ms.I);eG.set(i,ms.G);eJ.set(i,ms.J);}else{hasShell=true;eTh.set(i,mat.t);ePo.set(i,mat.nu);ePf.set(i,mat.plate);}}
var flat=[];for(var i=0;i<nodes.length;i++){flat.push(nodes[i][0]);flat.push(nodes[i][1]);flat.push(nodes[i][2]);}
var nodesPtr=alloc(flat,Float64Array,mod.HEAPF64);
var elementsPtr=alloc(elemIdx,Uint32Array,mod.HEAPU32);
var elemSizesPtr=alloc(esz,Uint32Array,mod.HEAPU32);
var supKeys=Array.from(supdat.keys());var supKeysPtr=alloc(supKeys,Uint32Array,mod.HEAPU32);
var supVals=[];supdat.forEach(function(a){for(var j=0;j<6;j++)supVals.push(a[j]);});var supValsPtr=alloc(supVals,Uint8Array,mod.HEAPU8);
var ldKeys=Array.from(loaddat.keys());var ldKeysPtr=alloc(ldKeys,Uint32Array,mod.HEAPU32);
var ldVals=[];loaddat.forEach(function(a){for(var j=0;j<6;j++)ldVals.push(a[j]);});var ldValsPtr=alloc(ldVals,Float64Array,mod.HEAPF64);
var el=pmap(eEl),ar=pmap(eA),mz=pmap(eIz),my=pmap(eIy),sm=pmap(eG),to=pmap(eJ),th=pmap(eTh),po=pmap(ePo),pf=pmap(ePf);
var em=function(){return pmap(new Map());};var eo=em(),say=em(),saz=em(),dt=em(),ds=em();
var springsPtr=alloc([0],Float64Array,mod.HEAPF64);
var dOut=mod._malloc(4),dSz=mod._malloc(4),rOut=mod._malloc(4),rSz=mod._malloc(4);
mod._deform(nodesPtr,nodes.length,elementsPtr,elemIdx.length,elemSizesPtr,elements.length,supKeysPtr,supValsPtr,supKeys.length,ldKeysPtr,ldValsPtr,ldKeys.length,el.k,el.v,el.s,ar.k,ar.v,ar.s,mz.k,mz.v,mz.s,my.k,my.v,my.s,sm.k,sm.v,sm.s,to.k,to.v,to.s,th.k,th.v,th.s,po.k,po.v,po.s,eo.k,eo.v,eo.s,say.k,say.v,say.s,saz.k,saz.v,saz.s,springsPtr,0,pf.k,pf.v,pf.s,dt.k,dt.v,dt.s,ds.k,ds.v,ds.s,dOut,dSz,rOut,rSz);
var dPtr=mod.HEAPU32[dOut/4],dN=mod.HEAPU32[dSz/4];var df=new Float64Array(mod.HEAPF64.buffer,dPtr,dN);
var U=new Map();for(var i=0;i<dN;i+=7){U.set(df[i],[df[i+1],df[i+2],df[i+3]]);}
st("cargando viewer 3D (Three.js, estilo awatif)...");
var div=document.getElementById("__ID__");div.innerHTML=``;
var s1=document.createElement("script");s1.src="https://cdn.jsdelivr.net/npm/three@0.145.0/build/three.min.js";
s1.onload=function(){var s2=document.createElement("script");s2.src="https://cdn.jsdelivr.net/npm/three@0.145.0/examples/js/controls/OrbitControls.js";s2.onload=build3D;s2.onerror=function(){div.innerText="No se pudo cargar OrbitControls (sin internet?)";};document.head.appendChild(s2);};
s1.onerror=function(){div.innerText="No se pudo cargar Three.js (sin internet?)";};
document.head.appendChild(s1);
function jet3(t){t=Math.max(0,Math.min(1,t));var r=Math.max(0,Math.min(1,(t-0.5)*4)),g=Math.max(0,Math.min(1,Math.min(t*4,(1-t)*4))),b=Math.max(0,Math.min(1,(0.5-t)*4));return new THREE.Color(r,g,b);}
function build3D(){
var W=600,Hh=460;
var scn=new THREE.Scene();scn.background=new THREE.Color(0xeef0f4);
var cam=new THREE.PerspectiveCamera(45,W/Hh,0.01,2000);
var ren=new THREE.WebGLRenderer({antialias:true});ren.setSize(W,Hh);div.appendChild(ren.domElement);
var ctrl=new THREE.OrbitControls(cam,ren.domElement);
scn.add(new THREE.AmbientLight(0xffffff,0.8));var dl=new THREE.DirectionalLight(0xffffff,0.5);dl.position.set(10,-15,20);scn.add(dl);
var bx0=1e9,bx1=-1e9,by0=1e9,by1=-1e9,bz0=1e9,bz1=-1e9;
for(var i=0;i<nodes.length;i++){var n=nodes[i];if(!n)continue;if(n[0]<bx0)bx0=n[0];if(n[0]>bx1)bx1=n[0];if(n[1]<by0)by0=n[1];if(n[1]>by1)by1=n[1];if(n[2]<bz0)bz0=n[2];if(n[2]>bz1)bz1=n[2];}
var cx=(bx0+bx1)/2,cy=(by0+by1)/2,cz=(bz0+bz1)/2,diag=Math.hypot(bx1-bx0,by1-by0,bz1-bz0)||1;
cam.up.set(0,0,1);cam.position.set(cx+diag*1.0,cy-diag*1.35,cz+diag*0.85);cam.lookAt(cx,cy,cz);ctrl.target.set(cx,cy,cz);ctrl.update();
var umax=0;U.forEach(function(u){var m=Math.hypot(u[0],u[1],u[2]);if(m>umax)umax=m;});var dsc=umax>0?(0.12*diag)/umax:0;
function P(i){var n=nodes[i],u=U.get(i)||[0,0,0];return new THREE.Vector3(n[0]+u[0]*dsc,n[1]+u[1]*dsc,n[2]+u[2]*dsc);}
var zmin=1e9,zmax=-1e9;U.forEach(function(u){if(u[2]<zmin)zmin=u[2];if(u[2]>zmax)zmax=u[2];});
function col(i){var u=U.get(i)||[0,0,0];var t=(zmax>zmin)?(u[2]-zmin)/(zmax-zmin):0.5;return jet3(1-t);}
var pos=[],vc=[];
function pv(p,c){pos.push(p.x,p.y,p.z);vc.push(c.r,c.g,c.b);}
for(var i=0;i<elements.length;i++){var e=elements[i];if(!e||e.length<4)continue;var pa=P(e[0]),pb=P(e[1]),pc=P(e[2]),pd=P(e[3]);var ca=col(e[0]),cb=col(e[1]),cc=col(e[2]),cd=col(e[3]);pv(pa,ca);pv(pb,cb);pv(pc,cc);pv(pa,ca);pv(pc,cc);pv(pd,cd);}
if(pos.length){var geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));geo.setAttribute("color",new THREE.Float32BufferAttribute(vc,3));geo.computeVertexNormals();scn.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide})));
var wpos=[];for(var i=0;i<elements.length;i++){var e=elements[i];if(!e||e.length<4)continue;var q4=[P(e[0]),P(e[1]),P(e[2]),P(e[3])];for(var w=0;w<4;w++){var p0=q4[w],p1=q4[(w+1)%4];wpos.push(p0.x,p0.y,p0.z,p1.x,p1.y,p1.z);}}
var wg=new THREE.BufferGeometry();wg.setAttribute("position",new THREE.Float32BufferAttribute(wpos,3));scn.add(new THREE.LineSegments(wg,new THREE.LineBasicMaterial({color:0x556070})));}
var lp=[];for(var i=0;i<elements.length;i++){var e=elements[i];if(!e||e.length!=2)continue;var p0=P(e[0]),p1=P(e[1]);lp.push(p0.x,p0.y,p0.z,p1.x,p1.y,p1.z);}
if(lp.length){var lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.Float32BufferAttribute(lp,3));scn.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0x222222})));}
var grid=new THREE.GridHelper(diag*1.3,13,0xc8c8c8,0xe4e4e4);grid.rotation.x=Math.PI/2;grid.position.set(cx,cy,0);scn.add(grid);
supdat.forEach(function(v,k){var n=nodes[k];if(!n)return;var ch=diag*0.06;var cone=new THREE.Mesh(new THREE.ConeGeometry(diag*0.032,ch,4),new THREE.MeshBasicMaterial({color:0x2244aa}));cone.position.set(n[0],n[1],n[2]-ch/2);cone.rotation.x=Math.PI/2;scn.add(cone);});
scn.add(new THREE.AxesHelper(diag*0.2));
function anim(){requestAnimationFrame(anim);ctrl.update();ren.render(scn,cam);}anim();
var info=document.createElement("div");info.style.cssText="font-family:Consolas,monospace;font-size:12px;margin-top:6px;color:#333";
info.innerHTML="Mesa-torsion 3D (Three.js, estilo awatif) — "+nodes.length+" nodos, "+elements.length+" elementos ("+(pos.length/18)+" shells). Desplaz. max: "+umax.toExponential(3)+" m. Color = uz. Deformada x"+(dsc>0?dsc.toFixed(0):0)+". Arrastra=rota, rueda=zoom.";
div.appendChild(info);
}
}catch(e){document.getElementById("__ID__").innerText=`Error Hekatan 3D: `+e+` | `+(e.stack||``);}})();'''

# ---- JS_END3D_PLOTLY: mismo marshalling + viewer Plotly mesh3d (barra de color + hover con valores) ----
JS_END3D_PLOTLY = r'''
st("resolviendo FEM ("+nodes.length+" nodos, "+elements.length+" elementos)...");
var elemIdx=[];for(var i=0;i<elements.length;i++){for(var k=0;k<elements[i].length;k++)elemIdx.push(elements[i][k]);}
var esz=[];for(var i=0;i<elements.length;i++)esz.push(elements[i].length);
var eEl=new Map(),eA=new Map(),eIz=new Map(),eIy=new Map(),eG=new Map(),eJ=new Map(),eTh=new Map(),ePo=new Map(),ePf=new Map();
var hasShell=false;
for(var i=0;i<elements.length;i++){eEl.set(i,mat.E);if(elements[i].length<=2){var ms=(self.emat&&self.emat[i])?self.emat[i]:mat;eA.set(i,ms.A);eIz.set(i,ms.Iz!==undefined?ms.Iz:ms.I);eIy.set(i,ms.Iy!==undefined?ms.Iy:ms.I);eG.set(i,ms.G);eJ.set(i,ms.J);}else{hasShell=true;eTh.set(i,mat.t);ePo.set(i,mat.nu);ePf.set(i,mat.plate);}}
var flat=[];for(var i=0;i<nodes.length;i++){flat.push(nodes[i][0]);flat.push(nodes[i][1]);flat.push(nodes[i][2]);}
var nodesPtr=alloc(flat,Float64Array,mod.HEAPF64);
var elementsPtr=alloc(elemIdx,Uint32Array,mod.HEAPU32);
var elemSizesPtr=alloc(esz,Uint32Array,mod.HEAPU32);
var supKeys=Array.from(supdat.keys());var supKeysPtr=alloc(supKeys,Uint32Array,mod.HEAPU32);
var supVals=[];supdat.forEach(function(a){for(var j=0;j<6;j++)supVals.push(a[j]);});var supValsPtr=alloc(supVals,Uint8Array,mod.HEAPU8);
var ldKeys=Array.from(loaddat.keys());var ldKeysPtr=alloc(ldKeys,Uint32Array,mod.HEAPU32);
var ldVals=[];loaddat.forEach(function(a){for(var j=0;j<6;j++)ldVals.push(a[j]);});var ldValsPtr=alloc(ldVals,Float64Array,mod.HEAPF64);
var el=pmap(eEl),ar=pmap(eA),mz=pmap(eIz),my=pmap(eIy),sm=pmap(eG),to=pmap(eJ),th=pmap(eTh),po=pmap(ePo),pf=pmap(ePf);
var em=function(){return pmap(new Map());};var eo=em(),say=em(),saz=em(),dt=em(),ds=em();
var springsPtr=alloc([0],Float64Array,mod.HEAPF64);
var dOut=mod._malloc(4),dSz=mod._malloc(4),rOut=mod._malloc(4),rSz=mod._malloc(4);
mod._deform(nodesPtr,nodes.length,elementsPtr,elemIdx.length,elemSizesPtr,elements.length,supKeysPtr,supValsPtr,supKeys.length,ldKeysPtr,ldValsPtr,ldKeys.length,el.k,el.v,el.s,ar.k,ar.v,ar.s,mz.k,mz.v,mz.s,my.k,my.v,my.s,sm.k,sm.v,sm.s,to.k,to.v,to.s,th.k,th.v,th.s,po.k,po.v,po.s,eo.k,eo.v,eo.s,say.k,say.v,say.s,saz.k,saz.v,saz.s,springsPtr,0,pf.k,pf.v,pf.s,dt.k,dt.v,dt.s,ds.k,ds.v,ds.s,dOut,dSz,rOut,rSz);
var dPtr=mod.HEAPU32[dOut/4],dN=mod.HEAPU32[dSz/4];var df=new Float64Array(mod.HEAPF64.buffer,dPtr,dN);
var U=new Map();for(var i=0;i<dN;i+=7){U.set(df[i],[df[i+1],df[i+2],df[i+3]]);}
st("cargando Plotly...");
var div=document.getElementById("__ID__");div.innerHTML=``;
var sp=document.createElement("script");sp.src="https://cdn.plot.ly/plotly-2.27.0.min.js";
sp.onload=buildPlot;sp.onerror=function(){div.innerText="No se pudo cargar Plotly (sin internet?)";};
document.head.appendChild(sp);
function buildPlot(){
var bx0=1e9,bx1=-1e9,by0=1e9,by1=-1e9,bz0=1e9,bz1=-1e9;
for(var i=0;i<nodes.length;i++){var n=nodes[i];if(!n)continue;if(n[0]<bx0)bx0=n[0];if(n[0]>bx1)bx1=n[0];if(n[1]<by0)by0=n[1];if(n[1]>by1)by1=n[1];if(n[2]<bz0)bz0=n[2];if(n[2]>bz1)bz1=n[2];}
var diag=Math.hypot(bx1-bx0,by1-by0,bz1-bz0)||1;
var umax=0;U.forEach(function(u){var m=Math.hypot(u[0],u[1],u[2]);if(m>umax)umax=m;});var dsc=umax>0?(0.12*diag)/umax:0;
var X=[],Y=[],Z=[],INT=[];
for(var i=0;i<nodes.length;i++){var n=nodes[i]||[0,0,0];var u=U.get(i)||[0,0,0];X.push(n[0]+u[0]*dsc);Y.push(n[1]+u[1]*dsc);Z.push(n[2]+u[2]*dsc);INT.push(u[2]);}
var I=[],J=[],K=[];
for(var e=0;e<elements.length;e++){var el2=elements[e];if(!el2||el2.length<4)continue;I.push(el2[0]);J.push(el2[1]);K.push(el2[2]);I.push(el2[0]);J.push(el2[2]);K.push(el2[3]);}
var mesh={type:"mesh3d",x:X,y:Y,z:Z,i:I,j:J,k:K,intensity:INT,colorscale:"Jet",reversescale:true,colorbar:{title:"uz [m]",thickness:14},flatshading:false,opacity:1,name:"losa",hovertemplate:"uz=%{intensity:.3e} m<extra></extra>"};
var fx=[],fy=[],fz=[];
for(var e=0;e<elements.length;e++){var el2=elements[e];if(!el2||el2.length!=2)continue;var a=nodes[el2[0]],b=nodes[el2[1]];var ua=U.get(el2[0])||[0,0,0],ub=U.get(el2[1])||[0,0,0];fx.push(a[0]+ua[0]*dsc,b[0]+ub[0]*dsc,null);fy.push(a[1]+ua[1]*dsc,b[1]+ub[1]*dsc,null);fz.push(a[2]+ua[2]*dsc,b[2]+ub[2]*dsc,null);}
var frames={type:"scatter3d",mode:"lines",x:fx,y:fy,z:fz,line:{color:"#222222",width:5},name:"columnas/vigas",hoverinfo:"skip"};
var sx=[],sy=[],sz=[];supdat.forEach(function(v,k){var n=nodes[k];if(n){sx.push(n[0]);sy.push(n[1]);sz.push(n[2]);}});
var sup={type:"scatter3d",mode:"markers",x:sx,y:sy,z:sz,marker:{size:5,color:"#2244aa",symbol:"diamond"},name:"apoyos",hoverinfo:"skip"};
var layout={margin:{l:0,r:0,t:28,b:0},width:640,height:480,scene:{aspectmode:"data",xaxis:{title:"X [m]"},yaxis:{title:"Y [m]"},zaxis:{title:"Z [m]"},camera:{up:{x:0,y:0,z:1},eye:{x:1.3,y:-1.5,z:1.0}}},title:{text:"Mesa-torsion (Plotly mesh3d) — color = uz",font:{size:13}}};
Plotly.newPlot(div,[mesh,frames,sup],layout,{responsive:true});
var info=document.createElement("div");info.style.cssText="font-family:Consolas,monospace;font-size:12px;color:#333;margin-top:4px";
info.innerHTML="Plotly mesh3d — "+nodes.length+" nodos, "+I.length+" triangulos. Flecha max "+umax.toExponential(3)+" m (deformada x"+(dsc>0?dsc.toFixed(0):0)+"). Barra de color + hover con valores. Arrastra=rota, rueda=zoom.";
div.appendChild(info);
}
}catch(e){document.getElementById("__ID__").innerText=`Error Hekatan Plotly: `+e+` | `+(e.stack||``);}})();'''

# ---- JS_END3D_FORCES: solve + fuerzas internas de frames (N,Vy,Vz,T,My,Mz) + diagramas 3D awatif + tabla ----
JS_END3D_FORCES = r'''
st("resolviendo FEM ("+nodes.length+" nodos, "+elements.length+" elementos)...");
var elemIdx=[];for(var i=0;i<elements.length;i++){for(var k=0;k<elements[i].length;k++)elemIdx.push(elements[i][k]);}
var esz=[];for(var i=0;i<elements.length;i++)esz.push(elements[i].length);
var eEl=new Map(),eA=new Map(),eIz=new Map(),eIy=new Map(),eG=new Map(),eJ=new Map(),eTh=new Map(),ePo=new Map(),ePf=new Map();
for(var i=0;i<elements.length;i++){eEl.set(i,mat.E);if(elements[i].length<=2){var ms=(self.emat&&self.emat[i])?self.emat[i]:mat;eA.set(i,ms.A);eIz.set(i,ms.Iz!==undefined?ms.Iz:ms.I);eIy.set(i,ms.Iy!==undefined?ms.Iy:ms.I);eG.set(i,ms.G);eJ.set(i,ms.J);}else{eTh.set(i,mat.t);ePo.set(i,mat.nu);ePf.set(i,mat.plate);}}
var flat=[];for(var i=0;i<nodes.length;i++){flat.push(nodes[i][0]);flat.push(nodes[i][1]);flat.push(nodes[i][2]);}
var nodesPtr=alloc(flat,Float64Array,mod.HEAPF64);
var elementsPtr=alloc(elemIdx,Uint32Array,mod.HEAPU32);
var elemSizesPtr=alloc(esz,Uint32Array,mod.HEAPU32);
var supKeys=Array.from(supdat.keys());var supKeysPtr=alloc(supKeys,Uint32Array,mod.HEAPU32);
var supVals=[];supdat.forEach(function(a){for(var j=0;j<6;j++)supVals.push(a[j]);});var supValsPtr=alloc(supVals,Uint8Array,mod.HEAPU8);
var ldKeys=Array.from(loaddat.keys());var ldKeysPtr=alloc(ldKeys,Uint32Array,mod.HEAPU32);
var ldVals=[];loaddat.forEach(function(a){for(var j=0;j<6;j++)ldVals.push(a[j]);});var ldValsPtr=alloc(ldVals,Float64Array,mod.HEAPF64);
var el=pmap(eEl),ar=pmap(eA),mz2=pmap(eIz),my2=pmap(eIy),sm=pmap(eG),to=pmap(eJ),th=pmap(eTh),po=pmap(ePo),pf=pmap(ePf);
var em=function(){return pmap(new Map());};var eo=em(),say=em(),saz=em(),dt=em(),ds=em();
var springsPtr=alloc([0],Float64Array,mod.HEAPF64);
var dOut=mod._malloc(4),dSz=mod._malloc(4),rOut=mod._malloc(4),rSz=mod._malloc(4);
mod._deform(nodesPtr,nodes.length,elementsPtr,elemIdx.length,elemSizesPtr,elements.length,supKeysPtr,supValsPtr,supKeys.length,ldKeysPtr,ldValsPtr,ldKeys.length,el.k,el.v,el.s,ar.k,ar.v,ar.s,mz2.k,mz2.v,mz2.s,my2.k,my2.v,my2.s,sm.k,sm.v,sm.s,to.k,to.v,to.s,th.k,th.v,th.s,po.k,po.v,po.s,eo.k,eo.v,eo.s,say.k,say.v,say.s,saz.k,saz.v,saz.s,springsPtr,0,pf.k,pf.v,pf.s,dt.k,dt.v,dt.s,ds.k,ds.v,ds.s,dOut,dSz,rOut,rSz);
var dPtr=mod.HEAPU32[dOut/4],dN=mod.HEAPU32[dSz/4];var df=new Float64Array(mod.HEAPF64.buffer,dPtr,dN);
var U6=new Map();for(var i=0;i<dN;i+=7){U6.set(df[i],[df[i+1],df[i+2],df[i+3],df[i+4],df[i+5],df[i+6]]);}
function fmat(e){return (self.emat&&self.emat[e])?self.emat[e]:mat;}
function lamL(ni,nj){var dx=nodes[nj][0]-nodes[ni][0],dy=nodes[nj][1]-nodes[ni][1],dz=nodes[nj][2]-nodes[ni][2];var L=Math.hypot(dx,dy,dz);var l=dx/L,m=dy/L,n=dz/L;var D=Math.sqrt(l*l+m*m);var lam;if(Math.abs(n-1)<1e-9)lam=[[0,0,1],[0,1,0],[-1,0,0]];else if(Math.abs(n+1)<1e-9)lam=[[0,0,-1],[0,1,0],[1,0,0]];else lam=[[l,m,n],[-m/D,l/D,0],[-l*n/D,-m*n/D,D]];return {lam:lam,L:L};}
function kloc(ms,L){var E=ms.E!==undefined?ms.E:mat.E,A=ms.A,Iz=ms.Iz!==undefined?ms.Iz:ms.I,Iy=ms.Iy!==undefined?ms.Iy:ms.I,G=ms.G,Jt=ms.J;var AsY=5/6*A,AsZ=5/6*A;var phiZ=(G>0)?(12*E*Iz)/(G*AsZ*L*L):0,phiY=(G>0)?(12*E*Iy)/(G*AsY*L*L):0;var EA=E*A/L,GJ=G*Jt/L;var tz=(12*E*Iz/(L*L*L))/(1+phiZ),bz=(6*E*Iz/(L*L))/(1+phiZ),kz=(4*E*Iz/L)*(1+phiZ/4)/(1+phiZ),az=(2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);var ty=(12*E*Iy/(L*L*L))/(1+phiY),by=(6*E*Iy/(L*L))/(1+phiY),ky=(4*E*Iy/L)*(1+phiY/4)/(1+phiY),ay=(2*E*Iy/L)*(1-phiY/2)/(1+phiY);var K=[];for(var i=0;i<12;i++)K.push(new Array(12).fill(0));K[0][0]=EA;K[0][6]=-EA;K[6][0]=-EA;K[6][6]=EA;K[3][3]=GJ;K[3][9]=-GJ;K[9][3]=-GJ;K[9][9]=GJ;K[1][1]=tz;K[1][5]=bz;K[1][7]=-tz;K[1][11]=bz;K[5][1]=bz;K[5][5]=kz;K[5][7]=-bz;K[5][11]=az;K[7][1]=-tz;K[7][5]=-bz;K[7][7]=tz;K[7][11]=-bz;K[11][1]=bz;K[11][5]=az;K[11][7]=-bz;K[11][11]=kz;K[2][2]=ty;K[2][4]=-by;K[2][8]=-ty;K[2][10]=-by;K[4][2]=-by;K[4][4]=ky;K[4][8]=by;K[4][10]=ay;K[8][2]=-ty;K[8][4]=by;K[8][8]=ty;K[8][10]=by;K[10][2]=-by;K[10][4]=ay;K[10][8]=by;K[10][10]=ky;return K;}
var FF=[];
for(var e=0;e<elements.length;e++){var el2=elements[e];if(!el2||el2.length!=2){FF.push(null);continue;}var ni=el2[0],nj=el2[1];var ll=lamL(ni,nj),lam=ll.lam,L=ll.L;var ms=fmat(e);var ui=U6.get(ni)||[0,0,0,0,0,0],uj=U6.get(nj)||[0,0,0,0,0,0];var dg=ui.concat(uj);var dl=new Array(12).fill(0);for(var blk=0;blk<4;blk++)for(var r=0;r<3;r++){var s=0;for(var c=0;c<3;c++)s+=lam[r][c]*dg[blk*3+c];dl[blk*3+r]=s;}var K=kloc(ms,L);var fl=new Array(12).fill(0);for(var r=0;r<12;r++){var s=0;for(var c=0;c<12;c++)s+=K[r][c]*dl[c];fl[r]=s;}var vert=Math.abs(nodes[ni][2]-nodes[nj][2])>1e-6;FF.push({ni:ni,nj:nj,pI:nodes[ni],pJ:nodes[nj],diry:lam[1],dirz:lam[2],N:-fl[0],Vy:-fl[1],Vz:-fl[2],T:-fl[3],MyI:-fl[4],MyJ:fl[10],MzI:-fl[5],MzJ:fl[11],tipo:vert?"columna":"viga"});}
st("cargando viewer 3D (Three.js)...");
var div=document.getElementById("__ID__");div.innerHTML=``;
var s1=document.createElement("script");s1.src="https://cdn.jsdelivr.net/npm/three@0.145.0/build/three.min.js";
s1.onload=function(){var s2=document.createElement("script");s2.src="https://cdn.jsdelivr.net/npm/three@0.145.0/examples/js/controls/OrbitControls.js";s2.onload=build3D;s2.onerror=function(){div.innerText="No se pudo cargar OrbitControls";};document.head.appendChild(s2);};
s1.onerror=function(){div.innerText="No se pudo cargar Three.js (sin internet?)";};
document.head.appendChild(s1);
var scn,cam,ren,ctrl,diag,diagGroup=null,labelGroup=null;
function makeLabel(txt,col){var c=document.createElement("canvas");c.width=160;c.height=34;var x=c.getContext("2d");x.fillStyle="rgba(255,255,255,0.78)";x.fillRect(0,0,160,34);x.fillStyle=col;x.font="20px Consolas,monospace";x.fillText(txt,4,23);var tx=new THREE.CanvasTexture(c);var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,depthTest:false}));sp.scale.set(diag*0.16,diag*0.034,1);return sp;}
function vadd(p,d,s){return new THREE.Vector3(p[0]+d[0]*s,p[1]+d[1]*s,p[2]+d[2]*s);}
function drawDiagram(type){
if(diagGroup){scn.remove(diagGroup);}if(labelGroup){scn.remove(labelGroup);}
diagGroup=new THREE.Group();labelGroup=new THREE.Group();
var COL={N:0x1f77b4,Vy:0x2ca02c,Vz:0x2ca02c,T:0x9467bd,My:0xd62728,Mz:0xd62728}[type];
var unit=(type=="N"||type=="Vy"||type=="Vz")?" kN":" kNm";var div1000=1000;
function ords(ff){if(type=="N")return [ff.N,ff.N,ff.diry];if(type=="Vy")return [ff.Vy,ff.Vy,ff.diry];if(type=="Vz")return [ff.Vz,ff.Vz,ff.dirz];if(type=="T")return [ff.T,ff.T,ff.diry];if(type=="My")return [ff.MyI,ff.MyJ,ff.dirz];return [ff.MzI,ff.MzJ,ff.diry];}
var mx=1e-9;for(var e=0;e<FF.length;e++){if(!FF[e])continue;var o=ords(FF[e]);mx=Math.max(mx,Math.abs(o[0]),Math.abs(o[1]));}
var sc=(0.18*diag)/mx;
var lc=new THREE.Color(COL);
for(var e=0;e<FF.length;e++){var ff=FF[e];if(!ff)continue;var o=ords(ff);var oI=o[0],oJ=o[1],dir=o[2];var pI=ff.pI,pJ=ff.pJ;var qI=vadd(pI,dir,oI*sc),qJ=vadd(pJ,dir,oJ*sc);var vpI=new THREE.Vector3(pI[0],pI[1],pI[2]),vpJ=new THREE.Vector3(pJ[0],pJ[1],pJ[2]);
var pos=[vpI.x,vpI.y,vpI.z, vpJ.x,vpJ.y,vpJ.z, qJ.x,qJ.y,qJ.z, vpI.x,vpI.y,vpI.z, qJ.x,qJ.y,qJ.z, qI.x,qI.y,qI.z];
var g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));diagGroup.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:COL,transparent:true,opacity:0.45,side:THREE.DoubleSide})));
var lp=[vpI.x,vpI.y,vpI.z,qI.x,qI.y,qI.z, vpJ.x,vpJ.y,vpJ.z,qJ.x,qJ.y,qJ.z, qI.x,qI.y,qI.z,qJ.x,qJ.y,qJ.z];var lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.Float32BufferAttribute(lp,3));diagGroup.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:COL})));
if(Math.max(Math.abs(oI),Math.abs(oJ))>0.28*mx){var big=Math.abs(oJ)>=Math.abs(oI)?[qJ,oJ]:[qI,oI];var lb=makeLabel((big[1]/div1000).toFixed(1),"#222");lb.position.copy(big[0]);labelGroup.add(lb);}}
scn.add(diagGroup);scn.add(labelGroup);
document.getElementById("__ID___hd").innerHTML="Diagrama "+type+" — max |"+type+"| = "+(mx/div1000).toFixed(2)+unit+" (columnas+vigas, sobre geometria no deformada)";
}
function build3D(){
var W=620,Hh=460;
scn=new THREE.Scene();scn.background=new THREE.Color(0xeef0f4);
cam=new THREE.PerspectiveCamera(45,W/Hh,0.01,2000);
ren=new THREE.WebGLRenderer({antialias:true});ren.setSize(W,Hh);
var sel=document.createElement("select");sel.id="__ID___sel";sel.style.cssText="font-family:Consolas,monospace;font-size:13px;margin-bottom:4px";var opts=[["Mz","Mz — momento flector (eje local z)"],["My","My — momento flector (eje local y)"],["Vy","Vy — cortante (local y)"],["Vz","Vz — cortante (local z)"],["N","N — axial"],["T","T — torsion"]];for(var i=0;i<opts.length;i++){var op=document.createElement("option");op.value=opts[i][0];op.text=opts[i][1];sel.appendChild(op);}
var hd=document.createElement("div");hd.id="__ID___hd";hd.style.cssText="font-family:Consolas,monospace;font-size:12px;color:#333;margin:2px 0 4px 0";
div.appendChild(sel);div.appendChild(hd);div.appendChild(ren.domElement);
ctrl=new THREE.OrbitControls(cam,ren.domElement);
scn.add(new THREE.AmbientLight(0xffffff,0.85));var dl=new THREE.DirectionalLight(0xffffff,0.45);dl.position.set(10,-15,20);scn.add(dl);
var bx0=1e9,bx1=-1e9,by0=1e9,by1=-1e9,bz0=1e9,bz1=-1e9;
for(var i=0;i<nodes.length;i++){var n=nodes[i];if(!n)continue;if(n[0]<bx0)bx0=n[0];if(n[0]>bx1)bx1=n[0];if(n[1]<by0)by0=n[1];if(n[1]>by1)by1=n[1];if(n[2]<bz0)bz0=n[2];if(n[2]>bz1)bz1=n[2];}
var cx=(bx0+bx1)/2,cy=(by0+by1)/2,cz=(bz0+bz1)/2;diag=Math.hypot(bx1-bx0,by1-by0,bz1-bz0)||1;
cam.up.set(0,0,1);cam.position.set(cx+diag*1.0,cy-diag*1.35,cz+diag*0.85);cam.lookAt(cx,cy,cz);ctrl.target.set(cx,cy,cz);ctrl.update();
var grid=new THREE.GridHelper(diag*1.3,13,0xc8c8c8,0xe4e4e4);grid.rotation.x=Math.PI/2;grid.position.set(cx,cy,0);scn.add(grid);
var wpos=[];for(var i=0;i<elements.length;i++){var e=elements[i];if(!e||e.length<4)continue;for(var w=0;w<4;w++){var a=nodes[e[w]],b=nodes[e[(w+1)%4]];wpos.push(a[0],a[1],a[2],b[0],b[1],b[2]);}}
var wg=new THREE.BufferGeometry();wg.setAttribute("position",new THREE.Float32BufferAttribute(wpos,3));scn.add(new THREE.LineSegments(wg,new THREE.LineBasicMaterial({color:0xbcc4cc})));
var lp=[];for(var i=0;i<elements.length;i++){var e=elements[i];if(!e||e.length!=2)continue;var a=nodes[e[0]],b=nodes[e[1]];lp.push(a[0],a[1],a[2],b[0],b[1],b[2]);}
var lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.Float32BufferAttribute(lp,3));scn.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0x333333})));
supdat.forEach(function(v,k){var n=nodes[k];if(!n)return;var ch=diag*0.06;var cone=new THREE.Mesh(new THREE.ConeGeometry(diag*0.03,ch,4),new THREE.MeshBasicMaterial({color:0x2244aa}));cone.position.set(n[0],n[1],n[2]-ch/2);cone.rotation.x=Math.PI/2;scn.add(cone);});
sel.onchange=function(){drawDiagram(sel.value);};
drawDiagram("Mz");
function anim(){requestAnimationFrame(anim);ctrl.update();ren.render(scn,cam);}anim();
var rows=``;var nf=0;
for(var e=0;e<FF.length;e++){var ff=FF[e];if(!ff)continue;nf++;rows+=`<tr><td>`+e+`</td><td>`+ff.tipo+`</td><td>`+(ff.N/1000).toFixed(1)+`</td><td>`+(ff.Vy/1000).toFixed(1)+`</td><td>`+(ff.Vz/1000).toFixed(1)+`</td><td>`+(ff.T/1000).toFixed(2)+`</td><td>`+(ff.MyI/1000).toFixed(1)+` / `+(ff.MyJ/1000).toFixed(1)+`</td><td>`+(ff.MzI/1000).toFixed(1)+` / `+(ff.MzJ/1000).toFixed(1)+`</td></tr>`;}
var tbl=`<div style="font-family:Consolas,monospace;font-size:11px;margin-top:6px;max-height:240px;overflow:auto"><b>Fuerzas internas de frames (`+nf+` columnas/vigas) — N,V en kN; T,M en kNm (valores en extremos i / j):</b><table border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;margin-top:3px"><tr style="background:#dde"><th>#</th><th>tipo</th><th>N</th><th>Vy</th><th>Vz</th><th>T</th><th>My i/j</th><th>Mz i/j</th></tr>`+rows+`</table></div>`;
var td=document.createElement("div");td.innerHTML=tbl;div.appendChild(td);
}
}catch(e){document.getElementById("__ID__").innerText=`Error Hekatan Forces: `+e+` | `+(e.stack||``);}})();'''

# ---- JS_END3D_RESULTS: viewer COMPLETO estilo Hekatan Struct: shell results (Mxx/Myy/Mxy/vonMises/uz, colormap 3D)
#      + frame results (N/Vy/Vz/T/My/Mz, diagramas) + etiquetas de MAX / MIN / CERO con sus valores ----
JS_END3D_RESULTS = r'''
st("resolviendo FEM ("+nodes.length+" nodos, "+elements.length+" elementos)...");
var elemIdx=[];for(var i=0;i<elements.length;i++){for(var k=0;k<elements[i].length;k++)elemIdx.push(elements[i][k]);}
var esz=[];for(var i=0;i<elements.length;i++)esz.push(elements[i].length);
var eEl=new Map(),eA=new Map(),eIz=new Map(),eIy=new Map(),eG=new Map(),eJ=new Map(),eTh=new Map(),ePo=new Map(),ePf=new Map();
for(var i=0;i<elements.length;i++){eEl.set(i,mat.E);if(elements[i].length<=2){var ms=(self.emat&&self.emat[i])?self.emat[i]:mat;eA.set(i,ms.A);eIz.set(i,ms.Iz!==undefined?ms.Iz:ms.I);eIy.set(i,ms.Iy!==undefined?ms.Iy:ms.I);eG.set(i,ms.G);eJ.set(i,ms.J);}else{eTh.set(i,mat.t);ePo.set(i,mat.nu);ePf.set(i,mat.plate);}}
var flat=[];for(var i=0;i<nodes.length;i++){flat.push(nodes[i][0]);flat.push(nodes[i][1]);flat.push(nodes[i][2]);}
var nodesPtr=alloc(flat,Float64Array,mod.HEAPF64);
var elementsPtr=alloc(elemIdx,Uint32Array,mod.HEAPU32);
var elemSizesPtr=alloc(esz,Uint32Array,mod.HEAPU32);
var supKeys=Array.from(supdat.keys());var supKeysPtr=alloc(supKeys,Uint32Array,mod.HEAPU32);
var supVals=[];supdat.forEach(function(a){for(var j=0;j<6;j++)supVals.push(a[j]);});var supValsPtr=alloc(supVals,Uint8Array,mod.HEAPU8);
var ldKeys=Array.from(loaddat.keys());var ldKeysPtr=alloc(ldKeys,Uint32Array,mod.HEAPU32);
var ldVals=[];loaddat.forEach(function(a){for(var j=0;j<6;j++)ldVals.push(a[j]);});var ldValsPtr=alloc(ldVals,Float64Array,mod.HEAPF64);
var el=pmap(eEl),ar=pmap(eA),mz2=pmap(eIz),my2=pmap(eIy),sm=pmap(eG),to=pmap(eJ),th=pmap(eTh),po=pmap(ePo),pf=pmap(ePf);
var em=function(){return pmap(new Map());};var eo=em(),say=em(),saz=em(),dt=em(),ds=em();
var springsPtr=alloc([0],Float64Array,mod.HEAPF64);
var dOut=mod._malloc(4),dSz=mod._malloc(4),rOut=mod._malloc(4),rSz=mod._malloc(4);
mod._deform(nodesPtr,nodes.length,elementsPtr,elemIdx.length,elemSizesPtr,elements.length,supKeysPtr,supValsPtr,supKeys.length,ldKeysPtr,ldValsPtr,ldKeys.length,el.k,el.v,el.s,ar.k,ar.v,ar.s,mz2.k,mz2.v,mz2.s,my2.k,my2.v,my2.s,sm.k,sm.v,sm.s,to.k,to.v,to.s,th.k,th.v,th.s,po.k,po.v,po.s,eo.k,eo.v,eo.s,say.k,say.v,say.s,saz.k,saz.v,saz.s,springsPtr,0,pf.k,pf.v,pf.s,dt.k,dt.v,dt.s,ds.k,ds.v,ds.s,dOut,dSz,rOut,rSz);
var dPtr=mod.HEAPU32[dOut/4],dN=mod.HEAPU32[dSz/4];var df=new Float64Array(mod.HEAPF64.buffer,dPtr,dN);
var U6=new Map();for(var i=0;i<dN;i+=7){U6.set(df[i],[df[i+1],df[i+2],df[i+3],df[i+4],df[i+5],df[i+6]]);}
function fmat(e){return (self.emat&&self.emat[e])?self.emat[e]:mat;}
/* SHELL stress recovery (CSI 2x2 Gauss + extrapolacion bilineal, port de analyze.ts) */
function q4stress(P,dxG,E,nu,t){
var p0=P[0],p1=P[1],p2=P[2],p3=P[3];
var v01=[p1[0]-p0[0],p1[1]-p0[1],p1[2]-p0[2]],v32=[p2[0]-p3[0],p2[1]-p3[1],p2[2]-p3[2]];
var lxR=[v01[0]+v32[0],v01[1]+v32[1],v01[2]+v32[2]];var mLx=Math.hypot(lxR[0],lxR[1],lxR[2])||1;var lX=[lxR[0]/mLx,lxR[1]/mLx,lxR[2]/mLx];
var d02=[p2[0]-p0[0],p2[1]-p0[1],p2[2]-p0[2]],d13=[p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]];
var lzR=[d02[1]*d13[2]-d02[2]*d13[1],d02[2]*d13[0]-d02[0]*d13[2],d02[0]*d13[1]-d02[1]*d13[0]];var mLz=Math.hypot(lzR[0],lzR[1],lzR[2])||1;var lZ=[lzR[0]/mLz,lzR[1]/mLz,lzR[2]/mLz];
var lY=[lZ[1]*lX[2]-lZ[2]*lX[1],lZ[2]*lX[0]-lZ[0]*lX[2],lZ[0]*lX[1]-lZ[1]*lX[0]];var mLy=Math.hypot(lY[0],lY[1],lY[2])||1;lY=[lY[0]/mLy,lY[1]/mLy,lY[2]/mLy];
lX=[lY[1]*lZ[2]-lY[2]*lZ[1],lY[2]*lZ[0]-lY[0]*lZ[2],lY[0]*lZ[1]-lY[1]*lZ[0]];
var cx=0.25*(p0[0]+p1[0]+p2[0]+p3[0]),cy=0.25*(p0[1]+p1[1]+p2[1]+p3[1]),cz=0.25*(p0[2]+p1[2]+p2[2]+p3[2]);
var xl=[],yl=[];for(var n=0;n<4;n++){var dx=P[n][0]-cx,dy=P[n][1]-cy,dz=P[n][2]-cz;xl.push(dx*lX[0]+dy*lX[1]+dz*lX[2]);yl.push(dx*lY[0]+dy*lY[1]+dz*lY[2]);}
var R=[lX,lY,lZ];var uL=new Array(24).fill(0);
for(var n=0;n<4;n++){var gi=n*6;for(var r=0;r<3;r++)uL[n*6+r]=R[r][0]*dxG[gi]+R[r][1]*dxG[gi+1]+R[r][2]*dxG[gi+2];for(var r=0;r<3;r++)uL[n*6+3+r]=R[r][0]*dxG[gi+3]+R[r][1]*dxG[gi+4]+R[r][2]*dxG[gi+5];}
var Df=E/(1-nu*nu);var Dm=[[Df*t,Df*nu*t,0],[Df*nu*t,Df*t,0],[0,0,Df*(1-nu)/2*t]];var t3=t*t*t/12;var Db=[[Df*t3,Df*nu*t3,0],[Df*nu*t3,Df*t3,0],[0,0,Df*(1-nu)/2*t3]];
function ev(xi,eta){var dNx=[-0.25*(1-eta),0.25*(1-eta),0.25*(1+eta),-0.25*(1+eta)],dNe=[-0.25*(1-xi),-0.25*(1+xi),0.25*(1+xi),0.25*(1-xi)];
var J00=0,J01=0,J10=0,J11=0;for(var n=0;n<4;n++){J00+=dNx[n]*xl[n];J01+=dNx[n]*yl[n];J10+=dNe[n]*xl[n];J11+=dNe[n]*yl[n];}var dJ=J00*J11-J01*J10;if(Math.abs(dJ)<1e-20)return{Mx:0,My:0,Mxy:0,vm:0};
var i00=J11/dJ,i01=-J01/dJ,i10=-J10/dJ,i11=J00/dJ;var ax=[],ay=[];for(var n=0;n<4;n++){ax.push(i00*dNx[n]+i01*dNe[n]);ay.push(i10*dNx[n]+i11*dNe[n]);}
var eXX=0,eYY=0,gXY=0;for(var n=0;n<4;n++){var u=uL[n*6],v=uL[n*6+1];eXX+=ax[n]*u;eYY+=ay[n]*v;gXY+=ay[n]*u+ax[n]*v;}
var Nx=Dm[0][0]*eXX+Dm[0][1]*eYY,Ny=Dm[1][0]*eXX+Dm[1][1]*eYY,Nxy=Dm[2][2]*gXY;
var kXX=0,kYY=0,kXY=0;for(var n=0;n<4;n++){var tX=uL[n*6+3],tY=uL[n*6+4];kXX+=-ax[n]*tY;kYY+=ay[n]*tX;kXY+=ax[n]*tX-ay[n]*tY;}
var Mx=Db[0][0]*kXX+Db[0][1]*kYY,My=Db[1][0]*kXX+Db[1][1]*kYY,Mxy=Db[2][2]*kXY;
var sxxT=Nx/t+6*Mx/(t*t),syyT=Ny/t+6*My/(t*t),sxyT=Nxy/t+6*Mxy/(t*t);var sxxB=Nx/t-6*Mx/(t*t),syyB=Ny/t-6*My/(t*t),sxyB=Nxy/t-6*Mxy/(t*t);
var vmT=Math.sqrt(sxxT*sxxT-sxxT*syyT+syyT*syyT+3*sxyT*sxyT),vmB=Math.sqrt(sxxB*sxxB-sxxB*syyB+syyB*syyB+3*sxyB*sxyB);
return{Mx:Mx,My:My,Mxy:Mxy,vm:Math.max(vmT,vmB),Nx:Nx,Ny:Ny,Nxy:Nxy};}
var gp=1/Math.sqrt(3);var G4=[[-gp,-gp],[gp,-gp],[gp,gp],[-gp,gp]];var g=[ev(G4[0][0],G4[0][1]),ev(G4[1][0],G4[1][1]),ev(G4[2][0],G4[2][1]),ev(G4[3][0],G4[3][1])];
var s3=Math.sqrt(3);var A4=1+s3/2,B4=-0.5,C4=1-s3/2;var E4=[[A4,B4,C4,B4],[B4,A4,B4,C4],[C4,B4,A4,B4],[B4,C4,B4,A4]];
function exr(f,ni){var r=E4[ni];return r[0]*g[0][f]+r[1]*g[1][f]+r[2]*g[2][f]+r[3]*g[3][f];}
var nd=[];for(var ni=0;ni<4;ni++)nd.push({Mxx:exr("Mx",ni),Myy:exr("My",ni),Mxy:exr("Mxy",ni),vonMises:exr("vm",ni),Nx:exr("Nx",ni),Ny:exr("Ny",ni),Nxy:exr("Nxy",ni)});
return nd;}
/* acumular valores nodales (promedio inter-elemento) por nodo global */
var SH={Mxx:new Map(),Myy:new Map(),Mxy:new Map(),vonMises:new Map(),Nx:new Map(),Ny:new Map(),Nxy:new Map()};var SHc=new Map();var shellNodes={};
for(var e=0;e<elements.length;e++){var el2=elements[e];if(!el2||el2.length<4)continue;var P=[nodes[el2[0]],nodes[el2[1]],nodes[el2[2]],nodes[el2[3]]];
var dxG=[];for(var n=0;n<4;n++){var u=U6.get(el2[n])||[0,0,0,0,0,0];for(var k=0;k<6;k++)dxG.push(u[k]);}
var ms=fmat(e);var nd=q4stress(P,dxG,mat.E,mat.nu,mat.t);
for(var n=0;n<4;n++){var gn=el2[n];shellNodes[gn]=1;["Mxx","Myy","Mxy","vonMises","Nx","Ny","Nxy"].forEach(function(f){SH[f].set(gn,(SH[f].get(gn)||0)+nd[n][f]);});SHc.set(gn,(SHc.get(gn)||0)+1);}}
Object.keys(shellNodes).forEach(function(gns){var gn=+gns;var c=SHc.get(gn)||1;["Mxx","Myy","Mxy","vonMises","Nx","Ny","Nxy"].forEach(function(f){SH[f].set(gn,SH[f].get(gn)/c);});});
/* FRAME internal forces (port analyze.ts) */
function lamL(ni,nj){var dx=nodes[nj][0]-nodes[ni][0],dy=nodes[nj][1]-nodes[ni][1],dz=nodes[nj][2]-nodes[ni][2];var L=Math.hypot(dx,dy,dz);var l=dx/L,m=dy/L,n=dz/L;var D=Math.sqrt(l*l+m*m);var lam;if(Math.abs(n-1)<1e-9)lam=[[0,0,1],[0,1,0],[-1,0,0]];else if(Math.abs(n+1)<1e-9)lam=[[0,0,-1],[0,1,0],[1,0,0]];else lam=[[l,m,n],[-m/D,l/D,0],[-l*n/D,-m*n/D,D]];return {lam:lam,L:L};}
function kloc(ms,L){var E=ms.E!==undefined?ms.E:mat.E,A=ms.A,Iz=ms.Iz!==undefined?ms.Iz:ms.I,Iy=ms.Iy!==undefined?ms.Iy:ms.I,G=ms.G,Jt=ms.J;var AsY=5/6*A,AsZ=5/6*A;var phiZ=(G>0)?(12*E*Iz)/(G*AsZ*L*L):0,phiY=(G>0)?(12*E*Iy)/(G*AsY*L*L):0;var EA=E*A/L,GJ=G*Jt/L;var tz=(12*E*Iz/(L*L*L))/(1+phiZ),bz=(6*E*Iz/(L*L))/(1+phiZ),kz=(4*E*Iz/L)*(1+phiZ/4)/(1+phiZ),az=(2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);var ty=(12*E*Iy/(L*L*L))/(1+phiY),by=(6*E*Iy/(L*L))/(1+phiY),ky=(4*E*Iy/L)*(1+phiY/4)/(1+phiY),ay=(2*E*Iy/L)*(1-phiY/2)/(1+phiY);var K=[];for(var i=0;i<12;i++)K.push(new Array(12).fill(0));K[0][0]=EA;K[0][6]=-EA;K[6][0]=-EA;K[6][6]=EA;K[3][3]=GJ;K[3][9]=-GJ;K[9][3]=-GJ;K[9][9]=GJ;K[1][1]=tz;K[1][5]=bz;K[1][7]=-tz;K[1][11]=bz;K[5][1]=bz;K[5][5]=kz;K[5][7]=-bz;K[5][11]=az;K[7][1]=-tz;K[7][5]=-bz;K[7][7]=tz;K[7][11]=-bz;K[11][1]=bz;K[11][5]=az;K[11][7]=-bz;K[11][11]=kz;K[2][2]=ty;K[2][4]=-by;K[2][8]=-ty;K[2][10]=-by;K[4][2]=-by;K[4][4]=ky;K[4][8]=by;K[4][10]=ay;K[8][2]=-ty;K[8][4]=by;K[8][8]=ty;K[8][10]=by;K[10][2]=-by;K[10][4]=ay;K[10][8]=by;K[10][10]=ky;return K;}
var FF=[];for(var e=0;e<elements.length;e++){var el2=elements[e];if(!el2||el2.length!=2){FF.push(null);continue;}var ni=el2[0],nj=el2[1];var ll=lamL(ni,nj),lam=ll.lam,L=ll.L;var ms=fmat(e);var ui=U6.get(ni)||[0,0,0,0,0,0],uj=U6.get(nj)||[0,0,0,0,0,0];var dg=ui.concat(uj);var dl=new Array(12).fill(0);for(var blk=0;blk<4;blk++)for(var r=0;r<3;r++){var s=0;for(var c=0;c<3;c++)s+=lam[r][c]*dg[blk*3+c];dl[blk*3+r]=s;}var K=kloc(ms,L);var fl=new Array(12).fill(0);for(var r=0;r<12;r++){var s=0;for(var c=0;c<12;c++)s+=K[r][c]*dl[c];fl[r]=s;}var vert=Math.abs(nodes[ni][2]-nodes[nj][2])>1e-6;FF.push({ni:ni,nj:nj,pI:nodes[ni],pJ:nodes[nj],diry:lam[1],dirz:lam[2],N:-fl[0],Vy:-fl[1],Vz:-fl[2],T:-fl[3],MyI:-fl[4],MyJ:fl[10],MzI:-fl[5],MzJ:fl[11],tipo:vert?"columna":"viga"});}
st("cargando viewer 3D (Three.js)...");
var div=document.getElementById("__ID__");div.innerHTML=``;
var s1=document.createElement("script");s1.src="https://cdn.jsdelivr.net/npm/three@0.145.0/build/three.min.js";
s1.onload=function(){var s2=document.createElement("script");s2.src="https://cdn.jsdelivr.net/npm/three@0.145.0/examples/js/controls/OrbitControls.js";s2.onload=build3D;s2.onerror=function(){div.innerText="No se pudo cargar OrbitControls";};document.head.appendChild(s2);};
s1.onerror=function(){div.innerText="No se pudo cargar Three.js (sin internet?)";};
document.head.appendChild(s1);
var SHELLTYPES={uz:1,ux:1,uy:1,rx:1,ry:1,rz:1,vonMises:1,Mxx:1,Myy:1,Mxy:1,Nx:1,Ny:1,Nxy:1};
var META={uz:[" mm",1000],ux:[" mm",1000],uy:[" mm",1000],rx:[" mrad",1000],ry:[" mrad",1000],rz:[" mrad",1000],vonMises:[" MPa",1e-6],Mxx:[" kNm/m",1e-3],Myy:[" kNm/m",1e-3],Mxy:[" kNm/m",1e-3],Nx:[" kN/m",1e-3],Ny:[" kN/m",1e-3],Nxy:[" kN/m",1e-3],N:[" kN",1e-3],Vy:[" kN",1e-3],Vz:[" kN",1e-3],T:[" kNm",1e-3],My:[" kNm",1e-3],Mz:[" kNm",1e-3]};
var scn,cam,ren,ctrl,diag,cx,cy,cz,shellMesh=null,vertNode=[],vertVal=[],diagGroup=null,labelGroup=null,cbar,cbTop,cbMid,cbBot,cbTit,hd,curType="vonMises",curIsFrame=false,DEF=false,dscale=0,frameLines=null,wireMesh=null;
function jet(t){t=Math.max(0,Math.min(1,t));var r=Math.max(0,Math.min(1,Math.min(4*t-1.5,-4*t+4.5))),g=Math.max(0,Math.min(1,Math.min(4*t-0.5,-4*t+3.5))),b=Math.max(0,Math.min(1,Math.min(4*t+0.5,-4*t+2.5)));return [r,g,b];}
function dpos(i){var n=nodes[i];if(!DEF)return n;var u=U6.get(i)||[0,0,0,0,0,0];return [n[0]+u[0]*dscale,n[1]+u[1]*dscale,n[2]+u[2]*dscale];}
function makeLabel(txt,col,bg){var c=document.createElement("canvas");c.width=190;c.height=36;var x=c.getContext("2d");x.fillStyle=bg;x.fillRect(0,0,190,36);x.strokeStyle=col;x.lineWidth=2;x.strokeRect(1,1,188,34);x.fillStyle=col;x.font="bold 21px Consolas,monospace";x.fillText(txt,6,25);var tx=new THREE.CanvasTexture(c);var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,depthTest:false}));sp.scale.set(diag*0.19,diag*0.036,1);return sp;}
function vadd(p,d,s){return new THREE.Vector3(p[0]+d[0]*s,p[1]+d[1]*s,p[2]+d[2]*s);}
function shellField(type,gn){var u=U6.get(gn)||[0,0,0,0,0,0];if(type=="uz")return u[2];if(type=="ux")return u[0];if(type=="uy")return u[1];if(type=="rx")return u[3];if(type=="ry")return u[4];if(type=="rz")return u[5];return SH[type]?(SH[type].get(gn)||0):0;}
function setShellColors(type){if(!shellMesh)return;var col=shellMesh.geometry.getAttribute("color");if(type==null){for(var i=0;i<vertNode.length;i++)col.setXYZ(i,0.80,0.83,0.87);col.needsUpdate=true;return [0,0];}
var vmin=1e30,vmax=-1e30;Object.keys(shellNodes).forEach(function(gns){var v=shellField(type,+gns);if(v<vmin)vmin=v;if(v>vmax)vmax=v;});if(vmax-vmin<1e-12)vmax=vmin+1;
for(var i=0;i<vertNode.length;i++){var v=shellField(type,vertNode[i]);vertVal[i]=v;var c=jet((v-vmin)/(vmax-vmin));col.setXYZ(i,c[0],c[1],c[2]);}col.needsUpdate=true;return [vmin,vmax];}
function labelExtremes(type,isFrame){
if(labelGroup){scn.remove(labelGroup);}labelGroup=new THREE.Group();
var f=META[type][1],u=META[type][0];
if(!isFrame){var nmax=null,nmin=null,vmax=-1e30,vmin=1e30,nzero=null,vz=1e30;
Object.keys(shellNodes).forEach(function(gns){var gn=+gns;var v=shellField(type,gn);if(v>vmax){vmax=v;nmax=gn;}if(v<vmin){vmin=v;nmin=gn;}if(Math.abs(v)<vz){vz=Math.abs(v);nzero=gn;}});
function lab(gn,v,col){var n=dpos(gn);var sp=makeLabel((v*f).toFixed(2)+u,col,"rgba(255,255,255,0.85)");sp.position.set(n[0],n[1],n[2]+diag*0.04);labelGroup.add(sp);}
if(nmax!=null)lab(nmax,vmax,"#c81e1e");if(nmin!=null)lab(nmin,vmin,"#1e46c8");
if(vmin<0&&vmax>0&&nzero!=null)lab(nzero,0,"#1a7d1a");
}else{
var mxv=-1e30,mnv=1e30,mxp=null,mnp=null;
function ords(ff){if(type=="N")return [ff.N,ff.N,ff.diry];if(type=="Vy")return [ff.Vy,ff.Vy,ff.diry];if(type=="Vz")return [ff.Vz,ff.Vz,ff.dirz];if(type=="T")return [ff.T,ff.T,ff.diry];if(type=="My")return [ff.MyI,ff.MyJ,ff.dirz];return [ff.MzI,ff.MzJ,ff.diry];}
var zerop=null;
for(var e=0;e<FF.length;e++){var ff=FF[e];if(!ff)continue;var aI=dpos(ff.ni),aJ=dpos(ff.nj);var o=ords(ff);var pts=[[aI,o[0]],[aJ,o[1]]];for(var q=0;q<2;q++){var v=pts[q][1],p=pts[q][0];if(v>mxv){mxv=v;mxp=p;}if(v<mnv){mnv=v;mnp=p;}}
if(o[0]*o[1]<0&&zerop==null){var tt=Math.abs(o[0])/(Math.abs(o[0])+Math.abs(o[1]));zerop=[aI[0]+(aJ[0]-aI[0])*tt,aI[1]+(aJ[1]-aI[1])*tt,aI[2]+(aJ[2]-aI[2])*tt];}}
function labp(p,v,col){var sp=makeLabel((v*f).toFixed(2)+u,col,"rgba(255,255,255,0.85)");sp.position.set(p[0],p[1],p[2]+diag*0.03);labelGroup.add(sp);}
if(mxp)labp(mxp,mxv,"#c81e1e");if(mnp)labp(mnp,mnv,"#1e46c8");if(zerop)labp(zerop,0,"#1a7d1a");
}
scn.add(labelGroup);}
function drawResult(type){
if(diagGroup){scn.remove(diagGroup);diagGroup=null;}
var isFrame=!SHELLTYPES[type];curType=type;curIsFrame=isFrame;
if(!isFrame){var rng=setShellColors(type);var f=META[type][1],u=META[type][0];
cbar.style.display="block";cbTit.innerText=type;cbTop.innerText=(rng[1]*f).toFixed(2)+u;cbMid.innerText=(((rng[0]+rng[1])/2)*f).toFixed(2);cbBot.innerText=(rng[0]*f).toFixed(2);
hd.innerHTML="Shell result: "+type+" — max="+(rng[1]*f).toFixed(2)+u+", min="+(rng[0]*f).toFixed(2)+u+"  (rojo=max, azul=min, verde=0)";
labelExtremes(type,false);
}else{setShellColors(null);cbar.style.display="none";
diagGroup=new THREE.Group();var COL={N:0x1f77b4,Vy:0x2ca02c,Vz:0x2ca02c,T:0x9467bd,My:0xd62728,Mz:0xd62728}[type];
function ords(ff){if(type=="N")return [ff.N,ff.N,ff.diry];if(type=="Vy")return [ff.Vy,ff.Vy,ff.diry];if(type=="Vz")return [ff.Vz,ff.Vz,ff.dirz];if(type=="T")return [ff.T,ff.T,ff.diry];if(type=="My")return [ff.MyI,ff.MyJ,ff.dirz];return [ff.MzI,ff.MzJ,ff.diry];}
var mx=1e-9;for(var e=0;e<FF.length;e++){if(!FF[e])continue;var o=ords(FF[e]);mx=Math.max(mx,Math.abs(o[0]),Math.abs(o[1]));}var sc=(0.18*diag)/mx;
for(var e=0;e<FF.length;e++){var ff=FF[e];if(!ff)continue;var o=ords(ff);var aI=dpos(ff.ni),aJ=dpos(ff.nj);var qI=vadd(aI,o[2],o[0]*sc),qJ=vadd(aJ,o[2],o[1]*sc);var vpI=new THREE.Vector3(aI[0],aI[1],aI[2]),vpJ=new THREE.Vector3(aJ[0],aJ[1],aJ[2]);
var pos=[vpI.x,vpI.y,vpI.z,vpJ.x,vpJ.y,vpJ.z,qJ.x,qJ.y,qJ.z, vpI.x,vpI.y,vpI.z,qJ.x,qJ.y,qJ.z,qI.x,qI.y,qI.z];var gm=new THREE.BufferGeometry();gm.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));var rmesh=new THREE.Mesh(gm,new THREE.MeshBasicMaterial({color:COL,transparent:true,opacity:0.45,side:THREE.DoubleSide}));rmesh.userData={oI:o[0],oJ:o[1],pI:aI,pJ:aJ};diagGroup.add(rmesh);
var lp=[vpI.x,vpI.y,vpI.z,qI.x,qI.y,qI.z, vpJ.x,vpJ.y,vpJ.z,qJ.x,qJ.y,qJ.z, qI.x,qI.y,qI.z,qJ.x,qJ.y,qJ.z];var lgm=new THREE.BufferGeometry();lgm.setAttribute("position",new THREE.Float32BufferAttribute(lp,3));diagGroup.add(new THREE.LineSegments(lgm,new THREE.LineBasicMaterial({color:COL})));}
scn.add(diagGroup);
hd.innerHTML="Frame result: "+type+" — max="+(mx*META[type][1]).toFixed(2)+META[type][0]+"  (etiquetas: rojo=max, azul=min, verde=0)";
labelExtremes(type,true);}
}
function build3D(){
var W=640,Hh=470;
scn=new THREE.Scene();scn.background=new THREE.Color(0xeef0f4);
cam=new THREE.PerspectiveCamera(45,W/Hh,0.01,2000);
ren=new THREE.WebGLRenderer({antialias:true});ren.setSize(W,Hh);
var sel=document.createElement("select");sel.style.cssText="font-family:Consolas,monospace;font-size:13px;margin-bottom:3px";
var og1=document.createElement("optgroup");og1.label="Shell results (losa/membrana)";[["uz","uz — desplaz. en Z"],["ux","ux — desplaz. en X"],["uy","uy — desplaz. en Y"],["rx","θx — rotacion"],["ry","θy — rotacion (drilling plano XZ)"],["rz","θz — rotacion (drilling plano XY)"],["vonMises","von Mises"],["Mxx","Mxx — momento"],["Myy","Myy — momento"],["Mxy","Mxy — momento torsor"],["Nx","Nx — axil membrana"],["Ny","Ny — axil membrana"],["Nxy","Nxy — cortante membrana"]].forEach(function(o){var op=document.createElement("option");op.value=o[0];op.text=o[1];og1.appendChild(op);});
var og2=document.createElement("optgroup");og2.label="Frame results (columnas/vigas)";[["Mz","Mz — momento flector"],["My","My — momento flector"],["Vy","Vy — cortante"],["Vz","Vz — cortante"],["N","N — axial"],["T","T — torsion"]].forEach(function(o){var op=document.createElement("option");op.value=o[0];op.text=o[1];og2.appendChild(op);});
sel.appendChild(og1);sel.appendChild(og2);
var chk=document.createElement("label");chk.style.cssText="font:12px Consolas,monospace;margin-left:12px;color:#333";var cb=document.createElement("input");cb.type="checkbox";cb.onchange=function(){DEF=cb.checked;rebuildGeom();drawResult(curType);};chk.appendChild(cb);chk.appendChild(document.createTextNode(" deformada"));
hd=document.createElement("div");hd.style.cssText="font-family:Consolas,monospace;font-size:12px;color:#333;margin:2px 0 4px 0";
div.appendChild(sel);div.appendChild(chk);div.appendChild(hd);
var wrap=document.createElement("div");wrap.style.cssText="position:relative;display:inline-block";wrap.appendChild(ren.domElement);
cbar=document.createElement("div");cbar.style.cssText="position:absolute;right:6px;top:14px;width:20px;height:200px;border:1px solid #888;background:linear-gradient(to top,rgb(0,0,255),rgb(0,255,255),rgb(0,255,0),rgb(255,255,0),rgb(255,0,0))";
cbTit=document.createElement("div");cbTit.style.cssText="position:absolute;right:6px;top:-2px;font:bold 11px Consolas;color:#333";
cbTop=document.createElement("div");cbTop.style.cssText="position:absolute;right:30px;top:10px;font:11px Consolas;color:#333";
cbMid=document.createElement("div");cbMid.style.cssText="position:absolute;right:30px;top:108px;font:11px Consolas;color:#333";
cbBot=document.createElement("div");cbBot.style.cssText="position:absolute;right:30px;top:205px;font:11px Consolas;color:#333";
wrap.appendChild(cbar);wrap.appendChild(cbTit);wrap.appendChild(cbTop);wrap.appendChild(cbMid);wrap.appendChild(cbBot);
div.appendChild(wrap);
ctrl=new THREE.OrbitControls(cam,ren.domElement);
scn.add(new THREE.AmbientLight(0xffffff,0.9));var dl=new THREE.DirectionalLight(0xffffff,0.4);dl.position.set(10,-15,20);scn.add(dl);
var bx0=1e9,bx1=-1e9,by0=1e9,by1=-1e9,bz0=1e9,bz1=-1e9;
for(var i=0;i<nodes.length;i++){var n=nodes[i];if(!n)continue;if(n[0]<bx0)bx0=n[0];if(n[0]>bx1)bx1=n[0];if(n[1]<by0)by0=n[1];if(n[1]>by1)by1=n[1];if(n[2]<bz0)bz0=n[2];if(n[2]>bz1)bz1=n[2];}
cx=(bx0+bx1)/2;cy=(by0+by1)/2;cz=(bz0+bz1)/2;diag=Math.hypot(bx1-bx0,by1-by0,bz1-bz0)||1;
cam.up.set(0,0,1);cam.position.set(cx+diag*1.0,cy-diag*1.35,cz+diag*0.85);cam.lookAt(cx,cy,cz);ctrl.target.set(cx,cy,cz);ctrl.update();
var grid=new THREE.GridHelper(diag*1.3,13,0xc8c8c8,0xe4e4e4);grid.rotation.x=Math.PI/2;grid.position.set(cx,cy,0);scn.add(grid);
var umax6=0;U6.forEach(function(u){var m=Math.hypot(u[0],u[1],u[2]);if(m>umax6)umax6=m;});dscale=umax6>0?(0.12*diag)/umax6:0;
function rebuildGeom(){if(shellMesh){scn.remove(shellMesh);}if(wireMesh){scn.remove(wireMesh);}if(frameLines){scn.remove(frameLines);}
var pos=[],vc=[];vertNode=[];
for(var i=0;i<elements.length;i++){var e=elements[i];if(!e||e.length<4)continue;var q=[e[0],e[1],e[2],e[3]];var tri=[0,1,2,0,2,3];for(var k=0;k<6;k++){var gn=q[tri[k]];var n=dpos(gn);pos.push(n[0],n[1],n[2]);vc.push(0.8,0.83,0.87);vertNode.push(gn);}}
var geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));geo.setAttribute("color",new THREE.Float32BufferAttribute(vc,3));geo.computeVertexNormals();shellMesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide}));scn.add(shellMesh);
var wpos=[];for(var i=0;i<elements.length;i++){var e=elements[i];if(!e||e.length<4)continue;for(var w=0;w<4;w++){var a=dpos(e[w]),b=dpos(e[(w+1)%4]);wpos.push(a[0],a[1],a[2],b[0],b[1],b[2]);}}
var wg=new THREE.BufferGeometry();wg.setAttribute("position",new THREE.Float32BufferAttribute(wpos,3));wireMesh=new THREE.LineSegments(wg,new THREE.LineBasicMaterial({color:0x99a3ad}));scn.add(wireMesh);
var lp=[];for(var i=0;i<elements.length;i++){var e=elements[i];if(!e||e.length!=2)continue;var a=dpos(e[0]),b=dpos(e[1]);lp.push(a[0],a[1],a[2],b[0],b[1],b[2]);}
var lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.Float32BufferAttribute(lp,3));frameLines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0x333333}));scn.add(frameLines);}
rebuildGeom();
supdat.forEach(function(v,k){var n=nodes[k];if(!n)return;var ch=diag*0.06;var cone=new THREE.Mesh(new THREE.ConeGeometry(diag*0.03,ch,4),new THREE.MeshBasicMaterial({color:0x2244aa}));cone.position.set(n[0],n[1],n[2]-ch/2);cone.rotation.x=Math.PI/2;scn.add(cone);});
var ray=new THREE.Raycaster();var mouse=new THREE.Vector2();var tip=document.createElement("div");tip.style.cssText="position:fixed;pointer-events:none;background:rgba(20,20,28,0.92);color:#fff;font:12px Consolas,monospace;padding:3px 8px;border-radius:4px;display:none;z-index:99999";document.body.appendChild(tip);
ren.domElement.addEventListener("mousemove",function(ev){var rect=ren.domElement.getBoundingClientRect();mouse.x=((ev.clientX-rect.left)/rect.width)*2-1;mouse.y=-((ev.clientY-rect.top)/rect.height)*2+1;ray.setFromCamera(mouse,cam);var f=META[curType][1],u=META[curType][0];var shown=false,val=0;
if(!curIsFrame&&shellMesh){var hits=ray.intersectObject(shellMesh,false);if(hits.length){var fa=hits[0].face;var ap=shellMesh.geometry.attributes.position;var pa=new THREE.Vector3().fromBufferAttribute(ap,fa.a),pb=new THREE.Vector3().fromBufferAttribute(ap,fa.b),pc=new THREE.Vector3().fromBufferAttribute(ap,fa.c);var bc=new THREE.Vector3();new THREE.Triangle(pa,pb,pc).getBarycoord(hits[0].point,bc);val=bc.x*vertVal[fa.a]+bc.y*vertVal[fa.b]+bc.z*vertVal[fa.c];shown=true;}}
else if(curIsFrame&&diagGroup){var ms=diagGroup.children.filter(function(c){return c.userData&&c.userData.pI;});var hits=ray.intersectObjects(ms,false);if(hits.length){var ud=hits[0].object.userData;var ax=[ud.pJ[0]-ud.pI[0],ud.pJ[1]-ud.pI[1],ud.pJ[2]-ud.pI[2]];var L2=ax[0]*ax[0]+ax[1]*ax[1]+ax[2]*ax[2]||1;var hp=hits[0].point;var t=((hp.x-ud.pI[0])*ax[0]+(hp.y-ud.pI[1])*ax[1]+(hp.z-ud.pI[2])*ax[2])/L2;t=Math.max(0,Math.min(1,t));val=ud.oI+(ud.oJ-ud.oI)*t;shown=true;}}
if(shown){tip.style.display="block";tip.style.left=(ev.clientX+13)+"px";tip.style.top=(ev.clientY+8)+"px";tip.innerHTML=curType+" = "+(val*f).toFixed(2)+u;}else{tip.style.display="none";}});
ren.domElement.addEventListener("mouseleave",function(){tip.style.display="none";});
sel.onchange=function(){drawResult(sel.value);};
sel.value="vonMises";drawResult("vonMises");
function anim(){requestAnimationFrame(anim);ctrl.update();ren.render(scn,cam);}anim();
var rows=``;var nf=0;for(var e=0;e<FF.length;e++){var ff=FF[e];if(!ff)continue;nf++;rows+=`<tr><td>`+e+`</td><td>`+ff.tipo+`</td><td>`+(ff.N/1000).toFixed(1)+`</td><td>`+(ff.Vy/1000).toFixed(1)+`</td><td>`+(ff.Vz/1000).toFixed(1)+`</td><td>`+(ff.T/1000).toFixed(2)+`</td><td>`+(ff.MyI/1000).toFixed(1)+` / `+(ff.MyJ/1000).toFixed(1)+`</td><td>`+(ff.MzI/1000).toFixed(1)+` / `+(ff.MzJ/1000).toFixed(1)+`</td></tr>`;}
var td=document.createElement("div");td.innerHTML=`<div style="font-family:Consolas,monospace;font-size:11px;margin-top:6px;max-height:200px;overflow:auto"><b>Frame results (`+nf+` columnas/vigas) — N,V[kN] T,M[kNm] (extremos i / j):</b><table border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;margin-top:3px"><tr style="background:#dde"><th>#</th><th>tipo</th><th>N</th><th>Vy</th><th>Vz</th><th>T</th><th>My i/j</th><th>Mz i/j</th></tr>`+rows+`</table></div>`;div.appendChild(td);
}
}catch(e){document.getElementById("__ID__").innerText=`Error Hekatan Results: `+e+` | `+(e.stack||``);}})();'''

# ---- JS_END2D: viewer 2D en canvas PURO (sin Three.js, offline) — planta de la losa con shell results,
#      lineas de contorno + colorbar + HOVER bilineal con crosshair y valor en el cursor ----
JS_END2D = r'''
st("resolviendo FEM ("+nodes.length+" nodos, "+elements.length+" elementos)...");
var elemIdx=[];for(var i=0;i<elements.length;i++){for(var k=0;k<elements[i].length;k++)elemIdx.push(elements[i][k]);}
var esz=[];for(var i=0;i<elements.length;i++)esz.push(elements[i].length);
var eEl=new Map(),eA=new Map(),eIz=new Map(),eIy=new Map(),eG=new Map(),eJ=new Map(),eTh=new Map(),ePo=new Map(),ePf=new Map();
for(var i=0;i<elements.length;i++){eEl.set(i,mat.E);if(elements[i].length<=2){var ms=(self.emat&&self.emat[i])?self.emat[i]:mat;eA.set(i,ms.A);eIz.set(i,ms.Iz!==undefined?ms.Iz:ms.I);eIy.set(i,ms.Iy!==undefined?ms.Iy:ms.I);eG.set(i,ms.G);eJ.set(i,ms.J);}else{eTh.set(i,mat.t);ePo.set(i,mat.nu);ePf.set(i,mat.plate);}}
var flat=[];for(var i=0;i<nodes.length;i++){flat.push(nodes[i][0]);flat.push(nodes[i][1]);flat.push(nodes[i][2]);}
var nodesPtr=alloc(flat,Float64Array,mod.HEAPF64);var elementsPtr=alloc(elemIdx,Uint32Array,mod.HEAPU32);var elemSizesPtr=alloc(esz,Uint32Array,mod.HEAPU32);
var supKeys=Array.from(supdat.keys());var supKeysPtr=alloc(supKeys,Uint32Array,mod.HEAPU32);
var supVals=[];supdat.forEach(function(a){for(var j=0;j<6;j++)supVals.push(a[j]);});var supValsPtr=alloc(supVals,Uint8Array,mod.HEAPU8);
var ldKeys=Array.from(loaddat.keys());var ldKeysPtr=alloc(ldKeys,Uint32Array,mod.HEAPU32);
var ldVals=[];loaddat.forEach(function(a){for(var j=0;j<6;j++)ldVals.push(a[j]);});var ldValsPtr=alloc(ldVals,Float64Array,mod.HEAPF64);
var el=pmap(eEl),ar=pmap(eA),mz2=pmap(eIz),my2=pmap(eIy),sm=pmap(eG),to=pmap(eJ),th=pmap(eTh),po=pmap(ePo),pf=pmap(ePf);
var em=function(){return pmap(new Map());};var eo=em(),say=em(),saz=em(),dt=em(),ds=em();
var springsPtr=alloc([0],Float64Array,mod.HEAPF64);var dOut=mod._malloc(4),dSz=mod._malloc(4),rOut=mod._malloc(4),rSz=mod._malloc(4);
mod._deform(nodesPtr,nodes.length,elementsPtr,elemIdx.length,elemSizesPtr,elements.length,supKeysPtr,supValsPtr,supKeys.length,ldKeysPtr,ldValsPtr,ldKeys.length,el.k,el.v,el.s,ar.k,ar.v,ar.s,mz2.k,mz2.v,mz2.s,my2.k,my2.v,my2.s,sm.k,sm.v,sm.s,to.k,to.v,to.s,th.k,th.v,th.s,po.k,po.v,po.s,eo.k,eo.v,eo.s,say.k,say.v,say.s,saz.k,saz.v,saz.s,springsPtr,0,pf.k,pf.v,pf.s,dt.k,dt.v,dt.s,ds.k,ds.v,ds.s,dOut,dSz,rOut,rSz);
var dPtr=mod.HEAPU32[dOut/4],dN=mod.HEAPU32[dSz/4];var df=new Float64Array(mod.HEAPF64.buffer,dPtr,dN);
var U6=new Map();for(var i=0;i<dN;i+=7){U6.set(df[i],[df[i+1],df[i+2],df[i+3],df[i+4],df[i+5],df[i+6]]);}
/* SHELL stress recovery (igual que results) */
function q4stress(P,dxG,E,nu,t){var p0=P[0],p1=P[1],p2=P[2],p3=P[3];
var v01=[p1[0]-p0[0],p1[1]-p0[1],p1[2]-p0[2]],v32=[p2[0]-p3[0],p2[1]-p3[1],p2[2]-p3[2]];
var lxR=[v01[0]+v32[0],v01[1]+v32[1],v01[2]+v32[2]];var mLx=Math.hypot(lxR[0],lxR[1],lxR[2])||1;var lX=[lxR[0]/mLx,lxR[1]/mLx,lxR[2]/mLx];
var d02=[p2[0]-p0[0],p2[1]-p0[1],p2[2]-p0[2]],d13=[p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]];
var lzR=[d02[1]*d13[2]-d02[2]*d13[1],d02[2]*d13[0]-d02[0]*d13[2],d02[0]*d13[1]-d02[1]*d13[0]];var mLz=Math.hypot(lzR[0],lzR[1],lzR[2])||1;var lZ=[lzR[0]/mLz,lzR[1]/mLz,lzR[2]/mLz];
var lY=[lZ[1]*lX[2]-lZ[2]*lX[1],lZ[2]*lX[0]-lZ[0]*lX[2],lZ[0]*lX[1]-lZ[1]*lX[0]];var mLy=Math.hypot(lY[0],lY[1],lY[2])||1;lY=[lY[0]/mLy,lY[1]/mLy,lY[2]/mLy];
lX=[lY[1]*lZ[2]-lY[2]*lZ[1],lY[2]*lZ[0]-lY[0]*lZ[2],lY[0]*lZ[1]-lY[1]*lZ[0]];
var cx=0.25*(p0[0]+p1[0]+p2[0]+p3[0]),cy=0.25*(p0[1]+p1[1]+p2[1]+p3[1]),cz=0.25*(p0[2]+p1[2]+p2[2]+p3[2]);
var xl=[],yl=[];for(var n=0;n<4;n++){var dx=P[n][0]-cx,dy=P[n][1]-cy,dz=P[n][2]-cz;xl.push(dx*lX[0]+dy*lX[1]+dz*lX[2]);yl.push(dx*lY[0]+dy*lY[1]+dz*lY[2]);}
var R=[lX,lY,lZ];var uL=new Array(24).fill(0);
for(var n=0;n<4;n++){var gi=n*6;for(var r=0;r<3;r++)uL[n*6+r]=R[r][0]*dxG[gi]+R[r][1]*dxG[gi+1]+R[r][2]*dxG[gi+2];for(var r=0;r<3;r++)uL[n*6+3+r]=R[r][0]*dxG[gi+3]+R[r][1]*dxG[gi+4]+R[r][2]*dxG[gi+5];}
var Df=E/(1-nu*nu);var Dm=[[Df*t,Df*nu*t,0],[Df*nu*t,Df*t,0],[0,0,Df*(1-nu)/2*t]];var t3=t*t*t/12;var Db=[[Df*t3,Df*nu*t3,0],[Df*nu*t3,Df*t3,0],[0,0,Df*(1-nu)/2*t3]];
function ev(xi,eta){var dNx=[-0.25*(1-eta),0.25*(1-eta),0.25*(1+eta),-0.25*(1+eta)],dNe=[-0.25*(1-xi),-0.25*(1+xi),0.25*(1+xi),0.25*(1-xi)];
var J00=0,J01=0,J10=0,J11=0;for(var n=0;n<4;n++){J00+=dNx[n]*xl[n];J01+=dNx[n]*yl[n];J10+=dNe[n]*xl[n];J11+=dNe[n]*yl[n];}var dJ=J00*J11-J01*J10;if(Math.abs(dJ)<1e-20)return{Mx:0,My:0,Mxy:0,vm:0};
var i00=J11/dJ,i01=-J01/dJ,i10=-J10/dJ,i11=J00/dJ;var ax=[],ay=[];for(var n=0;n<4;n++){ax.push(i00*dNx[n]+i01*dNe[n]);ay.push(i10*dNx[n]+i11*dNe[n]);}
var eXX=0,eYY=0,gXY=0;for(var n=0;n<4;n++){var u=uL[n*6],v=uL[n*6+1];eXX+=ax[n]*u;eYY+=ay[n]*v;gXY+=ay[n]*u+ax[n]*v;}
var Nx=Dm[0][0]*eXX+Dm[0][1]*eYY,Ny=Dm[1][0]*eXX+Dm[1][1]*eYY,Nxy=Dm[2][2]*gXY;
var kXX=0,kYY=0,kXY=0;for(var n=0;n<4;n++){var tX=uL[n*6+3],tY=uL[n*6+4];kXX+=-ax[n]*tY;kYY+=ay[n]*tX;kXY+=ax[n]*tX-ay[n]*tY;}
var Mx=Db[0][0]*kXX+Db[0][1]*kYY,My=Db[1][0]*kXX+Db[1][1]*kYY,Mxy=Db[2][2]*kXY;
var sxxT=Nx/t+6*Mx/(t*t),syyT=Ny/t+6*My/(t*t),sxyT=Nxy/t+6*Mxy/(t*t);var sxxB=Nx/t-6*Mx/(t*t),syyB=Ny/t-6*My/(t*t),sxyB=Nxy/t-6*Mxy/(t*t);
var vmT=Math.sqrt(sxxT*sxxT-sxxT*syyT+syyT*syyT+3*sxyT*sxyT),vmB=Math.sqrt(sxxB*sxxB-sxxB*syyB+syyB*syyB+3*sxyB*sxyB);
return{Mx:Mx,My:My,Mxy:Mxy,vm:Math.max(vmT,vmB),Nx:Nx,Ny:Ny,Nxy:Nxy};}
var gp=1/Math.sqrt(3);var G4=[[-gp,-gp],[gp,-gp],[gp,gp],[-gp,gp]];var g=[ev(G4[0][0],G4[0][1]),ev(G4[1][0],G4[1][1]),ev(G4[2][0],G4[2][1]),ev(G4[3][0],G4[3][1])];
var s3=Math.sqrt(3);var A4=1+s3/2,B4=-0.5,C4=1-s3/2;var E4=[[A4,B4,C4,B4],[B4,A4,B4,C4],[C4,B4,A4,B4],[B4,C4,B4,A4]];
function exr(f,ni){var r=E4[ni];return r[0]*g[0][f]+r[1]*g[1][f]+r[2]*g[2][f]+r[3]*g[3][f];}
var nd=[];for(var ni=0;ni<4;ni++)nd.push({Mxx:exr("Mx",ni),Myy:exr("My",ni),Mxy:exr("Mxy",ni),vonMises:exr("vm",ni),Nx:exr("Nx",ni),Ny:exr("Ny",ni),Nxy:exr("Nxy",ni)});return nd;}
var SH={Mxx:new Map(),Myy:new Map(),Mxy:new Map(),vonMises:new Map(),Nx:new Map(),Ny:new Map(),Nxy:new Map()};var SHc=new Map();var shellNodes={};
for(var e=0;e<elements.length;e++){var el2=elements[e];if(!el2||el2.length<4)continue;var P=[nodes[el2[0]],nodes[el2[1]],nodes[el2[2]],nodes[el2[3]]];
var dxG=[];for(var n=0;n<4;n++){var u=U6.get(el2[n])||[0,0,0,0,0,0];for(var k=0;k<6;k++)dxG.push(u[k]);}
var nd=q4stress(P,dxG,mat.E,mat.nu,mat.t);
for(var n=0;n<4;n++){var gn=el2[n];shellNodes[gn]=1;["Mxx","Myy","Mxy","vonMises","Nx","Ny","Nxy"].forEach(function(f){SH[f].set(gn,(SH[f].get(gn)||0)+nd[n][f]);});SHc.set(gn,(SHc.get(gn)||0)+1);}}
Object.keys(shellNodes).forEach(function(gns){var gn=+gns;var c=SHc.get(gn)||1;["Mxx","Myy","Mxy","vonMises","Nx","Ny","Nxy"].forEach(function(f){SH[f].set(gn,SH[f].get(gn)/c);});});
/* reconstruir grilla regular de la losa (xs, ys ordenados) */
/* autodetectar el plano del elemento: ejes con mayor rango (el tercero es la normal) */
var mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];Object.keys(shellNodes).forEach(function(gns){var n=nodes[+gns];for(var k=0;k<3;k++){if(n[k]<mn[k])mn[k]=n[k];if(n[k]>mx[k])mx[k]=n[k];}});
var rg=[mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2]];var nrm=0;if(rg[1]<rg[nrm])nrm=1;if(rg[2]<rg[nrm])nrm=2;
var A1,A2;if(nrm==0){A1=1;A2=2;}else if(nrm==1){A1=0;A2=2;}else{A1=0;A2=1;}
var AX=["X","Y","Z"];
var xset={},yset={};Object.keys(shellNodes).forEach(function(gns){var n=nodes[+gns];xset[n[A1].toFixed(5)]=n[A1];yset[n[A2].toFixed(5)]=n[A2];});
var xs=Object.keys(xset).map(function(k){return xset[k];}).sort(function(a,b){return a-b;});
var ys=Object.keys(yset).map(function(k){return yset[k];}).sort(function(a,b){return a-b;});
var nx=xs.length,ny=ys.length;var gmap={};Object.keys(shellNodes).forEach(function(gns){var n=nodes[+gns];gmap[n[A1].toFixed(3)+"_"+n[A2].toFixed(3)]=+gns;});
function nodeAt(i,j){return gmap[xs[i].toFixed(3)+"_"+ys[j].toFixed(3)];}
var META2={uz:[" mm",1000],ux:[" mm",1000],uy:[" mm",1000],rx:[" mrad",1000],ry:[" mrad",1000],rz:[" mrad",1000],vonMises:[" MPa",1e-6],Mxx:[" kNm/m",1e-3],Myy:[" kNm/m",1e-3],Mxy:[" kNm/m",1e-3],Nx:[" kN/m",1e-3],Ny:[" kN/m",1e-3],Nxy:[" kN/m",1e-3]};
function fval(i,j,T){var gn=nodeAt(i,j);if(gn===undefined)return 0;var u=U6.get(gn)||[0,0,0,0,0,0];if(T=="uz")return u[2];if(T=="ux")return u[0];if(T=="uy")return u[1];if(T=="rx")return u[3];if(T=="ry")return u[4];if(T=="rz")return u[5];return SH[T]?(SH[T].get(gn)||0):0;}
function jet(t){t=Math.max(0,Math.min(1,t));var r=Math.max(0,Math.min(1,Math.min(4*t-1.5,-4*t+4.5))),gg=Math.max(0,Math.min(1,Math.min(4*t-0.5,-4*t+3.5))),b=Math.max(0,Math.min(1,Math.min(4*t+0.5,-4*t+2.5)));return [r*255|0,gg*255|0,b*255|0];}
var xmin=xs[0],xmax=xs[nx-1],ymin=ys[0],ymax=ys[ny-1];
var W=560,H=470,ml=42,mr=78,mt=34,mb=34,pw=W-ml-mr,ph=H-mt-mb;
function SX(x){return ml+(x-xmin)/(xmax-xmin)*pw;}function SY(y){return mt+(ymax-y)/(ymax-ymin)*ph;}
function wX(px){return xmin+(px-ml)/pw*(xmax-xmin);}function wY(py){return ymax-(py-mt)/ph*(ymax-ymin);}
function bilin(x,y,T){if(x<xmin||x>xmax||y<ymin||y>ymax)return null;var i=0;while(i<nx-2&&xs[i+1]<x)i++;var j=0;while(j<ny-2&&ys[j+1]<y)j++;var u=(x-xs[i])/(xs[i+1]-xs[i]),v=(y-ys[j])/(ys[j+1]-ys[j]);return fval(i,j,T)*(1-u)*(1-v)+fval(i+1,j,T)*u*(1-v)+fval(i,j+1,T)*(1-u)*v+fval(i+1,j+1,T)*u*v;}
var div=document.getElementById("__ID__");div.innerHTML=``;
var sel=document.createElement("select");sel.style.cssText="font-family:Consolas,monospace;font-size:13px;margin-bottom:3px";
[["ux","ux — desplaz. en X"],["uz","uz — desplaz. en Z"],["uy","uy — desplaz. en Y"],["ry","θy — rotacion (drilling XZ)"],["rz","θz — rotacion (drilling XY)"],["rx","θx — rotacion"],["vonMises","von Mises"],["Nx","Nx — axil membrana"],["Ny","Ny — axil membrana"],["Nxy","Nxy — cortante membrana"],["Mxx","Mxx — momento"],["Myy","Myy — momento"],["Mxy","Mxy — momento torsor"]].forEach(function(o){var op=document.createElement("option");op.value=o[0];op.text=o[1];sel.appendChild(op);});
var hd=document.createElement("div");hd.style.cssText="font-family:Consolas,monospace;font-size:12px;color:#333;margin:2px 0 4px 0";
var wrap=document.createElement("div");wrap.style.cssText="position:relative;width:"+W+"px;height:"+H+"px";
var base=document.createElement("canvas");base.width=W;base.height=H;base.style.cssText="position:absolute;left:0;top:0;border:1px solid #ddd;background:#fff";
var over=document.createElement("canvas");over.width=W;over.height=H;over.style.cssText="position:absolute;left:0;top:0;pointer-events:none";
wrap.appendChild(base);wrap.appendChild(over);
div.appendChild(sel);div.appendChild(hd);div.appendChild(wrap);
var ctx=base.getContext("2d"),octx=over.getContext("2d");
var tip=document.createElement("div");tip.style.cssText="position:fixed;pointer-events:none;background:rgba(20,20,28,0.92);color:#fff;font:12px Consolas,monospace;padding:3px 8px;border-radius:4px;display:none;z-index:99999";document.body.appendChild(tip);
var curT="vonMises",curMin=0,curMax=1;
function draw2D(T){curT=T;var f=META2[T][1],u=META2[T][0];
var vmin=1e30,vmax=-1e30;for(var i=0;i<nx;i++)for(var j=0;j<ny;j++){var v=fval(i,j,T);if(v<vmin)vmin=v;if(v>vmax)vmax=v;}if(vmax-vmin<1e-12)vmax=vmin+1;curMin=vmin;curMax=vmax;
ctx.clearRect(0,0,W,H);var img=ctx.createImageData(pw,ph);var dd=img.data;
for(var py=0;py<ph;py++)for(var px=0;px<pw;px++){var x=wX(ml+px),y=wY(mt+py);var v=bilin(x,y,T);var idx=(py*pw+px)*4;if(v==null){dd[idx+3]=0;}else{var c=jet((v-vmin)/(vmax-vmin));dd[idx]=c[0];dd[idx+1]=c[1];dd[idx+2]=c[2];dd[idx+3]=255;}}
ctx.putImageData(img,ml,mt);
/* malla de elementos (grilla xs/ys) sobre el contorno */
ctx.strokeStyle="rgba(40,40,40,0.30)";ctx.lineWidth=0.5;
for(var gi=0;gi<nx;gi++){var Xg=SX(xs[gi]);ctx.beginPath();ctx.moveTo(Xg,mt);ctx.lineTo(Xg,mt+ph);ctx.stroke();}
for(var gj=0;gj<ny;gj++){var Yg=SY(ys[gj]);ctx.beginPath();ctx.moveTo(ml,Yg);ctx.lineTo(ml+pw,Yg);ctx.stroke();}
ctx.strokeStyle="#888";ctx.lineWidth=0.7;ctx.strokeRect(ml,mt,pw,ph);
/* lineas de contorno (marching squares) + valores */
var NL=9;ctx.lineWidth=1;ctx.font="10px Consolas";
for(var L=1;L<NL;L++){var lev=vmin+(vmax-vmin)*L/NL;ctx.strokeStyle="rgba(0,0,0,0.45)";var lbpt=null;
for(var i=0;i<nx-1;i++)for(var j=0;j<ny-1;j++){var fc=[fval(i,j,T),fval(i+1,j,T),fval(i+1,j+1,T),fval(i,j+1,T)];var cxp=[xs[i],xs[i+1],xs[i+1],xs[i]],cyp=[ys[j],ys[j],ys[j+1],ys[j+1]];var pts=[];for(var e2=0;e2<4;e2++){var a=fc[e2],b=fc[(e2+1)%4];if((a<lev)!=(b<lev)){var tt=(lev-a)/(b-a);pts.push([cxp[e2]+(cxp[(e2+1)%4]-cxp[e2])*tt,cyp[e2]+(cyp[(e2+1)%4]-cyp[e2])*tt]);}}
if(pts.length>=2){ctx.beginPath();ctx.moveTo(SX(pts[0][0]),SY(pts[0][1]));ctx.lineTo(SX(pts[1][0]),SY(pts[1][1]));ctx.stroke();if(!lbpt)lbpt=[(pts[0][0]+pts[1][0])/2,(pts[0][1]+pts[1][1])/2];}}
if(lbpt){ctx.fillStyle="#222";ctx.fillText((lev*f).toFixed(1),SX(lbpt[0])+2,SY(lbpt[1])-2);}}
/* etiquetas max/min/cero */
var imax=null,imin=null,izero=null,vz=1e30;for(var i=0;i<nx;i++)for(var j=0;j<ny;j++){var v=fval(i,j,T);if(imax==null||v>fval(imax[0],imax[1],T))imax=[i,j];if(imin==null||v<fval(imin[0],imin[1],T))imin=[i,j];if(Math.abs(v)<vz){vz=Math.abs(v);izero=[i,j];}}
function mark(ij,col,txt){if(!ij)return;var X=SX(xs[ij[0]]),Y=SY(ys[ij[1]]);ctx.fillStyle=col;ctx.beginPath();ctx.arc(X,Y,3.5,0,6.283);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(X+4,Y-12,txt.length*6.2+4,13);ctx.fillStyle=col;ctx.font="bold 11px Consolas";ctx.fillText(txt,X+6,Y-2);}
mark(imax,"#c81e1e",(vmax*f).toFixed(2));mark(imin,"#1e46c8",(vmin*f).toFixed(2));if(vmin<0&&vmax>0)mark(izero,"#1a7d1a","0");
/* colorbar */
var cbx=W-mr+24,cbw=14,cbh=ph;for(var k=0;k<cbh;k++){var c=jet(1-k/cbh);ctx.fillStyle="rgb("+c[0]+","+c[1]+","+c[2]+")";ctx.fillRect(cbx,mt+k,cbw,1);}
ctx.strokeStyle="#555";ctx.strokeRect(cbx,mt,cbw,cbh);ctx.fillStyle="#333";ctx.font="10px Consolas";ctx.fillText((vmax*f).toFixed(1),cbx-2,mt-3);ctx.fillText((vmin*f).toFixed(1),cbx-2,mt+cbh+10);ctx.fillText(u.trim(),cbx-6,mt+cbh+22);
hd.innerHTML="2D (plano "+AX[A1]+"-"+AX[A2]+") — "+T+": max="+(vmax*f).toFixed(2)+u+", min="+(vmin*f).toFixed(2)+u+"  (pasa el cursor para ver el valor)";}
sel.onchange=function(){draw2D(sel.value);};
base.addEventListener("mousemove",function(ev){var rect=base.getBoundingClientRect();var px=ev.clientX-rect.left,py=ev.clientY-rect.top;var x=wX(px),y=wY(py);var v=(px>=ml&&px<=ml+pw&&py>=mt&&py<=mt+ph)?bilin(x,y,curT):null;
octx.clearRect(0,0,W,H);if(v==null){tip.style.display="none";return;}
octx.strokeStyle="rgba(0,0,0,0.6)";octx.lineWidth=1;octx.beginPath();octx.moveTo(px,mt);octx.lineTo(px,mt+ph);octx.moveTo(ml,py);octx.lineTo(ml+pw,py);octx.stroke();octx.fillStyle="#000";octx.beginPath();octx.arc(px,py,3,0,6.283);octx.fill();
var f=META2[curT][1],u=META2[curT][0];tip.style.display="block";tip.style.left=(ev.clientX+13)+"px";tip.style.top=(ev.clientY+8)+"px";tip.innerHTML=curT+" = "+(v*f).toFixed(2)+u+"  @("+AX[A1]+"="+x.toFixed(2)+", "+AX[A2]+"="+y.toFixed(2)+")";});
base.addEventListener("mouseleave",function(){octx.clearRect(0,0,W,H);tip.style.display="none";});
draw2D("vonMises");
}catch(e){document.getElementById("__ID__").innerText=`Error Hekatan 2D: `+e+` | `+(e.stack||``);}})();'''

JS_BEGIN = JS_BEGIN.replace("\n", "").replace("__GLUE__", '"' + gz_glue + '"').replace("__WASM__", '"' + gz_wasm + '"')
JS_END = JS_END.replace("\n", "")
JS_END3D = JS_END3D.replace("\n", "")
JS_END3D_PLOTLY = JS_END3D_PLOTLY.replace("\n", "")
JS_END3D_FORCES = JS_END3D_FORCES.replace("\n", "")
JS_END3D_RESULTS = JS_END3D_RESULTS.replace("\n", "")
JS_END2D = JS_END2D.replace("\n", "")

# hk_plate_ss: genera malla NxN de shells, SS, carga uniforme q, y la teoria Kirchhoff
PLATE = ("(function(){var a=A$,N=N$,Ee=E$,nuu=NU$,t_=T$,q=Q$;"
         "mat={E:Ee,A:0.01,I:1e-5,G:Ee/(2*(1+nuu)),J:2e-5,nu:nuu,t:t_,plate:1};gridN=N;"
         "var hh=a/N;"
         "for(var j=0;j<=N;j++)for(var i=0;i<=N;i++)nodes[j*(N+1)+i]=[i*hh,j*hh,0];"
         "for(var j=0;j<N;j++)for(var i=0;i<N;i++){var e=elements.length;elements[e]=[j*(N+1)+i,j*(N+1)+i+1,(j+1)*(N+1)+i+1,(j+1)*(N+1)+i];}"
         "for(var j=0;j<=N;j++)for(var i=0;i<=N;i++){var n=j*(N+1)+i;var bnd=(i==0||i==N||j==0||j==N);supdat.set(n,[1,1,bnd?1:0,0,0,1]);}"
         "for(var j=0;j<=N;j++)for(var i=0;i<=N;i++){var n=j*(N+1)+i;var fx=((i==0||i==N)?0.5:1)*((j==0||j==N)?0.5:1);loaddat.set(n,[0,0,-q*hh*hh*fx,0,0,0]);}"
         "var D=Ee*Math.pow(t_,3)/(12*(1-nuu*nuu));wTheory=0.00406*q*Math.pow(a,4)/D;})();")

# hk_mesa: mesa a torsion (losa nMxnM shells a altura H sobre 4 columnas + vigas perimetrales)
# secciones por-elemento: columnas (bc x hc) y vigas (bv x hv) via self.emat; losa = mat.t
MESA = ("(function(){var Lx=LX$,Ly=LY$,H=H$,nM=NM$,Ee=E$,nuu=NU$,tl=TL$,bc=BC$,hc=HC$,bv=BV$,hv=HV$,q=Q$;"
        "var dx=Lx/nM,dy=Ly/nM,Gc=Ee/(2*(1+nuu));"
        "function jt(a,b){var lo=Math.min(a,b),hi=Math.max(a,b),k=lo/hi;var be=0.3333-0.21*k*(1-Math.pow(k,4)/12);return be*hi*Math.pow(lo,3);}"
        "mat={E:Ee,nu:nuu,t:tl,plate:1,A:bc*hc,I:bc*Math.pow(hc,3)/12,G:Gc,J:jt(bc,hc)};"
        "var colS={A:bc*hc,Iz:bc*Math.pow(hc,3)/12,Iy:hc*Math.pow(bc,3)/12,I:bc*Math.pow(hc,3)/12,G:Gc,J:jt(bc,hc)};"
        "var vigS={A:bv*hv,Iz:hv*Math.pow(bv,3)/12,Iy:bv*Math.pow(hv,3)/12,I:bv*Math.pow(hv,3)/12,G:Gc,J:jt(bv,hv)};"
        "self.emat={};"
        "nodes[0]=[0,0,0];nodes[1]=[Lx,0,0];nodes[2]=[Lx,Ly,0];nodes[3]=[0,Ly,0];var NB=4;"
        "for(var j=0;j<=nM;j++)for(var i=0;i<=nM;i++)nodes[NB+j*(nM+1)+i]=[i*dx,j*dy,H];"
        "function ix(i,j){return NB+j*(nM+1)+i;}var e=0;"
        "for(var j=0;j<nM;j++)for(var i=0;i<nM;i++){elements[e++]=[ix(i,j),ix(i+1,j),ix(i+1,j+1),ix(i,j+1)];}"
        "elements[e]=[0,ix(0,0)];self.emat[e++]=colS;elements[e]=[1,ix(nM,0)];self.emat[e++]=colS;elements[e]=[2,ix(nM,nM)];self.emat[e++]=colS;elements[e]=[3,ix(0,nM)];self.emat[e++]=colS;"
        "for(var i=0;i<nM;i++){elements[e]=[ix(i,0),ix(i+1,0)];self.emat[e++]=vigS;}"
        "for(var j=0;j<nM;j++){elements[e]=[ix(nM,j),ix(nM,j+1)];self.emat[e++]=vigS;}"
        "for(var i=0;i<nM;i++){elements[e]=[ix(i,nM),ix(i+1,nM)];self.emat[e++]=vigS;}"
        "for(var j=0;j<nM;j++){elements[e]=[ix(0,j),ix(0,j+1)];self.emat[e++]=vigS;}"
        "for(var n=0;n<4;n++)supdat.set(n,[1,1,1,1,1,1]);"
        "for(var j=0;j<=nM;j++)for(var i=0;i<=nM;i++){var n=ix(i,j);var fx=((i==0||i==nM)?0.5:1)*((j==0||j==nM)?0.5:1);loaddat.set(n,[0,0,-q*dx*dy*fx,0,0,0]);}"
        "})();")

# hk_panel: panel/muro de membrana Q4 en el plano XY (z=0). Base (y=0) empotrada,
# carga lateral P en X repartida en el borde superior (y=H). Activa drilling DOF (theta_z).
PANEL = ("(function(){var Wp=WW$,Hp=HH$,nx=NX$,ny=NY$,Ee=E$,nuu=NU$,tt=T$,P=P$;"
         "var dx=Wp/nx,dz=Hp/ny;"
         "mat={E:Ee,nu:nuu,t:tt,plate:1,A:0.01,I:1e-5,G:Ee/(2*(1+nuu)),J:2e-5};"
         "for(var j=0;j<=ny;j++)for(var i=0;i<=nx;i++)nodes[j*(nx+1)+i]=[i*dx,0,j*dz];"
         "for(var j=0;j<ny;j++)for(var i=0;i<nx;i++){var e=elements.length;elements[e]=[j*(nx+1)+i,j*(nx+1)+i+1,(j+1)*(nx+1)+i+1,(j+1)*(nx+1)+i];}"
         "for(var i=0;i<=nx;i++)supdat.set(i,[1,1,1,1,1,1]);"
         "for(var i=0;i<=nx;i++){var n=ny*(nx+1)+i;var fx=(i==0||i==nx)?0.5:1;loaddat.set(n,[P/nx*fx,0,0,0,0,0]);}"
         "})();")

# hk_cantilever: voladizo de MEMBRANA en el plano XZ (x=largo, z=alto, y=0).
# Empotrado en el borde x=0; carga de corte P (en -Z) repartida en el borde libre x=L.
# Bending en el plano -> drilling = ry (rotacion sobre la normal Y).
CANTI = ("(function(){var L=LL$,hh=HH$,nx=NX$,ny=NY$,Ee=E$,nuu=NU$,tt=T$,P=P$;"
         "var dx=L/nx,dz=hh/ny;"
         "mat={E:Ee,nu:nuu,t:tt,plate:1,A:0.01,I:1e-5,G:Ee/(2*(1+nuu)),J:2e-5};"
         "for(var j=0;j<=ny;j++)for(var i=0;i<=nx;i++)nodes[j*(nx+1)+i]=[i*dx,0,j*dz];"
         "for(var j=0;j<ny;j++)for(var i=0;i<nx;i++){var e=elements.length;elements[e]=[j*(nx+1)+i,j*(nx+1)+i+1,(j+1)*(nx+1)+i+1,(j+1)*(nx+1)+i];}"
         "for(var j=0;j<=ny;j++)supdat.set(j*(nx+1),[1,1,1,1,1,1]);"
         "for(var j=0;j<=ny;j++){var n=j*(nx+1)+nx;var fz=(j==0||j==ny)?0.5:1;loaddat.set(n,[0,0,-P/ny*fz,0,0,0]);}"
         "})();")

cpd = (
'#hide\n'
'"Hekatan Struct — MOTOR FEM (deform.wasm) embebido. Modelos: frames (hk_node/hk_elem) y shells (hk_shell/hk_plate_ss).\n'
'"Patron: val ... equ:  hekatan_begin(id)  ...modelo...  hekatan_end(id)\n'
"#def hekatan_begin$(id$) = '<div id=\"id$\" style=\"padding:10px\">Cargando motor FEM de Hekatan...</div><script>" + JS_BEGIN.replace("__ID__", "id$") + "\n"
'"--- frames ---\n'
"#def hk_material$(E$; A$; I$; G$; Jt$) = 'mat.E=E$;mat.A=A$;mat.I=I$;mat.G=G$;mat.J=Jt$;\n"
"#def hk_node$(i$; x$; y$; z$) = 'nodes[i$] = [x$, y$, z$];\n"
"#def hk_elem$(i$; n1$; n2$) = 'elements[i$] = [n1$, n2$];\n"
"#def hk_support$(n$) = 'supdat.set(n$, [1, 1, 1, 1, 1, 1]);\n"
"#def hk_load$(n$; fx$; fy$; fz$) = 'loaddat.set(n$, [fx$, fy$, fz$, 0, 0, 0]);\n"
'"--- shells ---  hk_plate_material(E, nu, t, plate[0=Mindlin,1=Kirchhoff]); hk_shell(i, n1..n4)\n'
"#def hk_plate_material$(E$; nu$; t$; plate$) = 'mat.E=E$;mat.nu=nu$;mat.t=t$;mat.plate=plate$;\n"
"#def hk_shell$(i$; n1$; n2$; n3$; n4$) = 'elements[i$] = [n1$, n2$, n3$, n4$];\n"
'"--- benchmark: placa cuadrada lado a, malla NxN, E, nu, espesor t, carga q (N/m2), simplemente apoyada ---\n'
"#def hk_plate_ss$(A$; N$; E$; NU$; T$; Q$) = '" + PLATE + "\n"
'"--- mesa a torsion: losa nMxnM a altura H sobre 4 columnas + vigas perimetrales ---\n'
'"  hk_mesa(Lx[m]; Ly[m]; H[m]; nMesh; E[Pa]; nu; tLosa[m]; bCol[m]; hCol[m]; bViga[m]; hViga[m]; q[N/m2])\n'
'"  Lx,Ly=dim losa | H=altura columnas | nMesh=NxN shells | E,nu=material | tLosa=espesor\n'
'"  bCol x hCol=seccion columna | bViga x hViga=seccion viga | q=carga vertical sobre losa\n'
"#def hk_mesa$(LX$; LY$; H$; NM$; E$; NU$; TL$; BC$; HC$; BV$; HV$; Q$) = '" + MESA + "\n"
'"--- panel/muro de membrana Q4 (drilling DOF theta_z): hk_panel(W; H; nx; ny; E[Pa]; nu; t; P[N]) ---\n'
"#def hk_panel$(WW$; HH$; NX$; NY$; E$; NU$; T$; P$) = '" + PANEL + "\n"
'"--- voladizo de membrana XZ (drilling = ry): hk_cantilever(L; h; nx; ny; E[Pa]; nu; t; P[N]) ---\n'
"#def hk_cantilever$(LL$; HH$; NX$; NY$; E$; NU$; T$; P$) = '" + CANTI + "\n"
'"end: resuelve con el solver real y dibuja (contorno si hay shells, deformada si frames)\n'
"#def hekatan_end$(id$) = '" + JS_END.replace("__ID__", "id$") + "</script>\n"
'"end3d: resuelve y muestra el modelo en 3D orbitable (Three.js, estilo awatif)\n'
"#def hekatan_end3d$(id$) = '" + JS_END3D.replace("__ID__", "id$") + "</script>\n"
'"end3d_plotly: resuelve y muestra mesh3d en Plotly (barra de color + hover con valores)\n'
"#def hekatan_end3d_plotly$(id$) = '" + JS_END3D_PLOTLY.replace("__ID__", "id$") + "</script>\n"
'"end3d_forces: resuelve y muestra diagramas de fuerzas internas (N,Vy,Vz,T,My,Mz) de frames + tabla\n'
"#def hekatan_end3d_forces$(id$) = '" + JS_END3D_FORCES.replace("__ID__", "id$") + "</script>\n"
'"end3d_results: viewer COMPLETO Hekatan Struct — shell results (Mxx/Myy/Mxy/vonMises/uz) + frame results, con valores max/min/cero\n'
"#def hekatan_end3d_results$(id$) = '" + JS_END3D_RESULTS.replace("__ID__", "id$") + "</script>\n"
'"end2d: viewer 2D en canvas puro (sin CDN) — planta de la losa con contornos + colorbar + hover bilineal con crosshair\n'
"#def hekatan_end2d$(id$) = '" + JS_END2D.replace("__ID__", "id$") + "</script>\n"
'#show\n'
)

OUT = "C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/calcpad-draw/hekatan_lib.cpd"
open(OUT, "w", encoding="utf-8").write(cpd)
print("OK ->", OUT, " tam:", os.path.getsize(OUT), "bytes")
