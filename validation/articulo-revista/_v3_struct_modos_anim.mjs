// B — Hekatan Struct: los MODOS 1, 2 y 3 ANIMADOS en alta definición.
//
//   node _v3_struct_modos_anim.mjs <carpeta_salida>
//
// ⚠️ Nada de `page.screenshot()` de la PÁGINA ENTERA: con la animación modal viva y
// `deviceScaleFactor 2` (3840×2160) se queda colgada (probado: 25 min sin volver).
// Solo se recorta el VISOR, que es lo que hay que ver y es lo que ya funcionó
// (los `struct_m1_000..007.png` que Jorge aprobó).
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const OUT = process.argv[2];
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=test-m-dual";
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
p.on("pageerror", e => console.log("PAGEERROR " + e.message));
console.log("→ cargando");
await p.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await dormir(28000);
console.log("modal:", await p.evaluate(() => {
  const f = window.__hekatanRunModalAnimate;
  if (typeof f === "function") { f(); return "global"; }
  const e = [...document.querySelectorAll("button")].find(e => (e.innerText||"").includes("Correr modal"));
  if (e) { e.click(); return "boton"; } return "NO";
}));
await dormir(80000);

// el select de «Modo» — ⚠️ la regex tiene que exigir «(T = 0.» : con /T\s*=/ enganchaba
// «Auto (SELFWEIGHT=1)», que contiene «T=1».
const ponModo = (i) => p.evaluate((i) => {
  const s = [...document.querySelectorAll("select")]
    .find(s => [...s.options].some(o => /\(T\s*=\s*0?\./.test(o.text)));
  if (!s) return "sin select";
  s.selectedIndex = i; s.value = s.options[i].value;
  s.dispatchEvent(new Event("input", { bubbles: true }));
  s.dispatchEvent(new Event("change", { bubbles: true }));
  return s.options[i].text;
}, i);

const clip = await p.evaluate(() => {
  const c = document.querySelector("canvas"); const r = c.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
});
console.log("clip:", JSON.stringify(clip));

// ⚠️ La FASE hay que fijarla, no disparar a ojo (18-sep-2026).
//
// Antes esto era un `for` de `p.screenshot()` seguidos. A 3840×2160 cada captura tarda 1-2 s y
// el modo 1 oscila a ~1 Hz visible, así que los fotogramas salían ALIASEADOS: la amplitud
// saltaba de un cuadro a otro sin orden y la banda de ABAJO del edificio se movía tanto como
// la de arriba (medido: 13.2 / 5.9 / 5.9 / 17.0 px), que es imposible en un modo lateral. Con
// eso no se puede comparar ciclo contra ciclo con SAP2000.
//
// Ahora se PARA la animación y se dibuja cada fotograma en su fase exacta con `showStatic` +
// una amplitud impuesta: fase k de NF = sen(2π·k/NF). Así los NF cuadros cubren UN ciclo
// completo y ordenado, y el vídeo sale periódico de verdad.
const NF = Number(process.env.V3_FRAMES || 24);
const ponFase = (m, k, nf) => p.evaluate(({ m, k, nf }) => {
  const a = window.__hekatanModalAnimator;
  if (a?.showStaticPhase) { a.showStaticPhase(m, Math.sin(2 * Math.PI * k / nf)); return "fase"; }
  return "sin gancho";
}, { m, k, nf });

for (let m = 0; m < 3; m++) {
  console.log(`── modo ${m + 1}: ${await ponModo(m)}`);
  await dormir(5000);
  const hayFase = (await ponFase(m, 0, NF)) === "fase";
  if (!hayFase) console.log("   ⚠️ sin gancho de fase: los fotogramas saldrán aliaseados");
  const t0 = Date.now();
  for (let f = 0; f < NF; f++) {
    if (hayFase) { await ponFase(m, f, NF); await dormir(120); }
    await p.screenshot({ path: `${OUT}/anim/struct_m${m + 1}_${String(f).padStart(3, "0")}.png`, clip });
  }
  console.log(`   ${NF} frames en ${((Date.now() - t0) / 1000).toFixed(1)} s${hayFase ? " (fase fija)" : ""}`);
}
await b.close();
console.log("FIN");
