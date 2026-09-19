// Parte «Hekatan Struct» del vídeo de la zapata: la WEB PÚBLICA con cursor (el ratón real de puppeteer
// + una flecha dibujada encima), fotogramas 1280×720 (interfaz 1280×620 + franja negra de subtítulo).
//   node cli/video_zapata_struct_web.mjs frames_tut_struct_web
// Deja f000.png… + pasos.json para ../hekatan-school/montar_tutorial.py (guion cli/guiones/struct_web_{es,en}.txt).
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";

const OUT = process.argv[2] ?? "frames_tut_struct_web";
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith(".png")) unlinkSync(`${OUT}/${f}`);
const URL0 = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=zapata-levantamiento&sinBienvenida=1";
const W = 1280, HI = 620, H = 720;
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: W, height: HI });
const errs = []; pag.on("pageerror", (e) => errs.push(e.message.slice(0, 160)));
pag.on("dialog", (d) => d.dismiss());
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let k = 0, cx = 640, cy = 300;
const pasos = [];
let desde = 0;

async function cursor() {
  await pag.evaluate((x, y) => {
    let c = document.getElementById("__cur");
    if (!c) {
      c = document.createElement("div"); c.id = "__cur";
      c.style.cssText = "position:fixed;z-index:2147483647;pointer-events:none;width:26px;height:34px";
      c.innerHTML = '<svg width="26" height="34" viewBox="0 0 26 34"><path d="M1 1 L1 27 L8 21 L13 32 L18 30 L13 19 L22 19 Z" fill="white" stroke="black" stroke-width="2"/></svg>';
      document.body.appendChild(c);
    }
    c.style.left = x + "px"; c.style.top = y + "px";
  }, cx, cy);
}
async function foto(n = 1) {
  await cursor();
  const img = await pag.screenshot({ type: "png" });   // 1280×620; la franja negra de 100 px la pone cli/_pad_franja.py
  for (let i = 0; i < n; i++) writeFileSync(`${OUT}/f${String(k++).padStart(3, "0")}.png`, img);
}
async function mover(x, y, pasosN = 10) {
  const x0 = cx, y0 = cy;
  for (let i = 1; i <= pasosN; i++) {
    const t = i / pasosN, s = t * t * (3 - 2 * t);
    cx = x0 + (x - x0) * s; cy = y0 + (y - y0) * s;
    await pag.mouse.move(cx, cy); await foto();
  }
}
// recuadro que APARECE (crece en 5 fotogramas) + rótulo corto con flecha al lado
async function marco(rect, color = "#ffb347", texto = "", lado = "izq") {
  const pinta = (r, c, t, l, f) => pag.evaluate((r, c, t, l, f) => {
    let m = document.getElementById("__marco"), g = document.getElementById("__rot");
    if (!m) { m = document.createElement("div"); m.id = "__marco"; document.body.appendChild(m); }
    if (!g) { g = document.createElement("div"); g.id = "__rot"; document.body.appendChild(g); }
    if (!r) { m.style.display = g.style.display = "none"; return; }
    const cxr = r[0] + r[2] / 2, cyr = r[1] + r[3] / 2, w = (r[2] + 12) * f, h = (r[3] + 12) * f;
    m.style.cssText = `position:fixed;z-index:2147483646;pointer-events:none;border:4px solid ${c};border-radius:6px;` +
      `box-shadow:0 0 14px ${c};left:${cxr - w / 2}px;top:${cyr - h / 2}px;width:${w}px;height:${h}px;display:block`;
    if (!t || f < 1) { g.style.display = "none"; return; }
    const izq = l === "izq";
    g.innerHTML = izq ? `${t} <b style="font-size:22px">➜</b>` : `<b style="font-size:22px">⬅</b> ${t}`;
    g.style.cssText = `position:fixed;z-index:2147483646;pointer-events:none;background:${c};color:#111;` +
      `font:700 15px 'Segoe UI',sans-serif;padding:5px 10px;border-radius:6px;white-space:nowrap;display:block;` +
      `top:${cyr - 16}px;` + (izq ? `right:${innerWidth - r[0] + 14}px` : `left:${r[0] + r[2] + 14}px`);
  }, r, c, t, l, f);
  if (!rect) return pinta(null, color, "", lado, 1);
  for (const f of [0.3, 0.55, 0.8, 1.0]) { await pinta(rect, color, texto, lado, f); await foto(); }
}
const rectDe = (fn, arg) => pag.evaluate(fn, arg);
const lbl = (txt) => rectDe((t) => {
  const l = [...document.querySelectorAll(".tp-lblv_l")].find((x) => x.textContent.includes(t)); const e = l?.parentElement;
  if (!e) return null; e.scrollIntoView({ block: "center" }); const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height];
}, txt);
const abrirFolder = (txt) => pag.evaluate((t) => {
  const b = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.textContent.trim() === t);
  const f = b?.closest(".tp-fldv"); if (f && !f.classList.contains("tp-fldv-expanded")) b.parentElement.click();
}, txt);
function paso(rotulo) { pasos.push({ rotulo, desde, hasta: k - 1 }); desde = k; }

