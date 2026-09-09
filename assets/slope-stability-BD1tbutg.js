import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-U-6D_qyI.js";
import { s as q, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as A, __tla as __tla_1 } from "./getMesh-_M9lDnOs.js";
import { g as Y } from "./getViewer-DRTawnbU.js";
import { g as C } from "./getParameters-CcvO4YbC.js";
import { g as L } from "./styles-SbI03m7S.js";
import { __tla as __tla_2 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./Text-CUW6lNkV.js";
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
  })()
]).then(async () => {
  const s = {
    H: {
      value: a.state(6),
      min: 1,
      max: 25,
      step: 0.5,
      label: "Altura H (m)"
    },
    angle: {
      value: a.state(45),
      min: 20,
      max: 80,
      step: 1,
      label: "\xC1ngulo (\xB0)"
    },
    bTop: {
      value: a.state(3),
      min: 1,
      max: 15,
      step: 0.5,
      label: "Banco superior (m)"
    },
    bBot: {
      value: a.state(3),
      min: 1,
      max: 15,
      step: 0.5,
      label: "Banco inferior (m)"
    },
    meshSize: {
      value: a.state(2),
      min: 0.5,
      max: 5,
      step: 0.25,
      label: "Mesh size (m)"
    },
    E: {
      value: a.state(5e4),
      min: 1e3,
      max: 5e5,
      step: 1e3,
      label: "E (kPa)"
    },
    nu: {
      value: a.state(0.3),
      min: 0,
      max: 0.49,
      step: 0.05,
      label: "\u03BD"
    },
    gamma: {
      value: a.state(18),
      min: 12,
      max: 25,
      step: 0.5,
      label: "\u03B3 (kN/m\xB3)"
    },
    c: {
      value: a.state(15),
      min: 0,
      max: 100,
      step: 1,
      label: "Cohesi\xF3n c (kPa)"
    },
    phi: {
      value: a.state(30),
      min: 0,
      max: 45,
      step: 1,
      label: "Fricci\xF3n \u03C6 (\xB0)"
    },
    qs: {
      value: a.state(0),
      min: 0,
      max: 100,
      step: 5,
      label: "Sobrecarga (kN/m\xB2)"
    }
  }, E = a.state([]), O = a.state([]), z = a.state({}), B = a.state({}), k = a.state({}), I = a.state({});
  a.derive(() => {
    const m = s.H.value.val, g = s.angle.value.val, X = s.bTop.value.val, p = s.bBot.value.val, x = s.meshSize.value.val, D = s.E.value.val, F = s.nu.value.val, S = s.gamma.value.val, M = s.c.value.val, w = s.phi.value.val, H = s.qs.value.val, y = m / Math.tan(g * Math.PI / 180), u = p + y + X, c = m, N = [
      [
        0,
        -c,
        0
      ],
      [
        u,
        -c,
        0
      ],
      [
        u,
        m,
        0
      ],
      [
        p + y,
        m,
        0
      ],
      [
        p,
        0,
        0
      ],
      [
        0,
        0,
        0
      ]
    ];
    let n = [], r = [];
    try {
      const e = A({
        points: N,
        polygon: [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        maxMeshSize: x
      });
      n = e.nodes, r = e.elements;
    } catch (e) {
      console.warn("getMesh failed:", (e == null ? void 0 : e.message) ?? e);
      return;
    }
    const v = [], h = /* @__PURE__ */ new Map();
    for (let e = 0; e < n.length; e++) {
      const i = n[e][0], o = n[e][1];
      Math.abs(o + c) < 1e-6 ? (v.push({
        node: e,
        fixX: true,
        fixY: true
      }), h.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ])) : (Math.abs(i) < 1e-6 || Math.abs(i - u) < 1e-6) && (v.push({
        node: e,
        fixX: true,
        fixY: false
      }), h.set(e, [
        true,
        false,
        true,
        true,
        true,
        true
      ]));
    }
    const P = m - x * 0.3;
    let $ = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
    try {
      const e = n.map((t) => [
        t[0],
        t[1]
      ]), i = r.map((t) => [
        t[0],
        t[1],
        t[2]
      ]), o = q({
        nodes: e,
        elements: i,
        E: D,
        nu: F,
        gamma: S,
        c: M,
        phi: w,
        thickness: 1,
        supports: v,
        surcharge: H,
        surfaceYThreshold: P
      });
      for (let t = 0; t < o.displacements.length; t++) {
        const [l, b] = o.displacements[t];
        $.set(t, [
          l,
          0,
          b,
          0,
          0,
          0
        ]);
      }
      for (let t = 0; t < o.plasticStrain.length; t++) {
        const l = o.plasticStrain[t];
        T.set(t, [
          l,
          l,
          l
        ]);
      }
      let f = 0;
      for (const [t, l] of o.displacements) {
        const b = Math.sqrt(t * t + l * l);
        f = Math.max(f, b);
      }
      let d = 0;
      for (const t of o.plasticStrain) d = Math.max(d, t);
      console.log(`Talud SRM: ${n.length} nodos, ${r.length} tri\xE1ngulos | H=${m} \u03B1=${g}\xB0 c=${M} \u03C6=${w}\xB0 \u03B3=${S} | FOS=${o.fos.toFixed(3)} max|u|=${f.toExponential(3)} \u03B5_pl_max=${d.toExponential(3)}`), o.fos < 1 ? console.warn("\u26A0 TALUD INESTABLE (FOS < 1.0)") : o.fos < 1.5 && console.warn("\u26A0 FOS < 1.5 \u2014 revisar estabilidad");
    } catch (e) {
      console.warn("Talud SRM failed:", (e == null ? void 0 : e.message) ?? e);
    }
    const R = n.map((e) => [
      e[0],
      0,
      e[1]
    ]);
    E.val = R, O.val = r, z.val = {
      supports: h
    }, B.val = {}, k.val = {
      deformations: $
    }, I.val = {
      membraneXX: T
    };
  });
  document.body.append(C(s), Y({
    mesh: {
      nodes: E,
      elements: O,
      nodeInputs: z,
      elementInputs: B,
      deformOutputs: k,
      analyzeOutputs: I
    },
    settingsObj: {
      deformedShape: true,
      shellResults: "membraneXX"
    }
  }), L({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/slope-stability/main.ts"
  }));
});
