import puppeteer from "puppeteer";
const id = process.argv[2] ?? "edificio-dual";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const r = await p.evaluate(() => {
  const s = window.__hekatanStates; const N = s.nodes.val, E = s.elements.val; const A = s.analyzeOutputs.val;
  const out = {}; const keys = Object.keys(A).filter(k => A[k] instanceof Map && A[k].size);
  for (const k of ["membraneXX", "membraneYY", "membraneXY", "bendingXX", "vonMises"]) {
    const M = A[k]; if (!M) continue; const g = { planoX: [Infinity, -Infinity], planoY: [Infinity, -Infinity], losa: [Infinity, -Infinity] };
    for (const [ei, vals] of M) { const e = E[ei]; if (!e || e.length !== 4) continue;
      const xs = new Set(e.map(i => N[i][0].toFixed(4))), ys = new Set(e.map(i => N[i][1].toFixed(4))), zs = new Set(e.map(i => N[i][2].toFixed(4)));
      const grp = zs.size === 1 ? "losa" : xs.size === 1 ? "planoX" : ys.size === 1 ? "planoY" : null; if (!grp) continue;
      for (const v of (Array.isArray(vals) ? vals : [vals])) if (Number.isFinite(v)) { if (v < g[grp][0]) g[grp][0] = v; if (v > g[grp][1]) g[grp][1] = v; } }
    out[k] = Object.fromEntries(Object.entries(g).map(([a, b]) => [a, b.map(v => +v.toPrecision(3))]));
  }
  // orden de nudos de un muro de cada plano: direccion del lado 0->1
  const ej = {}; for (let ei = 0; ei < E.length; ei++) { const e = E[ei]; if (e.length !== 4) continue; const xs = new Set(e.map(i => N[i][0].toFixed(4))), zs = new Set(e.map(i => N[i][2].toFixed(4))); const grp = zs.size === 1 ? "losa" : xs.size === 1 ? "planoX" : "planoY"; if (!ej[grp]) { const d = [0,1,2].map(c => +(N[e[1]][c] - N[e[0]][c]).toFixed(3)); ej[grp] = { lado01: d, sizeMap: A.membraneYY?.get(ei)?.length }; } }
  return { claves: keys, rangos: out, lado01: ej };
});
console.log(JSON.stringify(r)); await nav.close();
