import { V as g, L as b, B as E, a as y, M as C, b as I, c as A } from "./theme-Dxpmbnyd.js";
const S = { COLUMN: 15680580, BEAM: 2278750, BRACE: 3900150, AREA: 16096779 };
function x(t, r) {
  t.nodes.val = [], t.elements.val = [], t.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, t.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, t.objects3D.val = [], console.log("[CSI Importer] " + r);
}
const R = { id: "csi-importer", name: "Importar CSI (E2K/F2K/S2K)", category: "\u{1F9EA} Utilidades", defaultShellResult: "none", availableShellResults: [], params: { verColumnas: { default: 1, boolean: true, label: "Columnas", folder: "\u{1F441} Ver por tipo" }, verVigas: { default: 1, boolean: true, label: "Vigas", folder: "\u{1F441} Ver por tipo" }, verDiagonales: { default: 1, boolean: true, label: "Diagonales", folder: "\u{1F441} Ver por tipo" }, verAreas: { default: 1, boolean: true, label: "\xC1reas", folder: "\u{1F441} Ver por tipo" } }, computedLabels(t, r) {
  var _a, _b, _c;
  const e = window.__hekatanImportedModel;
  if (!e) return { Archivo: "ninguno \u2014 usa \u{1F4E5} Importar" };
  const c = /* @__PURE__ */ new Map();
  (_a = e.secciones) == null ? void 0 : _a.forEach((a) => c.set(a, (c.get(a) ?? 0) + 1));
  const h = [...c.entries()].sort((a, n) => n[1] - a[1]).slice(0, 6), i = { Archivo: `${e.archivo} (${e.fuente})`, Nudos: String(e.nodes.length), Elementos: String(e.elements.length), Apoyos: String(((_b = e.supports) == null ? void 0 : _b.length) ?? 0), Cargas: String(((_c = e.loads) == null ? void 0 : _c.length) ?? 0), Plantas: String(new Set(e.plantas ?? []).size) };
  return h.forEach(([a, n]) => {
    i[`  ${a}`] = `${n}`;
  }), i;
}, build(t, r) {
  var _a, _b, _c;
  const e = window.__hekatanImportedModel, c = window.__hekatanImportedCim;
  if (!e) return ((_a = c == null ? void 0 : c.zapatas) == null ? void 0 : _a.length) ? $(c, r) : x(r, "Sin archivo. Usa el folder '\u{1F4E5} Importar archivo'.");
  const h = (s) => s === "COLUMN" && t.verColumnas || s === "BEAM" && t.verVigas || s === "BRACE" && t.verDiagonales || s === "AREA" && t.verAreas || !["COLUMN", "BEAM", "BRACE", "AREA"].includes(s), i = e.nodes, a = [], n = [];
  e.elements.forEach((s, l) => {
    var _a2;
    const u = ((_a2 = e.tipos) == null ? void 0 : _a2[l]) ?? (s.length === 4 ? "AREA" : "BEAM");
    h(u) && (a.push(s), n.push(l));
  });
  const o = {};
  for (const [s, l] of Object.entries(e.elementInputs ?? {})) {
    const u = new Map(l), w = /* @__PURE__ */ new Map();
    n.forEach((d, M) => {
      const v = u.get(d);
      v !== void 0 && w.set(M, v);
    }), o[s] = w;
  }
  for (const s of ["elasticities", "shearModuli", "areas", "momentsOfInertiaY", "momentsOfInertiaZ", "torsionalConstants", "densities", "poissonsRatios"]) o[s] || (o[s] = /* @__PURE__ */ new Map());
  r.nodes.val = i, r.elements.val = a, r.nodeInputs.val = { supports: new Map(e.supports ?? []), loads: new Map(e.loads ?? []) }, r.elementInputs.val = o;
  const p = [], m = /* @__PURE__ */ new Map();
  a.forEach((s, l) => {
    var _a2;
    const u = ((_a2 = e.tipos) == null ? void 0 : _a2[n[l]]) ?? (s.length === 4 ? "AREA" : "BEAM");
    if (s.length !== 2) return;
    const w = i[s[0]], d = i[s[1]];
    if (!w || !d) return;
    const M = m.get(u) ?? [];
    M.push(new g(w[0], w[1], w[2]), new g(d[0], d[1], d[2])), m.set(u, M);
  });
  for (const [s, l] of m) l.length && p.push(new b(new E().setFromPoints(l), new y({ color: S[s] ?? 9741240 })));
  r.objects3D.val = p;
  const f = new Set(e.secciones ?? []);
  console.log(`[CSI Importer] ${e.archivo} (${e.fuente}): ${i.length} nudos, ${a.length}/${e.elements.length} elementos visibles, ${f.size} secciones, ${((_b = e.supports) == null ? void 0 : _b.length) ?? 0} apoyos, ${((_c = e.loads) == null ? void 0 : _c.length) ?? 0} cargas. Secciones: ${[...f].join(", ")}`);
} };
function $(t, r) {
  var _a;
  const e = [], c = [], h = [];
  let i = 0;
  const a = t.Z ?? 0;
  for (const n of t.zapatas) {
    const o = n.Lz / 2, p = n.Bz / 2;
    e.push([n.xC - o, n.yC - p, a]);
    const m = i++;
    e.push([n.xC + o, n.yC - p, a]);
    const f = i++;
    e.push([n.xC + o, n.yC + p, a]);
    const s = i++;
    e.push([n.xC - o, n.yC + p, a]);
    const l = i++;
    c.push([m, f, s, l]);
    const u = new C(new I(n.bc, n.bc, 0.5), new A({ color: 8421504 }));
    u.position.set(n.xCol, n.yCol, a + 0.25), h.push(u);
  }
  if (t.vigasAmarre) {
    const n = [];
    for (const o of t.vigasAmarre) {
      const p = o.z ?? a, m = o.x2 - o.x1, f = o.y2 - o.y1, s = Math.hypot(m, f);
      if (s < 1e-6) continue;
      n.push(new g(o.x1, o.y1, p)), n.push(new g(o.x2, o.y2, p));
      const l = new C(new I(o.b, s, o.h), new A({ color: 2282478, transparent: true, opacity: 0.35 }));
      l.position.set((o.x1 + o.x2) / 2, (o.y1 + o.y2) / 2, p), l.rotateZ(Math.atan2(f, m) - Math.PI / 2), h.push(l);
    }
    n.length && h.push(new b(new E().setFromPoints(n), new y({ color: 2282478, linewidth: 3 })));
  }
  r.nodes.val = e, r.elements.val = c, r.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, r.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, r.objects3D.val = h, console.log(`[CSI Importer] f2k: ${t.zapatas.length} zapatas + ${((_a = t.vigasAmarre) == null ? void 0 : _a.length) ?? 0} vigas de amarre.`);
}
export {
  R as c
};
