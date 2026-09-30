// Placa 4x4 apoyada (Uz), t=0.2: momento en el NUDO (media de joints) en los puntos de la malla 8x8,
// para N = 8, 16, 32, 64 -> hacia dónde converge el continuo.
import { mkdtempSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { join } from "node:path";
import { resolverHeks } from "../../../tests/lib/heks.mjs";
const A = 4, T = +(process.env.T ?? 0.2), E = 2.2e7, NU = 0.2, Q = -10;
const PTS = [[0, 2], [0.5, 2], [1, 2], [1.5, 2], [2, 2], [0.5, 0.5], [0, 0.5]];
for (const N of [8, 16, 32, 64]) {
  const L = []; const id = (i, j) => i * (N + 1) + j + 1;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`node ${id(i, j)} ${i * A / N} ${j * A / N} 0`);
  let ns = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ns++; L.push(`shell ${ns} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${T} ${E} ${NU} 0`, `areaload ${ns} ${Q}`); }
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) if (i === 0 || i === N || j === 0 || j === N) L.push(`support ${id(i, j)} 0 0 1 0 0 0`);
  L.push(`support ${id(0, 0)} 1 1 1 0 0 1`, `support ${id(N, 0)} 0 1 1 0 0 1`, "solve");
  const f = join(mkdtempSync(join(tmpdir(), "hkC-")), "p.heks"); writeFileSync(f, L.join("\n"));
  const r = await resolverHeks(f); const a = r.analyzeOutputs;
  const acc = new Map();
  r.elements.forEach((el, i) => { const j = a.bendingXXjoint?.get(i); if (!j) return;
    el.forEach((n, p) => { const k = `${r.nodes[n][0].toFixed(3)},${r.nodes[n][1].toFixed(3)}`; const o = acc.get(k) ?? [0, 0, 0, 0];
      o[0] += j[p]; o[1] += a.bendingYYjoint.get(i)[p]; o[2] += a.bendingXYjoint.get(i)[p]; o[3]++; acc.set(k, o); }); });
  let wc = 0; r.deformOutputs.deformations.forEach((d) => { wc = Math.min(wc, d[2]); });
  console.log(`N=${String(N).padStart(2)}  w_max ${(wc * 1000).toFixed(5)} mm   ` + PTS.map(([x, y]) => { const o = acc.get(`${x.toFixed(3)},${y.toFixed(3)}`);
    return `(${x},${y}) M11 ${(o[0] / o[3]).toFixed(3)} M22 ${(o[1] / o[3]).toFixed(3)}`; }).join(" | "));
}
