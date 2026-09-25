import { a as xe } from "./analyze-CWJH9Nzr.js";
import { d as Me, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
import { s as ge, __tla as __tla_1 } from "./secantPlasticity-Da1qmwOo.js";
import { c as se } from "./colorMapPercentile-OnF3uP-w.js";
import { c as ie, e as Z, M as B, L as ye, E as ve, b as Pe, C as Q, R as $e, f as ce, D as re } from "./Text-Br8EG2up.js";
let Se;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  Se = {
    id: "placa-base",
    name: "Placa base anclada (AISC 360-22 \xA7J8 + ACI 318)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F529} Conexiones",
    hasModal: false,
    defaultShellResult: "vonMises",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
    ],
    params: {
      B: {
        default: 0.5,
        min: 0.25,
        max: 1.2,
        step: 0.02,
        label: "B placa (m, eje X)",
        folder: "Placa"
      },
      H: {
        default: 0.5,
        min: 0.25,
        max: 1.2,
        step: 0.02,
        label: "H placa (m, eje Y)",
        folder: "Placa"
      },
      t_plate: {
        default: 0.025,
        min: 0.012,
        max: 0.06,
        step: 2e-3,
        label: "Espesor placa (m)",
        folder: "Placa"
      },
      d_col: {
        default: 0.3,
        min: 0.18,
        max: 0.5,
        step: 0.02,
        label: "d columna (m)",
        folder: "Columna"
      },
      bf_col: {
        default: 0.25,
        min: 0.15,
        max: 0.4,
        step: 0.01,
        label: "bf columna (m)",
        folder: "Columna"
      },
      tf_col: {
        default: 0.022,
        min: 0.012,
        max: 0.04,
        step: 2e-3,
        label: "tf (m)",
        folder: "Columna"
      },
      tw_col: {
        default: 0.014,
        min: 8e-3,
        max: 0.025,
        step: 1e-3,
        label: "tw (m)",
        folder: "Columna"
      },
      L_col_stub: {
        default: 0.5,
        min: 0.3,
        max: 1,
        step: 0.05,
        label: "L col stub (m)",
        folder: "Columna"
      },
      bolt_layout: {
        default: 4,
        label: "Disposici\xF3n pernos",
        options: {
          "4 (2\xD72)": 4,
          "6 (3\xD72)": 6,
          "8 (4\xD72)": 8,
          "9 (3\xD73)": 9
        },
        folder: "Pernos",
        regenOnChange: true
      },
      d_bolt: {
        default: 0.024,
        min: 0.012,
        max: 0.05,
        step: 2e-3,
        label: "\xD8 perno (m)",
        folder: "Pernos"
      },
      d_hole: {
        default: 0.036,
        min: 0.02,
        max: 0.08,
        step: 2e-3,
        label: "\xD8 orificio (m)",
        folder: "Pernos"
      },
      edge_dist: {
        default: 0.07,
        min: 0.03,
        max: 0.2,
        step: 0.01,
        label: "Dist borde (m)",
        folder: "Pernos"
      },
      L_bolt: {
        default: 0.3,
        min: 0.15,
        max: 0.6,
        step: 0.02,
        label: "L embebido (m)",
        folder: "Pernos"
      },
      B_ped: {
        default: 0.8,
        min: 0.4,
        max: 1.8,
        step: 0.05,
        label: "B pedestal (m)",
        folder: "Pedestal"
      },
      H_ped: {
        default: 0.8,
        min: 0.4,
        max: 1.8,
        step: 0.05,
        label: "H pedestal (m)",
        folder: "Pedestal"
      },
      h_ped: {
        default: 0.5,
        min: 0.3,
        max: 1.5,
        step: 0.05,
        label: "h pedestal (m)",
        folder: "Pedestal"
      },
      Fy_plate: {
        default: 25e4,
        min: 24e4,
        max: 45e4,
        step: 5e3,
        label: "Fy placa (kN/m\xB2)",
        folder: "Material"
      },
      Fu_bolt: {
        default: 83e4,
        min: 6e5,
        max: 103e4,
        step: 1e4,
        label: "Fu perno A307/A449 (kN/m\xB2)",
        folder: "Material"
      },
      E_steel: {
        default: 2e8,
        min: 19e7,
        max: 21e7,
        step: 1e6,
        label: "E (kN/m\xB2)",
        folder: "Material"
      },
      fc: {
        default: 28e3,
        min: 17e3,
        max: 5e4,
        step: 1e3,
        label: "f'c pedestal (kN/m\xB2)",
        folder: "Material"
      },
      Pu: {
        default: 800,
        min: 0,
        max: 5e3,
        step: 25,
        label: "Pu (compresi\xF3n)",
        folder: "Cargas",
        unitType: "force"
      },
      Mu: {
        default: 80,
        min: 0,
        max: 800,
        step: 5,
        label: "Mu (momento)",
        folder: "Cargas",
        unitType: "moment"
      },
      mesh_n: {
        default: 48,
        min: 20,
        max: 80,
        step: 2,
        label: "Divisiones por lado",
        folder: "Malla"
      },
      use_nonlinear: {
        default: 0,
        label: "Solver",
        options: {
          "Lineal (el\xE1stico)": 0,
          "Secante experimental (NO validado)": 1
        },
        folder: "Solver"
      },
      nl_max_iter: {
        default: 12,
        min: 3,
        max: 30,
        step: 1,
        label: "Max iteraciones NL",
        folder: "Solver"
      }
    },
    build(e, c) {
      const i = [], f = [], Y = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), E = e.E_steel / 2.6, q = 7.85, x = (t, a, n) => (i.push([
        t,
        a,
        n
      ]), i.length - 1), P = (t, a, n, o) => {
        for (let l = 0; l < i.length; l++) {
          const s = i[l], u = s[0] - t, h = s[1] - a, m = s[2] - n;
          if (u * u + h * h + m * m < o * o) return l;
        }
        return i.push([
          t,
          a,
          n
        ]), i.length - 1;
      }, M = (t, a, n, o, l) => {
        f.push([
          t,
          a,
          n,
          o
        ]);
        const s = f.length - 1;
        Y.set(s, l), G.set(s, e.E_steel), p.set(s, 0.3), C.set(s, q), z.set(s, 0), A.set(s, 0), N.set(s, 0), k.set(s, 0), H.set(s, E);
      }, $ = ((t) => {
        const a = e.edge_dist, n = e.B / 2 - a, o = e.H / 2 - a;
        return t === 4 ? [
          [
            -n,
            -o
          ],
          [
            +n,
            -o
          ],
          [
            +n,
            +o
          ],
          [
            -n,
            +o
          ]
        ] : t === 6 ? [
          [
            -n,
            -o
          ],
          [
            0,
            -o
          ],
          [
            +n,
            -o
          ],
          [
            -n,
            +o
          ],
          [
            0,
            +o
          ],
          [
            +n,
            +o
          ]
        ] : t === 8 ? [
          [
            -n,
            -o
          ],
          [
            -n / 3,
            -o
          ],
          [
            +n / 3,
            -o
          ],
          [
            +n,
            -o
          ],
          [
            -n,
            +o
          ],
          [
            -n / 3,
            +o
          ],
          [
            +n / 3,
            +o
          ],
          [
            +n,
            +o
          ]
        ] : t === 9 ? [
          [
            -n,
            -o
          ],
          [
            0,
            -o
          ],
          [
            +n,
            -o
          ],
          [
            -n,
            0
          ],
          [
            0,
            0
          ],
          [
            +n,
            0
          ],
          [
            -n,
            +o
          ],
          [
            0,
            +o
          ],
          [
            +n,
            +o
          ]
        ] : [
          [
            -n,
            -o
          ],
          [
            +n,
            -o
          ],
          [
            +n,
            +o
          ],
          [
            -n,
            +o
          ]
        ];
      })(e.bolt_layout), d = e.d_hole / 2, w = Math.max(14, Math.round(e.mesh_n)), F = Math.max(14, Math.round(e.mesh_n)), I = e.B / w, O = e.H / F, g = [];
      for (let t = 0; t <= F; t++) {
        const a = [];
        for (let n = 0; n <= w; n++) {
          let o = -e.B / 2 + n * I, l = -e.H / 2 + t * O, s = false;
          for (const [u, h] of $) {
            const m = o - u, v = l - h, b = Math.sqrt(m * m + v * v);
            if (b < d * 0.35) {
              s = true;
              break;
            }
            if (b < d && b > 1e-9) {
              o = u + m / b * d, l = h + v / b * d;
              break;
            }
          }
          s ? a.push(-1) : a.push(x(o, l, 0));
        }
        g.push(a);
      }
      for (let t = 0; t < F; t++) for (let a = 0; a < w; a++) {
        const n = g[t][a], o = g[t][a + 1], l = g[t + 1][a + 1], s = g[t + 1][a];
        if (n < 0 || o < 0 || l < 0 || s < 0) continue;
        const u = -e.B / 2 + (a + 0.5) * I, h = -e.H / 2 + (t + 0.5) * O;
        let m = false;
        for (const [v, b] of $) if (Math.sqrt((u - v) ** 2 + (h - b) ** 2) < d * 0.95) {
          m = true;
          break;
        }
        m || M(n, o, l, s, e.t_plate);
      }
      e.L_col_stub;
      const r = 6, _ = Math.max(2, Math.round(e.mesh_n / 12)), K = Math.max(I, O) * 0.7, V = +e.d_col / 2 - e.tf_col / 2, T = -e.d_col / 2 + e.tf_col / 2, L = [];
      for (let t = 0; t <= r; t++) {
        const a = t * e.L_col_stub / r, n = [];
        for (let o = 0; o <= _; o++) {
          const l = -e.bf_col / 2 + o * e.bf_col / _;
          t === 0 ? n.push(P(V, l, 0, K)) : n.push(x(V, l, a));
        }
        L.push(n);
      }
      for (let t = 0; t < r; t++) for (let a = 0; a < _; a++) M(L[t][a], L[t][a + 1], L[t + 1][a + 1], L[t + 1][a], e.tf_col);
      const R = [];
      for (let t = 0; t <= r; t++) {
        const a = t * e.L_col_stub / r, n = [];
        for (let o = 0; o <= _; o++) {
          const l = -e.bf_col / 2 + o * e.bf_col / _;
          t === 0 ? n.push(P(T, l, 0, K)) : n.push(x(T, l, a));
        }
        R.push(n);
      }
      for (let t = 0; t < r; t++) for (let a = 0; a < _; a++) M(R[t][a], R[t][a + 1], R[t + 1][a + 1], R[t + 1][a], e.tf_col);
      const S = [], W = 2 + Math.round(e.mesh_n / 16);
      for (let t = 0; t <= r; t++) {
        const a = t * e.L_col_stub / r, n = [];
        for (let o = 0; o <= W; o++) {
          const l = T + (V - T) * (o / W);
          t === 0 ? n.push(P(l, 0, 0, K)) : n.push(x(l, 0, a));
        }
        S.push(n);
      }
      for (let t = 0; t < r; t++) for (let a = 0; a < W; a++) M(S[t][a], S[t][a + 1], S[t + 1][a + 1], S[t + 1][a], e.tw_col);
      const X = /* @__PURE__ */ new Map();
      for (const [t, a] of $) {
        const n = [];
        for (let o = 0; o < i.length; o++) {
          if (Math.abs(i[o][2]) > 1e-4) continue;
          const l = i[o][0] - t, s = i[o][1] - a, u = Math.sqrt(l * l + s * s);
          Math.abs(u - d) < d * 0.15 && n.push({
            idx: o,
            d: u
          });
        }
        for (const o of n) X.set(o.idx, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
      }
      const D = /* @__PURE__ */ new Map(), j = [
        ...L[r],
        ...R[r],
        ...S[r]
      ];
      if (j.length > 0) {
        const t = -e.Pu / j.length, a = e.d_col / 2;
        for (const n of j) {
          const o = i[n][0], l = e.Mu / (j.length * a) * (o > 0 ? 1 : -1);
          D.set(n, [
            0,
            0,
            t + l,
            0,
            0,
            0
          ]);
        }
      }
      c.nodes.val = i, c.elements.val = f, c.nodeInputs.val = {
        supports: X,
        loads: D
      }, c.elementInputs.val = {
        thicknesses: Y,
        elasticities: G,
        poissonsRatios: p,
        densities: C,
        areas: z,
        momentsOfInertiaY: A,
        momentsOfInertiaZ: N,
        torsionalConstants: k,
        shearModuli: H
      };
      try {
        if (e.use_nonlinear > 0.5) {
          const t = ge({
            nodes: i,
            elements: f,
            nodeInputs: {
              supports: X,
              loads: D
            },
            elementInputs: c.elementInputs.val,
            Fy: e.Fy_plate,
            maxIter: Math.round(e.nl_max_iter),
            tol: 0.03,
            softeningFactor: 0.9
          });
          c.deformOutputs.val = t.deformOutputs;
          const a = t.analyzeOutputs, [n, o] = se(a.vonMises, 90, e.Fy_plate);
          a.colorMapRanges = {
            ...a.colorMapRanges,
            vonMises: [
              n,
              o
            ]
          }, c.analyzeOutputs.val = a, c.__nlInfo = {
            iterations: t.iterations,
            converged: t.converged,
            elementsYielded: t.elementsYielded,
            maxRatio: t.maxRatio
          }, console.log(`[placa-base NL] iter=${t.iterations}, converged=${t.converged}, yielded=${t.elementsYielded}, maxRatio=${t.maxRatio.toFixed(2)}`);
        } else {
          c.deformOutputs.val = Me(i, f, {
            supports: X,
            loads: D
          }, c.elementInputs.val);
          const t = xe(i, f, c.elementInputs.val, c.deformOutputs.val), [a, n] = se(t.vonMises, 90, e.Fy_plate);
          t.colorMapRanges = {
            ...t.colorMapRanges,
            vonMises: [
              a,
              n
            ]
          }, c.analyzeOutputs.val = t, c.__nlInfo = null;
        }
      } catch (t) {
        console.error("[placa-base] solver error:", (t == null ? void 0 : t.message) || t), c.deformOutputs.val = {}, c.analyzeOutputs.val = {};
      }
      const y = [], ee = new ie(e.B_ped, e.H_ped, e.h_ped), de = new Z({
        color: 12298888,
        transparent: true,
        opacity: 0.35,
        metalness: 0.1,
        roughness: 0.9
      }), te = new B(ee, de);
      te.position.set(0, 0, -e.h_ped / 2), y.push(te);
      const oe = new ye(new ve(ee), new Pe({
        color: 4473924
      }));
      oe.position.set(0, 0, -e.h_ped / 2), y.push(oe);
      const me = new Z({
        color: 8026746,
        metalness: 0.8,
        roughness: 0.3
      }), ue = new Z({
        color: 3355443,
        metalness: 0.8,
        roughness: 0.3
      });
      for (const [t, a] of $) {
        const n = e.d_bolt * 1, o = e.L_bolt + e.t_plate + n + 0.015, l = new Q(e.d_bolt / 2, e.d_bolt / 2, o, 16), s = new B(l, me);
        s.rotation.x = Math.PI / 2;
        const u = -e.L_bolt + o / 2;
        s.position.set(t, a, u), y.push(s);
        const h = new Q(e.d_bolt * 0.9, e.d_bolt * 0.9, n, 6), m = new B(h, ue);
        m.rotation.x = Math.PI / 2, m.position.set(t, a, e.t_plate + n / 2), y.push(m);
        const v = new Q(e.d_hole / 2 * 1.4, e.d_hole / 2 * 1.4, 4e-3, 20), b = new Z({
          color: 8947848,
          metalness: 0.6,
          roughness: 0.4
        }), J = new B(v, b);
        J.rotation.x = Math.PI / 2, J.position.set(t, a, e.t_plate + 2e-3), y.push(J);
        const be = new $e(d, d * 1.05, 32), pe = new ce({
          color: 16776960,
          side: re
        }), le = new B(be, pe);
        le.position.set(t, a, e.t_plate + 5e-4), y.push(le);
      }
      const _e = Math.sqrt(e.B * e.H), ne = Math.min(_e + 2 * e.h_ped, Math.min(e.B_ped, e.H_ped)), fe = new ie(ne, ne, 2e-3), he = new ce({
        color: 16746496,
        transparent: true,
        opacity: 0.18,
        side: re
      }), ae = new B(fe, he);
      ae.position.set(0, 0, -e.h_ped + 1e-3), y.push(ae), c.objects3D.val = y, console.log(`[Placa Base AISC \xA7J8] Shells=${f.length}, Nodos=${i.length}
  Placa ${e.B}\xD7${e.H}\xD7${e.t_plate}m, Pernos=${e.bolt_layout} \xD8${e.d_bolt * 1e3}mm
  Pedestal ${e.B_ped}\xD7${e.H_ped}\xD7${e.h_ped}m f'c=${e.fc / 1e3} MPa`);
    },
    computedLabels(e, c) {
      const i = c.__nlInfo, f = 0.65, Y = 0.9, G = 0.75, p = e.B * e.H, C = Math.min(e.B_ped * e.H_ped, p * 4), z = Math.min(Math.sqrt(C / p), 2), A = 0.85 * e.fc * p * z, N = f * A, k = Math.max(0, (e.B - 0.95 * e.d_col) / 2), H = Math.max(0, (e.H - 0.8 * e.bf_col) / 2), E = Math.sqrt(e.d_col * e.bf_col) / 4, q = Math.max(k, H, E), x = e.Pu / p, P = q * Math.sqrt(2 * x / (Y * e.Fy_plate)), M = e.t_plate / P, U = e.Mu / Math.max(e.Pu, 1e-3), $ = e.bolt_layout / 2, d = e.H / 2 - e.edge_dist, w = Math.max(0, (e.Mu - e.Pu * d) / (2 * d)), F = w / Math.max($, 1), I = Math.PI * (e.d_bolt / 2) ** 2, O = 0.75 * e.Fu_bolt * I, g = G * O, r = e.Pu / N, _ = F / g;
      return {
        "\u2500\u2500 Geometr\xEDa \u2500\u2500": "",
        "A1 (\xE1rea placa)": `${(p * 1e4).toFixed(0)} cm\xB2`,
        "A2 (\xE1rea pedestal)": `${(C * 1e4).toFixed(0)} cm\xB2`,
        "\u221A(A2/A1)": z.toFixed(2),
        "m (voladizo X)": `${(k * 1e3).toFixed(0)} mm`,
        "n (voladizo Y)": `${(H * 1e3).toFixed(0)} mm`,
        "\u03BBn' (Thornton)": `${(E * 1e3).toFixed(0)} mm`,
        "\u2113 cr\xEDtico": `${(q * 1e3).toFixed(0)} mm`,
        "\u2500\u2500 Aplastamiento concreto AISC \xA7J8 \u2500\u2500": "",
        "Pp (nominal)": `${A.toFixed(0)} kN`,
        "\u03C6Pp (dise\xF1o)": `${N.toFixed(0)} kN`,
        "Pu aplicado": `${e.Pu.toFixed(0)} kN`,
        "Ratio Pu/\u03C6Pp": `${r.toFixed(3)} ${r <= 1 ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Espesor placa AISC DG-1 \u2500\u2500": "",
        "f_p (presi\xF3n)": `${(x / 1e3).toFixed(0)} kPa (${(x / 1e3).toFixed(0)} kN/m\xB2)`,
        "t req.": `${(P * 1e3).toFixed(1)} mm`,
        "t dado": `${(e.t_plate * 1e3).toFixed(1)} mm`,
        "Ratio t/t_req": `${M.toFixed(2)} ${M >= 1 ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Pernos anclaje AISC \xA7J3 / ACI \xA717 \u2500\u2500": "",
        "e = Mu/Pu": `${(U * 1e3).toFixed(0)} mm`,
        "Brazo a pernos": `${(d * 1e3).toFixed(0)} mm`,
        "Tu total (tensi\xF3n neta)": `${w.toFixed(1)} kN`,
        "Tu por perno": `${F.toFixed(1)} kN`,
        A_perno: `${(I * 1e6).toFixed(1)} mm\xB2`,
        "\u03C6Rn perno": `${g.toFixed(1)} kN`,
        "Ratio Tu/\u03C6Rn": `${_.toFixed(3)} ${_ <= 1 ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Dictamen \u2500\u2500": "",
        "Criterio global": `${r <= 1 && M >= 1 && _ <= 1 ? "\u2713 OK" : "\u2717 REVISAR"}`,
        "\u2500\u2500 Solver FEM \u2500\u2500": "",
        Tipo: i ? "NO-LINEAL (J2 secante)" : "Lineal el\xE1stico",
        ...i ? {
          "Iteraciones NL": `${i.iterations}${i.converged ? " \u2713 convergi\xF3" : " \u2717 max-iter"}`,
          "Elementos plastificados": `${i.elementsYielded}`,
          "Max \u03C3/Fy (lineal inicial)": i.maxRatio.toFixed(2),
          Interpretaci\u00F3n: i.elementsYielded > 0 ? `${i.elementsYielded} shells alcanzaron fluencia \u2192 redistribuci\xF3n` : "Toda la placa en rango el\xE1stico"
        } : {}
      };
    }
  };
});
export {
  __tla,
  Se as p
};
