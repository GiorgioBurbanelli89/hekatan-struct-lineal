import { B as L, F as Z, M as O, a as j, D as U, V as R, L as F, b as _, c as V } from "./Text-Br8EG2up.js";
const D = { COLUMN: 15680580, BEAM: 2278750, BRACE: 3900150, AREA: 16096779 };
function K(o, d, r, w) {
  const v = w ? Y(o, d, w) : [];
  if (v.length) return v;
  const g = o.length, h = (i, e) => i < e ? i + "_" + e : e + "_" + i, u = /* @__PURE__ */ new Set(), s = Array.from({ length: g }, () => []);
  for (const i of d) i.length === 2 && (u.add(h(i[0], i[1])), s[i[0]].push(i[1]), s[i[1]].push(i[0]));
  const m = (i, e) => u.has(h(i, e)), A = /* @__PURE__ */ new Set(), C = [];
  for (let i = 0; i < g; i++) for (const e of s[i]) if (!(e < i)) {
    for (const n of s[e]) if (n !== i) for (const c of s[n]) {
      if (c === e || c === i || !m(c, i) || (o[i][2] + o[e][2] + o[n][2] + o[c][2]) / 4 < r) continue;
      const t = [i, e, n, c].slice().sort((a, l) => a - l).join("-");
      A.has(t) || (A.add(t), C.push([i, e, n, c]));
    }
  }
  return C;
}
function Y(o, d, r) {
  const w = /* @__PURE__ */ new Map();
  if (d.forEach((e, n) => {
    e.length === 2 && r[n] === "BRACE" && ((w.get(e[0]) ?? w.set(e[0], []).get(e[0])).push(e[1]), (w.get(e[1]) ?? w.set(e[1], []).get(e[1])).push(e[0]));
  }), !w.size) return [];
  const v = /* @__PURE__ */ new Set(), g = [];
  for (const e of w.keys()) {
    if (v.has(e)) continue;
    const n = [], c = [e];
    for (v.add(e); c.length; ) {
      const t = c.pop();
      n.push(t);
      for (const a of w.get(t)) v.has(a) || (v.add(a), c.push(a));
    }
    g.push(n);
  }
  const h = (e) => {
    const n = new Set(e), c = (p) => w.get(p).filter((b) => n.has(b));
    let t = e.find((p) => c(p).length === 1) ?? e[0];
    const a = [t], l = /* @__PURE__ */ new Set([t]);
    let f = t;
    for (; ; ) {
      const p = c(f).find((b) => !l.has(b));
      if (p == null) break;
      a.push(p), l.add(p), f = p;
    }
    return a.length === e.length ? a : e;
  }, u = g.map(h), s = (e) => e.reduce((n, c) => n + o[c][0], 0) / e.length, m = (e) => e.reduce((n, c) => n + o[c][1], 0) / e.length, A = /* @__PURE__ */ new Map();
  u.forEach((e) => {
    const n = e.length + ":" + Math.round(s(e) / 4);
    (A.get(n) ?? A.set(n, []).get(n)).push(e);
  });
  const C = (e, n) => (o[e][0] - o[n][0]) ** 2 + (o[e][2] - o[n][2]) ** 2, i = [];
  for (const e of A.values()) if (!(e.length < 2)) {
    e.sort((n, c) => m(n) - m(c));
    for (let n = 0; n < e.length - 1; n++) {
      const c = e[n], t = e[n + 1].slice();
      if (c.length !== t.length) continue;
      const a = c.length;
      C(c[0], t[0]) + C(c[a - 1], t[a - 1]) > C(c[0], t[a - 1]) + C(c[a - 1], t[0]) && t.reverse();
      for (let l = 0; l < a - 1; l++) i.push([c[l], c[l + 1], t[l + 1], t[l]]);
    }
  }
  return i;
}
function G(o) {
  const d = o.nodes, r = (e, n, c) => {
    const t = [c[0] - n[0], c[1] - n[1], c[2] - n[2]], a = [e[0] - n[0], e[1] - n[1], e[2] - n[2]], l = t[0] ** 2 + t[1] ** 2 + t[2] ** 2;
    if (l < 1e-9) return -1;
    const f = (a[0] * t[0] + a[1] * t[1] + a[2] * t[2]) / l;
    if (f < 1e-4 || f > 1 - 1e-4) return -1;
    const p = [n[0] + t[0] * f, n[1] + t[1] * f, n[2] + t[2] * f];
    return Math.hypot(e[0] - p[0], e[1] - p[1], e[2] - p[2]) < 1e-3 ? f : -1;
  }, w = {};
  for (const [e, n] of Object.entries(o.elementInputs ?? {})) w[e] = new Map(n);
  const v = [], g = [], h = [], u = [], s = [];
  o.elements.forEach((e, n) => {
    const c = (M) => {
      var _a, _b, _c;
      v.push(M), g.push((_a = o.tipos) == null ? void 0 : _a[n]), h.push((_b = o.secciones) == null ? void 0 : _b[n]), u.push((_c = o.plantas) == null ? void 0 : _c[n]), s.push(n);
    };
    if (e.length !== 2) {
      c(e);
      return;
    }
    const [t, a] = e, l = d[t], f = d[a], p = [];
    for (let M = 0; M < d.length; M++) {
      if (M === t || M === a) continue;
      const S = r(d[M], l, f);
      S > 0 && p.push([S, M]);
    }
    if (!p.length) {
      c(e);
      return;
    }
    p.sort((M, S) => M[0] - S[0]);
    let b = t;
    for (const [, M] of p) c([b, M]), b = M;
    c([b, a]);
  });
  const m = /* @__PURE__ */ new Map();
  s.forEach((e) => m.set(e, (m.get(e) ?? 0) + 1));
  const A = /* @__PURE__ */ new Set(["frameLoads", "frameFixedEnd"]), C = {};
  for (const [e, n] of Object.entries(w)) {
    const c = [];
    s.forEach((t, a) => {
      if (A.has(e) && (m.get(t) ?? 1) > 1) return;
      const l = n.get(t);
      l !== void 0 && c.push([a, l]);
    }), C[e] = c;
  }
  const i = v.filter((e) => e.length === 2).length - o.elements.filter((e) => e.length === 2).length;
  return i > 0 && console.log(`[CSI Importer] conectadas ${i} intersecciones (mesh-at-intersections, como SAP/ETABS)`), { ...o, elements: v, tipos: g, secciones: h, plantas: u, elementInputs: C };
}
function P(o, d) {
  o.nodes.val = [], o.elements.val = [], o.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, o.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, o.objects3D.val = [], console.log("[CSI Importer] " + d);
}
const J = { id: "csi-importer", name: "Importar CSI (E2K/F2K/S2K)", category: "\u{1F9EA} Utilidades", defaultShellResult: "none", availableShellResults: [], params: { verColumnas: { default: 1, boolean: true, label: "Columnas", folder: "\u{1F441} Ver por tipo" }, verVigas: { default: 1, boolean: true, label: "Vigas", folder: "\u{1F441} Ver por tipo" }, verDiagonales: { default: 1, boolean: true, label: "Diagonales", folder: "\u{1F441} Ver por tipo" }, verAreas: { default: 1, boolean: true, label: "\xC1reas", folder: "\u{1F441} Ver por tipo" }, conectar: { default: 1, boolean: true, label: "Conectar en intersecciones (SAP/ETABS)", folder: "\u{1F441} Ver por tipo" }, cubierta: { default: 0, boolean: true, label: "Poner cubierta (slab membrana)", folder: "\u{1F3E0} Cubierta" }, formaCubierta: { default: 2, label: "Formulaci\xF3n de la placa", options: { "Membrana (solo su plano)": 2, "Shell-Thin (Kirchhoff)": 1, "Shell-Thick (Mindlin)": 0 }, folder: "\u{1F3E0} Cubierta" }, tCubierta: { default: 60, min: 0.5, max: 300, step: 0.5, label: "Espesor cubierta (mm)", folder: "\u{1F3E0} Cubierta" }, modoCubierta: { default: 0, label: "Modo cubierta", options: { "Membrana (arriostra)": 0, "Zinc como carga (a correas)": 1 }, folder: "\u{1F3E0} Cubierta" }, qCubierta: { default: 0.5, min: 0, max: 10, step: 0.05, label: "Carga cubierta (kN/m\xB2)", folder: "\u{1F3E0} Cubierta" } }, computedLabels(o, d) {
  var _a, _b, _c;
  const r = window.__hekatanImportedModel;
  if (!r) return { Archivo: "ninguno \u2014 usa \u{1F4E5} Importar" };
  const w = /* @__PURE__ */ new Map();
  (_a = r.secciones) == null ? void 0 : _a.forEach((h) => w.set(h, (w.get(h) ?? 0) + 1));
  const v = [...w.entries()].sort((h, u) => u[1] - h[1]).slice(0, 6), g = { Archivo: `${r.archivo} (${r.fuente})`, Nudos: String(r.nodes.length), Elementos: String(r.elements.length), Apoyos: String(((_b = r.supports) == null ? void 0 : _b.length) ?? 0), Cargas: String(((_c = r.loads) == null ? void 0 : _c.length) ?? 0), Plantas: String(new Set(r.plantas ?? []).size) };
  return v.forEach(([h, u]) => {
    g[`  ${h}`] = `${u}`;
  }), g;
}, build(o, d) {
  var _a, _b, _c;
  let r = window.__hekatanImportedModel;
  const w = window.__hekatanImportedCim;
  if (!r) return ((_a = w == null ? void 0 : w.zapatas) == null ? void 0 : _a.length) ? X(w, d) : P(d, "Sin archivo. Usa el folder '\u{1F4E5} Importar archivo'.");
  o.conectar && r.elements.length < 3e3 && (r = G(r));
  const v = (t) => t === "COLUMN" && o.verColumnas || t === "BEAM" && o.verVigas || t === "BRACE" && o.verDiagonales || t === "AREA" && o.verAreas || !["COLUMN", "BEAM", "BRACE", "AREA"].includes(t), g = r.nodes, h = [], u = [];
  r.elements.forEach((t, a) => {
    var _a2;
    const l = ((_a2 = r.tipos) == null ? void 0 : _a2[a]) ?? (t.length === 4 ? "AREA" : "BEAM");
    v(l) && (h.push(t), u.push(a));
  });
  const s = {};
  for (const [t, a] of Object.entries(r.elementInputs ?? {})) {
    const l = new Map(a), f = /* @__PURE__ */ new Map();
    u.forEach((p, b) => {
      const M = l.get(p);
      M !== void 0 && f.set(b, M);
    }), s[t] = f;
  }
  for (const t of ["elasticities", "shearModuli", "areas", "momentsOfInertiaY", "momentsOfInertiaZ", "torsionalConstants", "densities", "poissonsRatios"]) s[t] || (s[t] = /* @__PURE__ */ new Map());
  let m = [];
  const A = /* @__PURE__ */ new Map();
  if (o.cubierta && r.elements.length < 3e3) {
    const t = g.map((S) => S[2]), a = Math.min(...t) + 0.5 * (Math.max(...t) - Math.min(...t));
    m = K(g, r.elements, a, r.tipos);
    const l = 2146e4, f = 0.2, p = l / (2 * (1 + f)), b = 2.4, M = (o.tCubierta ?? 60) / 1e3;
    if ((o.modoCubierta ?? 0) === 1) {
      const S = o.qCubierta ?? 0.5, E = (I) => {
        const $ = (y, x, k) => {
          const z = [x[0] - y[0], x[1] - y[1], x[2] - y[2]], B = [k[0] - y[0], k[1] - y[1], k[2] - y[2]], N = z[1] * B[2] - z[2] * B[1], T = z[2] * B[0] - z[0] * B[2], q = z[0] * B[1] - z[1] * B[0];
          return 0.5 * Math.hypot(N, T, q);
        };
        return $(I[0], I[1], I[2]) + $(I[0], I[2], I[3]);
      };
      for (const I of m) {
        const $ = E(I.map((x) => g[x])), y = -S * $ / 4;
        for (const x of I) {
          const k = A.get(x) ?? 0;
          A.set(x, k + y);
        }
      }
    } else for (const S of m) {
      const E = h.length;
      h.push(S), s.elasticities.set(E, l), s.shearModuli.set(E, p), s.poissonsRatios.set(E, f), s.densities.set(E, b), (s.thicknesses ?? (s.thicknesses = /* @__PURE__ */ new Map())).set(E, M), (s.plateFormulations ?? (s.plateFormulations = /* @__PURE__ */ new Map())).set(E, o.formaCubierta ?? 2);
    }
  }
  d.nodes.val = g, d.elements.val = h;
  const C = new Map(r.loads ?? []);
  for (const [t, a] of A) {
    const l = C.get(t) ?? [0, 0, 0, 0, 0, 0];
    C.set(t, [l[0], l[1], (l[2] ?? 0) + a, l[3] ?? 0, l[4] ?? 0, l[5] ?? 0]);
  }
  d.nodeInputs.val = { supports: new Map(r.supports ?? []), loads: C }, d.elementInputs.val = s;
  const i = [];
  if (m.length && (o.modoCubierta ?? 0) === 0) {
    const t = [];
    for (const l of m) {
      const [f, p, b, M] = l.map((S) => g[S]);
      t.push(f[0], f[1], f[2], p[0], p[1], p[2], b[0], b[1], b[2]), t.push(f[0], f[1], f[2], b[0], b[1], b[2], M[0], M[1], M[2]);
    }
    const a = new L();
    a.setAttribute("position", new Z(t, 3)), a.computeVertexNormals(), i.push(new O(a, new j({ color: D.AREA, transparent: true, opacity: 0.5, side: U })));
  }
  const e = /* @__PURE__ */ new Map();
  h.forEach((t, a) => {
    var _a2;
    const l = ((_a2 = r.tipos) == null ? void 0 : _a2[u[a]]) ?? (t.length === 4 ? "AREA" : "BEAM");
    if (t.length !== 2) return;
    const f = g[t[0]], p = g[t[1]];
    if (!f || !p) return;
    const b = e.get(l) ?? [];
    b.push(new R(f[0], f[1], f[2]), new R(p[0], p[1], p[2])), e.set(l, b);
  });
  for (const [t, a] of e) a.length && i.push(new F(new L().setFromPoints(a), new _({ color: D[t] ?? 9741240 })));
  d.objects3D.val = i;
  const n = new Set(r.secciones ?? []), c = ["Shell-Thick", "Shell-Thin", "Membrana"][o.formaCubierta ?? 2] ?? "Membrana";
  console.log(`[CSI Importer] ${r.archivo} (${r.fuente}): ${g.length} nudos, ${h.length}/${r.elements.length} elementos, ${n.size} secciones, ${((_b = r.supports) == null ? void 0 : _b.length) ?? 0} apoyos, ${((_c = r.loads) == null ? void 0 : _c.length) ?? 0} cargas` + (m.length ? `, cubierta: ${m.length} pa\xF1os (${c})` : "") + `. Secciones: ${[...n].join(", ")}`);
} };
function X(o, d) {
  var _a;
  const r = [], w = [], v = [];
  let g = 0;
  const h = o.Z ?? 0;
  for (const u of o.zapatas) {
    const s = u.Lz / 2, m = u.Bz / 2;
    r.push([u.xC - s, u.yC - m, h]);
    const A = g++;
    r.push([u.xC + s, u.yC - m, h]);
    const C = g++;
    r.push([u.xC + s, u.yC + m, h]);
    const i = g++;
    r.push([u.xC - s, u.yC + m, h]);
    const e = g++;
    w.push([A, C, i, e]);
    const n = new O(new V(u.bc, u.bc, 0.5), new j({ color: 8421504 }));
    n.position.set(u.xCol, u.yCol, h + 0.25), v.push(n);
  }
  if (o.vigasAmarre) {
    const u = [];
    for (const s of o.vigasAmarre) {
      const m = s.z ?? h, A = s.x2 - s.x1, C = s.y2 - s.y1, i = Math.hypot(A, C);
      if (i < 1e-6) continue;
      u.push(new R(s.x1, s.y1, m)), u.push(new R(s.x2, s.y2, m));
      const e = new O(new V(s.b, i, s.h), new j({ color: 2282478, transparent: true, opacity: 0.35 }));
      e.position.set((s.x1 + s.x2) / 2, (s.y1 + s.y2) / 2, m), e.rotateZ(Math.atan2(C, A) - Math.PI / 2), v.push(e);
    }
    u.length && v.push(new F(new L().setFromPoints(u), new _({ color: 2282478, linewidth: 3 })));
  }
  d.nodes.val = r, d.elements.val = w, d.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, d.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, d.objects3D.val = v, console.log(`[CSI Importer] f2k: ${o.zapatas.length} zapatas + ${((_a = o.vigasAmarre) == null ? void 0 : _a.length) ?? 0} vigas de amarre.`);
}
export {
  J as c
};
