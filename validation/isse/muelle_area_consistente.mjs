// `areaspring` (Winkler CONSISTENTE, el de SAFE) contra SAFE 20, y `areaspring ... nodal` contra
// SAFE nodal / SAP2000: la zapata del 20-ago-2026 (registros/2026-08-20_zapata_thin_thick_tres_motores.md)
// 1.50 x 1.50 x 0.40 m, 100 tonf sobre huella 0.30 x 0.30, ks = 2000 tonf/m3, E = 2 188 198 tonf/m2,
// nu = 0.2, malla 10 x 10, Shell-Thin. SAFE (w en el centro, m):
//   nodal  -2.233391473838903e-2      area (consistente)  -2.190424714036925e-2   (-1.924 %)
//   node validation/isse/muelle_area_consistente.mjs
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../../tests/lib/heks.mjs";
const B = 1.5, N = 10, T = 0.4, E = 2188198, NU = 0.2, KS = 2000, P = 100, HUELLA = 0.30;
const SAFE = { nodal: -2.233391473838903e-2, area: -2.190424714036925e-2 };
const h = B / N, q = P / (HUELLA * HUELLA);
async function zapata(modo) {
  const L = []; const id = new Map(); const k = (i, j) => `${i},${j}`;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) { id.set(k(i, j), id.size + 1); L.push(`node ${id.get(k(i, j))} ${(i * h).toFixed(6)} ${(j * h).toFixed(6)} 0`); }
  let ns = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    ns++;
    L.push(`shell ${ns} ${id.get(k(i, j))} ${id.get(k(i + 1, j))} ${id.get(k(i + 1, j + 1))} ${id.get(k(i, j + 1))} ${T} ${E} ${NU} 0`);
    L.push(`shelltype ${ns} thin`);
    const xc = (i + 0.5) * h, yc = (j + 0.5) * h;
    if (Math.abs(xc - B / 2) < HUELLA / 2 && Math.abs(yc - B / 2) < HUELLA / 2) L.push(`areaload ${ns} ${-q}`);
    if (modo === "consistente") L.push(`areaspring ${ns} ${KS}`);
    if (modo === "nodal-directiva") L.push(`areaspring ${ns} ${KS} nodal`);
  }
  if (modo === "nodal") {
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      const f = (i === 0 || i === N ? 0.5 : 1) * (j === 0 || j === N ? 0.5 : 1);
      L.push(`spring ${id.get(k(i, j))} uz ${KS * h * h * f}`);
    }
  }
  // como el .heks del 20-ago (validacion/safe-api/zapata_hekatan.py): ux, uy, rz atados en TODOS los nudos
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`support ${id.get(k(i, j))} 1 1 0 0 0 1`);
  L.push("solve");
  const dir = mkdtempSync(join(tmpdir(), "hkZap-")); const ruta = join(dir, "zapata.heks"); writeFileSync(ruta, L.join("\n") + "\n", "utf-8");
  const r = await resolverHeks(ruta);
  const c = r.nodes.findIndex((n) => Math.abs(n[0] - B / 2) < 1e-9 && Math.abs(n[1] - B / 2) < 1e-9);
  let sum = 0, n = 0; r.deformOutputs.deformations.forEach((d) => { sum += d[2]; n++; });
  return { w: r.deformOutputs.deformations.get(c)[2], wmed: sum / n };
}
export async function medir() {
  const out = {};
  for (const modo of ["nodal", "nodal-directiva", "consistente"]) out[modo] = await zapata(modo);
  return out;
}
if (process.argv[1].endsWith("muelle_area_consistente.mjs")) {
  const o = await medir();
  console.log(`asiento medio teorico P/(ks B^2) = ${(P / (KS * B * B)).toExponential(6)} m`);
  console.log(`spring nodal a mano      : w centro ${o["nodal"].w.toExponential(9)}  vs SAFE nodal ${SAFE.nodal.toExponential(9)}  (${((o["nodal"].w / SAFE.nodal - 1) * 100).toFixed(6)} %)  w medio ${o["nodal"].wmed.toExponential(5)}`);
  console.log(`areaspring ... nodal     : w centro ${o["nodal-directiva"].w.toExponential(9)}  vs SAFE nodal (${((o["nodal-directiva"].w / SAFE.nodal - 1) * 100).toFixed(6)} %)`);
  console.log(`areaspring (consistente) : w centro ${o["consistente"].w.toExponential(9)}  vs SAFE AREA  ${SAFE.area.toExponential(9)}  (${((o["consistente"].w / SAFE.area - 1) * 100).toFixed(6)} %)  w medio ${o["consistente"].wmed.toExponential(5)}`);
}
