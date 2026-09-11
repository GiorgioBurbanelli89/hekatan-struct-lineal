import { a as Pe } from "./analyze-DgLgRmKg.js";
import { d as Le, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let Re;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const ie = 25e6, re = 0.2, Me = ie / (2 * (1 + re)), ve = 24, de = 2e8, he = 0.3, _e = de / (2 * (1 + he)), Se = 78, _ = (i, a, f, m, M, S) => ({
    default: f,
    min: m,
    max: M,
    step: S,
    label: a,
    folder: i
  });
  function Ne(i, a) {
    const f = i[a[0]], m = i[a[1]], M = i[a[2]], S = i[a[3]], I = (t, P, k) => {
      const u = [
        P[0] - t[0],
        P[1] - t[1],
        P[2] - t[2]
      ], d = [
        k[0] - t[0],
        k[1] - t[1],
        k[2] - t[2]
      ];
      return 0.5 * Math.hypot(u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]);
    };
    return I(f, m, M) + I(f, M, S);
  }
  let $;
  $ = (i, a, f, m) => ({
    default: f,
    label: a,
    folder: i,
    options: m
  });
  Re = {
    id: "new-blank",
    name: "\u{1F4C4} Archivo nuevo (lienzo CAD 2D/3D)",
    category: "\u{1F9EA} Utilidades",
    defaultShellResult: "none",
    availableShellResults: [
      "none",
      "pressure",
      "displacementZ",
      "vonMises",
      "bendingXX",
      "bendingYY"
    ],
    hasModal: false,
    params: {
      mode: $("Modo", "Espacio de trabajo", 1, {
        "2D (plano XZ \u2014 elevaci\xF3n)": 0,
        "3D (espacial)": 1
      }),
      mat: $("Secci\xF3n frames", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      bCol: _("Secci\xF3n frames", "b columna (m)", 0.4, 0.1, 1, 0.05),
      hCol: _("Secci\xF3n frames", "h columna (m)", 0.4, 0.1, 1, 0.05),
      bViga: _("Secci\xF3n frames", "b viga (m)", 0.3, 0.1, 0.8, 0.05),
      hViga: _("Secci\xF3n frames", "h viga (m)", 0.5, 0.1, 1, 0.05),
      tShell: _("Secci\xF3n shells", "Espesor shell (m)", 0.2, 0.05, 1, 0.01),
      matShell: $("Secci\xF3n shells", "Material shell", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      mallaZapata: _("\u{1F9F0} Zapata / Suelo", "Malla del \xE1rea (nx = ny)", 1, 1, 12, 1),
      ksSuelo: _("\u{1F9F0} Zapata / Suelo", "Suelo ks (tonf/m\xB3, 0 = off)", 0, 0, 8e3, 50),
      apoyo: $("Apoyos", "Tipo apoyo en Z m\xEDnimo", 3, {
        "Empotrado (6 DOFs)": 0,
        "Articulado (3 trans.)": 1,
        "R\xF3tula (Ux,Uz, libre Uy/R)": 2,
        "Sin apoyo autom\xE1tico": 3
      }),
      aplicarCargas: $("Cargas", "Aplicar cargas auto", 0, {
        S\u00ED: 1,
        No: 0
      }),
      patronCargas: $("Cargas", "Pertenecen al patron", 0, {
        Dead: 0,
        Live: 1
      }),
      Fz: _("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
      Fx: _("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),
      autoSolve: $("Solver", "Auto-resolver", 1, {
        S\u00ED: 1,
        No: 0
      })
    },
    build(i, a) {
      var _a, _b, _c;
      const f = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], m = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], M = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], S = new Set(M);
      if (!f.length) {
        a.nodes.val = [], a.elements.val = [], a.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, a.elementInputs.val = {}, a.objects3D.val = [], console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const I = Math.round(i.mode ?? 1) === 0, t = f.map((e) => I ? [
        e[0],
        0,
        e[2]
      ] : [
        e[0],
        e[1],
        e[2]
      ]), P = 1e-4, k = new Int32Array(t.length);
      {
        const e = /* @__PURE__ */ new Map();
        for (let o = 0; o < t.length; o++) {
          const n = t[o].map((l) => Math.round(l / P)).join(","), s = e.get(n);
          s === void 0 ? (e.set(n, o), k[o] = o) : k[o] = s;
        }
      }
      const u = (e) => e >= 0 && e < k.length ? k[e] : e, d = [], Q = /* @__PURE__ */ new Set(), ue = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set(), g = Math.max(1, Math.round(i.mallaZapata ?? 1)), L = /* @__PURE__ */ new Set(), W = /* @__PURE__ */ new Set(), q = 1e-3, fe = (e) => `${Math.round(e[0] / q)},${Math.round(e[1] / q)},${Math.round(e[2] / q)}`, ee = /* @__PURE__ */ new Map();
      for (let e = 0; e < t.length; e++) ee.set(fe(t[e]), u(e));
      const Z = /* @__PURE__ */ new Map();
      for (let e = 0; e < m.length; e++) {
        const o = m[e];
        if (S.has(e)) {
          const n = (o.length === 5 ? o.slice(0, 4) : o.slice(0, Math.min(4, o.length))).map(u);
          if (n.length !== 4 || n.some((s) => t[s] === void 0)) continue;
          if (g <= 1) {
            const s = d.length;
            d.push(n), y.add(s), L.add(s);
            for (const l of n) W.add(l);
          } else {
            const [s, l, h, p] = n, z = t[s], D = t[l], C = t[h], F = t[p], b = (c, r) => [
              (1 - c) * (1 - r) * z[0] + c * (1 - r) * D[0] + c * r * C[0] + (1 - c) * r * F[0],
              (1 - c) * (1 - r) * z[1] + c * (1 - r) * D[1] + c * r * C[1] + (1 - c) * r * F[1],
              (1 - c) * (1 - r) * z[2] + c * (1 - r) * D[2] + c * r * C[2] + (1 - c) * r * F[2]
            ], V = [];
            for (let c = 0; c <= g; c++) {
              const r = [];
              for (let w = 0; w <= g; w++) if (c === 0 && w === 0) r.push(s);
              else if (c === g && w === 0) r.push(l);
              else if (c === g && w === g) r.push(h);
              else if (c === 0 && w === g) r.push(p);
              else {
                const B = b(c / g, w / g), X = fe(B);
                let Y = ee.get(X);
                Y === void 0 && (Y = t.length, t.push(B), ee.set(X, Y)), r.push(Y);
              }
              V.push(r);
            }
            for (let c = 0; c < g; c++) for (let r = 0; r < g; r++) {
              const w = [
                V[c][r],
                V[c + 1][r],
                V[c + 1][r + 1],
                V[c][r + 1]
              ], B = d.length;
              d.push(w), y.add(B), L.add(B);
              for (const X of w) W.add(X);
            }
          }
        } else for (let n = 0; n < o.length - 1; n++) {
          const s = u(o[n]), l = u(o[n + 1]);
          if (s === l || t[s] === void 0 || t[l] === void 0) continue;
          const h = d.length;
          d.push([
            s,
            l
          ]), Z.set(`${e}:${n}`, h);
          const p = t[l][0] - t[s][0], z = t[l][1] - t[s][1], D = t[l][2] - t[s][2];
          Math.abs(D) > Math.max(Math.abs(p), Math.abs(z)) ? Q.add(h) : ue.add(h);
        }
      }
      const j = Math.round(i.mat ?? 0), ke = j === 0 ? ie : de, ze = j === 0 ? Me : _e, Ie = j === 0 ? re : he, ye = j === 0 ? ve : Se, U = Math.round(i.matShell ?? 0), xe = U === 0 ? ie : de, Ae = U === 0 ? Me : _e, De = U === 0 ? re : he, be = U === 0 ? ve : Se, J = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map();
      for (let e = 0; e < d.length; e++) if (y.has(e)) J.set(e, xe), T.set(e, Ae), G.set(e, be), K.set(e, De), pe.set(e, i.tShell ?? 0.2);
      else {
        const o = Q.has(e), n = o ? i.bCol : i.bViga, s = o ? i.hCol : i.hViga, l = n * s, h = s * Math.pow(n, 3) / 12, p = n * Math.pow(s, 3) / 12, z = 0.14 * Math.pow(Math.min(n, s), 4);
        J.set(e, ke), T.set(e, ze), N.set(e, l), O.set(e, h), E.set(e, p), R.set(e, z), G.set(e, ye), K.set(e, Ie);
      }
      const ne = window.__hekatanManualSections;
      if (ne && ne.size > 0) for (const [e, o] of ne.entries()) {
        const n = Z.get(e);
        n === void 0 || y.has(n) || (o.A != null && N.set(n, o.A), o.Iz != null && O.set(n, o.Iz), o.Iy != null && E.set(n, o.Iy), o.J != null && R.set(n, o.J));
      }
      const me = window.__hekatanMaterialDB, oe = window.__hekatanManualMaterial;
      if (oe && oe.size > 0 && me) for (const [e, o] of oe.entries()) {
        const n = Z.get(e);
        if (n === void 0 || y.has(n)) continue;
        const s = me[o];
        if (!s) continue;
        J.set(n, s.E);
        const l = s.E / (2 * (1 + s.nu));
        T.set(n, l), G.set(n, s.rho), K.set(n, s.nu);
      }
      const se = window.__hekatanManualModifiers;
      if (se && se.size > 0) for (const [e, o] of se.entries()) {
        const n = Z.get(e);
        if (n === void 0 || y.has(n)) continue;
        const s = N.get(n);
        s != null && N.set(n, s * o.A);
        const l = O.get(n);
        l != null && O.set(n, l * o.Iz);
        const h = E.get(n);
        h != null && E.set(n, h * o.Iy);
        const p = R.get(n);
        p != null && R.set(n, p * o.J);
      }
      const te = Math.round(i.apoyo ?? 0), x = /* @__PURE__ */ new Map();
      if (t.length > 0 && te !== 3) {
        const e = Math.min(...t.map((n) => n[2])), o = te === 0 ? [
          true,
          true,
          true,
          true,
          true,
          true
        ] : te === 1 ? [
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
        for (let n = 0; n < t.length; n++) Math.abs(t[n][2] - e) < 1e-6 && x.set(n, [
          ...o
        ]);
      }
      const ae = window.__hekatanManualSupports;
      if (ae && ae.size > 0) for (const [e, o] of ae.entries()) e >= 0 && e < t.length && x.set(u(e), [
        ...o
      ]);
      const $e = Math.round(i.patronCargas ?? 0) === 1 ? "Live" : "Dead", Ce = window.__hekatanActiveCase, ge = (() => {
        var _a2;
        const o = (((_a2 = a.loadCases) == null ? void 0 : _a2.val) ?? []).find((n) => n.name === Ce);
        return o ? (o.patterns ?? []).map((n) => n.pattern) : [];
      })(), we = ge.length === 0 || ge.includes($e), A = /* @__PURE__ */ new Map();
      if (we && Math.round(i.aplicarCargas ?? 1) === 1 && t.length > 0) {
        const e = Math.max(...t.map((s) => s[2])), o = i.Fx ?? 0, n = i.Fz ?? -10;
        for (let s = 0; s < t.length; s++) Math.abs(t[s][2] - e) < 1e-6 && A.set(s, [
          o,
          0,
          n,
          0,
          0,
          0
        ]);
      }
      const le = window.__hekatanManualLoads;
      if (we && le && le.size > 0) for (const [e, o] of le.entries()) e >= 0 && e < t.length && A.set(u(e), [
        ...o
      ]);
      if (new URLSearchParams(window.location.search).get("heks") || new URLSearchParams(window.location.search).get("m")) {
        a.nodes.val = [], a.elements.val = [], a.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        };
        return;
      }
      a.nodes.val = t, a.elements.val = d, a.nodeInputs.val = {
        supports: x,
        loads: A
      }, a.elementInputs.val = {
        elasticities: J,
        shearModuli: T,
        areas: N,
        momentsOfInertiaY: O,
        momentsOfInertiaZ: E,
        torsionalConstants: R,
        densities: G,
        poissonsRatios: K,
        thicknesses: pe
      }, a.objects3D.val = [];
      const v = [], ce = window.__hekatanManualSprings;
      if (ce && ce.size > 0) {
        for (const [e, o] of ce.entries()) if (!(e < 0 || e >= t.length)) for (let n = 0; n < 6; n++) o[n] !== 0 && v.push({
          node: u(e),
          dof: n,
          k: o[n]
        });
      }
      const H = (i.ksSuelo ?? 0) * 9.80665;
      if (H > 0 && W.size > 0) {
        const e = /* @__PURE__ */ new Map();
        for (const o of L) {
          const n = d[o], s = Ne(t, n);
          for (const l of n) e.set(l, (e.get(l) ?? 0) + s / 4);
        }
        for (const [o, n] of e) {
          const s = H * n;
          v.push({
            node: o,
            dof: 2,
            k: s
          }), v.push({
            node: o,
            dof: 0,
            k: s * 0.5
          }), v.push({
            node: o,
            dof: 1,
            k: s * 0.5
          });
        }
      }
      if (Math.round(i.autoSolve ?? 1) === 1 && t.length > 0 && d.length > 0 && (x.size > 0 || v.length > 0) && A.size > 0) try {
        if (a.deformOutputs.val = Le(t, d, {
          supports: x,
          loads: A
        }, a.elementInputs.val, v.length > 0 ? v : void 0), a.analyzeOutputs.val = Pe(t, d, a.elementInputs.val, a.deformOutputs.rawVal), H > 0 && L.size > 0) try {
          const o = a.deformOutputs.rawVal.deformations, n = a.analyzeOutputs.rawVal ?? {}, s = /* @__PURE__ */ new Map();
          let l = 0, h = 0;
          for (const p of L) {
            const D = d[p].map((C) => {
              var _a2;
              const F = ((_a2 = o.get(C)) == null ? void 0 : _a2[2]) ?? 0, b = H * F;
              return b < l && (l = b), b > h && (h = b), b;
            });
            s.set(p, D);
          }
          n.pressure = s, n.colorMapRanges = {
            ...n.colorMapRanges ?? {},
            pressure: [
              h,
              l
            ]
          }, a.analyzeOutputs.val = n;
        } catch (o) {
          console.warn("[NewBlank] presi\xF3n:", (o == null ? void 0 : o.message) ?? o);
        }
        const e = /* @__PURE__ */ new Set();
        for (const o of d) for (const n of o) e.add(n);
        console.log(`[NewBlank] Solve OK \u2014 ${e.size} nudos (de ${t.length} puntos), ${d.length} elementos, ${x.size} apoyos, ${A.size} cargas, ${v.length} springs`);
      } catch (e) {
        console.warn(`[NewBlank] Solver fall\xF3: ${e.message}`);
      }
      else console.log(`[NewBlank] mode=${I ? "2D" : "3D"} | nodes=${t.length} elem=${d.length} cols=${Q.size} vigas=${ue.size} shells=${y.size} apoyos=${x.size} cargas=${A.size} springs=${v.length}`);
    },
    computedLabels(i, a) {
      const f = {}, m = a.nodes.val.length;
      a.elements.val.length;
      let M = 0, S = 0;
      for (const I of a.elements.val) I.length === 4 ? S++ : M++;
      return f.Stats = `${m} nodos \xB7 ${M} frames \xB7 ${S} shells`, m === 0 && (f["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), f;
    }
  };
});
export {
  __tla,
  Re as n
};
