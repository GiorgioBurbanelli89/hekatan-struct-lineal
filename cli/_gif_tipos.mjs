// Fotogramas: tipos de barra por color + puntos de articulación, en el modelo abierto desde un enlace.
import puppeteer from "puppeteer";
const [enlace, dir] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
await p.goto(enlace, { waitUntil: "networkidle2", timeout: 240000 });
await new Promise((r) => setTimeout(r, 40000));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const set = (k, v) => p.evaluate((k, v) => { const s = window.__hekatanSettings(); if (s[k]) s[k].val = v; }, k, v);
await set("deformedShape", false); await set("nodes", false); await set("loads", false); await set("shellResults", "none"); await set("colorByType", true); await set("articulaciones", true);
await p.evaluate(() => { for (const id of ["parameters", "settings"]) { const e = document.getElementById(id); if (e) e.style.display = "none"; } });
await p.evaluate(() => window.__hekatanSetView("iso")); await espera(2500);
let k = 0; const foto = async () => { await p.screenshot({ path: `${dir}/f${String(k++).padStart(2, "0")}.png` }); };
await foto();
// acercar la cámara al centro: 3 pasos
const ctx = () => p.evaluate((f) => { const c = window.__hekatanViewerCtx(); const cam = c.camera; const t = c.controls.target;
  cam.position.lerp(t, f); if (cam.isOrthographicCamera) { cam.zoom /= (1 - f); cam.updateProjectionMatrix(); } c.controls.update(); c.render(); }, 0.35);
for (let i = 0; i < 3; i++) { await ctx(); await espera(900); await foto(); }
await set("articulaciones", false); await espera(1200); await foto();
await set("articulaciones", true); await espera(1200); await foto();
await p.evaluate(() => window.__hekatanSetView("plan")); await espera(2500); await foto();
console.log("fotos", k, "errores", errs.slice(0, 3));
const info = await p.evaluate(() => ({ ley: document.getElementById("hk-leyenda-tipos")?.style.display, ctx: Object.keys(window.__hekatanViewerCtx() ?? {}) }));
console.log(JSON.stringify(info));
await b.close();
