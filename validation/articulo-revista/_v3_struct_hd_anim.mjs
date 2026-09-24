// v3 — Hekatan Struct PÚBLICO en ALTA DEFINICIÓN (deviceScaleFactor 2 → 3840×2160)
// + frames de la ANIMACIÓN MODAL de los modos 1, 2 y 3.
//   node _v3_struct_hd_anim.mjs <carpeta_salida>
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const OUT = process.argv[2];
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=test-m-dual";
mkdirSync(OUT, { recursive: true });
mkdirSync(`${OUT}/anim`, { recursive: true });
const dormir = ms => new Promise(s => setTimeout(s, ms));

const b = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  headless: "new",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader",
         "--enable-unsafe-swiftshader", "--window-size=1920,1080"],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
});
const p = await b.newPage();
const errs = []; p.on("pageerror", e => errs.push("PAGEERROR " + e.message));

console.log("→ cargando", URL);
await p.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await dormir(28000);
await p.screenshot({ path: `${OUT}/v3_01_struct_carga_HD.png` });
console.log("✓ 01 carga HD");

// ── correr el modal por la función global (no por coordenadas) ────────────────
const lanzado = await p.evaluate(() => {
  const f = window.__hekatanRunModalAnimate;
  if (typeof f === "function") { f(); return "global"; }
  const e = [...document.querySelectorAll("button")].find(e => (e.innerText||"").includes("Correr modal"));
  if (e) { e.click(); return "boton"; }
  return "NO";
});
console.log("modal lanzado por:", lanzado);
await dormir(75000);
await p.screenshot({ path: `${OUT}/v3_02_struct_modal_HD.png` });
console.log("✓ 02 modal HD");

// ── lista de los selects «Modo» que aparecen tras correr el modal ────────────
const modoSel = await p.evaluate(() => {
  const ss = [...document.querySelectorAll("select")];
  const s = ss.find(s => [...s.options].some(o => /\(T\s*=\s*0?\./.test(o.text)));
  if (!s) return null;
  return { n: s.options.length, opts: [...s.options].map(o => o.text).slice(0, 6) };
});
console.log("select de Modo:", JSON.stringify(modoSel));

const ponModo = (i) => p.evaluate((i) => {
  const ss = [...document.querySelectorAll("select")];
  const s = ss.find(s => [...s.options].some(o => /\(T\s*=\s*0?\./.test(o.text)));
  if (!s) return "sin select";
  s.selectedIndex = i;
  s.value = s.options[i].value;
  s.dispatchEvent(new Event("input", { bubbles: true }));
  s.dispatchEvent(new Event("change", { bubbles: true }));
  return s.options[i].text;
}, i);

// región del visor 3D (para los frames de animación: más ligero que la página entera)
const clip = await p.evaluate(() => {
  const c = document.querySelector("canvas");
  const r = c.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
});
console.log("clip del visor:", JSON.stringify(clip));

const NF = Number(process.env.V3_FRAMES || 30);
for (let m = 0; m < 3; m++) {
  const txt = await ponModo(m);
  console.log(`── modo ${m + 1}: ${txt}`);
  await dormir(4000);
  // foto fija HD de la página entera con ese modo
  await p.screenshot({ path: `${OUT}/v3_1${m}_struct_modo${m + 1}_HD.png` });
  const t0 = Date.now();
  for (let f = 0; f < NF; f++) {
    await p.screenshot({ path: `${OUT}/anim/struct_m${m + 1}_${String(f).padStart(3, "0")}.png`, clip });
  }
  console.log(`   ${NF} frames en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}

// ── paneles extra en HD ──────────────────────────────────────────────────────
const btn = (txt) => p.evaluate((txt) => {
  const e = [...document.querySelectorAll("button")].find(e => (e.innerText || "").includes(txt));
  if (!e) return false; e.scrollIntoView({ block: "center" }); e.click(); return true;
}, txt);

await ponModo(0); await dormir(3000);
console.log("Tablas:", await btn("Tablas")); await dormir(9000);
await p.screenshot({ path: `${OUT}/v3_20_struct_tabla_modos_HD.png` });
console.log("Modal+:", await btn("Modal+")); await dormir(18000);
await p.screenshot({ path: `${OUT}/v3_21_struct_modal_asce_HD.png` });
console.log("NEC:", await btn("Sísmico NEC")); await dormir(5000);
await p.screenshot({ path: `${OUT}/v3_22_struct_sismico_nec_HD.png` });

const txt = await p.evaluate(() => document.body.innerText);
console.log("--- numeros ---");
console.log(txt.split("\n").filter(l => /0\.48|0\.43|0\.15|32\.0|26\.[45]|16\.3|85\.[0-9]|99\.[0-9]|ortante|basal|Modo|ΣU|ΣR/.test(l)).slice(0, 70).join("\n"));
console.log("ERRORES:", errs.slice(0, 8));
await b.close();
console.log("FIN");
