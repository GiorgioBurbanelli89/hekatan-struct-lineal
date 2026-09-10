import { N as Gt, a6 as qn, q as Ns, v as W, a7 as Us, D as Pt, M as nt, B as Me, F as bt, a8 as Zs, x as ft, a9 as qs, aa as Ks, h as ts, ab as ns, r as rn, ac as Jn, ad as On, a4 as ws, _ as tt, a as ut, L as Ht, w as ys, b as Gs, ae as Hs, f as pt, V as _, $ as ln, af as bo, H as Ao, d as St, c as _o, Y as xs, Z as jn, G as Ws, z as An, A as Js, ag as Qn, t as Os, o as Qs, I as jt, a2 as zn, E as os, S as yn, m as Kn, ah as Fn, g as ss, i as as, j as is, C as ls, K as js, U as ea, W as ta, X as na, T as Gn, P as So, O as oa } from "./theme-Dxpmbnyd.js";
import { T as kt, O as rs } from "./Text-DxjkL_3A.js";
import { P as gs } from "./tweakpane-BXg6ZhiP.js";
import { e as sa } from "./styles-DjzQZscE.js";
class vs {
  constructor(l, d = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, d);
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
  setColorMap(l, d = 32) {
    this.map = ko[l] || ko.rainbow, this.n = d;
    const h = 1 / this.n, c = new Gt(), w = new Gt();
    this.lut.length = 0, this.lut.push(new Gt(this.map[0][1]));
    for (let p = 1; p < d; p++) {
      const g = p * h;
      for (let x = 0; x < this.map.length - 1; x++) if (g > this.map[x][0] && g <= this.map[x + 1][0]) {
        const k = this.map[x][0], z = this.map[x + 1][0];
        c.setHex(this.map[x][1], qn), w.setHex(this.map[x + 1][1], qn);
        const b = new Gt().lerpColors(c, w, (g - k) / (z - k));
        this.lut.push(b);
      }
    }
    return this.lut.push(new Gt(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Ns.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const d = Math.round(l * this.n);
    return this.lut[d];
  }
  addColorMap(l, d) {
    return ko[l] = d, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const d = l.getContext("2d", { alpha: false }), h = d.getImageData(0, 0, 1, this.n), c = h.data;
    let w = 0;
    const p = 1 / this.n, g = new Gt(), x = new Gt(), k = new Gt();
    for (let z = 1; z >= 0; z -= p) for (let b = this.map.length - 1; b >= 0; b--) if (z < this.map[b][0] && z >= this.map[b - 1][0]) {
      const H = this.map[b - 1][0], le = this.map[b][0];
      g.setHex(this.map[b - 1][1], qn), x.setHex(this.map[b][1], qn), k.lerpColors(g, x, (z - H) / (le - H)), c[w * 4] = Math.round(k.r * 255), c[w * 4 + 1] = Math.round(k.g * 255), c[w * 4 + 2] = Math.round(k.b * 255), c[w * 4 + 3] = 255, w += 1;
    }
    return d.putImageData(h, 0, 0), l;
  }
}
const ko = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Ms = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], aa = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Ms, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, eo = W.state("safe"), bs = W.state("auto");
function _s(t) {
  t = Math.max(0, Math.min(1, t));
  const l = aa[eo.val] ?? Ms;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, w, p, g] = l[h], [x, k, z, b] = l[h + 1];
    if (t <= x) {
      const H = (t - c) / (x - c);
      return [w + (k - w) * H, p + (z - p) * H, g + (b - g) * H];
    }
  }
  const d = l[l.length - 1];
  return [d[1], d[2], d[3]];
}
function cs() {
  const l = new Uint8Array(1024);
  for (let h = 0; h < 256; h++) {
    const c = h / 255, [w, p, g] = _s(c);
    l[h * 4 + 0] = w, l[h * 4 + 1] = p, l[h * 4 + 2] = g, l[h * 4 + 3] = 255;
  }
  const d = new qs(l, 256, 1, Ks);
  return d.minFilter = ts, d.magFilter = ts, d.wrapS = ns, d.wrapT = ns, d.needsUpdate = true, d;
}
function ia() {
  const l = [];
  for (let d = 0; d <= 12; d++) {
    const h = 1 - d / 12, [c, w, p] = _s(h);
    l.push(`rgb(${c | 0},${w | 0},${p | 0}) ${(d / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function Eo(t) {
  if (!t.length) return [0, 1];
  const l = [...t].sort((w, p) => w - p), d = (w) => l[Math.min(l.length - 1, Math.max(0, Math.round(w * (l.length - 1))))];
  let h = l.length >= 20 ? d(0.01) : l[0], c = l.length >= 20 ? d(0.99) : l[l.length - 1];
  return h >= 0 && c > 0 && (h = 0), c <= 0 && h < 0 && (c = 0), [h, c];
}
function la(t, l, d) {
  new vs();
  const h = cs(), c = new Us({ uniforms: { cmap: { value: h }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: Pt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  W.derive(() => {
    var _a2;
    eo.val;
    const p = c.uniforms.cmap.value;
    c.uniforms.cmap.value = cs(), (_a2 = p == null ? void 0 : p.dispose) == null ? void 0 : _a2.call(p);
  });
  const w = new nt(new Me(), c);
  return w.renderOrder = -1, w.frustumCulled = false, w.userData.isShellArea = true, w.name = "__hekatan_shell_colormap", W.derive(() => {
    w.geometry.setAttribute("position", new bt(t.val.flat(), 3));
    const p = [], g = [], x = [];
    l.val.forEach((ee, be) => {
      ee.length === 3 ? (p.push(ee[0], ee[1], ee[2]), g.push(be), x.push(0)) : ee.length === 4 && (p.push(ee[0], ee[1], ee[2]), p.push(ee[0], ee[2], ee[3]), g.push(be, be), x.push(0, 1));
    }), w.geometry.setIndex(new Zs(p, 1)), w.userData.faceToElem = g, w.userData.faceLocal = x;
    const k = d.val.filter((ee) => Number.isFinite(ee));
    let z, b;
    const H = Vn.val;
    if (H ? (b = H[0], z = H[1]) : [b, z] = Eo(k), z === b) {
      const ee = Math.max(Math.abs(z) * 1e-6, 1e-9);
      z += ee, b -= ee;
    }
    const le = H && H[0] > H[1], pe = Math.min(b, z), ae = Math.max(b, z), E = ae - pe, ie = new Float32Array(d.val.length);
    for (let ee = 0; ee < d.val.length; ee++) {
      const be = d.val[ee];
      if (!Number.isFinite(be)) {
        ie[ee] = -1;
        continue;
      }
      const U = ((le ? ae + pe - be : be) - pe) / E;
      ie[ee] = Math.max(0, Math.min(1, U));
    }
    w.geometry.setAttribute("scalar", new ft(ie, 1));
  }), w;
}
function ra(t, l, d) {
  const h = document.createElement("div"), c = new gs({ title: "Settings", expanded: true, container: h });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(c), h.setAttribute("id", "settings");
  const w = "hk_settingsPos";
  let p = null;
  try {
    const b = localStorage.getItem(w);
    b && (p = JSON.parse(b));
  } catch {
  }
  h.style.cssText = ["position:fixed", p ? `left:${p.left}px` : "left:8px", p ? `top:${p.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const g = () => {
    const b = h.querySelector(".tp-rotv_b");
    if (!b) {
      setTimeout(g, 200);
      return;
    }
    b.style.cursor = "move", b.style.userSelect = "none";
    let H = false, le = 0, pe = 0, ae = 0, E = 0;
    b.addEventListener("mousedown", (ie) => {
      H = true, le = ie.clientX, pe = ie.clientY;
      const ee = h.getBoundingClientRect();
      ae = ee.left, E = ee.top, h.style.left = `${ae}px`, h.style.top = `${E}px`;
    }), window.addEventListener("mousemove", (ie) => {
      if (!H) return;
      const ee = ie.clientX - le, be = ie.clientY - pe, ge = Math.max(0, Math.min(window.innerWidth - 40, ae + ee)), U = Math.max(0, Math.min(window.innerHeight - 40, E + be));
      h.style.left = `${ge}px`, h.style.top = `${U}px`;
    }), window.addEventListener("mouseup", () => {
      if (H) {
        H = false;
        try {
          localStorage.setItem(w, JSON.stringify({ left: parseFloat(h.style.left), top: parseFloat(h.style.top) }));
        } catch {
        }
      }
    });
  };
  if (g(), l == null ? void 0 : l.nodes) {
    c.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const b = c.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    b.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), b.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), b.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), b.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const H = b.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    H.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), H.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), H.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), H.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), H.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const le = c.addFolder({ title: "\u{1F441} Ver", expanded: false });
    le.addBinding(t.nodes, "val", { label: "Nodes" }), le.addBinding(t.elements, "val", { label: "Elements" }), le.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), le.addBinding(t.faces, "val", { label: "  Caras (fill)" }), le.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), le.addBinding(t.elemColumns, "val", { label: "    Columnas" }), le.addBinding(t.elemBeams, "val", { label: "    Vigas" }), le.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), le.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), le.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), le.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), le.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), le.addBinding(t.orientations, "val", { label: "Orientations" }), le.addBinding(t.sections, "val", { label: "Sections" }), le.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), le.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), le.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), le.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), le.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const b = c.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    b.addBinding(t.supports, "val", { label: "Supports" }), b.addBinding(t.loads, "val", { label: "Loads" }), b.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), b.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const b = c.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = b, b.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), b.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), b.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), b.addBinding(eo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), b.addBinding(bs, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), b.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), b.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), b.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), b.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  d && c.addBinding(t.solids, "val", { label: "Solids" });
  const x = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), k = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), z = () => {
    const b = window.__hekatanClipApply;
    typeof b == "function" && b();
  };
  return x.addBinding(k, "enableX", { label: "Cortar X" }).on("change", z), x.addBinding(k, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", z), x.addBinding(k, "invertX", { label: "  invertir X" }).on("change", z), x.addBinding(k, "enableY", { label: "Cortar Y" }).on("change", z), x.addBinding(k, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", z), x.addBinding(k, "invertY", { label: "  invertir Y" }).on("change", z), x.addBinding(k, "enableZ", { label: "Cortar Z" }).on("change", z), x.addBinding(k, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", z), x.addBinding(k, "invertZ", { label: "  invertir Z" }).on("change", z), h;
}
function ca(t) {
  return { gridSize: W.state((t == null ? void 0 : t.gridSize) ?? 30), gridVisible: W.state((t == null ? void 0 : t.gridVisible) ?? true), gridOpacity: W.state((t == null ? void 0 : t.gridOpacity) ?? 1), gridStep: W.state((t == null ? void 0 : t.gridStep) ?? 1), gridMajor: W.state((t == null ? void 0 : t.gridMajor) ?? 5), cursorSnap: W.state((t == null ? void 0 : t.cursorSnap) ?? 0.5), gridXY: W.state((t == null ? void 0 : t.gridXY) ?? true), gridXZ: W.state((t == null ? void 0 : t.gridXZ) ?? false), gridYZ: W.state((t == null ? void 0 : t.gridYZ) ?? false), displayScale: W.state((t == null ? void 0 : t.displayScale) ?? 1), nodes: W.state((t == null ? void 0 : t.nodes) ?? true), elements: W.state((t == null ? void 0 : t.elements) ?? true), edges: W.state((t == null ? void 0 : t.edges) ?? true), faces: W.state((t == null ? void 0 : t.faces) ?? true), elemColumns: W.state((t == null ? void 0 : t.elemColumns) ?? true), elemBeams: W.state((t == null ? void 0 : t.elemBeams) ?? true), elemFrames: W.state((t == null ? void 0 : t.elemFrames) ?? true), elemZapatas: W.state((t == null ? void 0 : t.elemZapatas) ?? true), elemLosas: W.state((t == null ? void 0 : t.elemLosas) ?? true), colorByType: W.state((t == null ? void 0 : t.colorByType) ?? false), nodesIndexes: W.state((t == null ? void 0 : t.nodesIndexes) ?? false), elementsIndexes: W.state((t == null ? void 0 : t.elementsIndexes) ?? false), orientations: W.state((t == null ? void 0 : t.orientations) ?? false), sections: W.state((t == null ? void 0 : t.sections) ?? true), extruded: W.state((t == null ? void 0 : t.extruded) ?? false), sectionLabels: W.state((t == null ? void 0 : t.sectionLabels) ?? true), secColumns: W.state((t == null ? void 0 : t.secColumns) ?? true), secBeams: W.state((t == null ? void 0 : t.secBeams) ?? true), secFloor: W.state((t == null ? void 0 : t.secFloor) ?? -1), supports: W.state((t == null ? void 0 : t.supports) ?? true), loads: W.state((t == null ? void 0 : t.loads) ?? false), deformedShape: W.state((t == null ? void 0 : t.deformedShape) ?? false), nodeResults: W.state((t == null ? void 0 : t.nodeResults) ?? "none"), frameResults: W.state((t == null ? void 0 : t.frameResults) ?? "none"), shellResults: W.state((t == null ? void 0 : t.shellResults) ?? "none"), solidResults: W.state((t == null ? void 0 : t.solidResults) ?? "none"), flipAxes: W.state((t == null ? void 0 : t.flipAxes) ?? false), solids: W.state((t == null ? void 0 : t.solids) ?? true), custom3D: W.state((t == null ? void 0 : t.custom3D) ?? true), showCotas: W.state((t == null ? void 0 : t.showCotas) ?? true), deformScale: W.state((t == null ? void 0 : t.deformScale) ?? 1), deformScaleZ: W.state((t == null ? void 0 : t.deformScaleZ) ?? 1) };
}
function da(t, l, d) {
  const h = rn(), c = new Jn(new Me(), new On({ color: h.nodePoint }));
  return ws((w, p) => {
    c.material.color.setHex(p.nodePoint);
  }), c.frustumCulled = false, W.derive(() => {
    t.nodes.val && c.geometry.setAttribute("position", new bt(l.val.flat(), 3));
  }), W.derive(() => {
    if (d.val, l.val, !t.nodes.rawVal) return;
    const w = l.rawVal ?? [];
    let p = t.gridSize.val * 0.5;
    if (w.length >= 2) {
      const x = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
      for (const z of w) for (let b = 0; b < 3; b++) x[b] = Math.min(x[b], z[b]), k[b] = Math.max(k[b], z[b]);
      p = Math.max(k[0] - x[0], k[1] - x[1], k[2] - x[2], 0.1);
    }
    const g = 0.03 * p;
    c.material.size = g * d.rawVal;
  }), W.derive(() => {
    c.visible = t.nodes.val;
  }), c;
}
function Po(t, l) {
  const d = rn(), h = new tt();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let w = (l == null ? void 0 : l.majorStep) ?? 1, p = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (w <= 0 && (w = 1), p <= 0 && (p = 0.1); t / p > 500; ) p *= 2;
  for (; t / w > 100; ) w *= 2;
  const g = t / 2;
  w = Math.max(p, Math.round(w / p) * p);
  const k = new Gt(d.grid).multiplyScalar(1.3), z = new Gt(d.grid).multiplyScalar(0.8), b = (ae, E, ie, ee) => {
    const be = [], ge = ae === "xy" ? (V, Z) => [V, Z, 0] : ae === "xz" ? (V, Z) => [V, 0, Z] : (V, Z) => [0, V, Z], U = Math.floor(g / E);
    for (let V = -U; V <= U; V++) {
      const Z = V * E, Y = ge(Z, -g), $ = ge(Z, g);
      be.push(...Y, ...$);
    }
    for (let V = -U; V <= U; V++) {
      const Z = V * E, Y = ge(-g, Z), $ = ge(g, Z);
      be.push(...Y, ...$);
    }
    const B = new Me();
    B.setAttribute("position", new bt(be, 3));
    const K = new ut({ color: ie, transparent: true, opacity: ee, depthWrite: false }), T = new Ht(B, K);
    return T.name = `grid-${ae}-${E === p ? "minor" : "major"}`, T;
  }, H = (ae, E, ie) => {
    const ee = ae === "xy" ? (T, V) => [T, V, 0] : ae === "xz" ? (T, V) => [T, 0, V] : (T, V) => [0, T, V], be = [[-g, -g], [g, -g], [g, g], [-g, g]], ge = [];
    for (const [T, V] of be) ge.push(...ee(T, V));
    const U = new Me();
    U.setAttribute("position", new bt(ge, 3));
    const B = new ut({ color: E, transparent: true, opacity: ie, depthWrite: false }), K = new ys(U, B);
    return K.name = `grid-${ae}-border`, K.renderOrder = 1, K;
  }, le = (ae, E, ie) => {
    const ee = ae === "xy" ? (B, K) => [B, K, 0] : ae === "xz" ? (B, K) => [B, 0, K] : (B, K) => [0, B, K], be = E === "u" ? [...ee(-g, 0), ...ee(g, 0)] : [...ee(0, -g), ...ee(0, g)], ge = new Me();
    ge.setAttribute("position", new bt(be, 3));
    const U = new Ht(ge, new ut({ color: ie, transparent: true, opacity: 0.45, depthWrite: false }));
    return U.name = `grid-${ae}-eje-${E}`, U.renderOrder = 1, U;
  }, pe = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const ae of c) {
    h.add(b(ae, p, z, 0.12)), h.add(b(ae, w, k, 0.4));
    const [E, ie] = pe[ae];
    h.add(le(ae, "u", E)), h.add(le(ae, "v", ie)), h.add(H(ae, k, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: w, minorStep: p, gridSize: t, planes: [...c] }, h;
}
function pa(t, l, d, h) {
  const c = new tt(), w = new Gs(0.5, 0.5, 0.5), p = new Hs(0.45, 0.7, 4);
  p.rotateX(Math.PI / 2), p.translate(0, 0, -0.35);
  const g = new pt({ color: 10166822 }), x = new pt({ color: 2792847 }), k = new pt({ color: 3835647 }), z = () => {
    const le = d.rawVal ?? [];
    if (le.length < 2) return l.gridSize.val * 0.5;
    let pe = [1 / 0, 1 / 0, 1 / 0], ae = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of le) for (let ie = 0; ie < 3; ie++) E[ie] < pe[ie] && (pe[ie] = E[ie]), E[ie] > ae[ie] && (ae[ie] = E[ie]);
    return Math.max(ae[0] - pe[0], ae[1] - pe[1], ae[2] - pe[2], 0.1);
  }, b = () => 0.08 * z(), H = () => h.rawVal;
  return W.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const le = b();
    (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((pe, ae) => {
      const E = d.val[ae];
      if (!E) return;
      const ie = pe ?? [], ee = (ie[0] ? 1 : 0) + (ie[1] ? 1 : 0) + (ie[2] ? 1 : 0), be = (ie[3] ? 1 : 0) + (ie[4] ? 1 : 0) + (ie[5] ? 1 : 0);
      let ge;
      ee >= 3 && be >= 3 ? ge = new nt(w, g) : ee >= 3 && be === 0 ? ge = new nt(p, x) : ge = new nt(p, k), ge.position.set(E[0], E[1], E[2]);
      const U = le * H();
      ge.scale.set(U, U, U), c.add(ge);
    });
  }), W.derive(() => {
    if (h.val, !l.supports.rawVal) return;
    const pe = b() * H();
    c.children.forEach((ae) => ae.scale.set(pe, pe, pe));
  }), W.derive(() => {
    c.visible = l.supports.val;
  }), c;
}
function ua(t, l, d, h) {
  const c = new tt();
  c.name = "loadsGroup";
  function w(p) {
    if (p.length < 2) return 0.12 * l.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], x = [-1 / 0, -1 / 0, -1 / 0];
    for (const z of p) for (let b = 0; b < 3; b++) g[b] = Math.min(g[b], z[b]), x[b] = Math.max(x[b], z[b]);
    return 0.08 * Math.max(x[0] - g[0], x[1] - g[1], x[2] - g[2], 0.1);
  }
  return W.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((b) => b.dispose()), c.clear();
    const p = d.val, g = w(p), x = 240, k = [];
    (_c = (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((b, H) => {
      p[H] && b.slice(0, 3).some((le) => Math.abs(le) > 1e-15) && k.push(H);
    });
    let z = k;
    if (k.length > x) {
      const b = k.map((T) => p[T][0]), H = k.map((T) => p[T][1]), le = Math.min(...b), pe = Math.max(...b), ae = Math.min(...H), E = Math.max(...H), ie = k.map((T) => p[T][2]), ee = Math.max(1e-6, (Math.max(...ie) - Math.min(...ie)) / 40), be = (T) => Math.round(T / ee), ge = new Set(ie.map(be)), U = Math.max(4, Math.floor(x / Math.max(1, ge.size))), B = Math.max(2, Math.round(Math.sqrt(U))), K = /* @__PURE__ */ new Map();
      for (const T of k) {
        const V = pe - le < 1e-9 ? 0 : (p[T][0] - le) / (pe - le), Z = E - ae < 1e-9 ? 0 : (p[T][1] - ae) / (E - ae), Y = Math.min(B - 1, Math.floor(V * B)), $ = Math.min(B - 1, Math.floor(Z * B)), ne = `${Y},${$},${be(p[T][2])}`, me = Math.hypot(V * B - (Y + 0.5), Z * B - ($ + 0.5)), re = K.get(ne);
        (!re || me < re.d) && K.set(ne, { i: T, d: me });
      }
      z = [...K.values()].map((T) => T.i);
    }
    for (const b of z) {
      const H = t.nodeInputs.val.loads.get(b), le = p[b];
      if (!le) continue;
      const pe = new _(...H.slice(0, 3));
      if (pe.lengthSq() < 1e-30) continue;
      pe.normalize();
      const ae = new ln(pe, new _(...le), 1, 15637248, 0.3, 0.3), E = g * h.rawVal;
      ae.scale.set(E, E, E), c.add(ae);
    }
  }), W.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const g = w(d.rawVal) * h.rawVal;
    c.children.forEach((x) => x.scale.set(g, g, g));
  }), W.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function fa(t, l, d) {
  const h = new tt();
  return W.derive(() => {
    if (!t.nodesIndexes.val) return;
    h.children.forEach((w) => w.dispose()), h.clear();
    const c = 0.05 * t.gridSize.val * 0.6;
    l.val.forEach((w, p) => {
      const g = new kt(`${p}`);
      g.position.set(...w), g.updateScale(c * d.rawVal), h.add(g);
    });
  }), W.derive(() => {
    if (d.val, !t.nodesIndexes.rawVal) return;
    const c = 0.05 * t.gridSize.val * 0.6;
    h.children.forEach((w) => w.updateScale(c * d.rawVal));
  }), W.derive(() => {
    h.visible = t.nodesIndexes.val;
  }), h;
}
function ha(t, l, d, h) {
  const c = new tt();
  return W.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    c.children.forEach((p) => p.dispose()), c.clear();
    const w = 0.05 * l.gridSize.val * 0.6;
    (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((p, g) => {
      const x = new kt(`${g}`, void 0, "#001219");
      x.position.set(...ma(p.map((k) => d.rawVal[k]))), x.updateScale(w * h.rawVal), c.add(x);
    });
  }), W.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const w = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((p) => p.updateScale(w * h.rawVal));
  }), W.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function ma(t) {
  const l = t.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), d = t.length;
  return [l[0] / d, l[1] / d, l[2] / d];
}
function ds(t, l) {
  const d = new tt(), h = Math.min(0.05 * t, 0.6), c = rn(), w = new kt("X", "red", "transparent"), p = new kt(l ? "Z" : "Y", "green", "transparent"), g = new kt(l ? "Y" : "Z", "blue", "transparent"), x = new ln(new _(1, 0, 0), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), k = new ln(new _(0, 1, 0), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), z = new ln(new _(0, 0, 1), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return w.position.set(1.3 * h, 0, 0), p.position.set(0, 1.3 * h, 0), g.position.set(0, 0, 1.3 * h), w.updateScale(0.4 * h), p.updateScale(0.4 * h), g.updateScale(0.4 * h), x.scale.set(h, h, h), k.scale.set(h, h, h), z.scale.set(h, h, h), d.add(x, k, z, w, p, g), d;
}
function to(t, l) {
  const d = new _(...t), c = new _(...l).clone().sub(d), w = c.length(), p = c.dot(new _(1, 0, 0)) / w, g = c.dot(new _(0, 1, 0)) / w, x = c.dot(new _(0, 0, 1)) / w, k = Math.sqrt(p ** 2 + g ** 2);
  let z = new bo().fromArray([[p, g, x], [-g / k, p / k, 0], [-p * x / k, -g * x / k, k]].flat());
  return x === 1 && (z = new bo().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), x === -1 && (z = new bo().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Ao().setFromMatrix3(z);
}
function zo(t, l) {
  return t == null ? void 0 : t.map((d, h) => (9 * d + l[h]) / 10);
}
function En(t) {
  const l = t.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), d = t.length;
  return [l[0] / d, l[1] / d, l[2] / d];
}
function wa(t, l, d) {
  const h = En([l, d]), c = En([t, d]), w = En([t, l]), p = new _(...h).sub(new _(...c)).normalize(), g = new _(...d).sub(new _(...w)).normalize(), x = p.clone().cross(g).normalize(), k = x.clone().cross(p).normalize();
  return new Ao().makeBasis(p, k, x);
}
function ya(t, l, d, h) {
  const c = new tt(), w = new Me(), p = new ut({ vertexColors: true }), g = [0, 0, 0], x = [1, 0, 0], k = [0, 1, 0], z = [0, 0, 1];
  w.setAttribute("position", new bt([...g, ...x, ...g, ...k, ...g, ...z], 3));
  const b = [255, 0, 0], H = [0, 255, 0], le = [0, 0, 255];
  return w.setAttribute("color", new bt([...b, ...b, ...H, ...H, ...le, ...le], 3)), W.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((pe) => {
      const ae = new Ht(w, p), E = d.rawVal[pe[0]], ie = d.rawVal[pe[1]];
      if (pe.length === 2 && (ae.position.set(...zo(E, ie)), ae.rotation.setFromRotationMatrix(to(E, ie))), pe.length === 3) {
        const ge = d.rawVal[pe[2]];
        ae.position.set(...En([E, ie, ge])), ae.rotation.setFromRotationMatrix(wa(E, ie, ge));
      }
      const be = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      ae.scale.set(be, be, be), c.add(ae);
    }));
  }), W.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const ae = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((E) => E.scale.set(ae, ae, ae));
  }), W.derive(() => {
    c.visible = l.orientations.val;
  }), c;
}
function xa(t) {
  if (t.name) return t.name;
  if (t.type === "rect") {
    const l = (t.b * 100).toFixed(0), d = (t.h * 100).toFixed(0);
    return `${l}x${d}`;
  }
  return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
}
function ga(t, l, d, h) {
  const c = new tt(), w = new tt();
  c.add(w);
  function p(B, K) {
    const T = B / 2, V = K / 2, Z = new Float32Array([0, -T, -V, 0, T, -V, 0, T, V, 0, -T, -V, 0, T, V, 0, -T, V]), Y = new Me();
    Y.setAttribute("position", new ft(Z, 3));
    const $ = new Float32Array([0, -T, -V, 0, T, -V, 0, T, V, 0, -T, V, 0, -T, -V]), ne = new Me();
    return ne.setAttribute("position", new ft($, 3)), { fill: Y, outline: ne };
  }
  function g(B, K = 24) {
    const T = B / 2, V = new Float32Array(K * 9);
    for (let ne = 0; ne < K; ne++) {
      const me = ne / K * Math.PI * 2, re = (ne + 1) / K * Math.PI * 2;
      V[ne * 9] = 0, V[ne * 9 + 1] = 0, V[ne * 9 + 2] = 0, V[ne * 9 + 3] = 0, V[ne * 9 + 4] = T * Math.cos(me), V[ne * 9 + 5] = T * Math.sin(me), V[ne * 9 + 6] = 0, V[ne * 9 + 7] = T * Math.cos(re), V[ne * 9 + 8] = T * Math.sin(re);
    }
    const Z = new Me();
    Z.setAttribute("position", new ft(V, 3));
    const Y = new Float32Array((K + 1) * 3);
    for (let ne = 0; ne <= K; ne++) {
      const me = ne / K * Math.PI * 2;
      Y[ne * 3] = 0, Y[ne * 3 + 1] = T * Math.cos(me), Y[ne * 3 + 2] = T * Math.sin(me);
    }
    const $ = new Me();
    return $.setAttribute("position", new ft(Y, 3)), { fill: Z, outline: $ };
  }
  function x(B, K, T, V) {
    const Z = T ?? K * 0.08, Y = V ?? B * 0.07, $ = B / 2, ne = K / 2, me = ne - Z, re = Y / 2, se = [];
    function R(ye, Ie, _e, Xe) {
      se.push(0, ye, Ie, 0, _e, Ie, 0, _e, Xe, 0, ye, Ie, 0, _e, Xe, 0, ye, Xe);
    }
    R(-$, -ne, $, -me), R(-re, -me, re, me), R(-$, me, $, ne);
    const ue = new Me();
    ue.setAttribute("position", new ft(new Float32Array(se), 3));
    const O = new Float32Array([0, -$, -ne, 0, $, -ne, 0, $, -me, 0, re, -me, 0, re, me, 0, $, me, 0, $, ne, 0, -$, ne, 0, -$, me, 0, -re, me, 0, -re, -me, 0, -$, -me, 0, -$, -ne]), we = new Me();
    return we.setAttribute("position", new ft(O, 3)), { fill: ue, outline: we };
  }
  function k(B, K, T) {
    const V = B / 2, Z = K / 2, Y = V - T, $ = Z - T, ne = [];
    function me(ue, O, we, ye) {
      ne.push(0, ue, O, 0, we, O, 0, we, ye, 0, ue, O, 0, we, ye, 0, ue, ye);
    }
    me(-V, -Z, V, -$), me(-V, $, V, Z), me(-V, -$, -Y, $), me(Y, -$, V, $);
    const re = new Me();
    re.setAttribute("position", new ft(new Float32Array(ne), 3));
    const se = new Float32Array([0, -V, -Z, 0, V, -Z, 0, V, -Z, 0, V, Z, 0, V, Z, 0, -V, Z, 0, -V, Z, 0, -V, -Z, 0, -Y, -$, 0, Y, -$, 0, Y, -$, 0, Y, $, 0, Y, $, 0, -Y, $, 0, -Y, $, 0, -Y, -$]), R = new Me();
    return R.setAttribute("position", new ft(se, 3)), { fill: re, outline: R };
  }
  function z(B, K, T) {
    const V = B / 2, Z = K / 2, Y = V - T, $ = Z - T, ne = new Me(), me = new Float32Array([0, -Y, -$, 0, Y, -$, 0, Y, $, 0, -Y, -$, 0, Y, $, 0, -Y, $]);
    ne.setAttribute("position", new ft(me, 3));
    const re = [];
    function se(we, ye, Ie, _e) {
      re.push(0, we, ye, 0, Ie, ye, 0, Ie, _e, 0, we, ye, 0, Ie, _e, 0, we, _e);
    }
    se(-V, -Z, V, -$), se(-V, $, V, Z), se(-V, -$, -Y, $), se(Y, -$, V, $);
    const R = new Me();
    R.setAttribute("position", new ft(new Float32Array(re), 3));
    const ue = new Float32Array([0, -V, -Z, 0, V, -Z, 0, V, -Z, 0, V, Z, 0, V, Z, 0, -V, Z, 0, -V, Z, 0, -V, -Z, 0, -Y, -$, 0, Y, -$, 0, Y, -$, 0, Y, $, 0, Y, $, 0, -Y, $, 0, -Y, $, 0, -Y, -$]), O = new Me();
    return O.setAttribute("position", new ft(ue, 3)), { concFill: ne, steelFillGeom: R, outline: O };
  }
  function b(B, K, T) {
    const V = [], Z = [[0, -B / 2, -K / 2], [0, -B / 2 + T, -K / 2], [0, -B / 2 + T, K / 2 - T], [0, B / 2, K / 2 - T], [0, B / 2, K / 2], [0, -B / 2, K / 2]], Y = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const re of Y) V.push(...Z[re]);
    const $ = new Me();
    $.setAttribute("position", new ft(new Float32Array(V), 3));
    const ne = [];
    for (let re = 0; re < Z.length; re++) {
      const se = (re + 1) % Z.length;
      ne.push(...Z[re], ...Z[se]);
    }
    const me = new Me();
    return me.setAttribute("position", new ft(new Float32Array(ne), 3)), { fill: $, outline: me };
  }
  function H(B, K, T, V) {
    const Z = V / 2, Y = [], $ = [[0, -B - Z, -K / 2], [0, -T - Z, -K / 2], [0, -T - Z, K / 2 - T], [0, -Z, K / 2 - T], [0, -Z, K / 2], [0, -B - Z, K / 2]], ne = [[0, Z, -K / 2], [0, Z + T, -K / 2], [0, Z + T, K / 2 - T], [0, B + Z, K / 2 - T], [0, B + Z, K / 2], [0, Z, K / 2]], me = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ue of me) Y.push(...$[ue]);
    for (const ue of me) Y.push(...ne[ue]);
    const re = new Me();
    re.setAttribute("position", new ft(new Float32Array(Y), 3));
    const se = [];
    for (const ue of [$, ne]) for (let O = 0; O < ue.length; O++) {
      const we = (O + 1) % ue.length;
      se.push(...ue[O], ...ue[we]);
    }
    const R = new Me();
    return R.setAttribute("position", new ft(new Float32Array(se), 3)), { fill: re, outline: R };
  }
  function le(B, K, T, V) {
    const Z = K / 2, Y = B, $ = [[0, -Y, -Z], [0, -Y, -Z + T], [0, -V, -Z + T], [0, -V, Z - T], [0, -Y, Z - T], [0, -Y, Z], [0, 0, Z], [0, 0, -Z]], ne = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], me = [];
    for (const ue of ne) me.push(...$[ue]);
    const re = new Me();
    re.setAttribute("position", new ft(new Float32Array(me), 3));
    const se = [];
    for (let ue = 0; ue < $.length; ue++) {
      const O = (ue + 1) % $.length;
      se.push(...$[ue], ...$[O]);
    }
    const R = new Me();
    return R.setAttribute("position", new ft(new Float32Array(se), 3)), { fill: re, outline: R };
  }
  function pe(B, K, T, V, Z) {
    const Y = K / 2, $ = Z / 2, ne = [], me = [[0, -B, -Y], [0, -B, -Y + T], [0, -$ - V, -Y + T], [0, -$ - V, Y - T], [0, -B, Y - T], [0, -B, Y], [0, -$, Y], [0, -$, -Y]], re = me.map((we) => [we[0], -we[1], we[2]]), se = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const we of se) ne.push(...me[we]);
    for (const we of se) ne.push(...re[we]);
    const R = new Me();
    R.setAttribute("position", new ft(new Float32Array(ne), 3));
    const ue = [];
    for (const we of [me, re]) for (let ye = 0; ye < we.length; ye++) {
      const Ie = (ye + 1) % we.length;
      ue.push(...we[ye], ...we[Ie]);
    }
    const O = new Me();
    return O.setAttribute("position", new ft(new Float32Array(ue), 3)), { fill: R, outline: O };
  }
  function ae(B, K, T, V) {
    const Z = B / 2, Y = K / 2, $ = V / 2, ne = [[0, -$, -Y], [0, $, -Y], [0, $, Y - T], [0, Z, Y - T], [0, Z, Y], [0, -Z, Y], [0, -Z, Y - T], [0, -$, Y - T]], me = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], re = [];
    for (const O of me) re.push(...ne[O]);
    const se = new Me();
    se.setAttribute("position", new ft(new Float32Array(re), 3));
    const R = [];
    for (let O = 0; O < ne.length; O++) {
      const we = (O + 1) % ne.length;
      R.push(...ne[O], ...ne[we]);
    }
    const ue = new Me();
    return ue.setAttribute("position", new ft(new Float32Array(R), 3)), { fill: se, outline: ue };
  }
  function E(B, K, T = 24) {
    const V = B / 2, Z = V - K, Y = [];
    for (let re = 0; re < T; re++) {
      const se = re / T * Math.PI * 2, R = (re + 1) / T * Math.PI * 2, ue = Math.cos(se), O = Math.sin(se), we = Math.cos(R), ye = Math.sin(R);
      Y.push(0, V * ue, V * O, 0, V * we, V * ye, 0, Z * we, Z * ye), Y.push(0, V * ue, V * O, 0, Z * we, Z * ye, 0, Z * ue, Z * O);
    }
    const $ = new Me();
    $.setAttribute("position", new ft(new Float32Array(Y), 3));
    const ne = [];
    for (let re = 0; re < T; re++) {
      const se = re / T * Math.PI * 2, R = (re + 1) / T * Math.PI * 2;
      ne.push(0, V * Math.cos(se), V * Math.sin(se), 0, V * Math.cos(R), V * Math.sin(R)), ne.push(0, Z * Math.cos(se), Z * Math.sin(se), 0, Z * Math.cos(R), Z * Math.sin(R));
    }
    const me = new Me();
    return me.setAttribute("position", new ft(new Float32Array(ne), 3)), { fill: $, outline: me };
  }
  const ie = new pt({ color: 52479, transparent: true, opacity: 0.35, side: Pt, depthWrite: false }), ee = new ut({ color: 52479 }), be = new pt({ color: 16750848, transparent: true, opacity: 0.4, side: Pt, depthWrite: false }), ge = new ut({ color: 16750848 });
  function U(B, K) {
    const T = Math.abs(K[0] - B[0]), V = Math.abs(K[1] - B[1]), Z = Math.abs(K[2] - B[2]);
    return Z > T && Z > V || V > T && V > Z;
  }
  return W.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const B = l.secColumns.rawVal, K = l.secBeams.rawVal;
    if (!B && !K) {
      c.children.forEach(($) => {
        $ instanceof kt && $.dispose();
      }), c.clear();
      return;
    }
    c.children.forEach(($) => {
      $ instanceof kt && $.dispose();
    }), c.clear();
    const T = (_a2 = t.elements) == null ? void 0 : _a2.val, V = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!T || !V) return;
    const Z = V.sectionShapes, Y = l.secFloor.rawVal;
    T.forEach(($, ne) => {
      if ($.length !== 2) return;
      const me = d.rawVal[$[0]], re = d.rawVal[$[1]];
      if (!me || !re) return;
      const se = U(me, re);
      if (se && !B || !se && !K) return;
      if (Y >= 0) {
        const ye = Math.min(me[1], re[1]);
        Math.max(me[1], re[1]);
        const Ie = l.gridSize.rawVal || 3;
        if (Math.floor(ye / Ie + 0.01) !== Y) return;
      }
      const R = Z == null ? void 0 : Z.get(ne);
      if (!R) return;
      const ue = [(me[0] + re[0]) / 2, (me[1] + re[1]) / 2, (me[2] + re[2]) / 2], O = to(me, re);
      if (R.type === "CFT") {
        const ye = z(R.b, R.h, R.tw ?? R.b * 0.05), Ie = new nt(ye.concFill, ie);
        Ie.position.set(...ue), Ie.rotation.setFromRotationMatrix(O), c.add(Ie);
        const _e = new nt(ye.steelFillGeom, be);
        _e.position.set(...ue), _e.rotation.setFromRotationMatrix(O), c.add(_e);
        const Xe = new St(ye.outline, ge);
        Xe.position.set(...ue), Xe.rotation.setFromRotationMatrix(O), c.add(Xe);
      } else {
        let ye, Ie, _e;
        switch (R.type) {
          case "rect":
            ye = p(R.b, R.h), Ie = ie, _e = ee;
            break;
          case "circ":
            ye = g(R.d), Ie = ie, _e = ee;
            break;
          case "I":
            ye = x(R.b, R.h, R.tf, R.tw), Ie = be, _e = ge;
            break;
          case "HSS":
            ye = k(R.b, R.h, R.tw ?? R.b * 0.05), Ie = be, _e = ge;
            break;
          case "CFT":
            ye = z(R.b, R.h, R.tw ?? R.b * 0.05), Ie = be, _e = ge;
            break;
          case "L":
            ye = b(R.b ?? R.h, R.h, R.t ?? R.tw ?? 3e-3), Ie = be, _e = ge;
            break;
          case "2L":
            ye = H(R.b ?? R.h, R.h, R.t ?? R.tw ?? 3e-3, R.dis ?? 0.01), Ie = be, _e = ge;
            break;
          case "C":
          case "coldC":
            ye = le(R.b, R.h, R.tf ?? R.t ?? 3e-3, R.tw ?? R.t ?? 3e-3), Ie = be, _e = ge;
            break;
          case "2C":
            ye = pe(R.b, R.h, R.tf ?? 5e-3, R.tw ?? 5e-3, R.dis ?? 0.01), Ie = be, _e = ge;
            break;
          case "T":
            ye = ae(R.b, R.h, R.tf ?? 0.01, R.tw ?? 6e-3), Ie = be, _e = ge;
            break;
          case "pipe":
            ye = E(R.d, R.tw ?? R.d * 0.05), Ie = be, _e = ge;
            break;
          default:
            return;
        }
        const Xe = new nt(ye.fill, Ie);
        Xe.position.set(...ue), Xe.rotation.setFromRotationMatrix(O), c.add(Xe);
        const Qe = new St(ye.outline, _e);
        Qe.position.set(...ue), Qe.rotation.setFromRotationMatrix(O), c.add(Qe);
      }
      const we = xa(R);
      if (we) {
        const Ie = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(R.type) ? "#ff9900" : "#00ccff", _e = new kt(we, Ie, "transparent");
        _e.position.set(ue[0], ue[1], ue[2]);
        const Xe = 0.05 * l.gridSize.rawVal * 0.5;
        _e.updateScale(Xe * ((h == null ? void 0 : h.rawVal) ?? 1)), w.add(_e);
      }
    });
  }), h && W.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const B = 0.05 * l.gridSize.val * 0.5;
    w.children.forEach((K) => {
      K instanceof kt && K.updateScale(B * h.rawVal);
    });
  }), W.derive(() => {
    c.visible = l.sections.val;
  }), W.derive(() => {
    w.visible = l.sectionLabels.val;
  }), c;
}
function va(t) {
  if (!t) return null;
  const l = t.type, d = (z, b) => [z, b], h = (z, b) => [d(-z / 2, -b / 2), d(z / 2, -b / 2), d(z / 2, b / 2), d(-z / 2, b / 2)], c = (z, b = 24) => {
    const H = z / 2, le = [];
    for (let pe = 0; pe < b; pe++) {
      const ae = 2 * Math.PI * pe / b;
      le.push(d(H * Math.cos(ae), H * Math.sin(ae)));
    }
    return le;
  }, w = t.b ?? 0, p = t.h ?? 0, g = t.d ?? 0, x = t.tw ?? t.t ?? 0, k = t.tf ?? t.t ?? 0;
  switch (l) {
    case "rect":
      return w && p ? { contorno: h(w, p) } : null;
    case "circ":
      return g ? { contorno: c(g) } : null;
    case "pipe":
      return g && x ? { contorno: c(g), huecos: [c(g - 2 * x).reverse()] } : null;
    case "HSS":
      return w && p && x ? { contorno: h(w, p), huecos: [h(w - 2 * x, p - 2 * (k || x)).reverse()] } : null;
    case "CFT":
      return w && p ? { contorno: h(w, p) } : null;
    case "I":
      return w && p && x && k ? { contorno: [d(-w / 2, -p / 2), d(w / 2, -p / 2), d(w / 2, -p / 2 + k), d(x / 2, -p / 2 + k), d(x / 2, p / 2 - k), d(w / 2, p / 2 - k), d(w / 2, p / 2), d(-w / 2, p / 2), d(-w / 2, p / 2 - k), d(-x / 2, p / 2 - k), d(-x / 2, -p / 2 + k), d(-w / 2, -p / 2 + k)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return w && p && x && k ? { contorno: [d(-w / 2, -p / 2), d(w / 2, -p / 2), d(w / 2, -p / 2 + k), d(-w / 2 + x, -p / 2 + k), d(-w / 2 + x, p / 2 - k), d(w / 2, p / 2 - k), d(w / 2, p / 2), d(-w / 2, p / 2)] } : null;
    case "T":
      return w && p && x && k ? { contorno: [d(-x / 2, -p / 2), d(x / 2, -p / 2), d(x / 2, p / 2 - k), d(w / 2, p / 2 - k), d(w / 2, p / 2), d(-w / 2, p / 2), d(-w / 2, p / 2 - k), d(-x / 2, p / 2 - k)] } : null;
    case "L":
    case "2L":
      return w && p && x ? { contorno: [d(-w / 2, -p / 2), d(w / 2, -p / 2), d(w / 2, -p / 2 + x), d(-w / 2 + x, -p / 2 + x), d(-w / 2 + x, p / 2), d(-w / 2, p / 2)] } : null;
    default:
      return w && p ? { contorno: h(w, p) } : g ? { contorno: c(g) } : null;
  }
}
function Ma(t, l, d) {
  if (!t || t <= 0 || !l || !d || l <= 0 || d <= 0) return null;
  const h = Math.sqrt(Math.sqrt(d / l)), c = Math.sqrt(t / h), w = t / c;
  return !isFinite(c) || !isFinite(w) || c <= 0 || w <= 0 ? null : { contorno: [[-c / 2, -w / 2], [c / 2, -w / 2], [c / 2, w / 2], [-c / 2, w / 2]] };
}
function ba(t) {
  const l = new An();
  t.contorno.forEach(([d, h], c) => c ? l.lineTo(d, h) : l.moveTo(d, h)), l.closePath();
  for (const d of t.huecos ?? []) {
    const h = new Js();
    d.forEach(([c, w], p) => p ? h.lineTo(c, w) : h.moveTo(c, w)), h.closePath(), l.holes.push(h);
  }
  return l;
}
function _a(t, l, d) {
  const h = new tt();
  h.name = "extrusion";
  const c = new _o({ color: 8369151, transparent: true, opacity: 0.92, side: Pt }), w = new _o({ color: 12623968, transparent: true, opacity: 0.85, side: Pt }), p = new _o({ color: 11583173, transparent: true, opacity: 0.85, side: Pt }), g = new tt();
  g.add(new xs(16777215, 0.55));
  const x = new jn(16777215, 0.75);
  x.position.set(30, 25, 40);
  const k = new jn(16777215, 0.35);
  k.position.set(-25, -20, 15), g.add(x, k);
  let z = 0;
  return W.derive(() => {
    var _a2, _b, _c, _d, _e;
    const b = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++z, on: b }, h.visible = b;
    for (const ee of [...h.children]) ee !== g && (h.remove(ee), (_c = (_b = ee.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(g) || h.add(g), !b) return;
    const H = d.val ?? [], le = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], pe = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, ae = pe.sectionShapes ?? /* @__PURE__ */ new Map(), E = pe.thicknesses ?? /* @__PURE__ */ new Map();
    let ie = "";
    try {
      le.forEach((ee, be) => {
        var _a3, _b2, _c2;
        if (ee.length === 2) {
          let ge = va(ae.get(be)), U = true;
          if (ge || (ge = Ma((_a3 = pe.areas) == null ? void 0 : _a3.get(be), (_b2 = pe.momentsOfInertiaY) == null ? void 0 : _b2.get(be), (_c2 = pe.momentsOfInertiaZ) == null ? void 0 : _c2.get(be)), U = false), !ge) return;
          const B = H[ee[0]], K = H[ee[1]];
          if (!B || !K) return;
          const T = Math.hypot(K[0] - B[0], K[1] - B[1], K[2] - B[2]);
          if (T < 1e-9) return;
          const V = new Ws(ba(ge), { depth: T, bevelEnabled: false, curveSegments: 4 });
          V.applyMatrix4(new Ao().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const Z = new nt(V, U ? c : w);
          Z.position.set(B[0], B[1], B[2]), Z.rotation.setFromRotationMatrix(to(B, K)), h.add(Z);
          return;
        }
        if (ee.length === 3 || ee.length === 4) {
          const ge = E.get(be);
          if (!ge || ge <= 0) return;
          const U = ee.map((O) => H[O]).filter(Boolean);
          if (U.length < 3) return;
          const B = [U[1][0] - U[0][0], U[1][1] - U[0][1], U[1][2] - U[0][2]], K = [U[2][0] - U[0][0], U[2][1] - U[0][1], U[2][2] - U[0][2]], T = B[1] * K[2] - B[2] * K[1], V = B[2] * K[0] - B[0] * K[2], Z = B[0] * K[1] - B[1] * K[0], Y = Math.hypot(T, V, Z);
          if (Y < 1e-12) return;
          const $ = [T / Y, V / Y, Z / Y], ne = [], me = (O) => U.map((we) => [we[0] + $[0] * O, we[1] + $[1] * O, we[2] + $[2] * O]), re = me(+ge / 2), se = me(-ge / 2), R = (O, we, ye) => ne.push(...O, ...we, ...ye);
          for (const O of [re, se]) R(O[0], O[1], O[2]), O.length === 4 && R(O[0], O[2], O[3]);
          for (let O = 0; O < U.length; O++) {
            const we = (O + 1) % U.length;
            R(re[O], se[O], se[we]), R(re[O], se[we], re[we]);
          }
          const ue = new Me();
          ue.setAttribute("position", new bt(ne, 3)), ue.computeVertexNormals(), h.add(new nt(ue, p));
        }
      });
    } catch (ee) {
      ie = String((ee == null ? void 0 : ee.message) ?? ee);
    }
    globalThis.__extrusionDebug = { corridas: z, on: b, fallo: ie, nElementos: le.length, nFormas: ae.size, nEspesores: E.size, mallas: h.children.length - 1 };
  }), h;
}
class Hn extends tt {
  constructor(l, d, h, c, w, p, g) {
    super();
    const x = new An().moveTo(0, 0).lineTo(0, p[1]).lineTo(h, p[1]).lineTo(h, 0).lineTo(0, 0), k = x.getPoints(), z = new Me().setFromPoints(k);
    this.lines = new St(z, new ut({ color: rn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const b = new Qn(x), H = new pt({ color: p[1] > 0 ? 24435 : 11411474, side: Pt });
    this.mesh = new nt(b, H), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new kt(`${w[1].toFixed(4)}`), this.normalizedResult = p, this.textPosition = En([l, d]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class ps extends tt {
  constructor(l, d, h, c, w, p, g) {
    super();
    const x = w[0] * h / (w[0] + w[1]), k = w[0] * w[1] > 0;
    if (this.text = new kt(`${w[0].toFixed(4)}`), this.text2 = new kt(`${(w[1] * -1).toFixed(4)}`), this.normalizedResult = p, this.textPosition = zo(l, d), this.text2Position = zo(d, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), k) {
      const z = new An().moveTo(0, 0).lineTo(0, p[0]).lineTo(x, 0).lineTo(0, 0), b = new An().moveTo(x, 0).lineTo(h, -p[1]).lineTo(h, 0).lineTo(x, 0), H = z.getPoints(), le = b.getPoints(), pe = new Me().setFromPoints(H), ae = new Me().setFromPoints(le), E = new ut({ color: rn().resultOutline });
      this.lines = new St(pe, E), this.lines2 = new St(ae, E), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), g && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ie = new Qn(z), ee = new Qn(b), be = new pt({ color: p[0] > 0 ? 24435 : 11411474, side: Pt }), ge = new pt({ color: -p[1] > 0 ? 24435 : 11411474, side: Pt });
      this.mesh = new nt(ie, be), this.mesh2 = new nt(ee, ge), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), g && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const z = new An().moveTo(0, 0).lineTo(0, p[0]).lineTo(h, -p[1]).lineTo(h, 0).lineTo(0, 0), b = z.getPoints(), H = new Me().setFromPoints(b);
      this.lines = new St(H, new ut({ color: rn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const le = new Qn(z), pe = new pt({ color: p[0] > 0 ? 24435 : 11411474, side: Pt });
      this.mesh = new nt(le, pe), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var Ss = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(Ss || {});
function Sa(t, l, d, h) {
  const c = () => {
    const g = d.rawVal;
    if (!(g == null ? void 0 : g.length)) return 0.05 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
    for (const b of g) for (let H = 0; H < 3; H++) b[H] < x[H] && (x[H] = b[H]), b[H] > k[H] && (k[H] = b[H]);
    const z = Math.hypot(k[0] - x[0], k[1] - x[1], k[2] - x[2]);
    return !isFinite(z) || z <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * z;
  }, w = new tt(), p = { normals: Hn, shearsY: Hn, shearsZ: Hn, torsions: Hn, bendingsY: ps, bendingsZ: ps };
  return W.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, d.val, l.frameResults.val == "none") return;
    w.children.forEach((x) => x.dispose()), w.clear();
    const g = Ss[l.frameResults.rawVal];
    (_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal[g]) == null ? void 0 : _b.forEach((x, k) => {
      var _a3, _b2;
      const z = ((_a3 = t.elements) == null ? void 0 : _a3.rawVal[k]) ?? [0, 1], b = d.rawVal[z[0]], H = d.rawVal[z[1]];
      if (!b || !H) return;
      const le = new _(...H).distanceTo(new _(...b)), pe = ka((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[g]), ae = x == null ? void 0 : x.map((ee) => ee / (pe === 0 ? 1 : pe)), E = to(b, H), ie = new p[g](b, H, le, E, x ?? [0, 0], ae ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(g));
      ie.updateScale(c() * h.rawVal), w.add(ie);
    });
  }), W.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const g = c();
    w.children.forEach((x) => x.updateScale(g * h.rawVal));
  }), W.derive(() => {
    w.visible = l.frameResults.val != "none";
  }), w;
}
function ka(t) {
  let l = 0;
  return t == null ? void 0 : t.forEach((d) => {
    const h = Math.max(...(d ?? [0, 0]).map((c) => Math.abs(c)));
    h > l && (l = h);
  }), l;
}
class Pa extends tt {
  constructor(l, d, h) {
    super();
    const c = d === Vo.reactions;
    h[0] && (this.xText1 = new kt(`${c ? "Fx" : "Dx"}: ` + h[0].toFixed(4))), h[3] && (this.xText2 = new kt(`${c ? "Mx" : "Rx"}: ` + h[3].toFixed(4))), h[1] && (this.yText1 = new kt(`${c ? "Fy" : "Dy"}: ` + h[1].toFixed(4))), h[4] && (this.yText2 = new kt(`${c ? "My" : "Ry"}: ` + h[4].toFixed(4))), h[2] && (this.zText1 = new kt(`${c ? "Fz" : "Dz"}: ` + h[2].toFixed(4))), h[5] && (this.zText2 = new kt(`${c ? "Mz" : "Rz"}: ` + h[5].toFixed(4))), (h[0] || h[3]) && (this.xArrow = new ln(new _(1, 0, 0), new _(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[1] || h[4]) && (this.yArrow = new ln(new _(0, 1, 0), new _(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[2] || h[5]) && (this.zArrow = new ln(new _(0, 0, 1), new _(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(l) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(l, l, l), (_b = this.yArrow) == null ? void 0 : _b.scale.set(l, l, l), (_c = this.zArrow) == null ? void 0 : _c.scale.set(l, l, l), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * l, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * l, 0, 0.5 * l), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * l, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * l, 0.5 * l), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * l), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * l + 0.5 * l), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * l), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * l), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * l), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * l), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * l), (_o2 = this.zText2) == null ? void 0 : _o2.updateScale(0.4 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var Vo = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(Vo || {});
function Ca(t, l, d, h) {
  const c = new tt();
  return W.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    c.children.forEach((g) => g.dispose()), c.clear();
    const w = Vo[l.nodeResults.rawVal], p = 0.05 * l.gridSize.val;
    (_b = (_a2 = t.deformOutputs) == null ? void 0 : _a2.val[w]) == null ? void 0 : _b.forEach((g, x) => {
      const k = new Pa(d.rawVal[x], w, g ?? [0, 0, 0, 0, 0, 0]);
      k.updateScale(p * h.rawVal), c.add(k);
    });
  }), W.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const w = 0.05 * l.gridSize.val;
    c.children.forEach((p) => p.updateScale(w * h.rawVal));
  }), W.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function za({ drawingObj: t, gridObj: l, scene: d, getActiveCamera: h, controls: c, gridSize: w, derivedDisplayScale: p, rendererElm: g, viewerRender: x }) {
  const k = new Os(), z = new Qs(), b = (e) => {
    const o = g.getBoundingClientRect(), s = e.clientX - o.left, n = e.clientY - o.top, a = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const f = a / 2;
      if (s >= f) return z.x = (s - f) / f * 2 - 1, z.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      z.x = s / f * 2 - 1;
    } else z.x = s / a * 2 - 1;
    return z.y = -(n / i) * 2 + 1, h();
  }, H = new nt(new jt(1e4, 1e4), new pt({ side: Pt, transparent: true, opacity: 0, depthWrite: false }));
  H.visible = true, H.frustumCulled = false, d.add(H);
  const le = (e, o, s) => {
    const n = new nt(new jt(1e4, 1e4), new pt({ side: Pt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(e, o, s), n.visible = false, n.frustumCulled = false, d.add(n), n;
  }, pe = le(Math.PI / 2, 0, 0), ae = le(0, Math.PI / 2, 0);
  let E = false;
  const ie = () => {
    if (E) return k.intersectObjects([H], false);
    if (pe.visible = !!window.__hekatanGridPlaneXZ, ae.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ye.visible) {
      const s = k.intersectObjects([Ye, rt, Le], false);
      if (s.length > 0) return s;
    }
    const o = [H];
    return pe.visible && o.push(pe), ae.visible && o.push(ae), Jt.visible && pn.length > 0 && o.push(...pn), k.intersectObjects(o, false);
  }, ee = new Jn(new Me(), new On()), be = new Jn(new Me(), new On({ color: "gray", sizeAttenuation: false, size: 6 })), ge = new Jn(new Me(), new On({ color: "orange", sizeAttenuation: false, size: 5 }));
  d.add(ge);
  const U = document.createElement("input");
  U.id = "hk-rubber-label", U.type = "text", U.spellcheck = false, U.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, U.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(U);
  let B = null, K = null, T = false;
  const V = new _(), Z = (e, o, s, n, a, i) => {
    const r = n - e, f = a - o, m = i - s, y = Math.hypot(r, f, m);
    if (y < 0.01) {
      U.style.display = "none";
      return;
    }
    B = [e, o, s], K = [r / y, f / y, m / y], V.set((e + n) / 2, (o + a) / 2, (s + i) / 2), V.project(h());
    const M = g.getBoundingClientRect(), S = M.left + (V.x * 0.5 + 0.5) * M.width, u = M.top + (-V.y * 0.5 + 0.5) * M.height;
    if (U.style.left = S + "px", U.style.top = u + "px", U.style.display = "block", !T) {
      if (U.value = `${y.toFixed(2)} m`, document.activeElement !== U) {
        const F = document.activeElement;
        F && (F.tagName === "INPUT" || F.tagName === "TEXTAREA") && F !== U || U.focus({ preventScroll: true });
      }
      try {
        U.select();
      } catch {
      }
    }
  }, Y = () => {
    U.style.display = "none", B = null, K = null, T = false, document.activeElement === U && U.blur();
  }, $ = (e) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      an = e, oe(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), U.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && $e.length === 1) {
      const M = $e[0];
      $e = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, M[0], M[1], M[2], e), oe(`\u2713 C\xEDrculo r=${e} m en (${M[0].toFixed(2)}, ${M[1].toFixed(2)}, ${M[2].toFixed(2)}).`);
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
      xt = e, oe(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), U.blur();
      return;
    }
    if (!B || !K || !t.polylines) return;
    let s = K[0], n = K[1], a = K[2];
    at === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : at === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : at === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const i = B[0] + s * e, r = B[1] + n * e, f = B[2] + a * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [i, r, f]];
    const m = t.polylines.rawVal, y = m.length ? m[m.length - 1] : [];
    t.polylines.val = [...m.slice(0, -1), [...y, t.points.rawVal.length - 1]], U.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    x();
  }, ne = (e) => {
    let o = e.trim().toLowerCase().replace(/m$/g, "").trim();
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
        const [i, r, f] = a;
        return { kind: "relSpherical", L: i, az: r, el: f };
      }
      return null;
    }
    if (o.includes(",")) {
      const a = o.split(",").map((m) => parseFloat(m.trim()));
      if (a.some(isNaN)) return null;
      const [i, r, f = 0] = a;
      return s ? { kind: "relCart", dx: i, dy: r, dz: f } : { kind: "absCart", x: i, y: r, z: f };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, me = (e) => {
    if (!e) return null;
    if (e.kind === "absCart") return [e.x, e.y, e.z];
    if (e.kind === "relCart") return B ? [B[0] + e.dx, B[1] + e.dy, B[2] + e.dz] : null;
    if (e.kind === "absPolar") {
      const o = e.ang * Math.PI / 180;
      return [e.L * Math.cos(o), e.L * Math.sin(o), 0];
    }
    if (e.kind === "relPolar") {
      if (!B) return null;
      const o = e.ang * Math.PI / 180;
      return [B[0] + e.L * Math.cos(o), B[1] + e.L * Math.sin(o), B[2]];
    }
    if (e.kind === "relSpherical") {
      if (!B) return null;
      const o = e.az * Math.PI / 180, s = e.el * Math.PI / 180, n = e.L * Math.cos(s);
      return [B[0] + n * Math.cos(o), B[1] + n * Math.sin(o), B[2] + e.L * Math.sin(s)];
    }
    return null;
  }, re = (e) => {
    var _a2, _b;
    if (!t.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, e];
    const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    t.polylines.val = [...o.slice(0, -1), [...s, t.points.rawVal.length - 1]], B = e, U.blur();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (e) => {
    var _a2;
    const o = ne(e);
    if (!o) return false;
    if (o.kind === "length") return $(o.L), true;
    const s = me(o);
    if (!s) return false;
    Jo(new _(s[0], s[1], s[2]), null), B = s, U.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, U.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const s = ne(U.value);
      if (!s) return;
      if (T = false, s.kind === "length") $(s.L), oe(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = me(s);
        if (!n) return;
        re(n);
        const a = s.kind;
        oe(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), T = false, U.blur();
      return;
    }
    const o = e.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      e.preventDefault(), setTimeout(() => {
        if (!T && U.style.display === "block") try {
          U.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (T = true);
  }), window.addEventListener("keydown", (e) => {
    if (!B || !K || document.activeElement === U) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (U.value = e.key, U.focus(), U.setSelectionRange(1, 1), e.preventDefault());
  });
  const se = document.createElement("div");
  se.id = "hk-coord-readout", se.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", se.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(se);
  const R = document.createElement("div");
  R.id = "hk-coord-fixed", R.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", R.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(R);
  const ue = new St(new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0)]), new zn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  ue.frustumCulled = false, ue.visible = false, ue.name = "rubberBand", d.add(ue), window.__hekatanRubberBand = ue;
  const O = new St(new Me(), new ut({ color: 2282478, transparent: true, opacity: 0.9 }));
  O.frustumCulled = false, O.visible = false, d.add(O);
  let we = [];
  const ye = new tt(), Ie = new nt(new jt(1, 1), new pt({ color: 2282478, transparent: true, opacity: 0.08, side: Pt, depthWrite: false })), _e = new Ht(new os(new jt(1, 1)), new ut({ color: 2282478, transparent: true, opacity: 0.85 })), Xe = new Ht(new Me(), new ut({ color: 2282478, transparent: true, opacity: 0.3 })), Qe = (e, o) => {
    const s = [], n = Math.ceil(e / o);
    for (let a = -n; a <= n; a++) {
      const i = a * o;
      s.push(-e, i, 0, e, i, 0), s.push(i, -e, 0, i, e, 0);
    }
    Xe.geometry.dispose(), Xe.geometry = new Me(), Xe.geometry.setAttribute("position", new bt(s, 3));
  };
  ye.add(Ie, _e, Xe), ye.visible = false, ye.frustumCulled = false, d.add(ye);
  const ht = new tt();
  ht.frustumCulled = false, ht.visible = false, d.add(ht);
  const Ct = (e) => {
    const o = new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0)]), s = new zn({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new St(o, s);
  }, P = Ct(16711680), L = Ct(65280), Q = Ct(35071);
  ht.add(P, L, Q);
  const N = [], fe = (e) => e.traverse((o) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = o.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), he = Ct(16761856);
  he.material.dashSize = 0.28, he.material.gapSize = 0.16, he.material.opacity = 0.9, he.frustumCulled = false, he.visible = false, he.renderOrder = 98, d.add(he);
  const Se = (e) => {
    const o = new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0), new _(0, 0, 0), new _(0, 0, 0)]), s = new ut({ color: e, transparent: true, opacity: 0.2, depthTest: false }), n = new ys(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, Pe = Se(3462041), Be = Se(16724804), Re = Se(6333946), Ze = new tt();
  Ze.frustumCulled = false, Ze.visible = false, d.add(Ze), Ze.add(Pe, Be, Re);
  const He = (e) => {
    const o = new jt(1, 1), s = new pt({ color: e, transparent: true, opacity: 0.06, side: Pt, depthWrite: false }), n = new nt(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ye = He(3462041), rt = He(16724804), Le = He(6333946);
  Ze.add(Ye, rt, Le);
  const st = (e, o, s, n) => {
    e.scale.set(2 * n, 2 * n, 1), s === "xy" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, 0, 0)) : s === "xz" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, Oe = document.createElement("div");
  Oe.id = "hk-refplane-badge", Oe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Oe), window.__hekatanSetOrthoPlanes = (e) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = e, Ze.visible = e, e) {
      const o = window.__hekatanOrthoAnchor, s = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      ot(Pe, i, "xy", r), ot(Be, i, "xz", r), ot(Re, i, "yz", r), st(Ye, i, "xy", r), st(rt, i, "xz", r), st(Le, i, "yz", r), Ye.material.opacity = 0.05, rt.material.opacity = 0.05, Le.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    x();
  }, window.__hekatanSetOrthoExt = (e) => {
    var _a2;
    if (window.__hekatanOrthoExt = e, !Ze.visible) {
      x();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    ot(Pe, i, "xy", e), ot(Be, i, "xz", e), ot(Re, i, "yz", e), st(Ye, i, "xy", e), st(rt, i, "xz", e), st(Le, i, "yz", e), x();
  };
  const cn = (e) => {
    if (Ye.material.opacity = e === "xy" ? 0.09 : 0.025, rt.material.opacity = e === "xz" ? 0.09 : 0.025, Le.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      Oe.style.background = a.bg, Oe.style.color = a.text, Oe.textContent = `\u25A6 Plano ${e.toUpperCase()}`, Oe.style.display = "block";
    } else Oe.style.display = "none";
  }, ot = (e, o, s, n) => {
    let a;
    s === "xy" ? a = [new _(o[0] - n, o[1] - n, o[2]), new _(o[0] + n, o[1] - n, o[2]), new _(o[0] + n, o[1] + n, o[2]), new _(o[0] - n, o[1] + n, o[2]), new _(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new _(o[0] - n, o[1], o[2] - n), new _(o[0] + n, o[1], o[2] - n), new _(o[0] + n, o[1], o[2] + n), new _(o[0] - n, o[1], o[2] + n), new _(o[0] - n, o[1], o[2] - n)] : a = [new _(o[0], o[1] - n, o[2] - n), new _(o[0], o[1] + n, o[2] - n), new _(o[0], o[1] + n, o[2] + n), new _(o[0], o[1] - n, o[2] + n), new _(o[0], o[1] - n, o[2] - n)], e.geometry.setFromPoints(a);
  };
  let at = null;
  window.__hekatanAxisLock = () => at;
  let Nt = null, Ne = null;
  const Ce = document.createElement("div");
  Ce.id = "hk-axis-lock-badge", Ce.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ce);
  const Ae = () => {
    if (!at) {
      Ce.style.display = "none";
      return;
    }
    const e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = e[at], Ce.style.border = `1.5px solid ${e[at]}`, Ce.textContent = `\u{1F512} LOCK ${at.toUpperCase()}`, Ce.style.display = "block";
  };
  window.addEventListener("keydown", (e) => {
    var _a2, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== U) return;
    const s = e.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && n === "polyarea" && we.length >= 3) {
      const a = dn();
      oe(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") at = at === s ? null : s, Ae(), e.preventDefault();
    else if (e.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Ko(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || Xn(), oe(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (ht.visible = false), oe(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a2;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const e = window.__hekatanOrthoMode;
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = e ? "block" : "none";
      let s = document.getElementById("hk-ortho-badge");
      s || (s = document.createElement("div"), s.id = "hk-ortho-badge", s.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", s.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(s)), s.style.display = e ? "block" : "none";
    }
  };
  const Ke = new _(), ze = new _(), ct = new _(), mt = (e) => {
    if (!at) return null;
    const o = e[0], s = e[1], n = e[2];
    return at === "x" ? (Ke.set(o - 1e4, s, n), ze.set(o + 1e4, s, n)) : at === "y" ? (Ke.set(o, s - 1e4, n), ze.set(o, s + 1e4, n)) : (Ke.set(o, s, n - 1e4), ze.set(o, s, n + 1e4)), k.ray.distanceSqToSegment(Ke, ze, null, ct), ct;
  };
  window.__hekatanProjectOnAxis = mt;
  const it = new St(new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0)]), new ut({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  it.renderOrder = 998, it.frustumCulled = false, it.visible = false, d.add(it);
  let De = -1, Ge = -1, wt = -1;
  const ke = /* @__PURE__ */ new Set();
  window.__hekatanSelection = ke;
  const zt = new St(new Me().setFromPoints([new _(), new _()]), new ut({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  zt.renderOrder = 997, zt.frustumCulled = false, zt.visible = false, d.add(zt);
  const vt = new nt(new yn(0.02, 12, 12), new pt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  vt.renderOrder = 998, vt.visible = false, d.add(vt);
  const It = (e) => {
    const o = h();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(e);
    return Math.max(0.05, s / 10);
  }, Ft = () => {
    vt.visible && vt.scale.setScalar(It(vt.position));
  }, Vt = new tt();
  Vt.frustumCulled = false, d.add(Vt);
  const en = 2282478;
  let Ut = null;
  const xn = (e, o, s, n) => {
    if (!t.points) return -1;
    const a = t.points.rawVal;
    let i = -1, r = n;
    for (let f = 0; f < a.length; f++) {
      const m = a[f];
      if (!m) continue;
      const y = Math.hypot(e - m[0], o - m[1], s - m[2]);
      y < r && (r = y, i = f);
    }
    return i;
  }, At = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; Vt.children.length; ) {
      const r = Vt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of ke) {
      const [f, ...m] = r.split(":");
      if (f === "pt") {
        const y = e[+m[0]];
        if (!y) continue;
        const M = new nt(new yn(0.025, 12, 12), new pt({ color: en, transparent: true, opacity: 0.9, depthTest: false }));
        M.position.set(y[0], y[1], y[2]), M.renderOrder = 999, M.__isSelectionPt = true, Vt.add(M);
      } else if (f === "seg") {
        const y = o[+m[0]], M = e[y == null ? void 0 : y[+m[1]]], S = e[y == null ? void 0 : y[+m[1] + 1]];
        if (!M || !S) continue;
        const u = new Me().setFromPoints([new _(M[0], M[1], M[2]), new _(S[0], S[1], S[2])]), F = new St(u, new ut({ color: en, transparent: true, opacity: 0.95, depthTest: false }));
        F.renderOrder = 999, Vt.add(F);
      } else if (f === "poly") {
        const M = o[+m[0]].map((F) => {
          const j = e[F];
          return j ? new _(j[0], j[1], j[2]) : null;
        }).filter(Boolean);
        if (M.length < 2) continue;
        const S = new Me().setFromPoints(M), u = new St(S, new ut({ color: en, transparent: true, opacity: 0.95, depthTest: false }));
        u.renderOrder = 999, Vt.add(u);
      } else if (f === "aux") {
        const y = n[+m[0]];
        if (!y || y.length !== 6) continue;
        const M = new Me().setFromPoints([new _(y[0], y[1], y[2]), new _(y[3], y[4], y[5])]), S = new St(M, new ut({ color: en, transparent: true, opacity: 0.95, depthTest: false }));
        S.renderOrder = 999, Vt.add(S);
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
    x();
  };
  window.__hekatanRefreshSelection = At, window.__hekatanClearSelection = () => {
    ke.clear(), At();
  };
  const tn = (e, o, s, n, a, i, r, f, m) => {
    const y = r - n, M = f - a, S = m - i, u = y * y + M * M + S * S;
    if (u < 1e-12) return Math.hypot(e - n, o - a, s - i);
    let F = ((e - n) * y + (o - a) * M + (s - i) * S) / u;
    F = Math.max(0, Math.min(1, F));
    const j = n + F * y, J = a + F * M, X = i + F * S;
    return Math.hypot(e - j, o - J, s - X);
  }, gn = (e, o, s, n) => {
    if (!t.polylines) return null;
    const a = t.polylines.rawVal, i = t.points.rawVal;
    let r = -1, f = -1, m = n;
    for (let y = 0; y < a.length; y++) {
      const M = a[y];
      for (let S = 0; S < M.length - 1; S++) {
        const u = i[M[S]], F = i[M[S + 1]];
        if (!u || !F) continue;
        const j = tn(e, o, s, u[0], u[1], u[2], F[0], F[1], F[2]);
        j < m && (m = j, r = y, f = S);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: f, dist: m } : null;
  }, Tn = (e, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let r = -1, f = n;
    for (let m = 0; m < i.length; m++) {
      const y = i[m];
      if (!y || y.length !== 6) continue;
      const M = tn(e, o, s, y[0], y[1], y[2], y[3], y[4], y[5]);
      M < f && (f = M, r = m);
    }
    return r;
  }, no = (e) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[e];
    if (!n || n.length !== 6) {
      it.visible = false;
      return;
    }
    it.geometry.setFromPoints([new _(n[0], n[1], n[2]), new _(n[3], n[4], n[5])]), it.visible = true;
  }, oo = (e, o = -1) => {
    var _a2, _b;
    if (!t.polylines) return;
    const s = t.polylines.rawVal[e], n = t.points.rawVal;
    if (!s || s.length < 2) {
      it.visible = false;
      return;
    }
    const a = ((_b = (_a2 = t.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(e)) ?? false, i = [];
    if (a || o < 0 || o >= s.length - 1) for (const r of s) {
      const f = n[r];
      f && i.push(new _(f[0], f[1], f[2]));
    }
    else {
      const r = n[s[o]], f = n[s[o + 1]];
      r && i.push(new _(r[0], r[1], r[2])), f && i.push(new _(f[0], f[1], f[2]));
    }
    it.geometry.setFromPoints(i), it.visible = true;
  }, nn = (e) => {
    var _a2;
    if (!t.polylines) return;
    const o = t.polylines.rawVal;
    if (e < 0 || e >= o.length) return;
    const s = o.filter((m, y) => y !== e), n = /* @__PURE__ */ new Set();
    for (const m of s) for (const y of m) n.add(y);
    const a = t.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let m = 0; m < a.length; m++) n.has(m) && (i.set(m, r.length), r.push(a[m]));
    const f = s.map((m) => m.map((y) => i.get(y)).filter((y) => y !== void 0));
    t.points.val = r, t.polylines.val = f, t.areas && (t.areas.val = t.areas.rawVal.filter((m) => m !== e).map((m) => m > e ? m - 1 : m)), it.visible = false, De = -1, Ge = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, $n = (e, o) => {
    var _a2, _b, _c;
    if (!t.polylines) return;
    const s = t.polylines.rawVal;
    if (e < 0 || e >= s.length) return;
    if (((_b = (_a2 = t.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      nn(e);
      return;
    }
    const a = s[e];
    if (o < 0 || o >= a.length - 1) return;
    if (a.length === 2) {
      nn(e);
      return;
    }
    let i;
    o === 0 ? i = [a.slice(1)] : o === a.length - 2 ? i = [a.slice(0, -1)] : i = [a.slice(0, o + 1), a.slice(o + 1)];
    const r = [...s.slice(0, e), ...i, ...s.slice(e + 1)], f = /* @__PURE__ */ new Set();
    for (const u of r) for (const F of u) f.add(F);
    const m = t.points.rawVal, y = /* @__PURE__ */ new Map(), M = [];
    for (let u = 0; u < m.length; u++) f.has(u) && (y.set(u, M.length), M.push(m[u]));
    const S = r.map((u) => u.map((F) => y.get(F)).filter((F) => F !== void 0));
    if (t.points.val = M, t.polylines.val = S, t.areas) {
      const u = i.length - 1;
      t.areas.val = t.areas.rawVal.map((F) => F > e ? F + u : F);
    }
    it.visible = false, De = -1, Ge = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  ee.geometry.setAttribute("position", new bt(t.points.rawVal.flat(), 3)), ee.geometry.computeBoundingSphere(), ee.frustumCulled = false, be.frustumCulled = false, d.add(be), H.position.set(0, 0, 0), H.rotateX(Math.PI / 2), H.geometry.rotateX(Math.PI / 2), H.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, o, s) => {
    if (t.points.val = [...t.points.rawVal, [e, o, s]], t.polylines) {
      const n = t.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
      t.polylines.val = [...n.slice(0, -1), [...a, t.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a2;
    if (!t.polylines) return;
    const e = t.polylines.rawVal;
    ((_a2 = e[e.length - 1]) == null ? void 0 : _a2.length) !== 0 && (t.polylines.val = [...e, []]);
  };
  const on = [];
  window.__hekatanCirculos = on;
  let Ln = [], In = "";
  const vn = () => {
    var _a2;
    const e = t.points.rawVal, o = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], s = `${e.length}|${o.length}|${o.reduce((a, i) => a + i.length, 0)}`;
    if (s === In) return Ln;
    In = s;
    const n = [];
    for (const a of o) {
      const i = a.length;
      if (i < 6 || a[0] !== a[i - 1]) continue;
      const r = a.slice(0, i - 1).map((M) => e[M]).filter(Boolean);
      if (r.length < 5) continue;
      const f = [0, 1, 2].map((M) => r.reduce((S, u) => S + u[M], 0) / r.length), m = r.map((M) => Math.hypot(M[0] - f[0], M[1] - f[1], M[2] - f[2])), y = m.reduce((M, S) => M + S, 0) / m.length;
      y < 1e-9 || m.some((M) => Math.abs(M - y) > 5e-3 * y) || n.push({ c: f, r: y });
    }
    return Ln = n;
  };
  window.__hekatanCentrosDeducidos = vn, window.__hekatanDrawCircle = (e, o, s, n, a = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(a)), f = t.points.rawVal.length, m = [];
    for (let y = 0; y < r; y++) {
      const M = 2 * Math.PI * y / r, S = n * Math.cos(M), u = n * Math.sin(M);
      let F;
      i === "xy" ? F = [e + S, o + u, s] : i === "xz" ? F = [e + S, o, s + u] : F = [e, o + S, s + u], m.push(F);
    }
    if (t.points.val = [...t.points.rawVal, ...m], on.push({ c: [e, o, s], r: n }), t.polylines) {
      const y = [...m.map((S, u) => f + u), f], M = t.polylines.rawVal;
      ((_a2 = M[M.length - 1]) == null ? void 0 : _a2.length) > 0 ? t.polylines.val = [...M, y, []] : t.polylines.val = [...M.slice(0, -1), y, []];
    }
  }, window.__hekatanDrawArc = (e, o, s, n = window.__hekatanArcSegs ?? 12) => {
    const a = Math.max(4, Math.round(n)), i = new _(...e), r = new _(...o), f = new _(...s), m = new _().subVectors(r, i), y = new _().subVectors(f, i), M = new _().crossVectors(m, y).normalize(), S = new _().addVectors(i, r).multiplyScalar(0.5), u = new _().addVectors(r, f).multiplyScalar(0.5), F = new _().crossVectors(m, M).normalize(), j = new _().crossVectors(new _().subVectors(f, r), M).normalize(), J = new _().subVectors(u, S), X = F.x * j.y - F.y * j.x;
    let v;
    if (Math.abs(X) > 1e-9) {
      const de = (J.x * j.y - J.y * j.x) / X;
      v = new _().addVectors(S, F.clone().multiplyScalar(de));
    } else v = S.clone();
    const A = i.distanceTo(v), C = new _().subVectors(i, v), D = new _().subVectors(f, v), q = Math.acos(Math.max(-1, Math.min(1, C.dot(D) / (A * A)))), I = t.points.rawVal.length, G = [], ce = M.clone();
    for (let de = 0; de <= a; de++) {
      const ve = de / a, Je = q * ve, Ve = new Kn().setFromAxisAngle(ce, Je), je = C.clone().applyQuaternion(Ve).add(v);
      G.push([je.x, je.y, je.z]);
    }
    if (t.points.val = [...t.points.rawVal, ...G], on.push({ c: [v.x, v.y, v.z], r: A }), t.polylines) {
      const de = G.map((Je, Ve) => I + Ve), ve = t.polylines.rawVal;
      t.polylines.val = [...ve.slice(0, -1), de, []];
    }
  }, window.__hekatanDrawSlabChaflan = (e, o, s = 1, n = 6, a = 6) => {
    const i = Math.min(e[0], o[0]), r = Math.max(e[0], o[0]), f = Math.min(e[1], o[1]), m = Math.max(e[1], o[1]), y = (e[2] + o[2]) / 2, M = r - i, S = m - f, u = Math.min(s, M / 2 - 0.01, S / 2 - 0.01);
    if (u <= 0) return;
    const F = t.points.rawVal.length, j = [], J = [], X = (v, A) => {
      j.push([v, A, y]), J.push(F + j.length - 1);
    };
    for (let v = 0; v <= a; v++) X(i + u + (M - 2 * u) * v / a, f);
    for (let v = 1; v <= n; v++) {
      const A = -Math.PI / 2 + Math.PI / 2 * v / n;
      X(r - u + u * Math.cos(A), f + u + u * Math.sin(A));
    }
    for (let v = 1; v <= a; v++) X(r, f + u + (S - 2 * u) * v / a);
    for (let v = 1; v <= n; v++) {
      const A = 0 + Math.PI / 2 * v / n;
      X(r - u + u * Math.cos(A), m - u + u * Math.sin(A));
    }
    for (let v = 1; v <= a; v++) X(r - u - (M - 2 * u) * v / a, m);
    for (let v = 1; v <= n; v++) {
      const A = Math.PI / 2 + Math.PI / 2 * v / n;
      X(i + u + u * Math.cos(A), m - u + u * Math.sin(A));
    }
    for (let v = 1; v <= a; v++) X(i, m - u - (S - 2 * u) * v / a);
    for (let v = 1; v <= n; v++) {
      const A = Math.PI + Math.PI / 2 * v / n;
      X(i + u + u * Math.cos(A), f + u + u * Math.sin(A));
    }
    if (J.push(F), t.points.val = [...t.points.rawVal, ...j], t.polylines) {
      const v = t.polylines.rawVal;
      t.polylines.val = [...v.slice(0, -1), J, []];
    }
  }, window.__hekatanDrawRect = (e, o) => {
    const s = t.points.rawVal.length, n = e[0], a = e[1], i = e[2], r = o[0], f = o[1], m = o[2];
    let y;
    if (Math.abs(i - m) < 1e-6 ? y = [[n, a, i], [r, a, i], [r, f, i], [n, f, i]] : Math.abs(a - f) < 1e-6 ? y = [[n, a, i], [r, a, i], [r, a, m], [n, a, m]] : y = [[n, a, i], [n, f, i], [n, f, m], [n, a, m]], t.points.val = [...t.points.rawVal, ...y], t.polylines) {
      const M = [s, s + 1, s + 2, s + 3, s], S = t.polylines.rawVal;
      t.polylines.val = [...S.slice(0, -1), M, []];
    }
  }, window.__hekatanDrawRectArea = (e, o) => {
    var _a2;
    const s = t.points.rawVal.length, n = e[0], a = e[1], i = e[2], r = o[0], f = o[1], m = o[2];
    let y;
    if (E && t.gridTarget) {
      const M = t.gridTarget.rawVal, S = new Fn(...M.rotation), u = new _(1, 0, 0).applyEuler(S), F = new _(0, 1, 0).applyEuler(S), j = new _(...M.position), J = new _(n, a, i), X = new _(r, f, m), v = J.clone().sub(j).dot(u), A = J.clone().sub(j).dot(F), C = X.clone().sub(j).dot(u), D = X.clone().sub(j).dot(F), q = (I, G) => j.clone().addScaledVector(u, I).addScaledVector(F, G).toArray();
      y = [q(v, A), q(C, A), q(C, D), q(v, D)];
    } else Math.abs(i - m) < 1e-6 ? y = [[n, a, i], [r, a, i], [r, f, i], [n, f, i]] : Math.abs(a - f) < 1e-6 ? y = [[n, a, i], [r, a, i], [r, a, m], [n, a, m]] : y = [[n, a, i], [n, f, i], [n, f, m], [n, a, m]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...y], t.polylines) {
      const M = t.polylines.rawVal, S = M.length - 1, u = [s, s + 1, s + 2, s + 3, s];
      t.polylines.val = [...M.slice(0, -1), u, []], t.areas && (t.areas.val = [...t.areas.rawVal, S]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x();
  }, window.__hekatanMeshPolyArea = (e, o) => {
    var _a2;
    const s = e.length;
    if (s < 3) return 0;
    let n = 0, a = 0, i = 0;
    for (let xe = 0; xe < s; xe++) {
      const Ee = e[xe], qe = e[(xe + 1) % s];
      n += (Ee[1] - qe[1]) * (Ee[2] + qe[2]), a += (Ee[2] - qe[2]) * (Ee[0] + qe[0]), i += (Ee[0] - qe[0]) * (Ee[1] + qe[1]);
    }
    const r = Math.hypot(n, a, i) || 1;
    n /= r, a /= r, i /= r;
    let f = e[1][0] - e[0][0], m = e[1][1] - e[0][1], y = e[1][2] - e[0][2];
    const M = Math.hypot(f, m, y) || 1;
    f /= M, m /= M, y /= M;
    let S = a * y - i * m, u = i * f - n * y, F = n * m - a * f;
    const j = Math.hypot(S, u, F) || 1;
    S /= j, u /= j, F /= j;
    const J = e[0], X = (xe) => [(xe[0] - J[0]) * f + (xe[1] - J[1]) * m + (xe[2] - J[2]) * y, (xe[0] - J[0]) * S + (xe[1] - J[1]) * u + (xe[2] - J[2]) * F], v = (xe, Ee) => [J[0] + xe * f + Ee * S, J[1] + xe * m + Ee * u, J[2] + xe * y + Ee * F], A = e.map(X);
    let C = 1 / 0, D = -1 / 0, q = 1 / 0, I = -1 / 0;
    for (const [xe, Ee] of A) xe < C && (C = xe), xe > D && (D = xe), Ee < q && (q = Ee), Ee > I && (I = Ee);
    const G = D - C, ce = I - q;
    if (G < 1e-6 || ce < 1e-6) return 0;
    let de = o && o > 0 ? o : 0.5;
    for (; G / de * (ce / de) > 2500; ) de *= 2;
    de = Math.min(de, Math.min(G, ce));
    const ve = (xe, Ee) => {
      let qe = false;
      for (let $t = 0, Dt = A.length - 1; $t < A.length; Dt = $t++) {
        const [Lt, Ot] = A[$t], [go, Un] = A[Dt];
        Ot > Ee != Un > Ee && xe < (go - Lt) * (Ee - Ot) / (Un - Ot) + Lt && (qe = !qe);
      }
      return qe;
    }, Je = Math.max(1, Math.round(G / de)), Ve = Math.max(1, Math.round(ce / de)), je = G / Je, et = ce / Ve, dt = /* @__PURE__ */ new Map(), Ue = [], Fe = t.points.rawVal.length, We = (xe, Ee) => {
      const qe = xe + "," + Ee, $t = dt.get(qe);
      if ($t !== void 0) return $t;
      const Dt = Fe + Ue.length;
      return Ue.push(v(C + xe * je, q + Ee * et)), dt.set(qe, Dt), Dt;
    }, Te = [];
    for (let xe = 0; xe < Je; xe++) for (let Ee = 0; Ee < Ve; Ee++) {
      if (!ve(C + (xe + 0.5) * je, q + (Ee + 0.5) * et)) continue;
      const qe = We(xe, Ee), $t = We(xe + 1, Ee), Dt = We(xe + 1, Ee + 1), Lt = We(xe, Ee + 1);
      Te.push([qe, $t, Dt, Lt]);
    }
    if (!Te.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...Ue], t.polylines && t.areas) {
      let xe = t.polylines.rawVal.slice();
      xe.length && xe[xe.length - 1].length === 0 && (xe = xe.slice(0, -1));
      const Ee = [];
      for (const qe of Te) Ee.push(xe.length), xe.push([qe[0], qe[1], qe[2], qe[3], qe[0]]);
      xe.push([]), t.polylines.val = xe, t.areas.val = [...t.areas.rawVal, ...Ee];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), Te.length;
  };
  const dn = () => {
    if (we.length < 3) return we = [], O.visible = false, x(), 0;
    const e = window.__hekatanMeshPolyArea(we.slice());
    return we = [], O.visible = false, x(), e;
  };
  window.__hekatanFinalizePolyArea = dn, window.__hekatanSetInclinedPlaneFrom3 = (e, o, s) => {
    var _a2;
    const n = new _(e[0], e[1], e[2]), a = new _(o[0], o[1], o[2]), i = new _(s[0], s[1], s[2]), r = new _().subVectors(a, n).cross(new _().subVectors(i, n));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const f = new Kn().setFromUnitVectors(new _(0, 0, 1), r), m = new Fn().setFromQuaternion(f);
    t.gridTarget && (t.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [m.x, m.y, m.z] }), E = true;
    const y = new _().addVectors(n, a).add(i).multiplyScalar(1 / 3), M = Math.max(n.distanceTo(a), n.distanceTo(i), a.distanceTo(i)) * 2.2 + 4, S = M / 2;
    Ie.geometry.dispose(), Ie.geometry = new jt(M, M), _e.geometry.dispose(), _e.geometry = new os(new jt(M, M)), Qe(S, 1), ye.position.copy(y), ye.quaternion.copy(f), ye.scale.set(1, 1, 1), ye.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), E = false, ye.visible = false, x();
  };
  const qt = new tt();
  qt.visible = false, d.add(qt), window.__hekatanShowAxes = (e, o, s = 12, n = 2) => {
    var _a2, _b;
    for (; qt.children.length; ) {
      const M = qt.children.pop();
      (_a2 = M.geometry) == null ? void 0 : _a2.dispose(), (_b = M.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !o.length) return;
    const a = Math.min(...o) - n, i = Math.max(...o) + n, r = Math.min(...e) - n, f = Math.max(...e) + n, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", y = (M, S, u, F, j) => {
      const J = document.createElement("canvas");
      J.width = 64, J.height = 32;
      const X = J.getContext("2d");
      X.fillStyle = j, X.font = "bold 22px sans-serif", X.textAlign = "center", X.fillText(M, 32, 26);
      const v = new ss(J), A = new as({ map: v, transparent: true }), C = new is(A);
      return C.position.set(S, u, F), C.scale.set(1.2, 0.6, 1), C;
    };
    e.forEach((M, S) => {
      const u = S < m.length ? m[S] : `X${S}`, F = new Me().setFromPoints([new _(M, a, 0), new _(M, i, 0), new _(M, a, 0), new _(M, a, s)]), j = new zn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), J = new Ht(F, j);
      J.computeLineDistances(), qt.add(J), qt.add(y(u, M, a - 0.5, 0, "#60a5fa")), qt.add(y(u, M, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((M, S) => {
      const u = `${S + 1}`, F = new Me().setFromPoints([new _(r, M, 0), new _(f, M, 0), new _(r, M, 0), new _(r, M, s)]), j = new zn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), J = new Ht(F, j);
      J.computeLineDistances(), qt.add(J), qt.add(y(u, r - 0.5, M, 0, "#fb7185")), qt.add(y(u, f + 0.5, M, 0, "#fb7185"));
    }), qt.visible = true, x();
  }, window.__hekatanHideAxes = () => {
    qt.visible = false, x();
  };
  const Jt = new tt();
  Jt.visible = false, d.add(Jt);
  let pn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], o = 20, s = 0, n = 0) => {
    var _a2, _b;
    for (; Jt.children.length; ) {
      const i = Jt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    pn.forEach((i) => {
      d.remove(i), i.geometry.dispose(), i.material.dispose();
    }), pn = [];
    const a = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((i, r) => {
      const f = a[r % a.length], m = o / 2, y = [new _(s - m, n - m, i), new _(s + m, n - m, i), new _(s + m, n + m, i), new _(s - m, n + m, i), new _(s - m, n - m, i)], M = new Me().setFromPoints(y), S = new ut({ color: f, transparent: true, opacity: 0.55 });
      Jt.add(new St(M, S));
      const u = document.createElement("canvas");
      u.width = 128, u.height = 32;
      const F = u.getContext("2d");
      F.fillStyle = `#${f.toString(16).padStart(6, "0")}`, F.font = "bold 18px sans-serif", F.fillText(`Z = ${i} m`, 4, 22);
      const j = new ss(u), J = new as({ map: j, transparent: true }), X = new is(J);
      X.position.set(s - m - 1.5, n - m - 1.5, i), X.scale.set(2.5, 0.6, 1), Jt.add(X);
      const v = new jt(1e4, 1e4), A = new pt({ visible: false, side: Pt }), C = new nt(v, A);
      C.position.set(0, 0, i), C.frustumCulled = false, C.userData = { refPlaneZ: i }, d.add(C), pn.push(C);
    }), Jt.visible = true, x();
  }, window.__hekatanHideRefPlanes = () => {
    Jt.visible = false, pn.forEach((e) => {
      e.visible = false;
    }), x();
  };
  const Mn = new tt();
  Mn.frustumCulled = false, d.add(Mn);
  const ks = () => {
    var _a2, _b, _c, _d;
    for (; Mn.children.length; ) {
      const s = Mn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new Me().setFromPoints([new _(s[0], s[1], s[2]), new _(s[3], s[4], s[5])]), a = new zn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new St(n, a);
      i.computeLineDistances(), Mn.add(i);
    }
  };
  W.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, ks(), x());
  });
  const un = new tt();
  un.frustumCulled = false, d.add(un);
  const To = () => {
    var _a2, _b, _c, _d;
    for (; un.children.length; ) {
      const s = un.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new nt(new yn(0.025, 12, 12), new pt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(It(n.position)), un.add(n);
    }
  };
  W.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, To(), x());
  }), c.addEventListener("change", () => {
    un.children.forEach((e) => {
      e.scale.setScalar(It(e.position));
    });
  }), window.__hekatanRenderAuxPoints = To;
  const yt = new tt(), Ps = new nt(new yn(0.01, 12, 12), new pt({ color: 16724804, transparent: true, opacity: 0.95 })), Cs = new nt(new yn(0.015, 12, 12), new pt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  yt.add(Ps, Cs);
  const fn = 0.08, so = (e, o, s) => {
    const n = new Me().setFromPoints([new _(...e), new _(...o)]);
    return new St(n, new ut({ color: s, transparent: true, opacity: 0.7 }));
  };
  yt.add(so([-fn, 0, 0], [fn, 0, 0], 16711680)), yt.add(so([0, -fn, 0], [0, fn, 0], 65280)), yt.add(so([0, 0, -fn], [0, 0, fn], 35071)), yt.visible = false, yt.frustumCulled = false, d.add(yt);
  let ao = 2;
  const Rn = (e) => {
    const o = h(), s = (g == null ? void 0 : g.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / s : 2 * o.position.distanceTo(e) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / s;
  }, bn = () => {
    if (!yt.visible) return;
    const e = ao * Rn(yt.position) / 0.015;
    yt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let _n = 10;
  const io = (e) => Math.max(1e-4, _n * Rn(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (_n = e), _n), window.__hekatanUpdateSnapScale = bn, window.__hekatanSnapMarker = yt, window.__hekatanMetrosPorPixel = Rn, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (ao = e, bn(), x()), ao);
  const $o = () => {
    Vt.children.length !== 0 && Vt.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const o = e;
      o.scale.setScalar(It(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = $o, c.addEventListener("change", () => {
    var _a2;
    bn(), vt.visible && Ft(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), $o();
  }), window.__hekatanShowSnap = (e, o, s) => {
    yt.position.set(e, o, s), yt.visible = true, bn(), x();
  }, window.__hekatanHideSnap = () => {
    yt.visible = false, x();
  }, g.addEventListener("pointermove", (e) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const o = b(e);
    if (!o) return;
    k.setFromCamera(z, o);
    const s = ie();
    if (s.length) {
      const n = s[0].point, a = e.altKey, i = io(n), r = a ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i, { x: e.clientX, y: e.clientY });
      if (r) Bo(r.type, r.x, r.y, r.z), yt.position.set(r.x, r.y, r.z), yt.visible = true, n.set(r.x, r.y, r.z), Xo(r.type, e.clientX, e.clientY);
      else {
        Es(), Xn();
        const S = !a && window.__hekatanSnapEnabled !== false, u = window.__hekatanSnap2D ?? 0.5;
        S && u > 0 && (n.x = Math.round(n.x / u) * u, n.y = Math.round(n.y / u) * u, n.z = Math.round(n.z / u) * u), yt.position.copy(n), yt.visible = true;
      }
      bn();
      const f = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (f === "select" || !f) {
        const S = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = xn(n.x, n.y, n.z, S), F = gn(n.x, n.y, n.z, S), j = Tn(n.x, n.y, n.z, S);
        if (u >= 0) {
          const A = t.points.rawVal[u];
          vt.position.set(A[0], A[1], A[2]), vt.visible = true, Ft(), zt.visible = false, Ut = { kind: "pt", a: u };
        } else if (F) {
          const A = t.points.rawVal, C = t.polylines.rawVal[F.polyIdx], D = A[C[F.segIdx]], q = A[C[F.segIdx + 1]];
          zt.geometry.setFromPoints([new _(D[0], D[1], D[2]), new _(q[0], q[1], q[2])]), zt.visible = true, vt.visible = false, Ut = ((_f = (_e2 = t.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(F.polyIdx)) ?? false ? { kind: "poly", a: F.polyIdx } : { kind: "seg", a: F.polyIdx, b: F.segIdx };
        } else if (j >= 0) {
          const C = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[j];
          C && (zt.geometry.setFromPoints([new _(C[0], C[1], C[2]), new _(C[3], C[4], C[5])]), zt.visible = true, vt.visible = false, Ut = { kind: "aux", a: j });
        } else zt.visible = false, vt.visible = false, Ut = null;
        se.style.left = e.clientX + "px", se.style.top = e.clientY + "px", se.style.display = "block";
        let J = n;
        if ((Ut == null ? void 0 : Ut.kind) === "pt") {
          const A = t.points.rawVal[Ut.a];
          A && (J = new _(A[0], A[1], A[2]));
        }
        const X = `X=${J.x.toFixed(2)} Y=${J.y.toFixed(2)} Z=${J.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [J.x, J.y, J.z], Ut) {
          const A = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          se.textContent = `${X}  \xB7  \u{1F5B1} Click \u2192 ${A[Ut.kind]}`;
        } else se.textContent = X;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = X), Ne = { p: J.clone(), x: e.clientX, y: e.clientY }, ue.visible = false, ht.visible = false, he.visible = false, x();
        return;
      }
      if (f === "delete" || f === "trim" || f === "extend" || f === "offset") {
        const S = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = gn(n.x, n.y, n.z, S), F = Tn(n.x, n.y, n.z, S);
        let j = false;
        if (F >= 0) if (!u) j = true;
        else {
          const A = window.__hekatanDrawingAuxLines, D = ((A == null ? void 0 : A.rawVal) ?? (A == null ? void 0 : A.val) ?? A ?? [])[F];
          tn(n.x, n.y, n.z, D[0], D[1], D[2], D[3], D[4], D[5]) < u.dist && (j = true);
        }
        j ? (wt = F, De = -1, Ge = -1, no(F)) : u ? (De = u.polyIdx, Ge = u.segIdx, wt = -1, oo(u.polyIdx, u.segIdx)) : (De = -1, Ge = -1, wt = -1, it.visible = false), ue.visible = false, ht.visible = false, he.visible = false, Y(), se.style.left = e.clientX + "px", se.style.top = e.clientY + "px", se.style.display = "block";
        const J = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let X = "";
        j ? X = `\u{1F5D1} l\xEDnea aux #${wt + 1}` : u ? X = ((_i = (_h = t.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(u.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${u.polyIdx + 1}` : `\u{1F5D1} seg ${u.segIdx + 1} / poly #${u.polyIdx + 1}` : X = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", se.textContent = `${J}  \xB7  ${X}`;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = J), x();
        return;
      } else it.visible = false, De = -1, wt = -1;
      se.style.left = e.clientX + "px", se.style.top = e.clientY + "px", se.style.display = "block";
      const m = ((_j = t.polylines) == null ? void 0 : _j.rawVal) ?? [], y = m[m.length - 1] ?? [], M = t.points.rawVal ?? [];
      if (y.length > 0 && M[y[y.length - 1]]) {
        const S = y[y.length - 1], u = M[S];
        let F = at;
        if (Nt = null, !F && window.__hekatanAxisSnap !== false) {
          const Ve = g.getBoundingClientRect(), je = e.clientX, et = e.clientY, dt = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, Ue = new _(u[0], u[1], u[2]), Fe = [["x", new _(1, 0, 0)], ["y", new _(0, 1, 0)], ["z", new _(0, 0, 1)]], We = (xe) => {
            const Ee = xe.clone().project(o);
            return { x: (Ee.x * 0.5 + 0.5) * Ve.width + Ve.left, y: (-Ee.y * 0.5 + 0.5) * Ve.height + Ve.top };
          };
          let Te = null;
          for (const [xe, Ee] of Fe) {
            const qe = We(Ue.clone().addScaledVector(Ee, -dt)), $t = We(Ue.clone().addScaledVector(Ee, dt)), Dt = $t.x - qe.x, Lt = $t.y - qe.y, Ot = je - qe.x, go = et - qe.y, Un = Dt * Dt + Lt * Lt || 1;
            let Zn = (Ot * Dt + go * Lt) / Un;
            Zn = Math.max(0, Math.min(1, Zn));
            const Oo = Math.hypot(je - (qe.x + Zn * Dt), et - (qe.y + Zn * Lt));
            if (Te === null || Oo < Te.dpx) {
              const vo = k.ray, Qo = Ue.clone().sub(vo.origin), Mo = Ee.dot(vo.direction), jo = Ee.dot(Qo), Xs = vo.direction.dot(Qo), es = 1 - Mo * Mo, Ys = Math.abs(es) < 1e-6 ? -jo : (Mo * Xs - jo) / es;
              Te = { axis: xe, dpx: Oo, pt: Ue.clone().addScaledVector(Ee, Ys) };
            }
          }
          Te && Te.dpx <= 12 && (n.copy(Te.pt), F = Te.axis, Nt = Te.pt.clone());
        }
        const j = !!window.__hekatanOrthoMode;
        if (!F && j) {
          const Ve = Math.abs(n.x - u[0]), je = Math.abs(n.y - u[1]), et = Math.abs(n.z - u[2]), dt = (_l = s[0]) == null ? void 0 : _l.object;
          let Ue = null;
          dt === Ye ? Ue = "xy" : dt === rt ? Ue = "xz" : dt === Le && (Ue = "yz"), Ue === "xy" ? F = Ve >= je ? "x" : "y" : Ue === "xz" ? F = Ve >= et ? "x" : "z" : Ue === "yz" ? F = je >= et ? "y" : "z" : F = Ve >= je && Ve >= et ? "x" : je >= et ? "y" : "z";
        }
        const J = window.__hekatanPolarTrack !== false;
        if (!F && J) {
          const Ve = n.x - u[0], je = n.y - u[1], et = n.z - u[2], dt = Math.hypot(Ve, je, et);
          if (dt > 1e-3) {
            const Fe = Math.tan(6 * Math.PI / 180) * dt, We = Math.hypot(je, et), Te = Math.hypot(Ve, et), xe = Math.hypot(Ve, je), Ee = [["x", We], ["y", Te], ["z", xe]];
            Ee.sort((qe, $t) => qe[1] - $t[1]), Ee[0][1] <= Fe && (F = Ee[0][0]);
          }
        }
        if (F) {
          const Ve = u[0], je = u[1], et = u[2];
          F === "x" ? n.set(n.x, je, et) : F === "y" ? n.set(Ve, n.y, et) : n.set(Ve, je, n.z);
          const dt = !!at, Fe = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[F];
          Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = Fe, Ce.style.border = `1.5px solid ${Fe}`;
          const We = (_m = s[0]) == null ? void 0 : _m.object;
          let Te = null;
          We === Ye ? Te = "xy" : We === rt ? Te = "xz" : We === Le && (Te = "yz");
          const xe = Te ? ` (plano ${Te.toUpperCase()})` : "";
          Ce.textContent = dt ? `\u{1F512} LOCK ${F.toUpperCase()}${xe}` : `\u22A5 ORTO ${F.toUpperCase()}${xe}`, Ce.style.left = e.clientX + 20 + "px", Ce.style.top = e.clientY + 18 + "px", Ce.style.transform = "none", Ce.style.display = "block";
        } else at || (Ce.style.display = "none");
        let X = null;
        if (!a && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ve = t.points.rawVal, je = F ? [F] : ["z", "x", "y"], et = { x: e.clientX, y: e.clientY };
          let dt = 1 / 0;
          for (const Ue of Ve) if (!(Math.abs(Ue[0] - u[0]) < 1e-9 && Math.abs(Ue[1] - u[1]) < 1e-9 && Math.abs(Ue[2] - u[2]) < 1e-9)) for (const Fe of je) {
            const We = new _(Fe === "x" ? Ue[0] : n.x, Fe === "y" ? Ue[1] : n.y, Fe === "z" ? Ue[2] : n.z), Te = uo(We.x, We.y, We.z);
            if (!Te) continue;
            const xe = Math.hypot(Te.x - et.x, Te.y - et.y);
            xe < _n && xe < dt && (dt = xe, X = { q: Ue, eje: Fe });
          }
        }
        X ? (X.eje === "x" ? n.x = X.q[0] : X.eje === "y" ? n.y = X.q[1] : n.z = X.q[2], he.geometry.setFromPoints([new _(X.q[0], X.q[1], X.q[2]), new _(n.x, n.y, n.z)]), (_n2 = he.computeLineDistances) == null ? void 0 : _n2.call(he), he.visible = true, yt.position.set(n.x, n.y, n.z), yt.visible = true, Xo("track", e.clientX, e.clientY)) : he.visible = false, Ne = { p: n.clone(), x: e.clientX, y: e.clientY };
        const v = Math.hypot(n.x - u[0], n.y - u[1], n.z - u[2]), A = Math.atan2(n.y - u[1], n.x - u[0]) * 180 / Math.PI, C = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = `${C} | \u0394L=${v.toFixed(2)}m ${A.toFixed(0)}\xB0`;
        const D = document.getElementById("hk-coord-fixed");
        D && (D.textContent = C), ue.geometry.setFromPoints([new _(u[0], u[1], u[2]), new _(n.x, n.y, n.z)]), (_o2 = ue.computeLineDistances) == null ? void 0 : _o2.call(ue), ue.visible = true, Z(u[0], u[1], u[2], n.x, n.y, n.z);
        const q = window.__hekatanOrthoExt ?? 8, I = window.__hekatanShowOrthoPlanes !== false;
        Ze.visible = I, I || cn(null), I && (ot(Pe, u, "xy", q), ot(Be, u, "xz", q), ot(Re, u, "yz", q), st(Ye, u, "xy", q), st(rt, u, "xz", q), st(Le, u, "yz", q));
        const G = I ? k.intersectObjects([Ye, rt, Le], false) : [];
        let ce = null;
        if (G.length > 0) {
          const Ve = G[0].object;
          Ve === Ye ? ce = "xy" : Ve === rt ? ce = "xz" : Ve === Le && (ce = "yz");
        }
        cn(ce), ce && (Oe.style.left = e.clientX + "px", Oe.style.top = e.clientY + "px"), P.geometry.setFromPoints([new _(u[0] - q, u[1], u[2]), new _(u[0] + q, u[1], u[2])]), (_p = P.computeLineDistances) == null ? void 0 : _p.call(P), L.geometry.setFromPoints([new _(u[0], u[1] - q, u[2]), new _(u[0], u[1] + q, u[2])]), (_q = L.computeLineDistances) == null ? void 0 : _q.call(L), Q.geometry.setFromPoints([new _(u[0], u[1], u[2] - q), new _(u[0], u[1], u[2] + q)]), (_r = Q.computeLineDistances) == null ? void 0 : _r.call(Q), ht.visible = true;
        const de = P.material, ve = L.material, Je = Q.material;
        F === "x" ? (de.opacity = 0.95, ve.opacity = 0.1, Je.opacity = 0.1) : F === "y" ? (de.opacity = 0.1, ve.opacity = 0.95, Je.opacity = 0.1) : F === "z" ? (de.opacity = 0.1, ve.opacity = 0.1, Je.opacity = 0.95) : (de.opacity = 0.5, ve.opacity = 0.5, Je.opacity = 0.5);
      } else {
        const S = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = S;
        const u = document.getElementById("hk-coord-fixed");
        if (u && (u.textContent = S), ue.visible = false, ht.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(f)) {
          if (B = null, K = null, U.style.left = e.clientX + 20 + "px", U.style.top = e.clientY - 28 + "px", U.style.display = "block", !T) {
            U.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const j = document.activeElement;
            !(j && (j.tagName === "INPUT" || j.tagName === "TEXTAREA") && j !== U) && document.activeElement !== U && U.focus({ preventScroll: true });
            try {
              U.select();
            } catch {
            }
          }
        } else Y();
      }
      x();
    } else Xn(), se.style.display = "none", yt.visible = false, ue.visible = false, ht.visible = false, Y(), x();
  }), W.derive(() => {
    var _a2;
    if (!t.gridTarget) return;
    const e = new Kn().setFromEuler(new Fn(...t.gridTarget.val.rotation)), o = new Kn().setFromAxisAngle(new _(1, 0, 0), Math.PI / 2);
    Fa(l, { position: new _(...t.gridTarget.val.position), quaternion: e.clone().multiply(o) }, x);
    {
      const n = t.gridTarget.val.position[2], a = Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of N) d.remove(i), fe(i);
      if (N.length = 0, a) {
        const i = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], r = /* @__PURE__ */ new Set([0]);
        for (const m of i) r.add(+m[2].toFixed(3));
        for (const m of window.__hekatanLevels ?? []) isFinite(m == null ? void 0 : m.z) && r.add(+m.z.toFixed(3));
        const f = [...r].sort((m, y) => m - y).slice(0, 24);
        for (const m of f) {
          if (Math.abs(m - n) < 1e-6) continue;
          const y = l.clone(true);
          y.name = `hekatan-grid-nivel-${m}`, y.traverse((M) => {
            M.material && (M.material = M.material.clone(), M.material.transparent = true, M.material.opacity = (M.material.opacity ?? 1) * (Math.abs(m) < 1e-6 ? 0.5 : 0.22));
          }), y.position.set(0, 0, m), y.quaternion.copy(o), d.add(y), N.push(y);
        }
      }
    }
    H.position.set(...t.gridTarget.val.position), H.quaternion.setFromEuler(new Fn(...t.gridTarget.val.rotation)), H.updateMatrixWorld();
    const s = new _(0, 0, 1).applyEuler(new Fn(...t.gridTarget.val.rotation));
    E = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), W.derive(() => {
    ee.geometry.setAttribute("position", new bt(t.points.val.flat(), 3)), ee.geometry.computeBoundingSphere();
  }), W.derive(() => {
    const e = 0.05 * w * 0.5 * p.val;
    k.params.Points.threshold = 0.4 * e;
  }), W.derive(() => {
    var _a2;
    const e = t.points.val ?? [], s = (((_a2 = t.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of s) {
      const [r, f, m] = e[i];
      n.push(r, f, m);
    }
    const a = new Me();
    a.setAttribute("position", new bt(n, 3)), ge.geometry.dispose(), ge.geometry = a;
  });
  let lo = false, sn = 0;
  g.addEventListener("pointerdown", () => {
    lo = true;
  }), g.addEventListener("pointerup", () => {
    lo = false;
  }), g.addEventListener("pointermove", () => {
    lo && sn++;
  });
  const Tt = document.createElement("div");
  Tt.id = "hk-window-select", Tt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Tt);
  let Kt = null, Sn = false, Bt = null;
  const ro = (e, o, s, n, a) => {
    a ? (Tt.style.borderColor = "#34d399", Tt.style.borderStyle = "dashed", Tt.style.background = "rgba(52, 211, 153, 0.10)") : (Tt.style.borderColor = "#22d3ee", Tt.style.borderStyle = "solid", Tt.style.background = "rgba(34, 211, 238, 0.10)"), Tt.style.left = Math.min(e, s) + "px", Tt.style.top = Math.min(o, n) + "px", Tt.style.width = Math.abs(s - e) + "px", Tt.style.height = Math.abs(n - o) + "px", Tt.style.display = "block";
  }, Lo = (e, o, s, n, a) => {
    var _a2, _b, _c, _d;
    const i = Math.min(e, s), r = Math.max(e, s), f = Math.min(o, n), m = Math.max(o, n), y = s < e, M = g.getBoundingClientRect(), S = h();
    S.updateMatrixWorld();
    const u = (I) => {
      const G = new _(I[0], I[1], I[2]);
      return G.project(S), { x: M.left + (G.x * 0.5 + 0.5) * M.width, y: M.top + (-G.y * 0.5 + 0.5) * M.height };
    }, F = (I) => I.x >= i && I.x <= r && I.y >= f && I.y <= m, j = (I, G) => !(I.x < i && G.x < i || I.x > r && G.x > r || I.y < f && G.y < f || I.y > m && G.y > m);
    a || ke.clear();
    let J = 0;
    const X = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let I = 0; I < X.length; I++) {
      const G = X[I];
      G && F(u(G)) && (ke.add(`pt:${I}`), J++);
    }
    const v = (I, G) => y ? F(I) || F(G) || j(I, G) : F(I) && F(G), A = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], C = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let I = 0; I < A.length; I++) {
      const G = A[I];
      if (C.includes(I)) {
        let de;
        if (!y) de = G.every((ve) => {
          const Je = X[ve];
          return !!Je && F(u(Je));
        });
        else {
          de = false;
          for (let ve = 0; ve < G.length - 1; ve++) {
            const Je = X[G[ve]], Ve = X[G[ve + 1]];
            if (!(!Je || !Ve) && v(u(Je), u(Ve))) {
              de = true;
              break;
            }
          }
        }
        de && (ke.add(`poly:${I}`), J++);
      } else for (let de = 0; de < G.length - 1; de++) {
        const ve = X[G[de]], Je = X[G[de + 1]];
        !ve || !Je || v(u(ve), u(Je)) && (ke.add(`seg:${I}:${de}`), J++);
      }
    }
    const q = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let I = 0; I < q.length; I++) {
      const G = q[I];
      if (!G || G.length !== 6) continue;
      const ce = u([G[0], G[1], G[2]]), de = u([G[3], G[4], G[5]]);
      v(ce, de) && (ke.add(`aux:${I}`), J++);
    }
    At(), oe(J === 0 && !y ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${y ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${J} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${ke.size})`), Tt.style.display = "none";
  }, Dn = () => {
    Bt && (Bt = null, Tt.style.display = "none", oe("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Dn, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Bt && Dn();
  });
  const Io = () => {
    var _a2, _b, _c, _d;
    if (ke.size === 0) return false;
    const e = [...ke], o = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? [], r = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Set();
    for (const j of e) {
      const [J, ...X] = j.split(":");
      if (J === "pt") r.add(+X[0]);
      else if (J === "poly") f.add(+X[0]);
      else if (J === "seg") {
        const v = +X[0], A = +X[1];
        m.has(v) || m.set(v, /* @__PURE__ */ new Set()), m.get(v).add(A);
      } else J === "aux" && y.add(+X[0]);
    }
    let M = 0, S = [], u = [];
    const F = /* @__PURE__ */ new Map();
    for (let j = 0; j < s.length; j++) {
      if (f.has(j)) {
        M++;
        continue;
      }
      F.set(j, S.length);
      const J = m.get(j);
      if (J && J.size > 0) {
        let X = [];
        for (let v = 0; v < s[j].length; v++) X.push(s[j][v]), v < s[j].length - 1 && J.has(v) && (X.length >= 2 && S.push(X), X = [], M++);
        (X.length >= 2 || X.length === 1) && S.push(X);
      } else S.push([...s[j]]);
    }
    if (r.size > 0) {
      const j = [], J = /* @__PURE__ */ new Map();
      for (let v = 0; v < o.length; v++) {
        if (r.has(v)) {
          M++;
          continue;
        }
        J.set(v, j.length), j.push([...o[v]]);
      }
      const X = [];
      for (const v of S) {
        let A = [];
        for (const C of v) {
          const D = J.get(C);
          D === void 0 ? (A.length >= 2 && X.push(A), A = []) : A.push(D);
        }
        A.length >= 2 && X.push(A);
      }
      S = X, t.points.val = j;
    }
    for (const j of n) {
      const J = F.get(j);
      J !== void 0 && J < S.length && u.push(J);
    }
    if (t.polylines && (t.polylines.val = S), t.areas && (t.areas.val = u), y.size > 0 && a) {
      const j = i.filter((J, X) => !y.has(X));
      "val" in a ? a.val = j : window.__hekatanDrawingAuxLines = j, M += y.size;
    }
    ke.clear(), At();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return oe(`\u{1F5D1} ${M} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Io, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || ke.size !== 0 && (e.preventDefault(), Io());
  });
  const Rt = document.createElement("div");
  Rt.id = "hk-properties-pane";
  const Ro = "hk-props-pane-pos";
  let kn = null;
  try {
    const e = localStorage.getItem(Ro);
    e && (kn = JSON.parse(e));
  } catch {
  }
  Rt.style.cssText = ["position:fixed", kn ? `left:${kn.left}px` : "left:14px", kn ? `top:${kn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Rt);
  const zs = () => {
    const e = Rt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, i = 0;
    e.addEventListener("mousedown", (r) => {
      o = true, s = r.clientX, n = r.clientY;
      const f = Rt.getBoundingClientRect();
      a = f.left, i = f.top, Rt.style.transform = "none", Rt.style.left = `${a}px`, Rt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const f = r.clientX - s, m = r.clientY - n, y = Math.max(0, Math.min(window.innerWidth - 80, a + f)), M = Math.max(0, Math.min(window.innerHeight - 40, i + m));
      Rt.style.left = `${y}px`, Rt.style.top = `${M}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Ro, JSON.stringify({ left: parseFloat(Rt.style.left), top: parseFloat(Rt.style.top) }));
        } catch {
        }
      }
    });
  }, te = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Et = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let lt = null;
  const Mt = (e, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: o, prop: s, value: n } }));
  }, Fs = () => {
    if (lt && (lt.dispose(), lt = null), ke.size === 0) {
      Rt.style.display = "none";
      return;
    }
    const e = [...ke], o = e.filter((S) => S.startsWith("pt:")), s = e.filter((S) => S.startsWith("seg:")), n = e.filter((S) => S.startsWith("poly:")), a = e.filter((S) => S.startsWith("aux:")), i = o.length > 0, r = s.length > 0, f = n.length > 0, m = !i && !r && !f, y = [];
    o.length && y.push(`\u{1F535} ${o.length} nodo(s)`), s.length && y.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && y.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && y.push(`\u250A ${a.length} aux`);
    const M = `\u{1F3AF} ${ke.size} item(s) \u2014 ${y.join(", ")}`;
    lt = new gs({ container: Rt, title: M });
    {
      const S = lt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      S.addBinding(Et, "dx", { label: "\u0394x (m)", step: 0.1 }), S.addBinding(Et, "dy", { label: "\u0394y (m)", step: 0.1 }), S.addBinding(Et, "dz", { label: "\u0394z (m)", step: 0.1 }), S.addBinding(Et, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), S.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const F = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Et.dx, Et.dy, Et.dz, Et.copias);
        oe(F ? `\u29C9 Replicado \xD7${F} (\u0394 ${Et.dx},${Et.dy},${Et.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), S.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const F = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Et.dx, Et.dy, Et.dz, 1);
        oe(F ? `\u2192 Copia desplazada \u0394 ${Et.dx},${Et.dy},${Et.dz} m` : "\u26A0 Nada seleccionado");
      });
      const u = S.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      u.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), u.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), oe(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const S = lt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      S.addBinding(te, "Ux"), S.addBinding(te, "Uy"), S.addBinding(te, "Uz"), S.addBinding(te, "Rx"), S.addBinding(te, "Ry"), S.addBinding(te, "Rz");
      const u = lt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      u.addBinding(te, "Kx", { label: "Kx", min: 0, step: 100 }), u.addBinding(te, "Ky", { label: "Ky", min: 0, step: 100 }), u.addBinding(te, "Kz", { label: "Kz", min: 0, step: 100 }), u.addBinding(te, "Krx", { label: "Krx", min: 0, step: 1e3 }), u.addBinding(te, "Kry", { label: "Kry", min: 0, step: 1e3 }), u.addBinding(te, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const F = lt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      F.addBinding(te, "Fx", { step: 0.1 }), F.addBinding(te, "Fy", { step: 0.1 }), F.addBinding(te, "Fz", { step: 0.1 }), F.addBinding(te, "Mx", { step: 0.1 }), F.addBinding(te, "My", { step: 0.1 }), F.addBinding(te, "Mz", { step: 0.1 }), lt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(te, "mass", { label: "m", min: 0, step: 1 }), lt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(te, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), lt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let X = 0;
        const v = [te.Ux, te.Uy, te.Uz, te.Rx, te.Ry, te.Rz];
        v.some((D) => D) && (Mt("nodes", o, "supports", v), X++);
        const A = [te.Fx, te.Fy, te.Fz, te.Mx, te.My, te.Mz];
        A.some((D) => D !== 0) && (Mt("nodes", o, "loads", A), X++);
        const C = [te.Kx, te.Ky, te.Kz, te.Krx, te.Kry, te.Krz];
        if (C.some((D) => D !== 0) && (Mt("nodes", o, "springs", C), X++), te.mass !== 0 && (Mt("nodes", o, "mass", te.mass), X++), te.diaphragm !== "Ninguno" && (Mt("nodes", o, "diaphragm", te.diaphragm), X++), X === 0) {
          oe("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let D = document.getElementById("hk-prop-toast");
          D || (D = document.createElement("div"), D.id = "hk-prop-toast", D.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(D)), D.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", D.style.background = "rgba(217,119,6,0.97)", D.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            D && (D.style.opacity = "0");
          }, 3200);
        } else oe(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const S = lt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      S.addBinding(te, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), S.addBinding(te, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const u = lt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      u.addBinding(te, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), u.addBinding(te, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), u.addBinding(te, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), u.addBinding(te, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), lt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(te, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), lt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(te, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const J = lt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      J.addBinding(te, "relMxI", { label: "Mx I" }), J.addBinding(te, "relMyI", { label: "My I" }), J.addBinding(te, "relMzI", { label: "Mz I" });
      const X = lt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      X.addBinding(te, "relMxJ", { label: "Mx J" }), X.addBinding(te, "relMyJ", { label: "My J" }), X.addBinding(te, "relMzJ", { label: "Mz J" }), lt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(te, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const A = lt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      A.addBinding(te, "LKx", { label: "LKx", min: 0, step: 100 }), A.addBinding(te, "LKy", { label: "LKy", min: 0, step: 100 }), A.addBinding(te, "LKz", { label: "LKz", min: 0, step: 100 });
      const C = lt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      C.addBinding(te, "qx", { step: 0.1 }), C.addBinding(te, "qy", { step: 0.1 }), C.addBinding(te, "qz", { step: 0.1 }), lt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(te, "massPerM", { label: "m/L", min: 0, step: 1 }), lt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Mt("segs", s, "section", te.section), Mt("segs", s, "material", te.material_frame);
        const q = { A: te.A_mod, Iz: te.Iz_mod, Iy: te.Iy_mod, J: te.J_mod };
        (q.A !== 1 || q.Iz !== 1 || q.Iy !== 1 || q.J !== 1) && Mt("segs", s, "modifiers", q), te.insertionPoint !== "10 \u2014 Centroid" && Mt("segs", s, "insertionPoint", te.insertionPoint), te.beta !== 0 && Mt("segs", s, "beta", te.beta);
        const I = [te.relMxI, te.relMyI, te.relMzI], G = [te.relMxJ, te.relMyJ, te.relMzJ];
        (I.some((ve) => ve) || G.some((ve) => ve)) && Mt("segs", s, "releases", { i: I, j: G }), te.hinges !== "None" && Mt("segs", s, "hinges", te.hinges);
        const ce = [te.LKx, te.LKy, te.LKz];
        ce.some((ve) => ve !== 0) && Mt("segs", s, "lineSprings", ce);
        const de = [te.qx, te.qy, te.qz];
        de.some((ve) => ve !== 0) && Mt("segs", s, "distLoad", de), te.massPerM !== 0 && Mt("segs", s, "massPerM", te.massPerM), oe(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (f) {
      const S = lt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      S.addBinding(te, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), S.addBinding(te, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), S.addBinding(te, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), lt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(te, "surfLoad", { label: "q", step: 0.1 }), lt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Mt("areas", n, "shellType", te.shellType), Mt("areas", n, "thickness", te.thickness), Mt("areas", n, "material", te.material_shell), te.surfLoad !== 0 && Mt("areas", n, "surfLoad", te.surfLoad), oe(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (m) {
      const S = lt.addFolder({ title: "\u2139 Selecci\xF3n" }), u = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      S.addBinding(u, "msg", { readonly: true, label: "" });
    }
    lt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      ke.clear(), At();
    }), Rt.style.display = "block", zs();
  };
  window.__hekatanRefreshPropsPane = Fs;
  let hn = null, Bn = false;
  g.addEventListener("pointerdown", (e) => {
    e.button === 2 && (hn = { x: e.clientX, y: e.clientY }, Bn = false);
  }), g.addEventListener("pointermove", (e) => {
    if (hn && e.buttons & 2 && !Bn) {
      const o = e.clientX - hn.x, s = e.clientY - hn.y;
      Math.hypot(o, s) > 8 && (Bn = true);
    }
  }), g.addEventListener("pointerup", (e) => {
    var _a2, _b, _c;
    if (e.button === 2) {
      const o = hn !== null && !Bn;
      hn = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Bt ? Dn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), ke.size > 0 && (ke.clear(), At()), t.polylines) {
          const i = t.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (t.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), oe(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : oe("\u238B Cancelado (click derecho)");
      }
    }
  }), g.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), g.addEventListener("pointerdown", (e) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (Kt = null, Sn = false));
  }), g.addEventListener("pointermove", (e) => {
    if (Bt && e.buttons === 0) {
      const i = e.clientX < Bt.x;
      ro(Bt.x, Bt.y, e.clientX, e.clientY, i);
      return;
    }
    if (!Kt) return;
    const o = e.clientX - Kt.x, s = e.clientY - Kt.y, n = Math.hypot(o, s);
    if (!Sn && n < 8) return;
    Sn = true;
    const a = e.clientX < Kt.x;
    ro(Kt.x, Kt.y, e.clientX, e.clientY, a);
  }), g.addEventListener("pointerup", (e) => {
    if (!Kt) return;
    if (!Sn) {
      Kt = null;
      return;
    }
    const o = e.ctrlKey || e.metaKey || e.shiftKey;
    Lo(Kt.x, Kt.y, e.clientX, e.clientY, o), Kt = null, Sn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Zt = new tt();
  Zt.visible = false, Zt.frustumCulled = false, d.add(Zt);
  const Do = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, Bo = (e, o, s, n) => {
    var _a2, _b, _c, _d;
    for (; Zt.children.length; ) {
      const r = Zt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Do[e] ?? 16777215, i = new Me().setFromPoints([new _(-1, -1, 0), new _(1, -1, 0), new _(1, -1, 0), new _(1, 1, 0), new _(1, 1, 0), new _(-1, 1, 0), new _(-1, 1, 0), new _(-1, -1, 0)]);
    Zt.add(new Ht(i, new ut({ color: a, linewidth: 2 }))), Zt.position.set(o, s, n), Zt.visible = true, po();
  };
  let co = 4;
  const po = () => {
    Zt.visible && Zt.scale.setScalar(co * Rn(Zt.position));
  };
  window.__hekatanOsnapMarkerRef = Zt, window.__hekatanUpdateOsnapScale = po, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (co = e, po(), x()), co);
  const Xn = () => {
    Zt.visible = false;
  }, As = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Wt = document.createElement("div");
  Wt.id = "hk-osnap-etiqueta", Wt.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Wt);
  const Xo = (e, o, s) => {
    const n = As[e];
    if (!n) {
      Wt.style.display = "none";
      return;
    }
    Wt.textContent = n, Wt.style.color = "#" + (Do[e] ?? 16777215).toString(16).padStart(6, "0"), Wt.style.left = o + 18 + "px", Wt.style.top = s - 26 + "px", Wt.style.display = "block";
  }, Es = () => {
    Wt.style.display = "none";
  }, Pn = new _(), uo = (e, o, s) => {
    const n = h();
    if (!n) return null;
    const a = g.getBoundingClientRect();
    return Pn.set(e, o, s).project(n), !isFinite(Pn.x) || !isFinite(Pn.y) ? null : { x: a.left + (Pn.x * 0.5 + 0.5) * a.width, y: a.top + (-Pn.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = uo;
  const Vs = (e, o, s, n, a) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, r = t.points.rawVal, f = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let m = null;
    const y = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, M = a, S = (v, A, C, D) => {
      let q;
      if (M) {
        const G = uo(A, C, D);
        if (!G || (q = Math.hypot(G.x - M.x, G.y - M.y), q > _n)) return;
      } else if (q = Math.hypot(A - e, C - o, D - s), q > n) return;
      const I = y[v] ?? 9;
      (!m || I < m.r || I === m.r && q < m.d) && (m = { type: v, x: A, y: C, z: D, d: q, r: I });
    };
    if (i.ori !== false && S("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const v = window.__hekatanGridConfig, A = (v == null ? void 0 : v.minorStep) && v.minorStep > 0 ? v.minorStep : 1, C = ((v == null ? void 0 : v.gridSize) ?? 30) / 2, D = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", q = (G) => Math.round(G / A) * A, I = (G, ce) => Math.abs(G) <= C + 1e-9 && Math.abs(ce) <= C + 1e-9;
      if (D === "xz") {
        const G = q(e), ce = q(s);
        I(G, ce) && S("grid", G, o, ce);
      } else if (D === "yz") {
        const G = q(o), ce = q(s);
        I(G, ce) && S("grid", e, G, ce);
      } else {
        const G = q(e), ce = q(o);
        I(G, ce) && S("grid", G, ce, s);
      }
    }
    (i.node || i.end) && r.forEach((v) => {
      i.node && S("node", v[0], v[1], v[2]);
    });
    for (const v of f) if (!(v.length < 2)) for (let A = 0; A < v.length - 1; A++) {
      const C = r[v[A]], D = r[v[A + 1]];
      if (!(!C || !D) && (i.end && (S("end", C[0], C[1], C[2]), S("end", D[0], D[1], D[2])), i.mid && S("mid", (C[0] + D[0]) / 2, (C[1] + D[1]) / 2, (C[2] + D[2]) / 2), i.nea || i.per)) {
        const q = D[0] - C[0], I = D[1] - C[1], G = D[2] - C[2], ce = q * q + I * I + G * G;
        if (ce < 1e-12) continue;
        const de = Math.max(0, Math.min(1, ((e - C[0]) * q + (o - C[1]) * I + (s - C[2]) * G) / ce)), ve = C[0] + de * q, Je = C[1] + de * I, Ve = C[2] + de * G;
        i.nea && S("nea", ve, Je, Ve), i.per && S("per", ve, Je, Ve);
      }
    }
    if (i.cen) {
      const v = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const A of v) {
        const C = f[A];
        if (!C || C.length < 3) continue;
        const D = C[0] === C[C.length - 1] ? C.slice(0, -1) : C;
        let q = 0, I = 0, G = 0, ce = 0;
        for (const de of D) {
          const ve = r[de];
          ve && (q += ve[0], I += ve[1], G += ve[2], ce++);
        }
        ce >= 3 && S("cen", q / ce, I / ce, G / ce);
      }
    }
    if (i.cen) {
      const v = vn(), A = [...on];
      for (const C of v) A.some((D) => Math.hypot(D.c[0] - C.c[0], D.c[1] - C.c[1], D.c[2] - C.c[2]) < 1e-6 && Math.abs(D.r - C.r) < 1e-6) || A.push(C);
      for (const C of A) {
        if (!r.some((I) => Math.abs(Math.hypot(I[0] - C.c[0], I[1] - C.c[1], I[2] - C.c[2]) - C.r) < 1e-6)) continue;
        const q = Math.hypot(e - C.c[0], o - C.c[1], s - C.c[2]);
        if (q < n || Math.abs(q - C.r) < n) {
          const I = Math.min(q, n * 0.5), G = 3;
          (!m || G < m.r || G === m.r && I < m.d) && (m = { type: "cen", x: C.c[0], y: C.c[1], z: C.c[2], d: I, r: G });
        }
      }
    }
    if (i.int) {
      const v = [];
      for (const A of f) for (let C = 0; C < A.length - 1; C++) {
        const D = r[A[C]], q = r[A[C + 1]];
        if (!D || !q) continue;
        const I = q[0] - D[0], G = q[1] - D[1], ce = q[2] - D[2], de = I * I + G * G + ce * ce;
        if (de < 1e-12) continue;
        const ve = Math.max(0, Math.min(1, ((e - D[0]) * I + (o - D[1]) * G + (s - D[2]) * ce) / de));
        Math.hypot(D[0] + ve * I - e, D[1] + ve * G - o, D[2] + ve * ce - s) < 3 * n && v.push([D, q]);
      }
      for (let A = 0; A < v.length; A++) for (let C = A + 1; C < v.length; C++) {
        const [D, q] = v[A], [I, G] = v[C], ce = [q[0] - D[0], q[1] - D[1], q[2] - D[2]], de = [G[0] - I[0], G[1] - I[1], G[2] - I[2]], ve = [D[0] - I[0], D[1] - I[1], D[2] - I[2]], Je = ce[0] * ce[0] + ce[1] * ce[1] + ce[2] * ce[2], Ve = ce[0] * de[0] + ce[1] * de[1] + ce[2] * de[2], je = de[0] * de[0] + de[1] * de[1] + de[2] * de[2], et = ce[0] * ve[0] + ce[1] * ve[1] + ce[2] * ve[2], dt = de[0] * ve[0] + de[1] * ve[1] + de[2] * ve[2], Ue = Je * je - Ve * Ve;
        if (Ue < 1e-12) continue;
        const Fe = (Ve * dt - je * et) / Ue, We = (Je * dt - Ve * et) / Ue;
        if (Fe < -1e-6 || Fe > 1 + 1e-6 || We < -1e-6 || We > 1 + 1e-6) continue;
        const Te = [D[0] + Fe * ce[0], D[1] + Fe * ce[1], D[2] + Fe * ce[2]], xe = [I[0] + We * de[0], I[1] + We * de[1], I[2] + We * de[2]];
        if (Math.hypot(Te[0] - xe[0], Te[1] - xe[1], Te[2] - xe[2]) > 1e-4) continue;
        [D, q, I, G].some((qe) => Math.hypot(qe[0] - Te[0], qe[1] - Te[1], qe[2] - Te[2]) < 1e-6) || S("int", Te[0], Te[1], Te[2]);
      }
    }
    const u = window.__hekatanAxisGrids ?? [], F = window.__hekatanLevels ?? [], j = u.filter((v) => v && v.start && v.end).map((v) => [v.start, v.end]);
    for (const [v, A] of j) {
      i.end && (S("end", v[0], v[1], v[2]), S("end", A[0], A[1], A[2]));
      const C = A[0] - v[0], D = A[1] - v[1], q = A[2] - v[2], I = C * C + D * D + q * q;
      if (I < 1e-12) continue;
      const G = Math.max(0, Math.min(1, ((e - v[0]) * C + (o - v[1]) * D + (s - v[2]) * q) / I));
      if (i.nea && S("nea", v[0] + G * C, v[1] + G * D, v[2] + G * q), i.int && Math.abs(q) > 1e-9) for (const ce of F) {
        const de = (ce.z - v[2]) / q;
        de < -1e-6 || de > 1 + 1e-6 || S("int", v[0] + de * C, v[1] + de * D, ce.z);
      }
    }
    if (i.int || i.node) for (let v = 0; v < j.length; v++) for (let A = v + 1; A < j.length; A++) {
      const [C, D] = j[v], [q, I] = j[A], G = D[0] - C[0], ce = D[1] - C[1], de = I[0] - q[0], ve = I[1] - q[1], Je = G * ve - ce * de;
      if (Math.abs(Je) < 1e-12) continue;
      const Ve = C[0] - q[0], je = C[1] - q[1], et = (de * je - ve * Ve) / Je, dt = (G * je - ce * Ve) / Je;
      if (et < -1e-6 || et > 1 + 1e-6 || dt < -1e-6 || dt > 1 + 1e-6) continue;
      const Ue = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      S("int", C[0] + et * G, C[1] + et * ce, typeof Ue == "number" ? Ue : s);
    }
    const J = window.__hekatanDrawingAuxLines, X = (J == null ? void 0 : J.rawVal) ?? (J == null ? void 0 : J.val) ?? J ?? [];
    for (const v of X) {
      if (v.length !== 6) continue;
      const A = [v[0], v[1], v[2]], C = [v[3], v[4], v[5]];
      if (i.end && (S("end", A[0], A[1], A[2]), S("end", C[0], C[1], C[2])), i.mid && S("mid", (A[0] + C[0]) / 2, (A[1] + C[1]) / 2, (A[2] + C[2]) / 2), i.nea || i.per) {
        const D = C[0] - A[0], q = C[1] - A[1], I = C[2] - A[2], G = D * D + q * q + I * I;
        if (G < 1e-12) continue;
        const ce = Math.max(0, Math.min(1, ((e - A[0]) * D + (o - A[1]) * q + (s - A[2]) * I) / G)), de = A[0] + ce * D, ve = A[1] + ce * q, Je = A[2] + ce * I;
        i.nea && S("nea", de, ve, Je), i.per && S("per", de, ve, Je);
      }
    }
    return m ? { type: m.type, x: m.x, y: m.y, z: m.z } : null;
  }, mn = new tt();
  mn.frustumCulled = false, d.add(mn);
  const Yo = new ut({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let No = 0;
  const Uo = () => {
    var _a2, _b;
    for (const e of mn.children.slice()) mn.remove(e), (_b = (_a2 = e.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (e) => {
    var _a2, _b;
    Uo();
    const o = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const a of e || []) {
      const i = String(a).split(":");
      let r = [];
      if (i[0] === "pt") {
        const y = o[+i[1]];
        y && (r = [y, [y[0] + 1e-3, y[1], y[2]]]);
      } else if (i[0] === "seg") {
        const y = s[+i[1]] || [], M = o[y[+i[2]]], S = o[y[+i[2] + 1]];
        M && S && (r = [M, S]);
      } else i[0] === "poly" && (r = (s[+i[1]] || []).map((M) => o[M]).filter(Boolean));
      if (r.length < 2) continue;
      const f = new Me().setFromPoints(r.map((y) => new _(y[0], y[1], y[2]))), m = new St(f, Yo);
      m.renderOrder = 1200, mn.add(m);
    }
    if (!mn.children.length) return;
    No = performance.now() + 900;
    const n = () => {
      const a = No - performance.now();
      if (a <= 0) {
        Uo(), x();
        return;
      }
      Yo.opacity = Math.min(1, a / 900) * 0.95, x(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a2;
    const o = (_a2 = e == null ? void 0 : e.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Vs, window.__hekatanOsnapShow = Bo, window.__hekatanOsnapHide = Xn;
  let $e = [], xt = 0, an = 0, _t = null;
  const Cn = document.createElement("div");
  Cn.id = "hk-cad-status", Cn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", Cn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(Cn);
  const Ts = () => {
    var _a2, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), at && e.push(`\u{1F512} LOCK ${at.toUpperCase()}`);
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && e.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, oe = (e) => {
    var _a2;
    const o = e + Ts();
    Cn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, e);
    } catch {
    }
  }, $s = "Comando:", Ls = () => {
    var _a2, _b, _c, _d;
    const e = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = $e.length, a = (i, r = []) => ({ txt: i, ops: r });
    switch (e) {
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
        return a(`COLUMNA Precise punto de inserci\xF3n (altura ${xt > 0 ? xt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return a(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${xt > 0 ? xt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return a(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return a("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return a("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return a(_t ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return a(_t ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return a(_t ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${an > 0 ? ` (distancia ${an} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return ke.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return ke.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return ke.size ? a(`SELECCI\xD3N ${ke.size} objeto${ke.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a($s);
    }
  }, Xt = () => {
    var _a2, _b, _c, _d, _e2;
    try {
      const e = Ls(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !o && !s ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, a, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Xt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", o = e.split("   |   ")[0] ?? e;
    oe(o);
  }, window.__hekatanCadResetPending = () => {
    $e = [], we = [], O.visible = false, fo(), _t = null, x(), oe("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Xt();
  };
  function fo() {
    if (!t.polylines) return;
    const e = t.polylines.rawVal.filter((o) => o.length >= 2);
    t.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = fo;
  const wn = [], Yn = [], ho = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, Zo = (e) => {
    var _a2;
    t.points.val = e.p, t.polylines && (t.polylines.val = e.l), t.areas && (t.areas.val = e.a), $e = [], ue.visible = false, ht.visible = false, Y();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x(), Xt();
  }, Yt = () => {
    wn.push(ho()), wn.length > 100 && wn.shift(), Yn.length = 0;
  }, Nn = () => {
    const e = wn.pop();
    if (!e) {
      oe("\u21B6 Nada para deshacer");
      return;
    }
    Yn.push(ho()), Zo(e), oe(`\u21B6 Deshacer \u2014 quedan ${wn.length}`);
  }, qo = () => {
    const e = Yn.pop();
    if (!e) {
      oe("\u21B7 Nada para rehacer");
      return;
    }
    wn.push(ho()), Zo(e), oe(`\u21B7 Rehacer \u2014 quedan ${Yn.length}`);
  };
  window.__hekatanPushUndo = Yt, window.__hekatanUndo = Nn, window.__hekatanRedo = qo, document.addEventListener("keydown", (e) => {
    var _a2;
    const o = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (o === "y" || o === "z" && e.shiftKey))) return;
    const n = e.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (e.preventDefault(), e.stopPropagation(), qo());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a2, _b, _c, _d, _e2;
    const o = e.trim().toLowerCase(), s = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!t.polylines) return false;
    const n = t.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
    if (s !== "line" && s !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Nn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (a.length < 3) return oe("Cerrar necesita al menos tres puntos."), true;
      Yt(), t.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return mo(), oe(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Nn(), true;
      Yt();
      const i = a[a.length - 1], r = a.slice(0, -1), f = n.some((M, S) => S !== n.length - 1 && M.includes(i)) || r.includes(i);
      let m = t.points.rawVal, y = [...n.slice(0, -1), r];
      if (!f && i === m.length - 1 && (m = m.slice(0, -1), t.points.val = m), t.polylines.val = y, r.length) {
        const M = m[r[r.length - 1]];
        M && (B = [M[0], M[1], M[2]]);
      } else B = null, ue.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return x(), oe(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Xt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (e) => {
    var _a2;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
      const o = e.target, s = o == null ? void 0 : o.tagName;
      if ((s === "INPUT" || s === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      e.preventDefault(), e.stopPropagation(), Nn();
    }
  }, { capture: true });
  const mo = () => {
    $e = [], _t = null, fo(), at = null, Ae(), ue.visible = false, ht.visible = false, Y(), oe("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), x(), Xt();
  };
  window.__hekatanFinalizeDraw = mo;
  const Ko = () => {
    var _a2, _b, _c;
    $e = [], we = [], O.visible = false;
    let e = false;
    ke.size && (ke.clear(), At(), e = true), mo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    oe(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), x(), Xt();
  };
  window.__hekatanEscapeCancel = Ko;
  const Go = () => {
    var _a2;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return ke.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (e[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = e[+n[1]] || [], i = a[+n[2]], r = a[+n[2] + 1];
        i != null && o.add(i), r != null && o.add(r);
      }
    }), o;
  }, Ho = (e, o, s) => {
    var _a2;
    const n = Go();
    if (!n.size) return 0;
    Yt();
    const a = t.points.rawVal.map((i, r) => n.has(r) ? [i[0] + e, i[1] + o, i[2] + s] : i);
    t.points.val = a;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return At(), x(), n.size;
  };
  window.__hekatanMoveSelection = Ho;
  const Wo = (e, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!ke.size) {
      oe(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Xt();
      return;
    }
    if ($e.push(o), $e.length === 1) {
      B = o, oe(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Xt();
      return;
    }
    const [s, n] = $e, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    $e = [], ue.visible = false;
    let i = 0;
    e === "move" ? i = Ho(a[0], a[1], a[2]) : (i = Go().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), oe(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), e === "move" && (ke.clear(), At()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Xt();
  };
  window.__hekatanPasoMoverCopiar = Wo;
  const Is = () => {
    var _a2, _b, _c;
    const e = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Qt = (e, o) => Math.hypot(e[0] - o[0], e[1] - o[1], e[2] - o[2]), wo = (e, o, s, n, a, i) => {
    const r = [o[0] - e[0], o[1] - e[1], o[2] - e[2]], f = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], m = [e[0] - s[0], e[1] - s[1], e[2] - s[2]], y = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], M = r[0] * f[0] + r[1] * f[1] + r[2] * f[2], S = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], u = r[0] * m[0] + r[1] * m[1] + r[2] * m[2], F = f[0] * m[0] + f[1] * m[1] + f[2] * m[2], j = y * S - M * M;
    if (j < 1e-12) return null;
    const J = (M * F - S * u) / j, X = (y * F - M * u) / j;
    if (!a && (J < -1e-6 || J > 1 + 1e-6) || !i && (X < -1e-6 || X > 1 + 1e-6)) return null;
    const v = [e[0] + J * r[0], e[1] + J * r[1], e[2] + J * r[2]], A = [s[0] + X * f[0], s[1] + X * f[1], s[2] + X * f[2]];
    return Qt(v, A) > 1e-4 ? null : v;
  }, Rs = (e) => {
    var _a2;
    return (((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === e).length, 0);
  }, Ds = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Bs = (e, o) => {
    var _a2, _b;
    if (!t.polylines) return;
    const s = t.polylines.rawVal, n = t.points.rawVal, a = Ds[e];
    if (!_t) {
      if (De < 0) {
        oe(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      _t = { poly: De, seg: Math.max(0, Ge) }, oe(e === "offset" ? `DESFASE l\xEDnea #${_t.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${an > 0 ? ` (${an} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Xt();
      return;
    }
    if (e === "offset") {
      const J = _t.poly, X = s[J];
      if (!X || X.length < 2) {
        _t = null, oe("DESFASE: esa polil\xEDnea no tiene tramos."), Xt();
        return;
      }
      const v = X.length > 2 && X[0] === X[X.length - 1], A = Is(), C = [];
      for (let Fe = 0; Fe < X.length - 1; Fe++) {
        const We = n[X[Fe]], Te = n[X[Fe + 1]], xe = [Te[0] - We[0], Te[1] - We[1], Te[2] - We[2]], Ee = Math.hypot(xe[0], xe[1], xe[2]) || 1, qe = xe[0] / Ee, $t = xe[1] / Ee, Dt = xe[2] / Ee, Lt = [A[1] * Dt - A[2] * $t, A[2] * qe - A[0] * Dt, A[0] * $t - A[1] * qe], Ot = Math.hypot(Lt[0], Lt[1], Lt[2]) || 1;
        C.push({ a: We, b: Te, n: [Lt[0] / Ot, Lt[1] / Ot, Lt[2] / Ot] });
      }
      let D = 0, q = 1 / 0;
      C.forEach((Fe, We) => {
        const Te = tn(o[0], o[1], o[2], Fe.a[0], Fe.a[1], Fe.a[2], Fe.b[0], Fe.b[1], Fe.b[2]);
        Te < q && (q = Te, D = We);
      });
      const I = C[D], G = Math.sign((o[0] - I.a[0]) * I.n[0] + (o[1] - I.a[1]) * I.n[1] + (o[2] - I.a[2]) * I.n[2]) || 1, ce = an > 0 ? an : q;
      if (ce < 1e-6) {
        oe("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const de = C.map((Fe) => ({ a: [Fe.a[0] + G * ce * Fe.n[0], Fe.a[1] + G * ce * Fe.n[1], Fe.a[2] + G * ce * Fe.n[2]], b: [Fe.b[0] + G * ce * Fe.n[0], Fe.b[1] + G * ce * Fe.n[1], Fe.b[2] + G * ce * Fe.n[2]] })), ve = de.length, Je = (Fe) => {
        const We = de[(Fe - 1 + ve) % ve], Te = de[Fe % ve];
        return wo(We.a, We.b, Te.a, Te.b, true, true) ?? Te.a;
      }, Ve = [], je = v ? ve : ve + 1;
      for (let Fe = 0; Fe < je; Fe++) !v && Fe === 0 ? Ve.push(de[0].a) : !v && Fe === ve ? Ve.push(de[ve - 1].b) : Ve.push(Je(Fe));
      Yt();
      const et = n.length;
      t.points.val = [...n, ...Ve];
      const dt = Ve.map((Fe, We) => et + We);
      v && dt.push(et);
      let Ue = s.slice();
      Ue.length && Ue[Ue.length - 1].length === 0 && (Ue = Ue.slice(0, -1)), t.polylines.val = [...Ue, dt, []], _t = null, oe(`\u2713 Desfase a ${ce.toFixed(2)} m \u2014 ${ve} tramo${ve === 1 ? "" : "s"} nuevo${ve === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      x(), Xt();
      return;
    }
    let i = De, r = Math.max(0, Ge);
    if (i < 0 || i === _t.poly && r === _t.seg) {
      let X = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, s.forEach((v, A) => {
        for (let C = 0; C < v.length - 1; C++) {
          if (A === _t.poly && C === _t.seg) continue;
          const D = n[v[C]], q = n[v[C + 1]];
          if (!D || !q) continue;
          const I = tn(o[0], o[1], o[2], D[0], D[1], D[2], q[0], q[1], q[2]);
          I < X && (X = I, i = A, r = C);
        }
      }), i < 0) {
        oe(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const f = s[_t.poly], m = n[f[_t.seg]], y = n[f[_t.seg + 1]], M = s[i], S = M[r], u = M[r + 1];
    if (!m || !y || S == null || u == null) {
      oe(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const F = n[S], j = n[u];
    if (e === "trim") {
      const J = wo(F, j, m, y, false, false);
      if (!J) {
        oe("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Yt();
      const X = n.length;
      t.points.val = [...n, J];
      const v = [...M.slice(0, r + 1), X, ...M.slice(r + 1)];
      t.polylines.val = s.map((C, D) => D === i ? v : C);
      const A = Qt(o, F) < Qt(o, j);
      $n(i, A ? r : r + 1), oe(`\u2713 Recortado en (${J[0].toFixed(2)}, ${J[1].toFixed(2)}, ${J[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const J = wo(F, j, m, y, true, false);
      if (!J) {
        oe("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const v = Qt(o, F) < Qt(o, j) ? r : r + 1;
      if (v !== 0 && v !== M.length - 1) {
        oe("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const A = M[v];
      if (Qt(J, F) + Qt(J, j) < Qt(F, j) + 1e-6) {
        oe("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Yt(), Rs(A) > 1) {
        const D = n.length;
        t.points.val = [...n, J];
        const q = M.slice();
        q[v] = D, t.polylines.val = s.map((I, G) => G === i ? q : I);
      } else t.points.val = n.map((D, q) => q === A ? J : D);
      oe(`\u2713 Alargada hasta (${J[0].toFixed(2)}, ${J[1].toFixed(2)}, ${J[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    x(), Xt();
  };
  window.__hekatanSelectionSize = () => ke.size, window.__hekatanSelectLast = () => {
    var _a2;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = e.length - 1;
    for (; o >= 0 && (!e[o] || e[o].length < 2); ) o--;
    return ke.clear(), o >= 0 && ke.add(`poly:${o}`), At(), oe(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), ke.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    ke.clear();
    const s = /* @__PURE__ */ new Set();
    return e.forEach((n, a) => {
      !n || n.length < 2 || (ke.add(`poly:${a}`), n.forEach((i) => s.add(i)));
    }), o.forEach((n, a) => {
      s.has(a) || ke.add(`pt:${a}`);
    }), At(), oe(`SELECCI\xD3N ${ke.size} objetos (todo el modelo) \xB7 Esc suelta`), ke.size;
  }, window.__hekatanReplicateSelection = (e, o, s, n, a = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const i = [...ke], r = t.points.rawVal, f = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), y = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), S = [];
    if (i.forEach((X) => {
      if (X.startsWith("pt:")) {
        const v = +X.slice(3);
        r[v] && y.add(v);
      } else if (X.startsWith("poly:")) {
        const v = +X.slice(5);
        if (!f[v] || f[v].length < 2) return;
        M.add(v), f[v].forEach((A) => y.add(A));
      } else if (X.startsWith("seg:")) {
        const v = X.split(":"), A = +v[1], C = +v[2], D = f[A] || [], q = D[C], I = D[C + 1];
        q != null && I != null && (S.push([q, I]), y.add(q), y.add(I));
      }
    }), !y.size) return 0;
    Yt();
    const u = [...r];
    let F = f.slice();
    F.length && F[F.length - 1].length === 0 && (F = F.slice(0, -1));
    const j = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], J = [...y];
    for (let X = 1; X <= n; X++) {
      const v = a + X, A = e * v, C = o * v, D = s * v, q = /* @__PURE__ */ new Map();
      J.forEach((I) => {
        q.set(I, u.length), u.push([r[I][0] + A, r[I][1] + C, r[I][2] + D]);
      }), M.forEach((I) => {
        const G = f[I].map((de) => q.has(de) ? q.get(de) : de), ce = F.length;
        F.push(G), m.has(I) && j.push(ce);
      }), S.forEach(([I, G]) => {
        F.push([q.get(I), q.get(G)]);
      });
    }
    F.push([]), t.points.val = u, t.polylines && (t.polylines.val = F), t.areas && (t.areas.val = j);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return x(), n;
  }, g.addEventListener("click", (e) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, sn > 5) {
      sn = 0;
      return;
    }
    sn = 0;
    const o = b(e);
    if (!o) return;
    k.setFromCamera(z, o);
    const s = ie();
    if (!s.length) return;
    {
      const a = o.position.distanceTo(c.target) || 1, i = s[0].distance ?? o.position.distanceTo(s[0].point), r = s[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(a * 12, 300)) {
        oe("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = s[0].point;
    (e.ctrlKey || e.metaKey) && (n = new _(Math.round(s[0].point.x), Math.round(s[0].point.y), Math.round(s[0].point.z)));
    {
      const a = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = a[a.length - 1] ?? [], r = t.points.rawVal ?? [];
      if (i.length > 0) {
        const f = r[i[i.length - 1]];
        if (f) {
          const m = !!window.__hekatanOrthoMode;
          let y = at;
          if (!y && m) {
            const M = Math.abs(n.x - f[0]), S = Math.abs(n.y - f[1]), u = Math.abs(n.z - f[2]);
            y = M >= S && M >= u ? "x" : S >= u ? "y" : "z";
          }
          y === "x" ? n = new _(n.x, f[1], f[2]) : y === "y" ? n = new _(f[0], n.y, f[2]) : y === "z" && (n = new _(f[0], f[1], n.z));
        }
      }
    }
    if (Ne && Math.abs(e.clientX - Ne.x) <= 3 && Math.abs(e.clientY - Ne.y) <= 3) n = Ne.p.clone();
    else if (Nt) n = Nt.clone(), oe(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const a = io(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: e.clientX, y: e.clientY });
      if (i) n = new _(i.x, i.y, i.z), oe(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0;
        r && f > 0 && (n = new _(Math.round(n.x / f) * f, Math.round(n.y / f) * f, Math.round(n.z / f) * f));
      }
    }
    Jo(n, e);
  });
  const Jo = (e, o) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (Ut) {
        Bt && Dn();
        const { kind: n, a, b: i } = Ut, r = i !== void 0 ? `${n}:${a}:${i}` : `${n}:${a}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || ke.clear(), ke.has(r) ? ke.delete(r) : ke.add(r), At(), oe(`\u2713 Seleccionados ${ke.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), a = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Bt ? (Lo(Bt.x, Bt.y, a, i, n), Bt = null) : n || (Bt = { x: a, y: i }, oe("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), ro(a, i, a + 1, i + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [e.x, e.y, e.z], oe(`\u{1F4CD} Eje \u2014 click 1 OK en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const a = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [e.x, e.y, e.z], a);
      oe(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      Wo(s, [e.x, e.y, e.z]);
      return;
    }
    if (s === "delete") {
      if (wt >= 0) {
        const n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = wt;
        if (i >= 0 && i < a.length) {
          Yt();
          const r = a.slice(0, i).concat(a.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = r : window.__hekatanDrawingAuxLines = r, oe(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), wt = -1, it.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (De >= 0) {
        const n = De, a = Ge;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (nn(n), oe(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : a >= 0 ? ($n(n, a), oe(`\u{1F5D1} Segmento ${a + 1} de polil\xEDnea #${n + 1} borrado`)) : (nn(n), oe(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else oe("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if ($e.push([e.x, e.y, e.z]), $e.length === 1) {
        oe("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, a] = $e, i = Math.hypot(a[0] - n[0], a[1] - n[1], a[2] - n[2]);
      Math.abs(a[0] - n[0]);
      const r = Math.abs(a[1] - n[1]), m = Math.abs(a[2] - n[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", y = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, y, m), oe(`\u2713 C\xEDrculo dibujado en ${m.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${y} segmentos`), $e = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (s === "arc") {
      if ($e.push([e.x, e.y, e.z]), $e.length === 1) {
        oe("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if ($e.length === 2) {
        oe("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, a, i] = $e, r = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, a, i, r), oe(`\u2713 Arco dibujado \u2014 ${r} segmentos`), $e = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (s === "rect") {
      if ($e.push([e.x, e.y, e.z]), $e.length === 1) {
        oe("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = $e;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, a), oe(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), $e = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if ($e.push([e.x, e.y, e.z]), $e.length === 1) {
        oe("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = $e;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, a), oe(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), $e = [];
      return;
    }
    if (s === "polyarea") {
      we.push([e.x, e.y, e.z]), O.geometry.setFromPoints(we.map((n) => new _(n[0], n[1], n[2]))), O.visible = we.length >= 1, oe(`\u25B0 \xC1rea libre \u2014 ${we.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), x();
      return;
    }
    if (s === "plane3") {
      if ($e.push([e.x, e.y, e.z]), $e.length < 3) {
        oe(`\u25E3 Plano inclinado \u2014 punto ${$e.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, a, i] = $e, r = (_o2 = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o2.call(window, n, a, i);
      oe(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), $e = [];
      return;
    }
    if (s === "col") {
      Yt();
      const n = e.z, a = xt && xt > 0 ? xt : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, n], [e.x, e.y, n + a]];
      const i = t.polylines.rawVal, r = t.points.rawVal.length;
      t.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], xt = 0, oe(`\u258C Columna creada \u2014 h=${a.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if ($e.push([e.x, e.y, e.z]), $e.length === 1) {
        oe("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, a] = $e, i = xt && xt > 0 ? xt : 3;
      Yt();
      const r = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [n[0], n[1], n[2]], [a[0], a[1], a[2]], [a[0], a[1], a[2] + i], [n[0], n[1], n[2] + i]];
      const f = t.polylines.rawVal;
      if (f.length - 1, t.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], t.areas) {
        const m = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, m];
      }
      oe(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), $e = [], xt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      Yt();
      const n = xt && xt > 0 ? xt : 3, a = e.z;
      t.points.val = [...t.points.rawVal, [e.x, e.y, a], [e.x, e.y, a + n]];
      const i = t.polylines.rawVal, r = t.points.rawVal.length;
      t.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], xt = 0, oe(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, a = gn(e.x, e.y, e.z, n);
      if (!a) {
        oe("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = t.polylines.rawVal, r = t.points.rawVal, f = i[a.polyIdx], m = r[f[a.segIdx]], y = r[f[a.segIdx + 1]];
      if (!m || !y) {
        oe("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const M = xt && xt > 0 ? xt : 3;
      Yt();
      const S = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [m[0], m[1], m[2]], [y[0], y[1], y[2]], [y[0], y[1], y[2] + M], [m[0], m[1], m[2] + M]];
      const u = t.polylines.rawVal;
      if (t.polylines.val = [...u.slice(0, -1), ...u[u.length - 1].length > 0 ? [u[u.length - 1]] : [], [S, S + 1, S + 2, S + 3, S], []], t.areas) {
        const F = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, F];
      }
      xt = 0, oe(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${M.toFixed(2)}m`);
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
        n.val = [...a, [e.x, e.y, e.z]];
      }
      oe(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if ($e.push([e.x, e.y, e.z]), $e.length === 1) {
        oe("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, a] = $e, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const M = i.rawVal ?? i.val ?? [];
        i.val = [...M, [n[0], n[1], n[2], a[0], a[1], a[2]]];
      }
      const r = a[0] - n[0], f = a[1] - n[1], m = a[2] - n[2], y = Math.sqrt(r * r + f * f + m * m);
      oe(`\u2713 L\xEDnea auxiliar creada \u2014 L=${y.toFixed(2)}m (cyan, no FEM)`), $e = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Bs(s, [e.x, e.y, e.z]);
      return;
    }
    if (s === "chaflan") {
      if ($e.push([e.x, e.y, e.z]), $e.length === 1) {
        oe("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = $e, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, a, i, r, 6);
      const f = Math.abs(a[0] - n[0]).toFixed(1), m = Math.abs(a[1] - n[1]).toFixed(1);
      oe(`\u2713 Losa con chaflanes dibujada \u2014 ${f}\xD7${m}m, r=${i}m, ${r} seg/chafl\xE1n`), $e = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (T = false, Yt(), t.points.val = [...t.points.rawVal, e.toArray()], t.polylines && (t.polylines.val = [...t.polylines.rawVal.slice(0, -1), [...t.polylines.rawVal.length ? t.polylines.rawVal.pop() : [], t.points.rawVal.length - 1]]), t.polylines) {
      const n = t.polylines.rawVal, a = n.length - 1, i = n[a] ?? [];
      if (s === "line" && i.length >= 2) {
        oe(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && i.length === 4) {
        t.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], t.areas && (t.areas.val = [...t.areas.rawVal, a]), oe("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") oe(`\u25CF Nodo creado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
    else if (s === "line") oe("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") oe("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const n = ((_x = t.polylines) == null ? void 0 : _x.rawVal[t.polylines.rawVal.length - 1]) ?? [];
      oe(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  g.addEventListener("click", () => Xt()), g.addEventListener("contextmenu", (e) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && we.length >= 3) {
      e.preventDefault();
      const s = dn();
      oe(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), g.addEventListener("pointermove", (e) => {
    var _a2, _b;
    const o = b(e);
    if (!o) return;
    k.setFromCamera(z, o);
    const s = ie();
    if (be.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (e.ctrlKey || e.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const r = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = r[r.length - 1] ?? [], m = t.points.rawVal ?? [];
        if (f.length > 0) {
          const y = m[f[f.length - 1]];
          if (y) {
            const M = !!window.__hekatanOrthoMode;
            let S = at;
            if (!S && M) {
              const u = Math.abs(n.x - y[0]), F = Math.abs(n.y - y[1]), j = Math.abs(n.z - y[2]);
              S = u >= F && u >= j ? "x" : F >= j ? "y" : "z";
            }
            S === "x" ? n.set(n.x, y[1], y[2]) : S === "y" ? n.set(y[0], n.y, y[2]) : S === "z" && n.set(y[0], y[1], n.z);
          }
        }
      }
      const a = io(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: e.clientX, y: e.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0.5;
        r && f > 0 && (n.x = Math.round(n.x / f) * f, n.y = Math.round(n.y / f) * f, n.z = Math.round(n.z / f) * f);
      }
      be.geometry.setAttribute("position", new bt(n.toArray(), 3));
    }
    x();
  }), g.addEventListener("pointermove", (e) => {
    var _a2;
    const o = b(e);
    if (!o) return;
    k.setFromCamera(z, o);
    let s = false;
    const n = k.intersectObject(ee), a = ie();
    if (n.length && a.length) {
      const i = new _(...t.points.rawVal[n[0].index]), r = new _(...a[0].point), f = i.sub(r), m = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      m.transformDirection(H.matrixWorld), Math.abs(f.dot(m)) < 1e-4 && (s = true);
    }
    be.visible = !s;
  });
  let yo = false, xo;
  g.addEventListener("pointermove", (e) => {
    var _a2;
    if (!sn) return;
    const o = b(e);
    if (!o) return;
    k.setFromCamera(z, o);
    let s = false;
    const n = k.intersectObject(ee), a = ie();
    if (n.length && a.length) {
      const r = new _(...t.points.rawVal[n[0].index]), f = new _(...a[0].point), m = r.sub(f), y = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      y.transformDirection(H.matrixWorld), Math.abs(m.dot(y)) < 1e-4 && (s = true);
    }
    if (s && sn < 5 && (yo = true, c.enabled = false, xo = n[0].index), !yo || sn % 2 !== 0) return;
    const i = [...t.points.rawVal];
    if (xo !== void 0) {
      let r = a[0].point;
      (e.ctrlKey || e.metaKey) && (r = new _(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[xo] = r.toArray();
    }
    t.points.val = i;
  }), g.addEventListener("pointerup", () => {
    c.enabled = true, yo = false;
  }), g.addEventListener("contextmenu", (e) => {
    var _a2;
    const o = b(e);
    if (!o) return;
    k.setFromCamera(z, o);
    let s = false;
    const n = k.intersectObject(ee), a = ie();
    if (n.length && a.length) {
      const f = new _(...t.points.rawVal[n[0].index]), m = new _(...a[0].point), y = f.sub(m), M = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      M.transformDirection(H.matrixWorld), Math.abs(y.dot(M)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const i = [...t.points.rawVal];
    if (i.splice(n[0].index, 1), t.points.val = i, !t.polylines) return;
    const r = t.polylines.rawVal.map((f) => f.filter((m) => m !== n[0].index)).map((f) => f.map((m) => m > n[0].index ? m - 1 : m)).filter((f) => f.length);
    r.push([]), t.polylines.val = r;
  });
}
function Fa(t, l, d) {
  const w = Math.round(14.999999999999998), p = { position: t.position.clone(), quaternion: t.quaternion.clone() }, g = setInterval(k, 1e3 / 30);
  let x = 0;
  function k() {
    x++;
    const z = x / w;
    t.position.lerpVectors(p.position, l.position, z), t.quaternion.slerpQuaternions(p.quaternion, l.quaternion, z), d && d(), x == w && clearInterval(g);
  }
}
function Aa(t, l, d, h) {
  const c = la(d, t.elements, h);
  return W.derive(() => {
    c.visible = l.shellResults.val != "none";
  }), c;
}
const Ea = 6, Co = 10, Va = 0.012;
function Ta(t) {
  return t.startsWith("contour:") ? t.slice(8) : null;
}
function $a(t, l, d, h) {
  if (!d && !h) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(t) && d) {
    const w = d[t];
    if (w && w.has(l)) return w.get(l);
  }
  return null;
}
function La(t, l, d, h) {
  const c = new tt(), w = new vs();
  w.setColorMap("rainbow");
  const p = new Gt(), g = W.state([]);
  return W.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const x = d.val, k = ((_a2 = t.elements) == null ? void 0 : _a2.val) ?? [], z = Ta(l.frameResults.val);
    if (c.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), c.clear(), !z || k.length === 0 || x.length === 0) {
      g.val = [];
      return;
    }
    const b = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, H = (_c = t.deformOutputs) == null ? void 0 : _c.val, le = [], pe = [];
    for (let $ = 0; $ < k.length; $++) {
      if (k[$].length !== 2) continue;
      const me = $a(z, $, b, H);
      me && (le.push(me[0], me[1]), pe.push({ idx: $, vals: me }));
    }
    if (le.length === 0) {
      g.val = [];
      return;
    }
    const ae = Math.min(...le), E = Math.max(...le);
    w.setMin(ae), w.setMax(E), g.val = le;
    const ie = [1 / 0, 1 / 0, 1 / 0], ee = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of x) for (let ne = 0; ne < 3; ne++) ie[ne] = Math.min(ie[ne], $[ne]), ee[ne] = Math.max(ee[ne], $[ne]);
    const ge = Math.max(ee[0] - ie[0], ee[1] - ie[1], ee[2] - ie[2], 1) * Va, U = [], B = [], K = [];
    let T = 0;
    for (const { idx: $, vals: ne } of pe) {
      const me = k[$], re = x[me[0]], se = x[me[1]];
      if (!re || !se) continue;
      const R = new _(se[0] - re[0], se[1] - re[1], se[2] - re[2]), ue = R.length();
      if (ue < 1e-10) continue;
      R.normalize();
      const O = Math.abs(R.y) < 0.99 ? new _(0, 1, 0) : new _(1, 0, 0), we = new _().crossVectors(R, O).normalize(), ye = new _().crossVectors(R, we).normalize(), Ie = Co + 1, _e = Ea;
      for (let Xe = 0; Xe < Ie; Xe++) {
        const Qe = Xe / Co, ht = re[0] + R.x * ue * Qe, Ct = re[1] + R.y * ue * Qe, P = re[2] + R.z * ue * Qe, L = ne[0] + (ne[1] - ne[0]) * Qe, Q = w.getColor(L) ?? new Gt(0, 0, 0);
        p.copy(Q).convertSRGBToLinear();
        for (let N = 0; N < _e; N++) {
          const fe = N / _e * Math.PI * 2, he = Math.cos(fe), Se = Math.sin(fe);
          U.push(ht + (we.x * he + ye.x * Se) * ge, Ct + (we.y * he + ye.y * Se) * ge, P + (we.z * he + ye.z * Se) * ge), B.push(p.r, p.g, p.b);
        }
      }
      for (let Xe = 0; Xe < Co; Xe++) for (let Qe = 0; Qe < _e; Qe++) {
        const ht = (Qe + 1) % _e, Ct = T + Xe * _e + Qe, P = T + Xe * _e + ht, L = T + (Xe + 1) * _e + Qe, Q = T + (Xe + 1) * _e + ht;
        K.push(Ct, P, Q), K.push(Ct, Q, L);
      }
      T += Ie * _e;
    }
    if (U.length === 0) return;
    const V = new Me();
    V.setAttribute("position", new bt(U, 3)), V.setAttribute("color", new bt(B, 3)), V.setIndex(K), V.computeVertexNormals();
    const Z = new pt({ vertexColors: true, side: Pt }), Y = new nt(V, Z);
    Y.frustumCulled = false, c.add(Y);
  }), c.__colorMapValues = g, c;
}
function Ia() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ra = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Da = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Ba = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function gt(t, l = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(l) : t.toFixed(l);
}
const Xa = 16755200, us = 56831, Ya = 56831, Na = 56831, Wn = 65382;
function Ua(t) {
  const l = new tt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const d = new yn(1, 16, 16), h = new pt({ color: Xa, transparent: true, opacity: 0.85, depthTest: false }), c = new nt(d, h);
  c.visible = false, c.renderOrder = 100, l.add(c);
  const w = new Me(), p = new ut({ color: us, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), g = new Ht(w, p);
  g.visible = false, g.renderOrder = 100, l.add(g);
  const x = new pt({ color: us, transparent: true, opacity: 0.7, depthTest: false }), k = new nt(new ls(1, 1, 1, 12), x);
  k.visible = false, k.renderOrder = 100, l.add(k);
  const z = new Me(), b = new pt({ color: Ya, transparent: true, opacity: 0.45, side: Pt, depthTest: false }), H = new nt(z, b);
  H.visible = false, H.renderOrder = 100, l.add(H);
  const le = new Me(), pe = new ut({ color: Na, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), ae = new Ht(le, pe);
  ae.visible = false, ae.renderOrder = 100, l.add(ae);
  const E = new pt({ color: Wn, transparent: true, opacity: 0.95, depthTest: false }), ie = new pt({ color: Wn, transparent: true, opacity: 0.85, depthTest: false }), ee = new ls(1, 1, 1, 12), be = new pt({ color: Wn, transparent: true, opacity: 0.55, side: Pt, depthTest: false }), ge = new ut({ color: Wn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), U = [];
  window.__hekatanModelSelection = U;
  const B = new tt();
  B.renderOrder = 101, l.add(B);
  const K = document.createElement("div");
  Object.assign(K.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), K.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(K);
  }, 0);
  function T(P) {
    const L = t.derivedNodes.rawVal;
    return !L || P < 0 || P >= L.length ? null : new _(L[P][0], L[P][1], L[P][2]);
  }
  function V(P, L) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s2;
    const Q = t.getActiveCamera();
    if (!Q || !t.mesh) return null;
    const N = t.rendererElm.getBoundingClientRect(), fe = P - N.left, he = L - N.top, Se = t.derivedNodes.rawVal, Pe = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!Se || !Pe) return null;
    const Be = /* @__PURE__ */ new Map(), Re = (Ne) => {
      if (Be.has(Ne)) return Be.get(Ne);
      const Ce = T(Ne);
      if (!Ce) return Be.set(Ne, null), null;
      const Ae = Ce.clone().project(Q), Ke = (Ae.x * 0.5 + 0.5) * N.width, ze = (-Ae.y * 0.5 + 0.5) * N.height, ct = { x: Ke, y: ze, z: Ae.z };
      return Be.set(Ne, ct), ct;
    }, Ze = /* @__PURE__ */ new Set();
    for (const Ne of Pe) if (Ne) for (const Ce of Ne) Ze.add(Ce);
    const He = 8;
    let Ye = -1, rt = He;
    for (let Ne = 0; Ne < Se.length; Ne++) {
      if (!Ze.has(Ne)) continue;
      const Ce = Re(Ne);
      if (!Ce || Ce.z < -1 || Ce.z > 1) continue;
      const Ae = Ce.x - fe, Ke = Ce.y - he, ze = Math.sqrt(Ae * Ae + Ke * Ke);
      ze < rt && (rt = ze, Ye = Ne);
    }
    const Le = Ia(), st = Da[Le.dispUnit] ?? 1e3, Oe = Ra[Le.forceUnit] ?? 1;
    if (Ye >= 0) {
      const Ne = Se[Ye];
      let Ce = `Nodo ${Ye}
(${Ne[0].toFixed(3)}, ${Ne[1].toFixed(3)}, ${Ne[2].toFixed(3)})`;
      const Ae = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Ae == null ? void 0 : Ae.deformations) {
        const Ke = Ae.deformations.get(Ye);
        if (Ke && (Ce += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ce += `
Ux = ${gt(Ke[0] * st, 3)} ${Le.dispUnit}`, Ce += `
Uy = ${gt(Ke[1] * st, 3)} ${Le.dispUnit}`, Ce += `
Uz = ${gt(Ke[2] * st, 3)} ${Le.dispUnit}`, (Math.abs(Ke[3]) > 1e-9 || Math.abs(Ke[4]) > 1e-9 || Math.abs(Ke[5]) > 1e-9) && (Ce += `
Rx = ${gt(Ke[3] * 1e3, 3)} mrad`, Ce += `
Ry = ${gt(Ke[4] * 1e3, 3)} mrad`, Ce += `
Rz = ${gt(Ke[5] * 1e3, 3)} mrad`)), Ae.reactions) {
          const ze = Ae.reactions.get(Ye);
          ze && (Math.abs(ze[0]) > 1e-9 || Math.abs(ze[1]) > 1e-9 || Math.abs(ze[2]) > 1e-9 || Math.abs(ze[3]) > 1e-6 || Math.abs(ze[4]) > 1e-6 || Math.abs(ze[5]) > 1e-6) && (Ce += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ce += `
Fx = ${gt(ze[0] * Oe)} ${Le.forceUnit}`, Ce += `
Fy = ${gt(ze[1] * Oe)} ${Le.forceUnit}`, Ce += `
Fz = ${gt(ze[2] * Oe)} ${Le.forceUnit}`, (Math.abs(ze[3]) > 1e-6 || Math.abs(ze[4]) > 1e-6 || Math.abs(ze[5]) > 1e-6) && (Ce += `
Mx = ${gt(ze[3] * Oe)} ${Le.forceUnit}\xB7m`, Ce += `
My = ${gt(ze[4] * Oe)} ${Le.forceUnit}\xB7m`, Ce += `
Mz = ${gt(ze[5] * Oe)} ${Le.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ye, info: Ce };
    }
    const cn = 5;
    let ot = -1, at = cn, Nt = "frame";
    for (let Ne = 0; Ne < Pe.length; Ne++) {
      const Ce = Pe[Ne];
      if (!(!Ce || Ce.length < 2)) {
        if (Ce.length === 2) {
          const Ae = Re(Ce[0]), Ke = Re(Ce[1]);
          if (!Ae || !Ke || Ae.z < -1 || Ae.z > 1 || Ke.z < -1 || Ke.z > 1) continue;
          const ze = Za(fe, he, Ae.x, Ae.y, Ke.x, Ke.y);
          ze < at && (at = ze, ot = Ne, Nt = "frame");
        } else if (Ce.length === 3 || Ce.length === 4) {
          const Ae = [];
          let Ke = true;
          for (const ze of Ce) {
            const ct = Re(ze);
            if (!ct || ct.z < -1 || ct.z > 1) {
              Ke = false;
              break;
            }
            Ae.push(ct);
          }
          if (!Ke) continue;
          if (qa(fe, he, Ae)) {
            const ct = Ae.reduce((mt, it) => mt + it.z, 0) / Ae.length * 1e-3;
            ct < at && (at = ct, ot = Ne, Nt = "shell");
          }
        } else if (Ce.length === 8) {
          const Ae = [];
          let Ke = true;
          for (const De of Ce) {
            const Ge = Re(De);
            if (!Ge || Ge.z < -1 || Ge.z > 1) {
              Ke = false;
              break;
            }
            Ae.push(Ge);
          }
          if (!Ke) continue;
          const ze = Math.min(...Ae.map((De) => De.x)), ct = Math.max(...Ae.map((De) => De.x)), mt = Math.min(...Ae.map((De) => De.y)), it = Math.max(...Ae.map((De) => De.y));
          if (fe >= ze && fe <= ct && he >= mt && he <= it) {
            const Ge = Ae.reduce((wt, ke) => wt + ke.z, 0) / Ae.length * 1e-3;
            Ge < at && (at = Ge, ot = Ne, Nt = "solid");
          }
        }
      }
    }
    if (ot >= 0) {
      const Ne = Pe[ot];
      let Ae = `${Nt === "frame" ? "Frame" : Nt === "shell" ? "Shell" : "Solid"} ${ot}`;
      const Ke = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, ze = (_g = (_f = Ke == null ? void 0 : Ke.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, ot);
      if (ze) {
        ze.name && (Ae += `
  \u{1F4CB} ${ze.name}`), ze.shape && (Ae += `
  Shape: ${ze.shape}`);
        const ct = /concrete|hormig|rect.*sólida/i.test(ze.shape || ""), mt = ct ? 100 : 1e3, it = ct ? "cm" : "mm", De = (wt) => {
          const ke = wt * mt;
          return Math.abs(ke - Math.round(ke)) < 0.05 ? `${Math.round(ke)}` : `${ke.toFixed(1)}`;
        }, Ge = [];
        if (ze.D != null && Ge.push(`D=${De(ze.D)}`), ze.B != null && Ge.push(`B=${De(ze.B)}`), ze.TF != null && Ge.push(`TF=${De(ze.TF)}`), ze.TW != null && Ge.push(`TW=${De(ze.TW)}`), ze.t != null && Ge.push(`t=${De(ze.t)}`), Ge.length && (Ae += `
  Dim: ${Ge.join(" ")} ${it}`), ze.material) {
          let wt = ze.material;
          ze.fillMaterial && (wt += ` + FILL "${ze.fillMaterial}"`), Ae += `
  Mat: ${wt}`;
        }
      } else {
        const ct = (_i = (_h = Ke == null ? void 0 : Ke.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, ot), mt = (_k = (_j = Ke == null ? void 0 : Ke.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, ot);
        ct ? (Ae += `
  ${ct}`, mt && !ct.includes(mt) && (Ae += `  (${mt})`)) : mt && (Ae += `
  Material: ${mt}`);
      }
      if (Ae += `
nodos: [${Ne.join(", ")}]`, Nt === "shell" && ((_l = t.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const ct = t.mesh.analyzeOutputs.rawVal, mt = Ba[Le.stressUnit] ?? 1, it = [["bendingXX", "Mxx", Oe, `${Le.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Oe, `${Le.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Oe, `${Le.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Oe, `${Le.forceUnit}/m`], ["membraneYY", "Nyy", Oe, `${Le.forceUnit}/m`], ["membraneXY", "Nxy", Oe, `${Le.forceUnit}/m`], ["shearX", "Qx", Oe, `${Le.forceUnit}/m`], ["shearY", "Qy", Oe, `${Le.forceUnit}/m`], ["vonMises", "\u03C3VM", mt, Le.stressUnit], ["pressure", "p", mt, Le.stressUnit]], De = [];
        for (const [Ge, wt, ke, zt] of it) {
          const vt = ct == null ? void 0 : ct[Ge];
          if (vt && vt instanceof Map) {
            const It = vt.get(ot);
            if (It != null) {
              if (typeof It == "number") De.push(`${wt} = ${gt(It * ke, 3)} ${zt}`);
              else if (Array.isArray(It)) {
                let Ft = It[0];
                for (const Vt of It) Math.abs(Vt) > Math.abs(Ft) && (Ft = Vt);
                De.push(`${wt} = ${gt(Ft * ke, 3)} ${zt}`);
              }
            }
          }
        }
        De.length > 0 && (Ae += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + De.slice(0, 8).join(`
`));
      }
      if (Nt === "frame" && ((_m = t.mesh) == null ? void 0 : _m.deformOutputs) && t.mesh.elementInputs) {
        const ct = t.mesh.deformOutputs.rawVal, mt = t.mesh.elementInputs.rawVal, it = ct == null ? void 0 : ct.deformations;
        if (it && Ne.length === 2) {
          const De = it.get(Ne[0]), Ge = it.get(Ne[1]), wt = Se[Ne[0]], ke = Se[Ne[1]];
          if (De && Ge && wt && ke) {
            const zt = ke[0] - wt[0], vt = ke[1] - wt[1], It = ke[2] - wt[2], Ft = Math.sqrt(zt * zt + vt * vt + It * It);
            if (Ft > 1e-9) {
              const Vt = zt / Ft, en = vt / Ft, Ut = It / Ft, xn = (Ge[0] - De[0]) * Vt + (Ge[1] - De[1]) * en + (Ge[2] - De[2]) * Ut, At = ((_n = mt.elasticities) == null ? void 0 : _n.get(ot)) ?? 0, tn = ((_o2 = mt.areas) == null ? void 0 : _o2.get(ot)) ?? 0, gn = ((_p = mt.momentsOfInertiaY) == null ? void 0 : _p.get(ot)) ?? 0, Tn = ((_q = mt.momentsOfInertiaZ) == null ? void 0 : _q.get(ot)) ?? 0, no = ((_r = mt.torsionalConstants) == null ? void 0 : _r.get(ot)) ?? 0, oo = ((_s2 = mt.shearModuli) == null ? void 0 : _s2.get(ot)) ?? At / 2.6, nn = At * tn * (xn / Ft), $n = (Ge[3] - De[3]) * Vt + (Ge[4] - De[4]) * en + (Ge[5] - De[5]) * Ut, on = oo * no * ($n / Ft), Ln = Ge[4] - De[4], In = Ge[5] - De[5], vn = At * gn * Ln / Ft, dn = At * Tn * In / Ft;
              Ae += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ae += `
L = ${gt(Ft, 3)} m`, Ae += `
\u0394L = ${gt(xn * st, 3)} ${Le.dispUnit}`, Ae += `
\u03B5 = ${gt(xn / Ft, 6)}`, Math.abs(nn) > 1e-6 && (Ae += `
N \u2248 ${gt(nn * Oe)} ${Le.forceUnit}`), Math.abs(on) > 1e-6 && (Ae += `
T \u2248 ${gt(on * Oe)} ${Le.forceUnit}\xB7m`), Math.abs(vn) > 1e-6 && (Ae += `
My \u2248 ${gt(vn * Oe)} ${Le.forceUnit}\xB7m`), Math.abs(dn) > 1e-6 && (Ae += `
Mz \u2248 ${gt(dn * Oe)} ${Le.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Nt, idx: ot, info: Ae };
    }
    return null;
  }
  function Z(P, L, Q) {
    var _a2, _b, _c;
    if (c.visible = false, g.visible = false, k.visible = false, H.visible = false, ae.visible = false, !P || !t.mesh) {
      K.style.display = "none", t.render();
      return;
    }
    const N = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (P.type === "node") {
      const Pe = T(P.idx);
      if (Pe) {
        const Be = t.derivedNodes.rawVal ?? [];
        let Re = 1;
        if (Be.length >= 2) {
          let Ye = [1 / 0, 1 / 0, 1 / 0], rt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Le of Be) for (let st = 0; st < 3; st++) Le[st] < Ye[st] && (Ye[st] = Le[st]), Le[st] > rt[st] && (rt[st] = Le[st]);
          Re = Math.max(rt[0] - Ye[0], rt[1] - Ye[1], rt[2] - Ye[2], 0.1);
        }
        const Ze = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, He = 0.021 * Re * Ze;
        c.position.copy(Pe), c.scale.setScalar(He), c.visible = true;
      }
    } else if (P.type === "frame" && N) {
      const Pe = N[P.idx], Be = T(Pe[0]), Re = T(Pe[1]);
      if (Be && Re) {
        const Ze = Be.clone().add(Re).multiplyScalar(0.5), He = Re.clone().sub(Be), Ye = He.length(), st = t.getActiveCamera().position.distanceTo(Ze) * 35e-4;
        k.position.copy(Ze);
        const Oe = new _(0, 1, 0), cn = Oe.clone().cross(He).normalize(), ot = Oe.angleTo(He);
        k.quaternion.setFromAxisAngle(cn, ot), k.scale.set(st, Ye, st), k.visible = true;
      }
    } else if (P.type === "shell" && N) {
      const Pe = N[P.idx], Be = [], Re = [];
      for (const Ze of Pe) {
        const He = T(Ze);
        if (!He) return;
        Be.push(He.x, He.y, He.z);
      }
      Pe.length === 4 ? Re.push(0, 1, 2, 0, 2, 3) : Pe.length === 3 && Re.push(0, 1, 2), z.setAttribute("position", new bt(Be, 3)), z.setIndex(Re), z.computeVertexNormals(), H.visible = true;
    } else if (P.type === "solid" && N) {
      const Pe = N[P.idx], Be = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Re = [];
      for (const [Ze, He] of Be) {
        const Ye = T(Pe[Ze]), rt = T(Pe[He]);
        Ye && rt && Re.push(Ye.x, Ye.y, Ye.z, rt.x, rt.y, rt.z);
      }
      le.setAttribute("position", new bt(Re, 3)), ae.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      K.style.display = "none", t.render();
      return;
    }
    K.textContent = P.info, K.style.whiteSpace = "pre-line", K.style.display = "block";
    const he = t.rendererElm.getBoundingClientRect(), Se = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? he;
    K.style.left = `${L - Se.left}px`, K.style.top = `${Q - Se.top}px`, t.render();
  }
  let Y = "", $ = 0, ne = 0;
  const me = window.__hekatanHoverDebug ?? false, re = (P) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const L = V(P.clientX, P.clientY);
      if (me && ne < 5) {
        const N = t.derivedNodes.rawVal, fe = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${P.clientX}, ${P.clientY}) nodes=${(N == null ? void 0 : N.length) ?? 0} elems=${(fe == null ? void 0 : fe.length) ?? 0} hover=`, L), ne++;
      }
      const Q = L ? `${L.type}:${L.idx}` : "";
      if (Q !== Y) Y = Q, Z(L, P.clientX, P.clientY);
      else if (L) {
        const N = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        K.style.left = `${P.clientX - N.left}px`, K.style.top = `${P.clientY - N.top}px`;
      }
    });
  };
  let se = null;
  const R = () => {
    Y = "", c.visible = false, g.visible = false, k.visible = false, H.visible = false, ae.visible = false, K.style.display = "none", t.render();
  }, ue = (P) => {
    const L = t.rendererElm.getBoundingClientRect(), Q = P.clientX - L.left, N = P.clientY - L.top;
    (Q < -2 || N < -2 || Q > L.width + 2 || N > L.height + 2) && (se && clearTimeout(se), se = window.setTimeout(R, 200));
  }, O = () => {
    se && (clearTimeout(se), se = null);
  };
  t.rendererElm.addEventListener("pointermove", re), t.rendererElm.addEventListener("pointerleave", ue), t.rendererElm.addEventListener("pointerenter", O);
  function we() {
    var _a2, _b, _c;
    const P = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return P === "select" || P === "none" || !P;
  }
  let ye = null;
  t.rendererElm.addEventListener("pointerdown", (P) => {
    P.button === 0 && (ye = { x: P.clientX, y: P.clientY });
  }), t.rendererElm.addEventListener("pointerup", (P) => {
    if (P.button !== 0 || !ye) return;
    const L = P.clientX - ye.x, Q = P.clientY - ye.y;
    if (ye = null, L * L + Q * Q > 9 || !we()) return;
    const N = V(P.clientX, P.clientY);
    N ? (ht({ type: N.type, idx: N.idx }, P.shiftKey), Qe()) : Ct();
  }), window.addEventListener("keydown", (P) => {
    if (P.key !== "Escape" || !U.length) return;
    const L = document.activeElement, Q = !!L && (L.id === "hk3-cmd-input" || L.id === "hk-dyn-input") && L.value === "";
    L && (L.tagName === "INPUT" || L.tagName === "TEXTAREA" || L.isContentEditable) && !Q || Ct();
  }, { capture: true });
  function Ie() {
    for (const P of B.children.slice()) {
      B.remove(P);
      const L = P.geometry;
      L && L !== d && L !== ee && L.dispose();
    }
  }
  const _e = (P) => {
    var _a2;
    const L = t.getActiveCamera(), Q = ((_a2 = t.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return L.isOrthographicCamera ? (L.top - L.bottom) / (L.zoom || 1) / Q : 2 * L.position.distanceTo(P) * Math.tan((L.fov || 50) * Math.PI / 180 / 2) / Q;
  };
  function Xe(P, L) {
    var _a2, _b;
    const Q = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (P.type === "node") {
      const N = T(P.idx);
      if (!N) return;
      const fe = new nt(d, E);
      fe.position.copy(N), fe.scale.setScalar(Math.max(1e-4, 7 * _e(N))), fe.renderOrder = 101, B.add(fe);
    } else if (P.type === "frame" && Q) {
      const N = Q[P.idx], fe = T(N[0]), he = T(N[1]);
      if (!fe || !he) return;
      const Se = fe.clone().add(he).multiplyScalar(0.5), Pe = he.clone().sub(fe), Be = Pe.length(), Re = t.getActiveCamera().position.distanceTo(Se), Ze = new nt(ee, ie);
      Ze.position.copy(Se);
      const He = new _(0, 1, 0);
      Ze.quaternion.setFromAxisAngle(He.clone().cross(Pe).normalize(), He.angleTo(Pe)), Ze.scale.set(Re * 35e-4, Be, Re * 35e-4), Ze.renderOrder = 101, B.add(Ze);
    } else if (P.type === "shell" && Q) {
      const N = Q[P.idx], fe = [], he = [];
      for (const Be of N) {
        const Re = T(Be);
        if (!Re) return;
        fe.push(Re.x, Re.y, Re.z);
      }
      N.length === 4 ? he.push(0, 1, 2, 0, 2, 3) : N.length === 3 && he.push(0, 1, 2);
      const Se = new Me();
      Se.setAttribute("position", new bt(fe, 3)), Se.setIndex(he), Se.computeVertexNormals();
      const Pe = new nt(Se, be);
      Pe.renderOrder = 101, B.add(Pe);
    } else if (P.type === "solid" && Q) {
      const N = Q[P.idx], fe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], he = [];
      for (const [Be, Re] of fe) {
        const Ze = T(N[Be]), He = T(N[Re]);
        Ze && He && he.push(Ze.x, Ze.y, Ze.z, He.x, He.y, He.z);
      }
      const Se = new Me();
      Se.setAttribute("position", new bt(he, 3));
      const Pe = new Ht(Se, ge);
      Pe.renderOrder = 101, B.add(Pe);
    }
  }
  function Qe() {
    if (Ie(), !U.length || !t.mesh) {
      t.render();
      return;
    }
    const P = t.derivedNodes.rawVal ?? [];
    if (P.length >= 2) {
      const L = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
      for (const N of P) for (let fe = 0; fe < 3; fe++) N[fe] < L[fe] && (L[fe] = N[fe]), N[fe] > Q[fe] && (Q[fe] = N[fe]);
      Math.max(Q[0] - L[0], Q[1] - L[1], Q[2] - L[2], 0.1);
    }
    for (const L of U) Xe(L);
    t.render();
  }
  function ht(P, L) {
    const Q = U.findIndex((N) => N.type === P.type && N.idx === P.idx);
    Q >= 0 ? U.splice(Q, 1) : L || U.push(P), U.length && U[U.length - 1];
  }
  function Ct() {
    U.length = 0, Qe();
  }
  return W.derive(() => {
    t.derivedNodes.val, U.length && Qe();
  }), l;
}
function Za(t, l, d, h, c, w) {
  const p = c - d, g = w - h, x = p * p + g * g;
  if (x < 1e-9) {
    const pe = t - d, ae = l - h;
    return Math.sqrt(pe * pe + ae * ae);
  }
  let k = ((t - d) * p + (l - h) * g) / x;
  k = Math.max(0, Math.min(1, k));
  const z = d + k * p, b = h + k * g, H = t - z, le = l - b;
  return Math.sqrt(H * H + le * le);
}
function qa(t, l, d) {
  let h = false;
  for (let c = 0, w = d.length - 1; c < d.length; w = c++) {
    const p = d[c].x, g = d[c].y, x = d[w].x, k = d[w].y;
    g > l != k > l && t < (x - p) * (l - g) / (k - g + 1e-12) + p && (h = !h);
  }
  return h;
}
function fs(t, l = 8) {
  const d = document.createElement("div");
  d.id = "legend", d.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    W.derive(() => {
      eo.val, d.style.background = ia();
    });
  });
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", d.appendChild(h), setTimeout(() => {
    W.derive(() => {
      h.textContent = Fo.val ? `[${Fo.val}]` : "";
    });
  });
  const c = Array.from({ length: l + 1 }, (x, k) => k / l).reverse();
  let w, p;
  c.forEach((x, k) => {
    w = document.createElement("div"), w.id = `marker-${k}`, w.className = "marker", w.style.marginTop = k == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", p = document.createElement("p"), p.id = `marker-text-${k}`, w.append(p), d.append(w);
  });
  const g = [];
  return d.querySelectorAll("p").forEach((x) => g.push(x)), setTimeout(() => {
    W.derive(() => {
      c.forEach((x, k) => {
        const z = g[k];
        z && (z.innerText = Ka(t.val, x).toString());
      });
    });
  }), d;
}
function Ka(t, l) {
  const d = Vn.val;
  if (d) return hs(d[0] + l * (d[1] - d[0]));
  const h = t.filter((p) => Number.isFinite(p));
  if (h.length === 0) return "0";
  const [c, w] = Eo(h);
  return hs(c + l * (w - c));
}
function hs(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const l = Math.abs(t);
  return l < 1e-3 || l >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function si({ mesh: t, settingsObj: l, drawingObj: d, objects3D: h, solids: c }) {
  oa.DEFAULT_UP = new _(0, 0, 1);
  const w = document.createElement("div"), p = new js(), g = new ea(45, 1, 0.1, 2 * 1e6), x = new ta(-10, 10, 10, -10, -1e3, 2e6);
  let k = g;
  const z = new na({ antialias: true });
  z.localClippingEnabled = true;
  const b = new rs(g, z.domElement);
  b.enableDamping = true, b.dampingFactor = 0.1, b.screenSpacePanning = true, b.zoomSpeed = 0.8, b.panSpeed = 1.2, b.rotateSpeed = 0.9, b.keyPanSpeed = 12, b.listenToKeyEvents(window), b.touches = { ONE: Gn.ROTATE, TWO: Gn.DOLLY_PAN }, z.domElement.addEventListener("wheel", (P) => {
    if (!P.ctrlKey && Math.abs(P.deltaX) > Math.abs(P.deltaY) * 1.5) {
      P.preventDefault();
      const L = b.target, Q = new _().subVectors(g.position, L), N = new _();
      N.crossVectors(g.up, Q).normalize();
      const he = Q.length() * 1e-3 * b.panSpeed;
      L.addScaledVector(N, P.deltaX * he), g.position.addScaledVector(N, P.deltaX * he), b.update();
    }
  }, { passive: false });
  const H = new So(new _(-1, 0, 0), 0), le = new So(new _(0, -1, 0), 0), pe = new So(new _(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function ae() {
    const P = window.__hekatanClip, L = [];
    P.enableX && (H.normal.set(P.invertX ? 1 : -1, 0, 0), H.constant = P.invertX ? -P.posX : P.posX, L.push(H)), P.enableY && (le.normal.set(0, P.invertY ? 1 : -1, 0), le.constant = P.invertY ? -P.posY : P.posY, L.push(le)), P.enableZ && (pe.normal.set(0, 0, P.invertZ ? 1 : -1), pe.constant = P.invertZ ? -P.posZ : P.posZ, L.push(pe)), z.clippingPlanes = L, p.traverse((N) => {
      const fe = N;
      if (fe.material) {
        const he = Array.isArray(fe.material) ? fe.material : [fe.material];
        for (const Se of he) Se.clippingPlanes = L, Se.needsUpdate = true;
      }
    });
    const Q = window.__hekatanPanes ?? [];
    for (const N of Q) try {
      N && typeof N.refresh == "function" && N.refresh();
    } catch {
    }
    z.render(p, k);
  }
  ae(), window.__hekatanClipApply = ae;
  const E = ca(l), ie = W.derive(() => Math.pow(10, E.displayScale.val / 10)), ee = Ga(t, E), be = () => {
    const P = [];
    return E.gridXY.rawVal && P.push("xy"), E.gridXZ.rawVal && P.push("xz"), E.gridYZ.rawVal && P.push("yz"), P;
  }, ge = () => {
    const P = E.gridStep.rawVal, L = Math.max(P, E.gridMajor.rawVal);
    return { planes: be(), majorStep: L, minorStep: P };
  };
  let U = Po(E.gridSize.rawVal, ge());
  U.visible = E.gridVisible.rawVal, window.__hekatanSnap2D = E.cursorSnap.rawVal;
  const B = () => {
    const P = Math.max(0, Math.min(1, E.gridOpacity.rawVal));
    U.traverse((L) => {
      const Q = L.material;
      if (!Q || !("opacity" in Q)) return;
      const N = L.name ?? "";
      let fe = 0.55;
      N.includes("border") ? fe = 1 : N.includes("major") && (fe = 0.95), Q.opacity = P * fe;
    });
  };
  B(), w.appendChild(ra(E, t, c)), w.setAttribute("id", "viewer"), w.appendChild(z.domElement), z.setPixelRatio(window.devicePixelRatio);
  const K = rn();
  z.setClearColor(K.background, 1);
  const T = E.gridSize.rawVal, V = T * 0.5 + T * 0.5 / Math.tan(45 * 0.5);
  g.position.set(0, 0, V), g.up.set(0, 1, 0), b.target.set(0, 0, 0), b.minDistance = 0.1, b.maxDistance = 1e4, w.__settings = E, b.zoomSpeed = 1, b._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, b.update();
  let Z = ds(E.gridSize.rawVal, E.flipAxes.rawVal);
  p.add(U, Z), W.derive(() => {
    window.__hekatanGridPlaneXY = E.gridXY.val, window.__hekatanGridPlaneXZ = E.gridXZ.val, window.__hekatanGridPlaneYZ = E.gridYZ.val;
  });
  let Y = true;
  W.derive(() => {
    const P = E.gridVisible.val;
    if (Y) {
      Y = false;
      return;
    }
    U.visible = P, O();
  });
  let $ = true;
  W.derive(() => {
    if (E.gridOpacity.val, $) {
      $ = false;
      return;
    }
    B(), O();
  }), W.derive(() => {
    const P = E.cursorSnap.val;
    window.__hekatanSnap2D = P;
  });
  let ne = true;
  W.derive(() => {
    var _a2;
    const P = E.gridSize.val, L = E.flipAxes.val;
    if (E.gridXY.val, E.gridXZ.val, E.gridYZ.val, E.gridStep.val, E.gridMajor.val, ne) {
      ne = false;
      return;
    }
    p.remove(U), (_a2 = U.traverse) == null ? void 0 : _a2.call(U, (fe) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = fe.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = fe.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), U = Po(P, ge()), U.visible = E.gridVisible.rawVal, p.add(U), B(), p.remove(Z), Z.traverse((fe) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = fe.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = fe.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Z = ds(P, L), p.add(Z);
    const Q = P * 0.5 + P * 0.5 / Math.tan(45 * 0.5);
    g.position.distanceTo(b.target), Math.abs(g.position.x) < 0.1 && Math.abs(g.position.y) < 0.1 && g.position.z > 0 ? g.position.set(0, 0, Q) : g.position.set(0.5 * P, -Q, 0.5 * P), b.target.set(0, 0, 0), b.minDistance = Math.max(0.05, P * 0.01), b.maxDistance = Math.max(50, P * 50), b.update(), O();
  }), new ResizeObserver((P) => {
    var _a2, _b;
    for (const L of P) {
      const Q = (_a2 = L.target) == null ? void 0 : _a2.clientWidth, N = (_b = L.target) == null ? void 0 : _b.clientHeight;
      if (Q === 0 || N === 0) continue;
      const he = (re ? Q / 2 : Q) / N;
      g.aspect = he, g.updateProjectionMatrix();
      const Se = x.top;
      if (x.left = -Se * he, x.right = Se * he, x.updateProjectionMatrix(), se && se.isPerspectiveCamera) se.aspect = he, se.updateProjectionMatrix();
      else if (se && se.isOrthographicCamera) {
        const Pe = se, Be = Pe.top;
        Pe.left = -Be * he, Pe.right = Be * he, Pe.updateProjectionMatrix();
      }
      z.setSize(Q, N), O();
    }
  }).observe(w), b.addEventListener("change", O), W.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e2 = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e2.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, E.displayScale.val, E.nodes.val, E.elements.val, (_g = E.edges) == null ? void 0 : _g.val, E.elemColumns.val, E.elemBeams.val, E.nodesIndexes.val, E.elementsIndexes.val, E.orientations.val, E.sections.val, E.secColumns.val, E.secBeams.val, E.secFloor.val, E.supports.val, E.loads.val, E.deformedShape.val, E.nodeResults.val, E.frameResults.val, E.shellResults.val, (_h = E.solidResults) == null ? void 0 : _h.val, (_i = E.extruded) == null ? void 0 : _i.val, setTimeout(O);
  });
  let re = false, se = null, R = null, ue = false;
  function O() {
    const P = w.clientWidth || 1, L = w.clientHeight || 1;
    if (!re || !se) {
      z.setScissorTest(false), z.setViewport(0, 0, P, L), z.render(p, k);
      return;
    }
    const Q = P / 2;
    z.setScissorTest(true), z.setViewport(0, 0, Q, L), z.setScissor(0, 0, Q, L), z.render(p, k), z.setViewport(Q, 0, Q, L), z.setScissor(Q, 0, Q, L), z.render(p, se), z.setScissorTest(false);
  }
  function we(P) {
    k = P, b.object = P, b.update(), O();
  }
  function ye(P, L) {
    re = P, L && (se = L);
    const Q = w.clientWidth || 1, N = w.clientHeight || 1, he = (P ? Q / 2 : Q) / N;
    g.isPerspectiveCamera && (g.aspect = he, g.updateProjectionMatrix());
    const Se = x.top;
    if (x.left = -Se * he, x.right = Se * he, x.updateProjectionMatrix(), P && se) {
      if (R ? (R.object = se, R.update()) : (R = new rs(se, z.domElement), R.enableDamping = true, R.dampingFactor = 0.1, R.screenSpacePanning = true, R.zoomSpeed = 0.8, R.panSpeed = 1.2, R.rotateSpeed = 0.9, R.touches = { ONE: Gn.ROTATE, TWO: Gn.DOLLY_PAN }, R.target.copy(b.target), R.addEventListener("change", O), R.enabled = false), !ue) {
        const Pe = (Be) => {
          if (!re || !R) return;
          const Re = z.domElement.getBoundingClientRect(), Ze = Be.clientX - Re.left, He = Re.width / 2, Ye = Ze >= He;
          b.enabled = !Ye, R.enabled = Ye;
        };
        z.domElement.addEventListener("pointerdown", Pe, true), z.domElement.addEventListener("wheel", Pe, { capture: true, passive: true }), ue = true;
      }
    } else P || (b.enabled = true, R && (R.enabled = false));
    w.__splitMode = P, window.__hekatanSplitMode = P, window.__hekatanSplitCamera = P ? se : null, O();
  }
  if (t) {
    p.add(da(E, ee, ie), sa(t, E, ee), fa(E, ee, ie), ha(t, E, ee, ie), pa(t, E, ee, ie), ua(t, E, ee, ie), ya(t, E, ee, ie), ga(t, E, ee, ie), _a(t, E, ee), Ca(t, E, ee, ie), Sa(t, E, ee, ie));
    const P = Ua({ scene: p, rendererElm: z.domElement, getActiveCamera: () => k, derivedNodes: ee, derivedDisplayScale: ie, mesh: t, settings: E, render: O });
    p.add(P);
    const L = ja(t, E), Q = Aa(t, E, ee, L), N = fs(L);
    p.add(Q), w.appendChild(N);
    const fe = La(t, E, ee);
    p.add(fe);
    const he = fe.__colorMapValues, Se = fs(he);
    Se.id = "frame-legend", w.appendChild(Se), W.derive(() => {
      var _a2;
      const Pe = E.shellResults.val != "none", Be = (((_a2 = E.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Re = Pe || Be, Ze = E.frameResults.val.startsWith("contour:"), He = L.val.some((Ye) => Number.isFinite(Ye));
      N.hidden = !Re || !He, Q.visible = Re, Se.hidden = !Ze;
    });
  }
  if (c) {
    const P = new xs(16777215, 0.5);
    p.add(P);
    const L = new jn(16777215, 0.5);
    L.position.set(30, 25, -10), L.shadow.mapSize.width = 1024, L.shadow.mapSize.height = 1024, p.add(L);
    const Q = 10;
    L.shadow.camera.left = -Q, L.shadow.camera.right = Q, L.shadow.camera.top = Q, L.shadow.camera.bottom = -Q, L.shadow.camera.far = 1e3;
    const N = new jn(16777215, 0.5);
    N.color.setHSL(11, 43, 96), N.position.set(-10, 0, 30), p.add(N), W.derive(() => {
      (c == null ? void 0 : c.val.length) && (p.remove(...c.oldVal), p.add(...c.rawVal), O());
    }), W.derive(() => {
      c.rawVal.forEach((fe) => fe.visible = E.solids.val), O();
    });
  }
  if (h) {
    const P = [], L = (N) => {
      var _a2;
      return ((_a2 = N == null ? void 0 : N.userData) == null ? void 0 : _a2.isCota) ? E.showCotas.val : E.custom3D.val;
    }, Q = () => {
      for (const N of P) N.visible = L(N);
      O();
    };
    W.derive(() => {
      const N = h.val;
      P.length && (p.remove(...P), P.length = 0), N.length && (p.add(...N), P.push(...N), Q()), O();
    }), W.derive(() => {
      E.custom3D.val, Q();
    }), W.derive(() => {
      E.showCotas.val, Q();
    });
  }
  d && za({ drawingObj: d, gridObj: U, scene: p, getActiveCamera: () => k, controls: b, gridSize: T, derivedDisplayScale: ie, rendererElm: z.domElement, viewerRender: O }), ws((P, L) => {
    var _a2;
    z.setClearColor(L.background, 1), p.remove(U), (_a2 = U.traverse) == null ? void 0 : _a2.call(U, (Q) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Q.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Q.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), U = Po(E.gridSize.rawVal, { planes: be() }), p.add(U), w.style.setProperty("--awatif-legend-color", L.legendMarker), O();
  });
  const Ie = { scene: p, perspCamera: g, orthoCamera: x, get camera() {
    return k;
  }, controls: b, renderer: z, rendererElm: z.domElement, render: O, setActiveCamera: we, setSplitMode: ye, get splitMode() {
    return re;
  }, get splitCamera() {
    return se;
  }, settings: E };
  w.__ctx = Ie;
  const _e = document.createElement("div");
  _e.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Xe = (P, L, Q) => {
    const N = document.createElement("button");
    return N.textContent = P, N.title = L, N.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), N.onmouseenter = () => {
      N.style.background = "rgba(70,70,70,0.9)";
    }, N.onmouseleave = () => {
      N.style.background = "rgba(40,40,40,0.85)";
    }, N.onclick = (fe) => {
      fe.preventDefault(), Q();
    }, N;
  }, Qe = (P, L) => {
    const Q = b.target, N = new _().subVectors(k.position, Q), fe = N.length(), he = new _(), Se = new _();
    he.crossVectors(k.up, N).normalize(), Se.copy(k.up).normalize();
    const Pe = fe * 0.05;
    Q.addScaledVector(he, -P * Pe), Q.addScaledVector(Se, L * Pe), k.position.addScaledVector(he, -P * Pe), k.position.addScaledVector(Se, L * Pe), b.update(), O();
  }, ht = (P) => {
    const L = new _().subVectors(k.position, b.target);
    L.multiplyScalar(P), k.position.copy(b.target).add(L), b.update(), O();
  }, Ct = () => {
    const P = document.createElement("div");
    return P.style.cssText = "width:32px;height:32px;", P;
  };
  return _e.append(Ct()), _e.append(Xe("\u2191", "Pan arriba", () => Qe(0, 1))), _e.append(Xe("\u2295", "Zoom in", () => ht(0.85))), _e.append(Xe("\u2190", "Pan izquierda", () => Qe(-1, 0))), _e.append(Xe("\u2302", "Reset vista", () => {
    b.reset(), O();
  })), _e.append(Xe("\u2192", "Pan derecha", () => Qe(1, 0))), _e.append(Xe("\u2296", "Zoom out", () => ht(1.18))), _e.append(Xe("\u2193", "Pan abajo", () => Qe(0, -1))), _e.append(Ct()), getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(_e), w;
}
function Ga(t, l) {
  return W.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val) ?? [];
    const d = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || d.length === 0) return d;
    const c = l.deformScale.val, w = l.deformScale.val * l.deformScaleZ.val, p = Number.isFinite(c) ? c : 1, g = Number.isFinite(w) ? w : 1;
    return d.map((x, k) => {
      var _a3;
      const z = ((_a3 = h.get(k)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], b = Number.isFinite(z[0]) ? z[0] : 0, H = Number.isFinite(z[1]) ? z[1] : 0, le = Number.isFinite(z[2]) ? z[2] : 0;
      return [x[0] + b * p, x[1] + H * p, x[2] + le * g];
    });
  });
}
const Vn = W.state(null), Fo = W.state(""), Ha = W.state("kN"), Wa = W.state("mm"), Ja = W.state("kN/m\xB2"), Oa = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, ms = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Qa = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ja(t, l) {
  const d = W.state([]);
  let h;
  return ((c) => {
    c.bendingXX = "bendingXX", c.bendingYY = "bendingYY", c.bendingXY = "bendingXY", c.membraneXX = "membraneXX", c.membraneYY = "membraneYY", c.membraneXY = "membraneXY", c.tranverseShearX = "tranverseShearX", c.tranverseShearY = "tranverseShearY", c.membranePrincipalMax = "membranePrincipalMax", c.membranePrincipalMin = "membranePrincipalMin", c.bendingPrincipalMax = "bendingPrincipalMax", c.bendingPrincipalMin = "bendingPrincipalMin", c.transverseShearMax = "transverseShearMax", c.vonMises = "vonMises", c.pressure = "pressure", c.displacementX = "displacementX", c.displacementY = "displacementY", c.displacementZ = "displacementZ";
  })(h || (h = {})), W.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const c = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), pe = (L, Q) => {
      L == null ? void 0 : L.forEach((N, fe) => {
        const he = t.elements.val[fe];
        if (he) for (let Se = 0; Se < he.length; Se++) Q.set(he[Se], [N[Se] ?? N[0]]);
      });
    };
    pe((_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), pe((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, w), pe((_f = (_e2 = t.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, p), pe((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, g), pe((_j = (_i = t.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, x), pe((_l = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, k), pe((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, z), pe((_p = (_o2 = t.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, b), pe((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, H), pe((_t = (_s2 = t.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, le);
    const ae = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map(), ge = (L, Q, N, fe, he) => {
      L.forEach((Se, Pe) => {
        var _a3, _b2;
        const Be = Se[0] ?? 0, Re = ((_a3 = Q.get(Pe)) == null ? void 0 : _a3[0]) ?? 0, Ze = ((_b2 = N.get(Pe)) == null ? void 0 : _b2[0]) ?? 0, He = (Be + Re) / 2, Ye = Math.hypot((Be - Re) / 2, Ze);
        fe.set(Pe, [He + Ye]), he.set(Pe, [He - Ye]);
      });
    };
    ge(g, x, k, ae, E), ge(c, w, p, ie, ee), z.forEach((L, Q) => {
      var _a3;
      be.set(Q, [Math.hypot(L[0] ?? 0, ((_a3 = b.get(Q)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const U = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, B = (_w = l.solidResults) == null ? void 0 : _w.val, T = B && B !== "none" ? B : l.shellResults.val, V = U == null ? void 0 : U[T], Z = { bendingXX: [c, 0], bendingYY: [w, 0], bendingXY: [p, 0], membraneXX: [g, 0], membraneYY: [x, 0], membraneXY: [k, 0], tranverseShearX: [z, 0], tranverseShearY: [b, 0], membranePrincipalMax: [ae, 0], membranePrincipalMin: [E, 0], bendingPrincipalMax: [ie, 0], bendingPrincipalMin: [ee, 0], transverseShearMax: [be, 0], vonMises: [H, 0], pressure: [le, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, Y = l.shellResults.val, $ = Ha.val, ne = Wa.val, me = Y === "displacementX" || Y === "displacementY" || Y === "displacementZ", re = Y === "bendingXX" || Y === "bendingYY" || Y === "bendingXY" || Y === "bendingPrincipalMax" || Y === "bendingPrincipalMin", se = Y === "membraneXX" || Y === "membraneYY" || Y === "membraneXY" || Y === "membranePrincipalMax" || Y === "membranePrincipalMin", R = Y === "vonMises" || Y === "pressure", ue = Y === "tranverseShearX" || Y === "tranverseShearY" || Y === "transverseShearMax", O = (_D = l.solidResults) == null ? void 0 : _D.val, we = O === "vonMises" || O === "sigmaXX" || O === "sigmaYY" || O === "sigmaZZ" || O === "tauXY" || O === "tauYZ" || O === "tauXZ", ye = O === "ux" || O === "uy" || O === "uz", Ie = Ja.val, _e = we ? Qa[Ie] : ye || me ? ms[ne] : re || se || R || ue ? 1 / Oa[$] : 1, Xe = we ? Ie : ye || me ? ne : re ? `${$}\xB7m/m` : se ? `${$}/m\xB2` : R ? `${$}/m\xB2` : ue ? `${$}/m` : "";
    Fo.val = Xe, Vn.val = Array.isArray(V) && V.length === 2 ? [V[0] * _e, V[1] * _e] : null;
    const Qe = bs.val, Ct = O && O !== "none" ? [H, 0] : Z[Y], P = [];
    if (t.nodes.val.forEach((L, Q) => {
      const N = Ct;
      if (!N || !N[0] || typeof N[0].has != "function") return;
      if (!N[0].has(Q)) {
        P.push(Number.NaN);
        return;
      }
      const fe = N[0].get(Q), he = fe ? fe[N[1]] ?? 0 : 0;
      P.push(he * _e);
    }), !Vn.val && Qe !== "auto") {
      const L = t.nodes.val, Q = /* @__PURE__ */ new Set(), N = (he, Se) => {
        var _a3;
        const Pe = (_a3 = L[he[0]]) == null ? void 0 : _a3[Se];
        return he.every((Be) => {
          var _a4;
          return Math.abs((((_a4 = L[Be]) == null ? void 0 : _a4[Se]) ?? NaN) - Pe) < 1e-6;
        });
      };
      for (const he of t.elements.val) {
        if (he.length !== 4) continue;
        const Se = N(he, 2), Pe = !Se && N(he, 0), Be = !Se && N(he, 1);
        if (Qe === "losas" ? Se : Qe === "muros" ? Pe || Be : Qe === "murosX" ? Pe : Qe === "murosY" ? Be : false) for (const He of he) Q.add(He);
      }
      const fe = [];
      for (const he of Q) {
        const Se = P[he];
        Number.isFinite(Se) && fe.push(Se);
      }
      fe.length && (Vn.val = Eo(fe));
    }
    d.val = P;
  }), d;
}
export {
  la as a,
  fs as b,
  Ha as c,
  Wa as d,
  Ja as e,
  si as g
};
