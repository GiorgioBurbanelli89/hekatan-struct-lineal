// GIF para Fernan: M22 en el joint del pico (nudo 14, pantalla) sin promediar y promediado, = SAP2000. node cli/_gif_fernan.mjs <dir>
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";
const DIR = process.argv[2];
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=muro-manabi&p=" + Buffer.from(JSON.stringify({ modelo: 1, cf: 1, L: 3, sCf: 1.5, ms: 0.15 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; p.nudos.val = false; p.kAreas.val = false; p.kBarras.val = false; p.areas.val = true;
  const s = window.__hekatanSettings(); s.deformedShape.val = false; });
await new Promise((r) => setTimeout(r, 1000));
// cámara DE FRENTE a la pantalla del muro (como la vista Y-Z de SAP2000), cerca de la base (nudo 14)
await pag.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const { camera: cam, controls: ct, render } = v.__ctx;
  const N = window.__hekatanStates.nodes.val, t = cam.position.clone().set(N[14][0], N[14][1] + 0.45, N[14][2] - 0.25);
  const d = cam.position.distanceTo(ct.target);
  cam.up.set(0, 0, 1); ct.target.copy(t);
  cam.position.copy(t.clone().add(cam.position.clone().set(-1, 0, 0).multiplyScalar(cam.isOrthographicCamera ? d : 2.2)));
  if (cam.isOrthographicCamera) { cam.zoom *= 6; cam.updateProjectionMatrix(); }
  cam.lookAt(t); ct.update(); render();
});
await new Promise((r) => setTimeout(r, 800));
// pantalla del nudo 14 y del centro del elemento 440 (pantalla del muro), con la cámara del visor
const pantalla = () => pag.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const cam = v.__ctx.camera, cv = v.querySelector("canvas").getBoundingClientRect();
  const st = window.__hekatanStates, N = st.nodes.val, e = st.elements.val[440];
  const pr = (p) => { const q = cam.position.clone().set(p[0], p[1], p[2]).project(cam); return [cv.left + (q.x * 0.5 + 0.5) * cv.width, cv.top + (-q.y * 0.5 + 0.5) * cv.height]; };
  const c = [0, 1, 2].map((k) => e.reduce((a, n) => a + N[n][k], 0) / 4);
  return { n14: pr(N[14]), c440: pr(c), e440: e };
});
let P = await pantalla(); console.log(P);
// el punto: dentro de la pantalla (Shell 440) y con el nudo 14 como el más cercano — se busca mirando el recuadro
await pag.evaluate(() => { window.__hekatanPromediado.val = "ninguno"; });
const leer = () => pag.evaluate(() => [...document.querySelectorAll("div")].find((q) => q.style.whiteSpace === "pre-line" && q.style.display === "block")?.textContent ?? "");
let PUNTO = null;
for (const f of [0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5]) for (const lat of [0, 3, -3, 6, -6, 10, -10]) {
  if (PUNTO) break;
  const dx = P.c440[0] - P.n14[0], dy = P.c440[1] - P.n14[1], L = Math.hypot(dx, dy) || 1;
  const q = [P.n14[0] + dx * f - dy / L * lat, P.n14[1] + dy * f + dx / L * lat];
  await pag.mouse.move(q[0] + 30, q[1] + 30); await new Promise((r) => setTimeout(r, 150));
  await pag.mouse.move(q[0], q[1]); await new Promise((r) => setTimeout(r, 300));
  const t = await leer();
  if (!PUNTO) console.log(f, lat, JSON.stringify(t.slice(0, 120)));
  if (t.startsWith("Shell 440") && t.includes("en el nudo 14")) PUNTO = q;
}
console.log("punto:", PUNTO); if (!PUNTO) throw new Error("no encuentro el Shell 440 junto al nudo 14");
await pag.evaluate(() => { window.__hekatanPromediado.val = "en todos los nudos (CSI)" === "" ? "" : "todos"; });
await pag.mouse.move(20, 990); await new Promise((r) => setTimeout(r, 500));
const meta = []; let n = 0, cur = [900, 700];
const foto = async (rotulo, clic = false, k = 1, caja = null) => { for (let i = 0; i < k; i++) { const f = `f_${String(n++).padStart(3, "0")}.png`; await pag.screenshot({ path: `${DIR}/${f}` }); meta.push({ f, x: cur[0], y: cur[1], clic, rotulo, caja }); } };
const ir = async (dest, rotulo, pasos = 8) => { const [x0, y0] = cur; for (let i = 1; i <= pasos; i++) { const t = i / pasos, e = t * t * (3 - 2 * t); cur = [x0 + (dest[0] - x0) * e, y0 + (dest[1] - y0) * e]; await pag.mouse.move(cur[0], cur[1]); await foto(rotulo); } };
const quieto = async (rotulo, k) => { await new Promise((r) => setTimeout(r, 900)); for (let i = 0; i < k; i++) { await new Promise((r) => setTimeout(r, 150)); await foto(rotulo); } };
const fila = (et) => pag.evaluate((et) => { const e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim() === et); const r = e.querySelector("select").getBoundingClientRect(); const R = e.getBoundingClientRect(); return { p: [r.x + r.width * 0.6, r.y + r.height / 2], caja: [R.x - 2, R.y - 2, R.right + 2, R.bottom + 2] }; }, et);
const elegir = (et, v) => pag.evaluate((et, v) => { const e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim() === et); const s = e.querySelector("select"); s.value = v; s.dispatchEvent(new Event("change", { bubbles: true })); }, et, v);
const cambia = async (et, v, rotulo) => { const f = await fila(et); await ir(f.p, rotulo, 8); await foto(rotulo, true, 2, f.caja); await elegir(et, v); await new Promise((r) => setTimeout(r, 1200)); await foto(rotulo, false, 5, f.caja); };
await foto("HEKATAN STRUCT · el mismo muro, mismas unidades (tonf, m)", false, 4);
await cambia("Resultados de cáscara", "V23", "Resultados de cáscara = V23 (como en SAP2000)");
await cambia("📐 Rango colormap", "todas, min/max real", "Rango colormap = min/max real");
const R1 = "Promediado = ninguno  (SAP2000: Stress Averaging = None)";
await cambia("⊞ Promediado", "ninguno (sin promediar)", R1);
const R2 = "Nudo 14 (base del muro): V23 = −4.494 tonf/m · SAP2000 None: −4.4944 Tonf,m (−44.07 KN,m)";
await ir(PUNTO, R2, 12); await quieto(R2, 18);
const R3 = "Promediado = en todos los nudos  (SAP2000: At All Joints)";
await pag.mouse.move(20, 990); cur = [20, 990];
await cambia("⊞ Promediado", "en todos los nudos (CSI)", R3);
const R4 = "Mismo nudo, promediado con zapata y contrafuerte (At All Joints)";
await ir(PUNTO, R4, 12); await quieto(R4, 18);
writeFileSync(`${DIR}/meta.json`, JSON.stringify(meta), "utf-8");
const tip = await pag.evaluate(() => [...document.querySelectorAll("div")].find((q) => q.style.whiteSpace === "pre-line" && q.style.display === "block")?.textContent);
console.log("fotogramas", n, "\nrecuadro final:\n" + tip);
await nav.close();
