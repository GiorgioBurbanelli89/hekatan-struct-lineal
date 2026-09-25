/**
 * Losa RETICULAR (SLABTYPE "Waffle" de ETABS) -> lo que ETABS entrega al solver.
 *
 * Extraido de ETABS.dll 22.6 (RE estatico, hekatan-fem-py/benchmarks/tests_convergencia/WAFFLE_ETABS_RE.md):
 * ETABS no tiene elemento waffle; pasa una cascara homogenea de espesor h (OVERALLDEPTH, membrana =
 * flexion) con 10 modificadores que multiplican los del usuario:
 *
 *   [f11, f22, f12, m11, m22, m12, v13, v23, masa, peso]
 *   = [tv/h, tv/h, tf/h, (tb1/h)^3, (tb2/h)^3, (tt/h)^3, 1, 1, tv/h, tv/h]
 *
 *   tb_k = (12 I_k / s_k)^(1/3)   I_k = I33 de la T con ala = s_k ENTERA, alma trapecial bt -> bb
 *   tt   = min_k (3 J_k / s_k)^(1/3)   J_k = Saint-Venant de esa T
 *   tv   = h - (h - tf)/3 (At + Ab + sqrt(At Ab)) / (s1 s2)   (hueco = tronco de piramide)
 *
 * Espejo EXACTO de mesa_modelo.py (`_T_props`, `torsion_J_T`, `waffle_equiv`): la J va por Prandtl
 * con diferencias finitas en dos mallas + Richardson, igual que alli (ETABS la calcula por FE con
 * `cJConst.Calculate`; su numero exacto queda para la fase 2 con ETABS abierto).
 */

/** Seccion T de un nervio: ala s x tf arriba, alma trapecial bt (arriba) -> bb (abajo). [A, I33 centroidal] */
export function propiedadesT(h: number, tf: number, bt: number, bb: number, s: number): [number, number] {
  const hw = h - tf;
  const Aw = 0.5 * (bt + bb) * hw;
  const yw = Aw > 0 ? hw * (2 * bt + bb) / (3 * (bt + bb)) : 0;
  const Iw = Aw > 0 ? hw ** 3 * (bt * bt + 4 * bt * bb + bb * bb) / (36 * (bt + bb)) : 0;
  const Af = s * tf, yf = hw + tf / 2;
  const A = Aw + Af, yc = (Aw * yw + Af * yf) / A;
  const I = Iw + Aw * (yw - yc) ** 2 + s * tf ** 3 / 12 + Af * (yf - yc) ** 2;
  return [A, I];
}

/** round() de Python (mitad al PAR): la malla tiene que ser la MISMA que la de mesa_modelo.py. */
const redondeoPar = (v: number) => { const f = Math.floor(v), r = v - f;
  return r > 0.5 ? f + 1 : r < 0.5 ? f : (f % 2 === 0 ? f : f + 1); };

