import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./Text-C1TX4d8g.js";
import { a as C, __tla as __tla_0 } from "./analyze-BNmKymcK.js";
import { d as N, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { g as q, c as G, __tla as __tla_2 } from "./aiAgent-CDkRN2K5.js";
import { g as Q, __tla as __tla_3 } from "./getParameters-C2E0DZJg.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./tweakpane-BXg6ZhiP.js";
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
  const l = {
    Lx: {
      value: a.state(4),
      min: 1,
      max: 12,
      step: 0.5,
      label: "Lx (m)"
    },
    Ly: {
      value: a.state(2),
      min: 0.5,
      max: 8,
      step: 0.5,
      label: "Ly (m)"
    },
    t: {
      value: a.state(0.15),
      min: 0.05,
      max: 0.5,
      step: 0.05,
      label: "Espesor (m)"
    },
    nx: {
      value: a.state(8),
      min: 4,
      max: 20,
      step: 1,
      label: "Mesh nx"
    },
    ny: {
      value: a.state(4),
      min: 2,
      max: 12,
      step: 1,
      label: "Mesh ny"
    },
    E: {
      value: a.state(25e6),
      min: 1e7,
      max: 5e7,
      step: 1e6,
      label: "E (kN/m\xB2)"
    },
    nu: {
      value: a.state(0.2),
      min: 0,
      max: 0.49,
      step: 0.05,
      label: "\u03BD"
    },
    P: {
      value: a.state(20),
      min: 0,
      max: 200,
      step: 5,
      label: "Carga total borde (kN)"
    }
  }, M = a.state([]), L = a.state([]), S = a.state({}), z = a.state({}), E = a.state({}), O = a.state({});
  a.derive(() => {
    const y = l.Lx.value.val, m = l.Ly.value.val, p = l.t.value.val, s = Math.round(l.nx.value.val), n = Math.round(l.ny.value.val), u = l.E.value.val, i = l.nu.value.val, v = l.P.value.val, r = u / (2 * (1 + i)), I = y / s, P = m / n, d = [], o = [];
    for (let t = 0; t <= n; t++) for (let e = 0; e <= s; e++) d.push([
      e * I,
      0,
      t * P
    ]);
    const c = s + 1;
    for (let t = 0; t < n; t++) for (let e = 0; e < s; e++) o.push([
      t * c + e,
      t * c + e + 1,
      (t + 1) * c + e + 1,
      (t + 1) * c + e
    ]);
    const b = /* @__PURE__ */ new Map();
    for (let t = 0; t <= n; t++) b.set(t * c, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const h = [];
    for (let t = 0; t <= n; t++) h.push(t * c + s);
    const j = v / h.length, g = /* @__PURE__ */ new Map();
    for (const t of h) g.set(t, [
      0,
      -j,
      0,
      0,
      0,
      0
    ]);
    const _ = {
      supports: b,
      loads: g
    }, f = {
      elasticities: new Map(o.map((t, e) => [
        e,
        u
      ])),
      poissonsRatios: new Map(o.map((t, e) => [
        e,
        i
      ])),
      thicknesses: new Map(o.map((t, e) => [
        e,
        p
      ])),
      shearModuli: new Map(o.map((t, e) => [
        e,
        r
      ])),
      densities: new Map(o.map((t, e) => [
        e,
        24 / 9.80665
      ]))
    };
    let x = {}, w = {};
    try {
      x = N(d, o, _, f), w = C(d, o, f, x);
      const t = (n / 2 | 0) * c + s, e = x.deformations.get(t), k = e ? e[1] : 0;
      console.log(`Placa XY Q4: Uy_tip=${k.toExponential(4)} m`);
    } catch (t) {
      console.warn("Placa XY Q4 deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    M.val = d, L.val = o, S.val = _, z.val = f, E.val = x, O.val = w;
  });
  document.body.append(Q(l), q({
    mesh: {
      nodes: M,
      elements: L,
      nodeInputs: S,
      elementInputs: z,
      deformOutputs: E,
      analyzeOutputs: O
    },
    settingsObj: {
      deformedShape: true
    }
  }), G({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-cantilever-q4/main.ts"
  }));
  setTimeout(() => {
    var _a, _b, _c, _d, _e, _f, _g;
    const m = (_a = [
      ...document.body.querySelectorAll("*")
    ].find((r) => r.__ctx)) == null ? void 0 : _a.__ctx, p = M.val;
    if (!(m == null ? void 0 : m.camera) || !(p == null ? void 0 : p.length)) return;
    const s = p.map((r) => r[0]), n = p.map((r) => r[2]), u = (Math.min(...s) + Math.max(...s)) / 2, i = (Math.min(...n) + Math.max(...n)) / 2, v = Math.max(Math.max(...s) - Math.min(...s), Math.max(...n) - Math.min(...n), 1);
    (_b = m.camera.up) == null ? void 0 : _b.set(0, 0, 1), m.camera.position.set(u + 0.35 * v, -1.4 * v, i + 0.45 * v), (_d = (_c = m.controls) == null ? void 0 : _c.target) == null ? void 0 : _d.set(u, 0, i), (_f = (_e = m.controls) == null ? void 0 : _e.update) == null ? void 0 : _f.call(_e), (_g = m.render) == null ? void 0 : _g.call(m);
  }, 400);
});
