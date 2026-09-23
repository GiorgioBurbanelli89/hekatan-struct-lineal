import { a as G } from "./analyze-C-HJ03ae.js";
import { d as K, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
let Q;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  Q = {
    id: "slab-beams-columns",
    name: "Slab + Vigas + Columnas (1 piso completo)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F500} Losas con vigas",
    benchmark: true,
    defaultShellResult: "bendingXX",
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
      Lx: {
        default: 6,
        min: 2,
        max: 12,
        step: 0.5,
        label: "Lx (m)"
      },
      Ly: {
        default: 4,
        min: 2,
        max: 12,
        step: 0.5,
        label: "Ly (m)"
      },
      h: {
        default: 3,
        min: 2,
        max: 6,
        step: 0.25,
        label: "h piso (m)"
      },
      t: {
        default: 0.1,
        min: 0.05,
        max: 0.4,
        step: 0.01,
        label: "t losa (m)"
      },
      bW: {
        default: 0.3,
        min: 0.15,
        max: 0.6,
        step: 0.05,
        label: "viga b (m)"
      },
      bH: {
        default: 0.5,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "viga h (m)"
      },
      cS: {
        default: 0.3,
        min: 0.2,
        max: 0.6,
        step: 0.05,
        label: "col \u25A1 (m)"
      },
      E: {
        default: 35e6,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E (kN/m\xB2)"
      },
      nu: {
        default: 0.15,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD"
      },
      q: {
        default: 10,
        min: 1,
        max: 30,
        step: 1,
        label: "q \u2193 (kN/m\xB2)"
      },
      nx: {
        default: 6,
        min: 2,
        max: 12,
        step: 1,
        label: "nx"
      },
      ny: {
        default: 4,
        min: 2,
        max: 12,
        step: 1,
        label: "ny"
      },
      nz: {
        default: 3,
        min: 1,
        max: 8,
        step: 1,
        label: "nz col (segmentos)"
      }
    },
    build(n, a) {
      const l = Math.round(n.nx), m = Math.round(n.ny), X = Math.round(n.nz), Y = n.Lx / l, z = n.Ly / m, A = n.h / X, r = [], t = (e, s) => s * (l + 1) + e;
      for (let e = 0; e <= m; e++) for (let s = 0; s <= l; s++) r.push([
        s * Y,
        e * z,
        n.h
      ]);
      r.length;
      const q = [
        t(0, 0),
        t(l, 0),
        t(0, m),
        t(l, m)
      ], J = [
        [
          0,
          0
        ],
        [
          n.Lx,
          0
        ],
        [
          0,
          n.Ly
        ],
        [
          n.Lx,
          n.Ly
        ]
      ], d = [
        [],
        [],
        [],
        []
      ];
      for (let e = 0; e < 4; e++) {
        d[e].push(q[e]);
        const [s, o] = J[e];
        for (let b = 1; b <= X; b++) {
          const L = n.h - b * A;
          r.push([
            s,
            o,
            L
          ]), d[e].push(r.length - 1);
        }
      }
      const p = [];
      for (let e = 0; e < m; e++) for (let s = 0; s < l; s++) p.push([
        t(s, e),
        t(s + 1, e),
        t(s + 1, e + 1),
        t(s, e + 1)
      ]);
      const c = p.length, i = [];
      for (let e = 0; e < l; e++) i.push([
        t(e, 0),
        t(e + 1, 0)
      ]);
      for (let e = 0; e < l; e++) i.push([
        t(e, m),
        t(e + 1, m)
      ]);
      for (let e = 0; e < m; e++) i.push([
        t(0, e),
        t(0, e + 1)
      ]);
      for (let e = 0; e < m; e++) i.push([
        t(l, e),
        t(l, e + 1)
      ]);
      const u = i.length, M = [];
      for (let e = 0; e < 4; e++) {
        const s = d[e];
        for (let o = 0; o < s.length - 1; o++) M.push([
          s[o],
          s[o + 1]
        ]);
      }
      const g = M.length, w = [
        ...p,
        ...i,
        ...M
      ];
      a.nodes.val = r, a.elements.val = w;
      const N = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), O = n.E / (2 * (1 + n.nu));
      for (let e = 0; e < c; e++) N.set(e, n.t), f.set(e, n.E), h.set(e, n.nu), x.set(e, 24 / 9.80665), k.set(e, 2);
      const B = n.bW * n.bH, j = n.bW * n.bH ** 3 / 12, C = n.bH * n.bW ** 3 / 12, F = j + C;
      for (let e = 0; e < u; e++) {
        const s = c + e;
        f.set(s, n.E), h.set(s, n.nu), x.set(s, 24 / 9.80665), v.set(s, B), _.set(s, j), y.set(s, C), S.set(s, F), I.set(s, O), E.set(s, [
          n.bH,
          n.bW
        ]), H.set(s, [
          0,
          0,
          1
        ]);
      }
      const T = n.cS * n.cS, R = n.cS ** 4 / 12, Z = 0.141 * n.cS ** 4;
      for (let e = 0; e < g; e++) {
        const s = c + u + e;
        f.set(s, n.E), h.set(s, n.nu), x.set(s, 24 / 9.80665), v.set(s, T), _.set(s, R), y.set(s, R), S.set(s, Z), I.set(s, O), E.set(s, [
          n.cS,
          n.cS
        ]);
      }
      a.elementInputs.val = {
        thicknesses: N,
        elasticities: f,
        poissonsRatios: h,
        densities: x,
        areas: v,
        momentsOfInertiaY: y,
        momentsOfInertiaZ: _,
        torsionalConstants: S,
        orientations: H,
        sections: E,
        shearModuli: I,
        plateFormulations: k
      };
      const P = /* @__PURE__ */ new Map();
      for (let e = 0; e < 4; e++) {
        const s = d[e][d[e].length - 1];
        P.set(s, [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
      }
      const W = /* @__PURE__ */ new Map(), D = n.q * Y * z;
      for (let e = 0; e <= m; e++) for (let s = 0; s <= l; s++) {
        const o = s === 0 || s === l, b = e === 0 || e === m, L = o && b ? 0.25 : o || b ? 0.5 : 1;
        W.set(t(s, e), [
          0,
          0,
          -D * L,
          0,
          0,
          0
        ]);
      }
      a.nodeInputs.val = {
        supports: P,
        loads: W
      };
      try {
        a.deformOutputs.val = K(r, w, a.nodeInputs.val, a.elementInputs.val), a.analyzeOutputs.val = G(r, w, a.elementInputs.val, a.deformOutputs.val);
        const e = a.deformOutputs.val.deformations;
        let s = 0;
        e == null ? void 0 : e.forEach((o) => {
          Math.abs(o[2]) > Math.abs(s) && (s = o[2]);
        }), window.__lastHekatanResult = {
          example: "slab-beams-columns",
          params: {
            ...n
          },
          n_nodes: r.length,
          n_shells: c,
          n_beams: u,
          n_cols: g,
          w_max_m: s,
          w_max_mm: s * 1e3,
          ranges: {
            shells: {
              start: 0,
              end: c - 1
            },
            beams: {
              start: c,
              end: c + u - 1
            },
            columns: {
              start: c + u,
              end: c + u + g - 1
            }
          }
        }, console.log("HEKATAN_RESULT:", JSON.stringify(window.__lastHekatanResult));
      } catch (e) {
        console.error("slab-beams-columns build error:", e == null ? void 0 : e.message);
      }
      a.objects3D.val = [];
    }
  };
});
export {
  __tla,
  Q as s
};
