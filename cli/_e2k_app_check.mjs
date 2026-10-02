// Importa el e2k en el sitio (público o local) y saca lo que calcula la APP: nudos, reacciones, modal.
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";
const [fichero, salida, png, base = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal"] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = [], logs = []; p.on("pageerror", e => errs.push(String(e).slice(0,200)));
p.on("console", m => { const t = m.text(); if (/e2k|E2K|CSI|import|singular|NaN|modal/i.test(t)) logs.push(t.slice(0,250)); });
p.on("dialog", async d => { logs.push("aviso: " + d.message().slice(0,200)); await d.accept(); });
await p.goto(`${base}/workspace/?t=edificio-frame-nec`, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 10000));
const ch = p.waitForFileChooser({ timeout: 20000 });
await p.evaluate(() => { const b = [...document.querySelectorAll("button,.tp-btnv_b")].find(e => /Importar/i.test(e.textContent) && /E2K/i.test(e.textContent) && e.textContent.length < 45); b?.click(); });
await (await ch).accept([fichero]);
await new Promise(r => setTimeout(r, 25000));
const r1 = await p.evaluate(() => { const S = window.__hekatanStates;
  const d = S.deformOutputs?.val; let rz = 0, n = 0, nan = 0;
  for (const [, v] of (d?.reactions ?? [])) { rz += v[2]; n++; }
  for (const [, v] of (d?.deformations ?? [])) if (v.some(x => !isFinite(x))) nan++;
  let fz = 0; for (const [, v] of (S.nodeInputs.val?.loads ?? [])) fz += v[2] ?? 0;
  return { nudos: S.nodes.val.length, elems: S.elements.val.length, apoyos: S.nodeInputs.val?.supports?.size, cargaFz: fz, reacRz: rz, nReac: n, nan, ej: window.__hekatanExample?.id ?? null }; });
writeFileSync(salida.replace(/\.json$/, ".heks"), await p.evaluate(() => window.__hekatanModeloAHeks?.() ?? ""));
// la PLANTA (se ven los orificios recortados) antes del modal
await p.evaluate(() => window.__hekatanSetView?.("plan")); await new Promise(r => setTimeout(r, 2500));
await p.screenshot({ path: png.replace(/\.png$/, "_planta.png") });
await p.evaluate(() => window.__hekatanSetView?.("iso")); await new Promise(r => setTimeout(r, 1500));
let modal = null;
try {
  await p.evaluate(() => window.__hekatanRunModalAnimate?.());
  await new Promise(r => setTimeout(r, 30000));
  modal = await p.evaluate(() => { const m = window.__hekatanModalResults?.(); if (!m) return null;
    const f = m.frequencies ?? []; const mp = m.massParticipation ?? m.participacion ?? null;
    return { T: f.slice(0, 12).map(x => x > 0 ? 1 / x : 0), mp: mp ? JSON.parse(JSON.stringify(mp)).slice?.(0, 12) ?? mp : null, keys: Object.keys(m) }; });
} catch (e) { modal = "ERR " + e.message; }
let nec = null;
try {
  nec = await p.evaluate(async () => { const n = window.__hekatanNEC; if (!n) return "sin panel NEC";
    try { n.correr(); } catch (e) { return "ERROR " + e.message; }
    await new Promise((r) => setTimeout(r, 4000));
    return (document.querySelector("#hk-nec-panel")?.innerText ?? "").slice(0, 900); });
} catch (e) { nec = "ERR " + e.message; }
const out = { ...r1, modal, nec, errs, logs: logs.slice(0, 40) };
writeFileSync(salida, JSON.stringify(out, null, 1));
await p.screenshot({ path: png }); await b.close();
console.log(JSON.stringify({ ...r1, T: modal?.T?.slice(0, 6), errs: errs.slice(0, 3) }));
