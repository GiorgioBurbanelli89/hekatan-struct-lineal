#!/usr/bin/env node
/**
 * El muro de Manabí en la app: una captura por modelo (membrana, cáscara, sólido) y por campo,
 * con lo que dice el folder «Calculados». Hay que MIRAR los PNG.
 *
 *   node cli/shot_muro_manabi.mjs [url_base] [carpeta]
 *     url_base  por defecto http://localhost:4600/   (npm run dev:examples)
 *     carpeta   por defecto cli/shots/muro_manabi
 */
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const AQUI = dirname(fileURLToPath(import.meta.url));
const BASE = (process.argv[2] || "http://localhost:4600/").replace(/\/*$/, "/");
const OUT = process.argv[3] || join(AQUI, "shots", "muro_manabi"); mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const MODELOS = [
  { tag: "membrana", modelo: 0, campos: [["shellResults", "displacementX"], ["shellResults", "membraneYY"], ["shellResults", "vonMises"]], vista: "alzadoY" },
  { tag: "cascara", modelo: 1, campos: [["shellResults", "displacementX"], ["shellResults", "bendingXX"], ["shellResults", "pressure"]], vista: "iso" },
  { tag: "solido", modelo: 2, campos: [["solidResults", "vonMises"], ["solidResults", "ux"], ["solidResults", "sigmaZZ"]], vista: "iso" },
];
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const errores = [];
pag.on("pageerror", (e) => errores.push("pageerror: " + String(e).slice(0, 240)));
pag.on("console", (m) => { if (m.type() === "error") errores.push("console: " + m.text().slice(0, 240)); });
await pag.goto(`${BASE}workspace/?t=muro-manabi`, { waitUntil: "networkidle0", timeout: 180000 });
await espera(5000);
const informe = [];
for (const M of MODELOS) {
  await pag.evaluate((v) => window.__hekatanSetParam("modelo", v), M.modelo);
  await espera(5000);
  const medida = await pag.evaluate(() => {
    const st = window.__hekatanStates, U = st.deformOutputs.val?.deformations;
    let ux = 0; if (U) for (const [, u] of U) if (Math.abs(u[0]) > Math.abs(ux)) ux = u[0];
    const s = window.__hekatanSettings ? window.__hekatanSettings() : null;
    return { nudos: st.nodes.val.length, elementos: st.elements.val.length, nudosPorElemento: st.elements.val[0]?.length,
      uxMax_mm: ux * 1000, ajustes: s ? Object.keys(s).filter((k) => /Results|supports|loads|deformed/i.test(k)) : [] };
  });
  const calculados = await pag.evaluate(() => [...document.querySelectorAll(".tp-lblv")].map((e) => e.innerText.replace(/\s+/g, " ").trim()).filter((t) => /coronaci|Presi|Ka|Kae|Peso|Empuje|Sismo|Relleno|Reacci|Nudos/.test(t)));
  for (const [ajuste, campo] of M.campos) {
    await pag.evaluate((ajuste, campo, vista) => {
      const s = window.__hekatanSettings();
      if (s[ajuste]) s[ajuste].val = campo;
      const st = window.__hekatanStates, ns = st.nodes.val;
      const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
      for (const n of ns) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], n[k]); mx[k] = Math.max(mx[k], n[k]); }
      const c = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2], d = Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) || 1;
      const v = document.querySelector("#viewer") || [...document.querySelectorAll("div")].find((x) => x.__ctx), ctx = v && v.__ctx; if (!ctx) return;
      const cam = ctx.camera, L = d * 1.5;
      if (vista === "alzadoY") cam.position.set(c[0], c[1] - L, c[2]);
      else cam.position.set(c[0] + L * 0.75, c[1] - L * 0.75, c[2] + L * 0.45);
      cam.up.set(0, 0, 1); ctx.controls.target.set(c[0], c[1], c[2]); ctx.controls.update(); cam.lookAt(c[0], c[1], c[2]); ctx.render?.();
    }, ajuste, campo, M.vista);
    await espera(3500);
    await pag.evaluate(() => { const v = [...document.querySelectorAll("div")].find((x) => x.__ctx); v?.__ctx?.render?.(); });
    await espera(800);
    const leyenda = await pag.evaluate(() => (document.querySelector("#legend")?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 160));
    const f = `${M.tag}_${campo}.png`; await pag.screenshot({ path: join(OUT, f) });
    console.log(`${f}  [${leyenda}]`);
    informe.push({ modelo: M.tag, campo, f, leyenda });
  }
  console.log(M.tag, JSON.stringify(medida)); console.log("  ", calculados.join(" | "));
  informe.push({ modelo: M.tag, medida, calculados });
}
writeFileSync(join(OUT, "_informe.json"), JSON.stringify({ informe, errores }, null, 1));
console.log(errores.length ? `ERRORES (${errores.length}):\n  ` + [...new Set(errores)].slice(0, 12).join("\n  ") : "sin errores de página");
await nav.close();
