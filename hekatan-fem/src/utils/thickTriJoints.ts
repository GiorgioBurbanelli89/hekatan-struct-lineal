/**
 * Triángulo Shell-Thick de CSI (SAP2000 24 / ETABS 22) en forma cerrada: momentos en los 3 joints y cortante
 * V13/V23 (30-oct-2026). Espejo de `thickTriCSI` (getLocalStiffnessMatrix.cpp).
 *
 * Sacado del binario de ETABS 19 (emulando `FUN_18097f8c0` con unicorn) y verificado contra SAP2000 24 y ETABS 22
 * a 1e-12 (K, M de joints, V13/V23). Receta:
 *   · giros: 3 nodales L_i + 3 de LADO jerárquicos 4·La·Lb (2 comp. c/u). SIN burbuja.
 *   · cortantes de lado de Wilson g_k; cortante asumido CONSTANTE (γr, γs) = C·(g_k·L_k), γ = J⁻¹(γr, γs).
 *   · 3 puntos medios de lado (peso A/3); B-barra en las 6 columnas de lado; penalización 1000·tr(Db)·(div θ)².
 *   · condensación de las 6 internas saltando pivotes nulos.
 * GDL por nudo [w, θx, θy] (θx = ∂w/∂y, θy = −∂w/∂x), ejes locales. Momentos con el signo de CSI (M11 > 0 = tracción
 * abajo); V constante en el elemento, signo de CSI.
 */
export interface ThickTriMods { m11?: number; m22?: number; m12?: number; v13?: number; v23?: number }

type Mat = number[][];
const zeros = (n: number, m: number): Mat => Array.from({ length: n }, () => new Array<number>(m).fill(0));

function elemento(xl: number[], yl: number[], E: number, nu: number, t: number, mods?: ThickTriMods) {
  const x = xl, y = yl;
  const A2 = (x[1] - x[0]) * (y[2] - y[0]) - (x[2] - x[0]) * (y[1] - y[0]);
  const A = A2 / 2;
  const gL = [
    [(y[1] - y[2]) / A2, (x[2] - x[1]) / A2],
    [(y[2] - y[0]) / A2, (x[0] - x[2]) / A2],
    [(y[0] - y[1]) / A2, (x[1] - x[0]) / A2],
  ];
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  let Db: Mat = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  let Ds = (5 / 6) * (E / (2 * (1 + nu))) * t;
  let Dsx = Ds, Dsy = Ds;
  if (mods) {
    const m11 = mods.m11 ?? 1, m22 = mods.m22 ?? 1, m12 = mods.m12 ?? 1;
    const cm = Math.sqrt(Math.max(0, m11 * m22));
    Db = [[Db[0][0] * m11, Db[0][1] * cm, 0], [Db[1][0] * cm, Db[1][1] * m22, 0], [0, 0, Db[2][2] * m12]];
    Dsx = Ds * Math.max(0, mods.v13 ?? 1); Dsy = Ds * Math.max(0, mods.v23 ?? 1);
  }
  const sa = [0, 1, 2], sb = [1, 2, 0];
  const Gs = zeros(3, 15), Ls: number[] = [];
  for (let k = 0; k < 3; k++) {
    const a = sa[k], b = sb[k];
    const dx = x[b] - x[a], dy = y[b] - y[a], L = Math.hypot(dx, dy), ca = dx / L, sn = dy / L;
    Ls.push(L);
    Gs[k][3 * b] += 1 / L; Gs[k][3 * a] -= 1 / L;
    for (const n of [a, b]) { Gs[k][3 * n + 1] -= sn / 2; Gs[k][3 * n + 2] += ca / 2; }
    Gs[k][9 + 2 * k] -= (2 / 3) * sn; Gs[k][10 + 2 * k] += (2 / 3) * ca;
  }
  const Cm = [[2 / 3, -1 / 3, -1 / 3], [1 / 3, 1 / 3, -2 / 3]];
  // γ = J⁻¹ · C · diag(L) · Gs   (J = [x2−x1 y2−y1; x3−x1 y3−y1])
  const j11 = x[1] - x[0], j12 = y[1] - y[0], j21 = x[2] - x[0], j22 = y[2] - y[0], dj = j11 * j22 - j12 * j21;
  const Ji = [[j22 / dj, -j12 / dj], [-j21 / dj, j11 / dj]];
  const cov = [0, 1].map((r) => new Array<number>(15).fill(0).map((_, c) => Cm[r][0] * Ls[0] * Gs[0][c] + Cm[r][1] * Ls[1] * Gs[1][c] + Cm[r][2] * Ls[2] * Gs[2][c]));
  const Bsh = [0, 1].map((r) => cov[0].map((_, c) => Ji[r][0] * cov[0][c] + Ji[r][1] * cov[1][c]));
  const mid = [[0.5, 0.5, 0], [0, 0.5, 0.5], [0.5, 0, 0.5]];
  const curv = (L: number[]) => {
    const B = zeros(3, 15), v = new Array<number>(15).fill(0);
    const giro = (col: number, a: number, b: number, fx: number, fy: number) => {
      B[0][col] += b * fx; B[1][col] -= a * fy; B[2][col] += b * fy - a * fx; v[col] += a * fx + b * fy;
    };
    for (let i = 0; i < 3; i++) { giro(3 * i + 1, 1, 0, gL[i][0], gL[i][1]); giro(3 * i + 2, 0, 1, gL[i][0], gL[i][1]); }
    for (let k = 0; k < 3; k++) {
      const a = sa[k], b = sb[k];
      const gx = 4 * (L[a] * gL[b][0] + L[b] * gL[a][0]), gy = 4 * (L[a] * gL[b][1] + L[b] * gL[a][1]);
      giro(9 + 2 * k, 1, 0, gx, gy); giro(10 + 2 * k, 0, 1, gx, gy);
    }
    return { B, v };
  };
  const pts = mid.map((L) => curv(L));
  // B-barra: media de las 3 filas de curvatura de las 6 columnas de lado (columnas 9..14) sobre los 3 puntos
  const media = zeros(3, 6);
  for (const p of pts) for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) media[r][c] += p.B[r][9 + c] / 3;
  for (const p of pts) for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) p.B[r][9 + c] -= media[r][c];
  const pen = 1000 * (Db[0][0] + Db[1][1] + Db[2][2]);
  const K = zeros(15, 15);
  for (const p of pts) {
    for (let i = 0; i < 15; i++) for (let j = 0; j < 15; j++) {
      let s = 0;
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s += p.B[a][i] * Db[a][b] * p.B[b][j];
      s += Dsx * Bsh[0][i] * Bsh[0][j] + Dsy * Bsh[1][i] * Bsh[1][j];
      s += pen * p.v[i] * p.v[j];
      K[i][j] += s * (A / 3);
    }
  }
  return { K, curv, media, Bsh, Db, Dsx, Dsy };
}

