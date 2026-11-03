// UNIR PÓRTICOS: 3 pórticos (arco de 5 nudos + 2 columnas) en y=0,6,12 → botón «Correas» y «Diagonales en cruz».
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const err = []; p.on("pageerror", (e) => err.push(e.message));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
// pórtico: columna (−12,0)→(−12,3), arco 5 nudos hasta (12,3), columna (12,3)→(12,0)  [x, y, z]
const armar = () => p.evaluate(() => {
  const arco = [[-12, 3], [-6, 7], [0, 9], [6, 7], [12, 3]];
  const pts = [], polys = [];
  for (const y of [0, 6, 12]) {
    const i0 = pts.length;
    pts.push([-12, y, 0]); arco.forEach(([x, z]) => pts.push([x, y, z])); pts.push([12, y, 0]);
    polys.push([i0, i0 + 1]); polys.push([i0 + 1, i0 + 2, i0 + 3, i0 + 4, i0 + 5]); polys.push([i0 + 5, i0 + 6]);
  }
  polys.push([]);
  window.__hekatanDrawingPoints.val = pts; window.__hekatanDrawingPolylines.val = polys; window.__hekatanRebuild?.();
  return pts.length;
});
const n = await armar(); await w(400);
check("3 pórticos × 7 nudos", n === 21, String(n));
const nPoly = () => p.evaluate(() => window.__hekatanDrawingPolylines.val.filter((q) => q.length).length);
const sel = (ids) => p.evaluate((ids) => { const s = window.__hekatanSelection; return !!s; }, ids);
// designar el pórtico del medio por la API de selección si existe; si no, por pt:
const designar = () => p.evaluate(() => { const f = window.__hekatanSelectIds; if (f) { f([7,8,9,10,11,12,13].map((i) => "pt:" + i)); return true; } return false; });
const hay = await designar();
check("existe API de designación de nudos", hay);
const antes = await nPoly();
const r1 = await p.evaluate(() => window.__hekatanUnirPorticos?.("correas", { sinBase: true }));
const d1 = (await nPoly()) - antes;
// 5 nudos de arco + 0 columnas de base... los nudos 7..13 incluyen los 2 de base (sinBase) → 5 cadenas × 2 vanos = 10
check("correas: 5 cadenas × 2 vanos = 10 barras", r1 && r1.barras === 10 && d1 === 10, JSON.stringify(r1));
const r1b = await p.evaluate(() => window.__hekatanUnirPorticos?.("correas", { sinBase: true }));
check("correas no se duplican", r1b && r1b.barras === 0, JSON.stringify(r1b));
await p.evaluate(() => window.__hekatanUndo?.());
const r2 = await p.evaluate(() => window.__hekatanUnirPorticos?.("correas", { sinBase: false }));
check("con base: 7 cadenas × 2 vanos = 14", r2 && r2.barras === 14, JSON.stringify(r2));
await p.evaluate(() => { window.__hekatanUndo?.(); window.__hekatanSelectIds(["poly:4"]); });
const r3 = await p.evaluate(() => window.__hekatanUnirPorticos?.("diagonales", {}));
check("diagonales: 4 tramos × 2 vanos × 2 (cruz) = 16", r3 && r3.barras === 16, JSON.stringify(r3));
const r4 = await p.evaluate(() => { window.__hekatanUndo?.(); window.__hekatanSelectIds(["poly:4"]); return window.__hekatanUnirPorticos?.("diagonales", { cadaN: 2 }); });
check("cada 2 vanos: solo el primero = 8", r4 && r4.barras === 8, JSON.stringify(r4));
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan`);
await b.close(); process.exit(mal ? 1 : 0);
