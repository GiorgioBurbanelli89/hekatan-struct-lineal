import { q as co, r as eo, __tla as __tla_0 } from "./aiAgent-CDkRN2K5.js";
import { s as oo, n as Ct, b as Et, k as Vt, i as Gt, z as ot, c as Wt, m as U, t as Kt, a as Bt, e as H, f as Pt } from "./pureFunctionsAny.generated-DeJSBP3k.js";
let ko, It, yo;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function ao(t, n, s, e, r, i) {
    const o = e * i * i * i / (12 * (1 - r * r)), a = [
      [
        o,
        o * r,
        0
      ],
      [
        o * r,
        o,
        0
      ],
      [
        0,
        0,
        o * (1 - r) / 2
      ]
    ], b = (l, g) => {
      const h = [
        -0.25 * (1 - g),
        0.25 * (1 - g),
        0.25 * (1 + g),
        -0.25 * (1 + g)
      ], M = [
        -0.25 * (1 - l),
        -0.25 * (1 + l),
        0.25 * (1 + l),
        0.25 * (1 - l)
      ];
      let w = 0, y = 0, x = 0, _ = 0;
      for (let T = 0; T < 4; T++) w += h[T] * t[T], y += h[T] * n[T], x += M[T] * t[T], _ += M[T] * n[T];
      const p = w * _ - y * x, f = _ / p, S = -y / p, D = -x / p, Q = w / p;
      let A = 0, L = 0, E = 0;
      for (let T = 0; T < 4; T++) {
        const j = f * h[T] + S * M[T], u = D * h[T] + Q * M[T], J = s[3 * T + 1], O = s[3 * T + 2];
        A += j * O, L += -u * J, E += u * O - j * J;
      }
      const W = [
        A,
        L,
        E
      ];
      return [
        0,
        1,
        2
      ].map((T) => a[T][0] * W[0] + a[T][1] * W[1] + a[T][2] * W[2]);
    }, Y = [
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
    ], c = 1 / Math.sqrt(3), m = Y.map(([l, g]) => b(l * c, g * c));
    return Y.map(([l, g]) => {
      const h = l * Math.sqrt(3), M = g * Math.sqrt(3), w = Y.map(([y, x]) => (1 + y * h) * (1 + x * M) / 4);
      return [
        0,
        1,
        2
      ].map((y) => w.reduce((x, _, p) => x + _ * m[p][y], 0));
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
    ], r = [
      -0.25 * (1 - t),
      -0.25 * (1 + t),
      0.25 * (1 + t),
      0.25 * (1 - t)
    ];
    return {
      N: s,
      dNdxi: e,
      dNdeta: r
    };
  }
  function Ht(t, n, s, e) {
    let r = 0, i = 0, o = 0, a = 0;
    for (let l = 0; l < 4; l++) r += t[l] * s[l], i += t[l] * e[l], o += n[l] * s[l], a += n[l] * e[l];
    const b = r * a - i * o, Y = 1 / b, c = [], m = [];
    for (let l = 0; l < 4; l++) c.push(Y * (a * t[l] - i * n[l])), m.push(Y * (-o * t[l] + r * n[l]));
    return {
      dNdx: c,
      dNdy: m,
      detJ: b,
      J: [
        r,
        i,
        o,
        a
      ]
    };
  }
  function io(t, n, s, e, r, i) {
    const o = s * r / (1 - e * e), a = [
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
    ], Y = [
      3,
      0,
      1,
      2
    ], c = [], m = [];
    for (let j = 0; j < 4; j++) c.push((n[b[j]] - n[j]) / 8), m.push(-(t[b[j]] - t[j]) / 8);
    const l = [
      -Math.sqrt(3 / 5),
      0,
      Math.sqrt(3 / 5)
    ], g = [
      5 / 9,
      8 / 9,
      5 / 9
    ], h = Jt(14, 14);
    let M = [], w = [], y = [], x = [], _ = [], p = 0, f = 0, S = 0;
    for (let j = 0; j < 3; j++) for (let u = 0; u < 3; u++) {
      const J = l[j], O = l[u], N = g[j] * g[u], { N: d, dNdxi: Z, dNdeta: R } = $t(J, O);
      let P = 0, I = 0, q = 0, B = 0;
      for (let v = 0; v < 4; v++) P += Z[v] * t[v], I += Z[v] * n[v], q += R[v] * t[v], B += R[v] * n[v];
      const $ = P * B - I * q, tt = B / $, st = -I / $, C = -q / $, at = P / $, it = [], ct = [];
      for (let v = 0; v < 4; v++) it.push(tt * Z[v] + st * R[v]), ct.push(C * Z[v] + at * R[v]);
      const lt = [
        -J * (1 - O),
        0.5 * (1 - O * O),
        -J * (1 + O),
        -0.5 * (1 - O * O)
      ], pt = [
        -0.5 * (1 - J * J),
        -O * (1 + J),
        0.5 * (1 - J * J),
        -O * (1 - J)
      ], V = [], gt = [];
      for (let v = 0; v < 4; v++) V.push(tt * lt[v] + st * pt[v]), gt.push(C * lt[v] + at * pt[v]);
      const bt = -2 * J * (1 - O * O), ut = -2 * O * (1 - J * J), vt = tt * bt + st * ut, Mt = C * bt + at * ut, St = [], Xt = [], dt = [], ht = [];
      for (let v = 0; v < 4; v++) {
        const et = Y[v];
        St.push(V[et] * c[et] - V[v] * c[v]), Xt.push(gt[et] * c[et] - gt[v] * c[v]), dt.push(V[et] * m[et] - V[v] * m[v]), ht.push(gt[et] * m[et] - gt[v] * m[v]);
      }
      const rt = Jt(3, 14);
      for (let v = 0; v < 4; v++) rt[0][3 * v] = it[v], rt[1][3 * v + 1] = ct[v], rt[2][3 * v] = ct[v], rt[2][3 * v + 1] = it[v], rt[0][3 * v + 2] = St[v], rt[1][3 * v + 2] = ht[v], rt[2][3 * v + 2] = Xt[v] + dt[v];
      rt[0][12] = vt, rt[2][12] = Mt, rt[1][13] = Mt, rt[2][13] = vt;
      const zt = N * Math.abs($);
      for (let v = 0; v < 14; v++) for (let et = 0; et < 14; et++) {
        let mt = 0;
        for (let yt = 0; yt < 3; yt++) for (let z = 0; z < 3; z++) mt += rt[yt][v] * a[yt][z] * rt[z][et];
        h[v][et] += zt * mt;
      }
      j === 1 && u === 1 && (M = d.slice(), w = it.slice(), y = ct.slice(), x = Xt.slice(), _ = dt.slice(), p = vt, f = Mt, S = Math.abs($));
    }
    const D = s / (2 * (1 + e)), Q = new Array(14).fill(0);
    for (let j = 0; j < 4; j++) Q[3 * j] = -0.5 * y[j], Q[3 * j + 1] = 0.5 * w[j], Q[3 * j + 2] = 0.5 * (_[j] - x[j]) - M[j];
    Q[12] = -0.5 * f, Q[13] = 0.5 * p;
    const A = i * D * r * 4 * S;
    for (let j = 0; j < 14; j++) for (let u = 0; u < 14; u++) h[j][u] += A * Q[j] * Q[u];
    const L = [
      [
        h[12][12],
        h[12][13]
      ],
      [
        h[13][12],
        h[13][13]
      ]
    ], E = L[0][0] * L[1][1] - L[0][1] * L[1][0], W = Jt(12, 12);
    for (let j = 0; j < 12; j++) for (let u = 0; u < 12; u++) W[j][u] = h[j][u];
    if (Math.abs(E) < 1e-30) return W;
    const T = [
      [
        L[1][1] / E,
        -L[0][1] / E
      ],
      [
        -L[1][0] / E,
        L[0][0] / E
      ]
    ];
    for (let j = 0; j < 12; j++) for (let u = 0; u < 12; u++) {
      let J = 0;
      for (let O = 0; O < 2; O++) for (let N = 0; N < 2; N++) J += h[j][12 + O] * T[O][N] * h[12 + N][u];
      W[j][u] -= J;
    }
    return W;
  }
  function fo(t, n, s, e, r) {
    const i = Jt(12, 12), o = s * r * r * r / (12 * (1 - e * e)), b = 5 / 6 * s / (2 * (1 + e)) * r, Y = [
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
    ], c = [
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
    ], m = [];
    for (const l of c) {
      const { N: g, dNdxi: h, dNdeta: M } = $t(l.xi, l.eta), { dNdx: w, dNdy: y, J: x } = Ht(h, M, t, n), _ = Jt(2, 12);
      for (let A = 0; A < 4; A++) _[0][A * 3] = w[A], _[0][A * 3 + 1] = -g[A], _[1][A * 3] = y[A], _[1][A * 3 + 2] = -g[A];
      const [p, f, S, D] = x, Q = Jt(2, 12);
      for (let A = 0; A < 12; A++) Q[0][A] = p * _[0][A] + f * _[1][A], Q[1][A] = S * _[0][A] + D * _[1][A];
      m.push(Q);
    }
    for (const [l, g] of Y) {
      const { dNdxi: h, dNdeta: M } = $t(l, g), { dNdx: w, dNdy: y, detJ: x, J: _ } = Ht(h, M, t, n), p = Jt(3, 12);
      for (let u = 0; u < 4; u++) p[0][u * 3 + 1] = w[u], p[1][u * 3 + 2] = y[u], p[2][u * 3 + 1] = y[u], p[2][u * 3 + 2] = w[u];
      for (let u = 0; u < 12; u++) for (let J = 0; J < 12; J++) {
        let O = 0;
        O += o * (p[0][u] * p[0][J] + e * p[0][u] * p[1][J] + e * p[1][u] * p[0][J] + p[1][u] * p[1][J]), O += o * (1 - e) / 2 * p[2][u] * p[2][J], i[u][J] += O * Math.abs(x);
      }
      const f = Jt(2, 12), S = 0.5 * (1 - g), D = 0.5 * (1 + g), Q = 0.5 * (1 - l), A = 0.5 * (1 + l), [L, E, W, T] = _, j = 1 / x;
      for (let u = 0; u < 12; u++) {
        const J = S * m[0][0][u] + D * m[1][0][u], O = Q * m[2][1][u] + A * m[3][1][u];
        f[0][u] = j * (T * J - E * O), f[1][u] = j * (-W * J + L * O);
      }
      for (let u = 0; u < 12; u++) for (let J = 0; J < 12; J++) i[u][J] += b * (f[0][u] * f[0][J] + f[1][u] * f[1][J]) * Math.abs(x);
    }
    return i;
  }
  function lo(t, n, s) {
    var _a, _b, _c;
    const e = ((_a = n == null ? void 0 : n.elasticities) == null ? void 0 : _a.get(s)) ?? 0, r = ((_b = n == null ? void 0 : n.poissonsRatios) == null ? void 0 : _b.get(s)) ?? 0.2, i = ((_c = n == null ? void 0 : n.thicknesses) == null ? void 0 : _c.get(s)) ?? 0;
    if (e === 0 || i === 0) return Jt(24, 24);
    const { localCoords: o } = no(t), a = o.map((y) => y[0]), b = o.map((y) => y[1]), Y = fo(a, b, e, r, i), m = io(a, b, e, r, i, 0.4), l = Jt(24, 24), g = [
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
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) {
      let _ = 0;
      const p = y / 3 | 0, f = y % 3, S = x / 3 | 0, D = x % 3;
      for (let Q = 0; Q < 3; Q++) {
        const A = h[Q][f];
        if (A !== 0) for (let L = 0; L < 3; L++) {
          const E = h[L][D];
          E !== 0 && (_ += A * Y[p * 3 + Q][S * 3 + L] * E);
        }
      }
      M[y][x] = _;
    }
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) l[g[y]][g[x]] += M[y][x];
    const w = [
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
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) l[w[y]][w[x]] += m[y][x];
    return l;
  }
  function go(t) {
    const { localX: n, localY: s, localZ: e } = no(t), r = [
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
      for (let Y = 0; Y < 3; Y++) for (let c = 0; c < 3; c++) i[b + Y][b + c] = r[Y][c];
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
    ], e = Ut(n, s), r = Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2), i = e.map((h) => h / r), o = [
      t[1][0] - t[0][0],
      t[1][1] - t[0][1],
      t[1][2] - t[0][2]
    ], a = Math.sqrt(o[0] ** 2 + o[1] ** 2 + o[2] ** 2), b = o.map((h) => h / a), Y = Ut(i, b), c = t.map((h) => h[0]).reduce((h, M) => h + M) / 4, m = t.map((h) => h[1]).reduce((h, M) => h + M) / 4, l = t.map((h) => h[2]).reduce((h, M) => h + M) / 4, g = t.map((h) => {
      const M = h[0] - c, w = h[1] - m, y = h[2] - l;
      return [
        M * b[0] + w * b[1] + y * b[2],
        M * Y[0] + w * Y[1] + y * Y[2]
      ];
    });
    return {
      localX: b,
      localY: Y,
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
    const s = (c) => {
      if (Math.abs(n) < 1e-12) return c;
      const m = n * Math.PI / 180, l = Math.cos(m), g = Math.sin(m);
      return [
        c[0],
        [
          l * c[1][0] + g * c[2][0],
          l * c[1][1] + g * c[2][1],
          l * c[1][2] + g * c[2][2]
        ],
        [
          -g * c[1][0] + l * c[2][0],
          -g * c[1][1] + l * c[2][1],
          -g * c[1][2] + l * c[2][2]
        ]
      ];
    }, e = oo(t[1], t[0]), r = Ct(e), i = Et(e, [
      1,
      0,
      0
    ]) / r, o = Et(e, [
      0,
      1,
      0
    ]) / r, a = Et(e, [
      0,
      0,
      1
    ]) / r, b = Math.sqrt(i ** 2 + o ** 2);
    if (b < 1e-9) {
      const c = a > 0 ? 1 : -1, m = [
        [
          0,
          0,
          c
        ],
        [
          1,
          0,
          0
        ],
        [
          0,
          c,
          0
        ]
      ];
      return Vt(Gt(4), s(m)).toArray();
    }
    const Y = [
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
    return Vt(Gt(4), s(Y)).toArray();
  }
  function Mo(t) {
    const i = [
      t[0],
      t[1],
      t[2]
    ], o = ot(3, 3).toArray();
    for (let f = 0; f < 3; f++) for (let S = 0; S < 3; S++) o[f][S] = i[S][f];
    const a = [
      -1,
      1,
      0
    ], b = [
      -1,
      0,
      1
    ], Y = ot(3, 2).toArray();
    for (let f = 0; f < 3; f++) for (let S = 0; S < 3; S++) Y[f][0] += o[f][S] * a[S], Y[f][1] += o[f][S] * b[S];
    const c = Y.map((f) => f[0]), m = Y.map((f) => f[1]);
    let l = Wt(c, m), g = Ct(l);
    if (g === 0) return console.warn("Degenerate triangle: nodes are collinear or coincident."), ot(18, 18).toArray();
    l = l.map((f) => f / g);
    const h = [
      ...l
    ], M = Gt(3).toArray(), w = l[0];
    let y;
    if (Math.abs(w) > 1 - 1e-10) {
      const f = l[2];
      y = M.map((S, D) => S[2] - f * l[D]);
    } else y = M.map((f, S) => f[0] - w * l[S]);
    if (g = Ct(y), g === 0) return console.warn("Degenerate local X-axis detected."), ot(18, 18).toArray();
    y = y.map((f) => f / g);
    let x = Wt(h, y);
    if (g = Ct(x), g === 0) return console.warn("Degenerate local Y-axis detected."), ot(18, 18).toArray();
    x = x.map((f) => f / g);
    const _ = [
      y,
      x,
      h
    ], p = ot(18, 18).toArray();
    for (let f = 0; f < 3; f++) {
      const S = f * 6, D = S + 3;
      for (let Q = 0; Q < 3; Q++) for (let A = 0; A < 3; A++) p[S + Q][S + A] = _[Q][A], p[D + Q][D + A] = _[Q][A];
    }
    return p;
  }
  yo = function(t, n, s) {
    var _a, _b, _c;
    if (t.length === 2) {
      let e = Ao(t, n, s);
      const r = (_a = n == null ? void 0 : n.partialFixitySprings) == null ? void 0 : _a.get(s);
      r && (e = bo(e, r));
      const i = (_b = n == null ? void 0 : n.momentReleases) == null ? void 0 : _b.get(s);
      i && (e = uo(e, i));
      const o = (_c = n == null ? void 0 : n.endOffsets) == null ? void 0 : _c.get(s);
      if (o && o[2] > 0 && (o[0] > 0 || o[1] > 0)) {
        const a = mo(o[2] * o[0], o[2] * o[1]);
        e = Yo(a, e, a);
      }
      return e;
    }
    if (t.length === 3) return Xo(t, n, s);
    if (t.length === 4) return lo(t, n, s);
  };
  function bo(t, n) {
    const s = t.map((r) => [
      ...r
    ]), e = Math.min(n.length, 12);
    for (let r = 0; r < e; r++) n[r] > 1e-12 && (s[r][r] += n[r]);
    return s;
  }
  function uo(t, n) {
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
    const e = t.length, r = [];
    for (let h = 0; h < e; h++) s.includes(h) || r.push(h);
    const i = r.length, o = s.length, a = Array.from({
      length: o
    }, (h, M) => Array.from({
      length: o
    }, (w, y) => t[s[M]][s[y]])), b = Array.from({
      length: i
    }, (h, M) => Array.from({
      length: o
    }, (w, y) => t[r[M]][s[y]])), Y = Array.from({
      length: o
    }, (h, M) => Array.from({
      length: i
    }, (w, y) => t[s[M]][r[y]])), c = po(a);
    if (!c) return t;
    const m = to(b, c), l = to(m, Y), g = Array.from({
      length: e
    }, () => Array(e).fill(0));
    for (let h = 0; h < i; h++) for (let M = 0; M < i; M++) g[r[h]][r[M]] = t[r[h]][r[M]] - l[h][M];
    return g;
  }
  function to(t, n) {
    const s = t.length, e = n[0].length, r = n.length, i = Array.from({
      length: s
    }, () => Array(e).fill(0));
    for (let o = 0; o < s; o++) for (let a = 0; a < e; a++) for (let b = 0; b < r; b++) i[o][a] += t[o][b] * n[b][a];
    return i;
  }
  function po(t) {
    const n = t.length, s = t.map((e, r) => {
      const i = [
        ...e
      ];
      for (let o = 0; o < n; o++) i.push(r === o ? 1 : 0);
      return i;
    });
    for (let e = 0; e < n; e++) {
      let r = e;
      for (let o = e + 1; o < n; o++) Math.abs(s[o][e]) > Math.abs(s[r][e]) && (r = o);
      if ([s[e], s[r]] = [
        s[r],
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
  function mo(t, n) {
    const s = Array.from({
      length: 12
    }, (e, r) => Array.from({
      length: 12
    }, (i, o) => r === o ? 1 : 0));
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
    const r = Array.from({
      length: 12
    }, () => Array(12).fill(0));
    for (let i = 0; i < 12; i++) for (let o = 0; o < 12; o++) {
      let a = 0;
      for (let b = 0; b < 12; b++) a += e[i][b] * s[b][o];
      r[i][o] = a;
    }
    return r;
  }
  function Ao(t, n, s) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const e = ((_a = n == null ? void 0 : n.momentsOfInertiaZ) == null ? void 0 : _a.get(s)) ?? 0, r = ((_b = n == null ? void 0 : n.momentsOfInertiaY) == null ? void 0 : _b.get(s)) ?? 0, i = ((_c = n == null ? void 0 : n.elasticities) == null ? void 0 : _c.get(s)) ?? 0, o = ((_d = n == null ? void 0 : n.areas) == null ? void 0 : _d.get(s)) ?? 0, a = ((_e = n == null ? void 0 : n.shearModuli) == null ? void 0 : _e.get(s)) ?? 0, b = ((_f = n == null ? void 0 : n.torsionalConstants) == null ? void 0 : _f.get(s)) ?? 0, Y = Ct(oo(t[0], t[1]));
    if (Y < 1e-12) return console.warn(`[hekatan-fem] barra ${s} de longitud CERO: matriz nula (no aporta rigidez). Mismo criterio que getLocalStiffnessMatrix.cpp.`), Array.from({
      length: 12
    }, () => new Array(12).fill(0));
    const c = (_g = n == null ? void 0 : n.endOffsets) == null ? void 0 : _g.get(s), m = c && c[2] > 0 ? Y - c[2] * (c[0] + c[1]) : Y;
    if (m <= 1e-9) throw new Error(`end offsets se comen la barra ${s}: L = ${Y.toFixed(4)} m, rz = ${c[2]}, offsets ${c[0]} y ${c[1]} -> Lf = ${m.toFixed(4)} m`);
    let l = ((_h = n == null ? void 0 : n.shearAreasY) == null ? void 0 : _h.get(s)) ?? 0, g = ((_i = n == null ? void 0 : n.shearAreasZ) == null ? void 0 : _i.get(s)) ?? 0;
    l === 0 && g === 0 && o > 0 && a > 0 && (l = g = 5 / 6 * o);
    const h = g > 0 && a > 0 ? 12 * i * e / (a * g * m ** 2) : 0, M = l > 0 && a > 0 ? 12 * i * r / (a * l * m ** 2) : 0, w = i * o / Y, y = a * b / Y, x = 12 * i * e / m ** 3 / (1 + h), _ = 6 * i * e / m ** 2 / (1 + h), p = 4 * i * e / m * (1 + h / 4) / (1 + h), f = 2 * i * e / m * (1 - h / 2) / (1 + h), S = 12 * i * r / m ** 3 / (1 + M), D = 6 * i * r / m ** 2 / (1 + M), Q = 4 * i * r / m * (1 + M / 4) / (1 + M), A = 2 * i * r / m * (1 - M / 2) / (1 + M);
    return [
      [
        w,
        0,
        0,
        0,
        0,
        0,
        -w,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        x,
        0,
        0,
        0,
        _,
        0,
        -x,
        0,
        0,
        0,
        _
      ],
      [
        0,
        0,
        S,
        0,
        -D,
        0,
        0,
        0,
        -S,
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
        Q,
        0,
        0,
        0,
        D,
        0,
        A,
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
        f
      ],
      [
        -w,
        0,
        0,
        0,
        0,
        0,
        w,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        -x,
        0,
        0,
        0,
        -_,
        0,
        x,
        0,
        0,
        0,
        -_
      ],
      [
        0,
        0,
        -S,
        0,
        D,
        0,
        0,
        0,
        S,
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
        A,
        0,
        0,
        0,
        D,
        0,
        Q,
        0
      ],
      [
        0,
        _,
        0,
        0,
        0,
        f,
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
    const e = ((_a = n.elasticities) == null ? void 0 : _a.get(s)) ?? 0, r = ((_b = n.elasticitiesOrthogonal) == null ? void 0 : _b.get(s)) ?? 0, i = ((_c = n.poissonsRatios) == null ? void 0 : _c.get(s)) ?? 0, o = ((_d = n.shearModuli) == null ? void 0 : _d.get(s)) ?? 0, a = ((_e = n.thicknesses) == null ? void 0 : _e.get(s)) ?? 0, b = r > 0, Y = b ? W(e, r, o, i, a) : L(e, i, a), c = b ? T(o, a) : E(e, i, a), m = b ? ro(e, r, o, i) : so(e, i), l = t.map(([N, d]) => [
      N,
      d
    ]), g = l[1][0] - l[0][0], h = l[2][0] - l[0][0], M = l[0][1] - l[1][1], w = l[2][1] - l[0][1], y = 0.5 * (g * w - h * -M), x = j(l), _ = J(l), p = O(l, m, a), f = U(U(Kt(x), c), x), S = U(U(Kt(_), Y), _), D = ot(18, 18).toArray(), Q = U(Bt(f, S), y), A = [
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
    for (let N = 0; N < 3; N++) for (let d = 0; d < 3; d++) for (let Z = 0; Z < 3; Z++) {
      const R = A[N][d], P = A[Z][d];
      D[R][P] = p[N * 3 + d][Z * 3 + d];
    }
    for (let N = 0; N < 18; N++) for (let d = 0; d < 18; d++) D[N][d] = (D[N][d] ?? 0) + Q.get([
      N,
      d
    ]);
    return D;
    function L(N, d, Z) {
      const R = N / (1 - d * d), P = H([
        [
          R,
          R * d,
          0
        ],
        [
          R * d,
          R,
          0
        ],
        [
          0,
          0,
          R * (1 - d) / 2
        ]
      ]);
      return U(Z ** 3 / 12, P);
    }
    function E(N, d, Z) {
      const R = 0.8333333333333334, P = N / (2 * (1 + d)), I = R * P * Z;
      return H([
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
    function W(N, d, Z, R, P) {
      const I = d * R / N, q = 1 - R * I, B = N / q, $ = d / q, tt = R * d / q, C = H([
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
      return U(P ** 3 / 12, C);
    }
    function T(N, d) {
      const R = 0.8333333333333334 * N * d;
      return H([
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
    function j(N) {
      const d = ot(2, 18).toArray(), [Z, R] = N[0], [P, I] = N[1], [q, B] = N[2], $ = 0.5 * ((P - Z) * (B - R) - (q - Z) * -(R - I)), tt = (Z + P + q) / 3, st = (R + I + B) / 3, C = [
        tt,
        Z,
        P
      ], at = [
        st,
        R,
        I
      ], it = [
        tt,
        P,
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
      ], V = 1 / 3, [gt, bt, ut, vt] = u(C, at), [Mt, St, Xt, dt] = u(it, ct), [ht, rt, zt, v] = u(lt, pt), et = ot(2, 18).toArray(), mt = ot(2, 18).toArray(), yt = ot(2, 18).toArray();
      for (let z = 0; z < 2; z++) for (let F = 0; F < 6; F++) et[z][F] = V * gt[z][F] + bt[z][F], et[z][F + 6] = V * gt[z][F] + ut[z][F], et[z][F + 12] = V * gt[z][F], mt[z][F] = V * Mt[z][F], mt[z][F + 6] = V * Mt[z][F] + St[z][F], mt[z][F + 12] = V * Mt[z][F] + Xt[z][F], yt[z][F] = V * ht[z][F] + zt[z][F], yt[z][F + 6] = V * ht[z][F], yt[z][F + 12] = V * ht[z][F] + rt[z][F];
      for (let z = 0; z < 2; z++) for (let F = 0; F < 18; F++) et[z][F] *= vt, mt[z][F] *= dt, yt[z][F] *= v, d[z][F] = (et[z][F] + mt[z][F] + yt[z][F]) / $;
      return d;
    }
    function u(N, d) {
      const Z = ot(2, 6).toArray(), R = ot(2, 6).toArray(), P = ot(2, 6).toArray(), I = N[1] - N[0], q = N[0] - N[2], B = d[2] - d[0], $ = d[0] - d[1], tt = N[2] - N[1], st = d[1] - d[2], C = 0.5 * (I * B - q * $), at = 0.5 * $ * q, it = 0.5 * B * I, ct = 0.5 * I * q, lt = 0.5 * $ * B;
      return Z[0][2] = 0.5 * tt / C, Z[0][3] = -0.5, Z[1][2] = 0.5 * st / C, Z[1][4] = 0.5, R[0][2] = 0.5 * q / C, R[0][3] = 0.5 * at / C, R[0][4] = 0.5 * ct / C, R[1][2] = 0.5 * B / C, R[1][3] = 0.5 * lt / C, R[1][4] = 0.5 * it / C, P[0][2] = 0.5 * I / C, P[0][3] = -0.5 * it / C, P[0][4] = -0.5 * ct / C, P[1][2] = 0.5 * $ / C, P[1][3] = -0.5 * lt / C, P[1][4] = -0.5 * at / C, [
        Z,
        R,
        P,
        C
      ];
    }
    function J(N) {
      const d = ot(3, 18).toArray(), [Z, R] = N[0], [P, I] = N[1], [q, B] = N[2], $ = P - Z, tt = q - Z, st = q - P, C = I - B, at = B - R, it = R - I, ct = 0.5 * ($ * at - tt * -it), lt = C / (2 * ct), pt = st / (2 * ct), V = at / (2 * ct), gt = -tt / (2 * ct), bt = it / (2 * ct), ut = $ / (2 * ct);
      return d[0][4] = lt, d[0][10] = V, d[0][16] = bt, d[1][3] = -pt, d[1][9] = -gt, d[1][15] = -ut, d[2][3] = -lt, d[2][4] = pt, d[2][9] = -V, d[2][10] = gt, d[2][15] = -bt, d[2][16] = ut, d;
    }
    function O(N, d, Z) {
      let R = ot(9, 9).toArray(), P = ot(9, 9).toArray(), I = ot(9, 9).toArray(), q = ot(9, 3).toArray(), B = ot(3, 9).toArray(), $ = ot(3, 3).toArray(), tt = ot(3, 3).toArray(), st = ot(3, 3).toArray(), C = ot(3, 3).toArray(), at = ot(3, 3).toArray(), it = ot(3, 3).toArray(), ct = ot(3, 3).toArray(), lt = ot(3, 3).toArray();
      const pt = 1 / 8, V = pt / 6, gt = pt ** 2 / 4, bt = 1, ut = 2, vt = 1, Mt = 0, St = 1, Xt = -1, dt = -1, ht = -1, rt = -2, zt = N[0][0], v = N[0][1], et = N[1][0], mt = N[1][1], yt = N[2][0], z = N[2][1], F = zt - et, Lt = et - yt, Qt = yt - zt, kt = v - mt, Tt = mt - z, qt = z - v, jt = -F, wt = -Lt, xt = -Qt, Nt = -kt, _t = -Tt, Dt = -qt, X = 0.5 * (jt * qt - Qt * -kt), G = 2 * X, K = 4 * X, k = 0.5 * Z, Ft = X * Z, Yt = jt ** 2 + Nt ** 2, ft = wt ** 2 + _t ** 2, At = xt ** 2 + Dt ** 2;
      q[0][0] = k * Tt, q[0][2] = k * wt, q[1][1] = k * wt, q[1][2] = k * Tt, q[2][0] = k * Tt * (Dt - Nt) * V, q[2][1] = k * wt * (Qt - F) * V, q[2][2] = k * (Qt * Dt - F * Nt) * 2 * V, q[3][0] = k * qt, q[3][2] = k * xt, q[4][1] = k * xt, q[4][2] = k * qt, q[5][0] = k * qt * (Nt - _t) * V, q[5][1] = k * xt * (F - Lt) * V, q[5][2] = k * (F * Nt - Lt * _t) * 2 * V, q[6][0] = k * kt, q[6][2] = k * jt, q[7][1] = k * jt, q[7][2] = k * kt, q[8][0] = k * kt * (_t - Dt) * V, q[8][1] = k * jt * (Lt - Qt) * V, q[8][2] = k * (Lt * _t - Qt * Dt) * 2 * V, I = U(U(H(q), d), Kt(H(q))).toArray(), I = U(H(I), 1 / Ft).toArray(), B[0][0] = wt / K, B[0][1] = _t / K, B[0][2] = 1, B[0][3] = xt / K, B[0][4] = Dt / K, B[0][6] = jt / K, B[0][7] = Nt / K, B[1][0] = wt / K, B[1][1] = _t / K, B[1][3] = xt / K, B[1][4] = Dt / K, B[1][5] = 1, B[1][6] = jt / K, B[1][7] = Nt / K, B[2][0] = wt / K, B[2][1] = _t / K, B[2][3] = xt / K, B[2][4] = Dt / K, B[2][6] = jt / K, B[2][7] = Nt / K, B[2][8] = 1;
      const Ot = 1 / (X * K);
      $[0][0] = Ot * Tt * Dt * Yt, $[0][1] = Ot * qt * Nt * ft, $[0][2] = Ot * kt * _t * At, $[1][0] = Ot * Lt * xt * Yt, $[1][1] = Ot * Qt * jt * ft, $[1][2] = Ot * F * wt * At, $[2][0] = Ot * (Tt * Qt + wt * Dt) * Yt, $[2][1] = Ot * (qt * F + xt * Nt) * ft, $[2][2] = Ot * (kt * Lt + jt * _t) * At;
      const nt = G / 3;
      tt[0][0] = nt * bt / Yt, tt[0][1] = nt * ut / Yt, tt[0][2] = nt * vt / Yt, tt[1][0] = nt * Mt / ft, tt[1][1] = nt * St / ft, tt[1][2] = nt * Xt / ft, tt[2][0] = nt * dt / At, tt[2][1] = nt * ht / At, tt[2][2] = nt * rt / At, st[0][0] = nt * rt / Yt, st[0][1] = nt * dt / Yt, st[0][2] = nt * ht / Yt, st[1][0] = nt * vt / ft, st[1][1] = nt * bt / ft, st[1][2] = nt * ut / ft, st[2][0] = nt * Xt / At, st[2][1] = nt * Mt / At, st[2][2] = nt * St / At, C[0][0] = nt * St / Yt, C[0][1] = nt * Xt / Yt, C[0][2] = nt * Mt / Yt, C[1][0] = nt * ht / ft, C[1][1] = nt * rt / ft, C[1][2] = nt * dt / ft, C[2][0] = nt * ut / At, C[2][1] = nt * vt / At, C[2][2] = nt * bt / At, at = U(Bt(H(tt), H(st)), 0.5).toArray(), it = U(Bt(H(st), H(C)), 0.5).toArray(), ct = U(Bt(H(C), H(tt)), 0.5).toArray();
      const Zt = U(U(Kt(H($)), d), H($));
      return lt = Bt(Bt(U(U(Kt(H(at)), Zt), H(at)), U(U(Kt(H(it)), Zt), H(it))), U(U(Kt(H(ct)), Zt), H(ct))).toArray(), lt = U(H(lt), 3 / 4 * gt * Ft).toArray(), P = U(U(Kt(H(B)), H(lt)), H(B)).toArray(), R = Bt(H(I), H(P)).toArray(), R;
    }
  }
  function so(t, n) {
    const s = t / (1 - n * n);
    return H([
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
    const r = n * e / t, i = 1 - e * r, o = t / i, a = n / i, b = e * n / i;
    return H([
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
    const r = {
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
    n.forEach((Y, c) => {
      var _a, _b, _c, _d;
      const m = Y.map((g) => t[g]), l = Y.reduce((g, h) => {
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
      if (Y.length === 2) {
        const g = It(m, ((_a = s == null ? void 0 : s.localAngles) == null ? void 0 : _a.get(c)) ?? 0), h = U(g, l), M = yo(m, s, c);
        let w = U(M, h);
        const y = (_b = s == null ? void 0 : s.frameLoads) == null ? void 0 : _b.get(c);
        if (y && (y[0] || y[1] || y[2])) {
          const x = m[0], _ = m[1], p = [
            _[0] - x[0],
            _[1] - x[1],
            _[2] - x[2]
          ], f = Math.hypot(p[0], p[1], p[2]);
          if (f > 1e-9) {
            const S = [
              p[0] / f,
              p[1] / f,
              p[2] / f
            ], D = f * f / 12, Q = [
              S[1] * y[2] - S[2] * y[1],
              S[2] * y[0] - S[0] * y[2],
              S[0] * y[1] - S[1] * y[0]
            ], A = [
              -y[0] * f / 2,
              -y[1] * f / 2,
              -y[2] * f / 2,
              -D * Q[0],
              -D * Q[1],
              -D * Q[2],
              -y[0] * f / 2,
              -y[1] * f / 2,
              -y[2] * f / 2,
              +D * Q[0],
              +D * Q[1],
              +D * Q[2]
            ], L = U(g, A);
            w = w.map((E, W) => E + L[W]);
          }
        }
        r.normals.set(c, [
          w[0],
          w[6]
        ]), r.shearsY.set(c, [
          w[1],
          w[7]
        ]), r.shearsZ.set(c, [
          w[2],
          w[8]
        ]), r.torsions.set(c, [
          w[3],
          w[9]
        ]), r.bendingsY.set(c, [
          w[4],
          w[10]
        ]), r.bendingsZ.set(c, [
          w[5],
          w[11]
        ]);
      } else if (Y.length === 4) {
        const g = wo(m, l, s, c);
        a.membraneXX.set(c, g.Nx), a.membraneYY.set(c, g.Ny), a.membraneXY.set(c, g.Nxy), a.bendingXX.set(c, g.Mx), a.bendingYY.set(c, g.My), a.bendingXY.set(c, g.Mxy), g.Mj && i.set(c, g.Mj), g.Nj && o.set(c, g.Nj), a.tranverseShearX.set(c, g.Qx), a.tranverseShearY.set(c, g.Qy), a.vonMises.set(c, g.vonMises);
      } else if (Y.length === 3) {
        const g = It(m, ((_c = s == null ? void 0 : s.localAngles) == null ? void 0 : _c.get(c)) ?? 0);
        U(g, l);
        const h = xo(s, c), M = No(m), w = vo(l), y = So(m), _ = U(1 / (2 * y), U(U(h, M), w)).toArray(), p = ((_d = s.thicknesses) == null ? void 0 : _d.get(c)) ?? 1, f = _[0][0] * p, S = _[1][0] * p, D = _[2][0] * p, Q = _[0][1] * (p ** 3 / 12), A = _[1][1] * (p ** 3 / 12), L = _[2][1] * (p ** 3 / 12);
        a.membraneXX.set(c, f), a.membraneYY.set(c, S), a.membraneXY.set(c, D), a.bendingXX.set(c, Q), a.bendingYY.set(c, A), a.bendingXY.set(c, L);
      }
    });
    const { nodeToCentroidElementIndiciesMap: b } = jo(t, n);
    {
      const Y = (l) => {
        var _a;
        return (((_a = s == null ? void 0 : s.plateFormulations) == null ? void 0 : _a.get(l)) ?? 0) === 1;
      }, c = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
      if (n.forEach((l, g) => {
        if (l.length !== 4) return;
        const h = l.map((M) => t[M]);
        c.set(g, [
          0,
          1,
          2
        ].map((M) => h.reduce((w, y) => w + y[M], 0) / 4)), m.set(g, l);
      }), [
        ...m.keys()
      ].some(Y)) {
        const l = /* @__PURE__ */ new Map();
        for (const [g, h] of m) for (const M of h) {
          const w = l.get(M) ?? [];
          w.push(g), l.set(M, w);
        }
        for (const [g, h] of m) {
          if (!Y(g)) continue;
          const M = /* @__PURE__ */ new Map();
          for (const S of h) for (const D of l.get(S) ?? []) D !== g && M.set(D, (M.get(D) ?? 0) + 1);
          const w = [
            ...M
          ].filter(([, S]) => S >= 2).map(([S]) => S);
          if (w.length < 2) continue;
          const y = c.get(g), x = (S) => {
            let D = 0, Q = 0, A = 0, L = 0, E = 0;
            const W = S.get(g) ?? 0;
            for (const j of w) {
              const u = c.get(j), J = u[0] - y[0], O = u[1] - y[1], N = (S.get(j) ?? 0) - W;
              D += J * J, Q += J * O, A += O * O, L += J * N, E += O * N;
            }
            const T = D * A - Q * Q;
            return Math.abs(T) < 1e-12 ? [
              0,
              0
            ] : [
              (L * A - E * Q) / T,
              (D * E - Q * L) / T
            ];
          }, _ = x(a.bendingXX), p = x(a.bendingYY), f = x(a.bendingXY);
          a.tranverseShearX.set(g, _[0] + f[1]), a.tranverseShearY.set(g, p[1] + f[0]);
        }
      }
    }
    return n.forEach((Y, c) => {
      if (Y.length !== 3 && Y.length !== 4) return;
      const m = Y.length, l = new Array(m).fill(0), g = new Array(m).fill(0), h = new Array(m).fill(0), M = new Array(m).fill(0), w = new Array(m).fill(0), y = new Array(m).fill(0), x = new Array(m).fill(0), _ = new Array(m).fill(0), p = new Array(m).fill(0);
      Y.forEach((A, L) => {
        const E = (b.get(A) || []).filter((u) => n[u].length === 3 || n[u].length === 4), W = (u) => Pt(E.map((J) => u.get(J) ?? 0)), T = (u, J) => Pt(E.map((O) => {
          const N = o.get(O), d = N ? n[O].indexOf(A) : -1;
          return N && d >= 0 ? N[d][u] : J.get(O) ?? 0;
        }));
        l[L] = T(0, a.membraneXX), g[L] = T(1, a.membraneYY), h[L] = T(2, a.membraneXY);
        const j = (u, J) => Pt(E.map((O) => {
          const N = i.get(O), d = N ? n[O].indexOf(A) : -1;
          return N && d >= 0 ? N[d][u] : J.get(O) ?? 0;
        }));
        M[L] = j(0, a.bendingXX), w[L] = j(1, a.bendingYY), y[L] = j(2, a.bendingXY), x[L] = W(a.tranverseShearX), _[L] = W(a.tranverseShearY), p[L] = W(a.vonMises);
      }), r.membraneXX.set(c, l), r.membraneYY.set(c, g), r.membraneXY.set(c, h), r.bendingXX.set(c, M), r.bendingYY.set(c, w), r.bendingXY.set(c, y);
      const f = o.get(c), S = (A, L) => f ? f.reduce((E, W) => E + W[A], 0) / f.length : L.get(c) ?? 0;
      (r.membraneXXcentro ?? (r.membraneXXcentro = /* @__PURE__ */ new Map())).set(c, S(0, a.membraneXX)), (r.membraneYYcentro ?? (r.membraneYYcentro = /* @__PURE__ */ new Map())).set(c, S(1, a.membraneYY)), (r.membraneXYcentro ?? (r.membraneXYcentro = /* @__PURE__ */ new Map())).set(c, S(2, a.membraneXY)), f && ((r.membraneXXjoint ?? (r.membraneXXjoint = /* @__PURE__ */ new Map())).set(c, f.map((A) => A[0])), (r.membraneYYjoint ?? (r.membraneYYjoint = /* @__PURE__ */ new Map())).set(c, f.map((A) => A[1])), (r.membraneXYjoint ?? (r.membraneXYjoint = /* @__PURE__ */ new Map())).set(c, f.map((A) => A[2])));
      const D = i.get(c), Q = (A, L) => D ? D.reduce((E, W) => E + W[A], 0) / D.length : L.get(c) ?? 0;
      (r.bendingXXcentro ?? (r.bendingXXcentro = /* @__PURE__ */ new Map())).set(c, Q(0, a.bendingXX)), (r.bendingYYcentro ?? (r.bendingYYcentro = /* @__PURE__ */ new Map())).set(c, Q(1, a.bendingYY)), (r.bendingXYcentro ?? (r.bendingXYcentro = /* @__PURE__ */ new Map())).set(c, Q(2, a.bendingXY)), D && ((r.bendingXXjoint ?? (r.bendingXXjoint = /* @__PURE__ */ new Map())).set(c, D.map((A) => A[0])), (r.bendingYYjoint ?? (r.bendingYYjoint = /* @__PURE__ */ new Map())).set(c, D.map((A) => A[1])), (r.bendingXYjoint ?? (r.bendingXYjoint = /* @__PURE__ */ new Map())).set(c, D.map((A) => A[2]))), r.tranverseShearX.set(c, x), r.tranverseShearY.set(c, _), r.vonMises.set(c, p);
    }), r;
  };
  function wo(t, n, s, e) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const r = ((_a = s.elasticities) == null ? void 0 : _a.get(e)) ?? 0, i = ((_b = s.poissonsRatios) == null ? void 0 : _b.get(e)) ?? 0, o = ((_c = s.thicknesses) == null ? void 0 : _c.get(e)) ?? 1, a = t[0], b = t[1], Y = t[2], c = t[3], m = [
      b[0] - a[0],
      b[1] - a[1],
      b[2] - a[2]
    ], l = [
      Y[0] - c[0],
      Y[1] - c[1],
      Y[2] - c[2]
    ];
    let g = [
      m[0] + l[0],
      m[1] + l[1],
      m[2] + l[2]
    ], h = Math.sqrt(g[0] * g[0] + g[1] * g[1] + g[2] * g[2]);
    h < 1e-14 && (h = 1);
    let M = [
      g[0] / h,
      g[1] / h,
      g[2] / h
    ];
    const w = [
      Y[0] - a[0],
      Y[1] - a[1],
      Y[2] - a[2]
    ], y = [
      c[0] - b[0],
      c[1] - b[1],
      c[2] - b[2]
    ];
    let x = [
      w[1] * y[2] - w[2] * y[1],
      w[2] * y[0] - w[0] * y[2],
      w[0] * y[1] - w[1] * y[0]
    ], _ = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
    _ < 1e-14 && (_ = 1);
    let p = [
      x[0] / _,
      x[1] / _,
      x[2] / _
    ], f = [
      p[1] * M[2] - p[2] * M[1],
      p[2] * M[0] - p[0] * M[2],
      p[0] * M[1] - p[1] * M[0]
    ], S = Math.sqrt(f[0] * f[0] + f[1] * f[1] + f[2] * f[2]);
    S < 1e-14 && (S = 1), f = [
      f[0] / S,
      f[1] / S,
      f[2] / S
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
        ], k = Math.hypot(K[0], K[1], K[2]) || 1;
        M = [
          K[0] / k,
          K[1] / k,
          K[2] / k
        ];
      }
      f = [
        p[1] * M[2] - p[2] * M[1],
        p[2] * M[0] - p[0] * M[2],
        p[0] * M[1] - p[1] * M[0]
      ];
      const G = Math.hypot(f[0], f[1], f[2]) || 1;
      f = [
        f[0] / G,
        f[1] / G,
        f[2] / G
      ], M = [
        f[1] * p[2] - f[2] * p[1],
        f[2] * p[0] - f[0] * p[2],
        f[0] * p[1] - f[1] * p[0]
      ];
    }
    const D = 0.25 * (a[0] + b[0] + Y[0] + c[0]), Q = 0.25 * (a[1] + b[1] + Y[1] + c[1]), A = 0.25 * (a[2] + b[2] + Y[2] + c[2]), L = [], E = [];
    for (let X = 0; X < 4; X++) {
      const G = t[X][0] - D, K = t[X][1] - Q, k = t[X][2] - A;
      L.push(G * M[0] + K * M[1] + k * M[2]), E.push(G * f[0] + K * f[1] + k * f[2]);
    }
    const W = [
      M,
      f,
      p
    ], T = new Array(24).fill(0);
    for (let X = 0; X < 4; X++) {
      const G = X * 6, K = X * 6;
      for (let k = 0; k < 3; k++) T[K + k] = W[k][0] * n[G] + W[k][1] * n[G + 1] + W[k][2] * n[G + 2];
      for (let k = 0; k < 3; k++) T[K + 3 + k] = W[k][0] * n[G + 3] + W[k][1] * n[G + 4] + W[k][2] * n[G + 5];
    }
    const j = r / (1 - i * i), u = [
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
    ], J = o * o * o / 12, O = [
      [
        j * J,
        j * i * J,
        0
      ],
      [
        j * i * J,
        j * J,
        0
      ],
      [
        0,
        0,
        j * (1 - i) / 2 * J
      ]
    ], N = [
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
    let Z = 0, R = 0, P = 0, I = 0;
    for (let X = 0; X < 4; X++) Z += N[X] * L[X], R += N[X] * E[X], P += d[X] * L[X], I += d[X] * E[X];
    const q = Z * I - R * P;
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
    const B = I / q, $ = -R / q, tt = -P / q, st = Z / q, C = [], at = [];
    for (let X = 0; X < 4; X++) C.push(B * N[X] + $ * d[X]), at.push(tt * N[X] + st * d[X]);
    let it = 0, ct = 0, lt = 0;
    for (let X = 0; X < 4; X++) {
      const G = T[X * 6 + 0], K = T[X * 6 + 1];
      it += C[X] * G, ct += at[X] * K, lt += at[X] * G + C[X] * K;
    }
    const pt = u[0][0] * it + u[0][1] * ct, V = u[1][0] * it + u[1][1] * ct, gt = u[2][2] * lt;
    let bt = 0, ut = 0, vt = 0;
    for (let X = 0; X < 4; X++) {
      const G = T[X * 6 + 3], K = T[X * 6 + 4];
      bt += C[X] * K, ut += -at[X] * G, vt += at[X] * K - C[X] * G;
    }
    const Mt = -1, St = Mt * (O[0][0] * bt + O[0][1] * ut), Xt = Mt * (O[1][0] * bt + O[1][1] * ut), dt = Mt * (O[2][2] * vt);
    let ht = null;
    if (Math.abs(q) > 1e-20) {
      const X = [];
      for (let ft = 0; ft < 4; ft++) X.push(T[ft * 6 + 0], T[ft * 6 + 1], T[ft * 6 + 5]);
      const G = ((_d = s == null ? void 0 : s.drillingTypes) == null ? void 0 : _d.get(e)) ?? 13, K = ((_e = s == null ? void 0 : s.drillingPenaltyScales) == null ? void 0 : _e.get(e)) ?? 0.4, k = (_f = s == null ? void 0 : s.membraneModifiers) == null ? void 0 : _f.get(e), Ft = (_g = s == null ? void 0 : s.shellModifiers) == null ? void 0 : _g.get(e), Yt = Array.isArray(Ft) && Ft.length >= 3 ? [
        Ft[0],
        Ft[1],
        Ft[2]
      ] : typeof k == "number" && k !== 1 ? [
        k,
        k,
        k
      ] : null;
      try {
        ht = co(L, E, X, r, i, o, {
          tipo: G,
          gammaFac: K,
          mod: Yt
        }), ht && ht.some((ft) => ft.some((At) => !Number.isFinite(At))) && (ht = null);
      } catch {
        ht = null;
      }
    }
    let rt = null;
    const zt = (((_h = s == null ? void 0 : s.plateFormulations) == null ? void 0 : _h.get(e)) ?? 0) !== 1;
    if (Math.abs(q) > 1e-20) {
      const X = [];
      for (let G = 0; G < 4; G++) X.push(T[G * 6 + 2], T[G * 6 + 3], T[G * 6 + 4]);
      try {
        const G = globalThis.__hekatanDkqJoints ?? "gauss";
        rt = (zt ? ao(L, E, X, r, i, o) : eo(L, E, X, r, i, o, G)).map((K) => K.map((k) => Mt * k)), rt.some((K) => K.some((k) => !Number.isFinite(k))) && (rt = null);
      } catch {
        rt = null;
      }
    }
    const v = 5 / 6, et = r / (2 * (1 + i)), mt = v * et * o;
    let yt = 0, z = 0;
    const F = [
      0.25,
      0.25,
      0.25,
      0.25
    ];
    for (let X = 0; X < 4; X++) {
      const G = T[X * 6 + 2], K = T[X * 6 + 3], k = T[X * 6 + 4];
      yt += C[X] * G + F[X] * K, z += at[X] * G + F[X] * k;
    }
    const Lt = mt * yt, Qt = mt * z, kt = pt / o + 6 * St / (o * o), Tt = V / o + 6 * Xt / (o * o), qt = gt / o + 6 * dt / (o * o), jt = Math.sqrt(kt * kt - kt * Tt + Tt * Tt + 3 * qt * qt), wt = pt / o - 6 * St / (o * o), xt = V / o - 6 * Xt / (o * o), Nt = gt / o - 6 * dt / (o * o), _t = Math.sqrt(wt * wt - wt * xt + xt * xt + 3 * Nt * Nt), Dt = Math.max(jt, _t);
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
    const s = ((_a = t.elasticities) == null ? void 0 : _a.get(n)) ?? 0, e = ((_b = t.elasticitiesOrthogonal) == null ? void 0 : _b.get(n)) ?? 0, r = ((_c = t.poissonsRatios) == null ? void 0 : _c.get(n)) ?? 0, i = ((_d = t.shearModuli) == null ? void 0 : _d.get(n)) ?? 0;
    return (_e = t.thicknesses) == null ? void 0 : _e.get(n), e > 0 ? ro(s, e, i, r) : so(s, r);
  }
  function No(t) {
    const [n, s] = t[0], [e, r] = t[1], [i, o] = t[2], a = r - o, b = o - s, Y = s - r, c = i - e, m = n - i, l = e - n;
    return H([
      [
        a,
        b,
        Y,
        0,
        0,
        0
      ],
      [
        0,
        0,
        0,
        c,
        m,
        l
      ],
      [
        c,
        m,
        l,
        a,
        b,
        Y
      ]
    ]);
  }
  function vo(t) {
    const [n, s, e] = [
      t[0],
      t[6],
      t[12]
    ], [r, i, o] = [
      t[1],
      t[7],
      t[13]
    ], [a, b, Y] = [
      t[4],
      t[10],
      t[16]
    ], [c, m, l] = [
      t[3],
      t[9],
      t[15]
    ];
    return H([
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
        -Y
      ],
      [
        r,
        c
      ],
      [
        i,
        m
      ],
      [
        o,
        l
      ]
    ]);
  }
  function So(t) {
    const [n, s] = t[0], [e, r] = t[1], [i, o] = t[2], a = e - n, b = i - n, Y = o - s, c = s - r;
    return 0.5 * (a * Y - b * -c);
  }
  function jo(t, n) {
    const s = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
    return n.forEach((r, i) => {
      const o = r.map((b) => t[b]), a = _o(o);
      r.forEach((b) => {
        var _a, _b;
        s.has(b) || s.set(b, []), (_a = s.get(b)) == null ? void 0 : _a.push(a), e.has(b) || e.set(b, []), (_b = e.get(b)) == null ? void 0 : _b.push(i);
      });
    }), {
      nodeToCentroidNodesMap: s,
      nodeToCentroidElementIndiciesMap: e
    };
  }
  function _o(t) {
    const n = t.reduce((r, i) => r + i[0], 0) / t.length, s = t.reduce((r, i) => r + i[1], 0) / t.length, e = t.reduce((r, i) => r + i[2], 0) / t.length;
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
