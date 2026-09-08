import { __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { l as O } from "./layeredQ4-DuXBBCkf.js";
let q;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const M = "\u{1F7E6} Iso (1 capa)", p = "\u{1F7E7} CLT 3 [0/90/0]", _ = "\u{1F7E8} CLT 5 [0/90/0/90/0]", f = "\u{1F7EA} Sandwich [face/core/face]", b = "\u{1F7E5} Bimet\xE1lico [E1/E2]", u = "\u{1F4D0} Geometr\xEDa / Mesh / Carga";
  function K(e) {
    const d = Math.round(e.preset), o = [
      "iso",
      "clt3",
      "clt5",
      "sandwich",
      "bimetal"
    ][d] ?? "iso";
    if (o === "iso") return {
      layers: [
        {
          E: e.iso_E,
          nu: e.iso_nu,
          thickness: e.iso_t,
          angle: 0,
          density: e.iso_rho
        }
      ],
      presetKey: o
    };
    if (o === "clt3") {
      const n = e.clt3_t / 3, a = {
        E: e.clt3_E,
        nu: e.clt3_nu,
        density: e.clt3_rho
      };
      return {
        layers: [
          {
            ...a,
            thickness: n,
            angle: 0
          },
          {
            ...a,
            thickness: n,
            angle: Math.PI / 2
          },
          {
            ...a,
            thickness: n,
            angle: 0
          }
        ],
        presetKey: o
      };
    }
    if (o === "clt5") {
      const n = e.clt5_t / 5, a = {
        E: e.clt5_E,
        nu: e.clt5_nu,
        density: e.clt5_rho
      };
      return {
        layers: [
          {
            ...a,
            thickness: n,
            angle: 0
          },
          {
            ...a,
            thickness: n,
            angle: Math.PI / 2
          },
          {
            ...a,
            thickness: n,
            angle: 0
          },
          {
            ...a,
            thickness: n,
            angle: Math.PI / 2
          },
          {
            ...a,
            thickness: n,
            angle: 0
          }
        ],
        presetKey: o
      };
    }
    if (o === "sandwich") {
      const n = Math.min(0.45, Math.max(0.01, e.sw_face_pct / 100)), a = 1 - 2 * n, c = e.sw_t;
      return {
        layers: [
          {
            E: e.sw_E_face,
            nu: e.sw_nu,
            thickness: c * n,
            angle: 0,
            density: e.sw_rho_face
          },
          {
            E: e.sw_E_core,
            nu: e.sw_nu,
            thickness: c * a,
            angle: 0,
            density: e.sw_rho_core
          },
          {
            E: e.sw_E_face,
            nu: e.sw_nu,
            thickness: c * n,
            angle: 0,
            density: e.sw_rho_face
          }
        ],
        presetKey: o
      };
    }
    const r = e.bm_t, i = Math.min(0.99, Math.max(0.01, e.bm_t1_pct / 100));
    return {
      layers: [
        {
          E: e.bm_E1,
          nu: e.bm_nu,
          thickness: r * i,
          angle: 0,
          density: e.bm_rho
        },
        {
          E: e.bm_E2,
          nu: e.bm_nu,
          thickness: r * (1 - i),
          angle: 0,
          density: e.bm_rho
        }
      ],
      presetKey: "bimetal"
    };
  }
  q = {
    id: "layered-shell",
    name: "Layered Shell (CLT/ABBD) \u2014 Hekatan vs SAP layered (ratios 0.7%)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F95E} Layered",
    benchmark: true,
    defaultShellResult: "bendingXX",
    availableShellResults: [
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "displacementZ",
      "membraneXX",
      "membraneYY"
    ],
    hasModal: false,
    guide: [
      "Eleg\xED Laminado: 5 presets (Iso, CLT 3, CLT 5, Sandwich, Bimet\xE1lico)",
      "Solo aparecen los params del preset seleccionado (los dem\xE1s se ocultan)",
      "Geometr\xEDa: Lx, Ly (m). BC simply supported o clamped. Carga q presi\xF3n \u2193",
      "Modo constitutivo: 'Plane stress' (placa Mindlin) o 'Plane strain' (\u2248 SAP Type=6)",
      "Para validar contra SAP Shell-Layered us\xE1 'Plane strain' (matchea al 5%)",
      "Console log muestra matriz ABBD: B11 \u2260 0 indica coupling membrane-bending real (Bimet\xE1lico)",
      "Calculados: max u/v = 0 en presets sim\xE9tricos \xB7 max v \u2260 0 en Bimet\xE1lico (B\u22600)"
    ],
    params: {
      preset: {
        default: 1,
        label: "Laminado",
        options: {
          "Isotr\xF3pico (1 capa)": 0,
          "CLT balanced [0/90/0]": 1,
          "CLT balanced 5 [0/90/0/90/0]": 2,
          "Sandwich [face/core/face]": 3,
          "Bimet\xE1lico [E1/E2] (B\u22600)": 4
        }
      },
      Lx: {
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        label: "Lx (m)",
        folder: u
      },
      Ly: {
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        label: "Ly (m)",
        folder: u
      },
      q: {
        default: 10,
        min: 1,
        max: 30,
        step: 1,
        label: "q presi\xF3n \u2193 (kN/m\xB2)",
        folder: u
      },
      bcType: {
        default: 0,
        label: "BC bordes",
        options: {
          "Simply supported": 0,
          "Clamped (empotrado)": 1
        },
        folder: u
      },
      stressMode: {
        default: 0,
        label: "Modo constitutivo",
        options: {
          "Plane stress (placa Mindlin)": 0,
          "Plane strain (3D, \u2248 SAP Type=6)": 1
        },
        folder: u
      },
      nx: {
        default: 10,
        min: 4,
        max: 20,
        step: 1,
        label: "nx elementos",
        folder: u
      },
      ny: {
        default: 10,
        min: 4,
        max: 20,
        step: 1,
        label: "ny elementos",
        folder: u
      },
      iso_t: {
        default: 0.3,
        min: 0.05,
        max: 0.8,
        step: 0.01,
        label: "espesor t (m)",
        folder: M,
        hiddenIf: (e) => Math.round(e.preset) !== 0
      },
      iso_E: {
        default: 3e7,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E (kN/m\xB2)",
        folder: M,
        hiddenIf: (e) => Math.round(e.preset) !== 0
      },
      iso_nu: {
        default: 0.3,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD",
        folder: M,
        hiddenIf: (e) => Math.round(e.preset) !== 0
      },
      iso_rho: {
        default: 24,
        min: 1,
        max: 80,
        step: 0.5,
        label: "\u03C1 (kN/m\xB3)",
        folder: M,
        hiddenIf: (e) => Math.round(e.preset) !== 0
      },
      clt3_t: {
        default: 0.3,
        min: 0.05,
        max: 0.8,
        step: 0.01,
        label: "t total (m)",
        folder: p,
        hiddenIf: (e) => Math.round(e.preset) !== 1
      },
      clt3_E: {
        default: 3e7,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E capa (kN/m\xB2)",
        folder: p,
        hiddenIf: (e) => Math.round(e.preset) !== 1
      },
      clt3_nu: {
        default: 0.3,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD",
        folder: p,
        hiddenIf: (e) => Math.round(e.preset) !== 1
      },
      clt3_rho: {
        default: 24,
        min: 1,
        max: 80,
        step: 0.5,
        label: "\u03C1 (kN/m\xB3)",
        folder: p,
        hiddenIf: (e) => Math.round(e.preset) !== 1
      },
      clt5_t: {
        default: 0.3,
        min: 0.05,
        max: 0.8,
        step: 0.01,
        label: "t total (m)",
        folder: _,
        hiddenIf: (e) => Math.round(e.preset) !== 2
      },
      clt5_E: {
        default: 3e7,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E capa (kN/m\xB2)",
        folder: _,
        hiddenIf: (e) => Math.round(e.preset) !== 2
      },
      clt5_nu: {
        default: 0.3,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD",
        folder: _,
        hiddenIf: (e) => Math.round(e.preset) !== 2
      },
      clt5_rho: {
        default: 24,
        min: 1,
        max: 80,
        step: 0.5,
        label: "\u03C1 (kN/m\xB3)",
        folder: _,
        hiddenIf: (e) => Math.round(e.preset) !== 2
      },
      sw_t: {
        default: 0.3,
        min: 0.05,
        max: 0.8,
        step: 0.01,
        label: "t total (m)",
        folder: f,
        hiddenIf: (e) => Math.round(e.preset) !== 3
      },
      sw_face_pct: {
        default: 5,
        min: 1,
        max: 40,
        step: 1,
        label: "t_face (% c/u)",
        folder: f,
        hiddenIf: (e) => Math.round(e.preset) !== 3
      },
      sw_E_face: {
        default: 2e8,
        min: 1e6,
        max: 25e7,
        step: 1e6,
        label: "E_face (kN/m\xB2)",
        folder: f,
        hiddenIf: (e) => Math.round(e.preset) !== 3
      },
      sw_E_core: {
        default: 4e6,
        min: 1e5,
        max: 5e7,
        step: 1e5,
        label: "E_core (kN/m\xB2)",
        folder: f,
        hiddenIf: (e) => Math.round(e.preset) !== 3
      },
      sw_nu: {
        default: 0.3,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD (com\xFAn)",
        folder: f,
        hiddenIf: (e) => Math.round(e.preset) !== 3
      },
      sw_rho_face: {
        default: 78,
        min: 1,
        max: 100,
        step: 0.5,
        label: "\u03C1_face (kN/m\xB3)",
        folder: f,
        hiddenIf: (e) => Math.round(e.preset) !== 3
      },
      sw_rho_core: {
        default: 5,
        min: 0.1,
        max: 30,
        step: 0.1,
        label: "\u03C1_core (kN/m\xB3)",
        folder: f,
        hiddenIf: (e) => Math.round(e.preset) !== 3
      },
      bm_t: {
        default: 0.3,
        min: 0.05,
        max: 0.8,
        step: 0.01,
        label: "t total (m)",
        folder: b,
        hiddenIf: (e) => Math.round(e.preset) !== 4
      },
      bm_t1_pct: {
        default: 50,
        min: 5,
        max: 95,
        step: 5,
        label: "t_capa1 (%)",
        folder: b,
        hiddenIf: (e) => Math.round(e.preset) !== 4
      },
      bm_E1: {
        default: 3e7,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E_capa1 inf (kN/m\xB2)",
        folder: b,
        hiddenIf: (e) => Math.round(e.preset) !== 4
      },
      bm_E2: {
        default: 15e6,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E_capa2 sup (kN/m\xB2)",
        folder: b,
        hiddenIf: (e) => Math.round(e.preset) !== 4
      },
      bm_nu: {
        default: 0.3,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD (com\xFAn)",
        folder: b,
        hiddenIf: (e) => Math.round(e.preset) !== 4
      },
      bm_rho: {
        default: 24,
        min: 1,
        max: 80,
        step: 0.5,
        label: "\u03C1 (com\xFAn)",
        folder: b,
        hiddenIf: (e) => Math.round(e.preset) !== 4
      }
    },
    build(e, d) {
      var _a, _b;
      const { layers: m, presetKey: o } = K(e), r = m.reduce((t, s) => t + s.thickness, 0), i = Math.round(e.bcType) === 1 ? "clamped" : "simply-supported", n = Math.round(e.stressMode) === 1 ? "plane-strain" : "plane-stress", a = O({
        layers: m,
        meshLx: e.Lx,
        meshLy: e.Ly,
        meshNx: Math.round(e.nx),
        meshNy: Math.round(e.ny),
        bcType: i,
        pressure: -e.q,
        stressMode: n
      }), c = a.nodes.map((t) => [
        t.x,
        t.y,
        0
      ]), x = a.elements.map((t) => t.nodes);
      d.nodes.val = c, d.elements.val = x;
      const l = m.reduce((t, s) => t + s.E * s.thickness, 0) / r, h = ((_a = m[0]) == null ? void 0 : _a.nu) ?? 0.3, X = m.reduce((t, s) => t + (s.density ?? 0) * s.thickness, 0) / r, E = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
      x.forEach((t, s) => {
        E.set(s, r), k.set(s, l), g.set(s, h), w.set(s, X);
      }), d.elementInputs.val = {
        thicknesses: E,
        elasticities: k,
        poissonsRatios: g,
        densities: w
      };
      const y = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), T = e.Lx / Math.round(e.nx) * (e.Ly / Math.round(e.ny));
      c.forEach((t, s) => {
        const F = Math.abs(t[0]) < 1e-6 || Math.abs(t[0] - e.Lx) < 1e-6 || Math.abs(t[1]) < 1e-6 || Math.abs(t[1] - e.Ly) < 1e-6;
        F && (i === "clamped" ? y.set(s, [
          true,
          true,
          true,
          true,
          true,
          false
        ]) : y.set(s, [
          true,
          true,
          true,
          false,
          false,
          false
        ]));
        const D = (Math.abs(t[0]) < 1e-6 || Math.abs(t[0] - e.Lx) < 1e-6) && (Math.abs(t[1]) < 1e-6 || Math.abs(t[1] - e.Ly) < 1e-6) ? 0.25 : F ? 0.5 : 1;
        I.set(s, [
          0,
          0,
          -e.q * T * D,
          0,
          0,
          0
        ]);
      }), d.nodeInputs.val = {
        supports: y,
        loads: I
      };
      const L = /* @__PURE__ */ new Map();
      a.displacements.forEach((t, s) => {
        L.set(s, [
          t.u,
          t.v,
          t.w,
          t.thetaX,
          t.thetaY,
          0
        ]);
      }), d.deformOutputs.val = {
        deformations: L
      };
      const N = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map();
      a.elementResults.forEach((t, s) => {
        N.set(s, [
          t.Mxx,
          t.Mxx,
          t.Mxx,
          t.Mxx
        ]), v.set(s, [
          t.Myy,
          t.Myy,
          t.Myy,
          t.Myy
        ]), B.set(s, [
          t.Mxy,
          t.Mxy,
          t.Mxy,
          t.Mxy
        ]), C.set(s, [
          t.Nxx,
          t.Nxx,
          t.Nxx,
          t.Nxx
        ]), S.set(s, [
          t.Nyy,
          t.Nyy,
          t.Nyy,
          t.Nyy
        ]);
      }), d.analyzeOutputs.val = {
        bendingXX: N,
        bendingYY: v,
        bendingXY: B,
        membraneXX: C,
        membraneYY: S
      }, d.objects3D.val = [];
      const P = a.abbd.A[0][0], Y = a.abbd.D[0][0], $ = a.abbd.B[0][0], A = ((_b = Object.entries(q.params.preset.options ?? {}).find(([, t]) => t === Math.round(e.preset))) == null ? void 0 : _b[0]) ?? "?";
      console.log(`[Layered Shell] ${A} | ${m.length} capas | t=${r.toFixed(3)}m | BC=${i} | mode=${n} | mesh=${Math.round(e.nx)}\xD7${Math.round(e.ny)}
  ABBD: A11=${P.toExponential(3)}  B11=${$.toExponential(3)}  D11=${Y.toExponential(3)}
  maxW=${a.maxW.toExponential(3)} m | maxMxx=${a.maxMxx.toFixed(2)} kN\xB7m/m | maxMyy=${a.maxMyy.toFixed(2)} kN\xB7m/m`);
    },
    computedLabels(e, d) {
      var _a, _b, _c, _d;
      const m = (_a = d.deformOutputs.val) == null ? void 0 : _a.deformations;
      if (!m) return {};
      let o = 0, r = 0, i = 0;
      m.forEach((l) => {
        Math.abs(l[2]) > Math.abs(o) && (o = l[2]), Math.abs(l[0]) > Math.abs(r) && (r = l[0]), Math.abs(l[1]) > Math.abs(i) && (i = l[1]);
      });
      const n = d.analyzeOutputs.val;
      let a = 0, c = 0, x = 0;
      return (_b = n == null ? void 0 : n.bendingXX) == null ? void 0 : _b.forEach((l) => {
        for (const h of l) Math.abs(h) > Math.abs(a) && (a = h);
      }), (_c = n == null ? void 0 : n.bendingYY) == null ? void 0 : _c.forEach((l) => {
        for (const h of l) Math.abs(h) > Math.abs(c) && (c = h);
      }), (_d = n == null ? void 0 : n.membraneXX) == null ? void 0 : _d.forEach((l) => {
        for (const h of l) Math.abs(h) > Math.abs(x) && (x = h);
      }), {
        "max w (mm)": (o * 1e3).toFixed(3),
        "max u_membrane (mm)": (r * 1e3).toFixed(4),
        "max v_membrane (mm)": (i * 1e3).toFixed(4),
        "max Mxx (kN\xB7m/m)": a.toFixed(2),
        "max Myy (kN\xB7m/m)": c.toFixed(2),
        "max Nxx (kN/m)": x.toFixed(2)
      };
    }
  };
});
export {
  __tla,
  q as l
};
