import { a as re, __tla as __tla_0 } from "./analyze-H7ZLvUh5.js";
import { d as ce, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { c as me } from "./colorMapPercentile-OnF3uP-w.js";
import { e as ie, M as de, C as fe } from "./Text-C1TX4d8g.js";
let he;
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
  he = {
    id: "conexion-bfp",
    name: "Conexi\xF3n BFP (Bolted Flange Plate \xB7 AISC 358 \xA77)",
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
        label: "bf pat\xEDn viga (m)",
        folder: "Viga"
      },
      tf_beam: {
        default: 0.018,
        min: 0.01,
        max: 0.04,
        step: 2e-3,
        label: "tf pat\xEDn viga (m)",
        folder: "Viga"
      },
      tw_beam: {
        default: 0.012,
        min: 8e-3,
        max: 0.025,
        step: 1e-3,
        label: "tw alma viga (m)",
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
        label: "d columna (m)",
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
        default: 0.2,
        min: 0.12,
        max: 0.4,
        step: 0.01,
        label: "bp ancho placa (m)",
        folder: "Placa BFP"
      },
      tp: {
        default: 0.025,
        min: 0.015,
        max: 0.05,
        step: 2e-3,
        label: "tp espesor placa (m)",
        folder: "Placa BFP"
      },
      Lp: {
        default: 0.4,
        min: 0.2,
        max: 0.8,
        step: 0.02,
        label: "Lp largo placa (m)",
        folder: "Placa BFP"
      },
      n_rows: {
        default: 4,
        label: "Filas de pernos",
        options: {
          2: 2,
          3: 3,
          4: 4,
          5: 5
        },
        folder: "Pernos"
      },
      n_cols: {
        default: 2,
        label: "Columnas de pernos",
        options: {
          1: 1,
          2: 2,
          3: 3
        },
        folder: "Pernos"
      },
      d_bolt: {
        default: 0.022,
        min: 0.012,
        max: 0.04,
        step: 2e-3,
        label: "\xD8 perno (m)",
        folder: "Pernos"
      },
      s_pitch: {
        default: 0.07,
        min: 0.04,
        max: 0.15,
        step: 0.01,
        label: "s pitch (m)",
        folder: "Pernos"
      },
      a_edge: {
        default: 0.05,
        min: 0.025,
        max: 0.1,
        step: 5e-3,
        label: "a edge (m)",
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
      Fu_bolt: {
        default: 83e4,
        min: 6e5,
        max: 103e4,
        step: 1e4,
        label: "Fu perno (kN/m\xB2)",
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
        default: 400,
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
    build(t, r) {
      const c = [], d = [], v = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), m = t.E_steel / 2.6, te = 77 / 9.81, E = 1e-4, J = /* @__PURE__ */ new Map(), f = (e, o, n) => {
        const a = `${Math.round(e / E)},${Math.round(o / E)},${Math.round(n / E)}`;
        let s = J.get(a);
        return s === void 0 && (c.push([
          e,
          o,
          n
        ]), s = c.length - 1, J.set(a, s)), s;
      }, b = (e, o, n, a, s) => {
        d.push([
          e,
          o,
          n,
          a
        ]);
        const l = d.length - 1;
        v.set(l, s), I.set(l, t.E_steel), X.set(l, 0.3), u.set(l, te), P.set(l, 0), R.set(l, 0), z.set(l, 0), $.set(l, 0), p.set(l, m);
      }, _ = Math.max(1, Math.round(t.mesh_density)), h = 4, O = +t.d_col / 2 - t.tf_col / 2, V = -t.d_col / 2 + t.tf_col / 2, i = 8 * _, w = 2 * _, C = [];
      for (let e = 0; e <= i; e++) {
        const o = -h / 2 + e * h / i, n = [];
        for (let a = 0; a <= w; a++) n.push(f(O, -t.bf_col / 2 + a * t.bf_col / w, o));
        C.push(n);
      }
      for (let e = 0; e < i; e++) for (let o = 0; o < w; o++) b(C[e][o], C[e][o + 1], C[e + 1][o + 1], C[e + 1][o], t.tf_col);
      const S = [];
      for (let e = 0; e <= i; e++) {
        const o = -h / 2 + e * h / i, n = [];
        for (let a = 0; a <= w; a++) n.push(f(V, -t.bf_col / 2 + a * t.bf_col / w, o));
        S.push(n);
      }
      for (let e = 0; e < i; e++) for (let o = 0; o < w; o++) b(S[e][o], S[e][o + 1], S[e + 1][o + 1], S[e + 1][o], t.tf_col);
      const D = _ + 1, B = [];
      for (let e = 0; e <= i; e++) {
        const o = -h / 2 + e * h / i, n = [];
        for (let a = 0; a <= D; a++) {
          const s = V + (O - V) * (a / D);
          n.push(f(s, 0, o));
        }
        B.push(n);
      }
      for (let e = 0; e < i; e++) for (let o = 0; o < D; o++) b(B[e][o], B[e][o + 1], B[e + 1][o + 1], B[e + 1][o], t.tw_col);
      const G = O, Z = +t.d_beam / 2 - t.tf_beam / 2, L = -t.d_beam / 2 + t.tf_beam / 2, T = 8 * _, F = 2 * _, A = 2 * _, x = [], g = [], y = [];
      for (let e = 0; e <= T; e++) {
        const o = G + e * t.L_beam / T, n = [], a = [];
        for (let l = 0; l <= F; l++) {
          const Y = -t.bf_beam / 2 + l * t.bf_beam / F;
          n.push(f(o, Y, Z)), a.push(f(o, Y, L));
        }
        x.push(n), g.push(a);
        const s = [];
        for (let l = 0; l <= A; l++) {
          const Y = L + (Z - L) * (l / A);
          s.push(f(o, 0, Y));
        }
        y.push(s);
      }
      for (let e = 0; e < T; e++) {
        for (let o = 0; o < F; o++) b(x[e][o], x[e][o + 1], x[e + 1][o + 1], x[e + 1][o], t.tf_beam), b(g[e][o], g[e][o + 1], g[e + 1][o + 1], g[e + 1][o], t.tf_beam);
        for (let o = 0; o < A; o++) b(y[e][o], y[e][o + 1], y[e + 1][o + 1], y[e + 1][o], t.tw_beam);
      }
      const K = Z + t.tf_beam / 2 + t.tp / 2, Q = L - t.tf_beam / 2 - t.tp / 2, j = 2 * _, W = 4 * _, N = [], k = [];
      for (let e = 0; e <= W; e++) {
        const o = G + e * t.Lp / W, n = [], a = [];
        for (let s = 0; s <= j; s++) {
          const l = -t.bp / 2 + s * t.bp / j;
          n.push(f(o, l, K)), a.push(f(o, l, Q));
        }
        N.push(n), k.push(a);
      }
      for (let e = 0; e < W; e++) for (let o = 0; o < j; o++) b(N[e][o], N[e][o + 1], N[e + 1][o + 1], N[e + 1][o], t.tp), b(k[e][o], k[e][o + 1], k[e + 1][o + 1], k[e + 1][o], t.tp);
      const M = /* @__PURE__ */ new Map(), q = 0;
      for (let e = 0; e <= F; e++) M.set(x[q][e], [
        true,
        true,
        true,
        true,
        true,
        true
      ]), M.set(g[q][e], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let e = 0; e <= A; e++) M.set(y[q][e], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let e = 0; e < c.length; e++) Math.abs(Math.abs(c[e][2]) - h / 2) < 1e-4 && Math.abs(c[e][0]) >= t.d_col / 2 - t.tf_col - 1e-4 && (M.has(e) || M.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]));
      t.L_beam - t.Lp;
      const oe = t.Mu / Math.max(t.d_beam - t.tf_beam, 0.1) * 0.5, H = /* @__PURE__ */ new Map(), ae = T, ne = oe / (F + 1);
      for (let e = 0; e <= F; e++) H.set(x[ae][e], [
        0,
        0,
        -ne,
        0,
        0,
        0
      ]);
      r.nodes.val = c, r.elements.val = d, r.nodeInputs.val = {
        supports: M,
        loads: H
      }, r.elementInputs.val = {
        thicknesses: v,
        elasticities: I,
        poissonsRatios: X,
        densities: u,
        areas: P,
        momentsOfInertiaY: R,
        momentsOfInertiaZ: z,
        torsionalConstants: $,
        shearModuli: p
      };
      try {
        const e = ce(c, d, {
          supports: M,
          loads: H
        }, r.elementInputs.val);
        r.deformOutputs.val = e;
        const o = re(c, d, r.elementInputs.val, e), [n, a] = me(o.vonMises, 85, t.Fy);
        o.colorMapRanges = {
          ...o.colorMapRanges,
          vonMises: [
            n,
            a
          ]
        }, r.analyzeOutputs.val = o;
      } catch (e) {
        console.error("[BFP] solver error:", e == null ? void 0 : e.message);
      }
      const U = [], le = new ie({
        color: 4473924,
        metalness: 0.8
      }), se = Math.round(t.n_rows), ee = Math.round(t.n_cols);
      for (let e = 0; e < se; e++) {
        const o = G + t.a_edge + e * t.s_pitch;
        for (let n = 0; n < ee; n++) {
          const a = (n - (ee - 1) / 2) * t.s_pitch;
          for (const s of [
            K,
            Q
          ]) {
            const l = new de(new fe(t.d_bolt / 2, t.d_bolt / 2, t.tp + t.tf_beam + 0.01, 12), le);
            l.rotation.x = Math.PI / 2, l.position.set(o, a, s), U.push(l);
          }
        }
      }
      r.objects3D.val = U;
    },
    computedLabels(t) {
      const r = t.bp * t.tp, c = t.bf_beam * t.tf_beam * (t.d_beam - t.tf_beam) + t.tw_beam * Math.pow(t.d_beam - 2 * t.tf_beam, 2) / 4, d = t.Fy * c, v = 1.1 * 1.2 * d, I = t.a_edge + Math.round(t.n_rows) * t.s_pitch / 2, u = 0.9 * t.Fy * r, P = Math.PI * Math.pow(t.d_bolt / 2, 2), R = Math.round(t.n_rows) * Math.round(t.n_cols), z = 0.75, $ = 0.6 * t.Fu_bolt * P, p = z * $ * R, m = v / Math.max(t.d_beam - t.tf_beam, 0.1);
      return {
        "\u2500\u2500 Geometr\xEDa BFP (AISC 358 \xA77) \u2500\u2500": "",
        "Sh (r\xF3tula pl\xE1stica)": `${(I * 1e3).toFixed(0)} mm desde cara col`,
        "Lp largo placa": `${(t.Lp * 1e3).toFixed(0)} mm`,
        "bp \xD7 tp placa": `${(t.bp * 1e3).toFixed(0)} \xD7 ${(t.tp * 1e3).toFixed(0)} mm`,
        "\u2500\u2500 Capacidades \u2500\u2500": "",
        "Mp viga": `${d.toFixed(0)} kN\xB7m`,
        "M_pr (Cpr\xB7Ry\xB7Mp)": `${v.toFixed(0)} kN\xB7m`,
        "T demanda en placa": `${m.toFixed(0)} kN`,
        "\u2500\u2500 Placa de pat\xEDn \xA77.6 \u2500\u2500": "",
        A_p: `${(r * 1e4).toFixed(0)} cm\xB2`,
        "\u03C6Rn placa fluencia": `${u.toFixed(0)} kN`,
        "Ratio T/\u03C6Rn": `${(m / u).toFixed(3)} ${m <= u ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Pernos \xA77.5 \u2500\u2500": "",
        "N pernos por pat\xEDn": `${R}`,
        [`A_b (\xD8 ${(t.d_bolt * 1e3).toFixed(0)} mm)`]: `${(P * 1e6).toFixed(0)} mm\xB2`,
        "\u03C6Rn por perno": `${(z * $).toFixed(1)} kN`,
        "\u03A3\u03C6Rn pernos": `${p.toFixed(0)} kN`,
        "Ratio T/\u03A3\u03C6Rn": `${(m / p).toFixed(3)} ${m <= p ? "\u2713" : "\u2717"}`,
        "\u2500\u2500 Dictamen AISC 358 \xA77 \u2500\u2500": "",
        Status: m <= u && m <= p ? "\u2713 PASA precalificaci\xF3n BFP" : "\u2717 REVISAR"
      };
    }
  };
});
export {
  __tla,
  he as c
};
