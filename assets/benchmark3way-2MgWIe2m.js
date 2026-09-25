import { a as P, __tla as __tla_0 } from "./analyze-DW0aWqsq.js";
import { d as q, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let J;
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
  let Z, D;
  Z = {
    "shellThin/areaOnly": -2.42,
    "shellThin/perimFrames": -3.055,
    "shellThin/fullBuilding": -2.5,
    "shellThick/areaOnly": -2.42,
    "shellThick/perimFrames": -3.032,
    "shellThick/fullBuilding": -2.5,
    "plateThin/areaOnly": -2.42,
    "plateThick/areaOnly": -2.42,
    "membrane/areaOnly": 0.126,
    "plane/areaOnly": 0.126
  };
  D = {
    "shellThin/areaOnly": -2.371,
    "shellThin/perimFrames": -2.371,
    "shellThick/areaOnly": -2.371,
    "shellThick/perimFrames": -2.371,
    "plateThin/areaOnly": -2.371,
    "membrane/areaOnly": 0.084
  };
  J = {
    id: "benchmark-3way",
    name: "\u{1F3C1} Benchmark 3-way (Shell+Frame DOF mismatch)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F500} Losas con vigas",
    benchmark: true,
    defaultShellResult: "displacementZ",
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
      areaType: {
        default: 1,
        label: "Tipo de \xC1rea",
        options: {
          "membrane (in-plane only)": 0,
          "shellThin (Kirchhoff)": 1,
          "shellThick (Mindlin)": 2,
          "plateThin (no membrane)": 3,
          "plateThick (no membrane)": 4,
          "plane (in-plane only)": 5,
          "layered (CLT approx)": 6
        }
      },
      setup: {
        default: 1,
        label: "Configuraci\xF3n",
        options: {
          "areaOnly (BCs en bordes)": 0,
          "perimFrames (vigas+4 cols esquina)": 1,
          "fullBuilding (cruz interna+col centro)": 2
        }
      },
      Lx: {
        default: 4,
        min: 2,
        max: 8,
        step: 0.5,
        label: "Lx (m)",
        folder: "Geometr\xEDa"
      },
      Ly: {
        default: 4,
        min: 2,
        max: 8,
        step: 0.5,
        label: "Ly (m)",
        folder: "Geometr\xEDa"
      },
      nx: {
        default: 4,
        min: 2,
        max: 16,
        step: 1,
        label: "nx mesh",
        folder: "Geometr\xEDa"
      },
      ny: {
        default: 4,
        min: 2,
        max: 16,
        step: 1,
        label: "ny mesh",
        folder: "Geometr\xEDa"
      },
      t: {
        default: 0.1,
        min: 0.05,
        max: 0.4,
        step: 0.01,
        label: "espesor (m)",
        folder: "Geometr\xEDa"
      },
      E_c: {
        default: 25e6,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E concreto (kN/m\xB2)",
        folder: "Material"
      },
      nu_c: {
        default: 0.2,
        min: 0,
        max: 0.45,
        step: 0.01,
        label: "\u03BD concreto",
        folder: "Material"
      },
      E_s: {
        default: 2e8,
        min: 1e8,
        max: 25e7,
        step: 5e6,
        label: "E acero (kN/m\xB2)",
        folder: "Material"
      },
      A_b: {
        default: 7610,
        min: 1e3,
        max: 3e4,
        step: 100,
        label: "A viga (mm\xB2)",
        folder: "Frame W360x60"
      },
      Iy_b: {
        default: 12.9,
        min: 1,
        max: 100,
        step: 0.5,
        label: "Iy strong (\xD710\u207B\u2075 m\u2074)",
        folder: "Frame W360x60"
      },
      Iz_b: {
        default: 1.2,
        min: 0.1,
        max: 50,
        step: 0.1,
        label: "Iz weak (\xD710\u207B\u2075 m\u2074)",
        folder: "Frame W360x60"
      },
      q: {
        default: 5,
        min: 0.5,
        max: 30,
        step: 0.5,
        label: "q vertical (kN/m\xB2)",
        folder: "Carga",
        unitType: "force"
      },
      F: {
        default: 100,
        min: 10,
        max: 500,
        step: 10,
        label: "F lateral (kN)",
        folder: "Carga",
        unitType: "force"
      }
    },
    build(r, m) {
      var _a;
      const $ = [
        "membrane",
        "shellThin",
        "shellThick",
        "plateThin",
        "plateThick",
        "plane",
        "layered"
      ], Y = [
        "areaOnly",
        "perimFrames",
        "fullBuilding"
      ], h = $[Math.round(r.areaType)] || "shellThin", d = Y[Math.round(r.setup)] || "perimFrames", f = !(h === "membrane" || h === "plane"), j = r.Lx, X = r.Ly, t = Math.round(r.nx), o = Math.round(r.ny), l = t + 1, z = o + 1, b = j / t, y = X / o, N = f ? 4 : 0, i = [];
      if (f) for (let e = 0; e <= o; e++) for (let a = 0; a <= t; a++) i.push([
        a * b,
        e * y,
        N
      ]);
      else for (let e = 0; e <= o; e++) for (let a = 0; a <= t; a++) i.push([
        a * b,
        0,
        e * y
      ]);
      const x = [];
      for (let e = 0; e < o; e++) for (let a = 0; a < t; a++) {
        const n = e * l + a;
        x.push([
          n,
          n + 1,
          (e + 1) * l + a + 1,
          (e + 1) * l + a
        ]);
      }
      const c = [];
      let M = 0;
      if (d === "perimFrames" || d === "fullBuilding") {
        for (let a = 0; a < t; a++) c.push([
          a,
          a + 1
        ]);
        const e = o * l;
        for (let a = 0; a < t; a++) c.push([
          e + a,
          e + a + 1
        ]);
        for (let a = 0; a < o; a++) c.push([
          a * l,
          (a + 1) * l
        ]);
        for (let a = 0; a < o; a++) c.push([
          a * l + t,
          (a + 1) * l + t
        ]);
        if (f) {
          const a = i.length;
          i.push([
            0,
            0,
            0
          ]), i.push([
            t * b,
            0,
            0
          ]), i.push([
            0,
            o * y,
            0
          ]), i.push([
            t * b,
            o * y,
            0
          ]);
          const n = [
            0,
            t,
            o * l,
            o * l + t
          ];
          for (let s = 0; s < 4; s++) c.push([
            a + s,
            n[s]
          ]);
          M = 4;
        }
      }
      if (d === "fullBuilding" && f) {
        const e = Math.floor(t / 2), a = Math.floor(o / 2);
        for (let s = 0; s < t; s++) c.push([
          a * l + s,
          a * l + s + 1
        ]);
        for (let s = 0; s < o; s++) c.push([
          s * l + e,
          (s + 1) * l + e
        ]);
        const n = i.length;
        i.push([
          e * b,
          a * y,
          0
        ]), c.push([
          n,
          a * l + e
        ]), M += 1;
      }
      const _ = [
        ...x,
        ...c
      ], u = /* @__PURE__ */ new Map();
      if (d === "areaOnly") if (f) {
        for (let e = 0; e <= t; e++) u.set(e, [
          true,
          true,
          true,
          false,
          false,
          false
        ]), u.set(o * l + e, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
        for (let e = 0; e <= o; e++) u.set(e * l, [
          true,
          true,
          true,
          false,
          false,
          false
        ]), u.set(e * l + t, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
      } else for (let e = 0; e <= t; e++) u.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      else if (f) {
        const e = [
          true,
          true,
          true,
          false,
          false,
          false
        ], a = l * z;
        for (let n = 0; n < M; n++) u.set(a + n, e);
      } else for (let e = 0; e <= t; e++) u.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const T = /* @__PURE__ */ new Map();
      if (f) for (const e of x) {
        const a = b * y, n = -r.q * a / 4;
        for (const s of e) {
          const p = T.get(s) || [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p[2] += n, T.set(s, p);
        }
      }
      else {
        const e = r.F / l;
        for (let a = 0; a <= t; a++) {
          const n = o * l + a;
          T.set(n, [
            e,
            0,
            0,
            0,
            0,
            0
          ]);
        }
      }
      let w = r.t;
      (h === "membrane" || h === "plane") && (w = Math.max(1e-3, r.t * 0.01));
      const g = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), R = r.E_c / (2 * (1 + r.nu_c));
      for (let e = 0; e < x.length; e++) g.set(e, r.E_c), B.set(e, r.nu_c), E.set(e, w), k.set(e, R), v.set(e, 24 / 9.80665);
      for (let e = 0; e < c.length; e++) {
        const a = x.length + e;
        g.set(a, r.E_s), k.set(a, r.E_s / 2.6), I.set(a, r.A_b * 1e-6), S.set(a, r.Iy_b * 1e-5), A.set(a, r.Iz_b * 1e-5), L.set(a, 31e-8), v.set(a, 78.5 / 9.80665);
      }
      m.nodes.val = i, m.elements.val = _, m.nodeInputs.val = {
        supports: u,
        loads: T
      }, m.elementInputs.val = {
        elasticities: g,
        poissonsRatios: B,
        thicknesses: E,
        shearModuli: k,
        areas: I,
        momentsOfInertiaZ: S,
        momentsOfInertiaY: A,
        torsionalConstants: L,
        densities: v
      };
      try {
        m.deformOutputs.val = q(i, _, {
          supports: u,
          loads: T
        }, m.elementInputs.val), m.analyzeOutputs.val = P(i, _, m.elementInputs.val, m.deformOutputs.val);
      } catch (e) {
        console.error(`Benchmark 3-way solver error (${h}/${d}):`, e.message);
      }
      m.objects3D.val = [];
      const F = `${h}/${d}`, C = Math.floor(t / 2), G = Math.floor(o / 2) * l + C, O = (_a = m.deformOutputs.val.deformations) == null ? void 0 : _a.get(G);
      if (O) {
        const e = (f ? O[2] : O[0]) * 1e3, a = f ? "w_centro" : "ux_top", n = Z[F], s = D[F];
        if (console.log(`[Benchmark 3-way] ${F}
  ${a} = ${e.toFixed(4)} mm` + (s !== void 0 ? `  (MATLAB: ${s.toFixed(4)})` : "") + (n !== void 0 ? `  (ETABS ref: ${n.toFixed(4)})` : "")), n !== void 0 && Math.abs(n) > 1e-9) {
          const p = Math.abs(e - n) / Math.abs(n) * 100;
          p > 50 ? console.warn(`  \u26A0 ERROR ${p.toFixed(0)}% vs ETABS \u2014 bug DOF mismatch (ver BUG_ANALYSIS_*.md)`) : p > 10 ? console.warn(`  \u0394 ${p.toFixed(1)}% vs ETABS`) : console.log(`  \u2713 \u0394 ${p.toFixed(2)}% vs ETABS`);
        }
      }
    }
  };
});
export {
  __tla,
  J as b
};
