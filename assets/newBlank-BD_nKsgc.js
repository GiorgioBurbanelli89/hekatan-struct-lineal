import { a as Ue } from "./analyze-DgLgRmKg.js";
import { d as Ze, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { A as He, t as Ie, B as Xe, F as qe, u as Ge, M as Je, e as Ke, D as Ye } from "./theme-C-zoknmI.js";
let sn, an;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const N = /* @__PURE__ */ new Set();
  let j = -1, Ce = false, L = true;
  function pe(s) {
    Ce = s;
    const e = document.getElementById("hk-ifc-objs"), r = document.getElementById("hk-ifc-tab");
    e && (e.style.transition = "transform .25s ease, opacity .25s ease", e.style.transform = s ? "translateX(-50%) translateY(130%)" : "translateX(-50%)", e.style.opacity = s ? "0" : "", e.style.pointerEvents = s ? "none" : ""), r && (r.style.display = s ? "block" : "none");
  }
  function Ae(s) {
    let e = document.getElementById("hk-ifc-objs");
    if (e || (e = document.createElement("div"), e.id = "hk-ifc-objs", e.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:120;background:rgba(16,22,30,0.96);color:#cde;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:7px 9px;font:11px system-ui,sans-serif;max-height:38vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.5);min-width:220px;", document.body.appendChild(e)), !document.getElementById("hk-ifc-tab")) {
      const d = document.createElement("button");
      d.id = "hk-ifc-tab", d.textContent = "\u{1F3DB} Objetos IFC \u27E9", d.title = "Mostrar objetos IFC", d.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:121;display:none;padding:6px 12px;border:1px solid #3a4a5f;border-radius:8px;background:rgba(30,40,55,0.96);color:#9ce;cursor:pointer;font:11px system-ui;box-shadow:0 2px 8px rgba(0,0,0,.4)", d.onclick = () => pe(false), document.body.appendChild(d);
    }
    const r = L ? "" : s.map((d, t) => {
      const x = d.color.map((u) => Math.round(u * 255)), v = Math.round(d.positions.length / 9), M = !N.has(t) && (j < 0 || j === t);
      return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
      <input type="checkbox" data-ifc-vis="${t}" ${M ? "checked" : ""}>
      <span style="width:12px;height:12px;border-radius:2px;background:rgb(${x[0]},${x[1]},${x[2]});border:1px solid #0006;display:inline-block"></span>
      <span style="flex:1">Objeto ${t + 1}</span>
      <span style="color:#8ab">${v} \u25B3</span>
      <button data-ifc-solo="${t}" title="Aislar" style="background:#243;color:#9fd;border:1px solid #365;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px">solo</button>
    </div>`;
    }).join(""), i = (d, t, x) => `<button id="${d}" title="${x}" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:11px;padding:1px 6px;margin-left:3px">${t}</button>`;
    e.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;${L ? "" : "margin-bottom:4px"}">
       <b style="color:#9ce">\u{1F3DB} Objetos IFC (${s.length})</b>
       <span style="white-space:nowrap">${L ? "" : '<button id="hk-ifc-all" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 6px">ver todos</button>'}${i("hk-ifc-min", L ? "\u25A2" : "\u2581", "Minimizar")}${i("hk-ifc-slide", "\u27E8", "Ocultar (corredizo)")}</span>
     </div>${r}`;
    const c = () => {
      var _a;
      try {
        (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
      } catch {
      }
    };
    e.querySelector("#hk-ifc-min").onclick = () => {
      L = !L, Ae(s);
    }, e.querySelector("#hk-ifc-slide").onclick = () => pe(true), e.querySelectorAll("[data-ifc-vis]").forEach((d) => {
      d.onchange = () => {
        const t = +d.dataset.ifcVis;
        j = -1, d.checked ? N.delete(t) : N.add(t), c();
      };
    }), e.querySelectorAll("[data-ifc-solo]").forEach((d) => {
      d.onclick = () => {
        const t = +d.dataset.ifcSolo;
        j = j === t ? -1 : t, N.clear(), c();
      };
    });
    const w = e.querySelector("#hk-ifc-all");
    w && (w.onclick = () => {
      N.clear(), j = -1, c();
    }), pe(Ce);
  }
  function Qe() {
    var _a, _b;
    (_a = document.getElementById("hk-ifc-objs")) == null ? void 0 : _a.remove(), (_b = document.getElementById("hk-ifc-tab")) == null ? void 0 : _b.remove();
  }
  function je(s, e) {
    const r = [
      0,
      1,
      2
    ].reduce((b, f) => e[1][f] - e[0][f] > e[1][b] - e[0][b] ? f : b, 0), i = [];
    for (const b of s) {
      const f = b.positions;
      for (let g = 0; g < f.length; g += 9) i.push((f[g + r] + f[g + 3 + r] + f[g + 6 + r]) / 3);
    }
    if (i.length < 2) return e;
    i.sort((b, f) => b - f);
    let c = 0, w = 0;
    for (let b = 1; b < i.length; b++) {
      const f = i[b] - i[b - 1];
      f > w && (w = f, c = b);
    }
    const d = i[i.length - 1] - i[0];
    if (w < d * 0.15) return e;
    const t = (i[c] + i[c - 1]) / 2, x = c, M = i.length - c >= x, u = [
      1e30,
      1e30,
      1e30
    ], D = [
      -1e30,
      -1e30,
      -1e30
    ];
    for (const b of s) {
      const f = b.positions;
      for (let g = 0; g < f.length; g += 9) {
        const C = (f[g + r] + f[g + 3 + r] + f[g + 6 + r]) / 3;
        if (!(M && C < t || !M && C >= t)) for (let y = 0; y < 3; y++) for (const V of [
          0,
          3,
          6
        ]) {
          const F = f[g + V + y];
          F < u[y] && (u[y] = F), F > D[y] && (D[y] = F);
        }
      }
    }
    return [
      u,
      D
    ];
  }
  function De(s, e = false) {
    var _a;
    const r = window.__hekatanIfcMesh;
    if (!r || !((_a = r.grupos) == null ? void 0 : _a.length)) return [];
    const i = Math.max(0.1, Math.min(1, s)), c = [];
    c.push(new He(16777215, 0.75));
    const w = new Ie(16777215, 0.7);
    w.position.set(1, 1, 2);
    const d = new Ie(16777215, 0.4);
    return d.position.set(-1, -0.5, 1), c.push(w, d), r.grupos.forEach((t, x) => {
      if (!t.positions.length || !e && N.has(x) || !e && j >= 0 && x !== j) return;
      const v = new Xe();
      v.setAttribute("position", new qe(t.positions, 3)), v.computeVertexNormals();
      const M = new Ge(t.color[0], t.color[1], t.color[2]), u = new Je(v, new Ke({
        color: M,
        emissive: M.clone().multiplyScalar(0.25),
        roughness: 0.9,
        metalness: 0,
        transparent: i < 1,
        opacity: i,
        side: Ye
      }));
      e && (u.userData.refIfc = true, u.name = "ref-ifc-" + x), c.push(u);
    }), c;
  }
  function We() {
    var _a;
    const s = window.__hekatanIfcMesh;
    return !s || !((_a = s.grupos) == null ? void 0 : _a.length) || !s.bbox ? null : je(s.grupos, s.bbox);
  }
  let he, me, ye, Se, ge, we, _e, ze, _;
  sn = {
    id: "ifc-viewer",
    name: "Ver IFC (arquitectura)",
    category: "\u{1F9EA} Utilidades",
    defaultShellResult: "none",
    availableShellResults: [],
    params: {
      opacidad: {
        default: 100,
        min: 10,
        max: 100,
        step: 5,
        label: "Opacidad (%)",
        folder: "\u{1F3DB} IFC"
      },
      caras: {
        default: 1,
        boolean: true,
        label: "Mostrar caras",
        folder: "\u{1F3DB} IFC"
      }
    },
    computedLabels() {
      var _a;
      const s = window.__hekatanIfcMesh;
      if (!s) return {
        IFC: "ninguno \u2014 usa \u{1F4E5} Importar IFC"
      };
      const e = s.estructura, r = {
        Archivo: String(s.archivo ?? "ifc"),
        "Objetos (colores)": String(((_a = s.grupos) == null ? void 0 : _a.length) ?? 0),
        Tri\u00E1ngulos: String(s.nTri ?? 0),
        "Tama\xF1o (m)": s.bbox ? s.bbox[1].map((i, c) => (i - s.bbox[0][c]).toFixed(1)).join(" \xD7 ") : "\u2014"
      };
      if (e) {
        const i = e.columnas + e.vigas + e.miembros + e.losas + e.muros + e.zapatas;
        r["Elementos estructurales"] = i > 0 ? `col ${e.columnas} \xB7 vig ${e.vigas} \xB7 losa ${e.losas} \xB7 muro ${e.muros}` : `0 (solo mallas${e.proxies ? ` \u2014 ${e.proxies} objetos SketchUp` : ""})`, r["Convertible a estructura"] = i > 0 ? "s\xED" : "no (IFC de arquitectura)";
      }
      return r;
    },
    build(s, e) {
      var _a, _b;
      const r = window.__hekatanIfcMesh;
      if (!r || !((_a = r.grupos) == null ? void 0 : _a.length)) {
        e.nodes.val = [], e.elements.val = [], e.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, e.elementInputs.val = {
          elasticities: /* @__PURE__ */ new Map(),
          shearModuli: /* @__PURE__ */ new Map(),
          areas: /* @__PURE__ */ new Map(),
          momentsOfInertiaY: /* @__PURE__ */ new Map(),
          momentsOfInertiaZ: /* @__PURE__ */ new Map(),
          torsionalConstants: /* @__PURE__ */ new Map(),
          densities: /* @__PURE__ */ new Map(),
          poissonsRatios: /* @__PURE__ */ new Map()
        }, e.objects3D.val = [], Qe(), console.log("[IFC] Sin modelo. Usa '\u{1F4E5} Importar IFC'.");
        return;
      }
      const i = De((s.opacidad ?? 100) / 100);
      e.objects3D.val = s.caras ? i : i.filter((d) => !d.isMesh);
      try {
        (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, r.bbox[0], r.bbox[1]);
      } catch {
      }
      Ae(r.grupos);
      const [c, w] = je(r.grupos, r.bbox);
      e.nodes.val = [
        [
          c[0],
          c[1],
          c[2]
        ],
        [
          w[0],
          w[1],
          w[2]
        ]
      ], e.elements.val = [], e.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map()
      }, e.elementInputs.val = {
        elasticities: /* @__PURE__ */ new Map(),
        shearModuli: /* @__PURE__ */ new Map(),
        areas: /* @__PURE__ */ new Map(),
        momentsOfInertiaY: /* @__PURE__ */ new Map(),
        momentsOfInertiaZ: /* @__PURE__ */ new Map(),
        torsionalConstants: /* @__PURE__ */ new Map(),
        densities: /* @__PURE__ */ new Map(),
        poissonsRatios: /* @__PURE__ */ new Map()
      }, console.log(`[IFC] ${r.grupos.length} objetos, ${r.nTri ?? "?"} tri\xE1ngulos.`);
    }
  };
  he = 25e6;
  me = 0.2;
  ye = he / (2 * (1 + me));
  Se = 24;
  ge = 2e8;
  we = 0.3;
  _e = ge / (2 * (1 + we));
  ze = 78;
  _ = (s, e, r, i, c, w) => ({
    default: r,
    min: i,
    max: c,
    step: w,
    label: e,
    folder: s
  });
  function en(s, e) {
    const r = s[e[0]], i = s[e[1]], c = s[e[2]], w = s[e[3]], d = (t, x, v) => {
      const M = [
        x[0] - t[0],
        x[1] - t[1],
        x[2] - t[2]
      ], u = [
        v[0] - t[0],
        v[1] - t[1],
        v[2] - t[2]
      ];
      return 0.5 * Math.hypot(M[1] * u[2] - M[2] * u[1], M[2] * u[0] - M[0] * u[2], M[0] * u[1] - M[1] * u[0]);
    };
    return d(r, i, c) + d(r, c, w);
  }
  let z, $e;
  z = (s, e, r, i) => ({
    default: r,
    label: e,
    folder: s,
    options: i
  });
  $e = (s) => {
    var _a, _b;
    if (Math.round(s.refIfc ?? 1) !== 1) return [];
    const e = Math.round(s.refModo ?? 0), r = e === 1 ? 0.12 : e === 2 ? 0.04 : (s.refOpac ?? 35) / 100, i = De(r, true);
    if (e === 2) {
      window.__hekatanRefIfcBordes = true;
      try {
        (_a = window.__hekatanRefIfcBordesRefrescar) == null ? void 0 : _a.call(window);
      } catch {
      }
    }
    const c = window.__hekatanIfcMesh;
    if (i.length && (c == null ? void 0 : c.bbox)) try {
      (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, c.bbox[0], c.bbox[1]);
    } catch {
    }
    return i;
  };
  an = {
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
      mode: z("Modo", "Espacio de trabajo", 1, {
        "2D (plano XZ \u2014 elevaci\xF3n)": 0,
        "3D (espacial)": 1
      }),
      mat: z("Secci\xF3n frames", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      bCol: _("Secci\xF3n frames", "b columna (m)", 0.4, 0.1, 1, 0.05),
      hCol: _("Secci\xF3n frames", "h columna (m)", 0.4, 0.1, 1, 0.05),
      bViga: _("Secci\xF3n frames", "b viga (m)", 0.3, 0.1, 0.8, 0.05),
      hViga: _("Secci\xF3n frames", "h viga (m)", 0.5, 0.1, 1, 0.05),
      tShell: _("Secci\xF3n shells", "Espesor shell (m)", 0.2, 0.05, 1, 0.01),
      matShell: z("Secci\xF3n shells", "Material shell", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      formaPlaca: z("Secci\xF3n shells", "Formulaci\xF3n placa", 0, {
        "Shell-Thick (Mindlin)": 0,
        "Shell-Thin (Kirchhoff)": 1,
        Membrana: 2
      }),
      mallaZapata: _("\u{1F9F0} Zapata / Suelo", "Malla del \xE1rea (nx = ny)", 1, 1, 12, 1),
      ksSuelo: _("\u{1F9F0} Zapata / Suelo", "Suelo ks (tonf/m\xB3, 0 = off)", 0, 0, 8e3, 50),
      apoyo: z("Apoyos", "Tipo apoyo en Z m\xEDnimo", 3, {
        "Empotrado (6 DOFs)": 0,
        "Articulado (3 trans.)": 1,
        "R\xF3tula (Ux,Uz, libre Uy/R)": 2,
        "Sin apoyo autom\xE1tico": 3
      }),
      aplicarCargas: z("Cargas", "Aplicar cargas auto", 0, {
        S\u00ED: 1,
        No: 0
      }),
      patronCargas: z("Cargas", "Pertenecen al patron", 0, {
        Dead: 0,
        Live: 1
      }),
      Fz: _("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
      Fx: _("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),
      autoSolve: z("Solver", "Auto-resolver", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refIfc: z("\u{1F3DB} Referencia IFC", "Mostrar IFC de fondo", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refOpac: _("\u{1F3DB} Referencia IFC", "Opacidad (%)", 35, 10, 100, 5),
      refModo: z("\u{1F3DB} Referencia IFC", "Ver como", 0, {
        "S\xF3lido tenue": 0,
        "Transparente (ver por dentro)": 1,
        "Solo bordes (l\xEDneas)": 2
      })
    },
    build(s, e) {
      var _a, _b, _c;
      const r = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], i = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], c = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], w = new Set(c);
      if (!r.length) {
        const n = Math.round(s.refIfc ?? 1) === 1 ? We() : null;
        e.nodes.val = n ? [
          n[0],
          n[1]
        ] : [], e.elements.val = [], e.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, e.elementInputs.val = {}, e.objects3D.val = $e(s), console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const d = Math.round(s.mode ?? 1) === 0, t = r.map((n) => d ? [
        n[0],
        0,
        n[2]
      ] : [
        n[0],
        n[1],
        n[2]
      ]), x = 1e-4, v = new Int32Array(t.length);
      {
        const n = /* @__PURE__ */ new Map();
        for (let a = 0; a < t.length; a++) {
          const o = t[a].map((p) => Math.round(p / x)).join(","), l = n.get(o);
          l === void 0 ? (n.set(o, a), v[a] = a) : v[a] = l;
        }
      }
      const M = (n) => n >= 0 && n < v.length ? v[n] : n, u = [], D = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), g = Math.max(1, Math.round(s.mallaZapata ?? 1)), C = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set(), V = 1e-3, F = (n) => `${Math.round(n[0] / V)},${Math.round(n[1] / V)},${Math.round(n[2] / V)}`, ae = /* @__PURE__ */ new Map();
      for (let n = 0; n < t.length; n++) ae.set(F(t[n]), M(n));
      const J = /* @__PURE__ */ new Map();
      for (let n = 0; n < i.length; n++) {
        const a = i[n];
        if (w.has(n)) {
          const o = (a.length === 5 ? a.slice(0, 4) : a.slice(0, Math.min(4, a.length))).map(M);
          if (o.length !== 4 || o.some((l) => t[l] === void 0)) continue;
          if (g <= 1) {
            const l = u.length;
            u.push(o), f.add(l), C.add(l);
            for (const p of o) y.add(p);
          } else {
            const [l, p, k, I] = o, A = t[l], E = t[p], B = t[k], X = t[I], R = (h, m) => [
              (1 - h) * (1 - m) * A[0] + h * (1 - m) * E[0] + h * m * B[0] + (1 - h) * m * X[0],
              (1 - h) * (1 - m) * A[1] + h * (1 - m) * E[1] + h * m * B[1] + (1 - h) * m * X[1],
              (1 - h) * (1 - m) * A[2] + h * (1 - m) * E[2] + h * m * B[2] + (1 - h) * m * X[2]
            ], q = [];
            for (let h = 0; h <= g; h++) {
              const m = [];
              for (let S = 0; S <= g; S++) if (h === 0 && S === 0) m.push(l);
              else if (h === g && S === 0) m.push(p);
              else if (h === g && S === g) m.push(k);
              else if (h === 0 && S === g) m.push(I);
              else {
                const G = R(h / g, S / g), te = F(G);
                let se = ae.get(te);
                se === void 0 && (se = t.length, t.push(G), ae.set(te, se)), m.push(se);
              }
              q.push(m);
            }
            for (let h = 0; h < g; h++) for (let m = 0; m < g; m++) {
              const S = [
                q[h][m],
                q[h + 1][m],
                q[h + 1][m + 1],
                q[h][m + 1]
              ], G = u.length;
              u.push(S), f.add(G), C.add(G);
              for (const te of S) y.add(te);
            }
          }
        } else for (let o = 0; o < a.length - 1; o++) {
          const l = M(a[o]), p = M(a[o + 1]);
          if (l === p || t[l] === void 0 || t[p] === void 0) continue;
          const k = u.length;
          u.push([
            l,
            p
          ]), J.set(`${n}:${o}`, k);
          const I = t[p][0] - t[l][0], A = t[p][1] - t[l][1], E = t[p][2] - t[l][2];
          Math.abs(E) > Math.max(Math.abs(I), Math.abs(A)) ? D.add(k) : b.add(k);
        }
      }
      const K = Math.round(s.mat ?? 0), Fe = K === 0 ? he : ge, Oe = K === 0 ? ye : _e, Pe = K === 0 ? me : we, Ee = K === 0 ? Se : ze, Y = Math.round(s.matShell ?? 0), Re = Y === 0 ? he : ge, Be = Y === 0 ? ye : _e, Le = Y === 0 ? me : we, Ne = Y === 0 ? Se : ze, Q = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map();
      for (let n = 0; n < u.length; n++) if (f.has(n)) Q.set(n, Re), W.set(n, Be), ee.set(n, Ne), ne.set(n, Le), Me.set(n, s.tShell ?? 0.2), be.set(n, Math.round(s.formaPlaca ?? 0));
      else {
        const a = D.has(n), o = a ? s.bCol : s.bViga, l = a ? s.hCol : s.hViga, p = o * l, k = l * Math.pow(o, 3) / 12, I = o * Math.pow(l, 3) / 12, A = 0.14 * Math.pow(Math.min(o, l), 4);
        Q.set(n, Fe), W.set(n, Oe), T.set(n, p), U.set(n, k), Z.set(n, I), H.set(n, A), ee.set(n, Ee), ne.set(n, Pe);
      }
      const le = window.__hekatanManualSections;
      if (le && le.size > 0) for (const [n, a] of le.entries()) {
        const o = J.get(n);
        o === void 0 || f.has(o) || (a.A != null && T.set(o, a.A), a.Iz != null && U.set(o, a.Iz), a.Iy != null && Z.set(o, a.Iy), a.J != null && H.set(o, a.J));
      }
      const xe = window.__hekatanMaterialDB, re = window.__hekatanManualMaterial;
      if (re && re.size > 0 && xe) for (const [n, a] of re.entries()) {
        const o = J.get(n);
        if (o === void 0 || f.has(o)) continue;
        const l = xe[a];
        if (!l) continue;
        Q.set(o, l.E);
        const p = l.E / (2 * (1 + l.nu));
        W.set(o, p), ee.set(o, l.rho), ne.set(o, l.nu);
      }
      const ie = window.__hekatanManualModifiers;
      if (ie && ie.size > 0) for (const [n, a] of ie.entries()) {
        const o = J.get(n);
        if (o === void 0 || f.has(o)) continue;
        const l = T.get(o);
        l != null && T.set(o, l * a.A);
        const p = U.get(o);
        p != null && U.set(o, p * a.Iz);
        const k = Z.get(o);
        k != null && Z.set(o, k * a.Iy);
        const I = H.get(o);
        I != null && H.set(o, I * a.J);
      }
      const ce = Math.round(s.apoyo ?? 0), O = /* @__PURE__ */ new Map();
      if (t.length > 0 && ce !== 3) {
        const n = Math.min(...t.map((o) => o[2])), a = ce === 0 ? [
          true,
          true,
          true,
          true,
          true,
          true
        ] : ce === 1 ? [
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
        for (let o = 0; o < t.length; o++) Math.abs(t[o][2] - n) < 1e-6 && O.set(o, [
          ...a
        ]);
      }
      const de = window.__hekatanManualSupports;
      if (de && de.size > 0) for (const [n, a] of de.entries()) n >= 0 && n < t.length && O.set(M(n), [
        ...a
      ]);
      const Ve = Math.round(s.patronCargas ?? 0) === 1 ? "Live" : "Dead", Te = window.__hekatanActiveCase, ve = (() => {
        var _a2;
        const a = (((_a2 = e.loadCases) == null ? void 0 : _a2.val) ?? []).find((o) => o.name === Te);
        return a ? (a.patterns ?? []).map((o) => o.pattern) : [];
      })(), ke = ve.length === 0 || ve.includes(Ve), P = /* @__PURE__ */ new Map();
      if (ke && Math.round(s.aplicarCargas ?? 1) === 1 && t.length > 0) {
        const n = Math.max(...t.map((l) => l[2])), a = s.Fx ?? 0, o = s.Fz ?? -10;
        for (let l = 0; l < t.length; l++) Math.abs(t[l][2] - n) < 1e-6 && P.set(l, [
          a,
          0,
          o,
          0,
          0,
          0
        ]);
      }
      const ue = window.__hekatanManualLoads;
      if (ke && ue && ue.size > 0) for (const [n, a] of ue.entries()) n >= 0 && n < t.length && P.set(M(n), [
        ...a
      ]);
      if (new URLSearchParams(window.location.search).get("heks") || new URLSearchParams(window.location.search).get("m")) {
        e.nodes.val = [], e.elements.val = [], e.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        };
        return;
      }
      e.nodes.val = t, e.elements.val = u, e.nodeInputs.val = {
        supports: O,
        loads: P
      }, e.elementInputs.val = {
        elasticities: Q,
        shearModuli: W,
        areas: T,
        momentsOfInertiaY: U,
        momentsOfInertiaZ: Z,
        torsionalConstants: H,
        densities: ee,
        poissonsRatios: ne,
        thicknesses: Me,
        plateFormulations: be
      }, e.objects3D.val = $e(s);
      const $ = [], fe = window.__hekatanManualSprings;
      if (fe && fe.size > 0) {
        for (const [n, a] of fe.entries()) if (!(n < 0 || n >= t.length)) for (let o = 0; o < 6; o++) a[o] !== 0 && $.push({
          node: M(n),
          dof: o,
          k: a[o]
        });
      }
      const oe = (s.ksSuelo ?? 0) * 9.80665;
      if (oe > 0 && y.size > 0) {
        const n = /* @__PURE__ */ new Map();
        for (const a of C) {
          const o = u[a], l = en(t, o);
          for (const p of o) n.set(p, (n.get(p) ?? 0) + l / 4);
        }
        for (const [a, o] of n) {
          const l = oe * o;
          $.push({
            node: a,
            dof: 2,
            k: l
          }), $.push({
            node: a,
            dof: 0,
            k: l * 0.5
          }), $.push({
            node: a,
            dof: 1,
            k: l * 0.5
          });
        }
      }
      if (Math.round(s.autoSolve ?? 1) === 1 && t.length > 0 && u.length > 0 && (O.size > 0 || $.length > 0) && P.size > 0) try {
        if (e.deformOutputs.val = Ze(t, u, {
          supports: O,
          loads: P
        }, e.elementInputs.val, $.length > 0 ? $ : void 0), e.analyzeOutputs.val = Ue(t, u, e.elementInputs.val, e.deformOutputs.rawVal), oe > 0 && C.size > 0) try {
          const a = e.deformOutputs.rawVal.deformations, o = e.analyzeOutputs.rawVal ?? {}, l = /* @__PURE__ */ new Map();
          let p = 0, k = 0;
          for (const I of C) {
            const E = u[I].map((B) => {
              var _a2;
              const X = ((_a2 = a.get(B)) == null ? void 0 : _a2[2]) ?? 0, R = oe * X;
              return R < p && (p = R), R > k && (k = R), R;
            });
            l.set(I, E);
          }
          o.pressure = l, o.colorMapRanges = {
            ...o.colorMapRanges ?? {},
            pressure: [
              k,
              p
            ]
          }, e.analyzeOutputs.val = o;
        } catch (a) {
          console.warn("[NewBlank] presi\xF3n:", (a == null ? void 0 : a.message) ?? a);
        }
        const n = /* @__PURE__ */ new Set();
        for (const a of u) for (const o of a) n.add(o);
        console.log(`[NewBlank] Solve OK \u2014 ${n.size} nudos (de ${t.length} puntos), ${u.length} elementos, ${O.size} apoyos, ${P.size} cargas, ${$.length} springs`);
      } catch (n) {
        console.warn(`[NewBlank] Solver fall\xF3: ${n.message}`);
      }
      else console.log(`[NewBlank] mode=${d ? "2D" : "3D"} | nodes=${t.length} elem=${u.length} cols=${D.size} vigas=${b.size} shells=${f.size} apoyos=${O.size} cargas=${P.size} springs=${$.length}`);
    },
    computedLabels(s, e) {
      const r = {}, i = e.nodes.val.length;
      e.elements.val.length;
      let c = 0, w = 0;
      for (const d of e.elements.val) d.length === 4 ? w++ : c++;
      return r.Stats = `${i} nodos \xB7 ${c} frames \xB7 ${w} shells`, i === 0 && (r["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), r;
    }
  };
});
export {
  __tla,
  sn as i,
  an as n
};
