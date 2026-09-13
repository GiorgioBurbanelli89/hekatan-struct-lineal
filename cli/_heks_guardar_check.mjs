// «Guardar .heks» con el cuadro CLI vacío: el .heks del modelo DIBUJADO (nudos, barras, apoyos, cargas, frameload)
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); pag.on("pageerror", (e) => console.log("PAGEERROR", String(e).slice(0, 400))); pag.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE", m.text().slice(0, 300)); }); await pag.setViewport({ width: 1280, height: 720 });
await pag.evaluateOnNewDocument(() => { const o = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () { if (this.download && /^blob:/.test(this.href)) { fetch(this.href).then((r) => r.text()).then((t) => { window.__desc = { nombre: this.download, t }; }); return; } return o.call(this); }; });
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 6000)); console.log("hooks:", await pag.evaluate(() => Object.keys(window).filter((k) => /^__hekatanDrawing/.test(k)).join(",")));
const w = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.evaluate(() => {
  window.__hekatanDrawingPoints.val = [[0, 0, 0], [2, 0, 0], [4, 0, 0], [1, 0, 2], [3, 0, 2]];
  window.__hekatanDrawingPolylines.val = [[0, 1, 2], [3, 4], [0, 3, 1, 4, 2]];
  window.__hekatanManualSupports.set(0, [true, true, true, true, true, true]); window.__hekatanManualSupports.set(2, [true, true, true, true, true, true]);
  window.__hekatanManualLoads.set(3, [0, 0, -10, 0, 0, 0]);
  window.__hekatanManualDistLoads.set("1:0", [0, 0, -5]);
  window.__hekatanRebuild?.();
});
await w(1500);
const btn = await pag.evaluate(() => { const b = [...document.querySelectorAll("button")].find((b) => /Guardar \.heks/.test(b.textContent || "")); if (!b) return null; b.click(); return true; });
await w(800);
const d = await pag.evaluate(() => window.__desc);
console.log("boton:", btn, "descarga:", d?.nombre, d ? d.t.length + " bytes" : "-"); console.log(d?.t);
await nav.close();
