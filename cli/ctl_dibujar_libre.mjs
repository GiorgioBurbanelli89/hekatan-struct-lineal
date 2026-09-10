/**
 * DIBUJAR LIBRE: el punto cae DONDE ESTÁ EL CURSOR.
 *
 * Dos cosas lo impedían, las dos medidas el 9-sep-2026 dibujando con el ratón en
 * sitios cualesquiera (no elegidos para caer en la rejilla):
 *
 *  1. El enganche a la REJILLA venía encendido con paso 0.5 m, así que cada punto
 *     saltaba al múltiplo más próximo: (-0.38, 0.01) acababa en (-0.50, 0.00), un
 *     desvío medio de 0.142 m. Es la «grilla imaginaria» que se veía, y por eso
 *     parecía que el ORTO no funcionaba. Ahora viene APAGADO (F9 lo enciende).
 *  2. La MIRILLA de las referencias estaba en METROS FIJOS (0.6 m). Acercado, eso
 *     es media pantalla: el 3.er punto caía encima del 2.º y el 5.º encima del 1.º.
 *     Ahora es una mirilla en PÍXELES (10, el aperture de AutoCAD), que vale igual
 *     a cualquier zoom.
 *
 * La prueba dibuja a mano alzada y exige que cada punto quede a menos de 1 cm de
 * donde estaba el cursor.
 *
 *   node cli/ctl_dibujar_libre.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { join, extname } from "path";
const CON_REJILLA = process.argv.includes("rejilla");
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
const BASE = "/hekatan-struct-lineal/";
const raiz = join(process.cwd(), "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req,res)=>{let p=decodeURIComponent((req.url||"/").split("?")[0]);if(p.startsWith(BASE))p=p.slice(BASE.length-1);let f=join(raiz,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,"index.html");if(!existsSync(f)){res.writeHead(404);return res.end("404");}res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});res.end(readFileSync(f));});
await new Promise(r=>srv.listen(4759,r));
const nav = await puppeteer.launch({headless:"new",args:["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"]});
const pag = await nav.newPage(); await pag.setViewport({width:1280,height:720});
const esperar=(ms)=>new Promise(r=>setTimeout(r,ms));
await pag.goto(`http://localhost:4759${BASE}workspace/?t=new-blank`,{waitUntil:"networkidle2",timeout:180000});
await esperar(6000);
await pag.evaluate(()=>document.getElementById("hk-ribbon-guia")?.remove());
await pag.evaluate((on)=>{ window.__hekatanSnapEnabled = on; }, CON_REJILLA);
console.log("enganche a la rejilla:", await pag.evaluate(()=>window.__hekatanSnapEnabled !== false ? "ENCENDIDO" : "apagado"),
            "· paso", await pag.evaluate(()=>window.__hekatanSnap2D));
// planta, centrada, con zoom conocido
await pag.evaluate(()=>[...document.querySelectorAll("#hk-ribbon button")].find(b=>(b.textContent||"").includes("Planta"))?.click());
await esperar(900);
await pag.evaluate(()=>{const v=document.querySelector("#viewer"),c=v.__ctx.camera;
  v.__ctx.controls.target.set(0,0,0); c.position.set(0,0,50);
  if(c.isOrthographicCamera){c.zoom=9;c.updateProjectionMatrix();}
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();});
await esperar(700);
const cmd=async(t)=>{await pag.evaluate(()=>{const i=document.getElementById("hk3-cmd-input");if(i)i.value="";});await pag.focus("#hk3-cmd-input");await pag.type("#hk3-cmd-input",t,{delay:10});await pag.keyboard.press("Enter");await esperar(400);};
await cmd("pl");
// puntos a mano alzada: pixeles cualesquiera, no elegidos para caer en la rejilla
// ⚠️ nada por encima de y=300: el ribbon tapa el centro-arriba del lienzo y el
// clic se lo lleva el BOTÓN, no el dibujo (ya pasó en el vídeo del modelo nuevo)
const PIX = [[437,352],[812,391],[901,548],[566,612],[389,486]];
let mov = 0, n = 0, peor = 0;
// ⚠️ Aquí se mide el trazo LIBRE, así que se apagan las dos ayudas que MUEVEN el
// punto a propósito, igual que haría cualquiera en AutoCAD para dibujar a mano
// alzada (el enganche a la rejilla, F9, ya viene apagado):
//   · OSNAP (F3): un clic a menos de 10 px de un nudo o del origen engancha.
//   · POLAR (F10): a menos de 6° de un eje, endereza el trazo — vale hasta 7 cm a
//     esta escala, y desde que el clic confirma lo que enseña el cursor, se NOTA.
await pag.evaluate(() => { window.__hekatanOsnapOn = false; window.__hekatanPolarTrack = false; });
await esperar(300);
for (const [px,py] of PIX) {
  await pag.mouse.move(px, py, {steps: 8}); await esperar(420);
  const antes = await pag.evaluate(()=>{
    const sm = window.__hekatanSnapMarker;
    return sm?.visible ? [sm.position.x, sm.position.y, sm.position.z] : null;
  });
  // el punto CRUDO bajo el cursor, sin enganche: se pide al mismo raycaster
  const crudo = await pag.evaluate(([x,y])=>{
    const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
    const r = cv.getBoundingClientRect(), cam = v.__ctx.camera;
    const T = window.__hekatanTHREE || null;
    const nx = ((x - r.left) / r.width) * 2 - 1, ny = -(((y - r.top) / r.height) * 2 - 1);
    // en planta la camara mira -Z: el punto crudo del plano Z=0 sale del frustum
    const o = cam;
    const halfH = (o.top - o.bottom) / 2 / o.zoom, halfW = (o.right - o.left) / 2 / o.zoom;
    return [o.position.x + nx * halfW, o.position.y + ny * halfH, 0];
  }, [px,py]);
  const tapado = await pag.evaluate(([x,y])=>{ const e=document.elementFromPoint(x,y); return e ? e.tagName !== "CANVAS" : true; }, [px,py]);
  if (tapado) { console.log(`  (${px},${py}) cae bajo un panel: se salta`); continue; }
  await pag.mouse.click(px, py); await esperar(380);
  const puestos = await pag.evaluate(()=>(window.__hekatanDrawingPoints?.val||[]).map(q=>q.map(c=>+c.toFixed(3))));
  const p = puestos[puestos.length-1];
  if (!p) { console.log(`  (${px},${py}) no coloco punto`); continue; }
  const d = Math.hypot(p[0]-crudo[0], p[1]-crudo[1]);
  mov += d; n++; peor = Math.max(peor, d);
  console.log(`  cursor (${crudo[0].toFixed(2)}, ${crudo[1].toFixed(2)})  →  punto (${p[0]}, ${p[1]})   se movio ${d.toFixed(3)} m`);
}
await pag.keyboard.press("Escape");
console.log("");
ok(n >= 4, "se colocan los puntos a mano alzada", `${n} de ${PIX.length} (uno cae bajo un panel)`);
ok(peor < 0.01, "cada punto cae DONDE está el cursor (menos de 1 cm)",
   `media ${(mov / n).toFixed(4)} m · peor ${peor.toFixed(4)} m`);
ok(await pag.evaluate(() => window.__hekatanSnapEnabled === false),
   "el enganche a la rejilla viene APAGADO, como el SNAP de AutoCAD");
// ── UN SOLO CURSOR ─────────────────────────────────────────────────────────
// El resaltador de nudos de la rejilla (anillo ambar) dice «el clic caeria
// EXACTAMENTE aqui». Con el enganche apagado eso es mentira: el punto cae bajo el
// cursor y el anillo se quedaba en la interseccion de 0.5 m mas cercana. Se veian
// DOS cursores a 10 px uno del otro.
await pag.evaluate(() => { window.__hekatanOsnapOn = true; window.__hekatanPolarTrack = true; });
const anillos = async () => pag.evaluate(() => {
  const v = document.querySelector("#viewer");
  const out = [];
  v.__ctx.scene.traverse((o) => {
    if (!o.visible || o.type !== "Group") return;
    const hijos = o.children || [];
    const esAnillo = hijos.some((c) => c.geometry?.type === "RingGeometry"
      && c.material?.color?.getHexString?.() === "ffc400");
    if (esAnillo) out.push([+o.position.x.toFixed(3), +o.position.y.toFixed(3), +o.position.z.toFixed(3)]);
  });
  return out;
});
const cvr = await pag.evaluate(() => {
  const r = document.querySelector("#viewer").querySelector("canvas").getBoundingClientRect();
  return { x: r.left + r.width * 0.42, y: r.top + r.height * 0.66 };
});
await pag.mouse.move(cvr.x, cvr.y, { steps: 8 }); await esperar(500);
const conSnapOff = await anillos();
ok(conSnapOff.length === 0, "con el enganche APAGADO hay UN solo cursor",
   conSnapOff.length ? `un anillo suelto en ${JSON.stringify(conSnapOff[0])}` : "sin anillo de rejilla");
await pag.evaluate(() => window.__hekatanToggleSnap?.());
await pag.mouse.move(cvr.x + 3, cvr.y - 2, { steps: 4 }); await esperar(500);
const conSnapOn = await anillos();
ok(conSnapOn.length === 1, "y con el enganche ENCENDIDO vuelve, que para eso está",
   JSON.stringify(conSnapOn[0] ?? null));
await pag.evaluate(() => window.__hekatanToggleSnap?.());

const ap = await pag.evaluate(() => window.__hekatanAperturaPx?.());
ok(ap >= 4 && ap <= 20, "la mirilla de referencias va en PÍXELES, no en metros fijos", `${ap} px`);
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
