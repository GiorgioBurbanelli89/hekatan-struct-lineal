import { A as pn, k as Ye, B as Ae, F as hn, l as mn, M as gn, e as wn, D as bn, b as Mn, V as ue, L as kn, d as xn } from "./Text-C1TX4d8g.js";
import { a as vn, __tla as __tla_0 } from "./analyze-CC0LMJ9d.js";
import { d as yn, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let Dn, An;
let __tla = Promise.all([
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
  const ee = /* @__PURE__ */ new Set();
  let T = -1, Ke = false, Q = true;
  function Ce(s) {
    Ke = s;
    const o = document.getElementById("hk-ifc-objs"), i = document.getElementById("hk-ifc-tab");
    o && (o.style.transition = "transform .25s ease, opacity .25s ease", o.style.transform = s ? "translateX(-50%) translateY(130%)" : "translateX(-50%)", o.style.opacity = s ? "0" : "", o.style.pointerEvents = s ? "none" : ""), i && (i.style.display = s ? "block" : "none");
  }
  function Ge(s) {
    let o = document.getElementById("hk-ifc-objs");
    if (o || (o = document.createElement("div"), o.id = "hk-ifc-objs", o.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:120;background:rgba(16,22,30,0.96);color:#cde;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:7px 9px;font:11px system-ui,sans-serif;max-height:38vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.5);min-width:220px;", document.body.appendChild(o)), !document.getElementById("hk-ifc-tab")) {
      const h = document.createElement("button");
      h.id = "hk-ifc-tab", h.textContent = "\u{1F3DB} Objetos IFC \u27E9", h.title = "Mostrar objetos IFC", h.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:121;display:none;padding:6px 12px;border:1px solid #3a4a5f;border-radius:8px;background:rgba(30,40,55,0.96);color:#9ce;cursor:pointer;font:11px system-ui;box-shadow:0 2px 8px rgba(0,0,0,.4)", h.onclick = () => Ce(false), document.body.appendChild(h);
    }
    const i = Q ? "" : s.map((h, r) => {
      const S = h.color.map((f) => Math.round(f * 255)), _ = Math.round(h.positions.length / 9), w = !ee.has(r) && (T < 0 || T === r);
      return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
      <input type="checkbox" data-ifc-vis="${r}" ${w ? "checked" : ""}>
      <span style="width:12px;height:12px;border-radius:2px;background:rgb(${S[0]},${S[1]},${S[2]});border:1px solid #0006;display:inline-block"></span>
      <span style="flex:1">Objeto ${r + 1}</span>
      <span style="color:#8ab">${_} \u25B3</span>
      <button data-ifc-solo="${r}" title="Aislar" style="background:#243;color:#9fd;border:1px solid #365;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px">solo</button>
    </div>`;
    }).join(""), d = (h, r, S) => `<button id="${h}" title="${S}" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:11px;padding:1px 6px;margin-left:3px">${r}</button>`;
    o.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;${Q ? "" : "margin-bottom:4px"}">
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
    o.querySelector("#hk-ifc-min").onclick = () => {
      Q = !Q, Ge(s);
    }, o.querySelector("#hk-ifc-slide").onclick = () => Ce(true), o.querySelectorAll("[data-ifc-vis]").forEach((h) => {
      h.onchange = () => {
        const r = +h.dataset.ifcVis;
        T = -1, h.checked ? ee.delete(r) : ee.add(r), u();
      };
    }), o.querySelectorAll("[data-ifc-solo]").forEach((h) => {
      h.onclick = () => {
        const r = +h.dataset.ifcSolo;
        T = T === r ? -1 : r, ee.clear(), u();
      };
    });
    const k = o.querySelector("#hk-ifc-all");
    k && (k.onclick = () => {
      ee.clear(), T = -1, u();
    }), Ce(Ke);
  }
  function Sn() {
    var _a, _b;
    (_a = document.getElementById("hk-ifc-objs")) == null ? void 0 : _a.remove(), (_b = document.getElementById("hk-ifc-tab")) == null ? void 0 : _b.remove();
  }
  function Je(s, o) {
    const i = [
      0,
      1,
      2
    ].reduce((y, g) => o[1][g] - o[0][g] > o[1][y] - o[0][y] ? g : y, 0), d = [];
    for (const y of s) {
      const g = y.positions;
      for (let b = 0; b < g.length; b += 9) d.push((g[b + i] + g[b + 3 + i] + g[b + 6 + i]) / 3);
    }
    if (d.length < 2) return o;
    d.sort((y, g) => y - g);
    let u = 0, k = 0;
    for (let y = 1; y < d.length; y++) {
      const g = d[y] - d[y - 1];
      g > k && (k = g, u = y);
    }
    const h = d[d.length - 1] - d[0];
    if (k < h * 0.15) return o;
    const r = (d[u] + d[u - 1]) / 2, S = u, w = d.length - u >= S, f = [
      1e30,
      1e30,
      1e30
    ], N = [
      -1e30,
      -1e30,
      -1e30
    ];
    for (const y of s) {
      const g = y.positions;
      for (let b = 0; b < g.length; b += 9) {
        const O = (g[b + i] + g[b + 3 + i] + g[b + 6 + i]) / 3;
        if (!(w && O < r || !w && O >= r)) for (let A = 0; A < 3; A++) for (const ne of [
          0,
          3,
          6
        ]) {
          const V = g[b + ne + A];
          V < f[A] && (f[A] = V), V > N[A] && (N[A] = V);
        }
      }
    }
    return [
      f,
      N
    ];
  }
  function qe(s, o = false) {
    var _a;
    const i = window.__hekatanIfcMesh;
    if (!i || !((_a = i.grupos) == null ? void 0 : _a.length)) return [];
    const d = Math.max(0.1, Math.min(1, s)), u = [];
    u.push(new pn(16777215, 0.75));
    const k = new Ye(16777215, 0.7);
    k.position.set(1, 1, 2);
    const h = new Ye(16777215, 0.4);
    return h.position.set(-1, -0.5, 1), u.push(k, h), i.grupos.forEach((r, S) => {
      if (!r.positions.length || !o && ee.has(S) || !o && T >= 0 && S !== T) return;
      const _ = new Ae();
      _.setAttribute("position", new hn(r.positions, 3)), _.computeVertexNormals();
      const w = new mn(r.color[0], r.color[1], r.color[2]), f = new gn(_, new wn({
        color: w,
        emissive: w.clone().multiplyScalar(0.25),
        roughness: 0.9,
        metalness: 0,
        transparent: d < 1,
        opacity: d,
        side: bn
      }));
      o && (f.userData.refIfc = true, f.name = "ref-ifc-" + S), u.push(f);
    }), u;
  }
  function In() {
    var _a;
    const s = window.__hekatanIfcMesh;
    return !s || !((_a = s.grupos) == null ? void 0 : _a.length) || !s.bbox ? null : Je(s.grupos, s.bbox);
  }
  let je, Ee, He, De, Pe, Fe, Ue, Ze, $;
  Dn = {
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
      const o = s.estructura, i = {
        Archivo: String(s.archivo ?? "ifc"),
        "Objetos (colores)": String(((_a = s.grupos) == null ? void 0 : _a.length) ?? 0),
        Tri\u00E1ngulos: String(s.nTri ?? 0),
        "Tama\xF1o (m)": s.bbox ? s.bbox[1].map((d, u) => (d - s.bbox[0][u]).toFixed(1)).join(" \xD7 ") : "\u2014"
      };
      if (o) {
        const d = o.columnas + o.vigas + o.miembros + o.losas + o.muros + o.zapatas;
        i["Elementos estructurales"] = d > 0 ? `col ${o.columnas} \xB7 vig ${o.vigas} \xB7 losa ${o.losas} \xB7 muro ${o.muros}` : `0 (solo mallas${o.proxies ? ` \u2014 ${o.proxies} objetos SketchUp` : ""})`, i["Convertible a estructura"] = d > 0 ? "s\xED" : "no (IFC de arquitectura)";
      }
      return i;
    },
    build(s, o) {
      var _a, _b;
      const i = window.__hekatanIfcMesh;
      if (!i || !((_a = i.grupos) == null ? void 0 : _a.length)) {
        o.nodes.val = [], o.elements.val = [], o.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, o.elementInputs.val = {
          elasticities: /* @__PURE__ */ new Map(),
          shearModuli: /* @__PURE__ */ new Map(),
          areas: /* @__PURE__ */ new Map(),
          momentsOfInertiaY: /* @__PURE__ */ new Map(),
          momentsOfInertiaZ: /* @__PURE__ */ new Map(),
          torsionalConstants: /* @__PURE__ */ new Map(),
          densities: /* @__PURE__ */ new Map(),
          poissonsRatios: /* @__PURE__ */ new Map()
        }, o.objects3D.val = [], Sn(), console.log("[IFC] Sin modelo. Usa '\u{1F4E5} Importar IFC'.");
        return;
      }
      const d = qe((s.opacidad ?? 100) / 100);
      o.objects3D.val = s.caras ? d : d.filter((h) => !h.isMesh);
      try {
        (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, i.bbox[0], i.bbox[1]);
      } catch {
      }
      Ge(i.grupos);
      const [u, k] = Je(i.grupos, i.bbox);
      o.nodes.val = [
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
      ], o.elements.val = [], o.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map()
      }, o.elementInputs.val = {
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
  He = je / (2 * (1 + Ee));
  De = 24;
  Pe = 2e8;
  Fe = 0.3;
  Ue = Pe / (2 * (1 + Fe));
  Ze = 78;
  $ = (s, o, i, d, u, k) => ({
    default: i,
    min: d,
    max: u,
    step: k,
    label: o,
    folder: s
  });
  function $n(s, o) {
    const i = s[o[0]], d = s[o[1]], u = s[o[2]], k = s[o[3]], h = (r, S, _) => {
      const w = [
        S[0] - r[0],
        S[1] - r[1],
        S[2] - r[2]
      ], f = [
        _[0] - r[0],
        _[1] - r[1],
        _[2] - r[2]
      ];
      return 0.5 * Math.hypot(w[1] * f[2] - w[2] * f[1], w[2] * f[0] - w[0] * f[2], w[0] * f[1] - w[1] * f[0]);
    };
    return h(i, d, u) + h(i, u, k);
  }
  let E, We;
  E = (s, o, i, d) => ({
    default: i,
    label: o,
    folder: s,
    options: d
  });
  We = (s) => {
    var _a, _b;
    if (Math.round(s.refIfc ?? 1) !== 1) return [];
    const o = Math.round(s.refModo ?? 0), i = o === 1 ? 0.12 : o === 2 ? 0.04 : (s.refOpac ?? 35) / 100, d = qe(i, true);
    if (o === 2) {
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
  An = {
    id: "new-blank",
    name: "\u{1F4C4} Archivo nuevo (lienzo CAD 2D/3D)",
    category: "\u{1F9EA} Utilidades",
    defaultShellResult: "none",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
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
    build(s, o) {
      var _a, _b, _c;
      const i = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], d = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], u = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], k = new Set(u);
      if (!i.length) {
        const n = Math.round(s.refIfc ?? 1) === 1 ? In() : null;
        o.nodes.val = n ? [
          n[0],
          n[1]
        ] : [], o.elements.val = [], o.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, o.elementInputs.val = {}, o.objects3D.val = We(s), console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const h = Math.round(s.mode ?? 1) === 0, r = i.map((n) => h ? [
        n[0],
        0,
        n[2]
      ] : [
        n[0],
        n[1],
        n[2]
      ]), S = 1e-4, _ = new Int32Array(r.length);
      {
        const n = /* @__PURE__ */ new Map();
        for (let t = 0; t < r.length; t++) {
          const e = r[t].map((c) => Math.round(c / S)).join(","), a = n.get(e);
          a === void 0 ? (n.set(e, t), _[t] = t) : _[t] = a;
        }
      }
      const w = (n) => n >= 0 && n < _.length ? _[n] : n, f = [], N = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), b = Math.max(1, Math.round(s.mallaZapata ?? 1)), O = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Set(), ne = 1e-3, V = (n) => `${Math.round(n[0] / ne)},${Math.round(n[1] / ne)},${Math.round(n[2] / ne)}`, pe = /* @__PURE__ */ new Map();
      for (let n = 0; n < r.length; n++) pe.set(V(r[n]), w(n));
      const oe = /* @__PURE__ */ new Map();
      for (let n = 0; n < d.length; n++) {
        const t = d[n];
        if (k.has(n)) {
          const e = (t.length === 5 ? t.slice(0, 4) : t.slice(0, Math.min(4, t.length))).map(w);
          if (e.length !== 4 || e.some((a) => r[a] === void 0)) continue;
          if (b <= 1) {
            const a = f.length;
            f.push(e), g.add(a), O.add(a);
            for (const c of e) A.add(c);
          } else {
            const [a, c, l, M] = e, v = r[a], x = r[c], I = r[l], D = r[M], z = (p, m) => [
              (1 - p) * (1 - m) * v[0] + p * (1 - m) * x[0] + p * m * I[0] + (1 - p) * m * D[0],
              (1 - p) * (1 - m) * v[1] + p * (1 - m) * x[1] + p * m * I[1] + (1 - p) * m * D[1],
              (1 - p) * (1 - m) * v[2] + p * (1 - m) * x[2] + p * m * I[2] + (1 - p) * m * D[2]
            ], j = [];
            for (let p = 0; p <= b; p++) {
              const m = [];
              for (let C = 0; C <= b; C++) if (p === 0 && C === 0) m.push(a);
              else if (p === b && C === 0) m.push(c);
              else if (p === b && C === b) m.push(l);
              else if (p === 0 && C === b) m.push(M);
              else {
                const Y = z(p / b, C / b), H = V(Y);
                let L = pe.get(H);
                L === void 0 && (L = r.length, r.push(Y), pe.set(H, L)), m.push(L);
              }
              j.push(m);
            }
            for (let p = 0; p < b; p++) for (let m = 0; m < b; m++) {
              const C = [
                j[p][m],
                j[p + 1][m],
                j[p + 1][m + 1],
                j[p][m + 1]
              ], Y = f.length;
              f.push(C), g.add(Y), O.add(Y);
              for (const H of C) A.add(H);
            }
          }
        } else for (let e = 0; e < t.length - 1; e++) {
          const a = w(t[e]), c = w(t[e + 1]);
          if (a === c || r[a] === void 0 || r[c] === void 0) continue;
          const l = f.length;
          f.push([
            a,
            c
          ]), oe.set(`${n}:${e}`, l);
          const M = r[c][0] - r[a][0], v = r[c][1] - r[a][1], x = r[c][2] - r[a][2];
          Math.abs(x) > Math.max(Math.abs(M), Math.abs(v)) ? N.add(l) : y.add(l);
        }
      }
      const ae = Math.round(s.mat ?? 0), Qe = ae === 0 ? je : Pe, en = ae === 0 ? He : Ue, nn = ae === 0 ? Ee : Fe, on = ae === 0 ? De : Ze, re = Math.round(s.matShell ?? 0), tn = re === 0 ? je : Pe, sn = re === 0 ? He : Ue, an = re === 0 ? Ee : Fe, Oe = re === 0 ? De : Ze, U = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), rn = Math.round(s.formaPlaca ?? 0) === 3, P = {
        tc: s.deckTc ?? 0.065,
        hr: s.deckHr ?? 0.055,
        wrt: s.deckWrt ?? 0.15,
        wrb: s.deckWrb ?? 0.1,
        sr: s.deckSr ?? 0.2,
        w: s.deckW ?? 0.11
      }, cn = (De * (P.tc + (P.sr > 0 ? P.hr * (P.wrt + P.wrb) / 2 / P.sr : 0)) + P.w) / P.tc;
      for (let n = 0; n < f.length; n++) if (g.has(n)) if (U.set(n, tn), ce.set(n, sn), J.set(n, Oe), te.set(n, an), rn) le.set(n, P.tc), J.set(n, cn), ie.set(n, 1), de.set(n, 0), q.set(n, {
        ...P
      });
      else {
        le.set(n, s.tShell ?? 0.2);
        const t = Math.round(s.formaPlaca ?? 0);
        t === 2 ? (ie.set(n, 1), de.set(n, 0)) : he.set(n, t);
      }
      else {
        const t = N.has(n), e = t ? s.bCol : s.bViga, a = t ? s.hCol : s.hViga, c = e * a, l = a * Math.pow(e, 3) / 12, M = e * Math.pow(a, 3) / 12, v = 0.14 * Math.pow(Math.min(e, a), 4);
        U.set(n, Qe), ce.set(n, en), Z.set(n, c), W.set(n, l), K.set(n, M), G.set(n, v), J.set(n, on), te.set(n, nn);
      }
      const me = window.__hekatanManualSections;
      if (me && me.size > 0) for (const [n, t] of me.entries()) {
        const e = oe.get(n);
        e === void 0 || g.has(e) || (t.A != null && Z.set(e, t.A), t.Iz != null && W.set(e, t.Iz), t.Iy != null && K.set(e, t.Iy), t.J != null && G.set(e, t.J));
      }
      const Be = window.__hekatanMaterialDB, ge = window.__hekatanManualMaterial;
      if (ge && ge.size > 0 && Be) for (const [n, t] of ge.entries()) {
        const e = oe.get(n);
        if (e === void 0 || g.has(e)) continue;
        const a = Be[t];
        if (!a) continue;
        U.set(e, a.E);
        const c = a.E / (2 * (1 + a.nu));
        ce.set(e, c), J.set(e, a.rho), te.set(e, a.nu);
      }
      const we = window.__hekatanManualModifiers;
      if (we && we.size > 0) for (const [n, t] of we.entries()) {
        const e = oe.get(n);
        if (e === void 0 || g.has(e)) continue;
        const a = Z.get(e);
        a != null && Z.set(e, a * t.A);
        const c = W.get(e);
        c != null && W.set(e, c * t.Iz);
        const l = K.get(e);
        l != null && K.set(e, l * t.Iy);
        const M = G.get(e);
        M != null && G.set(e, M * t.J);
      }
      const be = Math.round(s.apoyo ?? 0), B = /* @__PURE__ */ new Map();
      if (r.length > 0 && be !== 3) {
        const n = Math.min(...r.map((e) => e[2])), t = be === 0 ? [
          true,
          true,
          true,
          true,
          true,
          true
        ] : be === 1 ? [
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
        for (let e = 0; e < r.length; e++) Math.abs(r[e][2] - n) < 1e-6 && B.set(e, [
          ...t
        ]);
      }
      const Me = window.__hekatanManualSupports;
      if (Me && Me.size > 0) for (const [n, t] of Me.entries()) n >= 0 && n < r.length && B.set(w(n), [
        ...t
      ]);
      const ln = Math.round(s.patronCargas ?? 0) === 1 ? "Live" : "Dead", dn = window.__hekatanActiveCase, Le = (() => {
        var _a2;
        const t = (((_a2 = o.loadCases) == null ? void 0 : _a2.val) ?? []).find((e) => e.name === dn);
        return t ? (t.patterns ?? []).map((e) => e.pattern) : [];
      })(), ke = Le.length === 0 || Le.includes(ln), X = /* @__PURE__ */ new Map();
      if (ke && Math.round(s.aplicarCargas ?? 1) === 1 && r.length > 0) {
        const n = Math.max(...r.map((a) => a[2])), t = s.Fx ?? 0, e = s.Fz ?? -10;
        for (let a = 0; a < r.length; a++) Math.abs(r[a][2] - n) < 1e-6 && X.set(a, [
          t,
          0,
          e,
          0,
          0,
          0
        ]);
      }
      const xe = window.__hekatanManualLoads;
      if (ke && xe && xe.size > 0) for (const [n, t] of xe.entries()) n >= 0 && n < r.length && X.set(w(n), [
        ...t
      ]);
      const ve = window.__hekatanManualDistLoads, se = /* @__PURE__ */ new Map();
      for (const [n, t] of X) se.set(n, [
        ...t
      ]);
      const ye = /* @__PURE__ */ new Map(), Re = [];
      if (ke && ve && ve.size > 0) {
        const n = (t, e) => {
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
        for (const [t, e] of ve.entries()) {
          const a = oe.get(t);
          if (a === void 0 || g.has(a)) continue;
          const c = f[a], l = r[c[0]], M = r[c[1]], v = [
            M[0] - l[0],
            M[1] - l[1],
            M[2] - l[2]
          ], x = Math.hypot(v[0], v[1], v[2]);
          if (x < 1e-9) continue;
          const I = [
            v[0] / x,
            v[1] / x,
            v[2] / x
          ], D = x * x / 12, z = [
            I[1] * e[2] - I[2] * e[1],
            I[2] * e[0] - I[0] * e[2],
            I[0] * e[1] - I[1] * e[0]
          ];
          n(w(c[0]), [
            e[0] * x / 2,
            e[1] * x / 2,
            e[2] * x / 2,
            D * z[0],
            D * z[1],
            D * z[2]
          ]), n(w(c[1]), [
            e[0] * x / 2,
            e[1] * x / 2,
            e[2] * x / 2,
            -D * z[0],
            -D * z[1],
            -D * z[2]
          ]), ye.set(a, [
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
          ], m = Math.min(1.2, Math.max(0.25, 0.08 * j)) * (s.escalaCargaQ ?? 1), C = Math.max(2, Math.round(x / 0.5)) + 1, Y = 16347926, H = new Mn({
            color: Y,
            depthTest: false,
            transparent: true,
            opacity: 0.95
          }), L = [], Te = [];
          for (let _e = 0; _e < C; _e++) {
            const ze = _e / (C - 1), R = new ue(l[0] + v[0] * ze, l[1] + v[1] * ze, l[2] + v[2] * ze), Ne = new ue(R.x - p[0] * m, R.y - p[1] * m, R.z - p[2] * m);
            L.push(Ne, R), Te.push(Ne);
            const Ve = new ue(I[0], I[1], I[2]).multiplyScalar(m * 0.18), Xe = new ue(p[0], p[1], p[2]).multiplyScalar(-m * 0.3);
            L.push(R.clone(), R.clone().add(Xe).add(Ve), R.clone(), R.clone().add(Xe).sub(Ve));
          }
          const fn = new Ae().setFromPoints(L), Ie = new kn(fn, H);
          Ie.renderOrder = 998, Ie.frustumCulled = false;
          const un = new Ae().setFromPoints(Te), $e = new xn(un, H);
          $e.renderOrder = 998, $e.frustumCulled = false, Re.push(Ie, $e);
        }
      }
      if (new URLSearchParams(window.location.search).get("heks") || new URLSearchParams(window.location.search).get("m")) {
        o.nodes.val = [], o.elements.val = [], o.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        };
        return;
      }
      o.nodes.val = r, o.elements.val = f, o.nodeInputs.val = {
        supports: B,
        loads: X
      }, o.elementInputs.val = {
        elasticities: U,
        shearModuli: ce,
        areas: Z,
        momentsOfInertiaY: W,
        momentsOfInertiaZ: K,
        torsionalConstants: G,
        densities: J,
        poissonsRatios: te,
        thicknesses: le,
        plateFormulations: he,
        membraneModifiers: ie,
        bendingModifiers: de,
        deckSections: q,
        frameLoads: ye
      }, o.objects3D.val = [
        ...We(s),
        ...Re
      ], window.__hekatanModeloAHeks = () => {
        const n = (c) => String(+(+c).toFixed(6)), t = (c) => String(typeof c == "number" ? +c.toPrecision(6) : c), e = (c) => t((q.has(c) ? Oe : J.get(c) ?? 0) / 9.80665), a = [
          "# Hekatan Struct \xB7 modelo dibujado (" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ")",
          "# unidades: m, kN, kN/m"
        ];
        r.forEach((c, l) => a.push(`node ${l + 1} ${n(c[0])} ${n(c[1])} ${n(c[2])}`)), f.forEach((c, l) => {
          const M = c.map((v) => v + 1).join(" ");
          g.has(l) ? a.push(`shell ${l + 1} ${M} ${t(le.get(l))} ${t(U.get(l))} 0 ${e(l)}`) : a.push(`frame ${l + 1} ${M} ${t(U.get(l))} ${t(Z.get(l))} ${t(W.get(l))} ${t(K.get(l))} ${t(G.get(l))} ${t(te.get(l))} ${e(l)}`);
        });
        for (const [c, l] of he) l === 1 && a.push(`shelltype ${c + 1} thin`);
        for (const [c, l] of de) l === 0 && a.push(`shellmod ${c + 1} ${t(ie.get(c) ?? 1)} 0`);
        if (q.size) {
          for (const [c, l] of q) a.push(`decksec ${c + 1} ${t(l.tc)} ${t(l.hr)} ${t(l.wrt)} ${t(l.wrb)} ${t(l.sr)} ${t(l.w)}`);
          if (a.push("deck etabs oneway"), Math.round(s.deckDir ?? 0) === 1) for (const c of q.keys()) a.push(`shellang ${c + 1} 90`);
        }
        for (const [c, l] of B) a.push(`support ${c + 1} ${l.map((M) => M ? 1 : 0).join(" ")}`);
        for (const [c, l] of X) l.some((M) => M !== 0) && a.push(`load ${c + 1} ${l.join(" ")}`);
        for (const [c, l] of ye) a.push(`frameload ${c + 1} ${l.join(" ")}`);
        for (const c of F) a.push(`spring ${c.node + 1} ${[
          "ux",
          "uy",
          "uz",
          "rx",
          "ry",
          "rz"
        ][c.dof]} ${c.k}`);
        return a.push("solve"), a.join(`
`) + `
`;
      };
      const F = [], Se = window.__hekatanManualSprings;
      if (Se && Se.size > 0) {
        for (const [n, t] of Se.entries()) if (!(n < 0 || n >= r.length)) for (let e = 0; e < 6; e++) t[e] !== 0 && F.push({
          node: w(n),
          dof: e,
          k: t[e]
        });
      }
      const fe = (s.ksSuelo ?? 0) * 9.80665;
      if (fe > 0 && A.size > 0) {
        const n = /* @__PURE__ */ new Map();
        for (const t of O) {
          const e = f[t], a = $n(r, e);
          for (const c of e) n.set(c, (n.get(c) ?? 0) + a / 4);
        }
        for (const [t, e] of n) {
          const a = fe * e;
          F.push({
            node: t,
            dof: 2,
            k: a
          }), F.push({
            node: t,
            dof: 0,
            k: a * 0.5
          }), F.push({
            node: t,
            dof: 1,
            k: a * 0.5
          });
        }
      }
      if (Math.round(s.autoSolve ?? 1) === 1 && r.length > 0 && f.length > 0 && (B.size > 0 || F.length > 0) && se.size > 0) try {
        if (o.deformOutputs.val = yn(r, f, {
          supports: B,
          loads: se
        }, o.elementInputs.val, F.length > 0 ? F : void 0), o.analyzeOutputs.val = vn(r, f, o.elementInputs.val, o.deformOutputs.rawVal), fe > 0 && O.size > 0) try {
          const t = o.deformOutputs.rawVal.deformations, e = o.analyzeOutputs.rawVal ?? {}, a = /* @__PURE__ */ new Map();
          let c = 0, l = 0;
          for (const M of O) {
            const x = f[M].map((I) => {
              var _a2;
              const D = ((_a2 = t.get(I)) == null ? void 0 : _a2[2]) ?? 0, z = fe * D;
              return z < c && (c = z), z > l && (l = z), z;
            });
            a.set(M, x);
          }
          e.pressure = a, e.colorMapRanges = {
            ...e.colorMapRanges ?? {},
            pressure: [
              l,
              c
            ]
          }, o.analyzeOutputs.val = e;
        } catch (t) {
          console.warn("[NewBlank] presi\xF3n:", (t == null ? void 0 : t.message) ?? t);
        }
        const n = /* @__PURE__ */ new Set();
        for (const t of f) for (const e of t) n.add(e);
        console.log(`[NewBlank] Solve OK \u2014 ${n.size} nudos (de ${r.length} puntos), ${f.length} elementos, ${B.size} apoyos, ${X.size} cargas, ${F.length} springs`);
      } catch (n) {
        console.warn(`[NewBlank] Solver fall\xF3: ${n.message}`);
      }
      else console.log(`[NewBlank] mode=${h ? "2D" : "3D"} | nodes=${r.length} elem=${f.length} cols=${N.size} vigas=${y.size} shells=${g.size} apoyos=${B.size} cargas=${X.size} springs=${F.length}`);
    },
    computedLabels(s, o) {
      const i = {}, d = o.nodes.val.length;
      o.elements.val.length;
      let u = 0, k = 0;
      for (const h of o.elements.val) h.length === 4 ? k++ : u++;
      return i.Stats = `${d} nodos \xB7 ${u} frames \xB7 ${k} shells`, d === 0 && (i["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), i;
    }
  };
});
export {
  __tla,
  Dn as i,
  An as n
};
