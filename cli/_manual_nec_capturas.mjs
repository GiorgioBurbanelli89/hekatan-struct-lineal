// Capturas del MANUAL «Análisis sísmico estático y dinámico del edificio del artículo» (sitio público, teclado y clics
// reales en el Tweakpane, los mismos pasos que serie_curso_csi/nec_articulo.py). Guarda PNG + rectángulos de cada
// control para anotar (recuadros, círculos, flechas).   node cli/_manual_nec_capturas.mjs <dir>
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const DIR = process.argv[2], BASE = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const W = "#hk-nec-panel";

const abrir = (txt) => pag.evaluate((txt) => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.innerText.includes(txt)); if (!t) return false;
  const f = t.closest(".tp-fldv"); if (!f.classList.contains("tp-fldv-expanded")) t.click(); t.scrollIntoView({ block: "start" }); return true; }, txt);
const fila = (etq) => pag.evaluateHandle((etq) => [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText.trim().replace(/\s+/g, " ").startsWith(etq) && x.getBoundingClientRect().width), etq);
const poner = async (etq, v) => {
  const el = (await fila(etq)).asElement(); if (!el) { console.log("  sin fila", etq); return; }
  await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
  const s = await el.$("select");
  if (s) { const val = await s.evaluate((s, v) => { const o = [...s.options].find((o) => o.text.includes(String(v)) || o.value === String(v)); return o?.value; }, v); if (val !== undefined) await s.select(val); }
  else { const i = await el.$("input"); await i.click({ clickCount: 3 }); await pag.keyboard.type(String(v)); await pag.keyboard.press("Enter"); }
  await espera(700);
};
const boton = async (txt) => { const h = await pag.evaluateHandle((txt) => [...document.querySelectorAll(".tp-btnv_b, button")].find((x) => x.innerText.includes(txt) && x.getBoundingClientRect().width), txt);
  const e = h.asElement(); await e.evaluate((x) => x.scrollIntoView({ block: "center" })); await e.click(); };
const R = (tipo, txt) => pag.evaluate((tipo, txt) => {
  let e = null;
  if (tipo === "fila") e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim().replace(/\s+/g, " ").startsWith(txt) && x.getBoundingClientRect().width);
  else if (tipo === "carpeta") e = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes(txt) && x.getBoundingClientRect().width);
  else if (tipo === "boton") e = [...document.querySelectorAll(".tp-btnv_b, button")].find((x) => x.innerText.includes(txt) && x.getBoundingClientRect().width);
  else if (tipo === "b") e = [...document.querySelectorAll("#hk-nec-panel b")].find((x) => x.innerText.includes(txt));
  else e = document.querySelector(txt);
  if (!e) return null; const r = e.getBoundingClientRect(); if (!r.width) return null;
  return [r.left, r.top, Math.min(r.right, innerWidth - 2), Math.min(r.bottom, innerHeight - 2)];
}, tipo, txt);
const datos = { marcas: {}, res: {} };
// marca: [tipo, txt, etiqueta, forma] — forma "caja" (defecto) o "circulo"
const foto = async (n, marcas = []) => { const m = []; for (const [tipo, txt, etq, forma] of marcas) { const r = await R(tipo, txt); if (r) m.push({ r, etq, forma: forma ?? "caja" }); else console.log("  sin marca:", n, txt); }
  await pag.screenshot({ path: `${DIR}/${n}.png` }); datos.marcas[n] = m; console.log("foto", n, m.length); };
const res = () => pag.evaluate(() => { const n = window.__hekatanNEC; return n.params.info; });
const celda = (fila, col) => `${W} tbody tr:${fila} td:nth-child(${col})`;
const ag = (t, f, c) => `${W} table:nth-of-type(${t}) tr:nth-child(${f}) td:nth-child(${c})`;

