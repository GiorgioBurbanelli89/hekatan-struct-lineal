import { N as It, a6 as zn, q as cs, v as Z, a7 as ds, D as bt, M as Ge, B as Me, F as yt, a8 as ps, x as lt, a9 as us, aa as fs, h as Co, ab as zo, r as tn, ac as Tn, ad as Vn, a4 as No, _ as We, a as rt, L as Xt, w as Uo, b as hs, ae as ms, f as tt, V as M, $ as en, af as jn, H as ro, d as kt, c as eo, Y as Zo, Z as $n, G as ws, z as vn, A as ys, ag as Ln, t as xs, o as gs, I as Ht, a2 as xn, E as Fo, S as dn, m as to, ah as gn, g as Ao, i as Eo, j as To, C as Vo, K as vs, U as Ms, W as bs, X as _s, T as Fn, P as no, O as Ss } from "./theme-U-6D_qyI.js";
import { T as Mt, O as Lo } from "./Text-CUW6lNkV.js";
import { P as Ko } from "./tweakpane-BXg6ZhiP.js";
import { e as ks } from "./styles-SbI03m7S.js";
class qo {
  constructor(l, h = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, h);
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
  setColorMap(l, h = 32) {
    this.map = oo[l] || oo.rainbow, this.n = h;
    const m = 1 / this.n, d = new It(), w = new It();
    this.lut.length = 0, this.lut.push(new It(this.map[0][1]));
    for (let p = 1; p < h; p++) {
      const x = p * m;
      for (let g = 0; g < this.map.length - 1; g++) if (x > this.map[g][0] && x <= this.map[g + 1][0]) {
        const b = this.map[g][0], P = this.map[g + 1][0];
        d.setHex(this.map[g][1], zn), w.setHex(this.map[g + 1][1], zn);
        const v = new It().lerpColors(d, w, (x - b) / (P - b));
        this.lut.push(v);
      }
    }
    return this.lut.push(new It(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = cs.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const h = Math.round(l * this.n);
    return this.lut[h];
  }
  addColorMap(l, h) {
    return oo[l] = h, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const h = l.getContext("2d", { alpha: false }), m = h.getImageData(0, 0, 1, this.n), d = m.data;
    let w = 0;
    const p = 1 / this.n, x = new It(), g = new It(), b = new It();
    for (let P = 1; P >= 0; P -= p) for (let v = this.map.length - 1; v >= 0; v--) if (P < this.map[v][0] && P >= this.map[v - 1][0]) {
      const N = this.map[v - 1][0], me = this.map[v][0];
      x.setHex(this.map[v - 1][1], zn), g.setHex(this.map[v][1], zn), b.lerpColors(x, g, (P - N) / (me - N)), d[w * 4] = Math.round(b.r * 255), d[w * 4 + 1] = Math.round(b.g * 255), d[w * 4 + 2] = Math.round(b.b * 255), d[w * 4 + 3] = 255, w += 1;
    }
    return h.putImageData(m, 0, 0), l;
  }
}
const oo = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Go = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Ps = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Go, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, In = Z.state("safe"), Ho = Z.state("auto");
function Wo(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Ps[In.val] ?? Go;
  for (let m = 0; m < l.length - 1; m++) {
    const [d, w, p, x] = l[m], [g, b, P, v] = l[m + 1];
    if (e <= g) {
      const N = (e - d) / (g - d);
      return [w + (b - w) * N, p + (P - p) * N, x + (v - x) * N];
    }
  }
  const h = l[l.length - 1];
  return [h[1], h[2], h[3]];
}
function $o() {
  const l = new Uint8Array(1024);
  for (let m = 0; m < 256; m++) {
    const d = m / 255, [w, p, x] = Wo(d);
    l[m * 4 + 0] = w, l[m * 4 + 1] = p, l[m * 4 + 2] = x, l[m * 4 + 3] = 255;
  }
  const h = new us(l, 256, 1, fs);
  return h.minFilter = Co, h.magFilter = Co, h.wrapS = zo, h.wrapT = zo, h.needsUpdate = true, h;
}
function Cs() {
  const l = [];
  for (let h = 0; h <= 12; h++) {
    const m = 1 - h / 12, [d, w, p] = Wo(m);
    l.push(`rgb(${d | 0},${w | 0},${p | 0}) ${(h / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function co(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((w, p) => w - p), h = (w) => l[Math.min(l.length - 1, Math.max(0, Math.round(w * (l.length - 1))))];
  let m = l.length >= 20 ? h(0.01) : l[0], d = l.length >= 20 ? h(0.99) : l[l.length - 1];
  return m >= 0 && d > 0 && (m = 0), d <= 0 && m < 0 && (d = 0), [m, d];
}
function zs(e, l, h) {
  new qo();
  const m = $o(), d = new ds({ uniforms: { cmap: { value: m }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: bt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  Z.derive(() => {
    var _a;
    In.val;
    const p = d.uniforms.cmap.value;
    d.uniforms.cmap.value = $o(), (_a = p == null ? void 0 : p.dispose) == null ? void 0 : _a.call(p);
  });
  const w = new Ge(new Me(), d);
  return w.renderOrder = -1, w.frustumCulled = false, w.userData.isShellArea = true, w.name = "__hekatan_shell_colormap", Z.derive(() => {
    w.geometry.setAttribute("position", new yt(e.val.flat(), 3));
    const p = [], x = [], g = [];
    l.val.forEach((G, xe) => {
      G.length === 3 ? (p.push(G[0], G[1], G[2]), x.push(xe), g.push(0)) : G.length === 4 && (p.push(G[0], G[1], G[2]), p.push(G[0], G[2], G[3]), x.push(xe, xe), g.push(0, 1));
    }), w.geometry.setIndex(new ps(p, 1)), w.userData.faceToElem = x, w.userData.faceLocal = g;
    const b = h.val.filter((G) => Number.isFinite(G));
    let P, v;
    const N = bn.val;
    if (N ? (v = N[0], P = N[1]) : [v, P] = co(b), P === v) {
      const G = Math.max(Math.abs(P) * 1e-6, 1e-9);
      P += G, v -= G;
    }
    const me = N && N[0] > N[1], ae = Math.min(v, P), ee = Math.max(v, P), C = ee - ae, te = new Float32Array(h.val.length);
    for (let G = 0; G < h.val.length; G++) {
      const xe = h.val[G];
      if (!Number.isFinite(xe)) {
        te[G] = -1;
        continue;
      }
      const B = ((me ? ee + ae - xe : xe) - ae) / C;
      te[G] = Math.max(0, Math.min(1, B));
    }
    w.geometry.setAttribute("scalar", new lt(te, 1));
  }), w;
}
function Fs(e, l, h) {
  const m = document.createElement("div"), d = new Ko({ title: "Settings", expanded: true, container: m });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(d), m.setAttribute("id", "settings");
  const w = "hk_settingsPos";
  let p = null;
  try {
    const v = localStorage.getItem(w);
    v && (p = JSON.parse(v));
  } catch {
  }
  m.style.cssText = ["position:fixed", p ? `left:${p.left}px` : "left:8px", p ? `top:${p.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const x = () => {
    const v = m.querySelector(".tp-rotv_b");
    if (!v) {
      setTimeout(x, 200);
      return;
    }
    v.style.cursor = "move", v.style.userSelect = "none";
    let N = false, me = 0, ae = 0, ee = 0, C = 0;
    v.addEventListener("mousedown", (te) => {
      N = true, me = te.clientX, ae = te.clientY;
      const G = m.getBoundingClientRect();
      ee = G.left, C = G.top, m.style.left = `${ee}px`, m.style.top = `${C}px`;
    }), window.addEventListener("mousemove", (te) => {
      if (!N) return;
      const G = te.clientX - me, xe = te.clientY - ae, ye = Math.max(0, Math.min(window.innerWidth - 40, ee + G)), B = Math.max(0, Math.min(window.innerHeight - 40, C + xe));
      m.style.left = `${ye}px`, m.style.top = `${B}px`;
    }), window.addEventListener("mouseup", () => {
      if (N) {
        N = false;
        try {
          localStorage.setItem(w, JSON.stringify({ left: parseFloat(m.style.left), top: parseFloat(m.style.top) }));
        } catch {
        }
      }
    });
  };
  if (x(), l == null ? void 0 : l.nodes) {
    d.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const v = d.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    v.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), v.addBinding(e.gridStep, "val", { label: "Separaci\xF3n grid (m)", min: 0.05, max: 5, step: 0.05 }), v.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), v.addBinding(e.cursorSnap, "val", { label: "Paso cursor (m)", min: 0.05, max: 5, step: 0.05 }), v.addBinding(e.gridVisible, "val", { label: "Mostrar" }), v.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 }), v.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), v.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), v.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const N = d.addFolder({ title: "\u{1F441} Ver", expanded: false });
    N.addBinding(e.nodes, "val", { label: "Nodes" }), N.addBinding(e.elements, "val", { label: "Elements" }), N.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), N.addBinding(e.faces, "val", { label: "  Caras (fill)" }), N.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), N.addBinding(e.elemColumns, "val", { label: "    Columnas" }), N.addBinding(e.elemBeams, "val", { label: "    Vigas" }), N.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), N.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), N.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), N.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), N.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), N.addBinding(e.orientations, "val", { label: "Orientations" }), N.addBinding(e.sections, "val", { label: "Sections" }), N.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), N.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), N.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), N.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), N.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const v = d.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    v.addBinding(e.supports, "val", { label: "Supports" }), v.addBinding(e.loads, "val", { label: "Loads" }), v.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), v.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const v = d.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = v, v.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), v.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), v.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), v.addBinding(In, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), v.addBinding(Ho, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), v.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), v.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), v.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), v.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  h && d.addBinding(e.solids, "val", { label: "Solids" });
  const g = d.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), b = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), P = () => {
    const v = window.__hekatanClipApply;
    typeof v == "function" && v();
  };
  return g.addBinding(b, "enableX", { label: "Cortar X" }).on("change", P), g.addBinding(b, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", P), g.addBinding(b, "invertX", { label: "  invertir X" }).on("change", P), g.addBinding(b, "enableY", { label: "Cortar Y" }).on("change", P), g.addBinding(b, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", P), g.addBinding(b, "invertY", { label: "  invertir Y" }).on("change", P), g.addBinding(b, "enableZ", { label: "Cortar Z" }).on("change", P), g.addBinding(b, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", P), g.addBinding(b, "invertZ", { label: "  invertir Z" }).on("change", P), m;
}
function As(e) {
  return { gridSize: Z.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: Z.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: Z.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: Z.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: Z.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: Z.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: Z.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: Z.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: Z.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: Z.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: Z.state((e == null ? void 0 : e.nodes) ?? true), elements: Z.state((e == null ? void 0 : e.elements) ?? true), edges: Z.state((e == null ? void 0 : e.edges) ?? true), faces: Z.state((e == null ? void 0 : e.faces) ?? true), elemColumns: Z.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: Z.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: Z.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: Z.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: Z.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: Z.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: Z.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: Z.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: Z.state((e == null ? void 0 : e.orientations) ?? false), sections: Z.state((e == null ? void 0 : e.sections) ?? true), extruded: Z.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: Z.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: Z.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: Z.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: Z.state((e == null ? void 0 : e.secFloor) ?? -1), supports: Z.state((e == null ? void 0 : e.supports) ?? true), loads: Z.state((e == null ? void 0 : e.loads) ?? false), deformedShape: Z.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: Z.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: Z.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: Z.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: Z.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: Z.state((e == null ? void 0 : e.flipAxes) ?? false), solids: Z.state((e == null ? void 0 : e.solids) ?? true), custom3D: Z.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: Z.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: Z.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: Z.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function Es(e, l, h) {
  const m = tn(), d = new Tn(new Me(), new Vn({ color: m.nodePoint }));
  return No((w, p) => {
    d.material.color.setHex(p.nodePoint);
  }), d.frustumCulled = false, Z.derive(() => {
    e.nodes.val && d.geometry.setAttribute("position", new yt(l.val.flat(), 3));
  }), Z.derive(() => {
    if (h.val, l.val, !e.nodes.rawVal) return;
    const w = l.rawVal ?? [];
    let p = e.gridSize.val * 0.5;
    if (w.length >= 2) {
      const g = [1 / 0, 1 / 0, 1 / 0], b = [-1 / 0, -1 / 0, -1 / 0];
      for (const P of w) for (let v = 0; v < 3; v++) g[v] = Math.min(g[v], P[v]), b[v] = Math.max(b[v], P[v]);
      p = Math.max(b[0] - g[0], b[1] - g[1], b[2] - g[2], 0.1);
    }
    const x = 0.03 * p;
    d.material.size = x * h.rawVal;
  }), Z.derive(() => {
    d.visible = e.nodes.val;
  }), d;
}
function so(e, l) {
  const h = tn(), m = new We();
  m.name = "hekatan-grid";
  const d = (l == null ? void 0 : l.planes) ?? ["xy"];
  let w = (l == null ? void 0 : l.majorStep) ?? 1, p = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (w <= 0 && (w = 1), p <= 0 && (p = 0.1); e / p > 500; ) p *= 2;
  for (; e / w > 100; ) w *= 2;
  const x = e / 2;
  w = Math.max(p, Math.round(w / p) * p);
  const b = new It(h.grid), P = new It(h.grid).multiplyScalar(0.45), v = (ee, C, te, G) => {
    const xe = [], ye = ee === "xy" ? (F, R) => [F, R, 0] : ee === "xz" ? (F, R) => [F, 0, R] : (F, R) => [0, F, R], B = Math.floor(x / C);
    for (let F = -B; F <= B; F++) {
      const R = F * C, I = ye(R, -x), E = ye(R, x);
      xe.push(...I, ...E);
    }
    for (let F = -B; F <= B; F++) {
      const R = F * C, I = ye(-x, R), E = ye(x, R);
      xe.push(...I, ...E);
    }
    const $ = new Me();
    $.setAttribute("position", new yt(xe, 3));
    const X = new rt({ color: te, transparent: true, opacity: G, depthWrite: false }), A = new Xt($, X);
    return A.name = `grid-${ee}-${C === p ? "minor" : "major"}`, A;
  }, N = (ee, C, te) => {
    const G = ee === "xy" ? (A, F) => [A, F, 0] : ee === "xz" ? (A, F) => [A, 0, F] : (A, F) => [0, A, F], xe = [[-x, -x], [x, -x], [x, x], [-x, x]], ye = [];
    for (const [A, F] of xe) ye.push(...G(A, F));
    const B = new Me();
    B.setAttribute("position", new yt(ye, 3));
    const $ = new rt({ color: C, transparent: true, opacity: te, depthWrite: false }), X = new Uo(B, $);
    return X.name = `grid-${ee}-border`, X.renderOrder = 1, X;
  }, me = (ee, C, te) => {
    const G = ee === "xy" ? ($, X) => [$, X, 0] : ee === "xz" ? ($, X) => [$, 0, X] : ($, X) => [0, $, X], xe = C === "u" ? [...G(-x, 0), ...G(x, 0)] : [...G(0, -x), ...G(0, x)], ye = new Me();
    ye.setAttribute("position", new yt(xe, 3));
    const B = new Xt(ye, new rt({ color: te, transparent: true, opacity: 0.45, depthWrite: false }));
    return B.name = `grid-${ee}-eje-${C}`, B.renderOrder = 1, B;
  }, ae = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const ee of d) {
    m.add(v(ee, p, P, 0.12)), m.add(v(ee, w, b, 0.4));
    const [C, te] = ae[ee];
    m.add(me(ee, "u", C)), m.add(me(ee, "v", te)), m.add(N(ee, b, 0.55));
  }
  return m.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: w, minorStep: p, gridSize: e, planes: [...d] }, m;
}
function Ts(e, l, h, m) {
  const d = new We(), w = new hs(0.5, 0.5, 0.5), p = new ms(0.45, 0.7, 4);
  p.rotateX(Math.PI / 2), p.translate(0, 0, -0.35);
  const x = new tt({ color: 10166822 }), g = new tt({ color: 2792847 }), b = new tt({ color: 3835647 }), P = () => {
    const me = h.rawVal ?? [];
    if (me.length < 2) return l.gridSize.val * 0.5;
    let ae = [1 / 0, 1 / 0, 1 / 0], ee = [-1 / 0, -1 / 0, -1 / 0];
    for (const C of me) for (let te = 0; te < 3; te++) C[te] < ae[te] && (ae[te] = C[te]), C[te] > ee[te] && (ee[te] = C[te]);
    return Math.max(ee[0] - ae[0], ee[1] - ae[1], ee[2] - ae[2], 0.1);
  }, v = () => 0.08 * P(), N = () => m.rawVal;
  return Z.derive(() => {
    var _a, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    d.clear();
    const me = v();
    (_b = (_a = e.nodeInputs) == null ? void 0 : _a.val.supports) == null ? void 0 : _b.forEach((ae, ee) => {
      const C = h.val[ee];
      if (!C) return;
      const te = ae ?? [], G = (te[0] ? 1 : 0) + (te[1] ? 1 : 0) + (te[2] ? 1 : 0), xe = (te[3] ? 1 : 0) + (te[4] ? 1 : 0) + (te[5] ? 1 : 0);
      let ye;
      G >= 3 && xe >= 3 ? ye = new Ge(w, x) : G >= 3 && xe === 0 ? ye = new Ge(p, g) : ye = new Ge(p, b), ye.position.set(C[0], C[1], C[2]);
      const B = me * N();
      ye.scale.set(B, B, B), d.add(ye);
    });
  }), Z.derive(() => {
    if (m.val, !l.supports.rawVal) return;
    const ae = v() * N();
    d.children.forEach((ee) => ee.scale.set(ae, ae, ae));
  }), Z.derive(() => {
    d.visible = l.supports.val;
  }), d;
}
function Vs(e, l, h, m) {
  const d = new We();
  d.name = "loadsGroup";
  function w(p) {
    if (p.length < 2) return 0.12 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], g = [-1 / 0, -1 / 0, -1 / 0];
    for (const P of p) for (let v = 0; v < 3; v++) x[v] = Math.min(x[v], P[v]), g[v] = Math.max(g[v], P[v]);
    return 0.08 * Math.max(g[0] - x[0], g[1] - x[1], g[2] - x[2], 0.1);
  }
  return Z.derive(() => {
    var _a, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    d.children.forEach((v) => v.dispose()), d.clear();
    const p = h.val, x = w(p), g = 240, b = [];
    (_c = (_b = (_a = e.nodeInputs) == null ? void 0 : _a.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((v, N) => {
      p[N] && v.slice(0, 3).some((me) => Math.abs(me) > 1e-15) && b.push(N);
    });
    let P = b;
    if (b.length > g) {
      const v = b.map((A) => p[A][0]), N = b.map((A) => p[A][1]), me = Math.min(...v), ae = Math.max(...v), ee = Math.min(...N), C = Math.max(...N), te = b.map((A) => p[A][2]), G = Math.max(1e-6, (Math.max(...te) - Math.min(...te)) / 40), xe = (A) => Math.round(A / G), ye = new Set(te.map(xe)), B = Math.max(4, Math.floor(g / Math.max(1, ye.size))), $ = Math.max(2, Math.round(Math.sqrt(B))), X = /* @__PURE__ */ new Map();
      for (const A of b) {
        const F = ae - me < 1e-9 ? 0 : (p[A][0] - me) / (ae - me), R = C - ee < 1e-9 ? 0 : (p[A][1] - ee) / (C - ee), I = Math.min($ - 1, Math.floor(F * $)), E = Math.min($ - 1, Math.floor(R * $)), J = `${I},${E},${xe(p[A][2])}`, le = Math.hypot(F * $ - (I + 0.5), R * $ - (E + 0.5)), ne = X.get(J);
        (!ne || le < ne.d) && X.set(J, { i: A, d: le });
      }
      P = [...X.values()].map((A) => A.i);
    }
    for (const v of P) {
      const N = e.nodeInputs.val.loads.get(v), me = p[v];
      if (!me) continue;
      const ae = new M(...N.slice(0, 3));
      if (ae.lengthSq() < 1e-30) continue;
      ae.normalize();
      const ee = new en(ae, new M(...me), 1, 15637248, 0.3, 0.3), C = x * m.rawVal;
      ee.scale.set(C, C, C), d.add(ee);
    }
  }), Z.derive(() => {
    if (m.val, !l.loads.rawVal) return;
    const x = w(h.rawVal) * m.rawVal;
    d.children.forEach((g) => g.scale.set(x, x, x));
  }), Z.derive(() => {
    d.visible = l.loads.val;
  }), d;
}
function Ls(e, l, h) {
  const m = new We();
  return Z.derive(() => {
    if (!e.nodesIndexes.val) return;
    m.children.forEach((w) => w.dispose()), m.clear();
    const d = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((w, p) => {
      const x = new Mt(`${p}`);
      x.position.set(...w), x.updateScale(d * h.rawVal), m.add(x);
    });
  }), Z.derive(() => {
    if (h.val, !e.nodesIndexes.rawVal) return;
    const d = 0.05 * e.gridSize.val * 0.6;
    m.children.forEach((w) => w.updateScale(d * h.rawVal));
  }), Z.derive(() => {
    m.visible = e.nodesIndexes.val;
  }), m;
}
function $s(e, l, h, m) {
  const d = new We();
  return Z.derive(() => {
    var _a;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    d.children.forEach((p) => p.dispose()), d.clear();
    const w = 0.05 * l.gridSize.val * 0.6;
    (_a = e.elements) == null ? void 0 : _a.val.forEach((p, x) => {
      const g = new Mt(`${x}`, void 0, "#001219");
      g.position.set(...Is(p.map((b) => h.rawVal[b]))), g.updateScale(w * m.rawVal), d.add(g);
    });
  }), Z.derive(() => {
    if (m.val, !l.elementsIndexes.rawVal) return;
    const w = 0.05 * l.gridSize.val * 0.6;
    d.children.forEach((p) => p.updateScale(w * m.rawVal));
  }), Z.derive(() => {
    d.visible = l.elementsIndexes.val;
  }), d;
}
function Is(e) {
  const l = e.reduce((m, d) => [m[0] + d[0], m[1] + d[1], m[2] + d[2]], [0, 0, 0]), h = e.length;
  return [l[0] / h, l[1] / h, l[2] / h];
}
function Io(e, l) {
  const h = new We(), m = Math.min(0.05 * e, 0.6), d = tn(), w = new Mt("X", "red", "transparent"), p = new Mt(l ? "Z" : "Y", "green", "transparent"), x = new Mt(l ? "Y" : "Z", "blue", "transparent"), g = new en(new M(1, 0, 0), new M(0, 0, 0), 1, d.axisArrow, 0.2, 0.2), b = new en(new M(0, 1, 0), new M(0, 0, 0), 1, d.axisArrow, 0.2, 0.2), P = new en(new M(0, 0, 1), new M(0, 0, 0), 1, d.axisArrow, 0.2, 0.2);
  return w.position.set(1.3 * m, 0, 0), p.position.set(0, 1.3 * m, 0), x.position.set(0, 0, 1.3 * m), w.updateScale(0.4 * m), p.updateScale(0.4 * m), x.updateScale(0.4 * m), g.scale.set(m, m, m), b.scale.set(m, m, m), P.scale.set(m, m, m), h.add(g, b, P, w, p, x), h;
}
function Rn(e, l) {
  const h = new M(...e), d = new M(...l).clone().sub(h), w = d.length(), p = d.dot(new M(1, 0, 0)) / w, x = d.dot(new M(0, 1, 0)) / w, g = d.dot(new M(0, 0, 1)) / w, b = Math.sqrt(p ** 2 + x ** 2);
  let P = new jn().fromArray([[p, x, g], [-x / b, p / b, 0], [-p * g / b, -x * g / b, b]].flat());
  return g === 1 && (P = new jn().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), g === -1 && (P = new jn().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new ro().setFromMatrix3(P);
}
function io(e, l) {
  return e == null ? void 0 : e.map((h, m) => (9 * h + l[m]) / 10);
}
function Mn(e) {
  const l = e.reduce((m, d) => [m[0] + d[0], m[1] + d[1], m[2] + d[2]], [0, 0, 0]), h = e.length;
  return [l[0] / h, l[1] / h, l[2] / h];
}
function Rs(e, l, h) {
  const m = Mn([l, h]), d = Mn([e, h]), w = Mn([e, l]), p = new M(...m).sub(new M(...d)).normalize(), x = new M(...h).sub(new M(...w)).normalize(), g = p.clone().cross(x).normalize(), b = g.clone().cross(p).normalize();
  return new ro().makeBasis(p, b, g);
}
function Bs(e, l, h, m) {
  const d = new We(), w = new Me(), p = new rt({ vertexColors: true }), x = [0, 0, 0], g = [1, 0, 0], b = [0, 1, 0], P = [0, 0, 1];
  w.setAttribute("position", new yt([...x, ...g, ...x, ...b, ...x, ...P], 3));
  const v = [255, 0, 0], N = [0, 255, 0], me = [0, 0, 255];
  return w.setAttribute("color", new yt([...v, ...v, ...N, ...N, ...me, ...me], 3)), Z.derive(() => {
    var _a;
    l.deformedShape.val, l.orientations.val && (d.clear(), (_a = e.elements) == null ? void 0 : _a.val.forEach((ae) => {
      const ee = new Xt(w, p), C = h.rawVal[ae[0]], te = h.rawVal[ae[1]];
      if (ae.length === 2 && (ee.position.set(...io(C, te)), ee.rotation.setFromRotationMatrix(Rn(C, te))), ae.length === 3) {
        const ye = h.rawVal[ae[2]];
        ee.position.set(...Mn([C, te, ye])), ee.rotation.setFromRotationMatrix(Rs(C, te, ye));
      }
      const xe = 0.05 * l.gridSize.rawVal * 0.75 * m.rawVal;
      ee.scale.set(xe, xe, xe), d.add(ee);
    }));
  }), Z.derive(() => {
    if (m.val, !l.orientations.rawVal) return;
    const ee = 0.05 * l.gridSize.val * 0.75 * m.rawVal;
    d.children.forEach((C) => C.scale.set(ee, ee, ee));
  }), Z.derive(() => {
    d.visible = l.orientations.val;
  }), d;
}
function Ds(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), h = (e.h * 100).toFixed(0);
    return `${l}x${h}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function Xs(e, l, h, m) {
  const d = new We(), w = new We();
  d.add(w);
  function p($, X) {
    const A = $ / 2, F = X / 2, R = new Float32Array([0, -A, -F, 0, A, -F, 0, A, F, 0, -A, -F, 0, A, F, 0, -A, F]), I = new Me();
    I.setAttribute("position", new lt(R, 3));
    const E = new Float32Array([0, -A, -F, 0, A, -F, 0, A, F, 0, -A, F, 0, -A, -F]), J = new Me();
    return J.setAttribute("position", new lt(E, 3)), { fill: I, outline: J };
  }
  function x($, X = 24) {
    const A = $ / 2, F = new Float32Array(X * 9);
    for (let J = 0; J < X; J++) {
      const le = J / X * Math.PI * 2, ne = (J + 1) / X * Math.PI * 2;
      F[J * 9] = 0, F[J * 9 + 1] = 0, F[J * 9 + 2] = 0, F[J * 9 + 3] = 0, F[J * 9 + 4] = A * Math.cos(le), F[J * 9 + 5] = A * Math.sin(le), F[J * 9 + 6] = 0, F[J * 9 + 7] = A * Math.cos(ne), F[J * 9 + 8] = A * Math.sin(ne);
    }
    const R = new Me();
    R.setAttribute("position", new lt(F, 3));
    const I = new Float32Array((X + 1) * 3);
    for (let J = 0; J <= X; J++) {
      const le = J / X * Math.PI * 2;
      I[J * 3] = 0, I[J * 3 + 1] = A * Math.cos(le), I[J * 3 + 2] = A * Math.sin(le);
    }
    const E = new Me();
    return E.setAttribute("position", new lt(I, 3)), { fill: R, outline: E };
  }
  function g($, X, A, F) {
    const R = A ?? X * 0.08, I = F ?? $ * 0.07, E = $ / 2, J = X / 2, le = J - R, ne = I / 2, j = [];
    function V(fe, Ae, ge, Te) {
      j.push(0, fe, Ae, 0, ge, Ae, 0, ge, Te, 0, fe, Ae, 0, ge, Te, 0, fe, Te);
    }
    V(-E, -J, E, -le), V(-ne, -le, ne, le), V(-E, le, E, J);
    const re = new Me();
    re.setAttribute("position", new lt(new Float32Array(j), 3));
    const q = new Float32Array([0, -E, -J, 0, E, -J, 0, E, -le, 0, ne, -le, 0, ne, le, 0, E, le, 0, E, J, 0, -E, J, 0, -E, le, 0, -ne, le, 0, -ne, -le, 0, -E, -le, 0, -E, -J]), pe = new Me();
    return pe.setAttribute("position", new lt(q, 3)), { fill: re, outline: pe };
  }
  function b($, X, A) {
    const F = $ / 2, R = X / 2, I = F - A, E = R - A, J = [];
    function le(re, q, pe, fe) {
      J.push(0, re, q, 0, pe, q, 0, pe, fe, 0, re, q, 0, pe, fe, 0, re, fe);
    }
    le(-F, -R, F, -E), le(-F, E, F, R), le(-F, -E, -I, E), le(I, -E, F, E);
    const ne = new Me();
    ne.setAttribute("position", new lt(new Float32Array(J), 3));
    const j = new Float32Array([0, -F, -R, 0, F, -R, 0, F, -R, 0, F, R, 0, F, R, 0, -F, R, 0, -F, R, 0, -F, -R, 0, -I, -E, 0, I, -E, 0, I, -E, 0, I, E, 0, I, E, 0, -I, E, 0, -I, E, 0, -I, -E]), V = new Me();
    return V.setAttribute("position", new lt(j, 3)), { fill: ne, outline: V };
  }
  function P($, X, A) {
    const F = $ / 2, R = X / 2, I = F - A, E = R - A, J = new Me(), le = new Float32Array([0, -I, -E, 0, I, -E, 0, I, E, 0, -I, -E, 0, I, E, 0, -I, E]);
    J.setAttribute("position", new lt(le, 3));
    const ne = [];
    function j(pe, fe, Ae, ge) {
      ne.push(0, pe, fe, 0, Ae, fe, 0, Ae, ge, 0, pe, fe, 0, Ae, ge, 0, pe, ge);
    }
    j(-F, -R, F, -E), j(-F, E, F, R), j(-F, -E, -I, E), j(I, -E, F, E);
    const V = new Me();
    V.setAttribute("position", new lt(new Float32Array(ne), 3));
    const re = new Float32Array([0, -F, -R, 0, F, -R, 0, F, -R, 0, F, R, 0, F, R, 0, -F, R, 0, -F, R, 0, -F, -R, 0, -I, -E, 0, I, -E, 0, I, -E, 0, I, E, 0, I, E, 0, -I, E, 0, -I, E, 0, -I, -E]), q = new Me();
    return q.setAttribute("position", new lt(re, 3)), { concFill: J, steelFillGeom: V, outline: q };
  }
  function v($, X, A) {
    const F = [], R = [[0, -$ / 2, -X / 2], [0, -$ / 2 + A, -X / 2], [0, -$ / 2 + A, X / 2 - A], [0, $ / 2, X / 2 - A], [0, $ / 2, X / 2], [0, -$ / 2, X / 2]], I = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ne of I) F.push(...R[ne]);
    const E = new Me();
    E.setAttribute("position", new lt(new Float32Array(F), 3));
    const J = [];
    for (let ne = 0; ne < R.length; ne++) {
      const j = (ne + 1) % R.length;
      J.push(...R[ne], ...R[j]);
    }
    const le = new Me();
    return le.setAttribute("position", new lt(new Float32Array(J), 3)), { fill: E, outline: le };
  }
  function N($, X, A, F) {
    const R = F / 2, I = [], E = [[0, -$ - R, -X / 2], [0, -A - R, -X / 2], [0, -A - R, X / 2 - A], [0, -R, X / 2 - A], [0, -R, X / 2], [0, -$ - R, X / 2]], J = [[0, R, -X / 2], [0, R + A, -X / 2], [0, R + A, X / 2 - A], [0, $ + R, X / 2 - A], [0, $ + R, X / 2], [0, R, X / 2]], le = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const re of le) I.push(...E[re]);
    for (const re of le) I.push(...J[re]);
    const ne = new Me();
    ne.setAttribute("position", new lt(new Float32Array(I), 3));
    const j = [];
    for (const re of [E, J]) for (let q = 0; q < re.length; q++) {
      const pe = (q + 1) % re.length;
      j.push(...re[q], ...re[pe]);
    }
    const V = new Me();
    return V.setAttribute("position", new lt(new Float32Array(j), 3)), { fill: ne, outline: V };
  }
  function me($, X, A, F) {
    const R = X / 2, I = $, E = [[0, -I, -R], [0, -I, -R + A], [0, -F, -R + A], [0, -F, R - A], [0, -I, R - A], [0, -I, R], [0, 0, R], [0, 0, -R]], J = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], le = [];
    for (const re of J) le.push(...E[re]);
    const ne = new Me();
    ne.setAttribute("position", new lt(new Float32Array(le), 3));
    const j = [];
    for (let re = 0; re < E.length; re++) {
      const q = (re + 1) % E.length;
      j.push(...E[re], ...E[q]);
    }
    const V = new Me();
    return V.setAttribute("position", new lt(new Float32Array(j), 3)), { fill: ne, outline: V };
  }
  function ae($, X, A, F, R) {
    const I = X / 2, E = R / 2, J = [], le = [[0, -$, -I], [0, -$, -I + A], [0, -E - F, -I + A], [0, -E - F, I - A], [0, -$, I - A], [0, -$, I], [0, -E, I], [0, -E, -I]], ne = le.map((pe) => [pe[0], -pe[1], pe[2]]), j = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const pe of j) J.push(...le[pe]);
    for (const pe of j) J.push(...ne[pe]);
    const V = new Me();
    V.setAttribute("position", new lt(new Float32Array(J), 3));
    const re = [];
    for (const pe of [le, ne]) for (let fe = 0; fe < pe.length; fe++) {
      const Ae = (fe + 1) % pe.length;
      re.push(...pe[fe], ...pe[Ae]);
    }
    const q = new Me();
    return q.setAttribute("position", new lt(new Float32Array(re), 3)), { fill: V, outline: q };
  }
  function ee($, X, A, F) {
    const R = $ / 2, I = X / 2, E = F / 2, J = [[0, -E, -I], [0, E, -I], [0, E, I - A], [0, R, I - A], [0, R, I], [0, -R, I], [0, -R, I - A], [0, -E, I - A]], le = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], ne = [];
    for (const q of le) ne.push(...J[q]);
    const j = new Me();
    j.setAttribute("position", new lt(new Float32Array(ne), 3));
    const V = [];
    for (let q = 0; q < J.length; q++) {
      const pe = (q + 1) % J.length;
      V.push(...J[q], ...J[pe]);
    }
    const re = new Me();
    return re.setAttribute("position", new lt(new Float32Array(V), 3)), { fill: j, outline: re };
  }
  function C($, X, A = 24) {
    const F = $ / 2, R = F - X, I = [];
    for (let ne = 0; ne < A; ne++) {
      const j = ne / A * Math.PI * 2, V = (ne + 1) / A * Math.PI * 2, re = Math.cos(j), q = Math.sin(j), pe = Math.cos(V), fe = Math.sin(V);
      I.push(0, F * re, F * q, 0, F * pe, F * fe, 0, R * pe, R * fe), I.push(0, F * re, F * q, 0, R * pe, R * fe, 0, R * re, R * q);
    }
    const E = new Me();
    E.setAttribute("position", new lt(new Float32Array(I), 3));
    const J = [];
    for (let ne = 0; ne < A; ne++) {
      const j = ne / A * Math.PI * 2, V = (ne + 1) / A * Math.PI * 2;
      J.push(0, F * Math.cos(j), F * Math.sin(j), 0, F * Math.cos(V), F * Math.sin(V)), J.push(0, R * Math.cos(j), R * Math.sin(j), 0, R * Math.cos(V), R * Math.sin(V));
    }
    const le = new Me();
    return le.setAttribute("position", new lt(new Float32Array(J), 3)), { fill: E, outline: le };
  }
  const te = new tt({ color: 52479, transparent: true, opacity: 0.35, side: bt, depthWrite: false }), G = new rt({ color: 52479 }), xe = new tt({ color: 16750848, transparent: true, opacity: 0.4, side: bt, depthWrite: false }), ye = new rt({ color: 16750848 });
  function B($, X) {
    const A = Math.abs(X[0] - $[0]), F = Math.abs(X[1] - $[1]), R = Math.abs(X[2] - $[2]);
    return R > A && R > F || F > A && F > R;
  }
  return Z.derive(() => {
    var _a, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const $ = l.secColumns.rawVal, X = l.secBeams.rawVal;
    if (!$ && !X) {
      d.children.forEach((E) => {
        E instanceof Mt && E.dispose();
      }), d.clear();
      return;
    }
    d.children.forEach((E) => {
      E instanceof Mt && E.dispose();
    }), d.clear();
    const A = (_a = e.elements) == null ? void 0 : _a.val, F = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!A || !F) return;
    const R = F.sectionShapes, I = l.secFloor.rawVal;
    A.forEach((E, J) => {
      if (E.length !== 2) return;
      const le = h.rawVal[E[0]], ne = h.rawVal[E[1]];
      if (!le || !ne) return;
      const j = B(le, ne);
      if (j && !$ || !j && !X) return;
      if (I >= 0) {
        const fe = Math.min(le[1], ne[1]);
        Math.max(le[1], ne[1]);
        const Ae = l.gridSize.rawVal || 3;
        if (Math.floor(fe / Ae + 0.01) !== I) return;
      }
      const V = R == null ? void 0 : R.get(J);
      if (!V) return;
      const re = [(le[0] + ne[0]) / 2, (le[1] + ne[1]) / 2, (le[2] + ne[2]) / 2], q = Rn(le, ne);
      if (V.type === "CFT") {
        const fe = P(V.b, V.h, V.tw ?? V.b * 0.05), Ae = new Ge(fe.concFill, te);
        Ae.position.set(...re), Ae.rotation.setFromRotationMatrix(q), d.add(Ae);
        const ge = new Ge(fe.steelFillGeom, xe);
        ge.position.set(...re), ge.rotation.setFromRotationMatrix(q), d.add(ge);
        const Te = new kt(fe.outline, ye);
        Te.position.set(...re), Te.rotation.setFromRotationMatrix(q), d.add(Te);
      } else {
        let fe, Ae, ge;
        switch (V.type) {
          case "rect":
            fe = p(V.b, V.h), Ae = te, ge = G;
            break;
          case "circ":
            fe = x(V.d), Ae = te, ge = G;
            break;
          case "I":
            fe = g(V.b, V.h, V.tf, V.tw), Ae = xe, ge = ye;
            break;
          case "HSS":
            fe = b(V.b, V.h, V.tw ?? V.b * 0.05), Ae = xe, ge = ye;
            break;
          case "CFT":
            fe = P(V.b, V.h, V.tw ?? V.b * 0.05), Ae = xe, ge = ye;
            break;
          case "L":
            fe = v(V.b ?? V.h, V.h, V.t ?? V.tw ?? 3e-3), Ae = xe, ge = ye;
            break;
          case "2L":
            fe = N(V.b ?? V.h, V.h, V.t ?? V.tw ?? 3e-3, V.dis ?? 0.01), Ae = xe, ge = ye;
            break;
          case "C":
          case "coldC":
            fe = me(V.b, V.h, V.tf ?? V.t ?? 3e-3, V.tw ?? V.t ?? 3e-3), Ae = xe, ge = ye;
            break;
          case "2C":
            fe = ae(V.b, V.h, V.tf ?? 5e-3, V.tw ?? 5e-3, V.dis ?? 0.01), Ae = xe, ge = ye;
            break;
          case "T":
            fe = ee(V.b, V.h, V.tf ?? 0.01, V.tw ?? 6e-3), Ae = xe, ge = ye;
            break;
          case "pipe":
            fe = C(V.d, V.tw ?? V.d * 0.05), Ae = xe, ge = ye;
            break;
          default:
            return;
        }
        const Te = new Ge(fe.fill, Ae);
        Te.position.set(...re), Te.rotation.setFromRotationMatrix(q), d.add(Te);
        const He = new kt(fe.outline, ge);
        He.position.set(...re), He.rotation.setFromRotationMatrix(q), d.add(He);
      }
      const pe = Ds(V);
      if (pe) {
        const Ae = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(V.type) ? "#ff9900" : "#00ccff", ge = new Mt(pe, Ae, "transparent");
        ge.position.set(re[0], re[1], re[2]);
        const Te = 0.05 * l.gridSize.rawVal * 0.5;
        ge.updateScale(Te * ((m == null ? void 0 : m.rawVal) ?? 1)), w.add(ge);
      }
    });
  }), m && Z.derive(() => {
    if (m.val, !l.sections.rawVal) return;
    const $ = 0.05 * l.gridSize.val * 0.5;
    w.children.forEach((X) => {
      X instanceof Mt && X.updateScale($ * m.rawVal);
    });
  }), Z.derive(() => {
    d.visible = l.sections.val;
  }), Z.derive(() => {
    w.visible = l.sectionLabels.val;
  }), d;
}
function Ys(e) {
  if (!e) return null;
  const l = e.type, h = (P, v) => [P, v], m = (P, v) => [h(-P / 2, -v / 2), h(P / 2, -v / 2), h(P / 2, v / 2), h(-P / 2, v / 2)], d = (P, v = 24) => {
    const N = P / 2, me = [];
    for (let ae = 0; ae < v; ae++) {
      const ee = 2 * Math.PI * ae / v;
      me.push(h(N * Math.cos(ee), N * Math.sin(ee)));
    }
    return me;
  }, w = e.b ?? 0, p = e.h ?? 0, x = e.d ?? 0, g = e.tw ?? e.t ?? 0, b = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return w && p ? { contorno: m(w, p) } : null;
    case "circ":
      return x ? { contorno: d(x) } : null;
    case "pipe":
      return x && g ? { contorno: d(x), huecos: [d(x - 2 * g).reverse()] } : null;
    case "HSS":
      return w && p && g ? { contorno: m(w, p), huecos: [m(w - 2 * g, p - 2 * (b || g)).reverse()] } : null;
    case "CFT":
      return w && p ? { contorno: m(w, p) } : null;
    case "I":
      return w && p && g && b ? { contorno: [h(-w / 2, -p / 2), h(w / 2, -p / 2), h(w / 2, -p / 2 + b), h(g / 2, -p / 2 + b), h(g / 2, p / 2 - b), h(w / 2, p / 2 - b), h(w / 2, p / 2), h(-w / 2, p / 2), h(-w / 2, p / 2 - b), h(-g / 2, p / 2 - b), h(-g / 2, -p / 2 + b), h(-w / 2, -p / 2 + b)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return w && p && g && b ? { contorno: [h(-w / 2, -p / 2), h(w / 2, -p / 2), h(w / 2, -p / 2 + b), h(-w / 2 + g, -p / 2 + b), h(-w / 2 + g, p / 2 - b), h(w / 2, p / 2 - b), h(w / 2, p / 2), h(-w / 2, p / 2)] } : null;
    case "T":
      return w && p && g && b ? { contorno: [h(-g / 2, -p / 2), h(g / 2, -p / 2), h(g / 2, p / 2 - b), h(w / 2, p / 2 - b), h(w / 2, p / 2), h(-w / 2, p / 2), h(-w / 2, p / 2 - b), h(-g / 2, p / 2 - b)] } : null;
    case "L":
    case "2L":
      return w && p && g ? { contorno: [h(-w / 2, -p / 2), h(w / 2, -p / 2), h(w / 2, -p / 2 + g), h(-w / 2 + g, -p / 2 + g), h(-w / 2 + g, p / 2), h(-w / 2, p / 2)] } : null;
    default:
      return w && p ? { contorno: m(w, p) } : x ? { contorno: d(x) } : null;
  }
}
function Ns(e, l, h) {
  if (!e || e <= 0 || !l || !h || l <= 0 || h <= 0) return null;
  const m = Math.sqrt(Math.sqrt(h / l)), d = Math.sqrt(e / m), w = e / d;
  return !isFinite(d) || !isFinite(w) || d <= 0 || w <= 0 ? null : { contorno: [[-d / 2, -w / 2], [d / 2, -w / 2], [d / 2, w / 2], [-d / 2, w / 2]] };
}
function Us(e) {
  const l = new vn();
  e.contorno.forEach(([h, m], d) => d ? l.lineTo(h, m) : l.moveTo(h, m)), l.closePath();
  for (const h of e.huecos ?? []) {
    const m = new ys();
    h.forEach(([d, w], p) => p ? m.lineTo(d, w) : m.moveTo(d, w)), m.closePath(), l.holes.push(m);
  }
  return l;
}
function Zs(e, l, h) {
  const m = new We();
  m.name = "extrusion";
  const d = new eo({ color: 8369151, transparent: true, opacity: 0.92, side: bt }), w = new eo({ color: 12623968, transparent: true, opacity: 0.85, side: bt }), p = new eo({ color: 11583173, transparent: true, opacity: 0.85, side: bt }), x = new We();
  x.add(new Zo(16777215, 0.55));
  const g = new $n(16777215, 0.75);
  g.position.set(30, 25, 40);
  const b = new $n(16777215, 0.35);
  b.position.set(-25, -20, 15), x.add(g, b);
  let P = 0;
  return Z.derive(() => {
    var _a, _b, _c, _d, _e;
    const v = ((_a = l.extruded) == null ? void 0 : _a.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++P, on: v }, m.visible = v;
    for (const G of [...m.children]) G !== x && (m.remove(G), (_c = (_b = G.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (m.children.includes(x) || m.add(x), !v) return;
    const N = h.val ?? [], me = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], ae = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, ee = ae.sectionShapes ?? /* @__PURE__ */ new Map(), C = ae.thicknesses ?? /* @__PURE__ */ new Map();
    let te = "";
    try {
      me.forEach((G, xe) => {
        var _a2, _b2, _c2;
        if (G.length === 2) {
          let ye = Ys(ee.get(xe)), B = true;
          if (ye || (ye = Ns((_a2 = ae.areas) == null ? void 0 : _a2.get(xe), (_b2 = ae.momentsOfInertiaY) == null ? void 0 : _b2.get(xe), (_c2 = ae.momentsOfInertiaZ) == null ? void 0 : _c2.get(xe)), B = false), !ye) return;
          const $ = N[G[0]], X = N[G[1]];
          if (!$ || !X) return;
          const A = Math.hypot(X[0] - $[0], X[1] - $[1], X[2] - $[2]);
          if (A < 1e-9) return;
          const F = new ws(Us(ye), { depth: A, bevelEnabled: false, curveSegments: 4 });
          F.applyMatrix4(new ro().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const R = new Ge(F, B ? d : w);
          R.position.set($[0], $[1], $[2]), R.rotation.setFromRotationMatrix(Rn($, X)), m.add(R);
          return;
        }
        if (G.length === 3 || G.length === 4) {
          const ye = C.get(xe);
          if (!ye || ye <= 0) return;
          const B = G.map((q) => N[q]).filter(Boolean);
          if (B.length < 3) return;
          const $ = [B[1][0] - B[0][0], B[1][1] - B[0][1], B[1][2] - B[0][2]], X = [B[2][0] - B[0][0], B[2][1] - B[0][1], B[2][2] - B[0][2]], A = $[1] * X[2] - $[2] * X[1], F = $[2] * X[0] - $[0] * X[2], R = $[0] * X[1] - $[1] * X[0], I = Math.hypot(A, F, R);
          if (I < 1e-12) return;
          const E = [A / I, F / I, R / I], J = [], le = (q) => B.map((pe) => [pe[0] + E[0] * q, pe[1] + E[1] * q, pe[2] + E[2] * q]), ne = le(+ye / 2), j = le(-ye / 2), V = (q, pe, fe) => J.push(...q, ...pe, ...fe);
          for (const q of [ne, j]) V(q[0], q[1], q[2]), q.length === 4 && V(q[0], q[2], q[3]);
          for (let q = 0; q < B.length; q++) {
            const pe = (q + 1) % B.length;
            V(ne[q], j[q], j[pe]), V(ne[q], j[pe], ne[pe]);
          }
          const re = new Me();
          re.setAttribute("position", new yt(J, 3)), re.computeVertexNormals(), m.add(new Ge(re, p));
        }
      });
    } catch (G) {
      te = String((G == null ? void 0 : G.message) ?? G);
    }
    globalThis.__extrusionDebug = { corridas: P, on: v, fallo: te, nElementos: me.length, nFormas: ee.size, nEspesores: C.size, mallas: m.children.length - 1 };
  }), m;
}
class An extends We {
  constructor(l, h, m, d, w, p, x) {
    super();
    const g = new vn().moveTo(0, 0).lineTo(0, p[1]).lineTo(m, p[1]).lineTo(m, 0).lineTo(0, 0), b = g.getPoints(), P = new Me().setFromPoints(b);
    this.lines = new kt(P, new rt({ color: tn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(d), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const v = new Ln(g), N = new tt({ color: p[1] > 0 ? 24435 : 11411474, side: bt });
    this.mesh = new Ge(v, N), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(d), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Mt(`${w[1].toFixed(4)}`), this.normalizedResult = p, this.textPosition = Mn([l, h]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(d), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Ro extends We {
  constructor(l, h, m, d, w, p, x) {
    super();
    const g = w[0] * m / (w[0] + w[1]), b = w[0] * w[1] > 0;
    if (this.text = new Mt(`${w[0].toFixed(4)}`), this.text2 = new Mt(`${(w[1] * -1).toFixed(4)}`), this.normalizedResult = p, this.textPosition = io(l, h), this.text2Position = io(h, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(d), this.text2.rotation.setFromRotationMatrix(d), this.add(this.text, this.text2), b) {
      const P = new vn().moveTo(0, 0).lineTo(0, p[0]).lineTo(g, 0).lineTo(0, 0), v = new vn().moveTo(g, 0).lineTo(m, -p[1]).lineTo(m, 0).lineTo(g, 0), N = P.getPoints(), me = v.getPoints(), ae = new Me().setFromPoints(N), ee = new Me().setFromPoints(me), C = new rt({ color: tn().resultOutline });
      this.lines = new kt(ae, C), this.lines2 = new kt(ee, C), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(d), this.lines2.rotation.setFromRotationMatrix(d), x && this.lines.rotateX(Math.PI / 2), x && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const te = new Ln(P), G = new Ln(v), xe = new tt({ color: p[0] > 0 ? 24435 : 11411474, side: bt }), ye = new tt({ color: -p[1] > 0 ? 24435 : 11411474, side: bt });
      this.mesh = new Ge(te, xe), this.mesh2 = new Ge(G, ye), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(d), this.mesh2.rotation.setFromRotationMatrix(d), x && this.mesh.rotateX(Math.PI / 2), x && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const P = new vn().moveTo(0, 0).lineTo(0, p[0]).lineTo(m, -p[1]).lineTo(m, 0).lineTo(0, 0), v = P.getPoints(), N = new Me().setFromPoints(v);
      this.lines = new kt(N, new rt({ color: tn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(d), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const me = new Ln(P), ae = new tt({ color: p[0] > 0 ? 24435 : 11411474, side: bt });
      this.mesh = new Ge(me, ae), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(d), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(l) {
    var _a, _b;
    this.lines.scale.set(1, l * 2, 1), (_a = this.lines2) == null ? void 0 : _a.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text2.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * l), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a = this.lines2) == null ? void 0 : _a.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var Jo = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(Jo || {});
function Ks(e, l, h, m) {
  const d = new We(), w = { normals: An, shearsY: An, shearsZ: An, torsions: An, bendingsY: Ro, bendingsZ: Ro };
  return Z.derive(() => {
    var _a, _b;
    if (l.deformedShape.val, h.val, l.frameResults.val == "none") return;
    d.children.forEach((x) => x.dispose()), d.clear();
    const p = Jo[l.frameResults.rawVal];
    (_b = (_a = e.analyzeOutputs) == null ? void 0 : _a.rawVal[p]) == null ? void 0 : _b.forEach((x, g) => {
      var _a2, _b2;
      const b = ((_a2 = e.elements) == null ? void 0 : _a2.rawVal[g]) ?? [0, 1], P = h.rawVal[b[0]], v = h.rawVal[b[1]], N = new M(...v).distanceTo(new M(...P)), me = qs((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[p]), ae = x == null ? void 0 : x.map((G) => G / (me === 0 ? 1 : me)), ee = Rn(P, v), C = new w[p](P, v, N, ee, x ?? [0, 0], ae ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(p)), te = 0.05 * l.gridSize.rawVal;
      C.updateScale(te * m.rawVal), d.add(C);
    });
  }), Z.derive(() => {
    if (m.val, l.frameResults.rawVal == "none") return;
    const p = 0.05 * l.gridSize.val;
    d.children.forEach((x) => x.updateScale(p * m.rawVal));
  }), Z.derive(() => {
    d.visible = l.frameResults.val != "none";
  }), d;
}
function qs(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((h) => {
    const m = Math.max(...h ?? [0, 0]);
    m > l && (l = m);
  }), l;
}
class Gs extends We {
  constructor(l, h, m) {
    super();
    const d = h === po.reactions;
    m[0] && (this.xText1 = new Mt(`${d ? "Fx" : "Dx"}: ` + m[0].toFixed(4))), m[3] && (this.xText2 = new Mt(`${d ? "Mx" : "Rx"}: ` + m[3].toFixed(4))), m[1] && (this.yText1 = new Mt(`${d ? "Fy" : "Dy"}: ` + m[1].toFixed(4))), m[4] && (this.yText2 = new Mt(`${d ? "My" : "Ry"}: ` + m[4].toFixed(4))), m[2] && (this.zText1 = new Mt(`${d ? "Fz" : "Dz"}: ` + m[2].toFixed(4))), m[5] && (this.zText2 = new Mt(`${d ? "Mz" : "Rz"}: ` + m[5].toFixed(4))), (m[0] || m[3]) && (this.xArrow = new en(new M(1, 0, 0), new M(0, 0, 0), 1, 15637248, 0.3, 0.3)), (m[1] || m[4]) && (this.yArrow = new en(new M(0, 1, 0), new M(0, 0, 0), 1, 15637248, 0.3, 0.3)), (m[2] || m[5]) && (this.zArrow = new en(new M(0, 0, 1), new M(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(l) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    (_a = this.xArrow) == null ? void 0 : _a.scale.set(l, l, l), (_b = this.yArrow) == null ? void 0 : _b.scale.set(l, l, l), (_c = this.zArrow) == null ? void 0 : _c.scale.set(l, l, l), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * l, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * l, 0, 0.5 * l), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * l, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * l, 0.5 * l), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * l), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * l + 0.5 * l), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * l), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * l), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * l), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * l), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * l), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * l);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a = this.xArrow) == null ? void 0 : _a.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var po = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(po || {});
function Hs(e, l, h, m) {
  const d = new We();
  return Z.derive(() => {
    var _a, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    d.children.forEach((x) => x.dispose()), d.clear();
    const w = po[l.nodeResults.rawVal], p = 0.05 * l.gridSize.val;
    (_b = (_a = e.deformOutputs) == null ? void 0 : _a.val[w]) == null ? void 0 : _b.forEach((x, g) => {
      const b = new Gs(h.rawVal[g], w, x ?? [0, 0, 0, 0, 0, 0]);
      b.updateScale(p * m.rawVal), d.add(b);
    });
  }), Z.derive(() => {
    if (m.val, l.nodeResults.rawVal == "none") return;
    const w = 0.05 * l.gridSize.val;
    d.children.forEach((p) => p.updateScale(w * m.rawVal));
  }), Z.derive(() => {
    d.visible = l.nodeResults.val != "none";
  }), d;
}
function Ws({ drawingObj: e, gridObj: l, scene: h, getActiveCamera: m, controls: d, gridSize: w, derivedDisplayScale: p, rendererElm: x, viewerRender: g }) {
  const b = new xs(), P = new gs(), v = (n) => {
    const o = x.getBoundingClientRect(), a = n.clientX - o.left, t = n.clientY - o.top, i = o.width || 1, s = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const u = i / 2;
      if (a >= u) return P.x = (a - u) / u * 2 - 1, P.y = -(t / s) * 2 + 1, window.__hekatanSplitCamera ?? m();
      P.x = a / u * 2 - 1;
    } else P.x = a / i * 2 - 1;
    return P.y = -(t / s) * 2 + 1, m();
  }, N = new Ge(new Ht(1e4, 1e4), new tt({ side: bt, transparent: true, opacity: 0, depthWrite: false }));
  N.visible = true, N.frustumCulled = false, h.add(N);
  const me = (n, o, a) => {
    const t = new Ge(new Ht(1e4, 1e4), new tt({ side: bt, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(n, o, a), t.visible = false, t.frustumCulled = false, h.add(t), t;
  }, ae = me(Math.PI / 2, 0, 0), ee = me(0, Math.PI / 2, 0);
  let C = false;
  const te = () => {
    if (C) return b.intersectObjects([N], false);
    if (ae.visible = !!window.__hekatanGridPlaneXZ, ee.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Fe.visible) {
      const a = b.intersectObjects([Fe, $e, Ie], false);
      if (a.length > 0) return a;
    }
    const o = [N];
    return ae.visible && o.push(ae), ee.visible && o.push(ee), Bt.visible && Zt.length > 0 && o.push(...Zt), b.intersectObjects(o, false);
  }, G = new Tn(new Me(), new Vn()), xe = new Tn(new Me(), new Vn({ color: "gray", sizeAttenuation: false, size: 6 })), ye = new Tn(new Me(), new Vn({ color: "orange", size: 0.1 }));
  h.add(ye);
  const B = document.createElement("input");
  B.id = "hk-rubber-label", B.type = "text", B.spellcheck = false, B.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, B.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(B);
  let $ = null, X = null, A = false;
  const F = new M(), R = (n, o, a, t, i, s) => {
    const r = t - n, u = i - o, f = s - a, S = Math.hypot(r, u, f);
    if (S < 0.01) {
      B.style.display = "none";
      return;
    }
    $ = [n, o, a], X = [r / S, u / S, f / S], F.set((n + t) / 2, (o + i) / 2, (a + s) / 2), F.project(m());
    const _ = x.getBoundingClientRect(), c = _.left + (F.x * 0.5 + 0.5) * _.width, y = _.top + (-F.y * 0.5 + 0.5) * _.height;
    if (B.style.left = c + "px", B.style.top = y + "px", B.style.display = "block", !A) {
      if (B.value = `${S.toFixed(2)} m`, document.activeElement !== B) {
        const k = document.activeElement;
        k && (k.tagName === "INPUT" || k.tagName === "TEXTAREA") && k !== B || B.focus({ preventScroll: true });
      }
      try {
        B.select();
      } catch {
      }
    }
  }, I = () => {
    B.style.display = "none", $ = null, X = null, A = false, document.activeElement === B && B.blur();
  }, E = (n) => {
    var _a, _b, _c, _d;
    const o = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "col" || o === "wall" || o === "extp" || o === "extl") {
      dt = n, ie(`\u{1F4D0} Altura ${n}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), B.blur();
      return;
    }
    if (!$ || !X || !e.polylines) return;
    let a = X[0], t = X[1], i = X[2];
    nt === "x" ? (a = Math.sign(a) || 1, t = 0, i = 0) : nt === "y" ? (a = 0, t = Math.sign(t) || 1, i = 0) : nt === "z" && (a = 0, t = 0, i = Math.sign(i) || 1);
    const s = $[0] + a * n, r = $[1] + t * n, u = $[2] + i * n;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [s, r, u]];
    const f = e.polylines.rawVal, S = f.length ? f[f.length - 1] : [];
    e.polylines.val = [...f.slice(0, -1), [...S, e.points.rawVal.length - 1]], B.blur();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    g();
  }, J = (n) => {
    let o = n.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const a = o.startsWith("@");
    if (a && (o = o.slice(1)), o.includes("<")) {
      const i = o.split("<").map((s) => parseFloat(s.trim()));
      if (i.some(isNaN)) return null;
      if (i.length === 2) {
        const [s, r] = i;
        return a ? { kind: "relPolar", L: s, ang: r } : { kind: "absPolar", L: s, ang: r };
      }
      if (i.length === 3 && a) {
        const [s, r, u] = i;
        return { kind: "relSpherical", L: s, az: r, el: u };
      }
      return null;
    }
    if (o.includes(",")) {
      const i = o.split(",").map((f) => parseFloat(f.trim()));
      if (i.some(isNaN)) return null;
      const [s, r, u = 0] = i;
      return a ? { kind: "relCart", dx: s, dy: r, dz: u } : { kind: "absCart", x: s, y: r, z: u };
    }
    const t = parseFloat(o);
    return isNaN(t) || t <= 0 ? null : { kind: "length", L: t };
  }, le = (n) => {
    if (!n) return null;
    if (n.kind === "absCart") return [n.x, n.y, n.z];
    if (n.kind === "relCart") return $ ? [$[0] + n.dx, $[1] + n.dy, $[2] + n.dz] : null;
    if (n.kind === "absPolar") {
      const o = n.ang * Math.PI / 180;
      return [n.L * Math.cos(o), n.L * Math.sin(o), 0];
    }
    if (n.kind === "relPolar") {
      if (!$) return null;
      const o = n.ang * Math.PI / 180;
      return [$[0] + n.L * Math.cos(o), $[1] + n.L * Math.sin(o), $[2]];
    }
    if (n.kind === "relSpherical") {
      if (!$) return null;
      const o = n.az * Math.PI / 180, a = n.el * Math.PI / 180, t = n.L * Math.cos(a);
      return [$[0] + t * Math.cos(o), $[1] + t * Math.sin(o), $[2] + n.L * Math.sin(a)];
    }
    return null;
  }, ne = (n) => {
    var _a, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, n];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], $ = n, B.blur();
    try {
      (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
    } catch {
    }
    g();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (n) => {
    var _a, _b, _c, _d, _e2, _f, _g, _h;
    const o = J(n);
    if (!o) return false;
    if (o.kind === "length") return E(o.L), true;
    const a = le(o);
    if (!a) return false;
    const t = (_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool;
    if (t === "move" || t === "copy") return (_d = window.__hekatanPasoMoverCopiar) == null ? void 0 : _d.call(window, t, a), true;
    if (ne(a), ((_g = (_f = (_e2 = window.__hekatanCadState) == null ? void 0 : _e2.get) == null ? void 0 : _f.call(_e2)) == null ? void 0 : _g.tool) === "area" && e.polylines) {
      const s = e.polylines.rawVal, r = s.length - 1, u = s[r] ?? [];
      if (u.length === 4) {
        e.polylines.val = [...s.slice(0, -1), [...u, u[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, r]);
        try {
          (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
        } catch {
        }
      }
    }
    return true;
  }, B.addEventListener("keydown", (n) => {
    if (n.key === "Enter") {
      n.preventDefault();
      const a = J(B.value);
      if (!a) return;
      if (A = false, a.kind === "length") E(a.L), ie(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const t = le(a);
        if (!t) return;
        ne(t);
        const i = a.kind;
        ie(`\u270F ${i} \u2192 (${t[0].toFixed(2)}, ${t[1].toFixed(2)}, ${t[2].toFixed(2)})`);
      }
      return;
    }
    if (n.key === "Escape") {
      n.preventDefault(), A = false, B.blur();
      return;
    }
    const o = n.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      n.preventDefault(), setTimeout(() => {
        if (!A && B.style.display === "block") try {
          B.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(n.key) || n.key === "Backspace" || n.key === "Delete") && (A = true);
  }), window.addEventListener("keydown", (n) => {
    if (!$ || !X || document.activeElement === B) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(n.key) && (B.value = n.key, B.focus(), B.setSelectionRange(1, 1), n.preventDefault());
  });
  const j = document.createElement("div");
  j.id = "hk-coord-readout", j.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", j.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(j);
  const V = document.createElement("div");
  V.id = "hk-coord-fixed", V.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", V.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(V);
  const re = new kt(new Me().setFromPoints([new M(0, 0, 0), new M(0, 0, 0)]), new xn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  re.frustumCulled = false, re.visible = false, h.add(re);
  const q = new kt(new Me(), new rt({ color: 2282478, transparent: true, opacity: 0.9 }));
  q.frustumCulled = false, q.visible = false, h.add(q);
  let pe = [];
  const fe = new We(), Ae = new Ge(new Ht(1, 1), new tt({ color: 2282478, transparent: true, opacity: 0.08, side: bt, depthWrite: false })), ge = new Xt(new Fo(new Ht(1, 1)), new rt({ color: 2282478, transparent: true, opacity: 0.85 })), Te = new Xt(new Me(), new rt({ color: 2282478, transparent: true, opacity: 0.3 })), He = (n, o) => {
    const a = [], t = Math.ceil(n / o);
    for (let i = -t; i <= t; i++) {
      const s = i * o;
      a.push(-n, s, 0, n, s, 0), a.push(s, -n, 0, s, n, 0);
    }
    Te.geometry.dispose(), Te.geometry = new Me(), Te.geometry.setAttribute("position", new yt(a, 3));
  };
  fe.add(Ae, ge, Te), fe.visible = false, fe.frustumCulled = false, h.add(fe);
  const at = new We();
  at.frustumCulled = false, at.visible = false, h.add(at);
  const oe = (n) => {
    const o = new Me().setFromPoints([new M(0, 0, 0), new M(0, 0, 0)]), a = new xn({ color: n, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new kt(o, a);
  }, z = oe(16711680), K = oe(65280), D = oe(35071);
  at.add(z, K, D);
  const W = (n) => {
    const o = new Me().setFromPoints([new M(0, 0, 0), new M(0, 0, 0), new M(0, 0, 0), new M(0, 0, 0)]), a = new rt({ color: n, transparent: true, opacity: 0.2, depthTest: false }), t = new Uo(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, se = W(3462041), ue = W(16724804), ce = W(6333946), _e = new We();
  _e.frustumCulled = false, _e.visible = false, h.add(_e), _e.add(se, ue, ce);
  const Pe = (n) => {
    const o = new Ht(1, 1), a = new tt({ color: n, transparent: true, opacity: 0.06, side: bt, depthWrite: false }), t = new Ge(o, a);
    return t.frustumCulled = false, t.renderOrder = 996, t;
  }, Fe = Pe(3462041), $e = Pe(16724804), Ie = Pe(6333946);
  _e.add(Fe, $e, Ie);
  const Ue = (n, o, a, t) => {
    n.scale.set(2 * t, 2 * t, 1), a === "xy" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, 0, 0)) : a === "xz" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(Math.PI / 2, 0, 0)) : (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, Math.PI / 2, 0));
  }, Ee = document.createElement("div");
  Ee.id = "hk-refplane-badge", Ee.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ee), window.__hekatanSetOrthoPlanes = (n) => {
    var _a;
    if (window.__hekatanShowOrthoPlanes = n, _e.visible = n, n) {
      const o = window.__hekatanOrthoAnchor, a = ((_a = e.polylines) == null ? void 0 : _a.rawVal) ?? [], t = a[a.length - 1] ?? [], i = e.points.rawVal ?? [], s = o && o.length === 3 ? o : t.length > 0 && i[t[t.length - 1]] ? i[t[t.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      Ke(se, s, "xy", r), Ke(ue, s, "xz", r), Ke(ce, s, "yz", r), Ue(Fe, s, "xy", r), Ue($e, s, "xz", r), Ue(Ie, s, "yz", r), Fe.material.opacity = 0.05, $e.material.opacity = 0.05, Ie.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    g();
  }, window.__hekatanSetOrthoExt = (n) => {
    var _a;
    if (window.__hekatanOrthoExt = n, !_e.visible) {
      g();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a = e.polylines) == null ? void 0 : _a.rawVal) ?? [], t = a[a.length - 1] ?? [], i = e.points.rawVal ?? [], s = o && o.length === 3 ? o : t.length > 0 && i[t[t.length - 1]] ? i[t[t.length - 1]] : [0, 0, 0];
    Ke(se, s, "xy", n), Ke(ue, s, "xz", n), Ke(ce, s, "yz", n), Ue(Fe, s, "xy", n), Ue($e, s, "xz", n), Ue(Ie, s, "yz", n), g();
  };
  const ct = (n) => {
    if (Fe.material.opacity = n === "xy" ? 0.09 : 0.025, $e.material.opacity = n === "xz" ? 0.09 : 0.025, Ie.material.opacity = n === "yz" ? 0.09 : 0.025, n) {
      const i = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[n];
      Ee.style.background = i.bg, Ee.style.color = i.text, Ee.textContent = `\u25A6 Plano ${n.toUpperCase()}`, Ee.style.display = "block";
    } else Ee.style.display = "none";
  }, Ke = (n, o, a, t) => {
    let i;
    a === "xy" ? i = [new M(o[0] - t, o[1] - t, o[2]), new M(o[0] + t, o[1] - t, o[2]), new M(o[0] + t, o[1] + t, o[2]), new M(o[0] - t, o[1] + t, o[2]), new M(o[0] - t, o[1] - t, o[2])] : a === "xz" ? i = [new M(o[0] - t, o[1], o[2] - t), new M(o[0] + t, o[1], o[2] - t), new M(o[0] + t, o[1], o[2] + t), new M(o[0] - t, o[1], o[2] + t), new M(o[0] - t, o[1], o[2] - t)] : i = [new M(o[0], o[1] - t, o[2] - t), new M(o[0], o[1] + t, o[2] - t), new M(o[0], o[1] + t, o[2] + t), new M(o[0], o[1] - t, o[2] + t), new M(o[0], o[1] - t, o[2] - t)], n.geometry.setFromPoints(i);
  };
  let nt = null;
  window.__hekatanAxisLock = () => nt;
  let it = null;
  const ot = document.createElement("div");
  ot.id = "hk-axis-lock-badge", ot.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(ot);
  const Rt = () => {
    if (!nt) {
      ot.style.display = "none";
      return;
    }
    const n = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    ot.style.background = "rgba(15,23,42,0.92)", ot.style.color = n[nt], ot.style.border = `1.5px solid ${n[nt]}`, ot.textContent = `\u{1F512} LOCK ${nt.toUpperCase()}`, ot.style.display = "block";
  };
  window.addEventListener("keydown", (n) => {
    var _a, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== B) return;
    const a = n.key.toLowerCase(), t = (_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool;
    if (n.key === "Enter" && t === "polyarea" && pe.length >= 3) {
      const i = pn();
      ie(`\u2713 \xC1rea libre mallada \u2014 ${i} shells Q4 creados.`), n.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") nt = nt === a ? null : a, Rt(), n.preventDefault();
    else if (n.key === "Escape") {
      const i = document.activeElement;
      i && (i.tagName === "INPUT" || i.tagName === "TEXTAREA") && i.blur(), vo(), n.preventDefault();
    } else n.key === "F3" ? (n.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : n.key === "F10" ? (n.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : n.key === "F8" && (n.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const n = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = n, n || kn(), ie(`\u{1F9F2} OSNAP ${n ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const n = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = n, n || (at.visible = false), ie(`\u25C8 POLAR ${n ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const n = window.__hekatanOrthoMode;
      (_a = window.__hekatanRefreshStatus) == null ? void 0 : _a.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = n ? "block" : "none";
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = n ? "block" : "none";
    }
  };
  const Xe = new M(), Ve = new M(), Se = new M(), Ne = (n) => {
    if (!nt) return null;
    const o = n[0], a = n[1], t = n[2];
    return nt === "x" ? (Xe.set(o - 1e4, a, t), Ve.set(o + 1e4, a, t)) : nt === "y" ? (Xe.set(o, a - 1e4, t), Ve.set(o, a + 1e4, t)) : (Xe.set(o, a, t - 1e4), Ve.set(o, a, t + 1e4)), b.ray.distanceSqToSegment(Xe, Ve, null, Se), Se;
  };
  window.__hekatanProjectOnAxis = Ne;
  const we = new kt(new Me().setFromPoints([new M(0, 0, 0), new M(0, 0, 0)]), new rt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  we.renderOrder = 998, we.frustumCulled = false, we.visible = false, h.add(we);
  let Ze = -1, Je = -1, ft = -1;
  const he = /* @__PURE__ */ new Set();
  window.__hekatanSelection = he;
  const Be = new kt(new Me().setFromPoints([new M(), new M()]), new rt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Be.renderOrder = 997, Be.frustumCulled = false, Be.visible = false, h.add(Be);
  const Qe = new Ge(new dn(0.02, 12, 12), new tt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Qe.renderOrder = 998, Qe.visible = false, h.add(Qe);
  const mt = (n) => {
    const o = m();
    if (o.isOrthographicCamera) {
      const t = o, i = (t.top - t.bottom) / t.zoom;
      return Math.max(0.05, i * 6e-3);
    }
    const a = o.position.distanceTo(n);
    return Math.max(0.05, a / 10);
  }, Ut = () => {
    Qe.visible && Qe.scale.setScalar(mt(Qe.position));
  }, xt = new We();
  xt.frustumCulled = false, h.add(xt);
  const zt = 2282478;
  let st = null;
  const Wt = (n, o, a, t) => {
    if (!e.points) return -1;
    const i = e.points.rawVal;
    let s = -1, r = t;
    for (let u = 0; u < i.length; u++) {
      const f = i[u];
      if (!f) continue;
      const S = Math.hypot(n - f[0], o - f[1], a - f[2]);
      S < r && (r = S, s = u);
    }
    return s;
  }, Tt = () => {
    var _a, _b, _c, _d, _e2, _f, _g, _h;
    for (; xt.children.length; ) {
      const r = xt.children.pop();
      (_b = (_a = r.geometry) == null ? void 0 : _a.dispose) == null ? void 0 : _b.call(_a), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], t = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of he) {
      const [u, ...f] = r.split(":");
      if (u === "pt") {
        const S = n[+f[0]];
        if (!S) continue;
        const _ = new Ge(new dn(0.025, 12, 12), new tt({ color: zt, transparent: true, opacity: 0.9, depthTest: false }));
        _.position.set(S[0], S[1], S[2]), _.renderOrder = 999, _.__isSelectionPt = true, xt.add(_);
      } else if (u === "seg") {
        const S = o[+f[0]], _ = n[S == null ? void 0 : S[+f[1]]], c = n[S == null ? void 0 : S[+f[1] + 1]];
        if (!_ || !c) continue;
        const y = new Me().setFromPoints([new M(_[0], _[1], _[2]), new M(c[0], c[1], c[2])]), k = new kt(y, new rt({ color: zt, transparent: true, opacity: 0.95, depthTest: false }));
        k.renderOrder = 999, xt.add(k);
      } else if (u === "poly") {
        const _ = o[+f[0]].map((k) => {
          const T = n[k];
          return T ? new M(T[0], T[1], T[2]) : null;
        }).filter(Boolean);
        if (_.length < 2) continue;
        const c = new Me().setFromPoints(_), y = new kt(c, new rt({ color: zt, transparent: true, opacity: 0.95, depthTest: false }));
        y.renderOrder = 999, xt.add(y);
      } else if (u === "aux") {
        const S = t[+f[0]];
        if (!S || S.length !== 6) continue;
        const _ = new Me().setFromPoints([new M(S[0], S[1], S[2]), new M(S[3], S[4], S[5])]), c = new kt(_, new rt({ color: zt, transparent: true, opacity: 0.95, depthTest: false }));
        c.renderOrder = 999, xt.add(c);
      }
    }
    const i = window.__hekatanUpdateSelectionPtScale;
    i && i();
    const s = window.__hekatanRefreshPropsPane;
    s && s();
    try {
      (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
    } catch {
    }
    g();
  };
  window.__hekatanRefreshSelection = Tt, window.__hekatanClearSelection = () => {
    he.clear(), Tt();
  };
  const nn = (n, o, a, t, i, s, r, u, f) => {
    const S = r - t, _ = u - i, c = f - s, y = S * S + _ * _ + c * c;
    if (y < 1e-12) return Math.hypot(n - t, o - i, a - s);
    let k = ((n - t) * S + (o - i) * _ + (a - s) * c) / y;
    k = Math.max(0, Math.min(1, k));
    const T = t + k * S, Y = i + k * _, U = s + k * c;
    return Math.hypot(n - T, o - Y, a - U);
  }, Jt = (n, o, a, t) => {
    if (!e.polylines) return null;
    const i = e.polylines.rawVal, s = e.points.rawVal;
    let r = -1, u = -1, f = t;
    for (let S = 0; S < i.length; S++) {
      const _ = i[S];
      for (let c = 0; c < _.length - 1; c++) {
        const y = s[_[c]], k = s[_[c + 1]];
        if (!y || !k) continue;
        const T = nn(n, o, a, y[0], y[1], y[2], k[0], k[1], k[2]);
        T < f && (f = T, r = S, u = c);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: u, dist: f } : null;
  }, Ot = (n, o, a, t) => {
    const i = window.__hekatanDrawingAuxLines, s = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [];
    let r = -1, u = t;
    for (let f = 0; f < s.length; f++) {
      const S = s[f];
      if (!S || S.length !== 6) continue;
      const _ = nn(n, o, a, S[0], S[1], S[2], S[3], S[4], S[5]);
      _ < u && (u = _, r = f);
    }
    return r;
  }, Bn = (n) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[n];
    if (!t || t.length !== 6) {
      we.visible = false;
      return;
    }
    we.geometry.setFromPoints([new M(t[0], t[1], t[2]), new M(t[3], t[4], t[5])]), we.visible = true;
  }, Dn = (n, o = -1) => {
    var _a, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[n], t = e.points.rawVal;
    if (!a || a.length < 2) {
      we.visible = false;
      return;
    }
    const i = ((_b = (_a = e.areas) == null ? void 0 : _a.rawVal) == null ? void 0 : _b.includes(n)) ?? false, s = [];
    if (i || o < 0 || o >= a.length - 1) for (const r of a) {
      const u = t[r];
      u && s.push(new M(u[0], u[1], u[2]));
    }
    else {
      const r = t[a[o]], u = t[a[o + 1]];
      r && s.push(new M(r[0], r[1], r[2])), u && s.push(new M(u[0], u[1], u[2]));
    }
    we.geometry.setFromPoints(s), we.visible = true;
  }, on = (n) => {
    var _a;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (n < 0 || n >= o.length) return;
    const a = o.filter((f, S) => S !== n), t = /* @__PURE__ */ new Set();
    for (const f of a) for (const S of f) t.add(S);
    const i = e.points.rawVal, s = /* @__PURE__ */ new Map(), r = [];
    for (let f = 0; f < i.length; f++) t.has(f) && (s.set(f, r.length), r.push(i[f]));
    const u = a.map((f) => f.map((S) => s.get(S)).filter((S) => S !== void 0));
    e.points.val = r, e.polylines.val = u, e.areas && (e.areas.val = e.areas.rawVal.filter((f) => f !== n).map((f) => f > n ? f - 1 : f)), we.visible = false, Ze = -1, Je = -1;
    try {
      (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
    } catch {
    }
  }, Xn = (n, o) => {
    var _a, _b, _c;
    if (!e.polylines) return;
    const a = e.polylines.rawVal;
    if (n < 0 || n >= a.length) return;
    if (((_b = (_a = e.areas) == null ? void 0 : _a.rawVal) == null ? void 0 : _b.includes(n)) ?? false) {
      on(n);
      return;
    }
    const i = a[n];
    if (o < 0 || o >= i.length - 1) return;
    if (i.length === 2) {
      on(n);
      return;
    }
    let s;
    o === 0 ? s = [i.slice(1)] : o === i.length - 2 ? s = [i.slice(0, -1)] : s = [i.slice(0, o + 1), i.slice(o + 1)];
    const r = [...a.slice(0, n), ...s, ...a.slice(n + 1)], u = /* @__PURE__ */ new Set();
    for (const y of r) for (const k of y) u.add(k);
    const f = e.points.rawVal, S = /* @__PURE__ */ new Map(), _ = [];
    for (let y = 0; y < f.length; y++) u.has(y) && (S.set(y, _.length), _.push(f[y]));
    const c = r.map((y) => y.map((k) => S.get(k)).filter((k) => k !== void 0));
    if (e.points.val = _, e.polylines.val = c, e.areas) {
      const y = s.length - 1;
      e.areas.val = e.areas.rawVal.map((k) => k > n ? k + y : k);
    }
    we.visible = false, Ze = -1, Je = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  G.geometry.setAttribute("position", new yt(e.points.rawVal.flat(), 3)), G.geometry.computeBoundingSphere(), G.frustumCulled = false, xe.frustumCulled = false, h.add(xe), N.position.set(0, 0, 0), N.rotateX(Math.PI / 2), N.geometry.rotateX(Math.PI / 2), N.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (n, o, a) => {
    if (e.points.val = [...e.points.rawVal, [n, o, a]], e.polylines) {
      const t = e.polylines.rawVal, i = t.length ? t[t.length - 1] : [];
      e.polylines.val = [...t.slice(0, -1), [...i, e.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a;
    if (!e.polylines) return;
    const n = e.polylines.rawVal;
    ((_a = n[n.length - 1]) == null ? void 0 : _a.length) !== 0 && (e.polylines.val = [...n, []]);
  }, window.__hekatanDrawCircle = (n, o, a, t, i = window.__hekatanArcSegs ?? 12, s = "xy") => {
    var _a;
    const r = Math.max(4, Math.round(i)), u = e.points.rawVal.length, f = [];
    for (let S = 0; S < r; S++) {
      const _ = 2 * Math.PI * S / r, c = t * Math.cos(_), y = t * Math.sin(_);
      let k;
      s === "xy" ? k = [n + c, o + y, a] : s === "xz" ? k = [n + c, o, a + y] : k = [n, o + c, a + y], f.push(k);
    }
    if (e.points.val = [...e.points.rawVal, ...f], e.polylines) {
      const S = [...f.map((c, y) => u + y), u], _ = e.polylines.rawVal;
      ((_a = _[_.length - 1]) == null ? void 0 : _a.length) > 0 ? e.polylines.val = [..._, S, []] : e.polylines.val = [..._.slice(0, -1), S, []];
    }
  }, window.__hekatanDrawArc = (n, o, a, t = window.__hekatanArcSegs ?? 12) => {
    const i = Math.max(4, Math.round(t)), s = new M(...n), r = new M(...o), u = new M(...a), f = new M().subVectors(r, s), S = new M().subVectors(u, s), _ = new M().crossVectors(f, S).normalize(), c = new M().addVectors(s, r).multiplyScalar(0.5), y = new M().addVectors(r, u).multiplyScalar(0.5), k = new M().crossVectors(f, _).normalize(), T = new M().crossVectors(new M().subVectors(u, r), _).normalize(), Y = new M().subVectors(y, c), U = k.x * T.y - k.y * T.x;
    let L;
    if (Math.abs(U) > 1e-9) {
      const Re = (Y.x * T.y - Y.y * T.x) / U;
      L = new M().addVectors(c, k.clone().multiplyScalar(Re));
    } else L = c.clone();
    const O = s.distanceTo(L), Q = new M().subVectors(s, L), de = new M().subVectors(u, L), Le = Math.acos(Math.max(-1, Math.min(1, Q.dot(de) / (O * O)))), ve = e.points.rawVal.length, be = [], pt = _.clone();
    for (let Re = 0; Re <= i; Re++) {
      const Ce = Re / i, Ye = Le * Ce, qe = new to().setFromAxisAngle(pt, Ye), Oe = Q.clone().applyQuaternion(qe).add(L);
      be.push([Oe.x, Oe.y, Oe.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...be], e.polylines) {
      const Re = be.map((Ye, qe) => ve + qe), Ce = e.polylines.rawVal;
      e.polylines.val = [...Ce.slice(0, -1), Re, []];
    }
  }, window.__hekatanDrawSlabChaflan = (n, o, a = 1, t = 6, i = 6) => {
    const s = Math.min(n[0], o[0]), r = Math.max(n[0], o[0]), u = Math.min(n[1], o[1]), f = Math.max(n[1], o[1]), S = (n[2] + o[2]) / 2, _ = r - s, c = f - u, y = Math.min(a, _ / 2 - 0.01, c / 2 - 0.01);
    if (y <= 0) return;
    const k = e.points.rawVal.length, T = [], Y = [], U = (L, O) => {
      T.push([L, O, S]), Y.push(k + T.length - 1);
    };
    for (let L = 0; L <= i; L++) U(s + y + (_ - 2 * y) * L / i, u);
    for (let L = 1; L <= t; L++) {
      const O = -Math.PI / 2 + Math.PI / 2 * L / t;
      U(r - y + y * Math.cos(O), u + y + y * Math.sin(O));
    }
    for (let L = 1; L <= i; L++) U(r, u + y + (c - 2 * y) * L / i);
    for (let L = 1; L <= t; L++) {
      const O = 0 + Math.PI / 2 * L / t;
      U(r - y + y * Math.cos(O), f - y + y * Math.sin(O));
    }
    for (let L = 1; L <= i; L++) U(r - y - (_ - 2 * y) * L / i, f);
    for (let L = 1; L <= t; L++) {
      const O = Math.PI / 2 + Math.PI / 2 * L / t;
      U(s + y + y * Math.cos(O), f - y + y * Math.sin(O));
    }
    for (let L = 1; L <= i; L++) U(s, f - y - (c - 2 * y) * L / i);
    for (let L = 1; L <= t; L++) {
      const O = Math.PI + Math.PI / 2 * L / t;
      U(s + y + y * Math.cos(O), u + y + y * Math.sin(O));
    }
    if (Y.push(k), e.points.val = [...e.points.rawVal, ...T], e.polylines) {
      const L = e.polylines.rawVal;
      e.polylines.val = [...L.slice(0, -1), Y, []];
    }
  }, window.__hekatanDrawRect = (n, o) => {
    const a = e.points.rawVal.length, t = n[0], i = n[1], s = n[2], r = o[0], u = o[1], f = o[2];
    let S;
    if (Math.abs(s - f) < 1e-6 ? S = [[t, i, s], [r, i, s], [r, u, s], [t, u, s]] : Math.abs(i - u) < 1e-6 ? S = [[t, i, s], [r, i, s], [r, i, f], [t, i, f]] : S = [[t, i, s], [t, u, s], [t, u, f], [t, i, f]], e.points.val = [...e.points.rawVal, ...S], e.polylines) {
      const _ = [a, a + 1, a + 2, a + 3, a], c = e.polylines.rawVal;
      e.polylines.val = [...c.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRectArea = (n, o) => {
    var _a;
    const a = e.points.rawVal.length, t = n[0], i = n[1], s = n[2], r = o[0], u = o[1], f = o[2];
    let S;
    if (C && e.gridTarget) {
      const _ = e.gridTarget.rawVal, c = new gn(..._.rotation), y = new M(1, 0, 0).applyEuler(c), k = new M(0, 1, 0).applyEuler(c), T = new M(..._.position), Y = new M(t, i, s), U = new M(r, u, f), L = Y.clone().sub(T).dot(y), O = Y.clone().sub(T).dot(k), Q = U.clone().sub(T).dot(y), de = U.clone().sub(T).dot(k), Le = (ve, be) => T.clone().addScaledVector(y, ve).addScaledVector(k, be).toArray();
      S = [Le(L, O), Le(Q, O), Le(Q, de), Le(L, de)];
    } else Math.abs(s - f) < 1e-6 ? S = [[t, i, s], [r, i, s], [r, u, s], [t, u, s]] : Math.abs(i - u) < 1e-6 ? S = [[t, i, s], [r, i, s], [r, i, f], [t, i, f]] : S = [[t, i, s], [t, u, s], [t, u, f], [t, i, f]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...S], e.polylines) {
      const _ = e.polylines.rawVal, c = _.length - 1, y = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [..._.slice(0, -1), y, []], e.areas && (e.areas.val = [...e.areas.rawVal, c]);
    }
    try {
      (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
    } catch {
    }
    g();
  }, window.__hekatanMeshPolyArea = (n, o) => {
    var _a;
    const a = n.length;
    if (a < 3) return 0;
    let t = 0, i = 0, s = 0;
    for (let ke = 0; ke < a; ke++) {
      const De = n[ke], et = n[(ke + 1) % a];
      t += (De[1] - et[1]) * (De[2] + et[2]), i += (De[2] - et[2]) * (De[0] + et[0]), s += (De[0] - et[0]) * (De[1] + et[1]);
    }
    const r = Math.hypot(t, i, s) || 1;
    t /= r, i /= r, s /= r;
    let u = n[1][0] - n[0][0], f = n[1][1] - n[0][1], S = n[1][2] - n[0][2];
    const _ = Math.hypot(u, f, S) || 1;
    u /= _, f /= _, S /= _;
    let c = i * S - s * f, y = s * u - t * S, k = t * f - i * u;
    const T = Math.hypot(c, y, k) || 1;
    c /= T, y /= T, k /= T;
    const Y = n[0], U = (ke) => [(ke[0] - Y[0]) * u + (ke[1] - Y[1]) * f + (ke[2] - Y[2]) * S, (ke[0] - Y[0]) * c + (ke[1] - Y[1]) * y + (ke[2] - Y[2]) * k], L = (ke, De) => [Y[0] + ke * u + De * c, Y[1] + ke * f + De * y, Y[2] + ke * S + De * k], O = n.map(U);
    let Q = 1 / 0, de = -1 / 0, Le = 1 / 0, ve = -1 / 0;
    for (const [ke, De] of O) ke < Q && (Q = ke), ke > de && (de = ke), De < Le && (Le = De), De > ve && (ve = De);
    const be = de - Q, pt = ve - Le;
    if (be < 1e-6 || pt < 1e-6) return 0;
    let Re = o && o > 0 ? o : 0.5;
    for (; be / Re * (pt / Re) > 2500; ) Re *= 2;
    Re = Math.min(Re, Math.min(be, pt));
    const Ce = (ke, De) => {
      let et = false;
      for (let Lt = 0, Gt = O.length - 1; Lt < O.length; Gt = Lt++) {
        const [rn, wn] = O[Lt], [cn, yn] = O[Gt];
        wn > De != yn > De && ke < (cn - rn) * (De - wn) / (yn - wn) + rn && (et = !et);
      }
      return et;
    }, Ye = Math.max(1, Math.round(be / Re)), qe = Math.max(1, Math.round(pt / Re)), Oe = be / Ye, ht = pt / qe, Nt = /* @__PURE__ */ new Map(), Ct = [], vt = e.points.rawVal.length, Vt = (ke, De) => {
      const et = ke + "," + De, Lt = Nt.get(et);
      if (Lt !== void 0) return Lt;
      const Gt = vt + Ct.length;
      return Ct.push(L(Q + ke * Oe, Le + De * ht)), Nt.set(et, Gt), Gt;
    }, St = [];
    for (let ke = 0; ke < Ye; ke++) for (let De = 0; De < qe; De++) {
      if (!Ce(Q + (ke + 0.5) * Oe, Le + (De + 0.5) * ht)) continue;
      const et = Vt(ke, De), Lt = Vt(ke + 1, De), Gt = Vt(ke + 1, De + 1), rn = Vt(ke, De + 1);
      St.push([et, Lt, Gt, rn]);
    }
    if (!St.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...Ct], e.polylines && e.areas) {
      let ke = e.polylines.rawVal.slice();
      ke.length && ke[ke.length - 1].length === 0 && (ke = ke.slice(0, -1));
      const De = [];
      for (const et of St) De.push(ke.length), ke.push([et[0], et[1], et[2], et[3], et[0]]);
      ke.push([]), e.polylines.val = ke, e.areas.val = [...e.areas.rawVal, ...De];
    }
    try {
      (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
    } catch {
    }
    return g(), St.length;
  };
  const pn = () => {
    if (pe.length < 3) return pe = [], q.visible = false, g(), 0;
    const n = window.__hekatanMeshPolyArea(pe.slice());
    return pe = [], q.visible = false, g(), n;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (n, o, a) => {
    var _a;
    const t = new M(n[0], n[1], n[2]), i = new M(o[0], o[1], o[2]), s = new M(a[0], a[1], a[2]), r = new M().subVectors(i, t).cross(new M().subVectors(s, t));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const u = new to().setFromUnitVectors(new M(0, 0, 1), r), f = new gn().setFromQuaternion(u);
    e.gridTarget && (e.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [f.x, f.y, f.z] }), C = true;
    const S = new M().addVectors(t, i).add(s).multiplyScalar(1 / 3), _ = Math.max(t.distanceTo(i), t.distanceTo(s), i.distanceTo(s)) * 2.2 + 4, c = _ / 2;
    Ae.geometry.dispose(), Ae.geometry = new Ht(_, _), ge.geometry.dispose(), ge.geometry = new Fo(new Ht(_, _)), He(c, 1), fe.position.copy(S), fe.quaternion.copy(u), fe.scale.set(1, 1, 1), fe.visible = true;
    try {
      (_a = window.__hekatanRefreshStatus) == null ? void 0 : _a.call(window);
    } catch {
    }
    return g(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] }), C = false, fe.visible = false, g();
  };
  const Ft = new We();
  Ft.visible = false, h.add(Ft), window.__hekatanShowAxes = (n, o, a = 12, t = 2) => {
    var _a, _b;
    for (; Ft.children.length; ) {
      const _ = Ft.children.pop();
      (_a = _.geometry) == null ? void 0 : _a.dispose(), (_b = _.material) == null ? void 0 : _b.dispose();
    }
    if (!n.length || !o.length) return;
    const i = Math.min(...o) - t, s = Math.max(...o) + t, r = Math.min(...n) - t, u = Math.max(...n) + t, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", S = (_, c, y, k, T) => {
      const Y = document.createElement("canvas");
      Y.width = 64, Y.height = 32;
      const U = Y.getContext("2d");
      U.fillStyle = T, U.font = "bold 22px sans-serif", U.textAlign = "center", U.fillText(_, 32, 26);
      const L = new Ao(Y), O = new Eo({ map: L, transparent: true }), Q = new To(O);
      return Q.position.set(c, y, k), Q.scale.set(1.2, 0.6, 1), Q;
    };
    n.forEach((_, c) => {
      const y = c < f.length ? f[c] : `X${c}`, k = new Me().setFromPoints([new M(_, i, 0), new M(_, s, 0), new M(_, i, 0), new M(_, i, a)]), T = new xn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), Y = new Xt(k, T);
      Y.computeLineDistances(), Ft.add(Y), Ft.add(S(y, _, i - 0.5, 0, "#60a5fa")), Ft.add(S(y, _, s + 0.5, 0, "#60a5fa"));
    }), o.forEach((_, c) => {
      const y = `${c + 1}`, k = new Me().setFromPoints([new M(r, _, 0), new M(u, _, 0), new M(r, _, 0), new M(r, _, a)]), T = new xn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), Y = new Xt(k, T);
      Y.computeLineDistances(), Ft.add(Y), Ft.add(S(y, r - 0.5, _, 0, "#fb7185")), Ft.add(S(y, u + 0.5, _, 0, "#fb7185"));
    }), Ft.visible = true, g();
  }, window.__hekatanHideAxes = () => {
    Ft.visible = false, g();
  };
  const Bt = new We();
  Bt.visible = false, h.add(Bt);
  let Zt = [];
  window.__hekatanShowRefPlanes = (n = [0, 3, 6, 9, 12], o = 20, a = 0, t = 0) => {
    var _a, _b;
    for (; Bt.children.length; ) {
      const s = Bt.children.pop();
      (_a = s.geometry) == null ? void 0 : _a.dispose(), (_b = s.material) == null ? void 0 : _b.dispose();
    }
    Zt.forEach((s) => {
      h.remove(s), s.geometry.dispose(), s.material.dispose();
    }), Zt = [];
    const i = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    n.forEach((s, r) => {
      const u = i[r % i.length], f = o / 2, S = [new M(a - f, t - f, s), new M(a + f, t - f, s), new M(a + f, t + f, s), new M(a - f, t + f, s), new M(a - f, t - f, s)], _ = new Me().setFromPoints(S), c = new rt({ color: u, transparent: true, opacity: 0.55 });
      Bt.add(new kt(_, c));
      const y = document.createElement("canvas");
      y.width = 128, y.height = 32;
      const k = y.getContext("2d");
      k.fillStyle = `#${u.toString(16).padStart(6, "0")}`, k.font = "bold 18px sans-serif", k.fillText(`Z = ${s} m`, 4, 22);
      const T = new Ao(y), Y = new Eo({ map: T, transparent: true }), U = new To(Y);
      U.position.set(a - f - 1.5, t - f - 1.5, s), U.scale.set(2.5, 0.6, 1), Bt.add(U);
      const L = new Ht(1e4, 1e4), O = new tt({ visible: false, side: bt }), Q = new Ge(L, O);
      Q.position.set(0, 0, s), Q.frustumCulled = false, Q.userData = { refPlaneZ: s }, h.add(Q), Zt.push(Q);
    }), Bt.visible = true, g();
  }, window.__hekatanHideRefPlanes = () => {
    Bt.visible = false, Zt.forEach((n) => {
      n.visible = false;
    }), g();
  };
  const Qt = new We();
  Qt.frustumCulled = false, h.add(Qt);
  const Yn = () => {
    var _a, _b, _c, _d;
    for (; Qt.children.length; ) {
      const a = Qt.children.pop();
      (_b = (_a = a.geometry) == null ? void 0 : _a.dispose) == null ? void 0 : _b.call(_a), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxLines, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const t = new Me().setFromPoints([new M(a[0], a[1], a[2]), new M(a[3], a[4], a[5])]), i = new xn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), s = new kt(t, i);
      s.computeLineDistances(), Qt.add(s);
    }
  };
  Z.derive(() => {
    const n = window.__hekatanDrawingAuxLines;
    (n == null ? void 0 : n.val) && (n.val, Yn(), g());
  });
  const Kt = new We();
  Kt.frustumCulled = false, h.add(Kt);
  const un = () => {
    var _a, _b, _c, _d;
    for (; Kt.children.length; ) {
      const a = Kt.children.pop();
      (_b = (_a = a.geometry) == null ? void 0 : _a.dispose) == null ? void 0 : _b.call(_a), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxPoints, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const t = new Ge(new dn(0.025, 12, 12), new tt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      t.position.set(a[0], a[1], a[2]), t.renderOrder = 996, t.scale.setScalar(mt(t.position)), Kt.add(t);
    }
  };
  Z.derive(() => {
    const n = window.__hekatanDrawingAuxPoints;
    (n == null ? void 0 : n.val) !== void 0 && (n.val, un(), g());
  }), d.addEventListener("change", () => {
    Kt.children.forEach((n) => {
      n.scale.setScalar(mt(n.position));
    });
  }), window.__hekatanRenderAuxPoints = un;
  const gt = new We(), Oo = new Ge(new dn(0.01, 12, 12), new tt({ color: 16724804, transparent: true, opacity: 0.95 })), Qo = new Ge(new dn(0.015, 12, 12), new tt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  gt.add(Oo, Qo);
  const sn = 0.08, Nn = (n, o, a) => {
    const t = new Me().setFromPoints([new M(...n), new M(...o)]);
    return new kt(t, new rt({ color: a, transparent: true, opacity: 0.7 }));
  };
  gt.add(Nn([-sn, 0, 0], [sn, 0, 0], 16711680)), gt.add(Nn([0, -sn, 0], [0, sn, 0], 65280)), gt.add(Nn([0, 0, -sn], [0, 0, sn], 35071)), gt.visible = false, gt.frustumCulled = false, h.add(gt);
  const uo = 40, jo = 2.5, Un = () => {
    if (!gt.visible) return;
    const o = m().position.distanceTo(gt.position), a = Math.max(0.05, Math.min(jo, o / uo));
    gt.scale.setScalar(a);
  }, fo = () => {
    xt.children.length !== 0 && xt.children.forEach((n) => {
      if (!n.__isSelectionPt) return;
      const o = n;
      o.scale.setScalar(mt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = fo, d.addEventListener("change", () => {
    Un(), Qe.visible && Ut();
    const n = window.__hekatanOsnapMarkerRef;
    if (n == null ? void 0 : n.visible) {
      const o = m().position.distanceTo(n.position);
      n.scale.setScalar(Math.max(0.05, o / uo));
    }
    fo();
  }), window.__hekatanShowSnap = (n, o, a) => {
    gt.position.set(n, o, a), gt.visible = true, Un(), g();
  }, window.__hekatanHideSnap = () => {
    gt.visible = false, g();
  }, x.addEventListener("pointermove", (n) => {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q;
    const o = v(n);
    if (!o) return;
    b.setFromCamera(P, o);
    const a = te();
    if (a.length) {
      const t = a[0].point, i = (window.__hekatanSnap2D ?? 0.5) * 1.2, s = (_a = window.__hekatanOsnapCompute) == null ? void 0 : _a.call(window, t.x, t.y, t.z, i);
      if (s) yo(s.type, s.x, s.y, s.z), gt.position.set(s.x, s.y, s.z), gt.visible = true, t.set(s.x, s.y, s.z);
      else {
        kn();
        const _ = window.__hekatanSnapEnabled !== false, c = window.__hekatanSnap2D ?? 0.5;
        _ && c > 0 && (t.x = Math.round(t.x / c) * c, t.y = Math.round(t.y / c) * c, t.z = Math.round(t.z / c) * c), gt.position.copy(t), gt.visible = true;
      }
      Un();
      const r = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (r === "select" || !r) {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, c = Wt(t.x, t.y, t.z, _), y = Jt(t.x, t.y, t.z, _), k = Ot(t.x, t.y, t.z, _);
        if (c >= 0) {
          const L = e.points.rawVal[c];
          Qe.position.set(L[0], L[1], L[2]), Qe.visible = true, Ut(), Be.visible = false, st = { kind: "pt", a: c };
        } else if (y) {
          const L = e.points.rawVal, O = e.polylines.rawVal[y.polyIdx], Q = L[O[y.segIdx]], de = L[O[y.segIdx + 1]];
          Be.geometry.setFromPoints([new M(Q[0], Q[1], Q[2]), new M(de[0], de[1], de[2])]), Be.visible = true, Qe.visible = false, st = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(y.polyIdx)) ?? false ? { kind: "poly", a: y.polyIdx } : { kind: "seg", a: y.polyIdx, b: y.segIdx };
        } else if (k >= 0) {
          const O = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[k];
          O && (Be.geometry.setFromPoints([new M(O[0], O[1], O[2]), new M(O[3], O[4], O[5])]), Be.visible = true, Qe.visible = false, st = { kind: "aux", a: k });
        } else Be.visible = false, Qe.visible = false, st = null;
        j.style.left = n.clientX + "px", j.style.top = n.clientY + "px", j.style.display = "block";
        let T = t;
        if ((st == null ? void 0 : st.kind) === "pt") {
          const L = e.points.rawVal[st.a];
          L && (T = new M(L[0], L[1], L[2]));
        }
        const Y = `X=${T.x.toFixed(2)} Y=${T.y.toFixed(2)} Z=${T.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [T.x, T.y, T.z], st) {
          const L = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          j.textContent = `${Y}  \xB7  \u{1F5B1} Click \u2192 ${L[st.kind]}`;
        } else j.textContent = Y;
        const U = document.getElementById("hk-coord-fixed");
        U && (U.textContent = Y), re.visible = false, at.visible = false, g();
        return;
      }
      if (r === "delete") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, c = Jt(t.x, t.y, t.z, _), y = Ot(t.x, t.y, t.z, _);
        let k = false;
        if (y >= 0) if (!c) k = true;
        else {
          const L = window.__hekatanDrawingAuxLines, Q = ((L == null ? void 0 : L.rawVal) ?? (L == null ? void 0 : L.val) ?? L ?? [])[y];
          nn(t.x, t.y, t.z, Q[0], Q[1], Q[2], Q[3], Q[4], Q[5]) < c.dist && (k = true);
        }
        k ? (ft = y, Ze = -1, Je = -1, Bn(y)) : c ? (Ze = c.polyIdx, Je = c.segIdx, ft = -1, Dn(c.polyIdx, c.segIdx)) : (Ze = -1, Je = -1, ft = -1, we.visible = false), re.visible = false, at.visible = false, I(), j.style.left = n.clientX + "px", j.style.top = n.clientY + "px", j.style.display = "block";
        const T = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        let Y = "";
        k ? Y = `\u{1F5D1} l\xEDnea aux #${ft + 1}` : c ? Y = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(c.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${c.polyIdx + 1}` : `\u{1F5D1} seg ${c.segIdx + 1} / poly #${c.polyIdx + 1}` : Y = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", j.textContent = `${T}  \xB7  ${Y}`;
        const U = document.getElementById("hk-coord-fixed");
        U && (U.textContent = T), g();
        return;
      } else we.visible = false, Ze = -1, ft = -1;
      j.style.left = n.clientX + "px", j.style.top = n.clientY + "px", j.style.display = "block";
      const u = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], f = u[u.length - 1] ?? [], S = e.points.rawVal ?? [];
      if (f.length > 0 && S[f[f.length - 1]]) {
        const _ = f[f.length - 1], c = S[_];
        let y = nt;
        if (it = null, !y && window.__hekatanAxisSnap !== false) {
          const Ce = x.getBoundingClientRect(), Ye = n.clientX, qe = n.clientY, Oe = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, ht = new M(c[0], c[1], c[2]), Nt = [["x", new M(1, 0, 0)], ["y", new M(0, 1, 0)], ["z", new M(0, 0, 1)]], Ct = (Vt) => {
            const St = Vt.clone().project(o);
            return { x: (St.x * 0.5 + 0.5) * Ce.width + Ce.left, y: (-St.y * 0.5 + 0.5) * Ce.height + Ce.top };
          };
          let vt = null;
          for (const [Vt, St] of Nt) {
            const ke = Ct(ht.clone().addScaledVector(St, -Oe)), De = Ct(ht.clone().addScaledVector(St, Oe)), et = De.x - ke.x, Lt = De.y - ke.y, Gt = Ye - ke.x, rn = qe - ke.y, wn = et * et + Lt * Lt || 1;
            let cn = (Gt * et + rn * Lt) / wn;
            cn = Math.max(0, Math.min(1, cn));
            const yn = Math.hypot(Ye - (ke.x + cn * et), qe - (ke.y + cn * Lt));
            if (vt === null || yn < vt.dpx) {
              const On = b.ray, So = ht.clone().sub(On.origin), Qn = St.dot(On.direction), ko = St.dot(So), ls = On.direction.dot(So), Po = 1 - Qn * Qn, rs = Math.abs(Po) < 1e-6 ? -ko : (Qn * ls - ko) / Po;
              vt = { axis: Vt, dpx: yn, pt: ht.clone().addScaledVector(St, rs) };
            }
          }
          vt && vt.dpx <= 12 && (t.copy(vt.pt), y = vt.axis, it = vt.pt.clone());
        }
        const k = !!window.__hekatanOrthoMode;
        if (!y && k) {
          const Ce = Math.abs(t.x - c[0]), Ye = Math.abs(t.y - c[1]), qe = Math.abs(t.z - c[2]), Oe = (_l = a[0]) == null ? void 0 : _l.object;
          let ht = null;
          Oe === Fe ? ht = "xy" : Oe === $e ? ht = "xz" : Oe === Ie && (ht = "yz"), ht === "xy" ? y = Ce >= Ye ? "x" : "y" : ht === "xz" ? y = Ce >= qe ? "x" : "z" : ht === "yz" ? y = Ye >= qe ? "y" : "z" : y = Ce >= Ye && Ce >= qe ? "x" : Ye >= qe ? "y" : "z";
        }
        const T = window.__hekatanPolarTrack !== false;
        if (!y && T) {
          const Ce = t.x - c[0], Ye = t.y - c[1], qe = t.z - c[2], Oe = Math.hypot(Ce, Ye, qe);
          if (Oe > 1e-3) {
            const Nt = Math.tan(6 * Math.PI / 180) * Oe, Ct = Math.hypot(Ye, qe), vt = Math.hypot(Ce, qe), Vt = Math.hypot(Ce, Ye), St = [["x", Ct], ["y", vt], ["z", Vt]];
            St.sort((ke, De) => ke[1] - De[1]), St[0][1] <= Nt && (y = St[0][0]);
          }
        }
        if (y) {
          const Ce = c[0], Ye = c[1], qe = c[2];
          y === "x" ? t.set(t.x, Ye, qe) : y === "y" ? t.set(Ce, t.y, qe) : t.set(Ce, Ye, t.z);
          const Oe = !!nt, Nt = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[y];
          ot.style.background = "rgba(15,23,42,0.92)", ot.style.color = Nt, ot.style.border = `1.5px solid ${Nt}`;
          const Ct = (_m = a[0]) == null ? void 0 : _m.object;
          let vt = null;
          Ct === Fe ? vt = "xy" : Ct === $e ? vt = "xz" : Ct === Ie && (vt = "yz");
          const Vt = vt ? ` (plano ${vt.toUpperCase()})` : "";
          ot.textContent = Oe ? `\u{1F512} LOCK ${y.toUpperCase()}${Vt}` : `\u22A5 ORTO ${y.toUpperCase()}${Vt}`, ot.style.left = n.clientX + 20 + "px", ot.style.top = n.clientY + 18 + "px", ot.style.transform = "none", ot.style.display = "block";
        } else nt || (ot.style.display = "none");
        const Y = Math.hypot(t.x - c[0], t.y - c[1], t.z - c[2]), U = Math.atan2(t.y - c[1], t.x - c[0]) * 180 / Math.PI, L = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        j.textContent = `${L} | \u0394L=${Y.toFixed(2)}m ${U.toFixed(0)}\xB0`;
        const O = document.getElementById("hk-coord-fixed");
        O && (O.textContent = L), re.geometry.setFromPoints([new M(c[0], c[1], c[2]), new M(t.x, t.y, t.z)]), (_n2 = re.computeLineDistances) == null ? void 0 : _n2.call(re), re.visible = true, R(c[0], c[1], c[2], t.x, t.y, t.z);
        const Q = window.__hekatanOrthoExt ?? 8, de = window.__hekatanShowOrthoPlanes !== false;
        _e.visible = de, de || ct(null), de && (Ke(se, c, "xy", Q), Ke(ue, c, "xz", Q), Ke(ce, c, "yz", Q), Ue(Fe, c, "xy", Q), Ue($e, c, "xz", Q), Ue(Ie, c, "yz", Q));
        const Le = de ? b.intersectObjects([Fe, $e, Ie], false) : [];
        let ve = null;
        if (Le.length > 0) {
          const Ce = Le[0].object;
          Ce === Fe ? ve = "xy" : Ce === $e ? ve = "xz" : Ce === Ie && (ve = "yz");
        }
        ct(ve), ve && (Ee.style.left = n.clientX + "px", Ee.style.top = n.clientY + "px"), z.geometry.setFromPoints([new M(c[0] - Q, c[1], c[2]), new M(c[0] + Q, c[1], c[2])]), (_o2 = z.computeLineDistances) == null ? void 0 : _o2.call(z), K.geometry.setFromPoints([new M(c[0], c[1] - Q, c[2]), new M(c[0], c[1] + Q, c[2])]), (_p = K.computeLineDistances) == null ? void 0 : _p.call(K), D.geometry.setFromPoints([new M(c[0], c[1], c[2] - Q), new M(c[0], c[1], c[2] + Q)]), (_q = D.computeLineDistances) == null ? void 0 : _q.call(D), at.visible = true;
        const be = z.material, pt = K.material, Re = D.material;
        y === "x" ? (be.opacity = 0.95, pt.opacity = 0.1, Re.opacity = 0.1) : y === "y" ? (be.opacity = 0.1, pt.opacity = 0.95, Re.opacity = 0.1) : y === "z" ? (be.opacity = 0.1, pt.opacity = 0.1, Re.opacity = 0.95) : (be.opacity = 0.5, pt.opacity = 0.5, Re.opacity = 0.5);
      } else {
        const _ = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        j.textContent = _;
        const c = document.getElementById("hk-coord-fixed");
        if (c && (c.textContent = _), re.visible = false, at.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(r)) {
          if ($ = null, X = null, B.style.left = n.clientX + 20 + "px", B.style.top = n.clientY - 28 + "px", B.style.display = "block", !A) {
            B.value = `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}`;
            const k = document.activeElement;
            !(k && (k.tagName === "INPUT" || k.tagName === "TEXTAREA") && k !== B) && document.activeElement !== B && B.focus({ preventScroll: true });
            try {
              B.select();
            } catch {
            }
          }
        } else I();
      }
      g();
    } else kn(), j.style.display = "none", gt.visible = false, re.visible = false, at.visible = false, I(), g();
  }), Z.derive(() => {
    if (!e.gridTarget) return;
    Js(l, { position: new M(...e.gridTarget.val.position), quaternion: new to().setFromEuler(new gn(...e.gridTarget.val.rotation)) }, g), N.position.set(...e.gridTarget.val.position), N.quaternion.setFromEuler(new gn(...e.gridTarget.val.rotation)), N.updateMatrixWorld();
    const n = new M(0, 0, 1).applyEuler(new gn(...e.gridTarget.val.rotation));
    C = !(Math.abs(n.x) > 0.999 || Math.abs(n.y) > 0.999 || Math.abs(n.z) > 0.999);
  }), Z.derive(() => {
    G.geometry.setAttribute("position", new yt(e.points.val.flat(), 3)), G.geometry.computeBoundingSphere();
  }), Z.derive(() => {
    const n = 0.05 * w * 0.5 * p.val;
    b.params.Points.threshold = 0.4 * n;
  }), Z.derive(() => {
    var _a;
    const n = e.points.val ?? [], a = (((_a = e.polylines) == null ? void 0 : _a.val) ?? []).at(-1) ?? [], t = [];
    for (const s of a) {
      const [r, u, f] = n[s];
      t.push(r, u, f);
    }
    const i = new Me();
    i.setAttribute("position", new yt(t, 3)), ye.geometry.dispose(), ye.geometry = i;
  });
  let Zn = false, jt = 0;
  x.addEventListener("pointerdown", () => {
    Zn = true;
  }), x.addEventListener("pointerup", () => {
    Zn = false;
  }), x.addEventListener("pointermove", () => {
    Zn && jt++;
  });
  const Pt = document.createElement("div");
  Pt.id = "hk-window-select", Pt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Pt);
  let $t = null, fn = false, Et = null;
  const Kn = (n, o, a, t, i) => {
    i ? (Pt.style.borderColor = "#34d399", Pt.style.borderStyle = "dashed", Pt.style.background = "rgba(52, 211, 153, 0.10)") : (Pt.style.borderColor = "#22d3ee", Pt.style.borderStyle = "solid", Pt.style.background = "rgba(34, 211, 238, 0.10)"), Pt.style.left = Math.min(n, a) + "px", Pt.style.top = Math.min(o, t) + "px", Pt.style.width = Math.abs(a - n) + "px", Pt.style.height = Math.abs(t - o) + "px", Pt.style.display = "block";
  }, ho = (n, o, a, t, i) => {
    var _a, _b, _c, _d;
    const s = Math.min(n, a), r = Math.max(n, a), u = Math.min(o, t), f = Math.max(o, t), S = a < n, _ = x.getBoundingClientRect(), c = m();
    c.updateMatrixWorld();
    const y = (ve) => {
      const be = new M(ve[0], ve[1], ve[2]);
      return be.project(c), { x: _.left + (be.x * 0.5 + 0.5) * _.width, y: _.top + (-be.y * 0.5 + 0.5) * _.height };
    }, k = (ve) => ve.x >= s && ve.x <= r && ve.y >= u && ve.y <= f, T = (ve, be) => !(ve.x < s && be.x < s || ve.x > r && be.x > r || ve.y < u && be.y < u || ve.y > f && be.y > f);
    i || he.clear();
    let Y = 0;
    const U = ((_a = e.points) == null ? void 0 : _a.rawVal) ?? [];
    for (let ve = 0; ve < U.length; ve++) {
      const be = U[ve];
      be && k(y(be)) && (he.add(`pt:${ve}`), Y++);
    }
    const L = (ve, be) => S ? k(ve) || k(be) || T(ve, be) : k(ve) && k(be), O = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], Q = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let ve = 0; ve < O.length; ve++) {
      const be = O[ve];
      if (Q.includes(ve)) {
        let Re;
        if (!S) Re = be.every((Ce) => {
          const Ye = U[Ce];
          return !!Ye && k(y(Ye));
        });
        else {
          Re = false;
          for (let Ce = 0; Ce < be.length - 1; Ce++) {
            const Ye = U[be[Ce]], qe = U[be[Ce + 1]];
            if (!(!Ye || !qe) && L(y(Ye), y(qe))) {
              Re = true;
              break;
            }
          }
        }
        Re && (he.add(`poly:${ve}`), Y++);
      } else for (let Re = 0; Re < be.length - 1; Re++) {
        const Ce = U[be[Re]], Ye = U[be[Re + 1]];
        !Ce || !Ye || L(y(Ce), y(Ye)) && (he.add(`seg:${ve}:${Re}`), Y++);
      }
    }
    const Le = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let ve = 0; ve < Le.length; ve++) {
      const be = Le[ve];
      if (!be || be.length !== 6) continue;
      const pt = y([be[0], be[1], be[2]]), Re = y([be[3], be[4], be[5]]);
      L(pt, Re) && (he.add(`aux:${ve}`), Y++);
    }
    Tt(), ie(`${S ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${Y} item(s) ${i ? "agregados a" : "\u2192"} selecci\xF3n (total ${he.size})`), Pt.style.display = "none";
  }, _n = () => {
    Et && (Et = null, Pt.style.display = "none", ie("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = _n, window.addEventListener("keydown", (n) => {
    n.key === "Escape" && Et && _n();
  });
  const mo = () => {
    var _a, _b, _c, _d;
    if (he.size === 0) return false;
    const n = [...he], o = ((_a = e.points) == null ? void 0 : _a.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], i = window.__hekatanDrawingAuxLines, s = (i == null ? void 0 : i.rawVal) ?? [], r = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set();
    for (const T of n) {
      const [Y, ...U] = T.split(":");
      if (Y === "pt") r.add(+U[0]);
      else if (Y === "poly") u.add(+U[0]);
      else if (Y === "seg") {
        const L = +U[0], O = +U[1];
        f.has(L) || f.set(L, /* @__PURE__ */ new Set()), f.get(L).add(O);
      } else Y === "aux" && S.add(+U[0]);
    }
    let _ = 0, c = [], y = [];
    const k = /* @__PURE__ */ new Map();
    for (let T = 0; T < a.length; T++) {
      if (u.has(T)) {
        _++;
        continue;
      }
      k.set(T, c.length);
      const Y = f.get(T);
      if (Y && Y.size > 0) {
        let U = [];
        for (let L = 0; L < a[T].length; L++) U.push(a[T][L]), L < a[T].length - 1 && Y.has(L) && (U.length >= 2 && c.push(U), U = [], _++);
        (U.length >= 2 || U.length === 1) && c.push(U);
      } else c.push([...a[T]]);
    }
    if (r.size > 0) {
      const T = [], Y = /* @__PURE__ */ new Map();
      for (let L = 0; L < o.length; L++) {
        if (r.has(L)) {
          _++;
          continue;
        }
        Y.set(L, T.length), T.push([...o[L]]);
      }
      const U = [];
      for (const L of c) {
        let O = [];
        for (const Q of L) {
          const de = Y.get(Q);
          de === void 0 ? (O.length >= 2 && U.push(O), O = []) : O.push(de);
        }
        O.length >= 2 && U.push(O);
      }
      c = U, e.points.val = T;
    }
    for (const T of t) {
      const Y = k.get(T);
      Y !== void 0 && Y < c.length && y.push(Y);
    }
    if (e.polylines && (e.polylines.val = c), e.areas && (e.areas.val = y), S.size > 0 && i) {
      const T = s.filter((Y, U) => !S.has(U));
      "val" in i ? i.val = T : window.__hekatanDrawingAuxLines = T, _ += S.size;
    }
    he.clear(), Tt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ie(`\u{1F5D1} ${_} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = mo, window.addEventListener("keydown", (n) => {
    if (n.key !== "Delete" && n.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || he.size !== 0 && (n.preventDefault(), mo());
  });
  const At = document.createElement("div");
  At.id = "hk-properties-pane";
  const wo = "hk-props-pane-pos";
  let hn = null;
  try {
    const n = localStorage.getItem(wo);
    n && (hn = JSON.parse(n));
  } catch {
  }
  At.style.cssText = ["position:fixed", hn ? `left:${hn.left}px` : "left:14px", hn ? `top:${hn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(At);
  const es = () => {
    const n = At.querySelector(".tp-rotv_b");
    if (!n || n.__hkDragWired) return;
    n.__hkDragWired = true, n.style.cursor = "move", n.style.userSelect = "none";
    let o = false, a = 0, t = 0, i = 0, s = 0;
    n.addEventListener("mousedown", (r) => {
      o = true, a = r.clientX, t = r.clientY;
      const u = At.getBoundingClientRect();
      i = u.left, s = u.top, At.style.transform = "none", At.style.left = `${i}px`, At.style.top = `${s}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const u = r.clientX - a, f = r.clientY - t, S = Math.max(0, Math.min(window.innerWidth - 80, i + u)), _ = Math.max(0, Math.min(window.innerHeight - 40, s + f));
      At.style.left = `${S}px`, At.style.top = `${_}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(wo, JSON.stringify({ left: parseFloat(At.style.left), top: parseFloat(At.style.top) }));
        } catch {
        }
      }
    });
  }, H = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, _t = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let je = null;
  const wt = (n, o, a, t) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: n, ids: o, prop: a, value: t } }));
  }, ts = () => {
    if (je && (je.dispose(), je = null), he.size === 0) {
      At.style.display = "none";
      return;
    }
    const n = [...he], o = n.filter((c) => c.startsWith("pt:")), a = n.filter((c) => c.startsWith("seg:")), t = n.filter((c) => c.startsWith("poly:")), i = n.filter((c) => c.startsWith("aux:")), s = o.length > 0, r = a.length > 0, u = t.length > 0, f = !s && !r && !u, S = [];
    o.length && S.push(`\u{1F535} ${o.length} nodo(s)`), a.length && S.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && S.push(`\u25AD ${t.length} \xE1rea(s)`), i.length && S.push(`\u250A ${i.length} aux`);
    const _ = `\u{1F3AF} ${he.size} item(s) \u2014 ${S.join(", ")}`;
    je = new Ko({ container: At, title: _ });
    {
      const c = je.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      c.addBinding(_t, "dx", { label: "\u0394x (m)", step: 0.1 }), c.addBinding(_t, "dy", { label: "\u0394y (m)", step: 0.1 }), c.addBinding(_t, "dz", { label: "\u0394z (m)", step: 0.1 }), c.addBinding(_t, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), c.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a;
        const k = (_a = window.__hekatanReplicateSelection) == null ? void 0 : _a.call(window, _t.dx, _t.dy, _t.dz, _t.copias);
        ie(k ? `\u29C9 Replicado \xD7${k} (\u0394 ${_t.dx},${_t.dy},${_t.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), c.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a;
        const k = (_a = window.__hekatanReplicateSelection) == null ? void 0 : _a.call(window, _t.dx, _t.dy, _t.dz, 1);
        ie(k ? `\u2192 Copia desplazada \u0394 ${_t.dx},${_t.dy},${_t.dz} m` : "\u26A0 Nada seleccionado");
      });
      const y = c.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      y.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a;
        return (_a = window.__hekatanToggleSnap) == null ? void 0 : _a.call(window);
      }), y.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ie(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (s) {
      const c = je.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      c.addBinding(H, "Ux"), c.addBinding(H, "Uy"), c.addBinding(H, "Uz"), c.addBinding(H, "Rx"), c.addBinding(H, "Ry"), c.addBinding(H, "Rz");
      const y = je.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      y.addBinding(H, "Kx", { label: "Kx", min: 0, step: 100 }), y.addBinding(H, "Ky", { label: "Ky", min: 0, step: 100 }), y.addBinding(H, "Kz", { label: "Kz", min: 0, step: 100 }), y.addBinding(H, "Krx", { label: "Krx", min: 0, step: 1e3 }), y.addBinding(H, "Kry", { label: "Kry", min: 0, step: 1e3 }), y.addBinding(H, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const k = je.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      k.addBinding(H, "Fx", { step: 0.1 }), k.addBinding(H, "Fy", { step: 0.1 }), k.addBinding(H, "Fz", { step: 0.1 }), k.addBinding(H, "Mx", { step: 0.1 }), k.addBinding(H, "My", { step: 0.1 }), k.addBinding(H, "Mz", { step: 0.1 }), je.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(H, "mass", { label: "m", min: 0, step: 1 }), je.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(H, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), je.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let U = 0;
        const L = [H.Ux, H.Uy, H.Uz, H.Rx, H.Ry, H.Rz];
        L.some((de) => de) && (wt("nodes", o, "supports", L), U++);
        const O = [H.Fx, H.Fy, H.Fz, H.Mx, H.My, H.Mz];
        O.some((de) => de !== 0) && (wt("nodes", o, "loads", O), U++);
        const Q = [H.Kx, H.Ky, H.Kz, H.Krx, H.Kry, H.Krz];
        if (Q.some((de) => de !== 0) && (wt("nodes", o, "springs", Q), U++), H.mass !== 0 && (wt("nodes", o, "mass", H.mass), U++), H.diaphragm !== "Ninguno" && (wt("nodes", o, "diaphragm", H.diaphragm), U++), U === 0) {
          ie("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let de = document.getElementById("hk-prop-toast");
          de || (de = document.createElement("div"), de.id = "hk-prop-toast", de.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(de)), de.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", de.style.background = "rgba(217,119,6,0.97)", de.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            de && (de.style.opacity = "0");
          }, 3200);
        } else ie(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const c = je.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      c.addBinding(H, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), c.addBinding(H, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const y = je.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      y.addBinding(H, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), y.addBinding(H, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), y.addBinding(H, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), y.addBinding(H, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), je.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(H, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), je.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(H, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const Y = je.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      Y.addBinding(H, "relMxI", { label: "Mx I" }), Y.addBinding(H, "relMyI", { label: "My I" }), Y.addBinding(H, "relMzI", { label: "Mz I" });
      const U = je.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      U.addBinding(H, "relMxJ", { label: "Mx J" }), U.addBinding(H, "relMyJ", { label: "My J" }), U.addBinding(H, "relMzJ", { label: "Mz J" }), je.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(H, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const O = je.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      O.addBinding(H, "LKx", { label: "LKx", min: 0, step: 100 }), O.addBinding(H, "LKy", { label: "LKy", min: 0, step: 100 }), O.addBinding(H, "LKz", { label: "LKz", min: 0, step: 100 });
      const Q = je.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      Q.addBinding(H, "qx", { step: 0.1 }), Q.addBinding(H, "qy", { step: 0.1 }), Q.addBinding(H, "qz", { step: 0.1 }), je.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(H, "massPerM", { label: "m/L", min: 0, step: 1 }), je.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        wt("segs", a, "section", H.section), wt("segs", a, "material", H.material_frame);
        const Le = { A: H.A_mod, Iz: H.Iz_mod, Iy: H.Iy_mod, J: H.J_mod };
        (Le.A !== 1 || Le.Iz !== 1 || Le.Iy !== 1 || Le.J !== 1) && wt("segs", a, "modifiers", Le), H.insertionPoint !== "10 \u2014 Centroid" && wt("segs", a, "insertionPoint", H.insertionPoint), H.beta !== 0 && wt("segs", a, "beta", H.beta);
        const ve = [H.relMxI, H.relMyI, H.relMzI], be = [H.relMxJ, H.relMyJ, H.relMzJ];
        (ve.some((Ce) => Ce) || be.some((Ce) => Ce)) && wt("segs", a, "releases", { i: ve, j: be }), H.hinges !== "None" && wt("segs", a, "hinges", H.hinges);
        const pt = [H.LKx, H.LKy, H.LKz];
        pt.some((Ce) => Ce !== 0) && wt("segs", a, "lineSprings", pt);
        const Re = [H.qx, H.qy, H.qz];
        Re.some((Ce) => Ce !== 0) && wt("segs", a, "distLoad", Re), H.massPerM !== 0 && wt("segs", a, "massPerM", H.massPerM), ie(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (u) {
      const c = je.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      c.addBinding(H, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), c.addBinding(H, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), c.addBinding(H, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), je.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(H, "surfLoad", { label: "q", step: 0.1 }), je.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        wt("areas", t, "shellType", H.shellType), wt("areas", t, "thickness", H.thickness), wt("areas", t, "material", H.material_shell), H.surfLoad !== 0 && wt("areas", t, "surfLoad", H.surfLoad), ie(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (f) {
      const c = je.addFolder({ title: "\u2139 Selecci\xF3n" }), y = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      c.addBinding(y, "msg", { readonly: true, label: "" });
    }
    je.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      he.clear(), Tt();
    }), At.style.display = "block", es();
  };
  window.__hekatanRefreshPropsPane = ts;
  let an = null, Sn = false;
  x.addEventListener("pointerdown", (n) => {
    n.button === 2 && (an = { x: n.clientX, y: n.clientY }, Sn = false);
  }), x.addEventListener("pointermove", (n) => {
    if (an && n.buttons & 2 && !Sn) {
      const o = n.clientX - an.x, a = n.clientY - an.y;
      Math.hypot(o, a) > 8 && (Sn = true);
    }
  }), x.addEventListener("pointerup", (n) => {
    var _a, _b, _c;
    if (n.button === 2) {
      const o = an !== null && !Sn;
      an = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (Et ? _n() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), he.size > 0 && (he.clear(), Tt()), e.polylines) {
          const s = e.polylines.rawVal;
          (s[s.length - 1] ?? []).length > 0 && (e.polylines.val = [...s, []]);
        }
        const t = window.__hekatanCadState, i = (_b = (_a = t == null ? void 0 : t.get) == null ? void 0 : _a.call(t)) == null ? void 0 : _b.tool;
        i && i !== "select" && i !== "none" ? ((_c = t == null ? void 0 : t.setTool) == null ? void 0 : _c.call(t, "select"), ie(`\u238B Cancelado \u2014 tool '${i}' cerrado, volv\xE9s a Seleccionar`)) : ie("\u238B Cancelado (click derecho)");
      }
    }
  }), x.addEventListener("contextmenu", (n) => {
    n.preventDefault(), n.stopPropagation();
  }, { capture: true }), x.addEventListener("pointerdown", (n) => {
    var _a, _b, _c;
    const o = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || n.button === 0 && (window.__hekatanBloquearVentana || n.pointerType !== "touch" && ($t = null, fn = false));
  }), x.addEventListener("pointermove", (n) => {
    if (Et && n.buttons === 0) {
      const s = n.clientX < Et.x;
      Kn(Et.x, Et.y, n.clientX, n.clientY, s);
      return;
    }
    if (!$t) return;
    const o = n.clientX - $t.x, a = n.clientY - $t.y, t = Math.hypot(o, a);
    if (!fn && t < 8) return;
    fn = true;
    const i = n.clientX < $t.x;
    Kn($t.x, $t.y, n.clientX, n.clientY, i);
  }), x.addEventListener("pointerup", (n) => {
    if (!$t) return;
    if (!fn) {
      $t = null;
      return;
    }
    const o = n.ctrlKey || n.metaKey || n.shiftKey;
    ho($t.x, $t.y, n.clientX, n.clientY, o), $t = null, fn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true };
  const qt = new We();
  qt.visible = false, qt.frustumCulled = false, h.add(qt);
  const ns = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496 }, yo = (n, o, a, t) => {
    var _a, _b, _c, _d;
    for (; qt.children.length; ) {
      const u = qt.children.pop();
      (_b = (_a = u.geometry) == null ? void 0 : _a.dispose) == null ? void 0 : _b.call(_a), (_d = (_c = u.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const i = ns[n] ?? 16777215, s = 0.05, r = new Me().setFromPoints([new M(o - s, a - s, t), new M(o + s, a - s, t), new M(o + s, a - s, t), new M(o + s, a + s, t), new M(o + s, a + s, t), new M(o - s, a + s, t), new M(o - s, a + s, t), new M(o - s, a - s, t)]);
    qt.add(new Xt(r, new rt({ color: i, linewidth: 2 }))), qt.position.set(0, 0, 0), qt.visible = true;
  }, kn = () => {
    qt.visible = false;
  }, os = (n, o, a, t) => {
    var _a;
    const i = window.__hekatanOsnap, s = e.points.rawVal, r = ((_a = e.polylines) == null ? void 0 : _a.rawVal) ?? [];
    let u = null;
    const f = (c, y, k, T) => {
      const Y = Math.hypot(y - n, k - o, T - a);
      Y > t || (!u || Y < u.d) && (u = { type: c, x: y, y: k, z: T, d: Y });
    };
    (i.node || i.end) && s.forEach((c) => {
      i.node && f("node", c[0], c[1], c[2]);
    });
    for (const c of r) if (!(c.length < 2)) for (let y = 0; y < c.length - 1; y++) {
      const k = s[c[y]], T = s[c[y + 1]];
      if (!(!k || !T) && (i.end && (f("end", k[0], k[1], k[2]), f("end", T[0], T[1], T[2])), i.mid && f("mid", (k[0] + T[0]) / 2, (k[1] + T[1]) / 2, (k[2] + T[2]) / 2), i.nea || i.per)) {
        const Y = T[0] - k[0], U = T[1] - k[1], L = T[2] - k[2], O = Y * Y + U * U + L * L;
        if (O < 1e-12) continue;
        const Q = Math.max(0, Math.min(1, ((n - k[0]) * Y + (o - k[1]) * U + (a - k[2]) * L) / O)), de = k[0] + Q * Y, Le = k[1] + Q * U, ve = k[2] + Q * L;
        i.nea && f("nea", de, Le, ve), i.per && f("per", de, Le, ve);
      }
    }
    if (i.int) {
      const c = [];
      for (const y of r) for (let k = 0; k < y.length - 1; k++) {
        const T = s[y[k]], Y = s[y[k + 1]];
        if (!T || !Y) continue;
        const U = Y[0] - T[0], L = Y[1] - T[1], O = Y[2] - T[2], Q = U * U + L * L + O * O;
        if (Q < 1e-12) continue;
        const de = Math.max(0, Math.min(1, ((n - T[0]) * U + (o - T[1]) * L + (a - T[2]) * O) / Q));
        Math.hypot(T[0] + de * U - n, T[1] + de * L - o, T[2] + de * O - a) < 3 * t && c.push([T, Y]);
      }
      for (let y = 0; y < c.length; y++) for (let k = y + 1; k < c.length; k++) {
        const [T, Y] = c[y], [U, L] = c[k], O = [Y[0] - T[0], Y[1] - T[1], Y[2] - T[2]], Q = [L[0] - U[0], L[1] - U[1], L[2] - U[2]], de = [T[0] - U[0], T[1] - U[1], T[2] - U[2]], Le = O[0] * O[0] + O[1] * O[1] + O[2] * O[2], ve = O[0] * Q[0] + O[1] * Q[1] + O[2] * Q[2], be = Q[0] * Q[0] + Q[1] * Q[1] + Q[2] * Q[2], pt = O[0] * de[0] + O[1] * de[1] + O[2] * de[2], Re = Q[0] * de[0] + Q[1] * de[1] + Q[2] * de[2], Ce = Le * be - ve * ve;
        if (Ce < 1e-12) continue;
        const Ye = (ve * Re - be * pt) / Ce, qe = (Le * Re - ve * pt) / Ce;
        if (Ye < -1e-6 || Ye > 1 + 1e-6 || qe < -1e-6 || qe > 1 + 1e-6) continue;
        const Oe = [T[0] + Ye * O[0], T[1] + Ye * O[1], T[2] + Ye * O[2]], ht = [U[0] + qe * Q[0], U[1] + qe * Q[1], U[2] + qe * Q[2]];
        if (Math.hypot(Oe[0] - ht[0], Oe[1] - ht[1], Oe[2] - ht[2]) > 1e-4) continue;
        [T, Y, U, L].some((Ct) => Math.hypot(Ct[0] - Oe[0], Ct[1] - Oe[1], Ct[2] - Oe[2]) < 1e-6) || f("int", Oe[0], Oe[1], Oe[2]);
      }
    }
    const S = window.__hekatanDrawingAuxLines, _ = (S == null ? void 0 : S.rawVal) ?? (S == null ? void 0 : S.val) ?? S ?? [];
    for (const c of _) {
      if (c.length !== 6) continue;
      const y = [c[0], c[1], c[2]], k = [c[3], c[4], c[5]];
      if (i.end && (f("end", y[0], y[1], y[2]), f("end", k[0], k[1], k[2])), i.mid && f("mid", (y[0] + k[0]) / 2, (y[1] + k[1]) / 2, (y[2] + k[2]) / 2), i.nea || i.per) {
        const T = k[0] - y[0], Y = k[1] - y[1], U = k[2] - y[2], L = T * T + Y * Y + U * U;
        if (L < 1e-12) continue;
        const O = Math.max(0, Math.min(1, ((n - y[0]) * T + (o - y[1]) * Y + (a - y[2]) * U) / L)), Q = y[0] + O * T, de = y[1] + O * Y, Le = y[2] + O * U;
        i.nea && f("nea", Q, de, Le), i.per && f("per", Q, de, Le);
      }
    }
    return u ? { type: u.type, x: u.x, y: u.y, z: u.z } : null;
  };
  window.__hekatanOsnapCompute = os, window.__hekatanOsnapShow = yo, window.__hekatanOsnapHide = kn;
  let ze = [], dt = 0;
  const mn = document.createElement("div");
  mn.id = "hk-cad-status", mn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", mn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(mn);
  const ss = () => {
    var _a, _b, _c;
    const n = [];
    window.__hekatanOrthoMode && n.push("\u22A5 ORTO ON (F8)"), nt && n.push(`\u{1F512} LOCK ${nt.toUpperCase()}`);
    const a = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && n.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && n.push("\u25A6 Planos XY/XZ/YZ"), n.length > 0 ? `   |   ${n.join("  \xB7  ")}` : "";
  }, ie = (n) => {
    var _a;
    const o = n + ss();
    mn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a = window.__hekatanCadEcho) == null ? void 0 : _a.call(window, n);
    } catch {
    }
  }, as = "Comando:", is = () => {
    var _a, _b, _c, _d;
    const n = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], t = ze.length, i = (s, r = []) => ({ txt: s, ops: r });
    switch (n) {
      case "line":
        return a.length >= 2 ? i("L\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : a.length === 1 ? i("L\xCDNEA Precise punto siguiente o", ["desHacer"]) : i("L\xCDNEA Precise primer punto:");
      case "polyline":
        return a.length >= 2 ? i("POLIL\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : a.length === 1 ? i("POLIL\xCDNEA Precise punto siguiente o", ["desHacer"]) : i("POLIL\xCDNEA Precise punto inicial:");
      case "node":
        return i("NUDO Precise punto:");
      case "area":
        return i(`LOSA Precise v\xE9rtice ${Math.min(a.length + 1, 4)} de 4 (en orden, antihorario):`);
      case "rectarea":
        return i(t ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea":
        return i(`\xC1REA LIBRE Precise v\xE9rtice ${pe.length + 1} (Enter o clic derecho cierra y malla):`);
      case "rect":
        return i(t ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return i(t ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return i(t === 0 ? "ARCO Precise punto inicial:" : t === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return i(`COLUMNA Precise punto de inserci\xF3n (altura ${dt > 0 ? dt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return i(t ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${dt > 0 ? dt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return i(`PLANO Precise punto ${t + 1} de 3:`);
      case "extp":
        return i("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return i("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return i("PROLONGAR Precise la l\xEDnea y luego hasta d\xF3nde:");
      case "axis":
        return i("EJE Precise el primer punto del eje:");
      case "aux":
        return i(t ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
      case "auxp":
        return i("PUNTO AUXILIAR Precise punto:");
      case "chaflan":
        return i(t ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
      case "delete":
        return i("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move":
        return he.size ? i(t ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : i("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return he.size ? i(t ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : i("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return he.size ? i(`SELECCI\xD3N ${he.size} objeto${he.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : i("Designe objetos (ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return i(as);
    }
  }, Yt = () => {
    var _a;
    try {
      const n = is();
      (_a = window.__hekatanCadPrompt) == null ? void 0 : _a.call(window, n.txt, n.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Yt, window.__hekatanRefreshStatus = () => {
    const n = window.__hekatanCadStatusText ?? "", o = n.split("   |   ")[0] ?? n;
    ie(o);
  }, window.__hekatanCadResetPending = () => {
    ze = [], pe = [], q.visible = false, qn(), g(), ie("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Yt();
  };
  function qn() {
    if (!e.polylines) return;
    const n = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...n, []];
  }
  window.__hekatanCerrarPolilinea = qn;
  const ln = [], Pn = [], Gn = () => {
    var _a, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a = e.polylines) == null ? void 0 : _a.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, xo = (n) => {
    var _a;
    e.points.val = n.p, e.polylines && (e.polylines.val = n.l), e.areas && (e.areas.val = n.a), ze = [], re.visible = false, at.visible = false, I();
    try {
      (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
    } catch {
    }
    g(), Yt();
  }, Dt = () => {
    ln.push(Gn()), ln.length > 100 && ln.shift(), Pn.length = 0;
  }, Cn = () => {
    const n = ln.pop();
    if (!n) {
      ie("\u21B6 Nada para deshacer");
      return;
    }
    Pn.push(Gn()), xo(n), ie(`\u21B6 Deshacer \u2014 quedan ${ln.length}`);
  }, go = () => {
    const n = Pn.pop();
    if (!n) {
      ie("\u21B7 Nada para rehacer");
      return;
    }
    ln.push(Gn()), xo(n), ie(`\u21B7 Rehacer \u2014 quedan ${Pn.length}`);
  };
  window.__hekatanPushUndo = Dt, window.__hekatanUndo = Cn, window.__hekatanRedo = go, document.addEventListener("keydown", (n) => {
    var _a;
    const o = n.key.toLowerCase();
    if (!((n.ctrlKey || n.metaKey) && (o === "y" || o === "z" && n.shiftKey))) return;
    const t = n.target;
    t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA") && t.type !== "checkbox" && t.type !== "range" && (((_a = t.value) == null ? void 0 : _a.length) ?? 0) > 0 || (n.preventDefault(), n.stopPropagation(), go());
  }, { capture: true }), window.__hekatanCadOption = (n) => {
    var _a, _b, _c, _d, _e2;
    const o = n.trim().toLowerCase(), a = (_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const t = e.polylines.rawVal, i = t.length ? t[t.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Cn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (i.length < 3) return ie("Cerrar necesita al menos tres puntos."), true;
      Dt(), e.polylines.val = [...t.slice(0, -1), [...i, i[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return Hn(), ie(`\u2713 Polil\xEDnea cerrada \u2014 ${i.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!i.length) return Cn(), true;
      Dt();
      const s = i[i.length - 1], r = i.slice(0, -1), u = t.some((_, c) => c !== t.length - 1 && _.includes(s)) || r.includes(s);
      let f = e.points.rawVal, S = [...t.slice(0, -1), r];
      if (!u && s === f.length - 1 && (f = f.slice(0, -1), e.points.val = f), e.polylines.val = S, r.length) {
        const _ = f[r[r.length - 1]];
        _ && ($ = [_[0], _[1], _[2]]);
      } else $ = null, re.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return g(), ie(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Yt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (n) => {
    var _a;
    if ((n.ctrlKey || n.metaKey) && n.key.toLowerCase() === "z" && !n.shiftKey) {
      const o = n.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a = o.value) == null ? void 0 : _a.length) > 0) return;
      n.preventDefault(), n.stopPropagation(), Cn();
    }
  }, { capture: true });
  const Hn = () => {
    ze = [], qn(), nt = null, Rt(), re.visible = false, at.visible = false, I(), ie("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), g(), Yt();
  };
  window.__hekatanFinalizeDraw = Hn;
  const vo = () => {
    var _a, _b, _c;
    ze = [], pe = [], q.visible = false;
    let n = false;
    he.size && (he.clear(), Tt(), n = true), Hn();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a = o == null ? void 0 : o.get) == null ? void 0 : _a.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ie(n ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 arrastr\xE1 para seleccionar"), g(), Yt();
  };
  window.__hekatanEscapeCancel = vo;
  const Mo = () => {
    var _a;
    const n = ((_a = e.polylines) == null ? void 0 : _a.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return he.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (n[+a.slice(5)] || []).forEach((t) => o.add(t));
      else if (a.startsWith("seg:")) {
        const t = a.split(":"), i = n[+t[1]] || [], s = i[+t[2]], r = i[+t[2] + 1];
        s != null && o.add(s), r != null && o.add(r);
      }
    }), o;
  }, bo = (n, o, a) => {
    var _a;
    const t = Mo();
    if (!t.size) return 0;
    Dt();
    const i = e.points.rawVal.map((s, r) => t.has(r) ? [s[0] + n, s[1] + o, s[2] + a] : s);
    e.points.val = i;
    try {
      (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
    } catch {
    }
    return Tt(), g(), t.size;
  };
  window.__hekatanMoveSelection = bo;
  const _o = (n, o) => {
    var _a, _b, _c, _d, _e2;
    if (!he.size) {
      ie(`${n === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.setTool) == null ? void 0 : _b.call(_a, "select"), Yt();
      return;
    }
    if (ze.push(o), ze.length === 1) {
      $ = o, ie(`${n === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Yt();
      return;
    }
    const [a, t] = ze, i = [t[0] - a[0], t[1] - a[1], t[2] - a[2]];
    ze = [], re.visible = false;
    let s = 0;
    n === "move" ? s = bo(i[0], i[1], i[2]) : (s = Mo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, i[0], i[1], i[2], 1)), ie(`\u2713 ${n === "move" ? "Movidos" : "Copiados"} ${s} nudo${s === 1 ? "" : "s"} \u2014 \u0394 (${i[0].toFixed(2)}, ${i[1].toFixed(2)}, ${i[2].toFixed(2)}) m.`), n === "move" && (he.clear(), Tt()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Yt();
  };
  window.__hekatanPasoMoverCopiar = _o, window.__hekatanReplicateSelection = (n, o, a, t) => {
    var _a, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1));
    const i = [...he], s = e.points.rawVal, r = ((_a = e.polylines) == null ? void 0 : _a.rawVal) ?? [], u = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), f = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Set(), _ = [];
    if (i.forEach((Y) => {
      if (Y.startsWith("pt:")) f.add(+Y.slice(3));
      else if (Y.startsWith("poly:")) {
        const U = +Y.slice(5);
        S.add(U), (r[U] || []).forEach((L) => f.add(L));
      } else if (Y.startsWith("seg:")) {
        const U = Y.split(":"), L = +U[1], O = +U[2], Q = r[L] || [], de = Q[O], Le = Q[O + 1];
        de != null && Le != null && (_.push([de, Le]), f.add(de), f.add(Le));
      }
    }), !f.size) return 0;
    Dt();
    const c = [...s];
    let y = r.slice();
    y.length && y[y.length - 1].length === 0 && (y = y.slice(0, -1));
    const k = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], T = [...f];
    for (let Y = 1; Y <= t; Y++) {
      const U = n * Y, L = o * Y, O = a * Y, Q = /* @__PURE__ */ new Map();
      T.forEach((de) => {
        Q.set(de, c.length), c.push([s[de][0] + U, s[de][1] + L, s[de][2] + O]);
      }), S.forEach((de) => {
        const Le = r[de].map((be) => Q.has(be) ? Q.get(be) : be), ve = y.length;
        y.push(Le), u.has(de) && k.push(ve);
      }), _.forEach(([de, Le]) => {
        y.push([Q.get(de), Q.get(Le)]);
      });
    }
    y.push([]), e.points.val = c, e.polylines && (e.polylines.val = y), e.areas && (e.areas.val = k);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return g(), t;
  }, x.addEventListener("click", (n) => {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z;
    if (jt > 5) {
      jt = 0;
      return;
    }
    jt = 0;
    const o = v(n);
    if (!o) return;
    b.setFromCamera(P, o);
    const a = te();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(d.target) || 1, r = a[0].distance ?? o.position.distanceTo(a[0].point), u = a[0].point;
      if (!isFinite(u.x) || !isFinite(u.y) || !isFinite(u.z) || r > Math.max(s * 12, 300)) {
        ie("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let t = a[0].point;
    (n.ctrlKey || n.metaKey) && (t = new M(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a = e.polylines) == null ? void 0 : _a.rawVal) ?? [], r = s[s.length - 1] ?? [], u = e.points.rawVal ?? [];
      if (r.length > 0) {
        const f = u[r[r.length - 1]];
        if (f) {
          const S = !!window.__hekatanOrthoMode;
          let _ = nt;
          if (!_ && S) {
            const c = Math.abs(t.x - f[0]), y = Math.abs(t.y - f[1]), k = Math.abs(t.z - f[2]);
            _ = c >= y && c >= k ? "x" : y >= k ? "y" : "z";
          }
          _ === "x" ? t = new M(t.x, f[1], f[2]) : _ === "y" ? t = new M(f[0], t.y, f[2]) : _ === "z" && (t = new M(f[0], f[1], t.z));
        }
      }
    }
    if (it) t = it.clone(), ie(`\u{1F4D0} Eje \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else {
      const s = (window.__hekatanSnap2D ?? 0.5) * 1.2, r = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s);
      if (r) t = new M(r.x, r.y, r.z), ie(`\u{1F3AF} Snap [${r.type.toUpperCase()}] \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      else {
        const u = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0;
        u && f > 0 && (t = new M(Math.round(t.x / f) * f, Math.round(t.y / f) * f, Math.round(t.z / f) * f));
      }
    }
    const i = ((_e2 = (_d = (_c = window.__hekatanCadState) == null ? void 0 : _c.get) == null ? void 0 : _d.call(_c)) == null ? void 0 : _e2.tool) ?? "select";
    if (i === "select" || i === "none" || !i) {
      if (st) {
        Et && _n();
        const { kind: s, a: r, b: u } = st, f = u !== void 0 ? `${s}:${r}:${u}` : `${s}:${r}`;
        n.ctrlKey || n.metaKey || n.shiftKey || he.clear(), he.has(f) ? he.delete(f) : he.add(f), Tt(), ie(`\u2713 Seleccionados ${he.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const s = n.ctrlKey || n.metaKey || n.shiftKey, r = n.clientX, u = n.clientY;
        Et ? (ho(Et.x, Et.y, r, u, s), Et = null) : s || (Et = { x: r, y: u }, ie("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Kn(r, u, r + 1, u + 1, false));
      }
      return;
    }
    if (i === "axis") {
      const s = window.__hekatanAxisDraw;
      if (!s) return;
      if (!s.pendingStart) {
        s.pendingStart = [t.x, t.y, t.z], ie(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const r = s.mode === "number", u = (_f = window.__hekatanAxisCommit) == null ? void 0 : _f.call(window, s.pendingStart, [t.x, t.y, t.z], r);
      ie(`\u2713 Eje "${u}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (i === "move" || i === "copy") {
      _o(i, [t.x, t.y, t.z]);
      return;
    }
    if (i === "delete") {
      if (ft >= 0) {
        const s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [], u = ft;
        if (u >= 0 && u < r.length) {
          Dt();
          const f = r.slice(0, u).concat(r.slice(u + 1));
          s && typeof s == "object" && "val" in s ? s.val = f : window.__hekatanDrawingAuxLines = f, ie(`\u{1F5D1} L\xEDnea auxiliar #${u + 1} borrada`), ft = -1, we.visible = false;
          try {
            (_g = window.__hekatanRebuild) == null ? void 0 : _g.call(window);
          } catch {
          }
        }
      } else if (Ze >= 0) {
        const s = Ze, r = Je;
        ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(s)) ?? false ? (on(s), ie(`\u{1F5D1} \xC1rea #${s + 1} (shell Q4) borrada`)) : r >= 0 ? (Xn(s, r), ie(`\u{1F5D1} Segmento ${r + 1} de polil\xEDnea #${s + 1} borrado`)) : (on(s), ie(`\u{1F5D1} Polil\xEDnea #${s + 1} borrada`));
      } else ie("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (i === "circle") {
      if (ze.push([t.x, t.y, t.z]), ze.length === 1) {
        ie("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [s, r] = ze, u = Math.hypot(r[0] - s[0], r[1] - s[1], r[2] - s[2]);
      Math.abs(r[0] - s[0]);
      const f = Math.abs(r[1] - s[1]), _ = Math.abs(r[2] - s[2]) < 1e-3 ? "xy" : f < 1e-3 ? "xz" : "yz", c = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawCircle) == null ? void 0 : _j.call(window, s[0], s[1], s[2], u, c, _), ie(`\u2713 C\xEDrculo dibujado en ${_.toUpperCase()} \u2014 r=${u.toFixed(2)}m, ${c} segmentos`), ze = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (i === "arc") {
      if (ze.push([t.x, t.y, t.z]), ze.length === 1) {
        ie("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (ze.length === 2) {
        ie("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [s, r, u] = ze, f = window.__hekatanArcSegs ?? 12;
      (_l = window.__hekatanDrawArc) == null ? void 0 : _l.call(window, s, r, u, f), ie(`\u2713 Arco dibujado \u2014 ${f} segmentos`), ze = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (i === "rect") {
      if (ze.push([t.x, t.y, t.z]), ze.length === 1) {
        ie("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [s, r] = ze;
      (_n2 = window.__hekatanDrawRect) == null ? void 0 : _n2.call(window, s, r), ie(`\u2713 Rect\xE1ngulo dibujado \u2014 (${s[0].toFixed(1)},${s[1].toFixed(1)}) \u2192 (${r[0].toFixed(1)},${r[1].toFixed(1)})`), ze = [];
      try {
        (_o2 = window.__hekatanRebuild) == null ? void 0 : _o2.call(window);
      } catch {
      }
      return;
    }
    if (i === "rectarea") {
      if (ze.push([t.x, t.y, t.z]), ze.length === 1) {
        ie("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [s, r] = ze;
      (_p = window.__hekatanDrawRectArea) == null ? void 0 : _p.call(window, s, r), ie(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${s[0].toFixed(1)},${s[1].toFixed(1)}) \u2192 (${r[0].toFixed(1)},${r[1].toFixed(1)})`), ze = [];
      return;
    }
    if (i === "polyarea") {
      pe.push([t.x, t.y, t.z]), q.geometry.setFromPoints(pe.map((s) => new M(s[0], s[1], s[2]))), q.visible = pe.length >= 1, ie(`\u25B0 \xC1rea libre \u2014 ${pe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), g();
      return;
    }
    if (i === "plane3") {
      if (ze.push([t.x, t.y, t.z]), ze.length < 3) {
        ie(`\u25E3 Plano inclinado \u2014 punto ${ze.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [s, r, u] = ze, f = (_q = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _q.call(window, s, r, u);
      ie(f ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), ze = [];
      return;
    }
    if (i === "col") {
      Dt();
      const s = t.z, r = dt && dt > 0 ? dt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, s], [t.x, t.y, s + r]];
      const u = e.polylines.rawVal, f = e.points.rawVal.length;
      e.polylines.val = [...u.slice(0, -1), ...u[u.length - 1].length > 0 ? [u[u.length - 1]] : [], [f - 2, f - 1], []], dt = 0, ie(`\u258C Columna creada \u2014 h=${r.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (i === "wall") {
      if (ze.push([t.x, t.y, t.z]), ze.length === 1) {
        ie("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [s, r] = ze, u = dt && dt > 0 ? dt : 3;
      Dt();
      const f = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [s[0], s[1], s[2]], [r[0], r[1], r[2]], [r[0], r[1], r[2] + u], [s[0], s[1], s[2] + u]];
      const S = e.polylines.rawVal;
      if (S.length - 1, e.polylines.val = [...S.slice(0, -1), ...S[S.length - 1].length > 0 ? [S[S.length - 1]] : [], [f, f + 1, f + 2, f + 3, f], []], e.areas) {
        const _ = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, _];
      }
      ie(`\u25A5 Pared Q4 creada \u2014 h=${u.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), ze = [], dt = 0;
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (i === "extp") {
      Dt();
      const s = dt && dt > 0 ? dt : 3, r = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, r], [t.x, t.y, r + s]];
      const u = e.polylines.rawVal, f = e.points.rawVal.length;
      e.polylines.val = [...u.slice(0, -1), ...u[u.length - 1].length > 0 ? [u[u.length - 1]] : [], [f - 2, f - 1], []], dt = 0, ie(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${s.toFixed(2)}m`);
      try {
        (_t2 = window.__hekatanRebuild) == null ? void 0 : _t2.call(window);
      } catch {
      }
      return;
    }
    if (i === "extl") {
      const s = (window.__hekatanSnap2D ?? 0.5) * 1.5, r = Jt(t.x, t.y, t.z, s);
      if (!r) {
        ie("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const u = e.polylines.rawVal, f = e.points.rawVal, S = u[r.polyIdx], _ = f[S[r.segIdx]], c = f[S[r.segIdx + 1]];
      if (!_ || !c) {
        ie("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const y = dt && dt > 0 ? dt : 3;
      Dt();
      const k = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [_[0], _[1], _[2]], [c[0], c[1], c[2]], [c[0], c[1], c[2] + y], [_[0], _[1], _[2] + y]];
      const T = e.polylines.rawVal;
      if (e.polylines.val = [...T.slice(0, -1), ...T[T.length - 1].length > 0 ? [T[T.length - 1]] : [], [k, k + 1, k + 2, k + 3, k], []], e.areas) {
        const Y = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, Y];
      }
      dt = 0, ie(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${y.toFixed(2)}m`);
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (i === "auxp") {
      const s = window.__hekatanDrawingAuxPoints;
      if (s) {
        const r = s.rawVal ?? s.val ?? [];
        s.val = [...r, [t.x, t.y, t.z]];
      }
      ie(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (i === "aux") {
      if (ze.push([t.x, t.y, t.z]), ze.length === 1) {
        ie("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [s, r] = ze, u = window.__hekatanDrawingAuxLines;
      if (u) {
        const y = u.rawVal ?? u.val ?? [];
        u.val = [...y, [s[0], s[1], s[2], r[0], r[1], r[2]]];
      }
      const f = r[0] - s[0], S = r[1] - s[1], _ = r[2] - s[2], c = Math.sqrt(f * f + S * S + _ * _);
      ie(`\u2713 L\xEDnea auxiliar creada \u2014 L=${c.toFixed(2)}m (cyan, no FEM)`), ze = [];
      return;
    }
    if (i === "extend") {
      if (ze.push([t.x, t.y, t.z]), ze.length === 1) {
        ie("\u2197 Prolongar \u2014 click 1/2 OK. Marc\xE1 el destino de la prolongaci\xF3n.");
        return;
      }
      const [s, r] = ze, u = window.__hekatanDrawingAuxLines;
      if (u) {
        const f = u.rawVal ?? u.val ?? [];
        u.val = [...f, [s[0], s[1], s[2], r[0], r[1], r[2]]];
      }
      ie("\u2713 Prolongaci\xF3n creada como l\xEDnea auxiliar"), ze = [];
      return;
    }
    if (i === "chaflan") {
      if (ze.push([t.x, t.y, t.z]), ze.length === 1) {
        ie("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [s, r] = ze, u = window.__hekatanChaflanR ?? 1, f = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_v = window.__hekatanDrawSlabChaflan) == null ? void 0 : _v.call(window, s, r, u, f, 6);
      const S = Math.abs(r[0] - s[0]).toFixed(1), _ = Math.abs(r[1] - s[1]).toFixed(1);
      ie(`\u2713 Losa con chaflanes dibujada \u2014 ${S}\xD7${_}m, r=${u}m, ${f} seg/chafl\xE1n`), ze = [];
      try {
        (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (A = false, Dt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const s = e.polylines.rawVal, r = s.length - 1, u = s[r] ?? [];
      if (i === "line" && u.length >= 2) {
        ie(`\uFF0F L\xEDnea \u2014 ${u.length - 1} tramo${u.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_x = window.__hekatanRebuild) == null ? void 0 : _x.call(window);
        } catch {
        }
        return;
      }
      if (i === "area" && u.length === 4) {
        e.polylines.val = [...s.slice(0, -1), [...u, u[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, r]), ie("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_y = window.__hekatanRebuild) == null ? void 0 : _y.call(window);
        } catch {
        }
        return;
      }
    }
    if (i === "node") ie(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (i === "line") ie("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (i === "polyline") ie("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (i === "area") {
      const s = ((_z = e.polylines) == null ? void 0 : _z.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      ie(`\u25A6 \xC1rea \u2014 click ${s.length}/4. Marc\xE1 ${4 - s.length} v\xE9rtice${4 - s.length === 1 ? "" : "s"} m\xE1s.`);
    }
  }), x.addEventListener("click", () => Yt()), x.addEventListener("contextmenu", (n) => {
    var _a, _b, _c;
    if (((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) === "polyarea" && pe.length >= 3) {
      n.preventDefault();
      const a = pn();
      ie(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), x.addEventListener("pointermove", (n) => {
    var _a, _b;
    const o = v(n);
    if (!o) return;
    b.setFromCamera(P, o);
    const a = te();
    if (xe.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (n.ctrlKey || n.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const r = ((_a = e.polylines) == null ? void 0 : _a.rawVal) ?? [], u = r[r.length - 1] ?? [], f = e.points.rawVal ?? [];
        if (u.length > 0) {
          const S = f[u[u.length - 1]];
          if (S) {
            const _ = !!window.__hekatanOrthoMode;
            let c = nt;
            if (!c && _) {
              const y = Math.abs(t.x - S[0]), k = Math.abs(t.y - S[1]), T = Math.abs(t.z - S[2]);
              c = y >= k && y >= T ? "x" : k >= T ? "y" : "z";
            }
            c === "x" ? t.set(t.x, S[1], S[2]) : c === "y" ? t.set(S[0], t.y, S[2]) : c === "z" && t.set(S[0], S[1], t.z);
          }
        }
      }
      const i = (window.__hekatanSnap2D ?? 0.5) * 1.2, s = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, i);
      if (s) t.set(s.x, s.y, s.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, u = window.__hekatanSnap2D ?? 0.5;
        r && u > 0 && (t.x = Math.round(t.x / u) * u, t.y = Math.round(t.y / u) * u, t.z = Math.round(t.z / u) * u);
      }
      xe.geometry.setAttribute("position", new yt(t.toArray(), 3));
    }
    g();
  }), x.addEventListener("pointermove", (n) => {
    var _a;
    const o = v(n);
    if (!o) return;
    b.setFromCamera(P, o);
    let a = false;
    const t = b.intersectObject(G), i = te();
    if (t.length && i.length) {
      const s = new M(...e.points.rawVal[t[0].index]), r = new M(...i[0].point), u = s.sub(r), f = (_a = i[0].face) == null ? void 0 : _a.normal;
      f.transformDirection(N.matrixWorld), Math.abs(u.dot(f)) < 1e-4 && (a = true);
    }
    xe.visible = !a;
  });
  let Wn = false, Jn;
  x.addEventListener("pointermove", (n) => {
    var _a;
    if (!jt) return;
    const o = v(n);
    if (!o) return;
    b.setFromCamera(P, o);
    let a = false;
    const t = b.intersectObject(G), i = te();
    if (t.length && i.length) {
      const r = new M(...e.points.rawVal[t[0].index]), u = new M(...i[0].point), f = r.sub(u), S = (_a = i[0].face) == null ? void 0 : _a.normal;
      S.transformDirection(N.matrixWorld), Math.abs(f.dot(S)) < 1e-4 && (a = true);
    }
    if (a && jt < 5 && (Wn = true, d.enabled = false, Jn = t[0].index), !Wn || jt % 2 !== 0) return;
    const s = [...e.points.rawVal];
    if (Jn !== void 0) {
      let r = i[0].point;
      (n.ctrlKey || n.metaKey) && (r = new M(Math.round(r.x), Math.round(r.y), Math.round(r.z))), s[Jn] = r.toArray();
    }
    e.points.val = s;
  }), x.addEventListener("pointerup", () => {
    d.enabled = true, Wn = false;
  }), x.addEventListener("contextmenu", (n) => {
    var _a;
    const o = v(n);
    if (!o) return;
    b.setFromCamera(P, o);
    let a = false;
    const t = b.intersectObject(G), i = te();
    if (t.length && i.length) {
      const u = new M(...e.points.rawVal[t[0].index]), f = new M(...i[0].point), S = u.sub(f), _ = (_a = i[0].face) == null ? void 0 : _a.normal;
      _.transformDirection(N.matrixWorld), Math.abs(S.dot(_)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const s = [...e.points.rawVal];
    if (s.splice(t[0].index, 1), e.points.val = s, !e.polylines) return;
    const r = e.polylines.rawVal.map((u) => u.filter((f) => f !== t[0].index)).map((u) => u.map((f) => f > t[0].index ? f - 1 : f)).filter((u) => u.length);
    r.push([]), e.polylines.val = r;
  });
}
function Js(e, l, h) {
  const w = Math.round(14.999999999999998), p = { position: e.position.clone(), quaternion: e.quaternion.clone() }, x = setInterval(b, 1e3 / 30);
  let g = 0;
  function b() {
    g++;
    const P = g / w;
    e.position.lerpVectors(p.position, l.position, P), e.quaternion.slerpQuaternions(p.quaternion, l.quaternion, P), h && h(), g == w && clearInterval(x);
  }
}
function Os(e, l, h, m) {
  const d = zs(h, e.elements, m);
  return Z.derive(() => {
    d.visible = l.shellResults.val != "none";
  }), d;
}
const Qs = 6, ao = 10, js = 0.012;
function ea(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function ta(e, l, h, m) {
  if (!h && !m) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && h) {
    const w = h[e];
    if (w && w.has(l)) return w.get(l);
  }
  return null;
}
function na(e, l, h, m) {
  const d = new We(), w = new qo();
  w.setColorMap("rainbow");
  const p = new It(), x = Z.state([]);
  return Z.derive(() => {
    var _a, _b, _c;
    l.deformedShape.val;
    const g = h.val, b = ((_a = e.elements) == null ? void 0 : _a.val) ?? [], P = ea(l.frameResults.val);
    if (d.children.forEach((E) => {
      E.geometry && E.geometry.dispose(), E.material && E.material.dispose();
    }), d.clear(), !P || b.length === 0 || g.length === 0) {
      x.val = [];
      return;
    }
    const v = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, N = (_c = e.deformOutputs) == null ? void 0 : _c.val, me = [], ae = [];
    for (let E = 0; E < b.length; E++) {
      if (b[E].length !== 2) continue;
      const le = ta(P, E, v, N);
      le && (me.push(le[0], le[1]), ae.push({ idx: E, vals: le }));
    }
    if (me.length === 0) {
      x.val = [];
      return;
    }
    const ee = Math.min(...me), C = Math.max(...me);
    w.setMin(ee), w.setMax(C), x.val = me;
    const te = [1 / 0, 1 / 0, 1 / 0], G = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of g) for (let J = 0; J < 3; J++) te[J] = Math.min(te[J], E[J]), G[J] = Math.max(G[J], E[J]);
    const ye = Math.max(G[0] - te[0], G[1] - te[1], G[2] - te[2], 1) * js, B = [], $ = [], X = [];
    let A = 0;
    for (const { idx: E, vals: J } of ae) {
      const le = b[E], ne = g[le[0]], j = g[le[1]];
      if (!ne || !j) continue;
      const V = new M(j[0] - ne[0], j[1] - ne[1], j[2] - ne[2]), re = V.length();
      if (re < 1e-10) continue;
      V.normalize();
      const q = Math.abs(V.y) < 0.99 ? new M(0, 1, 0) : new M(1, 0, 0), pe = new M().crossVectors(V, q).normalize(), fe = new M().crossVectors(V, pe).normalize(), Ae = ao + 1, ge = Qs;
      for (let Te = 0; Te < Ae; Te++) {
        const He = Te / ao, at = ne[0] + V.x * re * He, oe = ne[1] + V.y * re * He, z = ne[2] + V.z * re * He, K = J[0] + (J[1] - J[0]) * He, D = w.getColor(K) ?? new It(0, 0, 0);
        p.copy(D).convertSRGBToLinear();
        for (let W = 0; W < ge; W++) {
          const se = W / ge * Math.PI * 2, ue = Math.cos(se), ce = Math.sin(se);
          B.push(at + (pe.x * ue + fe.x * ce) * ye, oe + (pe.y * ue + fe.y * ce) * ye, z + (pe.z * ue + fe.z * ce) * ye), $.push(p.r, p.g, p.b);
        }
      }
      for (let Te = 0; Te < ao; Te++) for (let He = 0; He < ge; He++) {
        const at = (He + 1) % ge, oe = A + Te * ge + He, z = A + Te * ge + at, K = A + (Te + 1) * ge + He, D = A + (Te + 1) * ge + at;
        X.push(oe, z, D), X.push(oe, D, K);
      }
      A += Ae * ge;
    }
    if (B.length === 0) return;
    const F = new Me();
    F.setAttribute("position", new yt(B, 3)), F.setAttribute("color", new yt($, 3)), F.setIndex(X), F.computeVertexNormals();
    const R = new tt({ vertexColors: true, side: bt }), I = new Ge(F, R);
    I.frustumCulled = false, d.add(I);
  }), d.__colorMapValues = x, d;
}
function oa() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const sa = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, aa = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, ia = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function ut(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const la = 16755200, Bo = 56831, ra = 56831, ca = 56831, En = 65382;
function da(e) {
  const l = new We();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const h = new dn(1, 16, 16), m = new tt({ color: la, transparent: true, opacity: 0.85, depthTest: false }), d = new Ge(h, m);
  d.visible = false, d.renderOrder = 100, l.add(d);
  const w = new Me(), p = new rt({ color: Bo, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), x = new Xt(w, p);
  x.visible = false, x.renderOrder = 100, l.add(x);
  const g = new tt({ color: Bo, transparent: true, opacity: 0.7, depthTest: false }), b = new Ge(new Vo(1, 1, 1, 12), g);
  b.visible = false, b.renderOrder = 100, l.add(b);
  const P = new Me(), v = new tt({ color: ra, transparent: true, opacity: 0.45, side: bt, depthTest: false }), N = new Ge(P, v);
  N.visible = false, N.renderOrder = 100, l.add(N);
  const me = new Me(), ae = new rt({ color: ca, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), ee = new Xt(me, ae);
  ee.visible = false, ee.renderOrder = 100, l.add(ee);
  const C = new tt({ color: En, transparent: true, opacity: 0.95, depthTest: false }), te = new tt({ color: En, transparent: true, opacity: 0.85, depthTest: false }), G = new Vo(1, 1, 1, 12), xe = new tt({ color: En, transparent: true, opacity: 0.55, side: bt, depthTest: false }), ye = new rt({ color: En, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), B = [];
  window.__hekatanModelSelection = B;
  const $ = new We();
  $.renderOrder = 101, l.add($);
  const X = document.createElement("div");
  Object.assign(X.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), X.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(X);
  }, 0);
  function A(oe) {
    const z = e.derivedNodes.rawVal;
    return !z || oe < 0 || oe >= z.length ? null : new M(z[oe][0], z[oe][1], z[oe][2]);
  }
  function F(oe, z) {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const K = e.getActiveCamera();
    if (!K || !e.mesh) return null;
    const D = e.rendererElm.getBoundingClientRect(), W = oe - D.left, se = z - D.top, ue = e.derivedNodes.rawVal, ce = (_a = e.mesh.elements) == null ? void 0 : _a.rawVal;
    if (!ue || !ce) return null;
    const _e = /* @__PURE__ */ new Map(), Pe = (Xe) => {
      if (_e.has(Xe)) return _e.get(Xe);
      const Ve = A(Xe);
      if (!Ve) return _e.set(Xe, null), null;
      const Se = Ve.clone().project(K), Ne = (Se.x * 0.5 + 0.5) * D.width, we = (-Se.y * 0.5 + 0.5) * D.height, Ze = { x: Ne, y: we, z: Se.z };
      return _e.set(Xe, Ze), Ze;
    }, Fe = /* @__PURE__ */ new Set();
    for (const Xe of ce) if (Xe) for (const Ve of Xe) Fe.add(Ve);
    const $e = 8;
    let Ie = -1, Ue = $e;
    for (let Xe = 0; Xe < ue.length; Xe++) {
      if (!Fe.has(Xe)) continue;
      const Ve = Pe(Xe);
      if (!Ve || Ve.z < -1 || Ve.z > 1) continue;
      const Se = Ve.x - W, Ne = Ve.y - se, we = Math.sqrt(Se * Se + Ne * Ne);
      we < Ue && (Ue = we, Ie = Xe);
    }
    const Ee = oa(), ct = aa[Ee.dispUnit] ?? 1e3, Ke = sa[Ee.forceUnit] ?? 1;
    if (Ie >= 0) {
      const Xe = ue[Ie];
      let Ve = `Nodo ${Ie}
(${Xe[0].toFixed(3)}, ${Xe[1].toFixed(3)}, ${Xe[2].toFixed(3)})`;
      const Se = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Se == null ? void 0 : Se.deformations) {
        const Ne = Se.deformations.get(Ie);
        if (Ne && (Ve += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ve += `
Ux = ${ut(Ne[0] * ct, 3)} ${Ee.dispUnit}`, Ve += `
Uy = ${ut(Ne[1] * ct, 3)} ${Ee.dispUnit}`, Ve += `
Uz = ${ut(Ne[2] * ct, 3)} ${Ee.dispUnit}`, (Math.abs(Ne[3]) > 1e-9 || Math.abs(Ne[4]) > 1e-9 || Math.abs(Ne[5]) > 1e-9) && (Ve += `
Rx = ${ut(Ne[3] * 1e3, 3)} mrad`, Ve += `
Ry = ${ut(Ne[4] * 1e3, 3)} mrad`, Ve += `
Rz = ${ut(Ne[5] * 1e3, 3)} mrad`)), Se.reactions) {
          const we = Se.reactions.get(Ie);
          we && (Math.abs(we[0]) > 1e-9 || Math.abs(we[1]) > 1e-9 || Math.abs(we[2]) > 1e-9 || Math.abs(we[3]) > 1e-6 || Math.abs(we[4]) > 1e-6 || Math.abs(we[5]) > 1e-6) && (Ve += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ve += `
Fx = ${ut(we[0] * Ke)} ${Ee.forceUnit}`, Ve += `
Fy = ${ut(we[1] * Ke)} ${Ee.forceUnit}`, Ve += `
Fz = ${ut(we[2] * Ke)} ${Ee.forceUnit}`, (Math.abs(we[3]) > 1e-6 || Math.abs(we[4]) > 1e-6 || Math.abs(we[5]) > 1e-6) && (Ve += `
Mx = ${ut(we[3] * Ke)} ${Ee.forceUnit}\xB7m`, Ve += `
My = ${ut(we[4] * Ke)} ${Ee.forceUnit}\xB7m`, Ve += `
Mz = ${ut(we[5] * Ke)} ${Ee.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ie, info: Ve };
    }
    const nt = 5;
    let it = -1, ot = nt, Rt = "frame";
    for (let Xe = 0; Xe < ce.length; Xe++) {
      const Ve = ce[Xe];
      if (!(!Ve || Ve.length < 2)) {
        if (Ve.length === 2) {
          const Se = Pe(Ve[0]), Ne = Pe(Ve[1]);
          if (!Se || !Ne || Se.z < -1 || Se.z > 1 || Ne.z < -1 || Ne.z > 1) continue;
          const we = pa(W, se, Se.x, Se.y, Ne.x, Ne.y);
          we < ot && (ot = we, it = Xe, Rt = "frame");
        } else if (Ve.length === 3 || Ve.length === 4) {
          const Se = [];
          let Ne = true;
          for (const we of Ve) {
            const Ze = Pe(we);
            if (!Ze || Ze.z < -1 || Ze.z > 1) {
              Ne = false;
              break;
            }
            Se.push(Ze);
          }
          if (!Ne) continue;
          if (ua(W, se, Se)) {
            const Ze = Se.reduce((Je, ft) => Je + ft.z, 0) / Se.length * 1e-3;
            Ze < ot && (ot = Ze, it = Xe, Rt = "shell");
          }
        } else if (Ve.length === 8) {
          const Se = [];
          let Ne = true;
          for (const he of Ve) {
            const Be = Pe(he);
            if (!Be || Be.z < -1 || Be.z > 1) {
              Ne = false;
              break;
            }
            Se.push(Be);
          }
          if (!Ne) continue;
          const we = Math.min(...Se.map((he) => he.x)), Ze = Math.max(...Se.map((he) => he.x)), Je = Math.min(...Se.map((he) => he.y)), ft = Math.max(...Se.map((he) => he.y));
          if (W >= we && W <= Ze && se >= Je && se <= ft) {
            const Be = Se.reduce((Qe, mt) => Qe + mt.z, 0) / Se.length * 1e-3;
            Be < ot && (ot = Be, it = Xe, Rt = "solid");
          }
        }
      }
    }
    if (it >= 0) {
      const Xe = ce[it];
      let Se = `${Rt === "frame" ? "Frame" : Rt === "shell" ? "Shell" : "Solid"} ${it}`;
      const Ne = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, we = (_g = (_f = Ne == null ? void 0 : Ne.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, it);
      if (we) {
        we.name && (Se += `
  \u{1F4CB} ${we.name}`), we.shape && (Se += `
  Shape: ${we.shape}`);
        const Ze = /concrete|hormig|rect.*sólida/i.test(we.shape || ""), Je = Ze ? 100 : 1e3, ft = Ze ? "cm" : "mm", he = (Qe) => {
          const mt = Qe * Je;
          return Math.abs(mt - Math.round(mt)) < 0.05 ? `${Math.round(mt)}` : `${mt.toFixed(1)}`;
        }, Be = [];
        if (we.D != null && Be.push(`D=${he(we.D)}`), we.B != null && Be.push(`B=${he(we.B)}`), we.TF != null && Be.push(`TF=${he(we.TF)}`), we.TW != null && Be.push(`TW=${he(we.TW)}`), we.t != null && Be.push(`t=${he(we.t)}`), Be.length && (Se += `
  Dim: ${Be.join(" ")} ${ft}`), we.material) {
          let Qe = we.material;
          we.fillMaterial && (Qe += ` + FILL "${we.fillMaterial}"`), Se += `
  Mat: ${Qe}`;
        }
      } else {
        const Ze = (_i = (_h = Ne == null ? void 0 : Ne.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, it), Je = (_k = (_j = Ne == null ? void 0 : Ne.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, it);
        Ze ? (Se += `
  ${Ze}`, Je && !Ze.includes(Je) && (Se += `  (${Je})`)) : Je && (Se += `
  Material: ${Je}`);
      }
      if (Se += `
nodos: [${Xe.join(", ")}]`, Rt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Ze = e.mesh.analyzeOutputs.rawVal, Je = ia[Ee.stressUnit] ?? 1, ft = [["bendingXX", "Mxx", Ke, `${Ee.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ke, `${Ee.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ke, `${Ee.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ke, `${Ee.forceUnit}/m`], ["membraneYY", "Nyy", Ke, `${Ee.forceUnit}/m`], ["membraneXY", "Nxy", Ke, `${Ee.forceUnit}/m`], ["shearX", "Qx", Ke, `${Ee.forceUnit}/m`], ["shearY", "Qy", Ke, `${Ee.forceUnit}/m`], ["vonMises", "\u03C3VM", Je, Ee.stressUnit], ["pressure", "p", Je, Ee.stressUnit]], he = [];
        for (const [Be, Qe, mt, Ut] of ft) {
          const xt = Ze == null ? void 0 : Ze[Be];
          if (xt && xt instanceof Map) {
            const zt = xt.get(it);
            if (zt != null) {
              if (typeof zt == "number") he.push(`${Qe} = ${ut(zt * mt, 3)} ${Ut}`);
              else if (Array.isArray(zt)) {
                let st = zt[0];
                for (const Wt of zt) Math.abs(Wt) > Math.abs(st) && (st = Wt);
                he.push(`${Qe} = ${ut(st * mt, 3)} ${Ut}`);
              }
            }
          }
        }
        he.length > 0 && (Se += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + he.slice(0, 8).join(`
`));
      }
      if (Rt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const Ze = e.mesh.deformOutputs.rawVal, Je = e.mesh.elementInputs.rawVal, ft = Ze == null ? void 0 : Ze.deformations;
        if (ft && Xe.length === 2) {
          const he = ft.get(Xe[0]), Be = ft.get(Xe[1]), Qe = ue[Xe[0]], mt = ue[Xe[1]];
          if (he && Be && Qe && mt) {
            const Ut = mt[0] - Qe[0], xt = mt[1] - Qe[1], zt = mt[2] - Qe[2], st = Math.sqrt(Ut * Ut + xt * xt + zt * zt);
            if (st > 1e-9) {
              const Wt = Ut / st, Tt = xt / st, nn = zt / st, Jt = (Be[0] - he[0]) * Wt + (Be[1] - he[1]) * Tt + (Be[2] - he[2]) * nn, Ot = ((_n = Je.elasticities) == null ? void 0 : _n.get(it)) ?? 0, Bn = ((_o = Je.areas) == null ? void 0 : _o.get(it)) ?? 0, Dn = ((_p = Je.momentsOfInertiaY) == null ? void 0 : _p.get(it)) ?? 0, on = ((_q = Je.momentsOfInertiaZ) == null ? void 0 : _q.get(it)) ?? 0, Xn = ((_r = Je.torsionalConstants) == null ? void 0 : _r.get(it)) ?? 0, pn = ((_s2 = Je.shearModuli) == null ? void 0 : _s2.get(it)) ?? Ot / 2.6, Ft = Ot * Bn * (Jt / st), Bt = (Be[3] - he[3]) * Wt + (Be[4] - he[4]) * Tt + (Be[5] - he[5]) * nn, Zt = pn * Xn * (Bt / st), Qt = Be[4] - he[4], Yn = Be[5] - he[5], Kt = Ot * Dn * Qt / st, un = Ot * on * Yn / st;
              Se += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Se += `
L = ${ut(st, 3)} m`, Se += `
\u0394L = ${ut(Jt * ct, 3)} ${Ee.dispUnit}`, Se += `
\u03B5 = ${ut(Jt / st, 6)}`, Math.abs(Ft) > 1e-6 && (Se += `
N \u2248 ${ut(Ft * Ke)} ${Ee.forceUnit}`), Math.abs(Zt) > 1e-6 && (Se += `
T \u2248 ${ut(Zt * Ke)} ${Ee.forceUnit}\xB7m`), Math.abs(Kt) > 1e-6 && (Se += `
My \u2248 ${ut(Kt * Ke)} ${Ee.forceUnit}\xB7m`), Math.abs(un) > 1e-6 && (Se += `
Mz \u2248 ${ut(un * Ke)} ${Ee.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Rt, idx: it, info: Se };
    }
    return null;
  }
  function R(oe, z, K) {
    var _a, _b, _c;
    if (d.visible = false, x.visible = false, b.visible = false, N.visible = false, ee.visible = false, !oe || !e.mesh) {
      X.style.display = "none", e.render();
      return;
    }
    const D = (_a = e.mesh.elements) == null ? void 0 : _a.rawVal;
    if (oe.type === "node") {
      const ce = A(oe.idx);
      if (ce) {
        const _e = e.derivedNodes.rawVal ?? [];
        let Pe = 1;
        if (_e.length >= 2) {
          let Ie = [1 / 0, 1 / 0, 1 / 0], Ue = [-1 / 0, -1 / 0, -1 / 0];
          for (const Ee of _e) for (let ct = 0; ct < 3; ct++) Ee[ct] < Ie[ct] && (Ie[ct] = Ee[ct]), Ee[ct] > Ue[ct] && (Ue[ct] = Ee[ct]);
          Pe = Math.max(Ue[0] - Ie[0], Ue[1] - Ie[1], Ue[2] - Ie[2], 0.1);
        }
        const Fe = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, $e = 0.021 * Pe * Fe;
        d.position.copy(ce), d.scale.setScalar($e), d.visible = true;
      }
    } else if (oe.type === "frame" && D) {
      const ce = D[oe.idx], _e = A(ce[0]), Pe = A(ce[1]);
      if (_e && Pe) {
        const Fe = _e.clone().add(Pe).multiplyScalar(0.5), $e = Pe.clone().sub(_e), Ie = $e.length(), ct = e.getActiveCamera().position.distanceTo(Fe) * 35e-4;
        b.position.copy(Fe);
        const Ke = new M(0, 1, 0), nt = Ke.clone().cross($e).normalize(), it = Ke.angleTo($e);
        b.quaternion.setFromAxisAngle(nt, it), b.scale.set(ct, Ie, ct), b.visible = true;
      }
    } else if (oe.type === "shell" && D) {
      const ce = D[oe.idx], _e = [], Pe = [];
      for (const Fe of ce) {
        const $e = A(Fe);
        if (!$e) return;
        _e.push($e.x, $e.y, $e.z);
      }
      ce.length === 4 ? Pe.push(0, 1, 2, 0, 2, 3) : ce.length === 3 && Pe.push(0, 1, 2), P.setAttribute("position", new yt(_e, 3)), P.setIndex(Pe), P.computeVertexNormals(), N.visible = true;
    } else if (oe.type === "solid" && D) {
      const ce = D[oe.idx], _e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Pe = [];
      for (const [Fe, $e] of _e) {
        const Ie = A(ce[Fe]), Ue = A(ce[$e]);
        Ie && Ue && Pe.push(Ie.x, Ie.y, Ie.z, Ue.x, Ue.y, Ue.z);
      }
      me.setAttribute("position", new yt(Pe, 3)), ee.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      X.style.display = "none", e.render();
      return;
    }
    X.textContent = oe.info, X.style.whiteSpace = "pre-line", X.style.display = "block";
    const se = e.rendererElm.getBoundingClientRect(), ue = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? se;
    X.style.left = `${z - ue.left}px`, X.style.top = `${K - ue.top}px`, e.render();
  }
  let I = "", E = 0, J = 0;
  const le = window.__hekatanHoverDebug ?? false, ne = (oe) => {
    E && cancelAnimationFrame(E), E = requestAnimationFrame(() => {
      var _a, _b, _c;
      const z = F(oe.clientX, oe.clientY);
      if (le && J < 5) {
        const D = e.derivedNodes.rawVal, W = (_b = (_a = e.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${oe.clientX}, ${oe.clientY}) nodes=${(D == null ? void 0 : D.length) ?? 0} elems=${(W == null ? void 0 : W.length) ?? 0} hover=`, z), J++;
      }
      const K = z ? `${z.type}:${z.idx}` : "";
      if (K !== I) I = K, R(z, oe.clientX, oe.clientY);
      else if (z) {
        const D = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        X.style.left = `${oe.clientX - D.left}px`, X.style.top = `${oe.clientY - D.top}px`;
      }
    });
  };
  let j = null;
  const V = () => {
    I = "", d.visible = false, x.visible = false, b.visible = false, N.visible = false, ee.visible = false, X.style.display = "none", e.render();
  }, re = (oe) => {
    const z = e.rendererElm.getBoundingClientRect(), K = oe.clientX - z.left, D = oe.clientY - z.top;
    (K < -2 || D < -2 || K > z.width + 2 || D > z.height + 2) && (j && clearTimeout(j), j = window.setTimeout(V, 200));
  }, q = () => {
    j && (clearTimeout(j), j = null);
  };
  e.rendererElm.addEventListener("pointermove", ne), e.rendererElm.addEventListener("pointerleave", re), e.rendererElm.addEventListener("pointerenter", q);
  function pe() {
    var _a, _b, _c;
    const oe = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
    return oe === "select" || oe === "none" || !oe;
  }
  let fe = null;
  e.rendererElm.addEventListener("pointerdown", (oe) => {
    oe.button === 0 && (fe = { x: oe.clientX, y: oe.clientY });
  }), e.rendererElm.addEventListener("pointerup", (oe) => {
    if (oe.button !== 0 || !fe) return;
    const z = oe.clientX - fe.x, K = oe.clientY - fe.y;
    if (fe = null, z * z + K * K > 9 || !pe()) return;
    const D = F(oe.clientX, oe.clientY);
    D ? (He({ type: D.type, idx: D.idx }, oe.shiftKey), Te()) : at();
  }), window.addEventListener("keydown", (oe) => {
    if (oe.key !== "Escape" || !B.length) return;
    const z = document.activeElement, K = !!z && (z.id === "hk3-cmd-input" || z.id === "hk-dyn-input") && z.value === "";
    z && (z.tagName === "INPUT" || z.tagName === "TEXTAREA" || z.isContentEditable) && !K || at();
  }, { capture: true });
  function Ae() {
    for (const oe of $.children.slice()) {
      $.remove(oe);
      const z = oe.geometry;
      z && z !== h && z !== G && z.dispose();
    }
  }
  function ge(oe, z) {
    var _a, _b, _c;
    const K = (_b = (_a = e.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
    if (oe.type === "node") {
      const D = A(oe.idx);
      if (!D) return;
      const W = ((_c = e.derivedDisplayScale) == null ? void 0 : _c.rawVal) ?? 1, se = new Ge(h, C);
      se.position.copy(D), se.scale.setScalar(0.025 * z * W), se.renderOrder = 101, $.add(se);
    } else if (oe.type === "frame" && K) {
      const D = K[oe.idx], W = A(D[0]), se = A(D[1]);
      if (!W || !se) return;
      const ue = W.clone().add(se).multiplyScalar(0.5), ce = se.clone().sub(W), _e = ce.length(), Pe = e.getActiveCamera().position.distanceTo(ue), Fe = new Ge(G, te);
      Fe.position.copy(ue);
      const $e = new M(0, 1, 0);
      Fe.quaternion.setFromAxisAngle($e.clone().cross(ce).normalize(), $e.angleTo(ce)), Fe.scale.set(Pe * 35e-4, _e, Pe * 35e-4), Fe.renderOrder = 101, $.add(Fe);
    } else if (oe.type === "shell" && K) {
      const D = K[oe.idx], W = [], se = [];
      for (const _e of D) {
        const Pe = A(_e);
        if (!Pe) return;
        W.push(Pe.x, Pe.y, Pe.z);
      }
      D.length === 4 ? se.push(0, 1, 2, 0, 2, 3) : D.length === 3 && se.push(0, 1, 2);
      const ue = new Me();
      ue.setAttribute("position", new yt(W, 3)), ue.setIndex(se), ue.computeVertexNormals();
      const ce = new Ge(ue, xe);
      ce.renderOrder = 101, $.add(ce);
    } else if (oe.type === "solid" && K) {
      const D = K[oe.idx], W = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], se = [];
      for (const [_e, Pe] of W) {
        const Fe = A(D[_e]), $e = A(D[Pe]);
        Fe && $e && se.push(Fe.x, Fe.y, Fe.z, $e.x, $e.y, $e.z);
      }
      const ue = new Me();
      ue.setAttribute("position", new yt(se, 3));
      const ce = new Xt(ue, ye);
      ce.renderOrder = 101, $.add(ce);
    }
  }
  function Te() {
    if (Ae(), !B.length || !e.mesh) {
      e.render();
      return;
    }
    const oe = e.derivedNodes.rawVal ?? [];
    let z = 1;
    if (oe.length >= 2) {
      const K = [1 / 0, 1 / 0, 1 / 0], D = [-1 / 0, -1 / 0, -1 / 0];
      for (const W of oe) for (let se = 0; se < 3; se++) W[se] < K[se] && (K[se] = W[se]), W[se] > D[se] && (D[se] = W[se]);
      z = Math.max(D[0] - K[0], D[1] - K[1], D[2] - K[2], 0.1);
    }
    for (const K of B) ge(K, z);
    e.render();
  }
  function He(oe, z) {
    const K = B.findIndex((D) => D.type === oe.type && D.idx === oe.idx);
    K >= 0 ? B.splice(K, 1) : z || B.push(oe), B.length && B[B.length - 1];
  }
  function at() {
    B.length = 0, Te();
  }
  return Z.derive(() => {
    e.derivedNodes.val, B.length && Te();
  }), l;
}
function pa(e, l, h, m, d, w) {
  const p = d - h, x = w - m, g = p * p + x * x;
  if (g < 1e-9) {
    const ae = e - h, ee = l - m;
    return Math.sqrt(ae * ae + ee * ee);
  }
  let b = ((e - h) * p + (l - m) * x) / g;
  b = Math.max(0, Math.min(1, b));
  const P = h + b * p, v = m + b * x, N = e - P, me = l - v;
  return Math.sqrt(N * N + me * me);
}
function ua(e, l, h) {
  let m = false;
  for (let d = 0, w = h.length - 1; d < h.length; w = d++) {
    const p = h[d].x, x = h[d].y, g = h[w].x, b = h[w].y;
    x > l != b > l && e < (g - p) * (l - x) / (b - x + 1e-12) + p && (m = !m);
  }
  return m;
}
function Do(e, l = 8) {
  const h = document.createElement("div");
  h.id = "legend", h.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    Z.derive(() => {
      In.val, h.style.background = Cs();
    });
  });
  const m = document.createElement("div");
  m.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", h.appendChild(m), setTimeout(() => {
    Z.derive(() => {
      m.textContent = lo.val ? `[${lo.val}]` : "";
    });
  });
  const d = Array.from({ length: l + 1 }, (g, b) => b / l).reverse();
  let w, p;
  d.forEach((g, b) => {
    w = document.createElement("div"), w.id = `marker-${b}`, w.className = "marker", w.style.marginTop = b == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", p = document.createElement("p"), p.id = `marker-text-${b}`, w.append(p), h.append(w);
  });
  const x = [];
  return h.querySelectorAll("p").forEach((g) => x.push(g)), setTimeout(() => {
    Z.derive(() => {
      d.forEach((g, b) => {
        const P = x[b];
        P && (P.innerText = fa(e.val, g).toString());
      });
    });
  }), h;
}
function fa(e, l) {
  const h = bn.val;
  if (h) return Xo(h[0] + l * (h[1] - h[0]));
  const m = e.filter((p) => Number.isFinite(p));
  if (m.length === 0) return "0";
  const [d, w] = co(m);
  return Xo(d + l * (w - d));
}
function Xo(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function ka({ mesh: e, settingsObj: l, drawingObj: h, objects3D: m, solids: d }) {
  Ss.DEFAULT_UP = new M(0, 0, 1);
  const w = document.createElement("div"), p = new vs(), x = new Ms(45, 1, 0.1, 2 * 1e6), g = new bs(-10, 10, 10, -10, -1e3, 2e6);
  let b = x;
  const P = new _s({ antialias: true });
  P.localClippingEnabled = true;
  const v = new Lo(x, P.domElement);
  v.enableDamping = true, v.dampingFactor = 0.1, v.screenSpacePanning = true, v.zoomSpeed = 0.8, v.panSpeed = 1.2, v.rotateSpeed = 0.9, v.keyPanSpeed = 12, v.listenToKeyEvents(window), v.touches = { ONE: Fn.ROTATE, TWO: Fn.DOLLY_PAN }, P.domElement.addEventListener("wheel", (z) => {
    if (!z.ctrlKey && Math.abs(z.deltaX) > Math.abs(z.deltaY) * 1.5) {
      z.preventDefault();
      const K = v.target, D = new M().subVectors(x.position, K), W = new M();
      W.crossVectors(x.up, D).normalize();
      const ue = D.length() * 1e-3 * v.panSpeed;
      K.addScaledVector(W, z.deltaX * ue), x.position.addScaledVector(W, z.deltaX * ue), v.update();
    }
  }, { passive: false });
  const N = new no(new M(-1, 0, 0), 0), me = new no(new M(0, -1, 0), 0), ae = new no(new M(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function ee() {
    const z = window.__hekatanClip, K = [];
    z.enableX && (N.normal.set(z.invertX ? 1 : -1, 0, 0), N.constant = z.invertX ? -z.posX : z.posX, K.push(N)), z.enableY && (me.normal.set(0, z.invertY ? 1 : -1, 0), me.constant = z.invertY ? -z.posY : z.posY, K.push(me)), z.enableZ && (ae.normal.set(0, 0, z.invertZ ? 1 : -1), ae.constant = z.invertZ ? -z.posZ : z.posZ, K.push(ae)), P.clippingPlanes = K, p.traverse((W) => {
      const se = W;
      if (se.material) {
        const ue = Array.isArray(se.material) ? se.material : [se.material];
        for (const ce of ue) ce.clippingPlanes = K, ce.needsUpdate = true;
      }
    });
    const D = window.__hekatanPanes ?? [];
    for (const W of D) try {
      W && typeof W.refresh == "function" && W.refresh();
    } catch {
    }
    P.render(p, b);
  }
  ee(), window.__hekatanClipApply = ee;
  const C = As(l), te = Z.derive(() => Math.pow(10, C.displayScale.val / 10)), G = ha(e, C), xe = () => {
    const z = [];
    return C.gridXY.rawVal && z.push("xy"), C.gridXZ.rawVal && z.push("xz"), C.gridYZ.rawVal && z.push("yz"), z;
  }, ye = () => {
    const z = C.gridStep.rawVal, K = Math.max(z, C.gridMajor.rawVal);
    return { planes: xe(), majorStep: K, minorStep: z };
  };
  let B = so(C.gridSize.rawVal, ye());
  B.visible = C.gridVisible.rawVal, window.__hekatanSnap2D = C.cursorSnap.rawVal;
  const $ = () => {
    const z = Math.max(0, Math.min(1, C.gridOpacity.rawVal));
    B.traverse((K) => {
      const D = K.material;
      if (!D || !("opacity" in D)) return;
      const W = K.name ?? "";
      let se = 0.35;
      W.includes("border") ? se = 1 : W.includes("major") && (se = 0.75), D.opacity = z * se;
    });
  };
  $(), w.appendChild(Fs(C, e, d)), w.setAttribute("id", "viewer"), w.appendChild(P.domElement), P.setPixelRatio(window.devicePixelRatio);
  const X = tn();
  P.setClearColor(X.background, 1);
  const A = C.gridSize.rawVal, F = A * 0.5 + A * 0.5 / Math.tan(45 * 0.5);
  x.position.set(0, 0, F), x.up.set(0, 1, 0), v.target.set(0, 0, 0), v.minDistance = 0.1, v.maxDistance = 1e4, w.__settings = C, v.zoomSpeed = 1, v._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, v.update();
  let R = Io(C.gridSize.rawVal, C.flipAxes.rawVal);
  p.add(B, R), Z.derive(() => {
    window.__hekatanGridPlaneXY = C.gridXY.val, window.__hekatanGridPlaneXZ = C.gridXZ.val, window.__hekatanGridPlaneYZ = C.gridYZ.val;
  });
  let I = true;
  Z.derive(() => {
    const z = C.gridVisible.val;
    if (I) {
      I = false;
      return;
    }
    B.visible = z, q();
  });
  let E = true;
  Z.derive(() => {
    if (C.gridOpacity.val, E) {
      E = false;
      return;
    }
    $(), q();
  }), Z.derive(() => {
    const z = C.cursorSnap.val;
    window.__hekatanSnap2D = z;
  });
  let J = true;
  Z.derive(() => {
    var _a;
    const z = C.gridSize.val, K = C.flipAxes.val;
    if (C.gridXY.val, C.gridXZ.val, C.gridYZ.val, C.gridStep.val, C.gridMajor.val, J) {
      J = false;
      return;
    }
    p.remove(B), (_a = B.traverse) == null ? void 0 : _a.call(B, (se) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = se.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = se.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), B = so(z, ye()), B.visible = C.gridVisible.rawVal, p.add(B), $(), p.remove(R), R.traverse((se) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = se.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = se.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), R = Io(z, K), p.add(R);
    const D = z * 0.5 + z * 0.5 / Math.tan(45 * 0.5);
    x.position.distanceTo(v.target), Math.abs(x.position.x) < 0.1 && Math.abs(x.position.y) < 0.1 && x.position.z > 0 ? x.position.set(0, 0, D) : x.position.set(0.5 * z, -D, 0.5 * z), v.target.set(0, 0, 0), v.minDistance = Math.max(0.05, z * 0.01), v.maxDistance = Math.max(50, z * 50), v.update(), q();
  }), new ResizeObserver((z) => {
    var _a, _b;
    for (const K of z) {
      const D = (_a = K.target) == null ? void 0 : _a.clientWidth, W = (_b = K.target) == null ? void 0 : _b.clientHeight;
      if (D === 0 || W === 0) continue;
      const ue = (ne ? D / 2 : D) / W;
      x.aspect = ue, x.updateProjectionMatrix();
      const ce = g.top;
      if (g.left = -ce * ue, g.right = ce * ue, g.updateProjectionMatrix(), j && j.isPerspectiveCamera) j.aspect = ue, j.updateProjectionMatrix();
      else if (j && j.isOrthographicCamera) {
        const _e = j, Pe = _e.top;
        _e.left = -Pe * ue, _e.right = Pe * ue, _e.updateProjectionMatrix();
      }
      P.setSize(D, W), q();
    }
  }).observe(w), v.addEventListener("change", q), Z.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a = e == null ? void 0 : e.nodes) == null ? void 0 : _a.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, C.displayScale.val, C.nodes.val, C.elements.val, (_g = C.edges) == null ? void 0 : _g.val, C.elemColumns.val, C.elemBeams.val, C.nodesIndexes.val, C.elementsIndexes.val, C.orientations.val, C.sections.val, C.secColumns.val, C.secBeams.val, C.secFloor.val, C.supports.val, C.loads.val, C.deformedShape.val, C.nodeResults.val, C.frameResults.val, C.shellResults.val, (_h = C.solidResults) == null ? void 0 : _h.val, (_i = C.extruded) == null ? void 0 : _i.val, setTimeout(q);
  });
  let ne = false, j = null, V = null, re = false;
  function q() {
    const z = w.clientWidth || 1, K = w.clientHeight || 1;
    if (!ne || !j) {
      P.setScissorTest(false), P.setViewport(0, 0, z, K), P.render(p, b);
      return;
    }
    const D = z / 2;
    P.setScissorTest(true), P.setViewport(0, 0, D, K), P.setScissor(0, 0, D, K), P.render(p, b), P.setViewport(D, 0, D, K), P.setScissor(D, 0, D, K), P.render(p, j), P.setScissorTest(false);
  }
  function pe(z) {
    b = z, v.object = z, v.update(), q();
  }
  function fe(z, K) {
    ne = z, K && (j = K);
    const D = w.clientWidth || 1, W = w.clientHeight || 1, ue = (z ? D / 2 : D) / W;
    x.isPerspectiveCamera && (x.aspect = ue, x.updateProjectionMatrix());
    const ce = g.top;
    if (g.left = -ce * ue, g.right = ce * ue, g.updateProjectionMatrix(), z && j) {
      if (V ? (V.object = j, V.update()) : (V = new Lo(j, P.domElement), V.enableDamping = true, V.dampingFactor = 0.1, V.screenSpacePanning = true, V.zoomSpeed = 0.8, V.panSpeed = 1.2, V.rotateSpeed = 0.9, V.touches = { ONE: Fn.ROTATE, TWO: Fn.DOLLY_PAN }, V.target.copy(v.target), V.addEventListener("change", q), V.enabled = false), !re) {
        const _e = (Pe) => {
          if (!ne || !V) return;
          const Fe = P.domElement.getBoundingClientRect(), $e = Pe.clientX - Fe.left, Ie = Fe.width / 2, Ue = $e >= Ie;
          v.enabled = !Ue, V.enabled = Ue;
        };
        P.domElement.addEventListener("pointerdown", _e, true), P.domElement.addEventListener("wheel", _e, { capture: true, passive: true }), re = true;
      }
    } else z || (v.enabled = true, V && (V.enabled = false));
    w.__splitMode = z, window.__hekatanSplitMode = z, window.__hekatanSplitCamera = z ? j : null, q();
  }
  if (e) {
    p.add(Es(C, G, te), ks(e, C, G), Ls(C, G, te), $s(e, C, G, te), Ts(e, C, G, te), Vs(e, C, G, te), Bs(e, C, G, te), Xs(e, C, G, te), Zs(e, C, G), Hs(e, C, G, te), Ks(e, C, G, te));
    const z = da({ scene: p, rendererElm: P.domElement, getActiveCamera: () => b, derivedNodes: G, derivedDisplayScale: te, mesh: e, settings: C, render: q });
    p.add(z);
    const K = va(e, C), D = Os(e, C, G, K), W = Do(K);
    p.add(D), w.appendChild(W);
    const se = na(e, C, G);
    p.add(se);
    const ue = se.__colorMapValues, ce = Do(ue);
    ce.id = "frame-legend", w.appendChild(ce), Z.derive(() => {
      var _a;
      const _e = C.shellResults.val != "none", Pe = (((_a = C.solidResults) == null ? void 0 : _a.val) ?? "none") !== "none", Fe = _e || Pe, $e = C.frameResults.val.startsWith("contour:"), Ie = K.val.some((Ue) => Number.isFinite(Ue));
      W.hidden = !Fe || !Ie, D.visible = Fe, ce.hidden = !$e;
    });
  }
  if (d) {
    const z = new Zo(16777215, 0.5);
    p.add(z);
    const K = new $n(16777215, 0.5);
    K.position.set(30, 25, -10), K.shadow.mapSize.width = 1024, K.shadow.mapSize.height = 1024, p.add(K);
    const D = 10;
    K.shadow.camera.left = -D, K.shadow.camera.right = D, K.shadow.camera.top = D, K.shadow.camera.bottom = -D, K.shadow.camera.far = 1e3;
    const W = new $n(16777215, 0.5);
    W.color.setHSL(11, 43, 96), W.position.set(-10, 0, 30), p.add(W), Z.derive(() => {
      (d == null ? void 0 : d.val.length) && (p.remove(...d.oldVal), p.add(...d.rawVal), q());
    }), Z.derive(() => {
      d.rawVal.forEach((se) => se.visible = C.solids.val), q();
    });
  }
  if (m) {
    const z = [], K = (W) => {
      var _a;
      return ((_a = W == null ? void 0 : W.userData) == null ? void 0 : _a.isCota) ? C.showCotas.val : C.custom3D.val;
    }, D = () => {
      for (const W of z) W.visible = K(W);
      q();
    };
    Z.derive(() => {
      const W = m.val;
      z.length && (p.remove(...z), z.length = 0), W.length && (p.add(...W), z.push(...W), D()), q();
    }), Z.derive(() => {
      C.custom3D.val, D();
    }), Z.derive(() => {
      C.showCotas.val, D();
    });
  }
  h && Ws({ drawingObj: h, gridObj: B, scene: p, getActiveCamera: () => b, controls: v, gridSize: A, derivedDisplayScale: te, rendererElm: P.domElement, viewerRender: q }), No((z, K) => {
    var _a;
    P.setClearColor(K.background, 1), p.remove(B), (_a = B.traverse) == null ? void 0 : _a.call(B, (D) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = D.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = D.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), B = so(C.gridSize.rawVal, { planes: xe() }), p.add(B), w.style.setProperty("--awatif-legend-color", K.legendMarker), q();
  });
  const Ae = { scene: p, perspCamera: x, orthoCamera: g, get camera() {
    return b;
  }, controls: v, renderer: P, rendererElm: P.domElement, render: q, setActiveCamera: pe, setSplitMode: fe, get splitMode() {
    return ne;
  }, get splitCamera() {
    return j;
  }, settings: C };
  w.__ctx = Ae;
  const ge = document.createElement("div");
  ge.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Te = (z, K, D) => {
    const W = document.createElement("button");
    return W.textContent = z, W.title = K, W.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), W.onmouseenter = () => {
      W.style.background = "rgba(70,70,70,0.9)";
    }, W.onmouseleave = () => {
      W.style.background = "rgba(40,40,40,0.85)";
    }, W.onclick = (se) => {
      se.preventDefault(), D();
    }, W;
  }, He = (z, K) => {
    const D = v.target, W = new M().subVectors(b.position, D), se = W.length(), ue = new M(), ce = new M();
    ue.crossVectors(b.up, W).normalize(), ce.copy(b.up).normalize();
    const _e = se * 0.05;
    D.addScaledVector(ue, -z * _e), D.addScaledVector(ce, K * _e), b.position.addScaledVector(ue, -z * _e), b.position.addScaledVector(ce, K * _e), v.update(), q();
  }, at = (z) => {
    const K = new M().subVectors(b.position, v.target);
    K.multiplyScalar(z), b.position.copy(v.target).add(K), v.update(), q();
  }, oe = () => {
    const z = document.createElement("div");
    return z.style.cssText = "width:32px;height:32px;", z;
  };
  return ge.append(oe()), ge.append(Te("\u2191", "Pan arriba", () => He(0, 1))), ge.append(Te("\u2295", "Zoom in", () => at(0.85))), ge.append(Te("\u2190", "Pan izquierda", () => He(-1, 0))), ge.append(Te("\u2302", "Reset vista", () => {
    v.reset(), q();
  })), ge.append(Te("\u2192", "Pan derecha", () => He(1, 0))), ge.append(Te("\u2296", "Zoom out", () => at(1.18))), ge.append(Te("\u2193", "Pan abajo", () => He(0, -1))), ge.append(oe()), getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(ge), w;
}
function ha(e, l) {
  return Z.derive(() => {
    var _a, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a = e == null ? void 0 : e.nodes) == null ? void 0 : _a.val) ?? [];
    const h = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], m = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!m || h.length === 0) return h;
    const d = l.deformScale.val, w = l.deformScale.val * l.deformScaleZ.val, p = Number.isFinite(d) ? d : 1, x = Number.isFinite(w) ? w : 1;
    return h.map((g, b) => {
      var _a2;
      const P = ((_a2 = m.get(b)) == null ? void 0 : _a2.slice(0, 3)) ?? [0, 0, 0], v = Number.isFinite(P[0]) ? P[0] : 0, N = Number.isFinite(P[1]) ? P[1] : 0, me = Number.isFinite(P[2]) ? P[2] : 0;
      return [g[0] + v * p, g[1] + N * p, g[2] + me * x];
    });
  });
}
const bn = Z.state(null), lo = Z.state(""), ma = Z.state("kN"), wa = Z.state("mm"), ya = Z.state("kN/m\xB2"), xa = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Yo = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, ga = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function va(e, l) {
  const h = Z.state([]);
  let m;
  return ((d) => {
    d.bendingXX = "bendingXX", d.bendingYY = "bendingYY", d.bendingXY = "bendingXY", d.membraneXX = "membraneXX", d.membraneYY = "membraneYY", d.membraneXY = "membraneXY", d.tranverseShearX = "tranverseShearX", d.tranverseShearY = "tranverseShearY", d.membranePrincipalMax = "membranePrincipalMax", d.membranePrincipalMin = "membranePrincipalMin", d.bendingPrincipalMax = "bendingPrincipalMax", d.bendingPrincipalMin = "bendingPrincipalMin", d.transverseShearMax = "transverseShearMax", d.vonMises = "vonMises", d.pressure = "pressure", d.displacementX = "displacementX", d.displacementY = "displacementY", d.displacementZ = "displacementZ";
  })(m || (m = {})), Z.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const d = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map(), ae = (K, D) => {
      K == null ? void 0 : K.forEach((W, se) => {
        const ue = e.elements.val[se];
        if (ue) for (let ce = 0; ce < ue.length; ce++) D.set(ue[ce], [W[ce] ?? W[0]]);
      });
    };
    ae((_b = (_a = e.analyzeOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.bendingXX, d), ae((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, w), ae((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, p), ae((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, x), ae((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, g), ae((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, b), ae((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, P), ae((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, v), ae((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, N), ae((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, me);
    const ee = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), ye = (K, D, W, se, ue) => {
      K.forEach((ce, _e2) => {
        var _a2, _b2;
        const Pe = ce[0] ?? 0, Fe = ((_a2 = D.get(_e2)) == null ? void 0 : _a2[0]) ?? 0, $e = ((_b2 = W.get(_e2)) == null ? void 0 : _b2[0]) ?? 0, Ie = (Pe + Fe) / 2, Ue = Math.hypot((Pe - Fe) / 2, $e);
        se.set(_e2, [Ie + Ue]), ue.set(_e2, [Ie - Ue]);
      });
    };
    ye(x, g, b, ee, C), ye(d, w, p, te, G), P.forEach((K, D) => {
      var _a2;
      xe.set(D, [Math.hypot(K[0] ?? 0, ((_a2 = v.get(D)) == null ? void 0 : _a2[0]) ?? 0)]);
    });
    const B = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, $ = (_w = l.solidResults) == null ? void 0 : _w.val, A = $ && $ !== "none" ? $ : l.shellResults.val, F = B == null ? void 0 : B[A], R = { bendingXX: [d, 0], bendingYY: [w, 0], bendingXY: [p, 0], membraneXX: [x, 0], membraneYY: [g, 0], membraneXY: [b, 0], tranverseShearX: [P, 0], tranverseShearY: [v, 0], membranePrincipalMax: [ee, 0], membranePrincipalMin: [C, 0], bendingPrincipalMax: [te, 0], bendingPrincipalMin: [G, 0], transverseShearMax: [xe, 0], vonMises: [N, 0], pressure: [me, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, I = l.shellResults.val, E = ma.val, J = wa.val, le = I === "displacementX" || I === "displacementY" || I === "displacementZ", ne = I === "bendingXX" || I === "bendingYY" || I === "bendingXY" || I === "bendingPrincipalMax" || I === "bendingPrincipalMin", j = I === "membraneXX" || I === "membraneYY" || I === "membraneXY" || I === "membranePrincipalMax" || I === "membranePrincipalMin", V = I === "vonMises" || I === "pressure", re = I === "tranverseShearX" || I === "tranverseShearY" || I === "transverseShearMax", q = (_D = l.solidResults) == null ? void 0 : _D.val, pe = q === "vonMises" || q === "sigmaXX" || q === "sigmaYY" || q === "sigmaZZ" || q === "tauXY" || q === "tauYZ" || q === "tauXZ", fe = q === "ux" || q === "uy" || q === "uz", Ae = ya.val, ge = pe ? ga[Ae] : fe || le ? Yo[J] : ne || j || V || re ? 1 / xa[E] : 1, Te = pe ? Ae : fe || le ? J : ne ? `${E}\xB7m/m` : j ? `${E}/m\xB2` : V ? `${E}/m\xB2` : re ? `${E}/m` : "";
    lo.val = Te, bn.val = Array.isArray(F) && F.length === 2 ? [F[0] * ge, F[1] * ge] : null;
    const He = Ho.val, oe = q && q !== "none" ? [N, 0] : R[I], z = [];
    if (e.nodes.val.forEach((K, D) => {
      const W = oe;
      if (!W || !W[0] || typeof W[0].has != "function") return;
      if (!W[0].has(D)) {
        z.push(Number.NaN);
        return;
      }
      const se = W[0].get(D), ue = se ? se[W[1]] ?? 0 : 0;
      z.push(ue * ge);
    }), !bn.val && He !== "auto") {
      const K = e.nodes.val, D = /* @__PURE__ */ new Set(), W = (ue, ce) => {
        var _a2;
        const _e2 = (_a2 = K[ue[0]]) == null ? void 0 : _a2[ce];
        return ue.every((Pe) => {
          var _a3;
          return Math.abs((((_a3 = K[Pe]) == null ? void 0 : _a3[ce]) ?? NaN) - _e2) < 1e-6;
        });
      };
      for (const ue of e.elements.val) {
        if (ue.length !== 4) continue;
        const ce = W(ue, 2), _e2 = !ce && W(ue, 0), Pe = !ce && W(ue, 1);
        if (He === "losas" ? ce : He === "muros" ? _e2 || Pe : He === "murosX" ? _e2 : He === "murosY" ? Pe : false) for (const Ie of ue) D.add(Ie);
      }
      const se = [];
      for (const ue of D) {
        const ce = z[ue];
        Number.isFinite(ce) && se.push(ce);
      }
      se.length && (bn.val = co(se));
    }
    h.val = z;
  }), h;
}
export {
  zs as a,
  Do as b,
  ma as c,
  wa as d,
  ya as e,
  ka as g
};
