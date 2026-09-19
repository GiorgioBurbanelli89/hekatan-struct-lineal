// El enlace con &diseno=1 tiene que abrir con el mapa de ACERO (cm²/m), no con la presión.
import puppeteer from "puppeteer";
const BASE = process.env.HK_BASE || "http://localhost:4700/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1400, height: 850 }); const errs = [];
p.on("pageerror", e => errs.push(e.message)); const dormir = ms => new Promise(r => setTimeout(r, ms));
await p.goto(BASE + "/workspace/?m=e3qQ74c6C2sEmWPq&diseno=1", { waitUntil: "networkidle2", timeout: 180000 }); await dormir(35000);
console.log(await p.evaluate(() => ({ panel: document.getElementById("hk-franjas")?.style.display, leyenda: document.body.innerText.includes("cm²/m"), res: document.getElementById("hkf-res")?.innerText.slice(0, 120) })));
await p.screenshot({ path: "cli/shots/link_diseno.png" }); console.log("errores", errs); await nav.close();
