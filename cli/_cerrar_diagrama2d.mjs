// La ✕ del «Diagrama 2D» tiene que cerrar la ventana. Abre un pórtico, abre el diagrama,
// pulsa la ✕ con el ratón y comprueba que ya no se ve (display calculado, no el atributo).
// Uso: node cli/_cerrar_diagrama2d.mjs [url]  → cli/shots/diagrama2d/{abierto,cerrado}.png
import puppeteer from "puppeteer";
import fs from "node:fs";
const url = process.argv[2] || "http://localhost:4600/workspace/?t=portico-2d";
const out = "cli/shots/diagrama2d"; fs.mkdirSync(out, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(5000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
const estado = () => pag.evaluate(() => { const h = document.getElementById("hk-diagrama-2d"); if (!h) return { existe: false }; return { existe: true, hidden: h.hidden, display: getComputedStyle(h).display, alto: h.getBoundingClientRect().height }; });
await pag.evaluate(() => window.__hekatanDiagrama2D?.()); await esp(1200);
const e1 = await estado(); console.log("abierto:", JSON.stringify(e1));
await pag.screenshot({ path: `${out}/abierto.png` });
const x = await pag.evaluate(() => { const b = document.querySelector("#hk-diagrama-2d .hk-d2-x"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
if (!x) { console.log("FALLA: no hay botón ✕"); await nav.close(); process.exit(1); }
await pag.mouse.click(x.x, x.y); await esp(600);
const e2 = await estado(); console.log("tras ✕:", JSON.stringify(e2));
await pag.screenshot({ path: `${out}/cerrado.png` });
// y se puede volver a abrir
await pag.evaluate(() => window.__hekatanDiagrama2D?.()); await esp(800);
const e3 = await estado(); console.log("reabierto:", JSON.stringify(e3));
const ok = e1.display !== "none" && e2.display === "none" && e3.display !== "none";
console.log(ok ? "OK: la ✕ cierra el Diagrama 2D y se puede reabrir" : "FALLA", "· pageerror:", errores.length, errores.slice(0, 2));
await nav.close();
process.exit(ok ? 0 : 1);
