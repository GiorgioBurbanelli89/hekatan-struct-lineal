import { B as O, F as Z, M as L, a as j, D as U, V as R, L as _, b as F, c as V } from "./theme-DQ--CgsI.js";
const D = { COLUMN: 15680580, BEAM: 2278750, BRACE: 3900150, AREA: 16096779 };
function K(s, d, a, m) {
  const v = m ? Y(s, d, m) : [];
  if (v.length) return v;
  const g = s.length, h = (n, e) => n < e ? n + "_" + e : e + "_" + n, p = /* @__PURE__ */ new Set(), r = Array.from({ length: g }, () => []);
  for (const n of d) n.length === 2 && (p.add(h(n[0], n[1])), r[n[0]].push(n[1]), r[n[1]].push(n[0]));
  const M = (n, e) => p.has(h(n, e)), C = /* @__PURE__ */ new Set(), u = [];
  for (let n = 0; n < g; n++) for (const e of r[n]) if (!(e < n)) {
    for (const o of r[e]) if (o !== n) for (const c of r[o]) {
      if (c === e || c === n || !M(c, n) || (s[n][2] + s[e][2] + s[o][2] + s[c][2]) / 4 < a) continue;
      const t = [n, e, o, c].slice().sort((i, l) => i - l).join("-");
      C.has(t) || (C.add(t), u.push([n, e, o, c]));
    }
  }
  return u;
}
function Y(s, d, a) {
  const m = /* @__PURE__ */ new Map();
  if (d.forEach((e, o) => {
    e.length === 2 && a[o] === "BRACE" && ((m.get(e[0]) ?? m.set(e[0], []).get(e[0])).push(e[1]), (m.get(e[1]) ?? m.set(e[1], []).get(e[1])).push(e[0]));
  }), !m.size) return [];
  const v = /* @__PURE__ */ new Set(), g = [];
  for (const e of m.keys()) {
    if (v.has(e)) continue;
    const o = [], c = [e];
    for (v.add(e); c.length; ) {
      const t = c.pop();
      o.push(t);
      for (const i of m.get(t)) v.has(i) || (v.add(i), c.push(i));
    }
    g.push(o);
  }
  const h = (e) => {
    const o = new Set(e), c = (f) => m.get(f).filter((b) => o.has(b));
    let t = e.find((f) => c(f).length === 1) ?? e[0];
    const i = [t], l = /* @__PURE__ */ new Set([t]);
    let w = t;
    for (; ; ) {
      const f = c(w).find((b) => !l.has(b));
      if (f == null) break;
      i.push(f), l.add(f), w = f;
    }
    return i.length === e.length ? i : e;
  }, p = g.map(h), r = (e) => e.reduce((o, c) => o + s[c][0], 0) / e.length, M = (e) => e.reduce((o, c) => o + s[c][1], 0) / e.length, C = /* @__PURE__ */ new Map();
  p.forEach((e) => {
    const o = e.length + ":" + Math.round(r(e) / 4);
    (C.get(o) ?? C.set(o, []).get(o)).push(e);
  });
  const u = (e, o) => (s[e][0] - s[o][0]) ** 2 + (s[e][2] - s[o][2]) ** 2, n = [];
  for (const e of C.values()) if (!(e.length < 2)) {
    e.sort((o, c) => M(o) - M(c));
    for (let o = 0; o < e.length - 1; o++) {
      const c = e[o], t = e[o + 1].slice();
      if (c.length !== t.length) continue;
      const i = c.length;
      u(c[0], t[0]) + u(c[i - 1], t[i - 1]) > u(c[0], t[i - 1]) + u(c[i - 1], t[0]) && t.reverse();
      for (let l = 0; l < i - 1; l++) n.push([c[l], c[l + 1], t[l + 1], t[l]]);
    }
  }
  return n;
}
function G(s) {
  const d = s.nodes, a = (u, n, e) => {
    const o = [e[0] - n[0], e[1] - n[1], e[2] - n[2]], c = [u[0] - n[0], u[1] - n[1], u[2] - n[2]], t = o[0] ** 2 + o[1] ** 2 + o[2] ** 2;
    if (t < 1e-9) return -1;
    const i = (c[0] * o[0] + c[1] * o[1] + c[2] * o[2]) / t;
    if (i < 1e-4 || i > 1 - 1e-4) return -1;
    const l = [n[0] + o[0] * i, n[1] + o[1] * i, n[2] + o[2] * i];
    return Math.hypot(u[0] - l[0], u[1] - l[1], u[2] - l[2]) < 1e-3 ? i : -1;
  }, m = {};
  for (const [u, n] of Object.entries(s.elementInputs ?? {})) m[u] = new Map(n);
  const v = [], g = [], h = [], p = [], r = [];
  s.elements.forEach((u, n) => {
    const e = (f) => {
      var _a, _b, _c;
      v.push(f), g.push((_a = s.tipos) == null ? void 0 : _a[n]), h.push((_b = s.secciones) == null ? void 0 : _b[n]), p.push((_c = s.plantas) == null ? void 0 : _c[n]), r.push(n);
    };
    if (u.length !== 2) {
      e(u);
      return;
    }
    const [o, c] = u, t = d[o], i = d[c], l = [];
    for (let f = 0; f < d.length; f++) {
      if (f === o || f === c) continue;
      const b = a(d[f], t, i);
      b > 0 && l.push([b, f]);
    }
    if (!l.length) {
      e(u);
      return;
    }
    l.sort((f, b) => f[0] - b[0]);
    let w = o;
    for (const [, f] of l) e([w, f]), w = f;
    e([w, c]);
  });
  const M = {};
  for (const [u, n] of Object.entries(m)) {
    const e = [];
    r.forEach((o, c) => {
      const t = n.get(o);
      t !== void 0 && e.push([c, t]);
    }), M[u] = e;
  }
  const C = v.filter((u) => u.length === 2).length - s.elements.filter((u) => u.length === 2).length;
  return C > 0 && console.log(`[CSI Importer] conectadas ${C} intersecciones (mesh-at-intersections, como SAP/ETABS)`), { ...s, elements: v, tipos: g, secciones: h, plantas: p, elementInputs: M };
}
function P(s, d) {
  s.nodes.val = [], s.elements.val = [], s.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, s.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, s.objects3D.val = [], console.log("[CSI Importer] " + d);
}
const J = { id: "csi-importer", name: "Importar CSI (E2K/F2K/S2K)", category: "\u{1F9EA} Utilidades", defaultShellResult: "none", availableShellResults: [], params: { verColumnas: { default: 1, boolean: true, label: "Columnas", folder: "\u{1F441} Ver por tipo" }, verVigas: { default: 1, boolean: true, label: "Vigas", folder: "\u{1F441} Ver por tipo" }, verDiagonales: { default: 1, boolean: true, label: "Diagonales", folder: "\u{1F441} Ver por tipo" }, verAreas: { default: 1, boolean: true, label: "\xC1reas", folder: "\u{1F441} Ver por tipo" }, conectar: { default: 1, boolean: true, label: "Conectar en intersecciones (SAP/ETABS)", folder: "\u{1F441} Ver por tipo" }, cubierta: { default: 0, boolean: true, label: "Poner cubierta (slab membrana)", folder: "\u{1F3E0} Cubierta" }, formaCubierta: { default: 2, label: "Formulaci\xF3n de la placa", options: { "Membrana (solo su plano)": 2, "Shell-Thin (Kirchhoff)": 1, "Shell-Thick (Mindlin)": 0 }, folder: "\u{1F3E0} Cubierta" }, tCubierta: { default: 60, min: 0.5, max: 300, step: 0.5, label: "Espesor cubierta (mm)", folder: "\u{1F3E0} Cubierta" }, modoCubierta: { default: 0, label: "Modo", options: { "Membrana (arriostra)": 0, "Zinc como carga (a correas)": 1 }, folder: "\u{1F3E0} Cubierta" }, qCubierta: { default: 0.5, min: 0, max: 10, step: 0.05, label: "Carga cubierta (kN/m\xB2)", folder: "\u{1F3E0} Cubierta" } }, computedLabels(s, d) {
  var _a, _b, _c;
  const a = window.__hekatanImportedModel;
  if (!a) return { Archivo: "ninguno \u2014 usa \u{1F4E5} Importar" };
  const m = /* @__PURE__ */ new Map();
  (_a = a.secciones) == null ? void 0 : _a.forEach((h) => m.set(h, (m.get(h) ?? 0) + 1));
  const v = [...m.entries()].sort((h, p) => p[1] - h[1]).slice(0, 6), g = { Archivo: `${a.archivo} (${a.fuente})`, Nudos: String(a.nodes.length), Elementos: String(a.elements.length), Apoyos: String(((_b = a.supports) == null ? void 0 : _b.length) ?? 0), Cargas: String(((_c = a.loads) == null ? void 0 : _c.length) ?? 0), Plantas: String(new Set(a.plantas ?? []).size) };
  return v.forEach(([h, p]) => {
    g[`  ${h}`] = `${p}`;
  }), g;
}, build(s, d) {
  var _a, _b, _c;
  let a = window.__hekatanImportedModel;
  const m = window.__hekatanImportedCim;
  if (!a) return ((_a = m == null ? void 0 : m.zapatas) == null ? void 0 : _a.length) ? X(m, d) : P(d, "Sin archivo. Usa el folder '\u{1F4E5} Importar archivo'.");
  s.conectar && a.elements.length < 3e3 && (a = G(a));
  const v = (t) => t === "COLUMN" && s.verColumnas || t === "BEAM" && s.verVigas || t === "BRACE" && s.verDiagonales || t === "AREA" && s.verAreas || !["COLUMN", "BEAM", "BRACE", "AREA"].includes(t), g = a.nodes, h = [], p = [];
  a.elements.forEach((t, i) => {
    var _a2;
    const l = ((_a2 = a.tipos) == null ? void 0 : _a2[i]) ?? (t.length === 4 ? "AREA" : "BEAM");
    v(l) && (h.push(t), p.push(i));
  });
  const r = {};
  for (const [t, i] of Object.entries(a.elementInputs ?? {})) {
    const l = new Map(i), w = /* @__PURE__ */ new Map();
    p.forEach((f, b) => {
      const I = l.get(f);
      I !== void 0 && w.set(b, I);
    }), r[t] = w;
  }
  for (const t of ["elasticities", "shearModuli", "areas", "momentsOfInertiaY", "momentsOfInertiaZ", "torsionalConstants", "densities", "poissonsRatios"]) r[t] || (r[t] = /* @__PURE__ */ new Map());
  let M = [];
  const C = /* @__PURE__ */ new Map();
  if (s.cubierta && a.elements.length < 3e3) {
    const t = g.map((x) => x[2]), i = Math.min(...t) + 0.5 * (Math.max(...t) - Math.min(...t));
    M = K(g, a.elements, i, a.tipos);
    const l = 2146e4, w = 0.2, f = l / (2 * (1 + w)), b = 2.4, I = (s.tCubierta ?? 60) / 1e3;
    if ((s.modoCubierta ?? 0) === 1) {
      const x = s.qCubierta ?? 0.5, S = (A) => {
        const $ = (E, y, k) => {
          const z = [y[0] - E[0], y[1] - E[1], y[2] - E[2]], B = [k[0] - E[0], k[1] - E[1], k[2] - E[2]], N = z[1] * B[2] - z[2] * B[1], T = z[2] * B[0] - z[0] * B[2], q = z[0] * B[1] - z[1] * B[0];
          return 0.5 * Math.hypot(N, T, q);
        };
        return $(A[0], A[1], A[2]) + $(A[0], A[2], A[3]);
      };
      for (const A of M) {
        const $ = S(A.map((y) => g[y])), E = -x * $ / 4;
        for (const y of A) {
          const k = C.get(y) ?? 0;
          C.set(y, k + E);
        }
      }
    } else for (const x of M) {
      const S = h.length;
      h.push(x), r.elasticities.set(S, l), r.shearModuli.set(S, f), r.poissonsRatios.set(S, w), r.densities.set(S, b), (r.thicknesses ?? (r.thicknesses = /* @__PURE__ */ new Map())).set(S, I), (r.plateFormulations ?? (r.plateFormulations = /* @__PURE__ */ new Map())).set(S, s.formaCubierta ?? 2);
    }
  }
  d.nodes.val = g, d.elements.val = h;
  const u = new Map(a.loads ?? []);
  for (const [t, i] of C) {
    const l = u.get(t) ?? [0, 0, 0, 0, 0, 0];
    u.set(t, [l[0], l[1], (l[2] ?? 0) + i, l[3] ?? 0, l[4] ?? 0, l[5] ?? 0]);
  }
  d.nodeInputs.val = { supports: new Map(a.supports ?? []), loads: u }, d.elementInputs.val = r;
  const n = [];
  if (M.length && (s.modoCubierta ?? 0) === 0) {
    const t = [];
    for (const l of M) {
      const [w, f, b, I] = l.map((x) => g[x]);
      t.push(w[0], w[1], w[2], f[0], f[1], f[2], b[0], b[1], b[2]), t.push(w[0], w[1], w[2], b[0], b[1], b[2], I[0], I[1], I[2]);
    }
    const i = new O();
    i.setAttribute("position", new Z(t, 3)), i.computeVertexNormals(), n.push(new L(i, new j({ color: D.AREA, transparent: true, opacity: 0.5, side: U })));
  }
  const e = /* @__PURE__ */ new Map();
  h.forEach((t, i) => {
    var _a2;
    const l = ((_a2 = a.tipos) == null ? void 0 : _a2[p[i]]) ?? (t.length === 4 ? "AREA" : "BEAM");
    if (t.length !== 2) return;
    const w = g[t[0]], f = g[t[1]];
    if (!w || !f) return;
    const b = e.get(l) ?? [];
    b.push(new R(w[0], w[1], w[2]), new R(f[0], f[1], f[2])), e.set(l, b);
  });
  for (const [t, i] of e) i.length && n.push(new _(new O().setFromPoints(i), new F({ color: D[t] ?? 9741240 })));
  d.objects3D.val = n;
  const o = new Set(a.secciones ?? []), c = ["Shell-Thick", "Shell-Thin", "Membrana"][s.formaCubierta ?? 2] ?? "Membrana";
  console.log(`[CSI Importer] ${a.archivo} (${a.fuente}): ${g.length} nudos, ${h.length}/${a.elements.length} elementos, ${o.size} secciones, ${((_b = a.supports) == null ? void 0 : _b.length) ?? 0} apoyos, ${((_c = a.loads) == null ? void 0 : _c.length) ?? 0} cargas` + (M.length ? `, cubierta: ${M.length} pa\xF1os (${c})` : "") + `. Secciones: ${[...o].join(", ")}`);
} };
function X(s, d) {
  var _a;
  const a = [], m = [], v = [];
  let g = 0;
  const h = s.Z ?? 0;
  for (const p of s.zapatas) {
    const r = p.Lz / 2, M = p.Bz / 2;
    a.push([p.xC - r, p.yC - M, h]);
    const C = g++;
    a.push([p.xC + r, p.yC - M, h]);
    const u = g++;
    a.push([p.xC + r, p.yC + M, h]);
    const n = g++;
    a.push([p.xC - r, p.yC + M, h]);
    const e = g++;
    m.push([C, u, n, e]);
    const o = new L(new V(p.bc, p.bc, 0.5), new j({ color: 8421504 }));
    o.position.set(p.xCol, p.yCol, h + 0.25), v.push(o);
  }
  if (s.vigasAmarre) {
    const p = [];
    for (const r of s.vigasAmarre) {
      const M = r.z ?? h, C = r.x2 - r.x1, u = r.y2 - r.y1, n = Math.hypot(C, u);
      if (n < 1e-6) continue;
      p.push(new R(r.x1, r.y1, M)), p.push(new R(r.x2, r.y2, M));
      const e = new L(new V(r.b, n, r.h), new j({ color: 2282478, transparent: true, opacity: 0.35 }));
      e.position.set((r.x1 + r.x2) / 2, (r.y1 + r.y2) / 2, M), e.rotateZ(Math.atan2(u, C) - Math.PI / 2), v.push(e);
    }
    p.length && v.push(new _(new O().setFromPoints(p), new F({ color: 2282478, linewidth: 3 })));
  }
  d.nodes.val = a, d.elements.val = m, d.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, d.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, d.objects3D.val = v, console.log(`[CSI Importer] f2k: ${s.zapatas.length} zapatas + ${((_a = s.vigasAmarre) == null ? void 0 : _a.length) ?? 0} vigas de amarre.`);
}
export {
  J as c
};
