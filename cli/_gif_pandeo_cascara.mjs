// GIF «cómo se usa» del PANDEO DE MUROS Y LOSAS (Buckling de cáscaras) en Struct (interfaz real).
//   node cli/_gif_pandeo_cascara.mjs [BASE] [DIR]
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/gif_pandeo_cascara"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0; const dur = [];
const foto = async (ms = 1200) => { await pag.screenshot({ path: `${DIR}/frame_${String(n).padStart(2, "0")}.png` }); dur.push(ms); n++; };
const rotulo = (t) => pag.evaluate((t) => {
  let d = document.getElementById("__rot"); if (!d) { d = document.createElement("div"); d.id = "__rot"; document.body.appendChild(d); }
  Object.assign(d.style, { position: "fixed", left: "50%", bottom: "62px", transform: "translateX(-50%)", zIndex: 99999, background: "rgba(0,0,0,.85)",
    color: "#fff", font: "600 19px Segoe UI, sans-serif", padding: "10px 22px", borderRadius: "10px", border: "1px solid #8b5cf6", pointerEvents: "none", maxWidth: "1200px", textAlign: "center" });
  d.textContent = t;
}, t);
const SVG = "<svg width=\"34\" height=\"34\" viewBox=\"0 0 24 24\"><path d=\"M3 2l7 19 2.5-7.5L20 11z\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"1.4\"/></svg>";
const cursor = (x, y) => pag.evaluate((x, y, svg) => {
  let c = document.getElementById("__cur"); if (!c) { c = document.createElement("div"); c.id = "__cur"; document.body.appendChild(c); c.innerHTML = svg; }
  Object.assign(c.style, { position: "fixed", left: x + "px", top: y + "px", zIndex: 100000, pointerEvents: "none" });
}, x, y, SVG);
const sinCursor = () => pag.evaluate(() => document.getElementById("__cur")?.remove());
const caja = (sel, txt) => pag.evaluate((sel, txt) => {
  const e = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(txt) && e.getBoundingClientRect().width > 0);
  if (!e) return null; e.scrollIntoView({ block: "center" }); const b = e.getBoundingClientRect(); return { x: b.x + Math.min(b.width / 2, 60), y: b.y + b.height / 2 };
}, sel, txt);
const pulsar = async (sel, txt, t, ms = 1300) => {
  if (!(await caja(sel, txt))) { console.log("no encontré", txt); return false; }
  await espera(300); const c = await caja(sel, txt); await cursor(c.x, c.y); if (t) await rotulo(t); await foto(ms);
  await pag.mouse.click(c.x, c.y); await espera(900); return true;
};
// señala la fila de un parámetro (panel derecho) y lo cambia por el gancho de la app (= elegir en la lista)
const parametro = async (etq, clave, valor, t, ms = 1500) => {
  const c = await pag.evaluate((etq) => {
    const e = [...document.querySelectorAll(".tp-lblv")].find((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() === etq && e.getBoundingClientRect().width > 0);
    if (!e) return null; e.scrollIntoView({ block: "center" }); const v = e.querySelector(".tp-lblv_v") ?? e; const b = v.getBoundingClientRect(); return { x: b.x + 30, y: b.y + b.height / 2 };
  }, etq);
  if (c) await cursor(c.x, c.y); else console.log("no encontré el parámetro", etq);
  await rotulo(t); await foto(900);
  await pag.evaluate((k, v) => window.__hekatanSetParam(k, v), clave, valor); await espera(2200); await foto(ms);
};
const tabla = (titulo) => pag.evaluate((titulo) => {
  document.getElementById("__tabla")?.remove();
  const filas = [...document.querySelectorAll(".tp-lblv")].map((e) => [(e.querySelector(".tp-lblv_l")?.textContent ?? "").trim(), e.querySelector("input,textarea")?.value ?? ""])
    .filter(([l, v]) => /SAP2000|Timoshenko/.test(v + l) && l && !/Hekatan Struct:/.test(v) && !/^Referencia/.test(l));
  const d = document.createElement("div"); d.id = "__tabla"; const NL = String.fromCharCode(10);
  Object.assign(d.style, { position: "fixed", left: "40px", top: "120px", zIndex: 99998, background: "rgba(10,10,18,.95)", color: "#eee",
    font: "15px Consolas, monospace", padding: "14px 18px", borderRadius: "10px", border: "1px solid #8b5cf6", whiteSpace: "pre" });
  d.textContent = titulo + NL + NL + filas.map(([l, v]) => l.padEnd(28) + v).join(NL);
  document.body.appendChild(d);
}, titulo);
// botón lateral: "izq" = el ⟩ pegado al borde izquierdo (Settings), "der" = el ⟨ del borde derecho (parámetros)
const lateral = async (lado, t) => {
  const c = await pag.evaluate((lado) => { const b = [...document.querySelectorAll("button")].filter((x) => (lado === "cerrar" ? /^⟩$/ : /^[⟨⟩]$/).test(x.textContent.trim()))
    .map((x) => x.getBoundingClientRect()).find((r) => r.width > 0 && (lado === "izq" ? r.x < 50 : lado === "cerrar" ? r.x > 100 : r.x > innerWidth - 60)); return b && { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, lado);
  if (!c) { console.log("no encontré el botón", lado); return; }
  await cursor(c.x, c.y); await rotulo(t); await foto(1300); await pag.mouse.click(c.x, c.y); await espera(1000);
};
// abre (si está cerrada) la carpeta de Tweakpane con ese título EXACTO
const carpeta = (txt) => pag.evaluate((txt) => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.textContent.trim() === txt && e.getBoundingClientRect().width > 0);
  if (!t) return false; const f = t.closest(".tp-fldv"); if (f && !f.classList.contains("tp-fldv-expanded")) t.click(); return true; }, txt);
// la gráfica a la izquierda del panel derecho (para que no lo tape)
const graficaAlLado = (der) => pag.evaluate((der) => { const c = [...document.querySelectorAll("canvas")].map((k) => { let p = k; while (p && getComputedStyle(p).position !== "fixed") p = p.parentElement; return p; })
  .find((p) => p && /Steady State|PSD/.test(p.textContent)); if (c) Object.assign(c.style, { right: der + "px", left: "auto", top: "70px" }); }, der);
const sinTabla = () => pag.evaluate(() => document.getElementById("__tabla")?.remove());

await pag.goto(`${BASE}/workspace/?t=pandeo-cascara-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
const verY = (y) => pag.evaluate((y) => { const s = window.__hekatanSettings?.(); if (s?.shellResults) s.shellResults.val = y ? "displacementY" : "displacementZ"; }, y);
await rotulo("1 · Placa 2 × 1 m, t = 10 mm, simplemente apoyada y comprimida q = 100 kN/m en x = 0 y x = a"); await foto(2800);
await rotulo("2 · La deformada ES la forma de pandeo del modo 1: dos medias ondas (a/b = 2), como Timoshenko"); await foto(2800);
await lateral("der", "3 · Abrir el panel derecho (parámetros del ejemplo)");
await carpeta("Modelo"); await carpeta("Malla"); await carpeta("Pandeo"); await espera(600);
await sinCursor(); await tabla("📊 Calculados: λ de Hekatan Struct · SAP2000 24 (misma malla 16×8) · Timoshenko");
await rotulo("4 · λ = factor que multiplica q hasta pandear: Struct = SAP2000 en los 6 modos (0.0000 %)"); await foto(4200); await sinTabla();
await parametro("Modo que se dibuja", "modo", 2, "5 · Modo que se dibuja = 2: tres medias ondas", 2600);
await parametro("Malla nx", "nx", 4, "6 · Malla gruesa 4 × 2: el λ cambia (9.0629) y SAP2000 da lo mismo con su misma malla", 900);
await pag.evaluate(() => window.__hekatanSetParam("ny", 2)); await pag.evaluate(() => window.__hekatanSetParam("modo", 1)); await espera(2200);
await sinCursor(); await tabla("📊 Calculados: malla 4×2"); await rotulo("6 · Malla 4 × 2: λ₁ = 9.0629 = SAP2000; Timoshenko 7.2305 (malla gruesa: +25 %)"); await foto(3600); await sinTabla();
await parametro("Caso", "tipo", 1, "7 · Caso = Muro ménsula 2 × 3 m, t = 15 cm, 1000 kN/m en la cabeza", 900);
await verY(1); await espera(1500); await foto(2600);
await sinCursor(); await tabla("📊 Calculados: muro 8×12 (Shell-Thin)"); await rotulo("8 · Muro: pandea fuera de su plano (Y); λ₁ = 16.1342 = SAP2000"); await foto(4000); await sinTabla();
await parametro("Caso", "tipo", 2, "9 · Caso = Losa 4 × 4 m en CORTANTE puro (τ·t = 100 kN/m), Timoshenko k = 9.34", 900);
await verY(0); await espera(1500); await foto(2600);
await sinCursor(); await tabla("📊 Calculados: losa 12×12 en cortante"); await rotulo("10 · Cortante: ±λ (con el cortante al revés pandea igual); = SAP2000"); await foto(4200); await sinTabla();
await pag.evaluate(() => window.__hekatanSetParam("tipo", 1)); await verY(1); await espera(2500);
await lateral("cerrar", "11 · Volvemos al muro y cerramos los parámetros");
await lateral("izq", "11 · Settings (panel izquierdo): el mismo cálculo sobre CUALQUIER modelo con barras o cáscaras");
await pulsar(".tp-fldv_t", "⟂ Pandeo (lineal)", "12 · ⟂ Pandeo (lineal)");
await pulsar("button", "Calcular pandeo", "13 · ▶ Calcular: r = las cargas del caso aplicado; G de la cáscara con su membrana", 1600);
await espera(600); await sinCursor(); await rotulo("14 · λ de cada modo en el panel (los mismos del ejemplo)"); await foto(2800);
await pulsar("button", "Animar el modo de pandeo", "15 · 🎞 Animar el modo de pandeo", 1300);
await sinCursor(); await rotulo("16 · Modo 1 del muro: se dobla fuera de su plano (λ₁ = 16.13: aguanta 16 veces la carga)");
for (let k = 0; k < 10; k++) { await espera(230); await foto(230); }
await pag.evaluate(() => window.__hekatanPandeo?.parar?.(true));
writeFileSync(`${DIR}/dur.json`, JSON.stringify(dur)); console.log(n, "fotogramas", JSON.stringify(dur));
await nav.close();