await pag.goto(URL0, { waitUntil: "networkidle2", timeout: 180000 });
await espera(9000);

// 1 · la plantilla abierta
await foto(6); await mover(560, 300, 12); await foto(10);
paso("plantilla abierta");

// 2 · la casilla «Suelo sin tracción»
await abrirFolder("Suelo"); await espera(600);
let r = await lbl("Suelo sin tracción"); await espera(400);
r = await lbl("Suelo sin tracción");
await mover(r[0] + r[2] - 30, r[1] + r[3] / 2, 14); await marco(r, "#ffd400", "Encendida: el suelo NO tira"); await foto(18);
paso("casilla suelo sin traccion");
await marco(null);

// 3 · la línea areaspring … compresion en la ventana de comandos
const rt = await pag.evaluate(() => {
  const ta = [...document.querySelectorAll("textarea")].find((t) => t.value.includes("areaspring"));
  ta.scrollIntoView({ block: "center" });
  const i = ta.value.indexOf("areaspring"), j = ta.value.indexOf("\n", i);
  const lineas = ta.value.slice(0, i).split("\n").length - 1;
  const lh = parseFloat(getComputedStyle(ta).lineHeight) || 13;
  ta.focus(); ta.setSelectionRange(i, j); ta.scrollTop = Math.max(0, lineas * lh - 60);
  const b = ta.getBoundingClientRect();
  return [b.x, b.y + (lineas * lh - ta.scrollTop), b.width, lh, ta.value.slice(i, j)];
});
console.log("línea:", rt[4]);
await mover(rt[0] + 120, rt[1] + 6, 14); await marco([rt[0] + 2, rt[1] + 2, rt[2] - 6, rt[3] + 4], "#ffd400", "resorte de área: ks · compresión"); await foto(18);
paso("areaspring compresion");
await marco(null);

// 4 · la presión, el borde levantado y q_max
const proy = await pag.evaluate(() => {
  const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); if (!h) return null;
  const c = h.__ctx, r = h.querySelector("canvas").getBoundingClientRect(), V = Object.getPrototypeOf(c.camera.position).constructor;
  return [[0.05, 0.05, 0], [0.9, 0.05, 0], [0.05, 0.5, 0], [1.45, 1.45, 0]].map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera);
    return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top]; });
});
console.log("proyección:", JSON.stringify(proy));
if (proy) {
  const xs = proy.slice(0, 3).map((p) => p[0]), ys = proy.slice(0, 3).map((p) => p[1]);
  const box = [Math.min(...xs) - 10, Math.min(...ys) - 10, Math.max(...xs) - Math.min(...xs) + 20, Math.max(...ys) - Math.min(...ys) + 20];
  await mover(box[0] + box[2] / 2, box[1] + box[3] / 2, 12); await marco(box, "#ff5c5c", "borde levantado: presión 0"); await foto(14);
  await marco(null);
  await mover(proy[3][0], proy[3][1], 10); await marco([proy[3][0] - 30, proy[3][1] - 20, 60, 40], "#ffd400", "esquina cargada: q_max", "der"); await foto(10);
  await marco(null);
}
r = await lbl("q_max / q_adm"); r = await lbl("q_max");
await mover(r[0] + 200, r[1] + r[3] / 2, 12); await marco([r[0], r[1], 290, r[3] * 2 + 10], "#ffd400", "sin tracción: 81.91 tonf/m²"); await foto(14);
const qNL = await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv_l")].find((x) => x.textContent.trim() === "q_max")?.parentElement.textContent);
console.log("sin tracción:", qNL);
paso("presion 81.9");
await marco(null);

