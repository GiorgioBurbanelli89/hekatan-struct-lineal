// Capturas del PDF «Ejemplos paso a paso de muros» (sitio público). node cli/_ejemplos_muros_capturas.mjs <dir>
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const DIR = process.argv[2], BASE = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const abrir = (txt, cerrarOtras = false) => pag.evaluate((txt, c) => {
  const ts = [...document.querySelectorAll(".tp-fldv_t")];
  if (c) for (const t of ts) { const f = t.closest(".tp-fldv"); if (f.classList.contains("tp-fldv-expanded") && !t.innerText.includes(txt) && f.closest("#parameters")) t.click(); }
  const t = ts.find((e) => e.innerText.includes(txt)); if (!t) return false; const f = t.closest(".tp-fldv");
  if (!f.classList.contains("tp-fldv-expanded")) t.click(); t.scrollIntoView({ block: "start" }); return true; }, txt, cerrarOtras);
const R = (tipo, txt) => pag.evaluate((tipo, txt) => {
  let e = null;
  if (tipo === "fila") e = [...document.querySelectorAll(".tp-lblv")].filter((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim().replace(/\s+/g, " ").startsWith(txt)).find((x) => x.getBoundingClientRect().width);
  else if (tipo === "carpeta") e = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes(txt) && x.getBoundingClientRect().width);
  else if (tipo === "boton") e = [...document.querySelectorAll(".tp-btnv_b, button")].find((x) => x.innerText.includes(txt) && x.getBoundingClientRect().width);
  else if (tipo === "id") e = document.getElementById(txt);
  else if (tipo === "lienzo") e = [...document.querySelectorAll("canvas")].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  if (!e) return null; const r = e.getBoundingClientRect(); if (!r.width) return null;
  if (tipo === "lienzo") return [r.left + r.width * 0.3, r.top + r.height * 0.15, r.left + r.width * 0.7, r.top + r.height * 0.85];
  return [r.left, r.top, r.right, r.bottom];
}, tipo, txt);
const datos = { marcas: {}, calc: {} };
const foto = async (n, marcas = []) => { const m = []; for (const [tipo, txt, etq] of marcas) { const r = await R(tipo, txt); if (r) m.push({ r, etq }); else console.log("  sin marca:", n, txt); }
  await pag.screenshot({ path: `${DIR}/${n}.png` }); datos.marcas[n] = m; console.log("foto", n, m.length); };
