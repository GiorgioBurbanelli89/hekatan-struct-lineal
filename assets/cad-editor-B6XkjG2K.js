import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as y, V as b, O as q, K, N as Q, U as ee, W as oe, X as ne, Y as se, Z as ie, _ as G, $ as k, a0 as te, B as F, b as z, d as N, S as ae, f as re, M as le, F as de, L as ce, P as pe } from "./theme-DQ--CgsI.js";
import { O as me, T as M } from "./Text-ERv22veQ.js";
import { P as fe } from "./tweakpane-BXg6ZhiP.js";
const he = { x: { label: "X", axes: [] }, y: { label: "Y", axes: [] }, stories: [] };
function ue() {
  return { grid: y.state(he), nodes: y.state([]), frames: y.state([]), areas: y.state([]), viewMode: y.state("3d"), activeStory: y.state(""), activeAxis: y.state(""), sectionPosition: y.state(0), showGrid: y.state(true), showLabels: y.state(true), showNodes: y.state(true), showFrames: y.state(true), showAreas: y.state(true) };
}
let W = 0, J = 0;
function ge(e, l, a, o) {
  const n = { ...e.grid.val }, d = l === "X" ? a.map((c, t) => (o == null ? void 0 : o[t]) ?? String(t + 1)) : a.map((c, t) => (o == null ? void 0 : o[t]) ?? String.fromCharCode(65 + t)), f = a.map((c, t) => ({ name: d[t], position: c }));
  l === "X" ? n.x = { label: "X", axes: f } : n.y = { label: "Y", axes: f }, e.grid.val = n;
}
function ve(e, l, a) {
  const o = { ...e.grid.val };
  o.stories = [...o.stories, { name: l, elevation: a }].sort((n, d) => n.elevation - d.elevation), e.grid.val = o;
}
function xe(e, l) {
  const a = [], o = l ? e.stories.filter((n) => n.name === l) : e.stories;
  for (const n of o) for (const d of e.x.axes) for (const f of e.y.axes) a.push([d.position, f.position, n.elevation]);
  return a;
}
function w(e, l, a, o) {
  const n = W++;
  return e.nodes.val = [...e.nodes.val, { id: n, position: [l, a, o] }], n;
}
function we(e, l, a, o) {
  const n = e.grid.val, d = n.x.axes.find((t) => t.name === l), f = n.y.axes.find((t) => t.name === a), c = n.stories.find((t) => t.name === o);
  return !d || !f || !c ? (console.error(`Grid ref not found: X=${l}, Y=${a}, Story=${o}`), -1) : w(e, d.position, f.position, c.elevation);
}
function be(e, l) {
  return xe(e.grid.val, l).map(([o, n, d]) => w(e, o, n, d));
}
function ye(e, l) {
  e.nodes.val = e.nodes.val.filter((a) => a.id !== l), e.frames.val = e.frames.val.filter((a) => a.nodeI !== l && a.nodeJ !== l);
}
function x(e, l, a) {
  const o = J++;
  return e.frames.val = [...e.frames.val, { id: o, nodeI: l, nodeJ: a }], o;
}
function $e(e, l) {
  e.frames.val = e.frames.val.filter((a) => a.id !== l);
}
function Ae(e, l) {
  const a = e.grid.val, o = a.stories.findIndex((c) => c.name === l);
  if (o <= 0) return console.error(`Cannot add columns: story "${l}" not found or is the base level`), [];
  const n = a.stories[o - 1], d = a.stories[o], f = [];
  for (const c of a.x.axes) for (const t of a.y.axes) {
    const s = H(e, c.position, t.position, n.elevation), i = H(e, c.position, t.position, d.elevation);
    f.push(x(e, s, i));
  }
  return f;
}
function H(e, l, a, o) {
  const d = e.nodes.val.find((f) => Math.abs(f.position[0] - l) < 1e-6 && Math.abs(f.position[1] - a) < 1e-6 && Math.abs(f.position[2] - o) < 1e-6);
  return d ? d.id : w(e, l, a, o);
}
function Se(e) {
  e.grid.val = { x: { label: "X", axes: [] }, y: { label: "Y", axes: [] }, stories: [] }, e.nodes.val = [], e.frames.val = [], e.areas.val = [], W = 0, J = 0;
}
function Me() {
  q.DEFAULT_UP = new b(0, 0, 1);
  const e = document.createElement("div");
  e.id = "cad-viewport";
  const l = new K();
  l.background = new Q(855309);
  const a = new ee(45, 1, 0.1, 2e6);
  a.position.set(15, -20, 12);
  const o = new oe(-10, 10, 10, -10, 0.1, 2e6);
  o.position.set(15, -20, 12);
  const n = new ne({ antialias: true });
  n.setPixelRatio(window.devicePixelRatio), n.setClearColor(855309, 1), n.localClippingEnabled = true, e.appendChild(n.domElement);
  const d = new me(a, n.domElement);
  d.target.set(5, 5, 0), d.minDistance = 0.5, d.maxDistance = 500, d.zoomSpeed = 5, d.enableDamping = false, d.update();
  const f = new se(16777215, 0.6), c = new ie(16777215, 0.4);
  c.position.set(30, -20, 40), l.add(f, c);
  const t = new G(), s = 1, i = new k(new b(1, 0, 0), new b(0, 0, 0), s, 6710886, 0.2, 0.2), p = new k(new b(0, 1, 0), new b(0, 0, 0), s, 6710886, 0.2, 0.2), r = new k(new b(0, 0, 1), new b(0, 0, 0), s, 6710886, 0.2, 0.2), m = new M("X", "red", "transparent"), v = new M("Y", "green", "transparent"), u = new M("Z", "blue", "transparent");
  m.position.set(1.3 * s, 0, 0), v.position.set(0, 1.3 * s, 0), u.position.set(0, 0, 1.3 * s), m.updateScale(0.4 * s), v.updateScale(0.4 * s), u.updateScale(0.4 * s), i.scale.set(s, s, s), p.scale.set(s, s, s), r.scale.set(s, s, s), t.add(i, p, r, m, v, u), l.add(t);
  const h = new te(100, 100, 3355443, 2236962);
  h.rotation.x = Math.PI / 2, h.position.set(50, 50, 0), l.add(h);
  let g = a;
  function C() {
    n.render(l, g);
  }
  new ResizeObserver(($) => {
    for (const A of $) {
      const S = A.target.clientWidth, X = A.target.clientHeight;
      if (S === 0 || X === 0) continue;
      a.aspect = S / X, a.updateProjectionMatrix();
      const I = S / X, Z = o.top;
      o.left = -Z * I, o.right = Z * I, o.updateProjectionMatrix(), n.setSize(S, X), C();
    }
  }).observe(e), d.addEventListener("change", C), requestAnimationFrame(() => {
    const $ = e.clientWidth, A = e.clientHeight;
    if ($ > 0 && A > 0) {
      a.aspect = $ / A, a.updateProjectionMatrix();
      const S = $ / A;
      o.left = -10 * S, o.right = 10 * S, o.updateProjectionMatrix(), n.setSize($, A), C();
    }
  });
  const E = { scene: l, perspCamera: a, orthoCamera: o, controls: d, renderer: n, render: C };
  return E.setActiveCamera = ($) => {
    g = $, d.object = $, d.update(), C();
  }, E.getActiveCamera = () => g, { element: e, ctx: E };
}
function V(e, l, a) {
  const o = e.perspCamera;
  o.position.set(l.x + a * 0.5, l.y - a * 0.8, l.z + a * 0.5), e.controls.target.copy(l), e.setActiveCamera(o);
}
function Ce(e, l, a) {
  const o = e.orthoCamera, n = a * 0.6, d = e.renderer.domElement.clientWidth / (e.renderer.domElement.clientHeight || 1);
  o.left = -n * d, o.right = n * d, o.top = n, o.bottom = -n, o.near = -1e3, o.far = 1e3, o.updateProjectionMatrix(), o.position.set(l.x, l.y, l.z + a), o.up.set(0, 1, 0), e.controls.target.copy(l), e.setActiveCamera(o);
}
function Ge(e, l, a) {
  const o = e.orthoCamera, n = a * 0.6, d = e.renderer.domElement.clientWidth / (e.renderer.domElement.clientHeight || 1);
  o.left = -n * d, o.right = n * d, o.top = n, o.bottom = -n, o.near = -1e3, o.far = 1e3, o.updateProjectionMatrix(), o.position.set(l.x + a, l.y, l.z), o.up.set(0, 0, 1), e.controls.target.copy(l), e.setActiveCamera(o);
}
function Xe(e, l, a) {
  const o = e.orthoCamera, n = a * 0.6, d = e.renderer.domElement.clientWidth / (e.renderer.domElement.clientHeight || 1);
  o.left = -n * d, o.right = n * d, o.top = n, o.bottom = -n, o.near = -1e3, o.far = 1e3, o.updateProjectionMatrix(), o.position.set(l.x, l.y - a, l.z), o.up.set(0, 0, 1), e.controls.target.copy(l), e.setActiveCamera(o);
}
function D(e) {
  const l = e.x.axes.map((m) => m.position), a = e.y.axes.map((m) => m.position), o = e.stories.map((m) => m.elevation);
  if (!l.length || !a.length || !o.length) return { minX: 0, maxX: 10, minY: 0, maxY: 10, minZ: 0, maxZ: 5, centerX: 5, centerY: 5, centerZ: 2.5, sizeX: 10, sizeY: 10, sizeZ: 5, maxDim: 10 };
  const n = Math.min(...l), d = Math.max(...l), f = Math.min(...a), c = Math.max(...a), t = Math.min(...o), s = Math.max(...o), i = d - n || 1, p = c - f || 1, r = s - t || 1;
  return { minX: n, maxX: d, minY: f, maxY: c, minZ: t, maxZ: s, centerX: (n + d) / 2, centerY: (f + c) / 2, centerZ: (t + s) / 2, sizeX: i, sizeY: p, sizeZ: r, maxDim: Math.max(i, p, r) };
}
function Fe(e) {
  const l = {};
  for (const a of e.stories) l[a.name] = a.name;
  return l;
}
function T(e, l) {
  const a = {}, o = l === "X" ? e.x.axes : e.y.axes;
  for (const n of o) a[n.name] = n.name;
  return a;
}
function ze(e, l) {
  const a = new G();
  a.name = "cad-grid";
  const o = new G();
  o.name = "cad-labels", l.scene.add(a), l.scene.add(o), y.derive(() => {
    var _a, _b;
    const n = e.grid.val, d = e.showGrid.val, f = e.showLabels.val;
    if (R(a), R(o), a.visible = d, o.visible = f, !d && !f) {
      l.render();
      return;
    }
    const c = D(n), t = 1.5, s = 1;
    for (const i of n.stories) {
      const p = i.elevation;
      for (const r of n.x.axes) {
        const m = r.position, v = new F().setFromPoints([new b(m, c.minY - t, p), new b(m, c.maxY + t, p)]), u = new z({ color: 4473924, transparent: true, opacity: 0.6 });
        a.add(new N(v, u));
      }
      for (const r of n.y.axes) {
        const m = r.position, v = new F().setFromPoints([new b(c.minX - t, m, p), new b(c.maxX + t, m, p)]), u = new z({ color: 4473924, transparent: true, opacity: 0.6 });
        a.add(new N(v, u));
      }
    }
    if (n.stories.length > 1) {
      const i = Math.min(...n.stories.map((r) => r.elevation)), p = Math.max(...n.stories.map((r) => r.elevation));
      for (const r of n.x.axes) for (const m of n.y.axes) {
        const v = new F().setFromPoints([new b(r.position, m.position, i), new b(r.position, m.position, p)]), u = new z({ color: 3355443, transparent: true, opacity: 0.3 });
        a.add(new N(v, u));
      }
    }
    for (const i of n.x.axes) {
      const p = new M(i.name, "#ff6644", "transparent");
      p.position.set(i.position, c.minY - t - s, ((_a = n.stories[0]) == null ? void 0 : _a.elevation) ?? 0), p.updateScale(0.8), o.add(p);
    }
    for (const i of n.y.axes) {
      const p = new M(i.name, "#4488ff", "transparent");
      p.position.set(c.minX - t - s, i.position, ((_b = n.stories[0]) == null ? void 0 : _b.elevation) ?? 0), p.updateScale(0.8), o.add(p);
    }
    for (const i of n.stories) {
      const p = new M(i.name, "#44ff88", "transparent");
      p.position.set(c.minX - t - s, c.minY - t - s, i.elevation), p.updateScale(0.6), o.add(p);
    }
    l.render();
  }), y.derive(() => {
    const n = e.nodes.val, d = e.frames.val, f = e.showNodes.val, c = e.showFrames.val, t = l.scene.getObjectByName("cad-nodes"), s = l.scene.getObjectByName("cad-frames");
    if (t && (l.scene.remove(t), Y(t)), s && (l.scene.remove(s), Y(s)), f && n.length > 0) {
      const i = new G();
      i.name = "cad-nodes";
      const p = new ae(0.15, 8, 8), r = new re({ color: 16746496 });
      for (const m of n) {
        const v = new le(p, r);
        v.position.set(...m.position), i.add(v);
      }
      l.scene.add(i);
    }
    if (c && d.length > 0) {
      const i = new G();
      i.name = "cad-frames";
      const p = [];
      for (const r of d) {
        const m = n.find((u) => u.id === r.nodeI), v = n.find((u) => u.id === r.nodeJ);
        m && v && p.push(...m.position, ...v.position);
      }
      if (p.length > 0) {
        const r = new F();
        r.setAttribute("position", new de(p, 3));
        const m = new z({ color: 52479, linewidth: 2 });
        i.add(new ce(r, m));
      }
      l.scene.add(i);
    }
    l.render();
  });
}
function R(e) {
  for (; e.children.length > 0; ) {
    const l = e.children[0];
    e.remove(l), Y(l);
  }
}
function Y(e) {
  var _a;
  if (e.geometry && e.geometry.dispose(), e.material) {
    const l = e.material;
    l.map && l.map.dispose(), l.dispose();
  }
  e.dispose && e.dispose(), (_a = e.children) == null ? void 0 : _a.forEach(Y);
}
function Pe(e, l) {
  const a = document.createElement("div");
  a.id = "cad-panel";
  const o = { viewMode: "3d", selector: "", sectionPos: 0, showGrid: true, showLabels: true, showNodes: true, showFrames: true, showAreas: true }, n = new fe({ title: "FEM Studio", container: a, expanded: true });
  let d = n.addFolder({ title: "Vistas" });
  function f() {
    d.dispose(), d = n.addFolder({ title: "Vistas", index: 0 }), d.addBinding(o, "viewMode", { label: "Vista", options: { "3D": "3d", Planta: "plan", "Elev X": "elevationX", "Elev Y": "elevationY", Corte: "section" } });
    const p = e.grid.val, r = o.viewMode;
    let m = {}, v = "Nivel/Eje", u = false;
    switch (r) {
      case "plan":
        m = Fe(p), v = "Nivel";
        break;
      case "elevationX":
        m = T(p, "Y"), v = "Eje Y";
        break;
      case "elevationY":
        m = T(p, "X"), v = "Eje X";
        break;
      case "section":
        m = { X: "X", Y: "Y" }, v = "Direccion", u = true;
        break;
      default:
        m = { "(ninguno)": "" }, v = "Nivel/Eje";
        break;
    }
    const h = Object.keys(m);
    if (h.length > 0 && !Object.values(m).includes(o.selector) && (o.selector = m[h[0]]), d.addBinding(o, "selector", { label: v, options: h.length > 0 ? m : { "(ninguno)": "" } }), u) {
      const g = D(p);
      d.addBinding(o, "sectionPos", { label: "Posicion", min: Math.min(g.minX, g.minY) - 2, max: Math.max(g.maxX, g.maxY) + 2, step: 0.5 });
    }
  }
  f();
  const c = n.addFolder({ title: "Grid" });
  c.addBinding(o, "showGrid", { label: "Mostrar grid" }), c.addBinding(o, "showLabels", { label: "Mostrar labels" });
  const t = n.addFolder({ title: "Modelo" });
  t.addBinding(o, "showNodes", { label: "Nodos" }), t.addBinding(o, "showFrames", { label: "Frames" }), t.addBinding(o, "showAreas", { label: "Areas" }), n.on("change", (p) => {
    var _a;
    const r = (_a = p.target) == null ? void 0 : _a.key;
    if (r) switch (r) {
      case "viewMode":
        e.viewMode.val = o.viewMode, f(), s();
        break;
      case "selector":
        o.viewMode === "plan" ? e.activeStory.val = o.selector : e.activeAxis.val = o.selector, s();
        break;
      case "sectionPos":
        e.sectionPosition.val = o.sectionPos, i();
        break;
      case "showGrid":
        e.showGrid.val = o.showGrid;
        break;
      case "showLabels":
        e.showLabels.val = o.showLabels;
        break;
      case "showNodes":
        e.showNodes.val = o.showNodes;
        break;
      case "showFrames":
        e.showFrames.val = o.showFrames;
        break;
      case "showAreas":
        e.showAreas.val = o.showAreas;
        break;
    }
  });
  function s() {
    var _a, _b, _c;
    const p = e.grid.val, r = D(p), m = new b(r.centerX, r.centerY, r.centerZ), v = r.maxDim;
    switch (l.renderer.clippingPlanes = [], o.viewMode) {
      case "3d":
        V(l, m, v);
        break;
      case "plan": {
        const h = ((_a = p.stories.find((g) => g.name === o.selector)) == null ? void 0 : _a.elevation) ?? r.centerZ;
        Ce(l, new b(r.centerX, r.centerY, h), v);
        break;
      }
      case "elevationX": {
        const h = ((_b = p.y.axes.find((g) => g.name === o.selector)) == null ? void 0 : _b.position) ?? r.centerY;
        Ge(l, new b(r.centerX, h, r.centerZ), v);
        break;
      }
      case "elevationY": {
        const h = ((_c = p.x.axes.find((g) => g.name === o.selector)) == null ? void 0 : _c.position) ?? r.centerX;
        Xe(l, new b(h, r.centerY, r.centerZ), v);
        break;
      }
      case "section":
        i(), V(l, m, v);
        break;
    }
  }
  function i() {
    if (o.viewMode !== "section") {
      l.renderer.clippingPlanes = [];
      return;
    }
    const p = o.sectionPos, r = o.selector === "X" ? new b(-1, 0, 0) : new b(0, -1, 0);
    l.renderer.clippingPlanes = [new pe(r, p)], l.render();
  }
  return a.applyView = (p, r) => {
    o.viewMode = p, e.viewMode.val = p, r && (o.selector = r, p === "plan" ? e.activeStory.val = r : e.activeAxis.val = r), f(), s();
  }, a;
}
function Ye(e, l) {
  const a = { addGrid(o, n, d) {
    return ge(e, o, n, d), console.log(`Grid ${o}: ${n.length} axes at [${n.join(", ")}]`), e.grid.val;
  }, addStory(o, n) {
    return ve(e, o, n), console.log(`Story "${o}" at z=${n}`), e.grid.val.stories;
  }, getGrid() {
    const o = e.grid.val;
    return console.log("Grid X:", o.x.axes.map((n) => `${n.name}@${n.position}`).join(", ")), console.log("Grid Y:", o.y.axes.map((n) => `${n.name}@${n.position}`).join(", ")), console.log("Stories:", o.stories.map((n) => `${n.name}@${n.elevation}`).join(", ")), o;
  }, addNode(o, n, d) {
    const f = w(e, o, n, d);
    return console.log(`Node ${f} at (${o}, ${n}, ${d})`), f;
  }, addNodeAtGrid(o, n, d) {
    const f = we(e, o, n, d);
    return console.log(`Node ${f} at grid ${o}-${n}-${d}`), f;
  }, addNodesAtGrid(o) {
    const n = be(e, o);
    return console.log(`${n.length} nodes added at all grid intersections of "${o}"`), n;
  }, removeNode(o) {
    ye(e, o), console.log(`Node ${o} removed`);
  }, listNodes() {
    const o = e.nodes.val;
    return console.table(o.map((n) => ({ id: n.id, x: n.position[0], y: n.position[1], z: n.position[2] }))), o;
  }, addFrame(o, n) {
    const d = x(e, o, n);
    return console.log(`Frame ${d}: node ${o} -> node ${n}`), d;
  }, removeFrame(o) {
    $e(e, o), console.log(`Frame ${o} removed`);
  }, addColumnsAtLevel(o) {
    const n = Ae(e, o);
    return console.log(`${n.length} columns added at "${o}"`), n;
  }, listFrames() {
    const o = e.frames.val;
    return console.table(o.map((n) => ({ id: n.id, nodeI: n.nodeI, nodeJ: n.nodeJ }))), o;
  }, view(o, n) {
    const f = { elevX: "elevationX", elevx: "elevationX", elevY: "elevationY", elevy: "elevationY", planta: "plan", corte: "section" }[o] || o, c = l.applyView;
    c ? (c(f, n), console.log(`View: ${f}${n ? ` (${n})` : ""}`)) : console.error("View panel not initialized");
  }, clear() {
    Se(e), console.log("Model cleared");
  }, help() {
    console.log(`
=== Awatif FEM Studio CLI ===

Grid:
  cad.addGrid('X', [0, 4, 8, 12])     Add X axes (auto-names: 1,2,3,4)
  cad.addGrid('Y', [0, 5, 10])        Add Y axes (auto-names: A,B,C)
  cad.addStory('Base', 0)             Add story level
  cad.getGrid()                        Show grid state

Nodes:
  cad.addNode(x, y, z)                Add node, returns id
  cad.addNodeAtGrid('A','1','Base')   Add node at grid intersection
  cad.addNodesAtGrid('Story 1')       Add nodes at all intersections
  cad.removeNode(id)                  Remove node
  cad.listNodes()                     List all nodes

Frames:
  cad.addFrame(n1, n2)                Add frame between nodes
  cad.removeFrame(id)                 Remove frame
  cad.addColumnsAtLevel('Story 1')    Add columns at all grid points
  cad.listFrames()                    List all frames

Frame 2D (portico plano):
  cad.frame([2.93,4.72,3.20], [3.45,3.07])           Portico irregular
  cad.frame([5,5,5], [3,3,3])                         Portico regular 3x3
  cad.frame([4,6], [3.5,3], 1.5, 2)                   Con volados

Building 3D (edificio):
  cad.building([2.93,4.72,3.20], [3,4.5], [3.45,3.07])  Edificio irregular
  cad.building([5,5], [4,4], [3,3,3])                     Edificio regular

Views:
  cad.view('3d')                      3D perspective
  cad.view('plan', 'Base')            Plan view of story
  cad.view('elevX', 'A')              Elevation looking along X (sees Y-Z)
  cad.view('elevY', '1')              Elevation looking along Y (sees X-Z)

Examples:
  cad.example()                       List available examples
  cad.example('truss')               2D Truss
  cad.example('building')            3-story building
  cad.example('3d')                  3D space frame
  cad.example('portico')             Portico irregular 2D (Matlab)
  cad.example('edificio')            Edificio irregular 3D

Utility:
  cad.clear()                         Clear model
  cad.help()                          Show this help
      `);
  }, frame(o, n, d = 0, f = 0) {
    a.clear();
    const c = [];
    d > 0 && c.push(-d);
    let t = 0;
    c.push(t);
    for (const h of o) t += h, c.push(t);
    f > 0 && c.push(t + f);
    const s = [0];
    let i = 0;
    for (const h of n) i += h, s.push(i);
    const p = (h) => d > 0 && h === 0 || f > 0 && h === c.length - 1, r = {};
    for (let h = 0; h < s.length; h++) for (let g = 0; g < c.length; g++) h === 0 && p(g) || (r[`${g},${h}`] = w(e, c[g], 0, s[h]));
    let m = 0;
    for (let h = 0; h < s.length - 1; h++) for (let g = 0; g < c.length; g++) p(g) || (x(e, r[`${g},${h}`], r[`${g},${h + 1}`]), m++);
    let v = 0;
    for (let h = 1; h < s.length; h++) for (let g = 0; g < c.length - 1; g++) x(e, r[`${g},${h}`], r[`${g + 1},${h}`]), v++;
    const u = Object.keys(r).length;
    return console.log(`Frame generado: ${o.length} vanos, ${n.length} pisos` + (d > 0 ? `, volado izq=${d}` : "") + (f > 0 ? `, volado der=${f}` : "")), console.log(`  ${u} nodos, ${m} columnas, ${v} vigas`), console.log(`  X: [${c.map((h) => h.toFixed(2)).join(", ")}]`), console.log(`  Z: [${s.map((h) => h.toFixed(2)).join(", ")}]`), { nodes: u, columns: m, beams: v, xCoords: c, zCoords: s };
  }, building(o, n, d) {
    a.clear();
    const f = [0];
    for (const u of o) f.push(f[f.length - 1] + u);
    const c = [0];
    for (const u of n) c.push(c[c.length - 1] + u);
    const t = [0];
    for (const u of d) t.push(t[t.length - 1] + u);
    const s = {};
    for (let u = 0; u < t.length; u++) for (let h = 0; h < c.length; h++) for (let g = 0; g < f.length; g++) s[`${g},${h},${u}`] = w(e, f[g], c[h], t[u]);
    let i = 0;
    for (let u = 0; u < t.length - 1; u++) for (let h = 0; h < c.length; h++) for (let g = 0; g < f.length; g++) x(e, s[`${g},${h},${u}`], s[`${g},${h},${u + 1}`]), i++;
    let p = 0;
    for (let u = 1; u < t.length; u++) for (let h = 0; h < c.length; h++) for (let g = 0; g < f.length - 1; g++) x(e, s[`${g},${h},${u}`], s[`${g + 1},${h},${u}`]), p++;
    let r = 0;
    for (let u = 1; u < t.length; u++) for (let h = 0; h < f.length; h++) for (let g = 0; g < c.length - 1; g++) x(e, s[`${h},${g},${u}`], s[`${h},${g + 1},${u}`]), r++;
    const m = Object.keys(s).length, v = i + p + r;
    return console.log(`Edificio generado: ${o.length}\xD7${n.length} vanos, ${d.length} pisos`), console.log(`  ${m} nodos, ${i} columnas, ${p} vigas X, ${r} vigas Y (${v} total)`), console.log(`  X: [${f.map((u) => u.toFixed(2)).join(", ")}]`), console.log(`  Y: [${c.map((u) => u.toFixed(2)).join(", ")}]`), console.log(`  Z: [${t.map((u) => u.toFixed(2)).join(", ")}]`), { nodes: m, columns: i, beamsX: p, beamsY: r, xCoords: f, yCoords: c, zCoords: t };
  }, example(o) {
    if (!o) {
      console.log(`
Available examples (awatif):
  cad.example('truss')            Parametric truss (span=15, div=5, h=2)
  cad.example('beams')            Portal frame (L=10, H=10)
  cad.example('3d-structure')     3D tower with diagonals (dx=dy=dz=2, div=4)
  cad.example('advanced-truss')   Tapered truss (span=20, h=2.5)
  cad.example('curves')           Bezier curved grid (xSpan=16, h=9)
  cad.example('1d-mesh')          Triangular frame (span=10, h=10, mesh=7)
  cad.example('report')           Simple 2-bar truss
  cad.example('building')         3-story building (grid + beams)

Custom generators:
  cad.example('portico')          Portico irregular 2D
  cad.example('edificio')         Edificio irregular 3D
        `);
      return;
    }
    switch (a.clear(), o) {
      case "truss": {
        const t = [];
        for (let i = 0; i <= 5; i++) t.push(w(e, 3 * i, 0, 0));
        const s = [];
        for (let i = 0; i <= 5; i++) s.push(w(e, 3 * i, 0, 2));
        for (let i = 0; i < 5; i++) x(e, t[i], t[i + 1]);
        for (let i = 0; i < 5; i++) x(e, s[i], s[i + 1]);
        for (let i = 0; i <= 5; i++) x(e, t[i], s[i]);
        for (let i = 0; i < 5; i++) i < 2.5 ? x(e, t[i], s[i + 1]) : x(e, s[i], t[i + 1]);
        console.log("Loaded: Truss (span=15, divisions=5, height=2)"), console.log(`  ${e.nodes.val.length} nodes, ${e.frames.val.length} frames`);
        break;
      }
      case "beams": {
        const f = w(e, 0, 0, 0), c = w(e, 0, 0, 10), t = w(e, 10, 0, 10), s = w(e, 10, 0, 0);
        x(e, f, c), x(e, c, t), x(e, t, s), console.log("Loaded: Portal Frame (L=10, H=10) \u2014 4 nodes, 3 frames");
        break;
      }
      case "3d-structure":
      case "3d": {
        const t = [];
        for (let s = 0; s <= 4; s++) {
          const i = [];
          i.push(w(e, 6, 6, 2 * s)), i.push(w(e, 8, 6, 2 * s)), i.push(w(e, 8, 8, 2 * s)), i.push(w(e, 6, 8, 2 * s)), t.push(i);
        }
        for (let s = 1; s <= 4; s++) x(e, t[s][0], t[s][1]), x(e, t[s][1], t[s][2]), x(e, t[s][2], t[s][3]), x(e, t[s][3], t[s][0]), x(e, t[s][0], t[s][2]);
        for (let s = 0; s < 4; s++) for (let i = 0; i < 4; i++) x(e, t[s][i], t[s + 1][i]);
        for (let s = 0; s < 4; s++) x(e, t[s][0], t[s + 1][1]), x(e, t[s][3], t[s + 1][2]), x(e, t[s][0], t[s + 1][3]), x(e, t[s][1], t[s + 1][2]);
        console.log("Loaded: 3D Structure (dx=2, dy=2, dz=2, divisions=4)"), console.log(`  ${e.nodes.val.length} nodes, ${e.frames.val.length} frames`);
        break;
      }
      case "advanced-truss": {
        const t = 20 / Math.round(8), s = Math.round(20 / t), i = (2.5 - 2.5) / 20, p = [];
        for (let m = 0; m <= s; m++) p.push(w(e, t * m, 0, 0));
        const r = [];
        for (let m = 0; m <= s; m++) {
          const v = 2.5 - i * t * m;
          r.push(w(e, t * m, 0, v));
        }
        for (let m = 0; m < s; m++) x(e, p[m], p[m + 1]);
        for (let m = 0; m < s; m++) x(e, r[m], r[m + 1]);
        for (let m = 0; m <= s; m++) x(e, p[m], r[m]);
        for (let m = 0; m < s; m++) x(e, p[m], r[m + 1]);
        console.log(`Loaded: Advanced Truss (span=20, spacing=${t}, h=${2.5})`), console.log(`  ${e.nodes.val.length} nodes, ${e.frames.val.length} frames`);
        break;
      }
      case "curves": {
        const s = [];
        for (let p = 0; p <= 14; p++) {
          const r = p / 14, m = (1 - r) * (1 - r) * 0 + 2 * (1 - r) * r * (16 / 2) + r * r * 16, v = (1 - r) * (1 - r) * 0 + 2 * (1 - r) * r * 9 + r * r * 0;
          s.push([m, 0, v]);
        }
        const i = [];
        for (let p = 0; p <= 3; p++) {
          const r = [], m = p * 1.6666666666666667;
          for (const [v, , u] of s) r.push(w(e, v, m, u));
          i.push(r);
        }
        for (let p = 0; p <= 3; p++) for (let r = 0; r < 14; r++) x(e, i[p][r], i[p][r + 1]);
        for (let p = 0; p < 3; p++) for (let r = 0; r <= 14; r++) x(e, i[p][r], i[p + 1][r]);
        console.log("Loaded: Curved Grid (xSpan=16, ySpan=5, height=9)"), console.log(`  ${e.nodes.val.length} nodes, ${e.frames.val.length} frames`);
        break;
      }
      case "1d-mesh": {
        const c = [];
        for (let i = 0; i <= 7; i++) c.push(w(e, 0, 0, 1.4285714285714286 * i));
        for (let i = 0; i < 7; i++) x(e, c[i], c[i + 1]);
        const t = c.length;
        for (let i = 1; i <= 7; i++) c.push(w(e, 1.4285714285714286 * i, 0, 10));
        x(e, c[t - 1], c[t]);
        for (let i = 0; i < 6; i++) x(e, c[t + i], c[t + i + 1]);
        const s = c.length;
        for (let i = 1; i <= 7; i++) c.push(w(e, 10, 0, 10 - 1.4285714285714286 * i));
        x(e, c[s - 1], c[s]);
        for (let i = 0; i < 6; i++) x(e, c[s + i], c[s + i + 1]);
        console.log("Loaded: 1D Mesh Triangular Frame (span=10, height=10, mesh=7)"), console.log(`  ${e.nodes.val.length} nodes, ${e.frames.val.length} frames`);
        break;
      }
      case "report": {
        const n = w(e, 250, 0, 0), d = w(e, 600, 0, 0), f = w(e, 250, 0, 400);
        x(e, n, d), x(e, d, f), console.log("Loaded: Report Truss \u2014 3 nodes, 2 frames (units: mm scale)");
        break;
      }
      case "building": {
        a.addGrid("X", [0, 5, 10]), a.addGrid("Y", [0, 4, 8]), a.addStory("Base", 0), a.addStory("Story 1", 3.5), a.addStory("Story 2", 7), a.addStory("Roof", 10.5), a.addNodesAtGrid("Base"), a.addNodesAtGrid("Story 1"), a.addNodesAtGrid("Story 2"), a.addNodesAtGrid("Roof"), a.addColumnsAtLevel("Story 1"), a.addColumnsAtLevel("Story 2"), a.addColumnsAtLevel("Roof");
        const n = e.grid.val;
        for (const d of n.stories.slice(1)) {
          const f = d.elevation;
          for (const c of n.y.axes) {
            const t = c.position;
            for (let s = 0; s < n.x.axes.length - 1; s++) {
              const i = n.x.axes[s].position, p = n.x.axes[s + 1].position, r = P(e, i, t, f), m = P(e, p, t, f);
              r >= 0 && m >= 0 && x(e, r, m);
            }
          }
          for (const c of n.x.axes) {
            const t = c.position;
            for (let s = 0; s < n.y.axes.length - 1; s++) {
              const i = n.y.axes[s].position, p = n.y.axes[s + 1].position, r = P(e, t, i, f), m = P(e, t, p, f);
              r >= 0 && m >= 0 && x(e, r, m);
            }
          }
        }
        console.log(`Loaded: 3-Story Building (${e.nodes.val.length} nodes, ${e.frames.val.length} frames)`);
        break;
      }
      case "portico": {
        a.frame([2.93, 4.72, 3.2], [3.45, 3.07]), a.view("elevationY"), console.log("Loaded: Portico Irregular 2D (sv=[2.93,4.72,3.20], sp=[3.45,3.07])");
        break;
      }
      case "edificio": {
        a.building([2.93, 4.72, 3.2], [3, 4.5], [3.45, 3.07]), a.view("3d"), console.log("Loaded: Edificio Irregular 3D (svX=[2.93,4.72,3.20], svY=[3,4.5], sp=[3.45,3.07])");
        break;
      }
      default:
        console.error(`Unknown example: "${o}". Type cad.example() for list.`);
    }
  }, get state() {
    return e;
  } };
  return a;
}
function P(e, l, a, o) {
  const d = e.nodes.val.find((f) => Math.abs(f.position[0] - l) < 1e-6 && Math.abs(f.position[1] - a) < 1e-6 && Math.abs(f.position[2] - o) < 1e-6);
  return d ? d.id : -1;
}
const L = ue(), { element: B, ctx: U } = Me(), _ = Pe(L, U);
ze(L, U);
const j = document.createElement("div");
j.id = "cad-container";
j.appendChild(B);
B.appendChild(_);
const O = document.createElement("div");
O.id = "cad-info";
O.textContent = "Awatif FEM Studio \u2014 type cad.help() in console";
B.appendChild(O);
document.body.appendChild(j);
const Ee = Ye(L, _);
window.cad = Ee;
console.log("%c Awatif FEM Studio %c type cad.help() for commands", "background: #0088ff; color: white; padding: 2px 6px; border-radius: 3px;", "color: #888;");