// 5 · apagar la casilla: lineal
r = await lbl("Suelo sin tracción");
await mover(r[0] + r[2] - 30, r[1] + r[3] / 2, 12);
await pag.evaluate(() => { const e = [...document.querySelectorAll(".tp-lblv_l")].find((x) => x.textContent.includes("Suelo sin tracción")).parentElement; e.querySelector("input").click(); });
await foto(3); await espera(6000);
r = await lbl("q_max / q_adm"); r = await lbl("q_max");
await mover(r[0] + 200, r[1] + r[3] / 2, 12); await marco([r[0], r[1], 290, r[3] * 2 + 10], "#ff5c5c", "lineal: el suelo tira → 76.67"); await foto(14);
const qL = await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv_l")].find((x) => x.textContent.trim() === "q_max")?.parentElement.textContent);
console.log("lineal:", qL);
paso("lineal 76.7");
await marco(null);

// 6 · encender otra vez + Diseño → Informe
r = await lbl("Suelo sin tracción");
await mover(r[0] + r[2] - 30, r[1] + r[3] / 2, 10);
await pag.evaluate(() => { const e = [...document.querySelectorAll(".tp-lblv_l")].find((x) => x.textContent.includes("Suelo sin tracción")).parentElement; e.querySelector("input").click(); });
await foto(3); await espera(6000);
const bd = await rectDe(() => { const b = document.getElementById("hk-diseno-btn").getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; });
await mover(bd[0] + bd[2] / 2, bd[1] + bd[3] / 2, 14); await marco(bd, "#ffd400", "📐 Diseño", "der"); await foto(4); await marco(null); await pag.click("#hk-diseno-btn"); await espera(600); await foto(8);
const ri = await rectDe(() => { const b = document.querySelector('#hk-diseno-menu [data-id="zapata-informe"]').getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; });
await mover(ri[0] + 120, ri[1] + 12, 10); await marco(ri, "#ffd400", "Informe", "der"); await foto(4); await marco(null);
await pag.evaluate(() => document.querySelector('#hk-diseno-menu [data-id="zapata-informe"]').click());
await espera(20000); await mover(760, 380, 10); await foto(10);
const rq = await rectDe(() => { const e = [...document.querySelectorAll("#hk-tutor [data-paso]")].find((b) => b.dataset.paso === "q"); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; });
if (rq) {
  await mover(rq[0] + 60, rq[1] + 12, 12); await marco(rq, "#ffd400", "❓ Explícame", "der"); await foto(6);
  await pag.evaluate(() => [...document.querySelectorAll("#hk-tutor [data-paso]")].find((b) => b.dataset.paso === "q").click()); await espera(700);
  await marco(null); await foto(14);
}
paso("informe");
await pag.evaluate(() => document.getElementById("hk-explicame")?.remove());

// 7 · el Tutor
await pag.evaluate(() => document.getElementById("hk-tutor")?.remove());
await mover(bd[0] + bd[2] / 2, bd[1] + bd[3] / 2, 12); await pag.click("#hk-diseno-btn"); await espera(600); await foto(4);
const rtu = await rectDe(() => { const b = document.querySelector('#hk-diseno-menu [data-id="zapata-tutor"]').getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; });
await mover(rtu[0] + 120, rtu[1] + 12, 10); await marco(rtu, "#ffd400", "Tutor FEM", "der"); await foto(4); await marco(null);
await pag.evaluate(() => document.querySelector('#hk-diseno-menu [data-id="zapata-tutor"]').click());
await espera(20000); await mover(700, 400, 10); await foto(16);
paso("tutor");

writeFileSync(`${OUT}/pasos.json`, JSON.stringify({ pasos }, null, 1));
console.log(k, "fotogramas", pasos.length, "pasos · errores:", errs.length, errs.slice(0, 3));
await nav.close();
