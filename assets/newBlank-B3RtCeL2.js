import { A as ln, t as Re, B as ke, F as rn, u as cn, M as dn, e as un, D as fn, b as pn, V as re, L as hn, d as mn } from "./theme-C-zoknmI.js";
import { a as gn } from "./analyze-DgLgRmKg.js";
import { d as wn, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let In, Sn;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const H = /* @__PURE__ */ new Set();
  let R = -1, Ze = false, q = true;
  function ye(s) {
    Ze = s;
    const n = document.getElementById("hk-ifc-objs"), r = document.getElementById("hk-ifc-tab");
    n && (n.style.transition = "transform .25s ease, opacity .25s ease", n.style.transform = s ? "translateX(-50%) translateY(130%)" : "translateX(-50%)", n.style.opacity = s ? "0" : "", n.style.pointerEvents = s ? "none" : ""), r && (r.style.display = s ? "block" : "none");
  }
  function qe(s) {
    let n = document.getElementById("hk-ifc-objs");
    if (n || (n = document.createElement("div"), n.id = "hk-ifc-objs", n.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:120;background:rgba(16,22,30,0.96);color:#cde;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:7px 9px;font:11px system-ui,sans-serif;max-height:38vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.5);min-width:220px;", document.body.appendChild(n)), !document.getElementById("hk-ifc-tab")) {
      const f = document.createElement("button");
      f.id = "hk-ifc-tab", f.textContent = "\u{1F3DB} Objetos IFC \u27E9", f.title = "Mostrar objetos IFC", f.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:121;display:none;padding:6px 12px;border:1px solid #3a4a5f;border-radius:8px;background:rgba(30,40,55,0.96);color:#9ce;cursor:pointer;font:11px system-ui;box-shadow:0 2px 8px rgba(0,0,0,.4)", f.onclick = () => ye(false), document.body.appendChild(f);
    }
    const r = q ? "" : s.map((f, t) => {
      const k = f.color.map((d) => Math.round(d * 255)), _ = Math.round(f.positions.length / 9), g = !H.has(t) && (R < 0 || R === t);
      return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
      <input type="checkbox" data-ifc-vis="${t}" ${g ? "checked" : ""}>
      <span style="width:12px;height:12px;border-radius:2px;background:rgb(${k[0]},${k[1]},${k[2]});border:1px solid #0006;display:inline-block"></span>
      <span style="flex:1">Objeto ${t + 1}</span>
      <span style="color:#8ab">${_} \u25B3</span>
      <button data-ifc-solo="${t}" title="Aislar" style="background:#243;color:#9fd;border:1px solid #365;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px">solo</button>
    </div>`;
    }).join(""), c = (f, t, k) => `<button id="${f}" title="${k}" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:11px;padding:1px 6px;margin-left:3px">${t}</button>`;
    n.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;${q ? "" : "margin-bottom:4px"}">
       <b style="color:#9ce">\u{1F3DB} Objetos IFC (${s.length})</b>
       <span style="white-space:nowrap">${q ? "" : '<button id="hk-ifc-all" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 6px">ver todos</button>'}${c("hk-ifc-min", q ? "\u25A2" : "\u2581", "Minimizar")}${c("hk-ifc-slide", "\u27E8", "Ocultar (corredizo)")}</span>
     </div>${r}`;
    const i = () => {
      var _a;
      try {
        (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
      } catch {
      }
    };
    n.querySelector("#hk-ifc-min").onclick = () => {
      q = !q, qe(s);
    }, n.querySelector("#hk-ifc-slide").onclick = () => ye(true), n.querySelectorAll("[data-ifc-vis]").forEach((f) => {
      f.onchange = () => {
        const t = +f.dataset.ifcVis;
        R = -1, f.checked ? H.delete(t) : H.add(t), i();
      };
    }), n.querySelectorAll("[data-ifc-solo]").forEach((f) => {
      f.onclick = () => {
        const t = +f.dataset.ifcSolo;
        R = R === t ? -1 : t, H.clear(), i();
      };
    });
    const M = n.querySelector("#hk-ifc-all");
    M && (M.onclick = () => {
      H.clear(), R = -1, i();
    }), ye(Ze);
  }
  function Mn() {
    var _a, _b;
    (_a = document.getElementById("hk-ifc-objs")) == null ? void 0 : _a.remove(), (_b = document.getElementById("hk-ifc-tab")) == null ? void 0 : _b.remove();
  }
  function He(s, n) {
    const r = [
      0,
      1,
      2
    ].reduce((v, m) => n[1][m] - n[0][m] > n[1][v] - n[0][v] ? m : v, 0), c = [];
    for (const v of s) {
      const m = v.positions;
      for (let w = 0; w < m.length; w += 9) c.push((m[w + r] + m[w + 3 + r] + m[w + 6 + r]) / 3);
    }
    if (c.length < 2) return n;
    c.sort((v, m) => v - m);
    let i = 0, M = 0;
    for (let v = 1; v < c.length; v++) {
      const m = c[v] - c[v - 1];
      m > M && (M = m, i = v);
    }
    const f = c[c.length - 1] - c[0];
    if (M < f * 0.15) return n;
    const t = (c[i] + c[i - 1]) / 2, k = i, g = c.length - i >= k, d = [
      1e30,
      1e30,
      1e30
    ], B = [
      -1e30,
      -1e30,
      -1e30
    ];
    for (const v of s) {
      const m = v.positions;
      for (let w = 0; w < m.length; w += 9) {
        const P = (m[w + r] + m[w + 3 + r] + m[w + 6 + r]) / 3;
        if (!(g && P < t || !g && P >= t)) for (let A = 0; A < 3; A++) for (const K of [
          0,
          3,
          6
        ]) {
          const V = m[w + K + A];
          V < d[A] && (d[A] = V), V > B[A] && (B[A] = V);
        }
      }
    }
    return [
      d,
      B
    ];
  }
  function Ke(s, n = false) {
    var _a;
    const r = window.__hekatanIfcMesh;
    if (!r || !((_a = r.grupos) == null ? void 0 : _a.length)) return [];
    const c = Math.max(0.1, Math.min(1, s)), i = [];
    i.push(new ln(16777215, 0.75));
    const M = new Re(16777215, 0.7);
    M.position.set(1, 1, 2);
    const f = new Re(16777215, 0.4);
    return f.position.set(-1, -0.5, 1), i.push(M, f), r.grupos.forEach((t, k) => {
      if (!t.positions.length || !n && H.has(k) || !n && R >= 0 && k !== R) return;
      const _ = new ke();
      _.setAttribute("position", new rn(t.positions, 3)), _.computeVertexNormals();
      const g = new cn(t.color[0], t.color[1], t.color[2]), d = new dn(_, new un({
        color: g,
        emissive: g.clone().multiplyScalar(0.25),
        roughness: 0.9,
        metalness: 0,
        transparent: c < 1,
        opacity: c,
        side: fn
      }));
      n && (d.userData.refIfc = true, d.name = "ref-ifc-" + k), i.push(d);
    }), i;
  }
  function bn() {
    var _a;
    const s = window.__hekatanIfcMesh;
    return !s || !((_a = s.grupos) == null ? void 0 : _a.length) || !s.bbox ? null : He(s.grupos, s.bbox);
  }
  let Ie, Se, Be, Ve, _e, ze, Ne, Te, F;
  In = {
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
      const n = s.estructura, r = {
        Archivo: String(s.archivo ?? "ifc"),
        "Objetos (colores)": String(((_a = s.grupos) == null ? void 0 : _a.length) ?? 0),
        Tri\u00E1ngulos: String(s.nTri ?? 0),
        "Tama\xF1o (m)": s.bbox ? s.bbox[1].map((c, i) => (c - s.bbox[0][i]).toFixed(1)).join(" \xD7 ") : "\u2014"
      };
      if (n) {
        const c = n.columnas + n.vigas + n.miembros + n.losas + n.muros + n.zapatas;
        r["Elementos estructurales"] = c > 0 ? `col ${n.columnas} \xB7 vig ${n.vigas} \xB7 losa ${n.losas} \xB7 muro ${n.muros}` : `0 (solo mallas${n.proxies ? ` \u2014 ${n.proxies} objetos SketchUp` : ""})`, r["Convertible a estructura"] = c > 0 ? "s\xED" : "no (IFC de arquitectura)";
      }
      return r;
    },
    build(s, n) {
      var _a, _b;
      const r = window.__hekatanIfcMesh;
      if (!r || !((_a = r.grupos) == null ? void 0 : _a.length)) {
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
        }, n.objects3D.val = [], Mn(), console.log("[IFC] Sin modelo. Usa '\u{1F4E5} Importar IFC'.");
        return;
      }
      const c = Ke((s.opacidad ?? 100) / 100);
      n.objects3D.val = s.caras ? c : c.filter((f) => !f.isMesh);
      try {
        (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, r.bbox[0], r.bbox[1]);
      } catch {
      }
      qe(r.grupos);
      const [i, M] = He(r.grupos, r.bbox);
      n.nodes.val = [
        [
          i[0],
          i[1],
          i[2]
        ],
        [
          M[0],
          M[1],
          M[2]
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
      }, console.log(`[IFC] ${r.grupos.length} objetos, ${r.nTri ?? "?"} tri\xE1ngulos.`);
    }
  };
  Ie = 25e6;
  Se = 0.2;
  Be = Ie / (2 * (1 + Se));
  Ve = 24;
  _e = 2e8;
  ze = 0.3;
  Ne = _e / (2 * (1 + ze));
  Te = 78;
  F = (s, n, r, c, i, M) => ({
    default: r,
    min: c,
    max: i,
    step: M,
    label: n,
    folder: s
  });
  function xn(s, n) {
    const r = s[n[0]], c = s[n[1]], i = s[n[2]], M = s[n[3]], f = (t, k, _) => {
      const g = [
        k[0] - t[0],
        k[1] - t[1],
        k[2] - t[2]
      ], d = [
        _[0] - t[0],
        _[1] - t[1],
        _[2] - t[2]
      ];
      return 0.5 * Math.hypot(g[1] * d[2] - g[2] * d[1], g[2] * d[0] - g[0] * d[2], g[0] * d[1] - g[1] * d[0]);
    };
    return f(r, c, i) + f(r, i, M);
  }
  let j, Ue;
  j = (s, n, r, c) => ({
    default: r,
    label: n,
    folder: s,
    options: c
  });
  Ue = (s) => {
    var _a, _b;
    if (Math.round(s.refIfc ?? 1) !== 1) return [];
    const n = Math.round(s.refModo ?? 0), r = n === 1 ? 0.12 : n === 2 ? 0.04 : (s.refOpac ?? 35) / 100, c = Ke(r, true);
    if (n === 2) {
      window.__hekatanRefIfcBordes = true;
      try {
        (_a = window.__hekatanRefIfcBordesRefrescar) == null ? void 0 : _a.call(window);
      } catch {
      }
    }
    const i = window.__hekatanIfcMesh;
    if (c.length && (i == null ? void 0 : i.bbox)) try {
      (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, i.bbox[0], i.bbox[1]);
    } catch {
    }
    return c;
  };
  Sn = {
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
      mode: j("Modo", "Espacio de trabajo", 1, {
        "2D (plano XZ \u2014 elevaci\xF3n)": 0,
        "3D (espacial)": 1
      }),
      mat: j("Secci\xF3n frames", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      bCol: F("Secci\xF3n frames", "b columna (m)", 0.4, 0.1, 1, 0.05),
      hCol: F("Secci\xF3n frames", "h columna (m)", 0.4, 0.1, 1, 0.05),
      bViga: F("Secci\xF3n frames", "b viga (m)", 0.3, 0.1, 0.8, 0.05),
      hViga: F("Secci\xF3n frames", "h viga (m)", 0.5, 0.1, 1, 0.05),
      tShell: F("Secci\xF3n shells", "Espesor shell (m)", 0.2, 0.05, 1, 0.01),
      matShell: j("Secci\xF3n shells", "Material shell", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      formaPlaca: j("Secci\xF3n shells", "Formulaci\xF3n placa", 0, {
        "Shell-Thick (Mindlin)": 0,
        "Shell-Thin (Kirchhoff)": 1,
        Membrana: 2
      }),
      mallaZapata: F("\u{1F9F0} Zapata / Suelo", "Malla del \xE1rea (nx = ny)", 1, 1, 12, 1),
      ksSuelo: F("\u{1F9F0} Zapata / Suelo", "Suelo ks (tonf/m\xB3, 0 = off)", 0, 0, 8e3, 50),
      apoyo: j("Apoyos", "Tipo apoyo en Z m\xEDnimo", 3, {
        "Empotrado (6 DOFs)": 0,
        "Articulado (3 trans.)": 1,
        "R\xF3tula (Ux,Uz, libre Uy/R)": 2,
        "Sin apoyo autom\xE1tico": 3
      }),
      aplicarCargas: j("Cargas", "Aplicar cargas auto", 0, {
        S\u00ED: 1,
        No: 0
      }),
      patronCargas: j("Cargas", "Pertenecen al patron", 0, {
        Dead: 0,
        Live: 1
      }),
      Fz: F("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
      Fx: F("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),
      autoSolve: j("Solver", "Auto-resolver", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refIfc: j("\u{1F3DB} Referencia IFC", "Mostrar IFC de fondo", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refOpac: F("\u{1F3DB} Referencia IFC", "Opacidad (%)", 35, 10, 100, 5),
      refModo: j("\u{1F3DB} Referencia IFC", "Ver como", 0, {
        "S\xF3lido tenue": 0,
        "Transparente (ver por dentro)": 1,
        "Solo bordes (l\xEDneas)": 2
      })
    },
    build(s, n) {
      var _a, _b, _c;
      const r = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], c = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], i = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], M = new Set(i);
      if (!r.length) {
        const o = Math.round(s.refIfc ?? 1) === 1 ? bn() : null;
        n.nodes.val = o ? [
          o[0],
          o[1]
        ] : [], n.elements.val = [], n.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, n.elementInputs.val = {}, n.objects3D.val = Ue(s), console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const f = Math.round(s.mode ?? 1) === 0, t = r.map((o) => f ? [
        o[0],
        0,
        o[2]
      ] : [
        o[0],
        o[1],
        o[2]
      ]), k = 1e-4, _ = new Int32Array(t.length);
      {
        const o = /* @__PURE__ */ new Map();
        for (let a = 0; a < t.length; a++) {
          const e = t[a].map((p) => Math.round(p / k)).join(","), l = o.get(e);
          l === void 0 ? (o.set(e, a), _[a] = a) : _[a] = l;
        }
      }
      const g = (o) => o >= 0 && o < _.length ? _[o] : o, d = [], B = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), w = Math.max(1, Math.round(s.mallaZapata ?? 1)), P = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Set(), K = 1e-3, V = (o) => `${Math.round(o[0] / K)},${Math.round(o[1] / K)},${Math.round(o[2] / K)}`, ce = /* @__PURE__ */ new Map();
      for (let o = 0; o < t.length; o++) ce.set(V(t[o]), g(o));
      const X = /* @__PURE__ */ new Map();
      for (let o = 0; o < c.length; o++) {
        const a = c[o];
        if (M.has(o)) {
          const e = (a.length === 5 ? a.slice(0, 4) : a.slice(0, Math.min(4, a.length))).map(g);
          if (e.length !== 4 || e.some((l) => t[l] === void 0)) continue;
          if (w <= 1) {
            const l = d.length;
            d.push(e), m.add(l), P.add(l);
            for (const p of e) A.add(p);
          } else {
            const [l, p, b, I] = e, y = t[l], x = t[p], S = t[b], $ = t[I], z = (u, h) => [
              (1 - u) * (1 - h) * y[0] + u * (1 - h) * x[0] + u * h * S[0] + (1 - u) * h * $[0],
              (1 - u) * (1 - h) * y[1] + u * (1 - h) * x[1] + u * h * S[1] + (1 - u) * h * $[1],
              (1 - u) * (1 - h) * y[2] + u * (1 - h) * x[2] + u * h * S[2] + (1 - u) * h * $[2]
            ], D = [];
            for (let u = 0; u <= w; u++) {
              const h = [];
              for (let C = 0; C <= w; C++) if (u === 0 && C === 0) h.push(l);
              else if (u === w && C === 0) h.push(p);
              else if (u === w && C === w) h.push(b);
              else if (u === 0 && C === w) h.push(I);
              else {
                const T = z(u / w, C / w), U = V(T);
                let E = ce.get(U);
                E === void 0 && (E = t.length, t.push(T), ce.set(U, E)), h.push(E);
              }
              D.push(h);
            }
            for (let u = 0; u < w; u++) for (let h = 0; h < w; h++) {
              const C = [
                D[u][h],
                D[u + 1][h],
                D[u + 1][h + 1],
                D[u][h + 1]
              ], T = d.length;
              d.push(C), m.add(T), P.add(T);
              for (const U of C) A.add(U);
            }
          }
        } else for (let e = 0; e < a.length - 1; e++) {
          const l = g(a[e]), p = g(a[e + 1]);
          if (l === p || t[l] === void 0 || t[p] === void 0) continue;
          const b = d.length;
          d.push([
            l,
            p
          ]), X.set(`${o}:${e}`, b);
          const I = t[p][0] - t[l][0], y = t[p][1] - t[l][1], x = t[p][2] - t[l][2];
          Math.abs(x) > Math.max(Math.abs(I), Math.abs(y)) ? B.add(b) : v.add(b);
        }
      }
      const ee = Math.round(s.mat ?? 0), Xe = ee === 0 ? Ie : _e, Ge = ee === 0 ? Be : Ne, Je = ee === 0 ? Se : ze, Ye = ee === 0 ? Ve : Te, ne = Math.round(s.matShell ?? 0), Qe = ne === 0 ? Ie : _e, We = ne === 0 ? Be : Ne, en = ne === 0 ? Se : ze, nn = ne === 0 ? Ve : Te, oe = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), Ce = /* @__PURE__ */ new Map(), $e = /* @__PURE__ */ new Map();
      for (let o = 0; o < d.length; o++) if (m.has(o)) oe.set(o, Qe), te.set(o, We), se.set(o, nn), ae.set(o, en), Ce.set(o, s.tShell ?? 0.2), $e.set(o, Math.round(s.formaPlaca ?? 0));
      else {
        const a = B.has(o), e = a ? s.bCol : s.bViga, l = a ? s.hCol : s.hViga, p = e * l, b = l * Math.pow(e, 3) / 12, I = e * Math.pow(l, 3) / 12, y = 0.14 * Math.pow(Math.min(e, l), 4);
        oe.set(o, Xe), te.set(o, Ge), G.set(o, p), J.set(o, b), Y.set(o, I), Q.set(o, y), se.set(o, Ye), ae.set(o, Je);
      }
      const ie = window.__hekatanManualSections;
      if (ie && ie.size > 0) for (const [o, a] of ie.entries()) {
        const e = X.get(o);
        e === void 0 || m.has(e) || (a.A != null && G.set(e, a.A), a.Iz != null && J.set(e, a.Iz), a.Iy != null && Y.set(e, a.Iy), a.J != null && Q.set(e, a.J));
      }
      const Ae = window.__hekatanMaterialDB, de = window.__hekatanManualMaterial;
      if (de && de.size > 0 && Ae) for (const [o, a] of de.entries()) {
        const e = X.get(o);
        if (e === void 0 || m.has(e)) continue;
        const l = Ae[a];
        if (!l) continue;
        oe.set(e, l.E);
        const p = l.E / (2 * (1 + l.nu));
        te.set(e, p), se.set(e, l.rho), ae.set(e, l.nu);
      }
      const ue = window.__hekatanManualModifiers;
      if (ue && ue.size > 0) for (const [o, a] of ue.entries()) {
        const e = X.get(o);
        if (e === void 0 || m.has(e)) continue;
        const l = G.get(e);
        l != null && G.set(e, l * a.A);
        const p = J.get(e);
        p != null && J.set(e, p * a.Iz);
        const b = Y.get(e);
        b != null && Y.set(e, b * a.Iy);
        const I = Q.get(e);
        I != null && Q.set(e, I * a.J);
      }
      const fe = Math.round(s.apoyo ?? 0), N = /* @__PURE__ */ new Map();
      if (t.length > 0 && fe !== 3) {
        const o = Math.min(...t.map((e) => e[2])), a = fe === 0 ? [
          true,
          true,
          true,
          true,
          true,
          true
        ] : fe === 1 ? [
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
        for (let e = 0; e < t.length; e++) Math.abs(t[e][2] - o) < 1e-6 && N.set(e, [
          ...a
        ]);
      }
      const pe = window.__hekatanManualSupports;
      if (pe && pe.size > 0) for (const [o, a] of pe.entries()) o >= 0 && o < t.length && N.set(g(o), [
        ...a
      ]);
      const on = Math.round(s.patronCargas ?? 0) === 1 ? "Live" : "Dead", tn = window.__hekatanActiveCase, De = (() => {
        var _a2;
        const a = (((_a2 = n.loadCases) == null ? void 0 : _a2.val) ?? []).find((e) => e.name === tn);
        return a ? (a.patterns ?? []).map((e) => e.pattern) : [];
      })(), he = De.length === 0 || De.includes(on), Z = /* @__PURE__ */ new Map();
      if (he && Math.round(s.aplicarCargas ?? 1) === 1 && t.length > 0) {
        const o = Math.max(...t.map((l) => l[2])), a = s.Fx ?? 0, e = s.Fz ?? -10;
        for (let l = 0; l < t.length; l++) Math.abs(t[l][2] - o) < 1e-6 && Z.set(l, [
          a,
          0,
          e,
          0,
          0,
          0
        ]);
      }
      const me = window.__hekatanManualLoads;
      if (he && me && me.size > 0) for (const [o, a] of me.entries()) o >= 0 && o < t.length && Z.set(g(o), [
        ...a
      ]);
      const ge = window.__hekatanManualDistLoads, W = /* @__PURE__ */ new Map();
      for (const [o, a] of Z) W.set(o, [
        ...a
      ]);
      const Fe = /* @__PURE__ */ new Map(), je = [];
      if (he && ge && ge.size > 0) {
        const o = (a, e) => {
          const l = W.get(a) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          W.set(a, [
            l[0] + e[0],
            l[1] + e[1],
            l[2] + e[2],
            l[3] + e[3],
            l[4] + e[4],
            l[5] + e[5]
          ]);
        };
        for (const [a, e] of ge.entries()) {
          const l = X.get(a);
          if (l === void 0 || m.has(l)) continue;
          const p = d[l], b = t[p[0]], I = t[p[1]], y = [
            I[0] - b[0],
            I[1] - b[1],
            I[2] - b[2]
          ], x = Math.hypot(y[0], y[1], y[2]);
          if (x < 1e-9) continue;
          const S = [
            y[0] / x,
            y[1] / x,
            y[2] / x
          ], $ = x * x / 12, z = [
            S[1] * e[2] - S[2] * e[1],
            S[2] * e[0] - S[0] * e[2],
            S[0] * e[1] - S[1] * e[0]
          ];
          o(g(p[0]), [
            e[0] * x / 2,
            e[1] * x / 2,
            e[2] * x / 2,
            $ * z[0],
            $ * z[1],
            $ * z[2]
          ]), o(g(p[1]), [
            e[0] * x / 2,
            e[1] * x / 2,
            e[2] * x / 2,
            -$ * z[0],
            -$ * z[1],
            -$ * z[2]
          ]), Fe.set(l, [
            e[0],
            e[1],
            e[2]
          ]);
          const D = Math.hypot(e[0], e[1], e[2]);
          if (D < 1e-9) continue;
          const u = [
            e[0] / D,
            e[1] / D,
            e[2] / D
          ], h = Math.min(1.2, Math.max(0.25, 0.08 * D)) * (s.escalaCargaQ ?? 1), C = Math.max(2, Math.round(x / 0.5)) + 1, T = 16347926, U = new pn({
            color: T,
            depthTest: false,
            transparent: true,
            opacity: 0.95
          }), E = [], Oe = [];
          for (let xe = 0; xe < C; xe++) {
            const ve = xe / (C - 1), L = new re(b[0] + y[0] * ve, b[1] + y[1] * ve, b[2] + y[2] * ve), Pe = new re(L.x - u[0] * h, L.y - u[1] * h, L.z - u[2] * h);
            E.push(Pe, L), Oe.push(Pe);
            const Ee = new re(S[0], S[1], S[2]).multiplyScalar(h * 0.18), Le = new re(u[0], u[1], u[2]).multiplyScalar(-h * 0.3);
            E.push(L.clone(), L.clone().add(Le).add(Ee), L.clone(), L.clone().add(Le).sub(Ee));
          }
          const sn = new ke().setFromPoints(E), Me = new hn(sn, U);
          Me.renderOrder = 998, Me.frustumCulled = false;
          const an = new ke().setFromPoints(Oe), be = new mn(an, U);
          be.renderOrder = 998, be.frustumCulled = false, je.push(Me, be);
        }
      }
      if (new URLSearchParams(window.location.search).get("heks") || new URLSearchParams(window.location.search).get("m")) {
        n.nodes.val = [], n.elements.val = [], n.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        };
        return;
      }
      n.nodes.val = t, n.elements.val = d, n.nodeInputs.val = {
        supports: N,
        loads: Z
      }, n.elementInputs.val = {
        elasticities: oe,
        shearModuli: te,
        areas: G,
        momentsOfInertiaY: J,
        momentsOfInertiaZ: Y,
        torsionalConstants: Q,
        densities: se,
        poissonsRatios: ae,
        thicknesses: Ce,
        plateFormulations: $e,
        frameLoads: Fe
      }, n.objects3D.val = [
        ...Ue(s),
        ...je
      ];
      const O = [], we = window.__hekatanManualSprings;
      if (we && we.size > 0) {
        for (const [o, a] of we.entries()) if (!(o < 0 || o >= t.length)) for (let e = 0; e < 6; e++) a[e] !== 0 && O.push({
          node: g(o),
          dof: e,
          k: a[e]
        });
      }
      const le = (s.ksSuelo ?? 0) * 9.80665;
      if (le > 0 && A.size > 0) {
        const o = /* @__PURE__ */ new Map();
        for (const a of P) {
          const e = d[a], l = xn(t, e);
          for (const p of e) o.set(p, (o.get(p) ?? 0) + l / 4);
        }
        for (const [a, e] of o) {
          const l = le * e;
          O.push({
            node: a,
            dof: 2,
            k: l
          }), O.push({
            node: a,
            dof: 0,
            k: l * 0.5
          }), O.push({
            node: a,
            dof: 1,
            k: l * 0.5
          });
        }
      }
      if (Math.round(s.autoSolve ?? 1) === 1 && t.length > 0 && d.length > 0 && (N.size > 0 || O.length > 0) && W.size > 0) try {
        if (n.deformOutputs.val = wn(t, d, {
          supports: N,
          loads: W
        }, n.elementInputs.val, O.length > 0 ? O : void 0), n.analyzeOutputs.val = gn(t, d, n.elementInputs.val, n.deformOutputs.rawVal), le > 0 && P.size > 0) try {
          const a = n.deformOutputs.rawVal.deformations, e = n.analyzeOutputs.rawVal ?? {}, l = /* @__PURE__ */ new Map();
          let p = 0, b = 0;
          for (const I of P) {
            const x = d[I].map((S) => {
              var _a2;
              const $ = ((_a2 = a.get(S)) == null ? void 0 : _a2[2]) ?? 0, z = le * $;
              return z < p && (p = z), z > b && (b = z), z;
            });
            l.set(I, x);
          }
          e.pressure = l, e.colorMapRanges = {
            ...e.colorMapRanges ?? {},
            pressure: [
              b,
              p
            ]
          }, n.analyzeOutputs.val = e;
        } catch (a) {
          console.warn("[NewBlank] presi\xF3n:", (a == null ? void 0 : a.message) ?? a);
        }
        const o = /* @__PURE__ */ new Set();
        for (const a of d) for (const e of a) o.add(e);
        console.log(`[NewBlank] Solve OK \u2014 ${o.size} nudos (de ${t.length} puntos), ${d.length} elementos, ${N.size} apoyos, ${Z.size} cargas, ${O.length} springs`);
      } catch (o) {
        console.warn(`[NewBlank] Solver fall\xF3: ${o.message}`);
      }
      else console.log(`[NewBlank] mode=${f ? "2D" : "3D"} | nodes=${t.length} elem=${d.length} cols=${B.size} vigas=${v.size} shells=${m.size} apoyos=${N.size} cargas=${Z.size} springs=${O.length}`);
    },
    computedLabels(s, n) {
      const r = {}, c = n.nodes.val.length;
      n.elements.val.length;
      let i = 0, M = 0;
      for (const f of n.elements.val) f.length === 4 ? M++ : i++;
      return r.Stats = `${c} nodos \xB7 ${i} frames \xB7 ${M} shells`, c === 0 && (r["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), r;
    }
  };
});
export {
  __tla,
  In as i,
  Sn as n
};
