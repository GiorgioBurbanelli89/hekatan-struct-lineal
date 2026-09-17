import { i as co, j as eo, l as ao, __tla as __tla_0 } from "./getViewer-CHIxMOEz.js";
import { s as oo, n as Rt, b as Et, k as Vt, i as Gt, z as tt, c as Wt, m as W, t as Kt, a as Ct, e as V, f as Pt } from "./pureFunctionsAny.generated-DeJSBP3k.js";
let ko, It, yo;
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
    const s = [
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
      N: s,
      dNdxi: e,
      dNdeta: c
    };
  }
  function Ht(t, o, s, e) {
    let c = 0, i = 0, n = 0, a = 0;
    for (let f = 0; f < 4; f++) c += t[f] * s[f], i += t[f] * e[f], n += o[f] * s[f], a += o[f] * e[f];
    const M = c * a - i * n, X = 1 / M, r = [], p = [];
    for (let f = 0; f < 4; f++) r.push(X * (a * t[f] - i * o[f])), p.push(X * (-n * t[f] + c * o[f]));
    return {
      dNdx: r,
      dNdy: p,
      detJ: M,
      J: [
        c,
        i,
        n,
        a
      ]
    };
  }
  function io(t, o, s, e, c, i) {
    const n = s * c / (1 - e * e), a = [
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
    ], M = [
      1,
      2,
      3,
      0
    ], X = [
      3,
      0,
      1,
      2
    ], r = [], p = [];
    for (let S = 0; S < 4; S++) r.push((o[M[S]] - o[S]) / 8), p.push(-(t[M[S]] - t[S]) / 8);
    const f = [
      -Math.sqrt(3 / 5),
      0,
      Math.sqrt(3 / 5)
    ], h = [
      5 / 9,
      8 / 9,
      5 / 9
    ], g = Jt(14, 14);
    let y = [], v = [], b = [], j = [], D = [], m = 0, l = 0, N = 0;
    for (let S = 0; S < 3; S++) for (let u = 0; u < 3; u++) {
      const k = f[S], q = f[u], w = h[S] * h[u], { N: d, dNdxi: R, dNdeta: K } = $t(k, q);
      let Z = 0, H = 0, Q = 0, B = 0;
      for (let x = 0; x < 4; x++) Z += R[x] * t[x], H += R[x] * o[x], Q += K[x] * t[x], B += K[x] * o[x];
      const G = Z * B - H * Q, I = B / G, st = -H / G, C = -Q / G, at = Z / G, it = [], ct = [];
      for (let x = 0; x < 4; x++) it.push(I * R[x] + st * K[x]), ct.push(C * R[x] + at * K[x]);
      const ft = [
        -k * (1 - q),
        0.5 * (1 - q * q),
        -k * (1 + q),
        -0.5 * (1 - q * q)
      ], pt = [
        -0.5 * (1 - k * k),
        -q * (1 + k),
        0.5 * (1 - k * k),
        -q * (1 - k)
      ], $ = [], gt = [];
      for (let x = 0; x < 4; x++) $.push(I * ft[x] + st * pt[x]), gt.push(C * ft[x] + at * pt[x]);
      const bt = -2 * k * (1 - q * q), ut = -2 * q * (1 - k * k), vt = I * bt + st * ut, Mt = C * bt + at * ut, St = [], Xt = [], dt = [], ht = [];
      for (let x = 0; x < 4; x++) {
        const et = X[x];
        St.push($[et] * r[et] - $[x] * r[x]), Xt.push(gt[et] * r[et] - gt[x] * r[x]), dt.push($[et] * p[et] - $[x] * p[x]), ht.push(gt[et] * p[et] - gt[x] * p[x]);
      }
      const rt = Jt(3, 14);
      for (let x = 0; x < 4; x++) rt[0][3 * x] = it[x], rt[1][3 * x + 1] = ct[x], rt[2][3 * x] = ct[x], rt[2][3 * x + 1] = it[x], rt[0][3 * x + 2] = St[x], rt[1][3 * x + 2] = ht[x], rt[2][3 * x + 2] = Xt[x] + dt[x];
      rt[0][12] = vt, rt[2][12] = Mt, rt[1][13] = Mt, rt[2][13] = vt;
      const Ft = w * Math.abs(G);
      for (let x = 0; x < 14; x++) for (let et = 0; et < 14; et++) {
        let mt = 0;
        for (let yt = 0; yt < 3; yt++) for (let L = 0; L < 3; L++) mt += rt[yt][x] * a[yt][L] * rt[L][et];
        g[x][et] += Ft * mt;
      }
      S === 1 && u === 1 && (y = d.slice(), v = it.slice(), b = ct.slice(), j = Xt.slice(), D = dt.slice(), m = vt, l = Mt, N = Math.abs(G));
    }
    const J = s / (2 * (1 + e)), T = new Array(14).fill(0);
    for (let S = 0; S < 4; S++) T[3 * S] = -0.5 * b[S], T[3 * S + 1] = 0.5 * v[S], T[3 * S + 2] = 0.5 * (D[S] - j[S]) - y[S];
    T[12] = -0.5 * l, T[13] = 0.5 * m;
    const Y = i * J * c * 4 * N;
    for (let S = 0; S < 14; S++) for (let u = 0; u < 14; u++) g[S][u] += Y * T[S] * T[u];
    const z = [
      [
        g[12][12],
        g[12][13]
      ],
      [
        g[13][12],
        g[13][13]
      ]
    ], P = z[0][0] * z[1][1] - z[0][1] * z[1][0], ot = Jt(12, 12);
    for (let S = 0; S < 12; S++) for (let u = 0; u < 12; u++) ot[S][u] = g[S][u];
    if (Math.abs(P) < 1e-30) return ot;
    const U = [
      [
        z[1][1] / P,
        -z[0][1] / P
      ],
      [
        -z[1][0] / P,
        z[0][0] / P
      ]
    ];
    for (let S = 0; S < 12; S++) for (let u = 0; u < 12; u++) {
      let k = 0;
      for (let q = 0; q < 2; q++) for (let w = 0; w < 2; w++) k += g[S][12 + q] * U[q][w] * g[12 + w][u];
      ot[S][u] -= k;
    }
    return ot;
  }
  function lo(t, o, s, e, c) {
    const i = Jt(12, 12), n = s * c * c * c / (12 * (1 - e * e)), M = 5 / 6 * s / (2 * (1 + e)) * c, X = [
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
    ], r = [
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
    for (const f of r) {
      const { N: h, dNdxi: g, dNdeta: y } = $t(f.xi, f.eta), { dNdx: v, dNdy: b, J: j } = Ht(g, y, t, o), D = Jt(2, 12);
      for (let Y = 0; Y < 4; Y++) D[0][Y * 3] = v[Y], D[0][Y * 3 + 1] = -h[Y], D[1][Y * 3] = b[Y], D[1][Y * 3 + 2] = -h[Y];
      const [m, l, N, J] = j, T = Jt(2, 12);
      for (let Y = 0; Y < 12; Y++) T[0][Y] = m * D[0][Y] + l * D[1][Y], T[1][Y] = N * D[0][Y] + J * D[1][Y];
      p.push(T);
    }
    for (const [f, h] of X) {
      const { dNdxi: g, dNdeta: y } = $t(f, h), { dNdx: v, dNdy: b, detJ: j, J: D } = Ht(g, y, t, o), m = Jt(3, 12);
      for (let u = 0; u < 4; u++) m[0][u * 3 + 1] = v[u], m[1][u * 3 + 2] = b[u], m[2][u * 3 + 1] = b[u], m[2][u * 3 + 2] = v[u];
      for (let u = 0; u < 12; u++) for (let k = 0; k < 12; k++) {
        let q = 0;
        q += n * (m[0][u] * m[0][k] + e * m[0][u] * m[1][k] + e * m[1][u] * m[0][k] + m[1][u] * m[1][k]), q += n * (1 - e) / 2 * m[2][u] * m[2][k], i[u][k] += q * Math.abs(j);
      }
      const l = Jt(2, 12), N = 0.5 * (1 - h), J = 0.5 * (1 + h), T = 0.5 * (1 - f), Y = 0.5 * (1 + f), [z, P, ot, U] = D, S = 1 / j;
      for (let u = 0; u < 12; u++) {
        const k = N * p[0][0][u] + J * p[1][0][u], q = T * p[2][1][u] + Y * p[3][1][u];
        l[0][u] = S * (U * k - P * q), l[1][u] = S * (-ot * k + z * q);
      }
      for (let u = 0; u < 12; u++) for (let k = 0; k < 12; k++) i[u][k] += M * (l[0][u] * l[0][k] + l[1][u] * l[1][k]) * Math.abs(j);
    }
    return i;
  }
  function fo(t, o, s) {
    var _a, _b, _c;
    const e = ((_a = o == null ? void 0 : o.elasticities) == null ? void 0 : _a.get(s)) ?? 0, c = ((_b = o == null ? void 0 : o.poissonsRatios) == null ? void 0 : _b.get(s)) ?? 0.2, i = ((_c = o == null ? void 0 : o.thicknesses) == null ? void 0 : _c.get(s)) ?? 0;
    if (e === 0 || i === 0) return Jt(24, 24);
    const { localCoords: n } = no(t), a = n.map((b) => b[0]), M = n.map((b) => b[1]), X = lo(a, M, e, c, i), p = io(a, M, e, c, i, 0.4), f = Jt(24, 24), h = [
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
    ], y = Jt(12, 12);
    for (let b = 0; b < 12; b++) for (let j = 0; j < 12; j++) {
      let D = 0;
      const m = b / 3 | 0, l = b % 3, N = j / 3 | 0, J = j % 3;
      for (let T = 0; T < 3; T++) {
        const Y = g[T][l];
        if (Y !== 0) for (let z = 0; z < 3; z++) {
          const P = g[z][J];
          P !== 0 && (D += Y * X[m * 3 + T][N * 3 + z] * P);
        }
      }
      y[b][j] = D;
    }
    for (let b = 0; b < 12; b++) for (let j = 0; j < 12; j++) f[h[b]][h[j]] += y[b][j];
    const v = [
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
    for (let b = 0; b < 12; b++) for (let j = 0; j < 12; j++) f[v[b]][v[j]] += p[b][j];
    return f;
  }
  function go(t) {
    const { localX: o, localY: s, localZ: e } = no(t), c = [
      [
        o[0],
        o[1],
        o[2]
      ],
      [
        s[0],
        s[1],
        s[2]
      ],
      [
        e[0],
        e[1],
        e[2]
      ]
    ], i = Jt(24, 24);
    for (let n = 0; n < 4; n++) for (let a = 0; a < 2; a++) {
      const M = n * 6 + a * 3;
      for (let X = 0; X < 3; X++) for (let r = 0; r < 3; r++) i[M + X][M + r] = c[X][r];
    }
    return i;
  }
  function no(t) {
    const o = [
      t[2][0] - t[0][0],
      t[2][1] - t[0][1],
      t[2][2] - t[0][2]
    ], s = [
      t[3][0] - t[1][0],
      t[3][1] - t[1][1],
      t[3][2] - t[1][2]
    ], e = Ut(o, s), c = Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2), i = e.map((g) => g / c), n = [
      t[1][0] - t[0][0],
      t[1][1] - t[0][1],
      t[1][2] - t[0][2]
    ], a = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2), M = n.map((g) => g / a), X = Ut(i, M), r = t.map((g) => g[0]).reduce((g, y) => g + y) / 4, p = t.map((g) => g[1]).reduce((g, y) => g + y) / 4, f = t.map((g) => g[2]).reduce((g, y) => g + y) / 4, h = t.map((g) => {
      const y = g[0] - r, v = g[1] - p, b = g[2] - f;
      return [
        y * M[0] + v * M[1] + b * M[2],
        y * X[0] + v * X[1] + b * X[2]
      ];
    });
    return {
      localX: M,
      localY: X,
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
    if (t.length === 2) return ho(t, o);
    if (t.length === 3) return Mo(t);
    if (t.length === 4) return go(t);
  };
  function ho(t, o = 0) {
    const s = (r) => {
      if (Math.abs(o) < 1e-12) return r;
      const p = o * Math.PI / 180, f = Math.cos(p), h = Math.sin(p);
      return [
        r[0],
        [
          f * r[1][0] + h * r[2][0],
          f * r[1][1] + h * r[2][1],
          f * r[1][2] + h * r[2][2]
        ],
        [
          -h * r[1][0] + f * r[2][0],
          -h * r[1][1] + f * r[2][1],
          -h * r[1][2] + f * r[2][2]
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
    ]) / c, M = Math.sqrt(i ** 2 + n ** 2);
    if (M < 1e-9) {
      const r = a > 0 ? 1 : -1, p = [
        [
          0,
          0,
          r
        ],
        [
          1,
          0,
          0
        ],
        [
          0,
          r,
          0
        ]
      ];
      return Vt(Gt(4), s(p)).toArray();
    }
    const X = [
      [
        i,
        n,
        a
      ],
      [
        -i * a / M,
        -n * a / M,
        M
      ],
      [
        n / M,
        -i / M,
        0
      ]
    ];
    return Vt(Gt(4), s(X)).toArray();
  }
  function Mo(t) {
    const i = [
      t[0],
      t[1],
      t[2]
    ], n = tt(3, 3).toArray();
    for (let l = 0; l < 3; l++) for (let N = 0; N < 3; N++) n[l][N] = i[N][l];
    const a = [
      -1,
      1,
      0
    ], M = [
      -1,
      0,
      1
    ], X = tt(3, 2).toArray();
    for (let l = 0; l < 3; l++) for (let N = 0; N < 3; N++) X[l][0] += n[l][N] * a[N], X[l][1] += n[l][N] * M[N];
    const r = X.map((l) => l[0]), p = X.map((l) => l[1]);
    let f = Wt(r, p), h = Rt(f);
    if (h === 0) return console.warn("Degenerate triangle: nodes are collinear or coincident."), tt(18, 18).toArray();
    f = f.map((l) => l / h);
    const g = [
      ...f
    ], y = Gt(3).toArray(), v = f[0];
    let b;
    if (Math.abs(v) > 1 - 1e-10) {
      const l = f[2];
      b = y.map((N, J) => N[2] - l * f[J]);
    } else b = y.map((l, N) => l[0] - v * f[N]);
    if (h = Rt(b), h === 0) return console.warn("Degenerate local X-axis detected."), tt(18, 18).toArray();
    b = b.map((l) => l / h);
    let j = Wt(g, b);
    if (h = Rt(j), h === 0) return console.warn("Degenerate local Y-axis detected."), tt(18, 18).toArray();
    j = j.map((l) => l / h);
    const D = [
      b,
      j,
      g
    ], m = tt(18, 18).toArray();
    for (let l = 0; l < 3; l++) {
      const N = l * 6, J = N + 3;
      for (let T = 0; T < 3; T++) for (let Y = 0; Y < 3; Y++) m[N + T][N + Y] = D[T][Y], m[J + T][J + Y] = D[T][Y];
    }
    return m;
  }
  yo = function(t, o, s) {
    var _a, _b, _c;
    if (t.length === 2) {
      let e = Ao(t, o, s);
      const c = (_a = o == null ? void 0 : o.partialFixitySprings) == null ? void 0 : _a.get(s);
      c && (e = bo(e, c));
      const i = (_b = o == null ? void 0 : o.momentReleases) == null ? void 0 : _b.get(s);
      i && (e = uo(e, i));
      const n = (_c = o == null ? void 0 : o.endOffsets) == null ? void 0 : _c.get(s);
      if (n && n[2] > 0 && (n[0] > 0 || n[1] > 0)) {
        const a = mo(n[2] * n[0], n[2] * n[1]);
        e = Yo(a, e, a);
      }
      return e;
    }
    if (t.length === 3) return Xo(t, o, s);
    if (t.length === 4) return fo(t, o, s);
  };
  function bo(t, o) {
    const s = t.map((c) => [
      ...c
    ]), e = Math.min(o.length, 12);
    for (let c = 0; c < e; c++) o[c] > 1e-12 && (s[c][c] += o[c]);
    return s;
  }
  function uo(t, o) {
    const s = [];
    if (o.length >= 12) for (let g = 0; g < 12; g++) o[g] && s.push(g);
    else {
      const g = [
        3,
        4,
        5,
        9,
        10,
        11
      ];
      for (let y = 0; y < Math.min(o.length, 6); y++) o[y] && s.push(g[y]);
    }
    if (s.length === 0) return t;
    const e = t.length, c = [];
    for (let g = 0; g < e; g++) s.includes(g) || c.push(g);
    const i = c.length, n = s.length, a = Array.from({
      length: n
    }, (g, y) => Array.from({
      length: n
    }, (v, b) => t[s[y]][s[b]])), M = Array.from({
      length: i
    }, (g, y) => Array.from({
      length: n
    }, (v, b) => t[c[y]][s[b]])), X = Array.from({
      length: n
    }, (g, y) => Array.from({
      length: i
    }, (v, b) => t[s[y]][c[b]])), r = po(a);
    if (!r) return t;
    const p = to(M, r), f = to(p, X), h = Array.from({
      length: e
    }, () => Array(e).fill(0));
    for (let g = 0; g < i; g++) for (let y = 0; y < i; y++) h[c[g]][c[y]] = t[c[g]][c[y]] - f[g][y];
    return h;
  }
  function to(t, o) {
    const s = t.length, e = o[0].length, c = o.length, i = Array.from({
      length: s
    }, () => Array(e).fill(0));
    for (let n = 0; n < s; n++) for (let a = 0; a < e; a++) for (let M = 0; M < c; M++) i[n][a] += t[n][M] * o[M][a];
    return i;
  }
  function po(t) {
    const o = t.length, s = t.map((e, c) => {
      const i = [
        ...e
      ];
      for (let n = 0; n < o; n++) i.push(c === n ? 1 : 0);
      return i;
    });
    for (let e = 0; e < o; e++) {
      let c = e;
      for (let n = e + 1; n < o; n++) Math.abs(s[n][e]) > Math.abs(s[c][e]) && (c = n);
      if ([s[e], s[c]] = [
        s[c],
        s[e]
      ], Math.abs(s[e][e]) < 1e-15) return null;
      const i = s[e][e];
      for (let n = 0; n < 2 * o; n++) s[e][n] /= i;
      for (let n = 0; n < o; n++) {
        if (n === e) continue;
        const a = s[n][e];
        for (let M = 0; M < 2 * o; M++) s[n][M] -= a * s[e][M];
      }
    }
    return s.map((e) => e.slice(o));
  }
  function mo(t, o) {
    const s = Array.from({
      length: 12
    }, (e, c) => Array.from({
      length: 12
    }, (i, n) => c === n ? 1 : 0));
    return Math.abs(t) > 1e-12 && (s[1][5] = t, s[2][4] = -t), Math.abs(o) > 1e-12 && (s[7][11] = -o, s[8][10] = o), s;
  }
  function Yo(t, o, s) {
    const e = Array.from({
      length: 12
    }, () => Array(12).fill(0));
    for (let i = 0; i < 12; i++) for (let n = 0; n < 12; n++) {
      let a = 0;
      for (let M = 0; M < 12; M++) a += t[M][i] * o[M][n];
      e[i][n] = a;
    }
    const c = Array.from({
      length: 12
    }, () => Array(12).fill(0));
    for (let i = 0; i < 12; i++) for (let n = 0; n < 12; n++) {
      let a = 0;
      for (let M = 0; M < 12; M++) a += e[i][M] * s[M][n];
      c[i][n] = a;
    }
    return c;
  }
  function Ao(t, o, s) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const e = ((_a = o == null ? void 0 : o.momentsOfInertiaZ) == null ? void 0 : _a.get(s)) ?? 0, c = ((_b = o == null ? void 0 : o.momentsOfInertiaY) == null ? void 0 : _b.get(s)) ?? 0, i = ((_c = o == null ? void 0 : o.elasticities) == null ? void 0 : _c.get(s)) ?? 0, n = ((_d = o == null ? void 0 : o.areas) == null ? void 0 : _d.get(s)) ?? 0, a = ((_e = o == null ? void 0 : o.shearModuli) == null ? void 0 : _e.get(s)) ?? 0, M = ((_f = o == null ? void 0 : o.torsionalConstants) == null ? void 0 : _f.get(s)) ?? 0, X = Rt(oo(t[0], t[1]));
    if (X < 1e-12) return console.warn(`[hekatan-fem] barra ${s} de longitud CERO: matriz nula (no aporta rigidez). Mismo criterio que getLocalStiffnessMatrix.cpp.`), Array.from({
      length: 12
    }, () => new Array(12).fill(0));
    const r = (_g = o == null ? void 0 : o.endOffsets) == null ? void 0 : _g.get(s), p = r && r[2] > 0 ? X - r[2] * (r[0] + r[1]) : X;
    if (p <= 1e-9) throw new Error(`end offsets se comen la barra ${s}: L = ${X.toFixed(4)} m, rz = ${r[2]}, offsets ${r[0]} y ${r[1]} -> Lf = ${p.toFixed(4)} m`);
    let f = ((_h = o == null ? void 0 : o.shearAreasY) == null ? void 0 : _h.get(s)) ?? 0, h = ((_i = o == null ? void 0 : o.shearAreasZ) == null ? void 0 : _i.get(s)) ?? 0;
    f === 0 && h === 0 && n > 0 && a > 0 && (f = h = 5 / 6 * n);
    const g = h > 0 && a > 0 ? 12 * i * e / (a * h * p ** 2) : 0, y = f > 0 && a > 0 ? 12 * i * c / (a * f * p ** 2) : 0, v = i * n / X, b = a * M / X, j = 12 * i * e / p ** 3 / (1 + g), D = 6 * i * e / p ** 2 / (1 + g), m = 4 * i * e / p * (1 + g / 4) / (1 + g), l = 2 * i * e / p * (1 - g / 2) / (1 + g), N = 12 * i * c / p ** 3 / (1 + y), J = 6 * i * c / p ** 2 / (1 + y), T = 4 * i * c / p * (1 + y / 4) / (1 + y), Y = 2 * i * c / p * (1 - y / 2) / (1 + y);
    return [
      [
        v,
        0,
        0,
        0,
        0,
        0,
        -v,
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
        D,
        0,
        -j,
        0,
        0,
        0,
        D
      ],
      [
        0,
        0,
        N,
        0,
        -J,
        0,
        0,
        0,
        -N,
        0,
        -J,
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
        -J,
        0,
        T,
        0,
        0,
        0,
        J,
        0,
        Y,
        0
      ],
      [
        0,
        D,
        0,
        0,
        0,
        m,
        0,
        -D,
        0,
        0,
        0,
        l
      ],
      [
        -v,
        0,
        0,
        0,
        0,
        0,
        v,
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
        -D,
        0,
        j,
        0,
        0,
        0,
        -D
      ],
      [
        0,
        0,
        -N,
        0,
        J,
        0,
        0,
        0,
        N,
        0,
        J,
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
        -J,
        0,
        Y,
        0,
        0,
        0,
        J,
        0,
        T,
        0
      ],
      [
        0,
        D,
        0,
        0,
        0,
        l,
        0,
        -D,
        0,
        0,
        0,
        m
      ]
    ];
  }
  function Xo(t, o, s) {
    var _a, _b, _c, _d, _e;
    const e = ((_a = o.elasticities) == null ? void 0 : _a.get(s)) ?? 0, c = ((_b = o.elasticitiesOrthogonal) == null ? void 0 : _b.get(s)) ?? 0, i = ((_c = o.poissonsRatios) == null ? void 0 : _c.get(s)) ?? 0, n = ((_d = o.shearModuli) == null ? void 0 : _d.get(s)) ?? 0, a = ((_e = o.thicknesses) == null ? void 0 : _e.get(s)) ?? 0, M = c > 0, X = M ? ot(e, c, n, i, a) : z(e, i, a), r = M ? U(n, a) : P(e, i, a), p = M ? ro(e, c, n, i) : so(e, i), f = t.map(([w, d]) => [
      w,
      d
    ]), h = f[1][0] - f[0][0], g = f[2][0] - f[0][0], y = f[0][1] - f[1][1], v = f[2][1] - f[0][1], b = 0.5 * (h * v - g * -y), j = S(f), D = k(f), m = q(f, p, a), l = W(W(Kt(j), r), j), N = W(W(Kt(D), X), D), J = tt(18, 18).toArray(), T = W(Ct(l, N), b), Y = [
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
    for (let w = 0; w < 3; w++) for (let d = 0; d < 3; d++) for (let R = 0; R < 3; R++) {
      const K = Y[w][d], Z = Y[R][d];
      J[K][Z] = m[w * 3 + d][R * 3 + d];
    }
    for (let w = 0; w < 18; w++) for (let d = 0; d < 18; d++) J[w][d] = (J[w][d] ?? 0) + T.get([
      w,
      d
    ]);
    return J;
    function z(w, d, R) {
      const K = w / (1 - d * d), Z = V([
        [
          K,
          K * d,
          0
        ],
        [
          K * d,
          K,
          0
        ],
        [
          0,
          0,
          K * (1 - d) / 2
        ]
      ]);
      return W(R ** 3 / 12, Z);
    }
    function P(w, d, R) {
      const K = 0.8333333333333334, Z = w / (2 * (1 + d)), H = K * Z * R;
      return V([
        [
          H,
          0
        ],
        [
          0,
          H
        ]
      ]);
    }
    function ot(w, d, R, K, Z) {
      const H = d * K / w, Q = 1 - K * H, B = w / Q, G = d / Q, I = K * d / Q, C = V([
        [
          B,
          I,
          0
        ],
        [
          I,
          G,
          0
        ],
        [
          0,
          0,
          R
        ]
      ]);
      return W(Z ** 3 / 12, C);
    }
    function U(w, d) {
      const K = 0.8333333333333334 * w * d;
      return V([
        [
          K,
          0
        ],
        [
          0,
          K
        ]
      ]);
    }
    function S(w) {
      const d = tt(2, 18).toArray(), [R, K] = w[0], [Z, H] = w[1], [Q, B] = w[2], G = 0.5 * ((Z - R) * (B - K) - (Q - R) * -(K - H)), I = (R + Z + Q) / 3, st = (K + H + B) / 3, C = [
        I,
        R,
        Z
      ], at = [
        st,
        K,
        H
      ], it = [
        I,
        Z,
        Q
      ], ct = [
        st,
        H,
        B
      ], ft = [
        I,
        Q,
        R
      ], pt = [
        st,
        B,
        K
      ], $ = 1 / 3, [gt, bt, ut, vt] = u(C, at), [Mt, St, Xt, dt] = u(it, ct), [ht, rt, Ft, x] = u(ft, pt), et = tt(2, 18).toArray(), mt = tt(2, 18).toArray(), yt = tt(2, 18).toArray();
      for (let L = 0; L < 2; L++) for (let O = 0; O < 6; O++) et[L][O] = $ * gt[L][O] + bt[L][O], et[L][O + 6] = $ * gt[L][O] + ut[L][O], et[L][O + 12] = $ * gt[L][O], mt[L][O] = $ * Mt[L][O], mt[L][O + 6] = $ * Mt[L][O] + St[L][O], mt[L][O + 12] = $ * Mt[L][O] + Xt[L][O], yt[L][O] = $ * ht[L][O] + Ft[L][O], yt[L][O + 6] = $ * ht[L][O], yt[L][O + 12] = $ * ht[L][O] + rt[L][O];
      for (let L = 0; L < 2; L++) for (let O = 0; O < 18; O++) et[L][O] *= vt, mt[L][O] *= dt, yt[L][O] *= x, d[L][O] = (et[L][O] + mt[L][O] + yt[L][O]) / G;
      return d;
    }
    function u(w, d) {
      const R = tt(2, 6).toArray(), K = tt(2, 6).toArray(), Z = tt(2, 6).toArray(), H = w[1] - w[0], Q = w[0] - w[2], B = d[2] - d[0], G = d[0] - d[1], I = w[2] - w[1], st = d[1] - d[2], C = 0.5 * (H * B - Q * G), at = 0.5 * G * Q, it = 0.5 * B * H, ct = 0.5 * H * Q, ft = 0.5 * G * B;
      return R[0][2] = 0.5 * I / C, R[0][3] = -0.5, R[1][2] = 0.5 * st / C, R[1][4] = 0.5, K[0][2] = 0.5 * Q / C, K[0][3] = 0.5 * at / C, K[0][4] = 0.5 * ct / C, K[1][2] = 0.5 * B / C, K[1][3] = 0.5 * ft / C, K[1][4] = 0.5 * it / C, Z[0][2] = 0.5 * H / C, Z[0][3] = -0.5 * it / C, Z[0][4] = -0.5 * ct / C, Z[1][2] = 0.5 * G / C, Z[1][3] = -0.5 * ft / C, Z[1][4] = -0.5 * at / C, [
        R,
        K,
        Z,
        C
      ];
    }
    function k(w) {
      const d = tt(3, 18).toArray(), [R, K] = w[0], [Z, H] = w[1], [Q, B] = w[2], G = Z - R, I = Q - R, st = Q - Z, C = H - B, at = B - K, it = K - H, ct = 0.5 * (G * at - I * -it), ft = C / (2 * ct), pt = st / (2 * ct), $ = at / (2 * ct), gt = -I / (2 * ct), bt = it / (2 * ct), ut = G / (2 * ct);
      return d[0][4] = ft, d[0][10] = $, d[0][16] = bt, d[1][3] = -pt, d[1][9] = -gt, d[1][15] = -ut, d[2][3] = -ft, d[2][4] = pt, d[2][9] = -$, d[2][10] = gt, d[2][15] = -bt, d[2][16] = ut, d;
    }
    function q(w, d, R) {
      let K = tt(9, 9).toArray(), Z = tt(9, 9).toArray(), H = tt(9, 9).toArray(), Q = tt(9, 3).toArray(), B = tt(3, 9).toArray(), G = tt(3, 3).toArray(), I = tt(3, 3).toArray(), st = tt(3, 3).toArray(), C = tt(3, 3).toArray(), at = tt(3, 3).toArray(), it = tt(3, 3).toArray(), ct = tt(3, 3).toArray(), ft = tt(3, 3).toArray();
      const pt = 1 / 8, $ = pt / 6, gt = pt ** 2 / 4, bt = 1, ut = 2, vt = 1, Mt = 0, St = 1, Xt = -1, dt = -1, ht = -1, rt = -2, Ft = w[0][0], x = w[0][1], et = w[1][0], mt = w[1][1], yt = w[2][0], L = w[2][1], O = Ft - et, Ot = et - yt, Qt = yt - Ft, kt = x - mt, Tt = mt - L, Lt = L - x, jt = -O, wt = -Ot, xt = -Qt, Nt = -kt, _t = -Tt, Dt = -Lt, A = 0.5 * (jt * Lt - Qt * -kt), E = 2 * A, F = 4 * A, _ = 0.5 * R, qt = A * R, Yt = jt ** 2 + Nt ** 2, lt = wt ** 2 + _t ** 2, At = xt ** 2 + Dt ** 2;
      Q[0][0] = _ * Tt, Q[0][2] = _ * wt, Q[1][1] = _ * wt, Q[1][2] = _ * Tt, Q[2][0] = _ * Tt * (Dt - Nt) * $, Q[2][1] = _ * wt * (Qt - O) * $, Q[2][2] = _ * (Qt * Dt - O * Nt) * 2 * $, Q[3][0] = _ * Lt, Q[3][2] = _ * xt, Q[4][1] = _ * xt, Q[4][2] = _ * Lt, Q[5][0] = _ * Lt * (Nt - _t) * $, Q[5][1] = _ * xt * (O - Ot) * $, Q[5][2] = _ * (O * Nt - Ot * _t) * 2 * $, Q[6][0] = _ * kt, Q[6][2] = _ * jt, Q[7][1] = _ * jt, Q[7][2] = _ * kt, Q[8][0] = _ * kt * (_t - Dt) * $, Q[8][1] = _ * jt * (Ot - Qt) * $, Q[8][2] = _ * (Ot * _t - Qt * Dt) * 2 * $, H = W(W(V(Q), d), Kt(V(Q))).toArray(), H = W(V(H), 1 / qt).toArray(), B[0][0] = wt / F, B[0][1] = _t / F, B[0][2] = 1, B[0][3] = xt / F, B[0][4] = Dt / F, B[0][6] = jt / F, B[0][7] = Nt / F, B[1][0] = wt / F, B[1][1] = _t / F, B[1][3] = xt / F, B[1][4] = Dt / F, B[1][5] = 1, B[1][6] = jt / F, B[1][7] = Nt / F, B[2][0] = wt / F, B[2][1] = _t / F, B[2][3] = xt / F, B[2][4] = Dt / F, B[2][6] = jt / F, B[2][7] = Nt / F, B[2][8] = 1;
      const zt = 1 / (A * F);
      G[0][0] = zt * Tt * Dt * Yt, G[0][1] = zt * Lt * Nt * lt, G[0][2] = zt * kt * _t * At, G[1][0] = zt * Ot * xt * Yt, G[1][1] = zt * Qt * jt * lt, G[1][2] = zt * O * wt * At, G[2][0] = zt * (Tt * Qt + wt * Dt) * Yt, G[2][1] = zt * (Lt * O + xt * Nt) * lt, G[2][2] = zt * (kt * Ot + jt * _t) * At;
      const nt = E / 3;
      I[0][0] = nt * bt / Yt, I[0][1] = nt * ut / Yt, I[0][2] = nt * vt / Yt, I[1][0] = nt * Mt / lt, I[1][1] = nt * St / lt, I[1][2] = nt * Xt / lt, I[2][0] = nt * dt / At, I[2][1] = nt * ht / At, I[2][2] = nt * rt / At, st[0][0] = nt * rt / Yt, st[0][1] = nt * dt / Yt, st[0][2] = nt * ht / Yt, st[1][0] = nt * vt / lt, st[1][1] = nt * bt / lt, st[1][2] = nt * ut / lt, st[2][0] = nt * Xt / At, st[2][1] = nt * Mt / At, st[2][2] = nt * St / At, C[0][0] = nt * St / Yt, C[0][1] = nt * Xt / Yt, C[0][2] = nt * Mt / Yt, C[1][0] = nt * ht / lt, C[1][1] = nt * rt / lt, C[1][2] = nt * dt / lt, C[2][0] = nt * ut / At, C[2][1] = nt * vt / At, C[2][2] = nt * bt / At, at = W(Ct(V(I), V(st)), 0.5).toArray(), it = W(Ct(V(st), V(C)), 0.5).toArray(), ct = W(Ct(V(C), V(I)), 0.5).toArray();
      const Zt = W(W(Kt(V(G)), d), V(G));
      return ft = Ct(Ct(W(W(Kt(V(at)), Zt), V(at)), W(W(Kt(V(it)), Zt), V(it))), W(W(Kt(V(ct)), Zt), V(ct))).toArray(), ft = W(V(ft), 3 / 4 * gt * qt).toArray(), Z = W(W(Kt(V(B)), V(ft)), V(B)).toArray(), K = Ct(V(H), V(Z)).toArray(), K;
    }
  }
  function so(t, o) {
    const s = t / (1 - o * o);
    return V([
      [
        s,
        s * o,
        0
      ],
      [
        s * o,
        s,
        0
      ],
      [
        0,
        0,
        s * (1 - o) / 2
      ]
    ]);
  }
  function ro(t, o, s, e) {
    const c = o * e / t, i = 1 - e * c, n = t / i, a = o / i, M = e * o / i;
    return V([
      [
        n,
        M,
        0
      ],
      [
        M,
        a,
        0
      ],
      [
        0,
        0,
        s
      ]
    ]);
  }
  ko = function(t, o, s, e) {
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
    o.forEach((X, r) => {
      var _a, _b, _c, _d;
      const p = X.map((h) => t[h]), f = X.reduce((h, g) => {
        var _a2;
        const y = (_a2 = e.deformations) == null ? void 0 : _a2.get(g);
        return h.concat(y ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ]);
      }, []);
      if (X.length === 2) {
        const h = It(p, ((_a = s == null ? void 0 : s.localAngles) == null ? void 0 : _a.get(r)) ?? 0), g = W(h, f), y = yo(p, s, r);
        let v = W(y, g);
        const b = (_b = s == null ? void 0 : s.frameLoads) == null ? void 0 : _b.get(r);
        if (b && (b[0] || b[1] || b[2])) {
          const j = p[0], D = p[1], m = [
            D[0] - j[0],
            D[1] - j[1],
            D[2] - j[2]
          ], l = Math.hypot(m[0], m[1], m[2]);
          if (l > 1e-9) {
            const N = [
              m[0] / l,
              m[1] / l,
              m[2] / l
            ], J = l * l / 12, T = [
              N[1] * b[2] - N[2] * b[1],
              N[2] * b[0] - N[0] * b[2],
              N[0] * b[1] - N[1] * b[0]
            ], Y = [
              -b[0] * l / 2,
              -b[1] * l / 2,
              -b[2] * l / 2,
              -J * T[0],
              -J * T[1],
              -J * T[2],
              -b[0] * l / 2,
              -b[1] * l / 2,
              -b[2] * l / 2,
              +J * T[0],
              +J * T[1],
              +J * T[2]
            ], z = W(h, Y);
            v = v.map((P, ot) => P + z[ot]);
          }
        }
        c.normals.set(r, [
          v[0],
          v[6]
        ]), c.shearsY.set(r, [
          v[1],
          v[7]
        ]), c.shearsZ.set(r, [
          v[2],
          v[8]
        ]), c.torsions.set(r, [
          v[3],
          v[9]
        ]), c.bendingsY.set(r, [
          v[4],
          v[10]
        ]), c.bendingsZ.set(r, [
          v[5],
          v[11]
        ]);
      } else if (X.length === 4) {
        const h = wo(p, f, s, r);
        a.membraneXX.set(r, h.Nx), a.membraneYY.set(r, h.Ny), a.membraneXY.set(r, h.Nxy), a.bendingXX.set(r, h.Mx), a.bendingYY.set(r, h.My), a.bendingXY.set(r, h.Mxy), h.Mj && i.set(r, h.Mj), h.Nj && n.set(r, h.Nj), a.tranverseShearX.set(r, h.Qx), a.tranverseShearY.set(r, h.Qy), a.vonMises.set(r, h.vonMises);
      } else if (X.length === 3) {
        const h = It(p, ((_c = s == null ? void 0 : s.localAngles) == null ? void 0 : _c.get(r)) ?? 0);
        W(h, f);
        const g = xo(s, r), y = No(p), v = vo(f), b = So(p), D = W(1 / (2 * b), W(W(g, y), v)).toArray(), m = ((_d = s.thicknesses) == null ? void 0 : _d.get(r)) ?? 1, l = D[0][0] * m, N = D[1][0] * m, J = D[2][0] * m, T = D[0][1] * (m ** 3 / 12), Y = D[1][1] * (m ** 3 / 12), z = D[2][1] * (m ** 3 / 12);
        a.membraneXX.set(r, l), a.membraneYY.set(r, N), a.membraneXY.set(r, J), a.bendingXX.set(r, T), a.bendingYY.set(r, Y), a.bendingXY.set(r, z);
      }
    });
    const { nodeToCentroidElementIndiciesMap: M } = jo(t, o);
    {
      const X = (f) => {
        var _a;
        return (((_a = s == null ? void 0 : s.plateFormulations) == null ? void 0 : _a.get(f)) ?? 0) === 1;
      }, r = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
      if (o.forEach((f, h) => {
        if (f.length !== 4) return;
        const g = f.map((y) => t[y]);
        r.set(h, [
          0,
          1,
          2
        ].map((y) => g.reduce((v, b) => v + b[y], 0) / 4)), p.set(h, f);
      }), [
        ...p.keys()
      ].some(X)) {
        const f = /* @__PURE__ */ new Map();
        for (const [h, g] of p) for (const y of g) {
          const v = f.get(y) ?? [];
          v.push(h), f.set(y, v);
        }
        for (const [h, g] of p) {
          if (!X(h)) continue;
          const y = /* @__PURE__ */ new Map();
          for (const N of g) for (const J of f.get(N) ?? []) J !== h && y.set(J, (y.get(J) ?? 0) + 1);
          const v = [
            ...y
          ].filter(([, N]) => N >= 2).map(([N]) => N);
          if (v.length < 2) continue;
          const b = r.get(h), j = (N) => {
            let J = 0, T = 0, Y = 0, z = 0, P = 0;
            const ot = N.get(h) ?? 0;
            for (const S of v) {
              const u = r.get(S), k = u[0] - b[0], q = u[1] - b[1], w = (N.get(S) ?? 0) - ot;
              J += k * k, T += k * q, Y += q * q, z += k * w, P += q * w;
            }
            const U = J * Y - T * T;
            return Math.abs(U) < 1e-12 ? [
              0,
              0
            ] : [
              (z * Y - P * T) / U,
              (J * P - T * z) / U
            ];
          }, D = j(a.bendingXX), m = j(a.bendingYY), l = j(a.bendingXY);
          a.tranverseShearX.set(h, D[0] + l[1]), a.tranverseShearY.set(h, m[1] + l[0]);
        }
      }
    }
    return o.forEach((X, r) => {
      if (X.length !== 3 && X.length !== 4) return;
      const p = X.length, f = new Array(p).fill(0), h = new Array(p).fill(0), g = new Array(p).fill(0), y = new Array(p).fill(0), v = new Array(p).fill(0), b = new Array(p).fill(0), j = new Array(p).fill(0), D = new Array(p).fill(0), m = new Array(p).fill(0);
      X.forEach((Y, z) => {
        const P = (M.get(Y) || []).filter((u) => o[u].length === 3 || o[u].length === 4), ot = (u) => Pt(P.map((k) => u.get(k) ?? 0)), U = (u, k) => Pt(P.map((q) => {
          const w = n.get(q), d = w ? o[q].indexOf(Y) : -1;
          return w && d >= 0 ? w[d][u] : k.get(q) ?? 0;
        }));
        f[z] = U(0, a.membraneXX), h[z] = U(1, a.membraneYY), g[z] = U(2, a.membraneXY);
        const S = (u, k) => Pt(P.map((q) => {
          const w = i.get(q), d = w ? o[q].indexOf(Y) : -1;
          return w && d >= 0 ? w[d][u] : k.get(q) ?? 0;
        }));
        y[z] = S(0, a.bendingXX), v[z] = S(1, a.bendingYY), b[z] = S(2, a.bendingXY), j[z] = ot(a.tranverseShearX), D[z] = ot(a.tranverseShearY), m[z] = ot(a.vonMises);
      }), c.membraneXX.set(r, f), c.membraneYY.set(r, h), c.membraneXY.set(r, g), c.bendingXX.set(r, y), c.bendingYY.set(r, v), c.bendingXY.set(r, b);
      const l = n.get(r), N = (Y, z) => l ? l.reduce((P, ot) => P + ot[Y], 0) / l.length : z.get(r) ?? 0;
      (c.membraneXXcentro ?? (c.membraneXXcentro = /* @__PURE__ */ new Map())).set(r, N(0, a.membraneXX)), (c.membraneYYcentro ?? (c.membraneYYcentro = /* @__PURE__ */ new Map())).set(r, N(1, a.membraneYY)), (c.membraneXYcentro ?? (c.membraneXYcentro = /* @__PURE__ */ new Map())).set(r, N(2, a.membraneXY)), l && ((c.membraneXXjoint ?? (c.membraneXXjoint = /* @__PURE__ */ new Map())).set(r, l.map((Y) => Y[0])), (c.membraneYYjoint ?? (c.membraneYYjoint = /* @__PURE__ */ new Map())).set(r, l.map((Y) => Y[1])), (c.membraneXYjoint ?? (c.membraneXYjoint = /* @__PURE__ */ new Map())).set(r, l.map((Y) => Y[2])));
      const J = i.get(r), T = (Y, z) => J ? J.reduce((P, ot) => P + ot[Y], 0) / J.length : z.get(r) ?? 0;
      (c.bendingXXcentro ?? (c.bendingXXcentro = /* @__PURE__ */ new Map())).set(r, T(0, a.bendingXX)), (c.bendingYYcentro ?? (c.bendingYYcentro = /* @__PURE__ */ new Map())).set(r, T(1, a.bendingYY)), (c.bendingXYcentro ?? (c.bendingXYcentro = /* @__PURE__ */ new Map())).set(r, T(2, a.bendingXY)), J && ((c.bendingXXjoint ?? (c.bendingXXjoint = /* @__PURE__ */ new Map())).set(r, J.map((Y) => Y[0])), (c.bendingYYjoint ?? (c.bendingYYjoint = /* @__PURE__ */ new Map())).set(r, J.map((Y) => Y[1])), (c.bendingXYjoint ?? (c.bendingXYjoint = /* @__PURE__ */ new Map())).set(r, J.map((Y) => Y[2]))), c.tranverseShearX.set(r, j), c.tranverseShearY.set(r, D), c.vonMises.set(r, m);
    }), c;
  };
  function wo(t, o, s, e) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const c = ((_a = s.elasticities) == null ? void 0 : _a.get(e)) ?? 0, i = ((_b = s.poissonsRatios) == null ? void 0 : _b.get(e)) ?? 0, n = ((_c = s.thicknesses) == null ? void 0 : _c.get(e)) ?? 1, a = t[0], M = t[1], X = t[2], r = t[3], p = [
      M[0] - a[0],
      M[1] - a[1],
      M[2] - a[2]
    ], f = [
      X[0] - r[0],
      X[1] - r[1],
      X[2] - r[2]
    ];
    let h = [
      p[0] + f[0],
      p[1] + f[1],
      p[2] + f[2]
    ], g = Math.sqrt(h[0] * h[0] + h[1] * h[1] + h[2] * h[2]);
    g < 1e-14 && (g = 1);
    let y = [
      h[0] / g,
      h[1] / g,
      h[2] / g
    ];
    const v = [
      X[0] - a[0],
      X[1] - a[1],
      X[2] - a[2]
    ], b = [
      r[0] - M[0],
      r[1] - M[1],
      r[2] - M[2]
    ];
    let j = [
      v[1] * b[2] - v[2] * b[1],
      v[2] * b[0] - v[0] * b[2],
      v[0] * b[1] - v[1] * b[0]
    ], D = Math.sqrt(j[0] * j[0] + j[1] * j[1] + j[2] * j[2]);
    D < 1e-14 && (D = 1);
    let m = [
      j[0] / D,
      j[1] / D,
      j[2] / D
    ], l = [
      m[1] * y[2] - m[2] * y[1],
      m[2] * y[0] - m[0] * y[2],
      m[0] * y[1] - m[1] * y[0]
    ], N = Math.sqrt(l[0] * l[0] + l[1] * l[1] + l[2] * l[2]);
    N < 1e-14 && (N = 1), l = [
      l[0] / N,
      l[1] / N,
      l[2] / N
    ];
    {
      if (Math.abs(m[2]) > 1 - 1e-6) y = [
        1,
        0,
        0
      ];
      else {
        const F = [
          -m[1],
          m[0],
          0
        ], _ = Math.hypot(F[0], F[1], F[2]) || 1;
        y = [
          F[0] / _,
          F[1] / _,
          F[2] / _
        ];
      }
      l = [
        m[1] * y[2] - m[2] * y[1],
        m[2] * y[0] - m[0] * y[2],
        m[0] * y[1] - m[1] * y[0]
      ];
      const E = Math.hypot(l[0], l[1], l[2]) || 1;
      l = [
        l[0] / E,
        l[1] / E,
        l[2] / E
      ], y = [
        l[1] * m[2] - l[2] * m[1],
        l[2] * m[0] - l[0] * m[2],
        l[0] * m[1] - l[1] * m[0]
      ];
    }
    const J = 0.25 * (a[0] + M[0] + X[0] + r[0]), T = 0.25 * (a[1] + M[1] + X[1] + r[1]), Y = 0.25 * (a[2] + M[2] + X[2] + r[2]), z = [], P = [];
    for (let A = 0; A < 4; A++) {
      const E = t[A][0] - J, F = t[A][1] - T, _ = t[A][2] - Y;
      z.push(E * y[0] + F * y[1] + _ * y[2]), P.push(E * l[0] + F * l[1] + _ * l[2]);
    }
    const ot = [
      y,
      l,
      m
    ], U = new Array(24).fill(0);
    for (let A = 0; A < 4; A++) {
      const E = A * 6, F = A * 6;
      for (let _ = 0; _ < 3; _++) U[F + _] = ot[_][0] * o[E] + ot[_][1] * o[E + 1] + ot[_][2] * o[E + 2];
      for (let _ = 0; _ < 3; _++) U[F + 3 + _] = ot[_][0] * o[E + 3] + ot[_][1] * o[E + 4] + ot[_][2] * o[E + 5];
    }
    const S = c / (1 - i * i), u = [
      [
        S * n,
        S * i * n,
        0
      ],
      [
        S * i * n,
        S * n,
        0
      ],
      [
        0,
        0,
        S * (1 - i) / 2 * n
      ]
    ], k = n * n * n / 12, q = [
      [
        S * k,
        S * i * k,
        0
      ],
      [
        S * i * k,
        S * k,
        0
      ],
      [
        0,
        0,
        S * (1 - i) / 2 * k
      ]
    ], w = [
      -0.25,
      0.25,
      0.25,
      -0.25
    ], d = [
      -0.25,
      -0.25,
      0.25,
      0.25
    ];
    let R = 0, K = 0, Z = 0, H = 0;
    for (let A = 0; A < 4; A++) R += w[A] * z[A], K += w[A] * P[A], Z += d[A] * z[A], H += d[A] * P[A];
    const Q = R * H - K * Z;
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
    const B = H / Q, G = -K / Q, I = -Z / Q, st = R / Q, C = [], at = [];
    for (let A = 0; A < 4; A++) C.push(B * w[A] + G * d[A]), at.push(I * w[A] + st * d[A]);
    let it = 0, ct = 0, ft = 0;
    for (let A = 0; A < 4; A++) {
      const E = U[A * 6 + 0], F = U[A * 6 + 1];
      it += C[A] * E, ct += at[A] * F, ft += at[A] * E + C[A] * F;
    }
    const pt = u[0][0] * it + u[0][1] * ct, $ = u[1][0] * it + u[1][1] * ct, gt = u[2][2] * ft;
    let bt = 0, ut = 0, vt = 0;
    for (let A = 0; A < 4; A++) {
      const E = U[A * 6 + 3], F = U[A * 6 + 4];
      bt += C[A] * F, ut += -at[A] * E, vt += at[A] * F - C[A] * E;
    }
    const Mt = -1, St = Mt * (q[0][0] * bt + q[0][1] * ut), Xt = Mt * (q[1][0] * bt + q[1][1] * ut), dt = Mt * (q[2][2] * vt);
    let ht = null;
    if (Math.abs(Q) > 1e-20) {
      const A = [];
      for (let lt = 0; lt < 4; lt++) A.push(U[lt * 6 + 0], U[lt * 6 + 1], U[lt * 6 + 5]);
      const E = ((_d = s == null ? void 0 : s.drillingTypes) == null ? void 0 : _d.get(e)) ?? 12, F = ((_e = s == null ? void 0 : s.drillingPenaltyScales) == null ? void 0 : _e.get(e)) ?? 0.4, _ = (_f = s == null ? void 0 : s.membraneModifiers) == null ? void 0 : _f.get(e), qt = (_g = s == null ? void 0 : s.shellModifiers) == null ? void 0 : _g.get(e), Yt = Array.isArray(qt) && qt.length >= 3 ? [
        qt[0],
        qt[1],
        qt[2]
      ] : typeof _ == "number" && _ !== 1 ? [
        _,
        _,
        _
      ] : null;
      try {
        ht = co(z, P, A, c, i, n, {
          tipo: E,
          gammaFac: F,
          mod: Yt
        }), ht && ht.some((lt) => lt.some((At) => !Number.isFinite(At))) && (ht = null);
      } catch {
        ht = null;
      }
    }
    let rt = null;
    const Ft = (((_h = s == null ? void 0 : s.plateFormulations) == null ? void 0 : _h.get(e)) ?? 0) !== 1;
    if (Math.abs(Q) > 1e-20) {
      const A = [];
      for (let E = 0; E < 4; E++) A.push(U[E * 6 + 2], U[E * 6 + 3], U[E * 6 + 4]);
      try {
        const E = globalThis.__hekatanDkqJoints ?? "gauss";
        rt = (Ft ? eo(z, P, A, c, i, n) : ao(z, P, A, c, i, n, E)).map((F) => F.map((_) => Mt * _)), rt.some((F) => F.some((_) => !Number.isFinite(_))) && (rt = null);
      } catch {
        rt = null;
      }
    }
    const x = 5 / 6, et = c / (2 * (1 + i)), mt = x * et * n;
    let yt = 0, L = 0;
    const O = [
      0.25,
      0.25,
      0.25,
      0.25
    ];
    for (let A = 0; A < 4; A++) {
      const E = U[A * 6 + 2], F = U[A * 6 + 3], _ = U[A * 6 + 4];
      yt += C[A] * E + O[A] * F, L += at[A] * E + O[A] * _;
    }
    const Ot = mt * yt, Qt = mt * L, kt = pt / n + 6 * St / (n * n), Tt = $ / n + 6 * Xt / (n * n), Lt = gt / n + 6 * dt / (n * n), jt = Math.sqrt(kt * kt - kt * Tt + Tt * Tt + 3 * Lt * Lt), wt = pt / n - 6 * St / (n * n), xt = $ / n - 6 * Xt / (n * n), Nt = gt / n - 6 * dt / (n * n), _t = Math.sqrt(wt * wt - wt * xt + xt * xt + 3 * Nt * Nt), Dt = Math.max(jt, _t);
    return {
      Nx: pt,
      Ny: $,
      Nxy: gt,
      Mx: St,
      My: Xt,
      Mxy: dt,
      Qx: Ot,
      Qy: Qt,
      vonMises: Dt,
      Mj: rt,
      Nj: ht
    };
  }
  function xo(t, o) {
    var _a, _b, _c, _d, _e;
    const s = ((_a = t.elasticities) == null ? void 0 : _a.get(o)) ?? 0, e = ((_b = t.elasticitiesOrthogonal) == null ? void 0 : _b.get(o)) ?? 0, c = ((_c = t.poissonsRatios) == null ? void 0 : _c.get(o)) ?? 0, i = ((_d = t.shearModuli) == null ? void 0 : _d.get(o)) ?? 0;
    return (_e = t.thicknesses) == null ? void 0 : _e.get(o), e > 0 ? ro(s, e, i, c) : so(s, c);
  }
  function No(t) {
    const [o, s] = t[0], [e, c] = t[1], [i, n] = t[2], a = c - n, M = n - s, X = s - c, r = i - e, p = o - i, f = e - o;
    return V([
      [
        a,
        M,
        X,
        0,
        0,
        0
      ],
      [
        0,
        0,
        0,
        r,
        p,
        f
      ],
      [
        r,
        p,
        f,
        a,
        M,
        X
      ]
    ]);
  }
  function vo(t) {
    const [o, s, e] = [
      t[0],
      t[6],
      t[12]
    ], [c, i, n] = [
      t[1],
      t[7],
      t[13]
    ], [a, M, X] = [
      t[4],
      t[10],
      t[16]
    ], [r, p, f] = [
      t[3],
      t[9],
      t[15]
    ];
    return V([
      [
        o,
        -a
      ],
      [
        s,
        -M
      ],
      [
        e,
        -X
      ],
      [
        c,
        r
      ],
      [
        i,
        p
      ],
      [
        n,
        f
      ]
    ]);
  }
  function So(t) {
    const [o, s] = t[0], [e, c] = t[1], [i, n] = t[2], a = e - o, M = i - o, X = n - s, r = s - c;
    return 0.5 * (a * X - M * -r);
  }
  function jo(t, o) {
    const s = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
    return o.forEach((c, i) => {
      const n = c.map((M) => t[M]), a = _o(n);
      c.forEach((M) => {
        var _a, _b;
        s.has(M) || s.set(M, []), (_a = s.get(M)) == null ? void 0 : _a.push(a), e.has(M) || e.set(M, []), (_b = e.get(M)) == null ? void 0 : _b.push(i);
      });
    }), {
      nodeToCentroidNodesMap: s,
      nodeToCentroidElementIndiciesMap: e
    };
  }
  function _o(t) {
    const o = t.reduce((c, i) => c + i[0], 0) / t.length, s = t.reduce((c, i) => c + i[1], 0) / t.length, e = t.reduce((c, i) => c + i[2], 0) / t.length;
    return [
      o,
      s,
      e
    ];
  }
});
export {
  __tla,
  ko as a,
  It as b,
  yo as g
};
