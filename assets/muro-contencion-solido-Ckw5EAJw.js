import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as n } from "./theme-Dxpmbnyd.js";
import { P as te } from "./tweakpane-BXg6ZhiP.js";
import { h as ae, __tla as __tla_0 } from "./h8-CxkkFRzA.js";
import { g as se, d as K, e as U } from "./getViewer-D1IBL8-H.js";
import { e as oe } from "./makeDraggable-zx2br6Yh.js";
import { g as ne } from "./getParameters-Bf35D0lJ.js";
import { g as le } from "./styles-DjzQZscE.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-DxjkL_3A.js";
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
  const I = (e) => Math.round(e * 1e6) / 1e6;
  function ie(e) {
    const B = e.toe + e.t + e.heel, N = e.tf + e.H, i = Math.max(1, Math.round(B / e.ms)), g = Math.max(1, Math.round(e.L / e.ms)), d = Math.max(1, Math.round(N / e.ms)), O = B / i, M = e.L / g, c = N / d, k = Math.round(e.toe / O), y = Math.round((e.toe + e.t) / O), j = Math.round(e.tf / c), z = (a, s) => s < j || a >= k && a < y, x = /* @__PURE__ */ new Map(), S = [], p = (a, s, o) => {
      const h = `${a},${s},${o}`;
      let w = x.get(h);
      return w === void 0 && (w = S.length, x.set(h, w), S.push([
        I(a * O),
        I(s * M),
        I(o * c)
      ])), w;
    }, H = [];
    for (let a = 0; a < d; a++) for (let s = 0; s < g; s++) for (let o = 0; o < i; o++) z(o, a) && H.push([
      p(o, s, a),
      p(o + 1, s, a),
      p(o + 1, s + 1, a),
      p(o, s + 1, a),
      p(o, s, a + 1),
      p(o + 1, s, a + 1),
      p(o + 1, s + 1, a + 1),
      p(o, s + 1, a + 1)
    ]);
    const t = /* @__PURE__ */ new Map();
    for (let a = 0; a <= g; a++) for (let s = 0; s <= i; s++) {
      const o = x.get(`${s},${a},0`);
      o !== void 0 && t.set(o, [
        true,
        true,
        true
      ]);
    }
    const m = /* @__PURE__ */ new Map();
    let b = 0;
    const f = /* @__PURE__ */ new Set();
    for (let a = j; a < d; a++) for (let s = 0; s < g; s++) {
      const o = (a + 0.5) * c - e.tf, w = e.Ka * (e.gamma * (e.H - o) + e.q0) * M * c;
      b += w;
      for (const [T, $] of [
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
        const P = x.get(`${y},${T},${$}`);
        f.add(P);
        const q = m.get(P) ?? [
          0,
          0,
          0
        ];
        q[0] -= w / 4, m.set(P, q);
      }
    }
    let _ = 0;
    if ((e.gammaC ?? 0) > 0) {
      const a = (e.gammaC ?? 0) * O * M * c;
      for (const s of H) {
        _ += a;
        for (const o of s) {
          const h = m.get(o) ?? [
            0,
            0,
            0
          ];
          h[2] -= a / 8, m.set(o, h);
        }
      }
    }
    let l = 0;
    if ((e.relleno ?? 0) >= 0.5 && j < d) {
      const a = e.gamma * e.H + e.q0;
      for (let s = 0; s < g; s++) for (let o = y; o < i; o++) {
        const h = a * O * M;
        l += h;
        for (const [w, T] of [
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
          const $ = x.get(`${w},${T},${j}`);
          if ($ === void 0) continue;
          const P = m.get($) ?? [
            0,
            0,
            0
          ];
          P[2] -= h / 4, m.set($, P);
        }
      }
    }
    const v = Math.round(g / 2), F = x.get(`${y},${v},${d}`);
    return {
      nodes: S,
      elements: H,
      supports: t,
      loads: m,
      caraTrasera: [
        ...f
      ],
      nudoCoronacion: F,
      info: {
        nx: i,
        ny: g,
        nz: d,
        empujeTotal: b,
        pesoPropio: _,
        pesoRelleno: l
      }
    };
  }
  const me = {
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
  }, u = me, r = {
    H: {
      value: n.state(u.H),
      min: 1,
      max: 10,
      step: 0.2,
      label: "H alzado (m)"
    },
    t: {
      value: n.state(u.t),
      min: 0.2,
      max: 1,
      step: 0.1,
      label: "t alzado (m)"
    },
    toe: {
      value: n.state(u.toe),
      min: 0.2,
      max: 3,
      step: 0.1,
      label: "puntera (m)"
    },
    heel: {
      value: n.state(u.heel),
      min: 0.2,
      max: 5,
      step: 0.1,
      label: "tal\xF3n (m)"
    },
    tf: {
      value: n.state(u.tf),
      min: 0.2,
      max: 1,
      step: 0.1,
      label: "canto zapata (m)"
    },
    L: {
      value: n.state(u.L),
      min: 0.2,
      max: 5,
      step: 0.2,
      label: "longitud L (m)"
    },
    ms: {
      value: n.state(u.ms),
      min: 0.1,
      max: 0.5,
      step: 0.05,
      label: "malla (m)"
    },
    E: {
      value: n.state(u.E),
      min: 1e7,
      max: 4e7,
      step: 1e6,
      label: "E hormig\xF3n (kN/m\xB2)"
    },
    nu: {
      value: n.state(u.nu),
      min: 0.1,
      max: 0.3,
      step: 0.01,
      label: "\u03BD"
    },
    Ka: {
      value: n.state(u.Ka),
      min: 0.2,
      max: 0.6,
      step: 0.01,
      label: "Ka (Rankine)"
    },
    gamma: {
      value: n.state(u.gamma),
      min: 14,
      max: 22,
      step: 0.5,
      label: "\u03B3 relleno (kN/m\xB3)"
    },
    q0: {
      value: n.state(u.q0),
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
  }, A = n.state([]), Z = n.state([]), G = n.state({}), V = n.state({}), Y = n.state({}), J = n.state({}), Q = n.state({
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
      H: r.H.value.val,
      t: r.t.value.val,
      toe: r.toe.value.val,
      heel: r.heel.value.val,
      tf: r.tf.value.val,
      L: r.L.value.val,
      ms: r.ms.value.val,
      E: r.E.value.val,
      nu: r.nu.value.val,
      Ka: r.Ka.value.val,
      gamma: r.gamma.value.val,
      q0: r.q0.value.val,
      gammaC: r.gammaC.value.val,
      relleno: r.relleno.value.val
    }, B = Math.round(r.incompatible.value.val) === 1, N = Math.round(r.campo.value.val), i = ie(e), g = i.nodes.length;
    let d = null;
    try {
      d = ae({
        nodes: i.nodes,
        elements: i.elements,
        E: e.E,
        nu: e.nu,
        supports: i.supports,
        loads: i.loads,
        incompatible: B
      });
    } catch (t) {
      console.warn("muro solido H8:", (t == null ? void 0 : t.message) ?? t);
    }
    const O = i.nodes.map((t) => [
      t[0],
      t[1],
      t[2]
    ]), M = [], c = {
      elasticities: /* @__PURE__ */ new Map(),
      poissonsRatios: /* @__PURE__ */ new Map(),
      thicknesses: /* @__PURE__ */ new Map(),
      shearModuli: /* @__PURE__ */ new Map(),
      densities: /* @__PURE__ */ new Map(),
      areas: /* @__PURE__ */ new Map(),
      momentsOfInertiaZ: /* @__PURE__ */ new Map(),
      momentsOfInertiaY: /* @__PURE__ */ new Map(),
      torsionalConstants: /* @__PURE__ */ new Map()
    }, k = (t, m, b, f, _) => {
      M.push([
        t,
        m,
        b,
        f
      ]);
      const l = M.length - 1;
      c.elasticities.set(l, e.E), c.poissonsRatios.set(l, e.nu), c.thicknesses.set(l, 1e-3), c.shearModuli.set(l, e.E / (2 * (1 + e.nu))), c.densities.set(l, 0), c.areas.set(l, 0), c.momentsOfInertiaZ.set(l, 0), c.momentsOfInertiaY.set(l, 0), c.torsionalConstants.set(l, 0);
    };
    i.elements.forEach((t, m) => {
      k(t[0], t[1], t[2], t[3]), k(t[4], t[5], t[6], t[7]), k(t[0], t[1], t[5], t[4]), k(t[1], t[2], t[6], t[5]), k(t[2], t[3], t[7], t[6]), k(t[3], t[0], t[4], t[7]);
    });
    const y = {
      deformations: /* @__PURE__ */ new Map()
    };
    d && d.displacements.forEach(([t, m, b], f) => y.deformations.set(f, [
      t,
      m,
      b,
      0,
      0,
      0
    ]));
    const j = {};
    let z = 0, x = 0;
    if (d) {
      const t = /* @__PURE__ */ new Map();
      i.elements.forEach((b, f) => {
        const _ = d.stressPerElement.get(f) || [], l = d.vonMisesPerElement.get(f) || [];
        let v = 0, F = 0;
        if (N === 2) for (const a of l) v += a, F++;
        else for (const a of _) v += a[N === 0 ? 0 : 2], F++;
        v = F ? v / F : 0;
        for (const a of b) {
          const s = t.get(a) ?? {
            s: 0,
            n: 0
          };
          s.s += v, s.n++, t.set(a, s);
        }
      });
      const m = /* @__PURE__ */ new Map();
      M.forEach((b, f) => {
        const _ = b.map((l) => {
          const v = t.get(l);
          return v ? v.s / v.n : 0;
        });
        m.set(f, _);
        for (const l of _) l < z && (z = l), l > x && (x = l);
      }), j.vonMises = m;
    }
    const S = /* @__PURE__ */ new Map();
    i.supports.forEach((t, m) => S.set(m, [
      t[0],
      t[1],
      t[2],
      true,
      true,
      true
    ]));
    const p = /* @__PURE__ */ new Map();
    i.loads.forEach((t, m) => p.set(m, [
      t[0],
      t[1],
      t[2],
      0,
      0,
      0
    ]));
    const H = d ? ((_a = d.displacements.get(i.nudoCoronacion)) == null ? void 0 : _a[0]) ?? 0 : 0;
    Q.val = {
      N: g,
      nElems: i.elements.length,
      nDOF: 3 * g,
      empuje: i.info.empujeTotal,
      ux_top: H,
      sig_min: z,
      sig_max: x,
      elapsed: (d == null ? void 0 : d.elapsedMs) ?? 0
    }, A.val = O, Z.val = M, G.val = {
      supports: S,
      loads: p
    }, V.val = c, Y.val = y, J.val = j;
  });
  const W = se({
    mesh: {
      nodes: A,
      elements: Z,
      nodeInputs: G,
      elementInputs: V,
      deformOutputs: Y,
      analyzeOutputs: J
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
  }), R = document.createElement("div");
  R.style.cssText = "position:fixed;top:8px;right:8px;width:330px;max-height:90vh;overflow-y:auto;z-index:999;";
  const C = new te({
    title: "\u{1F9F1} Muro de contenci\xF3n en s\xF3lidos H8 (vs SAP2000)",
    container: R,
    expanded: true
  });
  window.__hekatanPanes = window.__hekatanPanes ?? [];
  window.__hekatanPanes.push(C);
  const E = {
    N: 0,
    nElems: 0,
    nDOF: 0,
    empuje: 0,
    ux_top: 0,
    sig_min: 0,
    sig_max: 0,
    elapsed: 0
  }, D = C.addFolder({
    title: "Malla H8"
  });
  D.addBinding(E, "N", {
    readonly: true,
    label: "Nudos",
    format: (e) => e.toFixed(0)
  });
  D.addBinding(E, "nElems", {
    readonly: true,
    label: "Hexaedros",
    format: (e) => e.toFixed(0)
  });
  D.addBinding(E, "nDOF", {
    readonly: true,
    label: "GDL",
    format: (e) => e.toFixed(0)
  });
  D.addBinding(E, "elapsed", {
    readonly: true,
    label: "solve (ms)",
    format: (e) => e.toFixed(0)
  });
  const L = C.addFolder({
    title: "Resultados"
  });
  L.addBinding(E, "empuje", {
    readonly: true,
    label: "Empuje total (kN)",
    format: (e) => e.toFixed(2)
  });
  L.addBinding(E, "ux_top", {
    readonly: true,
    label: "u_x coronaci\xF3n (m)",
    format: (e) => e.toExponential(4)
  });
  L.addBinding(E, "sig_min", {
    readonly: true,
    label: "\u03C3 min (kN/m\xB2)",
    format: (e) => e.toFixed(1)
  });
  L.addBinding(E, "sig_max", {
    readonly: true,
    label: "\u03C3 max (kN/m\xB2)",
    format: (e) => e.toFixed(1)
  });
  const X = C.addFolder({
    title: "Unidades",
    expanded: false
  }), ee = {
    stress: U.val,
    disp: K.val
  };
  X.addBinding(ee, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      kPa: "kPa",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      "tonf/m\xB2": "tonf/m\xB2"
    },
    label: "Tensi\xF3n"
  }).on("change", (e) => {
    U.val = e.value;
  });
  X.addBinding(ee, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm"
    },
    label: "Desplaz."
  }).on("change", (e) => {
    K.val = e.value;
  });
  document.body.append(R);
  n.derive(() => {
    Object.assign(E, Q.val), C.refresh();
  });
  document.body.append(ne(r), W, le({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/muro-contencion-solido/main.ts"
  }));
  setTimeout(() => oe(), 200);
  setTimeout(() => {
    var _a;
    const e = W.__ctx;
    (e == null ? void 0 : e.camera) && (e == null ? void 0 : e.controls) && (e.camera.up.set(0, 0, 1), e.camera.position.set(7, -8, 5), e.controls.target.set(1.3, 0.5, 2.2), e.controls.update(), (_a = e.render) == null ? void 0 : _a.call(e));
  }, 800);
});
