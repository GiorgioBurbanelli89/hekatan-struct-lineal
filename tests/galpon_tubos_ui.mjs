// TUBO CIRCULAR (CHS) + designar barras por tipo + apoyos/cargas del galpón.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const err = []; p.on("pageerror", (e) => err.push(e.message));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
// 3 pórticos (columna, arco de 5 nudos, columna) en y=0,6,12 + correas + diagonales de un vano
await p.evaluate(() => {
  const arco = [[-12, 3], [-6, 7], [0, 9], [6, 7], [12, 3]]; const pts = [], polys = [];
  for (const y of [0, 6, 12]) { const i0 = pts.length; pts.push([-12, y, 0]); arco.forEach(([x, z]) => pts.push([x, y, z])); pts.push([12, y, 0]);
    polys.push([i0, i0 + 1]); polys.push([i0 + 1, i0 + 2, i0 + 3, i0 + 4, i0 + 5]); polys.push([i0 + 5, i0 + 6]); }
  polys.push([]); window.__hekatanDrawingPoints.val = pts; window.__hekatanDrawingPolylines.val = polys; window.__hekatanRebuild?.();
  window.__hekatanSelectIds(["poly:4"]); window.__hekatanUnirPorticos("correas", { sinBase: true });
  window.__hekatanSelectIds(["poly:4"]); window.__hekatanUnirPorticos("diagonales", {});
});
await w(400);
const por = (t) => p.evaluate((t) => window.__hekatanSelectByDir(t), t);
check("columnas = 6", (await por("columnas")) === 6);
check("arcos/pórticos = 12", (await por("porticos")) === 12);
check("correas = 10", (await por("correas")) === 10);
check("diagonales = 16", (await por("diagonales")) === 16);
const c = await p.evaluate(() => window.__hekatanChsProps("CHS 168.3x5"));
const A = Math.PI / 4 * (0.1683 ** 2 - 0.1583 ** 2), I = Math.PI / 64 * (0.1683 ** 4 - 0.1583 ** 4);
check("CHS 168.3×5: A e I del anillo", c && Math.abs(c.A - A) < 1e-9 && Math.abs(c.Iz - I) < 1e-12 && Math.abs(c.J - 2 * I) < 1e-12, JSON.stringify(c));
check("CHS inválido (t ≥ D/2) → null", (await p.evaluate(() => window.__hekatanChsProps("CHS 40x25"))) === null);
// aplicar CHS a las correas por el mismo evento que usa el panel
await por("correas");
await p.evaluate(() => { const ids = [...window.__hekatanSelection]; window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: "segs", ids, prop: "section", value: "CHS 88.9x3.2" } })); });
const n = await p.evaluate(() => window.__hekatanManualSections.size);
check("sección CHS asignada a 10 barras", n === 10, String(n));
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan`);
await b.close(); process.exit(mal ? 1 : 0);
