import { A as lo, t as Re, B as $e, F as ro, u as co, M as io, e as uo, D as fo, b as po, V as re, L as ho, d as mo } from "./theme-C-zoknmI.js";
import { a as go } from "./analyze-DgLgRmKg.js";
import { d as wo, __tla as __tla_0 } from "./didacticCpp-reRUqpUx.js";
let Io, So;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const q = /* @__PURE__ */ new Set();
  let B = -1, Ze = false, Y = true;
  function Se(l) {
    Ze = l;
    const o = document.getElementById("hk-ifc-objs"), i = document.getElementById("hk-ifc-tab");
    o && (o.style.transition = "transform .25s ease, opacity .25s ease", o.style.transform = l ? "translateX(-50%) translateY(130%)" : "translateX(-50%)", o.style.opacity = l ? "0" : "", o.style.pointerEvents = l ? "none" : ""), i && (i.style.display = l ? "block" : "none");
  }
  function He(l) {
    let o = document.getElementById("hk-ifc-objs");
    if (o || (o = document.createElement("div"), o.id = "hk-ifc-objs", o.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:120;background:rgba(16,22,30,0.96);color:#cde;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:7px 9px;font:11px system-ui,sans-serif;max-height:38vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.5);min-width:220px;", document.body.appendChild(o)), !document.getElementById("hk-ifc-tab")) {
      const h = document.createElement("button");
      h.id = "hk-ifc-tab", h.textContent = "\u{1F3DB} Objetos IFC \u27E9", h.title = "Mostrar objetos IFC", h.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:121;display:none;padding:6px 12px;border:1px solid #3a4a5f;border-radius:8px;background:rgba(30,40,55,0.96);color:#9ce;cursor:pointer;font:11px system-ui;box-shadow:0 2px 8px rgba(0,0,0,.4)", h.onclick = () => Se(false), document.body.appendChild(h);
    }
    const i = Y ? "" : l.map((h, s) => {
      const I = h.color.map((u) => Math.round(u * 255)), $ = Math.round(h.positions.length / 9), w = !q.has(s) && (B < 0 || B === s);
      return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
      <input type="checkbox" data-ifc-vis="${s}" ${w ? "checked" : ""}>
      <span style="width:12px;height:12px;border-radius:2px;background:rgb(${I[0]},${I[1]},${I[2]});border:1px solid #0006;display:inline-block"></span>
      <span style="flex:1">Objeto ${s + 1}</span>
      <span style="color:#8ab">${$} \u25B3</span>
      <button data-ifc-solo="${s}" title="Aislar" style="background:#243;color:#9fd;border:1px solid #365;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px">solo</button>
    </div>`;
    }).join(""), d = (h, s, I) => `<button id="${h}" title="${I}" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:11px;padding:1px 6px;margin-left:3px">${s}</button>`;
    o.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;${Y ? "" : "margin-bottom:4px"}">
       <b style="color:#9ce">\u{1F3DB} Objetos IFC (${l.length})</b>
       <span style="white-space:nowrap">${Y ? "" : '<button id="hk-ifc-all" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 6px">ver todos</button>'}${d("hk-ifc-min", Y ? "\u25A2" : "\u2581", "Minimizar")}${d("hk-ifc-slide", "\u27E8", "Ocultar (corredizo)")}</span>
     </div>${i}`;
    const f = () => {
      var _a;
      try {
        (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
      } catch {
      }
    };
    o.querySelector("#hk-ifc-min").onclick = () => {
      Y = !Y, He(l);
    }, o.querySelector("#hk-ifc-slide").onclick = () => Se(true), o.querySelectorAll("[data-ifc-vis]").forEach((h) => {
      h.onchange = () => {
        const s = +h.dataset.ifcVis;
        B = -1, h.checked ? q.delete(s) : q.add(s), f();
      };
    }), o.querySelectorAll("[data-ifc-solo]").forEach((h) => {
      h.onclick = () => {
        const s = +h.dataset.ifcSolo;
        B = B === s ? -1 : s, q.clear(), f();
      };
    });
    const x = o.querySelector("#hk-ifc-all");
    x && (x.onclick = () => {
      q.clear(), B = -1, f();
    }), Se(Ze);
  }
  function Mo() {
    var _a, _b;
    (_a = document.getElementById("hk-ifc-objs")) == null ? void 0 : _a.remove(), (_b = document.getElementById("hk-ifc-tab")) == null ? void 0 : _b.remove();
  }
  function Ke(l, o) {
    const i = [
      0,
      1,
      2
    ].reduce((v, g) => o[1][g] - o[0][g] > o[1][v] - o[0][v] ? g : v, 0), d = [];
    for (const v of l) {
      const g = v.positions;
      for (let M = 0; M < g.length; M += 9) d.push((g[M + i] + g[M + 3 + i] + g[M + 6 + i]) / 3);
    }
    if (d.length < 2) return o;
    d.sort((v, g) => v - g);
    let f = 0, x = 0;
    for (let v = 1; v < d.length; v++) {
      const g = d[v] - d[v - 1];
      g > x && (x = g, f = v);
    }
    const h = d[d.length - 1] - d[0];
    if (x < h * 0.15) return o;
    const s = (d[f] + d[f - 1]) / 2, I = f, w = d.length - f >= I, u = [
      1e30,
      1e30,
      1e30
    ], N = [
      -1e30,
      -1e30,
      -1e30
    ];
    for (const v of l) {
      const g = v.positions;
      for (let M = 0; M < g.length; M += 9) {
        const P = (g[M + i] + g[M + 3 + i] + g[M + 6 + i]) / 3;
        if (!(w && P < s || !w && P >= s)) for (let j = 0; j < 3; j++) for (const Q of [
          0,
          3,
          6
        ]) {
          const V = g[M + Q + j];
          V < u[j] && (u[j] = V), V > N[j] && (N[j] = V);
        }
      }
    }
    return [
      u,
      N
    ];
  }
  function Xe(l, o = false) {
    var _a;
    const i = window.__hekatanIfcMesh;
    if (!i || !((_a = i.grupos) == null ? void 0 : _a.length)) return [];
    const d = Math.max(0.1, Math.min(1, l)), f = [];
    f.push(new lo(16777215, 0.75));
    const x = new Re(16777215, 0.7);
    x.position.set(1, 1, 2);
    const h = new Re(16777215, 0.4);
    return h.position.set(-1, -0.5, 1), f.push(x, h), i.grupos.forEach((s, I) => {
      if (!s.positions.length || !o && q.has(I) || !o && B >= 0 && I !== B) return;
      const $ = new $e();
      $.setAttribute("position", new ro(s.positions, 3)), $.computeVertexNormals();
      const w = new co(s.color[0], s.color[1], s.color[2]), u = new io($, new uo({
        color: w,
        emissive: w.clone().multiplyScalar(0.25),
        roughness: 0.9,
        metalness: 0,
        transparent: d < 1,
        opacity: d,
        side: fo
      }));
      o && (u.userData.refIfc = true, u.name = "ref-ifc-" + I), f.push(u);
    }), f;
  }
  function bo() {
    var _a;
    const l = window.__hekatanIfcMesh;
    return !l || !((_a = l.grupos) == null ? void 0 : _a.length) || !l.bbox ? null : Ke(l.grupos, l.bbox);
  }
  let _e, ze, Be, Ne, Ce, je, Ve, Te, F;
  Io = {
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
      const l = window.__hekatanIfcMesh;
      if (!l) return {
        IFC: "ninguno \u2014 usa \u{1F4E5} Importar IFC"
      };
      const o = l.estructura, i = {
        Archivo: String(l.archivo ?? "ifc"),
        "Objetos (colores)": String(((_a = l.grupos) == null ? void 0 : _a.length) ?? 0),
        Tri\u00E1ngulos: String(l.nTri ?? 0),
        "Tama\xF1o (m)": l.bbox ? l.bbox[1].map((d, f) => (d - l.bbox[0][f]).toFixed(1)).join(" \xD7 ") : "\u2014"
      };
      if (o) {
        const d = o.columnas + o.vigas + o.miembros + o.losas + o.muros + o.zapatas;
        i["Elementos estructurales"] = d > 0 ? `col ${o.columnas} \xB7 vig ${o.vigas} \xB7 losa ${o.losas} \xB7 muro ${o.muros}` : `0 (solo mallas${o.proxies ? ` \u2014 ${o.proxies} objetos SketchUp` : ""})`, i["Convertible a estructura"] = d > 0 ? "s\xED" : "no (IFC de arquitectura)";
      }
      return i;
    },
    build(l, o) {
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
        }, o.objects3D.val = [], Mo(), console.log("[IFC] Sin modelo. Usa '\u{1F4E5} Importar IFC'.");
        return;
      }
      const d = Xe((l.opacidad ?? 100) / 100);
      o.objects3D.val = l.caras ? d : d.filter((h) => !h.isMesh);
      try {
        (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, i.bbox[0], i.bbox[1]);
      } catch {
      }
      He(i.grupos);
      const [f, x] = Ke(i.grupos, i.bbox);
      o.nodes.val = [
        [
          f[0],
          f[1],
          f[2]
        ],
        [
          x[0],
          x[1],
          x[2]
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
  _e = 25e6;
  ze = 0.2;
  Be = _e / (2 * (1 + ze));
  Ne = 24;
  Ce = 2e8;
  je = 0.3;
  Ve = Ce / (2 * (1 + je));
  Te = 78;
  F = (l, o, i, d, f, x) => ({
    default: i,
    min: d,
    max: f,
    step: x,
    label: o,
    folder: l
  });
  function xo(l, o) {
    const i = l[o[0]], d = l[o[1]], f = l[o[2]], x = l[o[3]], h = (s, I, $) => {
      const w = [
        I[0] - s[0],
        I[1] - s[1],
        I[2] - s[2]
      ], u = [
        $[0] - s[0],
        $[1] - s[1],
        $[2] - s[2]
      ];
      return 0.5 * Math.hypot(w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]);
    };
    return h(i, d, f) + h(i, f, x);
  }
  let O, Ue;
  O = (l, o, i, d) => ({
    default: i,
    label: o,
    folder: l,
    options: d
  });
  Ue = (l) => {
    var _a, _b;
    if (Math.round(l.refIfc ?? 1) !== 1) return [];
    const o = Math.round(l.refModo ?? 0), i = o === 1 ? 0.12 : o === 2 ? 0.04 : (l.refOpac ?? 35) / 100, d = Xe(i, true);
    if (o === 2) {
      window.__hekatanRefIfcBordes = true;
      try {
        (_a = window.__hekatanRefIfcBordesRefrescar) == null ? void 0 : _a.call(window);
      } catch {
      }
    }
    const f = window.__hekatanIfcMesh;
    if (d.length && (f == null ? void 0 : f.bbox)) try {
      (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, f.bbox[0], f.bbox[1]);
    } catch {
    }
    return d;
  };
  So = {
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
      mode: O("Modo", "Espacio de trabajo", 1, {
        "2D (plano XZ \u2014 elevaci\xF3n)": 0,
        "3D (espacial)": 1
      }),
      mat: O("Secci\xF3n frames", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      bCol: F("Secci\xF3n frames", "b columna (m)", 0.4, 0.1, 1, 0.05),
      hCol: F("Secci\xF3n frames", "h columna (m)", 0.4, 0.1, 1, 0.05),
      bViga: F("Secci\xF3n frames", "b viga (m)", 0.3, 0.1, 0.8, 0.05),
      hViga: F("Secci\xF3n frames", "h viga (m)", 0.5, 0.1, 1, 0.05),
      tShell: F("Secci\xF3n shells", "Espesor shell (m)", 0.2, 0.05, 1, 0.01),
      matShell: O("Secci\xF3n shells", "Material shell", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      formaPlaca: O("Secci\xF3n shells", "Formulaci\xF3n placa", 0, {
        "Shell-Thick (Mindlin)": 0,
        "Shell-Thin (Kirchhoff)": 1,
        Membrana: 2
      }),
      mallaZapata: F("\u{1F9F0} Zapata / Suelo", "Malla del \xE1rea (nx = ny)", 1, 1, 12, 1),
      ksSuelo: F("\u{1F9F0} Zapata / Suelo", "Suelo ks (tonf/m\xB3, 0 = off)", 0, 0, 8e3, 50),
      apoyo: O("Apoyos", "Tipo apoyo en Z m\xEDnimo", 3, {
        "Empotrado (6 DOFs)": 0,
        "Articulado (3 trans.)": 1,
        "R\xF3tula (Ux,Uz, libre Uy/R)": 2,
        "Sin apoyo autom\xE1tico": 3
      }),
      aplicarCargas: O("Cargas", "Aplicar cargas auto", 0, {
        S\u00ED: 1,
        No: 0
      }),
      patronCargas: O("Cargas", "Pertenecen al patron", 0, {
        Dead: 0,
        Live: 1
      }),
      Fz: F("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
      Fx: F("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),
      autoSolve: O("Solver", "Auto-resolver", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refIfc: O("\u{1F3DB} Referencia IFC", "Mostrar IFC de fondo", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refOpac: F("\u{1F3DB} Referencia IFC", "Opacidad (%)", 35, 10, 100, 5),
      refModo: O("\u{1F3DB} Referencia IFC", "Ver como", 0, {
        "S\xF3lido tenue": 0,
        "Transparente (ver por dentro)": 1,
        "Solo bordes (l\xEDneas)": 2
      })
    },
    build(l, o) {
      var _a, _b, _c;
      const i = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], d = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], f = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], x = new Set(f);
      if (!i.length) {
        const n = Math.round(l.refIfc ?? 1) === 1 ? bo() : null;
        o.nodes.val = n ? [
          n[0],
          n[1]
        ] : [], o.elements.val = [], o.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, o.elementInputs.val = {}, o.objects3D.val = Ue(l), console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const h = Math.round(l.mode ?? 1) === 0, s = i.map((n) => h ? [
        n[0],
        0,
        n[2]
      ] : [
        n[0],
        n[1],
        n[2]
      ]), I = 1e-4, $ = new Int32Array(s.length);
      {
        const n = /* @__PURE__ */ new Map();
        for (let t = 0; t < s.length; t++) {
          const e = s[t].map((r) => Math.round(r / I)).join(","), a = n.get(e);
          a === void 0 ? (n.set(e, t), $[t] = t) : $[t] = a;
        }
      }
      const w = (n) => n >= 0 && n < $.length ? $[n] : n, u = [], N = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), M = Math.max(1, Math.round(l.mallaZapata ?? 1)), P = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Set(), Q = 1e-3, V = (n) => `${Math.round(n[0] / Q)},${Math.round(n[1] / Q)},${Math.round(n[2] / Q)}`, ce = /* @__PURE__ */ new Map();
      for (let n = 0; n < s.length; n++) ce.set(V(s[n]), w(n));
      const W = /* @__PURE__ */ new Map();
      for (let n = 0; n < d.length; n++) {
        const t = d[n];
        if (x.has(n)) {
          const e = (t.length === 5 ? t.slice(0, 4) : t.slice(0, Math.min(4, t.length))).map(w);
          if (e.length !== 4 || e.some((a) => s[a] === void 0)) continue;
          if (M <= 1) {
            const a = u.length;
            u.push(e), g.add(a), P.add(a);
            for (const r of e) j.add(r);
          } else {
            const [a, r, c, b] = e, y = s[a], k = s[r], S = s[c], C = s[b], _ = (p, m) => [
              (1 - p) * (1 - m) * y[0] + p * (1 - m) * k[0] + p * m * S[0] + (1 - p) * m * C[0],
              (1 - p) * (1 - m) * y[1] + p * (1 - m) * k[1] + p * m * S[1] + (1 - p) * m * C[1],
              (1 - p) * (1 - m) * y[2] + p * (1 - m) * k[2] + p * m * S[2] + (1 - p) * m * C[2]
            ], A = [];
            for (let p = 0; p <= M; p++) {
              const m = [];
              for (let z = 0; z <= M; z++) if (p === 0 && z === 0) m.push(a);
              else if (p === M && z === 0) m.push(r);
              else if (p === M && z === M) m.push(c);
              else if (p === 0 && z === M) m.push(b);
              else {
                const U = _(p / M, z / M), Z = V(U);
                let L = ce.get(Z);
                L === void 0 && (L = s.length, s.push(U), ce.set(Z, L)), m.push(L);
              }
              A.push(m);
            }
            for (let p = 0; p < M; p++) for (let m = 0; m < M; m++) {
              const z = [
                A[p][m],
                A[p + 1][m],
                A[p + 1][m + 1],
                A[p][m + 1]
              ], U = u.length;
              u.push(z), g.add(U), P.add(U);
              for (const Z of z) j.add(Z);
            }
          }
        } else for (let e = 0; e < t.length - 1; e++) {
          const a = w(t[e]), r = w(t[e + 1]);
          if (a === r || s[a] === void 0 || s[r] === void 0) continue;
          const c = u.length;
          u.push([
            a,
            r
          ]), W.set(`${n}:${e}`, c);
          const b = s[r][0] - s[a][0], y = s[r][1] - s[a][1], k = s[r][2] - s[a][2];
          Math.abs(k) > Math.max(Math.abs(b), Math.abs(y)) ? N.add(c) : v.add(c);
        }
      }
      const te = Math.round(l.mat ?? 0), Ge = te === 0 ? _e : Ce, Je = te === 0 ? Be : Ve, Ye = te === 0 ? ze : je, qe = te === 0 ? Ne : Te, se = Math.round(l.matShell ?? 0), Qe = se === 0 ? _e : Ce, We = se === 0 ? Be : Ve, eo = se === 0 ? ze : je, oo = se === 0 ? Ne : Te, H = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map();
      for (let n = 0; n < u.length; n++) if (g.has(n)) H.set(n, Qe), ae.set(n, We), ee.set(n, oo), oe.set(n, eo), ie.set(n, l.tShell ?? 0.2), de.set(n, Math.round(l.formaPlaca ?? 0));
      else {
        const t = N.has(n), e = t ? l.bCol : l.bViga, a = t ? l.hCol : l.hViga, r = e * a, c = a * Math.pow(e, 3) / 12, b = e * Math.pow(a, 3) / 12, y = 0.14 * Math.pow(Math.min(e, a), 4);
        H.set(n, Ge), ae.set(n, Je), K.set(n, r), X.set(n, c), G.set(n, b), J.set(n, y), ee.set(n, qe), oe.set(n, Ye);
      }
      const ue = window.__hekatanManualSections;
      if (ue && ue.size > 0) for (const [n, t] of ue.entries()) {
        const e = W.get(n);
        e === void 0 || g.has(e) || (t.A != null && K.set(e, t.A), t.Iz != null && X.set(e, t.Iz), t.Iy != null && G.set(e, t.Iy), t.J != null && J.set(e, t.J));
      }
      const Ae = window.__hekatanMaterialDB, fe = window.__hekatanManualMaterial;
      if (fe && fe.size > 0 && Ae) for (const [n, t] of fe.entries()) {
        const e = W.get(n);
        if (e === void 0 || g.has(e)) continue;
        const a = Ae[t];
        if (!a) continue;
        H.set(e, a.E);
        const r = a.E / (2 * (1 + a.nu));
        ae.set(e, r), ee.set(e, a.rho), oe.set(e, a.nu);
      }
      const pe = window.__hekatanManualModifiers;
      if (pe && pe.size > 0) for (const [n, t] of pe.entries()) {
        const e = W.get(n);
        if (e === void 0 || g.has(e)) continue;
        const a = K.get(e);
        a != null && K.set(e, a * t.A);
        const r = X.get(e);
        r != null && X.set(e, r * t.Iz);
        const c = G.get(e);
        c != null && G.set(e, c * t.Iy);
        const b = J.get(e);
        b != null && J.set(e, b * t.J);
      }
      const he = Math.round(l.apoyo ?? 0), E = /* @__PURE__ */ new Map();
      if (s.length > 0 && he !== 3) {
        const n = Math.min(...s.map((e) => e[2])), t = he === 0 ? [
          true,
          true,
          true,
          true,
          true,
          true
        ] : he === 1 ? [
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
        for (let e = 0; e < s.length; e++) Math.abs(s[e][2] - n) < 1e-6 && E.set(e, [
          ...t
        ]);
      }
      const me = window.__hekatanManualSupports;
      if (me && me.size > 0) for (const [n, t] of me.entries()) n >= 0 && n < s.length && E.set(w(n), [
        ...t
      ]);
      const no = Math.round(l.patronCargas ?? 0) === 1 ? "Live" : "Dead", to = window.__hekatanActiveCase, De = (() => {
        var _a2;
        const t = (((_a2 = o.loadCases) == null ? void 0 : _a2.val) ?? []).find((e) => e.name === to);
        return t ? (t.patterns ?? []).map((e) => e.pattern) : [];
      })(), ge = De.length === 0 || De.includes(no), T = /* @__PURE__ */ new Map();
      if (ge && Math.round(l.aplicarCargas ?? 1) === 1 && s.length > 0) {
        const n = Math.max(...s.map((a) => a[2])), t = l.Fx ?? 0, e = l.Fz ?? -10;
        for (let a = 0; a < s.length; a++) Math.abs(s[a][2] - n) < 1e-6 && T.set(a, [
          t,
          0,
          e,
          0,
          0,
          0
        ]);
      }
      const we = window.__hekatanManualLoads;
      if (ge && we && we.size > 0) for (const [n, t] of we.entries()) n >= 0 && n < s.length && T.set(w(n), [
        ...t
      ]);
      const Me = window.__hekatanManualDistLoads, ne = /* @__PURE__ */ new Map();
      for (const [n, t] of T) ne.set(n, [
        ...t
      ]);
      const be = /* @__PURE__ */ new Map(), Fe = [];
      if (ge && Me && Me.size > 0) {
        const n = (t, e) => {
          const a = ne.get(t) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          ne.set(t, [
            a[0] + e[0],
            a[1] + e[1],
            a[2] + e[2],
            a[3] + e[3],
            a[4] + e[4],
            a[5] + e[5]
          ]);
        };
        for (const [t, e] of Me.entries()) {
          const a = W.get(t);
          if (a === void 0 || g.has(a)) continue;
          const r = u[a], c = s[r[0]], b = s[r[1]], y = [
            b[0] - c[0],
            b[1] - c[1],
            b[2] - c[2]
          ], k = Math.hypot(y[0], y[1], y[2]);
          if (k < 1e-9) continue;
          const S = [
            y[0] / k,
            y[1] / k,
            y[2] / k
          ], C = k * k / 12, _ = [
            S[1] * e[2] - S[2] * e[1],
            S[2] * e[0] - S[0] * e[2],
            S[0] * e[1] - S[1] * e[0]
          ];
          n(w(r[0]), [
            e[0] * k / 2,
            e[1] * k / 2,
            e[2] * k / 2,
            C * _[0],
            C * _[1],
            C * _[2]
          ]), n(w(r[1]), [
            e[0] * k / 2,
            e[1] * k / 2,
            e[2] * k / 2,
            -C * _[0],
            -C * _[1],
            -C * _[2]
          ]), be.set(a, [
            e[0],
            e[1],
            e[2]
          ]);
          const A = Math.hypot(e[0], e[1], e[2]);
          if (A < 1e-9) continue;
          const p = [
            e[0] / A,
            e[1] / A,
            e[2] / A
          ], m = Math.min(1.2, Math.max(0.25, 0.08 * A)) * (l.escalaCargaQ ?? 1), z = Math.max(2, Math.round(k / 0.5)) + 1, U = 16347926, Z = new po({
            color: U,
            depthTest: false,
            transparent: true,
            opacity: 0.95
          }), L = [], Oe = [];
          for (let ve = 0; ve < z; ve++) {
            const Ie = ve / (z - 1), R = new re(c[0] + y[0] * Ie, c[1] + y[1] * Ie, c[2] + y[2] * Ie), Pe = new re(R.x - p[0] * m, R.y - p[1] * m, R.z - p[2] * m);
            L.push(Pe, R), Oe.push(Pe);
            const Ee = new re(S[0], S[1], S[2]).multiplyScalar(m * 0.18), Le = new re(p[0], p[1], p[2]).multiplyScalar(-m * 0.3);
            L.push(R.clone(), R.clone().add(Le).add(Ee), R.clone(), R.clone().add(Le).sub(Ee));
          }
          const so = new $e().setFromPoints(L), ke = new ho(so, Z);
          ke.renderOrder = 998, ke.frustumCulled = false;
          const ao = new $e().setFromPoints(Oe), ye = new mo(ao, Z);
          ye.renderOrder = 998, ye.frustumCulled = false, Fe.push(ke, ye);
        }
      }
      if (new URLSearchParams(window.location.search).get("heks") || new URLSearchParams(window.location.search).get("m")) {
        o.nodes.val = [], o.elements.val = [], o.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        };
        return;
      }
      o.nodes.val = s, o.elements.val = u, o.nodeInputs.val = {
        supports: E,
        loads: T
      }, o.elementInputs.val = {
        elasticities: H,
        shearModuli: ae,
        areas: K,
        momentsOfInertiaY: X,
        momentsOfInertiaZ: G,
        torsionalConstants: J,
        densities: ee,
        poissonsRatios: oe,
        thicknesses: ie,
        plateFormulations: de,
        frameLoads: be
      }, o.objects3D.val = [
        ...Ue(l),
        ...Fe
      ], window.__hekatanModeloAHeks = () => {
        const n = (r) => String(+(+r).toFixed(6)), t = (r) => String(typeof r == "number" ? +r.toPrecision(6) : r), e = (r) => t((ee.get(r) ?? 0) / 9.80665), a = [
          "# Hekatan Struct \xB7 modelo dibujado (" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ")",
          "# unidades: m, kN, kN/m"
        ];
        s.forEach((r, c) => a.push(`node ${c + 1} ${n(r[0])} ${n(r[1])} ${n(r[2])}`)), u.forEach((r, c) => {
          const b = r.map((y) => y + 1).join(" ");
          g.has(c) ? a.push(`shell ${c + 1} ${b} ${t(ie.get(c))} ${t(H.get(c))} 0 ${e(c)}`) : a.push(`frame ${c + 1} ${b} ${t(H.get(c))} ${t(K.get(c))} ${t(X.get(c))} ${t(G.get(c))} ${t(J.get(c))} ${t(oe.get(c))} ${e(c)}`);
        });
        for (const [r, c] of de) c === 1 && a.push(`shelltype ${r + 1} thin`);
        for (const [r, c] of E) a.push(`support ${r + 1} ${c.map((b) => b ? 1 : 0).join(" ")}`);
        for (const [r, c] of T) c.some((b) => b !== 0) && a.push(`load ${r + 1} ${c.join(" ")}`);
        for (const [r, c] of be) a.push(`frameload ${r + 1} ${c.join(" ")}`);
        for (const r of D) a.push(`spring ${r.node + 1} ${[
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
      const D = [], xe = window.__hekatanManualSprings;
      if (xe && xe.size > 0) {
        for (const [n, t] of xe.entries()) if (!(n < 0 || n >= s.length)) for (let e = 0; e < 6; e++) t[e] !== 0 && D.push({
          node: w(n),
          dof: e,
          k: t[e]
        });
      }
      const le = (l.ksSuelo ?? 0) * 9.80665;
      if (le > 0 && j.size > 0) {
        const n = /* @__PURE__ */ new Map();
        for (const t of P) {
          const e = u[t], a = xo(s, e);
          for (const r of e) n.set(r, (n.get(r) ?? 0) + a / 4);
        }
        for (const [t, e] of n) {
          const a = le * e;
          D.push({
            node: t,
            dof: 2,
            k: a
          }), D.push({
            node: t,
            dof: 0,
            k: a * 0.5
          }), D.push({
            node: t,
            dof: 1,
            k: a * 0.5
          });
        }
      }
      if (Math.round(l.autoSolve ?? 1) === 1 && s.length > 0 && u.length > 0 && (E.size > 0 || D.length > 0) && ne.size > 0) try {
        if (o.deformOutputs.val = wo(s, u, {
          supports: E,
          loads: ne
        }, o.elementInputs.val, D.length > 0 ? D : void 0), o.analyzeOutputs.val = go(s, u, o.elementInputs.val, o.deformOutputs.rawVal), le > 0 && P.size > 0) try {
          const t = o.deformOutputs.rawVal.deformations, e = o.analyzeOutputs.rawVal ?? {}, a = /* @__PURE__ */ new Map();
          let r = 0, c = 0;
          for (const b of P) {
            const k = u[b].map((S) => {
              var _a2;
              const C = ((_a2 = t.get(S)) == null ? void 0 : _a2[2]) ?? 0, _ = le * C;
              return _ < r && (r = _), _ > c && (c = _), _;
            });
            a.set(b, k);
          }
          e.pressure = a, e.colorMapRanges = {
            ...e.colorMapRanges ?? {},
            pressure: [
              c,
              r
            ]
          }, o.analyzeOutputs.val = e;
        } catch (t) {
          console.warn("[NewBlank] presi\xF3n:", (t == null ? void 0 : t.message) ?? t);
        }
        const n = /* @__PURE__ */ new Set();
        for (const t of u) for (const e of t) n.add(e);
        console.log(`[NewBlank] Solve OK \u2014 ${n.size} nudos (de ${s.length} puntos), ${u.length} elementos, ${E.size} apoyos, ${T.size} cargas, ${D.length} springs`);
      } catch (n) {
        console.warn(`[NewBlank] Solver fall\xF3: ${n.message}`);
      }
      else console.log(`[NewBlank] mode=${h ? "2D" : "3D"} | nodes=${s.length} elem=${u.length} cols=${N.size} vigas=${v.size} shells=${g.size} apoyos=${E.size} cargas=${T.size} springs=${D.length}`);
    },
    computedLabels(l, o) {
      const i = {}, d = o.nodes.val.length;
      o.elements.val.length;
      let f = 0, x = 0;
      for (const h of o.elements.val) h.length === 4 ? x++ : f++;
      return i.Stats = `${d} nodos \xB7 ${f} frames \xB7 ${x} shells`, d === 0 && (i["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), i;
    }
  };
});
export {
  __tla,
  Io as i,
  So as n
};
