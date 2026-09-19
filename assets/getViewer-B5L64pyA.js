import { u as hn, a6 as Oo, q as Ri, v as ve, a7 as Ti, D as It, M as dt, B as De, F as Rt, a8 as Bi, z as bt, a9 as Di, aa as Ni, h as _s, ab as ks, r as to, ac as oa, ad as aa, a4 as Ys, _ as pt, b as mt, L as rn, y as Xs, c as Us, ae as Yi, f as wt, V as R, $ as qn, af as $a, K as la, d as Ft, a as La, A as Zs, t as ia, J as Xi, H as Ao, I as Ui, ag as sa, w as Va, o as Zi, N as Un, a2 as ho, E as Ss, S as eo, m as Po, ah as In, g as Ps, i as zs, j as As, P as Co, C as Cs, W as qi, X as Ki, Y as Gi, Z as Hi, l as Es, T as jo, U as Wi } from "./theme-C-zoknmI.js";
import { T as Bt, O as Fs } from "./Text-Cehu0nom.js";
import { P as qs } from "./tweakpane-BXg6ZhiP.js";
import { e as Ji } from "./aiAgent-VzHiuQev.js";
import { __tla as __tla_0 } from "./didacticCpp-Czy7NlhT.js";
let ir, Bs, Qr, or, nr, Or, ul, jr, dl, ll, $s, cl;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function Ks(t, c, m, g, v, A = 1e3) {
    const z = m * v * v * v / (12 * (1 - g * g)), S = [
      [
        z,
        z * g,
        0
      ],
      [
        z * g,
        z,
        0
      ],
      [
        0,
        0,
        z * (1 - g) / 2
      ]
    ], M = 5 / 6 * m * v / (2 * (1 + g)), P = S[0][0] + S[1][1] + S[2][2], F = A, B = [], ae = [], V = [];
    for (let O = 0; O < 4; O++) {
      const W = (O + 1) % 4, le = t[W] - t[O], we = c[W] - c[O], ze = Math.hypot(le, we);
      V.push(ze), B.push(ze > 0 ? le / ze : 1), ae.push(ze > 0 ? we / ze : 0);
    }
    const ie = () => new Array(22).fill(0), J = [
      ie(),
      ie(),
      ie(),
      ie()
    ];
    for (let O = 0; O < 4; O++) {
      const W = (O + 1) % 4;
      J[O][3 * W] += 1 / V[O], J[O][3 * O] -= 1 / V[O], J[O][3 * O + 1] -= ae[O] / 2, J[O][3 * W + 1] -= ae[O] / 2, J[O][3 * O + 2] += B[O] / 2, J[O][3 * W + 2] += B[O] / 2, J[O][12 + 2 * O] -= 2 / 3 * ae[O], J[O][13 + 2 * O] += 2 / 3 * B[O];
    }
    const T = (O, W) => O.map((le) => le * W), re = (O, W) => O.map((le, we) => le + W[we]), ue = T(J[0], V[0] / 2), xe = T(J[2], -V[2] / 2), Me = T(J[1], V[1] / 2), Q = T(J[3], -V[3] / 2), se = T(re(ue, xe), 0.5), te = T(re(xe, T(ue, -1)), 0.5), ne = T(re(Q, Me), 0.5), Y = T(re(Me, T(Q, -1)), 0.5), ee = T(re(te, Y), 0.5), G = (O, W) => {
      const le = [
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
      ], Fe = [
        -(1 - O * O) / 2,
        -W * (1 + O),
        (1 - O * O) / 2,
        -W * (1 - O)
      ];
      let tt = 0, st = 0, Ue = 0, Z = 0;
      for (let Pe = 0; Pe < 4; Pe++) tt += le[Pe] * t[Pe], st += le[Pe] * c[Pe], Ue += we[Pe] * t[Pe], Z += we[Pe] * c[Pe];
      const ce = tt * Z - st * Ue, fe = [
        [
          Z / ce,
          -st / ce
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
      ], ke = ie(), $e = (Pe, ot, Ye, ut, Oe) => {
        me[0][Pe] += Ye * ut, me[1][Pe] -= ot * Oe, me[2][Pe] += Ye * Oe - ot * ut, ke[Pe] += ot * ut + Ye * Oe;
      };
      for (let Pe = 0; Pe < 4; Pe++) {
        const ot = fe[0][0] * le[Pe] + fe[0][1] * we[Pe], Ye = fe[1][0] * le[Pe] + fe[1][1] * we[Pe];
        $e(3 * Pe + 1, 1, 0, ot, Ye), $e(3 * Pe + 2, 0, 1, ot, Ye);
      }
      for (let Pe = 0; Pe < 4; Pe++) {
        const ot = fe[0][0] * ze[Pe] + fe[0][1] * Fe[Pe], Ye = fe[1][0] * ze[Pe] + fe[1][1] * Fe[Pe];
        $e(12 + 2 * Pe, 1, 0, ot, Ye), $e(13 + 2 * Pe, 0, 1, ot, Ye);
      }
      const Ae = -2 * O * (1 - W * W), Le = -2 * W * (1 - O * O), je = fe[0][0] * Ae + fe[0][1] * Le, We = fe[1][0] * Ae + fe[1][1] * Le;
      $e(20, 1, 0, je, We), $e(21, 0, 1, je, We);
      const Ve = re(se, T(ee, W)), et = re(ne, T(ee, O));
      for (let Pe = 0; Pe < 22; Pe++) me[3][Pe] = fe[0][0] * Ve[Pe] + fe[0][1] * et[Pe], me[4][Pe] = fe[1][0] * Ve[Pe] + fe[1][1] * et[Pe];
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
    ], oe = H.map(([O, W], le) => {
      const we = G(O, W);
      return {
        B: we.B,
        v: we.v,
        w: q[le] * we.dJ
      };
    }), D = oe.reduce((O, W) => O + W.w, 0), de = [
      ie(),
      ie(),
      ie()
    ];
    for (const O of oe) for (let W = 0; W < 3; W++) for (let le = 12; le < 22; le++) de[W][le] += O.B[W][le] * O.w / D;
    const j = Array.from({
      length: 22
    }, () => ie());
    for (const O of oe) {
      for (let le = 0; le < 3; le++) for (let we = 12; we < 22; we++) O.B[le][we] -= de[le][we];
      const W = [
        ie(),
        ie(),
        ie(),
        ie(),
        ie()
      ];
      for (let le = 0; le < 22; le++) {
        for (let we = 0; we < 3; we++) W[we][le] = S[we][0] * O.B[0][le] + S[we][1] * O.B[1][le] + S[we][2] * O.B[2][le];
        W[3][le] = M * O.B[3][le], W[4][le] = M * O.B[4][le];
      }
      for (let le = 0; le < 22; le++) for (let we = 0; we < 22; we++) {
        let ze = 0;
        for (let Fe = 0; Fe < 5; Fe++) ze += O.B[Fe][le] * W[Fe][we];
        j[le][we] += (ze + F * P * O.v[le] * O.v[we]) * O.w;
      }
    }
    return {
      K: j,
      media: de,
      Ben: G,
      Db: S,
      z22: ie
    };
  }
  ll = function(t, c, m, g, v, A, z = 1e3) {
    const { K: S, media: M, Ben: P, Db: F, z22: B } = Ks(t, c, g, v, A, z);
    let ae = 0;
    for (const Q of S) for (const se of Q) ae = Math.max(ae, Math.abs(se));
    const V = S.map((Q) => Q.slice()), ie = [];
    for (let Q = 12; Q < 22; Q++) {
      const se = V[Q][Q];
      if (Math.abs(se) <= 1e-14 * ae) continue;
      ie.push(Q);
      const te = V[Q].slice(), ne = V.map((Y) => Y[Q]);
      for (let Y = 0; Y < 22; Y++) for (let ee = 0; ee < 22; ee++) V[Y][ee] -= ne[Y] * te[ee] / se;
      for (let Y = 0; Y < 22; Y++) V[Q][Y] = 0, V[Y][Q] = 0;
    }
    const J = ie.length, T = ie.map((Q) => ie.map((se) => S[Q][se])), re = ie.map((Q) => {
      let se = 0;
      for (let te = 0; te < 12; te++) se -= S[Q][te] * m[te];
      return se;
    });
    for (let Q = 0; Q < J; Q++) {
      let se = Q;
      for (let te = Q + 1; te < J; te++) Math.abs(T[te][Q]) > Math.abs(T[se][Q]) && (se = te);
      if ([T[Q], T[se]] = [
        T[se],
        T[Q]
      ], [re[Q], re[se]] = [
        re[se],
        re[Q]
      ], !(Math.abs(T[Q][Q]) < 1e-300)) for (let te = Q + 1; te < J; te++) {
        const ne = T[te][Q] / T[Q][Q];
        for (let Y = Q; Y < J; Y++) T[te][Y] -= ne * T[Q][Y];
        re[te] -= ne * re[Q];
      }
    }
    const ue = new Array(J).fill(0);
    for (let Q = J - 1; Q >= 0; Q--) {
      let se = re[Q];
      for (let te = Q + 1; te < J; te++) se -= T[Q][te] * ue[te];
      ue[Q] = Math.abs(T[Q][Q]) < 1e-300 ? 0 : se / T[Q][Q];
    }
    const xe = B();
    for (let Q = 0; Q < 12; Q++) xe[Q] = m[Q];
    ie.forEach((Q, se) => {
      xe[Q] = ue[se];
    });
    const Me = (Q, se) => {
      const { B: te } = P(Q, se);
      for (let Y = 0; Y < 3; Y++) for (let ee = 12; ee < 22; ee++) te[Y][ee] -= M[Y][ee];
      const ne = [
        0,
        1,
        2
      ].map((Y) => te[Y].reduce((ee, G, C) => ee + G * xe[C], 0));
      return [
        0,
        1,
        2
      ].map((Y) => F[Y][0] * ne[0] + F[Y][1] * ne[1] + F[Y][2] * ne[2]);
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
    ].map(([Q, se]) => Me(Q, se));
  };
  function Qi(t, c, m, g, v, A = 1e3) {
    const { K: z } = Ks(t, c, m, g, v, A);
    let S = 0;
    for (const P of z) for (const F of P) S = Math.max(S, Math.abs(F));
    const M = z.map((P) => P.slice());
    for (let P = 12; P < 22; P++) {
      const F = M[P][P];
      if (Math.abs(F) <= 1e-14 * S) continue;
      const B = M[P].slice(), ae = M.map((V) => V[P]);
      for (let V = 0; V < 22; V++) for (let ie = 0; ie < 22; ie++) M[V][ie] -= ae[V] * B[ie] / F;
      for (let V = 0; V < 22; V++) M[P][V] = 0, M[V][P] = 0;
    }
    return M.slice(0, 12).map((P) => P.slice(0, 12));
  }
  function Oi(t, c) {
    const m = new Array(8).fill(0), g = new Array(8).fill(0), v = new Array(8).fill(0), A = [
      -1,
      1,
      1,
      -1
    ], z = [
      -1,
      -1,
      1,
      1
    ];
    for (let S = 0; S < 4; S++) {
      const M = A[S] * t, P = z[S] * c;
      m[S] = 0.25 * (1 + M) * (1 + P) * (M + P - 1), g[S] = 0.25 * A[S] * (1 + P) * (2 * M + P), v[S] = 0.25 * z[S] * (1 + M) * (M + 2 * P);
    }
    return m[4] = 0.5 * (1 - t * t) * (1 - c), g[4] = -t * (1 - c), v[4] = -0.5 * (1 - t * t), m[5] = 0.5 * (1 + t) * (1 - c * c), g[5] = 0.5 * (1 - c * c), v[5] = -c * (1 + t), m[6] = 0.5 * (1 - t * t) * (1 + c), g[6] = -t * (1 + c), v[6] = 0.5 * (1 - t * t), m[7] = 0.5 * (1 - t) * (1 - c * c), g[7] = -0.5 * (1 - c * c), v[7] = -c * (1 - t), {
      N: m,
      dNxi: g,
      dNet: v
    };
  }
  function Gs(t, c, m, g) {
    const v = [], A = [], z = [], S = [], M = [];
    for (let G = 0; G < 4; G++) {
      const C = G, N = (G + 1) % 4, H = t[C] - t[N], q = c[C] - c[N], oe = H * H + q * q;
      v.push(-H / oe), A.push(0.75 * H * q / oe), z.push((0.25 * H * H - 0.5 * q * q) / oe), S.push(-q / oe), M.push((0.25 * q * q - 0.5 * H * H) / oe);
    }
    const { dNxi: P, dNet: F } = Oi(m, g), B = [
      -(1 - g) / 4,
      (1 - g) / 4,
      (1 + g) / 4,
      -(1 + g) / 4
    ], ae = [
      -(1 - m) / 4,
      -(1 + m) / 4,
      (1 + m) / 4,
      (1 - m) / 4
    ];
    let V = 0, ie = 0, J = 0, T = 0;
    for (let G = 0; G < 4; G++) V += B[G] * t[G], ie += B[G] * c[G], J += ae[G] * t[G], T += ae[G] * c[G];
    const re = V * T - ie * J, ue = T / re, xe = -ie / re, Me = -J / re, Q = V / re, se = new Array(12).fill(0), te = new Array(12).fill(0), ne = new Array(12).fill(0), Y = new Array(12).fill(0);
    for (let G = 0; G < 4; G++) {
      const C = (G + 3) % 4, N = G, H = 4 + C, q = 4 + N, oe = 1.5 * (v[N] * P[q] - v[C] * P[H]), D = 1.5 * (v[N] * F[q] - v[C] * F[H]), de = A[N] * P[q] + A[C] * P[H], j = A[N] * F[q] + A[C] * F[H], O = P[G] - z[N] * P[q] - z[C] * P[H], W = F[G] - z[N] * F[q] - z[C] * F[H];
      se[3 * G] = oe, te[3 * G] = D, se[3 * G + 1] = de, te[3 * G + 1] = j, se[3 * G + 2] = O, te[3 * G + 2] = W;
      const le = 1.5 * (S[N] * P[q] - S[C] * P[H]), we = 1.5 * (S[N] * F[q] - S[C] * F[H]), ze = -P[G] + M[N] * P[q] + M[C] * P[H], Fe = -F[G] + M[N] * F[q] + M[C] * F[H];
      ne[3 * G] = le, Y[3 * G] = we, ne[3 * G + 1] = ze, Y[3 * G + 1] = Fe, ne[3 * G + 2] = -de, Y[3 * G + 2] = -j;
    }
    const ee = [
      new Array(12).fill(0),
      new Array(12).fill(0),
      new Array(12).fill(0)
    ];
    for (let G = 0; G < 12; G++) {
      const C = ue * se[G] + xe * te[G], N = Me * se[G] + Q * te[G], H = ue * ne[G] + xe * Y[G], q = Me * ne[G] + Q * Y[G];
      ee[0][G] = C, ee[1][G] = q, ee[2][G] = N + H;
    }
    return ee;
  }
  cl = function(t, c, m, g, v, A, z = "esquinas") {
    const S = g * A * A * A / (12 * (1 - v * v)), M = [
      [
        S,
        S * v,
        0
      ],
      [
        S * v,
        S,
        0
      ],
      [
        0,
        0,
        S * (1 - v) / 2
      ]
    ], P = (V, ie) => {
      const J = Gs(t, c, V, ie), T = [
        0,
        1,
        2
      ].map((re) => J[re].reduce((ue, xe, Me) => ue + xe * m[Me], 0));
      return [
        0,
        1,
        2
      ].map((re) => M[re][0] * T[0] + M[re][1] * T[1] + M[re][2] * T[2]);
    }, F = [
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
    if (z === "esquinas") return F.map(([V, ie]) => P(V, ie));
    const B = 1 / Math.sqrt(3), ae = F.map(([V, ie]) => P(V * B, ie * B));
    return F.map(([V, ie]) => {
      const J = V * Math.sqrt(3), T = ie * Math.sqrt(3), re = F.map(([ue, xe]) => (1 + ue * J) * (1 + xe * T) / 4);
      return [
        0,
        1,
        2
      ].map((ue) => re.reduce((xe, Me, Q) => xe + Me * ae[Q][ue], 0));
    });
  };
  function ji(t, c) {
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
  function er(t, c, m, g) {
    let v = 0, A = 0, z = 0, S = 0;
    for (let F = 0; F < 4; F++) v += m[F] * t[F], A += m[F] * c[F], z += g[F] * t[F], S += g[F] * c[F];
    let M = v * S - A * z;
    Math.abs(M) < 1e-15 && (M = 1e-15);
    const P = 1 / M;
    return {
      det: M,
      Ji: [
        [
          S * P,
          -A * P
        ],
        [
          -z * P,
          v * P
        ]
      ]
    };
  }
  function Hs(t, c, m, g, v, A = {}) {
    const z = A.tipo ?? 12, S = A.gammaFac ?? 0.4, M = A.mod ?? null;
    let P, F, B;
    if (z === 12) P = 2, F = true, B = 2e-4;
    else if (z === 3) P = 3, F = false, B = 0;
    else return null;
    const ae = m / (1 - g * g), V = [
      [
        ae,
        ae * g,
        0
      ],
      [
        ae * g,
        ae,
        0
      ],
      [
        0,
        0,
        ae * (1 - g) / 2
      ]
    ];
    if (M) {
      const H = M[0], q = M[1], oe = M[2];
      V[0][0] *= H, V[1][1] *= q, V[2][2] *= oe;
      const D = Math.sqrt(Math.max(0, H * q));
      V[0][1] *= D, V[1][0] *= D;
    }
    for (const H of V) for (let q = 0; q < 3; q++) H[q] *= v;
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
    ], T = [], re = [];
    for (let H = 0; H < 4; H++) T.push((c[ie[H]] - c[H]) / 8), re.push(-(t[ie[H]] - t[H]) / 8);
    const ue = 0.5773502691896258, xe = [
      -0.7745966692414834,
      0,
      0.7745966692414834
    ], Me = [
      5 / 9,
      8 / 9,
      5 / 9
    ], Q = P === 2 ? [
      -ue,
      ue
    ] : xe, se = P === 2 ? [
      1,
      1
    ] : Me, te = [];
    for (let H = 0; H < P; H++) for (let q = 0; q < P; q++) te.push({
      r: Q[H],
      s: Q[q],
      w: se[H] * se[q]
    });
    const ne = (H, q) => {
      const { N: oe, dNxi: D, dNeta: de } = ji(H, q), { det: j, Ji: O } = er(t, c, D, de), W = [], le = [];
      for (let Ae = 0; Ae < 4; Ae++) W.push(O[0][0] * D[Ae] + O[0][1] * de[Ae]), le.push(O[1][0] * D[Ae] + O[1][1] * de[Ae]);
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
      ], Fe = [], tt = [];
      for (let Ae = 0; Ae < 4; Ae++) Fe.push(O[0][0] * we[Ae] + O[0][1] * ze[Ae]), tt.push(O[1][0] * we[Ae] + O[1][1] * ze[Ae]);
      const st = -2 * H * (1 - q * q), Ue = -2 * q * (1 - H * H), Z = O[0][0] * st + O[0][1] * Ue, ce = O[1][0] * st + O[1][1] * Ue, fe = [], me = [], ke = [], $e = [];
      for (let Ae = 0; Ae < 4; Ae++) {
        const Le = J[Ae];
        fe.push(Fe[Le] * T[Le] - Fe[Ae] * T[Ae]), me.push(tt[Le] * T[Le] - tt[Ae] * T[Ae]), ke.push(Fe[Le] * re[Le] - Fe[Ae] * re[Ae]), $e.push(tt[Le] * re[Le] - tt[Ae] * re[Ae]);
      }
      return {
        N: oe,
        dNx: W,
        dNy: le,
        dNBx: Z,
        dNBy: ce,
        gt1: fe,
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
    if (F) {
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
      const H = ne(0, 0), q = m / (2 * (1 + g)), oe = S * q, D = new Array(14).fill(0);
      for (let j = 0; j < 4; j++) D[3 * j] = -0.5 * H.dNy[j], D[3 * j + 1] = 0.5 * H.dNx[j], D[3 * j + 2] = 0.5 * (H.gt3[j] - H.gt2[j]) - H.N[j];
      D[12] = 0, D[13] = 0;
      const de = oe * v * 4 * H.dJ;
      for (let j = 0; j < 14; j++) for (let O = 0; O < 14; O++) N[j][O] += de * D[j] * D[O];
      if (B > 0) {
        let j = 0;
        for (let le = 0; le < 4; le++) {
          const we = (le + 1) % 4;
          j += t[le] * c[we] - t[we] * c[le];
        }
        j = Math.abs(j) / 2;
        const O = new Array(14).fill(0);
        for (let le = 0; le < 4; le++) O[3 * le + 2] = le % 2 === 0 ? 1 : -1;
        const W = B * q * v * j / 4;
        for (let le = 0; le < 14; le++) for (let we = 0; we < 14; we++) N[le][we] += W * O[le] * O[we];
      }
    }
    return {
      K: N,
      Ben: C,
      Dm: V,
      GP2: ue
    };
  }
  dl = function(t, c, m, g, v, A, z = {}) {
    const S = Hs(t, c, g, v, A, z);
    if (!S) return null;
    const { K: M, Ben: P, Dm: F, GP2: B } = S, ae = [
      ...m,
      0,
      0
    ], V = [
      [
        M[12][12],
        M[12][13]
      ],
      [
        M[13][12],
        M[13][13]
      ]
    ], ie = V[0][0] * V[1][1] - V[0][1] * V[1][0];
    if (Math.abs(ie) > 1e-30) {
      const Q = M[12].slice(0, 12).reduce((te, ne, Y) => te + ne * m[Y], 0), se = M[13].slice(0, 12).reduce((te, ne, Y) => te + ne * m[Y], 0);
      ae[12] = -(V[1][1] * Q - V[0][1] * se) / ie, ae[13] = -(-V[1][0] * Q + V[0][0] * se) / ie;
    }
    const J = globalThis.__hekatanItwRec ?? "", T = ae.slice();
    if (J.includes("conBurbuja") || (T[12] = 0, T[13] = 0), J.includes("sinTheta")) for (let Q = 0; Q < 4; Q++) T[3 * Q + 2] = 0;
    const re = (Q, se) => {
      const { B: te, d: ne } = P(Q, se);
      if (J.includes("sinProy")) for (let ee = 0; ee < 4; ee++) te[0][3 * ee + 2] = ne.gt1[ee], te[1][3 * ee + 2] = ne.gt4[ee], te[2][3 * ee + 2] = ne.gt2[ee] + ne.gt3[ee];
      const Y = [
        0,
        1,
        2
      ].map((ee) => te[ee].reduce((G, C, N) => G + C * T[N], 0));
      return [
        0,
        1,
        2
      ].map((ee) => F[ee][0] * Y[0] + F[ee][1] * Y[1] + F[ee][2] * Y[2]);
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
    if (J.includes("esquinas")) return ue.map(([Q, se]) => re(Q, se));
    const xe = B, Me = ue.map(([Q, se]) => re(Q * xe, se * xe));
    return ue.map(([Q, se]) => {
      const te = Q / xe, ne = se / xe, Y = ue.map(([ee, G]) => (1 + ee * te) * (1 + G * ne) / 4);
      return [
        0,
        1,
        2
      ].map((ee) => Y.reduce((G, C, N) => G + C * Me[N][ee], 0));
    });
  };
  function tr(t, c, m, g, v, A = {}) {
    const z = Hs(t, c, m, g, v, A);
    if (!z) return null;
    const S = z.K, M = [
      [
        S[12][12],
        S[12][13]
      ],
      [
        S[13][12],
        S[13][13]
      ]
    ], P = M[0][0] * M[1][1] - M[0][1] * M[1][0], F = S.slice(0, 12).map((B) => B.slice(0, 12));
    if (Math.abs(P) > 1e-30) {
      const B = [
        [
          M[1][1] / P,
          -M[0][1] / P
        ],
        [
          -M[1][0] / P,
          M[0][0] / P
        ]
      ];
      for (let ae = 0; ae < 12; ae++) for (let V = 0; V < 12; V++) {
        let ie = 0;
        for (let J = 0; J < 2; J++) for (let T = 0; T < 2; T++) ie += S[ae][12 + J] * B[J][T] * S[12 + T][V];
        F[ae][V] -= ie;
      }
    }
    return F;
  }
  const Ia = (t, c) => [
    t[1] * c[2] - t[2] * c[1],
    t[2] * c[0] - t[0] * c[2],
    t[0] * c[1] - t[1] * c[0]
  ], ea = (t) => {
    const c = Math.hypot(t[0], t[1], t[2]) || 1;
    return [
      t[0] / c,
      t[1] / c,
      t[2] / c
    ];
  };
  nr = function(t) {
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
    ], v = [
      t[3][0] - t[1][0],
      t[3][1] - t[1][1],
      t[3][2] - t[1][2]
    ];
    let A = ea([
      c[0] + m[0],
      c[1] + m[1],
      c[2] + m[2]
    ]);
    const z = ea(Ia(g, v)), S = ea(Ia(z, A));
    A = ea(Ia(S, z));
    const M = [
      0,
      1,
      2
    ].map((B) => (t[0][B] + t[1][B] + t[2][B] + t[3][B]) / 4), P = [], F = [];
    for (let B = 0; B < 4; B++) {
      const ae = [
        t[B][0] - M[0],
        t[B][1] - M[1],
        t[B][2] - M[2]
      ];
      P.push(ae[0] * A[0] + ae[1] * A[1] + ae[2] * A[2]), F.push(ae[0] * S[0] + ae[1] * S[1] + ae[2] * S[2]);
    }
    return {
      ex: A,
      ey: S,
      ez: z,
      xl: P,
      yl: F
    };
  };
  or = function(t, c, m, g, v) {
    const A = m * v * v * v / (12 * (1 - g * g)), z = [
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
    ], S = 1 / Math.sqrt(3), M = Array.from({
      length: 12
    }, () => new Array(12).fill(0));
    for (const P of [
      -S,
      S
    ]) for (const F of [
      -S,
      S
    ]) {
      const B = Gs(t, c, P, F), ae = [
        -(1 - F) / 4,
        (1 - F) / 4,
        (1 + F) / 4,
        -(1 + F) / 4
      ], V = [
        -(1 - P) / 4,
        -(1 + P) / 4,
        (1 + P) / 4,
        (1 - P) / 4
      ];
      let ie = 0, J = 0, T = 0, re = 0;
      for (let xe = 0; xe < 4; xe++) ie += ae[xe] * t[xe], J += ae[xe] * c[xe], T += V[xe] * t[xe], re += V[xe] * c[xe];
      const ue = Math.abs(ie * re - J * T);
      for (let xe = 0; xe < 12; xe++) for (let Me = 0; Me < 12; Me++) {
        let Q = 0;
        for (let se = 0; se < 3; se++) for (let te = 0; te < 3; te++) Q += B[se][xe] * z[se][te] * B[te][Me];
        M[xe][Me] += Q * ue;
      }
    }
    return M;
  };
  $s = function(t, c, m, g, v = {}) {
    if (t.length !== 4) throw new Error("La K de pa\xF1o de esta pantalla es la del Q4: hacen falta 4 nudos.");
    const A = v.tipoPlaca ?? 0, z = v.tipoDrill ?? 12, { ex: S, ey: M, ez: P, xl: F, yl: B } = nr(t), ae = A === 1 ? or(F, B, c, m, g) : Qi(F, B, c, m, g), V = tr(F, B, c, m, g, {
      tipo: z,
      gammaFac: v.gammaFac,
      mod: v.mod
    });
    let ie = 0;
    for (let J = 0; J < 4; J++) {
      const T = (J + 1) % 4;
      ie += F[J] * B[T] - F[T] * B[J];
    }
    return {
      flexion: ae,
      membrana: V,
      xl: F,
      yl: B,
      ex: S,
      ey: M,
      ez: P,
      area: Math.abs(ie) / 2,
      formulacion: (A === 1 ? "Shell-Thin (DKQ, Batoz-Tahar)" : "Shell-Thick de CSI") + " + membrana " + (z === 12 ? "ITW tipo 12 (la de CSI)" : "ITW tipo " + z)
    };
  };
  class Ws {
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
      this.map = Ra[c] || Ra.rainbow, this.n = m;
      const g = 1 / this.n, v = new hn(), A = new hn();
      this.lut.length = 0, this.lut.push(new hn(this.map[0][1]));
      for (let z = 1; z < m; z++) {
        const S = z * g;
        for (let M = 0; M < this.map.length - 1; M++) if (S > this.map[M][0] && S <= this.map[M + 1][0]) {
          const P = this.map[M][0], F = this.map[M + 1][0];
          v.setHex(this.map[M][1], Oo), A.setHex(this.map[M + 1][1], Oo);
          const B = new hn().lerpColors(v, A, (S - P) / (F - P));
          this.lut.push(B);
        }
      }
      return this.lut.push(new hn(this.map[this.map.length - 1][1])), this;
    }
    copy(c) {
      return this.lut = c.lut, this.map = c.map, this.n = c.n, this.minV = c.minV, this.maxV = c.maxV, this;
    }
    getColor(c) {
      c = Ri.clamp(c, this.minV, this.maxV), c = (c - this.minV) / (this.maxV - this.minV);
      const m = Math.round(c * this.n);
      return this.lut[m];
    }
    addColorMap(c, m) {
      return Ra[c] = m, this;
    }
    createCanvas() {
      const c = document.createElement("canvas");
      return c.width = 1, c.height = this.n, this.updateCanvas(c), c;
    }
    updateCanvas(c) {
      const m = c.getContext("2d", {
        alpha: false
      }), g = m.getImageData(0, 0, 1, this.n), v = g.data;
      let A = 0;
      const z = 1 / this.n, S = new hn(), M = new hn(), P = new hn();
      for (let F = 1; F >= 0; F -= z) for (let B = this.map.length - 1; B >= 0; B--) if (F < this.map[B][0] && F >= this.map[B - 1][0]) {
        const ae = this.map[B - 1][0], V = this.map[B][0];
        S.setHex(this.map[B - 1][1], Oo), M.setHex(this.map[B][1], Oo), P.lerpColors(S, M, (F - ae) / (V - ae)), v[A * 4] = Math.round(P.r * 255), v[A * 4 + 1] = Math.round(P.g * 255), v[A * 4 + 2] = Math.round(P.b * 255), v[A * 4 + 3] = 255, A += 1;
      }
      return m.putImageData(g, 0, 0), c;
    }
  }
  const Ra = {
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
  }, Js = [
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
  ], ar = {
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
    csi: Js,
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
  }, ca = ve.state("safe"), Qs = ve.state("auto");
  function Os(t) {
    t = Math.max(0, Math.min(1, t));
    const c = ar[ca.val] ?? Js;
    for (let g = 0; g < c.length - 1; g++) {
      const [v, A, z, S] = c[g], [M, P, F, B] = c[g + 1];
      if (t <= M) {
        const ae = (t - v) / (M - v);
        return [
          A + (P - A) * ae,
          z + (F - z) * ae,
          S + (B - S) * ae
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
  function Ls() {
    const c = new Uint8Array(1024);
    for (let g = 0; g < 256; g++) {
      const v = g / 255, [A, z, S] = Os(v);
      c[g * 4 + 0] = A, c[g * 4 + 1] = z, c[g * 4 + 2] = S, c[g * 4 + 3] = 255;
    }
    const m = new Di(c, 256, 1, Ni);
    return m.minFilter = _s, m.magFilter = _s, m.wrapS = ks, m.wrapT = ks, m.needsUpdate = true, m;
  }
  function sr() {
    const c = [];
    for (let m = 0; m <= 12; m++) {
      const g = 1 - m / 12, [v, A, z] = Os(g);
      c.push(`rgb(${v | 0},${A | 0},${z | 0}) ${(m / 12 * 100).toFixed(0)}%`);
    }
    return `linear-gradient(${c.join(",")})`;
  }
  function Ua(t) {
    if (!t.length) return [
      0,
      1
    ];
    const c = [
      ...t
    ].sort((A, z) => A - z), m = (A) => c[Math.min(c.length - 1, Math.max(0, Math.round(A * (c.length - 1))))];
    let g = c.length >= 20 ? m(0.01) : c[0], v = c.length >= 20 ? m(0.99) : c[c.length - 1];
    return g >= 0 && v > 0 && (g = 0), v <= 0 && g < 0 && (v = 0), [
      g,
      v
    ];
  }
  ir = function(t, c, m) {
    new Ws();
    const g = Ls(), v = new Ti({
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
      var _a;
      ca.val;
      const z = v.uniforms.cmap.value;
      v.uniforms.cmap.value = Ls(), (_a = z == null ? void 0 : z.dispose) == null ? void 0 : _a.call(z);
    });
    const A = new dt(new De(), v);
    return A.renderOrder = -1, A.frustumCulled = false, A.userData.isShellArea = true, A.name = "__hekatan_shell_colormap", ve.derive(() => {
      A.geometry.setAttribute("position", new Rt(t.val.flat(), 3));
      const z = [], S = [], M = [];
      c.val.forEach((ue, xe) => {
        ue.length === 3 ? (z.push(ue[0], ue[1], ue[2]), S.push(xe), M.push(0)) : ue.length === 4 && (z.push(ue[0], ue[1], ue[2]), z.push(ue[0], ue[2], ue[3]), S.push(xe, xe), M.push(0, 1));
      }), A.geometry.setIndex(new Bi(z, 1)), A.userData.faceToElem = S, A.userData.faceLocal = M;
      const P = m.val.filter((ue) => Number.isFinite(ue));
      let F, B;
      const ae = Fo.val;
      if (ae ? (B = ae[0], F = ae[1]) : [B, F] = Ua(P), F === B) {
        const ue = Math.max(Math.abs(F) * 1e-6, 1e-9);
        F += ue, B -= ue;
      }
      const V = ae && ae[0] > ae[1], ie = Math.min(B, F), J = Math.max(B, F), T = J - ie, re = new Float32Array(m.val.length);
      for (let ue = 0; ue < m.val.length; ue++) {
        const xe = m.val[ue];
        if (!Number.isFinite(xe)) {
          re[ue] = -1;
          continue;
        }
        const Q = ((V ? J + ie - xe : xe) - ie) / T;
        re[ue] = Math.max(0, Math.min(1, Q));
      }
      A.geometry.setAttribute("scalar", new bt(re, 1));
    }), A;
  };
  function rr(t, c, m) {
    const g = document.createElement("div"), v = new qs({
      title: "Settings",
      expanded: true,
      container: g
    });
    window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(v), g.setAttribute("id", "settings");
    const A = "hk_settingsPos";
    let z = null;
    try {
      const V = localStorage.getItem(A);
      V && (z = JSON.parse(V));
    } catch {
    }
    g.style.cssText = [
      "position:fixed",
      z ? `left:${z.left}px` : "left:8px",
      z ? `top:${z.top}px` : "top:8px",
      "z-index:50",
      "max-height:calc(100vh - 32px)",
      "overflow-y:auto",
      "box-shadow:0 4px 16px rgba(0,0,0,0.35)",
      "border-radius:6px"
    ].join(";") + ";";
    const S = () => {
      const V = g.querySelector(".tp-rotv_b");
      if (!V) {
        setTimeout(S, 200);
        return;
      }
      V.style.cursor = "move", V.style.userSelect = "none";
      let ie = false, J = 0, T = 0, re = 0, ue = 0;
      V.addEventListener("mousedown", (xe) => {
        ie = true, J = xe.clientX, T = xe.clientY;
        const Me = g.getBoundingClientRect();
        re = Me.left, ue = Me.top, g.style.left = `${re}px`, g.style.top = `${ue}px`;
      }), window.addEventListener("mousemove", (xe) => {
        if (!ie) return;
        const Me = xe.clientX - J, Q = xe.clientY - T, se = Math.max(0, Math.min(window.innerWidth - 40, re + Me)), te = Math.max(0, Math.min(window.innerHeight - 40, ue + Q));
        g.style.left = `${se}px`, g.style.top = `${te}px`;
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
    if (S(), c == null ? void 0 : c.nodes) {
      v.addBinding(t.displayScale, "val", {
        label: "Display scale",
        min: -10,
        max: 10,
        step: 0.5
      });
      const V = v.addFolder({
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
      const J = v.addFolder({
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
      const V = v.addFolder({
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
      const V = v.addFolder({
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
        var _a;
        (_a = window.__hekatanDiagrama2D) == null ? void 0 : _a.call(window);
      }), V.addButton({
        title: "\u{1F4C8} Gr\xE1fico de la barra designada"
      }).on("click", () => {
        var _a;
        (_a = window.__hekatanDiagramaBarra) == null ? void 0 : _a.call(window);
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
      }), V.addBinding(ca, "val", {
        options: {
          "SAFE (cimentaci\xF3n)": "safe",
          "ETABS / CSI (magenta\u2192azul)": "csi",
          "Jet_r (rojo\u2192azul)": "jet_r",
          "Jet (azul\u2192rojo)": "jet",
          Viridis: "viridis"
        },
        label: "\u{1F3A8} Paleta colores"
      }), V.addBinding(Qs, "val", {
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
    m && v.addBinding(t.solids, "val", {
      label: "Solids"
    });
    const M = v.addFolder({
      title: "\u2702\uFE0F Cortes X/Y/Z",
      expanded: false
    }), P = window.__hekatanClip ?? (window.__hekatanClip = {
      enableX: false,
      enableY: false,
      enableZ: false,
      posX: 0,
      posY: 0,
      posZ: 0,
      invertX: false,
      invertY: false,
      invertZ: false
    }), F = () => {
      const V = window.__hekatanClipApply;
      typeof V == "function" && V();
    };
    let B = [];
    const ae = (V, ie) => {
      for (const T of B) try {
        T.dispose();
      } catch {
      }
      B = [];
      const J = (T, re) => {
        const ue = Math.floor(Math.min(V[re], -50)), xe = Math.ceil(Math.max(ie[re], 50)), Me = xe - ue > 400 ? 0.5 : 0.1;
        return P["pos" + T] = Math.max(ue, Math.min(xe, P["pos" + T])), M.addBinding(P, "pos" + T, {
          min: ue,
          max: xe,
          step: Me,
          label: `  pos ${T} (m)`
        }).on("change", F);
      };
      B.push(M.addBinding(P, "enableX", {
        label: "Cortar X"
      }).on("change", F), J("X", 0), M.addBinding(P, "invertX", {
        label: "  invertir X"
      }).on("change", F), M.addBinding(P, "enableY", {
        label: "Cortar Y"
      }).on("change", F), J("Y", 1), M.addBinding(P, "invertY", {
        label: "  invertir Y"
      }).on("change", F), M.addBinding(P, "enableZ", {
        label: "Cortar Z"
      }).on("change", F), J("Z", 2), M.addBinding(P, "invertZ", {
        label: "  invertir Z"
      }).on("change", F));
    };
    return ae([
      -50,
      -50,
      -50
    ], [
      50,
      50,
      50
    ]), window.__hekatanClipRango = (V, ie) => {
      ae(V, ie);
    }, g;
  }
  function lr(t) {
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
  function cr(t, c, m) {
    const g = to(), v = new oa(new De(), new aa({
      color: g.nodePoint
    }));
    return Ys((A, z) => {
      v.material.color.setHex(z.nodePoint);
    }), v.frustumCulled = false, ve.derive(() => {
      t.nodes.val && v.geometry.setAttribute("position", new Rt(c.val.flat(), 3));
    }), ve.derive(() => {
      if (m.val, c.val, !t.nodes.rawVal) return;
      const A = c.rawVal ?? [];
      let z = t.gridSize.val * 0.5;
      if (A.length >= 2) {
        const M = [
          1 / 0,
          1 / 0,
          1 / 0
        ], P = [
          -1 / 0,
          -1 / 0,
          -1 / 0
        ];
        for (const F of A) for (let B = 0; B < 3; B++) M[B] = Math.min(M[B], F[B]), P[B] = Math.max(P[B], F[B]);
        z = Math.max(P[0] - M[0], P[1] - M[1], P[2] - M[2], 0.1);
      }
      const S = 0.03 * z;
      v.material.size = S * m.rawVal;
    }), ve.derive(() => {
      v.visible = t.nodes.val;
    }), v;
  }
  function Ta(t, c) {
    const m = to(), g = new pt();
    g.name = "hekatan-grid";
    const v = (c == null ? void 0 : c.planes) ?? [
      "xy"
    ];
    let A = (c == null ? void 0 : c.majorStep) ?? 1, z = (c == null ? void 0 : c.minorStep) ?? 0.1;
    for (A <= 0 && (A = 1), z <= 0 && (z = 0.1); t / z > 500; ) z *= 2;
    for (; t / A > 100; ) A *= 2;
    const S = t / 2;
    A = Math.max(z, Math.round(A / z) * z);
    const P = new hn(m.grid).multiplyScalar(1.3), F = new hn(m.grid).multiplyScalar(0.8), B = (J, T, re, ue) => {
      const xe = [], Me = J === "xy" ? (Y, ee) => [
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
      ], Q = Math.floor(S / T);
      for (let Y = -Q; Y <= Q; Y++) {
        const ee = Y * T, G = Me(ee, -S), C = Me(ee, S);
        xe.push(...G, ...C);
      }
      for (let Y = -Q; Y <= Q; Y++) {
        const ee = Y * T, G = Me(-S, ee), C = Me(S, ee);
        xe.push(...G, ...C);
      }
      const se = new De();
      se.setAttribute("position", new Rt(xe, 3));
      const te = new mt({
        color: re,
        transparent: true,
        opacity: ue,
        depthWrite: false
      }), ne = new rn(se, te);
      return ne.name = `grid-${J}-${T === z ? "minor" : "major"}`, ne;
    }, ae = (J, T, re) => {
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
          -S,
          -S
        ],
        [
          S,
          -S
        ],
        [
          S,
          S
        ],
        [
          -S,
          S
        ]
      ], Me = [];
      for (const [ne, Y] of xe) Me.push(...ue(ne, Y));
      const Q = new De();
      Q.setAttribute("position", new Rt(Me, 3));
      const se = new mt({
        color: T,
        transparent: true,
        opacity: re,
        depthWrite: false
      }), te = new Xs(Q, se);
      return te.name = `grid-${J}-border`, te.renderOrder = 1, te;
    }, V = (J, T, re) => {
      const ue = J === "xy" ? (se, te) => [
        se,
        te,
        0
      ] : J === "xz" ? (se, te) => [
        se,
        0,
        te
      ] : (se, te) => [
        0,
        se,
        te
      ], xe = T === "u" ? [
        ...ue(-S, 0),
        ...ue(S, 0)
      ] : [
        ...ue(0, -S),
        ...ue(0, S)
      ], Me = new De();
      Me.setAttribute("position", new Rt(xe, 3));
      const Q = new rn(Me, new mt({
        color: re,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
      }));
      return Q.name = `grid-${J}-eje-${T}`, Q.renderOrder = 1, Q;
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
    for (const J of v) {
      g.add(B(J, z, F, 0.12)), g.add(B(J, A, P, 0.4));
      const [T, re] = ie[J];
      g.add(V(J, "u", T)), g.add(V(J, "v", re)), g.add(ae(J, P, 0.55));
    }
    return g.position.set(0, 0, 0), window.__hekatanGridConfig = {
      majorStep: A,
      minorStep: z,
      gridSize: t,
      planes: [
        ...v
      ]
    }, g;
  }
  function dr(t, c, m, g) {
    const v = new pt(), A = new Us(0.5, 0.5, 0.5), z = new Yi(0.45, 0.7, 4);
    z.rotateX(Math.PI / 2), z.translate(0, 0, -0.35);
    const S = new wt({
      color: 10166822
    }), M = new wt({
      color: 2792847
    }), P = new wt({
      color: 3835647
    }), F = () => {
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
      for (const T of V) for (let re = 0; re < 3; re++) T[re] < ie[re] && (ie[re] = T[re]), T[re] > J[re] && (J[re] = T[re]);
      return Math.max(J[0] - ie[0], J[1] - ie[1], J[2] - ie[2], 0.1);
    }, B = () => 0.08 * F(), ae = () => g.rawVal;
    return ve.derive(() => {
      var _a, _b;
      if (c.deformedShape.val, !c.supports.val) return;
      v.clear();
      const V = B();
      (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val.supports) == null ? void 0 : _b.forEach((ie, J) => {
        const T = m.val[J];
        if (!T) return;
        const re = ie ?? [], ue = (re[0] ? 1 : 0) + (re[1] ? 1 : 0) + (re[2] ? 1 : 0), xe = (re[3] ? 1 : 0) + (re[4] ? 1 : 0) + (re[5] ? 1 : 0);
        let Me;
        ue >= 3 && xe >= 3 ? Me = new dt(A, S) : ue >= 3 && xe === 0 ? Me = new dt(z, M) : Me = new dt(z, P), Me.position.set(T[0], T[1], T[2]);
        const Q = V * ae();
        Me.scale.set(Q, Q, Q), v.add(Me);
      });
    }), ve.derive(() => {
      if (g.val, !c.supports.rawVal) return;
      const ie = B() * ae();
      v.children.forEach((J) => J.scale.set(ie, ie, ie));
    }), ve.derive(() => {
      v.visible = c.supports.val;
    }), v;
  }
  function ur(t, c, m, g) {
    const v = new pt();
    v.name = "loadsGroup";
    function A(S) {
      if (S.length < 2) return 0.12 * c.gridSize.rawVal;
      const M = [
        1 / 0,
        1 / 0,
        1 / 0
      ], P = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const B of S) for (let ae = 0; ae < 3; ae++) M[ae] = Math.min(M[ae], B[ae]), P[ae] = Math.max(P[ae], B[ae]);
      return 0.08 * Math.max(P[0] - M[0], P[1] - M[1], P[2] - M[2], 0.1);
    }
    ve.derive(() => {
      var _a, _b, _c;
      if (c.deformedShape.val, !c.loads.val) return;
      v.children.forEach((J) => {
        var _a2;
        return (_a2 = J.dispose) == null ? void 0 : _a2.call(J);
      }), v.clear();
      const S = m.val, M = A(S), P = 240, F = [];
      (_c = (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((J, T) => {
        S[T] && J.slice(0, 3).some((re) => Math.abs(re) > 1e-15) && F.push(T);
      });
      let B = F;
      if (F.length > P) {
        const J = F.map((C) => S[C][0]), T = F.map((C) => S[C][1]), re = Math.min(...J), ue = Math.max(...J), xe = Math.min(...T), Me = Math.max(...T), Q = F.map((C) => S[C][2]), se = Math.max(1e-6, (Math.max(...Q) - Math.min(...Q)) / 40), te = (C) => Math.round(C / se), ne = new Set(Q.map(te)), Y = Math.max(4, Math.floor(P / Math.max(1, ne.size))), ee = Math.max(2, Math.round(Math.sqrt(Y))), G = /* @__PURE__ */ new Map();
        for (const C of F) {
          const N = ue - re < 1e-9 ? 0 : (S[C][0] - re) / (ue - re), H = Me - xe < 1e-9 ? 0 : (S[C][1] - xe) / (Me - xe), q = Math.min(ee - 1, Math.floor(N * ee)), oe = Math.min(ee - 1, Math.floor(H * ee)), D = `${q},${oe},${te(S[C][2])}`, de = Math.hypot(N * ee - (q + 0.5), H * ee - (oe + 0.5)), j = G.get(D);
          (!j || de < j.d) && G.set(D, {
            i: C,
            d: de
          });
        }
        B = [
          ...G.values()
        ].map((C) => C.i);
      }
      let ae = 0;
      for (const J of B) {
        const T = t.nodeInputs.val.loads.get(J);
        for (let re = 0; re < 3; re++) ae = Math.max(ae, Math.abs(T[re]));
      }
      const V = B.length <= 60, ie = (J) => {
        const T = Math.abs(J);
        return T >= 100 ? J.toFixed(0) : T >= 10 ? J.toFixed(1) : J.toFixed(2);
      };
      for (const J of B) {
        const T = t.nodeInputs.val.loads.get(J), re = S[J];
        if (re) for (let ue = 0; ue < 3; ue++) {
          const xe = T[ue];
          if (!(Math.abs(xe) > 1e-9 * (ae || 1))) continue;
          const Me = new R(ue === 0 ? Math.sign(xe) : 0, ue === 1 ? Math.sign(xe) : 0, ue === 2 ? Math.sign(xe) : 0), Q = 0.45 + 0.55 * (ae ? Math.abs(xe) / ae : 1), se = new qn(Me, new R(...re), 1, ue === 2 ? 15637248 : 15022123, 0.3, 0.3);
          if (se.userData = {
            nudo: re,
            dir: Me,
            rel: Q
          }, v.add(se), V) {
            const te = new Bt(ie(xe), ue === 2 ? "#f5b642" : "#ff6b5e");
            te.userData = {
              nudo: re,
              dir: Me,
              rel: Q,
              texto: true
            }, v.add(te);
          }
        }
      }
      z(M * g.rawVal);
    });
    function z(S) {
      v.children.forEach((M) => {
        const P = M.userData;
        if (!(P == null ? void 0 : P.dir)) return;
        const F = S * P.rel, B = new R(...P.nudo).addScaledVector(P.dir, -F * (P.texto ? 1.12 : 1));
        M.position.copy(B), P.texto ? M.updateScale(S * 0.38) : M.scale.set(F, F, F);
      });
    }
    return ve.derive(() => {
      g.val, c.loads.rawVal && z(A(m.rawVal) * g.rawVal);
    }), ve.derive(() => {
      v.visible = c.loads.val;
    }), v;
  }
  function pr(t, c, m) {
    const g = new pt();
    return ve.derive(() => {
      if (!t.nodesIndexes.val) return;
      g.children.forEach((A) => A.dispose()), g.clear();
      const v = 0.05 * t.gridSize.val * 0.6;
      c.val.forEach((A, z) => {
        const S = new Bt(`${z}`);
        S.position.set(...A), S.updateScale(v * m.rawVal), g.add(S);
      });
    }), ve.derive(() => {
      if (m.val, !t.nodesIndexes.rawVal) return;
      const v = 0.05 * t.gridSize.val * 0.6;
      g.children.forEach((A) => A.updateScale(v * m.rawVal));
    }), ve.derive(() => {
      g.visible = t.nodesIndexes.val;
    }), g;
  }
  function fr(t, c, m, g) {
    const v = new pt();
    return ve.derive(() => {
      var _a;
      if (c.deformedShape.val, !c.elementsIndexes.val) return;
      v.children.forEach((z) => z.dispose()), v.clear();
      const A = 0.05 * c.gridSize.val * 0.6;
      (_a = t.elements) == null ? void 0 : _a.val.forEach((z, S) => {
        const M = new Bt(`${S}`, void 0, "#001219");
        M.position.set(...hr(z.map((P) => m.rawVal[P]))), M.updateScale(A * g.rawVal), v.add(M);
      });
    }), ve.derive(() => {
      if (g.val, !c.elementsIndexes.rawVal) return;
      const A = 0.05 * c.gridSize.val * 0.6;
      v.children.forEach((z) => z.updateScale(A * g.rawVal));
    }), ve.derive(() => {
      v.visible = c.elementsIndexes.val;
    }), v;
  }
  function hr(t) {
    const c = t.reduce((g, v) => [
      g[0] + v[0],
      g[1] + v[1],
      g[2] + v[2]
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
  function Vs(t, c) {
    const m = new pt(), g = Math.min(0.05 * t, 0.6), v = to(), A = new Bt("X", "red", "transparent"), z = new Bt(c ? "Z" : "Y", "green", "transparent"), S = new Bt(c ? "Y" : "Z", "blue", "transparent"), M = new qn(new R(1, 0, 0), new R(0, 0, 0), 1, v.axisArrow, 0.2, 0.2), P = new qn(new R(0, 1, 0), new R(0, 0, 0), 1, v.axisArrow, 0.2, 0.2), F = new qn(new R(0, 0, 1), new R(0, 0, 0), 1, v.axisArrow, 0.2, 0.2);
    return A.position.set(1.3 * g, 0, 0), z.position.set(0, 1.3 * g, 0), S.position.set(0, 0, 1.3 * g), A.updateScale(0.4 * g), z.updateScale(0.4 * g), S.updateScale(0.4 * g), M.scale.set(g, g, g), P.scale.set(g, g, g), F.scale.set(g, g, g), m.add(M, P, F, A, z, S), m;
  }
  function ra(t, c) {
    const m = new R(...t), v = new R(...c).clone().sub(m), A = v.length(), z = v.dot(new R(1, 0, 0)) / A, S = v.dot(new R(0, 1, 0)) / A, M = v.dot(new R(0, 0, 1)) / A, P = Math.sqrt(z ** 2 + S ** 2);
    let F = new $a().fromArray([
      [
        z,
        S,
        M
      ],
      [
        -S / P,
        z / P,
        0
      ],
      [
        -z * M / P,
        -S * M / P,
        P
      ]
    ].flat());
    return M === 1 && (F = new $a().fromArray([
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
    ].flat())), M === -1 && (F = new $a().fromArray([
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
    ].flat())), new la().setFromMatrix3(F);
  }
  function Na(t, c) {
    return t == null ? void 0 : t.map((m, g) => (9 * m + c[g]) / 10);
  }
  function Eo(t) {
    const c = t.reduce((g, v) => [
      g[0] + v[0],
      g[1] + v[1],
      g[2] + v[2]
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
  function mr(t, c, m) {
    const g = Eo([
      c,
      m
    ]), v = Eo([
      t,
      m
    ]), A = Eo([
      t,
      c
    ]), z = new R(...g).sub(new R(...v)).normalize(), S = new R(...m).sub(new R(...A)).normalize(), M = z.clone().cross(S).normalize(), P = M.clone().cross(z).normalize();
    return new la().makeBasis(z, P, M);
  }
  function wr(t, c, m, g) {
    const v = new pt(), A = new De(), z = new mt({
      vertexColors: true
    }), S = [
      0,
      0,
      0
    ], M = [
      1,
      0,
      0
    ], P = [
      0,
      1,
      0
    ], F = [
      0,
      0,
      1
    ];
    A.setAttribute("position", new Rt([
      ...S,
      ...M,
      ...S,
      ...P,
      ...S,
      ...F
    ], 3));
    const B = [
      255,
      0,
      0
    ], ae = [
      0,
      255,
      0
    ], V = [
      0,
      0,
      255
    ];
    return A.setAttribute("color", new Rt([
      ...B,
      ...B,
      ...ae,
      ...ae,
      ...V,
      ...V
    ], 3)), ve.derive(() => {
      var _a;
      c.deformedShape.val, c.orientations.val && (v.clear(), (_a = t.elements) == null ? void 0 : _a.val.forEach((ie) => {
        const J = new rn(A, z), T = m.rawVal[ie[0]], re = m.rawVal[ie[1]];
        if (ie.length === 2 && (J.position.set(...Na(T, re)), J.rotation.setFromRotationMatrix(ra(T, re))), ie.length === 3) {
          const Me = m.rawVal[ie[2]];
          J.position.set(...Eo([
            T,
            re,
            Me
          ])), J.rotation.setFromRotationMatrix(mr(T, re, Me));
        }
        const xe = 0.05 * c.gridSize.rawVal * 0.75 * g.rawVal;
        J.scale.set(xe, xe, xe), v.add(J);
      }));
    }), ve.derive(() => {
      if (g.val, !c.orientations.rawVal) return;
      const J = 0.05 * c.gridSize.val * 0.75 * g.rawVal;
      v.children.forEach((T) => T.scale.set(J, J, J));
    }), ve.derive(() => {
      v.visible = c.orientations.val;
    }), v;
  }
  function yr(t) {
    if (t.name) return t.name;
    if (t.type === "rect") {
      const c = (t.b * 100).toFixed(0), m = (t.h * 100).toFixed(0);
      return `${c}x${m}`;
    }
    return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
  }
  function xr(t, c, m, g) {
    const v = new pt(), A = new pt();
    v.add(A);
    function z(se, te) {
      const ne = se / 2, Y = te / 2, ee = new Float32Array([
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
    function S(se, te = 24) {
      const ne = se / 2, Y = new Float32Array(te * 9);
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
    function M(se, te, ne, Y) {
      const ee = ne ?? te * 0.08, G = Y ?? se * 0.07, C = se / 2, N = te / 2, H = N - ee, q = G / 2, oe = [];
      function D(W, le, we, ze) {
        oe.push(0, W, le, 0, we, le, 0, we, ze, 0, W, le, 0, we, ze, 0, W, ze);
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
    function P(se, te, ne) {
      const Y = se / 2, ee = te / 2, G = Y - ne, C = ee - ne, N = [];
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
    function F(se, te, ne) {
      const Y = se / 2, ee = te / 2, G = Y - ne, C = ee - ne, N = new De(), H = new Float32Array([
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
      function oe(O, W, le, we) {
        q.push(0, O, W, 0, le, W, 0, le, we, 0, O, W, 0, le, we, 0, O, we);
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
    function B(se, te, ne) {
      const Y = [], ee = [
        [
          0,
          -se / 2,
          -te / 2
        ],
        [
          0,
          -se / 2 + ne,
          -te / 2
        ],
        [
          0,
          -se / 2 + ne,
          te / 2 - ne
        ],
        [
          0,
          se / 2,
          te / 2 - ne
        ],
        [
          0,
          se / 2,
          te / 2
        ],
        [
          0,
          -se / 2,
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
    function ae(se, te, ne, Y) {
      const ee = Y / 2, G = [], C = [
        [
          0,
          -se - ee,
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
          -se - ee,
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
          se + ee,
          te / 2 - ne
        ],
        [
          0,
          se + ee,
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
    function V(se, te, ne, Y) {
      const ee = te / 2, G = se, C = [
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
    function ie(se, te, ne, Y, ee) {
      const G = te / 2, C = ee / 2, N = [], H = [
        [
          0,
          -se,
          -G
        ],
        [
          0,
          -se,
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
          -se,
          G - ne
        ],
        [
          0,
          -se,
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
        const le = (W + 1) % O.length;
        de.push(...O[W], ...O[le]);
      }
      const j = new De();
      return j.setAttribute("position", new bt(new Float32Array(de), 3)), {
        fill: D,
        outline: j
      };
    }
    function J(se, te, ne, Y) {
      const ee = se / 2, G = te / 2, C = Y / 2, N = [
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
    function T(se, te, ne = 24) {
      const Y = se / 2, ee = Y - te, G = [];
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
    const re = new wt({
      color: 52479,
      transparent: true,
      opacity: 0.35,
      side: It,
      depthWrite: false
    }), ue = new mt({
      color: 52479
    }), xe = new wt({
      color: 16750848,
      transparent: true,
      opacity: 0.4,
      side: It,
      depthWrite: false
    }), Me = new mt({
      color: 16750848
    });
    function Q(se, te) {
      const ne = Math.abs(te[0] - se[0]), Y = Math.abs(te[1] - se[1]), ee = Math.abs(te[2] - se[2]);
      return ee > ne && ee > Y || Y > ne && Y > ee;
    }
    return ve.derive(() => {
      var _a, _b;
      c.deformedShape.val, c.secColumns.val, c.secBeams.val, c.secFloor.val;
      const se = c.secColumns.rawVal, te = c.secBeams.rawVal;
      if (!se && !te) {
        v.children.forEach((C) => {
          C instanceof Bt && C.dispose();
        }), v.clear();
        return;
      }
      v.children.forEach((C) => {
        C instanceof Bt && C.dispose();
      }), v.clear();
      const ne = (_a = t.elements) == null ? void 0 : _a.val, Y = (_b = t.elementInputs) == null ? void 0 : _b.val;
      if (!ne || !Y) return;
      const ee = Y.sectionShapes, G = c.secFloor.rawVal;
      ne.forEach((C, N) => {
        if (C.length !== 2) return;
        const H = m.rawVal[C[0]], q = m.rawVal[C[1]];
        if (!H || !q) return;
        const oe = Q(H, q);
        if (oe && !se || !oe && !te) return;
        if (G >= 0) {
          const W = Math.min(H[1], q[1]);
          Math.max(H[1], q[1]);
          const le = c.gridSize.rawVal || 3;
          if (Math.floor(W / le + 0.01) !== G) return;
        }
        const D = ee == null ? void 0 : ee.get(N);
        if (!D) return;
        const de = [
          (H[0] + q[0]) / 2,
          (H[1] + q[1]) / 2,
          (H[2] + q[2]) / 2
        ], j = ra(H, q);
        if (D.type === "CFT") {
          const W = F(D.b, D.h, D.tw ?? D.b * 0.05), le = new dt(W.concFill, re);
          le.position.set(...de), le.rotation.setFromRotationMatrix(j), le.userData.e = N, v.add(le);
          const we = new dt(W.steelFillGeom, xe);
          we.position.set(...de), we.rotation.setFromRotationMatrix(j), we.userData.e = N, v.add(we);
          const ze = new Ft(W.outline, Me);
          ze.position.set(...de), ze.rotation.setFromRotationMatrix(j), ze.userData.e = N, v.add(ze);
        } else {
          let W, le, we;
          switch (D.type) {
            case "rect":
              W = z(D.b, D.h), le = re, we = ue;
              break;
            case "circ":
              W = S(D.d), le = re, we = ue;
              break;
            case "I":
              W = M(D.b, D.h, D.tf, D.tw), le = xe, we = Me;
              break;
            case "HSS":
              W = P(D.b, D.h, D.tw ?? D.b * 0.05), le = xe, we = Me;
              break;
            case "CFT":
              W = F(D.b, D.h, D.tw ?? D.b * 0.05), le = xe, we = Me;
              break;
            case "L":
              W = B(D.b ?? D.h, D.h, D.t ?? D.tw ?? 3e-3), le = xe, we = Me;
              break;
            case "2L":
              W = ae(D.b ?? D.h, D.h, D.t ?? D.tw ?? 3e-3, D.dis ?? 0.01), le = xe, we = Me;
              break;
            case "C":
            case "coldC":
              W = V(D.b, D.h, D.tf ?? D.t ?? 3e-3, D.tw ?? D.t ?? 3e-3), le = xe, we = Me;
              break;
            case "2C":
              W = ie(D.b, D.h, D.tf ?? 5e-3, D.tw ?? 5e-3, D.dis ?? 0.01), le = xe, we = Me;
              break;
            case "T":
              W = J(D.b, D.h, D.tf ?? 0.01, D.tw ?? 6e-3), le = xe, we = Me;
              break;
            case "pipe":
              W = T(D.d, D.tw ?? D.d * 0.05), le = xe, we = Me;
              break;
            default:
              return;
          }
          const ze = new dt(W.fill, le);
          ze.position.set(...de), ze.rotation.setFromRotationMatrix(j), ze.userData.e = N, v.add(ze);
          const Fe = new Ft(W.outline, we);
          Fe.position.set(...de), Fe.rotation.setFromRotationMatrix(j), Fe.userData.e = N, v.add(Fe);
        }
        const O = yr(D);
        if (O) {
          const le = [
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
          ].includes(D.type) ? "#ff9900" : "#00ccff", we = new Bt(O, le, "transparent");
          we.position.set(de[0], de[1], de[2]);
          const ze = 0.05 * c.gridSize.rawVal * 0.5;
          we.updateScale(ze * ((g == null ? void 0 : g.rawVal) ?? 1)), A.add(we);
        }
      });
    }), ve.derive(() => {
      var _a, _b;
      const se = m.val, te = (_a = t.elements) == null ? void 0 : _a.rawVal;
      if (te) for (const ne of v.children) {
        const Y = (_b = ne.userData) == null ? void 0 : _b.e;
        if (Y === void 0) continue;
        const ee = te[Y], G = ee && se[ee[0]], C = ee && se[ee[1]];
        !G || !C || (ne.position.set((G[0] + C[0]) / 2, (G[1] + C[1]) / 2, (G[2] + C[2]) / 2), ne.rotation.setFromRotationMatrix(ra(G, C)));
      }
    }), g && ve.derive(() => {
      if (g.val, !c.sections.rawVal) return;
      const se = 0.05 * c.gridSize.val * 0.5;
      A.children.forEach((te) => {
        te instanceof Bt && te.updateScale(se * g.rawVal);
      });
    }), ve.derive(() => {
      v.visible = c.sections.val;
    }), ve.derive(() => {
      A.visible = c.sectionLabels.val;
    }), v;
  }
  function gr(t) {
    if (!t) return null;
    const c = t.type, m = (F, B) => [
      F,
      B
    ], g = (F, B) => [
      m(-F / 2, -B / 2),
      m(F / 2, -B / 2),
      m(F / 2, B / 2),
      m(-F / 2, B / 2)
    ], v = (F, B = 24) => {
      const ae = F / 2, V = [];
      for (let ie = 0; ie < B; ie++) {
        const J = 2 * Math.PI * ie / B;
        V.push(m(ae * Math.cos(J), ae * Math.sin(J)));
      }
      return V;
    }, A = t.b ?? 0, z = t.h ?? 0, S = t.d ?? 0, M = t.tw ?? t.t ?? 0, P = t.tf ?? t.t ?? 0;
    switch (c) {
      case "rect":
        return A && z ? {
          contorno: g(A, z)
        } : null;
      case "circ":
        return S ? {
          contorno: v(S)
        } : null;
      case "pipe":
        return S && M ? {
          contorno: v(S),
          huecos: [
            v(S - 2 * M).reverse()
          ]
        } : null;
      case "HSS":
        return A && z && M ? {
          contorno: g(A, z),
          huecos: [
            g(A - 2 * M, z - 2 * (P || M)).reverse()
          ]
        } : null;
      case "CFT":
        return A && z ? {
          contorno: g(A, z)
        } : null;
      case "I":
        return A && z && M && P ? {
          contorno: [
            m(-A / 2, -z / 2),
            m(A / 2, -z / 2),
            m(A / 2, -z / 2 + P),
            m(M / 2, -z / 2 + P),
            m(M / 2, z / 2 - P),
            m(A / 2, z / 2 - P),
            m(A / 2, z / 2),
            m(-A / 2, z / 2),
            m(-A / 2, z / 2 - P),
            m(-M / 2, z / 2 - P),
            m(-M / 2, -z / 2 + P),
            m(-A / 2, -z / 2 + P)
          ]
        } : null;
      case "C":
      case "2C":
      case "coldC":
        return A && z && M && P ? {
          contorno: [
            m(-A / 2, -z / 2),
            m(A / 2, -z / 2),
            m(A / 2, -z / 2 + P),
            m(-A / 2 + M, -z / 2 + P),
            m(-A / 2 + M, z / 2 - P),
            m(A / 2, z / 2 - P),
            m(A / 2, z / 2),
            m(-A / 2, z / 2)
          ]
        } : null;
      case "T":
        return A && z && M && P ? {
          contorno: [
            m(-M / 2, -z / 2),
            m(M / 2, -z / 2),
            m(M / 2, z / 2 - P),
            m(A / 2, z / 2 - P),
            m(A / 2, z / 2),
            m(-A / 2, z / 2),
            m(-A / 2, z / 2 - P),
            m(-M / 2, z / 2 - P)
          ]
        } : null;
      case "L":
      case "2L":
        return A && z && M ? {
          contorno: [
            m(-A / 2, -z / 2),
            m(A / 2, -z / 2),
            m(A / 2, -z / 2 + M),
            m(-A / 2 + M, -z / 2 + M),
            m(-A / 2 + M, z / 2),
            m(-A / 2, z / 2)
          ]
        } : null;
      default:
        return A && z ? {
          contorno: g(A, z)
        } : S ? {
          contorno: v(S)
        } : null;
    }
  }
  function br(t, c, m) {
    if (!t || t <= 0 || !c || !m || c <= 0 || m <= 0) return null;
    const g = Math.sqrt(Math.sqrt(m / c)), v = Math.sqrt(t / g), A = t / v;
    return !isFinite(v) || !isFinite(A) || v <= 0 || A <= 0 ? null : {
      contorno: [
        [
          -v / 2,
          -A / 2
        ],
        [
          v / 2,
          -A / 2
        ],
        [
          v / 2,
          A / 2
        ],
        [
          -v / 2,
          A / 2
        ]
      ]
    };
  }
  function Mr(t) {
    const c = new Ao();
    t.contorno.forEach(([m, g], v) => v ? c.lineTo(m, g) : c.moveTo(m, g)), c.closePath();
    for (const m of t.huecos ?? []) {
      const g = new Ui();
      m.forEach(([v, A], z) => z ? g.lineTo(v, A) : g.moveTo(v, A)), g.closePath(), c.holes.push(g);
    }
    return c;
  }
  function vr(t, c, m) {
    const g = new pt();
    g.name = "extrusion";
    const v = new La({
      color: 8369151,
      transparent: true,
      opacity: 0.92,
      side: It
    }), A = new La({
      color: 12623968,
      transparent: true,
      opacity: 0.85,
      side: It
    }), z = new La({
      color: 11583173,
      transparent: true,
      opacity: 0.85,
      side: It
    }), S = new pt();
    S.add(new Zs(16777215, 0.55));
    const M = new ia(16777215, 0.75);
    M.position.set(30, 25, 40);
    const P = new ia(16777215, 0.35);
    P.position.set(-25, -20, 15), S.add(M, P);
    let F = 0;
    return ve.derive(() => {
      var _a, _b, _c, _d, _e;
      const B = ((_a = c.extruded) == null ? void 0 : _a.val) ?? false;
      globalThis.__extrusionDebug = {
        corridas: ++F,
        on: B
      }, g.visible = B;
      for (const ue of [
        ...g.children
      ]) ue !== S && (g.remove(ue), (_c = (_b = ue.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
      if (g.children.includes(S) || g.add(S), !B) return;
      const ae = m.val ?? [], V = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], ie = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, J = ie.sectionShapes ?? /* @__PURE__ */ new Map(), T = ie.thicknesses ?? /* @__PURE__ */ new Map();
      let re = "";
      try {
        V.forEach((ue, xe) => {
          var _a2, _b2, _c2;
          if (ue.length === 2) {
            let Me = gr(J.get(xe)), Q = true;
            if (Me || (Me = br((_a2 = ie.areas) == null ? void 0 : _a2.get(xe), (_b2 = ie.momentsOfInertiaY) == null ? void 0 : _b2.get(xe), (_c2 = ie.momentsOfInertiaZ) == null ? void 0 : _c2.get(xe)), Q = false), !Me) return;
            const se = ae[ue[0]], te = ae[ue[1]];
            if (!se || !te) return;
            const ne = Math.hypot(te[0] - se[0], te[1] - se[1], te[2] - se[2]);
            if (ne < 1e-9) return;
            const Y = new Xi(Mr(Me), {
              depth: ne,
              bevelEnabled: false,
              curveSegments: 4
            });
            Y.applyMatrix4(new la().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
            const ee = new dt(Y, Q ? v : A);
            ee.position.set(se[0], se[1], se[2]), ee.rotation.setFromRotationMatrix(ra(se, te)), g.add(ee);
            return;
          }
          if (ue.length === 3 || ue.length === 4) {
            const Me = T.get(xe);
            if (!Me || Me <= 0) return;
            const Q = ue.map((W) => ae[W]).filter(Boolean);
            if (Q.length < 3) return;
            const se = [
              Q[1][0] - Q[0][0],
              Q[1][1] - Q[0][1],
              Q[1][2] - Q[0][2]
            ], te = [
              Q[2][0] - Q[0][0],
              Q[2][1] - Q[0][1],
              Q[2][2] - Q[0][2]
            ], ne = se[1] * te[2] - se[2] * te[1], Y = se[2] * te[0] - se[0] * te[2], ee = se[0] * te[1] - se[1] * te[0], G = Math.hypot(ne, Y, ee);
            if (G < 1e-12) return;
            const C = [
              ne / G,
              Y / G,
              ee / G
            ], N = [], H = (W) => Q.map((le) => [
              le[0] + C[0] * W,
              le[1] + C[1] * W,
              le[2] + C[2] * W
            ]), q = Math.abs(C[2]) > 0.5, oe = C[2] > 0 ? -1 : 1, D = H(q ? 0 : +Me / 2), de = H(q ? oe * Me : -Me / 2), j = (W, le, we) => N.push(...W, ...le, ...we);
            for (const W of [
              D,
              de
            ]) j(W[0], W[1], W[2]), W.length === 4 && j(W[0], W[2], W[3]);
            for (let W = 0; W < Q.length; W++) {
              const le = (W + 1) % Q.length;
              j(D[W], de[W], de[le]), j(D[W], de[le], D[le]);
            }
            const O = new De();
            O.setAttribute("position", new Rt(N, 3)), O.computeVertexNormals(), g.add(new dt(O, z));
          }
        });
      } catch (ue) {
        re = String((ue == null ? void 0 : ue.message) ?? ue);
      }
      globalThis.__extrusionDebug = {
        corridas: F,
        on: B,
        fallo: re,
        nElementos: V.length,
        nFormas: J.size,
        nEspesores: T.size,
        mallas: g.children.length - 1
      };
    }), g;
  }
  function js(t, c, m = 0) {
    const g = [
      c[0] - t[0],
      c[1] - t[1],
      c[2] - t[2]
    ], v = Math.hypot(g[0], g[1], g[2]) || 1, A = g[0] / v, z = g[1] / v, S = g[2] / v, M = Math.sqrt(A * A + z * z);
    let P, F, B;
    if (M < 1e-9) {
      const ae = S > 0 ? 1 : -1;
      P = [
        0,
        0,
        ae
      ], F = [
        1,
        0,
        0
      ], B = [
        0,
        ae,
        0
      ];
    } else P = [
      A,
      z,
      S
    ], F = [
      -A * S / M,
      -z * S / M,
      M
    ], B = [
      z / M,
      -A / M,
      0
    ];
    if (Math.abs(m) > 1e-12) {
      const ae = m * Math.PI / 180, V = Math.cos(ae), ie = Math.sin(ae), J = F.map((re, ue) => V * re + ie * B[ue]), T = B.map((re, ue) => -ie * F[ue] + V * re);
      F = J, B = T;
    }
    return {
      e1: P,
      e2: F,
      e3: B
    };
  }
  function Ya(t, c) {
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
  function ei(t, c) {
    const m = (g) => g.map((v) => -v);
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
  class ta extends pt {
    constructor(c, m, g, v, A, z, S) {
      super();
      const M = new Ao().moveTo(0, 0).lineTo(0, z[1]).lineTo(g, z[1]).lineTo(g, 0).lineTo(0, 0), P = M.getPoints(), F = new De().setFromPoints(P);
      this.lines = new Ft(F, new mt({
        color: to().resultOutline
      })), this.lines.position.set(...c), this.lines.rotation.setFromRotationMatrix(v), S && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const B = new sa(M), ae = new wt({
        color: z[1] > 0 ? 24435 : 11411474,
        side: It
      });
      this.mesh = new dt(B, ae), this.mesh.position.set(...c), this.mesh.rotation.setFromRotationMatrix(v), S && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Bt(`${A[1].toFixed(4)}`), this.normalizedResult = z, this.textPosition = Eo([
        c,
        m
      ]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(v), this.add(this.text);
    }
    updateScale(c) {
      this.lines.scale.set(1, c * 2, 1), this.mesh.scale.set(1, c * 2, 1), this.text.updateScale(c * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * c);
    }
    dispose() {
      this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
    }
  }
  class Ba extends pt {
    constructor(c, m, g, v, A, z, S) {
      super();
      const M = A[0] * g / (A[0] + A[1]), P = A[0] * A[1] > 0;
      if (this.text = new Bt(`${A[0].toFixed(4)}`), this.text2 = new Bt(`${(A[1] * -1).toFixed(4)}`), this.normalizedResult = z, this.textPosition = Na(c, m), this.text2Position = Na(m, c), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(v), this.text2.rotation.setFromRotationMatrix(v), this.add(this.text, this.text2), P) {
        const F = new Ao().moveTo(0, 0).lineTo(0, z[0]).lineTo(M, 0).lineTo(0, 0), B = new Ao().moveTo(M, 0).lineTo(g, -z[1]).lineTo(g, 0).lineTo(M, 0), ae = F.getPoints(), V = B.getPoints(), ie = new De().setFromPoints(ae), J = new De().setFromPoints(V), T = new mt({
          color: to().resultOutline
        });
        this.lines = new Ft(ie, T), this.lines2 = new Ft(J, T), this.lines.position.set(...c), this.lines2.position.set(...c), this.lines.rotation.setFromRotationMatrix(v), this.lines2.rotation.setFromRotationMatrix(v), S && this.lines.rotateX(Math.PI / 2), S && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
        const re = new sa(F), ue = new sa(B), xe = new wt({
          color: z[0] > 0 ? 24435 : 11411474,
          side: It
        }), Me = new wt({
          color: -z[1] > 0 ? 24435 : 11411474,
          side: It
        });
        this.mesh = new dt(re, xe), this.mesh2 = new dt(ue, Me), this.mesh.position.set(...c), this.mesh2.position.set(...c), this.mesh.rotation.setFromRotationMatrix(v), this.mesh2.rotation.setFromRotationMatrix(v), S && this.mesh.rotateX(Math.PI / 2), S && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
      } else {
        const F = new Ao().moveTo(0, 0).lineTo(0, z[0]).lineTo(g, -z[1]).lineTo(g, 0).lineTo(0, 0), B = F.getPoints(), ae = new De().setFromPoints(B);
        this.lines = new Ft(ae, new mt({
          color: to().resultOutline
        })), this.lines.position.set(...c), this.lines.rotation.setFromRotationMatrix(v), S && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
        const V = new sa(F), ie = new wt({
          color: z[0] > 0 ? 24435 : 11411474,
          side: It
        });
        this.mesh = new dt(V, ie), this.mesh.position.set(...c), this.mesh.rotation.setFromRotationMatrix(v), S && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
      }
    }
    updateScale(c) {
      var _a, _b;
      this.lines.scale.set(1, c * 2, 1), (_a = this.lines2) == null ? void 0 : _a.scale.set(1, c * 2, 1), this.mesh.scale.set(1, c * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, c * 2, 1), this.text.updateScale(c * 0.6), this.text2.updateScale(c * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * c), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * c);
    }
    dispose() {
      var _a, _b, _c, _d, _e, _f;
      this.lines.geometry.dispose(), (_a = this.lines2) == null ? void 0 : _a.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
    }
  }
  var ti = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(ti || {});
  function _r(t, c, m, g) {
    const v = () => {
      const S = m.rawVal;
      if (!(S == null ? void 0 : S.length)) return 0.05 * c.gridSize.rawVal;
      const M = [
        1 / 0,
        1 / 0,
        1 / 0
      ], P = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const B of S) for (let ae = 0; ae < 3; ae++) B[ae] < M[ae] && (M[ae] = B[ae]), B[ae] > P[ae] && (P[ae] = B[ae]);
      const F = Math.hypot(P[0] - M[0], P[1] - M[1], P[2] - M[2]);
      return !isFinite(F) || F <= 0 ? 0.05 * c.gridSize.rawVal : 0.025 * F;
    }, A = new pt(), z = {
      normals: ta,
      shearsY: ta,
      shearsZ: ta,
      torsions: ta,
      bendingsY: Ba,
      bendingsZ: Ba
    };
    return ve.derive(() => {
      var _a, _b;
      if (c.deformedShape.val, m.val, c.frameResults.val == "none") return;
      A.children.forEach((M) => M.dispose()), A.clear();
      const S = ti[c.frameResults.rawVal];
      (_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.rawVal[S]) == null ? void 0 : _b.forEach((M, P) => {
        var _a2, _b2, _c, _d, _e, _f;
        const F = ((_a2 = t.elements) == null ? void 0 : _a2.rawVal[P]) ?? [
          0,
          1
        ], B = m.rawVal[F[0]], ae = m.rawVal[F[1]];
        if (!B || !ae) return;
        const V = new R(...ae).distanceTo(new R(...B)), ie = kr((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[S]), J = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, P)) ?? 0, T = js(B, ae, J), re = ei(S, T), ue = new R(...T.e1), xe = new R(...re), Me = new la().makeBasis(ue, xe, ue.clone().cross(xe)), [Q, se] = Ya(S, M), te = z[S] === Ba ? [
          Q,
          -se
        ] : [
          Q,
          se
        ], ne = te.map((ee) => ee / (ie === 0 ? 1 : ie)), Y = new z[S](B, ae, V, Me, te, ne, false);
        Y.updateScale(v() * g.rawVal), A.add(Y);
      });
    }), ve.derive(() => {
      if (g.val, c.frameResults.rawVal == "none") return;
      c.gridSize.val;
      const S = v();
      A.children.forEach((M) => M.updateScale(S * g.rawVal));
    }), ve.derive(() => {
      A.visible = c.frameResults.val != "none";
    }), A;
  }
  function kr(t) {
    let c = 0;
    return t == null ? void 0 : t.forEach((m) => {
      const g = Math.max(...(m ?? [
        0,
        0
      ]).map((v) => Math.abs(v)));
      g > c && (c = g);
    }), c;
  }
  class Sr extends pt {
    constructor(c, m, g) {
      super();
      const v = m === Za.reactions;
      g[0] && (this.xText1 = new Bt(`${v ? "Fx" : "Dx"}: ` + g[0].toFixed(4))), g[3] && (this.xText2 = new Bt(`${v ? "Mx" : "Rx"}: ` + g[3].toFixed(4))), g[1] && (this.yText1 = new Bt(`${v ? "Fy" : "Dy"}: ` + g[1].toFixed(4))), g[4] && (this.yText2 = new Bt(`${v ? "My" : "Ry"}: ` + g[4].toFixed(4))), g[2] && (this.zText1 = new Bt(`${v ? "Fz" : "Dz"}: ` + g[2].toFixed(4))), g[5] && (this.zText2 = new Bt(`${v ? "Mz" : "Rz"}: ` + g[5].toFixed(4))), (g[0] || g[3]) && (this.xArrow = new qn(new R(1, 0, 0), new R(0, 0, 0), 1, 15637248, 0.3, 0.3)), (g[1] || g[4]) && (this.yArrow = new qn(new R(0, 1, 0), new R(0, 0, 0), 1, 15637248, 0.3, 0.3)), (g[2] || g[5]) && (this.zArrow = new qn(new R(0, 0, 1), new R(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...c), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
    }
    updateScale(c) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      (_a = this.xArrow) == null ? void 0 : _a.scale.set(c, c, c), (_b = this.yArrow) == null ? void 0 : _b.scale.set(c, c, c), (_c = this.zArrow) == null ? void 0 : _c.scale.set(c, c, c), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * c, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * c, 0, 0.5 * c), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * c, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * c, 0.5 * c), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * c), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * c + 0.5 * c), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * c), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * c), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * c), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * c), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * c), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * c);
    }
    dispose() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      (_a = this.xArrow) == null ? void 0 : _a.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
    }
  }
  var Za = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(Za || {});
  function Pr(t, c, m, g) {
    const v = new pt();
    return ve.derive(() => {
      var _a, _b;
      if (c.deformedShape.val, c.nodeResults.val == "none") return;
      v.children.forEach((S) => S.dispose()), v.clear();
      const A = Za[c.nodeResults.rawVal], z = 0.05 * c.gridSize.val;
      (_b = (_a = t.deformOutputs) == null ? void 0 : _a.val[A]) == null ? void 0 : _b.forEach((S, M) => {
        const P = new Sr(m.rawVal[M], A, S ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ]);
        P.updateScale(z * g.rawVal), v.add(P);
      });
    }), ve.derive(() => {
      if (g.val, c.nodeResults.rawVal == "none") return;
      const A = 0.05 * c.gridSize.val;
      v.children.forEach((z) => z.updateScale(A * g.rawVal));
    }), ve.derive(() => {
      v.visible = c.nodeResults.val != "none";
    }), v;
  }
  function zr({ drawingObj: t, gridObj: c, scene: m, getActiveCamera: g, controls: v, gridSize: A, derivedDisplayScale: z, rendererElm: S, viewerRender: M }) {
    var _a2;
    const P = new Va(), F = new Zi(), B = (e) => {
      const n = S.getBoundingClientRect(), a = e.clientX - n.left, o = e.clientY - n.top, s = n.width || 1, l = n.height || 1;
      if (!!window.__hekatanSplitMode) {
        const i = s / 2;
        if (a >= i) return F.x = (a - i) / i * 2 - 1, F.y = -(o / l) * 2 + 1, window.__hekatanSplitCamera ?? g();
        F.x = a / i * 2 - 1;
      } else F.x = a / s * 2 - 1;
      return F.y = -(o / l) * 2 + 1, g();
    }, ae = new dt(new Un(1e4, 1e4), new wt({
      side: It,
      transparent: true,
      opacity: 0,
      depthWrite: false
    }));
    ae.visible = true, ae.frustumCulled = false, m.add(ae);
    const V = (e, n, a) => {
      const o = new dt(new Un(1e4, 1e4), new wt({
        side: It,
        transparent: true,
        opacity: 0,
        depthWrite: false
      }));
      return o.rotation.set(e, n, a), o.visible = false, o.frustumCulled = false, m.add(o), o;
    }, ie = V(Math.PI / 2, 0, 0), J = V(0, Math.PI / 2, 0);
    let T = false, re = null, ue = null, xe = null;
    const Me = new Ft(new De(), new mt({
      color: 3718648,
      depthTest: false,
      transparent: true,
      opacity: 0.95
    }));
    Me.name = "ref-ifc-cadena", Me.renderOrder = 1e3, Me.frustumCulled = false, Me.visible = false, m.add(Me);
    const Q = (e, n, a) => Math.round(e * 1e3) + "," + Math.round(n * 1e3) + "," + Math.round(a * 1e3), se = (e) => {
      const n = /* @__PURE__ */ new Map();
      for (let a = 0; a + 0 < e.length / 6; a++) {
        const o = 6 * a;
        for (const s of [
          Q(e[o], e[o + 1], e[o + 2]),
          Q(e[o + 3], e[o + 4], e[o + 5])
        ]) {
          const l = n.get(s);
          l ? l.push(a) : n.set(s, [
            a
          ]);
        }
      }
      return n;
    }, te = (e) => {
      const { S: n, adj: a } = e, o = (y, k) => new R(n[6 * y + 3 * k], n[6 * y + 3 * k + 1], n[6 * y + 3 * k + 2]), s = /* @__PURE__ */ new Set([
        e.s
      ]), l = (y, k) => {
        const $ = [];
        let I = y, L = k;
        for (let U = 0; U < 3e3; U++) {
          const he = (a.get(Q(L.x, L.y, L.z)) || []).filter((_e) => !s.has(_e));
          if (he.length !== 1) break;
          const X = he[0], K = o(X, 0), pe = o(X, 1), ge = K.distanceTo(L) < pe.distanceTo(L) ? pe : K, Ce = L.clone().sub(I).normalize(), Te = ge.clone().sub(L).normalize();
          if (Ce.dot(Te) < Math.cos(35 * Math.PI / 180)) break;
          s.add(X), $.push(ge), I = L, L = ge;
        }
        return $;
      }, f = o(e.s, 0), i = o(e.s, 1), r = l(f, i), u = l(i, f), d = [
        ...u.reverse(),
        f,
        i,
        ...r
      ], _ = u.length;
      if (d.length < 6) return d;
      const x = [], w = [];
      for (let y = 1; y < d.length; y++) x.push(d[y].distanceTo(d[y - 1]));
      for (let y = 1; y < d.length - 1; y++) {
        const k = d[y].clone().sub(d[y - 1]).normalize(), $ = d[y + 1].clone().sub(d[y]).normalize();
        w.push(Math.acos(Math.max(-1, Math.min(1, k.dot($)))) / Math.max(1e-6, (x[y - 1] + x[y]) / 2));
      }
      const b = w.map((y, k) => {
        let $ = 0, I = 0;
        for (let L = k - 1; L <= k + 1; L++) L >= 0 && L < w.length && ($ += w[L], I++);
        return $ / I;
      }), E = [];
      for (let y = 3; y < b.length - 3; y++) {
        const k = (b[y - 3] + b[y - 2] + b[y - 1]) / 3, $ = (b[y + 1] + b[y + 2] + b[y + 3]) / 3, I = Math.min(k, $), L = Math.max(k, $);
        L > 0.03 && L / Math.max(I, 1e-6) > 2.2 && Math.abs(b[y] - (k + $) / 2) < L && (!E.length || y - E[E.length - 1] > 3) && E.push(y + 1);
      }
      let p = 0, h = d.length - 1;
      for (const y of E) y <= _ && y > p && (p = y), y > _ && y < h && (h = y);
      return d.slice(p, h + 1);
    }, ne = (e) => {
      if (xe = e, !e || e.length < 2) {
        Me.visible = false;
        return;
      }
      Me.geometry.dispose(), Me.geometry = new De().setFromPoints(e), Me.visible = true;
    }, Y = (e) => {
      let n = 0;
      for (let _ = 1; _ < e.length - 1; _++) {
        const x = e[_].clone().sub(e[_ - 1]).normalize(), w = e[_ + 1].clone().sub(e[_]).normalize();
        n += Math.acos(Math.max(-1, Math.min(1, x.dot(w))));
      }
      const a = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
      if (n < 3 * Math.PI / 180) return [
        e[0].toArray(),
        e[e.length - 1].toArray()
      ];
      const o = String(window.__hekatanArcModo ?? "angulo"), s = o === "x" ? 0 : o === "y" ? 1 : o === "z" ? 2 : -1, l = [
        0
      ];
      for (let _ = 1; _ < e.length; _++) l.push(l[_ - 1] + e[_].distanceTo(e[_ - 1]));
      const f = (_, x) => {
        for (let w = 1; w < e.length; w++) {
          const b = _(e[w - 1], w - 1), E = _(e[w], w);
          if (b <= x && x <= E || E <= x && x <= b) {
            const p = Math.abs(E - b) < 1e-12 ? 0 : (x - b) / (E - b);
            return e[w - 1].clone().lerp(e[w], p);
          }
        }
        return e[e.length - 1].clone();
      }, i = [], r = s >= 0 ? e[0].getComponent(s) : 0, u = s >= 0 ? e[e.length - 1].getComponent(s) : 0, d = s >= 0 && Math.abs(u - r) > 1e-6 && e.every((_, x) => x === 0 || (_.getComponent(s) - e[x - 1].getComponent(s)) * (u - r) >= -1e-6);
      for (let _ = 0; _ <= a; _++) {
        const x = d ? f((w) => w.getComponent(s), r + (u - r) * _ / a) : f((w, b) => l[b], l[l.length - 1] * _ / a);
        i.push([
          x.x,
          x.y,
          x.z
        ]);
      }
      return i[0] = e[0].toArray(), i[a] = e[e.length - 1].toArray(), i;
    };
    window.__hekatanCadenaIfc = () => (xe || []).map((e) => [
      e.x,
      e.y,
      e.z
    ]);
    const ee = /* @__PURE__ */ new Map(), G = (e) => {
      const n = ee.get(e.id);
      if (n) return n;
      const a = e.geometry.getAttribute("position"), o = a ? Math.floor(a.count / 3) : 0, s = new Float64Array(o * 9), l = new Float64Array(o * 3), f = new Int32Array(o * 3).fill(-1);
      if (a) {
        e.updateMatrixWorld();
        const r = new R();
        for (let b = 0; b < o * 3; b++) r.fromBufferAttribute(a, b).applyMatrix4(e.matrixWorld), s[3 * b] = r.x, s[3 * b + 1] = r.y, s[3 * b + 2] = r.z;
        const u = new R(), d = new R(), _ = new R(), x = (b) => Math.round(s[3 * b] * 1e3) + "," + Math.round(s[3 * b + 1] * 1e3) + "," + Math.round(s[3 * b + 2] * 1e3), w = /* @__PURE__ */ new Map();
        for (let b = 0; b < o; b++) {
          const E = 3 * b;
          u.set(s[3 * (E + 1)] - s[3 * E], s[3 * (E + 1) + 1] - s[3 * E + 1], s[3 * (E + 1) + 2] - s[3 * E + 2]), d.set(s[3 * (E + 2)] - s[3 * E], s[3 * (E + 2) + 1] - s[3 * E + 1], s[3 * (E + 2) + 2] - s[3 * E + 2]), _.crossVectors(u, d).normalize(), l[3 * b] = _.x, l[3 * b + 1] = _.y, l[3 * b + 2] = _.z;
          for (let p = 0; p < 3; p++) {
            const h = x(E + p), y = x(E + (p + 1) % 3), k = h < y ? h + "|" + y : y + "|" + h, $ = w.get(k);
            $ ? $.push(b, p) : w.set(k, [
              b,
              p
            ]);
          }
        }
        for (const b of w.values()) b.length === 4 && (f[3 * b[0] + b[1]] = b[2], f[3 * b[2] + b[3]] = b[0]);
      }
      const i = {
        V: s,
        N: l,
        vec: f,
        n: o
      };
      return ee.set(e.id, i), i;
    }, C = new dt(new De(), new wt({
      color: 3718648,
      transparent: true,
      opacity: 0.35,
      depthTest: false,
      side: It
    }));
    C.name = "ref-ifc-cara", C.renderOrder = 999, C.frustumCulled = false, C.visible = false, m.add(C);
    let N = null;
    const H = (e, n) => {
      const a = Math.cos(12 * Math.PI / 180), o = Math.cos(80 * Math.PI / 180), s = [
        e.N[3 * n],
        e.N[3 * n + 1],
        e.N[3 * n + 2]
      ], l = new Uint8Array(e.n), f = [], i = [
        n
      ];
      for (l[n] = 1; i.length && f.length < 4e4; ) {
        const r = i.pop();
        f.push(r);
        for (let u = 0; u < 3; u++) {
          const d = e.vec[3 * r + u];
          if (d < 0 || l[d]) continue;
          const _ = e.N[3 * r] * e.N[3 * d] + e.N[3 * r + 1] * e.N[3 * d + 1] + e.N[3 * r + 2] * e.N[3 * d + 2], x = s[0] * e.N[3 * d] + s[1] * e.N[3 * d + 1] + s[2] * e.N[3 * d + 2];
          _ >= a && x >= o && (l[d] = 1, i.push(d));
        }
      }
      return f;
    }, q = (e, n, a) => {
      if (!e || n < 0 || !a) {
        N && (N = null, C.visible = false);
        return;
      }
      if (N && N.m === e && N.tris.indexOf(n) >= 0) {
        N.punto = a.clone();
        return;
      }
      const o = G(e), s = H(o, n), l = new Float32Array(s.length * 9), f = new R();
      let i = true;
      s.forEach((r, u) => {
        for (let d = 0; d < 9; d++) l[9 * u + d] = o.V[9 * r + d];
        f.x += o.N[3 * r], f.y += o.N[3 * r + 1], f.z += o.N[3 * r + 2];
      }), f.normalize();
      for (const r of s) if (f.x * o.N[3 * r] + f.y * o.N[3 * r + 1] + f.z * o.N[3 * r + 2] < Math.cos(5 * Math.PI / 180)) {
        i = false;
        break;
      }
      C.geometry.dispose(), C.geometry = new De(), C.geometry.setAttribute("position", new bt(l, 3)), C.material.color.set(i ? 3718648 : 16096779), C.visible = true, N = {
        m: e,
        t0: n,
        tris: s,
        normal: f,
        plana: i,
        punto: a.clone()
      };
    }, oe = (e, n) => {
      const a = new Uint8Array(e.n);
      for (const d of n) a[d] = 1;
      const o = (d) => Math.round(e.V[3 * d] * 1e3) + "," + Math.round(e.V[3 * d + 1] * 1e3) + "," + Math.round(e.V[3 * d + 2] * 1e3), s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
      for (const d of n) for (let _ = 0; _ < 3; _++) {
        const x = e.vec[3 * d + _];
        if (x >= 0 && a[x]) continue;
        const w = 3 * d + _, b = 3 * d + (_ + 1) % 3, E = o(w), p = o(b);
        l.set(E, new R(e.V[3 * w], e.V[3 * w + 1], e.V[3 * w + 2])), l.set(p, new R(e.V[3 * b], e.V[3 * b + 1], e.V[3 * b + 2])), (s.get(E) || s.set(E, []).get(E)).push(p), (s.get(p) || s.set(p, []).get(p)).push(E);
      }
      const f = /* @__PURE__ */ new Set();
      let i = [];
      for (const d of s.keys()) {
        if (f.has(d)) continue;
        const _ = [
          d
        ];
        f.add(d);
        let x = "", w = d;
        for (let b = 0; b < 1e5; b++) {
          const E = (s.get(w) || []).find((p) => p !== x && !f.has(p));
          if (!E) break;
          _.push(E), f.add(E), x = w, w = E;
        }
        _.length > i.length && (i = _);
      }
      const r = i.map((d) => l.get(d)), u = [];
      for (let d = 0; d < r.length; d++) {
        const _ = r[(d + r.length - 1) % r.length], x = r[d], w = r[(d + 1) % r.length];
        if (x.distanceTo(_) < 1e-3) continue;
        const b = x.clone().sub(_).normalize(), E = w.clone().sub(x).normalize();
        b.dot(E) > Math.cos(3 * Math.PI / 180) || u.push(x);
      }
      return u;
    }, D = (e, n, a) => {
      const s = new Va(n.clone().addScaledVector(a, -2e-3), a.clone().negate(), 0, 3).intersectObject(e, false);
      return s.length ? s[0].distance + 2e-3 : null;
    };
    window.__hekatanRaycast = (e, n, a, o = 2) => {
      const s = new R(e[0], e[1], e[2]), l = new R(n[0], n[1], n[2]).normalize();
      let f = null;
      for (const i of [
        1,
        -1
      ]) {
        const u = new Va(s, l.clone().multiplyScalar(i), 0, o).intersectObjects(a, false);
        u.length && (f == null || u[0].distance < f) && (f = u[0].distance);
      }
      return f;
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
    const de = /* @__PURE__ */ new Map(), j = new rn(new De(), new mt({
      color: 16498468,
      transparent: true,
      opacity: 0.35,
      depthTest: true
    }));
    j.name = "ref-ifc-bordes", j.frustumCulled = false, j.visible = false, m.add(j);
    const O = 1, W = (e, n, a) => Math.floor(e / O) + "," + Math.floor(n / O) + "," + Math.floor(a / O), le = (e) => {
      const n = de.get(e.id);
      if (n) return n;
      const a = e.geometry.getAttribute("position"), o = [], s = /* @__PURE__ */ new Map();
      if (a) {
        e.updateMatrixWorld();
        const f = Math.floor(a.count / 3), i = new Float64Array(a.count * 3), r = new R();
        for (let p = 0; p < a.count; p++) r.fromBufferAttribute(a, p).applyMatrix4(e.matrixWorld), i[3 * p] = r.x, i[3 * p + 1] = r.y, i[3 * p + 2] = r.z;
        const u = (p) => Math.round(i[3 * p] * 1e3) + "," + Math.round(i[3 * p + 1] * 1e3) + "," + Math.round(i[3 * p + 2] * 1e3), d = new Float64Array(f * 3), _ = new R(), x = new R(), w = new R();
        for (let p = 0; p < f; p++) {
          const h = 3 * p, y = 3 * p + 1, k = 3 * p + 2;
          _.set(i[3 * y] - i[3 * h], i[3 * y + 1] - i[3 * h + 1], i[3 * y + 2] - i[3 * h + 2]), x.set(i[3 * k] - i[3 * h], i[3 * k + 1] - i[3 * h + 1], i[3 * k + 2] - i[3 * h + 2]), w.crossVectors(_, x).normalize(), d[3 * p] = w.x, d[3 * p + 1] = w.y, d[3 * p + 2] = w.z;
        }
        const b = /* @__PURE__ */ new Map();
        for (let p = 0; p < f; p++) for (let h = 0; h < 3; h++) {
          const y = 3 * p + h, k = 3 * p + (h + 1) % 3, $ = u(y), I = u(k), L = $ < I ? $ + "|" + I : I + "|" + $, U = b.get(L);
          U ? U.push(p) : b.set(L, [
            p,
            y,
            k
          ]);
        }
        const E = Math.cos(25 * Math.PI / 180);
        for (const p of b.values()) {
          const h = p[0], y = p[1], k = p[2];
          let $ = p.length === 3;
          if (!$ && p.length === 4) {
            const L = p[3], U = d[3 * h] * d[3 * L] + d[3 * h + 1] * d[3 * L + 1] + d[3 * h + 2] * d[3 * L + 2];
            $ = Math.abs(U) < E;
          }
          if (!$) continue;
          const I = o.length / 6;
          o.push(i[3 * y], i[3 * y + 1], i[3 * y + 2], i[3 * k], i[3 * k + 1], i[3 * k + 2]);
          for (const [L, U, he] of [
            [
              i[3 * y],
              i[3 * y + 1],
              i[3 * y + 2]
            ],
            [
              i[3 * k],
              i[3 * k + 1],
              i[3 * k + 2]
            ],
            [
              (i[3 * y] + i[3 * k]) / 2,
              (i[3 * y + 1] + i[3 * k + 1]) / 2,
              (i[3 * y + 2] + i[3 * k + 2]) / 2
            ]
          ]) {
            const X = W(L, U, he), K = s.get(X);
            K ? K[K.length - 1] !== I && K.push(I) : s.set(X, [
              I
            ]);
          }
        }
      }
      const l = {
        segs: new Float32Array(o),
        celdas: s
      };
      return de.set(e.id, l), l;
    };
    let we = "";
    const ze = (e) => {
      const n = e.map((f) => f.id).join(",");
      if (n === we) return;
      we = n;
      const a = e.map((f) => le(f).segs);
      let o = 0;
      for (const f of a) o += f.length;
      const s = new Float32Array(o);
      let l = 0;
      for (const f of a) s.set(f, l), l += f.length;
      j.geometry.dispose(), j.geometry = new De(), j.geometry.setAttribute("position", new bt(s, 3)), j.visible = o > 0 && window.__hekatanRefIfcBordes !== false;
    };
    window.__hekatanRefIfcBordesRefrescar = () => {
      j.visible = we !== "" && window.__hekatanRefIfcBordes !== false, M();
    }, window.__hekatanBordesIfc = () => {
      let e = 0;
      for (const n of de.values()) e += n.segs.length / 6;
      return e;
    };
    const Fe = (e, n) => {
      const a = window.__hekatanCursorPx;
      if (!a) return null;
      const o = le(e), s = o.segs, l = Math.floor(n.x / O), f = Math.floor(n.y / O), i = Math.floor(n.z / O), r = /* @__PURE__ */ new Set();
      let u = Dn, d = null, _ = Dn, x = null, w = -1;
      const b = new R(), E = new R();
      for (let p = -1; p <= 1; p++) for (let h = -1; h <= 1; h++) for (let y = -1; y <= 1; y++) {
        const k = o.celdas.get(l + p + "," + (f + h) + "," + (i + y));
        if (k) for (const $ of k) {
          if (r.has($)) continue;
          r.add($);
          const I = 6 * $;
          b.set(s[I], s[I + 1], s[I + 2]), E.set(s[I + 3], s[I + 4], s[I + 5]);
          const L = Qn(b.x, b.y, b.z), U = Qn(E.x, E.y, E.z);
          if (!L || !U) continue;
          const he = Math.hypot(L.x - a.x, L.y - a.y), X = Math.hypot(U.x - a.x, U.y - a.y);
          he < u && (u = he, d = b.clone()), X < u && (u = X, d = E.clone());
          const K = U.x - L.x, pe = U.y - L.y, ge = K * K + pe * pe || 1e-9;
          let Ce = ((a.x - L.x) * K + (a.y - L.y) * pe) / ge;
          Ce = Math.max(0, Math.min(1, Ce));
          const Te = Math.hypot(a.x - (L.x + Ce * K), a.y - (L.y + Ce * pe));
          Te < _ && (_ = Te, x = b.clone().lerp(E, Ce), w = $);
        }
      }
      return w >= 0 && (o.adj || (o.adj = se(o.segs)), ue = {
        S: o.segs,
        adj: o.adj,
        s: w
      }), d ? {
        tipo: "ifcVert",
        punto: d
      } : x ? {
        tipo: "ifcEdge",
        punto: x
      } : null;
    }, tt = () => {
      var _a3, _b, _c;
      if (window.__hekatanRefIfcSnap === false) return null;
      const e = [];
      if (m.traverse((l) => {
        var _a4;
        ((_a4 = l.userData) == null ? void 0 : _a4.refIfc) && l.isMesh && e.push(l);
      }), !e.length) return j.visible = false, we = "", null;
      ze(e);
      const n = P.intersectObjects(e, false).filter((l) => {
        const f = l.object.material;
        return (f && f.clippingPlanes || []).every((r) => r.distanceToPoint(l.point) >= 0);
      });
      if (!n.length) return null;
      const a = n[0], o = n[1];
      ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? q(a.object, a.faceIndex ?? -1, a.point) : N && q(null, -1, null);
      const s = Fe(a.object, a.point);
      if (s) return re = {
        tipo: s.tipo
      }, [
        {
          ...a,
          point: s.punto
        }
      ];
      if (o && o.object === a.object && o.distance - a.distance <= 1.2) {
        const l = a.point.clone().add(o.point).multiplyScalar(0.5);
        return re = {
          tipo: "ifcAxis"
        }, [
          {
            ...a,
            point: l
          }
        ];
      }
      return re = {
        tipo: "ifc"
      }, [
        a
      ];
    };
    let st = "", Ue = new Float32Array(0);
    const Z = new rn(new De(), new mt({
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
      const a = [];
      m.traverse((l) => {
        var _a3;
        ((_a3 = l.userData) == null ? void 0 : _a3.refIfc) && l.isMesh && a.push(l);
      });
      const o = JSON.stringify(n) + "|" + a.map((l) => l.id).join(",");
      if (o === st) return Ue;
      st = o;
      const s = [];
      if (n.length && a.length) {
        const l = [
          new R(),
          new R(),
          new R()
        ];
        for (const f of a) {
          const i = f.geometry.getAttribute("position");
          if (i) {
            f.updateMatrixWorld();
            for (let r = 0; r + 2 < i.count; r += 3) {
              for (let u = 0; u < 3; u++) l[u].fromBufferAttribute(i, r + u).applyMatrix4(f.matrixWorld);
              for (const [u, d] of n) {
                const _ = [
                  l[0].getComponent(u) - d,
                  l[1].getComponent(u) - d,
                  l[2].getComponent(u) - d
                ], x = [];
                for (let w = 0; w < 3; w++) {
                  const b = l[w], E = l[(w + 1) % 3], p = _[w], h = _[(w + 1) % 3];
                  (p < 0 && h >= 0 || p >= 0 && h < 0) && x.push(b.clone().lerp(E, p / (p - h)));
                }
                x.length === 2 && s.push(x[0].x, x[0].y, x[0].z, x[1].x, x[1].y, x[1].z);
              }
            }
          }
        }
      }
      return Ue = new Float32Array(s), Z.geometry.dispose(), Z.geometry = new De(), Z.geometry.setAttribute("position", new bt(Ue, 3)), Z.visible = Ue.length > 0, Ue;
    };
    let fe = null, me = null;
    const ke = (e, n) => {
      const a = ce();
      if (!a.length) return null;
      let o = Dn * 2, s = null, l = -1;
      const f = new R(), i = new R();
      for (let r = 0; r + 5 < a.length; r += 6) {
        f.set(a[r], a[r + 1], a[r + 2]), i.set(a[r + 3], a[r + 4], a[r + 5]);
        const u = Qn(f.x, f.y, f.z), d = Qn(i.x, i.y, i.z);
        if (!u || !d) continue;
        const _ = d.x - u.x, x = d.y - u.y, w = _ * _ + x * x || 1e-9;
        let b = ((e - u.x) * _ + (n - u.y) * x) / w;
        b = Math.max(0, Math.min(1, b));
        const E = Math.hypot(e - (u.x + b * _), n - (u.y + b * x));
        E < o && (o = E, s = f.clone().lerp(i, b), l = r / 6);
      }
      return l >= 0 && (me !== a && (fe = se(a), me = a), ue = {
        S: a,
        adj: fe,
        s: l
      }), s;
    };
    let $e = null;
    window.__hekatanSeccionIfc = () => ce().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
      const n = ce(), a = [], o = Math.max(1, Math.floor(n.length / 6 / e));
      for (let s = 0; s + 2 < n.length; s += 6 * o) a.push([
        n[s],
        n[s + 1],
        n[s + 2]
      ]);
      return a;
    };
    const Ae = () => {
      re = null;
      const e = tt();
      if (e) return e;
      if (T) return P.intersectObjects([
        ae
      ], false);
      if (ie.visible = !!window.__hekatanGridPlaneXZ, J.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Qt.visible) {
        const o = P.intersectObjects([
          Qt,
          nn,
          bn
        ], false);
        if (o.length > 0) return o;
      }
      const a = [
        ae
      ];
      return ie.visible && a.push(ie), J.visible && a.push(J), Fn.visible && so.length > 0 && a.push(...so), P.intersectObjects(a, false);
    }, Le = new oa(new De(), new aa()), je = new oa(new De(), new aa({
      color: "gray",
      sizeAttenuation: false,
      size: 6
    })), We = new oa(new De(), new aa({
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
    const ut = new R(), Oe = (e, n, a, o, s, l) => {
      const f = o - e, i = s - n, r = l - a, u = Math.hypot(f, i, r);
      if (u < 0.01) {
        Ve.style.display = "none";
        return;
      }
      Pe = [
        e,
        n,
        a
      ], ot = [
        f / u,
        i / u,
        r / u
      ], ut.set((e + o) / 2, (n + s) / 2, (a + l) / 2), ut.project(g());
      const d = S.getBoundingClientRect(), _ = d.left + (ut.x * 0.5 + 0.5) * d.width, x = d.top + (-ut.y * 0.5 + 0.5) * d.height;
      Ve.style.left = _ + "px", Ve.style.top = x + "px", Ve.style.display = "block";
      const w = new R(e, n, a).project(g()), b = new R(o, s, l).project(g()), E = d.left + (w.x * 0.5 + 0.5) * d.width, p = d.top + (-w.y * 0.5 + 0.5) * d.height, h = d.left + (b.x * 0.5 + 0.5) * d.width, y = d.top + (-b.y * 0.5 + 0.5) * d.height;
      let k = Math.atan2(-(y - p), h - E) * 180 / Math.PI;
      if (k < 0 && (k += 360), et.textContent = `${Math.round(k) % 360}\xB0`, et.style.left = h + "px", et.style.top = y + 34 + "px", et.style.display = "block", !Ye) {
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
    }, en = () => {
      Ve.style.display = "none", et.style.display = "none", Pe = null, ot = null, Ye = false, document.activeElement === Ve && Ve.blur();
    }, yt = (e) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h;
      const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
      if (n === "offset") {
        On = e, be(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), Ve.blur();
        try {
          (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
        } catch {
        }
        return;
      }
      if (n === "circle" && Qe.length === 1) {
        const d = Qe[0];
        Qe = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, d[0], d[1], d[2], e), be(`\u2713 C\xEDrculo r=${e} m en (${d[0].toFixed(2)}, ${d[1].toFixed(2)}, ${d[2].toFixed(2)}).`);
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
        At = e, be(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{
          col: "columna",
          wall: "pared",
          extp: "extrusi\xF3n punto\u2192l\xEDnea",
          extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea"
        }[n]}.`), Ve.blur();
        return;
      }
      if (!Pe || !ot || !t.polylines) return;
      let a = ot[0], o = ot[1], s = ot[2];
      zt === "x" ? (a = Math.sign(a) || 1, o = 0, s = 0) : zt === "y" ? (a = 0, o = Math.sign(o) || 1, s = 0) : zt === "z" && (a = 0, o = 0, s = Math.sign(s) || 1);
      const l = Pe[0] + a * e, f = Pe[1] + o * e, i = Pe[2] + s * e;
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [
        ...t.points.rawVal,
        [
          l,
          f,
          i
        ]
      ];
      const r = t.polylines.rawVal, u = r.length ? r[r.length - 1] : [];
      t.polylines.val = [
        ...r.slice(0, -1),
        [
          ...u,
          t.points.rawVal.length - 1
        ]
      ], Ve.blur();
      try {
        (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
      } catch {
      }
      M();
    }, ln = (e) => {
      let n = e.trim().toLowerCase().replace(/m$/g, "").trim();
      if (!n) return null;
      const a = n.startsWith("@");
      if (a && (n = n.slice(1)), n.includes("<")) {
        const s = n.split("<").map((l) => parseFloat(l.trim()));
        if (s.some(isNaN)) return null;
        if (s.length === 2) {
          const [l, f] = s;
          return a ? {
            kind: "relPolar",
            L: l,
            ang: f
          } : {
            kind: "absPolar",
            L: l,
            ang: f
          };
        }
        if (s.length === 3 && a) {
          const [l, f, i] = s;
          return {
            kind: "relSpherical",
            L: l,
            az: f,
            el: i
          };
        }
        return null;
      }
      if (n.includes(",")) {
        const s = n.split(",").map((r) => parseFloat(r.trim()));
        if (s.some(isNaN)) return null;
        const [l, f, i = 0] = s;
        return a ? {
          kind: "relCart",
          dx: l,
          dy: f,
          dz: i
        } : {
          kind: "absCart",
          x: l,
          y: f,
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
        const a = e.ang * Math.PI / 180;
        return [
          n[0] + e.L * Math.cos(a),
          n[1] + e.L * Math.sin(a),
          n[2]
        ];
      }
      if (e.kind === "relPolar") {
        if (!Pe) return null;
        const a = e.ang * Math.PI / 180;
        return [
          Pe[0] + e.L * Math.cos(a),
          Pe[1] + e.L * Math.sin(a),
          Pe[2]
        ];
      }
      if (e.kind === "relSpherical") {
        if (!Pe) return null;
        const a = e.az * Math.PI / 180, o = e.el * Math.PI / 180, s = e.L * Math.cos(o);
        return [
          Pe[0] + s * Math.cos(a),
          Pe[1] + s * Math.sin(a),
          Pe[2] + e.L * Math.sin(o)
        ];
      }
      return null;
    }, it = (e) => {
      var _a3, _b;
      Aa(new R(e[0], e[1], e[2]), null), Pe = e, Ye = false;
      try {
        Ve.select();
      } catch {
      }
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      M();
      try {
        (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
      } catch {
      }
    };
    window.__hekatanTypeCoord = (e) => {
      var _a3;
      const n = ln(e);
      if (!n) return false;
      if (n.kind === "length") return yt(n.L), true;
      const a = Zt(n);
      if (!a) return false;
      Aa(new R(a[0], a[1], a[2]), null), Pe = a, Ve.blur();
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
        const a = ln(Ve.value);
        if (!a) return;
        if (Ye = false, a.kind === "length") yt(a.L), be(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
        else {
          const o = Zt(a);
          if (!o) return;
          it(o);
          const s = a.kind;
          be(`\u270F ${s} \u2192 (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)})`);
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
    const Se = new Ft(new De().setFromPoints([
      new R(0, 0, 0),
      new R(0, 0, 0)
    ]), new ho({
      color: 2282478,
      dashSize: 0.2,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    }));
    Se.frustumCulled = false, Se.visible = false, Se.name = "rubberBand", m.add(Se), window.__hekatanRubberBand = Se;
    const Ee = new Ft(new De(), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.9
    }));
    Ee.frustumCulled = false, Ee.visible = false, m.add(Ee);
    let Ge = [];
    const nt = new Ft(new De(), new mt({
      color: 16763904,
      transparent: true,
      opacity: 0.95
    }));
    nt.frustumCulled = false, nt.visible = false, nt.renderOrder = 999, m.add(nt);
    let lt = [];
    const at = document.createElement("div");
    at.id = "hk-measure-label", at.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(at);
    const rt = (e) => {
      var _a3, _b;
      const n = B(e);
      if (!n) return null;
      P.setFromCamera(F, n);
      let a = null, o = null;
      const s = P.intersectObjects(m.children, true).filter((b) => {
        var _a4;
        return b.object.isMesh && b.object !== Mt && b.object !== ct && ((_a4 = b.object.parent) == null ? void 0 : _a4.name) !== "hekatan-reshape-grips" && b.object.visible !== false;
      });
      if (s.length) {
        const b = s[0], E = b.point;
        a = [
          E.x,
          E.y,
          E.z
        ];
        const h = (_b = (_a3 = b.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
        h && b.face && (o = [
          b.face.a,
          b.face.b,
          b.face.c
        ].map((y) => {
          const k = new R().fromBufferAttribute(h, y);
          return b.object.localToWorld(k), [
            k.x,
            k.y,
            k.z
          ];
        }));
      } else {
        const b = Ae();
        if (b.length) {
          const E = b[0].point;
          a = [
            E.x,
            E.y,
            E.z
          ];
        }
      }
      if (!a) return null;
      const l = S.getBoundingClientRect(), f = (b) => {
        const E = new R(b[0], b[1], b[2]).project(n);
        return [
          l.left + (E.x * 0.5 + 0.5) * l.width,
          l.top + (-E.y * 0.5 + 0.5) * l.height
        ];
      }, i = [
        e.clientX,
        e.clientY
      ], r = 14;
      let u = a, d = r;
      const _ = (b) => {
        const E = f(b), p = Math.hypot(E[0] - i[0], E[1] - i[1]);
        p < d && (d = p, u = b);
      };
      for (const b of o ?? []) _(b);
      const x = window.__hekatanReshapeIgnorarPt, w = t.points.rawVal;
      for (let b = 0; b < w.length; b++) b !== x && _(w[b]);
      return u;
    }, St = () => {
      if (lt.length < 1) {
        at.style.display = "none";
        return;
      }
      const e = g(), n = lt[0], a = lt[1] ?? lt[0], s = new R((n[0] + a[0]) / 2, (n[1] + a[1]) / 2, (n[2] + a[2]) / 2).clone().project(e), l = S.getBoundingClientRect();
      at.style.left = l.left + (s.x * 0.5 + 0.5) * l.width + "px", at.style.top = l.top + (-s.y * 0.5 + 0.5) * l.height - 14 + "px", at.style.display = "block";
    };
    window.__hekatanMeasureRefresh = St, window.__hekatanClearMeasure = () => {
      lt = [], nt.visible = false, at.style.display = "none";
      try {
        M();
      } catch {
      }
    };
    try {
      (_a2 = v.addEventListener) == null ? void 0 : _a2.call(v, "change", St);
    } catch {
    }
    const ct = new dt(new De(), new wt({
      color: 16096779,
      transparent: true,
      opacity: 0.35,
      side: It,
      depthWrite: false
    }));
    ct.frustumCulled = false, ct.visible = false, ct.renderOrder = 998, ct.name = "hk-fill-preview", m.add(ct), S.addEventListener("pointerleave", () => {
      Xe.style.display = "none", ct.visible && (ct.visible = false, M());
    });
    const qt = (e) => {
      var _a3, _b, _c, _d;
      const n = t.points.rawVal, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Map(), s = (p, h) => {
        p !== h && ((o.get(p) ?? o.set(p, /* @__PURE__ */ new Set()).get(p)).add(h), (o.get(h) ?? o.set(h, /* @__PURE__ */ new Set()).get(h)).add(p));
      };
      for (const p of a) for (let h = 0; h + 1 < p.length; h++) s(p[h], p[h + 1]);
      const l = (p, h) => {
        var _a4;
        return !!((_a4 = o.get(p)) == null ? void 0 : _a4.has(h));
      }, f = [], i = /* @__PURE__ */ new Set(), r = [
        ...o.keys()
      ];
      for (const p of r) for (const h of o.get(p)) if (!(h < p)) {
        for (const y of o.get(h)) if (y !== p) for (const k of o.get(y)) {
          if (k === p || k === h || !l(k, p) || l(p, y) || l(h, k)) continue;
          const $ = [
            p,
            h,
            y,
            k
          ].slice().sort((I, L) => I - L).join("-");
          i.has($) || (i.add($), f.push([
            p,
            h,
            y,
            k
          ]));
        }
      }
      for (const p of r) for (const h of o.get(p)) if (!(h < p)) for (const y of o.get(h)) {
        if (y === p || !l(y, p)) continue;
        const k = [
          p,
          h,
          y
        ].slice().sort(($, I) => $ - I).join("-");
        i.has(k) || (i.add(k), f.push([
          p,
          h,
          y
        ]));
      }
      const u = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", d = (p) => u === "xy" ? [
        p[0],
        p[1]
      ] : u === "xz" ? [
        p[0],
        p[2]
      ] : [
        p[1],
        p[2]
      ], _ = d(e), x = (p, h) => {
        let y = false;
        for (let k = 0, $ = h.length - 1; k < h.length; $ = k++) {
          const I = h[k][0], L = h[k][1], U = h[$][0], he = h[$][1];
          L > p[1] != he > p[1] && p[0] < (U - I) * (p[1] - L) / (he - L) + I && (y = !y);
        }
        return y;
      }, w = (p) => {
        let h = 0;
        for (let y = 0, k = p.length - 1; y < p.length; k = y++) h += (p[k][0] + p[y][0]) * (p[k][1] - p[y][1]);
        return Math.abs(h) / 2;
      };
      let b = null, E = 1 / 0;
      for (const p of f) {
        const h = p.map((k) => d(n[k]));
        if (!x(_, h)) continue;
        const y = w(h);
        y < E && (E = y, b = p);
      }
      return b;
    }, _t = new pt(), Xt = new dt(new Un(1, 1), new wt({
      color: 2282478,
      transparent: true,
      opacity: 0.08,
      side: It,
      depthWrite: false
    })), Jt = new rn(new Ss(new Un(1, 1)), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.85
    })), Tt = new rn(new De(), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.3
    })), An = (e, n) => {
      const a = [], o = Math.ceil(e / n);
      for (let s = -o; s <= o; s++) {
        const l = s * n;
        a.push(-e, l, 0, e, l, 0), a.push(l, -e, 0, l, e, 0);
      }
      Tt.geometry.dispose(), Tt.geometry = new De(), Tt.geometry.setAttribute("position", new Rt(a, 3));
    };
    _t.add(Xt, Jt, Tt), _t.visible = false, _t.frustumCulled = false, m.add(_t);
    const $t = new pt();
    $t.frustumCulled = false, $t.visible = false, m.add($t);
    const Rn = (e) => {
      const n = new De().setFromPoints([
        new R(0, 0, 0),
        new R(0, 0, 0)
      ]), a = new ho({
        color: e,
        dashSize: 0.15,
        gapSize: 0.08,
        transparent: true,
        opacity: 0.5,
        linewidth: 1
      });
      return new Ft(n, a);
    }, xn = Rn(16711680), tn = Rn(65280), Kn = Rn(35071);
    $t.add(xn, tn, Kn);
    const no = [], da = (e) => e.traverse((n) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = n.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = n.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Kt = Rn(16761856);
    Kt.material.dashSize = 0.28, Kt.material.gapSize = 0.16, Kt.material.opacity = 0.9, Kt.frustumCulled = false, Kt.visible = false, Kt.renderOrder = 98, m.add(Kt);
    const mo = (e) => {
      const n = new De().setFromPoints([
        new R(0, 0, 0),
        new R(0, 0, 0),
        new R(0, 0, 0),
        new R(0, 0, 0)
      ]), a = new mt({
        color: e,
        transparent: true,
        opacity: 0.2,
        depthTest: false
      }), o = new Xs(n, a);
      return o.renderOrder = 997, o.frustumCulled = false, o;
    }, Gn = mo(3462041), oo = mo(16724804), Hn = mo(6333946), gn = new pt();
    gn.frustumCulled = false, gn.visible = false, m.add(gn), gn.add(Gn, oo, Hn);
    const wo = (e) => {
      const n = new Un(1, 1), a = new wt({
        color: e,
        transparent: true,
        opacity: 0.06,
        side: It,
        depthWrite: false
      }), o = new dt(n, a);
      return o.frustumCulled = false, o.renderOrder = 996, o;
    }, Qt = wo(3462041), nn = wo(16724804), bn = wo(6333946);
    gn.add(Qt, nn, bn);
    const Cn = (e, n, a, o) => {
      e.scale.set(2 * o, 2 * o, 1), a === "xy" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, 0, 0)) : a === "xz" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, Math.PI / 2, 0));
    }, Mn = document.createElement("div");
    Mn.id = "hk-refplane-badge", Mn.style.cssText = [
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
    ].join(";") + ";", document.body.appendChild(Mn), window.__hekatanSetOrthoPlanes = (e) => {
      var _a3;
      if (window.__hekatanShowOrthoPlanes = e, gn.visible = e, e) {
        const n = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], l = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [
          0,
          0,
          0
        ], f = window.__hekatanOrthoExt ?? 8;
        En(Gn, l, "xy", f), En(oo, l, "xz", f), En(Hn, l, "yz", f), Cn(Qt, l, "xy", f), Cn(nn, l, "xz", f), Cn(bn, l, "yz", f), Qt.material.opacity = 0.05, nn.material.opacity = 0.05, bn.material.opacity = 0.05;
      } else {
        const n = document.getElementById("hk-refplane-badge");
        n && (n.style.display = "none");
      }
      M();
    }, window.__hekatanSetOrthoExt = (e) => {
      var _a3;
      if (window.__hekatanOrthoExt = e, !gn.visible) {
        M();
        return;
      }
      const n = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], l = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [
        0,
        0,
        0
      ];
      En(Gn, l, "xy", e), En(oo, l, "xz", e), En(Hn, l, "yz", e), Cn(Qt, l, "xy", e), Cn(nn, l, "xz", e), Cn(bn, l, "yz", e), M();
    };
    const qa = (e) => {
      if (Qt.material.opacity = e === "xy" ? 0.09 : 0.025, nn.material.opacity = e === "xz" ? 0.09 : 0.025, bn.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
        const s = {
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
        Mn.style.background = s.bg, Mn.style.color = s.text, Mn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, Mn.style.display = "block";
      } else Mn.style.display = "none";
    }, En = (e, n, a, o) => {
      let s;
      a === "xy" ? s = [
        new R(n[0] - o, n[1] - o, n[2]),
        new R(n[0] + o, n[1] - o, n[2]),
        new R(n[0] + o, n[1] + o, n[2]),
        new R(n[0] - o, n[1] + o, n[2]),
        new R(n[0] - o, n[1] - o, n[2])
      ] : a === "xz" ? s = [
        new R(n[0] - o, n[1], n[2] - o),
        new R(n[0] + o, n[1], n[2] - o),
        new R(n[0] + o, n[1], n[2] + o),
        new R(n[0] - o, n[1], n[2] + o),
        new R(n[0] - o, n[1], n[2] - o)
      ] : s = [
        new R(n[0], n[1] - o, n[2] - o),
        new R(n[0], n[1] + o, n[2] - o),
        new R(n[0], n[1] + o, n[2] + o),
        new R(n[0], n[1] - o, n[2] + o),
        new R(n[0], n[1] - o, n[2] - o)
      ], e.geometry.setFromPoints(s);
    };
    let zt = null;
    window.__hekatanAxisLock = () => zt;
    let ao = null, Dt = null;
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
    const Ka = () => {
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
      const a = e.key.toLowerCase(), o = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
      if (e.key === "Enter" && o === "polyarea" && Ge.length >= 3) {
        const s = Yo();
        be(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), e.preventDefault();
        return;
      }
      if (a === "x" || a === "y" || a === "z") zt = zt === a ? null : a, Ka(), e.preventDefault();
      else if (e.key === "Escape") {
        const s = document.activeElement;
        s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), Pa(), e.preventDefault();
      } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
    }), window.__hekatanToggleOsnap = () => {
      const e = !(window.__hekatanOsnapOn ?? true);
      window.__hekatanOsnapOn = e, e || Ho(), be(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
    }, window.__hekatanTogglePolar = () => {
      const e = window.__hekatanPolarTrack === false;
      window.__hekatanPolarTrack = e, e || ($t.visible = false), be(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
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
        let a = document.getElementById("hk-ortho-badge");
        a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = [
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
        ].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = e ? "block" : "none";
      }
    };
    const $o = new R(), Lo = new R(), Ga = new R(), ni = (e) => {
      if (!zt) return null;
      const n = e[0], a = e[1], o = e[2];
      return zt === "x" ? ($o.set(n - 1e4, a, o), Lo.set(n + 1e4, a, o)) : zt === "y" ? ($o.set(n, a - 1e4, o), Lo.set(n, a + 1e4, o)) : ($o.set(n, a, o - 1e4), Lo.set(n, a, o + 1e4)), P.ray.distanceSqToSegment($o, Lo, null, Ga), Ga;
    };
    window.__hekatanProjectOnAxis = ni;
    const Gt = new Ft(new De().setFromPoints([
      new R(0, 0, 0),
      new R(0, 0, 0)
    ]), new mt({
      color: 16724804,
      transparent: true,
      opacity: 0.95,
      linewidth: 4,
      depthTest: false
    }));
    Gt.renderOrder = 998, Gt.frustumCulled = false, Gt.visible = false, m.add(Gt);
    let mn = -1, Tn = -1, Bn = -1;
    const Je = /* @__PURE__ */ new Set();
    window.__hekatanSelection = Je;
    const vn = new Ft(new De().setFromPoints([
      new R(),
      new R()
    ]), new mt({
      color: 16766720,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }));
    vn.renderOrder = 997, vn.frustumCulled = false, vn.visible = false, m.add(vn);
    const cn = new dt(new eo(0.02, 12, 12), new wt({
      color: 16766720,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    }));
    cn.renderOrder = 998, cn.visible = false, m.add(cn);
    const Vo = (e) => {
      const n = g();
      if (n.isOrthographicCamera) {
        const o = n, s = (o.top - o.bottom) / o.zoom;
        return Math.max(0.05, s * 6e-3);
      }
      const a = n.position.distanceTo(e);
      return Math.max(0.05, a / 10);
    }, Ha = () => {
      cn.visible && cn.scale.setScalar(Vo(cn.position));
    }, _n = new pt();
    _n.frustumCulled = false, m.add(_n);
    const Io = 2282478;
    let kn = null;
    const oi = (e, n, a, o) => {
      if (!t.points) return -1;
      const s = t.points.rawVal;
      let l = -1, f = o;
      for (let i = 0; i < s.length; i++) {
        const r = s[i];
        if (!r) continue;
        const u = Math.hypot(e - r[0], n - r[1], a - r[2]);
        u < f && (f = u, l = i);
      }
      return l;
    }, dn = () => {
      var _a3, _b, _c, _d, _e, _f, _g, _h;
      for (; _n.children.length; ) {
        const f = _n.children.pop();
        (_b = (_a3 = f.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = f.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
      const e = ((_e = t.points) == null ? void 0 : _e.rawVal) ?? [], n = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], o = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
      for (const f of Je) {
        const [i, ...r] = f.split(":");
        if (i === "pt") {
          const u = e[+r[0]];
          if (!u) continue;
          const d = new dt(new eo(0.025, 12, 12), new wt({
            color: Io,
            transparent: true,
            opacity: 0.9,
            depthTest: false
          }));
          d.position.set(u[0], u[1], u[2]), d.renderOrder = 999, d.__isSelectionPt = true, _n.add(d);
        } else if (i === "seg") {
          const u = n[+r[0]], d = e[u == null ? void 0 : u[+r[1]]], _ = e[u == null ? void 0 : u[+r[1] + 1]];
          if (!d || !_) continue;
          const x = new De().setFromPoints([
            new R(d[0], d[1], d[2]),
            new R(_[0], _[1], _[2])
          ]), w = new Ft(x, new mt({
            color: Io,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          w.renderOrder = 999, _n.add(w);
        } else if (i === "poly") {
          const d = n[+r[0]].map((w) => {
            const b = e[w];
            return b ? new R(b[0], b[1], b[2]) : null;
          }).filter(Boolean);
          if (d.length < 2) continue;
          const _ = new De().setFromPoints(d), x = new Ft(_, new mt({
            color: Io,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          x.renderOrder = 999, _n.add(x);
        } else if (i === "aux") {
          const u = o[+r[0]];
          if (!u || u.length !== 6) continue;
          const d = new De().setFromPoints([
            new R(u[0], u[1], u[2]),
            new R(u[3], u[4], u[5])
          ]), _ = new Ft(d, new mt({
            color: Io,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          _.renderOrder = 999, _n.add(_);
        }
      }
      const s = window.__hekatanUpdateSelectionPtScale;
      s && s();
      const l = window.__hekatanRefreshPropsPane;
      l && l();
      try {
        (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
      } catch {
      }
      M();
    };
    window.__hekatanRefreshSelection = dn, window.__hekatanSelectIds = (e) => {
      var _a3;
      Je.clear();
      for (const n of e) Je.add(n);
      try {
        (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return M(), Je.size;
    }, window.__hekatanClearSelection = () => {
      Je.clear(), dn();
    };
    const yo = (e, n, a, o, s, l, f, i, r) => {
      const u = f - o, d = i - s, _ = r - l, x = u * u + d * d + _ * _;
      if (x < 1e-12) return Math.hypot(e - o, n - s, a - l);
      let w = ((e - o) * u + (n - s) * d + (a - l) * _) / x;
      w = Math.max(0, Math.min(1, w));
      const b = o + w * u, E = s + w * d, p = l + w * _;
      return Math.hypot(e - b, n - E, a - p);
    }, Ro = (e, n, a, o) => {
      if (!t.polylines) return null;
      const s = t.polylines.rawVal, l = t.points.rawVal;
      let f = -1, i = -1, r = o;
      for (let u = 0; u < s.length; u++) {
        const d = s[u];
        for (let _ = 0; _ < d.length - 1; _++) {
          const x = l[d[_]], w = l[d[_ + 1]];
          if (!x || !w) continue;
          const b = yo(e, n, a, x[0], x[1], x[2], w[0], w[1], w[2]);
          b < r && (r = b, f = u, i = _);
        }
      }
      return f >= 0 ? {
        polyIdx: f,
        segIdx: i,
        dist: r
      } : null;
    }, Wa = (e, n, a, o) => {
      const s = window.__hekatanDrawingAuxLines, l = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
      let f = -1, i = o;
      for (let r = 0; r < l.length; r++) {
        const u = l[r];
        if (!u || u.length !== 6) continue;
        const d = yo(e, n, a, u[0], u[1], u[2], u[3], u[4], u[5]);
        d < i && (i = d, f = r);
      }
      return f;
    }, ai = (e) => {
      const n = window.__hekatanDrawingAuxLines, o = ((n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [])[e];
      if (!o || o.length !== 6) {
        Gt.visible = false;
        return;
      }
      Gt.geometry.setFromPoints([
        new R(o[0], o[1], o[2]),
        new R(o[3], o[4], o[5])
      ]), Gt.visible = true;
    }, si = (e, n = -1) => {
      var _a3, _b;
      if (!t.polylines) return;
      const a = t.polylines.rawVal[e], o = t.points.rawVal;
      if (!a || a.length < 2) {
        Gt.visible = false;
        return;
      }
      const s = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, l = [];
      if (s || n < 0 || n >= a.length - 1) for (const f of a) {
        const i = o[f];
        i && l.push(new R(i[0], i[1], i[2]));
      }
      else {
        const f = o[a[n]], i = o[a[n + 1]];
        f && l.push(new R(f[0], f[1], f[2])), i && l.push(new R(i[0], i[1], i[2]));
      }
      Gt.geometry.setFromPoints(l), Gt.visible = true;
    }, To = (e) => {
      var _a3;
      if (!t.polylines) return;
      const n = t.polylines.rawVal;
      if (e < 0 || e >= n.length) return;
      const a = n.filter((r, u) => u !== e), o = /* @__PURE__ */ new Set();
      for (const r of a) for (const u of r) o.add(u);
      const s = t.points.rawVal, l = /* @__PURE__ */ new Map(), f = [];
      for (let r = 0; r < s.length; r++) o.has(r) && (l.set(r, f.length), f.push(s[r]));
      const i = a.map((r) => r.map((u) => l.get(u)).filter((u) => u !== void 0));
      t.points.val = f, t.polylines.val = i, t.areas && (t.areas.val = t.areas.rawVal.filter((r) => r !== e).map((r) => r > e ? r - 1 : r)), Gt.visible = false, mn = -1, Tn = -1;
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
    }, Ja = (e, n) => {
      var _a3, _b, _c;
      if (!t.polylines) return;
      const a = t.polylines.rawVal;
      if (e < 0 || e >= a.length) return;
      if (((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
        To(e);
        return;
      }
      const s = a[e];
      if (n < 0 || n >= s.length - 1) return;
      if (s.length === 2) {
        To(e);
        return;
      }
      let l;
      n === 0 ? l = [
        s.slice(1)
      ] : n === s.length - 2 ? l = [
        s.slice(0, -1)
      ] : l = [
        s.slice(0, n + 1),
        s.slice(n + 1)
      ];
      const f = [
        ...a.slice(0, e),
        ...l,
        ...a.slice(e + 1)
      ], i = /* @__PURE__ */ new Set();
      for (const x of f) for (const w of x) i.add(w);
      const r = t.points.rawVal, u = /* @__PURE__ */ new Map(), d = [];
      for (let x = 0; x < r.length; x++) i.has(x) && (u.set(x, d.length), d.push(r[x]));
      const _ = f.map((x) => x.map((w) => u.get(w)).filter((w) => w !== void 0));
      if (t.points.val = d, t.polylines.val = _, t.areas) {
        const x = l.length - 1;
        t.areas.val = t.areas.rawVal.map((w) => w > e ? w + x : w);
      }
      Gt.visible = false, mn = -1, Tn = -1;
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
    };
    Le.geometry.setAttribute("position", new Rt(t.points.rawVal.flat(), 3)), Le.geometry.computeBoundingSphere(), Le.frustumCulled = false, je.frustumCulled = false, m.add(je), ae.position.set(0, 0, 0), ae.rotateX(Math.PI / 2), ae.geometry.rotateX(Math.PI / 2), ae.updateMatrixWorld(), t.polylines && (t.polylines.val = [
      ...t.polylines.rawVal,
      []
    ]), window.__hekatanDrawAt = (e, n, a) => {
      if (t.points.val = [
        ...t.points.rawVal,
        [
          e,
          n,
          a
        ]
      ], t.polylines) {
        const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
        t.polylines.val = [
          ...o.slice(0, -1),
          [
            ...s,
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
    const Bo = [];
    window.__hekatanCirculos = Bo;
    let Qa = [], Oa = "";
    const ja = () => {
      var _a3;
      const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = `${e.length}|${n.length}|${n.reduce((s, l) => s + l.length, 0)}`;
      if (a === Oa) return Qa;
      Oa = a;
      const o = [];
      for (const s of n) {
        const l = s.length;
        if (l < 6 || s[0] !== s[l - 1]) continue;
        const f = s.slice(0, l - 1).map((d) => e[d]).filter(Boolean);
        if (f.length < 5) continue;
        const i = [
          0,
          1,
          2
        ].map((d) => f.reduce((_, x) => _ + x[d], 0) / f.length), r = f.map((d) => Math.hypot(d[0] - i[0], d[1] - i[1], d[2] - i[2])), u = r.reduce((d, _) => d + _, 0) / r.length;
        u < 1e-9 || r.some((d) => Math.abs(d - u) > 5e-3 * u) || o.push({
          c: i,
          r: u
        });
      }
      return Qa = o;
    };
    window.__hekatanCentrosDeducidos = ja;
    const Do = () => !!window.__hekatanCurvasAux, No = (e, n) => {
      const a = window.__hekatanDrawingAuxLines;
      if (!a) return 0;
      Pt();
      const o = a.rawVal ?? a.val ?? [], s = [];
      for (let l = 0; l + 1 < e.length; l++) s.push([
        ...e[l],
        ...e[l + 1]
      ]);
      return n && e.length > 2 && s.push([
        ...e[e.length - 1],
        ...e[0]
      ]), a.val = [
        ...o,
        ...s
      ], s.length;
    };
    window.__hekatanDrawCircle = (e, n, a, o, s = window.__hekatanArcSegs ?? 12, l = "xy") => {
      var _a3;
      const f = Math.max(4, Math.round(s)), i = t.points.rawVal.length, r = [];
      for (let u = 0; u < f; u++) {
        const d = 2 * Math.PI * u / f, _ = o * Math.cos(d), x = o * Math.sin(d);
        let w;
        l === "xy" ? w = [
          e + _,
          n + x,
          a
        ] : l === "xz" ? w = [
          e + _,
          n,
          a + x
        ] : w = [
          e,
          n + _,
          a + x
        ], r.push(w);
      }
      if (Bo.push({
        c: [
          e,
          n,
          a
        ],
        r: o
      }), Do()) {
        No(r, true);
        return;
      }
      if (t.points.val = [
        ...t.points.rawVal,
        ...r
      ], t.polylines) {
        const u = [
          ...r.map((_, x) => i + x),
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
    }, window.__hekatanDrawArc = (e, n, a, o = window.__hekatanArcSegs ?? 12) => {
      var _a3;
      const s = Math.max(4, Math.round(o)), l = new R(...e), f = new R(...n), i = new R(...a), r = new R().subVectors(f, l), u = new R().subVectors(i, l), d = new R().crossVectors(r, u), _ = 2 * d.lengthSq();
      let x;
      if (_ < 1e-12) x = new R().addVectors(l, i).multiplyScalar(0.5);
      else {
        const ge = u.clone().multiplyScalar(r.lengthSq()).sub(r.clone().multiplyScalar(u.lengthSq())), Ce = new R().crossVectors(ge, d);
        x = l.clone().add(Ce.divideScalar(_));
      }
      const w = l.distanceTo(x), b = d.lengthSq() > 1e-12 ? d.clone().normalize() : new R(0, 1, 0), E = new R().subVectors(l, x).normalize(), p = new R().crossVectors(b, E).normalize(), h = (ge) => {
        const Ce = new R().subVectors(ge, x);
        return Math.atan2(Ce.dot(p), Ce.dot(E));
      }, y = (ge) => {
        let Ce = ge;
        for (; Ce < 0; ) Ce += 2 * Math.PI;
        for (; Ce >= 2 * Math.PI; ) Ce -= 2 * Math.PI;
        return Ce;
      }, k = y(h(f)), $ = y(h(i)), I = k <= $ ? $ : $ - 2 * Math.PI, L = t.points.rawVal.length, U = [], he = (ge) => {
        const Ce = E.clone().multiplyScalar(Math.cos(ge)).add(p.clone().multiplyScalar(Math.sin(ge)));
        return x.clone().add(Ce.multiplyScalar(w));
      }, X = String(window.__hekatanArcModo ?? "angulo"), K = X === "x" ? 0 : X === "y" ? 1 : X === "z" ? 2 : -1;
      let pe = false;
      if (K >= 0) {
        const ge = e[K], Ce = a[K], Te = 512;
        let _e = Math.abs(Ce - ge) > 1e-9, Be = ge;
        for (let Ie = 1; Ie <= Te && _e; Ie++) {
          const qe = he(I * Ie / Te).getComponent(K);
          (qe - Be) * (Ce - ge) < -1e-9 && (_e = false), Be = qe;
        }
        if (_e) {
          pe = true;
          for (let Ie = 0; Ie <= s; Ie++) {
            const qe = ge + (Ce - ge) * Ie / s;
            let Ne = 0, Re = I;
            for (let He = 0; He < 60; He++) {
              const ft = (Ne + Re) / 2;
              (he(ft).getComponent(K) - qe) * (Ce - ge) < 0 ? Ne = ft : Re = ft;
            }
            const Ze = he((Ne + Re) / 2);
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
          ], U[s] = [
            a[0],
            a[1],
            a[2]
          ];
        } else try {
          (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${X.toUpperCase()}: reparto por \xE1ngulo.`);
        } catch {
        }
      }
      if (!pe) for (let ge = 0; ge <= s; ge++) {
        const Ce = he(I * (ge / s));
        U.push([
          Ce.x,
          Ce.y,
          Ce.z
        ]);
      }
      if (Bo.push({
        c: [
          x.x,
          x.y,
          x.z
        ],
        r: w
      }), Do()) {
        No(U, false);
        return;
      }
      if (t.points.val = [
        ...t.points.rawVal,
        ...U
      ], t.polylines) {
        const ge = U.map((Te, _e) => L + _e), Ce = t.polylines.rawVal;
        t.polylines.val = [
          ...Ce.slice(0, -1),
          ge,
          []
        ];
      }
    };
    const es = () => {
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
      const a = es();
      if (!a) return {
        ok: false,
        msg: "no hay ninguna polil\xEDnea que dividir"
      };
      window.__hekatanPushUndo && window.__hekatanPushUndo();
      const o = [
        ...t.points.rawVal
      ], s = [
        a.pl[0]
      ];
      let l = 0;
      for (let i = 0; i + 1 < a.pl.length; i++) {
        const r = o[a.pl[i]], u = o[a.pl[i + 1]];
        l += Math.hypot(u[0] - r[0], u[1] - r[1], u[2] - r[2]);
        for (let d = 1; d < n; d++) {
          const _ = d / n;
          o.push([
            r[0] + (u[0] - r[0]) * _,
            r[1] + (u[1] - r[1]) * _,
            r[2] + (u[2] - r[2]) * _
          ]), s.push(o.length - 1);
        }
        s.push(a.pl[i + 1]);
      }
      const f = [
        ...t.polylines.rawVal
      ];
      f[a.i] = s, t.points.val = o, t.polylines.val = f;
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return M(), {
        ok: true,
        tramosAntes: a.pl.length - 1,
        tramosAhora: s.length - 1,
        nudosNuevos: s.length - a.pl.length,
        largo: +l.toFixed(4),
        tramoMedio: +(l / (s.length - 1)).toFixed(4)
      };
    }, window.__hekatanDesfasarCurva = (e) => {
      var _a3, _b, _c, _d;
      if (!isFinite(e) || Math.abs(e) < 1e-9) return {
        ok: false,
        msg: "la distancia no puede ser cero"
      };
      const n = es();
      if (!n) return {
        ok: false,
        msg: "no hay ninguna polil\xEDnea que desfasar"
      };
      const a = t.points.rawVal, o = n.pl.map((w) => new R(...a[w])), s = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy"), l = new R(...s === "xz" ? [
        0,
        1,
        0
      ] : s === "yz" ? [
        1,
        0,
        0
      ] : [
        0,
        0,
        1
      ]), f = (w, b) => {
        const E = new R().subVectors(b, w), p = new R().crossVectors(l, E);
        return p.lengthSq() < 1e-18 ? null : p.normalize();
      }, i = o.map((w, b) => {
        const E = b > 0 ? f(o[b - 1], o[b]) : null, p = b + 1 < o.length ? f(o[b], o[b + 1]) : null;
        if (E && p) {
          const h = E.clone().add(p);
          if (h.lengthSq() < 1e-12) return E;
          h.normalize();
          const y = h.dot(E);
          return h.multiplyScalar(Math.abs(y) < 1e-6 ? 1 : 1 / y);
        }
        return E ?? p;
      });
      if (i.some((w) => w === null)) return {
        ok: false,
        msg: "la curva es perpendicular al plano de trabajo; cambie de plano"
      };
      window.__hekatanPushUndo && window.__hekatanPushUndo();
      const r = [
        ...a
      ], u = [];
      o.forEach((w, b) => {
        const E = w.clone().addScaledVector(i[b], e);
        r.push([
          E.x,
          E.y,
          E.z
        ]), u.push(r.length - 1);
      });
      const d = [
        ...t.polylines.rawVal
      ];
      d.length && d[d.length - 1].length === 0 && d.pop(), d.push(u, []), t.points.val = r, t.polylines.val = d;
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      M();
      let _ = 1 / 0, x = -1 / 0;
      for (let w = 0; w + 1 < o.length; w++) {
        const b = o[w], E = o[w + 1], p = f(b, E), h = new R(...r[u[w]]), y = Math.abs(new R().subVectors(h, b).dot(p));
        _ = Math.min(_, y), x = Math.max(x, y);
      }
      return {
        ok: true,
        vertices: u.length,
        distancia: +e.toFixed(4),
        separacionMin: +_.toFixed(5),
        separacionMax: +x.toFixed(5)
      };
    }, window.__hekatanDrawCercha = (e) => {
      var _a3, _b;
      const n = e.luz, a = e.flecha, o = e.canto, s = Math.max(2, Math.round(e.panos)), l = e.tipo ?? "montantes", f = e.x0 ?? 0, i = e.y0 ?? 0, r = e.base ?? 0, u = Math.max(1, Math.round(e.copias ?? 1)), d = e.sep ?? 0;
      if (!(n > 0) || !(a > 0) || !(o > 0)) return {
        ok: false,
        msg: "luz, flecha y canto tienen que ser positivos"
      };
      const _ = (n * n / 4 + a * a) / (2 * a);
      if (o >= _) return {
        ok: false,
        msg: `el canto (${o} m) no puede llegar al radio (${_.toFixed(3)} m)`
      };
      const x = 2 * Math.asin(Math.min(1, n / 2 / _)), w = r - (_ - a), b = Math.atan2(r - w, f - (f + n / 2)), E = Math.atan2(r - w, f + n - (f + n / 2)), p = f + n / 2, h = (_e, Be, Ie) => [
        p + Be * Math.cos(_e),
        Ie,
        w + Be * Math.sin(_e)
      ];
      window.__hekatanPushUndo && window.__hekatanPushUndo();
      const y = [
        ...t.points.rawVal
      ], k = [
        ...((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []
      ];
      k.length && k[k.length - 1].length === 0 && k.pop();
      const $ = (_e) => (y.push(_e), y.length - 1), I = (_e, Be) => {
        k.push([
          _e,
          Be
        ]);
      }, L = [];
      let U = 0, he = 0;
      for (let _e = 0; _e < u; _e++) {
        const Be = i + _e * d, Ie = [], qe = [];
        for (let Ne = 0; Ne <= s; Ne++) {
          const Re = b + (E - b) * (Ne / s);
          Ie.push($(h(Re, _, Be))), qe.push($(h(Re, _ - o, Be)));
        }
        L.push(Ie), k.push([
          ...Ie
        ]), k.push([
          ...qe
        ]), I(Ie[0], qe[0]), I(Ie[s], qe[s]), he += 2;
        for (let Ne = 1; Ne < s; Ne++) if ((l === "montantes" || l === "howe") && (I(Ie[Ne], qe[Ne]), he++), l === "warren") Ne % 2 === 1 && (I(qe[Ne - 1], Ie[Ne]), I(Ie[Ne], qe[Ne + 1]), U += 2);
        else if (l === "howe") {
          const Re = Ne < s / 2 ? 1 : -1;
          I(qe[Ne], Ie[Ne + Re]), U++;
        }
      }
      if (e.correas && u > 1) for (let _e = 0; _e + 1 < u; _e++) for (let Be = 0; Be <= s; Be++) I(L[_e][Be], L[_e + 1][Be]);
      k.push([]), t.points.val = y, t.polylines && (t.polylines.val = k);
      try {
        (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
      } catch {
      }
      M();
      const X = (_e, Be) => h(b + (E - b) * (_e / s), Be, 0), K = (_e, Be) => Math.hypot(_e[0] - Be[0], _e[1] - Be[1], _e[2] - Be[2]), pe = [], ge = [], Ce = [];
      for (let _e = 0; _e < s; _e++) {
        pe.push(K(X(_e, _), X(_e + 1, _))), ge.push(K(X(_e, _ - o), X(_e + 1, _ - o)));
        const Be = [
          X(_e + 1, _)[0] - X(_e, _ - o)[0],
          0,
          X(_e + 1, _)[2] - X(_e, _ - o)[2]
        ];
        Ce.push(Math.atan2(Be[2], Be[0]) * 180 / Math.PI);
      }
      const Te = (_e) => +_e.toFixed(3);
      return {
        ok: true,
        luz: Te(n),
        flecha: Te(a),
        canto: Te(o),
        radio: Te(_),
        anguloAbarcado: Te(x * 180 / Math.PI),
        clave: Te(r + a),
        centro: [
          Te(p),
          Te(i),
          Te(w)
        ],
        panos: s,
        tipo: l,
        cerchas: u,
        separacion: Te(d),
        desarrolloSup: Te(_ * x),
        desarrolloInf: Te((_ - o) * x),
        tramoSupMin: Te(Math.min(...pe)),
        tramoSupMax: Te(Math.max(...pe)),
        tramoInfMin: Te(Math.min(...ge)),
        tramoInfMax: Te(Math.max(...ge)),
        anguloDiagMin: Te(Math.min(...Ce)),
        anguloDiagMax: Te(Math.max(...Ce)),
        montantes: he,
        diagonales: U,
        nudosNuevos: 2 * (s + 1) * u
      };
    }, window.__hekatanDrawPolinomio = (e, n = window.__hekatanArcSegs ?? 12) => {
      var _a3, _b, _c, _d;
      const a = e.length;
      if (a < 2) return {
        ok: false,
        msg: "faltan puntos"
      };
      const o = Math.max(a - 1, Math.round(n)), s = (I) => Math.max(...e.map((L) => L[I])) - Math.min(...e.map((L) => L[I])), l = [
        s(0),
        s(1),
        s(2)
      ], f = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), i = f === "xy" ? 2 : f === "xz" ? 1 : f === "yz" ? 0 : -1, r = i >= 0 && l[i] < 1e-6 ? i : l[2] <= l[0] && l[2] <= l[1] ? 2 : l[1] <= l[0] ? 1 : 0, u = r === 2 ? "xy" : r === 1 ? "xz" : "yz", d = [
        0,
        1,
        2
      ].filter((I) => I !== r), [_, x] = l[d[0]] >= l[d[1]] ? d : [
        d[1],
        d[0]
      ], w = e.map((I) => I[_]), b = e.map((I) => I[x]);
      for (let I = 0; I < a; I++) for (let L = I + 1; L < a; L++) if (Math.abs(w[I] - w[L]) < 1e-9) return {
        ok: false,
        msg: `dos puntos con la misma abscisa (${"XYZ"[_]} en ${u.toUpperCase()}): no hay polinomio que pase por los dos`
      };
      const E = (I) => {
        let L = 0;
        for (let U = 0; U < a; U++) {
          let he = 1;
          for (let X = 0; X < a; X++) X !== U && (he *= (I - w[X]) / (w[U] - w[X]));
          L += b[U] * he;
        }
        return L;
      }, p = (() => {
        const I = a, L = w.map((X) => Array.from({
          length: I
        }, (K, pe) => X ** pe)), U = b.slice();
        for (let X = 0; X < I; X++) {
          let K = X;
          for (let pe = X + 1; pe < I; pe++) Math.abs(L[pe][X]) > Math.abs(L[K][X]) && (K = pe);
          [L[X], L[K]] = [
            L[K],
            L[X]
          ], [U[X], U[K]] = [
            U[K],
            U[X]
          ];
          for (let pe = X + 1; pe < I; pe++) {
            const ge = L[pe][X] / L[X][X];
            for (let Ce = X; Ce < I; Ce++) L[pe][Ce] -= ge * L[X][Ce];
            U[pe] -= ge * U[X];
          }
        }
        const he = new Array(I).fill(0);
        for (let X = I - 1; X >= 0; X--) {
          let K = U[X];
          for (let pe = X + 1; pe < I; pe++) K -= L[X][pe] * he[pe];
          he[X] = K / L[X][X];
        }
        return he;
      })(), h = w[0], y = w[a - 1], k = t.points.rawVal.length, $ = [];
      for (let I = 0; I <= o; I++) {
        const L = h + (y - h) * I / o, U = [
          e[0][0],
          e[0][1],
          e[0][2]
        ];
        U[_] = L, U[x] = E(L), U[r] = e[0][r], $.push(U);
      }
      if ($[0] = [
        e[0][0],
        e[0][1],
        e[0][2]
      ], $[o] = [
        e[a - 1][0],
        e[a - 1][1],
        e[a - 1][2]
      ], Do()) return No($, false), {
        ok: true,
        plano: u,
        coef: p,
        ia: _,
        io: x
      };
      if (t.points.val = [
        ...t.points.rawVal,
        ...$
      ], t.polylines) {
        const I = $.map((U, he) => k + he), L = t.polylines.rawVal;
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
        coef: p,
        ia: _,
        io: x
      };
    };
    const ts = () => {
      var _a3, _b;
      const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), o = window.__hekatanDrawingAuxLines, s = (o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? [], l = [], f = [], i = /* @__PURE__ */ new Set(), r = (u) => [
        e[u][0],
        e[u][1],
        e[u][2]
      ];
      return [
        ...Je
      ].forEach((u) => {
        const d = u.split(":");
        if (d[0] === "aux") {
          const x = s[+d[1]];
          x && x.length === 6 && (l.push([
            [
              x[0],
              x[1],
              x[2]
            ],
            [
              x[3],
              x[4],
              x[5]
            ]
          ]), f.push(u));
          return;
        }
        const _ = d[0] === "poly" || d[0] === "seg" ? +d[1] : -1;
        if (!(_ < 0 || !n[_] || a.has(_))) if (d[0] === "poly") {
          if (i.has(_)) return;
          i.add(_);
          for (let x = 0; x + 1 < n[_].length; x++) l.push([
            r(n[_][x]),
            r(n[_][x + 1])
          ]);
        } else {
          const x = n[_][+d[2]], w = n[_][+d[2] + 1];
          x != null && w != null && !i.has(_) && l.push([
            r(x),
            r(w)
          ]);
        }
      }), {
        segs: l,
        auxIds: f
      };
    }, xo = (e, n) => Math.abs(e[0] - n[0]) < 1e-6 && Math.abs(e[1] - n[1]) < 1e-6 && Math.abs(e[2] - n[2]) < 1e-6, ii = (e) => {
      const n = new Array(e.length).fill(false), a = [];
      for (let o = 0; o < e.length; o++) {
        if (n[o]) continue;
        n[o] = true;
        const s = [
          e[o][0],
          e[o][1]
        ];
        let l = true;
        for (; l; ) {
          l = false;
          for (let i = 0; i < e.length; i++) {
            if (n[i]) continue;
            const [r, u] = e[i], d = s[s.length - 1], _ = s[0];
            xo(r, d) ? (s.push(u), n[i] = true, l = true) : xo(u, d) ? (s.push(r), n[i] = true, l = true) : xo(u, _) ? (s.unshift(r), n[i] = true, l = true) : xo(r, _) && (s.unshift(u), n[i] = true, l = true);
          }
        }
        const f = s.length > 3 && xo(s[0], s[s.length - 1]);
        f && s.pop(), a.push({
          pts: s,
          cerrada: f
        });
      }
      return a;
    }, ua = (e, n) => {
      let a = e.findIndex((o) => Math.abs(o[0] - n[0]) < 1e-3 && Math.abs(o[1] - n[1]) < 1e-3 && Math.abs(o[2] - n[2]) < 1e-3);
      return a < 0 && (a = e.length, e.push(n)), a;
    }, ns = (e) => {
      if (!e.length) return 0;
      Je.clear(), e.forEach((a) => Je.add(a));
      const n = e.length;
      return ga(), Je.clear(), n;
    };
    window.__hekatanRevolveSelection = (e, n, a, o = 360) => {
      var _a3, _b, _c;
      const s = Math.max(3, Math.round(a || 16)), l = Math.abs(o - 360) < 1e-9, f = s, i = l ? s : s + 1, { segs: r, auxIds: u } = ts();
      if (!r.length) return {
        anillos: 0,
        areas: 0,
        polo: false,
        guias: 0,
        msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)"
      };
      if (l && s % 2) return {
        anillos: 0,
        areas: 0,
        polo: false,
        guias: 0,
        msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)"
      };
      Pt();
      const d = t.points.rawVal, _ = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], x = [
        ...d
      ];
      let w = _.slice();
      w.length && w[w.length - 1].length === 0 && (w = w.slice(0, -1));
      const b = [
        ...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []
      ], E = /* @__PURE__ */ new Map(), p = (U) => U.map((he) => Math.round(he * 1e4)).join(","), h = (U) => Math.hypot(U[0] - e, U[1] - n) < 1e-6, y = (U) => {
        const he = p(U);
        let X = E.get(he);
        if (X) return X;
        if (h(U)) return X = [
          ua(x, U)
        ], E.set(he, X), X;
        const K = Math.hypot(U[0] - e, U[1] - n), pe = Math.atan2(U[1] - n, U[0] - e);
        X = [];
        for (let ge = 0; ge < i; ge++) {
          const Ce = pe + o * Math.PI / 180 * ge / s;
          X.push(ua(x, ge === 0 ? U : [
            e + K * Math.cos(Ce),
            n + K * Math.sin(Ce),
            U[2]
          ]));
        }
        return E.set(he, X), X;
      };
      let k = 0, $ = false;
      const I = (U) => {
        b.push(w.length), w.push([
          ...U,
          U[0]
        ]), k++;
      };
      for (const [U, he] of r) {
        const X = y(U), K = y(he);
        if (!(X.length === 1 && K.length === 1)) {
          if (X.length === 1 || K.length === 1) {
            $ = true;
            const pe = X.length === 1 ? X[0] : K[0], ge = X.length === 1 ? K : X;
            for (let Ce = 0; Ce + 2 <= f; Ce += 2) I([
              pe,
              ge[Ce % i],
              ge[(Ce + 1) % i],
              ge[(Ce + 2) % i]
            ]);
            continue;
          }
          for (let pe = 0; pe < f; pe++) I([
            X[pe],
            K[pe],
            K[(pe + 1) % i],
            X[(pe + 1) % i]
          ]);
        }
      }
      w.push([]), t.points.val = x, t.polylines && (t.polylines.val = w), t.areas && (t.areas.val = b);
      const L = ns(u);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      return M(), {
        anillos: E.size,
        areas: k,
        polo: $,
        guias: L
      };
    }, window.__hekatanLoftSelection = (e, n) => {
      var _a3, _b, _c;
      const { segs: a, auxIds: o } = ts(), s = ii(a), l = (K) => K.pts.every((pe) => Math.abs(pe[2] - K.pts[0][2]) < 1e-6), f = s.find((K) => K.cerrada && l(K)), i = s.find((K) => !K.cerrada && K.pts.length >= 2 && !l(K));
      if (!f) return {
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
      const r = f.pts, u = r.length, d = i.pts.slice();
      d[d.length - 1][2] < d[0][2] && d.reverse();
      let _ = 0;
      for (let K = 0; K < u; K++) {
        const pe = r[K], ge = r[(K + 1) % u];
        _ += pe[0] * ge[1] - ge[0] * pe[1];
      }
      const x = _ > 0 ? 1 : -1, w = (K) => {
        const pe = r[(K - 1 + u) % u], ge = r[K], Ce = r[(K + 1) % u], Te = [
          ge[0] - pe[0],
          ge[1] - pe[1]
        ], _e = [
          Ce[0] - ge[0],
          Ce[1] - ge[1]
        ], Be = Math.hypot(Te[0], Te[1]) || 1, Ie = Math.hypot(_e[0], _e[1]) || 1, qe = [
          x * Te[1] / Be,
          -x * Te[0] / Be
        ], Ne = [
          x * _e[1] / Ie,
          -x * _e[0] / Ie
        ], Re = 1 + (qe[0] * Ne[0] + qe[1] * Ne[1]);
        return [
          (qe[0] + Ne[0]) / Math.max(Re, 1e-6),
          (qe[1] + Ne[1]) / Math.max(Re, 1e-6)
        ];
      }, b = r.map((K, pe) => w(pe)), E = d[0];
      let p = [
        0,
        0
      ], h = 0;
      for (const K of d) {
        const pe = K[0] - E[0], ge = K[1] - E[1], Ce = Math.hypot(pe, ge);
        Ce > h && (h = Ce, p = [
          pe / Ce,
          ge / Ce
        ]);
      }
      if (h < 1e-9) {
        const K = E[0] - e, pe = E[1] - n, ge = Math.hypot(K, pe) || 1;
        p = [
          K / ge,
          pe / ge
        ];
      }
      p[0] * (E[0] - e) + p[1] * (E[1] - n) < 0 && (p = [
        -p[0],
        -p[1]
      ]), Pt();
      const y = t.points.rawVal, k = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], $ = [
        ...y
      ];
      let I = k.slice();
      I.length && I[I.length - 1].length === 0 && (I = I.slice(0, -1));
      const L = [
        ...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []
      ], U = d.map((K) => {
        const pe = (K[0] - E[0]) * p[0] + (K[1] - E[1]) * p[1], ge = K[2];
        return r.map((Ce, Te) => ua($, [
          Ce[0] + b[Te][0] * pe,
          Ce[1] + b[Te][1] * pe,
          ge
        ]));
      });
      let he = 0;
      for (let K = 0; K + 1 < U.length; K++) for (let pe = 0; pe < u; pe++) {
        const ge = [
          U[K][pe],
          U[K][(pe + 1) % u],
          U[K + 1][(pe + 1) % u],
          U[K + 1][pe]
        ];
        new Set(ge).size < 4 || (L.push(I.length), I.push([
          ...ge,
          ge[0]
        ]), he++);
      }
      I.push([]), t.points.val = $, t.polylines && (t.polylines.val = I), t.areas && (t.areas.val = L);
      const X = ns(o);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      return M(), {
        contorno: u,
        perfil: d.length,
        areas: he,
        guias: X
      };
    }, window.__hekatanDrawSlabChaflan = (e, n, a = 1, o = 6, s = 6) => {
      const l = Math.min(e[0], n[0]), f = Math.max(e[0], n[0]), i = Math.min(e[1], n[1]), r = Math.max(e[1], n[1]), u = (e[2] + n[2]) / 2, d = f - l, _ = r - i, x = Math.min(a, d / 2 - 0.01, _ / 2 - 0.01);
      if (x <= 0) return;
      const w = t.points.rawVal.length, b = [], E = [], p = (h, y) => {
        b.push([
          h,
          y,
          u
        ]), E.push(w + b.length - 1);
      };
      for (let h = 0; h <= s; h++) p(l + x + (d - 2 * x) * h / s, i);
      for (let h = 1; h <= o; h++) {
        const y = -Math.PI / 2 + Math.PI / 2 * h / o;
        p(f - x + x * Math.cos(y), i + x + x * Math.sin(y));
      }
      for (let h = 1; h <= s; h++) p(f, i + x + (_ - 2 * x) * h / s);
      for (let h = 1; h <= o; h++) {
        const y = 0 + Math.PI / 2 * h / o;
        p(f - x + x * Math.cos(y), r - x + x * Math.sin(y));
      }
      for (let h = 1; h <= s; h++) p(f - x - (d - 2 * x) * h / s, r);
      for (let h = 1; h <= o; h++) {
        const y = Math.PI / 2 + Math.PI / 2 * h / o;
        p(l + x + x * Math.cos(y), r - x + x * Math.sin(y));
      }
      for (let h = 1; h <= s; h++) p(l, r - x - (_ - 2 * x) * h / s);
      for (let h = 1; h < o; h++) {
        const y = Math.PI + Math.PI / 2 * h / o;
        p(l + x + x * Math.cos(y), i + x + x * Math.sin(y));
      }
      if (E.push(w), Do()) {
        No(b, true);
        return;
      }
      if (t.points.val = [
        ...t.points.rawVal,
        ...b
      ], t.polylines) {
        const h = t.polylines.rawVal;
        t.polylines.val = [
          ...h.slice(0, -1),
          E,
          []
        ];
      }
    }, window.__hekatanDrawRect = (e, n) => {
      const a = t.points.rawVal.length, o = e[0], s = e[1], l = e[2], f = n[0], i = n[1], r = n[2];
      let u;
      if (Math.abs(l - r) < 1e-6 ? u = [
        [
          o,
          s,
          l
        ],
        [
          f,
          s,
          l
        ],
        [
          f,
          i,
          l
        ],
        [
          o,
          i,
          l
        ]
      ] : Math.abs(s - i) < 1e-6 ? u = [
        [
          o,
          s,
          l
        ],
        [
          f,
          s,
          l
        ],
        [
          f,
          s,
          r
        ],
        [
          o,
          s,
          r
        ]
      ] : u = [
        [
          o,
          s,
          l
        ],
        [
          o,
          i,
          l
        ],
        [
          o,
          i,
          r
        ],
        [
          o,
          s,
          r
        ]
      ], t.points.val = [
        ...t.points.rawVal,
        ...u
      ], t.polylines) {
        const d = [
          a,
          a + 1,
          a + 2,
          a + 3,
          a
        ], _ = t.polylines.rawVal;
        t.polylines.val = [
          ..._.slice(0, -1),
          d,
          []
        ];
      }
    }, window.__hekatanDrawRectArea = (e, n) => {
      var _a3;
      const a = t.points.rawVal.length, o = e[0], s = e[1], l = e[2], f = n[0], i = n[1], r = n[2];
      let u;
      if (T && t.gridTarget) {
        const d = t.gridTarget.rawVal, _ = new In(...d.rotation), x = new R(1, 0, 0).applyEuler(_), w = new R(0, 1, 0).applyEuler(_), b = new R(...d.position), E = new R(o, s, l), p = new R(f, i, r), h = E.clone().sub(b).dot(x), y = E.clone().sub(b).dot(w), k = p.clone().sub(b).dot(x), $ = p.clone().sub(b).dot(w), I = (L, U) => b.clone().addScaledVector(x, L).addScaledVector(w, U).toArray();
        u = [
          I(h, y),
          I(k, y),
          I(k, $),
          I(h, $)
        ];
      } else Math.abs(l - r) < 1e-6 ? u = [
        [
          o,
          s,
          l
        ],
        [
          f,
          s,
          l
        ],
        [
          f,
          i,
          l
        ],
        [
          o,
          i,
          l
        ]
      ] : Math.abs(s - i) < 1e-6 ? u = [
        [
          o,
          s,
          l
        ],
        [
          f,
          s,
          l
        ],
        [
          f,
          s,
          r
        ],
        [
          o,
          s,
          r
        ]
      ] : u = [
        [
          o,
          s,
          l
        ],
        [
          o,
          i,
          l
        ],
        [
          o,
          i,
          r
        ],
        [
          o,
          s,
          r
        ]
      ];
      if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [
        ...t.points.rawVal,
        ...u
      ], t.polylines) {
        const d = t.polylines.rawVal, _ = d.length - 1, x = [
          a,
          a + 1,
          a + 2,
          a + 3,
          a
        ];
        t.polylines.val = [
          ...d.slice(0, -1),
          x,
          []
        ], t.areas && (t.areas.val = [
          ...t.areas.rawVal,
          _
        ]);
      }
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      M();
    }, window.__hekatanFillClosedAreas = () => {
      var _a3, _b, _c;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = t.points.rawVal, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = (p) => p.map((h) => Math.round(h * 1e4) / 1e4).join(",");
      for (let p = 0; p < n.length; p++) {
        const h = s(n[p]), y = a.get(h);
        y === void 0 && a.set(h, p), o.set(p, y ?? p);
      }
      const l = e.map((p) => p.map((h) => o.get(h) ?? h)), f = /* @__PURE__ */ new Map(), i = (p, h) => {
        p !== h && ((f.get(p) ?? f.set(p, /* @__PURE__ */ new Set()).get(p)).add(h), (f.get(h) ?? f.set(h, /* @__PURE__ */ new Set()).get(h)).add(p));
      };
      for (const p of l) for (let h = 0; h + 1 < p.length; h++) i(p[h], p[h + 1]);
      const r = (p, h) => {
        var _a4;
        return !!((_a4 = f.get(p)) == null ? void 0 : _a4.has(h));
      }, u = /* @__PURE__ */ new Set(), d = [], _ = [
        ...f.keys()
      ];
      for (const p of _) for (const h of f.get(p)) if (!(h < p)) {
        for (const y of f.get(h)) if (y !== p) for (const k of f.get(y)) {
          if (k === p || k === h || !r(k, p) || r(p, y) || r(h, k)) continue;
          const $ = [
            p,
            h,
            y,
            k
          ].slice().sort((I, L) => I - L).join("-");
          u.has($) || (u.add($), d.push([
            p,
            h,
            y,
            k
          ]));
        }
      }
      for (const p of _) for (const h of f.get(p)) if (!(h < p)) for (const y of f.get(h)) {
        if (y === p || !r(y, p)) continue;
        const k = [
          p,
          h,
          y
        ].slice().sort(($, I) => $ - I).join("-");
        u.has(k) || (u.add(k), d.push([
          p,
          h,
          y
        ]));
      }
      if (!d.length) return 0;
      const x = [
        ...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []
      ], w = new Set(x.map((p) => [
        ...new Set(l[p] ?? [])
      ].sort((h, y) => h - y).join("-"))), b = [
        ...l
      ];
      let E = 0;
      for (const p of d) {
        const h = p.slice().sort((y, k) => y - k).join("-");
        w.has(h) || (w.add(h), b.push([
          ...p,
          p[0]
        ]), x.push(b.length - 1), E++);
      }
      if (E) {
        window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = b, t.areas && (t.areas.val = x);
        try {
          (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
        } catch {
        }
        M();
      }
      return E;
    }, window.__hekatanMeshPolyArea = (e, n) => {
      var _a3;
      const a = e.length;
      if (a < 3) return 0;
      let o = 0, s = 0, l = 0;
      for (let Re = 0; Re < a; Re++) {
        const Ze = e[Re], He = e[(Re + 1) % a];
        o += (Ze[1] - He[1]) * (Ze[2] + He[2]), s += (Ze[2] - He[2]) * (Ze[0] + He[0]), l += (Ze[0] - He[0]) * (Ze[1] + He[1]);
      }
      const f = Math.hypot(o, s, l) || 1;
      o /= f, s /= f, l /= f;
      let i = e[1][0] - e[0][0], r = e[1][1] - e[0][1], u = e[1][2] - e[0][2];
      const d = Math.hypot(i, r, u) || 1;
      i /= d, r /= d, u /= d;
      let _ = s * u - l * r, x = l * i - o * u, w = o * r - s * i;
      const b = Math.hypot(_, x, w) || 1;
      _ /= b, x /= b, w /= b;
      const E = e[0], p = (Re) => [
        (Re[0] - E[0]) * i + (Re[1] - E[1]) * r + (Re[2] - E[2]) * u,
        (Re[0] - E[0]) * _ + (Re[1] - E[1]) * x + (Re[2] - E[2]) * w
      ], h = (Re, Ze) => [
        E[0] + Re * i + Ze * _,
        E[1] + Re * r + Ze * x,
        E[2] + Re * u + Ze * w
      ], y = e.map(p);
      let k = 1 / 0, $ = -1 / 0, I = 1 / 0, L = -1 / 0;
      for (const [Re, Ze] of y) Re < k && (k = Re), Re > $ && ($ = Re), Ze < I && (I = Ze), Ze > L && (L = Ze);
      const U = $ - k, he = L - I;
      if (U < 1e-6 || he < 1e-6) return 0;
      let X = n && n > 0 ? n : 0.5;
      for (; U / X * (he / X) > 2500; ) X *= 2;
      X = Math.min(X, Math.min(U, he));
      const K = (Re, Ze) => {
        let He = false;
        for (let ft = 0, ht = y.length - 1; ft < y.length; ht = ft++) {
          const [kt, gt] = y[ft], [Vt, Ct] = y[ht];
          gt > Ze != Ct > Ze && Re < (Vt - kt) * (Ze - gt) / (Ct - gt) + kt && (He = !He);
        }
        return He;
      }, pe = Math.max(1, Math.round(U / X)), ge = Math.max(1, Math.round(he / X)), Ce = U / pe, Te = he / ge, _e = /* @__PURE__ */ new Map(), Be = [], Ie = t.points.rawVal.length, qe = (Re, Ze) => {
        const He = Re + "," + Ze, ft = _e.get(He);
        if (ft !== void 0) return ft;
        const ht = Ie + Be.length;
        return Be.push(h(k + Re * Ce, I + Ze * Te)), _e.set(He, ht), ht;
      }, Ne = [];
      for (let Re = 0; Re < pe; Re++) for (let Ze = 0; Ze < ge; Ze++) {
        if (!K(k + (Re + 0.5) * Ce, I + (Ze + 0.5) * Te)) continue;
        const He = qe(Re, Ze), ft = qe(Re + 1, Ze), ht = qe(Re + 1, Ze + 1), kt = qe(Re, Ze + 1);
        Ne.push([
          He,
          ft,
          ht,
          kt
        ]);
      }
      if (!Ne.length) return 0;
      if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [
        ...t.points.rawVal,
        ...Be
      ], t.polylines && t.areas) {
        let Re = t.polylines.rawVal.slice();
        Re.length && Re[Re.length - 1].length === 0 && (Re = Re.slice(0, -1));
        const Ze = [];
        for (const He of Ne) Ze.push(Re.length), Re.push([
          He[0],
          He[1],
          He[2],
          He[3],
          He[0]
        ]);
        Re.push([]), t.polylines.val = Re, t.areas.val = [
          ...t.areas.rawVal,
          ...Ze
        ];
      }
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return M(), Ne.length;
    };
    const Yo = () => {
      if (Ge.length < 3) return Ge = [], Ee.visible = false, M(), 0;
      const e = window.__hekatanMeshPolyArea(Ge.slice());
      return Ge = [], Ee.visible = false, M(), e;
    };
    window.__hekatanFinalizePolyArea = Yo, window.__hekatanSetInclinedPlaneFrom3 = (e, n, a) => {
      var _a3;
      const o = new R(e[0], e[1], e[2]), s = new R(n[0], n[1], n[2]), l = new R(a[0], a[1], a[2]), f = new R().subVectors(s, o).cross(new R().subVectors(l, o));
      if (f.lengthSq() < 1e-9) return false;
      f.normalize();
      const i = new Po().setFromUnitVectors(new R(0, 0, 1), f), r = new In().setFromQuaternion(i);
      t.gridTarget && (t.gridTarget.val = {
        position: [
          o.x,
          o.y,
          o.z
        ],
        rotation: [
          r.x,
          r.y,
          r.z
        ]
      }), T = true;
      const u = new R().addVectors(o, s).add(l).multiplyScalar(1 / 3), d = Math.max(o.distanceTo(s), o.distanceTo(l), s.distanceTo(l)) * 2.2 + 4, _ = d / 2;
      Xt.geometry.dispose(), Xt.geometry = new Un(d, d), Jt.geometry.dispose(), Jt.geometry = new Ss(new Un(d, d)), An(_, 1), _t.position.copy(u), _t.quaternion.copy(i), _t.scale.set(1, 1, 1), _t.visible = true;
      try {
        (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return M(), true;
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
      }), T = false, _t.visible = false, M();
    };
    const un = new pt();
    un.visible = false, m.add(un), window.__hekatanShowAxes = (e, n, a = 12, o = 2) => {
      var _a3, _b;
      for (; un.children.length; ) {
        const d = un.children.pop();
        (_a3 = d.geometry) == null ? void 0 : _a3.dispose(), (_b = d.material) == null ? void 0 : _b.dispose();
      }
      if (!e.length || !n.length) return;
      const s = Math.min(...n) - o, l = Math.max(...n) + o, f = Math.min(...e) - o, i = Math.max(...e) + o, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", u = (d, _, x, w, b) => {
        const E = document.createElement("canvas");
        E.width = 64, E.height = 32;
        const p = E.getContext("2d");
        p.fillStyle = b, p.font = "bold 22px sans-serif", p.textAlign = "center", p.fillText(d, 32, 26);
        const h = new Ps(E), y = new zs({
          map: h,
          transparent: true
        }), k = new As(y);
        return k.position.set(_, x, w), k.scale.set(1.2, 0.6, 1), k;
      };
      e.forEach((d, _) => {
        const x = _ < r.length ? r[_] : `X${_}`, w = new De().setFromPoints([
          new R(d, s, 0),
          new R(d, l, 0),
          new R(d, s, 0),
          new R(d, s, a)
        ]), b = new ho({
          color: 6333946,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.6
        }), E = new rn(w, b);
        E.computeLineDistances(), un.add(E), un.add(u(x, d, s - 0.5, 0, "#60a5fa")), un.add(u(x, d, l + 0.5, 0, "#60a5fa"));
      }), n.forEach((d, _) => {
        const x = `${_ + 1}`, w = new De().setFromPoints([
          new R(f, d, 0),
          new R(i, d, 0),
          new R(f, d, 0),
          new R(f, d, a)
        ]), b = new ho({
          color: 16478597,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.6
        }), E = new rn(w, b);
        E.computeLineDistances(), un.add(E), un.add(u(x, f - 0.5, d, 0, "#fb7185")), un.add(u(x, i + 0.5, d, 0, "#fb7185"));
      }), un.visible = true, M();
    }, window.__hekatanHideAxes = () => {
      un.visible = false, M();
    };
    const Fn = new pt();
    Fn.visible = false, m.add(Fn);
    let so = [];
    window.__hekatanShowRefPlanes = (e = [
      0,
      3,
      6,
      9,
      12
    ], n = 20, a = 0, o = 0) => {
      var _a3, _b;
      for (; Fn.children.length; ) {
        const l = Fn.children.pop();
        (_a3 = l.geometry) == null ? void 0 : _a3.dispose(), (_b = l.material) == null ? void 0 : _b.dispose();
      }
      so.forEach((l) => {
        m.remove(l), l.geometry.dispose(), l.material.dispose();
      }), so = [];
      const s = [
        6333946,
        3462041,
        16498468,
        16478597,
        12616956,
        2282478
      ];
      e.forEach((l, f) => {
        const i = s[f % s.length], r = n / 2, u = [
          new R(a - r, o - r, l),
          new R(a + r, o - r, l),
          new R(a + r, o + r, l),
          new R(a - r, o + r, l),
          new R(a - r, o - r, l)
        ], d = new De().setFromPoints(u), _ = new mt({
          color: i,
          transparent: true,
          opacity: 0.55
        });
        Fn.add(new Ft(d, _));
        const x = document.createElement("canvas");
        x.width = 128, x.height = 32;
        const w = x.getContext("2d");
        w.fillStyle = `#${i.toString(16).padStart(6, "0")}`, w.font = "bold 18px sans-serif", w.fillText(`Z = ${l} m`, 4, 22);
        const b = new Ps(x), E = new zs({
          map: b,
          transparent: true
        }), p = new As(E);
        p.position.set(a - r - 1.5, o - r - 1.5, l), p.scale.set(2.5, 0.6, 1), Fn.add(p);
        const h = new Un(1e4, 1e4), y = new wt({
          visible: false,
          side: It
        }), k = new dt(h, y);
        k.position.set(0, 0, l), k.frustumCulled = false, k.userData = {
          refPlaneZ: l
        }, m.add(k), so.push(k);
      }), Fn.visible = true, M();
    }, window.__hekatanHideRefPlanes = () => {
      Fn.visible = false, so.forEach((e) => {
        e.visible = false;
      }), M();
    };
    const go = new pt();
    go.frustumCulled = false, m.add(go);
    const ri = () => {
      var _a3, _b, _c, _d;
      for (; go.children.length; ) {
        const a = go.children.pop();
        (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
      const e = window.__hekatanDrawingAuxLines, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
      for (const a of n) {
        if (a.length !== 6) continue;
        const o = new De().setFromPoints([
          new R(a[0], a[1], a[2]),
          new R(a[3], a[4], a[5])
        ]), s = new ho({
          color: 2282478,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.8
        }), l = new Ft(o, s);
        l.computeLineDistances(), go.add(l);
      }
    };
    ve.derive(() => {
      const e = window.__hekatanDrawingAuxLines;
      (e == null ? void 0 : e.val) && (e.val, ri(), M());
    });
    const io = new pt();
    io.frustumCulled = false, m.add(io);
    const os = () => {
      var _a3, _b, _c, _d;
      for (; io.children.length; ) {
        const a = io.children.pop();
        (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
      const e = window.__hekatanDrawingAuxPoints, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
      for (const a of n) {
        if (!a || a.length !== 3) continue;
        const o = new dt(new eo(0.025, 12, 12), new wt({
          color: 2282478,
          transparent: true,
          opacity: 0.85,
          depthTest: false
        }));
        o.position.set(a[0], a[1], a[2]), o.renderOrder = 996, o.scale.setScalar(Vo(o.position)), io.add(o);
      }
    };
    ve.derive(() => {
      const e = window.__hekatanDrawingAuxPoints;
      (e == null ? void 0 : e.val) !== void 0 && (e.val, os(), M());
    }), v.addEventListener("change", () => {
      io.children.forEach((e) => {
        e.scale.setScalar(Vo(e.position));
      });
    }), window.__hekatanRenderAuxPoints = os;
    const Mt = new pt(), li = new dt(new eo(0.01, 12, 12), new wt({
      color: 16777215,
      transparent: true,
      opacity: 0.95
    })), as = new dt(new eo(0.015, 12, 12), new wt({
      color: 16498468,
      transparent: true,
      opacity: 0.2,
      depthWrite: false
    }));
    as.visible = false, Mt.add(li, as);
    const ro = 0.08, pa = (e, n, a) => {
      const o = new De().setFromPoints([
        new R(...e),
        new R(...n)
      ]);
      return new Ft(o, new mt({
        color: a,
        transparent: true,
        opacity: 0.7
      }));
    };
    Mt.add(pa([
      -ro,
      0,
      0
    ], [
      ro,
      0,
      0
    ], 16777215)), Mt.add(pa([
      0,
      -ro,
      0
    ], [
      0,
      ro,
      0
    ], 16777215)), Mt.add(pa([
      0,
      0,
      -ro
    ], [
      0,
      0,
      ro
    ], 16777215)), Mt.visible = false, Mt.frustumCulled = false, m.add(Mt);
    let fa = 2;
    const Xo = (e) => {
      const n = g(), a = (S == null ? void 0 : S.clientHeight) || 700;
      return n.isOrthographicCamera ? (n.top - n.bottom) / (n.zoom || 1) / a : 2 * n.position.distanceTo(e) * Math.tan((n.fov || 50) * Math.PI / 180 / 2) / a;
    }, bo = () => {
      if (!Mt.visible) return;
      const e = fa * Xo(Mt.position) / 0.015;
      Mt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
    };
    let Dn = 10;
    const ha = (e) => Math.max(1e-4, Dn * Xo(e));
    window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (Dn = e), Dn), window.__hekatanUpdateSnapScale = bo, window.__hekatanSnapMarker = Mt, window.__hekatanMetrosPorPixel = Xo, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (fa = e, bo(), M()), fa);
    const ss = () => {
      _n.children.length !== 0 && _n.children.forEach((e) => {
        if (!e.__isSelectionPt) return;
        const n = e;
        n.scale.setScalar(Vo(n.position) * 1.8);
      });
    };
    window.__hekatanUpdateSelectionPtScale = ss, v.addEventListener("change", () => {
      var _a3;
      bo(), cn.visible && Ha(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), ss();
    }), window.__hekatanShowSnap = (e, n, a) => {
      Mt.position.set(e, n, a), Mt.visible = true, bo(), M();
    }, window.__hekatanHideSnap = () => {
      Mt.visible = false, M();
    }, S.addEventListener("pointermove", (e) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r2, _s2, _t2, _u, _v, _w, _x, _y;
      window.__hekatanCursorPx = {
        x: e.clientX,
        y: e.clientY
      };
      const n = B(e);
      if (!n) return;
      P.setFromCamera(F, n), ue = null;
      const a = Ae();
      if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && ct.visible && (ct.visible = false), a.length) {
        const o = a[0].point;
        if (((_f = (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
          const w = qt([
            o.x,
            o.y,
            o.z
          ]);
          if (w) {
            const b = w.map((h) => t.points.rawVal[h]), E = [];
            for (let h = 1; h < b.length - 1; h++) E.push(b[0][0], b[0][1], b[0][2], b[h][0], b[h][1], b[h][2], b[h + 1][0], b[h + 1][1], b[h + 1][2]);
            const p = ct.geometry;
            p.setAttribute("position", new Rt(E, 3)), p.computeVertexNormals(), ct.visible = true;
          } else ct.visible = false;
        } else ct.visible && (ct.visible = false);
        const s = e.altKey;
        let l = false;
        const f = ha(o), i = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, o.x, o.y, o.z, f, {
          x: e.clientX,
          y: e.clientY
        });
        if (i) Go(i.type, i.x, i.y, i.z), Mt.position.set(i.x, i.y, i.z), Mt.visible = true, o.set(i.x, i.y, i.z), Wo(i.type, e.clientX, e.clientY);
        else if (!s && ($e = ke(e.clientX, e.clientY))) l = true, o.copy($e), Go("ifcSec", o.x, o.y, o.z), Wo("ifcSec", e.clientX, e.clientY), Mt.position.copy(o), Mt.visible = true;
        else if (re && !s) l = true, Go(re.tipo, o.x, o.y, o.z), Wo(re.tipo, e.clientX, e.clientY), Mt.position.copy(o), Mt.visible = true;
        else {
          bi(), Ho();
          const x = !s && window.__hekatanSnapEnabled !== false, w = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
          x && w > 0 && (o.x = Math.round(o.x / w) * w, o.y = Math.round(o.y / w) * w, o.z = Math.round(o.z / w) * w), Mt.position.copy(o), Mt.visible = true;
        }
        bo(), ne(ue && !i && (l || re) ? te(ue) : null), Dt = {
          p: o.clone(),
          x: e.clientX,
          y: e.clientY
        };
        const r = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
        if (r === "select" || !r) {
          const x = (window.__hekatanSnap2D ?? 0.5) * 1.5, w = oi(o.x, o.y, o.z, x), b = Ro(o.x, o.y, o.z, x), E = Wa(o.x, o.y, o.z, x);
          if (w >= 0) {
            const k = t.points.rawVal[w];
            cn.position.set(k[0], k[1], k[2]), cn.visible = true, Ha(), vn.visible = false, kn = {
              kind: "pt",
              a: w
            };
          } else if (b) {
            const k = t.points.rawVal, $ = t.polylines.rawVal[b.polyIdx], I = k[$[b.segIdx]], L = k[$[b.segIdx + 1]];
            vn.geometry.setFromPoints([
              new R(I[0], I[1], I[2]),
              new R(L[0], L[1], L[2])
            ]), vn.visible = true, cn.visible = false, kn = ((_m = (_l = t.areas) == null ? void 0 : _l.rawVal) == null ? void 0 : _m.includes(b.polyIdx)) ?? false ? {
              kind: "poly",
              a: b.polyIdx
            } : {
              kind: "seg",
              a: b.polyIdx,
              b: b.segIdx
            };
          } else if (E >= 0) {
            const $ = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[E];
            $ && (vn.geometry.setFromPoints([
              new R($[0], $[1], $[2]),
              new R($[3], $[4], $[5])
            ]), vn.visible = true, cn.visible = false, kn = {
              kind: "aux",
              a: E
            });
          } else vn.visible = false, cn.visible = false, kn = null;
          Xe.style.left = e.clientX + "px", Xe.style.top = e.clientY + "px", Xe.style.display = "block";
          let p = o;
          if ((kn == null ? void 0 : kn.kind) === "pt") {
            const k = t.points.rawVal[kn.a];
            k && (p = new R(k[0], k[1], k[2]));
          }
          const h = `X=${p.x.toFixed(2)} Y=${p.y.toFixed(2)} Z=${p.z.toFixed(2)}`;
          if (window.__hekatanCursorXYZ = [
            p.x,
            p.y,
            p.z
          ], kn) {
            const k = {
              pt: "nodo",
              seg: "segmento",
              poly: "\xE1rea",
              aux: "l\xEDnea aux"
            };
            Xe.textContent = `${h}  \xB7  \u{1F5B1} Click \u2192 ${k[kn.kind]}`;
          } else Xe.textContent = h;
          const y = document.getElementById("hk-coord-fixed");
          y && (y.textContent = h), Dt = {
            p: p.clone(),
            x: e.clientX,
            y: e.clientY
          }, Se.visible = false, $t.visible = false, Kt.visible = false, M();
          return;
        }
        if (r === "delete" || r === "trim" || r === "extend" || r === "offset") {
          const x = (window.__hekatanSnap2D ?? 0.5) * 1.5, w = Ro(o.x, o.y, o.z, x), b = Wa(o.x, o.y, o.z, x);
          let E = false;
          if (b >= 0) if (!w) E = true;
          else {
            const k = window.__hekatanDrawingAuxLines, I = ((k == null ? void 0 : k.rawVal) ?? (k == null ? void 0 : k.val) ?? k ?? [])[b];
            yo(o.x, o.y, o.z, I[0], I[1], I[2], I[3], I[4], I[5]) < w.dist && (E = true);
          }
          E ? (Bn = b, mn = -1, Tn = -1, ai(b)) : w ? (mn = w.polyIdx, Tn = w.segIdx, Bn = -1, si(w.polyIdx, w.segIdx)) : (mn = -1, Tn = -1, Bn = -1, Gt.visible = false), Se.visible = false, $t.visible = false, Kt.visible = false, en(), Xe.style.left = e.clientX + "px", Xe.style.top = e.clientY + "px", Xe.style.display = "block";
          const p = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
          let h = "";
          E ? h = `\u{1F5D1} l\xEDnea aux #${Bn + 1}` : w ? h = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(w.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${w.polyIdx + 1}` : `\u{1F5D1} seg ${w.segIdx + 1} / poly #${w.polyIdx + 1}` : h = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Xe.textContent = `${p}  \xB7  ${h}`;
          const y = document.getElementById("hk-coord-fixed");
          y && (y.textContent = p), M();
          return;
        } else Gt.visible = false, mn = -1, Bn = -1;
        Xe.style.left = e.clientX + "px", Xe.style.top = e.clientY + "px", Xe.style.display = "block";
        const u = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], d = u[u.length - 1] ?? [], _ = t.points.rawVal ?? [];
        if (d.length > 0 && _[d[d.length - 1]]) {
          const x = d[d.length - 1], w = _[x];
          let b = zt;
          ao = null;
          const E = !!i || l;
          if (!b && !E && window.__hekatanAxisSnap !== false) {
            const _e2 = S.getBoundingClientRect(), Be = e.clientX, Ie = e.clientY, qe = ((_r2 = settings.gridSize) == null ? void 0 : _r2.rawVal) ?? 10, Ne = new R(w[0], w[1], w[2]), Re = [
              [
                "x",
                new R(1, 0, 0)
              ],
              [
                "y",
                new R(0, 1, 0)
              ],
              [
                "z",
                new R(0, 0, 1)
              ]
            ], Ze = (ft) => {
              const ht = ft.clone().project(n);
              return {
                x: (ht.x * 0.5 + 0.5) * _e2.width + _e2.left,
                y: (-ht.y * 0.5 + 0.5) * _e2.height + _e2.top
              };
            };
            let He = null;
            for (const [ft, ht] of Re) {
              const kt = Ze(Ne.clone().addScaledVector(ht, -qe)), gt = Ze(Ne.clone().addScaledVector(ht, qe)), Vt = gt.x - kt.x, Ct = gt.y - kt.y, Pn = Be - kt.x, sn = Ie - kt.y, Vn = Vt * Vt + Ct * Ct || 1;
              let zn = (Pn * Vt + sn * Ct) / Vn;
              zn = Math.max(0, Math.min(1, zn));
              const jn = Math.hypot(Be - (kt.x + zn * Vt), Ie - (kt.y + zn * Ct));
              if (He === null || jn < He.dpx) {
                const yn = P.ray, bs = Ne.clone().sub(yn.origin), Fa = ht.dot(yn.direction), Ms = ht.dot(bs), Vi = yn.direction.dot(bs), vs = 1 - Fa * Fa, Ii = Math.abs(vs) < 1e-6 ? -Ms : (Fa * Vi - Ms) / vs;
                He = {
                  axis: ft,
                  dpx: jn,
                  pt: Ne.clone().addScaledVector(ht, Ii)
                };
              }
            }
            He && He.dpx <= 12 && (o.copy(He.pt), b = He.axis, ao = He.pt.clone());
          }
          const p = !!window.__hekatanOrthoMode;
          if (!b && !E && p) {
            const _e2 = S.getBoundingClientRect(), Be = new R(w[0], w[1], w[2]), Ie = (gt) => {
              const Vt = gt.clone().project(n);
              return {
                x: (Vt.x * 0.5 + 0.5) * _e2.width + _e2.left,
                y: (-Vt.y * 0.5 + 0.5) * _e2.height + _e2.top
              };
            }, qe = Ie(Be), Ne = e.clientX - qe.x, Re = e.clientY - qe.y, Ze = Math.hypot(Ne, Re), He = [
              [
                "x",
                new R(1, 0, 0)
              ],
              [
                "y",
                new R(0, 1, 0)
              ],
              [
                "z",
                new R(0, 0, 1)
              ]
            ], ft = Math.max(1, ((_s2 = settings.gridSize) == null ? void 0 : _s2.rawVal) ?? 10) * 0.5, ht = Number(window.__hekatanPolarInc) || 0, kt = He.map(([gt, Vt]) => ({
              rotulo: gt.toUpperCase(),
              u: Vt
            }));
            if (ht > 0 && ht < 90) {
              const gt = [
                [
                  "XY",
                  new R(1, 0, 0),
                  new R(0, 1, 0)
                ],
                [
                  "XZ",
                  new R(1, 0, 0),
                  new R(0, 0, 1)
                ],
                [
                  "YZ",
                  new R(0, 1, 0),
                  new R(0, 0, 1)
                ]
              ];
              for (const [Vt, Ct, Pn] of gt) for (let sn = ht; sn < 360; sn += ht) {
                if (sn % 90 === 0) continue;
                const Vn = sn * Math.PI / 180;
                kt.push({
                  rotulo: `${sn}\xB0 ${Vt}`,
                  u: Ct.clone().multiplyScalar(Math.cos(Vn)).addScaledVector(Pn, Math.sin(Vn)).normalize()
                });
              }
            }
            if (Ze > 4) {
              let gt = null;
              for (const Vt of kt) {
                const Ct = Vt.u, Pn = Ie(Be.clone().addScaledVector(Ct, ft)), sn = Pn.x - qe.x, Vn = Pn.y - qe.y, zn = Math.hypot(sn, Vn);
                if (zn < 6) continue;
                const jn = Math.abs((Ne * sn + Re * Vn) / (Ze * zn)), yn = Math.abs(Ct.x) >= Math.abs(Ct.y) && Math.abs(Ct.x) >= Math.abs(Ct.z) ? "x" : Math.abs(Ct.y) >= Math.abs(Ct.z) ? "y" : "z";
                (!gt || jn > gt.cos) && (gt = {
                  axis: yn,
                  rotulo: Vt.rotulo,
                  cos: jn,
                  u: Ct
                });
              }
              if (gt) {
                b = gt.axis, gt.rotulo;
                const Vt = P.ray, Ct = Be.clone().sub(Vt.origin), Pn = gt.u.dot(Vt.direction), sn = gt.u.dot(Ct), Vn = Vt.direction.dot(Ct), zn = 1 - Pn * Pn, jn = Math.abs(zn) < 1e-6 ? -sn : (Pn * Vn - sn) / zn, yn = Be.clone().addScaledVector(gt.u, jn);
                isFinite(yn.x) && isFinite(yn.y) && isFinite(yn.z) && (o.copy(yn), ao = yn.clone());
              }
            }
          }
          const h = window.__hekatanPolarTrack !== false;
          if (!b && !E && h) {
            const _e2 = o.x - w[0], Be = o.y - w[1], Ie = o.z - w[2], qe = Math.hypot(_e2, Be, Ie);
            if (qe > 1e-3) {
              const Re = Math.tan(6 * Math.PI / 180) * qe, Ze = Math.hypot(Be, Ie), He = Math.hypot(_e2, Ie), ft = Math.hypot(_e2, Be), ht = [
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
                  ft
                ]
              ];
              ht.sort((kt, gt) => kt[1] - gt[1]), ht[0][1] <= Re && (b = ht[0][0]);
            }
          }
          if (b) {
            const _e2 = w[0], Be = w[1], Ie = w[2];
            b === "x" ? o.set(o.x, Be, Ie) : b === "y" ? o.set(_e2, o.y, Ie) : o.set(_e2, Be, o.z);
            const qe = !!zt, Re = {
              x: "#ff3344",
              y: "#34d399",
              z: "#60a5fa"
            }[b];
            Nt.style.background = "rgba(15,23,42,0.92)", Nt.style.color = Re, Nt.style.border = `1.5px solid ${Re}`;
            const Ze = (_t2 = a[0]) == null ? void 0 : _t2.object;
            let He = null;
            Ze === Qt ? He = "xy" : Ze === nn ? He = "xz" : Ze === bn && (He = "yz");
            const ft = He ? ` (plano ${He.toUpperCase()})` : "";
            Nt.textContent = qe ? `\u{1F512} LOCK ${b.toUpperCase()}${ft}` : `\u22A5 ORTO ${b.toUpperCase()}${ft}`, Nt.style.left = e.clientX + 20 + "px", Nt.style.top = e.clientY + 18 + "px", Nt.style.transform = "none", Nt.style.display = "block";
          } else zt || (Nt.style.display = "none");
          let y = null;
          if (!s && !E && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
            const _e2 = t.points.rawVal, Be = b ? [
              b
            ] : [
              "z",
              "x",
              "y"
            ], Ie = {
              x: e.clientX,
              y: e.clientY
            };
            let qe = 1 / 0;
            for (const Ne of _e2) if (!(Math.abs(Ne[0] - w[0]) < 1e-9 && Math.abs(Ne[1] - w[1]) < 1e-9 && Math.abs(Ne[2] - w[2]) < 1e-9)) for (const Re of Be) {
              const Ze = new R(Re === "x" ? Ne[0] : o.x, Re === "y" ? Ne[1] : o.y, Re === "z" ? Ne[2] : o.z), He = Qn(Ze.x, Ze.y, Ze.z);
              if (!He) continue;
              const ft = Math.hypot(He.x - Ie.x, He.y - Ie.y);
              ft < Dn && ft < qe && (qe = ft, y = {
                q: Ne,
                eje: Re
              });
            }
          }
          y ? (y.eje === "x" ? o.x = y.q[0] : y.eje === "y" ? o.y = y.q[1] : o.z = y.q[2], Kt.geometry.setFromPoints([
            new R(y.q[0], y.q[1], y.q[2]),
            new R(o.x, o.y, o.z)
          ]), (_u = Kt.computeLineDistances) == null ? void 0 : _u.call(Kt), Kt.visible = true, Mt.position.set(o.x, o.y, o.z), Mt.visible = true, Wo("track", e.clientX, e.clientY)) : Kt.visible = false, Dt = {
            p: o.clone(),
            x: e.clientX,
            y: e.clientY
          };
          const k = Math.hypot(o.x - w[0], o.y - w[1], o.z - w[2]), $ = Math.atan2(o.y - w[1], o.x - w[0]) * 180 / Math.PI, I = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`, L = ($ % 360 + 360) % 360;
          Xe.textContent = `L = ${k.toFixed(3)} m   \u2220 ${L.toFixed(1)}\xB0   \xB7   ${I}`;
          const U = document.getElementById("hk-coord-fixed");
          U && (U.textContent = I), Se.geometry.setFromPoints([
            new R(w[0], w[1], w[2]),
            new R(o.x, o.y, o.z)
          ]), (_v = Se.computeLineDistances) == null ? void 0 : _v.call(Se), Se.visible = true, Oe(w[0], w[1], w[2], o.x, o.y, o.z);
          const he = window.__hekatanOrthoExt ?? 8, X = window.__hekatanShowOrthoPlanes !== false;
          gn.visible = X, X || qa(null), X && (En(Gn, w, "xy", he), En(oo, w, "xz", he), En(Hn, w, "yz", he), Cn(Qt, w, "xy", he), Cn(nn, w, "xz", he), Cn(bn, w, "yz", he));
          const K = X ? P.intersectObjects([
            Qt,
            nn,
            bn
          ], false) : [];
          let pe = null;
          if (K.length > 0) {
            const _e2 = K[0].object;
            _e2 === Qt ? pe = "xy" : _e2 === nn ? pe = "xz" : _e2 === bn && (pe = "yz");
          }
          qa(pe), pe && (Mn.style.left = e.clientX + "px", Mn.style.top = e.clientY + "px"), xn.geometry.setFromPoints([
            new R(w[0] - he, w[1], w[2]),
            new R(w[0] + he, w[1], w[2])
          ]), (_w = xn.computeLineDistances) == null ? void 0 : _w.call(xn), tn.geometry.setFromPoints([
            new R(w[0], w[1] - he, w[2]),
            new R(w[0], w[1] + he, w[2])
          ]), (_x = tn.computeLineDistances) == null ? void 0 : _x.call(tn), Kn.geometry.setFromPoints([
            new R(w[0], w[1], w[2] - he),
            new R(w[0], w[1], w[2] + he)
          ]), (_y = Kn.computeLineDistances) == null ? void 0 : _y.call(Kn), $t.visible = true;
          const ge = xn.material, Ce = tn.material, Te = Kn.material;
          xn.visible = b === "x", tn.visible = b === "y", Kn.visible = b === "z", ge.opacity = 0.95, Ce.opacity = 0.95, Te.opacity = 0.95;
        } else {
          const x = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
          Xe.textContent = x;
          const w = document.getElementById("hk-coord-fixed");
          if (w && (w.textContent = x), Se.visible = false, $t.visible = false, (/* @__PURE__ */ new Set([
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
          ])).has(r)) {
            if (Pe = null, ot = null, Ve.style.left = e.clientX + 20 + "px", Ve.style.top = e.clientY - 28 + "px", Ve.style.display = "block", !Ye) {
              Ve.value = `${o.x.toFixed(2)},${o.y.toFixed(2)},${o.z.toFixed(2)}`;
              const E = document.activeElement;
              !(E && (E.tagName === "INPUT" || E.tagName === "TEXTAREA") && E !== Ve) && document.activeElement !== Ve && Ve.focus({
                preventScroll: true
              });
              try {
                Ve.select();
              } catch {
              }
            }
          } else en();
        }
        M();
      } else Ho(), Xe.style.display = "none", Mt.visible = false, Se.visible = false, $t.visible = false, en(), M();
    }), ve.derive(() => {
      if (!t.gridTarget) return;
      const e = new Po().setFromEuler(new In(...t.gridTarget.val.rotation)), n = new Po().setFromAxisAngle(new R(1, 0, 0), Math.PI / 2);
      Ar(c, {
        position: new R(...t.gridTarget.val.position),
        quaternion: e.clone().multiply(n)
      }, M), is(t.gridTarget.val.position[2], Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3), ae.position.set(...t.gridTarget.val.position), ae.quaternion.setFromEuler(new In(...t.gridTarget.val.rotation)), ae.updateMatrixWorld();
      const a = new R(0, 0, 1).applyEuler(new In(...t.gridTarget.val.rotation));
      T = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
    });
    function is(e, n, a) {
      var _a3, _b, _c, _d, _e, _f, _g;
      {
        for (const o of no) m.remove(o), da(o);
        if (no.length = 0, n) {
          const o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = /* @__PURE__ */ new Set([
            0
          ]);
          for (const i of o) s.add(+i[2].toFixed(3));
          const l = /* @__PURE__ */ new Set();
          for (const i of window.__hekatanLevels ?? []) isFinite(i == null ? void 0 : i.z) && (s.add(+i.z.toFixed(3)), l.add(+i.z.toFixed(3)));
          const f = [
            ...s
          ].sort((i, r) => i - r).slice(0, 24);
          for (const i of f) {
            if (Math.abs(i - e) < 1e-6) continue;
            const r = c.clone(true);
            r.name = `hekatan-grid-nivel-${i}`, r.traverse((u) => {
              u.material && (u.material = u.material.clone(), u.material.transparent = true, u.material.opacity = (u.material.opacity ?? 1) * (l.has(i) ? 0.65 : Math.abs(i) < 1e-6 ? 0.5 : 0.22));
            }), r.position.set(0, 0, i), r.quaternion.identity(), m.add(r), no.push(r);
          }
        }
      }
      {
        const o = window.__hekatanPlanosAux ?? [], s = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", l = ((_g = (_f = (_e = window.__hekatanCadState) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e)) == null ? void 0 : _g[s === "xz" ? "workY" : s === "yz" ? "workX" : "workZ"]) ?? 0;
        for (const f of o.slice(0, 24)) {
          if (f.plano === "xy" || !isFinite(f.d) || f.plano === s && Math.abs(f.d - l) < 1e-6) continue;
          const i = c.clone(true);
          i.name = `hekatan-grid-${f.plano}-${f.d}`, i.traverse((r) => {
            r.material && (r.material = r.material.clone(), r.material.transparent = true, r.material.opacity = (r.material.opacity ?? 1) * 0.6);
          }), f.plano === "xz" ? (i.quaternion.setFromEuler(new In(Math.PI / 2, 0, 0)), i.position.set(0, f.d, 0)) : (i.quaternion.setFromEuler(new In(0, Math.PI / 2, 0)), i.position.set(f.d, 0, 0)), m.add(i), no.push(i);
        }
      }
      M();
    }
    window.__hekatanGrillaAux = (e, n = "xy") => {
      var _a3, _b;
      if (!isFinite(e)) return [];
      const a = window;
      (_a3 = a.__hekatanPushUndo) == null ? void 0 : _a3.call(a);
      const o = a.__hekatanPlanosAux ?? [], s = o.findIndex((l) => l.plano === n && Math.abs(l.d - e) < 1e-6);
      if (s >= 0 ? o.splice(s, 1) : o.push({
        plano: n,
        d: e
      }), a.__hekatanPlanosAux = o, n === "xy") {
        const l = a.__hekatanLevels ?? [], f = l.findIndex((i) => Math.abs(i.z - e) < 1e-6 && i.tipo !== "piso");
        s >= 0 ? f >= 0 && l.splice(f, 1) : f < 0 && l.push({
          label: `N${e >= 0 ? "+" : ""}${e.toFixed(2)}`,
          z: e,
          tipo: "aux"
        }), a.__hekatanLevels = l;
      }
      return (_b = a.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(a), o;
    }, window.__hekatanQuitarGrillaAux = (e) => {
      var _a3;
      const a = (window.__hekatanLevels ?? []).filter((o) => !(Math.abs(o.z - e) < 1e-6 && o.tipo !== "piso"));
      return window.__hekatanLevels = a, (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), a.map((o) => o.z);
    };
    const wn = document.createElement("input");
    wn.id = "hk-grid-dist", wn.type = "text", wn.spellcheck = false, wn.title = "Distancia del plano. Teclea un n\xFAmero y Enter para colocarlo exacto; Esc cancela.", wn.style.cssText = [
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
    ].join(";") + ";", document.body.appendChild(wn);
    let lo = false, ma = 0, on = "";
    const ci = (e) => e === "xz" ? new R(0, 1, 0) : e === "yz" ? new R(1, 0, 0) : new R(0, 0, 1), rs = (e) => e === "xz" ? "workY" : e === "yz" ? "workX" : "workZ", Mo = () => {
      var _a3, _b, _c;
      return String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy");
    }, co = () => {
      var _a3, _b, _c;
      return Number(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c[rs(Mo())]) ?? 0);
    }, Uo = (e) => {
      var _a3, _b;
      const n = Mo(), a = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3);
      if (a && (a[rs(n)] = e), !t.gridTarget) return;
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
    }, di = () => {
      const e = ci(Mo()), n = P.ray.origin, a = P.ray.direction, o = e.dot(a), s = 1 - o * o;
      if (Math.abs(s) < 1e-4) return null;
      const l = n.clone().negate(), f = e.dot(l), i = a.dot(l);
      return (o * i - f) / s;
    }, vo = (e, n) => {
      e && (wn.style.left = e.clientX + "px", wn.style.top = e.clientY + "px");
      const a = Mo() === "xz" ? "Y" : Mo() === "yz" ? "X" : "Z";
      wn.value = on !== "" ? `${a} = ${on}` : `${a} = ${n.toFixed(2)} m`, wn.style.display = "block";
    }, Zo = (e, n) => {
      var _a3;
      lo && (lo = false, window.__hekatanMoviendoGrilla = false, wn.style.display = "none", e ? typeof n == "number" && isFinite(n) && Uo(n) : Uo(ma), on = "", (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), M());
    };
    window.__hekatanMoverGrilla = (e = true) => e ? (ma = co(), on = "", lo = true, window.__hekatanMoviendoGrilla = true, vo(null, ma), true) : Zo(false), S.addEventListener("pointermove", (e) => {
      if (!lo) return;
      B(e);
      const n = di();
      if (n === null) {
        vo(e, co());
        return;
      }
      on === "" && Uo(n), vo(e, n);
    }, true), S.addEventListener("pointerdown", (e) => {
      lo && (e.preventDefault(), e.stopPropagation(), Zo(true, on !== "" ? parseFloat(on) : co()));
    }, true), window.addEventListener("keydown", (e) => {
      if (lo) {
        if (e.key === "Escape") return e.preventDefault(), Zo(false);
        if (e.key === "Enter") return e.preventDefault(), Zo(true, on !== "" ? parseFloat(on) : co());
        if (e.key === "Backspace") {
          e.preventDefault(), on = on.slice(0, -1), vo(null, co());
          return;
        }
        if (/^[0-9.\-]$/.test(e.key)) {
          e.preventDefault(), on += e.key;
          const n = parseFloat(on);
          isFinite(n) && Uo(n), vo(null, isFinite(n) ? n : co());
        }
      }
    }, true);
    const $n = new pt();
    $n.name = "hekatan-scu", $n.visible = false, m.add($n);
    const ui = (e) => {
      var _a3, _b, _c, _d, _e, _f;
      for (; $n.children.length; ) {
        const i = $n.children.pop();
        (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c), (_e = i.dispose) == null ? void 0 : _e.call(i);
      }
      const n = Math.max(0.8, (((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) ?? 1) * 2), a = new R(...e), o = [
        [
          new R(1, 0, 0),
          16735067
        ],
        [
          new R(0, 1, 0),
          6029194
        ],
        [
          new R(0, 0, 1),
          6990079
        ]
      ];
      for (const [i, r] of o) $n.add(new qn(i, a, n, r, n * 0.28, n * 0.16));
      const s = new De().setFromPoints([
        new R(0, 0, 0),
        a
      ]), l = new ho({
        color: 2282478,
        dashSize: 0.35,
        gapSize: 0.25,
        transparent: true,
        opacity: 0.8
      }), f = new Ft(s, l);
      f.computeLineDistances(), $n.add(f), $n.visible = true;
    };
    window.__hekatanPonerSCU = (e) => {
      var _a3;
      return window.__hekatanSCU = [
        e[0],
        e[1],
        e[2]
      ], ui(e), (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), M(), e;
    }, window.__hekatanQuitarSCU = () => {
      var _a3;
      return window.__hekatanSCU = [
        0,
        0,
        0
      ], $n.visible = false, (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), M(), [
        0,
        0,
        0
      ];
    };
    let wa = false;
    window.__hekatanElegirSCU = (e = true) => (wa = e, window.__hekatanColocandoSCU = e, e), S.addEventListener("pointerdown", (e) => {
      if (!wa) return;
      e.preventDefault(), e.stopPropagation(), wa = false, window.__hekatanColocandoSCU = false;
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
      const a = Ae();
      if (a.length) {
        const o = a[0].point;
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
      ], n = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy"), a = (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d), o = Number((a == null ? void 0 : a[n === "xz" ? "workY" : n === "yz" ? "workX" : "workZ"]) ?? 0);
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
      const e = window, n = (e.__hekatanPlanosAux ?? []).length + (e.__hekatanLevels ?? []).filter((s) => (s == null ? void 0 : s.tipo) !== "piso").length;
      if (!n) return 0;
      (_a3 = e.__hekatanPushUndo) == null ? void 0 : _a3.call(e);
      const a = e.__hekatanPlanosAux;
      Array.isArray(a) ? a.length = 0 : e.__hekatanPlanosAux = [];
      const o = e.__hekatanLevels;
      if (Array.isArray(o)) {
        const s = o.filter((l) => (l == null ? void 0 : l.tipo) === "piso");
        o.length = 0, o.push(...s);
      }
      (_b = e.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(e);
      try {
        (_c = e.__hekatanRefreshLevels) == null ? void 0 : _c.call(e);
      } catch {
      }
      return n;
    }, window.__hekatanRefrescarGrillas = () => {
      if (!t.gridTarget) return;
      const e = t.gridTarget.rawVal.rotation, n = new Po().setFromEuler(new In(...e));
      new Po().setFromAxisAngle(new R(1, 0, 0), Math.PI / 2), is(t.gridTarget.rawVal.position[2], Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3);
    }, ve.derive(() => {
      Le.geometry.setAttribute("position", new Rt(t.points.val.flat(), 3)), Le.geometry.computeBoundingSphere();
    }), ve.derive(() => {
      const e = 0.05 * A * 0.5 * z.val;
      P.params.Points.threshold = 0.4 * e;
    }), ve.derive(() => {
      var _a3;
      const e = t.points.val ?? [], a = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], o = [];
      for (const l of a) {
        const [f, i, r] = e[l];
        o.push(f, i, r);
      }
      const s = new De();
      s.setAttribute("position", new Rt(o, 3)), We.geometry.dispose(), We.geometry = s;
    });
    let ya = false, Wn = 0;
    S.addEventListener("pointerdown", () => {
      ya = true;
    }), S.addEventListener("pointerup", () => {
      ya = false;
    }), S.addEventListener("pointermove", () => {
      ya && Wn++;
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
    let pn = null, _o = false, Ot = null;
    const xa = (e, n, a, o, s) => {
      s ? (Ut.style.borderColor = "#3faf46", Ut.style.borderStyle = "dashed", Ut.style.background = "rgba(63, 175, 70, 0.25)") : (Ut.style.borderColor = "#3f77c4", Ut.style.borderStyle = "solid", Ut.style.background = "rgba(63, 119, 196, 0.25)"), Ut.style.left = Math.min(e, a) + "px", Ut.style.top = Math.min(n, o) + "px", Ut.style.width = Math.abs(a - e) + "px", Ut.style.height = Math.abs(o - n) + "px", Ut.style.display = "block";
    }, ls = (e, n, a, o, s) => {
      var _a3, _b, _c, _d;
      const l = Math.min(e, a), f = Math.max(e, a), i = Math.min(n, o), r = Math.max(n, o), u = a < e, d = S.getBoundingClientRect(), _ = g();
      _.updateMatrixWorld();
      const x = (L) => {
        const U = new R(L[0], L[1], L[2]);
        return U.project(_), {
          x: d.left + (U.x * 0.5 + 0.5) * d.width,
          y: d.top + (-U.y * 0.5 + 0.5) * d.height
        };
      }, w = (L) => L.x >= l && L.x <= f && L.y >= i && L.y <= r, b = (L, U) => !(L.x < l && U.x < l || L.x > f && U.x > f || L.y < i && U.y < i || L.y > r && U.y > r);
      s || Je.clear();
      let E = 0;
      const p = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
      for (let L = 0; L < p.length; L++) {
        const U = p[L];
        U && w(x(U)) && (Je.add(`pt:${L}`), E++);
      }
      const h = (L, U) => u ? w(L) || w(U) || b(L, U) : w(L) && w(U), y = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], k = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
      for (let L = 0; L < y.length; L++) {
        const U = y[L];
        if (k.includes(L)) {
          let X;
          if (!u) X = U.every((K) => {
            const pe = p[K];
            return !!pe && w(x(pe));
          });
          else {
            X = false;
            for (let K = 0; K < U.length - 1; K++) {
              const pe = p[U[K]], ge = p[U[K + 1]];
              if (!(!pe || !ge) && h(x(pe), x(ge))) {
                X = true;
                break;
              }
            }
          }
          X && (Je.add(`poly:${L}`), E++);
        } else for (let X = 0; X < U.length - 1; X++) {
          const K = p[U[X]], pe = p[U[X + 1]];
          !K || !pe || h(x(K), x(pe)) && (Je.add(`seg:${L}:${X}`), E++);
        }
      }
      const I = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
      for (let L = 0; L < I.length; L++) {
        const U = I[L];
        if (!U || U.length !== 6) continue;
        const he = x([
          U[0],
          U[1],
          U[2]
        ]), X = x([
          U[3],
          U[4],
          U[5]
        ]);
        h(he, X) && (Je.add(`aux:${L}`), E++);
      }
      dn(), be(E === 0 && !u ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${u ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${E} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Je.size})`), Ut.style.display = "none";
    }, qo = () => {
      Ot && (Ot = null, Ut.style.display = "none", be("Selecci\xF3n cancelada"));
    };
    window.__hekatanCancelClickClickRect = qo, window.addEventListener("keydown", (e) => {
      e.key === "Escape" && Ot && qo();
    });
    const ga = () => {
      var _a3, _b, _c, _d;
      if (Je.size === 0) return false;
      const e = [
        ...Je
      ], n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], o = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, l = (s == null ? void 0 : s.rawVal) ?? [], f = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
      for (const b of e) {
        const [E, ...p] = b.split(":");
        if (E === "pt") f.add(+p[0]);
        else if (E === "poly") i.add(+p[0]);
        else if (E === "seg") {
          const h = +p[0], y = +p[1];
          r.has(h) || r.set(h, /* @__PURE__ */ new Set()), r.get(h).add(y);
        } else E === "aux" && u.add(+p[0]);
      }
      let d = 0, _ = [], x = [];
      const w = /* @__PURE__ */ new Map();
      for (let b = 0; b < a.length; b++) {
        if (i.has(b)) {
          d++;
          continue;
        }
        w.set(b, _.length);
        const E = r.get(b);
        if (E && E.size > 0) {
          let p = [];
          for (let h = 0; h < a[b].length; h++) p.push(a[b][h]), h < a[b].length - 1 && E.has(h) && (p.length >= 2 && _.push(p), p = [], d++);
          (p.length >= 2 || p.length === 1) && _.push(p);
        } else _.push([
          ...a[b]
        ]);
      }
      if (i.size > 0) {
        const b = /* @__PURE__ */ new Set();
        for (const E of _) for (const p of E) b.add(p);
        for (const E of i) for (const p of a[E] ?? []) b.has(p) || f.add(p);
      }
      if (f.size > 0) {
        const b = [], E = /* @__PURE__ */ new Map();
        for (let h = 0; h < n.length; h++) {
          if (f.has(h)) {
            d++;
            continue;
          }
          E.set(h, b.length), b.push([
            ...n[h]
          ]);
        }
        const p = [];
        for (const h of _) {
          let y = [];
          for (const k of h) {
            const $ = E.get(k);
            $ === void 0 ? (y.length >= 2 && p.push(y), y = []) : y.push($);
          }
          y.length >= 2 && p.push(y);
        }
        _ = p, t.points.val = b;
      }
      for (const b of o) {
        const E = w.get(b);
        E !== void 0 && E < _.length && x.push(E);
      }
      if (t.polylines && (t.polylines.val = _), t.areas && (t.areas.val = x), u.size > 0 && s) {
        const b = l.filter((E, p) => !u.has(p));
        "val" in s ? s.val = b : window.__hekatanDrawingAuxLines = b, d += u.size;
      }
      Je.clear(), dn();
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return be(`\u{1F5D1} ${d} item(s) borrado(s)`), true;
    }, Nn = new pt();
    Nn.name = "hekatan-reshape-grips", m.add(Nn);
    let Yn = -1, Ht = null, Ln = "";
    const ba = () => {
      var _a3, _b, _c, _d;
      for (const e of [
        ...Nn.children
      ]) {
        Nn.remove(e);
        const n = e;
        (_b = (_a3 = n.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = n.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
    }, cs = () => Math.max(0.06, (window.__hekatanSnap2D ?? 0.5) * 0.35), pi = (e) => {
      var _a3, _b;
      if (ba(), Yn = e, e < 0 || !t.polylines) return;
      const n = t.polylines.rawVal[e], a = t.points.rawVal;
      if (!n) return;
      const o = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, s = cs(), l = o ? new Us(s * 1.7, s * 1.7, s * 1.7) : new eo(s, 12, 10);
      for (const f of n) {
        const i = a[f];
        if (!i) continue;
        const r = new dt(l.clone(), new wt({
          color: 57599,
          depthTest: false,
          transparent: true,
          opacity: 0.95
        }));
        r.position.set(i[0], i[1], i[2]), r.renderOrder = 998, r.__pt = f, Nn.add(r);
      }
      l.dispose(), M == null ? void 0 : M();
    };
    window.__hekatanReshapeGrips = () => Nn.children.map((e) => ({
      pt: e.__pt,
      p: [
        e.position.x,
        e.position.y,
        e.position.z
      ]
    })), window.__hekatanReshapeSel = () => Yn;
    const fi = (e) => {
      const n = cs() * 2.2;
      let a = -1, o = n;
      for (const s of Nn.children) {
        const l = Math.hypot(s.position.x - e[0], s.position.y - e[1], s.position.z - e[2]);
        l < o && (o = l, a = s.__pt);
      }
      return a;
    }, hi = (e, n) => {
      const a = t.polylines.rawVal;
      let o = 0;
      for (const i of a) for (const r of i) r === n && o++;
      if (o <= 1) return n;
      const s = [
        ...t.points.rawVal
      ], l = s.length;
      s.push([
        ...s[n]
      ]), t.points.val = s;
      const f = a.map((i, r) => r === e ? i.map((u) => u === n ? l : u) : i);
      return t.polylines.val = f, l;
    }, mi = (e) => {
      if (!Ht) return e;
      const n = [
        Ht.x0,
        Ht.y0,
        Ht.z0
      ];
      if (Ln === "x") return [
        e[0],
        n[1],
        n[2]
      ];
      if (Ln === "y") return [
        n[0],
        e[1],
        n[2]
      ];
      if (Ln === "z") return [
        n[0],
        n[1],
        e[2]
      ];
      if (Ln === "l" && Ht.otro) {
        const a = Ht.otro, o = Math.hypot(n[0] - a[0], n[1] - a[1], n[2] - a[2]), s = [
          e[0] - a[0],
          e[1] - a[1],
          e[2] - a[2]
        ], l = Math.hypot(s[0], s[1], s[2]) || 1;
        return [
          a[0] + s[0] / l * o,
          a[1] + s[1] / l * o,
          a[2] + s[2] / l * o
        ];
      }
      return e;
    }, wi = () => {
      var _a3, _b, _c;
      return ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "reshape";
    };
    S.addEventListener("pointerdown", (e) => {
      var _a3, _b;
      if (!wi() || e.button !== 0) return;
      const n = rt(e);
      if (!n) return;
      const a = fi(n);
      if (a >= 0 && Yn >= 0) {
        const l = hi(Yn, a), f = t.polylines.rawVal[Yn], i = t.points.rawVal[l], r = f.length === 2 ? f.find((d) => d !== l) : void 0, u = r !== void 0 ? t.points.rawVal[r] : null;
        Ht = {
          pt: l,
          poly: Yn,
          x0: i[0],
          y0: i[1],
          z0: i[2],
          otro: u ? [
            u[0],
            u[1],
            u[2]
          ] : null
        }, window.__hekatanReshapeIgnorarPt = l, e.stopPropagation(), be("RESHAPE: arrastra el extremo. X / Y / Z fijan un eje - L fija la longitud - Espacio quita la restriccion.");
        return;
      }
      const o = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = Ro(n[0], n[1], n[2], o);
      if (s) {
        pi(s.polyIdx);
        const l = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(s.polyIdx)) ?? false;
        be("RESHAPE: " + (l ? "cascara" : "barra") + " designada - arrastra un extremo para " + (l ? "deformarla" : "alargarla o acortarla") + "."), e.stopPropagation();
      } else ba(), Yn = -1;
    }, true), S.addEventListener("pointermove", (e) => {
      var _a3;
      if (!Ht) return;
      const n = rt(e);
      if (!n) return;
      const a = mi(n), o = t.points.rawVal;
      if (o[Ht.pt] = [
        a[0],
        a[1],
        a[2]
      ], t.points.val = [
        ...o
      ], (_a3 = Nn.children.find((l) => l.__pt === Ht.pt)) == null ? void 0 : _a3.position.set(a[0], a[1], a[2]), Ht.otro) {
        const l = Ht.otro, f = Math.hypot(a[0] - l[0], a[1] - l[1], a[2] - l[2]);
        be("RESHAPE: longitud " + f.toFixed(3) + " m" + (Ln ? "  -  fijo " + Ln.toUpperCase() : ""));
      }
      M == null ? void 0 : M();
    }, true), S.addEventListener("pointerup", () => {
      var _a3;
      if (Ht) {
        Ht = null, Ln = "", window.__hekatanReshapeIgnorarPt = void 0;
        try {
          (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
        } catch {
        }
        be("Reshape aplicado.");
      }
    }, true), window.addEventListener("keydown", (e) => {
      if (!Ht) return;
      const n = e.key.toLowerCase();
      n === "x" || n === "y" || n === "z" || n === "l" ? (Ln = n, e.preventDefault()) : n === " " && (Ln = "", e.preventDefault());
    }, true), window.__hekatanReshapeLimpiar = () => {
      ba(), Yn = -1;
    }, window.__hekatanDeleteSelected = ga, window.addEventListener("keydown", (e) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const n = document.activeElement, a = !!n && (n.id === "hk3-cmd-input" || n.id === "hk-dyn-input");
      if (Je.size > 0) {
        if (n && !a && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable)) return;
        e.preventDefault(), a && (n.value = ""), ga();
        return;
      }
    });
    const Wt = document.createElement("div");
    Wt.id = "hk-properties-pane";
    const ds = "hk-props-pane-pos";
    let ko = null;
    try {
      const e = localStorage.getItem(ds);
      e && (ko = JSON.parse(e));
    } catch {
    }
    Wt.style.cssText = [
      "position:fixed",
      ko ? `left:${ko.left}px` : "left:14px",
      ko ? `top:${ko.top}px` : "top:200px",
      "transform:none",
      "width:min(300px, calc(100vw - 32px))",
      "max-height:calc(100vh - 260px)",
      "overflow-y:auto",
      "z-index:201",
      "box-shadow:0 6px 24px rgba(0,0,0,0.45)",
      "border-radius:6px",
      "display:none"
    ].join(";") + ";", document.body.appendChild(Wt);
    const yi = () => {
      const e = Wt.querySelector(".tp-rotv_b");
      if (!e || e.__hkDragWired) return;
      e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
      let n = false, a = 0, o = 0, s = 0, l = 0;
      e.addEventListener("mousedown", (f) => {
        n = true, a = f.clientX, o = f.clientY;
        const i = Wt.getBoundingClientRect();
        s = i.left, l = i.top, Wt.style.transform = "none", Wt.style.left = `${s}px`, Wt.style.top = `${l}px`, f.preventDefault();
      }), window.addEventListener("mousemove", (f) => {
        if (!n) return;
        const i = f.clientX - a, r = f.clientY - o, u = Math.max(0, Math.min(window.innerWidth - 80, s + i)), d = Math.max(0, Math.min(window.innerHeight - 40, l + r));
        Wt.style.left = `${u}px`, Wt.style.top = `${d}px`;
      }), window.addEventListener("mouseup", () => {
        if (n) {
          n = false;
          try {
            localStorage.setItem(ds, JSON.stringify({
              left: parseFloat(Wt.style.left),
              top: parseFloat(Wt.style.top)
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
    let xt = null;
    const Lt = (e, n, a, o) => {
      window.dispatchEvent(new CustomEvent("hk:property-applied", {
        detail: {
          kind: e,
          ids: n,
          prop: a,
          value: o
        }
      }));
    }, xi = () => {
      var _a3, _b, _c;
      if (xt && (xt.dispose(), xt = null), Je.size === 0) {
        Wt.style.display = "none";
        return;
      }
      const e = [
        ...Je
      ], n = e.filter((p) => p.startsWith("pt:"));
      if (n.length === 1) {
        const p = +n[0].slice(3), y = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(p);
        y ? [ye.Ux, ye.Uy, ye.Uz, ye.Rx, ye.Ry, ye.Rz] = y.map(Boolean) : ye.Ux = ye.Uy = ye.Uz = ye.Rx = ye.Ry = ye.Rz = false;
        const $ = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(p);
        $ ? [ye.Fx, ye.Fy, ye.Fz, ye.Mx, ye.My, ye.Mz] = $ : ye.Fx = ye.Fy = ye.Fz = ye.Mx = ye.My = ye.Mz = 0;
      }
      const a = e.filter((p) => p.startsWith("seg:")), o = new Set(((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []), s = (p) => o.has(+p.split(":")[1]), l = e.filter((p) => p.startsWith("poly:")), f = l.filter(s), i = l.filter((p) => !s(p)), r = e.filter((p) => p.startsWith("aux:")), u = n.length > 0, d = a.length > 0, _ = f.length > 0, x = i.length > 0, w = !u && !d && !_ && !x, b = [];
      n.length && b.push(`\u{1F535} ${n.length} nodo(s)`), a.length && b.push(`\u{1F4CF} ${a.length} segmento(s)`), f.length && b.push(`\u25AD ${f.length} \xE1rea(s)`), i.length && b.push(`\uFF0F ${i.length} l\xEDnea(s)`), r.length && b.push(`\u250A ${r.length} aux`);
      const E = `\u{1F3AF} ${Je.size} item(s) \u2014 ${b.join(", ")}`;
      xt = new qs({
        container: Wt,
        title: E
      });
      {
        const p = xt.addFolder({
          title: "\u270F\uFE0F Editar \u2014 Replicar / Mover",
          expanded: false
        });
        p.addBinding(vt, "dx", {
          label: "\u0394x (m)",
          step: 0.1
        }), p.addBinding(vt, "dy", {
          label: "\u0394y (m)",
          step: 0.1
        }), p.addBinding(vt, "dz", {
          label: "\u0394z (m)",
          step: 0.1
        }), p.addBinding(vt, "copias", {
          label: "Copias",
          min: 1,
          max: 50,
          step: 1
        }), p.addButton({
          title: "\u29C9 Replicar selecci\xF3n"
        }).on("click", () => {
          var _a4;
          const $ = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, vt.dx, vt.dy, vt.dz, vt.copias);
          be($ ? `\u29C9 Replicado \xD7${$} (\u0394 ${vt.dx},${vt.dy},${vt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
        }), p.addButton({
          title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea"
        }).on("click", () => {
          var _a4;
          const $ = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, vt.dx, vt.dy, vt.dz, vt.copias);
          be($ && ($.lineas || $.areas) ? `\u21D7 Extruido: ${$.lineas} barra(s), ${$.areas} pa\xF1o(s) (\u0394 ${vt.dx},${vt.dy},${vt.dz} m \xD7 ${vt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
        });
        const h = {
          vuelo: 1.5,
          losa: true,
          borde: true,
          ambos: true
        }, y = p.addFolder({
          title: "\u2310 Volado sobre la viga designada",
          expanded: false
        });
        y.addBinding(h, "vuelo", {
          label: "vuelo (m)",
          min: 0.1,
          max: 6,
          step: 0.05
        }), y.addBinding(h, "losa", {
          label: "con pa\xF1o de losa (si no, hueca)"
        }), y.addBinding(h, "borde", {
          label: "con viga de borde"
        }), y.addBinding(h, "ambos", {
          label: "a los dos lados"
        }), y.addButton({
          title: "\u2310 Poner volado (VOL)"
        }).on("click", () => {
          var _a4;
          const $ = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, h.vuelo, {
            losa: h.losa,
            vigaBorde: h.borde,
            lados: h.ambos ? "ambos" : "afuera"
          });
          be($ ? `\u2310 Volado de ${h.vuelo} m en ${$} pa\xF1o(s)` + (h.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
        }), p.addButton({
          title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)"
        }).on("click", () => {
          var _a4;
          const $ = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, vt.dx, vt.dy, vt.dz, 1);
          be($ ? `\u2192 Copia desplazada \u0394 ${vt.dx},${vt.dy},${vt.dz} m` : "\u26A0 Nada seleccionado");
        });
        const k = p.addFolder({
          title: "\u{1F9F2} Snap",
          expanded: false
        });
        k.addButton({
          title: "Snap a grilla ON/OFF (F9)"
        }).on("click", () => {
          var _a4;
          return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
        }), k.addButton({
          title: "OSNAP (endpoints/medios) ON/OFF"
        }).on("click", () => {
          window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), be(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
        });
      }
      if (u) {
        const p = xt.addFolder({
          title: `\u{1F4CC} Restraints (DOFs) \u2014 ${n.length} nodo(s)`
        });
        p.addBinding(ye, "Ux"), p.addBinding(ye, "Uy"), p.addBinding(ye, "Uz"), p.addBinding(ye, "Rx"), p.addBinding(ye, "Ry"), p.addBinding(ye, "Rz");
        const h = (L, U) => {
          [ye.Ux, ye.Uy, ye.Uz, ye.Rx, ye.Ry, ye.Rz] = L;
          try {
            xt.refresh();
          } catch {
          }
          Lt("nodes", n, "supports", L), be(`\u2713 ${U}: ${n.length} nudo(s) apoyado(s) (${L.map((he, X) => he ? [
            "Ux",
            "Uy",
            "Uz",
            "Rx",
            "Ry",
            "Rz"
          ][X] : "").filter(Boolean).join(" ")}).`);
        };
        p.addButton({
          title: `\u25B2 Empotrar los ${n.length} nudo(s) (6 GDL)`
        }).on("click", () => h([
          true,
          true,
          true,
          true,
          true,
          true
        ], "Empotrado")), p.addButton({
          title: `\u25B3 Articular los ${n.length} nudo(s) (Ux Uy Uz)`
        }).on("click", () => h([
          true,
          true,
          true,
          false,
          false,
          false
        ], "Articulado"));
        const y = xt.addFolder({
          title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)",
          expanded: false
        });
        y.addBinding(ye, "Kx", {
          label: "Kx",
          min: 0,
          step: 100
        }), y.addBinding(ye, "Ky", {
          label: "Ky",
          min: 0,
          step: 100
        }), y.addBinding(ye, "Kz", {
          label: "Kz",
          min: 0,
          step: 100
        }), y.addBinding(ye, "Krx", {
          label: "Krx",
          min: 0,
          step: 1e3
        }), y.addBinding(ye, "Kry", {
          label: "Kry",
          min: 0,
          step: 1e3
        }), y.addBinding(ye, "Krz", {
          label: "Krz",
          min: 0,
          step: 1e3
        });
        const k = xt.addFolder({
          title: "\u2B07 Joint Loads (kN, kN\xB7m)"
        });
        k.addBinding(ye, "Fx", {
          step: 0.1
        }), k.addBinding(ye, "Fy", {
          step: 0.1
        }), k.addBinding(ye, "Fz", {
          step: 0.1
        }), k.addBinding(ye, "Mx", {
          step: 0.1
        }), k.addBinding(ye, "My", {
          step: 0.1
        }), k.addBinding(ye, "Mz", {
          step: 0.1
        }), xt.addFolder({
          title: "\u2696 Additional Mass (kg)",
          expanded: false
        }).addBinding(ye, "mass", {
          label: "m",
          min: 0,
          step: 1
        }), xt.addFolder({
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
        }), xt.addButton({
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
            be("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
            let K = document.getElementById("hk-prop-toast");
            K || (K = document.createElement("div"), K.id = "hk-prop-toast", K.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(K)), K.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", K.style.background = "rgba(217,119,6,0.97)", K.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
              K && (K.style.opacity = "0");
            }, 3200);
          } else be(`\u2713 Propiedades aplicadas a ${n.length} nodo(s)`);
        });
      }
      if (d) {
        const p = xt.addFolder({
          title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)`
        });
        p.addBinding(ye, "section", {
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
        }), p.addBinding(ye, "material_frame", {
          label: "Material",
          options: {
            "A572 Gr 50": "A572 Gr 50",
            A36: "A36",
            A992: "A992",
            "Concreto C25": "Concreto C25"
          }
        });
        const h = xt.addFolder({
          title: "\u{1F527} Property Modifiers",
          expanded: false
        });
        h.addBinding(ye, "A_mod", {
          label: "A mod",
          min: 0,
          max: 10,
          step: 0.1
        }), h.addBinding(ye, "Iz_mod", {
          label: "Iz mod (fuerte)",
          min: 0,
          max: 10,
          step: 0.1
        }), h.addBinding(ye, "Iy_mod", {
          label: "Iy mod (d\xE9bil)",
          min: 0,
          max: 10,
          step: 0.1
        }), h.addBinding(ye, "J_mod", {
          label: "J mod",
          min: 0,
          max: 10,
          step: 0.1
        }), xt.addFolder({
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
        }), xt.addFolder({
          title: "\u{1F9ED} Local Axes",
          expanded: false
        }).addBinding(ye, "beta", {
          label: "\u03B2 (\xB0)",
          min: -180,
          max: 180,
          step: 5
        });
        const $ = xt.addFolder({
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
        const I = xt.addFolder({
          title: "\u{1F513} Releases extremo J",
          expanded: false
        });
        I.addBinding(ye, "relMxJ", {
          label: "Mx J"
        }), I.addBinding(ye, "relMyJ", {
          label: "My J"
        }), I.addBinding(ye, "relMzJ", {
          label: "Mz J"
        }), xt.addFolder({
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
        const U = xt.addFolder({
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
        const he = xt.addFolder({
          title: "\u2B07 Frame Loads (kN/m)"
        });
        he.addBinding(ye, "qx", {
          step: 0.1
        }), he.addBinding(ye, "qy", {
          step: 0.1
        }), he.addBinding(ye, "qz", {
          step: 0.1
        }), xt.addFolder({
          title: "\u2696 Additional Mass (kg/m)",
          expanded: false
        }).addBinding(ye, "massPerM", {
          label: "m/L",
          min: 0,
          step: 1
        }), xt.addButton({
          title: "\u2713 Aplicar a segmentos seleccionados"
        }).on("click", () => {
          Lt("segs", a, "section", ye.section), Lt("segs", a, "material", ye.material_frame);
          const K = {
            A: ye.A_mod,
            Iz: ye.Iz_mod,
            Iy: ye.Iy_mod,
            J: ye.J_mod
          };
          (K.A !== 1 || K.Iz !== 1 || K.Iy !== 1 || K.J !== 1) && Lt("segs", a, "modifiers", K), ye.insertionPoint !== "10 \u2014 Centroid" && Lt("segs", a, "insertionPoint", ye.insertionPoint), ye.beta !== 0 && Lt("segs", a, "beta", ye.beta);
          const pe = [
            ye.relMxI,
            ye.relMyI,
            ye.relMzI
          ], ge = [
            ye.relMxJ,
            ye.relMyJ,
            ye.relMzJ
          ];
          (pe.some((_e) => _e) || ge.some((_e) => _e)) && Lt("segs", a, "releases", {
            i: pe,
            j: ge
          }), ye.hinges !== "None" && Lt("segs", a, "hinges", ye.hinges);
          const Ce = [
            ye.LKx,
            ye.LKy,
            ye.LKz
          ];
          Ce.some((_e) => _e !== 0) && Lt("segs", a, "lineSprings", Ce);
          const Te = [
            ye.qx,
            ye.qy,
            ye.qz
          ];
          Te.some((_e) => _e !== 0) && Lt("segs", a, "distLoad", Te), ye.massPerM !== 0 && Lt("segs", a, "massPerM", ye.massPerM), be(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
        });
      }
      if (_) {
        const p = xt.addFolder({
          title: `\u25AD Shell / \xC1rea \u2014 ${f.length}`
        });
        p.addBinding(ye, "shellType", {
          label: "Tipo",
          options: {
            "Mindlin (FSDT)": "Mindlin (FSDT)",
            "Kirchhoff (CPT)": "Kirchhoff (CPT)",
            "Plane stress": "Plane stress"
          }
        }), p.addBinding(ye, "thickness", {
          label: "Espesor (m)",
          min: 0.01,
          step: 0.01
        }), p.addBinding(ye, "material_shell", {
          label: "Material",
          options: {
            "Concreto C20": "Concreto C20",
            "Concreto C25": "Concreto C25",
            "Concreto C30": "Concreto C30",
            "Acero A36": "Acero A36"
          }
        }), xt.addFolder({
          title: "\u2B07 Carga superficial (kN/m\xB2)"
        }).addBinding(ye, "surfLoad", {
          label: "q",
          step: 0.1
        }), xt.addButton({
          title: "\u2713 Aplicar a \xE1reas seleccionadas"
        }).on("click", () => {
          Lt("areas", f, "shellType", ye.shellType), Lt("areas", f, "thickness", ye.thickness), Lt("areas", f, "material", ye.material_shell), ye.surfLoad !== 0 && Lt("areas", f, "surfLoad", ye.surfLoad), be(`\u2713 Propiedades aplicadas a ${f.length} \xE1rea(s)/shell(s)`);
        });
      }
      if (w) {
        const p = xt.addFolder({
          title: "\u2139 Selecci\xF3n"
        }), h = {
          msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar"
        };
        p.addBinding(h, "msg", {
          readonly: true,
          label: ""
        });
      }
      xt.addButton({
        title: "\u2715 Cerrar (limpia selecci\xF3n)"
      }).on("click", () => {
        Je.clear(), dn();
      }), Wt.style.display = "block", yi();
    };
    window.__hekatanRefreshPropsPane = xi;
    let uo = null, Ko = false;
    S.addEventListener("pointerdown", (e) => {
      e.button === 2 && (uo = {
        x: e.clientX,
        y: e.clientY
      }, Ko = false);
    }), S.addEventListener("pointermove", (e) => {
      if (uo && e.buttons & 2 && !Ko) {
        const n = e.clientX - uo.x, a = e.clientY - uo.y;
        Math.hypot(n, a) > 8 && (Ko = true);
      }
    }), S.addEventListener("pointerup", (e) => {
      var _a3, _b, _c;
      if (e.button === 2) {
        const n = uo !== null && !Ko;
        uo = null;
        const a = window.__hekatanRClickOnElement === true;
        if (window.__hekatanRClickOnElement = false, a) return;
        if (n) {
          if (Ot ? qo() : window.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape",
            bubbles: true
          })), Je.size > 0 && (Je.clear(), dn()), t.polylines) {
            const l = t.polylines.rawVal;
            (l[l.length - 1] ?? []).length > 0 && (t.polylines.val = [
              ...l,
              []
            ]);
          }
          const o = window.__hekatanCadState, s = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
          s && s !== "select" && s !== "none" ? ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"), be(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : be("\u238B Cancelado (click derecho)");
        }
      }
    }), S.addEventListener("contextmenu", (e) => {
      e.preventDefault(), e.stopPropagation();
    }, {
      capture: true
    }), S.addEventListener("pointerdown", (e) => {
      var _a3, _b, _c;
      const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
      n !== "select" && n !== "none" && n || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (pn = {
        x: e.clientX,
        y: e.clientY
      }, _o = false));
    }), S.addEventListener("pointermove", (e) => {
      if (Ot && e.buttons === 0) {
        const l = e.clientX < Ot.x;
        xa(Ot.x, Ot.y, e.clientX, e.clientY, l);
        return;
      }
      if (!pn) return;
      const n = e.clientX - pn.x, a = e.clientY - pn.y, o = Math.hypot(n, a);
      if (!_o && o < 8) return;
      _o = true;
      const s = e.clientX < pn.x;
      xa(pn.x, pn.y, e.clientX, e.clientY, s);
    }), S.addEventListener("pointerup", (e) => {
      if (!pn) return;
      if (!_o) {
        pn = null;
        return;
      }
      const n = e.ctrlKey || e.metaKey || e.shiftKey;
      ls(pn.x, pn.y, e.clientX, e.clientY, n), pn = null, _o = false;
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
    const an = new pt();
    an.visible = false, an.frustumCulled = false, m.add(an);
    const us = {
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
    }, Go = (e, n, a, o) => {
      var _a3, _b, _c, _d;
      for (window.__hekatanOsnapUltimo = {
        type: e,
        x: n,
        y: a,
        z: o
      }; an.children.length; ) {
        const f = an.children.pop();
        (_b = (_a3 = f.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = f.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }
      const s = us[e] ?? 16777215, l = new De().setFromPoints([
        new R(-1, -1, 0),
        new R(1, -1, 0),
        new R(1, -1, 0),
        new R(1, 1, 0),
        new R(1, 1, 0),
        new R(-1, 1, 0),
        new R(-1, 1, 0),
        new R(-1, -1, 0)
      ]);
      an.add(new rn(l, new mt({
        color: s,
        linewidth: 2
      }))), an.position.set(n, a, o), an.visible = true, va();
    };
    let Ma = 4;
    const va = () => {
      an.visible && an.scale.setScalar(Ma * Xo(an.position));
    };
    window.__hekatanOsnapMarkerRef = an, window.__hekatanUpdateOsnapScale = va, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (Ma = e, va(), M()), Ma);
    const Ho = () => {
      an.visible = false, window.__hekatanOsnapUltimo = null;
    }, gi = {
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
    }, Sn = document.createElement("div");
    Sn.id = "hk-osnap-etiqueta", Sn.style.cssText = [
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
    ].join(";") + ";", document.body.appendChild(Sn);
    const Wo = (e, n, a) => {
      const o = gi[e];
      if (!o) {
        Sn.style.display = "none";
        return;
      }
      Sn.textContent = o, Sn.style.color = "#" + (us[e] ?? 16777215).toString(16).padStart(6, "0"), Sn.style.left = n + 18 + "px", Sn.style.top = a - 26 + "px", Sn.style.display = "block";
    }, bi = () => {
      Sn.style.display = "none";
    }, Jn = new R(), Qn = (e, n, a) => {
      const o = g();
      if (!o) return null;
      const s = S.getBoundingClientRect();
      return Jn.set(e, n, a).project(o), !isFinite(Jn.x) || !isFinite(Jn.y) || Jn.z < -1 || Jn.z > 1 ? null : {
        x: s.left + (Jn.x * 0.5 + 0.5) * s.width,
        y: s.top + (-Jn.y * 0.5 + 0.5) * s.height
      };
    };
    window.__hekatanAPixeles = Qn;
    const Mi = (e, n, a, o, s) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h;
      if (window.__hekatanOsnapOn === false) return null;
      const l = window.__hekatanOsnap, f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
      let r = null;
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
      }, d = s, _ = (h, y, k, $) => {
        let I;
        if (d) {
          const U = Qn(y, k, $);
          if (!U || (I = Math.hypot(U.x - d.x, U.y - d.y), I > Dn)) return;
        } else if (I = Math.hypot(y - e, k - n, $ - a), I > o) return;
        const L = u[h] ?? 9;
        (!r || L < r.r || L === r.r && I < r.d) && (r = {
          type: h,
          x: y,
          y: k,
          z: $,
          d: I,
          r: L
        });
      };
      if (l.ori !== false && _("ori", 0, 0, 0), l.grid !== false && window.__hekatanSnapEnabled === true) {
        const h = window.__hekatanGridConfig, y = (h == null ? void 0 : h.minorStep) && h.minorStep > 0 ? h.minorStep : 1, k = ((h == null ? void 0 : h.gridSize) ?? 30) / 2, $ = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", I = (U) => Math.round(U / y) * y, L = (U, he) => Math.abs(U) <= k + 1e-9 && Math.abs(he) <= k + 1e-9;
        if ($ === "xz") {
          const U = I(e), he = I(a);
          L(U, he) && _("grid", U, n, he);
        } else if ($ === "yz") {
          const U = I(n), he = I(a);
          L(U, he) && _("grid", e, U, he);
        } else {
          const U = I(e), he = I(n);
          L(U, he) && _("grid", U, he, a);
          const X = window.__hekatanPlanosAux ?? [];
          for (const pe of X.slice(0, 24)) {
            if (pe.plano === "xy" || !isFinite(pe.d)) continue;
            const ge = pe.plano === "xz" ? new R(0, 1, 0) : new R(1, 0, 0), Ce = new Co(ge, -pe.d), Te = new R();
            if (P.ray.intersectPlane(Ce, Te)) if (pe.plano === "xz") {
              const _e2 = I(Te.x), Be = I(Te.z);
              L(_e2, Be) && _("grid", _e2, pe.d, Be);
            } else {
              const _e2 = I(Te.y), Be = I(Te.z);
              L(_e2, Be) && _("grid", pe.d, _e2, Be);
            }
          }
          const K = window.__hekatanLevels ?? [];
          if (K.length) {
            const pe = P.ray, ge = new Co(), Ce = new R();
            for (const Te of K.slice(0, 24)) {
              if (!isFinite(Te == null ? void 0 : Te.z) || Math.abs(Te.z - a) < 1e-6 || (ge.set(new R(0, 0, 1), -Te.z), !pe.intersectPlane(ge, Ce))) continue;
              const _e2 = I(Ce.x), Be = I(Ce.y);
              L(_e2, Be) && _("grid", _e2, Be, Te.z);
            }
          }
        }
      }
      (l.node || l.end) && f.forEach((h) => {
        l.node && _("node", h[0], h[1], h[2]);
      });
      for (const h of i) if (!(h.length < 2)) for (let y = 0; y < h.length - 1; y++) {
        const k = f[h[y]], $ = f[h[y + 1]];
        if (!(!k || !$) && (l.end && (_("end", k[0], k[1], k[2]), _("end", $[0], $[1], $[2])), l.mid && _("mid", (k[0] + $[0]) / 2, (k[1] + $[1]) / 2, (k[2] + $[2]) / 2), l.nea || l.per)) {
          const I = $[0] - k[0], L = $[1] - k[1], U = $[2] - k[2], he = I * I + L * L + U * U;
          if (he < 1e-12) continue;
          const X = Math.max(0, Math.min(1, ((e - k[0]) * I + (n - k[1]) * L + (a - k[2]) * U) / he)), K = k[0] + X * I, pe = k[1] + X * L, ge = k[2] + X * U;
          l.nea && _("nea", K, pe, ge), l.per && _("per", K, pe, ge);
        }
      }
      if (l.cen) {
        const h = ((_e = t.areas) == null ? void 0 : _e.rawVal) ?? [];
        for (const y of h) {
          const k = i[y];
          if (!k || k.length < 3) continue;
          const $ = k[0] === k[k.length - 1] ? k.slice(0, -1) : k;
          let I = 0, L = 0, U = 0, he = 0;
          for (const X of $) {
            const K = f[X];
            K && (I += K[0], L += K[1], U += K[2], he++);
          }
          he >= 3 && _("cen", I / he, L / he, U / he);
        }
      }
      if (l.cen) {
        const h = ja(), y = [
          ...Bo
        ];
        for (const k of h) y.some(($) => Math.hypot($.c[0] - k.c[0], $.c[1] - k.c[1], $.c[2] - k.c[2]) < 1e-6 && Math.abs($.r - k.r) < 1e-6) || y.push(k);
        for (const k of y) {
          if (!f.some((L) => Math.abs(Math.hypot(L[0] - k.c[0], L[1] - k.c[1], L[2] - k.c[2]) - k.r) < 1e-6)) continue;
          const I = Math.hypot(e - k.c[0], n - k.c[1], a - k.c[2]);
          if (I < o || Math.abs(I - k.r) < o) {
            const L = Math.min(I, o * 0.5), U = 3;
            (!r || U < r.r || U === r.r && L < r.d) && (r = {
              type: "cen",
              x: k.c[0],
              y: k.c[1],
              z: k.c[2],
              d: L,
              r: U
            });
          }
        }
      }
      if (l.int) {
        const h = [];
        for (const y of i) for (let k = 0; k < y.length - 1; k++) {
          const $ = f[y[k]], I = f[y[k + 1]];
          if (!$ || !I) continue;
          const L = I[0] - $[0], U = I[1] - $[1], he = I[2] - $[2], X = L * L + U * U + he * he;
          if (X < 1e-12) continue;
          const K = Math.max(0, Math.min(1, ((e - $[0]) * L + (n - $[1]) * U + (a - $[2]) * he) / X));
          Math.hypot($[0] + K * L - e, $[1] + K * U - n, $[2] + K * he - a) < 3 * o && h.push([
            $,
            I
          ]);
        }
        for (let y = 0; y < h.length; y++) for (let k = y + 1; k < h.length; k++) {
          const [$, I] = h[y], [L, U] = h[k], he = [
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
          ], pe = he[0] * he[0] + he[1] * he[1] + he[2] * he[2], ge = he[0] * X[0] + he[1] * X[1] + he[2] * X[2], Ce = X[0] * X[0] + X[1] * X[1] + X[2] * X[2], Te = he[0] * K[0] + he[1] * K[1] + he[2] * K[2], _e2 = X[0] * K[0] + X[1] * K[1] + X[2] * K[2], Be = pe * Ce - ge * ge;
          if (Be < 1e-12) continue;
          const Ie = (ge * _e2 - Ce * Te) / Be, qe = (pe * _e2 - ge * Te) / Be;
          if (Ie < -1e-6 || Ie > 1 + 1e-6 || qe < -1e-6 || qe > 1 + 1e-6) continue;
          const Ne = [
            $[0] + Ie * he[0],
            $[1] + Ie * he[1],
            $[2] + Ie * he[2]
          ], Re = [
            L[0] + qe * X[0],
            L[1] + qe * X[1],
            L[2] + qe * X[2]
          ];
          if (Math.hypot(Ne[0] - Re[0], Ne[1] - Re[1], Ne[2] - Re[2]) > 1e-4) continue;
          [
            $,
            I,
            L,
            U
          ].some((He) => Math.hypot(He[0] - Ne[0], He[1] - Ne[1], He[2] - Ne[2]) < 1e-6) || _("int", Ne[0], Ne[1], Ne[2]);
        }
      }
      const x = window.__hekatanAxisGrids ?? [], w = window.__hekatanLevels ?? [], b = x.filter((h) => h && h.start && h.end).map((h) => [
        h.start,
        h.end
      ]);
      for (const [h, y] of b) {
        l.end && (_("end", h[0], h[1], h[2]), _("end", y[0], y[1], y[2]));
        const k = y[0] - h[0], $ = y[1] - h[1], I = y[2] - h[2], L = k * k + $ * $ + I * I;
        if (L < 1e-12) continue;
        const U = Math.max(0, Math.min(1, ((e - h[0]) * k + (n - h[1]) * $ + (a - h[2]) * I) / L));
        if (l.nea && _("nea", h[0] + U * k, h[1] + U * $, h[2] + U * I), l.int && Math.abs(I) > 1e-9) for (const he of w) {
          const X = (he.z - h[2]) / I;
          X < -1e-6 || X > 1 + 1e-6 || _("int", h[0] + X * k, h[1] + X * $, he.z);
        }
      }
      if (l.int || l.node) for (let h = 0; h < b.length; h++) for (let y = h + 1; y < b.length; y++) {
        const [k, $] = b[h], [I, L] = b[y], U = $[0] - k[0], he = $[1] - k[1], X = L[0] - I[0], K = L[1] - I[1], pe = U * K - he * X;
        if (Math.abs(pe) < 1e-12) continue;
        const ge = k[0] - I[0], Ce = k[1] - I[1], Te = (X * Ce - K * ge) / pe, _e2 = (U * Ce - he * ge) / pe;
        if (Te < -1e-6 || Te > 1 + 1e-6 || _e2 < -1e-6 || _e2 > 1 + 1e-6) continue;
        const Be = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
        _("int", k[0] + Te * U, k[1] + Te * he, typeof Be == "number" ? Be : a);
      }
      const E = window.__hekatanDrawingAuxLines, p = (E == null ? void 0 : E.rawVal) ?? (E == null ? void 0 : E.val) ?? E ?? [];
      for (const h of p) {
        if (h.length !== 6) continue;
        const y = [
          h[0],
          h[1],
          h[2]
        ], k = [
          h[3],
          h[4],
          h[5]
        ];
        if (l.end && (_("end", y[0], y[1], y[2]), _("end", k[0], k[1], k[2])), l.mid && _("mid", (y[0] + k[0]) / 2, (y[1] + k[1]) / 2, (y[2] + k[2]) / 2), l.nea || l.per) {
          const $ = k[0] - y[0], I = k[1] - y[1], L = k[2] - y[2], U = $ * $ + I * I + L * L;
          if (U < 1e-12) continue;
          const he = Math.max(0, Math.min(1, ((e - y[0]) * $ + (n - y[1]) * I + (a - y[2]) * L) / U)), X = y[0] + he * $, K = y[1] + he * I, pe = y[2] + he * L;
          l.nea && _("nea", X, K, pe), l.per && _("per", X, K, pe);
        }
      }
      return r ? {
        type: r.type,
        x: r.x,
        y: r.y,
        z: r.z
      } : null;
    }, po = new pt();
    po.frustumCulled = false, m.add(po);
    const ps = new mt({
      color: 15123555,
      transparent: true,
      opacity: 1,
      depthTest: false
    });
    let fs = 0;
    const hs = () => {
      var _a3, _b;
      for (const e of po.children.slice()) po.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
    };
    window.__hekatanDestello = (e) => {
      var _a3, _b;
      hs();
      const n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
      for (const s of e || []) {
        const l = String(s).split(":");
        let f = [];
        if (l[0] === "pt") {
          const u = n[+l[1]];
          u && (f = [
            u,
            [
              u[0] + 1e-3,
              u[1],
              u[2]
            ]
          ]);
        } else if (l[0] === "seg") {
          const u = a[+l[1]] || [], d = n[u[+l[2]]], _ = n[u[+l[2] + 1]];
          d && _ && (f = [
            d,
            _
          ]);
        } else l[0] === "poly" && (f = (a[+l[1]] || []).map((d) => n[d]).filter(Boolean));
        if (f.length < 2) continue;
        const i = new De().setFromPoints(f.map((u) => new R(u[0], u[1], u[2]))), r = new Ft(i, ps);
        r.renderOrder = 1200, po.add(r);
      }
      if (!po.children.length) return;
      fs = performance.now() + 900;
      const o = () => {
        const s = fs - performance.now();
        if (s <= 0) {
          hs(), M();
          return;
        }
        ps.opacity = Math.min(1, s / 900) * 0.95, M(), requestAnimationFrame(o);
      };
      requestAnimationFrame(o);
    }, window.addEventListener("hk:property-applied", (e) => {
      var _a3;
      const n = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
      Array.isArray(n) && n.length && window.__hekatanDestello(n);
    }), window.__hekatanOsnapCompute = Mi, window.__hekatanOsnapShow = Go, window.__hekatanOsnapHide = Ho;
    let Qe = [], At = 0, On = 0, Yt = null;
    const So = document.createElement("div");
    So.id = "hk-cad-status", So.style.cssText = [
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
    ].join(";") + ";", So.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(So);
    const vi = () => {
      var _a3, _b, _c;
      const e = [];
      window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), zt && e.push(`\u{1F512} LOCK ${zt.toUpperCase()}`);
      const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
      return Math.abs(a) > 1e-3 && e.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
    }, be = (e) => {
      var _a3;
      const n = e + vi();
      So.textContent = n, window.__hekatanCadStatusText = n;
      try {
        (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
      } catch {
      }
    }, _i = "Comando:", ki = () => {
      var _a3, _b, _c, _d;
      const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", n = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], a = n.length ? n[n.length - 1] : [], o = Qe.length, s = (l, f = []) => ({
        txt: l,
        ops: f
      });
      switch (e) {
        case "line":
          return a.length >= 2 ? s("L\xCDNEA Precise punto siguiente o", [
            "Cerrar",
            "desHacer"
          ]) : a.length === 1 ? s("L\xCDNEA Precise punto siguiente o", [
            "desHacer"
          ]) : s("L\xCDNEA Precise primer punto:");
        case "polyline":
          return a.length >= 2 ? s("POLIL\xCDNEA Precise punto siguiente o", [
            "Cerrar",
            "desHacer"
          ]) : a.length === 1 ? s("POLIL\xCDNEA Precise punto siguiente o", [
            "desHacer"
          ]) : s("POLIL\xCDNEA Precise punto inicial:");
        case "node":
          return s("NUDO Precise punto:");
        case "area":
          return s(`LOSA Precise v\xE9rtice ${Math.min(a.length + 1, 4)} de 4 (en orden, antihorario):`);
        case "rectarea":
          return s(o ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
        case "polyarea":
          return s(`\xC1REA LIBRE Precise v\xE9rtice ${Ge.length + 1} (Enter o clic derecho cierra y malla):`);
        case "fillarea":
          return s("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
        case "medir":
          return s(`REGLA ${lt.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
        case "rect":
          return s(o ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
        case "circle":
          return s(o ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
        case "arc":
          return s(o === 0 ? "ARCO Precise punto inicial:" : o === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
        case "parabola":
          return s(`PAR\xC1BOLA Precise punto ${o + 1} de 3 (pasa por los tres):`);
        case "cubica":
          return s(`C\xDABICA Precise punto ${o + 1} de 4 (pasa por los cuatro):`);
        case "revolve":
          return s("REVOLUCI\xD3N Precise un punto del eje vertical (Z) alrededor del que gira la selecci\xF3n:");
        case "loft":
          return s("BARRIDO Precise el centro de la planta (eje Z desde el que se mide la panza del perfil):");
        case "col":
          return s(`COLUMNA Precise punto de inserci\xF3n (altura ${At > 0 ? At : 3} m; teclee otra + Enter antes del clic):`);
        case "wall":
          return s(o ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${At > 0 ? At : 3} m; teclee otra + Enter):`);
        case "plane3":
          return s(`PLANO Precise punto ${o + 1} de 3:`);
        case "extp":
          return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
        case "extl":
          return s("EXTRUIR Precise la l\xEDnea a levantar:");
        case "extend":
          return s(Yt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
        case "trim":
          return s(Yt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
        case "offset":
          return s(Yt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${On > 0 ? ` (distancia ${On} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
        case "axis":
          return s("EJE Precise el primer punto del eje:");
        case "aux":
          return s(o ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
        case "auxp":
          return s("PUNTO AUXILIAR Precise punto:");
        case "chaflan":
          return s(o ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
        case "delete":
          return s("BORRAR Designe objetos (pase por encima y haga clic):");
        case "move":
          return Je.size ? s(o ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
        case "copy":
          return Je.size ? s(o ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
        case "select":
          return Je.size ? s(`SELECCI\xD3N ${Je.size} objeto${Je.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
        default:
          return s(_i);
      }
    }, jt = () => {
      var _a3, _b, _c, _d, _e;
      try {
        const e = ki(), n = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !n && !a ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
        (_e = window.__hekatanCadPrompt) == null ? void 0 : _e.call(window, s, e.ops);
      } catch {
      }
    };
    window.__hekatanCadRefreshPrompt = jt, window.__hekatanRefreshStatus = () => {
      const e = window.__hekatanCadStatusText ?? "", n = e.split("   |   ")[0] ?? e;
      be(n);
    }, window.__hekatanCadResetPending = () => {
      Qe = [], Ge = [], Ee.visible = false, _a(), Yt = null, M(), be("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), jt();
    };
    function _a() {
      if (!t.polylines) return;
      const e = t.polylines.rawVal.filter((n) => n.length >= 2);
      t.polylines.val = [
        ...e,
        []
      ];
    }
    window.__hekatanCerrarPolilinea = _a;
    const fo = [], Jo = [], Si = () => {
      const e = window.__hekatanDrawingAuxLines;
      return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
    }, Pi = () => JSON.parse(JSON.stringify(window.__hekatanAxisGrids ?? [])), zi = () => JSON.parse(JSON.stringify(window.__hekatanLevels ?? [])), Ai = () => JSON.parse(JSON.stringify(window.__hekatanPlanosAux ?? [])), ka = () => {
      var _a3, _b;
      return {
        p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])),
        l: JSON.parse(JSON.stringify(((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [])),
        a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])),
        x: Si(),
        e: Pi(),
        n: zi(),
        g: Ai()
      };
    }, ms = (e) => {
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
      Qe = [], Se.visible = false, $t.visible = false, en();
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      M(), jt();
    }, Pt = () => {
      fo.push(ka()), fo.length > 100 && fo.shift(), Jo.length = 0;
    }, Qo = () => {
      const e = fo.pop();
      if (!e) {
        be("\u21B6 Nada para deshacer");
        return;
      }
      Jo.push(ka()), ms(e), be(`\u21B6 Deshacer \u2014 quedan ${fo.length}`);
    }, ws = () => {
      const e = Jo.pop();
      if (!e) {
        be("\u21B7 Nada para rehacer");
        return;
      }
      fo.push(ka()), ms(e), be(`\u21B7 Rehacer \u2014 quedan ${Jo.length}`);
    };
    window.__hekatanPushUndo = Pt, window.__hekatanUndo = Qo, window.__hekatanRedo = ws, document.addEventListener("keydown", (e) => {
      var _a3;
      const n = e.key.toLowerCase();
      if (!((e.ctrlKey || e.metaKey) && (n === "y" || n === "z" && e.shiftKey))) return;
      const o = e.target;
      o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && (((_a3 = o.value) == null ? void 0 : _a3.length) ?? 0) > 0 && o.__hkSucio || (e.preventDefault(), e.stopPropagation(), ws());
    }, {
      capture: true
    }), window.__hekatanCadOption = (e) => {
      var _a3, _b, _c, _d, _e;
      const n = e.trim().toLowerCase(), a = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
      if (!t.polylines) return false;
      const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
      if (a !== "line" && a !== "polyline") return n === "u" || n === "deshacer" || n === "undo" ? (Qo(), true) : false;
      if (n === "c" || n === "cerrar" || n === "close") {
        if (s.length < 3) return be("Cerrar necesita al menos tres puntos."), true;
        Pt(), t.polylines.val = [
          ...o.slice(0, -1),
          [
            ...s,
            s[0]
          ],
          []
        ];
        try {
          (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
        } catch {
        }
        return Sa(), be(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
      }
      if (n === "u" || n === "deshacer" || n === "undo") {
        if (!s.length) return Qo(), true;
        Pt();
        const l = s[s.length - 1], f = s.slice(0, -1), i = o.some((d, _) => _ !== o.length - 1 && d.includes(l)) || f.includes(l);
        let r = t.points.rawVal, u = [
          ...o.slice(0, -1),
          f
        ];
        if (!i && l === r.length - 1 && (r = r.slice(0, -1), t.points.val = r), t.polylines.val = u, f.length) {
          const d = r[f[f.length - 1]];
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
        return M(), be(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${f.length}.`), jt(), true;
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
        const n = e.target, a = n == null ? void 0 : n.tagName;
        if ((a === "INPUT" || a === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && ((_a3 = n.value) == null ? void 0 : _a3.length) > 0 && !!n.__hkSucio) return;
        e.preventDefault(), e.stopPropagation(), Qo();
      }
    }, {
      capture: true
    });
    const Sa = () => {
      Qe = [], Yt = null, _a(), zt = null, Ka(), Se.visible = false, $t.visible = false, en(), be("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), M(), jt();
    };
    window.__hekatanFinalizeDraw = Sa, window.__hekatanCancelarTodo = () => (Pa(), true);
    const Pa = () => {
      var _a3, _b, _c;
      Qe = [], Ge = [], Ee.visible = false;
      let e = false;
      Je.size && (Je.clear(), dn(), e = true), Sa();
      try {
        const n = window.__hekatanCadState, a = (_b = (_a3 = n == null ? void 0 : n.get) == null ? void 0 : _a3.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"));
      } catch {
      }
      be(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), M(), jt();
    };
    window.__hekatanEscapeCancel = Pa;
    const ys = () => {
      var _a3;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Set();
      return Je.forEach((a) => {
        if (a.startsWith("pt:")) n.add(+a.slice(3));
        else if (a.startsWith("poly:")) (e[+a.slice(5)] || []).forEach((o) => n.add(o));
        else if (a.startsWith("seg:")) {
          const o = a.split(":"), s = e[+o[1]] || [], l = s[+o[2]], f = s[+o[2] + 1];
          l != null && n.add(l), f != null && n.add(f);
        }
      }), n;
    }, xs = (e, n, a) => {
      var _a3;
      const o = ys();
      if (!o.size) return 0;
      Pt();
      const s = t.points.rawVal.map((l, f) => o.has(f) ? [
        l[0] + e,
        l[1] + n,
        l[2] + a
      ] : l);
      t.points.val = s;
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return dn(), M(), o.size;
    };
    window.__hekatanMoveSelection = xs;
    const gs = (e, n) => {
      var _a3, _b, _c, _d, _e;
      if (!Je.size) {
        be(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), jt();
        return;
      }
      if (Qe.push(n), Qe.length === 1) {
        Pe = n, be(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)}). Precise el segundo punto.`), jt();
        return;
      }
      const [a, o] = Qe, s = [
        o[0] - a[0],
        o[1] - a[1],
        o[2] - a[2]
      ];
      Qe = [], Se.visible = false;
      let l = 0;
      e === "move" ? l = xs(s[0], s[1], s[2]) : (l = ys().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), be(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${l} nudo${l === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), e === "move" && (Je.clear(), dn()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), jt();
    };
    window.__hekatanPasoMoverCopiar = gs;
    const Ci = () => {
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
    }, Xn = (e, n) => Math.hypot(e[0] - n[0], e[1] - n[1], e[2] - n[2]), za = (e, n, a, o, s, l) => {
      const f = [
        n[0] - e[0],
        n[1] - e[1],
        n[2] - e[2]
      ], i = [
        o[0] - a[0],
        o[1] - a[1],
        o[2] - a[2]
      ], r = [
        e[0] - a[0],
        e[1] - a[1],
        e[2] - a[2]
      ], u = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], d = f[0] * i[0] + f[1] * i[1] + f[2] * i[2], _ = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], x = f[0] * r[0] + f[1] * r[1] + f[2] * r[2], w = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], b = u * _ - d * d;
      if (b < 1e-12) return null;
      const E = (d * w - _ * x) / b, p = (u * w - d * x) / b;
      if (!s && (E < -1e-6 || E > 1 + 1e-6) || !l && (p < -1e-6 || p > 1 + 1e-6)) return null;
      const h = [
        e[0] + E * f[0],
        e[1] + E * f[1],
        e[2] + E * f[2]
      ], y = [
        a[0] + p * i[0],
        a[1] + p * i[1],
        a[2] + p * i[2]
      ];
      return Xn(h, y) > 1e-4 ? null : h;
    }, Ei = (e) => {
      var _a3;
      return (((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((n, a) => n + a.filter((o) => o === e).length, 0);
    }, Fi = {
      offset: "DESFASE",
      trim: "RECORTAR",
      extend: "ALARGAR"
    }, $i = (e, n) => {
      var _a3, _b;
      if (!t.polylines) return;
      const a = t.polylines.rawVal, o = t.points.rawVal, s = Fi[e];
      if (!Yt) {
        if (mn < 0) {
          be(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
          return;
        }
        Yt = {
          poly: mn,
          seg: Math.max(0, Tn)
        }, be(e === "offset" ? `DESFASE l\xEDnea #${Yt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${On > 0 ? ` (${On} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), jt();
        return;
      }
      if (e === "offset") {
        const E = Yt.poly, p = a[E];
        if (!p || p.length < 2) {
          Yt = null, be("DESFASE: esa polil\xEDnea no tiene tramos."), jt();
          return;
        }
        const h = p.length > 2 && p[0] === p[p.length - 1], y = Ci(), k = [];
        for (let Ie = 0; Ie < p.length - 1; Ie++) {
          const qe = o[p[Ie]], Ne = o[p[Ie + 1]], Re = [
            Ne[0] - qe[0],
            Ne[1] - qe[1],
            Ne[2] - qe[2]
          ], Ze = Math.hypot(Re[0], Re[1], Re[2]) || 1, He = Re[0] / Ze, ft = Re[1] / Ze, ht = Re[2] / Ze, kt = [
            y[1] * ht - y[2] * ft,
            y[2] * He - y[0] * ht,
            y[0] * ft - y[1] * He
          ], gt = Math.hypot(kt[0], kt[1], kt[2]) || 1;
          k.push({
            a: qe,
            b: Ne,
            n: [
              kt[0] / gt,
              kt[1] / gt,
              kt[2] / gt
            ]
          });
        }
        let $ = 0, I = 1 / 0;
        k.forEach((Ie, qe) => {
          const Ne = yo(n[0], n[1], n[2], Ie.a[0], Ie.a[1], Ie.a[2], Ie.b[0], Ie.b[1], Ie.b[2]);
          Ne < I && (I = Ne, $ = qe);
        });
        const L = k[$], U = Math.sign((n[0] - L.a[0]) * L.n[0] + (n[1] - L.a[1]) * L.n[1] + (n[2] - L.a[2]) * L.n[2]) || 1, he = On > 0 ? On : I;
        if (he < 1e-6) {
          be("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
          return;
        }
        const X = k.map((Ie) => ({
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
        })), K = X.length, pe = (Ie) => {
          const qe = X[(Ie - 1 + K) % K], Ne = X[Ie % K];
          return za(qe.a, qe.b, Ne.a, Ne.b, true, true) ?? Ne.a;
        }, ge = [], Ce = h ? K : K + 1;
        for (let Ie = 0; Ie < Ce; Ie++) !h && Ie === 0 ? ge.push(X[0].a) : !h && Ie === K ? ge.push(X[K - 1].b) : ge.push(pe(Ie));
        Pt();
        const Te = o.length;
        t.points.val = [
          ...o,
          ...ge
        ];
        const _e = ge.map((Ie, qe) => Te + qe);
        h && _e.push(Te);
        let Be = a.slice();
        Be.length && Be[Be.length - 1].length === 0 && (Be = Be.slice(0, -1)), t.polylines.val = [
          ...Be,
          _e,
          []
        ], Yt = null, be(`\u2713 Desfase a ${he.toFixed(2)} m \u2014 ${K} tramo${K === 1 ? "" : "s"} nuevo${K === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
        try {
          (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
        } catch {
        }
        M(), jt();
        return;
      }
      let l = mn, f = Math.max(0, Tn);
      if (l < 0 || l === Yt.poly && f === Yt.seg) {
        let p = (window.__hekatanSnap2D ?? 0.5) * 1.5;
        if (l = -1, a.forEach((h, y) => {
          for (let k = 0; k < h.length - 1; k++) {
            if (y === Yt.poly && k === Yt.seg) continue;
            const $ = o[h[k]], I = o[h[k + 1]];
            if (!$ || !I) continue;
            const L = yo(n[0], n[1], n[2], $[0], $[1], $[2], I[0], I[1], I[2]);
            L < p && (p = L, l = y, f = k);
          }
        }), l < 0) {
          be(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
          return;
        }
      }
      const i = a[Yt.poly], r = o[i[Yt.seg]], u = o[i[Yt.seg + 1]], d = a[l], _ = d[f], x = d[f + 1];
      if (!r || !u || _ == null || x == null) {
        be(`${s}: no se pudo leer el tramo.`);
        return;
      }
      const w = o[_], b = o[x];
      if (e === "trim") {
        const E = za(w, b, r, u, false, false);
        if (!E) {
          be("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
          return;
        }
        Pt();
        const p = o.length;
        t.points.val = [
          ...o,
          E
        ];
        const h = [
          ...d.slice(0, f + 1),
          p,
          ...d.slice(f + 1)
        ];
        t.polylines.val = a.map((k, $) => $ === l ? h : k);
        const y = Xn(n, w) < Xn(n, b);
        Ja(l, y ? f : f + 1), be(`\u2713 Recortado en (${E[0].toFixed(2)}, ${E[1].toFixed(2)}, ${E[2].toFixed(2)}). Designe otro trozo o Esc.`);
      } else {
        const E = za(w, b, r, u, true, false);
        if (!E) {
          be("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
          return;
        }
        const h = Xn(n, w) < Xn(n, b) ? f : f + 1;
        if (h !== 0 && h !== d.length - 1) {
          be("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
          return;
        }
        const y = d[h];
        if (Xn(E, w) + Xn(E, b) < Xn(w, b) + 1e-6) {
          be("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
          return;
        }
        if (Pt(), Ei(y) > 1) {
          const $ = o.length;
          t.points.val = [
            ...o,
            E
          ];
          const I = d.slice();
          I[h] = $, t.polylines.val = a.map((L, U) => U === l ? I : L);
        } else t.points.val = o.map(($, I) => I === y ? E : $);
        be(`\u2713 Alargada hasta (${E[0].toFixed(2)}, ${E[1].toFixed(2)}, ${E[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
      }
      try {
        (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
      } catch {
      }
      M(), jt();
    };
    window.__hekatanSelectionSize = () => Je.size, window.__hekatanSelectLast = () => {
      var _a3;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
      let n = e.length - 1;
      for (; n >= 0 && (!e[n] || e[n].length < 2); ) n--;
      return Je.clear(), n >= 0 && Je.add(`poly:${n}`), dn(), be(n >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Je.size;
    }, window.__hekatanSelectAll = () => {
      var _a3, _b;
      const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
      Je.clear();
      const a = /* @__PURE__ */ new Set();
      return e.forEach((o, s) => {
        !o || o.length < 2 || (Je.add(`poly:${s}`), o.forEach((l) => a.add(l)));
      }), n.forEach((o, s) => {
        a.has(s) || Je.add(`pt:${s}`);
      }), dn(), be(`SELECCI\xD3N ${Je.size} objetos (todo el modelo) \xB7 Esc suelta`), Je.size;
    }, window.__hekatanReplicateSelection = (e, n, a, o, s = 0) => {
      var _a3, _b, _c, _d;
      o = Math.max(1, Math.round(o || 1)), s = Math.max(0, Math.round(s || 0));
      const l = [
        ...Je
      ], f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), u = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), _ = [];
      if (l.forEach((p) => {
        if (p.startsWith("pt:")) {
          const h = +p.slice(3);
          f[h] && u.add(h);
        } else if (p.startsWith("poly:")) {
          const h = +p.slice(5);
          if (!i[h] || i[h].length < 2) return;
          d.add(h), i[h].forEach((y) => u.add(y));
        } else if (p.startsWith("seg:")) {
          const h = p.split(":"), y = +h[1], k = +h[2], $ = i[y] || [], I = $[k], L = $[k + 1];
          I != null && L != null && (_.push([
            I,
            L
          ]), u.add(I), u.add(L));
        }
      }), !u.size) return 0;
      Pt();
      const x = [
        ...f
      ];
      let w = i.slice();
      w.length && w[w.length - 1].length === 0 && (w = w.slice(0, -1));
      const b = [
        ...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []
      ], E = [
        ...u
      ];
      for (let p = 1; p <= o; p++) {
        const h = s + p, y = e * h, k = n * h, $ = a * h, I = /* @__PURE__ */ new Map();
        E.forEach((L) => {
          I.set(L, x.length), x.push([
            f[L][0] + y,
            f[L][1] + k,
            f[L][2] + $
          ]);
        }), d.forEach((L) => {
          const U = i[L].map((X) => I.has(X) ? I.get(X) : X), he = w.length;
          w.push(U), r.has(L) && b.push(he);
        }), _.forEach(([L, U]) => {
          w.push([
            I.get(L),
            I.get(U)
          ]);
        });
      }
      w.push([]), t.points.val = x, t.polylines && (t.polylines.val = w), t.areas && (t.areas.val = b);
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return M(), o;
    }, window.__hekatanExtrudeSelection = (e, n, a, o) => {
      var _a3, _b, _c, _d;
      o = Math.max(1, Math.round(o || 1));
      const s = [
        ...Je
      ], l = t.points.rawVal, f = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), r = /* @__PURE__ */ new Set(), u = [], d = /* @__PURE__ */ new Set();
      for (const y of f) for (const k of y) d.add(k);
      if (s.forEach((y) => {
        if (y.startsWith("poly:")) {
          const k = +y.slice(5);
          if (i.has(k)) return;
          const $ = f[k] || [];
          for (let I = 0; I + 1 < $.length; I++) u.push([
            $[I],
            $[I + 1]
          ]), d.add($[I]), d.add($[I + 1]);
        } else if (y.startsWith("seg:")) {
          const k = y.split(":"), $ = +k[1], I = +k[2], L = f[$] || [], U = L[I], he = L[I + 1];
          U != null && he != null && (u.push([
            U,
            he
          ]), d.add(U), d.add(he));
        }
      }), s.forEach((y) => {
        if (y.startsWith("pt:")) {
          const k = +y.slice(3);
          l[k] && !d.has(k) && r.add(k);
        }
      }), !r.size && !u.length) return {
        lineas: 0,
        areas: 0
      };
      Pt();
      const _ = [
        ...l
      ];
      let x = f.slice();
      x.length && x[x.length - 1].length === 0 && (x = x.slice(0, -1));
      const w = [
        ...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []
      ], b = /* @__PURE__ */ new Map(), E = (y, k) => {
        if (k === 0) return y;
        const $ = y + ":" + k;
        let I = b.get($);
        if (I == null) {
          const L = [
            l[y][0] + e * k,
            l[y][1] + n * k,
            l[y][2] + a * k
          ];
          I = _.findIndex((U) => Math.abs(U[0] - L[0]) < 1e-3 && Math.abs(U[1] - L[1]) < 1e-3 && Math.abs(U[2] - L[2]) < 1e-3), I < 0 && (I = _.length, _.push(L)), b.set($, I);
        }
        return I;
      };
      let p = 0, h = 0;
      r.forEach((y) => {
        const k = [
          y
        ];
        for (let $ = 1; $ <= o; $++) k.push(E(y, $));
        x.push(k), p += o;
      }), u.forEach(([y, k]) => {
        for (let $ = 1; $ <= o; $++) {
          const I = [
            E(y, $ - 1),
            E(k, $ - 1),
            E(k, $),
            E(y, $)
          ];
          w.push(x.length), x.push([
            ...I,
            I[0]
          ]), h++;
        }
      }), x.push([]), t.points.val = _, t.polylines && (t.polylines.val = x), t.areas && (t.areas.val = w);
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return M(), {
        lineas: p,
        areas: h
      };
    }, window.__hekatanVoladoSelection = (e, n = {}) => {
      var _a3, _b, _c;
      const a = Number(e);
      if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
      const o = n.losa !== false, s = n.vigaBorde !== false, l = n.lados === "afuera" ? "afuera" : "ambos", f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = [];
      if ([
        ...Je
      ].forEach((E) => {
        if (E.startsWith("seg:")) {
          const p = E.split(":"), h = +p[1], y = +p[2], k = i[h] || [], $ = k[y], I = k[y + 1];
          $ != null && I != null && r.push([
            $,
            I
          ]);
        } else if (E.startsWith("poly:")) {
          const p = i[+E.slice(5)] || [];
          for (let h = 0; h + 1 < p.length; h++) r.push([
            p[h],
            p[h + 1]
          ]);
        }
      }), !r.length) return 0;
      let u = 0, d = 0;
      for (const E of f) u += E[0], d += E[1];
      u /= Math.max(1, f.length), d /= Math.max(1, f.length), Pt();
      const _ = [
        ...f
      ];
      let x = i.slice();
      x.length && x[x.length - 1].length === 0 && (x = x.slice(0, -1));
      const w = [
        ...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []
      ];
      let b = 0;
      for (const [E, p] of r) {
        const h = f[E], y = f[p];
        if (!h || !y) continue;
        const k = y[0] - h[0], $ = y[1] - h[1], I = Math.hypot(k, $);
        if (I < 1e-6) continue;
        let L = -$ / I, U = k / I;
        const he = (h[0] + y[0]) / 2, X = (h[1] + y[1]) / 2;
        (he - u) * L + (X - d) * U < 0 && (L = -L, U = -U);
        const K = l === "ambos" ? [
          1,
          -1
        ] : [
          1
        ];
        for (const pe of K) {
          const ge = L * a * pe, Ce = U * a * pe, Te = _.length;
          _.push([
            h[0] + ge,
            h[1] + Ce,
            h[2]
          ]);
          const _e = _.length;
          _.push([
            y[0] + ge,
            y[1] + Ce,
            y[2]
          ]), x.push([
            E,
            Te
          ]), x.push([
            p,
            _e
          ]), s && x.push([
            Te,
            _e
          ]), o && (w.push(x.length), x.push([
            E,
            p,
            _e,
            Te,
            E
          ])), b++;
        }
      }
      if (!b) return 0;
      x.push([]), t.points.val = _, t.polylines && (t.polylines.val = x), t.areas && (t.areas.val = w);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      return M(), b;
    }, S.addEventListener("click", (e) => {
      var _a3, _b, _c, _d, _e, _f;
      if (window.__hekatanCursorPx = {
        x: e.clientX,
        y: e.clientY
      }, ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "reshape") return;
      if (Wn > 5) {
        Wn = 0;
        return;
      }
      Wn = 0;
      const n = B(e);
      if (!n) return;
      P.setFromCamera(F, n);
      const a = !!(Dt && Math.abs(e.clientX - Dt.x) <= 3 && Math.abs(e.clientY - Dt.y) <= 3), o = a ? [
        {
          point: Dt.p.clone(),
          distance: n.position.distanceTo(Dt.p)
        }
      ] : Ae();
      if (!o.length) return;
      if (!a) {
        const l = n.position.distanceTo(v.target) || 1, f = o[0].distance ?? n.position.distanceTo(o[0].point), i = o[0].point;
        if (!isFinite(i.x) || !isFinite(i.y) || !isFinite(i.z) || f > Math.max(l * 12, 300)) {
          be("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
          return;
        }
      }
      let s = o[0].point;
      (e.ctrlKey || e.metaKey) && (s = new R(Math.round(o[0].point.x), Math.round(o[0].point.y), Math.round(o[0].point.z)));
      {
        const l = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], f = l[l.length - 1] ?? [], i = t.points.rawVal ?? [];
        if (f.length > 0) {
          const r = i[f[f.length - 1]];
          if (r) {
            const u = !!window.__hekatanOrthoMode;
            let d = zt;
            if (!d && u) {
              const _ = Math.abs(s.x - r[0]), x = Math.abs(s.y - r[1]), w = Math.abs(s.z - r[2]);
              d = _ >= x && _ >= w ? "x" : x >= w ? "y" : "z";
            }
            d === "x" ? s = new R(s.x, r[1], r[2]) : d === "y" ? s = new R(r[0], s.y, r[2]) : d === "z" && (s = new R(r[0], r[1], s.z));
          }
        }
      }
      if (Dt && Math.abs(e.clientX - Dt.x) <= 3 && Math.abs(e.clientY - Dt.y) <= 3) s = Dt.p.clone();
      else if (ao) s = ao.clone(), be(`\u{1F4D0} Eje \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
      else {
        const l = ha(s), f = (_e = window.__hekatanOsnapCompute) == null ? void 0 : _e.call(window, s.x, s.y, s.z, l, {
          x: e.clientX,
          y: e.clientY
        });
        if (f) s = new R(f.x, f.y, f.z), be(`\u{1F3AF} Snap [${f.type.toUpperCase()}] \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
        else {
          const i = window.__hekatanSnapEnabled !== false, r = ((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) || (window.__hekatanSnap2D ?? 0);
          i && r > 0 && (s = new R(Math.round(s.x / r) * r, Math.round(s.y / r) * r, Math.round(s.z / r) * r));
        }
      }
      Aa(s, e);
    });
    const Li = (e) => {
      var _a3;
      const n = (_a3 = t.gridTarget) == null ? void 0 : _a3.rawVal;
      if (!n) return true;
      const a = new R(0, 0, 1).applyEuler(new In(...n.rotation)).normalize(), o = P.ray.direction;
      return o.lengthSq() < 1e-12 ? true : Math.abs(o.clone().normalize().dot(a)) >= 0.026;
    }, Aa = (e, n) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r2, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
      const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
      if (n && !(a === "select" || a === "none" || !a || a === "medir" || a === "move" || a === "copy" || a === "delete" || a === "trim" || a === "extend") && !ao && !Li() && be(`\u26A0 Est\xE1s mirando el plano de trabajo casi de canto, y ah\xED un p\xEDxel vale decenas de metros: el punto ha ca\xEDdo en (${e.x.toFixed(1)}, ${e.y.toFixed(1)}, ${e.z.toFixed(1)}) m. Si no era eso, deshaz (Ctrl+Z) y ponte en una vista ortogonal (Planta / Frente XZ / Lado YZ), engancha a un nudo con OSNAP, o teclea la coordenada.`), a === "select" || a === "none" || !a) {
        if (kn) {
          Ot && qo();
          const { kind: i, a: r, b: u } = kn, d = u !== void 0 ? `${i}:${r}:${u}` : `${i}:${r}`;
          !!n && (n.ctrlKey || n.metaKey || n.shiftKey) || Je.clear(), Je.has(d) ? Je.delete(d) : Je.add(d), dn(), be(`\u2713 Seleccionados ${Je.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
        } else {
          const i = !!n && (n.ctrlKey || n.metaKey || n.shiftKey), r = (n == null ? void 0 : n.clientX) ?? 0, u = (n == null ? void 0 : n.clientY) ?? 0;
          Ot ? (ls(Ot.x, Ot.y, r, u, i), Ot = null) : i || (Ot = {
            x: r,
            y: u
          }, be("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), xa(r, u, r + 1, u + 1, false));
        }
        return;
      }
      if (a === "axis") {
        const i = window.__hekatanAxisDraw;
        if (!i) return;
        if (!i.pendingStart) {
          i.pendingStart = [
            e.x,
            e.y,
            e.z
          ], be(`\u{1F4CD} Eje \u2014 click 1 OK en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)}). Click 2=fin.`);
          return;
        }
        const r = i.mode === "number", u = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, i.pendingStart, [
          e.x,
          e.y,
          e.z
        ], r);
        be(`\u2713 Eje "${u}" creado. Click 1=nuevo eje, o cambia tool.`);
        return;
      }
      if (a === "move" || a === "copy") {
        gs(a, [
          e.x,
          e.y,
          e.z
        ]);
        return;
      }
      if (a === "delete") {
        if (Bn >= 0) {
          const i = window.__hekatanDrawingAuxLines, r = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], u = Bn;
          if (u >= 0 && u < r.length) {
            Pt();
            const d = r.slice(0, u).concat(r.slice(u + 1));
            i && typeof i == "object" && "val" in i ? i.val = d : window.__hekatanDrawingAuxLines = d, be(`\u{1F5D1} L\xEDnea auxiliar #${u + 1} borrada`), Bn = -1, Gt.visible = false;
            try {
              (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
            } catch {
            }
          }
        } else if (mn >= 0) {
          const i = mn, r = Tn;
          ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (To(i), be(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : r >= 0 ? (Ja(i, r), be(`\u{1F5D1} Segmento ${r + 1} de polil\xEDnea #${i + 1} borrado`)) : (To(i), be(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
        } else be("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
        return;
      }
      if (a === "circle") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          be("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
          return;
        }
        const [i, r] = Qe, u = Math.hypot(r[0] - i[0], r[1] - i[1], r[2] - i[2]), d = Math.abs(r[0] - i[0]), _ = Math.abs(r[1] - i[1]), x = Math.abs(r[2] - i[2]), w = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), E = (w === "xy" ? x < 1e-3 : w === "xz" ? _ < 1e-3 : w === "yz" ? d < 1e-3 : false) ? w : x < 1e-3 ? "xy" : _ < 1e-3 ? "xz" : "yz", p = window.__hekatanArcSegs ?? 12;
        (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], u, p, E), be(`\u2713 C\xEDrculo dibujado en ${E.toUpperCase()} \u2014 r=${u.toFixed(2)}m, ${p} segmentos`), Qe = [];
        try {
          (_l = window.__hekatanRebuild) == null ? void 0 : _l.call(window);
        } catch {
        }
        return;
      }
      if (a === "ifcface") {
        if (!N) {
          be("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
          return;
        }
        if (!N.plana) {
          be("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
          return;
        }
        const i = G(N.m), r = oe(i, N.tris);
        if (r.length < 3) {
          be("\u25A6 No se pudo cerrar el contorno de la cara.");
          return;
        }
        const u = N.normal.clone(), d = D(N.m, N.punto, u);
        let _ = String(window.__hekatanIfcCaraPos ?? "auto"), x = false;
        try {
          const $ = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
          x = Math.round(($ == null ? void 0 : $.matShell) ?? 0) === 1;
        } catch {
        }
        _ === "auto" && (_ = Math.abs(u.z) > 0.5 ? x ? "interior" : "exterior" : "media");
        const w = d ?? 0.2, b = _ === "exterior" ? 0 : _ === "interior" ? w : w / 2, E = r.map(($) => $.clone().addScaledVector(u, -b));
        Pt(), Ge = E.map(($) => [
          $.x,
          $.y,
          $.z
        ]);
        const p = Yo();
        try {
          const $ = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
          $ && d && ($.tShell = Math.round(d * 100) / 100);
        } catch {
        }
        const h = [
          "Shell-Thick (Mindlin)",
          "Shell-Thin (Kirchhoff)",
          "Membrana"
        ];
        let y = "la de \xABSecci\xF3n shells\xBB";
        try {
          const $ = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
          $ && $.formaPlaca != null && (y = h[Math.round($.formaPlaca)] ?? y);
        } catch {
        }
        const k = _ === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : _ === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + w.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (w / 2).toFixed(2) + " m hacia dentro)";
        be(`\u25A6 \xC1rea desde la cara del IFC: ${r.length} v\xE9rtices, ${p} shell(s). Espesor medido ${d ? d.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${k}; formulaci\xF3n ${y}, t = ${w.toFixed(2)} m.`), q(null, -1, null);
        try {
          (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
        } catch {
        }
        M();
        return;
      }
      if (a === "ifcline") {
        if (!xe || xe.length < 2) {
          be("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
          return;
        }
        const i = Y(xe);
        Pt();
        const r = t.points.rawVal, u = [], d = [];
        for (const x of i) {
          let w = r.findIndex((b) => Math.abs(b[0] - x[0]) < 1e-3 && Math.abs(b[1] - x[1]) < 1e-3 && Math.abs(b[2] - x[2]) < 1e-3);
          w < 0 && (w = r.length + d.length, d.push(x)), u.push(w);
        }
        if (t.points.val = [
          ...r,
          ...d
        ], t.polylines) {
          const x = t.polylines.rawVal, w = x.length && x[x.length - 1].length === 0 ? x.slice(0, -1) : x;
          t.polylines.val = [
            ...w,
            u,
            []
          ];
        }
        const _ = xe.reduce((x, w, b) => b ? x + w.distanceTo(xe[b - 1]) : 0, 0);
        be(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${_.toFixed(2)} m de desarrollo.`), ne(null);
        try {
          (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
        } catch {
        }
        M();
        return;
      }
      if (a === "arc") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          be("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
          return;
        }
        if (Qe.length === 2) {
          be("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
          return;
        }
        const [i, r, u] = Qe, d = window.__hekatanArcSegs ?? 12;
        (_r2 = window.__hekatanDrawArc) == null ? void 0 : _r2.call(window, i, r, u, d), be(`\u2713 Arco dibujado \u2014 ${d} segmentos`), Qe = [];
        try {
          (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
        } catch {
        }
        return;
      }
      if (a === "parabola" || a === "cubica") {
        const i = a === "parabola" ? 3 : 4, r = a === "parabola" ? "Par\xE1bola" : "C\xFAbica";
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length < i) {
          be(`\u223F ${r} \u2014 punto ${Qe.length}/${i} OK. Marc\xE1 el ${Qe.length + 1}\xBA.`);
          return;
        }
        const u = window.__hekatanArcSegs ?? 12, d = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Qe.slice(), u);
        if (!(d == null ? void 0 : d.ok)) {
          be(`\u26A0 ${r}: ${(d == null ? void 0 : d.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Qe = [];
          return;
        }
        const _ = "xyz"[d.ia ?? 0], x = "xyz"[d.io ?? 2], w = (d.coef ?? []).map((b, E) => `${b >= 0 && E ? "+" : ""}${b.toFixed(3)}${E ? "\xB7" + _ + (E > 1 ? "^" + E : "") : ""}`).join(" ");
        be(`\u2713 ${r} dibujada en ${String(d.plano ?? "").toUpperCase()} \u2014 ${u} tramos a \u0394 igual de ${_} \xB7 ${x} = ${w}`), Qe = [];
        try {
          (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
        } catch {
        }
        return;
      }
      if (a === "revolve") {
        const i = Math.round(window.__hekatanRevSectores ?? 16), r = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, e.x, e.y, i, 360);
        if (r == null ? void 0 : r.msg) {
          be(`\u26A0 Revoluci\xF3n: ${r.msg}.`);
          return;
        }
        be(`\u2713 Revoluci\xF3n: ${r.anillos} anillo(s) \xD7 ${i} sectores \u2192 ${r.areas} pa\xF1o(s) Q4${r.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${r.guias ? ` ${r.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
        try {
          (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
      if (a === "loft") {
        const i = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, e.x, e.y);
        if (i == null ? void 0 : i.msg) {
          be(`\u26A0 Barrido: ${i.msg}.`);
          return;
        }
        be(`\u2713 Barrido: contorno de ${i.contorno} lados \xD7 perfil de ${i.perfil} puntos \u2192 ${i.areas} pa\xF1o(s) Q4. Eje por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${i.guias ? ` ${i.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
        try {
          (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
        } catch {
        }
        return;
      }
      if (a === "rect") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          be("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [i, r] = Qe;
        (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, r), be(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${r[0].toFixed(1)},${r[1].toFixed(1)})`), Qe = [];
        try {
          (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
        } catch {
        }
        return;
      }
      if (a === "medir") {
        const r = (Dt && Math.abs(Dt.x - n.clientX) < 3 && Math.abs(Dt.y - n.clientY) < 3 ? [
          Dt.p.x,
          Dt.p.y,
          Dt.p.z
        ] : null) ?? rt(n);
        if (!r) return;
        if (lt.length >= 2 && (lt = []), lt.push(r), lt.length === 1) nt.visible = false, St(), be("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
        else {
          const [u, d] = lt;
          nt.geometry.setFromPoints([
            new R(u[0], u[1], u[2]),
            new R(d[0], d[1], d[2])
          ]), nt.visible = true;
          const _ = Math.hypot(d[0] - u[0], d[1] - u[1], d[2] - u[2]), x = Math.hypot(d[0] - u[0], d[1] - u[1]);
          at.textContent = `${_.toFixed(3)} m`, St(), be(`\u{1F4CF} Distancia ${_.toFixed(3)} m  \xB7  \u0394x ${(d[0] - u[0]).toFixed(3)}  \u0394y ${(d[1] - u[1]).toFixed(3)}  \u0394z ${(d[2] - u[2]).toFixed(3)}  \xB7  en planta ${x.toFixed(3)} m`);
        }
        M();
        return;
      }
      if (a === "fillarea") {
        const i = t.points.rawVal, r = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], u = /* @__PURE__ */ new Map(), d = (X, K) => {
          X !== K && ((u.get(X) ?? u.set(X, /* @__PURE__ */ new Set()).get(X)).add(K), (u.get(K) ?? u.set(K, /* @__PURE__ */ new Set()).get(K)).add(X));
        };
        for (const X of r) for (let K = 0; K + 1 < X.length; K++) d(X[K], X[K + 1]);
        const _ = (X, K) => {
          var _a4;
          return !!((_a4 = u.get(X)) == null ? void 0 : _a4.has(K));
        }, x = /* @__PURE__ */ new Set(), w = [], b = [
          ...u.keys()
        ];
        for (const X of b) for (const K of u.get(X)) if (!(K < X)) {
          for (const pe of u.get(K)) if (pe !== X) for (const ge of u.get(pe)) {
            if (ge === X || ge === K || !_(ge, X) || _(X, pe) || _(K, ge)) continue;
            const Ce = [
              X,
              K,
              pe,
              ge
            ].slice().sort((Te, _e2) => Te - _e2).join("-");
            x.has(Ce) || (x.add(Ce), w.push([
              X,
              K,
              pe,
              ge
            ]));
          }
        }
        for (const X of b) for (const K of u.get(X)) if (!(K < X)) for (const pe of u.get(K)) {
          if (pe === X || !_(pe, X)) continue;
          const ge = [
            X,
            K,
            pe
          ].slice().sort((Ce, Te) => Ce - Te).join("-");
          x.has(ge) || (x.add(ge), w.push([
            X,
            K,
            pe
          ]));
        }
        const E = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", p = (X) => E === "xy" ? [
          X[0],
          X[1]
        ] : E === "xz" ? [
          X[0],
          X[2]
        ] : [
          X[1],
          X[2]
        ], h = p([
          e.x,
          e.y,
          e.z
        ]), y = (X, K) => {
          let pe = false;
          for (let ge = 0, Ce = K.length - 1; ge < K.length; Ce = ge++) {
            const Te = K[ge][0], _e2 = K[ge][1], Be = K[Ce][0], Ie = K[Ce][1];
            _e2 > X[1] != Ie > X[1] && X[0] < (Be - Te) * (X[1] - _e2) / (Ie - _e2) + Te && (pe = !pe);
          }
          return pe;
        }, k = (X) => {
          let K = 0;
          for (let pe = 0, ge = X.length - 1; pe < X.length; ge = pe++) K += (X[ge][0] + X[pe][0]) * (X[ge][1] - X[pe][1]);
          return Math.abs(K) / 2;
        };
        let $ = null, I = 1 / 0;
        for (const X of w) {
          const K = X.map((ge) => p(i[ge]));
          if (!y(h, K)) continue;
          const pe = k(K);
          pe < I && (I = pe, $ = X);
        }
        if (!$) {
          be("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
          return;
        }
        const L = $.slice().sort((X, K) => X - K).join("-"), U = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
        if (U.some((X) => {
          const K = r[X] ?? [];
          return [
            ...new Set(K)
          ].sort((pe, ge) => pe - ge).join("-") === L;
        })) {
          be("\u25A6 Esa celda ya tiene \xE1rea.");
          return;
        }
        t.polylines.val = [
          ...r,
          [
            ...$,
            $[0]
          ]
        ], t.areas.val = [
          ...U,
          r.length
        ], be(`\u2713 \xC1rea creada por relleno (${$.length} lados).`);
        try {
          (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
        } catch {
        }
        return;
      }
      if (a === "rectarea") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          be("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [i, r] = Qe;
        (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, r), be(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${r[0].toFixed(1)},${r[1].toFixed(1)})`), Qe = [];
        return;
      }
      if (a === "polyarea") {
        Ge.push([
          e.x,
          e.y,
          e.z
        ]), Ee.geometry.setFromPoints(Ge.map((i) => new R(i[0], i[1], i[2]))), Ee.visible = Ge.length >= 1, be(`\u25B0 \xC1rea libre \u2014 ${Ge.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), M();
        return;
      }
      if (a === "plane3") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length < 3) {
          be(`\u25E3 Plano inclinado \u2014 punto ${Qe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
          return;
        }
        const [i, r, u] = Qe, d = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, r, u);
        be(d ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Qe = [];
        return;
      }
      if (a === "col") {
        Pt();
        const i = e.z, r = At && At > 0 ? At : 3;
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
            i + r
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
        ], At = 0, be(`\u258C Columna creada \u2014 h=${r.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
        try {
          (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
        } catch {
        }
        return;
      }
      if (a === "wall") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          be("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
          return;
        }
        const [i, r] = Qe, u = At && At > 0 ? At : 3;
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
            r[0],
            r[1],
            r[2]
          ],
          [
            r[0],
            r[1],
            r[2] + u
          ],
          [
            i[0],
            i[1],
            i[2] + u
          ]
        ];
        const _ = t.polylines.rawVal;
        if (_.length - 1, t.polylines.val = [
          ..._.slice(0, -1),
          ..._[_.length - 1].length > 0 ? [
            _[_.length - 1]
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
          const x = t.polylines.rawVal.length - 2;
          t.areas.val = [
            ...t.areas.rawVal,
            x
          ];
        }
        be(`\u25A5 Pared Q4 creada \u2014 h=${u.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Qe = [], At = 0;
        try {
          (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
        } catch {
        }
        return;
      }
      if (a === "extp") {
        Pt();
        const i = At && At > 0 ? At : 3, r = e.z;
        t.points.val = [
          ...t.points.rawVal,
          [
            e.x,
            e.y,
            r
          ],
          [
            e.x,
            e.y,
            r + i
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
        ], At = 0, be(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
        try {
          (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
        } catch {
        }
        return;
      }
      if (a === "extl") {
        const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, r = Ro(e.x, e.y, e.z, i);
        if (!r) {
          be("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
          return;
        }
        const u = t.polylines.rawVal, d = t.points.rawVal, _ = u[r.polyIdx], x = d[_[r.segIdx]], w = d[_[r.segIdx + 1]];
        if (!x || !w) {
          be("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
          return;
        }
        const b = At && At > 0 ? At : 3;
        Pt();
        const E = t.points.rawVal.length;
        t.points.val = [
          ...t.points.rawVal,
          [
            x[0],
            x[1],
            x[2]
          ],
          [
            w[0],
            w[1],
            w[2]
          ],
          [
            w[0],
            w[1],
            w[2] + b
          ],
          [
            x[0],
            x[1],
            x[2] + b
          ]
        ];
        const p = t.polylines.rawVal;
        if (t.polylines.val = [
          ...p.slice(0, -1),
          ...p[p.length - 1].length > 0 ? [
            p[p.length - 1]
          ] : [],
          [
            E,
            E + 1,
            E + 2,
            E + 3,
            E
          ],
          []
        ], t.areas) {
          const h = t.polylines.rawVal.length - 2;
          t.areas.val = [
            ...t.areas.rawVal,
            h
          ];
        }
        At = 0, be(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${b.toFixed(2)}m`);
        try {
          (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
        } catch {
        }
        return;
      }
      if (a === "auxp") {
        const i = window.__hekatanDrawingAuxPoints;
        if (i) {
          const r = i.rawVal ?? i.val ?? [];
          i.val = [
            ...r,
            [
              e.x,
              e.y,
              e.z
            ]
          ];
        }
        be(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
        return;
      }
      if (a === "aux") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          be("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
          return;
        }
        const [i, r] = Qe, u = window.__hekatanDrawingAuxLines;
        if (u) {
          Pt();
          const b = u.rawVal ?? u.val ?? [];
          u.val = [
            ...b,
            [
              i[0],
              i[1],
              i[2],
              r[0],
              r[1],
              r[2]
            ]
          ];
        }
        const d = r[0] - i[0], _ = r[1] - i[1], x = r[2] - i[2], w = Math.sqrt(d * d + _ * _ + x * x);
        be(`\u2713 L\xEDnea auxiliar creada \u2014 L=${w.toFixed(2)}m (cyan, no FEM)`), Qe = [];
        return;
      }
      if (a === "extend" || a === "trim" || a === "offset") {
        $i(a, [
          e.x,
          e.y,
          e.z
        ]);
        return;
      }
      if (a === "chaflan") {
        if (Qe.push([
          e.x,
          e.y,
          e.z
        ]), Qe.length === 1) {
          be("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [i, r] = Qe, u = window.__hekatanChaflanR ?? 1, d = Math.max(3, window.__hekatanArcSegs ?? 6);
        (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, r, u, d, 6);
        const _ = Math.abs(r[0] - i[0]).toFixed(1), x = Math.abs(r[1] - i[1]).toFixed(1);
        be(`\u2713 Losa con chaflanes dibujada \u2014 ${_}\xD7${x}m, r=${u}m, ${d} seg/chafl\xE1n`), Qe = [];
        try {
          (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
        } catch {
        }
        return;
      }
      Ye = false, Pt();
      const s = e.toArray(), l = t.points.rawVal;
      let f = l.findIndex((i) => Math.abs(i[0] - s[0]) < 1e-3 && Math.abs(i[1] - s[1]) < 1e-3 && Math.abs(i[2] - s[2]) < 1e-3);
      if (f < 0 && (t.points.val = [
        ...l,
        s
      ], f = t.points.rawVal.length - 1), t.polylines && a !== "node") {
        const i = t.polylines.rawVal, r = i.length ? i[i.length - 1] : [];
        r.length && r[r.length - 1] === f ? t.polylines.val = [
          ...i,
          [
            f
          ]
        ] : t.polylines.val = [
          ...i.slice(0, -1),
          [
            ...r,
            f
          ]
        ];
      }
      if (t.polylines) {
        const i = t.polylines.rawVal, r = i.length - 1, u = i[r] ?? [];
        if (a === "line" && u.length >= 2) {
          be(`\uFF0F L\xEDnea \u2014 ${u.length - 1} tramo${u.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
          try {
            (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
          } catch {
          }
          return;
        }
        if (a === "area" && u.length === 4) {
          t.polylines.val = [
            ...i.slice(0, -1),
            [
              ...u,
              u[0]
            ],
            []
          ], t.areas && (t.areas.val = [
            ...t.areas.rawVal,
            r
          ]), be("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
          try {
            (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
          } catch {
          }
          return;
        }
      }
      if (a === "node") be(`\u25CF Nodo creado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      else if (a === "line") be("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
      else if (a === "polyline") be("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
      else if (a === "area") {
        const i = ((_R = t.polylines) == null ? void 0 : _R.rawVal[t.polylines.rawVal.length - 1]) ?? [];
        be(`\u25A6 \xC1rea \u2014 click ${i.length}/4. Marc\xE1 ${4 - i.length} v\xE9rtice${4 - i.length === 1 ? "" : "s"} m\xE1s.`);
      }
    };
    S.addEventListener("click", () => jt()), S.addEventListener("contextmenu", (e) => {
      var _a3, _b, _c;
      if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && Ge.length >= 3) {
        e.preventDefault();
        const a = Yo();
        be(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
        return;
      }
      !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [
        ...t.polylines.rawVal,
        []
      ]);
    }), S.addEventListener("pointermove", (e) => {
      var _a3, _b, _c;
      const n = B(e);
      if (!n) return;
      P.setFromCamera(F, n);
      const a = Ae();
      if (je.geometry.deleteAttribute("position"), a.length) {
        let o = a[0].point.clone();
        (e.ctrlKey || e.metaKey) && o.set(Math.round(o.x), Math.round(o.y), Math.round(o.z));
        {
          const f = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = f[f.length - 1] ?? [], r = t.points.rawVal ?? [];
          if (i.length > 0) {
            const u = r[i[i.length - 1]];
            if (u) {
              const d = !!window.__hekatanOrthoMode;
              let _ = zt;
              if (!_ && d) {
                const x = Math.abs(o.x - u[0]), w = Math.abs(o.y - u[1]), b = Math.abs(o.z - u[2]);
                _ = x >= w && x >= b ? "x" : w >= b ? "y" : "z";
              }
              _ === "x" ? o.set(o.x, u[1], u[2]) : _ === "y" ? o.set(u[0], o.y, u[2]) : _ === "z" && o.set(u[0], u[1], o.z);
            }
          }
        }
        const s = ha(o), l = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, o.x, o.y, o.z, s, {
          x: e.clientX,
          y: e.clientY
        });
        if (l) o.set(l.x, l.y, l.z);
        else {
          const f = window.__hekatanSnapEnabled !== false, i = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
          f && i > 0 && (o.x = Math.round(o.x / i) * i, o.y = Math.round(o.y / i) * i, o.z = Math.round(o.z / i) * i);
        }
        je.geometry.setAttribute("position", new Rt(o.toArray(), 3));
      }
      M();
    }), S.addEventListener("pointermove", (e) => {
      var _a3;
      const n = B(e);
      if (!n) return;
      P.setFromCamera(F, n);
      let a = false;
      const o = P.intersectObject(Le), s = Ae();
      if (o.length && s.length) {
        const l = new R(...t.points.rawVal[o[0].index]), f = new R(...s[0].point), i = l.sub(f), r = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
        r.transformDirection(ae.matrixWorld), Math.abs(i.dot(r)) < 1e-4 && (a = true);
      }
      je.visible = !a;
    });
    let Ca = false, Ea;
    S.addEventListener("pointermove", (e) => {
      var _a3;
      if (!Wn) return;
      const n = B(e);
      if (!n) return;
      P.setFromCamera(F, n);
      let a = false;
      const o = P.intersectObject(Le), s = Ae();
      if (o.length && s.length) {
        const f = new R(...t.points.rawVal[o[0].index]), i = new R(...s[0].point), r = f.sub(i), u = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
        u.transformDirection(ae.matrixWorld), Math.abs(r.dot(u)) < 1e-4 && (a = true);
      }
      if (a && Wn < 5 && (Ca = true, v.enabled = false, Ea = o[0].index), !Ca || Wn % 2 !== 0) return;
      const l = [
        ...t.points.rawVal
      ];
      if (Ea !== void 0) {
        let f = s[0].point;
        (e.ctrlKey || e.metaKey) && (f = new R(Math.round(f.x), Math.round(f.y), Math.round(f.z))), l[Ea] = f.toArray();
      }
      t.points.val = l;
    }), S.addEventListener("pointerup", () => {
      v.enabled = true, Ca = false;
    }), S.addEventListener("contextmenu", (e) => {
      var _a3;
      const n = B(e);
      if (!n) return;
      P.setFromCamera(F, n);
      let a = false;
      const o = P.intersectObject(Le), s = Ae();
      if (o.length && s.length) {
        const i = new R(...t.points.rawVal[o[0].index]), r = new R(...s[0].point), u = i.sub(r), d = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
        d.transformDirection(ae.matrixWorld), Math.abs(u.dot(d)) < 1e-4 && (a = true);
      }
      if (!a) return;
      const l = [
        ...t.points.rawVal
      ];
      if (l.splice(o[0].index, 1), t.points.val = l, !t.polylines) return;
      const f = t.polylines.rawVal.map((i) => i.filter((r) => r !== o[0].index)).map((i) => i.map((r) => r > o[0].index ? r - 1 : r)).filter((i) => i.length);
      f.push([]), t.polylines.val = f;
    });
  }
  function Ar(t, c, m) {
    const A = Math.round(14.999999999999998), z = {
      position: t.position.clone(),
      quaternion: t.quaternion.clone()
    }, S = setInterval(P, 1e3 / 30);
    let M = 0;
    function P() {
      M++;
      const F = M / A;
      t.position.lerpVectors(z.position, c.position, F), t.quaternion.slerpQuaternions(z.quaternion, c.quaternion, F), m && m(), M == A && clearInterval(S);
    }
  }
  function Cr(t, c, m, g) {
    const v = ir(m, t.elements, g);
    return ve.derive(() => {
      v.visible = c.shellResults.val != "none";
    }), v;
  }
  const Er = 6, Da = 10, Fr = 0.012;
  function $r(t) {
    return t.startsWith("contour:") ? t.slice(8) : null;
  }
  function Lr(t, c, m, g) {
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
  function Vr(t, c, m, g) {
    const v = new pt(), A = new Ws();
    A.setColorMap("rainbow");
    const z = new hn(), S = ve.state([]);
    return ve.derive(() => {
      var _a, _b, _c;
      c.deformedShape.val;
      const M = m.val, P = ((_a = t.elements) == null ? void 0 : _a.val) ?? [], F = $r(c.frameResults.val);
      if (v.children.forEach((C) => {
        C.geometry && C.geometry.dispose(), C.material && C.material.dispose();
      }), v.clear(), !F || P.length === 0 || M.length === 0) {
        S.val = [];
        return;
      }
      const B = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, ae = (_c = t.deformOutputs) == null ? void 0 : _c.val, V = [], ie = [];
      for (let C = 0; C < P.length; C++) {
        if (P[C].length !== 2) continue;
        const H = Lr(F, C, B, ae);
        H && (V.push(H[0], H[1]), ie.push({
          idx: C,
          vals: H
        }));
      }
      if (V.length === 0) {
        S.val = [];
        return;
      }
      const J = Math.min(...V), T = Math.max(...V);
      A.setMin(J), A.setMax(T), S.val = V;
      const re = [
        1 / 0,
        1 / 0,
        1 / 0
      ], ue = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const C of M) for (let N = 0; N < 3; N++) re[N] = Math.min(re[N], C[N]), ue[N] = Math.max(ue[N], C[N]);
      const Me = Math.max(ue[0] - re[0], ue[1] - re[1], ue[2] - re[2], 1) * Fr, Q = [], se = [], te = [];
      let ne = 0;
      for (const { idx: C, vals: N } of ie) {
        const H = P[C], q = M[H[0]], oe = M[H[1]];
        if (!q || !oe) continue;
        const D = new R(oe[0] - q[0], oe[1] - q[1], oe[2] - q[2]), de = D.length();
        if (de < 1e-10) continue;
        D.normalize();
        const j = Math.abs(D.y) < 0.99 ? new R(0, 1, 0) : new R(1, 0, 0), O = new R().crossVectors(D, j).normalize(), W = new R().crossVectors(D, O).normalize(), le = Da + 1, we = Er;
        for (let ze = 0; ze < le; ze++) {
          const Fe = ze / Da, tt = q[0] + D.x * de * Fe, st = q[1] + D.y * de * Fe, Ue = q[2] + D.z * de * Fe, Z = N[0] + (N[1] - N[0]) * Fe, ce = A.getColor(Z) ?? new hn(0, 0, 0);
          z.copy(ce).convertSRGBToLinear();
          for (let fe = 0; fe < we; fe++) {
            const me = fe / we * Math.PI * 2, ke = Math.cos(me), $e = Math.sin(me);
            Q.push(tt + (O.x * ke + W.x * $e) * Me, st + (O.y * ke + W.y * $e) * Me, Ue + (O.z * ke + W.z * $e) * Me), se.push(z.r, z.g, z.b);
          }
        }
        for (let ze = 0; ze < Da; ze++) for (let Fe = 0; Fe < we; Fe++) {
          const tt = (Fe + 1) % we, st = ne + ze * we + Fe, Ue = ne + ze * we + tt, Z = ne + (ze + 1) * we + Fe, ce = ne + (ze + 1) * we + tt;
          te.push(st, Ue, ce), te.push(st, ce, Z);
        }
        ne += le * we;
      }
      if (Q.length === 0) return;
      const Y = new De();
      Y.setAttribute("position", new Rt(Q, 3)), Y.setAttribute("color", new Rt(se, 3)), Y.setIndex(te), Y.computeVertexNormals();
      const ee = new wt({
        vertexColors: true,
        side: It
      }), G = new dt(Y, ee);
      G.frustumCulled = false, v.add(G);
    }), v.__colorMapValues = S, v;
  }
  function Ir() {
    const t = window;
    return {
      forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf",
      dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm",
      stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2"
    };
  }
  const Rr = {
    kN: 1,
    tonf: 1 / 9.80665,
    kip: 1 / 4.4482216
  }, Tr = {
    mm: 1e3,
    cm: 100,
    m: 1,
    in: 39.3700787402
  }, Br = {
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
  function Et(t, c = 4) {
    return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(c) : t.toFixed(c);
  }
  const Dr = 16755200, Is = 56831, Nr = 56831, Yr = 56831, na = 65382;
  function Xr(t) {
    const c = new pt();
    c.name = "__hekatan_hover", c.renderOrder = 99;
    const m = new eo(1, 16, 16), g = new wt({
      color: Dr,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    }), v = new dt(m, g);
    v.visible = false, v.renderOrder = 100, c.add(v);
    const A = new De(), z = new mt({
      color: Is,
      linewidth: 4,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    }), S = new rn(A, z);
    S.visible = false, S.renderOrder = 100, c.add(S);
    const M = new wt({
      color: Is,
      transparent: true,
      opacity: 0.7,
      depthTest: false
    }), P = new dt(new Cs(1, 1, 1, 12), M);
    P.visible = false, P.renderOrder = 100, c.add(P);
    const F = new De(), B = new wt({
      color: Nr,
      transparent: true,
      opacity: 0.45,
      side: It,
      depthTest: false
    }), ae = new dt(F, B);
    ae.visible = false, ae.renderOrder = 100, c.add(ae);
    const V = new De(), ie = new mt({
      color: Yr,
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }), J = new rn(V, ie);
    J.visible = false, J.renderOrder = 100, c.add(J);
    const T = new wt({
      color: na,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }), re = new wt({
      color: na,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    }), ue = new Cs(1, 1, 1, 12), xe = new wt({
      color: na,
      transparent: true,
      opacity: 0.55,
      side: It,
      depthTest: false
    }), Me = new mt({
      color: na,
      linewidth: 4,
      transparent: true,
      opacity: 1,
      depthTest: false
    }), Q = [];
    window.__hekatanModelSelection = Q;
    const se = new pt();
    se.renderOrder = 101, c.add(se);
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
      return !ce || Z < 0 || Z >= ce.length ? null : new R(ce[Z][0], ce[Z][1], ce[Z][2]);
    }
    function ee(Z, ce) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r2, _s2, _t;
      const fe = t.getActiveCamera();
      if (!fe || !t.mesh) return null;
      const me = t.rendererElm.getBoundingClientRect(), ke = Z - me.left, $e = ce - me.top, Ae = t.derivedNodes.rawVal, Le = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
      if (!Ae || !Le) return null;
      const je = /* @__PURE__ */ new Map(), We = (it) => {
        if (je.has(it)) return je.get(it);
        const Xe = Y(it);
        if (!Xe) return je.set(it, null), null;
        const Ke = Xe.clone().project(fe), Se = (Ke.x * 0.5 + 0.5) * me.width, Ee = (-Ke.y * 0.5 + 0.5) * me.height, Ge = {
          x: Se,
          y: Ee,
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
        const Ke = Xe.x - ke, Se = Xe.y - $e, Ee = Math.sqrt(Ke * Ke + Se * Se);
        Ee < ot && (ot = Ee, Pe = it);
      }
      const Ye = Ir(), ut = Tr[Ye.dispUnit] ?? 1e3, Oe = Rr[Ye.forceUnit] ?? 1;
      if (Pe >= 0) {
        const it = Ae[Pe];
        let Xe = `Nodo ${Pe}
(${it[0].toFixed(3)}, ${it[1].toFixed(3)}, ${it[2].toFixed(3)})`;
        const Ke = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
        if (Ke == null ? void 0 : Ke.deformations) {
          const Se = Ke.deformations.get(Pe);
          if (Se && (Xe += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Xe += `
Ux = ${Et(Se[0] * ut, 3)} ${Ye.dispUnit}`, Xe += `
Uy = ${Et(Se[1] * ut, 3)} ${Ye.dispUnit}`, Xe += `
Uz = ${Et(Se[2] * ut, 3)} ${Ye.dispUnit}`, (Math.abs(Se[3]) > 1e-9 || Math.abs(Se[4]) > 1e-9 || Math.abs(Se[5]) > 1e-9) && (Xe += `
Rx = ${Et(Se[3] * 1e3, 3)} mrad`, Xe += `
Ry = ${Et(Se[4] * 1e3, 3)} mrad`, Xe += `
Rz = ${Et(Se[5] * 1e3, 3)} mrad`)), Ke.reactions) {
            const Ee = Ke.reactions.get(Pe);
            Ee && (Math.abs(Ee[0]) > 1e-9 || Math.abs(Ee[1]) > 1e-9 || Math.abs(Ee[2]) > 1e-9 || Math.abs(Ee[3]) > 1e-6 || Math.abs(Ee[4]) > 1e-6 || Math.abs(Ee[5]) > 1e-6) && (Xe += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Xe += `
Fx = ${Et(Ee[0] * Oe)} ${Ye.forceUnit}`, Xe += `
Fy = ${Et(Ee[1] * Oe)} ${Ye.forceUnit}`, Xe += `
Fz = ${Et(Ee[2] * Oe)} ${Ye.forceUnit}`, (Math.abs(Ee[3]) > 1e-6 || Math.abs(Ee[4]) > 1e-6 || Math.abs(Ee[5]) > 1e-6) && (Xe += `
Mx = ${Et(Ee[3] * Oe)} ${Ye.forceUnit}\xB7m`, Xe += `
My = ${Et(Ee[4] * Oe)} ${Ye.forceUnit}\xB7m`, Xe += `
Mz = ${Et(Ee[5] * Oe)} ${Ye.forceUnit}\xB7m`));
          }
        }
        return {
          type: "node",
          idx: Pe,
          info: Xe
        };
      }
      const en = 5;
      let yt = -1, ln = en, Zt = "frame";
      for (let it = 0; it < Le.length; it++) {
        const Xe = Le[it];
        if (!(!Xe || Xe.length < 2)) {
          if (Xe.length === 2) {
            const Ke = We(Xe[0]), Se = We(Xe[1]);
            if (!Ke || !Se || Ke.z < -1 || Ke.z > 1 || Se.z < -1 || Se.z > 1) continue;
            const Ee = Ur(ke, $e, Ke.x, Ke.y, Se.x, Se.y);
            Ee < ln && (ln = Ee, yt = it, Zt = "frame");
          } else if (Xe.length === 3 || Xe.length === 4) {
            const Ke = [];
            let Se = true;
            for (const Ee of Xe) {
              const Ge = We(Ee);
              if (!Ge || Ge.z < -1 || Ge.z > 1) {
                Se = false;
                break;
              }
              Ke.push(Ge);
            }
            if (!Se) continue;
            if (Zr(ke, $e, Ke)) {
              const Ge = Ke.reduce((nt, lt) => nt + lt.z, 0) / Ke.length * 1e-3;
              Ge < ln && (ln = Ge, yt = it, Zt = "shell");
            }
          } else if (Xe.length === 8) {
            const Ke = [];
            let Se = true;
            for (const at of Xe) {
              const rt = We(at);
              if (!rt || rt.z < -1 || rt.z > 1) {
                Se = false;
                break;
              }
              Ke.push(rt);
            }
            if (!Se) continue;
            const Ee = Math.min(...Ke.map((at) => at.x)), Ge = Math.max(...Ke.map((at) => at.x)), nt = Math.min(...Ke.map((at) => at.y)), lt = Math.max(...Ke.map((at) => at.y));
            if (ke >= Ee && ke <= Ge && $e >= nt && $e <= lt) {
              const rt = Ke.reduce((St, ct) => St + ct.z, 0) / Ke.length * 1e-3;
              rt < ln && (ln = rt, yt = it, Zt = "solid");
            }
          }
        }
      }
      if (yt >= 0) {
        const it = Le[yt];
        let Ke = `${Zt === "frame" ? "Frame" : Zt === "shell" ? "Shell" : "Solid"} ${yt}`;
        const Se = (_e = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, Ee = (_g = (_f = Se == null ? void 0 : Se.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, yt);
        if (Ee) {
          Ee.name && (Ke += `
  \u{1F4CB} ${Ee.name}`), Ee.shape && (Ke += `
  Shape: ${Ee.shape}`);
          const Ge = /concrete|hormig|rect.*sólida/i.test(Ee.shape || ""), nt = Ge ? 100 : 1e3, lt = Ge ? "cm" : "mm", at = (St) => {
            const ct = St * nt;
            return Math.abs(ct - Math.round(ct)) < 0.05 ? `${Math.round(ct)}` : `${ct.toFixed(1)}`;
          }, rt = [];
          if (Ee.D != null && rt.push(`D=${at(Ee.D)}`), Ee.B != null && rt.push(`B=${at(Ee.B)}`), Ee.TF != null && rt.push(`TF=${at(Ee.TF)}`), Ee.TW != null && rt.push(`TW=${at(Ee.TW)}`), Ee.t != null && rt.push(`t=${at(Ee.t)}`), rt.length && (Ke += `
  Dim: ${rt.join(" ")} ${lt}`), Ee.material) {
            let St = Ee.material;
            Ee.fillMaterial && (St += ` + FILL "${Ee.fillMaterial}"`), Ke += `
  Mat: ${St}`;
          }
        } else {
          const Ge = (_i = (_h = Se == null ? void 0 : Se.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, yt), nt = (_k = (_j = Se == null ? void 0 : Se.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, yt);
          Ge ? (Ke += `
  ${Ge}`, nt && !Ge.includes(nt) && (Ke += `  (${nt})`)) : nt && (Ke += `
  Material: ${nt}`);
        }
        if (Ke += `
nodos: [${it.join(", ")}]`, Zt === "shell" && ((_l = t.mesh) == null ? void 0 : _l.analyzeOutputs)) {
          const Ge = t.mesh.analyzeOutputs.rawVal, nt = Br[Ye.stressUnit] ?? 1, lt = [
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
          ], at = [];
          for (const [rt, St, ct, qt] of lt) {
            const _t2 = Ge == null ? void 0 : Ge[rt];
            if (_t2 && _t2 instanceof Map) {
              const Xt = _t2.get(yt);
              if (Xt != null) {
                if (typeof Xt == "number") at.push(`${St} = ${Et(Xt * ct, 3)} ${qt}`);
                else if (Array.isArray(Xt)) {
                  let Jt = Xt[0];
                  for (const Tt of Xt) Math.abs(Tt) > Math.abs(Jt) && (Jt = Tt);
                  at.push(`${St} = ${Et(Jt * ct, 3)} ${qt}`);
                }
              }
            }
          }
          at.length > 0 && (Ke += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + at.slice(0, 8).join(`
`));
        }
        if (Zt === "frame" && ((_m = t.mesh) == null ? void 0 : _m.deformOutputs) && t.mesh.elementInputs) {
          const Ge = t.mesh.deformOutputs.rawVal, nt = t.mesh.elementInputs.rawVal, lt = Ge == null ? void 0 : Ge.deformations;
          if (lt && it.length === 2) {
            const at = lt.get(it[0]), rt = lt.get(it[1]), St = ((_n = t.mesh.nodes) == null ? void 0 : _n.rawVal) ?? Ae, ct = St[it[0]], qt = St[it[1]];
            if (at && rt && ct && qt) {
              const _t2 = qt[0] - ct[0], Xt = qt[1] - ct[1], Jt = qt[2] - ct[2], Tt = Math.sqrt(_t2 * _t2 + Xt * Xt + Jt * Jt);
              if (Tt > 1e-9) {
                const An = _t2 / Tt, $t = Xt / Tt, Rn = Jt / Tt, xn = (rt[0] - at[0]) * An + (rt[1] - at[1]) * $t + (rt[2] - at[2]) * Rn, tn = ((_o = nt.elasticities) == null ? void 0 : _o.get(yt)) ?? 0, Kn = ((_p = nt.areas) == null ? void 0 : _p.get(yt)) ?? 0, no = ((_q = nt.momentsOfInertiaY) == null ? void 0 : _q.get(yt)) ?? 0, da = ((_r2 = nt.momentsOfInertiaZ) == null ? void 0 : _r2.get(yt)) ?? 0, Kt = ((_s2 = nt.torsionalConstants) == null ? void 0 : _s2.get(yt)) ?? 0, mo = ((_t = nt.shearModuli) == null ? void 0 : _t.get(yt)) ?? tn / 2.6, Gn = tn * Kn * (xn / Tt), oo = (rt[3] - at[3]) * An + (rt[4] - at[4]) * $t + (rt[5] - at[5]) * Rn, Hn = mo * Kt * (oo / Tt), gn = rt[4] - at[4], wo = rt[5] - at[5], Qt = tn * no * gn / Tt, nn = tn * da * wo / Tt;
                Ke += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ke += `
L = ${Et(Tt, 3)} m`, Ke += `
\u0394L = ${Et(xn * ut, 3)} ${Ye.dispUnit}`, Ke += `
\u03B5 = ${Et(xn / Tt, 6)}`, Math.abs(Gn) > 1e-6 && (Ke += `
N \u2248 ${Et(Gn * Oe)} ${Ye.forceUnit}`), Math.abs(Hn) > 1e-6 && (Ke += `
T \u2248 ${Et(Hn * Oe)} ${Ye.forceUnit}\xB7m`), Math.abs(Qt) > 1e-6 && (Ke += `
My \u2248 ${Et(Qt * Oe)} ${Ye.forceUnit}\xB7m`), Math.abs(nn) > 1e-6 && (Ke += `
Mz \u2248 ${Et(nn * Oe)} ${Ye.forceUnit}\xB7m`);
              }
            }
          }
        }
        return {
          type: Zt,
          idx: yt,
          info: Ke
        };
      }
      return null;
    }
    function G(Z, ce, fe) {
      var _a, _b, _c;
      if (v.visible = false, S.visible = false, P.visible = false, ae.visible = false, J.visible = false, !Z || !t.mesh) {
        ne.style.display = "none", t.render();
        return;
      }
      const me = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
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
            for (const Ye of je) for (let ut = 0; ut < 3; ut++) Ye[ut] < Pe[ut] && (Pe[ut] = Ye[ut]), Ye[ut] > ot[ut] && (ot[ut] = Ye[ut]);
            We = Math.max(ot[0] - Pe[0], ot[1] - Pe[1], ot[2] - Pe[2], 0.1);
          }
          const Ve = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, et = 0.021 * We * Ve;
          v.position.copy(Le), v.scale.setScalar(et), v.visible = true;
        }
      } else if (Z.type === "frame" && me) {
        const Le = me[Z.idx], je = Y(Le[0]), We = Y(Le[1]);
        if (je && We) {
          const Ve = je.clone().add(We).multiplyScalar(0.5), et = We.clone().sub(je), Pe = et.length(), ot = Math.max(1e-4, 3.5 * ze(Ve));
          P.position.copy(Ve);
          const Ye = new R(0, 1, 0), ut = Ye.clone().cross(et).normalize(), Oe = Ye.angleTo(et);
          P.quaternion.setFromAxisAngle(ut, Oe), P.scale.set(ot, Pe, ot), P.visible = true;
        }
      } else if (Z.type === "shell" && me) {
        const Le = me[Z.idx], je = [], We = [];
        for (const Ve of Le) {
          const et = Y(Ve);
          if (!et) return;
          je.push(et.x, et.y, et.z);
        }
        Le.length === 4 ? We.push(0, 1, 2, 0, 2, 3) : Le.length === 3 && We.push(0, 1, 2), F.setAttribute("position", new Rt(je, 3)), F.setIndex(We), F.computeVertexNormals(), ae.visible = true;
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
        V.setAttribute("position", new Rt(We, 3)), J.visible = true;
      }
      if (window.__hekatanShellTooltipVisible === true) {
        ne.style.display = "none", t.render();
        return;
      }
      ne.textContent = Z.info, ne.style.whiteSpace = "pre-line", ne.style.display = "block";
      const $e = t.rendererElm.getBoundingClientRect(), Ae = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? $e;
      ne.style.left = `${ce - Ae.left}px`, ne.style.top = `${fe - Ae.top}px`, t.render();
    }
    let C = "", N = 0, H = 0;
    const q = window.__hekatanHoverDebug ?? false, oe = (Z) => {
      N && cancelAnimationFrame(N), N = requestAnimationFrame(() => {
        var _a, _b, _c;
        const ce = ee(Z.clientX, Z.clientY);
        if (q && H < 5) {
          const me = t.derivedNodes.rawVal, ke = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
          console.log(`[hover] pointer (${Z.clientX}, ${Z.clientY}) nodes=${(me == null ? void 0 : me.length) ?? 0} elems=${(ke == null ? void 0 : ke.length) ?? 0} hover=`, ce), H++;
        }
        const fe = ce ? `${ce.type}:${ce.idx}` : "";
        if (fe !== C) C = fe, G(ce, Z.clientX, Z.clientY);
        else if (ce) {
          const me = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
          ne.style.left = `${Z.clientX - me.left}px`, ne.style.top = `${Z.clientY - me.top}px`;
        }
      });
    };
    let D = null;
    const de = () => {
      C = "", v.visible = false, S.visible = false, P.visible = false, ae.visible = false, J.visible = false, ne.style.display = "none", t.render();
    }, j = (Z) => {
      const ce = t.rendererElm.getBoundingClientRect(), fe = Z.clientX - ce.left, me = Z.clientY - ce.top;
      (fe < -2 || me < -2 || fe > ce.width + 2 || me > ce.height + 2) && (D && clearTimeout(D), D = window.setTimeout(de, 200));
    }, O = () => {
      D && (clearTimeout(D), D = null);
    };
    t.rendererElm.addEventListener("pointermove", oe), t.rendererElm.addEventListener("pointerleave", j), t.rendererElm.addEventListener("pointerenter", O);
    function W() {
      var _a, _b, _c;
      const Z = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
      return Z === "select" || Z === "none" || !Z;
    }
    let le = null;
    t.rendererElm.addEventListener("pointerdown", (Z) => {
      Z.button === 0 && (le = {
        x: Z.clientX,
        y: Z.clientY
      });
    }), t.rendererElm.addEventListener("pointerup", (Z) => {
      if (Z.button !== 0 || !le) return;
      const ce = Z.clientX - le.x, fe = Z.clientY - le.y;
      if (le = null, ce * ce + fe * fe > 9 || !W()) return;
      const me = ee(Z.clientX, Z.clientY);
      me ? (st({
        type: me.type,
        idx: me.idx
      }, Z.shiftKey), tt()) : Ue();
    }), window.addEventListener("keydown", (Z) => {
      if (Z.key !== "Escape" || !Q.length) return;
      const ce = document.activeElement, fe = !!ce && (ce.id === "hk3-cmd-input" || ce.id === "hk-dyn-input") && ce.value === "";
      ce && (ce.tagName === "INPUT" || ce.tagName === "TEXTAREA" || ce.isContentEditable) && !fe || Ue();
    }, {
      capture: true
    });
    function we() {
      for (const Z of se.children.slice()) {
        se.remove(Z);
        const ce = Z.geometry;
        ce && ce !== m && ce !== ue && ce.dispose();
      }
    }
    const ze = (Z) => {
      var _a;
      const ce = t.getActiveCamera(), fe = ((_a = t.rendererElm) == null ? void 0 : _a.clientHeight) || 700;
      return ce.isOrthographicCamera ? (ce.top - ce.bottom) / (ce.zoom || 1) / fe : 2 * ce.position.distanceTo(Z) * Math.tan((ce.fov || 50) * Math.PI / 180 / 2) / fe;
    };
    function Fe(Z, ce) {
      var _a, _b;
      const fe = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
      if (Z.type === "node") {
        const me = Y(Z.idx);
        if (!me) return;
        const ke = new dt(m, T);
        ke.position.copy(me), ke.scale.setScalar(Math.max(1e-4, 7 * ze(me))), ke.renderOrder = 101, se.add(ke);
      } else if (Z.type === "frame" && fe) {
        const me = fe[Z.idx], ke = Y(me[0]), $e = Y(me[1]);
        if (!ke || !$e) return;
        const Ae = ke.clone().add($e).multiplyScalar(0.5), Le = $e.clone().sub(ke), je = Le.length(), We = Math.max(1e-4, 4 * ze(Ae)), Ve = new dt(ue, re);
        Ve.position.copy(Ae);
        const et = new R(0, 1, 0);
        Ve.quaternion.setFromAxisAngle(et.clone().cross(Le).normalize(), et.angleTo(Le)), Ve.scale.set(We, je, We), Ve.renderOrder = 101, se.add(Ve);
      } else if (Z.type === "shell" && fe) {
        const me = fe[Z.idx], ke = [], $e = [];
        for (const je of me) {
          const We = Y(je);
          if (!We) return;
          ke.push(We.x, We.y, We.z);
        }
        me.length === 4 ? $e.push(0, 1, 2, 0, 2, 3) : me.length === 3 && $e.push(0, 1, 2);
        const Ae = new De();
        Ae.setAttribute("position", new Rt(ke, 3)), Ae.setIndex($e), Ae.computeVertexNormals();
        const Le = new dt(Ae, xe);
        Le.renderOrder = 101, se.add(Le);
      } else if (Z.type === "solid" && fe) {
        const me = fe[Z.idx], ke = [
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
        Ae.setAttribute("position", new Rt($e, 3));
        const Le = new rn(Ae, Me);
        Le.renderOrder = 101, se.add(Le);
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
        ], fe = [
          -1 / 0,
          -1 / 0,
          -1 / 0
        ];
        for (const me of Z) for (let ke = 0; ke < 3; ke++) me[ke] < ce[ke] && (ce[ke] = me[ke]), me[ke] > fe[ke] && (fe[ke] = me[ke]);
        Math.max(fe[0] - ce[0], fe[1] - ce[1], fe[2] - ce[2], 0.1);
      }
      for (const ce of Q) Fe(ce);
      t.render();
    }
    function st(Z, ce) {
      const fe = Q.findIndex((me) => me.type === Z.type && me.idx === Z.idx);
      fe >= 0 ? Q.splice(fe, 1) : ce || Q.push(Z), te = Q.length ? Q[Q.length - 1] : null, window.dispatchEvent(new CustomEvent("hk:model-selection", {
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
  function Ur(t, c, m, g, v, A) {
    const z = v - m, S = A - g, M = z * z + S * S;
    if (M < 1e-9) {
      const ie = t - m, J = c - g;
      return Math.sqrt(ie * ie + J * J);
    }
    let P = ((t - m) * z + (c - g) * S) / M;
    P = Math.max(0, Math.min(1, P));
    const F = m + P * z, B = g + P * S, ae = t - F, V = c - B;
    return Math.sqrt(ae * ae + V * V);
  }
  function Zr(t, c, m) {
    let g = false;
    for (let v = 0, A = m.length - 1; v < m.length; A = v++) {
      const z = m[v].x, S = m[v].y, M = m[A].x, P = m[A].y;
      S > c != P > c && t < (M - z) * (c - S) / (P - S + 1e-12) + z && (g = !g);
    }
    return g;
  }
  const fn = (t) => {
    if (!isFinite(t) || t === 0) return "0";
    const c = Math.abs(t);
    return c >= 1e-3 && c < 1e7 ? String(+t.toPrecision(15)) : t.toExponential(14);
  };
  function Rs(t, c) {
    var _a, _b, _c, _d, _e, _f, _g;
    const m = ((_a = t.nodes) == null ? void 0 : _a.rawVal) ?? [], v = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[c];
    if (!v || v.length !== 2) throw new Error(`El elemento ${c} no es una barra (2 nudos).`);
    const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, z = (j) => {
      var _a2, _b2;
      return ((_b2 = (_a2 = A[j]) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, c)) ?? 0;
    }, S = m[v[0]], M = m[v[1]], P = z("elasticities"), F = z("shearModuli"), B = z("areas"), ae = z("momentsOfInertiaZ"), V = z("momentsOfInertiaY"), ie = z("torsionalConstants");
    let J = z("shearAreasY"), T = z("shearAreasZ");
    const re = Math.hypot(M[0] - S[0], M[1] - S[1], M[2] - S[2]), ue = J < -1e-15, xe = T < -1e-15;
    !ue && J < 1e-15 && B > 1e-15 && F > 1e-15 && (J = 5 / 6 * B), !xe && T < 1e-15 && B > 1e-15 && F > 1e-15 && (T = 5 / 6 * B);
    const Me = !xe && T > 0 && F > 0 ? 12 * P * ae / (F * T * re * re) : 0, Q = !ue && J > 0 && F > 0 ? 12 * P * V / (F * J * re * re) : 0, se = P * B / re, te = F * ie / re, ne = 12 * P * ae / re ** 3 / (1 + Me), Y = 6 * P * ae / re ** 2 / (1 + Me), ee = 4 * P * ae / re * (1 + Me / 4) / (1 + Me), G = 2 * P * ae / re * (1 - Me / 2) / (1 + Me), C = 12 * P * V / re ** 3 / (1 + Q), N = 6 * P * V / re ** 2 / (1 + Q), H = 4 * P * V / re * (1 + Q / 4) / (1 + Q), q = 2 * P * V / re * (1 - Q / 2) / (1 + Q);
    let oe = [
      [
        se,
        0,
        0,
        0,
        0,
        0,
        -se,
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
        -se,
        0,
        0,
        0,
        0,
        0,
        se,
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
      const j = de.length >= 12 ? de.slice(0, 12).map((Fe, tt) => Fe ? tt : -1).filter((Fe) => Fe >= 0) : de.slice(0, 6).map((Fe, tt) => Fe ? [
        3,
        4,
        5,
        9,
        10,
        11
      ][tt] : -1).filter((Fe) => Fe >= 0), O = [
        ...Array(12).keys()
      ].filter((Fe) => !j.includes(Fe)), W = j.length, le = j.map((Fe, tt) => [
        ...j.map((st) => oe[Fe][st]),
        ...j.map((st, Ue) => tt === Ue ? 1 : 0)
      ]);
      for (let Fe = 0; Fe < W; Fe++) {
        let tt = Fe;
        for (let Ue = Fe + 1; Ue < W; Ue++) Math.abs(le[Ue][Fe]) > Math.abs(le[tt][Fe]) && (tt = Ue);
        [le[Fe], le[tt]] = [
          le[tt],
          le[Fe]
        ];
        const st = le[Fe][Fe];
        for (let Ue = 0; Ue < 2 * W; Ue++) le[Fe][Ue] /= st;
        for (let Ue = 0; Ue < W; Ue++) if (Ue !== Fe) {
          const Z = le[Ue][Fe];
          for (let ce = 0; ce < 2 * W; ce++) le[Ue][ce] -= Z * le[Fe][ce];
        }
      }
      const we = le.map((Fe) => Fe.slice(W)), ze = Array.from({
        length: 12
      }, () => Array(12).fill(0));
      for (const Fe of O) for (const tt of O) {
        let st = 0;
        for (let Ue = 0; Ue < W; Ue++) for (let Z = 0; Z < W; Z++) st += oe[Fe][j[Ue]] * we[Ue][Z] * oe[j[Z]][tt];
        ze[Fe][tt] = oe[Fe][tt] - st;
      }
      oe = ze;
    }
    return {
      K: oe,
      L: re,
      phiZ: Me,
      phiY: Q
    };
  }
  function Ts(t, c) {
    var _a, _b, _c, _d, _e, _f, _g;
    const m = ((_a = t.nodes) == null ? void 0 : _a.rawVal) ?? [], v = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[c];
    if (!v || v.length !== 2) throw new Error(`El elemento ${c} no es una barra (2 nudos).`);
    const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, z = (ie, J = 0) => {
      var _a2, _b2;
      return ((_b2 = (_a2 = A[ie]) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, c)) ?? J;
    }, S = m[v[0]], M = m[v[1]], P = (_e = (_d = A.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, c), F = (_g = (_f = A.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, c), B = z("localAngles", 0), ae = [], V = (ie = "") => ae.push(ie);
    if (V("% ============================================================"), V(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${c + 1} (indice ${c} del motor)`), V("%  Generado por Hekatan Struct con los datos que recibe el motor."), V("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), V("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), V("% ============================================================"), V(), V("% --- Datos de la barra -------------------------------------------------"), V(`xi = [${S.map(fn).join(" ")}];      % nudo i (${v[0]})`), V(`xj = [${M.map(fn).join(" ")}];      % nudo j (${v[1]})`), V(`E  = ${fn(z("elasticities"))};      % modulo de elasticidad`), V(`G  = ${fn(z("shearModuli"))};      % modulo de cortante`), V(`A  = ${fn(z("areas"))};      % area`), V(`Iz = ${fn(z("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), V(`Iy = ${fn(z("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), V(`J  = ${fn(z("torsionalConstants"))};      % constante de torsion`), V(`AsY = ${fn(z("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), V(`AsZ = ${fn(z("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), B && V(`% ang = ${fn(B)} grados: gira la seccion en T, NO cambia esta matriz local.`), V(), V("L = sqrt(sum((xj - xi).^2));"), V(), V("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), V("bernY = AsY < 0;   bernZ = AsZ < 0;"), V("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), V("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), V("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), V("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), V(), V("EA_L = E*A/L;          % axial"), V("GJ_L = G*J/L;          % torsion"), V("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), V("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), V("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), V("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), V(), V("% --- Matriz local (misma disposicion que el C++) ----------------------"), V("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), V("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), V("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), V("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), V("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), V("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), V("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), V("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), V("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), V("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), V("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), V("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), F && F.some((ie) => ie > 1e-12) && (V(), V("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), V(`kres = [${F.slice(0, 12).map(fn).join(" ")}];`), V("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), P && P.some(Boolean)) {
      const ie = P.length >= 12 ? P.slice(0, 12).map((J, T) => J ? T + 1 : 0).filter(Boolean) : P.slice(0, 6).map((J, T) => J ? [
        4,
        5,
        6,
        10,
        11,
        12
      ][T] : 0).filter(Boolean);
      V(), V("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), V(`f = [${ie.join(" ")}];              % GDL liberados`), V("r = setdiff(1:12, f);                % GDL que quedan"), V("Kc = zeros(12);"), V("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), V("K = Kc;");
    }
    return V(), V("% --- Resultado ---------------------------------------------------------"), V(`fprintf('Barra ${c + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), V("disp('K local (12x12):');"), V("disp(K);"), {
      nombre: `K_local_barra_${c + 1}.m`,
      texto: ae.join(`
`) + `
`
    };
  }
  const qr = {
    normals: "Axial",
    torsions: "Torsi\xF3n",
    shearsY: "Cortante 2-2",
    shearsZ: "Cortante 3-3",
    bendingsY: "Momento 2-2",
    bendingsZ: "Momento 3-3"
  }, Kr = {
    normals: "kN",
    torsions: "kN\xB7m",
    shearsY: "kN",
    shearsZ: "kN",
    bendingsY: "kN\xB7m",
    bendingsZ: "kN\xB7m"
  }, Zn = 1e-3;
  function zo(t, c) {
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
  function Gr(t, c) {
    const m = Math.abs(c[0] - t[0]);
    return Math.abs(c[1] - t[1]) < Zn ? {
      plano: "XZ",
      en: t[1]
    } : m < Zn ? {
      plano: "YZ",
      en: t[0]
    } : {
      plano: "XY",
      en: t[2]
    };
  }
  function Hr(t, c) {
    var _a, _b;
    let m = null, g = {
      plano: "XZ",
      en: 0
    };
    const v = () => {
      var _a2, _b2;
      const C = ((_a2 = c == null ? void 0 : c.frameResults) == null ? void 0 : _a2.rawVal) ?? ((_b2 = c == null ? void 0 : c.frameResults) == null ? void 0 : _b2.val);
      return !C || C === "none" ? null : String(C).replace(/^contour:/, "");
    }, A = (C) => {
      var _a2, _b2;
      const N = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], H = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], q = /* @__PURE__ */ new Set();
      for (const oe of H) {
        if (oe.length !== 2) continue;
        const D = N[oe[0]], de = N[oe[1]];
        if (!D || !de) continue;
        const j = zo(D, C), O = zo(de, C);
        Math.abs(j.fuera - O.fuera) < Zn && q.add(Math.round(j.fuera * 1e3) / 1e3);
      }
      return [
        ...q
      ].sort((oe, D) => oe - D);
    };
    function z(C) {
      var _a2, _b2;
      if (C == null ? void 0 : C.plano) g = {
        plano: C.plano,
        en: C.en ?? A(C.plano)[0] ?? 0
      };
      else {
        const H = [
          ...window.__hekatanModelSelection ?? []
        ].reverse().find((D) => D.type === "frame"), q = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], oe = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
        H && oe[H.idx] && q[oe[H.idx][0]] && q[oe[H.idx][1]] ? g = Gr(q[oe[H.idx][0]], q[oe[H.idx][1]]) : g = {
          plano: "XZ",
          en: A("XZ")[0] ?? 0
        };
      }
      m || S(), m.hidden = false, M();
    }
    function S() {
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
        }, M();
      }), N.addEventListener("change", () => {
        g.en = Number(N.value), M();
      });
      const H = (D) => {
        const de = A(g.plano), j = de.findIndex((W) => Math.abs(W - g.en) < Zn), O = Math.max(0, Math.min(de.length - 1, (j < 0 ? 0 : j) + D));
        de.length && (g.en = de[O], M());
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
        m && !m.hidden && M();
      }).observe(m);
    }
    function M() {
      var _a2, _b2, _c, _d, _e, _f, _g, _h;
      if (!m || m.hidden) return;
      const C = new Set(B && !B.hidden && ae >= 0 ? ie(ae) : []), N = m.querySelector(".hk-d2-svg"), H = m.querySelector(".hk-d2-tit"), q = m.querySelector(".hk-d2-pie"), oe = m.querySelector(".hk-d2-plano"), D = m.querySelector(".hk-d2-en");
      oe.value = g.plano;
      const de = A(g.plano), j = g.plano === "XZ" ? "y" : g.plano === "YZ" ? "x" : "z", O = g.plano === "XY" ? "Planta" : "P\xF3rtico";
      D.innerHTML = de.map((Se, Ee) => `<option value="${Se}" ${Math.abs(Se - g.en) < Zn ? "selected" : ""}>${O} ${Ee + 1} \xB7 ${j} = ${Se.toFixed(2)} m</option>`).join("");
      const W = v(), le = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], we = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], ze = W ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[W] : null;
      N.innerHTML = "";
      const Fe = N.clientWidth || 880, tt = N.clientHeight || 480, st = [];
      if (we.forEach((Se, Ee) => {
        if (Se.length !== 2) return;
        const Ge = le[Se[0]], nt = le[Se[1]];
        if (!Ge || !nt) return;
        const lt = zo(Ge, g.plano), at = zo(nt, g.plano);
        Math.abs(lt.fuera - g.en) < Zn && Math.abs(at.fuera - g.en) < Zn && st.push({
          i: Ee,
          a: lt,
          b: at
        });
      }), !st.length) {
        q.textContent = "No hay barras en este plano.", H.textContent = "";
        return;
      }
      let Ue = 1 / 0, Z = -1 / 0, ce = 1 / 0, fe = -1 / 0;
      for (const Se of st) for (const Ee of [
        Se.a,
        Se.b
      ]) Ue = Math.min(Ue, Ee.u), Z = Math.max(Z, Ee.u), ce = Math.min(ce, Ee.v), fe = Math.max(fe, Ee.v);
      const me = Z - Ue || 1, ke = fe - ce || 1, $e = 0.12 * Math.max(me, ke), Ae = 46, Le = Math.min((Fe - 2 * Ae) / (me + 2 * $e), (tt - 2 * Ae) / (ke + 2 * $e)), je = (Fe - me * Le) / 2, We = (tt - ke * Le) / 2, Ve = (Se) => je + (Se - Ue) * Le, et = (Se) => tt - (We + (Se - ce) * Le), Pe = "http://www.w3.org/2000/svg", ot = (Se, Ee, Ge) => {
        const nt = document.createElementNS(Pe, Se);
        for (const lt in Ee) nt.setAttribute(lt, String(Ee[lt]));
        return Ge != null && (nt.textContent = Ge), N.appendChild(nt), nt;
      }, Ye = /* @__PURE__ */ new Map();
      for (const Se of st) {
        const Ee = ((_h = (_g = (_f = (_e = t.elementInputs) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Se.i)) ?? 0, Ge = zo(ei(W ?? "normals", js(le[we[Se.i][0]], le[we[Se.i][1]], Ee)), g.plano), nt = Math.hypot(Ge.u, Ge.v);
        Ye.set(Se.i, nt > 0.3 ? [
          Ge.u / nt,
          -Ge.v / nt
        ] : null);
      }
      const ut = st.filter((Se) => !Ye.get(Se.i)).length;
      let Oe = 0;
      if (ze) for (const Se of st) {
        if (!Ye.get(Se.i)) continue;
        const Ee = ze instanceof Map ? ze.get(Se.i) : ze[Se.i];
        Ee && (Oe = Math.max(Oe, Math.abs(Ee[0] ?? 0), Math.abs(Ee[1] ?? 0)));
      }
      const en = 0.12 * Math.max(me, ke) * Le, yt = Oe > 0 ? en / Oe : 0, ln = W === "bendingsY" || W === "bendingsZ", Zt = (Se) => Math.abs(Se) >= 100 ? Se.toFixed(1) : Math.abs(Se) >= 10 ? Se.toFixed(2) : Se.toFixed(3), it = [];
      for (const Se of st) {
        const Ee = Ve(Se.a.u), Ge = et(Se.a.v), nt = Ve(Se.b.u), lt = et(Se.b.v), at = Ye.get(Se.i), [rt, St] = at ?? [
          0,
          0
        ], ct = ze && at ? ze instanceof Map ? ze.get(Se.i) : ze[Se.i] : null, [qt, _t] = ct ? Ya(W, ct) : [
          0,
          0
        ];
        if (ct && yt > 0) {
          const An = [
            Ee + rt * qt * yt * 1,
            Ge + St * qt * yt * 1
          ], $t = [
            nt + rt * _t * yt * 1,
            lt + St * _t * yt * 1
          ], tn = qt + _t >= 0 ? "#3fa7d6" : "#d9534f";
          ot("polygon", {
            points: `${Ee},${Ge} ${An[0]},${An[1]} ${$t[0]},${$t[1]} ${nt},${lt}`,
            fill: tn,
            "fill-opacity": 0.38,
            stroke: tn,
            "stroke-width": 1.2
          }), it.push({
            x: An[0] + rt * 12,
            y: An[1] + St * 12,
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
          x1: Ee,
          y1: Ge,
          x2: nt,
          y2: lt,
          stroke: "#e6ecf5",
          "stroke-width": 2.2,
          "stroke-linecap": "round"
        }), C.has(Se.i) && ot("line", {
          x1: Ee,
          y1: Ge,
          x2: nt,
          y2: lt,
          stroke: "#e6c463",
          "stroke-width": 5,
          "stroke-linecap": "round"
        });
        const Xt = ot("line", {
          x1: Ee,
          y1: Ge,
          x2: nt,
          y2: lt,
          stroke: "transparent",
          "stroke-width": 14,
          style: "cursor:pointer;pointer-events:stroke"
        });
        Xt.addEventListener("click", () => J(Se.i));
        const Jt = document.createElementNS(Pe, "title");
        Jt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", Xt.appendChild(Jt);
      }
      for (const Se of st) for (const Ee of [
        Se.a,
        Se.b
      ]) g.plano !== "XY" && Math.abs(Ee.v - ce) < Zn && ot("rect", {
        x: Ve(Ee.u) - 6,
        y: et(Ee.v),
        width: 12,
        height: 7,
        fill: "#b03a3a"
      });
      const Xe = [];
      it.sort((Se, Ee) => Ee.peso - Se.peso);
      for (const Se of it) Se.peso < 0.02 * Oe || Xe.some((Ee) => Math.hypot(Ee.x - Se.x, Ee.y - Se.y) < 34) || (Xe.push(Se), ot("text", {
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
      const Ke = W ? qr[W] ?? W : "sin resultado";
      H.textContent = `${Ke} \xB7 ${g.plano === "XY" ? "planta" : "alzado"} ${g.plano} en ${j} = ${g.en.toFixed(2)} m`, q.textContent = W ? `${st.length} barras en el plano \xB7 m\xE1ximo ${Zt(Oe)} ${Kr[W] ?? ""}` + (ln ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ut ? ` \xB7 ${ut} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
    }
    const P = () => {
      try {
        M();
      } catch {
      }
    };
    (c == null ? void 0 : c.frameResults) && ((_b = (_a = window.van) == null ? void 0 : _a.derive) == null ? void 0 : _b.call(_a, () => {
      c.frameResults.val, P();
    }));
    let F = null;
    setInterval(() => {
      var _a2, _b2;
      const C = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal, N = (_b2 = c == null ? void 0 : c.frameResults) == null ? void 0 : _b2.rawVal, H = [
        C,
        N
      ];
      if (!(F && F[0] === C && F[1] === N)) {
        F = H, P();
        try {
          re();
        } catch {
        }
      }
    }, 400);
    let B = null, ae = -1, V = "12";
    function ie(C) {
      var _a2, _b2;
      const N = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], H = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], q = /* @__PURE__ */ new Map();
      H.forEach((j, O) => {
        if (j.length === 2) for (const W of j) q.has(W) || q.set(W, []), q.get(W).push(O);
      });
      const oe = (j) => {
        const O = N[H[j][0]], W = N[H[j][1]], le = [
          W[0] - O[0],
          W[1] - O[1],
          W[2] - O[2]
        ], we = Math.hypot(le[0], le[1], le[2]) || 1;
        return le.map((ze) => ze / we);
      }, D = (j, O) => {
        const W = oe(j), le = oe(O);
        return Math.abs(W[0] * le[0] + W[1] * le[1] + W[2] * le[2]) > 0.9999;
      }, de = [
        C
      ];
      for (const j of [
        0,
        1
      ]) {
        let O = C, W = H[C][j];
        for (let le = 0; le < 500; le++) {
          const we = (q.get(W) ?? []).filter((Fe) => Fe !== O);
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
      ae = C, B || (B = document.createElement("div"), B.id = "hk-diagrama-barra", B.style.cssText = [
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
        B.hidden = true, T(), M();
      }), B.querySelector(".hk-b-k").addEventListener("click", () => {
        ae >= 0 && ue(ae);
      }), B.querySelector(".hk-b-pl").addEventListener("change", (N) => {
        V = N.target.value, re();
      })), B.hidden = false, T(), re(), M();
    }
    function T() {
      if (!m || !B) return;
      const C = window.innerWidth, N = Math.min(560, Math.round(C * 0.4));
      B.style.width = N + "px", !B.hidden && !m.hidden ? (m.style.transform = "none", m.style.left = "12px", m.style.width = C - N - 36 + "px", B.style.top = m.getBoundingClientRect().top + "px") : m.hidden || (m.style.left = "50%", m.style.transform = "translateX(-50%)", m.style.width = "min(900px,92vw)");
    }
    function re() {
      var _a2, _b2, _c;
      if (!B || B.hidden || ae < 0) return;
      const C = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], N = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], H = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
      if (!N[ae]) return;
      const q = ie(ae), oe = [];
      let D = 0, de = -1;
      q.forEach((Z, ce) => {
        const [fe, me] = N[Z], ke = ce === 0 ? q.length > 1 && N[q[1]].includes(fe) : fe !== de, $e = ke ? me : fe, Ae = ke ? fe : me, Le = Math.hypot(C[Ae][0] - C[$e][0], C[Ae][1] - C[$e][1], C[Ae][2] - C[$e][2]);
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
        const fe = H[Z], me = fe ? fe instanceof Map ? fe.get(ce.e) : fe[ce.e] : null;
        return me ? Ya(Z, me)[ce.fin] : 0;
      }, W = C[N[q[0]][0]], le = (Z) => Z.toFixed(2);
      B.querySelector(".hk-b-tit").textContent = "L = " + j.toFixed(2) + " m \xB7 " + q.length + " tramo(s) \xB7 desde (" + le(W[0]) + ", " + le(W[1]) + ", " + le(W[2]) + ")";
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
      const Fe = Math.max(300, ze.clientWidth), tt = 124, st = 46, Ue = (tt - 14) / 2;
      for (const [Z, ce, fe, me] of we) {
        const ke = oe.map((Oe) => O(Z, Oe)), $e = Math.max(...ke), Ae = Math.min(...ke), Le = Math.max(Math.abs($e), Math.abs(Ae)) || 1, je = (Oe) => st + Oe / (j || 1) * (Fe - 2 * st), We = (Oe) => Ue + (me ? 1 : -1) * (Oe / Le) * (Ue - 16), Ve = (Oe) => Math.abs(Oe) >= 100 ? Oe.toFixed(1) : Math.abs(Oe) >= 10 ? Oe.toFixed(2) : Oe.toFixed(3);
        let et = je(0) + "," + Ue + " ";
        oe.forEach((Oe, en) => {
          et += je(Oe.x) + "," + We(ke[en]) + " ";
        }), et += je(j) + "," + Ue;
        const Pe = ke.indexOf($e), ot = ke.indexOf(Ae), Ye = (Oe, en) => {
          const yt = We(ke[Oe]) + (We(ke[Oe]) < Ue ? -5 : 13);
          return '<text x="' + je(oe[Oe].x) + '" y="' + yt + '" text-anchor="middle" fill="' + en + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Ve(ke[Oe]) + "</text>";
        }, ut = me ? "#d9534f" : "#3fa7d6";
        ze.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + ce + ' <span style="color:#6f7d90;font-weight:400">(' + fe + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Ve($e) + " \xB7 m\xEDn " + Ve(Ae) + (me ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + Fe + '" height="' + tt + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + st + '" y1="' + Ue + '" x2="' + (Fe - st) + '" y2="' + Ue + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + et + '" fill="' + ut + '" fill-opacity=".35" stroke="' + ut + '" stroke-width="1.4"/>' + Ye(0, "#f2f5fa") + Ye(oe.length - 1, "#f2f5fa") + (Pe > 0 && Pe < oe.length - 1 ? Ye(Pe, "#8fd3ff") : "") + (ot > 0 && ot < oe.length - 1 && ot !== Pe ? Ye(ot, "#ff9f9a") : "") + '<text x="' + st + '" y="' + (tt - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (Fe - st) + '" y="' + (tt - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + j.toFixed(2) + " m</text></svg>");
      }
    }
    window.__hekatanDiagramaBarra = J;
    function ue(C) {
      const { nombre: N, texto: H } = Ts(t, C), q = URL.createObjectURL(new Blob([
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
      return N && ue(C), Ts(t, C);
    };
    function xe(C, N, H) {
      const q = (D) => Math.abs(D) < 1e-12 ? "0" : Math.abs(D) >= 1e5 || Math.abs(D) < 0.01 ? D.toExponential(4) : D.toPrecision(6), oe = C.map((D, de) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${N[de]}</th>` + D.map((j) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(j) < 1e-12 ? "#4a5568" : j < 0 ? "#ff9f9a" : "#e6edf5"}">${q(j)}</td>`).join("") + "</tr>").join("");
      return `<div style="overflow-x:auto;padding:4px 8px 10px"><div style="color:${H};font-weight:600;padding:6px 2px">${N === Me ? "FLEXI\xD3N \u2014 [w, \u03B81, \u03B82] \xD7 4" : "MEMBRANA \u2014 [u1, u2, \u03B83] \xD7 4"}</div><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${N.map((D) => `<th style="color:#9fb0c6;padding:2px 6px">${D}</th>`).join("")}</tr>${oe}</table></div>`;
    }
    const Me = [
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
    function se(C) {
      var _a2, _b2, _c, _d, _e;
      const N = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], q = (((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [])[C];
      if (!q || q.length !== 4) {
        alert("La K de pa\xF1o de esta pantalla es la del Q4 (4 nudos).");
        return;
      }
      const oe = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, D = (ze, Fe = 0) => {
        var _a3, _b3;
        return ((_b3 = (_a3 = oe[ze]) == null ? void 0 : _a3.get) == null ? void 0 : _b3.call(_a3, C)) ?? Fe;
      }, de = D("elasticities"), j = D("poissonsRatios", 0.2), O = D("thicknesses");
      let W;
      try {
        W = $s(q.map((ze) => N[ze]), de, j, O, {
          tipoPlaca: D("plateFormulations", 0),
          tipoDrill: D("drillingTypes", 12),
          gammaFac: D("drillingPenaltyScales", 0.4)
        });
      } catch (ze) {
        alert(String(ze));
        return;
      }
      ne || ee();
      const le = (_e = (_d = oe.shellModifiers) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, C), we = Array.isArray(le) && le.some((ze) => ze !== 1) ? ` \xB7 <b style="color:#f59e0b">modificadores ${le.join("/")} aplicados</b>` : "";
      ne.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 pa\xF1o ${C + 1}</b><span style="color:#9fb0c6">${W.formulacion} \xB7 \xE1rea ${W.area.toFixed(4)} m\xB2 \xB7 t = ${O} m \xB7 E = ${de} \xB7 \u03BD = ${j}${we}</span><button class="hk-k-x" style="margin-left:auto;background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="padding:4px 10px;color:#6f7d90">ejes del elemento \xB7 e1 = ${W.ex.map((ze) => ze.toFixed(3)).join(", ")} \xB7 e2 = ${W.ey.map((ze) => ze.toFixed(3)).join(", ")} \xB7 e3 = ${W.ez.map((ze) => ze.toFixed(3)).join(", ")}</div>` + xe(W.flexion, Me, "#8fd3ff") + (W.membrana ? xe(W.membrana, Q, "#9be59b") : `<div style="padding:8px 10px;color:#f59e0b">La membrana de este pa\xF1o no es la ITW (drilling ${D("drillingTypes", 12)}): no se ense\xF1a una matriz que no es la suya.</div>`), ne.querySelector(".hk-k-x").addEventListener("click", () => {
        ne.hidden = true;
      }), ne.hidden = false;
    }
    window.__hekatanKPano = (C) => {
      var _a2, _b2, _c;
      const N = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], H = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], q = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, oe = (D, de = 0) => {
        var _a3, _b3;
        return ((_b3 = (_a3 = q[D]) == null ? void 0 : _a3.get) == null ? void 0 : _b3.call(_a3, C)) ?? de;
      };
      return $s((H[C] ?? []).map((D) => N[D]), oe("elasticities"), oe("poissonsRatios", 0.2), oe("thicknesses"), {
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
      var _a2, _b2, _c, _d, _e;
      Y = C, ee();
      let N;
      try {
        N = Rs(t, C);
      } catch (W) {
        alert(String(W));
        return;
      }
      const H = (W) => Math.abs(W) < 1e-12 ? "0" : Math.abs(W) >= 1e5 || Math.abs(W) < 0.01 ? W.toExponential(4) : W.toPrecision(6), q = ((_a2 = t.elementInputs) == null ? void 0 : _a2.rawVal) ?? {}, oe = (_c = (_b2 = q.rigidOffsets) == null ? void 0 : _b2.get) == null ? void 0 : _c.call(_b2, C), D = (_e = (_d = q.localAngles) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, C), de = [
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
      ], O = N.K.map((W, le) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${j[le]}</th>` + W.map((we) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(we) < 1e-12 ? "#4a5568" : we < 0 ? "#ff9f9a" : "#e6edf5"}">${H(we)}</td>`).join("") + "</tr>").join("");
      ne.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${C + 1}</b><span style="color:#9fb0c6">L = ${N.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${N.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${N.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)${de ? ` \xB7 <b style="color:#f59e0b">${de}</b>` : ""}</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${j.map((W) => `<th style="color:#9fb0c6;padding:2px 6px">${W}</th>`).join("")}</tr>${O}</table></div>`, ne.querySelector(".hk-k-x").addEventListener("click", () => {
        ne.hidden = true;
      }), ne.querySelector(".hk-k-m").addEventListener("click", () => ue(Y)), ne.hidden = false;
    }
    return window.addEventListener("hk:model-selection", (C) => {
      var _a2;
      const N = (_a2 = C.detail) == null ? void 0 : _a2.ultimo;
      te || (te = document.createElement("button"), te.id = "hk-klocal-chip", te.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(te), te.addEventListener("click", () => {
        const H = Number(te.dataset.idx);
        H >= 0 && (te.dataset.tipo === "shell" ? se : G)(H);
      })), te.hidden = true, N && (N.type === "frame" || N.type === "shell") && (te.dataset.idx = String(N.idx), te.dataset.tipo = N.type, te.textContent = N.type === "shell" ? "\u{1F4D0} Ver K local \xB7 pa\xF1o " + (N.idx + 1) : "\u{1F4D0} Ver K local \xB7 barra " + (N.idx + 1), ne && (ne.hidden = true), te.hidden = false);
    }), window.__hekatanKLocal = (C) => Rs(t, C), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = z, {
      abrir: z,
      abrirBarra: J
    };
  }
  Bs = function(t, c = 8) {
    const m = document.createElement("div");
    m.id = "legend", m.style.setProperty("--legend-n", String(c)), setTimeout(() => {
      ve.derive(() => {
        ca.val, m.style.background = sr();
      });
    });
    const g = document.createElement("div");
    g.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", m.appendChild(g), setTimeout(() => {
      ve.derive(() => {
        g.textContent = Xa.val ? `[${Xa.val}]` : "";
      });
    });
    const v = Array.from({
      length: c + 1
    }, (M, P) => P / c).reverse();
    let A, z;
    v.forEach((M, P) => {
      A = document.createElement("div"), A.id = `marker-${P}`, A.className = "marker", A.style.marginTop = P == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", z = document.createElement("p"), z.id = `marker-text-${P}`, A.append(z), m.append(A);
    });
    const S = [];
    return m.querySelectorAll("p").forEach((M) => S.push(M)), setTimeout(() => {
      ve.derive(() => {
        v.forEach((M, P) => {
          const F = S[P];
          F && (F.innerText = Wr(t.val, M).toString());
        });
      });
    }), m;
  };
  function Wr(t, c) {
    const m = Fo.val;
    if (m) return Ds(m[0] + c * (m[1] - m[0]));
    const g = t.filter((z) => Number.isFinite(z));
    if (g.length === 0) return "0";
    const [v, A] = Ua(g);
    return Ds(v + c * (A - v));
  }
  function Ds(t) {
    if (!Number.isFinite(t)) return "\u2014";
    if (t === 0) return "0";
    const c = Math.abs(t);
    return c < 1e-3 || c >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
  }
  ul = function({ mesh: t, settingsObj: c, drawingObj: m, objects3D: g, solids: v }) {
    Wi.DEFAULT_UP = new R(0, 0, 1);
    const A = document.createElement("div"), z = new qi(), S = new Ki(45, 1, 0.1, 2 * 1e6), M = new Gi(-10, 10, 10, -10, -1e3, 2e6);
    let P = S;
    const F = new Hi({
      antialias: true
    });
    F.localClippingEnabled = true;
    const B = new Fs(S, F.domElement);
    B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.keyPanSpeed = 12, B.listenToKeyEvents(window), B.mouseButtons = {
      LEFT: null,
      MIDDLE: Es.ROTATE,
      RIGHT: Es.PAN
    }, B.touches = {
      ONE: jo.ROTATE,
      TWO: jo.DOLLY_PAN
    }, F.domElement.addEventListener("wheel", (Z) => {
      if (!Z.ctrlKey && Math.abs(Z.deltaX) > Math.abs(Z.deltaY) * 1.5) {
        Z.preventDefault();
        const ce = B.target, fe = new R().subVectors(S.position, ce), me = new R();
        me.crossVectors(S.up, fe).normalize();
        const $e = fe.length() * 1e-3 * B.panSpeed;
        ce.addScaledVector(me, Z.deltaX * $e), S.position.addScaledVector(me, Z.deltaX * $e), B.update();
      }
    }, {
      passive: false
    });
    const ae = new Co(new R(-1, 0, 0), 0), V = new Co(new R(0, -1, 0), 0), ie = new Co(new R(0, 0, -1), 0);
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
      Z.enableX && (ae.normal.set(Z.invertX ? 1 : -1, 0, 0), ae.constant = Z.invertX ? -Z.posX : Z.posX, ce.push(ae)), Z.enableY && (V.normal.set(0, Z.invertY ? 1 : -1, 0), V.constant = Z.invertY ? -Z.posY : Z.posY, ce.push(V)), Z.enableZ && (ie.normal.set(0, 0, Z.invertZ ? 1 : -1), ie.constant = Z.invertZ ? -Z.posZ : Z.posZ, ce.push(ie)), F.clippingPlanes = ce, z.traverse((me) => {
        const ke = me;
        if (ke.material) {
          const $e = Array.isArray(ke.material) ? ke.material : [
            ke.material
          ];
          for (const Ae of $e) Ae.clippingPlanes = ce, Ae.needsUpdate = true;
        }
      });
      const fe = window.__hekatanPanes ?? [];
      for (const me of fe) try {
        me && typeof me.refresh == "function" && me.refresh();
      } catch {
      }
      F.render(z, P);
    }
    J(), window.__hekatanClipApply = J;
    const T = lr(c), re = ve.derive(() => Math.pow(10, T.displayScale.val / 10)), ue = Jr(t, T), xe = () => {
      const Z = [];
      return T.gridXY.rawVal && Z.push("xy"), T.gridXZ.rawVal && Z.push("xz"), T.gridYZ.rawVal && Z.push("yz"), Z;
    }, Me = () => {
      const Z = T.gridStep.rawVal, ce = Math.max(Z, T.gridMajor.rawVal);
      return {
        planes: xe(),
        majorStep: ce,
        minorStep: Z
      };
    };
    let Q = Ta(T.gridSize.rawVal, Me());
    Q.visible = T.gridVisible.rawVal, window.__hekatanSnap2D = T.cursorSnap.rawVal;
    const se = () => {
      const Z = Math.max(0, Math.min(1, T.gridOpacity.rawVal));
      Q.traverse((ce) => {
        const fe = ce.material;
        if (!fe || !("opacity" in fe)) return;
        const me = ce.name ?? "";
        let ke = 0.55;
        me.includes("border") ? ke = 1 : me.includes("major") && (ke = 0.95), fe.opacity = Z * ke;
      });
    };
    se(), A.appendChild(rr(T, t, v)), A.setAttribute("id", "viewer"), A.appendChild(F.domElement), F.setPixelRatio(window.devicePixelRatio);
    const te = to();
    F.setClearColor(te.background, 1);
    const ne = T.gridSize.rawVal, Y = ne * 0.5 + ne * 0.5 / Math.tan(45 * 0.5);
    S.position.set(0, 0, Y), S.up.set(0, 1, 0), B.target.set(0, 0, 0), B.minDistance = 0.1, B.maxDistance = 1e4, A.__settings = T, B.zoomSpeed = 1, B._getZoomScale = function() {
      return Math.pow(0.95, this.zoomSpeed);
    }, B.update();
    let ee = Vs(T.gridSize.rawVal, T.flipAxes.rawVal);
    z.add(Q, ee), ve.derive(() => {
      window.__hekatanGridPlaneXY = T.gridXY.val, window.__hekatanGridPlaneXZ = T.gridXZ.val, window.__hekatanGridPlaneYZ = T.gridYZ.val;
    });
    let G = true;
    ve.derive(() => {
      const Z = T.gridVisible.val;
      if (G) {
        G = false;
        return;
      }
      Q.visible = Z, j();
    });
    let C = true;
    ve.derive(() => {
      if (T.gridOpacity.val, C) {
        C = false;
        return;
      }
      se(), j();
    }), ve.derive(() => {
      const Z = T.cursorSnap.val;
      window.__hekatanSnap2D = Z;
    });
    let N = true;
    ve.derive(() => {
      var _a, _b, _c;
      const Z = T.gridSize.val, ce = T.flipAxes.val;
      if (T.gridXY.val, T.gridXZ.val, T.gridYZ.val, T.gridStep.val, T.gridMajor.val, N) {
        N = false;
        return;
      }
      z.remove(Q), (_a = Q.traverse) == null ? void 0 : _a.call(Q, ($e) => {
        var _a2, _b2, _c2, _d;
        (_b2 = (_a2 = $e.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = $e.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
      }), Q = Ta(Z, Me()), Q.visible = T.gridVisible.rawVal, z.add(Q), se(), z.remove(ee), ee.traverse(($e) => {
        var _a2, _b2, _c2, _d;
        (_b2 = (_a2 = $e.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = $e.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
      }), ee = Vs(Z, ce), z.add(ee);
      const fe = Z * 0.5 + Z * 0.5 / Math.tan(45 * 0.5);
      S.position.distanceTo(B.target);
      const me = Math.abs(S.position.x) < 0.1 && Math.abs(S.position.y) < 0.1 && S.position.z > 0;
      (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (me ? S.position.set(0, 0, fe) : S.position.set(0.5 * Z, -fe, 0.5 * Z), B.target.set(0, 0, 0)), B.minDistance = Math.max(0.05, Z * 0.01), B.maxDistance = Math.max(50, Z * 50), B.update(), j();
    }), new ResizeObserver((Z) => {
      var _a, _b;
      for (const ce of Z) {
        const fe = (_a = ce.target) == null ? void 0 : _a.clientWidth, me = (_b = ce.target) == null ? void 0 : _b.clientHeight;
        if (fe === 0 || me === 0) continue;
        const $e = (q ? fe / 2 : fe) / me;
        S.aspect = $e, S.updateProjectionMatrix();
        const Ae = M.top;
        if (M.left = -Ae * $e, M.right = Ae * $e, M.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = $e, oe.updateProjectionMatrix();
        else if (oe && oe.isOrthographicCamera) {
          const Le = oe, je = Le.top;
          Le.left = -je * $e, Le.right = je * $e, Le.updateProjectionMatrix();
        }
        F.setSize(fe, me), j();
      }
    }).observe(A), B.addEventListener("change", j), ve.derive(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      (_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, T.displayScale.val, T.nodes.val, T.elements.val, (_g = T.edges) == null ? void 0 : _g.val, T.elemColumns.val, T.elemBeams.val, T.nodesIndexes.val, T.elementsIndexes.val, T.orientations.val, T.sections.val, T.secColumns.val, T.secBeams.val, T.secFloor.val, T.supports.val, T.loads.val, T.deformedShape.val, T.nodeResults.val, T.frameResults.val, T.shellResults.val, (_h = T.solidResults) == null ? void 0 : _h.val, (_i = T.extruded) == null ? void 0 : _i.val, setTimeout(j);
    });
    let q = false, oe = null, D = null, de = false;
    function j() {
      const Z = A.clientWidth || 1, ce = A.clientHeight || 1;
      if (!q || !oe) {
        F.setScissorTest(false), F.setViewport(0, 0, Z, ce), F.render(z, P);
        return;
      }
      const fe = Z / 2;
      F.setScissorTest(true), F.setViewport(0, 0, fe, ce), F.setScissor(0, 0, fe, ce), F.render(z, P), F.setViewport(fe, 0, fe, ce), F.setScissor(fe, 0, fe, ce), F.render(z, oe), F.setScissorTest(false);
    }
    function O(Z) {
      P = Z, B.object = Z, B.update(), j();
    }
    function W(Z, ce) {
      q = Z, ce && (oe = ce);
      const fe = A.clientWidth || 1, me = A.clientHeight || 1, $e = (Z ? fe / 2 : fe) / me;
      S.isPerspectiveCamera && (S.aspect = $e, S.updateProjectionMatrix());
      const Ae = M.top;
      if (M.left = -Ae * $e, M.right = Ae * $e, M.updateProjectionMatrix(), Z && oe) {
        if (D ? (D.object = oe, D.update()) : (D = new Fs(oe, F.domElement), D.enableDamping = true, D.dampingFactor = 0.1, D.screenSpacePanning = true, D.zoomSpeed = 0.8, D.panSpeed = 1.2, D.rotateSpeed = 0.9, D.touches = {
          ONE: jo.ROTATE,
          TWO: jo.DOLLY_PAN
        }, D.target.copy(B.target), D.addEventListener("change", j), D.enabled = false), !de) {
          const Le = (je) => {
            if (!q || !D) return;
            const We = F.domElement.getBoundingClientRect(), Ve = je.clientX - We.left, et = We.width / 2, Pe = Ve >= et;
            B.enabled = !Pe, D.enabled = Pe;
          };
          F.domElement.addEventListener("pointerdown", Le, true), F.domElement.addEventListener("wheel", Le, {
            capture: true,
            passive: true
          }), de = true;
        }
      } else Z || (B.enabled = true, D && (D.enabled = false));
      A.__splitMode = Z, window.__hekatanSplitMode = Z, window.__hekatanSplitCamera = Z ? oe : null, j();
    }
    if (t) {
      z.add(cr(T, ue, re), Ji(t, T, ue), pr(T, ue, re), fr(t, T, ue, re), dr(t, T, ue, re), ur(t, T, ue, re), wr(t, T, ue, re), xr(t, T, ue, re), vr(t, T, ue), Pr(t, T, ue, re), _r(t, T, ue, re)), window.__hekatanDiagrama2D || (Hr(t, T), F.domElement.addEventListener("dblclick", () => {
        var _a;
        const Le = (_a = T.frameResults) == null ? void 0 : _a.rawVal;
        !Le || Le === "none" || !(window.__hekatanModelSelection ?? []).some((We) => We.type === "frame") || setTimeout(() => {
          var _a2;
          return (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
        }, 60);
      }));
      const Z = Xr({
        scene: z,
        rendererElm: F.domElement,
        getActiveCamera: () => P,
        derivedNodes: ue,
        derivedDisplayScale: re,
        mesh: t,
        settings: T,
        render: j
      });
      z.add(Z);
      const ce = nl(t, T), fe = Cr(t, T, ue, ce), me = Bs(ce);
      z.add(fe), A.appendChild(me);
      const ke = Vr(t, T, ue);
      z.add(ke);
      const $e = ke.__colorMapValues, Ae = Bs($e);
      Ae.id = "frame-legend", A.appendChild(Ae), ve.derive(() => {
        var _a;
        const Le = T.shellResults.val != "none", je = (((_a = T.solidResults) == null ? void 0 : _a.val) ?? "none") !== "none", We = Le || je, Ve = T.frameResults.val.startsWith("contour:"), et = ce.val.some((Pe) => Number.isFinite(Pe));
        me.hidden = !We || !et, fe.visible = We, Ae.hidden = !Ve;
      });
    }
    if (v) {
      const Z = new Zs(16777215, 0.5);
      z.add(Z);
      const ce = new ia(16777215, 0.5);
      ce.position.set(30, 25, -10), ce.shadow.mapSize.width = 1024, ce.shadow.mapSize.height = 1024, z.add(ce);
      const fe = 10;
      ce.shadow.camera.left = -fe, ce.shadow.camera.right = fe, ce.shadow.camera.top = fe, ce.shadow.camera.bottom = -fe, ce.shadow.camera.far = 1e3;
      const me = new ia(16777215, 0.5);
      me.color.setHSL(11, 43, 96), me.position.set(-10, 0, 30), z.add(me), ve.derive(() => {
        (v == null ? void 0 : v.val.length) && (z.remove(...v.oldVal), z.add(...v.rawVal), j());
      }), ve.derive(() => {
        v.rawVal.forEach((ke) => ke.visible = T.solids.val), j();
      });
    }
    if (g) {
      const Z = [], ce = (me) => {
        var _a;
        return ((_a = me == null ? void 0 : me.userData) == null ? void 0 : _a.isCota) ? T.showCotas.val : T.custom3D.val;
      }, fe = () => {
        for (const me of Z) me.visible = ce(me);
        j();
      };
      ve.derive(() => {
        const me = g.val;
        Z.length && (z.remove(...Z), Z.length = 0), me.length && (z.add(...me), Z.push(...me), fe(), F.clippingPlanes.length && J()), j();
      }), ve.derive(() => {
        T.custom3D.val, fe();
      }), ve.derive(() => {
        T.showCotas.val, fe();
      });
    }
    m && zr({
      drawingObj: m,
      gridObj: Q,
      scene: z,
      getActiveCamera: () => P,
      controls: B,
      gridSize: ne,
      derivedDisplayScale: re,
      rendererElm: F.domElement,
      viewerRender: j
    }), Ys((Z, ce) => {
      var _a;
      F.setClearColor(ce.background, 1), z.remove(Q), (_a = Q.traverse) == null ? void 0 : _a.call(Q, (fe) => {
        var _a2, _b, _c, _d;
        (_b = (_a2 = fe.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = fe.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      }), Q = Ta(T.gridSize.rawVal, {
        planes: xe()
      }), z.add(Q), A.style.setProperty("--awatif-legend-color", ce.legendMarker), j();
    });
    const le = {
      scene: z,
      perspCamera: S,
      orthoCamera: M,
      get camera() {
        return P;
      },
      controls: B,
      renderer: F,
      rendererElm: F.domElement,
      render: j,
      setActiveCamera: O,
      setSplitMode: W,
      get splitMode() {
        return q;
      },
      get splitCamera() {
        return oe;
      },
      settings: T
    };
    A.__ctx = le;
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
    const ze = (Z, ce, fe) => {
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
        ke.preventDefault(), fe();
      }, me;
    }, Fe = (Z, ce) => {
      const fe = B.target, me = new R().subVectors(P.position, fe), ke = me.length(), $e = new R(), Ae = new R();
      $e.crossVectors(P.up, me).normalize(), Ae.copy(P.up).normalize();
      const Le = ke * 0.05;
      fe.addScaledVector($e, -Z * Le), fe.addScaledVector(Ae, ce * Le), P.position.addScaledVector($e, -Z * Le), P.position.addScaledVector(Ae, ce * Le), B.update(), j();
    }, tt = (Z) => {
      const ce = new R().subVectors(P.position, B.target);
      ce.multiplyScalar(Z), P.position.copy(B.target).add(ce), B.update(), j();
    }, st = () => {
      const Z = document.createElement("div");
      return Z.style.cssText = "width:32px;height:32px;", Z;
    };
    return we.append(st()), we.append(ze("\u2191", "Pan arriba", () => Fe(0, 1))), we.append(ze("\u2295", "Zoom in", () => tt(0.85))), we.append(ze("\u2190", "Pan izquierda", () => Fe(-1, 0))), we.append(ze("\u2302", "Reset vista", () => {
      B.reset(), j();
    })), we.append(ze("\u2192", "Pan derecha", () => Fe(1, 0))), we.append(ze("\u2296", "Zoom out", () => tt(1.18))), we.append(ze("\u2193", "Pan abajo", () => Fe(0, -1))), we.append(st()), getComputedStyle(A).position === "static" && (A.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && A.appendChild(we), A;
  };
  function Jr(t, c) {
    return ve.derive(() => {
      var _a, _b, _c, _d;
      if (!c.deformedShape.val) return ((_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val) ?? [];
      const m = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], g = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
      if (!g || m.length === 0) return m;
      const v = c.deformScale.val, A = c.deformScale.val * c.deformScaleZ.val, z = Number.isFinite(v) ? v : 1, S = Number.isFinite(A) ? A : 1;
      return m.map((M, P) => {
        var _a2;
        const F = ((_a2 = g.get(P)) == null ? void 0 : _a2.slice(0, 3)) ?? [
          0,
          0,
          0
        ], B = Number.isFinite(F[0]) ? F[0] : 0, ae = Number.isFinite(F[1]) ? F[1] : 0, V = Number.isFinite(F[2]) ? F[2] : 0;
        return [
          M[0] + B * z,
          M[1] + ae * z,
          M[2] + V * S
        ];
      });
    });
  }
  let Fo, Xa, el, Ns, tl;
  Fo = ve.state(null);
  Xa = ve.state("");
  Qr = ve.state("kN");
  Or = ve.state("mm");
  jr = ve.state("kN/m\xB2");
  el = {
    kN: 1,
    tonf: 9.80665,
    kip: 4.4482216
  };
  Ns = {
    mm: 1e3,
    cm: 100,
    m: 1,
    in: 39.3700787402,
    ft: 3.280839895
  };
  tl = {
    "kN/m\xB2": 1,
    kPa: 1,
    MPa: 1 / 1e3,
    GPa: 1 / 1e6,
    "kgf/cm\xB2": 1 / 98.0665,
    "tonf/m\xB2": 1 / 9.80665,
    psi: 1 / 6.89476,
    ksi: 1 / 6894.76
  };
  function nl(t, c) {
    const m = ve.state([]);
    let g;
    return ((v) => {
      v.bendingXX = "bendingXX", v.bendingYY = "bendingYY", v.bendingXY = "bendingXY", v.membraneXX = "membraneXX", v.membraneYY = "membraneYY", v.membraneXY = "membraneXY", v.tranverseShearX = "tranverseShearX", v.tranverseShearY = "tranverseShearY", v.membranePrincipalMax = "membranePrincipalMax", v.membranePrincipalMin = "membranePrincipalMin", v.bendingPrincipalMax = "bendingPrincipalMax", v.bendingPrincipalMin = "bendingPrincipalMin", v.transverseShearMax = "transverseShearMax", v.vonMises = "vonMises", v.pressure = "pressure", v.displacementX = "displacementX", v.displacementY = "displacementY", v.displacementZ = "displacementZ";
    })(g || (g = {})), ve.derive(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r2, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
      const v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), ie = (Z, ce) => {
        Z == null ? void 0 : Z.forEach((fe, me) => {
          const ke = t.elements.val[me];
          if (ke) for (let $e = 0; $e < ke.length; $e++) ce.set(ke[$e], [
            fe[$e] ?? fe[0]
          ]);
        });
      };
      ie((_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.bendingXX, v), ie((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, A), ie((_f = (_e = t.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, z), ie((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, S), ie((_j = (_i = t.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, M), ie((_l = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, P), ie((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, F), ie((_p = (_o = t.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, B), ie((_r2 = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r2.vonMises, ae), ie((_t = (_s2 = t.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, V);
      const J = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), Me = (Z, ce, fe, me, ke) => {
        Z.forEach(($e, Ae) => {
          var _a2, _b2;
          const Le = $e[0] ?? 0, je = ((_a2 = ce.get(Ae)) == null ? void 0 : _a2[0]) ?? 0, We = ((_b2 = fe.get(Ae)) == null ? void 0 : _b2[0]) ?? 0, Ve = (Le + je) / 2, et = Math.hypot((Le - je) / 2, We);
          me.set(Ae, [
            Ve + et
          ]), ke.set(Ae, [
            Ve - et
          ]);
        });
      };
      Me(S, M, P, J, T), Me(v, A, z, re, ue), F.forEach((Z, ce) => {
        var _a2;
        xe.set(ce, [
          Math.hypot(Z[0] ?? 0, ((_a2 = B.get(ce)) == null ? void 0 : _a2[0]) ?? 0)
        ]);
      });
      const Q = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, se = (_w = c.solidResults) == null ? void 0 : _w.val, ne = se && se !== "none" ? se : c.shellResults.val, Y = Q == null ? void 0 : Q[ne], ee = {
        bendingXX: [
          v,
          0
        ],
        bendingYY: [
          A,
          0
        ],
        bendingXY: [
          z,
          0
        ],
        membraneXX: [
          S,
          0
        ],
        membraneYY: [
          M,
          0
        ],
        membraneXY: [
          P,
          0
        ],
        tranverseShearX: [
          F,
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
          T,
          0
        ],
        bendingPrincipalMax: [
          re,
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
          ae,
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
      }, G = c.shellResults.val, C = Qr.val, N = Or.val, H = G === "displacementX" || G === "displacementY" || G === "displacementZ", q = G === "bendingXX" || G === "bendingYY" || G === "bendingXY" || G === "bendingPrincipalMax" || G === "bendingPrincipalMin", oe = G === "membraneXX" || G === "membraneYY" || G === "membraneXY" || G === "membranePrincipalMax" || G === "membranePrincipalMin", D = G === "vonMises" || G === "pressure", de = G === "tranverseShearX" || G === "tranverseShearY" || G === "transverseShearMax", j = (_D = c.solidResults) == null ? void 0 : _D.val, O = j === "vonMises" || j === "sigmaXX" || j === "sigmaYY" || j === "sigmaZZ" || j === "tauXY" || j === "tauYZ" || j === "tauXZ", W = j === "ux" || j === "uy" || j === "uz", le = jr.val, we = O ? tl[le] : W || H ? Ns[N] : q || oe || D || de ? 1 / el[C] : 1, ze = O ? le : W || H ? N : q ? `${C}\xB7m/m` : oe ? `${C}/m\xB2` : D ? `${C}/m\xB2` : de ? `${C}/m` : "";
      Xa.val = ze, Fo.val = Array.isArray(Y) && Y.length === 2 ? [
        Y[0] * we,
        Y[1] * we
      ] : null;
      const Fe = Qs.val, st = j && j !== "none" ? [
        ae,
        0
      ] : ee[G], Ue = [];
      if (t.nodes.val.forEach((Z, ce) => {
        const fe = st;
        if (!fe || !fe[0] || typeof fe[0].has != "function") return;
        if (!fe[0].has(ce)) {
          Ue.push(Number.NaN);
          return;
        }
        const me = fe[0].get(ce), ke = me ? me[fe[1]] ?? 0 : 0;
        Ue.push(ke * we);
      }), !Fo.val && Fe !== "auto") {
        const Z = t.nodes.val, ce = /* @__PURE__ */ new Set(), fe = (ke, $e) => {
          var _a2;
          const Ae = (_a2 = Z[ke[0]]) == null ? void 0 : _a2[$e];
          return ke.every((Le) => {
            var _a3;
            return Math.abs((((_a3 = Z[Le]) == null ? void 0 : _a3[$e]) ?? NaN) - Ae) < 1e-6;
          });
        };
        for (const ke of t.elements.val) {
          if (ke.length !== 4) continue;
          const $e = fe(ke, 2), Ae = !$e && fe(ke, 0), Le = !$e && fe(ke, 1);
          if (Fe === "losas" ? $e : Fe === "muros" ? Ae || Le : Fe === "murosX" ? Ae : Fe === "murosY" ? Le : false) for (const Ve of ke) ce.add(Ve);
        }
        const me = [];
        for (const ke of ce) {
          const $e = Ue[ke];
          Number.isFinite($e) && me.push($e);
        }
        me.length && (Fo.val = Ua(me));
      }
      m.val = Ue;
    }), m;
  }
});
export {
  __tla,
  ir as a,
  Bs as b,
  Qr as c,
  or as d,
  nr as e,
  Or as f,
  ul as g,
  jr as h,
  dl as i,
  ll as j,
  $s as k,
  cl as l
};
