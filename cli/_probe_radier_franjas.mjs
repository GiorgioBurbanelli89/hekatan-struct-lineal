import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
const errs = []; p.on("pageerror", e => errs.push(e.message));
await p.goto("http://localhost:4600/workspace/?heks=/_local/radier_corregido.heks", { waitUntil: "networkidle2", timeout: 180000 }).catch(e => errs.push("goto " + e.message));
await new Promise(r => setTimeout(r, 25000));
const info = await p.evaluate(() => {
  const s = window.__hekatanStates; const a = s.analyzeOutputs.val || {};
  const keys = Object.keys(a).map(k => [k, a[k] instanceof Map ? a[k].size : typeof a[k]]);
  const els = s.elements.val; const ei = s.elementInputs.val;
  const e0 = [...(a.bendingXXjoint?.entries?.() ?? [])][0];
  return { nN: s.nodes.val.length, nE: els.length, n4: els.filter(e => e.length === 4).length, keys, eiKeys: Object.keys(ei || {}),
    thick: ei.thicknesses ? [...ei.thicknesses.entries()].slice(0, 3) : null, e0, active: s.activeLoadCase.val,
    combos: s.loadCombinations.val.map(c => c.name), cases: s.loadCases.val.map(c => c.name), pats: s.loadPatterns.val.map(c => c.name),
    shx: [...(a.tranverseShearX?.entries?.() ?? [])][0], mxy: [...(a.membraneXYjoint?.entries?.() ?? [])][0] };
});
console.log(JSON.stringify(info, null, 1).slice(0, 4000)); console.log("errs", errs.slice(0, 5));
await p.screenshot({ path: "cli/shots/franjas/probe.png" });
await nav.close();
