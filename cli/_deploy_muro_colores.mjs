import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-dual`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const r = await p.evaluate(() => {
  const s = window.__hekatanSettings?.(); if (s?.shellResults) s.shellResults.val = "vonMises";
  const ctx = [...document.querySelectorAll("div")].map(d => d.__ctx).find(Boolean); ctx.render?.();
  const out = []; const N = window.__hekatanStates.nodes.val; const xL = Math.max(...N.map(n => n[0])), yL = Math.max(...N.map(n => n[1]));
  ctx.scene.traverse((o) => { const g = o.geometry; if (o.name !== "__hekatan_shell_colormap" || !g?.attributes?.scalar) return;
    const P = g.attributes.position, C = g.attributes.scalar; const grp = { y0: [], yL: [], x0: [], xL: [], losa: [] };
    for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i); if (z < 0.5) continue; const c = [+C.getX(i).toFixed(2)];
      if (Math.abs(y) < 1e-3) grp.y0.push(c); else if (Math.abs(y - yL) < 1e-3) grp.yL.push(c); else if (Math.abs(x) < 1e-3) grp.x0.push(c); else if (Math.abs(x - xL) < 1e-3) grp.xL.push(c); }
    const uniq = (a) => { const m = new Map(); for (const c of a) m.set(c.join(","), (m.get(c.join(",")) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4); };
    out.push({ name: o.name || o.type, nVerts: P.count, index: !!g.index, y0: [grp.y0.length, uniq(grp.y0)], xL: [grp.xL.length, uniq(grp.xL)], x0: [grp.x0.length, uniq(grp.x0)], yL: [grp.yL.length, uniq(grp.yL)] }); });
  return { xL, yL, mallas: out };
});
console.log(JSON.stringify(r)); await nav.close();
