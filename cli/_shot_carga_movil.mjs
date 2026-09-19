// Captura la alcantarilla con carga móvil en el workspace local: consola, tiempos y PNG en varios instantes.
// uso: node cli/_shot_carga_movil.mjs <url-base> <carpeta-salida> [id] [lang]
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:4633";
const out = process.argv[3] ?? "cli/shots/carga_movil";
const id = process.argv[4] ?? "alcantarilla-carga-movil";
const lang = process.argv[5] ?? "es";
mkdirSync(out, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--window-size=1600,900"] });
const pg = await nav.newPage();
await pg.setViewport({ width: 1600, height: 900 });
const log = [];
pg.on("console", (m) => log.push(`[${m.type()}] ${m.text()}`));
pg.on("pageerror", (e) => log.push(`[pageerror] ${e.message}`));
await pg.evaluateOnNewDocument((l) => { try { localStorage.setItem("hk_lang", l); } catch {} }, lang);
const t0 = Date.now();
await pg.goto(`${base}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
// espera a que la envolvente esté lista
await pg.waitForFunction(() => !!window.__hekatanCargaMovilDatos, { timeout: 180000 });
const tListo = Date.now() - t0;
const perf = await pg.evaluate(() => { const d = window.__hekatanCargaMovilDatos; return { IL: d.IL.ms, env: d.env.ms, nPos: d.xs.length, nCasos: d.IL.camino.nudos.length }; });
const fotos = [0.1, 0.45, 0.85];
const a = await pg.evaluate(() => window.__hekatanCargaMovil.estado());
for (const f of fotos) {
  await pg.evaluate((k) => { const A = window.__hekatanCargaMovil; A.pausa(); A.ir(k); }, Math.round(f * (a.n - 1)));
  await new Promise((r) => setTimeout(r, 400));
  await pg.screenshot({ path: `${out}/pos_${Math.round(f * 100)}.png` });
}
// alzado XZ (de frente, desde −Y) en la posición central
await pg.evaluate((k) => {
  const A = window.__hekatanCargaMovil; A.pausa(); A.ir(k);
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__settings); const c = v.__ctx;
  const t = c.controls.target; const dist = c.camera.position.distanceTo(t);
  c.camera.position.set(t.x, t.y - dist, t.z); c.camera.up.set(0, 0, 1); c.camera.lookAt(t); c.controls.update(); c.render();
}, Math.round(0.45 * (a.n - 1)));
await new Promise((r) => setTimeout(r, 500));
await pg.screenshot({ path: `${out}/alzado_xz.png` });
// planta XY (desde arriba): la franja de 1 m bajo las ruedas
await pg.evaluate(() => {
  const v = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__settings); const c = v.__ctx;
  const t = c.controls.target; const dist = c.camera.position.distanceTo(t);
  c.camera.position.set(t.x, t.y - 0.001, t.z + dist); c.camera.up.set(0, 1, 0); c.camera.lookAt(t); c.controls.update(); c.render();
});
await new Promise((r) => setTimeout(r, 500));
await pg.screenshot({ path: `${out}/planta_xy.png` });
await pg.evaluate(() => { const v = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__settings); v.__ctx.camera.up.set(0, 0, 1); });
await pg.evaluate(() => { document.querySelector("#hkcm-env")?.click(); });
await new Promise((r) => setTimeout(r, 500));
await pg.screenshot({ path: `${out}/envolvente.png` });
// rendimiento reproduciendo
await pg.evaluate(() => window.__hekatanCargaMovil.play());
await new Promise((r) => setTimeout(r, 3000));
const est = await pg.evaluate(() => window.__hekatanCargaMovil.estado());
writeFileSync(`${out}/consola.txt`, log.join("\n"));
console.log(JSON.stringify({ msHastaListo: tListo, ...perf, cuadro: est }, null, 1));
console.log("errores:", log.filter((l) => /pageerror|\[error\]/.test(l)).slice(0, 10).join("\n"));
await nav.close();
