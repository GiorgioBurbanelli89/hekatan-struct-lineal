// GIF «cómo se usa» del Steady State (o del PSD) en Struct (interfaz real).
//   node cli/_gif_caso_estacionario.mjs [BASE] [DIR] [ss|psd]
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const MODO = process.argv[4] ?? "ss";
const DIR = process.argv[3] ?? `cli/shots/gif_${MODO}`; mkdirSync(DIR, { recursive: true });
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
    .filter(([l, v]) => /SAP2000/.test(v) && l && !/Hekatan Struct:/.test(v));
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

await pag.goto(`${BASE}/workspace/?t=estacionario-sap2000`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
if (MODO === "psd") await pag.evaluate(() => window.__hekatanSetParam("caso", 1));
await espera(1500);
if (MODO === "ss") {
  await rotulo("1 · Pórtico 3D con masa · carga armónica 20 kN en X + 2 kN en Y que vibra p·cos ωt"); await foto(2600);
  await rotulo("2 · Steady State: módulo |ux| contra f · Hekatan Struct (línea) y SAP2000 24 (puntos)"); await foto(3000);
  await lateral("der", "3 · Abrir el panel derecho (parámetros del ejemplo)");
  await graficaAlLado(350); await carpeta("Caso"); await espera(600);
  await parametro("Gráfica", "graf", 1, "4 · Gráfica = Fase (°) = atan2(Im, Re): cae a −90° y −180° al pasar cada resonancia", 3000);
  await parametro("Gráfica", "graf", 2, "5 · Parte real Re (en fase con la carga, cos ωt)", 2400);
  await parametro("Gráfica", "graf", 3, "6 · Parte imaginaria Im (a 90°, sin ωt): el amortiguamiento dK = 0.04", 2400);
  await parametro("Carga", "carga", 1, "7 · Carga = aceleración en la base X (1 m/s²): el sismo armónico", 2600);
  await pag.evaluate(() => window.__hekatanSetParam("graf", 0)); await espera(1500);
  await sinCursor(); await tabla("📊 Calculados: Hekatan Struct · SAP2000 24 (40 frecuencias)");
  await rotulo("8 · 📊 Calculados: módulo, Re, Im y fase = SAP2000 (0.0000 %)"); await foto(4200); await sinTabla();
  await pag.evaluate(() => window.__hekatanSetParam("carga", 0)); await espera(1500);
  await lateral("cerrar", "9 · Cerrar los parámetros"); await graficaAlLado(12);
  await lateral("izq", "9 · Settings (panel izquierdo): el mismo cálculo sobre CUALQUIER modelo");
  await pulsar(".tp-fldv_t", "Estado estacionario / PSD", "10 · 〜 Estado estacionario / PSD (lineal)");
  await pulsar("button", "Calcular estado estacionario", "11 · ▶ Calcular: barrido de 0.5 a 20 Hz con las cargas del caso aplicado", 1500);
  await espera(800); await sinCursor(); await rotulo("12 · Pico = resonancia (cerca de una frecuencia propia)"); await foto(2600);
  await pulsar("button", "Animar a esa frecuencia", "13 · 🎞 Animar a la frecuencia del pico: u(t) = Re·cos ωt + Im·sin ωt", 1300);
  await sinCursor(); await rotulo("14 · La deformada vibra a 12.79 Hz (amplificada): u(t) = Re·cos ωt + Im·sin ωt");
  await pag.evaluate(() => { const c = [...document.querySelectorAll("canvas")].map((k) => { let p = k; while (p && getComputedStyle(p).position !== "fixed") p = p.parentElement; return p; }).find((p) => p && /Estado estacionario/.test(p.textContent)); if (c) c.style.display = "none"; });
  for (let k = 0; k < 8; k++) { await espera(260); await foto(260); }
  await pag.evaluate(() => window.__hekatanEstacionario?.parar?.(true));
} else {
  await rotulo("1 · PSD: la misma respuesta armónica, con una carga ALEATORIA de espectro S(f)"); await foto(2800);
  await rotulo("2 · √PSD de ux = |a(f)| con f(ω) = √S · Hekatan Struct (línea) y SAP2000 24 (puntos)"); await foto(3000);
  await lateral("der", "3 · Abrir el panel derecho (parámetros del ejemplo)");
  await graficaAlLado(350); await carpeta("Caso"); await espera(600);
  await parametro("Componente", "comp", 1, "4 · Componente uy", 2600);
  await pag.evaluate(() => window.__hekatanSetParam("comp", 0)); await espera(1500);
  await sinCursor(); await tabla("📊 Calculados: Hekatan Struct · SAP2000 24");
  await rotulo("5 · RMS = √∫ PSD df (trapecio) = SAP2000 (0.0000 %)"); await foto(4200); await sinTabla();
  await lateral("cerrar", "6 · Cerrar los parámetros"); await graficaAlLado(12);
  await lateral("izq", "6 · Settings (panel izquierdo): el mismo cálculo sobre CUALQUIER modelo");
  await pulsar(".tp-fldv_t", "Estado estacionario / PSD", "7 · 〜 Estado estacionario / PSD: Tipo de caso = Power Spectral Density");
  await pag.evaluate(() => { const h = window.__hekatanEstacionario; h.params.tipo = 1; h.refrescar(); });
  await espera(500);
  await pulsar("button", "Calcular estado estacionario", "8 · PSD f:S (Hz : carga²/Hz) y ▶ Calcular: √PSD y RMS del nudo de control", 1500);
  await espera(800); await sinCursor(); await rotulo("9 · RMS en mm: el valor esperado (fatiga, vibraciones de equipos)"); await foto(3200);
}
writeFileSync(`${DIR}/dur.json`, JSON.stringify(dur)); console.log(n, "fotogramas", JSON.stringify(dur));
await nav.close();
