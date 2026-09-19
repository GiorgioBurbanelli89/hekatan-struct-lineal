// Tutor FEM: abre el ejemplo zapata-excentrica, pulsa «🎓 Tutor FEM», baja por «¿De dónde sale?» y captura.
//   node cli/_shot_tutor_fem.mjs [puerto] [idioma es|en]
import puppeteer from "puppeteer";
const PORT = process.argv[2] ?? "4617", LANG = process.argv[3] ?? "es";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", `--lang=${LANG}`] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 200)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const D = "cli/shots/tutor";
await pag.goto(`http://localhost:${PORT}/workspace/?t=zapata-excentrica`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.evaluate((l) => { try { localStorage.setItem("hk_tutor_lang", l); } catch {} }, LANG);
await espera(5000);
await pag.click("#hk-tutor-btn"); await espera(12000);
await pag.screenshot({ path: `${D}/01_${LANG}_tutor_abierto.png` });
const clic = async (txt) => { const ok = await pag.evaluate((t) => { const b = [...document.querySelectorAll("#hk-tutor button, #hk-tutor .ent")].find((x) => x.textContent.includes(t)); if (b) { b.click(); return true; } return false; }, txt); await espera(9000); return ok; };
console.log("K:", await clic(LANG === "es" ? "¿Cómo se calcula" : "How is the stiffness"));
await pag.screenshot({ path: `${D}/02_${LANG}_K.png` });
console.log("B:", await clic("B: ")); await pag.screenshot({ path: `${D}/03_${LANG}_B.png` });
console.log("N:", await clic("N: ")); await pag.screenshot({ path: `${D}/04_${LANG}_N.png` });
console.log("up:", await clic("⬆")); console.log("J:", await clic("J: ")); await pag.screenshot({ path: `${D}/05_${LANG}_J.png` });
console.log("migas:", await pag.evaluate(() => window.__hekatanTutorCadena));
console.log("calc:", await pag.evaluate(() => { document.querySelector('#hk-tutor [data-a="calc"]').click(); return true; })); await espera(10000);
await pag.screenshot({ path: `${D}/06_${LANG}_calculadora.png` });
console.log("errores:", errs.length, errs.slice(0, 5));
await nav.close();
