import { N as Ht, a6 as Kn, q as Us, v as te, a7 as qs, D as zt, M as ct, B as Ce, F as kt, a8 as Ks, x as wt, a9 as Gs, aa as Hs, h as os, ab as ss, r as dn, ac as Qn, ad as jn, a4 as xs, _ as rt, a as ht, L as Wt, w as gs, b as Ws, ae as Js, f as ut, V as k, $ as cn, af as ko, H as Vo, d as Pt, c as So, Y as vs, Z as to, G as Os, z as En, A as Qs, ag as eo, t as js, o as ea, I as en, a2 as Fn, E as as, S as xn, m as Gn, ah as An, g as is, i as ls, j as rs, C as cs, K as ta, U as na, W as oa, X as sa, T as Hn, P as Po, O as aa } from "./theme-Dxpmbnyd.js";
import { T as Ct, O as ds } from "./Text-DxjkL_3A.js";
import { P as bs } from "./tweakpane-BXg6ZhiP.js";
import { e as ia } from "./styles-DjzQZscE.js";
class Ms {
  constructor(l, c = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, c);
  }
  set(l) {
    return l.isLut === true && this.copy(l), this;
  }
  setMin(l) {
    return this.minV = l, this;
  }
  setMax(l) {
    return this.maxV = l, this;
  }
  setColorMap(l, c = 32) {
    this.map = Co[l] || Co.rainbow, this.n = c;
    const p = 1 / this.n, u = new Ht(), w = new Ht();
    this.lut.length = 0, this.lut.push(new Ht(this.map[0][1]));
    for (let f = 1; f < c; f++) {
      const b = f * p;
      for (let y = 0; y < this.map.length - 1; y++) if (b > this.map[y][0] && b <= this.map[y + 1][0]) {
        const P = this.map[y][0], E = this.map[y + 1][0];
        u.setHex(this.map[y][1], Kn), w.setHex(this.map[y + 1][1], Kn);
        const v = new Ht().lerpColors(u, w, (b - P) / (E - P));
        this.lut.push(v);
      }
    }
    return this.lut.push(new Ht(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Us.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const c = Math.round(l * this.n);
    return this.lut[c];
  }
  addColorMap(l, c) {
    return Co[l] = c, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const c = l.getContext("2d", { alpha: false }), p = c.getImageData(0, 0, 1, this.n), u = p.data;
    let w = 0;
    const f = 1 / this.n, b = new Ht(), y = new Ht(), P = new Ht();
    for (let E = 1; E >= 0; E -= f) for (let v = this.map.length - 1; v >= 0; v--) if (E < this.map[v][0] && E >= this.map[v - 1][0]) {
      const j = this.map[v - 1][0], ue = this.map[v][0];
      b.setHex(this.map[v - 1][1], Kn), y.setHex(this.map[v][1], Kn), P.lerpColors(b, y, (E - j) / (ue - j)), u[w * 4] = Math.round(P.r * 255), u[w * 4 + 1] = Math.round(P.g * 255), u[w * 4 + 2] = Math.round(P.b * 255), u[w * 4 + 3] = 255, w += 1;
    }
    return c.putImageData(p, 0, 0), l;
  }
}
const Co = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, _s = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], la = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: _s, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, no = te.state("safe"), ks = te.state("auto");
function Ss(e) {
  e = Math.max(0, Math.min(1, e));
  const l = la[no.val] ?? _s;
  for (let p = 0; p < l.length - 1; p++) {
    const [u, w, f, b] = l[p], [y, P, E, v] = l[p + 1];
    if (e <= y) {
      const j = (e - u) / (y - u);
      return [w + (P - w) * j, f + (E - f) * j, b + (v - b) * j];
    }
  }
  const c = l[l.length - 1];
  return [c[1], c[2], c[3]];
}
function ps() {
  const l = new Uint8Array(1024);
  for (let p = 0; p < 256; p++) {
    const u = p / 255, [w, f, b] = Ss(u);
    l[p * 4 + 0] = w, l[p * 4 + 1] = f, l[p * 4 + 2] = b, l[p * 4 + 3] = 255;
  }
  const c = new Gs(l, 256, 1, Hs);
  return c.minFilter = os, c.magFilter = os, c.wrapS = ss, c.wrapT = ss, c.needsUpdate = true, c;
}
function ra() {
  const l = [];
  for (let c = 0; c <= 12; c++) {
    const p = 1 - c / 12, [u, w, f] = Ss(p);
    l.push(`rgb(${u | 0},${w | 0},${f | 0}) ${(c / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function To(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((w, f) => w - f), c = (w) => l[Math.min(l.length - 1, Math.max(0, Math.round(w * (l.length - 1))))];
  let p = l.length >= 20 ? c(0.01) : l[0], u = l.length >= 20 ? c(0.99) : l[l.length - 1];
  return p >= 0 && u > 0 && (p = 0), u <= 0 && p < 0 && (u = 0), [p, u];
}
function ca(e, l, c) {
  new Ms();
  const p = ps(), u = new qs({ uniforms: { cmap: { value: p }, ambient: { value: 0.95 } }, vertexShader: `
      #include <common>
      #include <clipping_planes_pars_vertex>
      attribute float scalar;
      varying float vScalar;
      void main() {
        vScalar = scalar;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <clipping_planes_vertex>
      }
    `, fragmentShader: `
      #include <common>
      #include <clipping_planes_pars_fragment>
      uniform sampler2D cmap;
      uniform float ambient;
      varying float vScalar;
      void main() {
        #include <clipping_planes_fragment>
        // Si NaN (vScalar < -0.5 sentinel), gris neutro
        if (vScalar < -0.5) {
          gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
          return;
        }
        vec3 color = texture2D(cmap, vec2(clamp(vScalar, 0.0, 1.0), 0.5)).rgb;
        gl_FragColor = vec4(color * ambient, 1.0);
      }
    `, side: zt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  te.derive(() => {
    var _a2;
    no.val;
    const f = u.uniforms.cmap.value;
    u.uniforms.cmap.value = ps(), (_a2 = f == null ? void 0 : f.dispose) == null ? void 0 : _a2.call(f);
  });
  const w = new ct(new Ce(), u);
  return w.renderOrder = -1, w.frustumCulled = false, w.userData.isShellArea = true, w.name = "__hekatan_shell_colormap", te.derive(() => {
    w.geometry.setAttribute("position", new kt(e.val.flat(), 3));
    const f = [], b = [], y = [];
    l.val.forEach((W, ce) => {
      W.length === 3 ? (f.push(W[0], W[1], W[2]), b.push(ce), y.push(0)) : W.length === 4 && (f.push(W[0], W[1], W[2]), f.push(W[0], W[2], W[3]), b.push(ce, ce), y.push(0, 1));
    }), w.geometry.setIndex(new Ks(f, 1)), w.userData.faceToElem = b, w.userData.faceLocal = y;
    const P = c.val.filter((W) => Number.isFinite(W));
    let E, v;
    const j = Tn.val;
    if (j ? (v = j[0], E = j[1]) : [v, E] = To(P), E === v) {
      const W = Math.max(Math.abs(E) * 1e-6, 1e-9);
      E += W, v -= W;
    }
    const ue = j && j[0] > j[1], ge = Math.min(v, E), re = Math.max(v, E), L = re - ge, G = new Float32Array(c.val.length);
    for (let W = 0; W < c.val.length; W++) {
      const ce = c.val[W];
      if (!Number.isFinite(ce)) {
        G[W] = -1;
        continue;
      }
      const V = ((ue ? re + ge - ce : ce) - ge) / L;
      G[W] = Math.max(0, Math.min(1, V));
    }
    w.geometry.setAttribute("scalar", new wt(G, 1));
  }), w;
}
function da(e, l, c) {
  const p = document.createElement("div"), u = new bs({ title: "Settings", expanded: true, container: p });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(u), p.setAttribute("id", "settings");
  const w = "hk_settingsPos";
  let f = null;
  try {
    const v = localStorage.getItem(w);
    v && (f = JSON.parse(v));
  } catch {
  }
  p.style.cssText = ["position:fixed", f ? `left:${f.left}px` : "left:8px", f ? `top:${f.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const b = () => {
    const v = p.querySelector(".tp-rotv_b");
    if (!v) {
      setTimeout(b, 200);
      return;
    }
    v.style.cursor = "move", v.style.userSelect = "none";
    let j = false, ue = 0, ge = 0, re = 0, L = 0;
    v.addEventListener("mousedown", (G) => {
      j = true, ue = G.clientX, ge = G.clientY;
      const W = p.getBoundingClientRect();
      re = W.left, L = W.top, p.style.left = `${re}px`, p.style.top = `${L}px`;
    }), window.addEventListener("mousemove", (G) => {
      if (!j) return;
      const W = G.clientX - ue, ce = G.clientY - ge, pe = Math.max(0, Math.min(window.innerWidth - 40, re + W)), V = Math.max(0, Math.min(window.innerHeight - 40, L + ce));
      p.style.left = `${pe}px`, p.style.top = `${V}px`;
    }), window.addEventListener("mouseup", () => {
      if (j) {
        j = false;
        try {
          localStorage.setItem(w, JSON.stringify({ left: parseFloat(p.style.left), top: parseFloat(p.style.top) }));
        } catch {
        }
      }
    });
  };
  if (b(), l == null ? void 0 : l.nodes) {
    u.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const v = u.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    v.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), v.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), v.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), v.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const j = v.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    j.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), j.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), j.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), j.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), j.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ue = u.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ue.addBinding(e.nodes, "val", { label: "Nodes" }), ue.addBinding(e.elements, "val", { label: "Elements" }), ue.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ue.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ue.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ue.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ue.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ue.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ue.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ue.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ue.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ue.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ue.addBinding(e.orientations, "val", { label: "Orientations" }), ue.addBinding(e.sections, "val", { label: "Sections" }), ue.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ue.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ue.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ue.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ue.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const v = u.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    v.addBinding(e.supports, "val", { label: "Supports" }), v.addBinding(e.loads, "val", { label: "Loads" }), v.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), v.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const v = u.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = v, v.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), v.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), v.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), v.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), v.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), v.addBinding(no, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), v.addBinding(ks, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), v.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), v.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), v.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), v.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  c && u.addBinding(e.solids, "val", { label: "Solids" });
  const y = u.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), P = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), E = () => {
    const v = window.__hekatanClipApply;
    typeof v == "function" && v();
  };
  return y.addBinding(P, "enableX", { label: "Cortar X" }).on("change", E), y.addBinding(P, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", E), y.addBinding(P, "invertX", { label: "  invertir X" }).on("change", E), y.addBinding(P, "enableY", { label: "Cortar Y" }).on("change", E), y.addBinding(P, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", E), y.addBinding(P, "invertY", { label: "  invertir Y" }).on("change", E), y.addBinding(P, "enableZ", { label: "Cortar Z" }).on("change", E), y.addBinding(P, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", E), y.addBinding(P, "invertZ", { label: "  invertir Z" }).on("change", E), p;
}
function pa(e) {
  return { gridSize: te.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: te.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: te.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: te.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: te.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: te.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: te.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: te.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: te.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: te.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: te.state((e == null ? void 0 : e.nodes) ?? true), elements: te.state((e == null ? void 0 : e.elements) ?? true), edges: te.state((e == null ? void 0 : e.edges) ?? true), faces: te.state((e == null ? void 0 : e.faces) ?? true), elemColumns: te.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: te.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: te.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: te.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: te.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: te.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: te.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: te.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: te.state((e == null ? void 0 : e.orientations) ?? false), sections: te.state((e == null ? void 0 : e.sections) ?? true), extruded: te.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: te.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: te.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: te.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: te.state((e == null ? void 0 : e.secFloor) ?? -1), supports: te.state((e == null ? void 0 : e.supports) ?? true), loads: te.state((e == null ? void 0 : e.loads) ?? false), deformedShape: te.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: te.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: te.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: te.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: te.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: te.state((e == null ? void 0 : e.flipAxes) ?? false), solids: te.state((e == null ? void 0 : e.solids) ?? true), custom3D: te.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: te.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: te.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: te.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function ua(e, l, c) {
  const p = dn(), u = new Qn(new Ce(), new jn({ color: p.nodePoint }));
  return xs((w, f) => {
    u.material.color.setHex(f.nodePoint);
  }), u.frustumCulled = false, te.derive(() => {
    e.nodes.val && u.geometry.setAttribute("position", new kt(l.val.flat(), 3));
  }), te.derive(() => {
    if (c.val, l.val, !e.nodes.rawVal) return;
    const w = l.rawVal ?? [];
    let f = e.gridSize.val * 0.5;
    if (w.length >= 2) {
      const y = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
      for (const E of w) for (let v = 0; v < 3; v++) y[v] = Math.min(y[v], E[v]), P[v] = Math.max(P[v], E[v]);
      f = Math.max(P[0] - y[0], P[1] - y[1], P[2] - y[2], 0.1);
    }
    const b = 0.03 * f;
    u.material.size = b * c.rawVal;
  }), te.derive(() => {
    u.visible = e.nodes.val;
  }), u;
}
function zo(e, l) {
  const c = dn(), p = new rt();
  p.name = "hekatan-grid";
  const u = (l == null ? void 0 : l.planes) ?? ["xy"];
  let w = (l == null ? void 0 : l.majorStep) ?? 1, f = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (w <= 0 && (w = 1), f <= 0 && (f = 0.1); e / f > 500; ) f *= 2;
  for (; e / w > 100; ) w *= 2;
  const b = e / 2;
  w = Math.max(f, Math.round(w / f) * f);
  const P = new Ht(c.grid).multiplyScalar(1.3), E = new Ht(c.grid).multiplyScalar(0.8), v = (re, L, G, W) => {
    const ce = [], pe = re === "xy" ? (C, R) => [C, R, 0] : re === "xz" ? (C, R) => [C, 0, R] : (C, R) => [0, C, R], V = Math.floor(b / L);
    for (let C = -V; C <= V; C++) {
      const R = C * L, X = pe(R, -b), $ = pe(R, b);
      ce.push(...X, ...$);
    }
    for (let C = -V; C <= V; C++) {
      const R = C * L, X = pe(-b, R), $ = pe(b, R);
      ce.push(...X, ...$);
    }
    const I = new Ce();
    I.setAttribute("position", new kt(ce, 3));
    const N = new ht({ color: G, transparent: true, opacity: W, depthWrite: false }), F = new Wt(I, N);
    return F.name = `grid-${re}-${L === f ? "minor" : "major"}`, F;
  }, j = (re, L, G) => {
    const W = re === "xy" ? (F, C) => [F, C, 0] : re === "xz" ? (F, C) => [F, 0, C] : (F, C) => [0, F, C], ce = [[-b, -b], [b, -b], [b, b], [-b, b]], pe = [];
    for (const [F, C] of ce) pe.push(...W(F, C));
    const V = new Ce();
    V.setAttribute("position", new kt(pe, 3));
    const I = new ht({ color: L, transparent: true, opacity: G, depthWrite: false }), N = new gs(V, I);
    return N.name = `grid-${re}-border`, N.renderOrder = 1, N;
  }, ue = (re, L, G) => {
    const W = re === "xy" ? (I, N) => [I, N, 0] : re === "xz" ? (I, N) => [I, 0, N] : (I, N) => [0, I, N], ce = L === "u" ? [...W(-b, 0), ...W(b, 0)] : [...W(0, -b), ...W(0, b)], pe = new Ce();
    pe.setAttribute("position", new kt(ce, 3));
    const V = new Wt(pe, new ht({ color: G, transparent: true, opacity: 0.45, depthWrite: false }));
    return V.name = `grid-${re}-eje-${L}`, V.renderOrder = 1, V;
  }, ge = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const re of u) {
    p.add(v(re, f, E, 0.12)), p.add(v(re, w, P, 0.4));
    const [L, G] = ge[re];
    p.add(ue(re, "u", L)), p.add(ue(re, "v", G)), p.add(j(re, P, 0.55));
  }
  return p.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: w, minorStep: f, gridSize: e, planes: [...u] }, p;
}
function fa(e, l, c, p) {
  const u = new rt(), w = new Ws(0.5, 0.5, 0.5), f = new Js(0.45, 0.7, 4);
  f.rotateX(Math.PI / 2), f.translate(0, 0, -0.35);
  const b = new ut({ color: 10166822 }), y = new ut({ color: 2792847 }), P = new ut({ color: 3835647 }), E = () => {
    const ue = c.rawVal ?? [];
    if (ue.length < 2) return l.gridSize.val * 0.5;
    let ge = [1 / 0, 1 / 0, 1 / 0], re = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of ue) for (let G = 0; G < 3; G++) L[G] < ge[G] && (ge[G] = L[G]), L[G] > re[G] && (re[G] = L[G]);
    return Math.max(re[0] - ge[0], re[1] - ge[1], re[2] - ge[2], 0.1);
  }, v = () => 0.08 * E(), j = () => p.rawVal;
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    u.clear();
    const ue = v();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((ge, re) => {
      const L = c.val[re];
      if (!L) return;
      const G = ge ?? [], W = (G[0] ? 1 : 0) + (G[1] ? 1 : 0) + (G[2] ? 1 : 0), ce = (G[3] ? 1 : 0) + (G[4] ? 1 : 0) + (G[5] ? 1 : 0);
      let pe;
      W >= 3 && ce >= 3 ? pe = new ct(w, b) : W >= 3 && ce === 0 ? pe = new ct(f, y) : pe = new ct(f, P), pe.position.set(L[0], L[1], L[2]);
      const V = ue * j();
      pe.scale.set(V, V, V), u.add(pe);
    });
  }), te.derive(() => {
    if (p.val, !l.supports.rawVal) return;
    const ge = v() * j();
    u.children.forEach((re) => re.scale.set(ge, ge, ge));
  }), te.derive(() => {
    u.visible = l.supports.val;
  }), u;
}
function ha(e, l, c, p) {
  const u = new rt();
  u.name = "loadsGroup";
  function w(f) {
    if (f.length < 2) return 0.12 * l.gridSize.rawVal;
    const b = [1 / 0, 1 / 0, 1 / 0], y = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of f) for (let v = 0; v < 3; v++) b[v] = Math.min(b[v], E[v]), y[v] = Math.max(y[v], E[v]);
    return 0.08 * Math.max(y[0] - b[0], y[1] - b[1], y[2] - b[2], 0.1);
  }
  return te.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    u.children.forEach((v) => v.dispose()), u.clear();
    const f = c.val, b = w(f), y = 240, P = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((v, j) => {
      f[j] && v.slice(0, 3).some((ue) => Math.abs(ue) > 1e-15) && P.push(j);
    });
    let E = P;
    if (P.length > y) {
      const v = P.map((F) => f[F][0]), j = P.map((F) => f[F][1]), ue = Math.min(...v), ge = Math.max(...v), re = Math.min(...j), L = Math.max(...j), G = P.map((F) => f[F][2]), W = Math.max(1e-6, (Math.max(...G) - Math.min(...G)) / 40), ce = (F) => Math.round(F / W), pe = new Set(G.map(ce)), V = Math.max(4, Math.floor(y / Math.max(1, pe.size))), I = Math.max(2, Math.round(Math.sqrt(V))), N = /* @__PURE__ */ new Map();
      for (const F of P) {
        const C = ge - ue < 1e-9 ? 0 : (f[F][0] - ue) / (ge - ue), R = L - re < 1e-9 ? 0 : (f[F][1] - re) / (L - re), X = Math.min(I - 1, Math.floor(C * I)), $ = Math.min(I - 1, Math.floor(R * I)), ee = `${X},${$},${ce(f[F][2])}`, fe = Math.hypot(C * I - (X + 0.5), R * I - ($ + 0.5)), ae = N.get(ee);
        (!ae || fe < ae.d) && N.set(ee, { i: F, d: fe });
      }
      E = [...N.values()].map((F) => F.i);
    }
    for (const v of E) {
      const j = e.nodeInputs.val.loads.get(v), ue = f[v];
      if (!ue) continue;
      const ge = new k(...j.slice(0, 3));
      if (ge.lengthSq() < 1e-30) continue;
      ge.normalize();
      const re = new cn(ge, new k(...ue), 1, 15637248, 0.3, 0.3), L = b * p.rawVal;
      re.scale.set(L, L, L), u.add(re);
    }
  }), te.derive(() => {
    if (p.val, !l.loads.rawVal) return;
    const b = w(c.rawVal) * p.rawVal;
    u.children.forEach((y) => y.scale.set(b, b, b));
  }), te.derive(() => {
    u.visible = l.loads.val;
  }), u;
}
function ma(e, l, c) {
  const p = new rt();
  return te.derive(() => {
    if (!e.nodesIndexes.val) return;
    p.children.forEach((w) => w.dispose()), p.clear();
    const u = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((w, f) => {
      const b = new Ct(`${f}`);
      b.position.set(...w), b.updateScale(u * c.rawVal), p.add(b);
    });
  }), te.derive(() => {
    if (c.val, !e.nodesIndexes.rawVal) return;
    const u = 0.05 * e.gridSize.val * 0.6;
    p.children.forEach((w) => w.updateScale(u * c.rawVal));
  }), te.derive(() => {
    p.visible = e.nodesIndexes.val;
  }), p;
}
function wa(e, l, c, p) {
  const u = new rt();
  return te.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    u.children.forEach((f) => f.dispose()), u.clear();
    const w = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((f, b) => {
      const y = new Ct(`${b}`, void 0, "#001219");
      y.position.set(...ya(f.map((P) => c.rawVal[P]))), y.updateScale(w * p.rawVal), u.add(y);
    });
  }), te.derive(() => {
    if (p.val, !l.elementsIndexes.rawVal) return;
    const w = 0.05 * l.gridSize.val * 0.6;
    u.children.forEach((f) => f.updateScale(w * p.rawVal));
  }), te.derive(() => {
    u.visible = l.elementsIndexes.val;
  }), u;
}
function ya(e) {
  const l = e.reduce((p, u) => [p[0] + u[0], p[1] + u[1], p[2] + u[2]], [0, 0, 0]), c = e.length;
  return [l[0] / c, l[1] / c, l[2] / c];
}
function us(e, l) {
  const c = new rt(), p = Math.min(0.05 * e, 0.6), u = dn(), w = new Ct("X", "red", "transparent"), f = new Ct(l ? "Z" : "Y", "green", "transparent"), b = new Ct(l ? "Y" : "Z", "blue", "transparent"), y = new cn(new k(1, 0, 0), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), P = new cn(new k(0, 1, 0), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), E = new cn(new k(0, 0, 1), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2);
  return w.position.set(1.3 * p, 0, 0), f.position.set(0, 1.3 * p, 0), b.position.set(0, 0, 1.3 * p), w.updateScale(0.4 * p), f.updateScale(0.4 * p), b.updateScale(0.4 * p), y.scale.set(p, p, p), P.scale.set(p, p, p), E.scale.set(p, p, p), c.add(y, P, E, w, f, b), c;
}
function oo(e, l) {
  const c = new k(...e), u = new k(...l).clone().sub(c), w = u.length(), f = u.dot(new k(1, 0, 0)) / w, b = u.dot(new k(0, 1, 0)) / w, y = u.dot(new k(0, 0, 1)) / w, P = Math.sqrt(f ** 2 + b ** 2);
  let E = new ko().fromArray([[f, b, y], [-b / P, f / P, 0], [-f * y / P, -b * y / P, P]].flat());
  return y === 1 && (E = new ko().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), y === -1 && (E = new ko().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Vo().setFromMatrix3(E);
}
function Ao(e, l) {
  return e == null ? void 0 : e.map((c, p) => (9 * c + l[p]) / 10);
}
function Vn(e) {
  const l = e.reduce((p, u) => [p[0] + u[0], p[1] + u[1], p[2] + u[2]], [0, 0, 0]), c = e.length;
  return [l[0] / c, l[1] / c, l[2] / c];
}
function xa(e, l, c) {
  const p = Vn([l, c]), u = Vn([e, c]), w = Vn([e, l]), f = new k(...p).sub(new k(...u)).normalize(), b = new k(...c).sub(new k(...w)).normalize(), y = f.clone().cross(b).normalize(), P = y.clone().cross(f).normalize();
  return new Vo().makeBasis(f, P, y);
}
function ga(e, l, c, p) {
  const u = new rt(), w = new Ce(), f = new ht({ vertexColors: true }), b = [0, 0, 0], y = [1, 0, 0], P = [0, 1, 0], E = [0, 0, 1];
  w.setAttribute("position", new kt([...b, ...y, ...b, ...P, ...b, ...E], 3));
  const v = [255, 0, 0], j = [0, 255, 0], ue = [0, 0, 255];
  return w.setAttribute("color", new kt([...v, ...v, ...j, ...j, ...ue, ...ue], 3)), te.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (u.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((ge) => {
      const re = new Wt(w, f), L = c.rawVal[ge[0]], G = c.rawVal[ge[1]];
      if (ge.length === 2 && (re.position.set(...Ao(L, G)), re.rotation.setFromRotationMatrix(oo(L, G))), ge.length === 3) {
        const pe = c.rawVal[ge[2]];
        re.position.set(...Vn([L, G, pe])), re.rotation.setFromRotationMatrix(xa(L, G, pe));
      }
      const ce = 0.05 * l.gridSize.rawVal * 0.75 * p.rawVal;
      re.scale.set(ce, ce, ce), u.add(re);
    }));
  }), te.derive(() => {
    if (p.val, !l.orientations.rawVal) return;
    const re = 0.05 * l.gridSize.val * 0.75 * p.rawVal;
    u.children.forEach((L) => L.scale.set(re, re, re));
  }), te.derive(() => {
    u.visible = l.orientations.val;
  }), u;
}
function va(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), c = (e.h * 100).toFixed(0);
    return `${l}x${c}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ba(e, l, c, p) {
  const u = new rt(), w = new rt();
  u.add(w);
  function f(I, N) {
    const F = I / 2, C = N / 2, R = new Float32Array([0, -F, -C, 0, F, -C, 0, F, C, 0, -F, -C, 0, F, C, 0, -F, C]), X = new Ce();
    X.setAttribute("position", new wt(R, 3));
    const $ = new Float32Array([0, -F, -C, 0, F, -C, 0, F, C, 0, -F, C, 0, -F, -C]), ee = new Ce();
    return ee.setAttribute("position", new wt($, 3)), { fill: X, outline: ee };
  }
  function b(I, N = 24) {
    const F = I / 2, C = new Float32Array(N * 9);
    for (let ee = 0; ee < N; ee++) {
      const fe = ee / N * Math.PI * 2, ae = (ee + 1) / N * Math.PI * 2;
      C[ee * 9] = 0, C[ee * 9 + 1] = 0, C[ee * 9 + 2] = 0, C[ee * 9 + 3] = 0, C[ee * 9 + 4] = F * Math.cos(fe), C[ee * 9 + 5] = F * Math.sin(fe), C[ee * 9 + 6] = 0, C[ee * 9 + 7] = F * Math.cos(ae), C[ee * 9 + 8] = F * Math.sin(ae);
    }
    const R = new Ce();
    R.setAttribute("position", new wt(C, 3));
    const X = new Float32Array((N + 1) * 3);
    for (let ee = 0; ee <= N; ee++) {
      const fe = ee / N * Math.PI * 2;
      X[ee * 3] = 0, X[ee * 3 + 1] = F * Math.cos(fe), X[ee * 3 + 2] = F * Math.sin(fe);
    }
    const $ = new Ce();
    return $.setAttribute("position", new wt(X, 3)), { fill: R, outline: $ };
  }
  function y(I, N, F, C) {
    const R = F ?? N * 0.08, X = C ?? I * 0.07, $ = I / 2, ee = N / 2, fe = ee - R, ae = X / 2, se = [];
    function B(he, Ve, be, Be) {
      se.push(0, he, Ve, 0, be, Ve, 0, be, Be, 0, he, Ve, 0, be, Be, 0, he, Be);
    }
    B(-$, -ee, $, -fe), B(-ae, -fe, ae, fe), B(-$, fe, $, ee);
    const de = new Ce();
    de.setAttribute("position", new wt(new Float32Array(se), 3));
    const J = new Float32Array([0, -$, -ee, 0, $, -ee, 0, $, -fe, 0, ae, -fe, 0, ae, fe, 0, $, fe, 0, $, ee, 0, -$, ee, 0, -$, fe, 0, -ae, fe, 0, -ae, -fe, 0, -$, -fe, 0, -$, -ee]), me = new Ce();
    return me.setAttribute("position", new wt(J, 3)), { fill: de, outline: me };
  }
  function P(I, N, F) {
    const C = I / 2, R = N / 2, X = C - F, $ = R - F, ee = [];
    function fe(de, J, me, he) {
      ee.push(0, de, J, 0, me, J, 0, me, he, 0, de, J, 0, me, he, 0, de, he);
    }
    fe(-C, -R, C, -$), fe(-C, $, C, R), fe(-C, -$, -X, $), fe(X, -$, C, $);
    const ae = new Ce();
    ae.setAttribute("position", new wt(new Float32Array(ee), 3));
    const se = new Float32Array([0, -C, -R, 0, C, -R, 0, C, -R, 0, C, R, 0, C, R, 0, -C, R, 0, -C, R, 0, -C, -R, 0, -X, -$, 0, X, -$, 0, X, -$, 0, X, $, 0, X, $, 0, -X, $, 0, -X, $, 0, -X, -$]), B = new Ce();
    return B.setAttribute("position", new wt(se, 3)), { fill: ae, outline: B };
  }
  function E(I, N, F) {
    const C = I / 2, R = N / 2, X = C - F, $ = R - F, ee = new Ce(), fe = new Float32Array([0, -X, -$, 0, X, -$, 0, X, $, 0, -X, -$, 0, X, $, 0, -X, $]);
    ee.setAttribute("position", new wt(fe, 3));
    const ae = [];
    function se(me, he, Ve, be) {
      ae.push(0, me, he, 0, Ve, he, 0, Ve, be, 0, me, he, 0, Ve, be, 0, me, be);
    }
    se(-C, -R, C, -$), se(-C, $, C, R), se(-C, -$, -X, $), se(X, -$, C, $);
    const B = new Ce();
    B.setAttribute("position", new wt(new Float32Array(ae), 3));
    const de = new Float32Array([0, -C, -R, 0, C, -R, 0, C, -R, 0, C, R, 0, C, R, 0, -C, R, 0, -C, R, 0, -C, -R, 0, -X, -$, 0, X, -$, 0, X, -$, 0, X, $, 0, X, $, 0, -X, $, 0, -X, $, 0, -X, -$]), J = new Ce();
    return J.setAttribute("position", new wt(de, 3)), { concFill: ee, steelFillGeom: B, outline: J };
  }
  function v(I, N, F) {
    const C = [], R = [[0, -I / 2, -N / 2], [0, -I / 2 + F, -N / 2], [0, -I / 2 + F, N / 2 - F], [0, I / 2, N / 2 - F], [0, I / 2, N / 2], [0, -I / 2, N / 2]], X = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ae of X) C.push(...R[ae]);
    const $ = new Ce();
    $.setAttribute("position", new wt(new Float32Array(C), 3));
    const ee = [];
    for (let ae = 0; ae < R.length; ae++) {
      const se = (ae + 1) % R.length;
      ee.push(...R[ae], ...R[se]);
    }
    const fe = new Ce();
    return fe.setAttribute("position", new wt(new Float32Array(ee), 3)), { fill: $, outline: fe };
  }
  function j(I, N, F, C) {
    const R = C / 2, X = [], $ = [[0, -I - R, -N / 2], [0, -F - R, -N / 2], [0, -F - R, N / 2 - F], [0, -R, N / 2 - F], [0, -R, N / 2], [0, -I - R, N / 2]], ee = [[0, R, -N / 2], [0, R + F, -N / 2], [0, R + F, N / 2 - F], [0, I + R, N / 2 - F], [0, I + R, N / 2], [0, R, N / 2]], fe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const de of fe) X.push(...$[de]);
    for (const de of fe) X.push(...ee[de]);
    const ae = new Ce();
    ae.setAttribute("position", new wt(new Float32Array(X), 3));
    const se = [];
    for (const de of [$, ee]) for (let J = 0; J < de.length; J++) {
      const me = (J + 1) % de.length;
      se.push(...de[J], ...de[me]);
    }
    const B = new Ce();
    return B.setAttribute("position", new wt(new Float32Array(se), 3)), { fill: ae, outline: B };
  }
  function ue(I, N, F, C) {
    const R = N / 2, X = I, $ = [[0, -X, -R], [0, -X, -R + F], [0, -C, -R + F], [0, -C, R - F], [0, -X, R - F], [0, -X, R], [0, 0, R], [0, 0, -R]], ee = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], fe = [];
    for (const de of ee) fe.push(...$[de]);
    const ae = new Ce();
    ae.setAttribute("position", new wt(new Float32Array(fe), 3));
    const se = [];
    for (let de = 0; de < $.length; de++) {
      const J = (de + 1) % $.length;
      se.push(...$[de], ...$[J]);
    }
    const B = new Ce();
    return B.setAttribute("position", new wt(new Float32Array(se), 3)), { fill: ae, outline: B };
  }
  function ge(I, N, F, C, R) {
    const X = N / 2, $ = R / 2, ee = [], fe = [[0, -I, -X], [0, -I, -X + F], [0, -$ - C, -X + F], [0, -$ - C, X - F], [0, -I, X - F], [0, -I, X], [0, -$, X], [0, -$, -X]], ae = fe.map((me) => [me[0], -me[1], me[2]]), se = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const me of se) ee.push(...fe[me]);
    for (const me of se) ee.push(...ae[me]);
    const B = new Ce();
    B.setAttribute("position", new wt(new Float32Array(ee), 3));
    const de = [];
    for (const me of [fe, ae]) for (let he = 0; he < me.length; he++) {
      const Ve = (he + 1) % me.length;
      de.push(...me[he], ...me[Ve]);
    }
    const J = new Ce();
    return J.setAttribute("position", new wt(new Float32Array(de), 3)), { fill: B, outline: J };
  }
  function re(I, N, F, C) {
    const R = I / 2, X = N / 2, $ = C / 2, ee = [[0, -$, -X], [0, $, -X], [0, $, X - F], [0, R, X - F], [0, R, X], [0, -R, X], [0, -R, X - F], [0, -$, X - F]], fe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], ae = [];
    for (const J of fe) ae.push(...ee[J]);
    const se = new Ce();
    se.setAttribute("position", new wt(new Float32Array(ae), 3));
    const B = [];
    for (let J = 0; J < ee.length; J++) {
      const me = (J + 1) % ee.length;
      B.push(...ee[J], ...ee[me]);
    }
    const de = new Ce();
    return de.setAttribute("position", new wt(new Float32Array(B), 3)), { fill: se, outline: de };
  }
  function L(I, N, F = 24) {
    const C = I / 2, R = C - N, X = [];
    for (let ae = 0; ae < F; ae++) {
      const se = ae / F * Math.PI * 2, B = (ae + 1) / F * Math.PI * 2, de = Math.cos(se), J = Math.sin(se), me = Math.cos(B), he = Math.sin(B);
      X.push(0, C * de, C * J, 0, C * me, C * he, 0, R * me, R * he), X.push(0, C * de, C * J, 0, R * me, R * he, 0, R * de, R * J);
    }
    const $ = new Ce();
    $.setAttribute("position", new wt(new Float32Array(X), 3));
    const ee = [];
    for (let ae = 0; ae < F; ae++) {
      const se = ae / F * Math.PI * 2, B = (ae + 1) / F * Math.PI * 2;
      ee.push(0, C * Math.cos(se), C * Math.sin(se), 0, C * Math.cos(B), C * Math.sin(B)), ee.push(0, R * Math.cos(se), R * Math.sin(se), 0, R * Math.cos(B), R * Math.sin(B));
    }
    const fe = new Ce();
    return fe.setAttribute("position", new wt(new Float32Array(ee), 3)), { fill: $, outline: fe };
  }
  const G = new ut({ color: 52479, transparent: true, opacity: 0.35, side: zt, depthWrite: false }), W = new ht({ color: 52479 }), ce = new ut({ color: 16750848, transparent: true, opacity: 0.4, side: zt, depthWrite: false }), pe = new ht({ color: 16750848 });
  function V(I, N) {
    const F = Math.abs(N[0] - I[0]), C = Math.abs(N[1] - I[1]), R = Math.abs(N[2] - I[2]);
    return R > F && R > C || C > F && C > R;
  }
  return te.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const I = l.secColumns.rawVal, N = l.secBeams.rawVal;
    if (!I && !N) {
      u.children.forEach(($) => {
        $ instanceof Ct && $.dispose();
      }), u.clear();
      return;
    }
    u.children.forEach(($) => {
      $ instanceof Ct && $.dispose();
    }), u.clear();
    const F = (_a2 = e.elements) == null ? void 0 : _a2.val, C = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!F || !C) return;
    const R = C.sectionShapes, X = l.secFloor.rawVal;
    F.forEach(($, ee) => {
      if ($.length !== 2) return;
      const fe = c.rawVal[$[0]], ae = c.rawVal[$[1]];
      if (!fe || !ae) return;
      const se = V(fe, ae);
      if (se && !I || !se && !N) return;
      if (X >= 0) {
        const he = Math.min(fe[1], ae[1]);
        Math.max(fe[1], ae[1]);
        const Ve = l.gridSize.rawVal || 3;
        if (Math.floor(he / Ve + 0.01) !== X) return;
      }
      const B = R == null ? void 0 : R.get(ee);
      if (!B) return;
      const de = [(fe[0] + ae[0]) / 2, (fe[1] + ae[1]) / 2, (fe[2] + ae[2]) / 2], J = oo(fe, ae);
      if (B.type === "CFT") {
        const he = E(B.b, B.h, B.tw ?? B.b * 0.05), Ve = new ct(he.concFill, G);
        Ve.position.set(...de), Ve.rotation.setFromRotationMatrix(J), u.add(Ve);
        const be = new ct(he.steelFillGeom, ce);
        be.position.set(...de), be.rotation.setFromRotationMatrix(J), u.add(be);
        const Be = new Pt(he.outline, pe);
        Be.position.set(...de), Be.rotation.setFromRotationMatrix(J), u.add(Be);
      } else {
        let he, Ve, be;
        switch (B.type) {
          case "rect":
            he = f(B.b, B.h), Ve = G, be = W;
            break;
          case "circ":
            he = b(B.d), Ve = G, be = W;
            break;
          case "I":
            he = y(B.b, B.h, B.tf, B.tw), Ve = ce, be = pe;
            break;
          case "HSS":
            he = P(B.b, B.h, B.tw ?? B.b * 0.05), Ve = ce, be = pe;
            break;
          case "CFT":
            he = E(B.b, B.h, B.tw ?? B.b * 0.05), Ve = ce, be = pe;
            break;
          case "L":
            he = v(B.b ?? B.h, B.h, B.t ?? B.tw ?? 3e-3), Ve = ce, be = pe;
            break;
          case "2L":
            he = j(B.b ?? B.h, B.h, B.t ?? B.tw ?? 3e-3, B.dis ?? 0.01), Ve = ce, be = pe;
            break;
          case "C":
          case "coldC":
            he = ue(B.b, B.h, B.tf ?? B.t ?? 3e-3, B.tw ?? B.t ?? 3e-3), Ve = ce, be = pe;
            break;
          case "2C":
            he = ge(B.b, B.h, B.tf ?? 5e-3, B.tw ?? 5e-3, B.dis ?? 0.01), Ve = ce, be = pe;
            break;
          case "T":
            he = re(B.b, B.h, B.tf ?? 0.01, B.tw ?? 6e-3), Ve = ce, be = pe;
            break;
          case "pipe":
            he = L(B.d, B.tw ?? B.d * 0.05), Ve = ce, be = pe;
            break;
          default:
            return;
        }
        const Be = new ct(he.fill, Ve);
        Be.position.set(...de), Be.rotation.setFromRotationMatrix(J), u.add(Be);
        const We = new Pt(he.outline, be);
        We.position.set(...de), We.rotation.setFromRotationMatrix(J), u.add(We);
      }
      const me = va(B);
      if (me) {
        const Ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(B.type) ? "#ff9900" : "#00ccff", be = new Ct(me, Ve, "transparent");
        be.position.set(de[0], de[1], de[2]);
        const Be = 0.05 * l.gridSize.rawVal * 0.5;
        be.updateScale(Be * ((p == null ? void 0 : p.rawVal) ?? 1)), w.add(be);
      }
    });
  }), p && te.derive(() => {
    if (p.val, !l.sections.rawVal) return;
    const I = 0.05 * l.gridSize.val * 0.5;
    w.children.forEach((N) => {
      N instanceof Ct && N.updateScale(I * p.rawVal);
    });
  }), te.derive(() => {
    u.visible = l.sections.val;
  }), te.derive(() => {
    w.visible = l.sectionLabels.val;
  }), u;
}
function Ma(e) {
  if (!e) return null;
  const l = e.type, c = (E, v) => [E, v], p = (E, v) => [c(-E / 2, -v / 2), c(E / 2, -v / 2), c(E / 2, v / 2), c(-E / 2, v / 2)], u = (E, v = 24) => {
    const j = E / 2, ue = [];
    for (let ge = 0; ge < v; ge++) {
      const re = 2 * Math.PI * ge / v;
      ue.push(c(j * Math.cos(re), j * Math.sin(re)));
    }
    return ue;
  }, w = e.b ?? 0, f = e.h ?? 0, b = e.d ?? 0, y = e.tw ?? e.t ?? 0, P = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return w && f ? { contorno: p(w, f) } : null;
    case "circ":
      return b ? { contorno: u(b) } : null;
    case "pipe":
      return b && y ? { contorno: u(b), huecos: [u(b - 2 * y).reverse()] } : null;
    case "HSS":
      return w && f && y ? { contorno: p(w, f), huecos: [p(w - 2 * y, f - 2 * (P || y)).reverse()] } : null;
    case "CFT":
      return w && f ? { contorno: p(w, f) } : null;
    case "I":
      return w && f && y && P ? { contorno: [c(-w / 2, -f / 2), c(w / 2, -f / 2), c(w / 2, -f / 2 + P), c(y / 2, -f / 2 + P), c(y / 2, f / 2 - P), c(w / 2, f / 2 - P), c(w / 2, f / 2), c(-w / 2, f / 2), c(-w / 2, f / 2 - P), c(-y / 2, f / 2 - P), c(-y / 2, -f / 2 + P), c(-w / 2, -f / 2 + P)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return w && f && y && P ? { contorno: [c(-w / 2, -f / 2), c(w / 2, -f / 2), c(w / 2, -f / 2 + P), c(-w / 2 + y, -f / 2 + P), c(-w / 2 + y, f / 2 - P), c(w / 2, f / 2 - P), c(w / 2, f / 2), c(-w / 2, f / 2)] } : null;
    case "T":
      return w && f && y && P ? { contorno: [c(-y / 2, -f / 2), c(y / 2, -f / 2), c(y / 2, f / 2 - P), c(w / 2, f / 2 - P), c(w / 2, f / 2), c(-w / 2, f / 2), c(-w / 2, f / 2 - P), c(-y / 2, f / 2 - P)] } : null;
    case "L":
    case "2L":
      return w && f && y ? { contorno: [c(-w / 2, -f / 2), c(w / 2, -f / 2), c(w / 2, -f / 2 + y), c(-w / 2 + y, -f / 2 + y), c(-w / 2 + y, f / 2), c(-w / 2, f / 2)] } : null;
    default:
      return w && f ? { contorno: p(w, f) } : b ? { contorno: u(b) } : null;
  }
}
function _a(e, l, c) {
  if (!e || e <= 0 || !l || !c || l <= 0 || c <= 0) return null;
  const p = Math.sqrt(Math.sqrt(c / l)), u = Math.sqrt(e / p), w = e / u;
  return !isFinite(u) || !isFinite(w) || u <= 0 || w <= 0 ? null : { contorno: [[-u / 2, -w / 2], [u / 2, -w / 2], [u / 2, w / 2], [-u / 2, w / 2]] };
}
function ka(e) {
  const l = new En();
  e.contorno.forEach(([c, p], u) => u ? l.lineTo(c, p) : l.moveTo(c, p)), l.closePath();
  for (const c of e.huecos ?? []) {
    const p = new Qs();
    c.forEach(([u, w], f) => f ? p.lineTo(u, w) : p.moveTo(u, w)), p.closePath(), l.holes.push(p);
  }
  return l;
}
function Sa(e, l, c) {
  const p = new rt();
  p.name = "extrusion";
  const u = new So({ color: 8369151, transparent: true, opacity: 0.92, side: zt }), w = new So({ color: 12623968, transparent: true, opacity: 0.85, side: zt }), f = new So({ color: 11583173, transparent: true, opacity: 0.85, side: zt }), b = new rt();
  b.add(new vs(16777215, 0.55));
  const y = new to(16777215, 0.75);
  y.position.set(30, 25, 40);
  const P = new to(16777215, 0.35);
  P.position.set(-25, -20, 15), b.add(y, P);
  let E = 0;
  return te.derive(() => {
    var _a2, _b, _c, _d, _e;
    const v = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++E, on: v }, p.visible = v;
    for (const W of [...p.children]) W !== b && (p.remove(W), (_c = (_b = W.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (p.children.includes(b) || p.add(b), !v) return;
    const j = c.val ?? [], ue = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], ge = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, re = ge.sectionShapes ?? /* @__PURE__ */ new Map(), L = ge.thicknesses ?? /* @__PURE__ */ new Map();
    let G = "";
    try {
      ue.forEach((W, ce) => {
        var _a3, _b2, _c2;
        if (W.length === 2) {
          let pe = Ma(re.get(ce)), V = true;
          if (pe || (pe = _a((_a3 = ge.areas) == null ? void 0 : _a3.get(ce), (_b2 = ge.momentsOfInertiaY) == null ? void 0 : _b2.get(ce), (_c2 = ge.momentsOfInertiaZ) == null ? void 0 : _c2.get(ce)), V = false), !pe) return;
          const I = j[W[0]], N = j[W[1]];
          if (!I || !N) return;
          const F = Math.hypot(N[0] - I[0], N[1] - I[1], N[2] - I[2]);
          if (F < 1e-9) return;
          const C = new Os(ka(pe), { depth: F, bevelEnabled: false, curveSegments: 4 });
          C.applyMatrix4(new Vo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const R = new ct(C, V ? u : w);
          R.position.set(I[0], I[1], I[2]), R.rotation.setFromRotationMatrix(oo(I, N)), p.add(R);
          return;
        }
        if (W.length === 3 || W.length === 4) {
          const pe = L.get(ce);
          if (!pe || pe <= 0) return;
          const V = W.map((J) => j[J]).filter(Boolean);
          if (V.length < 3) return;
          const I = [V[1][0] - V[0][0], V[1][1] - V[0][1], V[1][2] - V[0][2]], N = [V[2][0] - V[0][0], V[2][1] - V[0][1], V[2][2] - V[0][2]], F = I[1] * N[2] - I[2] * N[1], C = I[2] * N[0] - I[0] * N[2], R = I[0] * N[1] - I[1] * N[0], X = Math.hypot(F, C, R);
          if (X < 1e-12) return;
          const $ = [F / X, C / X, R / X], ee = [], fe = (J) => V.map((me) => [me[0] + $[0] * J, me[1] + $[1] * J, me[2] + $[2] * J]), ae = fe(+pe / 2), se = fe(-pe / 2), B = (J, me, he) => ee.push(...J, ...me, ...he);
          for (const J of [ae, se]) B(J[0], J[1], J[2]), J.length === 4 && B(J[0], J[2], J[3]);
          for (let J = 0; J < V.length; J++) {
            const me = (J + 1) % V.length;
            B(ae[J], se[J], se[me]), B(ae[J], se[me], ae[me]);
          }
          const de = new Ce();
          de.setAttribute("position", new kt(ee, 3)), de.computeVertexNormals(), p.add(new ct(de, f));
        }
      });
    } catch (W) {
      G = String((W == null ? void 0 : W.message) ?? W);
    }
    globalThis.__extrusionDebug = { corridas: E, on: v, fallo: G, nElementos: ue.length, nFormas: re.size, nEspesores: L.size, mallas: p.children.length - 1 };
  }), p;
}
class Wn extends rt {
  constructor(l, c, p, u, w, f, b) {
    super();
    const y = new En().moveTo(0, 0).lineTo(0, f[1]).lineTo(p, f[1]).lineTo(p, 0).lineTo(0, 0), P = y.getPoints(), E = new Ce().setFromPoints(P);
    this.lines = new Pt(E, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const v = new eo(y), j = new ut({ color: f[1] > 0 ? 24435 : 11411474, side: zt });
    this.mesh = new ct(v, j), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Ct(`${w[1].toFixed(4)}`), this.normalizedResult = f, this.textPosition = Vn([l, c]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(u), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class fs extends rt {
  constructor(l, c, p, u, w, f, b) {
    super();
    const y = w[0] * p / (w[0] + w[1]), P = w[0] * w[1] > 0;
    if (this.text = new Ct(`${w[0].toFixed(4)}`), this.text2 = new Ct(`${(w[1] * -1).toFixed(4)}`), this.normalizedResult = f, this.textPosition = Ao(l, c), this.text2Position = Ao(c, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(u), this.text2.rotation.setFromRotationMatrix(u), this.add(this.text, this.text2), P) {
      const E = new En().moveTo(0, 0).lineTo(0, f[0]).lineTo(y, 0).lineTo(0, 0), v = new En().moveTo(y, 0).lineTo(p, -f[1]).lineTo(p, 0).lineTo(y, 0), j = E.getPoints(), ue = v.getPoints(), ge = new Ce().setFromPoints(j), re = new Ce().setFromPoints(ue), L = new ht({ color: dn().resultOutline });
      this.lines = new Pt(ge, L), this.lines2 = new Pt(re, L), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), this.lines2.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), b && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const G = new eo(E), W = new eo(v), ce = new ut({ color: f[0] > 0 ? 24435 : 11411474, side: zt }), pe = new ut({ color: -f[1] > 0 ? 24435 : 11411474, side: zt });
      this.mesh = new ct(G, ce), this.mesh2 = new ct(W, pe), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), this.mesh2.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), b && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const E = new En().moveTo(0, 0).lineTo(0, f[0]).lineTo(p, -f[1]).lineTo(p, 0).lineTo(0, 0), v = E.getPoints(), j = new Ce().setFromPoints(v);
      this.lines = new Pt(j, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ue = new eo(E), ge = new ut({ color: f[0] > 0 ? 24435 : 11411474, side: zt });
      this.mesh = new ct(ue, ge), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(l) {
    var _a2, _b;
    this.lines.scale.set(1, l * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text2.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * l), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var Ps = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(Ps || {});
function Pa(e, l, c, p) {
  const u = () => {
    const b = c.rawVal;
    if (!(b == null ? void 0 : b.length)) return 0.05 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
    for (const v of b) for (let j = 0; j < 3; j++) v[j] < y[j] && (y[j] = v[j]), v[j] > P[j] && (P[j] = v[j]);
    const E = Math.hypot(P[0] - y[0], P[1] - y[1], P[2] - y[2]);
    return !isFinite(E) || E <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * E;
  }, w = new rt(), f = { normals: Wn, shearsY: Wn, shearsZ: Wn, torsions: Wn, bendingsY: fs, bendingsZ: fs };
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, c.val, l.frameResults.val == "none") return;
    w.children.forEach((y) => y.dispose()), w.clear();
    const b = Ps[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[b]) == null ? void 0 : _b.forEach((y, P) => {
      var _a3, _b2;
      const E = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[P]) ?? [0, 1], v = c.rawVal[E[0]], j = c.rawVal[E[1]];
      if (!v || !j) return;
      const ue = new k(...j).distanceTo(new k(...v)), ge = Ca((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[b]), re = y == null ? void 0 : y.map((W) => W / (ge === 0 ? 1 : ge)), L = oo(v, j), G = new f[b](v, j, ue, L, y ?? [0, 0], re ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(b));
      G.updateScale(u() * p.rawVal), w.add(G);
    });
  }), te.derive(() => {
    if (p.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const b = u();
    w.children.forEach((y) => y.updateScale(b * p.rawVal));
  }), te.derive(() => {
    w.visible = l.frameResults.val != "none";
  }), w;
}
function Ca(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((c) => {
    const p = Math.max(...(c ?? [0, 0]).map((u) => Math.abs(u)));
    p > l && (l = p);
  }), l;
}
class za extends rt {
  constructor(l, c, p) {
    super();
    const u = c === $o.reactions;
    p[0] && (this.xText1 = new Ct(`${u ? "Fx" : "Dx"}: ` + p[0].toFixed(4))), p[3] && (this.xText2 = new Ct(`${u ? "Mx" : "Rx"}: ` + p[3].toFixed(4))), p[1] && (this.yText1 = new Ct(`${u ? "Fy" : "Dy"}: ` + p[1].toFixed(4))), p[4] && (this.yText2 = new Ct(`${u ? "My" : "Ry"}: ` + p[4].toFixed(4))), p[2] && (this.zText1 = new Ct(`${u ? "Fz" : "Dz"}: ` + p[2].toFixed(4))), p[5] && (this.zText2 = new Ct(`${u ? "Mz" : "Rz"}: ` + p[5].toFixed(4))), (p[0] || p[3]) && (this.xArrow = new cn(new k(1, 0, 0), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[1] || p[4]) && (this.yArrow = new cn(new k(0, 1, 0), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[2] || p[5]) && (this.zArrow = new cn(new k(0, 0, 1), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(l) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(l, l, l), (_b = this.yArrow) == null ? void 0 : _b.scale.set(l, l, l), (_c = this.zArrow) == null ? void 0 : _c.scale.set(l, l, l), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * l, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * l, 0, 0.5 * l), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * l, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * l, 0.5 * l), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * l), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * l + 0.5 * l), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * l), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * l), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * l), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * l), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * l), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var $o = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))($o || {});
function Fa(e, l, c, p) {
  const u = new rt();
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    u.children.forEach((b) => b.dispose()), u.clear();
    const w = $o[l.nodeResults.rawVal], f = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[w]) == null ? void 0 : _b.forEach((b, y) => {
      const P = new za(c.rawVal[y], w, b ?? [0, 0, 0, 0, 0, 0]);
      P.updateScale(f * p.rawVal), u.add(P);
    });
  }), te.derive(() => {
    if (p.val, l.nodeResults.rawVal == "none") return;
    const w = 0.05 * l.gridSize.val;
    u.children.forEach((f) => f.updateScale(w * p.rawVal));
  }), te.derive(() => {
    u.visible = l.nodeResults.val != "none";
  }), u;
}
function Aa({ drawingObj: e, gridObj: l, scene: c, getActiveCamera: p, controls: u, gridSize: w, derivedDisplayScale: f, rendererElm: b, viewerRender: y }) {
  const P = new js(), E = new ea(), v = (t) => {
    const o = b.getBoundingClientRect(), s = t.clientX - o.left, n = t.clientY - o.top, a = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const h = a / 2;
      if (s >= h) return E.x = (s - h) / h * 2 - 1, E.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? p();
      E.x = s / h * 2 - 1;
    } else E.x = s / a * 2 - 1;
    return E.y = -(n / i) * 2 + 1, p();
  }, j = new ct(new en(1e4, 1e4), new ut({ side: zt, transparent: true, opacity: 0, depthWrite: false }));
  j.visible = true, j.frustumCulled = false, c.add(j);
  const ue = (t, o, s) => {
    const n = new ct(new en(1e4, 1e4), new ut({ side: zt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, s), n.visible = false, n.frustumCulled = false, c.add(n), n;
  }, ge = ue(Math.PI / 2, 0, 0), re = ue(0, Math.PI / 2, 0);
  let L = false;
  const G = () => {
    if (L) return P.intersectObjects([j], false);
    if (ge.visible = !!window.__hekatanGridPlaneXZ, re.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Te.visible) {
      const s = P.intersectObjects([Te, qe, Ee], false);
      if (s.length > 0) return s;
    }
    const o = [j];
    return ge.visible && o.push(ge), re.visible && o.push(re), Ot.visible && un.length > 0 && o.push(...un), P.intersectObjects(o, false);
  }, W = new Qn(new Ce(), new jn()), ce = new Qn(new Ce(), new jn({ color: "gray", sizeAttenuation: false, size: 6 })), pe = new Qn(new Ce(), new jn({ color: "orange", sizeAttenuation: false, size: 5 }));
  c.add(pe);
  const V = document.createElement("input");
  V.id = "hk-rubber-label", V.type = "text", V.spellcheck = false, V.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, V.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(V);
  let I = null, N = null, F = false;
  const C = new k(), R = (t, o, s, n, a, i) => {
    const r = n - t, h = a - o, m = i - s, x = Math.hypot(r, h, m);
    if (x < 0.01) {
      V.style.display = "none";
      return;
    }
    I = [t, o, s], N = [r / x, h / x, m / x], C.set((t + n) / 2, (o + a) / 2, (s + i) / 2), C.project(p());
    const M = b.getBoundingClientRect(), _ = M.left + (C.x * 0.5 + 0.5) * M.width, d = M.top + (-C.y * 0.5 + 0.5) * M.height;
    if (V.style.left = _ + "px", V.style.top = d + "px", V.style.display = "block", !F) {
      if (V.value = `${x.toFixed(2)} m`, document.activeElement !== V) {
        const T = document.activeElement;
        T && (T.tagName === "INPUT" || T.tagName === "TEXTAREA") && T !== V || V.focus({ preventScroll: true });
      }
      try {
        V.select();
      } catch {
      }
    }
  }, X = () => {
    V.style.display = "none", I = null, N = null, F = false, document.activeElement === V && V.blur();
  }, $ = (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      rn = t, le(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), V.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ye.length === 1) {
      const M = Ye[0];
      Ye = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, M[0], M[1], M[2], t), le(`\u2713 C\xEDrculo r=${t} m en (${M[0].toFixed(2)}, ${M[1].toFixed(2)}, ${M[2].toFixed(2)}).`);
      try {
        (_f = window.__hekatanRebuild) == null ? void 0 : _f.call(window);
      } catch {
      }
      try {
        (_g = window.__hekatanCadRefreshPrompt) == null ? void 0 : _g.call(window);
      } catch {
      }
      return;
    }
    if (o === "col" || o === "wall" || o === "extp" || o === "extl") {
      gt = t, le(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), V.blur();
      return;
    }
    if (!I || !N || !e.polylines) return;
    let s = N[0], n = N[1], a = N[2];
    ot === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : ot === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : ot === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const i = I[0] + s * t, r = I[1] + n * t, h = I[2] + a * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, h]];
    const m = e.polylines.rawVal, x = m.length ? m[m.length - 1] : [];
    e.polylines.val = [...m.slice(0, -1), [...x, e.points.rawVal.length - 1]], V.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    y();
  }, ee = (t) => {
    let o = t.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const s = o.startsWith("@");
    if (s && (o = o.slice(1)), o.includes("<")) {
      const a = o.split("<").map((i) => parseFloat(i.trim()));
      if (a.some(isNaN)) return null;
      if (a.length === 2) {
        const [i, r] = a;
        return s ? { kind: "relPolar", L: i, ang: r } : { kind: "absPolar", L: i, ang: r };
      }
      if (a.length === 3 && s) {
        const [i, r, h] = a;
        return { kind: "relSpherical", L: i, az: r, el: h };
      }
      return null;
    }
    if (o.includes(",")) {
      const a = o.split(",").map((m) => parseFloat(m.trim()));
      if (a.some(isNaN)) return null;
      const [i, r, h = 0] = a;
      return s ? { kind: "relCart", dx: i, dy: r, dz: h } : { kind: "absCart", x: i, y: r, z: h };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, fe = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return I ? [I[0] + t.dx, I[1] + t.dy, I[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!I) return null;
      const o = t.ang * Math.PI / 180;
      return [I[0] + t.L * Math.cos(o), I[1] + t.L * Math.sin(o), I[2]];
    }
    if (t.kind === "relSpherical") {
      if (!I) return null;
      const o = t.az * Math.PI / 180, s = t.el * Math.PI / 180, n = t.L * Math.cos(s);
      return [I[0] + n * Math.cos(o), I[1] + n * Math.sin(o), I[2] + t.L * Math.sin(s)];
    }
    return null;
  }, ae = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...s, e.points.rawVal.length - 1]], I = t, V.blur();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (t) => {
    var _a2;
    const o = ee(t);
    if (!o) return false;
    if (o.kind === "length") return $(o.L), true;
    const s = fe(o);
    if (!s) return false;
    Qo(new k(s[0], s[1], s[2]), null), I = s, V.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, V.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const s = ee(V.value);
      if (!s) return;
      if (F = false, s.kind === "length") $(s.L), le(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = fe(s);
        if (!n) return;
        ae(n);
        const a = s.kind;
        le(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), F = false, V.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!F && V.style.display === "block") try {
          V.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && (F = true);
  }), window.addEventListener("keydown", (t) => {
    if (!I || !N || document.activeElement === V) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (V.value = t.key, V.focus(), V.setSelectionRange(1, 1), t.preventDefault());
  });
  const se = document.createElement("div");
  se.id = "hk-coord-readout", se.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", se.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(se);
  const B = document.createElement("div");
  B.id = "hk-coord-fixed", B.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", B.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(B);
  const de = new Pt(new Ce().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), new Fn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  de.frustumCulled = false, de.visible = false, de.name = "rubberBand", c.add(de), window.__hekatanRubberBand = de;
  const J = new Pt(new Ce(), new ht({ color: 2282478, transparent: true, opacity: 0.9 }));
  J.frustumCulled = false, J.visible = false, c.add(J);
  let me = [];
  const he = new rt(), Ve = new ct(new en(1, 1), new ut({ color: 2282478, transparent: true, opacity: 0.08, side: zt, depthWrite: false })), be = new Wt(new as(new en(1, 1)), new ht({ color: 2282478, transparent: true, opacity: 0.85 })), Be = new Wt(new Ce(), new ht({ color: 2282478, transparent: true, opacity: 0.3 })), We = (t, o) => {
    const s = [], n = Math.ceil(t / o);
    for (let a = -n; a <= n; a++) {
      const i = a * o;
      s.push(-t, i, 0, t, i, 0), s.push(i, -t, 0, i, t, 0);
    }
    Be.geometry.dispose(), Be.geometry = new Ce(), Be.geometry.setAttribute("position", new kt(s, 3));
  };
  he.add(Ve, be, Be), he.visible = false, he.frustumCulled = false, c.add(he);
  const at = new rt();
  at.frustumCulled = false, at.visible = false, c.add(at);
  const ft = (t) => {
    const o = new Ce().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), s = new Fn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Pt(o, s);
  }, S = ft(16711680), D = ft(65280), Q = ft(35071);
  at.add(S, D, Q);
  const K = [], ve = (t) => t.traverse((o) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = o.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), oe = ft(16761856);
  oe.material.dashSize = 0.28, oe.material.gapSize = 0.16, oe.material.opacity = 0.9, oe.frustumCulled = false, oe.visible = false, oe.renderOrder = 98, c.add(oe);
  const Me = (t) => {
    const o = new Ce().setFromPoints([new k(0, 0, 0), new k(0, 0, 0), new k(0, 0, 0), new k(0, 0, 0)]), s = new ht({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new gs(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, _e = Me(3462041), Ne = Me(16724804), De = Me(6333946), we = new rt();
  we.frustumCulled = false, we.visible = false, c.add(we), we.add(_e, Ne, De);
  const Se = (t) => {
    const o = new en(1, 1), s = new ut({ color: t, transparent: true, opacity: 0.06, side: zt, depthWrite: false }), n = new ct(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Te = Se(3462041), qe = Se(16724804), Ee = Se(6333946);
  we.add(Te, qe, Ee);
  const nt = (t, o, s, n) => {
    t.scale.set(2 * n, 2 * n, 1), s === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : s === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, Ge = document.createElement("div");
  Ge.id = "hk-refplane-badge", Ge.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ge), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, we.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      je(_e, i, "xy", r), je(Ne, i, "xz", r), je(De, i, "yz", r), nt(Te, i, "xy", r), nt(qe, i, "xz", r), nt(Ee, i, "yz", r), Te.material.opacity = 0.05, qe.material.opacity = 0.05, Ee.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    y();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !we.visible) {
      y();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    je(_e, i, "xy", t), je(Ne, i, "xz", t), je(De, i, "yz", t), nt(Te, i, "xy", t), nt(qe, i, "xz", t), nt(Ee, i, "yz", t), y();
  };
  const Nt = (t) => {
    if (Te.material.opacity = t === "xy" ? 0.09 : 0.025, qe.material.opacity = t === "xz" ? 0.09 : 0.025, Ee.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      Ge.style.background = a.bg, Ge.style.color = a.text, Ge.textContent = `\u25A6 Plano ${t.toUpperCase()}`, Ge.style.display = "block";
    } else Ge.style.display = "none";
  }, je = (t, o, s, n) => {
    let a;
    s === "xy" ? a = [new k(o[0] - n, o[1] - n, o[2]), new k(o[0] + n, o[1] - n, o[2]), new k(o[0] + n, o[1] + n, o[2]), new k(o[0] - n, o[1] + n, o[2]), new k(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new k(o[0] - n, o[1], o[2] - n), new k(o[0] + n, o[1], o[2] - n), new k(o[0] + n, o[1], o[2] + n), new k(o[0] - n, o[1], o[2] + n), new k(o[0] - n, o[1], o[2] - n)] : a = [new k(o[0], o[1] - n, o[2] - n), new k(o[0], o[1] + n, o[2] - n), new k(o[0], o[1] + n, o[2] + n), new k(o[0], o[1] - n, o[2] + n), new k(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(a);
  };
  let ot = null;
  window.__hekatanAxisLock = () => ot;
  let Mt = null, Ue = null;
  const ze = document.createElement("div");
  ze.id = "hk-axis-lock-badge", ze.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(ze);
  const Le = () => {
    if (!ot) {
      ze.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    ze.style.background = "rgba(15,23,42,0.92)", ze.style.color = t[ot], ze.style.border = `1.5px solid ${t[ot]}`, ze.textContent = `\u{1F512} LOCK ${ot.toUpperCase()}`, ze.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== V) return;
    const s = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && me.length >= 3) {
      const a = pn();
      le(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") ot = ot === s ? null : s, Le(), t.preventDefault();
    else if (t.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Ho(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Nn(), le(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (at.visible = false), le(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a2;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const t = window.__hekatanOrthoMode;
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = t ? "block" : "none";
      let s = document.getElementById("hk-ortho-badge");
      s || (s = document.createElement("div"), s.id = "hk-ortho-badge", s.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", s.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(s)), s.style.display = t ? "block" : "none";
    }
  };
  const Ke = new k(), Fe = new k(), dt = new k(), mt = (t) => {
    if (!ot) return null;
    const o = t[0], s = t[1], n = t[2];
    return ot === "x" ? (Ke.set(o - 1e4, s, n), Fe.set(o + 1e4, s, n)) : ot === "y" ? (Ke.set(o, s - 1e4, n), Fe.set(o, s + 1e4, n)) : (Ke.set(o, s, n - 1e4), Fe.set(o, s, n + 1e4)), P.ray.distanceSqToSegment(Ke, Fe, null, dt), dt;
  };
  window.__hekatanProjectOnAxis = mt;
  const it = new Pt(new Ce().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), new ht({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  it.renderOrder = 998, it.frustumCulled = false, it.visible = false, c.add(it);
  let Ze = -1, Qe = -1, yt = -1;
  const Ae = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ae;
  const Ft = new Pt(new Ce().setFromPoints([new k(), new k()]), new ht({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Ft.renderOrder = 997, Ft.frustumCulled = false, Ft.visible = false, c.add(Ft);
  const bt = new ct(new xn(0.02, 12, 12), new ut({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  bt.renderOrder = 998, bt.visible = false, c.add(bt);
  const Rt = (t) => {
    const o = p();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(t);
    return Math.max(0.05, s / 10);
  }, At = () => {
    bt.visible && bt.scale.setScalar(Rt(bt.position));
  }, Tt = new rt();
  Tt.frustumCulled = false, c.add(Tt);
  const nn = 2282478;
  let Ut = null;
  const gn = (t, o, s, n) => {
    if (!e.points) return -1;
    const a = e.points.rawVal;
    let i = -1, r = n;
    for (let h = 0; h < a.length; h++) {
      const m = a[h];
      if (!m) continue;
      const x = Math.hypot(t - m[0], o - m[1], s - m[2]);
      x < r && (r = x, i = h);
    }
    return i;
  }, Et = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; Tt.children.length; ) {
      const r = Tt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of Ae) {
      const [h, ...m] = r.split(":");
      if (h === "pt") {
        const x = t[+m[0]];
        if (!x) continue;
        const M = new ct(new xn(0.025, 12, 12), new ut({ color: nn, transparent: true, opacity: 0.9, depthTest: false }));
        M.position.set(x[0], x[1], x[2]), M.renderOrder = 999, M.__isSelectionPt = true, Tt.add(M);
      } else if (h === "seg") {
        const x = o[+m[0]], M = t[x == null ? void 0 : x[+m[1]]], _ = t[x == null ? void 0 : x[+m[1] + 1]];
        if (!M || !_) continue;
        const d = new Ce().setFromPoints([new k(M[0], M[1], M[2]), new k(_[0], _[1], _[2])]), T = new Pt(d, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        T.renderOrder = 999, Tt.add(T);
      } else if (h === "poly") {
        const M = o[+m[0]].map((T) => {
          const ne = t[T];
          return ne ? new k(ne[0], ne[1], ne[2]) : null;
        }).filter(Boolean);
        if (M.length < 2) continue;
        const _ = new Ce().setFromPoints(M), d = new Pt(_, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        d.renderOrder = 999, Tt.add(d);
      } else if (h === "aux") {
        const x = n[+m[0]];
        if (!x || x.length !== 6) continue;
        const M = new Ce().setFromPoints([new k(x[0], x[1], x[2]), new k(x[3], x[4], x[5])]), _ = new Pt(M, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        _.renderOrder = 999, Tt.add(_);
      }
    }
    const a = window.__hekatanUpdateSelectionPtScale;
    a && a();
    const i = window.__hekatanRefreshPropsPane;
    i && i();
    try {
      (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
    } catch {
    }
    y();
  };
  window.__hekatanRefreshSelection = Et, window.__hekatanClearSelection = () => {
    Ae.clear(), Et();
  };
  const on = (t, o, s, n, a, i, r, h, m) => {
    const x = r - n, M = h - a, _ = m - i, d = x * x + M * M + _ * _;
    if (d < 1e-12) return Math.hypot(t - n, o - a, s - i);
    let T = ((t - n) * x + (o - a) * M + (s - i) * _) / d;
    T = Math.max(0, Math.min(1, T));
    const ne = n + T * x, q = a + T * M, Y = i + T * _;
    return Math.hypot(t - ne, o - q, s - Y);
  }, vn = (t, o, s, n) => {
    if (!e.polylines) return null;
    const a = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, h = -1, m = n;
    for (let x = 0; x < a.length; x++) {
      const M = a[x];
      for (let _ = 0; _ < M.length - 1; _++) {
        const d = i[M[_]], T = i[M[_ + 1]];
        if (!d || !T) continue;
        const ne = on(t, o, s, d[0], d[1], d[2], T[0], T[1], T[2]);
        ne < m && (m = ne, r = x, h = _);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: h, dist: m } : null;
  }, $n = (t, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let r = -1, h = n;
    for (let m = 0; m < i.length; m++) {
      const x = i[m];
      if (!x || x.length !== 6) continue;
      const M = on(t, o, s, x[0], x[1], x[2], x[3], x[4], x[5]);
      M < h && (h = M, r = m);
    }
    return r;
  }, so = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      it.visible = false;
      return;
    }
    it.geometry.setFromPoints([new k(n[0], n[1], n[2]), new k(n[3], n[4], n[5])]), it.visible = true;
  }, ao = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!s || s.length < 2) {
      it.visible = false;
      return;
    }
    const a = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (a || o < 0 || o >= s.length - 1) for (const r of s) {
      const h = n[r];
      h && i.push(new k(h[0], h[1], h[2]));
    }
    else {
      const r = n[s[o]], h = n[s[o + 1]];
      r && i.push(new k(r[0], r[1], r[2])), h && i.push(new k(h[0], h[1], h[2]));
    }
    it.geometry.setFromPoints(i), it.visible = true;
  }, sn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const s = o.filter((m, x) => x !== t), n = /* @__PURE__ */ new Set();
    for (const m of s) for (const x of m) n.add(x);
    const a = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let m = 0; m < a.length; m++) n.has(m) && (i.set(m, r.length), r.push(a[m]));
    const h = s.map((m) => m.map((x) => i.get(x)).filter((x) => x !== void 0));
    e.points.val = r, e.polylines.val = h, e.areas && (e.areas.val = e.areas.rawVal.filter((m) => m !== t).map((m) => m > t ? m - 1 : m)), it.visible = false, Ze = -1, Qe = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, Ln = (t, o) => {
    var _a2, _b, _c;
    if (!e.polylines) return;
    const s = e.polylines.rawVal;
    if (t < 0 || t >= s.length) return;
    if (((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false) {
      sn(t);
      return;
    }
    const a = s[t];
    if (o < 0 || o >= a.length - 1) return;
    if (a.length === 2) {
      sn(t);
      return;
    }
    let i;
    o === 0 ? i = [a.slice(1)] : o === a.length - 2 ? i = [a.slice(0, -1)] : i = [a.slice(0, o + 1), a.slice(o + 1)];
    const r = [...s.slice(0, t), ...i, ...s.slice(t + 1)], h = /* @__PURE__ */ new Set();
    for (const d of r) for (const T of d) h.add(T);
    const m = e.points.rawVal, x = /* @__PURE__ */ new Map(), M = [];
    for (let d = 0; d < m.length; d++) h.has(d) && (x.set(d, M.length), M.push(m[d]));
    const _ = r.map((d) => d.map((T) => x.get(T)).filter((T) => T !== void 0));
    if (e.points.val = M, e.polylines.val = _, e.areas) {
      const d = i.length - 1;
      e.areas.val = e.areas.rawVal.map((T) => T > t ? T + d : T);
    }
    it.visible = false, Ze = -1, Qe = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  W.geometry.setAttribute("position", new kt(e.points.rawVal.flat(), 3)), W.geometry.computeBoundingSphere(), W.frustumCulled = false, ce.frustumCulled = false, c.add(ce), j.position.set(0, 0, 0), j.rotateX(Math.PI / 2), j.geometry.rotateX(Math.PI / 2), j.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, s) => {
    if (e.points.val = [...e.points.rawVal, [t, o, s]], e.polylines) {
      const n = e.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
      e.polylines.val = [...n.slice(0, -1), [...a, e.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a2;
    if (!e.polylines) return;
    const t = e.polylines.rawVal;
    ((_a2 = t[t.length - 1]) == null ? void 0 : _a2.length) !== 0 && (e.polylines.val = [...t, []]);
  };
  const an = [];
  window.__hekatanCirculos = an;
  let In = [], Rn = "";
  const bn = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], s = `${t.length}|${o.length}|${o.reduce((a, i) => a + i.length, 0)}`;
    if (s === Rn) return In;
    Rn = s;
    const n = [];
    for (const a of o) {
      const i = a.length;
      if (i < 6 || a[0] !== a[i - 1]) continue;
      const r = a.slice(0, i - 1).map((M) => t[M]).filter(Boolean);
      if (r.length < 5) continue;
      const h = [0, 1, 2].map((M) => r.reduce((_, d) => _ + d[M], 0) / r.length), m = r.map((M) => Math.hypot(M[0] - h[0], M[1] - h[1], M[2] - h[2])), x = m.reduce((M, _) => M + _, 0) / m.length;
      x < 1e-9 || m.some((M) => Math.abs(M - x) > 5e-3 * x) || n.push({ c: h, r: x });
    }
    return In = n;
  };
  window.__hekatanCentrosDeducidos = bn, window.__hekatanDrawCircle = (t, o, s, n, a = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(a)), h = e.points.rawVal.length, m = [];
    for (let x = 0; x < r; x++) {
      const M = 2 * Math.PI * x / r, _ = n * Math.cos(M), d = n * Math.sin(M);
      let T;
      i === "xy" ? T = [t + _, o + d, s] : i === "xz" ? T = [t + _, o, s + d] : T = [t, o + _, s + d], m.push(T);
    }
    if (e.points.val = [...e.points.rawVal, ...m], an.push({ c: [t, o, s], r: n }), e.polylines) {
      const x = [...m.map((_, d) => h + d), h], M = e.polylines.rawVal;
      ((_a2 = M[M.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...M, x, []] : e.polylines.val = [...M.slice(0, -1), x, []];
    }
  }, window.__hekatanDrawArc = (t, o, s, n = window.__hekatanArcSegs ?? 12) => {
    const a = Math.max(4, Math.round(n)), i = new k(...t), r = new k(...o), h = new k(...s), m = new k().subVectors(r, i), x = new k().subVectors(h, i), M = new k().crossVectors(m, x).normalize(), _ = new k().addVectors(i, r).multiplyScalar(0.5), d = new k().addVectors(r, h).multiplyScalar(0.5), T = new k().crossVectors(m, M).normalize(), ne = new k().crossVectors(new k().subVectors(h, r), M).normalize(), q = new k().subVectors(d, _), Y = T.x * ne.y - T.y * ne.x;
    let g;
    if (Math.abs(Y) > 1e-9) {
      const xe = (q.x * ne.y - q.y * ne.x) / Y;
      g = new k().addVectors(_, T.clone().multiplyScalar(xe));
    } else g = _.clone();
    const z = i.distanceTo(g), A = new k().subVectors(i, g), Z = new k().subVectors(h, g), H = Math.acos(Math.max(-1, Math.min(1, A.dot(Z) / (z * z)))), U = e.points.rawVal.length, O = [], ye = M.clone();
    for (let xe = 0; xe <= a; xe++) {
      const Pe = xe / a, Je = H * Pe, Ie = new Gn().setFromAxisAngle(ye, Je), st = A.clone().applyQuaternion(Ie).add(g);
      O.push([st.x, st.y, st.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...O], an.push({ c: [g.x, g.y, g.z], r: z }), e.polylines) {
      const xe = O.map((Je, Ie) => U + Ie), Pe = e.polylines.rawVal;
      e.polylines.val = [...Pe.slice(0, -1), xe, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, s = 1, n = 6, a = 6) => {
    const i = Math.min(t[0], o[0]), r = Math.max(t[0], o[0]), h = Math.min(t[1], o[1]), m = Math.max(t[1], o[1]), x = (t[2] + o[2]) / 2, M = r - i, _ = m - h, d = Math.min(s, M / 2 - 0.01, _ / 2 - 0.01);
    if (d <= 0) return;
    const T = e.points.rawVal.length, ne = [], q = [], Y = (g, z) => {
      ne.push([g, z, x]), q.push(T + ne.length - 1);
    };
    for (let g = 0; g <= a; g++) Y(i + d + (M - 2 * d) * g / a, h);
    for (let g = 1; g <= n; g++) {
      const z = -Math.PI / 2 + Math.PI / 2 * g / n;
      Y(r - d + d * Math.cos(z), h + d + d * Math.sin(z));
    }
    for (let g = 1; g <= a; g++) Y(r, h + d + (_ - 2 * d) * g / a);
    for (let g = 1; g <= n; g++) {
      const z = 0 + Math.PI / 2 * g / n;
      Y(r - d + d * Math.cos(z), m - d + d * Math.sin(z));
    }
    for (let g = 1; g <= a; g++) Y(r - d - (M - 2 * d) * g / a, m);
    for (let g = 1; g <= n; g++) {
      const z = Math.PI / 2 + Math.PI / 2 * g / n;
      Y(i + d + d * Math.cos(z), m - d + d * Math.sin(z));
    }
    for (let g = 1; g <= a; g++) Y(i, m - d - (_ - 2 * d) * g / a);
    for (let g = 1; g <= n; g++) {
      const z = Math.PI + Math.PI / 2 * g / n;
      Y(i + d + d * Math.cos(z), h + d + d * Math.sin(z));
    }
    if (q.push(T), e.points.val = [...e.points.rawVal, ...ne], e.polylines) {
      const g = e.polylines.rawVal;
      e.polylines.val = [...g.slice(0, -1), q, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], r = o[0], h = o[1], m = o[2];
    let x;
    if (Math.abs(i - m) < 1e-6 ? x = [[n, a, i], [r, a, i], [r, h, i], [n, h, i]] : Math.abs(a - h) < 1e-6 ? x = [[n, a, i], [r, a, i], [r, a, m], [n, a, m]] : x = [[n, a, i], [n, h, i], [n, h, m], [n, a, m]], e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const M = [s, s + 1, s + 2, s + 3, s], _ = e.polylines.rawVal;
      e.polylines.val = [..._.slice(0, -1), M, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], r = o[0], h = o[1], m = o[2];
    let x;
    if (L && e.gridTarget) {
      const M = e.gridTarget.rawVal, _ = new An(...M.rotation), d = new k(1, 0, 0).applyEuler(_), T = new k(0, 1, 0).applyEuler(_), ne = new k(...M.position), q = new k(n, a, i), Y = new k(r, h, m), g = q.clone().sub(ne).dot(d), z = q.clone().sub(ne).dot(T), A = Y.clone().sub(ne).dot(d), Z = Y.clone().sub(ne).dot(T), H = (U, O) => ne.clone().addScaledVector(d, U).addScaledVector(T, O).toArray();
      x = [H(g, z), H(A, z), H(A, Z), H(g, Z)];
    } else Math.abs(i - m) < 1e-6 ? x = [[n, a, i], [r, a, i], [r, h, i], [n, h, i]] : Math.abs(a - h) < 1e-6 ? x = [[n, a, i], [r, a, i], [r, a, m], [n, a, m]] : x = [[n, a, i], [n, h, i], [n, h, m], [n, a, m]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const M = e.polylines.rawVal, _ = M.length - 1, d = [s, s + 1, s + 2, s + 3, s];
      e.polylines.val = [...M.slice(0, -1), d, []], e.areas && (e.areas.val = [...e.areas.rawVal, _]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y();
  }, window.__hekatanMeshPolyArea = (t, o) => {
    var _a2;
    const s = t.length;
    if (s < 3) return 0;
    let n = 0, a = 0, i = 0;
    for (let ke = 0; ke < s; ke++) {
      const Re = t[ke], Oe = t[(ke + 1) % s];
      n += (Re[1] - Oe[1]) * (Re[2] + Oe[2]), a += (Re[2] - Oe[2]) * (Re[0] + Oe[0]), i += (Re[0] - Oe[0]) * (Re[1] + Oe[1]);
    }
    const r = Math.hypot(n, a, i) || 1;
    n /= r, a /= r, i /= r;
    let h = t[1][0] - t[0][0], m = t[1][1] - t[0][1], x = t[1][2] - t[0][2];
    const M = Math.hypot(h, m, x) || 1;
    h /= M, m /= M, x /= M;
    let _ = a * x - i * m, d = i * h - n * x, T = n * m - a * h;
    const ne = Math.hypot(_, d, T) || 1;
    _ /= ne, d /= ne, T /= ne;
    const q = t[0], Y = (ke) => [(ke[0] - q[0]) * h + (ke[1] - q[1]) * m + (ke[2] - q[2]) * x, (ke[0] - q[0]) * _ + (ke[1] - q[1]) * d + (ke[2] - q[2]) * T], g = (ke, Re) => [q[0] + ke * h + Re * _, q[1] + ke * m + Re * d, q[2] + ke * x + Re * T], z = t.map(Y);
    let A = 1 / 0, Z = -1 / 0, H = 1 / 0, U = -1 / 0;
    for (const [ke, Re] of z) ke < A && (A = ke), ke > Z && (Z = ke), Re < H && (H = Re), Re > U && (U = Re);
    const O = Z - A, ye = U - H;
    if (O < 1e-6 || ye < 1e-6) return 0;
    let xe = o && o > 0 ? o : 0.5;
    for (; O / xe * (ye / xe) > 2500; ) xe *= 2;
    xe = Math.min(xe, Math.min(O, ye));
    const Pe = (ke, Re) => {
      let Oe = false;
      for (let Lt = 0, Xt = z.length - 1; Lt < z.length; Xt = Lt++) {
        const [It, Qt] = z[Lt], [bo, Un] = z[Xt];
        Qt > Re != Un > Re && ke < (bo - It) * (Re - Qt) / (Un - Qt) + It && (Oe = !Oe);
      }
      return Oe;
    }, Je = Math.max(1, Math.round(O / xe)), Ie = Math.max(1, Math.round(ye / xe)), st = O / Je, et = ye / Ie, lt = /* @__PURE__ */ new Map(), He = [], $e = e.points.rawVal.length, tt = (ke, Re) => {
      const Oe = ke + "," + Re, Lt = lt.get(Oe);
      if (Lt !== void 0) return Lt;
      const Xt = $e + He.length;
      return He.push(g(A + ke * st, H + Re * et)), lt.set(Oe, Xt), Xt;
    }, Xe = [];
    for (let ke = 0; ke < Je; ke++) for (let Re = 0; Re < Ie; Re++) {
      if (!Pe(A + (ke + 0.5) * st, H + (Re + 0.5) * et)) continue;
      const Oe = tt(ke, Re), Lt = tt(ke + 1, Re), Xt = tt(ke + 1, Re + 1), It = tt(ke, Re + 1);
      Xe.push([Oe, Lt, Xt, It]);
    }
    if (!Xe.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...He], e.polylines && e.areas) {
      let ke = e.polylines.rawVal.slice();
      ke.length && ke[ke.length - 1].length === 0 && (ke = ke.slice(0, -1));
      const Re = [];
      for (const Oe of Xe) Re.push(ke.length), ke.push([Oe[0], Oe[1], Oe[2], Oe[3], Oe[0]]);
      ke.push([]), e.polylines.val = ke, e.areas.val = [...e.areas.rawVal, ...Re];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), Xe.length;
  };
  const pn = () => {
    if (me.length < 3) return me = [], J.visible = false, y(), 0;
    const t = window.__hekatanMeshPolyArea(me.slice());
    return me = [], J.visible = false, y(), t;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, s) => {
    var _a2;
    const n = new k(t[0], t[1], t[2]), a = new k(o[0], o[1], o[2]), i = new k(s[0], s[1], s[2]), r = new k().subVectors(a, n).cross(new k().subVectors(i, n));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const h = new Gn().setFromUnitVectors(new k(0, 0, 1), r), m = new An().setFromQuaternion(h);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [m.x, m.y, m.z] }), L = true;
    const x = new k().addVectors(n, a).add(i).multiplyScalar(1 / 3), M = Math.max(n.distanceTo(a), n.distanceTo(i), a.distanceTo(i)) * 2.2 + 4, _ = M / 2;
    Ve.geometry.dispose(), Ve.geometry = new en(M, M), be.geometry.dispose(), be.geometry = new as(new en(M, M)), We(_, 1), he.position.copy(x), he.quaternion.copy(h), he.scale.set(1, 1, 1), he.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), L = false, he.visible = false, y();
  };
  const Kt = new rt();
  Kt.visible = false, c.add(Kt), window.__hekatanShowAxes = (t, o, s = 12, n = 2) => {
    var _a2, _b;
    for (; Kt.children.length; ) {
      const M = Kt.children.pop();
      (_a2 = M.geometry) == null ? void 0 : _a2.dispose(), (_b = M.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const a = Math.min(...o) - n, i = Math.max(...o) + n, r = Math.min(...t) - n, h = Math.max(...t) + n, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", x = (M, _, d, T, ne) => {
      const q = document.createElement("canvas");
      q.width = 64, q.height = 32;
      const Y = q.getContext("2d");
      Y.fillStyle = ne, Y.font = "bold 22px sans-serif", Y.textAlign = "center", Y.fillText(M, 32, 26);
      const g = new is(q), z = new ls({ map: g, transparent: true }), A = new rs(z);
      return A.position.set(_, d, T), A.scale.set(1.2, 0.6, 1), A;
    };
    t.forEach((M, _) => {
      const d = _ < m.length ? m[_] : `X${_}`, T = new Ce().setFromPoints([new k(M, a, 0), new k(M, i, 0), new k(M, a, 0), new k(M, a, s)]), ne = new Fn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), q = new Wt(T, ne);
      q.computeLineDistances(), Kt.add(q), Kt.add(x(d, M, a - 0.5, 0, "#60a5fa")), Kt.add(x(d, M, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((M, _) => {
      const d = `${_ + 1}`, T = new Ce().setFromPoints([new k(r, M, 0), new k(h, M, 0), new k(r, M, 0), new k(r, M, s)]), ne = new Fn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), q = new Wt(T, ne);
      q.computeLineDistances(), Kt.add(q), Kt.add(x(d, r - 0.5, M, 0, "#fb7185")), Kt.add(x(d, h + 0.5, M, 0, "#fb7185"));
    }), Kt.visible = true, y();
  }, window.__hekatanHideAxes = () => {
    Kt.visible = false, y();
  };
  const Ot = new rt();
  Ot.visible = false, c.add(Ot);
  let un = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, s = 0, n = 0) => {
    var _a2, _b;
    for (; Ot.children.length; ) {
      const i = Ot.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    un.forEach((i) => {
      c.remove(i), i.geometry.dispose(), i.material.dispose();
    }), un = [];
    const a = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, r) => {
      const h = a[r % a.length], m = o / 2, x = [new k(s - m, n - m, i), new k(s + m, n - m, i), new k(s + m, n + m, i), new k(s - m, n + m, i), new k(s - m, n - m, i)], M = new Ce().setFromPoints(x), _ = new ht({ color: h, transparent: true, opacity: 0.55 });
      Ot.add(new Pt(M, _));
      const d = document.createElement("canvas");
      d.width = 128, d.height = 32;
      const T = d.getContext("2d");
      T.fillStyle = `#${h.toString(16).padStart(6, "0")}`, T.font = "bold 18px sans-serif", T.fillText(`Z = ${i} m`, 4, 22);
      const ne = new is(d), q = new ls({ map: ne, transparent: true }), Y = new rs(q);
      Y.position.set(s - m - 1.5, n - m - 1.5, i), Y.scale.set(2.5, 0.6, 1), Ot.add(Y);
      const g = new en(1e4, 1e4), z = new ut({ visible: false, side: zt }), A = new ct(g, z);
      A.position.set(0, 0, i), A.frustumCulled = false, A.userData = { refPlaneZ: i }, c.add(A), un.push(A);
    }), Ot.visible = true, y();
  }, window.__hekatanHideRefPlanes = () => {
    Ot.visible = false, un.forEach((t) => {
      t.visible = false;
    }), y();
  };
  const Mn = new rt();
  Mn.frustumCulled = false, c.add(Mn);
  const Cs = () => {
    var _a2, _b, _c, _d;
    for (; Mn.children.length; ) {
      const s = Mn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new Ce().setFromPoints([new k(s[0], s[1], s[2]), new k(s[3], s[4], s[5])]), a = new Fn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new Pt(n, a);
      i.computeLineDistances(), Mn.add(i);
    }
  };
  te.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, Cs(), y());
  });
  const fn = new rt();
  fn.frustumCulled = false, c.add(fn);
  const Lo = () => {
    var _a2, _b, _c, _d;
    for (; fn.children.length; ) {
      const s = fn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new ct(new xn(0.025, 12, 12), new ut({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(Rt(n.position)), fn.add(n);
    }
  };
  te.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Lo(), y());
  }), u.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(Rt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Lo;
  const xt = new rt(), zs = new ct(new xn(0.01, 12, 12), new ut({ color: 16724804, transparent: true, opacity: 0.95 })), Fs = new ct(new xn(0.015, 12, 12), new ut({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  xt.add(zs, Fs);
  const hn = 0.08, io = (t, o, s) => {
    const n = new Ce().setFromPoints([new k(...t), new k(...o)]);
    return new Pt(n, new ht({ color: s, transparent: true, opacity: 0.7 }));
  };
  xt.add(io([-hn, 0, 0], [hn, 0, 0], 16711680)), xt.add(io([0, -hn, 0], [0, hn, 0], 65280)), xt.add(io([0, 0, -hn], [0, 0, hn], 35071)), xt.visible = false, xt.frustumCulled = false, c.add(xt);
  let lo = 2;
  const Dn = (t) => {
    const o = p(), s = (b == null ? void 0 : b.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / s : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / s;
  }, _n = () => {
    if (!xt.visible) return;
    const t = lo * Dn(xt.position) / 0.015;
    xt.scale.setScalar(Math.max(1e-4, Math.min(1e5, t)));
  };
  let kn = 10;
  const ro = (t) => Math.max(1e-4, kn * Dn(t));
  window.__hekatanAperturaPx = (t) => (typeof t == "number" && t > 0 && (kn = t), kn), window.__hekatanUpdateSnapScale = _n, window.__hekatanSnapMarker = xt, window.__hekatanMetrosPorPixel = Dn, window.__hekatanSnapPx = (t) => (typeof t == "number" && t > 0 && (lo = t, _n(), y()), lo);
  const Io = () => {
    Tt.children.length !== 0 && Tt.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(Rt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Io, u.addEventListener("change", () => {
    var _a2;
    _n(), bt.visible && At(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Io();
  }), window.__hekatanShowSnap = (t, o, s) => {
    xt.position.set(t, o, s), xt.visible = true, _n(), y();
  }, window.__hekatanHideSnap = () => {
    xt.visible = false, y();
  }, b.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r;
    window.__hekatanCursorPx = { x: t.clientX, y: t.clientY };
    const o = v(t);
    if (!o) return;
    P.setFromCamera(E, o);
    const s = G();
    if (s.length) {
      const n = s[0].point, a = t.altKey, i = ro(n), r = a ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i, { x: t.clientX, y: t.clientY });
      if (r) No(r.type, r.x, r.y, r.z), xt.position.set(r.x, r.y, r.z), xt.visible = true, n.set(r.x, r.y, r.z), Yo(r.type, t.clientX, t.clientY);
      else {
        Ts(), Nn();
        const _ = !a && window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0.5;
        _ && d > 0 && (n.x = Math.round(n.x / d) * d, n.y = Math.round(n.y / d) * d, n.z = Math.round(n.z / d) * d), xt.position.copy(n), xt.visible = true;
      }
      _n();
      const h = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (h === "select" || !h) {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, d = gn(n.x, n.y, n.z, _), T = vn(n.x, n.y, n.z, _), ne = $n(n.x, n.y, n.z, _);
        if (d >= 0) {
          const z = e.points.rawVal[d];
          bt.position.set(z[0], z[1], z[2]), bt.visible = true, At(), Ft.visible = false, Ut = { kind: "pt", a: d };
        } else if (T) {
          const z = e.points.rawVal, A = e.polylines.rawVal[T.polyIdx], Z = z[A[T.segIdx]], H = z[A[T.segIdx + 1]];
          Ft.geometry.setFromPoints([new k(Z[0], Z[1], Z[2]), new k(H[0], H[1], H[2])]), Ft.visible = true, bt.visible = false, Ut = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(T.polyIdx)) ?? false ? { kind: "poly", a: T.polyIdx } : { kind: "seg", a: T.polyIdx, b: T.segIdx };
        } else if (ne >= 0) {
          const A = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[ne];
          A && (Ft.geometry.setFromPoints([new k(A[0], A[1], A[2]), new k(A[3], A[4], A[5])]), Ft.visible = true, bt.visible = false, Ut = { kind: "aux", a: ne });
        } else Ft.visible = false, bt.visible = false, Ut = null;
        se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
        let q = n;
        if ((Ut == null ? void 0 : Ut.kind) === "pt") {
          const z = e.points.rawVal[Ut.a];
          z && (q = new k(z[0], z[1], z[2]));
        }
        const Y = `X=${q.x.toFixed(2)} Y=${q.y.toFixed(2)} Z=${q.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [q.x, q.y, q.z], Ut) {
          const z = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          se.textContent = `${Y}  \xB7  \u{1F5B1} Click \u2192 ${z[Ut.kind]}`;
        } else se.textContent = Y;
        const g = document.getElementById("hk-coord-fixed");
        g && (g.textContent = Y), Ue = { p: q.clone(), x: t.clientX, y: t.clientY }, de.visible = false, at.visible = false, oe.visible = false, y();
        return;
      }
      if (h === "delete" || h === "trim" || h === "extend" || h === "offset") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, d = vn(n.x, n.y, n.z, _), T = $n(n.x, n.y, n.z, _);
        let ne = false;
        if (T >= 0) if (!d) ne = true;
        else {
          const z = window.__hekatanDrawingAuxLines, Z = ((z == null ? void 0 : z.rawVal) ?? (z == null ? void 0 : z.val) ?? z ?? [])[T];
          on(n.x, n.y, n.z, Z[0], Z[1], Z[2], Z[3], Z[4], Z[5]) < d.dist && (ne = true);
        }
        ne ? (yt = T, Ze = -1, Qe = -1, so(T)) : d ? (Ze = d.polyIdx, Qe = d.segIdx, yt = -1, ao(d.polyIdx, d.segIdx)) : (Ze = -1, Qe = -1, yt = -1, it.visible = false), de.visible = false, at.visible = false, oe.visible = false, X(), se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
        const q = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let Y = "";
        ne ? Y = `\u{1F5D1} l\xEDnea aux #${yt + 1}` : d ? Y = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(d.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${d.polyIdx + 1}` : `\u{1F5D1} seg ${d.segIdx + 1} / poly #${d.polyIdx + 1}` : Y = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", se.textContent = `${q}  \xB7  ${Y}`;
        const g = document.getElementById("hk-coord-fixed");
        g && (g.textContent = q), y();
        return;
      } else it.visible = false, Ze = -1, yt = -1;
      se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
      const m = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], x = m[m.length - 1] ?? [], M = e.points.rawVal ?? [];
      if (x.length > 0 && M[x[x.length - 1]]) {
        const _ = x[x.length - 1], d = M[_];
        let T = ot;
        if (Mt = null, !T && window.__hekatanAxisSnap !== false) {
          const Ie = b.getBoundingClientRect(), st = t.clientX, et = t.clientY, lt = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, He = new k(d[0], d[1], d[2]), $e = [["x", new k(1, 0, 0)], ["y", new k(0, 1, 0)], ["z", new k(0, 0, 1)]], tt = (ke) => {
            const Re = ke.clone().project(o);
            return { x: (Re.x * 0.5 + 0.5) * Ie.width + Ie.left, y: (-Re.y * 0.5 + 0.5) * Ie.height + Ie.top };
          };
          let Xe = null;
          for (const [ke, Re] of $e) {
            const Oe = tt(He.clone().addScaledVector(Re, -lt)), Lt = tt(He.clone().addScaledVector(Re, lt)), Xt = Lt.x - Oe.x, It = Lt.y - Oe.y, Qt = st - Oe.x, bo = et - Oe.y, Un = Xt * Xt + It * It || 1;
            let qn = (Qt * Xt + bo * It) / Un;
            qn = Math.max(0, Math.min(1, qn));
            const jo = Math.hypot(st - (Oe.x + qn * Xt), et - (Oe.y + qn * It));
            if (Xe === null || jo < Xe.dpx) {
              const Mo = P.ray, es = He.clone().sub(Mo.origin), _o2 = Re.dot(Mo.direction), ts = Re.dot(es), Ys = Mo.direction.dot(es), ns = 1 - _o2 * _o2, Zs = Math.abs(ns) < 1e-6 ? -ts : (_o2 * Ys - ts) / ns;
              Xe = { axis: ke, dpx: jo, pt: He.clone().addScaledVector(Re, Zs) };
            }
          }
          Xe && Xe.dpx <= 12 && (n.copy(Xe.pt), T = Xe.axis, Mt = Xe.pt.clone());
        }
        const ne = !!window.__hekatanOrthoMode;
        if (!T && ne) {
          const Ie = Math.abs(n.x - d[0]), st = Math.abs(n.y - d[1]), et = Math.abs(n.z - d[2]), lt = (_l = s[0]) == null ? void 0 : _l.object;
          let He = null;
          lt === Te ? He = "xy" : lt === qe ? He = "xz" : lt === Ee && (He = "yz"), He === "xy" ? T = Ie >= st ? "x" : "y" : He === "xz" ? T = Ie >= et ? "x" : "z" : He === "yz" ? T = st >= et ? "y" : "z" : T = Ie >= st && Ie >= et ? "x" : st >= et ? "y" : "z";
        }
        const q = window.__hekatanPolarTrack !== false;
        if (!T && q) {
          const Ie = n.x - d[0], st = n.y - d[1], et = n.z - d[2], lt = Math.hypot(Ie, st, et);
          if (lt > 1e-3) {
            const $e = Math.tan(6 * Math.PI / 180) * lt, tt = Math.hypot(st, et), Xe = Math.hypot(Ie, et), ke = Math.hypot(Ie, st), Re = [["x", tt], ["y", Xe], ["z", ke]];
            Re.sort((Oe, Lt) => Oe[1] - Lt[1]), Re[0][1] <= $e && (T = Re[0][0]);
          }
        }
        if (T) {
          const Ie = d[0], st = d[1], et = d[2];
          T === "x" ? n.set(n.x, st, et) : T === "y" ? n.set(Ie, n.y, et) : n.set(Ie, st, n.z);
          const lt = !!ot, $e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[T];
          ze.style.background = "rgba(15,23,42,0.92)", ze.style.color = $e, ze.style.border = `1.5px solid ${$e}`;
          const tt = (_m = s[0]) == null ? void 0 : _m.object;
          let Xe = null;
          tt === Te ? Xe = "xy" : tt === qe ? Xe = "xz" : tt === Ee && (Xe = "yz");
          const ke = Xe ? ` (plano ${Xe.toUpperCase()})` : "";
          ze.textContent = lt ? `\u{1F512} LOCK ${T.toUpperCase()}${ke}` : `\u22A5 ORTO ${T.toUpperCase()}${ke}`, ze.style.left = t.clientX + 20 + "px", ze.style.top = t.clientY + 18 + "px", ze.style.transform = "none", ze.style.display = "block";
        } else ot || (ze.style.display = "none");
        let Y = null;
        if (!a && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ie = e.points.rawVal, st = T ? [T] : ["z", "x", "y"], et = { x: t.clientX, y: t.clientY };
          let lt = 1 / 0;
          for (const He of Ie) if (!(Math.abs(He[0] - d[0]) < 1e-9 && Math.abs(He[1] - d[1]) < 1e-9 && Math.abs(He[2] - d[2]) < 1e-9)) for (const $e of st) {
            const tt = new k($e === "x" ? He[0] : n.x, $e === "y" ? He[1] : n.y, $e === "z" ? He[2] : n.z), Xe = ho(tt.x, tt.y, tt.z);
            if (!Xe) continue;
            const ke = Math.hypot(Xe.x - et.x, Xe.y - et.y);
            ke < kn && ke < lt && (lt = ke, Y = { q: He, eje: $e });
          }
        }
        Y ? (Y.eje === "x" ? n.x = Y.q[0] : Y.eje === "y" ? n.y = Y.q[1] : n.z = Y.q[2], oe.geometry.setFromPoints([new k(Y.q[0], Y.q[1], Y.q[2]), new k(n.x, n.y, n.z)]), (_n2 = oe.computeLineDistances) == null ? void 0 : _n2.call(oe), oe.visible = true, xt.position.set(n.x, n.y, n.z), xt.visible = true, Yo("track", t.clientX, t.clientY)) : oe.visible = false, Ue = { p: n.clone(), x: t.clientX, y: t.clientY };
        const g = Math.hypot(n.x - d[0], n.y - d[1], n.z - d[2]), z = Math.atan2(n.y - d[1], n.x - d[0]) * 180 / Math.PI, A = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = `${A} | \u0394L=${g.toFixed(2)}m ${z.toFixed(0)}\xB0`;
        const Z = document.getElementById("hk-coord-fixed");
        Z && (Z.textContent = A), de.geometry.setFromPoints([new k(d[0], d[1], d[2]), new k(n.x, n.y, n.z)]), (_o = de.computeLineDistances) == null ? void 0 : _o.call(de), de.visible = true, R(d[0], d[1], d[2], n.x, n.y, n.z);
        const H = window.__hekatanOrthoExt ?? 8, U = window.__hekatanShowOrthoPlanes !== false;
        we.visible = U, U || Nt(null), U && (je(_e, d, "xy", H), je(Ne, d, "xz", H), je(De, d, "yz", H), nt(Te, d, "xy", H), nt(qe, d, "xz", H), nt(Ee, d, "yz", H));
        const O = U ? P.intersectObjects([Te, qe, Ee], false) : [];
        let ye = null;
        if (O.length > 0) {
          const Ie = O[0].object;
          Ie === Te ? ye = "xy" : Ie === qe ? ye = "xz" : Ie === Ee && (ye = "yz");
        }
        Nt(ye), ye && (Ge.style.left = t.clientX + "px", Ge.style.top = t.clientY + "px"), S.geometry.setFromPoints([new k(d[0] - H, d[1], d[2]), new k(d[0] + H, d[1], d[2])]), (_p = S.computeLineDistances) == null ? void 0 : _p.call(S), D.geometry.setFromPoints([new k(d[0], d[1] - H, d[2]), new k(d[0], d[1] + H, d[2])]), (_q = D.computeLineDistances) == null ? void 0 : _q.call(D), Q.geometry.setFromPoints([new k(d[0], d[1], d[2] - H), new k(d[0], d[1], d[2] + H)]), (_r = Q.computeLineDistances) == null ? void 0 : _r.call(Q), at.visible = true;
        const xe = S.material, Pe = D.material, Je = Q.material;
        T === "x" ? (xe.opacity = 0.95, Pe.opacity = 0.1, Je.opacity = 0.1) : T === "y" ? (xe.opacity = 0.1, Pe.opacity = 0.95, Je.opacity = 0.1) : T === "z" ? (xe.opacity = 0.1, Pe.opacity = 0.1, Je.opacity = 0.95) : (xe.opacity = 0.5, Pe.opacity = 0.5, Je.opacity = 0.5);
      } else {
        const _ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = _;
        const d = document.getElementById("hk-coord-fixed");
        if (d && (d.textContent = _), de.visible = false, at.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(h)) {
          if (I = null, N = null, V.style.left = t.clientX + 20 + "px", V.style.top = t.clientY - 28 + "px", V.style.display = "block", !F) {
            V.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const ne = document.activeElement;
            !(ne && (ne.tagName === "INPUT" || ne.tagName === "TEXTAREA") && ne !== V) && document.activeElement !== V && V.focus({ preventScroll: true });
            try {
              V.select();
            } catch {
            }
          }
        } else X();
      }
      y();
    } else Nn(), se.style.display = "none", xt.visible = false, de.visible = false, at.visible = false, X(), y();
  }), te.derive(() => {
    var _a2;
    if (!e.gridTarget) return;
    const t = new Gn().setFromEuler(new An(...e.gridTarget.val.rotation)), o = new Gn().setFromAxisAngle(new k(1, 0, 0), Math.PI / 2);
    Ea(l, { position: new k(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, y);
    {
      const n = e.gridTarget.val.position[2], a = Math.abs(t.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of K) c.remove(i), ve(i);
      if (K.length = 0, a) {
        const i = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], r = /* @__PURE__ */ new Set([0]);
        for (const m of i) r.add(+m[2].toFixed(3));
        for (const m of window.__hekatanLevels ?? []) isFinite(m == null ? void 0 : m.z) && r.add(+m.z.toFixed(3));
        const h = [...r].sort((m, x) => m - x).slice(0, 24);
        for (const m of h) {
          if (Math.abs(m - n) < 1e-6) continue;
          const x = l.clone(true);
          x.name = `hekatan-grid-nivel-${m}`, x.traverse((M) => {
            M.material && (M.material = M.material.clone(), M.material.transparent = true, M.material.opacity = (M.material.opacity ?? 1) * (Math.abs(m) < 1e-6 ? 0.5 : 0.22));
          }), x.position.set(0, 0, m), x.quaternion.copy(o), c.add(x), K.push(x);
        }
      }
    }
    j.position.set(...e.gridTarget.val.position), j.quaternion.setFromEuler(new An(...e.gridTarget.val.rotation)), j.updateMatrixWorld();
    const s = new k(0, 0, 1).applyEuler(new An(...e.gridTarget.val.rotation));
    L = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), te.derive(() => {
    W.geometry.setAttribute("position", new kt(e.points.val.flat(), 3)), W.geometry.computeBoundingSphere();
  }), te.derive(() => {
    const t = 0.05 * w * 0.5 * f.val;
    P.params.Points.threshold = 0.4 * t;
  }), te.derive(() => {
    var _a2;
    const t = e.points.val ?? [], s = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of s) {
      const [r, h, m] = t[i];
      n.push(r, h, m);
    }
    const a = new Ce();
    a.setAttribute("position", new kt(n, 3)), pe.geometry.dispose(), pe.geometry = a;
  });
  let co = false, ln = 0;
  b.addEventListener("pointerdown", () => {
    co = true;
  }), b.addEventListener("pointerup", () => {
    co = false;
  }), b.addEventListener("pointermove", () => {
    co && ln++;
  });
  const $t = document.createElement("div");
  $t.id = "hk-window-select", $t.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild($t);
  let Gt = null, Sn = false, Yt = null;
  const po = (t, o, s, n, a) => {
    a ? ($t.style.borderColor = "#34d399", $t.style.borderStyle = "dashed", $t.style.background = "rgba(52, 211, 153, 0.10)") : ($t.style.borderColor = "#22d3ee", $t.style.borderStyle = "solid", $t.style.background = "rgba(34, 211, 238, 0.10)"), $t.style.left = Math.min(t, s) + "px", $t.style.top = Math.min(o, n) + "px", $t.style.width = Math.abs(s - t) + "px", $t.style.height = Math.abs(n - o) + "px", $t.style.display = "block";
  }, Ro = (t, o, s, n, a) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, s), r = Math.max(t, s), h = Math.min(o, n), m = Math.max(o, n), x = s < t, M = b.getBoundingClientRect(), _ = p();
    _.updateMatrixWorld();
    const d = (U) => {
      const O = new k(U[0], U[1], U[2]);
      return O.project(_), { x: M.left + (O.x * 0.5 + 0.5) * M.width, y: M.top + (-O.y * 0.5 + 0.5) * M.height };
    }, T = (U) => U.x >= i && U.x <= r && U.y >= h && U.y <= m, ne = (U, O) => !(U.x < i && O.x < i || U.x > r && O.x > r || U.y < h && O.y < h || U.y > m && O.y > m);
    a || Ae.clear();
    let q = 0;
    const Y = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let U = 0; U < Y.length; U++) {
      const O = Y[U];
      O && T(d(O)) && (Ae.add(`pt:${U}`), q++);
    }
    const g = (U, O) => x ? T(U) || T(O) || ne(U, O) : T(U) && T(O), z = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], A = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let U = 0; U < z.length; U++) {
      const O = z[U];
      if (A.includes(U)) {
        let xe;
        if (!x) xe = O.every((Pe) => {
          const Je = Y[Pe];
          return !!Je && T(d(Je));
        });
        else {
          xe = false;
          for (let Pe = 0; Pe < O.length - 1; Pe++) {
            const Je = Y[O[Pe]], Ie = Y[O[Pe + 1]];
            if (!(!Je || !Ie) && g(d(Je), d(Ie))) {
              xe = true;
              break;
            }
          }
        }
        xe && (Ae.add(`poly:${U}`), q++);
      } else for (let xe = 0; xe < O.length - 1; xe++) {
        const Pe = Y[O[xe]], Je = Y[O[xe + 1]];
        !Pe || !Je || g(d(Pe), d(Je)) && (Ae.add(`seg:${U}:${xe}`), q++);
      }
    }
    const H = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let U = 0; U < H.length; U++) {
      const O = H[U];
      if (!O || O.length !== 6) continue;
      const ye = d([O[0], O[1], O[2]]), xe = d([O[3], O[4], O[5]]);
      g(ye, xe) && (Ae.add(`aux:${U}`), q++);
    }
    Et(), le(q === 0 && !x ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${x ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${q} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ae.size})`), $t.style.display = "none";
  }, Bn = () => {
    Yt && (Yt = null, $t.style.display = "none", le("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Bn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && Yt && Bn();
  });
  const Do = () => {
    var _a2, _b, _c, _d;
    if (Ae.size === 0) return false;
    const t = [...Ae], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? [], r = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set();
    for (const ne of t) {
      const [q, ...Y] = ne.split(":");
      if (q === "pt") r.add(+Y[0]);
      else if (q === "poly") h.add(+Y[0]);
      else if (q === "seg") {
        const g = +Y[0], z = +Y[1];
        m.has(g) || m.set(g, /* @__PURE__ */ new Set()), m.get(g).add(z);
      } else q === "aux" && x.add(+Y[0]);
    }
    let M = 0, _ = [], d = [];
    const T = /* @__PURE__ */ new Map();
    for (let ne = 0; ne < s.length; ne++) {
      if (h.has(ne)) {
        M++;
        continue;
      }
      T.set(ne, _.length);
      const q = m.get(ne);
      if (q && q.size > 0) {
        let Y = [];
        for (let g = 0; g < s[ne].length; g++) Y.push(s[ne][g]), g < s[ne].length - 1 && q.has(g) && (Y.length >= 2 && _.push(Y), Y = [], M++);
        (Y.length >= 2 || Y.length === 1) && _.push(Y);
      } else _.push([...s[ne]]);
    }
    if (r.size > 0) {
      const ne = [], q = /* @__PURE__ */ new Map();
      for (let g = 0; g < o.length; g++) {
        if (r.has(g)) {
          M++;
          continue;
        }
        q.set(g, ne.length), ne.push([...o[g]]);
      }
      const Y = [];
      for (const g of _) {
        let z = [];
        for (const A of g) {
          const Z = q.get(A);
          Z === void 0 ? (z.length >= 2 && Y.push(z), z = []) : z.push(Z);
        }
        z.length >= 2 && Y.push(z);
      }
      _ = Y, e.points.val = ne;
    }
    for (const ne of n) {
      const q = T.get(ne);
      q !== void 0 && q < _.length && d.push(q);
    }
    if (e.polylines && (e.polylines.val = _), e.areas && (e.areas.val = d), x.size > 0 && a) {
      const ne = i.filter((q, Y) => !x.has(Y));
      "val" in a ? a.val = ne : window.__hekatanDrawingAuxLines = ne, M += x.size;
    }
    Ae.clear(), Et();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return le(`\u{1F5D1} ${M} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Do, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || Ae.size !== 0 && (t.preventDefault(), Do());
  });
  const Dt = document.createElement("div");
  Dt.id = "hk-properties-pane";
  const Bo = "hk-props-pane-pos";
  let Pn = null;
  try {
    const t = localStorage.getItem(Bo);
    t && (Pn = JSON.parse(t));
  } catch {
  }
  Dt.style.cssText = ["position:fixed", Pn ? `left:${Pn.left}px` : "left:14px", Pn ? `top:${Pn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Dt);
  const As = () => {
    const t = Dt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, i = 0;
    t.addEventListener("mousedown", (r) => {
      o = true, s = r.clientX, n = r.clientY;
      const h = Dt.getBoundingClientRect();
      a = h.left, i = h.top, Dt.style.transform = "none", Dt.style.left = `${a}px`, Dt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const h = r.clientX - s, m = r.clientY - n, x = Math.max(0, Math.min(window.innerWidth - 80, a + h)), M = Math.max(0, Math.min(window.innerHeight - 40, i + m));
      Dt.style.left = `${x}px`, Dt.style.top = `${M}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Bo, JSON.stringify({ left: parseFloat(Dt.style.left), top: parseFloat(Dt.style.top) }));
        } catch {
        }
      }
    });
  }, ie = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Vt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let pt = null;
  const _t = (t, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: s, value: n } }));
  }, Es = () => {
    if (pt && (pt.dispose(), pt = null), Ae.size === 0) {
      Dt.style.display = "none";
      return;
    }
    const t = [...Ae], o = t.filter((_) => _.startsWith("pt:")), s = t.filter((_) => _.startsWith("seg:")), n = t.filter((_) => _.startsWith("poly:")), a = t.filter((_) => _.startsWith("aux:")), i = o.length > 0, r = s.length > 0, h = n.length > 0, m = !i && !r && !h, x = [];
    o.length && x.push(`\u{1F535} ${o.length} nodo(s)`), s.length && x.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && x.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && x.push(`\u250A ${a.length} aux`);
    const M = `\u{1F3AF} ${Ae.size} item(s) \u2014 ${x.join(", ")}`;
    pt = new bs({ container: Dt, title: M });
    {
      const _ = pt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      _.addBinding(Vt, "dx", { label: "\u0394x (m)", step: 0.1 }), _.addBinding(Vt, "dy", { label: "\u0394y (m)", step: 0.1 }), _.addBinding(Vt, "dz", { label: "\u0394z (m)", step: 0.1 }), _.addBinding(Vt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), _.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const q = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Vt.dx, Vt.dy, Vt.dz, Vt.copias);
        le(q ? `\u29C9 Replicado \xD7${q} (\u0394 ${Vt.dx},${Vt.dy},${Vt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const d = { vuelo: 1.5, losa: true, borde: true, ambos: true }, T = _.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      T.addBinding(d, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), T.addBinding(d, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), T.addBinding(d, "borde", { label: "con viga de borde" }), T.addBinding(d, "ambos", { label: "a los dos lados" }), T.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a2;
        const q = (_a2 = window.__hekatanVoladoSelection) == null ? void 0 : _a2.call(window, d.vuelo, { losa: d.losa, vigaBorde: d.borde, lados: d.ambos ? "ambos" : "afuera" });
        le(q ? `\u2310 Volado de ${d.vuelo} m en ${q} pa\xF1o(s)` + (d.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), _.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const q = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Vt.dx, Vt.dy, Vt.dz, 1);
        le(q ? `\u2192 Copia desplazada \u0394 ${Vt.dx},${Vt.dy},${Vt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const ne = _.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      ne.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), ne.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), le(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const _ = pt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      _.addBinding(ie, "Ux"), _.addBinding(ie, "Uy"), _.addBinding(ie, "Uz"), _.addBinding(ie, "Rx"), _.addBinding(ie, "Ry"), _.addBinding(ie, "Rz");
      const d = pt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      d.addBinding(ie, "Kx", { label: "Kx", min: 0, step: 100 }), d.addBinding(ie, "Ky", { label: "Ky", min: 0, step: 100 }), d.addBinding(ie, "Kz", { label: "Kz", min: 0, step: 100 }), d.addBinding(ie, "Krx", { label: "Krx", min: 0, step: 1e3 }), d.addBinding(ie, "Kry", { label: "Kry", min: 0, step: 1e3 }), d.addBinding(ie, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const T = pt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      T.addBinding(ie, "Fx", { step: 0.1 }), T.addBinding(ie, "Fy", { step: 0.1 }), T.addBinding(ie, "Fz", { step: 0.1 }), T.addBinding(ie, "Mx", { step: 0.1 }), T.addBinding(ie, "My", { step: 0.1 }), T.addBinding(ie, "Mz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ie, "mass", { label: "m", min: 0, step: 1 }), pt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ie, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), pt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let Y = 0;
        const g = [ie.Ux, ie.Uy, ie.Uz, ie.Rx, ie.Ry, ie.Rz];
        g.some((Z) => Z) && (_t("nodes", o, "supports", g), Y++);
        const z = [ie.Fx, ie.Fy, ie.Fz, ie.Mx, ie.My, ie.Mz];
        z.some((Z) => Z !== 0) && (_t("nodes", o, "loads", z), Y++);
        const A = [ie.Kx, ie.Ky, ie.Kz, ie.Krx, ie.Kry, ie.Krz];
        if (A.some((Z) => Z !== 0) && (_t("nodes", o, "springs", A), Y++), ie.mass !== 0 && (_t("nodes", o, "mass", ie.mass), Y++), ie.diaphragm !== "Ninguno" && (_t("nodes", o, "diaphragm", ie.diaphragm), Y++), Y === 0) {
          le("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let Z = document.getElementById("hk-prop-toast");
          Z || (Z = document.createElement("div"), Z.id = "hk-prop-toast", Z.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(Z)), Z.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", Z.style.background = "rgba(217,119,6,0.97)", Z.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            Z && (Z.style.opacity = "0");
          }, 3200);
        } else le(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const _ = pt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      _.addBinding(ie, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), _.addBinding(ie, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const d = pt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      d.addBinding(ie, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), d.addBinding(ie, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), d.addBinding(ie, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), d.addBinding(ie, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), pt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ie, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), pt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ie, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const q = pt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      q.addBinding(ie, "relMxI", { label: "Mx I" }), q.addBinding(ie, "relMyI", { label: "My I" }), q.addBinding(ie, "relMzI", { label: "Mz I" });
      const Y = pt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      Y.addBinding(ie, "relMxJ", { label: "Mx J" }), Y.addBinding(ie, "relMyJ", { label: "My J" }), Y.addBinding(ie, "relMzJ", { label: "Mz J" }), pt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ie, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const z = pt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      z.addBinding(ie, "LKx", { label: "LKx", min: 0, step: 100 }), z.addBinding(ie, "LKy", { label: "LKy", min: 0, step: 100 }), z.addBinding(ie, "LKz", { label: "LKz", min: 0, step: 100 });
      const A = pt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      A.addBinding(ie, "qx", { step: 0.1 }), A.addBinding(ie, "qy", { step: 0.1 }), A.addBinding(ie, "qz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ie, "massPerM", { label: "m/L", min: 0, step: 1 }), pt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        _t("segs", s, "section", ie.section), _t("segs", s, "material", ie.material_frame);
        const H = { A: ie.A_mod, Iz: ie.Iz_mod, Iy: ie.Iy_mod, J: ie.J_mod };
        (H.A !== 1 || H.Iz !== 1 || H.Iy !== 1 || H.J !== 1) && _t("segs", s, "modifiers", H), ie.insertionPoint !== "10 \u2014 Centroid" && _t("segs", s, "insertionPoint", ie.insertionPoint), ie.beta !== 0 && _t("segs", s, "beta", ie.beta);
        const U = [ie.relMxI, ie.relMyI, ie.relMzI], O = [ie.relMxJ, ie.relMyJ, ie.relMzJ];
        (U.some((Pe) => Pe) || O.some((Pe) => Pe)) && _t("segs", s, "releases", { i: U, j: O }), ie.hinges !== "None" && _t("segs", s, "hinges", ie.hinges);
        const ye = [ie.LKx, ie.LKy, ie.LKz];
        ye.some((Pe) => Pe !== 0) && _t("segs", s, "lineSprings", ye);
        const xe = [ie.qx, ie.qy, ie.qz];
        xe.some((Pe) => Pe !== 0) && _t("segs", s, "distLoad", xe), ie.massPerM !== 0 && _t("segs", s, "massPerM", ie.massPerM), le(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (h) {
      const _ = pt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      _.addBinding(ie, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), _.addBinding(ie, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), _.addBinding(ie, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), pt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ie, "surfLoad", { label: "q", step: 0.1 }), pt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        _t("areas", n, "shellType", ie.shellType), _t("areas", n, "thickness", ie.thickness), _t("areas", n, "material", ie.material_shell), ie.surfLoad !== 0 && _t("areas", n, "surfLoad", ie.surfLoad), le(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (m) {
      const _ = pt.addFolder({ title: "\u2139 Selecci\xF3n" }), d = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      _.addBinding(d, "msg", { readonly: true, label: "" });
    }
    pt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ae.clear(), Et();
    }), Dt.style.display = "block", As();
  };
  window.__hekatanRefreshPropsPane = Es;
  let mn = null, Xn = false;
  b.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, Xn = false);
  }), b.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !Xn) {
      const o = t.clientX - mn.x, s = t.clientY - mn.y;
      Math.hypot(o, s) > 8 && (Xn = true);
    }
  }), b.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !Xn;
      mn = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Yt ? Bn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ae.size > 0 && (Ae.clear(), Et()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), le(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : le("\u238B Cancelado (click derecho)");
      }
    }
  }), b.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), b.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Gt = null, Sn = false));
  }), b.addEventListener("pointermove", (t) => {
    if (Yt && t.buttons === 0) {
      const i = t.clientX < Yt.x;
      po(Yt.x, Yt.y, t.clientX, t.clientY, i);
      return;
    }
    if (!Gt) return;
    const o = t.clientX - Gt.x, s = t.clientY - Gt.y, n = Math.hypot(o, s);
    if (!Sn && n < 8) return;
    Sn = true;
    const a = t.clientX < Gt.x;
    po(Gt.x, Gt.y, t.clientX, t.clientY, a);
  }), b.addEventListener("pointerup", (t) => {
    if (!Gt) return;
    if (!Sn) {
      Gt = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    Ro(Gt.x, Gt.y, t.clientX, t.clientY, o), Gt = null, Sn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const qt = new rt();
  qt.visible = false, qt.frustumCulled = false, c.add(qt);
  const Xo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, No = (t, o, s, n) => {
    var _a2, _b, _c, _d;
    for (; qt.children.length; ) {
      const r = qt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Xo[t] ?? 16777215, i = new Ce().setFromPoints([new k(-1, -1, 0), new k(1, -1, 0), new k(1, -1, 0), new k(1, 1, 0), new k(1, 1, 0), new k(-1, 1, 0), new k(-1, 1, 0), new k(-1, -1, 0)]);
    qt.add(new Wt(i, new ht({ color: a, linewidth: 2 }))), qt.position.set(o, s, n), qt.visible = true, fo();
  };
  let uo = 4;
  const fo = () => {
    qt.visible && qt.scale.setScalar(uo * Dn(qt.position));
  };
  window.__hekatanOsnapMarkerRef = qt, window.__hekatanUpdateOsnapScale = fo, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (uo = t, fo(), y()), uo);
  const Nn = () => {
    qt.visible = false;
  }, Vs = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Jt = document.createElement("div");
  Jt.id = "hk-osnap-etiqueta", Jt.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Jt);
  const Yo = (t, o, s) => {
    const n = Vs[t];
    if (!n) {
      Jt.style.display = "none";
      return;
    }
    Jt.textContent = n, Jt.style.color = "#" + (Xo[t] ?? 16777215).toString(16).padStart(6, "0"), Jt.style.left = o + 18 + "px", Jt.style.top = s - 26 + "px", Jt.style.display = "block";
  }, Ts = () => {
    Jt.style.display = "none";
  }, Cn = new k(), ho = (t, o, s) => {
    const n = p();
    if (!n) return null;
    const a = b.getBoundingClientRect();
    return Cn.set(t, o, s).project(n), !isFinite(Cn.x) || !isFinite(Cn.y) ? null : { x: a.left + (Cn.x * 0.5 + 0.5) * a.width, y: a.top + (-Cn.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = ho;
  const $s = (t, o, s, n, a) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, r = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let m = null;
    const x = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, M = a, _ = (g, z, A, Z) => {
      let H;
      if (M) {
        const O = ho(z, A, Z);
        if (!O || (H = Math.hypot(O.x - M.x, O.y - M.y), H > kn)) return;
      } else if (H = Math.hypot(z - t, A - o, Z - s), H > n) return;
      const U = x[g] ?? 9;
      (!m || U < m.r || U === m.r && H < m.d) && (m = { type: g, x: z, y: A, z: Z, d: H, r: U });
    };
    if (i.ori !== false && _("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const g = window.__hekatanGridConfig, z = (g == null ? void 0 : g.minorStep) && g.minorStep > 0 ? g.minorStep : 1, A = ((g == null ? void 0 : g.gridSize) ?? 30) / 2, Z = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", H = (O) => Math.round(O / z) * z, U = (O, ye) => Math.abs(O) <= A + 1e-9 && Math.abs(ye) <= A + 1e-9;
      if (Z === "xz") {
        const O = H(t), ye = H(s);
        U(O, ye) && _("grid", O, o, ye);
      } else if (Z === "yz") {
        const O = H(o), ye = H(s);
        U(O, ye) && _("grid", t, O, ye);
      } else {
        const O = H(t), ye = H(o);
        U(O, ye) && _("grid", O, ye, s);
      }
    }
    (i.node || i.end) && r.forEach((g) => {
      i.node && _("node", g[0], g[1], g[2]);
    });
    for (const g of h) if (!(g.length < 2)) for (let z = 0; z < g.length - 1; z++) {
      const A = r[g[z]], Z = r[g[z + 1]];
      if (!(!A || !Z) && (i.end && (_("end", A[0], A[1], A[2]), _("end", Z[0], Z[1], Z[2])), i.mid && _("mid", (A[0] + Z[0]) / 2, (A[1] + Z[1]) / 2, (A[2] + Z[2]) / 2), i.nea || i.per)) {
        const H = Z[0] - A[0], U = Z[1] - A[1], O = Z[2] - A[2], ye = H * H + U * U + O * O;
        if (ye < 1e-12) continue;
        const xe = Math.max(0, Math.min(1, ((t - A[0]) * H + (o - A[1]) * U + (s - A[2]) * O) / ye)), Pe = A[0] + xe * H, Je = A[1] + xe * U, Ie = A[2] + xe * O;
        i.nea && _("nea", Pe, Je, Ie), i.per && _("per", Pe, Je, Ie);
      }
    }
    if (i.cen) {
      const g = ((_e2 = e.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const z of g) {
        const A = h[z];
        if (!A || A.length < 3) continue;
        const Z = A[0] === A[A.length - 1] ? A.slice(0, -1) : A;
        let H = 0, U = 0, O = 0, ye = 0;
        for (const xe of Z) {
          const Pe = r[xe];
          Pe && (H += Pe[0], U += Pe[1], O += Pe[2], ye++);
        }
        ye >= 3 && _("cen", H / ye, U / ye, O / ye);
      }
    }
    if (i.cen) {
      const g = bn(), z = [...an];
      for (const A of g) z.some((Z) => Math.hypot(Z.c[0] - A.c[0], Z.c[1] - A.c[1], Z.c[2] - A.c[2]) < 1e-6 && Math.abs(Z.r - A.r) < 1e-6) || z.push(A);
      for (const A of z) {
        if (!r.some((U) => Math.abs(Math.hypot(U[0] - A.c[0], U[1] - A.c[1], U[2] - A.c[2]) - A.r) < 1e-6)) continue;
        const H = Math.hypot(t - A.c[0], o - A.c[1], s - A.c[2]);
        if (H < n || Math.abs(H - A.r) < n) {
          const U = Math.min(H, n * 0.5), O = 3;
          (!m || O < m.r || O === m.r && U < m.d) && (m = { type: "cen", x: A.c[0], y: A.c[1], z: A.c[2], d: U, r: O });
        }
      }
    }
    if (i.int) {
      const g = [];
      for (const z of h) for (let A = 0; A < z.length - 1; A++) {
        const Z = r[z[A]], H = r[z[A + 1]];
        if (!Z || !H) continue;
        const U = H[0] - Z[0], O = H[1] - Z[1], ye = H[2] - Z[2], xe = U * U + O * O + ye * ye;
        if (xe < 1e-12) continue;
        const Pe = Math.max(0, Math.min(1, ((t - Z[0]) * U + (o - Z[1]) * O + (s - Z[2]) * ye) / xe));
        Math.hypot(Z[0] + Pe * U - t, Z[1] + Pe * O - o, Z[2] + Pe * ye - s) < 3 * n && g.push([Z, H]);
      }
      for (let z = 0; z < g.length; z++) for (let A = z + 1; A < g.length; A++) {
        const [Z, H] = g[z], [U, O] = g[A], ye = [H[0] - Z[0], H[1] - Z[1], H[2] - Z[2]], xe = [O[0] - U[0], O[1] - U[1], O[2] - U[2]], Pe = [Z[0] - U[0], Z[1] - U[1], Z[2] - U[2]], Je = ye[0] * ye[0] + ye[1] * ye[1] + ye[2] * ye[2], Ie = ye[0] * xe[0] + ye[1] * xe[1] + ye[2] * xe[2], st = xe[0] * xe[0] + xe[1] * xe[1] + xe[2] * xe[2], et = ye[0] * Pe[0] + ye[1] * Pe[1] + ye[2] * Pe[2], lt = xe[0] * Pe[0] + xe[1] * Pe[1] + xe[2] * Pe[2], He = Je * st - Ie * Ie;
        if (He < 1e-12) continue;
        const $e = (Ie * lt - st * et) / He, tt = (Je * lt - Ie * et) / He;
        if ($e < -1e-6 || $e > 1 + 1e-6 || tt < -1e-6 || tt > 1 + 1e-6) continue;
        const Xe = [Z[0] + $e * ye[0], Z[1] + $e * ye[1], Z[2] + $e * ye[2]], ke = [U[0] + tt * xe[0], U[1] + tt * xe[1], U[2] + tt * xe[2]];
        if (Math.hypot(Xe[0] - ke[0], Xe[1] - ke[1], Xe[2] - ke[2]) > 1e-4) continue;
        [Z, H, U, O].some((Oe) => Math.hypot(Oe[0] - Xe[0], Oe[1] - Xe[1], Oe[2] - Xe[2]) < 1e-6) || _("int", Xe[0], Xe[1], Xe[2]);
      }
    }
    const d = window.__hekatanAxisGrids ?? [], T = window.__hekatanLevels ?? [], ne = d.filter((g) => g && g.start && g.end).map((g) => [g.start, g.end]);
    for (const [g, z] of ne) {
      i.end && (_("end", g[0], g[1], g[2]), _("end", z[0], z[1], z[2]));
      const A = z[0] - g[0], Z = z[1] - g[1], H = z[2] - g[2], U = A * A + Z * Z + H * H;
      if (U < 1e-12) continue;
      const O = Math.max(0, Math.min(1, ((t - g[0]) * A + (o - g[1]) * Z + (s - g[2]) * H) / U));
      if (i.nea && _("nea", g[0] + O * A, g[1] + O * Z, g[2] + O * H), i.int && Math.abs(H) > 1e-9) for (const ye of T) {
        const xe = (ye.z - g[2]) / H;
        xe < -1e-6 || xe > 1 + 1e-6 || _("int", g[0] + xe * A, g[1] + xe * Z, ye.z);
      }
    }
    if (i.int || i.node) for (let g = 0; g < ne.length; g++) for (let z = g + 1; z < ne.length; z++) {
      const [A, Z] = ne[g], [H, U] = ne[z], O = Z[0] - A[0], ye = Z[1] - A[1], xe = U[0] - H[0], Pe = U[1] - H[1], Je = O * Pe - ye * xe;
      if (Math.abs(Je) < 1e-12) continue;
      const Ie = A[0] - H[0], st = A[1] - H[1], et = (xe * st - Pe * Ie) / Je, lt = (O * st - ye * Ie) / Je;
      if (et < -1e-6 || et > 1 + 1e-6 || lt < -1e-6 || lt > 1 + 1e-6) continue;
      const He = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      _("int", A[0] + et * O, A[1] + et * ye, typeof He == "number" ? He : s);
    }
    const q = window.__hekatanDrawingAuxLines, Y = (q == null ? void 0 : q.rawVal) ?? (q == null ? void 0 : q.val) ?? q ?? [];
    for (const g of Y) {
      if (g.length !== 6) continue;
      const z = [g[0], g[1], g[2]], A = [g[3], g[4], g[5]];
      if (i.end && (_("end", z[0], z[1], z[2]), _("end", A[0], A[1], A[2])), i.mid && _("mid", (z[0] + A[0]) / 2, (z[1] + A[1]) / 2, (z[2] + A[2]) / 2), i.nea || i.per) {
        const Z = A[0] - z[0], H = A[1] - z[1], U = A[2] - z[2], O = Z * Z + H * H + U * U;
        if (O < 1e-12) continue;
        const ye = Math.max(0, Math.min(1, ((t - z[0]) * Z + (o - z[1]) * H + (s - z[2]) * U) / O)), xe = z[0] + ye * Z, Pe = z[1] + ye * H, Je = z[2] + ye * U;
        i.nea && _("nea", xe, Pe, Je), i.per && _("per", xe, Pe, Je);
      }
    }
    return m ? { type: m.type, x: m.x, y: m.y, z: m.z } : null;
  }, wn = new rt();
  wn.frustumCulled = false, c.add(wn);
  const Zo = new ht({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Uo = 0;
  const qo = () => {
    var _a2, _b;
    for (const t of wn.children.slice()) wn.remove(t), (_b = (_a2 = t.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (t) => {
    var _a2, _b;
    qo();
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const a of t || []) {
      const i = String(a).split(":");
      let r = [];
      if (i[0] === "pt") {
        const x = o[+i[1]];
        x && (r = [x, [x[0] + 1e-3, x[1], x[2]]]);
      } else if (i[0] === "seg") {
        const x = s[+i[1]] || [], M = o[x[+i[2]]], _ = o[x[+i[2] + 1]];
        M && _ && (r = [M, _]);
      } else i[0] === "poly" && (r = (s[+i[1]] || []).map((M) => o[M]).filter(Boolean));
      if (r.length < 2) continue;
      const h = new Ce().setFromPoints(r.map((x) => new k(x[0], x[1], x[2]))), m = new Pt(h, Zo);
      m.renderOrder = 1200, wn.add(m);
    }
    if (!wn.children.length) return;
    Uo = performance.now() + 900;
    const n = () => {
      const a = Uo - performance.now();
      if (a <= 0) {
        qo(), y();
        return;
      }
      Zo.opacity = Math.min(1, a / 900) * 0.95, y(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = $s, window.__hekatanOsnapShow = No, window.__hekatanOsnapHide = Nn;
  let Ye = [], gt = 0, rn = 0, St = null;
  const zn = document.createElement("div");
  zn.id = "hk-cad-status", zn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", zn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(zn);
  const Ls = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), ot && t.push(`\u{1F512} LOCK ${ot.toUpperCase()}`);
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && t.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, le = (t) => {
    var _a2;
    const o = t + Ls();
    zn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, Is = "Comando:", Rs = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = Ye.length, a = (i, r = []) => ({ txt: i, ops: r });
    switch (t) {
      case "line":
        return s.length >= 2 ? a("L\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : s.length === 1 ? a("L\xCDNEA Precise punto siguiente o", ["desHacer"]) : a("L\xCDNEA Precise primer punto:");
      case "polyline":
        return s.length >= 2 ? a("POLIL\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : s.length === 1 ? a("POLIL\xCDNEA Precise punto siguiente o", ["desHacer"]) : a("POLIL\xCDNEA Precise punto inicial:");
      case "node":
        return a("NUDO Precise punto:");
      case "area":
        return a(`LOSA Precise v\xE9rtice ${Math.min(s.length + 1, 4)} de 4 (en orden, antihorario):`);
      case "rectarea":
        return a(n ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea":
        return a(`\xC1REA LIBRE Precise v\xE9rtice ${me.length + 1} (Enter o clic derecho cierra y malla):`);
      case "rect":
        return a(n ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return a(n ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return a(n === 0 ? "ARCO Precise punto inicial:" : n === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return a(`COLUMNA Precise punto de inserci\xF3n (altura ${gt > 0 ? gt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return a(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${gt > 0 ? gt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return a(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return a("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return a("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return a(St ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return a(St ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return a(St ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${rn > 0 ? ` (distancia ${rn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
      case "axis":
        return a("EJE Precise el primer punto del eje:");
      case "aux":
        return a(n ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
      case "auxp":
        return a("PUNTO AUXILIAR Precise punto:");
      case "chaflan":
        return a(n ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
      case "delete":
        return a("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move":
        return Ae.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ae.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ae.size ? a(`SELECCI\xD3N ${Ae.size} objeto${Ae.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a(Is);
    }
  }, Zt = () => {
    var _a2, _b, _c, _d, _e2;
    try {
      const t = Rs(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !s ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, a, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Zt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    le(o);
  }, window.__hekatanCadResetPending = () => {
    Ye = [], me = [], J.visible = false, mo(), St = null, y(), le("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Zt();
  };
  function mo() {
    if (!e.polylines) return;
    const t = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...t, []];
  }
  window.__hekatanCerrarPolilinea = mo;
  const yn = [], Yn = [], wo = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, Ko = (t) => {
    var _a2;
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Ye = [], de.visible = false, at.visible = false, X();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y(), Zt();
  }, Bt = () => {
    yn.push(wo()), yn.length > 100 && yn.shift(), Yn.length = 0;
  }, Zn = () => {
    const t = yn.pop();
    if (!t) {
      le("\u21B6 Nada para deshacer");
      return;
    }
    Yn.push(wo()), Ko(t), le(`\u21B6 Deshacer \u2014 quedan ${yn.length}`);
  }, Go = () => {
    const t = Yn.pop();
    if (!t) {
      le("\u21B7 Nada para rehacer");
      return;
    }
    yn.push(wo()), Ko(t), le(`\u21B7 Rehacer \u2014 quedan ${Yn.length}`);
  };
  window.__hekatanPushUndo = Bt, window.__hekatanUndo = Zn, window.__hekatanRedo = Go, document.addEventListener("keydown", (t) => {
    var _a2;
    const o = t.key.toLowerCase();
    if (!((t.ctrlKey || t.metaKey) && (o === "y" || o === "z" && t.shiftKey))) return;
    const n = t.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (t.preventDefault(), t.stopPropagation(), Go());
  }, { capture: true }), window.__hekatanCadOption = (t) => {
    var _a2, _b, _c, _d, _e2;
    const o = t.trim().toLowerCase(), s = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
    if (s !== "line" && s !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Zn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (a.length < 3) return le("Cerrar necesita al menos tres puntos."), true;
      Bt(), e.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return yo(), le(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Zn(), true;
      Bt();
      const i = a[a.length - 1], r = a.slice(0, -1), h = n.some((M, _) => _ !== n.length - 1 && M.includes(i)) || r.includes(i);
      let m = e.points.rawVal, x = [...n.slice(0, -1), r];
      if (!h && i === m.length - 1 && (m = m.slice(0, -1), e.points.val = m), e.polylines.val = x, r.length) {
        const M = m[r[r.length - 1]];
        M && (I = [M[0], M[1], M[2]]);
      } else I = null, de.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return y(), le(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Zt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (t) => {
    var _a2;
    if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z" && !t.shiftKey) {
      const o = t.target, s = o == null ? void 0 : o.tagName;
      if ((s === "INPUT" || s === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Zn();
    }
  }, { capture: true });
  const yo = () => {
    Ye = [], St = null, mo(), ot = null, Le(), de.visible = false, at.visible = false, X(), le("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), y(), Zt();
  };
  window.__hekatanFinalizeDraw = yo;
  const Ho = () => {
    var _a2, _b, _c;
    Ye = [], me = [], J.visible = false;
    let t = false;
    Ae.size && (Ae.clear(), Et(), t = true), yo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    le(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), y(), Zt();
  };
  window.__hekatanEscapeCancel = Ho;
  const Wo = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Ae.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (t[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = t[+n[1]] || [], i = a[+n[2]], r = a[+n[2] + 1];
        i != null && o.add(i), r != null && o.add(r);
      }
    }), o;
  }, Jo = (t, o, s) => {
    var _a2;
    const n = Wo();
    if (!n.size) return 0;
    Bt();
    const a = e.points.rawVal.map((i, r) => n.has(r) ? [i[0] + t, i[1] + o, i[2] + s] : i);
    e.points.val = a;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Et(), y(), n.size;
  };
  window.__hekatanMoveSelection = Jo;
  const Oo = (t, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!Ae.size) {
      le(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Zt();
      return;
    }
    if (Ye.push(o), Ye.length === 1) {
      I = o, le(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Zt();
      return;
    }
    const [s, n] = Ye, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    Ye = [], de.visible = false;
    let i = 0;
    t === "move" ? i = Jo(a[0], a[1], a[2]) : (i = Wo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), le(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), t === "move" && (Ae.clear(), Et()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Zt();
  };
  window.__hekatanPasoMoverCopiar = Oo;
  const Ds = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), xo = (t, o, s, n, a, i) => {
    const r = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], h = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], m = [t[0] - s[0], t[1] - s[1], t[2] - s[2]], x = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], M = r[0] * h[0] + r[1] * h[1] + r[2] * h[2], _ = h[0] * h[0] + h[1] * h[1] + h[2] * h[2], d = r[0] * m[0] + r[1] * m[1] + r[2] * m[2], T = h[0] * m[0] + h[1] * m[1] + h[2] * m[2], ne = x * _ - M * M;
    if (ne < 1e-12) return null;
    const q = (M * T - _ * d) / ne, Y = (x * T - M * d) / ne;
    if (!a && (q < -1e-6 || q > 1 + 1e-6) || !i && (Y < -1e-6 || Y > 1 + 1e-6)) return null;
    const g = [t[0] + q * r[0], t[1] + q * r[1], t[2] + q * r[2]], z = [s[0] + Y * h[0], s[1] + Y * h[1], s[2] + Y * h[2]];
    return jt(g, z) > 1e-4 ? null : g;
  }, Bs = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === t).length, 0);
  }, Xs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Ns = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal, n = e.points.rawVal, a = Xs[t];
    if (!St) {
      if (Ze < 0) {
        le(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      St = { poly: Ze, seg: Math.max(0, Qe) }, le(t === "offset" ? `DESFASE l\xEDnea #${St.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${rn > 0 ? ` (${rn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Zt();
      return;
    }
    if (t === "offset") {
      const q = St.poly, Y = s[q];
      if (!Y || Y.length < 2) {
        St = null, le("DESFASE: esa polil\xEDnea no tiene tramos."), Zt();
        return;
      }
      const g = Y.length > 2 && Y[0] === Y[Y.length - 1], z = Ds(), A = [];
      for (let $e = 0; $e < Y.length - 1; $e++) {
        const tt = n[Y[$e]], Xe = n[Y[$e + 1]], ke = [Xe[0] - tt[0], Xe[1] - tt[1], Xe[2] - tt[2]], Re = Math.hypot(ke[0], ke[1], ke[2]) || 1, Oe = ke[0] / Re, Lt = ke[1] / Re, Xt = ke[2] / Re, It = [z[1] * Xt - z[2] * Lt, z[2] * Oe - z[0] * Xt, z[0] * Lt - z[1] * Oe], Qt = Math.hypot(It[0], It[1], It[2]) || 1;
        A.push({ a: tt, b: Xe, n: [It[0] / Qt, It[1] / Qt, It[2] / Qt] });
      }
      let Z = 0, H = 1 / 0;
      A.forEach(($e, tt) => {
        const Xe = on(o[0], o[1], o[2], $e.a[0], $e.a[1], $e.a[2], $e.b[0], $e.b[1], $e.b[2]);
        Xe < H && (H = Xe, Z = tt);
      });
      const U = A[Z], O = Math.sign((o[0] - U.a[0]) * U.n[0] + (o[1] - U.a[1]) * U.n[1] + (o[2] - U.a[2]) * U.n[2]) || 1, ye = rn > 0 ? rn : H;
      if (ye < 1e-6) {
        le("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const xe = A.map(($e) => ({ a: [$e.a[0] + O * ye * $e.n[0], $e.a[1] + O * ye * $e.n[1], $e.a[2] + O * ye * $e.n[2]], b: [$e.b[0] + O * ye * $e.n[0], $e.b[1] + O * ye * $e.n[1], $e.b[2] + O * ye * $e.n[2]] })), Pe = xe.length, Je = ($e) => {
        const tt = xe[($e - 1 + Pe) % Pe], Xe = xe[$e % Pe];
        return xo(tt.a, tt.b, Xe.a, Xe.b, true, true) ?? Xe.a;
      }, Ie = [], st = g ? Pe : Pe + 1;
      for (let $e = 0; $e < st; $e++) !g && $e === 0 ? Ie.push(xe[0].a) : !g && $e === Pe ? Ie.push(xe[Pe - 1].b) : Ie.push(Je($e));
      Bt();
      const et = n.length;
      e.points.val = [...n, ...Ie];
      const lt = Ie.map(($e, tt) => et + tt);
      g && lt.push(et);
      let He = s.slice();
      He.length && He[He.length - 1].length === 0 && (He = He.slice(0, -1)), e.polylines.val = [...He, lt, []], St = null, le(`\u2713 Desfase a ${ye.toFixed(2)} m \u2014 ${Pe} tramo${Pe === 1 ? "" : "s"} nuevo${Pe === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      y(), Zt();
      return;
    }
    let i = Ze, r = Math.max(0, Qe);
    if (i < 0 || i === St.poly && r === St.seg) {
      let Y = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, s.forEach((g, z) => {
        for (let A = 0; A < g.length - 1; A++) {
          if (z === St.poly && A === St.seg) continue;
          const Z = n[g[A]], H = n[g[A + 1]];
          if (!Z || !H) continue;
          const U = on(o[0], o[1], o[2], Z[0], Z[1], Z[2], H[0], H[1], H[2]);
          U < Y && (Y = U, i = z, r = A);
        }
      }), i < 0) {
        le(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const h = s[St.poly], m = n[h[St.seg]], x = n[h[St.seg + 1]], M = s[i], _ = M[r], d = M[r + 1];
    if (!m || !x || _ == null || d == null) {
      le(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const T = n[_], ne = n[d];
    if (t === "trim") {
      const q = xo(T, ne, m, x, false, false);
      if (!q) {
        le("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Bt();
      const Y = n.length;
      e.points.val = [...n, q];
      const g = [...M.slice(0, r + 1), Y, ...M.slice(r + 1)];
      e.polylines.val = s.map((A, Z) => Z === i ? g : A);
      const z = jt(o, T) < jt(o, ne);
      Ln(i, z ? r : r + 1), le(`\u2713 Recortado en (${q[0].toFixed(2)}, ${q[1].toFixed(2)}, ${q[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const q = xo(T, ne, m, x, true, false);
      if (!q) {
        le("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const g = jt(o, T) < jt(o, ne) ? r : r + 1;
      if (g !== 0 && g !== M.length - 1) {
        le("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const z = M[g];
      if (jt(q, T) + jt(q, ne) < jt(T, ne) + 1e-6) {
        le("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Bt(), Bs(z) > 1) {
        const Z = n.length;
        e.points.val = [...n, q];
        const H = M.slice();
        H[g] = Z, e.polylines.val = s.map((U, O) => O === i ? H : U);
      } else e.points.val = n.map((Z, H) => H === z ? q : Z);
      le(`\u2713 Alargada hasta (${q[0].toFixed(2)}, ${q[1].toFixed(2)}, ${q[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    y(), Zt();
  };
  window.__hekatanSelectionSize = () => Ae.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return Ae.clear(), o >= 0 && Ae.add(`poly:${o}`), Et(), le(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ae.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Ae.clear();
    const s = /* @__PURE__ */ new Set();
    return t.forEach((n, a) => {
      !n || n.length < 2 || (Ae.add(`poly:${a}`), n.forEach((i) => s.add(i)));
    }), o.forEach((n, a) => {
      s.has(a) || Ae.add(`pt:${a}`);
    }), Et(), le(`SELECCI\xD3N ${Ae.size} objetos (todo el modelo) \xB7 Esc suelta`), Ae.size;
  }, window.__hekatanReplicateSelection = (t, o, s, n, a = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const i = [...Ae], r = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), x = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), _ = [];
    if (i.forEach((Y) => {
      if (Y.startsWith("pt:")) {
        const g = +Y.slice(3);
        r[g] && x.add(g);
      } else if (Y.startsWith("poly:")) {
        const g = +Y.slice(5);
        if (!h[g] || h[g].length < 2) return;
        M.add(g), h[g].forEach((z) => x.add(z));
      } else if (Y.startsWith("seg:")) {
        const g = Y.split(":"), z = +g[1], A = +g[2], Z = h[z] || [], H = Z[A], U = Z[A + 1];
        H != null && U != null && (_.push([H, U]), x.add(H), x.add(U));
      }
    }), !x.size) return 0;
    Bt();
    const d = [...r];
    let T = h.slice();
    T.length && T[T.length - 1].length === 0 && (T = T.slice(0, -1));
    const ne = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], q = [...x];
    for (let Y = 1; Y <= n; Y++) {
      const g = a + Y, z = t * g, A = o * g, Z = s * g, H = /* @__PURE__ */ new Map();
      q.forEach((U) => {
        H.set(U, d.length), d.push([r[U][0] + z, r[U][1] + A, r[U][2] + Z]);
      }), M.forEach((U) => {
        const O = h[U].map((xe) => H.has(xe) ? H.get(xe) : xe), ye = T.length;
        T.push(O), m.has(U) && ne.push(ye);
      }), _.forEach(([U, O]) => {
        T.push([H.get(U), H.get(O)]);
      });
    }
    T.push([]), e.points.val = d, e.polylines && (e.polylines.val = T), e.areas && (e.areas.val = ne);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return y(), n;
  }, window.__hekatanVoladoSelection = (t, o = {}) => {
    var _a2, _b, _c;
    const s = Number(t);
    if (!Number.isFinite(s) || Math.abs(s) < 1e-6) return 0;
    const n = o.losa !== false, a = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", r = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = [];
    if ([...Ae].forEach((q) => {
      if (q.startsWith("seg:")) {
        const Y = q.split(":"), g = +Y[1], z = +Y[2], A = h[g] || [], Z = A[z], H = A[z + 1];
        Z != null && H != null && m.push([Z, H]);
      } else if (q.startsWith("poly:")) {
        const Y = h[+q.slice(5)] || [];
        for (let g = 0; g + 1 < Y.length; g++) m.push([Y[g], Y[g + 1]]);
      }
    }), !m.length) return 0;
    let x = 0, M = 0;
    for (const q of r) x += q[0], M += q[1];
    x /= Math.max(1, r.length), M /= Math.max(1, r.length), Bt();
    const _ = [...r];
    let d = h.slice();
    d.length && d[d.length - 1].length === 0 && (d = d.slice(0, -1));
    const T = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let ne = 0;
    for (const [q, Y] of m) {
      const g = r[q], z = r[Y];
      if (!g || !z) continue;
      const A = z[0] - g[0], Z = z[1] - g[1], H = Math.hypot(A, Z);
      if (H < 1e-6) continue;
      let U = -Z / H, O = A / H;
      const ye = (g[0] + z[0]) / 2, xe = (g[1] + z[1]) / 2;
      (ye - x) * U + (xe - M) * O < 0 && (U = -U, O = -O);
      const Pe = i === "ambos" ? [1, -1] : [1];
      for (const Je of Pe) {
        const Ie = U * s * Je, st = O * s * Je, et = _.length;
        _.push([g[0] + Ie, g[1] + st, g[2]]);
        const lt = _.length;
        _.push([z[0] + Ie, z[1] + st, z[2]]), d.push([q, et]), d.push([Y, lt]), a && d.push([et, lt]), n && (T.push(d.length), d.push([q, Y, lt, et, q])), ne++;
      }
    }
    if (!ne) return 0;
    d.push([]), e.points.val = _, e.polylines && (e.polylines.val = d), e.areas && (e.areas.val = T);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return y(), ne;
  }, b.addEventListener("click", (t) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: t.clientX, y: t.clientY }, ln > 5) {
      ln = 0;
      return;
    }
    ln = 0;
    const o = v(t);
    if (!o) return;
    P.setFromCamera(E, o);
    const s = G();
    if (!s.length) return;
    {
      const a = o.position.distanceTo(u.target) || 1, i = s[0].distance ?? o.position.distanceTo(s[0].point), r = s[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(a * 12, 300)) {
        le("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = s[0].point;
    (t.ctrlKey || t.metaKey) && (n = new k(Math.round(s[0].point.x), Math.round(s[0].point.y), Math.round(s[0].point.z)));
    {
      const a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = a[a.length - 1] ?? [], r = e.points.rawVal ?? [];
      if (i.length > 0) {
        const h = r[i[i.length - 1]];
        if (h) {
          const m = !!window.__hekatanOrthoMode;
          let x = ot;
          if (!x && m) {
            const M = Math.abs(n.x - h[0]), _ = Math.abs(n.y - h[1]), d = Math.abs(n.z - h[2]);
            x = M >= _ && M >= d ? "x" : _ >= d ? "y" : "z";
          }
          x === "x" ? n = new k(n.x, h[1], h[2]) : x === "y" ? n = new k(h[0], n.y, h[2]) : x === "z" && (n = new k(h[0], h[1], n.z));
        }
      }
    }
    if (Ue && Math.abs(t.clientX - Ue.x) <= 3 && Math.abs(t.clientY - Ue.y) <= 3) n = Ue.p.clone();
    else if (Mt) n = Mt.clone(), le(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n = new k(i.x, i.y, i.z), le(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0;
        r && h > 0 && (n = new k(Math.round(n.x / h) * h, Math.round(n.y / h) * h, Math.round(n.z / h) * h));
      }
    }
    Qo(n, t);
  });
  const Qo = (t, o) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (Ut) {
        Yt && Bn();
        const { kind: n, a, b: i } = Ut, r = i !== void 0 ? `${n}:${a}:${i}` : `${n}:${a}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Ae.clear(), Ae.has(r) ? Ae.delete(r) : Ae.add(r), Et(), le(`\u2713 Seleccionados ${Ae.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), a = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Yt ? (Ro(Yt.x, Yt.y, a, i, n), Yt = null) : n || (Yt = { x: a, y: i }, le("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), po(a, i, a + 1, i + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], le(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const a = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], a);
      le(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      Oo(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "delete") {
      if (yt >= 0) {
        const n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = yt;
        if (i >= 0 && i < a.length) {
          Bt();
          const r = a.slice(0, i).concat(a.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = r : window.__hekatanDrawingAuxLines = r, le(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), yt = -1, it.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (Ze >= 0) {
        const n = Ze, a = Qe;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (sn(n), le(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : a >= 0 ? (Ln(n, a), le(`\u{1F5D1} Segmento ${a + 1} de polil\xEDnea #${n + 1} borrado`)) : (sn(n), le(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else le("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if (Ye.push([t.x, t.y, t.z]), Ye.length === 1) {
        le("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, a] = Ye, i = Math.hypot(a[0] - n[0], a[1] - n[1], a[2] - n[2]);
      Math.abs(a[0] - n[0]);
      const r = Math.abs(a[1] - n[1]), m = Math.abs(a[2] - n[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", x = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, x, m), le(`\u2713 C\xEDrculo dibujado en ${m.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${x} segmentos`), Ye = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (s === "arc") {
      if (Ye.push([t.x, t.y, t.z]), Ye.length === 1) {
        le("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ye.length === 2) {
        le("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, a, i] = Ye, r = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, a, i, r), le(`\u2713 Arco dibujado \u2014 ${r} segmentos`), Ye = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (s === "rect") {
      if (Ye.push([t.x, t.y, t.z]), Ye.length === 1) {
        le("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ye;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, a), le(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Ye = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if (Ye.push([t.x, t.y, t.z]), Ye.length === 1) {
        le("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ye;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, a), le(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Ye = [];
      return;
    }
    if (s === "polyarea") {
      me.push([t.x, t.y, t.z]), J.geometry.setFromPoints(me.map((n) => new k(n[0], n[1], n[2]))), J.visible = me.length >= 1, le(`\u25B0 \xC1rea libre \u2014 ${me.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), y();
      return;
    }
    if (s === "plane3") {
      if (Ye.push([t.x, t.y, t.z]), Ye.length < 3) {
        le(`\u25E3 Plano inclinado \u2014 punto ${Ye.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, a, i] = Ye, r = (_o = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o.call(window, n, a, i);
      le(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ye = [];
      return;
    }
    if (s === "col") {
      Bt();
      const n = t.z, a = gt && gt > 0 ? gt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + a]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], gt = 0, le(`\u258C Columna creada \u2014 h=${a.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if (Ye.push([t.x, t.y, t.z]), Ye.length === 1) {
        le("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, a] = Ye, i = gt && gt > 0 ? gt : 3;
      Bt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [a[0], a[1], a[2]], [a[0], a[1], a[2] + i], [n[0], n[1], n[2] + i]];
      const h = e.polylines.rawVal;
      if (h.length - 1, e.polylines.val = [...h.slice(0, -1), ...h[h.length - 1].length > 0 ? [h[h.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const m = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, m];
      }
      le(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ye = [], gt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      Bt();
      const n = gt && gt > 0 ? gt : 3, a = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, a], [t.x, t.y, a + n]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], gt = 0, le(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, a = vn(t.x, t.y, t.z, n);
      if (!a) {
        le("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, r = e.points.rawVal, h = i[a.polyIdx], m = r[h[a.segIdx]], x = r[h[a.segIdx + 1]];
      if (!m || !x) {
        le("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const M = gt && gt > 0 ? gt : 3;
      Bt();
      const _ = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [m[0], m[1], m[2]], [x[0], x[1], x[2]], [x[0], x[1], x[2] + M], [m[0], m[1], m[2] + M]];
      const d = e.polylines.rawVal;
      if (e.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [_, _ + 1, _ + 2, _ + 3, _], []], e.areas) {
        const T = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, T];
      }
      gt = 0, le(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${M.toFixed(2)}m`);
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (s === "auxp") {
      const n = window.__hekatanDrawingAuxPoints;
      if (n) {
        const a = n.rawVal ?? n.val ?? [];
        n.val = [...a, [t.x, t.y, t.z]];
      }
      le(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if (Ye.push([t.x, t.y, t.z]), Ye.length === 1) {
        le("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, a] = Ye, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const M = i.rawVal ?? i.val ?? [];
        i.val = [...M, [n[0], n[1], n[2], a[0], a[1], a[2]]];
      }
      const r = a[0] - n[0], h = a[1] - n[1], m = a[2] - n[2], x = Math.sqrt(r * r + h * h + m * m);
      le(`\u2713 L\xEDnea auxiliar creada \u2014 L=${x.toFixed(2)}m (cyan, no FEM)`), Ye = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Ns(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "chaflan") {
      if (Ye.push([t.x, t.y, t.z]), Ye.length === 1) {
        le("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ye, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, a, i, r, 6);
      const h = Math.abs(a[0] - n[0]).toFixed(1), m = Math.abs(a[1] - n[1]).toFixed(1);
      le(`\u2713 Losa con chaflanes dibujada \u2014 ${h}\xD7${m}m, r=${i}m, ${r} seg/chafl\xE1n`), Ye = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (F = false, Bt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, a = n.length - 1, i = n[a] ?? [];
      if (s === "line" && i.length >= 2) {
        le(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, a]), le("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") le(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (s === "line") le("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") le("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      le(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  b.addEventListener("click", () => Zt()), b.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && me.length >= 3) {
      t.preventDefault();
      const s = pn();
      le(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), b.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = v(t);
    if (!o) return;
    P.setFromCamera(E, o);
    const s = G();
    if (ce.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], h = r[r.length - 1] ?? [], m = e.points.rawVal ?? [];
        if (h.length > 0) {
          const x = m[h[h.length - 1]];
          if (x) {
            const M = !!window.__hekatanOrthoMode;
            let _ = ot;
            if (!_ && M) {
              const d = Math.abs(n.x - x[0]), T = Math.abs(n.y - x[1]), ne = Math.abs(n.z - x[2]);
              _ = d >= T && d >= ne ? "x" : T >= ne ? "y" : "z";
            }
            _ === "x" ? n.set(n.x, x[1], x[2]) : _ === "y" ? n.set(x[0], n.y, x[2]) : _ === "z" && n.set(x[0], x[1], n.z);
          }
        }
      }
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0.5;
        r && h > 0 && (n.x = Math.round(n.x / h) * h, n.y = Math.round(n.y / h) * h, n.z = Math.round(n.z / h) * h);
      }
      ce.geometry.setAttribute("position", new kt(n.toArray(), 3));
    }
    y();
  }), b.addEventListener("pointermove", (t) => {
    var _a2;
    const o = v(t);
    if (!o) return;
    P.setFromCamera(E, o);
    let s = false;
    const n = P.intersectObject(W), a = G();
    if (n.length && a.length) {
      const i = new k(...e.points.rawVal[n[0].index]), r = new k(...a[0].point), h = i.sub(r), m = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      m.transformDirection(j.matrixWorld), Math.abs(h.dot(m)) < 1e-4 && (s = true);
    }
    ce.visible = !s;
  });
  let go = false, vo;
  b.addEventListener("pointermove", (t) => {
    var _a2;
    if (!ln) return;
    const o = v(t);
    if (!o) return;
    P.setFromCamera(E, o);
    let s = false;
    const n = P.intersectObject(W), a = G();
    if (n.length && a.length) {
      const r = new k(...e.points.rawVal[n[0].index]), h = new k(...a[0].point), m = r.sub(h), x = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      x.transformDirection(j.matrixWorld), Math.abs(m.dot(x)) < 1e-4 && (s = true);
    }
    if (s && ln < 5 && (go = true, u.enabled = false, vo = n[0].index), !go || ln % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (vo !== void 0) {
      let r = a[0].point;
      (t.ctrlKey || t.metaKey) && (r = new k(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[vo] = r.toArray();
    }
    e.points.val = i;
  }), b.addEventListener("pointerup", () => {
    u.enabled = true, go = false;
  }), b.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = v(t);
    if (!o) return;
    P.setFromCamera(E, o);
    let s = false;
    const n = P.intersectObject(W), a = G();
    if (n.length && a.length) {
      const h = new k(...e.points.rawVal[n[0].index]), m = new k(...a[0].point), x = h.sub(m), M = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      M.transformDirection(j.matrixWorld), Math.abs(x.dot(M)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((h) => h.filter((m) => m !== n[0].index)).map((h) => h.map((m) => m > n[0].index ? m - 1 : m)).filter((h) => h.length);
    r.push([]), e.polylines.val = r;
  });
}
function Ea(e, l, c) {
  const w = Math.round(14.999999999999998), f = { position: e.position.clone(), quaternion: e.quaternion.clone() }, b = setInterval(P, 1e3 / 30);
  let y = 0;
  function P() {
    y++;
    const E = y / w;
    e.position.lerpVectors(f.position, l.position, E), e.quaternion.slerpQuaternions(f.quaternion, l.quaternion, E), c && c(), y == w && clearInterval(b);
  }
}
function Va(e, l, c, p) {
  const u = ca(c, e.elements, p);
  return te.derive(() => {
    u.visible = l.shellResults.val != "none";
  }), u;
}
const Ta = 6, Fo = 10, $a = 0.012;
function La(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ia(e, l, c, p) {
  if (!c && !p) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && c) {
    const w = c[e];
    if (w && w.has(l)) return w.get(l);
  }
  return null;
}
function Ra(e, l, c, p) {
  const u = new rt(), w = new Ms();
  w.setColorMap("rainbow");
  const f = new Ht(), b = te.state([]);
  return te.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const y = c.val, P = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], E = La(l.frameResults.val);
    if (u.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), u.clear(), !E || P.length === 0 || y.length === 0) {
      b.val = [];
      return;
    }
    const v = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, j = (_c = e.deformOutputs) == null ? void 0 : _c.val, ue = [], ge = [];
    for (let $ = 0; $ < P.length; $++) {
      if (P[$].length !== 2) continue;
      const fe = Ia(E, $, v, j);
      fe && (ue.push(fe[0], fe[1]), ge.push({ idx: $, vals: fe }));
    }
    if (ue.length === 0) {
      b.val = [];
      return;
    }
    const re = Math.min(...ue), L = Math.max(...ue);
    w.setMin(re), w.setMax(L), b.val = ue;
    const G = [1 / 0, 1 / 0, 1 / 0], W = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of y) for (let ee = 0; ee < 3; ee++) G[ee] = Math.min(G[ee], $[ee]), W[ee] = Math.max(W[ee], $[ee]);
    const pe = Math.max(W[0] - G[0], W[1] - G[1], W[2] - G[2], 1) * $a, V = [], I = [], N = [];
    let F = 0;
    for (const { idx: $, vals: ee } of ge) {
      const fe = P[$], ae = y[fe[0]], se = y[fe[1]];
      if (!ae || !se) continue;
      const B = new k(se[0] - ae[0], se[1] - ae[1], se[2] - ae[2]), de = B.length();
      if (de < 1e-10) continue;
      B.normalize();
      const J = Math.abs(B.y) < 0.99 ? new k(0, 1, 0) : new k(1, 0, 0), me = new k().crossVectors(B, J).normalize(), he = new k().crossVectors(B, me).normalize(), Ve = Fo + 1, be = Ta;
      for (let Be = 0; Be < Ve; Be++) {
        const We = Be / Fo, at = ae[0] + B.x * de * We, ft = ae[1] + B.y * de * We, S = ae[2] + B.z * de * We, D = ee[0] + (ee[1] - ee[0]) * We, Q = w.getColor(D) ?? new Ht(0, 0, 0);
        f.copy(Q).convertSRGBToLinear();
        for (let K = 0; K < be; K++) {
          const ve = K / be * Math.PI * 2, oe = Math.cos(ve), Me = Math.sin(ve);
          V.push(at + (me.x * oe + he.x * Me) * pe, ft + (me.y * oe + he.y * Me) * pe, S + (me.z * oe + he.z * Me) * pe), I.push(f.r, f.g, f.b);
        }
      }
      for (let Be = 0; Be < Fo; Be++) for (let We = 0; We < be; We++) {
        const at = (We + 1) % be, ft = F + Be * be + We, S = F + Be * be + at, D = F + (Be + 1) * be + We, Q = F + (Be + 1) * be + at;
        N.push(ft, S, Q), N.push(ft, Q, D);
      }
      F += Ve * be;
    }
    if (V.length === 0) return;
    const C = new Ce();
    C.setAttribute("position", new kt(V, 3)), C.setAttribute("color", new kt(I, 3)), C.setIndex(N), C.computeVertexNormals();
    const R = new ut({ vertexColors: true, side: zt }), X = new ct(C, R);
    X.frustumCulled = false, u.add(X);
  }), u.__colorMapValues = b, u;
}
function Da() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ba = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Xa = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Na = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function vt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Ya = 16755200, hs = 56831, Za = 56831, Ua = 56831, Jn = 65382;
function qa(e) {
  const l = new rt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const c = new xn(1, 16, 16), p = new ut({ color: Ya, transparent: true, opacity: 0.85, depthTest: false }), u = new ct(c, p);
  u.visible = false, u.renderOrder = 100, l.add(u);
  const w = new Ce(), f = new ht({ color: hs, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), b = new Wt(w, f);
  b.visible = false, b.renderOrder = 100, l.add(b);
  const y = new ut({ color: hs, transparent: true, opacity: 0.7, depthTest: false }), P = new ct(new cs(1, 1, 1, 12), y);
  P.visible = false, P.renderOrder = 100, l.add(P);
  const E = new Ce(), v = new ut({ color: Za, transparent: true, opacity: 0.45, side: zt, depthTest: false }), j = new ct(E, v);
  j.visible = false, j.renderOrder = 100, l.add(j);
  const ue = new Ce(), ge = new ht({ color: Ua, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), re = new Wt(ue, ge);
  re.visible = false, re.renderOrder = 100, l.add(re);
  const L = new ut({ color: Jn, transparent: true, opacity: 0.95, depthTest: false }), G = new ut({ color: Jn, transparent: true, opacity: 0.85, depthTest: false }), W = new cs(1, 1, 1, 12), ce = new ut({ color: Jn, transparent: true, opacity: 0.55, side: zt, depthTest: false }), pe = new ht({ color: Jn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), V = [];
  window.__hekatanModelSelection = V;
  const I = new rt();
  I.renderOrder = 101, l.add(I);
  const N = document.createElement("div");
  Object.assign(N.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), N.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(N);
  }, 0);
  function F(S) {
    const D = e.derivedNodes.rawVal;
    return !D || S < 0 || S >= D.length ? null : new k(D[S][0], D[S][1], D[S][2]);
  }
  function C(S, D) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const Q = e.getActiveCamera();
    if (!Q || !e.mesh) return null;
    const K = e.rendererElm.getBoundingClientRect(), ve = S - K.left, oe = D - K.top, Me = e.derivedNodes.rawVal, _e = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!Me || !_e) return null;
    const Ne = /* @__PURE__ */ new Map(), De = (Ue) => {
      if (Ne.has(Ue)) return Ne.get(Ue);
      const ze = F(Ue);
      if (!ze) return Ne.set(Ue, null), null;
      const Le = ze.clone().project(Q), Ke = (Le.x * 0.5 + 0.5) * K.width, Fe = (-Le.y * 0.5 + 0.5) * K.height, dt = { x: Ke, y: Fe, z: Le.z };
      return Ne.set(Ue, dt), dt;
    }, we = /* @__PURE__ */ new Set();
    for (const Ue of _e) if (Ue) for (const ze of Ue) we.add(ze);
    const Se = 8;
    let Te = -1, qe = Se;
    for (let Ue = 0; Ue < Me.length; Ue++) {
      if (!we.has(Ue)) continue;
      const ze = De(Ue);
      if (!ze || ze.z < -1 || ze.z > 1) continue;
      const Le = ze.x - ve, Ke = ze.y - oe, Fe = Math.sqrt(Le * Le + Ke * Ke);
      Fe < qe && (qe = Fe, Te = Ue);
    }
    const Ee = Da(), nt = Xa[Ee.dispUnit] ?? 1e3, Ge = Ba[Ee.forceUnit] ?? 1;
    if (Te >= 0) {
      const Ue = Me[Te];
      let ze = `Nodo ${Te}
(${Ue[0].toFixed(3)}, ${Ue[1].toFixed(3)}, ${Ue[2].toFixed(3)})`;
      const Le = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Le == null ? void 0 : Le.deformations) {
        const Ke = Le.deformations.get(Te);
        if (Ke && (ze += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, ze += `
Ux = ${vt(Ke[0] * nt, 3)} ${Ee.dispUnit}`, ze += `
Uy = ${vt(Ke[1] * nt, 3)} ${Ee.dispUnit}`, ze += `
Uz = ${vt(Ke[2] * nt, 3)} ${Ee.dispUnit}`, (Math.abs(Ke[3]) > 1e-9 || Math.abs(Ke[4]) > 1e-9 || Math.abs(Ke[5]) > 1e-9) && (ze += `
Rx = ${vt(Ke[3] * 1e3, 3)} mrad`, ze += `
Ry = ${vt(Ke[4] * 1e3, 3)} mrad`, ze += `
Rz = ${vt(Ke[5] * 1e3, 3)} mrad`)), Le.reactions) {
          const Fe = Le.reactions.get(Te);
          Fe && (Math.abs(Fe[0]) > 1e-9 || Math.abs(Fe[1]) > 1e-9 || Math.abs(Fe[2]) > 1e-9 || Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (ze += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, ze += `
Fx = ${vt(Fe[0] * Ge)} ${Ee.forceUnit}`, ze += `
Fy = ${vt(Fe[1] * Ge)} ${Ee.forceUnit}`, ze += `
Fz = ${vt(Fe[2] * Ge)} ${Ee.forceUnit}`, (Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (ze += `
Mx = ${vt(Fe[3] * Ge)} ${Ee.forceUnit}\xB7m`, ze += `
My = ${vt(Fe[4] * Ge)} ${Ee.forceUnit}\xB7m`, ze += `
Mz = ${vt(Fe[5] * Ge)} ${Ee.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Te, info: ze };
    }
    const Nt = 5;
    let je = -1, ot = Nt, Mt = "frame";
    for (let Ue = 0; Ue < _e.length; Ue++) {
      const ze = _e[Ue];
      if (!(!ze || ze.length < 2)) {
        if (ze.length === 2) {
          const Le = De(ze[0]), Ke = De(ze[1]);
          if (!Le || !Ke || Le.z < -1 || Le.z > 1 || Ke.z < -1 || Ke.z > 1) continue;
          const Fe = Ka(ve, oe, Le.x, Le.y, Ke.x, Ke.y);
          Fe < ot && (ot = Fe, je = Ue, Mt = "frame");
        } else if (ze.length === 3 || ze.length === 4) {
          const Le = [];
          let Ke = true;
          for (const Fe of ze) {
            const dt = De(Fe);
            if (!dt || dt.z < -1 || dt.z > 1) {
              Ke = false;
              break;
            }
            Le.push(dt);
          }
          if (!Ke) continue;
          if (Ga(ve, oe, Le)) {
            const dt = Le.reduce((mt, it) => mt + it.z, 0) / Le.length * 1e-3;
            dt < ot && (ot = dt, je = Ue, Mt = "shell");
          }
        } else if (ze.length === 8) {
          const Le = [];
          let Ke = true;
          for (const Ze of ze) {
            const Qe = De(Ze);
            if (!Qe || Qe.z < -1 || Qe.z > 1) {
              Ke = false;
              break;
            }
            Le.push(Qe);
          }
          if (!Ke) continue;
          const Fe = Math.min(...Le.map((Ze) => Ze.x)), dt = Math.max(...Le.map((Ze) => Ze.x)), mt = Math.min(...Le.map((Ze) => Ze.y)), it = Math.max(...Le.map((Ze) => Ze.y));
          if (ve >= Fe && ve <= dt && oe >= mt && oe <= it) {
            const Qe = Le.reduce((yt, Ae) => yt + Ae.z, 0) / Le.length * 1e-3;
            Qe < ot && (ot = Qe, je = Ue, Mt = "solid");
          }
        }
      }
    }
    if (je >= 0) {
      const Ue = _e[je];
      let Le = `${Mt === "frame" ? "Frame" : Mt === "shell" ? "Shell" : "Solid"} ${je}`;
      const Ke = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Fe = (_g = (_f = Ke == null ? void 0 : Ke.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, je);
      if (Fe) {
        Fe.name && (Le += `
  \u{1F4CB} ${Fe.name}`), Fe.shape && (Le += `
  Shape: ${Fe.shape}`);
        const dt = /concrete|hormig|rect.*sólida/i.test(Fe.shape || ""), mt = dt ? 100 : 1e3, it = dt ? "cm" : "mm", Ze = (yt) => {
          const Ae = yt * mt;
          return Math.abs(Ae - Math.round(Ae)) < 0.05 ? `${Math.round(Ae)}` : `${Ae.toFixed(1)}`;
        }, Qe = [];
        if (Fe.D != null && Qe.push(`D=${Ze(Fe.D)}`), Fe.B != null && Qe.push(`B=${Ze(Fe.B)}`), Fe.TF != null && Qe.push(`TF=${Ze(Fe.TF)}`), Fe.TW != null && Qe.push(`TW=${Ze(Fe.TW)}`), Fe.t != null && Qe.push(`t=${Ze(Fe.t)}`), Qe.length && (Le += `
  Dim: ${Qe.join(" ")} ${it}`), Fe.material) {
          let yt = Fe.material;
          Fe.fillMaterial && (yt += ` + FILL "${Fe.fillMaterial}"`), Le += `
  Mat: ${yt}`;
        }
      } else {
        const dt = (_i = (_h = Ke == null ? void 0 : Ke.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, je), mt = (_k = (_j = Ke == null ? void 0 : Ke.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, je);
        dt ? (Le += `
  ${dt}`, mt && !dt.includes(mt) && (Le += `  (${mt})`)) : mt && (Le += `
  Material: ${mt}`);
      }
      if (Le += `
nodos: [${Ue.join(", ")}]`, Mt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const dt = e.mesh.analyzeOutputs.rawVal, mt = Na[Ee.stressUnit] ?? 1, it = [["bendingXX", "Mxx", Ge, `${Ee.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ge, `${Ee.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ge, `${Ee.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ge, `${Ee.forceUnit}/m`], ["membraneYY", "Nyy", Ge, `${Ee.forceUnit}/m`], ["membraneXY", "Nxy", Ge, `${Ee.forceUnit}/m`], ["shearX", "Qx", Ge, `${Ee.forceUnit}/m`], ["shearY", "Qy", Ge, `${Ee.forceUnit}/m`], ["vonMises", "\u03C3VM", mt, Ee.stressUnit], ["pressure", "p", mt, Ee.stressUnit]], Ze = [];
        for (const [Qe, yt, Ae, Ft] of it) {
          const bt = dt == null ? void 0 : dt[Qe];
          if (bt && bt instanceof Map) {
            const Rt = bt.get(je);
            if (Rt != null) {
              if (typeof Rt == "number") Ze.push(`${yt} = ${vt(Rt * Ae, 3)} ${Ft}`);
              else if (Array.isArray(Rt)) {
                let At = Rt[0];
                for (const Tt of Rt) Math.abs(Tt) > Math.abs(At) && (At = Tt);
                Ze.push(`${yt} = ${vt(At * Ae, 3)} ${Ft}`);
              }
            }
          }
        }
        Ze.length > 0 && (Le += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ze.slice(0, 8).join(`
`));
      }
      if (Mt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const dt = e.mesh.deformOutputs.rawVal, mt = e.mesh.elementInputs.rawVal, it = dt == null ? void 0 : dt.deformations;
        if (it && Ue.length === 2) {
          const Ze = it.get(Ue[0]), Qe = it.get(Ue[1]), yt = Me[Ue[0]], Ae = Me[Ue[1]];
          if (Ze && Qe && yt && Ae) {
            const Ft = Ae[0] - yt[0], bt = Ae[1] - yt[1], Rt = Ae[2] - yt[2], At = Math.sqrt(Ft * Ft + bt * bt + Rt * Rt);
            if (At > 1e-9) {
              const Tt = Ft / At, nn = bt / At, Ut = Rt / At, gn = (Qe[0] - Ze[0]) * Tt + (Qe[1] - Ze[1]) * nn + (Qe[2] - Ze[2]) * Ut, Et = ((_n = mt.elasticities) == null ? void 0 : _n.get(je)) ?? 0, on = ((_o = mt.areas) == null ? void 0 : _o.get(je)) ?? 0, vn = ((_p = mt.momentsOfInertiaY) == null ? void 0 : _p.get(je)) ?? 0, $n = ((_q = mt.momentsOfInertiaZ) == null ? void 0 : _q.get(je)) ?? 0, so = ((_r = mt.torsionalConstants) == null ? void 0 : _r.get(je)) ?? 0, ao = ((_s2 = mt.shearModuli) == null ? void 0 : _s2.get(je)) ?? Et / 2.6, sn = Et * on * (gn / At), Ln = (Qe[3] - Ze[3]) * Tt + (Qe[4] - Ze[4]) * nn + (Qe[5] - Ze[5]) * Ut, an = ao * so * (Ln / At), In = Qe[4] - Ze[4], Rn = Qe[5] - Ze[5], bn = Et * vn * In / At, pn = Et * $n * Rn / At;
              Le += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Le += `
L = ${vt(At, 3)} m`, Le += `
\u0394L = ${vt(gn * nt, 3)} ${Ee.dispUnit}`, Le += `
\u03B5 = ${vt(gn / At, 6)}`, Math.abs(sn) > 1e-6 && (Le += `
N \u2248 ${vt(sn * Ge)} ${Ee.forceUnit}`), Math.abs(an) > 1e-6 && (Le += `
T \u2248 ${vt(an * Ge)} ${Ee.forceUnit}\xB7m`), Math.abs(bn) > 1e-6 && (Le += `
My \u2248 ${vt(bn * Ge)} ${Ee.forceUnit}\xB7m`), Math.abs(pn) > 1e-6 && (Le += `
Mz \u2248 ${vt(pn * Ge)} ${Ee.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Mt, idx: je, info: Le };
    }
    return null;
  }
  function R(S, D, Q) {
    var _a2, _b, _c;
    if (u.visible = false, b.visible = false, P.visible = false, j.visible = false, re.visible = false, !S || !e.mesh) {
      N.style.display = "none", e.render();
      return;
    }
    const K = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (S.type === "node") {
      const _e = F(S.idx);
      if (_e) {
        const Ne = e.derivedNodes.rawVal ?? [];
        let De = 1;
        if (Ne.length >= 2) {
          let Te = [1 / 0, 1 / 0, 1 / 0], qe = [-1 / 0, -1 / 0, -1 / 0];
          for (const Ee of Ne) for (let nt = 0; nt < 3; nt++) Ee[nt] < Te[nt] && (Te[nt] = Ee[nt]), Ee[nt] > qe[nt] && (qe[nt] = Ee[nt]);
          De = Math.max(qe[0] - Te[0], qe[1] - Te[1], qe[2] - Te[2], 0.1);
        }
        const we = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Se = 0.021 * De * we;
        u.position.copy(_e), u.scale.setScalar(Se), u.visible = true;
      }
    } else if (S.type === "frame" && K) {
      const _e = K[S.idx], Ne = F(_e[0]), De = F(_e[1]);
      if (Ne && De) {
        const we = Ne.clone().add(De).multiplyScalar(0.5), Se = De.clone().sub(Ne), Te = Se.length(), nt = e.getActiveCamera().position.distanceTo(we) * 35e-4;
        P.position.copy(we);
        const Ge = new k(0, 1, 0), Nt = Ge.clone().cross(Se).normalize(), je = Ge.angleTo(Se);
        P.quaternion.setFromAxisAngle(Nt, je), P.scale.set(nt, Te, nt), P.visible = true;
      }
    } else if (S.type === "shell" && K) {
      const _e = K[S.idx], Ne = [], De = [];
      for (const we of _e) {
        const Se = F(we);
        if (!Se) return;
        Ne.push(Se.x, Se.y, Se.z);
      }
      _e.length === 4 ? De.push(0, 1, 2, 0, 2, 3) : _e.length === 3 && De.push(0, 1, 2), E.setAttribute("position", new kt(Ne, 3)), E.setIndex(De), E.computeVertexNormals(), j.visible = true;
    } else if (S.type === "solid" && K) {
      const _e = K[S.idx], Ne = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], De = [];
      for (const [we, Se] of Ne) {
        const Te = F(_e[we]), qe = F(_e[Se]);
        Te && qe && De.push(Te.x, Te.y, Te.z, qe.x, qe.y, qe.z);
      }
      ue.setAttribute("position", new kt(De, 3)), re.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      N.style.display = "none", e.render();
      return;
    }
    N.textContent = S.info, N.style.whiteSpace = "pre-line", N.style.display = "block";
    const oe = e.rendererElm.getBoundingClientRect(), Me = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? oe;
    N.style.left = `${D - Me.left}px`, N.style.top = `${Q - Me.top}px`, e.render();
  }
  let X = "", $ = 0, ee = 0;
  const fe = window.__hekatanHoverDebug ?? false, ae = (S) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const D = C(S.clientX, S.clientY);
      if (fe && ee < 5) {
        const K = e.derivedNodes.rawVal, ve = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${S.clientX}, ${S.clientY}) nodes=${(K == null ? void 0 : K.length) ?? 0} elems=${(ve == null ? void 0 : ve.length) ?? 0} hover=`, D), ee++;
      }
      const Q = D ? `${D.type}:${D.idx}` : "";
      if (Q !== X) X = Q, R(D, S.clientX, S.clientY);
      else if (D) {
        const K = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        N.style.left = `${S.clientX - K.left}px`, N.style.top = `${S.clientY - K.top}px`;
      }
    });
  };
  let se = null;
  const B = () => {
    X = "", u.visible = false, b.visible = false, P.visible = false, j.visible = false, re.visible = false, N.style.display = "none", e.render();
  }, de = (S) => {
    const D = e.rendererElm.getBoundingClientRect(), Q = S.clientX - D.left, K = S.clientY - D.top;
    (Q < -2 || K < -2 || Q > D.width + 2 || K > D.height + 2) && (se && clearTimeout(se), se = window.setTimeout(B, 200));
  }, J = () => {
    se && (clearTimeout(se), se = null);
  };
  e.rendererElm.addEventListener("pointermove", ae), e.rendererElm.addEventListener("pointerleave", de), e.rendererElm.addEventListener("pointerenter", J);
  function me() {
    var _a2, _b, _c;
    const S = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return S === "select" || S === "none" || !S;
  }
  let he = null;
  e.rendererElm.addEventListener("pointerdown", (S) => {
    S.button === 0 && (he = { x: S.clientX, y: S.clientY });
  }), e.rendererElm.addEventListener("pointerup", (S) => {
    if (S.button !== 0 || !he) return;
    const D = S.clientX - he.x, Q = S.clientY - he.y;
    if (he = null, D * D + Q * Q > 9 || !me()) return;
    const K = C(S.clientX, S.clientY);
    K ? (at({ type: K.type, idx: K.idx }, S.shiftKey), We()) : ft();
  }), window.addEventListener("keydown", (S) => {
    if (S.key !== "Escape" || !V.length) return;
    const D = document.activeElement, Q = !!D && (D.id === "hk3-cmd-input" || D.id === "hk-dyn-input") && D.value === "";
    D && (D.tagName === "INPUT" || D.tagName === "TEXTAREA" || D.isContentEditable) && !Q || ft();
  }, { capture: true });
  function Ve() {
    for (const S of I.children.slice()) {
      I.remove(S);
      const D = S.geometry;
      D && D !== c && D !== W && D.dispose();
    }
  }
  const be = (S) => {
    var _a2;
    const D = e.getActiveCamera(), Q = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return D.isOrthographicCamera ? (D.top - D.bottom) / (D.zoom || 1) / Q : 2 * D.position.distanceTo(S) * Math.tan((D.fov || 50) * Math.PI / 180 / 2) / Q;
  };
  function Be(S, D) {
    var _a2, _b;
    const Q = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (S.type === "node") {
      const K = F(S.idx);
      if (!K) return;
      const ve = new ct(c, L);
      ve.position.copy(K), ve.scale.setScalar(Math.max(1e-4, 7 * be(K))), ve.renderOrder = 101, I.add(ve);
    } else if (S.type === "frame" && Q) {
      const K = Q[S.idx], ve = F(K[0]), oe = F(K[1]);
      if (!ve || !oe) return;
      const Me = ve.clone().add(oe).multiplyScalar(0.5), _e = oe.clone().sub(ve), Ne = _e.length(), De = e.getActiveCamera().position.distanceTo(Me), we = new ct(W, G);
      we.position.copy(Me);
      const Se = new k(0, 1, 0);
      we.quaternion.setFromAxisAngle(Se.clone().cross(_e).normalize(), Se.angleTo(_e)), we.scale.set(De * 35e-4, Ne, De * 35e-4), we.renderOrder = 101, I.add(we);
    } else if (S.type === "shell" && Q) {
      const K = Q[S.idx], ve = [], oe = [];
      for (const Ne of K) {
        const De = F(Ne);
        if (!De) return;
        ve.push(De.x, De.y, De.z);
      }
      K.length === 4 ? oe.push(0, 1, 2, 0, 2, 3) : K.length === 3 && oe.push(0, 1, 2);
      const Me = new Ce();
      Me.setAttribute("position", new kt(ve, 3)), Me.setIndex(oe), Me.computeVertexNormals();
      const _e = new ct(Me, ce);
      _e.renderOrder = 101, I.add(_e);
    } else if (S.type === "solid" && Q) {
      const K = Q[S.idx], ve = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], oe = [];
      for (const [Ne, De] of ve) {
        const we = F(K[Ne]), Se = F(K[De]);
        we && Se && oe.push(we.x, we.y, we.z, Se.x, Se.y, Se.z);
      }
      const Me = new Ce();
      Me.setAttribute("position", new kt(oe, 3));
      const _e = new Wt(Me, pe);
      _e.renderOrder = 101, I.add(_e);
    }
  }
  function We() {
    if (Ve(), !V.length || !e.mesh) {
      e.render();
      return;
    }
    const S = e.derivedNodes.rawVal ?? [];
    if (S.length >= 2) {
      const D = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
      for (const K of S) for (let ve = 0; ve < 3; ve++) K[ve] < D[ve] && (D[ve] = K[ve]), K[ve] > Q[ve] && (Q[ve] = K[ve]);
      Math.max(Q[0] - D[0], Q[1] - D[1], Q[2] - D[2], 0.1);
    }
    for (const D of V) Be(D);
    e.render();
  }
  function at(S, D) {
    const Q = V.findIndex((K) => K.type === S.type && K.idx === S.idx);
    Q >= 0 ? V.splice(Q, 1) : D || V.push(S), V.length && V[V.length - 1];
  }
  function ft() {
    V.length = 0, We();
  }
  return te.derive(() => {
    e.derivedNodes.val, V.length && We();
  }), l;
}
function Ka(e, l, c, p, u, w) {
  const f = u - c, b = w - p, y = f * f + b * b;
  if (y < 1e-9) {
    const ge = e - c, re = l - p;
    return Math.sqrt(ge * ge + re * re);
  }
  let P = ((e - c) * f + (l - p) * b) / y;
  P = Math.max(0, Math.min(1, P));
  const E = c + P * f, v = p + P * b, j = e - E, ue = l - v;
  return Math.sqrt(j * j + ue * ue);
}
function Ga(e, l, c) {
  let p = false;
  for (let u = 0, w = c.length - 1; u < c.length; w = u++) {
    const f = c[u].x, b = c[u].y, y = c[w].x, P = c[w].y;
    b > l != P > l && e < (y - f) * (l - b) / (P - b + 1e-12) + f && (p = !p);
  }
  return p;
}
const Ha = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Wa = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, tn = 1e-3;
function On(e, l) {
  return l === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : l === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function Ja(e, l) {
  const c = Math.abs(l[0] - e[0]);
  return Math.abs(l[1] - e[1]) < tn ? { plano: "XZ", en: e[1] } : c < tn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function Oa(e, l) {
  var _a2, _b;
  let c = null, p = { plano: "XZ", en: 0 };
  const u = () => {
    var _a3, _b2;
    const G = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !G || G === "none" ? null : String(G).replace(/^contour:/, "");
  }, w = (G) => {
    var _a3, _b2;
    const W = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ce = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], pe = /* @__PURE__ */ new Set();
    for (const V of ce) {
      if (V.length !== 2) continue;
      const I = W[V[0]], N = W[V[1]];
      if (!I || !N) continue;
      const F = On(I, G), C = On(N, G);
      Math.abs(F.fuera - C.fuera) < tn && pe.add(Math.round(F.fuera * 1e3) / 1e3);
    }
    return [...pe].sort((V, I) => V - I);
  };
  function f(G) {
    var _a3, _b2;
    if (G == null ? void 0 : G.plano) p = { plano: G.plano, en: G.en ?? w(G.plano)[0] ?? 0 };
    else {
      const ce = [...window.__hekatanModelSelection ?? []].reverse().find((I) => I.type === "frame"), pe = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], V = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      ce && V[ce.idx] && pe[V[ce.idx][0]] && pe[V[ce.idx][1]] ? p = Ja(pe[V[ce.idx][0]], pe[V[ce.idx][1]]) : p = { plano: "XZ", en: w("XZ")[0] ?? 0 };
    }
    c || b(), c.hidden = false, y();
  }
  function b() {
    c = document.createElement("div"), c.id = "hk-diagrama-2d", c.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), c.innerHTML = `
      <div class="hk-d2-bar" style="display:flex;align-items:center;gap:10px;padding:7px 10px;
           background:#141a24;border-bottom:1px solid #2f3b50;cursor:move;user-select:none">
        <b style="color:#e6c463">\u{1F4D0} Diagrama 2D</b>
        <span class="hk-d2-tit" style="color:#9fb0c6"></span>
        <label style="margin-left:auto">plano
          <select class="hk-d2-plano" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px">
            <option value="XZ">Alzado XZ</option><option value="YZ">Alzado YZ</option><option value="XY">Planta XY</option>
          </select></label>
        <button class="hk-d2-ant" title="p\xF3rtico anterior" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:1px 7px">\u25C0</button>
        <select class="hk-d2-en" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"></select>
        <button class="hk-d2-sig" title="p\xF3rtico siguiente" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:1px 7px">\u25B6</button>
        <button class="hk-d2-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button>
      </div>
      <svg class="hk-d2-svg" style="flex:1;width:100%;height:100%"></svg>
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(c), c.querySelector(".hk-d2-x").addEventListener("click", () => {
      c.hidden = true;
    });
    const G = c.querySelector(".hk-d2-plano"), W = c.querySelector(".hk-d2-en");
    G.addEventListener("change", () => {
      p = { plano: G.value, en: w(G.value)[0] ?? 0 }, y();
    }), W.addEventListener("change", () => {
      p.en = Number(W.value), y();
    });
    const ce = (I) => {
      const N = w(p.plano), F = N.findIndex((R) => Math.abs(R - p.en) < tn), C = Math.max(0, Math.min(N.length - 1, (F < 0 ? 0 : F) + I));
      N.length && (p.en = N[C], y());
    };
    c.querySelector(".hk-d2-ant").addEventListener("click", () => ce(-1)), c.querySelector(".hk-d2-sig").addEventListener("click", () => ce(1));
    const pe = c.querySelector(".hk-d2-bar");
    let V = null;
    pe.addEventListener("pointerdown", (I) => {
      if (I.target.closest("select,button")) return;
      const N = c.getBoundingClientRect();
      V = { x: I.clientX, y: I.clientY, l: N.left, t: N.top }, c.style.transform = "none", c.style.left = N.left + "px", c.style.top = N.top + "px";
    }), window.addEventListener("pointermove", (I) => {
      !V || !c || (c.style.left = V.l + I.clientX - V.x + "px", c.style.top = V.t + I.clientY - V.y + "px");
    }), window.addEventListener("pointerup", () => {
      V = null;
    }), new ResizeObserver(() => {
      c && !c.hidden && y();
    }).observe(c);
  }
  function y() {
    var _a3, _b2, _c, _d;
    if (!c || c.hidden) return;
    const G = c.querySelector(".hk-d2-svg"), W = c.querySelector(".hk-d2-tit"), ce = c.querySelector(".hk-d2-pie"), pe = c.querySelector(".hk-d2-plano"), V = c.querySelector(".hk-d2-en");
    pe.value = p.plano;
    const I = w(p.plano), N = p.plano === "XZ" ? "y" : p.plano === "YZ" ? "x" : "z", F = p.plano === "XY" ? "Planta" : "P\xF3rtico";
    V.innerHTML = I.map((we, Se) => `<option value="${we}" ${Math.abs(we - p.en) < tn ? "selected" : ""}>${F} ${Se + 1} \xB7 ${N} = ${we.toFixed(2)} m</option>`).join("");
    const C = u(), R = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], X = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], $ = C ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[C] : null;
    G.innerHTML = "";
    const ee = G.clientWidth || 880, fe = G.clientHeight || 480, ae = [];
    if (X.forEach((we, Se) => {
      if (we.length !== 2) return;
      const Te = R[we[0]], qe = R[we[1]];
      if (!Te || !qe) return;
      const Ee = On(Te, p.plano), nt = On(qe, p.plano);
      Math.abs(Ee.fuera - p.en) < tn && Math.abs(nt.fuera - p.en) < tn && ae.push({ i: Se, a: Ee, b: nt });
    }), !ae.length) {
      ce.textContent = "No hay barras en este plano.", W.textContent = "";
      return;
    }
    let se = 1 / 0, B = -1 / 0, de = 1 / 0, J = -1 / 0;
    for (const we of ae) for (const Se of [we.a, we.b]) se = Math.min(se, Se.u), B = Math.max(B, Se.u), de = Math.min(de, Se.v), J = Math.max(J, Se.v);
    const me = B - se || 1, he = J - de || 1, Ve = 70, be = Math.min((ee - 2 * Ve) / me, (fe - 2 * Ve) / he), Be = (ee - me * be) / 2, We = (fe - he * be) / 2, at = (we) => Be + (we - se) * be, ft = (we) => fe - (We + (we - de) * be), S = "http://www.w3.org/2000/svg", D = (we, Se, Te) => {
      const qe = document.createElementNS(S, we);
      for (const Ee in Se) qe.setAttribute(Ee, String(Se[Ee]));
      return Te != null && (qe.textContent = Te), G.appendChild(qe), qe;
    };
    let Q = 0;
    if ($) for (const we of ae) {
      const Se = $ instanceof Map ? $.get(we.i) : $[we.i];
      Se && (Q = Math.max(Q, Math.abs(Se[0] ?? 0), Math.abs(Se[1] ?? 0)));
    }
    const K = 0.12 * Math.max(me, he) * be, ve = Q > 0 ? K / Q : 0, oe = C === "bendingsY" || C === "bendingsZ", Me = (we) => Math.abs(we) >= 100 ? we.toFixed(1) : Math.abs(we) >= 10 ? we.toFixed(2) : we.toFixed(3), _e = [];
    for (const we of ae) {
      const Se = at(we.a.u), Te = ft(we.a.v), qe = at(we.b.u), Ee = ft(we.b.v), nt = Math.hypot(qe - Se, Ee - Te) || 1;
      let Ge = (Ee - Te) / nt, Nt = -(qe - Se) / nt;
      oe && Nt < 0 && (Ge = -Ge, Nt = -Nt);
      const je = $ ? $ instanceof Map ? $.get(we.i) : $[we.i] : null, ot = je ? Number(je[0] ?? 0) : 0, Mt = je ? -Number(je[1] ?? 0) : 0;
      if (je && ve > 0) {
        const Ke = [Se + Ge * ot * ve * 1, Te + Nt * ot * ve * 1], Fe = [qe + Ge * Mt * ve * 1, Ee + Nt * Mt * ve * 1], it = ot + Mt >= 0 ? "#3fa7d6" : "#d9534f";
        D("polygon", { points: `${Se},${Te} ${Ke[0]},${Ke[1]} ${Fe[0]},${Fe[1]} ${qe},${Ee}`, fill: it, "fill-opacity": 0.38, stroke: it, "stroke-width": 1.2 }), _e.push({ x: Ke[0] + Ge * 12, y: Ke[1] + Nt * 12, t: Me(ot), peso: Math.abs(ot) }), _e.push({ x: Fe[0] + Ge * 12, y: Fe[1] + Nt * 12, t: Me(Mt), peso: Math.abs(Mt) });
      }
      D("line", { x1: Se, y1: Te, x2: qe, y2: Ee, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" });
      const Ue = D("line", { x1: Se, y1: Te, x2: qe, y2: Ee, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      Ue.addEventListener("click", () => re(we.i));
      const ze = document.createElementNS(S, "title");
      ze.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", Ue.appendChild(ze);
    }
    for (const we of ae) for (const Se of [we.a, we.b]) p.plano !== "XY" && Math.abs(Se.v - de) < tn && D("rect", { x: at(Se.u) - 6, y: ft(Se.v), width: 12, height: 7, fill: "#b03a3a" });
    const Ne = [];
    _e.sort((we, Se) => Se.peso - we.peso);
    for (const we of _e) we.peso < 0.02 * Q || Ne.some((Se) => Math.hypot(Se.x - we.x, Se.y - we.y) < 34) || (Ne.push(we), D("text", { x: we.x, y: we.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, we.t));
    const De = C ? Ha[C] ?? C : "sin resultado";
    W.textContent = `${De} \xB7 ${p.plano === "XY" ? "planta" : "alzado"} ${p.plano} en ${N} = ${p.en.toFixed(2)} m`, ce.textContent = C ? `${ae.length} barras en el plano \xB7 m\xE1ximo ${Me(Q)} ${Wa[C] ?? ""}` + (oe ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const P = () => {
    try {
      y();
    } catch {
    }
  };
  (l == null ? void 0 : l.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    l.frameResults.val, P();
  }));
  let E = null;
  setInterval(() => {
    var _a3, _b2;
    const G = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, W = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, ce = [G, W];
    if (!(E && E[0] === G && E[1] === W)) {
      E = ce, P();
      try {
        L();
      } catch {
      }
    }
  }, 400);
  let v = null, j = -1, ue = "12";
  function ge(G) {
    var _a3, _b2;
    const W = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ce = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], pe = /* @__PURE__ */ new Map();
    ce.forEach((F, C) => {
      if (F.length === 2) for (const R of F) pe.has(R) || pe.set(R, []), pe.get(R).push(C);
    });
    const V = (F) => {
      const C = W[ce[F][0]], R = W[ce[F][1]], X = [R[0] - C[0], R[1] - C[1], R[2] - C[2]], $ = Math.hypot(X[0], X[1], X[2]) || 1;
      return X.map((ee) => ee / $);
    }, I = (F, C) => {
      const R = V(F), X = V(C);
      return Math.abs(R[0] * X[0] + R[1] * X[1] + R[2] * X[2]) > 0.9999;
    }, N = [G];
    for (const F of [0, 1]) {
      let C = G, R = ce[G][F];
      for (let X = 0; X < 500; X++) {
        const $ = (pe.get(R) ?? []).filter((fe) => fe !== C);
        if ($.length !== 1 || !I(C, $[0])) break;
        const ee = $[0];
        F === 0 ? N.unshift(ee) : N.push(ee), R = ce[ee][0] === R ? ce[ee][1] : ce[ee][0], C = ee;
      }
    }
    return N;
  }
  function re(G) {
    if (G == null) {
      const ce = [...window.__hekatanModelSelection ?? []].reverse().find((pe) => pe.type === "frame");
      if (!ce) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      G = ce.idx;
    }
    j = G, v || (v = document.createElement("div"), v.id = "hk-diagrama-barra", v.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), v.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(v), v.querySelector(".hk-b-x").addEventListener("click", () => {
      v.hidden = true;
    }), v.querySelector(".hk-b-pl").addEventListener("change", (W) => {
      ue = W.target.value, L();
    })), v.hidden = false, L();
  }
  function L() {
    var _a3, _b2, _c;
    if (!v || v.hidden || j < 0) return;
    const G = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], W = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], ce = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!W[j]) return;
    const pe = ge(j), V = [];
    let I = 0, N = -1;
    pe.forEach((B, de) => {
      const [J, me] = W[B], he = de === 0 ? pe.length > 1 && W[pe[1]].includes(J) : J !== N, Ve = he ? me : J, be = he ? J : me, Be = Math.hypot(G[be][0] - G[Ve][0], G[be][1] - G[Ve][1], G[be][2] - G[Ve][2]);
      V.push({ x: I, e: B, fin: he ? 1 : 0 }), I += Be, V.push({ x: I, e: B, fin: he ? 0 : 1 }), N = be;
    });
    const F = I, C = (B, de) => {
      const J = ce[B], me = J ? J instanceof Map ? J.get(de.e) : J[de.e] : null;
      return me ? de.fin === 0 ? Number(me[0] ?? 0) : -Number(me[1] ?? 0) : 0;
    }, R = G[W[pe[0]][0]], X = (B) => B.toFixed(2);
    v.querySelector(".hk-b-tit").textContent = "L = " + F.toFixed(2) + " m \xB7 " + pe.length + " tramo(s) \xB7 desde (" + X(R[0]) + ", " + X(R[1]) + ", " + X(R[2]) + ")";
    const $ = ue === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], ee = v.querySelector(".hk-b-cuerpo");
    ee.innerHTML = "";
    const fe = 590, ae = 120, se = 46;
    for (const [B, de, J, me] of $) {
      const he = V.map((oe) => C(B, oe)), Ve = Math.max(...he), be = Math.min(...he), Be = Math.max(Math.abs(Ve), Math.abs(be)) || 1, We = (oe) => se + oe / (F || 1) * (fe - 2 * se), at = (oe) => ae / 2 + (me ? 1 : -1) * (oe / Be) * (ae / 2 - 18), ft = (oe) => Math.abs(oe) >= 100 ? oe.toFixed(1) : Math.abs(oe) >= 10 ? oe.toFixed(2) : oe.toFixed(3);
      let S = We(0) + "," + ae / 2 + " ";
      V.forEach((oe, Me) => {
        S += We(oe.x) + "," + at(he[Me]) + " ";
      }), S += We(F) + "," + ae / 2;
      const D = he.indexOf(Ve), Q = he.indexOf(be), K = (oe, Me) => {
        const _e = at(he[oe]) + (at(he[oe]) < ae / 2 ? -5 : 13);
        return '<text x="' + We(V[oe].x) + '" y="' + _e + '" text-anchor="middle" fill="' + Me + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + ft(he[oe]) + "</text>";
      }, ve = me ? "#d9534f" : "#3fa7d6";
      ee.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + de + ' <span style="color:#6f7d90;font-weight:400">(' + J + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + ft(Ve) + " \xB7 m\xEDn " + ft(be) + (me ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + fe + '" height="' + ae + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + se + '" y1="' + ae / 2 + '" x2="' + (fe - se) + '" y2="' + ae / 2 + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + S + '" fill="' + ve + '" fill-opacity=".35" stroke="' + ve + '" stroke-width="1.4"/>' + K(0, "#f2f5fa") + K(V.length - 1, "#f2f5fa") + (D > 0 && D < V.length - 1 ? K(D, "#8fd3ff") : "") + (Q > 0 && Q < V.length - 1 && Q !== D ? K(Q, "#ff9f9a") : "") + '<text x="' + se + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (fe - se) + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + F.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = re, window.__hekatanDiagrama2D = f, { abrir: f, abrirBarra: re };
}
function ms(e, l = 8) {
  const c = document.createElement("div");
  c.id = "legend", c.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    te.derive(() => {
      no.val, c.style.background = ra();
    });
  });
  const p = document.createElement("div");
  p.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", c.appendChild(p), setTimeout(() => {
    te.derive(() => {
      p.textContent = Eo.val ? `[${Eo.val}]` : "";
    });
  });
  const u = Array.from({ length: l + 1 }, (y, P) => P / l).reverse();
  let w, f;
  u.forEach((y, P) => {
    w = document.createElement("div"), w.id = `marker-${P}`, w.className = "marker", w.style.marginTop = P == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", f = document.createElement("p"), f.id = `marker-text-${P}`, w.append(f), c.append(w);
  });
  const b = [];
  return c.querySelectorAll("p").forEach((y) => b.push(y)), setTimeout(() => {
    te.derive(() => {
      u.forEach((y, P) => {
        const E = b[P];
        E && (E.innerText = Qa(e.val, y).toString());
      });
    });
  }), c;
}
function Qa(e, l) {
  const c = Tn.val;
  if (c) return ws(c[0] + l * (c[1] - c[0]));
  const p = e.filter((f) => Number.isFinite(f));
  if (p.length === 0) return "0";
  const [u, w] = To(p);
  return ws(u + l * (w - u));
}
function ws(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function di({ mesh: e, settingsObj: l, drawingObj: c, objects3D: p, solids: u }) {
  aa.DEFAULT_UP = new k(0, 0, 1);
  const w = document.createElement("div"), f = new ta(), b = new na(45, 1, 0.1, 2 * 1e6), y = new oa(-10, 10, 10, -10, -1e3, 2e6);
  let P = b;
  const E = new sa({ antialias: true });
  E.localClippingEnabled = true;
  const v = new ds(b, E.domElement);
  v.enableDamping = true, v.dampingFactor = 0.1, v.screenSpacePanning = true, v.zoomSpeed = 0.8, v.panSpeed = 1.2, v.rotateSpeed = 0.9, v.keyPanSpeed = 12, v.listenToKeyEvents(window), v.touches = { ONE: Hn.ROTATE, TWO: Hn.DOLLY_PAN }, E.domElement.addEventListener("wheel", (S) => {
    if (!S.ctrlKey && Math.abs(S.deltaX) > Math.abs(S.deltaY) * 1.5) {
      S.preventDefault();
      const D = v.target, Q = new k().subVectors(b.position, D), K = new k();
      K.crossVectors(b.up, Q).normalize();
      const oe = Q.length() * 1e-3 * v.panSpeed;
      D.addScaledVector(K, S.deltaX * oe), b.position.addScaledVector(K, S.deltaX * oe), v.update();
    }
  }, { passive: false });
  const j = new Po(new k(-1, 0, 0), 0), ue = new Po(new k(0, -1, 0), 0), ge = new Po(new k(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function re() {
    const S = window.__hekatanClip, D = [];
    S.enableX && (j.normal.set(S.invertX ? 1 : -1, 0, 0), j.constant = S.invertX ? -S.posX : S.posX, D.push(j)), S.enableY && (ue.normal.set(0, S.invertY ? 1 : -1, 0), ue.constant = S.invertY ? -S.posY : S.posY, D.push(ue)), S.enableZ && (ge.normal.set(0, 0, S.invertZ ? 1 : -1), ge.constant = S.invertZ ? -S.posZ : S.posZ, D.push(ge)), E.clippingPlanes = D, f.traverse((K) => {
      const ve = K;
      if (ve.material) {
        const oe = Array.isArray(ve.material) ? ve.material : [ve.material];
        for (const Me of oe) Me.clippingPlanes = D, Me.needsUpdate = true;
      }
    });
    const Q = window.__hekatanPanes ?? [];
    for (const K of Q) try {
      K && typeof K.refresh == "function" && K.refresh();
    } catch {
    }
    E.render(f, P);
  }
  re(), window.__hekatanClipApply = re;
  const L = pa(l), G = te.derive(() => Math.pow(10, L.displayScale.val / 10)), W = ja(e, L), ce = () => {
    const S = [];
    return L.gridXY.rawVal && S.push("xy"), L.gridXZ.rawVal && S.push("xz"), L.gridYZ.rawVal && S.push("yz"), S;
  }, pe = () => {
    const S = L.gridStep.rawVal, D = Math.max(S, L.gridMajor.rawVal);
    return { planes: ce(), majorStep: D, minorStep: S };
  };
  let V = zo(L.gridSize.rawVal, pe());
  V.visible = L.gridVisible.rawVal, window.__hekatanSnap2D = L.cursorSnap.rawVal;
  const I = () => {
    const S = Math.max(0, Math.min(1, L.gridOpacity.rawVal));
    V.traverse((D) => {
      const Q = D.material;
      if (!Q || !("opacity" in Q)) return;
      const K = D.name ?? "";
      let ve = 0.55;
      K.includes("border") ? ve = 1 : K.includes("major") && (ve = 0.95), Q.opacity = S * ve;
    });
  };
  I(), w.appendChild(da(L, e, u)), w.setAttribute("id", "viewer"), w.appendChild(E.domElement), E.setPixelRatio(window.devicePixelRatio);
  const N = dn();
  E.setClearColor(N.background, 1);
  const F = L.gridSize.rawVal, C = F * 0.5 + F * 0.5 / Math.tan(45 * 0.5);
  b.position.set(0, 0, C), b.up.set(0, 1, 0), v.target.set(0, 0, 0), v.minDistance = 0.1, v.maxDistance = 1e4, w.__settings = L, v.zoomSpeed = 1, v._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, v.update();
  let R = us(L.gridSize.rawVal, L.flipAxes.rawVal);
  f.add(V, R), te.derive(() => {
    window.__hekatanGridPlaneXY = L.gridXY.val, window.__hekatanGridPlaneXZ = L.gridXZ.val, window.__hekatanGridPlaneYZ = L.gridYZ.val;
  });
  let X = true;
  te.derive(() => {
    const S = L.gridVisible.val;
    if (X) {
      X = false;
      return;
    }
    V.visible = S, J();
  });
  let $ = true;
  te.derive(() => {
    if (L.gridOpacity.val, $) {
      $ = false;
      return;
    }
    I(), J();
  }), te.derive(() => {
    const S = L.cursorSnap.val;
    window.__hekatanSnap2D = S;
  });
  let ee = true;
  te.derive(() => {
    var _a2, _b, _c;
    const S = L.gridSize.val, D = L.flipAxes.val;
    if (L.gridXY.val, L.gridXZ.val, L.gridYZ.val, L.gridStep.val, L.gridMajor.val, ee) {
      ee = false;
      return;
    }
    f.remove(V), (_a2 = V.traverse) == null ? void 0 : _a2.call(V, (oe) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = oe.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = oe.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), V = zo(S, pe()), V.visible = L.gridVisible.rawVal, f.add(V), I(), f.remove(R), R.traverse((oe) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = oe.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = oe.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), R = us(S, D), f.add(R);
    const Q = S * 0.5 + S * 0.5 / Math.tan(45 * 0.5);
    b.position.distanceTo(v.target);
    const K = Math.abs(b.position.x) < 0.1 && Math.abs(b.position.y) < 0.1 && b.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (K ? b.position.set(0, 0, Q) : b.position.set(0.5 * S, -Q, 0.5 * S), v.target.set(0, 0, 0)), v.minDistance = Math.max(0.05, S * 0.01), v.maxDistance = Math.max(50, S * 50), v.update(), J();
  }), new ResizeObserver((S) => {
    var _a2, _b;
    for (const D of S) {
      const Q = (_a2 = D.target) == null ? void 0 : _a2.clientWidth, K = (_b = D.target) == null ? void 0 : _b.clientHeight;
      if (Q === 0 || K === 0) continue;
      const oe = (ae ? Q / 2 : Q) / K;
      b.aspect = oe, b.updateProjectionMatrix();
      const Me = y.top;
      if (y.left = -Me * oe, y.right = Me * oe, y.updateProjectionMatrix(), se && se.isPerspectiveCamera) se.aspect = oe, se.updateProjectionMatrix();
      else if (se && se.isOrthographicCamera) {
        const _e = se, Ne = _e.top;
        _e.left = -Ne * oe, _e.right = Ne * oe, _e.updateProjectionMatrix();
      }
      E.setSize(Q, K), J();
    }
  }).observe(w), v.addEventListener("change", J), te.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, L.displayScale.val, L.nodes.val, L.elements.val, (_g = L.edges) == null ? void 0 : _g.val, L.elemColumns.val, L.elemBeams.val, L.nodesIndexes.val, L.elementsIndexes.val, L.orientations.val, L.sections.val, L.secColumns.val, L.secBeams.val, L.secFloor.val, L.supports.val, L.loads.val, L.deformedShape.val, L.nodeResults.val, L.frameResults.val, L.shellResults.val, (_h = L.solidResults) == null ? void 0 : _h.val, (_i = L.extruded) == null ? void 0 : _i.val, setTimeout(J);
  });
  let ae = false, se = null, B = null, de = false;
  function J() {
    const S = w.clientWidth || 1, D = w.clientHeight || 1;
    if (!ae || !se) {
      E.setScissorTest(false), E.setViewport(0, 0, S, D), E.render(f, P);
      return;
    }
    const Q = S / 2;
    E.setScissorTest(true), E.setViewport(0, 0, Q, D), E.setScissor(0, 0, Q, D), E.render(f, P), E.setViewport(Q, 0, Q, D), E.setScissor(Q, 0, Q, D), E.render(f, se), E.setScissorTest(false);
  }
  function me(S) {
    P = S, v.object = S, v.update(), J();
  }
  function he(S, D) {
    ae = S, D && (se = D);
    const Q = w.clientWidth || 1, K = w.clientHeight || 1, oe = (S ? Q / 2 : Q) / K;
    b.isPerspectiveCamera && (b.aspect = oe, b.updateProjectionMatrix());
    const Me = y.top;
    if (y.left = -Me * oe, y.right = Me * oe, y.updateProjectionMatrix(), S && se) {
      if (B ? (B.object = se, B.update()) : (B = new ds(se, E.domElement), B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.touches = { ONE: Hn.ROTATE, TWO: Hn.DOLLY_PAN }, B.target.copy(v.target), B.addEventListener("change", J), B.enabled = false), !de) {
        const _e = (Ne) => {
          if (!ae || !B) return;
          const De = E.domElement.getBoundingClientRect(), we = Ne.clientX - De.left, Se = De.width / 2, Te = we >= Se;
          v.enabled = !Te, B.enabled = Te;
        };
        E.domElement.addEventListener("pointerdown", _e, true), E.domElement.addEventListener("wheel", _e, { capture: true, passive: true }), de = true;
      }
    } else S || (v.enabled = true, B && (B.enabled = false));
    w.__splitMode = S, window.__hekatanSplitMode = S, window.__hekatanSplitCamera = S ? se : null, J();
  }
  if (e) {
    f.add(ua(L, W, G), ia(e, L, W), ma(L, W, G), wa(e, L, W, G), fa(e, L, W, G), ha(e, L, W, G), ga(e, L, W, G), ba(e, L, W, G), Sa(e, L, W), Fa(e, L, W, G), Pa(e, L, W, G)), window.__hekatanDiagrama2D || (Oa(e, L), E.domElement.addEventListener("dblclick", () => {
      var _a2;
      const _e = (_a2 = L.frameResults) == null ? void 0 : _a2.rawVal;
      !_e || _e === "none" || !(window.__hekatanModelSelection ?? []).some((De) => De.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const S = qa({ scene: f, rendererElm: E.domElement, getActiveCamera: () => P, derivedNodes: W, derivedDisplayScale: G, mesh: e, settings: L, render: J });
    f.add(S);
    const D = ai(e, L), Q = Va(e, L, W, D), K = ms(D);
    f.add(Q), w.appendChild(K);
    const ve = Ra(e, L, W);
    f.add(ve);
    const oe = ve.__colorMapValues, Me = ms(oe);
    Me.id = "frame-legend", w.appendChild(Me), te.derive(() => {
      var _a2;
      const _e = L.shellResults.val != "none", Ne = (((_a2 = L.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", De = _e || Ne, we = L.frameResults.val.startsWith("contour:"), Se = D.val.some((Te) => Number.isFinite(Te));
      K.hidden = !De || !Se, Q.visible = De, Me.hidden = !we;
    });
  }
  if (u) {
    const S = new vs(16777215, 0.5);
    f.add(S);
    const D = new to(16777215, 0.5);
    D.position.set(30, 25, -10), D.shadow.mapSize.width = 1024, D.shadow.mapSize.height = 1024, f.add(D);
    const Q = 10;
    D.shadow.camera.left = -Q, D.shadow.camera.right = Q, D.shadow.camera.top = Q, D.shadow.camera.bottom = -Q, D.shadow.camera.far = 1e3;
    const K = new to(16777215, 0.5);
    K.color.setHSL(11, 43, 96), K.position.set(-10, 0, 30), f.add(K), te.derive(() => {
      (u == null ? void 0 : u.val.length) && (f.remove(...u.oldVal), f.add(...u.rawVal), J());
    }), te.derive(() => {
      u.rawVal.forEach((ve) => ve.visible = L.solids.val), J();
    });
  }
  if (p) {
    const S = [], D = (K) => {
      var _a2;
      return ((_a2 = K == null ? void 0 : K.userData) == null ? void 0 : _a2.isCota) ? L.showCotas.val : L.custom3D.val;
    }, Q = () => {
      for (const K of S) K.visible = D(K);
      J();
    };
    te.derive(() => {
      const K = p.val;
      S.length && (f.remove(...S), S.length = 0), K.length && (f.add(...K), S.push(...K), Q()), J();
    }), te.derive(() => {
      L.custom3D.val, Q();
    }), te.derive(() => {
      L.showCotas.val, Q();
    });
  }
  c && Aa({ drawingObj: c, gridObj: V, scene: f, getActiveCamera: () => P, controls: v, gridSize: F, derivedDisplayScale: G, rendererElm: E.domElement, viewerRender: J }), xs((S, D) => {
    var _a2;
    E.setClearColor(D.background, 1), f.remove(V), (_a2 = V.traverse) == null ? void 0 : _a2.call(V, (Q) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Q.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Q.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), V = zo(L.gridSize.rawVal, { planes: ce() }), f.add(V), w.style.setProperty("--awatif-legend-color", D.legendMarker), J();
  });
  const Ve = { scene: f, perspCamera: b, orthoCamera: y, get camera() {
    return P;
  }, controls: v, renderer: E, rendererElm: E.domElement, render: J, setActiveCamera: me, setSplitMode: he, get splitMode() {
    return ae;
  }, get splitCamera() {
    return se;
  }, settings: L };
  w.__ctx = Ve;
  const be = document.createElement("div");
  be.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Be = (S, D, Q) => {
    const K = document.createElement("button");
    return K.textContent = S, K.title = D, K.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), K.onmouseenter = () => {
      K.style.background = "rgba(70,70,70,0.9)";
    }, K.onmouseleave = () => {
      K.style.background = "rgba(40,40,40,0.85)";
    }, K.onclick = (ve) => {
      ve.preventDefault(), Q();
    }, K;
  }, We = (S, D) => {
    const Q = v.target, K = new k().subVectors(P.position, Q), ve = K.length(), oe = new k(), Me = new k();
    oe.crossVectors(P.up, K).normalize(), Me.copy(P.up).normalize();
    const _e = ve * 0.05;
    Q.addScaledVector(oe, -S * _e), Q.addScaledVector(Me, D * _e), P.position.addScaledVector(oe, -S * _e), P.position.addScaledVector(Me, D * _e), v.update(), J();
  }, at = (S) => {
    const D = new k().subVectors(P.position, v.target);
    D.multiplyScalar(S), P.position.copy(v.target).add(D), v.update(), J();
  }, ft = () => {
    const S = document.createElement("div");
    return S.style.cssText = "width:32px;height:32px;", S;
  };
  return be.append(ft()), be.append(Be("\u2191", "Pan arriba", () => We(0, 1))), be.append(Be("\u2295", "Zoom in", () => at(0.85))), be.append(Be("\u2190", "Pan izquierda", () => We(-1, 0))), be.append(Be("\u2302", "Reset vista", () => {
    v.reset(), J();
  })), be.append(Be("\u2192", "Pan derecha", () => We(1, 0))), be.append(Be("\u2296", "Zoom out", () => at(1.18))), be.append(Be("\u2193", "Pan abajo", () => We(0, -1))), be.append(ft()), getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(be), w;
}
function ja(e, l) {
  return te.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const c = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], p = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!p || c.length === 0) return c;
    const u = l.deformScale.val, w = l.deformScale.val * l.deformScaleZ.val, f = Number.isFinite(u) ? u : 1, b = Number.isFinite(w) ? w : 1;
    return c.map((y, P) => {
      var _a3;
      const E = ((_a3 = p.get(P)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], v = Number.isFinite(E[0]) ? E[0] : 0, j = Number.isFinite(E[1]) ? E[1] : 0, ue = Number.isFinite(E[2]) ? E[2] : 0;
      return [y[0] + v * f, y[1] + j * f, y[2] + ue * b];
    });
  });
}
const Tn = te.state(null), Eo = te.state(""), ei = te.state("kN"), ti = te.state("mm"), ni = te.state("kN/m\xB2"), oi = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, ys = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, si = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ai(e, l) {
  const c = te.state([]);
  let p;
  return ((u) => {
    u.bendingXX = "bendingXX", u.bendingYY = "bendingYY", u.bendingXY = "bendingXY", u.membraneXX = "membraneXX", u.membraneYY = "membraneYY", u.membraneXY = "membraneXY", u.tranverseShearX = "tranverseShearX", u.tranverseShearY = "tranverseShearY", u.membranePrincipalMax = "membranePrincipalMax", u.membranePrincipalMin = "membranePrincipalMin", u.bendingPrincipalMax = "bendingPrincipalMax", u.bendingPrincipalMin = "bendingPrincipalMin", u.transverseShearMax = "transverseShearMax", u.vonMises = "vonMises", u.pressure = "pressure", u.displacementX = "displacementX", u.displacementY = "displacementY", u.displacementZ = "displacementZ";
  })(p || (p = {})), te.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const u = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), ge = (D, Q) => {
      D == null ? void 0 : D.forEach((K, ve) => {
        const oe = e.elements.val[ve];
        if (oe) for (let Me = 0; Me < oe.length; Me++) Q.set(oe[Me], [K[Me] ?? K[0]]);
      });
    };
    ge((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, u), ge((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, w), ge((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, f), ge((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, b), ge((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, y), ge((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, P), ge((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, E), ge((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, v), ge((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, j), ge((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, ue);
    const re = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), pe = (D, Q, K, ve, oe) => {
      D.forEach((Me, _e2) => {
        var _a3, _b2;
        const Ne = Me[0] ?? 0, De = ((_a3 = Q.get(_e2)) == null ? void 0 : _a3[0]) ?? 0, we = ((_b2 = K.get(_e2)) == null ? void 0 : _b2[0]) ?? 0, Se = (Ne + De) / 2, Te = Math.hypot((Ne - De) / 2, we);
        ve.set(_e2, [Se + Te]), oe.set(_e2, [Se - Te]);
      });
    };
    pe(b, y, P, re, L), pe(u, w, f, G, W), E.forEach((D, Q) => {
      var _a3;
      ce.set(Q, [Math.hypot(D[0] ?? 0, ((_a3 = v.get(Q)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const V = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, I = (_w = l.solidResults) == null ? void 0 : _w.val, F = I && I !== "none" ? I : l.shellResults.val, C = V == null ? void 0 : V[F], R = { bendingXX: [u, 0], bendingYY: [w, 0], bendingXY: [f, 0], membraneXX: [b, 0], membraneYY: [y, 0], membraneXY: [P, 0], tranverseShearX: [E, 0], tranverseShearY: [v, 0], membranePrincipalMax: [re, 0], membranePrincipalMin: [L, 0], bendingPrincipalMax: [G, 0], bendingPrincipalMin: [W, 0], transverseShearMax: [ce, 0], vonMises: [j, 0], pressure: [ue, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, X = l.shellResults.val, $ = ei.val, ee = ti.val, fe = X === "displacementX" || X === "displacementY" || X === "displacementZ", ae = X === "bendingXX" || X === "bendingYY" || X === "bendingXY" || X === "bendingPrincipalMax" || X === "bendingPrincipalMin", se = X === "membraneXX" || X === "membraneYY" || X === "membraneXY" || X === "membranePrincipalMax" || X === "membranePrincipalMin", B = X === "vonMises" || X === "pressure", de = X === "tranverseShearX" || X === "tranverseShearY" || X === "transverseShearMax", J = (_D = l.solidResults) == null ? void 0 : _D.val, me = J === "vonMises" || J === "sigmaXX" || J === "sigmaYY" || J === "sigmaZZ" || J === "tauXY" || J === "tauYZ" || J === "tauXZ", he = J === "ux" || J === "uy" || J === "uz", Ve = ni.val, be = me ? si[Ve] : he || fe ? ys[ee] : ae || se || B || de ? 1 / oi[$] : 1, Be = me ? Ve : he || fe ? ee : ae ? `${$}\xB7m/m` : se ? `${$}/m\xB2` : B ? `${$}/m\xB2` : de ? `${$}/m` : "";
    Eo.val = Be, Tn.val = Array.isArray(C) && C.length === 2 ? [C[0] * be, C[1] * be] : null;
    const We = ks.val, ft = J && J !== "none" ? [j, 0] : R[X], S = [];
    if (e.nodes.val.forEach((D, Q) => {
      const K = ft;
      if (!K || !K[0] || typeof K[0].has != "function") return;
      if (!K[0].has(Q)) {
        S.push(Number.NaN);
        return;
      }
      const ve = K[0].get(Q), oe = ve ? ve[K[1]] ?? 0 : 0;
      S.push(oe * be);
    }), !Tn.val && We !== "auto") {
      const D = e.nodes.val, Q = /* @__PURE__ */ new Set(), K = (oe, Me) => {
        var _a3;
        const _e2 = (_a3 = D[oe[0]]) == null ? void 0 : _a3[Me];
        return oe.every((Ne) => {
          var _a4;
          return Math.abs((((_a4 = D[Ne]) == null ? void 0 : _a4[Me]) ?? NaN) - _e2) < 1e-6;
        });
      };
      for (const oe of e.elements.val) {
        if (oe.length !== 4) continue;
        const Me = K(oe, 2), _e2 = !Me && K(oe, 0), Ne = !Me && K(oe, 1);
        if (We === "losas" ? Me : We === "muros" ? _e2 || Ne : We === "murosX" ? _e2 : We === "murosY" ? Ne : false) for (const Se of oe) Q.add(Se);
      }
      const ve = [];
      for (const oe of Q) {
        const Me = S[oe];
        Number.isFinite(Me) && ve.push(Me);
      }
      ve.length && (Tn.val = To(ve));
    }
    c.val = S;
  }), c;
}
export {
  ca as a,
  ms as b,
  ei as c,
  ti as d,
  ni as e,
  di as g
};
