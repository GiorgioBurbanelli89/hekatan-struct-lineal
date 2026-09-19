// Botón «📐 Diseño» de la barra de arriba: abre el menú y cada entrada abre su panel.
import puppeteer from "puppeteer";
const BASE = process.env.HK_BASE || "http://localhost:4700/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 }); const errs = [];
p.on("pageerror", e => errs.push(e.message)); const dormir = ms => new Promise(r => setTimeout(r, ms));
await p.goto(BASE + "/workspace/?m=e3qQ74c6C2sEmWPq", { waitUntil: "networkidle2", timeout: 180000 }); await dormir(30000);
await p.click("#hk-diseno-btn"); await dormir(600); await p.screenshot({ path: "cli/shots/menu_diseno_1.png" });
await p.click('#hk-diseno-menu [data-id="franjas"]'); await dormir(1000); await p.screenshot({ path: "cli/shots/menu_diseno_2_franjas.png" });
await p.evaluate(() => document.getElementById("hkf-x").click());
await p.click("#hk-diseno-btn"); await dormir(400); await p.click('#hk-diseno-menu [data-id="dne"]'); await dormir(1000); await p.screenshot({ path: "cli/shots/menu_diseno_3_dne.png" });
console.log("errores", errs); await nav.close();
