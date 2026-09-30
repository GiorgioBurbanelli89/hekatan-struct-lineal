// Banco: formulaciones PUBLICADAS de placa gruesa contra SAP2000 (juez). Placa NxN apoyada (Uz), carga q.
// Uso: T=0.2 REF=<json de SAP> node cli/_banco_thick.mjs thick wilson dkmq
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { join } from "node:path";
import { resolverHeks } from "../../../tests/lib/heks.mjs";
const A = 4, N = +(process.env.N ?? 8), T = +(process.env.T ?? 0.2), E = 2.2e7, NU = 0.2, Q = -10;
const S = JSON.parse(readFileSync(process.env.REF, "utf-8").replace(/\bNaN\b/g, "null"));
const k2 = (x, y) => `${Math.round(x * 1000)},${Math.round(y * 1000)}`;
for (const form of process.argv.slice(2)) {
  const L = []; const id = (i, j) => i * (N + 1) + j + 1;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`node ${id(i, j)} ${i * A / N} ${j * A / N} 0`);
  let ns = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ns++;
    L.push(`shell ${ns} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${T} ${E} ${NU} 0`, `areaload ${ns} ${Q}`);
    if (form !== "thick") L.push(`shelltype ${ns} ${form}`); }
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) if (i === 0 || i === N || j === 0 || j === N) L.push(`support ${id(i, j)} 0 0 1 0 0 0`);
  L.push(`support ${id(0, 0)} 1 1 1 0 0 1`, `support ${id(N, 0)} 0 1 1 0 0 1`, "solve");
  const f = join(mkdtempSync(join(tmpdir(), "hkB-")), "p.heks"); writeFileSync(f, L.join("\n"));
  const r = await resolverHeks(f);
  const iN = new Map(r.nodes.map((q, i) => [k2(q[0], q[1]), i]));
  let pw = 0, mw = 0, pr = 0, mr = 0;
  for (const q of S.puntos) { const i = iN.get(k2(q.x, q.y)), d = S.disp_nudos[q.n]; if (i === undefined || !d) continue;
    const h = r.deformOutputs.deformations.get(i); mw = Math.max(mw, Math.abs(d[2])); pw = Math.max(pw, Math.abs(h[2] - d[2]));
    for (const c of [3, 4]) { mr = Math.max(mr, Math.abs(d[c])); pr = Math.max(pr, Math.abs(h[c] - d[c])); } }
  // momentos joint a joint
  const a = r.analyzeOutputs, porN = new Map(S.puntos.map((p) => [p.n, p])); let pm = 0, mm = 0, cen = [];
  const iE = new Map(); r.elements.forEach((el, i) => { if (el.length === 4) iE.set(k2(el.reduce((s, n) => s + r.nodes[n][0], 0) / 4, el.reduce((s, n) => s + r.nodes[n][1], 0) / 4), i); });
  for (const ar of S.areas) { const pts = ar.pts.map((p) => porN.get(p)); const i = iE.get(k2(pts.reduce((s, p) => s + p.x, 0) / 4, pts.reduce((s, p) => s + p.y, 0) / 4));
    const fe = S.shells[ar.n]; if (i === undefined || !fe || !a.bendingXXjoint?.get(i)) continue; const el = r.elements[i];
    for (const v of fe) { const p = porN.get(v[0]); const pos = el.findIndex((n) => k2(r.nodes[n][0], r.nodes[n][1]) === k2(p.x, p.y));
      const h = [a.bendingXXjoint.get(i)[pos], a.bendingYYjoint.get(i)[pos], a.bendingXYjoint.get(i)[pos]];
      for (let c = 0; c < 3; c++) { mm = Math.max(mm, Math.abs(v[4 + c])); pm = Math.max(pm, Math.abs(h[c] - v[4 + c])); }
      if (Math.abs(p.x - A / 2) < 1e-6 && Math.abs(p.y - A / 2) < 1e-6) cen.push([h[0], v[4]]); } }
  // momento en el NUDO = media de joints; todos e interior
  const acc = new Map();
  for (const ar of S.areas) { const pts = ar.pts.map((p) => porN.get(p)); const i = iE.get(k2(pts.reduce((s, p) => s + p.x, 0) / 4, pts.reduce((s, p) => s + p.y, 0) / 4));
    const fe = S.shells[ar.n]; if (i === undefined || !fe || !a.bendingXXjoint?.get(i)) continue; const el = r.elements[i];
    for (const v of fe) { const p = porN.get(v[0]); const pos = el.findIndex((n) => k2(r.nodes[n][0], r.nodes[n][1]) === k2(p.x, p.y));
      const key = k2(p.x, p.y); const o = acc.get(key) ?? { h: [0, 0, 0], s: [0, 0, 0], n: 0, b: p.x < 1e-6 || p.y < 1e-6 || p.x > A - 1e-6 || p.y > A - 1e-6 };
      o.h[0] += a.bendingXXjoint.get(i)[pos]; o.h[1] += a.bendingYYjoint.get(i)[pos]; o.h[2] += a.bendingXYjoint.get(i)[pos];
      for (let c = 0; c < 3; c++) o.s[c] += v[4 + c]; o.n++; acc.set(key, o); } }
  let pn = 0, pi = 0, mxN = 0;
  for (const o of acc.values()) for (let c = 0; c < 3; c++) { const d = Math.abs(o.h[c] - o.s[c]) / o.n; mxN = Math.max(mxN, Math.abs(o.s[c] / o.n)); pn = Math.max(pn, d); if (!o.b) pi = Math.max(pi, d); }
  console.log(`   NUDO todos ${(100 * pn / mxN).toFixed(2)} %  interior ${(100 * pi / mxN).toFixed(2)} %`);
  const cH = cen.reduce((s, q) => s + q[0], 0) / cen.length, cS = cen.reduce((s, q) => s + q[1], 0) / cen.length;
  console.log(`${form.padEnd(7)} t=${T}  w ${(100 * pw / mw).toFixed(3)} %  giros ${(100 * pr / mr).toFixed(3)} %  M joints ${(100 * pm / mm).toFixed(2)} %  M11 centro ${cH.toFixed(4)} vs ${cS.toFixed(4)} (${(100 * (cH / cS - 1)).toFixed(2)} %)`);
}
