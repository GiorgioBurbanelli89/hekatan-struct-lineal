// SNAP (F9) a los cruces de la rejilla: el punto tiene que caer en múltiplos de la SEPARACIÓN de la
// rejilla que se ve (gridStep), no del «Paso cursor». Mueve el cursor por varios puntos entre líneas,
// lee la coordenada enganchada y saca un fotograma en planta.
// Uso: node cli/_snap_rejilla.mjs [url]  → cli/shots/snap/rejilla_*.png
import puppeteer from "puppeteer";
import fs from "node:fs";
const url = process.argv[2] || "http://localhost:4600/workspace/?t=new-blank";
const out = "cli/shots/snap"; fs.mkdirSync(out, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 }); await esp(4000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await esp(300); } catch (e) {} }
await pag.keyboard.press("Escape"); await esp(300);
// vista en PLANTA (tecla 1) y SNAP encendido
await pag.keyboard.press("1"); await esp(1200);
await pag.evaluate(() => { if (window.__hekatanSnapEnabled !== true) window.__hekatanToggleSnap?.(); });
await esp(400);
const cfg = await pag.evaluate(() => ({ minor: window.__hekatanGridConfig?.minorStep, pasoCursor: window.__hekatanSnap2D, snap: window.__hekatanSnapEnabled, plano: window.__hekatanCadState?.get?.()?.workPlane }));
console.log("rejilla:", JSON.stringify(cfg));
// punto del lienzo libre
const { cx, cy } = await pag.evaluate(() => {
  const libre = (x, y) => { const e = document.elementFromPoint(x, y); return e && e.tagName === "CANVAS"; };
  for (let y = 600; y > 250; y -= 25) for (let x = 1000; x > 400; x -= 25) if (libre(x, y) && libre(x - 200, y - 120) && libre(x + 280, y + 150)) return { cx: x, cy: y };
  return { cx: 800, cy: 450 };
});
const paso = cfg.minor || 1;
let malos = 0, i = 0;
for (const [dx, dy] of [[0, 0], [17, 9], [33, -21], [-26, 14], [51, 37], [-44, -30]]) {
  await pag.mouse.move(cx + dx - 3, cy + dy - 2); await esp(80);
  await pag.mouse.move(cx + dx, cy + dy); await esp(350);
  const p = await pag.evaluate(() => window.__hekatanCursorXYZ || null);
  const enCruce = p && [p[0], p[1]].every((v) => Math.abs(v / paso - Math.round(v / paso)) < 1e-6);
  if (!enCruce) malos++;
  console.log(`cursor (${cx + dx},${cy + dy}) → ${p ? p.map((v) => v.toFixed(3)).join(", ") : "sin punto"}  ${enCruce ? "EN CRUCE" : "FUERA DE CRUCE"}`);
  if (i++ < 2) await pag.screenshot({ path: `${out}/rejilla_${i}.png`, clip: { x: cx + dx - 200, y: cy + dy - 120, width: 400, height: 240 } });
}
console.log(`puntos fuera de cruce: ${malos} de 6 · pageerror: ${errores.length}`, errores.slice(0, 2));
await nav.close();
