/**
 * Tutorial del MODO REVIT (17-oct-2026): graba los fotogramas (f000.png… + pasos.json) que monta
 * hekatan-school/montar_tutorial.py con la voz. Cursor dibujado, aro al hacer clic, un paso por frase.
 *   node cli/tutorial_modo_revit.mjs <carpeta_salida> [--base URL]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const OUT = args[0] ?? "tutorial_modo_revit";
const ib = args.indexOf("--base");
const BASE = ib >= 0 ? args[ib + 1] : "http://localhost:4600";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 620 });   // + franja negra de 100 px abajo (solo para el subtítulo, que no pise la interfaz)
const errs = []; pag.on("pageerror", (e) => errs.push(e.message)); pag.on("dialog", (d) => d.accept());
await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(3000);
const ev = (f, a) => pag.evaluate(f, a);
await ev(() => { window.confirm = () => true; document.querySelector('#hk-cad-tit button[title="Nuevo"]').click();
  [...document.querySelectorAll("button")].find((b) => /Empezar/.test(b.textContent))?.click(); });
await espera(800);

// cursor y aro de clic dibujados en la página (puppeteer no pinta el del sistema)
await ev(() => {
  const c = document.createElement("div"); c.id = "hk-tut-cursor";
  c.innerHTML = '<svg width="26" height="34" viewBox="0 0 26 34"><path d="M2 2 L2 27 L8.5 21 L13 32 L17.5 30 L13 19.5 L22 19.5 Z" fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="round"/></svg>';
  c.style.cssText = "position:fixed;left:640px;top:360px;z-index:2147483647;pointer-events:none;transform:translate(-2px,-2px)";
  document.body.appendChild(c);
  window.__aro = (x, y) => { const a = document.createElement("div");
    a.style.cssText = `position:fixed;left:${x - 20}px;top:${y - 20}px;width:40px;height:40px;border-radius:50%;border:3px solid #fbbf24;z-index:2147483646;pointer-events:none;transition:all .45s ease-out;opacity:1`;
    document.body.appendChild(a); requestAnimationFrame(() => { a.style.transform = "scale(1.8)"; a.style.opacity = "0"; }); setTimeout(() => a.remove(), 600); };
});
let k = 0; const pasos = []; let desde = 0; let cur = { x: 640, y: 360 };
const foto = async () => { await pag.screenshot({ path: path.join(OUT, `f${String(k).padStart(3, "0")}.png`) }); k++; };
const paso = () => { pasos.push({ desde, hasta: k - 1 }); desde = k; };
const quieto = async (n) => { for (let i = 0; i < n; i++) { await espera(70); await foto(); } };
const mover = async (x, y, n = 8) => {
  const p0 = { ...cur };
  for (let i = 1; i <= n; i++) {
    const t = i / n, s = t * t * (3 - 2 * t);
    const cx = p0.x + (x - p0.x) * s, cy = p0.y + (y - p0.y) * s;
    await pag.mouse.move(cx, cy); await ev(([a, b]) => { const c = document.getElementById("hk-tut-cursor"); c.style.left = a + "px"; c.style.top = b + "px"; }, [cx, cy]);
    await foto();
  }
  cur = { x, y };
};
const clic = async (x, y, n = 8) => { await mover(x, y, n); await ev(([a, b]) => window.__aro(a, b), [x, y]); await pag.mouse.click(x, y); await espera(250); await foto(); await foto(); };
const centro = (sel) => ev((s) => { const e = typeof s === "string" ? document.querySelector(s) : null; if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);
const boton = (re, dentro = "#hk-revit") => ev(([re, d]) => { const b = [...document.querySelectorAll(d + " button")].find((b) => new RegExp(re).test(b.textContent) && b.getBoundingClientRect().width > 0); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, [re, dentro]);
const mundo = (p) => ev((p) => { const c = document.querySelector("#viewer canvas"); const x = window.__hekatanViewerCtx(); const r = c.getBoundingClientRect(); const V = Object.getPrototypeOf(x.camera.position).constructor; const v = new V(...p).project(x.camera); return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top]; }, p);

// 1. presentación
await ev(() => window.__hekatanModoRevit.poner(true)); await espera(500);
await quieto(10); await mover(640, 80, 10); await quieto(6); await mover(1180, 160, 10); await quieto(6); paso();
// 2. ejes
await clic(...(await centro('#hk-revit .rv-b[data-rv="ejes"]'))); await quieto(8);
await clic(...(await boton("Crear"))); await espera(1600); await quieto(10); paso();
// 3. columna con un clic y luego en todos los cruces
await clic(...(await centro('#hk-revit .rv-b[data-rv="columna"]'))); await quieto(4);
await clic(...(await mundo([6, 5, 3]))); await quieto(6);
await clic(...(await boton("En ejes · todos"))); await espera(600); await quieto(10); paso();
// 4. vigas en cadena y en todos los ejes
await clic(...(await centro('#hk-revit .rv-b[data-rv="viga"]'))); await quieto(4);
for (const p of [[0, 0, 3], [6, 0, 3], [12, 0, 3], [18, 0, 3]]) await clic(...(await mundo(p)), 7);
await pag.keyboard.press("Escape"); await quieto(4);
await clic(...(await centro('#hk-revit .rv-b[data-rv="viga"]'))); await clic(...(await boton("En ejes · todos"))); await espera(600); await quieto(10); paso();
// 5. losa con un clic en el vano y luego todas
await clic(...(await centro('#hk-revit .rv-b[data-rv="losa"]'))); await quieto(3);
await mover(...(await mundo([9, 7.5, 3]))); await quieto(6);
await clic(...(await mundo([9, 7.5, 3])), 2); await quieto(6);
await clic(...(await boton("Todas · todos"))); await espera(600); await quieto(10); paso();
// 6. 3D
await clic(...(await centro('#hk-revit .rv-b[data-rv="modificar"]'))); await clic(...(await centro('#hk-revit .rv-b[data-rv="3d"]'))); await espera(1200); await quieto(16); paso();
// 7. cambiar la cota de un nivel: todo lo de esa planta la sigue
await clic(...(await centro('#hk-revit .rv-niv[data-z="3"]'))); await espera(900); await quieto(4);
const cota = await centro('#hk-revit .rv-niv[data-z="3"] .rv-cota');
await mover(...cota); await ev(() => document.querySelector('#hk-revit .rv-niv[data-z="3"] .rv-cota').dispatchEvent(new MouseEvent("dblclick", { bubbles: true })));
await quieto(4); await pag.keyboard.press("Backspace"); for (const ch of "3.80") { await pag.keyboard.type(ch); await foto(); await espera(60); }
await pag.keyboard.press("Enter"); await espera(900); await quieto(6);
await clic(...(await centro('#hk-revit .rv-b[data-rv="3d"]'))); await espera(1200); await quieto(14); paso();

const info = await ev(() => { const P = window.__hekatanDrawingPoints.rawVal, A = window.__hekatanDrawingAreas.rawVal;
  return { nudos: P.length, barras: window.__hekatanDrawingPolylines.rawVal.filter((p) => p.length).length - A.length, losas: A.length, cotas: [...new Set(P.map((p) => p[2]))].sort((a, b) => a - b) }; });
fs.writeFileSync(path.join(OUT, "pasos.json"), JSON.stringify({ pasos, info, errores: errs }, null, 1));
console.log(k, "fotogramas,", pasos.length, "pasos", JSON.stringify(info), "errores:", errs.length);
await nav.close();
