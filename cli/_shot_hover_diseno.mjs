// Hover sobre la losa con el diseño FE y por franjas: el recuadro con el acero en ese punto (como SAFE).
import puppeteer from "puppeteer";
const BASE = process.env.HK_BASE || "http://localhost:4700/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1400, height: 850 }); const errs = [];
p.on("pageerror", e => errs.push(e.message)); const dormir = ms => new Promise(r => setTimeout(r, ms));
await p.goto(BASE + "/workspace/?m=e3qQ74c6C2sEmWPq", { waitUntil: "networkidle2", timeout: 180000 }); await dormir(25000);
await p.evaluate(() => document.getElementById("hk-franjas-btn").click()); await dormir(500);
await p.evaluate(() => { const m = document.getElementById("hkf-met"); m.value = "fe"; m.onchange(); document.getElementById("hkf-calc").click(); }); await dormir(4000);
await p.evaluate(() => document.getElementById("hk-franjas").style.display = "block");
for (const [i, [x, y]] of [[640, 470], [760, 520], [880, 560]].entries()) { await p.mouse.move(x, y, { steps: 5 }); await dormir(600);
  console.log("FE", i, await p.evaluate(() => { const t = document.getElementById("hkf-hover"); return t.style.display + " | " + t.innerText.replace(/\n/g, " / "); }));
  await p.screenshot({ path: `cli/shots/hover_fe_${i}.png` }); }
// franjas automáticas
await p.evaluate(() => { const m = document.getElementById("hkf-met"); m.value = "franjas"; m.onchange(); window.__hekatanFranjas.generar(); window.__hekatanFranjas.calcular(); }); await dormir(4000);
await p.mouse.move(600, 500, { steps: 3 }); await p.mouse.move(700, 480, { steps: 5 }); await dormir(600);
console.log("FR", await p.evaluate(() => { const t = document.getElementById("hkf-hover"); return t.style.display + " | " + t.innerText.replace(/\n/g, " / "); }));
await p.screenshot({ path: "cli/shots/hover_franjas.png" });
console.log("errores", errs); await nav.close();
