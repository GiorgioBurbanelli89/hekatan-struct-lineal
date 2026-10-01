// GIF: ver la zapata / la pantalla por separado (Cortes X/Y/Z) y el Corte de sección (fuerzas totales). node cli/_gif_corte.mjs <dir> [base]
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";
const DIR = process.argv[2], BASE = process.argv[3] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const URL = `${BASE}/workspace/?t=muro-manabi&p=` + Buffer.from(JSON.stringify({ modelo: 1, L: 1, ms: 0.1, cf: 0, caso: 0, lat: 0, apoyos: 1 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1700, height: 1050 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; for (const k in p) p[k].val = false; window.__hekatanSettings().shellResults.val = "bendingYY"; window.__hekatanSettings().deformedShape.val = false; });
// plegar las carpetas de Settings que no se usan, para que se vean las de los cortes
await pag.evaluate(() => { for (const t of document.querySelectorAll(".tp-fldv_t")) { const n = t.innerText.trim(); const fl = t.closest(".tp-fldv");
  if (/^(Ver|Datos de entrada|Tablas|Rejilla|Al pasar|Sismo|Modal|〰)/.test(n) && fl.classList.contains("tp-fldv-expanded")) t.click(); } });
await new Promise((r) => setTimeout(r, 600));
const meta = []; let n = 0, cur = [900, 600];
const foto = async (rotulo, clic = false, k = 1, caja = null, crop = null) => { for (let i = 0; i < k; i++) { const f = `f_${String(n++).padStart(3, "0")}.png`; await pag.screenshot({ path: `${DIR}/${f}` }); meta.push({ f, x: cur[0], y: cur[1], clic, rotulo, caja, crop }); } };
const ir = async (dest, rotulo, pasos = 8, caja = null) => { const [x0, y0] = cur; for (let i = 1; i <= pasos; i++) { const t = i / pasos, e = t * t * (3 - 2 * t); cur = [x0 + (dest[0] - x0) * e, y0 + (dest[1] - y0) * e]; await pag.mouse.move(cur[0], cur[1]); await foto(rotulo, false, 1, caja); } };
const rect = (sel, txt) => pag.evaluate((sel, txt) => { const e = [...document.querySelectorAll(sel)].find((x) => x.innerText.trim().replace(/\s+/g, " ").includes(txt)); if (!e) return null; e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; }, sel, txt);
const fila = (et) => pag.evaluate((et) => { const e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim() === et); if (!e) return null; e.scrollIntoView({ block: "center" }); const c = e.querySelector("input, select, textarea") ?? e; const r = c.getBoundingClientRect(), R = e.getBoundingClientRect(); return { p: [r.left + Math.min(r.width / 2, 40), r.top + r.height / 2], caja: [R.left - 2, R.top - 2, R.right + 2, R.bottom + 2] }; }, et);
const clic = async (p, rotulo, caja) => { await ir(p, rotulo, 8, caja); await foto(rotulo, true, 2, caja); await pag.mouse.click(p[0], p[1]); await new Promise((r) => setTimeout(r, 900)); await foto(rotulo, false, 4, caja); };
const carpeta = async (txt, rotulo) => { const r = await rect(".tp-fldv_t", txt); const c = [r[0] - 2, r[1] - 2, r[2] + 2, r[3] + 2]; await clic([(r[0] + r[2]) / 2, (r[1] + r[3]) / 2], rotulo, c); };
const escribir = async (et, val, rotulo) => { const f = await fila(et); await clic(f.p, rotulo, f.caja); await pag.keyboard.down("Control"); await pag.keyboard.press("A"); await pag.keyboard.up("Control"); await pag.keyboard.type(String(val), { delay: 60 }); await pag.keyboard.press("Enter"); await new Promise((r) => setTimeout(r, 1000)); await foto(rotulo, false, 5, f.caja); };
const marcar = async (et, rotulo) => { const f = await fila(et); await clic(f.p, rotulo, f.caja); await foto(rotulo, false, 6, f.caja); };
await foto("Hekatan Struct · muro con 4 apoyos · M22", false, 5);
// 1) ver por partes
await carpeta("Cortes X/Y/Z", "Settings › «✂ Cortes X/Y/Z»: ver el modelo por partes");
await marcar("Cortar Z", "Cortar Z: oculta lo que queda a un lado del plano horizontal");
await escribir("pos Z (m)", 0.25, "pos Z = 0.25 m (entre la zapata y la pantalla): queda SOLO la ZAPATA");
await ir([1000, 650], "pos Z = 0.25 m: queda SOLO la ZAPATA", 8); await foto("pos Z = 0.25 m: queda SOLO la ZAPATA", false, 8);
await marcar("invertir Z", "invertir Z: queda SOLO la PANTALLA");
await ir([1000, 500], "invertir Z: queda SOLO la PANTALLA", 8); await foto("invertir Z: queda SOLO la PANTALLA", false, 8);
await marcar("Cortar Z", "Cortar Z desmarcado: el muro completo otra vez");
await carpeta("Cortes X/Y/Z", "Cortar Z desmarcado: el muro completo otra vez");
// 2) corte de sección
const R2 = "«✂ Corte de sección»: de tonf·m/m a la fuerza TOTAL (como el Section Cut de SAP2000)";
await carpeta("Corte de sección", R2);
await escribir("pos (m)", 0.25, "Plano Z = 0.25 m: corte horizontal en la base de la pantalla");
const b = await rect(".tp-btnv_b", "Calcular el corte"); const cb = [b[0] - 2, b[1] - 2, b[2] + 2, b[3] + 2];
await clic([(b[0] + b[2]) / 2, (b[1] + b[3]) / 2], "Calcular el corte", cb);
const t = await pag.evaluate(() => { const r = document.getElementById("hk-corte-panel").getBoundingClientRect(); return [r.left - 4, r.top - 4, r.right + 4, r.bottom + 4]; });
const zoom = [Math.max(0, t[0] - 60), Math.max(0, t[1] - 40), Math.min(1700, t[2] + 60), Math.min(1050, t[3] + 260)];
const R3 = "Base de la pantalla (1 m de muro): M = −1.613 tonf·m · V = 1.781 tonf · N = 2.631 tonf";
await ir([t[2] - 60, t[3] - 20], R3, 8, t); await foto(R3, false, 18, t, zoom);
writeFileSync(`${DIR}/meta.json`, JSON.stringify(meta), "utf-8");
console.log("fotogramas", n);
await nav.close();
