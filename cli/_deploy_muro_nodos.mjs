import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-dual`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const r = await p.evaluate(() => {
  const s = window.__hekatanStates; const N = s.nodes.val, E = s.elements.val; const M = s.analyzeOutputs.val.vonMises;
  const last = new Map(), touch = new Map(); let orden = [];
  for (const [ei, vals] of M) { const e = E[ei]; if (!e || e.length !== 4) continue; orden.push(ei); for (let i = 0; i < 4; i++) { last.set(e[i], vals[i]); (touch.get(e[i]) ?? touch.set(e[i], []).get(e[i])).push(+vals[i].toFixed(2)); } }
  const muroY0 = [], muroX0 = [], muroXL = [], muroYL = [];
  const xs = N.map(n => n[0]), ys = N.map(n => n[1]); const xL = Math.max(...xs), yL = Math.max(...ys);
  for (let i = 0; i < N.length; i++) { const [x, y, z] = N[i]; if (z <= 0.01 || !last.has(i)) continue; if (Math.abs(y) < 1e-6) muroY0.push(i); if (Math.abs(x) < 1e-6) muroX0.push(i); if (Math.abs(x - xL) < 1e-6) muroXL.push(i); if (Math.abs(y - yL) < 1e-6) muroYL.push(i); }
  const stat = (ids) => { const v = ids.map(i => last.get(i)); return { n: ids.length, min: +Math.min(...v).toFixed(2), max: +Math.max(...v).toFixed(2), nan: v.filter(x => !Number.isFinite(x)).length, ejemplo: ids.slice(0, 3).map(i => ({ i, xyz: N[i].map(v => +v.toFixed(2)), last: +last.get(i).toFixed(2), tocan: touch.get(i) })) }; };
  const keysType = typeof orden[0]; const first = orden.slice(0, 3), lastK = orden.slice(-3);
  return { keysType, first, lastK, nMap: M.size, nElem: E.length, y0: stat(muroY0), x0: stat(muroX0), xL: stat(muroXL), yL: stat(muroYL) };
});
console.log(JSON.stringify(r)); await nav.close();
