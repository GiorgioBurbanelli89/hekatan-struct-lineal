// Panel Franjas: abre SERVICIO y al Calcular tiene que pasar solo a la combinación de diseño.
import puppeteer from "puppeteer";
const BASE = process.env.HK_BASE || "http://localhost:4700/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 }); const errs = [];
p.on("pageerror", e => errs.push(e.message)); p.on("dialog", async d => { errs.push("dialog " + d.message()); await d.dismiss(); });
const dormir = ms => new Promise(r => setTimeout(r, ms));
await p.goto(BASE + "/workspace/?m=cNdgGBOgjQDYiic4", { waitUntil: "networkidle2", timeout: 180000 }); await dormir(30000);
await p.click("#hk-franjas-btn"); await dormir(800);
const antes = await p.evaluate(() => ({ act: window.__hekatanStates.activeLoadCase.val, sel: document.getElementById("hkf-combo").value, opts: [...document.getElementById("hkf-combo").options].map(o => o.text), txt: document.getElementById("hkf-caso").textContent }));
console.log("antes", JSON.stringify(antes)); await p.screenshot({ path: "cli/shots/franjas_combo_antes.png" });
await p.evaluate(() => { document.getElementById("hkf-met").value = "fe"; document.getElementById("hkf-met").onchange(); document.getElementById("hkf-calc").click(); });
await dormir(40000);
const desp = await p.evaluate(() => ({ act: window.__hekatanStates.activeLoadCase.val, txt: document.getElementById("hkf-caso").textContent, res: document.getElementById("hkf-res").innerText.slice(0, 300) }));
console.log("despues", JSON.stringify(desp)); await p.screenshot({ path: "cli/shots/franjas_combo_despues.png" });
console.log("errores", errs); await nav.close();
