import { B as S, F as B, M as E, a as y, D as O, V as I, L as $, b as R, c as x } from "./theme-DQ--CgsI.js";
const z = { COLUMN: 15680580, BEAM: 2278750, BRACE: 3900150, AREA: 16096779 };
function L(a, c, t) {
  const g = a.length, b = (n, i) => n < i ? n + "_" + i : i + "_" + n, p = /* @__PURE__ */ new Set(), r = Array.from({ length: g }, () => []);
  for (const n of c) n.length === 2 && (p.add(b(n[0], n[1])), r[n[0]].push(n[1]), r[n[1]].push(n[0]));
  const s = (n, i) => p.has(b(n, i)), e = /* @__PURE__ */ new Set(), u = [];
  for (let n = 0; n < g; n++) for (const i of r[n]) if (!(i < n)) {
    for (const w of r[i]) if (w !== n) for (const f of r[w]) {
      if (f === i || f === n || !s(f, n)) continue;
      const o = [n, i, w, f];
      if ((a[n][2] + a[i][2] + a[w][2] + a[f][2]) / 4 < t) continue;
      const m = o.slice().sort((l, d) => l - d).join("-");
      e.has(m) || (e.add(m), u.push([n, i, w, f]));
    }
  }
  return u;
}
function k(a, c) {
  a.nodes.val = [], a.elements.val = [], a.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, a.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, a.objects3D.val = [], console.log("[CSI Importer] " + c);
}
const D = { id: "csi-importer", name: "Importar CSI (E2K/F2K/S2K)", category: "\u{1F9EA} Utilidades", defaultShellResult: "none", availableShellResults: [], params: { verColumnas: { default: 1, boolean: true, label: "Columnas", folder: "\u{1F441} Ver por tipo" }, verVigas: { default: 1, boolean: true, label: "Vigas", folder: "\u{1F441} Ver por tipo" }, verDiagonales: { default: 1, boolean: true, label: "Diagonales", folder: "\u{1F441} Ver por tipo" }, verAreas: { default: 1, boolean: true, label: "\xC1reas", folder: "\u{1F441} Ver por tipo" }, cubierta: { default: 0, boolean: true, label: "Poner cubierta (slab membrana)", folder: "\u{1F3E0} Cubierta" }, formaCubierta: { default: 2, label: "Formulaci\xF3n de la placa", options: { "Membrana (solo su plano)": 2, "Shell-Thin (Kirchhoff)": 1, "Shell-Thick (Mindlin)": 0 }, folder: "\u{1F3E0} Cubierta" }, tCubierta: { default: 60, min: 20, max: 300, step: 5, label: "Espesor cubierta (mm)", folder: "\u{1F3E0} Cubierta" } }, computedLabels(a, c) {
  var _a, _b, _c;
  const t = window.__hekatanImportedModel;
  if (!t) return { Archivo: "ninguno \u2014 usa \u{1F4E5} Importar" };
  const g = /* @__PURE__ */ new Map();
  (_a = t.secciones) == null ? void 0 : _a.forEach((r) => g.set(r, (g.get(r) ?? 0) + 1));
  const b = [...g.entries()].sort((r, s) => s[1] - r[1]).slice(0, 6), p = { Archivo: `${t.archivo} (${t.fuente})`, Nudos: String(t.nodes.length), Elementos: String(t.elements.length), Apoyos: String(((_b = t.supports) == null ? void 0 : _b.length) ?? 0), Cargas: String(((_c = t.loads) == null ? void 0 : _c.length) ?? 0), Plantas: String(new Set(t.plantas ?? []).size) };
  return b.forEach(([r, s]) => {
    p[`  ${r}`] = `${s}`;
  }), p;
}, build(a, c) {
  var _a, _b, _c;
  const t = window.__hekatanImportedModel, g = window.__hekatanImportedCim;
  if (!t) return ((_a = g == null ? void 0 : g.zapatas) == null ? void 0 : _a.length) ? j(g, c) : k(c, "Sin archivo. Usa el folder '\u{1F4E5} Importar archivo'.");
  const b = (o) => o === "COLUMN" && a.verColumnas || o === "BEAM" && a.verVigas || o === "BRACE" && a.verDiagonales || o === "AREA" && a.verAreas || !["COLUMN", "BEAM", "BRACE", "AREA"].includes(o), p = t.nodes, r = [], s = [];
  t.elements.forEach((o, h) => {
    var _a2;
    const m = ((_a2 = t.tipos) == null ? void 0 : _a2[h]) ?? (o.length === 4 ? "AREA" : "BEAM");
    b(m) && (r.push(o), s.push(h));
  });
  const e = {};
  for (const [o, h] of Object.entries(t.elementInputs ?? {})) {
    const m = new Map(h), l = /* @__PURE__ */ new Map();
    s.forEach((d, M) => {
      const v = m.get(d);
      v !== void 0 && l.set(M, v);
    }), e[o] = l;
  }
  for (const o of ["elasticities", "shearModuli", "areas", "momentsOfInertiaY", "momentsOfInertiaZ", "torsionalConstants", "densities", "poissonsRatios"]) e[o] || (e[o] = /* @__PURE__ */ new Map());
  let u = [];
  if (a.cubierta && r.length < 3e3) {
    const o = p.map((A) => A[2]), h = Math.min(...o) + 0.5 * (Math.max(...o) - Math.min(...o));
    u = L(p, r, h);
    const m = 2146e4, l = 0.2, d = m / (2 * (1 + l)), M = 2.4, v = (a.tCubierta ?? 60) / 1e3;
    for (const A of u) {
      const C = r.length;
      r.push(A), e.elasticities.set(C, m), e.shearModuli.set(C, d), e.poissonsRatios.set(C, l), e.densities.set(C, M), (e.thicknesses ?? (e.thicknesses = /* @__PURE__ */ new Map())).set(C, v), (e.plateFormulations ?? (e.plateFormulations = /* @__PURE__ */ new Map())).set(C, a.formaCubierta ?? 2);
    }
  }
  c.nodes.val = p, c.elements.val = r, c.nodeInputs.val = { supports: new Map(t.supports ?? []), loads: new Map(t.loads ?? []) }, c.elementInputs.val = e;
  const n = [];
  if (u.length) {
    const o = [];
    for (const m of u) {
      const [l, d, M, v] = m.map((A) => p[A]);
      o.push(l[0], l[1], l[2], d[0], d[1], d[2], M[0], M[1], M[2]), o.push(l[0], l[1], l[2], M[0], M[1], M[2], v[0], v[1], v[2]);
    }
    const h = new S();
    h.setAttribute("position", new B(o, 3)), h.computeVertexNormals(), n.push(new E(h, new y({ color: z.AREA, transparent: true, opacity: 0.5, side: O })));
  }
  const i = /* @__PURE__ */ new Map();
  r.forEach((o, h) => {
    var _a2;
    const m = ((_a2 = t.tipos) == null ? void 0 : _a2[s[h]]) ?? (o.length === 4 ? "AREA" : "BEAM");
    if (o.length !== 2) return;
    const l = p[o[0]], d = p[o[1]];
    if (!l || !d) return;
    const M = i.get(m) ?? [];
    M.push(new I(l[0], l[1], l[2]), new I(d[0], d[1], d[2])), i.set(m, M);
  });
  for (const [o, h] of i) h.length && n.push(new $(new S().setFromPoints(h), new R({ color: z[o] ?? 9741240 })));
  c.objects3D.val = n;
  const w = new Set(t.secciones ?? []), f = ["Shell-Thick", "Shell-Thin", "Membrana"][a.formaCubierta ?? 2] ?? "Membrana";
  console.log(`[CSI Importer] ${t.archivo} (${t.fuente}): ${p.length} nudos, ${r.length}/${t.elements.length} elementos, ${w.size} secciones, ${((_b = t.supports) == null ? void 0 : _b.length) ?? 0} apoyos, ${((_c = t.loads) == null ? void 0 : _c.length) ?? 0} cargas` + (u.length ? `, cubierta: ${u.length} pa\xF1os (${f})` : "") + `. Secciones: ${[...w].join(", ")}`);
} };
function j(a, c) {
  var _a;
  const t = [], g = [], b = [];
  let p = 0;
  const r = a.Z ?? 0;
  for (const s of a.zapatas) {
    const e = s.Lz / 2, u = s.Bz / 2;
    t.push([s.xC - e, s.yC - u, r]);
    const n = p++;
    t.push([s.xC + e, s.yC - u, r]);
    const i = p++;
    t.push([s.xC + e, s.yC + u, r]);
    const w = p++;
    t.push([s.xC - e, s.yC + u, r]);
    const f = p++;
    g.push([n, i, w, f]);
    const o = new E(new x(s.bc, s.bc, 0.5), new y({ color: 8421504 }));
    o.position.set(s.xCol, s.yCol, r + 0.25), b.push(o);
  }
  if (a.vigasAmarre) {
    const s = [];
    for (const e of a.vigasAmarre) {
      const u = e.z ?? r, n = e.x2 - e.x1, i = e.y2 - e.y1, w = Math.hypot(n, i);
      if (w < 1e-6) continue;
      s.push(new I(e.x1, e.y1, u)), s.push(new I(e.x2, e.y2, u));
      const f = new E(new x(e.b, w, e.h), new y({ color: 2282478, transparent: true, opacity: 0.35 }));
      f.position.set((e.x1 + e.x2) / 2, (e.y1 + e.y2) / 2, u), f.rotateZ(Math.atan2(i, n) - Math.PI / 2), b.push(f);
    }
    s.length && b.push(new $(new S().setFromPoints(s), new R({ color: 2282478, linewidth: 3 })));
  }
  c.nodes.val = t, c.elements.val = g, c.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, c.elementInputs.val = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, c.objects3D.val = b, console.log(`[CSI Importer] f2k: ${a.zapatas.length} zapatas + ${((_a = a.vigasAmarre) == null ? void 0 : _a.length) ?? 0} vigas de amarre.`);
}
export {
  D as c
};
