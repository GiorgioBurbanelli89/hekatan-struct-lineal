// La ventana de diseño: se arrastra por el título y se pliega con ▁; la barra de colores queda a la vista.
import puppeteer from "puppeteer";
const BASE = process.env.HK_BASE || "http://localhost:4700/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1400, height: 850 }); const errs = [];
p.on("pageerror", e => errs.push(e.message)); const dormir = ms => new Promise(r => setTimeout(r, ms));
await p.goto(BASE + "/workspace/?m=e3qQ74c6C2sEmWPq&diseno=1", { waitUntil: "networkidle2", timeout: 180000 }); await dormir(35000);
await p.screenshot({ path: "cli/shots/ventana_0_abre.png" });
const r0 = await p.evaluate(() => { const r = document.getElementById("hk-franjas").getBoundingClientRect(); return [r.left, r.top, r.width]; });
await p.mouse.move(r0[0] + 80, r0[1] + 10); await p.mouse.down(); await p.mouse.move(r0[0] + 80, r0[1] + 380, { steps: 10 }); await p.mouse.up(); await dormir(400);
await p.screenshot({ path: "cli/shots/ventana_1_movida.png" });
await p.evaluate(() => document.querySelector("#hk-franjas [data-plegar]").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))); await dormir(400);
console.log(await p.evaluate(() => { const r = document.getElementById("hk-franjas").getBoundingClientRect(); return { top: r.top, alto: r.height }; }));
await p.screenshot({ path: "cli/shots/ventana_2_plegada.png" });
console.log("errores", errs); await nav.close();
