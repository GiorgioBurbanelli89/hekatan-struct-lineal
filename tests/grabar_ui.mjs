// BOTONES DE GRABAR: ⏺ (vídeo MP4) y 🎞 (GIF de pantalla). Sin el diálogo de pantalla: se les da el flujo del lienzo
// (canvas.captureStream) por los ganchos hkGrabarDesde / hkGifDesde, que usan el MISMO camino que el botón.
import puppeteer from "puppeteer";
import fs from "fs"; import path from "path";
const OUT = process.env.OUT || path.resolve("tests", "_salida_captura"); fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox", "--auto-select-desktop-capture-source=Entire screen", "--use-fake-ui-for-media-stream"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const logs = []; p.on("workercreated", (wk) => logs.push("[worker] " + wk.url())); p.on("console", (m) => { if (/error|warn|grabar|gif/i.test(m.text())) logs.push(`[${m.type()}] ${m.text()}`); }); const err = []; p.on("pageerror", (e) => err.push(e.message));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
await p.evaluate(() => {
  const pts = [[-6, 0, 0], [-6, 0, 3], [6, 0, 3], [6, 0, 0]]; window.__hekatanDrawingPoints.val = pts; window.__hekatanDrawingPolylines.val = [[0, 1, 2, 3], []]; window.__hekatanRebuild?.();
  window.__desc = []; const o = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.download) { const n = this.download; fetch(this.href).then((r) => r.blob()).then((bl) => window.__desc.push({ n, size: bl.size, tipo: bl.type })); } return o.apply(this, arguments); };
});
await w(1000);
const vis = await p.evaluate(() => ["hk-grabar-btn", "hk-gif-btn"].map((id) => { const e = document.getElementById(id); if (!e) return [id, "no existe"]; const r = e.getBoundingClientRect(); const q = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return [id, r.width > 0 && (q === e || e.contains(q)) ? "visible" : "TAPADO/fuera", Math.round(r.left), Math.round(r.top)]; }));
console.log("  posiciones:", JSON.stringify(vis));
check("⏺ visible y clicable", vis[0][1] === "visible"); check("🎞 visible y clicable", vis[1][1] === "visible");
// ⏺ vídeo
const r1 = await p.evaluate(async () => {
  if (!window.hkGrabarDesde) return "sin gancho hkGrabarDesde";
  const cv = document.querySelector("canvas"); const fl = cv.captureStream(30);
  const ok = await window.hkGrabarDesde(fl); return String(ok);
});
console.log("  hkGrabarDesde →", r1);
await w(3500);
const txt = await p.evaluate(() => document.getElementById("hk-grabar-btn")?.textContent);
check("al grabar, el botón pasa a ⏹ con reloj", /⏹/.test(txt || ""), txt);
await p.evaluate(() => window.hkGrabar()); await w(4000);
const d1 = await p.evaluate(() => window.__desc.find((d) => /\.mp4$|\.webm$/.test(d.n)));
check("⏺ descarga un vídeo (> 20 KB)", !!d1 && d1.size > 20000, JSON.stringify(d1));
if (d1) { const ext = d1.n.split(".").pop(); const buf = await p.evaluate(async () => { return null; }); }
// 🎞 GIF de pantalla
const r2 = await p.evaluate(async () => {
  if (!window.hkGifDesde) return "sin gancho hkGifDesde";
  const cv = document.createElement("canvas"); cv.width = 800; cv.height = 500; const g = cv.getContext("2d"); let k = 0;
  setInterval(() => { g.fillStyle = "#0b1220"; g.fillRect(0, 0, 800, 500); g.fillStyle = "#38bdf8"; g.fillRect(40 + (k++ % 60) * 10, 150, 120, 120); }, 50);
  const fl = cv.captureStream(10);
  window.__gifP = window.hkGifDesde(fl).catch((e) => "error: " + e.message); return "arrancó";
});
console.log("  hkGifDesde →", r2);
await w(3500); const tG = await p.evaluate(() => document.getElementById("hk-gif-btn")?.textContent); console.log("  botón durante la grabación:", tG, "| promesa:", await p.evaluate(() => Promise.race([window.__gifP, new Promise((r) => setTimeout(() => r("(sigue corriendo)"), 300))])));
await p.evaluate(() => window.hkGifParar?.());
let d2; for (let i = 0; i < 45 && !d2; i++) { await w(1000); d2 = await p.evaluate(() => window.__desc.find((d) => /\.gif$/.test(d.n))); }
console.log("  aviso:", await p.evaluate(() => document.getElementById("hk-grabar-aviso")?.textContent));
check("🎞 descarga un GIF (> 10 KB, image/gif)", !!d2 && d2.size > 10000 && d2.tipo === "image/gif", JSON.stringify(d2));
fs.writeFileSync(path.join(OUT, "grabar_consola.txt"), logs.join("\n") + "\n" + err.join("\n"));
if (logs.length) console.log("  consola:\n   " + logs.slice(0, 8).join("\n   "));
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan`);
await b.close(); process.exit(mal ? 1 : 0);
