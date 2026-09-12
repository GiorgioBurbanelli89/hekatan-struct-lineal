import { a as xe } from "./analyze-DgLgRmKg.js";
import { d as Me, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { s as ge, __tla as __tla_1 } from "./secantPlasticity-CFgKIIdb.js";
import { c as se } from "./colorMapPercentile-OnF3uP-w.js";
import { c as ce, e as Z, M as C, L as ye, E as $e, b as ve, C as Q, R as we, f as ie, D as re } from "./theme-DQ--CgsI.js";
let Be;
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
  Be = {
    id: "placa-base",
    name: "Placa base anclada (AISC 360-22 \xA7J8 + ACI 318)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F529} Conexiones",
    hasModal: false,
    defaultShellResult: "vonMises",
    availableShellResults: [
      "vonMises",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "membraneXX",
      "membraneYY",
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
        default: 1,
        label: "Solver",
        options: {
          "Lineal (el\xE1stico)": 0,
          "No-lineal (plasticidad J2 secante)": 1
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
    build(e, i) {
      const c = [], f = [], G = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), E = e.E_steel / 2.6, q = 77, x = (t, l, n) => (c.push([
        t,
        l,
        n
      ]), c.length - 1), v = (t, l, n, o) => {
        for (let a = 0; a < c.length; a++) {
          const s = c[a], u = s[0] - t, h = s[1] - l, m = s[2] - n;
          if (u * u + h * h + m * m < o * o) return a;
        }
        return c.push([
          t,
          l,
          n
        ]), c.length - 1;
      }, M = (t, l, n, o, a) => {
        f.push([
          t,
          l,
          n,
          o
        ]);
        const s = f.length - 1;
        G.set(s, a), Y.set(s, e.E_steel), p.set(s, 0.3), S.set(s, q), z.set(s, 0), A.set(s, 0), N.set(s, 0), k.set(s, 0), H.set(s, E);
      }, w = ((t) => {
        const l = e.edge_dist, n = e.B / 2 - l, o = e.H / 2 - l;
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
      })(e.bolt_layout), d = e.d_hole / 2, F = Math.max(14, Math.round(e.mesh_n)), P = Math.max(14, Math.round(e.mesh_n)), I = e.B / F, O = e.H / P, g = [];
      for (let t = 0; t <= P; t++) {
        const l = [];
        for (let n = 0; n <= F; n++) {
          let o = -e.B / 2 + n * I, a = -e.H / 2 + t * O, s = false;
          for (const [u, h] of w) {
            const m = o - u, $ = a - h, b = Math.sqrt(m * m + $ * $);
            if (b < d * 0.35) {
              s = true;
              break;
            }
            if (b < d && b > 1e-9) {
              o = u + m / b * d, a = h + $ / b * d;
              break;
            }
          }
          s ? l.push(-1) : l.push(x(o, a, 0));
        }
        g.push(l);
      }
      for (let t = 0; t < P; t++) for (let l = 0; l < F; l++) {
        const n = g[t][l], o = g[t][l + 1], a = g[t + 1][l + 1], s = g[t + 1][l];
        if (n < 0 || o < 0 || a < 0 || s < 0) continue;
        const u = -e.B / 2 + (l + 0.5) * I, h = -e.H / 2 + (t + 0.5) * O;
        let m = false;
        for (const [$, b] of w) if (Math.sqrt((u - $) ** 2 + (h - b) ** 2) < d * 0.95) {
          m = true;
          break;
        }
        m || M(n, o, a, s, e.t_plate);
      }
      e.L_col_stub;
      const r = 6, _ = Math.max(2, Math.round(e.mesh_n / 12)), K = Math.max(I, O) * 0.7, V = +e.d_col / 2 - e.tf_col / 2, T = -e.d_col / 2 + e.tf_col / 2, L = [];
      for (let t = 0; t <= r; t++) {
        const l = t * e.L_col_stub / r, n = [];
        for (let o = 0; o <= _; o++) {
          const a = -e.bf_col / 2 + o * e.bf_col / _;
          t === 0 ? n.push(v(V, a, 0, K)) : n.push(x(V, a, l));
        }
        L.push(n);
      }
      for (let t = 0; t < r; t++) for (let l = 0; l < _; l++) M(L[t][l], L[t][l + 1], L[t + 1][l + 1], L[t + 1][l], e.tf_col);
      const R = [];
      for (let t = 0; t <= r; t++) {
        const l = t * e.L_col_stub / r, n = [];
        for (let o = 0; o <= _; o++) {
          const a = -e.bf_col / 2 + o * e.bf_col / _;
          t === 0 ? n.push(v(T, a, 0, K)) : n.push(x(T, a, l));
        }
        R.push(n);
      }
      for (let t = 0; t < r; t++) for (let l = 0; l < _; l++) M(R[t][l], R[t][l + 1], R[t + 1][l + 1], R[t + 1][l], e.tf_col);
      const B = [], W = 2 + Math.round(e.mesh_n / 16);
      for (let t = 0; t <= r; t++) {
        const l = t * e.L_col_stub / r, n = [];
        for (let o = 0; o <= W; o++) {
          const a = T + (V - T) * (o / W);
          t === 0 ? n.push(v(a, 0, 0, K)) : n.push(x(a, 0, l));
        }
        B.push(n);
      }
      for (let t = 0; t < r; t++) for (let l = 0; l < W; l++) M(B[t][l], B[t][l + 1], B[t + 1][l + 1], B[t + 1][l], e.tw_col);
      const D = /* @__PURE__ */ new Map();
      for (const [t, l] of w) {
        const n = [];
        for (let o = 0; o < c.length; o++) {
          if (Math.abs(c[o][2]) > 1e-4) continue;
          const a = c[o][0] - t, s = c[o][1] - l, u = Math.sqrt(a * a + s * s);
          Math.abs(u - d) < d * 0.15 && n.push({
            idx: o,
            d: u
          });
        }
        for (const o of n) D.set(o.idx, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
      }
      const X = /* @__PURE__ */ new Map(), j = [
        ...L[r],
        ...R[r],
        ...B[r]
      ];
      if (j.length > 0) {
        const t = -e.Pu / j.length, l = e.d_col / 2;
        for (const n of j) {
          const o = c[n][0], a = e.Mu / (j.length * l) * (o > 0 ? 1 : -1);
          X.set(n, [
            0,
            0,
            t + a,
            0,
            0,
            0
          ]);
        }
      }
      i.nodes.val = c, i.elements.val = f, i.nodeInputs.val = {
        supports: D,
        loads: X
      }, i.elementInputs.val = {
        thicknesses: G,
        elasticities: Y,
        poissonsRatios: p,
        densities: S,
        areas: z,
        momentsOfInertiaY: A,
        momentsOfInertiaZ: N,
        torsionalConstants: k,
        shearModuli: H
      };
      try {
        if (e.use_nonlinear > 0.5) {
          const t = ge({
            nodes: c,
            elements: f,
            nodeInputs: {
              supports: D,
              loads: X
            },
            elementInputs: i.elementInputs.val,
            Fy: e.Fy_plate,
            maxIter: Math.round(e.nl_max_iter),
            tol: 0.03,
            softeningFactor: 0.9
          });
          i.deformOutputs.val = t.deformOutputs;
          const l = t.analyzeOutputs, [n, o] = se(l.vonMises, 90, e.Fy_plate);
          l.colorMapRanges = {
            ...l.colorMapRanges,
            vonMises: [
              n,
              o
            ]
          }, i.analyzeOutputs.val = l, i.__nlInfo = {
            iterations: t.iterations,
            converged: t.converged,
            elementsYielded: t.elementsYielded,
            maxRatio: t.maxRatio
          }, console.log(`[placa-base NL] iter=${t.iterations}, converged=${t.converged}, yielded=${t.elementsYielded}, maxRatio=${t.maxRatio.toFixed(2)}`);
        } else {
          i.deformOutputs.val = Me(c, f, {
            supports: D,
            loads: X
          }, i.elementInputs.val);
          const t = xe(c, f, i.elementInputs.val, i.deformOutputs.val), [l, n] = se(t.vonMises, 90, e.Fy_plate);
          t.colorMapRanges = {
            ...t.colorMapRanges,
            vonMises: [
              l,
              n
            ]
          }, i.analyzeOutputs.val = t, i.__nlInfo = null;
        }
      } catch (t) {
        console.error("[placa-base] solver error:", (t == null ? void 0 : t.message) || t), i.deformOutputs.val = {}, i.analyzeOutputs.val = {};
      }
      const y = [], ee = new ce(e.B_ped, e.H_ped, e.h_ped), de = new Z({
        color: 12298888,
        transparent: true,
        opacity: 0.35,
        metalness: 0.1,
        roughness: 0.9
      }), te = new C(ee, de);
      te.position.set(0, 0, -e.h_ped / 2), y.push(te);
      const oe = new ye(new $e(ee), new ve({
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
      for (const [t, l] of w) {
        const n = e.d_bolt * 1, o = e.L_bolt + e.t_plate + n + 0.015, a = new Q(e.d_bolt / 2, e.d_bolt / 2, o, 16), s = new C(a, me);
        s.rotation.x = Math.PI / 2;
        const u = -e.L_bolt + o / 2;
        s.position.set(t, l, u), y.push(s);
        const h = new Q(e.d_bolt * 0.9, e.d_bolt * 0.9, n, 6), m = new C(h, ue);
        m.rotation.x = Math.PI / 2, m.position.set(t, l, e.t_plate + n / 2), y.push(m);
        const $ = new Q(e.d_hole / 2 * 1.4, e.d_hole / 2 * 1.4, 4e-3, 20), b = new Z({
          color: 8947848,
          metalness: 0.6,
          roughness: 0.4
        }), J = new C($, b);
        J.rotation.x = Math.PI / 2, J.position.set(t, l, e.t_plate + 2e-3), y.push(J);
        const be = new we(d, d * 1.05, 32), pe = new ie({
          color: 16776960,
          side: re
        }), ae = new C(be, pe);
        ae.position.set(t, l, e.t_plate + 5e-4), y.push(ae);
      }
      const _e = Math.sqrt(e.B * e.H), ne = Math.min(_e + 2 * e.h_ped, Math.min(e.B_ped, e.H_ped)), fe = new ce(ne, ne, 2e-3), he = new ie({
        color: 16746496,
        transparent: true,
        opacity: 0.18,
        side: re
      }), le = new C(fe, he);
      le.position.set(0, 0, -e.h_ped + 1e-3), y.push(le), i.objects3D.val = y, console.log(`[Placa Base AISC \xA7J8] Shells=${f.length}, Nodos=${c.length}
  Placa ${e.B}\xD7${e.H}\xD7${e.t_plate}m, Pernos=${e.bolt_layout} \xD8${e.d_bolt * 1e3}mm
  Pedestal ${e.B_ped}\xD7${e.H_ped}\xD7${e.h_ped}m f'c=${e.fc / 1e3} MPa`);
    },
    computedLabels(e, i) {
      const c = i.__nlInfo, f = 0.65, G = 0.9, Y = 0.75, p = e.B * e.H, S = Math.min(e.B_ped * e.H_ped, p * 4), z = Math.min(Math.sqrt(S / p), 2), A = 0.85 * e.fc * p * z, N = f * A, k = Math.max(0, (e.B - 0.95 * e.d_col) / 2), H = Math.max(0, (e.H - 0.8 * e.bf_col) / 2), E = Math.sqrt(e.d_col * e.bf_col) / 4, q = Math.max(k, H, E), x = e.Pu / p, v = q * Math.sqrt(2 * x / (G * e.Fy_plate)), M = e.t_plate / v, U = e.Mu / Math.max(e.Pu, 1e-3), w = e.bolt_layout / 2, d = e.H / 2 - e.edge_dist, F = Math.max(0, (e.Mu - e.Pu * d) / (2 * d)), P = F / Math.max(w, 1), I = Math.PI * (e.d_bolt / 2) ** 2, O = 0.75 * e.Fu_bolt * I, g = Y * O, r = e.Pu / N, _ = P / g;
      return {
        "\u2500\u2500 Geometr\xEDa \u2500\u2500": "",
        "A1 (\xE1rea placa)": `${(p * 1e4).toFixed(0)} cm\xB2`,
        "A2 (\xE1rea pedestal)": `${(S * 1e4).toFixed(0)} cm\xB2`,
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
        "t req.": `${(v * 1e3).toFixed(1)} mm`,
        "t dado": `${(e.t_plate * 1e3).toFixed(1)} mm`,
        "Ratio t/t_req": `${M.toFixed(2)} ${M >= 1 ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Pernos anclaje AISC \xA7J3 / ACI \xA717 \u2500\u2500": "",
        "e = Mu/Pu": `${(U * 1e3).toFixed(0)} mm`,
        "Brazo a pernos": `${(d * 1e3).toFixed(0)} mm`,
        "Tu total (tensi\xF3n neta)": `${F.toFixed(1)} kN`,
        "Tu por perno": `${P.toFixed(1)} kN`,
        A_perno: `${(I * 1e6).toFixed(1)} mm\xB2`,
        "\u03C6Rn perno": `${g.toFixed(1)} kN`,
        "Ratio Tu/\u03C6Rn": `${_.toFixed(3)} ${_ <= 1 ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Dictamen \u2500\u2500": "",
        "Criterio global": `${r <= 1 && M >= 1 && _ <= 1 ? "\u2713 OK" : "\u2717 REVISAR"}`,
        "\u2500\u2500 Solver FEM \u2500\u2500": "",
        Tipo: c ? "NO-LINEAL (J2 secante)" : "Lineal el\xE1stico",
        ...c ? {
          "Iteraciones NL": `${c.iterations}${c.converged ? " \u2713 convergi\xF3" : " \u2717 max-iter"}`,
          "Elementos plastificados": `${c.elementsYielded}`,
          "Max \u03C3/Fy (lineal inicial)": c.maxRatio.toFixed(2),
          Interpretaci\u00F3n: c.elementsYielded > 0 ? `${c.elementsYielded} shells alcanzaron fluencia \u2192 redistribuci\xF3n` : "Toda la placa en rango el\xE1stico"
        } : {}
      };
    }
  };
});
export {
  __tla,
  Be as p
};