/** J de Saint-Venant de la T: lap(phi) = -2, phi = 0 en el borde, J = 2 ∫phi (misma malla que Python). */
export function torsionJT(h: number, tf: number, bt: number, bb: number, s: number): number {
  const Jmalla = (dd: number) => {
    const nx = redondeoPar(s / dd), ny = redondeoPar(h / dd), dx = s / nx, dy = h / ny;
    const idx = new Int32Array(nx * ny).fill(-1);
    let n = 0;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = (i + 0.5) * dx - s / 2, y = (j + 0.5) * dy;
      const wy = bb + (bt - bb) * Math.min(1, Math.max(0, y / (h - tf)));
      if (y >= h - tf || Math.abs(x) <= wy / 2) idx[j * nx + i] = n++;
    }
    // A phi = 2 (A simetrica definida positiva) -> gradiente conjugado con Jacobi
    const cx = 1 / (dx * dx), cy = 1 / (dy * dy);
    const vec: number[][] = [];          // por incognita: [k, j, i]
    const diag = new Float64Array(n);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k = idx[j * nx + i]; if (k < 0) continue;
      let d = 0;
      for (const [dj, di, c] of [[1, 0, cy], [-1, 0, cy], [0, 1, cx], [0, -1, cx]]) {
        const jj = j + dj, ii = i + di;
        d += (jj >= 0 && jj < ny && ii >= 0 && ii < nx && idx[jj * nx + ii] >= 0) ? c : 2 * c;   // fantasma antisimetrico
      }
      diag[k] = d; vec.push([k, j, i]);
    }
    const Ax = (p: Float64Array, out: Float64Array) => {
      for (const [k, j, i] of vec) {
        let v = diag[k] * p[k];
        if (j + 1 < ny) { const q = idx[(j + 1) * nx + i]; if (q >= 0) v -= cy * p[q]; }
        if (j > 0) { const q = idx[(j - 1) * nx + i]; if (q >= 0) v -= cy * p[q]; }
        if (i + 1 < nx) { const q = idx[j * nx + i + 1]; if (q >= 0) v -= cx * p[q]; }
        if (i > 0) { const q = idx[j * nx + i - 1]; if (q >= 0) v -= cx * p[q]; }
        out[k] = v;
      }
    };
    const x = new Float64Array(n), r = new Float64Array(n).fill(2), z = new Float64Array(n), p = new Float64Array(n), Ap = new Float64Array(n);
    for (let k = 0; k < n; k++) { z[k] = r[k] / diag[k]; p[k] = z[k]; }
    let rz = 0; for (let k = 0; k < n; k++) rz += r[k] * z[k];
    const r0 = Math.sqrt(4 * n);
    for (let it = 0; it < 20 * n; it++) {
      Ax(p, Ap);
      let pAp = 0; for (let k = 0; k < n; k++) pAp += p[k] * Ap[k];
      const a = rz / pAp;
      let rr = 0;
      for (let k = 0; k < n; k++) { x[k] += a * p[k]; r[k] -= a * Ap[k]; rr += r[k] * r[k]; }
      if (Math.sqrt(rr) < 1e-14 * r0) break;
      let rz2 = 0; for (let k = 0; k < n; k++) { z[k] = r[k] / diag[k]; rz2 += r[k] * z[k]; }
      const b = rz2 / rz; rz = rz2;
      for (let k = 0; k < n; k++) p[k] = z[k] + b * p[k];
    }
    let sum = 0; for (let k = 0; k < n; k++) sum += x[k];
    return 2 * sum * dx * dy;
  };
  const d1 = Math.min(tf, bb, bt) / 10;
  const J1 = Jmalla(d1), J2 = Jmalla(d1 / 2);
  return J2 + (J2 - J1) / 3;
}

export interface Reticular { t: number; tv: number; tb: [number, number]; tt: number; mods: number[] }

/** h, tf, bt, bb, s1, s2 en unidades COHERENTES (cualquiera): los modificadores son adimensionales. */
export function reticularEtabs(h: number, tf: number, bt: number, bb: number, s1: number, s2: number): Reticular {
  const tb: number[] = [], tt: number[] = [];
  for (const sk of [s1, s2]) {
    const I = propiedadesT(h, tf, bt, bb, sk)[1];
    tb.push((12 * I / sk) ** (1 / 3));
    tt.push((3 * torsionJT(h, tf, bt, bb, sk) / sk) ** (1 / 3));
  }
  const At = (s1 - bt) * (s2 - bt), Ab = (s1 - bb) * (s2 - bb);
  const tv = h - (h - tf) / 3 * (At + Ab + Math.sqrt(At * Ab)) / (s1 * s2);
  const t_t = Math.min(tt[0], tt[1]);
  const mods = [tv / h, tv / h, tf / h, (tb[0] / h) ** 3, (tb[1] / h) ** 3, (t_t / h) ** 3, 1, 1, tv / h, tv / h];
  return { t: h, tv, tb: [tb[0], tb[1]], tt: t_t, mods };
}
