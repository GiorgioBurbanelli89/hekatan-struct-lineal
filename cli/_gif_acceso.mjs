// GIF «cómo se usa el Acceso rápido»: cursor dibujado + rótulo, fotogramas PNG.
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const [dir] = process.argv.slice(2); mkdirSync(dir, { recursive: true });
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 1000 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await p.goto("https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-aporticado&v=" + Date.now(), { waitUntil: "networkidle2", timeout: 180000 }); await espera(10000);
await p.evaluate(() => {
  const c = document.createElement("div"); c.id = "cur";
  c.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>`;
  Object.assign(c.style, { position: "fixed", left: "800px", top: "500px", zIndex: 999999, pointerEvents: "none" });
  const r = document.createElement("div"); r.id = "rot";
  Object.assign(r.style, { position: "fixed", left: "50%", bottom: "70px", transform: "translateX(-50%)", zIndex: 999998, pointerEvents: "none",
    background: "rgba(10,14,24,.88)", color: "#fff", font: "600 22px system-ui", padding: "10px 18px", borderRadius: "10px", border: "1px solid #7f96b3" });
  document.body.append(c, r);
});
let k = 0, pos = [800, 500];
const foto = async (n = 1) => { for (let i = 0; i < n; i++) await p.screenshot({ path: `${dir}/f${String(k++).padStart(3, "0")}.png` }); };
const rotulo = (t) => p.evaluate((t) => { document.getElementById("rot").textContent = t; }, t);
const ir = async (x, y) => { const [x0, y0] = pos; for (let i = 1; i <= 6; i++) { const t = i / 6, e = t * t * (3 - 2 * t);
  await p.evaluate((x, y) => Object.assign(document.getElementById("cur").style, { left: x + "px", top: y + "px" }), x0 + (x - x0) * e, y0 + (y - y0) * e); await foto(); } pos = [x, y]; };
const centro = (sel, txt) => p.evaluate((sel, txt) => { const e = [...document.querySelectorAll(sel)].find((q) => !txt || q.textContent.includes(txt)); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel, txt);
const clic = async (sel, txt) => { const c = await centro(sel, txt); if (!c) { console.log("no", sel, txt); return; } await ir(c[0], c[1]); await p.mouse.click(c[0], c[1]); await espera(900); await foto(3); };
const campo = async (txt, v) => { const c = await p.evaluate((txt) => { const f = [...document.querySelectorAll("#hk-acceso .ar-f")].find((q) => q.textContent.includes(txt)); const i = f?.querySelector("input:not([type=range]),select"); if (!i) return null; const r = i.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, txt);
  if (!c) { console.log("no campo", txt); return; } await ir(c[0], c[1]); await p.mouse.click(c[0], c[1], { clickCount: 3 }); await p.keyboard.type(String(v)); await foto(2); await p.keyboard.press("Enter"); await espera(5000); await foto(6); };
await rotulo("⚡ Acceso rápido: cargas, dimensiones y resultados en un solo panel"); await foto(8);
await p.evaluate(() => { const s = window.__hekatanSettings(); s.deformedShape.val = true; s.deformScale.val = 150; });
await espera(1500);
await rotulo("1 · CARGAS (Alt+1): se cambia la carga y recalcula solo");
if (!(await p.evaluate(() => !!document.querySelector('#hk-acceso .ar-g.abierto[data-g="cargas"], #hk-acceso .ar-g.abierto')?.textContent.includes("CARGAS")))) await clic("#hk-acceso .ar-gt", "CARGAS"); else await foto(4);
const cargas = await p.evaluate(() => [...document.querySelectorAll("#hk-acceso .ar-g.abierto .ar-f")].map((f) => f.textContent.trim().slice(0, 30)));
console.log("cargas", cargas);
const ex = cargas.find((t) => /Ex|sismo|Fx/i.test(t)) ?? cargas[1];
if (ex) { await campo("Ex sismo", 150); await p.evaluate(() => { window.__hekatanSettings().deformScale.val = 150; }); await espera(1200); await foto(6); }
await rotulo("2 · DIMENSIONES (Alt+2): pisos, luces, secciones"); await clic("#hk-acceso .ar-gt", "DIMENSIONES");
await campo("N. Pisos", 5);
await rotulo("3 · RESULTADOS (Alt+3): un clic y se abre la ventana"); await clic("#hk-acceso .ar-gt", "RESULTADOS");
await clic("#hk-acceso button", "Deriva de piso"); await espera(4000); await foto(10);
await rotulo("📌 fija un grupo · ＋ elegir mandos · Alt+Q oculta el panel"); await foto(8);
console.log("fotos", k); await b.close();
