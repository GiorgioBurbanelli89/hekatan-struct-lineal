import { a as Ze } from "./analyze-DgLgRmKg.js";
import { d as He, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { A as Ke, t as Ie, B as Xe, F as qe, u as Ge, M as Je, e as Ye, D as Qe } from "./theme-C-zoknmI.js";
let an, ln;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const V = /* @__PURE__ */ new Set();
  let E = -1, Ae = false, N = true;
  function me(s) {
    Ae = s;
    const n = document.getElementById("hk-ifc-objs"), r = document.getElementById("hk-ifc-tab");
    n && (n.style.transition = "transform .25s ease, opacity .25s ease", n.style.transform = s ? "translateX(-50%) translateY(130%)" : "translateX(-50%)", n.style.opacity = s ? "0" : "", n.style.pointerEvents = s ? "none" : ""), r && (r.style.display = s ? "block" : "none");
  }
  function De(s) {
    let n = document.getElementById("hk-ifc-objs");
    if (n || (n = document.createElement("div"), n.id = "hk-ifc-objs", n.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:120;background:rgba(16,22,30,0.96);color:#cde;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:7px 9px;font:11px system-ui,sans-serif;max-height:38vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.5);min-width:220px;", document.body.appendChild(n)), !document.getElementById("hk-ifc-tab")) {
      const u = document.createElement("button");
      u.id = "hk-ifc-tab", u.textContent = "\u{1F3DB} Objetos IFC \u27E9", u.title = "Mostrar objetos IFC", u.style.cssText = "position:fixed;left:50%;bottom:calc(var(--hk-cmd-hueco, 66px) + 14px);transform:translateX(-50%);z-index:121;display:none;padding:6px 12px;border:1px solid #3a4a5f;border-radius:8px;background:rgba(30,40,55,0.96);color:#9ce;cursor:pointer;font:11px system-ui;box-shadow:0 2px 8px rgba(0,0,0,.4)", u.onclick = () => me(false), document.body.appendChild(u);
    }
    const r = N ? "" : s.map((u, t) => {
      const k = u.color.map((d) => Math.round(d * 255)), I = Math.round(u.positions.length / 9), g = !V.has(t) && (E < 0 || E === t);
      return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
      <input type="checkbox" data-ifc-vis="${t}" ${g ? "checked" : ""}>
      <span style="width:12px;height:12px;border-radius:2px;background:rgb(${k[0]},${k[1]},${k[2]});border:1px solid #0006;display:inline-block"></span>
      <span style="flex:1">Objeto ${t + 1}</span>
      <span style="color:#8ab">${I} \u25B3</span>
      <button data-ifc-solo="${t}" title="Aislar" style="background:#243;color:#9fd;border:1px solid #365;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px">solo</button>
    </div>`;
    }).join(""), i = (u, t, k) => `<button id="${u}" title="${k}" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:11px;padding:1px 6px;margin-left:3px">${t}</button>`;
    n.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;${N ? "" : "margin-bottom:4px"}">
       <b style="color:#9ce">\u{1F3DB} Objetos IFC (${s.length})</b>
       <span style="white-space:nowrap">${N ? "" : '<button id="hk-ifc-all" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 6px">ver todos</button>'}${i("hk-ifc-min", N ? "\u25A2" : "\u2581", "Minimizar")}${i("hk-ifc-slide", "\u27E8", "Ocultar (corredizo)")}</span>
     </div>${r}`;
    const c = () => {
      var _a;
      try {
        (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
      } catch {
      }
    };
    n.querySelector("#hk-ifc-min").onclick = () => {
      N = !N, De(s);
    }, n.querySelector("#hk-ifc-slide").onclick = () => me(true), n.querySelectorAll("[data-ifc-vis]").forEach((u) => {
      u.onchange = () => {
        const t = +u.dataset.ifcVis;
        E = -1, u.checked ? V.delete(t) : V.add(t), c();
      };
    }), n.querySelectorAll("[data-ifc-solo]").forEach((u) => {
      u.onclick = () => {
        const t = +u.dataset.ifcSolo;
        E = E === t ? -1 : t, V.clear(), c();
      };
    });
    const M = n.querySelector("#hk-ifc-all");
    M && (M.onclick = () => {
      V.clear(), E = -1, c();
    }), me(Ae);
  }
  function We() {
    var _a, _b;
    (_a = document.getElementById("hk-ifc-objs")) == null ? void 0 : _a.remove(), (_b = document.getElementById("hk-ifc-tab")) == null ? void 0 : _b.remove();
  }
  function je(s, n) {
    const r = [
      0,
      1,
      2
    ].reduce((v, p) => n[1][p] - n[0][p] > n[1][v] - n[0][v] ? p : v, 0), i = [];
    for (const v of s) {
      const p = v.positions;
      for (let w = 0; w < p.length; w += 9) i.push((p[w + r] + p[w + 3 + r] + p[w + 6 + r]) / 3);
    }
    if (i.length < 2) return n;
    i.sort((v, p) => v - p);
    let c = 0, M = 0;
    for (let v = 1; v < i.length; v++) {
      const p = i[v] - i[v - 1];
      p > M && (M = p, c = v);
    }
    const u = i[i.length - 1] - i[0];
    if (M < u * 0.15) return n;
    const t = (i[c] + i[c - 1]) / 2, k = c, g = i.length - c >= k, d = [
      1e30,
      1e30,
      1e30
    ], R = [
      -1e30,
      -1e30,
      -1e30
    ];
    for (const v of s) {
      const p = v.positions;
      for (let w = 0; w < p.length; w += 9) {
        const P = (p[w + r] + p[w + 3 + r] + p[w + 6 + r]) / 3;
        if (!(g && P < t || !g && P >= t)) for (let C = 0; C < 3; C++) for (const T of [
          0,
          3,
          6
        ]) {
          const B = p[w + T + C];
          B < d[C] && (d[C] = B), B > R[C] && (R[C] = B);
        }
      }
    }
    return [
      d,
      R
    ];
  }
  function Fe(s, n = false) {
    var _a;
    const r = window.__hekatanIfcMesh;
    if (!r || !((_a = r.grupos) == null ? void 0 : _a.length)) return [];
    const i = Math.max(0.1, Math.min(1, s)), c = [];
    c.push(new Ke(16777215, 0.75));
    const M = new Ie(16777215, 0.7);
    M.position.set(1, 1, 2);
    const u = new Ie(16777215, 0.4);
    return u.position.set(-1, -0.5, 1), c.push(M, u), r.grupos.forEach((t, k) => {
      if (!t.positions.length || !n && V.has(k) || !n && E >= 0 && k !== E) return;
      const I = new Xe();
      I.setAttribute("position", new qe(t.positions, 3)), I.computeVertexNormals();
      const g = new Ge(t.color[0], t.color[1], t.color[2]), d = new Je(I, new Ye({
        color: g,
        emissive: g.clone().multiplyScalar(0.25),
        roughness: 0.9,
        metalness: 0,
        transparent: i < 1,
        opacity: i,
        side: Qe
      }));
      n && (d.userData.refIfc = true, d.name = "ref-ifc-" + k), c.push(d);
    }), c;
  }
  function en() {
    var _a;
    const s = window.__hekatanIfcMesh;
    return !s || !((_a = s.grupos) == null ? void 0 : _a.length) || !s.bbox ? null : je(s.grupos, s.bbox);
  }
  let ge, we, Se, _e, Me, be, ze, $e, D;
  an = {
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
        "Tama\xF1o (m)": s.bbox ? s.bbox[1].map((i, c) => (i - s.bbox[0][c]).toFixed(1)).join(" \xD7 ") : "\u2014"
      };
      if (n) {
        const i = n.columnas + n.vigas + n.miembros + n.losas + n.muros + n.zapatas;
        r["Elementos estructurales"] = i > 0 ? `col ${n.columnas} \xB7 vig ${n.vigas} \xB7 losa ${n.losas} \xB7 muro ${n.muros}` : `0 (solo mallas${n.proxies ? ` \u2014 ${n.proxies} objetos SketchUp` : ""})`, r["Convertible a estructura"] = i > 0 ? "s\xED" : "no (IFC de arquitectura)";
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
        }, n.objects3D.val = [], We(), console.log("[IFC] Sin modelo. Usa '\u{1F4E5} Importar IFC'.");
        return;
      }
      const i = Fe((s.opacidad ?? 100) / 100);
      n.objects3D.val = s.caras ? i : i.filter((u) => !u.isMesh);
      try {
        (_b = window.__hekatanClipRango) == null ? void 0 : _b.call(window, r.bbox[0], r.bbox[1]);
      } catch {
      }
      De(r.grupos);
      const [c, M] = je(r.grupos, r.bbox);
      n.nodes.val = [
        [
          c[0],
          c[1],
          c[2]
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
  ge = 25e6;
  we = 0.2;
  Se = ge / (2 * (1 + we));
  _e = 24;
  Me = 2e8;
  be = 0.3;
  ze = Me / (2 * (1 + be));
  $e = 78;
  D = (s, n, r, i, c, M) => ({
    default: r,
    min: i,
    max: c,
    step: M,
    label: n,
    folder: s
  });
  function nn(s, n) {
    const r = s[n[0]], i = s[n[1]], c = s[n[2]], M = s[n[3]], u = (t, k, I) => {
      const g = [
        k[0] - t[0],
        k[1] - t[1],
        k[2] - t[2]
      ], d = [
        I[0] - t[0],
        I[1] - t[1],
        I[2] - t[2]
      ];
      return 0.5 * Math.hypot(g[1] * d[2] - g[2] * d[1], g[2] * d[0] - g[0] * d[2], g[0] * d[1] - g[1] * d[0]);
    };
    return u(r, i, c) + u(r, c, M);
  }
  let j, Ce;
  j = (s, n, r, i) => ({
    default: r,
    label: n,
    folder: s,
    options: i
  });
  Ce = (s) => {
    var _a, _b;
    if (Math.round(s.refIfc ?? 1) !== 1) return [];
    const n = Math.round(s.refModo ?? 0), r = n === 1 ? 0.12 : n === 2 ? 0.04 : (s.refOpac ?? 35) / 100, i = Fe(r, true);
    if (n === 2) {
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
  ln = {
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
      bCol: D("Secci\xF3n frames", "b columna (m)", 0.4, 0.1, 1, 0.05),
      hCol: D("Secci\xF3n frames", "h columna (m)", 0.4, 0.1, 1, 0.05),
      bViga: D("Secci\xF3n frames", "b viga (m)", 0.3, 0.1, 0.8, 0.05),
      hViga: D("Secci\xF3n frames", "h viga (m)", 0.5, 0.1, 1, 0.05),
      tShell: D("Secci\xF3n shells", "Espesor shell (m)", 0.2, 0.05, 1, 0.01),
      matShell: j("Secci\xF3n shells", "Material shell", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      formaPlaca: j("Secci\xF3n shells", "Formulaci\xF3n placa", 0, {
        "Shell-Thick (Mindlin)": 0,
        "Shell-Thin (Kirchhoff)": 1,
        Membrana: 2
      }),
      mallaZapata: D("\u{1F9F0} Zapata / Suelo", "Malla del \xE1rea (nx = ny)", 1, 1, 12, 1),
      ksSuelo: D("\u{1F9F0} Zapata / Suelo", "Suelo ks (tonf/m\xB3, 0 = off)", 0, 0, 8e3, 50),
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
      Fz: D("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
      Fx: D("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),
      autoSolve: j("Solver", "Auto-resolver", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refIfc: j("\u{1F3DB} Referencia IFC", "Mostrar IFC de fondo", 1, {
        S\u00ED: 1,
        No: 0
      }),
      refOpac: D("\u{1F3DB} Referencia IFC", "Opacidad (%)", 35, 10, 100, 5),
      refModo: j("\u{1F3DB} Referencia IFC", "Ver como", 0, {
        "S\xF3lido tenue": 0,
        "Transparente (ver por dentro)": 1,
        "Solo bordes (l\xEDneas)": 2
      })
    },
    build(s, n) {
      var _a, _b, _c;
      const r = ((_a = window.__hekatanDrawingPoints) == null ? void 0 : _a.val) ?? window.__hekatanDrawingPoints ?? [], i = ((_b = window.__hekatanDrawingPolylines) == null ? void 0 : _b.val) ?? window.__hekatanDrawingPolylines ?? [], c = ((_c = window.__hekatanDrawingAreas) == null ? void 0 : _c.val) ?? window.__hekatanDrawingAreas ?? [], M = new Set(c);
      if (!r.length) {
        const o = Math.round(s.refIfc ?? 1) === 1 ? en() : null;
        n.nodes.val = o ? [
          o[0],
          o[1]
        ] : [], n.elements.val = [], n.nodeInputs.val = {
          supports: /* @__PURE__ */ new Map(),
          loads: /* @__PURE__ */ new Map()
        }, n.elementInputs.val = {}, n.objects3D.val = Ce(s), console.log("[NewBlank] Lienzo vac\xEDo \u2014 us\xE1 el folder \u{1F4D0} Herramientas CAD para dibujar.");
        return;
      }
      const u = Math.round(s.mode ?? 1) === 0, t = r.map((o) => u ? [
        o[0],
        0,
        o[2]
      ] : [
        o[0],
        o[1],
        o[2]
      ]), k = 1e-4, I = new Int32Array(t.length);
      {
        const o = /* @__PURE__ */ new Map();
        for (let a = 0; a < t.length; a++) {
          const e = t[a].map((f) => Math.round(f / k)).join(","), l = o.get(e);
          l === void 0 ? (o.set(e, a), I[a] = a) : I[a] = l;
        }
      }
      const g = (o) => o >= 0 && o < I.length ? I[o] : o, d = [], R = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), w = Math.max(1, Math.round(s.mallaZapata ?? 1)), P = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Set(), T = 1e-3, B = (o) => `${Math.round(o[0] / T)},${Math.round(o[1] / T)},${Math.round(o[2] / T)}`, ae = /* @__PURE__ */ new Map();
      for (let o = 0; o < t.length; o++) ae.set(B(t[o]), g(o));
      const U = /* @__PURE__ */ new Map();
      for (let o = 0; o < i.length; o++) {
        const a = i[o];
        if (M.has(o)) {
          const e = (a.length === 5 ? a.slice(0, 4) : a.slice(0, Math.min(4, a.length))).map(g);
          if (e.length !== 4 || e.some((l) => t[l] === void 0)) continue;
          if (w <= 1) {
            const l = d.length;
            d.push(e), p.add(l), P.add(l);
            for (const f of e) C.add(f);
          } else {
            const [l, f, x, y] = e, S = t[l], b = t[f], z = t[x], $ = t[y], _ = (h, m) => [
              (1 - h) * (1 - m) * S[0] + h * (1 - m) * b[0] + h * m * z[0] + (1 - h) * m * $[0],
              (1 - h) * (1 - m) * S[1] + h * (1 - m) * b[1] + h * m * z[1] + (1 - h) * m * $[1],
              (1 - h) * (1 - m) * S[2] + h * (1 - m) * b[2] + h * m * z[2] + (1 - h) * m * $[2]
            ], q = [];
            for (let h = 0; h <= w; h++) {
              const m = [];
              for (let A = 0; A <= w; A++) if (h === 0 && A === 0) m.push(l);
              else if (h === w && A === 0) m.push(f);
              else if (h === w && A === w) m.push(x);
              else if (h === 0 && A === w) m.push(y);
              else {
                const G = _(h / w, A / w), te = B(G);
                let se = ae.get(te);
                se === void 0 && (se = t.length, t.push(G), ae.set(te, se)), m.push(se);
              }
              q.push(m);
            }
            for (let h = 0; h < w; h++) for (let m = 0; m < w; m++) {
              const A = [
                q[h][m],
                q[h + 1][m],
                q[h + 1][m + 1],
                q[h][m + 1]
              ], G = d.length;
              d.push(A), p.add(G), P.add(G);
              for (const te of A) C.add(te);
            }
          }
        } else for (let e = 0; e < a.length - 1; e++) {
          const l = g(a[e]), f = g(a[e + 1]);
          if (l === f || t[l] === void 0 || t[f] === void 0) continue;
          const x = d.length;
          d.push([
            l,
            f
          ]), U.set(`${o}:${e}`, x);
          const y = t[f][0] - t[l][0], S = t[f][1] - t[l][1], b = t[f][2] - t[l][2];
          Math.abs(b) > Math.max(Math.abs(y), Math.abs(S)) ? R.add(x) : v.add(x);
        }
      }
      const J = Math.round(s.mat ?? 0), Oe = J === 0 ? ge : Me, Pe = J === 0 ? Se : ze, Ee = J === 0 ? we : be, Re = J === 0 ? _e : $e, Y = Math.round(s.matShell ?? 0), Be = Y === 0 ? ge : Me, Le = Y === 0 ? Se : ze, Ne = Y === 0 ? we : be, Ve = Y === 0 ? _e : $e, Q = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map();
      for (let o = 0; o < d.length; o++) if (p.has(o)) Q.set(o, Be), W.set(o, Le), ee.set(o, Ve), ne.set(o, Ne), xe.set(o, s.tShell ?? 0.2), ve.set(o, Math.round(s.formaPlaca ?? 0));
      else {
        const a = R.has(o), e = a ? s.bCol : s.bViga, l = a ? s.hCol : s.hViga, f = e * l, x = l * Math.pow(e, 3) / 12, y = e * Math.pow(l, 3) / 12, S = 0.14 * Math.pow(Math.min(e, l), 4);
        Q.set(o, Oe), W.set(o, Pe), Z.set(o, f), H.set(o, x), K.set(o, y), X.set(o, S), ee.set(o, Re), ne.set(o, Ee);
      }
      const le = window.__hekatanManualSections;
      if (le && le.size > 0) for (const [o, a] of le.entries()) {
        const e = U.get(o);
        e === void 0 || p.has(e) || (a.A != null && Z.set(e, a.A), a.Iz != null && H.set(e, a.Iz), a.Iy != null && K.set(e, a.Iy), a.J != null && X.set(e, a.J));
      }
      const ke = window.__hekatanMaterialDB, re = window.__hekatanManualMaterial;
      if (re && re.size > 0 && ke) for (const [o, a] of re.entries()) {
        const e = U.get(o);
        if (e === void 0 || p.has(e)) continue;
        const l = ke[a];
        if (!l) continue;
        Q.set(e, l.E);
        const f = l.E / (2 * (1 + l.nu));
        W.set(e, f), ee.set(e, l.rho), ne.set(e, l.nu);
      }
      const ie = window.__hekatanManualModifiers;
      if (ie && ie.size > 0) for (const [o, a] of ie.entries()) {
        const e = U.get(o);
        if (e === void 0 || p.has(e)) continue;
        const l = Z.get(e);
        l != null && Z.set(e, l * a.A);
        const f = H.get(e);
        f != null && H.set(e, f * a.Iz);
        const x = K.get(e);
        x != null && K.set(e, x * a.Iy);
        const y = X.get(e);
        y != null && X.set(e, y * a.J);
      }
      const ce = Math.round(s.apoyo ?? 0), L = /* @__PURE__ */ new Map();
      if (t.length > 0 && ce !== 3) {
        const o = Math.min(...t.map((e) => e[2])), a = ce === 0 ? [
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
        for (let e = 0; e < t.length; e++) Math.abs(t[e][2] - o) < 1e-6 && L.set(e, [
          ...a
        ]);
      }
      const de = window.__hekatanManualSupports;
      if (de && de.size > 0) for (const [o, a] of de.entries()) o >= 0 && o < t.length && L.set(g(o), [
        ...a
      ]);
      const Te = Math.round(s.patronCargas ?? 0) === 1 ? "Live" : "Dead", Ue = window.__hekatanActiveCase, ye = (() => {
        var _a2;
        const a = (((_a2 = n.loadCases) == null ? void 0 : _a2.val) ?? []).find((e) => e.name === Ue);
        return a ? (a.patterns ?? []).map((e) => e.pattern) : [];
      })(), ue = ye.length === 0 || ye.includes(Te), F = /* @__PURE__ */ new Map();
      if (ue && Math.round(s.aplicarCargas ?? 1) === 1 && t.length > 0) {
        const o = Math.max(...t.map((l) => l[2])), a = s.Fx ?? 0, e = s.Fz ?? -10;
        for (let l = 0; l < t.length; l++) Math.abs(t[l][2] - o) < 1e-6 && F.set(l, [
          a,
          0,
          e,
          0,
          0,
          0
        ]);
      }
      const fe = window.__hekatanManualLoads;
      if (ue && fe && fe.size > 0) for (const [o, a] of fe.entries()) o >= 0 && o < t.length && F.set(g(o), [
        ...a
      ]);
      const pe = window.__hekatanManualDistLoads;
      if (ue && pe && pe.size > 0) {
        const o = (a, e) => {
          const l = F.get(a) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          F.set(a, [
            l[0] + e[0],
            l[1] + e[1],
            l[2] + e[2],
            l[3] + e[3],
            l[4] + e[4],
            l[5] + e[5]
          ]);
        };
        for (const [a, e] of pe.entries()) {
          const l = U.get(a);
          if (l === void 0 || p.has(l)) continue;
          const f = d[l], x = t[f[0]], y = t[f[1]], S = [
            y[0] - x[0],
            y[1] - x[1],
            y[2] - x[2]
          ], b = Math.hypot(S[0], S[1], S[2]);
          if (b < 1e-9) continue;
          const z = [
            S[0] / b,
            S[1] / b,
            S[2] / b
          ], $ = b * b / 12, _ = [
            z[1] * e[2] - z[2] * e[1],
            z[2] * e[0] - z[0] * e[2],
            z[0] * e[1] - z[1] * e[0]
          ];
          o(g(f[0]), [
            e[0] * b / 2,
            e[1] * b / 2,
            e[2] * b / 2,
            $ * _[0],
            $ * _[1],
            $ * _[2]
          ]), o(g(f[1]), [
            e[0] * b / 2,
            e[1] * b / 2,
            e[2] * b / 2,
            -$ * _[0],
            -$ * _[1],
            -$ * _[2]
          ]);
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
        supports: L,
        loads: F
      }, n.elementInputs.val = {
        elasticities: Q,
        shearModuli: W,
        areas: Z,
        momentsOfInertiaY: H,
        momentsOfInertiaZ: K,
        torsionalConstants: X,
        densities: ee,
        poissonsRatios: ne,
        thicknesses: xe,
        plateFormulations: ve
      }, n.objects3D.val = Ce(s);
      const O = [], he = window.__hekatanManualSprings;
      if (he && he.size > 0) {
        for (const [o, a] of he.entries()) if (!(o < 0 || o >= t.length)) for (let e = 0; e < 6; e++) a[e] !== 0 && O.push({
          node: g(o),
          dof: e,
          k: a[e]
        });
      }
      const oe = (s.ksSuelo ?? 0) * 9.80665;
      if (oe > 0 && C.size > 0) {
        const o = /* @__PURE__ */ new Map();
        for (const a of P) {
          const e = d[a], l = nn(t, e);
          for (const f of e) o.set(f, (o.get(f) ?? 0) + l / 4);
        }
        for (const [a, e] of o) {
          const l = oe * e;
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
      if (Math.round(s.autoSolve ?? 1) === 1 && t.length > 0 && d.length > 0 && (L.size > 0 || O.length > 0) && F.size > 0) try {
        if (n.deformOutputs.val = He(t, d, {
          supports: L,
          loads: F
        }, n.elementInputs.val, O.length > 0 ? O : void 0), n.analyzeOutputs.val = Ze(t, d, n.elementInputs.val, n.deformOutputs.rawVal), oe > 0 && P.size > 0) try {
          const a = n.deformOutputs.rawVal.deformations, e = n.analyzeOutputs.rawVal ?? {}, l = /* @__PURE__ */ new Map();
          let f = 0, x = 0;
          for (const y of P) {
            const b = d[y].map((z) => {
              var _a2;
              const $ = ((_a2 = a.get(z)) == null ? void 0 : _a2[2]) ?? 0, _ = oe * $;
              return _ < f && (f = _), _ > x && (x = _), _;
            });
            l.set(y, b);
          }
          e.pressure = l, e.colorMapRanges = {
            ...e.colorMapRanges ?? {},
            pressure: [
              x,
              f
            ]
          }, n.analyzeOutputs.val = e;
        } catch (a) {
          console.warn("[NewBlank] presi\xF3n:", (a == null ? void 0 : a.message) ?? a);
        }
        const o = /* @__PURE__ */ new Set();
        for (const a of d) for (const e of a) o.add(e);
        console.log(`[NewBlank] Solve OK \u2014 ${o.size} nudos (de ${t.length} puntos), ${d.length} elementos, ${L.size} apoyos, ${F.size} cargas, ${O.length} springs`);
      } catch (o) {
        console.warn(`[NewBlank] Solver fall\xF3: ${o.message}`);
      }
      else console.log(`[NewBlank] mode=${u ? "2D" : "3D"} | nodes=${t.length} elem=${d.length} cols=${R.size} vigas=${v.size} shells=${p.size} apoyos=${L.size} cargas=${F.size} springs=${O.length}`);
    },
    computedLabels(s, n) {
      const r = {}, i = n.nodes.val.length;
      n.elements.val.length;
      let c = 0, M = 0;
      for (const u of n.elements.val) u.length === 4 ? M++ : c++;
      return r.Stats = `${i} nodos \xB7 ${c} frames \xB7 ${M} shells`, i === 0 && (r["\u{1F4A1} Tip"] = "L\xEDnea = 2 clicks \xB7 Polil\xEDnea = N clicks + click derecho \xB7 \xC1rea = 4 clicks"), r;
    }
  };
});
export {
  __tla,
  an as i,
  ln as n
};