const P = Buffer.from(JSON.stringify({ ms: 1.0 })).toString("base64");
await pag.goto(`${BASE}/workspace/?t=test-m-dual&p=${P}&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
datos.url = pag.url();

// ── ESTÁTICO ─────────────────────────────────────────────────────────────────────────────────────────────────
await abrir("Geometría"); await abrir("Muros de corte"); await espera(600);
await foto("e01_modelo", [["fila", "Malla shell", "Panel derecho › Geometría › malla 1.0 m"], ["fila", "N° de muros", "N° de muros = 1"],
  ["fila", "Muro 1 · dirección", "muro ⟂X en el eje x = 0"]]);
await abrir("Sismo NEC"); await abrir("Sitio ("); await espera(500);
for (const [k, v] of [["Z", 0.4], ["Fa", 1.0], ["Fd", 1.6], ["Fs", 1.9], ["r", 1.5]]) await poner(k, v);
await poner("Ta (Ct, α)", "con muros"); await poner("Inercias agrietadas", "sí"); await abrir("Sitio ("); await espera(500);
await foto("e02_sitio", [["carpeta", "Sismo NEC", "Panel izquierdo › 🌎 Sismo NEC"], ["fila", "Norma", "NEC-15 (oficial)"], ["fila", "Z", "Z = 0.40 (zona V)"],
  ["fila", "Fa", "suelo E: Fa 1.0 · Fd 1.6 · Fs 1.9"], ["fila", "η (NEC-15)", "Costa: η = 1.80"], ["fila", "r", "r = 1.5 (suelo E)"]]);
await abrir("Irregularidades (autom"); await espera(500);
await foto("e03_opciones", [["fila", "R", "R = 8"], ["fila", "Ta (Ct, α)", "dual: Ct 0.055, α 0.75 → φE = 1"], ["fila", "Irregular (85 %)", "auto: lo decide la detección"],
  ["fila", "Inercias agrietadas", "vigas 0.5 · columnas 0.8 · muros 0.6 Ig"], ["carpeta", "Irregularidades (autom", "cada tipo: auto / sí / no"]]);
await boton("▶ Calcular NEC"); await espera(4000); datos.res.e04 = await res();
await foto("e04_estatico", [["b", "Estático", "Ta → T, Sa, W y V estático", "caja"], ["b", "Irregularidades", "P1 torsional detectada → φP 0.90"],
  [ "sel", celda("nth-child(2)", 13), "Δmax/Δprom = 1.83 > 1.2", "circulo"], ["sel", celda("nth-child(2)", 10), "ΔM X ≤ 2 %", "circulo"]]);
await pag.evaluate(() => document.querySelector("#hk-nec-panel svg")?.scrollIntoView({ block: "end" })); await espera(500);
await foto("e05_planta", [["sel", `${W} svg`, "Planta: ● CM y ✚ CR por piso; CR pegado al muro (e ≈ 4.1 m)"]]);
await boton("🧮 Matriz de piso"); await espera(3000); datos.res.e06 = await res();
await pag.evaluate(() => document.querySelector("#hk-nec-panel").scrollTop = 0); await espera(300);
await foto("e06_aguiar", [["sel", ag(1, 2, 6), "K_yθ ≠ 0: Y acoplado con el giro", "circulo"], ["sel", ag(1, 5, 10), "ρ_y = 0.88 → torsión", "circulo"],
  ["sel", ag(1, 2, 8), "e_y = K_yθ/K_yy ≈ −4.2 m", "circulo"]]);
await pag.evaluate(() => document.querySelector("#hk-nec-panel").style.display = "none");
await abrir("Muros de corte"); await poner("N° de muros", 4); await espera(3000); await abrir("Muros de corte"); await espera(400);
for (const [k, v] of [["Muro 2 · vano inicial", 1], ["Muro 2 · ancho", 1], ["Muro 3 · vano inicial", 1], ["Muro 3 · ancho", 1], ["Muro 4 · ancho", 1]]) { await poner(k, v); await espera(1200); }
await pag.evaluate(() => document.querySelector('.tp-fldv_t') && [...document.querySelectorAll(".tp-lblv_l")].find((x) => x.innerText.includes("Muro 2 · dirección"))?.scrollIntoView({ block: "start" })); await espera(500);
await foto("e07_molinete", [["fila", "N° de muros", "N° de muros = 4"], ["fila", "Muro 2 · vano inicial", "muro 2: y = 0, vano 2"], ["fila", "Muro 3 · vano inicial", "muro 3: x = 10, vano 2"],
  ["fila", "Muro 4 · ancho", "muro 4: y = 10, vano 1"]]);
await abrir("Sismo NEC"); await boton("▶ Calcular NEC"); await espera(4000); datos.res.e08 = await res();
await foto("e08_sin_torsion", [["b", "Irregularidades", "ninguna → φP = φE = 1"], ["sel", celda("nth-child(2)", 13), "Δmax/Δprom = 1.07 ✓", "circulo"],
  ["sel", celda("first-child", 9), "CR = CM = (5, 5)", "circulo"]]);
await boton("🧮 Matriz de piso"); await espera(3000);
await pag.evaluate(() => document.querySelector("#hk-nec-panel").scrollTop = 0); await espera(300);
await foto("e09_aguiar_cero", [["sel", ag(1, 2, 6), "K_yθ = 0", "circulo"], ["sel", ag(1, 5, 10), "ρ = 0: sin torsión", "circulo"]]);

// ── DINÁMICO ─────────────────────────────────────────────────────────────────────────────────────────────────
await pag.evaluate(() => document.querySelector("#hk-nec-panel").style.display = "none");
await abrir("Sismo NEC"); await poner("N° de modos", 24); await boton("▶ Calcular NEC"); await espera(5000); datos.res.d01 = await res();
await foto("d01_modos_masa", [["fila", "N° de modos", "24 modos"], ["b", "Modos", "1-2 traslación, 3 giro"], ["b", "Masa participativa", "ΣUx = ΣUy = 93.4 % ≥ 90 %"]]);
await foto("d02_cqc", [["b", "Dinámico CQC", "Vdin/Vest = 77.5 % < 80 % → ×1.032"], ["sel", celda("last-child", 6), "Vx din escalado", "circulo"],
  ["sel", celda("last-child", 7), "Vy din escalado", "circulo"], ["sel", celda("nth-child(2)", 14), "Q ≤ 0.10: sin P-Δ", "circulo"]]);
await boton("🧮 Matriz de piso"); await espera(3000); await pag.evaluate(() => document.querySelector("#hk-nec-panel").scrollTop = 0); await espera(300);
await foto("d03_aguiar_T", [["sel", ag(2, 2, 2), "T reducido (12 GDL)", "circulo"], ["sel", ag(2, 2, 3), "T del modal completo", "circulo"]]);
await pag.evaluate(() => document.querySelector("#hk-nec-panel").style.display = "none");
await abrir("Sismo NEC"); await poner("Norma", "Borrador"); await abrir("Sitio (");
for (const [k, v] of [["Z", 0.4], ["Fa", 0.9], ["Fd", 1.52], ["Fs", 1.94], ["r", 1.2], ["R", 7]]) await poner(k, v);
await abrir("Borrador 2023"); await espera(400);
await foto("d04_borrador_datos", [["fila", "Norma", "Borrador NEC-SE-DS 2023"], ["fila", "Fa", "zona IV, suelo E: Fa 0.9 · Fd 1.52 · Fs 1.94"], ["fila", "R", "dual con muros especiales: R = 7"],
  ["fila", "Cd (Tabla 4.4)", "Cd = 5.5"], ["fila", "Deriva límite", "deriva ≤ 0.015"]]);
await boton("▶ Calcular NEC"); await espera(5000); datos.res.d05 = await res();
await foto("d05_borrador", [["b", "Estático", "T = Ta (Tabla 6.3) · Sa en la rama ascendente"], ["b", "Dinámico CQC", "mínimo 100 % → ×1.84"], ["b", "Deriva límite", "δ = Cd·δe/Ie ≤ 1.5 %"]]);

datos.errores = errores; writeFileSync(`${DIR}/datos.json`, JSON.stringify(datos, null, 1)); console.log("errores", errores.length); await nav.close();
