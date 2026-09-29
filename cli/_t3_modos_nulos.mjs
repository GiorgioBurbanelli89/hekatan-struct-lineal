// Autovalores de la flexión del triángulo Thick del motor (leída de didactic_solve) y su modo nulo de más.
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const m = await empaquetar(`export { kPano } from "${R}/hekatan-fem/src/utils/shellElementK";`, "kpano_t3");
function jacobi(A0) {
  const n = A0.length, A = A0.map((f) => [...f]), V = A.map((_, i) => A.map((__, j) => +(i === j)));
  for (let s = 0; s < 200; s++) for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
    if (Math.abs(A[p][q]) < 1e-300) continue;
    const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.hypot(th, 1));
    const c = 1 / Math.hypot(t, 1), sn = t * c;
    for (let k = 0; k < n; k++) { const a = A[k][p], b = A[k][q]; A[k][p] = c * a - sn * b; A[k][q] = sn * a + c * b; }
    for (let k = 0; k < n; k++) { const a = A[p][k], b = A[q][k]; A[p][k] = c * a - sn * b; A[q][k] = sn * a + c * b; }
    for (let k = 0; k < n; k++) { const a = V[k][p], b = V[k][q]; V[k][p] = c * a - sn * b; V[k][q] = sn * a + c * b; }
  }
  return { ev: A.map((f, i) => f[i]), V };
}
for (const [nom, P] of [["triángulo 2 × 1.5", [[0, 0, 0], [2, 0, 0], [0.5, 1.5, 0]]], ["triángulo equilátero", [[0, 0, 0], [1, 0, 0], [0.5, Math.sqrt(3) / 2, 0]]]]) {
  for (const t of [0.2, 0.02]) {
    const k = m.kPano(P, 2.2e7, 0.2, t, {});
    const { ev, V } = jacobi(k.flexion);
    const top = Math.max(...ev.map(Math.abs));
    const orden = ev.map((v, i) => [v / top, i]).sort((a, b) => a[0] - b[0]);
    console.log(`${nom}, t = ${t}: autovalores / mayor = ${orden.map(([v]) => v.toExponential(1)).join("  ")}`);
    // el cuarto más chico: su forma [w θ1 θ2] por nudo
    const i4 = orden[3][1];
    console.log("   4.º modo (w, θ1, θ2 por nudo):", [0, 1, 2].map((a) => [0, 1, 2].map((b) => V[3 * a + b][i4].toFixed(3)).join(" ")).join(" | "));
  }
}
