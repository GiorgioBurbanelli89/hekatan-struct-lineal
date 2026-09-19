// Barrido visual: apoyos y cargas en cada ejemplo (PNG + hoja de contacto). Uso: node cli/_barrido_apoyos_cargas.mjs [salida] id...
import puppeteer from "puppeteer"; import { mkdirSync, writeFileSync } from "node:fs";
const BASE = process.env.HK_BASE || "http://localhost:4700/hekatan-struct-lineal";
const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const ids = process.argv.slice(3);
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const dormir = ms => new Promise(r => setTimeout(r, ms)); const info = {};
for (const id of ids) {
  const p = await nav.newPage(); await p.setViewport({ width: 1400, height: 900 }); const errs = [];
  p.on("pageerror", e => errs.push(e.message));
  const url = id.startsWith("?") ? BASE + "/workspace/" + id : BASE + "/workspace/?t=" + id;
  try { await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 }); } catch (e) { errs.push("goto " + e.message); }
  await dormir(+process.env.HK_WAIT || 12000);
  if (process.env.HK_FRAME) await p.evaluate(f => { window.__HK_FRAME = f; }, process.env.HK_FRAME);
  info[id] = await p.evaluate(() => {
    const s = window.__hekatanStates, ni = s?.nodeInputs?.val ?? {}, n = s?.nodes?.val ?? [];
    const st = window.__hekatanSettings?.(); try { st.loads.val = true; st.supports.val = true; } catch {} const FR = window.__HK_FRAME; if (FR) try { st.frameResults.val = FR; st.loads.val = false; } catch {}
    let ext = 0; for (let k = 0; k < 3; k++) { const v = n.map(x => x[k]); if (v.length) ext = Math.max(ext, Math.max(...v) - Math.min(...v)); }
    const tipos = {}; ni.supports?.forEach(d => { const t = d.slice(0,3).filter(Boolean).length + "T" + d.slice(3).filter(Boolean).length + "R"; tipos[t] = (tipos[t] ?? 0) + 1; });
    return { nudos: n.length, extent: +ext.toFixed(2), apoyos: tipos, cargas: ni.loads?.size ?? 0, muelles: (ni.springs ?? []).length, escala: st?.displayScale?.val };
  }).catch(e => ({ err: e.message }));
  info[id].errs = errs.slice(0, 3);
  await dormir(1500);
  await p.screenshot({ path: `${OUT}/${id.replace(/[?=&]/g, "_")}.png`, clip: { x: 300, y: 30, width: 880, height: 830 } });
  console.log(id, JSON.stringify(info[id])); await p.close();
}
writeFileSync(OUT + "/_info.json", JSON.stringify(info, null, 1)); await nav.close();
