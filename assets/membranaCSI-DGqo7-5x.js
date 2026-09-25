import { a as O, __tla as __tla_0 } from "./analyze-CC0LMJ9d.js";
import { m as j, d as z, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let D;
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
  let _, F, V;
  _ = 24;
  F = 9.81;
  V = _ / F;
  D = {
    id: "membrana-csi",
    name: "Membrana CSI (Shell-Membrane + tri/trap load)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F500} Losas con vigas",
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
    hasModal: true,
    params: {
      Lx: {
        default: 5,
        min: 2,
        max: 10,
        step: 0.25,
        label: "Lx (m)"
      },
      Ly: {
        default: 4,
        min: 2,
        max: 10,
        step: 0.25,
        label: "Ly (m)"
      },
      t: {
        default: 0.15,
        min: 0.08,
        max: 0.3,
        step: 0.01,
        label: "t losa (m)"
      },
      E: {
        default: 25e6,
        min: 5e6,
        max: 2e8,
        step: 1e6,
        label: "E (kN/m\xB2)"
      },
      nu: {
        default: 0.2,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD"
      },
      q: {
        default: 8,
        min: 1,
        max: 30,
        step: 1,
        label: "q carga \u2193 (kN/m\xB2)"
      },
      bViga: {
        default: 0.3,
        min: 0.2,
        max: 0.6,
        step: 0.05,
        label: "b viga (m)"
      },
      hViga: {
        default: 0.5,
        min: 0.3,
        max: 0.9,
        step: 0.05,
        label: "h viga (m)"
      },
      nx: {
        default: 10,
        min: 4,
        max: 20,
        step: 1,
        label: "nx elem X"
      },
      ny: {
        default: 8,
        min: 4,
        max: 20,
        step: 1,
        label: "ny elem Y"
      }
    },
    build(a, s) {
      const n = Math.round(a.nx), o = Math.round(a.ny), h = a.Lx / n, f = a.Ly / o, m = [];
      for (let e = 0; e <= o; e++) for (let t = 0; t <= n; t++) m.push([
        t * h,
        e * f,
        0
      ]);
      const l = [];
      for (let e = 0; e < o; e++) for (let t = 0; t < n; t++) {
        const r = e * (n + 1) + t;
        l.push([
          r,
          r + 1,
          r + 1 + (n + 1),
          r + (n + 1)
        ]);
      }
      const g = l.length;
      for (let e = 0; e < n; e++) l.push([
        e,
        e + 1
      ]);
      const i = o * (n + 1);
      for (let e = 0; e < n; e++) l.push([
        i + e,
        i + e + 1
      ]);
      for (let e = 0; e < o; e++) l.push([
        e * (n + 1),
        (e + 1) * (n + 1)
      ]);
      for (let e = 0; e < o; e++) l.push([
        e * (n + 1) + n,
        (e + 1) * (n + 1) + n
      ]);
      const c = /* @__PURE__ */ new Map();
      [
        0,
        n,
        i,
        i + n
      ].forEach((e) => c.set(e, [
        true,
        true,
        true,
        false,
        false,
        false
      ]));
      const d = /* @__PURE__ */ new Map();
      for (let e = 0; e <= o; e++) for (let t = 0; t <= n; t++) {
        const r = e * (n + 1) + t, E = (t === 0 || t === n) && (e === 0 || e === o) ? 0.25 : t === 0 || t === n || e === 0 || e === o ? 0.5 : 1, k = -a.q * h * f * E;
        d.set(r, [
          0,
          0,
          k,
          0,
          0,
          0
        ]);
      }
      const M = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), C = a.E / (2 * (1 + a.nu));
      for (let e = 0; e < g; e++) M.set(e, a.t), u.set(e, a.E), b.set(e, a.nu), x.set(e, V);
      const Y = a.bViga * a.hViga, N = a.bViga * a.hViga ** 3 / 12, X = a.hViga * a.bViga ** 3 / 12, q = 0.28 * a.bViga * a.hViga ** 3;
      for (let e = g; e < l.length; e++) u.set(e, a.E), b.set(e, a.nu), I.set(e, C), v.set(e, Y), p.set(e, N), y.set(e, X), L.set(e, q), x.set(e, V), w.set(e, {
        type: "rect",
        b: a.bViga,
        h: a.hViga
      });
      s.nodes.val = m, s.elements.val = l, s.nodeInputs.val = {
        supports: c,
        loads: d
      }, s.elementInputs.val = {
        elasticities: u,
        poissonsRatios: b,
        shearModuli: I,
        areas: v,
        momentsOfInertiaY: p,
        momentsOfInertiaZ: y,
        torsionalConstants: L,
        thicknesses: M,
        densities: x,
        sectionShapes: w
      };
      try {
        s.deformOutputs.val = z(m, l, {
          supports: c,
          loads: d
        }, s.elementInputs.val), s.analyzeOutputs.val = O(m, l, s.elementInputs.val, s.deformOutputs.val);
        const e = a.Lx < a.Ly, t = a.q * Math.min(a.Lx, a.Ly) / 2, r = a.q * Math.min(a.Lx, a.Ly) / 2, $ = Math.max(...[
          ...s.deformOutputs.val.deformations.values()
        ].map((S) => Math.abs(S[2])));
        console.log(`[Membrana CSI] Losa ${a.Lx}\xD7${a.Ly}m t=${a.t}m q=${a.q} kN/m\xB2
  Shell Q4 membrana con drilling DOF (Rz activo)
  CSI apportionment by area: q \xD7 A_trib a cada nodo
  Distribuci\xF3n emergente a vigas perimetrales:
    Vigas ${e ? "cortas" : "largas"} (lado ${Math.min(a.Lx, a.Ly)}m): trapecio w_max=${t.toFixed(2)} kN/m
    Vigas ${e ? "largas" : "cortas"} (lado ${Math.max(a.Lx, a.Ly)}m): tri\xE1ngulo w_max=${r.toFixed(2)} kN/m
  \u03B4_max = ${($ * 1e3).toFixed(3)} mm`);
      } catch (e) {
        console.error("Membrana CSI solver error:", e);
      }
      s.objects3D.val = [];
    },
    runModal: function(a, s, n) {
      try {
        const o = j(s.nodes.val, s.elements.val, s.nodeInputs.val, s.elementInputs.val, 12);
        n.render(o, {
          title: `Membrana CSI ${a.Lx}\xD7${a.Ly}m t=${a.t}m`,
          properties: [
            `E=${(a.E / 1e6).toFixed(1)} GPa  \u03BD=${a.nu}  \u03B3=${_} kN/m\xB3`
          ]
        });
      } catch (o) {
        console.warn("Modal membrana CSI error:", o.message);
      }
    }
  };
});
export {
  __tla,
  D as m
};
