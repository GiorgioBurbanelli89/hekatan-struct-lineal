import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as n } from "./Text-Br8EG2up.js";
import { P as se } from "./tweakpane-BXg6ZhiP.js";
import { h as oe, __tla as __tla_0 } from "./h8-CObNaegA.js";
import { g as ne, f as A, h as Z, a as le, __tla as __tla_1 } from "./aiAgent-D7c-Aagy.js";
import { e as ie } from "./makeDraggable-zx2br6Yh.js";
import { g as me } from "./getParameters-CeWO_jGR.js";
import { __tla as __tla_2 } from "./deform-DmQkkByq.js";
import "./preload-helper-V2P8TQsQ.js";
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
  const q = (e) => Math.round(e * 1e6) / 1e6;
  function re(e) {
    const D = e.toe + e.t + e.heel, P = e.tf + e.H, i = Math.max(1, Math.round(D / e.ms)), x = Math.max(1, Math.round(e.L / e.ms)), d = Math.max(1, Math.round(P / e.ms)), j = D / i, h = e.L / x, r = P / d, v = Math.round(e.toe / j), w = Math.round((e.toe + e.t) / j), _ = Math.round(e.tf / r), z = (a, s) => s < _ || a >= v && a < w, b = /* @__PURE__ */ new Map(), T = [], H = e.tTop !== void 0 && e.tTop > 0 && e.tTop < e.t ? e.tTop : e.t, I = (a, s) => {
      if (H === e.t || s < _ || a < v || a > w) return a * j;
      const o = s * r, g = e.t - (e.t - H) * (o - e.tf) / e.H;
      return e.toe + (a - v) / (w - v) * g;
    }, t = (a, s, o) => {
      const g = `${a},${s},${o}`;
      let E = b.get(g);
      return E === void 0 && (E = T.length, b.set(g, E), T.push([
        q(I(a, o)),
        q(s * h),
        q(o * r)
      ])), E;
    }, u = [];
    for (let a = 0; a < d; a++) for (let s = 0; s < x; s++) for (let o = 0; o < i; o++) z(o, a) && u.push([
      t(o, s, a),
      t(o + 1, s, a),
      t(o + 1, s + 1, a),
      t(o, s + 1, a),
      t(o, s, a + 1),
      t(o + 1, s, a + 1),
      t(o + 1, s + 1, a + 1),
      t(o, s + 1, a + 1)
    ]);
    const M = /* @__PURE__ */ new Map();
    for (let a = 0; a <= x; a++) for (let s = 0; s <= i; s++) {
      const o = b.get(`${s},${a},0`);
      o !== void 0 && M.set(o, [
        true,
        true,
        true
      ]);
    }
    const c = /* @__PURE__ */ new Map();
    let O = 0;
    const l = /* @__PURE__ */ new Set();
    for (let a = _; a < d; a++) for (let s = 0; s < x; s++) {
      const o = (a + 0.5) * r - e.tf, E = e.Ka * (e.gamma * (e.H - o) + e.q0) * h * r;
      O += E;
      for (const [R, $] of [
        [
          s,
          a
        ],
        [
          s + 1,
          a
        ],
        [
          s + 1,
          a + 1
        ],
        [
          s,
          a + 1
        ]
      ]) {
        const F = b.get(`${w},${R},${$}`);
        l.add(F);
        const U = c.get(F) ?? [
          0,
          0,
          0
        ];
        U[0] -= E / 4, c.set(F, U);
      }
    }
    let f = 0;
    if ((e.gammaC ?? 0) > 0) {
      const a = (e.gammaC ?? 0) * j * h * r;
      for (const s of u) {
        f += a;
        for (const o of s) {
          const g = c.get(o) ?? [
            0,
            0,
            0
          ];
          g[2] -= a / 8, c.set(o, g);
        }
      }
    }
    let S = 0;
    if ((e.relleno ?? 0) >= 0.5 && _ < d) {
      const a = e.gamma * e.H + e.q0;
      for (let s = 0; s < x; s++) for (let o = w; o < i; o++) {
        const g = a * j * h;
        S += g;
        for (const [E, R] of [
          [
            o,
            s
          ],
          [
            o + 1,
            s
          ],
          [
            o + 1,
            s + 1
          ],
          [
            o,
            s + 1
          ]
        ]) {
          const $ = b.get(`${E},${R},${_}`);
          if ($ === void 0) continue;
          const F = c.get($) ?? [
            0,
            0,
            0
          ];
          F[2] -= g / 4, c.set($, F);
        }
      }
    }
    const y = Math.round(x / 2), N = b.get(`${w},${y},${d}`);
    return {
      nodes: T,
      elements: u,
      supports: M,
      loads: c,
      caraTrasera: [
        ...l
      ],
      nudoCoronacion: N,
      info: {
        nx: i,
        ny: x,
        nz: d,
        empujeTotal: O,
        pesoPropio: f,
        pesoRelleno: S
      }
    };
  }
  const de = {
    H: 4,
    t: 0.4,
    toe: 0.6,
    heel: 1.6,
    tf: 0.4,
    L: 1,
    ms: 0.2,
    E: 25e6,
    nu: 0.2,
    Ka: 1 / 3,
    gamma: 18,
    q0: 10
  }, p = de, m = {
    H: {
      value: n.state(p.H),
      min: 1,
      max: 10,
      step: 0.2,
      label: "H alzado (m)"
    },
    t: {
      value: n.state(p.t),
      min: 0.2,
      max: 1,
      step: 0.1,
      label: "t alzado en la base (m)"
    },
    tTop: {
      value: n.state(p.t),
      min: 0.1,
      max: 1,
      step: 0.05,
      label: "t coronaci\xF3n (m) \u2014 menor = pantalla inclinada"
    },
    toe: {
      value: n.state(p.toe),
      min: 0.2,
      max: 3,
      step: 0.1,
      label: "puntera (m)"
    },
    heel: {
      value: n.state(p.heel),
      min: 0.2,
      max: 5,
      step: 0.1,
      label: "tal\xF3n (m)"
    },
    tf: {
      value: n.state(p.tf),
      min: 0.2,
      max: 1,
      step: 0.1,
      label: "canto zapata (m)"
    },
    L: {
      value: n.state(p.L),
      min: 0.2,
      max: 5,
      step: 0.2,
      label: "longitud L (m)"
    },
    ms: {
      value: n.state(p.ms),
      min: 0.1,
      max: 0.5,
      step: 0.05,
      label: "malla (m)"
    },
    E: {
      value: n.state(p.E),
      min: 1e7,
      max: 4e7,
      step: 1e6,
      label: "E hormig\xF3n (kN/m\xB2)"
    },
    nu: {
      value: n.state(p.nu),
      min: 0.1,
      max: 0.3,
      step: 0.01,
      label: "\u03BD"
    },
    Ka: {
      value: n.state(p.Ka),
      min: 0.2,
      max: 0.6,
      step: 0.01,
      label: "Ka (Rankine)"
    },
    gamma: {
      value: n.state(p.gamma),
      min: 14,
      max: 22,
      step: 0.5,
      label: "\u03B3 relleno (kN/m\xB3)"
    },
    q0: {
      value: n.state(p.q0),
      min: 0,
      max: 50,
      step: 1,
      label: "sobrecarga q0 (kN/m\xB2)"
    },
    gammaC: {
      value: n.state(24),
      min: 0,
      max: 26,
      step: 1,
      label: "peso propio \u03B3c (kN/m\xB3, 0 = sin)"
    },
    relleno: {
      value: n.state(1),
      min: 0,
      max: 1,
      step: 1,
      label: "relleno sobre el tal\xF3n (\u03B3\xB7H + q0)"
    },
    incompatible: {
      value: n.state(1),
      min: 0,
      max: 1,
      step: 1,
      label: "modos incompatibles (1 = SAP2000)"
    },
    campo: {
      value: n.state(0),
      min: 0,
      max: 2,
      step: 1,
      label: "color: 0 \u03C3xx \xB7 1 \u03C3zz \xB7 2 vonMises"
    }
  }, G = n.state([]), V = n.state([]), Y = n.state({}), J = n.state({}), Q = n.state({}), W = n.state({}), X = n.state({
    N: 0,
    nElems: 0,
    nDOF: 0,
    empuje: 0,
    ux_top: 0,
    sig_min: 0,
    sig_max: 0,
    elapsed: 0
  });
  n.derive(() => {
    var _a;
    const e = {
      H: m.H.value.val,
      t: m.t.value.val,
      tTop: m.tTop.value.val,
      toe: m.toe.value.val,
      heel: m.heel.value.val,
      tf: m.tf.value.val,
      L: m.L.value.val,
      ms: m.ms.value.val,
      E: m.E.value.val,
      nu: m.nu.value.val,
      Ka: m.Ka.value.val,
      gamma: m.gamma.value.val,
      q0: m.q0.value.val,
      gammaC: m.gammaC.value.val,
      relleno: m.relleno.value.val
    }, D = Math.round(m.incompatible.value.val) === 1, P = Math.round(m.campo.value.val), i = re(e), x = i.nodes.length;
    let d = null;
    try {
      d = oe({
        nodes: i.nodes,
        elements: i.elements,
        E: e.E,
        nu: e.nu,
        supports: i.supports,
        loads: i.loads,
        incompatible: D
      });
    } catch (t) {
      console.warn("muro solido H8:", (t == null ? void 0 : t.message) ?? t);
    }
    const j = i.nodes.map((t) => [
      t[0],
      t[1],
      t[2]
    ]), h = [], r = {
      elasticities: /* @__PURE__ */ new Map(),
      poissonsRatios: /* @__PURE__ */ new Map(),
      thicknesses: /* @__PURE__ */ new Map(),
      shearModuli: /* @__PURE__ */ new Map(),
      densities: /* @__PURE__ */ new Map(),
      areas: /* @__PURE__ */ new Map(),
      momentsOfInertiaZ: /* @__PURE__ */ new Map(),
      momentsOfInertiaY: /* @__PURE__ */ new Map(),
      torsionalConstants: /* @__PURE__ */ new Map()
    }, v = (t, u, M, c, O) => {
      h.push([
        t,
        u,
        M,
        c
      ]);
      const l = h.length - 1;
      r.elasticities.set(l, e.E), r.poissonsRatios.set(l, e.nu), r.thicknesses.set(l, 1e-3), r.shearModuli.set(l, e.E / (2 * (1 + e.nu))), r.densities.set(l, 0), r.areas.set(l, 0), r.momentsOfInertiaZ.set(l, 0), r.momentsOfInertiaY.set(l, 0), r.torsionalConstants.set(l, 0);
    };
    i.elements.forEach((t, u) => {
      v(t[0], t[1], t[2], t[3]), v(t[4], t[5], t[6], t[7]), v(t[0], t[1], t[5], t[4]), v(t[1], t[2], t[6], t[5]), v(t[2], t[3], t[7], t[6]), v(t[3], t[0], t[4], t[7]);
    });
    const w = {
      deformations: /* @__PURE__ */ new Map()
    };
    d && d.displacements.forEach(([t, u, M], c) => w.deformations.set(c, [
      t,
      u,
      M,
      0,
      0,
      0
    ]));
    const _ = {};
    let z = 0, b = 0;
    if (d) {
      const t = /* @__PURE__ */ new Map();
      i.elements.forEach((M, c) => {
        const O = d.stressPerElement.get(c) || [], l = d.vonMisesPerElement.get(c) || [];
        let f = 0, S = 0;
        if (P === 2) for (const y of l) f += y, S++;
        else for (const y of O) f += y[P === 0 ? 0 : 2], S++;
        f = S ? f / S : 0;
        for (const y of M) {
          const N = t.get(y) ?? {
            s: 0,
            n: 0
          };
          N.s += f, N.n++, t.set(y, N);
        }
      });
      const u = /* @__PURE__ */ new Map();
      h.forEach((M, c) => {
        const O = M.map((l) => {
          const f = t.get(l);
          return f ? f.s / f.n : 0;
        });
        u.set(c, O);
        for (const l of O) l < z && (z = l), l > b && (b = l);
      }), _.vonMises = u;
    }
    const T = /* @__PURE__ */ new Map();
    i.supports.forEach((t, u) => T.set(u, [
      t[0],
      t[1],
      t[2],
      true,
      true,
      true
    ]));
    const H = /* @__PURE__ */ new Map();
    i.loads.forEach((t, u) => H.set(u, [
      t[0],
      t[1],
      t[2],
      0,
      0,
      0
    ]));
    const I = d ? ((_a = d.displacements.get(i.nudoCoronacion)) == null ? void 0 : _a[0]) ?? 0 : 0;
    X.val = {
      N: x,
      nElems: i.elements.length,
      nDOF: 3 * x,
      empuje: i.info.empujeTotal,
      ux_top: I,
      sig_min: z,
      sig_max: b,
      elapsed: (d == null ? void 0 : d.elapsedMs) ?? 0
    }, G.val = j, V.val = h, Y.val = {
      supports: T,
      loads: H
    }, J.val = r, Q.val = w, W.val = _;
  });
  const ee = ne({
    mesh: {
      nodes: G,
      elements: V,
      nodeInputs: Y,
      elementInputs: J,
      deformOutputs: Q,
      analyzeOutputs: W
    },
    settingsObj: {
      deformedShape: true,
      solidResults: "vonMises",
      shellResults: "none",
      gridSize: 6,
      deformScale: 200,
      custom3D: false,
      loads: true,
      supports: true,
      nodes: false,
      showCotas: false,
      displayScale: 0.3
    }
  }), K = document.createElement("div");
  K.style.cssText = "position:fixed;top:8px;right:8px;width:330px;max-height:90vh;overflow-y:auto;z-index:999;";
  const C = new se({
    title: "\u{1F9F1} Muro de contenci\xF3n en s\xF3lidos H8 (vs SAP2000)",
    container: K,
    expanded: true
  });
  window.__hekatanPanes = window.__hekatanPanes ?? [];
  window.__hekatanPanes.push(C);
  const k = {
    N: 0,
    nElems: 0,
    nDOF: 0,
    empuje: 0,
    ux_top: 0,
    sig_min: 0,
    sig_max: 0,
    elapsed: 0
  }, B = C.addFolder({
    title: "Malla H8"
  });
  B.addBinding(k, "N", {
    readonly: true,
    label: "Nudos",
    format: (e) => e.toFixed(0)
  });
  B.addBinding(k, "nElems", {
    readonly: true,
    label: "Hexaedros",
    format: (e) => e.toFixed(0)
  });
  B.addBinding(k, "nDOF", {
    readonly: true,
    label: "GDL",
    format: (e) => e.toFixed(0)
  });
  B.addBinding(k, "elapsed", {
    readonly: true,
    label: "solve (ms)",
    format: (e) => e.toFixed(0)
  });
  const L = C.addFolder({
    title: "Resultados"
  });
  L.addBinding(k, "empuje", {
    readonly: true,
    label: "Empuje total (kN)",
    format: (e) => e.toFixed(2)
  });
  L.addBinding(k, "ux_top", {
    readonly: true,
    label: "u_x coronaci\xF3n (m)",
    format: (e) => e.toExponential(4)
  });
  L.addBinding(k, "sig_min", {
    readonly: true,
    label: "\u03C3 min (kN/m\xB2)",
    format: (e) => e.toFixed(1)
  });
  L.addBinding(k, "sig_max", {
    readonly: true,
    label: "\u03C3 max (kN/m\xB2)",
    format: (e) => e.toFixed(1)
  });
  const te = C.addFolder({
    title: "Unidades",
    expanded: false
  }), ae = {
    stress: Z.val,
    disp: A.val
  };
  te.addBinding(ae, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      kPa: "kPa",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      "tonf/m\xB2": "tonf/m\xB2"
    },
    label: "Tensi\xF3n"
  }).on("change", (e) => {
    Z.val = e.value;
  });
  te.addBinding(ae, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm"
    },
    label: "Desplaz."
  }).on("change", (e) => {
    A.val = e.value;
  });
  document.body.append(K);
  n.derive(() => {
    Object.assign(k, X.val), C.refresh();
  });
  document.body.append(me(m), ee, le({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/muro-contencion-solido/main.ts"
  }));
  setTimeout(() => ie(), 200);
  setTimeout(() => {
    var _a;
    const e = ee.__ctx;
    (e == null ? void 0 : e.camera) && (e == null ? void 0 : e.controls) && (e.camera.up.set(0, 0, 1), e.camera.position.set(7, -8, 5), e.controls.target.set(1.3, 0.5, 2.2), e.controls.update(), (_a = e.render) == null ? void 0 : _a.call(e));
  }, 800);
});
