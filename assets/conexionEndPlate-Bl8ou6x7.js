import { a as we } from "./analyze-C-HJ03ae.js";
import { d as ye, __tla as __tla_0 } from "./didacticCpp-CzlDWovh.js";
import { c as ze } from "./colorMapPercentile-OnF3uP-w.js";
import { e as K, M as Q, C as de, S as Fe } from "./Text-Br8EG2up.js";
let Pe;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  Pe = {
    id: "conexion-end-plate",
    name: "Conexi\xF3n End Plate 4E/4ES (AISC 358 \xA76)",
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
      config: {
        default: 0,
        label: "Configuraci\xF3n AISC 358",
        options: {
          "4E (Unstiffened)": 0,
          "4ES (Stiffened)": 1,
          "8ES (Eight-Bolt Stiff.)": 2
        },
        folder: "Configuraci\xF3n"
      },
      d_beam: {
        default: 0.5,
        min: 0.3,
        max: 0.9,
        step: 0.02,
        label: "d viga (m)",
        folder: "Viga"
      },
      bf_beam: {
        default: 0.2,
        min: 0.12,
        max: 0.4,
        step: 0.01,
        label: "bf pat\xEDn (m)",
        folder: "Viga"
      },
      tf_beam: {
        default: 0.018,
        min: 0.01,
        max: 0.04,
        step: 2e-3,
        label: "tf pat\xEDn (m)",
        folder: "Viga"
      },
      tw_beam: {
        default: 0.012,
        min: 8e-3,
        max: 0.025,
        step: 1e-3,
        label: "tw alma (m)",
        folder: "Viga"
      },
      L_beam: {
        default: 3.5,
        min: 2,
        max: 6,
        step: 0.1,
        label: "L viga (m)",
        folder: "Viga"
      },
      d_col: {
        default: 0.4,
        min: 0.3,
        max: 0.7,
        step: 0.02,
        label: "d col (m)",
        folder: "Columna"
      },
      bf_col: {
        default: 0.4,
        min: 0.25,
        max: 0.6,
        step: 0.01,
        label: "bf col (m)",
        folder: "Columna"
      },
      tf_col: {
        default: 0.025,
        min: 0.012,
        max: 0.05,
        step: 2e-3,
        label: "tf col (m)",
        folder: "Columna"
      },
      tw_col: {
        default: 0.018,
        min: 0.01,
        max: 0.035,
        step: 1e-3,
        label: "tw col (m)",
        folder: "Columna"
      },
      bp: {
        default: 0.25,
        min: 0.15,
        max: 0.5,
        step: 0.01,
        label: "bp ancho placa (m)",
        folder: "End Plate"
      },
      hp: {
        default: 0.65,
        min: 0.3,
        max: 1,
        step: 0.02,
        label: "hp altura placa (m)",
        folder: "End Plate"
      },
      tp: {
        default: 0.03,
        min: 0.015,
        max: 0.06,
        step: 2e-3,
        label: "tp espesor (m)",
        folder: "End Plate"
      },
      pf: {
        default: 0.06,
        min: 0.03,
        max: 0.15,
        step: 0.01,
        label: "pf bolt to flange (m)",
        folder: "End Plate"
      },
      g: {
        default: 0.1,
        min: 0.06,
        max: 0.2,
        step: 0.01,
        label: "g gauge (m)",
        folder: "End Plate"
      },
      d_bolt: {
        default: 0.025,
        min: 0.016,
        max: 0.04,
        step: 2e-3,
        label: "\xD8 perno (m)",
        folder: "Pernos"
      },
      Fu_bolt: {
        default: 103e4,
        min: 83e4,
        max: 11e5,
        step: 1e4,
        label: "Fu perno A490 (kN/m\xB2)",
        folder: "Pernos"
      },
      Fy: {
        default: 345e3,
        min: 25e4,
        max: 45e4,
        step: 5e3,
        label: "Fy acero (kN/m\xB2)",
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
      Mu: {
        default: 350,
        min: 0,
        max: 2e3,
        step: 25,
        label: "Mu demanda (kN\xB7m)",
        folder: "Cargas",
        unitType: "moment"
      },
      mesh_density: {
        default: 2,
        min: 1,
        max: 5,
        step: 1,
        label: "Densidad malla (2 = r\xE1pido, 4 = denso)",
        folder: "Malla"
      }
    },
    build(e, r) {
      const i = [], _ = [], p = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), S = e.E_steel / 2.6, fe = 77 / 9.81, q = 1e-4, ee = /* @__PURE__ */ new Map(), l = (t, o, n) => {
        const a = `${Math.round(t / q)},${Math.round(o / q)},${Math.round(n / q)}`;
        let m = ee.get(a);
        return m === void 0 && (i.push([
          t,
          o,
          n
        ]), m = i.length - 1, ee.set(a, m)), m;
      }, f = (t, o, n, a, m) => {
        _.push([
          t,
          o,
          n,
          a
        ]);
        const s = _.length - 1;
        p.set(s, m), N.set(s, e.E_steel), I.set(s, 0.3), M.set(s, fe), O.set(s, 0), F.set(s, 0), k.set(s, 0), x.set(s, 0), B.set(s, S);
      }, u = Math.max(1, Math.round(e.mesh_density)), te = Math.round(e.config), be = te >= 1, _e = te === 2, g = 4, Y = +e.d_col / 2 - e.tf_col / 2, Z = -e.d_col / 2 + e.tf_col / 2, b = 8 * u, v = 2 * u, A = [];
      for (let t = 0; t <= b; t++) {
        const o = -g / 2 + t * g / b, n = [];
        for (let a = 0; a <= v; a++) n.push(l(Y, -e.bf_col / 2 + a * e.bf_col / v, o));
        A.push(n);
      }
      for (let t = 0; t < b; t++) for (let o = 0; o < v; o++) f(A[t][o], A[t][o + 1], A[t + 1][o + 1], A[t + 1][o], e.tf_col);
      const L = [];
      for (let t = 0; t <= b; t++) {
        const o = -g / 2 + t * g / b, n = [];
        for (let a = 0; a <= v; a++) n.push(l(Z, -e.bf_col / 2 + a * e.bf_col / v, o));
        L.push(n);
      }
      for (let t = 0; t < b; t++) for (let o = 0; o < v; o++) f(L[t][o], L[t][o + 1], L[t + 1][o + 1], L[t + 1][o], e.tf_col);
      const U = u + 1, T = [];
      for (let t = 0; t <= b; t++) {
        const o = -g / 2 + t * g / b, n = [];
        for (let a = 0; a <= U; a++) n.push(l(Z + (Y - Z) * (a / U), 0, o));
        T.push(n);
      }
      for (let t = 0; t < b; t++) for (let o = 0; o < U; o++) f(T[t][o], T[t][o + 1], T[t + 1][o + 1], T[t + 1][o], e.tw_col);
      const W = 3 * u, H = 6 * u, X = [];
      for (let t = 0; t <= H; t++) {
        const o = -e.hp / 2 + t * e.hp / H, n = [];
        for (let a = 0; a <= W; a++) {
          const m = -e.bp / 2 + a * e.bp / W;
          n.push(l(Y, m, o));
        }
        X.push(n);
      }
      for (let t = 0; t < H; t++) for (let o = 0; o < W; o++) f(X[t][o], X[t][o + 1], X[t + 1][o + 1], X[t + 1][o], e.tp);
      const d = Y + e.tp, w = +e.d_beam / 2 - e.tf_beam / 2, h = -e.d_beam / 2 + e.tf_beam / 2, V = 8 * u, E = 2 * u, D = 2 * u, y = [], $ = [], P = [];
      for (let t = 0; t <= V; t++) {
        const o = d + t * e.L_beam / V, n = [], a = [];
        for (let s = 0; s <= E; s++) {
          const j = -e.bf_beam / 2 + s * e.bf_beam / E;
          n.push(l(o, j, w)), a.push(l(o, j, h));
        }
        y.push(n), $.push(a);
        const m = [];
        for (let s = 0; s <= D; s++) {
          const j = h + (w - h) * (s / D);
          m.push(l(o, 0, j));
        }
        P.push(m);
      }
      for (let t = 0; t < V; t++) {
        for (let o = 0; o < E; o++) f(y[t][o], y[t][o + 1], y[t + 1][o + 1], y[t + 1][o], e.tf_beam), f($[t][o], $[t][o + 1], $[t + 1][o + 1], $[t + 1][o], e.tf_beam);
        for (let o = 0; o < D; o++) f(P[t][o], P[t][o + 1], P[t + 1][o + 1], P[t + 1][o], e.tw_beam);
      }
      if (be) {
        const t = (e.hp - e.d_beam) / 2 - 0.02, o = t * 1.5;
        w + e.tf_beam / 2 + t / 2, h - e.tf_beam / 2 - t / 2;
        const n = e.tw_beam, a = 0;
        f(l(d, a, w + e.tf_beam / 2), l(d + o, a, w + e.tf_beam / 2), l(d + o, a, w + e.tf_beam / 2), l(d, a, w + e.tf_beam / 2 + t), n), f(l(d, a, h - e.tf_beam / 2 - t), l(d + o, a, h - e.tf_beam / 2), l(d + o, a, h - e.tf_beam / 2), l(d, a, h - e.tf_beam / 2), n);
      }
      const z = /* @__PURE__ */ new Map();
      for (let t = 0; t <= E; t++) z.set(y[0][t], [
        true,
        true,
        true,
        true,
        true,
        true
      ]), z.set($[0][t], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let t = 0; t <= D; t++) z.set(P[0][t], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let t = 0; t < i.length; t++) Math.abs(Math.abs(i[t][2]) - g / 2) < 1e-4 && Math.abs(i[t][0]) >= e.d_col / 2 - e.tf_col - 1e-4 && (z.has(t) || z.set(t, [
        true,
        true,
        true,
        true,
        true,
        true
      ]));
      const ue = e.Mu / Math.max(e.d_beam - e.tf_beam, 0.1) * 0.4, J = /* @__PURE__ */ new Map(), he = ue / (E + 1);
      for (let t = 0; t <= E; t++) J.set(y[V][t], [
        0,
        0,
        -he,
        0,
        0,
        0
      ]);
      r.nodes.val = i, r.elements.val = _, r.nodeInputs.val = {
        supports: z,
        loads: J
      }, r.elementInputs.val = {
        thicknesses: p,
        elasticities: N,
        poissonsRatios: I,
        densities: M,
        areas: O,
        momentsOfInertiaY: F,
        momentsOfInertiaZ: k,
        torsionalConstants: x,
        shearModuli: B
      };
      try {
        const t = ye(i, _, {
          supports: z,
          loads: J
        }, r.elementInputs.val);
        r.deformOutputs.val = t;
        const o = we(i, _, r.elementInputs.val, t), [n, a] = ze(o.vonMises, 85, e.Fy);
        o.colorMapRanges = {
          ...o.colorMapRanges,
          vonMises: [
            n,
            a
          ]
        }, r.analyzeOutputs.val = o;
      } catch (t) {
        console.error("[EndPlate] solver error:", t == null ? void 0 : t.message);
      }
      const G = [], pe = new K({
        color: 4473924,
        metalness: 0.8
      }), Me = new K({
        color: 2236962
      }), oe = e.tp + e.tf_col + 0.02, ae = +e.d_beam / 2 + e.pf, ne = +e.d_beam / 2 - e.pf, se = -e.d_beam / 2 - e.pf, le = -e.d_beam / 2 + e.pf, me = +e.d_beam / 2 + e.pf * 2, re = -e.d_beam / 2 - e.pf * 2, C = -e.g / 2, R = +e.g / 2, c = Y - e.tp / 2 - 5e-3, ce = [
        [
          c,
          C,
          ae
        ],
        [
          c,
          R,
          ae
        ],
        [
          c,
          C,
          ne
        ],
        [
          c,
          R,
          ne
        ],
        [
          c,
          C,
          se
        ],
        [
          c,
          R,
          se
        ],
        [
          c,
          C,
          le
        ],
        [
          c,
          R,
          le
        ]
      ];
      _e && ce.push([
        c,
        C,
        me
      ], [
        c,
        R,
        me
      ], [
        c,
        C,
        re
      ], [
        c,
        R,
        re
      ]);
      for (const [t, o, n] of ce) {
        const a = new Q(new de(e.d_bolt / 2, e.d_bolt / 2, oe, 12), pe);
        a.rotation.z = Math.PI / 2, a.position.set(t, o, n), G.push(a);
        const m = new Q(new de(e.d_bolt * 0.85, e.d_bolt * 0.85, e.d_bolt * 0.8, 6), Me);
        m.rotation.z = Math.PI / 2, m.position.set(t + oe / 2 + 5e-3, o, n), G.push(m);
      }
      const xe = Math.min(e.d_beam / 2, 3 * e.bf_beam), ge = new K({
        color: 16720384,
        emissive: 5574912,
        transparent: true,
        opacity: 0.7
      }), ie = new Q(new Fe(Math.min(e.bf_beam, e.d_beam) * 0.25, 16, 12), ge);
      ie.position.set(d + xe, 0, 0), G.push(ie), r.objects3D.val = G;
    },
    computedLabels(e) {
      const r = Math.round(e.config), i = r === 0 ? "4E (Unstiffened)" : r === 1 ? "4ES (Stiffened)" : "8ES", _ = Math.PI * Math.pow(e.d_bolt / 2, 2), p = r === 2 ? 8 : 4, N = 0.75, I = 0.6 * e.Fu_bolt * _, M = N * I * (p / 2), O = e.bf_beam * e.tf_beam * (e.d_beam - e.tf_beam) + e.tw_beam * Math.pow(e.d_beam - 2 * e.tf_beam, 2) / 4, F = e.Fy * O, k = 1.1 * 1.2 * F, x = k / Math.max(e.d_beam, 0.1), B = Math.min(e.d_beam / 2, 3 * e.bf_beam), S = Math.sqrt(1.11 * 1.2 * F / (0.9 * e.Fy * (e.bp / 2)));
      return {
        "\u2500\u2500 Configuraci\xF3n AISC 358 \xA76 \u2500\u2500": "",
        Tipo: i,
        "Pernos totales": `${p} (${p / 2} arriba + ${p / 2} abajo)`,
        "\u2500\u2500 Geometr\xEDa End Plate \u2500\u2500": "",
        "Sh (r\xF3tula pl\xE1stica)": `${(B * 1e3).toFixed(0)} mm desde cara col`,
        "bp \xD7 hp \xD7 tp": `${(e.bp * 1e3).toFixed(0)} \xD7 ${(e.hp * 1e3).toFixed(0)} \xD7 ${(e.tp * 1e3).toFixed(0)} mm`,
        "pf bolt-flange": `${(e.pf * 1e3).toFixed(0)} mm`,
        "g gauge": `${(e.g * 1e3).toFixed(0)} mm`,
        "\u2500\u2500 Capacidades \u2500\u2500": "",
        "Mp viga": `${F.toFixed(0)} kN\xB7m`,
        "M_pr (Cpr\xB7Ry\xB7Mp)": `${k.toFixed(0)} kN\xB7m`,
        "T demanda": `${x.toFixed(0)} kN`,
        "\u2500\u2500 Espesor placa \xA76.7 \u2500\u2500": "",
        "tp requerido (Yc)": `${(S * 1e3).toFixed(1)} mm`,
        "tp dado": `${(e.tp * 1e3).toFixed(1)} mm`,
        "Ratio tp/tp_req": `${(e.tp / S).toFixed(2)} ${e.tp >= S ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Pernos \xA76.7 \u2500\u2500": "",
        [`A_b (\xD8 ${(e.d_bolt * 1e3).toFixed(0)} mm)`]: `${(_ * 1e6).toFixed(0)} mm\xB2`,
        "\u03C6Rn por perno": `${(N * I).toFixed(1)} kN`,
        "\u03A3\u03C6Rn (N/2 pernos por pat\xEDn)": `${M.toFixed(0)} kN`,
        "Ratio T/\u03A3\u03C6Rn": `${(x / M).toFixed(3)} ${x <= M ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Dictamen \u2500\u2500": "",
        Status: e.tp >= S && x <= M ? `\u2713 PASA ${i}` : "\u2717 REVISAR"
      };
    }
  };
});
export {
  __tla,
  Pe as c
};
