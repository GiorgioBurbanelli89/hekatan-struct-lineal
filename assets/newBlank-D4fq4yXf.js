import { A as po, t as Ue, B as Ae, F as ho, u as mo, M as go, e as wo, D as Mo, b as bo, V as ue, L as ko, d as xo } from "./theme-C-zoknmI.js";
import { a as yo } from "./analyze-DgLgRmKg.js";
import { d as vo, __tla as __tla_0 } from "./didacticCpp-reRUqpUx.js";
let Do, Ao;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const ee = /* @__PURE__ */ new Set();
  let T = -1, Ye = false, Q = true;
  function Ce(s) {
    Ye = s;
    const n = document.getElementById("hk-ifc-objs"), i = document.getElementById("hk-ifc-tab");
    n && (n.style.transition = "transform .25s ease, opacity .25s ease", n.style.transform = s ? "translateX(-50%) translateY(130%)" : "translateX(-50%)", n.style.opacity = s ? "0" : "", n.style.pointerEvents = s ? "none" : ""), i && (i.style.display = s ? "block" : "none");
  }
  function Ge(s) {
    let n = document.getElementById("hk-ifc-objs");
    if (n || (n = document.createElement("div"), n.id = "hk-ifc-objs", n.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:120;background:rgba(16,22,30,0.96);color:#cde;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:7px 9px;font:11px system-ui,sans-serif;max-height:38vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.5);min-width:220px;", document.body.appendChild(n)), !document.getElementById("hk-ifc-tab")) {
      const h = document.createElement("button");
      h.id = "hk-ifc-tab", h.textContent = "\u{1F3DB} Objetos IFC \u27E9", h.title = "Mostrar objetos IFC", h.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:121;display:none;padding:6px 12px;border:1px solid #3a4a5f;border-radius:8px;background:rgba(30,40,55,0.96);color:#9ce;cursor:pointer;font:11px system-ui;box-shadow:0 2px 8px rgba(0,0,0,.4)", h.onclick = () => Ce(false), document.body.appendChild(h);
    }
    const i = Q ? "" : s.map((h, c) => {
      const S = h.color.map((f) => Math.round(f * 255)), _ = Math.round(h.positions.length / 9), w = !ee.has(c) && (T < 0 || T === c);
      return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
      <input type="checkbox" data-ifc-vis="${c}" ${w ? "checked" : ""}>
      <span style="width:12px;height:12px;border-radius:2px;background:rgb(${S[0]},${S[1]},${S[2]});border:1px solid #0006;display:inline-block"></span>
      <span style="flex:1">Objeto ${c + 1}</span>
      <span style="color:#8ab">${_} \u25B3</span>
      <button data-ifc-solo="${c}" title="Aislar" style="background:#243;color:#9fd;border:1px solid #365;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px">solo</button>
    </div>`;
    }).join(""), d = (h, c, S) => `<button id="${h}" title="${S}" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:11px;padding:1px 6px;margin-left:3px">${c}</button>`;
    n.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;${Q ? "" : "margin-bottom:4px"}">
       <b style="color:#9ce">\u{1F3DB} Objetos IFC (${s.length})</b>
       <span style="white-space:nowrap">${Q ? "" : '<button id="hk-ifc-all" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 6px">ver todos</button>'}${d("hk-ifc-min", Q ? "\u25A2" : "\u2581", "Minimizar")}${d("hk-ifc-slide", "\u27E8", "Ocultar (corredizo)")}</span>
     </div>${i}`;
    const u = () => {
      var _a;
      try {
        (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
      } catch {
      }
    };
    n.querySelector("#hk-ifc-min").onclick = () => {
      Q = !Q, Ge(s);
    }, n.querySelector("#hk-ifc-slide").onclick = () => Ce(true), n.querySelectorAll("[data-ifc-vis]").forEach((h) => {
      h.onchange = () => {
        const c = +h.dataset.ifcVis;
        T = -1, h.checked ? ee.delete(c) : ee.add(c), u();
      };
    }), n.querySelectorAll("[data-ifc-solo]").forEach((h) => {
      h.onclick = () => {
        const c = +h.dataset.ifcSolo;
        T = T === c ? -1 : c, ee.clear(), u();
      };
    });
    const k = n.querySelector("#hk-ifc-all");
    k && (k.onclick = () => {
      ee.clear(), T = -1, u();
    }), Ce(Ye);
  }
  function So() {
    var _a, _b;
    (_a = document.getElementById("hk-ifc-objs")) == null ? void 0 : _a.remove(), (_b = document.getElementById("hk-ifc-tab")) == null ? void 0 : _b.remove();
  }
  function Je(s, n) {
    const i = [
      0,
      1,
      2
    ].reduce((v, g) => n[1][g] - n[0][g] > n[1][v] - n[0][v] ? g : v, 0), d = [];
    for (const v of s) {
      const g = v.positions;
      for (let M = 0; M < g.length; M += 9) d.push((g[M + i] + g[M + 3 + i] + g[M + 6 + i]) / 3);
    }
    if (d.length < 2) return n;
    d.sort((v, g) => v - g);
    let u = 0, k = 0;
    for (let v = 1; v < d.length; v++) {
      const g = d[v] - d[v - 1];
      g > k && (k = g, u = v);
    }
    const h = d[d.length - 1] - d[0];
    if (k < h * 0.15) return n;
    const c = (d[u] + d[u - 1]) / 2, S = u, w = d.length - u >= S, f = [
      1e30,
      1e30,
      1e30
    ], N = [
      -1e30,
      -1e30,
      -1e30
    ];
    for (const v of s) {
      const g = v.positions;
      for (let M = 0; M < g.length; M += 9) {
        const O = (g[M + i] + g[M + 3 + i] + g[M + 6 + i]) / 3;
        if (!(w && O < c || !w && O >= c)) for (let A = 0; A < 3; A++) for (const oe of [
          0,
          3,
          6
        ]) {
          const V = g[M + oe + A];
          V < f[A] && (f[A] = V), V > N[A] && (N[A] = V);
        }
      }
    }
    return [
      f,
      N
    ];
  }
  function qe(s, n = false) {
    var _a;
    const i = window.__hekatanIfcMesh;
    if (!i || !((_a = i.grupos) == null ? void 0 : _a.length)) return [];
    const d = Math.max(0.1, Math.min(1, s)), u = [];
    u.push(new po(16777215, 0.75));
    const k = new Ue(16777215, 0.7);
    k.position.set(1, 1, 2);
    const h = new Ue(16777215, 0.4);
    return h.position.set(-1, -0.5, 1), u.push(k, h), i.grupos.forEach((c, S) => {
      if (!c.positions.length || !n && ee.has(S) || !n && T >= 0 && S !== T) return;
      const _ = new Ae();
      _.setAttribute("position", new ho(c.positions, 3)), _.computeVertexNormals();
      const w = new mo(c.color[0], c.color[1], c.color[2]), f = new go(_, new wo({
        color: w,
        emissive: w.clone().multiplyScalar(0.25),
        roughness: 0.9,
        metalness: 0,
        transparent: d < 1,
        opacity: d,
        side: Mo
      }));
      n && (f.userData.refIfc = true, f.name = "ref-ifc-" + S), u.push(f);
    }), u;
  }
  function Io() {
    var _a;
    const s = window.__hekatanIfcMesh;
    return !s || !((_a = s.grupos) == null ? void 0 : _a.length) || !s.bbox ? null : Je(s.grupos, s.bbox);
  }
  let je, Ee, Ze, De, Fe, Pe, We, Xe, $;
  Do = {
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
      const n = s.estructura, i = {
        Archivo: String(s.archivo ?? "ifc"),
        "Objetos (colores)": String(((_a = s.grupos) == null ? void 0 : _a.length) ?? 0),
        Tri\u00E1ngulos: String(s.nTri ?? 0),
        "Tama\xF1o (m)": s.bbox ? s.bbox[1].map((d, u) => (d - s.bbox[0][u]).toFixed(1)).join(" \xD7 ") : "\u2014"
      };
      if (n) {
        const d = n.columnas + n.vigas + n.miembros + n.losas + n.muros + n.zapatas;
        i["Elementos estructurales"] = d > 0 ? `col ${n.columnas} \xB7 vig ${n.vigas} \xB7 losa ${n.losas} \xB7 muro ${n.muros}` : `0 (solo mallas${n.proxies ? ` \u2014 ${n.proxies} objetos SketchUp` : ""})`, i["Convertible a estructura"] = d > 0 ? "s\xED" : "no (IFC de arquitectura)";
      }
      return i;
    },
    build(s, n) {
      var _a, _b;
      const i = window.__hekatanIfcMesh;
      if (!i || !((_a = i.grupos) == null ? void 0 : _a.length)) {
        n.nodes.val = [], n.elements.val = [], n.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, n.elementInputs.val = {
          elasticities: /* @__PURE__ */ new Map(),
          shearModuli: /* @__PURE__ */ new Map(),
          areas: /* @__PURE__ */ new Map(),
          momentsOfInertiaY: /* @__PURE__ */ new Map(),
          momentsOfInertiaZ: /* @__PURE__ */ new Map(),
          torsionalConstants: /* @__PURE__ */ new Map(),
          densities: /* @__PURE__ */ new Map(),
          poissonsRatios: /* @__PURE__ */ new Map()
        }, n.objects3D.val = [], So(), console.log("[IFC] Sin modelo. Usa '\u{1F4E5} Importar IFC'.");
        return;
      }
      const d = qe((s.opacidad ?? 100) / 100);
      n.objects3D.val = s.caras ? d : d.filter((h) => !h.isMesh);
      try {
        (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, i.bbox[0], i.bbox[1]);
      } catch {
      }
      Ge(i.grupos);
      const [u, k] = Je(i.grupos, i.bbox);
      n.nodes.val = [
        [
          u[0],
          u[1],
          u[2]
        ],
        [
          k[0],
          k[1],
          k[2]
        ]
      ], n.elements.val = [], n.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map()
      }, n.elementInputs.val = {
        elasticities: /* @__PURE__ */ new Map(),
        shearModuli: /* @__PURE__ */ new Map(),
        areas: /* @__PURE__ */ new Map(),
        momentsOfInertiaY: /* @__PURE__ */ new Map(),
        momentsOfInertiaZ: /* @__PURE__ */ new Map(),
        torsionalConstants: /* @__PURE__ */ new Map(),
        densities: /* @__PURE__ */ new Map(),
        poissonsRatios: /* @__PURE__ */ new Map()
      }, console.log(`[IFC] ${i.grupos.length} objetos, ${i.nTri ?? "?"} tri\xE1ngulos.`);
    }
  };
  je = 25e6;
  Ee = 0.2;
  Ze = je / (2 * (1 + Ee));
  De = 24;
  Fe = 2e8;
  Pe = 0.3;
  We = Fe / (2 * (1 + Pe));
  Xe = 78;
  $ = (s, n, i, d, u, k) => ({
    default: i,
    min: d,
    max: u,
    step: k,
    label: n,
    folder: s
  });
  function $o(s, n) {
    const i = s[n[0]], d = s[n[1]], u = s[n[2]], k = s[n[3]], h = (c, S, _) => {
      const w = [
        S[0] - c[0],
        S[1] - c[1],
        S[2] - c[2]
      ], f = [
        _[0] - c[0],
        _[1] - c[1],
        _[2] - c[2]
      ];
      return 0.5 * Math.hypot(w[1] * f[2] - w[2] * f[1], w[2] * f[0] - w[0] * f[2], w[0] * f[1] - w[1] * f[0]);
    };
    return h(i, d, u) + h(i, u, k);
  }
  let E, Ke;
  E = (s, n, i, d) => ({
    default: i,
    label: n,
    folder: s,
    options: d
  });
  Ke = (s) => {
    var _a, _b;
    if (Math.round(s.refIfc ?? 1) !== 1) return [];
    const n = Math.round(s.refModo ?? 0), i = n === 1 ? 0.12 : n === 2 ? 0.04 : (s.refOpac ?? 35) / 100, d = qe(i, true);
    if (n === 2) {
      window.__hekatanRefIfcBordes = true;
      try {
        (_a = window.__hekatanRefIfcBordesRefrescar) == null ? void 0 : _a.call(window);
      } catch {
      }
    }
    const u = window.__hekatanIfcMesh;
    if (d.length && (u == null ? void 0 : u.bbox)) try {
      (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, u.bbox[0], u.bbox[1]);
    } catch {
    }
    return d;
  };
  Ao = {
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
      mode: E("Modo", "Espacio de trabajo", 1, {
        "2D (plano XZ \u2014 elevaci\xF3n)": 0,
        "3D (espacial)": 1
      }),
      mat: E("Secci\xF3n frames", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      bCol: $("Secci\xF3n frames", "b columna (m)", 0.4, 0.1, 1, 0.05),
      hCol: $("Secci\xF3n frames", "h columna (m)", 0.4, 0.1, 1, 0.05),
      bViga: $("Secci\xF3n frames", "b viga (m)", 0.3, 0.1, 0.8, 0.05),
      hViga: $("Secci\xF3n frames", "h viga (m)", 0.5, 0.1, 1, 0.05),
      tShell: $("Secci\xF3n shells", "Espesor shell (m)", 0.2, 0.05, 1, 0.01),
      matShell: E("Secci\xF3n shells", "Material shell", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      formaPlaca: E("Secci\xF3n shells", "Formulaci\xF3n placa", 0, {
        "Shell-Thick (Mindlin)": 0,
        "Shell-Thin (Kirchhoff)": 1,
        Membrana: 2,
        "Deck (losa colaborante, como ETABS)": 3
      }),
      deckTc: $("\u{1F9F1} Deck (ETABS)", "Slab Depth tc (m)", 0.065, 0.03, 0.25, 5e-3),
      deckHr: $("\u{1F9F1} Deck (ETABS)", "Rib Depth hr (m)", 0.055, 0.02, 0.2, 5e-3),
      deckWrt: $("\u{1F9F1} Deck (ETABS)", "Rib Width Top wrt (m)", 0.15, 0.02, 0.4, 5e-3),
      deckWrb: $("\u{1F9F1} Deck (ETABS)", "Rib Width Bottom wrb (m)", 0.1, 0.02, 0.4, 5e-3),
      deckSr: $("\u{1F9F1} Deck (ETABS)", "Rib Spacing sr (m)", 0.2, 0.05, 0.6, 5e-3),
      deckW: $("\u{1F9F1} Deck (ETABS)", "Peso l\xE1mina (kN/m\xB2)", 0.11, 0, 0.5, 0.01),
      deckDir: E("\u{1F9F1} Deck (ETABS)", "Nervios paralelos a", 0, {
        X: 0,
        Y: 1
      }),
      mallaZapata: $("\u{1F9F0} Zapata / Suelo", "Malla del \xE1rea (nx = ny)", 1, 1, 12, 1),
      ksSuelo: $("\u{1F9F0} Zapata / Suelo", "Suelo ks (tonf/m\xB3, 0 = off)", 0, 0, 8e3, 50),
      apoyo: E("Apoyos", "Tipo apoyo en Z m\xEDnimo", 3, {
        "Empotrado (6 DOFs)": 0,
        "Articulado (3 trans.)": 1,
        "R\xF3tula (Ux,Uz, libre Uy/R)": 2,
        "Sin apoyo autom\xE1tico": 3
      }),
      aplicarCargas: E("Cargas", "Aplicar cargas auto", 0, {
        S\u00ED: 1,
        No: 0
      }),
      patronCargas: E("Cargas", "Pertenecen al patron", 0, {
        Dead: 0,
        Live: 1
      }),
      Fz: $("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
      Fx: $("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),
      autoSolve: E("Solver", "Auto-resolver", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refIfc: E("\u{1F3DB} Referencia IFC", "Mostrar IFC de fondo", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refOpac: $("\u{1F3DB} Referencia IFC", "Opacidad (%)", 35, 10, 100, 5),
      refModo: E("\u{1F3DB} Referencia IFC", "Ver como", 0, {
        "S\xF3lido tenue": 0,
        "Transparente (ver por dentro)": 1,
        "Solo bordes (l\xEDneas)": 2
      })
    },
    build(s, n) {
      var _a, _b, _c;
      const i = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], d = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], u = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], k = new Set(u);
      if (!i.length) {
        const o = Math.round(s.refIfc ?? 1) === 1 ? Io() : null;
        n.nodes.val = o ? [
          o[0],
          o[1]
        ] : [], n.elements.val = [], n.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, n.elementInputs.val = {}, n.objects3D.val = Ke(s), console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const h = Math.round(s.mode ?? 1) === 0, c = i.map((o) => h ? [
        o[0],
        0,
        o[2]
      ] : [
        o[0],
        o[1],
        o[2]
      ]), S = 1e-4, _ = new Int32Array(c.length);
      {
        const o = /* @__PURE__ */ new Map();
        for (let t = 0; t < c.length; t++) {
          const e = c[t].map((r) => Math.round(r / S)).join(","), a = o.get(e);
          a === void 0 ? (o.set(e, t), _[t] = t) : _[t] = a;
        }
      }
      const w = (o) => o >= 0 && o < _.length ? _[o] : o, f = [], N = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), M = Math.max(1, Math.round(s.mallaZapata ?? 1)), O = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Set(), oe = 1e-3, V = (o) => `${Math.round(o[0] / oe)},${Math.round(o[1] / oe)},${Math.round(o[2] / oe)}`, pe = /* @__PURE__ */ new Map();
      for (let o = 0; o < c.length; o++) pe.set(V(c[o]), w(o));
      const ne = /* @__PURE__ */ new Map();
      for (let o = 0; o < d.length; o++) {
        const t = d[o];
        if (k.has(o)) {
          const e = (t.length === 5 ? t.slice(0, 4) : t.slice(0, Math.min(4, t.length))).map(w);
          if (e.length !== 4 || e.some((a) => c[a] === void 0)) continue;
          if (M <= 1) {
            const a = f.length;
            f.push(e), g.add(a), O.add(a);
            for (const r of e) A.add(r);
          } else {
            const [a, r, l, b] = e, y = c[a], x = c[r], I = c[l], D = c[b], z = (p, m) => [
              (1 - p) * (1 - m) * y[0] + p * (1 - m) * x[0] + p * m * I[0] + (1 - p) * m * D[0],
              (1 - p) * (1 - m) * y[1] + p * (1 - m) * x[1] + p * m * I[1] + (1 - p) * m * D[1],
              (1 - p) * (1 - m) * y[2] + p * (1 - m) * x[2] + p * m * I[2] + (1 - p) * m * D[2]
            ], j = [];
            for (let p = 0; p <= M; p++) {
              const m = [];
              for (let C = 0; C <= M; C++) if (p === 0 && C === 0) m.push(a);
              else if (p === M && C === 0) m.push(r);
              else if (p === M && C === M) m.push(l);
              else if (p === 0 && C === M) m.push(b);
              else {
                const U = z(p / M, C / M), Z = V(U);
                let L = pe.get(Z);
                L === void 0 && (L = c.length, c.push(U), pe.set(Z, L)), m.push(L);
              }
              j.push(m);
            }
            for (let p = 0; p < M; p++) for (let m = 0; m < M; m++) {
              const C = [
                j[p][m],
                j[p + 1][m],
                j[p + 1][m + 1],
                j[p][m + 1]
              ], U = f.length;
              f.push(C), g.add(U), O.add(U);
              for (const Z of C) A.add(Z);
            }
          }
        } else for (let e = 0; e < t.length - 1; e++) {
          const a = w(t[e]), r = w(t[e + 1]);
          if (a === r || c[a] === void 0 || c[r] === void 0) continue;
          const l = f.length;
          f.push([
            a,
            r
          ]), ne.set(`${o}:${e}`, l);
          const b = c[r][0] - c[a][0], y = c[r][1] - c[a][1], x = c[r][2] - c[a][2];
          Math.abs(x) > Math.max(Math.abs(b), Math.abs(y)) ? N.add(l) : v.add(l);
        }
      }
      const ae = Math.round(s.mat ?? 0), Qe = ae === 0 ? je : Fe, eo = ae === 0 ? Ze : We, oo = ae === 0 ? Ee : Pe, no = ae === 0 ? De : Xe, ce = Math.round(s.matShell ?? 0), to = ce === 0 ? je : Fe, so = ce === 0 ? Ze : We, ao = ce === 0 ? Ee : Pe, Oe = ce === 0 ? De : Xe, W = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), co = Math.round(s.formaPlaca ?? 0) === 3, F = {
        tc: s.deckTc ?? 0.065,
        hr: s.deckHr ?? 0.055,
        wrt: s.deckWrt ?? 0.15,
        wrb: s.deckWrb ?? 0.1,
        sr: s.deckSr ?? 0.2,
        w: s.deckW ?? 0.11
      }, ro = (De * (F.tc + (F.sr > 0 ? F.hr * (F.wrt + F.wrb) / 2 / F.sr : 0)) + F.w) / F.tc;
      for (let o = 0; o < f.length; o++) if (g.has(o)) if (W.set(o, to), re.set(o, so), J.set(o, Oe), te.set(o, ao), co) le.set(o, F.tc), J.set(o, ro), ie.set(o, 1), de.set(o, 0), q.set(o, {
        ...F
      });
      else {
        le.set(o, s.tShell ?? 0.2);
        const t = Math.round(s.formaPlaca ?? 0);
        t === 2 ? (ie.set(o, 1), de.set(o, 0)) : he.set(o, t);
      }
      else {
        const t = N.has(o), e = t ? s.bCol : s.bViga, a = t ? s.hCol : s.hViga, r = e * a, l = a * Math.pow(e, 3) / 12, b = e * Math.pow(a, 3) / 12, y = 0.14 * Math.pow(Math.min(e, a), 4);
        W.set(o, Qe), re.set(o, eo), X.set(o, r), K.set(o, l), Y.set(o, b), G.set(o, y), J.set(o, no), te.set(o, oo);
      }
      const me = window.__hekatanManualSections;
      if (me && me.size > 0) for (const [o, t] of me.entries()) {
        const e = ne.get(o);
        e === void 0 || g.has(e) || (t.A != null && X.set(e, t.A), t.Iz != null && K.set(e, t.Iz), t.Iy != null && Y.set(e, t.Iy), t.J != null && G.set(e, t.J));
      }
      const Be = window.__hekatanMaterialDB, ge = window.__hekatanManualMaterial;
      if (ge && ge.size > 0 && Be) for (const [o, t] of ge.entries()) {
        const e = ne.get(o);
        if (e === void 0 || g.has(e)) continue;
        const a = Be[t];
        if (!a) continue;
        W.set(e, a.E);
        const r = a.E / (2 * (1 + a.nu));
        re.set(e, r), J.set(e, a.rho), te.set(e, a.nu);
      }
      const we = window.__hekatanManualModifiers;
      if (we && we.size > 0) for (const [o, t] of we.entries()) {
        const e = ne.get(o);
        if (e === void 0 || g.has(e)) continue;
        const a = X.get(e);
        a != null && X.set(e, a * t.A);
        const r = K.get(e);
        r != null && K.set(e, r * t.Iz);
        const l = Y.get(e);
        l != null && Y.set(e, l * t.Iy);
        const b = G.get(e);
        b != null && G.set(e, b * t.J);
      }
      const Me = Math.round(s.apoyo ?? 0), B = /* @__PURE__ */ new Map();
      if (c.length > 0 && Me !== 3) {
        const o = Math.min(...c.map((e) => e[2])), t = Me === 0 ? [
          true,
          true,
          true,
          true,
          true,
          true
        ] : Me === 1 ? [
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
        for (let e = 0; e < c.length; e++) Math.abs(c[e][2] - o) < 1e-6 && B.set(e, [
          ...t
        ]);
      }
      const be = window.__hekatanManualSupports;
      if (be && be.size > 0) for (const [o, t] of be.entries()) o >= 0 && o < c.length && B.set(w(o), [
        ...t
      ]);
      const lo = Math.round(s.patronCargas ?? 0) === 1 ? "Live" : "Dead", io = window.__hekatanActiveCase, Le = (() => {
        var _a2;
        const t = (((_a2 = n.loadCases) == null ? void 0 : _a2.val) ?? []).find((e) => e.name === io);
        return t ? (t.patterns ?? []).map((e) => e.pattern) : [];
      })(), ke = Le.length === 0 || Le.includes(lo), H = /* @__PURE__ */ new Map();
      if (ke && Math.round(s.aplicarCargas ?? 1) === 1 && c.length > 0) {
        const o = Math.max(...c.map((a) => a[2])), t = s.Fx ?? 0, e = s.Fz ?? -10;
        for (let a = 0; a < c.length; a++) Math.abs(c[a][2] - o) < 1e-6 && H.set(a, [
          t,
          0,
          e,
          0,
          0,
          0
        ]);
      }
      const xe = window.__hekatanManualLoads;
      if (ke && xe && xe.size > 0) for (const [o, t] of xe.entries()) o >= 0 && o < c.length && H.set(w(o), [
        ...t
      ]);
      const ye = window.__hekatanManualDistLoads, se = /* @__PURE__ */ new Map();
      for (const [o, t] of H) se.set(o, [
        ...t
      ]);
      const ve = /* @__PURE__ */ new Map(), Re = [];
      if (ke && ye && ye.size > 0) {
        const o = (t, e) => {
          const a = se.get(t) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          se.set(t, [
            a[0] + e[0],
            a[1] + e[1],
            a[2] + e[2],
            a[3] + e[3],
            a[4] + e[4],
            a[5] + e[5]
          ]);
        };
        for (const [t, e] of ye.entries()) {
          const a = ne.get(t);
          if (a === void 0 || g.has(a)) continue;
          const r = f[a], l = c[r[0]], b = c[r[1]], y = [
            b[0] - l[0],
            b[1] - l[1],
            b[2] - l[2]
          ], x = Math.hypot(y[0], y[1], y[2]);
          if (x < 1e-9) continue;
          const I = [
            y[0] / x,
            y[1] / x,
            y[2] / x
          ], D = x * x / 12, z = [
            I[1] * e[2] - I[2] * e[1],
            I[2] * e[0] - I[0] * e[2],
            I[0] * e[1] - I[1] * e[0]
          ];
          o(w(r[0]), [
            e[0] * x / 2,
            e[1] * x / 2,
            e[2] * x / 2,
            D * z[0],
            D * z[1],
            D * z[2]
          ]), o(w(r[1]), [
            e[0] * x / 2,
            e[1] * x / 2,
            e[2] * x / 2,
            -D * z[0],
            -D * z[1],
            -D * z[2]
          ]), ve.set(a, [
            e[0],
            e[1],
            e[2]
          ]);
          const j = Math.hypot(e[0], e[1], e[2]);
          if (j < 1e-9) continue;
          const p = [
            e[0] / j,
            e[1] / j,
            e[2] / j
          ], m = Math.min(1.2, Math.max(0.25, 0.08 * j)) * (s.escalaCargaQ ?? 1), C = Math.max(2, Math.round(x / 0.5)) + 1, U = 16347926, Z = new bo({
            color: U,
            depthTest: false,
            transparent: true,
            opacity: 0.95
          }), L = [], Te = [];
          for (let _e = 0; _e < C; _e++) {
            const ze = _e / (C - 1), R = new ue(l[0] + y[0] * ze, l[1] + y[1] * ze, l[2] + y[2] * ze), Ne = new ue(R.x - p[0] * m, R.y - p[1] * m, R.z - p[2] * m);
            L.push(Ne, R), Te.push(Ne);
            const Ve = new ue(I[0], I[1], I[2]).multiplyScalar(m * 0.18), He = new ue(p[0], p[1], p[2]).multiplyScalar(-m * 0.3);
            L.push(R.clone(), R.clone().add(He).add(Ve), R.clone(), R.clone().add(He).sub(Ve));
          }
          const fo = new Ae().setFromPoints(L), Ie = new ko(fo, Z);
          Ie.renderOrder = 998, Ie.frustumCulled = false;
          const uo = new Ae().setFromPoints(Te), $e = new xo(uo, Z);
          $e.renderOrder = 998, $e.frustumCulled = false, Re.push(Ie, $e);
        }
      }
      if (new URLSearchParams(window.location.search).get("heks") || new URLSearchParams(window.location.search).get("m")) {
        n.nodes.val = [], n.elements.val = [], n.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        };
        return;
      }
      n.nodes.val = c, n.elements.val = f, n.nodeInputs.val = {
        supports: B,
        loads: H
      }, n.elementInputs.val = {
        elasticities: W,
        shearModuli: re,
        areas: X,
        momentsOfInertiaY: K,
        momentsOfInertiaZ: Y,
        torsionalConstants: G,
        densities: J,
        poissonsRatios: te,
        thicknesses: le,
        plateFormulations: he,
        membraneModifiers: ie,
        bendingModifiers: de,
        deckSections: q,
        frameLoads: ve
      }, n.objects3D.val = [
        ...Ke(s),
        ...Re
      ], window.__hekatanModeloAHeks = () => {
        const o = (r) => String(+(+r).toFixed(6)), t = (r) => String(typeof r == "number" ? +r.toPrecision(6) : r), e = (r) => t((q.has(r) ? Oe : J.get(r) ?? 0) / 9.80665), a = [
          "# Hekatan Struct \xB7 modelo dibujado (" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ")",
          "# unidades: m, kN, kN/m"
        ];
        c.forEach((r, l) => a.push(`node ${l + 1} ${o(r[0])} ${o(r[1])} ${o(r[2])}`)), f.forEach((r, l) => {
          const b = r.map((y) => y + 1).join(" ");
          g.has(l) ? a.push(`shell ${l + 1} ${b} ${t(le.get(l))} ${t(W.get(l))} 0 ${e(l)}`) : a.push(`frame ${l + 1} ${b} ${t(W.get(l))} ${t(X.get(l))} ${t(K.get(l))} ${t(Y.get(l))} ${t(G.get(l))} ${t(te.get(l))} ${e(l)}`);
        });
        for (const [r, l] of he) l === 1 && a.push(`shelltype ${r + 1} thin`);
        for (const [r, l] of de) l === 0 && a.push(`shellmod ${r + 1} ${t(ie.get(r) ?? 1)} 0`);
        if (q.size) {
          for (const [r, l] of q) a.push(`decksec ${r + 1} ${t(l.tc)} ${t(l.hr)} ${t(l.wrt)} ${t(l.wrb)} ${t(l.sr)} ${t(l.w)}`);
          if (a.push("deck etabs oneway"), Math.round(s.deckDir ?? 0) === 1) for (const r of q.keys()) a.push(`shellang ${r + 1} 90`);
        }
        for (const [r, l] of B) a.push(`support ${r + 1} ${l.map((b) => b ? 1 : 0).join(" ")}`);
        for (const [r, l] of H) l.some((b) => b !== 0) && a.push(`load ${r + 1} ${l.join(" ")}`);
        for (const [r, l] of ve) a.push(`frameload ${r + 1} ${l.join(" ")}`);
        for (const r of P) a.push(`spring ${r.node + 1} ${[
          "ux",
          "uy",
          "uz",
          "rx",
          "ry",
          "rz"
        ][r.dof]} ${r.k}`);
        return a.push("solve"), a.join(`
`) + `
`;
      };
      const P = [], Se = window.__hekatanManualSprings;
      if (Se && Se.size > 0) {
        for (const [o, t] of Se.entries()) if (!(o < 0 || o >= c.length)) for (let e = 0; e < 6; e++) t[e] !== 0 && P.push({
          node: w(o),
          dof: e,
          k: t[e]
        });
      }
      const fe = (s.ksSuelo ?? 0) * 9.80665;
      if (fe > 0 && A.size > 0) {
        const o = /* @__PURE__ */ new Map();
        for (const t of O) {
          const e = f[t], a = $o(c, e);
          for (const r of e) o.set(r, (o.get(r) ?? 0) + a / 4);
        }
        for (const [t, e] of o) {
          const a = fe * e;
          P.push({
            node: t,
            dof: 2,
            k: a
          }), P.push({
            node: t,
            dof: 0,
            k: a * 0.5
          }), P.push({
            node: t,
            dof: 1,
            k: a * 0.5
          });
        }
      }
      if (Math.round(s.autoSolve ?? 1) === 1 && c.length > 0 && f.length > 0 && (B.size > 0 || P.length > 0) && se.size > 0) try {
        if (n.deformOutputs.val = vo(c, f, {
          supports: B,
          loads: se
        }, n.elementInputs.val, P.length > 0 ? P : void 0), n.analyzeOutputs.val = yo(c, f, n.elementInputs.val, n.deformOutputs.rawVal), fe > 0 && O.size > 0) try {
          const t = n.deformOutputs.rawVal.deformations, e = n.analyzeOutputs.rawVal ?? {}, a = /* @__PURE__ */ new Map();
          let r = 0, l = 0;
          for (const b of O) {
            const x = f[b].map((I) => {
              var _a2;
              const D = ((_a2 = t.get(I)) == null ? void 0 : _a2[2]) ?? 0, z = fe * D;
              return z < r && (r = z), z > l && (l = z), z;
            });
            a.set(b, x);
          }
          e.pressure = a, e.colorMapRanges = {
            ...e.colorMapRanges ?? {},
            pressure: [
              l,
              r
            ]
          }, n.analyzeOutputs.val = e;
        } catch (t) {
          console.warn("[NewBlank] presi\xF3n:", (t == null ? void 0 : t.message) ?? t);
        }
        const o = /* @__PURE__ */ new Set();
        for (const t of f) for (const e of t) o.add(e);
        console.log(`[NewBlank] Solve OK \u2014 ${o.size} nudos (de ${c.length} puntos), ${f.length} elementos, ${B.size} apoyos, ${H.size} cargas, ${P.length} springs`);
      } catch (o) {
        console.warn(`[NewBlank] Solver fall\xF3: ${o.message}`);
      }
      else console.log(`[NewBlank] mode=${h ? "2D" : "3D"} | nodes=${c.length} elem=${f.length} cols=${N.size} vigas=${v.size} shells=${g.size} apoyos=${B.size} cargas=${H.size} springs=${P.length}`);
    },
    computedLabels(s, n) {
      const i = {}, d = n.nodes.val.length;
      n.elements.val.length;
      let u = 0, k = 0;
      for (const h of n.elements.val) h.length === 4 ? k++ : u++;
      return i.Stats = `${d} nodos \xB7 ${u} frames \xB7 ${k} shells`, d === 0 && (i["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), i;
    }
  };
});
export {
  __tla,
  Do as i,
  Ao as n
};
