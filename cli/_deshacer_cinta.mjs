// Botones «Anterior» (Ctrl+Z) y «Rehacer» (Ctrl+Y) de la cinta: dibuja una línea, pulsa Anterior
// (tiene que desaparecer) y Rehacer (tiene que volver). Fotograma de la cinta.
// Uso: node cli/_deshacer_cinta.mjs [url]  → cli/shots/cinta/{cinta,deshecho,rehecho}.png
import puppeteer from "puppeteer";
import fs from "node:fs";
const url = process.argv[2] || "http://localhost:4600/workspace/?t=new-blank";
const out = "cli/shots/cinta"; fs.mkdirSync(out, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 }); await esp(4000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await esp(300); } catch (e) {} }
await pag.keyboard.press("Escape"); await esp(300);
const boton = (re) => pag.evaluate((re) => { const b = [...document.querySelectorAll("#hk-ribbon button")].find((b) => new RegExp(re).test(b.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, txt: b.textContent.replace(/\s+/g, " ").trim() }; }, re);
const segs = () => pag.evaluate(() => (window.__hekatanDrawingPolylines?.rawVal ?? []).reduce((s, p) => s + Math.max(0, p.length - 1), 0));
const ant = await boton("Anterior"), reh = await boton("Rehacer");
console.log("botones:", ant?.txt, "|", reh?.txt);
const cinta = await pag.evaluate(() => { const r = document.getElementById("hk-ribbon").getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
await pag.screenshot({ path: `${out}/cinta.png`, clip: cinta });
const lin = await boton("^\\s*\\S*\\s*Línea");
await pag.mouse.click(lin.x, lin.y); await esp(400);
await pag.mouse.click(700, 550); await esp(300);
await pag.mouse.move(900, 560); await esp(200);
await pag.mouse.click(900, 560); await esp(300);
await pag.keyboard.press("Escape"); await esp(400);
const n0 = await segs(); console.log("tramos tras dibujar:", n0);
await pag.mouse.click(ant.x, ant.y); await esp(600);
const n1 = await segs(); console.log("tras Anterior:", n1);
await pag.screenshot({ path: `${out}/deshecho.png`, clip: { x: 550, y: 430, width: 500, height: 250 } });
await pag.mouse.click(reh.x, reh.y); await esp(600);
const n2 = await segs(); console.log("tras Rehacer:", n2);
await pag.screenshot({ path: `${out}/rehecho.png`, clip: { x: 550, y: 430, width: 500, height: 250 } });
console.log(n0 > 0 && n1 < n0 && n2 === n0 ? "OK: Anterior deshace y Rehacer rehace" : "FALLA", "· pageerror:", errores.length, errores.slice(0, 2));
await nav.close();
