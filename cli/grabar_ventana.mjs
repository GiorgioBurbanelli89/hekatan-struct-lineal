#!/usr/bin/env node
/**
 * GRABA la ventana de Hekatan Struct HACIENDO cada cosa.
 *
 *   node cli/grabar_ventana.mjs [url] [salida]
 *
 * Por qué no vale una captura quieta con un recuadro: si la voz dice «elige qué
 * resultado se representa» y en pantalla no cambia nada, el que mira no aprende
 * dónde está — se aburre. Así que aquí NO se ilustra: se hace. Se pulsa el
 * control de verdad y se graba lo que pasa, cuadro a cuadro.
 *
 * Sale una carpeta por parte de la ventana, con PNG numerados de 1920x1080
 * (capturados a 2560x1440 y bajados: reducir conserva el texto, ampliar no).
 * El kit de vídeo las reproduce con «struct3d».
 */
import puppeteer from "puppeteer";
import { mkdirSync, readdirSync, unlinkSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const URL_APP = process.argv[2] ||
  "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";
const RAIZ = process.argv[3] ||
  join(__dirname, "..", "..", "hekatan-school", "frames_ventana");
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const SOLO = process.env.SOLO || "";   // grabar una sola parte
const toca = (n) => !SOLO || SOLO === n;

const nav = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader",
         "--enable-webgl", "--ignore-gpu-blocklist"],
});
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const errs = [];
pag.on("pageerror", (e) => errs.push(e.message));

console.log("abriendo", URL_APP);
await pag.goto(URL_APP, { waitUntil: "networkidle2", timeout: 180000 });
await espera(12000);

await pag.evaluate(() => {
  window.__btn = (t) => Array.from(document.querySelectorAll(".tp-btnv_b, button"))
    .find((b) => (b.textContent || "").includes(t));
  window.__fila = (t) => Array.from(document.querySelectorAll(".tp-lblv"))
    .find((r) => (((r.querySelector(".tp-lblv_l") || {}).textContent) || "").includes(t));
  window.__carpeta = (t) => Array.from(document.querySelectorAll(".tp-fldv_t"))
    .find((f) => (f.textContent || "").includes(t));
  // el RESALTE: un marco de oro sobre lo que la voz esta nombrando. Se pinta
  // por encima de todo, sin tocar el layout, y se quita solo.
  window.__marcar = (sel, quitar) => {
    document.querySelectorAll(".hk-marca").forEach((m) => m.remove());
    if (quitar || !sel) return;
    const e = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (!e) return false;
    const r = e.getBoundingClientRect();
    const d = document.createElement("div");
    d.className = "hk-marca";
    d.style.cssText = `position:fixed;left:${r.x - 7}px;top:${r.y - 7}px;` +
      `width:${r.width + 14}px;height:${r.height + 14}px;border:3px solid #D3A53C;` +
      `border-radius:5px;pointer-events:none;z-index:99999;` +
      `box-shadow:0 0 0 9999px rgba(0,0,0,.45)`;
    document.body.appendChild(d);
    return true;
  };
});

