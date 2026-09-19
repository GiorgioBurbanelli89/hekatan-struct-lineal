import { n as co, o as eo, p as ao, q as io, __tla as __tla_0 } from "./aiAgent-Ocg1dyZM.js";
import { s as oo, n as Rt, b as Et, k as Vt, i as Gt, z as ot, c as Wt, m as H, t as zt, a as Kt, e as W, f as Pt } from "./pureFunctionsAny.generated-DeJSBP3k.js";
let Qo, It, bo;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const Bt = 1 / Math.sqrt(3);
  function $t(t, o) {
    const r = [
      0.25 * (1 - t) * (1 - o),
      0.25 * (1 + t) * (1 - o),
      0.25 * (1 + t) * (1 + o),
      0.25 * (1 - t) * (1 + o)
    ], e = [
      -0.25 * (1 - o),
      0.25 * (1 - o),
      0.25 * (1 + o),
      -0.25 * (1 + o)
    ], c = [
      -0.25 * (1 - t),
      -0.25 * (1 + t),
      0.25 * (1 + t),
      0.25 * (1 - t)
    ];
    return {
      N: r,
      dNdxi: e,
      dNdeta: c
    };
  }
  function Ht(t, o, r, e) {
    let c = 0, i = 0, n = 0, a = 0;
    for (let l = 0; l < 4; l++) c += t[l] * r[l], i += t[l] * e[l], n += o[l] * r[l], a += o[l] * e[l];
    const y = c * a - i * n, Y = 1 / y, s = [], p = [];
    for (let l = 0; l < 4; l++) s.push(Y * (a * t[l] - i * o[l])), p.push(Y * (-n * t[l] + c * o[l]));
    return {
      dNdx: s,
      dNdy: p,
      detJ: y,
      J: [
        c,
        i,
        n,
        a
      ]
    };
  }
  function fo(t, o, r, e, c, i) {
    const n = r * c / (1 - e * e), a = [
      [
        n,
        n * e,
        0
      ],
      [
        n * e,
        n,
        0
      ],
      [
        0,
        0,
        n * (1 - e) / 2
      ]
    ], y = [
      1,
      2,
      3,
      0
    ], Y = [
      3,
      0,
      1,
      2
    ], s = [], p = [];
    for (let x = 0; x < 4; x++) s.push((o[y[x]] - o[x]) / 8), p.push(-(t[y[x]] - t[x]) / 8);
    const l = [
      -Math.sqrt(3 / 5),
      0,
      Math.sqrt(3 / 5)
    ], h = [
      5 / 9,
      8 / 9,
      5 / 9
    ], g = Jt(14, 14);
    let M = [], N = [], b = [], j = [], J = [], A = 0, f = 0, v = 0;
    for (let x = 0; x < 3; x++) for (let u = 0; u < 3; u++) {
      const F = l[x], z = l[u], w = h[x] * h[u], { N: X, dNdxi: Z, dNdeta: B } = $t(F, z);
      let P = 0, U = 0, Q = 0, K = 0;
      for (let d = 0; d < 4; d++) P += Z[d] * t[d], U += Z[d] * o[d], Q += B[d] * t[d], K += B[d] * o[d];
      const $ = P * K - U * Q, tt = K / $, rt = -U / $, C = -Q / $, at = P / $, it = [], et = [];
      for (let d = 0; d < 4; d++) it.push(tt * Z[d] + rt * B[d]), et.push(C * Z[d] + at * B[d]);
      const lt = [
        -F * (1 - z),
        0.5 * (1 - z * z),
        -F * (1 + z),
        -0.5 * (1 - z * z)
      ], At = [
        -0.5 * (1 - F * F),
        -z * (1 + F),
        0.5 * (1 - F * F),
        -z * (1 - F)
      ], V = [], gt = [];
      for (let d = 0; d < 4; d++) V.push(tt * lt[d] + rt * At[d]), gt.push(C * lt[d] + at * At[d]);
      const ut = -2 * F * (1 - z * z), pt = -2 * z * (1 - F * F), xt = tt * ut + rt * pt, bt = C * ut + at * pt, jt = [], dt = [], wt = [], Mt = [];
      for (let d = 0; d < 4; d++) {
        const I = Y[d];
        jt.push(V[I] * s[I] - V[d] * s[d]), dt.push(gt[I] * s[I] - gt[d] * s[d]), wt.push(V[I] * p[I] - V[d] * p[d]), Mt.push(gt[I] * p[I] - gt[d] * p[d]);
      }
      const ct = Jt(3, 14);
      for (let d = 0; d < 4; d++) ct[0][3 * d] = it[d], ct[1][3 * d + 1] = et[d], ct[2][3 * d] = et[d], ct[2][3 * d + 1] = it[d], ct[0][3 * d + 2] = jt[d], ct[1][3 * d + 2] = Mt[d], ct[2][3 * d + 2] = dt[d] + wt[d];
      ct[0][12] = xt, ct[2][12] = bt, ct[1][13] = bt, ct[2][13] = xt;
      const qt = w * Math.abs($);
      for (let d = 0; d < 14; d++) for (let I = 0; I < 14; I++) {
        let ht = 0;
        for (let mt = 0; mt < 3; mt++) for (let q = 0; q < 3; q++) ht += ct[mt][d] * a[mt][q] * ct[q][I];
        g[d][I] += qt * ht;
      }
      x === 1 && u === 1 && (M = X.slice(), N = it.slice(), b = et.slice(), j = dt.slice(), J = wt.slice(), A = xt, f = bt, v = Math.abs($));
    }
    const k = r / (2 * (1 + e)), L = new Array(14).fill(0);
    for (let x = 0; x < 4; x++) L[3 * x] = -0.5 * b[x], L[3 * x + 1] = 0.5 * N[x], L[3 * x + 2] = 0.5 * (J[x] - j[x]) - M[x];
    L[12] = -0.5 * f, L[13] = 0.5 * A;
    const m = i * k * c * 4 * v;
    for (let x = 0; x < 14; x++) for (let u = 0; u < 14; u++) g[x][u] += m * L[x] * L[u];
    const T = [
      [
        g[12][12],
        g[12][13]
      ],
      [
        g[13][12],
        g[13][13]
      ]
    ], E = T[0][0] * T[1][1] - T[0][1] * T[1][0], nt = Jt(12, 12);
    for (let x = 0; x < 12; x++) for (let u = 0; u < 12; u++) nt[x][u] = g[x][u];
    if (Math.abs(E) < 1e-30) return nt;
    const G = [
      [
        T[1][1] / E,
        -T[0][1] / E
      ],
      [
        -T[1][0] / E,
        T[0][0] / E
      ]
    ];
    for (let x = 0; x < 12; x++) for (let u = 0; u < 12; u++) {
      let F = 0;
      for (let z = 0; z < 2; z++) for (let w = 0; w < 2; w++) F += g[x][12 + z] * G[z][w] * g[12 + w][u];
      nt[x][u] -= F;
    }
    return nt;
  }
  function lo(t, o, r, e, c) {
    const i = Jt(12, 12), n = r * c * c * c / (12 * (1 - e * e)), y = 5 / 6 * r / (2 * (1 + e)) * c, Y = [
      [
        -Bt,
        -Bt
      ],
      [
        Bt,
        -Bt
      ],
      [
        Bt,
        Bt
      ],
      [
        -Bt,
        Bt
      ]
    ], s = [
      {
        xi: 0,
        eta: -1
      },
      {
        xi: 0,
        eta: 1
      },
      {
        xi: -1,
        eta: 0
      },
      {
        xi: 1,
        eta: 0
      }
    ], p = [];
    for (const l of s) {
      const { N: h, dNdxi: g, dNdeta: M } = $t(l.xi, l.eta), { dNdx: N, dNdy: b, J: j } = Ht(g, M, t, o), J = Jt(2, 12);
      for (let m = 0; m < 4; m++) J[0][m * 3] = N[m], J[0][m * 3 + 1] = -h[m], J[1][m * 3] = b[m], J[1][m * 3 + 2] = -h[m];
      const [A, f, v, k] = j, L = Jt(2, 12);
      for (let m = 0; m < 12; m++) L[0][m] = A * J[0][m] + f * J[1][m], L[1][m] = v * J[0][m] + k * J[1][m];
      p.push(L);
    }
    for (const [l, h] of Y) {
      const { dNdxi: g, dNdeta: M } = $t(l, h), { dNdx: N, dNdy: b, detJ: j, J } = Ht(g, M, t, o), A = Jt(3, 12);
      for (let u = 0; u < 4; u++) A[0][u * 3 + 1] = N[u], A[1][u * 3 + 2] = b[u], A[2][u * 3 + 1] = b[u], A[2][u * 3 + 2] = N[u];
      for (let u = 0; u < 12; u++) for (let F = 0; F < 12; F++) {
        let z = 0;
        z += n * (A[0][u] * A[0][F] + e * A[0][u] * A[1][F] + e * A[1][u] * A[0][F] + A[1][u] * A[1][F]), z += n * (1 - e) / 2 * A[2][u] * A[2][F], i[u][F] += z * Math.abs(j);
      }
      const f = Jt(2, 12), v = 0.5 * (1 - h), k = 0.5 * (1 + h), L = 0.5 * (1 - l), m = 0.5 * (1 + l), [T, E, nt, G] = J, x = 1 / j;
      for (let u = 0; u < 12; u++) {
        const F = v * p[0][0][u] + k * p[1][0][u], z = L * p[2][1][u] + m * p[3][1][u];
        f[0][u] = x * (G * F - E * z), f[1][u] = x * (-nt * F + T * z);
      }
      for (let u = 0; u < 12; u++) for (let F = 0; F < 12; F++) i[u][F] += y * (f[0][u] * f[0][F] + f[1][u] * f[1][F]) * Math.abs(j);
    }
    return i;
  }
  function go(t, o, r) {
    var _a, _b, _c;
    const e = ((_a = o == null ? void 0 : o.elasticities) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = o == null ? void 0 : o.poissonsRatios) == null ? void 0 : _b.get(r)) ?? 0.2, i = ((_c = o == null ? void 0 : o.thicknesses) == null ? void 0 : _c.get(r)) ?? 0;
    if (e === 0 || i === 0) return Jt(24, 24);
    const { localCoords: n } = no(t), a = n.map((b) => b[0]), y = n.map((b) => b[1]), Y = lo(a, y, e, c, i), p = fo(a, y, e, c, i, 0.4), l = Jt(24, 24), h = [
      2,
      3,
      4,
      8,
      9,
      10,
      14,
      15,
      16,
      20,
      21,
      22
    ], g = [
      [
        1,
        0,
        0
      ],
      [
        0,
        0,
        -1
      ],
      [
        0,
        1,
        0
      ]
    ], M = Jt(12, 12);
    for (let b = 0; b < 12; b++) for (let j = 0; j < 12; j++) {
      let J = 0;
      const A = b / 3 | 0, f = b % 3, v = j / 3 | 0, k = j % 3;
      for (let L = 0; L < 3; L++) {
        const m = g[L][f];
        if (m !== 0) for (let T = 0; T < 3; T++) {
          const E = g[T][k];
          E !== 0 && (J += m * Y[A * 3 + L][v * 3 + T] * E);
        }
      }
      M[b][j] = J;
    }
    for (let b = 0; b < 12; b++) for (let j = 0; j < 12; j++) l[h[b]][h[j]] += M[b][j];
    const N = [
      0,
      1,
      5,
      6,
      7,
      11,
      12,
      13,
      17,
      18,
      19,
      23
    ];
    for (let b = 0; b < 12; b++) for (let j = 0; j < 12; j++) l[N[b]][N[j]] += p[b][j];
    return l;
  }
  function ho(t) {
    const { localX: o, localY: r, localZ: e } = no(t), c = [
      [
        o[0],
        o[1],
        o[2]
      ],
      [
        r[0],
        r[1],
        r[2]
      ],
      [
        e[0],
        e[1],
        e[2]
      ]
    ], i = Jt(24, 24);
    for (let n = 0; n < 4; n++) for (let a = 0; a < 2; a++) {
      const y = n * 6 + a * 3;
      for (let Y = 0; Y < 3; Y++) for (let s = 0; s < 3; s++) i[y + Y][y + s] = c[Y][s];
    }
    return i;
  }
  function no(t) {
    const o = [
      t[2][0] - t[0][0],
      t[2][1] - t[0][1],
      t[2][2] - t[0][2]
    ], r = [
      t[3][0] - t[1][0],
      t[3][1] - t[1][1],
      t[3][2] - t[1][2]
    ], e = Ut(o, r), c = Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2), i = e.map((g) => g / c), n = [
      t[1][0] - t[0][0],
      t[1][1] - t[0][1],
      t[1][2] - t[0][2]
    ], a = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2), y = n.map((g) => g / a), Y = Ut(i, y), s = t.map((g) => g[0]).reduce((g, M) => g + M) / 4, p = t.map((g) => g[1]).reduce((g, M) => g + M) / 4, l = t.map((g) => g[2]).reduce((g, M) => g + M) / 4, h = t.map((g) => {
      const M = g[0] - s, N = g[1] - p, b = g[2] - l;
      return [
        M * y[0] + N * y[1] + b * y[2],
        M * Y[0] + N * Y[1] + b * Y[2]
      ];
    });
    return {
      localX: y,
      localY: Y,
      localZ: i,
      localCoords: h
    };
  }
  function Ut(t, o) {
    return [
      t[1] * o[2] - t[2] * o[1],
      t[2] * o[0] - t[0] * o[2],
      t[0] * o[1] - t[1] * o[0]
    ];
  }
  function Jt(t, o) {
    return Array.from({
      length: t
    }, () => Array(o).fill(0));
  }
  It = function(t, o = 0) {
    if (t.length === 2) return yo(t, o);
    if (t.length === 3) return Mo(t);
    if (t.length === 4) return ho(t);
  };
  function yo(t, o = 0) {
    const r = (s) => {
      if (Math.abs(o) < 1e-12) return s;
      const p = o * Math.PI / 180, l = Math.cos(p), h = Math.sin(p);
      return [
        s[0],
        [
          l * s[1][0] + h * s[2][0],
          l * s[1][1] + h * s[2][1],
          l * s[1][2] + h * s[2][2]
        ],
        [
          -h * s[1][0] + l * s[2][0],
          -h * s[1][1] + l * s[2][1],
          -h * s[1][2] + l * s[2][2]
        ]
      ];
    }, e = oo(t[1], t[0]), c = Rt(e), i = Et(e, [
      1,
      0,
      0
    ]) / c, n = Et(e, [
      0,
      1,
      0
    ]) / c, a = Et(e, [
      0,
      0,
      1
    ]) / c, y = Math.sqrt(i ** 2 + n ** 2);
    if (y < 1e-9) {
      const s = a > 0 ? 1 : -1, p = [
        [
          0,
          0,
          s
        ],
        [
          1,
          0,
          0
        ],
        [
          0,
          s,
          0
        ]
      ];
      return Vt(Gt(4), r(p)).toArray();
    }
    const Y = [
      [
        i,
        n,
        a
      ],
      [
        -i * a / y,
        -n * a / y,
        y
      ],
      [
        n / y,
        -i / y,
        0
      ]
    ];
    return Vt(Gt(4), r(Y)).toArray();
  }
  function Mo(t) {
    const i = [
      t[0],
      t[1],
      t[2]
    ], n = ot(3, 3).toArray();
    for (let f = 0; f < 3; f++) for (let v = 0; v < 3; v++) n[f][v] = i[v][f];
    const a = [
      -1,
      1,
      0
    ], y = [
      -1,
      0,
      1
    ], Y = ot(3, 2).toArray();
    for (let f = 0; f < 3; f++) for (let v = 0; v < 3; v++) Y[f][0] += n[f][v] * a[v], Y[f][1] += n[f][v] * y[v];
    const s = Y.map((f) => f[0]), p = Y.map((f) => f[1]);
    let l = Wt(s, p), h = Rt(l);
    if (h === 0) return console.warn("Degenerate triangle: nodes are collinear or coincident."), ot(18, 18).toArray();
    l = l.map((f) => f / h);
    const g = [
      ...l
    ], M = Gt(3).toArray(), N = l[0];
    let b;
    if (Math.abs(N) > 1 - 1e-10) {
      const f = l[2];
      b = M.map((v, k) => v[2] - f * l[k]);
    } else b = M.map((f, v) => f[0] - N * l[v]);
    if (h = Rt(b), h === 0) return console.warn("Degenerate local X-axis detected."), ot(18, 18).toArray();
    b = b.map((f) => f / h);
    let j = Wt(g, b);
    if (h = Rt(j), h === 0) return console.warn("Degenerate local Y-axis detected."), ot(18, 18).toArray();
    j = j.map((f) => f / h);
    const J = [
      b,
      j,
      g
    ], A = ot(18, 18).toArray();
    for (let f = 0; f < 3; f++) {
      const v = f * 6, k = v + 3;
      for (let L = 0; L < 3; L++) for (let m = 0; m < 3; m++) A[v + L][v + m] = J[L][m], A[k + L][k + m] = J[L][m];
    }
    return A;
  }
  bo = function(t, o, r) {
    var _a, _b, _c;
    if (t.length === 2) {
      let e = Xo(t, o, r);
      const c = (_a = o == null ? void 0 : o.partialFixitySprings) == null ? void 0 : _a.get(r);
      c && (e = uo(e, c));
      const i = (_b = o == null ? void 0 : o.momentReleases) == null ? void 0 : _b.get(r);
      i && (e = po(e, i));
      const n = (_c = o == null ? void 0 : o.endOffsets) == null ? void 0 : _c.get(r);
      if (n && n[2] > 0 && (n[0] > 0 || n[1] > 0)) {
        const a = Ao(n[2] * n[0], n[2] * n[1]);
        e = Yo(a, e, a);
      }
      return e;
    }
    if (t.length === 3) return wo(t, o, r);
    if (t.length === 4) return go(t, o, r);
  };
  function uo(t, o) {
    const r = t.map((c) => [
      ...c
    ]), e = Math.min(o.length, 12);
    for (let c = 0; c < e; c++) o[c] > 1e-12 && (r[c][c] += o[c]);
    return r;
  }
  function po(t, o) {
    const r = [];
    if (o.length >= 12) for (let g = 0; g < 12; g++) o[g] && r.push(g);
    else {
      const g = [
        3,
        4,
        5,
        9,
        10,
        11
      ];
      for (let M = 0; M < Math.min(o.length, 6); M++) o[M] && r.push(g[M]);
    }
    if (r.length === 0) return t;
    const e = t.length, c = [];
    for (let g = 0; g < e; g++) r.includes(g) || c.push(g);
    const i = c.length, n = r.length, a = Array.from({
      length: n
    }, (g, M) => Array.from({
      length: n
    }, (N, b) => t[r[M]][r[b]])), y = Array.from({
      length: i
    }, (g, M) => Array.from({
      length: n
    }, (N, b) => t[c[M]][r[b]])), Y = Array.from({
      length: n
    }, (g, M) => Array.from({
      length: i
    }, (N, b) => t[r[M]][c[b]])), s = mo(a);
    if (!s) return t;
    const p = to(y, s), l = to(p, Y), h = Array.from({
      length: e
    }, () => Array(e).fill(0));
    for (let g = 0; g < i; g++) for (let M = 0; M < i; M++) h[c[g]][c[M]] = t[c[g]][c[M]] - l[g][M];
    return h;
  }
  function to(t, o) {
    const r = t.length, e = o[0].length, c = o.length, i = Array.from({
      length: r
    }, () => Array(e).fill(0));
    for (let n = 0; n < r; n++) for (let a = 0; a < e; a++) for (let y = 0; y < c; y++) i[n][a] += t[n][y] * o[y][a];
    return i;
  }
  function mo(t) {
    const o = t.length, r = t.map((e, c) => {
      const i = [
        ...e
      ];
      for (let n = 0; n < o; n++) i.push(c === n ? 1 : 0);
      return i;
    });
    for (let e = 0; e < o; e++) {
      let c = e;
      for (let n = e + 1; n < o; n++) Math.abs(r[n][e]) > Math.abs(r[c][e]) && (c = n);
      if ([r[e], r[c]] = [
        r[c],
        r[e]
      ], Math.abs(r[e][e]) < 1e-15) return null;
      const i = r[e][e];
      for (let n = 0; n < 2 * o; n++) r[e][n] /= i;
      for (let n = 0; n < o; n++) {
        if (n === e) continue;
        const a = r[n][e];
        for (let y = 0; y < 2 * o; y++) r[n][y] -= a * r[e][y];
      }
    }
    return r.map((e) => e.slice(o));
  }
  function Ao(t, o) {
    const r = Array.from({
      length: 12
    }, (e, c) => Array.from({
      length: 12
    }, (i, n) => c === n ? 1 : 0));
    return Math.abs(t) > 1e-12 && (r[1][5] = t, r[2][4] = -t), Math.abs(o) > 1e-12 && (r[7][11] = -o, r[8][10] = o), r;
  }
  function Yo(t, o, r) {
    const e = Array.from({
      length: 12
    }, () => Array(12).fill(0));
    for (let i = 0; i < 12; i++) for (let n = 0; n < 12; n++) {
      let a = 0;
      for (let y = 0; y < 12; y++) a += t[y][i] * o[y][n];
      e[i][n] = a;
    }
    const c = Array.from({
      length: 12
    }, () => Array(12).fill(0));
    for (let i = 0; i < 12; i++) for (let n = 0; n < 12; n++) {
      let a = 0;
      for (let y = 0; y < 12; y++) a += e[i][y] * r[y][n];
      c[i][n] = a;
    }
    return c;
  }
  function Xo(t, o, r) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const e = ((_a = o == null ? void 0 : o.momentsOfInertiaZ) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = o == null ? void 0 : o.momentsOfInertiaY) == null ? void 0 : _b.get(r)) ?? 0, i = ((_c = o == null ? void 0 : o.elasticities) == null ? void 0 : _c.get(r)) ?? 0, n = ((_d = o == null ? void 0 : o.areas) == null ? void 0 : _d.get(r)) ?? 0, a = ((_e = o == null ? void 0 : o.shearModuli) == null ? void 0 : _e.get(r)) ?? 0, y = ((_f = o == null ? void 0 : o.torsionalConstants) == null ? void 0 : _f.get(r)) ?? 0, Y = Rt(oo(t[0], t[1]));
    if (Y < 1e-12) return console.warn(`[hekatan-fem] barra ${r} de longitud CERO: matriz nula (no aporta rigidez). Mismo criterio que getLocalStiffnessMatrix.cpp.`), Array.from({
      length: 12
    }, () => new Array(12).fill(0));
    const s = (_g = o == null ? void 0 : o.endOffsets) == null ? void 0 : _g.get(r), p = s && s[2] > 0 ? Y - s[2] * (s[0] + s[1]) : Y;
    if (p <= 1e-9) throw new Error(`end offsets se comen la barra ${r}: L = ${Y.toFixed(4)} m, rz = ${s[2]}, offsets ${s[0]} y ${s[1]} -> Lf = ${p.toFixed(4)} m`);
    let l = ((_h = o == null ? void 0 : o.shearAreasY) == null ? void 0 : _h.get(r)) ?? 0, h = ((_i = o == null ? void 0 : o.shearAreasZ) == null ? void 0 : _i.get(r)) ?? 0;
    l === 0 && h === 0 && n > 0 && a > 0 && (l = h = 5 / 6 * n);
    const g = h > 0 && a > 0 ? 12 * i * e / (a * h * p ** 2) : 0, M = l > 0 && a > 0 ? 12 * i * c / (a * l * p ** 2) : 0, N = i * n / Y, b = a * y / Y, j = 12 * i * e / p ** 3 / (1 + g), J = 6 * i * e / p ** 2 / (1 + g), A = 4 * i * e / p * (1 + g / 4) / (1 + g), f = 2 * i * e / p * (1 - g / 2) / (1 + g), v = 12 * i * c / p ** 3 / (1 + M), k = 6 * i * c / p ** 2 / (1 + M), L = 4 * i * c / p * (1 + M / 4) / (1 + M), m = 2 * i * c / p * (1 - M / 2) / (1 + M);
    return [
      [
        N,
        0,
        0,
        0,
        0,
        0,
        -N,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        j,
        0,
        0,
        0,
        J,
        0,
        -j,
        0,
        0,
        0,
        J
      ],
      [
        0,
        0,
        v,
        0,
        -k,
        0,
        0,
        0,
        -v,
        0,
        -k,
        0
      ],
      [
        0,
        0,
        0,
        b,
        0,
        0,
        0,
        0,
        0,
        -b,
        0,
        0
      ],
      [
        0,
        0,
        -k,
        0,
        L,
        0,
        0,
        0,
        k,
        0,
        m,
        0
      ],
      [
        0,
        J,
        0,
        0,
        0,
        A,
        0,
        -J,
        0,
        0,
        0,
        f
      ],
      [
        -N,
        0,
        0,
        0,
        0,
        0,
        N,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        -j,
        0,
        0,
        0,
        -J,
        0,
        j,
        0,
        0,
        0,
        -J
      ],
      [
        0,
        0,
        -v,
        0,
        k,
        0,
        0,
        0,
        v,
        0,
        k,
        0
      ],
      [
        0,
        0,
        0,
        -b,
        0,
        0,
        0,
        0,
        0,
        b,
        0,
        0
      ],
      [
        0,
        0,
        -k,
        0,
        m,
        0,
        0,
        0,
        k,
        0,
        L,
        0
      ],
      [
        0,
        J,
        0,
        0,
        0,
        f,
        0,
        -J,
        0,
        0,
        0,
        A
      ]
    ];
  }
  function wo(t, o, r) {
    var _a, _b, _c, _d, _e;
    const e = ((_a = o.elasticities) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = o.elasticitiesOrthogonal) == null ? void 0 : _b.get(r)) ?? 0, i = ((_c = o.poissonsRatios) == null ? void 0 : _c.get(r)) ?? 0, n = ((_d = o.shearModuli) == null ? void 0 : _d.get(r)) ?? 0, a = ((_e = o.thicknesses) == null ? void 0 : _e.get(r)) ?? 0, y = c > 0, Y = y ? nt(e, c, n, i, a) : T(e, i, a), s = y ? G(n, a) : E(e, i, a), p = y ? ro(e, c, n, i) : so(e, i), l = t.map(([w, X]) => [
      w,
      X
    ]), h = l[1][0] - l[0][0], g = l[2][0] - l[0][0], M = l[0][1] - l[1][1], N = l[2][1] - l[0][1], b = 0.5 * (h * N - g * -M), j = x(l), J = F(l), A = z(l, p, a), f = H(H(zt(j), s), j), v = H(H(zt(J), Y), J), k = ot(18, 18).toArray(), L = H(Kt(f, v), b), m = [
      [
        0,
        1,
        5
      ],
      [
        6,
        7,
        11
      ],
      [
        12,
        13,
        17
      ]
    ];
    for (let w = 0; w < 3; w++) for (let X = 0; X < 3; X++) for (let Z = 0; Z < 3; Z++) {
      const B = m[w][X], P = m[Z][X];
      k[B][P] = A[w * 3 + X][Z * 3 + X];
    }
    for (let w = 0; w < 18; w++) for (let X = 0; X < 18; X++) k[w][X] = (k[w][X] ?? 0) + L.get([
      w,
      X
    ]);
    return k;
    function T(w, X, Z) {
      const B = w / (1 - X * X), P = W([
        [
          B,
          B * X,
          0
        ],
        [
          B * X,
          B,
          0
        ],
        [
          0,
          0,
          B * (1 - X) / 2
        ]
      ]);
      return H(Z ** 3 / 12, P);
    }
    function E(w, X, Z) {
      const B = 0.8333333333333334, P = w / (2 * (1 + X)), U = B * P * Z;
      return W([
        [
          U,
          0
        ],
        [
          0,
          U
        ]
      ]);
    }
    function nt(w, X, Z, B, P) {
      const U = X * B / w, Q = 1 - B * U, K = w / Q, $ = X / Q, tt = B * X / Q, C = W([
        [
          K,
          tt,
          0
        ],
        [
          tt,
          $,
          0
        ],
        [
          0,
          0,
          Z
        ]
      ]);
      return H(P ** 3 / 12, C);
    }
    function G(w, X) {
      const B = 0.8333333333333334 * w * X;
      return W([
        [
          B,
          0
        ],
        [
          0,
          B
        ]
      ]);
    }
    function x(w) {
      const X = ot(2, 18).toArray(), [Z, B] = w[0], [P, U] = w[1], [Q, K] = w[2], $ = 0.5 * ((P - Z) * (K - B) - (Q - Z) * -(B - U)), tt = (Z + P + Q) / 3, rt = (B + U + K) / 3, C = [
        tt,
        Z,
        P
      ], at = [
        rt,
        B,
        U
      ], it = [
        tt,
        P,
        Q
      ], et = [
        rt,
        U,
        K
      ], lt = [
        tt,
        Q,
        Z
      ], At = [
        rt,
        K,
        B
      ], V = 1 / 3, [gt, ut, pt, xt] = u(C, at), [bt, jt, dt, wt] = u(it, et), [Mt, ct, qt, d] = u(lt, At), I = ot(2, 18).toArray(), ht = ot(2, 18).toArray(), mt = ot(2, 18).toArray();
      for (let q = 0; q < 2; q++) for (let O = 0; O < 6; O++) I[q][O] = V * gt[q][O] + ut[q][O], I[q][O + 6] = V * gt[q][O] + pt[q][O], I[q][O + 12] = V * gt[q][O], ht[q][O] = V * bt[q][O], ht[q][O + 6] = V * bt[q][O] + jt[q][O], ht[q][O + 12] = V * bt[q][O] + dt[q][O], mt[q][O] = V * Mt[q][O] + qt[q][O], mt[q][O + 6] = V * Mt[q][O], mt[q][O + 12] = V * Mt[q][O] + ct[q][O];
      for (let q = 0; q < 2; q++) for (let O = 0; O < 18; O++) I[q][O] *= xt, ht[q][O] *= wt, mt[q][O] *= d, X[q][O] = (I[q][O] + ht[q][O] + mt[q][O]) / $;
      return X;
    }
    function u(w, X) {
      const Z = ot(2, 6).toArray(), B = ot(2, 6).toArray(), P = ot(2, 6).toArray(), U = w[1] - w[0], Q = w[0] - w[2], K = X[2] - X[0], $ = X[0] - X[1], tt = w[2] - w[1], rt = X[1] - X[2], C = 0.5 * (U * K - Q * $), at = 0.5 * $ * Q, it = 0.5 * K * U, et = 0.5 * U * Q, lt = 0.5 * $ * K;
      return Z[0][2] = 0.5 * tt / C, Z[0][3] = -0.5, Z[1][2] = 0.5 * rt / C, Z[1][4] = 0.5, B[0][2] = 0.5 * Q / C, B[0][3] = 0.5 * at / C, B[0][4] = 0.5 * et / C, B[1][2] = 0.5 * K / C, B[1][3] = 0.5 * lt / C, B[1][4] = 0.5 * it / C, P[0][2] = 0.5 * U / C, P[0][3] = -0.5 * it / C, P[0][4] = -0.5 * et / C, P[1][2] = 0.5 * $ / C, P[1][3] = -0.5 * lt / C, P[1][4] = -0.5 * at / C, [
        Z,
        B,
        P,
        C
      ];
    }
    function F(w) {
      const X = ot(3, 18).toArray(), [Z, B] = w[0], [P, U] = w[1], [Q, K] = w[2], $ = P - Z, tt = Q - Z, rt = Q - P, C = U - K, at = K - B, it = B - U, et = 0.5 * ($ * at - tt * -it), lt = C / (2 * et), At = rt / (2 * et), V = at / (2 * et), gt = -tt / (2 * et), ut = it / (2 * et), pt = $ / (2 * et);
      return X[0][4] = lt, X[0][10] = V, X[0][16] = ut, X[1][3] = -At, X[1][9] = -gt, X[1][15] = -pt, X[2][3] = -lt, X[2][4] = At, X[2][9] = -V, X[2][10] = gt, X[2][15] = -ut, X[2][16] = pt, X;
    }
    function z(w, X, Z) {
      let B = ot(9, 9).toArray(), P = ot(9, 9).toArray(), U = ot(9, 9).toArray(), Q = ot(9, 3).toArray(), K = ot(3, 9).toArray(), $ = ot(3, 3).toArray(), tt = ot(3, 3).toArray(), rt = ot(3, 3).toArray(), C = ot(3, 3).toArray(), at = ot(3, 3).toArray(), it = ot(3, 3).toArray(), et = ot(3, 3).toArray(), lt = ot(3, 3).toArray();
      const At = 1 / 8, V = At / 6, gt = At ** 2 / 4, ut = 1, pt = 2, xt = 1, bt = 0, jt = 1, dt = -1, wt = -1, Mt = -1, ct = -2, qt = w[0][0], d = w[0][1], I = w[1][0], ht = w[1][1], mt = w[2][0], q = w[2][1], O = qt - I, kt = I - mt, _t = mt - qt, Qt = d - ht, Ot = ht - q, Tt = q - d, vt = -O, Ft = -kt, St = -_t, Yt = -Qt, Nt = -Ot, Dt = -Tt, Ct = 0.5 * (vt * Tt - _t * -Qt), S = 2 * Ct, D = 4 * Ct, _ = 0.5 * Z, R = Ct * Z, yt = vt ** 2 + Yt ** 2, Xt = Ft ** 2 + Nt ** 2, ft = St ** 2 + Dt ** 2;
      Q[0][0] = _ * Ot, Q[0][2] = _ * Ft, Q[1][1] = _ * Ft, Q[1][2] = _ * Ot, Q[2][0] = _ * Ot * (Dt - Yt) * V, Q[2][1] = _ * Ft * (_t - O) * V, Q[2][2] = _ * (_t * Dt - O * Yt) * 2 * V, Q[3][0] = _ * Tt, Q[3][2] = _ * St, Q[4][1] = _ * St, Q[4][2] = _ * Tt, Q[5][0] = _ * Tt * (Yt - Nt) * V, Q[5][1] = _ * St * (O - kt) * V, Q[5][2] = _ * (O * Yt - kt * Nt) * 2 * V, Q[6][0] = _ * Qt, Q[6][2] = _ * vt, Q[7][1] = _ * vt, Q[7][2] = _ * Qt, Q[8][0] = _ * Qt * (Nt - Dt) * V, Q[8][1] = _ * vt * (kt - _t) * V, Q[8][2] = _ * (kt * Nt - _t * Dt) * 2 * V, U = H(H(W(Q), X), zt(W(Q))).toArray(), U = H(W(U), 1 / R).toArray(), K[0][0] = Ft / D, K[0][1] = Nt / D, K[0][2] = 1, K[0][3] = St / D, K[0][4] = Dt / D, K[0][6] = vt / D, K[0][7] = Yt / D, K[1][0] = Ft / D, K[1][1] = Nt / D, K[1][3] = St / D, K[1][4] = Dt / D, K[1][5] = 1, K[1][6] = vt / D, K[1][7] = Yt / D, K[2][0] = Ft / D, K[2][1] = Nt / D, K[2][3] = St / D, K[2][4] = Dt / D, K[2][6] = vt / D, K[2][7] = Yt / D, K[2][8] = 1;
      const Lt = 1 / (Ct * D);
      $[0][0] = Lt * Ot * Dt * yt, $[0][1] = Lt * Tt * Yt * Xt, $[0][2] = Lt * Qt * Nt * ft, $[1][0] = Lt * kt * St * yt, $[1][1] = Lt * _t * vt * Xt, $[1][2] = Lt * O * Ft * ft, $[2][0] = Lt * (Ot * _t + Ft * Dt) * yt, $[2][1] = Lt * (Tt * O + St * Yt) * Xt, $[2][2] = Lt * (Qt * kt + vt * Nt) * ft;
      const st = S / 3;
      tt[0][0] = st * ut / yt, tt[0][1] = st * pt / yt, tt[0][2] = st * xt / yt, tt[1][0] = st * bt / Xt, tt[1][1] = st * jt / Xt, tt[1][2] = st * dt / Xt, tt[2][0] = st * wt / ft, tt[2][1] = st * Mt / ft, tt[2][2] = st * ct / ft, rt[0][0] = st * ct / yt, rt[0][1] = st * wt / yt, rt[0][2] = st * Mt / yt, rt[1][0] = st * xt / Xt, rt[1][1] = st * ut / Xt, rt[1][2] = st * pt / Xt, rt[2][0] = st * dt / ft, rt[2][1] = st * bt / ft, rt[2][2] = st * jt / ft, C[0][0] = st * jt / yt, C[0][1] = st * dt / yt, C[0][2] = st * bt / yt, C[1][0] = st * Mt / Xt, C[1][1] = st * ct / Xt, C[1][2] = st * wt / Xt, C[2][0] = st * pt / ft, C[2][1] = st * xt / ft, C[2][2] = st * ut / ft, at = H(Kt(W(tt), W(rt)), 0.5).toArray(), it = H(Kt(W(rt), W(C)), 0.5).toArray(), et = H(Kt(W(C), W(tt)), 0.5).toArray();
      const Zt = H(H(zt(W($)), X), W($));
      return lt = Kt(Kt(H(H(zt(W(at)), Zt), W(at)), H(H(zt(W(it)), Zt), W(it))), H(H(zt(W(et)), Zt), W(et))).toArray(), lt = H(W(lt), 3 / 4 * gt * R).toArray(), P = H(H(zt(W(K)), W(lt)), W(K)).toArray(), B = Kt(W(U), W(P)).toArray(), B;
    }
  }
  function so(t, o) {
    const r = t / (1 - o * o);
    return W([
      [
        r,
        r * o,
        0
      ],
      [
        r * o,
        r,
        0
      ],
      [
        0,
        0,
        r * (1 - o) / 2
      ]
    ]);
  }
  function ro(t, o, r, e) {
    const c = o * e / t, i = 1 - e * c, n = t / i, a = o / i, y = e * o / i;
    return W([
      [
        n,
        y,
        0
      ],
      [
        y,
        a,
        0
      ],
      [
        0,
        0,
        r
      ]
    ]);
  }
  Qo = function(t, o, r, e) {
    const c = {
      normals: /* @__PURE__ */ new Map(),
      shearsY: /* @__PURE__ */ new Map(),
      shearsZ: /* @__PURE__ */ new Map(),
      torsions: /* @__PURE__ */ new Map(),
      bendingsY: /* @__PURE__ */ new Map(),
      bendingsZ: /* @__PURE__ */ new Map(),
      bendingXX: /* @__PURE__ */ new Map(),
      bendingYY: /* @__PURE__ */ new Map(),
      bendingXY: /* @__PURE__ */ new Map(),
      membraneXX: /* @__PURE__ */ new Map(),
      membraneYY: /* @__PURE__ */ new Map(),
      membraneXY: /* @__PURE__ */ new Map(),
      tranverseShearX: /* @__PURE__ */ new Map(),
      tranverseShearY: /* @__PURE__ */ new Map(),
      vonMises: /* @__PURE__ */ new Map()
    }, i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = {
      bendingXX: /* @__PURE__ */ new Map(),
      bendingYY: /* @__PURE__ */ new Map(),
      bendingXY: /* @__PURE__ */ new Map(),
      membraneXX: /* @__PURE__ */ new Map(),
      membraneYY: /* @__PURE__ */ new Map(),
      membraneXY: /* @__PURE__ */ new Map(),
      tranverseShearX: /* @__PURE__ */ new Map(),
      tranverseShearY: /* @__PURE__ */ new Map(),
      vonMises: /* @__PURE__ */ new Map()
    };
    o.forEach((Y, s) => {
      var _a, _b, _c, _d;
      const p = Y.map((h) => t[h]), l = Y.reduce((h, g) => {
        var _a2;
        const M = (_a2 = e.deformations) == null ? void 0 : _a2.get(g);
        return h.concat(M ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ]);
      }, []);
      if (Y.length === 2) {
        const h = It(p, ((_a = r == null ? void 0 : r.localAngles) == null ? void 0 : _a.get(s)) ?? 0), g = H(h, l), M = bo(p, r, s);
        let N = H(M, g);
        const b = (_b = r == null ? void 0 : r.frameLoads) == null ? void 0 : _b.get(s);
        if (b && (b[0] || b[1] || b[2])) {
          const j = p[0], J = p[1], A = [
            J[0] - j[0],
            J[1] - j[1],
            J[2] - j[2]
          ], f = Math.hypot(A[0], A[1], A[2]);
          if (f > 1e-9) {
            const v = [
              A[0] / f,
              A[1] / f,
              A[2] / f
            ], k = f * f / 12, L = [
              v[1] * b[2] - v[2] * b[1],
              v[2] * b[0] - v[0] * b[2],
              v[0] * b[1] - v[1] * b[0]
            ], m = [
              -b[0] * f / 2,
              -b[1] * f / 2,
              -b[2] * f / 2,
              -k * L[0],
              -k * L[1],
              -k * L[2],
              -b[0] * f / 2,
              -b[1] * f / 2,
              -b[2] * f / 2,
              +k * L[0],
              +k * L[1],
              +k * L[2]
            ], T = H(h, m);
            N = N.map((E, nt) => E + T[nt]);
          }
        }
        c.normals.set(s, [
          N[0],
          N[6]
        ]), c.shearsY.set(s, [
          N[1],
          N[7]
        ]), c.shearsZ.set(s, [
          N[2],
          N[8]
        ]), c.torsions.set(s, [
          N[3],
          N[9]
        ]), c.bendingsY.set(s, [
          N[4],
          N[10]
        ]), c.bendingsZ.set(s, [
          N[5],
          N[11]
        ]);
      } else if (Y.length === 4) {
        const h = vo(p, l, r, s);
        a.membraneXX.set(s, h.Nx), a.membraneYY.set(s, h.Ny), a.membraneXY.set(s, h.Nxy), a.bendingXX.set(s, h.Mx), a.bendingYY.set(s, h.My), a.bendingXY.set(s, h.Mxy), h.Mj && i.set(s, h.Mj), h.Nj && n.set(s, h.Nj), a.tranverseShearX.set(s, h.Qx), a.tranverseShearY.set(s, h.Qy), a.vonMises.set(s, h.vonMises);
      } else if (Y.length === 3) {
        const h = It(p, ((_c = r == null ? void 0 : r.localAngles) == null ? void 0 : _c.get(s)) ?? 0);
        H(h, l);
        const g = So(r, s), M = No(p), N = xo(l), b = jo(p), J = H(1 / (2 * b), H(H(g, M), N)).toArray(), A = ((_d = r.thicknesses) == null ? void 0 : _d.get(s)) ?? 1, f = J[0][0] * A, v = J[1][0] * A, k = J[2][0] * A, L = J[0][1] * (A ** 3 / 12), m = J[1][1] * (A ** 3 / 12), T = J[2][1] * (A ** 3 / 12);
        a.membraneXX.set(s, f), a.membraneYY.set(s, v), a.membraneXY.set(s, k), a.bendingXX.set(s, L), a.bendingYY.set(s, m), a.bendingXY.set(s, T);
      }
    });
    const { nodeToCentroidElementIndiciesMap: y } = _o(t, o);
    {
      const Y = (l) => {
        var _a;
        return (((_a = r == null ? void 0 : r.plateFormulations) == null ? void 0 : _a.get(l)) ?? 0) === 1;
      }, s = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
      if (o.forEach((l, h) => {
        if (l.length !== 4) return;
        const g = l.map((M) => t[M]);
        s.set(h, [
          0,
          1,
          2
        ].map((M) => g.reduce((N, b) => N + b[M], 0) / 4)), p.set(h, l);
      }), [
        ...p.keys()
      ].some(Y)) {
        const l = /* @__PURE__ */ new Map();
        for (const [h, g] of p) for (const M of g) {
          const N = l.get(M) ?? [];
          N.push(h), l.set(M, N);
        }
        for (const [h, g] of p) {
          if (!Y(h)) continue;
          const M = /* @__PURE__ */ new Map();
          for (const v of g) for (const k of l.get(v) ?? []) k !== h && M.set(k, (M.get(k) ?? 0) + 1);
          const N = [
            ...M
          ].filter(([, v]) => v >= 2).map(([v]) => v);
          if (N.length < 2) continue;
          const b = s.get(h), j = (v) => {
            let k = 0, L = 0, m = 0, T = 0, E = 0;
            const nt = v.get(h) ?? 0;
            for (const x of N) {
              const u = s.get(x), F = u[0] - b[0], z = u[1] - b[1], w = (v.get(x) ?? 0) - nt;
              k += F * F, L += F * z, m += z * z, T += F * w, E += z * w;
            }
            const G = k * m - L * L;
            return Math.abs(G) < 1e-12 ? [
              0,
              0
            ] : [
              (T * m - E * L) / G,
              (k * E - L * T) / G
            ];
          }, J = j(a.bendingXX), A = j(a.bendingYY), f = j(a.bendingXY);
          a.tranverseShearX.set(h, J[0] + f[1]), a.tranverseShearY.set(h, A[1] + f[0]);
        }
      }
    }
    return o.forEach((Y, s) => {
      if (Y.length !== 3 && Y.length !== 4) return;
      const p = Y.length, l = new Array(p).fill(0), h = new Array(p).fill(0), g = new Array(p).fill(0), M = new Array(p).fill(0), N = new Array(p).fill(0), b = new Array(p).fill(0), j = new Array(p).fill(0), J = new Array(p).fill(0), A = new Array(p).fill(0);
      Y.forEach((m, T) => {
        const E = (y.get(m) || []).filter((u) => o[u].length === 3 || o[u].length === 4), nt = (u) => Pt(E.map((F) => u.get(F) ?? 0)), G = (u, F) => Pt(E.map((z) => {
          const w = n.get(z), X = w ? o[z].indexOf(m) : -1;
          return w && X >= 0 ? w[X][u] : F.get(z) ?? 0;
        }));
        l[T] = G(0, a.membraneXX), h[T] = G(1, a.membraneYY), g[T] = G(2, a.membraneXY);
        const x = (u, F) => Pt(E.map((z) => {
          const w = i.get(z), X = w ? o[z].indexOf(m) : -1;
          return w && X >= 0 ? w[X][u] : F.get(z) ?? 0;
        }));
        M[T] = x(0, a.bendingXX), N[T] = x(1, a.bendingYY), b[T] = x(2, a.bendingXY), j[T] = nt(a.tranverseShearX), J[T] = nt(a.tranverseShearY), A[T] = nt(a.vonMises);
      }), c.membraneXX.set(s, l), c.membraneYY.set(s, h), c.membraneXY.set(s, g), c.bendingXX.set(s, M), c.bendingYY.set(s, N), c.bendingXY.set(s, b);
      const f = n.get(s), v = (m, T) => f ? f.reduce((E, nt) => E + nt[m], 0) / f.length : T.get(s) ?? 0;
      (c.membraneXXcentro ?? (c.membraneXXcentro = /* @__PURE__ */ new Map())).set(s, v(0, a.membraneXX)), (c.membraneYYcentro ?? (c.membraneYYcentro = /* @__PURE__ */ new Map())).set(s, v(1, a.membraneYY)), (c.membraneXYcentro ?? (c.membraneXYcentro = /* @__PURE__ */ new Map())).set(s, v(2, a.membraneXY)), f && ((c.membraneXXjoint ?? (c.membraneXXjoint = /* @__PURE__ */ new Map())).set(s, f.map((m) => m[0])), (c.membraneYYjoint ?? (c.membraneYYjoint = /* @__PURE__ */ new Map())).set(s, f.map((m) => m[1])), (c.membraneXYjoint ?? (c.membraneXYjoint = /* @__PURE__ */ new Map())).set(s, f.map((m) => m[2])));
      const k = i.get(s), L = (m, T) => k ? k.reduce((E, nt) => E + nt[m], 0) / k.length : T.get(s) ?? 0;
      if ((c.bendingXXcentro ?? (c.bendingXXcentro = /* @__PURE__ */ new Map())).set(s, L(0, a.bendingXX)), (c.bendingYYcentro ?? (c.bendingYYcentro = /* @__PURE__ */ new Map())).set(s, L(1, a.bendingYY)), (c.bendingXYcentro ?? (c.bendingXYcentro = /* @__PURE__ */ new Map())).set(s, L(2, a.bendingXY)), k && ((c.bendingXXjoint ?? (c.bendingXXjoint = /* @__PURE__ */ new Map())).set(s, k.map((m) => m[0])), (c.bendingYYjoint ?? (c.bendingYYjoint = /* @__PURE__ */ new Map())).set(s, k.map((m) => m[1])), (c.bendingXYjoint ?? (c.bendingXYjoint = /* @__PURE__ */ new Map())).set(s, k.map((m) => m[2]))), c.tranverseShearX.set(s, j), c.tranverseShearY.set(s, J), Y.length === 4) {
        const m = a.tranverseShearX.get(s) ?? 0, T = a.tranverseShearY.get(s) ?? 0;
        (c.tranverseShearXjoint ?? (c.tranverseShearXjoint = /* @__PURE__ */ new Map())).set(s, [
          m,
          m,
          m,
          m
        ]), (c.tranverseShearYjoint ?? (c.tranverseShearYjoint = /* @__PURE__ */ new Map())).set(s, [
          T,
          T,
          T,
          T
        ]);
      }
      c.vonMises.set(s, A);
    }), c;
  };
  function vo(t, o, r, e) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const c = ((_a = r.elasticities) == null ? void 0 : _a.get(e)) ?? 0, i = ((_b = r.poissonsRatios) == null ? void 0 : _b.get(e)) ?? 0, n = ((_c = r.thicknesses) == null ? void 0 : _c.get(e)) ?? 1, a = t[0], y = t[1], Y = t[2], s = t[3], p = [
      y[0] - a[0],
      y[1] - a[1],
      y[2] - a[2]
    ], l = [
      Y[0] - s[0],
      Y[1] - s[1],
      Y[2] - s[2]
    ];
    let h = [
      p[0] + l[0],
      p[1] + l[1],
      p[2] + l[2]
    ], g = Math.sqrt(h[0] * h[0] + h[1] * h[1] + h[2] * h[2]);
    g < 1e-14 && (g = 1);
    let M = [
      h[0] / g,
      h[1] / g,
      h[2] / g
    ];
    const N = [
      Y[0] - a[0],
      Y[1] - a[1],
      Y[2] - a[2]
    ], b = [
      s[0] - y[0],
      s[1] - y[1],
      s[2] - y[2]
    ];
    let j = [
      N[1] * b[2] - N[2] * b[1],
      N[2] * b[0] - N[0] * b[2],
      N[0] * b[1] - N[1] * b[0]
    ], J = Math.sqrt(j[0] * j[0] + j[1] * j[1] + j[2] * j[2]);
    J < 1e-14 && (J = 1);
    let A = [
      j[0] / J,
      j[1] / J,
      j[2] / J
    ], f = [
      A[1] * M[2] - A[2] * M[1],
      A[2] * M[0] - A[0] * M[2],
      A[0] * M[1] - A[1] * M[0]
    ], v = Math.sqrt(f[0] * f[0] + f[1] * f[1] + f[2] * f[2]);
    v < 1e-14 && (v = 1), f = [
      f[0] / v,
      f[1] / v,
      f[2] / v
    ];
    {
      if (Math.abs(A[2]) > 1 - 1e-6) M = [
        1,
        0,
        0
      ];
      else {
        const _ = [
          -A[1],
          A[0],
          0
        ], R = Math.hypot(_[0], _[1], _[2]) || 1;
        M = [
          _[0] / R,
          _[1] / R,
          _[2] / R
        ];
      }
      f = [
        A[1] * M[2] - A[2] * M[1],
        A[2] * M[0] - A[0] * M[2],
        A[0] * M[1] - A[1] * M[0]
      ];
      const D = Math.hypot(f[0], f[1], f[2]) || 1;
      f = [
        f[0] / D,
        f[1] / D,
        f[2] / D
      ], M = [
        f[1] * A[2] - f[2] * A[1],
        f[2] * A[0] - f[0] * A[2],
        f[0] * A[1] - f[1] * A[0]
      ];
    }
    const k = 0.25 * (a[0] + y[0] + Y[0] + s[0]), L = 0.25 * (a[1] + y[1] + Y[1] + s[1]), m = 0.25 * (a[2] + y[2] + Y[2] + s[2]), T = [], E = [];
    for (let S = 0; S < 4; S++) {
      const D = t[S][0] - k, _ = t[S][1] - L, R = t[S][2] - m;
      T.push(D * M[0] + _ * M[1] + R * M[2]), E.push(D * f[0] + _ * f[1] + R * f[2]);
    }
    const nt = [
      M,
      f,
      A
    ], G = new Array(24).fill(0);
    for (let S = 0; S < 4; S++) {
      const D = S * 6, _ = S * 6;
      for (let R = 0; R < 3; R++) G[_ + R] = nt[R][0] * o[D] + nt[R][1] * o[D + 1] + nt[R][2] * o[D + 2];
      for (let R = 0; R < 3; R++) G[_ + 3 + R] = nt[R][0] * o[D + 3] + nt[R][1] * o[D + 4] + nt[R][2] * o[D + 5];
    }
    const x = c / (1 - i * i), u = [
      [
        x * n,
        x * i * n,
        0
      ],
      [
        x * i * n,
        x * n,
        0
      ],
      [
        0,
        0,
        x * (1 - i) / 2 * n
      ]
    ], F = n * n * n / 12, z = [
      [
        x * F,
        x * i * F,
        0
      ],
      [
        x * i * F,
        x * F,
        0
      ],
      [
        0,
        0,
        x * (1 - i) / 2 * F
      ]
    ], w = [
      -0.25,
      0.25,
      0.25,
      -0.25
    ], X = [
      -0.25,
      -0.25,
      0.25,
      0.25
    ];
    let Z = 0, B = 0, P = 0, U = 0;
    for (let S = 0; S < 4; S++) Z += w[S] * T[S], B += w[S] * E[S], P += X[S] * T[S], U += X[S] * E[S];
    const Q = Z * U - B * P;
    if (Math.abs(Q) < 1e-20) return {
      Nx: 0,
      Ny: 0,
      Nxy: 0,
      Mx: 0,
      My: 0,
      Mxy: 0,
      Qx: 0,
      Qy: 0,
      vonMises: 0,
      Mj: null,
      Nj: null
    };
    const K = U / Q, $ = -B / Q, tt = -P / Q, rt = Z / Q, C = [], at = [];
    for (let S = 0; S < 4; S++) C.push(K * w[S] + $ * X[S]), at.push(tt * w[S] + rt * X[S]);
    let it = 0, et = 0, lt = 0;
    for (let S = 0; S < 4; S++) {
      const D = G[S * 6 + 0], _ = G[S * 6 + 1];
      it += C[S] * D, et += at[S] * _, lt += at[S] * D + C[S] * _;
    }
    const At = u[0][0] * it + u[0][1] * et, V = u[1][0] * it + u[1][1] * et, gt = u[2][2] * lt;
    let ut = 0, pt = 0, xt = 0;
    for (let S = 0; S < 4; S++) {
      const D = G[S * 6 + 3], _ = G[S * 6 + 4];
      ut += C[S] * _, pt += -at[S] * D, xt += at[S] * _ - C[S] * D;
    }
    const bt = -1, jt = bt * (z[0][0] * ut + z[0][1] * pt), dt = bt * (z[1][0] * ut + z[1][1] * pt), wt = bt * (z[2][2] * xt);
    let Mt = null;
    if (Math.abs(Q) > 1e-20) {
      const S = [];
      for (let ft = 0; ft < 4; ft++) S.push(G[ft * 6 + 0], G[ft * 6 + 1], G[ft * 6 + 5]);
      const D = ((_d = r == null ? void 0 : r.drillingTypes) == null ? void 0 : _d.get(e)) ?? 12, _ = ((_e = r == null ? void 0 : r.drillingPenaltyScales) == null ? void 0 : _e.get(e)) ?? 0.4, R = (_f = r == null ? void 0 : r.membraneModifiers) == null ? void 0 : _f.get(e), yt = (_g = r == null ? void 0 : r.shellModifiers) == null ? void 0 : _g.get(e), Xt = Array.isArray(yt) && yt.length >= 3 ? [
        yt[0],
        yt[1],
        yt[2]
      ] : typeof R == "number" && R !== 1 ? [
        R,
        R,
        R
      ] : null;
      try {
        Mt = co(T, E, S, c, i, n, {
          tipo: D,
          gammaFac: _,
          mod: Xt
        }), Mt && Mt.some((ft) => ft.some((Lt) => !Number.isFinite(Lt))) && (Mt = null);
      } catch {
        Mt = null;
      }
    }
    let ct = null;
    const qt = (((_h = r == null ? void 0 : r.plateFormulations) == null ? void 0 : _h.get(e)) ?? 0) !== 1, d = (_i = r == null ? void 0 : r.shellModifiers) == null ? void 0 : _i.get(e), I = (_j = r == null ? void 0 : r.bendingModifiers) == null ? void 0 : _j.get(e), ht = Array.isArray(d) && d.length >= 8 ? d : typeof I == "number" && I !== 1 ? [
      1,
      1,
      1,
      I,
      I,
      I,
      I,
      I
    ] : null;
    if (Math.abs(Q) > 1e-20) {
      const S = [];
      for (let D = 0; D < 4; D++) S.push(G[D * 6 + 2], G[D * 6 + 3], G[D * 6 + 4]);
      try {
        const D = globalThis.__hekatanDkqJoints ?? "gauss";
        ct = (qt ? eo(T, E, S, c, i, n, 1e3, ht) : ao(T, E, S, c, i, n, D)).map((_) => _.map((R) => bt * R)), ct.some((_) => _.some((R) => !Number.isFinite(R))) && (ct = null);
      } catch {
        ct = null;
      }
    }
    const mt = 5 / 6, q = c / (2 * (1 + i)), O = mt * q * n;
    let kt = 0, _t = 0, Qt = false;
    if (qt && Math.abs(Q) > 1e-20) try {
      const S = [];
      for (let R = 0; R < 4; R++) S.push(G[R * 6 + 2], G[R * 6 + 3], G[R * 6 + 4]);
      const [D, _] = io(T, E, S, c, i, n, 1e3, ht);
      Number.isFinite(D) && Number.isFinite(_) && (kt = D, _t = _, Qt = true);
    } catch {
      Qt = false;
    }
    if (!Qt) {
      let S = 0, D = 0;
      for (let _ = 0; _ < 4; _++) S += C[_] * G[_ * 6 + 2] + 0.25 * G[_ * 6 + 4], D += at[_] * G[_ * 6 + 2] - 0.25 * G[_ * 6 + 3];
      kt = O * (ht ? ht[6] : 1) * S, _t = O * (ht ? ht[7] : 1) * D;
    }
    const Ot = At / n + 6 * jt / (n * n), Tt = V / n + 6 * dt / (n * n), vt = gt / n + 6 * wt / (n * n), Ft = Math.sqrt(Ot * Ot - Ot * Tt + Tt * Tt + 3 * vt * vt), St = At / n - 6 * jt / (n * n), Yt = V / n - 6 * dt / (n * n), Nt = gt / n - 6 * wt / (n * n), Dt = Math.sqrt(St * St - St * Yt + Yt * Yt + 3 * Nt * Nt), Ct = Math.max(Ft, Dt);
    return {
      Nx: At,
      Ny: V,
      Nxy: gt,
      Mx: jt,
      My: dt,
      Mxy: wt,
      Qx: kt,
      Qy: _t,
      vonMises: Ct,
      Mj: ct,
      Nj: Mt
    };
  }
  function So(t, o) {
    var _a, _b, _c, _d, _e;
    const r = ((_a = t.elasticities) == null ? void 0 : _a.get(o)) ?? 0, e = ((_b = t.elasticitiesOrthogonal) == null ? void 0 : _b.get(o)) ?? 0, c = ((_c = t.poissonsRatios) == null ? void 0 : _c.get(o)) ?? 0, i = ((_d = t.shearModuli) == null ? void 0 : _d.get(o)) ?? 0;
    return (_e = t.thicknesses) == null ? void 0 : _e.get(o), e > 0 ? ro(r, e, i, c) : so(r, c);
  }
  function No(t) {
    const [o, r] = t[0], [e, c] = t[1], [i, n] = t[2], a = c - n, y = n - r, Y = r - c, s = i - e, p = o - i, l = e - o;
    return W([
      [
        a,
        y,
        Y,
        0,
        0,
        0
      ],
      [
        0,
        0,
        0,
        s,
        p,
        l
      ],
      [
        s,
        p,
        l,
        a,
        y,
        Y
      ]
    ]);
  }
  function xo(t) {
    const [o, r, e] = [
      t[0],
      t[6],
      t[12]
    ], [c, i, n] = [
      t[1],
      t[7],
      t[13]
    ], [a, y, Y] = [
      t[4],
      t[10],
      t[16]
    ], [s, p, l] = [
      t[3],
      t[9],
      t[15]
    ];
    return W([
      [
        o,
        -a
      ],
      [
        r,
        -y
      ],
      [
        e,
        -Y
      ],
      [
        c,
        s
      ],
      [
        i,
        p
      ],
      [
        n,
        l
      ]
    ]);
  }
  function jo(t) {
    const [o, r] = t[0], [e, c] = t[1], [i, n] = t[2], a = e - o, y = i - o, Y = n - r, s = r - c;
    return 0.5 * (a * Y - y * -s);
  }
  function _o(t, o) {
    const r = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
    return o.forEach((c, i) => {
      const n = c.map((y) => t[y]), a = Do(n);
      c.forEach((y) => {
        var _a, _b;
        r.has(y) || r.set(y, []), (_a = r.get(y)) == null ? void 0 : _a.push(a), e.has(y) || e.set(y, []), (_b = e.get(y)) == null ? void 0 : _b.push(i);
      });
    }), {
      nodeToCentroidNodesMap: r,
      nodeToCentroidElementIndiciesMap: e
    };
  }
  function Do(t) {
    const o = t.reduce((c, i) => c + i[0], 0) / t.length, r = t.reduce((c, i) => c + i[1], 0) / t.length, e = t.reduce((c, i) => c + i[2], 0) / t.length;
    return [
      o,
      r,
      e
    ];
  }
});
export {
  __tla,
  Qo as a,
  It as b,
  bo as g
};
