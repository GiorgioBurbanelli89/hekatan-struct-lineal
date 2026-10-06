// GIF «cómo se usa» del Hyperstatic en Struct (interfaz real): Tipos de caso → 🔩 Hyperstatic → ▶ Calcular → secundario
//   → 📊 Calculados contra SAP2000.  node cli/_gif_caso_hiperestatico.mjs [BASE] [DIR]
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/gif_hiper"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0; const dur = [];
const foto = async (ms = 1200) => { await pag.screenshot({ path: `${DIR}/frame_${String(n).padStart(2, "0")}.png` }); dur.push(ms); n++; };
const rotulo = (t) => pag.evaluate((t) => {
  let d = document.getElementById("__rot"); if (!d) { d = document.createElement("div"); d.id = "__rot"; document.body.appendChild(d); }
  Object.assign(d.style, { position: "fixed", left: "50%", bottom: "62px", transform: "translateX(-50%)", zIndex: 99999, background: "rgba(0,0,0,.82)",
    color: "#fff", font: "600 19px Segoe UI, sans-serif", padding: "10px 22px", borderRadius: "10px", border: "1px solid #8b5cf6", pointerEvents: "none", maxWidth: "1200px", textAlign: "center" });
  d.textContent = t;
}, t);
const cursor = (x, y) => pag.evaluate((x, y) => {
  let c = document.getElementById("__cur"); if (!c) { c = document.createElement("div"); c.id = "__cur"; document.body.appendChild(c);
    c.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#000" stroke-width="1.4"/></svg>'; }
  Object.assign(c.style, { position: "fixed", left: x + "px", top: y + "px", zIndex: 100000, pointerEvents: "none" });
}, x, y);
const caja = (sel, txt) => pag.evaluate((sel, txt) => {
  const e = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(txt) && e.getBoundingClientRect().width > 0);
  if (!e) return null; e.scrollIntoView({ block: "center" }); const b = e.getBoundingClientRect(); return { x: b.x + Math.min(b.width / 2, 60), y: b.y + b.height / 2 };
}, sel, txt);
const pulsar = async (sel, txt, t, ms = 1300) => {
  if (!(await caja(sel, txt))) { console.log("no encontré", txt); return; }
  await espera(300); const c = await caja(sel, txt); await cursor(c.x, c.y); if (t) await rotulo(t); await foto(ms);
  await pag.mouse.click(c.x, c.y); await espera(900);
};
const arriba = (txt) => pag.evaluate((txt) => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.textContent.includes(txt)); t?.scrollIntoView({ block: "start" }); }, txt);
await pag.goto(`${BASE}/workspace/?t=hiperestatico-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
await rotulo("1 · Viga continua 2 × 20 m con las cargas equivalentes del tendón (caso base)"); await foto(2400);
await pulsar("button", "⟩", "2 · Abrir Settings (panel izquierdo)");
await pulsar(".tp-fldv_t", "Tipos de caso", "3 · 📋 Tipos de caso (SAP2000): elegir «Hyperstatic»");
await pag.evaluate(() => window.__hekatanTiposCaso.elegir(12)); await arriba("Tipos de caso"); await espera(400); await foto(2200);
await pulsar(".tp-fldv_t", "Hyperstatic (secundarios", "4 · 🔩 Hyperstatic: el caso base = las cargas del caso aplicado");
await arriba("Hyperstatic (secundarios"); await espera(300); await foto(1800);
await pulsar("button", "Calcular Hyperstatic", "5 · ▶ Calcular: la viga SIN apoyos cargada con las reacciones del base");
await arriba("Hyperstatic (secundarios"); await espera(1500); await pag.evaluate(() => { const c = document.getElementById("__cur"); if (c) c.remove(); });
await rotulo("6 · Reacciones del base (ΣF = 0) y momento SECUNDARIO; deformada sin sólido rígido"); await foto(3400);
await pulsar("button", "⟨", "7 · Abrir el panel derecho");
await pag.evaluate(() => {
  const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.textContent.includes("Calculados")); t?.scrollIntoView({ block: "start" });
  const filas = [...document.querySelectorAll(".tp-lblv")].map((e) => [(e.querySelector(".tp-lblv_l")?.textContent ?? "").trim(), e.querySelector("input,textarea")?.value ?? ""])
    .filter(([l, v]) => /SAP2000/.test(v) && l);
  const d = document.createElement("div"); d.id = "__tabla"; const NL = String.fromCharCode(10);
  Object.assign(d.style, { position: "fixed", left: "330px", top: "150px", zIndex: 99998, background: "rgba(10,10,18,.94)", color: "#eee",
    font: "16px Consolas, monospace", padding: "14px 18px", borderRadius: "10px", border: "1px solid #8b5cf6", whiteSpace: "pre" });
  d.textContent = "📊 Calculados (panel derecho): Hekatan Struct · SAP2000" + NL + NL + filas.map(([l, v]) => l.padEnd(27) + v).join(NL);
  document.body.appendChild(d); const c = document.getElementById("__cur"); if (c) c.remove();
});
await rotulo("8 · 📊 Calculados: Hyperstatic de Hekatan Struct = SAP2000 (0.0000 %)"); await espera(500); await foto(4200);
console.log(JSON.stringify(dur));
await nav.close();