/** u_int = Cnd·u (6×9) por eliminación de Gauss saltando pivotes nulos (como el kernel). */
function condensacion(K: Mat): Mat {
  const n = 15;
  const Kc = K.map((r) => r.slice());
  let esc = 0; for (const r of Kc) for (const v of r) esc = Math.max(esc, Math.abs(v));
  // Se eliminan las internas i = 9..14 en orden; cada una queda como combinación lineal de los GDL aún presentes.
  const exprs: number[][] = []; // exprs[i-9] = coeficientes de la interna i sobre los 15 GDL (los internos ya eliminados vuelven a sustituirse)
  const skip: boolean[] = [];
  for (let i = 9; i < n; i++) {
    const p = Kc[i][i];
    if (Math.abs(p) <= 1e-14 * esc) { skip.push(true); exprs.push(new Array<number>(n).fill(0)); continue; }
    skip.push(false);
    const fila = Kc[i].slice(), col = Kc.map((r) => r[i]);
    for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) Kc[a][b] -= (col[a] * fila[b]) / p;
    // u_i = −(1/p)·Σ_{j≠i} fila[j]·u_j   (fila ya excluye lo anterior eliminado porque esas columnas quedaron en 0)
    exprs.push(fila.map((v, j) => (j === i ? 0 : -v / p)));
    Kc[i].fill(0); for (const r of Kc) r[i] = 0;
  }
  // sustitución hacia atrás: u_int(i) depende de GDL nodales y de internas posteriores
  const Cnd = zeros(6, 9);
  const expr9 = exprs.map((e) => e.slice());
  for (let ii = 5; ii >= 0; ii--) {
    for (let jj = ii + 1; jj < 6; jj++) {
      const c = expr9[ii][9 + jj];
      if (c !== 0) for (let q = 0; q < 15; q++) expr9[ii][q] += c * expr9[jj][q];
      expr9[ii][9 + jj] = 0;
    }
  }
  for (let ii = 0; ii < 6; ii++) for (let q = 0; q < 9; q++) Cnd[ii][q] = skip[ii] ? 0 : expr9[ii][q];
  return Cnd;
}

/**
 * Momentos en los 3 joints [M11, M22, M12] (signo CSI) y cortante constante [V13, V23] del triángulo Thick de CSI.
 * `u9` = [w, θx, θy] de los 3 nudos en ejes locales.
 */
export function thickTriRecovery(
  xl: number[], yl: number[], u9: number[], E: number, nu: number, t: number, mods?: ThickTriMods
): { M: number[][]; V: number[] } {
  const el = elemento(xl, yl, E, nu, t, mods);
  const Cnd = condensacion(el.K);
  const u15 = u9.concat(Cnd.map((r) => r.reduce((s, c, q) => s + c * u9[q], 0)));
  const Mj = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((L) => {
    const { B } = el.curv(L);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) B[r][9 + c] -= el.media[r][c];
    const k = [0, 1, 2].map((r) => B[r].reduce((s, b, q) => s + b * u15[q], 0));
    return [0, 1, 2].map((r) => -(el.Db[r][0] * k[0] + el.Db[r][1] * k[1] + el.Db[r][2] * k[2]));   // signo CSI
  });
  const g = [0, 1].map((r) => el.Bsh[r].reduce((s, b, q) => s + b * u15[q], 0));
  return { M: Mj, V: [el.Dsx * g[0], el.Dsy * g[1]] };
}
