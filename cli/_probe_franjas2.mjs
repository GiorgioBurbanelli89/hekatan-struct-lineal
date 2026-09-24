import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1600, height: 950 });
const log = []; p.on("pageerror", e => log.push("pageerror " + e.message)); p.on("dialog", async d => { log.push("dialog " + d.message()); await d.dismiss(); });
p.on("console", m => { if (/franj|Franj/i.test(m.text()) || m.type() === "error") log.push(m.type() + " " + m.text().slice(0, 200)); });
await p.goto("http://localhost:4600/workspace/?heks=/_local/radier_corregido.heks", { waitUntil: "networkidle2", timeout: 180000 }).catch(() => {});
await new Promise(r => setTimeout(r, 20000));
const r = await p.evaluate(async () => {
  const a = window.__hekatanStates.analyzeOutputs.val;
  const out = { hasJoint: !!a.bendingXXjoint, n: a.bendingXXjoint?.size };
  const s = window.__hekatanStates; const c = s.loadCombinations.val.find(x => x.name === "1.2D+1.6L"); out.combos = s.loadCombinations.val.map(x=>x.name);
  if (c) { s.activeLoadCase.val = c.name; window.__hekatanRebuild?.(); await new Promise(r => setTimeout(r, 15000)); }
  const b = window.__hekatanStates.analyzeOutputs.val; out.after = { hasJoint: !!b.bendingXXjoint, n: b.bendingXXjoint?.size, nE: s.elements.val.length, case: s.activeLoadCase.val, m: b.bendingXXjoint?.get(64) };
  return out;
});
console.log(JSON.stringify(r), log.slice(0, 10));
await nav.close();
