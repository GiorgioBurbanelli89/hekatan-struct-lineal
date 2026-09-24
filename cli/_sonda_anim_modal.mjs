// SONDA: fotogramas PNG de la animacion modal en el workspace LOCAL (localhost:4600).
// Uso: node cli/_sonda_anim_modal.mjs <idEjemplo> [modo0] [salida]
import puppeteer from "puppeteer";
import fs from "fs";
const id = process.argv[2] ?? "edificio-aporticado";
const modo = +(process.argv[3] ?? 0);
const OUT = process.argv[4] ?? `cli/shots/anim_modal/${id}_m${modo + 1}`;
fs.mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1400, height: 900 });
const errs = []; p.on("pageerror", e => errs.push(e.message));
p.on("console", m => { if (/animateMode|modo/i.test(m.text())) errs.push("console: " + m.text()); });
await p.goto(`http://localhost:4600/workspace/?t=${id}`, { waitUntil: "domcontentloaded", timeout: 180000 });
await p.waitForFunction(() => typeof window.__hekatanRunModalAnimate === "function", { timeout: 180000 });
await new Promise(r => setTimeout(r, 3000));
await p.evaluate(() => window.__hekatanRunModalAnimate());
await p.waitForFunction(() => !!document.getElementById("modal-results")?.innerText?.includes("MODAL"), { timeout: 180000 }).catch(() => errs.push("sin tabla modal"));
await new Promise(r => setTimeout(r, 1500));
// ocultar la tabla modal para que no tape el modelo
await p.evaluate(() => { const t = document.getElementById("modal-results"); if (t) t.style.display = "none"; });
const v = await p.evaluate(() => document.querySelector("#viewer").getBoundingClientRect().toJSON());
const clip = { x: v.x, y: v.y, width: Math.min(1000, v.width), height: Math.min(800, v.height) };
const frames = [];
for (let k = 0; k < 16; k++) {
  await p.screenshot({ path: `${OUT}/f${String(k).padStart(2, "0")}.png`, clip });
  frames.push(await p.evaluate(() => {
    const s = window.__hekatanState?.() ?? null;
    return s;
  }));
  await new Promise(r => setTimeout(r, 90));
}
console.log(JSON.stringify({ id, modo, OUT, errs: errs.slice(0, 8) }));
await nav.close();
