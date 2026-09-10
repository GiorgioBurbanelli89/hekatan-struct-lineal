import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as e } from "./theme-Dxpmbnyd.js";
import { a as B } from "./analyze-DgLgRmKg.js";
import { d as N, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as R } from "./getViewer-B2nTowOf.js";
import { g as T } from "./getParameters-BHL5hAP0.js";
import { g as q } from "./styles-Ce_UnsFA.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-DxjkL_3A.js";
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
  })()
]).then(async () => {
  const S = 35e6, w = 0.2, D = S / (2 * (1 + w)), F = 24 / 9.81, r = {
    nShells: {
      value: e.state(3),
      min: 1,
      max: 5,
      step: 1,
      label: "Velas"
    },
    nArch: {
      value: e.state(12),
      min: 4,
      max: 24,
      step: 1,
      label: "Subdivisiones arco"
    },
    H: {
      value: e.state(15),
      min: 5,
      max: 30,
      step: 1,
      label: "Altura primera vela (m)"
    },
    span: {
      value: e.state(20),
      min: 8,
      max: 40,
      step: 1,
      label: "Span primera vela (m)"
    },
    depth: {
      value: e.state(8),
      min: 3,
      max: 15,
      step: 0.5,
      label: "Profundidad primera vela (m)"
    },
    thickness: {
      value: e.state(0.15),
      min: 0.05,
      max: 0.5,
      step: 0.05,
      label: "Espesor c\xE1scara (m)"
    },
    selfLoad: {
      value: e.state(-5),
      min: -20,
      max: 0,
      step: 1,
      label: "Carga self-weight (kN)"
    }
  }, I = e.state([]), O = e.state([]), _ = e.state({}), k = e.state({}), z = e.state({}), A = e.state({});
  e.derive(() => {
    const H = Math.round(r.nShells.value.val), m = Math.round(r.nArch.value.val), L = r.H.value.val, C = r.span.value.val, P = r.depth.value.val, X = r.thickness.value.val, E = r.selfLoad.value.val, o = [], l = [];
    for (let t = 0; t < H; t++) {
      const s = t * 12, G = Math.max(2, L - t * 2), V = Math.max(5, C - t * 3), y = Math.max(2, P - t), c = o.length;
      for (let n = 0; n <= 4; n++) {
        const a = n / 4, v = -y / 2 + y * a, f = V * (1 - a * a * 0.3);
        for (let p = 0; p <= m; p++) {
          const u = p / m, Y = s + f * u, j = G * Math.sin(Math.PI * u) * (1 - a * a * 0.5);
          o.push([
            Y,
            v,
            j
          ]);
        }
      }
      const i = m + 1;
      for (let n = 0; n < 4; n++) for (let a = 0; a < m; a++) {
        const v = c + n * i + a, f = c + n * i + a + 1, p = c + (n + 1) * i + a + 1, u = c + (n + 1) * i + a;
        l.push([
          v,
          f,
          p,
          u
        ]);
      }
    }
    const b = /* @__PURE__ */ new Map();
    for (let t = 0; t < o.length; t++) o[t][2] < 0.5 && b.set(t, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const g = /* @__PURE__ */ new Map();
    for (let t = 0; t < o.length; t++) o[t][2] > 2 && g.set(t, [
      0,
      0,
      E,
      0,
      0,
      0
    ]);
    const x = {
      supports: b,
      loads: g
    }, d = {
      elasticities: new Map(l.map((t, s) => [
        s,
        S
      ])),
      poissonsRatios: new Map(l.map((t, s) => [
        s,
        w
      ])),
      thicknesses: new Map(l.map((t, s) => [
        s,
        X
      ])),
      shearModuli: new Map(l.map((t, s) => [
        s,
        D
      ])),
      densities: new Map(l.map((t, s) => [
        s,
        F
      ]))
    };
    let h = {}, M = {};
    try {
      h = N(o, l, x, d), M = B(o, l, d, h);
    } catch (t) {
      console.warn("Sydney Opera deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    I.val = o, O.val = l, _.val = x, k.val = d, z.val = h, A.val = M;
  });
  document.body.append(T(r), R({
    mesh: {
      nodes: I,
      elements: O,
      nodeInputs: _,
      elementInputs: k,
      deformOutputs: z,
      analyzeOutputs: A
    },
    settingsObj: {
      deformedShape: true
    }
  }), q({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/sydney-opera/main.ts"
  }));
});
