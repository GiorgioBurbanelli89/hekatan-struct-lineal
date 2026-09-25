import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./Text-Br8EG2up.js";
import { a as re } from "./analyze-CWJH9Nzr.js";
import { d as pe, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
import { g as ue, a as me, __tla as __tla_1 } from "./aiAgent-BbDbzZHq.js";
import { g as de } from "./getParameters-Dgz5Nzxm.js";
import { g as ce, __tla as __tla_2 } from "./getCad3d-L_z-o_Qc.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_3 } from "./deform-DGwQQaqs.js";
import "./preload-helper-V2P8TQsQ.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_4 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./modeScale-sgWZ-KrB.js";
import "./e2kParser-2L7GKQGH.js";
import "./cadSections-BcRFaG1j.js";
import "./materials-VwssM8Vw.js";
import "./e2kExporter-gMXh1Px4.js";
Promise.all([
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_3;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_4;
    } catch {
    }
  })()
]).then(async () => {
  function U(l, t, u, f, g, v, c, d = 0) {
    const n = Math.round(l / t);
    let m = [], i = [], C = [], T = [], M = [];
    for (let e = 0; e < n + 1; e++) {
      const I = e * t, r = (c - v) / l, s = v + r * I;
      m.push([
        d + I,
        0,
        s
      ]);
    }
    for (let e = 0; e < n + 1; e++) {
      const I = e * t, r = (g - f) / l, s = f + r * I, y = (c - v) / l, S = v + y * I;
      m.push([
        d + I,
        0,
        S + s
      ]), C.push(m.length - 1);
    }
    if (u === 1) for (let e = 0; e < n; e++) i.push([
      e,
      e + 1
    ], [
      n + 1 + e,
      n + 1 + e + 1
    ], [
      e,
      n + 1 + e
    ], [
      e,
      n + 1 + e + 1
    ]), T.push(i.length - 3, i.length - 4), M.push(i.length - 1, i.length - 2);
    if (u === 2) for (let e = 0; e < n; e++) i.push([
      e,
      e + 1
    ], [
      n + 1 + e,
      n + 1 + e + 1
    ], [
      e,
      n + 1 + e
    ], [
      e + 1,
      n + 1 + e
    ]), T.push(i.length - 3, i.length - 4), M.push(i.length - 1, i.length - 2);
    if (u === 3) for (let e = 0; e < n; e++) i.push([
      e,
      e + 1
    ], [
      n + 1 + e,
      n + 1 + e + 1
    ], [
      e,
      n + 1 + e
    ], [
      e,
      n + 1 + e + 1
    ], [
      e + 1,
      n + 1 + e
    ]), T.push(i.length - 4, i.length - 5), M.push(i.length - 1, i.length - 2, i.length - 3);
    return i.push([
      n,
      2 * n + 1
    ]), M.push(i.length - 1), {
      nodes: m,
      elements: i,
      topNodesIndices: C,
      chordsIndices: T,
      websIndices: M
    };
  }
  const p = {
    span: {
      value: a.state(20),
      min: 1,
      max: 20,
      label: "Span (m)",
      folder: "Geometry"
    },
    spacing: {
      value: a.state(2.5),
      min: 1,
      max: 5,
      label: "Spacing (m)",
      folder: "Geometry"
    },
    webType: {
      value: a.state(1),
      min: 1,
      max: 3,
      step: 1,
      label: "Web type",
      folder: "Geometry"
    },
    trimType: {
      value: a.state(1),
      min: 1,
      max: 3,
      step: 1,
      label: "Trim type",
      folder: "Geometry"
    },
    leftHeight: {
      value: a.state(2.5),
      min: 1,
      max: 10,
      step: 0.1,
      label: "Left height (m)",
      folder: "Geometry"
    },
    midHeight: {
      value: a.state(2.5),
      min: 1,
      max: 10,
      step: 0.1,
      label: "Mid height (m)",
      folder: "Geometry"
    },
    rightHeight: {
      value: a.state(2.5),
      min: 1,
      max: 10,
      step: 0.1,
      label: "Right height (m)",
      folder: "Geometry"
    },
    leftOffset: {
      value: a.state(0),
      min: 0,
      max: 10,
      step: 0.1,
      label: "Left offset (m)",
      folder: "Geometry"
    },
    midOffset: {
      value: a.state(5),
      min: 0,
      max: 10,
      step: 0.1,
      label: "Mid offset (m)",
      folder: "Geometry"
    },
    rightOffset: {
      value: a.state(0),
      min: 0,
      max: 10,
      step: 0.1,
      label: "Right offset (m)",
      folder: "Geometry"
    },
    supportType: {
      value: a.state(1),
      min: 1,
      max: 2,
      step: 1,
      label: "Support type",
      folder: "Supports"
    },
    uniformLoad: {
      value: a.state(300),
      min: 0,
      max: 1e3,
      step: 1,
      label: "Uniform load (KN/m)",
      folder: "Loads"
    },
    chordsArea: {
      value: a.state(50),
      min: 1,
      max: 100,
      step: 1,
      label: "Chords area (cm2)",
      folder: "Sections & Materials"
    },
    chordsElasticity: {
      value: a.state(10),
      min: 1,
      max: 250,
      step: 1,
      label: "Chords elasticity (gpa)",
      folder: "Sections & Materials"
    },
    websArea: {
      value: a.state(50),
      min: 1,
      max: 100,
      step: 1,
      label: "Webs area (cm2)",
      folder: "Sections & Materials"
    },
    websElasticity: {
      value: a.state(10),
      min: 1,
      max: 250,
      step: 1,
      label: "Webs elasticity (gpa)",
      folder: "Sections & Materials"
    }
  }, q = a.state([]), F = a.state([]), J = a.state({}), Q = a.state({}), ee = a.state({}), te = a.state({});
  a.derive(() => {
    let l = p.span.value.val, t = p.spacing.value.val;
    const u = p.webType.value.val, f = p.trimType.value.val, g = p.leftHeight.value.val, v = p.midHeight.value.val, c = p.rightHeight.value.val, d = p.leftOffset.value.val, n = p.midOffset.value.val, m = p.rightOffset.value.val, i = p.supportType.value.val, C = p.uniformLoad.value.val, T = p.chordsArea.value.val * 1e-4, M = p.chordsElasticity.value.val * 1e6, e = p.websArea.value.val * 1e-4, I = p.websElasticity.value.val * 1e6;
    let r = [], s = [], y = [], S = [], b = [], w = [];
    if (t = l / Math.round(l / t), Math.abs(v - 0.5 * (g + c)) > 0.3 || Math.abs(n - 0.5 * (d + m)) > 0.3) {
      l = l / 2, t = l / Math.round(l / t);
      const o = Math.round((l - 2 * t) / t), h = f >= 2 && o >= 1, W = (g - v) / l, A = g - W * t, x = (d - n) / l, k = d - x * t, { nodes: O, elements: B, topNodesIndices: K, chordsIndices: le, websIndices: ne } = U(h ? l - t : l, t, u, h ? A : g, v, h ? k : d, n, h ? t : 0);
      r.push(...O), s.push(...B), S.push(...K), b.push(...le), w.push(...ne);
      const Z = (v - c) / l, _ = (n - m) / l;
      let P = u;
      u === 1 && (P = 2), u === 2 && (P = 1);
      const { nodes: z, elements: oe, topNodesIndices: ae, chordsIndices: ie, websIndices: he } = U(h ? l - 2 * t : l - t, t, P, v - Z * t, h ? c + Z * t : c, n - _ * t, h ? m + _ * t : m, l + t);
      if (b.push(...V(ie, s.length)), w.push(...V(he, s.length)), s.push(...fe(oe, r.length)), S.push(...V(ae, r.length)), r.push(...z), h) {
        r.push([
          0,
          0,
          f == 3 ? g + d : d
        ], [
          2 * l,
          0,
          f == 3 ? c + m : m
        ]), S.push(r.length - 2, r.length - 1);
        const G = (o + 1 + 1) * 2, $ = (o + 1) * 2, R = G + $;
        s.push([
          0,
          R
        ], [
          o + 2,
          R
        ], [
          G + o,
          R + 1
        ], [
          G + $ - 1,
          R + 1
        ]), b.push(s.length - 1, s.length - 2, s.length - 3, s.length - 4);
      }
      const D = Math.round(h ? (l - 1 * t) / t : l / t), H = D, E = (D + 1) * 2, N = (D + 1) * 2 - 1, L = N + D + 1;
      if (u === 1 && (s.push([
        H,
        E
      ], [
        N,
        L
      ], [
        N,
        E
      ]), b.push(s.length - 3, s.length - 2), w.push(s.length - 1)), u === 2 && (s.push([
        H,
        E
      ], [
        N,
        L
      ], [
        H,
        L
      ]), b.push(s.length - 3, s.length - 2), w.push(s.length - 1)), u === 3 && (s.push([
        H,
        E
      ], [
        N,
        L
      ], [
        H,
        L
      ], [
        N,
        E
      ]), b.push(s.length - 4, s.length - 3), w.push(s.length - 2, s.length - 1)), h) {
        const G = O.length + z.length;
        y.push(G, G + 1);
      } else i === 1 ? y.push(0, O.length + z.length / 2 - 1) : y.push(O.length / 2, O.length + z.length - 1);
    } else {
      const o = Math.round((l - 2 * t) / t), h = f >= 2 && o >= 1, W = (g - c) / l, A = (d - m) / l, { nodes: x, elements: k, topNodesIndices: O, chordsIndices: B, websIndices: K } = U(h ? l - 2 * t : l, t, u, h ? g - W * t : g, h ? c + W * t : c, h ? d - A * t : d, h ? m + A * t : m, h ? t : 0);
      r.push(...x), s.push(...k), S.push(...O), b.push(...B), w.push(...K), h && (r.push([
        0,
        0,
        f == 3 ? g + d : d
      ], [
        l,
        0,
        f == 3 ? c + m : m
      ]), S.push(r.length - 2, r.length - 1), s.push([
        0,
        (o + 1) * 2
      ], [
        o + 1,
        (o + 1) * 2
      ], [
        o,
        (o + 1) * 2 + 1
      ], [
        o * 2 + 1,
        (o + 1) * 2 + 1
      ]), b.push(s.length - 1, s.length - 2, s.length - 3, s.length - 4)), h ? y.push(x.length, x.length + 1) : i === 1 ? y.push(0, x.length / 2 - 1) : y.push(x.length / 2, x.length - 1);
    }
    const X = {
      supports: new Map(y.map((o) => [
        o,
        [
          true,
          true,
          true,
          true,
          true,
          true
        ]
      ])),
      loads: new Map(S.map((o) => [
        o,
        [
          0,
          0,
          -C * t,
          0,
          0,
          0
        ]
      ]))
    }, j = {
      elasticities: new Map([
        ...b.map((o) => [
          o,
          M
        ]),
        ...w.map((o) => [
          o,
          I
        ])
      ]),
      areas: new Map([
        ...b.map((o) => [
          o,
          T
        ]),
        ...w.map((o) => [
          o,
          e
        ])
      ])
    }, Y = pe(r, s, X, j), se = re(r, s, j, Y);
    q.val = r, F.val = s, J.val = X, Q.val = j, ee.val = Y, te.val = se;
  });
  document.body.append(ce({
    nodes: q,
    elements: F,
    nodeInputs: J,
    elementInputs: Q
  }), de(p), ue({
    mesh: {
      nodes: q,
      elements: F,
      nodeInputs: J,
      elementInputs: Q,
      deformOutputs: ee,
      analyzeOutputs: te
    },
    settingsObj: {
      deformedShape: true,
      loads: false
    }
  }), me({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/advanced-truss/main.ts",
    author: "https://www.linkedin.com/in/jorge-burbano-037444113/"
  }));
  function fe(l, t) {
    return l.map(([u, f]) => [
      u + t,
      f + t
    ]);
  }
  function V(l, t) {
    return l.map((u) => u + t);
  }
});
