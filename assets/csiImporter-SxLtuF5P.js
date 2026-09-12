import { B as S, F as R, M as E, a as y, D as z, V as I, L as k, b as $, c as x } from "./theme-DQ--CgsI.js";
const B = { COLUMN: 15680580, BEAM: 2278750, BRACE: 3900150, AREA: 16096779 };
function O(s, g, a, d) {
  const M = d ? j(s, g, d) : [];
  if (M.length) return M;
  const m = s.length, f = (t, n) => t < n ? t + "_" + n : n + "_" + t, p = /* @__PURE__ */ new Set(), r = Array.from({ length: m }, () => []);
  for (const t of g) t.length === 2 && (p.add(f(t[0], t[1])), r[t[0]].push(t[1]), r[t[1]].push(t[0]));
  const w = (t, n) => p.has(f(t, n)), v = /* @__PURE__ */ new Set(), l = [];
  for (let t = 0; t < m; t++) for (const n of r[t]) if (!(n < t)) {
    for (const e of r[n]) if (e !== t) for (const o of r[e]) {
      if (o === n || o === t || !w(o, t) || (s[t][2] + s[n][2] + s[e][2] + s[o][2]) / 4 < a) continue;
      const c = [t, n, e, o].slice().sort((i, u) => i - u).join("-");
      v.has(c) || (v.add(c), l.push([t, n, e, o]));
    }
  }
  return l;
}
function j(s, g, a) {
  const d = /* @__PURE__ */ new Map();
  if (g.forEach((n, e) => {
    n.length === 2 && a[e] === "BRACE" && ((d.get(n[0]) ?? d.set(n[0], []).get(n[0])).push(n[1]), (d.get(n[1]) ?? d.set(n[1], []).get(n[1])).push(n[0]));
  }), !d.size) return [];
  const M = /* @__PURE__ */ new Set(), m = [];
  for (const n of d.keys()) {
    if (M.has(n)) continue;
    const e = [], o = [n];
    for (M.add(n); o.length; ) {
      const c = o.pop();
      e.push(c);
      for (const i of d.get(c)) M.has(i) || (M.add(i), o.push(i));
    }
    m.push(e);
  }
  const f = (n) => {
    const e = new Set(n), o = (h) => d.get(h).filter((C) => e.has(C));
    let c = n.find((h) => o(h).length === 1) ?? n[0];
    const i = [c], u = /* @__PURE__ */ new Set([c]);
    let b = c;
    for (; ; ) {
      const h = o(b).find((C) => !u.has(C));
      if (h == null) break;
      i.push(h), u.add(h), b = h;
    }
    return i.length === n.length ? i : n;
  }, p = m.map(f), r = (n) => n.reduce((e, o) => e + s[o][0], 0) / n.length, w = (n) => n.reduce((e, o) => e + s[o][1], 0) / n.length, v = /* @__PURE__ */ new Map();
  p.forEach((n) => {
    const e = n.length + ":" + Math.round(r(n) / 4);
    (v.get(e) ?? v.set(e, []).get(e)).push(n);
  });
  const l = (n, e) => (s[n][0] - s[e][0]) ** 2 + (s[n][2] - s[e][2]) ** 2, t = [];
  for (const n of v.values()) if (!(n.length < 2)) {
    n.sort((e, o) => w(e) - w(o));
    for (let e = 0; e < n.length - 1; e++) {
      const o = n[e], c = n[e + 1].slice();
      if (o.length !== c.length) continue;
      const i = o.length;
      l(o[0], c[0]) + l(o[i - 1], c[i - 1]) > l(o[0], c[i - 1]) + l(o[i - 1], c[0]) && c.reverse();
      for (let u = 0; u < i - 1; u++) t.push([o[u], o[u + 1], c[u + 1], c[u]]);
    }
  }
  return t;
}
function L(s) {
  const g = s.nodes, a = (l, t, n) => {
    const e = [n[0] - t[0], n[1] - t[1], n[2] - t[2]], o = [l[0] - t[0], l[1] - t[1], l[2] - t[2]], c = e[0] ** 2 + e[1] ** 2 + e[2] ** 2;
    if (c < 1e-9) return -1;
    const i = (o[0] * e[0] + o[1] * e[1] + o[2] * e[2]) / c;
    if (i < 1e-4 || i > 1 - 1e-4) return -1;
    const u = [t[0] + e[0] * i, t[1] + e[1] * i, t[2] + e[2] * i];
    return Math.hypot(l[0] - u[0], l[1] - u[1], l[2] - u[2]) < 1e-3 ? i : -1;
  }, d = {};
  for (const [l, t] of Object.entries(s.elementInputs ?? {})) d[l] = new Map(t);
  const M = [], m = [], f = [], p = [], r = [];
  s.elements.forEach((l, t) => {
    const n = (h) => {
      var _a, _b, _c;
      M.push(h), m.push((_a = s.tipos) == null ? void 0 : _a[t]), f.push((_b = s.secciones) == null ? void 0 : _b[t]), p.push((_c = s.plantas) == null ? void 0 : _c[t]), r.push(t);
    };
    if (l.length !== 2) {
      n(l);
      return;
    }
    const [e, o] = l, c = g[e], i = g[o], u = [];
    for (let h = 0; h < g.length; h++) {
      if (h === e || h === o) continue;
      const C = a(g[h], c, i);
      C > 0 && u.push([C, h]);
    }
    if (!u.length) {
      n(l);
      return;
    }
    u.sort((h, C) => h[0] - C[0]);
    let b = e;
    for (const [, h] of u) n([b, h]), b = h;
    n([b, o]);
  });
  const w = {};
  for (const [l, t] of Object.entries(d)) {
    const n = [];
    r.forEach((e, o) => {
      const c = t.get(e);
      c !== void 0 && n.push([o, c]);
    }), w[l] = n;
  }
  const v = M.filter((l) => l.length === 2).length - s.elements.filter((l) => l.length === 2).length;
  return v > 0 && console.log(`[CSI Importer] conectadas ${v} intersecciones (mesh-at-intersections, como SAP/ETABS)`), { ...s, elements: M, tipos: m, secciones: f, plantas: p, elementInputs: w };
}
function V(s, g) {
  s.nodes.val = [], s.elements.val = [], s.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, s.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, s.objects3D.val = [], console.log("[CSI Importer] " + g);
}
const F = { id: "csi-importer", name: "Importar CSI (E2K/F2K/S2K)", category: "\u{1F9EA} Utilidades", defaultShellResult: "none", availableShellResults: [], params: { verColumnas: { default: 1, boolean: true, label: "Columnas", folder: "\u{1F441} Ver por tipo" }, verVigas: { default: 1, boolean: true, label: "Vigas", folder: "\u{1F441} Ver por tipo" }, verDiagonales: { default: 1, boolean: true, label: "Diagonales", folder: "\u{1F441} Ver por tipo" }, verAreas: { default: 1, boolean: true, label: "\xC1reas", folder: "\u{1F441} Ver por tipo" }, conectar: { default: 1, boolean: true, label: "Conectar en intersecciones (SAP/ETABS)", folder: "\u{1F441} Ver por tipo" }, cubierta: { default: 0, boolean: true, label: "Poner cubierta (slab membrana)", folder: "\u{1F3E0} Cubierta" }, formaCubierta: { default: 2, label: "Formulaci\xF3n de la placa", options: { "Membrana (solo su plano)": 2, "Shell-Thin (Kirchhoff)": 1, "Shell-Thick (Mindlin)": 0 }, folder: "\u{1F3E0} Cubierta" }, tCubierta: { default: 60, min: 0.5, max: 300, step: 0.5, label: "Espesor cubierta (mm)", folder: "\u{1F3E0} Cubierta" } }, computedLabels(s, g) {
  var _a, _b, _c;
  const a = window.__hekatanImportedModel;
  if (!a) return { Archivo: "ninguno \u2014 usa \u{1F4E5} Importar" };
  const d = /* @__PURE__ */ new Map();
  (_a = a.secciones) == null ? void 0 : _a.forEach((f) => d.set(f, (d.get(f) ?? 0) + 1));
  const M = [...d.entries()].sort((f, p) => p[1] - f[1]).slice(0, 6), m = { Archivo: `${a.archivo} (${a.fuente})`, Nudos: String(a.nodes.length), Elementos: String(a.elements.length), Apoyos: String(((_b = a.supports) == null ? void 0 : _b.length) ?? 0), Cargas: String(((_c = a.loads) == null ? void 0 : _c.length) ?? 0), Plantas: String(new Set(a.plantas ?? []).size) };
  return M.forEach(([f, p]) => {
    m[`  ${f}`] = `${p}`;
  }), m;
}, build(s, g) {
  var _a, _b, _c;
  let a = window.__hekatanImportedModel;
  const d = window.__hekatanImportedCim;
  if (!a) return ((_a = d == null ? void 0 : d.zapatas) == null ? void 0 : _a.length) ? D(d, g) : V(g, "Sin archivo. Usa el folder '\u{1F4E5} Importar archivo'.");
  s.conectar && a.elements.length < 3e3 && (a = L(a));
  const M = (e) => e === "COLUMN" && s.verColumnas || e === "BEAM" && s.verVigas || e === "BRACE" && s.verDiagonales || e === "AREA" && s.verAreas || !["COLUMN", "BEAM", "BRACE", "AREA"].includes(e), m = a.nodes, f = [], p = [];
  a.elements.forEach((e, o) => {
    var _a2;
    const c = ((_a2 = a.tipos) == null ? void 0 : _a2[o]) ?? (e.length === 4 ? "AREA" : "BEAM");
    M(c) && (f.push(e), p.push(o));
  });
  const r = {};
  for (const [e, o] of Object.entries(a.elementInputs ?? {})) {
    const c = new Map(o), i = /* @__PURE__ */ new Map();
    p.forEach((u, b) => {
      const h = c.get(u);
      h !== void 0 && i.set(b, h);
    }), r[e] = i;
  }
  for (const e of ["elasticities", "shearModuli", "areas", "momentsOfInertiaY", "momentsOfInertiaZ", "torsionalConstants", "densities", "poissonsRatios"]) r[e] || (r[e] = /* @__PURE__ */ new Map());
  let w = [];
  if (s.cubierta && a.elements.length < 3e3) {
    const e = m.map((C) => C[2]), o = Math.min(...e) + 0.5 * (Math.max(...e) - Math.min(...e));
    w = O(m, a.elements, o, a.tipos);
    const c = 2146e4, i = 0.2, u = c / (2 * (1 + i)), b = 2.4, h = (s.tCubierta ?? 60) / 1e3;
    for (const C of w) {
      const A = f.length;
      f.push(C), r.elasticities.set(A, c), r.shearModuli.set(A, u), r.poissonsRatios.set(A, i), r.densities.set(A, b), (r.thicknesses ?? (r.thicknesses = /* @__PURE__ */ new Map())).set(A, h), (r.plateFormulations ?? (r.plateFormulations = /* @__PURE__ */ new Map())).set(A, s.formaCubierta ?? 2);
    }
  }
  g.nodes.val = m, g.elements.val = f, g.nodeInputs.val = { supports: new Map(a.supports ?? []), loads: new Map(a.loads ?? []) }, g.elementInputs.val = r;
  const v = [];
  if (w.length) {
    const e = [];
    for (const c of w) {
      const [i, u, b, h] = c.map((C) => m[C]);
      e.push(i[0], i[1], i[2], u[0], u[1], u[2], b[0], b[1], b[2]), e.push(i[0], i[1], i[2], b[0], b[1], b[2], h[0], h[1], h[2]);
    }
    const o = new S();
    o.setAttribute("position", new R(e, 3)), o.computeVertexNormals(), v.push(new E(o, new y({ color: B.AREA, transparent: true, opacity: 0.5, side: z })));
  }
  const l = /* @__PURE__ */ new Map();
  f.forEach((e, o) => {
    var _a2;
    const c = ((_a2 = a.tipos) == null ? void 0 : _a2[p[o]]) ?? (e.length === 4 ? "AREA" : "BEAM");
    if (e.length !== 2) return;
    const i = m[e[0]], u = m[e[1]];
    if (!i || !u) return;
    const b = l.get(c) ?? [];
    b.push(new I(i[0], i[1], i[2]), new I(u[0], u[1], u[2])), l.set(c, b);
  });
  for (const [e, o] of l) o.length && v.push(new k(new S().setFromPoints(o), new $({ color: B[e] ?? 9741240 })));
  g.objects3D.val = v;
  const t = new Set(a.secciones ?? []), n = ["Shell-Thick", "Shell-Thin", "Membrana"][s.formaCubierta ?? 2] ?? "Membrana";
  console.log(`[CSI Importer] ${a.archivo} (${a.fuente}): ${m.length} nudos, ${f.length}/${a.elements.length} elementos, ${t.size} secciones, ${((_b = a.supports) == null ? void 0 : _b.length) ?? 0} apoyos, ${((_c = a.loads) == null ? void 0 : _c.length) ?? 0} cargas` + (w.length ? `, cubierta: ${w.length} pa\xF1os (${n})` : "") + `. Secciones: ${[...t].join(", ")}`);
} };
function D(s, g) {
  var _a;
  const a = [], d = [], M = [];
  let m = 0;
  const f = s.Z ?? 0;
  for (const p of s.zapatas) {
    const r = p.Lz / 2, w = p.Bz / 2;
    a.push([p.xC - r, p.yC - w, f]);
    const v = m++;
    a.push([p.xC + r, p.yC - w, f]);
    const l = m++;
    a.push([p.xC + r, p.yC + w, f]);
    const t = m++;
    a.push([p.xC - r, p.yC + w, f]);
    const n = m++;
    d.push([v, l, t, n]);
    const e = new E(new x(p.bc, p.bc, 0.5), new y({ color: 8421504 }));
    e.position.set(p.xCol, p.yCol, f + 0.25), M.push(e);
  }
  if (s.vigasAmarre) {
    const p = [];
    for (const r of s.vigasAmarre) {
      const w = r.z ?? f, v = r.x2 - r.x1, l = r.y2 - r.y1, t = Math.hypot(v, l);
      if (t < 1e-6) continue;
      p.push(new I(r.x1, r.y1, w)), p.push(new I(r.x2, r.y2, w));
      const n = new E(new x(r.b, t, r.h), new y({ color: 2282478, transparent: true, opacity: 0.35 }));
      n.position.set((r.x1 + r.x2) / 2, (r.y1 + r.y2) / 2, w), n.rotateZ(Math.atan2(l, v) - Math.PI / 2), M.push(n);
    }
    p.length && M.push(new k(new S().setFromPoints(p), new $({ color: 2282478, linewidth: 3 })));
  }
  g.nodes.val = a, g.elements.val = d, g.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, g.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, g.objects3D.val = M, console.log(`[CSI Importer] f2k: ${s.zapatas.length} zapatas + ${((_a = s.vigasAmarre) == null ? void 0 : _a.length) ?? 0} vigas de amarre.`);
}
export {
  F as c
};
