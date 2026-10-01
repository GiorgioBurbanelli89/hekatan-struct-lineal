// GIF para Fernan: el valor EN EL NUDO (como SAP2000) y no dentro de la cara. Modelo del enlace de Fernan (contrafuertes,
// L 3, malla 0.15). Shell 459, nudo 467: Hekatan = SAP2000 = M22 −1.784, V23 −4.494 (sin promediar).
//   node cli/_gif_fernan_nudo.mjs <dir> [base]
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const DIR = process.argv[2], BASE = process.argv[3] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal"; mkdirSync(DIR, { recursive: true });
const URL = `${BASE}/workspace/?t=muro-manabi&p=` + Buffer.from(JSON.stringify({ modelo: 1, cf: 1, L: 3, sCf: 1.5, ms: 0.15 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 2000, height: 1250 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 8000));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; p.nudos.val = false; p.kAreas.val = false; p.kBarras.val = false; p.areas.val = true; p.todos.val = false;
  window.__hekatanSettings().deformedShape.val = false; });
const meta = []; let n = 0, cur = [1000, 1100];
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const rectTip = () => pag.evaluate(() => { const d = [...document.querySelectorAll("div")].find((q) => q.style.whiteSpace === "pre-line" && q.style.display === "block"); if (!d) return null; const r = d.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
const foto = async (rotulo, clic = false, k = 1, caja = null, tip = false) => { for (let i = 0; i < k; i++) { const f = `f_${String(n++).padStart(3, "0")}.png`; await pag.screenshot({ path: `${DIR}/${f}` });
  const t = tip ? await rectTip() : null;
  meta.push({ f, x: cur[0], y: cur[1], clic, rotulo, caja: t ? [t[0] - 4, t[1] - 4, t[2] + 4, t[3] + 4] : caja, flecha: t ? [t[2] + 120, t[1] - 60, t[2] + 8, t[1] + 30] : null }); } };
const ir = async (dest, rotulo, pasos = 8, tip = false, lento = 0, caja = null) => { const [x0, y0] = cur; for (let i = 1; i <= pasos; i++) { const t = i / pasos, e = lento ? t : t * t * (3 - 2 * t); cur = [x0 + (dest[0] - x0) * e, y0 + (dest[1] - y0) * e]; await pag.mouse.move(cur[0], cur[1]); if (lento) await espera(lento); await foto(rotulo, false, 1, caja, tip); } };
const fila = (et) => pag.evaluate((et) => { const e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim() === et); if (!e) return null; e.scrollIntoView({ block: "center" });
  const c = e.querySelector("select, input"); const r = c.getBoundingClientRect(); const R = e.getBoundingClientRect(); return { p: [r.x + Math.min(r.width * 0.6, 14), r.y + r.height / 2], caja: [R.x - 2, R.y - 2, R.right + 2, R.bottom + 2] }; }, et);
const carpeta = (txt) => pag.evaluate((txt) => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.innerText.includes(txt)); t.scrollIntoView({ block: "center" }); const r = t.getBoundingClientRect(); return { p: [r.x + 60, r.y + r.height / 2], caja: [r.x - 2, r.y - 2, r.right + 2, r.bottom + 2], abierta: t.closest(".tp-fldv").classList.contains("tp-fldv-expanded") }; }, txt);
const elegir = (et, v) => pag.evaluate((et, v) => { const e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim() === et); const s = e.querySelector("select"); s.value = v; s.dispatchEvent(new Event("change", { bubbles: true })); }, et, v);
const cambia = async (et, v, rotulo) => { const f = await fila(et); await espera(300); const g = await fila(et); await ir(g.p, rotulo, 8, false, 0, g.caja); await foto(rotulo, true, 2, g.caja); await elegir(et, v); await espera(1200); await foto(rotulo, false, 5, g.caja); };
const marcar = async (et, rotulo) => { await fila(et); await espera(300); const g = await fila(et); await ir(g.p, rotulo, 8, false, 0, g.caja); await foto(rotulo, true, 2, g.caja); await pag.mouse.click(g.p[0], g.p[1]); await espera(1500); await foto(rotulo, false, 6, g.caja); };
const abrir = async (txt, rotulo) => { const c = await carpeta(txt); if (c.abierta) return; await ir(c.p, rotulo, 8, false, 0, c.caja); await foto(rotulo, true, 2, c.caja); await pag.mouse.click(c.p[0], c.p[1]); await espera(800); await foto(rotulo, false, 3, c.caja); };

