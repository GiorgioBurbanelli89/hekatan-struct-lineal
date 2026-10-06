/**
 * Cambio de unidades en el panel (puppeteer, 6-oct-2026):
 *   1. Preset SI → MKS → Imperial → SI y «Fuerza» kN ↔ tonf: 0 pageerror (antes `TpError: alreadyDisposed`).
 *   2. La FÍSICA no cambia: ΣR y u máx (SI, del solver) iguales tras cada cambio.
 *   3. Redondeo: con MKS, un valor fuera de la rejilla del deslizador puesto por programa (__hekatanSetParam, lo que hace
 *      un onParamChange) sigue IGUAL tras el refresh (antes Tweakpane lo ajustaba a la rejilla vieja: 50 kN·m → 49.81).
 *
 *   node cli/test_unidades_preset_tp.mjs [BASE] [DIR]
 *   BASE = http://localhost:4801/hekatan-struct-lineal (cli/_serve_bundle.mjs) o el sitio público
 * Sale con código 1 si algo falla.
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = process.argv[3] ?? "cli/shots/unidades_preset"; mkdirSync(DIR, { recursive: true });
// ejemplo → parámetro y valor «raro» (fuera de cualquier rejilla) para la prueba de redondeo
const CASOS = [
  ["placa-base", "Mu", 50.123457],          // unitType moment (tonf·m en MKS)
  ["viga-doble-t", "P", 4.98765],           // unitType force
  ["placa-base-cft", "fc", 28123.4567],     // etiqueta fija «f'c (kN/m²)» convertida a tonf/m²
];
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const filas = []; let fallos = 0;
const fila = (que, ok, detalle) => { filas.push({ que, ok, detalle }); if (!ok) fallos++; console.log(`${ok ? "OK   " : "FALLA"} ${que}  ${detalle}`); };

for (const [id, clave, valor] of CASOS) {
  const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 950 });
  const errores = []; pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
  await pag.evaluateOnNewDocument(() => { try { localStorage.clear(); localStorage.setItem("hk_unitsPreset", "Metric SI"); } catch {} });
  await pag.goto(`${BASE}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
  await espera(7000);
  const fisica = () => pag.evaluate(() => {
    const st = window.__hekatanStates, d = st.deformOutputs.val?.deformations, r = st.deformOutputs.val?.reactions;
    const s = [0, 0, 0, 0, 0, 0]; r?.forEach((x) => x.forEach((v, k) => (s[k] += v)));
    let u = 0; d?.forEach((x) => { for (let k = 0; k < 3; k++) u = Math.max(u, Math.abs(x[k])); });
    return [...s, u];
  });
  const elegir = (etiqueta, empieza) => pag.evaluate((etiqueta, empieza) => {
    const sel = [...document.querySelectorAll(".tp-lblv")].find((b) => b.querySelector(".tp-lblv_l")?.textContent?.trim() === etiqueta)?.querySelector("select");
    if (!sel) return false;
    const opt = [...sel.options].find((o) => o.textContent.startsWith(empieza)); if (!opt) return false;
    sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true })); return true;
  }, etiqueta, empieza);
  const f0 = await fisica();
  const difRel = (a, b) => Math.max(...a.map((v, k) => Math.abs(v - b[k]) / Math.max(1e-12, ...a.map(Math.abs))));
  let peor = 0, todosOk = true;
  for (const [et, op] of [["Preset", "Metric MKS"], ["Preset", "U.S. Imperial"], ["Preset", "Metric SI"], ["Fuerza", "tonf"], ["Fuerza", "kN"], ["Preset", "Metric MKS"]]) {
    todosOk = (await elegir(et, op)) && todosOk; await espera(3500);
    peor = Math.max(peor, difRel(f0, await fisica()));
  }
  fila(`${id}: cambiar unidades (6 cambios)`, todosOk && errores.length === 0, `selects ${todosOk ? "ok" : "NO ENCONTRADOS"}, pageerror ${errores.length}${errores.length ? " " + errores[0] : ""}`);
  fila(`${id}: física igual (ΣR, u máx)`, peor < 1e-9, `dif. relativa máx ${peor.toExponential(2)}`);
  // ── redondeo: en MKS, valor fuera de rejilla puesto por programa ──
  const r = await pag.evaluate(async (clave, valor) => {
    window.__hekatanSetParam(clave, valor);
    await new Promise((res) => setTimeout(res, 2500));
    const a = window.__hekatanGetParams()[clave];
    window.__hekatanRebuild?.(); await new Promise((res) => setTimeout(res, 2500));
    return { a, b: window.__hekatanGetParams()[clave] };
  }, clave, valor);
  fila(`${id}: ${clave} = ${valor} se queda (MKS)`, r.a === valor && r.b === valor && errores.length === 0, `tras refresh ${r.a}, tras rebuild ${r.b}`);
  await pag.screenshot({ path: `${DIR}/${id}.png` });
  await pag.close();
}
await nav.close();
writeFileSync(`${DIR}/datos.json`, JSON.stringify(filas, null, 1));
console.log(fallos ? `\n${fallos} FALLAS` : `\nTODO OK (${filas.length} filas)`);
process.exit(fallos ? 1 : 0);
