import { q as co, r as eo, __tla as __tla_0 } from "./aiAgent-BCa8AtfT.js";
import { s as oo, n as Ct, b as Et, k as Vt, i as Pt, z as ot, c as Wt, m as W, t as Kt, a as Bt, e as U, f as Gt } from "./pureFunctionsAny.generated-DeJSBP3k.js";
let ko, It, yo;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function ao(t, n, s, e, c, i) {
    const o = e * i * i * i / (12 * (1 - c * c)), a = [
      [
        o,
        o * c,
        0
      ],
      [
        o * c,
        o,
        0
      ],
      [
        0,
        0,
        o * (1 - c) / 2
      ]
    ], b = (f, g) => {
      const h = [
        -0.25 * (1 - g),
        0.25 * (1 - g),
        0.25 * (1 + g),
        -0.25 * (1 + g)
      ], M = [
        -0.25 * (1 - f),
        -0.25 * (1 + f),
        0.25 * (1 + f),
        0.25 * (1 - f)
      ];
      let d = 0, y = 0, N = 0, _ = 0;
      for (let J = 0; J < 4; J++) d += h[J] * t[J], y += h[J] * n[J], N += M[J] * t[J], _ += M[J] * n[J];
      const p = d * _ - y * N, l = _ / p, X = -y / p, D = -N / p, T = d / p;
      let Y = 0, L = 0, E = 0;
      for (let J = 0; J < 4; J++) {
        const j = l * h[J] + X * M[J], m = D * h[J] + T * M[J], k = s[3 * J + 1], F = s[3 * J + 2];
        Y += j * F, L += -m * k, E += m * F - j * k;
      }
      const H = [
        Y,
        L,
        E
      ];
      return [
        0,
        1,
        2
      ].map((J) => a[J][0] * H[0] + a[J][1] * H[1] + a[J][2] * H[2]);
    }, A = [
      [
        -1,
        -1
      ],
      [
        1,
        -1
      ],
      [
        1,
        1
      ],
      [
        -1,
        1
      ]
    ], r = 1 / Math.sqrt(3), u = A.map(([f, g]) => b(f * r, g * r));
    return A.map(([f, g]) => {
      const h = f * Math.sqrt(3), M = g * Math.sqrt(3), d = A.map(([y, N]) => (1 + y * h) * (1 + N * M) / 4);
      return [
        0,
        1,
        2
      ].map((y) => d.reduce((N, _, p) => N + _ * u[p][y], 0));
    });
  }
  const Rt = 1 / Math.sqrt(3);
  function $t(t, n) {
    const s = [
      0.25 * (1 - t) * (1 - n),
      0.25 * (1 + t) * (1 - n),
      0.25 * (1 + t) * (1 + n),
      0.25 * (1 - t) * (1 + n)
    ], e = [
      -0.25 * (1 - n),
      0.25 * (1 - n),
      0.25 * (1 + n),
      -0.25 * (1 + n)
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
  function Ht(t, n, s, e) {
    let c = 0, i = 0, o = 0, a = 0;
    for (let f = 0; f < 4; f++) c += t[f] * s[f], i += t[f] * e[f], o += n[f] * s[f], a += n[f] * e[f];
    const b = c * a - i * o, A = 1 / b, r = [], u = [];
    for (let f = 0; f < 4; f++) r.push(A * (a * t[f] - i * n[f])), u.push(A * (-o * t[f] + c * n[f]));
    return {
      dNdx: r,
      dNdy: u,
      detJ: b,
      J: [
        c,
        i,
        o,
        a
      ]
    };
  }
  function io(t, n, s, e, c, i) {
    const o = s * c / (1 - e * e), a = [
      [
        o,
        o * e,
        0
      ],
      [
        o * e,
        o,
        0
      ],
      [
        0,
        0,
        o * (1 - e) / 2
      ]
    ], b = [
      1,
      2,
      3,
      0
    ], A = [
      3,
      0,
      1,
      2
    ], r = [], u = [];
    for (let j = 0; j < 4; j++) r.push((n[b[j]] - n[j]) / 8), u.push(-(t[b[j]] - t[j]) / 8);
    const f = [
      -Math.sqrt(3 / 5),
      0,
      Math.sqrt(3 / 5)
    ], g = [
      5 / 9,
      8 / 9,
      5 / 9
    ], h = Jt(14, 14);
    let M = [], d = [], y = [], N = [], _ = [], p = 0, l = 0, X = 0;
    for (let j = 0; j < 3; j++) for (let m = 0; m < 3; m++) {
      const k = f[j], F = f[m], v = g[j] * g[m], { N: x, dNdxi: Z, dNdeta: R } = $t(k, F);
      let G = 0, I = 0, q = 0, B = 0;
      for (let S = 0; S < 4; S++) G += Z[S] * t[S], I += Z[S] * n[S], q += R[S] * t[S], B += R[S] * n[S];
      const $ = G * B - I * q, tt = B / $, st = -I / $, C = -q / $, at = G / $, it = [], ct = [];
      for (let S = 0; S < 4; S++) it.push(tt * Z[S] + st * R[S]), ct.push(C * Z[S] + at * R[S]);
      const lt = [
        -k * (1 - F),
        0.5 * (1 - F * F),
        -k * (1 + F),
        -0.5 * (1 - F * F)
      ], pt = [
        -0.5 * (1 - k * k),
        -F * (1 + k),
        0.5 * (1 - k * k),
        -F * (1 - k)
      ], V = [], gt = [];
      for (let S = 0; S < 4; S++) V.push(tt * lt[S] + st * pt[S]), gt.push(C * lt[S] + at * pt[S]);
      const bt = -2 * k * (1 - F * F), mt = -2 * F * (1 - k * k), vt = tt * bt + st * mt, Mt = C * bt + at * mt, St = [], Xt = [], dt = [], ht = [];
      for (let S = 0; S < 4; S++) {
        const et = A[S];
        St.push(V[et] * r[et] - V[S] * r[S]), Xt.push(gt[et] * r[et] - gt[S] * r[S]), dt.push(V[et] * u[et] - V[S] * u[S]), ht.push(gt[et] * u[et] - gt[S] * u[S]);
      }
      const rt = Jt(3, 14);
      for (let S = 0; S < 4; S++) rt[0][3 * S] = it[S], rt[1][3 * S + 1] = ct[S], rt[2][3 * S] = ct[S], rt[2][3 * S + 1] = it[S], rt[0][3 * S + 2] = St[S], rt[1][3 * S + 2] = ht[S], rt[2][3 * S + 2] = Xt[S] + dt[S];
      rt[0][12] = vt, rt[2][12] = Mt, rt[1][13] = Mt, rt[2][13] = vt;
      const Ot = v * Math.abs($);
      for (let S = 0; S < 14; S++) for (let et = 0; et < 14; et++) {
        let ut = 0;
        for (let yt = 0; yt < 3; yt++) for (let O = 0; O < 3; O++) ut += rt[yt][S] * a[yt][O] * rt[O][et];
        h[S][et] += Ot * ut;
      }
      j === 1 && m === 1 && (M = x.slice(), d = it.slice(), y = ct.slice(), N = Xt.slice(), _ = dt.slice(), p = vt, l = Mt, X = Math.abs($));
    }
    const D = s / (2 * (1 + e)), T = new Array(14).fill(0);
    for (let j = 0; j < 4; j++) T[3 * j] = -0.5 * y[j], T[3 * j + 1] = 0.5 * d[j], T[3 * j + 2] = 0.5 * (_[j] - N[j]) - M[j];
    T[12] = -0.5 * l, T[13] = 0.5 * p;
    const Y = i * D * c * 4 * X;
    for (let j = 0; j < 14; j++) for (let m = 0; m < 14; m++) h[j][m] += Y * T[j] * T[m];
    const L = [
      [
        h[12][12],
        h[12][13]
      ],
      [
        h[13][12],
        h[13][13]
      ]
    ], E = L[0][0] * L[1][1] - L[0][1] * L[1][0], H = Jt(12, 12);
    for (let j = 0; j < 12; j++) for (let m = 0; m < 12; m++) H[j][m] = h[j][m];
    if (Math.abs(E) < 1e-30) return H;
    const J = [
      [
        L[1][1] / E,
        -L[0][1] / E
      ],
      [
        -L[1][0] / E,
        L[0][0] / E
      ]
    ];
    for (let j = 0; j < 12; j++) for (let m = 0; m < 12; m++) {
      let k = 0;
      for (let F = 0; F < 2; F++) for (let v = 0; v < 2; v++) k += h[j][12 + F] * J[F][v] * h[12 + v][m];
      H[j][m] -= k;
    }
    return H;
  }
  function fo(t, n, s, e, c) {
    const i = Jt(12, 12), o = s * c * c * c / (12 * (1 - e * e)), b = 5 / 6 * s / (2 * (1 + e)) * c, A = [
      [
        -Rt,
        -Rt
      ],
      [
        Rt,
        -Rt
      ],
      [
        Rt,
        Rt
      ],
      [
        -Rt,
        Rt
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
    ], u = [];
    for (const f of r) {
      const { N: g, dNdxi: h, dNdeta: M } = $t(f.xi, f.eta), { dNdx: d, dNdy: y, J: N } = Ht(h, M, t, n), _ = Jt(2, 12);
      for (let Y = 0; Y < 4; Y++) _[0][Y * 3] = d[Y], _[0][Y * 3 + 1] = -g[Y], _[1][Y * 3] = y[Y], _[1][Y * 3 + 2] = -g[Y];
      const [p, l, X, D] = N, T = Jt(2, 12);
      for (let Y = 0; Y < 12; Y++) T[0][Y] = p * _[0][Y] + l * _[1][Y], T[1][Y] = X * _[0][Y] + D * _[1][Y];
      u.push(T);
    }
    for (const [f, g] of A) {
      const { dNdxi: h, dNdeta: M } = $t(f, g), { dNdx: d, dNdy: y, detJ: N, J: _ } = Ht(h, M, t, n), p = Jt(3, 12);
      for (let m = 0; m < 4; m++) p[0][m * 3 + 1] = d[m], p[1][m * 3 + 2] = y[m], p[2][m * 3 + 1] = y[m], p[2][m * 3 + 2] = d[m];
      for (let m = 0; m < 12; m++) for (let k = 0; k < 12; k++) {
        let F = 0;
        F += o * (p[0][m] * p[0][k] + e * p[0][m] * p[1][k] + e * p[1][m] * p[0][k] + p[1][m] * p[1][k]), F += o * (1 - e) / 2 * p[2][m] * p[2][k], i[m][k] += F * Math.abs(N);
      }
      const l = Jt(2, 12), X = 0.5 * (1 - g), D = 0.5 * (1 + g), T = 0.5 * (1 - f), Y = 0.5 * (1 + f), [L, E, H, J] = _, j = 1 / N;
      for (let m = 0; m < 12; m++) {
        const k = X * u[0][0][m] + D * u[1][0][m], F = T * u[2][1][m] + Y * u[3][1][m];
        l[0][m] = j * (J * k - E * F), l[1][m] = j * (-H * k + L * F);
      }
      for (let m = 0; m < 12; m++) for (let k = 0; k < 12; k++) i[m][k] += b * (l[0][m] * l[0][k] + l[1][m] * l[1][k]) * Math.abs(N);
    }
    return i;
  }
  function lo(t, n, s) {
    var _a, _b, _c;
    const e = ((_a = n == null ? void 0 : n.elasticities) == null ? void 0 : _a.get(s)) ?? 0, c = ((_b = n == null ? void 0 : n.poissonsRatios) == null ? void 0 : _b.get(s)) ?? 0.2, i = ((_c = n == null ? void 0 : n.thicknesses) == null ? void 0 : _c.get(s)) ?? 0;
    if (e === 0 || i === 0) return Jt(24, 24);
    const { localCoords: o } = no(t), a = o.map((y) => y[0]), b = o.map((y) => y[1]), A = fo(a, b, e, c, i), u = io(a, b, e, c, i, 0.4), f = Jt(24, 24), g = [
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
    ], h = [
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
    for (let y = 0; y < 12; y++) for (let N = 0; N < 12; N++) {
      let _ = 0;
      const p = y / 3 | 0, l = y % 3, X = N / 3 | 0, D = N % 3;
      for (let T = 0; T < 3; T++) {
        const Y = h[T][l];
        if (Y !== 0) for (let L = 0; L < 3; L++) {
          const E = h[L][D];
          E !== 0 && (_ += Y * A[p * 3 + T][X * 3 + L] * E);
        }
      }
      M[y][N] = _;
    }
    for (let y = 0; y < 12; y++) for (let N = 0; N < 12; N++) f[g[y]][g[N]] += M[y][N];
    const d = [
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
    for (let y = 0; y < 12; y++) for (let N = 0; N < 12; N++) f[d[y]][d[N]] += u[y][N];
    return f;
  }
  function go(t) {
    const { localX: n, localY: s, localZ: e } = no(t), c = [
      [
        n[0],
        n[1],
        n[2]
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
    for (let o = 0; o < 4; o++) for (let a = 0; a < 2; a++) {
      const b = o * 6 + a * 3;
      for (let A = 0; A < 3; A++) for (let r = 0; r < 3; r++) i[b + A][b + r] = c[A][r];
    }
    return i;
  }
  function no(t) {
    const n = [
      t[2][0] - t[0][0],
      t[2][1] - t[0][1],
      t[2][2] - t[0][2]
    ], s = [
      t[3][0] - t[1][0],
      t[3][1] - t[1][1],
      t[3][2] - t[1][2]
    ], e = Ut(n, s), c = Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2), i = e.map((h) => h / c), o = [
      t[1][0] - t[0][0],
      t[1][1] - t[0][1],
      t[1][2] - t[0][2]
    ], a = Math.sqrt(o[0] ** 2 + o[1] ** 2 + o[2] ** 2), b = o.map((h) => h / a), A = Ut(i, b), r = t.map((h) => h[0]).reduce((h, M) => h + M) / 4, u = t.map((h) => h[1]).reduce((h, M) => h + M) / 4, f = t.map((h) => h[2]).reduce((h, M) => h + M) / 4, g = t.map((h) => {
      const M = h[0] - r, d = h[1] - u, y = h[2] - f;
      return [
        M * b[0] + d * b[1] + y * b[2],
        M * A[0] + d * A[1] + y * A[2]
      ];
    });
    return {
      localX: b,
      localY: A,
      localZ: i,
      localCoords: g
    };
  }
  function Ut(t, n) {
    return [
      t[1] * n[2] - t[2] * n[1],
      t[2] * n[0] - t[0] * n[2],
      t[0] * n[1] - t[1] * n[0]
    ];
  }
  function Jt(t, n) {
    return Array.from({
      length: t
    }, () => Array(n).fill(0));
  }
  It = function(t, n = 0) {
    if (t.length === 2) return ho(t, n);
    if (t.length === 3) return Mo(t);
    if (t.length === 4) return go(t);
  };
  function ho(t, n = 0) {
    const s = (r) => {
      if (Math.abs(n) < 1e-12) return r;
      const u = n * Math.PI / 180, f = Math.cos(u), g = Math.sin(u);
      return [
        r[0],
        [
          f * r[1][0] + g * r[2][0],
          f * r[1][1] + g * r[2][1],
          f * r[1][2] + g * r[2][2]
        ],
        [
          -g * r[1][0] + f * r[2][0],
          -g * r[1][1] + f * r[2][1],
          -g * r[1][2] + f * r[2][2]
        ]
      ];
    }, e = oo(t[1], t[0]), c = Ct(e), i = Et(e, [
      1,
      0,
      0
    ]) / c, o = Et(e, [
      0,
      1,
      0
    ]) / c, a = Et(e, [
      0,
      0,
      1
    ]) / c, b = Math.sqrt(i ** 2 + o ** 2);
    if (b < 1e-9) {
      const r = a > 0 ? 1 : -1, u = [
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
      return Vt(Pt(4), s(u)).toArray();
    }
    const A = [
      [
        i,
        o,
        a
      ],
      [
        -i * a / b,
        -o * a / b,
        b
      ],
      [
        o / b,
        -i / b,
        0
      ]
    ];
    return Vt(Pt(4), s(A)).toArray();
  }
  function Mo(t) {
    const i = [
      t[0],
      t[1],
      t[2]
    ], o = ot(3, 3).toArray();
    for (let l = 0; l < 3; l++) for (let X = 0; X < 3; X++) o[l][X] = i[X][l];
    const a = [
      -1,
      1,
      0
    ], b = [
      -1,
      0,
      1
    ], A = ot(3, 2).toArray();
    for (let l = 0; l < 3; l++) for (let X = 0; X < 3; X++) A[l][0] += o[l][X] * a[X], A[l][1] += o[l][X] * b[X];
    const r = A.map((l) => l[0]), u = A.map((l) => l[1]);
    let f = Wt(r, u), g = Ct(f);
    if (g === 0) return console.warn("Degenerate triangle: nodes are collinear or coincident."), ot(18, 18).toArray();
    f = f.map((l) => l / g);
    const h = [
      ...f
    ], M = Pt(3).toArray(), d = f[0];
    let y;
    if (Math.abs(d) > 1 - 1e-10) {
      const l = f[2];
      y = M.map((X, D) => X[2] - l * f[D]);
    } else y = M.map((l, X) => l[0] - d * f[X]);
    if (g = Ct(y), g === 0) return console.warn("Degenerate local X-axis detected."), ot(18, 18).toArray();
    y = y.map((l) => l / g);
    let N = Wt(h, y);
    if (g = Ct(N), g === 0) return console.warn("Degenerate local Y-axis detected."), ot(18, 18).toArray();
    N = N.map((l) => l / g);
    const _ = [
      y,
      N,
      h
    ], p = ot(18, 18).toArray();
    for (let l = 0; l < 3; l++) {
      const X = l * 6, D = X + 3;
      for (let T = 0; T < 3; T++) for (let Y = 0; Y < 3; Y++) p[X + T][X + Y] = _[T][Y], p[D + T][D + Y] = _[T][Y];
    }
    return p;
  }
  yo = function(t, n, s) {
    var _a, _b, _c;
    if (t.length === 2) {
      let e = Ao(t, n, s);
      const c = (_a = n == null ? void 0 : n.partialFixitySprings) == null ? void 0 : _a.get(s);
      c && (e = bo(e, c));
      const i = (_b = n == null ? void 0 : n.momentReleases) == null ? void 0 : _b.get(s);
      i && (e = mo(e, i));
      const o = (_c = n == null ? void 0 : n.endOffsets) == null ? void 0 : _c.get(s);
      if (o && o[2] > 0 && (o[0] > 0 || o[1] > 0)) {
        const a = uo(o[2] * o[0], o[2] * o[1]);
        e = Yo(a, e, a);
      }
      return e;
    }
    if (t.length === 3) return Xo(t, n, s);
    if (t.length === 4) return lo(t, n, s);
  };
  function bo(t, n) {
    const s = t.map((c) => [
      ...c
    ]), e = Math.min(n.length, 12);
    for (let c = 0; c < e; c++) n[c] > 1e-12 && (s[c][c] += n[c]);
    return s;
  }
  function mo(t, n) {
    const s = [];
    if (n.length >= 12) for (let h = 0; h < 12; h++) n[h] && s.push(h);
    else {
      const h = [
        3,
        4,
        5,
        9,
        10,
        11
      ];
      for (let M = 0; M < Math.min(n.length, 6); M++) n[M] && s.push(h[M]);
    }
    if (s.length === 0) return t;
    const e = t.length, c = [];
    for (let h = 0; h < e; h++) s.includes(h) || c.push(h);
    const i = c.length, o = s.length, a = Array.from({
      length: o
    }, (h, M) => Array.from({
      length: o
    }, (d, y) => t[s[M]][s[y]])), b = Array.from({
      length: i
    }, (h, M) => Array.from({
      length: o
    }, (d, y) => t[c[M]][s[y]])), A = Array.from({
      length: o
    }, (h, M) => Array.from({
      length: i
    }, (d, y) => t[s[M]][c[y]])), r = po(a);
    if (!r) return t;
    const u = to(b, r), f = to(u, A), g = Array.from({
      length: e
    }, () => Array(e).fill(0));
    for (let h = 0; h < i; h++) for (let M = 0; M < i; M++) g[c[h]][c[M]] = t[c[h]][c[M]] - f[h][M];
    return g;
  }
  function to(t, n) {
    const s = t.length, e = n[0].length, c = n.length, i = Array.from({
      length: s
    }, () => Array(e).fill(0));
    for (let o = 0; o < s; o++) for (let a = 0; a < e; a++) for (let b = 0; b < c; b++) i[o][a] += t[o][b] * n[b][a];
    return i;
  }
  function po(t) {
    const n = t.length, s = t.map((e, c) => {
      const i = [
        ...e
      ];
      for (let o = 0; o < n; o++) i.push(c === o ? 1 : 0);
      return i;
    });
    for (let e = 0; e < n; e++) {
      let c = e;
      for (let o = e + 1; o < n; o++) Math.abs(s[o][e]) > Math.abs(s[c][e]) && (c = o);
      if ([s[e], s[c]] = [
        s[c],
        s[e]
      ], Math.abs(s[e][e]) < 1e-15) return null;
      const i = s[e][e];
      for (let o = 0; o < 2 * n; o++) s[e][o] /= i;
      for (let o = 0; o < n; o++) {
        if (o === e) continue;
        const a = s[o][e];
        for (let b = 0; b < 2 * n; b++) s[o][b] -= a * s[e][b];
      }
    }
    return s.map((e) => e.slice(n));
  }
  function uo(t, n) {
    const s = Array.from({
      length: 12
    }, (e, c) => Array.from({
      length: 12
    }, (i, o) => c === o ? 1 : 0));
    return Math.abs(t) > 1e-12 && (s[1][5] = t, s[2][4] = -t), Math.abs(n) > 1e-12 && (s[7][11] = -n, s[8][10] = n), s;
  }
  function Yo(t, n, s) {
    const e = Array.from({
      length: 12
    }, () => Array(12).fill(0));
    for (let i = 0; i < 12; i++) for (let o = 0; o < 12; o++) {
      let a = 0;
      for (let b = 0; b < 12; b++) a += t[b][i] * n[b][o];
      e[i][o] = a;
    }
    const c = Array.from({
      length: 12
    }, () => Array(12).fill(0));
    for (let i = 0; i < 12; i++) for (let o = 0; o < 12; o++) {
      let a = 0;
      for (let b = 0; b < 12; b++) a += e[i][b] * s[b][o];
      c[i][o] = a;
    }
    return c;
  }
  function Ao(t, n, s) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const e = ((_a = n == null ? void 0 : n.momentsOfInertiaZ) == null ? void 0 : _a.get(s)) ?? 0, c = ((_b = n == null ? void 0 : n.momentsOfInertiaY) == null ? void 0 : _b.get(s)) ?? 0, i = ((_c = n == null ? void 0 : n.elasticities) == null ? void 0 : _c.get(s)) ?? 0, o = ((_d = n == null ? void 0 : n.areas) == null ? void 0 : _d.get(s)) ?? 0, a = ((_e = n == null ? void 0 : n.shearModuli) == null ? void 0 : _e.get(s)) ?? 0, b = ((_f = n == null ? void 0 : n.torsionalConstants) == null ? void 0 : _f.get(s)) ?? 0, A = Ct(oo(t[0], t[1]));
    if (A < 1e-12) return console.warn(`[hekatan-fem] barra ${s} de longitud CERO: matriz nula (no aporta rigidez). Mismo criterio que getLocalStiffnessMatrix.cpp.`), Array.from({
      length: 12
    }, () => new Array(12).fill(0));
    const r = (_g = n == null ? void 0 : n.endOffsets) == null ? void 0 : _g.get(s), u = r && r[2] > 0 ? A - r[2] * (r[0] + r[1]) : A;
    if (u <= 1e-9) throw new Error(`end offsets se comen la barra ${s}: L = ${A.toFixed(4)} m, rz = ${r[2]}, offsets ${r[0]} y ${r[1]} -> Lf = ${u.toFixed(4)} m`);
    let f = ((_h = n == null ? void 0 : n.shearAreasY) == null ? void 0 : _h.get(s)) ?? 0, g = ((_i = n == null ? void 0 : n.shearAreasZ) == null ? void 0 : _i.get(s)) ?? 0;
    f === 0 && g === 0 && o > 0 && a > 0 && (f = g = 5 / 6 * o);
    const h = g > 0 && a > 0 ? 12 * i * e / (a * g * u ** 2) : 0, M = f > 0 && a > 0 ? 12 * i * c / (a * f * u ** 2) : 0, d = i * o / A, y = a * b / A, N = 12 * i * e / u ** 3 / (1 + h), _ = 6 * i * e / u ** 2 / (1 + h), p = 4 * i * e / u * (1 + h / 4) / (1 + h), l = 2 * i * e / u * (1 - h / 2) / (1 + h), X = 12 * i * c / u ** 3 / (1 + M), D = 6 * i * c / u ** 2 / (1 + M), T = 4 * i * c / u * (1 + M / 4) / (1 + M), Y = 2 * i * c / u * (1 - M / 2) / (1 + M);
    return [
      [
        d,
        0,
        0,
        0,
        0,
        0,
        -d,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        N,
        0,
        0,
        0,
        _,
        0,
        -N,
        0,
        0,
        0,
        _
      ],
      [
        0,
        0,
        X,
        0,
        -D,
        0,
        0,
        0,
        -X,
        0,
        -D,
        0
      ],
      [
        0,
        0,
        0,
        y,
        0,
        0,
        0,
        0,
        0,
        -y,
        0,
        0
      ],
      [
        0,
        0,
        -D,
        0,
        T,
        0,
        0,
        0,
        D,
        0,
        Y,
        0
      ],
      [
        0,
        _,
        0,
        0,
        0,
        p,
        0,
        -_,
        0,
        0,
        0,
        l
      ],
      [
        -d,
        0,
        0,
        0,
        0,
        0,
        d,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        -N,
        0,
        0,
        0,
        -_,
        0,
        N,
        0,
        0,
        0,
        -_
      ],
      [
        0,
        0,
        -X,
        0,
        D,
        0,
        0,
        0,
        X,
        0,
        D,
        0
      ],
      [
        0,
        0,
        0,
        -y,
        0,
        0,
        0,
        0,
        0,
        y,
        0,
        0
      ],
      [
        0,
        0,
        -D,
        0,
        Y,
        0,
        0,
        0,
        D,
        0,
        T,
        0
      ],
      [
        0,
        _,
        0,
        0,
        0,
        l,
        0,
        -_,
        0,
        0,
        0,
        p
      ]
    ];
  }
  function Xo(t, n, s) {
    var _a, _b, _c, _d, _e;
    const e = ((_a = n.elasticities) == null ? void 0 : _a.get(s)) ?? 0, c = ((_b = n.elasticitiesOrthogonal) == null ? void 0 : _b.get(s)) ?? 0, i = ((_c = n.poissonsRatios) == null ? void 0 : _c.get(s)) ?? 0, o = ((_d = n.shearModuli) == null ? void 0 : _d.get(s)) ?? 0, a = ((_e = n.thicknesses) == null ? void 0 : _e.get(s)) ?? 0, b = c > 0, A = b ? H(e, c, o, i, a) : L(e, i, a), r = b ? J(o, a) : E(e, i, a), u = b ? ro(e, c, o, i) : so(e, i), f = t.map(([v, x]) => [
      v,
      x
    ]), g = f[1][0] - f[0][0], h = f[2][0] - f[0][0], M = f[0][1] - f[1][1], d = f[2][1] - f[0][1], y = 0.5 * (g * d - h * -M), N = j(f), _ = k(f), p = F(f, u, a), l = W(W(Kt(N), r), N), X = W(W(Kt(_), A), _), D = ot(18, 18).toArray(), T = W(Bt(l, X), y), Y = [
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
    for (let v = 0; v < 3; v++) for (let x = 0; x < 3; x++) for (let Z = 0; Z < 3; Z++) {
      const R = Y[v][x], G = Y[Z][x];
      D[R][G] = p[v * 3 + x][Z * 3 + x];
    }
    for (let v = 0; v < 18; v++) for (let x = 0; x < 18; x++) D[v][x] = (D[v][x] ?? 0) + T.get([
      v,
      x
    ]);
    return D;
    function L(v, x, Z) {
      const R = v / (1 - x * x), G = U([
        [
          R,
          R * x,
          0
        ],
        [
          R * x,
          R,
          0
        ],
        [
          0,
          0,
          R * (1 - x) / 2
        ]
      ]);
      return W(Z ** 3 / 12, G);
    }
    function E(v, x, Z) {
      const R = 0.8333333333333334, G = v / (2 * (1 + x)), I = R * G * Z;
      return U([
        [
          I,
          0
        ],
        [
          0,
          I
        ]
      ]);
    }
    function H(v, x, Z, R, G) {
      const I = x * R / v, q = 1 - R * I, B = v / q, $ = x / q, tt = R * x / q, C = U([
        [
          B,
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
      return W(G ** 3 / 12, C);
    }
    function J(v, x) {
      const R = 0.8333333333333334 * v * x;
      return U([
        [
          R,
          0
        ],
        [
          0,
          R
        ]
      ]);
    }
    function j(v) {
      const x = ot(2, 18).toArray(), [Z, R] = v[0], [G, I] = v[1], [q, B] = v[2], $ = 0.5 * ((G - Z) * (B - R) - (q - Z) * -(R - I)), tt = (Z + G + q) / 3, st = (R + I + B) / 3, C = [
        tt,
        Z,
        G
      ], at = [
        st,
        R,
        I
      ], it = [
        tt,
        G,
        q
      ], ct = [
        st,
        I,
        B
      ], lt = [
        tt,
        q,
        Z
      ], pt = [
        st,
        B,
        R
      ], V = 1 / 3, [gt, bt, mt, vt] = m(C, at), [Mt, St, Xt, dt] = m(it, ct), [ht, rt, Ot, S] = m(lt, pt), et = ot(2, 18).toArray(), ut = ot(2, 18).toArray(), yt = ot(2, 18).toArray();
      for (let O = 0; O < 2; O++) for (let z = 0; z < 6; z++) et[O][z] = V * gt[O][z] + bt[O][z], et[O][z + 6] = V * gt[O][z] + mt[O][z], et[O][z + 12] = V * gt[O][z], ut[O][z] = V * Mt[O][z], ut[O][z + 6] = V * Mt[O][z] + St[O][z], ut[O][z + 12] = V * Mt[O][z] + Xt[O][z], yt[O][z] = V * ht[O][z] + Ot[O][z], yt[O][z + 6] = V * ht[O][z], yt[O][z + 12] = V * ht[O][z] + rt[O][z];
      for (let O = 0; O < 2; O++) for (let z = 0; z < 18; z++) et[O][z] *= vt, ut[O][z] *= dt, yt[O][z] *= S, x[O][z] = (et[O][z] + ut[O][z] + yt[O][z]) / $;
      return x;
    }
    function m(v, x) {
      const Z = ot(2, 6).toArray(), R = ot(2, 6).toArray(), G = ot(2, 6).toArray(), I = v[1] - v[0], q = v[0] - v[2], B = x[2] - x[0], $ = x[0] - x[1], tt = v[2] - v[1], st = x[1] - x[2], C = 0.5 * (I * B - q * $), at = 0.5 * $ * q, it = 0.5 * B * I, ct = 0.5 * I * q, lt = 0.5 * $ * B;
      return Z[0][2] = 0.5 * tt / C, Z[0][3] = -0.5, Z[1][2] = 0.5 * st / C, Z[1][4] = 0.5, R[0][2] = 0.5 * q / C, R[0][3] = 0.5 * at / C, R[0][4] = 0.5 * ct / C, R[1][2] = 0.5 * B / C, R[1][3] = 0.5 * lt / C, R[1][4] = 0.5 * it / C, G[0][2] = 0.5 * I / C, G[0][3] = -0.5 * it / C, G[0][4] = -0.5 * ct / C, G[1][2] = 0.5 * $ / C, G[1][3] = -0.5 * lt / C, G[1][4] = -0.5 * at / C, [
        Z,
        R,
        G,
        C
      ];
    }
    function k(v) {
      const x = ot(3, 18).toArray(), [Z, R] = v[0], [G, I] = v[1], [q, B] = v[2], $ = G - Z, tt = q - Z, st = q - G, C = I - B, at = B - R, it = R - I, ct = 0.5 * ($ * at - tt * -it), lt = C / (2 * ct), pt = st / (2 * ct), V = at / (2 * ct), gt = -tt / (2 * ct), bt = it / (2 * ct), mt = $ / (2 * ct);
      return x[0][4] = lt, x[0][10] = V, x[0][16] = bt, x[1][3] = -pt, x[1][9] = -gt, x[1][15] = -mt, x[2][3] = -lt, x[2][4] = pt, x[2][9] = -V, x[2][10] = gt, x[2][15] = -bt, x[2][16] = mt, x;
    }
    function F(v, x, Z) {
      let R = ot(9, 9).toArray(), G = ot(9, 9).toArray(), I = ot(9, 9).toArray(), q = ot(9, 3).toArray(), B = ot(3, 9).toArray(), $ = ot(3, 3).toArray(), tt = ot(3, 3).toArray(), st = ot(3, 3).toArray(), C = ot(3, 3).toArray(), at = ot(3, 3).toArray(), it = ot(3, 3).toArray(), ct = ot(3, 3).toArray(), lt = ot(3, 3).toArray();
      const pt = 1 / 8, V = pt / 6, gt = pt ** 2 / 4, bt = 1, mt = 2, vt = 1, Mt = 0, St = 1, Xt = -1, dt = -1, ht = -1, rt = -2, Ot = v[0][0], S = v[0][1], et = v[1][0], ut = v[1][1], yt = v[2][0], O = v[2][1], z = Ot - et, Lt = et - yt, Qt = yt - Ot, kt = S - ut, Tt = ut - O, qt = O - S, jt = -z, wt = -Lt, xt = -Qt, Nt = -kt, _t = -Tt, Dt = -qt, w = 0.5 * (jt * qt - Qt * -kt), P = 2 * w, K = 4 * w, Q = 0.5 * Z, zt = w * Z, Yt = jt ** 2 + Nt ** 2, ft = wt ** 2 + _t ** 2, At = xt ** 2 + Dt ** 2;
      q[0][0] = Q * Tt, q[0][2] = Q * wt, q[1][1] = Q * wt, q[1][2] = Q * Tt, q[2][0] = Q * Tt * (Dt - Nt) * V, q[2][1] = Q * wt * (Qt - z) * V, q[2][2] = Q * (Qt * Dt - z * Nt) * 2 * V, q[3][0] = Q * qt, q[3][2] = Q * xt, q[4][1] = Q * xt, q[4][2] = Q * qt, q[5][0] = Q * qt * (Nt - _t) * V, q[5][1] = Q * xt * (z - Lt) * V, q[5][2] = Q * (z * Nt - Lt * _t) * 2 * V, q[6][0] = Q * kt, q[6][2] = Q * jt, q[7][1] = Q * jt, q[7][2] = Q * kt, q[8][0] = Q * kt * (_t - Dt) * V, q[8][1] = Q * jt * (Lt - Qt) * V, q[8][2] = Q * (Lt * _t - Qt * Dt) * 2 * V, I = W(W(U(q), x), Kt(U(q))).toArray(), I = W(U(I), 1 / zt).toArray(), B[0][0] = wt / K, B[0][1] = _t / K, B[0][2] = 1, B[0][3] = xt / K, B[0][4] = Dt / K, B[0][6] = jt / K, B[0][7] = Nt / K, B[1][0] = wt / K, B[1][1] = _t / K, B[1][3] = xt / K, B[1][4] = Dt / K, B[1][5] = 1, B[1][6] = jt / K, B[1][7] = Nt / K, B[2][0] = wt / K, B[2][1] = _t / K, B[2][3] = xt / K, B[2][4] = Dt / K, B[2][6] = jt / K, B[2][7] = Nt / K, B[2][8] = 1;
      const Ft = 1 / (w * K);
      $[0][0] = Ft * Tt * Dt * Yt, $[0][1] = Ft * qt * Nt * ft, $[0][2] = Ft * kt * _t * At, $[1][0] = Ft * Lt * xt * Yt, $[1][1] = Ft * Qt * jt * ft, $[1][2] = Ft * z * wt * At, $[2][0] = Ft * (Tt * Qt + wt * Dt) * Yt, $[2][1] = Ft * (qt * z + xt * Nt) * ft, $[2][2] = Ft * (kt * Lt + jt * _t) * At;
      const nt = P / 3;
      tt[0][0] = nt * bt / Yt, tt[0][1] = nt * mt / Yt, tt[0][2] = nt * vt / Yt, tt[1][0] = nt * Mt / ft, tt[1][1] = nt * St / ft, tt[1][2] = nt * Xt / ft, tt[2][0] = nt * dt / At, tt[2][1] = nt * ht / At, tt[2][2] = nt * rt / At, st[0][0] = nt * rt / Yt, st[0][1] = nt * dt / Yt, st[0][2] = nt * ht / Yt, st[1][0] = nt * vt / ft, st[1][1] = nt * bt / ft, st[1][2] = nt * mt / ft, st[2][0] = nt * Xt / At, st[2][1] = nt * Mt / At, st[2][2] = nt * St / At, C[0][0] = nt * St / Yt, C[0][1] = nt * Xt / Yt, C[0][2] = nt * Mt / Yt, C[1][0] = nt * ht / ft, C[1][1] = nt * rt / ft, C[1][2] = nt * dt / ft, C[2][0] = nt * mt / At, C[2][1] = nt * vt / At, C[2][2] = nt * bt / At, at = W(Bt(U(tt), U(st)), 0.5).toArray(), it = W(Bt(U(st), U(C)), 0.5).toArray(), ct = W(Bt(U(C), U(tt)), 0.5).toArray();
      const Zt = W(W(Kt(U($)), x), U($));
      return lt = Bt(Bt(W(W(Kt(U(at)), Zt), U(at)), W(W(Kt(U(it)), Zt), U(it))), W(W(Kt(U(ct)), Zt), U(ct))).toArray(), lt = W(U(lt), 3 / 4 * gt * zt).toArray(), G = W(W(Kt(U(B)), U(lt)), U(B)).toArray(), R = Bt(U(I), U(G)).toArray(), R;
    }
  }
  function so(t, n) {
    const s = t / (1 - n * n);
    return U([
      [
        s,
        s * n,
        0
      ],
      [
        s * n,
        s,
        0
      ],
      [
        0,
        0,
        s * (1 - n) / 2
      ]
    ]);
  }
  function ro(t, n, s, e) {
    const c = n * e / t, i = 1 - e * c, o = t / i, a = n / i, b = e * n / i;
    return U([
      [
        o,
        b,
        0
      ],
      [
        b,
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
  ko = function(t, n, s, e) {
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
    }, i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), a = {
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
    n.forEach((A, r) => {
      var _a, _b, _c, _d, _e;
      const u = A.map((g) => t[g]), f = A.reduce((g, h) => {
        var _a2;
        const M = (_a2 = e.deformations) == null ? void 0 : _a2.get(h);
        return g.concat(M ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ]);
      }, []);
      if (A.length === 2) {
        const g = It(u, ((_a = s == null ? void 0 : s.localAngles) == null ? void 0 : _a.get(r)) ?? 0), h = W(g, f), M = yo(u, s, r);
        let d = W(M, h);
        const y = (_b = s == null ? void 0 : s.frameLoads) == null ? void 0 : _b.get(r);
        if (y && (y[0] || y[1] || y[2])) {
          const _ = u[0], p = u[1], l = [
            p[0] - _[0],
            p[1] - _[1],
            p[2] - _[2]
          ], X = Math.hypot(l[0], l[1], l[2]);
          if (X > 1e-9) {
            const D = [
              l[0] / X,
              l[1] / X,
              l[2] / X
            ], T = X * X / 12, Y = [
              D[1] * y[2] - D[2] * y[1],
              D[2] * y[0] - D[0] * y[2],
              D[0] * y[1] - D[1] * y[0]
            ], L = [
              -y[0] * X / 2,
              -y[1] * X / 2,
              -y[2] * X / 2,
              -T * Y[0],
              -T * Y[1],
              -T * Y[2],
              -y[0] * X / 2,
              -y[1] * X / 2,
              -y[2] * X / 2,
              +T * Y[0],
              +T * Y[1],
              +T * Y[2]
            ], E = W(g, L);
            d = d.map((H, J) => H + E[J]);
          }
        }
        const N = (_c = s == null ? void 0 : s.frameFixedEnd) == null ? void 0 : _c.get(r);
        if (N) {
          const _ = W(g, N);
          d = d.map((p, l) => p + _[l]);
        }
        c.normals.set(r, [
          d[0],
          d[6]
        ]), c.shearsY.set(r, [
          d[1],
          d[7]
        ]), c.shearsZ.set(r, [
          d[2],
          d[8]
        ]), c.torsions.set(r, [
          d[3],
          d[9]
        ]), c.bendingsY.set(r, [
          d[4],
          d[10]
        ]), c.bendingsZ.set(r, [
          d[5],
          d[11]
        ]);
      } else if (A.length === 4) {
        const g = wo(u, f, s, r);
        a.membraneXX.set(r, g.Nx), a.membraneYY.set(r, g.Ny), a.membraneXY.set(r, g.Nxy), a.bendingXX.set(r, g.Mx), a.bendingYY.set(r, g.My), a.bendingXY.set(r, g.Mxy), g.Mj && i.set(r, g.Mj), g.Nj && o.set(r, g.Nj), a.tranverseShearX.set(r, g.Qx), a.tranverseShearY.set(r, g.Qy), a.vonMises.set(r, g.vonMises);
      } else if (A.length === 3) {
        const g = It(u, ((_d = s == null ? void 0 : s.localAngles) == null ? void 0 : _d.get(r)) ?? 0);
        W(g, f);
        const h = xo(s, r), M = No(u), d = vo(f), y = So(u), _ = W(1 / (2 * y), W(W(h, M), d)).toArray(), p = ((_e = s.thicknesses) == null ? void 0 : _e.get(r)) ?? 1, l = _[0][0] * p, X = _[1][0] * p, D = _[2][0] * p, T = _[0][1] * (p ** 3 / 12), Y = _[1][1] * (p ** 3 / 12), L = _[2][1] * (p ** 3 / 12);
        a.membraneXX.set(r, l), a.membraneYY.set(r, X), a.membraneXY.set(r, D), a.bendingXX.set(r, T), a.bendingYY.set(r, Y), a.bendingXY.set(r, L);
      }
    });
    const { nodeToCentroidElementIndiciesMap: b } = jo(t, n);
    {
      const A = (f) => {
        var _a;
        return (((_a = s == null ? void 0 : s.plateFormulations) == null ? void 0 : _a.get(f)) ?? 0) === 1;
      }, r = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
      if (n.forEach((f, g) => {
        if (f.length !== 4) return;
        const h = f.map((M) => t[M]);
        r.set(g, [
          0,
          1,
          2
        ].map((M) => h.reduce((d, y) => d + y[M], 0) / 4)), u.set(g, f);
      }), [
        ...u.keys()
      ].some(A)) {
        const f = /* @__PURE__ */ new Map();
        for (const [g, h] of u) for (const M of h) {
          const d = f.get(M) ?? [];
          d.push(g), f.set(M, d);
        }
        for (const [g, h] of u) {
          if (!A(g)) continue;
          const M = /* @__PURE__ */ new Map();
          for (const X of h) for (const D of f.get(X) ?? []) D !== g && M.set(D, (M.get(D) ?? 0) + 1);
          const d = [
            ...M
          ].filter(([, X]) => X >= 2).map(([X]) => X);
          if (d.length < 2) continue;
          const y = r.get(g), N = (X) => {
            let D = 0, T = 0, Y = 0, L = 0, E = 0;
            const H = X.get(g) ?? 0;
            for (const j of d) {
              const m = r.get(j), k = m[0] - y[0], F = m[1] - y[1], v = (X.get(j) ?? 0) - H;
              D += k * k, T += k * F, Y += F * F, L += k * v, E += F * v;
            }
            const J = D * Y - T * T;
            return Math.abs(J) < 1e-12 ? [
              0,
              0
            ] : [
              (L * Y - E * T) / J,
              (D * E - T * L) / J
            ];
          }, _ = N(a.bendingXX), p = N(a.bendingYY), l = N(a.bendingXY);
          a.tranverseShearX.set(g, _[0] + l[1]), a.tranverseShearY.set(g, p[1] + l[0]);
        }
      }
    }
    return n.forEach((A, r) => {
      if (A.length !== 3 && A.length !== 4) return;
      const u = A.length, f = new Array(u).fill(0), g = new Array(u).fill(0), h = new Array(u).fill(0), M = new Array(u).fill(0), d = new Array(u).fill(0), y = new Array(u).fill(0), N = new Array(u).fill(0), _ = new Array(u).fill(0), p = new Array(u).fill(0);
      A.forEach((Y, L) => {
        const E = (b.get(Y) || []).filter((m) => n[m].length === 3 || n[m].length === 4), H = (m) => Gt(E.map((k) => m.get(k) ?? 0)), J = (m, k) => Gt(E.map((F) => {
          const v = o.get(F), x = v ? n[F].indexOf(Y) : -1;
          return v && x >= 0 ? v[x][m] : k.get(F) ?? 0;
        }));
        f[L] = J(0, a.membraneXX), g[L] = J(1, a.membraneYY), h[L] = J(2, a.membraneXY);
        const j = (m, k) => Gt(E.map((F) => {
          const v = i.get(F), x = v ? n[F].indexOf(Y) : -1;
          return v && x >= 0 ? v[x][m] : k.get(F) ?? 0;
        }));
        M[L] = j(0, a.bendingXX), d[L] = j(1, a.bendingYY), y[L] = j(2, a.bendingXY), N[L] = H(a.tranverseShearX), _[L] = H(a.tranverseShearY), p[L] = H(a.vonMises);
      }), c.membraneXX.set(r, f), c.membraneYY.set(r, g), c.membraneXY.set(r, h), c.bendingXX.set(r, M), c.bendingYY.set(r, d), c.bendingXY.set(r, y);
      const l = o.get(r), X = (Y, L) => l ? l.reduce((E, H) => E + H[Y], 0) / l.length : L.get(r) ?? 0;
      (c.membraneXXcentro ?? (c.membraneXXcentro = /* @__PURE__ */ new Map())).set(r, X(0, a.membraneXX)), (c.membraneYYcentro ?? (c.membraneYYcentro = /* @__PURE__ */ new Map())).set(r, X(1, a.membraneYY)), (c.membraneXYcentro ?? (c.membraneXYcentro = /* @__PURE__ */ new Map())).set(r, X(2, a.membraneXY)), l && ((c.membraneXXjoint ?? (c.membraneXXjoint = /* @__PURE__ */ new Map())).set(r, l.map((Y) => Y[0])), (c.membraneYYjoint ?? (c.membraneYYjoint = /* @__PURE__ */ new Map())).set(r, l.map((Y) => Y[1])), (c.membraneXYjoint ?? (c.membraneXYjoint = /* @__PURE__ */ new Map())).set(r, l.map((Y) => Y[2])));
      const D = i.get(r), T = (Y, L) => D ? D.reduce((E, H) => E + H[Y], 0) / D.length : L.get(r) ?? 0;
      (c.bendingXXcentro ?? (c.bendingXXcentro = /* @__PURE__ */ new Map())).set(r, T(0, a.bendingXX)), (c.bendingYYcentro ?? (c.bendingYYcentro = /* @__PURE__ */ new Map())).set(r, T(1, a.bendingYY)), (c.bendingXYcentro ?? (c.bendingXYcentro = /* @__PURE__ */ new Map())).set(r, T(2, a.bendingXY)), D && ((c.bendingXXjoint ?? (c.bendingXXjoint = /* @__PURE__ */ new Map())).set(r, D.map((Y) => Y[0])), (c.bendingYYjoint ?? (c.bendingYYjoint = /* @__PURE__ */ new Map())).set(r, D.map((Y) => Y[1])), (c.bendingXYjoint ?? (c.bendingXYjoint = /* @__PURE__ */ new Map())).set(r, D.map((Y) => Y[2]))), c.tranverseShearX.set(r, N), c.tranverseShearY.set(r, _), c.vonMises.set(r, p);
    }), c;
  };
  function wo(t, n, s, e) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const c = ((_a = s.elasticities) == null ? void 0 : _a.get(e)) ?? 0, i = ((_b = s.poissonsRatios) == null ? void 0 : _b.get(e)) ?? 0, o = ((_c = s.thicknesses) == null ? void 0 : _c.get(e)) ?? 1, a = t[0], b = t[1], A = t[2], r = t[3], u = [
      b[0] - a[0],
      b[1] - a[1],
      b[2] - a[2]
    ], f = [
      A[0] - r[0],
      A[1] - r[1],
      A[2] - r[2]
    ];
    let g = [
      u[0] + f[0],
      u[1] + f[1],
      u[2] + f[2]
    ], h = Math.sqrt(g[0] * g[0] + g[1] * g[1] + g[2] * g[2]);
    h < 1e-14 && (h = 1);
    let M = [
      g[0] / h,
      g[1] / h,
      g[2] / h
    ];
    const d = [
      A[0] - a[0],
      A[1] - a[1],
      A[2] - a[2]
    ], y = [
      r[0] - b[0],
      r[1] - b[1],
      r[2] - b[2]
    ];
    let N = [
      d[1] * y[2] - d[2] * y[1],
      d[2] * y[0] - d[0] * y[2],
      d[0] * y[1] - d[1] * y[0]
    ], _ = Math.sqrt(N[0] * N[0] + N[1] * N[1] + N[2] * N[2]);
    _ < 1e-14 && (_ = 1);
    let p = [
      N[0] / _,
      N[1] / _,
      N[2] / _
    ], l = [
      p[1] * M[2] - p[2] * M[1],
      p[2] * M[0] - p[0] * M[2],
      p[0] * M[1] - p[1] * M[0]
    ], X = Math.sqrt(l[0] * l[0] + l[1] * l[1] + l[2] * l[2]);
    X < 1e-14 && (X = 1), l = [
      l[0] / X,
      l[1] / X,
      l[2] / X
    ];
    {
      if (Math.abs(p[2]) > 1 - 1e-6) M = [
        1,
        0,
        0
      ];
      else {
        const K = [
          -p[1],
          p[0],
          0
        ], Q = Math.hypot(K[0], K[1], K[2]) || 1;
        M = [
          K[0] / Q,
          K[1] / Q,
          K[2] / Q
        ];
      }
      l = [
        p[1] * M[2] - p[2] * M[1],
        p[2] * M[0] - p[0] * M[2],
        p[0] * M[1] - p[1] * M[0]
      ];
      const P = Math.hypot(l[0], l[1], l[2]) || 1;
      l = [
        l[0] / P,
        l[1] / P,
        l[2] / P
      ], M = [
        l[1] * p[2] - l[2] * p[1],
        l[2] * p[0] - l[0] * p[2],
        l[0] * p[1] - l[1] * p[0]
      ];
    }
    const D = 0.25 * (a[0] + b[0] + A[0] + r[0]), T = 0.25 * (a[1] + b[1] + A[1] + r[1]), Y = 0.25 * (a[2] + b[2] + A[2] + r[2]), L = [], E = [];
    for (let w = 0; w < 4; w++) {
      const P = t[w][0] - D, K = t[w][1] - T, Q = t[w][2] - Y;
      L.push(P * M[0] + K * M[1] + Q * M[2]), E.push(P * l[0] + K * l[1] + Q * l[2]);
    }
    const H = [
      M,
      l,
      p
    ], J = new Array(24).fill(0);
    for (let w = 0; w < 4; w++) {
      const P = w * 6, K = w * 6;
      for (let Q = 0; Q < 3; Q++) J[K + Q] = H[Q][0] * n[P] + H[Q][1] * n[P + 1] + H[Q][2] * n[P + 2];
      for (let Q = 0; Q < 3; Q++) J[K + 3 + Q] = H[Q][0] * n[P + 3] + H[Q][1] * n[P + 4] + H[Q][2] * n[P + 5];
    }
    const j = c / (1 - i * i), m = [
      [
        j * o,
        j * i * o,
        0
      ],
      [
        j * i * o,
        j * o,
        0
      ],
      [
        0,
        0,
        j * (1 - i) / 2 * o
      ]
    ], k = o * o * o / 12, F = [
      [
        j * k,
        j * i * k,
        0
      ],
      [
        j * i * k,
        j * k,
        0
      ],
      [
        0,
        0,
        j * (1 - i) / 2 * k
      ]
    ], v = [
      -0.25,
      0.25,
      0.25,
      -0.25
    ], x = [
      -0.25,
      -0.25,
      0.25,
      0.25
    ];
    let Z = 0, R = 0, G = 0, I = 0;
    for (let w = 0; w < 4; w++) Z += v[w] * L[w], R += v[w] * E[w], G += x[w] * L[w], I += x[w] * E[w];
    const q = Z * I - R * G;
    if (Math.abs(q) < 1e-20) return {
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
    const B = I / q, $ = -R / q, tt = -G / q, st = Z / q, C = [], at = [];
    for (let w = 0; w < 4; w++) C.push(B * v[w] + $ * x[w]), at.push(tt * v[w] + st * x[w]);
    let it = 0, ct = 0, lt = 0;
    for (let w = 0; w < 4; w++) {
      const P = J[w * 6 + 0], K = J[w * 6 + 1];
      it += C[w] * P, ct += at[w] * K, lt += at[w] * P + C[w] * K;
    }
    const pt = m[0][0] * it + m[0][1] * ct, V = m[1][0] * it + m[1][1] * ct, gt = m[2][2] * lt;
    let bt = 0, mt = 0, vt = 0;
    for (let w = 0; w < 4; w++) {
      const P = J[w * 6 + 3], K = J[w * 6 + 4];
      bt += C[w] * K, mt += -at[w] * P, vt += at[w] * K - C[w] * P;
    }
    const Mt = -1, St = Mt * (F[0][0] * bt + F[0][1] * mt), Xt = Mt * (F[1][0] * bt + F[1][1] * mt), dt = Mt * (F[2][2] * vt);
    let ht = null;
    if (Math.abs(q) > 1e-20) {
      const w = [];
      for (let ft = 0; ft < 4; ft++) w.push(J[ft * 6 + 0], J[ft * 6 + 1], J[ft * 6 + 5]);
      const P = ((_d = s == null ? void 0 : s.drillingTypes) == null ? void 0 : _d.get(e)) ?? 13, K = ((_e = s == null ? void 0 : s.drillingPenaltyScales) == null ? void 0 : _e.get(e)) ?? 0.4, Q = (_f = s == null ? void 0 : s.membraneModifiers) == null ? void 0 : _f.get(e), zt = (_g = s == null ? void 0 : s.shellModifiers) == null ? void 0 : _g.get(e), Yt = Array.isArray(zt) && zt.length >= 3 ? [
        zt[0],
        zt[1],
        zt[2]
      ] : typeof Q == "number" && Q !== 1 ? [
        Q,
        Q,
        Q
      ] : null;
      try {
        ht = co(L, E, w, c, i, o, {
          tipo: P,
          gammaFac: K,
          mod: Yt
        }), ht && ht.some((ft) => ft.some((At) => !Number.isFinite(At))) && (ht = null);
      } catch {
        ht = null;
      }
    }
    let rt = null;
    const Ot = (((_h = s == null ? void 0 : s.plateFormulations) == null ? void 0 : _h.get(e)) ?? 0) !== 1;
    if (Math.abs(q) > 1e-20) {
      const w = [];
      for (let P = 0; P < 4; P++) w.push(J[P * 6 + 2], J[P * 6 + 3], J[P * 6 + 4]);
      try {
        const P = globalThis.__hekatanDkqJoints ?? "gauss";
        rt = (Ot ? ao(L, E, w, c, i, o) : eo(L, E, w, c, i, o, P)).map((K) => K.map((Q) => Mt * Q)), rt.some((K) => K.some((Q) => !Number.isFinite(Q))) && (rt = null);
      } catch {
        rt = null;
      }
    }
    const S = 5 / 6, et = c / (2 * (1 + i)), ut = S * et * o;
    let yt = 0, O = 0;
    const z = [
      0.25,
      0.25,
      0.25,
      0.25
    ];
    for (let w = 0; w < 4; w++) {
      const P = J[w * 6 + 2], K = J[w * 6 + 3], Q = J[w * 6 + 4];
      yt += C[w] * P + z[w] * K, O += at[w] * P + z[w] * Q;
    }
    const Lt = ut * yt, Qt = ut * O, kt = pt / o + 6 * St / (o * o), Tt = V / o + 6 * Xt / (o * o), qt = gt / o + 6 * dt / (o * o), jt = Math.sqrt(kt * kt - kt * Tt + Tt * Tt + 3 * qt * qt), wt = pt / o - 6 * St / (o * o), xt = V / o - 6 * Xt / (o * o), Nt = gt / o - 6 * dt / (o * o), _t = Math.sqrt(wt * wt - wt * xt + xt * xt + 3 * Nt * Nt), Dt = Math.max(jt, _t);
    return {
      Nx: pt,
      Ny: V,
      Nxy: gt,
      Mx: St,
      My: Xt,
      Mxy: dt,
      Qx: Lt,
      Qy: Qt,
      vonMises: Dt,
      Mj: rt,
      Nj: ht
    };
  }
  function xo(t, n) {
    var _a, _b, _c, _d, _e;
    const s = ((_a = t.elasticities) == null ? void 0 : _a.get(n)) ?? 0, e = ((_b = t.elasticitiesOrthogonal) == null ? void 0 : _b.get(n)) ?? 0, c = ((_c = t.poissonsRatios) == null ? void 0 : _c.get(n)) ?? 0, i = ((_d = t.shearModuli) == null ? void 0 : _d.get(n)) ?? 0;
    return (_e = t.thicknesses) == null ? void 0 : _e.get(n), e > 0 ? ro(s, e, i, c) : so(s, c);
  }
  function No(t) {
    const [n, s] = t[0], [e, c] = t[1], [i, o] = t[2], a = c - o, b = o - s, A = s - c, r = i - e, u = n - i, f = e - n;
    return U([
      [
        a,
        b,
        A,
        0,
        0,
        0
      ],
      [
        0,
        0,
        0,
        r,
        u,
        f
      ],
      [
        r,
        u,
        f,
        a,
        b,
        A
      ]
    ]);
  }
  function vo(t) {
    const [n, s, e] = [
      t[0],
      t[6],
      t[12]
    ], [c, i, o] = [
      t[1],
      t[7],
      t[13]
    ], [a, b, A] = [
      t[4],
      t[10],
      t[16]
    ], [r, u, f] = [
      t[3],
      t[9],
      t[15]
    ];
    return U([
      [
        n,
        -a
      ],
      [
        s,
        -b
      ],
      [
        e,
        -A
      ],
      [
        c,
        r
      ],
      [
        i,
        u
      ],
      [
        o,
        f
      ]
    ]);
  }
  function So(t) {
    const [n, s] = t[0], [e, c] = t[1], [i, o] = t[2], a = e - n, b = i - n, A = o - s, r = s - c;
    return 0.5 * (a * A - b * -r);
  }
  function jo(t, n) {
    const s = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
    return n.forEach((c, i) => {
      const o = c.map((b) => t[b]), a = _o(o);
      c.forEach((b) => {
        var _a, _b;
        s.has(b) || s.set(b, []), (_a = s.get(b)) == null ? void 0 : _a.push(a), e.has(b) || e.set(b, []), (_b = e.get(b)) == null ? void 0 : _b.push(i);
      });
    }), {
      nodeToCentroidNodesMap: s,
      nodeToCentroidElementIndiciesMap: e
    };
  }
  function _o(t) {
    const n = t.reduce((c, i) => c + i[0], 0) / t.length, s = t.reduce((c, i) => c + i[1], 0) / t.length, e = t.reduce((c, i) => c + i[2], 0) / t.length;
    return [
      n,
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
