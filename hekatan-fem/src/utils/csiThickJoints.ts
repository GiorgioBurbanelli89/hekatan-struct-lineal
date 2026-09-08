/**
 * Momentos del Shell-Thick de CSI en los 4 JOINTS de un Q4 (recuperacion de esfuerzos).
 *
 * `getBendingK_CSI` (shellQ4.cpp) arma la rigidez con 22 gdl: 12 de nudo
 * [w, θx, θy]×4 y 10 INTERNOS (4 modos jerarquicos de lado × 2 componentes + la
 * burbuja × 2) que condensa. Al recuperar esfuerzos esos internos no son cero:
 * se recuperan de la propia K,  u_i = −K_ii⁻¹ K_ib u_b,  y la curvatura en cada
 * esquina se evalua con la B completa (con la B-barra de las columnas internas,
 * igual que en la K). Es el MISMO elemento que da la flecha, sin nada añadido.
 *
 * Medido el 8-sep-2026 contra `AreaForceShell` de ETABS 22 en las 4 plantillas
 * con losa (3600 joints cada una, `cli/_shell_centroide.mjs`):
 *   · en el CENTRO del elemento este campo coincide con la media de los 4
 *     joints de ETABS a 1e-6 (pendiente −1.000000);
 *   · en las esquinas, campo suave (vano) 0.3 %, y sobre la columna del
 *     forjado plano 41.4 contra 57.8 de ETABS: la recuperacion de CSI en los
 *     joints NO es exactamente esta (queda por extraer del binario). Aun asi es
 *     la que toca reportar: el promedio de centroides que habia antes daba 4.2
 *     en ese mismo nudo, o sea que el pico sobre la columna no se veia.
 *
 * Ejes: xl, yl locales del elemento; u12 en ejes locales. Devuelve, por
 * esquina (orden de los nudos del elemento), [Mx, My, Mxy] con el signo de
 * la curvatura del solver (el que llama pone el signo de CSI).
 */