await foto("HEKATAN STRUCT · el muro con contrafuertes de Fernan (L = 3 m, malla 0.15) · tonf, m", false, 6);
await abrir("Ver", "Panel izquierdo › 👁 Ver");
await marcar("Malla de áreas", "Ver › marcar «Malla de áreas»: se ve la malla y los nudos");
await cambia("Resultados de cáscara", "M22", "Resultados de cáscara = M22");
await cambia("⊞ Promediado", "ninguno (sin promediar)", "Promediado = ninguno  (= SAP2000 «None»)");
// cámara sobre el Shell 459 (pantalla), mirando de frente a la cara
await pag.mouse.move(1990, 1240); cur = [1990, 1240];
await pag.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const { camera: cam, controls: ct, render } = v.__ctx;
  const N = window.__hekatanStates.nodes.val, e = window.__hekatanStates.elements.val[459];
  const c = [0, 1, 2].map((k) => e.reduce((s, i) => s + N[i][k], 0) / 4);
  const u = [0, 1, 2].map((k) => N[e[1]][k] - N[e[0]][k]), w = [0, 1, 2].map((k) => N[e[3]][k] - N[e[0]][k]);
  let nr = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; const l = Math.hypot(...nr); nr = nr.map((x) => x / l);
  if (nr[0] > 0) nr = nr.map((x) => -x);           // desde el lado de la puntera
  const t = cam.position.clone().set(...c); const d = cam.position.distanceTo(ct.target);
  cam.up.set(0, 0, 1); ct.target.copy(t); cam.position.copy(t.clone().add(cam.position.clone().set(...nr).multiplyScalar(cam.isOrthographicCamera ? d : 1.6)));
  if (cam.isOrthographicCamera) { cam.zoom *= 9; cam.updateProjectionMatrix(); } cam.lookAt(t); ct.update(); render();
});
await espera(1200);
const P = await pag.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const cam = v.__ctx.camera, cv = v.querySelector("canvas").getBoundingClientRect();
  const N = window.__hekatanStates.nodes.val, e = window.__hekatanStates.elements.val[459];
  return e.map((k) => { const q = cam.position.clone().set(...N[k]).project(cam); return [cv.left + (q.x * 0.5 + 0.5) * cv.width, cv.top + (-q.y * 0.5 + 0.5) * cv.height]; });
});
const C = [(P[0][0] + P[2][0]) / 2, (P[0][1] + P[2][1]) / 2];
const hacia = (p, f) => [C[0] + (p[0] - C[0]) * f, C[1] + (p[1] - C[1]) * f];
await foto("Shell 459 de frente · el nudo 467 es una de sus esquinas", false, 6);
await ir(C, "✗ Cursor DENTRO de la cara: valor interpolado, NO es el del nudo", 14, true); await foto("✗ Cursor DENTRO de la cara: valor interpolado, NO es el del nudo", false, 14, null, true);
await ir(hacia(P[1], 0.996), "✓ Cursor SOBRE el nudo 467: M22 = −1.784 (SAP2000: −1.784)", 18, true, 70);
await foto("✓ Cursor SOBRE el nudo 467: M22 = −1.784 (SAP2000: −1.784)", false, 22, null, true);
writeFileSync(`${DIR}/meta.json`, JSON.stringify(meta), "utf-8");
console.log("fotogramas", n);
await nav.close();
