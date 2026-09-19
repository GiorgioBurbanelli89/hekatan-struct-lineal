// EVIDENCIA en imagen de la app de Hekatan con el radier: PNG de cada paso y fotogramas para un GIF.
//   node evidencia_app.mjs modelo.heks carpeta prefijo [url_base]
// Pasos: 01 abre el enlace (#h=), 02 modelo resuelto (a los 8 s), 03 presion de suelo + encuadre,
// 04 asiento (displacementZ), 05 momentos M11, y un giro de camara (fotogramas gif_XX.png).
// GPU real (ANGLE D3D11) como el Chrome del usuario. Ventana 1500x950.
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { deflateRawSync } from "node:zlib";
import { join } from "node:path";
const [heks, dir, pref, base0] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const base = base0 ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";
const url = heks.startsWith("m=") ? base + "?" + heks : base + "#h=" + deflateRawSync(Buffer.from(readFileSync(heks, "utf-8"))).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const nav = await puppeteer.launch({ headless: "new", protocolTimeout: 900000, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--no-sandbox", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const p = await nav.newPage();
await p.setViewport({ width: 1500, height: 950 });
const logs = []; const t0 = Date.now();
p.on("console", (m) => { const s = m.text(); if (/Solve OK|Winkler|error/i.test(s)) logs.push(`${((Date.now() - t0) / 1000).toFixed(1)}s ${s.slice(0, 150)}`); });
p.on("pageerror", (e) => logs.push("PAGEERROR " + e.message.slice(0, 200)));
const shot = async (n, nombre) => { const f = join(dir, `${pref}_${n}_${nombre}.png`); await p.screenshot({ path: f }); return f; };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const gif = []; let kgif = 0;
const cuadro = async (n = 1, ms = 350) => { for (let i = 0; i < n; i++) { const f = join(dir, `${pref}_gif_${String(kgif++).padStart(2, "0")}.png`); await p.screenshot({ path: f }); gif.push(f); await espera(ms); } };
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await espera(1200); await shot("01", "abriendo_enlace"); await cuadro(2);
// tiempo hasta ver el modelo con resultados (campo de cascara activo y deformada rellena)
let tVisible = null;
for (let i = 0; i < 240 && tVisible === null; i++) {
  const ok = await p.evaluate(() => { const st = window.__hekatanStates, s = window.__hekatanSettings?.();
    return !!(st?.deformOutputs?.val?.deformations?.size && s?.shellResults?.val && s.shellResults.val !== "none"); }).catch(() => false);
  if (ok) tVisible = (Date.now() - t0) / 1000; else await espera(500);
}
await espera(2500); await cuadro(2);
const info = await p.evaluate(() => { const st = window.__hekatanStates; let uz = 0, ux = 0; st?.deformOutputs?.val?.deformations?.forEach((u) => { if (u[2] < uz) uz = u[2]; if (Math.abs(u[0]) > ux) ux = Math.abs(u[0]); });
  const hayGuia = [...document.querySelectorAll("*")].some((e) => e.childElementCount === 0 && /Cómo usar/.test(e.textContent || "") && e.offsetParent);
  const hayBorrador = [...document.querySelectorAll("span")].some((e) => /dibujo guardado/.test(e.textContent || ""));
  return { nudos: st?.nodes?.val?.length, uz_min_mm: uz * 1000, ux_max_mm: ux * 1000, guia_visible: hayGuia, aviso_borrador: hayBorrador, url: location.href.slice(0, 90) }; });
const estado = await p.evaluate(() => ({ campo: window.__hekatanSettings?.()?.shellResults?.val, caso: window.__hekatanActiveCase }));
info.t_modelo_con_resultados_s = tVisible; Object.assign(info, estado);
await shot("02", "abre_con_resultados");
const poner = async (campo) => { await p.evaluate((c) => { const s = window.__hekatanSettings?.(); if (s?.shellResults) s.shellResults.val = c; }, campo); await espera(1500); };
await p.keyboard.press("Escape");
await poner("pressure");
await p.evaluate(() => { try { window.__hekatanAutoFit?.(); } catch {} }); await espera(1500);
await shot("03", "presion_suelo"); await cuadro(3);
// giro de camara arrastrando el raton sobre el lienzo
await p.mouse.move(740, 500); await p.mouse.down();
for (let i = 0; i < 10; i++) { await p.mouse.move(740 + i * 25, 500 - i * 4, { steps: 3 }); await cuadro(1, 120); }
await p.mouse.up(); await espera(800); await cuadro(2);
await poner("displacementZ"); await shot("04", "asiento_Uz"); await cuadro(3);
await poner("bendingXX"); await shot("05", "momento_M11"); await cuadro(3);
writeFileSync(join(dir, `${pref}_info.json`), JSON.stringify({ info, logs, url_len: url.length }, null, 1));
console.log(JSON.stringify({ info, logs }, null, 1));
await nav.close();
// GIF con PIL (Python) a partir de los fotogramas
writeFileSync(join(dir, `${pref}_gif_lista.txt`), gif.join("\n"));
