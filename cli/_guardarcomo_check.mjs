// «Guardar como…» de la barra de arriba con un modelo dibujado: prompt → nombre → descarga con ese nombre y la barra lo muestra
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
pag.on("dialog", (d) => { console.log("dialogo:", d.type(), d.message()); d.accept("cercha_warren"); });
await pag.evaluateOnNewDocument(() => { Object.defineProperty(window, "showSaveFilePicker", { value: undefined, configurable: true }); const o = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () { if (this.download && /^blob:/.test(this.href)) { fetch(this.href).then((r) => r.text()).then((t) => { window.__desc = { nombre: this.download, t }; }); return; } return o.call(this); }; });
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 5000));
const w = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.evaluate(() => { window.__hekatanDrawingPoints.val = [[0, 0, 0], [2, 0, 0], [1, 0, 2]]; window.__hekatanDrawingPolylines.val = [[0, 1, 2, 0]]; window.__hekatanManualSupports.set(0, [true, true, true, true, true, true]); window.__hekatanManualSupports.set(1, [true, true, true, true, true, true]); window.__hekatanManualLoads.set(2, [0, 0, -10, 0, 0, 0]); window.__hekatanRebuild?.(); });
await w(1200);
const b = await pag.evaluate(() => { const b = document.querySelector('#hk-cad-tit button[title="Guardar como"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
console.log("boton:", JSON.stringify(b), "onclick:", await pag.evaluate(() => typeof document.querySelector('#hk-cad-tit button[title="Guardar como"]').onclick), "encima:", await pag.evaluate((b) => { const e = document.elementFromPoint(b.x, b.y); return e && (e.tagName + "#" + e.id + "." + e.className + " " + e.title); }, b)); await pag.mouse.click(b.x, b.y); await w(1000);
console.log("descarga:", JSON.stringify(await pag.evaluate(() => window.__desc && { nombre: window.__desc.nombre, bytes: window.__desc.t.length })), "barra:", await pag.evaluate(() => document.querySelector("#hk-cad-tit .doc")?.textContent));
await nav.close();
