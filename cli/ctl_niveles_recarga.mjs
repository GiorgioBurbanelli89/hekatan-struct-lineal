/**
 * Niveles y ejes del Modo Revit SOBREVIVEN a recargar (F5), como el dibujo (18-oct-2026), con clics reales.
 *   node cli/ctl_niveles_recarga.mjs [--base URL]
 */
import puppeteer from "puppeteer";
const args = process.argv.slice(2); const ib = args.indexOf("--base"); const BASE = ib >= 0 ? args[ib + 1] : "http://localhost:4600";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push(e.message));
const ev = (f, a) => pag.evaluate(f, a);
const filas = []; const ok = (q, c, d = "") => { filas.push(!!c); console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  · " + d : ""}`); };
const centro = (sel) => ev((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; }, sel);
const boton = (re, dentro = "#hk-revit") => ev(([re, d]) => { const b = [...document.querySelectorAll(`${d} button`)].find((b) => new RegExp(re).test(b.textContent) && b.getBoundingClientRect().width > 0); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, [re, dentro]);
const clic = async (c, n = "?") => { if (!c) throw new Error("no está en pantalla: " + n); await pag.mouse.move(c[0], c[1], { steps: 3 }); await pag.mouse.click(c[0], c[1]); await espera(350); };
const datos = () => ev(() => ({ niveles: (window.__hekatanLevels ?? []).map((l) => +l.z).sort((a, b) => a - b).join(","), ejes: (window.__hekatanAxisGrids ?? []).map((a) => a.label).sort().join(""), nudos: window.__hekatanDrawingPoints.rawVal.length,
  nav: [...document.querySelectorAll("#hk-revit .rv-niv[data-z]")].length }));
await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(4000);
if (!(await ev(() => document.body.classList.contains("hk-revit-on")))) await clic(await centro("#hk-revit-toggle"));
await clic(await centro('#hk-revit .rv-b[data-rv="ejes"]'), "Rejilla"); await clic(await boton("Crear"), "Crear"); await espera(1500);
const antes = await datos();
ok("rejilla creada: 5 niveles (0…12) y 9 ejes (A–E, 1–4)", antes.niveles === "0,3,6,9,12" && antes.ejes.length === 9, JSON.stringify(antes));
await pag.reload({ waitUntil: "networkidle2" }); await espera(5000);
const despues = await datos();
ok("tras F5: los MISMOS niveles y ejes, y el navegador los lista", despues.niveles === antes.niveles && despues.ejes === antes.ejes && despues.nav === 5, JSON.stringify(despues));
ok("tras F5: el dibujo también sigue (igual número de nudos)", despues.nudos === antes.nudos, `${despues.nudos} nudos`);
// «Nuevo» (con su cuadro) y F5: lienzo vacío, sin los ejes de antes
await clic(await centro('#hk-cad-tit button[title="Nuevo"]'), "Nuevo");
for (let i = 0; i < 20 && !(await ev(() => !!document.querySelector("#hk-confirmar"))); i++) await espera(50);
const si = await boton("Nuevo", "#hk-confirmar"); if (si) await clic(si, "Nuevo del cuadro");   // sin dibujo no pregunta await espera(800);
await pag.reload({ waitUntil: "networkidle2" }); await espera(5000);
const vacio = await datos();
ok("«Nuevo» y F5: sin dibujo y sin los ejes de antes", vacio.nudos === 0 && vacio.ejes === "", JSON.stringify(vacio));
// «Recuperarlo» en una pestaña NUEVA (sesión vacía): rejilla + columnas, otra pestaña, pulsar Recuperarlo
await clic(await centro('#hk-revit .rv-b[data-rv="ejes"]'), "Rejilla"); await clic(await boton("Crear"), "Crear"); await espera(1500);
await clic(await centro('#hk-revit .rv-niv[data-z="3"]'), "N+3"); await espera(600);
await clic(await centro('#hk-revit .rv-b[data-rv="columna"]'), "Columna"); await clic(await boton("En ejes · todos"), "En ejes"); await espera(800);
const conCol = await datos();
const pag2 = await nav.newPage(); await pag2.setViewport({ width: 1280, height: 720 }); pag2.on("pageerror", (e) => errs.push(e.message));
await pag2.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(4500);
const rec = await pag2.evaluate(() => { const b = [...document.querySelectorAll("button")].find((b) => /Recuperarlo/.test(b.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
if (rec) { await pag2.mouse.click(rec[0], rec[1]); await espera(1500); }
const recuperado = await pag2.evaluate(() => ({ niveles: (window.__hekatanLevels ?? []).map((l) => +l.z).sort((a, b) => a - b).join(","), ejes: (window.__hekatanAxisGrids ?? []).map((a) => a.label).sort().join(""), nudos: window.__hekatanDrawingPoints.rawVal.length }));
ok("pestaña nueva + «Recuperarlo»: vuelven el dibujo Y sus niveles y ejes", !!rec && recuperado.nudos === conCol.nudos && recuperado.niveles === conCol.niveles && recuperado.ejes === conCol.ejes, JSON.stringify({ rec: !!rec, conCol, recuperado }));
ok("sin errores de página", !errs.length, errs.slice(0, 2).join(" | "));
console.log(`${filas.filter(Boolean).length}/${filas.length} OK`); await nav.close(); process.exit(filas.every(Boolean) ? 0 : 1);
