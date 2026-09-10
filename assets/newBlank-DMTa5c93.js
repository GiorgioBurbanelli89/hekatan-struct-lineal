import { a as ge } from "./analyze-DgLgRmKg.js";
import { d as we, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let _e;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let G, K, W, ee, T, H, ne, oe, m, g;
  G = 25e6;
  K = 0.2;
  W = G / (2 * (1 + K));
  ee = 24;
  T = 2e8;
  H = 0.3;
  ne = T / (2 * (1 + H));
  oe = 78;
  m = (l, t, r, d, w, p) => ({
    default: r,
    min: d,
    max: w,
    step: p,
    label: t,
    folder: l
  });
  g = (l, t, r, d) => ({
    default: r,
    label: t,
    folder: l,
    options: d
  });
  _e = {
    id: "new-blank",
    name: "\u{1F4C4} Archivo nuevo (lienzo CAD 2D/3D)",
    category: "\u{1F9EA} Utilidades",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: false,
    params: {
      mode: g("Modo", "Espacio de trabajo", 1, {
        "2D (plano XZ \u2014 elevaci\xF3n)": 0,
        "3D (espacial)": 1
      }),
      mat: g("Secci\xF3n frames", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      bCol: m("Secci\xF3n frames", "b columna (m)", 0.4, 0.1, 1, 0.05),
      hCol: m("Secci\xF3n frames", "h columna (m)", 0.4, 0.1, 1, 0.05),
      bViga: m("Secci\xF3n frames", "b viga (m)", 0.3, 0.1, 0.8, 0.05),
      hViga: m("Secci\xF3n frames", "h viga (m)", 0.5, 0.1, 1, 0.05),
      tShell: m("Secci\xF3n shells", "Espesor shell (m)", 0.2, 0.05, 1, 0.01),
      matShell: g("Secci\xF3n shells", "Material shell", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      apoyo: g("Apoyos", "Tipo apoyo en Z m\xEDnimo", 3, {
        "Empotrado (6 DOFs)": 0,
        "Articulado (3 trans.)": 1,
        "R\xF3tula (Ux,Uz, libre Uy/R)": 2,
        "Sin apoyo autom\xE1tico": 3
      }),
      aplicarCargas: g("Cargas", "Aplicar cargas auto", 0, {
        S\u00ED: 1,
        No: 0
      }),
      patronCargas: g("Cargas", "Pertenecen al patron", 0, {
        Dead: 0,
        Live: 1
      }),
      Fz: m("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
      Fx: m("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),
      autoSolve: g("Solver", "Auto-resolver", 1, {
        S\u00ED: 1,
        No: 0
      })
    },
    build(l, t) {
      var _a, _b, _c;
      const r = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], d = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], w = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], p = new Set(w);
      if (!r.length) {
        t.nodes.val = [], t.elements.val = [], t.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, t.elementInputs.val = {}, t.objects3D.val = [], console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const D = Math.round(l.mode ?? 1) === 0, a = r.map((e) => D ? [
        e[0],
        0,
        e[2]
      ] : [
        e[0],
        e[1],
        e[2]
      ]), se = 1e-4, A = new Int32Array(a.length);
      {
        const e = /* @__PURE__ */ new Map();
        for (let o = 0; o < a.length; o++) {
          const n = a[o].map((i) => Math.round(i / se)).join(","), s = e.get(n);
          s === void 0 ? (e.set(n, o), A[o] = o) : A[o] = s;
        }
      }
      const M = (e) => e >= 0 && e < A.length ? A[e] : e, c = [], N = /* @__PURE__ */ new Set(), Z = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Map();
      for (let e = 0; e < d.length; e++) {
        const o = d[e];
        if (p.has(e)) {
          const n = (o.length === 5 ? o.slice(0, 4) : o.slice(0, Math.min(4, o.length))).map(M);
          if (n.length !== 4 || n.some((i) => a[i] === void 0)) continue;
          const s = c.length;
          c.push(n), v.add(s);
        } else for (let n = 0; n < o.length - 1; n++) {
          const s = M(o[n]), i = M(o[n + 1]);
          if (s === i || a[s] === void 0 || a[i] === void 0) continue;
          const h = c.length;
          c.push([
            s,
            i
          ]), x.set(`${e}:${n}`, h);
          const _ = a[i][0] - a[s][0], j = a[i][1] - a[s][1], me = a[i][2] - a[s][2];
          Math.abs(me) > Math.max(Math.abs(_), Math.abs(j)) ? N.add(h) : Z.add(h);
        }
      }
      const b = Math.round(l.mat ?? 0), ae = b === 0 ? G : T, te = b === 0 ? W : ne, le = b === 0 ? K : H, ie = b === 0 ? ee : oe, C = Math.round(l.matShell ?? 0), ce = C === 0 ? G : T, re = C === 0 ? W : ne, de = C === 0 ? K : H, he = C === 0 ? ee : oe, $ = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
      for (let e = 0; e < c.length; e++) if (v.has(e)) $.set(e, ce), L.set(e, re), P.set(e, he), E.set(e, de), X.set(e, l.tShell ?? 0.2);
      else {
        const o = N.has(e), n = o ? l.bCol : l.bViga, s = o ? l.hCol : l.hViga, i = n * s, h = s * Math.pow(n, 3) / 12, _ = n * Math.pow(s, 3) / 12, j = 0.14 * Math.pow(Math.min(n, s), 4);
        $.set(e, ae), L.set(e, te), I.set(e, i), S.set(e, h), z.set(e, _), k.set(e, j), P.set(e, ie), E.set(e, le);
      }
      const F = window.__hekatanManualSections;
      if (F && F.size > 0) for (const [e, o] of F.entries()) {
        const n = x.get(e);
        n === void 0 || v.has(n) || (o.A != null && I.set(n, o.A), o.Iz != null && S.set(n, o.Iz), o.Iy != null && z.set(n, o.Iy), o.J != null && k.set(n, o.J));
      }
      const Y = window.__hekatanMaterialDB, O = window.__hekatanManualMaterial;
      if (O && O.size > 0 && Y) for (const [e, o] of O.entries()) {
        const n = x.get(e);
        if (n === void 0 || v.has(n)) continue;
        const s = Y[o];
        if (!s) continue;
        $.set(n, s.E);
        const i = s.E / (2 * (1 + s.nu));
        L.set(n, i), P.set(n, s.rho), E.set(n, s.nu);
      }
      const R = window.__hekatanManualModifiers;
      if (R && R.size > 0) for (const [e, o] of R.entries()) {
        const n = x.get(e);
        if (n === void 0 || v.has(n)) continue;
        const s = I.get(n);
        s != null && I.set(n, s * o.A);
        const i = S.get(n);
        i != null && S.set(n, i * o.Iz);
        const h = z.get(n);
        h != null && z.set(n, h * o.Iy);
        const _ = k.get(n);
        _ != null && k.set(n, _ * o.J);
      }
      const B = Math.round(l.apoyo ?? 0), u = /* @__PURE__ */ new Map();
      if (a.length > 0 && B !== 3) {
        const e = Math.min(...a.map((n) => n[2])), o = B === 0 ? [
          true,
          true,
          true,
          true,
          true,
          true
        ] : B === 1 ? [
          true,
          true,
          true,
          false,
          false,
          false
        ] : [
          true,
          false,
          true,
          false,
          false,
          false
        ];
        for (let n = 0; n < a.length; n++) Math.abs(a[n][2] - e) < 1e-6 && u.set(n, [
          ...o
        ]);
      }
      const V = window.__hekatanManualSupports;
      if (V && V.size > 0) for (const [e, o] of V.entries()) e >= 0 && e < a.length && u.set(M(e), [
        ...o
      ]);
      const ue = Math.round(l.patronCargas ?? 0) === 1 ? "Live" : "Dead", fe = window.__hekatanActiveCase, q = (() => {
        var _a2;
        const o = (((_a2 = t.loadCases) == null ? void 0 : _a2.val) ?? []).find((n) => n.name === fe);
        return o ? (o.patterns ?? []).map((n) => n.pattern) : [];
      })(), Q = q.length === 0 || q.includes(ue), f = /* @__PURE__ */ new Map();
      if (Q && Math.round(l.aplicarCargas ?? 1) === 1 && a.length > 0) {
        const e = Math.max(...a.map((s) => s[2])), o = l.Fx ?? 0, n = l.Fz ?? -10;
        for (let s = 0; s < a.length; s++) Math.abs(a[s][2] - e) < 1e-6 && f.set(s, [
          o,
          0,
          n,
          0,
          0,
          0
        ]);
      }
      const J = window.__hekatanManualLoads;
      if (Q && J && J.size > 0) for (const [e, o] of J.entries()) e >= 0 && e < a.length && f.set(M(e), [
        ...o
      ]);
      if (new URLSearchParams(window.location.search).get("heks") || new URLSearchParams(window.location.search).get("m")) {
        t.nodes.val = [], t.elements.val = [], t.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        };
        return;
      }
      t.nodes.val = a, t.elements.val = c, t.nodeInputs.val = {
        supports: u,
        loads: f
      }, t.elementInputs.val = {
        elasticities: $,
        shearModuli: L,
        areas: I,
        momentsOfInertiaY: S,
        momentsOfInertiaZ: z,
        torsionalConstants: k,
        densities: P,
        poissonsRatios: E,
        thicknesses: X
      }, t.objects3D.val = [];
      const y = [], U = window.__hekatanManualSprings;
      if (U && U.size > 0) {
        for (const [e, o] of U.entries()) if (!(e < 0 || e >= a.length)) for (let n = 0; n < 6; n++) o[n] !== 0 && y.push({
          node: M(e),
          dof: n,
          k: o[n]
        });
      }
      if (Math.round(l.autoSolve ?? 1) === 1 && a.length > 0 && c.length > 0 && u.size > 0 && f.size > 0) try {
        t.deformOutputs.val = we(a, c, {
          supports: u,
          loads: f
        }, t.elementInputs.val, y.length > 0 ? y : void 0), t.analyzeOutputs.val = ge(a, c, t.elementInputs.val, t.deformOutputs.rawVal);
        const e = /* @__PURE__ */ new Set();
        for (const o of c) for (const n of o) e.add(n);
        console.log(`[NewBlank] Solve OK \u2014 ${e.size} nudos (de ${a.length} puntos), ${c.length} elementos, ${u.size} apoyos, ${f.size} cargas, ${y.length} springs`);
      } catch (e) {
        console.warn(`[NewBlank] Solver fall\xF3: ${e.message}`);
      }
      else console.log(`[NewBlank] mode=${D ? "2D" : "3D"} | nodes=${a.length} elem=${c.length} cols=${N.size} vigas=${Z.size} shells=${v.size} apoyos=${u.size} cargas=${f.size} springs=${y.length}`);
    },
    computedLabels(l, t) {
      const r = {}, d = t.nodes.val.length;
      t.elements.val.length;
      let w = 0, p = 0;
      for (const D of t.elements.val) D.length === 4 ? p++ : w++;
      return r.Stats = `${d} nodos \xB7 ${w} frames \xB7 ${p} shells`, d === 0 && (r["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), r;
    }
  };
});
export {
  __tla,
  _e as n
};
