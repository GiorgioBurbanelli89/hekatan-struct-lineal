import puppeteer from "puppeteer";
const id = process.argv[2] ?? "edificio-dual", campo = process.argv[3] ?? "vonMises";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const r = await p.evaluate((campo) => {
  const s = window.__hekatanSettings?.(); if (s?.shellResults) s.shellResults.val = campo;
  const ctx = [...document.querySelectorAll("div")].map(d => d.__ctx).find(Boolean); ctx.render?.();
  const nodos = { muroY0: 1399, muroXL: 1678, losaTop: 76 }; const out = [];
  ctx.scene.traverse((o) => { if (!o.isMesh && !o.isLineSegments && !o.isPoints) return; const g = o.geometry; const a = g?.attributes || {}; const vis = []; let q = o; while (q) { vis.push(q.visible); q = q.parent; }
    const row = { name: o.name || o.type, type: o.type, visible: vis.every(Boolean), nVerts: a.position?.count, attrs: Object.keys(a).join(","), mat: o.material?.type, opacity: o.material?.opacity, transparent: o.material?.transparent, depthWrite: o.material?.depthWrite, depthTest: o.material?.depthTest, renderOrder: o.renderOrder, side: o.material?.side };
    if (a.scalar && a.position.count > 6000) row.scalars = Object.fromEntries(Object.entries(nodos).map(([k, i]) => [k, +a.scalar.getX(i).toFixed(3)]));
    if (a.position?.count > 1000) out.push(row); });
  return out;
}, campo);
console.log(JSON.stringify(r, null, 0)); await nav.close();
