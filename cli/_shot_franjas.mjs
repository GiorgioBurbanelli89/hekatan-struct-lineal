// Evidencia del panel «Franjas» en Chrome real sobre el radier corregido.
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = process.argv[2] || "cli/shots/franjas"; mkdirSync(OUT, { recursive: true });
const SF = "C:/Users/j-b-j/Desktop/ENTREGA RADIER MOD_002/diseno_franjas/MOD_002_CORREGIDO_diseno.$sf";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("dialog", async d => { errs.push("dialog " + d.message()); await d.dismiss(); }); p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });
const dormir = ms => new Promise(r => setTimeout(r, ms));
await p.goto("http://localhost:" + (process.env.HK_PORT || "4600") + "/workspace/?heks=/_local/radier_corregido.heks", { waitUntil: "networkidle2", timeout: 180000 }).catch(e => errs.push("goto " + e.message));
await dormir(20000);
let f = 0; const cuadro = async (n) => { await p.screenshot({ path: `${OUT}/f${String(f++).padStart(2, "0")}_${n}.png` }); };
// combinación de diseño: la del modelo (1.2D+1.6L) si existe
const caso = await p.evaluate(async () => {
  const s = window.__hekatanStates; const c = s.loadCombinations.val.find(x => x.name === "1.2D+1.6L");
  if (c) { s.activeLoadCase.val = c.name; window.__hekatanRebuild?.(); }
  return s.activeLoadCase.val;
});
await dormir(20000);
// vista en planta
await p.evaluate(() => window.__hekatanRibbon?.vista?.(0));
await dormir(1500);
await p.click("#hk-franjas-btn"); await dormir(500); await cuadro("panel");
// 1) automáticas sobre ejes
await p.evaluate(() => window.__hekatanFranjas.generar()); await dormir(800); await cuadro("auto_franjas");
await p.evaluate(() => window.__hekatanFranjas.calcular()); await dormir(1500); await cuadro("auto_acero_sup_A");
// 2) las franjas del modelo de SAFE
const inp = await p.$("#hkf-safe"); await inp.uploadFile(SF); await dormir(1000); await cuadro("safe_franjas");
await p.evaluate(() => window.__hekatanFranjas.calcular()); await dormir(1500); await cuadro("safe_acero_sup_A");
await p.select("#hkf-cara", "bot"); await dormir(800); await cuadro("safe_acero_inf_A");
await p.select("#hkf-verCapa", "B"); await p.select("#hkf-cara", "top"); await dormir(800); await cuadro("safe_acero_sup_B");
await p.click("#hkf-tip"); await p.select("#hkf-db", "16"); await dormir(800); await cuadro("safe_tipico_adicional");
const filas = await p.evaluate(() => window.__hekatanFranjas.filas());
// diseño por ELEMENTOS FINITOS
await p.click("#hkf-tip"); await dormir(300);   // sin típico
await p.evaluate(() => { window.__hekatanFranjas.metodo("fe"); window.__hekatanFranjas.calcular(); }); await dormir(1500);
await p.select("#hkf-verCapa", "A"); await p.select("#hkf-cara", "top"); await dormir(800); await cuadro("fe_sup_X");
await p.select("#hkf-cara", "bot"); await dormir(800); await cuadro("fe_inf_X");
await p.select("#hkf-verCapa", "B"); await p.select("#hkf-cara", "top"); await dormir(800); await cuadro("fe_sup_Y");
await p.click("#hkf-tip"); await dormir(800); await cuadro("fe_sup_Y_tipico_adicional");
const filasFE = await p.evaluate(() => window.__hekatanFranjas.filas());
writeFileSync(`${OUT}/armado_franjas_app.json`, JSON.stringify({ caso, filas, filasFE }, null, 0));
console.log(JSON.stringify({ caso, nfilas: filas.length, filasFE, errs: errs.slice(0, 6) }));
await nav.close();
