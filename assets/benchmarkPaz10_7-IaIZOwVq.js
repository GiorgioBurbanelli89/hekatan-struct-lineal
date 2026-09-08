import { a as W } from "./analyze-CRH7D0Bs.js";
import { b as X, d as j, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { P as i, d as J, e as Q, a as K, c as ee, f as Y, h as te, __tla as __tla_1 } from "./pazFrameE2k-DwsnXikM.js";
import { g as k } from "./chartPanel-DKe9UCQ8.js";
import { n as ae } from "./newmarkBeta-BvlZHnmY.js";
let pe;
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
  pe = {
    id: "benchmark-paz-10-7",
    name: "\u{1F3C1} Frame \xB7 Paz 10.7 (fixed-fixed beam \u2014 4 elementos)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 10.7-10.8 \u2014 Viga doblemente empotrada con 4 elementos (5 nodos).",
      "L=200 in (4\xD750), I=100 in\u2074, E=6.58e6 psi, m\u0304=0.10 lb\xB7s\xB2/in/in.",
      "Carga: 10,000 lb en el centro (nodo 3), aplicada por 0.1s y bajando linealmente 0.1-0.2s.",
      "Validaci\xF3n contra Programa 13 del libro (MATLAB BeamElement + BeamConsMass).",
      "\u{1F4C8} Chart Panel: u_centro(t), F(t), modos.",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 modelo ETABS Steel I/Wide Flange."
    ],
    params: {
      L_in: {
        default: 200,
        min: 100,
        max: 500,
        step: 10,
        label: "L total viga (in)",
        folder: "Geometr\xEDa"
      },
      nElem: {
        default: 4,
        min: 2,
        max: 20,
        step: 1,
        label: "# elementos",
        folder: "Mesh"
      },
      I_in4: {
        default: 100,
        min: 20,
        max: 500,
        step: 5,
        label: "I (in\u2074)",
        folder: "Secci\xF3n"
      },
      E_psi: {
        default: 658e4,
        min: 1e6,
        max: 35e6,
        step: 1e5,
        label: "E (psi)",
        folder: "Material"
      },
      mbar: {
        default: 0.1,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "m\u0304 (lb\xB7s\xB2/in/in)",
        folder: "Masa"
      },
      F_lb: {
        default: 1e4,
        min: 0,
        max: 5e4,
        step: 100,
        label: "F centro (lb)",
        folder: "Time History"
      },
      t1_s: {
        default: 0.1,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "t\u2081 fin plateau (s)",
        folder: "Time History"
      },
      t2_s: {
        default: 0.2,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "t\u2082 fin bajada (s)",
        folder: "Time History"
      },
      tEnd_s: {
        default: 0.5,
        min: 0.1,
        max: 5,
        step: 0.1,
        label: "t fin (s)",
        folder: "Time History"
      },
      dt_s: {
        default: 5e-3,
        min: 1e-4,
        max: 0.05,
        step: 1e-3,
        label: "\u0394t Newmark (s)",
        folder: "Time History"
      },
      xi: {
        default: 0,
        min: 0,
        max: 0.2,
        step: 5e-3,
        label: "Damping \u03BE (libro=0)",
        folder: "Time History"
      },
      showTH: {
        default: 1,
        boolean: true,
        label: "\u{1F4C8} Mostrar Chart Panel",
        folder: "Time History"
      },
      plotType: {
        default: 0,
        label: "Tipo gr\xE1fica",
        options: {
          "u_centro(t)": 0,
          "F(t)": 1,
          Modos: 2,
          "v_centro(t)": 3,
          "a_centro(t)": 4
        },
        folder: "Time History"
      },
      exportE2k: {
        default: 0,
        boolean: true,
        label: "\u{1F4E4} Exportar a ETABS .e2k",
        folder: "Exportar"
      }
    },
    hasModal: true,
    onParamChange(a, s) {
      if (a === "exportE2k" && s.exportE2k > 0.5) {
        const { filename: o, content: n } = se(s);
        J(o, n), console.log(`[Paz 10.7] e2k exportado: ${o}`), s.exportE2k = 0;
      }
      a === "showTH" && s.showTH < 0.5 && k().hide();
    },
    build(a, s) {
      const o = Math.max(2, Math.round(a.nElem)), n = a.L_in, m = n / o, e = i.in_to_m(m), c = i.psi_to_kNm2(a.E_psi), h = i.in4_to_m4(a.I_in4), T = Math.pow(12 * h, 0.25), I = T * T, H = a.mbar * 386.088 * 175.13 / 9.80665 / I / 1e3, S = [];
      for (let t = 0; t <= o; t++) S.push([
        t * e,
        0,
        0
      ]);
      const u = [];
      for (let t = 0; t < o; t++) u.push([
        t,
        t + 1
      ]);
      const d = /* @__PURE__ */ new Map();
      d.set(0, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), d.set(o, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let t = 1; t < o; t++) d.set(t, [
        true,
        true,
        false,
        true,
        false,
        true
      ]);
      const f = /* @__PURE__ */ new Map(), z = Math.floor(o / 2), B = i.lb_to_kN(a.F_lb);
      f.set(z, [
        0,
        0,
        -B,
        0,
        0,
        0
      ]);
      const b = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
      for (let t = 0; t < u.length; t++) b.set(t, c), N.set(t, c / 2.6), P.set(t, I), x.set(t, h), L.set(t, h), F.set(t, h * 2), O.set(t, I * 0.85), D.set(t, I * 0.85), R.set(t, H), g.set(t, `Beam Paz 10.7  I=${a.I_in4} in\u2074`), $.set(t, "Acero"), C.set(t, {
        name: "BEAM_PAZ10_7",
        shape: "Steel I/Wide Flange",
        D: T,
        B: T * 0.6,
        TF: 0.018,
        TW: 0.011,
        material: "A992Fy50"
      });
      s.nodes.val = S, s.elements.val = u, s.nodeInputs.val = {
        supports: d,
        loads: f
      }, s.elementInputs.val = {
        elasticities: b,
        shearModuli: N,
        areas: P,
        momentsOfInertiaZ: x,
        momentsOfInertiaY: L,
        torsionalConstants: F,
        shearAreasY: O,
        shearAreasZ: D,
        densities: R,
        sectionLabels: g,
        materialTypes: $,
        sectionInfo: C
      };
      try {
        s.deformOutputs.val = j(S, u, {
          supports: d,
          loads: f
        }, s.elementInputs.val), s.analyzeOutputs.val = W(S, u, s.elementInputs.val, s.deformOutputs.val);
      } catch (t) {
        console.error("[Paz 10.7]", t.message);
      }
      s.objects3D.val = [];
      const p = 192 * a.E_psi * a.I_in4 / Math.pow(n, 3), M = 0.5 * a.mbar * n, v = Math.sqrt(p / M), w = 2 * Math.PI / v, G = 1 / w, Z = 2 * a.xi * Math.sqrt(p * M), y = (t) => t <= 0 ? [
        0
      ] : t <= a.t1_s ? [
        a.F_lb
      ] : t <= a.t2_s ? [
        a.F_lb * (a.t2_s - t) / (a.t2_s - a.t1_s)
      ] : [
        0
      ], q = Math.floor(a.tEnd_s / a.dt_s), l = ae({
        M: [
          [
            M
          ]
        ],
        K: [
          [
            p
          ]
        ],
        C: [
          [
            Z
          ]
        ],
        loadFunc: y,
        u0: [
          0
        ],
        v0: [
          0
        ],
        dt: a.dt_s,
        nSteps: q
      }), U = Math.max(...l.u.map((t) => Math.abs(t[0]))), V = a.F_lb / p;
      let E = `[Paz 10.7] Fixed-fixed beam, ${o} elementos
`;
      if (E += `  EI = ${(a.E_psi * a.I_in4).toExponential(3)} lb\xB7in\xB2
`, E += `  k_centro (carga puntual) = ${p.toFixed(1)} lb/in
`, E += `  T_eq (1\xB0 modo aprox) = ${w.toFixed(4)} s, f_eq = ${G.toFixed(2)} Hz
`, E += `  Newmark-\u03B2 u_centro_max = ${U.toFixed(4)} in (DLF=${(U / V).toFixed(3)})
`, a.showTH > 0.5) {
        const t = k(), A = Math.round(a.plotType ?? 0);
        A === 0 ? (t.setTitle("Paz 10.7 \u2014 u_centro(t)"), t.setSeries([
          {
            label: "u_centro(t)",
            data: l.t.map((r, _) => [
              r,
              l.u[_][0]
            ]),
            color: "#1a4d8c",
            width: 2
          }
        ]), t.setAxes({
          xLabel: "t (s)",
          yLabel: "u (in)",
          grid: true
        })) : A === 1 ? (t.setTitle("Paz 10.7 \u2014 F(t)"), t.setSeries([
          {
            label: "F(t)",
            data: l.t.map((r) => [
              r,
              y(r)[0]
            ]),
            color: "#7d3c98",
            width: 2
          }
        ]), t.setAxes({
          xLabel: "t (s)",
          yLabel: "F (lb)",
          grid: true
        })) : A === 3 ? (t.setSeries([
          {
            label: "v(t)",
            data: l.t.map((r, _) => [
              r,
              l.v[_][0]
            ]),
            color: "#1a4d8c"
          }
        ]), t.setAxes({
          xLabel: "t (s)",
          yLabel: "v (in/s)",
          grid: true
        }), t.setTitle("Paz 10.7 \u2014 v(t)")) : A === 4 && (t.setSeries([
          {
            label: "a(t)",
            data: l.t.map((r, _) => [
              r,
              l.a[_][0]
            ]),
            color: "#1a4d8c"
          }
        ]), t.setAxes({
          xLabel: "t (s)",
          yLabel: "a (in/s\xB2)",
          grid: true
        }), t.setTitle("Paz 10.7 \u2014 a(t)")), t.show();
      }
      console.log(E);
    },
    runModal(a, s, o) {
      if (s.nodes.val.length) try {
        const n = X(s.nodes.val, s.elements.val, s.nodeInputs.val, s.elementInputs.val, 4);
        console.log(`[Paz 10.7 \u2014 Modal] frecuencias:
` + n.frequencies.slice(0, 4).map((m, e) => `  Modo ${e + 1}: f = ${m.toFixed(3)} Hz   T = ${(1 / m).toFixed(4)} s`).join(`
`)), (o == null ? void 0 : o.render) && o.render(n, {
          title: "Paz 10.7 \u2014 Fixed-fixed beam",
          properties: [
            `L=${a.L_in}in, I=${a.I_in4}in\u2074, E=${a.E_psi.toExponential(2)} psi`,
            `${Math.round(a.nElem)} elementos beam`
          ]
        });
      } catch (n) {
        console.error("[Paz 10.7 Modal]", n.message);
      }
    }
  };
  function se(a) {
    const s = i.in_to_m(a.L_in), o = i.psi_to_kNm2(a.E_psi) / 9.80665, n = i.in4_to_m4(a.I_in4), m = Math.pow(12 * n, 0.25), e = [];
    e.push(...Q({
      units: "TONF M",
      title1: "Paz 10.7 Fixed-Fixed Beam",
      title2: "Validation"
    })), e.push("$ STORIES - IN SEQUENCE FROM TOP"), e.push('  STORY "Story1"  HEIGHT 0.001 MASTERSTORY "Yes"  '), e.push('  STORY "Base"  ELEV -0.001 '), e.push(""), e.push("$ GRIDS"), e.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), e.push(""), e.push("$ DIAPHRAGM NAMES"), e.push('  DIAPHRAGM "D1"    TYPE RIGID'), e.push(""), e.push("$ MATERIAL PROPERTIES"), e.push(...K("A992Fy50", o, 7.849)), e.push(""), e.push("$ FRAME SECTIONS"), e.push(...ee({
      name: "BEAM_PAZ10_7",
      material: "A992Fy50",
      shape: "Steel I/Wide Flange",
      D: m,
      B: m * 0.6,
      TF: 0.018,
      TW: 0.011
    })), e.push(""), e.push("$ POINT COORDINATES"), e.push('  POINT "1"  0 0 '), e.push(`  POINT "2"  ${Y(s)} 0 `), e.push(""), e.push("$ LINE CONNECTIVITIES"), e.push('  LINE  "B1"  BEAM  "1"  "2"  0'), e.push(""), e.push("$ POINT ASSIGNS"), e.push('  POINTASSIGN  "1"  "Story1"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  '), e.push('  POINTASSIGN  "2"  "Story1"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  '), e.push(""), e.push("$ LINE ASSIGNS"), e.push(`  LINEASSIGN  "B1"  "Story1"  SECTION "BEAM_PAZ10_7"  RIGIDZONE 0.5 MINNUMSTA ${Math.max(2, Math.round(a.nElem))} AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `), e.push(""), e.push("$ LOAD PATTERNS"), e.push('  LOADPATTERN "DEAD"  TYPE  "Dead"  SELFWEIGHT  1'), e.push('  LOADPATTERN "PUNTUAL"  TYPE  "Other"  SELFWEIGHT  0'), e.push(""), e.push("$ FRAME OBJECT LOADS");
    const c = i.lb_to_kN(a.F_lb) / 9.80665;
    return e.push(`  LINELOAD  "B1"  "Story1"  TYPE "POINT"  DIR "GRAVITY"  LC "PUNTUAL"  RD 0.5  FVAL ${Y(c)}`), e.push(""), e.push("$ ANALYSIS OPTIONS"), e.push('  ACTIVEDOF  "UX UY UZ RX RY RZ"  '), e.push(""), e.push("$ MASS SOURCE"), e.push('  MASSSOURCE  "MsSrc1"  INCLUDEELEMENTS "Yes"  INCLUDEADDEDMASS "No"  INCLUDELOADS "No"  LUMPATSTORIES "Yes"  ISDEFAULT "Yes"  '), e.push(""), e.push("$ LOAD CASES"), e.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  MAXMODES  4 MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 '), e.push('  LOADCASE "Puntual"  TYPE  "Linear Static"  LOADPAT  "PUNTUAL"  SF  1 '), e.push(""), e.push(...te()), {
      filename: "Paz_10_7_FixedBeam.e2k",
      content: e.join(`\r
`)
    };
  }
});
export {
  __tla,
  pe as b
};
