// Capturas del MANUAL v2 «Análisis estático y dinámico en Hekatan Struct» con la interfaz ACTUAL (2-oct-2026):
// panel de Acceso rápido (CARGAS / DIMENSIONES / RESULTADOS) y las ventanas limpias Estático / Dinámico / Deriva.
// Edificio del curso (plantillas tipo 2, sitio público). Guarda PNG + rectángulos de cada marca + textos de las ventanas.
//   node cli/_manual_v2_capturas.mjs <dir>
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const DIR = process.argv[2], BASE = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
const W = "#hk-nec-panel";

const PARAMS = { tipo: 2, ejesX: "0,5,11,15", ejesY: "0,4.5,9.5", pisos: 4, h: 3, h1: 3.6, volXp: 1.2, volYm: 1.5, volXm: 0, volYp: 0, formLosa: 51, tlosa: 0.25, offsets: 0 };
const P = Buffer.from(JSON.stringify(PARAMS)).toString("base64");
await pag.goto(`${BASE}/workspace/?t=plantillas&p=${P}&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(10000);
const datos = { url: `${BASE}/workspace/?t=plantillas&p=${P}`, marcas: {}, res: {} };
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; if (p) for (const k in p) p[k].val = false; window.__hekatanPaneles?.("ninguno"); window.__hekatanAccesoRapido?.(true); });
await espera(1500);

// rectángulo de una marca: "sel" css · "b" negrita de la ventana · "grupo" cabecera del acceso rápido · "acc" botón del acceso
// rápido · "fila" fila de Tweakpane · "carpeta" carpeta de Tweakpane · "fq" fila del acceso rápido
const R = (tipo, txt) => pag.evaluate((tipo, txt) => {
  let e = null;
  if (tipo === "b") e = [...document.querySelectorAll("#hk-nec-panel b")].find((x) => x.innerText.includes(txt));
  else if (tipo === "grupo") e = [...document.querySelectorAll("#hk-acceso .ar-gt")].find((x) => x.innerText.includes(txt));
  else if (tipo === "acc") e = [...document.querySelectorAll("#hk-acceso button")].find((x) => x.innerText.includes(txt));
  else if (tipo === "fq") e = [...document.querySelectorAll("#hk-acceso .ar-f")].find((x) => x.innerText.includes(txt));
  else if (tipo === "fila") e = [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText?.trim().replace(/\s+/g, " ").startsWith(txt) && x.getBoundingClientRect().width);
  else if (tipo === "carpeta") e = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes(txt) && x.getBoundingClientRect().width);
  else e = document.querySelector(txt);
  if (!e) return null; const r = e.getBoundingClientRect(); if (!r.width) return null;
  return [r.left, Math.max(0, r.top), Math.min(r.right, innerWidth - 2), Math.min(r.bottom, innerHeight - 2)];
}, tipo, txt);
const foto = async (n, marcas = []) => { const m = [];
  for (const [tipo, txt, etq, forma] of marcas) { const r = await R(tipo, txt); if (r && r[3] > r[1]) m.push({ r, etq, forma: forma ?? "caja" }); else console.log("  sin marca:", n, txt); }
  await pag.screenshot({ path: `${DIR}/${n}.png` }); datos.marcas[n] = m; console.log("foto", n, m.length); };
const texto = () => pag.evaluate(() => document.querySelector("#hk-nec-panel")?.innerText ?? "");
const clic = (tipo, txt) => pag.evaluate((tipo, txt) => {
  const e = tipo === "grupo" ? [...document.querySelectorAll("#hk-acceso .ar-gt")].find((x) => x.innerText.includes(txt))
    : [...document.querySelectorAll("#hk-acceso button")].find((x) => x.innerText.includes(txt)); e?.click(); return !!e; }, tipo, txt);
const abierto = (g) => pag.evaluate((g) => !![...document.querySelectorAll("#hk-acceso .ar-g.abierto")].find((x) => x.innerText.includes(g)), g);
const abrirGrupo = async (g) => { if (!(await abierto(g))) await clic("grupo", g); await espera(700); };
const ventana = async (boton, t = 5000) => { await abrirGrupo("RESULTADOS"); await clic("acc", boton); await espera(t);
  await pag.evaluate(() => { const p = document.querySelector("#hk-nec-panel"); if (p) p.scrollTop = 0; }); await espera(300); };
const abajo = async () => { await pag.evaluate(() => { const p = document.querySelector("#hk-nec-panel"); if (p) p.scrollTop = p.scrollHeight; }); await espera(400); };
const nec = async (o) => { await pag.evaluate((o) => { Object.assign(window.__hekatanNEC.params, o); window.__hekatanNEC.correr(); }, o); await espera(6000); };
const fila = (t, k, c) => `${W} table:nth-of-type(${t}) tbody tr:nth-child(${k})${c ? ` td:nth-child(${c})` : ""}`;

// 1 · inicio y acceso rápido
await foto("a01_inicio", [["sel", "#hk-acceso .ar-cab", "Acceso rápido · Alt+Q lo oculta"], ["sel", "#hk-leyenda-tipos", "Leyenda: columna, viga principal, secundaria, diagonal"],
  ["grupo", "CARGAS", "CARGAS · Alt+1"], ["grupo", "DIMENSIONES", "DIMENSIONES · Alt+2"], ["grupo", "RESULTADOS", "RESULTADOS · Alt+3"]]);
await abrirGrupo("CARGAS");
await foto("a02_cargas", [["fq", "Caso", "Caso o patrón que se dibuja"], ["fq", "carga de piso", "carga de piso (kN/m²): se cambia y recalcula solo"],
  ["acc", "elegir", "＋ elegir mandos: qué va en cada grupo"]]);
await abrirGrupo("DIMENSIONES");
await foto("a03_dimensiones", [["grupo", "DIMENSIONES", "ejes, pisos, alturas y secciones"]]);

// 2 · sitio y norma (panel completo de la izquierda)
await pag.evaluate(() => window.__hekatanPaneles?.("settings")); await espera(1200);
await pag.evaluate(() => { const ab = (txt) => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.innerText.includes(txt)); if (!t) return;
  const f = t.closest(".tp-fldv"); if (!f.classList.contains("tp-fldv-expanded")) t.click(); t.scrollIntoView({ block: "start" }); };
  ab("Sismo NEC"); ab("Sitio ("); }); await espera(900);
await foto("b01_sitio", [["carpeta", "Sismo NEC", "🌎 Sismo NEC"], ["fila", "Norma", "NEC-15 (oficial) o borrador 2023"], ["fila", "Z", "Z = 0.50 (Portoviejo)"],
  ["fila", "Fa", "suelo D: Fa 1.12 · Fd 1.11 · Fs 1.40"]]);
await pag.evaluate(() => { const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.innerText.includes("Irregularidades (autom")); if (t) { const f = t.closest(".tp-fldv"); if (!f.classList.contains("tp-fldv-expanded")) t.click(); t.scrollIntoView({ block: "start" }); } });
await espera(800);
await foto("b02_irregularidades", [["carpeta", "Irregularidades (autom", "cada irregularidad: auto / sí / no"], ["fila", "Planta 1", "torsional: la detecta sola, se corrige a mano"]]);
await pag.evaluate(() => { window.__hekatanPaneles?.("ninguno"); window.__hekatanAccesoRapido?.(true); }); await espera(1200);

// 3 · estático
await ventana("Estático"); datos.res.estatico = await texto();
await foto("c01_estatico", [["b", "Periodo", "Ta = Ct·hn^α → T"], ["b", "Espectro", "Sa(T) y Cs = I·Sa/(R·φP·φE)"], ["b", "Peso sísmico", "V = Cs·W"],
  ["sel", fila(1, 4, 6), "V en la base", "circulo"], ["sel", fila(1, 1, 5), "F del piso 4", "circulo"]]);
await foto("c02_estatico_grafica", [["sel", `${W} svg`, "F (naranja) y V (azul) por piso"]]);

// 4 · deriva
await ventana("Deriva de piso"); datos.res.deriva = await texto();
await foto("d01_deriva", [["b", "NEC-15 §6.3.9", "ΔM = 0.75·R·ΔE · límite 2 %"], ["sel", fila(1, 4, 6), "ΔM Y piso 1", "circulo"], ["sel", fila(1, 4, 5), "ΔE Y piso 1", "circulo"],
  ["sel", `${W} svg`, "gráfica: estático (llena) y dinámico (rayas)"]]);
await abajo();
await foto("d02_maxprom", [["sel", `${W} table:last-of-type`, "máximo / promedio como ETABS; > 1.2 = torsión"]]);
await nec({ norma: 1, Z: 0.5, Fa: 1.0, Fd: 1.0, Fs: 1.44, r: 1.2, Cd: 5.5, limDeriva: 0.015 });
await ventana("Deriva de piso"); datos.res.deriva_borrador = await texto();
await foto("d03_deriva_borrador", [["sel", fila(1, 4, 6), "Δ Y piso 1", "circulo"], ["sel", `${W} svg`, "límite 1.5 %"]]);
await ventana("Estático"); datos.res.estatico_borrador = await texto();
await nec({ norma: 0, Z: 0.5, Fa: 1.12, Fd: 1.11, Fs: 1.4, eta: 1.8, r: 1 });

// 5 · dinámico
await ventana("Dinámico", 6500); datos.res.dinamico = await texto();
await foto("e01_dinamico", [["b", "Combinación", "combinación modal y direccional"], ["b", "Cortante basal", "Vdin / Vest ≥ 80 %"],
  ["sel", `${W} svg`, "espectro: rama T < T0 desde Z·Fa, modos encima"], ["sel", fila(1, 3, 6), "ΣUx ≥ 90 % con 3 modos", "circulo"]]);
await abajo();
await foto("e02_dinamico_pisos", [["sel", `${W} table:nth-of-type(2)`, "cortante y deriva dinámicos por piso, ya escalados"]]);
await nec({ modal: "SRSS" }); await ventana("Dinámico", 6500); datos.res.dinamico_srss = await texto();
await foto("e03_srss", [["b", "Combinación", "modal SRSS"], ["b", "Cortante basal", "< 80 % → se escala"]]);
await nec({ modal: "CQC", direccional: "100-30" }); await ventana("Dinámico", 6500); datos.res.dinamico_10030 = await texto();
await nec({ direccional: "independiente" });

// 6 · componente vertical (línea de la ventana completa)
await nec({ conVertical: 1, direccional: "SRSS" });
await pag.evaluate(() => window.__hekatanNEC.correr()); await espera(6000);
await pag.evaluate(() => { const b = [...document.querySelectorAll("#hk-nec-panel b")].find((x) => x.innerText.includes("Componente vertical")); b?.scrollIntoView({ block: "center" }); }); await espera(500);
datos.res.vertical = await texto();
await foto("f01_vertical", [["b", "Componente vertical", "Ev = ⅔·Sa en Z, combinada con X e Y"]]);
await nec({ conVertical: 0, direccional: "independiente" });

datos.errores = errores; writeFileSync(`${DIR}/datos.json`, JSON.stringify(datos, null, 1)); console.log("errores", errores.length); await nav.close();
