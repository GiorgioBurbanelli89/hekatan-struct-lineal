// Validez del Shell-Thick extraido (getBendingK_CSI) SIN ETABS de por medio:
//   1. RANGO: la K 12x12 condensada tiene exactamente 3 autovalores nulos (w, θx, θy rigidos)
//      en cuadrado, rectangulo, paralelogramo, trapecio e irregular: sin modos espurios.
//   2. PATCH TEST de curvatura constante: en un parche de 4 elementos distorsionados con
//      w = ½(κx x² + κy y²) + κxy xy impuesto en los nudos, cada elemento devuelve M = D·κ exacto.
//   node validation/02-placas/shell_thick_validez.mjs
import { csiThickJointMoments } from "../../hekatan-fem/src/utils/csiThickJoints.ts";
import { dkqJointMoments } from "../../hekatan-fem/src/utils/dkqJoints.ts";

// --- la K 12x12: se reconstruye desde csiThickJointMoments por columnas unitarias NO sirve
// (devuelve momentos, no fuerzas). Se arma aqui igual que en el TS pero devolviendo K12.
function K12(xl, yl, E, nu, t) {
  // copia literal de csiThickJoints.ts hasta la condensacion
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  const Db = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  const Dsv = ((5 / 6) * E * t) / (2 * (1 + nu)); const Dsum = Db[0][0] + Db[1][1] + Db[2][2]; const PENAL = 1000;
  const ca = [], sa = [], LL = [];
  for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; const dx = xl[j] - xl[k], dy = yl[j] - yl[k], L = Math.hypot(dx, dy); LL.push(L); ca.push(dx / L); sa.push(dy / L); }
  const z22 = () => new Array(22).fill(0);
  const Bl = [z22(), z22(), z22(), z22()];
  for (let k = 0; k < 4; k++) { const j = (k + 1) % 4;
    Bl[k][3 * j] += 1 / LL[k]; Bl[k][3 * k] -= 1 / LL[k]; Bl[k][3 * k + 1] -= sa[k] / 2; Bl[k][3 * j + 1] -= sa[k] / 2;
    Bl[k][3 * k + 2] += ca[k] / 2; Bl[k][3 * j + 2] += ca[k] / 2; Bl[k][12 + 2 * k] -= (2 / 3) * sa[k]; Bl[k][13 + 2 * k] += (2 / 3) * ca[k]; }
  const sc = (v, f) => v.map((q) => q * f), add = (a, b) => a.map((q, i) => q + b[i]);
  const gb = sc(Bl[0], LL[0] / 2), gt = sc(Bl[2], -LL[2] / 2), gR = sc(Bl[1], LL[1] / 2), gL = sc(Bl[3], -LL[3] / 2);
  const A0 = sc(add(gb, gt), 0.5), bb = sc(add(gt, sc(gb, -1)), 0.5), C0 = sc(add(gL, gR), 0.5), dd = sc(add(gR, sc(gL, -1)), 0.5), mm = sc(add(bb, dd), 0.5);
  const Ben = (r, s) => {
    const dN4r = [-(1 - s) / 4, (1 - s) / 4, (1 + s) / 4, -(1 + s) / 4], dN4s = [-(1 - r) / 4, -(1 + r) / 4, (1 + r) / 4, (1 - r) / 4];
    const dNhr = [-r * (1 - s), (1 - s * s) / 2, -r * (1 + s), -(1 - s * s) / 2], dNhs = [-(1 - r * r) / 2, -s * (1 + r), (1 - r * r) / 2, -s * (1 - r)];
    let J00 = 0, J01 = 0, J10 = 0, J11 = 0; for (let i = 0; i < 4; i++) { J00 += dN4r[i] * xl[i]; J01 += dN4r[i] * yl[i]; J10 += dN4s[i] * xl[i]; J11 += dN4s[i] * yl[i]; }
    const det = J00 * J11 - J01 * J10; const Ji = [[J11 / det, -J01 / det], [-J10 / det, J00 / det]];
    const B = [z22(), z22(), z22(), z22(), z22()], v = z22();
    const giro = (col, a, b, fx, fy) => { B[0][col] += b * fx; B[1][col] -= a * fy; B[2][col] += b * fy - a * fx; v[col] += a * fx + b * fy; };
    for (let i = 0; i < 4; i++) { const gx = Ji[0][0] * dN4r[i] + Ji[0][1] * dN4s[i], gy = Ji[1][0] * dN4r[i] + Ji[1][1] * dN4s[i]; giro(3 * i + 1, 1, 0, gx, gy); giro(3 * i + 2, 0, 1, gx, gy); }
    for (let k = 0; k < 4; k++) { const hx = Ji[0][0] * dNhr[k] + Ji[0][1] * dNhs[k], hy = Ji[1][0] * dNhr[k] + Ji[1][1] * dNhs[k]; giro(12 + 2 * k, 1, 0, hx, hy); giro(13 + 2 * k, 0, 1, hx, hy); }
    const d9r = -2 * r * (1 - s * s), d9s = -2 * s * (1 - r * r); const g9x = Ji[0][0] * d9r + Ji[0][1] * d9s, g9y = Ji[1][0] * d9r + Ji[1][1] * d9s; giro(20, 1, 0, g9x, g9y); giro(21, 0, 1, g9x, g9y);
    const g0 = add(A0, sc(mm, s)), g1 = add(C0, sc(mm, r));
    for (let c = 0; c < 22; c++) { B[3][c] = Ji[0][0] * g0[c] + Ji[0][1] * g1[c]; B[4][c] = Ji[1][0] * g0[c] + Ji[1][1] * g1[c]; }
    return { B, v, dJ: Math.abs(det) };
  };
  const qA = Math.sqrt(7 / 9), qB = Math.sqrt(7 / 15);
  const qp = [[-qA, -qA], [qA, -qA], [qA, qA], [-qA, qA], [0, -qB], [qB, 0], [0, qB], [-qB, 0]], qw = [9 / 49, 9 / 49, 9 / 49, 9 / 49, 40 / 49, 40 / 49, 40 / 49, 40 / 49];
  const pts = qp.map(([r, s], p) => { const o = Ben(r, s); return { B: o.B, v: o.v, w: qw[p] * o.dJ }; });
  const wsum = pts.reduce((s, p) => s + p.w, 0); const media = [z22(), z22(), z22()];
  for (const p of pts) for (let i = 0; i < 3; i++) for (let c = 12; c < 22; c++) media[i][c] += (p.B[i][c] * p.w) / wsum;
  const K = Array.from({ length: 22 }, () => z22());
  for (const p of pts) { for (let i = 0; i < 3; i++) for (let c = 12; c < 22; c++) p.B[i][c] -= media[i][c];
    const DB = [z22(), z22(), z22(), z22(), z22()];
    for (let c = 0; c < 22; c++) { for (let i = 0; i < 3; i++) DB[i][c] = Db[i][0] * p.B[0][c] + Db[i][1] * p.B[1][c] + Db[i][2] * p.B[2][c]; DB[3][c] = Dsv * p.B[3][c]; DB[4][c] = Dsv * p.B[4][c]; }
    for (let a = 0; a < 22; a++) for (let b = 0; b < 22; b++) { let s = 0; for (let i = 0; i < 5; i++) s += p.B[i][a] * DB[i][b]; K[a][b] += (s + PENAL * Dsum * p.v[a] * p.v[b]) * p.w; } }
  let esc = 0; for (const f of K) for (const q of f) esc = Math.max(esc, Math.abs(q));
  for (let i = 12; i < 22; i++) { const piv = K[i][i]; if (Math.abs(piv) <= 1e-14 * esc) continue; const fila = K[i].slice(), col = K.map((f) => f[i]);
    for (let a = 0; a < 22; a++) for (let b = 0; b < 22; b++) K[a][b] -= (col[a] * fila[b]) / piv; for (let a = 0; a < 22; a++) { K[i][a] = 0; K[a][i] = 0; } }
  return K.slice(0, 12).map((f) => f.slice(0, 12));
}
// autovalores de una simetrica (Jacobi)
function eig(Ain) { const n = Ain.length; const A = Ain.map((f) => f.slice());
  for (let it = 0; it < 100; it++) { let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2; if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) { if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]); const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)); const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; } } }
  return A.map((f, i) => f[i]).sort((a, b) => a - b); }

