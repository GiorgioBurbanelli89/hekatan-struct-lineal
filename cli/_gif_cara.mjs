// GIF: el cursor DENTRO de la cara del Shell 305 (muro con 4 apoyos), el valor cambia como en SAP2000. node cli/_gif_cara.mjs <dir> [base]
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";
const DIR = process.argv[2], BASE = process.argv[3] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const URL = `${BASE}/workspace/?t=muro-manabi&p=` + Buffer.from(JSON.stringify({ modelo: 1, L: 1, ms: 0.1, cf: 0, caso: 0, lat: 0, apoyos: 1 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 2000, height: 1250 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; p.nudos.val = false; p.kAreas.val = false; p.kBarras.val = false; window.__hekatanSettings().deformedShape.val = false; });
await pag.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const { camera: cam, controls: ct, render } = v.__ctx;
  const N = window.__hekatanStates.nodes.val, t = cam.position.clone().set(N[164][0], N[164][1], N[164][2] + 0.35);
  const d = cam.position.distanceTo(ct.target); cam.up.set(0, 0, 1); ct.target.copy(t);
  cam.position.copy(t.clone().add(cam.position.clone().set(-1, 0, 0).multiplyScalar(cam.isOrthographicCamera ? d : 2.2)));
  if (cam.isOrthographicCamera) { cam.zoom *= 6; cam.updateProjectionMatrix(); } cam.lookAt(t); ct.update(); render();
});
await new Promise((r) => setTimeout(r, 800));
const meta = []; let n = 0, cur = [300, 900];
const rectTip = () => pag.evaluate(() => { const d = [...document.querySelectorAll("div")].find((q) => q.style.whiteSpace === "pre-line" && q.style.display === "block"); if (!d) return null; const r = d.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
const foto = async (rotulo, clic = false, k = 1, caja = null, tip = false) => { for (let i = 0; i < k; i++) { const f = `f_${String(n++).padStart(3, "0")}.png`; await pag.screenshot({ path: `${DIR}/${f}` });
  const t = tip ? await rectTip() : null;
  meta.push({ f, x: cur[0], y: cur[1], clic, rotulo, caja: t ? [t[0] - 4, t[1] - 4, t[2] + 4, t[3] + 4] : caja, flecha: t ? [t[2] + 120, t[1] - 60, t[2] + 8, t[1] + 30] : null, crop: t ? [Math.min(cur[0], t[0]) - 380, Math.min(cur[1], t[1]) - 260, t[2] + 240, t[3] + 60] : null }); } };
const ir = async (dest, rotulo, pasos = 8, tip = false, lento = 0) => { const [x0, y0] = cur; for (let i = 1; i <= pasos; i++) { const t = i / pasos, e = lento ? t : t * t * (3 - 2 * t); cur = [x0 + (dest[0] - x0) * e, y0 + (dest[1] - y0) * e]; await pag.mouse.move(cur[0], cur[1]); if (lento) await new Promise((r) => setTimeout(r, lento)); await foto(rotulo, false, 1, null, tip); } };
const fila = (et) => pag.evaluate((et) => { const e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim() === et); const r = e.querySelector("select").getBoundingClientRect(); const R = e.getBoundingClientRect(); return { p: [r.x + r.width * 0.6, r.y + r.height / 2], caja: [R.x - 2, R.y - 2, R.right + 2, R.bottom + 2] }; }, et);
const elegir = (et, v) => pag.evaluate((et, v) => { const e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim() === et); const s = e.querySelector("select"); s.value = v; s.dispatchEvent(new Event("change", { bubbles: true })); }, et, v);
const cambia = async (et, v, rotulo) => { const f = await fila(et); await ir(f.p, rotulo, 8); await foto(rotulo, true, 2, f.caja); await elegir(et, v); await new Promise((r) => setTimeout(r, 1200)); await foto(rotulo, false, 5, f.caja); };
await foto("HEKATAN STRUCT · el mismo muro con 4 apoyos fijos · tonf, m", false, 4);
await cambia("Resultados de cáscara", "M22", "Resultados de cáscara = M22");
await cambia("⊞ Promediado", "ninguno (sin promediar)", "Settings › «Promediado» = ninguno  (= SAP2000 None)");
const P = await pag.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const cam = v.__ctx.camera, cv = v.querySelector("canvas").getBoundingClientRect();
  const N = window.__hekatanStates.nodes.val, e = window.__hekatanStates.elements.val[305];
  return e.map((k) => { const q = cam.position.clone().set(...N[k]).project(cam); return [cv.left + (q.x * 0.5 + 0.5) * cv.width, cv.top + (-q.y * 0.5 + 0.5) * cv.height]; });
});
const en = (a, b) => [P[0][0] + (P[2][0] - P[0][0]) * a, P[0][1] + (P[2][1] - P[0][1]) * b];   // a=b=0 nudo 164, 1 = nudo 347
const C = en(0.5, 0.5);
await ir(C, "Cursor DENTRO de la cara del Shell 305: el valor cambia como en SAP2000", 12, true); await foto("Cursor DENTRO de la cara del Shell 305: el valor cambia como en SAP2000", false, 6, null, true);
await ir(en(0.02, 0.02), "Junto al nudo 164 (abajo izquierda): M22 ≈ −1.56", 10, true, 60); await foto("Junto al nudo 164 (abajo izquierda): M22 ≈ −1.56", false, 8, null, true);
await ir(en(0.98, 0.98), "Recorriendo la diagonal: de −1.56 a −1.31", 24, true, 90);
await foto("Junto al nudo 347 (arriba derecha): M22 ≈ −1.31", false, 8, null, true);
await ir(C, "En el centro: la media de los 4 nudos ≈ −1.44", 12, true, 60); await foto("En el centro: la media de los 4 nudos ≈ −1.44", false, 10, null, true);
writeFileSync(`${DIR}/meta.json`, JSON.stringify(meta), "utf-8");
console.log("fotogramas", n);
await nav.close();
