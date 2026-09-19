import { b as Co, v as Yo, V as S, d as So, B as $o } from "./Text-BE1eWO-3.js";
import { a as Uo, __tla as __tla_0 } from "./analyze-z5-NnG8o.js";
import { d as xo, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { a as Po } from "./exampleVersion-D1A_5i59.js";
import { f as $ } from "./units-DvA_DYrZ.js";
let ie;
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
  let E, O, Ko, Ao, n, Jo, Qo, Bo, oe, ee, te;
  E = 25e6;
  O = 0.2;
  Ko = E / (2 * (1 + O));
  Ao = 24;
  n = 9.80665;
  Jo = 0.2;
  Qo = 0.035;
  Bo = 8;
  oe = 0.04;
  ee = new Co({
    color: 16711731,
    linewidth: 2
  });
  te = new Co({
    color: 52224,
    linewidth: 2
  });
  ie = {
    id: "zapata-aislada-validacion",
    name: "Zapata Aislada \u2014 Hekatan vs SAFE/Calcpad (Bowles)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    benchmark: true,
    defaultShellResult: "pressure",
    availableShellResults: [
      "pressure",
      "bendingXX",
      "bendingYY",
      "displacementZ",
      "vonMises"
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
          return `k_area (${$.val}/m\xB3)`;
        },
        compute: (e) => {
          const s = (e.q_adm ?? 10) * n * (e.ks_factor ?? 10.5), i = $.val, m = i === "tonf" ? 1 / n : i === "kip" ? 1 / 4.4482216 : 1;
          return (s * m).toFixed(i === "kN" ? 0 : 2) + " (Bowles)";
        },
        hiddenIf: (e) => Math.round(e.springMode ?? 0) !== 0
      },
      {
        after: "ks_factor",
        get label() {
          return `ks computed (${$.val}/m\xB3)`;
        },
        compute: (e) => {
          const s = (e.q_adm ?? 10) * n * (e.ks_factor ?? 10.5), i = $.val, m = i === "tonf" ? 1 / n : i === "kip" ? 1 / 4.4482216 : 1;
          return (s * m).toFixed(i === "kN" ? 0 : 2);
        },
        hiddenIf: (e) => Math.round(e.springMode ?? 0) !== 0
      },
      {
        after: "ks",
        get label() {
          return `k_spring/nodo (${$.val}/m)`;
        },
        compute: (e) => {
          const m = (Math.round(e.springMode ?? 0) === 0 ? (e.q_adm ?? 10) * (e.ks_factor ?? 10.5) : e.ks ?? 2e3) * n, v = (e.Lz ?? 1.5) * (e.Bz ?? 1.5) / Math.max(1, Math.pow(e.nSub ?? 10, 2)), b = m * v, P = $.val, to = P === "tonf" ? 1 / n : P === "kip" ? 1 / 4.4482216 : 1;
          return (b * to).toFixed(P === "kN" ? 1 : 3);
        }
      },
      {
        after: "tz",
        get label() {
          return `D flexural (${$.val}\xB7m)`;
        },
        compute: (e) => {
          const s = e.tz ?? 0.3, i = E * s ** 3 / (12 * (1 - O ** 2)), m = $.val, v = m === "tonf" ? 1 / n : m === "kip" ? 1 / 4.4482216 : 1;
          return (i * v).toFixed(1);
        }
      },
      {
        after: "ks",
        label: "k_r Biot",
        compute: (e) => {
          const s = e.tz ?? 0.3, i = e.Lz ?? 1.5, m = (e.ks ?? 10500) * n, v = E * s ** 3 / (12 * (1 - O ** 2)) / (m * i ** 4);
          return v.toFixed(3) + (v < 1 ? " FLEX" : " RIGID");
        }
      }
    ],
    computedLabels(e, s) {
      var _a, _b;
      const i = e.q_adm ?? 10, m = e.ks_factor ?? 10.5, P = (Math.round(e.springMode ?? 0) === 0 ? i * m : e.ks ?? 2e3) * n, to = e.tz ?? 0.3, Io = e.Lz ?? 1.5, F = E * to ** 3 / (12 * (1 - O ** 2)), j = F / (P * Io ** 4), so = e.P_simple ?? 0;
      let C = 0, g = 0, R = false;
      const A = (_a = s.analyzeOutputs.rawVal) == null ? void 0 : _a.pressure;
      if (A && A.size) for (const I of A.values()) for (const f of I) R || (C = g = f, R = true), f < C && (C = f), f > g && (g = f);
      const p = Math.abs(C), _ = Math.abs(g), V = p / n, L = _ / n, G = V / (i || 1), W = e.kh_ratio ?? 0.5, no = (e.support_mode ?? 0) | 0, ao = [
        "A. Winkler 3D",
        "B. Vert+esquinas",
        "C. Vert+1 nodo"
      ][no], a = $.val, X = a === "tonf" ? 1 / n : a === "kip" ? 1 / 4.4482216 : 1, lo = P * X, ro = F * X, Z = V * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), io = L * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), Y = i * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), U = so * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), c = (e.Mx_simple ?? 0) * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), ho = (e.My_simple ?? 0) * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), z = (e.q_adm ?? 10) === 10 && (e.P_simple ?? 0) === 20 && Math.abs((e.Mx_simple ?? 0) - 0.5) < 0.01 && Math.abs((e.My_simple ?? 0) - -0.5) < 0.01 && (e.Lz ?? 1.5) === 1.5 && (e.Bz ?? 1.5) === 1.5, M = z ? "96.7 mm" : "(no aplica)", K = (_b = s.deformOutputs.rawVal) == null ? void 0 : _b.deformations;
      let H = 0;
      K && K.forEach((I) => {
        Math.abs(I[2]) > Math.abs(H) && (H = I[2]);
      });
      const J = Math.abs(H) * 1e3, co = 96.7, vo = z ? (J - co) / co * 100 : 0;
      return {
        Mode: "Direct P/Mx/My",
        Soporte: ao,
        [`ks usado (${a}/m\xB3)`]: lo.toFixed(a === "kN" ? 0 : 2),
        "k_h/k_v": W.toFixed(2) + " (Bowles)",
        [`D (${a}\xB7m)`]: ro.toFixed(1),
        "k_r (Biot)": j.toFixed(3) + (j < 1 ? " FLEXIBLE" : " RIGID"),
        [`P (${a})`]: U.toFixed(2),
        [`Mx (${a}\xB7m)`]: c.toFixed(2),
        [`My (${a}\xB7m)`]: ho.toFixed(2),
        [`\u03C3_max comp (${a}/m\xB2)`]: Z.toFixed(2),
        [`\u03C3_min comp (${a}/m\xB2)`]: io.toFixed(2),
        [`q_adm (${a}/m\xB2)`]: Y.toFixed(2),
        "\u03C3/q_adm": G.toFixed(2) + (G > 1 ? " \u26A0" : " \u2713"),
        "\u2014\u2014 Validaci\xF3n cruzada \u2014\u2014": "",
        "Hekatan w_max (mm)": J.toFixed(2),
        "SAFE w_max ref (mm)": M,
        "Diff Hekatan vs SAFE": z ? `${vo.toFixed(1)}%` : "(cambia params al default)"
      };
    },
    build(e, s) {
      var _a;
      const { Lz: i, Bz: m, tz: v, bc: b, Hp: P } = e;
      e.q_adm * n;
      const F = (Math.round(e.springMode ?? 0) === 0 ? e.q_adm * e.ks_factor : e.ks ?? 2e3) * n, j = (e.P_simple ?? 0) * n, so = (e.Mx_simple ?? 0) * n, C = (e.My_simple ?? 0) * n, g = Math.round(e.nSub), R = i / 2, A = m / 2, p = [], _ = [];
      for (let o = 0; o <= g; o++) p.push(i * o / g), _.push(m * o / g);
      p.includes(R) || (p.push(R), p.sort((o, t) => o - t)), _.includes(A) || (_.push(A), _.sort((o, t) => o - t));
      const V = [], L = [], G = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), no = /* @__PURE__ */ new Map(), ao = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), lo = /* @__PURE__ */ new Map(), ro = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), io = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), U = (o, t, l) => {
        const u = `${o.toFixed(4)},${t.toFixed(4)},${l.toFixed(4)}`;
        if (Y.has(u)) return Y.get(u);
        const d = V.length;
        return V.push([
          o,
          t,
          l
        ]), Y.set(u, d), d;
      }, c = [];
      for (let o = 0; o < _.length; o++) {
        const t = [];
        for (let l = 0; l < p.length; l++) t.push(U(p[l], _[o], 0));
        c.push(t);
      }
      for (let o = 0; o < _.length - 1; o++) for (let t = 0; t < p.length - 1; t++) {
        const l = L.length;
        L.push([
          c[o][t],
          c[o][t + 1],
          c[o + 1][t + 1],
          c[o + 1][t]
        ]), ao.set(l, v), G.set(l, E), W.set(l, O), Z.set(l, Ao);
      }
      const ho = U(R, A, 0), z = U(R, A, P), M = L.length;
      L.push([
        ho,
        z
      ]), G.set(M, E), W.set(M, O), ro.set(M, Ko), no.set(M, b * b), a.set(M, b ** 4 / 12), X.set(M, b ** 4 / 12), lo.set(M, 0.14 * b ** 4), Z.set(M, Ao), io.set(M, {
        type: "rect",
        b,
        h: b
      });
      const K = /* @__PURE__ */ new Map();
      K.set(z, [
        0,
        0,
        -j,
        so,
        C,
        0
      ]);
      const H = i / g, J = m / g, co = e.kh_ratio ?? 0.5, vo = e.kRot_factor ?? 1e-4, I = (e.support_mode ?? 0) | 0, f = [], mo = [], bo = /* @__PURE__ */ new Map();
      for (let o = 0; o < _.length; o++) for (let t = 0; t < p.length; t++) {
        const l = H * J * (t === 0 || t === p.length - 1 ? 0.5 : 1) * (o === 0 || o === _.length - 1 ? 0.5 : 1), u = F * l;
        if (I === 0) {
          const d = F * l * co;
          f.push({
            node: c[o][t],
            dof: 0,
            k: d
          }), f.push({
            node: c[o][t],
            dof: 1,
            k: d
          });
        }
        f.push({
          node: c[o][t],
          dof: 2,
          k: u
        }), mo.push(c[o][t]);
      }
      if (I === 0) {
        const o = F * H * J * vo, t = c[0][0];
        f.push({
          node: t,
          dof: 3,
          k: o
        }), f.push({
          node: t,
          dof: 4,
          k: o
        }), f.push({
          node: t,
          dof: 5,
          k: o
        });
      } else if (I === 1) {
        const o = _.length - 1, t = p.length - 1, l = [
          c[0][0],
          c[0][t],
          c[o][0],
          c[o][t]
        ];
        for (const u of l) bo.set(u, [
          true,
          true,
          false,
          false,
          false,
          true
        ]);
      } else if (I === 2) {
        const o = c[0][0];
        bo.set(o, [
          true,
          true,
          false,
          false,
          false,
          true
        ]);
      }
      s.nodes.val = V.map((o) => [
        o[0],
        o[1],
        o[2]
      ]), s.elements.val = L, s.nodeInputs.val = {
        supports: bo,
        loads: K
      }, s.elementInputs.val = {
        elasticities: G,
        poissonsRatios: W,
        areas: no,
        momentsOfInertiaY: a,
        momentsOfInertiaZ: X,
        torsionalConstants: lo,
        shearModuli: ro,
        thicknesses: ao,
        densities: Z,
        sectionShapes: io
      };
      try {
        s.deformOutputs.val = xo(s.nodes.val, s.elements.val, s.nodeInputs.val, s.elementInputs.val, f);
        const o = Uo(s.nodes.val, s.elements.val, s.elementInputs.val, s.deformOutputs.val), t = (r) => {
          const q = /* @__PURE__ */ new Map();
          return s.elements.rawVal.forEach((D, _o) => {
            if (D.length !== 4) return;
            const oo = [];
            for (const Mo of D) {
              const ko = r == null ? void 0 : r.get(Mo), eo = ko ? ko[2] : 0;
              oo.push(F * eo);
            }
            q.set(_o, oo);
          }), q;
        }, l = s.deformOutputs.rawVal.deformations, u = t(l);
        let d = 0;
        u.forEach((r) => {
          for (const q of r) q < d && (d = q);
        }), o.pressure = u;
        const uo = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map([
            [
              z,
              [
                0,
                0,
                -j,
                0,
                0,
                0
              ]
            ]
          ])
        }, po = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map([
            [
              z,
              [
                0,
                0,
                0,
                so,
                0,
                0
              ]
            ]
          ])
        }, Fo = {
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
          const r = xo(s.nodes.val, s.elements.val, uo, s.elementInputs.val, f);
          o.pressure_P = t(r.deformations), o.deform_P = r.deformations;
        } catch (r) {
          console.error(`[zapata-aislada-validacion] deform(P) fallo: ${(r == null ? void 0 : r.message) ?? r}`);
        }
        try {
          const r = xo(s.nodes.val, s.elements.val, po, s.elementInputs.val, f);
          o.pressure_Mx = t(r.deformations), o.deform_Mx = r.deformations;
        } catch (r) {
          console.error(`[zapata-aislada-validacion] deform(Mx) fallo: ${(r == null ? void 0 : r.message) ?? r}`);
        }
        try {
          const r = xo(s.nodes.val, s.elements.val, Fo, s.elementInputs.val, f);
          o.pressure_My = t(r.deformations), o.deform_My = r.deformations;
        } catch (r) {
          console.error(`[zapata-aislada-validacion] deform(My) fallo: ${(r == null ? void 0 : r.message) ?? r}`);
        }
        s.analyzeOutputs.val = o;
        const Q = Math.abs(d);
        let y = 1 / 0;
        u.forEach((r) => {
          for (const q of r) {
            const D = Math.abs(q);
            D < y && (y = D);
          }
        }), Number.isFinite(y) || (y = 0);
        const B = Q / n, k = y / n, x = B / e.q_adm, N = E * v ** 3 / (12 * (1 - O ** 2)), T = N / (F * i ** 4);
        console.log(`[Zapata VALIDACI\xD3N \u2014 espejo Calcpad]
  Cargas: P=${(e.P_simple ?? 0).toFixed(2)} tonf, Mx=${(e.Mx_simple ?? 0).toFixed(2)} tonf\xB7m, My=${(e.My_simple ?? 0).toFixed(2)} tonf\xB7m
  \u2500\u2500\u2500 Valores derivados (comparar con Calcpad) \u2500\u2500\u2500
  D flexural = ${N.toFixed(1)} kN\xB7m   (Calcpad: idem)
  ks         = ${F.toFixed(0)} kN/m\xB3   (Calcpad: idem)
  k_r Biot   = ${T.toFixed(3)} ${T < 1 ? "FLEXIBLE" : "R\xCDGIDA"}
  \u2500\u2500\u2500 Resultados FEM Hekatan \u2500\u2500\u2500
  q_max (centro) = -${B.toFixed(2)} tonf/m\xB2
  q_min (bordes) = -${k.toFixed(2)} tonf/m\xB2
  variaci\xF3n = ${((1 - k / (B || 1)) * 100).toFixed(1)}%
  ratio q/q_adm = ${x.toFixed(3)} ${x > 1 ? "\u26A0 SOBREPASA" : "\u2713 OK"}
  FS = ${(e.q_adm / (B || 1)).toFixed(3)}`);
      } catch (o) {
        console.error("Solver error zapata validaci\xF3n:", o);
      }
      const yo = s.deformOutputs.rawVal.deformations;
      let go = 1e-9;
      for (const o of mo) {
        const t = yo == null ? void 0 : yo.get(o);
        t && Number.isFinite(t[2]) && (go = Math.max(go, Math.abs(t[2])));
      }
      const wo = Bo * 12, Ro = new Set(mo), fo = (_a = document.querySelector("#viewer")) == null ? void 0 : _a.__settings, No = (o, t, l = 1) => {
        const u = o ? t : 0, d = -(go * Math.max(u, 1) + Jo), uo = l > 0 ? l : l < 0 ? -1 / l : 1, po = Qo * uo, Fo = oe * uo, Q = [];
        for (const y of mo) {
          if (!Ro.has(y)) continue;
          const B = s.nodes.rawVal[y];
          if (!B) continue;
          const k = B[0], x = B[1], N = yo == null ? void 0 : yo.get(y), T = (h) => Number.isFinite(h) ? h : 0, r = N ? T(N[0]) : 0, q = N ? T(N[1]) : 0, D = N ? T(N[2]) : 0, _o = k + r * u, oo = x + q * u, Mo = 0 + D * u, ko = Mo - d, eo = (h) => [
            k + (_o - k) * h,
            x + (oo - x) * h,
            d + ko * h
          ], [Do, Eo, Oo] = eo(0), [Vo, Go, Ho] = eo(0.05), zo = [
            new S(Do, Eo, Oo),
            new S(Vo, Go, Ho)
          ];
          for (let h = 0; h <= wo; h++) {
            const jo = 0.05 + 0.9 * (h / wo), [Wo, Xo, Zo] = eo(jo), qo = 2 * Math.PI * Bo * (h / wo);
            zo.push(new S(Wo + po * Math.cos(qo), Xo + po * Math.sin(qo), Zo));
          }
          zo.push(new S(_o, oo, Mo)), Q.push(new So(new $o().setFromPoints(zo), ee));
          const w = Fo, To = [
            new S(k - w, x - w, d),
            new S(k + w, x - w, d),
            new S(k + w, x + w, d),
            new S(k - w, x + w, d),
            new S(k - w, x - w, d)
          ];
          Q.push(new So(new $o().setFromPoints(To), te));
        }
        return Q;
      }, Lo = Po.v;
      fo ? Yo.derive(() => {
        if (Po.v !== Lo) return;
        const o = fo.deformedShape.val, t = fo.deformScale.val, l = fo.displayScale.val;
        s.objects3D.val = No(o, t, l);
      }) : s.objects3D.val = No(true, 1, 1);
    }
  };
});
export {
  __tla,
  ie as z
};
