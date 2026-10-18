/**
 * GIF de la SELECCIÓN como AutoCAD (18-oct-2026), con el ratón real y un cursor visible:
 * un nudo · Ctrl+clic varios · ventana izq→der · captura der→izq, con la vista previa antes de soltar.
 * Deja fotogramas + meta.json (texto de cada paso) para cli/gif_redibujo.py.
 *   node cli/grabar_seleccion.mjs <carpeta> [--base URL]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2); const ib = args.indexOf("--base");
const BASE = ib >= 0 ? args.splice(ib, 2)[1] : "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const OUT = path.join(args[0], "seleccion"); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(4500);
const ev = (f, a) => pag.evaluate(f, a);
const cdp = await pag.target().createCDPSession();
const fotos = []; let k = 0, texto = "";
const foto = async (n = 1) => { for (let i = 0; i < n; i++) { const { data } = await cdp.send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(OUT, `f${String(k).padStart(4, "0")}.png`), Buffer.from(data, "base64")); fotos.push({ f: k++, texto }); } };
// cursor visible que sigue al ratón real
await ev(() => { const c = document.createElement("div"); c.id = "hk-gif-cursor";
  c.innerHTML = '<svg width="22" height="30" viewBox="0 0 26 34"><path d="M2 2 L2 27 L8.5 21 L13 32 L17.5 30 L13 19.5 L22 19.5 Z" fill="#fff" stroke="#000" stroke-width="2"/></svg>';
  c.style.cssText = "position:fixed;left:640px;top:360px;z-index:2147483647;pointer-events:none;transform:translate(-2px,-2px)"; document.body.appendChild(c);
  document.addEventListener("pointermove", (e) => { c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; }, true);
  window.__aro = (x, y) => { const a = document.createElement("div"); a.style.cssText = `position:fixed;left:${x - 14}px;top:${y - 14}px;width:28px;height:28px;border-radius:50%;border:3px solid #fbbf24;z-index:2147483646;pointer-events:none;transition:all .4s ease-out`; document.body.appendChild(a); requestAnimationFrame(() => { a.style.transform = "scale(1.8)"; a.style.opacity = "0"; }); setTimeout(() => a.remove(), 500); }; });
let cur = [640, 360];
const mover = async (x, y, n = 10, fotoCada = true) => { const [x0, y0] = cur; for (let i = 1; i <= n; i++) { const t = i / n, s = t * t * (3 - 2 * t); await pag.mouse.move(x0 + (x - x0) * s, y0 + (y - y0) * s); if (fotoCada) await foto(); } cur = [x, y]; };
const clic = async (c, mod) => { await mover(c[0], c[1]); await ev(([a, b]) => window.__aro(a, b), c); if (mod) await pag.keyboard.down(mod); await pag.mouse.click(c[0], c[1]); if (mod) await pag.keyboard.up(mod); await espera(250); await foto(3); };
const centro = (sel) => ev((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; }, sel);
const boton = (re) => ev((re) => { const b = [...document.querySelectorAll("#hk-revit button")].find((b) => new RegExp(re).test(b.textContent) && b.getBoundingClientRect().width > 0); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, re);
const mundo = (p) => ev((p) => { const c = document.querySelector("#viewer canvas"); const x = window.__hekatanViewerCtx(); const r = c.getBoundingClientRect(); const V = Object.getPrototypeOf(x.camera.position).constructor; const v = new V(...p).project(x.camera); return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top]; }, p);
const sel = () => ev(() => { const s = [...(window.__hekatanSelection ?? [])]; return { pt: s.filter((i) => i.startsWith("pt:")).length, seg: s.filter((i) => i.startsWith("seg:")).length }; });
const quitarPanel = () => ev(() => { const p = document.getElementById("hk-properties-pane"); if (p) p.style.visibility = "hidden"; });   // para que se vea el modelo entero en el GIF
const log = [];

// 0. modelo: Rejilla → Crear → columnas y vigas en todos los niveles → planta N+3
texto = "Modelo: Rejilla 4 vanos × 3 vanos × 4 pisos, columnas y vigas en todos los niveles";
await foto(4);
if (!(await ev(() => document.body.classList.contains("hk-revit-on")))) await clic(await centro("#hk-revit-toggle"));
await clic(await centro('#hk-revit .rv-b[data-rv="ejes"]')); await clic(await boton("Crear")); await espera(1200);
await clic(await centro('#hk-revit .rv-niv[data-z="3"]')); await espera(700);
await clic(await centro('#hk-revit .rv-b[data-rv="columna"]')); await clic(await boton("En ejes · todos")); await espera(500);
await clic(await centro('#hk-revit .rv-b[data-rv="viga"]')); await clic(await boton("En ejes · todos")); await espera(500);
texto = "Planta N+3.00 · herramienta «Modificar» (seleccionar)";
await clic(await centro('#hk-revit .rv-b[data-rv="modificar"]')); await foto(8);

// 1. UN nudo
texto = "1 · Clic sobre UN nudo (6, 5) → queda resaltado (cuadrado azul)";
await clic(await mundo([6, 5, 3])); await quitarPanel(); let s = await sel(); log.push(["un nudo", s]); await foto(14);
// 2. varios con Ctrl
texto = "2 · Ctrl + clic en otros nudos → se SUMAN a la selección";
for (const p of [[12, 5, 3], [18, 5, 3], [12, 10, 3]]) { await clic(await mundo(p), "Control"); await quitarPanel(); }
s = await sel(); log.push(["ctrl", s]); texto = `2 · Ctrl + clic: ${s.pt} nudos seleccionados y resaltados`; await foto(14);
await pag.keyboard.press("Escape"); await espera(300);
// 3. VENTANA izq→der
texto = "3 · VENTANA de IZQUIERDA a DERECHA (azul): coge solo lo que queda ENTERO dentro";
const a1 = await mundo([5, 11, 3]), b1 = await mundo([19, 4, 3]);
await clic(a1); texto = "3 · Mientras se mueve: VISTA PREVIA de lo que va a entrar (antes de soltar)";
await mover(b1[0], b1[1], 22); await foto(8);
await ev(([a, b]) => window.__aro(a, b), b1); await pag.mouse.click(b1[0], b1[1]); await espera(300); await quitarPanel();
s = await sel(); log.push(["ventana", s]); texto = `3 · Ventana: ${s.pt} nudos + ${s.seg} vigas enteras dentro, resaltados (magenta y azul)`; await foto(16);
await pag.keyboard.press("Escape"); await espera(300);
// 4. CAPTURA der→izq
texto = "4 · CAPTURA de DERECHA a IZQUIERDA (verde): coge todo lo que el recuadro TOQUE";
const a2 = await mundo([15.4, 7.2, 3]), b2 = await mundo([8.6, 3.7, 3]);
await clic(a2); texto = "4 · Mientras se mueve: vista previa de lo que toca el recuadro";
await mover(b2[0], b2[1], 22); await foto(8);
await ev(([a, b]) => window.__aro(a, b), b2); await pag.mouse.click(b2[0], b2[1]); await espera(300); await quitarPanel();
s = await sel(); log.push(["captura", s]); texto = `4 · Captura: ${s.seg} vigas que TOCAN el recuadro + ${s.pt} nudo(s) dentro, resaltados`; await foto(16);
fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify({ id: "Selección como AutoCAD", fotos, log }, null, 1));
console.log(k, "fotogramas", JSON.stringify(log)); await nav.close();
