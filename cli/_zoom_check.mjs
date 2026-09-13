import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(3000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await espera(300); } catch (e) {} }
const b = await pag.evaluate(() => { const b = [...document.querySelectorAll("#hk-ribbon button")].find((b) => /Frente/.test(b.textContent)); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
await pag.mouse.click(b.x, b.y); await espera(600);
const cam = () => pag.evaluate(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; return { tipo: c.camera.type, zoom: c.camera.zoom, enableZoom: c.controls.enableZoom, pos: c.camera.position.toArray().map((v) => +v.toFixed(2)) }; });
console.log("antes", JSON.stringify(await cam()));
const q = await pag.evaluate(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const r = h.querySelector("canvas").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 + 80 }; });
await pag.mouse.move(q.x, q.y); await espera(200);
for (let i = 0; i < 6; i++) { await pag.mouse.wheel({ deltaY: -120 }); await espera(150); }
await espera(500); console.log("despues", JSON.stringify(await cam()));
await nav.close();