const lz = await pag.evaluate(() => {
  const c = Array.from(document.querySelectorAll("canvas"))
    .sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
  const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
const cx = lz.x + lz.w / 2, cy = lz.y + lz.h / 2;

// ── grabadora ────────────────────────────────────────────────────────────
function carpeta(nombre) {
  const d = join(RAIZ, nombre);
  mkdirSync(d, { recursive: true });
  if (existsSync(d)) for (const f of readdirSync(d)) if (f.endsWith(".png")) unlinkSync(join(d, f));
  return d;
}
async function graba(dir, i) {
  await pag.screenshot({ path: join(dir, "f" + String(i).padStart(2, "0") + ".png") });
}
const marcar = (sel, quitar) => pag.evaluate((s, q) => window.__marcar(s, q), sel, quitar);

// ═══ 0 · la ventana entera, girando despacio ════════════════════════════
if (toca("0_todo")) {
  const d = carpeta("0_todo");
  await marcar(null, true);
  await pag.mouse.move(cx, cy); await pag.mouse.down();
  for (let i = 0; i < 14; i++) {
    await pag.mouse.move(cx + i * 9, cy + Math.sin(i / 4) * 5);
    await espera(120); await graba(d, i);
  }
  await pag.mouse.up();
  console.log("0_todo · 14");
}

// ═══ 1 · Settings: se CAMBIA un desplegable y la escala ═════════════════
if (toca("1_settings")) {
  const d = carpeta("1_settings");
  const marco = await pag.evaluate(() => {
    const p = document.querySelector("#settings") ||
              document.querySelectorAll(".tp-dfwv")[0];
    return window.__marcar(p);
  });
  console.log("  resalte Settings:", marco);
  for (let i = 0; i < 4; i++) { await espera(180); await graba(d, i); }
  // mover Scale Z: la deformada crece a la vista
  await marcar(null, true);
  let k = 4;
  for (const v of ["5", "20", "60", "120"]) {
    const ok = await pag.evaluate((v) => {
      const f = window.__fila("Scale Z"); const i = f && f.querySelector("input");
      if (!i) return false;
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      set.call(i, v);
      i.dispatchEvent(new Event("input", { bubbles: true }));
      i.dispatchEvent(new Event("change", { bubbles: true }));
      i.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      window.__marcar(f);
      return true;
    }, v);
    await espera(900);
    await graba(d, k++); await graba(d, k++);
    if (!ok) break;
  }
  console.log("1_settings ·", k);
}

// ═══ 2 · las PLANTILLAS: se pulsa una y aparece la estructura ═══════════
if (toca("2_plantillas")) {
  const d = carpeta("2_plantillas");
  await pag.evaluate(() => {
    const b = window.__btn("Pórtico + losa (aporte de losa)") || window.__btn("Pórtico 3D");
    window.__marcar(b && b.parentElement && b.parentElement.parentElement);
  });
  for (let i = 0; i < 5; i++) { await espera(200); await graba(d, i); }
  await marcar(null, true);
  const puls = await pag.evaluate(() => {
    const b = window.__btn("Pórtico + losa (aporte de losa)") || window.__btn("Pórtico 3D");
    if (!b) return false; window.__marcar(b); b.click(); return true;
  });
  console.log("  plantilla pulsada:", puls);
  for (let i = 5; i < 9; i++) { await espera(700); await graba(d, i); }
  await marcar(null, true);
  for (let i = 9; i < 16; i++) { await espera(500); await graba(d, i); }
  console.log("2_plantillas · 16");
}

// ═══ 3 · el LIENZO: el cursor se pasea y la rejilla es el plano ═════════
if (toca("3_lienzo")) {
  const d = carpeta("3_lienzo");
  await marcar(null, true);
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    await pag.mouse.move(lz.x + lz.w * (0.30 + 0.42 * t), lz.y + lz.h * (0.62 - 0.22 * t));
    await espera(160); await graba(d, i);
  }
  console.log("3_lienzo · 14");
}

// ═══ 4 · la LINEA DE COMANDO: se escribe, letra a letra ════════════════
if (toca("4_comando")) {
  const d = carpeta("4_comando");
  const sel = "#hk3-cmd-input";
  const hay = await pag.evaluate((s) => !!document.querySelector(s), sel);
  console.log("  caja de comando:", hay);
  await pag.evaluate((s) => window.__marcar(document.querySelector(s)?.closest("div")?.parentElement), sel);
  let k = 0;
  for (const txt of ["6,0,0", "@6<45"]) {
    await pag.evaluate((s) => { const i = document.querySelector(s); if (i) { i.focus(); i.value = ""; } }, sel);
    for (const ch of txt) {
      await pag.keyboard.type(ch, { delay: 40 });
      await espera(90); await graba(d, k++);
    }
    await espera(500); await graba(d, k++); await graba(d, k++);
  }
  console.log("4_comando ·", k);
}

// ═══ 5 · la POSICION del cursor: los numeros cambian ═══════════════════
if (toca("5_coord")) {
  const d = carpeta("5_coord");
  await pag.evaluate(() => window.__marcar("#hk-coord-fixed"));
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    await pag.mouse.move(lz.x + lz.w * (0.36 + 0.30 * t), lz.y + lz.h * (0.66 - 0.26 * t));
    await espera(150); await graba(d, i);
  }
  console.log("5_coord · 14");
}

// ═══ 6 · la CRUCETA: se pulsa y la vista se mueve ══════════════════════
if (toca("6_navegar")) {
  const d = carpeta("6_navegar");
  await marcar(null, true);
  const cruz = await pag.evaluate(() => {
    // los botones de encuadre son los de mas abajo a la derecha
    const bs = Array.from(document.querySelectorAll("button"))
      .map((b) => ({ b, r: b.getBoundingClientRect() }))
      .filter((o) => o.r.width > 18 && o.r.width < 70 &&
                     o.r.y > innerHeight * 0.75 && o.r.x > innerWidth * 0.82);
    if (!bs.length) return 0;
    const x0 = Math.min(...bs.map(o => o.r.x)) - 10, y0 = Math.min(...bs.map(o => o.r.y)) - 10;
    const x1 = Math.max(...bs.map(o => o.r.x + o.r.width)) + 10;
    const y1 = Math.max(...bs.map(o => o.r.y + o.r.height)) + 10;
    const dv = document.createElement("div");
    dv.className = "hk-marca";
    dv.style.cssText = `position:fixed;left:${x0}px;top:${y0}px;width:${x1-x0}px;` +
      `height:${y1-y0}px;border:3px solid #D3A53C;border-radius:6px;` +
      `pointer-events:none;z-index:99999;box-shadow:0 0 0 9999px rgba(0,0,0,.45)`;
    document.body.appendChild(dv);
    window.__cruz = bs.map(o => o.b);
    return bs.length;
  });
  console.log("  botones de encuadre:", cruz);
  for (let i = 0; i < 4; i++) { await espera(200); await graba(d, i); }
  await marcar(null, true);
  // SOLO las flechas y la casa. Pulsando los siete en fila entran tambien los
  // de zoom, la camara se mete DENTRO de la losa y el cuadro sale rojo entero:
  // parece un fallo de render y es que se acerco de mas.
  await pag.evaluate(() => {
    const flecha = (t) => (window.__cruz || []).find((b) => (b.textContent || "").includes(t));
    window.__paso = ["←", "→", "↑", "↓", "⌂"].map(flecha).filter(Boolean);
  });
  let k = 4;
  const n = await pag.evaluate(() => (window.__paso || []).length);
  console.log("  flechas utiles:", n);
  for (let j = 0; j < Math.max(1, n); j++) {
    await pag.evaluate((j) => { const b = window.__paso[j]; if (b) b.click(); }, j);
    await espera(700); await graba(d, k++); await graba(d, k++);
  }
  // un cuadro de un solo color es una camara perdida, no una vista
  const plano = await pag.evaluate(() => {
    const c = document.querySelector("canvas");
    return c ? c.width * c.height > 0 : false;
  });
  console.log("6_navegar ·", k, "· canvas vivo:", plano);
}

await marcar(null, true);
console.log("\nerrores de pagina:", errs.length);
await nav.close();
console.log("->", RAIZ);
