// Menú «📐 Diseño» con las entradas de la zapata, Informe (Das 6.10 y datos propios de la plantilla),
// «❓ Explícame» en q_max → tutor en ese término → calculadora.   node cli/_shot_informe.mjs [puerto]
import puppeteer from "puppeteer";
const PORT = process.argv[2] ?? "4617", D = "cli/shots/informe";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 200)));
pag.on("dialog", async (d) => { errs.push("DIALOG:" + d.message()); await d.dismiss(); });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const abrir = async (q) => { await pag.goto(`http://localhost:${PORT}/workspace/${q}`, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.evaluate(() => { try { localStorage.setItem("hk_tutor_lang", "es"); } catch {} }); await espera(6000); };
await abrir("?t=zapata-excentrica");
await pag.click("#hk-diseno-btn"); await espera(800);
await pag.screenshot({ path: `${D}/01_menu_diseno.png` });
const entradas = await pag.evaluate(() => [...document.querySelectorAll("#hk-diseno-menu [data-id]")].map((d) => d.dataset.id));
console.log("menú Diseño:", entradas.join(", "));
await pag.evaluate(() => document.querySelector('#hk-diseno-menu [data-id="zapata-informe"]').click()); await espera(22000);
await pag.screenshot({ path: `${D}/02_informe_das.png` });
await pag.evaluate(() => [...document.querySelectorAll("#hk-tutor [data-paso]")].find((b) => b.dataset.paso === "q").click()); await espera(800);
await pag.screenshot({ path: `${D}/03_explicame_q.png` });
await pag.evaluate(() => document.querySelector('#hk-explicame [data-k="tecnico"]').click()); await espera(18000);
await pag.screenshot({ path: `${D}/04_tutor_en_q.png` });
console.log("cadena:", await pag.evaluate(() => window.__hekatanTutorCadena));
await pag.evaluate(() => window.__hekatanZapataHerramientas.explicame("q")); await espera(600);
await pag.evaluate(() => document.querySelector('#hk-explicame [data-k="calc"]').click()); await espera(18000);
await pag.screenshot({ path: `${D}/05_calculadora_q.png` });
await pag.evaluate(() => window.__hekatanZapataHerramientas.explicame("q")); await espera(600);
await pag.evaluate(() => document.querySelector('#hk-explicame [data-k="libro"]').click()); await espera(1500);
await pag.screenshot({ path: `${D}/06_libro_q.png` });
// plantilla con otros datos: 2.5 × 2.0, P 80, My 25 (e = 0.3125 > B/6 = 0.417? no) → e grande
await abrir("?t=zapata-levantamiento");
await pag.evaluate(() => { const P = window.__hekatanParams?.(); if (P) { P.Lx = 2.5; P.Ly = 2.0; P.xcol = 0; P.ycol = 0; P.P = 80; P.My = 40; P.Mx = 0; P.q_adm = 25; P.ks = 3000; P.n = 20; } window.__hekatanRebuild?.(); });
await espera(6000);
await pag.evaluate(() => window.__hekatanZapataHerramientas.informe()); await espera(22000);
await pag.screenshot({ path: `${D}/07_informe_plantilla.png` });
console.log("errores:", errs.length, errs.slice(0, 6));
await nav.close();
