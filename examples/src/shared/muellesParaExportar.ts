/**
 * Los muelles del modelo, listos para escribir en un fichero de CSI (e2k / s2k / f2k).
 *
 * `nodeInputs.springs` mezcla dos cosas (ver hekatan-fem/src/cpp/utils/springsExtra.h):
 *   - muelles NODALES  {node >= 0, dof 0..5, k}
 *   - registros con nudo NEGATIVO = -(elemento+1): muelle de AREA (dof -1 consistente, -3 nodal) y
 *     nudo colgado (dof -2 `edge etabs`, -4 `edge lineal`, k = indice del nudo).
 * Los exportadores los trataban todos como nodales: el e2k reventaba (`nodes[-81]`), y el s2k/f2k
 * escribian `Joint=-80` o metian el indice de un nudo colgado como rigidez (radier MOD_002, 18-sep-2026).
 *
 * Aqui el muelle de AREA se reparte a los nudos por `ks * int N_i dA` (Gauss 2x2, jacobiano real), que
 * es lo que hacen SAP2000, ETABS y SAFE (medido: SAFE 22.6 en el radier MOD_002, 366/366 nudos a 7e-15).
 * El consistente (dof -1) tambien sale nodal: ningun fichero de CSI tiene ese muelle. Los nudos
 * colgados NO son muelles y se devuelven aparte (`colgados`) para que cada exportador decida.
 */
export interface MuellesExport {
  /** nudo -> [kUx, kUy, kUz, kRx, kRy, kRz] */
  nodales: Map<number, number[]>;
  /** [elemento, nudo colgado, lineal?] */
  colgados: Array<[number, number, boolean]>;
  /** cuantos registros de area se repartieron */
  deArea: number;
}

export function muellesParaExportar(nodes: number[][], elements: number[][], springs: any[] | undefined,
                                    opt: { sinArea?: boolean } = {}): MuellesExport {
  const nodales = new Map<number, number[]>();
  const colgados: Array<[number, number, boolean]> = [];
  let deArea = 0;
  const sumar = (n: number, d: number, k: number) => {
    const v = nodales.get(n) ?? [0, 0, 0, 0, 0, 0];
    v[d] += k; nodales.set(n, v);
  };
  const g = 1 / Math.sqrt(3);
  for (const sp of springs ?? []) {
    if (sp.node >= 0) {
      if (sp.dof >= 0 && sp.dof <= 5 && sp.k > 0) sumar(sp.node, sp.dof, sp.k);
      continue;
    }
    const e = -sp.node - 1, el = elements[e];
    if (!el) continue;
    if (sp.dof === -2 || sp.dof === -4) { colgados.push([e, Math.round(sp.k), sp.dof === -4]); continue; }
    if ((sp.dof !== -1 && sp.dof !== -3) || !(sp.k > 0) || (el.length !== 3 && el.length !== 4)) continue;
    if (opt.sinArea) continue;   // el exportador escribe el muelle de AREA como tal (s2k/f2k con `patrones`)
    deArea++;
    const P = el.map(n => nodes[n]);
    // normal de la cascara (diagonales del Q4 o lados del T3), como normalDe() del C++
    const a = P[0], b = P[1], c = P[2], d = el.length === 4 ? P[3] : P[0];
    const u = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const v = el.length === 4 ? [d[0] - b[0], d[1] - b[1], d[2] - b[2]] : [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    let nrm = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const ln = Math.hypot(nrm[0], nrm[1], nrm[2]); nrm = ln > 1e-30 ? nrm.map(x => x / ln) : [0, 0, 1];
    const w = new Array(el.length).fill(0);
    if (el.length === 3) {
      const cr = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
      w.fill(0.5 * Math.hypot(cr[0], cr[1], cr[2]) / 3);
    } else {
      for (const r of [-g, g]) for (const s of [-g, g]) {
        const N = [0.25 * (1 - r) * (1 - s), 0.25 * (1 + r) * (1 - s), 0.25 * (1 + r) * (1 + s), 0.25 * (1 - r) * (1 + s)];
        const dNr = [-0.25 * (1 - s), 0.25 * (1 - s), 0.25 * (1 + s), -0.25 * (1 + s)];
        const dNs = [-0.25 * (1 - r), -0.25 * (1 + r), 0.25 * (1 + r), 0.25 * (1 - r)];
        const xr = [0, 0, 0], xs = [0, 0, 0];
        for (let i = 0; i < 4; i++) for (let q = 0; q < 3; q++) { xr[q] += dNr[i] * P[i][q]; xs[q] += dNs[i] * P[i][q]; }
        const cr = [xr[1] * xs[2] - xr[2] * xs[1], xr[2] * xs[0] - xr[0] * xs[2], xr[0] * xs[1] - xr[1] * xs[0]];
        const dJ = Math.hypot(cr[0], cr[1], cr[2]);
        for (let i = 0; i < 4; i++) w[i] += N[i] * dJ;
      }
    }
    // losa horizontal (la normal es Z): muelle en UZ. Inclinada: se proyecta en los tres ejes globales
    // (diagonal; el acople fuera de la diagonal no cabe en un muelle nodal desacoplado de CSI).
    el.forEach((n, i) => { for (let q = 0; q < 3; q++) if (Math.abs(nrm[q]) > 1e-12) sumar(n, q, sp.k * w[i] * nrm[q] * nrm[q]); });
  }
  return { nodales, colgados, deArea };
}