const E = 25e6, nu = 0.2, t = 0.2;
const geos = { cuadrado: [[0, 0], [1, 0], [1, 1], [0, 1]], rectangulo: [[0, 0], [2, 0], [2, 1], [0, 1]], paralelogramo: [[0, 0], [1, 0], [1.4, 1], [0.4, 1]],
               trapecio: [[0, 0], [1.2, 0], [0.9, 1], [0.1, 1]], irregular: [[0, 0], [1.1, 0.1], [0.9, 1.2], [-0.1, 0.8]] };
console.log("1) RANGO de la K condensada (autovalores nulos = solidos rigidos; tienen que ser 3):");
for (const [nom, P] of Object.entries(geos)) {
  const ev = eig(K12(P.map((p) => p[0]), P.map((p) => p[1]), E, nu, t)); const mx = ev[ev.length - 1];
  const nulos = ev.filter((v) => Math.abs(v) < 1e-10 * mx).length;
  console.log(`   ${nom.padEnd(14)} nulos ${nulos}  (min no nulo / max = ${(ev[nulos] / mx).toExponential(2)})  ${nulos === 3 ? "OK" : "FALLA"}`);
}
console.log("2) PATCH TEST de curvatura constante, parche de 4 elementos distorsionados, M = D·κ exacto en cada esquina:");
const kx = 1e-3, ky = -0.5e-3, kxy = 0.7e-3;   // curvaturas impuestas (w = ½kx x² + ½ky y² + kxy xy)
const D0 = (E * t ** 3) / (12 * (1 - nu * nu)); const Mex = [D0 * (kx + nu * ky), D0 * (ky + nu * kx), D0 * (1 - nu) / 2 * (2 * kxy)];
// nudos del parche (Macneal): 0..2 x 0..2 con el nudo central desplazado
// parche de MacNeal-Harder: 4 cuadrilateros alrededor de un nudo interior desplazado
const c = [1.15, 0.85], m = [[1, 0], [2, 1], [1, 2], [0, 1]];
const cuadris = [[[0, 0], m[0], c, m[3]], [m[0], [2, 0], m[1], c], [c, m[1], [2, 2], m[2]], [m[3], c, m[2], [0, 2]]];
let peor = 0, peorD = 0;
for (const P of cuadris) {
  const xl = P.map((p) => p[0]), yl = P.map((p) => p[1]);
  // giros de MANO DERECHA, los del solver: θx = +∂w/∂y, θy = −∂w/∂x (medido: con
  // cualquiera de las otras 7 combinaciones el patch test se va a cientos de %).
  // csiThickJointMoments / dkqJointMoments devuelven el signo de la curvatura; analyze()
  // les pone el de CSI (sagging positivo), que es el que se compara aqui.
  const u12 = [];
  for (const [x, y] of P) { const w = 0.5 * kx * x * x + 0.5 * ky * y * y + kxy * x * y; const wx = kx * x + kxy * y, wy = ky * y + kxy * x; u12.push(w, wy, -wx); }
  const M = csiThickJointMoments(xl, yl, u12, E, nu, t).map((m) => m.map((v) => -v));
  const Md = dkqJointMoments(xl, yl, u12, E, nu, t, "gauss").map((m) => m.map((v) => -v));
  for (const m3 of M) for (let i = 0; i < 3; i++) peor = Math.max(peor, Math.abs(m3[i] - Mex[i]) / Math.max(...Mex.map(Math.abs)));
  for (const m3 of Md) for (let i = 0; i < 3; i++) peorD = Math.max(peorD, Math.abs(m3[i] - Mex[i]) / Math.max(...Mex.map(Math.abs)));
}
console.log(`   Shell-Thick (CSI extraido): 4 cuadrilateros, 16 esquinas x 3 momentos, peor ${(100 * peor).toExponential(2)} %  ${peor < 1e-8 ? "OK (exacto)" : "FALLA"}`);
console.log(`   Shell-Thin  (DKQ)         : peor ${(100 * peorD).toExponential(2)} %  ${peorD < 1e-8 ? "OK (exacto)" : "FALLA"}`);
