function C() {
  return { nodes: /* @__PURE__ */ new Map(), lines: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), solids: /* @__PURE__ */ new Map() };
}
function j() {
  return { model: C(), tool: "select", snap: 0.5, workPlane: "xy", workZ: 0, pendingNodes: [], nextNodeId: 1, nextLineId: 1, nextAreaId: 1, nextSolidId: 1 };
}
let t = j();
function A() {
  return t;
}
function b() {
  t = j(), I();
}
function I() {
  const e = ["# CAD Drawer \u2014 modelo dibujado con mouse", "# (estos comandos se generan automaticamente cuando dibujas con CAD)", ""];
  t.model.nodes.size > 0 && e.push("# Nodos");
  for (const n of t.model.nodes.values()) e.push(`node ${n.id}  ${n.pos[0]}  ${n.pos[1]}  ${n.pos[2]}`);
  t.model.nodes.size > 0 && e.push(""), t.model.lines.size > 0 && e.push("# Frames");
  for (const n of t.model.lines.values()) n.kind !== "edge" && e.push(`frame ${n.id}  ${n.nI} ${n.nJ}  25e6  0.16  0.0021`);
  t.model.lines.size > 0 && e.push(""), t.model.areas.size > 0 && e.push("# Shells");
  for (const n of t.model.areas.values()) n.pts.length < 3 || (n.pts.length === 4 ? e.push(`shell ${n.id}  ${n.pts.join(" ")}  0.20  25e6`) : e.push(`# shell ${n.id} (3 nodos \u2014 triangle, FEM no soportado, solo visual)`));
  t.model.areas.size > 0 && e.push(""), window.__hekatanCliScript = e.join(`
`);
}
function D(e) {
  const n = t.nextNodeId++, s = { id: n, pos: e };
  return t.model.nodes.set(n, s), I(), s;
}
function _(e, n, s = "frame") {
  const i = t.nextLineId++, c = { id: i, nI: e, nJ: n, kind: s };
  return t.model.lines.set(i, c), I(), c;
}
function v(e, n = "shell") {
  const s = t.nextAreaId++, i = { id: s, pts: e, kind: n };
  return t.model.areas.set(s, i), I(), i;
}
function x() {
  const e = /* @__PURE__ */ new Map();
  for (const o of t.model.lines.values()) e.has(o.nI) || e.set(o.nI, /* @__PURE__ */ new Set()), e.has(o.nJ) || e.set(o.nJ, /* @__PURE__ */ new Set()), e.get(o.nI).add(o.nJ), e.get(o.nJ).add(o.nI);
  const n = (o, a) => {
    var _a;
    return !!((_a = e.get(o)) == null ? void 0 : _a.has(a));
  }, s = [...e.keys()], i = /* @__PURE__ */ new Set(), c = [];
  for (const o of s) for (const a of e.get(o)) if (!(a < o)) {
    for (const l of e.get(a)) if (l !== o) for (const d of e.get(l)) {
      if (d === o || d === a || !n(d, o) || n(o, l) || n(a, d)) continue;
      const m = [o, a, l, d].slice().sort((h, w) => h - w).join("-");
      i.has(m) || (i.add(m), c.push([o, a, l, d]));
    }
  }
  for (const o of s) for (const a of e.get(o)) if (!(a < o)) for (const l of e.get(a)) {
    if (l === o || !n(l, o)) continue;
    const d = [o, a, l].slice().sort((m, h) => m - h).join("-");
    i.has(d) || (i.add(d), c.push([o, a, l]));
  }
  return c;
}
const g = (e) => e.slice().sort((n, s) => n - s).join("-");
function S(e) {
  return t.workPlane === "xy" ? [e[0], e[1]] : t.workPlane === "xz" ? [e[0], e[2]] : [e[1], e[2]];
}
function N(e, n) {
  let s = false;
  for (let i = 0, c = n.length - 1; i < n.length; c = i++) {
    const o = n[i][0], a = n[i][1], l = n[c][0], d = n[c][1];
    a > e[1] != d > e[1] && e[0] < (l - o) * (e[1] - a) / (d - a) + o && (s = !s);
  }
  return s;
}
function P(e) {
  let n = 0;
  for (let s = 0, i = e.length - 1; s < e.length; i = s++) n += (e[i][0] + e[s][0]) * (e[i][1] - e[s][1]);
  return Math.abs(n) / 2;
}
function y() {
  const e = new Set([...t.model.areas.values()].map((s) => g(s.pts)));
  let n = 0;
  for (const s of x()) {
    const i = g(s);
    e.has(i) || (v(s, "shell"), e.add(i), n++);
  }
  return n;
}
function J(e) {
  const n = S(e);
  let s = null, i = 1 / 0;
  for (const o of x()) {
    const a = o.map((d) => S(t.model.nodes.get(d).pos));
    if (!N(n, a)) continue;
    const l = P(a);
    l < i && (i = l, s = o);
  }
  if (!s) return null;
  const c = g(s);
  return [...t.model.areas.values()].some((o) => g(o.pts) === c) ? null : v(s, "shell");
}
function Z(e) {
  t.tool = e, t.pendingNodes = [];
}
function T() {
  return { nodes: t.model.nodes.size, lines: t.model.lines.size, areas: t.model.areas.size, solids: t.model.solids.size, tool: t.tool, snap: t.snap, workPlane: t.workPlane, workZ: t.workZ, pending: t.pendingNodes.length };
}
window.__hekatanCadState = { get: A, reset: b, addNode: D, addLine: _, addArea: v, setTool: Z, getStats: T, detectClosedCells: x, fillClosedCells: y, fillCellAt: J };
const L = { id: "cad-draw", name: "CAD Drawer (mouse + Tweakpane)", category: "\u{1F9EA} Utilidades", defaultShellResult: "none", availableShellResults: [], params: {}, build(e, n) {
  const s = A(), i = Array.from(s.model.nodes.keys()).sort((f, u) => f - u), c = /* @__PURE__ */ new Map(), o = [];
  for (const f of i) {
    c.set(f, o.length);
    const u = s.model.nodes.get(f);
    o.push(u.pos);
  }
  const a = [], l = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
  for (const f of s.model.lines.values()) {
    const u = c.get(f.nI), p = c.get(f.nJ);
    if (u === void 0 || p === void 0) continue;
    const r = a.length;
    a.push([u, p]), l.set(r, 25e6), d.set(r, 25e6 / (2 * 1.2)), m.set(r, 0.16), h.set(r, 21e-4), w.set(r, 21e-4), $.set(r, 14e-4), k.set(r, 2.45), M.set(r, 0.2);
  }
  for (const f of s.model.areas.values()) {
    if (f.pts.length !== 4) continue;
    const u = f.pts.map((r) => c.get(r));
    if (u.some((r) => r === void 0)) continue;
    const p = a.length;
    a.push(u), l.set(p, 25e6), d.set(p, 25e6 / (2 * 1.2)), z.set(p, 0.2), k.set(p, 2.45), M.set(p, 0.2);
  }
  n.nodes.val = o, n.elements.val = a, n.nodeInputs.val = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() }, n.elementInputs.val = { elasticities: l, shearModuli: d, areas: m, momentsOfInertiaY: h, momentsOfInertiaZ: w, torsionalConstants: $, densities: k, poissonsRatios: M, thicknesses: z }, n.objects3D.val = [], console.log(`[CAD Draw] tool=${s.tool} | snap=${s.snap}m | plane=${s.workPlane}@z=${s.workZ}m | nodes=${s.model.nodes.size} lines=${s.model.lines.size} areas=${s.model.areas.size}`);
} };
export {
  L as c
};
