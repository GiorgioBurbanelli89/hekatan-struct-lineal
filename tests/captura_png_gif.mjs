// CAPTURA DE IMAGEN Y GIF en Hekatan Struct: 1) helpers (pngDataUrl/gifDataUrl) con un galpón puesto,
// 2) los botones REALES del panel Vista («📷 PNG de la vista», «🎞 GIF orbitando») con descarga,
// 3) que existan los botones de grabar (video / GIF de pantalla). Guarda los ficheros en OUT para MIRARLOS.
import puppeteer from "puppeteer";
import fs from "fs"; import path from "path";
const OUT = process.env.OUT || path.resolve("tests", "_salida_captura"); fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { force: true });
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const logs = []; p.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`)); const err = []; p.on("pageerror", (e) => err.push(e.message));
const cdp = await p.createCDPSession(); await cdp.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: OUT, eventsEnabled: true });
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
// galpón mínimo: 3 pórticos (columna + arco 5 nudos + columna) con correas
await p.evaluate(() => {
  const arco = [[-12, 3], [-6, 7], [0, 9], [6, 7], [12, 3]]; const pts = [], polys = [];
  for (const y of [0, 6, 12]) { const i0 = pts.length; pts.push([-12, y, 0]); arco.forEach(([x, z]) => pts.push([x, y, z])); pts.push([12, y, 0]);
    polys.push([i0, i0 + 1]); polys.push([i0 + 1, i0 + 2, i0 + 3, i0 + 4, i0 + 5]); polys.push([i0 + 5, i0 + 6]); }
  polys.push([]); window.__hekatanDrawingPoints.val = pts; window.__hekatanDrawingPolylines.val = polys; window.__hekatanRebuild?.();
  window.__hekatanSelectIds(["poly:4"]); window.__hekatanUnirPorticos("correas", { sinBase: true });
});
await w(1500);
const dataUrl = async (fn, ...a) => p.evaluate((fn, a) => window.hekatanStruct?.[fn]?.(...a), fn, a);
const guarda = (nom, du) => { const buf = Buffer.from(du.split(",")[1], "base64"); fs.writeFileSync(path.join(OUT, nom), buf); return buf; };
// 1) helpers
const png = await dataUrl("pngDataUrl");
check("pngDataUrl devuelve un PNG", !!png && png.startsWith("data:image/png"));
if (png) { const bf = guarda("helper.png", png); check("PNG con firma válida y > 10 KB", bf.subarray(1, 4).toString() === "PNG" && bf.length > 10000, `${bf.length} B`); }
const gif = await dataUrl("gifDataUrl", 12);
check("gifDataUrl devuelve un GIF", !!gif && gif.startsWith("data:image/gif"));
if (gif) { const bf = guarda("helper.gif", gif); check("GIF89a y > 20 KB", bf.subarray(0, 6).toString() === "GIF89a" && bf.length > 20000, `${bf.length} B`); }
// 2) botones reales del panel Vista (izquierdo)
await p.evaluate(() => { const t = document.querySelector("[class*=tp-lblv]"); });
const abrirPanelIzq = async () => p.evaluate(() => {
  const btns = [...document.querySelectorAll("button, div")].filter((e) => /^\s*[⟩〉>]\s*$/.test(e.textContent || "") && e.getBoundingClientRect().left < 80);
  if (btns[0]) btns[0].click(); return btns.length;
});
await abrirPanelIzq(); await w(600);
const hay = await p.evaluate(() => [...document.querySelectorAll(".tp-btnv_t")].map((e) => e.textContent.trim()));
const clic = (txt) => p.evaluate((txt) => { const e = [...document.querySelectorAll(".tp-btnv_t")].find((x) => x.textContent.includes(txt)); if (!e) return false; e.closest("button").click(); return true; }, txt);
await p.evaluate(() => { window.__desc = []; const o = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.download) { const n = this.download; fetch(this.href).then((r) => r.blob()).then((b) => window.__desc.push({ n, size: b.size, tipo: b.type })); } return o.apply(this, arguments); }; });
const sPng = hay.some((t) => t.includes("PNG de la vista")), sGif = hay.some((t) => t.includes("GIF orbitando"));
check("botón «PNG de la vista» presente", sPng, sPng ? "" : "botones visibles: " + hay.slice(0, 12).join(" | "));
check("botón «GIF orbitando» presente", sGif);
if (sPng) { await clic("PNG de la vista"); await w(2500); }
if (sGif) { await clic("GIF orbitando"); await w(20000); }
const desc = await p.evaluate(() => window.__desc);
const dPng = desc.find((d) => d.n === "hekatan_struct.png"), dGif = desc.find((d) => d.n === "hekatan_struct_orbita.gif");
check("el botón PNG descarga hekatan_struct.png (>10 KB, image/png)", !!dPng && dPng.size > 10000 && dPng.tipo === "image/png", JSON.stringify(dPng));
check("el botón GIF descarga hekatan_struct_orbita.gif (>20 KB, image/gif)", !!dGif && dGif.size > 20000 && dGif.tipo === "image/gif", JSON.stringify(dGif));
const tit = await p.evaluate(() => [...document.querySelectorAll(".tp-btnv_t")].map((e) => e.textContent.trim()).filter((t) => /PNG|GIF/.test(t)));
check("los títulos de los botones vuelven a su texto (sin «falló»)", tit.every((t) => !/falló/.test(t)), tit.join(" | "));
// 3) botones de grabar
const rec = await p.evaluate(() => ({ video: !!document.getElementById("hk-grabar-btn"), gif: !!document.getElementById("hk-gif-btn") }));
check("botón de grabar video (hk-grabar-btn)", rec.video); check("botón de GIF de pantalla (hk-gif-btn)", rec.gif);
fs.writeFileSync(path.join(OUT, "consola.txt"), logs.join("\n") + "\n" + err.join("\n"));
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan · salida en ${OUT}`);
await b.close(); process.exit(mal ? 1 : 0);
