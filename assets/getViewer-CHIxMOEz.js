import { u as pn, a6 as Go, q as ki, v as ve, a7 as Si, D as It, M as ut, B as De, F as Tt, a8 as Pi, z as bt, a9 as zi, aa as Ai, h as ya, ab as xa, r as Jn, ac as Oo, ad as jo, a4 as Ia, _ as ft, b as mt, L as an, y as Ta, c as Ci, ae as Fi, f as gt, V as T, $ as Yn, af as zs, K as os, d as Et, a as As, A as Ra, t as ts, J as Ei, H as ko, I as $i, ag as es, w as Cs, o as Li, N as Dn, a2 as ro, E as ga, S as co, m as vo, ah as Ln, g as ba, i as Ma, j as va, P as So, C as _a, W as Vi, X as Ii, Y as Ti, Z as Ri, l as ka, T as Ho, U as Bi } from "./theme-C-zoknmI.js";
import { T as Bt, O as Sa } from "./Text-Cehu0nom.js";
import { P as Ba } from "./tweakpane-BXg6ZhiP.js";
import { e as Di } from "./styles-CqEyA8nI.js";
import { __tla as __tla_0 } from "./didacticCpp-Czy7NlhT.js";
let Wi, $a, Nl, Ki, qi, Yl, er, Xl, jl, Ql, Pa, Ol;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function Da(t, c, m, g, b, A = 1e3) {
    const P = m * b * b * b / (12 * (1 - g * g)), k = [
      [
        P,
        P * g,
        0
      ],
      [
        P * g,
        P,
        0
      ],
      [
        0,
        0,
        P * (1 - g) / 2
      ]
    ], v = 5 / 6 * m * b / (2 * (1 + g)), S = k[0][0] + k[1][1] + k[2][2], E = A, B = [], se = [], V = [];
    for (let O = 0; O < 4; O++) {
      const W = (O + 1) % 4, re = t[W] - t[O], we = c[W] - c[O], ze = Math.hypot(re, we);
      V.push(ze), B.push(ze > 0 ? re / ze : 1), se.push(ze > 0 ? we / ze : 0);
    }
    const ie = () => new Array(22).fill(0), J = [
      ie(),
      ie(),
      ie(),
      ie()
    ];
    for (let O = 0; O < 4; O++) {
      const W = (O + 1) % 4;
      J[O][3 * W] += 1 / V[O], J[O][3 * O] -= 1 / V[O], J[O][3 * O + 1] -= se[O] / 2, J[O][3 * W + 1] -= se[O] / 2, J[O][3 * O + 2] += B[O] / 2, J[O][3 * W + 2] += B[O] / 2, J[O][12 + 2 * O] -= 2 / 3 * se[O], J[O][13 + 2 * O] += 2 / 3 * B[O];
    }
    const R = (O, W) => O.map((re) => re * W), le = (O, W) => O.map((re, we) => re + W[we]), ue = R(J[0], V[0] / 2), xe = R(J[2], -V[2] / 2), be = R(J[1], V[1] / 2), Q = R(J[3], -V[3] / 2), ae = R(le(ue, xe), 0.5), te = R(le(xe, R(ue, -1)), 0.5), ne = R(le(Q, be), 0.5), Y = R(le(be, R(Q, -1)), 0.5), ee = R(le(te, Y), 0.5), G = (O, W) => {
      const re = [
        -(1 - W) / 4,
        (1 - W) / 4,
        (1 + W) / 4,
        -(1 + W) / 4
      ], we = [
        -(1 - O) / 4,
        -(1 + O) / 4,
        (1 + O) / 4,
        (1 - O) / 4
      ], ze = [
        -O * (1 - W),
        (1 - W * W) / 2,
        -O * (1 + W),
        -(1 - W * W) / 2
      ], Ee = [
        -(1 - O * O) / 2,
        -W * (1 + O),
        (1 - O * O) / 2,
        -W * (1 - O)
      ];
      let tt = 0, at = 0, Ue = 0, Z = 0;
      for (let Pe = 0; Pe < 4; Pe++) tt += re[Pe] * t[Pe], at += re[Pe] * c[Pe], Ue += we[Pe] * t[Pe], Z += we[Pe] * c[Pe];
      const ce = tt * Z - at * Ue, pe = [
        [
          Z / ce,
          -at / ce
        ],
        [
          -Ue / ce,
          tt / ce
        ]
      ], me = [
        ie(),
        ie(),
        ie(),
        ie(),
        ie()
      ], ke = ie(), $e = (Pe, ot, Ye, dt, Oe) => {
        me[0][Pe] += Ye * dt, me[1][Pe] -= ot * Oe, me[2][Pe] += Ye * Oe - ot * dt, ke[Pe] += ot * dt + Ye * Oe;
      };
      for (let Pe = 0; Pe < 4; Pe++) {
        const ot = pe[0][0] * re[Pe] + pe[0][1] * we[Pe], Ye = pe[1][0] * re[Pe] + pe[1][1] * we[Pe];
        $e(3 * Pe + 1, 1, 0, ot, Ye), $e(3 * Pe + 2, 0, 1, ot, Ye);
      }
      for (let Pe = 0; Pe < 4; Pe++) {
        const ot = pe[0][0] * ze[Pe] + pe[0][1] * Ee[Pe], Ye = pe[1][0] * ze[Pe] + pe[1][1] * Ee[Pe];
        $e(12 + 2 * Pe, 1, 0, ot, Ye), $e(13 + 2 * Pe, 0, 1, ot, Ye);
      }
      const Ae = -2 * O * (1 - W * W), Le = -2 * W * (1 - O * O), je = pe[0][0] * Ae + pe[0][1] * Le, We = pe[1][0] * Ae + pe[1][1] * Le;
      $e(20, 1, 0, je, We), $e(21, 0, 1, je, We);
      const Ve = le(ae, R(ee, W)), et = le(ne, R(ee, O));
      for (let Pe = 0; Pe < 22; Pe++) me[3][Pe] = pe[0][0] * Ve[Pe] + pe[0][1] * et[Pe], me[4][Pe] = pe[1][0] * Ve[Pe] + pe[1][1] * et[Pe];
      return {
        B: me,
        v: ke,
        dJ: Math.abs(ce)
      };
    }, C = Math.sqrt(7 / 9), N = Math.sqrt(7 / 15), H = [
      [
        -C,
        -C
      ],
      [
        C,
        -C
      ],
      [
        C,
        C
      ],
      [
        -C,
        C
      ],
      [
        0,
        -N
      ],
      [
        N,
        0
      ],
      [
        0,
        N
      ],
      [
        -N,
        0
      ]
    ], q = [
      9 / 49,
      9 / 49,
      9 / 49,
      9 / 49,
      40 / 49,
      40 / 49,
      40 / 49,
      40 / 49
    ], oe = H.map(([O, W], re) => {
      const we = G(O, W);
      return {
        B: we.B,
        v: we.v,
        w: q[re] * we.dJ
      };
    }), D = oe.reduce((O, W) => O + W.w, 0), de = [
      ie(),
      ie(),
      ie()
    ];
    for (const O of oe) for (let W = 0; W < 3; W++) for (let re = 12; re < 22; re++) de[W][re] += O.B[W][re] * O.w / D;
    const j = Array.from({
      length: 22
    }, () => ie());
    for (const O of oe) {
      for (let re = 0; re < 3; re++) for (let we = 12; we < 22; we++) O.B[re][we] -= de[re][we];
      const W = [
        ie(),
        ie(),
        ie(),
        ie(),
        ie()
      ];
      for (let re = 0; re < 22; re++) {
        for (let we = 0; we < 3; we++) W[we][re] = k[we][0] * O.B[0][re] + k[we][1] * O.B[1][re] + k[we][2] * O.B[2][re];
        W[3][re] = v * O.B[3][re], W[4][re] = v * O.B[4][re];
      }
      for (let re = 0; re < 22; re++) for (let we = 0; we < 22; we++) {
        let ze = 0;
        for (let Ee = 0; Ee < 5; Ee++) ze += O.B[Ee][re] * W[Ee][we];
        j[re][we] += (ze + E * S * O.v[re] * O.v[we]) * O.w;
      }
    }
    return {
      K: j,
      media: de,
      Ben: G,
      Db: k,
      z22: ie
    };
  }
  Ql = function(t, c, m, g, b, A, P = 1e3) {
    const { K: k, media: v, Ben: S, Db: E, z22: B } = Da(t, c, g, b, A, P);
    let se = 0;
    for (const Q of k) for (const ae of Q) se = Math.max(se, Math.abs(ae));
    const V = k.map((Q) => Q.slice()), ie = [];
    for (let Q = 12; Q < 22; Q++) {
      const ae = V[Q][Q];
      if (Math.abs(ae) <= 1e-14 * se) continue;
      ie.push(Q);
      const te = V[Q].slice(), ne = V.map((Y) => Y[Q]);
      for (let Y = 0; Y < 22; Y++) for (let ee = 0; ee < 22; ee++) V[Y][ee] -= ne[Y] * te[ee] / ae;
      for (let Y = 0; Y < 22; Y++) V[Q][Y] = 0, V[Y][Q] = 0;
    }
    const J = ie.length, R = ie.map((Q) => ie.map((ae) => k[Q][ae])), le = ie.map((Q) => {
      let ae = 0;
      for (let te = 0; te < 12; te++) ae -= k[Q][te] * m[te];
      return ae;
    });
    for (let Q = 0; Q < J; Q++) {
      let ae = Q;
      for (let te = Q + 1; te < J; te++) Math.abs(R[te][Q]) > Math.abs(R[ae][Q]) && (ae = te);
      if ([R[Q], R[ae]] = [
        R[ae],
        R[Q]
      ], [le[Q], le[ae]] = [
        le[ae],
        le[Q]
      ], !(Math.abs(R[Q][Q]) < 1e-300)) for (let te = Q + 1; te < J; te++) {
        const ne = R[te][Q] / R[Q][Q];
        for (let Y = Q; Y < J; Y++) R[te][Y] -= ne * R[Q][Y];
        le[te] -= ne * le[Q];
      }
    }
    const ue = new Array(J).fill(0);
    for (let Q = J - 1; Q >= 0; Q--) {
      let ae = le[Q];
      for (let te = Q + 1; te < J; te++) ae -= R[Q][te] * ue[te];
      ue[Q] = Math.abs(R[Q][Q]) < 1e-300 ? 0 : ae / R[Q][Q];
    }
    const xe = B();
    for (let Q = 0; Q < 12; Q++) xe[Q] = m[Q];
    ie.forEach((Q, ae) => {
      xe[Q] = ue[ae];
    });
    const be = (Q, ae) => {
      const { B: te } = S(Q, ae);
      for (let Y = 0; Y < 3; Y++) for (let ee = 12; ee < 22; ee++) te[Y][ee] -= v[Y][ee];
      const ne = [
        0,
        1,
        2
      ].map((Y) => te[Y].reduce((ee, G, C) => ee + G * xe[C], 0));
      return [
        0,
        1,
        2
      ].map((Y) => E[Y][0] * ne[0] + E[Y][1] * ne[1] + E[Y][2] * ne[2]);
    };
    return [
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
    ].map(([Q, ae]) => be(Q, ae));
  };
  function Ni(t, c, m, g, b, A = 1e3) {
    const { K: P } = Da(t, c, m, g, b, A);
    let k = 0;
    for (const S of P) for (const E of S) k = Math.max(k, Math.abs(E));
    const v = P.map((S) => S.slice());
    for (let S = 12; S < 22; S++) {
      const E = v[S][S];
      if (Math.abs(E) <= 1e-14 * k) continue;
      const B = v[S].slice(), se = v.map((V) => V[S]);
      for (let V = 0; V < 22; V++) for (let ie = 0; ie < 22; ie++) v[V][ie] -= se[V] * B[ie] / E;
      for (let V = 0; V < 22; V++) v[S][V] = 0, v[V][S] = 0;
    }
    return v.slice(0, 12).map((S) => S.slice(0, 12));
  }
  function Yi(t, c) {
    const m = new Array(8).fill(0), g = new Array(8).fill(0), b = new Array(8).fill(0), A = [
      -1,
      1,
      1,
      -1
    ], P = [
      -1,
      -1,
      1,
      1
    ];
    for (let k = 0; k < 4; k++) {
      const v = A[k] * t, S = P[k] * c;
      m[k] = 0.25 * (1 + v) * (1 + S) * (v + S - 1), g[k] = 0.25 * A[k] * (1 + S) * (2 * v + S), b[k] = 0.25 * P[k] * (1 + v) * (v + 2 * S);
    }
    return m[4] = 0.5 * (1 - t * t) * (1 - c), g[4] = -t * (1 - c), b[4] = -0.5 * (1 - t * t), m[5] = 0.5 * (1 + t) * (1 - c * c), g[5] = 0.5 * (1 - c * c), b[5] = -c * (1 + t), m[6] = 0.5 * (1 - t * t) * (1 + c), g[6] = -t * (1 + c), b[6] = 0.5 * (1 - t * t), m[7] = 0.5 * (1 - t) * (1 - c * c), g[7] = -0.5 * (1 - c * c), b[7] = -c * (1 - t), {
      N: m,
      dNxi: g,
      dNet: b
    };
  }
  function Na(t, c, m, g) {
    const b = [], A = [], P = [], k = [], v = [];
    for (let G = 0; G < 4; G++) {
      const C = G, N = (G + 1) % 4, H = t[C] - t[N], q = c[C] - c[N], oe = H * H + q * q;
      b.push(-H / oe), A.push(0.75 * H * q / oe), P.push((0.25 * H * H - 0.5 * q * q) / oe), k.push(-q / oe), v.push((0.25 * q * q - 0.5 * H * H) / oe);
    }
    const { dNxi: S, dNet: E } = Yi(m, g), B = [
      -(1 - g) / 4,
      (1 - g) / 4,
      (1 + g) / 4,
      -(1 + g) / 4
    ], se = [
      -(1 - m) / 4,
      -(1 + m) / 4,
      (1 + m) / 4,
      (1 - m) / 4
    ];
    let V = 0, ie = 0, J = 0, R = 0;
    for (let G = 0; G < 4; G++) V += B[G] * t[G], ie += B[G] * c[G], J += se[G] * t[G], R += se[G] * c[G];
    const le = V * R - ie * J, ue = R / le, xe = -ie / le, be = -J / le, Q = V / le, ae = new Array(12).fill(0), te = new Array(12).fill(0), ne = new Array(12).fill(0), Y = new Array(12).fill(0);
    for (let G = 0; G < 4; G++) {
      const C = (G + 3) % 4, N = G, H = 4 + C, q = 4 + N, oe = 1.5 * (b[N] * S[q] - b[C] * S[H]), D = 1.5 * (b[N] * E[q] - b[C] * E[H]), de = A[N] * S[q] + A[C] * S[H], j = A[N] * E[q] + A[C] * E[H], O = S[G] - P[N] * S[q] - P[C] * S[H], W = E[G] - P[N] * E[q] - P[C] * E[H];
      ae[3 * G] = oe, te[3 * G] = D, ae[3 * G + 1] = de, te[3 * G + 1] = j, ae[3 * G + 2] = O, te[3 * G + 2] = W;
      const re = 1.5 * (k[N] * S[q] - k[C] * S[H]), we = 1.5 * (k[N] * E[q] - k[C] * E[H]), ze = -S[G] + v[N] * S[q] + v[C] * S[H], Ee = -E[G] + v[N] * E[q] + v[C] * E[H];
      ne[3 * G] = re, Y[3 * G] = we, ne[3 * G + 1] = ze, Y[3 * G + 1] = Ee, ne[3 * G + 2] = -de, Y[3 * G + 2] = -j;
    }
    const ee = [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0)
    ];
    for (let G = 0; G < 12; G++) {
      const C = ue * ae[G] + xe * te[G], N = be * ae[G] + Q * te[G], H = ue * ne[G] + xe * Y[G], q = be * ne[G] + Q * Y[G];
      ee[0][G] = C, ee[1][G] = q, ee[2][G] = N + H;
    }
    return ee;
  }
  Ol = function(t, c, m, g, b, A, P = "esquinas") {
    const k = g * A * A * A / (12 * (1 - b * b)), v = [
      [
        k,
        k * b,
        0
      ],
      [
        k * b,
        k,
        0
      ],
      [
        0,
        0,
        k * (1 - b) / 2
      ]
    ], S = (V, ie) => {
      const J = Na(t, c, V, ie), R = [
        0,
        1,
        2
      ].map((le) => J[le].reduce((ue, xe, be) => ue + xe * m[be], 0));
      return [
        0,
        1,
        2
      ].map((le) => v[le][0] * R[0] + v[le][1] * R[1] + v[le][2] * R[2]);
    }, E = [
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
    ];
    if (P === "esquinas") return E.map(([V, ie]) => S(V, ie));
    const B = 1 / Math.sqrt(3), se = E.map(([V, ie]) => S(V * B, ie * B));
    return E.map(([V, ie]) => {
      const J = V * Math.sqrt(3), R = ie * Math.sqrt(3), le = E.map(([ue, xe]) => (1 + ue * J) * (1 + xe * R) / 4);
      return [
        0,
        1,
        2
      ].map((ue) => le.reduce((xe, be, Q) => xe + be * se[Q][ue], 0));
    });
  };
  function Xi(t, c) {
    return {
      N: [
        0.25 * (1 - t) * (1 - c),
        0.25 * (1 + t) * (1 - c),
        0.25 * (1 + t) * (1 + c),
        0.25 * (1 - t) * (1 + c)
      ],
      dNxi: [
        -0.25 * (1 - c),
        0.25 * (1 - c),
        0.25 * (1 + c),
        -0.25 * (1 + c)
      ],
      dNeta: [
        -0.25 * (1 - t),
        -0.25 * (1 + t),
        0.25 * (1 + t),
        0.25 * (1 - t)
      ]
    };
  }
  function Ui(t, c, m, g) {
    let b = 0, A = 0, P = 0, k = 0;
    for (let E = 0; E < 4; E++) b += m[E] * t[E], A += m[E] * c[E], P += g[E] * t[E], k += g[E] * c[E];
    let v = b * k - A * P;
    Math.abs(v) < 1e-15 && (v = 1e-15);
    const S = 1 / v;
    return {
      det: v,
      Ji: [
        [
          k * S,
          -A * S
        ],
        [
          -P * S,
          b * S
        ]
      ]
    };
  }
  function Ya(t, c, m, g, b, A = {}) {
    const P = A.tipo ?? 12, k = A.gammaFac ?? 0.4, v = A.mod ?? null;
    let S, E, B;
    if (P === 12) S = 2, E = true, B = 2e-4;
    else if (P === 3) S = 3, E = false, B = 0;
    else return null;
    const se = m / (1 - g * g), V = [
      [
        se,
        se * g,
        0
      ],
      [
        se * g,
        se,
        0
      ],
      [
        0,
        0,
        se * (1 - g) / 2
      ]
    ];
    if (v) {
      const H = v[0], q = v[1], oe = v[2];
      V[0][0] *= H, V[1][1] *= q, V[2][2] *= oe;
      const D = Math.sqrt(Math.max(0, H * q));
      V[0][1] *= D, V[1][0] *= D;
    }
    for (const H of V) for (let q = 0; q < 3; q++) H[q] *= b;
    const ie = [
      1,
      2,
      3,
      0
    ], J = [
      3,
      0,
      1,
      2
    ], R = [], le = [];
    for (let H = 0; H < 4; H++) R.push((c[ie[H]] - c[H]) / 8), le.push(-(t[ie[H]] - t[H]) / 8);
    const ue = 0.5773502691896258, xe = [
      -0.7745966692414834,
      0,
      0.7745966692414834
    ], be = [
      5 / 9,
      8 / 9,
      5 / 9
    ], Q = S === 2 ? [
      -ue,
      ue
    ] : xe, ae = S === 2 ? [
      1,
      1
    ] : be, te = [];
    for (let H = 0; H < S; H++) for (let q = 0; q < S; q++) te.push({
      r: Q[H],
      s: Q[q],
      w: ae[H] * ae[q]
    });
    const ne = (H, q) => {
      const { N: oe, dNxi: D, dNeta: de } = Xi(H, q), { det: j, Ji: O } = Ui(t, c, D, de), W = [], re = [];
      for (let Ae = 0; Ae < 4; Ae++) W.push(O[0][0] * D[Ae] + O[0][1] * de[Ae]), re.push(O[1][0] * D[Ae] + O[1][1] * de[Ae]);
      const we = [
        -H * (1 - q),
        0.5 * (1 - q * q),
        -H * (1 + q),
        -0.5 * (1 - q * q)
      ], ze = [
        -0.5 * (1 - H * H),
        -q * (1 + H),
        0.5 * (1 - H * H),
        -q * (1 - H)
      ], Ee = [], tt = [];
      for (let Ae = 0; Ae < 4; Ae++) Ee.push(O[0][0] * we[Ae] + O[0][1] * ze[Ae]), tt.push(O[1][0] * we[Ae] + O[1][1] * ze[Ae]);
      const at = -2 * H * (1 - q * q), Ue = -2 * q * (1 - H * H), Z = O[0][0] * at + O[0][1] * Ue, ce = O[1][0] * at + O[1][1] * Ue, pe = [], me = [], ke = [], $e = [];
      for (let Ae = 0; Ae < 4; Ae++) {
        const Le = J[Ae];
        pe.push(Ee[Le] * R[Le] - Ee[Ae] * R[Ae]), me.push(tt[Le] * R[Le] - tt[Ae] * R[Ae]), ke.push(Ee[Le] * le[Le] - Ee[Ae] * le[Ae]), $e.push(tt[Le] * le[Le] - tt[Ae] * le[Ae]);
      }
      return {
        N: oe,
        dNx: W,
        dNy: re,
        dNBx: Z,
        dNBy: ce,
        gt1: pe,
        gt2: me,
        gt3: ke,
        gt4: $e,
        dJ: Math.abs(j)
      };
    }, Y = [
      0,
      0,
      0,
      0
    ], ee = [
      0,
      0,
      0,
      0
    ], G = [
      0,
      0,
      0,
      0
    ];
    if (E) {
      let H = 0;
      for (const q of te) {
        const oe = ne(q.r, q.s), D = q.w * oe.dJ;
        for (let de = 0; de < 4; de++) Y[de] += oe.gt1[de] * D, ee[de] += oe.gt4[de] * D, G[de] += (oe.gt2[de] + oe.gt3[de]) * D;
        H += D;
      }
      for (let q = 0; q < 4; q++) Y[q] /= H, ee[q] /= H, G[q] /= H;
    }
    const C = (H, q) => {
      const oe = ne(H, q), D = [
        new Array(14).fill(0),
        new Array(14).fill(0),
        new Array(14).fill(0)
      ];
      for (let de = 0; de < 4; de++) D[0][3 * de] = oe.dNx[de], D[1][3 * de + 1] = oe.dNy[de], D[2][3 * de] = oe.dNy[de], D[2][3 * de + 1] = oe.dNx[de], D[0][3 * de + 2] = oe.gt1[de] - Y[de], D[1][3 * de + 2] = oe.gt4[de] - ee[de], D[2][3 * de + 2] = oe.gt2[de] + oe.gt3[de] - G[de];
      return D[0][12] = oe.dNBx, D[2][12] = oe.dNBy, D[1][13] = oe.dNBy, D[2][13] = oe.dNBx, {
        B: D,
        d: oe
      };
    }, N = Array.from({
      length: 14
    }, () => new Array(14).fill(0));
    for (const H of te) {
      const { B: q, d: oe } = C(H.r, H.s), D = H.w * oe.dJ, de = [
        0,
        1,
        2
      ].map((j) => q[0].map((O, W) => V[j][0] * q[0][W] + V[j][1] * q[1][W] + V[j][2] * q[2][W]));
      for (let j = 0; j < 14; j++) for (let O = 0; O < 14; O++) N[j][O] += (q[0][j] * de[0][O] + q[1][j] * de[1][O] + q[2][j] * de[2][O]) * D;
    }
    {
      const H = ne(0, 0), q = m / (2 * (1 + g)), oe = k * q, D = new Array(14).fill(0);
      for (let j = 0; j < 4; j++) D[3 * j] = -0.5 * H.dNy[j], D[3 * j + 1] = 0.5 * H.dNx[j], D[3 * j + 2] = 0.5 * (H.gt3[j] - H.gt2[j]) - H.N[j];
      D[12] = 0, D[13] = 0;
      const de = oe * b * 4 * H.dJ;
      for (let j = 0; j < 14; j++) for (let O = 0; O < 14; O++) N[j][O] += de * D[j] * D[O];
      if (B > 0) {
        let j = 0;
        for (let re = 0; re < 4; re++) {
          const we = (re + 1) % 4;
          j += t[re] * c[we] - t[we] * c[re];
        }
        j = Math.abs(j) / 2;
        const O = new Array(14).fill(0);
        for (let re = 0; re < 4; re++) O[3 * re + 2] = re % 2 === 0 ? 1 : -1;
        const W = B * q * b * j / 4;
        for (let re = 0; re < 14; re++) for (let we = 0; we < 14; we++) N[re][we] += W * O[re] * O[we];
      }
    }
    return {
      K: N,
      Ben: C,
      Dm: V,
      GP2: ue
    };
  }
  jl = function(t, c, m, g, b, A, P = {}) {
    const k = Ya(t, c, g, b, A, P);
    if (!k) return null;
    const { K: v, Ben: S, Dm: E, GP2: B } = k, se = [
      ...m,
      0,
      0
    ], V = [
      [
        v[12][12],
        v[12][13]
      ],
      [
        v[13][12],
        v[13][13]
      ]
    ], ie = V[0][0] * V[1][1] - V[0][1] * V[1][0];
    if (Math.abs(ie) > 1e-30) {
      const Q = v[12].slice(0, 12).reduce((te, ne, Y) => te + ne * m[Y], 0), ae = v[13].slice(0, 12).reduce((te, ne, Y) => te + ne * m[Y], 0);
      se[12] = -(V[1][1] * Q - V[0][1] * ae) / ie, se[13] = -(-V[1][0] * Q + V[0][0] * ae) / ie;
    }
    const J = globalThis.__hekatanItwRec ?? "", R = se.slice();
    if (J.includes("conBurbuja") || (R[12] = 0, R[13] = 0), J.includes("sinTheta")) for (let Q = 0; Q < 4; Q++) R[3 * Q + 2] = 0;
    const le = (Q, ae) => {
      const { B: te, d: ne } = S(Q, ae);
      if (J.includes("sinProy")) for (let ee = 0; ee < 4; ee++) te[0][3 * ee + 2] = ne.gt1[ee], te[1][3 * ee + 2] = ne.gt4[ee], te[2][3 * ee + 2] = ne.gt2[ee] + ne.gt3[ee];
      const Y = [
        0,
        1,
        2
      ].map((ee) => te[ee].reduce((G, C, N) => G + C * R[N], 0));
      return [
        0,
        1,
        2
      ].map((ee) => E[ee][0] * Y[0] + E[ee][1] * Y[1] + E[ee][2] * Y[2]);
    }, ue = [
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
    ];
    if (J.includes("esquinas")) return ue.map(([Q, ae]) => le(Q, ae));
    const xe = B, be = ue.map(([Q, ae]) => le(Q * xe, ae * xe));
    return ue.map(([Q, ae]) => {
      const te = Q / xe, ne = ae / xe, Y = ue.map(([ee, G]) => (1 + ee * te) * (1 + G * ne) / 4);
      return [
        0,
        1,
        2
      ].map((ee) => Y.reduce((G, C, N) => G + C * be[N][ee], 0));
    });
  };
  function Zi(t, c, m, g, b, A = {}) {
    const P = Ya(t, c, m, g, b, A);
    if (!P) return null;
    const k = P.K, v = [
      [
        k[12][12],
        k[12][13]
      ],
      [
        k[13][12],
        k[13][13]
      ]
    ], S = v[0][0] * v[1][1] - v[0][1] * v[1][0], E = k.slice(0, 12).map((B) => B.slice(0, 12));
    if (Math.abs(S) > 1e-30) {
      const B = [
        [
          v[1][1] / S,
          -v[0][1] / S
        ],
        [
          -v[1][0] / S,
          v[0][0] / S
        ]
      ];
      for (let se = 0; se < 12; se++) for (let V = 0; V < 12; V++) {
        let ie = 0;
        for (let J = 0; J < 2; J++) for (let R = 0; R < 2; R++) ie += k[se][12 + J] * B[J][R] * k[12 + R][V];
        E[se][V] -= ie;
      }
    }
    return E;
  }
  const Fs = (t, c) => [
    t[1] * c[2] - t[2] * c[1],
    t[2] * c[0] - t[0] * c[2],
    t[0] * c[1] - t[1] * c[0]
  ], Wo = (t) => {
    const c = Math.hypot(t[0], t[1], t[2]) || 1;
    return [
      t[0] / c,
      t[1] / c,
      t[2] / c
    ];
  };
  qi = function(t) {
    const c = [
      t[1][0] - t[0][0],
      t[1][1] - t[0][1],
      t[1][2] - t[0][2]
    ], m = [
      t[2][0] - t[3][0],
      t[2][1] - t[3][1],
      t[2][2] - t[3][2]
    ], g = [
      t[2][0] - t[0][0],
      t[2][1] - t[0][1],
      t[2][2] - t[0][2]
    ], b = [
      t[3][0] - t[1][0],
      t[3][1] - t[1][1],
      t[3][2] - t[1][2]
    ];
    let A = Wo([
      c[0] + m[0],
      c[1] + m[1],
      c[2] + m[2]
    ]);
    const P = Wo(Fs(g, b)), k = Wo(Fs(P, A));
    A = Wo(Fs(k, P));
    const v = [
      0,
      1,
      2
    ].map((B) => (t[0][B] + t[1][B] + t[2][B] + t[3][B]) / 4), S = [], E = [];
    for (let B = 0; B < 4; B++) {
      const se = [
        t[B][0] - v[0],
        t[B][1] - v[1],
        t[B][2] - v[2]
      ];
      S.push(se[0] * A[0] + se[1] * A[1] + se[2] * A[2]), E.push(se[0] * k[0] + se[1] * k[1] + se[2] * k[2]);
    }
    return {
      ex: A,
      ey: k,
      ez: P,
      xl: S,
      yl: E
    };
  };
  Ki = function(t, c, m, g, b) {
    const A = m * b * b * b / (12 * (1 - g * g)), P = [
      [
        A,
        A * g,
        0
      ],
      [
        A * g,
        A,
        0
      ],
      [
        0,
        0,
        A * (1 - g) / 2
      ]
    ], k = 1 / Math.sqrt(3), v = Array.from({
      length: 12
    }, () => new Array(12).fill(0));
    for (const S of [
      -k,
      k
    ]) for (const E of [
      -k,
      k
    ]) {
      const B = Na(t, c, S, E), se = [
        -(1 - E) / 4,
        (1 - E) / 4,
        (1 + E) / 4,
        -(1 + E) / 4
      ], V = [
        -(1 - S) / 4,
        -(1 + S) / 4,
        (1 + S) / 4,
        (1 - S) / 4
      ];
      let ie = 0, J = 0, R = 0, le = 0;
      for (let xe = 0; xe < 4; xe++) ie += se[xe] * t[xe], J += se[xe] * c[xe], R += V[xe] * t[xe], le += V[xe] * c[xe];
      const ue = Math.abs(ie * le - J * R);
      for (let xe = 0; xe < 12; xe++) for (let be = 0; be < 12; be++) {
        let Q = 0;
        for (let ae = 0; ae < 3; ae++) for (let te = 0; te < 3; te++) Q += B[ae][xe] * P[ae][te] * B[te][be];
        v[xe][be] += Q * ue;
      }
    }
    return v;
  };
  Pa = function(t, c, m, g, b = {}) {
    if (t.length !== 4) throw new Error("La K de pa\xF1o de esta pantalla es la del Q4: hacen falta 4 nudos.");
    const A = b.tipoPlaca ?? 0, P = b.tipoDrill ?? 12, { ex: k, ey: v, ez: S, xl: E, yl: B } = qi(t), se = A === 1 ? Ki(E, B, c, m, g) : Ni(E, B, c, m, g), V = Zi(E, B, c, m, g, {
      tipo: P,
      gammaFac: b.gammaFac,
      mod: b.mod
    });
    let ie = 0;
    for (let J = 0; J < 4; J++) {
      const R = (J + 1) % 4;
      ie += E[J] * B[R] - E[R] * B[J];
    }
    return {
      flexion: se,
      membrana: V,
      xl: E,
      yl: B,
      ex: k,
      ey: v,
      ez: S,
      area: Math.abs(ie) / 2,
      formulacion: (A === 1 ? "Shell-Thin (DKQ, Batoz-Tahar)" : "Shell-Thick de CSI") + " + membrana " + (P === 12 ? "ITW tipo 12 (la de CSI)" : "ITW tipo " + P)
    };
  };
  class Xa {
    constructor(c, m = 32) {
      this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(c, m);
    }
    set(c) {
      return c.isLut === true && this.copy(c), this;
    }
    setMin(c) {
      return this.minV = c, this;
    }
    setMax(c) {
      return this.maxV = c, this;
    }
    setColorMap(c, m = 32) {
      this.map = Es[c] || Es.rainbow, this.n = m;
      const g = 1 / this.n, b = new pn(), A = new pn();
      this.lut.length = 0, this.lut.push(new pn(this.map[0][1]));
      for (let P = 1; P < m; P++) {
        const k = P * g;
        for (let v = 0; v < this.map.length - 1; v++) if (k > this.map[v][0] && k <= this.map[v + 1][0]) {
          const S = this.map[v][0], E = this.map[v + 1][0];
          b.setHex(this.map[v][1], Go), A.setHex(this.map[v + 1][1], Go);
          const B = new pn().lerpColors(b, A, (k - S) / (E - S));
          this.lut.push(B);
        }
      }
      return this.lut.push(new pn(this.map[this.map.length - 1][1])), this;
    }
    copy(c) {
      return this.lut = c.lut, this.map = c.map, this.n = c.n, this.minV = c.minV, this.maxV = c.maxV, this;
    }
    getColor(c) {
      c = ki.clamp(c, this.minV, this.maxV), c = (c - this.minV) / (this.maxV - this.minV);
      const m = Math.round(c * this.n);
      return this.lut[m];
    }
    addColorMap(c, m) {
      return Es[c] = m, this;
    }
    createCanvas() {
      const c = document.createElement("canvas");
      return c.width = 1, c.height = this.n, this.updateCanvas(c), c;
    }
    updateCanvas(c) {
      const m = c.getContext("2d", {
        alpha: false
      }), g = m.getImageData(0, 0, 1, this.n), b = g.data;
      let A = 0;
      const P = 1 / this.n, k = new pn(), v = new pn(), S = new pn();
      for (let E = 1; E >= 0; E -= P) for (let B = this.map.length - 1; B >= 0; B--) if (E < this.map[B][0] && E >= this.map[B - 1][0]) {
        const se = this.map[B - 1][0], V = this.map[B][0];
        k.setHex(this.map[B - 1][1], Go), v.setHex(this.map[B][1], Go), S.lerpColors(k, v, (E - se) / (V - se)), b[A * 4] = Math.round(S.r * 255), b[A * 4 + 1] = Math.round(S.g * 255), b[A * 4 + 2] = Math.round(S.b * 255), b[A * 4 + 3] = 255, A += 1;
      }
      return m.putImageData(g, 0, 0), c;
    }
  }
  const Es = {
    rainbow: [
      [
        0,
        255
      ],
      [
        0.2,
        65535
      ],
      [
        0.5,
        65280
      ],
      [
        0.8,
        16776960
      ],
      [
        1,
        16711680
      ]
    ],
    cooltowarm: [
      [
        0,
        3952322
      ],
      [
        0.2,
        10206463
      ],
      [
        0.5,
        14474460
      ],
      [
        0.8,
        16163717
      ],
      [
        1,
        11797542
      ]
    ],
    blackbody: [
      [
        0,
        0
      ],
      [
        0.2,
        7864320
      ],
      [
        0.5,
        15086080
      ],
      [
        0.8,
        16776960
      ],
      [
        1,
        16777215
      ]
    ],
    grayscale: [
      [
        0,
        0
      ],
      [
        0.2,
        4210752
      ],
      [
        0.5,
        8355712
      ],
      [
        0.8,
        12566463
      ],
      [
        1,
        16777215
      ]
    ]
  }, Ua = [
    [
      0,
      255,
      0,
      255
    ],
    [
      0.077,
      255,
      0,
      180
    ],
    [
      0.154,
      255,
      0,
      0
    ],
    [
      0.231,
      255,
      80,
      0
    ],
    [
      0.308,
      255,
      140,
      0
    ],
    [
      0.385,
      255,
      190,
      0
    ],
    [
      0.462,
      255,
      255,
      0
    ],
    [
      0.538,
      180,
      255,
      0
    ],
    [
      0.615,
      0,
      255,
      0
    ],
    [
      0.692,
      0,
      255,
      180
    ],
    [
      0.769,
      0,
      255,
      255
    ],
    [
      0.846,
      0,
      180,
      255
    ],
    [
      0.923,
      0,
      0,
      255
    ],
    [
      1,
      0,
      0,
      180
    ]
  ], Gi = {
    safe: [
      [
        0,
        224,
        13,
        107
      ],
      [
        0.13,
        221,
        20,
        50
      ],
      [
        0.27,
        252,
        99,
        39
      ],
      [
        0.4,
        254,
        161,
        47
      ],
      [
        0.52,
        238,
        234,
        25
      ],
      [
        0.64,
        5,
        193,
        69
      ],
      [
        0.78,
        7,
        178,
        244
      ],
      [
        0.9,
        4,
        132,
        213
      ],
      [
        1,
        90,
        175,
        230
      ]
    ],
    csi: Ua,
    jet_r: [
      [
        0,
        200,
        0,
        0
      ],
      [
        0.15,
        255,
        80,
        0
      ],
      [
        0.32,
        255,
        200,
        0
      ],
      [
        0.48,
        180,
        255,
        0
      ],
      [
        0.6,
        0,
        230,
        90
      ],
      [
        0.74,
        0,
        220,
        230
      ],
      [
        0.88,
        0,
        110,
        255
      ],
      [
        1,
        0,
        0,
        180
      ]
    ],
    jet: [
      [
        0,
        0,
        0,
        180
      ],
      [
        0.12,
        0,
        110,
        255
      ],
      [
        0.26,
        0,
        220,
        230
      ],
      [
        0.4,
        0,
        230,
        90
      ],
      [
        0.52,
        180,
        255,
        0
      ],
      [
        0.68,
        255,
        200,
        0
      ],
      [
        0.85,
        255,
        80,
        0
      ],
      [
        1,
        200,
        0,
        0
      ]
    ],
    viridis: [
      [
        0,
        68,
        1,
        84
      ],
      [
        0.25,
        59,
        82,
        139
      ],
      [
        0.5,
        33,
        145,
        140
      ],
      [
        0.75,
        94,
        201,
        98
      ],
      [
        1,
        253,
        231,
        37
      ]
    ]
  }, ss = ve.state("safe"), Za = ve.state("auto");
  function qa(t) {
    t = Math.max(0, Math.min(1, t));
    const c = Gi[ss.val] ?? Ua;
    for (let g = 0; g < c.length - 1; g++) {
      const [b, A, P, k] = c[g], [v, S, E, B] = c[g + 1];
      if (t <= v) {
        const se = (t - b) / (v - b);
        return [
          A + (S - A) * se,
          P + (E - P) * se,
          k + (B - k) * se
        ];
      }
    }
    const m = c[c.length - 1];
    return [
      m[1],
      m[2],
      m[3]
    ];
  }
  function za() {
    const c = new Uint8Array(1024);
    for (let g = 0; g < 256; g++) {
      const b = g / 255, [A, P, k] = qa(b);
      c[g * 4 + 0] = A, c[g * 4 + 1] = P, c[g * 4 + 2] = k, c[g * 4 + 3] = 255;
    }
    const m = new zi(c, 256, 1, Ai);
    return m.minFilter = ya, m.magFilter = ya, m.wrapS = xa, m.wrapT = xa, m.needsUpdate = true, m;
  }
  function Hi() {
    const c = [];
    for (let m = 0; m <= 12; m++) {
      const g = 1 - m / 12, [b, A, P] = qa(g);
      c.push(`rgb(${b | 0},${A | 0},${P | 0}) ${(m / 12 * 100).toFixed(0)}%`);
    }
    return `linear-gradient(${c.join(",")})`;
  }
  function Bs(t) {
    if (!t.length) return [
      0,
      1
    ];
    const c = [
      ...t
    ].sort((A, P) => A - P), m = (A) => c[Math.min(c.length - 1, Math.max(0, Math.round(A * (c.length - 1))))];
    let g = c.length >= 20 ? m(0.01) : c[0], b = c.length >= 20 ? m(0.99) : c[c.length - 1];
    return g >= 0 && b > 0 && (g = 0), b <= 0 && g < 0 && (b = 0), [
      g,
      b
    ];
  }
  Wi = function(t, c, m) {
    new Xa();
    const g = za(), b = new Si({
      uniforms: {
        cmap: {
          value: g
        },
        ambient: {
          value: 0.95
        }
      },
      vertexShader: `
      #include <common>
      #include <clipping_planes_pars_vertex>
      attribute float scalar;
      varying float vScalar;
      void main() {
        vScalar = scalar;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <clipping_planes_vertex>
      }
    `,
      fragmentShader: `
      #include <common>
      #include <clipping_planes_pars_fragment>
      uniform sampler2D cmap;
      uniform float ambient;
      varying float vScalar;
      void main() {
        #include <clipping_planes_fragment>
        // Si NaN (vScalar < -0.5 sentinel), gris neutro
        if (vScalar < -0.5) {
          gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
          return;
        }
        vec3 color = texture2D(cmap, vec2(clamp(vScalar, 0.0, 1.0), 0.5)).rgb;
        gl_FragColor = vec4(color * ambient, 1.0);
      }
    `,
      side: It,
      transparent: false,
      clipping: true,
      depthWrite: true,
      depthTest: true
    });
    ve.derive(() => {
      var _a2;
      ss.val;
      const P = b.uniforms.cmap.value;
      b.uniforms.cmap.value = za(), (_a2 = P == null ? void 0 : P.dispose) == null ? void 0 : _a2.call(P);
    });
    const A = new ut(new De(), b);
    return A.renderOrder = -1, A.frustumCulled = false, A.userData.isShellArea = true, A.name = "__hekatan_shell_colormap", ve.derive(() => {
      A.geometry.setAttribute("position", new Tt(t.val.flat(), 3));
      const P = [], k = [], v = [];
      c.val.forEach((ue, xe) => {
        ue.length === 3 ? (P.push(ue[0], ue[1], ue[2]), k.push(xe), v.push(0)) : ue.length === 4 && (P.push(ue[0], ue[1], ue[2]), P.push(ue[0], ue[2], ue[3]), k.push(xe, xe), v.push(0, 1));
      }), A.geometry.setIndex(new Pi(P, 1)), A.userData.faceToElem = k, A.userData.faceLocal = v;
      const S = m.val.filter((ue) => Number.isFinite(ue));
      let E, B;
      const se = zo.val;
      if (se ? (B = se[0], E = se[1]) : [B, E] = Bs(S), E === B) {
        const ue = Math.max(Math.abs(E) * 1e-6, 1e-9);
        E += ue, B -= ue;
      }
      const V = se && se[0] > se[1], ie = Math.min(B, E), J = Math.max(B, E), R = J - ie, le = new Float32Array(m.val.length);
      for (let ue = 0; ue < m.val.length; ue++) {
        const xe = m.val[ue];
        if (!Number.isFinite(xe)) {
          le[ue] = -1;
          continue;
        }
        const Q = ((V ? J + ie - xe : xe) - ie) / R;
        le[ue] = Math.max(0, Math.min(1, Q));
      }
      A.geometry.setAttribute("scalar", new bt(le, 1));
    }), A;
  };
  function Ji(t, c, m) {
    const g = document.createElement("div"), b = new Ba({
      title: "Settings",
      expanded: true,
      container: g
    });
    window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(b), g.setAttribute("id", "settings");
    const A = "hk_settingsPos";
    let P = null;
    try {
      const V = localStorage.getItem(A);
      V && (P = JSON.parse(V));
    } catch {
    }
    g.style.cssText = [
      "position:fixed",
      P ? `left:${P.left}px` : "left:8px",
      P ? `top:${P.top}px` : "top:8px",
      "z-index:50",
      "max-height:calc(100vh - 32px)",
      "overflow-y:auto",
      "box-shadow:0 4px 16px rgba(0,0,0,0.35)",
      "border-radius:6px"
    ].join(";") + ";";
    const k = () => {
      const V = g.querySelector(".tp-rotv_b");
      if (!V) {
        setTimeout(k, 200);
        return;
      }
      V.style.cursor = "move", V.style.userSelect = "none";
      let ie = false, J = 0, R = 0, le = 0, ue = 0;
      V.addEventListener("mousedown", (xe) => {
        ie = true, J = xe.clientX, R = xe.clientY;
        const be = g.getBoundingClientRect();
        le = be.left, ue = be.top, g.style.left = `${le}px`, g.style.top = `${ue}px`;
      }), window.addEventListener("mousemove", (xe) => {
        if (!ie) return;
        const be = xe.clientX - J, Q = xe.clientY - R, ae = Math.max(0, Math.min(window.innerWidth - 40, le + be)), te = Math.max(0, Math.min(window.innerHeight - 40, ue + Q));
        g.style.left = `${ae}px`, g.style.top = `${te}px`;
      }), window.addEventListener("mouseup", () => {
        if (ie) {
          ie = false;
          try {
            localStorage.setItem(A, JSON.stringify({
              left: parseFloat(g.style.left),
              top: parseFloat(g.style.top)
            }));
          } catch {
          }
        }
      });
    };
    if (k(), c == null ? void 0 : c.nodes) {
      b.addBinding(t.displayScale, "val", {
        label: "Display scale",
        min: -10,
        max: 10,
        step: 0.5
      });
      const V = b.addFolder({
        title: "\u{1F4D0} Grid",
        expanded: false
      });
      V.addBinding(t.gridVisible, "val", {
        label: "Mostrar la rejilla"
      }), V.addBinding(t.gridXY, "val", {
        label: "Plano XY (planta)"
      }), V.addBinding(t.gridXZ, "val", {
        label: "Plano XZ (frontal)"
      }), V.addBinding(t.gridYZ, "val", {
        label: "Plano YZ (lateral)"
      });
      const ie = V.addFolder({
        title: "\u2699 Ajuste fino",
        expanded: false
      });
      ie.addBinding(t.gridSize, "val", {
        label: "Dimensi\xF3n (m)",
        min: 1,
        max: 100,
        step: 1
      }), ie.addBinding(t.gridStep, "val", {
        label: "Separaci\xF3n (m)",
        min: 0.05,
        max: 5,
        step: 0.05
      }), ie.addBinding(t.gridMajor, "val", {
        label: "Separaci\xF3n mayores (m)",
        min: 0.1,
        max: 50,
        step: 0.1
      }), ie.addBinding(t.cursorSnap, "val", {
        label: "Paso cursor con F9 (m)",
        min: 0.05,
        max: 5,
        step: 0.05
      }), ie.addBinding(t.gridOpacity, "val", {
        label: "Opacidad",
        min: 0,
        max: 1,
        step: 0.05
      });
      const J = b.addFolder({
        title: "\u{1F441} Ver",
        expanded: false
      });
      J.addBinding(t.nodes, "val", {
        label: "Nodes"
      }), J.addBinding(t.elements, "val", {
        label: "Elements"
      }), J.addBinding(t.edges, "val", {
        label: "  Edges (delim.)"
      }), J.addBinding(t.faces, "val", {
        label: "  Caras (fill)"
      }), J.addBinding(t.elemFrames, "val", {
        label: "  Frames (todos)"
      }), J.addBinding(t.elemColumns, "val", {
        label: "    Columnas"
      }), J.addBinding(t.elemBeams, "val", {
        label: "    Vigas"
      }), J.addBinding(t.elemZapatas, "val", {
        label: "  Zapatas (shells z\u22640)"
      }), J.addBinding(t.elemLosas, "val", {
        label: "  Losas (shells z>0)"
      }), J.addBinding(t.colorByType, "val", {
        label: "  \u{1F3A8} Color por tipo"
      }), J.addBinding(t.nodesIndexes, "val", {
        label: "Nodes indexes"
      }), J.addBinding(t.elementsIndexes, "val", {
        label: "Elements indexes"
      }), J.addBinding(t.orientations, "val", {
        label: "Orientations"
      }), J.addBinding(t.sections, "val", {
        label: "Sections"
      }), J.addBinding(t.extruded, "val", {
        label: "Extruido (3D)"
      }), J.addBinding(t.sectionLabels, "val", {
        label: "  Sec. Labels (30x50)"
      }), J.addBinding(t.secColumns, "val", {
        label: "  Sec. Columnas"
      }), J.addBinding(t.secBeams, "val", {
        label: "  Sec. Vigas"
      }), J.addBinding(t.secFloor, "val", {
        label: "  Sec. Piso",
        options: {
          Todos: -1,
          "Piso 1": 0,
          "Piso 2": 1,
          "Piso 3": 2,
          "Piso 4": 3,
          "Piso 5": 4
        }
      });
    }
    if ((c == null ? void 0 : c.nodeInputs) || (c == null ? void 0 : c.elementInputs)) {
      const V = b.addFolder({
        title: "\u{1F4CC} Analysis Inputs",
        expanded: false
      });
      V.addBinding(t.supports, "val", {
        label: "Supports"
      }), V.addBinding(t.loads, "val", {
        label: "Loads"
      }), V.addBinding(t.custom3D, "val", {
        label: "Resortes (Winkler)"
      }), V.addBinding(t.showCotas, "val", {
        label: "Cotas"
      });
    }
    if ((c == null ? void 0 : c.deformOutputs) || (c == null ? void 0 : c.analyzeOutputs)) {
      const V = b.addFolder({
        title: "\u{1F52C} Analyze",
        expanded: true
      });
      window.__hekatanOutputsFolder = V, V.addBinding(t.nodeResults, "val", {
        options: {
          none: "none",
          "U (deformations)": "deformations",
          "R (reactions)": "reactions"
        },
        label: "Node results"
      }), V.addBinding(t.frameResults, "val", {
        options: {
          none: "none",
          "Axial Force": "normals",
          Torsion: "torsions",
          "Shear 2-2": "shearsY",
          "Shear 3-3": "shearsZ",
          "Moment 2-2": "bendingsY",
          "Moment 3-3": "bendingsZ",
          "Axial Force (diagram)": "contour:normals",
          "Shear 2-2 (diagram)": "contour:shearsY",
          "Shear 3-3 (diagram)": "contour:shearsZ",
          "Torsion (diagram)": "contour:torsions",
          "Moment 2-2 (diagram)": "contour:bendingsY",
          "Moment 3-3 (diagram)": "contour:bendingsZ"
        },
        label: "Frame results"
      }), V.addButton({
        title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)"
      }).on("click", () => {
        var _a2;
        (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
      }), V.addButton({
        title: "\u{1F4C8} Gr\xE1fico de la barra designada"
      }).on("click", () => {
        var _a2;
        (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
      }), V.addBinding(t.shellResults, "val", {
        options: {
          none: "none",
          F11: "membraneXX",
          F22: "membraneYY",
          F12: "membraneXY",
          FMax: "membranePrincipalMax",
          FMin: "membranePrincipalMin",
          FVM: "vonMises",
          V13: "tranverseShearX",
          V23: "tranverseShearY",
          VMax: "transverseShearMax",
          M11: "bendingXX",
          M22: "bendingYY",
          M12: "bendingXY",
          MMax: "bendingPrincipalMax",
          MMin: "bendingPrincipalMin",
          "Pressure (suelo)": "pressure",
          Ux: "displacementX",
          Uy: "displacementY",
          Uz: "displacementZ"
        },
        label: "Shell results"
      }), V.addBinding(ss, "val", {
        options: {
          "SAFE (cimentaci\xF3n)": "safe",
          "ETABS / CSI (magenta\u2192azul)": "csi",
          "Jet_r (rojo\u2192azul)": "jet_r",
          "Jet (azul\u2192rojo)": "jet",
          Viridis: "viridis"
        },
        label: "\u{1F3A8} Paleta colores"
      }), V.addBinding(Za, "val", {
        options: {
          "todas las c\xE1scaras": "auto",
          "solo muros": "muros",
          "muros X (plano x=cte)": "murosX",
          "muros Y (plano y=cte)": "murosY",
          "solo losas": "losas"
        },
        label: "\u{1F4D0} Rango colormap"
      }), V.addBinding(t.solidResults, "val", {
        options: {
          none: "none",
          vonMises: "vonMises",
          \u03C3xx: "sigmaXX",
          \u03C3yy: "sigmaYY",
          \u03C3zz: "sigmaZZ",
          \u03C4xy: "tauXY",
          \u03C4yz: "tauYZ",
          \u03C4xz: "tauXZ",
          ux: "ux",
          uy: "uy",
          uz: "uz"
        },
        label: "Solid results"
      }), V.addBinding(t.deformedShape, "val", {
        label: "Deformed shape"
      }), V.addBinding(t.deformScale, "val", {
        label: "  Scale XY",
        min: 0.1,
        max: 5e3,
        step: 0.1
      }), V.addBinding(t.deformScaleZ, "val", {
        label: "  Scale Z",
        min: 0.01,
        max: 10,
        step: 0.01
      });
    }
    m && b.addBinding(t.solids, "val", {
      label: "Solids"
    });
    const v = b.addFolder({
      title: "\u2702\uFE0F Cortes X/Y/Z",
      expanded: false
    }), S = window.__hekatanClip ?? (window.__hekatanClip = {
      enableX: false,
      enableY: false,
      enableZ: false,
      posX: 0,
      posY: 0,
      posZ: 0,
      invertX: false,
      invertY: false,
      invertZ: false
    }), E = () => {
      const V = window.__hekatanClipApply;
      typeof V == "function" && V();
    };
    let B = [];
    const se = (V, ie) => {
      for (const R of B) try {
        R.dispose();
      } catch {
      }
      B = [];
      const J = (R, le) => {
        const ue = Math.floor(Math.min(V[le], -50)), xe = Math.ceil(Math.max(ie[le], 50)), be = xe - ue > 400 ? 0.5 : 0.1;
        return S["pos" + R] = Math.max(ue, Math.min(xe, S["pos" + R])), v.addBinding(S, "pos" + R, {
          min: ue,
          max: xe,
          step: be,
          label: `  pos ${R} (m)`
        }).on("change", E);
      };
      B.push(v.addBinding(S, "enableX", {
        label: "Cortar X"
      }).on("change", E), J("X", 0), v.addBinding(S, "invertX", {
        label: "  invertir X"
      }).on("change", E), v.addBinding(S, "enableY", {
        label: "Cortar Y"
      }).on("change", E), J("Y", 1), v.addBinding(S, "invertY", {
        label: "  invertir Y"
      }).on("change", E), v.addBinding(S, "enableZ", {
        label: "Cortar Z"
      }).on("change", E), J("Z", 2), v.addBinding(S, "invertZ", {
        label: "  invertir Z"
      }).on("change", E));
    };
    return se([
      -50,
      -50,
      -50
    ], [
      50,
      50,
      50
    ]), window.__hekatanClipRango = (V, ie) => {
      se(V, ie);
    }, g;
  }
  function Qi(t) {
    return {
      gridSize: ve.state((t == null ? void 0 : t.gridSize) ?? 30),
      gridVisible: ve.state((t == null ? void 0 : t.gridVisible) ?? true),
      gridOpacity: ve.state((t == null ? void 0 : t.gridOpacity) ?? 1),
      gridStep: ve.state((t == null ? void 0 : t.gridStep) ?? 1),
      gridMajor: ve.state((t == null ? void 0 : t.gridMajor) ?? 5),
      cursorSnap: ve.state((t == null ? void 0 : t.cursorSnap) ?? 0.5),
      gridXY: ve.state((t == null ? void 0 : t.gridXY) ?? true),
      gridXZ: ve.state((t == null ? void 0 : t.gridXZ) ?? false),
      gridYZ: ve.state((t == null ? void 0 : t.gridYZ) ?? false),
      displayScale: ve.state((t == null ? void 0 : t.displayScale) ?? 1),
      nodes: ve.state((t == null ? void 0 : t.nodes) ?? true),
      elements: ve.state((t == null ? void 0 : t.elements) ?? true),
      edges: ve.state((t == null ? void 0 : t.edges) ?? true),
      faces: ve.state((t == null ? void 0 : t.faces) ?? true),
      elemColumns: ve.state((t == null ? void 0 : t.elemColumns) ?? true),
      elemBeams: ve.state((t == null ? void 0 : t.elemBeams) ?? true),
      elemFrames: ve.state((t == null ? void 0 : t.elemFrames) ?? true),
      elemZapatas: ve.state((t == null ? void 0 : t.elemZapatas) ?? true),
      elemLosas: ve.state((t == null ? void 0 : t.elemLosas) ?? true),
      colorByType: ve.state((t == null ? void 0 : t.colorByType) ?? false),
      nodesIndexes: ve.state((t == null ? void 0 : t.nodesIndexes) ?? false),
      elementsIndexes: ve.state((t == null ? void 0 : t.elementsIndexes) ?? false),
      orientations: ve.state((t == null ? void 0 : t.orientations) ?? false),
      sections: ve.state((t == null ? void 0 : t.sections) ?? true),
      extruded: ve.state((t == null ? void 0 : t.extruded) ?? false),
      sectionLabels: ve.state((t == null ? void 0 : t.sectionLabels) ?? true),
      secColumns: ve.state((t == null ? void 0 : t.secColumns) ?? true),
      secBeams: ve.state((t == null ? void 0 : t.secBeams) ?? true),
      secFloor: ve.state((t == null ? void 0 : t.secFloor) ?? -1),
      supports: ve.state((t == null ? void 0 : t.supports) ?? true),
      loads: ve.state((t == null ? void 0 : t.loads) ?? false),
      deformedShape: ve.state((t == null ? void 0 : t.deformedShape) ?? false),
      nodeResults: ve.state((t == null ? void 0 : t.nodeResults) ?? "none"),
      frameResults: ve.state((t == null ? void 0 : t.frameResults) ?? "none"),
      shellResults: ve.state((t == null ? void 0 : t.shellResults) ?? "none"),
      solidResults: ve.state((t == null ? void 0 : t.solidResults) ?? "none"),
      flipAxes: ve.state((t == null ? void 0 : t.flipAxes) ?? false),
      solids: ve.state((t == null ? void 0 : t.solids) ?? true),
      custom3D: ve.state((t == null ? void 0 : t.custom3D) ?? true),
      showCotas: ve.state((t == null ? void 0 : t.showCotas) ?? true),
      deformScale: ve.state((t == null ? void 0 : t.deformScale) ?? 1),
      deformScaleZ: ve.state((t == null ? void 0 : t.deformScaleZ) ?? 1)
    };
  }
  function Oi(t, c, m) {
    const g = Jn(), b = new Oo(new De(), new jo({
      color: g.nodePoint
    }));
    return Ia((A, P) => {
      b.material.color.setHex(P.nodePoint);
    }), b.frustumCulled = false, ve.derive(() => {
      t.nodes.val && b.geometry.setAttribute("position", new Tt(c.val.flat(), 3));
    }), ve.derive(() => {
      if (m.val, c.val, !t.nodes.rawVal) return;
      const A = c.rawVal ?? [];
      let P = t.gridSize.val * 0.5;
      if (A.length >= 2) {
        const v = [
          1 / 0,
          1 / 0,
          1 / 0
        ], S = [
          -1 / 0,
          -1 / 0,
          -1 / 0
        ];
        for (const E of A) for (let B = 0; B < 3; B++) v[B] = Math.min(v[B], E[B]), S[B] = Math.max(S[B], E[B]);
        P = Math.max(S[0] - v[0], S[1] - v[1], S[2] - v[2], 0.1);
      }
      const k = 0.03 * P;
      b.material.size = k * m.rawVal;
    }), ve.derive(() => {
      b.visible = t.nodes.val;
    }), b;
  }
  function $s(t, c) {
    const m = Jn(), g = new ft();
    g.name = "hekatan-grid";
    const b = (c == null ? void 0 : c.planes) ?? [
      "xy"
    ];
    let A = (c == null ? void 0 : c.majorStep) ?? 1, P = (c == null ? void 0 : c.minorStep) ?? 0.1;
    for (A <= 0 && (A = 1), P <= 0 && (P = 0.1); t / P > 500; ) P *= 2;
    for (; t / A > 100; ) A *= 2;
    const k = t / 2;
    A = Math.max(P, Math.round(A / P) * P);
    const S = new pn(m.grid).multiplyScalar(1.3), E = new pn(m.grid).multiplyScalar(0.8), B = (J, R, le, ue) => {
      const xe = [], be = J === "xy" ? (Y, ee) => [
        Y,
        ee,
        0
      ] : J === "xz" ? (Y, ee) => [
        Y,
        0,
        ee
      ] : (Y, ee) => [
        0,
        Y,
        ee
      ], Q = Math.floor(k / R);
      for (let Y = -Q; Y <= Q; Y++) {
        const ee = Y * R, G = be(ee, -k), C = be(ee, k);
        xe.push(...G, ...C);
      }
      for (let Y = -Q; Y <= Q; Y++) {
        const ee = Y * R, G = be(-k, ee), C = be(k, ee);
        xe.push(...G, ...C);
      }
      const ae = new De();
      ae.setAttribute("position", new Tt(xe, 3));
      const te = new mt({
        color: le,
        transparent: true,
        opacity: ue,
        depthWrite: false
      }), ne = new an(ae, te);
      return ne.name = `grid-${J}-${R === P ? "minor" : "major"}`, ne;
    }, se = (J, R, le) => {
      const ue = J === "xy" ? (ne, Y) => [
        ne,
        Y,
        0
      ] : J === "xz" ? (ne, Y) => [
        ne,
        0,
        Y
      ] : (ne, Y) => [
        0,
        ne,
        Y
      ], xe = [
        [
          -k,
          -k
        ],
        [
          k,
          -k
        ],
        [
          k,
          k
        ],
        [
          -k,
          k
        ]
      ], be = [];
      for (const [ne, Y] of xe) be.push(...ue(ne, Y));
      const Q = new De();
      Q.setAttribute("position", new Tt(be, 3));
      const ae = new mt({
        color: R,
        transparent: true,
        opacity: le,
        depthWrite: false
      }), te = new Ta(Q, ae);
      return te.name = `grid-${J}-border`, te.renderOrder = 1, te;
    }, V = (J, R, le) => {
      const ue = J === "xy" ? (ae, te) => [
        ae,
        te,
        0
      ] : J === "xz" ? (ae, te) => [
        ae,
        0,
        te
      ] : (ae, te) => [
        0,
        ae,
        te
      ], xe = R === "u" ? [
        ...ue(-k, 0),
        ...ue(k, 0)
      ] : [
        ...ue(0, -k),
        ...ue(0, k)
      ], be = new De();
      be.setAttribute("position", new Tt(xe, 3));
      const Q = new an(be, new mt({
        color: le,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
      }));
      return Q.name = `grid-${J}-eje-${R}`, Q.renderOrder = 1, Q;
    }, ie = {
      xy: [
        14042459,
        5155178
      ],
      xz: [
        14042459,
        4882390
      ],
      yz: [
        5155178,
        4882390
      ]
    };
    for (const J of b) {
      g.add(B(J, P, E, 0.12)), g.add(B(J, A, S, 0.4));
      const [R, le] = ie[J];
      g.add(V(J, "u", R)), g.add(V(J, "v", le)), g.add(se(J, S, 0.55));
    }
    return g.position.set(0, 0, 0), window.__hekatanGridConfig = {
      majorStep: A,
      minorStep: P,
      gridSize: t,
      planes: [
        ...b
      ]
    }, g;
  }
  function ji(t, c, m, g) {
    const b = new ft(), A = new Ci(0.5, 0.5, 0.5), P = new Fi(0.45, 0.7, 4);
    P.rotateX(Math.PI / 2), P.translate(0, 0, -0.35);
    const k = new gt({
      color: 10166822
    }), v = new gt({
      color: 2792847
    }), S = new gt({
      color: 3835647
    }), E = () => {
      const V = m.rawVal ?? [];
      if (V.length < 2) return c.gridSize.val * 0.5;
      let ie = [
        1 / 0,
        1 / 0,
        1 / 0
      ], J = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const R of V) for (let le = 0; le < 3; le++) R[le] < ie[le] && (ie[le] = R[le]), R[le] > J[le] && (J[le] = R[le]);
      return Math.max(J[0] - ie[0], J[1] - ie[1], J[2] - ie[2], 0.1);
    }, B = () => 0.08 * E(), se = () => g.rawVal;
    return ve.derive(() => {
      var _a2, _b;
      if (c.deformedShape.val, !c.supports.val) return;
      b.clear();
      const V = B();
      (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((ie, J) => {
        const R = m.val[J];
        if (!R) return;
        const le = ie ?? [], ue = (le[0] ? 1 : 0) + (le[1] ? 1 : 0) + (le[2] ? 1 : 0), xe = (le[3] ? 1 : 0) + (le[4] ? 1 : 0) + (le[5] ? 1 : 0);
        let be;
        ue >= 3 && xe >= 3 ? be = new ut(A, k) : ue >= 3 && xe === 0 ? be = new ut(P, v) : be = new ut(P, S), be.position.set(R[0], R[1], R[2]);
        const Q = V * se();
        be.scale.set(Q, Q, Q), b.add(be);
      });
    }), ve.derive(() => {
      if (g.val, !c.supports.rawVal) return;
      const ie = B() * se();
      b.children.forEach((J) => J.scale.set(ie, ie, ie));
    }), ve.derive(() => {
      b.visible = c.supports.val;
    }), b;
  }
  function el(t, c, m, g) {
    const b = new ft();
    b.name = "loadsGroup";
    function A(k) {
      if (k.length < 2) return 0.12 * c.gridSize.rawVal;
      const v = [
        1 / 0,
        1 / 0,
        1 / 0
      ], S = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const B of k) for (let se = 0; se < 3; se++) v[se] = Math.min(v[se], B[se]), S[se] = Math.max(S[se], B[se]);
      return 0.08 * Math.max(S[0] - v[0], S[1] - v[1], S[2] - v[2], 0.1);
    }
    ve.derive(() => {
      var _a2, _b, _c;
      if (c.deformedShape.val, !c.loads.val) return;
      b.children.forEach((J) => {
        var _a3;
        return (_a3 = J.dispose) == null ? void 0 : _a3.call(J);
      }), b.clear();
      const k = m.val, v = A(k), S = 240, E = [];
      (_c = (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((J, R) => {
        k[R] && J.slice(0, 3).some((le) => Math.abs(le) > 1e-15) && E.push(R);
      });
      let B = E;
      if (E.length > S) {
        const J = E.map((C) => k[C][0]), R = E.map((C) => k[C][1]), le = Math.min(...J), ue = Math.max(...J), xe = Math.min(...R), be = Math.max(...R), Q = E.map((C) => k[C][2]), ae = Math.max(1e-6, (Math.max(...Q) - Math.min(...Q)) / 40), te = (C) => Math.round(C / ae), ne = new Set(Q.map(te)), Y = Math.max(4, Math.floor(S / Math.max(1, ne.size))), ee = Math.max(2, Math.round(Math.sqrt(Y))), G = /* @__PURE__ */ new Map();
        for (const C of E) {
          const N = ue - le < 1e-9 ? 0 : (k[C][0] - le) / (ue - le), H = be - xe < 1e-9 ? 0 : (k[C][1] - xe) / (be - xe), q = Math.min(ee - 1, Math.floor(N * ee)), oe = Math.min(ee - 1, Math.floor(H * ee)), D = `${q},${oe},${te(k[C][2])}`, de = Math.hypot(N * ee - (q + 0.5), H * ee - (oe + 0.5)), j = G.get(D);
          (!j || de < j.d) && G.set(D, {
            i: C,
            d: de
          });
        }
        B = [
          ...G.values()
        ].map((C) => C.i);
      }
      let se = 0;
      for (const J of B) {
        const R = t.nodeInputs.val.loads.get(J);
        for (let le = 0; le < 3; le++) se = Math.max(se, Math.abs(R[le]));
      }
      const V = B.length <= 60, ie = (J) => {
        const R = Math.abs(J);
        return R >= 100 ? J.toFixed(0) : R >= 10 ? J.toFixed(1) : J.toFixed(2);
      };
      for (const J of B) {
        const R = t.nodeInputs.val.loads.get(J), le = k[J];
        if (le) for (let ue = 0; ue < 3; ue++) {
          const xe = R[ue];
          if (!(Math.abs(xe) > 1e-9 * (se || 1))) continue;
          const be = new T(ue === 0 ? Math.sign(xe) : 0, ue === 1 ? Math.sign(xe) : 0, ue === 2 ? Math.sign(xe) : 0), Q = 0.45 + 0.55 * (se ? Math.abs(xe) / se : 1), ae = new Yn(be, new T(...le), 1, ue === 2 ? 15637248 : 15022123, 0.3, 0.3);
          if (ae.userData = {
            nudo: le,
            dir: be,
            rel: Q
          }, b.add(ae), V) {
            const te = new Bt(ie(xe), ue === 2 ? "#f5b642" : "#ff6b5e");
            te.userData = {
              nudo: le,
              dir: be,
              rel: Q,
              texto: true
            }, b.add(te);
          }
        }
      }
      P(v * g.rawVal);
    });
    function P(k) {
      b.children.forEach((v) => {
        const S = v.userData;
        if (!(S == null ? void 0 : S.dir)) return;
        const E = k * S.rel, B = new T(...S.nudo).addScaledVector(S.dir, -E * (S.texto ? 1.12 : 1));
        v.position.copy(B), S.texto ? v.updateScale(k * 0.38) : v.scale.set(E, E, E);
      });
    }
    return ve.derive(() => {
      g.val, c.loads.rawVal && P(A(m.rawVal) * g.rawVal);
    }), ve.derive(() => {
      b.visible = c.loads.val;
    }), b;
  }
  function tl(t, c, m) {
    const g = new ft();
    return ve.derive(() => {
      if (!t.nodesIndexes.val) return;
      g.children.forEach((A) => A.dispose()), g.clear();
      const b = 0.05 * t.gridSize.val * 0.6;
      c.val.forEach((A, P) => {
        const k = new Bt(`${P}`);
        k.position.set(...A), k.updateScale(b * m.rawVal), g.add(k);
      });
    }), ve.derive(() => {
      if (m.val, !t.nodesIndexes.rawVal) return;
      const b = 0.05 * t.gridSize.val * 0.6;
      g.children.forEach((A) => A.updateScale(b * m.rawVal));
    }), ve.derive(() => {
      g.visible = t.nodesIndexes.val;
    }), g;
  }
  function nl(t, c, m, g) {
    const b = new ft();
    return ve.derive(() => {
      var _a2;
      if (c.deformedShape.val, !c.elementsIndexes.val) return;
      b.children.forEach((P) => P.dispose()), b.clear();
      const A = 0.05 * c.gridSize.val * 0.6;
      (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((P, k) => {
        const v = new Bt(`${k}`, void 0, "#001219");
        v.position.set(...ol(P.map((S) => m.rawVal[S]))), v.updateScale(A * g.rawVal), b.add(v);
      });
    }), ve.derive(() => {
      if (g.val, !c.elementsIndexes.rawVal) return;
      const A = 0.05 * c.gridSize.val * 0.6;
      b.children.forEach((P) => P.updateScale(A * g.rawVal));
    }), ve.derive(() => {
      b.visible = c.elementsIndexes.val;
    }), b;
  }
  function ol(t) {
    const c = t.reduce((g, b) => [
      g[0] + b[0],
      g[1] + b[1],
      g[2] + b[2]
    ], [
      0,
      0,
      0
    ]), m = t.length;
    return [
      c[0] / m,
      c[1] / m,
      c[2] / m
    ];
  }
  function Aa(t, c) {
    const m = new ft(), g = Math.min(0.05 * t, 0.6), b = Jn(), A = new Bt("X", "red", "transparent"), P = new Bt(c ? "Z" : "Y", "green", "transparent"), k = new Bt(c ? "Y" : "Z", "blue", "transparent"), v = new Yn(new T(1, 0, 0), new T(0, 0, 0), 1, b.axisArrow, 0.2, 0.2), S = new Yn(new T(0, 1, 0), new T(0, 0, 0), 1, b.axisArrow, 0.2, 0.2), E = new Yn(new T(0, 0, 1), new T(0, 0, 0), 1, b.axisArrow, 0.2, 0.2);
    return A.position.set(1.3 * g, 0, 0), P.position.set(0, 1.3 * g, 0), k.position.set(0, 0, 1.3 * g), A.updateScale(0.4 * g), P.updateScale(0.4 * g), k.updateScale(0.4 * g), v.scale.set(g, g, g), S.scale.set(g, g, g), E.scale.set(g, g, g), m.add(v, S, E, A, P, k), m;
  }
  function ns(t, c) {
    const m = new T(...t), b = new T(...c).clone().sub(m), A = b.length(), P = b.dot(new T(1, 0, 0)) / A, k = b.dot(new T(0, 1, 0)) / A, v = b.dot(new T(0, 0, 1)) / A, S = Math.sqrt(P ** 2 + k ** 2);
    let E = new zs().fromArray([
      [
        P,
        k,
        v
      ],
      [
        -k / S,
        P / S,
        0
      ],
      [
        -P * v / S,
        -k * v / S,
        S
      ]
    ].flat());
    return v === 1 && (E = new zs().fromArray([
      [
        0,
        0,
        1
      ],
      [
        0,
        1,
        0
      ],
      [
        -1,
        0,
        0
      ]
    ].flat())), v === -1 && (E = new zs().fromArray([
      [
        0,
        0,
        -1
      ],
      [
        0,
        1,
        0
      ],
      [
        1,
        0,
        0
      ]
    ].flat())), new os().setFromMatrix3(E);
  }
  function Is(t, c) {
    return t == null ? void 0 : t.map((m, g) => (9 * m + c[g]) / 10);
  }
  function Po(t) {
    const c = t.reduce((g, b) => [
      g[0] + b[0],
      g[1] + b[1],
      g[2] + b[2]
    ], [
      0,
      0,
      0
    ]), m = t.length;
    return [
      c[0] / m,
      c[1] / m,
      c[2] / m
    ];
  }
  function sl(t, c, m) {
    const g = Po([
      c,
      m
    ]), b = Po([
      t,
      m
    ]), A = Po([
      t,
      c
    ]), P = new T(...g).sub(new T(...b)).normalize(), k = new T(...m).sub(new T(...A)).normalize(), v = P.clone().cross(k).normalize(), S = v.clone().cross(P).normalize();
    return new os().makeBasis(P, S, v);
  }
  function al(t, c, m, g) {
    const b = new ft(), A = new De(), P = new mt({
      vertexColors: true
    }), k = [
      0,
      0,
      0
    ], v = [
      1,
      0,
      0
    ], S = [
      0,
      1,
      0
    ], E = [
      0,
      0,
      1
    ];
    A.setAttribute("position", new Tt([
      ...k,
      ...v,
      ...k,
      ...S,
      ...k,
      ...E
    ], 3));
    const B = [
      255,
      0,
      0
    ], se = [
      0,
      255,
      0
    ], V = [
      0,
      0,
      255
    ];
    return A.setAttribute("color", new Tt([
      ...B,
      ...B,
      ...se,
      ...se,
      ...V,
      ...V
    ], 3)), ve.derive(() => {
      var _a2;
      c.deformedShape.val, c.orientations.val && (b.clear(), (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((ie) => {
        const J = new an(A, P), R = m.rawVal[ie[0]], le = m.rawVal[ie[1]];
        if (ie.length === 2 && (J.position.set(...Is(R, le)), J.rotation.setFromRotationMatrix(ns(R, le))), ie.length === 3) {
          const be = m.rawVal[ie[2]];
          J.position.set(...Po([
            R,
            le,
            be
          ])), J.rotation.setFromRotationMatrix(sl(R, le, be));
        }
        const xe = 0.05 * c.gridSize.rawVal * 0.75 * g.rawVal;
        J.scale.set(xe, xe, xe), b.add(J);
      }));
    }), ve.derive(() => {
      if (g.val, !c.orientations.rawVal) return;
      const J = 0.05 * c.gridSize.val * 0.75 * g.rawVal;
      b.children.forEach((R) => R.scale.set(J, J, J));
    }), ve.derive(() => {
      b.visible = c.orientations.val;
    }), b;
  }
  function il(t) {
    if (t.name) return t.name;
    if (t.type === "rect") {
      const c = (t.b * 100).toFixed(0), m = (t.h * 100).toFixed(0);
      return `${c}x${m}`;
    }
    return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
  }
  function ll(t, c, m, g) {
    const b = new ft(), A = new ft();
    b.add(A);
    function P(ae, te) {
      const ne = ae / 2, Y = te / 2, ee = new Float32Array([
        0,
        -ne,
        -Y,
        0,
        ne,
        -Y,
        0,
        ne,
        Y,
        0,
        -ne,
        -Y,
        0,
        ne,
        Y,
        0,
        -ne,
        Y
      ]), G = new De();
      G.setAttribute("position", new bt(ee, 3));
      const C = new Float32Array([
        0,
        -ne,
        -Y,
        0,
        ne,
        -Y,
        0,
        ne,
        Y,
        0,
        -ne,
        Y,
        0,
        -ne,
        -Y
      ]), N = new De();
      return N.setAttribute("position", new bt(C, 3)), {
        fill: G,
        outline: N
      };
    }
    function k(ae, te = 24) {
      const ne = ae / 2, Y = new Float32Array(te * 9);
      for (let N = 0; N < te; N++) {
        const H = N / te * Math.PI * 2, q = (N + 1) / te * Math.PI * 2;
        Y[N * 9] = 0, Y[N * 9 + 1] = 0, Y[N * 9 + 2] = 0, Y[N * 9 + 3] = 0, Y[N * 9 + 4] = ne * Math.cos(H), Y[N * 9 + 5] = ne * Math.sin(H), Y[N * 9 + 6] = 0, Y[N * 9 + 7] = ne * Math.cos(q), Y[N * 9 + 8] = ne * Math.sin(q);
      }
      const ee = new De();
      ee.setAttribute("position", new bt(Y, 3));
      const G = new Float32Array((te + 1) * 3);
      for (let N = 0; N <= te; N++) {
        const H = N / te * Math.PI * 2;
        G[N * 3] = 0, G[N * 3 + 1] = ne * Math.cos(H), G[N * 3 + 2] = ne * Math.sin(H);
      }
      const C = new De();
      return C.setAttribute("position", new bt(G, 3)), {
        fill: ee,
        outline: C
      };
    }
    function v(ae, te, ne, Y) {
      const ee = ne ?? te * 0.08, G = Y ?? ae * 0.07, C = ae / 2, N = te / 2, H = N - ee, q = G / 2, oe = [];
      function D(W, re, we, ze) {
        oe.push(0, W, re, 0, we, re, 0, we, ze, 0, W, re, 0, we, ze, 0, W, ze);
      }
      D(-C, -N, C, -H), D(-q, -H, q, H), D(-C, H, C, N);
      const de = new De();
      de.setAttribute("position", new bt(new Float32Array(oe), 3));
      const j = new Float32Array([
        0,
        -C,
        -N,
        0,
        C,
        -N,
        0,
        C,
        -H,
        0,
        q,
        -H,
        0,
        q,
        H,
        0,
        C,
        H,
        0,
        C,
        N,
        0,
        -C,
        N,
        0,
        -C,
        H,
        0,
        -q,
        H,
        0,
        -q,
        -H,
        0,
        -C,
        -H,
        0,
        -C,
        -N
      ]), O = new De();
      return O.setAttribute("position", new bt(j, 3)), {
        fill: de,
        outline: O
      };
    }
    function S(ae, te, ne) {
      const Y = ae / 2, ee = te / 2, G = Y - ne, C = ee - ne, N = [];
      function H(de, j, O, W) {
        N.push(0, de, j, 0, O, j, 0, O, W, 0, de, j, 0, O, W, 0, de, W);
      }
      H(-Y, -ee, Y, -C), H(-Y, C, Y, ee), H(-Y, -C, -G, C), H(G, -C, Y, C);
      const q = new De();
      q.setAttribute("position", new bt(new Float32Array(N), 3));
      const oe = new Float32Array([
        0,
        -Y,
        -ee,
        0,
        Y,
        -ee,
        0,
        Y,
        -ee,
        0,
        Y,
        ee,
        0,
        Y,
        ee,
        0,
        -Y,
        ee,
        0,
        -Y,
        ee,
        0,
        -Y,
        -ee,
        0,
        -G,
        -C,
        0,
        G,
        -C,
        0,
        G,
        -C,
        0,
        G,
        C,
        0,
        G,
        C,
        0,
        -G,
        C,
        0,
        -G,
        C,
        0,
        -G,
        -C
      ]), D = new De();
      return D.setAttribute("position", new bt(oe, 3)), {
        fill: q,
        outline: D
      };
    }
    function E(ae, te, ne) {
      const Y = ae / 2, ee = te / 2, G = Y - ne, C = ee - ne, N = new De(), H = new Float32Array([
        0,
        -G,
        -C,
        0,
        G,
        -C,
        0,
        G,
        C,
        0,
        -G,
        -C,
        0,
        G,
        C,
        0,
        -G,
        C
      ]);
      N.setAttribute("position", new bt(H, 3));
      const q = [];
      function oe(O, W, re, we) {
        q.push(0, O, W, 0, re, W, 0, re, we, 0, O, W, 0, re, we, 0, O, we);
      }
      oe(-Y, -ee, Y, -C), oe(-Y, C, Y, ee), oe(-Y, -C, -G, C), oe(G, -C, Y, C);
      const D = new De();
      D.setAttribute("position", new bt(new Float32Array(q), 3));
      const de = new Float32Array([
        0,
        -Y,
        -ee,
        0,
        Y,
        -ee,
        0,
        Y,
        -ee,
        0,
        Y,
        ee,
        0,
        Y,
        ee,
        0,
        -Y,
        ee,
        0,
        -Y,
        ee,
        0,
        -Y,
        -ee,
        0,
        -G,
        -C,
        0,
        G,
        -C,
        0,
        G,
        -C,
        0,
        G,
        C,
        0,
        G,
        C,
        0,
        -G,
        C,
        0,
        -G,
        C,
        0,
        -G,
        -C
      ]), j = new De();
      return j.setAttribute("position", new bt(de, 3)), {
        concFill: N,
        steelFillGeom: D,
        outline: j
      };
    }
    function B(ae, te, ne) {
      const Y = [], ee = [
        [
          0,
          -ae / 2,
          -te / 2
        ],
        [
          0,
          -ae / 2 + ne,
          -te / 2
        ],
        [
          0,
          -ae / 2 + ne,
          te / 2 - ne
        ],
        [
          0,
          ae / 2,
          te / 2 - ne
        ],
        [
          0,
          ae / 2,
          te / 2
        ],
        [
          0,
          -ae / 2,
          te / 2
        ]
      ], G = [
        0,
        1,
        2,
        0,
        2,
        5,
        2,
        3,
        4,
        2,
        4,
        5
      ];
      for (const q of G) Y.push(...ee[q]);
      const C = new De();
      C.setAttribute("position", new bt(new Float32Array(Y), 3));
      const N = [];
      for (let q = 0; q < ee.length; q++) {
        const oe = (q + 1) % ee.length;
        N.push(...ee[q], ...ee[oe]);
      }
      const H = new De();
      return H.setAttribute("position", new bt(new Float32Array(N), 3)), {
        fill: C,
        outline: H
      };
    }
    function se(ae, te, ne, Y) {
      const ee = Y / 2, G = [], C = [
        [
          0,
          -ae - ee,
          -te / 2
        ],
        [
          0,
          -ne - ee,
          -te / 2
        ],
        [
          0,
          -ne - ee,
          te / 2 - ne
        ],
        [
          0,
          -ee,
          te / 2 - ne
        ],
        [
          0,
          -ee,
          te / 2
        ],
        [
          0,
          -ae - ee,
          te / 2
        ]
      ], N = [
        [
          0,
          ee,
          -te / 2
        ],
        [
          0,
          ee + ne,
          -te / 2
        ],
        [
          0,
          ee + ne,
          te / 2 - ne
        ],
        [
          0,
          ae + ee,
          te / 2 - ne
        ],
        [
          0,
          ae + ee,
          te / 2
        ],
        [
          0,
          ee,
          te / 2
        ]
      ], H = [
        0,
        1,
        2,
        0,
        2,
        5,
        2,
        3,
        4,
        2,
        4,
        5
      ];
      for (const de of H) G.push(...C[de]);
      for (const de of H) G.push(...N[de]);
      const q = new De();
      q.setAttribute("position", new bt(new Float32Array(G), 3));
      const oe = [];
      for (const de of [
        C,
        N
      ]) for (let j = 0; j < de.length; j++) {
        const O = (j + 1) % de.length;
        oe.push(...de[j], ...de[O]);
      }
      const D = new De();
      return D.setAttribute("position", new bt(new Float32Array(oe), 3)), {
        fill: q,
        outline: D
      };
    }
    function V(ae, te, ne, Y) {
      const ee = te / 2, G = ae, C = [
        [
          0,
          -G,
          -ee
        ],
        [
          0,
          -G,
          -ee + ne
        ],
        [
          0,
          -Y,
          -ee + ne
        ],
        [
          0,
          -Y,
          ee - ne
        ],
        [
          0,
          -G,
          ee - ne
        ],
        [
          0,
          -G,
          ee
        ],
        [
          0,
          0,
          ee
        ],
        [
          0,
          0,
          -ee
        ]
      ], N = [
        0,
        1,
        7,
        1,
        6,
        7,
        1,
        2,
        6,
        2,
        5,
        6,
        2,
        3,
        5,
        3,
        4,
        5
      ], H = [];
      for (const de of N) H.push(...C[de]);
      const q = new De();
      q.setAttribute("position", new bt(new Float32Array(H), 3));
      const oe = [];
      for (let de = 0; de < C.length; de++) {
        const j = (de + 1) % C.length;
        oe.push(...C[de], ...C[j]);
      }
      const D = new De();
      return D.setAttribute("position", new bt(new Float32Array(oe), 3)), {
        fill: q,
        outline: D
      };
    }
    function ie(ae, te, ne, Y, ee) {
      const G = te / 2, C = ee / 2, N = [], H = [
        [
          0,
          -ae,
          -G
        ],
        [
          0,
          -ae,
          -G + ne
        ],
        [
          0,
          -C - Y,
          -G + ne
        ],
        [
          0,
          -C - Y,
          G - ne
        ],
        [
          0,
          -ae,
          G - ne
        ],
        [
          0,
          -ae,
          G
        ],
        [
          0,
          -C,
          G
        ],
        [
          0,
          -C,
          -G
        ]
      ], q = H.map((O) => [
        O[0],
        -O[1],
        O[2]
      ]), oe = [
        0,
        1,
        7,
        1,
        6,
        7,
        1,
        2,
        6,
        2,
        5,
        6,
        2,
        3,
        5,
        3,
        4,
        5
      ];
      for (const O of oe) N.push(...H[O]);
      for (const O of oe) N.push(...q[O]);
      const D = new De();
      D.setAttribute("position", new bt(new Float32Array(N), 3));
      const de = [];
      for (const O of [
        H,
        q
      ]) for (let W = 0; W < O.length; W++) {
        const re = (W + 1) % O.length;
        de.push(...O[W], ...O[re]);
      }
      const j = new De();
      return j.setAttribute("position", new bt(new Float32Array(de), 3)), {
        fill: D,
        outline: j
      };
    }
    function J(ae, te, ne, Y) {
      const ee = ae / 2, G = te / 2, C = Y / 2, N = [
        [
          0,
          -C,
          -G
        ],
        [
          0,
          C,
          -G
        ],
        [
          0,
          C,
          G - ne
        ],
        [
          0,
          ee,
          G - ne
        ],
        [
          0,
          ee,
          G
        ],
        [
          0,
          -ee,
          G
        ],
        [
          0,
          -ee,
          G - ne
        ],
        [
          0,
          -C,
          G - ne
        ]
      ], H = [
        0,
        1,
        7,
        1,
        2,
        7,
        6,
        7,
        5,
        2,
        3,
        4,
        2,
        4,
        5,
        2,
        5,
        7
      ], q = [];
      for (const j of H) q.push(...N[j]);
      const oe = new De();
      oe.setAttribute("position", new bt(new Float32Array(q), 3));
      const D = [];
      for (let j = 0; j < N.length; j++) {
        const O = (j + 1) % N.length;
        D.push(...N[j], ...N[O]);
      }
      const de = new De();
      return de.setAttribute("position", new bt(new Float32Array(D), 3)), {
        fill: oe,
        outline: de
      };
    }
    function R(ae, te, ne = 24) {
      const Y = ae / 2, ee = Y - te, G = [];
      for (let q = 0; q < ne; q++) {
        const oe = q / ne * Math.PI * 2, D = (q + 1) / ne * Math.PI * 2, de = Math.cos(oe), j = Math.sin(oe), O = Math.cos(D), W = Math.sin(D);
        G.push(0, Y * de, Y * j, 0, Y * O, Y * W, 0, ee * O, ee * W), G.push(0, Y * de, Y * j, 0, ee * O, ee * W, 0, ee * de, ee * j);
      }
      const C = new De();
      C.setAttribute("position", new bt(new Float32Array(G), 3));
      const N = [];
      for (let q = 0; q < ne; q++) {
        const oe = q / ne * Math.PI * 2, D = (q + 1) / ne * Math.PI * 2;
        N.push(0, Y * Math.cos(oe), Y * Math.sin(oe), 0, Y * Math.cos(D), Y * Math.sin(D)), N.push(0, ee * Math.cos(oe), ee * Math.sin(oe), 0, ee * Math.cos(D), ee * Math.sin(D));
      }
      const H = new De();
      return H.setAttribute("position", new bt(new Float32Array(N), 3)), {
        fill: C,
        outline: H
      };
    }
    const le = new gt({
      color: 52479,
      transparent: true,
      opacity: 0.35,
      side: It,
      depthWrite: false
    }), ue = new mt({
      color: 52479
    }), xe = new gt({
      color: 16750848,
      transparent: true,
      opacity: 0.4,
      side: It,
      depthWrite: false
    }), be = new mt({
      color: 16750848
    });
    function Q(ae, te) {
      const ne = Math.abs(te[0] - ae[0]), Y = Math.abs(te[1] - ae[1]), ee = Math.abs(te[2] - ae[2]);
      return ee > ne && ee > Y || Y > ne && Y > ee;
    }
    return ve.derive(() => {
      var _a2, _b;
      c.deformedShape.val, c.secColumns.val, c.secBeams.val, c.secFloor.val;
      const ae = c.secColumns.rawVal, te = c.secBeams.rawVal;
      if (!ae && !te) {
        b.children.forEach((C) => {
          C instanceof Bt && C.dispose();
        }), b.clear();
        return;
      }
      b.children.forEach((C) => {
        C instanceof Bt && C.dispose();
      }), b.clear();
      const ne = (_a2 = t.elements) == null ? void 0 : _a2.val, Y = (_b = t.elementInputs) == null ? void 0 : _b.val;
      if (!ne || !Y) return;
      const ee = Y.sectionShapes, G = c.secFloor.rawVal;
      ne.forEach((C, N) => {
        if (C.length !== 2) return;
        const H = m.rawVal[C[0]], q = m.rawVal[C[1]];
        if (!H || !q) return;
        const oe = Q(H, q);
        if (oe && !ae || !oe && !te) return;
        if (G >= 0) {
          const W = Math.min(H[1], q[1]);
          Math.max(H[1], q[1]);
          const re = c.gridSize.rawVal || 3;
          if (Math.floor(W / re + 0.01) !== G) return;
        }
        const D = ee == null ? void 0 : ee.get(N);
        if (!D) return;
        const de = [
          (H[0] + q[0]) / 2,
          (H[1] + q[1]) / 2,
          (H[2] + q[2]) / 2
        ], j = ns(H, q);
        if (D.type === "CFT") {
          const W = E(D.b, D.h, D.tw ?? D.b * 0.05), re = new ut(W.concFill, le);
          re.position.set(...de), re.rotation.setFromRotationMatrix(j), re.userData.e = N, b.add(re);
          const we = new ut(W.steelFillGeom, xe);
          we.position.set(...de), we.rotation.setFromRotationMatrix(j), we.userData.e = N, b.add(we);
          const ze = new Et(W.outline, be);
          ze.position.set(...de), ze.rotation.setFromRotationMatrix(j), ze.userData.e = N, b.add(ze);
        } else {
          let W, re, we;
          switch (D.type) {
            case "rect":
              W = P(D.b, D.h), re = le, we = ue;
              break;
            case "circ":
              W = k(D.d), re = le, we = ue;
              break;
            case "I":
              W = v(D.b, D.h, D.tf, D.tw), re = xe, we = be;
              break;
            case "HSS":
              W = S(D.b, D.h, D.tw ?? D.b * 0.05), re = xe, we = be;
              break;
            case "CFT":
              W = E(D.b, D.h, D.tw ?? D.b * 0.05), re = xe, we = be;
              break;
            case "L":
              W = B(D.b ?? D.h, D.h, D.t ?? D.tw ?? 3e-3), re = xe, we = be;
              break;
            case "2L":
              W = se(D.b ?? D.h, D.h, D.t ?? D.tw ?? 3e-3, D.dis ?? 0.01), re = xe, we = be;
              break;
            case "C":
            case "coldC":
              W = V(D.b, D.h, D.tf ?? D.t ?? 3e-3, D.tw ?? D.t ?? 3e-3), re = xe, we = be;
              break;
            case "2C":
              W = ie(D.b, D.h, D.tf ?? 5e-3, D.tw ?? 5e-3, D.dis ?? 0.01), re = xe, we = be;
              break;
            case "T":
              W = J(D.b, D.h, D.tf ?? 0.01, D.tw ?? 6e-3), re = xe, we = be;
              break;
            case "pipe":
              W = R(D.d, D.tw ?? D.d * 0.05), re = xe, we = be;
              break;
            default:
              return;
          }
          const ze = new ut(W.fill, re);
          ze.position.set(...de), ze.rotation.setFromRotationMatrix(j), ze.userData.e = N, b.add(ze);
          const Ee = new Et(W.outline, we);
          Ee.position.set(...de), Ee.rotation.setFromRotationMatrix(j), Ee.userData.e = N, b.add(Ee);
        }
        const O = il(D);
        if (O) {
          const re = [
            "I",
            "HSS",
            "CFT",
            "L",
            "2L",
            "C",
            "2C",
            "T",
            "pipe",
            "coldC"
          ].includes(D.type) ? "#ff9900" : "#00ccff", we = new Bt(O, re, "transparent");
          we.position.set(de[0], de[1], de[2]);
          const ze = 0.05 * c.gridSize.rawVal * 0.5;
          we.updateScale(ze * ((g == null ? void 0 : g.rawVal) ?? 1)), A.add(we);
        }
      });
    }), ve.derive(() => {
      var _a2, _b;
      const ae = m.val, te = (_a2 = t.elements) == null ? void 0 : _a2.rawVal;
      if (te) for (const ne of b.children) {
        const Y = (_b = ne.userData) == null ? void 0 : _b.e;
        if (Y === void 0) continue;
        const ee = te[Y], G = ee && ae[ee[0]], C = ee && ae[ee[1]];
        !G || !C || (ne.position.set((G[0] + C[0]) / 2, (G[1] + C[1]) / 2, (G[2] + C[2]) / 2), ne.rotation.setFromRotationMatrix(ns(G, C)));
      }
    }), g && ve.derive(() => {
      if (g.val, !c.sections.rawVal) return;
      const ae = 0.05 * c.gridSize.val * 0.5;
      A.children.forEach((te) => {
        te instanceof Bt && te.updateScale(ae * g.rawVal);
      });
    }), ve.derive(() => {
      b.visible = c.sections.val;
    }), ve.derive(() => {
      A.visible = c.sectionLabels.val;
    }), b;
  }
  function rl(t) {
    if (!t) return null;
    const c = t.type, m = (E, B) => [
      E,
      B
    ], g = (E, B) => [
      m(-E / 2, -B / 2),
      m(E / 2, -B / 2),
      m(E / 2, B / 2),
      m(-E / 2, B / 2)
    ], b = (E, B = 24) => {
      const se = E / 2, V = [];
      for (let ie = 0; ie < B; ie++) {
        const J = 2 * Math.PI * ie / B;
        V.push(m(se * Math.cos(J), se * Math.sin(J)));
      }
      return V;
    }, A = t.b ?? 0, P = t.h ?? 0, k = t.d ?? 0, v = t.tw ?? t.t ?? 0, S = t.tf ?? t.t ?? 0;
    switch (c) {
      case "rect":
        return A && P ? {
          contorno: g(A, P)
        } : null;
      case "circ":
        return k ? {
          contorno: b(k)
        } : null;
      case "pipe":
        return k && v ? {
          contorno: b(k),
          huecos: [
            b(k - 2 * v).reverse()
          ]
        } : null;
      case "HSS":
        return A && P && v ? {
          contorno: g(A, P),
          huecos: [
            g(A - 2 * v, P - 2 * (S || v)).reverse()
          ]
        } : null;
      case "CFT":
        return A && P ? {
          contorno: g(A, P)
        } : null;
      case "I":
        return A && P && v && S ? {
          contorno: [
            m(-A / 2, -P / 2),
            m(A / 2, -P / 2),
            m(A / 2, -P / 2 + S),
            m(v / 2, -P / 2 + S),
            m(v / 2, P / 2 - S),
            m(A / 2, P / 2 - S),
            m(A / 2, P / 2),
            m(-A / 2, P / 2),
            m(-A / 2, P / 2 - S),
            m(-v / 2, P / 2 - S),
            m(-v / 2, -P / 2 + S),
            m(-A / 2, -P / 2 + S)
          ]
        } : null;
      case "C":
      case "2C":
      case "coldC":
        return A && P && v && S ? {
          contorno: [
            m(-A / 2, -P / 2),
            m(A / 2, -P / 2),
            m(A / 2, -P / 2 + S),
            m(-A / 2 + v, -P / 2 + S),
            m(-A / 2 + v, P / 2 - S),
            m(A / 2, P / 2 - S),
            m(A / 2, P / 2),
            m(-A / 2, P / 2)
          ]
        } : null;
      case "T":
        return A && P && v && S ? {
          contorno: [
            m(-v / 2, -P / 2),
            m(v / 2, -P / 2),
            m(v / 2, P / 2 - S),
            m(A / 2, P / 2 - S),
            m(A / 2, P / 2),
            m(-A / 2, P / 2),
            m(-A / 2, P / 2 - S),
            m(-v / 2, P / 2 - S)
          ]
        } : null;
      case "L":
      case "2L":
        return A && P && v ? {
          contorno: [
            m(-A / 2, -P / 2),
            m(A / 2, -P / 2),
            m(A / 2, -P / 2 + v),
            m(-A / 2 + v, -P / 2 + v),
            m(-A / 2 + v, P / 2),
            m(-A / 2, P / 2)
          ]
        } : null;
      default:
        return A && P ? {
          contorno: g(A, P)
        } : k ? {
          contorno: b(k)
        } : null;
    }
  }
  function cl(t, c, m) {
    if (!t || t <= 0 || !c || !m || c <= 0 || m <= 0) return null;
    const g = Math.sqrt(Math.sqrt(m / c)), b = Math.sqrt(t / g), A = t / b;
    return !isFinite(b) || !isFinite(A) || b <= 0 || A <= 0 ? null : {
      contorno: [
        [
          -b / 2,
          -A / 2
        ],
        [
          b / 2,
          -A / 2
        ],
        [
          b / 2,
          A / 2
        ],
        [
          -b / 2,
          A / 2
        ]
      ]
    };
  }
  function dl(t) {
    const c = new ko();
    t.contorno.forEach(([m, g], b) => b ? c.lineTo(m, g) : c.moveTo(m, g)), c.closePath();
    for (const m of t.huecos ?? []) {
      const g = new $i();
      m.forEach(([b, A], P) => P ? g.lineTo(b, A) : g.moveTo(b, A)), g.closePath(), c.holes.push(g);
    }
    return c;
  }
  function ul(t, c, m) {
    const g = new ft();
    g.name = "extrusion";
    const b = new As({
      color: 8369151,
      transparent: true,
      opacity: 0.92,
      side: It
    }), A = new As({
      color: 12623968,
      transparent: true,
      opacity: 0.85,
      side: It
    }), P = new As({
      color: 11583173,
      transparent: true,
      opacity: 0.85,
      side: It
    }), k = new ft();
    k.add(new Ra(16777215, 0.55));
    const v = new ts(16777215, 0.75);
    v.position.set(30, 25, 40);
    const S = new ts(16777215, 0.35);
    S.position.set(-25, -20, 15), k.add(v, S);
    let E = 0;
    return ve.derive(() => {
      var _a2, _b, _c, _d, _e;
      const B = ((_a2 = c.extruded) == null ? void 0 : _a2.val) ?? false;
      globalThis.__extrusionDebug = {
        corridas: ++E,
        on: B
      }, g.visible = B;
      for (const ue of [
        ...g.children
      ]) ue !== k && (g.remove(ue), (_c = (_b = ue.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
      if (g.children.includes(k) || g.add(k), !B) return;
      const se = m.val ?? [], V = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], ie = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, J = ie.sectionShapes ?? /* @__PURE__ */ new Map(), R = ie.thicknesses ?? /* @__PURE__ */ new Map();
      let le = "";
      try {
        V.forEach((ue, xe) => {
          var _a3, _b2, _c2;
          if (ue.length === 2) {
            let be = rl(J.get(xe)), Q = true;
            if (be || (be = cl((_a3 = ie.areas) == null ? void 0 : _a3.get(xe), (_b2 = ie.momentsOfInertiaY) == null ? void 0 : _b2.get(xe), (_c2 = ie.momentsOfInertiaZ) == null ? void 0 : _c2.get(xe)), Q = false), !be) return;
            const ae = se[ue[0]], te = se[ue[1]];
            if (!ae || !te) return;
            const ne = Math.hypot(te[0] - ae[0], te[1] - ae[1], te[2] - ae[2]);
            if (ne < 1e-9) return;
            const Y = new Ei(dl(be), {
              depth: ne,
              bevelEnabled: false,
              curveSegments: 4
            });
            Y.applyMatrix4(new os().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
            const ee = new ut(Y, Q ? b : A);
            ee.position.set(ae[0], ae[1], ae[2]), ee.rotation.setFromRotationMatrix(ns(ae, te)), g.add(ee);
            return;
          }
          if (ue.length === 3 || ue.length === 4) {
            const be = R.get(xe);
            if (!be || be <= 0) return;
            const Q = ue.map((W) => se[W]).filter(Boolean);
            if (Q.length < 3) return;
            const ae = [
              Q[1][0] - Q[0][0],
              Q[1][1] - Q[0][1],
              Q[1][2] - Q[0][2]
            ], te = [
              Q[2][0] - Q[0][0],
              Q[2][1] - Q[0][1],
              Q[2][2] - Q[0][2]
            ], ne = ae[1] * te[2] - ae[2] * te[1], Y = ae[2] * te[0] - ae[0] * te[2], ee = ae[0] * te[1] - ae[1] * te[0], G = Math.hypot(ne, Y, ee);
            if (G < 1e-12) return;
            const C = [
              ne / G,
              Y / G,
              ee / G
            ], N = [], H = (W) => Q.map((re) => [
              re[0] + C[0] * W,
              re[1] + C[1] * W,
              re[2] + C[2] * W
            ]), q = Math.abs(C[2]) > 0.5, oe = C[2] > 0 ? -1 : 1, D = H(q ? 0 : +be / 2), de = H(q ? oe * be : -be / 2), j = (W, re, we) => N.push(...W, ...re, ...we);
            for (const W of [
              D,
              de
            ]) j(W[0], W[1], W[2]), W.length === 4 && j(W[0], W[2], W[3]);
            for (let W = 0; W < Q.length; W++) {
              const re = (W + 1) % Q.length;
              j(D[W], de[W], de[re]), j(D[W], de[re], D[re]);
            }
            const O = new De();
            O.setAttribute("position", new Tt(N, 3)), O.computeVertexNormals(), g.add(new ut(O, P));
          }
        });
      } catch (ue) {
        le = String((ue == null ? void 0 : ue.message) ?? ue);
      }
      globalThis.__extrusionDebug = {
        corridas: E,
        on: B,
        fallo: le,
        nElementos: V.length,
        nFormas: J.size,
        nEspesores: R.size,
        mallas: g.children.length - 1
      };
    }), g;
  }
  function Ka(t, c, m = 0) {
    const g = [
      c[0] - t[0],
      c[1] - t[1],
      c[2] - t[2]
    ], b = Math.hypot(g[0], g[1], g[2]) || 1, A = g[0] / b, P = g[1] / b, k = g[2] / b, v = Math.sqrt(A * A + P * P);
    let S, E, B;
    if (v < 1e-9) {
      const se = k > 0 ? 1 : -1;
      S = [
        0,
        0,
        se
      ], E = [
        1,
        0,
        0
      ], B = [
        0,
        se,
        0
      ];
    } else S = [
      A,
      P,
      k
    ], E = [
      -A * k / v,
      -P * k / v,
      v
    ], B = [
      P / v,
      -A / v,
      0
    ];
    if (Math.abs(m) > 1e-12) {
      const se = m * Math.PI / 180, V = Math.cos(se), ie = Math.sin(se), J = E.map((le, ue) => V * le + ie * B[ue]), R = B.map((le, ue) => -ie * E[ue] + V * le);
      E = J, B = R;
    }
    return {
      e1: S,
      e2: E,
      e3: B
    };
  }
  function Ts(t, c) {
    if (!c) return [
      0,
      0
    ];
    const m = Number(c[0] ?? 0), g = Number(c[1] ?? 0);
    return t === "bendingsY" ? [
      m,
      -g
    ] : [
      -m,
      g
    ];
  }
  function Ga(t, c) {
    const m = (g) => g.map((b) => -b);
    switch (t) {
      case "bendingsZ":
        return m(c.e2);
      case "bendingsY":
        return m(c.e3);
      case "shearsZ":
        return c.e3;
      default:
        return c.e2;
    }
  }
  class Jo extends ft {
    constructor(c, m, g, b, A, P, k) {
      super();
      const v = new ko().moveTo(0, 0).lineTo(0, P[1]).lineTo(g, P[1]).lineTo(g, 0).lineTo(0, 0), S = v.getPoints(), E = new De().setFromPoints(S);
      this.lines = new Et(E, new mt({
        color: Jn().resultOutline
      })), this.lines.position.set(...c), this.lines.rotation.setFromRotationMatrix(b), k && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const B = new es(v), se = new gt({
        color: P[1] > 0 ? 24435 : 11411474,
        side: It
      });
      this.mesh = new ut(B, se), this.mesh.position.set(...c), this.mesh.rotation.setFromRotationMatrix(b), k && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Bt(`${A[1].toFixed(4)}`), this.normalizedResult = P, this.textPosition = Po([
        c,
        m
      ]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(b), this.add(this.text);
    }
    updateScale(c) {
      this.lines.scale.set(1, c * 2, 1), this.mesh.scale.set(1, c * 2, 1), this.text.updateScale(c * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * c);
    }
    dispose() {
      this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
    }
  }
  class Ls extends ft {
    constructor(c, m, g, b, A, P, k) {
      super();
      const v = A[0] * g / (A[0] + A[1]), S = A[0] * A[1] > 0;
      if (this.text = new Bt(`${A[0].toFixed(4)}`), this.text2 = new Bt(`${(A[1] * -1).toFixed(4)}`), this.normalizedResult = P, this.textPosition = Is(c, m), this.text2Position = Is(m, c), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(b), this.text2.rotation.setFromRotationMatrix(b), this.add(this.text, this.text2), S) {
        const E = new ko().moveTo(0, 0).lineTo(0, P[0]).lineTo(v, 0).lineTo(0, 0), B = new ko().moveTo(v, 0).lineTo(g, -P[1]).lineTo(g, 0).lineTo(v, 0), se = E.getPoints(), V = B.getPoints(), ie = new De().setFromPoints(se), J = new De().setFromPoints(V), R = new mt({
          color: Jn().resultOutline
        });
        this.lines = new Et(ie, R), this.lines2 = new Et(J, R), this.lines.position.set(...c), this.lines2.position.set(...c), this.lines.rotation.setFromRotationMatrix(b), this.lines2.rotation.setFromRotationMatrix(b), k && this.lines.rotateX(Math.PI / 2), k && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
        const le = new es(E), ue = new es(B), xe = new gt({
          color: P[0] > 0 ? 24435 : 11411474,
          side: It
        }), be = new gt({
          color: -P[1] > 0 ? 24435 : 11411474,
          side: It
        });
        this.mesh = new ut(le, xe), this.mesh2 = new ut(ue, be), this.mesh.position.set(...c), this.mesh2.position.set(...c), this.mesh.rotation.setFromRotationMatrix(b), this.mesh2.rotation.setFromRotationMatrix(b), k && this.mesh.rotateX(Math.PI / 2), k && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
      } else {
        const E = new ko().moveTo(0, 0).lineTo(0, P[0]).lineTo(g, -P[1]).lineTo(g, 0).lineTo(0, 0), B = E.getPoints(), se = new De().setFromPoints(B);
        this.lines = new Et(se, new mt({
          color: Jn().resultOutline
        })), this.lines.position.set(...c), this.lines.rotation.setFromRotationMatrix(b), k && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
        const V = new es(E), ie = new gt({
          color: P[0] > 0 ? 24435 : 11411474,
          side: It
        });
        this.mesh = new ut(V, ie), this.mesh.position.set(...c), this.mesh.rotation.setFromRotationMatrix(b), k && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
      }
    }
    updateScale(c) {
      var _a2, _b;
      this.lines.scale.set(1, c * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, c * 2, 1), this.mesh.scale.set(1, c * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, c * 2, 1), this.text.updateScale(c * 0.6), this.text2.updateScale(c * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * c), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * c);
    }
    dispose() {
      var _a2, _b, _c, _d, _e, _f;
      this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
    }
  }
  var Ha = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(Ha || {});
  function fl(t, c, m, g) {
    const b = () => {
      const k = m.rawVal;
      if (!(k == null ? void 0 : k.length)) return 0.05 * c.gridSize.rawVal;
      const v = [
        1 / 0,
        1 / 0,
        1 / 0
      ], S = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const B of k) for (let se = 0; se < 3; se++) B[se] < v[se] && (v[se] = B[se]), B[se] > S[se] && (S[se] = B[se]);
      const E = Math.hypot(S[0] - v[0], S[1] - v[1], S[2] - v[2]);
      return !isFinite(E) || E <= 0 ? 0.05 * c.gridSize.rawVal : 0.025 * E;
    }, A = new ft(), P = {
      normals: Jo,
      shearsY: Jo,
      shearsZ: Jo,
      torsions: Jo,
      bendingsY: Ls,
      bendingsZ: Ls
    };
    return ve.derive(() => {
      var _a2, _b;
      if (c.deformedShape.val, m.val, c.frameResults.val == "none") return;
      A.children.forEach((v) => v.dispose()), A.clear();
      const k = Ha[c.frameResults.rawVal];
      (_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal[k]) == null ? void 0 : _b.forEach((v, S) => {
        var _a3, _b2, _c, _d, _e, _f;
        const E = ((_a3 = t.elements) == null ? void 0 : _a3.rawVal[S]) ?? [
          0,
          1
        ], B = m.rawVal[E[0]], se = m.rawVal[E[1]];
        if (!B || !se) return;
        const V = new T(...se).distanceTo(new T(...B)), ie = pl((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[k]), J = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, S)) ?? 0, R = Ka(B, se, J), le = Ga(k, R), ue = new T(...R.e1), xe = new T(...le), be = new os().makeBasis(ue, xe, ue.clone().cross(xe)), [Q, ae] = Ts(k, v), te = P[k] === Ls ? [
          Q,
          -ae
        ] : [
          Q,
          ae
        ], ne = te.map((ee) => ee / (ie === 0 ? 1 : ie)), Y = new P[k](B, se, V, be, te, ne, false);
        Y.updateScale(b() * g.rawVal), A.add(Y);
      });
    }), ve.derive(() => {
      if (g.val, c.frameResults.rawVal == "none") return;
      c.gridSize.val;
      const k = b();
      A.children.forEach((v) => v.updateScale(k * g.rawVal));
    }), ve.derive(() => {
      A.visible = c.frameResults.val != "none";
    }), A;
  }
  function pl(t) {
    let c = 0;
    return t == null ? void 0 : t.forEach((m) => {
      const g = Math.max(...(m ?? [
        0,
        0
      ]).map((b) => Math.abs(b)));
      g > c && (c = g);
    }), c;
  }
  class hl extends ft {
    constructor(c, m, g) {
      super();
      const b = m === Ds.reactions;
      g[0] && (this.xText1 = new Bt(`${b ? "Fx" : "Dx"}: ` + g[0].toFixed(4))), g[3] && (this.xText2 = new Bt(`${b ? "Mx" : "Rx"}: ` + g[3].toFixed(4))), g[1] && (this.yText1 = new Bt(`${b ? "Fy" : "Dy"}: ` + g[1].toFixed(4))), g[4] && (this.yText2 = new Bt(`${b ? "My" : "Ry"}: ` + g[4].toFixed(4))), g[2] && (this.zText1 = new Bt(`${b ? "Fz" : "Dz"}: ` + g[2].toFixed(4))), g[5] && (this.zText2 = new Bt(`${b ? "Mz" : "Rz"}: ` + g[5].toFixed(4))), (g[0] || g[3]) && (this.xArrow = new Yn(new T(1, 0, 0), new T(0, 0, 0), 1, 15637248, 0.3, 0.3)), (g[1] || g[4]) && (this.yArrow = new Yn(new T(0, 1, 0), new T(0, 0, 0), 1, 15637248, 0.3, 0.3)), (g[2] || g[5]) && (this.zArrow = new Yn(new T(0, 0, 1), new T(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...c), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
    }
    updateScale(c) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l2, _m, _n, _o2;
      (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(c, c, c), (_b = this.yArrow) == null ? void 0 : _b.scale.set(c, c, c), (_c = this.zArrow) == null ? void 0 : _c.scale.set(c, c, c), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * c, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * c, 0, 0.5 * c), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * c, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * c, 0.5 * c), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * c), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * c + 0.5 * c), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * c), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * c), (_l2 = this.yText1) == null ? void 0 : _l2.updateScale(0.4 * c), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * c), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * c), (_o2 = this.zText2) == null ? void 0 : _o2.updateScale(0.4 * c);
    }
    dispose() {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
      (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
    }
  }
  var Ds = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(Ds || {});
  function ml(t, c, m, g) {
    const b = new ft();
    return ve.derive(() => {
      var _a2, _b;
      if (c.deformedShape.val, c.nodeResults.val == "none") return;
      b.children.forEach((k) => k.dispose()), b.clear();
      const A = Ds[c.nodeResults.rawVal], P = 0.05 * c.gridSize.val;
      (_b = (_a2 = t.deformOutputs) == null ? void 0 : _a2.val[A]) == null ? void 0 : _b.forEach((k, v) => {
        const S = new hl(m.rawVal[v], A, k ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ]);
        S.updateScale(P * g.rawVal), b.add(S);
      });
    }), ve.derive(() => {
      if (g.val, c.nodeResults.rawVal == "none") return;
      const A = 0.05 * c.gridSize.val;
      b.children.forEach((P) => P.updateScale(A * g.rawVal));
    }), ve.derive(() => {
      b.visible = c.nodeResults.val != "none";
    }), b;
  }
  function wl({ drawingObj: t, gridObj: c, scene: m, getActiveCamera: g, controls: b, gridSize: A, derivedDisplayScale: P, rendererElm: k, viewerRender: v }) {
    var _a2;
    const S = new Cs(), E = new Li(), B = (e) => {
      const n = k.getBoundingClientRect(), s = e.clientX - n.left, o = e.clientY - n.top, a = n.width || 1, r = n.height || 1;
      if (!!window.__hekatanSplitMode) {
        const i = a / 2;
        if (s >= i) return E.x = (s - i) / i * 2 - 1, E.y = -(o / r) * 2 + 1, window.__hekatanSplitCamera ?? g();
        E.x = s / i * 2 - 1;
      } else E.x = s / a * 2 - 1;
      return E.y = -(o / r) * 2 + 1, g();
    }, se = new ut(new Dn(1e4, 1e4), new gt({
      side: It,
      transparent: true,
      opacity: 0,
      depthWrite: false
    }));
    se.visible = true, se.frustumCulled = false, m.add(se);
    const V = (e, n, s) => {
      const o = new ut(new Dn(1e4, 1e4), new gt({
        side: It,
        transparent: true,
        opacity: 0,
        depthWrite: false
      }));
      return o.rotation.set(e, n, s), o.visible = false, o.frustumCulled = false, m.add(o), o;
    }, ie = V(Math.PI / 2, 0, 0), J = V(0, Math.PI / 2, 0);
    let R = false, le = null, ue = null, xe = null;
    const be = new Et(new De(), new mt({
      color: 3718648,
      depthTest: false,
      transparent: true,
      opacity: 0.95
    }));
    be.name = "ref-ifc-cadena", be.renderOrder = 1e3, be.frustumCulled = false, be.visible = false, m.add(be);
    const Q = (e, n, s) => Math.round(e * 1e3) + "," + Math.round(n * 1e3) + "," + Math.round(s * 1e3), ae = (e) => {
      const n = /* @__PURE__ */ new Map();
      for (let s = 0; s + 0 < e.length / 6; s++) {
        const o = 6 * s;
        for (const a of [
          Q(e[o], e[o + 1], e[o + 2]),
          Q(e[o + 3], e[o + 4], e[o + 5])
        ]) {
          const r = n.get(a);
          r ? r.push(s) : n.set(a, [
            s
          ]);
        }
      }
      return n;
    }, te = (e) => {
      const { S: n, adj: s } = e, o = (x, _) => new T(n[6 * x + 3 * _], n[6 * x + 3 * _ + 1], n[6 * x + 3 * _ + 2]), a = /* @__PURE__ */ new Set([
        e.s
      ]), r = (x, _) => {
        const $ = [];
        let I = x, L = _;
        for (let U = 0; U < 3e3; U++) {
          const he = (s.get(Q(L.x, L.y, L.z)) || []).filter((_e) => !a.has(_e));
          if (he.length !== 1) break;
          const X = he[0], K = o(X, 0), fe = o(X, 1), ge = K.distanceTo(L) < fe.distanceTo(L) ? fe : K, Ce = L.clone().sub(I).normalize(), Re = ge.clone().sub(L).normalize();
          if (Ce.dot(Re) < Math.cos(35 * Math.PI / 180)) break;
          a.add(X), $.push(ge), I = L, L = ge;
        }
        return $;
      }, h = o(e.s, 0), i = o(e.s, 1), l = r(h, i), u = r(i, h), d = [
        ...u.reverse(),
        h,
        i,
        ...l
      ], M = u.length;
      if (d.length < 6) return d;
      const y = [], w = [];
      for (let x = 1; x < d.length; x++) y.push(d[x].distanceTo(d[x - 1]));
      for (let x = 1; x < d.length - 1; x++) {
        const _ = d[x].clone().sub(d[x - 1]).normalize(), $ = d[x + 1].clone().sub(d[x]).normalize();
        w.push(Math.acos(Math.max(-1, Math.min(1, _.dot($)))) / Math.max(1e-6, (y[x - 1] + y[x]) / 2));
      }
      const z = w.map((x, _) => {
        let $ = 0, I = 0;
        for (let L = _ - 1; L <= _ + 1; L++) L >= 0 && L < w.length && ($ += w[L], I++);
        return $ / I;
      }), F = [];
      for (let x = 3; x < z.length - 3; x++) {
        const _ = (z[x - 3] + z[x - 2] + z[x - 1]) / 3, $ = (z[x + 1] + z[x + 2] + z[x + 3]) / 3, I = Math.min(_, $), L = Math.max(_, $);
        L > 0.03 && L / Math.max(I, 1e-6) > 2.2 && Math.abs(z[x] - (_ + $) / 2) < L && (!F.length || x - F[F.length - 1] > 3) && F.push(x + 1);
      }
      let f = 0, p = d.length - 1;
      for (const x of F) x <= M && x > f && (f = x), x > M && x < p && (p = x);
      return d.slice(f, p + 1);
    }, ne = (e) => {
      if (xe = e, !e || e.length < 2) {
        be.visible = false;
        return;
      }
      be.geometry.dispose(), be.geometry = new De().setFromPoints(e), be.visible = true;
    }, Y = (e) => {
      let n = 0;
      for (let M = 1; M < e.length - 1; M++) {
        const y = e[M].clone().sub(e[M - 1]).normalize(), w = e[M + 1].clone().sub(e[M]).normalize();
        n += Math.acos(Math.max(-1, Math.min(1, y.dot(w))));
      }
      const s = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
      if (n < 3 * Math.PI / 180) return [
        e[0].toArray(),
        e[e.length - 1].toArray()
      ];
      const o = String(window.__hekatanArcModo ?? "angulo"), a = o === "x" ? 0 : o === "y" ? 1 : o === "z" ? 2 : -1, r = [
        0
      ];
      for (let M = 1; M < e.length; M++) r.push(r[M - 1] + e[M].distanceTo(e[M - 1]));
      const h = (M, y) => {
        for (let w = 1; w < e.length; w++) {
          const z = M(e[w - 1], w - 1), F = M(e[w], w);
          if (z <= y && y <= F || F <= y && y <= z) {
            const f = Math.abs(F - z) < 1e-12 ? 0 : (y - z) / (F - z);
            return e[w - 1].clone().lerp(e[w], f);
          }
        }
        return e[e.length - 1].clone();
      }, i = [], l = a >= 0 ? e[0].getComponent(a) : 0, u = a >= 0 ? e[e.length - 1].getComponent(a) : 0, d = a >= 0 && Math.abs(u - l) > 1e-6 && e.every((M, y) => y === 0 || (M.getComponent(a) - e[y - 1].getComponent(a)) * (u - l) >= -1e-6);
      for (let M = 0; M <= s; M++) {
        const y = d ? h((w) => w.getComponent(a), l + (u - l) * M / s) : h((w, z) => r[z], r[r.length - 1] * M / s);
        i.push([
          y.x,
          y.y,
          y.z
        ]);
      }
      return i[0] = e[0].toArray(), i[s] = e[e.length - 1].toArray(), i;
    };
    window.__hekatanCadenaIfc = () => (xe || []).map((e) => [
      e.x,
      e.y,
      e.z
    ]);
    const ee = /* @__PURE__ */ new Map(), G = (e) => {
      const n = ee.get(e.id);
      if (n) return n;
      const s = e.geometry.getAttribute("position"), o = s ? Math.floor(s.count / 3) : 0, a = new Float64Array(o * 9), r = new Float64Array(o * 3), h = new Int32Array(o * 3).fill(-1);
      if (s) {
        e.updateMatrixWorld();
        const l = new T();
        for (let z = 0; z < o * 3; z++) l.fromBufferAttribute(s, z).applyMatrix4(e.matrixWorld), a[3 * z] = l.x, a[3 * z + 1] = l.y, a[3 * z + 2] = l.z;
        const u = new T(), d = new T(), M = new T(), y = (z) => Math.round(a[3 * z] * 1e3) + "," + Math.round(a[3 * z + 1] * 1e3) + "," + Math.round(a[3 * z + 2] * 1e3), w = /* @__PURE__ */ new Map();
        for (let z = 0; z < o; z++) {
          const F = 3 * z;
          u.set(a[3 * (F + 1)] - a[3 * F], a[3 * (F + 1) + 1] - a[3 * F + 1], a[3 * (F + 1) + 2] - a[3 * F + 2]), d.set(a[3 * (F + 2)] - a[3 * F], a[3 * (F + 2) + 1] - a[3 * F + 1], a[3 * (F + 2) + 2] - a[3 * F + 2]), M.crossVectors(u, d).normalize(), r[3 * z] = M.x, r[3 * z + 1] = M.y, r[3 * z + 2] = M.z;
          for (let f = 0; f < 3; f++) {
            const p = y(F + f), x = y(F + (f + 1) % 3), _ = p < x ? p + "|" + x : x + "|" + p, $ = w.get(_);
            $ ? $.push(z, f) : w.set(_, [
              z,
              f
            ]);
          }
        }
        for (const z of w.values()) z.length === 4 && (h[3 * z[0] + z[1]] = z[2], h[3 * z[2] + z[3]] = z[0]);
      }
      const i = {
        V: a,
        N: r,
        vec: h,
        n: o
      };
      return ee.set(e.id, i), i;
    }, C = new ut(new De(), new gt({
      color: 3718648,
      transparent: true,
      opacity: 0.35,
      depthTest: false,
      side: It
    }));
    C.name = "ref-ifc-cara", C.renderOrder = 999, C.frustumCulled = false, C.visible = false, m.add(C);
    let N = null;
    const H = (e, n) => {
      const s = Math.cos(12 * Math.PI / 180), o = Math.cos(80 * Math.PI / 180), a = [
        e.N[3 * n],
        e.N[3 * n + 1],
        e.N[3 * n + 2]
      ], r = new Uint8Array(e.n), h = [], i = [
        n
      ];
      for (r[n] = 1; i.length && h.length < 4e4; ) {
        const l = i.pop();
        h.push(l);
        for (let u = 0; u < 3; u++) {
          const d = e.vec[3 * l + u];
          if (d < 0 || r[d]) continue;
          const M = e.N[3 * l] * e.N[3 * d] + e.N[3 * l + 1] * e.N[3 * d + 1] + e.N[3 * l + 2] * e.N[3 * d + 2], y = a[0] * e.N[3 * d] + a[1] * e.N[3 * d + 1] + a[2] * e.N[3 * d + 2];
          M >= s && y >= o && (r[d] = 1, i.push(d));
        }
      }
      return h;
    }, q = (e, n, s) => {
      if (!e || n < 0 || !s) {
        N && (N = null, C.visible = false);
        return;
      }
      if (N && N.m === e && N.tris.indexOf(n) >= 0) {
        N.punto = s.clone();
        return;
      }
      const o = G(e), a = H(o, n), r = new Float32Array(a.length * 9), h = new T();
      let i = true;
      a.forEach((l, u) => {
        for (let d = 0; d < 9; d++) r[9 * u + d] = o.V[9 * l + d];
        h.x += o.N[3 * l], h.y += o.N[3 * l + 1], h.z += o.N[3 * l + 2];
      }), h.normalize();
      for (const l of a) if (h.x * o.N[3 * l] + h.y * o.N[3 * l + 1] + h.z * o.N[3 * l + 2] < Math.cos(5 * Math.PI / 180)) {
        i = false;
        break;
      }
      C.geometry.dispose(), C.geometry = new De(), C.geometry.setAttribute("position", new bt(r, 3)), C.material.color.set(i ? 3718648 : 16096779), C.visible = true, N = {
        m: e,
        t0: n,
        tris: a,
        normal: h,
        plana: i,
        punto: s.clone()
      };
    }, oe = (e, n) => {
      const s = new Uint8Array(e.n);
      for (const d of n) s[d] = 1;
      const o = (d) => Math.round(e.V[3 * d] * 1e3) + "," + Math.round(e.V[3 * d + 1] * 1e3) + "," + Math.round(e.V[3 * d + 2] * 1e3), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
      for (const d of n) for (let M = 0; M < 3; M++) {
        const y = e.vec[3 * d + M];
        if (y >= 0 && s[y]) continue;
        const w = 3 * d + M, z = 3 * d + (M + 1) % 3, F = o(w), f = o(z);
        r.set(F, new T(e.V[3 * w], e.V[3 * w + 1], e.V[3 * w + 2])), r.set(f, new T(e.V[3 * z], e.V[3 * z + 1], e.V[3 * z + 2])), (a.get(F) || a.set(F, []).get(F)).push(f), (a.get(f) || a.set(f, []).get(f)).push(F);
      }
      const h = /* @__PURE__ */ new Set();
      let i = [];
      for (const d of a.keys()) {
        if (h.has(d)) continue;
        const M = [
          d
        ];
        h.add(d);
        let y = "", w = d;
        for (let z = 0; z < 1e5; z++) {
          const F = (a.get(w) || []).find((f) => f !== y && !h.has(f));
          if (!F) break;
          M.push(F), h.add(F), y = w, w = F;
        }
        M.length > i.length && (i = M);
      }
      const l = i.map((d) => r.get(d)), u = [];
      for (let d = 0; d < l.length; d++) {
        const M = l[(d + l.length - 1) % l.length], y = l[d], w = l[(d + 1) % l.length];
        if (y.distanceTo(M) < 1e-3) continue;
        const z = y.clone().sub(M).normalize(), F = w.clone().sub(y).normalize();
        z.dot(F) > Math.cos(3 * Math.PI / 180) || u.push(y);
      }
      return u;
    }, D = (e, n, s) => {
      const a = new Cs(n.clone().addScaledVector(s, -2e-3), s.clone().negate(), 0, 3).intersectObject(e, false);
      return a.length ? a[0].distance + 2e-3 : null;
    };
    window.__hekatanRaycast = (e, n, s, o = 2) => {
      const a = new T(e[0], e[1], e[2]), r = new T(n[0], n[1], n[2]).normalize();
      let h = null;
      for (const i of [
        1,
        -1
      ]) {
        const u = new Cs(a, r.clone().multiplyScalar(i), 0, o).intersectObjects(s, false);
        u.length && (h == null || u[0].distance < h) && (h = u[0].distance);
      }
      return h;
    }, window.__hekatanCaraIfc = () => N ? {
      tris: N.tris.length,
      plana: N.plana,
      normal: N.normal.toArray(),
      punto: N.punto.toArray(),
      contorno: oe(G(N.m), N.tris).map((e) => [
        e.x,
        e.y,
        e.z
      ])
    } : null;
    const de = /* @__PURE__ */ new Map(), j = new an(new De(), new mt({
      color: 16498468,
      transparent: true,
      opacity: 0.35,
      depthTest: true
    }));
    j.name = "ref-ifc-bordes", j.frustumCulled = false, j.visible = false, m.add(j);
    const O = 1, W = (e, n, s) => Math.floor(e / O) + "," + Math.floor(n / O) + "," + Math.floor(s / O), re = (e) => {
      const n = de.get(e.id);
      if (n) return n;
      const s = e.geometry.getAttribute("position"), o = [], a = /* @__PURE__ */ new Map();
      if (s) {
        e.updateMatrixWorld();
        const h = Math.floor(s.count / 3), i = new Float64Array(s.count * 3), l = new T();
        for (let f = 0; f < s.count; f++) l.fromBufferAttribute(s, f).applyMatrix4(e.matrixWorld), i[3 * f] = l.x, i[3 * f + 1] = l.y, i[3 * f + 2] = l.z;
        const u = (f) => Math.round(i[3 * f] * 1e3) + "," + Math.round(i[3 * f + 1] * 1e3) + "," + Math.round(i[3 * f + 2] * 1e3), d = new Float64Array(h * 3), M = new T(), y = new T(), w = new T();
        for (let f = 0; f < h; f++) {
          const p = 3 * f, x = 3 * f + 1, _ = 3 * f + 2;
          M.set(i[3 * x] - i[3 * p], i[3 * x + 1] - i[3 * p + 1], i[3 * x + 2] - i[3 * p + 2]), y.set(i[3 * _] - i[3 * p], i[3 * _ + 1] - i[3 * p + 1], i[3 * _ + 2] - i[3 * p + 2]), w.crossVectors(M, y).normalize(), d[3 * f] = w.x, d[3 * f + 1] = w.y, d[3 * f + 2] = w.z;
        }
        const z = /* @__PURE__ */ new Map();
        for (let f = 0; f < h; f++) for (let p = 0; p < 3; p++) {
          const x = 3 * f + p, _ = 3 * f + (p + 1) % 3, $ = u(x), I = u(_), L = $ < I ? $ + "|" + I : I + "|" + $, U = z.get(L);
          U ? U.push(f) : z.set(L, [
            f,
            x,
            _
          ]);
        }
        const F = Math.cos(25 * Math.PI / 180);
        for (const f of z.values()) {
          const p = f[0], x = f[1], _ = f[2];
          let $ = f.length === 3;
          if (!$ && f.length === 4) {
            const L = f[3], U = d[3 * p] * d[3 * L] + d[3 * p + 1] * d[3 * L + 1] + d[3 * p + 2] * d[3 * L + 2];
            $ = Math.abs(U) < F;
          }
          if (!$) continue;
          const I = o.length / 6;
          o.push(i[3 * x], i[3 * x + 1], i[3 * x + 2], i[3 * _], i[3 * _ + 1], i[3 * _ + 2]);
          for (const [L, U, he] of [
            [
              i[3 * x],
              i[3 * x + 1],
              i[3 * x + 2]
            ],
            [
              i[3 * _],
              i[3 * _ + 1],
              i[3 * _ + 2]
            ],
            [
              (i[3 * x] + i[3 * _]) / 2,
              (i[3 * x + 1] + i[3 * _ + 1]) / 2,
              (i[3 * x + 2] + i[3 * _ + 2]) / 2
            ]
          ]) {
            const X = W(L, U, he), K = a.get(X);
            K ? K[K.length - 1] !== I && K.push(I) : a.set(X, [
              I
            ]);
          }
        }
      }
      const r = {
        segs: new Float32Array(o),
        celdas: a
      };
      return de.set(e.id, r), r;
    };
    let we = "";
    const ze = (e) => {
      const n = e.map((h) => h.id).join(",");
      if (n === we) return;
      we = n;
      const s = e.map((h) => re(h).segs);
      let o = 0;
      for (const h of s) o += h.length;
      const a = new Float32Array(o);
      let r = 0;
      for (const h of s) a.set(h, r), r += h.length;
      j.geometry.dispose(), j.geometry = new De(), j.geometry.setAttribute("position", new bt(a, 3)), j.visible = o > 0 && window.__hekatanRefIfcBordes !== false;
    };
    window.__hekatanRefIfcBordesRefrescar = () => {
      j.visible = we !== "" && window.__hekatanRefIfcBordes !== false, v();
    }, window.__hekatanBordesIfc = () => {
      let e = 0;
      for (const n of de.values()) e += n.segs.length / 6;
      return e;
    };
    const Ee = (e, n) => {
      const s = window.__hekatanCursorPx;
      if (!s) return null;
      const o = re(e), a = o.segs, r = Math.floor(n.x / O), h = Math.floor(n.y / O), i = Math.floor(n.z / O), l = /* @__PURE__ */ new Set();
      let u = Rn, d = null, M = Rn, y = null, w = -1;
      const z = new T(), F = new T();
      for (let f = -1; f <= 1; f++) for (let p = -1; p <= 1; p++) for (let x = -1; x <= 1; x++) {
        const _ = o.celdas.get(r + f + "," + (h + p) + "," + (i + x));
        if (_) for (const $ of _) {
          if (l.has($)) continue;
          l.add($);
          const I = 6 * $;
          z.set(a[I], a[I + 1], a[I + 2]), F.set(a[I + 3], a[I + 4], a[I + 5]);
          const L = Gn(z.x, z.y, z.z), U = Gn(F.x, F.y, F.z);
          if (!L || !U) continue;
          const he = Math.hypot(L.x - s.x, L.y - s.y), X = Math.hypot(U.x - s.x, U.y - s.y);
          he < u && (u = he, d = z.clone()), X < u && (u = X, d = F.clone());
          const K = U.x - L.x, fe = U.y - L.y, ge = K * K + fe * fe || 1e-9;
          let Ce = ((s.x - L.x) * K + (s.y - L.y) * fe) / ge;
          Ce = Math.max(0, Math.min(1, Ce));
          const Re = Math.hypot(s.x - (L.x + Ce * K), s.y - (L.y + Ce * fe));
          Re < M && (M = Re, y = z.clone().lerp(F, Ce), w = $);
        }
      }
      return w >= 0 && (o.adj || (o.adj = ae(o.segs)), ue = {
        S: o.segs,
        adj: o.adj,
        s: w
      }), d ? {
        tipo: "ifcVert",
        punto: d
      } : y ? {
        tipo: "ifcEdge",
        punto: y
      } : null;
    }, tt = () => {
      var _a3, _b, _c;
      if (window.__hekatanRefIfcSnap === false) return null;
      const e = [];
      if (m.traverse((r) => {
        var _a4;
        ((_a4 = r.userData) == null ? void 0 : _a4.refIfc) && r.isMesh && e.push(r);
      }), !e.length) return j.visible = false, we = "", null;
      ze(e);
      const n = S.intersectObjects(e, false).filter((r) => {
        const h = r.object.material;
        return (h && h.clippingPlanes || []).every((l) => l.distanceToPoint(r.point) >= 0);
      });
      if (!n.length) return null;
      const s = n[0], o = n[1];
      ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? q(s.object, s.faceIndex ?? -1, s.point) : N && q(null, -1, null);
      const a = Ee(s.object, s.point);
      if (a) return le = {
        tipo: a.tipo
      }, [
        {
          ...s,
          point: a.punto
        }
      ];
      if (o && o.object === s.object && o.distance - s.distance <= 1.2) {
        const r = s.point.clone().add(o.point).multiplyScalar(0.5);
        return le = {
          tipo: "ifcAxis"
        }, [
          {
            ...s,
            point: r
          }
        ];
      }
      return le = {
        tipo: "ifc"
      }, [
        s
      ];
    };
    let at = "", Ue = new Float32Array(0);
    const Z = new an(new De(), new mt({
      color: 16096779,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }));
    Z.name = "ref-ifc-seccion", Z.renderOrder = 998, Z.frustumCulled = false, Z.visible = false, m.add(Z);
    const ce = () => {
      const e = window.__hekatanClip;
      if (!e || window.__hekatanRefIfcSnap === false) return Z.visible = false, Ue = new Float32Array(0);
      const n = [];
      e.enableX && n.push([
        0,
        +e.posX
      ]), e.enableY && n.push([
        1,
        +e.posY
      ]), e.enableZ && n.push([
        2,
        +e.posZ
      ]);
      const s = [];
      m.traverse((r) => {
        var _a3;
        ((_a3 = r.userData) == null ? void 0 : _a3.refIfc) && r.isMesh && s.push(r);
      });
      const o = JSON.stringify(n) + "|" + s.map((r) => r.id).join(",");
      if (o === at) return Ue;
      at = o;
      const a = [];
      if (n.length && s.length) {
        const r = [
          new T(),
          new T(),
          new T()
        ];
        for (const h of s) {
          const i = h.geometry.getAttribute("position");
          if (i) {
            h.updateMatrixWorld();
            for (let l = 0; l + 2 < i.count; l += 3) {
              for (let u = 0; u < 3; u++) r[u].fromBufferAttribute(i, l + u).applyMatrix4(h.matrixWorld);
              for (const [u, d] of n) {
                const M = [
                  r[0].getComponent(u) - d,
                  r[1].getComponent(u) - d,
                  r[2].getComponent(u) - d
                ], y = [];
                for (let w = 0; w < 3; w++) {
                  const z = r[w], F = r[(w + 1) % 3], f = M[w], p = M[(w + 1) % 3];
                  (f < 0 && p >= 0 || f >= 0 && p < 0) && y.push(z.clone().lerp(F, f / (f - p)));
                }
                y.length === 2 && a.push(y[0].x, y[0].y, y[0].z, y[1].x, y[1].y, y[1].z);
              }
            }
          }
        }
      }
      return Ue = new Float32Array(a), Z.geometry.dispose(), Z.geometry = new De(), Z.geometry.setAttribute("position", new bt(Ue, 3)), Z.visible = Ue.length > 0, Ue;
    };
    let pe = null, me = null;
    const ke = (e, n) => {
      const s = ce();
      if (!s.length) return null;
      let o = Rn * 2, a = null, r = -1;
      const h = new T(), i = new T();
      for (let l = 0; l + 5 < s.length; l += 6) {
        h.set(s[l], s[l + 1], s[l + 2]), i.set(s[l + 3], s[l + 4], s[l + 5]);
        const u = Gn(h.x, h.y, h.z), d = Gn(i.x, i.y, i.z);
        if (!u || !d) continue;
        const M = d.x - u.x, y = d.y - u.y, w = M * M + y * y || 1e-9;
        let z = ((e - u.x) * M + (n - u.y) * y) / w;
        z = Math.max(0, Math.min(1, z));
        const F = Math.hypot(e - (u.x + z * M), n - (u.y + z * y));
        F < o && (o = F, a = h.clone().lerp(i, z), r = l / 6);
      }
      return r >= 0 && (me !== s && (pe = ae(s), me = s), ue = {
        S: s,
        adj: pe,
        s: r
      }), a;
    };
    let $e = null;
    window.__hekatanSeccionIfc = () => ce().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
      const n = ce(), s = [], o = Math.max(1, Math.floor(n.length / 6 / e));
      for (let a = 0; a + 2 < n.length; a += 6 * o) s.push([
        n[a],
        n[a + 1],
        n[a + 2]
      ]);
      return s;
    };
    const Ae = () => {
      le = null;
      const e = tt();
      if (e) return e;
      if (R) return S.intersectObjects([
        se
      ], false);
      if (ie.visible = !!window.__hekatanGridPlaneXZ, J.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Jt.visible) {
        const o = S.intersectObjects([
          Jt,
          tn,
          gn
        ], false);
        if (o.length > 0) return o;
      }
      const s = [
        se
      ];
      return ie.visible && s.push(ie), J.visible && s.push(J), Fn.visible && eo.length > 0 && s.push(...eo), S.intersectObjects(s, false);
    }, Le = new Oo(new De(), new jo()), je = new Oo(new De(), new jo({
      color: "gray",
      sizeAttenuation: false,
      size: 6
    })), We = new Oo(new De(), new jo({
      color: "orange",
      sizeAttenuation: false,
      size: 5
    }));
    m.add(We);
    const Ve = document.createElement("input");
    Ve.id = "hk-rubber-label", Ve.type = "text", Ve.spellcheck = false, Ve.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, Ve.style.cssText = [
      "position:fixed",
      "z-index:99996",
      "padding:3px 8px",
      "background:rgba(15,23,42,0.92)",
      "color:#22d3ee",
      "border:1.5px solid #22d3ee",
      "border-radius:4px",
      "font-family:Consolas,monospace",
      "font-size:13px",
      "font-weight:bold",
      "transform:translate(-50%,-50%)",
      "white-space:nowrap",
      "outline:none",
      "width:80px",
      "text-align:center",
      "display:none",
      "pointer-events:none"
    ].join(";") + ";", document.body.appendChild(Ve);
    const et = document.createElement("div");
    et.id = "hk-rubber-angle", et.style.cssText = [
      "position:fixed",
      "z-index:99996",
      "pointer-events:none",
      "padding:2px 6px",
      "background:rgba(15,23,42,0.92)",
      "color:#22d3ee",
      "border:1px solid #22d3ee",
      "border-radius:3px",
      "font-family:Consolas,monospace",
      "font-size:12px",
      "transform:translate(-50%,0)",
      "white-space:nowrap",
      "display:none"
    ].join(";") + ";", document.body.appendChild(et);
    let Pe = null, ot = null, Ye = false;
    const dt = new T(), Oe = (e, n, s, o, a, r) => {
      const h = o - e, i = a - n, l = r - s, u = Math.hypot(h, i, l);
      if (u < 0.01) {
        Ve.style.display = "none";
        return;
      }
      Pe = [
        e,
        n,
        s
      ], ot = [
        h / u,
        i / u,
        l / u
      ], dt.set((e + o) / 2, (n + a) / 2, (s + r) / 2), dt.project(g());
      const d = k.getBoundingClientRect(), M = d.left + (dt.x * 0.5 + 0.5) * d.width, y = d.top + (-dt.y * 0.5 + 0.5) * d.height;
      Ve.style.left = M + "px", Ve.style.top = y + "px", Ve.style.display = "block";
      const w = new T(e, n, s).project(g()), z = new T(o, a, r).project(g()), F = d.left + (w.x * 0.5 + 0.5) * d.width, f = d.top + (-w.y * 0.5 + 0.5) * d.height, p = d.left + (z.x * 0.5 + 0.5) * d.width, x = d.top + (-z.y * 0.5 + 0.5) * d.height;
      let _ = Math.atan2(-(x - f), p - F) * 180 / Math.PI;
      if (_ < 0 && (_ += 360), et.textContent = `${Math.round(_) % 360}\xB0`, et.style.left = p + "px", et.style.top = x + 34 + "px", et.style.display = "block", !Ye) {
        if (Ve.value = `${u.toFixed(2)} m`, document.activeElement !== Ve) {
          const $ = document.activeElement;
          $ && ($.tagName === "INPUT" || $.tagName === "TEXTAREA") && $ !== Ve || Ve.focus({
            preventScroll: true
          });
        }
        try {
          Ve.select();
        } catch {
        }
      }
    }, jt = () => {
      Ve.style.display = "none", et.style.display = "none", Pe = null, ot = null, Ye = false, document.activeElement === Ve && Ve.blur();
    }, wt = (e) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h;
      const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
      if (n === "offset") {
        Hn = e, Me(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), Ve.blur();
        try {
          (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
        } catch {
        }
        return;
      }
      if (n === "circle" && Qe.length === 1) {
        const d = Qe[0];
        Qe = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, d[0], d[1], d[2], e), Me(`\u2713 C\xEDrculo r=${e} m en (${d[0].toFixed(2)}, ${d[1].toFixed(2)}, ${d[2].toFixed(2)}).`);
        try {
          (_f = window.__hekatanRebuild) == null ? void 0 : _f.call(window);
        } catch {
        }
        try {
          (_g = window.__hekatanCadRefreshPrompt) == null ? void 0 : _g.call(window);
        } catch {
        }
        return;
      }
      if (n === "col" || n === "wall" || n === "extp" || n === "extl") {
        At = e, Me(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{
          col: "columna",
          wall: "pared",
          extp: "extrusi\xF3n punto\u2192l\xEDnea",
          extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea"
        }[n]}.`), Ve.blur();
        return;
      }
      if (!Pe || !ot || !t.polylines) return;
      let s = ot[0], o = ot[1], a = ot[2];
      zt === "x" ? (s = Math.sign(s) || 1, o = 0, a = 0) : zt === "y" ? (s = 0, o = Math.sign(o) || 1, a = 0) : zt === "z" && (s = 0, o = 0, a = Math.sign(a) || 1);
      const r = Pe[0] + s * e, h = Pe[1] + o * e, i = Pe[2] + a * e;
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [
        ...t.points.rawVal,
        [
          r,
          h,
          i
        ]
      ];
      const l = t.polylines.rawVal, u = l.length ? l[l.length - 1] : [];
      t.polylines.val = [
        ...l.slice(0, -1),
        [
          ...u,
          t.points.rawVal.length - 1
        ]
      ], Ve.blur();
      try {
        (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
      } catch {
      }
      v();
    }, ln = (e) => {
      let n = e.trim().toLowerCase().replace(/m$/g, "").trim();
      if (!n) return null;
      const s = n.startsWith("@");
      if (s && (n = n.slice(1)), n.includes("<")) {
        const a = n.split("<").map((r) => parseFloat(r.trim()));
        if (a.some(isNaN)) return null;
        if (a.length === 2) {
          const [r, h] = a;
          return s ? {
            kind: "relPolar",
            L: r,
            ang: h
          } : {
            kind: "absPolar",
            L: r,
            ang: h
          };
        }
        if (a.length === 3 && s) {
          const [r, h, i] = a;
          return {
            kind: "relSpherical",
            L: r,
            az: h,
            el: i
          };
        }
        return null;
      }
      if (n.includes(",")) {
        const a = n.split(",").map((l) => parseFloat(l.trim()));
        if (a.some(isNaN)) return null;
        const [r, h, i = 0] = a;
        return s ? {
          kind: "relCart",
          dx: r,
          dy: h,
          dz: i
        } : {
          kind: "absCart",
          x: r,
          y: h,
          z: i
        };
      }
      const o = parseFloat(n);
      return isNaN(o) || o <= 0 ? null : {
        kind: "length",
        L: o
      };
    }, Zt = (e) => {
      if (!e) return null;
      const n = window.__hekatanSCU ?? [
        0,
        0,
        0
      ];
      if (e.kind === "absCart") return [
        n[0] + e.x,
        n[1] + e.y,
        n[2] + e.z
      ];
      if (e.kind === "relCart") return Pe ? [
        Pe[0] + e.dx,
        Pe[1] + e.dy,
        Pe[2] + e.dz
      ] : null;
      if (e.kind === "absPolar") {
        const s = e.ang * Math.PI / 180;
        return [
          n[0] + e.L * Math.cos(s),
          n[1] + e.L * Math.sin(s),
          n[2]
        ];
      }
      if (e.kind === "relPolar") {
        if (!Pe) return null;
        const s = e.ang * Math.PI / 180;
        return [
          Pe[0] + e.L * Math.cos(s),
          Pe[1] + e.L * Math.sin(s),
          Pe[2]
        ];
      }
      if (e.kind === "relSpherical") {
        if (!Pe) return null;
        const s = e.az * Math.PI / 180, o = e.el * Math.PI / 180, a = e.L * Math.cos(o);
        return [
          Pe[0] + a * Math.cos(s),
          Pe[1] + a * Math.sin(s),
          Pe[2] + e.L * Math.sin(o)
        ];
      }
      return null;
    }, it = (e) => {
      var _a3, _b;
      _s(new T(e[0], e[1], e[2]), null), Pe = e, Ye = false;
      try {
        Ve.select();
      } catch {
      }
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      v();
      try {
        (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
      } catch {
      }
    };
    window.__hekatanTypeCoord = (e) => {
      var _a3;
      const n = ln(e);
      if (!n) return false;
      if (n.kind === "length") return wt(n.L), true;
      const s = Zt(n);
      if (!s) return false;
      _s(new T(s[0], s[1], s[2]), null), Pe = s, Ve.blur();
      try {
        (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return true;
    }, Ve.addEventListener("keydown", (e) => {
      var _a3, _b, _c;
      if (e.key === "Enter") {
        if (e.preventDefault(), !Ye) {
          (_a3 = window.__hekatanFinalizeDraw) == null ? void 0 : _a3.call(window);
          try {
            (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.setTool) == null ? void 0 : _c.call(_b, "select");
          } catch {
          }
          return;
        }
        const s = ln(Ve.value);
        if (!s) return;
        if (Ye = false, s.kind === "length") wt(s.L), Me(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
        else {
          const o = Zt(s);
          if (!o) return;
          it(o);
          const a = s.kind;
          Me(`\u270F ${a} \u2192 (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)})`);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault(), Ye = false, Ve.blur();
        return;
      }
      const n = e.key.toLowerCase();
      if (n === "x" || n === "y" || n === "z") {
        e.preventDefault(), setTimeout(() => {
          if (!Ye && Ve.style.display === "block") try {
            Ve.select();
          } catch {
          }
        }, 0);
        return;
      }
      (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (Ye = true);
    }), window.addEventListener("keydown", (e) => {
      if (!Pe || !ot || document.activeElement === Ve) return;
      const n = document.activeElement;
      n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (Ve.value = e.key, Ve.focus(), Ve.setSelectionRange(1, 1), e.preventDefault());
    });
    const Xe = document.createElement("div");
    Xe.id = "hk-coord-readout", Xe.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99997",
      "padding:4px 8px",
      "background:rgba(15,23,42,0.92)",
      "color:#22d3ee",
      "border:1px solid #22d3ee",
      "border-radius:4px",
      "font-family:Consolas,monospace",
      "font-size:11px",
      "transform:translate(12px,-22px)",
      "white-space:nowrap",
      "display:none"
    ].join(";") + ";", Xe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Xe);
    const Ke = document.createElement("div");
    Ke.id = "hk-coord-fixed", Ke.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99998",
      "right:80px",
      "top:10px",
      "padding:6px 14px",
      "background:rgba(15,23,42,0.92)",
      "color:#22d3ee",
      "border:1px solid rgba(34,211,238,0.55)",
      "border-radius:5px",
      "font-family:Consolas,monospace",
      "font-size:13px",
      "font-weight:500",
      "white-space:nowrap",
      "letter-spacing:0.3px",
      "box-shadow:0 2px 8px rgba(0,0,0,0.4)",
      "backdrop-filter:blur(4px)"
    ].join(";") + ";", Ke.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Ke);
    const Se = new Et(new De().setFromPoints([
      new T(0, 0, 0),
      new T(0, 0, 0)
    ]), new ro({
      color: 2282478,
      dashSize: 0.2,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    }));
    Se.frustumCulled = false, Se.visible = false, Se.name = "rubberBand", m.add(Se), window.__hekatanRubberBand = Se;
    const Fe = new Et(new De(), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.9
    }));
    Fe.frustumCulled = false, Fe.visible = false, m.add(Fe);
    let Ge = [];
    const nt = new Et(new De(), new mt({
      color: 16763904,
      transparent: true,
      opacity: 0.95
    }));
    nt.frustumCulled = false, nt.visible = false, nt.renderOrder = 999, m.add(nt);
    let lt = [];
    const st = document.createElement("div");
    st.id = "hk-measure-label", st.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(st);
    const rt = (e) => {
      var _a3, _b;
      const n = B(e);
      if (!n) return null;
      S.setFromCamera(E, n);
      let s = null, o = null;
      const a = S.intersectObjects(m.children, true).filter((y) => y.object.isMesh && y.object !== Mt && y.object !== ct && y.object.visible !== false);
      if (a.length) {
        const y = a[0], w = y.point;
        s = [
          w.x,
          w.y,
          w.z
        ];
        const F = (_b = (_a3 = y.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
        F && y.face && (o = [
          y.face.a,
          y.face.b,
          y.face.c
        ].map((f) => {
          const p = new T().fromBufferAttribute(F, f);
          return y.object.localToWorld(p), [
            p.x,
            p.y,
            p.z
          ];
        }));
      } else {
        const y = Ae();
        if (y.length) {
          const w = y[0].point;
          s = [
            w.x,
            w.y,
            w.z
          ];
        }
      }
      if (!s) return null;
      const r = k.getBoundingClientRect(), h = (y) => {
        const w = new T(y[0], y[1], y[2]).project(n);
        return [
          r.left + (w.x * 0.5 + 0.5) * r.width,
          r.top + (-w.y * 0.5 + 0.5) * r.height
        ];
      }, i = [
        e.clientX,
        e.clientY
      ], l = 14;
      let u = s, d = l;
      const M = (y) => {
        const w = h(y), z = Math.hypot(w[0] - i[0], w[1] - i[1]);
        z < d && (d = z, u = y);
      };
      for (const y of o ?? []) M(y);
      for (const y of t.points.rawVal) M(y);
      return u;
    }, St = () => {
      if (lt.length < 1) {
        st.style.display = "none";
        return;
      }
      const e = g(), n = lt[0], s = lt[1] ?? lt[0], a = new T((n[0] + s[0]) / 2, (n[1] + s[1]) / 2, (n[2] + s[2]) / 2).clone().project(e), r = k.getBoundingClientRect();
      st.style.left = r.left + (a.x * 0.5 + 0.5) * r.width + "px", st.style.top = r.top + (-a.y * 0.5 + 0.5) * r.height - 14 + "px", st.style.display = "block";
    };
    window.__hekatanMeasureRefresh = St, window.__hekatanClearMeasure = () => {
      lt = [], nt.visible = false, st.style.display = "none";
      try {
        v();
      } catch {
      }
    };
    try {
      (_a2 = b.addEventListener) == null ? void 0 : _a2.call(b, "change", St);
    } catch {
    }
    const ct = new ut(new De(), new gt({
      color: 16096779,
      transparent: true,
      opacity: 0.35,
      side: It,
      depthWrite: false
    }));
    ct.frustumCulled = false, ct.visible = false, ct.renderOrder = 998, ct.name = "hk-fill-preview", m.add(ct), k.addEventListener("pointerleave", () => {
      Xe.style.display = "none", ct.visible && (ct.visible = false, v());
    });
    const qt = (e) => {
      var _a3, _b, _c, _d;
      const n = t.points.rawVal, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Map(), a = (f, p) => {
        f !== p && ((o.get(f) ?? o.set(f, /* @__PURE__ */ new Set()).get(f)).add(p), (o.get(p) ?? o.set(p, /* @__PURE__ */ new Set()).get(p)).add(f));
      };
      for (const f of s) for (let p = 0; p + 1 < f.length; p++) a(f[p], f[p + 1]);
      const r = (f, p) => {
        var _a4;
        return !!((_a4 = o.get(f)) == null ? void 0 : _a4.has(p));
      }, h = [], i = /* @__PURE__ */ new Set(), l = [
        ...o.keys()
      ];
      for (const f of l) for (const p of o.get(f)) if (!(p < f)) {
        for (const x of o.get(p)) if (x !== f) for (const _ of o.get(x)) {
          if (_ === f || _ === p || !r(_, f) || r(f, x) || r(p, _)) continue;
          const $ = [
            f,
            p,
            x,
            _
          ].slice().sort((I, L) => I - L).join("-");
          i.has($) || (i.add($), h.push([
            f,
            p,
            x,
            _
          ]));
        }
      }
      for (const f of l) for (const p of o.get(f)) if (!(p < f)) for (const x of o.get(p)) {
        if (x === f || !r(x, f)) continue;
        const _ = [
          f,
          p,
          x
        ].slice().sort(($, I) => $ - I).join("-");
        i.has(_) || (i.add(_), h.push([
          f,
          p,
          x
        ]));
      }
      const u = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", d = (f) => u === "xy" ? [
        f[0],
        f[1]
      ] : u === "xz" ? [
        f[0],
        f[2]
      ] : [
        f[1],
        f[2]
      ], M = d(e), y = (f, p) => {
        let x = false;
        for (let _ = 0, $ = p.length - 1; _ < p.length; $ = _++) {
          const I = p[_][0], L = p[_][1], U = p[$][0], he = p[$][1];
          L > f[1] != he > f[1] && f[0] < (U - I) * (f[1] - L) / (he - L) + I && (x = !x);
        }
        return x;
      }, w = (f) => {
        let p = 0;
        for (let x = 0, _ = f.length - 1; x < f.length; _ = x++) p += (f[_][0] + f[x][0]) * (f[_][1] - f[x][1]);
        return Math.abs(p) / 2;
      };
      let z = null, F = 1 / 0;
      for (const f of h) {
        const p = f.map((_) => d(n[_]));
        if (!y(M, p)) continue;
        const x = w(p);
        x < F && (F = x, z = f);
      }
      return z;
    }, _t = new ft(), Xt = new ut(new Dn(1, 1), new gt({
      color: 2282478,
      transparent: true,
      opacity: 0.08,
      side: It,
      depthWrite: false
    })), Wt = new an(new ga(new Dn(1, 1)), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.85
    })), Rt = new an(new De(), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.3
    })), zn = (e, n) => {
      const s = [], o = Math.ceil(e / n);
      for (let a = -o; a <= o; a++) {
        const r = a * n;
        s.push(-e, r, 0, e, r, 0), s.push(r, -e, 0, r, e, 0);
      }
      Rt.geometry.dispose(), Rt.geometry = new De(), Rt.geometry.setAttribute("position", new Tt(s, 3));
    };
    _t.add(Xt, Wt, Rt), _t.visible = false, _t.frustumCulled = false, m.add(_t);
    const $t = new ft();
    $t.frustumCulled = false, $t.visible = false, m.add($t);
    const Vn = (e) => {
      const n = new De().setFromPoints([
        new T(0, 0, 0),
        new T(0, 0, 0)
      ]), s = new ro({
        color: e,
        dashSize: 0.15,
        gapSize: 0.08,
        transparent: true,
        opacity: 0.5,
        linewidth: 1
      });
      return new Et(n, s);
    }, yn = Vn(16711680), en = Vn(65280), Xn = Vn(35071);
    $t.add(yn, en, Xn);
    const Qn = [], as = (e) => e.traverse((n) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = n.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = n.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Kt = Vn(16761856);
    Kt.material.dashSize = 0.28, Kt.material.gapSize = 0.16, Kt.material.opacity = 0.9, Kt.frustumCulled = false, Kt.visible = false, Kt.renderOrder = 98, m.add(Kt);
    const uo = (e) => {
      const n = new De().setFromPoints([
        new T(0, 0, 0),
        new T(0, 0, 0),
        new T(0, 0, 0),
        new T(0, 0, 0)
      ]), s = new mt({
        color: e,
        transparent: true,
        opacity: 0.2,
        depthTest: false
      }), o = new Ta(n, s);
      return o.renderOrder = 997, o.frustumCulled = false, o;
    }, Un = uo(3462041), On = uo(16724804), Zn = uo(6333946), xn = new ft();
    xn.frustumCulled = false, xn.visible = false, m.add(xn), xn.add(Un, On, Zn);
    const fo = (e) => {
      const n = new Dn(1, 1), s = new gt({
        color: e,
        transparent: true,
        opacity: 0.06,
        side: It,
        depthWrite: false
      }), o = new ut(n, s);
      return o.frustumCulled = false, o.renderOrder = 996, o;
    }, Jt = fo(3462041), tn = fo(16724804), gn = fo(6333946);
    xn.add(Jt, tn, gn);
    const An = (e, n, s, o) => {
      e.scale.set(2 * o, 2 * o, 1), s === "xy" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, 0, 0)) : s === "xz" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, Math.PI / 2, 0));
    }, bn = document.createElement("div");
    bn.id = "hk-refplane-badge", bn.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99997",
      "padding:3px 10px",
      "border-radius:4px",
      "font-family:Consolas,monospace",
      "font-size:12px",
      "font-weight:bold",
      "transform:translate(20px,40px)",
      "white-space:nowrap",
      "display:none"
    ].join(";") + ";", document.body.appendChild(bn), window.__hekatanSetOrthoPlanes = (e) => {
      var _a3;
      if (window.__hekatanShowOrthoPlanes = e, xn.visible = e, e) {
        const n = window.__hekatanOrthoAnchor, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], r = n && n.length === 3 ? n : o.length > 0 && a[o[o.length - 1]] ? a[o[o.length - 1]] : [
          0,
          0,
          0
        ], h = window.__hekatanOrthoExt ?? 8;
        Cn(Un, r, "xy", h), Cn(On, r, "xz", h), Cn(Zn, r, "yz", h), An(Jt, r, "xy", h), An(tn, r, "xz", h), An(gn, r, "yz", h), Jt.material.opacity = 0.05, tn.material.opacity = 0.05, gn.material.opacity = 0.05;
      } else {
        const n = document.getElementById("hk-refplane-badge");
        n && (n.style.display = "none");
      }
      v();
    }, window.__hekatanSetOrthoExt = (e) => {
      var _a3;
      if (window.__hekatanOrthoExt = e, !xn.visible) {
        v();
        return;
      }
      const n = window.__hekatanOrthoAnchor, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], r = n && n.length === 3 ? n : o.length > 0 && a[o[o.length - 1]] ? a[o[o.length - 1]] : [
        0,
        0,
        0
      ];
      Cn(Un, r, "xy", e), Cn(On, r, "xz", e), Cn(Zn, r, "yz", e), An(Jt, r, "xy", e), An(tn, r, "xz", e), An(gn, r, "yz", e), v();
    };
    const Ns = (e) => {
      if (Jt.material.opacity = e === "xy" ? 0.09 : 0.025, tn.material.opacity = e === "xz" ? 0.09 : 0.025, gn.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
        const a = {
          xy: {
            bg: "rgba(52,211,153,0.90)",
            text: "#0a1f12"
          },
          xz: {
            bg: "rgba(255,51,68,0.90)",
            text: "#1f0a0e"
          },
          yz: {
            bg: "rgba(96,165,250,0.90)",
            text: "#0a1224"
          }
        }[e];
        bn.style.background = a.bg, bn.style.color = a.text, bn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, bn.style.display = "block";
      } else bn.style.display = "none";
    }, Cn = (e, n, s, o) => {
      let a;
      s === "xy" ? a = [
        new T(n[0] - o, n[1] - o, n[2]),
        new T(n[0] + o, n[1] - o, n[2]),
        new T(n[0] + o, n[1] + o, n[2]),
        new T(n[0] - o, n[1] + o, n[2]),
        new T(n[0] - o, n[1] - o, n[2])
      ] : s === "xz" ? a = [
        new T(n[0] - o, n[1], n[2] - o),
        new T(n[0] + o, n[1], n[2] - o),
        new T(n[0] + o, n[1], n[2] + o),
        new T(n[0] - o, n[1], n[2] + o),
        new T(n[0] - o, n[1], n[2] - o)
      ] : a = [
        new T(n[0], n[1] - o, n[2] - o),
        new T(n[0], n[1] + o, n[2] - o),
        new T(n[0], n[1] + o, n[2] + o),
        new T(n[0], n[1] - o, n[2] + o),
        new T(n[0], n[1] - o, n[2] - o)
      ], e.geometry.setFromPoints(a);
    };
    let zt = null;
    window.__hekatanAxisLock = () => zt;
    let jn = null, Dt = null;
    const Nt = document.createElement("div");
    Nt.id = "hk-axis-lock-badge", Nt.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99998",
      "padding:4px 10px",
      "border-radius:4px",
      "font-family:Consolas,monospace",
      "font-size:13px",
      "font-weight:bold",
      "transform:translate(20px,18px)",
      "white-space:nowrap",
      "display:none"
    ].join(";") + ";", document.body.appendChild(Nt);
    const Ys = () => {
      if (!zt) {
        Nt.style.display = "none";
        return;
      }
      const e = {
        x: "#ff3344",
        y: "#34d399",
        z: "#60a5fa"
      };
      Nt.style.background = "rgba(15,23,42,0.92)", Nt.style.color = e[zt], Nt.style.border = `1.5px solid ${e[zt]}`, Nt.textContent = `\u{1F512} LOCK ${zt.toUpperCase()}`, Nt.style.display = "block";
    };
    window.addEventListener("keydown", (e) => {
      var _a3, _b, _c, _d, _e, _f;
      const n = document.activeElement;
      if (n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n !== Ve) return;
      const s = e.key.toLowerCase(), o = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
      if (e.key === "Enter" && o === "polyarea" && Ge.length >= 3) {
        const a = To();
        Me(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), e.preventDefault();
        return;
      }
      if (s === "x" || s === "y" || s === "z") zt = zt === s ? null : s, Ys(), e.preventDefault();
      else if (e.key === "Escape") {
        const a = document.activeElement;
        a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Ms(), e.preventDefault();
      } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
    }), window.__hekatanToggleOsnap = () => {
      const e = !(window.__hekatanOsnapOn ?? true);
      window.__hekatanOsnapOn = e, e || Uo(), Me(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
    }, window.__hekatanTogglePolar = () => {
      const e = window.__hekatanPolarTrack === false;
      window.__hekatanPolarTrack = e, e || ($t.visible = false), Me(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
    }, window.__hekatanToggleOrtho = () => {
      var _a3;
      {
        window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
        const e = window.__hekatanOrthoMode;
        (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
        let n = document.getElementById("hk-ortho-frame");
        n || (n = document.createElement("div"), n.id = "hk-ortho-frame", n.style.cssText = [
          "position:fixed",
          "inset:0",
          "z-index:99996",
          "border:3px solid rgba(34,211,238,0.85)",
          "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)",
          "pointer-events:none"
        ].join(";") + ";", document.body.appendChild(n)), n.style.display = e ? "block" : "none";
        let s = document.getElementById("hk-ortho-badge");
        s || (s = document.createElement("div"), s.id = "hk-ortho-badge", s.style.cssText = [
          "position:fixed",
          "top:10px",
          "left:50%",
          "transform:translateX(-50%)",
          "z-index:99998",
          "padding:6px 16px",
          "background:rgba(34,211,238,0.95)",
          "color:#0a1f24",
          "border-radius:6px",
          "border:2px solid rgba(8,145,178,1)",
          "box-shadow:0 4px 16px rgba(34,211,238,0.5)",
          "font-family:Consolas,monospace",
          "font-size:13px",
          "font-weight:bold",
          "pointer-events:none",
          "white-space:nowrap"
        ].join(";") + ";", s.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(s)), s.style.display = e ? "block" : "none";
      }
    };
    const Ao = new T(), Co = new T(), Xs = new T(), Wa = (e) => {
      if (!zt) return null;
      const n = e[0], s = e[1], o = e[2];
      return zt === "x" ? (Ao.set(n - 1e4, s, o), Co.set(n + 1e4, s, o)) : zt === "y" ? (Ao.set(n, s - 1e4, o), Co.set(n, s + 1e4, o)) : (Ao.set(n, s, o - 1e4), Co.set(n, s, o + 1e4)), S.ray.distanceSqToSegment(Ao, Co, null, Xs), Xs;
    };
    window.__hekatanProjectOnAxis = Wa;
    const Gt = new Et(new De().setFromPoints([
      new T(0, 0, 0),
      new T(0, 0, 0)
    ]), new mt({
      color: 16724804,
      transparent: true,
      opacity: 0.95,
      linewidth: 4,
      depthTest: false
    }));
    Gt.renderOrder = 998, Gt.frustumCulled = false, Gt.visible = false, m.add(Gt);
    let hn = -1, In = -1, Tn = -1;
    const Je = /* @__PURE__ */ new Set();
    window.__hekatanSelection = Je;
    const Mn = new Et(new De().setFromPoints([
      new T(),
      new T()
    ]), new mt({
      color: 16766720,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }));
    Mn.renderOrder = 997, Mn.frustumCulled = false, Mn.visible = false, m.add(Mn);
    const rn = new ut(new co(0.02, 12, 12), new gt({
      color: 16766720,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    }));
    rn.renderOrder = 998, rn.visible = false, m.add(rn);
    const Fo = (e) => {
      const n = g();
      if (n.isOrthographicCamera) {
        const o = n, a = (o.top - o.bottom) / o.zoom;
        return Math.max(0.05, a * 6e-3);
      }
      const s = n.position.distanceTo(e);
      return Math.max(0.05, s / 10);
    }, Us = () => {
      rn.visible && rn.scale.setScalar(Fo(rn.position));
    }, vn = new ft();
    vn.frustumCulled = false, m.add(vn);
    const Eo = 2282478;
    let _n = null;
    const Ja = (e, n, s, o) => {
      if (!t.points) return -1;
      const a = t.points.rawVal;
      let r = -1, h = o;
      for (let i = 0; i < a.length; i++) {
        const l = a[i];
        if (!l) continue;
        const u = Math.hypot(e - l[0], n - l[1], s - l[2]);
        u < h && (h = u, r = i);
      }
      return r;
    }, cn = () => {
      var _a3, _b, _c, _d, _e, _f, _g, _h;
      for (; vn.children.length; ) {
        const h = vn.children.pop();
        (_b = (_a3 = h.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = h.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
      const e = ((_e = t.points) == null ? void 0 : _e.rawVal) ?? [], n = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], o = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
      for (const h of Je) {
        const [i, ...l] = h.split(":");
        if (i === "pt") {
          const u = e[+l[0]];
          if (!u) continue;
          const d = new ut(new co(0.025, 12, 12), new gt({
            color: Eo,
            transparent: true,
            opacity: 0.9,
            depthTest: false
          }));
          d.position.set(u[0], u[1], u[2]), d.renderOrder = 999, d.__isSelectionPt = true, vn.add(d);
        } else if (i === "seg") {
          const u = n[+l[0]], d = e[u == null ? void 0 : u[+l[1]]], M = e[u == null ? void 0 : u[+l[1] + 1]];
          if (!d || !M) continue;
          const y = new De().setFromPoints([
            new T(d[0], d[1], d[2]),
            new T(M[0], M[1], M[2])
          ]), w = new Et(y, new mt({
            color: Eo,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          w.renderOrder = 999, vn.add(w);
        } else if (i === "poly") {
          const d = n[+l[0]].map((w) => {
            const z = e[w];
            return z ? new T(z[0], z[1], z[2]) : null;
          }).filter(Boolean);
          if (d.length < 2) continue;
          const M = new De().setFromPoints(d), y = new Et(M, new mt({
            color: Eo,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          y.renderOrder = 999, vn.add(y);
        } else if (i === "aux") {
          const u = o[+l[0]];
          if (!u || u.length !== 6) continue;
          const d = new De().setFromPoints([
            new T(u[0], u[1], u[2]),
            new T(u[3], u[4], u[5])
          ]), M = new Et(d, new mt({
            color: Eo,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          M.renderOrder = 999, vn.add(M);
        }
      }
      const a = window.__hekatanUpdateSelectionPtScale;
      a && a();
      const r = window.__hekatanRefreshPropsPane;
      r && r();
      try {
        (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
      } catch {
      }
      v();
    };
    window.__hekatanRefreshSelection = cn, window.__hekatanSelectIds = (e) => {
      var _a3;
      Je.clear();
      for (const n of e) Je.add(n);
      try {
        (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return v(), Je.size;
    }, window.__hekatanClearSelection = () => {
      Je.clear(), cn();
    };
    const po = (e, n, s, o, a, r, h, i, l) => {
      const u = h - o, d = i - a, M = l - r, y = u * u + d * d + M * M;
      if (y < 1e-12) return Math.hypot(e - o, n - a, s - r);
      let w = ((e - o) * u + (n - a) * d + (s - r) * M) / y;
      w = Math.max(0, Math.min(1, w));
      const z = o + w * u, F = a + w * d, f = r + w * M;
      return Math.hypot(e - z, n - F, s - f);
    }, is = (e, n, s, o) => {
      if (!t.polylines) return null;
      const a = t.polylines.rawVal, r = t.points.rawVal;
      let h = -1, i = -1, l = o;
      for (let u = 0; u < a.length; u++) {
        const d = a[u];
        for (let M = 0; M < d.length - 1; M++) {
          const y = r[d[M]], w = r[d[M + 1]];
          if (!y || !w) continue;
          const z = po(e, n, s, y[0], y[1], y[2], w[0], w[1], w[2]);
          z < l && (l = z, h = u, i = M);
        }
      }
      return h >= 0 ? {
        polyIdx: h,
        segIdx: i,
        dist: l
      } : null;
    }, Zs = (e, n, s, o) => {
      const a = window.__hekatanDrawingAuxLines, r = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
      let h = -1, i = o;
      for (let l = 0; l < r.length; l++) {
        const u = r[l];
        if (!u || u.length !== 6) continue;
        const d = po(e, n, s, u[0], u[1], u[2], u[3], u[4], u[5]);
        d < i && (i = d, h = l);
      }
      return h;
    }, Qa = (e) => {
      const n = window.__hekatanDrawingAuxLines, o = ((n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [])[e];
      if (!o || o.length !== 6) {
        Gt.visible = false;
        return;
      }
      Gt.geometry.setFromPoints([
        new T(o[0], o[1], o[2]),
        new T(o[3], o[4], o[5])
      ]), Gt.visible = true;
    }, Oa = (e, n = -1) => {
      var _a3, _b;
      if (!t.polylines) return;
      const s = t.polylines.rawVal[e], o = t.points.rawVal;
      if (!s || s.length < 2) {
        Gt.visible = false;
        return;
      }
      const a = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, r = [];
      if (a || n < 0 || n >= s.length - 1) for (const h of s) {
        const i = o[h];
        i && r.push(new T(i[0], i[1], i[2]));
      }
      else {
        const h = o[s[n]], i = o[s[n + 1]];
        h && r.push(new T(h[0], h[1], h[2])), i && r.push(new T(i[0], i[1], i[2]));
      }
      Gt.geometry.setFromPoints(r), Gt.visible = true;
    }, $o = (e) => {
      var _a3;
      if (!t.polylines) return;
      const n = t.polylines.rawVal;
      if (e < 0 || e >= n.length) return;
      const s = n.filter((l, u) => u !== e), o = /* @__PURE__ */ new Set();
      for (const l of s) for (const u of l) o.add(u);
      const a = t.points.rawVal, r = /* @__PURE__ */ new Map(), h = [];
      for (let l = 0; l < a.length; l++) o.has(l) && (r.set(l, h.length), h.push(a[l]));
      const i = s.map((l) => l.map((u) => r.get(u)).filter((u) => u !== void 0));
      t.points.val = h, t.polylines.val = i, t.areas && (t.areas.val = t.areas.rawVal.filter((l) => l !== e).map((l) => l > e ? l - 1 : l)), Gt.visible = false, hn = -1, In = -1;
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
    }, qs = (e, n) => {
      var _a3, _b, _c;
      if (!t.polylines) return;
      const s = t.polylines.rawVal;
      if (e < 0 || e >= s.length) return;
      if (((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
        $o(e);
        return;
      }
      const a = s[e];
      if (n < 0 || n >= a.length - 1) return;
      if (a.length === 2) {
        $o(e);
        return;
      }
      let r;
      n === 0 ? r = [
        a.slice(1)
      ] : n === a.length - 2 ? r = [
        a.slice(0, -1)
      ] : r = [
        a.slice(0, n + 1),
        a.slice(n + 1)
      ];
      const h = [
        ...s.slice(0, e),
        ...r,
        ...s.slice(e + 1)
      ], i = /* @__PURE__ */ new Set();
      for (const y of h) for (const w of y) i.add(w);
      const l = t.points.rawVal, u = /* @__PURE__ */ new Map(), d = [];
      for (let y = 0; y < l.length; y++) i.has(y) && (u.set(y, d.length), d.push(l[y]));
      const M = h.map((y) => y.map((w) => u.get(w)).filter((w) => w !== void 0));
      if (t.points.val = d, t.polylines.val = M, t.areas) {
        const y = r.length - 1;
        t.areas.val = t.areas.rawVal.map((w) => w > e ? w + y : w);
      }
      Gt.visible = false, hn = -1, In = -1;
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
    };
    Le.geometry.setAttribute("position", new Tt(t.points.rawVal.flat(), 3)), Le.geometry.computeBoundingSphere(), Le.frustumCulled = false, je.frustumCulled = false, m.add(je), se.position.set(0, 0, 0), se.rotateX(Math.PI / 2), se.geometry.rotateX(Math.PI / 2), se.updateMatrixWorld(), t.polylines && (t.polylines.val = [
      ...t.polylines.rawVal,
      []
    ]), window.__hekatanDrawAt = (e, n, s) => {
      if (t.points.val = [
        ...t.points.rawVal,
        [
          e,
          n,
          s
        ]
      ], t.polylines) {
        const o = t.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
        t.polylines.val = [
          ...o.slice(0, -1),
          [
            ...a,
            t.points.rawVal.length - 1
          ]
        ];
      }
    }, window.__hekatanDrawNewPoly = () => {
      var _a3;
      if (!t.polylines) return;
      const e = t.polylines.rawVal;
      ((_a3 = e[e.length - 1]) == null ? void 0 : _a3.length) !== 0 && (t.polylines.val = [
        ...e,
        []
      ]);
    };
    const Lo = [];
    window.__hekatanCirculos = Lo;
    let Ks = [], Gs = "";
    const Hs = () => {
      var _a3;
      const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], s = `${e.length}|${n.length}|${n.reduce((a, r) => a + r.length, 0)}`;
      if (s === Gs) return Ks;
      Gs = s;
      const o = [];
      for (const a of n) {
        const r = a.length;
        if (r < 6 || a[0] !== a[r - 1]) continue;
        const h = a.slice(0, r - 1).map((d) => e[d]).filter(Boolean);
        if (h.length < 5) continue;
        const i = [
          0,
          1,
          2
        ].map((d) => h.reduce((M, y) => M + y[d], 0) / h.length), l = h.map((d) => Math.hypot(d[0] - i[0], d[1] - i[1], d[2] - i[2])), u = l.reduce((d, M) => d + M, 0) / l.length;
        u < 1e-9 || l.some((d) => Math.abs(d - u) > 5e-3 * u) || o.push({
          c: i,
          r: u
        });
      }
      return Ks = o;
    };
    window.__hekatanCentrosDeducidos = Hs;
    const Vo = () => !!window.__hekatanCurvasAux, Io = (e, n) => {
      const s = window.__hekatanDrawingAuxLines;
      if (!s) return 0;
      Pt();
      const o = s.rawVal ?? s.val ?? [], a = [];
      for (let r = 0; r + 1 < e.length; r++) a.push([
        ...e[r],
        ...e[r + 1]
      ]);
      return n && e.length > 2 && a.push([
        ...e[e.length - 1],
        ...e[0]
      ]), s.val = [
        ...o,
        ...a
      ], a.length;
    };
    window.__hekatanDrawCircle = (e, n, s, o, a = window.__hekatanArcSegs ?? 12, r = "xy") => {
      var _a3;
      const h = Math.max(4, Math.round(a)), i = t.points.rawVal.length, l = [];
      for (let u = 0; u < h; u++) {
        const d = 2 * Math.PI * u / h, M = o * Math.cos(d), y = o * Math.sin(d);
        let w;
        r === "xy" ? w = [
          e + M,
          n + y,
          s
        ] : r === "xz" ? w = [
          e + M,
          n,
          s + y
        ] : w = [
          e,
          n + M,
          s + y
        ], l.push(w);
      }
      if (Lo.push({
        c: [
          e,
          n,
          s
        ],
        r: o
      }), Vo()) {
        Io(l, true);
        return;
      }
      if (t.points.val = [
        ...t.points.rawVal,
        ...l
      ], t.polylines) {
        const u = [
          ...l.map((M, y) => i + y),
          i
        ], d = t.polylines.rawVal;
        ((_a3 = d[d.length - 1]) == null ? void 0 : _a3.length) > 0 ? t.polylines.val = [
          ...d,
          u,
          []
        ] : t.polylines.val = [
          ...d.slice(0, -1),
          u,
          []
        ];
      }
    }, window.__hekatanDrawArc = (e, n, s, o = window.__hekatanArcSegs ?? 12) => {
      var _a3;
      const a = Math.max(4, Math.round(o)), r = new T(...e), h = new T(...n), i = new T(...s), l = new T().subVectors(h, r), u = new T().subVectors(i, r), d = new T().crossVectors(l, u), M = 2 * d.lengthSq();
      let y;
      if (M < 1e-12) y = new T().addVectors(r, i).multiplyScalar(0.5);
      else {
        const ge = u.clone().multiplyScalar(l.lengthSq()).sub(l.clone().multiplyScalar(u.lengthSq())), Ce = new T().crossVectors(ge, d);
        y = r.clone().add(Ce.divideScalar(M));
      }
      const w = r.distanceTo(y), z = d.lengthSq() > 1e-12 ? d.clone().normalize() : new T(0, 1, 0), F = new T().subVectors(r, y).normalize(), f = new T().crossVectors(z, F).normalize(), p = (ge) => {
        const Ce = new T().subVectors(ge, y);
        return Math.atan2(Ce.dot(f), Ce.dot(F));
      }, x = (ge) => {
        let Ce = ge;
        for (; Ce < 0; ) Ce += 2 * Math.PI;
        for (; Ce >= 2 * Math.PI; ) Ce -= 2 * Math.PI;
        return Ce;
      }, _ = x(p(h)), $ = x(p(i)), I = _ <= $ ? $ : $ - 2 * Math.PI, L = t.points.rawVal.length, U = [], he = (ge) => {
        const Ce = F.clone().multiplyScalar(Math.cos(ge)).add(f.clone().multiplyScalar(Math.sin(ge)));
        return y.clone().add(Ce.multiplyScalar(w));
      }, X = String(window.__hekatanArcModo ?? "angulo"), K = X === "x" ? 0 : X === "y" ? 1 : X === "z" ? 2 : -1;
      let fe = false;
      if (K >= 0) {
        const ge = e[K], Ce = s[K], Re = 512;
        let _e = Math.abs(Ce - ge) > 1e-9, Be = ge;
        for (let Ie = 1; Ie <= Re && _e; Ie++) {
          const qe = he(I * Ie / Re).getComponent(K);
          (qe - Be) * (Ce - ge) < -1e-9 && (_e = false), Be = qe;
        }
        if (_e) {
          fe = true;
          for (let Ie = 0; Ie <= a; Ie++) {
            const qe = ge + (Ce - ge) * Ie / a;
            let Ne = 0, Te = I;
            for (let He = 0; He < 60; He++) {
              const pt = (Ne + Te) / 2;
              (he(pt).getComponent(K) - qe) * (Ce - ge) < 0 ? Ne = pt : Te = pt;
            }
            const Ze = he((Ne + Te) / 2);
            U.push([
              Ze.x,
              Ze.y,
              Ze.z
            ]);
          }
          U[0] = [
            e[0],
            e[1],
            e[2]
          ], U[a] = [
            s[0],
            s[1],
            s[2]
          ];
        } else try {
          (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${X.toUpperCase()}: reparto por \xE1ngulo.`);
        } catch {
        }
      }
      if (!fe) for (let ge = 0; ge <= a; ge++) {
        const Ce = he(I * (ge / a));
        U.push([
          Ce.x,
          Ce.y,
          Ce.z
        ]);
      }
      if (Lo.push({
        c: [
          y.x,
          y.y,
          y.z
        ],
        r: w
      }), Vo()) {
        Io(U, false);
        return;
      }
      if (t.points.val = [
        ...t.points.rawVal,
        ...U
      ], t.polylines) {
        const ge = U.map((Re, _e) => L + _e), Ce = t.polylines.rawVal;
        t.polylines.val = [
          ...Ce.slice(0, -1),
          ge,
          []
        ];
      }
    };
    const Ws = () => {
      var _a3;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
      for (let n = e.length - 1; n >= 0; n--) if (e[n] && e[n].length >= 2) return {
        i: n,
        pl: e[n]
      };
      return null;
    };
    window.__hekatanDividir = (e) => {
      var _a3;
      const n = Math.round(e);
      if (!(n >= 2)) return {
        ok: false,
        msg: "el n\xFAmero de partes va de 2 en adelante"
      };
      const s = Ws();
      if (!s) return {
        ok: false,
        msg: "no hay ninguna polil\xEDnea que dividir"
      };
      window.__hekatanPushUndo && window.__hekatanPushUndo();
      const o = [
        ...t.points.rawVal
      ], a = [
        s.pl[0]
      ];
      let r = 0;
      for (let i = 0; i + 1 < s.pl.length; i++) {
        const l = o[s.pl[i]], u = o[s.pl[i + 1]];
        r += Math.hypot(u[0] - l[0], u[1] - l[1], u[2] - l[2]);
        for (let d = 1; d < n; d++) {
          const M = d / n;
          o.push([
            l[0] + (u[0] - l[0]) * M,
            l[1] + (u[1] - l[1]) * M,
            l[2] + (u[2] - l[2]) * M
          ]), a.push(o.length - 1);
        }
        a.push(s.pl[i + 1]);
      }
      const h = [
        ...t.polylines.rawVal
      ];
      h[s.i] = a, t.points.val = o, t.polylines.val = h;
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return v(), {
        ok: true,
        tramosAntes: s.pl.length - 1,
        tramosAhora: a.length - 1,
        nudosNuevos: a.length - s.pl.length,
        largo: +r.toFixed(4),
        tramoMedio: +(r / (a.length - 1)).toFixed(4)
      };
    }, window.__hekatanDesfasarCurva = (e) => {
      var _a3, _b, _c, _d;
      if (!isFinite(e) || Math.abs(e) < 1e-9) return {
        ok: false,
        msg: "la distancia no puede ser cero"
      };
      const n = Ws();
      if (!n) return {
        ok: false,
        msg: "no hay ninguna polil\xEDnea que desfasar"
      };
      const s = t.points.rawVal, o = n.pl.map((w) => new T(...s[w])), a = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy"), r = new T(...a === "xz" ? [
        0,
        1,
        0
      ] : a === "yz" ? [
        1,
        0,
        0
      ] : [
        0,
        0,
        1
      ]), h = (w, z) => {
        const F = new T().subVectors(z, w), f = new T().crossVectors(r, F);
        return f.lengthSq() < 1e-18 ? null : f.normalize();
      }, i = o.map((w, z) => {
        const F = z > 0 ? h(o[z - 1], o[z]) : null, f = z + 1 < o.length ? h(o[z], o[z + 1]) : null;
        if (F && f) {
          const p = F.clone().add(f);
          if (p.lengthSq() < 1e-12) return F;
          p.normalize();
          const x = p.dot(F);
          return p.multiplyScalar(Math.abs(x) < 1e-6 ? 1 : 1 / x);
        }
        return F ?? f;
      });
      if (i.some((w) => w === null)) return {
        ok: false,
        msg: "la curva es perpendicular al plano de trabajo; cambie de plano"
      };
      window.__hekatanPushUndo && window.__hekatanPushUndo();
      const l = [
        ...s
      ], u = [];
      o.forEach((w, z) => {
        const F = w.clone().addScaledVector(i[z], e);
        l.push([
          F.x,
          F.y,
          F.z
        ]), u.push(l.length - 1);
      });
      const d = [
        ...t.polylines.rawVal
      ];
      d.length && d[d.length - 1].length === 0 && d.pop(), d.push(u, []), t.points.val = l, t.polylines.val = d;
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      v();
      let M = 1 / 0, y = -1 / 0;
      for (let w = 0; w + 1 < o.length; w++) {
        const z = o[w], F = o[w + 1], f = h(z, F), p = new T(...l[u[w]]), x = Math.abs(new T().subVectors(p, z).dot(f));
        M = Math.min(M, x), y = Math.max(y, x);
      }
      return {
        ok: true,
        vertices: u.length,
        distancia: +e.toFixed(4),
        separacionMin: +M.toFixed(5),
        separacionMax: +y.toFixed(5)
      };
    }, window.__hekatanDrawCercha = (e) => {
      var _a3, _b;
      const n = e.luz, s = e.flecha, o = e.canto, a = Math.max(2, Math.round(e.panos)), r = e.tipo ?? "montantes", h = e.x0 ?? 0, i = e.y0 ?? 0, l = e.base ?? 0, u = Math.max(1, Math.round(e.copias ?? 1)), d = e.sep ?? 0;
      if (!(n > 0) || !(s > 0) || !(o > 0)) return {
        ok: false,
        msg: "luz, flecha y canto tienen que ser positivos"
      };
      const M = (n * n / 4 + s * s) / (2 * s);
      if (o >= M) return {
        ok: false,
        msg: `el canto (${o} m) no puede llegar al radio (${M.toFixed(3)} m)`
      };
      const y = 2 * Math.asin(Math.min(1, n / 2 / M)), w = l - (M - s), z = Math.atan2(l - w, h - (h + n / 2)), F = Math.atan2(l - w, h + n - (h + n / 2)), f = h + n / 2, p = (_e, Be, Ie) => [
        f + Be * Math.cos(_e),
        Ie,
        w + Be * Math.sin(_e)
      ];
      window.__hekatanPushUndo && window.__hekatanPushUndo();
      const x = [
        ...t.points.rawVal
      ], _ = [
        ...((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []
      ];
      _.length && _[_.length - 1].length === 0 && _.pop();
      const $ = (_e) => (x.push(_e), x.length - 1), I = (_e, Be) => {
        _.push([
          _e,
          Be
        ]);
      }, L = [];
      let U = 0, he = 0;
      for (let _e = 0; _e < u; _e++) {
        const Be = i + _e * d, Ie = [], qe = [];
        for (let Ne = 0; Ne <= a; Ne++) {
          const Te = z + (F - z) * (Ne / a);
          Ie.push($(p(Te, M, Be))), qe.push($(p(Te, M - o, Be)));
        }
        L.push(Ie), _.push([
          ...Ie
        ]), _.push([
          ...qe
        ]), I(Ie[0], qe[0]), I(Ie[a], qe[a]), he += 2;
        for (let Ne = 1; Ne < a; Ne++) if ((r === "montantes" || r === "howe") && (I(Ie[Ne], qe[Ne]), he++), r === "warren") Ne % 2 === 1 && (I(qe[Ne - 1], Ie[Ne]), I(Ie[Ne], qe[Ne + 1]), U += 2);
        else if (r === "howe") {
          const Te = Ne < a / 2 ? 1 : -1;
          I(qe[Ne], Ie[Ne + Te]), U++;
        }
      }
      if (e.correas && u > 1) for (let _e = 0; _e + 1 < u; _e++) for (let Be = 0; Be <= a; Be++) I(L[_e][Be], L[_e + 1][Be]);
      _.push([]), t.points.val = x, t.polylines && (t.polylines.val = _);
      try {
        (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
      } catch {
      }
      v();
      const X = (_e, Be) => p(z + (F - z) * (_e / a), Be, 0), K = (_e, Be) => Math.hypot(_e[0] - Be[0], _e[1] - Be[1], _e[2] - Be[2]), fe = [], ge = [], Ce = [];
      for (let _e = 0; _e < a; _e++) {
        fe.push(K(X(_e, M), X(_e + 1, M))), ge.push(K(X(_e, M - o), X(_e + 1, M - o)));
        const Be = [
          X(_e + 1, M)[0] - X(_e, M - o)[0],
          0,
          X(_e + 1, M)[2] - X(_e, M - o)[2]
        ];
        Ce.push(Math.atan2(Be[2], Be[0]) * 180 / Math.PI);
      }
      const Re = (_e) => +_e.toFixed(3);
      return {
        ok: true,
        luz: Re(n),
        flecha: Re(s),
        canto: Re(o),
        radio: Re(M),
        anguloAbarcado: Re(y * 180 / Math.PI),
        clave: Re(l + s),
        centro: [
          Re(f),
          Re(i),
          Re(w)
        ],
        panos: a,
        tipo: r,
        cerchas: u,
        separacion: Re(d),
        desarrolloSup: Re(M * y),
        desarrolloInf: Re((M - o) * y),
        tramoSupMin: Re(Math.min(...fe)),
        tramoSupMax: Re(Math.max(...fe)),
        tramoInfMin: Re(Math.min(...ge)),
        tramoInfMax: Re(Math.max(...ge)),
        anguloDiagMin: Re(Math.min(...Ce)),
        anguloDiagMax: Re(Math.max(...Ce)),
        montantes: he,
        diagonales: U,
        nudosNuevos: 2 * (a + 1) * u
      };
    }, window.__hekatanDrawPolinomio = (e, n = window.__hekatanArcSegs ?? 12) => {
      var _a3, _b, _c, _d;
      const s = e.length;
      if (s < 2) return {
        ok: false,
        msg: "faltan puntos"
      };
      const o = Math.max(s - 1, Math.round(n)), a = (I) => Math.max(...e.map((L) => L[I])) - Math.min(...e.map((L) => L[I])), r = [
        a(0),
        a(1),
        a(2)
      ], h = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), i = h === "xy" ? 2 : h === "xz" ? 1 : h === "yz" ? 0 : -1, l = i >= 0 && r[i] < 1e-6 ? i : r[2] <= r[0] && r[2] <= r[1] ? 2 : r[1] <= r[0] ? 1 : 0, u = l === 2 ? "xy" : l === 1 ? "xz" : "yz", d = [
        0,
        1,
        2
      ].filter((I) => I !== l), [M, y] = r[d[0]] >= r[d[1]] ? d : [
        d[1],
        d[0]
      ], w = e.map((I) => I[M]), z = e.map((I) => I[y]);
      for (let I = 0; I < s; I++) for (let L = I + 1; L < s; L++) if (Math.abs(w[I] - w[L]) < 1e-9) return {
        ok: false,
        msg: `dos puntos con la misma abscisa (${"XYZ"[M]} en ${u.toUpperCase()}): no hay polinomio que pase por los dos`
      };
      const F = (I) => {
        let L = 0;
        for (let U = 0; U < s; U++) {
          let he = 1;
          for (let X = 0; X < s; X++) X !== U && (he *= (I - w[X]) / (w[U] - w[X]));
          L += z[U] * he;
        }
        return L;
      }, f = (() => {
        const I = s, L = w.map((X) => Array.from({
          length: I
        }, (K, fe) => X ** fe)), U = z.slice();
        for (let X = 0; X < I; X++) {
          let K = X;
          for (let fe = X + 1; fe < I; fe++) Math.abs(L[fe][X]) > Math.abs(L[K][X]) && (K = fe);
          [L[X], L[K]] = [
            L[K],
            L[X]
          ], [U[X], U[K]] = [
            U[K],
            U[X]
          ];
          for (let fe = X + 1; fe < I; fe++) {
            const ge = L[fe][X] / L[X][X];
            for (let Ce = X; Ce < I; Ce++) L[fe][Ce] -= ge * L[X][Ce];
            U[fe] -= ge * U[X];
          }
        }
        const he = new Array(I).fill(0);
        for (let X = I - 1; X >= 0; X--) {
          let K = U[X];
          for (let fe = X + 1; fe < I; fe++) K -= L[X][fe] * he[fe];
          he[X] = K / L[X][X];
        }
        return he;
      })(), p = w[0], x = w[s - 1], _ = t.points.rawVal.length, $ = [];
      for (let I = 0; I <= o; I++) {
        const L = p + (x - p) * I / o, U = [
          e[0][0],
          e[0][1],
          e[0][2]
        ];
        U[M] = L, U[y] = F(L), U[l] = e[0][l], $.push(U);
      }
      if ($[0] = [
        e[0][0],
        e[0][1],
        e[0][2]
      ], $[o] = [
        e[s - 1][0],
        e[s - 1][1],
        e[s - 1][2]
      ], Vo()) return Io($, false), {
        ok: true,
        plano: u,
        coef: f,
        ia: M,
        io: y
      };
      if (t.points.val = [
        ...t.points.rawVal,
        ...$
      ], t.polylines) {
        const I = $.map((U, he) => _ + he), L = t.polylines.rawVal;
        t.polylines.val = ((_d = L[L.length - 1]) == null ? void 0 : _d.length) > 0 ? [
          ...L,
          I,
          []
        ] : [
          ...L.slice(0, -1),
          I,
          []
        ];
      }
      return {
        ok: true,
        plano: u,
        coef: f,
        ia: M,
        io: y
      };
    };
    const Js = () => {
      var _a3, _b;
      const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], s = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), o = window.__hekatanDrawingAuxLines, a = (o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? [], r = [], h = [], i = /* @__PURE__ */ new Set(), l = (u) => [
        e[u][0],
        e[u][1],
        e[u][2]
      ];
      return [
        ...Je
      ].forEach((u) => {
        const d = u.split(":");
        if (d[0] === "aux") {
          const y = a[+d[1]];
          y && y.length === 6 && (r.push([
            [
              y[0],
              y[1],
              y[2]
            ],
            [
              y[3],
              y[4],
              y[5]
            ]
          ]), h.push(u));
          return;
        }
        const M = d[0] === "poly" || d[0] === "seg" ? +d[1] : -1;
        if (!(M < 0 || !n[M] || s.has(M))) if (d[0] === "poly") {
          if (i.has(M)) return;
          i.add(M);
          for (let y = 0; y + 1 < n[M].length; y++) r.push([
            l(n[M][y]),
            l(n[M][y + 1])
          ]);
        } else {
          const y = n[M][+d[2]], w = n[M][+d[2] + 1];
          y != null && w != null && !i.has(M) && r.push([
            l(y),
            l(w)
          ]);
        }
      }), {
        segs: r,
        auxIds: h
      };
    }, ho = (e, n) => Math.abs(e[0] - n[0]) < 1e-6 && Math.abs(e[1] - n[1]) < 1e-6 && Math.abs(e[2] - n[2]) < 1e-6, ja = (e) => {
      const n = new Array(e.length).fill(false), s = [];
      for (let o = 0; o < e.length; o++) {
        if (n[o]) continue;
        n[o] = true;
        const a = [
          e[o][0],
          e[o][1]
        ];
        let r = true;
        for (; r; ) {
          r = false;
          for (let i = 0; i < e.length; i++) {
            if (n[i]) continue;
            const [l, u] = e[i], d = a[a.length - 1], M = a[0];
            ho(l, d) ? (a.push(u), n[i] = true, r = true) : ho(u, d) ? (a.push(l), n[i] = true, r = true) : ho(u, M) ? (a.unshift(l), n[i] = true, r = true) : ho(l, M) && (a.unshift(u), n[i] = true, r = true);
          }
        }
        const h = a.length > 3 && ho(a[0], a[a.length - 1]);
        h && a.pop(), s.push({
          pts: a,
          cerrada: h
        });
      }
      return s;
    }, ls = (e, n) => {
      let s = e.findIndex((o) => Math.abs(o[0] - n[0]) < 1e-3 && Math.abs(o[1] - n[1]) < 1e-3 && Math.abs(o[2] - n[2]) < 1e-3);
      return s < 0 && (s = e.length, e.push(n)), s;
    }, Qs = (e) => {
      if (!e.length) return 0;
      Je.clear(), e.forEach((s) => Je.add(s));
      const n = e.length;
      return ms(), Je.clear(), n;
    };
    window.__hekatanRevolveSelection = (e, n, s, o = 360) => {
      var _a3, _b, _c;
      const a = Math.max(3, Math.round(s || 16)), r = Math.abs(o - 360) < 1e-9, h = a, i = r ? a : a + 1, { segs: l, auxIds: u } = Js();
      if (!l.length) return {
        anillos: 0,
        areas: 0,
        polo: false,
        guias: 0,
        msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)"
      };
      if (r && a % 2) return {
        anillos: 0,
        areas: 0,
        polo: false,
        guias: 0,
        msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)"
      };
      Pt();
      const d = t.points.rawVal, M = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], y = [
        ...d
      ];
      let w = M.slice();
      w.length && w[w.length - 1].length === 0 && (w = w.slice(0, -1));
      const z = [
        ...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []
      ], F = /* @__PURE__ */ new Map(), f = (U) => U.map((he) => Math.round(he * 1e4)).join(","), p = (U) => Math.hypot(U[0] - e, U[1] - n) < 1e-6, x = (U) => {
        const he = f(U);
        let X = F.get(he);
        if (X) return X;
        if (p(U)) return X = [
          ls(y, U)
        ], F.set(he, X), X;
        const K = Math.hypot(U[0] - e, U[1] - n), fe = Math.atan2(U[1] - n, U[0] - e);
        X = [];
        for (let ge = 0; ge < i; ge++) {
          const Ce = fe + o * Math.PI / 180 * ge / a;
          X.push(ls(y, ge === 0 ? U : [
            e + K * Math.cos(Ce),
            n + K * Math.sin(Ce),
            U[2]
          ]));
        }
        return F.set(he, X), X;
      };
      let _ = 0, $ = false;
      const I = (U) => {
        z.push(w.length), w.push([
          ...U,
          U[0]
        ]), _++;
      };
      for (const [U, he] of l) {
        const X = x(U), K = x(he);
        if (!(X.length === 1 && K.length === 1)) {
          if (X.length === 1 || K.length === 1) {
            $ = true;
            const fe = X.length === 1 ? X[0] : K[0], ge = X.length === 1 ? K : X;
            for (let Ce = 0; Ce + 2 <= h; Ce += 2) I([
              fe,
              ge[Ce % i],
              ge[(Ce + 1) % i],
              ge[(Ce + 2) % i]
            ]);
            continue;
          }
          for (let fe = 0; fe < h; fe++) I([
            X[fe],
            K[fe],
            K[(fe + 1) % i],
            X[(fe + 1) % i]
          ]);
        }
      }
      w.push([]), t.points.val = y, t.polylines && (t.polylines.val = w), t.areas && (t.areas.val = z);
      const L = Qs(u);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      return v(), {
        anillos: F.size,
        areas: _,
        polo: $,
        guias: L
      };
    }, window.__hekatanLoftSelection = (e, n) => {
      var _a3, _b, _c;
      const { segs: s, auxIds: o } = Js(), a = ja(s), r = (K) => K.pts.every((fe) => Math.abs(fe[2] - K.pts[0][2]) < 1e-6), h = a.find((K) => K.cerrada && r(K)), i = a.find((K) => !K.cerrada && K.pts.length >= 2 && !r(K));
      if (!h) return {
        contorno: 0,
        perfil: 0,
        areas: 0,
        guias: 0,
        msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n"
      };
      if (!i) return {
        contorno: 0,
        perfil: 0,
        areas: 0,
        guias: 0,
        msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n"
      };
      const l = h.pts, u = l.length, d = i.pts.slice();
      d[d.length - 1][2] < d[0][2] && d.reverse();
      let M = 0;
      for (let K = 0; K < u; K++) {
        const fe = l[K], ge = l[(K + 1) % u];
        M += fe[0] * ge[1] - ge[0] * fe[1];
      }
      const y = M > 0 ? 1 : -1, w = (K) => {
        const fe = l[(K - 1 + u) % u], ge = l[K], Ce = l[(K + 1) % u], Re = [
          ge[0] - fe[0],
          ge[1] - fe[1]
        ], _e = [
          Ce[0] - ge[0],
          Ce[1] - ge[1]
        ], Be = Math.hypot(Re[0], Re[1]) || 1, Ie = Math.hypot(_e[0], _e[1]) || 1, qe = [
          y * Re[1] / Be,
          -y * Re[0] / Be
        ], Ne = [
          y * _e[1] / Ie,
          -y * _e[0] / Ie
        ], Te = 1 + (qe[0] * Ne[0] + qe[1] * Ne[1]);
        return [
          (qe[0] + Ne[0]) / Math.max(Te, 1e-6),
          (qe[1] + Ne[1]) / Math.max(Te, 1e-6)
        ];
      }, z = l.map((K, fe) => w(fe)), F = d[0];
      let f = [
        0,
        0
      ], p = 0;
      for (const K of d) {
        const fe = K[0] - F[0], ge = K[1] - F[1], Ce = Math.hypot(fe, ge);
        Ce > p && (p = Ce, f = [
          fe / Ce,
          ge / Ce
        ]);
      }
      if (p < 1e-9) {
        const K = F[0] - e, fe = F[1] - n, ge = Math.hypot(K, fe) || 1;
        f = [
          K / ge,
          fe / ge
        ];
      }
      f[0] * (F[0] - e) + f[1] * (F[1] - n) < 0 && (f = [
        -f[0],
        -f[1]
      ]), Pt();
      const x = t.points.rawVal, _ = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], $ = [
        ...x
      ];
      let I = _.slice();
      I.length && I[I.length - 1].length === 0 && (I = I.slice(0, -1));
      const L = [
        ...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []
      ], U = d.map((K) => {
        const fe = (K[0] - F[0]) * f[0] + (K[1] - F[1]) * f[1], ge = K[2];
        return l.map((Ce, Re) => ls($, [
          Ce[0] + z[Re][0] * fe,
          Ce[1] + z[Re][1] * fe,
          ge
        ]));
      });
      let he = 0;
      for (let K = 0; K + 1 < U.length; K++) for (let fe = 0; fe < u; fe++) {
        const ge = [
          U[K][fe],
          U[K][(fe + 1) % u],
          U[K + 1][(fe + 1) % u],
          U[K + 1][fe]
        ];
        new Set(ge).size < 4 || (L.push(I.length), I.push([
          ...ge,
          ge[0]
        ]), he++);
      }
      I.push([]), t.points.val = $, t.polylines && (t.polylines.val = I), t.areas && (t.areas.val = L);
      const X = Qs(o);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      return v(), {
        contorno: u,
        perfil: d.length,
        areas: he,
        guias: X
      };
    }, window.__hekatanDrawSlabChaflan = (e, n, s = 1, o = 6, a = 6) => {
      const r = Math.min(e[0], n[0]), h = Math.max(e[0], n[0]), i = Math.min(e[1], n[1]), l = Math.max(e[1], n[1]), u = (e[2] + n[2]) / 2, d = h - r, M = l - i, y = Math.min(s, d / 2 - 0.01, M / 2 - 0.01);
      if (y <= 0) return;
      const w = t.points.rawVal.length, z = [], F = [], f = (p, x) => {
        z.push([
          p,
          x,
          u
        ]), F.push(w + z.length - 1);
      };
      for (let p = 0; p <= a; p++) f(r + y + (d - 2 * y) * p / a, i);
      for (let p = 1; p <= o; p++) {
        const x = -Math.PI / 2 + Math.PI / 2 * p / o;
        f(h - y + y * Math.cos(x), i + y + y * Math.sin(x));
      }
      for (let p = 1; p <= a; p++) f(h, i + y + (M - 2 * y) * p / a);
      for (let p = 1; p <= o; p++) {
        const x = 0 + Math.PI / 2 * p / o;
        f(h - y + y * Math.cos(x), l - y + y * Math.sin(x));
      }
      for (let p = 1; p <= a; p++) f(h - y - (d - 2 * y) * p / a, l);
      for (let p = 1; p <= o; p++) {
        const x = Math.PI / 2 + Math.PI / 2 * p / o;
        f(r + y + y * Math.cos(x), l - y + y * Math.sin(x));
      }
      for (let p = 1; p <= a; p++) f(r, l - y - (M - 2 * y) * p / a);
      for (let p = 1; p < o; p++) {
        const x = Math.PI + Math.PI / 2 * p / o;
        f(r + y + y * Math.cos(x), i + y + y * Math.sin(x));
      }
      if (F.push(w), Vo()) {
        Io(z, true);
        return;
      }
      if (t.points.val = [
        ...t.points.rawVal,
        ...z
      ], t.polylines) {
        const p = t.polylines.rawVal;
        t.polylines.val = [
          ...p.slice(0, -1),
          F,
          []
        ];
      }
    }, window.__hekatanDrawRect = (e, n) => {
      const s = t.points.rawVal.length, o = e[0], a = e[1], r = e[2], h = n[0], i = n[1], l = n[2];
      let u;
      if (Math.abs(r - l) < 1e-6 ? u = [
        [
          o,
          a,
          r
        ],
        [
          h,
          a,
          r
        ],
        [
          h,
          i,
          r
        ],
        [
          o,
          i,
          r
        ]
      ] : Math.abs(a - i) < 1e-6 ? u = [
        [
          o,
          a,
          r
        ],
        [
          h,
          a,
          r
        ],
        [
          h,
          a,
          l
        ],
        [
          o,
          a,
          l
        ]
      ] : u = [
        [
          o,
          a,
          r
        ],
        [
          o,
          i,
          r
        ],
        [
          o,
          i,
          l
        ],
        [
          o,
          a,
          l
        ]
      ], t.points.val = [
        ...t.points.rawVal,
        ...u
      ], t.polylines) {
        const d = [
          s,
          s + 1,
          s + 2,
          s + 3,
          s
        ], M = t.polylines.rawVal;
        t.polylines.val = [
          ...M.slice(0, -1),
          d,
          []
        ];
      }
    }, window.__hekatanDrawRectArea = (e, n) => {
      var _a3;
      const s = t.points.rawVal.length, o = e[0], a = e[1], r = e[2], h = n[0], i = n[1], l = n[2];
      let u;
      if (R && t.gridTarget) {
        const d = t.gridTarget.rawVal, M = new Ln(...d.rotation), y = new T(1, 0, 0).applyEuler(M), w = new T(0, 1, 0).applyEuler(M), z = new T(...d.position), F = new T(o, a, r), f = new T(h, i, l), p = F.clone().sub(z).dot(y), x = F.clone().sub(z).dot(w), _ = f.clone().sub(z).dot(y), $ = f.clone().sub(z).dot(w), I = (L, U) => z.clone().addScaledVector(y, L).addScaledVector(w, U).toArray();
        u = [
          I(p, x),
          I(_, x),
          I(_, $),
          I(p, $)
        ];
      } else Math.abs(r - l) < 1e-6 ? u = [
        [
          o,
          a,
          r
        ],
        [
          h,
          a,
          r
        ],
        [
          h,
          i,
          r
        ],
        [
          o,
          i,
          r
        ]
      ] : Math.abs(a - i) < 1e-6 ? u = [
        [
          o,
          a,
          r
        ],
        [
          h,
          a,
          r
        ],
        [
          h,
          a,
          l
        ],
        [
          o,
          a,
          l
        ]
      ] : u = [
        [
          o,
          a,
          r
        ],
        [
          o,
          i,
          r
        ],
        [
          o,
          i,
          l
        ],
        [
          o,
          a,
          l
        ]
      ];
      if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [
        ...t.points.rawVal,
        ...u
      ], t.polylines) {
        const d = t.polylines.rawVal, M = d.length - 1, y = [
          s,
          s + 1,
          s + 2,
          s + 3,
          s
        ];
        t.polylines.val = [
          ...d.slice(0, -1),
          y,
          []
        ], t.areas && (t.areas.val = [
          ...t.areas.rawVal,
          M
        ]);
      }
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      v();
    }, window.__hekatanFillClosedAreas = () => {
      var _a3, _b, _c;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = t.points.rawVal, s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), a = (f) => f.map((p) => Math.round(p * 1e4) / 1e4).join(",");
      for (let f = 0; f < n.length; f++) {
        const p = a(n[f]), x = s.get(p);
        x === void 0 && s.set(p, f), o.set(f, x ?? f);
      }
      const r = e.map((f) => f.map((p) => o.get(p) ?? p)), h = /* @__PURE__ */ new Map(), i = (f, p) => {
        f !== p && ((h.get(f) ?? h.set(f, /* @__PURE__ */ new Set()).get(f)).add(p), (h.get(p) ?? h.set(p, /* @__PURE__ */ new Set()).get(p)).add(f));
      };
      for (const f of r) for (let p = 0; p + 1 < f.length; p++) i(f[p], f[p + 1]);
      const l = (f, p) => {
        var _a4;
        return !!((_a4 = h.get(f)) == null ? void 0 : _a4.has(p));
      }, u = /* @__PURE__ */ new Set(), d = [], M = [
        ...h.keys()
      ];
      for (const f of M) for (const p of h.get(f)) if (!(p < f)) {
        for (const x of h.get(p)) if (x !== f) for (const _ of h.get(x)) {
          if (_ === f || _ === p || !l(_, f) || l(f, x) || l(p, _)) continue;
          const $ = [
            f,
            p,
            x,
            _
          ].slice().sort((I, L) => I - L).join("-");
          u.has($) || (u.add($), d.push([
            f,
            p,
            x,
            _
          ]));
        }
      }
      for (const f of M) for (const p of h.get(f)) if (!(p < f)) for (const x of h.get(p)) {
        if (x === f || !l(x, f)) continue;
        const _ = [
          f,
          p,
          x
        ].slice().sort(($, I) => $ - I).join("-");
        u.has(_) || (u.add(_), d.push([
          f,
          p,
          x
        ]));
      }
      if (!d.length) return 0;
      const y = [
        ...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []
      ], w = new Set(y.map((f) => [
        ...new Set(r[f] ?? [])
      ].sort((p, x) => p - x).join("-"))), z = [
        ...r
      ];
      let F = 0;
      for (const f of d) {
        const p = f.slice().sort((x, _) => x - _).join("-");
        w.has(p) || (w.add(p), z.push([
          ...f,
          f[0]
        ]), y.push(z.length - 1), F++);
      }
      if (F) {
        window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = z, t.areas && (t.areas.val = y);
        try {
          (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
        } catch {
        }
        v();
      }
      return F;
    }, window.__hekatanMeshPolyArea = (e, n) => {
      var _a3;
      const s = e.length;
      if (s < 3) return 0;
      let o = 0, a = 0, r = 0;
      for (let Te = 0; Te < s; Te++) {
        const Ze = e[Te], He = e[(Te + 1) % s];
        o += (Ze[1] - He[1]) * (Ze[2] + He[2]), a += (Ze[2] - He[2]) * (Ze[0] + He[0]), r += (Ze[0] - He[0]) * (Ze[1] + He[1]);
      }
      const h = Math.hypot(o, a, r) || 1;
      o /= h, a /= h, r /= h;
      let i = e[1][0] - e[0][0], l = e[1][1] - e[0][1], u = e[1][2] - e[0][2];
      const d = Math.hypot(i, l, u) || 1;
      i /= d, l /= d, u /= d;
      let M = a * u - r * l, y = r * i - o * u, w = o * l - a * i;
      const z = Math.hypot(M, y, w) || 1;
      M /= z, y /= z, w /= z;
      const F = e[0], f = (Te) => [
        (Te[0] - F[0]) * i + (Te[1] - F[1]) * l + (Te[2] - F[2]) * u,
        (Te[0] - F[0]) * M + (Te[1] - F[1]) * y + (Te[2] - F[2]) * w
      ], p = (Te, Ze) => [
        F[0] + Te * i + Ze * M,
        F[1] + Te * l + Ze * y,
        F[2] + Te * u + Ze * w
      ], x = e.map(f);
      let _ = 1 / 0, $ = -1 / 0, I = 1 / 0, L = -1 / 0;
      for (const [Te, Ze] of x) Te < _ && (_ = Te), Te > $ && ($ = Te), Ze < I && (I = Ze), Ze > L && (L = Ze);
      const U = $ - _, he = L - I;
      if (U < 1e-6 || he < 1e-6) return 0;
      let X = n && n > 0 ? n : 0.5;
      for (; U / X * (he / X) > 2500; ) X *= 2;
      X = Math.min(X, Math.min(U, he));
      const K = (Te, Ze) => {
        let He = false;
        for (let pt = 0, ht = x.length - 1; pt < x.length; ht = pt++) {
          const [kt, xt] = x[pt], [Vt, Ct] = x[ht];
          xt > Ze != Ct > Ze && Te < (Vt - kt) * (Ze - xt) / (Ct - xt) + kt && (He = !He);
        }
        return He;
      }, fe = Math.max(1, Math.round(U / X)), ge = Math.max(1, Math.round(he / X)), Ce = U / fe, Re = he / ge, _e = /* @__PURE__ */ new Map(), Be = [], Ie = t.points.rawVal.length, qe = (Te, Ze) => {
        const He = Te + "," + Ze, pt = _e.get(He);
        if (pt !== void 0) return pt;
        const ht = Ie + Be.length;
        return Be.push(p(_ + Te * Ce, I + Ze * Re)), _e.set(He, ht), ht;
      }, Ne = [];
      for (let Te = 0; Te < fe; Te++) for (let Ze = 0; Ze < ge; Ze++) {
        if (!K(_ + (Te + 0.5) * Ce, I + (Ze + 0.5) * Re)) continue;
        const He = qe(Te, Ze), pt = qe(Te + 1, Ze), ht = qe(Te + 1, Ze + 1), kt = qe(Te, Ze + 1);
        Ne.push([
          He,
          pt,
          ht,
          kt
        ]);
      }
      if (!Ne.length) return 0;
      if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [
        ...t.points.rawVal,
        ...Be
      ], t.polylines && t.areas) {
        let Te = t.polylines.rawVal.slice();
        Te.length && Te[Te.length - 1].length === 0 && (Te = Te.slice(0, -1));
        const Ze = [];
        for (const He of Ne) Ze.push(Te.length), Te.push([
          He[0],
          He[1],
          He[2],
          He[3],
          He[0]
        ]);
        Te.push([]), t.polylines.val = Te, t.areas.val = [
          ...t.areas.rawVal,
          ...Ze
        ];
      }
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return v(), Ne.length;
    };
    const To = () => {
      if (Ge.length < 3) return Ge = [], Fe.visible = false, v(), 0;
      const e = window.__hekatanMeshPolyArea(Ge.slice());
      return Ge = [], Fe.visible = false, v(), e;
    };
    window.__hekatanFinalizePolyArea = To, window.__hekatanSetInclinedPlaneFrom3 = (e, n, s) => {
      var _a3;
      const o = new T(e[0], e[1], e[2]), a = new T(n[0], n[1], n[2]), r = new T(s[0], s[1], s[2]), h = new T().subVectors(a, o).cross(new T().subVectors(r, o));
      if (h.lengthSq() < 1e-9) return false;
      h.normalize();
      const i = new vo().setFromUnitVectors(new T(0, 0, 1), h), l = new Ln().setFromQuaternion(i);
      t.gridTarget && (t.gridTarget.val = {
        position: [
          o.x,
          o.y,
          o.z
        ],
        rotation: [
          l.x,
          l.y,
          l.z
        ]
      }), R = true;
      const u = new T().addVectors(o, a).add(r).multiplyScalar(1 / 3), d = Math.max(o.distanceTo(a), o.distanceTo(r), a.distanceTo(r)) * 2.2 + 4, M = d / 2;
      Xt.geometry.dispose(), Xt.geometry = new Dn(d, d), Wt.geometry.dispose(), Wt.geometry = new ga(new Dn(d, d)), zn(M, 1), _t.position.copy(u), _t.quaternion.copy(i), _t.scale.set(1, 1, 1), _t.visible = true;
      try {
        (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return v(), true;
    }, window.__hekatanResetPlaneXY = () => {
      t.gridTarget && (t.gridTarget.val = {
        position: [
          0,
          0,
          0
        ],
        rotation: [
          Math.PI / 2,
          0,
          0
        ]
      }), R = false, _t.visible = false, v();
    };
    const dn = new ft();
    dn.visible = false, m.add(dn), window.__hekatanShowAxes = (e, n, s = 12, o = 2) => {
      var _a3, _b;
      for (; dn.children.length; ) {
        const d = dn.children.pop();
        (_a3 = d.geometry) == null ? void 0 : _a3.dispose(), (_b = d.material) == null ? void 0 : _b.dispose();
      }
      if (!e.length || !n.length) return;
      const a = Math.min(...n) - o, r = Math.max(...n) + o, h = Math.min(...e) - o, i = Math.max(...e) + o, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", u = (d, M, y, w, z) => {
        const F = document.createElement("canvas");
        F.width = 64, F.height = 32;
        const f = F.getContext("2d");
        f.fillStyle = z, f.font = "bold 22px sans-serif", f.textAlign = "center", f.fillText(d, 32, 26);
        const p = new ba(F), x = new Ma({
          map: p,
          transparent: true
        }), _ = new va(x);
        return _.position.set(M, y, w), _.scale.set(1.2, 0.6, 1), _;
      };
      e.forEach((d, M) => {
        const y = M < l.length ? l[M] : `X${M}`, w = new De().setFromPoints([
          new T(d, a, 0),
          new T(d, r, 0),
          new T(d, a, 0),
          new T(d, a, s)
        ]), z = new ro({
          color: 6333946,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.6
        }), F = new an(w, z);
        F.computeLineDistances(), dn.add(F), dn.add(u(y, d, a - 0.5, 0, "#60a5fa")), dn.add(u(y, d, r + 0.5, 0, "#60a5fa"));
      }), n.forEach((d, M) => {
        const y = `${M + 1}`, w = new De().setFromPoints([
          new T(h, d, 0),
          new T(i, d, 0),
          new T(h, d, 0),
          new T(h, d, s)
        ]), z = new ro({
          color: 16478597,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.6
        }), F = new an(w, z);
        F.computeLineDistances(), dn.add(F), dn.add(u(y, h - 0.5, d, 0, "#fb7185")), dn.add(u(y, i + 0.5, d, 0, "#fb7185"));
      }), dn.visible = true, v();
    }, window.__hekatanHideAxes = () => {
      dn.visible = false, v();
    };
    const Fn = new ft();
    Fn.visible = false, m.add(Fn);
    let eo = [];
    window.__hekatanShowRefPlanes = (e = [
      0,
      3,
      6,
      9,
      12
    ], n = 20, s = 0, o = 0) => {
      var _a3, _b;
      for (; Fn.children.length; ) {
        const r = Fn.children.pop();
        (_a3 = r.geometry) == null ? void 0 : _a3.dispose(), (_b = r.material) == null ? void 0 : _b.dispose();
      }
      eo.forEach((r) => {
        m.remove(r), r.geometry.dispose(), r.material.dispose();
      }), eo = [];
      const a = [
        6333946,
        3462041,
        16498468,
        16478597,
        12616956,
        2282478
      ];
      e.forEach((r, h) => {
        const i = a[h % a.length], l = n / 2, u = [
          new T(s - l, o - l, r),
          new T(s + l, o - l, r),
          new T(s + l, o + l, r),
          new T(s - l, o + l, r),
          new T(s - l, o - l, r)
        ], d = new De().setFromPoints(u), M = new mt({
          color: i,
          transparent: true,
          opacity: 0.55
        });
        Fn.add(new Et(d, M));
        const y = document.createElement("canvas");
        y.width = 128, y.height = 32;
        const w = y.getContext("2d");
        w.fillStyle = `#${i.toString(16).padStart(6, "0")}`, w.font = "bold 18px sans-serif", w.fillText(`Z = ${r} m`, 4, 22);
        const z = new ba(y), F = new Ma({
          map: z,
          transparent: true
        }), f = new va(F);
        f.position.set(s - l - 1.5, o - l - 1.5, r), f.scale.set(2.5, 0.6, 1), Fn.add(f);
        const p = new Dn(1e4, 1e4), x = new gt({
          visible: false,
          side: It
        }), _ = new ut(p, x);
        _.position.set(0, 0, r), _.frustumCulled = false, _.userData = {
          refPlaneZ: r
        }, m.add(_), eo.push(_);
      }), Fn.visible = true, v();
    }, window.__hekatanHideRefPlanes = () => {
      Fn.visible = false, eo.forEach((e) => {
        e.visible = false;
      }), v();
    };
    const mo = new ft();
    mo.frustumCulled = false, m.add(mo);
    const ei = () => {
      var _a3, _b, _c, _d;
      for (; mo.children.length; ) {
        const s = mo.children.pop();
        (_b = (_a3 = s.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
      const e = window.__hekatanDrawingAuxLines, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
      for (const s of n) {
        if (s.length !== 6) continue;
        const o = new De().setFromPoints([
          new T(s[0], s[1], s[2]),
          new T(s[3], s[4], s[5])
        ]), a = new ro({
          color: 2282478,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.8
        }), r = new Et(o, a);
        r.computeLineDistances(), mo.add(r);
      }
    };
    ve.derive(() => {
      const e = window.__hekatanDrawingAuxLines;
      (e == null ? void 0 : e.val) && (e.val, ei(), v());
    });
    const to = new ft();
    to.frustumCulled = false, m.add(to);
    const Os = () => {
      var _a3, _b, _c, _d;
      for (; to.children.length; ) {
        const s = to.children.pop();
        (_b = (_a3 = s.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
      const e = window.__hekatanDrawingAuxPoints, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
      for (const s of n) {
        if (!s || s.length !== 3) continue;
        const o = new ut(new co(0.025, 12, 12), new gt({
          color: 2282478,
          transparent: true,
          opacity: 0.85,
          depthTest: false
        }));
        o.position.set(s[0], s[1], s[2]), o.renderOrder = 996, o.scale.setScalar(Fo(o.position)), to.add(o);
      }
    };
    ve.derive(() => {
      const e = window.__hekatanDrawingAuxPoints;
      (e == null ? void 0 : e.val) !== void 0 && (e.val, Os(), v());
    }), b.addEventListener("change", () => {
      to.children.forEach((e) => {
        e.scale.setScalar(Fo(e.position));
      });
    }), window.__hekatanRenderAuxPoints = Os;
    const Mt = new ft(), ti = new ut(new co(0.01, 12, 12), new gt({
      color: 16777215,
      transparent: true,
      opacity: 0.95
    })), js = new ut(new co(0.015, 12, 12), new gt({
      color: 16498468,
      transparent: true,
      opacity: 0.2,
      depthWrite: false
    }));
    js.visible = false, Mt.add(ti, js);
    const no = 0.08, rs = (e, n, s) => {
      const o = new De().setFromPoints([
        new T(...e),
        new T(...n)
      ]);
      return new Et(o, new mt({
        color: s,
        transparent: true,
        opacity: 0.7
      }));
    };
    Mt.add(rs([
      -no,
      0,
      0
    ], [
      no,
      0,
      0
    ], 16777215)), Mt.add(rs([
      0,
      -no,
      0
    ], [
      0,
      no,
      0
    ], 16777215)), Mt.add(rs([
      0,
      0,
      -no
    ], [
      0,
      0,
      no
    ], 16777215)), Mt.visible = false, Mt.frustumCulled = false, m.add(Mt);
    let cs = 2;
    const Ro = (e) => {
      const n = g(), s = (k == null ? void 0 : k.clientHeight) || 700;
      return n.isOrthographicCamera ? (n.top - n.bottom) / (n.zoom || 1) / s : 2 * n.position.distanceTo(e) * Math.tan((n.fov || 50) * Math.PI / 180 / 2) / s;
    }, wo = () => {
      if (!Mt.visible) return;
      const e = cs * Ro(Mt.position) / 0.015;
      Mt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
    };
    let Rn = 10;
    const ds = (e) => Math.max(1e-4, Rn * Ro(e));
    window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (Rn = e), Rn), window.__hekatanUpdateSnapScale = wo, window.__hekatanSnapMarker = Mt, window.__hekatanMetrosPorPixel = Ro, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (cs = e, wo(), v()), cs);
    const ea = () => {
      vn.children.length !== 0 && vn.children.forEach((e) => {
        if (!e.__isSelectionPt) return;
        const n = e;
        n.scale.setScalar(Fo(n.position) * 1.8);
      });
    };
    window.__hekatanUpdateSelectionPtScale = ea, b.addEventListener("change", () => {
      var _a3;
      wo(), rn.visible && Us(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), ea();
    }), window.__hekatanShowSnap = (e, n, s) => {
      Mt.position.set(e, n, s), Mt.visible = true, wo(), v();
    }, window.__hekatanHideSnap = () => {
      Mt.visible = false, v();
    }, k.addEventListener("pointermove", (e) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
      window.__hekatanCursorPx = {
        x: e.clientX,
        y: e.clientY
      };
      const n = B(e);
      if (!n) return;
      S.setFromCamera(E, n), ue = null;
      const s = Ae();
      if ((!s.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && ct.visible && (ct.visible = false), s.length) {
        const o = s[0].point;
        if (((_f = (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
          const w = qt([
            o.x,
            o.y,
            o.z
          ]);
          if (w) {
            const z = w.map((p) => t.points.rawVal[p]), F = [];
            for (let p = 1; p < z.length - 1; p++) F.push(z[0][0], z[0][1], z[0][2], z[p][0], z[p][1], z[p][2], z[p + 1][0], z[p + 1][1], z[p + 1][2]);
            const f = ct.geometry;
            f.setAttribute("position", new Tt(F, 3)), f.computeVertexNormals(), ct.visible = true;
          } else ct.visible = false;
        } else ct.visible && (ct.visible = false);
        const a = e.altKey;
        let r = false;
        const h = ds(o), i = a ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, o.x, o.y, o.z, h, {
          x: e.clientX,
          y: e.clientY
        });
        if (i) Xo(i.type, i.x, i.y, i.z), Mt.position.set(i.x, i.y, i.z), Mt.visible = true, o.set(i.x, i.y, i.z), Zo(i.type, e.clientX, e.clientY);
        else if (!a && ($e = ke(e.clientX, e.clientY))) r = true, o.copy($e), Xo("ifcSec", o.x, o.y, o.z), Zo("ifcSec", e.clientX, e.clientY), Mt.position.copy(o), Mt.visible = true;
        else if (le && !a) r = true, Xo(le.tipo, o.x, o.y, o.z), Zo(le.tipo, e.clientX, e.clientY), Mt.position.copy(o), Mt.visible = true;
        else {
          ri(), Uo();
          const y = !a && window.__hekatanSnapEnabled !== false, w = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
          y && w > 0 && (o.x = Math.round(o.x / w) * w, o.y = Math.round(o.y / w) * w, o.z = Math.round(o.z / w) * w), Mt.position.copy(o), Mt.visible = true;
        }
        wo(), ne(ue && !i && (r || le) ? te(ue) : null), Dt = {
          p: o.clone(),
          x: e.clientX,
          y: e.clientY
        };
        const l = ((_k = (_j = (_i = window.__hekatanCadState) == null ? void 0 : _i.get) == null ? void 0 : _j.call(_i)) == null ? void 0 : _k.tool) ?? "select";
        if (l === "select" || !l) {
          const y = (window.__hekatanSnap2D ?? 0.5) * 1.5, w = Ja(o.x, o.y, o.z, y), z = is(o.x, o.y, o.z, y), F = Zs(o.x, o.y, o.z, y);
          if (w >= 0) {
            const _ = t.points.rawVal[w];
            rn.position.set(_[0], _[1], _[2]), rn.visible = true, Us(), Mn.visible = false, _n = {
              kind: "pt",
              a: w
            };
          } else if (z) {
            const _ = t.points.rawVal, $ = t.polylines.rawVal[z.polyIdx], I = _[$[z.segIdx]], L = _[$[z.segIdx + 1]];
            Mn.geometry.setFromPoints([
              new T(I[0], I[1], I[2]),
              new T(L[0], L[1], L[2])
            ]), Mn.visible = true, rn.visible = false, _n = ((_m = (_l2 = t.areas) == null ? void 0 : _l2.rawVal) == null ? void 0 : _m.includes(z.polyIdx)) ?? false ? {
              kind: "poly",
              a: z.polyIdx
            } : {
              kind: "seg",
              a: z.polyIdx,
              b: z.segIdx
            };
          } else if (F >= 0) {
            const $ = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[F];
            $ && (Mn.geometry.setFromPoints([
              new T($[0], $[1], $[2]),
              new T($[3], $[4], $[5])
            ]), Mn.visible = true, rn.visible = false, _n = {
              kind: "aux",
              a: F
            });
          } else Mn.visible = false, rn.visible = false, _n = null;
          Xe.style.left = e.clientX + "px", Xe.style.top = e.clientY + "px", Xe.style.display = "block";
          let f = o;
          if ((_n == null ? void 0 : _n.kind) === "pt") {
            const _ = t.points.rawVal[_n.a];
            _ && (f = new T(_[0], _[1], _[2]));
          }
          const p = `X=${f.x.toFixed(2)} Y=${f.y.toFixed(2)} Z=${f.z.toFixed(2)}`;
          if (window.__hekatanCursorXYZ = [
            f.x,
            f.y,
            f.z
          ], _n) {
            const _ = {
              pt: "nodo",
              seg: "segmento",
              poly: "\xE1rea",
              aux: "l\xEDnea aux"
            };
            Xe.textContent = `${p}  \xB7  \u{1F5B1} Click \u2192 ${_[_n.kind]}`;
          } else Xe.textContent = p;
          const x = document.getElementById("hk-coord-fixed");
          x && (x.textContent = p), Dt = {
            p: f.clone(),
            x: e.clientX,
            y: e.clientY
          }, Se.visible = false, $t.visible = false, Kt.visible = false, v();
          return;
        }
        if (l === "delete" || l === "trim" || l === "extend" || l === "offset") {
          const y = (window.__hekatanSnap2D ?? 0.5) * 1.5, w = is(o.x, o.y, o.z, y), z = Zs(o.x, o.y, o.z, y);
          let F = false;
          if (z >= 0) if (!w) F = true;
          else {
            const _ = window.__hekatanDrawingAuxLines, I = ((_ == null ? void 0 : _.rawVal) ?? (_ == null ? void 0 : _.val) ?? _ ?? [])[z];
            po(o.x, o.y, o.z, I[0], I[1], I[2], I[3], I[4], I[5]) < w.dist && (F = true);
          }
          F ? (Tn = z, hn = -1, In = -1, Qa(z)) : w ? (hn = w.polyIdx, In = w.segIdx, Tn = -1, Oa(w.polyIdx, w.segIdx)) : (hn = -1, In = -1, Tn = -1, Gt.visible = false), Se.visible = false, $t.visible = false, Kt.visible = false, jt(), Xe.style.left = e.clientX + "px", Xe.style.top = e.clientY + "px", Xe.style.display = "block";
          const f = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
          let p = "";
          F ? p = `\u{1F5D1} l\xEDnea aux #${Tn + 1}` : w ? p = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(w.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${w.polyIdx + 1}` : `\u{1F5D1} seg ${w.segIdx + 1} / poly #${w.polyIdx + 1}` : p = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Xe.textContent = `${f}  \xB7  ${p}`;
          const x = document.getElementById("hk-coord-fixed");
          x && (x.textContent = f), v();
          return;
        } else Gt.visible = false, hn = -1, Tn = -1;
        Xe.style.left = e.clientX + "px", Xe.style.top = e.clientY + "px", Xe.style.display = "block";
        const u = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], d = u[u.length - 1] ?? [], M = t.points.rawVal ?? [];
        if (d.length > 0 && M[d[d.length - 1]]) {
          const y = d[d.length - 1], w = M[y];
          let z = zt;
          jn = null;
          const F = !!i || r;
          if (!z && !F && window.__hekatanAxisSnap !== false) {
            const _e2 = k.getBoundingClientRect(), Be = e.clientX, Ie = e.clientY, qe = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Ne = new T(w[0], w[1], w[2]), Te = [
              [
                "x",
                new T(1, 0, 0)
              ],
              [
                "y",
                new T(0, 1, 0)
              ],
              [
                "z",
                new T(0, 0, 1)
              ]
            ], Ze = (pt) => {
              const ht = pt.clone().project(n);
              return {
                x: (ht.x * 0.5 + 0.5) * _e2.width + _e2.left,
                y: (-ht.y * 0.5 + 0.5) * _e2.height + _e2.top
              };
            };
            let He = null;
            for (const [pt, ht] of Te) {
              const kt = Ze(Ne.clone().addScaledVector(ht, -qe)), xt = Ze(Ne.clone().addScaledVector(ht, qe)), Vt = xt.x - kt.x, Ct = xt.y - kt.y, Sn = Be - kt.x, sn = Ie - kt.y, $n = Vt * Vt + Ct * Ct || 1;
              let Pn = (Sn * Vt + sn * Ct) / $n;
              Pn = Math.max(0, Math.min(1, Pn));
              const Wn = Math.hypot(Be - (kt.x + Pn * Vt), Ie - (kt.y + Pn * Ct));
              if (He === null || Wn < He.dpx) {
                const wn = S.ray, ha = Ne.clone().sub(wn.origin), Ps = ht.dot(wn.direction), ma = ht.dot(ha), vi = wn.direction.dot(ha), wa = 1 - Ps * Ps, _i2 = Math.abs(wa) < 1e-6 ? -ma : (Ps * vi - ma) / wa;
                He = {
                  axis: pt,
                  dpx: Wn,
                  pt: Ne.clone().addScaledVector(ht, _i2)
                };
              }
            }
            He && He.dpx <= 12 && (o.copy(He.pt), z = He.axis, jn = He.pt.clone());
          }
          const f = !!window.__hekatanOrthoMode;
          if (!z && !F && f) {
            const _e2 = k.getBoundingClientRect(), Be = new T(w[0], w[1], w[2]), Ie = (xt) => {
              const Vt = xt.clone().project(n);
              return {
                x: (Vt.x * 0.5 + 0.5) * _e2.width + _e2.left,
                y: (-Vt.y * 0.5 + 0.5) * _e2.height + _e2.top
              };
            }, qe = Ie(Be), Ne = e.clientX - qe.x, Te = e.clientY - qe.y, Ze = Math.hypot(Ne, Te), He = [
              [
                "x",
                new T(1, 0, 0)
              ],
              [
                "y",
                new T(0, 1, 0)
              ],
              [
                "z",
                new T(0, 0, 1)
              ]
            ], pt = Math.max(1, ((_s2 = settings.gridSize) == null ? void 0 : _s2.rawVal) ?? 10) * 0.5, ht = Number(window.__hekatanPolarInc) || 0, kt = He.map(([xt, Vt]) => ({
              rotulo: xt.toUpperCase(),
              u: Vt
            }));
            if (ht > 0 && ht < 90) {
              const xt = [
                [
                  "XY",
                  new T(1, 0, 0),
                  new T(0, 1, 0)
                ],
                [
                  "XZ",
                  new T(1, 0, 0),
                  new T(0, 0, 1)
                ],
                [
                  "YZ",
                  new T(0, 1, 0),
                  new T(0, 0, 1)
                ]
              ];
              for (const [Vt, Ct, Sn] of xt) for (let sn = ht; sn < 360; sn += ht) {
                if (sn % 90 === 0) continue;
                const $n = sn * Math.PI / 180;
                kt.push({
                  rotulo: `${sn}\xB0 ${Vt}`,
                  u: Ct.clone().multiplyScalar(Math.cos($n)).addScaledVector(Sn, Math.sin($n)).normalize()
                });
              }
            }
            if (Ze > 4) {
              let xt = null;
              for (const Vt of kt) {
                const Ct = Vt.u, Sn = Ie(Be.clone().addScaledVector(Ct, pt)), sn = Sn.x - qe.x, $n = Sn.y - qe.y, Pn = Math.hypot(sn, $n);
                if (Pn < 6) continue;
                const Wn = Math.abs((Ne * sn + Te * $n) / (Ze * Pn)), wn = Math.abs(Ct.x) >= Math.abs(Ct.y) && Math.abs(Ct.x) >= Math.abs(Ct.z) ? "x" : Math.abs(Ct.y) >= Math.abs(Ct.z) ? "y" : "z";
                (!xt || Wn > xt.cos) && (xt = {
                  axis: wn,
                  rotulo: Vt.rotulo,
                  cos: Wn,
                  u: Ct
                });
              }
              if (xt) {
                z = xt.axis, xt.rotulo;
                const Vt = S.ray, Ct = Be.clone().sub(Vt.origin), Sn = xt.u.dot(Vt.direction), sn = xt.u.dot(Ct), $n = Vt.direction.dot(Ct), Pn = 1 - Sn * Sn, Wn = Math.abs(Pn) < 1e-6 ? -sn : (Sn * $n - sn) / Pn, wn = Be.clone().addScaledVector(xt.u, Wn);
                isFinite(wn.x) && isFinite(wn.y) && isFinite(wn.z) && (o.copy(wn), jn = wn.clone());
              }
            }
          }
          const p = window.__hekatanPolarTrack !== false;
          if (!z && !F && p) {
            const _e2 = o.x - w[0], Be = o.y - w[1], Ie = o.z - w[2], qe = Math.hypot(_e2, Be, Ie);
            if (qe > 1e-3) {
              const Te = Math.tan(6 * Math.PI / 180) * qe, Ze = Math.hypot(Be, Ie), He = Math.hypot(_e2, Ie), pt = Math.hypot(_e2, Be), ht = [
                [
                  "x",
                  Ze
                ],
                [
                  "y",
                  He
                ],
                [
                  "z",
                  pt
                ]
              ];
              ht.sort((kt, xt) => kt[1] - xt[1]), ht[0][1] <= Te && (z = ht[0][0]);
            }
          }
          if (z) {
            const _e2 = w[0], Be = w[1], Ie = w[2];
            z === "x" ? o.set(o.x, Be, Ie) : z === "y" ? o.set(_e2, o.y, Ie) : o.set(_e2, Be, o.z);
            const qe = !!zt, Te = {
              x: "#ff3344",
              y: "#34d399",
              z: "#60a5fa"
            }[z];
            Nt.style.background = "rgba(15,23,42,0.92)", Nt.style.color = Te, Nt.style.border = `1.5px solid ${Te}`;
            const Ze = (_t2 = s[0]) == null ? void 0 : _t2.object;
            let He = null;
            Ze === Jt ? He = "xy" : Ze === tn ? He = "xz" : Ze === gn && (He = "yz");
            const pt = He ? ` (plano ${He.toUpperCase()})` : "";
            Nt.textContent = qe ? `\u{1F512} LOCK ${z.toUpperCase()}${pt}` : `\u22A5 ORTO ${z.toUpperCase()}${pt}`, Nt.style.left = e.clientX + 20 + "px", Nt.style.top = e.clientY + 18 + "px", Nt.style.transform = "none", Nt.style.display = "block";
          } else zt || (Nt.style.display = "none");
          let x = null;
          if (!a && !F && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
            const _e2 = t.points.rawVal, Be = z ? [
              z
            ] : [
              "z",
              "x",
              "y"
            ], Ie = {
              x: e.clientX,
              y: e.clientY
            };
            let qe = 1 / 0;
            for (const Ne of _e2) if (!(Math.abs(Ne[0] - w[0]) < 1e-9 && Math.abs(Ne[1] - w[1]) < 1e-9 && Math.abs(Ne[2] - w[2]) < 1e-9)) for (const Te of Be) {
              const Ze = new T(Te === "x" ? Ne[0] : o.x, Te === "y" ? Ne[1] : o.y, Te === "z" ? Ne[2] : o.z), He = Gn(Ze.x, Ze.y, Ze.z);
              if (!He) continue;
              const pt = Math.hypot(He.x - Ie.x, He.y - Ie.y);
              pt < Rn && pt < qe && (qe = pt, x = {
                q: Ne,
                eje: Te
              });
            }
          }
          x ? (x.eje === "x" ? o.x = x.q[0] : x.eje === "y" ? o.y = x.q[1] : o.z = x.q[2], Kt.geometry.setFromPoints([
            new T(x.q[0], x.q[1], x.q[2]),
            new T(o.x, o.y, o.z)
          ]), (_u = Kt.computeLineDistances) == null ? void 0 : _u.call(Kt), Kt.visible = true, Mt.position.set(o.x, o.y, o.z), Mt.visible = true, Zo("track", e.clientX, e.clientY)) : Kt.visible = false, Dt = {
            p: o.clone(),
            x: e.clientX,
            y: e.clientY
          };
          const _ = Math.hypot(o.x - w[0], o.y - w[1], o.z - w[2]), $ = Math.atan2(o.y - w[1], o.x - w[0]) * 180 / Math.PI, I = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`, L = ($ % 360 + 360) % 360;
          Xe.textContent = `L = ${_.toFixed(3)} m   \u2220 ${L.toFixed(1)}\xB0   \xB7   ${I}`;
          const U = document.getElementById("hk-coord-fixed");
          U && (U.textContent = I), Se.geometry.setFromPoints([
            new T(w[0], w[1], w[2]),
            new T(o.x, o.y, o.z)
          ]), (_v = Se.computeLineDistances) == null ? void 0 : _v.call(Se), Se.visible = true, Oe(w[0], w[1], w[2], o.x, o.y, o.z);
          const he = window.__hekatanOrthoExt ?? 8, X = window.__hekatanShowOrthoPlanes !== false;
          xn.visible = X, X || Ns(null), X && (Cn(Un, w, "xy", he), Cn(On, w, "xz", he), Cn(Zn, w, "yz", he), An(Jt, w, "xy", he), An(tn, w, "xz", he), An(gn, w, "yz", he));
          const K = X ? S.intersectObjects([
            Jt,
            tn,
            gn
          ], false) : [];
          let fe = null;
          if (K.length > 0) {
            const _e2 = K[0].object;
            _e2 === Jt ? fe = "xy" : _e2 === tn ? fe = "xz" : _e2 === gn && (fe = "yz");
          }
          Ns(fe), fe && (bn.style.left = e.clientX + "px", bn.style.top = e.clientY + "px"), yn.geometry.setFromPoints([
            new T(w[0] - he, w[1], w[2]),
            new T(w[0] + he, w[1], w[2])
          ]), (_w = yn.computeLineDistances) == null ? void 0 : _w.call(yn), en.geometry.setFromPoints([
            new T(w[0], w[1] - he, w[2]),
            new T(w[0], w[1] + he, w[2])
          ]), (_x = en.computeLineDistances) == null ? void 0 : _x.call(en), Xn.geometry.setFromPoints([
            new T(w[0], w[1], w[2] - he),
            new T(w[0], w[1], w[2] + he)
          ]), (_y = Xn.computeLineDistances) == null ? void 0 : _y.call(Xn), $t.visible = true;
          const ge = yn.material, Ce = en.material, Re = Xn.material;
          yn.visible = z === "x", en.visible = z === "y", Xn.visible = z === "z", ge.opacity = 0.95, Ce.opacity = 0.95, Re.opacity = 0.95;
        } else {
          const y = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
          Xe.textContent = y;
          const w = document.getElementById("hk-coord-fixed");
          if (w && (w.textContent = y), Se.visible = false, $t.visible = false, (/* @__PURE__ */ new Set([
            "line",
            "polyline",
            "area",
            "node",
            "column",
            "wall",
            "rect",
            "circle",
            "arc",
            "polyline-multi",
            "axis",
            "chaflan"
          ])).has(l)) {
            if (Pe = null, ot = null, Ve.style.left = e.clientX + 20 + "px", Ve.style.top = e.clientY - 28 + "px", Ve.style.display = "block", !Ye) {
              Ve.value = `${o.x.toFixed(2)},${o.y.toFixed(2)},${o.z.toFixed(2)}`;
              const F = document.activeElement;
              !(F && (F.tagName === "INPUT" || F.tagName === "TEXTAREA") && F !== Ve) && document.activeElement !== Ve && Ve.focus({
                preventScroll: true
              });
              try {
                Ve.select();
              } catch {
              }
            }
          } else jt();
        }
        v();
      } else Uo(), Xe.style.display = "none", Mt.visible = false, Se.visible = false, $t.visible = false, jt(), v();
    }), ve.derive(() => {
      if (!t.gridTarget) return;
      const e = new vo().setFromEuler(new Ln(...t.gridTarget.val.rotation)), n = new vo().setFromAxisAngle(new T(1, 0, 0), Math.PI / 2);
      yl(c, {
        position: new T(...t.gridTarget.val.position),
        quaternion: e.clone().multiply(n)
      }, v), ta(t.gridTarget.val.position[2], Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3), se.position.set(...t.gridTarget.val.position), se.quaternion.setFromEuler(new Ln(...t.gridTarget.val.rotation)), se.updateMatrixWorld();
      const s = new T(0, 0, 1).applyEuler(new Ln(...t.gridTarget.val.rotation));
      R = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
    });
    function ta(e, n, s) {
      var _a3, _b, _c, _d, _e, _f, _g;
      {
        for (const o of Qn) m.remove(o), as(o);
        if (Qn.length = 0, n) {
          const o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = /* @__PURE__ */ new Set([
            0
          ]);
          for (const i of o) a.add(+i[2].toFixed(3));
          const r = /* @__PURE__ */ new Set();
          for (const i of window.__hekatanLevels ?? []) isFinite(i == null ? void 0 : i.z) && (a.add(+i.z.toFixed(3)), r.add(+i.z.toFixed(3)));
          const h = [
            ...a
          ].sort((i, l) => i - l).slice(0, 24);
          for (const i of h) {
            if (Math.abs(i - e) < 1e-6) continue;
            const l = c.clone(true);
            l.name = `hekatan-grid-nivel-${i}`, l.traverse((u) => {
              u.material && (u.material = u.material.clone(), u.material.transparent = true, u.material.opacity = (u.material.opacity ?? 1) * (r.has(i) ? 0.65 : Math.abs(i) < 1e-6 ? 0.5 : 0.22));
            }), l.position.set(0, 0, i), l.quaternion.identity(), m.add(l), Qn.push(l);
          }
        }
      }
      {
        const o = window.__hekatanPlanosAux ?? [], a = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", r = ((_g = (_f = (_e = window.__hekatanCadState) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e)) == null ? void 0 : _g[a === "xz" ? "workY" : a === "yz" ? "workX" : "workZ"]) ?? 0;
        for (const h of o.slice(0, 24)) {
          if (h.plano === "xy" || !isFinite(h.d) || h.plano === a && Math.abs(h.d - r) < 1e-6) continue;
          const i = c.clone(true);
          i.name = `hekatan-grid-${h.plano}-${h.d}`, i.traverse((l) => {
            l.material && (l.material = l.material.clone(), l.material.transparent = true, l.material.opacity = (l.material.opacity ?? 1) * 0.6);
          }), h.plano === "xz" ? (i.quaternion.setFromEuler(new Ln(Math.PI / 2, 0, 0)), i.position.set(0, h.d, 0)) : (i.quaternion.setFromEuler(new Ln(0, Math.PI / 2, 0)), i.position.set(h.d, 0, 0)), m.add(i), Qn.push(i);
        }
      }
      v();
    }
    window.__hekatanGrillaAux = (e, n = "xy") => {
      var _a3, _b;
      if (!isFinite(e)) return [];
      const s = window;
      (_a3 = s.__hekatanPushUndo) == null ? void 0 : _a3.call(s);
      const o = s.__hekatanPlanosAux ?? [], a = o.findIndex((r) => r.plano === n && Math.abs(r.d - e) < 1e-6);
      if (a >= 0 ? o.splice(a, 1) : o.push({
        plano: n,
        d: e
      }), s.__hekatanPlanosAux = o, n === "xy") {
        const r = s.__hekatanLevels ?? [], h = r.findIndex((i) => Math.abs(i.z - e) < 1e-6 && i.tipo !== "piso");
        a >= 0 ? h >= 0 && r.splice(h, 1) : h < 0 && r.push({
          label: `N${e >= 0 ? "+" : ""}${e.toFixed(2)}`,
          z: e,
          tipo: "aux"
        }), s.__hekatanLevels = r;
      }
      return (_b = s.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(s), o;
    }, window.__hekatanQuitarGrillaAux = (e) => {
      var _a3;
      const s = (window.__hekatanLevels ?? []).filter((o) => !(Math.abs(o.z - e) < 1e-6 && o.tipo !== "piso"));
      return window.__hekatanLevels = s, (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), s.map((o) => o.z);
    };
    const mn = document.createElement("input");
    mn.id = "hk-grid-dist", mn.type = "text", mn.spellcheck = false, mn.title = "Distancia del plano. Teclea un n\xFAmero y Enter para colocarlo exacto; Esc cancela.", mn.style.cssText = [
      "position:fixed",
      "z-index:99997",
      "pointer-events:none",
      "display:none",
      "padding:3px 8px",
      "background:rgba(15,23,42,.94)",
      "color:#22d3ee",
      "border:1.5px solid #22d3ee",
      "border-radius:4px",
      "width:104px",
      "text-align:center",
      "font:bold 13px Consolas,monospace",
      "transform:translate(14px,-28px)",
      "outline:none"
    ].join(";") + ";", document.body.appendChild(mn);
    let oo = false, us = 0, nn = "";
    const ni = (e) => e === "xz" ? new T(0, 1, 0) : e === "yz" ? new T(1, 0, 0) : new T(0, 0, 1), na = (e) => e === "xz" ? "workY" : e === "yz" ? "workX" : "workZ", yo = () => {
      var _a3, _b, _c;
      return String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy");
    }, so = () => {
      var _a3, _b, _c;
      return Number(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c[na(yo())]) ?? 0);
    }, Bo = (e) => {
      var _a3, _b;
      const n = yo(), s = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3);
      if (s && (s[na(n)] = e), !t.gridTarget) return;
      const o = window.__hekatanSCU ?? [
        0,
        0,
        0
      ];
      t.gridTarget.val = n === "xy" ? {
        position: [
          o[0],
          o[1],
          e
        ],
        rotation: [
          Math.PI / 2,
          0,
          0
        ]
      } : n === "xz" ? {
        position: [
          o[0],
          e,
          o[2]
        ],
        rotation: [
          0,
          0,
          0
        ]
      } : {
        position: [
          e,
          o[1],
          o[2]
        ],
        rotation: [
          0,
          0,
          Math.PI / 2
        ]
      };
    }, oi = () => {
      const e = ni(yo()), n = S.ray.origin, s = S.ray.direction, o = e.dot(s), a = 1 - o * o;
      if (Math.abs(a) < 1e-4) return null;
      const r = n.clone().negate(), h = e.dot(r), i = s.dot(r);
      return (o * i - h) / a;
    }, xo = (e, n) => {
      e && (mn.style.left = e.clientX + "px", mn.style.top = e.clientY + "px");
      const s = yo() === "xz" ? "Y" : yo() === "yz" ? "X" : "Z";
      mn.value = nn !== "" ? `${s} = ${nn}` : `${s} = ${n.toFixed(2)} m`, mn.style.display = "block";
    }, Do = (e, n) => {
      var _a3;
      oo && (oo = false, window.__hekatanMoviendoGrilla = false, mn.style.display = "none", e ? typeof n == "number" && isFinite(n) && Bo(n) : Bo(us), nn = "", (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), v());
    };
    window.__hekatanMoverGrilla = (e = true) => e ? (us = so(), nn = "", oo = true, window.__hekatanMoviendoGrilla = true, xo(null, us), true) : Do(false), k.addEventListener("pointermove", (e) => {
      if (!oo) return;
      B(e);
      const n = oi();
      if (n === null) {
        xo(e, so());
        return;
      }
      nn === "" && Bo(n), xo(e, n);
    }, true), k.addEventListener("pointerdown", (e) => {
      oo && (e.preventDefault(), e.stopPropagation(), Do(true, nn !== "" ? parseFloat(nn) : so()));
    }, true), window.addEventListener("keydown", (e) => {
      if (oo) {
        if (e.key === "Escape") return e.preventDefault(), Do(false);
        if (e.key === "Enter") return e.preventDefault(), Do(true, nn !== "" ? parseFloat(nn) : so());
        if (e.key === "Backspace") {
          e.preventDefault(), nn = nn.slice(0, -1), xo(null, so());
          return;
        }
        if (/^[0-9.\-]$/.test(e.key)) {
          e.preventDefault(), nn += e.key;
          const n = parseFloat(nn);
          isFinite(n) && Bo(n), xo(null, isFinite(n) ? n : so());
        }
      }
    }, true);
    const En = new ft();
    En.name = "hekatan-scu", En.visible = false, m.add(En);
    const si = (e) => {
      var _a3, _b, _c, _d, _e, _f;
      for (; En.children.length; ) {
        const i = En.children.pop();
        (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c), (_e = i.dispose) == null ? void 0 : _e.call(i);
      }
      const n = Math.max(0.8, (((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) ?? 1) * 2), s = new T(...e), o = [
        [
          new T(1, 0, 0),
          16735067
        ],
        [
          new T(0, 1, 0),
          6029194
        ],
        [
          new T(0, 0, 1),
          6990079
        ]
      ];
      for (const [i, l] of o) En.add(new Yn(i, s, n, l, n * 0.28, n * 0.16));
      const a = new De().setFromPoints([
        new T(0, 0, 0),
        s
      ]), r = new ro({
        color: 2282478,
        dashSize: 0.35,
        gapSize: 0.25,
        transparent: true,
        opacity: 0.8
      }), h = new Et(a, r);
      h.computeLineDistances(), En.add(h), En.visible = true;
    };
    window.__hekatanPonerSCU = (e) => {
      var _a3;
      return window.__hekatanSCU = [
        e[0],
        e[1],
        e[2]
      ], si(e), (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), v(), e;
    }, window.__hekatanQuitarSCU = () => {
      var _a3;
      return window.__hekatanSCU = [
        0,
        0,
        0
      ], En.visible = false, (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), v(), [
        0,
        0,
        0
      ];
    };
    let fs = false;
    window.__hekatanElegirSCU = (e = true) => (fs = e, window.__hekatanColocandoSCU = e, e), k.addEventListener("pointerdown", (e) => {
      if (!fs) return;
      e.preventDefault(), e.stopPropagation(), fs = false, window.__hekatanColocandoSCU = false;
      const n = window.__hekatanOsnapUltimo;
      if (n) {
        window.__hekatanPonerSCU([
          n.x,
          n.y,
          n.z
        ]);
        return;
      }
      B(e);
      const s = Ae();
      if (s.length) {
        const o = s[0].point;
        window.__hekatanPonerSCU([
          o.x,
          o.y,
          o.z
        ]);
      }
    }, true), window.__hekatanRecentrarGrilla = () => {
      var _a3, _b, _c, _d, _e;
      if (!t.gridTarget) return;
      const e = window.__hekatanSCU ?? [
        0,
        0,
        0
      ], n = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy"), s = (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d), o = Number((s == null ? void 0 : s[n === "xz" ? "workY" : n === "yz" ? "workX" : "workZ"]) ?? 0);
      t.gridTarget.val = n === "xy" ? {
        position: [
          e[0],
          e[1],
          o
        ],
        rotation: [
          Math.PI / 2,
          0,
          0
        ]
      } : n === "xz" ? {
        position: [
          e[0],
          o,
          e[2]
        ],
        rotation: [
          0,
          0,
          0
        ]
      } : {
        position: [
          o,
          e[1],
          e[2]
        ],
        rotation: [
          0,
          0,
          Math.PI / 2
        ]
      };
    }, window.__hekatanLimpiarGrillasAux = () => {
      var _a3, _b, _c;
      const e = window, n = (e.__hekatanPlanosAux ?? []).length + (e.__hekatanLevels ?? []).filter((a) => (a == null ? void 0 : a.tipo) !== "piso").length;
      if (!n) return 0;
      (_a3 = e.__hekatanPushUndo) == null ? void 0 : _a3.call(e);
      const s = e.__hekatanPlanosAux;
      Array.isArray(s) ? s.length = 0 : e.__hekatanPlanosAux = [];
      const o = e.__hekatanLevels;
      if (Array.isArray(o)) {
        const a = o.filter((r) => (r == null ? void 0 : r.tipo) === "piso");
        o.length = 0, o.push(...a);
      }
      (_b = e.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(e);
      try {
        (_c = e.__hekatanRefreshLevels) == null ? void 0 : _c.call(e);
      } catch {
      }
      return n;
    }, window.__hekatanRefrescarGrillas = () => {
      if (!t.gridTarget) return;
      const e = t.gridTarget.rawVal.rotation, n = new vo().setFromEuler(new Ln(...e));
      new vo().setFromAxisAngle(new T(1, 0, 0), Math.PI / 2), ta(t.gridTarget.rawVal.position[2], Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3);
    }, ve.derive(() => {
      Le.geometry.setAttribute("position", new Tt(t.points.val.flat(), 3)), Le.geometry.computeBoundingSphere();
    }), ve.derive(() => {
      const e = 0.05 * A * 0.5 * P.val;
      S.params.Points.threshold = 0.4 * e;
    }), ve.derive(() => {
      var _a3;
      const e = t.points.val ?? [], s = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], o = [];
      for (const r of s) {
        const [h, i, l] = e[r];
        o.push(h, i, l);
      }
      const a = new De();
      a.setAttribute("position", new Tt(o, 3)), We.geometry.dispose(), We.geometry = a;
    });
    let ps = false, qn = 0;
    k.addEventListener("pointerdown", () => {
      ps = true;
    }), k.addEventListener("pointerup", () => {
      ps = false;
    }), k.addEventListener("pointermove", () => {
      ps && qn++;
    });
    const Ut = document.createElement("div");
    Ut.id = "hk-window-select", Ut.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99996",
      "display:none",
      "border:1.5px solid",
      "background:rgba(0,0,0,0)"
    ].join(";") + ";", document.body.appendChild(Ut);
    let un = null, go = false, Qt = null;
    const hs = (e, n, s, o, a) => {
      a ? (Ut.style.borderColor = "#3faf46", Ut.style.borderStyle = "dashed", Ut.style.background = "rgba(63, 175, 70, 0.25)") : (Ut.style.borderColor = "#3f77c4", Ut.style.borderStyle = "solid", Ut.style.background = "rgba(63, 119, 196, 0.25)"), Ut.style.left = Math.min(e, s) + "px", Ut.style.top = Math.min(n, o) + "px", Ut.style.width = Math.abs(s - e) + "px", Ut.style.height = Math.abs(o - n) + "px", Ut.style.display = "block";
    }, oa = (e, n, s, o, a) => {
      var _a3, _b, _c, _d;
      const r = Math.min(e, s), h = Math.max(e, s), i = Math.min(n, o), l = Math.max(n, o), u = s < e, d = k.getBoundingClientRect(), M = g();
      M.updateMatrixWorld();
      const y = (L) => {
        const U = new T(L[0], L[1], L[2]);
        return U.project(M), {
          x: d.left + (U.x * 0.5 + 0.5) * d.width,
          y: d.top + (-U.y * 0.5 + 0.5) * d.height
        };
      }, w = (L) => L.x >= r && L.x <= h && L.y >= i && L.y <= l, z = (L, U) => !(L.x < r && U.x < r || L.x > h && U.x > h || L.y < i && U.y < i || L.y > l && U.y > l);
      a || Je.clear();
      let F = 0;
      const f = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
      for (let L = 0; L < f.length; L++) {
        const U = f[L];
        U && w(y(U)) && (Je.add(`pt:${L}`), F++);
      }
      const p = (L, U) => u ? w(L) || w(U) || z(L, U) : w(L) && w(U), x = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], _ = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
      for (let L = 0; L < x.length; L++) {
        const U = x[L];
        if (_.includes(L)) {
          let X;
          if (!u) X = U.every((K) => {
            const fe = f[K];
            return !!fe && w(y(fe));
          });
          else {
            X = false;
            for (let K = 0; K < U.length - 1; K++) {
              const fe = f[U[K]], ge = f[U[K + 1]];
              if (!(!fe || !ge) && p(y(fe), y(ge))) {
                X = true;
                break;
              }
            }
          }
          X && (Je.add(`poly:${L}`), F++);
        } else for (let X = 0; X < U.length - 1; X++) {
          const K = f[U[X]], fe = f[U[X + 1]];
          !K || !fe || p(y(K), y(fe)) && (Je.add(`seg:${L}:${X}`), F++);
        }
      }
      const I = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
      for (let L = 0; L < I.length; L++) {
        const U = I[L];
        if (!U || U.length !== 6) continue;
        const he = y([
          U[0],
          U[1],
          U[2]
        ]), X = y([
          U[3],
          U[4],
          U[5]
        ]);
        p(he, X) && (Je.add(`aux:${L}`), F++);
      }
      cn(), Me(F === 0 && !u ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${u ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${F} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${Je.size})`), Ut.style.display = "none";
    }, No = () => {
      Qt && (Qt = null, Ut.style.display = "none", Me("Selecci\xF3n cancelada"));
    };
    window.__hekatanCancelClickClickRect = No, window.addEventListener("keydown", (e) => {
      e.key === "Escape" && Qt && No();
    });
    const ms = () => {
      var _a3, _b, _c, _d;
      if (Je.size === 0) return false;
      const e = [
        ...Je
      ], n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], o = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, r = (a == null ? void 0 : a.rawVal) ?? [], h = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
      for (const z of e) {
        const [F, ...f] = z.split(":");
        if (F === "pt") h.add(+f[0]);
        else if (F === "poly") i.add(+f[0]);
        else if (F === "seg") {
          const p = +f[0], x = +f[1];
          l.has(p) || l.set(p, /* @__PURE__ */ new Set()), l.get(p).add(x);
        } else F === "aux" && u.add(+f[0]);
      }
      let d = 0, M = [], y = [];
      const w = /* @__PURE__ */ new Map();
      for (let z = 0; z < s.length; z++) {
        if (i.has(z)) {
          d++;
          continue;
        }
        w.set(z, M.length);
        const F = l.get(z);
        if (F && F.size > 0) {
          let f = [];
          for (let p = 0; p < s[z].length; p++) f.push(s[z][p]), p < s[z].length - 1 && F.has(p) && (f.length >= 2 && M.push(f), f = [], d++);
          (f.length >= 2 || f.length === 1) && M.push(f);
        } else M.push([
          ...s[z]
        ]);
      }
      if (i.size > 0) {
        const z = /* @__PURE__ */ new Set();
        for (const F of M) for (const f of F) z.add(f);
        for (const F of i) for (const f of s[F] ?? []) z.has(f) || h.add(f);
      }
      if (h.size > 0) {
        const z = [], F = /* @__PURE__ */ new Map();
        for (let p = 0; p < n.length; p++) {
          if (h.has(p)) {
            d++;
            continue;
          }
          F.set(p, z.length), z.push([
            ...n[p]
          ]);
        }
        const f = [];
        for (const p of M) {
          let x = [];
          for (const _ of p) {
            const $ = F.get(_);
            $ === void 0 ? (x.length >= 2 && f.push(x), x = []) : x.push($);
          }
          x.length >= 2 && f.push(x);
        }
        M = f, t.points.val = z;
      }
      for (const z of o) {
        const F = w.get(z);
        F !== void 0 && F < M.length && y.push(F);
      }
      if (t.polylines && (t.polylines.val = M), t.areas && (t.areas.val = y), u.size > 0 && a) {
        const z = r.filter((F, f) => !u.has(f));
        "val" in a ? a.val = z : window.__hekatanDrawingAuxLines = z, d += u.size;
      }
      Je.clear(), cn();
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return Me(`\u{1F5D1} ${d} item(s) borrado(s)`), true;
    };
    window.__hekatanDeleteSelected = ms, window.addEventListener("keydown", (e) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const n = document.activeElement, s = !!n && (n.id === "hk3-cmd-input" || n.id === "hk-dyn-input");
      if (Je.size > 0) {
        if (n && !s && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable)) return;
        e.preventDefault(), s && (n.value = ""), ms();
        return;
      }
    });
    const Ht = document.createElement("div");
    Ht.id = "hk-properties-pane";
    const sa = "hk-props-pane-pos";
    let bo = null;
    try {
      const e = localStorage.getItem(sa);
      e && (bo = JSON.parse(e));
    } catch {
    }
    Ht.style.cssText = [
      "position:fixed",
      bo ? `left:${bo.left}px` : "left:14px",
      bo ? `top:${bo.top}px` : "top:200px",
      "transform:none",
      "width:min(300px, calc(100vw - 32px))",
      "max-height:calc(100vh - 260px)",
      "overflow-y:auto",
      "z-index:201",
      "box-shadow:0 6px 24px rgba(0,0,0,0.45)",
      "border-radius:6px",
      "display:none"
    ].join(";") + ";", document.body.appendChild(Ht);
    const ai = () => {
      const e = Ht.querySelector(".tp-rotv_b");
      if (!e || e.__hkDragWired) return;
      e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
      let n = false, s = 0, o = 0, a = 0, r = 0;
      e.addEventListener("mousedown", (h) => {
        n = true, s = h.clientX, o = h.clientY;
        const i = Ht.getBoundingClientRect();
        a = i.left, r = i.top, Ht.style.transform = "none", Ht.style.left = `${a}px`, Ht.style.top = `${r}px`, h.preventDefault();
      }), window.addEventListener("mousemove", (h) => {
        if (!n) return;
        const i = h.clientX - s, l = h.clientY - o, u = Math.max(0, Math.min(window.innerWidth - 80, a + i)), d = Math.max(0, Math.min(window.innerHeight - 40, r + l));
        Ht.style.left = `${u}px`, Ht.style.top = `${d}px`;
      }), window.addEventListener("mouseup", () => {
        if (n) {
          n = false;
          try {
            localStorage.setItem(sa, JSON.stringify({
              left: parseFloat(Ht.style.left),
              top: parseFloat(Ht.style.top)
            }));
          } catch {
          }
        }
      });
    }, ye = {
      Ux: false,
      Uy: false,
      Uz: false,
      Rx: false,
      Ry: false,
      Rz: false,
      Fx: 0,
      Fy: 0,
      Fz: 0,
      Mx: 0,
      My: 0,
      Mz: 0,
      Kx: 0,
      Ky: 0,
      Kz: 0,
      Krx: 0,
      Kry: 0,
      Krz: 0,
      mass: 0,
      diaphragm: "Ninguno",
      section: "W14x84",
      material_frame: "A572 Gr 50",
      A_mod: 1,
      Iz_mod: 1,
      Iy_mod: 1,
      J_mod: 1,
      insertionPoint: "10 \u2014 Centroid",
      beta: 0,
      relMxI: false,
      relMyI: false,
      relMzI: false,
      relMxJ: false,
      relMyJ: false,
      relMzJ: false,
      hinges: "None",
      LKx: 0,
      LKy: 0,
      LKz: 0,
      qx: 0,
      qy: 0,
      qz: 0,
      massPerM: 0,
      shellType: "Mindlin (FSDT)",
      thickness: 0.2,
      material_shell: "Concreto C25",
      surfLoad: 0
    }, vt = {
      dx: 0,
      dy: 0,
      dz: 3,
      copias: 1
    };
    let yt = null;
    const Lt = (e, n, s, o) => {
      window.dispatchEvent(new CustomEvent("hk:property-applied", {
        detail: {
          kind: e,
          ids: n,
          prop: s,
          value: o
        }
      }));
    }, ii = () => {
      var _a3, _b, _c;
      if (yt && (yt.dispose(), yt = null), Je.size === 0) {
        Ht.style.display = "none";
        return;
      }
      const e = [
        ...Je
      ], n = e.filter((f) => f.startsWith("pt:"));
      if (n.length === 1) {
        const f = +n[0].slice(3), x = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(f);
        x ? [ye.Ux, ye.Uy, ye.Uz, ye.Rx, ye.Ry, ye.Rz] = x.map(Boolean) : ye.Ux = ye.Uy = ye.Uz = ye.Rx = ye.Ry = ye.Rz = false;
        const $ = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(f);
        $ ? [ye.Fx, ye.Fy, ye.Fz, ye.Mx, ye.My, ye.Mz] = $ : ye.Fx = ye.Fy = ye.Fz = ye.Mx = ye.My = ye.Mz = 0;
      }
      const s = e.filter((f) => f.startsWith("seg:")), o = new Set(((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []), a = (f) => o.has(+f.split(":")[1]), r = e.filter((f) => f.startsWith("poly:")), h = r.filter(a), i = r.filter((f) => !a(f)), l = e.filter((f) => f.startsWith("aux:")), u = n.length > 0, d = s.length > 0, M = h.length > 0, y = i.length > 0, w = !u && !d && !M && !y, z = [];
      n.length && z.push(`\u{1F535} ${n.length} nodo(s)`), s.length && z.push(`\u{1F4CF} ${s.length} segmento(s)`), h.length && z.push(`\u25AD ${h.length} \xE1rea(s)`), i.length && z.push(`\uFF0F ${i.length} l\xEDnea(s)`), l.length && z.push(`\u250A ${l.length} aux`);
      const F = `\u{1F3AF} ${Je.size} item(s) \u2014 ${z.join(", ")}`;
      yt = new Ba({
        container: Ht,
        title: F
      });
      {
        const f = yt.addFolder({
          title: "\u270F\uFE0F Editar \u2014 Replicar / Mover",
          expanded: false
        });
        f.addBinding(vt, "dx", {
          label: "\u0394x (m)",
          step: 0.1
        }), f.addBinding(vt, "dy", {
          label: "\u0394y (m)",
          step: 0.1
        }), f.addBinding(vt, "dz", {
          label: "\u0394z (m)",
          step: 0.1
        }), f.addBinding(vt, "copias", {
          label: "Copias",
          min: 1,
          max: 50,
          step: 1
        }), f.addButton({
          title: "\u29C9 Replicar selecci\xF3n"
        }).on("click", () => {
          var _a4;
          const $ = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, vt.dx, vt.dy, vt.dz, vt.copias);
          Me($ ? `\u29C9 Replicado \xD7${$} (\u0394 ${vt.dx},${vt.dy},${vt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
        }), f.addButton({
          title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea"
        }).on("click", () => {
          var _a4;
          const $ = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, vt.dx, vt.dy, vt.dz, vt.copias);
          Me($ && ($.lineas || $.areas) ? `\u21D7 Extruido: ${$.lineas} barra(s), ${$.areas} pa\xF1o(s) (\u0394 ${vt.dx},${vt.dy},${vt.dz} m \xD7 ${vt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
        });
        const p = {
          vuelo: 1.5,
          losa: true,
          borde: true,
          ambos: true
        }, x = f.addFolder({
          title: "\u2310 Volado sobre la viga designada",
          expanded: false
        });
        x.addBinding(p, "vuelo", {
          label: "vuelo (m)",
          min: 0.1,
          max: 6,
          step: 0.05
        }), x.addBinding(p, "losa", {
          label: "con pa\xF1o de losa (si no, hueca)"
        }), x.addBinding(p, "borde", {
          label: "con viga de borde"
        }), x.addBinding(p, "ambos", {
          label: "a los dos lados"
        }), x.addButton({
          title: "\u2310 Poner volado (VOL)"
        }).on("click", () => {
          var _a4;
          const $ = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, p.vuelo, {
            losa: p.losa,
            vigaBorde: p.borde,
            lados: p.ambos ? "ambos" : "afuera"
          });
          Me($ ? `\u2310 Volado de ${p.vuelo} m en ${$} pa\xF1o(s)` + (p.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
        }), f.addButton({
          title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)"
        }).on("click", () => {
          var _a4;
          const $ = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, vt.dx, vt.dy, vt.dz, 1);
          Me($ ? `\u2192 Copia desplazada \u0394 ${vt.dx},${vt.dy},${vt.dz} m` : "\u26A0 Nada seleccionado");
        });
        const _ = f.addFolder({
          title: "\u{1F9F2} Snap",
          expanded: false
        });
        _.addButton({
          title: "Snap a grilla ON/OFF (F9)"
        }).on("click", () => {
          var _a4;
          return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
        }), _.addButton({
          title: "OSNAP (endpoints/medios) ON/OFF"
        }).on("click", () => {
          window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), Me(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
        });
      }
      if (u) {
        const f = yt.addFolder({
          title: `\u{1F4CC} Restraints (DOFs) \u2014 ${n.length} nodo(s)`
        });
        f.addBinding(ye, "Ux"), f.addBinding(ye, "Uy"), f.addBinding(ye, "Uz"), f.addBinding(ye, "Rx"), f.addBinding(ye, "Ry"), f.addBinding(ye, "Rz");
        const p = (L, U) => {
          [ye.Ux, ye.Uy, ye.Uz, ye.Rx, ye.Ry, ye.Rz] = L;
          try {
            yt.refresh();
          } catch {
          }
          Lt("nodes", n, "supports", L), Me(`\u2713 ${U}: ${n.length} nudo(s) apoyado(s) (${L.map((he, X) => he ? [
            "Ux",
            "Uy",
            "Uz",
            "Rx",
            "Ry",
            "Rz"
          ][X] : "").filter(Boolean).join(" ")}).`);
        };
        f.addButton({
          title: `\u25B2 Empotrar los ${n.length} nudo(s) (6 GDL)`
        }).on("click", () => p([
          true,
          true,
          true,
          true,
          true,
          true
        ], "Empotrado")), f.addButton({
          title: `\u25B3 Articular los ${n.length} nudo(s) (Ux Uy Uz)`
        }).on("click", () => p([
          true,
          true,
          true,
          false,
          false,
          false
        ], "Articulado"));
        const x = yt.addFolder({
          title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)",
          expanded: false
        });
        x.addBinding(ye, "Kx", {
          label: "Kx",
          min: 0,
          step: 100
        }), x.addBinding(ye, "Ky", {
          label: "Ky",
          min: 0,
          step: 100
        }), x.addBinding(ye, "Kz", {
          label: "Kz",
          min: 0,
          step: 100
        }), x.addBinding(ye, "Krx", {
          label: "Krx",
          min: 0,
          step: 1e3
        }), x.addBinding(ye, "Kry", {
          label: "Kry",
          min: 0,
          step: 1e3
        }), x.addBinding(ye, "Krz", {
          label: "Krz",
          min: 0,
          step: 1e3
        });
        const _ = yt.addFolder({
          title: "\u2B07 Joint Loads (kN, kN\xB7m)"
        });
        _.addBinding(ye, "Fx", {
          step: 0.1
        }), _.addBinding(ye, "Fy", {
          step: 0.1
        }), _.addBinding(ye, "Fz", {
          step: 0.1
        }), _.addBinding(ye, "Mx", {
          step: 0.1
        }), _.addBinding(ye, "My", {
          step: 0.1
        }), _.addBinding(ye, "Mz", {
          step: 0.1
        }), yt.addFolder({
          title: "\u2696 Additional Mass (kg)",
          expanded: false
        }).addBinding(ye, "mass", {
          label: "m",
          min: 0,
          step: 1
        }), yt.addFolder({
          title: "\u{1F517} Diaphragm (rigid link)",
          expanded: false
        }).addBinding(ye, "diaphragm", {
          label: "Diafragma",
          options: {
            Ninguno: "Ninguno",
            "D1 (rigid)": "D1 (rigid)",
            "D2 (rigid)": "D2 (rigid)",
            "D3 (rigid)": "D3 (rigid)"
          }
        }), yt.addButton({
          title: `\u2713 Aplicar a ${n.length} nodo(s) seleccionado(s)`
        }).on("click", () => {
          let L = 0;
          const U = [
            ye.Ux,
            ye.Uy,
            ye.Uz,
            ye.Rx,
            ye.Ry,
            ye.Rz
          ];
          U.some((K) => K) && (Lt("nodes", n, "supports", U), L++);
          const he = [
            ye.Fx,
            ye.Fy,
            ye.Fz,
            ye.Mx,
            ye.My,
            ye.Mz
          ];
          he.some((K) => K !== 0) && (Lt("nodes", n, "loads", he), L++);
          const X = [
            ye.Kx,
            ye.Ky,
            ye.Kz,
            ye.Krx,
            ye.Kry,
            ye.Krz
          ];
          if (X.some((K) => K !== 0) && (Lt("nodes", n, "springs", X), L++), ye.mass !== 0 && (Lt("nodes", n, "mass", ye.mass), L++), ye.diaphragm !== "Ninguno" && (Lt("nodes", n, "diaphragm", ye.diaphragm), L++), L === 0) {
            Me("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
            let K = document.getElementById("hk-prop-toast");
            K || (K = document.createElement("div"), K.id = "hk-prop-toast", K.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(K)), K.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", K.style.background = "rgba(217,119,6,0.97)", K.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
              K && (K.style.opacity = "0");
            }, 3200);
          } else Me(`\u2713 Propiedades aplicadas a ${n.length} nodo(s)`);
        });
      }
      if (d) {
        const f = yt.addFolder({
          title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)`
        });
        f.addBinding(ye, "section", {
          label: "Secci\xF3n",
          options: {
            W14x84: "W14x84",
            W18x86: "W18x86",
            W24x146: "W24x146",
            HEB300: "HEB300",
            IPN300: "IPN300",
            IPE400: "IPE400",
            "Custom...": "Custom..."
          }
        }), f.addBinding(ye, "material_frame", {
          label: "Material",
          options: {
            "A572 Gr 50": "A572 Gr 50",
            A36: "A36",
            A992: "A992",
            "Concreto C25": "Concreto C25"
          }
        });
        const p = yt.addFolder({
          title: "\u{1F527} Property Modifiers",
          expanded: false
        });
        p.addBinding(ye, "A_mod", {
          label: "A mod",
          min: 0,
          max: 10,
          step: 0.1
        }), p.addBinding(ye, "Iz_mod", {
          label: "Iz mod (fuerte)",
          min: 0,
          max: 10,
          step: 0.1
        }), p.addBinding(ye, "Iy_mod", {
          label: "Iy mod (d\xE9bil)",
          min: 0,
          max: 10,
          step: 0.1
        }), p.addBinding(ye, "J_mod", {
          label: "J mod",
          min: 0,
          max: 10,
          step: 0.1
        }), yt.addFolder({
          title: "\u{1F3AF} Insertion Point",
          expanded: false
        }).addBinding(ye, "insertionPoint", {
          label: "Cardinal",
          options: {
            "1 \u2014 Bottom Left": "1 \u2014 Bottom Left",
            "2 \u2014 Bottom Center": "2 \u2014 Bottom Center",
            "3 \u2014 Bottom Right": "3 \u2014 Bottom Right",
            "4 \u2014 Middle Left": "4 \u2014 Middle Left",
            "5 \u2014 Middle Center": "5 \u2014 Middle Center",
            "6 \u2014 Middle Right": "6 \u2014 Middle Right",
            "7 \u2014 Top Left": "7 \u2014 Top Left",
            "8 \u2014 Top Center": "8 \u2014 Top Center",
            "9 \u2014 Top Right": "9 \u2014 Top Right",
            "10 \u2014 Centroid": "10 \u2014 Centroid",
            "11 \u2014 Shear Center": "11 \u2014 Shear Center"
          }
        }), yt.addFolder({
          title: "\u{1F9ED} Local Axes",
          expanded: false
        }).addBinding(ye, "beta", {
          label: "\u03B2 (\xB0)",
          min: -180,
          max: 180,
          step: 5
        });
        const $ = yt.addFolder({
          title: "\u{1F513} Releases extremo I",
          expanded: false
        });
        $.addBinding(ye, "relMxI", {
          label: "Mx I"
        }), $.addBinding(ye, "relMyI", {
          label: "My I"
        }), $.addBinding(ye, "relMzI", {
          label: "Mz I"
        });
        const I = yt.addFolder({
          title: "\u{1F513} Releases extremo J",
          expanded: false
        });
        I.addBinding(ye, "relMxJ", {
          label: "Mx J"
        }), I.addBinding(ye, "relMyJ", {
          label: "My J"
        }), I.addBinding(ye, "relMzJ", {
          label: "Mz J"
        }), yt.addFolder({
          title: "\u{1FA79} Hinges (plastic)",
          expanded: false
        }).addBinding(ye, "hinges", {
          label: "Tipo",
          options: {
            None: "None",
            "Auto-FEMA M3": "Auto-FEMA M3",
            "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3",
            "Auto-Concrete M3": "Auto-Concrete M3",
            "Auto-Steel M3": "Auto-Steel M3",
            "Custom...": "Custom..."
          }
        });
        const U = yt.addFolder({
          title: "\u{1F300} Line Springs (kN/m por m)",
          expanded: false
        });
        U.addBinding(ye, "LKx", {
          label: "LKx",
          min: 0,
          step: 100
        }), U.addBinding(ye, "LKy", {
          label: "LKy",
          min: 0,
          step: 100
        }), U.addBinding(ye, "LKz", {
          label: "LKz",
          min: 0,
          step: 100
        });
        const he = yt.addFolder({
          title: "\u2B07 Frame Loads (kN/m)"
        });
        he.addBinding(ye, "qx", {
          step: 0.1
        }), he.addBinding(ye, "qy", {
          step: 0.1
        }), he.addBinding(ye, "qz", {
          step: 0.1
        }), yt.addFolder({
          title: "\u2696 Additional Mass (kg/m)",
          expanded: false
        }).addBinding(ye, "massPerM", {
          label: "m/L",
          min: 0,
          step: 1
        }), yt.addButton({
          title: "\u2713 Aplicar a segmentos seleccionados"
        }).on("click", () => {
          Lt("segs", s, "section", ye.section), Lt("segs", s, "material", ye.material_frame);
          const K = {
            A: ye.A_mod,
            Iz: ye.Iz_mod,
            Iy: ye.Iy_mod,
            J: ye.J_mod
          };
          (K.A !== 1 || K.Iz !== 1 || K.Iy !== 1 || K.J !== 1) && Lt("segs", s, "modifiers", K), ye.insertionPoint !== "10 \u2014 Centroid" && Lt("segs", s, "insertionPoint", ye.insertionPoint), ye.beta !== 0 && Lt("segs", s, "beta", ye.beta);
          const fe = [
            ye.relMxI,
            ye.relMyI,
            ye.relMzI
          ], ge = [
            ye.relMxJ,
            ye.relMyJ,
            ye.relMzJ
          ];
          (fe.some((_e) => _e) || ge.some((_e) => _e)) && Lt("segs", s, "releases", {
            i: fe,
            j: ge
          }), ye.hinges !== "None" && Lt("segs", s, "hinges", ye.hinges);
          const Ce = [
            ye.LKx,
            ye.LKy,
            ye.LKz
          ];
          Ce.some((_e) => _e !== 0) && Lt("segs", s, "lineSprings", Ce);
          const Re = [
            ye.qx,
            ye.qy,
            ye.qz
          ];
          Re.some((_e) => _e !== 0) && Lt("segs", s, "distLoad", Re), ye.massPerM !== 0 && Lt("segs", s, "massPerM", ye.massPerM), Me(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
        });
      }
      if (M) {
        const f = yt.addFolder({
          title: `\u25AD Shell / \xC1rea \u2014 ${h.length}`
        });
        f.addBinding(ye, "shellType", {
          label: "Tipo",
          options: {
            "Mindlin (FSDT)": "Mindlin (FSDT)",
            "Kirchhoff (CPT)": "Kirchhoff (CPT)",
            "Plane stress": "Plane stress"
          }
        }), f.addBinding(ye, "thickness", {
          label: "Espesor (m)",
          min: 0.01,
          step: 0.01
        }), f.addBinding(ye, "material_shell", {
          label: "Material",
          options: {
            "Concreto C20": "Concreto C20",
            "Concreto C25": "Concreto C25",
            "Concreto C30": "Concreto C30",
            "Acero A36": "Acero A36"
          }
        }), yt.addFolder({
          title: "\u2B07 Carga superficial (kN/m\xB2)"
        }).addBinding(ye, "surfLoad", {
          label: "q",
          step: 0.1
        }), yt.addButton({
          title: "\u2713 Aplicar a \xE1reas seleccionadas"
        }).on("click", () => {
          Lt("areas", h, "shellType", ye.shellType), Lt("areas", h, "thickness", ye.thickness), Lt("areas", h, "material", ye.material_shell), ye.surfLoad !== 0 && Lt("areas", h, "surfLoad", ye.surfLoad), Me(`\u2713 Propiedades aplicadas a ${h.length} \xE1rea(s)/shell(s)`);
        });
      }
      if (w) {
        const f = yt.addFolder({
          title: "\u2139 Selecci\xF3n"
        }), p = {
          msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar"
        };
        f.addBinding(p, "msg", {
          readonly: true,
          label: ""
        });
      }
      yt.addButton({
        title: "\u2715 Cerrar (limpia selecci\xF3n)"
      }).on("click", () => {
        Je.clear(), cn();
      }), Ht.style.display = "block", ai();
    };
    window.__hekatanRefreshPropsPane = ii;
    let ao = null, Yo = false;
    k.addEventListener("pointerdown", (e) => {
      e.button === 2 && (ao = {
        x: e.clientX,
        y: e.clientY
      }, Yo = false);
    }), k.addEventListener("pointermove", (e) => {
      if (ao && e.buttons & 2 && !Yo) {
        const n = e.clientX - ao.x, s = e.clientY - ao.y;
        Math.hypot(n, s) > 8 && (Yo = true);
      }
    }), k.addEventListener("pointerup", (e) => {
      var _a3, _b, _c;
      if (e.button === 2) {
        const n = ao !== null && !Yo;
        ao = null;
        const s = window.__hekatanRClickOnElement === true;
        if (window.__hekatanRClickOnElement = false, s) return;
        if (n) {
          if (Qt ? No() : window.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape",
            bubbles: true
          })), Je.size > 0 && (Je.clear(), cn()), t.polylines) {
            const r = t.polylines.rawVal;
            (r[r.length - 1] ?? []).length > 0 && (t.polylines.val = [
              ...r,
              []
            ]);
          }
          const o = window.__hekatanCadState, a = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
          a && a !== "select" && a !== "none" ? ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"), Me(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : Me("\u238B Cancelado (click derecho)");
        }
      }
    }), k.addEventListener("contextmenu", (e) => {
      e.preventDefault(), e.stopPropagation();
    }, {
      capture: true
    }), k.addEventListener("pointerdown", (e) => {
      var _a3, _b, _c;
      const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
      n !== "select" && n !== "none" && n || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (un = {
        x: e.clientX,
        y: e.clientY
      }, go = false));
    }), k.addEventListener("pointermove", (e) => {
      if (Qt && e.buttons === 0) {
        const r = e.clientX < Qt.x;
        hs(Qt.x, Qt.y, e.clientX, e.clientY, r);
        return;
      }
      if (!un) return;
      const n = e.clientX - un.x, s = e.clientY - un.y, o = Math.hypot(n, s);
      if (!go && o < 8) return;
      go = true;
      const a = e.clientX < un.x;
      hs(un.x, un.y, e.clientX, e.clientY, a);
    }), k.addEventListener("pointerup", (e) => {
      if (!un) return;
      if (!go) {
        un = null;
        return;
      }
      const n = e.ctrlKey || e.metaKey || e.shiftKey;
      oa(un.x, un.y, e.clientX, e.clientY, n), un = null, go = false;
    }), window.__hekatanOsnap = window.__hekatanOsnap ?? {
      end: true,
      mid: true,
      node: true,
      cen: true,
      per: false,
      nea: false,
      int: true,
      ori: true,
      grid: true
    };
    const on = new ft();
    on.visible = false, on.frustumCulled = false, m.add(on);
    const aa = {
      end: 16724804,
      mid: 16498468,
      node: 6333946,
      cen: 3462041,
      per: 12616956,
      nea: 16744118,
      int: 16746496,
      ori: 16777215,
      grid: 2282478,
      track: 16761856,
      ifc: 16096779,
      ifcAxis: 16639626,
      ifcSec: 16486972,
      ifcEdge: 16498468,
      ifcVert: 16724804
    }, Xo = (e, n, s, o) => {
      var _a3, _b, _c, _d;
      for (window.__hekatanOsnapUltimo = {
        type: e,
        x: n,
        y: s,
        z: o
      }; on.children.length; ) {
        const h = on.children.pop();
        (_b = (_a3 = h.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = h.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
      const a = aa[e] ?? 16777215, r = new De().setFromPoints([
        new T(-1, -1, 0),
        new T(1, -1, 0),
        new T(1, -1, 0),
        new T(1, 1, 0),
        new T(1, 1, 0),
        new T(-1, 1, 0),
        new T(-1, 1, 0),
        new T(-1, -1, 0)
      ]);
      on.add(new an(r, new mt({
        color: a,
        linewidth: 2
      }))), on.position.set(n, s, o), on.visible = true, ys();
    };
    let ws = 4;
    const ys = () => {
      on.visible && on.scale.setScalar(ws * Ro(on.position));
    };
    window.__hekatanOsnapMarkerRef = on, window.__hekatanUpdateOsnapScale = ys, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (ws = e, ys(), v()), ws);
    const Uo = () => {
      on.visible = false, window.__hekatanOsnapUltimo = null;
    }, li = {
      ori: "Origen (0,0,0)",
      grid: "Cruce de rejilla",
      end: "Punto final",
      track: "Alineado con un nudo",
      node: "Nudo",
      mid: "Punto medio",
      cen: "Centro",
      int: "Intersecci\xF3n",
      per: "Perpendicular",
      nea: "Cercano",
      ifc: "Referencia IFC \xB7 cara",
      ifcAxis: "Referencia IFC \xB7 eje",
      ifcSec: "Secci\xF3n IFC (corte)",
      ifcEdge: "Borde IFC",
      ifcVert: "V\xE9rtice IFC"
    }, kn = document.createElement("div");
    kn.id = "hk-osnap-etiqueta", kn.style.cssText = [
      "position:fixed",
      "z-index:99995",
      "display:none",
      "pointer-events:none",
      "padding:2px 7px",
      "border-radius:4px",
      "white-space:nowrap",
      "background:rgba(15,23,42,0.92)",
      "border:1px solid rgba(148,163,184,.45)",
      "color:#e2e8f0",
      "font:12px Consolas,monospace"
    ].join(";") + ";", document.body.appendChild(kn);
    const Zo = (e, n, s) => {
      const o = li[e];
      if (!o) {
        kn.style.display = "none";
        return;
      }
      kn.textContent = o, kn.style.color = "#" + (aa[e] ?? 16777215).toString(16).padStart(6, "0"), kn.style.left = n + 18 + "px", kn.style.top = s - 26 + "px", kn.style.display = "block";
    }, ri = () => {
      kn.style.display = "none";
    }, Kn = new T(), Gn = (e, n, s) => {
      const o = g();
      if (!o) return null;
      const a = k.getBoundingClientRect();
      return Kn.set(e, n, s).project(o), !isFinite(Kn.x) || !isFinite(Kn.y) || Kn.z < -1 || Kn.z > 1 ? null : {
        x: a.left + (Kn.x * 0.5 + 0.5) * a.width,
        y: a.top + (-Kn.y * 0.5 + 0.5) * a.height
      };
    };
    window.__hekatanAPixeles = Gn;
    const ci = (e, n, s, o, a) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h;
      if (window.__hekatanOsnapOn === false) return null;
      const r = window.__hekatanOsnap, h = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
      let l = null;
      const u = {
        ori: 0,
        end: 0,
        node: 0,
        int: 1,
        grid: 2,
        mid: 2,
        cen: 3,
        per: 4,
        nea: 5
      }, d = a, M = (p, x, _, $) => {
        let I;
        if (d) {
          const U = Gn(x, _, $);
          if (!U || (I = Math.hypot(U.x - d.x, U.y - d.y), I > Rn)) return;
        } else if (I = Math.hypot(x - e, _ - n, $ - s), I > o) return;
        const L = u[p] ?? 9;
        (!l || L < l.r || L === l.r && I < l.d) && (l = {
          type: p,
          x,
          y: _,
          z: $,
          d: I,
          r: L
        });
      };
      if (r.ori !== false && M("ori", 0, 0, 0), r.grid !== false && window.__hekatanSnapEnabled === true) {
        const p = window.__hekatanGridConfig, x = (p == null ? void 0 : p.minorStep) && p.minorStep > 0 ? p.minorStep : 1, _ = ((p == null ? void 0 : p.gridSize) ?? 30) / 2, $ = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", I = (U) => Math.round(U / x) * x, L = (U, he) => Math.abs(U) <= _ + 1e-9 && Math.abs(he) <= _ + 1e-9;
        if ($ === "xz") {
          const U = I(e), he = I(s);
          L(U, he) && M("grid", U, n, he);
        } else if ($ === "yz") {
          const U = I(n), he = I(s);
          L(U, he) && M("grid", e, U, he);
        } else {
          const U = I(e), he = I(n);
          L(U, he) && M("grid", U, he, s);
          const X = window.__hekatanPlanosAux ?? [];
          for (const fe of X.slice(0, 24)) {
            if (fe.plano === "xy" || !isFinite(fe.d)) continue;
            const ge = fe.plano === "xz" ? new T(0, 1, 0) : new T(1, 0, 0), Ce = new So(ge, -fe.d), Re = new T();
            if (S.ray.intersectPlane(Ce, Re)) if (fe.plano === "xz") {
              const _e2 = I(Re.x), Be = I(Re.z);
              L(_e2, Be) && M("grid", _e2, fe.d, Be);
            } else {
              const _e2 = I(Re.y), Be = I(Re.z);
              L(_e2, Be) && M("grid", fe.d, _e2, Be);
            }
          }
          const K = window.__hekatanLevels ?? [];
          if (K.length) {
            const fe = S.ray, ge = new So(), Ce = new T();
            for (const Re of K.slice(0, 24)) {
              if (!isFinite(Re == null ? void 0 : Re.z) || Math.abs(Re.z - s) < 1e-6 || (ge.set(new T(0, 0, 1), -Re.z), !fe.intersectPlane(ge, Ce))) continue;
              const _e2 = I(Ce.x), Be = I(Ce.y);
              L(_e2, Be) && M("grid", _e2, Be, Re.z);
            }
          }
        }
      }
      (r.node || r.end) && h.forEach((p) => {
        r.node && M("node", p[0], p[1], p[2]);
      });
      for (const p of i) if (!(p.length < 2)) for (let x = 0; x < p.length - 1; x++) {
        const _ = h[p[x]], $ = h[p[x + 1]];
        if (!(!_ || !$) && (r.end && (M("end", _[0], _[1], _[2]), M("end", $[0], $[1], $[2])), r.mid && M("mid", (_[0] + $[0]) / 2, (_[1] + $[1]) / 2, (_[2] + $[2]) / 2), r.nea || r.per)) {
          const I = $[0] - _[0], L = $[1] - _[1], U = $[2] - _[2], he = I * I + L * L + U * U;
          if (he < 1e-12) continue;
          const X = Math.max(0, Math.min(1, ((e - _[0]) * I + (n - _[1]) * L + (s - _[2]) * U) / he)), K = _[0] + X * I, fe = _[1] + X * L, ge = _[2] + X * U;
          r.nea && M("nea", K, fe, ge), r.per && M("per", K, fe, ge);
        }
      }
      if (r.cen) {
        const p = ((_e = t.areas) == null ? void 0 : _e.rawVal) ?? [];
        for (const x of p) {
          const _ = i[x];
          if (!_ || _.length < 3) continue;
          const $ = _[0] === _[_.length - 1] ? _.slice(0, -1) : _;
          let I = 0, L = 0, U = 0, he = 0;
          for (const X of $) {
            const K = h[X];
            K && (I += K[0], L += K[1], U += K[2], he++);
          }
          he >= 3 && M("cen", I / he, L / he, U / he);
        }
      }
      if (r.cen) {
        const p = Hs(), x = [
          ...Lo
        ];
        for (const _ of p) x.some(($) => Math.hypot($.c[0] - _.c[0], $.c[1] - _.c[1], $.c[2] - _.c[2]) < 1e-6 && Math.abs($.r - _.r) < 1e-6) || x.push(_);
        for (const _ of x) {
          if (!h.some((L) => Math.abs(Math.hypot(L[0] - _.c[0], L[1] - _.c[1], L[2] - _.c[2]) - _.r) < 1e-6)) continue;
          const I = Math.hypot(e - _.c[0], n - _.c[1], s - _.c[2]);
          if (I < o || Math.abs(I - _.r) < o) {
            const L = Math.min(I, o * 0.5), U = 3;
            (!l || U < l.r || U === l.r && L < l.d) && (l = {
              type: "cen",
              x: _.c[0],
              y: _.c[1],
              z: _.c[2],
              d: L,
              r: U
            });
          }
        }
      }
      if (r.int) {
        const p = [];
        for (const x of i) for (let _ = 0; _ < x.length - 1; _++) {
          const $ = h[x[_]], I = h[x[_ + 1]];
          if (!$ || !I) continue;
          const L = I[0] - $[0], U = I[1] - $[1], he = I[2] - $[2], X = L * L + U * U + he * he;
          if (X < 1e-12) continue;
          const K = Math.max(0, Math.min(1, ((e - $[0]) * L + (n - $[1]) * U + (s - $[2]) * he) / X));
          Math.hypot($[0] + K * L - e, $[1] + K * U - n, $[2] + K * he - s) < 3 * o && p.push([
            $,
            I
          ]);
        }
        for (let x = 0; x < p.length; x++) for (let _ = x + 1; _ < p.length; _++) {
          const [$, I] = p[x], [L, U] = p[_], he = [
            I[0] - $[0],
            I[1] - $[1],
            I[2] - $[2]
          ], X = [
            U[0] - L[0],
            U[1] - L[1],
            U[2] - L[2]
          ], K = [
            $[0] - L[0],
            $[1] - L[1],
            $[2] - L[2]
          ], fe = he[0] * he[0] + he[1] * he[1] + he[2] * he[2], ge = he[0] * X[0] + he[1] * X[1] + he[2] * X[2], Ce = X[0] * X[0] + X[1] * X[1] + X[2] * X[2], Re = he[0] * K[0] + he[1] * K[1] + he[2] * K[2], _e2 = X[0] * K[0] + X[1] * K[1] + X[2] * K[2], Be = fe * Ce - ge * ge;
          if (Be < 1e-12) continue;
          const Ie = (ge * _e2 - Ce * Re) / Be, qe = (fe * _e2 - ge * Re) / Be;
          if (Ie < -1e-6 || Ie > 1 + 1e-6 || qe < -1e-6 || qe > 1 + 1e-6) continue;
          const Ne = [
            $[0] + Ie * he[0],
            $[1] + Ie * he[1],
            $[2] + Ie * he[2]
          ], Te = [
            L[0] + qe * X[0],
            L[1] + qe * X[1],
            L[2] + qe * X[2]
          ];
          if (Math.hypot(Ne[0] - Te[0], Ne[1] - Te[1], Ne[2] - Te[2]) > 1e-4) continue;
          [
            $,
            I,
            L,
            U
          ].some((He) => Math.hypot(He[0] - Ne[0], He[1] - Ne[1], He[2] - Ne[2]) < 1e-6) || M("int", Ne[0], Ne[1], Ne[2]);
        }
      }
      const y = window.__hekatanAxisGrids ?? [], w = window.__hekatanLevels ?? [], z = y.filter((p) => p && p.start && p.end).map((p) => [
        p.start,
        p.end
      ]);
      for (const [p, x] of z) {
        r.end && (M("end", p[0], p[1], p[2]), M("end", x[0], x[1], x[2]));
        const _ = x[0] - p[0], $ = x[1] - p[1], I = x[2] - p[2], L = _ * _ + $ * $ + I * I;
        if (L < 1e-12) continue;
        const U = Math.max(0, Math.min(1, ((e - p[0]) * _ + (n - p[1]) * $ + (s - p[2]) * I) / L));
        if (r.nea && M("nea", p[0] + U * _, p[1] + U * $, p[2] + U * I), r.int && Math.abs(I) > 1e-9) for (const he of w) {
          const X = (he.z - p[2]) / I;
          X < -1e-6 || X > 1 + 1e-6 || M("int", p[0] + X * _, p[1] + X * $, he.z);
        }
      }
      if (r.int || r.node) for (let p = 0; p < z.length; p++) for (let x = p + 1; x < z.length; x++) {
        const [_, $] = z[p], [I, L] = z[x], U = $[0] - _[0], he = $[1] - _[1], X = L[0] - I[0], K = L[1] - I[1], fe = U * K - he * X;
        if (Math.abs(fe) < 1e-12) continue;
        const ge = _[0] - I[0], Ce = _[1] - I[1], Re = (X * Ce - K * ge) / fe, _e2 = (U * Ce - he * ge) / fe;
        if (Re < -1e-6 || Re > 1 + 1e-6 || _e2 < -1e-6 || _e2 > 1 + 1e-6) continue;
        const Be = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
        M("int", _[0] + Re * U, _[1] + Re * he, typeof Be == "number" ? Be : s);
      }
      const F = window.__hekatanDrawingAuxLines, f = (F == null ? void 0 : F.rawVal) ?? (F == null ? void 0 : F.val) ?? F ?? [];
      for (const p of f) {
        if (p.length !== 6) continue;
        const x = [
          p[0],
          p[1],
          p[2]
        ], _ = [
          p[3],
          p[4],
          p[5]
        ];
        if (r.end && (M("end", x[0], x[1], x[2]), M("end", _[0], _[1], _[2])), r.mid && M("mid", (x[0] + _[0]) / 2, (x[1] + _[1]) / 2, (x[2] + _[2]) / 2), r.nea || r.per) {
          const $ = _[0] - x[0], I = _[1] - x[1], L = _[2] - x[2], U = $ * $ + I * I + L * L;
          if (U < 1e-12) continue;
          const he = Math.max(0, Math.min(1, ((e - x[0]) * $ + (n - x[1]) * I + (s - x[2]) * L) / U)), X = x[0] + he * $, K = x[1] + he * I, fe = x[2] + he * L;
          r.nea && M("nea", X, K, fe), r.per && M("per", X, K, fe);
        }
      }
      return l ? {
        type: l.type,
        x: l.x,
        y: l.y,
        z: l.z
      } : null;
    }, io = new ft();
    io.frustumCulled = false, m.add(io);
    const ia = new mt({
      color: 15123555,
      transparent: true,
      opacity: 1,
      depthTest: false
    });
    let la = 0;
    const ra = () => {
      var _a3, _b;
      for (const e of io.children.slice()) io.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
    };
    window.__hekatanDestello = (e) => {
      var _a3, _b;
      ra();
      const n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
      for (const a of e || []) {
        const r = String(a).split(":");
        let h = [];
        if (r[0] === "pt") {
          const u = n[+r[1]];
          u && (h = [
            u,
            [
              u[0] + 1e-3,
              u[1],
              u[2]
            ]
          ]);
        } else if (r[0] === "seg") {
          const u = s[+r[1]] || [], d = n[u[+r[2]]], M = n[u[+r[2] + 1]];
          d && M && (h = [
            d,
            M
          ]);
        } else r[0] === "poly" && (h = (s[+r[1]] || []).map((d) => n[d]).filter(Boolean));
        if (h.length < 2) continue;
        const i = new De().setFromPoints(h.map((u) => new T(u[0], u[1], u[2]))), l = new Et(i, ia);
        l.renderOrder = 1200, io.add(l);
      }
      if (!io.children.length) return;
      la = performance.now() + 900;
      const o = () => {
        const a = la - performance.now();
        if (a <= 0) {
          ra(), v();
          return;
        }
        ia.opacity = Math.min(1, a / 900) * 0.95, v(), requestAnimationFrame(o);
      };
      requestAnimationFrame(o);
    }, window.addEventListener("hk:property-applied", (e) => {
      var _a3;
      const n = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
      Array.isArray(n) && n.length && window.__hekatanDestello(n);
    }), window.__hekatanOsnapCompute = ci, window.__hekatanOsnapShow = Xo, window.__hekatanOsnapHide = Uo;
    let Qe = [], At = 0, Hn = 0, Yt = null;
    const Mo = document.createElement("div");
    Mo.id = "hk-cad-status", Mo.style.cssText = [
      "position:fixed",
      "bottom:8px",
      "left:50%",
      "transform:translateX(-50%)",
      "padding:6px 14px",
      "background:rgba(15, 23, 42, 0.92)",
      "color:#22d3ee",
      "border:1px solid rgba(34, 211, 238, 0.5)",
      "border-radius:6px",
      "font-family:Consolas, monospace",
      "font-size:12px",
      "z-index:90",
      "pointer-events:none",
      "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)",
      "max-width:90vw",
      "white-space:nowrap",
      "overflow:hidden",
      "text-overflow:ellipsis"
    ].join(";") + ";", Mo.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(Mo);
    const di = () => {
      var _a3, _b, _c;
      const e = [];
      window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), zt && e.push(`\u{1F512} LOCK ${zt.toUpperCase()}`);
      const s = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
      return Math.abs(s) > 1e-3 && e.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
    }, Me = (e) => {
      var _a3;
      const n = e + di();
      Mo.textContent = n, window.__hekatanCadStatusText = n;
      try {
        (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
      } catch {
      }
    }, ui = "Comando:", fi = () => {
      var _a3, _b, _c, _d;
      const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", n = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], s = n.length ? n[n.length - 1] : [], o = Qe.length, a = (r, h = []) => ({
        txt: r,
        ops: h
      });
      switch (e) {
        case "line":
          return s.length >= 2 ? a("L\xCDNEA Precise punto siguiente o", [
            "Cerrar",
            "desHacer"
          ]) : s.length === 1 ? a("L\xCDNEA Precise punto siguiente o", [
            "desHacer"
          ]) : a("L\xCDNEA Precise primer punto:");
        case "polyline":
          return s.length >= 2 ? a("POLIL\xCDNEA Precise punto siguiente o", [
            "Cerrar",
            "desHacer"
          ]) : s.length === 1 ? a("POLIL\xCDNEA Precise punto siguiente o", [
            "desHacer"
          ]) : a("POLIL\xCDNEA Precise punto inicial:");
        case "node":
          return a("NUDO Precise punto:");
        case "area":
          return a(`LOSA Precise v\xE9rtice ${Math.min(s.length + 1, 4)} de 4 (en orden, antihorario):`);
        case "rectarea":
          return a(o ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
        case "polyarea":
          return a(`\xC1REA LIBRE Precise v\xE9rtice ${Ge.length + 1} (Enter o clic derecho cierra y malla):`);
        case "fillarea":
          return a("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
        case "medir":
          return a(`REGLA ${lt.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
        case "rect":
          return a(o ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
        case "circle":
          return a(o ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
        case "arc":
          return a(o === 0 ? "ARCO Precise punto inicial:" : o === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
        case "parabola":
          return a(`PAR\xC1BOLA Precise punto ${o + 1} de 3 (pasa por los tres):`);
        case "cubica":
          return a(`C\xDABICA Precise punto ${o + 1} de 4 (pasa por los cuatro):`);
        case "revolve":
          return a("REVOLUCI\xD3N Precise un punto del eje vertical (Z) alrededor del que gira la selecci\xF3n:");
        case "loft":
          return a("BARRIDO Precise el centro de la planta (eje Z desde el que se mide la panza del perfil):");
        case "col":
          return a(`COLUMNA Precise punto de inserci\xF3n (altura ${At > 0 ? At : 3} m; teclee otra + Enter antes del clic):`);
        case "wall":
          return a(o ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${At > 0 ? At : 3} m; teclee otra + Enter):`);
        case "plane3":
          return a(`PLANO Precise punto ${o + 1} de 3:`);
        case "extp":
          return a("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
        case "extl":
          return a("EXTRUIR Precise la l\xEDnea a levantar:");
        case "extend":
          return a(Yt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
        case "trim":
          return a(Yt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
        case "offset":
          return a(Yt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Hn > 0 ? ` (distancia ${Hn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
        case "axis":
          return a("EJE Precise el primer punto del eje:");
        case "aux":
          return a(o ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
        case "auxp":
          return a("PUNTO AUXILIAR Precise punto:");
        case "chaflan":
          return a(o ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
        case "delete":
          return a("BORRAR Designe objetos (pase por encima y haga clic):");
        case "move":
          return Je.size ? a(o ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
        case "copy":
          return Je.size ? a(o ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
        case "select":
          return Je.size ? a(`SELECCI\xD3N ${Je.size} objeto${Je.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
        default:
          return a(ui);
      }
    }, Ot = () => {
      var _a3, _b, _c, _d, _e;
      try {
        const e = fi(), n = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !n && !s ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
        (_e = window.__hekatanCadPrompt) == null ? void 0 : _e.call(window, a, e.ops);
      } catch {
      }
    };
    window.__hekatanCadRefreshPrompt = Ot, window.__hekatanRefreshStatus = () => {
      const e = window.__hekatanCadStatusText ?? "", n = e.split("   |   ")[0] ?? e;
      Me(n);
    }, window.__hekatanCadResetPending = () => {
      Qe = [], Ge = [], Fe.visible = false, xs(), Yt = null, v(), Me("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Ot();
    };
    function xs() {
      if (!t.polylines) return;
      const e = t.polylines.rawVal.filter((n) => n.length >= 2);
      t.polylines.val = [
        ...e,
        []
      ];
    }
    window.__hekatanCerrarPolilinea = xs;
    const lo = [], qo = [], pi = () => {
      const e = window.__hekatanDrawingAuxLines;
      return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
    }, hi = () => JSON.parse(JSON.stringify(window.__hekatanAxisGrids ?? [])), mi = () => JSON.parse(JSON.stringify(window.__hekatanLevels ?? [])), wi = () => JSON.parse(JSON.stringify(window.__hekatanPlanosAux ?? [])), gs = () => {
      var _a3, _b;
      return {
        p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])),
        l: JSON.parse(JSON.stringify(((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [])),
        a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])),
        x: pi(),
        e: hi(),
        n: mi(),
        g: wi()
      };
    }, ca = (e) => {
      var _a3, _b, _c, _d;
      if (t.points.val = e.p, t.polylines && (t.polylines.val = e.l), t.areas && (t.areas.val = e.a), e.x) {
        const n = window.__hekatanDrawingAuxLines;
        n && "val" in n && (n.val = e.x);
      }
      if (e.e) {
        const n = window.__hekatanAxisGrids;
        Array.isArray(n) && (n.length = 0, n.push(...e.e));
      }
      if (e.n) {
        const n = window.__hekatanLevels;
        Array.isArray(n) && (n.length = 0, n.push(...e.n));
      }
      if (e.g) {
        const n = window.__hekatanPlanosAux;
        Array.isArray(n) ? (n.length = 0, n.push(...e.g)) : window.__hekatanPlanosAux = e.g;
      }
      try {
        (_a3 = window.__hekatanRefreshAxes) == null ? void 0 : _a3.call(window), (_b = window.__hekatanRefreshLevels) == null ? void 0 : _b.call(window);
      } catch {
      }
      try {
        (_c = window.__hekatanRefrescarGrillas) == null ? void 0 : _c.call(window);
      } catch {
      }
      Qe = [], Se.visible = false, $t.visible = false, jt();
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      v(), Ot();
    }, Pt = () => {
      lo.push(gs()), lo.length > 100 && lo.shift(), qo.length = 0;
    }, Ko = () => {
      const e = lo.pop();
      if (!e) {
        Me("\u21B6 Nada para deshacer");
        return;
      }
      qo.push(gs()), ca(e), Me(`\u21B6 Deshacer \u2014 quedan ${lo.length}`);
    }, da = () => {
      const e = qo.pop();
      if (!e) {
        Me("\u21B7 Nada para rehacer");
        return;
      }
      lo.push(gs()), ca(e), Me(`\u21B7 Rehacer \u2014 quedan ${qo.length}`);
    };
    window.__hekatanPushUndo = Pt, window.__hekatanUndo = Ko, window.__hekatanRedo = da, document.addEventListener("keydown", (e) => {
      var _a3;
      const n = e.key.toLowerCase();
      if (!((e.ctrlKey || e.metaKey) && (n === "y" || n === "z" && e.shiftKey))) return;
      const o = e.target;
      o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && (((_a3 = o.value) == null ? void 0 : _a3.length) ?? 0) > 0 && o.__hkSucio || (e.preventDefault(), e.stopPropagation(), da());
    }, {
      capture: true
    }), window.__hekatanCadOption = (e) => {
      var _a3, _b, _c, _d, _e;
      const n = e.trim().toLowerCase(), s = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
      if (!t.polylines) return false;
      const o = t.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
      if (s !== "line" && s !== "polyline") return n === "u" || n === "deshacer" || n === "undo" ? (Ko(), true) : false;
      if (n === "c" || n === "cerrar" || n === "close") {
        if (a.length < 3) return Me("Cerrar necesita al menos tres puntos."), true;
        Pt(), t.polylines.val = [
          ...o.slice(0, -1),
          [
            ...a,
            a[0]
          ],
          []
        ];
        try {
          (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
        } catch {
        }
        return bs(), Me(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
      }
      if (n === "u" || n === "deshacer" || n === "undo") {
        if (!a.length) return Ko(), true;
        Pt();
        const r = a[a.length - 1], h = a.slice(0, -1), i = o.some((d, M) => M !== o.length - 1 && d.includes(r)) || h.includes(r);
        let l = t.points.rawVal, u = [
          ...o.slice(0, -1),
          h
        ];
        if (!i && r === l.length - 1 && (l = l.slice(0, -1), t.points.val = l), t.polylines.val = u, h.length) {
          const d = l[h[h.length - 1]];
          d && (Pe = [
            d[0],
            d[1],
            d[2]
          ]);
        } else Pe = null, Se.visible = false;
        try {
          (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
        } catch {
        }
        return v(), Me(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${h.length}.`), Ot(), true;
      }
      return false;
    }, document.addEventListener("input", (e) => {
      const n = e.target;
      n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && (n.__hkSucio = true);
    }, {
      capture: true
    }), document.addEventListener("focusout", (e) => {
      const n = e.target;
      n && (n.__hkSucio = false);
    }, {
      capture: true
    }), document.addEventListener("keydown", (e) => {
      var _a3;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        const n = e.target, s = n == null ? void 0 : n.tagName;
        if ((s === "INPUT" || s === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && ((_a3 = n.value) == null ? void 0 : _a3.length) > 0 && !!n.__hkSucio) return;
        e.preventDefault(), e.stopPropagation(), Ko();
      }
    }, {
      capture: true
    });
    const bs = () => {
      Qe = [], Yt = null, xs(), zt = null, Ys(), Se.visible = false, $t.visible = false, jt(), Me("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), v(), Ot();
    };
    window.__hekatanFinalizeDraw = bs, window.__hekatanCancelarTodo = () => (Ms(), true);
    const Ms = () => {
      var _a3, _b, _c;
      Qe = [], Ge = [], Fe.visible = false;
      let e = false;
      Je.size && (Je.clear(), cn(), e = true), bs();
      try {
        const n = window.__hekatanCadState, s = (_b = (_a3 = n == null ? void 0 : n.get) == null ? void 0 : _a3.call(n)) == null ? void 0 : _b.tool;
        s && s !== "select" && ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"));
      } catch {
      }
      Me(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), v(), Ot();
    };
    window.__hekatanEscapeCancel = Ms;
    const ua = () => {
      var _a3;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Set();
      return Je.forEach((s) => {
        if (s.startsWith("pt:")) n.add(+s.slice(3));
        else if (s.startsWith("poly:")) (e[+s.slice(5)] || []).forEach((o) => n.add(o));
        else if (s.startsWith("seg:")) {
          const o = s.split(":"), a = e[+o[1]] || [], r = a[+o[2]], h = a[+o[2] + 1];
          r != null && n.add(r), h != null && n.add(h);
        }
      }), n;
    }, fa = (e, n, s) => {
      var _a3;
      const o = ua();
      if (!o.size) return 0;
      Pt();
      const a = t.points.rawVal.map((r, h) => o.has(h) ? [
        r[0] + e,
        r[1] + n,
        r[2] + s
      ] : r);
      t.points.val = a;
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return cn(), v(), o.size;
    };
    window.__hekatanMoveSelection = fa;
    const pa = (e, n) => {
      var _a3, _b, _c, _d, _e;
      if (!Je.size) {
        Me(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Ot();
        return;
      }
      if (Qe.push(n), Qe.length === 1) {
        Pe = n, Me(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)}). Precise el segundo punto.`), Ot();
        return;
      }
      const [s, o] = Qe, a = [
        o[0] - s[0],
        o[1] - s[1],
        o[2] - s[2]
      ];
      Qe = [], Se.visible = false;
      let r = 0;
      e === "move" ? r = fa(a[0], a[1], a[2]) : (r = ua().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), Me(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${r} nudo${r === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), e === "move" && (Je.clear(), cn()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Ot();
    };
    window.__hekatanPasoMoverCopiar = pa;
    const yi = () => {
      var _a3, _b, _c;
      const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
      return e === "xz" ? [
        0,
        1,
        0
      ] : e === "yz" ? [
        1,
        0,
        0
      ] : [
        0,
        0,
        1
      ];
    }, Bn = (e, n) => Math.hypot(e[0] - n[0], e[1] - n[1], e[2] - n[2]), vs = (e, n, s, o, a, r) => {
      const h = [
        n[0] - e[0],
        n[1] - e[1],
        n[2] - e[2]
      ], i = [
        o[0] - s[0],
        o[1] - s[1],
        o[2] - s[2]
      ], l = [
        e[0] - s[0],
        e[1] - s[1],
        e[2] - s[2]
      ], u = h[0] * h[0] + h[1] * h[1] + h[2] * h[2], d = h[0] * i[0] + h[1] * i[1] + h[2] * i[2], M = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], y = h[0] * l[0] + h[1] * l[1] + h[2] * l[2], w = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], z = u * M - d * d;
      if (z < 1e-12) return null;
      const F = (d * w - M * y) / z, f = (u * w - d * y) / z;
      if (!a && (F < -1e-6 || F > 1 + 1e-6) || !r && (f < -1e-6 || f > 1 + 1e-6)) return null;
      const p = [
        e[0] + F * h[0],
        e[1] + F * h[1],
        e[2] + F * h[2]
      ], x = [
        s[0] + f * i[0],
        s[1] + f * i[1],
        s[2] + f * i[2]
      ];
      return Bn(p, x) > 1e-4 ? null : p;
    }, xi = (e) => {
      var _a3;
      return (((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((n, s) => n + s.filter((o) => o === e).length, 0);
    }, gi = {
      offset: "DESFASE",
      trim: "RECORTAR",
      extend: "ALARGAR"
    }, bi = (e, n) => {
      var _a3, _b;
      if (!t.polylines) return;
      const s = t.polylines.rawVal, o = t.points.rawVal, a = gi[e];
      if (!Yt) {
        if (hn < 0) {
          Me(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
          return;
        }
        Yt = {
          poly: hn,
          seg: Math.max(0, In)
        }, Me(e === "offset" ? `DESFASE l\xEDnea #${Yt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Hn > 0 ? ` (${Hn} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Ot();
        return;
      }
      if (e === "offset") {
        const F = Yt.poly, f = s[F];
        if (!f || f.length < 2) {
          Yt = null, Me("DESFASE: esa polil\xEDnea no tiene tramos."), Ot();
          return;
        }
        const p = f.length > 2 && f[0] === f[f.length - 1], x = yi(), _ = [];
        for (let Ie = 0; Ie < f.length - 1; Ie++) {
          const qe = o[f[Ie]], Ne = o[f[Ie + 1]], Te = [
            Ne[0] - qe[0],
            Ne[1] - qe[1],
            Ne[2] - qe[2]
          ], Ze = Math.hypot(Te[0], Te[1], Te[2]) || 1, He = Te[0] / Ze, pt = Te[1] / Ze, ht = Te[2] / Ze, kt = [
            x[1] * ht - x[2] * pt,
            x[2] * He - x[0] * ht,
            x[0] * pt - x[1] * He
          ], xt = Math.hypot(kt[0], kt[1], kt[2]) || 1;
          _.push({
            a: qe,
            b: Ne,
            n: [
              kt[0] / xt,
              kt[1] / xt,
              kt[2] / xt
            ]
          });
        }
        let $ = 0, I = 1 / 0;
        _.forEach((Ie, qe) => {
          const Ne = po(n[0], n[1], n[2], Ie.a[0], Ie.a[1], Ie.a[2], Ie.b[0], Ie.b[1], Ie.b[2]);
          Ne < I && (I = Ne, $ = qe);
        });
        const L = _[$], U = Math.sign((n[0] - L.a[0]) * L.n[0] + (n[1] - L.a[1]) * L.n[1] + (n[2] - L.a[2]) * L.n[2]) || 1, he = Hn > 0 ? Hn : I;
        if (he < 1e-6) {
          Me("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
          return;
        }
        const X = _.map((Ie) => ({
          a: [
            Ie.a[0] + U * he * Ie.n[0],
            Ie.a[1] + U * he * Ie.n[1],
            Ie.a[2] + U * he * Ie.n[2]
          ],
          b: [
            Ie.b[0] + U * he * Ie.n[0],
            Ie.b[1] + U * he * Ie.n[1],
            Ie.b[2] + U * he * Ie.n[2]
          ]
        })), K = X.length, fe = (Ie) => {
          const qe = X[(Ie - 1 + K) % K], Ne = X[Ie % K];
          return vs(qe.a, qe.b, Ne.a, Ne.b, true, true) ?? Ne.a;
        }, ge = [], Ce = p ? K : K + 1;
        for (let Ie = 0; Ie < Ce; Ie++) !p && Ie === 0 ? ge.push(X[0].a) : !p && Ie === K ? ge.push(X[K - 1].b) : ge.push(fe(Ie));
        Pt();
        const Re = o.length;
        t.points.val = [
          ...o,
          ...ge
        ];
        const _e = ge.map((Ie, qe) => Re + qe);
        p && _e.push(Re);
        let Be = s.slice();
        Be.length && Be[Be.length - 1].length === 0 && (Be = Be.slice(0, -1)), t.polylines.val = [
          ...Be,
          _e,
          []
        ], Yt = null, Me(`\u2713 Desfase a ${he.toFixed(2)} m \u2014 ${K} tramo${K === 1 ? "" : "s"} nuevo${K === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
        try {
          (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
        } catch {
        }
        v(), Ot();
        return;
      }
      let r = hn, h = Math.max(0, In);
      if (r < 0 || r === Yt.poly && h === Yt.seg) {
        let f = (window.__hekatanSnap2D ?? 0.5) * 1.5;
        if (r = -1, s.forEach((p, x) => {
          for (let _ = 0; _ < p.length - 1; _++) {
            if (x === Yt.poly && _ === Yt.seg) continue;
            const $ = o[p[_]], I = o[p[_ + 1]];
            if (!$ || !I) continue;
            const L = po(n[0], n[1], n[2], $[0], $[1], $[2], I[0], I[1], I[2]);
            L < f && (f = L, r = x, h = _);
          }
        }), r < 0) {
          Me(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
          return;
        }
      }
      const i = s[Yt.poly], l = o[i[Yt.seg]], u = o[i[Yt.seg + 1]], d = s[r], M = d[h], y = d[h + 1];
      if (!l || !u || M == null || y == null) {
        Me(`${a}: no se pudo leer el tramo.`);
        return;
      }
      const w = o[M], z = o[y];
      if (e === "trim") {
        const F = vs(w, z, l, u, false, false);
        if (!F) {
          Me("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
          return;
        }
        Pt();
        const f = o.length;
        t.points.val = [
          ...o,
          F
        ];
        const p = [
          ...d.slice(0, h + 1),
          f,
          ...d.slice(h + 1)
        ];
        t.polylines.val = s.map((_, $) => $ === r ? p : _);
        const x = Bn(n, w) < Bn(n, z);
        qs(r, x ? h : h + 1), Me(`\u2713 Recortado en (${F[0].toFixed(2)}, ${F[1].toFixed(2)}, ${F[2].toFixed(2)}). Designe otro trozo o Esc.`);
      } else {
        const F = vs(w, z, l, u, true, false);
        if (!F) {
          Me("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
          return;
        }
        const p = Bn(n, w) < Bn(n, z) ? h : h + 1;
        if (p !== 0 && p !== d.length - 1) {
          Me("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
          return;
        }
        const x = d[p];
        if (Bn(F, w) + Bn(F, z) < Bn(w, z) + 1e-6) {
          Me("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
          return;
        }
        if (Pt(), xi(x) > 1) {
          const $ = o.length;
          t.points.val = [
            ...o,
            F
          ];
          const I = d.slice();
          I[p] = $, t.polylines.val = s.map((L, U) => U === r ? I : L);
        } else t.points.val = o.map(($, I) => I === x ? F : $);
        Me(`\u2713 Alargada hasta (${F[0].toFixed(2)}, ${F[1].toFixed(2)}, ${F[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
      }
      try {
        (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
      } catch {
      }
      v(), Ot();
    };
    window.__hekatanSelectionSize = () => Je.size, window.__hekatanSelectLast = () => {
      var _a3;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
      let n = e.length - 1;
      for (; n >= 0 && (!e[n] || e[n].length < 2); ) n--;
      return Je.clear(), n >= 0 && Je.add(`poly:${n}`), cn(), Me(n >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Je.size;
    }, window.__hekatanSelectAll = () => {
      var _a3, _b;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
      Je.clear();
      const s = /* @__PURE__ */ new Set();
      return e.forEach((o, a) => {
        !o || o.length < 2 || (Je.add(`poly:${a}`), o.forEach((r) => s.add(r)));
      }), n.forEach((o, a) => {
        s.has(a) || Je.add(`pt:${a}`);
      }), cn(), Me(`SELECCI\xD3N ${Je.size} objetos (todo el modelo) \xB7 Esc suelta`), Je.size;
    }, window.__hekatanReplicateSelection = (e, n, s, o, a = 0) => {
      var _a3, _b, _c, _d;
      o = Math.max(1, Math.round(o || 1)), a = Math.max(0, Math.round(a || 0));
      const r = [
        ...Je
      ], h = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), u = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), M = [];
      if (r.forEach((f) => {
        if (f.startsWith("pt:")) {
          const p = +f.slice(3);
          h[p] && u.add(p);
        } else if (f.startsWith("poly:")) {
          const p = +f.slice(5);
          if (!i[p] || i[p].length < 2) return;
          d.add(p), i[p].forEach((x) => u.add(x));
        } else if (f.startsWith("seg:")) {
          const p = f.split(":"), x = +p[1], _ = +p[2], $ = i[x] || [], I = $[_], L = $[_ + 1];
          I != null && L != null && (M.push([
            I,
            L
          ]), u.add(I), u.add(L));
        }
      }), !u.size) return 0;
      Pt();
      const y = [
        ...h
      ];
      let w = i.slice();
      w.length && w[w.length - 1].length === 0 && (w = w.slice(0, -1));
      const z = [
        ...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []
      ], F = [
        ...u
      ];
      for (let f = 1; f <= o; f++) {
        const p = a + f, x = e * p, _ = n * p, $ = s * p, I = /* @__PURE__ */ new Map();
        F.forEach((L) => {
          I.set(L, y.length), y.push([
            h[L][0] + x,
            h[L][1] + _,
            h[L][2] + $
          ]);
        }), d.forEach((L) => {
          const U = i[L].map((X) => I.has(X) ? I.get(X) : X), he = w.length;
          w.push(U), l.has(L) && z.push(he);
        }), M.forEach(([L, U]) => {
          w.push([
            I.get(L),
            I.get(U)
          ]);
        });
      }
      w.push([]), t.points.val = y, t.polylines && (t.polylines.val = w), t.areas && (t.areas.val = z);
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return v(), o;
    }, window.__hekatanExtrudeSelection = (e, n, s, o) => {
      var _a3, _b, _c, _d;
      o = Math.max(1, Math.round(o || 1));
      const a = [
        ...Je
      ], r = t.points.rawVal, h = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), l = /* @__PURE__ */ new Set(), u = [], d = /* @__PURE__ */ new Set();
      for (const x of h) for (const _ of x) d.add(_);
      if (a.forEach((x) => {
        if (x.startsWith("poly:")) {
          const _ = +x.slice(5);
          if (i.has(_)) return;
          const $ = h[_] || [];
          for (let I = 0; I + 1 < $.length; I++) u.push([
            $[I],
            $[I + 1]
          ]), d.add($[I]), d.add($[I + 1]);
        } else if (x.startsWith("seg:")) {
          const _ = x.split(":"), $ = +_[1], I = +_[2], L = h[$] || [], U = L[I], he = L[I + 1];
          U != null && he != null && (u.push([
            U,
            he
          ]), d.add(U), d.add(he));
        }
      }), a.forEach((x) => {
        if (x.startsWith("pt:")) {
          const _ = +x.slice(3);
          r[_] && !d.has(_) && l.add(_);
        }
      }), !l.size && !u.length) return {
        lineas: 0,
        areas: 0
      };
      Pt();
      const M = [
        ...r
      ];
      let y = h.slice();
      y.length && y[y.length - 1].length === 0 && (y = y.slice(0, -1));
      const w = [
        ...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []
      ], z = /* @__PURE__ */ new Map(), F = (x, _) => {
        if (_ === 0) return x;
        const $ = x + ":" + _;
        let I = z.get($);
        if (I == null) {
          const L = [
            r[x][0] + e * _,
            r[x][1] + n * _,
            r[x][2] + s * _
          ];
          I = M.findIndex((U) => Math.abs(U[0] - L[0]) < 1e-3 && Math.abs(U[1] - L[1]) < 1e-3 && Math.abs(U[2] - L[2]) < 1e-3), I < 0 && (I = M.length, M.push(L)), z.set($, I);
        }
        return I;
      };
      let f = 0, p = 0;
      l.forEach((x) => {
        const _ = [
          x
        ];
        for (let $ = 1; $ <= o; $++) _.push(F(x, $));
        y.push(_), f += o;
      }), u.forEach(([x, _]) => {
        for (let $ = 1; $ <= o; $++) {
          const I = [
            F(x, $ - 1),
            F(_, $ - 1),
            F(_, $),
            F(x, $)
          ];
          w.push(y.length), y.push([
            ...I,
            I[0]
          ]), p++;
        }
      }), y.push([]), t.points.val = M, t.polylines && (t.polylines.val = y), t.areas && (t.areas.val = w);
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return v(), {
        lineas: f,
        areas: p
      };
    }, window.__hekatanVoladoSelection = (e, n = {}) => {
      var _a3, _b, _c;
      const s = Number(e);
      if (!Number.isFinite(s) || Math.abs(s) < 1e-6) return 0;
      const o = n.losa !== false, a = n.vigaBorde !== false, r = n.lados === "afuera" ? "afuera" : "ambos", h = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = [];
      if ([
        ...Je
      ].forEach((F) => {
        if (F.startsWith("seg:")) {
          const f = F.split(":"), p = +f[1], x = +f[2], _ = i[p] || [], $ = _[x], I = _[x + 1];
          $ != null && I != null && l.push([
            $,
            I
          ]);
        } else if (F.startsWith("poly:")) {
          const f = i[+F.slice(5)] || [];
          for (let p = 0; p + 1 < f.length; p++) l.push([
            f[p],
            f[p + 1]
          ]);
        }
      }), !l.length) return 0;
      let u = 0, d = 0;
      for (const F of h) u += F[0], d += F[1];
      u /= Math.max(1, h.length), d /= Math.max(1, h.length), Pt();
      const M = [
        ...h
      ];
      let y = i.slice();
      y.length && y[y.length - 1].length === 0 && (y = y.slice(0, -1));
      const w = [
        ...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []
      ];
      let z = 0;
      for (const [F, f] of l) {
        const p = h[F], x = h[f];
        if (!p || !x) continue;
        const _ = x[0] - p[0], $ = x[1] - p[1], I = Math.hypot(_, $);
        if (I < 1e-6) continue;
        let L = -$ / I, U = _ / I;
        const he = (p[0] + x[0]) / 2, X = (p[1] + x[1]) / 2;
        (he - u) * L + (X - d) * U < 0 && (L = -L, U = -U);
        const K = r === "ambos" ? [
          1,
          -1
        ] : [
          1
        ];
        for (const fe of K) {
          const ge = L * s * fe, Ce = U * s * fe, Re = M.length;
          M.push([
            p[0] + ge,
            p[1] + Ce,
            p[2]
          ]);
          const _e = M.length;
          M.push([
            x[0] + ge,
            x[1] + Ce,
            x[2]
          ]), y.push([
            F,
            Re
          ]), y.push([
            f,
            _e
          ]), a && y.push([
            Re,
            _e
          ]), o && (w.push(y.length), y.push([
            F,
            f,
            _e,
            Re,
            F
          ])), z++;
        }
      }
      if (!z) return 0;
      y.push([]), t.points.val = M, t.polylines && (t.polylines.val = y), t.areas && (t.areas.val = w);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      return v(), z;
    }, k.addEventListener("click", (e) => {
      var _a3, _b, _c;
      if (window.__hekatanCursorPx = {
        x: e.clientX,
        y: e.clientY
      }, qn > 5) {
        qn = 0;
        return;
      }
      qn = 0;
      const n = B(e);
      if (!n) return;
      S.setFromCamera(E, n);
      const s = !!(Dt && Math.abs(e.clientX - Dt.x) <= 3 && Math.abs(e.clientY - Dt.y) <= 3), o = s ? [
        {
          point: Dt.p.clone(),
          distance: n.position.distanceTo(Dt.p)
        }
      ] : Ae();
      if (!o.length) return;
      if (!s) {
        const r = n.position.distanceTo(b.target) || 1, h = o[0].distance ?? n.position.distanceTo(o[0].point), i = o[0].point;
        if (!isFinite(i.x) || !isFinite(i.y) || !isFinite(i.z) || h > Math.max(r * 12, 300)) {
          Me("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
          return;
        }
      }
      let a = o[0].point;
      (e.ctrlKey || e.metaKey) && (a = new T(Math.round(o[0].point.x), Math.round(o[0].point.y), Math.round(o[0].point.z)));
      {
        const r = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], h = r[r.length - 1] ?? [], i = t.points.rawVal ?? [];
        if (h.length > 0) {
          const l = i[h[h.length - 1]];
          if (l) {
            const u = !!window.__hekatanOrthoMode;
            let d = zt;
            if (!d && u) {
              const M = Math.abs(a.x - l[0]), y = Math.abs(a.y - l[1]), w = Math.abs(a.z - l[2]);
              d = M >= y && M >= w ? "x" : y >= w ? "y" : "z";
            }
            d === "x" ? a = new T(a.x, l[1], l[2]) : d === "y" ? a = new T(l[0], a.y, l[2]) : d === "z" && (a = new T(l[0], l[1], a.z));
          }
        }
      }
      if (Dt && Math.abs(e.clientX - Dt.x) <= 3 && Math.abs(e.clientY - Dt.y) <= 3) a = Dt.p.clone();
      else if (jn) a = jn.clone(), Me(`\u{1F4D0} Eje \u2192 (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`);
      else {
        const r = ds(a), h = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, a.x, a.y, a.z, r, {
          x: e.clientX,
          y: e.clientY
        });
        if (h) a = new T(h.x, h.y, h.z), Me(`\u{1F3AF} Snap [${h.type.toUpperCase()}] \u2192 (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`);
        else {
          const i = window.__hekatanSnapEnabled !== false, l = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
          i && l > 0 && (a = new T(Math.round(a.x / l) * l, Math.round(a.y / l) * l, Math.round(a.z / l) * l));
        }
      }
      _s(a, e);
    });
    const Mi = (e) => {
      var _a3;
      const n = (_a3 = t.gridTarget) == null ? void 0 : _a3.rawVal;
      if (!n) return true;
      const s = new T(0, 0, 1).applyEuler(new Ln(...n.rotation)).normalize(), o = S.ray.direction;
      return o.lengthSq() < 1e-12 ? true : Math.abs(o.clone().normalize().dot(s)) >= 0.026;
    }, _s = (e, n) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
      const s = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
      if (n && !(s === "select" || s === "none" || !s || s === "medir" || s === "move" || s === "copy" || s === "delete" || s === "trim" || s === "extend") && !jn && !Mi() && Me(`\u26A0 Est\xE1s mirando el plano de trabajo casi de canto, y ah\xED un p\xEDxel vale decenas de metros: el punto ha ca\xEDdo en (${e.x.toFixed(1)}, ${e.y.toFixed(1)}, ${e.z.toFixed(1)}) m. Si no era eso, deshaz (Ctrl+Z) y ponte en una vista ortogonal (Planta / Frente XZ / Lado YZ), engancha a un nudo con OSNAP, o teclea la coordenada.`), s === "select" || s === "none" || !s) {
        if (_n) {
          Qt && No();
          const { kind: i, a: l, b: u } = _n, d = u !== void 0 ? `${i}:${l}:${u}` : `${i}:${l}`;
          !!n && (n.ctrlKey || n.metaKey || n.shiftKey) || Je.clear(), Je.has(d) ? Je.delete(d) : Je.add(d), cn(), Me(`\u2713 Seleccionados ${Je.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
        } else {
          const i = !!n && (n.ctrlKey || n.metaKey || n.shiftKey), l = (n == null ? void 0 : n.clientX) ?? 0, u = (n == null ? void 0 : n.clientY) ?? 0;
          Qt ? (oa(Qt.x, Qt.y, l, u, i), Qt = null) : i || (Qt = {
            x: l,
            y: u
          }, Me("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), hs(l, u, l + 1, u + 1, false));
        }
        return;
      }
      if (s === "axis") {
        const i = window.__hekatanAxisDraw;
        if (!i) return;
        if (!i.pendingStart) {
          i.pendingStart = [
            e.x,
            e.y,
            e.z
          ], Me(`\u{1F4CD} Eje \u2014 click 1 OK en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)}). Click 2=fin.`);
          return;
        }
        const l = i.mode === "number", u = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, i.pendingStart, [
          e.x,
          e.y,
          e.z
        ], l);
        Me(`\u2713 Eje "${u}" creado. Click 1=nuevo eje, o cambia tool.`);
        return;
      }
      if (s === "move" || s === "copy") {
        pa(s, [
          e.x,
          e.y,
          e.z
        ]);
        return;
      }
      if (s === "delete") {
        if (Tn >= 0) {
          const i = window.__hekatanDrawingAuxLines, l = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], u = Tn;
          if (u >= 0 && u < l.length) {
            Pt();
            const d = l.slice(0, u).concat(l.slice(u + 1));
            i && typeof i == "object" && "val" in i ? i.val = d : window.__hekatanDrawingAuxLines = d, Me(`\u{1F5D1} L\xEDnea auxiliar #${u + 1} borrada`), Tn = -1, Gt.visible = false;
            try {
              (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
            } catch {
            }
          }
        } else if (hn >= 0) {
          const i = hn, l = In;
          ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? ($o(i), Me(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : l >= 0 ? (qs(i, l), Me(`\u{1F5D1} Segmento ${l + 1} de polil\xEDnea #${i + 1} borrado`)) : ($o(i), Me(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
        } else Me("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
        return;
      }
      if (s === "circle") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          Me("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
          return;
        }
        const [i, l] = Qe, u = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), d = Math.abs(l[0] - i[0]), M = Math.abs(l[1] - i[1]), y = Math.abs(l[2] - i[2]), w = String(((_j = (_i = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), F = (w === "xy" ? y < 1e-3 : w === "xz" ? M < 1e-3 : w === "yz" ? d < 1e-3 : false) ? w : y < 1e-3 ? "xy" : M < 1e-3 ? "xz" : "yz", f = window.__hekatanArcSegs ?? 12;
        (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], u, f, F), Me(`\u2713 C\xEDrculo dibujado en ${F.toUpperCase()} \u2014 r=${u.toFixed(2)}m, ${f} segmentos`), Qe = [];
        try {
          (_l2 = window.__hekatanRebuild) == null ? void 0 : _l2.call(window);
        } catch {
        }
        return;
      }
      if (s === "ifcface") {
        if (!N) {
          Me("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
          return;
        }
        if (!N.plana) {
          Me("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
          return;
        }
        const i = G(N.m), l = oe(i, N.tris);
        if (l.length < 3) {
          Me("\u25A6 No se pudo cerrar el contorno de la cara.");
          return;
        }
        const u = N.normal.clone(), d = D(N.m, N.punto, u);
        let M = String(window.__hekatanIfcCaraPos ?? "auto"), y = false;
        try {
          const $ = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
          y = Math.round(($ == null ? void 0 : $.matShell) ?? 0) === 1;
        } catch {
        }
        M === "auto" && (M = Math.abs(u.z) > 0.5 ? y ? "interior" : "exterior" : "media");
        const w = d ?? 0.2, z = M === "exterior" ? 0 : M === "interior" ? w : w / 2, F = l.map(($) => $.clone().addScaledVector(u, -z));
        Pt(), Ge = F.map(($) => [
          $.x,
          $.y,
          $.z
        ]);
        const f = To();
        try {
          const $ = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
          $ && d && ($.tShell = Math.round(d * 100) / 100);
        } catch {
        }
        const p = [
          "Shell-Thick (Mindlin)",
          "Shell-Thin (Kirchhoff)",
          "Membrana"
        ];
        let x = "la de \xABSecci\xF3n shells\xBB";
        try {
          const $ = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
          $ && $.formaPlaca != null && (x = p[Math.round($.formaPlaca)] ?? x);
        } catch {
        }
        const _ = M === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : M === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + w.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (w / 2).toFixed(2) + " m hacia dentro)";
        Me(`\u25A6 \xC1rea desde la cara del IFC: ${l.length} v\xE9rtices, ${f} shell(s). Espesor medido ${d ? d.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${_}; formulaci\xF3n ${x}, t = ${w.toFixed(2)} m.`), q(null, -1, null);
        try {
          (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
        } catch {
        }
        v();
        return;
      }
      if (s === "ifcline") {
        if (!xe || xe.length < 2) {
          Me("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
          return;
        }
        const i = Y(xe);
        Pt();
        const l = t.points.rawVal, u = [], d = [];
        for (const y of i) {
          let w = l.findIndex((z) => Math.abs(z[0] - y[0]) < 1e-3 && Math.abs(z[1] - y[1]) < 1e-3 && Math.abs(z[2] - y[2]) < 1e-3);
          w < 0 && (w = l.length + d.length, d.push(y)), u.push(w);
        }
        if (t.points.val = [
          ...l,
          ...d
        ], t.polylines) {
          const y = t.polylines.rawVal, w = y.length && y[y.length - 1].length === 0 ? y.slice(0, -1) : y;
          t.polylines.val = [
            ...w,
            u,
            []
          ];
        }
        const M = xe.reduce((y, w, z) => z ? y + w.distanceTo(xe[z - 1]) : 0, 0);
        Me(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${M.toFixed(2)} m de desarrollo.`), ne(null);
        try {
          (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
        } catch {
        }
        v();
        return;
      }
      if (s === "arc") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          Me("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
          return;
        }
        if (Qe.length === 2) {
          Me("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
          return;
        }
        const [i, l, u] = Qe, d = window.__hekatanArcSegs ?? 12;
        (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, l, u, d), Me(`\u2713 Arco dibujado \u2014 ${d} segmentos`), Qe = [];
        try {
          (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
        } catch {
        }
        return;
      }
      if (s === "parabola" || s === "cubica") {
        const i = s === "parabola" ? 3 : 4, l = s === "parabola" ? "Par\xE1bola" : "C\xFAbica";
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length < i) {
          Me(`\u223F ${l} \u2014 punto ${Qe.length}/${i} OK. Marc\xE1 el ${Qe.length + 1}\xBA.`);
          return;
        }
        const u = window.__hekatanArcSegs ?? 12, d = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Qe.slice(), u);
        if (!(d == null ? void 0 : d.ok)) {
          Me(`\u26A0 ${l}: ${(d == null ? void 0 : d.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Qe = [];
          return;
        }
        const M = "xyz"[d.ia ?? 0], y = "xyz"[d.io ?? 2], w = (d.coef ?? []).map((z, F) => `${z >= 0 && F ? "+" : ""}${z.toFixed(3)}${F ? "\xB7" + M + (F > 1 ? "^" + F : "") : ""}`).join(" ");
        Me(`\u2713 ${l} dibujada en ${String(d.plano ?? "").toUpperCase()} \u2014 ${u} tramos a \u0394 igual de ${M} \xB7 ${y} = ${w}`), Qe = [];
        try {
          (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
        } catch {
        }
        return;
      }
      if (s === "revolve") {
        const i = Math.round(window.__hekatanRevSectores ?? 16), l = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, e.x, e.y, i, 360);
        if (l == null ? void 0 : l.msg) {
          Me(`\u26A0 Revoluci\xF3n: ${l.msg}.`);
          return;
        }
        Me(`\u2713 Revoluci\xF3n: ${l.anillos} anillo(s) \xD7 ${i} sectores \u2192 ${l.areas} pa\xF1o(s) Q4${l.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${l.guias ? ` ${l.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
        try {
          (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
      if (s === "loft") {
        const i = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, e.x, e.y);
        if (i == null ? void 0 : i.msg) {
          Me(`\u26A0 Barrido: ${i.msg}.`);
          return;
        }
        Me(`\u2713 Barrido: contorno de ${i.contorno} lados \xD7 perfil de ${i.perfil} puntos \u2192 ${i.areas} pa\xF1o(s) Q4. Eje por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${i.guias ? ` ${i.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
        try {
          (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
        } catch {
        }
        return;
      }
      if (s === "rect") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          Me("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [i, l] = Qe;
        (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, l), Me(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Qe = [];
        try {
          (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
        } catch {
        }
        return;
      }
      if (s === "medir") {
        const l = (Dt && Math.abs(Dt.x - n.clientX) < 3 && Math.abs(Dt.y - n.clientY) < 3 ? [
          Dt.p.x,
          Dt.p.y,
          Dt.p.z
        ] : null) ?? rt(n);
        if (!l) return;
        if (lt.length >= 2 && (lt = []), lt.push(l), lt.length === 1) nt.visible = false, St(), Me("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
        else {
          const [u, d] = lt;
          nt.geometry.setFromPoints([
            new T(u[0], u[1], u[2]),
            new T(d[0], d[1], d[2])
          ]), nt.visible = true;
          const M = Math.hypot(d[0] - u[0], d[1] - u[1], d[2] - u[2]), y = Math.hypot(d[0] - u[0], d[1] - u[1]);
          st.textContent = `${M.toFixed(3)} m`, St(), Me(`\u{1F4CF} Distancia ${M.toFixed(3)} m  \xB7  \u0394x ${(d[0] - u[0]).toFixed(3)}  \u0394y ${(d[1] - u[1]).toFixed(3)}  \u0394z ${(d[2] - u[2]).toFixed(3)}  \xB7  en planta ${y.toFixed(3)} m`);
        }
        v();
        return;
      }
      if (s === "fillarea") {
        const i = t.points.rawVal, l = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], u = /* @__PURE__ */ new Map(), d = (X, K) => {
          X !== K && ((u.get(X) ?? u.set(X, /* @__PURE__ */ new Set()).get(X)).add(K), (u.get(K) ?? u.set(K, /* @__PURE__ */ new Set()).get(K)).add(X));
        };
        for (const X of l) for (let K = 0; K + 1 < X.length; K++) d(X[K], X[K + 1]);
        const M = (X, K) => {
          var _a4;
          return !!((_a4 = u.get(X)) == null ? void 0 : _a4.has(K));
        }, y = /* @__PURE__ */ new Set(), w = [], z = [
          ...u.keys()
        ];
        for (const X of z) for (const K of u.get(X)) if (!(K < X)) {
          for (const fe of u.get(K)) if (fe !== X) for (const ge of u.get(fe)) {
            if (ge === X || ge === K || !M(ge, X) || M(X, fe) || M(K, ge)) continue;
            const Ce = [
              X,
              K,
              fe,
              ge
            ].slice().sort((Re, _e2) => Re - _e2).join("-");
            y.has(Ce) || (y.add(Ce), w.push([
              X,
              K,
              fe,
              ge
            ]));
          }
        }
        for (const X of z) for (const K of u.get(X)) if (!(K < X)) for (const fe of u.get(K)) {
          if (fe === X || !M(fe, X)) continue;
          const ge = [
            X,
            K,
            fe
          ].slice().sort((Ce, Re) => Ce - Re).join("-");
          y.has(ge) || (y.add(ge), w.push([
            X,
            K,
            fe
          ]));
        }
        const F = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", f = (X) => F === "xy" ? [
          X[0],
          X[1]
        ] : F === "xz" ? [
          X[0],
          X[2]
        ] : [
          X[1],
          X[2]
        ], p = f([
          e.x,
          e.y,
          e.z
        ]), x = (X, K) => {
          let fe = false;
          for (let ge = 0, Ce = K.length - 1; ge < K.length; Ce = ge++) {
            const Re = K[ge][0], _e2 = K[ge][1], Be = K[Ce][0], Ie = K[Ce][1];
            _e2 > X[1] != Ie > X[1] && X[0] < (Be - Re) * (X[1] - _e2) / (Ie - _e2) + Re && (fe = !fe);
          }
          return fe;
        }, _ = (X) => {
          let K = 0;
          for (let fe = 0, ge = X.length - 1; fe < X.length; ge = fe++) K += (X[ge][0] + X[fe][0]) * (X[ge][1] - X[fe][1]);
          return Math.abs(K) / 2;
        };
        let $ = null, I = 1 / 0;
        for (const X of w) {
          const K = X.map((ge) => f(i[ge]));
          if (!x(p, K)) continue;
          const fe = _(K);
          fe < I && (I = fe, $ = X);
        }
        if (!$) {
          Me("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
          return;
        }
        const L = $.slice().sort((X, K) => X - K).join("-"), U = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
        if (U.some((X) => {
          const K = l[X] ?? [];
          return [
            ...new Set(K)
          ].sort((fe, ge) => fe - ge).join("-") === L;
        })) {
          Me("\u25A6 Esa celda ya tiene \xE1rea.");
          return;
        }
        t.polylines.val = [
          ...l,
          [
            ...$,
            $[0]
          ]
        ], t.areas.val = [
          ...U,
          l.length
        ], Me(`\u2713 \xC1rea creada por relleno (${$.length} lados).`);
        try {
          (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
        } catch {
        }
        return;
      }
      if (s === "rectarea") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          Me("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [i, l] = Qe;
        (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, l), Me(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Qe = [];
        return;
      }
      if (s === "polyarea") {
        Ge.push([
          e.x,
          e.y,
          e.z
        ]), Fe.geometry.setFromPoints(Ge.map((i) => new T(i[0], i[1], i[2]))), Fe.visible = Ge.length >= 1, Me(`\u25B0 \xC1rea libre \u2014 ${Ge.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), v();
        return;
      }
      if (s === "plane3") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length < 3) {
          Me(`\u25E3 Plano inclinado \u2014 punto ${Qe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
          return;
        }
        const [i, l, u] = Qe, d = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, l, u);
        Me(d ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Qe = [];
        return;
      }
      if (s === "col") {
        Pt();
        const i = e.z, l = At && At > 0 ? At : 3;
        t.points.val = [
          ...t.points.rawVal,
          [
            e.x,
            e.y,
            i
          ],
          [
            e.x,
            e.y,
            i + l
          ]
        ];
        const u = t.polylines.rawVal, d = t.points.rawVal.length;
        t.polylines.val = [
          ...u.slice(0, -1),
          ...u[u.length - 1].length > 0 ? [
            u[u.length - 1]
          ] : [],
          [
            d - 2,
            d - 1
          ],
          []
        ], At = 0, Me(`\u258C Columna creada \u2014 h=${l.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
        try {
          (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
        } catch {
        }
        return;
      }
      if (s === "wall") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          Me("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
          return;
        }
        const [i, l] = Qe, u = At && At > 0 ? At : 3;
        Pt();
        const d = t.points.rawVal.length;
        t.points.val = [
          ...t.points.rawVal,
          [
            i[0],
            i[1],
            i[2]
          ],
          [
            l[0],
            l[1],
            l[2]
          ],
          [
            l[0],
            l[1],
            l[2] + u
          ],
          [
            i[0],
            i[1],
            i[2] + u
          ]
        ];
        const M = t.polylines.rawVal;
        if (M.length - 1, t.polylines.val = [
          ...M.slice(0, -1),
          ...M[M.length - 1].length > 0 ? [
            M[M.length - 1]
          ] : [],
          [
            d,
            d + 1,
            d + 2,
            d + 3,
            d
          ],
          []
        ], t.areas) {
          const y = t.polylines.rawVal.length - 2;
          t.areas.val = [
            ...t.areas.rawVal,
            y
          ];
        }
        Me(`\u25A5 Pared Q4 creada \u2014 h=${u.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Qe = [], At = 0;
        try {
          (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
        } catch {
        }
        return;
      }
      if (s === "extp") {
        Pt();
        const i = At && At > 0 ? At : 3, l = e.z;
        t.points.val = [
          ...t.points.rawVal,
          [
            e.x,
            e.y,
            l
          ],
          [
            e.x,
            e.y,
            l + i
          ]
        ];
        const u = t.polylines.rawVal, d = t.points.rawVal.length;
        t.polylines.val = [
          ...u.slice(0, -1),
          ...u[u.length - 1].length > 0 ? [
            u[u.length - 1]
          ] : [],
          [
            d - 2,
            d - 1
          ],
          []
        ], At = 0, Me(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
        try {
          (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
        } catch {
        }
        return;
      }
      if (s === "extl") {
        const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, l = is(e.x, e.y, e.z, i);
        if (!l) {
          Me("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
          return;
        }
        const u = t.polylines.rawVal, d = t.points.rawVal, M = u[l.polyIdx], y = d[M[l.segIdx]], w = d[M[l.segIdx + 1]];
        if (!y || !w) {
          Me("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
          return;
        }
        const z = At && At > 0 ? At : 3;
        Pt();
        const F = t.points.rawVal.length;
        t.points.val = [
          ...t.points.rawVal,
          [
            y[0],
            y[1],
            y[2]
          ],
          [
            w[0],
            w[1],
            w[2]
          ],
          [
            w[0],
            w[1],
            w[2] + z
          ],
          [
            y[0],
            y[1],
            y[2] + z
          ]
        ];
        const f = t.polylines.rawVal;
        if (t.polylines.val = [
          ...f.slice(0, -1),
          ...f[f.length - 1].length > 0 ? [
            f[f.length - 1]
          ] : [],
          [
            F,
            F + 1,
            F + 2,
            F + 3,
            F
          ],
          []
        ], t.areas) {
          const p = t.polylines.rawVal.length - 2;
          t.areas.val = [
            ...t.areas.rawVal,
            p
          ];
        }
        At = 0, Me(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${z.toFixed(2)}m`);
        try {
          (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
        } catch {
        }
        return;
      }
      if (s === "auxp") {
        const i = window.__hekatanDrawingAuxPoints;
        if (i) {
          const l = i.rawVal ?? i.val ?? [];
          i.val = [
            ...l,
            [
              e.x,
              e.y,
              e.z
            ]
          ];
        }
        Me(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
        return;
      }
      if (s === "aux") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          Me("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
          return;
        }
        const [i, l] = Qe, u = window.__hekatanDrawingAuxLines;
        if (u) {
          Pt();
          const z = u.rawVal ?? u.val ?? [];
          u.val = [
            ...z,
            [
              i[0],
              i[1],
              i[2],
              l[0],
              l[1],
              l[2]
            ]
          ];
        }
        const d = l[0] - i[0], M = l[1] - i[1], y = l[2] - i[2], w = Math.sqrt(d * d + M * M + y * y);
        Me(`\u2713 L\xEDnea auxiliar creada \u2014 L=${w.toFixed(2)}m (cyan, no FEM)`), Qe = [];
        return;
      }
      if (s === "extend" || s === "trim" || s === "offset") {
        bi(s, [
          e.x,
          e.y,
          e.z
        ]);
        return;
      }
      if (s === "chaflan") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          Me("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [i, l] = Qe, u = window.__hekatanChaflanR ?? 1, d = Math.max(3, window.__hekatanArcSegs ?? 6);
        (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, l, u, d, 6);
        const M = Math.abs(l[0] - i[0]).toFixed(1), y = Math.abs(l[1] - i[1]).toFixed(1);
        Me(`\u2713 Losa con chaflanes dibujada \u2014 ${M}\xD7${y}m, r=${u}m, ${d} seg/chafl\xE1n`), Qe = [];
        try {
          (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
        } catch {
        }
        return;
      }
      Ye = false, Pt();
      const a = e.toArray(), r = t.points.rawVal;
      let h = r.findIndex((i) => Math.abs(i[0] - a[0]) < 1e-3 && Math.abs(i[1] - a[1]) < 1e-3 && Math.abs(i[2] - a[2]) < 1e-3);
      if (h < 0 && (t.points.val = [
        ...r,
        a
      ], h = t.points.rawVal.length - 1), t.polylines && s !== "node") {
        const i = t.polylines.rawVal, l = i.length ? i[i.length - 1] : [];
        l.length && l[l.length - 1] === h ? t.polylines.val = [
          ...i,
          [
            h
          ]
        ] : t.polylines.val = [
          ...i.slice(0, -1),
          [
            ...l,
            h
          ]
        ];
      }
      if (t.polylines) {
        const i = t.polylines.rawVal, l = i.length - 1, u = i[l] ?? [];
        if (s === "line" && u.length >= 2) {
          Me(`\uFF0F L\xEDnea \u2014 ${u.length - 1} tramo${u.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
          try {
            (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
          } catch {
          }
          return;
        }
        if (s === "area" && u.length === 4) {
          t.polylines.val = [
            ...i.slice(0, -1),
            [
              ...u,
              u[0]
            ],
            []
          ], t.areas && (t.areas.val = [
            ...t.areas.rawVal,
            l
          ]), Me("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
          try {
            (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
          } catch {
          }
          return;
        }
      }
      if (s === "node") Me(`\u25CF Nodo creado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      else if (s === "line") Me("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
      else if (s === "polyline") Me("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
      else if (s === "area") {
        const i = ((_R = t.polylines) == null ? void 0 : _R.rawVal[t.polylines.rawVal.length - 1]) ?? [];
        Me(`\u25A6 \xC1rea \u2014 click ${i.length}/4. Marc\xE1 ${4 - i.length} v\xE9rtice${4 - i.length === 1 ? "" : "s"} m\xE1s.`);
      }
    };
    k.addEventListener("click", () => Ot()), k.addEventListener("contextmenu", (e) => {
      var _a3, _b, _c;
      if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && Ge.length >= 3) {
        e.preventDefault();
        const s = To();
        Me(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
        return;
      }
      !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [
        ...t.polylines.rawVal,
        []
      ]);
    }), k.addEventListener("pointermove", (e) => {
      var _a3, _b, _c;
      const n = B(e);
      if (!n) return;
      S.setFromCamera(E, n);
      const s = Ae();
      if (je.geometry.deleteAttribute("position"), s.length) {
        let o = s[0].point.clone();
        (e.ctrlKey || e.metaKey) && o.set(Math.round(o.x), Math.round(o.y), Math.round(o.z));
        {
          const h = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = h[h.length - 1] ?? [], l = t.points.rawVal ?? [];
          if (i.length > 0) {
            const u = l[i[i.length - 1]];
            if (u) {
              const d = !!window.__hekatanOrthoMode;
              let M = zt;
              if (!M && d) {
                const y = Math.abs(o.x - u[0]), w = Math.abs(o.y - u[1]), z = Math.abs(o.z - u[2]);
                M = y >= w && y >= z ? "x" : w >= z ? "y" : "z";
              }
              M === "x" ? o.set(o.x, u[1], u[2]) : M === "y" ? o.set(u[0], o.y, u[2]) : M === "z" && o.set(u[0], u[1], o.z);
            }
          }
        }
        const a = ds(o), r = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, o.x, o.y, o.z, a, {
          x: e.clientX,
          y: e.clientY
        });
        if (r) o.set(r.x, r.y, r.z);
        else {
          const h = window.__hekatanSnapEnabled !== false, i = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
          h && i > 0 && (o.x = Math.round(o.x / i) * i, o.y = Math.round(o.y / i) * i, o.z = Math.round(o.z / i) * i);
        }
        je.geometry.setAttribute("position", new Tt(o.toArray(), 3));
      }
      v();
    }), k.addEventListener("pointermove", (e) => {
      var _a3;
      const n = B(e);
      if (!n) return;
      S.setFromCamera(E, n);
      let s = false;
      const o = S.intersectObject(Le), a = Ae();
      if (o.length && a.length) {
        const r = new T(...t.points.rawVal[o[0].index]), h = new T(...a[0].point), i = r.sub(h), l = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
        l.transformDirection(se.matrixWorld), Math.abs(i.dot(l)) < 1e-4 && (s = true);
      }
      je.visible = !s;
    });
    let ks = false, Ss;
    k.addEventListener("pointermove", (e) => {
      var _a3;
      if (!qn) return;
      const n = B(e);
      if (!n) return;
      S.setFromCamera(E, n);
      let s = false;
      const o = S.intersectObject(Le), a = Ae();
      if (o.length && a.length) {
        const h = new T(...t.points.rawVal[o[0].index]), i = new T(...a[0].point), l = h.sub(i), u = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
        u.transformDirection(se.matrixWorld), Math.abs(l.dot(u)) < 1e-4 && (s = true);
      }
      if (s && qn < 5 && (ks = true, b.enabled = false, Ss = o[0].index), !ks || qn % 2 !== 0) return;
      const r = [
        ...t.points.rawVal
      ];
      if (Ss !== void 0) {
        let h = a[0].point;
        (e.ctrlKey || e.metaKey) && (h = new T(Math.round(h.x), Math.round(h.y), Math.round(h.z))), r[Ss] = h.toArray();
      }
      t.points.val = r;
    }), k.addEventListener("pointerup", () => {
      b.enabled = true, ks = false;
    }), k.addEventListener("contextmenu", (e) => {
      var _a3;
      const n = B(e);
      if (!n) return;
      S.setFromCamera(E, n);
      let s = false;
      const o = S.intersectObject(Le), a = Ae();
      if (o.length && a.length) {
        const i = new T(...t.points.rawVal[o[0].index]), l = new T(...a[0].point), u = i.sub(l), d = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
        d.transformDirection(se.matrixWorld), Math.abs(u.dot(d)) < 1e-4 && (s = true);
      }
      if (!s) return;
      const r = [
        ...t.points.rawVal
      ];
      if (r.splice(o[0].index, 1), t.points.val = r, !t.polylines) return;
      const h = t.polylines.rawVal.map((i) => i.filter((l) => l !== o[0].index)).map((i) => i.map((l) => l > o[0].index ? l - 1 : l)).filter((i) => i.length);
      h.push([]), t.polylines.val = h;
    });
  }
  function yl(t, c, m) {
    const A = Math.round(14.999999999999998), P = {
      position: t.position.clone(),
      quaternion: t.quaternion.clone()
    }, k = setInterval(S, 1e3 / 30);
    let v = 0;
    function S() {
      v++;
      const E = v / A;
      t.position.lerpVectors(P.position, c.position, E), t.quaternion.slerpQuaternions(P.quaternion, c.quaternion, E), m && m(), v == A && clearInterval(k);
    }
  }
  function xl(t, c, m, g) {
    const b = Wi(m, t.elements, g);
    return ve.derive(() => {
      b.visible = c.shellResults.val != "none";
    }), b;
  }
  const gl = 6, Vs = 10, bl = 0.012;
  function Ml(t) {
    return t.startsWith("contour:") ? t.slice(8) : null;
  }
  function vl(t, c, m, g) {
    if (!m && !g) return null;
    if ([
      "normals",
      "shearsY",
      "shearsZ",
      "torsions",
      "bendingsY",
      "bendingsZ"
    ].includes(t) && m) {
      const A = m[t];
      if (A && A.has(c)) return A.get(c);
    }
    return null;
  }
  function _l(t, c, m, g) {
    const b = new ft(), A = new Xa();
    A.setColorMap("rainbow");
    const P = new pn(), k = ve.state([]);
    return ve.derive(() => {
      var _a2, _b, _c;
      c.deformedShape.val;
      const v = m.val, S = ((_a2 = t.elements) == null ? void 0 : _a2.val) ?? [], E = Ml(c.frameResults.val);
      if (b.children.forEach((C) => {
        C.geometry && C.geometry.dispose(), C.material && C.material.dispose();
      }), b.clear(), !E || S.length === 0 || v.length === 0) {
        k.val = [];
        return;
      }
      const B = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, se = (_c = t.deformOutputs) == null ? void 0 : _c.val, V = [], ie = [];
      for (let C = 0; C < S.length; C++) {
        if (S[C].length !== 2) continue;
        const H = vl(E, C, B, se);
        H && (V.push(H[0], H[1]), ie.push({
          idx: C,
          vals: H
        }));
      }
      if (V.length === 0) {
        k.val = [];
        return;
      }
      const J = Math.min(...V), R = Math.max(...V);
      A.setMin(J), A.setMax(R), k.val = V;
      const le = [
        1 / 0,
        1 / 0,
        1 / 0
      ], ue = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const C of v) for (let N = 0; N < 3; N++) le[N] = Math.min(le[N], C[N]), ue[N] = Math.max(ue[N], C[N]);
      const be = Math.max(ue[0] - le[0], ue[1] - le[1], ue[2] - le[2], 1) * bl, Q = [], ae = [], te = [];
      let ne = 0;
      for (const { idx: C, vals: N } of ie) {
        const H = S[C], q = v[H[0]], oe = v[H[1]];
        if (!q || !oe) continue;
        const D = new T(oe[0] - q[0], oe[1] - q[1], oe[2] - q[2]), de = D.length();
        if (de < 1e-10) continue;
        D.normalize();
        const j = Math.abs(D.y) < 0.99 ? new T(0, 1, 0) : new T(1, 0, 0), O = new T().crossVectors(D, j).normalize(), W = new T().crossVectors(D, O).normalize(), re = Vs + 1, we = gl;
        for (let ze = 0; ze < re; ze++) {
          const Ee = ze / Vs, tt = q[0] + D.x * de * Ee, at = q[1] + D.y * de * Ee, Ue = q[2] + D.z * de * Ee, Z = N[0] + (N[1] - N[0]) * Ee, ce = A.getColor(Z) ?? new pn(0, 0, 0);
          P.copy(ce).convertSRGBToLinear();
          for (let pe = 0; pe < we; pe++) {
            const me = pe / we * Math.PI * 2, ke = Math.cos(me), $e = Math.sin(me);
            Q.push(tt + (O.x * ke + W.x * $e) * be, at + (O.y * ke + W.y * $e) * be, Ue + (O.z * ke + W.z * $e) * be), ae.push(P.r, P.g, P.b);
          }
        }
        for (let ze = 0; ze < Vs; ze++) for (let Ee = 0; Ee < we; Ee++) {
          const tt = (Ee + 1) % we, at = ne + ze * we + Ee, Ue = ne + ze * we + tt, Z = ne + (ze + 1) * we + Ee, ce = ne + (ze + 1) * we + tt;
          te.push(at, Ue, ce), te.push(at, ce, Z);
        }
        ne += re * we;
      }
      if (Q.length === 0) return;
      const Y = new De();
      Y.setAttribute("position", new Tt(Q, 3)), Y.setAttribute("color", new Tt(ae, 3)), Y.setIndex(te), Y.computeVertexNormals();
      const ee = new gt({
        vertexColors: true,
        side: It
      }), G = new ut(Y, ee);
      G.frustumCulled = false, b.add(G);
    }), b.__colorMapValues = k, b;
  }
  function kl() {
    const t = window;
    return {
      forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf",
      dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm",
      stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2"
    };
  }
  const Sl = {
    kN: 1,
    tonf: 1 / 9.80665,
    kip: 1 / 4.4482216
  }, Pl = {
    mm: 1e3,
    cm: 100,
    m: 1,
    in: 39.3700787402
  }, zl = {
    "kN/m\xB2": 1,
    kPa: 1,
    MPa: 1 / 1e3,
    GPa: 1 / 1e6,
    "kgf/cm\xB2": 1 / 98.0665,
    "tonf/m\xB2": 1 / 9.80665,
    psi: 1 / 6.89476,
    ksi: 1 / 6894.76,
    "kip/ft\xB2": 1 / 47.88026
  };
  function Ft(t, c = 4) {
    return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(c) : t.toFixed(c);
  }
  const Al = 16755200, Ca = 56831, Cl = 56831, Fl = 56831, Qo = 65382;
  function El(t) {
    const c = new ft();
    c.name = "__hekatan_hover", c.renderOrder = 99;
    const m = new co(1, 16, 16), g = new gt({
      color: Al,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    }), b = new ut(m, g);
    b.visible = false, b.renderOrder = 100, c.add(b);
    const A = new De(), P = new mt({
      color: Ca,
      linewidth: 4,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    }), k = new an(A, P);
    k.visible = false, k.renderOrder = 100, c.add(k);
    const v = new gt({
      color: Ca,
      transparent: true,
      opacity: 0.7,
      depthTest: false
    }), S = new ut(new _a(1, 1, 1, 12), v);
    S.visible = false, S.renderOrder = 100, c.add(S);
    const E = new De(), B = new gt({
      color: Cl,
      transparent: true,
      opacity: 0.45,
      side: It,
      depthTest: false
    }), se = new ut(E, B);
    se.visible = false, se.renderOrder = 100, c.add(se);
    const V = new De(), ie = new mt({
      color: Fl,
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }), J = new an(V, ie);
    J.visible = false, J.renderOrder = 100, c.add(J);
    const R = new gt({
      color: Qo,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }), le = new gt({
      color: Qo,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    }), ue = new _a(1, 1, 1, 12), xe = new gt({
      color: Qo,
      transparent: true,
      opacity: 0.55,
      side: It,
      depthTest: false
    }), be = new mt({
      color: Qo,
      linewidth: 4,
      transparent: true,
      opacity: 1,
      depthTest: false
    }), Q = [];
    window.__hekatanModelSelection = Q;
    const ae = new ft();
    ae.renderOrder = 101, c.add(ae);
    let te = null;
    const ne = document.createElement("div");
    Object.assign(ne.style, {
      position: "absolute",
      pointerEvents: "none",
      padding: "5px 9px",
      fontSize: "11px",
      fontFamily: "Consolas, 'Courier New', monospace",
      background: "rgba(0, 0, 0, 0.88)",
      color: "#ffd166",
      border: "1px solid rgba(255, 200, 80, 0.5)",
      borderRadius: "4px",
      whiteSpace: "pre-line",
      zIndex: "9999",
      display: "none",
      transform: "translate(12px, 12px)",
      lineHeight: "1.35",
      maxWidth: "260px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
    }), ne.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
      t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(ne);
    }, 0);
    function Y(Z) {
      const ce = t.derivedNodes.rawVal;
      return !ce || Z < 0 || Z >= ce.length ? null : new T(ce[Z][0], ce[Z][1], ce[Z][2]);
    }
    function ee(Z, ce) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l2, _m, _n, _o2, _p, _q, _r, _s, _t;
      const pe = t.getActiveCamera();
      if (!pe || !t.mesh) return null;
      const me = t.rendererElm.getBoundingClientRect(), ke = Z - me.left, $e = ce - me.top, Ae = t.derivedNodes.rawVal, Le = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
      if (!Ae || !Le) return null;
      const je = /* @__PURE__ */ new Map(), We = (it) => {
        if (je.has(it)) return je.get(it);
        const Xe = Y(it);
        if (!Xe) return je.set(it, null), null;
        const Ke = Xe.clone().project(pe), Se = (Ke.x * 0.5 + 0.5) * me.width, Fe = (-Ke.y * 0.5 + 0.5) * me.height, Ge = {
          x: Se,
          y: Fe,
          z: Ke.z
        };
        return je.set(it, Ge), Ge;
      }, Ve = /* @__PURE__ */ new Set();
      for (const it of Le) if (it) for (const Xe of it) Ve.add(Xe);
      const et = 8;
      let Pe = -1, ot = et;
      for (let it = 0; it < Ae.length; it++) {
        if (!Ve.has(it)) continue;
        const Xe = We(it);
        if (!Xe || Xe.z < -1 || Xe.z > 1) continue;
        const Ke = Xe.x - ke, Se = Xe.y - $e, Fe = Math.sqrt(Ke * Ke + Se * Se);
        Fe < ot && (ot = Fe, Pe = it);
      }
      const Ye = kl(), dt = Pl[Ye.dispUnit] ?? 1e3, Oe = Sl[Ye.forceUnit] ?? 1;
      if (Pe >= 0) {
        const it = Ae[Pe];
        let Xe = `Nodo ${Pe}
(${it[0].toFixed(3)}, ${it[1].toFixed(3)}, ${it[2].toFixed(3)})`;
        const Ke = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
        if (Ke == null ? void 0 : Ke.deformations) {
          const Se = Ke.deformations.get(Pe);
          if (Se && (Xe += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Xe += `
Ux = ${Ft(Se[0] * dt, 3)} ${Ye.dispUnit}`, Xe += `
Uy = ${Ft(Se[1] * dt, 3)} ${Ye.dispUnit}`, Xe += `
Uz = ${Ft(Se[2] * dt, 3)} ${Ye.dispUnit}`, (Math.abs(Se[3]) > 1e-9 || Math.abs(Se[4]) > 1e-9 || Math.abs(Se[5]) > 1e-9) && (Xe += `
Rx = ${Ft(Se[3] * 1e3, 3)} mrad`, Xe += `
Ry = ${Ft(Se[4] * 1e3, 3)} mrad`, Xe += `
Rz = ${Ft(Se[5] * 1e3, 3)} mrad`)), Ke.reactions) {
            const Fe = Ke.reactions.get(Pe);
            Fe && (Math.abs(Fe[0]) > 1e-9 || Math.abs(Fe[1]) > 1e-9 || Math.abs(Fe[2]) > 1e-9 || Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Xe += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Xe += `
Fx = ${Ft(Fe[0] * Oe)} ${Ye.forceUnit}`, Xe += `
Fy = ${Ft(Fe[1] * Oe)} ${Ye.forceUnit}`, Xe += `
Fz = ${Ft(Fe[2] * Oe)} ${Ye.forceUnit}`, (Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Xe += `
Mx = ${Ft(Fe[3] * Oe)} ${Ye.forceUnit}\xB7m`, Xe += `
My = ${Ft(Fe[4] * Oe)} ${Ye.forceUnit}\xB7m`, Xe += `
Mz = ${Ft(Fe[5] * Oe)} ${Ye.forceUnit}\xB7m`));
          }
        }
        return {
          type: "node",
          idx: Pe,
          info: Xe
        };
      }
      const jt = 5;
      let wt = -1, ln = jt, Zt = "frame";
      for (let it = 0; it < Le.length; it++) {
        const Xe = Le[it];
        if (!(!Xe || Xe.length < 2)) {
          if (Xe.length === 2) {
            const Ke = We(Xe[0]), Se = We(Xe[1]);
            if (!Ke || !Se || Ke.z < -1 || Ke.z > 1 || Se.z < -1 || Se.z > 1) continue;
            const Fe = $l(ke, $e, Ke.x, Ke.y, Se.x, Se.y);
            Fe < ln && (ln = Fe, wt = it, Zt = "frame");
          } else if (Xe.length === 3 || Xe.length === 4) {
            const Ke = [];
            let Se = true;
            for (const Fe of Xe) {
              const Ge = We(Fe);
              if (!Ge || Ge.z < -1 || Ge.z > 1) {
                Se = false;
                break;
              }
              Ke.push(Ge);
            }
            if (!Se) continue;
            if (Ll(ke, $e, Ke)) {
              const Ge = Ke.reduce((nt, lt) => nt + lt.z, 0) / Ke.length * 1e-3;
              Ge < ln && (ln = Ge, wt = it, Zt = "shell");
            }
          } else if (Xe.length === 8) {
            const Ke = [];
            let Se = true;
            for (const st of Xe) {
              const rt = We(st);
              if (!rt || rt.z < -1 || rt.z > 1) {
                Se = false;
                break;
              }
              Ke.push(rt);
            }
            if (!Se) continue;
            const Fe = Math.min(...Ke.map((st) => st.x)), Ge = Math.max(...Ke.map((st) => st.x)), nt = Math.min(...Ke.map((st) => st.y)), lt = Math.max(...Ke.map((st) => st.y));
            if (ke >= Fe && ke <= Ge && $e >= nt && $e <= lt) {
              const rt = Ke.reduce((St, ct) => St + ct.z, 0) / Ke.length * 1e-3;
              rt < ln && (ln = rt, wt = it, Zt = "solid");
            }
          }
        }
      }
      if (wt >= 0) {
        const it = Le[wt];
        let Ke = `${Zt === "frame" ? "Frame" : Zt === "shell" ? "Shell" : "Solid"} ${wt}`;
        const Se = (_e = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, Fe = (_g = (_f = Se == null ? void 0 : Se.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, wt);
        if (Fe) {
          Fe.name && (Ke += `
  \u{1F4CB} ${Fe.name}`), Fe.shape && (Ke += `
  Shape: ${Fe.shape}`);
          const Ge = /concrete|hormig|rect.*sólida/i.test(Fe.shape || ""), nt = Ge ? 100 : 1e3, lt = Ge ? "cm" : "mm", st = (St) => {
            const ct = St * nt;
            return Math.abs(ct - Math.round(ct)) < 0.05 ? `${Math.round(ct)}` : `${ct.toFixed(1)}`;
          }, rt = [];
          if (Fe.D != null && rt.push(`D=${st(Fe.D)}`), Fe.B != null && rt.push(`B=${st(Fe.B)}`), Fe.TF != null && rt.push(`TF=${st(Fe.TF)}`), Fe.TW != null && rt.push(`TW=${st(Fe.TW)}`), Fe.t != null && rt.push(`t=${st(Fe.t)}`), rt.length && (Ke += `
  Dim: ${rt.join(" ")} ${lt}`), Fe.material) {
            let St = Fe.material;
            Fe.fillMaterial && (St += ` + FILL "${Fe.fillMaterial}"`), Ke += `
  Mat: ${St}`;
          }
        } else {
          const Ge = (_i = (_h = Se == null ? void 0 : Se.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, wt), nt = (_k = (_j = Se == null ? void 0 : Se.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, wt);
          Ge ? (Ke += `
  ${Ge}`, nt && !Ge.includes(nt) && (Ke += `  (${nt})`)) : nt && (Ke += `
  Material: ${nt}`);
        }
        if (Ke += `
nodos: [${it.join(", ")}]`, Zt === "shell" && ((_l2 = t.mesh) == null ? void 0 : _l2.analyzeOutputs)) {
          const Ge = t.mesh.analyzeOutputs.rawVal, nt = zl[Ye.stressUnit] ?? 1, lt = [
            [
              "bendingXX",
              "Mxx",
              Oe,
              `${Ye.forceUnit}\xB7m/m`
            ],
            [
              "bendingYY",
              "Myy",
              Oe,
              `${Ye.forceUnit}\xB7m/m`
            ],
            [
              "bendingXY",
              "Mxy",
              Oe,
              `${Ye.forceUnit}\xB7m/m`
            ],
            [
              "membraneXX",
              "Nxx",
              Oe,
              `${Ye.forceUnit}/m`
            ],
            [
              "membraneYY",
              "Nyy",
              Oe,
              `${Ye.forceUnit}/m`
            ],
            [
              "membraneXY",
              "Nxy",
              Oe,
              `${Ye.forceUnit}/m`
            ],
            [
              "shearX",
              "Qx",
              Oe,
              `${Ye.forceUnit}/m`
            ],
            [
              "shearY",
              "Qy",
              Oe,
              `${Ye.forceUnit}/m`
            ],
            [
              "vonMises",
              "\u03C3VM",
              nt,
              Ye.stressUnit
            ],
            [
              "pressure",
              "p",
              nt,
              Ye.stressUnit
            ]
          ], st = [];
          for (const [rt, St, ct, qt] of lt) {
            const _t2 = Ge == null ? void 0 : Ge[rt];
            if (_t2 && _t2 instanceof Map) {
              const Xt = _t2.get(wt);
              if (Xt != null) {
                if (typeof Xt == "number") st.push(`${St} = ${Ft(Xt * ct, 3)} ${qt}`);
                else if (Array.isArray(Xt)) {
                  let Wt = Xt[0];
                  for (const Rt of Xt) Math.abs(Rt) > Math.abs(Wt) && (Wt = Rt);
                  st.push(`${St} = ${Ft(Wt * ct, 3)} ${qt}`);
                }
              }
            }
          }
          st.length > 0 && (Ke += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + st.slice(0, 8).join(`
`));
        }
        if (Zt === "frame" && ((_m = t.mesh) == null ? void 0 : _m.deformOutputs) && t.mesh.elementInputs) {
          const Ge = t.mesh.deformOutputs.rawVal, nt = t.mesh.elementInputs.rawVal, lt = Ge == null ? void 0 : Ge.deformations;
          if (lt && it.length === 2) {
            const st = lt.get(it[0]), rt = lt.get(it[1]), St = ((_n = t.mesh.nodes) == null ? void 0 : _n.rawVal) ?? Ae, ct = St[it[0]], qt = St[it[1]];
            if (st && rt && ct && qt) {
              const _t2 = qt[0] - ct[0], Xt = qt[1] - ct[1], Wt = qt[2] - ct[2], Rt = Math.sqrt(_t2 * _t2 + Xt * Xt + Wt * Wt);
              if (Rt > 1e-9) {
                const zn = _t2 / Rt, $t = Xt / Rt, Vn = Wt / Rt, yn = (rt[0] - st[0]) * zn + (rt[1] - st[1]) * $t + (rt[2] - st[2]) * Vn, en = ((_o2 = nt.elasticities) == null ? void 0 : _o2.get(wt)) ?? 0, Xn = ((_p = nt.areas) == null ? void 0 : _p.get(wt)) ?? 0, Qn = ((_q = nt.momentsOfInertiaY) == null ? void 0 : _q.get(wt)) ?? 0, as = ((_r = nt.momentsOfInertiaZ) == null ? void 0 : _r.get(wt)) ?? 0, Kt = ((_s = nt.torsionalConstants) == null ? void 0 : _s.get(wt)) ?? 0, uo = ((_t = nt.shearModuli) == null ? void 0 : _t.get(wt)) ?? en / 2.6, Un = en * Xn * (yn / Rt), On = (rt[3] - st[3]) * zn + (rt[4] - st[4]) * $t + (rt[5] - st[5]) * Vn, Zn = uo * Kt * (On / Rt), xn = rt[4] - st[4], fo = rt[5] - st[5], Jt = en * Qn * xn / Rt, tn = en * as * fo / Rt;
                Ke += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ke += `
L = ${Ft(Rt, 3)} m`, Ke += `
\u0394L = ${Ft(yn * dt, 3)} ${Ye.dispUnit}`, Ke += `
\u03B5 = ${Ft(yn / Rt, 6)}`, Math.abs(Un) > 1e-6 && (Ke += `
N \u2248 ${Ft(Un * Oe)} ${Ye.forceUnit}`), Math.abs(Zn) > 1e-6 && (Ke += `
T \u2248 ${Ft(Zn * Oe)} ${Ye.forceUnit}\xB7m`), Math.abs(Jt) > 1e-6 && (Ke += `
My \u2248 ${Ft(Jt * Oe)} ${Ye.forceUnit}\xB7m`), Math.abs(tn) > 1e-6 && (Ke += `
Mz \u2248 ${Ft(tn * Oe)} ${Ye.forceUnit}\xB7m`);
              }
            }
          }
        }
        return {
          type: Zt,
          idx: wt,
          info: Ke
        };
      }
      return null;
    }
    function G(Z, ce, pe) {
      var _a2, _b, _c;
      if (b.visible = false, k.visible = false, S.visible = false, se.visible = false, J.visible = false, !Z || !t.mesh) {
        ne.style.display = "none", t.render();
        return;
      }
      const me = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
      if (Z.type === "node") {
        const Le = Y(Z.idx);
        if (Le) {
          const je = t.derivedNodes.rawVal ?? [];
          let We = 1;
          if (je.length >= 2) {
            let Pe = [
              1 / 0,
              1 / 0,
              1 / 0
            ], ot = [
              -1 / 0,
              -1 / 0,
              -1 / 0
            ];
            for (const Ye of je) for (let dt = 0; dt < 3; dt++) Ye[dt] < Pe[dt] && (Pe[dt] = Ye[dt]), Ye[dt] > ot[dt] && (ot[dt] = Ye[dt]);
            We = Math.max(ot[0] - Pe[0], ot[1] - Pe[1], ot[2] - Pe[2], 0.1);
          }
          const Ve = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, et = 0.021 * We * Ve;
          b.position.copy(Le), b.scale.setScalar(et), b.visible = true;
        }
      } else if (Z.type === "frame" && me) {
        const Le = me[Z.idx], je = Y(Le[0]), We = Y(Le[1]);
        if (je && We) {
          const Ve = je.clone().add(We).multiplyScalar(0.5), et = We.clone().sub(je), Pe = et.length(), ot = Math.max(1e-4, 3.5 * ze(Ve));
          S.position.copy(Ve);
          const Ye = new T(0, 1, 0), dt = Ye.clone().cross(et).normalize(), Oe = Ye.angleTo(et);
          S.quaternion.setFromAxisAngle(dt, Oe), S.scale.set(ot, Pe, ot), S.visible = true;
        }
      } else if (Z.type === "shell" && me) {
        const Le = me[Z.idx], je = [], We = [];
        for (const Ve of Le) {
          const et = Y(Ve);
          if (!et) return;
          je.push(et.x, et.y, et.z);
        }
        Le.length === 4 ? We.push(0, 1, 2, 0, 2, 3) : Le.length === 3 && We.push(0, 1, 2), E.setAttribute("position", new Tt(je, 3)), E.setIndex(We), E.computeVertexNormals(), se.visible = true;
      } else if (Z.type === "solid" && me) {
        const Le = me[Z.idx], je = [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            2,
            3
          ],
          [
            3,
            0
          ],
          [
            4,
            5
          ],
          [
            5,
            6
          ],
          [
            6,
            7
          ],
          [
            7,
            4
          ],
          [
            0,
            4
          ],
          [
            1,
            5
          ],
          [
            2,
            6
          ],
          [
            3,
            7
          ]
        ], We = [];
        for (const [Ve, et] of je) {
          const Pe = Y(Le[Ve]), ot = Y(Le[et]);
          Pe && ot && We.push(Pe.x, Pe.y, Pe.z, ot.x, ot.y, ot.z);
        }
        V.setAttribute("position", new Tt(We, 3)), J.visible = true;
      }
      if (window.__hekatanShellTooltipVisible === true) {
        ne.style.display = "none", t.render();
        return;
      }
      ne.textContent = Z.info, ne.style.whiteSpace = "pre-line", ne.style.display = "block";
      const $e = t.rendererElm.getBoundingClientRect(), Ae = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? $e;
      ne.style.left = `${ce - Ae.left}px`, ne.style.top = `${pe - Ae.top}px`, t.render();
    }
    let C = "", N = 0, H = 0;
    const q = window.__hekatanHoverDebug ?? false, oe = (Z) => {
      N && cancelAnimationFrame(N), N = requestAnimationFrame(() => {
        var _a2, _b, _c;
        const ce = ee(Z.clientX, Z.clientY);
        if (q && H < 5) {
          const me = t.derivedNodes.rawVal, ke = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
          console.log(`[hover] pointer (${Z.clientX}, ${Z.clientY}) nodes=${(me == null ? void 0 : me.length) ?? 0} elems=${(ke == null ? void 0 : ke.length) ?? 0} hover=`, ce), H++;
        }
        const pe = ce ? `${ce.type}:${ce.idx}` : "";
        if (pe !== C) C = pe, G(ce, Z.clientX, Z.clientY);
        else if (ce) {
          const me = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
          ne.style.left = `${Z.clientX - me.left}px`, ne.style.top = `${Z.clientY - me.top}px`;
        }
      });
    };
    let D = null;
    const de = () => {
      C = "", b.visible = false, k.visible = false, S.visible = false, se.visible = false, J.visible = false, ne.style.display = "none", t.render();
    }, j = (Z) => {
      const ce = t.rendererElm.getBoundingClientRect(), pe = Z.clientX - ce.left, me = Z.clientY - ce.top;
      (pe < -2 || me < -2 || pe > ce.width + 2 || me > ce.height + 2) && (D && clearTimeout(D), D = window.setTimeout(de, 200));
    }, O = () => {
      D && (clearTimeout(D), D = null);
    };
    t.rendererElm.addEventListener("pointermove", oe), t.rendererElm.addEventListener("pointerleave", j), t.rendererElm.addEventListener("pointerenter", O);
    function W() {
      var _a2, _b, _c;
      const Z = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
      return Z === "select" || Z === "none" || !Z;
    }
    let re = null;
    t.rendererElm.addEventListener("pointerdown", (Z) => {
      Z.button === 0 && (re = {
        x: Z.clientX,
        y: Z.clientY
      });
    }), t.rendererElm.addEventListener("pointerup", (Z) => {
      if (Z.button !== 0 || !re) return;
      const ce = Z.clientX - re.x, pe = Z.clientY - re.y;
      if (re = null, ce * ce + pe * pe > 9 || !W()) return;
      const me = ee(Z.clientX, Z.clientY);
      me ? (at({
        type: me.type,
        idx: me.idx
      }, Z.shiftKey), tt()) : Ue();
    }), window.addEventListener("keydown", (Z) => {
      if (Z.key !== "Escape" || !Q.length) return;
      const ce = document.activeElement, pe = !!ce && (ce.id === "hk3-cmd-input" || ce.id === "hk-dyn-input") && ce.value === "";
      ce && (ce.tagName === "INPUT" || ce.tagName === "TEXTAREA" || ce.isContentEditable) && !pe || Ue();
    }, {
      capture: true
    });
    function we() {
      for (const Z of ae.children.slice()) {
        ae.remove(Z);
        const ce = Z.geometry;
        ce && ce !== m && ce !== ue && ce.dispose();
      }
    }
    const ze = (Z) => {
      var _a2;
      const ce = t.getActiveCamera(), pe = ((_a2 = t.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
      return ce.isOrthographicCamera ? (ce.top - ce.bottom) / (ce.zoom || 1) / pe : 2 * ce.position.distanceTo(Z) * Math.tan((ce.fov || 50) * Math.PI / 180 / 2) / pe;
    };
    function Ee(Z, ce) {
      var _a2, _b;
      const pe = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
      if (Z.type === "node") {
        const me = Y(Z.idx);
        if (!me) return;
        const ke = new ut(m, R);
        ke.position.copy(me), ke.scale.setScalar(Math.max(1e-4, 7 * ze(me))), ke.renderOrder = 101, ae.add(ke);
      } else if (Z.type === "frame" && pe) {
        const me = pe[Z.idx], ke = Y(me[0]), $e = Y(me[1]);
        if (!ke || !$e) return;
        const Ae = ke.clone().add($e).multiplyScalar(0.5), Le = $e.clone().sub(ke), je = Le.length(), We = Math.max(1e-4, 4 * ze(Ae)), Ve = new ut(ue, le);
        Ve.position.copy(Ae);
        const et = new T(0, 1, 0);
        Ve.quaternion.setFromAxisAngle(et.clone().cross(Le).normalize(), et.angleTo(Le)), Ve.scale.set(We, je, We), Ve.renderOrder = 101, ae.add(Ve);
      } else if (Z.type === "shell" && pe) {
        const me = pe[Z.idx], ke = [], $e = [];
        for (const je of me) {
          const We = Y(je);
          if (!We) return;
          ke.push(We.x, We.y, We.z);
        }
        me.length === 4 ? $e.push(0, 1, 2, 0, 2, 3) : me.length === 3 && $e.push(0, 1, 2);
        const Ae = new De();
        Ae.setAttribute("position", new Tt(ke, 3)), Ae.setIndex($e), Ae.computeVertexNormals();
        const Le = new ut(Ae, xe);
        Le.renderOrder = 101, ae.add(Le);
      } else if (Z.type === "solid" && pe) {
        const me = pe[Z.idx], ke = [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            2,
            3
          ],
          [
            3,
            0
          ],
          [
            4,
            5
          ],
          [
            5,
            6
          ],
          [
            6,
            7
          ],
          [
            7,
            4
          ],
          [
            0,
            4
          ],
          [
            1,
            5
          ],
          [
            2,
            6
          ],
          [
            3,
            7
          ]
        ], $e = [];
        for (const [je, We] of ke) {
          const Ve = Y(me[je]), et = Y(me[We]);
          Ve && et && $e.push(Ve.x, Ve.y, Ve.z, et.x, et.y, et.z);
        }
        const Ae = new De();
        Ae.setAttribute("position", new Tt($e, 3));
        const Le = new an(Ae, be);
        Le.renderOrder = 101, ae.add(Le);
      }
    }
    function tt() {
      if (we(), !Q.length || !t.mesh) {
        t.render();
        return;
      }
      const Z = t.derivedNodes.rawVal ?? [];
      if (Z.length >= 2) {
        const ce = [
          1 / 0,
          1 / 0,
          1 / 0
        ], pe = [
          -1 / 0,
          -1 / 0,
          -1 / 0
        ];
        for (const me of Z) for (let ke = 0; ke < 3; ke++) me[ke] < ce[ke] && (ce[ke] = me[ke]), me[ke] > pe[ke] && (pe[ke] = me[ke]);
        Math.max(pe[0] - ce[0], pe[1] - ce[1], pe[2] - ce[2], 0.1);
      }
      for (const ce of Q) Ee(ce);
      t.render();
    }
    function at(Z, ce) {
      const pe = Q.findIndex((me) => me.type === Z.type && me.idx === Z.idx);
      pe >= 0 ? Q.splice(pe, 1) : ce || Q.push(Z), te = Q.length ? Q[Q.length - 1] : null, window.dispatchEvent(new CustomEvent("hk:model-selection", {
        detail: {
          ultimo: te
        }
      }));
    }
    function Ue() {
      Q.length = 0, te = null, tt();
    }
    return ve.derive(() => {
      t.derivedNodes.val, Q.length && tt();
    }), c;
  }
  function $l(t, c, m, g, b, A) {
    const P = b - m, k = A - g, v = P * P + k * k;
    if (v < 1e-9) {
      const ie = t - m, J = c - g;
      return Math.sqrt(ie * ie + J * J);
    }
    let S = ((t - m) * P + (c - g) * k) / v;
    S = Math.max(0, Math.min(1, S));
    const E = m + S * P, B = g + S * k, se = t - E, V = c - B;
    return Math.sqrt(se * se + V * V);
  }
  function Ll(t, c, m) {
    let g = false;
    for (let b = 0, A = m.length - 1; b < m.length; A = b++) {
      const P = m[b].x, k = m[b].y, v = m[A].x, S = m[A].y;
      k > c != S > c && t < (v - P) * (c - k) / (S - k + 1e-12) + P && (g = !g);
    }
    return g;
  }
  const fn = (t) => {
    if (!isFinite(t) || t === 0) return "0";
    const c = Math.abs(t);
    return c >= 1e-3 && c < 1e7 ? String(+t.toPrecision(15)) : t.toExponential(14);
  };
  function Fa(t, c) {
    var _a2, _b, _c, _d, _e, _f, _g;
    const m = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], b = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[c];
    if (!b || b.length !== 2) throw new Error(`El elemento ${c} no es una barra (2 nudos).`);
    const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, P = (j) => {
      var _a3, _b2;
      return ((_b2 = (_a3 = A[j]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, c)) ?? 0;
    }, k = m[b[0]], v = m[b[1]], S = P("elasticities"), E = P("shearModuli"), B = P("areas"), se = P("momentsOfInertiaZ"), V = P("momentsOfInertiaY"), ie = P("torsionalConstants");
    let J = P("shearAreasY"), R = P("shearAreasZ");
    const le = Math.hypot(v[0] - k[0], v[1] - k[1], v[2] - k[2]), ue = J < -1e-15, xe = R < -1e-15;
    !ue && J < 1e-15 && B > 1e-15 && E > 1e-15 && (J = 5 / 6 * B), !xe && R < 1e-15 && B > 1e-15 && E > 1e-15 && (R = 5 / 6 * B);
    const be = !xe && R > 0 && E > 0 ? 12 * S * se / (E * R * le * le) : 0, Q = !ue && J > 0 && E > 0 ? 12 * S * V / (E * J * le * le) : 0, ae = S * B / le, te = E * ie / le, ne = 12 * S * se / le ** 3 / (1 + be), Y = 6 * S * se / le ** 2 / (1 + be), ee = 4 * S * se / le * (1 + be / 4) / (1 + be), G = 2 * S * se / le * (1 - be / 2) / (1 + be), C = 12 * S * V / le ** 3 / (1 + Q), N = 6 * S * V / le ** 2 / (1 + Q), H = 4 * S * V / le * (1 + Q / 4) / (1 + Q), q = 2 * S * V / le * (1 - Q / 2) / (1 + Q);
    let oe = [
      [
        ae,
        0,
        0,
        0,
        0,
        0,
        -ae,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        ne,
        0,
        0,
        0,
        Y,
        0,
        -ne,
        0,
        0,
        0,
        Y
      ],
      [
        0,
        0,
        C,
        0,
        -N,
        0,
        0,
        0,
        -C,
        0,
        -N,
        0
      ],
      [
        0,
        0,
        0,
        te,
        0,
        0,
        0,
        0,
        0,
        -te,
        0,
        0
      ],
      [
        0,
        0,
        -N,
        0,
        H,
        0,
        0,
        0,
        N,
        0,
        q,
        0
      ],
      [
        0,
        Y,
        0,
        0,
        0,
        ee,
        0,
        -Y,
        0,
        0,
        0,
        G
      ],
      [
        -ae,
        0,
        0,
        0,
        0,
        0,
        ae,
        0,
        0,
        0,
        0,
        0
      ],
      [
        0,
        -ne,
        0,
        0,
        0,
        -Y,
        0,
        ne,
        0,
        0,
        0,
        -Y
      ],
      [
        0,
        0,
        -C,
        0,
        N,
        0,
        0,
        0,
        C,
        0,
        N,
        0
      ],
      [
        0,
        0,
        0,
        -te,
        0,
        0,
        0,
        0,
        0,
        te,
        0,
        0
      ],
      [
        0,
        0,
        -N,
        0,
        q,
        0,
        0,
        0,
        N,
        0,
        H,
        0
      ],
      [
        0,
        Y,
        0,
        0,
        0,
        G,
        0,
        -Y,
        0,
        0,
        0,
        ee
      ]
    ];
    const D = (_e = (_d = A.partialFixitySprings) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, c);
    if (D) for (let j = 0; j < Math.min(12, D.length); j++) D[j] > 1e-12 && (oe[j][j] += D[j]);
    const de = (_g = (_f = A.momentReleases) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, c);
    if (de && de.some(Boolean)) {
      const j = de.length >= 12 ? de.slice(0, 12).map((Ee, tt) => Ee ? tt : -1).filter((Ee) => Ee >= 0) : de.slice(0, 6).map((Ee, tt) => Ee ? [
        3,
        4,
        5,
        9,
        10,
        11
      ][tt] : -1).filter((Ee) => Ee >= 0), O = [
        ...Array(12).keys()
      ].filter((Ee) => !j.includes(Ee)), W = j.length, re = j.map((Ee, tt) => [
        ...j.map((at) => oe[Ee][at]),
        ...j.map((at, Ue) => tt === Ue ? 1 : 0)
      ]);
      for (let Ee = 0; Ee < W; Ee++) {
        let tt = Ee;
        for (let Ue = Ee + 1; Ue < W; Ue++) Math.abs(re[Ue][Ee]) > Math.abs(re[tt][Ee]) && (tt = Ue);
        [re[Ee], re[tt]] = [
          re[tt],
          re[Ee]
        ];
        const at = re[Ee][Ee];
        for (let Ue = 0; Ue < 2 * W; Ue++) re[Ee][Ue] /= at;
        for (let Ue = 0; Ue < W; Ue++) if (Ue !== Ee) {
          const Z = re[Ue][Ee];
          for (let ce = 0; ce < 2 * W; ce++) re[Ue][ce] -= Z * re[Ee][ce];
        }
      }
      const we = re.map((Ee) => Ee.slice(W)), ze = Array.from({
        length: 12
      }, () => Array(12).fill(0));
      for (const Ee of O) for (const tt of O) {
        let at = 0;
        for (let Ue = 0; Ue < W; Ue++) for (let Z = 0; Z < W; Z++) at += oe[Ee][j[Ue]] * we[Ue][Z] * oe[j[Z]][tt];
        ze[Ee][tt] = oe[Ee][tt] - at;
      }
      oe = ze;
    }
    return {
      K: oe,
      L: le,
      phiZ: be,
      phiY: Q
    };
  }
  function Ea(t, c) {
    var _a2, _b, _c, _d, _e, _f, _g;
    const m = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], b = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[c];
    if (!b || b.length !== 2) throw new Error(`El elemento ${c} no es una barra (2 nudos).`);
    const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, P = (ie, J = 0) => {
      var _a3, _b2;
      return ((_b2 = (_a3 = A[ie]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, c)) ?? J;
    }, k = m[b[0]], v = m[b[1]], S = (_e = (_d = A.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, c), E = (_g = (_f = A.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, c), B = P("localAngles", 0), se = [], V = (ie = "") => se.push(ie);
    if (V("% ============================================================"), V(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${c + 1} (indice ${c} del motor)`), V("%  Generado por Hekatan Struct con los datos que recibe el motor."), V("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), V("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), V("% ============================================================"), V(), V("% --- Datos de la barra -------------------------------------------------"), V(`xi = [${k.map(fn).join(" ")}];      % nudo i (${b[0]})`), V(`xj = [${v.map(fn).join(" ")}];      % nudo j (${b[1]})`), V(`E  = ${fn(P("elasticities"))};      % modulo de elasticidad`), V(`G  = ${fn(P("shearModuli"))};      % modulo de cortante`), V(`A  = ${fn(P("areas"))};      % area`), V(`Iz = ${fn(P("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), V(`Iy = ${fn(P("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), V(`J  = ${fn(P("torsionalConstants"))};      % constante de torsion`), V(`AsY = ${fn(P("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), V(`AsZ = ${fn(P("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), B && V(`% ang = ${fn(B)} grados: gira la seccion en T, NO cambia esta matriz local.`), V(), V("L = sqrt(sum((xj - xi).^2));"), V(), V("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), V("bernY = AsY < 0;   bernZ = AsZ < 0;"), V("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), V("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), V("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), V("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), V(), V("EA_L = E*A/L;          % axial"), V("GJ_L = G*J/L;          % torsion"), V("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), V("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), V("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), V("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), V(), V("% --- Matriz local (misma disposicion que el C++) ----------------------"), V("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), V("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), V("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), V("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), V("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), V("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), V("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), V("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), V("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), V("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), V("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), V("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), E && E.some((ie) => ie > 1e-12) && (V(), V("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), V(`kres = [${E.slice(0, 12).map(fn).join(" ")}];`), V("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), S && S.some(Boolean)) {
      const ie = S.length >= 12 ? S.slice(0, 12).map((J, R) => J ? R + 1 : 0).filter(Boolean) : S.slice(0, 6).map((J, R) => J ? [
        4,
        5,
        6,
        10,
        11,
        12
      ][R] : 0).filter(Boolean);
      V(), V("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), V(`f = [${ie.join(" ")}];              % GDL liberados`), V("r = setdiff(1:12, f);                % GDL que quedan"), V("Kc = zeros(12);"), V("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), V("K = Kc;");
    }
    return V(), V("% --- Resultado ---------------------------------------------------------"), V(`fprintf('Barra ${c + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), V("disp('K local (12x12):');"), V("disp(K);"), {
      nombre: `K_local_barra_${c + 1}.m`,
      texto: se.join(`
`) + `
`
    };
  }
  const Vl = {
    normals: "Axial",
    torsions: "Torsi\xF3n",
    shearsY: "Cortante 2-2",
    shearsZ: "Cortante 3-3",
    bendingsY: "Momento 2-2",
    bendingsZ: "Momento 3-3"
  }, Il = {
    normals: "kN",
    torsions: "kN\xB7m",
    shearsY: "kN",
    shearsZ: "kN",
    bendingsY: "kN\xB7m",
    bendingsZ: "kN\xB7m"
  }, Nn = 1e-3;
  function _o(t, c) {
    return c === "XZ" ? {
      u: t[0],
      v: t[2],
      fuera: t[1]
    } : c === "YZ" ? {
      u: t[1],
      v: t[2],
      fuera: t[0]
    } : {
      u: t[0],
      v: t[1],
      fuera: t[2]
    };
  }
  function Tl(t, c) {
    const m = Math.abs(c[0] - t[0]);
    return Math.abs(c[1] - t[1]) < Nn ? {
      plano: "XZ",
      en: t[1]
    } : m < Nn ? {
      plano: "YZ",
      en: t[0]
    } : {
      plano: "XY",
      en: t[2]
    };
  }
  function Rl(t, c) {
    var _a2, _b;
    let m = null, g = {
      plano: "XZ",
      en: 0
    };
    const b = () => {
      var _a3, _b2;
      const C = ((_a3 = c == null ? void 0 : c.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = c == null ? void 0 : c.frameResults) == null ? void 0 : _b2.val);
      return !C || C === "none" ? null : String(C).replace(/^contour:/, "");
    }, A = (C) => {
      var _a3, _b2;
      const N = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], H = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], q = /* @__PURE__ */ new Set();
      for (const oe of H) {
        if (oe.length !== 2) continue;
        const D = N[oe[0]], de = N[oe[1]];
        if (!D || !de) continue;
        const j = _o(D, C), O = _o(de, C);
        Math.abs(j.fuera - O.fuera) < Nn && q.add(Math.round(j.fuera * 1e3) / 1e3);
      }
      return [
        ...q
      ].sort((oe, D) => oe - D);
    };
    function P(C) {
      var _a3, _b2;
      if (C == null ? void 0 : C.plano) g = {
        plano: C.plano,
        en: C.en ?? A(C.plano)[0] ?? 0
      };
      else {
        const H = [
          ...window.__hekatanModelSelection ?? []
        ].reverse().find((D) => D.type === "frame"), q = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], oe = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
        H && oe[H.idx] && q[oe[H.idx][0]] && q[oe[H.idx][1]] ? g = Tl(q[oe[H.idx][0]], q[oe[H.idx][1]]) : g = {
          plano: "XZ",
          en: A("XZ")[0] ?? 0
        };
      }
      m || k(), m.hidden = false, v();
    }
    function k() {
      if (m = document.createElement("div"), m.id = "hk-diagrama-2d", m.style.cssText = [
        "position:fixed",
        "left:50%",
        "top:70px",
        "transform:translateX(-50%)",
        "width:min(900px,92vw)",
        "height:min(560px,78vh)",
        "z-index:9990",
        "background:#0b0e14",
        "border:1px solid #2f3b50",
        "border-radius:8px",
        "box-shadow:0 12px 40px rgba(0,0,0,.6)",
        "display:flex",
        "flex-direction:column",
        "font:12px 'Segoe UI',system-ui,sans-serif",
        "color:#c9d3e0"
      ].join(";"), m.innerHTML = `
      <div class="hk-d2-bar" style="display:flex;align-items:center;gap:10px;padding:7px 10px;
           background:#141a24;border-bottom:1px solid #2f3b50;cursor:move;user-select:none">
        <b style="color:#e6c463;white-space:nowrap">\u{1F4D0} Diagrama 2D</b>
        <span class="hk-d2-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span>
        <label style="margin-left:auto;white-space:nowrap">plano
          <select class="hk-d2-plano" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px">
            <option value="XZ">Alzado XZ</option><option value="YZ">Alzado YZ</option><option value="XY">Planta XY</option>
          </select></label>
        <button class="hk-d2-ant" title="p\xF3rtico anterior" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:1px 7px">\u25C0</button>
        <select class="hk-d2-en" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"></select>
        <button class="hk-d2-sig" title="p\xF3rtico siguiente" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:1px 7px">\u25B6</button>
        <button class="hk-d2-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button>
      </div>
      <svg class="hk-d2-svg" style="flex:1;width:100%;height:100%"></svg>
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(m), !document.getElementById("hk-d2-hidden-css")) {
        const D = document.createElement("style");
        D.id = "hk-d2-hidden-css", D.textContent = "#hk-diagrama-2d[hidden]{display:none !important;}", document.head.appendChild(D);
      }
      m.querySelector(".hk-d2-x").addEventListener("click", () => {
        m.hidden = true;
      });
      const C = m.querySelector(".hk-d2-plano"), N = m.querySelector(".hk-d2-en");
      C.addEventListener("change", () => {
        g = {
          plano: C.value,
          en: A(C.value)[0] ?? 0
        }, v();
      }), N.addEventListener("change", () => {
        g.en = Number(N.value), v();
      });
      const H = (D) => {
        const de = A(g.plano), j = de.findIndex((W) => Math.abs(W - g.en) < Nn), O = Math.max(0, Math.min(de.length - 1, (j < 0 ? 0 : j) + D));
        de.length && (g.en = de[O], v());
      };
      m.querySelector(".hk-d2-ant").addEventListener("click", () => H(-1)), m.querySelector(".hk-d2-sig").addEventListener("click", () => H(1));
      const q = m.querySelector(".hk-d2-bar");
      let oe = null;
      q.addEventListener("pointerdown", (D) => {
        if (D.target.closest("select,button")) return;
        const de = m.getBoundingClientRect();
        oe = {
          x: D.clientX,
          y: D.clientY,
          l: de.left,
          t: de.top
        }, m.style.transform = "none", m.style.left = de.left + "px", m.style.top = de.top + "px";
      }), window.addEventListener("pointermove", (D) => {
        !oe || !m || (m.style.left = oe.l + D.clientX - oe.x + "px", m.style.top = oe.t + D.clientY - oe.y + "px");
      }), window.addEventListener("pointerup", () => {
        oe = null;
      }), new ResizeObserver(() => {
        m && !m.hidden && v();
      }).observe(m);
    }
    function v() {
      var _a3, _b2, _c, _d, _e, _f, _g, _h;
      if (!m || m.hidden) return;
      const C = new Set(B && !B.hidden && se >= 0 ? ie(se) : []), N = m.querySelector(".hk-d2-svg"), H = m.querySelector(".hk-d2-tit"), q = m.querySelector(".hk-d2-pie"), oe = m.querySelector(".hk-d2-plano"), D = m.querySelector(".hk-d2-en");
      oe.value = g.plano;
      const de = A(g.plano), j = g.plano === "XZ" ? "y" : g.plano === "YZ" ? "x" : "z", O = g.plano === "XY" ? "Planta" : "P\xF3rtico";
      D.innerHTML = de.map((Se, Fe) => `<option value="${Se}" ${Math.abs(Se - g.en) < Nn ? "selected" : ""}>${O} ${Fe + 1} \xB7 ${j} = ${Se.toFixed(2)} m</option>`).join("");
      const W = b(), re = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], we = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], ze = W ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[W] : null;
      N.innerHTML = "";
      const Ee = N.clientWidth || 880, tt = N.clientHeight || 480, at = [];
      if (we.forEach((Se, Fe) => {
        if (Se.length !== 2) return;
        const Ge = re[Se[0]], nt = re[Se[1]];
        if (!Ge || !nt) return;
        const lt = _o(Ge, g.plano), st = _o(nt, g.plano);
        Math.abs(lt.fuera - g.en) < Nn && Math.abs(st.fuera - g.en) < Nn && at.push({
          i: Fe,
          a: lt,
          b: st
        });
      }), !at.length) {
        q.textContent = "No hay barras en este plano.", H.textContent = "";
        return;
      }
      let Ue = 1 / 0, Z = -1 / 0, ce = 1 / 0, pe = -1 / 0;
      for (const Se of at) for (const Fe of [
        Se.a,
        Se.b
      ]) Ue = Math.min(Ue, Fe.u), Z = Math.max(Z, Fe.u), ce = Math.min(ce, Fe.v), pe = Math.max(pe, Fe.v);
      const me = Z - Ue || 1, ke = pe - ce || 1, $e = 0.12 * Math.max(me, ke), Ae = 46, Le = Math.min((Ee - 2 * Ae) / (me + 2 * $e), (tt - 2 * Ae) / (ke + 2 * $e)), je = (Ee - me * Le) / 2, We = (tt - ke * Le) / 2, Ve = (Se) => je + (Se - Ue) * Le, et = (Se) => tt - (We + (Se - ce) * Le), Pe = "http://www.w3.org/2000/svg", ot = (Se, Fe, Ge) => {
        const nt = document.createElementNS(Pe, Se);
        for (const lt in Fe) nt.setAttribute(lt, String(Fe[lt]));
        return Ge != null && (nt.textContent = Ge), N.appendChild(nt), nt;
      }, Ye = /* @__PURE__ */ new Map();
      for (const Se of at) {
        const Fe = ((_h = (_g = (_f = (_e = t.elementInputs) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Se.i)) ?? 0, Ge = _o(Ga(W ?? "normals", Ka(re[we[Se.i][0]], re[we[Se.i][1]], Fe)), g.plano), nt = Math.hypot(Ge.u, Ge.v);
        Ye.set(Se.i, nt > 0.3 ? [
          Ge.u / nt,
          -Ge.v / nt
        ] : null);
      }
      const dt = at.filter((Se) => !Ye.get(Se.i)).length;
      let Oe = 0;
      if (ze) for (const Se of at) {
        if (!Ye.get(Se.i)) continue;
        const Fe = ze instanceof Map ? ze.get(Se.i) : ze[Se.i];
        Fe && (Oe = Math.max(Oe, Math.abs(Fe[0] ?? 0), Math.abs(Fe[1] ?? 0)));
      }
      const jt = 0.12 * Math.max(me, ke) * Le, wt = Oe > 0 ? jt / Oe : 0, ln = W === "bendingsY" || W === "bendingsZ", Zt = (Se) => Math.abs(Se) >= 100 ? Se.toFixed(1) : Math.abs(Se) >= 10 ? Se.toFixed(2) : Se.toFixed(3), it = [];
      for (const Se of at) {
        const Fe = Ve(Se.a.u), Ge = et(Se.a.v), nt = Ve(Se.b.u), lt = et(Se.b.v), st = Ye.get(Se.i), [rt, St] = st ?? [
          0,
          0
        ], ct = ze && st ? ze instanceof Map ? ze.get(Se.i) : ze[Se.i] : null, [qt, _t] = ct ? Ts(W, ct) : [
          0,
          0
        ];
        if (ct && wt > 0) {
          const zn = [
            Fe + rt * qt * wt * 1,
            Ge + St * qt * wt * 1
          ], $t = [
            nt + rt * _t * wt * 1,
            lt + St * _t * wt * 1
          ], en = qt + _t >= 0 ? "#3fa7d6" : "#d9534f";
          ot("polygon", {
            points: `${Fe},${Ge} ${zn[0]},${zn[1]} ${$t[0]},${$t[1]} ${nt},${lt}`,
            fill: en,
            "fill-opacity": 0.38,
            stroke: en,
            "stroke-width": 1.2
          }), it.push({
            x: zn[0] + rt * 12,
            y: zn[1] + St * 12,
            t: Zt(qt),
            peso: Math.abs(qt)
          }), it.push({
            x: $t[0] + rt * 12,
            y: $t[1] + St * 12,
            t: Zt(_t),
            peso: Math.abs(_t)
          });
        }
        ot("line", {
          x1: Fe,
          y1: Ge,
          x2: nt,
          y2: lt,
          stroke: "#e6ecf5",
          "stroke-width": 2.2,
          "stroke-linecap": "round"
        }), C.has(Se.i) && ot("line", {
          x1: Fe,
          y1: Ge,
          x2: nt,
          y2: lt,
          stroke: "#e6c463",
          "stroke-width": 5,
          "stroke-linecap": "round"
        });
        const Xt = ot("line", {
          x1: Fe,
          y1: Ge,
          x2: nt,
          y2: lt,
          stroke: "transparent",
          "stroke-width": 14,
          style: "cursor:pointer;pointer-events:stroke"
        });
        Xt.addEventListener("click", () => J(Se.i));
        const Wt = document.createElementNS(Pe, "title");
        Wt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", Xt.appendChild(Wt);
      }
      for (const Se of at) for (const Fe of [
        Se.a,
        Se.b
      ]) g.plano !== "XY" && Math.abs(Fe.v - ce) < Nn && ot("rect", {
        x: Ve(Fe.u) - 6,
        y: et(Fe.v),
        width: 12,
        height: 7,
        fill: "#b03a3a"
      });
      const Xe = [];
      it.sort((Se, Fe) => Fe.peso - Se.peso);
      for (const Se of it) Se.peso < 0.02 * Oe || Xe.some((Fe) => Math.hypot(Fe.x - Se.x, Fe.y - Se.y) < 34) || (Xe.push(Se), ot("text", {
        x: Se.x,
        y: Se.y + 4,
        "text-anchor": "middle",
        fill: "#f2f5fa",
        "font-size": 12,
        "font-weight": 600,
        "paint-order": "stroke",
        stroke: "#0b0e14",
        "stroke-width": 3
      }, Se.t));
      const Ke = W ? Vl[W] ?? W : "sin resultado";
      H.textContent = `${Ke} \xB7 ${g.plano === "XY" ? "planta" : "alzado"} ${g.plano} en ${j} = ${g.en.toFixed(2)} m`, q.textContent = W ? `${at.length} barras en el plano \xB7 m\xE1ximo ${Zt(Oe)} ${Il[W] ?? ""}` + (ln ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (dt ? ` \xB7 ${dt} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
    }
    const S = () => {
      try {
        v();
      } catch {
      }
    };
    (c == null ? void 0 : c.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
      c.frameResults.val, S();
    }));
    let E = null;
    setInterval(() => {
      var _a3, _b2;
      const C = (_a3 = t.analyzeOutputs) == null ? void 0 : _a3.rawVal, N = (_b2 = c == null ? void 0 : c.frameResults) == null ? void 0 : _b2.rawVal, H = [
        C,
        N
      ];
      if (!(E && E[0] === C && E[1] === N)) {
        E = H, S();
        try {
          le();
        } catch {
        }
      }
    }, 400);
    let B = null, se = -1, V = "12";
    function ie(C) {
      var _a3, _b2;
      const N = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], H = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], q = /* @__PURE__ */ new Map();
      H.forEach((j, O) => {
        if (j.length === 2) for (const W of j) q.has(W) || q.set(W, []), q.get(W).push(O);
      });
      const oe = (j) => {
        const O = N[H[j][0]], W = N[H[j][1]], re = [
          W[0] - O[0],
          W[1] - O[1],
          W[2] - O[2]
        ], we = Math.hypot(re[0], re[1], re[2]) || 1;
        return re.map((ze) => ze / we);
      }, D = (j, O) => {
        const W = oe(j), re = oe(O);
        return Math.abs(W[0] * re[0] + W[1] * re[1] + W[2] * re[2]) > 0.9999;
      }, de = [
        C
      ];
      for (const j of [
        0,
        1
      ]) {
        let O = C, W = H[C][j];
        for (let re = 0; re < 500; re++) {
          const we = (q.get(W) ?? []).filter((Ee) => Ee !== O);
          if (we.length !== 1 || !D(O, we[0])) break;
          const ze = we[0];
          j === 0 ? de.unshift(ze) : de.push(ze), W = H[ze][0] === W ? H[ze][1] : H[ze][0], O = ze;
        }
      }
      return de;
    }
    function J(C) {
      if (C == null) {
        const H = [
          ...window.__hekatanModelSelection ?? []
        ].reverse().find((q) => q.type === "frame");
        if (!H) {
          alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
          return;
        }
        C = H.idx;
      }
      se = C, B || (B = document.createElement("div"), B.id = "hk-diagrama-barra", B.style.cssText = [
        "position:fixed",
        "right:24px",
        "top:90px",
        "width:min(620px,92vw)",
        "z-index:9991",
        "background:#0b0e14",
        "border:1px solid #2f3b50",
        "border-radius:8px",
        "box-shadow:0 12px 40px rgba(0,0,0,.6)",
        "font:12px 'Segoe UI',system-ui,sans-serif",
        "color:#c9d3e0"
      ].join(";"), B.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-k" title="Descarga un script MATLAB (Hekatan Lab / Octave) con la matriz de rigidez local 12\xD712 de esta barra" style="background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px;white-space:nowrap">\u{1F4C4} K local .m</button><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(B), B.querySelector(".hk-b-x").addEventListener("click", () => {
        B.hidden = true, R(), v();
      }), B.querySelector(".hk-b-k").addEventListener("click", () => {
        se >= 0 && ue(se);
      }), B.querySelector(".hk-b-pl").addEventListener("change", (N) => {
        V = N.target.value, le();
      })), B.hidden = false, R(), le(), v();
    }
    function R() {
      if (!m || !B) return;
      const C = window.innerWidth, N = Math.min(560, Math.round(C * 0.4));
      B.style.width = N + "px", !B.hidden && !m.hidden ? (m.style.transform = "none", m.style.left = "12px", m.style.width = C - N - 36 + "px", B.style.top = m.getBoundingClientRect().top + "px") : m.hidden || (m.style.left = "50%", m.style.transform = "translateX(-50%)", m.style.width = "min(900px,92vw)");
    }
    function le() {
      var _a3, _b2, _c;
      if (!B || B.hidden || se < 0) return;
      const C = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], N = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], H = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
      if (!N[se]) return;
      const q = ie(se), oe = [];
      let D = 0, de = -1;
      q.forEach((Z, ce) => {
        const [pe, me] = N[Z], ke = ce === 0 ? q.length > 1 && N[q[1]].includes(pe) : pe !== de, $e = ke ? me : pe, Ae = ke ? pe : me, Le = Math.hypot(C[Ae][0] - C[$e][0], C[Ae][1] - C[$e][1], C[Ae][2] - C[$e][2]);
        oe.push({
          x: D,
          e: Z,
          fin: ke ? 1 : 0
        }), D += Le, oe.push({
          x: D,
          e: Z,
          fin: ke ? 0 : 1
        }), de = Ae;
      });
      const j = D, O = (Z, ce) => {
        const pe = H[Z], me = pe ? pe instanceof Map ? pe.get(ce.e) : pe[ce.e] : null;
        return me ? Ts(Z, me)[ce.fin] : 0;
      }, W = C[N[q[0]][0]], re = (Z) => Z.toFixed(2);
      B.querySelector(".hk-b-tit").textContent = "L = " + j.toFixed(2) + " m \xB7 " + q.length + " tramo(s) \xB7 desde (" + re(W[0]) + ", " + re(W[1]) + ", " + re(W[2]) + ")";
      const we = V === "12" ? [
        [
          "normals",
          "Axial P",
          "kN",
          false
        ],
        [
          "shearsY",
          "Cortante V2",
          "kN",
          false
        ],
        [
          "bendingsZ",
          "Momento M3",
          "kN\xB7m",
          true
        ]
      ] : [
        [
          "normals",
          "Axial P",
          "kN",
          false
        ],
        [
          "shearsZ",
          "Cortante V3",
          "kN",
          false
        ],
        [
          "bendingsY",
          "Momento M2",
          "kN\xB7m",
          true
        ]
      ], ze = B.querySelector(".hk-b-cuerpo");
      ze.innerHTML = "";
      const Ee = Math.max(300, ze.clientWidth), tt = 124, at = 46, Ue = (tt - 14) / 2;
      for (const [Z, ce, pe, me] of we) {
        const ke = oe.map((Oe) => O(Z, Oe)), $e = Math.max(...ke), Ae = Math.min(...ke), Le = Math.max(Math.abs($e), Math.abs(Ae)) || 1, je = (Oe) => at + Oe / (j || 1) * (Ee - 2 * at), We = (Oe) => Ue + (me ? 1 : -1) * (Oe / Le) * (Ue - 16), Ve = (Oe) => Math.abs(Oe) >= 100 ? Oe.toFixed(1) : Math.abs(Oe) >= 10 ? Oe.toFixed(2) : Oe.toFixed(3);
        let et = je(0) + "," + Ue + " ";
        oe.forEach((Oe, jt) => {
          et += je(Oe.x) + "," + We(ke[jt]) + " ";
        }), et += je(j) + "," + Ue;
        const Pe = ke.indexOf($e), ot = ke.indexOf(Ae), Ye = (Oe, jt) => {
          const wt = We(ke[Oe]) + (We(ke[Oe]) < Ue ? -5 : 13);
          return '<text x="' + je(oe[Oe].x) + '" y="' + wt + '" text-anchor="middle" fill="' + jt + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Ve(ke[Oe]) + "</text>";
        }, dt = me ? "#d9534f" : "#3fa7d6";
        ze.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + ce + ' <span style="color:#6f7d90;font-weight:400">(' + pe + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Ve($e) + " \xB7 m\xEDn " + Ve(Ae) + (me ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + Ee + '" height="' + tt + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + at + '" y1="' + Ue + '" x2="' + (Ee - at) + '" y2="' + Ue + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + et + '" fill="' + dt + '" fill-opacity=".35" stroke="' + dt + '" stroke-width="1.4"/>' + Ye(0, "#f2f5fa") + Ye(oe.length - 1, "#f2f5fa") + (Pe > 0 && Pe < oe.length - 1 ? Ye(Pe, "#8fd3ff") : "") + (ot > 0 && ot < oe.length - 1 && ot !== Pe ? Ye(ot, "#ff9f9a") : "") + '<text x="' + at + '" y="' + (tt - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (Ee - at) + '" y="' + (tt - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + j.toFixed(2) + " m</text></svg>");
      }
    }
    window.__hekatanDiagramaBarra = J;
    function ue(C) {
      const { nombre: N, texto: H } = Ea(t, C), q = URL.createObjectURL(new Blob([
        H
      ], {
        type: "text/plain"
      })), oe = document.createElement("a");
      oe.href = q, oe.download = N, document.body.appendChild(oe), oe.click(), setTimeout(() => {
        URL.revokeObjectURL(q), oe.remove();
      }, 1e3);
    }
    window.__hekatanKLocalMatlab = (C, N = false) => {
      if (C == null) {
        const q = [
          ...window.__hekatanModelSelection ?? []
        ].reverse().find((oe) => oe.type === "frame");
        if (!q) return null;
        C = q.idx;
      }
      return N && ue(C), Ea(t, C);
    };
    function xe(C, N, H) {
      const q = (D) => Math.abs(D) < 1e-12 ? "0" : Math.abs(D) >= 1e5 || Math.abs(D) < 0.01 ? D.toExponential(4) : D.toPrecision(6), oe = C.map((D, de) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${N[de]}</th>` + D.map((j) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(j) < 1e-12 ? "#4a5568" : j < 0 ? "#ff9f9a" : "#e6edf5"}">${q(j)}</td>`).join("") + "</tr>").join("");
      return `<div style="overflow-x:auto;padding:4px 8px 10px"><div style="color:${H};font-weight:600;padding:6px 2px">${N === be ? "FLEXI\xD3N \u2014 [w, \u03B81, \u03B82] \xD7 4" : "MEMBRANA \u2014 [u1, u2, \u03B83] \xD7 4"}</div><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${N.map((D) => `<th style="color:#9fb0c6;padding:2px 6px">${D}</th>`).join("")}</tr>${oe}</table></div>`;
    }
    const be = [
      "w 1",
      "\u03B81 1",
      "\u03B82 1",
      "w 2",
      "\u03B81 2",
      "\u03B82 2",
      "w 3",
      "\u03B81 3",
      "\u03B82 3",
      "w 4",
      "\u03B81 4",
      "\u03B82 4"
    ], Q = [
      "u1 1",
      "u2 1",
      "\u03B83 1",
      "u1 2",
      "u2 2",
      "\u03B83 2",
      "u1 3",
      "u2 3",
      "\u03B83 3",
      "u1 4",
      "u2 4",
      "\u03B83 4"
    ];
    function ae(C) {
      var _a3, _b2, _c, _d, _e;
      const N = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], q = (((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [])[C];
      if (!q || q.length !== 4) {
        alert("La K de pa\xF1o de esta pantalla es la del Q4 (4 nudos).");
        return;
      }
      const oe = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, D = (ze, Ee = 0) => {
        var _a4, _b3;
        return ((_b3 = (_a4 = oe[ze]) == null ? void 0 : _a4.get) == null ? void 0 : _b3.call(_a4, C)) ?? Ee;
      }, de = D("elasticities"), j = D("poissonsRatios", 0.2), O = D("thicknesses");
      let W;
      try {
        W = Pa(q.map((ze) => N[ze]), de, j, O, {
          tipoPlaca: D("plateFormulations", 0),
          tipoDrill: D("drillingTypes", 12),
          gammaFac: D("drillingPenaltyScales", 0.4)
        });
      } catch (ze) {
        alert(String(ze));
        return;
      }
      ne || ee();
      const re = (_e = (_d = oe.shellModifiers) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, C), we = Array.isArray(re) && re.some((ze) => ze !== 1) ? ` \xB7 <b style="color:#f59e0b">modificadores ${re.join("/")} aplicados</b>` : "";
      ne.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 pa\xF1o ${C + 1}</b><span style="color:#9fb0c6">${W.formulacion} \xB7 \xE1rea ${W.area.toFixed(4)} m\xB2 \xB7 t = ${O} m \xB7 E = ${de} \xB7 \u03BD = ${j}${we}</span><button class="hk-k-x" style="margin-left:auto;background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="padding:4px 10px;color:#6f7d90">ejes del elemento \xB7 e1 = ${W.ex.map((ze) => ze.toFixed(3)).join(", ")} \xB7 e2 = ${W.ey.map((ze) => ze.toFixed(3)).join(", ")} \xB7 e3 = ${W.ez.map((ze) => ze.toFixed(3)).join(", ")}</div>` + xe(W.flexion, be, "#8fd3ff") + (W.membrana ? xe(W.membrana, Q, "#9be59b") : `<div style="padding:8px 10px;color:#f59e0b">La membrana de este pa\xF1o no es la ITW (drilling ${D("drillingTypes", 12)}): no se ense\xF1a una matriz que no es la suya.</div>`), ne.querySelector(".hk-k-x").addEventListener("click", () => {
        ne.hidden = true;
      }), ne.hidden = false;
    }
    window.__hekatanKPano = (C) => {
      var _a3, _b2, _c;
      const N = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], H = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], q = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, oe = (D, de = 0) => {
        var _a4, _b3;
        return ((_b3 = (_a4 = q[D]) == null ? void 0 : _a4.get) == null ? void 0 : _b3.call(_a4, C)) ?? de;
      };
      return Pa((H[C] ?? []).map((D) => N[D]), oe("elasticities"), oe("poissonsRatios", 0.2), oe("thicknesses"), {
        tipoPlaca: oe("plateFormulations", 0),
        tipoDrill: oe("drillingTypes", 12),
        gammaFac: oe("drillingPenaltyScales", 0.4)
      });
    };
    let te = null, ne = null, Y = -1;
    function ee() {
      if (ne) return;
      ne = document.createElement("div"), ne.id = "hk-klocal", ne.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);width:min(1100px,96vw);max-height:80vh;overflow:auto;z-index:9992;background:#0b0e14;border:1px solid #2f3b50;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:12px 'Segoe UI',system-ui,sans-serif;color:#c9d3e0", document.body.appendChild(ne);
      const C = document.createElement("style");
      C.textContent = "#hk-klocal[hidden]{display:none!important}", document.head.appendChild(C);
    }
    function G(C) {
      var _a3, _b2, _c, _d, _e;
      Y = C, ee();
      let N;
      try {
        N = Fa(t, C);
      } catch (W) {
        alert(String(W));
        return;
      }
      const H = (W) => Math.abs(W) < 1e-12 ? "0" : Math.abs(W) >= 1e5 || Math.abs(W) < 0.01 ? W.toExponential(4) : W.toPrecision(6), q = ((_a3 = t.elementInputs) == null ? void 0 : _a3.rawVal) ?? {}, oe = (_c = (_b2 = q.rigidOffsets) == null ? void 0 : _b2.get) == null ? void 0 : _c.call(_b2, C), D = (_e = (_d = q.localAngles) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, C), de = [
        oe && (oe[0] > 1e-12 || oe[1] > 1e-12) ? `brazos r\xEDgidos ${oe[0]}\xB7L / ${oe[1]}\xB7L (se aplican en K global: R\u1D40\xB7K\xB7R)` : "",
        D ? `ang ${D}\xB0 (gira T, no esta K)` : ""
      ].filter(Boolean).join(" \xB7 "), j = [
        "u1 i",
        "u2 i",
        "u3 i",
        "\u03B81 i",
        "\u03B82 i",
        "\u03B83 i",
        "u1 j",
        "u2 j",
        "u3 j",
        "\u03B81 j",
        "\u03B82 j",
        "\u03B83 j"
      ], O = N.K.map((W, re) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${j[re]}</th>` + W.map((we) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(we) < 1e-12 ? "#4a5568" : we < 0 ? "#ff9f9a" : "#e6edf5"}">${H(we)}</td>`).join("") + "</tr>").join("");
      ne.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${C + 1}</b><span style="color:#9fb0c6">L = ${N.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${N.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${N.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)${de ? ` \xB7 <b style="color:#f59e0b">${de}</b>` : ""}</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${j.map((W) => `<th style="color:#9fb0c6;padding:2px 6px">${W}</th>`).join("")}</tr>${O}</table></div>`, ne.querySelector(".hk-k-x").addEventListener("click", () => {
        ne.hidden = true;
      }), ne.querySelector(".hk-k-m").addEventListener("click", () => ue(Y)), ne.hidden = false;
    }
    return window.addEventListener("hk:model-selection", (C) => {
      var _a3;
      const N = (_a3 = C.detail) == null ? void 0 : _a3.ultimo;
      te || (te = document.createElement("button"), te.id = "hk-klocal-chip", te.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(te), te.addEventListener("click", () => {
        const H = Number(te.dataset.idx);
        H >= 0 && (te.dataset.tipo === "shell" ? ae : G)(H);
      })), te.hidden = true, N && (N.type === "frame" || N.type === "shell") && (te.dataset.idx = String(N.idx), te.dataset.tipo = N.type, te.textContent = N.type === "shell" ? "\u{1F4D0} Ver K local \xB7 pa\xF1o " + (N.idx + 1) : "\u{1F4D0} Ver K local \xB7 barra " + (N.idx + 1), ne && (ne.hidden = true), te.hidden = false);
    }), window.__hekatanKLocal = (C) => Fa(t, C), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = P, {
      abrir: P,
      abrirBarra: J
    };
  }
  $a = function(t, c = 8) {
    const m = document.createElement("div");
    m.id = "legend", m.style.setProperty("--legend-n", String(c)), setTimeout(() => {
      ve.derive(() => {
        ss.val, m.style.background = Hi();
      });
    });
    const g = document.createElement("div");
    g.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", m.appendChild(g), setTimeout(() => {
      ve.derive(() => {
        g.textContent = Rs.val ? `[${Rs.val}]` : "";
      });
    });
    const b = Array.from({
      length: c + 1
    }, (v, S) => S / c).reverse();
    let A, P;
    b.forEach((v, S) => {
      A = document.createElement("div"), A.id = `marker-${S}`, A.className = "marker", A.style.marginTop = S == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", P = document.createElement("p"), P.id = `marker-text-${S}`, A.append(P), m.append(A);
    });
    const k = [];
    return m.querySelectorAll("p").forEach((v) => k.push(v)), setTimeout(() => {
      ve.derive(() => {
        b.forEach((v, S) => {
          const E = k[S];
          E && (E.innerText = Bl(t.val, v).toString());
        });
      });
    }), m;
  };
  function Bl(t, c) {
    const m = zo.val;
    if (m) return La(m[0] + c * (m[1] - m[0]));
    const g = t.filter((P) => Number.isFinite(P));
    if (g.length === 0) return "0";
    const [b, A] = Bs(g);
    return La(b + c * (A - b));
  }
  function La(t) {
    if (!Number.isFinite(t)) return "\u2014";
    if (t === 0) return "0";
    const c = Math.abs(t);
    return c < 1e-3 || c >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
  }
  er = function({ mesh: t, settingsObj: c, drawingObj: m, objects3D: g, solids: b }) {
    Bi.DEFAULT_UP = new T(0, 0, 1);
    const A = document.createElement("div"), P = new Vi(), k = new Ii(45, 1, 0.1, 2 * 1e6), v = new Ti(-10, 10, 10, -10, -1e3, 2e6);
    let S = k;
    const E = new Ri({
      antialias: true
    });
    E.localClippingEnabled = true;
    const B = new Sa(k, E.domElement);
    B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.keyPanSpeed = 12, B.listenToKeyEvents(window), B.mouseButtons = {
      LEFT: null,
      MIDDLE: ka.ROTATE,
      RIGHT: ka.PAN
    }, B.touches = {
      ONE: Ho.ROTATE,
      TWO: Ho.DOLLY_PAN
    }, E.domElement.addEventListener("wheel", (Z) => {
      if (!Z.ctrlKey && Math.abs(Z.deltaX) > Math.abs(Z.deltaY) * 1.5) {
        Z.preventDefault();
        const ce = B.target, pe = new T().subVectors(k.position, ce), me = new T();
        me.crossVectors(k.up, pe).normalize();
        const $e = pe.length() * 1e-3 * B.panSpeed;
        ce.addScaledVector(me, Z.deltaX * $e), k.position.addScaledVector(me, Z.deltaX * $e), B.update();
      }
    }, {
      passive: false
    });
    const se = new So(new T(-1, 0, 0), 0), V = new So(new T(0, -1, 0), 0), ie = new So(new T(0, 0, -1), 0);
    window.__hekatanClip = window.__hekatanClip ?? {
      enableX: false,
      enableY: false,
      enableZ: false,
      posX: 0,
      posY: 0,
      posZ: 0,
      invertX: false,
      invertY: false,
      invertZ: false
    };
    function J() {
      const Z = window.__hekatanClip, ce = [];
      Z.enableX && (se.normal.set(Z.invertX ? 1 : -1, 0, 0), se.constant = Z.invertX ? -Z.posX : Z.posX, ce.push(se)), Z.enableY && (V.normal.set(0, Z.invertY ? 1 : -1, 0), V.constant = Z.invertY ? -Z.posY : Z.posY, ce.push(V)), Z.enableZ && (ie.normal.set(0, 0, Z.invertZ ? 1 : -1), ie.constant = Z.invertZ ? -Z.posZ : Z.posZ, ce.push(ie)), E.clippingPlanes = ce, P.traverse((me) => {
        const ke = me;
        if (ke.material) {
          const $e = Array.isArray(ke.material) ? ke.material : [
            ke.material
          ];
          for (const Ae of $e) Ae.clippingPlanes = ce, Ae.needsUpdate = true;
        }
      });
      const pe = window.__hekatanPanes ?? [];
      for (const me of pe) try {
        me && typeof me.refresh == "function" && me.refresh();
      } catch {
      }
      E.render(P, S);
    }
    J(), window.__hekatanClipApply = J;
    const R = Qi(c), le = ve.derive(() => Math.pow(10, R.displayScale.val / 10)), ue = Dl(t, R), xe = () => {
      const Z = [];
      return R.gridXY.rawVal && Z.push("xy"), R.gridXZ.rawVal && Z.push("xz"), R.gridYZ.rawVal && Z.push("yz"), Z;
    }, be = () => {
      const Z = R.gridStep.rawVal, ce = Math.max(Z, R.gridMajor.rawVal);
      return {
        planes: xe(),
        majorStep: ce,
        minorStep: Z
      };
    };
    let Q = $s(R.gridSize.rawVal, be());
    Q.visible = R.gridVisible.rawVal, window.__hekatanSnap2D = R.cursorSnap.rawVal;
    const ae = () => {
      const Z = Math.max(0, Math.min(1, R.gridOpacity.rawVal));
      Q.traverse((ce) => {
        const pe = ce.material;
        if (!pe || !("opacity" in pe)) return;
        const me = ce.name ?? "";
        let ke = 0.55;
        me.includes("border") ? ke = 1 : me.includes("major") && (ke = 0.95), pe.opacity = Z * ke;
      });
    };
    ae(), A.appendChild(Ji(R, t, b)), A.setAttribute("id", "viewer"), A.appendChild(E.domElement), E.setPixelRatio(window.devicePixelRatio);
    const te = Jn();
    E.setClearColor(te.background, 1);
    const ne = R.gridSize.rawVal, Y = ne * 0.5 + ne * 0.5 / Math.tan(45 * 0.5);
    k.position.set(0, 0, Y), k.up.set(0, 1, 0), B.target.set(0, 0, 0), B.minDistance = 0.1, B.maxDistance = 1e4, A.__settings = R, B.zoomSpeed = 1, B._getZoomScale = function() {
      return Math.pow(0.95, this.zoomSpeed);
    }, B.update();
    let ee = Aa(R.gridSize.rawVal, R.flipAxes.rawVal);
    P.add(Q, ee), ve.derive(() => {
      window.__hekatanGridPlaneXY = R.gridXY.val, window.__hekatanGridPlaneXZ = R.gridXZ.val, window.__hekatanGridPlaneYZ = R.gridYZ.val;
    });
    let G = true;
    ve.derive(() => {
      const Z = R.gridVisible.val;
      if (G) {
        G = false;
        return;
      }
      Q.visible = Z, j();
    });
    let C = true;
    ve.derive(() => {
      if (R.gridOpacity.val, C) {
        C = false;
        return;
      }
      ae(), j();
    }), ve.derive(() => {
      const Z = R.cursorSnap.val;
      window.__hekatanSnap2D = Z;
    });
    let N = true;
    ve.derive(() => {
      var _a2, _b, _c;
      const Z = R.gridSize.val, ce = R.flipAxes.val;
      if (R.gridXY.val, R.gridXZ.val, R.gridYZ.val, R.gridStep.val, R.gridMajor.val, N) {
        N = false;
        return;
      }
      P.remove(Q), (_a2 = Q.traverse) == null ? void 0 : _a2.call(Q, ($e) => {
        var _a3, _b2, _c2, _d;
        (_b2 = (_a3 = $e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = $e.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
      }), Q = $s(Z, be()), Q.visible = R.gridVisible.rawVal, P.add(Q), ae(), P.remove(ee), ee.traverse(($e) => {
        var _a3, _b2, _c2, _d;
        (_b2 = (_a3 = $e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = $e.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
      }), ee = Aa(Z, ce), P.add(ee);
      const pe = Z * 0.5 + Z * 0.5 / Math.tan(45 * 0.5);
      k.position.distanceTo(B.target);
      const me = Math.abs(k.position.x) < 0.1 && Math.abs(k.position.y) < 0.1 && k.position.z > 0;
      (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (me ? k.position.set(0, 0, pe) : k.position.set(0.5 * Z, -pe, 0.5 * Z), B.target.set(0, 0, 0)), B.minDistance = Math.max(0.05, Z * 0.01), B.maxDistance = Math.max(50, Z * 50), B.update(), j();
    }), new ResizeObserver((Z) => {
      var _a2, _b;
      for (const ce of Z) {
        const pe = (_a2 = ce.target) == null ? void 0 : _a2.clientWidth, me = (_b = ce.target) == null ? void 0 : _b.clientHeight;
        if (pe === 0 || me === 0) continue;
        const $e = (q ? pe / 2 : pe) / me;
        k.aspect = $e, k.updateProjectionMatrix();
        const Ae = v.top;
        if (v.left = -Ae * $e, v.right = Ae * $e, v.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = $e, oe.updateProjectionMatrix();
        else if (oe && oe.isOrthographicCamera) {
          const Le = oe, je = Le.top;
          Le.left = -je * $e, Le.right = je * $e, Le.updateProjectionMatrix();
        }
        E.setSize(pe, me), j();
      }
    }).observe(A), B.addEventListener("change", j), ve.derive(() => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
      (_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, R.displayScale.val, R.nodes.val, R.elements.val, (_g = R.edges) == null ? void 0 : _g.val, R.elemColumns.val, R.elemBeams.val, R.nodesIndexes.val, R.elementsIndexes.val, R.orientations.val, R.sections.val, R.secColumns.val, R.secBeams.val, R.secFloor.val, R.supports.val, R.loads.val, R.deformedShape.val, R.nodeResults.val, R.frameResults.val, R.shellResults.val, (_h = R.solidResults) == null ? void 0 : _h.val, (_i = R.extruded) == null ? void 0 : _i.val, setTimeout(j);
    });
    let q = false, oe = null, D = null, de = false;
    function j() {
      const Z = A.clientWidth || 1, ce = A.clientHeight || 1;
      if (!q || !oe) {
        E.setScissorTest(false), E.setViewport(0, 0, Z, ce), E.render(P, S);
        return;
      }
      const pe = Z / 2;
      E.setScissorTest(true), E.setViewport(0, 0, pe, ce), E.setScissor(0, 0, pe, ce), E.render(P, S), E.setViewport(pe, 0, pe, ce), E.setScissor(pe, 0, pe, ce), E.render(P, oe), E.setScissorTest(false);
    }
    function O(Z) {
      S = Z, B.object = Z, B.update(), j();
    }
    function W(Z, ce) {
      q = Z, ce && (oe = ce);
      const pe = A.clientWidth || 1, me = A.clientHeight || 1, $e = (Z ? pe / 2 : pe) / me;
      k.isPerspectiveCamera && (k.aspect = $e, k.updateProjectionMatrix());
      const Ae = v.top;
      if (v.left = -Ae * $e, v.right = Ae * $e, v.updateProjectionMatrix(), Z && oe) {
        if (D ? (D.object = oe, D.update()) : (D = new Sa(oe, E.domElement), D.enableDamping = true, D.dampingFactor = 0.1, D.screenSpacePanning = true, D.zoomSpeed = 0.8, D.panSpeed = 1.2, D.rotateSpeed = 0.9, D.touches = {
          ONE: Ho.ROTATE,
          TWO: Ho.DOLLY_PAN
        }, D.target.copy(B.target), D.addEventListener("change", j), D.enabled = false), !de) {
          const Le = (je) => {
            if (!q || !D) return;
            const We = E.domElement.getBoundingClientRect(), Ve = je.clientX - We.left, et = We.width / 2, Pe = Ve >= et;
            B.enabled = !Pe, D.enabled = Pe;
          };
          E.domElement.addEventListener("pointerdown", Le, true), E.domElement.addEventListener("wheel", Le, {
            capture: true,
            passive: true
          }), de = true;
        }
      } else Z || (B.enabled = true, D && (D.enabled = false));
      A.__splitMode = Z, window.__hekatanSplitMode = Z, window.__hekatanSplitCamera = Z ? oe : null, j();
    }
    if (t) {
      P.add(Oi(R, ue, le), Di(t, R, ue), tl(R, ue, le), nl(t, R, ue, le), ji(t, R, ue, le), el(t, R, ue, le), al(t, R, ue, le), ll(t, R, ue, le), ul(t, R, ue), ml(t, R, ue, le), fl(t, R, ue, le)), window.__hekatanDiagrama2D || (Rl(t, R), E.domElement.addEventListener("dblclick", () => {
        var _a2;
        const Le = (_a2 = R.frameResults) == null ? void 0 : _a2.rawVal;
        !Le || Le === "none" || !(window.__hekatanModelSelection ?? []).some((We) => We.type === "frame") || setTimeout(() => {
          var _a3;
          return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
        }, 60);
      }));
      const Z = El({
        scene: P,
        rendererElm: E.domElement,
        getActiveCamera: () => S,
        derivedNodes: ue,
        derivedDisplayScale: le,
        mesh: t,
        settings: R,
        render: j
      });
      P.add(Z);
      const ce = ql(t, R), pe = xl(t, R, ue, ce), me = $a(ce);
      P.add(pe), A.appendChild(me);
      const ke = _l(t, R, ue);
      P.add(ke);
      const $e = ke.__colorMapValues, Ae = $a($e);
      Ae.id = "frame-legend", A.appendChild(Ae), ve.derive(() => {
        var _a2;
        const Le = R.shellResults.val != "none", je = (((_a2 = R.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", We = Le || je, Ve = R.frameResults.val.startsWith("contour:"), et = ce.val.some((Pe) => Number.isFinite(Pe));
        me.hidden = !We || !et, pe.visible = We, Ae.hidden = !Ve;
      });
    }
    if (b) {
      const Z = new Ra(16777215, 0.5);
      P.add(Z);
      const ce = new ts(16777215, 0.5);
      ce.position.set(30, 25, -10), ce.shadow.mapSize.width = 1024, ce.shadow.mapSize.height = 1024, P.add(ce);
      const pe = 10;
      ce.shadow.camera.left = -pe, ce.shadow.camera.right = pe, ce.shadow.camera.top = pe, ce.shadow.camera.bottom = -pe, ce.shadow.camera.far = 1e3;
      const me = new ts(16777215, 0.5);
      me.color.setHSL(11, 43, 96), me.position.set(-10, 0, 30), P.add(me), ve.derive(() => {
        (b == null ? void 0 : b.val.length) && (P.remove(...b.oldVal), P.add(...b.rawVal), j());
      }), ve.derive(() => {
        b.rawVal.forEach((ke) => ke.visible = R.solids.val), j();
      });
    }
    if (g) {
      const Z = [], ce = (me) => {
        var _a2;
        return ((_a2 = me == null ? void 0 : me.userData) == null ? void 0 : _a2.isCota) ? R.showCotas.val : R.custom3D.val;
      }, pe = () => {
        for (const me of Z) me.visible = ce(me);
        j();
      };
      ve.derive(() => {
        const me = g.val;
        Z.length && (P.remove(...Z), Z.length = 0), me.length && (P.add(...me), Z.push(...me), pe(), E.clippingPlanes.length && J()), j();
      }), ve.derive(() => {
        R.custom3D.val, pe();
      }), ve.derive(() => {
        R.showCotas.val, pe();
      });
    }
    m && wl({
      drawingObj: m,
      gridObj: Q,
      scene: P,
      getActiveCamera: () => S,
      controls: B,
      gridSize: ne,
      derivedDisplayScale: le,
      rendererElm: E.domElement,
      viewerRender: j
    }), Ia((Z, ce) => {
      var _a2;
      E.setClearColor(ce.background, 1), P.remove(Q), (_a2 = Q.traverse) == null ? void 0 : _a2.call(Q, (pe) => {
        var _a3, _b, _c, _d;
        (_b = (_a3 = pe.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = pe.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }), Q = $s(R.gridSize.rawVal, {
        planes: xe()
      }), P.add(Q), A.style.setProperty("--awatif-legend-color", ce.legendMarker), j();
    });
    const re = {
      scene: P,
      perspCamera: k,
      orthoCamera: v,
      get camera() {
        return S;
      },
      controls: B,
      renderer: E,
      rendererElm: E.domElement,
      render: j,
      setActiveCamera: O,
      setSplitMode: W,
      get splitMode() {
        return q;
      },
      get splitCamera() {
        return oe;
      },
      settings: R
    };
    A.__ctx = re;
    const we = document.createElement("div");
    we.id = "hk-nav-camara", we.style.cssText = [
      "position:absolute",
      "right:8px",
      "bottom:8px",
      "z-index:50",
      "display:grid",
      "grid-template-columns:repeat(3, 32px)",
      "gap:2px",
      "user-select:none",
      "pointer-events:auto"
    ].join(";");
    const ze = (Z, ce, pe) => {
      const me = document.createElement("button");
      return me.textContent = Z, me.title = ce, me.style.cssText = [
        "width:32px",
        "height:32px",
        "background:rgba(40,40,40,0.85)",
        "color:#fff",
        "border:1px solid rgba(255,255,255,0.15)",
        "border-radius:4px",
        "cursor:pointer",
        "font-size:14px",
        "font-family:system-ui"
      ].join(";"), me.onmouseenter = () => {
        me.style.background = "rgba(70,70,70,0.9)";
      }, me.onmouseleave = () => {
        me.style.background = "rgba(40,40,40,0.85)";
      }, me.onclick = (ke) => {
        ke.preventDefault(), pe();
      }, me;
    }, Ee = (Z, ce) => {
      const pe = B.target, me = new T().subVectors(S.position, pe), ke = me.length(), $e = new T(), Ae = new T();
      $e.crossVectors(S.up, me).normalize(), Ae.copy(S.up).normalize();
      const Le = ke * 0.05;
      pe.addScaledVector($e, -Z * Le), pe.addScaledVector(Ae, ce * Le), S.position.addScaledVector($e, -Z * Le), S.position.addScaledVector(Ae, ce * Le), B.update(), j();
    }, tt = (Z) => {
      const ce = new T().subVectors(S.position, B.target);
      ce.multiplyScalar(Z), S.position.copy(B.target).add(ce), B.update(), j();
    }, at = () => {
      const Z = document.createElement("div");
      return Z.style.cssText = "width:32px;height:32px;", Z;
    };
    return we.append(at()), we.append(ze("\u2191", "Pan arriba", () => Ee(0, 1))), we.append(ze("\u2295", "Zoom in", () => tt(0.85))), we.append(ze("\u2190", "Pan izquierda", () => Ee(-1, 0))), we.append(ze("\u2302", "Reset vista", () => {
      B.reset(), j();
    })), we.append(ze("\u2192", "Pan derecha", () => Ee(1, 0))), we.append(ze("\u2296", "Zoom out", () => tt(1.18))), we.append(ze("\u2193", "Pan abajo", () => Ee(0, -1))), we.append(at()), getComputedStyle(A).position === "static" && (A.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && A.appendChild(we), A;
  };
  function Dl(t, c) {
    return ve.derive(() => {
      var _a2, _b, _c, _d;
      if (!c.deformedShape.val) return ((_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val) ?? [];
      const m = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], g = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
      if (!g || m.length === 0) return m;
      const b = c.deformScale.val, A = c.deformScale.val * c.deformScaleZ.val, P = Number.isFinite(b) ? b : 1, k = Number.isFinite(A) ? A : 1;
      return m.map((v, S) => {
        var _a3;
        const E = ((_a3 = g.get(S)) == null ? void 0 : _a3.slice(0, 3)) ?? [
          0,
          0,
          0
        ], B = Number.isFinite(E[0]) ? E[0] : 0, se = Number.isFinite(E[1]) ? E[1] : 0, V = Number.isFinite(E[2]) ? E[2] : 0;
        return [
          v[0] + B * P,
          v[1] + se * P,
          v[2] + V * k
        ];
      });
    });
  }
  let zo, Rs, Ul, Va, Zl;
  zo = ve.state(null);
  Rs = ve.state("");
  Nl = ve.state("kN");
  Yl = ve.state("mm");
  Xl = ve.state("kN/m\xB2");
  Ul = {
    kN: 1,
    tonf: 9.80665,
    kip: 4.4482216
  };
  Va = {
    mm: 1e3,
    cm: 100,
    m: 1,
    in: 39.3700787402,
    ft: 3.280839895
  };
  Zl = {
    "kN/m\xB2": 1,
    kPa: 1,
    MPa: 1 / 1e3,
    GPa: 1 / 1e6,
    "kgf/cm\xB2": 1 / 98.0665,
    "tonf/m\xB2": 1 / 9.80665,
    psi: 1 / 6.89476,
    ksi: 1 / 6894.76
  };
  function ql(t, c) {
    const m = ve.state([]);
    let g;
    return ((b) => {
      b.bendingXX = "bendingXX", b.bendingYY = "bendingYY", b.bendingXY = "bendingXY", b.membraneXX = "membraneXX", b.membraneYY = "membraneYY", b.membraneXY = "membraneXY", b.tranverseShearX = "tranverseShearX", b.tranverseShearY = "tranverseShearY", b.membranePrincipalMax = "membranePrincipalMax", b.membranePrincipalMin = "membranePrincipalMin", b.bendingPrincipalMax = "bendingPrincipalMax", b.bendingPrincipalMin = "bendingPrincipalMin", b.transverseShearMax = "transverseShearMax", b.vonMises = "vonMises", b.pressure = "pressure", b.displacementX = "displacementX", b.displacementY = "displacementY", b.displacementZ = "displacementZ";
    })(g || (g = {})), ve.derive(() => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l2, _m, _n, _o2, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
      const b = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), ie = (Z, ce) => {
        Z == null ? void 0 : Z.forEach((pe, me) => {
          const ke = t.elements.val[me];
          if (ke) for (let $e = 0; $e < ke.length; $e++) ce.set(ke[$e], [
            pe[$e] ?? pe[0]
          ]);
        });
      };
      ie((_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, b), ie((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, A), ie((_f = (_e = t.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, P), ie((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, k), ie((_j = (_i = t.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, v), ie((_l2 = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l2.membraneXY, S), ie((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, E), ie((_p = (_o2 = t.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, B), ie((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, se), ie((_t = (_s = t.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t.pressure, V);
      const J = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), be = (Z, ce, pe, me, ke) => {
        Z.forEach(($e, Ae) => {
          var _a3, _b2;
          const Le = $e[0] ?? 0, je = ((_a3 = ce.get(Ae)) == null ? void 0 : _a3[0]) ?? 0, We = ((_b2 = pe.get(Ae)) == null ? void 0 : _b2[0]) ?? 0, Ve = (Le + je) / 2, et = Math.hypot((Le - je) / 2, We);
          me.set(Ae, [
            Ve + et
          ]), ke.set(Ae, [
            Ve - et
          ]);
        });
      };
      be(k, v, S, J, R), be(b, A, P, le, ue), E.forEach((Z, ce) => {
        var _a3;
        xe.set(ce, [
          Math.hypot(Z[0] ?? 0, ((_a3 = B.get(ce)) == null ? void 0 : _a3[0]) ?? 0)
        ]);
      });
      const Q = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, ae = (_w = c.solidResults) == null ? void 0 : _w.val, ne = ae && ae !== "none" ? ae : c.shellResults.val, Y = Q == null ? void 0 : Q[ne], ee = {
        bendingXX: [
          b,
          0
        ],
        bendingYY: [
          A,
          0
        ],
        bendingXY: [
          P,
          0
        ],
        membraneXX: [
          k,
          0
        ],
        membraneYY: [
          v,
          0
        ],
        membraneXY: [
          S,
          0
        ],
        tranverseShearX: [
          E,
          0
        ],
        tranverseShearY: [
          B,
          0
        ],
        membranePrincipalMax: [
          J,
          0
        ],
        membranePrincipalMin: [
          R,
          0
        ],
        bendingPrincipalMax: [
          le,
          0
        ],
        bendingPrincipalMin: [
          ue,
          0
        ],
        transverseShearMax: [
          xe,
          0
        ],
        vonMises: [
          se,
          0
        ],
        pressure: [
          V,
          0
        ],
        displacementX: [
          (_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations,
          0
        ],
        displacementY: [
          (_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations,
          1
        ],
        displacementZ: [
          (_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations,
          2
        ]
      }, G = c.shellResults.val, C = Nl.val, N = Yl.val, H = G === "displacementX" || G === "displacementY" || G === "displacementZ", q = G === "bendingXX" || G === "bendingYY" || G === "bendingXY" || G === "bendingPrincipalMax" || G === "bendingPrincipalMin", oe = G === "membraneXX" || G === "membraneYY" || G === "membraneXY" || G === "membranePrincipalMax" || G === "membranePrincipalMin", D = G === "vonMises" || G === "pressure", de = G === "tranverseShearX" || G === "tranverseShearY" || G === "transverseShearMax", j = (_D = c.solidResults) == null ? void 0 : _D.val, O = j === "vonMises" || j === "sigmaXX" || j === "sigmaYY" || j === "sigmaZZ" || j === "tauXY" || j === "tauYZ" || j === "tauXZ", W = j === "ux" || j === "uy" || j === "uz", re = Xl.val, we = O ? Zl[re] : W || H ? Va[N] : q || oe || D || de ? 1 / Ul[C] : 1, ze = O ? re : W || H ? N : q ? `${C}\xB7m/m` : oe ? `${C}/m\xB2` : D ? `${C}/m\xB2` : de ? `${C}/m` : "";
      Rs.val = ze, zo.val = Array.isArray(Y) && Y.length === 2 ? [
        Y[0] * we,
        Y[1] * we
      ] : null;
      const Ee = Za.val, at = j && j !== "none" ? [
        se,
        0
      ] : ee[G], Ue = [];
      if (t.nodes.val.forEach((Z, ce) => {
        const pe = at;
        if (!pe || !pe[0] || typeof pe[0].has != "function") return;
        if (!pe[0].has(ce)) {
          Ue.push(Number.NaN);
          return;
        }
        const me = pe[0].get(ce), ke = me ? me[pe[1]] ?? 0 : 0;
        Ue.push(ke * we);
      }), !zo.val && Ee !== "auto") {
        const Z = t.nodes.val, ce = /* @__PURE__ */ new Set(), pe = (ke, $e) => {
          var _a3;
          const Ae = (_a3 = Z[ke[0]]) == null ? void 0 : _a3[$e];
          return ke.every((Le) => {
            var _a4;
            return Math.abs((((_a4 = Z[Le]) == null ? void 0 : _a4[$e]) ?? NaN) - Ae) < 1e-6;
          });
        };
        for (const ke of t.elements.val) {
          if (ke.length !== 4) continue;
          const $e = pe(ke, 2), Ae = !$e && pe(ke, 0), Le = !$e && pe(ke, 1);
          if (Ee === "losas" ? $e : Ee === "muros" ? Ae || Le : Ee === "murosX" ? Ae : Ee === "murosY" ? Le : false) for (const Ve of ke) ce.add(Ve);
        }
        const me = [];
        for (const ke of ce) {
          const $e = Ue[ke];
          Number.isFinite($e) && me.push($e);
        }
        me.length && (zo.val = Bs(me));
      }
      m.val = Ue;
    }), m;
  }
});
export {
  __tla,
  Wi as a,
  $a as b,
  Nl as c,
  Ki as d,
  qi as e,
  Yl as f,
  er as g,
  Xl as h,
  jl as i,
  Ql as j,
  Pa as k,
  Ol as l
};
