// Diagnóstico: por qué al teclear en reposo el panel junto a la cruz no aparece en el BUILD.
import puppeteer from "puppeteer";
const url = process.argv[2];
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
const msgs = []; pag.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") msgs.push(m.type() + ": " + m.text().slice(0, 200)); });
pag.on("pageerror", (e) => msgs.push("PAGEERROR: " + String(e).slice(0, 300)));
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 }); await esp(4000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await esp(300); } catch (e) {} }
await pag.keyboard.press("Escape"); await esp(300);
const est = (t) => pag.evaluate((t) => { const d = document.getElementById("hk-dyn"); return `${t}: dyn=${d?.style.display} left=${d?.style.left} top=${d?.style.top} dynTexto=${document.getElementById("hk-dyn-input")?.value} foco=${document.activeElement?.id || document.activeElement?.tagName} rubber=${document.getElementById("hk-rubber-label")?.style.display}`; }, t);
for (let i = 0; i < 6; i++) { await pag.mouse.move(1040 + i * 12, 595 + i * 6); await esp(80); }
await esp(500); console.log(await est("reposo"));
if (process.argv[3] === "foto-antes") { await pag.screenshot({ path: "cli/shots/cursor/_diag_antes.png", clip: { x: 880, y: 485, width: 520, height: 300 } }); console.log(await est("tras foto de reposo")); }
await pag.keyboard.type("L"); console.log(await est("tras teclear (0 ms)")); await esp(300); console.log(await est("tras teclear (300 ms)"));
await pag.mouse.move(1102, 626); await esp(100); console.log(await est("tras mover (100 ms)")); await esp(600); console.log(await est("tras mover (700 ms)"));
await pag.screenshot({ path: "cli/shots/cursor/tecleando_build.png", clip: { x: 880, y: 485, width: 520, height: 300 } }); console.log(await est("tras foto final"));
console.log("mensajes:", msgs.length); for (const m of msgs.slice(0, 12)) console.log("  ", m);
await nav.close();
