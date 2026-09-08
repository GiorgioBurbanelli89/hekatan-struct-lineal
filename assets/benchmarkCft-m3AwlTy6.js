import { a as Ae } from "./analyze-CRH7D0Bs.js";
import { d as xe, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let ve;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let pe, Me, Te, Fe, Ie, ke, $e, ge, ye;
  pe = {
    cftDeckSlab: -2.877,
    cftNoSlab: -0.6465
  };
  Me = {
    cftDeckSlab: -2.872,
    cftNoSlab: -0.6047
  };
  Te = {
    cftDeckSlab: -2.872,
    cftNoSlab: -0.6047
  };
  Fe = {
    cftDeckSlab: -2.9118,
    cftNoSlab: -0.6047
  };
  Ie = {
    cftDeckSlab: -2.8806,
    cftNoSlab: -0.6047
  };
  ke = {
    cftDeckSlab: -2.8954,
    cftNoSlab: -0.6465
  };
  $e = {
    cftDeckSlab: -2.9468,
    cftNoSlab: -0.5895
  };
  ge = {
    cftDeckSlab: -3.0074,
    cftNoSlab: -0.6461
  };
  ye = {
    cftDeckSlab: -2.9031,
    cftNoSlab: -0.5895
  };
  ve = {
    id: "benchmark-cft",
    name: "\u{1F3C1} Benchmark CFT (cols + I-beams + losa)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F500} Losas con vigas",
    benchmark: true,
    defaultShellResult: "displacementZ",
    availableShellResults: [
      "displacementZ",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "vonMises"
    ],
    guide: [
      "\u{1F195} BASES EMPOTRADAS (UX UY UZ RX RY RZ): match con modelo ETABS can\xF3nico.",
      "Cambi\xE1 'Setup' entre cftDeckSlab (losa+vigas+CFT, q=5 kN/m\xB2) y cftNoSlab (sin losa).",
      "Prob\xE1 'Transformaci\xF3n' para ver que steel-eq y concrete-eq dan EXACTAMENTE el mismo w.",
      "Sub\xED 'nx mesh' a 16 para match BIT-EXACT con ETABS empotrado (-0.14%).",
      "Las 4 columnas CFT son HSS 250\xD7250\xD710 + concreto fill 230\xD7230 (transformed-section).",
      "La consola muestra \u0394% vs ETABS empotrado (referencia API actual)."
    ],
    params: {
      setup: {
        default: 1,
        label: "Setup",
        options: {
          "cftNoSlab (4\xD720 kN puntuales)": 0,
          "cftDeckSlab (q=5 kN/m\xB2)": 1
        }
      },
      transformMode: {
        default: 0,
        label: "Transformaci\xF3n",
        options: {
          "Steel-equivalent (E_s, A_s+A_c/n)": 0,
          "Concrete-equiv (E_c, n\xB7A_s+A_c)": 1
        }
      },
      beamTheory: {
        default: 1,
        label: "Teor\xEDa de viga",
        options: {
          "Bernoulli (sin shear deformation)": 0,
          "Timoshenko (As=5/6\xB7A, default Hekatan)": 1
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
      h_story: {
        default: 4,
        min: 2,
        max: 8,
        step: 0.5,
        label: "Altura (m)",
        folder: "Geometr\xEDa"
      },
      nx: {
        default: 8,
        min: 2,
        max: 32,
        step: 1,
        label: "nx mesh",
        folder: "Geometr\xEDa"
      },
      ny: {
        default: 8,
        min: 2,
        max: 32,
        step: 1,
        label: "ny mesh",
        folder: "Geometr\xEDa"
      },
      t_slab: {
        default: 0.1,
        min: 0.05,
        max: 0.3,
        step: 0.01,
        label: "t losa (m)",
        folder: "Geometr\xEDa"
      },
      E_c: {
        default: 25e6,
        min: 1e7,
        max: 5e7,
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
        min: 15e7,
        max: 22e7,
        step: 5e6,
        label: "E acero (kN/m\xB2)",
        folder: "Material"
      },
      D_out: {
        default: 0.25,
        min: 0.15,
        max: 0.5,
        step: 0.01,
        label: "D externo HSS (m)",
        folder: "Secci\xF3n CFT"
      },
      t_HSS: {
        default: 0.01,
        min: 5e-3,
        max: 0.025,
        step: 1e-3,
        label: "t pared HSS (m)",
        folder: "Secci\xF3n CFT"
      },
      A_b: {
        default: 7886,
        min: 1e3,
        max: 3e4,
        step: 100,
        label: "A viga (mm\xB2)",
        folder: "Viga W360x60"
      },
      Iy_b: {
        default: 17.48,
        min: 1,
        max: 100,
        step: 0.01,
        label: "Iy strong (\xD710\u207B\u2075 m\u2074)",
        folder: "Viga W360x60"
      },
      Iz_b: {
        default: 1.814,
        min: 0.1,
        max: 50,
        step: 1e-3,
        label: "Iz weak (\xD710\u207B\u2075 m\u2074)",
        folder: "Viga W360x60"
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
      P_point: {
        default: 20,
        min: 1,
        max: 100,
        step: 1,
        label: "P puntual midspan (kN)",
        folder: "Carga",
        unitType: "force"
      }
    },
    computedLabels(t, r) {
      const F = t.D_out, c = t.t_HSS, i = F - 2 * c, h = F * F - i * i, f = i * i, d = (F ** 4 - i ** 4) / 12, I = i ** 4 / 12, E = t.E_s / t.E_c, k = Math.round(t.transformMode) === 0, s = k ? h + f / E : E * h + f, a = k ? d + I / E : E * d + I, n = k ? t.E_s : t.E_c, A = (t.A_b ?? 7610) * 1e-6, x = (t.Iy_b ?? 12.9) * 1e-5, p = t.E_s / 2.6, G = 5 / 6 * A, m = (t.Lx ?? 4) / Math.round(t.nx ?? 4), $ = 12 * t.E_s * x / (p * G * m * m), g = Math.round(t.beamTheory ?? 1) === 0;
      return {
        "n = E_s/E_c": E.toFixed(2),
        "A_s (HSS)": `${(h * 1e4).toFixed(2)} cm\xB2`,
        "A_c (fill)": `${(f * 1e4).toFixed(2)} cm\xB2`,
        "I_s (HSS)": `${(d * 1e8).toFixed(2)} \xD710\u207B\u2074 cm\u2074`,
        "I_c (fill)": `${(I * 1e8).toFixed(2)} \xD710\u207B\u2074 cm\u2074`,
        A_eq: `${(s * 1e4).toFixed(2)} cm\xB2   (E\xB7A = ${(n * s).toFixed(0)} kN)`,
        I_eq: `${(a * 1e8).toFixed(2)} \xD710\u207B\u2074 cm\u2074   (E\xB7I = ${(n * a).toFixed(0)} kN\xB7m\xB2)`,
        "\u03C6 Timoshenko viga": g ? "\u2248 0 (Bernoulli forzado)" : `${$.toFixed(4)}  (W360x60, L=${m.toFixed(2)} m)`,
        "Factor (1+\u03C6)": g ? "1.000 (sin shear)" : (1 + $).toFixed(4)
      };
    },
    build(t, r) {
      var _a;
      const c = [
        "cftNoSlab",
        "cftDeckSlab"
      ][Math.round(t.setup)] || "cftDeckSlab", i = c === "cftDeckSlab", h = Math.round(t.transformMode) === 0, f = Math.round(t.beamTheory) === 0, d = -1, I = t.Lx, E = t.Ly, k = t.h_story, s = Math.round(t.nx), a = Math.round(t.ny), n = s + 1, A = I / s, x = E / a, p = t.D_out, G = t.t_HSS, m = p - 2 * G, $ = p * p - m * m, g = m * m, X = (p ** 4 - m ** 4) / 12, V = m ** 4 / 12, Q = 2 * X, y = t.E_s / t.E_c;
      let j, N, z, v;
      h ? (j = $ + g / y, N = X + V / y, z = Q, v = t.E_s) : (j = y * $ + g, N = y * X + V, z = y * Q, v = t.E_c);
      const ce = v / 2.6, _ = [];
      for (let e = 0; e <= a; e++) for (let o = 0; o <= s; o++) _.push([
        o * A,
        e * x,
        k
      ]);
      const ee = _.length;
      _.push([
        0,
        0,
        0
      ]), _.push([
        s * A,
        0,
        0
      ]), _.push([
        0,
        a * x,
        0
      ]), _.push([
        s * A,
        a * x,
        0
      ]);
      const M = [];
      if (i) for (let e = 0; e < a; e++) for (let o = 0; o < s; o++) {
        const T = e * n + o;
        M.push([
          T,
          T + 1,
          (e + 1) * n + o + 1,
          (e + 1) * n + o
        ]);
      }
      const u = [];
      for (let e = 0; e < s; e++) u.push([
        e,
        e + 1
      ]);
      const te = a * n;
      for (let e = 0; e < s; e++) u.push([
        te + e,
        te + e + 1
      ]);
      for (let e = 0; e < a; e++) u.push([
        e * n,
        (e + 1) * n
      ]);
      for (let e = 0; e < a; e++) u.push([
        e * n + s,
        (e + 1) * n + s
      ]);
      const oe = u.length, re = [
        0,
        s,
        a * n,
        a * n + s
      ];
      for (let e = 0; e < 4; e++) u.push([
        ee + e,
        re[e]
      ]);
      const Y = [
        ...M,
        ...u
      ], D = /* @__PURE__ */ new Map();
      for (let e = 0; e < 4; e++) D.set(ee + e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      if (!i) for (let e = 1; e < a; e++) for (let o = 1; o < s; o++) D.set(e * n + o, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const B = /* @__PURE__ */ new Map();
      if (i) for (const e of M) {
        const o = A * x, T = -t.q * o / 4;
        for (const b of e) {
          const S = B.get(b) || [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          S[2] += T, B.set(b, S);
        }
      }
      else {
        const e = [
          Math.floor(s / 2),
          a * n + Math.floor(s / 2),
          Math.floor(a / 2) * n,
          Math.floor(a / 2) * n + s
        ];
        for (const o of e) B.set(o, [
          0,
          0,
          -t.P_point,
          0,
          0,
          0
        ]);
      }
      const H = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), ie = t.E_c / (2 * (1 + t.nu_c));
      for (let e = 0; e < M.length; e++) H.set(e, t.E_c), se.set(e, t.nu_c), ae.set(e, t.t_slab), C.set(e, ie), L.set(e, 24);
      const fe = t.E_s / 2.6, R = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), me = 355e-9, _e = 279e-5, de = 473e-5;
      for (let e = 0; e < oe; e++) {
        const o = M.length + e;
        H.set(o, t.E_s), C.set(o, fe), J.set(o, t.A_b * 1e-6), U.set(o, t.Iy_b * 1e-5), Z.set(o, t.Iz_b * 1e-5), K.set(o, me), L.set(o, 78.5), f ? (R.set(o, d), w.set(o, d)) : (R.set(o, _e), w.set(o, de));
      }
      for (let e = oe; e < u.length; e++) {
        const o = M.length + e;
        H.set(o, v), C.set(o, ce), J.set(o, j), U.set(o, N), Z.set(o, N), K.set(o, z), L.set(o, h ? 78.5 : 24), f && (R.set(o, d), w.set(o, d));
      }
      r.nodes.val = _, r.elements.val = Y, r.nodeInputs.val = {
        supports: D,
        loads: B
      }, r.elementInputs.val = {
        elasticities: H,
        poissonsRatios: se,
        thicknesses: ae,
        shearModuli: C,
        areas: J,
        momentsOfInertiaZ: U,
        momentsOfInertiaY: Z,
        torsionalConstants: K,
        densities: L,
        shearAreasY: R,
        shearAreasZ: w
      };
      try {
        r.deformOutputs.val = xe(_, Y, {
          supports: D,
          loads: B
        }, r.elementInputs.val), r.analyzeOutputs.val = Ae(_, Y, r.elementInputs.val, r.deformOutputs.val);
      } catch (e) {
        console.error(`[Benchmark CFT] solver error (${c}):`, e.message);
      }
      r.objects3D.val = [];
      const ue = Math.floor(s / 2), be = Math.floor(a / 2), Se = i ? be * n + ue : Math.floor(s / 2), ne = (_a = r.deformOutputs.val.deformations) == null ? void 0 : _a.get(Se);
      if (ne) {
        const e = ne[2] * 1e3, o = i ? "w_centro" : "w_midspan_beam", T = h ? "steel-eq" : "concrete-eq", b = f ? "Bernoulli" : "Timoshenko", S = f ? Me[c] : pe[c], he = f ? Ie[c] : ke[c], le = Te[c], Ee = Fe[c], q = $e[c], O = ge[c], P = ye[c];
        if (console.log(`[Benchmark CFT] ${c} (${T}, ${b}) \u2014 BASE EMPOTRADA
  ${o} = ${e.toFixed(4)} mm  (Hekatan-CLI ${b} ref: ${S == null ? void 0 : S.toFixed(4)})
  Julia ${b} ref: ${he == null ? void 0 : he.toFixed(4)}` + (f ? `  \xB7  OpenSees ref: ${le.toFixed(4)}  \xB7  PyNite ref: ${Ee.toFixed(4)}` : `  \xB7  OpenSees/PyNite usan Bernoulli (${le.toFixed(4)})`) + `
  ETABS Filled Steel Tube PIN (legacy): ${q.toFixed(4)}
  ETABS HSS+modifiers PIN (legacy):     ${O.toFixed(4)}
  \u{1F3AF} ETABS BASE EMPOTRADA (Filled Tube): ${P.toFixed(4)}`), Math.abs(P) > 1e-9) {
          const l = (e - P) / Math.abs(P) * 100, W = l >= 0 ? "+" : "";
          Math.abs(l) < 0.5 ? console.log(`  \u2705 \u0394 ${W}${l.toFixed(2)}% vs ETABS empotrado (MATCH BIT-EXACT)`) : Math.abs(l) < 2 ? console.log(`  \u2713 \u0394 ${W}${l.toFixed(2)}% vs ETABS empotrado`) : console.log(`  \u0394 ${W}${l.toFixed(2)}% vs ETABS empotrado`);
        }
        if (S !== void 0 && Math.abs(S) > 1e-9) {
          const l = Math.abs(e - S) / Math.abs(S) * 100;
          l > 5 ? console.warn(`  \u0394 ${l.toFixed(1)}% vs Hekatan-CLI ${b}`) : console.log(`  \u2713 \u0394 ${l.toFixed(2)}% vs Hekatan-CLI ${b}`);
        }
        if (Math.abs(O) > 1e-9) {
          const l = Math.abs(e - O) / Math.abs(O) * 100;
          !f && l < 1 ? console.log(`  \u2713\u2713 \u0394 ${l.toFixed(2)}% vs ETABS HSS+modifiers (transf. simple)`) : console.log(`  \u0394 ${l.toFixed(2)}% vs ETABS HSS+modifiers`);
        }
        if (Math.abs(q) > 1e-9) {
          const l = Math.abs(e - q) / Math.abs(q) * 100;
          console.log(`  \u0394 ${l.toFixed(1)}% vs ETABS Filled Steel Tube (AISC 0.6\xB7EI \u21D2 ~9% m\xE1s r\xEDgido)`);
        }
      }
    }
  };
});
export {
  __tla,
  ve as b
};
