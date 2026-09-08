import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-U-6D_qyI.js";
import { a as pe } from "./analyze-DgLgRmKg.js";
import { d as re, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as ue } from "./getViewer-0VoGjneE.js";
import { g as me } from "./getParameters-CcvO4YbC.js";
import { g as de } from "./styles-SbI03m7S.js";
import { g as ce, __tla as __tla_1 } from "./getCad3d-BI1h__ua.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_2 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-CUW6lNkV.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_3 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./renderModalTable-BJWFR1R0.js";
import "./e2kParser-UQm6yNuB.js";
import "./cadSections-DVtTZU6U.js";
import "./e2kExporter-BnaArqJz.js";
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
  })()
]).then(async () => {
  function V(l, t, u, f, g, v, c, d = 0) {
    const o = Math.round(l / t);
    let m = [], i = [], C = [], T = [], M = [];
    for (let e = 0; e < o + 1; e++) {
      const I = e * t, p = (c - v) / l, s = v + p * I;
      m.push([
        d + I,
        0,
        s
      ]);
    }
    for (let e = 0; e < o + 1; e++) {
      const I = e * t, p = (g - f) / l, s = f + p * I, y = (c - v) / l, S = v + y * I;
      m.push([
        d + I,
        0,
        S + s
      ]), C.push(m.length - 1);
    }
    if (u === 1) for (let e = 0; e < o; e++) i.push([
      e,
      e + 1
    ], [
      o + 1 + e,
      o + 1 + e + 1
    ], [
      e,
      o + 1 + e
    ], [
      e,
      o + 1 + e + 1
    ]), T.push(i.length - 3, i.length - 4), M.push(i.length - 1, i.length - 2);
    if (u === 2) for (let e = 0; e < o; e++) i.push([
      e,
      e + 1
    ], [
      o + 1 + e,
      o + 1 + e + 1
    ], [
      e,
      o + 1 + e
    ], [
      e + 1,
      o + 1 + e
    ]), T.push(i.length - 3, i.length - 4), M.push(i.length - 1, i.length - 2);
    if (u === 3) for (let e = 0; e < o; e++) i.push([
      e,
      e + 1
    ], [
      o + 1 + e,
      o + 1 + e + 1
    ], [
      e,
      o + 1 + e
    ], [
      e,
      o + 1 + e + 1
    ], [
      e + 1,
      o + 1 + e
    ]), T.push(i.length - 4, i.length - 5), M.push(i.length - 1, i.length - 2, i.length - 3);
    return i.push([
      o,
      2 * o + 1
    ]), M.push(i.length - 1), {
      nodes: m,
      elements: i,
      topNodesIndices: C,
      chordsIndices: T,
      websIndices: M
    };
  }
  const r = {
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
  }, B = a.state([]), F = a.state([]), J = a.state({}), Q = a.state({}), ee = a.state({}), te = a.state({});
  a.derive(() => {
    let l = r.span.value.val, t = r.spacing.value.val;
    const u = r.webType.value.val, f = r.trimType.value.val, g = r.leftHeight.value.val, v = r.midHeight.value.val, c = r.rightHeight.value.val, d = r.leftOffset.value.val, o = r.midOffset.value.val, m = r.rightOffset.value.val, i = r.supportType.value.val, C = r.uniformLoad.value.val, T = r.chordsArea.value.val * 1e-4, M = r.chordsElasticity.value.val * 1e6, e = r.websArea.value.val * 1e-4, I = r.websElasticity.value.val * 1e6;
    let p = [], s = [], y = [], S = [], b = [], w = [];
    if (t = l / Math.round(l / t), Math.abs(v - 0.5 * (g + c)) > 0.3 || Math.abs(o - 0.5 * (d + m)) > 0.3) {
      l = l / 2, t = l / Math.round(l / t);
      const n = Math.round((l - 2 * t) / t), h = f >= 2 && n >= 1, W = (g - v) / l, A = g - W * t, x = (d - o) / l, k = d - x * t, { nodes: O, elements: K, topNodesIndices: P, chordsIndices: le, websIndices: oe } = V(h ? l - t : l, t, u, h ? A : g, v, h ? k : d, o, h ? t : 0);
      p.push(...O), s.push(...K), S.push(...P), b.push(...le), w.push(...oe);
      const Z = (v - c) / l, _ = (o - m) / l;
      let U = u;
      u === 1 && (U = 2), u === 2 && (U = 1);
      const { nodes: z, elements: ne, topNodesIndices: ae, chordsIndices: ie, websIndices: he } = V(h ? l - 2 * t : l - t, t, U, v - Z * t, h ? c + Z * t : c, o - _ * t, h ? m + _ * t : m, l + t);
      if (b.push(...q(ie, s.length)), w.push(...q(he, s.length)), s.push(...fe(ne, p.length)), S.push(...q(ae, p.length)), p.push(...z), h) {
        p.push([
          0,
          0,
          f == 3 ? g + d : d
        ], [
          2 * l,
          0,
          f == 3 ? c + m : m
        ]), S.push(p.length - 2, p.length - 1);
        const H = (n + 1 + 1) * 2, $ = (n + 1) * 2, R = H + $;
        s.push([
          0,
          R
        ], [
          n + 2,
          R
        ], [
          H + n,
          R + 1
        ], [
          H + $ - 1,
          R + 1
        ]), b.push(s.length - 1, s.length - 2, s.length - 3, s.length - 4);
      }
      const D = Math.round(h ? (l - 1 * t) / t : l / t), G = D, E = (D + 1) * 2, N = (D + 1) * 2 - 1, L = N + D + 1;
      if (u === 1 && (s.push([
        G,
        E
      ], [
        N,
        L
      ], [
        N,
        E
      ]), b.push(s.length - 3, s.length - 2), w.push(s.length - 1)), u === 2 && (s.push([
        G,
        E
      ], [
        N,
        L
      ], [
        G,
        L
      ]), b.push(s.length - 3, s.length - 2), w.push(s.length - 1)), u === 3 && (s.push([
        G,
        E
      ], [
        N,
        L
      ], [
        G,
        L
      ], [
        N,
        E
      ]), b.push(s.length - 4, s.length - 3), w.push(s.length - 2, s.length - 1)), h) {
        const H = O.length + z.length;
        y.push(H, H + 1);
      } else i === 1 ? y.push(0, O.length + z.length / 2 - 1) : y.push(O.length / 2, O.length + z.length - 1);
    } else {
      const n = Math.round((l - 2 * t) / t), h = f >= 2 && n >= 1, W = (g - c) / l, A = (d - m) / l, { nodes: x, elements: k, topNodesIndices: O, chordsIndices: K, websIndices: P } = V(h ? l - 2 * t : l, t, u, h ? g - W * t : g, h ? c + W * t : c, h ? d - A * t : d, h ? m + A * t : m, h ? t : 0);
      p.push(...x), s.push(...k), S.push(...O), b.push(...K), w.push(...P), h && (p.push([
        0,
        0,
        f == 3 ? g + d : d
      ], [
        l,
        0,
        f == 3 ? c + m : m
      ]), S.push(p.length - 2, p.length - 1), s.push([
        0,
        (n + 1) * 2
      ], [
        n + 1,
        (n + 1) * 2
      ], [
        n,
        (n + 1) * 2 + 1
      ], [
        n * 2 + 1,
        (n + 1) * 2 + 1
      ]), b.push(s.length - 1, s.length - 2, s.length - 3, s.length - 4)), h ? y.push(x.length, x.length + 1) : i === 1 ? y.push(0, x.length / 2 - 1) : y.push(x.length / 2, x.length - 1);
    }
    const X = {
      supports: new Map(y.map((n) => [
        n,
        [
          true,
          true,
          true,
          true,
          true,
          true
        ]
      ])),
      loads: new Map(S.map((n) => [
        n,
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
        ...b.map((n) => [
          n,
          M
        ]),
        ...w.map((n) => [
          n,
          I
        ])
      ]),
      areas: new Map([
        ...b.map((n) => [
          n,
          T
        ]),
        ...w.map((n) => [
          n,
          e
        ])
      ])
    }, Y = re(p, s, X, j), se = pe(p, s, j, Y);
    B.val = p, F.val = s, J.val = X, Q.val = j, ee.val = Y, te.val = se;
  });
  document.body.append(ce({
    nodes: B,
    elements: F,
    nodeInputs: J,
    elementInputs: Q
  }), me(r), ue({
    mesh: {
      nodes: B,
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
  }), de({
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/advanced-truss/main.ts",
    author: "https://www.linkedin.com/in/madil4/"
  }));
  function fe(l, t) {
    return l.map(([u, f]) => [
      u + t,
      f + t
    ]);
  }
  function q(l, t) {
    return l.map((u) => u + t);
  }
});
