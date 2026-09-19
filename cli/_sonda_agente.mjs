// Sonda: el agente IA de Struct (Ollama local) arma una cimentación desde un pedido en español.
import puppeteer from "puppeteer";
const BASE = process.env.HK_BASE || "http://localhost:4700/hekatan-struct-lineal";
const PEDIDO = process.env.HK_PEDIDO || "Haz una cimentación de zapatas aisladas unidas con vigas de amarre para 3 por 3 columnas separadas 5 m, con 40 toneladas por columna. Calcula y dime la presión máxima del suelo.";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1400, height: 850 }); const errs = [];
p.on("pageerror", e => errs.push(e.message)); const dormir = ms => new Promise(r => setTimeout(r, ms));
await p.goto(BASE + "/workspace/", { waitUntil: "networkidle2", timeout: 180000 }); await dormir(8000);
await p.evaluate(() => { for (const b of document.querySelectorAll(".tp-btnv_b")) if (b.textContent.includes("Agente IA")) b.click(); }); await dormir(3000);
const t0 = Date.now();
await p.evaluate(t => { const v = document.getElementById("hk-agente-ia"); const s = v.querySelector("select"); s.value = "ollama"; s.onchange(); const e = v.querySelector("textarea"); e.value = t; [...v.querySelectorAll("button")].find(b => b.textContent.includes("Enviar")).click(); }, PEDIDO);
for (let i = 0; i < 90; i++) { await dormir(5000); const ocupado = await p.evaluate(() => ![...document.querySelectorAll("#hk-agente-ia button")].some(b => b.textContent.includes("Enviar ▶"))); if (!ocupado && i > 1) break; }
console.log("tiempo s", ((Date.now() - t0) / 1000).toFixed(0));
console.log(await p.evaluate(() => document.querySelector("#hk-agente-ia > div:nth-child(3)").innerText));
await p.screenshot({ path: "cli/shots/sonda_agente.png" }); console.log("errores", errs); await nav.close();
