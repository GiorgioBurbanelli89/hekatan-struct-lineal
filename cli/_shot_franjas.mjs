// Evidencia del panel «Franjas» en Chrome real sobre el radier corregido.
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = process.argv[2] || "cli/shots/franjas"; mkdirSync(OUT, { recursive: true });
const SF = "C:/Users/j-b-j/Desktop/ENTREGA RADIER MOD_002/diseno_franjas/MOD_002_CORREGIDO_diseno.$sf";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("dialog", async d => { errs.push("dialog " + d.message()); await d.dismiss(); }); p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });
const dormir = ms => new Promise(r => setTimeout(r, ms));
await p.goto("http://localhost:" + (process.env.HK_PORT || "4600") + "/workspace/?heks=/_local/" + (process.env.HK_HEKS || "radier_corregido.heks") + "", { waitUntil: "networkidle2", timeout: 180000 }).catch(e => errs.push("goto " + e.message));
await dormir(20000);
let f = 0; const cuadro = async (n) => { await p.screenshot({ path: `${OUT}/f${String(f++).padStart(2, "0")}_${n}.png` }); };
// combinación de diseño: la del modelo (1.2D+1.6L) si existe
const COMBO = process.env.HK_COMBO || "1.2D+1.6L";
const caso = await p.evaluate(async (COMBO) => {
  const s = window.__hekatanStates; const c = s.loadCombinations.val.find(x => x.name === COMBO);
  if (c) { s.activeLoadCase.val = c.name; window.__hekatanRebuild?.(); }
  return { activo: s.activeLoadCase.val, combos: s.loadCombinations.val.map(x => x.name + "=" + JSON.stringify(x.factors ?? x.loads ?? x)) };
}, COMBO);
console.log("combos", JSON.stringify(caso));
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
// fuerzas de cáscara (joints, signo CSI) en los nudos pedidos, para careo con SAFE
const PTS = JSON.parse(process.env.HK_PTS || "[[12.95,1.675]]");
const fuerzas = await p.evaluate((PTS) => {
  const s = window.__hekatanStates, nodes = s.nodes.val, els = s.elements.val, a = s.analyzeOutputs.val;
  const K = ["bendingXXjoint", "bendingYYjoint", "bendingXYjoint", "membraneXXjoint", "membraneYYjoint", "membraneXYjoint"];
  return PTS.map(([x, y]) => { const out = [];
    els.forEach((e, i) => { if (e.length !== 4 || !a.bendingXXjoint?.get(i)) return;
      e.forEach((n, j) => { if (Math.hypot(nodes[n][0] - x, nodes[n][1] - y) < 0.01) out.push({ el: i, nudo: n, v: K.map(k => +(a[k]?.get(i)?.[j] ?? NaN).toFixed(4)) }); }); });
    return { x, y, campos: "M11 M22 M12 F11 F22 F12 (kN·m/m, kN/m)", out }; });
}, PTS);
// paleta CSI de 15 bandas: mapa y barra con la misma paleta
await p.click("#hkf-tip"); await p.select("#hkf-verCapa", "A");
await p.evaluate(() => { window.__hekatanColorPalette.val = "etabs"; }); await dormir(1500); await cuadro("fe_sup_X_paleta_csi");
const leyendas = await p.evaluate(() => ({ as: document.getElementById("hk-legend-as")?.style.display, orig: document.getElementById("legend")?.style.visibility }));
// cerrar el panel: vuelve la leyenda del resultado
await p.evaluate(() => window.__hekatanFranjas.cerrar()); await dormir(1000); await cuadro("panel_cerrado_leyenda_resultado");
const leyendas2 = await p.evaluate(() => ({ as: document.getElementById("hk-legend-as")?.style.display, orig: document.getElementById("legend")?.style.visibility }));
console.log("leyendas", JSON.stringify({ pintando: leyendas, cerrado: leyendas2 }));
writeFileSync(`${OUT}/armado_franjas_app.json`, JSON.stringify({ caso, filas, filasFE, fuerzas }, null, 0));
console.log(JSON.stringify({ caso, nfilas: filas.length, filasFE, errs: errs.slice(0, 6) }));
await nav.close();
