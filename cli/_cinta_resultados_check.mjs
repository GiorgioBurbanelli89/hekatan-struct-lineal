// Sonda (30 s): la pestaña «Resultados» de la cinta mueve los MISMOS States que el panel
// Settings (deformedShape, frameResults, nodeResults, deformScale) sobre la cercha Warren.
//   node cli/_cinta_resultados_check.mjs [puerto]
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
const PUERTO = process.argv[2] || "4610";
const OUT = "cli/shots/cinta"; mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage();
const err = []; pag.on("pageerror", (e) => err.push(e.message.slice(0, 160)));
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
const heks = `http://localhost:${PUERTO}/tutoriales/warren.heks`;
await pag.goto(`http://localhost:${PUERTO}/workspace/?heks=${encodeURIComponent(heks)}`, { waitUntil: "networkidle2", timeout: 120000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await new Promise((r) => setTimeout(r, 4000));
await pag.evaluate(() => { window.__hekatanRibbonPlegar?.(false); });
await new Promise((r) => setTimeout(r, 500));
const clic = async (sel) => { const r = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel); if (!r) { console.log("x falta", sel); return; } await pag.mouse.click(r.x, r.y); await new Promise((q) => setTimeout(q, 700)); };
const boton = async (txt) => { const r = await pag.evaluate((t) => { const e = [...document.querySelectorAll("#hk-ribbon button")].find((b) => b.offsetParent && (b.textContent || "").includes(t)); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, txt); if (!r) { console.log("x falta botón", txt); return; } await pag.mouse.click(r.x, r.y); await new Promise((q) => setTimeout(q, 900)); };
const estado = () => pag.evaluate(() => { const s = window.__hekatanSettings(); return { def: s.deformedShape.rawVal, esc: s.deformScale.rawVal, barra: s.frameResults.rawVal, nudo: s.nodeResults.rawVal, msg: document.getElementById("hk-ribbon-estado")?.textContent?.slice(0, 90) }; });
await clic("#hk-ribbon-tab-resultados");
console.log("inicio", JSON.stringify(await estado()));
await boton("Deformada"); console.log("Deformada", JSON.stringify(await estado()));
await boton("Más"); console.log("×2", JSON.stringify(await estado()));
await boton("Axil"); console.log("Axil", JSON.stringify(await estado()));
await pag.screenshot({ path: `${OUT}/res_axil.png` });
await boton("Momento"); console.log("Momento", JSON.stringify(await estado()));
await pag.screenshot({ path: `${OUT}/res_momento.png` });
await boton("Reacción"); console.log("Reacción", JSON.stringify(await estado()));
await pag.screenshot({ path: `${OUT}/res_reaccion.png` });
await boton("Diagrama 2D"); await new Promise((q) => setTimeout(q, 1500));
console.log("2D abierto:", await pag.evaluate(() => !!document.getElementById("hk-diagrama-2d") && getComputedStyle(document.getElementById("hk-diagrama-2d")).display !== "none"));
await pag.screenshot({ path: `${OUT}/res_2d.png` });
console.log("pageerror:", err.length ? err : "0");
await nav.close();
