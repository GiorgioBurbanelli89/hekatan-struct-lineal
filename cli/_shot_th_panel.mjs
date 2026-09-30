// Prueba del panel «Tiempo-historia» en el workspace: corre, grafica y anima (fotogramas).
import puppeteer from "puppeteer";
const [BASE, OUT, ex = "plantillas", q = ""] = process.argv.slice(2);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
const errores = []; pag.on("pageerror", (e) => errores.push(String(e))); pag.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
await pag.goto(`${BASE}/workspace/?t=${ex}${q ? "&" + q : ""}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
const hay = await pag.evaluate(() => !!window.__hekatanTiempoHistoria);
const t0 = Date.now();
await pag.evaluate(() => window.__hekatanTiempoHistoria.correr());
await new Promise((r) => setTimeout(r, 1500));
const info = await pag.evaluate(() => { const r = window.__hekatanTiempoHistoria.resultado(); return r ? { pasos: r.r.t.length, nodo: r.nodoControl, modos: r.r.nModos } : null; });
await pag.screenshot({ path: `${OUT}/th_${ex}_grafica.png` });
await pag.evaluate(() => window.__hekatanTiempoHistoria.animar());
await pag.evaluate(() => { for (const b of document.querySelectorAll("*")) { const t = b.textContent?.trim(); if ((t === "✕" || t === "×") && b.children.length === 0) { const r = b.getBoundingClientRect(); if (r.x > 1200 && r.y < 120) b.click(); } } });
for (let k = 0; k < 4; k++) { await new Promise((r) => setTimeout(r, 400)); await pag.screenshot({ path: `${OUT}/th_${ex}_anim${k}.png`, clip: { x: 300, y: 30, width: 780, height: 780 } }); }
console.log(JSON.stringify({ hay, info, ms: Date.now() - t0, errores: errores.slice(0, 5) }));
await nav.close();
