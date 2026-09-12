import { B as S, F as z, M as E, a as y, D as k, V as I, L as R, b as $, c as x } from "./theme-DQ--CgsI.js";
const B = { COLUMN: 15680580, BEAM: 2278750, BRACE: 3900150, AREA: 16096779 };
function O(a, h, s, f) {
  const w = f ? L(a, h, f) : [];
  if (w.length) return w;
  const g = a.length, u = (r, n) => r < n ? r + "_" + n : n + "_" + r, l = /* @__PURE__ */ new Set(), o = Array.from({ length: g }, () => []);
  for (const r of h) r.length === 2 && (l.add(u(r[0], r[1])), o[r[0]].push(r[1]), o[r[1]].push(r[0]));
  const d = (r, n) => l.has(u(r, n)), v = /* @__PURE__ */ new Set(), M = [];
  for (let r = 0; r < g; r++) for (const n of o[r]) if (!(n < r)) {
    for (const e of o[n]) if (e !== r) for (const t of o[e]) {
      if (t === n || t === r || !d(t, r) || (a[r][2] + a[n][2] + a[e][2] + a[t][2]) / 4 < s) continue;
      const c = [r, n, e, t].slice().sort((i, p) => i - p).join("-");
      v.has(c) || (v.add(c), M.push([r, n, e, t]));
    }
  }
  return M;
}
function L(a, h, s) {
  const f = /* @__PURE__ */ new Map();
  if (h.forEach((n, e) => {
    n.length === 2 && s[e] === "BRACE" && ((f.get(n[0]) ?? f.set(n[0], []).get(n[0])).push(n[1]), (f.get(n[1]) ?? f.set(n[1], []).get(n[1])).push(n[0]));
  }), !f.size) return [];
  const w = /* @__PURE__ */ new Set(), g = [];
  for (const n of f.keys()) {
    if (w.has(n)) continue;
    const e = [], t = [n];
    for (w.add(n); t.length; ) {
      const c = t.pop();
      e.push(c);
      for (const i of f.get(c)) w.has(i) || (w.add(i), t.push(i));
    }
    g.push(e);
  }
  const u = (n) => {
    const e = new Set(n), t = (m) => f.get(m).filter((C) => e.has(C));
    let c = n.find((m) => t(m).length === 1) ?? n[0];
    const i = [c], p = /* @__PURE__ */ new Set([c]);
    let b = c;
    for (; ; ) {
      const m = t(b).find((C) => !p.has(C));
      if (m == null) break;
      i.push(m), p.add(m), b = m;
    }
    return i.length === n.length ? i : n;
  }, l = g.map(u), o = (n) => n.reduce((e, t) => e + a[t][0], 0) / n.length, d = (n) => n.reduce((e, t) => e + a[t][1], 0) / n.length, v = /* @__PURE__ */ new Map();
  l.forEach((n) => {
    const e = n.length + ":" + Math.round(o(n) / 4);
    (v.get(e) ?? v.set(e, []).get(e)).push(n);
  });
  const M = (n, e) => (a[n][0] - a[e][0]) ** 2 + (a[n][2] - a[e][2]) ** 2, r = [];
  for (const n of v.values()) if (!(n.length < 2)) {
    n.sort((e, t) => d(e) - d(t));
    for (let e = 0; e < n.length - 1; e++) {
      const t = n[e], c = n[e + 1].slice();
      if (t.length !== c.length) continue;
      const i = t.length;
      M(t[0], c[0]) + M(t[i - 1], c[i - 1]) > M(t[0], c[i - 1]) + M(t[i - 1], c[0]) && c.reverse();
      for (let p = 0; p < i - 1; p++) r.push([t[p], t[p + 1], c[p + 1], c[p]]);
    }
  }
  return r;
}
function j(a, h) {
  a.nodes.val = [], a.elements.val = [], a.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, a.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, a.objects3D.val = [], console.log("[CSI Importer] " + h);
}
const _ = { id: "csi-importer", name: "Importar CSI (E2K/F2K/S2K)", category: "\u{1F9EA} Utilidades", defaultShellResult: "none", availableShellResults: [], params: { verColumnas: { default: 1, boolean: true, label: "Columnas", folder: "\u{1F441} Ver por tipo" }, verVigas: { default: 1, boolean: true, label: "Vigas", folder: "\u{1F441} Ver por tipo" }, verDiagonales: { default: 1, boolean: true, label: "Diagonales", folder: "\u{1F441} Ver por tipo" }, verAreas: { default: 1, boolean: true, label: "\xC1reas", folder: "\u{1F441} Ver por tipo" }, cubierta: { default: 0, boolean: true, label: "Poner cubierta (slab membrana)", folder: "\u{1F3E0} Cubierta" }, formaCubierta: { default: 2, label: "Formulaci\xF3n de la placa", options: { "Membrana (solo su plano)": 2, "Shell-Thin (Kirchhoff)": 1, "Shell-Thick (Mindlin)": 0 }, folder: "\u{1F3E0} Cubierta" }, tCubierta: { default: 60, min: 0.5, max: 300, step: 0.5, label: "Espesor cubierta (mm)", folder: "\u{1F3E0} Cubierta" } }, computedLabels(a, h) {
  var _a, _b, _c;
  const s = window.__hekatanImportedModel;
  if (!s) return { Archivo: "ninguno \u2014 usa \u{1F4E5} Importar" };
  const f = /* @__PURE__ */ new Map();
  (_a = s.secciones) == null ? void 0 : _a.forEach((u) => f.set(u, (f.get(u) ?? 0) + 1));
  const w = [...f.entries()].sort((u, l) => l[1] - u[1]).slice(0, 6), g = { Archivo: `${s.archivo} (${s.fuente})`, Nudos: String(s.nodes.length), Elementos: String(s.elements.length), Apoyos: String(((_b = s.supports) == null ? void 0 : _b.length) ?? 0), Cargas: String(((_c = s.loads) == null ? void 0 : _c.length) ?? 0), Plantas: String(new Set(s.plantas ?? []).size) };
  return w.forEach(([u, l]) => {
    g[`  ${u}`] = `${l}`;
  }), g;
}, build(a, h) {
  var _a, _b, _c;
  const s = window.__hekatanImportedModel, f = window.__hekatanImportedCim;
  if (!s) return ((_a = f == null ? void 0 : f.zapatas) == null ? void 0 : _a.length) ? V(f, h) : j(h, "Sin archivo. Usa el folder '\u{1F4E5} Importar archivo'.");
  const w = (e) => e === "COLUMN" && a.verColumnas || e === "BEAM" && a.verVigas || e === "BRACE" && a.verDiagonales || e === "AREA" && a.verAreas || !["COLUMN", "BEAM", "BRACE", "AREA"].includes(e), g = s.nodes, u = [], l = [];
  s.elements.forEach((e, t) => {
    var _a2;
    const c = ((_a2 = s.tipos) == null ? void 0 : _a2[t]) ?? (e.length === 4 ? "AREA" : "BEAM");
    w(c) && (u.push(e), l.push(t));
  });
  const o = {};
  for (const [e, t] of Object.entries(s.elementInputs ?? {})) {
    const c = new Map(t), i = /* @__PURE__ */ new Map();
    l.forEach((p, b) => {
      const m = c.get(p);
      m !== void 0 && i.set(b, m);
    }), o[e] = i;
  }
  for (const e of ["elasticities", "shearModuli", "areas", "momentsOfInertiaY", "momentsOfInertiaZ", "torsionalConstants", "densities", "poissonsRatios"]) o[e] || (o[e] = /* @__PURE__ */ new Map());
  let d = [];
  if (a.cubierta && s.elements.length < 3e3) {
    const e = g.map((C) => C[2]), t = Math.min(...e) + 0.5 * (Math.max(...e) - Math.min(...e));
    d = O(g, s.elements, t, s.tipos);
    const c = 2146e4, i = 0.2, p = c / (2 * (1 + i)), b = 2.4, m = (a.tCubierta ?? 60) / 1e3;
    for (const C of d) {
      const A = u.length;
      u.push(C), o.elasticities.set(A, c), o.shearModuli.set(A, p), o.poissonsRatios.set(A, i), o.densities.set(A, b), (o.thicknesses ?? (o.thicknesses = /* @__PURE__ */ new Map())).set(A, m), (o.plateFormulations ?? (o.plateFormulations = /* @__PURE__ */ new Map())).set(A, a.formaCubierta ?? 2);
    }
  }
  h.nodes.val = g, h.elements.val = u, h.nodeInputs.val = { supports: new Map(s.supports ?? []), loads: new Map(s.loads ?? []) }, h.elementInputs.val = o;
  const v = [];
  if (d.length) {
    const e = [];
    for (const c of d) {
      const [i, p, b, m] = c.map((C) => g[C]);
      e.push(i[0], i[1], i[2], p[0], p[1], p[2], b[0], b[1], b[2]), e.push(i[0], i[1], i[2], b[0], b[1], b[2], m[0], m[1], m[2]);
    }
    const t = new S();
    t.setAttribute("position", new z(e, 3)), t.computeVertexNormals(), v.push(new E(t, new y({ color: B.AREA, transparent: true, opacity: 0.5, side: k })));
  }
  const M = /* @__PURE__ */ new Map();
  u.forEach((e, t) => {
    var _a2;
    const c = ((_a2 = s.tipos) == null ? void 0 : _a2[l[t]]) ?? (e.length === 4 ? "AREA" : "BEAM");
    if (e.length !== 2) return;
    const i = g[e[0]], p = g[e[1]];
    if (!i || !p) return;
    const b = M.get(c) ?? [];
    b.push(new I(i[0], i[1], i[2]), new I(p[0], p[1], p[2])), M.set(c, b);
  });
  for (const [e, t] of M) t.length && v.push(new R(new S().setFromPoints(t), new $({ color: B[e] ?? 9741240 })));
  h.objects3D.val = v;
  const r = new Set(s.secciones ?? []), n = ["Shell-Thick", "Shell-Thin", "Membrana"][a.formaCubierta ?? 2] ?? "Membrana";
  console.log(`[CSI Importer] ${s.archivo} (${s.fuente}): ${g.length} nudos, ${u.length}/${s.elements.length} elementos, ${r.size} secciones, ${((_b = s.supports) == null ? void 0 : _b.length) ?? 0} apoyos, ${((_c = s.loads) == null ? void 0 : _c.length) ?? 0} cargas` + (d.length ? `, cubierta: ${d.length} pa\xF1os (${n})` : "") + `. Secciones: ${[...r].join(", ")}`);
} };
function V(a, h) {
  var _a;
  const s = [], f = [], w = [];
  let g = 0;
  const u = a.Z ?? 0;
  for (const l of a.zapatas) {
    const o = l.Lz / 2, d = l.Bz / 2;
    s.push([l.xC - o, l.yC - d, u]);
    const v = g++;
    s.push([l.xC + o, l.yC - d, u]);
    const M = g++;
    s.push([l.xC + o, l.yC + d, u]);
    const r = g++;
    s.push([l.xC - o, l.yC + d, u]);
    const n = g++;
    f.push([v, M, r, n]);
    const e = new E(new x(l.bc, l.bc, 0.5), new y({ color: 8421504 }));
    e.position.set(l.xCol, l.yCol, u + 0.25), w.push(e);
  }
  if (a.vigasAmarre) {
    const l = [];
    for (const o of a.vigasAmarre) {
      const d = o.z ?? u, v = o.x2 - o.x1, M = o.y2 - o.y1, r = Math.hypot(v, M);
      if (r < 1e-6) continue;
      l.push(new I(o.x1, o.y1, d)), l.push(new I(o.x2, o.y2, d));
      const n = new E(new x(o.b, r, o.h), new y({ color: 2282478, transparent: true, opacity: 0.35 }));
      n.position.set((o.x1 + o.x2) / 2, (o.y1 + o.y2) / 2, d), n.rotateZ(Math.atan2(M, v) - Math.PI / 2), w.push(n);
    }
    l.length && w.push(new R(new S().setFromPoints(l), new $({ color: 2282478, linewidth: 3 })));
  }
  h.nodes.val = s, h.elements.val = f, h.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, h.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, h.objects3D.val = w, console.log(`[CSI Importer] f2k: ${a.zapatas.length} zapatas + ${((_a = a.vigasAmarre) == null ? void 0 : _a.length) ?? 0} vigas de amarre.`);
}
export {
  _ as c
};
