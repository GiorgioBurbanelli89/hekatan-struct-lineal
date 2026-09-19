// Diagnostico: abre un .heks en la app publicada y mira QUE pasa despues del Solve: tareas largas del hilo
// principal, si la pagina responde, cuantos objetos hay en la escena y capturas a 5, 15, 40 y 90 s.
//   node diag_app.mjs modelo.heks prefijo [m=<codigo>]
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";
const [heks, pref, extra] = process.argv.slice(2);
const base = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";
let url;
if (extra?.startsWith("m=")) url = base + "?" + extra;
else url = base + "#h=" + deflateRawSync(Buffer.from(readFileSync(heks, "utf-8"))).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const nav = await puppeteer.launch({ headless: "new", protocolTimeout: 900000, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: process.env.GPU ? ["--no-sandbox", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] : ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage();
await p.setViewport({ width: 1500, height: 950 });
await p.evaluateOnNewDocument(() => {
  window.__lt = [];
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: "longtask", buffered: true }); } catch {}
});
const t0 = Date.now(); const logs = [];
p.on("console", (m) => { const s = m.text(); if (!/THREE\.|DevTools/.test(s)) logs.push(`${((Date.now() - t0) / 1000).toFixed(1)}s ${s.slice(0, 160)}`); });
p.on("pageerror", (e) => logs.push("PAGEERROR " + e.message.slice(0, 200)));
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const out = [];
const TIEMPOS = process.env.TIEMPOS ? process.env.TIEMPOS.split(",").map(Number) : [5, 15, 40, 90];
for (const t of TIEMPOS) {
  while ((Date.now() - t0) / 1000 < t) await new Promise((r) => setTimeout(r, 250));
  const a = Date.now();
  let info;
  try {
    info = await Promise.race([p.evaluate(() => {
      const st = window.__hekatanStates, v = document.querySelector("canvas");
      let nObj = 0; const ctx = window.__hekatanViewerCtx || null;
      const gl = v?.getContext && (v.getContext("webgl2") || v.getContext("webgl"));
      const dbg = gl && gl.getExtension("WEBGL_debug_renderer_info");
      return { gpu: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null, nodes: st?.nodes?.val?.length, elements: st?.elements?.val?.length, deform: st?.deformOutputs?.val?.deformations?.size,
               longtasks: (window.__lt || []).slice(-8), ltTotal: (window.__lt || []).reduce((s, x) => s + x[1], 0), canvas: v ? [v.width, v.height] : null };
    }), new Promise((_, r) => setTimeout(() => r(new Error("no responde en 20 s")), 20000))]);
  } catch (e) { info = { error: e.message }; }
  info.respuesta_ms = Date.now() - a;
  if (process.env.SIN_DEFORMADA && t === TIEMPOS[1]) {
    info.ajuste = await p.evaluate(() => { const s = window.__hekatanSettings?.(); const antes = { deformedShape: s?.deformedShape?.val, deformScale: s?.deformScale?.val };
      if (s?.deformedShape) s.deformedShape.val = false; if (s?.shellResults) s.shellResults.val = "pressure"; return antes; });
    await new Promise((r) => setTimeout(r, 3000));
  }
  if (process.env.VISTA && t === TIEMPOS[1]) {   // cerrar la ayuda, presion en colores y encuadrar
    await p.keyboard.press("Escape");
    info.vista = await p.evaluate(() => { const s = window.__hekatanSettings?.(); if (s?.shellResults) s.shellResults.val = "pressure";
      try { window.__hekatanAutoFit?.(); } catch (e) { return String(e); } return "ok"; });
    await new Promise((r) => setTimeout(r, 4000));
  }
  if (process.env.RATON) {   // mover el raton por el lienzo (hover / tooltips) y medir cuanto tarda
    const a2 = Date.now();
    for (let k = 0; k < 20; k++) await p.mouse.move(500 + k * 20, 500 + (k % 5) * 30);
    info.raton_ms = Date.now() - a2;
  }
  await p.screenshot({ path: `${pref}_${t}s.png` }).catch((e) => (info.shot = e.message));
  out.push({ t, ...info });
  console.log(JSON.stringify({ t, ...info }));
}
writeFileSync(pref + ".json", JSON.stringify({ out, logs }, null, 1));
console.log(logs.slice(0, 40).join("\n"));
await nav.close();
