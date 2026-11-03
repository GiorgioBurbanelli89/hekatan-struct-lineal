// CUBIERTA (paños entre pórticos), ZAPATAS bajo columnas, propiedades POR ÁREA y unidades de la base de materiales.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const err = []; p.on("pageerror", (e) => err.push(e.message)); const logs = []; p.on("console", (m) => logs.push(m.text()));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
await p.evaluate(() => {
  const arco = [[-12, 3], [-6, 7], [0, 9], [6, 7], [12, 3]]; const pts = [], polys = [];
  for (const y of [0, 6, 12]) { const i0 = pts.length; pts.push([-12, y, 0]); arco.forEach(([x, z]) => pts.push([x, y, z])); pts.push([12, y, 0]);
    polys.push([i0, i0 + 1]); polys.push([i0 + 1, i0 + 2, i0 + 3, i0 + 4, i0 + 5]); polys.push([i0 + 5, i0 + 6]); }
  polys.push([]); window.__hekatanDrawingPoints.val = pts; window.__hekatanDrawingPolylines.val = polys; window.__hekatanRebuild?.();
});
await w(400);
const ev = (f, ...a) => p.evaluate(f, ...a);
// materiales: kN y m
const m = await ev(() => window.__hekatanMaterialDB["A53Gr.B"]);
check("A53Gr.B en kN/m²: E ≈ 2e8 y peso ≈ 77 kN/m³", m && m.E > 1.9e8 && m.E < 2.1e8 && m.rho > 70 && m.rho < 80, JSON.stringify(m));
// cubierta
await ev(() => window.__hekatanSelectIds(["poly:4"]));
const c1 = await ev(() => window.__hekatanUnirPorticos("cubierta", {}));
check("cubierta: 4 tramos de arco × 2 vanos = 8 paños", c1 && c1.barras === 8, JSON.stringify(c1));
await ev(() => window.__hekatanSelectIds(["poly:4"]));
const c2 = await ev(() => window.__hekatanUnirPorticos("cubierta", {}));
check("cubierta no se duplica", c2 && c2.barras === 0, JSON.stringify(c2));
const na = await ev(() => window.__hekatanDrawingAreas.val.length);
check("hay 8 áreas dibujadas", na === 8, String(na));
// zapatas
await ev(() => window.__hekatanSelectByDir("columnas"));
const z = await ev(() => window.__hekatanZapatasBajoColumnas(2));
check("6 zapatas bajo las 6 columnas", z === 6, String(z));
check("designar zapatas = 6 y cubierta = 8", (await ev(() => window.__hekatanSelectByDir("zapatas"))) === 6 && (await ev(() => window.__hekatanSelectByDir("cubierta"))) === 8);
// propiedades por área: zapata 0.5 m hormigón, cubierta 0.5 mm acero membrana
await ev(() => { window.__hekatanSelectByDir("zapatas"); const ids = [...window.__hekatanSelection];
  for (const [prop, value] of [["shellType", "Mindlin (FSDT)"], ["thickness", 0.5], ["material", "C25/30"]]) window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: "areas", ids, prop, value } })); });
await ev(() => { window.__hekatanSelectByDir("cubierta"); const ids = [...window.__hekatanSelection];
  for (const [prop, value] of [["shellType", "Plane stress"], ["thickness", 0.0005], ["material", "A36"]]) window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: "areas", ids, prop, value } })); });
const ma = await ev(() => [...window.__hekatanManualArea.values()]);
check("14 áreas con propiedades propias", ma.length === 14, String(ma.length));
check("zapata 0.5 y cubierta 0.0005", ma.filter((a) => a.thickness === 0.5).length === 6 && ma.filter((a) => a.thickness === 0.0005).length === 8);
await w(800);
const lineas = logs.filter((l) => /\[NewBlank\]/.test(l)).slice(-3);
console.log("  " + lineas.join("\n  "));
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan`);
await b.close(); process.exit(mal ? 1 : 0);