export function csiThickJointMoments(
  xl: number[], yl: number[], u12: number[], E: number, nu: number, t: number,
  penal = 1000
): number[][] {
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  const Db = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  const Dsv = ((5 / 6) * E * t) / (2 * (1 + nu));
  const Dsum = Db[0][0] + Db[1][1] + Db[2][2];
  const PENAL = penal;   // el 1000 del kernel; parametro solo para la prueba de sensibilidad
  const ca: number[] = [], sa: number[] = [], LL: number[] = [];
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4;
    const dx = xl[j] - xl[k], dy = yl[j] - yl[k], L = Math.hypot(dx, dy);
    LL.push(L); ca.push(L > 0 ? dx / L : 1); sa.push(L > 0 ? dy / L : 0);
  }
  const z22 = () => new Array<number>(22).fill(0);
  // cortante de cada lado (8.7) como fila sobre los 22 gdl
  const Bl = [z22(), z22(), z22(), z22()];
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4;
    Bl[k][3 * j] += 1 / LL[k]; Bl[k][3 * k] -= 1 / LL[k];
    Bl[k][3 * k + 1] -= sa[k] / 2; Bl[k][3 * j + 1] -= sa[k] / 2;
    Bl[k][3 * k + 2] += ca[k] / 2; Bl[k][3 * j + 2] += ca[k] / 2;
    Bl[k][12 + 2 * k] -= (2 / 3) * sa[k]; Bl[k][13 + 2 * k] += (2 / 3) * ca[k];
  }
  const sc = (v: number[], f: number) => v.map((q) => q * f);
  const add = (a: number[], b: number[]) => a.map((q, i) => q + b[i]);
  const gb = sc(Bl[0], LL[0] / 2), gt = sc(Bl[2], -LL[2] / 2), gR = sc(Bl[1], LL[1] / 2), gL = sc(Bl[3], -LL[3] / 2);
  const A0 = sc(add(gb, gt), 0.5), bb = sc(add(gt, sc(gb, -1)), 0.5);
  const C0 = sc(add(gL, gR), 0.5), dd = sc(add(gR, sc(gL, -1)), 0.5);
  const mm = sc(add(bb, dd), 0.5);

  // B (5×22) y v (divergencia del giro, 1×22) en (r, s)
  const Ben = (r: number, s: number) => {
    const dN4r = [-(1 - s) / 4, (1 - s) / 4, (1 + s) / 4, -(1 + s) / 4];
    const dN4s = [-(1 - r) / 4, -(1 + r) / 4, (1 + r) / 4, (1 - r) / 4];
    const dNhr = [-r * (1 - s), (1 - s * s) / 2, -r * (1 + s), -(1 - s * s) / 2];
    const dNhs = [-(1 - r * r) / 2, -s * (1 + r), (1 - r * r) / 2, -s * (1 - r)];
    let J00 = 0, J01 = 0, J10 = 0, J11 = 0;
    for (let i = 0; i < 4; i++) {
      J00 += dN4r[i] * xl[i]; J01 += dN4r[i] * yl[i];
      J10 += dN4s[i] * xl[i]; J11 += dN4s[i] * yl[i];
    }
    const det = J00 * J11 - J01 * J10;
    const Ji = [[J11 / det, -J01 / det], [-J10 / det, J00 / det]];
    const B = [z22(), z22(), z22(), z22(), z22()], v = z22();
    const giro = (col: number, a: number, b: number, fx: number, fy: number) => {
      B[0][col] += b * fx; B[1][col] -= a * fy; B[2][col] += b * fy - a * fx;
      v[col] += a * fx + b * fy;
    };
    for (let i = 0; i < 4; i++) {
      const gx = Ji[0][0] * dN4r[i] + Ji[0][1] * dN4s[i];
      const gy = Ji[1][0] * dN4r[i] + Ji[1][1] * dN4s[i];
      giro(3 * i + 1, 1, 0, gx, gy); giro(3 * i + 2, 0, 1, gx, gy);
    }
    for (let k = 0; k < 4; k++) {
      const hx = Ji[0][0] * dNhr[k] + Ji[0][1] * dNhs[k];
      const hy = Ji[1][0] * dNhr[k] + Ji[1][1] * dNhs[k];
      giro(12 + 2 * k, 1, 0, hx, hy); giro(13 + 2 * k, 0, 1, hx, hy);
    }
    const d9r = -2 * r * (1 - s * s), d9s = -2 * s * (1 - r * r);
    const g9x = Ji[0][0] * d9r + Ji[0][1] * d9s, g9y = Ji[1][0] * d9r + Ji[1][1] * d9s;
    giro(20, 1, 0, g9x, g9y); giro(21, 0, 1, g9x, g9y);
    const g0 = add(A0, sc(mm, s)), g1 = add(C0, sc(mm, r));
    for (let c = 0; c < 22; c++) {
      B[3][c] = Ji[0][0] * g0[c] + Ji[0][1] * g1[c];
      B[4][c] = Ji[1][0] * g0[c] + Ji[1][1] * g1[c];
    }
    return { B, v, dJ: Math.abs(det) };
  };

  // la regla de 8 puntos (ITW 1991) y la B-barra de las 10 columnas internas
  const qA = Math.sqrt(7 / 9), qB = Math.sqrt(7 / 15);
  const qp = [[-qA, -qA], [qA, -qA], [qA, qA], [-qA, qA], [0, -qB], [qB, 0], [0, qB], [-qB, 0]];
  const qw = [9 / 49, 9 / 49, 9 / 49, 9 / 49, 40 / 49, 40 / 49, 40 / 49, 40 / 49];
  const pts = qp.map(([r, s], p) => { const o = Ben(r, s); return { B: o.B, v: o.v, w: qw[p] * o.dJ }; });
  const wsum = pts.reduce((s, p) => s + p.w, 0);
  const media = [z22(), z22(), z22()];
  for (const p of pts) for (let i = 0; i < 3; i++) for (let c = 12; c < 22; c++) media[i][c] += (p.B[i][c] * p.w) / wsum;
  const K: number[][] = Array.from({ length: 22 }, () => z22());
  for (const p of pts) {
    for (let i = 0; i < 3; i++) for (let c = 12; c < 22; c++) p.B[i][c] -= media[i][c];
    const DB = [z22(), z22(), z22(), z22(), z22()];
    for (let c = 0; c < 22; c++) {
      for (let i = 0; i < 3; i++) DB[i][c] = Db[i][0] * p.B[0][c] + Db[i][1] * p.B[1][c] + Db[i][2] * p.B[2][c];
      DB[3][c] = Dsv * p.B[3][c]; DB[4][c] = Dsv * p.B[4][c];
    }
    for (let a = 0; a < 22; a++) for (let b = 0; b < 22; b++) {
      let s = 0; for (let i = 0; i < 5; i++) s += p.B[i][a] * DB[i][b];
      K[a][b] += (s + PENAL * Dsum * p.v[a] * p.v[b]) * p.w;
    }
  }
  // que internos son activos: la misma eliminacion secuencial del C++ (salta pivotes nulos)
  let esc = 0; for (const f of K) for (const q of f) esc = Math.max(esc, Math.abs(q));
  const Kc = K.map((f) => f.slice());
  const activos: number[] = [];
  for (let i = 12; i < 22; i++) {
    const piv = Kc[i][i];
    if (Math.abs(piv) <= 1e-14 * esc) continue;
    activos.push(i);
    const fila = Kc[i].slice(), col = Kc.map((f) => f[i]);
    for (let a = 0; a < 22; a++) for (let b = 0; b < 22; b++) Kc[a][b] -= (col[a] * fila[b]) / piv;
    for (let a = 0; a < 22; a++) { Kc[i][a] = 0; Kc[a][i] = 0; }
  }
  // K_ii u_i = −K_ib u_b (Gauss con pivoteo parcial)
  const n = activos.length;
  const A = activos.map((i) => activos.map((j) => K[i][j]));
  const rhs = activos.map((i) => { let s = 0; for (let b = 0; b < 12; b++) s -= K[i][b] * u12[b]; return s; });
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [rhs[c], rhs[p]] = [rhs[p], rhs[c]];
    if (Math.abs(A[c][c]) < 1e-300) continue;
    for (let r = c + 1; r < n; r++) {
      const f = A[r][c] / A[c][c];
      for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
      rhs[r] -= f * rhs[c];
    }
  }
  const ui = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = rhs[r]; for (let k = r + 1; k < n; k++) s -= A[r][k] * ui[k];
    ui[r] = Math.abs(A[r][r]) < 1e-300 ? 0 : s / A[r][r];
  }
  const u22 = z22(); for (let b = 0; b < 12; b++) u22[b] = u12[b]; activos.forEach((i, k) => { u22[i] = ui[k]; });

  const Men = (r: number, s: number) => {
    const { B } = Ben(r, s);
    for (let i = 0; i < 3; i++) for (let c = 12; c < 22; c++) B[i][c] -= media[i][c];
    const k = [0, 1, 2].map((i) => B[i].reduce((acc, q, c) => acc + q * u22[c], 0));
    return [0, 1, 2].map((i) => Db[i][0] * k[0] + Db[i][1] * k[1] + Db[i][2] * k[2]);
  };
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([r, s]) => Men(r, s));
}
