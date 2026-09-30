// SPR (Zienkiewicz & Zhu 1992) sobre la placa gruesa 8x8: momentos nodales a partir de los valores en los
// puntos de Gauss 2x2 (superconvergentes). Se compara con la solución convergida (N=64) en los mismos puntos.
import { mkdtempSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { join } from "node:path";
import { resolverHeks } from "../../../tests/lib/heks.mjs";
const A = 4, T = 0.2, E = 2.2e7, NU = 0.2, Q = -10;
async function placa(N) {
  const L = []; const id = (i, j) => i * (N + 1) + j + 1;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`node ${id(i, j)} ${i * A / N} ${j * A / N} 0`);
  let ns = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ns++; L.push(`shell ${ns} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${T} ${E} ${NU} 0`, `areaload ${ns} ${Q}`); }
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) if (i === 0 || i === N || j === 0 || j === N) L.push(`support ${id(i, j)} 0 0 1 0 0 0`);
  L.push(`support ${id(0, 0)} 1 1 1 0 0 1`, `support ${id(N, 0)} 0 1 1 0 0 1`, "solve");
  const f = join(mkdtempSync(join(tmpdir(), "hkS-")), "p.heks"); writeFileSync(f, L.join("\n"));
  return resolverHeks(f);
}
const g = 1 / Math.sqrt(3), ESQ = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
function nudos(r, metodo) {
  const a = r.analyzeOutputs, key = (x, y) => `${x.toFixed(3)},${y.toFixed(3)}`;
  // Gauss: el joint se extrapoló desde Gauss con las bilineales en ±√3, así que Gauss = bilineal de los joints en ±1/√3
  const gp = [];   // {x, y, M:[3]}
  const porNudo = new Map();
  r.elements.forEach((el, i) => { const J = [a.bendingXXjoint.get(i), a.bendingYYjoint.get(i), a.bendingXYjoint.get(i)]; if (!J[0]) return;
    const P = el.map((n) => r.nodes[n]);
    for (const [rr, ss] of ESQ) { const xi = rr * g, et = ss * g; const Nn = ESQ.map(([p, q]) => (1 + p * xi) * (1 + q * et) / 4);
      gp.push({ x: Nn.reduce((s, v, k) => s + v * P[k][0], 0), y: Nn.reduce((s, v, k) => s + v * P[k][1], 0), M: [0, 1, 2].map((c) => Nn.reduce((s, v, k) => s + v * J[c][k], 0)), e: i }); }
    el.forEach((n, p) => { const k = key(r.nodes[n][0], r.nodes[n][1]); const o = porNudo.get(k) ?? { els: new Set(), sum: [0, 0, 0], n: 0, x: r.nodes[n][0], y: r.nodes[n][1] };
      o.els.add(i); for (let c = 0; c < 3; c++) o.sum[c] += J[c][p]; o.n++; porNudo.set(k, o); }); });
  if (metodo === "media") return new Map([...porNudo].map(([k, o]) => [k, o.sum.map((v) => v / o.n)]));
  // SPR: nudo interior -> ajuste p = [1, x, y, xy] por mínimos cuadrados a los Gauss de su parche (4 elementos)
  const fit = (pts, x0, y0) => { const M = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], b = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    for (const q of pts) { const P = [1, q.x - x0, q.y - y0, (q.x - x0) * (q.y - y0)]; for (let i = 0; i < 4; i++) { for (let j = 0; j < 4; j++) M[i][j] += P[i] * P[j]; for (let c = 0; c < 3; c++) b[c][i] += P[i] * q.M[c]; } }
    return (x, y) => { const P = [1, x - x0, y - y0, (x - x0) * (y - y0)]; return b.map((bc) => { const s = solve4(M, bc); return s.reduce((acc, v, i) => acc + v * P[i], 0); }); }; };
  const res = new Map(), gpDe = (els) => gp.filter((q) => els.has(q.e));
  for (const [k, o] of porNudo) if (o.els.size === 4) res.set(k, fit(gpDe(o.els), o.x, o.y)(o.x, o.y));
  // nudos de borde: con el parche del nudo interior vecino más cercano (Zienkiewicz & Zhu)
  for (const [k, o] of porNudo) if (o.els.size < 4) {
    let best = null, bd = 1e9; for (const [k2, o2] of porNudo) if (o2.els.size === 4) { const d = Math.hypot(o2.x - o.x, o2.y - o.y); if (d < bd - 1e-9) { bd = d; best = [o2]; } else if (Math.abs(d - bd) < 1e-9) best.push(o2); }
    const vals = best.map((o2) => fit(gpDe(o2.els), o2.x, o2.y)(o.x, o.y)); res.set(k, [0, 1, 2].map((c) => vals.reduce((s, v) => s + v[c], 0) / vals.length)); }
  return res;
}
function solve4(M, b) { const a = M.map((r, i) => [...r, b[i]]); for (let c = 0; c < 4; c++) { let p = c; for (let r = c + 1; r < 4; r++) if (Math.abs(a[r][c]) > Math.abs(a[p][c])) p = r; [a[c], a[p]] = [a[p], a[c]];
  for (let r = 0; r < 4; r++) if (r !== c) { const q = a[r][c] / a[c][c]; for (let k = c; k < 5; k++) a[r][k] -= q * a[c][k]; } } return a.map((r, i) => r[4] / r[i]); }
globalThis.__hkMitc4ConModos = process.env.MODOS === "1";
const ref = nudos(await placa(64), "media"), r8 = await placa(8);
const PTS = [[0, 2], [0.5, 2], [1, 2], [1.5, 2], [2, 2], [0.5, 0.5], [0, 0.5], [1, 1]];
for (const metodo of ["media", "spr"]) { const m = nudos(r8, metodo); let peor = 0;
  const txt = PTS.map(([x, y]) => { const k = `${x.toFixed(3)},${y.toFixed(3)}`; const v = m.get(k), c = ref.get(k); peor = Math.max(peor, Math.abs(v[0] - c[0]) / 7.33 * 100);
    return `(${x},${y}) ${v[0].toFixed(3)}/${c[0].toFixed(3)}`; }).join("  ");
  let pAll = 0; for (const [k, v] of m) { const c = ref.get(k); if (c) for (let q = 0; q < 3; q++) pAll = Math.max(pAll, Math.abs(v[q] - c[q]) / 7.33 * 100); }
  console.log(`${metodo.padEnd(6)} peor en los 81 nudos ${pAll.toFixed(2)} % del M max · M11 (8x8 / convergido): ${txt}`); }
