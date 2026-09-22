// Comprueba que NINGUN flotante se pise, y recorta la zona para mirarla a ojo.
import puppeteer from "puppeteer";
const [url, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1500, height: 900 });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 13000));
const d = await p.evaluate(() => {
  const ids = ["hk-agente-explicar", "hk-agente-lanzador", "hk-caja-negra-btn", "hk-grabar-btn", "hk-gif-btn"];
  const R = ids.map((id) => { const e = document.getElementById(id); if (!e) return { id, falta: true };
    const r = e.getBoundingClientRect();
    return { id, l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), visible: e.style.display !== "none" && r.width > 0 }; });
  const pisan = [];
  for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
    const a = R[i], c = R[j];
    if (a.falta || c.falta || !a.visible || !c.visible) continue;
    if (a.l < c.r && c.l < a.r && a.t < c.b && c.t < a.b) pisan.push(`${a.id} × ${c.id}`);
  }
  const vis = R.filter((x) => !x.falta && x.visible);
  const caja = vis.length ? { l: Math.min(...vis.map(v => v.l)) - 20, t: Math.min(...vis.map(v => v.t)) - 20,
                              r: Math.max(...vis.map(v => v.r)) + 20, b: Math.max(...vis.map(v => v.b)) + 20 } : null;
  return { R, pisan, caja, ancho: window.innerWidth };
});
console.log("PISAN:", d.pisan.length ? d.pisan : "ninguno");
for (const x of d.R) console.log(" ", x.id.padEnd(22), x.falta ? "NO EXISTE" : `${x.l}-${x.r} , ${x.t}-${x.b}` + (x.visible ? "" : "  (oculto)"));
if (d.caja) await p.screenshot({ path: png, clip: { x: Math.max(0, d.caja.l), y: Math.max(0, d.caja.t),
  width: Math.min(d.caja.r - d.caja.l, d.ancho - Math.max(0, d.caja.l)), height: d.caja.b - d.caja.t } });
await b.close();
