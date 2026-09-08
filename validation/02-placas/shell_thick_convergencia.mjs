// Convergencia del Shell-Thick extraido a la solucion EXACTA de Reissner-Mindlin (placa cuadrada
// simplemente apoyada, carga uniforme, serie de Navier con el termino de cortante), con el WASM
// del producto (por cliModeler), en malla 4, 8, 16, 32 y dos espesores: gruesa t/L = 0.1 y
// delgada t/L = 0.01 (bloqueo por cortante, si lo hubiera, se veria aqui).
//   node validation/02-placas/shell_thick_convergencia.mjs
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../../tests/lib/heks.mjs";
const A = 4.0, E = 25e6, NU = 0.2, Q = -10.0;
function exacto(T) {
  const D = (E * T ** 3) / (12 * (1 - NU * NU)), G = E / (2 * (1 + NU)), kG = (5 / 6) * G * T;
  let w = 0, mx = 0;
  for (let m = 1; m < 200; m += 2) for (let n = 1; n < 200; n += 2) {
    const k = (m / A) ** 2 + (n / A) ** 2, s = Math.sin((m * Math.PI) / 2) * Math.sin((n * Math.PI) / 2);
    const qmn = (16 * Q) / (Math.PI * Math.PI * m * n);
    // Reissner-Mindlin, apoyo duro: w_mn = q_mn/(D π⁴ k²) · (1 + D π² k / (κGt)); M igual que Kirchhoff
    w += (qmn * s) / (D * Math.PI ** 4 * k * k) * (1 + (D * Math.PI * Math.PI * k) / kG);
    mx += (qmn * s) * ((m / A) ** 2 + NU * (n / A) ** 2) / (Math.PI * Math.PI * k * k);
  }
  return { w, mx: -mx };   // signo de CSI: sagging positivo
}
async function placa(N, T) {
  const dir = mkdtempSync(join(tmpdir(), "hkConv-")); const L = []; const id = new Map(); const kk = (i, j) => `${i},${j}`;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) { id.set(kk(i, j), id.size + 1); L.push(`node ${id.get(kk(i, j))} ${(i * A) / N} ${(j * A) / N} 0`); }
  let ns = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ns++; L.push(`shell ${ns} ${id.get(kk(i, j))} ${id.get(kk(i + 1, j))} ${id.get(kk(i + 1, j + 1))} ${id.get(kk(i, j + 1))} ${T} ${E} ${NU} 0`); L.push(`areaload ${ns} ${Q}`); }
  // apoyo DURO (el de la serie): w = 0 y pendiente TANGENCIAL al borde = 0. En el borde
  // y = 0 la pendiente tangencial es w,x, que con giros de mano derecha es −θy: se fija
  // ry; en x = 0 se fija rx (= w,y). (Fijar rx en y = 0 es empotrar: w −65 %, medido.)
  // Con apoyo blando (solo w) la placa gruesa da un 4 % mas de flecha por la capa
  // limite de Reissner-Mindlin, y no es el elemento.
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    const ex = i === 0 || i === N, ey = j === 0 || j === N;
    if (ex || ey) L.push(`support ${id.get(kk(i, j))} 0 0 1 ${ex ? 1 : 0} ${ey ? 1 : 0} 0`);
  }
  L.push(`support ${id.get(kk(0, 0))} 1 1 1 0 0 1`); L.push(`support ${id.get(kk(N, 0))} 0 1 1 0 0 1`); L.push("solve");
  const ruta = join(dir, "placa.heks"); writeFileSync(ruta, L.join("\n") + "\n", "utf-8");
  const r = await resolverHeks(ruta);
  let wmin = 0; r.deformOutputs?.deformations?.forEach((d) => { wmin = Math.min(wmin, d[2]); });
  // M11 en el nudo central: media de los joints de las 4 cascaras que lo tocan
  const c = A / 2; const vals = [];
  r.elements.forEach((el, i) => { if (el.length !== 4) return; el.forEach((n, p) => { const q = r.nodes[n]; if (Math.abs(q[0] - c) < 1e-9 && Math.abs(q[1] - c) < 1e-9) { const v = r.analyzeOutputs.bendingXXjoint?.get(i); if (v) vals.push(v[p]); } }); });
  return { w: wmin, mx: vals.reduce((s, v) => s + v, 0) / vals.length };
}
for (const T of [0.4, 0.04]) {
  const ex = exacto(T);
  console.log(`t/L = ${T / A}: exacto Reissner-Mindlin w = ${ex.w.toExponential(5)} m, M11 = ${ex.mx.toFixed(4)} kN.m/m`);
  for (const N of [4, 8, 16, 32]) {
    const r = await placa(N, T);
    console.log(`   ${String(N).padStart(2)}x${N}: w ${r.w.toExponential(5)} (${((r.w / ex.w - 1) * 100).toFixed(3).padStart(7)} %)   M11 ${r.mx.toFixed(4)} (${((r.mx / ex.mx - 1) * 100).toFixed(3).padStart(7)} %)`);
  }
}
