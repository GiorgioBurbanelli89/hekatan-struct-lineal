// Captura del ejemplo zapata-excentrica (Das ej. 6.10) en el dev server del worktree: ¿abre calculado
// y con la presión de contacto? PNG en cli/shots/zapata/.   node cli/_shot_zapata_das.mjs [puerto]
import puppeteer from "puppeteer";
const PORT = process.argv[2] ?? "4617";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 200)));
pag.on("console", (m) => { if (m.type() === "error") errs.push("CE:" + m.text().slice(0, 200)); if (/solo compresión|presión Winkler|Solve OK/.test(m.text())) console.log("  consola:", m.text().slice(0, 200)); });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto(`http://localhost:${PORT}/workspace/?t=zapata-excentrica`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.screenshot({ path: "cli/shots/zapata/01_abre.png" });
const info = await pag.evaluate(() => ({ contacto: window.__hekatanCliContacto, eq: window.__hekatanCliEquilibrio,
  shell: (window.__hekatanSettings?.() ?? {}).shellResults?.val }));
console.log(JSON.stringify(info));
// vista en planta desde arriba para ver el mapa de presión
await pag.evaluate(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); if (!h) return; const c = h.__ctx;
  c.camera.position.set(0.75, 0.75, 6); c.camera.up.set(0, 1, 0); c.controls.target.set(0.75, 0.75, 0); c.camera.lookAt(0.75, 0.75, 0); c.controls.update(); c.render(); });
await espera(800);
await pag.screenshot({ path: "cli/shots/zapata/02_planta_presion.png" });
console.log("errores:", errs.length, errs.slice(0, 6));
await nav.close();
