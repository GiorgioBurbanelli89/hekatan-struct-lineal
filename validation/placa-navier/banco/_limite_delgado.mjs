// Límite delgado: placa 4x4 apoyada, malla N, flecha central / Navier-Kirchhoff, para thick (MITC4+Wilson),
// auricchio (Auricchio-Taylor 1994) y thin (DKQ). Con t -> 0 una placa gruesa no debe bloquearse.
import { mkdtempSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { join } from "node:path";
import { resolverHeks } from "../../../tests/lib/heks.mjs";
const A = 4, E = 2.2e7, NU = 0.2, Q = -10, N = +(process.env.N ?? 8);
const navier = (t) => { const D = E * t ** 3 / (12 * (1 - NU * NU)); let w = 0;
  for (let m = 1; m < 80; m += 2) for (let n = 1; n < 80; n += 2) { const k = (m / A) ** 2 + (n / A) ** 2; w += Math.sin(m * Math.PI / 2) * Math.sin(n * Math.PI / 2) / (m * n * k * k); }
  return w * 16 * Q / (Math.PI ** 6 * D); };
for (const t of [0.2, 0.02, 0.005]) {
  const fila = [];
  for (const form of ["thick", "auricchio", "thin"]) {
    const L = []; const id = (i, j) => i * (N + 1) + j + 1;
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`node ${id(i, j)} ${i * A / N} ${j * A / N} 0`);
    let ns = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ns++;
      L.push(`shell ${ns} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${t} ${E} ${NU} 0`, `areaload ${ns} ${Q}`);
      if (form !== "thick") L.push(`shelltype ${ns} ${form}`); }
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) if (i === 0 || i === N || j === 0 || j === N) L.push(`support ${id(i, j)} 0 0 1 0 0 0`);
    L.push(`support ${id(0, 0)} 1 1 1 0 0 1`, `support ${id(N, 0)} 0 1 1 0 0 1`, "solve");
    const f = join(mkdtempSync(join(tmpdir(), "hkL-")), "p.heks"); writeFileSync(f, L.join("\n"));
    const r = await resolverHeks(f); let w = 0; r.deformOutputs.deformations.forEach((d) => { w = Math.min(w, d[2]); });
    fila.push(`${form} ${(w / navier(t)).toFixed(4)}`);
  }
  console.log(`t=${t} (L/t=${A / t}): w/Navier-Kirchhoff  ${fila.join("   ")}`);
}
