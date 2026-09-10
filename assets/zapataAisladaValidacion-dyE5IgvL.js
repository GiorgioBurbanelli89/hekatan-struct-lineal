import { a as Co, v as Yo, V as S, d as So, B as Ao } from "./theme-Dxpmbnyd.js";
import { a as Uo } from "./analyze-DgLgRmKg.js";
import { d as xo, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { a as Po } from "./exampleVersion-D1A_5i59.js";
import { f as A } from "./units-DYymsd53.js";
let rt;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let E, O, Ko, $o, n, Jo, Qo, Bo, ot, tt, et;
  E = 25e6;
  O = 0.2;
  Ko = E / (2 * (1 + O));
  $o = 24;
  n = 9.80665;
  Jo = 0.2;
  Qo = 0.035;
  Bo = 8;
  ot = 0.04;
  tt = new Co({
    color: 16711731,
    linewidth: 2
  });
  et = new Co({
    color: 52224,
    linewidth: 2
  });
  rt = {
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
          return `k_area (${A.val}/m\xB3)`;
        },
        compute: (t) => {
          const s = (t.q_adm ?? 10) * n * (t.ks_factor ?? 10.5), i = A.val, d = i === "tonf" ? 1 / n : i === "kip" ? 1 / 4.4482216 : 1;
          return (s * d).toFixed(i === "kN" ? 0 : 2) + " (Bowles)";
        },
        hiddenIf: (t) => Math.round(t.springMode ?? 0) !== 0
      },
      {
        after: "ks_factor",
        get label() {
          return `ks computed (${A.val}/m\xB3)`;
        },
        compute: (t) => {
          const s = (t.q_adm ?? 10) * n * (t.ks_factor ?? 10.5), i = A.val, d = i === "tonf" ? 1 / n : i === "kip" ? 1 / 4.4482216 : 1;
          return (s * d).toFixed(i === "kN" ? 0 : 2);
        },
        hiddenIf: (t) => Math.round(t.springMode ?? 0) !== 0
      },
      {
        after: "ks",
        get label() {
          return `k_spring/nodo (${A.val}/m)`;
        },
        compute: (t) => {
          const d = (Math.round(t.springMode ?? 0) === 0 ? (t.q_adm ?? 10) * (t.ks_factor ?? 10.5) : t.ks ?? 2e3) * n, v = (t.Lz ?? 1.5) * (t.Bz ?? 1.5) / Math.max(1, Math.pow(t.nSub ?? 10, 2)), b = d * v, P = A.val, eo = P === "tonf" ? 1 / n : P === "kip" ? 1 / 4.4482216 : 1;
          return (b * eo).toFixed(P === "kN" ? 1 : 3);
        }
      },
      {
        after: "tz",
        get label() {
          return `D flexural (${A.val}\xB7m)`;
        },
        compute: (t) => {
          const s = t.tz ?? 0.3, i = E * s ** 3 / (12 * (1 - O ** 2)), d = A.val, v = d === "tonf" ? 1 / n : d === "kip" ? 1 / 4.4482216 : 1;
          return (i * v).toFixed(1);
        }
      },
      {
        after: "ks",
        label: "k_r Biot",
        compute: (t) => {
          const s = t.tz ?? 0.3, i = t.Lz ?? 1.5, d = (t.ks ?? 10500) * n, v = E * s ** 3 / (12 * (1 - O ** 2)) / (d * i ** 4);
          return v.toFixed(3) + (v < 1 ? " FLEX" : " RIGID");
        }
      }
    ],
    computedLabels(t, s) {
      var _a, _b;
      const i = t.q_adm ?? 10, d = t.ks_factor ?? 10.5, P = (Math.round(t.springMode ?? 0) === 0 ? i * d : t.ks ?? 2e3) * n, eo = t.tz ?? 0.3, zo = t.Lz ?? 1.5, F = E * eo ** 3 / (12 * (1 - O ** 2)), j = F / (P * zo ** 4), so = t.P_simple ?? 0;
      let C = 0, g = 0, R = false;
      const $ = (_a = s.analyzeOutputs.rawVal) == null ? void 0 : _a.pressure;
      if ($ && $.size) for (const z of $.values()) for (const m of z) R || (C = g = m, R = true), m < C && (C = m), m > g && (g = m);
      const p = Math.abs(C), _ = Math.abs(g), V = p / n, L = _ / n, G = V / (i || 1), W = t.kh_ratio ?? 0.5, no = (t.support_mode ?? 0) | 0, ao = [
        "A. Winkler 3D",
        "B. Vert+esquinas",
        "C. Vert+1 nodo"
      ][no], a = A.val, X = a === "tonf" ? 1 / n : a === "kip" ? 1 / 4.4482216 : 1, lo = P * X, io = F * X, Z = V * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), ro = L * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), Y = i * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), U = so * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), r = (t.Mx_simple ?? 0) * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), ho = (t.My_simple ?? 0) * (a === "tonf" ? 1 : a === "kip" ? n / 4.4482216 : n), I = (t.q_adm ?? 10) === 10 && (t.P_simple ?? 0) === 20 && Math.abs((t.Mx_simple ?? 0) - 0.5) < 0.01 && Math.abs((t.My_simple ?? 0) - -0.5) < 0.01 && (t.Lz ?? 1.5) === 1.5 && (t.Bz ?? 1.5) === 1.5, M = I ? "96.7 mm" : "(no aplica)", K = (_b = s.deformOutputs.rawVal) == null ? void 0 : _b.deformations;
      let H = 0;
      K && K.forEach((z) => {
        Math.abs(z[2]) > Math.abs(H) && (H = z[2]);
      });
      const J = Math.abs(H) * 1e3, co = 96.7, vo = I ? (J - co) / co * 100 : 0;
      return {
        Mode: "Direct P/Mx/My",
        Soporte: ao,
        [`ks usado (${a}/m\xB3)`]: lo.toFixed(a === "kN" ? 0 : 2),
        "k_h/k_v": W.toFixed(2) + " (Bowles)",
        [`D (${a}\xB7m)`]: io.toFixed(1),
        "k_r (Biot)": j.toFixed(3) + (j < 1 ? " FLEXIBLE" : " RIGID"),
        [`P (${a})`]: U.toFixed(2),
        [`Mx (${a}\xB7m)`]: r.toFixed(2),
        [`My (${a}\xB7m)`]: ho.toFixed(2),
        [`\u03C3_max comp (${a}/m\xB2)`]: Z.toFixed(2),
        [`\u03C3_min comp (${a}/m\xB2)`]: ro.toFixed(2),
        [`q_adm (${a}/m\xB2)`]: Y.toFixed(2),
        "\u03C3/q_adm": G.toFixed(2) + (G > 1 ? " \u26A0" : " \u2713"),
        "\u2014\u2014 Validaci\xF3n cruzada \u2014\u2014": "",
        "Hekatan w_max (mm)": J.toFixed(2),
        "SAFE w_max ref (mm)": M,
        "Diff Hekatan vs SAFE": I ? `${vo.toFixed(1)}%` : "(cambia params al default)"
      };
    },
    build(t, s) {
      var _a;
      const { Lz: i, Bz: d, tz: v, bc: b, Hp: P } = t;
      t.q_adm * n;
      const F = (Math.round(t.springMode ?? 0) === 0 ? t.q_adm * t.ks_factor : t.ks ?? 2e3) * n, j = (t.P_simple ?? 0) * n, so = (t.Mx_simple ?? 0) * n, C = (t.My_simple ?? 0) * n, g = Math.round(t.nSub), R = i / 2, $ = d / 2, p = [], _ = [];
      for (let o = 0; o <= g; o++) p.push(i * o / g), _.push(d * o / g);
      p.includes(R) || (p.push(R), p.sort((o, e) => o - e)), _.includes($) || (_.push($), _.sort((o, e) => o - e));
      const V = [], L = [], G = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), no = /* @__PURE__ */ new Map(), ao = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), lo = /* @__PURE__ */ new Map(), io = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), ro = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), U = (o, e, l) => {
        const f = `${o.toFixed(4)},${e.toFixed(4)},${l.toFixed(4)}`;
        if (Y.has(f)) return Y.get(f);
        const c = V.length;
        return V.push([
          o,
          e,
          l
        ]), Y.set(f, c), c;
      }, r = [];
      for (let o = 0; o < _.length; o++) {
        const e = [];
        for (let l = 0; l < p.length; l++) e.push(U(p[l], _[o], 0));
        r.push(e);
      }
      for (let o = 0; o < _.length - 1; o++) for (let e = 0; e < p.length - 1; e++) {
        const l = L.length;
        L.push([
          r[o][e],
          r[o][e + 1],
          r[o + 1][e + 1],
          r[o + 1][e]
        ]), ao.set(l, v), G.set(l, E), W.set(l, O), Z.set(l, $o);
      }
      const ho = U(R, $, 0), I = U(R, $, P), M = L.length;
      L.push([
        ho,
        I
      ]), G.set(M, E), W.set(M, O), io.set(M, Ko), no.set(M, b * b), a.set(M, b ** 4 / 12), X.set(M, b ** 4 / 12), lo.set(M, 0.14 * b ** 4), Z.set(M, $o), ro.set(M, {
        type: "rect",
        b,
        h: b
      });
      const K = /* @__PURE__ */ new Map();
      K.set(I, [
        0,
        0,
        -j,
        so,
        C,
        0
      ]);
      const H = i / g, J = d / g, co = t.kh_ratio ?? 0.5, vo = t.kRot_factor ?? 1e-4, z = (t.support_mode ?? 0) | 0, m = [], mo = [], bo = /* @__PURE__ */ new Map();
      for (let o = 0; o < _.length; o++) for (let e = 0; e < p.length; e++) {
        const l = H * J * (e === 0 || e === p.length - 1 ? 0.5 : 1) * (o === 0 || o === _.length - 1 ? 0.5 : 1), f = F * l;
        if (z === 0) {
          const c = F * l * co;
          m.push({
            node: r[o][e],
            dof: 0,
            k: c
          }), m.push({
            node: r[o][e],
            dof: 1,
            k: c
          });
        }
        m.push({
          node: r[o][e],
          dof: 2,
          k: f
        }), mo.push(r[o][e]);
      }
      if (z === 0) {
        const o = F * H * J * vo, e = r[0][0];
        m.push({
          node: e,
          dof: 3,
          k: o
        }), m.push({
          node: e,
          dof: 4,
          k: o
        }), m.push({
          node: e,
          dof: 5,
          k: o
        });
      } else if (z === 1) {
        const o = _.length - 1, e = p.length - 1, l = [
          r[0][0],
          r[0][e],
          r[o][0],
          r[o][e]
        ];
        for (const f of l) bo.set(f, [
          true,
          true,
          false,
          false,
          false,
          true
        ]);
      } else if (z === 2) {
        const o = r[0][0];
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
        shearModuli: io,
        thicknesses: ao,
        densities: Z,
        sectionShapes: ro
      };
      try {
        s.deformOutputs.val = xo(s.nodes.val, s.elements.val, s.nodeInputs.val, s.elementInputs.val, m);
        const o = Uo(s.nodes.val, s.elements.val, s.elementInputs.val, s.deformOutputs.val), e = (u) => {
          const q = /* @__PURE__ */ new Map();
          return s.elements.rawVal.forEach((D, _o) => {
            if (D.length !== 4) return;
            const oo = [];
            for (const Mo of D) {
              const ko = u == null ? void 0 : u.get(Mo), to = ko ? ko[2] : 0;
              oo.push(F * to);
            }
            q.set(_o, oo);
          }), q;
        }, l = s.deformOutputs.rawVal.deformations, f = e(l);
        let c = 0;
        f.forEach((u) => {
          for (const q of u) q < c && (c = q);
        }), o.pressure = f;
        const uo = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map([
            [
              I,
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
              I,
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
              I,
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
          const u = xo(s.nodes.val, s.elements.val, uo, s.elementInputs.val, m);
          o.pressure_P = e(u.deformations), o.deform_P = u.deformations;
        } catch {
        }
        try {
          const u = xo(s.nodes.val, s.elements.val, po, s.elementInputs.val, m);
          o.pressure_Mx = e(u.deformations), o.deform_Mx = u.deformations;
        } catch {
        }
        try {
          const u = xo(s.nodes.val, s.elements.val, Fo, s.elementInputs.val, m);
          o.pressure_My = e(u.deformations), o.deform_My = u.deformations;
        } catch {
        }
        s.analyzeOutputs.val = o;
        const Q = Math.abs(c);
        let y = 1 / 0;
        f.forEach((u) => {
          for (const q of u) {
            const D = Math.abs(q);
            D < y && (y = D);
          }
        }), Number.isFinite(y) || (y = 0);
        const B = Q / n, k = y / n, x = B / t.q_adm, N = E * v ** 3 / (12 * (1 - O ** 2)), T = N / (F * i ** 4);
        console.log(`[Zapata VALIDACI\xD3N \u2014 espejo Calcpad]
  Cargas: P=${(t.P_simple ?? 0).toFixed(2)} tonf, Mx=${(t.Mx_simple ?? 0).toFixed(2)} tonf\xB7m, My=${(t.My_simple ?? 0).toFixed(2)} tonf\xB7m
  \u2500\u2500\u2500 Valores derivados (comparar con Calcpad) \u2500\u2500\u2500
  D flexural = ${N.toFixed(1)} kN\xB7m   (Calcpad: idem)
  ks         = ${F.toFixed(0)} kN/m\xB3   (Calcpad: idem)
  k_r Biot   = ${T.toFixed(3)} ${T < 1 ? "FLEXIBLE" : "R\xCDGIDA"}
  \u2500\u2500\u2500 Resultados FEM Hekatan \u2500\u2500\u2500
  q_max (centro) = -${B.toFixed(2)} tonf/m\xB2
  q_min (bordes) = -${k.toFixed(2)} tonf/m\xB2
  variaci\xF3n = ${((1 - k / (B || 1)) * 100).toFixed(1)}%
  ratio q/q_adm = ${x.toFixed(3)} ${x > 1 ? "\u26A0 SOBREPASA" : "\u2713 OK"}
  FS = ${(t.q_adm / (B || 1)).toFixed(3)}`);
      } catch (o) {
        console.error("Solver error zapata validaci\xF3n:", o);
      }
      const yo = s.deformOutputs.rawVal.deformations;
      let go = 1e-9;
      for (const o of mo) {
        const e = yo == null ? void 0 : yo.get(o);
        e && Number.isFinite(e[2]) && (go = Math.max(go, Math.abs(e[2])));
      }
      const wo = Bo * 12, Ro = new Set(mo), fo = (_a = document.querySelector("#viewer")) == null ? void 0 : _a.__settings, No = (o, e, l = 1) => {
        const f = o ? e : 0, c = -(go * Math.max(f, 1) + Jo), uo = l > 0 ? l : l < 0 ? -1 / l : 1, po = Qo * uo, Fo = ot * uo, Q = [];
        for (const y of mo) {
          if (!Ro.has(y)) continue;
          const B = s.nodes.rawVal[y];
          if (!B) continue;
          const k = B[0], x = B[1], N = yo == null ? void 0 : yo.get(y), T = (h) => Number.isFinite(h) ? h : 0, u = N ? T(N[0]) : 0, q = N ? T(N[1]) : 0, D = N ? T(N[2]) : 0, _o = k + u * f, oo = x + q * f, Mo = 0 + D * f, ko = Mo - c, to = (h) => [
            k + (_o - k) * h,
            x + (oo - x) * h,
            c + ko * h
          ], [Do, Eo, Oo] = to(0), [Vo, Go, Ho] = to(0.05), Io = [
            new S(Do, Eo, Oo),
            new S(Vo, Go, Ho)
          ];
          for (let h = 0; h <= wo; h++) {
            const jo = 0.05 + 0.9 * (h / wo), [Wo, Xo, Zo] = to(jo), qo = 2 * Math.PI * Bo * (h / wo);
            Io.push(new S(Wo + po * Math.cos(qo), Xo + po * Math.sin(qo), Zo));
          }
          Io.push(new S(_o, oo, Mo)), Q.push(new So(new Ao().setFromPoints(Io), tt));
          const w = Fo, To = [
            new S(k - w, x - w, c),
            new S(k + w, x - w, c),
            new S(k + w, x + w, c),
            new S(k - w, x + w, c),
            new S(k - w, x - w, c)
          ];
          Q.push(new So(new Ao().setFromPoints(To), et));
        }
        return Q;
      }, Lo = Po.v;
      fo ? Yo.derive(() => {
        if (Po.v !== Lo) return;
        const o = fo.deformedShape.val, e = fo.deformScale.val, l = fo.displayScale.val;
        s.objects3D.val = No(o, e, l);
      }) : s.objects3D.val = No(true, 1, 1);
    }
  };
});
export {
  __tla,
  rt as z
};
