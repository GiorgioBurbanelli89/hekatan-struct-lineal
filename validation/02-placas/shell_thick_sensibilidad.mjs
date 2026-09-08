// SENSIBILIDAD del Shell-Thick al factor de la penalizacion de la divergencia (el 1000 del kernel).
// Si es un parametro de ESTABILIZACION (como el del reloj de arena) la solucion no debe moverse
// con el en varios ordenes de magnitud; si fuera una calibracion escondida, si.
// Placa cuadrada 4 m apoyada (apoyo duro), carga uniforme, misma K que el WASM (copia JS de
// getBendingK_CSI con el factor libre) resuelta aqui en denso; flecha y M11 en el centro contra la
// serie exacta de Reissner-Mindlin; y el rango de la celda con cada factor.
//   node --experimental-strip-types validation/02-placas/shell_thick_sensibilidad.mjs
import { csiThickJointMoments } from "../../hekatan-fem/src/utils/csiThickJoints.ts";

function K12(xl, yl, E, nu, t, PENAL) {
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  const Db = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  const Dsv = ((5 / 6) * E * t) / (2 * (1 + nu)); const Dsum = Db[0][0] + Db[1][1] + Db[2][2];
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
function eig(Ain) { const n = Ain.length; const A = Ain.map((f) => f.slice());
  for (let it = 0; it < 100; it++) { let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2; if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) { if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]); const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)); const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; } } }
  return A.map((f, i) => f[i]).sort((a, b) => a - b); }
// resolver denso (Gauss con pivoteo parcial) K u = f con gdl fijos eliminados
function resolver(K, f, libre) {
  const n = libre.length; const A = new Float64Array(n * n); const b = new Float64Array(n);
  for (let i = 0; i < n; i++) { b[i] = f[libre[i]]; for (let j = 0; j < n; j++) A[i * n + j] = K[libre[i]][libre[j]]; }
  for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r * n + c]) > Math.abs(A[p * n + c])) p = r;
    if (p !== c) { for (let k = 0; k < n; k++) { const tmp = A[c * n + k]; A[c * n + k] = A[p * n + k]; A[p * n + k] = tmp; } const tb = b[c]; b[c] = b[p]; b[p] = tb; }
    const piv = A[c * n + c]; for (let r = c + 1; r < n; r++) { const fac = A[r * n + c] / piv; if (!fac) continue; for (let k = c; k < n; k++) A[r * n + k] -= fac * A[c * n + k]; b[r] -= fac * b[c]; } }
  const x = new Float64Array(n); for (let r = n - 1; r >= 0; r--) { let s = b[r]; for (let k = r + 1; k < n; k++) s -= A[r * n + k] * x[k]; x[r] = s / A[r * n + r]; }
  const u = new Float64Array(K.length); libre.forEach((g, i) => { u[g] = x[i]; }); return u;
}
const A = 4, E = 25e6, NU = 0.2, Q = -10;
function exacto(T) {
  const D = (E * T ** 3) / (12 * (1 - NU * NU)), G = E / (2 * (1 + NU)), kG = (5 / 6) * G * T; let w = 0, mx = 0;
  for (let m = 1; m < 200; m += 2) for (let n = 1; n < 200; n += 2) { const k = (m / A) ** 2 + (n / A) ** 2, s = Math.sin((m * Math.PI) / 2) * Math.sin((n * Math.PI) / 2); const qmn = (16 * Q) / (Math.PI * Math.PI * m * n);
    w += (qmn * s) / (D * Math.PI ** 4 * k * k) * (1 + (D * Math.PI * Math.PI * k) / kG); mx += (qmn * s) * ((m / A) ** 2 + NU * (n / A) ** 2) / (Math.PI * Math.PI * k * k); }
  return { w, mx: -mx };
}
function placa(N, T, PENAL) {
  const nn = (N + 1) * (N + 1), nd = 3 * nn; const K = Array.from({ length: nd }, () => new Float64Array(nd)); const f = new Float64Array(nd);
  const id = (i, j) => i * (N + 1) + j; const h = A / N; const el = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const nodes = [id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)]; const xl = [i * h, (i + 1) * h, (i + 1) * h, i * h], yl = [j * h, j * h, (j + 1) * h, (j + 1) * h];
    const Ke = K12(xl, yl, E, NU, T, PENAL); el.push({ nodes, xl, yl });
    for (let a = 0; a < 4; a++) { f[3 * nodes[a]] += Q * h * h / 4; for (let b = 0; b < 4; b++) for (let p = 0; p < 3; p++) for (let q = 0; q < 3; q++) K[3 * nodes[a] + p][3 * nodes[b] + q] += Ke[3 * a + p][3 * b + q]; }
  }
  const fijo = new Set();
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) { const ex = i === 0 || i === N, ey = j === 0 || j === N; if (ex || ey) fijo.add(3 * id(i, j)); if (ex) fijo.add(3 * id(i, j) + 1); if (ey) fijo.add(3 * id(i, j) + 2); }
  const libre = []; for (let g = 0; g < nd; g++) if (!fijo.has(g)) libre.push(g);
  const u = resolver(K, f, libre);
  const c = id(N / 2, N / 2); const w = u[3 * c]; const vals = [];
  for (const e of el) { const pos = e.nodes.indexOf(c); if (pos < 0) continue; const u12 = []; for (const n of e.nodes) u12.push(u[3 * n], u[3 * n + 1], u[3 * n + 2]);
    vals.push(-csiThickJointMoments(e.xl, e.yl, u12, E, NU, T, PENAL)[pos][0]); }
  return { w, mx: vals.reduce((s, v) => s + v, 0) / vals.length };
}
const N = 16;
console.log(`placa ${A}x${A} m apoyada (duro), q = ${Q}, malla ${N}x${N}, K identica al WASM salvo el factor de penalizacion:`);
for (const T of [0.4, 0.04]) {
  const ex = exacto(T); console.log(` t/L = ${T / A}: exacto w = ${ex.w.toExponential(5)}  M11 = ${ex.mx.toFixed(4)}`);
  for (const PENAL of [10, 100, 1000, 1e4, 1e5]) {
    const r = placa(N, T, PENAL);
    const ev = eig(K12([0, 1, 1.4, 0.4], [0, 0, 1, 1], E, NU, T, PENAL)); const nulos = ev.filter((v) => Math.abs(v) < 1e-10 * ev[11]).length;
    console.log(`   factor ${String(PENAL).padStart(6)}: w ${r.w.toExponential(5)} (${((r.w / ex.w - 1) * 100).toFixed(3).padStart(7)} %)  M11 ${r.mx.toFixed(4)} (${((r.mx / ex.mx - 1) * 100).toFixed(3).padStart(7)} %)  modos nulos de la celda (paralelogramo): ${nulos}`);
  }
}
