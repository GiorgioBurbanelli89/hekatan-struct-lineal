import { N as Ht, a6 as Gn, q as Gs, v as j, a7 as Hs, D as At, M as lt, B as ze, F as Ct, a8 as Ws, x as yt, a9 as Js, aa as Os, h as as, ab as is, r as dn, ac as Qn, ad as jn, a4 as gs, _ as it, a as ht, L as Wt, w as vs, b as Qs, ae as js, f as ft, V as S, $ as cn, af as ko, H as no, d as Ft, c as So, Y as bs, Z as to, G as ea, z as Vn, A as ta, ag as eo, t as na, o as oa, I as en, a2 as Fn, E as ls, S as xn, m as Hn, ah as An, g as rs, i as cs, j as ds, C as ps, K as sa, U as aa, W as ia, X as la, T as Wn, P as Po, O as ra } from "./theme-Dxpmbnyd.js";
import { T as Pt, O as us } from "./Text-DxjkL_3A.js";
import { P as Ms } from "./tweakpane-BXg6ZhiP.js";
import { e as ca } from "./styles-DjzQZscE.js";
class _s {
  constructor(l, r = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, r);
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
  setColorMap(l, r = 32) {
    this.map = Co[l] || Co.rainbow, this.n = r;
    const d = 1 / this.n, u = new Ht(), f = new Ht();
    this.lut.length = 0, this.lut.push(new Ht(this.map[0][1]));
    for (let m = 1; m < r; m++) {
      const g = m * d;
      for (let y = 0; y < this.map.length - 1; y++) if (g > this.map[y][0] && g <= this.map[y + 1][0]) {
        const _ = this.map[y][0], C = this.map[y + 1][0];
        u.setHex(this.map[y][1], Gn), f.setHex(this.map[y + 1][1], Gn);
        const v = new Ht().lerpColors(u, f, (g - _) / (C - _));
        this.lut.push(v);
      }
    }
    return this.lut.push(new Ht(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Gs.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const r = Math.round(l * this.n);
    return this.lut[r];
  }
  addColorMap(l, r) {
    return Co[l] = r, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const r = l.getContext("2d", { alpha: false }), d = r.getImageData(0, 0, 1, this.n), u = d.data;
    let f = 0;
    const m = 1 / this.n, g = new Ht(), y = new Ht(), _ = new Ht();
    for (let C = 1; C >= 0; C -= m) for (let v = this.map.length - 1; v >= 0; v--) if (C < this.map[v][0] && C >= this.map[v - 1][0]) {
      const K = this.map[v - 1][0], me = this.map[v][0];
      g.setHex(this.map[v - 1][1], Gn), y.setHex(this.map[v][1], Gn), _.lerpColors(g, y, (C - K) / (me - K)), u[f * 4] = Math.round(_.r * 255), u[f * 4 + 1] = Math.round(_.g * 255), u[f * 4 + 2] = Math.round(_.b * 255), u[f * 4 + 3] = 255, f += 1;
    }
    return r.putImageData(d, 0, 0), l;
  }
}
const Co = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ks = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], da = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ks, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, oo = j.state("safe"), Ss = j.state("auto");
function Ps(e) {
  e = Math.max(0, Math.min(1, e));
  const l = da[oo.val] ?? ks;
  for (let d = 0; d < l.length - 1; d++) {
    const [u, f, m, g] = l[d], [y, _, C, v] = l[d + 1];
    if (e <= y) {
      const K = (e - u) / (y - u);
      return [f + (_ - f) * K, m + (C - m) * K, g + (v - g) * K];
    }
  }
  const r = l[l.length - 1];
  return [r[1], r[2], r[3]];
}
function fs() {
  const l = new Uint8Array(1024);
  for (let d = 0; d < 256; d++) {
    const u = d / 255, [f, m, g] = Ps(u);
    l[d * 4 + 0] = f, l[d * 4 + 1] = m, l[d * 4 + 2] = g, l[d * 4 + 3] = 255;
  }
  const r = new Js(l, 256, 1, Os);
  return r.minFilter = as, r.magFilter = as, r.wrapS = is, r.wrapT = is, r.needsUpdate = true, r;
}
function pa() {
  const l = [];
  for (let r = 0; r <= 12; r++) {
    const d = 1 - r / 12, [u, f, m] = Ps(d);
    l.push(`rgb(${u | 0},${f | 0},${m | 0}) ${(r / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function $o(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((f, m) => f - m), r = (f) => l[Math.min(l.length - 1, Math.max(0, Math.round(f * (l.length - 1))))];
  let d = l.length >= 20 ? r(0.01) : l[0], u = l.length >= 20 ? r(0.99) : l[l.length - 1];
  return d >= 0 && u > 0 && (d = 0), u <= 0 && d < 0 && (u = 0), [d, u];
}
function ua(e, l, r) {
  new _s();
  const d = fs(), u = new Hs({ uniforms: { cmap: { value: d }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: At, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  j.derive(() => {
    var _a2;
    oo.val;
    const m = u.uniforms.cmap.value;
    u.uniforms.cmap.value = fs(), (_a2 = m == null ? void 0 : m.dispose) == null ? void 0 : _a2.call(m);
  });
  const f = new lt(new ze(), u);
  return f.renderOrder = -1, f.frustumCulled = false, f.userData.isShellArea = true, f.name = "__hekatan_shell_colormap", j.derive(() => {
    f.geometry.setAttribute("position", new Ct(e.val.flat(), 3));
    const m = [], g = [], y = [];
    l.val.forEach((L, ae) => {
      L.length === 3 ? (m.push(L[0], L[1], L[2]), g.push(ae), y.push(0)) : L.length === 4 && (m.push(L[0], L[1], L[2]), m.push(L[0], L[2], L[3]), g.push(ae, ae), y.push(0, 1));
    }), f.geometry.setIndex(new Ws(m, 1)), f.userData.faceToElem = g, f.userData.faceLocal = y;
    const _ = r.val.filter((L) => Number.isFinite(L));
    let C, v;
    const K = $n.val;
    if (K ? (v = K[0], C = K[1]) : [v, C] = $o(_), C === v) {
      const L = Math.max(Math.abs(C) * 1e-6, 1e-9);
      C += L, v -= L;
    }
    const me = K && K[0] > K[1], be = Math.min(v, C), oe = Math.max(v, C), T = oe - be, ne = new Float32Array(r.val.length);
    for (let L = 0; L < r.val.length; L++) {
      const ae = r.val[L];
      if (!Number.isFinite(ae)) {
        ne[L] = -1;
        continue;
      }
      const I = ((me ? oe + be - ae : ae) - be) / T;
      ne[L] = Math.max(0, Math.min(1, I));
    }
    f.geometry.setAttribute("scalar", new yt(ne, 1));
  }), f;
}
function fa(e, l, r) {
  const d = document.createElement("div"), u = new Ms({ title: "Settings", expanded: true, container: d });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(u), d.setAttribute("id", "settings");
  const f = "hk_settingsPos";
  let m = null;
  try {
    const v = localStorage.getItem(f);
    v && (m = JSON.parse(v));
  } catch {
  }
  d.style.cssText = ["position:fixed", m ? `left:${m.left}px` : "left:8px", m ? `top:${m.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const g = () => {
    const v = d.querySelector(".tp-rotv_b");
    if (!v) {
      setTimeout(g, 200);
      return;
    }
    v.style.cursor = "move", v.style.userSelect = "none";
    let K = false, me = 0, be = 0, oe = 0, T = 0;
    v.addEventListener("mousedown", (ne) => {
      K = true, me = ne.clientX, be = ne.clientY;
      const L = d.getBoundingClientRect();
      oe = L.left, T = L.top, d.style.left = `${oe}px`, d.style.top = `${T}px`;
    }), window.addEventListener("mousemove", (ne) => {
      if (!K) return;
      const L = ne.clientX - me, ae = ne.clientY - be, ie = Math.max(0, Math.min(window.innerWidth - 40, oe + L)), I = Math.max(0, Math.min(window.innerHeight - 40, T + ae));
      d.style.left = `${ie}px`, d.style.top = `${I}px`;
    }), window.addEventListener("mouseup", () => {
      if (K) {
        K = false;
        try {
          localStorage.setItem(f, JSON.stringify({ left: parseFloat(d.style.left), top: parseFloat(d.style.top) }));
        } catch {
        }
      }
    });
  };
  if (g(), l == null ? void 0 : l.nodes) {
    u.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const v = u.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    v.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), v.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), v.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), v.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const K = v.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    K.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), K.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), K.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), K.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), K.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const me = u.addFolder({ title: "\u{1F441} Ver", expanded: false });
    me.addBinding(e.nodes, "val", { label: "Nodes" }), me.addBinding(e.elements, "val", { label: "Elements" }), me.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), me.addBinding(e.faces, "val", { label: "  Caras (fill)" }), me.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), me.addBinding(e.elemColumns, "val", { label: "    Columnas" }), me.addBinding(e.elemBeams, "val", { label: "    Vigas" }), me.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), me.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), me.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), me.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), me.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), me.addBinding(e.orientations, "val", { label: "Orientations" }), me.addBinding(e.sections, "val", { label: "Sections" }), me.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), me.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), me.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), me.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), me.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
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
    }), v.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), v.addBinding(oo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), v.addBinding(Ss, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), v.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), v.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), v.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), v.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  r && u.addBinding(e.solids, "val", { label: "Solids" });
  const y = u.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), _ = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), C = () => {
    const v = window.__hekatanClipApply;
    typeof v == "function" && v();
  };
  return y.addBinding(_, "enableX", { label: "Cortar X" }).on("change", C), y.addBinding(_, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", C), y.addBinding(_, "invertX", { label: "  invertir X" }).on("change", C), y.addBinding(_, "enableY", { label: "Cortar Y" }).on("change", C), y.addBinding(_, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", C), y.addBinding(_, "invertY", { label: "  invertir Y" }).on("change", C), y.addBinding(_, "enableZ", { label: "Cortar Z" }).on("change", C), y.addBinding(_, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", C), y.addBinding(_, "invertZ", { label: "  invertir Z" }).on("change", C), d;
}
function ha(e) {
  return { gridSize: j.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: j.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: j.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: j.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: j.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: j.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: j.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: j.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: j.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: j.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: j.state((e == null ? void 0 : e.nodes) ?? true), elements: j.state((e == null ? void 0 : e.elements) ?? true), edges: j.state((e == null ? void 0 : e.edges) ?? true), faces: j.state((e == null ? void 0 : e.faces) ?? true), elemColumns: j.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: j.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: j.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: j.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: j.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: j.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: j.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: j.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: j.state((e == null ? void 0 : e.orientations) ?? false), sections: j.state((e == null ? void 0 : e.sections) ?? true), extruded: j.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: j.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: j.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: j.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: j.state((e == null ? void 0 : e.secFloor) ?? -1), supports: j.state((e == null ? void 0 : e.supports) ?? true), loads: j.state((e == null ? void 0 : e.loads) ?? false), deformedShape: j.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: j.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: j.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: j.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: j.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: j.state((e == null ? void 0 : e.flipAxes) ?? false), solids: j.state((e == null ? void 0 : e.solids) ?? true), custom3D: j.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: j.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: j.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: j.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function ma(e, l, r) {
  const d = dn(), u = new Qn(new ze(), new jn({ color: d.nodePoint }));
  return gs((f, m) => {
    u.material.color.setHex(m.nodePoint);
  }), u.frustumCulled = false, j.derive(() => {
    e.nodes.val && u.geometry.setAttribute("position", new Ct(l.val.flat(), 3));
  }), j.derive(() => {
    if (r.val, l.val, !e.nodes.rawVal) return;
    const f = l.rawVal ?? [];
    let m = e.gridSize.val * 0.5;
    if (f.length >= 2) {
      const y = [1 / 0, 1 / 0, 1 / 0], _ = [-1 / 0, -1 / 0, -1 / 0];
      for (const C of f) for (let v = 0; v < 3; v++) y[v] = Math.min(y[v], C[v]), _[v] = Math.max(_[v], C[v]);
      m = Math.max(_[0] - y[0], _[1] - y[1], _[2] - y[2], 0.1);
    }
    const g = 0.03 * m;
    u.material.size = g * r.rawVal;
  }), j.derive(() => {
    u.visible = e.nodes.val;
  }), u;
}
function zo(e, l) {
  const r = dn(), d = new it();
  d.name = "hekatan-grid";
  const u = (l == null ? void 0 : l.planes) ?? ["xy"];
  let f = (l == null ? void 0 : l.majorStep) ?? 1, m = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (f <= 0 && (f = 1), m <= 0 && (m = 0.1); e / m > 500; ) m *= 2;
  for (; e / f > 100; ) f *= 2;
  const g = e / 2;
  f = Math.max(m, Math.round(f / m) * m);
  const _ = new Ht(r.grid).multiplyScalar(1.3), C = new Ht(r.grid).multiplyScalar(0.8), v = (oe, T, ne, L) => {
    const ae = [], ie = oe === "xy" ? (z, X) => [z, X, 0] : oe === "xz" ? (z, X) => [z, 0, X] : (z, X) => [0, z, X], I = Math.floor(g / T);
    for (let z = -I; z <= I; z++) {
      const X = z * T, V = ie(X, -g), F = ie(X, g);
      ae.push(...V, ...F);
    }
    for (let z = -I; z <= I; z++) {
      const X = z * T, V = ie(-g, X), F = ie(g, X);
      ae.push(...V, ...F);
    }
    const E = new ze();
    E.setAttribute("position", new Ct(ae, 3));
    const N = new ht({ color: ne, transparent: true, opacity: L, depthWrite: false }), D = new Wt(E, N);
    return D.name = `grid-${oe}-${T === m ? "minor" : "major"}`, D;
  }, K = (oe, T, ne) => {
    const L = oe === "xy" ? (D, z) => [D, z, 0] : oe === "xz" ? (D, z) => [D, 0, z] : (D, z) => [0, D, z], ae = [[-g, -g], [g, -g], [g, g], [-g, g]], ie = [];
    for (const [D, z] of ae) ie.push(...L(D, z));
    const I = new ze();
    I.setAttribute("position", new Ct(ie, 3));
    const E = new ht({ color: T, transparent: true, opacity: ne, depthWrite: false }), N = new vs(I, E);
    return N.name = `grid-${oe}-border`, N.renderOrder = 1, N;
  }, me = (oe, T, ne) => {
    const L = oe === "xy" ? (E, N) => [E, N, 0] : oe === "xz" ? (E, N) => [E, 0, N] : (E, N) => [0, E, N], ae = T === "u" ? [...L(-g, 0), ...L(g, 0)] : [...L(0, -g), ...L(0, g)], ie = new ze();
    ie.setAttribute("position", new Ct(ae, 3));
    const I = new Wt(ie, new ht({ color: ne, transparent: true, opacity: 0.45, depthWrite: false }));
    return I.name = `grid-${oe}-eje-${T}`, I.renderOrder = 1, I;
  }, be = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const oe of u) {
    d.add(v(oe, m, C, 0.12)), d.add(v(oe, f, _, 0.4));
    const [T, ne] = be[oe];
    d.add(me(oe, "u", T)), d.add(me(oe, "v", ne)), d.add(K(oe, _, 0.55));
  }
  return d.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: f, minorStep: m, gridSize: e, planes: [...u] }, d;
}
function wa(e, l, r, d) {
  const u = new it(), f = new Qs(0.5, 0.5, 0.5), m = new js(0.45, 0.7, 4);
  m.rotateX(Math.PI / 2), m.translate(0, 0, -0.35);
  const g = new ft({ color: 10166822 }), y = new ft({ color: 2792847 }), _ = new ft({ color: 3835647 }), C = () => {
    const me = r.rawVal ?? [];
    if (me.length < 2) return l.gridSize.val * 0.5;
    let be = [1 / 0, 1 / 0, 1 / 0], oe = [-1 / 0, -1 / 0, -1 / 0];
    for (const T of me) for (let ne = 0; ne < 3; ne++) T[ne] < be[ne] && (be[ne] = T[ne]), T[ne] > oe[ne] && (oe[ne] = T[ne]);
    return Math.max(oe[0] - be[0], oe[1] - be[1], oe[2] - be[2], 0.1);
  }, v = () => 0.08 * C(), K = () => d.rawVal;
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    u.clear();
    const me = v();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((be, oe) => {
      const T = r.val[oe];
      if (!T) return;
      const ne = be ?? [], L = (ne[0] ? 1 : 0) + (ne[1] ? 1 : 0) + (ne[2] ? 1 : 0), ae = (ne[3] ? 1 : 0) + (ne[4] ? 1 : 0) + (ne[5] ? 1 : 0);
      let ie;
      L >= 3 && ae >= 3 ? ie = new lt(f, g) : L >= 3 && ae === 0 ? ie = new lt(m, y) : ie = new lt(m, _), ie.position.set(T[0], T[1], T[2]);
      const I = me * K();
      ie.scale.set(I, I, I), u.add(ie);
    });
  }), j.derive(() => {
    if (d.val, !l.supports.rawVal) return;
    const be = v() * K();
    u.children.forEach((oe) => oe.scale.set(be, be, be));
  }), j.derive(() => {
    u.visible = l.supports.val;
  }), u;
}
function ya(e, l, r, d) {
  const u = new it();
  u.name = "loadsGroup";
  function f(g) {
    if (g.length < 2) return 0.12 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], _ = [-1 / 0, -1 / 0, -1 / 0];
    for (const v of g) for (let K = 0; K < 3; K++) y[K] = Math.min(y[K], v[K]), _[K] = Math.max(_[K], v[K]);
    return 0.08 * Math.max(_[0] - y[0], _[1] - y[1], _[2] - y[2], 0.1);
  }
  j.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    u.children.forEach((oe) => {
      var _a3;
      return (_a3 = oe.dispose) == null ? void 0 : _a3.call(oe);
    }), u.clear();
    const g = r.val, y = f(g), _ = 240, C = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((oe, T) => {
      g[T] && oe.slice(0, 3).some((ne) => Math.abs(ne) > 1e-15) && C.push(T);
    });
    let v = C;
    if (C.length > _) {
      const oe = C.map((F) => g[F][0]), T = C.map((F) => g[F][1]), ne = Math.min(...oe), L = Math.max(...oe), ae = Math.min(...T), ie = Math.max(...T), I = C.map((F) => g[F][2]), E = Math.max(1e-6, (Math.max(...I) - Math.min(...I)) / 40), N = (F) => Math.round(F / E), D = new Set(I.map(N)), z = Math.max(4, Math.floor(_ / Math.max(1, D.size))), X = Math.max(2, Math.round(Math.sqrt(z))), V = /* @__PURE__ */ new Map();
      for (const F of C) {
        const ee = L - ne < 1e-9 ? 0 : (g[F][0] - ne) / (L - ne), re = ie - ae < 1e-9 ? 0 : (g[F][1] - ae) / (ie - ae), ue = Math.min(X - 1, Math.floor(ee * X)), se = Math.min(X - 1, Math.floor(re * X)), B = `${ue},${se},${N(g[F][2])}`, ce = Math.hypot(ee * X - (ue + 0.5), re * X - (se + 0.5)), W = V.get(B);
        (!W || ce < W.d) && V.set(B, { i: F, d: ce });
      }
      v = [...V.values()].map((F) => F.i);
    }
    let K = 0;
    for (const oe of v) {
      const T = e.nodeInputs.val.loads.get(oe);
      for (let ne = 0; ne < 3; ne++) K = Math.max(K, Math.abs(T[ne]));
    }
    const me = v.length <= 60, be = (oe) => {
      const T = Math.abs(oe);
      return T >= 100 ? oe.toFixed(0) : T >= 10 ? oe.toFixed(1) : oe.toFixed(2);
    };
    for (const oe of v) {
      const T = e.nodeInputs.val.loads.get(oe), ne = g[oe];
      if (ne) for (let L = 0; L < 3; L++) {
        const ae = T[L];
        if (!(Math.abs(ae) > 1e-9 * (K || 1))) continue;
        const ie = new S(L === 0 ? Math.sign(ae) : 0, L === 1 ? Math.sign(ae) : 0, L === 2 ? Math.sign(ae) : 0), I = 0.45 + 0.55 * (K ? Math.abs(ae) / K : 1), E = new cn(ie, new S(...ne), 1, L === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (E.userData = { nudo: ne, dir: ie, rel: I }, u.add(E), me) {
          const N = new Pt(be(ae), L === 2 ? "#f5b642" : "#ff6b5e");
          N.userData = { nudo: ne, dir: ie, rel: I, texto: true }, u.add(N);
        }
      }
    }
    m(y * d.rawVal);
  });
  function m(g) {
    u.children.forEach((y) => {
      const _ = y.userData;
      if (!(_ == null ? void 0 : _.dir)) return;
      const C = g * _.rel, v = new S(..._.nudo).addScaledVector(_.dir, -C * (_.texto ? 1.12 : 1));
      y.position.copy(v), _.texto ? y.updateScale(g * 0.38) : y.scale.set(C, C, C);
    });
  }
  return j.derive(() => {
    d.val, l.loads.rawVal && m(f(r.rawVal) * d.rawVal);
  }), j.derive(() => {
    u.visible = l.loads.val;
  }), u;
}
function xa(e, l, r) {
  const d = new it();
  return j.derive(() => {
    if (!e.nodesIndexes.val) return;
    d.children.forEach((f) => f.dispose()), d.clear();
    const u = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((f, m) => {
      const g = new Pt(`${m}`);
      g.position.set(...f), g.updateScale(u * r.rawVal), d.add(g);
    });
  }), j.derive(() => {
    if (r.val, !e.nodesIndexes.rawVal) return;
    const u = 0.05 * e.gridSize.val * 0.6;
    d.children.forEach((f) => f.updateScale(u * r.rawVal));
  }), j.derive(() => {
    d.visible = e.nodesIndexes.val;
  }), d;
}
function ga(e, l, r, d) {
  const u = new it();
  return j.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    u.children.forEach((m) => m.dispose()), u.clear();
    const f = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((m, g) => {
      const y = new Pt(`${g}`, void 0, "#001219");
      y.position.set(...va(m.map((_) => r.rawVal[_]))), y.updateScale(f * d.rawVal), u.add(y);
    });
  }), j.derive(() => {
    if (d.val, !l.elementsIndexes.rawVal) return;
    const f = 0.05 * l.gridSize.val * 0.6;
    u.children.forEach((m) => m.updateScale(f * d.rawVal));
  }), j.derive(() => {
    u.visible = l.elementsIndexes.val;
  }), u;
}
function va(e) {
  const l = e.reduce((d, u) => [d[0] + u[0], d[1] + u[1], d[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function hs(e, l) {
  const r = new it(), d = Math.min(0.05 * e, 0.6), u = dn(), f = new Pt("X", "red", "transparent"), m = new Pt(l ? "Z" : "Y", "green", "transparent"), g = new Pt(l ? "Y" : "Z", "blue", "transparent"), y = new cn(new S(1, 0, 0), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), _ = new cn(new S(0, 1, 0), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), C = new cn(new S(0, 0, 1), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2);
  return f.position.set(1.3 * d, 0, 0), m.position.set(0, 1.3 * d, 0), g.position.set(0, 0, 1.3 * d), f.updateScale(0.4 * d), m.updateScale(0.4 * d), g.updateScale(0.4 * d), y.scale.set(d, d, d), _.scale.set(d, d, d), C.scale.set(d, d, d), r.add(y, _, C, f, m, g), r;
}
function Lo(e, l) {
  const r = new S(...e), u = new S(...l).clone().sub(r), f = u.length(), m = u.dot(new S(1, 0, 0)) / f, g = u.dot(new S(0, 1, 0)) / f, y = u.dot(new S(0, 0, 1)) / f, _ = Math.sqrt(m ** 2 + g ** 2);
  let C = new ko().fromArray([[m, g, y], [-g / _, m / _, 0], [-m * y / _, -g * y / _, _]].flat());
  return y === 1 && (C = new ko().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), y === -1 && (C = new ko().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new no().setFromMatrix3(C);
}
function Eo(e, l) {
  return e == null ? void 0 : e.map((r, d) => (9 * r + l[d]) / 10);
}
function Tn(e) {
  const l = e.reduce((d, u) => [d[0] + u[0], d[1] + u[1], d[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function ba(e, l, r) {
  const d = Tn([l, r]), u = Tn([e, r]), f = Tn([e, l]), m = new S(...d).sub(new S(...u)).normalize(), g = new S(...r).sub(new S(...f)).normalize(), y = m.clone().cross(g).normalize(), _ = y.clone().cross(m).normalize();
  return new no().makeBasis(m, _, y);
}
function Ma(e, l, r, d) {
  const u = new it(), f = new ze(), m = new ht({ vertexColors: true }), g = [0, 0, 0], y = [1, 0, 0], _ = [0, 1, 0], C = [0, 0, 1];
  f.setAttribute("position", new Ct([...g, ...y, ...g, ..._, ...g, ...C], 3));
  const v = [255, 0, 0], K = [0, 255, 0], me = [0, 0, 255];
  return f.setAttribute("color", new Ct([...v, ...v, ...K, ...K, ...me, ...me], 3)), j.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (u.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((be) => {
      const oe = new Wt(f, m), T = r.rawVal[be[0]], ne = r.rawVal[be[1]];
      if (be.length === 2 && (oe.position.set(...Eo(T, ne)), oe.rotation.setFromRotationMatrix(Lo(T, ne))), be.length === 3) {
        const ie = r.rawVal[be[2]];
        oe.position.set(...Tn([T, ne, ie])), oe.rotation.setFromRotationMatrix(ba(T, ne, ie));
      }
      const ae = 0.05 * l.gridSize.rawVal * 0.75 * d.rawVal;
      oe.scale.set(ae, ae, ae), u.add(oe);
    }));
  }), j.derive(() => {
    if (d.val, !l.orientations.rawVal) return;
    const oe = 0.05 * l.gridSize.val * 0.75 * d.rawVal;
    u.children.forEach((T) => T.scale.set(oe, oe, oe));
  }), j.derive(() => {
    u.visible = l.orientations.val;
  }), u;
}
function _a(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), r = (e.h * 100).toFixed(0);
    return `${l}x${r}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ka(e, l, r, d) {
  const u = new it(), f = new it();
  u.add(f);
  function m(E, N) {
    const D = E / 2, z = N / 2, X = new Float32Array([0, -D, -z, 0, D, -z, 0, D, z, 0, -D, -z, 0, D, z, 0, -D, z]), V = new ze();
    V.setAttribute("position", new yt(X, 3));
    const F = new Float32Array([0, -D, -z, 0, D, -z, 0, D, z, 0, -D, z, 0, -D, -z]), ee = new ze();
    return ee.setAttribute("position", new yt(F, 3)), { fill: V, outline: ee };
  }
  function g(E, N = 24) {
    const D = E / 2, z = new Float32Array(N * 9);
    for (let ee = 0; ee < N; ee++) {
      const re = ee / N * Math.PI * 2, ue = (ee + 1) / N * Math.PI * 2;
      z[ee * 9] = 0, z[ee * 9 + 1] = 0, z[ee * 9 + 2] = 0, z[ee * 9 + 3] = 0, z[ee * 9 + 4] = D * Math.cos(re), z[ee * 9 + 5] = D * Math.sin(re), z[ee * 9 + 6] = 0, z[ee * 9 + 7] = D * Math.cos(ue), z[ee * 9 + 8] = D * Math.sin(ue);
    }
    const X = new ze();
    X.setAttribute("position", new yt(z, 3));
    const V = new Float32Array((N + 1) * 3);
    for (let ee = 0; ee <= N; ee++) {
      const re = ee / N * Math.PI * 2;
      V[ee * 3] = 0, V[ee * 3 + 1] = D * Math.cos(re), V[ee * 3 + 2] = D * Math.sin(re);
    }
    const F = new ze();
    return F.setAttribute("position", new yt(V, 3)), { fill: X, outline: F };
  }
  function y(E, N, D, z) {
    const X = D ?? N * 0.08, V = z ?? E * 0.07, F = E / 2, ee = N / 2, re = ee - X, ue = V / 2, se = [];
    function B(ye, Ee, Me, Le) {
      se.push(0, ye, Ee, 0, Me, Ee, 0, Me, Le, 0, ye, Ee, 0, Me, Le, 0, ye, Le);
    }
    B(-F, -ee, F, -re), B(-ue, -re, ue, re), B(-F, re, F, ee);
    const ce = new ze();
    ce.setAttribute("position", new yt(new Float32Array(se), 3));
    const W = new Float32Array([0, -F, -ee, 0, F, -ee, 0, F, -re, 0, ue, -re, 0, ue, re, 0, F, re, 0, F, ee, 0, -F, ee, 0, -F, re, 0, -ue, re, 0, -ue, -re, 0, -F, -re, 0, -F, -ee]), we = new ze();
    return we.setAttribute("position", new yt(W, 3)), { fill: ce, outline: we };
  }
  function _(E, N, D) {
    const z = E / 2, X = N / 2, V = z - D, F = X - D, ee = [];
    function re(ce, W, we, ye) {
      ee.push(0, ce, W, 0, we, W, 0, we, ye, 0, ce, W, 0, we, ye, 0, ce, ye);
    }
    re(-z, -X, z, -F), re(-z, F, z, X), re(-z, -F, -V, F), re(V, -F, z, F);
    const ue = new ze();
    ue.setAttribute("position", new yt(new Float32Array(ee), 3));
    const se = new Float32Array([0, -z, -X, 0, z, -X, 0, z, -X, 0, z, X, 0, z, X, 0, -z, X, 0, -z, X, 0, -z, -X, 0, -V, -F, 0, V, -F, 0, V, -F, 0, V, F, 0, V, F, 0, -V, F, 0, -V, F, 0, -V, -F]), B = new ze();
    return B.setAttribute("position", new yt(se, 3)), { fill: ue, outline: B };
  }
  function C(E, N, D) {
    const z = E / 2, X = N / 2, V = z - D, F = X - D, ee = new ze(), re = new Float32Array([0, -V, -F, 0, V, -F, 0, V, F, 0, -V, -F, 0, V, F, 0, -V, F]);
    ee.setAttribute("position", new yt(re, 3));
    const ue = [];
    function se(we, ye, Ee, Me) {
      ue.push(0, we, ye, 0, Ee, ye, 0, Ee, Me, 0, we, ye, 0, Ee, Me, 0, we, Me);
    }
    se(-z, -X, z, -F), se(-z, F, z, X), se(-z, -F, -V, F), se(V, -F, z, F);
    const B = new ze();
    B.setAttribute("position", new yt(new Float32Array(ue), 3));
    const ce = new Float32Array([0, -z, -X, 0, z, -X, 0, z, -X, 0, z, X, 0, z, X, 0, -z, X, 0, -z, X, 0, -z, -X, 0, -V, -F, 0, V, -F, 0, V, -F, 0, V, F, 0, V, F, 0, -V, F, 0, -V, F, 0, -V, -F]), W = new ze();
    return W.setAttribute("position", new yt(ce, 3)), { concFill: ee, steelFillGeom: B, outline: W };
  }
  function v(E, N, D) {
    const z = [], X = [[0, -E / 2, -N / 2], [0, -E / 2 + D, -N / 2], [0, -E / 2 + D, N / 2 - D], [0, E / 2, N / 2 - D], [0, E / 2, N / 2], [0, -E / 2, N / 2]], V = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ue of V) z.push(...X[ue]);
    const F = new ze();
    F.setAttribute("position", new yt(new Float32Array(z), 3));
    const ee = [];
    for (let ue = 0; ue < X.length; ue++) {
      const se = (ue + 1) % X.length;
      ee.push(...X[ue], ...X[se]);
    }
    const re = new ze();
    return re.setAttribute("position", new yt(new Float32Array(ee), 3)), { fill: F, outline: re };
  }
  function K(E, N, D, z) {
    const X = z / 2, V = [], F = [[0, -E - X, -N / 2], [0, -D - X, -N / 2], [0, -D - X, N / 2 - D], [0, -X, N / 2 - D], [0, -X, N / 2], [0, -E - X, N / 2]], ee = [[0, X, -N / 2], [0, X + D, -N / 2], [0, X + D, N / 2 - D], [0, E + X, N / 2 - D], [0, E + X, N / 2], [0, X, N / 2]], re = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ce of re) V.push(...F[ce]);
    for (const ce of re) V.push(...ee[ce]);
    const ue = new ze();
    ue.setAttribute("position", new yt(new Float32Array(V), 3));
    const se = [];
    for (const ce of [F, ee]) for (let W = 0; W < ce.length; W++) {
      const we = (W + 1) % ce.length;
      se.push(...ce[W], ...ce[we]);
    }
    const B = new ze();
    return B.setAttribute("position", new yt(new Float32Array(se), 3)), { fill: ue, outline: B };
  }
  function me(E, N, D, z) {
    const X = N / 2, V = E, F = [[0, -V, -X], [0, -V, -X + D], [0, -z, -X + D], [0, -z, X - D], [0, -V, X - D], [0, -V, X], [0, 0, X], [0, 0, -X]], ee = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], re = [];
    for (const ce of ee) re.push(...F[ce]);
    const ue = new ze();
    ue.setAttribute("position", new yt(new Float32Array(re), 3));
    const se = [];
    for (let ce = 0; ce < F.length; ce++) {
      const W = (ce + 1) % F.length;
      se.push(...F[ce], ...F[W]);
    }
    const B = new ze();
    return B.setAttribute("position", new yt(new Float32Array(se), 3)), { fill: ue, outline: B };
  }
  function be(E, N, D, z, X) {
    const V = N / 2, F = X / 2, ee = [], re = [[0, -E, -V], [0, -E, -V + D], [0, -F - z, -V + D], [0, -F - z, V - D], [0, -E, V - D], [0, -E, V], [0, -F, V], [0, -F, -V]], ue = re.map((we) => [we[0], -we[1], we[2]]), se = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const we of se) ee.push(...re[we]);
    for (const we of se) ee.push(...ue[we]);
    const B = new ze();
    B.setAttribute("position", new yt(new Float32Array(ee), 3));
    const ce = [];
    for (const we of [re, ue]) for (let ye = 0; ye < we.length; ye++) {
      const Ee = (ye + 1) % we.length;
      ce.push(...we[ye], ...we[Ee]);
    }
    const W = new ze();
    return W.setAttribute("position", new yt(new Float32Array(ce), 3)), { fill: B, outline: W };
  }
  function oe(E, N, D, z) {
    const X = E / 2, V = N / 2, F = z / 2, ee = [[0, -F, -V], [0, F, -V], [0, F, V - D], [0, X, V - D], [0, X, V], [0, -X, V], [0, -X, V - D], [0, -F, V - D]], re = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], ue = [];
    for (const W of re) ue.push(...ee[W]);
    const se = new ze();
    se.setAttribute("position", new yt(new Float32Array(ue), 3));
    const B = [];
    for (let W = 0; W < ee.length; W++) {
      const we = (W + 1) % ee.length;
      B.push(...ee[W], ...ee[we]);
    }
    const ce = new ze();
    return ce.setAttribute("position", new yt(new Float32Array(B), 3)), { fill: se, outline: ce };
  }
  function T(E, N, D = 24) {
    const z = E / 2, X = z - N, V = [];
    for (let ue = 0; ue < D; ue++) {
      const se = ue / D * Math.PI * 2, B = (ue + 1) / D * Math.PI * 2, ce = Math.cos(se), W = Math.sin(se), we = Math.cos(B), ye = Math.sin(B);
      V.push(0, z * ce, z * W, 0, z * we, z * ye, 0, X * we, X * ye), V.push(0, z * ce, z * W, 0, X * we, X * ye, 0, X * ce, X * W);
    }
    const F = new ze();
    F.setAttribute("position", new yt(new Float32Array(V), 3));
    const ee = [];
    for (let ue = 0; ue < D; ue++) {
      const se = ue / D * Math.PI * 2, B = (ue + 1) / D * Math.PI * 2;
      ee.push(0, z * Math.cos(se), z * Math.sin(se), 0, z * Math.cos(B), z * Math.sin(B)), ee.push(0, X * Math.cos(se), X * Math.sin(se), 0, X * Math.cos(B), X * Math.sin(B));
    }
    const re = new ze();
    return re.setAttribute("position", new yt(new Float32Array(ee), 3)), { fill: F, outline: re };
  }
  const ne = new ft({ color: 52479, transparent: true, opacity: 0.35, side: At, depthWrite: false }), L = new ht({ color: 52479 }), ae = new ft({ color: 16750848, transparent: true, opacity: 0.4, side: At, depthWrite: false }), ie = new ht({ color: 16750848 });
  function I(E, N) {
    const D = Math.abs(N[0] - E[0]), z = Math.abs(N[1] - E[1]), X = Math.abs(N[2] - E[2]);
    return X > D && X > z || z > D && z > X;
  }
  return j.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const E = l.secColumns.rawVal, N = l.secBeams.rawVal;
    if (!E && !N) {
      u.children.forEach((F) => {
        F instanceof Pt && F.dispose();
      }), u.clear();
      return;
    }
    u.children.forEach((F) => {
      F instanceof Pt && F.dispose();
    }), u.clear();
    const D = (_a2 = e.elements) == null ? void 0 : _a2.val, z = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!D || !z) return;
    const X = z.sectionShapes, V = l.secFloor.rawVal;
    D.forEach((F, ee) => {
      if (F.length !== 2) return;
      const re = r.rawVal[F[0]], ue = r.rawVal[F[1]];
      if (!re || !ue) return;
      const se = I(re, ue);
      if (se && !E || !se && !N) return;
      if (V >= 0) {
        const ye = Math.min(re[1], ue[1]);
        Math.max(re[1], ue[1]);
        const Ee = l.gridSize.rawVal || 3;
        if (Math.floor(ye / Ee + 0.01) !== V) return;
      }
      const B = X == null ? void 0 : X.get(ee);
      if (!B) return;
      const ce = [(re[0] + ue[0]) / 2, (re[1] + ue[1]) / 2, (re[2] + ue[2]) / 2], W = Lo(re, ue);
      if (B.type === "CFT") {
        const ye = C(B.b, B.h, B.tw ?? B.b * 0.05), Ee = new lt(ye.concFill, ne);
        Ee.position.set(...ce), Ee.rotation.setFromRotationMatrix(W), u.add(Ee);
        const Me = new lt(ye.steelFillGeom, ae);
        Me.position.set(...ce), Me.rotation.setFromRotationMatrix(W), u.add(Me);
        const Le = new Ft(ye.outline, ie);
        Le.position.set(...ce), Le.rotation.setFromRotationMatrix(W), u.add(Le);
      } else {
        let ye, Ee, Me;
        switch (B.type) {
          case "rect":
            ye = m(B.b, B.h), Ee = ne, Me = L;
            break;
          case "circ":
            ye = g(B.d), Ee = ne, Me = L;
            break;
          case "I":
            ye = y(B.b, B.h, B.tf, B.tw), Ee = ae, Me = ie;
            break;
          case "HSS":
            ye = _(B.b, B.h, B.tw ?? B.b * 0.05), Ee = ae, Me = ie;
            break;
          case "CFT":
            ye = C(B.b, B.h, B.tw ?? B.b * 0.05), Ee = ae, Me = ie;
            break;
          case "L":
            ye = v(B.b ?? B.h, B.h, B.t ?? B.tw ?? 3e-3), Ee = ae, Me = ie;
            break;
          case "2L":
            ye = K(B.b ?? B.h, B.h, B.t ?? B.tw ?? 3e-3, B.dis ?? 0.01), Ee = ae, Me = ie;
            break;
          case "C":
          case "coldC":
            ye = me(B.b, B.h, B.tf ?? B.t ?? 3e-3, B.tw ?? B.t ?? 3e-3), Ee = ae, Me = ie;
            break;
          case "2C":
            ye = be(B.b, B.h, B.tf ?? 5e-3, B.tw ?? 5e-3, B.dis ?? 0.01), Ee = ae, Me = ie;
            break;
          case "T":
            ye = oe(B.b, B.h, B.tf ?? 0.01, B.tw ?? 6e-3), Ee = ae, Me = ie;
            break;
          case "pipe":
            ye = T(B.d, B.tw ?? B.d * 0.05), Ee = ae, Me = ie;
            break;
          default:
            return;
        }
        const Le = new lt(ye.fill, Ee);
        Le.position.set(...ce), Le.rotation.setFromRotationMatrix(W), u.add(Le);
        const Ke = new Ft(ye.outline, Me);
        Ke.position.set(...ce), Ke.rotation.setFromRotationMatrix(W), u.add(Ke);
      }
      const we = _a(B);
      if (we) {
        const Ee = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(B.type) ? "#ff9900" : "#00ccff", Me = new Pt(we, Ee, "transparent");
        Me.position.set(ce[0], ce[1], ce[2]);
        const Le = 0.05 * l.gridSize.rawVal * 0.5;
        Me.updateScale(Le * ((d == null ? void 0 : d.rawVal) ?? 1)), f.add(Me);
      }
    });
  }), d && j.derive(() => {
    if (d.val, !l.sections.rawVal) return;
    const E = 0.05 * l.gridSize.val * 0.5;
    f.children.forEach((N) => {
      N instanceof Pt && N.updateScale(E * d.rawVal);
    });
  }), j.derive(() => {
    u.visible = l.sections.val;
  }), j.derive(() => {
    f.visible = l.sectionLabels.val;
  }), u;
}
function Sa(e) {
  if (!e) return null;
  const l = e.type, r = (C, v) => [C, v], d = (C, v) => [r(-C / 2, -v / 2), r(C / 2, -v / 2), r(C / 2, v / 2), r(-C / 2, v / 2)], u = (C, v = 24) => {
    const K = C / 2, me = [];
    for (let be = 0; be < v; be++) {
      const oe = 2 * Math.PI * be / v;
      me.push(r(K * Math.cos(oe), K * Math.sin(oe)));
    }
    return me;
  }, f = e.b ?? 0, m = e.h ?? 0, g = e.d ?? 0, y = e.tw ?? e.t ?? 0, _ = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return f && m ? { contorno: d(f, m) } : null;
    case "circ":
      return g ? { contorno: u(g) } : null;
    case "pipe":
      return g && y ? { contorno: u(g), huecos: [u(g - 2 * y).reverse()] } : null;
    case "HSS":
      return f && m && y ? { contorno: d(f, m), huecos: [d(f - 2 * y, m - 2 * (_ || y)).reverse()] } : null;
    case "CFT":
      return f && m ? { contorno: d(f, m) } : null;
    case "I":
      return f && m && y && _ ? { contorno: [r(-f / 2, -m / 2), r(f / 2, -m / 2), r(f / 2, -m / 2 + _), r(y / 2, -m / 2 + _), r(y / 2, m / 2 - _), r(f / 2, m / 2 - _), r(f / 2, m / 2), r(-f / 2, m / 2), r(-f / 2, m / 2 - _), r(-y / 2, m / 2 - _), r(-y / 2, -m / 2 + _), r(-f / 2, -m / 2 + _)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return f && m && y && _ ? { contorno: [r(-f / 2, -m / 2), r(f / 2, -m / 2), r(f / 2, -m / 2 + _), r(-f / 2 + y, -m / 2 + _), r(-f / 2 + y, m / 2 - _), r(f / 2, m / 2 - _), r(f / 2, m / 2), r(-f / 2, m / 2)] } : null;
    case "T":
      return f && m && y && _ ? { contorno: [r(-y / 2, -m / 2), r(y / 2, -m / 2), r(y / 2, m / 2 - _), r(f / 2, m / 2 - _), r(f / 2, m / 2), r(-f / 2, m / 2), r(-f / 2, m / 2 - _), r(-y / 2, m / 2 - _)] } : null;
    case "L":
    case "2L":
      return f && m && y ? { contorno: [r(-f / 2, -m / 2), r(f / 2, -m / 2), r(f / 2, -m / 2 + y), r(-f / 2 + y, -m / 2 + y), r(-f / 2 + y, m / 2), r(-f / 2, m / 2)] } : null;
    default:
      return f && m ? { contorno: d(f, m) } : g ? { contorno: u(g) } : null;
  }
}
function Pa(e, l, r) {
  if (!e || e <= 0 || !l || !r || l <= 0 || r <= 0) return null;
  const d = Math.sqrt(Math.sqrt(r / l)), u = Math.sqrt(e / d), f = e / u;
  return !isFinite(u) || !isFinite(f) || u <= 0 || f <= 0 ? null : { contorno: [[-u / 2, -f / 2], [u / 2, -f / 2], [u / 2, f / 2], [-u / 2, f / 2]] };
}
function Ca(e) {
  const l = new Vn();
  e.contorno.forEach(([r, d], u) => u ? l.lineTo(r, d) : l.moveTo(r, d)), l.closePath();
  for (const r of e.huecos ?? []) {
    const d = new ta();
    r.forEach(([u, f], m) => m ? d.lineTo(u, f) : d.moveTo(u, f)), d.closePath(), l.holes.push(d);
  }
  return l;
}
function za(e, l, r) {
  const d = new it();
  d.name = "extrusion";
  const u = new So({ color: 8369151, transparent: true, opacity: 0.92, side: At }), f = new So({ color: 12623968, transparent: true, opacity: 0.85, side: At }), m = new So({ color: 11583173, transparent: true, opacity: 0.85, side: At }), g = new it();
  g.add(new bs(16777215, 0.55));
  const y = new to(16777215, 0.75);
  y.position.set(30, 25, 40);
  const _ = new to(16777215, 0.35);
  _.position.set(-25, -20, 15), g.add(y, _);
  let C = 0;
  return j.derive(() => {
    var _a2, _b, _c, _d, _e;
    const v = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++C, on: v }, d.visible = v;
    for (const L of [...d.children]) L !== g && (d.remove(L), (_c = (_b = L.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (d.children.includes(g) || d.add(g), !v) return;
    const K = r.val ?? [], me = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], be = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, oe = be.sectionShapes ?? /* @__PURE__ */ new Map(), T = be.thicknesses ?? /* @__PURE__ */ new Map();
    let ne = "";
    try {
      me.forEach((L, ae) => {
        var _a3, _b2, _c2;
        if (L.length === 2) {
          let ie = Sa(oe.get(ae)), I = true;
          if (ie || (ie = Pa((_a3 = be.areas) == null ? void 0 : _a3.get(ae), (_b2 = be.momentsOfInertiaY) == null ? void 0 : _b2.get(ae), (_c2 = be.momentsOfInertiaZ) == null ? void 0 : _c2.get(ae)), I = false), !ie) return;
          const E = K[L[0]], N = K[L[1]];
          if (!E || !N) return;
          const D = Math.hypot(N[0] - E[0], N[1] - E[1], N[2] - E[2]);
          if (D < 1e-9) return;
          const z = new ea(Ca(ie), { depth: D, bevelEnabled: false, curveSegments: 4 });
          z.applyMatrix4(new no().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const X = new lt(z, I ? u : f);
          X.position.set(E[0], E[1], E[2]), X.rotation.setFromRotationMatrix(Lo(E, N)), d.add(X);
          return;
        }
        if (L.length === 3 || L.length === 4) {
          const ie = T.get(ae);
          if (!ie || ie <= 0) return;
          const I = L.map((W) => K[W]).filter(Boolean);
          if (I.length < 3) return;
          const E = [I[1][0] - I[0][0], I[1][1] - I[0][1], I[1][2] - I[0][2]], N = [I[2][0] - I[0][0], I[2][1] - I[0][1], I[2][2] - I[0][2]], D = E[1] * N[2] - E[2] * N[1], z = E[2] * N[0] - E[0] * N[2], X = E[0] * N[1] - E[1] * N[0], V = Math.hypot(D, z, X);
          if (V < 1e-12) return;
          const F = [D / V, z / V, X / V], ee = [], re = (W) => I.map((we) => [we[0] + F[0] * W, we[1] + F[1] * W, we[2] + F[2] * W]), ue = re(+ie / 2), se = re(-ie / 2), B = (W, we, ye) => ee.push(...W, ...we, ...ye);
          for (const W of [ue, se]) B(W[0], W[1], W[2]), W.length === 4 && B(W[0], W[2], W[3]);
          for (let W = 0; W < I.length; W++) {
            const we = (W + 1) % I.length;
            B(ue[W], se[W], se[we]), B(ue[W], se[we], ue[we]);
          }
          const ce = new ze();
          ce.setAttribute("position", new Ct(ee, 3)), ce.computeVertexNormals(), d.add(new lt(ce, m));
        }
      });
    } catch (L) {
      ne = String((L == null ? void 0 : L.message) ?? L);
    }
    globalThis.__extrusionDebug = { corridas: C, on: v, fallo: ne, nElementos: me.length, nFormas: oe.size, nEspesores: T.size, mallas: d.children.length - 1 };
  }), d;
}
function Cs(e, l, r = 0) {
  const d = [l[0] - e[0], l[1] - e[1], l[2] - e[2]], u = Math.hypot(d[0], d[1], d[2]) || 1, f = d[0] / u, m = d[1] / u, g = d[2] / u, y = Math.sqrt(f * f + m * m);
  let _, C, v;
  if (y < 1e-9) {
    const K = g > 0 ? 1 : -1;
    _ = [0, 0, K], C = [1, 0, 0], v = [0, K, 0];
  } else _ = [f, m, g], C = [-f * g / y, -m * g / y, y], v = [m / y, -f / y, 0];
  if (Math.abs(r) > 1e-12) {
    const K = r * Math.PI / 180, me = Math.cos(K), be = Math.sin(K), oe = C.map((ne, L) => me * ne + be * v[L]), T = v.map((ne, L) => -be * C[L] + me * ne);
    C = oe, v = T;
  }
  return { e1: _, e2: C, e3: v };
}
function Vo(e, l) {
  if (!l) return [0, 0];
  const r = Number(l[0] ?? 0), d = Number(l[1] ?? 0);
  return e === "bendingsY" ? [r, -d] : [-r, d];
}
function zs(e, l) {
  const r = (d) => d.map((u) => -u);
  switch (e) {
    case "bendingsZ":
      return r(l.e2);
    case "bendingsY":
      return r(l.e3);
    case "shearsZ":
      return l.e3;
    default:
      return l.e2;
  }
}
class Jn extends it {
  constructor(l, r, d, u, f, m, g) {
    super();
    const y = new Vn().moveTo(0, 0).lineTo(0, m[1]).lineTo(d, m[1]).lineTo(d, 0).lineTo(0, 0), _ = y.getPoints(), C = new ze().setFromPoints(_);
    this.lines = new Ft(C, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const v = new eo(y), K = new ft({ color: m[1] > 0 ? 24435 : 11411474, side: At });
    this.mesh = new lt(v, K), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Pt(`${f[1].toFixed(4)}`), this.normalizedResult = m, this.textPosition = Tn([l, r]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(u), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Fo extends it {
  constructor(l, r, d, u, f, m, g) {
    super();
    const y = f[0] * d / (f[0] + f[1]), _ = f[0] * f[1] > 0;
    if (this.text = new Pt(`${f[0].toFixed(4)}`), this.text2 = new Pt(`${(f[1] * -1).toFixed(4)}`), this.normalizedResult = m, this.textPosition = Eo(l, r), this.text2Position = Eo(r, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(u), this.text2.rotation.setFromRotationMatrix(u), this.add(this.text, this.text2), _) {
      const C = new Vn().moveTo(0, 0).lineTo(0, m[0]).lineTo(y, 0).lineTo(0, 0), v = new Vn().moveTo(y, 0).lineTo(d, -m[1]).lineTo(d, 0).lineTo(y, 0), K = C.getPoints(), me = v.getPoints(), be = new ze().setFromPoints(K), oe = new ze().setFromPoints(me), T = new ht({ color: dn().resultOutline });
      this.lines = new Ft(be, T), this.lines2 = new Ft(oe, T), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), this.lines2.rotation.setFromRotationMatrix(u), g && this.lines.rotateX(Math.PI / 2), g && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ne = new eo(C), L = new eo(v), ae = new ft({ color: m[0] > 0 ? 24435 : 11411474, side: At }), ie = new ft({ color: -m[1] > 0 ? 24435 : 11411474, side: At });
      this.mesh = new lt(ne, ae), this.mesh2 = new lt(L, ie), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), this.mesh2.rotation.setFromRotationMatrix(u), g && this.mesh.rotateX(Math.PI / 2), g && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const C = new Vn().moveTo(0, 0).lineTo(0, m[0]).lineTo(d, -m[1]).lineTo(d, 0).lineTo(0, 0), v = C.getPoints(), K = new ze().setFromPoints(v);
      this.lines = new Ft(K, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const me = new eo(C), be = new ft({ color: m[0] > 0 ? 24435 : 11411474, side: At });
      this.mesh = new lt(me, be), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var Fs = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(Fs || {});
function Fa(e, l, r, d) {
  const u = () => {
    const g = r.rawVal;
    if (!(g == null ? void 0 : g.length)) return 0.05 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], _ = [-1 / 0, -1 / 0, -1 / 0];
    for (const v of g) for (let K = 0; K < 3; K++) v[K] < y[K] && (y[K] = v[K]), v[K] > _[K] && (_[K] = v[K]);
    const C = Math.hypot(_[0] - y[0], _[1] - y[1], _[2] - y[2]);
    return !isFinite(C) || C <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * C;
  }, f = new it(), m = { normals: Jn, shearsY: Jn, shearsZ: Jn, torsions: Jn, bendingsY: Fo, bendingsZ: Fo };
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, r.val, l.frameResults.val == "none") return;
    f.children.forEach((y) => y.dispose()), f.clear();
    const g = Fs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[g]) == null ? void 0 : _b.forEach((y, _) => {
      var _a3, _b2, _c, _d, _e, _f;
      const C = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[_]) ?? [0, 1], v = r.rawVal[C[0]], K = r.rawVal[C[1]];
      if (!v || !K) return;
      const me = new S(...K).distanceTo(new S(...v)), be = Aa((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[g]), oe = ((_f = (_e = (_d = (_c = e.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, _)) ?? 0, T = Cs(v, K, oe), ne = zs(g, T), L = new S(...T.e1), ae = new S(...ne), ie = new no().makeBasis(L, ae, L.clone().cross(ae)), [I, E] = Vo(g, y), N = m[g] === Fo ? [I, -E] : [I, E], D = N.map((X) => X / (be === 0 ? 1 : be)), z = new m[g](v, K, me, ie, N, D, false);
      z.updateScale(u() * d.rawVal), f.add(z);
    });
  }), j.derive(() => {
    if (d.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const g = u();
    f.children.forEach((y) => y.updateScale(g * d.rawVal));
  }), j.derive(() => {
    f.visible = l.frameResults.val != "none";
  }), f;
}
function Aa(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((r) => {
    const d = Math.max(...(r ?? [0, 0]).map((u) => Math.abs(u)));
    d > l && (l = d);
  }), l;
}
class Ea extends it {
  constructor(l, r, d) {
    super();
    const u = r === Io.reactions;
    d[0] && (this.xText1 = new Pt(`${u ? "Fx" : "Dx"}: ` + d[0].toFixed(4))), d[3] && (this.xText2 = new Pt(`${u ? "Mx" : "Rx"}: ` + d[3].toFixed(4))), d[1] && (this.yText1 = new Pt(`${u ? "Fy" : "Dy"}: ` + d[1].toFixed(4))), d[4] && (this.yText2 = new Pt(`${u ? "My" : "Ry"}: ` + d[4].toFixed(4))), d[2] && (this.zText1 = new Pt(`${u ? "Fz" : "Dz"}: ` + d[2].toFixed(4))), d[5] && (this.zText2 = new Pt(`${u ? "Mz" : "Rz"}: ` + d[5].toFixed(4))), (d[0] || d[3]) && (this.xArrow = new cn(new S(1, 0, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (d[1] || d[4]) && (this.yArrow = new cn(new S(0, 1, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (d[2] || d[5]) && (this.zArrow = new cn(new S(0, 0, 1), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
var Io = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(Io || {});
function Va(e, l, r, d) {
  const u = new it();
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    u.children.forEach((g) => g.dispose()), u.clear();
    const f = Io[l.nodeResults.rawVal], m = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[f]) == null ? void 0 : _b.forEach((g, y) => {
      const _ = new Ea(r.rawVal[y], f, g ?? [0, 0, 0, 0, 0, 0]);
      _.updateScale(m * d.rawVal), u.add(_);
    });
  }), j.derive(() => {
    if (d.val, l.nodeResults.rawVal == "none") return;
    const f = 0.05 * l.gridSize.val;
    u.children.forEach((m) => m.updateScale(f * d.rawVal));
  }), j.derive(() => {
    u.visible = l.nodeResults.val != "none";
  }), u;
}
function Ta({ drawingObj: e, gridObj: l, scene: r, getActiveCamera: d, controls: u, gridSize: f, derivedDisplayScale: m, rendererElm: g, viewerRender: y }) {
  const _ = new na(), C = new oa(), v = (t) => {
    const o = g.getBoundingClientRect(), s = t.clientX - o.left, n = t.clientY - o.top, a = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const h = a / 2;
      if (s >= h) return C.x = (s - h) / h * 2 - 1, C.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? d();
      C.x = s / h * 2 - 1;
    } else C.x = s / a * 2 - 1;
    return C.y = -(n / i) * 2 + 1, d();
  }, K = new lt(new en(1e4, 1e4), new ft({ side: At, transparent: true, opacity: 0, depthWrite: false }));
  K.visible = true, K.frustumCulled = false, r.add(K);
  const me = (t, o, s) => {
    const n = new lt(new en(1e4, 1e4), new ft({ side: At, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, s), n.visible = false, n.frustumCulled = false, r.add(n), n;
  }, be = me(Math.PI / 2, 0, 0), oe = me(0, Math.PI / 2, 0);
  let T = false;
  const ne = () => {
    if (T) return _.intersectObjects([K], false);
    if (be.visible = !!window.__hekatanGridPlaneXZ, oe.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ze.visible) {
      const s = _.intersectObjects([Ze, rt, Xe], false);
      if (s.length > 0) return s;
    }
    const o = [K];
    return be.visible && o.push(be), oe.visible && o.push(oe), Ot.visible && un.length > 0 && o.push(...un), _.intersectObjects(o, false);
  }, L = new Qn(new ze(), new jn()), ae = new Qn(new ze(), new jn({ color: "gray", sizeAttenuation: false, size: 6 })), ie = new Qn(new ze(), new jn({ color: "orange", sizeAttenuation: false, size: 5 }));
  r.add(ie);
  const I = document.createElement("input");
  I.id = "hk-rubber-label", I.type = "text", I.spellcheck = false, I.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, I.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(I);
  let E = null, N = null, D = false;
  const z = new S(), X = (t, o, s, n, a, i) => {
    const c = n - t, h = a - o, w = i - s, x = Math.hypot(c, h, w);
    if (x < 0.01) {
      I.style.display = "none";
      return;
    }
    E = [t, o, s], N = [c / x, h / x, w / x], z.set((t + n) / 2, (o + a) / 2, (s + i) / 2), z.project(d());
    const M = g.getBoundingClientRect(), k = M.left + (z.x * 0.5 + 0.5) * M.width, p = M.top + (-z.y * 0.5 + 0.5) * M.height;
    if (I.style.left = k + "px", I.style.top = p + "px", I.style.display = "block", !D) {
      if (I.value = `${x.toFixed(2)} m`, document.activeElement !== I) {
        const R = document.activeElement;
        R && (R.tagName === "INPUT" || R.tagName === "TEXTAREA") && R !== I || I.focus({ preventScroll: true });
      }
      try {
        I.select();
      } catch {
      }
    }
  }, V = () => {
    I.style.display = "none", E = null, N = null, D = false, document.activeElement === I && I.blur();
  }, F = (t) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      rn = t, pe(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), I.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ue.length === 1) {
      const M = Ue[0];
      Ue = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, M[0], M[1], M[2], t), pe(`\u2713 C\xEDrculo r=${t} m en (${M[0].toFixed(2)}, ${M[1].toFixed(2)}, ${M[2].toFixed(2)}).`);
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
      vt = t, pe(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), I.blur();
      return;
    }
    if (!E || !N || !e.polylines) return;
    let s = N[0], n = N[1], a = N[2];
    Je === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : Je === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : Je === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const i = E[0] + s * t, c = E[1] + n * t, h = E[2] + a * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, c, h]];
    const w = e.polylines.rawVal, x = w.length ? w[w.length - 1] : [];
    e.polylines.val = [...w.slice(0, -1), [...x, e.points.rawVal.length - 1]], I.blur();
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
        const [i, c] = a;
        return s ? { kind: "relPolar", L: i, ang: c } : { kind: "absPolar", L: i, ang: c };
      }
      if (a.length === 3 && s) {
        const [i, c, h] = a;
        return { kind: "relSpherical", L: i, az: c, el: h };
      }
      return null;
    }
    if (o.includes(",")) {
      const a = o.split(",").map((w) => parseFloat(w.trim()));
      if (a.some(isNaN)) return null;
      const [i, c, h = 0] = a;
      return s ? { kind: "relCart", dx: i, dy: c, dz: h } : { kind: "absCart", x: i, y: c, z: h };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, re = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return E ? [E[0] + t.dx, E[1] + t.dy, E[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!E) return null;
      const o = t.ang * Math.PI / 180;
      return [E[0] + t.L * Math.cos(o), E[1] + t.L * Math.sin(o), E[2]];
    }
    if (t.kind === "relSpherical") {
      if (!E) return null;
      const o = t.az * Math.PI / 180, s = t.el * Math.PI / 180, n = t.L * Math.cos(s);
      return [E[0] + n * Math.cos(o), E[1] + n * Math.sin(o), E[2] + t.L * Math.sin(s)];
    }
    return null;
  }, ue = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...s, e.points.rawVal.length - 1]], E = t, I.blur();
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
    if (o.kind === "length") return F(o.L), true;
    const s = re(o);
    if (!s) return false;
    es(new S(s[0], s[1], s[2]), null), E = s, I.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, I.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const s = ee(I.value);
      if (!s) return;
      if (D = false, s.kind === "length") F(s.L), pe(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = re(s);
        if (!n) return;
        ue(n);
        const a = s.kind;
        pe(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), D = false, I.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!D && I.style.display === "block") try {
          I.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && (D = true);
  }), window.addEventListener("keydown", (t) => {
    if (!E || !N || document.activeElement === I) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (I.value = t.key, I.focus(), I.setSelectionRange(1, 1), t.preventDefault());
  });
  const se = document.createElement("div");
  se.id = "hk-coord-readout", se.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", se.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(se);
  const B = document.createElement("div");
  B.id = "hk-coord-fixed", B.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", B.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(B);
  const ce = new Ft(new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new Fn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  ce.frustumCulled = false, ce.visible = false, ce.name = "rubberBand", r.add(ce), window.__hekatanRubberBand = ce;
  const W = new Ft(new ze(), new ht({ color: 2282478, transparent: true, opacity: 0.9 }));
  W.frustumCulled = false, W.visible = false, r.add(W);
  let we = [];
  const ye = new it(), Ee = new lt(new en(1, 1), new ft({ color: 2282478, transparent: true, opacity: 0.08, side: At, depthWrite: false })), Me = new Wt(new ls(new en(1, 1)), new ht({ color: 2282478, transparent: true, opacity: 0.85 })), Le = new Wt(new ze(), new ht({ color: 2282478, transparent: true, opacity: 0.3 })), Ke = (t, o) => {
    const s = [], n = Math.ceil(t / o);
    for (let a = -n; a <= n; a++) {
      const i = a * o;
      s.push(-t, i, 0, t, i, 0), s.push(i, -t, 0, i, t, 0);
    }
    Le.geometry.dispose(), Le.geometry = new ze(), Le.geometry.setAttribute("position", new Ct(s, 3));
  };
  ye.add(Ee, Me, Le), ye.visible = false, ye.frustumCulled = false, r.add(ye);
  const st = new it();
  st.frustumCulled = false, st.visible = false, r.add(st);
  const mt = (t) => {
    const o = new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), s = new Fn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Ft(o, s);
  }, P = mt(16711680), Y = mt(65280), Q = mt(35071);
  st.add(P, Y, Q);
  const G = [], xe = (t) => t.traverse((o) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = o.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), de = mt(16761856);
  de.material.dashSize = 0.28, de.material.gapSize = 0.16, de.material.opacity = 0.9, de.frustumCulled = false, de.visible = false, de.renderOrder = 98, r.add(de);
  const ke = (t) => {
    const o = new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0)]), s = new ht({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new vs(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, fe = ke(3462041), De = ke(16724804), Te = ke(6333946), He = new it();
  He.frustumCulled = false, He.visible = false, r.add(He), He.add(fe, De, Te);
  const Oe = (t) => {
    const o = new en(1, 1), s = new ft({ color: t, transparent: true, opacity: 0.06, side: At, depthWrite: false }), n = new lt(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ze = Oe(3462041), rt = Oe(16724804), Xe = Oe(6333946);
  He.add(Ze, rt, Xe);
  const he = (t, o, s, n) => {
    t.scale.set(2 * n, 2 * n, 1), s === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : s === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, Pe = document.createElement("div");
  Pe.id = "hk-refplane-badge", Pe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Pe), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, He.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], c = window.__hekatanOrthoExt ?? 8;
      Ne(fe, i, "xy", c), Ne(De, i, "xz", c), Ne(Te, i, "yz", c), he(Ze, i, "xy", c), he(rt, i, "xz", c), he(Xe, i, "yz", c), Ze.material.opacity = 0.05, rt.material.opacity = 0.05, Xe.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    y();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !He.visible) {
      y();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    Ne(fe, i, "xy", t), Ne(De, i, "xz", t), Ne(Te, i, "yz", t), he(Ze, i, "xy", t), he(rt, i, "xz", t), he(Xe, i, "yz", t), y();
  };
  const xt = (t) => {
    if (Ze.material.opacity = t === "xy" ? 0.09 : 0.025, rt.material.opacity = t === "xz" ? 0.09 : 0.025, Xe.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      Pe.style.background = a.bg, Pe.style.color = a.text, Pe.textContent = `\u25A6 Plano ${t.toUpperCase()}`, Pe.style.display = "block";
    } else Pe.style.display = "none";
  }, Ne = (t, o, s, n) => {
    let a;
    s === "xy" ? a = [new S(o[0] - n, o[1] - n, o[2]), new S(o[0] + n, o[1] - n, o[2]), new S(o[0] + n, o[1] + n, o[2]), new S(o[0] - n, o[1] + n, o[2]), new S(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new S(o[0] - n, o[1], o[2] - n), new S(o[0] + n, o[1], o[2] - n), new S(o[0] + n, o[1], o[2] + n), new S(o[0] - n, o[1], o[2] + n), new S(o[0] - n, o[1], o[2] - n)] : a = [new S(o[0], o[1] - n, o[2] - n), new S(o[0], o[1] + n, o[2] - n), new S(o[0], o[1] + n, o[2] + n), new S(o[0], o[1] - n, o[2] + n), new S(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(a);
  };
  let Je = null;
  window.__hekatanAxisLock = () => Je;
  let kt = null, qe = null;
  const Ce = document.createElement("div");
  Ce.id = "hk-axis-lock-badge", Ce.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ce);
  const Ve = () => {
    if (!Je) {
      Ce.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = t[Je], Ce.style.border = `1.5px solid ${t[Je]}`, Ce.textContent = `\u{1F512} LOCK ${Je.toUpperCase()}`, Ce.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== I) return;
    const s = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && we.length >= 3) {
      const a = pn();
      pe(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") Je = Je === s ? null : s, Ve(), t.preventDefault();
    else if (t.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Jo(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Yn(), pe(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (st.visible = false), pe(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
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
  const Ge = new S(), Fe = new S(), ct = new S(), ut = (t) => {
    if (!Je) return null;
    const o = t[0], s = t[1], n = t[2];
    return Je === "x" ? (Ge.set(o - 1e4, s, n), Fe.set(o + 1e4, s, n)) : Je === "y" ? (Ge.set(o, s - 1e4, n), Fe.set(o, s + 1e4, n)) : (Ge.set(o, s, n - 1e4), Fe.set(o, s, n + 1e4)), _.ray.distanceSqToSegment(Ge, Fe, null, ct), ct;
  };
  window.__hekatanProjectOnAxis = ut;
  const dt = new Ft(new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new ht({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  dt.renderOrder = 998, dt.frustumCulled = false, dt.visible = false, r.add(dt);
  let Be = -1, We = -1, wt = -1;
  const Ae = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ae;
  const Mt = new Ft(new ze().setFromPoints([new S(), new S()]), new ht({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Mt.renderOrder = 997, Mt.frustumCulled = false, Mt.visible = false, r.add(Mt);
  const _t = new lt(new xn(0.02, 12, 12), new ft({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  _t.renderOrder = 998, _t.visible = false, r.add(_t);
  const Dt = (t) => {
    const o = d();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(t);
    return Math.max(0.05, s / 10);
  }, Et = () => {
    _t.visible && _t.scale.setScalar(Dt(_t.position));
  }, $t = new it();
  $t.frustumCulled = false, r.add($t);
  const nn = 2282478;
  let Ut = null;
  const gn = (t, o, s, n) => {
    if (!e.points) return -1;
    const a = e.points.rawVal;
    let i = -1, c = n;
    for (let h = 0; h < a.length; h++) {
      const w = a[h];
      if (!w) continue;
      const x = Math.hypot(t - w[0], o - w[1], s - w[2]);
      x < c && (c = x, i = h);
    }
    return i;
  }, Vt = () => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    for (; $t.children.length; ) {
      const c = $t.children.pop();
      (_b = (_a2 = c.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = c.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e = e.points) == null ? void 0 : _e.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const c of Ae) {
      const [h, ...w] = c.split(":");
      if (h === "pt") {
        const x = t[+w[0]];
        if (!x) continue;
        const M = new lt(new xn(0.025, 12, 12), new ft({ color: nn, transparent: true, opacity: 0.9, depthTest: false }));
        M.position.set(x[0], x[1], x[2]), M.renderOrder = 999, M.__isSelectionPt = true, $t.add(M);
      } else if (h === "seg") {
        const x = o[+w[0]], M = t[x == null ? void 0 : x[+w[1]]], k = t[x == null ? void 0 : x[+w[1] + 1]];
        if (!M || !k) continue;
        const p = new ze().setFromPoints([new S(M[0], M[1], M[2]), new S(k[0], k[1], k[2])]), R = new Ft(p, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        R.renderOrder = 999, $t.add(R);
      } else if (h === "poly") {
        const M = o[+w[0]].map((R) => {
          const te = t[R];
          return te ? new S(te[0], te[1], te[2]) : null;
        }).filter(Boolean);
        if (M.length < 2) continue;
        const k = new ze().setFromPoints(M), p = new Ft(k, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        p.renderOrder = 999, $t.add(p);
      } else if (h === "aux") {
        const x = n[+w[0]];
        if (!x || x.length !== 6) continue;
        const M = new ze().setFromPoints([new S(x[0], x[1], x[2]), new S(x[3], x[4], x[5])]), k = new Ft(M, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        k.renderOrder = 999, $t.add(k);
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
  window.__hekatanRefreshSelection = Vt, window.__hekatanClearSelection = () => {
    Ae.clear(), Vt();
  };
  const on = (t, o, s, n, a, i, c, h, w) => {
    const x = c - n, M = h - a, k = w - i, p = x * x + M * M + k * k;
    if (p < 1e-12) return Math.hypot(t - n, o - a, s - i);
    let R = ((t - n) * x + (o - a) * M + (s - i) * k) / p;
    R = Math.max(0, Math.min(1, R));
    const te = n + R * x, H = a + R * M, Z = i + R * k;
    return Math.hypot(t - te, o - H, s - Z);
  }, vn = (t, o, s, n) => {
    if (!e.polylines) return null;
    const a = e.polylines.rawVal, i = e.points.rawVal;
    let c = -1, h = -1, w = n;
    for (let x = 0; x < a.length; x++) {
      const M = a[x];
      for (let k = 0; k < M.length - 1; k++) {
        const p = i[M[k]], R = i[M[k + 1]];
        if (!p || !R) continue;
        const te = on(t, o, s, p[0], p[1], p[2], R[0], R[1], R[2]);
        te < w && (w = te, c = x, h = k);
      }
    }
    return c >= 0 ? { polyIdx: c, segIdx: h, dist: w } : null;
  }, Ln = (t, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let c = -1, h = n;
    for (let w = 0; w < i.length; w++) {
      const x = i[w];
      if (!x || x.length !== 6) continue;
      const M = on(t, o, s, x[0], x[1], x[2], x[3], x[4], x[5]);
      M < h && (h = M, c = w);
    }
    return c;
  }, so = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      dt.visible = false;
      return;
    }
    dt.geometry.setFromPoints([new S(n[0], n[1], n[2]), new S(n[3], n[4], n[5])]), dt.visible = true;
  }, ao = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!s || s.length < 2) {
      dt.visible = false;
      return;
    }
    const a = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (a || o < 0 || o >= s.length - 1) for (const c of s) {
      const h = n[c];
      h && i.push(new S(h[0], h[1], h[2]));
    }
    else {
      const c = n[s[o]], h = n[s[o + 1]];
      c && i.push(new S(c[0], c[1], c[2])), h && i.push(new S(h[0], h[1], h[2]));
    }
    dt.geometry.setFromPoints(i), dt.visible = true;
  }, sn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const s = o.filter((w, x) => x !== t), n = /* @__PURE__ */ new Set();
    for (const w of s) for (const x of w) n.add(x);
    const a = e.points.rawVal, i = /* @__PURE__ */ new Map(), c = [];
    for (let w = 0; w < a.length; w++) n.has(w) && (i.set(w, c.length), c.push(a[w]));
    const h = s.map((w) => w.map((x) => i.get(x)).filter((x) => x !== void 0));
    e.points.val = c, e.polylines.val = h, e.areas && (e.areas.val = e.areas.rawVal.filter((w) => w !== t).map((w) => w > t ? w - 1 : w)), dt.visible = false, Be = -1, We = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, In = (t, o) => {
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
    const c = [...s.slice(0, t), ...i, ...s.slice(t + 1)], h = /* @__PURE__ */ new Set();
    for (const p of c) for (const R of p) h.add(R);
    const w = e.points.rawVal, x = /* @__PURE__ */ new Map(), M = [];
    for (let p = 0; p < w.length; p++) h.has(p) && (x.set(p, M.length), M.push(w[p]));
    const k = c.map((p) => p.map((R) => x.get(R)).filter((R) => R !== void 0));
    if (e.points.val = M, e.polylines.val = k, e.areas) {
      const p = i.length - 1;
      e.areas.val = e.areas.rawVal.map((R) => R > t ? R + p : R);
    }
    dt.visible = false, Be = -1, We = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  L.geometry.setAttribute("position", new Ct(e.points.rawVal.flat(), 3)), L.geometry.computeBoundingSphere(), L.frustumCulled = false, ae.frustumCulled = false, r.add(ae), K.position.set(0, 0, 0), K.rotateX(Math.PI / 2), K.geometry.rotateX(Math.PI / 2), K.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, s) => {
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
  let Rn = [], Dn = "";
  const bn = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], s = `${t.length}|${o.length}|${o.reduce((a, i) => a + i.length, 0)}`;
    if (s === Dn) return Rn;
    Dn = s;
    const n = [];
    for (const a of o) {
      const i = a.length;
      if (i < 6 || a[0] !== a[i - 1]) continue;
      const c = a.slice(0, i - 1).map((M) => t[M]).filter(Boolean);
      if (c.length < 5) continue;
      const h = [0, 1, 2].map((M) => c.reduce((k, p) => k + p[M], 0) / c.length), w = c.map((M) => Math.hypot(M[0] - h[0], M[1] - h[1], M[2] - h[2])), x = w.reduce((M, k) => M + k, 0) / w.length;
      x < 1e-9 || w.some((M) => Math.abs(M - x) > 5e-3 * x) || n.push({ c: h, r: x });
    }
    return Rn = n;
  };
  window.__hekatanCentrosDeducidos = bn, window.__hekatanDrawCircle = (t, o, s, n, a = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const c = Math.max(4, Math.round(a)), h = e.points.rawVal.length, w = [];
    for (let x = 0; x < c; x++) {
      const M = 2 * Math.PI * x / c, k = n * Math.cos(M), p = n * Math.sin(M);
      let R;
      i === "xy" ? R = [t + k, o + p, s] : i === "xz" ? R = [t + k, o, s + p] : R = [t, o + k, s + p], w.push(R);
    }
    if (e.points.val = [...e.points.rawVal, ...w], an.push({ c: [t, o, s], r: n }), e.polylines) {
      const x = [...w.map((k, p) => h + p), h], M = e.polylines.rawVal;
      ((_a2 = M[M.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...M, x, []] : e.polylines.val = [...M.slice(0, -1), x, []];
    }
  }, window.__hekatanDrawArc = (t, o, s, n = window.__hekatanArcSegs ?? 12) => {
    const a = Math.max(4, Math.round(n)), i = new S(...t), c = new S(...o), h = new S(...s), w = new S().subVectors(c, i), x = new S().subVectors(h, i), M = new S().crossVectors(w, x).normalize(), k = new S().addVectors(i, c).multiplyScalar(0.5), p = new S().addVectors(c, h).multiplyScalar(0.5), R = new S().crossVectors(w, M).normalize(), te = new S().crossVectors(new S().subVectors(h, c), M).normalize(), H = new S().subVectors(p, k), Z = R.x * te.y - R.y * te.x;
    let b;
    if (Math.abs(Z) > 1e-9) {
      const ve = (H.x * te.y - H.y * te.x) / Z;
      b = new S().addVectors(k, R.clone().multiplyScalar(ve));
    } else b = k.clone();
    const A = i.distanceTo(b), $ = new S().subVectors(i, b), U = new S().subVectors(h, b), J = Math.acos(Math.max(-1, Math.min(1, $.dot(U) / (A * A)))), q = e.points.rawVal.length, O = [], ge = M.clone();
    for (let ve = 0; ve <= a; ve++) {
      const Se = ve / a, je = J * Se, Ie = new Hn().setFromAxisAngle(ge, je), ot = $.clone().applyQuaternion(Ie).add(b);
      O.push([ot.x, ot.y, ot.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...O], an.push({ c: [b.x, b.y, b.z], r: A }), e.polylines) {
      const ve = O.map((je, Ie) => q + Ie), Se = e.polylines.rawVal;
      e.polylines.val = [...Se.slice(0, -1), ve, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, s = 1, n = 6, a = 6) => {
    const i = Math.min(t[0], o[0]), c = Math.max(t[0], o[0]), h = Math.min(t[1], o[1]), w = Math.max(t[1], o[1]), x = (t[2] + o[2]) / 2, M = c - i, k = w - h, p = Math.min(s, M / 2 - 0.01, k / 2 - 0.01);
    if (p <= 0) return;
    const R = e.points.rawVal.length, te = [], H = [], Z = (b, A) => {
      te.push([b, A, x]), H.push(R + te.length - 1);
    };
    for (let b = 0; b <= a; b++) Z(i + p + (M - 2 * p) * b / a, h);
    for (let b = 1; b <= n; b++) {
      const A = -Math.PI / 2 + Math.PI / 2 * b / n;
      Z(c - p + p * Math.cos(A), h + p + p * Math.sin(A));
    }
    for (let b = 1; b <= a; b++) Z(c, h + p + (k - 2 * p) * b / a);
    for (let b = 1; b <= n; b++) {
      const A = 0 + Math.PI / 2 * b / n;
      Z(c - p + p * Math.cos(A), w - p + p * Math.sin(A));
    }
    for (let b = 1; b <= a; b++) Z(c - p - (M - 2 * p) * b / a, w);
    for (let b = 1; b <= n; b++) {
      const A = Math.PI / 2 + Math.PI / 2 * b / n;
      Z(i + p + p * Math.cos(A), w - p + p * Math.sin(A));
    }
    for (let b = 1; b <= a; b++) Z(i, w - p - (k - 2 * p) * b / a);
    for (let b = 1; b <= n; b++) {
      const A = Math.PI + Math.PI / 2 * b / n;
      Z(i + p + p * Math.cos(A), h + p + p * Math.sin(A));
    }
    if (H.push(R), e.points.val = [...e.points.rawVal, ...te], e.polylines) {
      const b = e.polylines.rawVal;
      e.polylines.val = [...b.slice(0, -1), H, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], c = o[0], h = o[1], w = o[2];
    let x;
    if (Math.abs(i - w) < 1e-6 ? x = [[n, a, i], [c, a, i], [c, h, i], [n, h, i]] : Math.abs(a - h) < 1e-6 ? x = [[n, a, i], [c, a, i], [c, a, w], [n, a, w]] : x = [[n, a, i], [n, h, i], [n, h, w], [n, a, w]], e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const M = [s, s + 1, s + 2, s + 3, s], k = e.polylines.rawVal;
      e.polylines.val = [...k.slice(0, -1), M, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], c = o[0], h = o[1], w = o[2];
    let x;
    if (T && e.gridTarget) {
      const M = e.gridTarget.rawVal, k = new An(...M.rotation), p = new S(1, 0, 0).applyEuler(k), R = new S(0, 1, 0).applyEuler(k), te = new S(...M.position), H = new S(n, a, i), Z = new S(c, h, w), b = H.clone().sub(te).dot(p), A = H.clone().sub(te).dot(R), $ = Z.clone().sub(te).dot(p), U = Z.clone().sub(te).dot(R), J = (q, O) => te.clone().addScaledVector(p, q).addScaledVector(R, O).toArray();
      x = [J(b, A), J($, A), J($, U), J(b, U)];
    } else Math.abs(i - w) < 1e-6 ? x = [[n, a, i], [c, a, i], [c, h, i], [n, h, i]] : Math.abs(a - h) < 1e-6 ? x = [[n, a, i], [c, a, i], [c, a, w], [n, a, w]] : x = [[n, a, i], [n, h, i], [n, h, w], [n, a, w]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const M = e.polylines.rawVal, k = M.length - 1, p = [s, s + 1, s + 2, s + 3, s];
      e.polylines.val = [...M.slice(0, -1), p, []], e.areas && (e.areas.val = [...e.areas.rawVal, k]);
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
    for (let _e = 0; _e < s; _e++) {
      const Re = t[_e], et = t[(_e + 1) % s];
      n += (Re[1] - et[1]) * (Re[2] + et[2]), a += (Re[2] - et[2]) * (Re[0] + et[0]), i += (Re[0] - et[0]) * (Re[1] + et[1]);
    }
    const c = Math.hypot(n, a, i) || 1;
    n /= c, a /= c, i /= c;
    let h = t[1][0] - t[0][0], w = t[1][1] - t[0][1], x = t[1][2] - t[0][2];
    const M = Math.hypot(h, w, x) || 1;
    h /= M, w /= M, x /= M;
    let k = a * x - i * w, p = i * h - n * x, R = n * w - a * h;
    const te = Math.hypot(k, p, R) || 1;
    k /= te, p /= te, R /= te;
    const H = t[0], Z = (_e) => [(_e[0] - H[0]) * h + (_e[1] - H[1]) * w + (_e[2] - H[2]) * x, (_e[0] - H[0]) * k + (_e[1] - H[1]) * p + (_e[2] - H[2]) * R], b = (_e, Re) => [H[0] + _e * h + Re * k, H[1] + _e * w + Re * p, H[2] + _e * x + Re * R], A = t.map(Z);
    let $ = 1 / 0, U = -1 / 0, J = 1 / 0, q = -1 / 0;
    for (const [_e, Re] of A) _e < $ && ($ = _e), _e > U && (U = _e), Re < J && (J = Re), Re > q && (q = Re);
    const O = U - $, ge = q - J;
    if (O < 1e-6 || ge < 1e-6) return 0;
    let ve = o && o > 0 ? o : 0.5;
    for (; O / ve * (ge / ve) > 2500; ) ve *= 2;
    ve = Math.min(ve, Math.min(O, ge));
    const Se = (_e, Re) => {
      let et = false;
      for (let It = 0, Nt = A.length - 1; It < A.length; Nt = It++) {
        const [Rt, Qt] = A[It], [bo, qn] = A[Nt];
        Qt > Re != qn > Re && _e < (bo - Rt) * (Re - Qt) / (qn - Qt) + Rt && (et = !et);
      }
      return et;
    }, je = Math.max(1, Math.round(O / ve)), Ie = Math.max(1, Math.round(ge / ve)), ot = O / je, tt = ge / Ie, at = /* @__PURE__ */ new Map(), Qe = [], $e = e.points.rawVal.length, nt = (_e, Re) => {
      const et = _e + "," + Re, It = at.get(et);
      if (It !== void 0) return It;
      const Nt = $e + Qe.length;
      return Qe.push(b($ + _e * ot, J + Re * tt)), at.set(et, Nt), Nt;
    }, Ye = [];
    for (let _e = 0; _e < je; _e++) for (let Re = 0; Re < Ie; Re++) {
      if (!Se($ + (_e + 0.5) * ot, J + (Re + 0.5) * tt)) continue;
      const et = nt(_e, Re), It = nt(_e + 1, Re), Nt = nt(_e + 1, Re + 1), Rt = nt(_e, Re + 1);
      Ye.push([et, It, Nt, Rt]);
    }
    if (!Ye.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...Qe], e.polylines && e.areas) {
      let _e = e.polylines.rawVal.slice();
      _e.length && _e[_e.length - 1].length === 0 && (_e = _e.slice(0, -1));
      const Re = [];
      for (const et of Ye) Re.push(_e.length), _e.push([et[0], et[1], et[2], et[3], et[0]]);
      _e.push([]), e.polylines.val = _e, e.areas.val = [...e.areas.rawVal, ...Re];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), Ye.length;
  };
  const pn = () => {
    if (we.length < 3) return we = [], W.visible = false, y(), 0;
    const t = window.__hekatanMeshPolyArea(we.slice());
    return we = [], W.visible = false, y(), t;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, s) => {
    var _a2;
    const n = new S(t[0], t[1], t[2]), a = new S(o[0], o[1], o[2]), i = new S(s[0], s[1], s[2]), c = new S().subVectors(a, n).cross(new S().subVectors(i, n));
    if (c.lengthSq() < 1e-9) return false;
    c.normalize();
    const h = new Hn().setFromUnitVectors(new S(0, 0, 1), c), w = new An().setFromQuaternion(h);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [w.x, w.y, w.z] }), T = true;
    const x = new S().addVectors(n, a).add(i).multiplyScalar(1 / 3), M = Math.max(n.distanceTo(a), n.distanceTo(i), a.distanceTo(i)) * 2.2 + 4, k = M / 2;
    Ee.geometry.dispose(), Ee.geometry = new en(M, M), Me.geometry.dispose(), Me.geometry = new ls(new en(M, M)), Ke(k, 1), ye.position.copy(x), ye.quaternion.copy(h), ye.scale.set(1, 1, 1), ye.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), T = false, ye.visible = false, y();
  };
  const Kt = new it();
  Kt.visible = false, r.add(Kt), window.__hekatanShowAxes = (t, o, s = 12, n = 2) => {
    var _a2, _b;
    for (; Kt.children.length; ) {
      const M = Kt.children.pop();
      (_a2 = M.geometry) == null ? void 0 : _a2.dispose(), (_b = M.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const a = Math.min(...o) - n, i = Math.max(...o) + n, c = Math.min(...t) - n, h = Math.max(...t) + n, w = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", x = (M, k, p, R, te) => {
      const H = document.createElement("canvas");
      H.width = 64, H.height = 32;
      const Z = H.getContext("2d");
      Z.fillStyle = te, Z.font = "bold 22px sans-serif", Z.textAlign = "center", Z.fillText(M, 32, 26);
      const b = new rs(H), A = new cs({ map: b, transparent: true }), $ = new ds(A);
      return $.position.set(k, p, R), $.scale.set(1.2, 0.6, 1), $;
    };
    t.forEach((M, k) => {
      const p = k < w.length ? w[k] : `X${k}`, R = new ze().setFromPoints([new S(M, a, 0), new S(M, i, 0), new S(M, a, 0), new S(M, a, s)]), te = new Fn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), H = new Wt(R, te);
      H.computeLineDistances(), Kt.add(H), Kt.add(x(p, M, a - 0.5, 0, "#60a5fa")), Kt.add(x(p, M, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((M, k) => {
      const p = `${k + 1}`, R = new ze().setFromPoints([new S(c, M, 0), new S(h, M, 0), new S(c, M, 0), new S(c, M, s)]), te = new Fn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), H = new Wt(R, te);
      H.computeLineDistances(), Kt.add(H), Kt.add(x(p, c - 0.5, M, 0, "#fb7185")), Kt.add(x(p, h + 0.5, M, 0, "#fb7185"));
    }), Kt.visible = true, y();
  }, window.__hekatanHideAxes = () => {
    Kt.visible = false, y();
  };
  const Ot = new it();
  Ot.visible = false, r.add(Ot);
  let un = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, s = 0, n = 0) => {
    var _a2, _b;
    for (; Ot.children.length; ) {
      const i = Ot.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    un.forEach((i) => {
      r.remove(i), i.geometry.dispose(), i.material.dispose();
    }), un = [];
    const a = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, c) => {
      const h = a[c % a.length], w = o / 2, x = [new S(s - w, n - w, i), new S(s + w, n - w, i), new S(s + w, n + w, i), new S(s - w, n + w, i), new S(s - w, n - w, i)], M = new ze().setFromPoints(x), k = new ht({ color: h, transparent: true, opacity: 0.55 });
      Ot.add(new Ft(M, k));
      const p = document.createElement("canvas");
      p.width = 128, p.height = 32;
      const R = p.getContext("2d");
      R.fillStyle = `#${h.toString(16).padStart(6, "0")}`, R.font = "bold 18px sans-serif", R.fillText(`Z = ${i} m`, 4, 22);
      const te = new rs(p), H = new cs({ map: te, transparent: true }), Z = new ds(H);
      Z.position.set(s - w - 1.5, n - w - 1.5, i), Z.scale.set(2.5, 0.6, 1), Ot.add(Z);
      const b = new en(1e4, 1e4), A = new ft({ visible: false, side: At }), $ = new lt(b, A);
      $.position.set(0, 0, i), $.frustumCulled = false, $.userData = { refPlaneZ: i }, r.add($), un.push($);
    }), Ot.visible = true, y();
  }, window.__hekatanHideRefPlanes = () => {
    Ot.visible = false, un.forEach((t) => {
      t.visible = false;
    }), y();
  };
  const Mn = new it();
  Mn.frustumCulled = false, r.add(Mn);
  const As = () => {
    var _a2, _b, _c, _d;
    for (; Mn.children.length; ) {
      const s = Mn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new ze().setFromPoints([new S(s[0], s[1], s[2]), new S(s[3], s[4], s[5])]), a = new Fn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new Ft(n, a);
      i.computeLineDistances(), Mn.add(i);
    }
  };
  j.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, As(), y());
  });
  const fn = new it();
  fn.frustumCulled = false, r.add(fn);
  const Ro = () => {
    var _a2, _b, _c, _d;
    for (; fn.children.length; ) {
      const s = fn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new lt(new xn(0.025, 12, 12), new ft({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(Dt(n.position)), fn.add(n);
    }
  };
  j.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Ro(), y());
  }), u.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(Dt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Ro;
  const gt = new it(), Es = new lt(new xn(0.01, 12, 12), new ft({ color: 16724804, transparent: true, opacity: 0.95 })), Vs = new lt(new xn(0.015, 12, 12), new ft({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  gt.add(Es, Vs);
  const hn = 0.08, io = (t, o, s) => {
    const n = new ze().setFromPoints([new S(...t), new S(...o)]);
    return new Ft(n, new ht({ color: s, transparent: true, opacity: 0.7 }));
  };
  gt.add(io([-hn, 0, 0], [hn, 0, 0], 16711680)), gt.add(io([0, -hn, 0], [0, hn, 0], 65280)), gt.add(io([0, 0, -hn], [0, 0, hn], 35071)), gt.visible = false, gt.frustumCulled = false, r.add(gt);
  let lo = 2;
  const Bn = (t) => {
    const o = d(), s = (g == null ? void 0 : g.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / s : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / s;
  }, _n = () => {
    if (!gt.visible) return;
    const t = lo * Bn(gt.position) / 0.015;
    gt.scale.setScalar(Math.max(1e-4, Math.min(1e5, t)));
  };
  let kn = 10;
  const ro = (t) => Math.max(1e-4, kn * Bn(t));
  window.__hekatanAperturaPx = (t) => (typeof t == "number" && t > 0 && (kn = t), kn), window.__hekatanUpdateSnapScale = _n, window.__hekatanSnapMarker = gt, window.__hekatanMetrosPorPixel = Bn, window.__hekatanSnapPx = (t) => (typeof t == "number" && t > 0 && (lo = t, _n(), y()), lo);
  const Do = () => {
    $t.children.length !== 0 && $t.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(Dt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Do, u.addEventListener("change", () => {
    var _a2;
    _n(), _t.visible && Et(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Do();
  }), window.__hekatanShowSnap = (t, o, s) => {
    gt.position.set(t, o, s), gt.visible = true, _n(), y();
  }, window.__hekatanHideSnap = () => {
    gt.visible = false, y();
  }, g.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r;
    window.__hekatanCursorPx = { x: t.clientX, y: t.clientY };
    const o = v(t);
    if (!o) return;
    _.setFromCamera(C, o);
    const s = ne();
    if (s.length) {
      const n = s[0].point, a = t.altKey, i = ro(n), c = a ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i, { x: t.clientX, y: t.clientY });
      if (c) Zo(c.type, c.x, c.y, c.z), gt.position.set(c.x, c.y, c.z), gt.visible = true, n.set(c.x, c.y, c.z), Uo(c.type, t.clientX, t.clientY);
      else {
        Is(), Yn();
        const k = !a && window.__hekatanSnapEnabled !== false, p = window.__hekatanSnap2D ?? 0.5;
        k && p > 0 && (n.x = Math.round(n.x / p) * p, n.y = Math.round(n.y / p) * p, n.z = Math.round(n.z / p) * p), gt.position.copy(n), gt.visible = true;
      }
      _n();
      const h = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (h === "select" || !h) {
        const k = (window.__hekatanSnap2D ?? 0.5) * 1.5, p = gn(n.x, n.y, n.z, k), R = vn(n.x, n.y, n.z, k), te = Ln(n.x, n.y, n.z, k);
        if (p >= 0) {
          const A = e.points.rawVal[p];
          _t.position.set(A[0], A[1], A[2]), _t.visible = true, Et(), Mt.visible = false, Ut = { kind: "pt", a: p };
        } else if (R) {
          const A = e.points.rawVal, $ = e.polylines.rawVal[R.polyIdx], U = A[$[R.segIdx]], J = A[$[R.segIdx + 1]];
          Mt.geometry.setFromPoints([new S(U[0], U[1], U[2]), new S(J[0], J[1], J[2])]), Mt.visible = true, _t.visible = false, Ut = ((_f = (_e = e.areas) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.includes(R.polyIdx)) ?? false ? { kind: "poly", a: R.polyIdx } : { kind: "seg", a: R.polyIdx, b: R.segIdx };
        } else if (te >= 0) {
          const $ = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[te];
          $ && (Mt.geometry.setFromPoints([new S($[0], $[1], $[2]), new S($[3], $[4], $[5])]), Mt.visible = true, _t.visible = false, Ut = { kind: "aux", a: te });
        } else Mt.visible = false, _t.visible = false, Ut = null;
        se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
        let H = n;
        if ((Ut == null ? void 0 : Ut.kind) === "pt") {
          const A = e.points.rawVal[Ut.a];
          A && (H = new S(A[0], A[1], A[2]));
        }
        const Z = `X=${H.x.toFixed(2)} Y=${H.y.toFixed(2)} Z=${H.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [H.x, H.y, H.z], Ut) {
          const A = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          se.textContent = `${Z}  \xB7  \u{1F5B1} Click \u2192 ${A[Ut.kind]}`;
        } else se.textContent = Z;
        const b = document.getElementById("hk-coord-fixed");
        b && (b.textContent = Z), qe = { p: H.clone(), x: t.clientX, y: t.clientY }, ce.visible = false, st.visible = false, de.visible = false, y();
        return;
      }
      if (h === "delete" || h === "trim" || h === "extend" || h === "offset") {
        const k = (window.__hekatanSnap2D ?? 0.5) * 1.5, p = vn(n.x, n.y, n.z, k), R = Ln(n.x, n.y, n.z, k);
        let te = false;
        if (R >= 0) if (!p) te = true;
        else {
          const A = window.__hekatanDrawingAuxLines, U = ((A == null ? void 0 : A.rawVal) ?? (A == null ? void 0 : A.val) ?? A ?? [])[R];
          on(n.x, n.y, n.z, U[0], U[1], U[2], U[3], U[4], U[5]) < p.dist && (te = true);
        }
        te ? (wt = R, Be = -1, We = -1, so(R)) : p ? (Be = p.polyIdx, We = p.segIdx, wt = -1, ao(p.polyIdx, p.segIdx)) : (Be = -1, We = -1, wt = -1, dt.visible = false), ce.visible = false, st.visible = false, de.visible = false, V(), se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
        const H = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let Z = "";
        te ? Z = `\u{1F5D1} l\xEDnea aux #${wt + 1}` : p ? Z = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(p.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${p.polyIdx + 1}` : `\u{1F5D1} seg ${p.segIdx + 1} / poly #${p.polyIdx + 1}` : Z = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", se.textContent = `${H}  \xB7  ${Z}`;
        const b = document.getElementById("hk-coord-fixed");
        b && (b.textContent = H), y();
        return;
      } else dt.visible = false, Be = -1, wt = -1;
      se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
      const w = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], x = w[w.length - 1] ?? [], M = e.points.rawVal ?? [];
      if (x.length > 0 && M[x[x.length - 1]]) {
        const k = x[x.length - 1], p = M[k];
        let R = Je;
        if (kt = null, !R && window.__hekatanAxisSnap !== false) {
          const Ie = g.getBoundingClientRect(), ot = t.clientX, tt = t.clientY, at = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, Qe = new S(p[0], p[1], p[2]), $e = [["x", new S(1, 0, 0)], ["y", new S(0, 1, 0)], ["z", new S(0, 0, 1)]], nt = (_e2) => {
            const Re = _e2.clone().project(o);
            return { x: (Re.x * 0.5 + 0.5) * Ie.width + Ie.left, y: (-Re.y * 0.5 + 0.5) * Ie.height + Ie.top };
          };
          let Ye = null;
          for (const [_e2, Re] of $e) {
            const et = nt(Qe.clone().addScaledVector(Re, -at)), It = nt(Qe.clone().addScaledVector(Re, at)), Nt = It.x - et.x, Rt = It.y - et.y, Qt = ot - et.x, bo = tt - et.y, qn = Nt * Nt + Rt * Rt || 1;
            let Kn = (Qt * Nt + bo * Rt) / qn;
            Kn = Math.max(0, Math.min(1, Kn));
            const ts = Math.hypot(ot - (et.x + Kn * Nt), tt - (et.y + Kn * Rt));
            if (Ye === null || ts < Ye.dpx) {
              const Mo = _.ray, ns = Qe.clone().sub(Mo.origin), _o2 = Re.dot(Mo.direction), os = Re.dot(ns), qs = Mo.direction.dot(ns), ss = 1 - _o2 * _o2, Ks = Math.abs(ss) < 1e-6 ? -os : (_o2 * qs - os) / ss;
              Ye = { axis: _e2, dpx: ts, pt: Qe.clone().addScaledVector(Re, Ks) };
            }
          }
          Ye && Ye.dpx <= 12 && (n.copy(Ye.pt), R = Ye.axis, kt = Ye.pt.clone());
        }
        const te = !!window.__hekatanOrthoMode;
        if (!R && te) {
          const Ie = Math.abs(n.x - p[0]), ot = Math.abs(n.y - p[1]), tt = Math.abs(n.z - p[2]), at = (_l = s[0]) == null ? void 0 : _l.object;
          let Qe = null;
          at === Ze ? Qe = "xy" : at === rt ? Qe = "xz" : at === Xe && (Qe = "yz"), Qe === "xy" ? R = Ie >= ot ? "x" : "y" : Qe === "xz" ? R = Ie >= tt ? "x" : "z" : Qe === "yz" ? R = ot >= tt ? "y" : "z" : R = Ie >= ot && Ie >= tt ? "x" : ot >= tt ? "y" : "z";
        }
        const H = window.__hekatanPolarTrack !== false;
        if (!R && H) {
          const Ie = n.x - p[0], ot = n.y - p[1], tt = n.z - p[2], at = Math.hypot(Ie, ot, tt);
          if (at > 1e-3) {
            const $e = Math.tan(6 * Math.PI / 180) * at, nt = Math.hypot(ot, tt), Ye = Math.hypot(Ie, tt), _e2 = Math.hypot(Ie, ot), Re = [["x", nt], ["y", Ye], ["z", _e2]];
            Re.sort((et, It) => et[1] - It[1]), Re[0][1] <= $e && (R = Re[0][0]);
          }
        }
        if (R) {
          const Ie = p[0], ot = p[1], tt = p[2];
          R === "x" ? n.set(n.x, ot, tt) : R === "y" ? n.set(Ie, n.y, tt) : n.set(Ie, ot, n.z);
          const at = !!Je, $e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[R];
          Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = $e, Ce.style.border = `1.5px solid ${$e}`;
          const nt = (_m = s[0]) == null ? void 0 : _m.object;
          let Ye = null;
          nt === Ze ? Ye = "xy" : nt === rt ? Ye = "xz" : nt === Xe && (Ye = "yz");
          const _e2 = Ye ? ` (plano ${Ye.toUpperCase()})` : "";
          Ce.textContent = at ? `\u{1F512} LOCK ${R.toUpperCase()}${_e2}` : `\u22A5 ORTO ${R.toUpperCase()}${_e2}`, Ce.style.left = t.clientX + 20 + "px", Ce.style.top = t.clientY + 18 + "px", Ce.style.transform = "none", Ce.style.display = "block";
        } else Je || (Ce.style.display = "none");
        let Z = null;
        if (!a && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ie = e.points.rawVal, ot = R ? [R] : ["z", "x", "y"], tt = { x: t.clientX, y: t.clientY };
          let at = 1 / 0;
          for (const Qe of Ie) if (!(Math.abs(Qe[0] - p[0]) < 1e-9 && Math.abs(Qe[1] - p[1]) < 1e-9 && Math.abs(Qe[2] - p[2]) < 1e-9)) for (const $e of ot) {
            const nt = new S($e === "x" ? Qe[0] : n.x, $e === "y" ? Qe[1] : n.y, $e === "z" ? Qe[2] : n.z), Ye = ho(nt.x, nt.y, nt.z);
            if (!Ye) continue;
            const _e2 = Math.hypot(Ye.x - tt.x, Ye.y - tt.y);
            _e2 < kn && _e2 < at && (at = _e2, Z = { q: Qe, eje: $e });
          }
        }
        Z ? (Z.eje === "x" ? n.x = Z.q[0] : Z.eje === "y" ? n.y = Z.q[1] : n.z = Z.q[2], de.geometry.setFromPoints([new S(Z.q[0], Z.q[1], Z.q[2]), new S(n.x, n.y, n.z)]), (_n2 = de.computeLineDistances) == null ? void 0 : _n2.call(de), de.visible = true, gt.position.set(n.x, n.y, n.z), gt.visible = true, Uo("track", t.clientX, t.clientY)) : de.visible = false, qe = { p: n.clone(), x: t.clientX, y: t.clientY };
        const b = Math.hypot(n.x - p[0], n.y - p[1], n.z - p[2]), A = Math.atan2(n.y - p[1], n.x - p[0]) * 180 / Math.PI, $ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = `${$} | \u0394L=${b.toFixed(2)}m ${A.toFixed(0)}\xB0`;
        const U = document.getElementById("hk-coord-fixed");
        U && (U.textContent = $), ce.geometry.setFromPoints([new S(p[0], p[1], p[2]), new S(n.x, n.y, n.z)]), (_o = ce.computeLineDistances) == null ? void 0 : _o.call(ce), ce.visible = true, X(p[0], p[1], p[2], n.x, n.y, n.z);
        const J = window.__hekatanOrthoExt ?? 8, q = window.__hekatanShowOrthoPlanes !== false;
        He.visible = q, q || xt(null), q && (Ne(fe, p, "xy", J), Ne(De, p, "xz", J), Ne(Te, p, "yz", J), he(Ze, p, "xy", J), he(rt, p, "xz", J), he(Xe, p, "yz", J));
        const O = q ? _.intersectObjects([Ze, rt, Xe], false) : [];
        let ge = null;
        if (O.length > 0) {
          const Ie = O[0].object;
          Ie === Ze ? ge = "xy" : Ie === rt ? ge = "xz" : Ie === Xe && (ge = "yz");
        }
        xt(ge), ge && (Pe.style.left = t.clientX + "px", Pe.style.top = t.clientY + "px"), P.geometry.setFromPoints([new S(p[0] - J, p[1], p[2]), new S(p[0] + J, p[1], p[2])]), (_p = P.computeLineDistances) == null ? void 0 : _p.call(P), Y.geometry.setFromPoints([new S(p[0], p[1] - J, p[2]), new S(p[0], p[1] + J, p[2])]), (_q = Y.computeLineDistances) == null ? void 0 : _q.call(Y), Q.geometry.setFromPoints([new S(p[0], p[1], p[2] - J), new S(p[0], p[1], p[2] + J)]), (_r = Q.computeLineDistances) == null ? void 0 : _r.call(Q), st.visible = true;
        const ve = P.material, Se = Y.material, je = Q.material;
        R === "x" ? (ve.opacity = 0.95, Se.opacity = 0.1, je.opacity = 0.1) : R === "y" ? (ve.opacity = 0.1, Se.opacity = 0.95, je.opacity = 0.1) : R === "z" ? (ve.opacity = 0.1, Se.opacity = 0.1, je.opacity = 0.95) : (ve.opacity = 0.5, Se.opacity = 0.5, je.opacity = 0.5);
      } else {
        const k = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = k;
        const p = document.getElementById("hk-coord-fixed");
        if (p && (p.textContent = k), ce.visible = false, st.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(h)) {
          if (E = null, N = null, I.style.left = t.clientX + 20 + "px", I.style.top = t.clientY - 28 + "px", I.style.display = "block", !D) {
            I.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const te = document.activeElement;
            !(te && (te.tagName === "INPUT" || te.tagName === "TEXTAREA") && te !== I) && document.activeElement !== I && I.focus({ preventScroll: true });
            try {
              I.select();
            } catch {
            }
          }
        } else V();
      }
      y();
    } else Yn(), se.style.display = "none", gt.visible = false, ce.visible = false, st.visible = false, V(), y();
  }), j.derive(() => {
    var _a2;
    if (!e.gridTarget) return;
    const t = new Hn().setFromEuler(new An(...e.gridTarget.val.rotation)), o = new Hn().setFromAxisAngle(new S(1, 0, 0), Math.PI / 2);
    $a(l, { position: new S(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, y);
    {
      const n = e.gridTarget.val.position[2], a = Math.abs(t.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of G) r.remove(i), xe(i);
      if (G.length = 0, a) {
        const i = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], c = /* @__PURE__ */ new Set([0]);
        for (const w of i) c.add(+w[2].toFixed(3));
        for (const w of window.__hekatanLevels ?? []) isFinite(w == null ? void 0 : w.z) && c.add(+w.z.toFixed(3));
        const h = [...c].sort((w, x) => w - x).slice(0, 24);
        for (const w of h) {
          if (Math.abs(w - n) < 1e-6) continue;
          const x = l.clone(true);
          x.name = `hekatan-grid-nivel-${w}`, x.traverse((M) => {
            M.material && (M.material = M.material.clone(), M.material.transparent = true, M.material.opacity = (M.material.opacity ?? 1) * (Math.abs(w) < 1e-6 ? 0.5 : 0.22));
          }), x.position.set(0, 0, w), x.quaternion.copy(o), r.add(x), G.push(x);
        }
      }
    }
    K.position.set(...e.gridTarget.val.position), K.quaternion.setFromEuler(new An(...e.gridTarget.val.rotation)), K.updateMatrixWorld();
    const s = new S(0, 0, 1).applyEuler(new An(...e.gridTarget.val.rotation));
    T = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), j.derive(() => {
    L.geometry.setAttribute("position", new Ct(e.points.val.flat(), 3)), L.geometry.computeBoundingSphere();
  }), j.derive(() => {
    const t = 0.05 * f * 0.5 * m.val;
    _.params.Points.threshold = 0.4 * t;
  }), j.derive(() => {
    var _a2;
    const t = e.points.val ?? [], s = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of s) {
      const [c, h, w] = t[i];
      n.push(c, h, w);
    }
    const a = new ze();
    a.setAttribute("position", new Ct(n, 3)), ie.geometry.dispose(), ie.geometry = a;
  });
  let co = false, ln = 0;
  g.addEventListener("pointerdown", () => {
    co = true;
  }), g.addEventListener("pointerup", () => {
    co = false;
  }), g.addEventListener("pointermove", () => {
    co && ln++;
  });
  const Lt = document.createElement("div");
  Lt.id = "hk-window-select", Lt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Lt);
  let Gt = null, Sn = false, Yt = null;
  const po = (t, o, s, n, a) => {
    a ? (Lt.style.borderColor = "#34d399", Lt.style.borderStyle = "dashed", Lt.style.background = "rgba(52, 211, 153, 0.10)") : (Lt.style.borderColor = "#22d3ee", Lt.style.borderStyle = "solid", Lt.style.background = "rgba(34, 211, 238, 0.10)"), Lt.style.left = Math.min(t, s) + "px", Lt.style.top = Math.min(o, n) + "px", Lt.style.width = Math.abs(s - t) + "px", Lt.style.height = Math.abs(n - o) + "px", Lt.style.display = "block";
  }, Bo = (t, o, s, n, a) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, s), c = Math.max(t, s), h = Math.min(o, n), w = Math.max(o, n), x = s < t, M = g.getBoundingClientRect(), k = d();
    k.updateMatrixWorld();
    const p = (q) => {
      const O = new S(q[0], q[1], q[2]);
      return O.project(k), { x: M.left + (O.x * 0.5 + 0.5) * M.width, y: M.top + (-O.y * 0.5 + 0.5) * M.height };
    }, R = (q) => q.x >= i && q.x <= c && q.y >= h && q.y <= w, te = (q, O) => !(q.x < i && O.x < i || q.x > c && O.x > c || q.y < h && O.y < h || q.y > w && O.y > w);
    a || Ae.clear();
    let H = 0;
    const Z = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let q = 0; q < Z.length; q++) {
      const O = Z[q];
      O && R(p(O)) && (Ae.add(`pt:${q}`), H++);
    }
    const b = (q, O) => x ? R(q) || R(O) || te(q, O) : R(q) && R(O), A = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], $ = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let q = 0; q < A.length; q++) {
      const O = A[q];
      if ($.includes(q)) {
        let ve;
        if (!x) ve = O.every((Se) => {
          const je = Z[Se];
          return !!je && R(p(je));
        });
        else {
          ve = false;
          for (let Se = 0; Se < O.length - 1; Se++) {
            const je = Z[O[Se]], Ie = Z[O[Se + 1]];
            if (!(!je || !Ie) && b(p(je), p(Ie))) {
              ve = true;
              break;
            }
          }
        }
        ve && (Ae.add(`poly:${q}`), H++);
      } else for (let ve = 0; ve < O.length - 1; ve++) {
        const Se = Z[O[ve]], je = Z[O[ve + 1]];
        !Se || !je || b(p(Se), p(je)) && (Ae.add(`seg:${q}:${ve}`), H++);
      }
    }
    const J = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let q = 0; q < J.length; q++) {
      const O = J[q];
      if (!O || O.length !== 6) continue;
      const ge = p([O[0], O[1], O[2]]), ve = p([O[3], O[4], O[5]]);
      b(ge, ve) && (Ae.add(`aux:${q}`), H++);
    }
    Vt(), pe(H === 0 && !x ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${x ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${H} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ae.size})`), Lt.style.display = "none";
  }, Xn = () => {
    Yt && (Yt = null, Lt.style.display = "none", pe("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Xn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && Yt && Xn();
  });
  const Xo = () => {
    var _a2, _b, _c, _d;
    if (Ae.size === 0) return false;
    const t = [...Ae], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? [], c = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set();
    for (const te of t) {
      const [H, ...Z] = te.split(":");
      if (H === "pt") c.add(+Z[0]);
      else if (H === "poly") h.add(+Z[0]);
      else if (H === "seg") {
        const b = +Z[0], A = +Z[1];
        w.has(b) || w.set(b, /* @__PURE__ */ new Set()), w.get(b).add(A);
      } else H === "aux" && x.add(+Z[0]);
    }
    let M = 0, k = [], p = [];
    const R = /* @__PURE__ */ new Map();
    for (let te = 0; te < s.length; te++) {
      if (h.has(te)) {
        M++;
        continue;
      }
      R.set(te, k.length);
      const H = w.get(te);
      if (H && H.size > 0) {
        let Z = [];
        for (let b = 0; b < s[te].length; b++) Z.push(s[te][b]), b < s[te].length - 1 && H.has(b) && (Z.length >= 2 && k.push(Z), Z = [], M++);
        (Z.length >= 2 || Z.length === 1) && k.push(Z);
      } else k.push([...s[te]]);
    }
    if (c.size > 0) {
      const te = [], H = /* @__PURE__ */ new Map();
      for (let b = 0; b < o.length; b++) {
        if (c.has(b)) {
          M++;
          continue;
        }
        H.set(b, te.length), te.push([...o[b]]);
      }
      const Z = [];
      for (const b of k) {
        let A = [];
        for (const $ of b) {
          const U = H.get($);
          U === void 0 ? (A.length >= 2 && Z.push(A), A = []) : A.push(U);
        }
        A.length >= 2 && Z.push(A);
      }
      k = Z, e.points.val = te;
    }
    for (const te of n) {
      const H = R.get(te);
      H !== void 0 && H < k.length && p.push(H);
    }
    if (e.polylines && (e.polylines.val = k), e.areas && (e.areas.val = p), x.size > 0 && a) {
      const te = i.filter((H, Z) => !x.has(Z));
      "val" in a ? a.val = te : window.__hekatanDrawingAuxLines = te, M += x.size;
    }
    Ae.clear(), Vt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return pe(`\u{1F5D1} ${M} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Xo, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || Ae.size !== 0 && (t.preventDefault(), Xo());
  });
  const Bt = document.createElement("div");
  Bt.id = "hk-properties-pane";
  const No = "hk-props-pane-pos";
  let Pn = null;
  try {
    const t = localStorage.getItem(No);
    t && (Pn = JSON.parse(t));
  } catch {
  }
  Bt.style.cssText = ["position:fixed", Pn ? `left:${Pn.left}px` : "left:14px", Pn ? `top:${Pn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Bt);
  const Ts = () => {
    const t = Bt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, i = 0;
    t.addEventListener("mousedown", (c) => {
      o = true, s = c.clientX, n = c.clientY;
      const h = Bt.getBoundingClientRect();
      a = h.left, i = h.top, Bt.style.transform = "none", Bt.style.left = `${a}px`, Bt.style.top = `${i}px`, c.preventDefault();
    }), window.addEventListener("mousemove", (c) => {
      if (!o) return;
      const h = c.clientX - s, w = c.clientY - n, x = Math.max(0, Math.min(window.innerWidth - 80, a + h)), M = Math.max(0, Math.min(window.innerHeight - 40, i + w));
      Bt.style.left = `${x}px`, Bt.style.top = `${M}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(No, JSON.stringify({ left: parseFloat(Bt.style.left), top: parseFloat(Bt.style.top) }));
        } catch {
        }
      }
    });
  }, le = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Tt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let pt = null;
  const St = (t, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: s, value: n } }));
  }, $s = () => {
    if (pt && (pt.dispose(), pt = null), Ae.size === 0) {
      Bt.style.display = "none";
      return;
    }
    const t = [...Ae], o = t.filter((k) => k.startsWith("pt:")), s = t.filter((k) => k.startsWith("seg:")), n = t.filter((k) => k.startsWith("poly:")), a = t.filter((k) => k.startsWith("aux:")), i = o.length > 0, c = s.length > 0, h = n.length > 0, w = !i && !c && !h, x = [];
    o.length && x.push(`\u{1F535} ${o.length} nodo(s)`), s.length && x.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && x.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && x.push(`\u250A ${a.length} aux`);
    const M = `\u{1F3AF} ${Ae.size} item(s) \u2014 ${x.join(", ")}`;
    pt = new Ms({ container: Bt, title: M });
    {
      const k = pt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      k.addBinding(Tt, "dx", { label: "\u0394x (m)", step: 0.1 }), k.addBinding(Tt, "dy", { label: "\u0394y (m)", step: 0.1 }), k.addBinding(Tt, "dz", { label: "\u0394z (m)", step: 0.1 }), k.addBinding(Tt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), k.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const H = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Tt.dx, Tt.dy, Tt.dz, Tt.copias);
        pe(H ? `\u29C9 Replicado \xD7${H} (\u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const p = { vuelo: 1.5, losa: true, borde: true, ambos: true }, R = k.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      R.addBinding(p, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), R.addBinding(p, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), R.addBinding(p, "borde", { label: "con viga de borde" }), R.addBinding(p, "ambos", { label: "a los dos lados" }), R.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a2;
        const H = (_a2 = window.__hekatanVoladoSelection) == null ? void 0 : _a2.call(window, p.vuelo, { losa: p.losa, vigaBorde: p.borde, lados: p.ambos ? "ambos" : "afuera" });
        pe(H ? `\u2310 Volado de ${p.vuelo} m en ${H} pa\xF1o(s)` + (p.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), k.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const H = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Tt.dx, Tt.dy, Tt.dz, 1);
        pe(H ? `\u2192 Copia desplazada \u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const te = k.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      te.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), te.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), pe(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const k = pt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      k.addBinding(le, "Ux"), k.addBinding(le, "Uy"), k.addBinding(le, "Uz"), k.addBinding(le, "Rx"), k.addBinding(le, "Ry"), k.addBinding(le, "Rz");
      const p = pt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      p.addBinding(le, "Kx", { label: "Kx", min: 0, step: 100 }), p.addBinding(le, "Ky", { label: "Ky", min: 0, step: 100 }), p.addBinding(le, "Kz", { label: "Kz", min: 0, step: 100 }), p.addBinding(le, "Krx", { label: "Krx", min: 0, step: 1e3 }), p.addBinding(le, "Kry", { label: "Kry", min: 0, step: 1e3 }), p.addBinding(le, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const R = pt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      R.addBinding(le, "Fx", { step: 0.1 }), R.addBinding(le, "Fy", { step: 0.1 }), R.addBinding(le, "Fz", { step: 0.1 }), R.addBinding(le, "Mx", { step: 0.1 }), R.addBinding(le, "My", { step: 0.1 }), R.addBinding(le, "Mz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(le, "mass", { label: "m", min: 0, step: 1 }), pt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(le, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), pt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let Z = 0;
        const b = [le.Ux, le.Uy, le.Uz, le.Rx, le.Ry, le.Rz];
        b.some((U) => U) && (St("nodes", o, "supports", b), Z++);
        const A = [le.Fx, le.Fy, le.Fz, le.Mx, le.My, le.Mz];
        A.some((U) => U !== 0) && (St("nodes", o, "loads", A), Z++);
        const $ = [le.Kx, le.Ky, le.Kz, le.Krx, le.Kry, le.Krz];
        if ($.some((U) => U !== 0) && (St("nodes", o, "springs", $), Z++), le.mass !== 0 && (St("nodes", o, "mass", le.mass), Z++), le.diaphragm !== "Ninguno" && (St("nodes", o, "diaphragm", le.diaphragm), Z++), Z === 0) {
          pe("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let U = document.getElementById("hk-prop-toast");
          U || (U = document.createElement("div"), U.id = "hk-prop-toast", U.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(U)), U.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", U.style.background = "rgba(217,119,6,0.97)", U.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            U && (U.style.opacity = "0");
          }, 3200);
        } else pe(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (c) {
      const k = pt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      k.addBinding(le, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), k.addBinding(le, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const p = pt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      p.addBinding(le, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), p.addBinding(le, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), p.addBinding(le, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), p.addBinding(le, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), pt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(le, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), pt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(le, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const H = pt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      H.addBinding(le, "relMxI", { label: "Mx I" }), H.addBinding(le, "relMyI", { label: "My I" }), H.addBinding(le, "relMzI", { label: "Mz I" });
      const Z = pt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      Z.addBinding(le, "relMxJ", { label: "Mx J" }), Z.addBinding(le, "relMyJ", { label: "My J" }), Z.addBinding(le, "relMzJ", { label: "Mz J" }), pt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(le, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const A = pt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      A.addBinding(le, "LKx", { label: "LKx", min: 0, step: 100 }), A.addBinding(le, "LKy", { label: "LKy", min: 0, step: 100 }), A.addBinding(le, "LKz", { label: "LKz", min: 0, step: 100 });
      const $ = pt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      $.addBinding(le, "qx", { step: 0.1 }), $.addBinding(le, "qy", { step: 0.1 }), $.addBinding(le, "qz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(le, "massPerM", { label: "m/L", min: 0, step: 1 }), pt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        St("segs", s, "section", le.section), St("segs", s, "material", le.material_frame);
        const J = { A: le.A_mod, Iz: le.Iz_mod, Iy: le.Iy_mod, J: le.J_mod };
        (J.A !== 1 || J.Iz !== 1 || J.Iy !== 1 || J.J !== 1) && St("segs", s, "modifiers", J), le.insertionPoint !== "10 \u2014 Centroid" && St("segs", s, "insertionPoint", le.insertionPoint), le.beta !== 0 && St("segs", s, "beta", le.beta);
        const q = [le.relMxI, le.relMyI, le.relMzI], O = [le.relMxJ, le.relMyJ, le.relMzJ];
        (q.some((Se) => Se) || O.some((Se) => Se)) && St("segs", s, "releases", { i: q, j: O }), le.hinges !== "None" && St("segs", s, "hinges", le.hinges);
        const ge = [le.LKx, le.LKy, le.LKz];
        ge.some((Se) => Se !== 0) && St("segs", s, "lineSprings", ge);
        const ve = [le.qx, le.qy, le.qz];
        ve.some((Se) => Se !== 0) && St("segs", s, "distLoad", ve), le.massPerM !== 0 && St("segs", s, "massPerM", le.massPerM), pe(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (h) {
      const k = pt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      k.addBinding(le, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), k.addBinding(le, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), k.addBinding(le, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), pt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(le, "surfLoad", { label: "q", step: 0.1 }), pt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        St("areas", n, "shellType", le.shellType), St("areas", n, "thickness", le.thickness), St("areas", n, "material", le.material_shell), le.surfLoad !== 0 && St("areas", n, "surfLoad", le.surfLoad), pe(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (w) {
      const k = pt.addFolder({ title: "\u2139 Selecci\xF3n" }), p = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      k.addBinding(p, "msg", { readonly: true, label: "" });
    }
    pt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ae.clear(), Vt();
    }), Bt.style.display = "block", Ts();
  };
  window.__hekatanRefreshPropsPane = $s;
  let mn = null, Nn = false;
  g.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, Nn = false);
  }), g.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !Nn) {
      const o = t.clientX - mn.x, s = t.clientY - mn.y;
      Math.hypot(o, s) > 8 && (Nn = true);
    }
  }), g.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !Nn;
      mn = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Yt ? Xn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ae.size > 0 && (Ae.clear(), Vt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), pe(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : pe("\u238B Cancelado (click derecho)");
      }
    }
  }), g.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), g.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Gt = null, Sn = false));
  }), g.addEventListener("pointermove", (t) => {
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
  }), g.addEventListener("pointerup", (t) => {
    if (!Gt) return;
    if (!Sn) {
      Gt = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    Bo(Gt.x, Gt.y, t.clientX, t.clientY, o), Gt = null, Sn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const qt = new it();
  qt.visible = false, qt.frustumCulled = false, r.add(qt);
  const Yo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, Zo = (t, o, s, n) => {
    var _a2, _b, _c, _d;
    for (; qt.children.length; ) {
      const c = qt.children.pop();
      (_b = (_a2 = c.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = c.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Yo[t] ?? 16777215, i = new ze().setFromPoints([new S(-1, -1, 0), new S(1, -1, 0), new S(1, -1, 0), new S(1, 1, 0), new S(1, 1, 0), new S(-1, 1, 0), new S(-1, 1, 0), new S(-1, -1, 0)]);
    qt.add(new Wt(i, new ht({ color: a, linewidth: 2 }))), qt.position.set(o, s, n), qt.visible = true, fo();
  };
  let uo = 4;
  const fo = () => {
    qt.visible && qt.scale.setScalar(uo * Bn(qt.position));
  };
  window.__hekatanOsnapMarkerRef = qt, window.__hekatanUpdateOsnapScale = fo, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (uo = t, fo(), y()), uo);
  const Yn = () => {
    qt.visible = false;
  }, Ls = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Jt = document.createElement("div");
  Jt.id = "hk-osnap-etiqueta", Jt.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Jt);
  const Uo = (t, o, s) => {
    const n = Ls[t];
    if (!n) {
      Jt.style.display = "none";
      return;
    }
    Jt.textContent = n, Jt.style.color = "#" + (Yo[t] ?? 16777215).toString(16).padStart(6, "0"), Jt.style.left = o + 18 + "px", Jt.style.top = s - 26 + "px", Jt.style.display = "block";
  }, Is = () => {
    Jt.style.display = "none";
  }, Cn = new S(), ho = (t, o, s) => {
    const n = d();
    if (!n) return null;
    const a = g.getBoundingClientRect();
    return Cn.set(t, o, s).project(n), !isFinite(Cn.x) || !isFinite(Cn.y) ? null : { x: a.left + (Cn.x * 0.5 + 0.5) * a.width, y: a.top + (-Cn.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = ho;
  const Rs = (t, o, s, n, a) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, c = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let w = null;
    const x = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, M = a, k = (b, A, $, U) => {
      let J;
      if (M) {
        const O = ho(A, $, U);
        if (!O || (J = Math.hypot(O.x - M.x, O.y - M.y), J > kn)) return;
      } else if (J = Math.hypot(A - t, $ - o, U - s), J > n) return;
      const q = x[b] ?? 9;
      (!w || q < w.r || q === w.r && J < w.d) && (w = { type: b, x: A, y: $, z: U, d: J, r: q });
    };
    if (i.ori !== false && k("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const b = window.__hekatanGridConfig, A = (b == null ? void 0 : b.minorStep) && b.minorStep > 0 ? b.minorStep : 1, $ = ((b == null ? void 0 : b.gridSize) ?? 30) / 2, U = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", J = (O) => Math.round(O / A) * A, q = (O, ge) => Math.abs(O) <= $ + 1e-9 && Math.abs(ge) <= $ + 1e-9;
      if (U === "xz") {
        const O = J(t), ge = J(s);
        q(O, ge) && k("grid", O, o, ge);
      } else if (U === "yz") {
        const O = J(o), ge = J(s);
        q(O, ge) && k("grid", t, O, ge);
      } else {
        const O = J(t), ge = J(o);
        q(O, ge) && k("grid", O, ge, s);
      }
    }
    (i.node || i.end) && c.forEach((b) => {
      i.node && k("node", b[0], b[1], b[2]);
    });
    for (const b of h) if (!(b.length < 2)) for (let A = 0; A < b.length - 1; A++) {
      const $ = c[b[A]], U = c[b[A + 1]];
      if (!(!$ || !U) && (i.end && (k("end", $[0], $[1], $[2]), k("end", U[0], U[1], U[2])), i.mid && k("mid", ($[0] + U[0]) / 2, ($[1] + U[1]) / 2, ($[2] + U[2]) / 2), i.nea || i.per)) {
        const J = U[0] - $[0], q = U[1] - $[1], O = U[2] - $[2], ge = J * J + q * q + O * O;
        if (ge < 1e-12) continue;
        const ve = Math.max(0, Math.min(1, ((t - $[0]) * J + (o - $[1]) * q + (s - $[2]) * O) / ge)), Se = $[0] + ve * J, je = $[1] + ve * q, Ie = $[2] + ve * O;
        i.nea && k("nea", Se, je, Ie), i.per && k("per", Se, je, Ie);
      }
    }
    if (i.cen) {
      const b = ((_e = e.areas) == null ? void 0 : _e.rawVal) ?? [];
      for (const A of b) {
        const $ = h[A];
        if (!$ || $.length < 3) continue;
        const U = $[0] === $[$.length - 1] ? $.slice(0, -1) : $;
        let J = 0, q = 0, O = 0, ge = 0;
        for (const ve of U) {
          const Se = c[ve];
          Se && (J += Se[0], q += Se[1], O += Se[2], ge++);
        }
        ge >= 3 && k("cen", J / ge, q / ge, O / ge);
      }
    }
    if (i.cen) {
      const b = bn(), A = [...an];
      for (const $ of b) A.some((U) => Math.hypot(U.c[0] - $.c[0], U.c[1] - $.c[1], U.c[2] - $.c[2]) < 1e-6 && Math.abs(U.r - $.r) < 1e-6) || A.push($);
      for (const $ of A) {
        if (!c.some((q) => Math.abs(Math.hypot(q[0] - $.c[0], q[1] - $.c[1], q[2] - $.c[2]) - $.r) < 1e-6)) continue;
        const J = Math.hypot(t - $.c[0], o - $.c[1], s - $.c[2]);
        if (J < n || Math.abs(J - $.r) < n) {
          const q = Math.min(J, n * 0.5), O = 3;
          (!w || O < w.r || O === w.r && q < w.d) && (w = { type: "cen", x: $.c[0], y: $.c[1], z: $.c[2], d: q, r: O });
        }
      }
    }
    if (i.int) {
      const b = [];
      for (const A of h) for (let $ = 0; $ < A.length - 1; $++) {
        const U = c[A[$]], J = c[A[$ + 1]];
        if (!U || !J) continue;
        const q = J[0] - U[0], O = J[1] - U[1], ge = J[2] - U[2], ve = q * q + O * O + ge * ge;
        if (ve < 1e-12) continue;
        const Se = Math.max(0, Math.min(1, ((t - U[0]) * q + (o - U[1]) * O + (s - U[2]) * ge) / ve));
        Math.hypot(U[0] + Se * q - t, U[1] + Se * O - o, U[2] + Se * ge - s) < 3 * n && b.push([U, J]);
      }
      for (let A = 0; A < b.length; A++) for (let $ = A + 1; $ < b.length; $++) {
        const [U, J] = b[A], [q, O] = b[$], ge = [J[0] - U[0], J[1] - U[1], J[2] - U[2]], ve = [O[0] - q[0], O[1] - q[1], O[2] - q[2]], Se = [U[0] - q[0], U[1] - q[1], U[2] - q[2]], je = ge[0] * ge[0] + ge[1] * ge[1] + ge[2] * ge[2], Ie = ge[0] * ve[0] + ge[1] * ve[1] + ge[2] * ve[2], ot = ve[0] * ve[0] + ve[1] * ve[1] + ve[2] * ve[2], tt = ge[0] * Se[0] + ge[1] * Se[1] + ge[2] * Se[2], at = ve[0] * Se[0] + ve[1] * Se[1] + ve[2] * Se[2], Qe = je * ot - Ie * Ie;
        if (Qe < 1e-12) continue;
        const $e = (Ie * at - ot * tt) / Qe, nt = (je * at - Ie * tt) / Qe;
        if ($e < -1e-6 || $e > 1 + 1e-6 || nt < -1e-6 || nt > 1 + 1e-6) continue;
        const Ye = [U[0] + $e * ge[0], U[1] + $e * ge[1], U[2] + $e * ge[2]], _e2 = [q[0] + nt * ve[0], q[1] + nt * ve[1], q[2] + nt * ve[2]];
        if (Math.hypot(Ye[0] - _e2[0], Ye[1] - _e2[1], Ye[2] - _e2[2]) > 1e-4) continue;
        [U, J, q, O].some((et) => Math.hypot(et[0] - Ye[0], et[1] - Ye[1], et[2] - Ye[2]) < 1e-6) || k("int", Ye[0], Ye[1], Ye[2]);
      }
    }
    const p = window.__hekatanAxisGrids ?? [], R = window.__hekatanLevels ?? [], te = p.filter((b) => b && b.start && b.end).map((b) => [b.start, b.end]);
    for (const [b, A] of te) {
      i.end && (k("end", b[0], b[1], b[2]), k("end", A[0], A[1], A[2]));
      const $ = A[0] - b[0], U = A[1] - b[1], J = A[2] - b[2], q = $ * $ + U * U + J * J;
      if (q < 1e-12) continue;
      const O = Math.max(0, Math.min(1, ((t - b[0]) * $ + (o - b[1]) * U + (s - b[2]) * J) / q));
      if (i.nea && k("nea", b[0] + O * $, b[1] + O * U, b[2] + O * J), i.int && Math.abs(J) > 1e-9) for (const ge of R) {
        const ve = (ge.z - b[2]) / J;
        ve < -1e-6 || ve > 1 + 1e-6 || k("int", b[0] + ve * $, b[1] + ve * U, ge.z);
      }
    }
    if (i.int || i.node) for (let b = 0; b < te.length; b++) for (let A = b + 1; A < te.length; A++) {
      const [$, U] = te[b], [J, q] = te[A], O = U[0] - $[0], ge = U[1] - $[1], ve = q[0] - J[0], Se = q[1] - J[1], je = O * Se - ge * ve;
      if (Math.abs(je) < 1e-12) continue;
      const Ie = $[0] - J[0], ot = $[1] - J[1], tt = (ve * ot - Se * Ie) / je, at = (O * ot - ge * Ie) / je;
      if (tt < -1e-6 || tt > 1 + 1e-6 || at < -1e-6 || at > 1 + 1e-6) continue;
      const Qe = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      k("int", $[0] + tt * O, $[1] + tt * ge, typeof Qe == "number" ? Qe : s);
    }
    const H = window.__hekatanDrawingAuxLines, Z = (H == null ? void 0 : H.rawVal) ?? (H == null ? void 0 : H.val) ?? H ?? [];
    for (const b of Z) {
      if (b.length !== 6) continue;
      const A = [b[0], b[1], b[2]], $ = [b[3], b[4], b[5]];
      if (i.end && (k("end", A[0], A[1], A[2]), k("end", $[0], $[1], $[2])), i.mid && k("mid", (A[0] + $[0]) / 2, (A[1] + $[1]) / 2, (A[2] + $[2]) / 2), i.nea || i.per) {
        const U = $[0] - A[0], J = $[1] - A[1], q = $[2] - A[2], O = U * U + J * J + q * q;
        if (O < 1e-12) continue;
        const ge = Math.max(0, Math.min(1, ((t - A[0]) * U + (o - A[1]) * J + (s - A[2]) * q) / O)), ve = A[0] + ge * U, Se = A[1] + ge * J, je = A[2] + ge * q;
        i.nea && k("nea", ve, Se, je), i.per && k("per", ve, Se, je);
      }
    }
    return w ? { type: w.type, x: w.x, y: w.y, z: w.z } : null;
  }, wn = new it();
  wn.frustumCulled = false, r.add(wn);
  const qo = new ht({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Ko = 0;
  const Go = () => {
    var _a2, _b;
    for (const t of wn.children.slice()) wn.remove(t), (_b = (_a2 = t.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (t) => {
    var _a2, _b;
    Go();
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const a of t || []) {
      const i = String(a).split(":");
      let c = [];
      if (i[0] === "pt") {
        const x = o[+i[1]];
        x && (c = [x, [x[0] + 1e-3, x[1], x[2]]]);
      } else if (i[0] === "seg") {
        const x = s[+i[1]] || [], M = o[x[+i[2]]], k = o[x[+i[2] + 1]];
        M && k && (c = [M, k]);
      } else i[0] === "poly" && (c = (s[+i[1]] || []).map((M) => o[M]).filter(Boolean));
      if (c.length < 2) continue;
      const h = new ze().setFromPoints(c.map((x) => new S(x[0], x[1], x[2]))), w = new Ft(h, qo);
      w.renderOrder = 1200, wn.add(w);
    }
    if (!wn.children.length) return;
    Ko = performance.now() + 900;
    const n = () => {
      const a = Ko - performance.now();
      if (a <= 0) {
        Go(), y();
        return;
      }
      qo.opacity = Math.min(1, a / 900) * 0.95, y(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Rs, window.__hekatanOsnapShow = Zo, window.__hekatanOsnapHide = Yn;
  let Ue = [], vt = 0, rn = 0, zt = null;
  const zn = document.createElement("div");
  zn.id = "hk-cad-status", zn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", zn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(zn);
  const Ds = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), Je && t.push(`\u{1F512} LOCK ${Je.toUpperCase()}`);
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && t.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, pe = (t) => {
    var _a2;
    const o = t + Ds();
    zn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, Bs = "Comando:", Xs = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = Ue.length, a = (i, c = []) => ({ txt: i, ops: c });
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
        return a(`\xC1REA LIBRE Precise v\xE9rtice ${we.length + 1} (Enter o clic derecho cierra y malla):`);
      case "rect":
        return a(n ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return a(n ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return a(n === 0 ? "ARCO Precise punto inicial:" : n === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return a(`COLUMNA Precise punto de inserci\xF3n (altura ${vt > 0 ? vt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return a(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${vt > 0 ? vt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return a(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return a("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return a("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return a(zt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return a(zt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return a(zt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${rn > 0 ? ` (distancia ${rn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return a(Bs);
    }
  }, Zt = () => {
    var _a2, _b, _c, _d, _e;
    try {
      const t = Xs(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !s ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e = window.__hekatanCadPrompt) == null ? void 0 : _e.call(window, a, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Zt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    pe(o);
  }, window.__hekatanCadResetPending = () => {
    Ue = [], we = [], W.visible = false, mo(), zt = null, y(), pe("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Zt();
  };
  function mo() {
    if (!e.polylines) return;
    const t = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...t, []];
  }
  window.__hekatanCerrarPolilinea = mo;
  const yn = [], Zn = [], wo = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, Ho = (t) => {
    var _a2;
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Ue = [], ce.visible = false, st.visible = false, V();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y(), Zt();
  }, Xt = () => {
    yn.push(wo()), yn.length > 100 && yn.shift(), Zn.length = 0;
  }, Un = () => {
    const t = yn.pop();
    if (!t) {
      pe("\u21B6 Nada para deshacer");
      return;
    }
    Zn.push(wo()), Ho(t), pe(`\u21B6 Deshacer \u2014 quedan ${yn.length}`);
  }, Wo = () => {
    const t = Zn.pop();
    if (!t) {
      pe("\u21B7 Nada para rehacer");
      return;
    }
    yn.push(wo()), Ho(t), pe(`\u21B7 Rehacer \u2014 quedan ${Zn.length}`);
  };
  window.__hekatanPushUndo = Xt, window.__hekatanUndo = Un, window.__hekatanRedo = Wo, document.addEventListener("keydown", (t) => {
    var _a2;
    const o = t.key.toLowerCase();
    if (!((t.ctrlKey || t.metaKey) && (o === "y" || o === "z" && t.shiftKey))) return;
    const n = t.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (t.preventDefault(), t.stopPropagation(), Wo());
  }, { capture: true }), window.__hekatanCadOption = (t) => {
    var _a2, _b, _c, _d, _e;
    const o = t.trim().toLowerCase(), s = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
    if (s !== "line" && s !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Un(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (a.length < 3) return pe("Cerrar necesita al menos tres puntos."), true;
      Xt(), e.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return yo(), pe(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Un(), true;
      Xt();
      const i = a[a.length - 1], c = a.slice(0, -1), h = n.some((M, k) => k !== n.length - 1 && M.includes(i)) || c.includes(i);
      let w = e.points.rawVal, x = [...n.slice(0, -1), c];
      if (!h && i === w.length - 1 && (w = w.slice(0, -1), e.points.val = w), e.polylines.val = x, c.length) {
        const M = w[c[c.length - 1]];
        M && (E = [M[0], M[1], M[2]]);
      } else E = null, ce.visible = false;
      try {
        (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
      } catch {
      }
      return y(), pe(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${c.length}.`), Zt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (t) => {
    var _a2;
    if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z" && !t.shiftKey) {
      const o = t.target, s = o == null ? void 0 : o.tagName;
      if ((s === "INPUT" || s === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Un();
    }
  }, { capture: true });
  const yo = () => {
    Ue = [], zt = null, mo(), Je = null, Ve(), ce.visible = false, st.visible = false, V(), pe("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), y(), Zt();
  };
  window.__hekatanFinalizeDraw = yo;
  const Jo = () => {
    var _a2, _b, _c;
    Ue = [], we = [], W.visible = false;
    let t = false;
    Ae.size && (Ae.clear(), Vt(), t = true), yo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    pe(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), y(), Zt();
  };
  window.__hekatanEscapeCancel = Jo;
  const Oo = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Ae.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (t[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = t[+n[1]] || [], i = a[+n[2]], c = a[+n[2] + 1];
        i != null && o.add(i), c != null && o.add(c);
      }
    }), o;
  }, Qo = (t, o, s) => {
    var _a2;
    const n = Oo();
    if (!n.size) return 0;
    Xt();
    const a = e.points.rawVal.map((i, c) => n.has(c) ? [i[0] + t, i[1] + o, i[2] + s] : i);
    e.points.val = a;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Vt(), y(), n.size;
  };
  window.__hekatanMoveSelection = Qo;
  const jo = (t, o) => {
    var _a2, _b, _c, _d, _e;
    if (!Ae.size) {
      pe(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Zt();
      return;
    }
    if (Ue.push(o), Ue.length === 1) {
      E = o, pe(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Zt();
      return;
    }
    const [s, n] = Ue, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    Ue = [], ce.visible = false;
    let i = 0;
    t === "move" ? i = Qo(a[0], a[1], a[2]) : (i = Oo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), pe(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), t === "move" && (Ae.clear(), Vt()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Zt();
  };
  window.__hekatanPasoMoverCopiar = jo;
  const Ns = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), xo = (t, o, s, n, a, i) => {
    const c = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], h = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], w = [t[0] - s[0], t[1] - s[1], t[2] - s[2]], x = c[0] * c[0] + c[1] * c[1] + c[2] * c[2], M = c[0] * h[0] + c[1] * h[1] + c[2] * h[2], k = h[0] * h[0] + h[1] * h[1] + h[2] * h[2], p = c[0] * w[0] + c[1] * w[1] + c[2] * w[2], R = h[0] * w[0] + h[1] * w[1] + h[2] * w[2], te = x * k - M * M;
    if (te < 1e-12) return null;
    const H = (M * R - k * p) / te, Z = (x * R - M * p) / te;
    if (!a && (H < -1e-6 || H > 1 + 1e-6) || !i && (Z < -1e-6 || Z > 1 + 1e-6)) return null;
    const b = [t[0] + H * c[0], t[1] + H * c[1], t[2] + H * c[2]], A = [s[0] + Z * h[0], s[1] + Z * h[1], s[2] + Z * h[2]];
    return jt(b, A) > 1e-4 ? null : b;
  }, Ys = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === t).length, 0);
  }, Zs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Us = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal, n = e.points.rawVal, a = Zs[t];
    if (!zt) {
      if (Be < 0) {
        pe(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      zt = { poly: Be, seg: Math.max(0, We) }, pe(t === "offset" ? `DESFASE l\xEDnea #${zt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${rn > 0 ? ` (${rn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Zt();
      return;
    }
    if (t === "offset") {
      const H = zt.poly, Z = s[H];
      if (!Z || Z.length < 2) {
        zt = null, pe("DESFASE: esa polil\xEDnea no tiene tramos."), Zt();
        return;
      }
      const b = Z.length > 2 && Z[0] === Z[Z.length - 1], A = Ns(), $ = [];
      for (let $e = 0; $e < Z.length - 1; $e++) {
        const nt = n[Z[$e]], Ye = n[Z[$e + 1]], _e = [Ye[0] - nt[0], Ye[1] - nt[1], Ye[2] - nt[2]], Re = Math.hypot(_e[0], _e[1], _e[2]) || 1, et = _e[0] / Re, It = _e[1] / Re, Nt = _e[2] / Re, Rt = [A[1] * Nt - A[2] * It, A[2] * et - A[0] * Nt, A[0] * It - A[1] * et], Qt = Math.hypot(Rt[0], Rt[1], Rt[2]) || 1;
        $.push({ a: nt, b: Ye, n: [Rt[0] / Qt, Rt[1] / Qt, Rt[2] / Qt] });
      }
      let U = 0, J = 1 / 0;
      $.forEach(($e, nt) => {
        const Ye = on(o[0], o[1], o[2], $e.a[0], $e.a[1], $e.a[2], $e.b[0], $e.b[1], $e.b[2]);
        Ye < J && (J = Ye, U = nt);
      });
      const q = $[U], O = Math.sign((o[0] - q.a[0]) * q.n[0] + (o[1] - q.a[1]) * q.n[1] + (o[2] - q.a[2]) * q.n[2]) || 1, ge = rn > 0 ? rn : J;
      if (ge < 1e-6) {
        pe("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const ve = $.map(($e) => ({ a: [$e.a[0] + O * ge * $e.n[0], $e.a[1] + O * ge * $e.n[1], $e.a[2] + O * ge * $e.n[2]], b: [$e.b[0] + O * ge * $e.n[0], $e.b[1] + O * ge * $e.n[1], $e.b[2] + O * ge * $e.n[2]] })), Se = ve.length, je = ($e) => {
        const nt = ve[($e - 1 + Se) % Se], Ye = ve[$e % Se];
        return xo(nt.a, nt.b, Ye.a, Ye.b, true, true) ?? Ye.a;
      }, Ie = [], ot = b ? Se : Se + 1;
      for (let $e = 0; $e < ot; $e++) !b && $e === 0 ? Ie.push(ve[0].a) : !b && $e === Se ? Ie.push(ve[Se - 1].b) : Ie.push(je($e));
      Xt();
      const tt = n.length;
      e.points.val = [...n, ...Ie];
      const at = Ie.map(($e, nt) => tt + nt);
      b && at.push(tt);
      let Qe = s.slice();
      Qe.length && Qe[Qe.length - 1].length === 0 && (Qe = Qe.slice(0, -1)), e.polylines.val = [...Qe, at, []], zt = null, pe(`\u2713 Desfase a ${ge.toFixed(2)} m \u2014 ${Se} tramo${Se === 1 ? "" : "s"} nuevo${Se === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      y(), Zt();
      return;
    }
    let i = Be, c = Math.max(0, We);
    if (i < 0 || i === zt.poly && c === zt.seg) {
      let Z = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, s.forEach((b, A) => {
        for (let $ = 0; $ < b.length - 1; $++) {
          if (A === zt.poly && $ === zt.seg) continue;
          const U = n[b[$]], J = n[b[$ + 1]];
          if (!U || !J) continue;
          const q = on(o[0], o[1], o[2], U[0], U[1], U[2], J[0], J[1], J[2]);
          q < Z && (Z = q, i = A, c = $);
        }
      }), i < 0) {
        pe(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const h = s[zt.poly], w = n[h[zt.seg]], x = n[h[zt.seg + 1]], M = s[i], k = M[c], p = M[c + 1];
    if (!w || !x || k == null || p == null) {
      pe(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const R = n[k], te = n[p];
    if (t === "trim") {
      const H = xo(R, te, w, x, false, false);
      if (!H) {
        pe("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Xt();
      const Z = n.length;
      e.points.val = [...n, H];
      const b = [...M.slice(0, c + 1), Z, ...M.slice(c + 1)];
      e.polylines.val = s.map(($, U) => U === i ? b : $);
      const A = jt(o, R) < jt(o, te);
      In(i, A ? c : c + 1), pe(`\u2713 Recortado en (${H[0].toFixed(2)}, ${H[1].toFixed(2)}, ${H[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const H = xo(R, te, w, x, true, false);
      if (!H) {
        pe("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const b = jt(o, R) < jt(o, te) ? c : c + 1;
      if (b !== 0 && b !== M.length - 1) {
        pe("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const A = M[b];
      if (jt(H, R) + jt(H, te) < jt(R, te) + 1e-6) {
        pe("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Xt(), Ys(A) > 1) {
        const U = n.length;
        e.points.val = [...n, H];
        const J = M.slice();
        J[b] = U, e.polylines.val = s.map((q, O) => O === i ? J : q);
      } else e.points.val = n.map((U, J) => J === A ? H : U);
      pe(`\u2713 Alargada hasta (${H[0].toFixed(2)}, ${H[1].toFixed(2)}, ${H[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
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
    return Ae.clear(), o >= 0 && Ae.add(`poly:${o}`), Vt(), pe(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ae.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Ae.clear();
    const s = /* @__PURE__ */ new Set();
    return t.forEach((n, a) => {
      !n || n.length < 2 || (Ae.add(`poly:${a}`), n.forEach((i) => s.add(i)));
    }), o.forEach((n, a) => {
      s.has(a) || Ae.add(`pt:${a}`);
    }), Vt(), pe(`SELECCI\xD3N ${Ae.size} objetos (todo el modelo) \xB7 Esc suelta`), Ae.size;
  }, window.__hekatanReplicateSelection = (t, o, s, n, a = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const i = [...Ae], c = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], w = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), x = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), k = [];
    if (i.forEach((Z) => {
      if (Z.startsWith("pt:")) {
        const b = +Z.slice(3);
        c[b] && x.add(b);
      } else if (Z.startsWith("poly:")) {
        const b = +Z.slice(5);
        if (!h[b] || h[b].length < 2) return;
        M.add(b), h[b].forEach((A) => x.add(A));
      } else if (Z.startsWith("seg:")) {
        const b = Z.split(":"), A = +b[1], $ = +b[2], U = h[A] || [], J = U[$], q = U[$ + 1];
        J != null && q != null && (k.push([J, q]), x.add(J), x.add(q));
      }
    }), !x.size) return 0;
    Xt();
    const p = [...c];
    let R = h.slice();
    R.length && R[R.length - 1].length === 0 && (R = R.slice(0, -1));
    const te = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], H = [...x];
    for (let Z = 1; Z <= n; Z++) {
      const b = a + Z, A = t * b, $ = o * b, U = s * b, J = /* @__PURE__ */ new Map();
      H.forEach((q) => {
        J.set(q, p.length), p.push([c[q][0] + A, c[q][1] + $, c[q][2] + U]);
      }), M.forEach((q) => {
        const O = h[q].map((ve) => J.has(ve) ? J.get(ve) : ve), ge = R.length;
        R.push(O), w.has(q) && te.push(ge);
      }), k.forEach(([q, O]) => {
        R.push([J.get(q), J.get(O)]);
      });
    }
    R.push([]), e.points.val = p, e.polylines && (e.polylines.val = R), e.areas && (e.areas.val = te);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return y(), n;
  }, window.__hekatanVoladoSelection = (t, o = {}) => {
    var _a2, _b, _c;
    const s = Number(t);
    if (!Number.isFinite(s) || Math.abs(s) < 1e-6) return 0;
    const n = o.losa !== false, a = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", c = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], w = [];
    if ([...Ae].forEach((H) => {
      if (H.startsWith("seg:")) {
        const Z = H.split(":"), b = +Z[1], A = +Z[2], $ = h[b] || [], U = $[A], J = $[A + 1];
        U != null && J != null && w.push([U, J]);
      } else if (H.startsWith("poly:")) {
        const Z = h[+H.slice(5)] || [];
        for (let b = 0; b + 1 < Z.length; b++) w.push([Z[b], Z[b + 1]]);
      }
    }), !w.length) return 0;
    let x = 0, M = 0;
    for (const H of c) x += H[0], M += H[1];
    x /= Math.max(1, c.length), M /= Math.max(1, c.length), Xt();
    const k = [...c];
    let p = h.slice();
    p.length && p[p.length - 1].length === 0 && (p = p.slice(0, -1));
    const R = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let te = 0;
    for (const [H, Z] of w) {
      const b = c[H], A = c[Z];
      if (!b || !A) continue;
      const $ = A[0] - b[0], U = A[1] - b[1], J = Math.hypot($, U);
      if (J < 1e-6) continue;
      let q = -U / J, O = $ / J;
      const ge = (b[0] + A[0]) / 2, ve = (b[1] + A[1]) / 2;
      (ge - x) * q + (ve - M) * O < 0 && (q = -q, O = -O);
      const Se = i === "ambos" ? [1, -1] : [1];
      for (const je of Se) {
        const Ie = q * s * je, ot = O * s * je, tt = k.length;
        k.push([b[0] + Ie, b[1] + ot, b[2]]);
        const at = k.length;
        k.push([A[0] + Ie, A[1] + ot, A[2]]), p.push([H, tt]), p.push([Z, at]), a && p.push([tt, at]), n && (R.push(p.length), p.push([H, Z, at, tt, H])), te++;
      }
    }
    if (!te) return 0;
    p.push([]), e.points.val = k, e.polylines && (e.polylines.val = p), e.areas && (e.areas.val = R);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return y(), te;
  }, g.addEventListener("click", (t) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: t.clientX, y: t.clientY }, ln > 5) {
      ln = 0;
      return;
    }
    ln = 0;
    const o = v(t);
    if (!o) return;
    _.setFromCamera(C, o);
    const s = ne();
    if (!s.length) return;
    {
      const a = o.position.distanceTo(u.target) || 1, i = s[0].distance ?? o.position.distanceTo(s[0].point), c = s[0].point;
      if (!isFinite(c.x) || !isFinite(c.y) || !isFinite(c.z) || i > Math.max(a * 12, 300)) {
        pe("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = s[0].point;
    (t.ctrlKey || t.metaKey) && (n = new S(Math.round(s[0].point.x), Math.round(s[0].point.y), Math.round(s[0].point.z)));
    {
      const a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = a[a.length - 1] ?? [], c = e.points.rawVal ?? [];
      if (i.length > 0) {
        const h = c[i[i.length - 1]];
        if (h) {
          const w = !!window.__hekatanOrthoMode;
          let x = Je;
          if (!x && w) {
            const M = Math.abs(n.x - h[0]), k = Math.abs(n.y - h[1]), p = Math.abs(n.z - h[2]);
            x = M >= k && M >= p ? "x" : k >= p ? "y" : "z";
          }
          x === "x" ? n = new S(n.x, h[1], h[2]) : x === "y" ? n = new S(h[0], n.y, h[2]) : x === "z" && (n = new S(h[0], h[1], n.z));
        }
      }
    }
    if (qe && Math.abs(t.clientX - qe.x) <= 3 && Math.abs(t.clientY - qe.y) <= 3) n = qe.p.clone();
    else if (kt) n = kt.clone(), pe(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n = new S(i.x, i.y, i.z), pe(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const c = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0;
        c && h > 0 && (n = new S(Math.round(n.x / h) * h, Math.round(n.y / h) * h, Math.round(n.z / h) * h));
      }
    }
    es(n, t);
  });
  const es = (t, o) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (Ut) {
        Yt && Xn();
        const { kind: n, a, b: i } = Ut, c = i !== void 0 ? `${n}:${a}:${i}` : `${n}:${a}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Ae.clear(), Ae.has(c) ? Ae.delete(c) : Ae.add(c), Vt(), pe(`\u2713 Seleccionados ${Ae.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), a = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Yt ? (Bo(Yt.x, Yt.y, a, i, n), Yt = null) : n || (Yt = { x: a, y: i }, pe("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), po(a, i, a + 1, i + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], pe(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const a = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], a);
      pe(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      jo(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "delete") {
      if (wt >= 0) {
        const n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = wt;
        if (i >= 0 && i < a.length) {
          Xt();
          const c = a.slice(0, i).concat(a.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = c : window.__hekatanDrawingAuxLines = c, pe(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), wt = -1, dt.visible = false;
          try {
            (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
          } catch {
          }
        }
      } else if (Be >= 0) {
        const n = Be, a = We;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (sn(n), pe(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : a >= 0 ? (In(n, a), pe(`\u{1F5D1} Segmento ${a + 1} de polil\xEDnea #${n + 1} borrado`)) : (sn(n), pe(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else pe("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        pe("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, a] = Ue, i = Math.hypot(a[0] - n[0], a[1] - n[1], a[2] - n[2]);
      Math.abs(a[0] - n[0]);
      const c = Math.abs(a[1] - n[1]), w = Math.abs(a[2] - n[2]) < 1e-3 ? "xy" : c < 1e-3 ? "xz" : "yz", x = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, x, w), pe(`\u2713 C\xEDrculo dibujado en ${w.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${x} segmentos`), Ue = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (s === "arc") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        pe("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ue.length === 2) {
        pe("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, a, i] = Ue, c = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, a, i, c), pe(`\u2713 Arco dibujado \u2014 ${c} segmentos`), Ue = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (s === "rect") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        pe("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ue;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, a), pe(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Ue = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        pe("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ue;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, a), pe(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Ue = [];
      return;
    }
    if (s === "polyarea") {
      we.push([t.x, t.y, t.z]), W.geometry.setFromPoints(we.map((n) => new S(n[0], n[1], n[2]))), W.visible = we.length >= 1, pe(`\u25B0 \xC1rea libre \u2014 ${we.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), y();
      return;
    }
    if (s === "plane3") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length < 3) {
        pe(`\u25E3 Plano inclinado \u2014 punto ${Ue.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, a, i] = Ue, c = (_o = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o.call(window, n, a, i);
      pe(c ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ue = [];
      return;
    }
    if (s === "col") {
      Xt();
      const n = t.z, a = vt && vt > 0 ? vt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + a]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], vt = 0, pe(`\u258C Columna creada \u2014 h=${a.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        pe("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, a] = Ue, i = vt && vt > 0 ? vt : 3;
      Xt();
      const c = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [a[0], a[1], a[2]], [a[0], a[1], a[2] + i], [n[0], n[1], n[2] + i]];
      const h = e.polylines.rawVal;
      if (h.length - 1, e.polylines.val = [...h.slice(0, -1), ...h[h.length - 1].length > 0 ? [h[h.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], e.areas) {
        const w = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, w];
      }
      pe(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ue = [], vt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      Xt();
      const n = vt && vt > 0 ? vt : 3, a = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, a], [t.x, t.y, a + n]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], vt = 0, pe(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, a = vn(t.x, t.y, t.z, n);
      if (!a) {
        pe("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, c = e.points.rawVal, h = i[a.polyIdx], w = c[h[a.segIdx]], x = c[h[a.segIdx + 1]];
      if (!w || !x) {
        pe("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const M = vt && vt > 0 ? vt : 3;
      Xt();
      const k = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [w[0], w[1], w[2]], [x[0], x[1], x[2]], [x[0], x[1], x[2] + M], [w[0], w[1], w[2] + M]];
      const p = e.polylines.rawVal;
      if (e.polylines.val = [...p.slice(0, -1), ...p[p.length - 1].length > 0 ? [p[p.length - 1]] : [], [k, k + 1, k + 2, k + 3, k], []], e.areas) {
        const R = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, R];
      }
      vt = 0, pe(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${M.toFixed(2)}m`);
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
      pe(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        pe("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, a] = Ue, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const M = i.rawVal ?? i.val ?? [];
        i.val = [...M, [n[0], n[1], n[2], a[0], a[1], a[2]]];
      }
      const c = a[0] - n[0], h = a[1] - n[1], w = a[2] - n[2], x = Math.sqrt(c * c + h * h + w * w);
      pe(`\u2713 L\xEDnea auxiliar creada \u2014 L=${x.toFixed(2)}m (cyan, no FEM)`), Ue = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Us(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "chaflan") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        pe("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ue, i = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, a, i, c, 6);
      const h = Math.abs(a[0] - n[0]).toFixed(1), w = Math.abs(a[1] - n[1]).toFixed(1);
      pe(`\u2713 Losa con chaflanes dibujada \u2014 ${h}\xD7${w}m, r=${i}m, ${c} seg/chafl\xE1n`), Ue = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (D = false, Xt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, a = n.length - 1, i = n[a] ?? [];
      if (s === "line" && i.length >= 2) {
        pe(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, a]), pe("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") pe(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (s === "line") pe("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") pe("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      pe(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  g.addEventListener("click", () => Zt()), g.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && we.length >= 3) {
      t.preventDefault();
      const s = pn();
      pe(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), g.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = v(t);
    if (!o) return;
    _.setFromCamera(C, o);
    const s = ne();
    if (ae.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const c = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], h = c[c.length - 1] ?? [], w = e.points.rawVal ?? [];
        if (h.length > 0) {
          const x = w[h[h.length - 1]];
          if (x) {
            const M = !!window.__hekatanOrthoMode;
            let k = Je;
            if (!k && M) {
              const p = Math.abs(n.x - x[0]), R = Math.abs(n.y - x[1]), te = Math.abs(n.z - x[2]);
              k = p >= R && p >= te ? "x" : R >= te ? "y" : "z";
            }
            k === "x" ? n.set(n.x, x[1], x[2]) : k === "y" ? n.set(x[0], n.y, x[2]) : k === "z" && n.set(x[0], x[1], n.z);
          }
        }
      }
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const c = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0.5;
        c && h > 0 && (n.x = Math.round(n.x / h) * h, n.y = Math.round(n.y / h) * h, n.z = Math.round(n.z / h) * h);
      }
      ae.geometry.setAttribute("position", new Ct(n.toArray(), 3));
    }
    y();
  }), g.addEventListener("pointermove", (t) => {
    var _a2;
    const o = v(t);
    if (!o) return;
    _.setFromCamera(C, o);
    let s = false;
    const n = _.intersectObject(L), a = ne();
    if (n.length && a.length) {
      const i = new S(...e.points.rawVal[n[0].index]), c = new S(...a[0].point), h = i.sub(c), w = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      w.transformDirection(K.matrixWorld), Math.abs(h.dot(w)) < 1e-4 && (s = true);
    }
    ae.visible = !s;
  });
  let go = false, vo;
  g.addEventListener("pointermove", (t) => {
    var _a2;
    if (!ln) return;
    const o = v(t);
    if (!o) return;
    _.setFromCamera(C, o);
    let s = false;
    const n = _.intersectObject(L), a = ne();
    if (n.length && a.length) {
      const c = new S(...e.points.rawVal[n[0].index]), h = new S(...a[0].point), w = c.sub(h), x = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      x.transformDirection(K.matrixWorld), Math.abs(w.dot(x)) < 1e-4 && (s = true);
    }
    if (s && ln < 5 && (go = true, u.enabled = false, vo = n[0].index), !go || ln % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (vo !== void 0) {
      let c = a[0].point;
      (t.ctrlKey || t.metaKey) && (c = new S(Math.round(c.x), Math.round(c.y), Math.round(c.z))), i[vo] = c.toArray();
    }
    e.points.val = i;
  }), g.addEventListener("pointerup", () => {
    u.enabled = true, go = false;
  }), g.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = v(t);
    if (!o) return;
    _.setFromCamera(C, o);
    let s = false;
    const n = _.intersectObject(L), a = ne();
    if (n.length && a.length) {
      const h = new S(...e.points.rawVal[n[0].index]), w = new S(...a[0].point), x = h.sub(w), M = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      M.transformDirection(K.matrixWorld), Math.abs(x.dot(M)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const c = e.polylines.rawVal.map((h) => h.filter((w) => w !== n[0].index)).map((h) => h.map((w) => w > n[0].index ? w - 1 : w)).filter((h) => h.length);
    c.push([]), e.polylines.val = c;
  });
}
function $a(e, l, r) {
  const f = Math.round(14.999999999999998), m = { position: e.position.clone(), quaternion: e.quaternion.clone() }, g = setInterval(_, 1e3 / 30);
  let y = 0;
  function _() {
    y++;
    const C = y / f;
    e.position.lerpVectors(m.position, l.position, C), e.quaternion.slerpQuaternions(m.quaternion, l.quaternion, C), r && r(), y == f && clearInterval(g);
  }
}
function La(e, l, r, d) {
  const u = ua(r, e.elements, d);
  return j.derive(() => {
    u.visible = l.shellResults.val != "none";
  }), u;
}
const Ia = 6, Ao = 10, Ra = 0.012;
function Da(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ba(e, l, r, d) {
  if (!r && !d) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && r) {
    const f = r[e];
    if (f && f.has(l)) return f.get(l);
  }
  return null;
}
function Xa(e, l, r, d) {
  const u = new it(), f = new _s();
  f.setColorMap("rainbow");
  const m = new Ht(), g = j.state([]);
  return j.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const y = r.val, _ = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], C = Da(l.frameResults.val);
    if (u.children.forEach((F) => {
      F.geometry && F.geometry.dispose(), F.material && F.material.dispose();
    }), u.clear(), !C || _.length === 0 || y.length === 0) {
      g.val = [];
      return;
    }
    const v = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, K = (_c = e.deformOutputs) == null ? void 0 : _c.val, me = [], be = [];
    for (let F = 0; F < _.length; F++) {
      if (_[F].length !== 2) continue;
      const re = Ba(C, F, v, K);
      re && (me.push(re[0], re[1]), be.push({ idx: F, vals: re }));
    }
    if (me.length === 0) {
      g.val = [];
      return;
    }
    const oe = Math.min(...me), T = Math.max(...me);
    f.setMin(oe), f.setMax(T), g.val = me;
    const ne = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const F of y) for (let ee = 0; ee < 3; ee++) ne[ee] = Math.min(ne[ee], F[ee]), L[ee] = Math.max(L[ee], F[ee]);
    const ie = Math.max(L[0] - ne[0], L[1] - ne[1], L[2] - ne[2], 1) * Ra, I = [], E = [], N = [];
    let D = 0;
    for (const { idx: F, vals: ee } of be) {
      const re = _[F], ue = y[re[0]], se = y[re[1]];
      if (!ue || !se) continue;
      const B = new S(se[0] - ue[0], se[1] - ue[1], se[2] - ue[2]), ce = B.length();
      if (ce < 1e-10) continue;
      B.normalize();
      const W = Math.abs(B.y) < 0.99 ? new S(0, 1, 0) : new S(1, 0, 0), we = new S().crossVectors(B, W).normalize(), ye = new S().crossVectors(B, we).normalize(), Ee = Ao + 1, Me = Ia;
      for (let Le = 0; Le < Ee; Le++) {
        const Ke = Le / Ao, st = ue[0] + B.x * ce * Ke, mt = ue[1] + B.y * ce * Ke, P = ue[2] + B.z * ce * Ke, Y = ee[0] + (ee[1] - ee[0]) * Ke, Q = f.getColor(Y) ?? new Ht(0, 0, 0);
        m.copy(Q).convertSRGBToLinear();
        for (let G = 0; G < Me; G++) {
          const xe = G / Me * Math.PI * 2, de = Math.cos(xe), ke = Math.sin(xe);
          I.push(st + (we.x * de + ye.x * ke) * ie, mt + (we.y * de + ye.y * ke) * ie, P + (we.z * de + ye.z * ke) * ie), E.push(m.r, m.g, m.b);
        }
      }
      for (let Le = 0; Le < Ao; Le++) for (let Ke = 0; Ke < Me; Ke++) {
        const st = (Ke + 1) % Me, mt = D + Le * Me + Ke, P = D + Le * Me + st, Y = D + (Le + 1) * Me + Ke, Q = D + (Le + 1) * Me + st;
        N.push(mt, P, Q), N.push(mt, Q, Y);
      }
      D += Ee * Me;
    }
    if (I.length === 0) return;
    const z = new ze();
    z.setAttribute("position", new Ct(I, 3)), z.setAttribute("color", new Ct(E, 3)), z.setIndex(N), z.computeVertexNormals();
    const X = new ft({ vertexColors: true, side: At }), V = new lt(z, X);
    V.frustumCulled = false, u.add(V);
  }), u.__colorMapValues = g, u;
}
function Na() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ya = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Za = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Ua = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function bt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const qa = 16755200, ms = 56831, Ka = 56831, Ga = 56831, On = 65382;
function Ha(e) {
  const l = new it();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const r = new xn(1, 16, 16), d = new ft({ color: qa, transparent: true, opacity: 0.85, depthTest: false }), u = new lt(r, d);
  u.visible = false, u.renderOrder = 100, l.add(u);
  const f = new ze(), m = new ht({ color: ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), g = new Wt(f, m);
  g.visible = false, g.renderOrder = 100, l.add(g);
  const y = new ft({ color: ms, transparent: true, opacity: 0.7, depthTest: false }), _ = new lt(new ps(1, 1, 1, 12), y);
  _.visible = false, _.renderOrder = 100, l.add(_);
  const C = new ze(), v = new ft({ color: Ka, transparent: true, opacity: 0.45, side: At, depthTest: false }), K = new lt(C, v);
  K.visible = false, K.renderOrder = 100, l.add(K);
  const me = new ze(), be = new ht({ color: Ga, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), oe = new Wt(me, be);
  oe.visible = false, oe.renderOrder = 100, l.add(oe);
  const T = new ft({ color: On, transparent: true, opacity: 0.95, depthTest: false }), ne = new ft({ color: On, transparent: true, opacity: 0.85, depthTest: false }), L = new ps(1, 1, 1, 12), ae = new ft({ color: On, transparent: true, opacity: 0.55, side: At, depthTest: false }), ie = new ht({ color: On, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), I = [];
  window.__hekatanModelSelection = I;
  const E = new it();
  E.renderOrder = 101, l.add(E);
  const N = document.createElement("div");
  Object.assign(N.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), N.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(N);
  }, 0);
  function D(P) {
    const Y = e.derivedNodes.rawVal;
    return !Y || P < 0 || P >= Y.length ? null : new S(Y[P][0], Y[P][1], Y[P][2]);
  }
  function z(P, Y) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const Q = e.getActiveCamera();
    if (!Q || !e.mesh) return null;
    const G = e.rendererElm.getBoundingClientRect(), xe = P - G.left, de = Y - G.top, ke = e.derivedNodes.rawVal, fe = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!ke || !fe) return null;
    const De = /* @__PURE__ */ new Map(), Te = (qe) => {
      if (De.has(qe)) return De.get(qe);
      const Ce = D(qe);
      if (!Ce) return De.set(qe, null), null;
      const Ve = Ce.clone().project(Q), Ge = (Ve.x * 0.5 + 0.5) * G.width, Fe = (-Ve.y * 0.5 + 0.5) * G.height, ct = { x: Ge, y: Fe, z: Ve.z };
      return De.set(qe, ct), ct;
    }, He = /* @__PURE__ */ new Set();
    for (const qe of fe) if (qe) for (const Ce of qe) He.add(Ce);
    const Oe = 8;
    let Ze = -1, rt = Oe;
    for (let qe = 0; qe < ke.length; qe++) {
      if (!He.has(qe)) continue;
      const Ce = Te(qe);
      if (!Ce || Ce.z < -1 || Ce.z > 1) continue;
      const Ve = Ce.x - xe, Ge = Ce.y - de, Fe = Math.sqrt(Ve * Ve + Ge * Ge);
      Fe < rt && (rt = Fe, Ze = qe);
    }
    const Xe = Na(), he = Za[Xe.dispUnit] ?? 1e3, Pe = Ya[Xe.forceUnit] ?? 1;
    if (Ze >= 0) {
      const qe = ke[Ze];
      let Ce = `Nodo ${Ze}
(${qe[0].toFixed(3)}, ${qe[1].toFixed(3)}, ${qe[2].toFixed(3)})`;
      const Ve = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Ve == null ? void 0 : Ve.deformations) {
        const Ge = Ve.deformations.get(Ze);
        if (Ge && (Ce += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ce += `
Ux = ${bt(Ge[0] * he, 3)} ${Xe.dispUnit}`, Ce += `
Uy = ${bt(Ge[1] * he, 3)} ${Xe.dispUnit}`, Ce += `
Uz = ${bt(Ge[2] * he, 3)} ${Xe.dispUnit}`, (Math.abs(Ge[3]) > 1e-9 || Math.abs(Ge[4]) > 1e-9 || Math.abs(Ge[5]) > 1e-9) && (Ce += `
Rx = ${bt(Ge[3] * 1e3, 3)} mrad`, Ce += `
Ry = ${bt(Ge[4] * 1e3, 3)} mrad`, Ce += `
Rz = ${bt(Ge[5] * 1e3, 3)} mrad`)), Ve.reactions) {
          const Fe = Ve.reactions.get(Ze);
          Fe && (Math.abs(Fe[0]) > 1e-9 || Math.abs(Fe[1]) > 1e-9 || Math.abs(Fe[2]) > 1e-9 || Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Ce += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ce += `
Fx = ${bt(Fe[0] * Pe)} ${Xe.forceUnit}`, Ce += `
Fy = ${bt(Fe[1] * Pe)} ${Xe.forceUnit}`, Ce += `
Fz = ${bt(Fe[2] * Pe)} ${Xe.forceUnit}`, (Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Ce += `
Mx = ${bt(Fe[3] * Pe)} ${Xe.forceUnit}\xB7m`, Ce += `
My = ${bt(Fe[4] * Pe)} ${Xe.forceUnit}\xB7m`, Ce += `
Mz = ${bt(Fe[5] * Pe)} ${Xe.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ze, info: Ce };
    }
    const xt = 5;
    let Ne = -1, Je = xt, kt = "frame";
    for (let qe = 0; qe < fe.length; qe++) {
      const Ce = fe[qe];
      if (!(!Ce || Ce.length < 2)) {
        if (Ce.length === 2) {
          const Ve = Te(Ce[0]), Ge = Te(Ce[1]);
          if (!Ve || !Ge || Ve.z < -1 || Ve.z > 1 || Ge.z < -1 || Ge.z > 1) continue;
          const Fe = Wa(xe, de, Ve.x, Ve.y, Ge.x, Ge.y);
          Fe < Je && (Je = Fe, Ne = qe, kt = "frame");
        } else if (Ce.length === 3 || Ce.length === 4) {
          const Ve = [];
          let Ge = true;
          for (const Fe of Ce) {
            const ct = Te(Fe);
            if (!ct || ct.z < -1 || ct.z > 1) {
              Ge = false;
              break;
            }
            Ve.push(ct);
          }
          if (!Ge) continue;
          if (Ja(xe, de, Ve)) {
            const ct = Ve.reduce((ut, dt) => ut + dt.z, 0) / Ve.length * 1e-3;
            ct < Je && (Je = ct, Ne = qe, kt = "shell");
          }
        } else if (Ce.length === 8) {
          const Ve = [];
          let Ge = true;
          for (const Be of Ce) {
            const We = Te(Be);
            if (!We || We.z < -1 || We.z > 1) {
              Ge = false;
              break;
            }
            Ve.push(We);
          }
          if (!Ge) continue;
          const Fe = Math.min(...Ve.map((Be) => Be.x)), ct = Math.max(...Ve.map((Be) => Be.x)), ut = Math.min(...Ve.map((Be) => Be.y)), dt = Math.max(...Ve.map((Be) => Be.y));
          if (xe >= Fe && xe <= ct && de >= ut && de <= dt) {
            const We = Ve.reduce((wt, Ae) => wt + Ae.z, 0) / Ve.length * 1e-3;
            We < Je && (Je = We, Ne = qe, kt = "solid");
          }
        }
      }
    }
    if (Ne >= 0) {
      const qe = fe[Ne];
      let Ve = `${kt === "frame" ? "Frame" : kt === "shell" ? "Shell" : "Solid"} ${Ne}`;
      const Ge = (_e = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, Fe = (_g = (_f = Ge == null ? void 0 : Ge.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, Ne);
      if (Fe) {
        Fe.name && (Ve += `
  \u{1F4CB} ${Fe.name}`), Fe.shape && (Ve += `
  Shape: ${Fe.shape}`);
        const ct = /concrete|hormig|rect.*sólida/i.test(Fe.shape || ""), ut = ct ? 100 : 1e3, dt = ct ? "cm" : "mm", Be = (wt) => {
          const Ae = wt * ut;
          return Math.abs(Ae - Math.round(Ae)) < 0.05 ? `${Math.round(Ae)}` : `${Ae.toFixed(1)}`;
        }, We = [];
        if (Fe.D != null && We.push(`D=${Be(Fe.D)}`), Fe.B != null && We.push(`B=${Be(Fe.B)}`), Fe.TF != null && We.push(`TF=${Be(Fe.TF)}`), Fe.TW != null && We.push(`TW=${Be(Fe.TW)}`), Fe.t != null && We.push(`t=${Be(Fe.t)}`), We.length && (Ve += `
  Dim: ${We.join(" ")} ${dt}`), Fe.material) {
          let wt = Fe.material;
          Fe.fillMaterial && (wt += ` + FILL "${Fe.fillMaterial}"`), Ve += `
  Mat: ${wt}`;
        }
      } else {
        const ct = (_i = (_h = Ge == null ? void 0 : Ge.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, Ne), ut = (_k = (_j = Ge == null ? void 0 : Ge.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, Ne);
        ct ? (Ve += `
  ${ct}`, ut && !ct.includes(ut) && (Ve += `  (${ut})`)) : ut && (Ve += `
  Material: ${ut}`);
      }
      if (Ve += `
nodos: [${qe.join(", ")}]`, kt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const ct = e.mesh.analyzeOutputs.rawVal, ut = Ua[Xe.stressUnit] ?? 1, dt = [["bendingXX", "Mxx", Pe, `${Xe.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Pe, `${Xe.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Pe, `${Xe.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Pe, `${Xe.forceUnit}/m`], ["membraneYY", "Nyy", Pe, `${Xe.forceUnit}/m`], ["membraneXY", "Nxy", Pe, `${Xe.forceUnit}/m`], ["shearX", "Qx", Pe, `${Xe.forceUnit}/m`], ["shearY", "Qy", Pe, `${Xe.forceUnit}/m`], ["vonMises", "\u03C3VM", ut, Xe.stressUnit], ["pressure", "p", ut, Xe.stressUnit]], Be = [];
        for (const [We, wt, Ae, Mt] of dt) {
          const _t = ct == null ? void 0 : ct[We];
          if (_t && _t instanceof Map) {
            const Dt = _t.get(Ne);
            if (Dt != null) {
              if (typeof Dt == "number") Be.push(`${wt} = ${bt(Dt * Ae, 3)} ${Mt}`);
              else if (Array.isArray(Dt)) {
                let Et = Dt[0];
                for (const $t of Dt) Math.abs($t) > Math.abs(Et) && (Et = $t);
                Be.push(`${wt} = ${bt(Et * Ae, 3)} ${Mt}`);
              }
            }
          }
        }
        Be.length > 0 && (Ve += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Be.slice(0, 8).join(`
`));
      }
      if (kt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const ct = e.mesh.deformOutputs.rawVal, ut = e.mesh.elementInputs.rawVal, dt = ct == null ? void 0 : ct.deformations;
        if (dt && qe.length === 2) {
          const Be = dt.get(qe[0]), We = dt.get(qe[1]), wt = ke[qe[0]], Ae = ke[qe[1]];
          if (Be && We && wt && Ae) {
            const Mt = Ae[0] - wt[0], _t = Ae[1] - wt[1], Dt = Ae[2] - wt[2], Et = Math.sqrt(Mt * Mt + _t * _t + Dt * Dt);
            if (Et > 1e-9) {
              const $t = Mt / Et, nn = _t / Et, Ut = Dt / Et, gn = (We[0] - Be[0]) * $t + (We[1] - Be[1]) * nn + (We[2] - Be[2]) * Ut, Vt = ((_n = ut.elasticities) == null ? void 0 : _n.get(Ne)) ?? 0, on = ((_o = ut.areas) == null ? void 0 : _o.get(Ne)) ?? 0, vn = ((_p = ut.momentsOfInertiaY) == null ? void 0 : _p.get(Ne)) ?? 0, Ln = ((_q = ut.momentsOfInertiaZ) == null ? void 0 : _q.get(Ne)) ?? 0, so = ((_r = ut.torsionalConstants) == null ? void 0 : _r.get(Ne)) ?? 0, ao = ((_s2 = ut.shearModuli) == null ? void 0 : _s2.get(Ne)) ?? Vt / 2.6, sn = Vt * on * (gn / Et), In = (We[3] - Be[3]) * $t + (We[4] - Be[4]) * nn + (We[5] - Be[5]) * Ut, an = ao * so * (In / Et), Rn = We[4] - Be[4], Dn = We[5] - Be[5], bn = Vt * vn * Rn / Et, pn = Vt * Ln * Dn / Et;
              Ve += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ve += `
L = ${bt(Et, 3)} m`, Ve += `
\u0394L = ${bt(gn * he, 3)} ${Xe.dispUnit}`, Ve += `
\u03B5 = ${bt(gn / Et, 6)}`, Math.abs(sn) > 1e-6 && (Ve += `
N \u2248 ${bt(sn * Pe)} ${Xe.forceUnit}`), Math.abs(an) > 1e-6 && (Ve += `
T \u2248 ${bt(an * Pe)} ${Xe.forceUnit}\xB7m`), Math.abs(bn) > 1e-6 && (Ve += `
My \u2248 ${bt(bn * Pe)} ${Xe.forceUnit}\xB7m`), Math.abs(pn) > 1e-6 && (Ve += `
Mz \u2248 ${bt(pn * Pe)} ${Xe.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: kt, idx: Ne, info: Ve };
    }
    return null;
  }
  function X(P, Y, Q) {
    var _a2, _b, _c;
    if (u.visible = false, g.visible = false, _.visible = false, K.visible = false, oe.visible = false, !P || !e.mesh) {
      N.style.display = "none", e.render();
      return;
    }
    const G = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (P.type === "node") {
      const fe = D(P.idx);
      if (fe) {
        const De = e.derivedNodes.rawVal ?? [];
        let Te = 1;
        if (De.length >= 2) {
          let Ze = [1 / 0, 1 / 0, 1 / 0], rt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Xe of De) for (let he = 0; he < 3; he++) Xe[he] < Ze[he] && (Ze[he] = Xe[he]), Xe[he] > rt[he] && (rt[he] = Xe[he]);
          Te = Math.max(rt[0] - Ze[0], rt[1] - Ze[1], rt[2] - Ze[2], 0.1);
        }
        const He = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Oe = 0.021 * Te * He;
        u.position.copy(fe), u.scale.setScalar(Oe), u.visible = true;
      }
    } else if (P.type === "frame" && G) {
      const fe = G[P.idx], De = D(fe[0]), Te = D(fe[1]);
      if (De && Te) {
        const He = De.clone().add(Te).multiplyScalar(0.5), Oe = Te.clone().sub(De), Ze = Oe.length(), he = e.getActiveCamera().position.distanceTo(He) * 35e-4;
        _.position.copy(He);
        const Pe = new S(0, 1, 0), xt = Pe.clone().cross(Oe).normalize(), Ne = Pe.angleTo(Oe);
        _.quaternion.setFromAxisAngle(xt, Ne), _.scale.set(he, Ze, he), _.visible = true;
      }
    } else if (P.type === "shell" && G) {
      const fe = G[P.idx], De = [], Te = [];
      for (const He of fe) {
        const Oe = D(He);
        if (!Oe) return;
        De.push(Oe.x, Oe.y, Oe.z);
      }
      fe.length === 4 ? Te.push(0, 1, 2, 0, 2, 3) : fe.length === 3 && Te.push(0, 1, 2), C.setAttribute("position", new Ct(De, 3)), C.setIndex(Te), C.computeVertexNormals(), K.visible = true;
    } else if (P.type === "solid" && G) {
      const fe = G[P.idx], De = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Te = [];
      for (const [He, Oe] of De) {
        const Ze = D(fe[He]), rt = D(fe[Oe]);
        Ze && rt && Te.push(Ze.x, Ze.y, Ze.z, rt.x, rt.y, rt.z);
      }
      me.setAttribute("position", new Ct(Te, 3)), oe.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      N.style.display = "none", e.render();
      return;
    }
    N.textContent = P.info, N.style.whiteSpace = "pre-line", N.style.display = "block";
    const de = e.rendererElm.getBoundingClientRect(), ke = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? de;
    N.style.left = `${Y - ke.left}px`, N.style.top = `${Q - ke.top}px`, e.render();
  }
  let V = "", F = 0, ee = 0;
  const re = window.__hekatanHoverDebug ?? false, ue = (P) => {
    F && cancelAnimationFrame(F), F = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const Y = z(P.clientX, P.clientY);
      if (re && ee < 5) {
        const G = e.derivedNodes.rawVal, xe = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${P.clientX}, ${P.clientY}) nodes=${(G == null ? void 0 : G.length) ?? 0} elems=${(xe == null ? void 0 : xe.length) ?? 0} hover=`, Y), ee++;
      }
      const Q = Y ? `${Y.type}:${Y.idx}` : "";
      if (Q !== V) V = Q, X(Y, P.clientX, P.clientY);
      else if (Y) {
        const G = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        N.style.left = `${P.clientX - G.left}px`, N.style.top = `${P.clientY - G.top}px`;
      }
    });
  };
  let se = null;
  const B = () => {
    V = "", u.visible = false, g.visible = false, _.visible = false, K.visible = false, oe.visible = false, N.style.display = "none", e.render();
  }, ce = (P) => {
    const Y = e.rendererElm.getBoundingClientRect(), Q = P.clientX - Y.left, G = P.clientY - Y.top;
    (Q < -2 || G < -2 || Q > Y.width + 2 || G > Y.height + 2) && (se && clearTimeout(se), se = window.setTimeout(B, 200));
  }, W = () => {
    se && (clearTimeout(se), se = null);
  };
  e.rendererElm.addEventListener("pointermove", ue), e.rendererElm.addEventListener("pointerleave", ce), e.rendererElm.addEventListener("pointerenter", W);
  function we() {
    var _a2, _b, _c;
    const P = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return P === "select" || P === "none" || !P;
  }
  let ye = null;
  e.rendererElm.addEventListener("pointerdown", (P) => {
    P.button === 0 && (ye = { x: P.clientX, y: P.clientY });
  }), e.rendererElm.addEventListener("pointerup", (P) => {
    if (P.button !== 0 || !ye) return;
    const Y = P.clientX - ye.x, Q = P.clientY - ye.y;
    if (ye = null, Y * Y + Q * Q > 9 || !we()) return;
    const G = z(P.clientX, P.clientY);
    G ? (st({ type: G.type, idx: G.idx }, P.shiftKey), Ke()) : mt();
  }), window.addEventListener("keydown", (P) => {
    if (P.key !== "Escape" || !I.length) return;
    const Y = document.activeElement, Q = !!Y && (Y.id === "hk3-cmd-input" || Y.id === "hk-dyn-input") && Y.value === "";
    Y && (Y.tagName === "INPUT" || Y.tagName === "TEXTAREA" || Y.isContentEditable) && !Q || mt();
  }, { capture: true });
  function Ee() {
    for (const P of E.children.slice()) {
      E.remove(P);
      const Y = P.geometry;
      Y && Y !== r && Y !== L && Y.dispose();
    }
  }
  const Me = (P) => {
    var _a2;
    const Y = e.getActiveCamera(), Q = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return Y.isOrthographicCamera ? (Y.top - Y.bottom) / (Y.zoom || 1) / Q : 2 * Y.position.distanceTo(P) * Math.tan((Y.fov || 50) * Math.PI / 180 / 2) / Q;
  };
  function Le(P, Y) {
    var _a2, _b;
    const Q = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (P.type === "node") {
      const G = D(P.idx);
      if (!G) return;
      const xe = new lt(r, T);
      xe.position.copy(G), xe.scale.setScalar(Math.max(1e-4, 7 * Me(G))), xe.renderOrder = 101, E.add(xe);
    } else if (P.type === "frame" && Q) {
      const G = Q[P.idx], xe = D(G[0]), de = D(G[1]);
      if (!xe || !de) return;
      const ke = xe.clone().add(de).multiplyScalar(0.5), fe = de.clone().sub(xe), De = fe.length(), Te = e.getActiveCamera().position.distanceTo(ke), He = new lt(L, ne);
      He.position.copy(ke);
      const Oe = new S(0, 1, 0);
      He.quaternion.setFromAxisAngle(Oe.clone().cross(fe).normalize(), Oe.angleTo(fe)), He.scale.set(Te * 35e-4, De, Te * 35e-4), He.renderOrder = 101, E.add(He);
    } else if (P.type === "shell" && Q) {
      const G = Q[P.idx], xe = [], de = [];
      for (const De of G) {
        const Te = D(De);
        if (!Te) return;
        xe.push(Te.x, Te.y, Te.z);
      }
      G.length === 4 ? de.push(0, 1, 2, 0, 2, 3) : G.length === 3 && de.push(0, 1, 2);
      const ke = new ze();
      ke.setAttribute("position", new Ct(xe, 3)), ke.setIndex(de), ke.computeVertexNormals();
      const fe = new lt(ke, ae);
      fe.renderOrder = 101, E.add(fe);
    } else if (P.type === "solid" && Q) {
      const G = Q[P.idx], xe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], de = [];
      for (const [De, Te] of xe) {
        const He = D(G[De]), Oe = D(G[Te]);
        He && Oe && de.push(He.x, He.y, He.z, Oe.x, Oe.y, Oe.z);
      }
      const ke = new ze();
      ke.setAttribute("position", new Ct(de, 3));
      const fe = new Wt(ke, ie);
      fe.renderOrder = 101, E.add(fe);
    }
  }
  function Ke() {
    if (Ee(), !I.length || !e.mesh) {
      e.render();
      return;
    }
    const P = e.derivedNodes.rawVal ?? [];
    if (P.length >= 2) {
      const Y = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
      for (const G of P) for (let xe = 0; xe < 3; xe++) G[xe] < Y[xe] && (Y[xe] = G[xe]), G[xe] > Q[xe] && (Q[xe] = G[xe]);
      Math.max(Q[0] - Y[0], Q[1] - Y[1], Q[2] - Y[2], 0.1);
    }
    for (const Y of I) Le(Y);
    e.render();
  }
  function st(P, Y) {
    const Q = I.findIndex((G) => G.type === P.type && G.idx === P.idx);
    Q >= 0 ? I.splice(Q, 1) : Y || I.push(P), I.length && I[I.length - 1];
  }
  function mt() {
    I.length = 0, Ke();
  }
  return j.derive(() => {
    e.derivedNodes.val, I.length && Ke();
  }), l;
}
function Wa(e, l, r, d, u, f) {
  const m = u - r, g = f - d, y = m * m + g * g;
  if (y < 1e-9) {
    const be = e - r, oe = l - d;
    return Math.sqrt(be * be + oe * oe);
  }
  let _ = ((e - r) * m + (l - d) * g) / y;
  _ = Math.max(0, Math.min(1, _));
  const C = r + _ * m, v = d + _ * g, K = e - C, me = l - v;
  return Math.sqrt(K * K + me * me);
}
function Ja(e, l, r) {
  let d = false;
  for (let u = 0, f = r.length - 1; u < r.length; f = u++) {
    const m = r[u].x, g = r[u].y, y = r[f].x, _ = r[f].y;
    g > l != _ > l && e < (y - m) * (l - g) / (_ - g + 1e-12) + m && (d = !d);
  }
  return d;
}
const Oa = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Qa = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, tn = 1e-3;
function En(e, l) {
  return l === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : l === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function ja(e, l) {
  const r = Math.abs(l[0] - e[0]);
  return Math.abs(l[1] - e[1]) < tn ? { plano: "XZ", en: e[1] } : r < tn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function ei(e, l) {
  var _a2, _b;
  let r = null, d = { plano: "XZ", en: 0 };
  const u = () => {
    var _a3, _b2;
    const L = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !L || L === "none" ? null : String(L).replace(/^contour:/, "");
  }, f = (L) => {
    var _a3, _b2;
    const ae = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ie = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], I = /* @__PURE__ */ new Set();
    for (const E of ie) {
      if (E.length !== 2) continue;
      const N = ae[E[0]], D = ae[E[1]];
      if (!N || !D) continue;
      const z = En(N, L), X = En(D, L);
      Math.abs(z.fuera - X.fuera) < tn && I.add(Math.round(z.fuera * 1e3) / 1e3);
    }
    return [...I].sort((E, N) => E - N);
  };
  function m(L) {
    var _a3, _b2;
    if (L == null ? void 0 : L.plano) d = { plano: L.plano, en: L.en ?? f(L.plano)[0] ?? 0 };
    else {
      const ie = [...window.__hekatanModelSelection ?? []].reverse().find((N) => N.type === "frame"), I = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], E = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      ie && E[ie.idx] && I[E[ie.idx][0]] && I[E[ie.idx][1]] ? d = ja(I[E[ie.idx][0]], I[E[ie.idx][1]]) : d = { plano: "XZ", en: f("XZ")[0] ?? 0 };
    }
    r || g(), r.hidden = false, y();
  }
  function g() {
    r = document.createElement("div"), r.id = "hk-diagrama-2d", r.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), r.innerHTML = `
      <div class="hk-d2-bar" style="display:flex;align-items:center;gap:10px;padding:7px 10px;
           background:#141a24;border-bottom:1px solid #2f3b50;cursor:move;user-select:none">
        <b style="color:#e6c463;white-space:nowrap">\u{1F4D0} Diagrama 2D</b>
        <span class="hk-d2-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span>
        <label style="margin-left:auto;white-space:nowrap">plano
          <select class="hk-d2-plano" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px">
            <option value="XZ">Alzado XZ</option><option value="YZ">Alzado YZ</option><option value="XY">Planta XY</option>
          </select></label>
        <button class="hk-d2-ant" title="p\xF3rtico anterior" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:1px 7px">\u25C0</button>
        <select class="hk-d2-en" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"></select>
        <button class="hk-d2-sig" title="p\xF3rtico siguiente" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:1px 7px">\u25B6</button>
        <button class="hk-d2-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button>
      </div>
      <svg class="hk-d2-svg" style="flex:1;width:100%;height:100%"></svg>
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(r), r.querySelector(".hk-d2-x").addEventListener("click", () => {
      r.hidden = true;
    });
    const L = r.querySelector(".hk-d2-plano"), ae = r.querySelector(".hk-d2-en");
    L.addEventListener("change", () => {
      d = { plano: L.value, en: f(L.value)[0] ?? 0 }, y();
    }), ae.addEventListener("change", () => {
      d.en = Number(ae.value), y();
    });
    const ie = (N) => {
      const D = f(d.plano), z = D.findIndex((V) => Math.abs(V - d.en) < tn), X = Math.max(0, Math.min(D.length - 1, (z < 0 ? 0 : z) + N));
      D.length && (d.en = D[X], y());
    };
    r.querySelector(".hk-d2-ant").addEventListener("click", () => ie(-1)), r.querySelector(".hk-d2-sig").addEventListener("click", () => ie(1));
    const I = r.querySelector(".hk-d2-bar");
    let E = null;
    I.addEventListener("pointerdown", (N) => {
      if (N.target.closest("select,button")) return;
      const D = r.getBoundingClientRect();
      E = { x: N.clientX, y: N.clientY, l: D.left, t: D.top }, r.style.transform = "none", r.style.left = D.left + "px", r.style.top = D.top + "px";
    }), window.addEventListener("pointermove", (N) => {
      !E || !r || (r.style.left = E.l + N.clientX - E.x + "px", r.style.top = E.t + N.clientY - E.y + "px");
    }), window.addEventListener("pointerup", () => {
      E = null;
    }), new ResizeObserver(() => {
      r && !r.hidden && y();
    }).observe(r);
  }
  function y() {
    var _a3, _b2, _c, _d, _e, _f, _g, _h;
    if (!r || r.hidden) return;
    const L = new Set(v && !v.hidden && K >= 0 ? be(K) : []), ae = r.querySelector(".hk-d2-svg"), ie = r.querySelector(".hk-d2-tit"), I = r.querySelector(".hk-d2-pie"), E = r.querySelector(".hk-d2-plano"), N = r.querySelector(".hk-d2-en");
    E.value = d.plano;
    const D = f(d.plano), z = d.plano === "XZ" ? "y" : d.plano === "YZ" ? "x" : "z", X = d.plano === "XY" ? "Planta" : "P\xF3rtico";
    N.innerHTML = D.map((he, Pe) => `<option value="${he}" ${Math.abs(he - d.en) < tn ? "selected" : ""}>${X} ${Pe + 1} \xB7 ${z} = ${he.toFixed(2)} m</option>`).join("");
    const V = u(), F = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ee = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], re = V ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[V] : null;
    ae.innerHTML = "";
    const ue = ae.clientWidth || 880, se = ae.clientHeight || 480, B = [];
    if (ee.forEach((he, Pe) => {
      if (he.length !== 2) return;
      const xt = F[he[0]], Ne = F[he[1]];
      if (!xt || !Ne) return;
      const Je = En(xt, d.plano), kt = En(Ne, d.plano);
      Math.abs(Je.fuera - d.en) < tn && Math.abs(kt.fuera - d.en) < tn && B.push({ i: Pe, a: Je, b: kt });
    }), !B.length) {
      I.textContent = "No hay barras en este plano.", ie.textContent = "";
      return;
    }
    let ce = 1 / 0, W = -1 / 0, we = 1 / 0, ye = -1 / 0;
    for (const he of B) for (const Pe of [he.a, he.b]) ce = Math.min(ce, Pe.u), W = Math.max(W, Pe.u), we = Math.min(we, Pe.v), ye = Math.max(ye, Pe.v);
    const Ee = W - ce || 1, Me = ye - we || 1, Le = 0.12 * Math.max(Ee, Me), Ke = 46, st = Math.min((ue - 2 * Ke) / (Ee + 2 * Le), (se - 2 * Ke) / (Me + 2 * Le)), mt = (ue - Ee * st) / 2, P = (se - Me * st) / 2, Y = (he) => mt + (he - ce) * st, Q = (he) => se - (P + (he - we) * st), G = "http://www.w3.org/2000/svg", xe = (he, Pe, xt) => {
      const Ne = document.createElementNS(G, he);
      for (const Je in Pe) Ne.setAttribute(Je, String(Pe[Je]));
      return xt != null && (Ne.textContent = xt), ae.appendChild(Ne), Ne;
    }, de = /* @__PURE__ */ new Map();
    for (const he of B) {
      const Pe = ((_h = (_g = (_f = (_e = e.elementInputs) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, he.i)) ?? 0, xt = En(zs(V ?? "normals", Cs(F[ee[he.i][0]], F[ee[he.i][1]], Pe)), d.plano), Ne = Math.hypot(xt.u, xt.v);
      de.set(he.i, Ne > 0.3 ? [xt.u / Ne, -xt.v / Ne] : null);
    }
    const ke = B.filter((he) => !de.get(he.i)).length;
    let fe = 0;
    if (re) for (const he of B) {
      if (!de.get(he.i)) continue;
      const Pe = re instanceof Map ? re.get(he.i) : re[he.i];
      Pe && (fe = Math.max(fe, Math.abs(Pe[0] ?? 0), Math.abs(Pe[1] ?? 0)));
    }
    const De = 0.12 * Math.max(Ee, Me) * st, Te = fe > 0 ? De / fe : 0, He = V === "bendingsY" || V === "bendingsZ", Oe = (he) => Math.abs(he) >= 100 ? he.toFixed(1) : Math.abs(he) >= 10 ? he.toFixed(2) : he.toFixed(3), Ze = [];
    for (const he of B) {
      const Pe = Y(he.a.u), xt = Q(he.a.v), Ne = Y(he.b.u), Je = Q(he.b.v), kt = de.get(he.i), [qe, Ce] = kt ?? [0, 0], Ve = re && kt ? re instanceof Map ? re.get(he.i) : re[he.i] : null, [Ge, Fe] = Ve ? Vo(V, Ve) : [0, 0];
      if (Ve && Te > 0) {
        const Be = [Pe + qe * Ge * Te * 1, xt + Ce * Ge * Te * 1], We = [Ne + qe * Fe * Te * 1, Je + Ce * Fe * Te * 1], Mt = Ge + Fe >= 0 ? "#3fa7d6" : "#d9534f";
        xe("polygon", { points: `${Pe},${xt} ${Be[0]},${Be[1]} ${We[0]},${We[1]} ${Ne},${Je}`, fill: Mt, "fill-opacity": 0.38, stroke: Mt, "stroke-width": 1.2 }), Ze.push({ x: Be[0] + qe * 12, y: Be[1] + Ce * 12, t: Oe(Ge), peso: Math.abs(Ge) }), Ze.push({ x: We[0] + qe * 12, y: We[1] + Ce * 12, t: Oe(Fe), peso: Math.abs(Fe) });
      }
      xe("line", { x1: Pe, y1: xt, x2: Ne, y2: Je, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), L.has(he.i) && xe("line", { x1: Pe, y1: xt, x2: Ne, y2: Je, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const ct = xe("line", { x1: Pe, y1: xt, x2: Ne, y2: Je, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      ct.addEventListener("click", () => oe(he.i));
      const ut = document.createElementNS(G, "title");
      ut.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", ct.appendChild(ut);
    }
    for (const he of B) for (const Pe of [he.a, he.b]) d.plano !== "XY" && Math.abs(Pe.v - we) < tn && xe("rect", { x: Y(Pe.u) - 6, y: Q(Pe.v), width: 12, height: 7, fill: "#b03a3a" });
    const rt = [];
    Ze.sort((he, Pe) => Pe.peso - he.peso);
    for (const he of Ze) he.peso < 0.02 * fe || rt.some((Pe) => Math.hypot(Pe.x - he.x, Pe.y - he.y) < 34) || (rt.push(he), xe("text", { x: he.x, y: he.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, he.t));
    const Xe = V ? Oa[V] ?? V : "sin resultado";
    ie.textContent = `${Xe} \xB7 ${d.plano === "XY" ? "planta" : "alzado"} ${d.plano} en ${z} = ${d.en.toFixed(2)} m`, I.textContent = V ? `${B.length} barras en el plano \xB7 m\xE1ximo ${Oe(fe)} ${Qa[V] ?? ""}` + (He ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ke ? ` \xB7 ${ke} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const _ = () => {
    try {
      y();
    } catch {
    }
  };
  (l == null ? void 0 : l.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    l.frameResults.val, _();
  }));
  let C = null;
  setInterval(() => {
    var _a3, _b2;
    const L = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, ae = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, ie = [L, ae];
    if (!(C && C[0] === L && C[1] === ae)) {
      C = ie, _();
      try {
        ne();
      } catch {
      }
    }
  }, 400);
  let v = null, K = -1, me = "12";
  function be(L) {
    var _a3, _b2;
    const ae = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ie = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], I = /* @__PURE__ */ new Map();
    ie.forEach((z, X) => {
      if (z.length === 2) for (const V of z) I.has(V) || I.set(V, []), I.get(V).push(X);
    });
    const E = (z) => {
      const X = ae[ie[z][0]], V = ae[ie[z][1]], F = [V[0] - X[0], V[1] - X[1], V[2] - X[2]], ee = Math.hypot(F[0], F[1], F[2]) || 1;
      return F.map((re) => re / ee);
    }, N = (z, X) => {
      const V = E(z), F = E(X);
      return Math.abs(V[0] * F[0] + V[1] * F[1] + V[2] * F[2]) > 0.9999;
    }, D = [L];
    for (const z of [0, 1]) {
      let X = L, V = ie[L][z];
      for (let F = 0; F < 500; F++) {
        const ee = (I.get(V) ?? []).filter((ue) => ue !== X);
        if (ee.length !== 1 || !N(X, ee[0])) break;
        const re = ee[0];
        z === 0 ? D.unshift(re) : D.push(re), V = ie[re][0] === V ? ie[re][1] : ie[re][0], X = re;
      }
    }
    return D;
  }
  function oe(L) {
    if (L == null) {
      const ie = [...window.__hekatanModelSelection ?? []].reverse().find((I) => I.type === "frame");
      if (!ie) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      L = ie.idx;
    }
    K = L, v || (v = document.createElement("div"), v.id = "hk-diagrama-barra", v.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), v.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(v), v.querySelector(".hk-b-x").addEventListener("click", () => {
      v.hidden = true, T(), y();
    }), v.querySelector(".hk-b-pl").addEventListener("change", (ae) => {
      me = ae.target.value, ne();
    })), v.hidden = false, T(), ne(), y();
  }
  function T() {
    if (!r || !v) return;
    const L = window.innerWidth, ae = Math.min(560, Math.round(L * 0.4));
    v.style.width = ae + "px", !v.hidden && !r.hidden ? (r.style.transform = "none", r.style.left = "12px", r.style.width = L - ae - 36 + "px", v.style.top = r.getBoundingClientRect().top + "px") : r.hidden || (r.style.left = "50%", r.style.transform = "translateX(-50%)", r.style.width = "min(900px,92vw)");
  }
  function ne() {
    var _a3, _b2, _c;
    if (!v || v.hidden || K < 0) return;
    const L = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ae = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], ie = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!ae[K]) return;
    const I = be(K), E = [];
    let N = 0, D = -1;
    I.forEach((W, we) => {
      const [ye, Ee] = ae[W], Me = we === 0 ? I.length > 1 && ae[I[1]].includes(ye) : ye !== D, Le = Me ? Ee : ye, Ke = Me ? ye : Ee, st = Math.hypot(L[Ke][0] - L[Le][0], L[Ke][1] - L[Le][1], L[Ke][2] - L[Le][2]);
      E.push({ x: N, e: W, fin: Me ? 1 : 0 }), N += st, E.push({ x: N, e: W, fin: Me ? 0 : 1 }), D = Ke;
    });
    const z = N, X = (W, we) => {
      const ye = ie[W], Ee = ye ? ye instanceof Map ? ye.get(we.e) : ye[we.e] : null;
      return Ee ? Vo(W, Ee)[we.fin] : 0;
    }, V = L[ae[I[0]][0]], F = (W) => W.toFixed(2);
    v.querySelector(".hk-b-tit").textContent = "L = " + z.toFixed(2) + " m \xB7 " + I.length + " tramo(s) \xB7 desde (" + F(V[0]) + ", " + F(V[1]) + ", " + F(V[2]) + ")";
    const ee = me === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], re = v.querySelector(".hk-b-cuerpo");
    re.innerHTML = "";
    const ue = Math.max(300, re.clientWidth), se = 124, B = 46, ce = (se - 14) / 2;
    for (const [W, we, ye, Ee] of ee) {
      const Me = E.map((fe) => X(W, fe)), Le = Math.max(...Me), Ke = Math.min(...Me), st = Math.max(Math.abs(Le), Math.abs(Ke)) || 1, mt = (fe) => B + fe / (z || 1) * (ue - 2 * B), P = (fe) => ce + (Ee ? 1 : -1) * (fe / st) * (ce - 16), Y = (fe) => Math.abs(fe) >= 100 ? fe.toFixed(1) : Math.abs(fe) >= 10 ? fe.toFixed(2) : fe.toFixed(3);
      let Q = mt(0) + "," + ce + " ";
      E.forEach((fe, De) => {
        Q += mt(fe.x) + "," + P(Me[De]) + " ";
      }), Q += mt(z) + "," + ce;
      const G = Me.indexOf(Le), xe = Me.indexOf(Ke), de = (fe, De) => {
        const Te = P(Me[fe]) + (P(Me[fe]) < ce ? -5 : 13);
        return '<text x="' + mt(E[fe].x) + '" y="' + Te + '" text-anchor="middle" fill="' + De + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Y(Me[fe]) + "</text>";
      }, ke = Ee ? "#d9534f" : "#3fa7d6";
      re.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + we + ' <span style="color:#6f7d90;font-weight:400">(' + ye + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Y(Le) + " \xB7 m\xEDn " + Y(Ke) + (Ee ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + ue + '" height="' + se + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + B + '" y1="' + ce + '" x2="' + (ue - B) + '" y2="' + ce + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Q + '" fill="' + ke + '" fill-opacity=".35" stroke="' + ke + '" stroke-width="1.4"/>' + de(0, "#f2f5fa") + de(E.length - 1, "#f2f5fa") + (G > 0 && G < E.length - 1 ? de(G, "#8fd3ff") : "") + (xe > 0 && xe < E.length - 1 && xe !== G ? de(xe, "#ff9f9a") : "") + '<text x="' + B + '" y="' + (se - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (ue - B) + '" y="' + (se - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + z.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = oe, window.__hekatanDiagrama2D = m, { abrir: m, abrirBarra: oe };
}
function ws(e, l = 8) {
  const r = document.createElement("div");
  r.id = "legend", r.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    j.derive(() => {
      oo.val, r.style.background = pa();
    });
  });
  const d = document.createElement("div");
  d.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", r.appendChild(d), setTimeout(() => {
    j.derive(() => {
      d.textContent = To.val ? `[${To.val}]` : "";
    });
  });
  const u = Array.from({ length: l + 1 }, (y, _) => _ / l).reverse();
  let f, m;
  u.forEach((y, _) => {
    f = document.createElement("div"), f.id = `marker-${_}`, f.className = "marker", f.style.marginTop = _ == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", m = document.createElement("p"), m.id = `marker-text-${_}`, f.append(m), r.append(f);
  });
  const g = [];
  return r.querySelectorAll("p").forEach((y) => g.push(y)), setTimeout(() => {
    j.derive(() => {
      u.forEach((y, _) => {
        const C = g[_];
        C && (C.innerText = ti(e.val, y).toString());
      });
    });
  }), r;
}
function ti(e, l) {
  const r = $n.val;
  if (r) return ys(r[0] + l * (r[1] - r[0]));
  const d = e.filter((m) => Number.isFinite(m));
  if (d.length === 0) return "0";
  const [u, f] = $o(d);
  return ys(u + l * (f - u));
}
function ys(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function fi({ mesh: e, settingsObj: l, drawingObj: r, objects3D: d, solids: u }) {
  ra.DEFAULT_UP = new S(0, 0, 1);
  const f = document.createElement("div"), m = new sa(), g = new aa(45, 1, 0.1, 2 * 1e6), y = new ia(-10, 10, 10, -10, -1e3, 2e6);
  let _ = g;
  const C = new la({ antialias: true });
  C.localClippingEnabled = true;
  const v = new us(g, C.domElement);
  v.enableDamping = true, v.dampingFactor = 0.1, v.screenSpacePanning = true, v.zoomSpeed = 0.8, v.panSpeed = 1.2, v.rotateSpeed = 0.9, v.keyPanSpeed = 12, v.listenToKeyEvents(window), v.touches = { ONE: Wn.ROTATE, TWO: Wn.DOLLY_PAN }, C.domElement.addEventListener("wheel", (P) => {
    if (!P.ctrlKey && Math.abs(P.deltaX) > Math.abs(P.deltaY) * 1.5) {
      P.preventDefault();
      const Y = v.target, Q = new S().subVectors(g.position, Y), G = new S();
      G.crossVectors(g.up, Q).normalize();
      const de = Q.length() * 1e-3 * v.panSpeed;
      Y.addScaledVector(G, P.deltaX * de), g.position.addScaledVector(G, P.deltaX * de), v.update();
    }
  }, { passive: false });
  const K = new Po(new S(-1, 0, 0), 0), me = new Po(new S(0, -1, 0), 0), be = new Po(new S(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function oe() {
    const P = window.__hekatanClip, Y = [];
    P.enableX && (K.normal.set(P.invertX ? 1 : -1, 0, 0), K.constant = P.invertX ? -P.posX : P.posX, Y.push(K)), P.enableY && (me.normal.set(0, P.invertY ? 1 : -1, 0), me.constant = P.invertY ? -P.posY : P.posY, Y.push(me)), P.enableZ && (be.normal.set(0, 0, P.invertZ ? 1 : -1), be.constant = P.invertZ ? -P.posZ : P.posZ, Y.push(be)), C.clippingPlanes = Y, m.traverse((G) => {
      const xe = G;
      if (xe.material) {
        const de = Array.isArray(xe.material) ? xe.material : [xe.material];
        for (const ke of de) ke.clippingPlanes = Y, ke.needsUpdate = true;
      }
    });
    const Q = window.__hekatanPanes ?? [];
    for (const G of Q) try {
      G && typeof G.refresh == "function" && G.refresh();
    } catch {
    }
    C.render(m, _);
  }
  oe(), window.__hekatanClipApply = oe;
  const T = ha(l), ne = j.derive(() => Math.pow(10, T.displayScale.val / 10)), L = ni(e, T), ae = () => {
    const P = [];
    return T.gridXY.rawVal && P.push("xy"), T.gridXZ.rawVal && P.push("xz"), T.gridYZ.rawVal && P.push("yz"), P;
  }, ie = () => {
    const P = T.gridStep.rawVal, Y = Math.max(P, T.gridMajor.rawVal);
    return { planes: ae(), majorStep: Y, minorStep: P };
  };
  let I = zo(T.gridSize.rawVal, ie());
  I.visible = T.gridVisible.rawVal, window.__hekatanSnap2D = T.cursorSnap.rawVal;
  const E = () => {
    const P = Math.max(0, Math.min(1, T.gridOpacity.rawVal));
    I.traverse((Y) => {
      const Q = Y.material;
      if (!Q || !("opacity" in Q)) return;
      const G = Y.name ?? "";
      let xe = 0.55;
      G.includes("border") ? xe = 1 : G.includes("major") && (xe = 0.95), Q.opacity = P * xe;
    });
  };
  E(), f.appendChild(fa(T, e, u)), f.setAttribute("id", "viewer"), f.appendChild(C.domElement), C.setPixelRatio(window.devicePixelRatio);
  const N = dn();
  C.setClearColor(N.background, 1);
  const D = T.gridSize.rawVal, z = D * 0.5 + D * 0.5 / Math.tan(45 * 0.5);
  g.position.set(0, 0, z), g.up.set(0, 1, 0), v.target.set(0, 0, 0), v.minDistance = 0.1, v.maxDistance = 1e4, f.__settings = T, v.zoomSpeed = 1, v._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, v.update();
  let X = hs(T.gridSize.rawVal, T.flipAxes.rawVal);
  m.add(I, X), j.derive(() => {
    window.__hekatanGridPlaneXY = T.gridXY.val, window.__hekatanGridPlaneXZ = T.gridXZ.val, window.__hekatanGridPlaneYZ = T.gridYZ.val;
  });
  let V = true;
  j.derive(() => {
    const P = T.gridVisible.val;
    if (V) {
      V = false;
      return;
    }
    I.visible = P, W();
  });
  let F = true;
  j.derive(() => {
    if (T.gridOpacity.val, F) {
      F = false;
      return;
    }
    E(), W();
  }), j.derive(() => {
    const P = T.cursorSnap.val;
    window.__hekatanSnap2D = P;
  });
  let ee = true;
  j.derive(() => {
    var _a2, _b, _c;
    const P = T.gridSize.val, Y = T.flipAxes.val;
    if (T.gridXY.val, T.gridXZ.val, T.gridYZ.val, T.gridStep.val, T.gridMajor.val, ee) {
      ee = false;
      return;
    }
    m.remove(I), (_a2 = I.traverse) == null ? void 0 : _a2.call(I, (de) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = de.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = de.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), I = zo(P, ie()), I.visible = T.gridVisible.rawVal, m.add(I), E(), m.remove(X), X.traverse((de) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = de.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = de.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), X = hs(P, Y), m.add(X);
    const Q = P * 0.5 + P * 0.5 / Math.tan(45 * 0.5);
    g.position.distanceTo(v.target);
    const G = Math.abs(g.position.x) < 0.1 && Math.abs(g.position.y) < 0.1 && g.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (G ? g.position.set(0, 0, Q) : g.position.set(0.5 * P, -Q, 0.5 * P), v.target.set(0, 0, 0)), v.minDistance = Math.max(0.05, P * 0.01), v.maxDistance = Math.max(50, P * 50), v.update(), W();
  }), new ResizeObserver((P) => {
    var _a2, _b;
    for (const Y of P) {
      const Q = (_a2 = Y.target) == null ? void 0 : _a2.clientWidth, G = (_b = Y.target) == null ? void 0 : _b.clientHeight;
      if (Q === 0 || G === 0) continue;
      const de = (ue ? Q / 2 : Q) / G;
      g.aspect = de, g.updateProjectionMatrix();
      const ke = y.top;
      if (y.left = -ke * de, y.right = ke * de, y.updateProjectionMatrix(), se && se.isPerspectiveCamera) se.aspect = de, se.updateProjectionMatrix();
      else if (se && se.isOrthographicCamera) {
        const fe = se, De = fe.top;
        fe.left = -De * de, fe.right = De * de, fe.updateProjectionMatrix();
      }
      C.setSize(Q, G), W();
    }
  }).observe(f), v.addEventListener("change", W), j.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, T.displayScale.val, T.nodes.val, T.elements.val, (_g = T.edges) == null ? void 0 : _g.val, T.elemColumns.val, T.elemBeams.val, T.nodesIndexes.val, T.elementsIndexes.val, T.orientations.val, T.sections.val, T.secColumns.val, T.secBeams.val, T.secFloor.val, T.supports.val, T.loads.val, T.deformedShape.val, T.nodeResults.val, T.frameResults.val, T.shellResults.val, (_h = T.solidResults) == null ? void 0 : _h.val, (_i = T.extruded) == null ? void 0 : _i.val, setTimeout(W);
  });
  let ue = false, se = null, B = null, ce = false;
  function W() {
    const P = f.clientWidth || 1, Y = f.clientHeight || 1;
    if (!ue || !se) {
      C.setScissorTest(false), C.setViewport(0, 0, P, Y), C.render(m, _);
      return;
    }
    const Q = P / 2;
    C.setScissorTest(true), C.setViewport(0, 0, Q, Y), C.setScissor(0, 0, Q, Y), C.render(m, _), C.setViewport(Q, 0, Q, Y), C.setScissor(Q, 0, Q, Y), C.render(m, se), C.setScissorTest(false);
  }
  function we(P) {
    _ = P, v.object = P, v.update(), W();
  }
  function ye(P, Y) {
    ue = P, Y && (se = Y);
    const Q = f.clientWidth || 1, G = f.clientHeight || 1, de = (P ? Q / 2 : Q) / G;
    g.isPerspectiveCamera && (g.aspect = de, g.updateProjectionMatrix());
    const ke = y.top;
    if (y.left = -ke * de, y.right = ke * de, y.updateProjectionMatrix(), P && se) {
      if (B ? (B.object = se, B.update()) : (B = new us(se, C.domElement), B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.touches = { ONE: Wn.ROTATE, TWO: Wn.DOLLY_PAN }, B.target.copy(v.target), B.addEventListener("change", W), B.enabled = false), !ce) {
        const fe = (De) => {
          if (!ue || !B) return;
          const Te = C.domElement.getBoundingClientRect(), He = De.clientX - Te.left, Oe = Te.width / 2, Ze = He >= Oe;
          v.enabled = !Ze, B.enabled = Ze;
        };
        C.domElement.addEventListener("pointerdown", fe, true), C.domElement.addEventListener("wheel", fe, { capture: true, passive: true }), ce = true;
      }
    } else P || (v.enabled = true, B && (B.enabled = false));
    f.__splitMode = P, window.__hekatanSplitMode = P, window.__hekatanSplitCamera = P ? se : null, W();
  }
  if (e) {
    m.add(ma(T, L, ne), ca(e, T, L), xa(T, L, ne), ga(e, T, L, ne), wa(e, T, L, ne), ya(e, T, L, ne), Ma(e, T, L, ne), ka(e, T, L, ne), za(e, T, L), Va(e, T, L, ne), Fa(e, T, L, ne)), window.__hekatanDiagrama2D || (ei(e, T), C.domElement.addEventListener("dblclick", () => {
      var _a2;
      const fe = (_a2 = T.frameResults) == null ? void 0 : _a2.rawVal;
      !fe || fe === "none" || !(window.__hekatanModelSelection ?? []).some((Te) => Te.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const P = Ha({ scene: m, rendererElm: C.domElement, getActiveCamera: () => _, derivedNodes: L, derivedDisplayScale: ne, mesh: e, settings: T, render: W });
    m.add(P);
    const Y = ri(e, T), Q = La(e, T, L, Y), G = ws(Y);
    m.add(Q), f.appendChild(G);
    const xe = Xa(e, T, L);
    m.add(xe);
    const de = xe.__colorMapValues, ke = ws(de);
    ke.id = "frame-legend", f.appendChild(ke), j.derive(() => {
      var _a2;
      const fe = T.shellResults.val != "none", De = (((_a2 = T.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Te = fe || De, He = T.frameResults.val.startsWith("contour:"), Oe = Y.val.some((Ze) => Number.isFinite(Ze));
      G.hidden = !Te || !Oe, Q.visible = Te, ke.hidden = !He;
    });
  }
  if (u) {
    const P = new bs(16777215, 0.5);
    m.add(P);
    const Y = new to(16777215, 0.5);
    Y.position.set(30, 25, -10), Y.shadow.mapSize.width = 1024, Y.shadow.mapSize.height = 1024, m.add(Y);
    const Q = 10;
    Y.shadow.camera.left = -Q, Y.shadow.camera.right = Q, Y.shadow.camera.top = Q, Y.shadow.camera.bottom = -Q, Y.shadow.camera.far = 1e3;
    const G = new to(16777215, 0.5);
    G.color.setHSL(11, 43, 96), G.position.set(-10, 0, 30), m.add(G), j.derive(() => {
      (u == null ? void 0 : u.val.length) && (m.remove(...u.oldVal), m.add(...u.rawVal), W());
    }), j.derive(() => {
      u.rawVal.forEach((xe) => xe.visible = T.solids.val), W();
    });
  }
  if (d) {
    const P = [], Y = (G) => {
      var _a2;
      return ((_a2 = G == null ? void 0 : G.userData) == null ? void 0 : _a2.isCota) ? T.showCotas.val : T.custom3D.val;
    }, Q = () => {
      for (const G of P) G.visible = Y(G);
      W();
    };
    j.derive(() => {
      const G = d.val;
      P.length && (m.remove(...P), P.length = 0), G.length && (m.add(...G), P.push(...G), Q()), W();
    }), j.derive(() => {
      T.custom3D.val, Q();
    }), j.derive(() => {
      T.showCotas.val, Q();
    });
  }
  r && Ta({ drawingObj: r, gridObj: I, scene: m, getActiveCamera: () => _, controls: v, gridSize: D, derivedDisplayScale: ne, rendererElm: C.domElement, viewerRender: W }), gs((P, Y) => {
    var _a2;
    C.setClearColor(Y.background, 1), m.remove(I), (_a2 = I.traverse) == null ? void 0 : _a2.call(I, (Q) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Q.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Q.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), I = zo(T.gridSize.rawVal, { planes: ae() }), m.add(I), f.style.setProperty("--awatif-legend-color", Y.legendMarker), W();
  });
  const Ee = { scene: m, perspCamera: g, orthoCamera: y, get camera() {
    return _;
  }, controls: v, renderer: C, rendererElm: C.domElement, render: W, setActiveCamera: we, setSplitMode: ye, get splitMode() {
    return ue;
  }, get splitCamera() {
    return se;
  }, settings: T };
  f.__ctx = Ee;
  const Me = document.createElement("div");
  Me.id = "hk-nav-camara", Me.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Le = (P, Y, Q) => {
    const G = document.createElement("button");
    return G.textContent = P, G.title = Y, G.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), G.onmouseenter = () => {
      G.style.background = "rgba(70,70,70,0.9)";
    }, G.onmouseleave = () => {
      G.style.background = "rgba(40,40,40,0.85)";
    }, G.onclick = (xe) => {
      xe.preventDefault(), Q();
    }, G;
  }, Ke = (P, Y) => {
    const Q = v.target, G = new S().subVectors(_.position, Q), xe = G.length(), de = new S(), ke = new S();
    de.crossVectors(_.up, G).normalize(), ke.copy(_.up).normalize();
    const fe = xe * 0.05;
    Q.addScaledVector(de, -P * fe), Q.addScaledVector(ke, Y * fe), _.position.addScaledVector(de, -P * fe), _.position.addScaledVector(ke, Y * fe), v.update(), W();
  }, st = (P) => {
    const Y = new S().subVectors(_.position, v.target);
    Y.multiplyScalar(P), _.position.copy(v.target).add(Y), v.update(), W();
  }, mt = () => {
    const P = document.createElement("div");
    return P.style.cssText = "width:32px;height:32px;", P;
  };
  return Me.append(mt()), Me.append(Le("\u2191", "Pan arriba", () => Ke(0, 1))), Me.append(Le("\u2295", "Zoom in", () => st(0.85))), Me.append(Le("\u2190", "Pan izquierda", () => Ke(-1, 0))), Me.append(Le("\u2302", "Reset vista", () => {
    v.reset(), W();
  })), Me.append(Le("\u2192", "Pan derecha", () => Ke(1, 0))), Me.append(Le("\u2296", "Zoom out", () => st(1.18))), Me.append(Le("\u2193", "Pan abajo", () => Ke(0, -1))), Me.append(mt()), getComputedStyle(f).position === "static" && (f.style.position = "relative"), f.appendChild(Me), f;
}
function ni(e, l) {
  return j.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const r = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], d = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!d || r.length === 0) return r;
    const u = l.deformScale.val, f = l.deformScale.val * l.deformScaleZ.val, m = Number.isFinite(u) ? u : 1, g = Number.isFinite(f) ? f : 1;
    return r.map((y, _) => {
      var _a3;
      const C = ((_a3 = d.get(_)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], v = Number.isFinite(C[0]) ? C[0] : 0, K = Number.isFinite(C[1]) ? C[1] : 0, me = Number.isFinite(C[2]) ? C[2] : 0;
      return [y[0] + v * m, y[1] + K * m, y[2] + me * g];
    });
  });
}
const $n = j.state(null), To = j.state(""), oi = j.state("kN"), si = j.state("mm"), ai = j.state("kN/m\xB2"), ii = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, xs = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, li = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ri(e, l) {
  const r = j.state([]);
  let d;
  return ((u) => {
    u.bendingXX = "bendingXX", u.bendingYY = "bendingYY", u.bendingXY = "bendingXY", u.membraneXX = "membraneXX", u.membraneYY = "membraneYY", u.membraneXY = "membraneXY", u.tranverseShearX = "tranverseShearX", u.tranverseShearY = "tranverseShearY", u.membranePrincipalMax = "membranePrincipalMax", u.membranePrincipalMin = "membranePrincipalMin", u.bendingPrincipalMax = "bendingPrincipalMax", u.bendingPrincipalMin = "bendingPrincipalMin", u.transverseShearMax = "transverseShearMax", u.vonMises = "vonMises", u.pressure = "pressure", u.displacementX = "displacementX", u.displacementY = "displacementY", u.displacementZ = "displacementZ";
  })(d || (d = {})), j.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const u = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map(), be = (Y, Q) => {
      Y == null ? void 0 : Y.forEach((G, xe) => {
        const de = e.elements.val[xe];
        if (de) for (let ke = 0; ke < de.length; ke++) Q.set(de[ke], [G[ke] ?? G[0]]);
      });
    };
    be((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, u), be((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, f), be((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, m), be((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, g), be((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, y), be((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, _), be((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, C), be((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, v), be((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, K), be((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, me);
    const oe = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ie = (Y, Q, G, xe, de) => {
      Y.forEach((ke, fe) => {
        var _a3, _b2;
        const De = ke[0] ?? 0, Te = ((_a3 = Q.get(fe)) == null ? void 0 : _a3[0]) ?? 0, He = ((_b2 = G.get(fe)) == null ? void 0 : _b2[0]) ?? 0, Oe = (De + Te) / 2, Ze = Math.hypot((De - Te) / 2, He);
        xe.set(fe, [Oe + Ze]), de.set(fe, [Oe - Ze]);
      });
    };
    ie(g, y, _, oe, T), ie(u, f, m, ne, L), C.forEach((Y, Q) => {
      var _a3;
      ae.set(Q, [Math.hypot(Y[0] ?? 0, ((_a3 = v.get(Q)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const I = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, E = (_w = l.solidResults) == null ? void 0 : _w.val, D = E && E !== "none" ? E : l.shellResults.val, z = I == null ? void 0 : I[D], X = { bendingXX: [u, 0], bendingYY: [f, 0], bendingXY: [m, 0], membraneXX: [g, 0], membraneYY: [y, 0], membraneXY: [_, 0], tranverseShearX: [C, 0], tranverseShearY: [v, 0], membranePrincipalMax: [oe, 0], membranePrincipalMin: [T, 0], bendingPrincipalMax: [ne, 0], bendingPrincipalMin: [L, 0], transverseShearMax: [ae, 0], vonMises: [K, 0], pressure: [me, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, V = l.shellResults.val, F = oi.val, ee = si.val, re = V === "displacementX" || V === "displacementY" || V === "displacementZ", ue = V === "bendingXX" || V === "bendingYY" || V === "bendingXY" || V === "bendingPrincipalMax" || V === "bendingPrincipalMin", se = V === "membraneXX" || V === "membraneYY" || V === "membraneXY" || V === "membranePrincipalMax" || V === "membranePrincipalMin", B = V === "vonMises" || V === "pressure", ce = V === "tranverseShearX" || V === "tranverseShearY" || V === "transverseShearMax", W = (_D = l.solidResults) == null ? void 0 : _D.val, we = W === "vonMises" || W === "sigmaXX" || W === "sigmaYY" || W === "sigmaZZ" || W === "tauXY" || W === "tauYZ" || W === "tauXZ", ye = W === "ux" || W === "uy" || W === "uz", Ee = ai.val, Me = we ? li[Ee] : ye || re ? xs[ee] : ue || se || B || ce ? 1 / ii[F] : 1, Le = we ? Ee : ye || re ? ee : ue ? `${F}\xB7m/m` : se ? `${F}/m\xB2` : B ? `${F}/m\xB2` : ce ? `${F}/m` : "";
    To.val = Le, $n.val = Array.isArray(z) && z.length === 2 ? [z[0] * Me, z[1] * Me] : null;
    const Ke = Ss.val, mt = W && W !== "none" ? [K, 0] : X[V], P = [];
    if (e.nodes.val.forEach((Y, Q) => {
      const G = mt;
      if (!G || !G[0] || typeof G[0].has != "function") return;
      if (!G[0].has(Q)) {
        P.push(Number.NaN);
        return;
      }
      const xe = G[0].get(Q), de = xe ? xe[G[1]] ?? 0 : 0;
      P.push(de * Me);
    }), !$n.val && Ke !== "auto") {
      const Y = e.nodes.val, Q = /* @__PURE__ */ new Set(), G = (de, ke) => {
        var _a3;
        const fe = (_a3 = Y[de[0]]) == null ? void 0 : _a3[ke];
        return de.every((De) => {
          var _a4;
          return Math.abs((((_a4 = Y[De]) == null ? void 0 : _a4[ke]) ?? NaN) - fe) < 1e-6;
        });
      };
      for (const de of e.elements.val) {
        if (de.length !== 4) continue;
        const ke = G(de, 2), fe = !ke && G(de, 0), De = !ke && G(de, 1);
        if (Ke === "losas" ? ke : Ke === "muros" ? fe || De : Ke === "murosX" ? fe : Ke === "murosY" ? De : false) for (const Oe of de) Q.add(Oe);
      }
      const xe = [];
      for (const de of Q) {
        const ke = P[de];
        Number.isFinite(ke) && xe.push(ke);
      }
      xe.length && ($n.val = $o(xe));
    }
    r.val = P;
  }), r;
}
export {
  ua as a,
  ws as b,
  oi as c,
  si as d,
  ai as e,
  fi as g
};
