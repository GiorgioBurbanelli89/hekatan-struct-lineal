// Graba FOTOGRAMAS de lo que se hace en el DEPLOY PÚBLICO (no en local).
//
//   node cli/grabar_publico.mjs [guion] [salida] [url]
//
// Abre la página pública con `?cursor=1` (el cursor auxiliar dibujado, porque el
// del sistema no sale en las capturas), ejecuta el guion pedido moviendo el
// cursor de verdad, y va guardando f000.png, f001.png… Al final arma el GIF.
//
// Guiones: `klocal` (tocar una barra → botón → ventana de la K 12×12).
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const GUION = process.argv[2] || "klocal";
const OUT = process.argv[3] || `cli/shots/publico/${GUION}`;
const URL0 = process.argv[4] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plantillas";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const url = URL0 + (URL0.includes("?") ? "&" : "?") + "cursor=1";

const nav = await puppeteer.launch({
  headless: "new", executablePath: EDGE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});
const pag = await nav.newPage();
await pag.setViewport({ width: 1600, height: 900 });
const errores = [];
pag.on("pageerror", (e) => errores.push(String(e).slice(0, 160)));

let n = 0;
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
async function foto(k = 1) {
  for (let i = 0; i < k; i++) {
    await pag.screenshot({ path: path.join(OUT, `f${String(n).padStart(3, "0")}.png`) });
    n++;
  }
}
/** Mueve el cursor DIBUJADO y el de puppeteer a la vez, dejando fotogramas. */
async function irA(x, y, pasos = 6) {
  const p = await pag.evaluate(() => {
    const c = document.getElementById("hk-cursor-aux");
    const m = /translate\(([\d.-]+)px,\s*([\d.-]+)px\)/.exec(c?.style.transform || "");
    return m ? [parseFloat(m[1]), parseFloat(m[2])] : [800, 450];
  });
  for (let i = 1; i <= pasos; i++) {
    const cx = p[0] + (x - p[0]) * (i / pasos);
    const cy = p[1] + (y - p[1]) * (i / pasos);
    await pag.evaluate((a, b) => window.__hkCursor?.(a, b), cx, cy);
    await pag.mouse.move(cx, cy);
    await foto();
  }
}
async function clicEn(x, y) {
  await pag.evaluate((a, b) => window.__hkClic?.(a, b), x, y);
  await foto(2);
  await pag.mouse.click(x, y);
  await esp(700);
  await foto(3);
}

await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(6000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
await pag.keyboard.press("Escape");
await esp(500);
await foto(4);

if (GUION === "klocal") {
  // punto medio de una barra, proyectado a pantalla
  // punto medio de una barra proyectado a pantalla (igual que _klocal_tocar_barra.mjs)
  const pto = await pag.evaluate(() => {
    const h = document.querySelector("#viewer"); const c = h.__ctx;
    const r = h.querySelector("canvas").getBoundingClientRect();
    const V = Object.getPrototypeOf(c.camera.position).constructor;
    const mesh = window.__hekatanMallaK;
    const N = mesh?.nodes?.rawVal, E = mesh?.elements?.rawVal;
    if (!N || !E) return null;
    const idx = E.findIndex((e) => e.length === 2);
    const a = N[E[idx][0]], b = N[E[idx][1]];
    const v = new V((a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2).project(c.camera);
    return { idx, x: (v.x*0.5+0.5)*r.width + r.left, y: (-v.y*0.5+0.5)*r.height + r.top };
  });
  if (!pto) { console.log("no pude proyectar la barra"); await nav.close(); process.exit(1); }
  await irA(pto.x, pto.y, 8);
  await clicEn(pto.x, pto.y);
  const r = await pag.evaluate(() => {
    const c = document.querySelector("#hk-klocal-chip");
    if (!c || c.hidden) return null;
    const b = c.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2, txt: c.textContent };
  });
  if (r) {
    await irA(r.x, r.y, 6);
    await clicEn(r.x, r.y);
    await foto(6);
    console.log("boton:", r.txt);
  } else {
    console.log("no salio el boton de la K");
  }
}

console.log(`${n} fotogramas -> ${OUT}   pageerror: ${errores.length}`);
if (errores.length) console.log(errores.slice(0, 3));
await nav.close();
