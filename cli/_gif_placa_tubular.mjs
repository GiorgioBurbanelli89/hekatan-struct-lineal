// GIF «cómo se usa» de la placa base tubular en Struct: interfaz real (puppeteer), cursor dibujado y rótulo.
//   node cli/_gif_placa_tubular.mjs [BASE] [DIR]   -> DIR/frame_NN.png + DIR/dur.json  (el GIF: python cli/_gif_marca.py DIR DIR/dur.json salida.gif)
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/gif_placa_tubular"; mkdirSync(DIR, { recursive: true });
const J = JSON.parse(readFileSync("tests/datos/placa_base_tubular_jueces.json", "utf-8"));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push(n + ": " + String(e.stack ?? e.message).slice(0, 600)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0; const dur = [];
const foto = async (ms = 1200) => { await pag.screenshot({ path: `${DIR}/frame_${String(n).padStart(2, "0")}.png` }); dur.push(ms); n++; };
const rotulo = (t) => pag.evaluate((t) => {
  let d = document.getElementById("__rot"); if (!d) { d = document.createElement("div"); d.id = "__rot"; document.body.appendChild(d); }
  Object.assign(d.style, { position: "fixed", left: "50%", bottom: "62px", transform: "translateX(-50%)", zIndex: 99999, background: "rgba(0,0,0,.85)",
    color: "#fff", font: "600 18px Segoe UI, sans-serif", padding: "9px 20px", borderRadius: "10px", border: "1px solid #8b5cf6", pointerEvents: "none", maxWidth: "1180px", textAlign: "center" });
  d.textContent = t;
}, t);
const cursor = (x, y) => pag.evaluate((x, y) => {
  let c = document.getElementById("__cur"); if (!c) { c = document.createElement("div"); c.id = "__cur"; document.body.appendChild(c);
    c.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#000" stroke-width="1.4"/></svg>'; }
  Object.assign(c.style, { position: "fixed", left: x + "px", top: y + "px", zIndex: 100000, pointerEvents: "none", display: "block" });
}, x, y);
const sinCursor = () => pag.evaluate(() => { const c = document.getElementById("__cur"); if (c) c.style.display = "none"; });
const caja = (sel, txt, xMax = 1e9) => pag.evaluate((sel, txt, xMax) => {
  const e = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(txt) && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x >= 0 && e.getBoundingClientRect().x <= xMax);
  if (!e) return null; e.scrollIntoView({ block: "center" }); const b = e.getBoundingClientRect(); return { x: b.x + Math.min(b.width / 2, 60), y: b.y + b.height / 2 };
}, sel, txt, xMax);
const pulsar = async (sel, txt, t, ms = 1300, xMax = 1e9) => {
  const b = await caja(sel, txt, xMax); if (!b) { console.log("no encontré", txt); return; }
  await espera(300); const c = await caja(sel, txt, xMax); await cursor(c.x, c.y); if (t) { await rotulo(t); await foto(ms); }
  await pag.mouse.click(c.x, c.y); await espera(800);
};
/** una lista de Tweakpane por su rótulo: el cursor encima y se elige la opción (evento change real) */
const elegir = async (rotuloLista, opcion, t, ms = 1600) => {
  const b = await pag.evaluate((r, o) => {
    const fila = [...document.querySelectorAll(".tp-lblv")].find((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim().startsWith(r)
      && e.querySelector("select") && [...e.querySelector("select").options].some((x) => x.text.startsWith(o)) && e.getBoundingClientRect().width > 0);
    if (!fila) return null;
    fila.scrollIntoView({ block: "center" });
    const s = fila.querySelector("select"); s.setAttribute("data-gif", "1");
    const bb = s.getBoundingClientRect(); return { x: bb.x + 30, y: bb.y + bb.height / 2, v: [...s.options].find((x) => x.text.startsWith(o)).value };
  }, rotuloLista, opcion);
  if (!b) { console.log("no encontré la lista", rotuloLista, opcion); return; }
  await cursor(b.x, b.y); if (t) await rotulo(t);
  await pag.select('select[data-gif="1"]', b.v); await pag.evaluate(() => document.querySelector('select[data-gif="1"]')?.removeAttribute("data-gif"));
  await espera(2500); await foto(ms);
};
const tabla = (titulo, filas) => pag.evaluate((titulo, filas) => {
  let d = document.getElementById("__tabla"); if (!d) { d = document.createElement("div"); d.id = "__tabla"; document.body.appendChild(d); }
  Object.assign(d.style, { position: "fixed", left: "360px", top: "110px", zIndex: 99998, background: "rgba(8,8,14,.95)", color: "#eee",
    font: "15px Consolas, monospace", padding: "14px 18px", borderRadius: "10px", border: "1px solid #8b5cf6", whiteSpace: "pre" });
  d.textContent = titulo + String.fromCharCode(10, 10) + filas.join(String.fromCharCode(10));
}, titulo, filas);
const quitarTabla = () => pag.evaluate(() => document.getElementById("__tabla")?.remove());
const tmax = (r) => ((r["Pernos: tracción"] ?? "").match(/T máx ([\d.]+)/) ?? [])[1] ?? "?";
const uzp = (r) => (r["uz pernos (mm)"] ?? "").split(" ")[0];
const leer = () => pag.evaluate(() => Object.fromEntries([...document.querySelectorAll(".tp-lblv")]
  .map((e) => [(e.querySelector(".tp-lblv_l")?.textContent ?? "").trim(), e.querySelector("input,textarea")?.value ?? ""])
  .filter(([l]) => /Hormigón: reacción|Pernos: tracción|ΣFz|levantados|uz pernos/.test(l))));

await pag.goto(`${BASE}/workspace/?t=placa-base-tubular`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(8000);
await rotulo("1 · Placa base de columna tubular SHS 200×200×10: placa 25 mm y tubo de cáscaras, soldados por nudos compartidos"); await foto(2600);
await pulsar("button", "⟨", "2 · Panel derecho: los parámetros del ejemplo");
await pulsar(".tp-fldv_t", "Unidades", null, 700);
await elegir("Preset", "Metric SI", "3 · Unidades: kN, m, MPa (las de Abaqus y de la hoja)");
await pulsar(".tp-fldv_t", "Unidades", null, 600);
await pulsar(".tp-fldv_t", "Cargas", "4 · Cargas en la cabeza del tubo: N = 300 kN y M = 40 kN·m (Navier sobre la pared)", 2200);
await pulsar(".tp-fldv_t", "Hormigón y pernos", "5 · Hormigón: muelle de área SOLO COMPRESIÓN (Gap) · 4 pernos SOLO TRACCIÓN (Hook)", 2400);
await sinCursor();
await rotulo("6 · Presión del hormigón: el lado traccionado se LEVANTA (38 de 81 nudos sin contacto)"); await foto(2600);
await pulsar("button", "⟩", "7 · Settings (panel izquierdo) › Resultados de cáscara", 1300, 120);
await elegir("Resultados de cáscara", "Uz", "8 · Uz: la placa sube del lado de los pernos activos (2 de 4) y baja sobre el hormigón", 2600);
await elegir("Resultados de cáscara", "FVM", "9 · Von Mises: el pico en la placa junto a la pared comprimida del tubo", 2600);
await elegir("Resultados de cáscara", "Pressure", "10 · De vuelta a la presión", 1200);
await sinCursor();
const r = await leer();
await tabla("📊 SHS 200×200×10 · N 300 kN · M 40 kN·m — Hekatan Struct contra los jueces (misma malla nudo a nudo)", [
  "                     Struct     Abaqus     hoja LISP  IDEA k2fem64",
  `R hormigón (kN)      ${(r["Hormigón: reacción"] ?? "").split(" ")[0].padEnd(10)} 357.07     356.96     357.45`,
  `T perno (kN)         ${tmax(r).padEnd(10)} 28.54      28.48      28.72`,
  `uz perno (mm)        ${uzp(r).padEnd(10)} 0.1155     —          0.1162`,
  `nudos levantados     38         38         38         38`,
  `pernos activos       2          2          2          2`,
  `σVM máx placa (MPa)  107.3      106.7      105.2      —`,
  `ΣFz (kN)             ${(r["ΣFz"] ?? "").split(" ")[0]}`,
]);
await rotulo("11 · Lo que decide la ley Gap/Hook coincide: reacción 0.01 %, perno 0.08 % (Abaqus), mismos nudos en contacto"); await foto(5000);
await quitarTabla();
await pulsar("button", "⟨", "12 · Cambiar a la columna rectangular", 1000);
await pulsar(".tp-fldv_t", "Columna", null, 800);
await elegir("Columna", "RHS", "13 · RHS 250×150×8, M = 50 kN·m (hoja 145): se rehace la malla y se resuelve otra vez", 2600);
await sinCursor();
const r2 = await leer();
await tabla("📊 RHS 250×150×8 · N 300 kN · M 50 kN·m", [
  "                     Struct     Abaqus     hoja LISP  IDEA k2fem64",
  `R hormigón (kN)      ${(r2["Hormigón: reacción"] ?? "").split(" ")[0].padEnd(10)} 367.96     367.82     368.43`,
  `T perno (kN)         ${tmax(r2).padEnd(10)} 33.98      33.91      34.22`,
  `uz perno (mm)        ${uzp(r2).padEnd(10)} 0.1375     —          0.1385`,
  `σVM máx placa (MPa)  110.1      109.7      108.9      —`,
]);
await rotulo("14 · RHS: reacción 0.01 %, perno 0.07 %, Von Mises 0.4 % contra Abaqus"); await foto(5000);
writeFileSync(`${DIR}/dur.json`, JSON.stringify(dur));
console.log(JSON.stringify({ frames: n, errs, r, r2 }));
await nav.close();