const ir = async (id, p) => { const q = p ? `&p=${Buffer.from(JSON.stringify(p)).toString("base64")}` : ""; await pag.goto(`${BASE}/workspace/?t=${id}${q}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(8000);
  await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; if (p) for (const k in p) p[k].val = false; const s = window.__hekatanSettings(); s.loads.val = true; s.supports.val = true; }); await espera(800); };
const campo = async (v) => { await pag.evaluate((v) => { const s = window.__hekatanSettings(); s.shellResults.val = v; s.loads.val = false; }, v); await espera(1200); };
const calculados = () => pag.evaluate(() => { const f = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes("Calculados"))?.closest(".tp-fldv"); if (!f) return {};
  const o = {}; for (const r of f.querySelectorAll(".tp-lblv")) o[r.querySelector(".tp-lblv_l")?.innerText.trim()] = r.querySelector("input,textarea")?.value ?? r.innerText; return o; });
const alzado = () => pag.evaluate(() => { const v = [...document.querySelectorAll("div")].find((d) => d.__ctx); const { camera: c, controls: t, render } = v.__ctx; c.up.set(0, 0, 1); const d = c.position.distanceTo(t.target); c.position.set(t.target.x, t.target.y - d, t.target.z); c.lookAt(t.target); t.update(); render(); });

// ── 1. Muro de contención de Manabí, cáscara 3D, sísmico ──
await ir("muro-manabi", { modelo: 1, caso: 1 }); datos.url_manabi = pag.url();
await foto("m1_abrir", [["fila", "Modelo", "Panel derecho › Modelo = Cáscara 3D"], ["fila", "Caso", "Caso = Sísmico (Mononobe-Okabe)"], ["fila", "longitud de muro L", "tramo de muro L = 1 m"]]);
await abrir("Geometría", true); await espera(500);
await foto("m2_geometria", [["carpeta", "Geometría", "Panel derecho › Geometría"], ["fila", "alto del fuste", "Hf = 2.60 m"], ["fila", "puntera", "puntera 0.70 m"], ["fila", "talón", "talón 1.90 m"], ["fila", "canto de la zapata", "zapata 0.40 m"]]);
await abrir("Hormigón", true); await abrir("Relleno"); await abrir("Sismo"); await espera(500);
await foto("m3_relleno_sismo", [["carpeta", "Hormigón", "Hormigón: E, ν, γc = 23 kN/m³ (peso propio)"], ["carpeta", "Relleno", "Relleno: γ = 18.5, φ = 30°, δ = 20°"], ["carpeta", "Sismo", "Sismo NEC: kh = 0.336"]]);
await abrir("Terreno", true); await espera(500);
await foto("m4_terreno", [["carpeta", "Terreno", "Panel derecho › Terreno"], ["fila", "módulo de balasto", "ks = 6.59 kg/cm³ = 64 626 kN/m³"], ["fila", "horizontal", "suelo lateral: muelles en x"]]);
await abrir("Calculados", true); await espera(800); datos.calc.manabi = await calculados();
await foto("m5_calculados", [["carpeta", "Calculados", "Panel derecho › 📊 Calculados"], ["fila", "Ka (Coulomb)", "Ka y Kae calculados"], ["fila", "Empuje estático", "empuje = ½·Ka·γ·H²"], ["fila", "Sismo (incremento", "incremento M-O + inercia"]]);
await alzado(); await espera(900);
await foto("m6_cargas_alzado", [["lienzo", "", "Flechas = cargas en los nudos (empuje en la pantalla, relleno sobre el talón)"]]);
await campo("bendingYY"); await foto("m7_m22", [["fila", "Resultados de cáscara", "Panel izquierdo (Settings) › Resultados de cáscara: M22"]]);
await abrir("Corte de sección"); await espera(500);
datos.corte_manabi = await pag.evaluate(() => { const c = window.__hekatanCorte; c.params.eje = 2; c.params.pos = 0.45; c.calcular(); return c.params.info; }); await espera(800);
await foto("m8_corte", [["carpeta", "Corte de sección", "Panel izquierdo › ✂ Corte de sección"], ["fila", "pos (m)", "Plano Z = 0.45 m (arranque de la pantalla)"], ["id", "hk-corte-panel", "Fuerza y momento TOTALES en el corte"]]);
await pag.evaluate(() => document.getElementById("hk-corte-panel")?.remove());
await foto("m9_exportar", [["boton", "Exportar", "Barra de arriba › Exportar: SAP2000 .s2k / ETABS .e2k"], ["boton", "Compartir", "Compartir: copia el enlace con este modelo"]]);

// ── 2. Muro de corte Q4 ──
await ir("muro-q4"); datos.url_q4 = pag.url();
await abrir("Geometría", true); await abrir("Sección"); await abrir("Malla"); await espera(400);
await foto("q1_datos", [["carpeta", "Geometría", "Panel derecho › Geometría: W = 3 m, H = 5 m"], ["fila", "espesor", "espesor 0.25 m"], ["fila", "nx", "malla nx × nz = 6 × 12"]]);
await abrir("Cargas", true); await alzado(); await espera(700);
await foto("q2_carga", [["fila", "F lateral", "Panel derecho › Cargas › F lateral = 200 kN"], ["lienzo", "", "F repartida en los 7 nudos de arriba (esquinas la mitad)"]]);
await campo("membraneYY"); await foto("q3_f22", [["fila", "Resultados de cáscara", "Settings › Resultados de cáscara: F22 (vertical)"]]);
await abrir("Corte de sección"); await espera(500);
datos.corte_q4 = await pag.evaluate(() => { const c = window.__hekatanCorte; c.params.eje = 2; c.params.pos = 0.2; c.calcular(); return c.params.info; }); await espera(800);
await foto("q4_corte", [["fila", "pos (m)", "Corte Z = 0.2 m (la base)"], ["id", "hk-corte-panel", "V = 200 kN y M = F·(H − 0.2): equilibrio"]]);

// ── 3. Edificio con muros ──
await ir("edificio-con-muros"); datos.url_edif = pag.url();
await abrir("Cargas", true); await espera(500);
await foto("e1_cargas", [["carpeta", "Cargas", "Panel derecho › Cargas"], ["fila", "CM (kN/nodo)", "CM = −5 kN en cada nudo de piso"], ["fila", "CV (kN/nodo)", "CV = −2 kN en cada nudo de piso"], ["fila", "Ex sismo tope", "Ex = 50 kN en el tope"], ["fila", "Caso de carga", "Caso: Combinada / CM / CV / Ex / combinaciones"]]);
await abrir("Avanzado", true); await espera(500);
await foto("e2_muros", [["fila", "Muros de corte (cáscara)", "Avanzado › Muros de corte: en X e Y"]]);
await campo("membraneYY"); await foto("e3_f22", [["fila", "Resultados de cáscara", "Settings › Resultados de cáscara: F22 en los muros"]]);
datos.errores = errores;
writeFileSync(`${DIR}/datos.json`, JSON.stringify(datos, null, 1)); console.log(JSON.stringify({ calc: datos.calc, c1: datos.corte_manabi, c2: datos.corte_q4, errores }, null, 1));
await nav.close();
