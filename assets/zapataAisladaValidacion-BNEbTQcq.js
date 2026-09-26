import { b as Be, v as We, V as q, d as Ne, B as qe } from "./Text-C1TX4d8g.js";
import { a as Ze, __tla as __tla_0 } from "./analyze-ZiWUXQRU.js";
import { d as ke, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { a as Pe } from "./exampleVersion-D1A_5i59.js";
import { f as P } from "./units-BjHPBmMt.js";
let io;
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
  let E, O, Ue, $e, s, Ke, Je, Ae, Qe, eo, oo;
  E = 25e6;
  O = 0.2;
  Ue = E / (2 * (1 + O));
  $e = 24;
  s = 9.80665;
  Ke = 0.2;
  Je = 0.035;
  Ae = 8;
  Qe = 0.04;
  eo = new Be({
    color: 16711731,
    linewidth: 2
  });
  oo = new Be({
    color: 52224,
    linewidth: 2
  });
  io = {
    id: "zapata-aislada-validacion",
    name: "Zapata Aislada \u2014 Hekatan vs SAFE/Calcpad (Bowles)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    benchmark: true,
    defaultShellResult: "pressure",
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
    guide: [
      "Geometr\xEDa: ajust\xE1 Lz, Bz (m) \u2014 dimensiones de la zapata en planta",
      "Material suelo: q_adm (tonf/m\xB2) presi\xF3n admisible \xB7 ks (tonf/m\xB3) m\xF3dulo Bowles",
      "Cargas: P axial + Mx/My en la columna (tonf, tonf\xB7m). Default 20 tonf",
      "Resultados: el colormap muestra \u03C3 presi\xF3n (tonf/m\xB2). Verde = q_adm",
      "Folder Calculados: \u03C3_max debe cumplir \u03C3/q_adm \u2264 1 (\u2713). Si > 1 \u2192 \u26A0 aument\xE1 zapata o ks",
      "Mov\xE9 ks para ver c\xF3mo cambia la distribuci\xF3n (no la presi\xF3n media): suelo m\xE1s r\xEDgido = m\xE1s concentraci\xF3n en el centro"
    ],
    hasModal: false,
    params: {
      Lz: {
        default: 1.5,
        min: 1,
        max: 5,
        step: 0.05,
        label: "Lz \u2014 length X (m)"
      },
      Bz: {
        default: 1.5,
        min: 1,
        max: 5,
        step: 0.05,
        label: "Bz \u2014 length Y (m)"
      },
      tz: {
        default: 0.3,
        min: 0.05,
        max: 1,
        step: 0.05,
        label: "t \u2014 thickness (m)"
      },
      bc: {
        default: 0.4,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "bc \u2014 column side (m)"
      },
      Hp: {
        default: 0.5,
        min: 0.3,
        max: 2,
        step: 0.1,
        label: "Hp \u2014 pedestal height (m)"
      },
      springMode: {
        default: 0,
        options: {
          "A. q_adm (suelo) \u2192 ks derivado": 0,
          "B. ks (m\xF3dulo de balasto) directo": 1
        },
        label: "Modo definici\xF3n suelo"
      },
      q_adm: {
        default: 10,
        min: 1,
        max: 100,
        step: 1,
        label: "q_adm (tonf/m\xB2)"
      },
      ks_factor: {
        default: 10.5,
        min: 5,
        max: 20,
        step: 0.5,
        label: "ks_factor (Bowles)"
      },
      ks: {
        default: 2e3,
        min: 2e3,
        max: 2e5,
        step: 100,
        label: "ks (tonf/m\xB3)"
      },
      kh_ratio: {
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.05,
        label: "kh / kv (Bowles 0.3-0.7)",
        folder: "Suelo avanzado"
      },
      kRot_factor: {
        default: 1e-4,
        min: 0,
        max: 0.01,
        step: 1e-5,
        label: "k_rot factor (anti-singular.)",
        folder: "Suelo avanzado"
      },
      support_mode: {
        default: 0,
        options: {
          "A. Winkler 3D (kx/ky/kz)": 0,
          "B. Winkler vert. + esquinas X,Y,Rz": 1,
          "C. Winkler vert. + 1 nodo anti-sing": 2
        },
        label: "Modelo de soporte",
        folder: "Suelo avanzado"
      },
      P_simple: {
        default: 20,
        min: 0,
        max: 500,
        step: 0.5,
        label: "P \u2014 axial (tonf)",
        folder: "Loads"
      },
      Mx_simple: {
        default: 0.5,
        min: -50,
        max: 50,
        step: 0.1,
        label: "Mx (tonf\xB7m)",
        folder: "Loads"
      },
      My_simple: {
        default: -0.5,
        min: -50,
        max: 50,
        step: 0.1,
        label: "My (tonf\xB7m)",
        folder: "Loads"
      },
      nSub: {
        default: 10,
        min: 3,
        max: 16,
        step: 1,
        label: "n \u2014 mesh subdivisions"
      }
    },
    inlineComputed: [
      {
        after: "q_adm",
        get label() {
          return `k_area (${P.val}/m\xB3)`;
        },
        compute: (o) => {
          const n = (o.q_adm ?? 10) * s * (o.ks_factor ?? 10.5), l = P.val, m = l === "tonf" ? 1 / s : l === "kip" ? 1 / 4.4482216 : 1;
          return (n * m).toFixed(l === "kN" ? 0 : 2) + " (Bowles)";
        },
        hiddenIf: (o) => Math.round(o.springMode ?? 0) !== 0
      },
      {
        after: "ks_factor",
        get label() {
          return `ks computed (${P.val}/m\xB3)`;
        },
        compute: (o) => {
          const n = (o.q_adm ?? 10) * s * (o.ks_factor ?? 10.5), l = P.val, m = l === "tonf" ? 1 / s : l === "kip" ? 1 / 4.4482216 : 1;
          return (n * m).toFixed(l === "kN" ? 0 : 2);
        },
        hiddenIf: (o) => Math.round(o.springMode ?? 0) !== 0
      },
      {
        after: "ks",
        get label() {
          return `k_spring/nodo (${P.val}/m)`;
        },
        compute: (o) => {
          const m = (Math.round(o.springMode ?? 0) === 0 ? (o.q_adm ?? 10) * (o.ks_factor ?? 10.5) : o.ks ?? 2e3) * s, v = (o.Lz ?? 1.5) * (o.Bz ?? 1.5) / Math.max(1, Math.pow(o.nSub ?? 10, 2)), b = m * v, $ = P.val, te = $ === "tonf" ? 1 / s : $ === "kip" ? 1 / 4.4482216 : 1;
          return (b * te).toFixed($ === "kN" ? 1 : 3);
        }
      },
      {
        after: "tz",
        get label() {
          return `D flexural (${P.val}\xB7m)`;
        },
        compute: (o) => {
          const n = o.tz ?? 0.3, l = E * n ** 3 / (12 * (1 - O ** 2)), m = P.val, v = m === "tonf" ? 1 / s : m === "kip" ? 1 / 4.4482216 : 1;
          return (l * v).toFixed(1);
        }
      },
      {
        after: "ks",
        label: "k_r Biot",
        compute: (o) => {
          const n = o.tz ?? 0.3, l = o.Lz ?? 1.5, m = (o.ks ?? 10500) * s, v = E * n ** 3 / (12 * (1 - O ** 2)) / (m * l ** 4);
          return v.toFixed(3) + (v < 1 ? " FLEX" : " RIGID");
        }
      }
    ],
    computedLabels(o, n) {
      var _a, _b;
      const l = o.q_adm ?? 10, m = o.ks_factor ?? 10.5, $ = (Math.round(o.springMode ?? 0) === 0 ? l * m : o.ks ?? 2e3) * s, te = o.tz ?? 0.3, ze = o.Lz ?? 1.5, F = E * te ** 3 / (12 * (1 - O ** 2)), Y = F / ($ * ze ** 4), ne = o.P_simple ?? 0;
      let C = 0, g = 0, R = false;
      const A = (_a = n.analyzeOutputs.rawVal) == null ? void 0 : _a.pressure;
      if (A && A.size) for (const I of A.values()) for (const f of I) R || (C = g = f, R = true), f < C && (C = f), f > g && (g = f);
      const p = Math.abs(C), M = Math.abs(g), V = p / s, L = M / s, G = V / (l || 1), T = o.kh_ratio ?? 0.5, se = (o.support_mode ?? 0) | 0, ae = [
        "A. Winkler 3D",
        "B. Vert+esquinas",
        "C. Vert+1 nodo"
      ][se], a = P.val, j = a === "tonf" ? 1 / s : a === "kip" ? 1 / 4.4482216 : 1, re = $ * j, ie = F * j, W = V * (a === "tonf" ? 1 : a === "kip" ? s / 4.4482216 : s), le = L * (a === "tonf" ? 1 : a === "kip" ? s / 4.4482216 : s), Z = l * (a === "tonf" ? 1 : a === "kip" ? s / 4.4482216 : s), U = ne * (a === "tonf" ? 1 : a === "kip" ? s / 4.4482216 : s), c = (o.Mx_simple ?? 0) * (a === "tonf" ? 1 : a === "kip" ? s / 4.4482216 : s), xe = (o.My_simple ?? 0) * (a === "tonf" ? 1 : a === "kip" ? s / 4.4482216 : s), z = (o.q_adm ?? 10) === 10 && (o.P_simple ?? 0) === 20 && Math.abs((o.Mx_simple ?? 0) - 0.5) < 0.01 && Math.abs((o.My_simple ?? 0) - -0.5) < 0.01 && (o.Lz ?? 1.5) === 1.5 && (o.Bz ?? 1.5) === 1.5, _ = z ? "96.7 mm" : "(no aplica)", K = (_b = n.deformOutputs.rawVal) == null ? void 0 : _b.deformations;
      let H = 0;
      K && K.forEach((I) => {
        Math.abs(I[2]) > Math.abs(H) && (H = I[2]);
      });
      const J = Math.abs(H) * 1e3, ce = 96.7, he = z ? (J - ce) / ce * 100 : 0;
      return {
        Mode: "Direct P/Mx/My",
        Soporte: ae,
        [`ks usado (${a}/m\xB3)`]: re.toFixed(a === "kN" ? 0 : 2),
        "k_h/k_v": T.toFixed(2) + " (Bowles)",
        [`D (${a}\xB7m)`]: ie.toFixed(1),
        "k_r (Biot)": Y.toFixed(3) + (Y < 1 ? " FLEXIBLE" : " RIGID"),
        [`P (${a})`]: U.toFixed(2),
        [`Mx (${a}\xB7m)`]: c.toFixed(2),
        [`My (${a}\xB7m)`]: xe.toFixed(2),
        [`\u03C3_max comp (${a}/m\xB2)`]: W.toFixed(2),
        [`\u03C3_min comp (${a}/m\xB2)`]: le.toFixed(2),
        [`q_adm (${a}/m\xB2)`]: Z.toFixed(2),
        "\u03C3/q_adm": G.toFixed(2) + (G > 1 ? " \u26A0" : " \u2713"),
        "\u2014\u2014 Validaci\xF3n cruzada \u2014\u2014": "",
        "Hekatan w_max (mm)": J.toFixed(2),
        "SAFE w_max ref (mm)": _,
        "Diff Hekatan vs SAFE": z ? `${he.toFixed(1)}%` : "(cambia params al default)"
      };
    },
    build(o, n) {
      var _a;
      const { Lz: l, Bz: m, tz: v, bc: b, Hp: $ } = o;
      o.q_adm * s;
      const F = (Math.round(o.springMode ?? 0) === 0 ? o.q_adm * o.ks_factor : o.ks ?? 2e3) * s, Y = (o.P_simple ?? 0) * s, ne = (o.Mx_simple ?? 0) * s, C = (o.My_simple ?? 0) * s, g = Math.round(o.nSub), R = l / 2, A = m / 2, p = [], M = [];
      for (let e = 0; e <= g; e++) p.push(l * e / g), M.push(m * e / g);
      p.includes(R) || (p.push(R), p.sort((e, t) => e - t)), M.includes(A) || (M.push(A), M.sort((e, t) => e - t));
      const V = [], L = [], G = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), U = (e, t, r) => {
        const u = `${e.toFixed(4)},${t.toFixed(4)},${r.toFixed(4)}`;
        if (Z.has(u)) return Z.get(u);
        const d = V.length;
        return V.push([
          e,
          t,
          r
        ]), Z.set(u, d), d;
      }, c = [];
      for (let e = 0; e < M.length; e++) {
        const t = [];
        for (let r = 0; r < p.length; r++) t.push(U(p[r], M[e], 0));
        c.push(t);
      }
      for (let e = 0; e < M.length - 1; e++) for (let t = 0; t < p.length - 1; t++) {
        const r = L.length;
        L.push([
          c[e][t],
          c[e][t + 1],
          c[e + 1][t + 1],
          c[e + 1][t]
        ]), ae.set(r, v), G.set(r, E), T.set(r, O), W.set(r, $e);
      }
      const xe = U(R, A, 0), z = U(R, A, $), _ = L.length;
      L.push([
        xe,
        z
      ]), G.set(_, E), T.set(_, O), ie.set(_, Ue), se.set(_, b * b), a.set(_, b ** 4 / 12), j.set(_, b ** 4 / 12), re.set(_, 0.14 * b ** 4), W.set(_, $e), le.set(_, {
        type: "rect",
        b,
        h: b
      });
      const K = /* @__PURE__ */ new Map();
      K.set(z, [
        0,
        0,
        -Y,
        ne,
        C,
        0
      ]);
      const H = l / g, J = m / g, ce = o.kh_ratio ?? 0.5, he = o.kRot_factor ?? 1e-4, I = (o.support_mode ?? 0) | 0, f = [], de = [], ve = /* @__PURE__ */ new Map();
      for (let e = 0; e < M.length; e++) for (let t = 0; t < p.length; t++) {
        const r = H * J * (t === 0 || t === p.length - 1 ? 0.5 : 1) * (e === 0 || e === M.length - 1 ? 0.5 : 1), u = F * r;
        if (I === 0) {
          const d = F * r * ce;
          f.push({
            node: c[e][t],
            dof: 0,
            k: d
          }), f.push({
            node: c[e][t],
            dof: 1,
            k: d
          });
        }
        f.push({
          node: c[e][t],
          dof: 2,
          k: u
        }), de.push(c[e][t]);
      }
      if (I === 0) {
        const e = F * H * J * he, t = c[0][0];
        f.push({
          node: t,
          dof: 3,
          k: e
        }), f.push({
          node: t,
          dof: 4,
          k: e
        }), f.push({
          node: t,
          dof: 5,
          k: e
        });
      } else if (I === 1) {
        const e = M.length - 1, t = p.length - 1, r = [
          c[0][0],
          c[0][t],
          c[e][0],
          c[e][t]
        ];
        for (const u of r) ve.set(u, [
          true,
          true,
          false,
          false,
          false,
          true
        ]);
      } else if (I === 2) {
        const e = c[0][0];
        ve.set(e, [
          true,
          true,
          false,
          false,
          false,
          true
        ]);
      }
      n.nodes.val = V.map((e) => [
        e[0],
        e[1],
        e[2]
      ]), n.elements.val = L, n.nodeInputs.val = {
        supports: ve,
        loads: K
      }, n.elementInputs.val = {
        elasticities: G,
        poissonsRatios: T,
        areas: se,
        momentsOfInertiaY: a,
        momentsOfInertiaZ: j,
        torsionalConstants: re,
        shearModuli: ie,
        thicknesses: ae,
        densities: W,
        sectionShapes: le
      };
      try {
        n.deformOutputs.val = ke(n.nodes.val, n.elements.val, n.nodeInputs.val, n.elementInputs.val, f);
        const e = Ze(n.nodes.val, n.elements.val, n.elementInputs.val, n.deformOutputs.val), t = (i) => {
          const N = /* @__PURE__ */ new Map();
          return n.elements.rawVal.forEach((D, pe) => {
            if (D.length !== 4) return;
            const ee = [];
            for (const Me of D) {
              const _e = i == null ? void 0 : i.get(Me), oe = _e ? _e[2] : 0;
              ee.push(F * oe);
            }
            N.set(pe, ee);
          }), N;
        }, r = n.deformOutputs.rawVal.deformations, u = t(r);
        let d = 0;
        u.forEach((i) => {
          for (const N of i) N < d && (d = N);
        }), e.pressure = u;
        const fe = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map([
            [
              z,
              [
                0,
                0,
                -Y,
                0,
                0,
                0
              ]
            ]
          ])
        }, ue = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map([
            [
              z,
              [
                0,
                0,
                0,
                ne,
                0,
                0
              ]
            ]
          ])
        }, we = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map([
            [
              z,
              [
                0,
                0,
                0,
                0,
                C,
                0
              ]
            ]
          ])
        };
        try {
          const i = ke(n.nodes.val, n.elements.val, fe, n.elementInputs.val, f);
          e.pressure_P = t(i.deformations), e.deform_P = i.deformations;
        } catch (i) {
          console.error(`[zapata-aislada-validacion] deform(P) fallo: ${(i == null ? void 0 : i.message) ?? i}`);
        }
        try {
          const i = ke(n.nodes.val, n.elements.val, ue, n.elementInputs.val, f);
          e.pressure_Mx = t(i.deformations), e.deform_Mx = i.deformations;
        } catch (i) {
          console.error(`[zapata-aislada-validacion] deform(Mx) fallo: ${(i == null ? void 0 : i.message) ?? i}`);
        }
        try {
          const i = ke(n.nodes.val, n.elements.val, we, n.elementInputs.val, f);
          e.pressure_My = t(i.deformations), e.deform_My = i.deformations;
        } catch (i) {
          console.error(`[zapata-aislada-validacion] deform(My) fallo: ${(i == null ? void 0 : i.message) ?? i}`);
        }
        n.analyzeOutputs.val = e;
        const Q = Math.abs(d);
        let y = 1 / 0;
        u.forEach((i) => {
          for (const N of i) {
            const D = Math.abs(N);
            D < y && (y = D);
          }
        }), Number.isFinite(y) || (y = 0);
        const B = Q / s, k = y / s, x = B / o.q_adm, S = E * v ** 3 / (12 * (1 - O ** 2)), X = S / (F * l ** 4);
        console.log(`[Zapata VALIDACI\xD3N \u2014 espejo Calcpad]
  Cargas: P=${(o.P_simple ?? 0).toFixed(2)} tonf, Mx=${(o.Mx_simple ?? 0).toFixed(2)} tonf\xB7m, My=${(o.My_simple ?? 0).toFixed(2)} tonf\xB7m
  \u2500\u2500\u2500 Valores derivados (comparar con Calcpad) \u2500\u2500\u2500
  D flexural = ${S.toFixed(1)} kN\xB7m   (Calcpad: idem)
  ks         = ${F.toFixed(0)} kN/m\xB3   (Calcpad: idem)
  k_r Biot   = ${X.toFixed(3)} ${X < 1 ? "FLEXIBLE" : "R\xCDGIDA"}
  \u2500\u2500\u2500 Resultados FEM Hekatan \u2500\u2500\u2500
  q_max (centro) = -${B.toFixed(2)} tonf/m\xB2
  q_min (bordes) = -${k.toFixed(2)} tonf/m\xB2
  variaci\xF3n = ${((1 - k / (B || 1)) * 100).toFixed(1)}%
  ratio q/q_adm = ${x.toFixed(3)} ${x > 1 ? "\u26A0 SOBREPASA" : "\u2713 OK"}
  FS = ${(o.q_adm / (B || 1)).toFixed(3)}`);
      } catch (e) {
        console.error("Solver error zapata validaci\xF3n:", e);
      }
      const Ie = n.deformOutputs.rawVal.deformations;
      let be = 1e-9;
      for (const e of de) {
        const t = Ie == null ? void 0 : Ie.get(e);
        t && Number.isFinite(t[2]) && (be = Math.max(be, Math.abs(t[2])));
      }
      const ge = Ae * 12, Ce = new Set(de), me = (_a = document.querySelector("#viewer")) == null ? void 0 : _a.__settings, ye = (e, t, r = 1) => {
        const u = e ? t : 0, d = -(be * Math.max(u, 1) + Ke), fe = r > 0 ? r : r < 0 ? -1 / r : 1, ue = Je * fe, we = Qe * fe, Q = [];
        for (const y of de) {
          if (!Ce.has(y)) continue;
          const B = n.nodes.rawVal[y];
          if (!B) continue;
          const k = B[0], x = B[1], S = Ie == null ? void 0 : Ie.get(y), X = (h) => Number.isFinite(h) ? h : 0, i = S ? X(S[0]) : 0, N = S ? X(S[1]) : 0, D = S ? X(S[2]) : 0, pe = k + i * u, ee = x + N * u, Me = 0 + D * u, _e = Me - d, oe = (h) => [
            k + (pe - k) * h,
            x + (ee - x) * h,
            d + _e * h
          ], [Le, De, Ee] = oe(0), [Oe, Ve, Ge] = oe(0.05), Fe = [
            new q(Le, De, Ee),
            new q(Oe, Ve, Ge)
          ];
          for (let h = 0; h <= ge; h++) {
            const Xe = 0.05 + 0.9 * (h / ge), [Ye, Te, je] = oe(Xe), Se = 2 * Math.PI * Ae * (h / ge);
            Fe.push(new q(Ye + ue * Math.cos(Se), Te + ue * Math.sin(Se), je));
          }
          Fe.push(new q(pe, ee, Me)), Q.push(new Ne(new qe().setFromPoints(Fe), eo));
          const w = we, He = [
            new q(k - w, x - w, d),
            new q(k + w, x - w, d),
            new q(k + w, x + w, d),
            new q(k - w, x + w, d),
            new q(k - w, x - w, d)
          ];
          Q.push(new Ne(new qe().setFromPoints(He), oo));
        }
        return Q;
      }, Re = Pe.v;
      me ? We.derive(() => {
        if (Pe.v !== Re) return;
        const e = me.deformedShape.val, t = me.deformScale.val, r = me.displayScale.val;
        n.objects3D.val = ye(e, t, r);
      }) : n.objects3D.val = ye(true, 1, 1);
    }
  };
});
export {
  __tla,
  io as z
};
