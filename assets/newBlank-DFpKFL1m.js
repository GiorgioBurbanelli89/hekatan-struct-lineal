import { a as Le } from "./analyze-DgLgRmKg.js";
import { d as Ne, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let Re;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const ie = 25e6, re = 0.2, ve = ie / (2 * (1 + re)), Se = 24, de = 2e8, he = 0.3, _e = de / (2 * (1 + he)), ke = 78, S = (l, t, f, m, M, _) => ({
    default: f,
    min: m,
    max: M,
    step: _,
    label: t,
    folder: l
  });
  function Oe(l, t) {
    const f = l[t[0]], m = l[t[1]], M = l[t[2]], _ = l[t[3]], y = (a, C, k) => {
      const u = [
        C[0] - a[0],
        C[1] - a[1],
        C[2] - a[2]
      ], d = [
        k[0] - a[0],
        k[1] - a[1],
        k[2] - a[2]
      ];
      return 0.5 * Math.hypot(u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]);
    };
    return y(f, m, M) + y(f, M, _);
  }
  let I;
  I = (l, t, f, m) => ({
    default: f,
    label: t,
    folder: l,
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
      mode: I("Modo", "Espacio de trabajo", 1, {
        "2D (plano XZ \u2014 elevaci\xF3n)": 0,
        "3D (espacial)": 1
      }),
      mat: I("Secci\xF3n frames", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      bCol: S("Secci\xF3n frames", "b columna (m)", 0.4, 0.1, 1, 0.05),
      hCol: S("Secci\xF3n frames", "h columna (m)", 0.4, 0.1, 1, 0.05),
      bViga: S("Secci\xF3n frames", "b viga (m)", 0.3, 0.1, 0.8, 0.05),
      hViga: S("Secci\xF3n frames", "h viga (m)", 0.5, 0.1, 1, 0.05),
      tShell: S("Secci\xF3n shells", "Espesor shell (m)", 0.2, 0.05, 1, 0.01),
      matShell: I("Secci\xF3n shells", "Material shell", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      formaPlaca: I("Secci\xF3n shells", "Formulaci\xF3n placa", 0, {
        "Shell-Thick (Mindlin)": 0,
        "Shell-Thin (Kirchhoff)": 1,
        Membrana: 2
      }),
      mallaZapata: S("\u{1F9F0} Zapata / Suelo", "Malla del \xE1rea (nx = ny)", 1, 1, 12, 1),
      ksSuelo: S("\u{1F9F0} Zapata / Suelo", "Suelo ks (tonf/m\xB3, 0 = off)", 0, 0, 8e3, 50),
      apoyo: I("Apoyos", "Tipo apoyo en Z m\xEDnimo", 3, {
        "Empotrado (6 DOFs)": 0,
        "Articulado (3 trans.)": 1,
        "R\xF3tula (Ux,Uz, libre Uy/R)": 2,
        "Sin apoyo autom\xE1tico": 3
      }),
      aplicarCargas: I("Cargas", "Aplicar cargas auto", 0, {
        S\u00ED: 1,
        No: 0
      }),
      patronCargas: I("Cargas", "Pertenecen al patron", 0, {
        Dead: 0,
        Live: 1
      }),
      Fz: S("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
      Fx: S("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),
      autoSolve: I("Solver", "Auto-resolver", 1, {
        S\u00ED: 1,
        No: 0
      })
    },
    build(l, t) {
      var _a, _b, _c;
      const f = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], m = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], M = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], _ = new Set(M);
      if (!f.length) {
        t.nodes.val = [], t.elements.val = [], t.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, t.elementInputs.val = {}, t.objects3D.val = [], console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const y = Math.round(l.mode ?? 1) === 0, a = f.map((e) => y ? [
        e[0],
        0,
        e[2]
      ] : [
        e[0],
        e[1],
        e[2]
      ]), C = 1e-4, k = new Int32Array(a.length);
      {
        const e = /* @__PURE__ */ new Map();
        for (let o = 0; o < a.length; o++) {
          const n = a[o].map((c) => Math.round(c / C)).join(","), s = e.get(n);
          s === void 0 ? (e.set(n, o), k[o] = o) : k[o] = s;
        }
      }
      const u = (e) => e >= 0 && e < k.length ? k[e] : e, d = [], Q = /* @__PURE__ */ new Set(), ue = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set(), g = Math.max(1, Math.round(l.mallaZapata ?? 1)), L = /* @__PURE__ */ new Set(), W = /* @__PURE__ */ new Set(), q = 1e-3, fe = (e) => `${Math.round(e[0] / q)},${Math.round(e[1] / q)},${Math.round(e[2] / q)}`, ee = /* @__PURE__ */ new Map();
      for (let e = 0; e < a.length; e++) ee.set(fe(a[e]), u(e));
      const T = /* @__PURE__ */ new Map();
      for (let e = 0; e < m.length; e++) {
        const o = m[e];
        if (_.has(e)) {
          const n = (o.length === 5 ? o.slice(0, 4) : o.slice(0, Math.min(4, o.length))).map(u);
          if (n.length !== 4 || n.some((s) => a[s] === void 0)) continue;
          if (g <= 1) {
            const s = d.length;
            d.push(n), x.add(s), L.add(s);
            for (const c of n) W.add(c);
          } else {
            const [s, c, h, p] = n, z = a[s], D = a[c], P = a[h], R = a[p], $ = (i, r) => [
              (1 - i) * (1 - r) * z[0] + i * (1 - r) * D[0] + i * r * P[0] + (1 - i) * r * R[0],
              (1 - i) * (1 - r) * z[1] + i * (1 - r) * D[1] + i * r * P[1] + (1 - i) * r * R[1],
              (1 - i) * (1 - r) * z[2] + i * (1 - r) * D[2] + i * r * P[2] + (1 - i) * r * R[2]
            ], V = [];
            for (let i = 0; i <= g; i++) {
              const r = [];
              for (let w = 0; w <= g; w++) if (i === 0 && w === 0) r.push(s);
              else if (i === g && w === 0) r.push(c);
              else if (i === g && w === g) r.push(h);
              else if (i === 0 && w === g) r.push(p);
              else {
                const B = $(i / g, w / g), X = fe(B);
                let Y = ee.get(X);
                Y === void 0 && (Y = a.length, a.push(B), ee.set(X, Y)), r.push(Y);
              }
              V.push(r);
            }
            for (let i = 0; i < g; i++) for (let r = 0; r < g; r++) {
              const w = [
                V[i][r],
                V[i + 1][r],
                V[i + 1][r + 1],
                V[i][r + 1]
              ], B = d.length;
              d.push(w), x.add(B), L.add(B);
              for (const X of w) W.add(X);
            }
          }
        } else for (let n = 0; n < o.length - 1; n++) {
          const s = u(o[n]), c = u(o[n + 1]);
          if (s === c || a[s] === void 0 || a[c] === void 0) continue;
          const h = d.length;
          d.push([
            s,
            c
          ]), T.set(`${e}:${n}`, h);
          const p = a[c][0] - a[s][0], z = a[c][1] - a[s][1], D = a[c][2] - a[s][2];
          Math.abs(D) > Math.max(Math.abs(p), Math.abs(z)) ? Q.add(h) : ue.add(h);
        }
      }
      const Z = Math.round(l.mat ?? 0), ze = Z === 0 ? ie : de, Ie = Z === 0 ? ve : _e, ye = Z === 0 ? re : he, xe = Z === 0 ? Se : ke, j = Math.round(l.matShell ?? 0), Ae = j === 0 ? ie : de, be = j === 0 ? ve : _e, De = j === 0 ? re : he, $e = j === 0 ? Se : ke, U = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (let e = 0; e < d.length; e++) if (x.has(e)) U.set(e, Ae), J.set(e, be), K.set(e, $e), G.set(e, De), pe.set(e, l.tShell ?? 0.2), me.set(e, Math.round(l.formaPlaca ?? 0));
      else {
        const o = Q.has(e), n = o ? l.bCol : l.bViga, s = o ? l.hCol : l.hViga, c = n * s, h = s * Math.pow(n, 3) / 12, p = n * Math.pow(s, 3) / 12, z = 0.14 * Math.pow(Math.min(n, s), 4);
        U.set(e, ze), J.set(e, Ie), N.set(e, c), O.set(e, h), E.set(e, p), F.set(e, z), K.set(e, xe), G.set(e, ye);
      }
      const ne = window.__hekatanManualSections;
      if (ne && ne.size > 0) for (const [e, o] of ne.entries()) {
        const n = T.get(e);
        n === void 0 || x.has(n) || (o.A != null && N.set(n, o.A), o.Iz != null && O.set(n, o.Iz), o.Iy != null && E.set(n, o.Iy), o.J != null && F.set(n, o.J));
      }
      const ge = window.__hekatanMaterialDB, oe = window.__hekatanManualMaterial;
      if (oe && oe.size > 0 && ge) for (const [e, o] of oe.entries()) {
        const n = T.get(e);
        if (n === void 0 || x.has(n)) continue;
        const s = ge[o];
        if (!s) continue;
        U.set(n, s.E);
        const c = s.E / (2 * (1 + s.nu));
        J.set(n, c), K.set(n, s.rho), G.set(n, s.nu);
      }
      const se = window.__hekatanManualModifiers;
      if (se && se.size > 0) for (const [e, o] of se.entries()) {
        const n = T.get(e);
        if (n === void 0 || x.has(n)) continue;
        const s = N.get(n);
        s != null && N.set(n, s * o.A);
        const c = O.get(n);
        c != null && O.set(n, c * o.Iz);
        const h = E.get(n);
        h != null && E.set(n, h * o.Iy);
        const p = F.get(n);
        p != null && F.set(n, p * o.J);
      }
      const ae = Math.round(l.apoyo ?? 0), A = /* @__PURE__ */ new Map();
      if (a.length > 0 && ae !== 3) {
        const e = Math.min(...a.map((n) => n[2])), o = ae === 0 ? [
          true,
          true,
          true,
          true,
          true,
          true
        ] : ae === 1 ? [
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
        for (let n = 0; n < a.length; n++) Math.abs(a[n][2] - e) < 1e-6 && A.set(n, [
          ...o
        ]);
      }
      const te = window.__hekatanManualSupports;
      if (te && te.size > 0) for (const [e, o] of te.entries()) e >= 0 && e < a.length && A.set(u(e), [
        ...o
      ]);
      const Pe = Math.round(l.patronCargas ?? 0) === 1 ? "Live" : "Dead", Ce = window.__hekatanActiveCase, we = (() => {
        var _a2;
        const o = (((_a2 = t.loadCases) == null ? void 0 : _a2.val) ?? []).find((n) => n.name === Ce);
        return o ? (o.patterns ?? []).map((n) => n.pattern) : [];
      })(), Me = we.length === 0 || we.includes(Pe), b = /* @__PURE__ */ new Map();
      if (Me && Math.round(l.aplicarCargas ?? 1) === 1 && a.length > 0) {
        const e = Math.max(...a.map((s) => s[2])), o = l.Fx ?? 0, n = l.Fz ?? -10;
        for (let s = 0; s < a.length; s++) Math.abs(a[s][2] - e) < 1e-6 && b.set(s, [
          o,
          0,
          n,
          0,
          0,
          0
        ]);
      }
      const le = window.__hekatanManualLoads;
      if (Me && le && le.size > 0) for (const [e, o] of le.entries()) e >= 0 && e < a.length && b.set(u(e), [
        ...o
      ]);
      if (new URLSearchParams(window.location.search).get("heks") || new URLSearchParams(window.location.search).get("m")) {
        t.nodes.val = [], t.elements.val = [], t.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        };
        return;
      }
      t.nodes.val = a, t.elements.val = d, t.nodeInputs.val = {
        supports: A,
        loads: b
      }, t.elementInputs.val = {
        elasticities: U,
        shearModuli: J,
        areas: N,
        momentsOfInertiaY: O,
        momentsOfInertiaZ: E,
        torsionalConstants: F,
        densities: K,
        poissonsRatios: G,
        thicknesses: pe,
        plateFormulations: me
      }, t.objects3D.val = [];
      const v = [], ce = window.__hekatanManualSprings;
      if (ce && ce.size > 0) {
        for (const [e, o] of ce.entries()) if (!(e < 0 || e >= a.length)) for (let n = 0; n < 6; n++) o[n] !== 0 && v.push({
          node: u(e),
          dof: n,
          k: o[n]
        });
      }
      const H = (l.ksSuelo ?? 0) * 9.80665;
      if (H > 0 && W.size > 0) {
        const e = /* @__PURE__ */ new Map();
        for (const o of L) {
          const n = d[o], s = Oe(a, n);
          for (const c of n) e.set(c, (e.get(c) ?? 0) + s / 4);
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
      if (Math.round(l.autoSolve ?? 1) === 1 && a.length > 0 && d.length > 0 && (A.size > 0 || v.length > 0) && b.size > 0) try {
        if (t.deformOutputs.val = Ne(a, d, {
          supports: A,
          loads: b
        }, t.elementInputs.val, v.length > 0 ? v : void 0), t.analyzeOutputs.val = Le(a, d, t.elementInputs.val, t.deformOutputs.rawVal), H > 0 && L.size > 0) try {
          const o = t.deformOutputs.rawVal.deformations, n = t.analyzeOutputs.rawVal ?? {}, s = /* @__PURE__ */ new Map();
          let c = 0, h = 0;
          for (const p of L) {
            const D = d[p].map((P) => {
              var _a2;
              const R = ((_a2 = o.get(P)) == null ? void 0 : _a2[2]) ?? 0, $ = H * R;
              return $ < c && (c = $), $ > h && (h = $), $;
            });
            s.set(p, D);
          }
          n.pressure = s, n.colorMapRanges = {
            ...n.colorMapRanges ?? {},
            pressure: [
              h,
              c
            ]
          }, t.analyzeOutputs.val = n;
        } catch (o) {
          console.warn("[NewBlank] presi\xF3n:", (o == null ? void 0 : o.message) ?? o);
        }
        const e = /* @__PURE__ */ new Set();
        for (const o of d) for (const n of o) e.add(n);
        console.log(`[NewBlank] Solve OK \u2014 ${e.size} nudos (de ${a.length} puntos), ${d.length} elementos, ${A.size} apoyos, ${b.size} cargas, ${v.length} springs`);
      } catch (e) {
        console.warn(`[NewBlank] Solver fall\xF3: ${e.message}`);
      }
      else console.log(`[NewBlank] mode=${y ? "2D" : "3D"} | nodes=${a.length} elem=${d.length} cols=${Q.size} vigas=${ue.size} shells=${x.size} apoyos=${A.size} cargas=${b.size} springs=${v.length}`);
    },
    computedLabels(l, t) {
      const f = {}, m = t.nodes.val.length;
      t.elements.val.length;
      let M = 0, _ = 0;
      for (const y of t.elements.val) y.length === 4 ? _++ : M++;
      return f.Stats = `${m} nodos \xB7 ${M} frames \xB7 ${_} shells`, m === 0 && (f["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), f;
    }
  };
});
export {
  __tla,
  Re as n
};
