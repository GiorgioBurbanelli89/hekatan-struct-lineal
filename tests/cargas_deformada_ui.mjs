// LAS CARGAS SIGUEN LA DEFORMADA: con «Deformada» encendida, las flechas de la carga distribuida viajan con la barra;
// la casilla «Cargas sobre la deformada» las deja en la geometría original.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const err = []; p.on("pageerror", (e) => err.push(e.message));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
await p.evaluate(() => {
  window.__hekatanDrawingPoints.val = [[-5, 0, 0], [-5, 0, 4], [5, 0, 4], [5, 0, 0]];
  window.__hekatanDrawingPolylines.val = [[0, 1, 2, 3], []]; window.__hekatanRebuild?.();
  const ev = (kind, ids, prop, value) => window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind, ids, prop, value } }));
  ev("nodes", ["pt:0", "pt:3"], "supports", [true, true, true, true, true, true]);
  ev("segs", ["seg:0:1"], "distLoad", [0, 0, -20]);
});
await w(1500);
const centroZ = (sobre) => p.evaluate(async (sobre) => {
  const el = [...document.querySelectorAll("*")].find((e) => e.__settings && e.__ctx); const s = el.__settings, ctx = el.__ctx;
  s.deformedShape.val = true; s.loads.val = true; s.deformScale.val = 500; s.loadsOnDeformed.val = sobre;
  await new Promise((r) => setTimeout(r, 600));
  const g = ctx.scene.getObjectByName("loadsGroup"); if (!g) return null;
  let zs = [], n = 0; for (const o of g.children) { const pos = o.geometry?.attributes?.position; if (!pos) continue; for (let i = 0; i < pos.count; i++) { zs.push(pos.getZ(i)); n++; } }
  return zs.length ? { n, zMin: Math.min(...zs), zMax: Math.max(...zs) } : { n: 0 };
}, sobre);
const a = await centroZ(true), c = await centroZ(false);
console.log("  sobre la deformada:", JSON.stringify(a), "| sobre la original:", JSON.stringify(c));
check("hay flechas de la carga distribuida", a && a.n > 0 && c && c.n > 0);
check("con la casilla encendida las flechas bajan con la viga (zMax menor que en la geometría original)", a && c && a.zMax < c.zMax - 0.01, a && c ? `Δ = ${(c.zMax - a.zMax).toFixed(3)} m` : "");
check("sin errores de página", err.length === 0, err.join(" | "));
console.log(`\n${ok} ok · ${mal} fallan`);
await b.close(); process.exit(mal ? 1 : 0);
