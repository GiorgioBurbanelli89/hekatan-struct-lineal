import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as l } from "./theme-DQ--CgsI.js";
import { P as ve } from "./tweakpane-BXg6ZhiP.js";
import { h as xe, __tla as __tla_0 } from "./h8-CxkkFRzA.js";
import { g as he, d as q, e as J } from "./getViewer-DoAG4kNs.js";
import { e as ge } from "./makeDraggable-zx2br6Yh.js";
import { g as be } from "./getParameters-DTL1yrut.js";
import { g as Me } from "./styles-0iLl92Fx.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-ERv22veQ.js";
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
  const c = {
    Lx: {
      value: l.state(20),
      min: 5,
      max: 40,
      step: 1,
      label: "Lx suelo (m)"
    },
    Ly: {
      value: l.state(20),
      min: 5,
      max: 40,
      step: 1,
      label: "Ly suelo (m)"
    },
    Lz: {
      value: l.state(10),
      min: 4,
      max: 20,
      step: 1,
      label: "Lz suelo (m)"
    },
    nx: {
      value: l.state(12),
      min: 6,
      max: 40,
      step: 2,
      label: "nx mesh (libro: 40)"
    },
    ny: {
      value: l.state(12),
      min: 6,
      max: 40,
      step: 2,
      label: "ny mesh (libro: 40)"
    },
    nz: {
      value: l.state(8),
      min: 4,
      max: 20,
      step: 2,
      label: "nz mesh (libro: 20)"
    },
    Es: {
      value: l.state(2e4),
      min: 5e3,
      max: 1e5,
      step: 1e3,
      label: "Es suelo (kN/m\xB2)"
    },
    nu: {
      value: l.state(0.42),
      min: 0.2,
      max: 0.49,
      step: 0.01,
      label: "\u03BD suelo"
    },
    Rx: {
      value: l.state(5),
      min: 1,
      max: 15,
      step: 0.5,
      label: "Rx carga (m)"
    },
    Ry: {
      value: l.state(3),
      min: 1,
      max: 15,
      step: 0.5,
      label: "Ry carga (m)"
    },
    w: {
      value: l.state(100),
      min: 10,
      max: 500,
      step: 10,
      label: "w (kN/m\xB2)"
    },
    showSlice: {
      value: l.state(1),
      min: 0,
      max: 1,
      step: 1,
      label: "Vista rebanada XZ (1=si)"
    },
    vmRefMax: {
      value: l.state(0),
      min: 0,
      max: 2e3,
      step: 10,
      label: "vM ref max (0=auto)"
    }
  }, K = l.state([]), Q = l.state([]), W = l.state({}), ee = l.state({}), te = l.state({}), se = l.state({}), ae = l.state({
    N: 0,
    nElems: 0,
    nDOF: 0,
    s33_min: 0,
    s33_max: 0,
    uz_max: 0,
    elapsed: 0
  });
  l.derive(() => {
    const n = c.Lx.value.val, B = c.Ly.value.val, ie = c.Lz.value.val, u = Math.round(c.nx.value.val), f = Math.round(c.ny.value.val), y = Math.round(c.nz.value.val), I = c.Es.value.val, L = c.nu.value.val, H = c.Rx.value.val, U = c.Ry.value.val, re = c.w.value.val, _ = Math.round(c.showSlice.value.val) === 1, $ = c.vmRefMax.value.val, S = n / u, z = B / f, me = ie / y, r = (e, t, a) => a * (u + 1) * (f + 1) + t * (u + 1) + e, O = [];
    for (let e = 0; e <= y; e++) for (let t = 0; t <= f; t++) for (let a = 0; a <= u; a++) O.push([
      -n / 2 + a * S,
      -B / 2 + t * z,
      -e * me
    ]);
    const E = [];
    for (let e = 0; e < y; e++) for (let t = 0; t < f; t++) for (let a = 0; a < u; a++) E.push([
      r(a, t, e + 1),
      r(a + 1, t, e + 1),
      r(a + 1, t + 1, e + 1),
      r(a, t + 1, e + 1),
      r(a, t, e),
      r(a + 1, t, e),
      r(a + 1, t + 1, e),
      r(a, t + 1, e)
    ]);
    const p = /* @__PURE__ */ new Map();
    for (let e = 0; e <= f; e++) for (let t = 0; t <= u; t++) p.set(r(t, e, y), [
      true,
      true,
      true
    ]);
    for (let e = 0; e <= y; e++) for (let t = 0; t <= f; t++) {
      const a = r(0, t, e), s = r(u, t, e), o = p.get(a) ?? [
        false,
        false,
        false
      ], i = p.get(s) ?? [
        false,
        false,
        false
      ];
      p.set(a, [
        true,
        o[1],
        o[2]
      ]), p.set(s, [
        true,
        i[1],
        i[2]
      ]);
    }
    for (let e = 0; e <= y; e++) for (let t = 0; t <= u; t++) {
      const a = r(t, 0, e), s = r(t, f, e), o = p.get(a) ?? [
        false,
        false,
        false
      ], i = p.get(s) ?? [
        false,
        false,
        false
      ];
      p.set(a, [
        o[0],
        true,
        o[2]
      ]), p.set(s, [
        i[0],
        true,
        i[2]
      ]);
    }
    const ce = -H / 2, de = H / 2, ue = -U / 2, fe = U / 2, P = /* @__PURE__ */ new Map();
    for (let e = 0; e <= f; e++) for (let t = 0; t <= u; t++) {
      const a = -n / 2 + t * S, s = -B / 2 + e * z;
      if (a < ce - 1e-6 || a > de + 1e-6 || s < ue - 1e-6 || s > fe + 1e-6) continue;
      let o = S, i = z;
      (t === 0 || t === u) && (o = S / 2), (e === 0 || e === f) && (i = z / 2);
      const d = o * i, m = -re * d;
      P.set(r(t, e, 0), [
        0,
        0,
        m
      ]);
    }
    const R = O.length;
    console.log(`Bulbo presiones: ${R} nodos, ${E.length} hex8, ${3 * R} DOFs`);
    let v;
    try {
      v = xe({
        nodes: O,
        elements: E,
        E: I,
        nu: L,
        supports: p,
        loads: P
      }), console.log(`H8 resuelto en ${v.elapsedMs.toFixed(0)} ms`);
    } catch (e) {
      console.warn("Bulbo presiones H8:", (e == null ? void 0 : e.message) ?? e), v = null;
    }
    const pe = O.map((e) => [
      e[0],
      e[1],
      e[2]
    ]), x = [], h = {
      elasticities: /* @__PURE__ */ new Map(),
      poissonsRatios: /* @__PURE__ */ new Map(),
      thicknesses: /* @__PURE__ */ new Map(),
      shearModuli: /* @__PURE__ */ new Map(),
      densities: /* @__PURE__ */ new Map(),
      areas: /* @__PURE__ */ new Map(),
      momentsOfInertiaZ: /* @__PURE__ */ new Map(),
      momentsOfInertiaY: /* @__PURE__ */ new Map(),
      torsionalConstants: /* @__PURE__ */ new Map()
    };
    function g(e, t, a, s) {
      x.push([
        e,
        t,
        a,
        s
      ]);
      const o = x.length - 1;
      h.elasticities.set(o, I), h.poissonsRatios.set(o, L), h.thicknesses.set(o, 1e-3), h.shearModuli.set(o, I / (2 * (1 + L))), h.densities.set(o, 18 / 9.80665), h.areas.set(o, 0), h.momentsOfInertiaZ.set(o, 0), h.momentsOfInertiaY.set(o, 0), h.torsionalConstants.set(o, 0);
    }
    const A = Math.floor(f / 2), w = /* @__PURE__ */ new Map();
    let b = 0;
    for (let e = 0; e < y; e++) for (let t = 0; t < f; t++) for (let a = 0; a < u; a++) {
      if (_ && t !== A) {
        b++;
        continue;
      }
      const s = (i, d, m) => r(a + i, t + d, e + m), o = x.length;
      if (g(s(0, 0, 0), s(1, 0, 0), s(1, 0, 1), s(0, 0, 1)), w.set(o, b), !_ || t === A) {
        if (_) {
          const m = x.length;
          g(s(0, 1, 0), s(1, 1, 0), s(1, 1, 1), s(0, 1, 1)), w.set(m, b);
        }
        const i = x.length;
        g(s(0, 0, 0), s(1, 0, 0), s(1, 1, 0), s(0, 1, 0)), w.set(i, b);
        const d = x.length;
        if (g(s(0, 0, 1), s(1, 0, 1), s(1, 1, 1), s(0, 1, 1)), w.set(d, b), !_) g(s(0, 1, 0), s(1, 1, 0), s(1, 1, 1), s(0, 1, 1)), g(s(0, 0, 0), s(0, 1, 0), s(0, 1, 1), s(0, 0, 1)), g(s(1, 0, 0), s(1, 1, 0), s(1, 1, 1), s(1, 0, 1));
        else {
          if (a === 0) {
            const m = x.length;
            g(s(0, 0, 0), s(0, 1, 0), s(0, 1, 1), s(0, 0, 1)), w.set(m, b);
          }
          if (a === u - 1) {
            const m = x.length;
            g(s(1, 0, 0), s(1, 1, 0), s(1, 1, 1), s(1, 0, 1)), w.set(m, b);
          }
        }
      }
      b++;
    }
    const V = {
      deformations: /* @__PURE__ */ new Map()
    };
    v && v.displacements.forEach(([e, t, a], s) => {
      V.deformations.set(s, [
        e,
        t,
        a,
        0,
        0,
        0
      ]);
    });
    const N = {};
    if (v) {
      const e = /* @__PURE__ */ new Map();
      E.forEach((a, s) => {
        const o = v.stressPerElement.get(s) || [];
        let i = 0, d = 0;
        for (const m of o) i += Math.abs(m[2]), d++;
        i = d > 0 ? i / d : 0;
        for (const m of a) {
          const D = e.get(m) || {
            sum: 0,
            count: 0
          };
          D.sum += i, D.count += 1, e.set(m, D);
        }
      });
      const t = /* @__PURE__ */ new Map();
      x.forEach((a, s) => {
        const o = a.map((i) => {
          const d = e.get(i);
          return d ? d.sum / d.count : 0;
        });
        t.set(s, [
          o[0],
          o[1],
          o[2],
          o[3]
        ]);
      }), N.vonMises = t, $ > 0 && (N.colorMapRanges = {
        vonMises: [
          0,
          $
        ]
      });
    }
    const X = /* @__PURE__ */ new Map();
    p.forEach((e, t) => X.set(t, [
      e[0],
      e[1],
      e[2],
      true,
      true,
      true
    ]));
    const Z = /* @__PURE__ */ new Map();
    P.forEach((e, t) => Z.set(t, [
      e[0],
      e[1],
      e[2],
      0,
      0,
      0
    ]));
    let G = 0, Y = 0, j = 0;
    if (v) {
      let e = 1 / 0, t = -1 / 0;
      v.vonMisesPerElement.forEach((a) => {
        a.forEach((s) => {
          s < e && (e = s), s > t && (t = s);
        });
      }), G = e === 1 / 0 ? 0 : e, Y = t === -1 / 0 ? 0 : t, v.displacements.forEach(([, , a]) => {
        Math.abs(a) > Math.abs(j) && (j = a);
      });
    }
    ae.val = {
      N: R,
      nElems: E.length,
      nDOF: 3 * R,
      s33_min: G,
      s33_max: Y,
      uz_max: j,
      elapsed: (v == null ? void 0 : v.elapsedMs) ?? 0
    }, K.val = pe, Q.val = x, W.val = {
      supports: X,
      loads: Z
    }, ee.val = h, te.val = V, se.val = N;
  });
  const ne = he({
    mesh: {
      nodes: K,
      elements: Q,
      nodeInputs: W,
      elementInputs: ee,
      deformOutputs: te,
      analyzeOutputs: se
    },
    settingsObj: {
      deformedShape: false,
      solidResults: "vonMises",
      shellResults: "none",
      gridSize: 25,
      deformScale: 100,
      custom3D: false,
      loads: false,
      supports: false,
      nodes: false,
      showCotas: false,
      displayScale: 0.5
    }
  }), T = document.createElement("div");
  T.style.cssText = "position:fixed;top:8px;right:8px;width:320px;max-height:90vh;overflow-y:auto;z-index:9999;";
  const k = new ve({
    title: "\u{1F30D} Bulbo de Presiones (Serquen SF-70)",
    container: T,
    expanded: true
  });
  window.__hekatanPanes = window.__hekatanPanes ?? [];
  window.__hekatanPanes.push(k);
  const M = {
    N: 0,
    nElems: 0,
    nDOF: 0,
    s33_min: 0,
    s33_max: 0,
    uz_max: 0,
    elapsed: 0
  }, F = k.addFolder({
    title: "Estad\xEDsticas malla H8"
  });
  F.addBinding(M, "N", {
    readonly: true,
    label: "Nodos",
    format: (n) => n.toFixed(0)
  });
  F.addBinding(M, "nElems", {
    readonly: true,
    label: "Elementos hex8",
    format: (n) => n.toFixed(0)
  });
  F.addBinding(M, "nDOF", {
    readonly: true,
    label: "DOFs",
    format: (n) => n.toFixed(0)
  });
  F.addBinding(M, "elapsed", {
    readonly: true,
    label: "solve (ms)",
    format: (n) => n.toFixed(0)
  });
  const C = k.addFolder({
    title: "Resultados (vonMises proxy de S33)"
  });
  C.addBinding(M, "s33_min", {
    readonly: true,
    label: "vM min (kN/m\xB2)",
    format: (n) => n.toExponential(3)
  });
  C.addBinding(M, "s33_max", {
    readonly: true,
    label: "vM max (kN/m\xB2)",
    format: (n) => n.toExponential(3)
  });
  C.addBinding(M, "uz_max", {
    readonly: true,
    label: "u_z max (m)",
    format: (n) => n.toExponential(3)
  });
  const oe = k.addFolder({
    title: "Unidades",
    expanded: false
  }), le = {
    stress: J.val,
    disp: q.val
  };
  oe.addBinding(le, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      kPa: "kPa",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      "tonf/m\xB2": "tonf/m\xB2",
      ksi: "ksi",
      psi: "psi"
    },
    label: "Tensi\xF3n"
  }).on("change", (n) => {
    J.val = n.value;
  });
  oe.addBinding(le, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm",
      \u00B5m: "\xB5m"
    },
    label: "Desplaz."
  }).on("change", (n) => {
    q.val = n.value;
  });
  document.body.append(T);
  l.derive(() => {
    Object.assign(M, ae.val), k.refresh();
  });
  document.body.append(be(c), ne, Me({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/bulbo-presiones-suelo/main.ts"
  }));
  setTimeout(() => ge(), 200);
  setTimeout(() => {
    var _a;
    const n = ne.__ctx;
    (n == null ? void 0 : n.camera) && (n == null ? void 0 : n.controls) && (n.camera.up.set(0, 0, 1), n.camera.position.set(20, -25, 18), n.controls.target.set(0, 0, -5), n.controls.update(), (_a = n.render) == null ? void 0 : _a.call(n));
  }, 800);
});
