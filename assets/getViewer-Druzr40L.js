import { N as Kt, a6 as Un, q as Xs, v as W, a7 as Ys, D as zt, M as ot, B as _e, F as St, a8 as Ns, x as ht, a9 as Us, aa as Zs, h as jo, ab as es, r as ln, ac as Hn, ad as Wn, a4 as hs, _ as nt, a as pt, L as Ht, w as ms, b as qs, ae as Ks, f as rt, V as b, $ as an, af as vo, H as zo, d as Pt, c as Mo, Y as ws, Z as Jn, G as Gs, z as Cn, A as Hs, ag as On, t as Ws, o as Os, I as tn, a2 as kn, E as ts, S as mn, m as Zn, ah as Pn, g as ns, i as os, j as ss, C as as, K as Js, U as Qs, W as js, X as ea, T as qn, P as bo, O as ta } from "./theme-Dxpmbnyd.js";
import { T as Ct, O as is } from "./Text-DxjkL_3A.js";
import { P as ys } from "./tweakpane-BXg6ZhiP.js";
import { e as na } from "./styles-Ce_UnsFA.js";
class xs {
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
    this.map = _o[l] || _o.rainbow, this.n = d;
    const h = 1 / this.n, c = new Kt(), m = new Kt();
    this.lut.length = 0, this.lut.push(new Kt(this.map[0][1]));
    for (let p = 1; p < d; p++) {
      const g = p * h;
      for (let y = 0; y < this.map.length - 1; y++) if (g > this.map[y][0] && g <= this.map[y + 1][0]) {
        const k = this.map[y][0], z = this.map[y + 1][0];
        c.setHex(this.map[y][1], Un), m.setHex(this.map[y + 1][1], Un);
        const M = new Kt().lerpColors(c, m, (g - k) / (z - k));
        this.lut.push(M);
      }
    }
    return this.lut.push(new Kt(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Xs.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const d = Math.round(l * this.n);
    return this.lut[d];
  }
  addColorMap(l, d) {
    return _o[l] = d, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const d = l.getContext("2d", { alpha: false }), h = d.getImageData(0, 0, 1, this.n), c = h.data;
    let m = 0;
    const p = 1 / this.n, g = new Kt(), y = new Kt(), k = new Kt();
    for (let z = 1; z >= 0; z -= p) for (let M = this.map.length - 1; M >= 0; M--) if (z < this.map[M][0] && z >= this.map[M - 1][0]) {
      const H = this.map[M - 1][0], le = this.map[M][0];
      g.setHex(this.map[M - 1][1], Un), y.setHex(this.map[M][1], Un), k.lerpColors(g, y, (z - H) / (le - H)), c[m * 4] = Math.round(k.r * 255), c[m * 4 + 1] = Math.round(k.g * 255), c[m * 4 + 2] = Math.round(k.b * 255), c[m * 4 + 3] = 255, m += 1;
    }
    return d.putImageData(h, 0, 0), l;
  }
}
const _o = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, gs = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], oa = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: gs, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Qn = W.state("safe"), vs = W.state("auto");
function Ms(e) {
  e = Math.max(0, Math.min(1, e));
  const l = oa[Qn.val] ?? gs;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, m, p, g] = l[h], [y, k, z, M] = l[h + 1];
    if (e <= y) {
      const H = (e - c) / (y - c);
      return [m + (k - m) * H, p + (z - p) * H, g + (M - g) * H];
    }
  }
  const d = l[l.length - 1];
  return [d[1], d[2], d[3]];
}
function ls() {
  const l = new Uint8Array(1024);
  for (let h = 0; h < 256; h++) {
    const c = h / 255, [m, p, g] = Ms(c);
    l[h * 4 + 0] = m, l[h * 4 + 1] = p, l[h * 4 + 2] = g, l[h * 4 + 3] = 255;
  }
  const d = new Us(l, 256, 1, Zs);
  return d.minFilter = jo, d.magFilter = jo, d.wrapS = es, d.wrapT = es, d.needsUpdate = true, d;
}
function sa() {
  const l = [];
  for (let d = 0; d <= 12; d++) {
    const h = 1 - d / 12, [c, m, p] = Ms(h);
    l.push(`rgb(${c | 0},${m | 0},${p | 0}) ${(d / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function Fo(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((m, p) => m - p), d = (m) => l[Math.min(l.length - 1, Math.max(0, Math.round(m * (l.length - 1))))];
  let h = l.length >= 20 ? d(0.01) : l[0], c = l.length >= 20 ? d(0.99) : l[l.length - 1];
  return h >= 0 && c > 0 && (h = 0), c <= 0 && h < 0 && (c = 0), [h, c];
}
function aa(e, l, d) {
  new xs();
  const h = ls(), c = new Ys({ uniforms: { cmap: { value: h }, ambient: { value: 0.95 } }, vertexShader: `
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
  W.derive(() => {
    var _a2;
    Qn.val;
    const p = c.uniforms.cmap.value;
    c.uniforms.cmap.value = ls(), (_a2 = p == null ? void 0 : p.dispose) == null ? void 0 : _a2.call(p);
  });
  const m = new ot(new _e(), c);
  return m.renderOrder = -1, m.frustumCulled = false, m.userData.isShellArea = true, m.name = "__hekatan_shell_colormap", W.derive(() => {
    m.geometry.setAttribute("position", new St(e.val.flat(), 3));
    const p = [], g = [], y = [];
    l.val.forEach((ee, Se) => {
      ee.length === 3 ? (p.push(ee[0], ee[1], ee[2]), g.push(Se), y.push(0)) : ee.length === 4 && (p.push(ee[0], ee[1], ee[2]), p.push(ee[0], ee[2], ee[3]), g.push(Se, Se), y.push(0, 1));
    }), m.geometry.setIndex(new Ns(p, 1)), m.userData.faceToElem = g, m.userData.faceLocal = y;
    const k = d.val.filter((ee) => Number.isFinite(ee));
    let z, M;
    const H = Fn.val;
    if (H ? (M = H[0], z = H[1]) : [M, z] = Fo(k), z === M) {
      const ee = Math.max(Math.abs(z) * 1e-6, 1e-9);
      z += ee, M -= ee;
    }
    const le = H && H[0] > H[1], pe = Math.min(M, z), ae = Math.max(M, z), E = ae - pe, ie = new Float32Array(d.val.length);
    for (let ee = 0; ee < d.val.length; ee++) {
      const Se = d.val[ee];
      if (!Number.isFinite(Se)) {
        ie[ee] = -1;
        continue;
      }
      const U = ((le ? ae + pe - Se : Se) - pe) / E;
      ie[ee] = Math.max(0, Math.min(1, U));
    }
    m.geometry.setAttribute("scalar", new ht(ie, 1));
  }), m;
}
function ia(e, l, d) {
  const h = document.createElement("div"), c = new ys({ title: "Settings", expanded: true, container: h });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(c), h.setAttribute("id", "settings");
  const m = "hk_settingsPos";
  let p = null;
  try {
    const M = localStorage.getItem(m);
    M && (p = JSON.parse(M));
  } catch {
  }
  h.style.cssText = ["position:fixed", p ? `left:${p.left}px` : "left:8px", p ? `top:${p.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const g = () => {
    const M = h.querySelector(".tp-rotv_b");
    if (!M) {
      setTimeout(g, 200);
      return;
    }
    M.style.cursor = "move", M.style.userSelect = "none";
    let H = false, le = 0, pe = 0, ae = 0, E = 0;
    M.addEventListener("mousedown", (ie) => {
      H = true, le = ie.clientX, pe = ie.clientY;
      const ee = h.getBoundingClientRect();
      ae = ee.left, E = ee.top, h.style.left = `${ae}px`, h.style.top = `${E}px`;
    }), window.addEventListener("mousemove", (ie) => {
      if (!H) return;
      const ee = ie.clientX - le, Se = ie.clientY - pe, ve = Math.max(0, Math.min(window.innerWidth - 40, ae + ee)), U = Math.max(0, Math.min(window.innerHeight - 40, E + Se));
      h.style.left = `${ve}px`, h.style.top = `${U}px`;
    }), window.addEventListener("mouseup", () => {
      if (H) {
        H = false;
        try {
          localStorage.setItem(m, JSON.stringify({ left: parseFloat(h.style.left), top: parseFloat(h.style.top) }));
        } catch {
        }
      }
    });
  };
  if (g(), l == null ? void 0 : l.nodes) {
    c.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const M = c.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    M.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), M.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), M.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), M.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const H = M.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    H.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), H.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), H.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), H.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), H.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const le = c.addFolder({ title: "\u{1F441} Ver", expanded: false });
    le.addBinding(e.nodes, "val", { label: "Nodes" }), le.addBinding(e.elements, "val", { label: "Elements" }), le.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), le.addBinding(e.faces, "val", { label: "  Caras (fill)" }), le.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), le.addBinding(e.elemColumns, "val", { label: "    Columnas" }), le.addBinding(e.elemBeams, "val", { label: "    Vigas" }), le.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), le.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), le.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), le.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), le.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), le.addBinding(e.orientations, "val", { label: "Orientations" }), le.addBinding(e.sections, "val", { label: "Sections" }), le.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), le.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), le.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), le.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), le.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const M = c.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    M.addBinding(e.supports, "val", { label: "Supports" }), M.addBinding(e.loads, "val", { label: "Loads" }), M.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), M.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const M = c.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = M, M.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), M.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), M.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), M.addBinding(Qn, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), M.addBinding(vs, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), M.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), M.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), M.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), M.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  d && c.addBinding(e.solids, "val", { label: "Solids" });
  const y = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), k = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), z = () => {
    const M = window.__hekatanClipApply;
    typeof M == "function" && M();
  };
  return y.addBinding(k, "enableX", { label: "Cortar X" }).on("change", z), y.addBinding(k, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", z), y.addBinding(k, "invertX", { label: "  invertir X" }).on("change", z), y.addBinding(k, "enableY", { label: "Cortar Y" }).on("change", z), y.addBinding(k, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", z), y.addBinding(k, "invertY", { label: "  invertir Y" }).on("change", z), y.addBinding(k, "enableZ", { label: "Cortar Z" }).on("change", z), y.addBinding(k, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", z), y.addBinding(k, "invertZ", { label: "  invertir Z" }).on("change", z), h;
}
function la(e) {
  return { gridSize: W.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: W.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: W.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: W.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: W.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: W.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: W.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: W.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: W.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: W.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: W.state((e == null ? void 0 : e.nodes) ?? true), elements: W.state((e == null ? void 0 : e.elements) ?? true), edges: W.state((e == null ? void 0 : e.edges) ?? true), faces: W.state((e == null ? void 0 : e.faces) ?? true), elemColumns: W.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: W.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: W.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: W.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: W.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: W.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: W.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: W.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: W.state((e == null ? void 0 : e.orientations) ?? false), sections: W.state((e == null ? void 0 : e.sections) ?? true), extruded: W.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: W.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: W.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: W.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: W.state((e == null ? void 0 : e.secFloor) ?? -1), supports: W.state((e == null ? void 0 : e.supports) ?? true), loads: W.state((e == null ? void 0 : e.loads) ?? false), deformedShape: W.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: W.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: W.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: W.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: W.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: W.state((e == null ? void 0 : e.flipAxes) ?? false), solids: W.state((e == null ? void 0 : e.solids) ?? true), custom3D: W.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: W.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: W.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: W.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function ra(e, l, d) {
  const h = ln(), c = new Hn(new _e(), new Wn({ color: h.nodePoint }));
  return hs((m, p) => {
    c.material.color.setHex(p.nodePoint);
  }), c.frustumCulled = false, W.derive(() => {
    e.nodes.val && c.geometry.setAttribute("position", new St(l.val.flat(), 3));
  }), W.derive(() => {
    if (d.val, l.val, !e.nodes.rawVal) return;
    const m = l.rawVal ?? [];
    let p = e.gridSize.val * 0.5;
    if (m.length >= 2) {
      const y = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
      for (const z of m) for (let M = 0; M < 3; M++) y[M] = Math.min(y[M], z[M]), k[M] = Math.max(k[M], z[M]);
      p = Math.max(k[0] - y[0], k[1] - y[1], k[2] - y[2], 0.1);
    }
    const g = 0.03 * p;
    c.material.size = g * d.rawVal;
  }), W.derive(() => {
    c.visible = e.nodes.val;
  }), c;
}
function So(e, l) {
  const d = ln(), h = new nt();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let m = (l == null ? void 0 : l.majorStep) ?? 1, p = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (m <= 0 && (m = 1), p <= 0 && (p = 0.1); e / p > 500; ) p *= 2;
  for (; e / m > 100; ) m *= 2;
  const g = e / 2;
  m = Math.max(p, Math.round(m / p) * p);
  const k = new Kt(d.grid).multiplyScalar(1.3), z = new Kt(d.grid).multiplyScalar(0.8), M = (ae, E, ie, ee) => {
    const Se = [], ve = ae === "xy" ? (V, Z) => [V, Z, 0] : ae === "xz" ? (V, Z) => [V, 0, Z] : (V, Z) => [0, V, Z], U = Math.floor(g / E);
    for (let V = -U; V <= U; V++) {
      const Z = V * E, N = ve(Z, -g), $ = ve(Z, g);
      Se.push(...N, ...$);
    }
    for (let V = -U; V <= U; V++) {
      const Z = V * E, N = ve(-g, Z), $ = ve(g, Z);
      Se.push(...N, ...$);
    }
    const X = new _e();
    X.setAttribute("position", new St(Se, 3));
    const K = new pt({ color: ie, transparent: true, opacity: ee, depthWrite: false }), T = new Ht(X, K);
    return T.name = `grid-${ae}-${E === p ? "minor" : "major"}`, T;
  }, H = (ae, E, ie) => {
    const ee = ae === "xy" ? (T, V) => [T, V, 0] : ae === "xz" ? (T, V) => [T, 0, V] : (T, V) => [0, T, V], Se = [[-g, -g], [g, -g], [g, g], [-g, g]], ve = [];
    for (const [T, V] of Se) ve.push(...ee(T, V));
    const U = new _e();
    U.setAttribute("position", new St(ve, 3));
    const X = new pt({ color: E, transparent: true, opacity: ie, depthWrite: false }), K = new ms(U, X);
    return K.name = `grid-${ae}-border`, K.renderOrder = 1, K;
  }, le = (ae, E, ie) => {
    const ee = ae === "xy" ? (X, K) => [X, K, 0] : ae === "xz" ? (X, K) => [X, 0, K] : (X, K) => [0, X, K], Se = E === "u" ? [...ee(-g, 0), ...ee(g, 0)] : [...ee(0, -g), ...ee(0, g)], ve = new _e();
    ve.setAttribute("position", new St(Se, 3));
    const U = new Ht(ve, new pt({ color: ie, transparent: true, opacity: 0.45, depthWrite: false }));
    return U.name = `grid-${ae}-eje-${E}`, U.renderOrder = 1, U;
  }, pe = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const ae of c) {
    h.add(M(ae, p, z, 0.12)), h.add(M(ae, m, k, 0.4));
    const [E, ie] = pe[ae];
    h.add(le(ae, "u", E)), h.add(le(ae, "v", ie)), h.add(H(ae, k, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: m, minorStep: p, gridSize: e, planes: [...c] }, h;
}
function ca(e, l, d, h) {
  const c = new nt(), m = new qs(0.5, 0.5, 0.5), p = new Ks(0.45, 0.7, 4);
  p.rotateX(Math.PI / 2), p.translate(0, 0, -0.35);
  const g = new rt({ color: 10166822 }), y = new rt({ color: 2792847 }), k = new rt({ color: 3835647 }), z = () => {
    const le = d.rawVal ?? [];
    if (le.length < 2) return l.gridSize.val * 0.5;
    let pe = [1 / 0, 1 / 0, 1 / 0], ae = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of le) for (let ie = 0; ie < 3; ie++) E[ie] < pe[ie] && (pe[ie] = E[ie]), E[ie] > ae[ie] && (ae[ie] = E[ie]);
    return Math.max(ae[0] - pe[0], ae[1] - pe[1], ae[2] - pe[2], 0.1);
  }, M = () => 0.08 * z(), H = () => h.rawVal;
  return W.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const le = M();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((pe, ae) => {
      const E = d.val[ae];
      if (!E) return;
      const ie = pe ?? [], ee = (ie[0] ? 1 : 0) + (ie[1] ? 1 : 0) + (ie[2] ? 1 : 0), Se = (ie[3] ? 1 : 0) + (ie[4] ? 1 : 0) + (ie[5] ? 1 : 0);
      let ve;
      ee >= 3 && Se >= 3 ? ve = new ot(m, g) : ee >= 3 && Se === 0 ? ve = new ot(p, y) : ve = new ot(p, k), ve.position.set(E[0], E[1], E[2]);
      const U = le * H();
      ve.scale.set(U, U, U), c.add(ve);
    });
  }), W.derive(() => {
    if (h.val, !l.supports.rawVal) return;
    const pe = M() * H();
    c.children.forEach((ae) => ae.scale.set(pe, pe, pe));
  }), W.derive(() => {
    c.visible = l.supports.val;
  }), c;
}
function da(e, l, d, h) {
  const c = new nt();
  c.name = "loadsGroup";
  function m(p) {
    if (p.length < 2) return 0.12 * l.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], y = [-1 / 0, -1 / 0, -1 / 0];
    for (const z of p) for (let M = 0; M < 3; M++) g[M] = Math.min(g[M], z[M]), y[M] = Math.max(y[M], z[M]);
    return 0.08 * Math.max(y[0] - g[0], y[1] - g[1], y[2] - g[2], 0.1);
  }
  return W.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((M) => M.dispose()), c.clear();
    const p = d.val, g = m(p), y = 240, k = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((M, H) => {
      p[H] && M.slice(0, 3).some((le) => Math.abs(le) > 1e-15) && k.push(H);
    });
    let z = k;
    if (k.length > y) {
      const M = k.map((T) => p[T][0]), H = k.map((T) => p[T][1]), le = Math.min(...M), pe = Math.max(...M), ae = Math.min(...H), E = Math.max(...H), ie = k.map((T) => p[T][2]), ee = Math.max(1e-6, (Math.max(...ie) - Math.min(...ie)) / 40), Se = (T) => Math.round(T / ee), ve = new Set(ie.map(Se)), U = Math.max(4, Math.floor(y / Math.max(1, ve.size))), X = Math.max(2, Math.round(Math.sqrt(U))), K = /* @__PURE__ */ new Map();
      for (const T of k) {
        const V = pe - le < 1e-9 ? 0 : (p[T][0] - le) / (pe - le), Z = E - ae < 1e-9 ? 0 : (p[T][1] - ae) / (E - ae), N = Math.min(X - 1, Math.floor(V * X)), $ = Math.min(X - 1, Math.floor(Z * X)), ne = `${N},${$},${Se(p[T][2])}`, he = Math.hypot(V * X - (N + 0.5), Z * X - ($ + 0.5)), re = K.get(ne);
        (!re || he < re.d) && K.set(ne, { i: T, d: he });
      }
      z = [...K.values()].map((T) => T.i);
    }
    for (const M of z) {
      const H = e.nodeInputs.val.loads.get(M), le = p[M];
      if (!le) continue;
      const pe = new b(...H.slice(0, 3));
      if (pe.lengthSq() < 1e-30) continue;
      pe.normalize();
      const ae = new an(pe, new b(...le), 1, 15637248, 0.3, 0.3), E = g * h.rawVal;
      ae.scale.set(E, E, E), c.add(ae);
    }
  }), W.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const g = m(d.rawVal) * h.rawVal;
    c.children.forEach((y) => y.scale.set(g, g, g));
  }), W.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function pa(e, l, d) {
  const h = new nt();
  return W.derive(() => {
    if (!e.nodesIndexes.val) return;
    h.children.forEach((m) => m.dispose()), h.clear();
    const c = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((m, p) => {
      const g = new Ct(`${p}`);
      g.position.set(...m), g.updateScale(c * d.rawVal), h.add(g);
    });
  }), W.derive(() => {
    if (d.val, !e.nodesIndexes.rawVal) return;
    const c = 0.05 * e.gridSize.val * 0.6;
    h.children.forEach((m) => m.updateScale(c * d.rawVal));
  }), W.derive(() => {
    h.visible = e.nodesIndexes.val;
  }), h;
}
function ua(e, l, d, h) {
  const c = new nt();
  return W.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    c.children.forEach((p) => p.dispose()), c.clear();
    const m = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((p, g) => {
      const y = new Ct(`${g}`, void 0, "#001219");
      y.position.set(...fa(p.map((k) => d.rawVal[k]))), y.updateScale(m * h.rawVal), c.add(y);
    });
  }), W.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const m = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((p) => p.updateScale(m * h.rawVal));
  }), W.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function fa(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), d = e.length;
  return [l[0] / d, l[1] / d, l[2] / d];
}
function rs(e, l) {
  const d = new nt(), h = Math.min(0.05 * e, 0.6), c = ln(), m = new Ct("X", "red", "transparent"), p = new Ct(l ? "Z" : "Y", "green", "transparent"), g = new Ct(l ? "Y" : "Z", "blue", "transparent"), y = new an(new b(1, 0, 0), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), k = new an(new b(0, 1, 0), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), z = new an(new b(0, 0, 1), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return m.position.set(1.3 * h, 0, 0), p.position.set(0, 1.3 * h, 0), g.position.set(0, 0, 1.3 * h), m.updateScale(0.4 * h), p.updateScale(0.4 * h), g.updateScale(0.4 * h), y.scale.set(h, h, h), k.scale.set(h, h, h), z.scale.set(h, h, h), d.add(y, k, z, m, p, g), d;
}
function jn(e, l) {
  const d = new b(...e), c = new b(...l).clone().sub(d), m = c.length(), p = c.dot(new b(1, 0, 0)) / m, g = c.dot(new b(0, 1, 0)) / m, y = c.dot(new b(0, 0, 1)) / m, k = Math.sqrt(p ** 2 + g ** 2);
  let z = new vo().fromArray([[p, g, y], [-g / k, p / k, 0], [-p * y / k, -g * y / k, k]].flat());
  return y === 1 && (z = new vo().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), y === -1 && (z = new vo().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new zo().setFromMatrix3(z);
}
function Po(e, l) {
  return e == null ? void 0 : e.map((d, h) => (9 * d + l[h]) / 10);
}
function zn(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), d = e.length;
  return [l[0] / d, l[1] / d, l[2] / d];
}
function ha(e, l, d) {
  const h = zn([l, d]), c = zn([e, d]), m = zn([e, l]), p = new b(...h).sub(new b(...c)).normalize(), g = new b(...d).sub(new b(...m)).normalize(), y = p.clone().cross(g).normalize(), k = y.clone().cross(p).normalize();
  return new zo().makeBasis(p, k, y);
}
function ma(e, l, d, h) {
  const c = new nt(), m = new _e(), p = new pt({ vertexColors: true }), g = [0, 0, 0], y = [1, 0, 0], k = [0, 1, 0], z = [0, 0, 1];
  m.setAttribute("position", new St([...g, ...y, ...g, ...k, ...g, ...z], 3));
  const M = [255, 0, 0], H = [0, 255, 0], le = [0, 0, 255];
  return m.setAttribute("color", new St([...M, ...M, ...H, ...H, ...le, ...le], 3)), W.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((pe) => {
      const ae = new Ht(m, p), E = d.rawVal[pe[0]], ie = d.rawVal[pe[1]];
      if (pe.length === 2 && (ae.position.set(...Po(E, ie)), ae.rotation.setFromRotationMatrix(jn(E, ie))), pe.length === 3) {
        const ve = d.rawVal[pe[2]];
        ae.position.set(...zn([E, ie, ve])), ae.rotation.setFromRotationMatrix(ha(E, ie, ve));
      }
      const Se = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      ae.scale.set(Se, Se, Se), c.add(ae);
    }));
  }), W.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const ae = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((E) => E.scale.set(ae, ae, ae));
  }), W.derive(() => {
    c.visible = l.orientations.val;
  }), c;
}
function wa(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), d = (e.h * 100).toFixed(0);
    return `${l}x${d}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ya(e, l, d, h) {
  const c = new nt(), m = new nt();
  c.add(m);
  function p(X, K) {
    const T = X / 2, V = K / 2, Z = new Float32Array([0, -T, -V, 0, T, -V, 0, T, V, 0, -T, -V, 0, T, V, 0, -T, V]), N = new _e();
    N.setAttribute("position", new ht(Z, 3));
    const $ = new Float32Array([0, -T, -V, 0, T, -V, 0, T, V, 0, -T, V, 0, -T, -V]), ne = new _e();
    return ne.setAttribute("position", new ht($, 3)), { fill: N, outline: ne };
  }
  function g(X, K = 24) {
    const T = X / 2, V = new Float32Array(K * 9);
    for (let ne = 0; ne < K; ne++) {
      const he = ne / K * Math.PI * 2, re = (ne + 1) / K * Math.PI * 2;
      V[ne * 9] = 0, V[ne * 9 + 1] = 0, V[ne * 9 + 2] = 0, V[ne * 9 + 3] = 0, V[ne * 9 + 4] = T * Math.cos(he), V[ne * 9 + 5] = T * Math.sin(he), V[ne * 9 + 6] = 0, V[ne * 9 + 7] = T * Math.cos(re), V[ne * 9 + 8] = T * Math.sin(re);
    }
    const Z = new _e();
    Z.setAttribute("position", new ht(V, 3));
    const N = new Float32Array((K + 1) * 3);
    for (let ne = 0; ne <= K; ne++) {
      const he = ne / K * Math.PI * 2;
      N[ne * 3] = 0, N[ne * 3 + 1] = T * Math.cos(he), N[ne * 3 + 2] = T * Math.sin(he);
    }
    const $ = new _e();
    return $.setAttribute("position", new ht(N, 3)), { fill: Z, outline: $ };
  }
  function y(X, K, T, V) {
    const Z = T ?? K * 0.08, N = V ?? X * 0.07, $ = X / 2, ne = K / 2, he = ne - Z, re = N / 2, se = [];
    function D(ye, Le, ke, Ye) {
      se.push(0, ye, Le, 0, ke, Le, 0, ke, Ye, 0, ye, Le, 0, ke, Ye, 0, ye, Ye);
    }
    D(-$, -ne, $, -he), D(-re, -he, re, he), D(-$, he, $, ne);
    const fe = new _e();
    fe.setAttribute("position", new ht(new Float32Array(se), 3));
    const J = new Float32Array([0, -$, -ne, 0, $, -ne, 0, $, -he, 0, re, -he, 0, re, he, 0, $, he, 0, $, ne, 0, -$, ne, 0, -$, he, 0, -re, he, 0, -re, -he, 0, -$, -he, 0, -$, -ne]), we = new _e();
    return we.setAttribute("position", new ht(J, 3)), { fill: fe, outline: we };
  }
  function k(X, K, T) {
    const V = X / 2, Z = K / 2, N = V - T, $ = Z - T, ne = [];
    function he(fe, J, we, ye) {
      ne.push(0, fe, J, 0, we, J, 0, we, ye, 0, fe, J, 0, we, ye, 0, fe, ye);
    }
    he(-V, -Z, V, -$), he(-V, $, V, Z), he(-V, -$, -N, $), he(N, -$, V, $);
    const re = new _e();
    re.setAttribute("position", new ht(new Float32Array(ne), 3));
    const se = new Float32Array([0, -V, -Z, 0, V, -Z, 0, V, -Z, 0, V, Z, 0, V, Z, 0, -V, Z, 0, -V, Z, 0, -V, -Z, 0, -N, -$, 0, N, -$, 0, N, -$, 0, N, $, 0, N, $, 0, -N, $, 0, -N, $, 0, -N, -$]), D = new _e();
    return D.setAttribute("position", new ht(se, 3)), { fill: re, outline: D };
  }
  function z(X, K, T) {
    const V = X / 2, Z = K / 2, N = V - T, $ = Z - T, ne = new _e(), he = new Float32Array([0, -N, -$, 0, N, -$, 0, N, $, 0, -N, -$, 0, N, $, 0, -N, $]);
    ne.setAttribute("position", new ht(he, 3));
    const re = [];
    function se(we, ye, Le, ke) {
      re.push(0, we, ye, 0, Le, ye, 0, Le, ke, 0, we, ye, 0, Le, ke, 0, we, ke);
    }
    se(-V, -Z, V, -$), se(-V, $, V, Z), se(-V, -$, -N, $), se(N, -$, V, $);
    const D = new _e();
    D.setAttribute("position", new ht(new Float32Array(re), 3));
    const fe = new Float32Array([0, -V, -Z, 0, V, -Z, 0, V, -Z, 0, V, Z, 0, V, Z, 0, -V, Z, 0, -V, Z, 0, -V, -Z, 0, -N, -$, 0, N, -$, 0, N, -$, 0, N, $, 0, N, $, 0, -N, $, 0, -N, $, 0, -N, -$]), J = new _e();
    return J.setAttribute("position", new ht(fe, 3)), { concFill: ne, steelFillGeom: D, outline: J };
  }
  function M(X, K, T) {
    const V = [], Z = [[0, -X / 2, -K / 2], [0, -X / 2 + T, -K / 2], [0, -X / 2 + T, K / 2 - T], [0, X / 2, K / 2 - T], [0, X / 2, K / 2], [0, -X / 2, K / 2]], N = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const re of N) V.push(...Z[re]);
    const $ = new _e();
    $.setAttribute("position", new ht(new Float32Array(V), 3));
    const ne = [];
    for (let re = 0; re < Z.length; re++) {
      const se = (re + 1) % Z.length;
      ne.push(...Z[re], ...Z[se]);
    }
    const he = new _e();
    return he.setAttribute("position", new ht(new Float32Array(ne), 3)), { fill: $, outline: he };
  }
  function H(X, K, T, V) {
    const Z = V / 2, N = [], $ = [[0, -X - Z, -K / 2], [0, -T - Z, -K / 2], [0, -T - Z, K / 2 - T], [0, -Z, K / 2 - T], [0, -Z, K / 2], [0, -X - Z, K / 2]], ne = [[0, Z, -K / 2], [0, Z + T, -K / 2], [0, Z + T, K / 2 - T], [0, X + Z, K / 2 - T], [0, X + Z, K / 2], [0, Z, K / 2]], he = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of he) N.push(...$[fe]);
    for (const fe of he) N.push(...ne[fe]);
    const re = new _e();
    re.setAttribute("position", new ht(new Float32Array(N), 3));
    const se = [];
    for (const fe of [$, ne]) for (let J = 0; J < fe.length; J++) {
      const we = (J + 1) % fe.length;
      se.push(...fe[J], ...fe[we]);
    }
    const D = new _e();
    return D.setAttribute("position", new ht(new Float32Array(se), 3)), { fill: re, outline: D };
  }
  function le(X, K, T, V) {
    const Z = K / 2, N = X, $ = [[0, -N, -Z], [0, -N, -Z + T], [0, -V, -Z + T], [0, -V, Z - T], [0, -N, Z - T], [0, -N, Z], [0, 0, Z], [0, 0, -Z]], ne = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], he = [];
    for (const fe of ne) he.push(...$[fe]);
    const re = new _e();
    re.setAttribute("position", new ht(new Float32Array(he), 3));
    const se = [];
    for (let fe = 0; fe < $.length; fe++) {
      const J = (fe + 1) % $.length;
      se.push(...$[fe], ...$[J]);
    }
    const D = new _e();
    return D.setAttribute("position", new ht(new Float32Array(se), 3)), { fill: re, outline: D };
  }
  function pe(X, K, T, V, Z) {
    const N = K / 2, $ = Z / 2, ne = [], he = [[0, -X, -N], [0, -X, -N + T], [0, -$ - V, -N + T], [0, -$ - V, N - T], [0, -X, N - T], [0, -X, N], [0, -$, N], [0, -$, -N]], re = he.map((we) => [we[0], -we[1], we[2]]), se = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const we of se) ne.push(...he[we]);
    for (const we of se) ne.push(...re[we]);
    const D = new _e();
    D.setAttribute("position", new ht(new Float32Array(ne), 3));
    const fe = [];
    for (const we of [he, re]) for (let ye = 0; ye < we.length; ye++) {
      const Le = (ye + 1) % we.length;
      fe.push(...we[ye], ...we[Le]);
    }
    const J = new _e();
    return J.setAttribute("position", new ht(new Float32Array(fe), 3)), { fill: D, outline: J };
  }
  function ae(X, K, T, V) {
    const Z = X / 2, N = K / 2, $ = V / 2, ne = [[0, -$, -N], [0, $, -N], [0, $, N - T], [0, Z, N - T], [0, Z, N], [0, -Z, N], [0, -Z, N - T], [0, -$, N - T]], he = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], re = [];
    for (const J of he) re.push(...ne[J]);
    const se = new _e();
    se.setAttribute("position", new ht(new Float32Array(re), 3));
    const D = [];
    for (let J = 0; J < ne.length; J++) {
      const we = (J + 1) % ne.length;
      D.push(...ne[J], ...ne[we]);
    }
    const fe = new _e();
    return fe.setAttribute("position", new ht(new Float32Array(D), 3)), { fill: se, outline: fe };
  }
  function E(X, K, T = 24) {
    const V = X / 2, Z = V - K, N = [];
    for (let re = 0; re < T; re++) {
      const se = re / T * Math.PI * 2, D = (re + 1) / T * Math.PI * 2, fe = Math.cos(se), J = Math.sin(se), we = Math.cos(D), ye = Math.sin(D);
      N.push(0, V * fe, V * J, 0, V * we, V * ye, 0, Z * we, Z * ye), N.push(0, V * fe, V * J, 0, Z * we, Z * ye, 0, Z * fe, Z * J);
    }
    const $ = new _e();
    $.setAttribute("position", new ht(new Float32Array(N), 3));
    const ne = [];
    for (let re = 0; re < T; re++) {
      const se = re / T * Math.PI * 2, D = (re + 1) / T * Math.PI * 2;
      ne.push(0, V * Math.cos(se), V * Math.sin(se), 0, V * Math.cos(D), V * Math.sin(D)), ne.push(0, Z * Math.cos(se), Z * Math.sin(se), 0, Z * Math.cos(D), Z * Math.sin(D));
    }
    const he = new _e();
    return he.setAttribute("position", new ht(new Float32Array(ne), 3)), { fill: $, outline: he };
  }
  const ie = new rt({ color: 52479, transparent: true, opacity: 0.35, side: zt, depthWrite: false }), ee = new pt({ color: 52479 }), Se = new rt({ color: 16750848, transparent: true, opacity: 0.4, side: zt, depthWrite: false }), ve = new pt({ color: 16750848 });
  function U(X, K) {
    const T = Math.abs(K[0] - X[0]), V = Math.abs(K[1] - X[1]), Z = Math.abs(K[2] - X[2]);
    return Z > T && Z > V || V > T && V > Z;
  }
  return W.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const X = l.secColumns.rawVal, K = l.secBeams.rawVal;
    if (!X && !K) {
      c.children.forEach(($) => {
        $ instanceof Ct && $.dispose();
      }), c.clear();
      return;
    }
    c.children.forEach(($) => {
      $ instanceof Ct && $.dispose();
    }), c.clear();
    const T = (_a2 = e.elements) == null ? void 0 : _a2.val, V = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!T || !V) return;
    const Z = V.sectionShapes, N = l.secFloor.rawVal;
    T.forEach(($, ne) => {
      if ($.length !== 2) return;
      const he = d.rawVal[$[0]], re = d.rawVal[$[1]];
      if (!he || !re) return;
      const se = U(he, re);
      if (se && !X || !se && !K) return;
      if (N >= 0) {
        const ye = Math.min(he[1], re[1]);
        Math.max(he[1], re[1]);
        const Le = l.gridSize.rawVal || 3;
        if (Math.floor(ye / Le + 0.01) !== N) return;
      }
      const D = Z == null ? void 0 : Z.get(ne);
      if (!D) return;
      const fe = [(he[0] + re[0]) / 2, (he[1] + re[1]) / 2, (he[2] + re[2]) / 2], J = jn(he, re);
      if (D.type === "CFT") {
        const ye = z(D.b, D.h, D.tw ?? D.b * 0.05), Le = new ot(ye.concFill, ie);
        Le.position.set(...fe), Le.rotation.setFromRotationMatrix(J), c.add(Le);
        const ke = new ot(ye.steelFillGeom, Se);
        ke.position.set(...fe), ke.rotation.setFromRotationMatrix(J), c.add(ke);
        const Ye = new Pt(ye.outline, ve);
        Ye.position.set(...fe), Ye.rotation.setFromRotationMatrix(J), c.add(Ye);
      } else {
        let ye, Le, ke;
        switch (D.type) {
          case "rect":
            ye = p(D.b, D.h), Le = ie, ke = ee;
            break;
          case "circ":
            ye = g(D.d), Le = ie, ke = ee;
            break;
          case "I":
            ye = y(D.b, D.h, D.tf, D.tw), Le = Se, ke = ve;
            break;
          case "HSS":
            ye = k(D.b, D.h, D.tw ?? D.b * 0.05), Le = Se, ke = ve;
            break;
          case "CFT":
            ye = z(D.b, D.h, D.tw ?? D.b * 0.05), Le = Se, ke = ve;
            break;
          case "L":
            ye = M(D.b ?? D.h, D.h, D.t ?? D.tw ?? 3e-3), Le = Se, ke = ve;
            break;
          case "2L":
            ye = H(D.b ?? D.h, D.h, D.t ?? D.tw ?? 3e-3, D.dis ?? 0.01), Le = Se, ke = ve;
            break;
          case "C":
          case "coldC":
            ye = le(D.b, D.h, D.tf ?? D.t ?? 3e-3, D.tw ?? D.t ?? 3e-3), Le = Se, ke = ve;
            break;
          case "2C":
            ye = pe(D.b, D.h, D.tf ?? 5e-3, D.tw ?? 5e-3, D.dis ?? 0.01), Le = Se, ke = ve;
            break;
          case "T":
            ye = ae(D.b, D.h, D.tf ?? 0.01, D.tw ?? 6e-3), Le = Se, ke = ve;
            break;
          case "pipe":
            ye = E(D.d, D.tw ?? D.d * 0.05), Le = Se, ke = ve;
            break;
          default:
            return;
        }
        const Ye = new ot(ye.fill, Le);
        Ye.position.set(...fe), Ye.rotation.setFromRotationMatrix(J), c.add(Ye);
        const Qe = new Pt(ye.outline, ke);
        Qe.position.set(...fe), Qe.rotation.setFromRotationMatrix(J), c.add(Qe);
      }
      const we = wa(D);
      if (we) {
        const Le = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(D.type) ? "#ff9900" : "#00ccff", ke = new Ct(we, Le, "transparent");
        ke.position.set(fe[0], fe[1], fe[2]);
        const Ye = 0.05 * l.gridSize.rawVal * 0.5;
        ke.updateScale(Ye * ((h == null ? void 0 : h.rawVal) ?? 1)), m.add(ke);
      }
    });
  }), h && W.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const X = 0.05 * l.gridSize.val * 0.5;
    m.children.forEach((K) => {
      K instanceof Ct && K.updateScale(X * h.rawVal);
    });
  }), W.derive(() => {
    c.visible = l.sections.val;
  }), W.derive(() => {
    m.visible = l.sectionLabels.val;
  }), c;
}
function xa(e) {
  if (!e) return null;
  const l = e.type, d = (z, M) => [z, M], h = (z, M) => [d(-z / 2, -M / 2), d(z / 2, -M / 2), d(z / 2, M / 2), d(-z / 2, M / 2)], c = (z, M = 24) => {
    const H = z / 2, le = [];
    for (let pe = 0; pe < M; pe++) {
      const ae = 2 * Math.PI * pe / M;
      le.push(d(H * Math.cos(ae), H * Math.sin(ae)));
    }
    return le;
  }, m = e.b ?? 0, p = e.h ?? 0, g = e.d ?? 0, y = e.tw ?? e.t ?? 0, k = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return m && p ? { contorno: h(m, p) } : null;
    case "circ":
      return g ? { contorno: c(g) } : null;
    case "pipe":
      return g && y ? { contorno: c(g), huecos: [c(g - 2 * y).reverse()] } : null;
    case "HSS":
      return m && p && y ? { contorno: h(m, p), huecos: [h(m - 2 * y, p - 2 * (k || y)).reverse()] } : null;
    case "CFT":
      return m && p ? { contorno: h(m, p) } : null;
    case "I":
      return m && p && y && k ? { contorno: [d(-m / 2, -p / 2), d(m / 2, -p / 2), d(m / 2, -p / 2 + k), d(y / 2, -p / 2 + k), d(y / 2, p / 2 - k), d(m / 2, p / 2 - k), d(m / 2, p / 2), d(-m / 2, p / 2), d(-m / 2, p / 2 - k), d(-y / 2, p / 2 - k), d(-y / 2, -p / 2 + k), d(-m / 2, -p / 2 + k)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return m && p && y && k ? { contorno: [d(-m / 2, -p / 2), d(m / 2, -p / 2), d(m / 2, -p / 2 + k), d(-m / 2 + y, -p / 2 + k), d(-m / 2 + y, p / 2 - k), d(m / 2, p / 2 - k), d(m / 2, p / 2), d(-m / 2, p / 2)] } : null;
    case "T":
      return m && p && y && k ? { contorno: [d(-y / 2, -p / 2), d(y / 2, -p / 2), d(y / 2, p / 2 - k), d(m / 2, p / 2 - k), d(m / 2, p / 2), d(-m / 2, p / 2), d(-m / 2, p / 2 - k), d(-y / 2, p / 2 - k)] } : null;
    case "L":
    case "2L":
      return m && p && y ? { contorno: [d(-m / 2, -p / 2), d(m / 2, -p / 2), d(m / 2, -p / 2 + y), d(-m / 2 + y, -p / 2 + y), d(-m / 2 + y, p / 2), d(-m / 2, p / 2)] } : null;
    default:
      return m && p ? { contorno: h(m, p) } : g ? { contorno: c(g) } : null;
  }
}
function ga(e, l, d) {
  if (!e || e <= 0 || !l || !d || l <= 0 || d <= 0) return null;
  const h = Math.sqrt(Math.sqrt(d / l)), c = Math.sqrt(e / h), m = e / c;
  return !isFinite(c) || !isFinite(m) || c <= 0 || m <= 0 ? null : { contorno: [[-c / 2, -m / 2], [c / 2, -m / 2], [c / 2, m / 2], [-c / 2, m / 2]] };
}
function va(e) {
  const l = new Cn();
  e.contorno.forEach(([d, h], c) => c ? l.lineTo(d, h) : l.moveTo(d, h)), l.closePath();
  for (const d of e.huecos ?? []) {
    const h = new Hs();
    d.forEach(([c, m], p) => p ? h.lineTo(c, m) : h.moveTo(c, m)), h.closePath(), l.holes.push(h);
  }
  return l;
}
function Ma(e, l, d) {
  const h = new nt();
  h.name = "extrusion";
  const c = new Mo({ color: 8369151, transparent: true, opacity: 0.92, side: zt }), m = new Mo({ color: 12623968, transparent: true, opacity: 0.85, side: zt }), p = new Mo({ color: 11583173, transparent: true, opacity: 0.85, side: zt }), g = new nt();
  g.add(new ws(16777215, 0.55));
  const y = new Jn(16777215, 0.75);
  y.position.set(30, 25, 40);
  const k = new Jn(16777215, 0.35);
  k.position.set(-25, -20, 15), g.add(y, k);
  let z = 0;
  return W.derive(() => {
    var _a2, _b, _c, _d, _e2;
    const M = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++z, on: M }, h.visible = M;
    for (const ee of [...h.children]) ee !== g && (h.remove(ee), (_c = (_b = ee.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(g) || h.add(g), !M) return;
    const H = d.val ?? [], le = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], pe = ((_e2 = e.elementInputs) == null ? void 0 : _e2.val) ?? {}, ae = pe.sectionShapes ?? /* @__PURE__ */ new Map(), E = pe.thicknesses ?? /* @__PURE__ */ new Map();
    let ie = "";
    try {
      le.forEach((ee, Se) => {
        var _a3, _b2, _c2;
        if (ee.length === 2) {
          let ve = xa(ae.get(Se)), U = true;
          if (ve || (ve = ga((_a3 = pe.areas) == null ? void 0 : _a3.get(Se), (_b2 = pe.momentsOfInertiaY) == null ? void 0 : _b2.get(Se), (_c2 = pe.momentsOfInertiaZ) == null ? void 0 : _c2.get(Se)), U = false), !ve) return;
          const X = H[ee[0]], K = H[ee[1]];
          if (!X || !K) return;
          const T = Math.hypot(K[0] - X[0], K[1] - X[1], K[2] - X[2]);
          if (T < 1e-9) return;
          const V = new Gs(va(ve), { depth: T, bevelEnabled: false, curveSegments: 4 });
          V.applyMatrix4(new zo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const Z = new ot(V, U ? c : m);
          Z.position.set(X[0], X[1], X[2]), Z.rotation.setFromRotationMatrix(jn(X, K)), h.add(Z);
          return;
        }
        if (ee.length === 3 || ee.length === 4) {
          const ve = E.get(Se);
          if (!ve || ve <= 0) return;
          const U = ee.map((J) => H[J]).filter(Boolean);
          if (U.length < 3) return;
          const X = [U[1][0] - U[0][0], U[1][1] - U[0][1], U[1][2] - U[0][2]], K = [U[2][0] - U[0][0], U[2][1] - U[0][1], U[2][2] - U[0][2]], T = X[1] * K[2] - X[2] * K[1], V = X[2] * K[0] - X[0] * K[2], Z = X[0] * K[1] - X[1] * K[0], N = Math.hypot(T, V, Z);
          if (N < 1e-12) return;
          const $ = [T / N, V / N, Z / N], ne = [], he = (J) => U.map((we) => [we[0] + $[0] * J, we[1] + $[1] * J, we[2] + $[2] * J]), re = he(+ve / 2), se = he(-ve / 2), D = (J, we, ye) => ne.push(...J, ...we, ...ye);
          for (const J of [re, se]) D(J[0], J[1], J[2]), J.length === 4 && D(J[0], J[2], J[3]);
          for (let J = 0; J < U.length; J++) {
            const we = (J + 1) % U.length;
            D(re[J], se[J], se[we]), D(re[J], se[we], re[we]);
          }
          const fe = new _e();
          fe.setAttribute("position", new St(ne, 3)), fe.computeVertexNormals(), h.add(new ot(fe, p));
        }
      });
    } catch (ee) {
      ie = String((ee == null ? void 0 : ee.message) ?? ee);
    }
    globalThis.__extrusionDebug = { corridas: z, on: M, fallo: ie, nElementos: le.length, nFormas: ae.size, nEspesores: E.size, mallas: h.children.length - 1 };
  }), h;
}
class Kn extends nt {
  constructor(l, d, h, c, m, p, g) {
    super();
    const y = new Cn().moveTo(0, 0).lineTo(0, p[1]).lineTo(h, p[1]).lineTo(h, 0).lineTo(0, 0), k = y.getPoints(), z = new _e().setFromPoints(k);
    this.lines = new Pt(z, new pt({ color: ln().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const M = new On(y), H = new rt({ color: p[1] > 0 ? 24435 : 11411474, side: zt });
    this.mesh = new ot(M, H), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Ct(`${m[1].toFixed(4)}`), this.normalizedResult = p, this.textPosition = zn([l, d]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class cs extends nt {
  constructor(l, d, h, c, m, p, g) {
    super();
    const y = m[0] * h / (m[0] + m[1]), k = m[0] * m[1] > 0;
    if (this.text = new Ct(`${m[0].toFixed(4)}`), this.text2 = new Ct(`${(m[1] * -1).toFixed(4)}`), this.normalizedResult = p, this.textPosition = Po(l, d), this.text2Position = Po(d, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), k) {
      const z = new Cn().moveTo(0, 0).lineTo(0, p[0]).lineTo(y, 0).lineTo(0, 0), M = new Cn().moveTo(y, 0).lineTo(h, -p[1]).lineTo(h, 0).lineTo(y, 0), H = z.getPoints(), le = M.getPoints(), pe = new _e().setFromPoints(H), ae = new _e().setFromPoints(le), E = new pt({ color: ln().resultOutline });
      this.lines = new Pt(pe, E), this.lines2 = new Pt(ae, E), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), g && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ie = new On(z), ee = new On(M), Se = new rt({ color: p[0] > 0 ? 24435 : 11411474, side: zt }), ve = new rt({ color: -p[1] > 0 ? 24435 : 11411474, side: zt });
      this.mesh = new ot(ie, Se), this.mesh2 = new ot(ee, ve), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), g && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const z = new Cn().moveTo(0, 0).lineTo(0, p[0]).lineTo(h, -p[1]).lineTo(h, 0).lineTo(0, 0), M = z.getPoints(), H = new _e().setFromPoints(M);
      this.lines = new Pt(H, new pt({ color: ln().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const le = new On(z), pe = new rt({ color: p[0] > 0 ? 24435 : 11411474, side: zt });
      this.mesh = new ot(le, pe), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(l) {
    var _a2, _b;
    this.lines.scale.set(1, l * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text2.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * l), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e2, _f;
    this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e2 = this.mesh2) == null ? void 0 : _e2.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var bs = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(bs || {});
function ba(e, l, d, h) {
  const c = () => {
    const g = d.rawVal;
    if (!(g == null ? void 0 : g.length)) return 0.05 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
    for (const M of g) for (let H = 0; H < 3; H++) M[H] < y[H] && (y[H] = M[H]), M[H] > k[H] && (k[H] = M[H]);
    const z = Math.hypot(k[0] - y[0], k[1] - y[1], k[2] - y[2]);
    return !isFinite(z) || z <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * z;
  }, m = new nt(), p = { normals: Kn, shearsY: Kn, shearsZ: Kn, torsions: Kn, bendingsY: cs, bendingsZ: cs };
  return W.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, d.val, l.frameResults.val == "none") return;
    m.children.forEach((y) => y.dispose()), m.clear();
    const g = bs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[g]) == null ? void 0 : _b.forEach((y, k) => {
      var _a3, _b2;
      const z = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[k]) ?? [0, 1], M = d.rawVal[z[0]], H = d.rawVal[z[1]];
      if (!M || !H) return;
      const le = new b(...H).distanceTo(new b(...M)), pe = _a((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[g]), ae = y == null ? void 0 : y.map((ee) => ee / (pe === 0 ? 1 : pe)), E = jn(M, H), ie = new p[g](M, H, le, E, y ?? [0, 0], ae ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(g));
      ie.updateScale(c() * h.rawVal), m.add(ie);
    });
  }), W.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const g = c();
    m.children.forEach((y) => y.updateScale(g * h.rawVal));
  }), W.derive(() => {
    m.visible = l.frameResults.val != "none";
  }), m;
}
function _a(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((d) => {
    const h = Math.max(...(d ?? [0, 0]).map((c) => Math.abs(c)));
    h > l && (l = h);
  }), l;
}
class Sa extends nt {
  constructor(l, d, h) {
    super();
    const c = d === Ao.reactions;
    h[0] && (this.xText1 = new Ct(`${c ? "Fx" : "Dx"}: ` + h[0].toFixed(4))), h[3] && (this.xText2 = new Ct(`${c ? "Mx" : "Rx"}: ` + h[3].toFixed(4))), h[1] && (this.yText1 = new Ct(`${c ? "Fy" : "Dy"}: ` + h[1].toFixed(4))), h[4] && (this.yText2 = new Ct(`${c ? "My" : "Ry"}: ` + h[4].toFixed(4))), h[2] && (this.zText1 = new Ct(`${c ? "Fz" : "Dz"}: ` + h[2].toFixed(4))), h[5] && (this.zText2 = new Ct(`${c ? "Mz" : "Rz"}: ` + h[5].toFixed(4))), (h[0] || h[3]) && (this.xArrow = new an(new b(1, 0, 0), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[1] || h[4]) && (this.yArrow = new an(new b(0, 1, 0), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[2] || h[5]) && (this.zArrow = new an(new b(0, 0, 1), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(l) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(l, l, l), (_b = this.yArrow) == null ? void 0 : _b.scale.set(l, l, l), (_c = this.zArrow) == null ? void 0 : _c.scale.set(l, l, l), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * l, 0, 0), (_e2 = this.xText2) == null ? void 0 : _e2.position.set(1.3 * l, 0, 0.5 * l), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * l, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * l, 0.5 * l), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * l), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * l + 0.5 * l), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * l), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * l), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * l), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * l), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * l), (_o2 = this.zText2) == null ? void 0 : _o2.updateScale(0.4 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e2 = this.xText2) == null ? void 0 : _e2.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var Ao = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(Ao || {});
function ka(e, l, d, h) {
  const c = new nt();
  return W.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    c.children.forEach((g) => g.dispose()), c.clear();
    const m = Ao[l.nodeResults.rawVal], p = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[m]) == null ? void 0 : _b.forEach((g, y) => {
      const k = new Sa(d.rawVal[y], m, g ?? [0, 0, 0, 0, 0, 0]);
      k.updateScale(p * h.rawVal), c.add(k);
    });
  }), W.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const m = 0.05 * l.gridSize.val;
    c.children.forEach((p) => p.updateScale(m * h.rawVal));
  }), W.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function Pa({ drawingObj: e, gridObj: l, scene: d, getActiveCamera: h, controls: c, gridSize: m, derivedDisplayScale: p, rendererElm: g, viewerRender: y }) {
  const k = new Ws(), z = new Os(), M = (t) => {
    const o = g.getBoundingClientRect(), s = t.clientX - o.left, n = t.clientY - o.top, a = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const f = a / 2;
      if (s >= f) return z.x = (s - f) / f * 2 - 1, z.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      z.x = s / f * 2 - 1;
    } else z.x = s / a * 2 - 1;
    return z.y = -(n / i) * 2 + 1, h();
  }, H = new ot(new tn(1e4, 1e4), new rt({ side: zt, transparent: true, opacity: 0, depthWrite: false }));
  H.visible = true, H.frustumCulled = false, d.add(H);
  const le = (t, o, s) => {
    const n = new ot(new tn(1e4, 1e4), new rt({ side: zt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, s), n.visible = false, n.frustumCulled = false, d.add(n), n;
  }, pe = le(Math.PI / 2, 0, 0), ae = le(0, Math.PI / 2, 0);
  let E = false;
  const ie = () => {
    if (E) return k.intersectObjects([H], false);
    if (pe.visible = !!window.__hekatanGridPlaneXZ, ae.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Xe.visible) {
      const s = k.intersectObjects([Xe, De, Ne], false);
      if (s.length > 0) return s;
    }
    const o = [H];
    return pe.visible && o.push(pe), ae.visible && o.push(ae), Zt.visible && cn.length > 0 && o.push(...cn), k.intersectObjects(o, false);
  }, ee = new Hn(new _e(), new Wn()), Se = new Hn(new _e(), new Wn({ color: "gray", sizeAttenuation: false, size: 6 })), ve = new Hn(new _e(), new Wn({ color: "orange", sizeAttenuation: false, size: 5 }));
  d.add(ve);
  const U = document.createElement("input");
  U.id = "hk-rubber-label", U.type = "text", U.spellcheck = false, U.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, U.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(U);
  let X = null, K = null, T = false;
  const V = new b(), Z = (t, o, s, n, a, i) => {
    const r = n - t, f = a - o, w = i - s, x = Math.hypot(r, f, w);
    if (x < 0.01) {
      U.style.display = "none";
      return;
    }
    X = [t, o, s], K = [r / x, f / x, w / x], V.set((t + n) / 2, (o + a) / 2, (s + i) / 2), V.project(h());
    const S = g.getBoundingClientRect(), _ = S.left + (V.x * 0.5 + 0.5) * S.width, u = S.top + (-V.y * 0.5 + 0.5) * S.height;
    if (U.style.left = _ + "px", U.style.top = u + "px", U.style.display = "block", !T) {
      if (U.value = `${x.toFixed(2)} m`, document.activeElement !== U) {
        const F = document.activeElement;
        F && (F.tagName === "INPUT" || F.tagName === "TEXTAREA") && F !== U || U.focus({ preventScroll: true });
      }
      try {
        U.select();
      } catch {
      }
    }
  }, N = () => {
    U.style.display = "none", X = null, K = null, T = false, document.activeElement === U && U.blur();
  }, $ = (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      sn = t, oe(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), U.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && $e.length === 1) {
      const S = $e[0];
      $e = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, S[0], S[1], S[2], t), oe(`\u2713 C\xEDrculo r=${t} m en (${S[0].toFixed(2)}, ${S[1].toFixed(2)}, ${S[2].toFixed(2)}).`);
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
      gt = t, oe(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), U.blur();
      return;
    }
    if (!X || !K || !e.polylines) return;
    let s = K[0], n = K[1], a = K[2];
    ct === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : ct === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : ct === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const i = X[0] + s * t, r = X[1] + n * t, f = X[2] + a * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, f]];
    const w = e.polylines.rawVal, x = w.length ? w[w.length - 1] : [];
    e.polylines.val = [...w.slice(0, -1), [...x, e.points.rawVal.length - 1]], U.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    y();
  }, ne = (t) => {
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
        const [i, r, f] = a;
        return { kind: "relSpherical", L: i, az: r, el: f };
      }
      return null;
    }
    if (o.includes(",")) {
      const a = o.split(",").map((w) => parseFloat(w.trim()));
      if (a.some(isNaN)) return null;
      const [i, r, f = 0] = a;
      return s ? { kind: "relCart", dx: i, dy: r, dz: f } : { kind: "absCart", x: i, y: r, z: f };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, he = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return X ? [X[0] + t.dx, X[1] + t.dy, X[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!X) return null;
      const o = t.ang * Math.PI / 180;
      return [X[0] + t.L * Math.cos(o), X[1] + t.L * Math.sin(o), X[2]];
    }
    if (t.kind === "relSpherical") {
      if (!X) return null;
      const o = t.az * Math.PI / 180, s = t.el * Math.PI / 180, n = t.L * Math.cos(s);
      return [X[0] + n * Math.cos(o), X[1] + n * Math.sin(o), X[2] + t.L * Math.sin(s)];
    }
    return null;
  }, re = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...s, e.points.rawVal.length - 1]], X = t, U.blur();
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
    const o = ne(t);
    if (!o) return false;
    if (o.kind === "length") return $(o.L), true;
    const s = he(o);
    if (!s) return false;
    Ho(new b(s[0], s[1], s[2]), null), X = s, U.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, U.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const s = ne(U.value);
      if (!s) return;
      if (T = false, s.kind === "length") $(s.L), oe(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = he(s);
        if (!n) return;
        re(n);
        const a = s.kind;
        oe(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), T = false, U.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!T && U.style.display === "block") try {
          U.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && (T = true);
  }), window.addEventListener("keydown", (t) => {
    if (!X || !K || document.activeElement === U) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (U.value = t.key, U.focus(), U.setSelectionRange(1, 1), t.preventDefault());
  });
  const se = document.createElement("div");
  se.id = "hk-coord-readout", se.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", se.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(se);
  const D = document.createElement("div");
  D.id = "hk-coord-fixed", D.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", D.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(D);
  const fe = new Pt(new _e().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), new kn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  fe.frustumCulled = false, fe.visible = false, fe.name = "rubberBand", d.add(fe), window.__hekatanRubberBand = fe;
  const J = new Pt(new _e(), new pt({ color: 2282478, transparent: true, opacity: 0.9 }));
  J.frustumCulled = false, J.visible = false, d.add(J);
  let we = [];
  const ye = new nt(), Le = new ot(new tn(1, 1), new rt({ color: 2282478, transparent: true, opacity: 0.08, side: zt, depthWrite: false })), ke = new Ht(new ts(new tn(1, 1)), new pt({ color: 2282478, transparent: true, opacity: 0.85 })), Ye = new Ht(new _e(), new pt({ color: 2282478, transparent: true, opacity: 0.3 })), Qe = (t, o) => {
    const s = [], n = Math.ceil(t / o);
    for (let a = -n; a <= n; a++) {
      const i = a * o;
      s.push(-t, i, 0, t, i, 0), s.push(i, -t, 0, i, t, 0);
    }
    Ye.geometry.dispose(), Ye.geometry = new _e(), Ye.geometry.setAttribute("position", new St(s, 3));
  };
  ye.add(Le, ke, Ye), ye.visible = false, ye.frustumCulled = false, d.add(ye);
  const mt = new nt();
  mt.frustumCulled = false, mt.visible = false, d.add(mt);
  const Ft = (t) => {
    const o = new _e().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), s = new kn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Pt(o, s);
  }, P = Ft(16711680), L = Ft(65280), Q = Ft(35071);
  mt.add(P, L, Q);
  const I = Ft(16761856);
  I.material.dashSize = 0.28, I.material.gapSize = 0.16, I.material.opacity = 0.9, I.frustumCulled = false, I.visible = false, I.renderOrder = 98, d.add(I);
  const ue = (t) => {
    const o = new _e().setFromPoints([new b(0, 0, 0), new b(0, 0, 0), new b(0, 0, 0), new b(0, 0, 0)]), s = new pt({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new ms(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, xe = ue(3462041), be = ue(16724804), Pe = ue(6333946), Te = new nt();
  Te.frustumCulled = false, Te.visible = false, d.add(Te), Te.add(xe, be, Pe);
  const Re = (t) => {
    const o = new tn(1, 1), s = new rt({ color: t, transparent: true, opacity: 0.06, side: zt, depthWrite: false }), n = new ot(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Xe = Re(3462041), De = Re(16724804), Ne = Re(6333946);
  Te.add(Xe, De, Ne);
  const ut = (t, o, s, n) => {
    t.scale.set(2 * n, 2 * n, 1), s === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : s === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, Ie = document.createElement("div");
  Ie.id = "hk-refplane-badge", Ie.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ie), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, Te.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      je(xe, i, "xy", r), je(be, i, "xz", r), je(Pe, i, "yz", r), ut(Xe, i, "xy", r), ut(De, i, "xz", r), ut(Ne, i, "yz", r), Xe.material.opacity = 0.05, De.material.opacity = 0.05, Ne.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    y();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !Te.visible) {
      y();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    je(xe, i, "xy", t), je(be, i, "xz", t), je(Pe, i, "yz", t), ut(Xe, i, "xy", t), ut(De, i, "xz", t), ut(Ne, i, "yz", t), y();
  };
  const wt = (t) => {
    if (Xe.material.opacity = t === "xy" ? 0.09 : 0.025, De.material.opacity = t === "xz" ? 0.09 : 0.025, Ne.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      Ie.style.background = a.bg, Ie.style.color = a.text, Ie.textContent = `\u25A6 Plano ${t.toUpperCase()}`, Ie.style.display = "block";
    } else Ie.style.display = "none";
  }, je = (t, o, s, n) => {
    let a;
    s === "xy" ? a = [new b(o[0] - n, o[1] - n, o[2]), new b(o[0] + n, o[1] - n, o[2]), new b(o[0] + n, o[1] + n, o[2]), new b(o[0] - n, o[1] + n, o[2]), new b(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new b(o[0] - n, o[1], o[2] - n), new b(o[0] + n, o[1], o[2] - n), new b(o[0] + n, o[1], o[2] + n), new b(o[0] - n, o[1], o[2] + n), new b(o[0] - n, o[1], o[2] - n)] : a = [new b(o[0], o[1] - n, o[2] - n), new b(o[0], o[1] + n, o[2] - n), new b(o[0], o[1] + n, o[2] + n), new b(o[0], o[1] - n, o[2] + n), new b(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(a);
  };
  let ct = null;
  window.__hekatanAxisLock = () => ct;
  let ft = null, Nt = null;
  const st = document.createElement("div");
  st.id = "hk-axis-lock-badge", st.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(st);
  const Ge = () => {
    if (!ct) {
      st.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    st.style.background = "rgba(15,23,42,0.92)", st.style.color = t[ct], st.style.border = `1.5px solid ${t[ct]}`, st.textContent = `\u{1F512} LOCK ${ct.toUpperCase()}`, st.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== U) return;
    const s = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && we.length >= 3) {
      const a = yn();
      oe(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") ct = ct === s ? null : s, Ge(), t.preventDefault();
    else if (t.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Zo(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Dn(), oe(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (mt.visible = false), oe(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
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
  const Be = new b(), Ce = new b(), We = new b(), Fe = (t) => {
    if (!ct) return null;
    const o = t[0], s = t[1], n = t[2];
    return ct === "x" ? (Be.set(o - 1e4, s, n), Ce.set(o + 1e4, s, n)) : ct === "y" ? (Be.set(o, s - 1e4, n), Ce.set(o, s + 1e4, n)) : (Be.set(o, s, n - 1e4), Ce.set(o, s, n + 1e4)), k.ray.distanceSqToSegment(Be, Ce, null, We), We;
  };
  window.__hekatanProjectOnAxis = Fe;
  const Ze = new Pt(new _e().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), new pt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Ze.renderOrder = 998, Ze.frustumCulled = false, Ze.visible = false, d.add(Ze);
  let Je = -1, Mt = -1, Ue = -1;
  const me = /* @__PURE__ */ new Set();
  window.__hekatanSelection = me;
  const dt = new Pt(new _e().setFromPoints([new b(), new b()]), new pt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  dt.renderOrder = 997, dt.frustumCulled = false, dt.visible = false, d.add(dt);
  const at = new ot(new mn(0.02, 12, 12), new rt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  at.renderOrder = 998, at.visible = false, d.add(at);
  const Gt = (t) => {
    const o = h();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(t);
    return Math.max(0.05, s / 10);
  }, Wt = () => {
    at.visible && at.scale.setScalar(Gt(at.position));
  }, yt = new nt();
  yt.frustumCulled = false, d.add(yt);
  const bt = 2282478;
  let Et = null;
  const An = (t, o, s, n) => {
    if (!e.points) return -1;
    const a = e.points.rawVal;
    let i = -1, r = n;
    for (let f = 0; f < a.length; f++) {
      const w = a[f];
      if (!w) continue;
      const x = Math.hypot(t - w[0], o - w[1], s - w[2]);
      x < r && (r = x, i = f);
    }
    return i;
  }, Lt = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; yt.children.length; ) {
      const r = yt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of me) {
      const [f, ...w] = r.split(":");
      if (f === "pt") {
        const x = t[+w[0]];
        if (!x) continue;
        const S = new ot(new mn(0.025, 12, 12), new rt({ color: bt, transparent: true, opacity: 0.9, depthTest: false }));
        S.position.set(x[0], x[1], x[2]), S.renderOrder = 999, S.__isSelectionPt = true, yt.add(S);
      } else if (f === "seg") {
        const x = o[+w[0]], S = t[x == null ? void 0 : x[+w[1]]], _ = t[x == null ? void 0 : x[+w[1] + 1]];
        if (!S || !_) continue;
        const u = new _e().setFromPoints([new b(S[0], S[1], S[2]), new b(_[0], _[1], _[2])]), F = new Pt(u, new pt({ color: bt, transparent: true, opacity: 0.95, depthTest: false }));
        F.renderOrder = 999, yt.add(F);
      } else if (f === "poly") {
        const S = o[+w[0]].map((F) => {
          const j = t[F];
          return j ? new b(j[0], j[1], j[2]) : null;
        }).filter(Boolean);
        if (S.length < 2) continue;
        const _ = new _e().setFromPoints(S), u = new Pt(_, new pt({ color: bt, transparent: true, opacity: 0.95, depthTest: false }));
        u.renderOrder = 999, yt.add(u);
      } else if (f === "aux") {
        const x = n[+w[0]];
        if (!x || x.length !== 6) continue;
        const S = new _e().setFromPoints([new b(x[0], x[1], x[2]), new b(x[3], x[4], x[5])]), _ = new Pt(S, new pt({ color: bt, transparent: true, opacity: 0.95, depthTest: false }));
        _.renderOrder = 999, yt.add(_);
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
  window.__hekatanRefreshSelection = Lt, window.__hekatanClearSelection = () => {
    me.clear(), Lt();
  };
  const Jt = (t, o, s, n, a, i, r, f, w) => {
    const x = r - n, S = f - a, _ = w - i, u = x * x + S * S + _ * _;
    if (u < 1e-12) return Math.hypot(t - n, o - a, s - i);
    let F = ((t - n) * x + (o - a) * S + (s - i) * _) / u;
    F = Math.max(0, Math.min(1, F));
    const j = n + F * x, O = a + F * S, Y = i + F * _;
    return Math.hypot(t - j, o - O, s - Y);
  }, jt = (t, o, s, n) => {
    if (!e.polylines) return null;
    const a = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, f = -1, w = n;
    for (let x = 0; x < a.length; x++) {
      const S = a[x];
      for (let _ = 0; _ < S.length - 1; _++) {
        const u = i[S[_]], F = i[S[_ + 1]];
        if (!u || !F) continue;
        const j = Jt(t, o, s, u[0], u[1], u[2], F[0], F[1], F[2]);
        j < w && (w = j, r = x, f = _);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: f, dist: w } : null;
  }, En = (t, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let r = -1, f = n;
    for (let w = 0; w < i.length; w++) {
      const x = i[w];
      if (!x || x.length !== 6) continue;
      const S = Jt(t, o, s, x[0], x[1], x[2], x[3], x[4], x[5]);
      S < f && (f = S, r = w);
    }
    return r;
  }, eo = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      Ze.visible = false;
      return;
    }
    Ze.geometry.setFromPoints([new b(n[0], n[1], n[2]), new b(n[3], n[4], n[5])]), Ze.visible = true;
  }, to = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!s || s.length < 2) {
      Ze.visible = false;
      return;
    }
    const a = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (a || o < 0 || o >= s.length - 1) for (const r of s) {
      const f = n[r];
      f && i.push(new b(f[0], f[1], f[2]));
    }
    else {
      const r = n[s[o]], f = n[s[o + 1]];
      r && i.push(new b(r[0], r[1], r[2])), f && i.push(new b(f[0], f[1], f[2]));
    }
    Ze.geometry.setFromPoints(i), Ze.visible = true;
  }, rn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const s = o.filter((w, x) => x !== t), n = /* @__PURE__ */ new Set();
    for (const w of s) for (const x of w) n.add(x);
    const a = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let w = 0; w < a.length; w++) n.has(w) && (i.set(w, r.length), r.push(a[w]));
    const f = s.map((w) => w.map((x) => i.get(x)).filter((x) => x !== void 0));
    e.points.val = r, e.polylines.val = f, e.areas && (e.areas.val = e.areas.rawVal.filter((w) => w !== t).map((w) => w > t ? w - 1 : w)), Ze.visible = false, Je = -1, Mt = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, Vn = (t, o) => {
    var _a2, _b, _c;
    if (!e.polylines) return;
    const s = e.polylines.rawVal;
    if (t < 0 || t >= s.length) return;
    if (((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false) {
      rn(t);
      return;
    }
    const a = s[t];
    if (o < 0 || o >= a.length - 1) return;
    if (a.length === 2) {
      rn(t);
      return;
    }
    let i;
    o === 0 ? i = [a.slice(1)] : o === a.length - 2 ? i = [a.slice(0, -1)] : i = [a.slice(0, o + 1), a.slice(o + 1)];
    const r = [...s.slice(0, t), ...i, ...s.slice(t + 1)], f = /* @__PURE__ */ new Set();
    for (const u of r) for (const F of u) f.add(F);
    const w = e.points.rawVal, x = /* @__PURE__ */ new Map(), S = [];
    for (let u = 0; u < w.length; u++) f.has(u) && (x.set(u, S.length), S.push(w[u]));
    const _ = r.map((u) => u.map((F) => x.get(F)).filter((F) => F !== void 0));
    if (e.points.val = S, e.polylines.val = _, e.areas) {
      const u = i.length - 1;
      e.areas.val = e.areas.rawVal.map((F) => F > t ? F + u : F);
    }
    Ze.visible = false, Je = -1, Mt = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  ee.geometry.setAttribute("position", new St(e.points.rawVal.flat(), 3)), ee.geometry.computeBoundingSphere(), ee.frustumCulled = false, Se.frustumCulled = false, d.add(Se), H.position.set(0, 0, 0), H.rotateX(Math.PI / 2), H.geometry.rotateX(Math.PI / 2), H.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, s) => {
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
  const nn = [];
  window.__hekatanCirculos = nn;
  let Tn = [], wn = "";
  const $n = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], s = `${t.length}|${o.length}|${o.reduce((a, i) => a + i.length, 0)}`;
    if (s === wn) return Tn;
    wn = s;
    const n = [];
    for (const a of o) {
      const i = a.length;
      if (i < 6 || a[0] !== a[i - 1]) continue;
      const r = a.slice(0, i - 1).map((S) => t[S]).filter(Boolean);
      if (r.length < 5) continue;
      const f = [0, 1, 2].map((S) => r.reduce((_, u) => _ + u[S], 0) / r.length), w = r.map((S) => Math.hypot(S[0] - f[0], S[1] - f[1], S[2] - f[2])), x = w.reduce((S, _) => S + _, 0) / w.length;
      x < 1e-9 || w.some((S) => Math.abs(S - x) > 5e-3 * x) || n.push({ c: f, r: x });
    }
    return Tn = n;
  };
  window.__hekatanCentrosDeducidos = $n, window.__hekatanDrawCircle = (t, o, s, n, a = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(a)), f = e.points.rawVal.length, w = [];
    for (let x = 0; x < r; x++) {
      const S = 2 * Math.PI * x / r, _ = n * Math.cos(S), u = n * Math.sin(S);
      let F;
      i === "xy" ? F = [t + _, o + u, s] : i === "xz" ? F = [t + _, o, s + u] : F = [t, o + _, s + u], w.push(F);
    }
    if (e.points.val = [...e.points.rawVal, ...w], nn.push({ c: [t, o, s], r: n }), e.polylines) {
      const x = [...w.map((_, u) => f + u), f], S = e.polylines.rawVal;
      ((_a2 = S[S.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...S, x, []] : e.polylines.val = [...S.slice(0, -1), x, []];
    }
  }, window.__hekatanDrawArc = (t, o, s, n = window.__hekatanArcSegs ?? 12) => {
    const a = Math.max(4, Math.round(n)), i = new b(...t), r = new b(...o), f = new b(...s), w = new b().subVectors(r, i), x = new b().subVectors(f, i), S = new b().crossVectors(w, x).normalize(), _ = new b().addVectors(i, r).multiplyScalar(0.5), u = new b().addVectors(r, f).multiplyScalar(0.5), F = new b().crossVectors(w, S).normalize(), j = new b().crossVectors(new b().subVectors(f, r), S).normalize(), O = new b().subVectors(u, _), Y = F.x * j.y - F.y * j.x;
    let v;
    if (Math.abs(Y) > 1e-9) {
      const de = (O.x * j.y - O.y * j.x) / Y;
      v = new b().addVectors(_, F.clone().multiplyScalar(de));
    } else v = _.clone();
    const A = i.distanceTo(v), C = new b().subVectors(i, v), B = new b().subVectors(f, v), q = Math.acos(Math.max(-1, Math.min(1, C.dot(B) / (A * A)))), R = e.points.rawVal.length, G = [], ce = S.clone();
    for (let de = 0; de <= a; de++) {
      const Me = de / a, Oe = q * Me, Ee = new Zn().setFromAxisAngle(ce, Oe), et = C.clone().applyQuaternion(Ee).add(v);
      G.push([et.x, et.y, et.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...G], nn.push({ c: [v.x, v.y, v.z], r: A }), e.polylines) {
      const de = G.map((Oe, Ee) => R + Ee), Me = e.polylines.rawVal;
      e.polylines.val = [...Me.slice(0, -1), de, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, s = 1, n = 6, a = 6) => {
    const i = Math.min(t[0], o[0]), r = Math.max(t[0], o[0]), f = Math.min(t[1], o[1]), w = Math.max(t[1], o[1]), x = (t[2] + o[2]) / 2, S = r - i, _ = w - f, u = Math.min(s, S / 2 - 0.01, _ / 2 - 0.01);
    if (u <= 0) return;
    const F = e.points.rawVal.length, j = [], O = [], Y = (v, A) => {
      j.push([v, A, x]), O.push(F + j.length - 1);
    };
    for (let v = 0; v <= a; v++) Y(i + u + (S - 2 * u) * v / a, f);
    for (let v = 1; v <= n; v++) {
      const A = -Math.PI / 2 + Math.PI / 2 * v / n;
      Y(r - u + u * Math.cos(A), f + u + u * Math.sin(A));
    }
    for (let v = 1; v <= a; v++) Y(r, f + u + (_ - 2 * u) * v / a);
    for (let v = 1; v <= n; v++) {
      const A = 0 + Math.PI / 2 * v / n;
      Y(r - u + u * Math.cos(A), w - u + u * Math.sin(A));
    }
    for (let v = 1; v <= a; v++) Y(r - u - (S - 2 * u) * v / a, w);
    for (let v = 1; v <= n; v++) {
      const A = Math.PI / 2 + Math.PI / 2 * v / n;
      Y(i + u + u * Math.cos(A), w - u + u * Math.sin(A));
    }
    for (let v = 1; v <= a; v++) Y(i, w - u - (_ - 2 * u) * v / a);
    for (let v = 1; v <= n; v++) {
      const A = Math.PI + Math.PI / 2 * v / n;
      Y(i + u + u * Math.cos(A), f + u + u * Math.sin(A));
    }
    if (O.push(F), e.points.val = [...e.points.rawVal, ...j], e.polylines) {
      const v = e.polylines.rawVal;
      e.polylines.val = [...v.slice(0, -1), O, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], r = o[0], f = o[1], w = o[2];
    let x;
    if (Math.abs(i - w) < 1e-6 ? x = [[n, a, i], [r, a, i], [r, f, i], [n, f, i]] : Math.abs(a - f) < 1e-6 ? x = [[n, a, i], [r, a, i], [r, a, w], [n, a, w]] : x = [[n, a, i], [n, f, i], [n, f, w], [n, a, w]], e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const S = [s, s + 1, s + 2, s + 3, s], _ = e.polylines.rawVal;
      e.polylines.val = [..._.slice(0, -1), S, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], r = o[0], f = o[1], w = o[2];
    let x;
    if (E && e.gridTarget) {
      const S = e.gridTarget.rawVal, _ = new Pn(...S.rotation), u = new b(1, 0, 0).applyEuler(_), F = new b(0, 1, 0).applyEuler(_), j = new b(...S.position), O = new b(n, a, i), Y = new b(r, f, w), v = O.clone().sub(j).dot(u), A = O.clone().sub(j).dot(F), C = Y.clone().sub(j).dot(u), B = Y.clone().sub(j).dot(F), q = (R, G) => j.clone().addScaledVector(u, R).addScaledVector(F, G).toArray();
      x = [q(v, A), q(C, A), q(C, B), q(v, B)];
    } else Math.abs(i - w) < 1e-6 ? x = [[n, a, i], [r, a, i], [r, f, i], [n, f, i]] : Math.abs(a - f) < 1e-6 ? x = [[n, a, i], [r, a, i], [r, a, w], [n, a, w]] : x = [[n, a, i], [n, f, i], [n, f, w], [n, a, w]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const S = e.polylines.rawVal, _ = S.length - 1, u = [s, s + 1, s + 2, s + 3, s];
      e.polylines.val = [...S.slice(0, -1), u, []], e.areas && (e.areas.val = [...e.areas.rawVal, _]);
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
    for (let ge = 0; ge < s; ge++) {
      const Ae = t[ge], Ke = t[(ge + 1) % s];
      n += (Ae[1] - Ke[1]) * (Ae[2] + Ke[2]), a += (Ae[2] - Ke[2]) * (Ae[0] + Ke[0]), i += (Ae[0] - Ke[0]) * (Ae[1] + Ke[1]);
    }
    const r = Math.hypot(n, a, i) || 1;
    n /= r, a /= r, i /= r;
    let f = t[1][0] - t[0][0], w = t[1][1] - t[0][1], x = t[1][2] - t[0][2];
    const S = Math.hypot(f, w, x) || 1;
    f /= S, w /= S, x /= S;
    let _ = a * x - i * w, u = i * f - n * x, F = n * w - a * f;
    const j = Math.hypot(_, u, F) || 1;
    _ /= j, u /= j, F /= j;
    const O = t[0], Y = (ge) => [(ge[0] - O[0]) * f + (ge[1] - O[1]) * w + (ge[2] - O[2]) * x, (ge[0] - O[0]) * _ + (ge[1] - O[1]) * u + (ge[2] - O[2]) * F], v = (ge, Ae) => [O[0] + ge * f + Ae * _, O[1] + ge * w + Ae * u, O[2] + ge * x + Ae * F], A = t.map(Y);
    let C = 1 / 0, B = -1 / 0, q = 1 / 0, R = -1 / 0;
    for (const [ge, Ae] of A) ge < C && (C = ge), ge > B && (B = ge), Ae < q && (q = Ae), Ae > R && (R = Ae);
    const G = B - C, ce = R - q;
    if (G < 1e-6 || ce < 1e-6) return 0;
    let de = o && o > 0 ? o : 0.5;
    for (; G / de * (ce / de) > 2500; ) de *= 2;
    de = Math.min(de, Math.min(G, ce));
    const Me = (ge, Ae) => {
      let Ke = false;
      for (let Tt = 0, Dt = A.length - 1; Tt < A.length; Dt = Tt++) {
        const [$t, Qt] = A[Tt], [yo, Yn] = A[Dt];
        Qt > Ae != Yn > Ae && ge < (yo - $t) * (Ae - Qt) / (Yn - Qt) + $t && (Ke = !Ke);
      }
      return Ke;
    }, Oe = Math.max(1, Math.round(G / de)), Ee = Math.max(1, Math.round(ce / de)), et = G / Oe, tt = ce / Ee, lt = /* @__PURE__ */ new Map(), qe = [], ze = e.points.rawVal.length, He = (ge, Ae) => {
      const Ke = ge + "," + Ae, Tt = lt.get(Ke);
      if (Tt !== void 0) return Tt;
      const Dt = ze + qe.length;
      return qe.push(v(C + ge * et, q + Ae * tt)), lt.set(Ke, Dt), Dt;
    }, Ve = [];
    for (let ge = 0; ge < Oe; ge++) for (let Ae = 0; Ae < Ee; Ae++) {
      if (!Me(C + (ge + 0.5) * et, q + (Ae + 0.5) * tt)) continue;
      const Ke = He(ge, Ae), Tt = He(ge + 1, Ae), Dt = He(ge + 1, Ae + 1), $t = He(ge, Ae + 1);
      Ve.push([Ke, Tt, Dt, $t]);
    }
    if (!Ve.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...qe], e.polylines && e.areas) {
      let ge = e.polylines.rawVal.slice();
      ge.length && ge[ge.length - 1].length === 0 && (ge = ge.slice(0, -1));
      const Ae = [];
      for (const Ke of Ve) Ae.push(ge.length), ge.push([Ke[0], Ke[1], Ke[2], Ke[3], Ke[0]]);
      ge.push([]), e.polylines.val = ge, e.areas.val = [...e.areas.rawVal, ...Ae];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), Ve.length;
  };
  const yn = () => {
    if (we.length < 3) return we = [], J.visible = false, y(), 0;
    const t = window.__hekatanMeshPolyArea(we.slice());
    return we = [], J.visible = false, y(), t;
  };
  window.__hekatanFinalizePolyArea = yn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, s) => {
    var _a2;
    const n = new b(t[0], t[1], t[2]), a = new b(o[0], o[1], o[2]), i = new b(s[0], s[1], s[2]), r = new b().subVectors(a, n).cross(new b().subVectors(i, n));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const f = new Zn().setFromUnitVectors(new b(0, 0, 1), r), w = new Pn().setFromQuaternion(f);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [w.x, w.y, w.z] }), E = true;
    const x = new b().addVectors(n, a).add(i).multiplyScalar(1 / 3), S = Math.max(n.distanceTo(a), n.distanceTo(i), a.distanceTo(i)) * 2.2 + 4, _ = S / 2;
    Le.geometry.dispose(), Le.geometry = new tn(S, S), ke.geometry.dispose(), ke.geometry = new ts(new tn(S, S)), Qe(_, 1), ye.position.copy(x), ye.quaternion.copy(f), ye.scale.set(1, 1, 1), ye.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), E = false, ye.visible = false, y();
  };
  const It = new nt();
  It.visible = false, d.add(It), window.__hekatanShowAxes = (t, o, s = 12, n = 2) => {
    var _a2, _b;
    for (; It.children.length; ) {
      const S = It.children.pop();
      (_a2 = S.geometry) == null ? void 0 : _a2.dispose(), (_b = S.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const a = Math.min(...o) - n, i = Math.max(...o) + n, r = Math.min(...t) - n, f = Math.max(...t) + n, w = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", x = (S, _, u, F, j) => {
      const O = document.createElement("canvas");
      O.width = 64, O.height = 32;
      const Y = O.getContext("2d");
      Y.fillStyle = j, Y.font = "bold 22px sans-serif", Y.textAlign = "center", Y.fillText(S, 32, 26);
      const v = new ns(O), A = new os({ map: v, transparent: true }), C = new ss(A);
      return C.position.set(_, u, F), C.scale.set(1.2, 0.6, 1), C;
    };
    t.forEach((S, _) => {
      const u = _ < w.length ? w[_] : `X${_}`, F = new _e().setFromPoints([new b(S, a, 0), new b(S, i, 0), new b(S, a, 0), new b(S, a, s)]), j = new kn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), O = new Ht(F, j);
      O.computeLineDistances(), It.add(O), It.add(x(u, S, a - 0.5, 0, "#60a5fa")), It.add(x(u, S, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((S, _) => {
      const u = `${_ + 1}`, F = new _e().setFromPoints([new b(r, S, 0), new b(f, S, 0), new b(r, S, 0), new b(r, S, s)]), j = new kn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), O = new Ht(F, j);
      O.computeLineDistances(), It.add(O), It.add(x(u, r - 0.5, S, 0, "#fb7185")), It.add(x(u, f + 0.5, S, 0, "#fb7185"));
    }), It.visible = true, y();
  }, window.__hekatanHideAxes = () => {
    It.visible = false, y();
  };
  const Zt = new nt();
  Zt.visible = false, d.add(Zt);
  let cn = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, s = 0, n = 0) => {
    var _a2, _b;
    for (; Zt.children.length; ) {
      const i = Zt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    cn.forEach((i) => {
      d.remove(i), i.geometry.dispose(), i.material.dispose();
    }), cn = [];
    const a = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, r) => {
      const f = a[r % a.length], w = o / 2, x = [new b(s - w, n - w, i), new b(s + w, n - w, i), new b(s + w, n + w, i), new b(s - w, n + w, i), new b(s - w, n - w, i)], S = new _e().setFromPoints(x), _ = new pt({ color: f, transparent: true, opacity: 0.55 });
      Zt.add(new Pt(S, _));
      const u = document.createElement("canvas");
      u.width = 128, u.height = 32;
      const F = u.getContext("2d");
      F.fillStyle = `#${f.toString(16).padStart(6, "0")}`, F.font = "bold 18px sans-serif", F.fillText(`Z = ${i} m`, 4, 22);
      const j = new ns(u), O = new os({ map: j, transparent: true }), Y = new ss(O);
      Y.position.set(s - w - 1.5, n - w - 1.5, i), Y.scale.set(2.5, 0.6, 1), Zt.add(Y);
      const v = new tn(1e4, 1e4), A = new rt({ visible: false, side: zt }), C = new ot(v, A);
      C.position.set(0, 0, i), C.frustumCulled = false, C.userData = { refPlaneZ: i }, d.add(C), cn.push(C);
    }), Zt.visible = true, y();
  }, window.__hekatanHideRefPlanes = () => {
    Zt.visible = false, cn.forEach((t) => {
      t.visible = false;
    }), y();
  };
  const xn = new nt();
  xn.frustumCulled = false, d.add(xn);
  const _s = () => {
    var _a2, _b, _c, _d;
    for (; xn.children.length; ) {
      const s = xn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new _e().setFromPoints([new b(s[0], s[1], s[2]), new b(s[3], s[4], s[5])]), a = new kn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new Pt(n, a);
      i.computeLineDistances(), xn.add(i);
    }
  };
  W.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, _s(), y());
  });
  const dn = new nt();
  dn.frustumCulled = false, d.add(dn);
  const Eo = () => {
    var _a2, _b, _c, _d;
    for (; dn.children.length; ) {
      const s = dn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new ot(new mn(0.025, 12, 12), new rt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(Gt(n.position)), dn.add(n);
    }
  };
  W.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Eo(), y());
  }), c.addEventListener("change", () => {
    dn.children.forEach((t) => {
      t.scale.setScalar(Gt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Eo;
  const xt = new nt(), Ss = new ot(new mn(0.01, 12, 12), new rt({ color: 16724804, transparent: true, opacity: 0.95 })), ks = new ot(new mn(0.015, 12, 12), new rt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  xt.add(Ss, ks);
  const pn = 0.08, no = (t, o, s) => {
    const n = new _e().setFromPoints([new b(...t), new b(...o)]);
    return new Pt(n, new pt({ color: s, transparent: true, opacity: 0.7 }));
  };
  xt.add(no([-pn, 0, 0], [pn, 0, 0], 16711680)), xt.add(no([0, -pn, 0], [0, pn, 0], 65280)), xt.add(no([0, 0, -pn], [0, 0, pn], 35071)), xt.visible = false, xt.frustumCulled = false, d.add(xt);
  let oo = 2;
  const Ln = (t) => {
    const o = h(), s = (g == null ? void 0 : g.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / s : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / s;
  }, gn = () => {
    if (!xt.visible) return;
    const t = oo * Ln(xt.position) / 0.015;
    xt.scale.setScalar(Math.max(1e-4, Math.min(1e5, t)));
  };
  let vn = 10;
  const so = (t) => Math.max(1e-4, vn * Ln(t));
  window.__hekatanAperturaPx = (t) => (typeof t == "number" && t > 0 && (vn = t), vn), window.__hekatanUpdateSnapScale = gn, window.__hekatanSnapMarker = xt, window.__hekatanMetrosPorPixel = Ln, window.__hekatanSnapPx = (t) => (typeof t == "number" && t > 0 && (oo = t, gn(), y()), oo);
  const Vo = () => {
    yt.children.length !== 0 && yt.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(Gt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Vo, c.addEventListener("change", () => {
    var _a2;
    gn(), at.visible && Wt(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Vo();
  }), window.__hekatanShowSnap = (t, o, s) => {
    xt.position.set(t, o, s), xt.visible = true, gn(), y();
  }, window.__hekatanHideSnap = () => {
    xt.visible = false, y();
  }, g.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r;
    window.__hekatanCursorPx = { x: t.clientX, y: t.clientY };
    const o = M(t);
    if (!o) return;
    k.setFromCamera(z, o);
    const s = ie();
    if (s.length) {
      const n = s[0].point, a = t.altKey, i = so(n), r = a ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i, { x: t.clientX, y: t.clientY });
      if (r) Ro(r.type, r.x, r.y, r.z), xt.position.set(r.x, r.y, r.z), xt.visible = true, n.set(r.x, r.y, r.z), Do(r.type, t.clientX, t.clientY);
      else {
        Fs(), Dn();
        const _ = !a && window.__hekatanSnapEnabled !== false, u = window.__hekatanSnap2D ?? 0.5;
        _ && u > 0 && (n.x = Math.round(n.x / u) * u, n.y = Math.round(n.y / u) * u, n.z = Math.round(n.z / u) * u), xt.position.copy(n), xt.visible = true;
      }
      gn();
      const f = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (f === "select" || !f) {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = An(n.x, n.y, n.z, _), F = jt(n.x, n.y, n.z, _), j = En(n.x, n.y, n.z, _);
        if (u >= 0) {
          const A = e.points.rawVal[u];
          at.position.set(A[0], A[1], A[2]), at.visible = true, Wt(), dt.visible = false, Et = { kind: "pt", a: u };
        } else if (F) {
          const A = e.points.rawVal, C = e.polylines.rawVal[F.polyIdx], B = A[C[F.segIdx]], q = A[C[F.segIdx + 1]];
          dt.geometry.setFromPoints([new b(B[0], B[1], B[2]), new b(q[0], q[1], q[2])]), dt.visible = true, at.visible = false, Et = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(F.polyIdx)) ?? false ? { kind: "poly", a: F.polyIdx } : { kind: "seg", a: F.polyIdx, b: F.segIdx };
        } else if (j >= 0) {
          const C = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[j];
          C && (dt.geometry.setFromPoints([new b(C[0], C[1], C[2]), new b(C[3], C[4], C[5])]), dt.visible = true, at.visible = false, Et = { kind: "aux", a: j });
        } else dt.visible = false, at.visible = false, Et = null;
        se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
        let O = n;
        if ((Et == null ? void 0 : Et.kind) === "pt") {
          const A = e.points.rawVal[Et.a];
          A && (O = new b(A[0], A[1], A[2]));
        }
        const Y = `X=${O.x.toFixed(2)} Y=${O.y.toFixed(2)} Z=${O.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [O.x, O.y, O.z], Et) {
          const A = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          se.textContent = `${Y}  \xB7  \u{1F5B1} Click \u2192 ${A[Et.kind]}`;
        } else se.textContent = Y;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = Y), Nt = { p: O.clone(), x: t.clientX, y: t.clientY }, fe.visible = false, mt.visible = false, I.visible = false, y();
        return;
      }
      if (f === "delete" || f === "trim" || f === "extend" || f === "offset") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = jt(n.x, n.y, n.z, _), F = En(n.x, n.y, n.z, _);
        let j = false;
        if (F >= 0) if (!u) j = true;
        else {
          const A = window.__hekatanDrawingAuxLines, B = ((A == null ? void 0 : A.rawVal) ?? (A == null ? void 0 : A.val) ?? A ?? [])[F];
          Jt(n.x, n.y, n.z, B[0], B[1], B[2], B[3], B[4], B[5]) < u.dist && (j = true);
        }
        j ? (Ue = F, Je = -1, Mt = -1, eo(F)) : u ? (Je = u.polyIdx, Mt = u.segIdx, Ue = -1, to(u.polyIdx, u.segIdx)) : (Je = -1, Mt = -1, Ue = -1, Ze.visible = false), fe.visible = false, mt.visible = false, I.visible = false, N(), se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
        const O = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let Y = "";
        j ? Y = `\u{1F5D1} l\xEDnea aux #${Ue + 1}` : u ? Y = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(u.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${u.polyIdx + 1}` : `\u{1F5D1} seg ${u.segIdx + 1} / poly #${u.polyIdx + 1}` : Y = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", se.textContent = `${O}  \xB7  ${Y}`;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = O), y();
        return;
      } else Ze.visible = false, Je = -1, Ue = -1;
      se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
      const w = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], x = w[w.length - 1] ?? [], S = e.points.rawVal ?? [];
      if (x.length > 0 && S[x[x.length - 1]]) {
        const _ = x[x.length - 1], u = S[_];
        let F = ct;
        if (ft = null, !F && window.__hekatanAxisSnap !== false) {
          const Ee = g.getBoundingClientRect(), et = t.clientX, tt = t.clientY, lt = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, qe = new b(u[0], u[1], u[2]), ze = [["x", new b(1, 0, 0)], ["y", new b(0, 1, 0)], ["z", new b(0, 0, 1)]], He = (ge) => {
            const Ae = ge.clone().project(o);
            return { x: (Ae.x * 0.5 + 0.5) * Ee.width + Ee.left, y: (-Ae.y * 0.5 + 0.5) * Ee.height + Ee.top };
          };
          let Ve = null;
          for (const [ge, Ae] of ze) {
            const Ke = He(qe.clone().addScaledVector(Ae, -lt)), Tt = He(qe.clone().addScaledVector(Ae, lt)), Dt = Tt.x - Ke.x, $t = Tt.y - Ke.y, Qt = et - Ke.x, yo = tt - Ke.y, Yn = Dt * Dt + $t * $t || 1;
            let Nn = (Qt * Dt + yo * $t) / Yn;
            Nn = Math.max(0, Math.min(1, Nn));
            const Wo = Math.hypot(et - (Ke.x + Nn * Dt), tt - (Ke.y + Nn * $t));
            if (Ve === null || Wo < Ve.dpx) {
              const xo = k.ray, Oo = qe.clone().sub(xo.origin), go = Ae.dot(xo.direction), Jo = Ae.dot(Oo), Ds = xo.direction.dot(Oo), Qo = 1 - go * go, Bs = Math.abs(Qo) < 1e-6 ? -Jo : (go * Ds - Jo) / Qo;
              Ve = { axis: ge, dpx: Wo, pt: qe.clone().addScaledVector(Ae, Bs) };
            }
          }
          Ve && Ve.dpx <= 12 && (n.copy(Ve.pt), F = Ve.axis, ft = Ve.pt.clone());
        }
        const j = !!window.__hekatanOrthoMode;
        if (!F && j) {
          const Ee = Math.abs(n.x - u[0]), et = Math.abs(n.y - u[1]), tt = Math.abs(n.z - u[2]), lt = (_l = s[0]) == null ? void 0 : _l.object;
          let qe = null;
          lt === Xe ? qe = "xy" : lt === De ? qe = "xz" : lt === Ne && (qe = "yz"), qe === "xy" ? F = Ee >= et ? "x" : "y" : qe === "xz" ? F = Ee >= tt ? "x" : "z" : qe === "yz" ? F = et >= tt ? "y" : "z" : F = Ee >= et && Ee >= tt ? "x" : et >= tt ? "y" : "z";
        }
        const O = window.__hekatanPolarTrack !== false;
        if (!F && O) {
          const Ee = n.x - u[0], et = n.y - u[1], tt = n.z - u[2], lt = Math.hypot(Ee, et, tt);
          if (lt > 1e-3) {
            const ze = Math.tan(6 * Math.PI / 180) * lt, He = Math.hypot(et, tt), Ve = Math.hypot(Ee, tt), ge = Math.hypot(Ee, et), Ae = [["x", He], ["y", Ve], ["z", ge]];
            Ae.sort((Ke, Tt) => Ke[1] - Tt[1]), Ae[0][1] <= ze && (F = Ae[0][0]);
          }
        }
        if (F) {
          const Ee = u[0], et = u[1], tt = u[2];
          F === "x" ? n.set(n.x, et, tt) : F === "y" ? n.set(Ee, n.y, tt) : n.set(Ee, et, n.z);
          const lt = !!ct, ze = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[F];
          st.style.background = "rgba(15,23,42,0.92)", st.style.color = ze, st.style.border = `1.5px solid ${ze}`;
          const He = (_m = s[0]) == null ? void 0 : _m.object;
          let Ve = null;
          He === Xe ? Ve = "xy" : He === De ? Ve = "xz" : He === Ne && (Ve = "yz");
          const ge = Ve ? ` (plano ${Ve.toUpperCase()})` : "";
          st.textContent = lt ? `\u{1F512} LOCK ${F.toUpperCase()}${ge}` : `\u22A5 ORTO ${F.toUpperCase()}${ge}`, st.style.left = t.clientX + 20 + "px", st.style.top = t.clientY + 18 + "px", st.style.transform = "none", st.style.display = "block";
        } else ct || (st.style.display = "none");
        let Y = null;
        if (!a && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ee = e.points.rawVal, et = F ? [F] : ["z", "x", "y"], tt = { x: t.clientX, y: t.clientY };
          let lt = 1 / 0;
          for (const qe of Ee) if (!(Math.abs(qe[0] - u[0]) < 1e-9 && Math.abs(qe[1] - u[1]) < 1e-9 && Math.abs(qe[2] - u[2]) < 1e-9)) for (const ze of et) {
            const He = new b(ze === "x" ? qe[0] : n.x, ze === "y" ? qe[1] : n.y, ze === "z" ? qe[2] : n.z), Ve = co(He.x, He.y, He.z);
            if (!Ve) continue;
            const ge = Math.hypot(Ve.x - tt.x, Ve.y - tt.y);
            ge < vn && ge < lt && (lt = ge, Y = { q: qe, eje: ze });
          }
        }
        Y ? (Y.eje === "x" ? n.x = Y.q[0] : Y.eje === "y" ? n.y = Y.q[1] : n.z = Y.q[2], I.geometry.setFromPoints([new b(Y.q[0], Y.q[1], Y.q[2]), new b(n.x, n.y, n.z)]), (_n2 = I.computeLineDistances) == null ? void 0 : _n2.call(I), I.visible = true, xt.position.set(n.x, n.y, n.z), xt.visible = true, Do("track", t.clientX, t.clientY)) : I.visible = false, Nt = { p: n.clone(), x: t.clientX, y: t.clientY };
        const v = Math.hypot(n.x - u[0], n.y - u[1], n.z - u[2]), A = Math.atan2(n.y - u[1], n.x - u[0]) * 180 / Math.PI, C = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = `${C} | \u0394L=${v.toFixed(2)}m ${A.toFixed(0)}\xB0`;
        const B = document.getElementById("hk-coord-fixed");
        B && (B.textContent = C), fe.geometry.setFromPoints([new b(u[0], u[1], u[2]), new b(n.x, n.y, n.z)]), (_o2 = fe.computeLineDistances) == null ? void 0 : _o2.call(fe), fe.visible = true, Z(u[0], u[1], u[2], n.x, n.y, n.z);
        const q = window.__hekatanOrthoExt ?? 8, R = window.__hekatanShowOrthoPlanes !== false;
        Te.visible = R, R || wt(null), R && (je(xe, u, "xy", q), je(be, u, "xz", q), je(Pe, u, "yz", q), ut(Xe, u, "xy", q), ut(De, u, "xz", q), ut(Ne, u, "yz", q));
        const G = R ? k.intersectObjects([Xe, De, Ne], false) : [];
        let ce = null;
        if (G.length > 0) {
          const Ee = G[0].object;
          Ee === Xe ? ce = "xy" : Ee === De ? ce = "xz" : Ee === Ne && (ce = "yz");
        }
        wt(ce), ce && (Ie.style.left = t.clientX + "px", Ie.style.top = t.clientY + "px"), P.geometry.setFromPoints([new b(u[0] - q, u[1], u[2]), new b(u[0] + q, u[1], u[2])]), (_p = P.computeLineDistances) == null ? void 0 : _p.call(P), L.geometry.setFromPoints([new b(u[0], u[1] - q, u[2]), new b(u[0], u[1] + q, u[2])]), (_q = L.computeLineDistances) == null ? void 0 : _q.call(L), Q.geometry.setFromPoints([new b(u[0], u[1], u[2] - q), new b(u[0], u[1], u[2] + q)]), (_r = Q.computeLineDistances) == null ? void 0 : _r.call(Q), mt.visible = true;
        const de = P.material, Me = L.material, Oe = Q.material;
        F === "x" ? (de.opacity = 0.95, Me.opacity = 0.1, Oe.opacity = 0.1) : F === "y" ? (de.opacity = 0.1, Me.opacity = 0.95, Oe.opacity = 0.1) : F === "z" ? (de.opacity = 0.1, Me.opacity = 0.1, Oe.opacity = 0.95) : (de.opacity = 0.5, Me.opacity = 0.5, Oe.opacity = 0.5);
      } else {
        const _ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = _;
        const u = document.getElementById("hk-coord-fixed");
        if (u && (u.textContent = _), fe.visible = false, mt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(f)) {
          if (X = null, K = null, U.style.left = t.clientX + 20 + "px", U.style.top = t.clientY - 28 + "px", U.style.display = "block", !T) {
            U.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const j = document.activeElement;
            !(j && (j.tagName === "INPUT" || j.tagName === "TEXTAREA") && j !== U) && document.activeElement !== U && U.focus({ preventScroll: true });
            try {
              U.select();
            } catch {
            }
          }
        } else N();
      }
      y();
    } else Dn(), se.style.display = "none", xt.visible = false, fe.visible = false, mt.visible = false, N(), y();
  }), W.derive(() => {
    if (!e.gridTarget) return;
    const t = new Zn().setFromEuler(new Pn(...e.gridTarget.val.rotation)), o = new Zn().setFromAxisAngle(new b(1, 0, 0), Math.PI / 2);
    Ca(l, { position: new b(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, y), H.position.set(...e.gridTarget.val.position), H.quaternion.setFromEuler(new Pn(...e.gridTarget.val.rotation)), H.updateMatrixWorld();
    const s = new b(0, 0, 1).applyEuler(new Pn(...e.gridTarget.val.rotation));
    E = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), W.derive(() => {
    ee.geometry.setAttribute("position", new St(e.points.val.flat(), 3)), ee.geometry.computeBoundingSphere();
  }), W.derive(() => {
    const t = 0.05 * m * 0.5 * p.val;
    k.params.Points.threshold = 0.4 * t;
  }), W.derive(() => {
    var _a2;
    const t = e.points.val ?? [], s = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of s) {
      const [r, f, w] = t[i];
      n.push(r, f, w);
    }
    const a = new _e();
    a.setAttribute("position", new St(n, 3)), ve.geometry.dispose(), ve.geometry = a;
  });
  let ao = false, on = 0;
  g.addEventListener("pointerdown", () => {
    ao = true;
  }), g.addEventListener("pointerup", () => {
    ao = false;
  }), g.addEventListener("pointermove", () => {
    ao && on++;
  });
  const Vt = document.createElement("div");
  Vt.id = "hk-window-select", Vt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Vt);
  let qt = null, Mn = false, Bt = null;
  const io = (t, o, s, n, a) => {
    a ? (Vt.style.borderColor = "#34d399", Vt.style.borderStyle = "dashed", Vt.style.background = "rgba(52, 211, 153, 0.10)") : (Vt.style.borderColor = "#22d3ee", Vt.style.borderStyle = "solid", Vt.style.background = "rgba(34, 211, 238, 0.10)"), Vt.style.left = Math.min(t, s) + "px", Vt.style.top = Math.min(o, n) + "px", Vt.style.width = Math.abs(s - t) + "px", Vt.style.height = Math.abs(n - o) + "px", Vt.style.display = "block";
  }, To = (t, o, s, n, a) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, s), r = Math.max(t, s), f = Math.min(o, n), w = Math.max(o, n), x = s < t, S = g.getBoundingClientRect(), _ = h();
    _.updateMatrixWorld();
    const u = (R) => {
      const G = new b(R[0], R[1], R[2]);
      return G.project(_), { x: S.left + (G.x * 0.5 + 0.5) * S.width, y: S.top + (-G.y * 0.5 + 0.5) * S.height };
    }, F = (R) => R.x >= i && R.x <= r && R.y >= f && R.y <= w, j = (R, G) => !(R.x < i && G.x < i || R.x > r && G.x > r || R.y < f && G.y < f || R.y > w && G.y > w);
    a || me.clear();
    let O = 0;
    const Y = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let R = 0; R < Y.length; R++) {
      const G = Y[R];
      G && F(u(G)) && (me.add(`pt:${R}`), O++);
    }
    const v = (R, G) => x ? F(R) || F(G) || j(R, G) : F(R) && F(G), A = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], C = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let R = 0; R < A.length; R++) {
      const G = A[R];
      if (C.includes(R)) {
        let de;
        if (!x) de = G.every((Me) => {
          const Oe = Y[Me];
          return !!Oe && F(u(Oe));
        });
        else {
          de = false;
          for (let Me = 0; Me < G.length - 1; Me++) {
            const Oe = Y[G[Me]], Ee = Y[G[Me + 1]];
            if (!(!Oe || !Ee) && v(u(Oe), u(Ee))) {
              de = true;
              break;
            }
          }
        }
        de && (me.add(`poly:${R}`), O++);
      } else for (let de = 0; de < G.length - 1; de++) {
        const Me = Y[G[de]], Oe = Y[G[de + 1]];
        !Me || !Oe || v(u(Me), u(Oe)) && (me.add(`seg:${R}:${de}`), O++);
      }
    }
    const q = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let R = 0; R < q.length; R++) {
      const G = q[R];
      if (!G || G.length !== 6) continue;
      const ce = u([G[0], G[1], G[2]]), de = u([G[3], G[4], G[5]]);
      v(ce, de) && (me.add(`aux:${R}`), O++);
    }
    Lt(), oe(O === 0 && !x ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${x ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${O} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${me.size})`), Vt.style.display = "none";
  }, In = () => {
    Bt && (Bt = null, Vt.style.display = "none", oe("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = In, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && Bt && In();
  });
  const $o = () => {
    var _a2, _b, _c, _d;
    if (me.size === 0) return false;
    const t = [...me], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? [], r = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set();
    for (const j of t) {
      const [O, ...Y] = j.split(":");
      if (O === "pt") r.add(+Y[0]);
      else if (O === "poly") f.add(+Y[0]);
      else if (O === "seg") {
        const v = +Y[0], A = +Y[1];
        w.has(v) || w.set(v, /* @__PURE__ */ new Set()), w.get(v).add(A);
      } else O === "aux" && x.add(+Y[0]);
    }
    let S = 0, _ = [], u = [];
    const F = /* @__PURE__ */ new Map();
    for (let j = 0; j < s.length; j++) {
      if (f.has(j)) {
        S++;
        continue;
      }
      F.set(j, _.length);
      const O = w.get(j);
      if (O && O.size > 0) {
        let Y = [];
        for (let v = 0; v < s[j].length; v++) Y.push(s[j][v]), v < s[j].length - 1 && O.has(v) && (Y.length >= 2 && _.push(Y), Y = [], S++);
        (Y.length >= 2 || Y.length === 1) && _.push(Y);
      } else _.push([...s[j]]);
    }
    if (r.size > 0) {
      const j = [], O = /* @__PURE__ */ new Map();
      for (let v = 0; v < o.length; v++) {
        if (r.has(v)) {
          S++;
          continue;
        }
        O.set(v, j.length), j.push([...o[v]]);
      }
      const Y = [];
      for (const v of _) {
        let A = [];
        for (const C of v) {
          const B = O.get(C);
          B === void 0 ? (A.length >= 2 && Y.push(A), A = []) : A.push(B);
        }
        A.length >= 2 && Y.push(A);
      }
      _ = Y, e.points.val = j;
    }
    for (const j of n) {
      const O = F.get(j);
      O !== void 0 && O < _.length && u.push(O);
    }
    if (e.polylines && (e.polylines.val = _), e.areas && (e.areas.val = u), x.size > 0 && a) {
      const j = i.filter((O, Y) => !x.has(Y));
      "val" in a ? a.val = j : window.__hekatanDrawingAuxLines = j, S += x.size;
    }
    me.clear(), Lt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return oe(`\u{1F5D1} ${S} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = $o, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || me.size !== 0 && (t.preventDefault(), $o());
  });
  const Rt = document.createElement("div");
  Rt.id = "hk-properties-pane";
  const Lo = "hk-props-pane-pos";
  let bn = null;
  try {
    const t = localStorage.getItem(Lo);
    t && (bn = JSON.parse(t));
  } catch {
  }
  Rt.style.cssText = ["position:fixed", bn ? `left:${bn.left}px` : "left:14px", bn ? `top:${bn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Rt);
  const Ps = () => {
    const t = Rt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, i = 0;
    t.addEventListener("mousedown", (r) => {
      o = true, s = r.clientX, n = r.clientY;
      const f = Rt.getBoundingClientRect();
      a = f.left, i = f.top, Rt.style.transform = "none", Rt.style.left = `${a}px`, Rt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const f = r.clientX - s, w = r.clientY - n, x = Math.max(0, Math.min(window.innerWidth - 80, a + f)), S = Math.max(0, Math.min(window.innerHeight - 40, i + w));
      Rt.style.left = `${x}px`, Rt.style.top = `${S}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Lo, JSON.stringify({ left: parseFloat(Rt.style.left), top: parseFloat(Rt.style.top) }));
        } catch {
        }
      }
    });
  }, te = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, At = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let it = null;
  const _t = (t, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: s, value: n } }));
  }, Cs = () => {
    if (it && (it.dispose(), it = null), me.size === 0) {
      Rt.style.display = "none";
      return;
    }
    const t = [...me], o = t.filter((_) => _.startsWith("pt:")), s = t.filter((_) => _.startsWith("seg:")), n = t.filter((_) => _.startsWith("poly:")), a = t.filter((_) => _.startsWith("aux:")), i = o.length > 0, r = s.length > 0, f = n.length > 0, w = !i && !r && !f, x = [];
    o.length && x.push(`\u{1F535} ${o.length} nodo(s)`), s.length && x.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && x.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && x.push(`\u250A ${a.length} aux`);
    const S = `\u{1F3AF} ${me.size} item(s) \u2014 ${x.join(", ")}`;
    it = new ys({ container: Rt, title: S });
    {
      const _ = it.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      _.addBinding(At, "dx", { label: "\u0394x (m)", step: 0.1 }), _.addBinding(At, "dy", { label: "\u0394y (m)", step: 0.1 }), _.addBinding(At, "dz", { label: "\u0394z (m)", step: 0.1 }), _.addBinding(At, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), _.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const F = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, At.dx, At.dy, At.dz, At.copias);
        oe(F ? `\u29C9 Replicado \xD7${F} (\u0394 ${At.dx},${At.dy},${At.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), _.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const F = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, At.dx, At.dy, At.dz, 1);
        oe(F ? `\u2192 Copia desplazada \u0394 ${At.dx},${At.dy},${At.dz} m` : "\u26A0 Nada seleccionado");
      });
      const u = _.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      u.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), u.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), oe(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const _ = it.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      _.addBinding(te, "Ux"), _.addBinding(te, "Uy"), _.addBinding(te, "Uz"), _.addBinding(te, "Rx"), _.addBinding(te, "Ry"), _.addBinding(te, "Rz");
      const u = it.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      u.addBinding(te, "Kx", { label: "Kx", min: 0, step: 100 }), u.addBinding(te, "Ky", { label: "Ky", min: 0, step: 100 }), u.addBinding(te, "Kz", { label: "Kz", min: 0, step: 100 }), u.addBinding(te, "Krx", { label: "Krx", min: 0, step: 1e3 }), u.addBinding(te, "Kry", { label: "Kry", min: 0, step: 1e3 }), u.addBinding(te, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const F = it.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      F.addBinding(te, "Fx", { step: 0.1 }), F.addBinding(te, "Fy", { step: 0.1 }), F.addBinding(te, "Fz", { step: 0.1 }), F.addBinding(te, "Mx", { step: 0.1 }), F.addBinding(te, "My", { step: 0.1 }), F.addBinding(te, "Mz", { step: 0.1 }), it.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(te, "mass", { label: "m", min: 0, step: 1 }), it.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(te, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), it.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let Y = 0;
        const v = [te.Ux, te.Uy, te.Uz, te.Rx, te.Ry, te.Rz];
        v.some((B) => B) && (_t("nodes", o, "supports", v), Y++);
        const A = [te.Fx, te.Fy, te.Fz, te.Mx, te.My, te.Mz];
        A.some((B) => B !== 0) && (_t("nodes", o, "loads", A), Y++);
        const C = [te.Kx, te.Ky, te.Kz, te.Krx, te.Kry, te.Krz];
        if (C.some((B) => B !== 0) && (_t("nodes", o, "springs", C), Y++), te.mass !== 0 && (_t("nodes", o, "mass", te.mass), Y++), te.diaphragm !== "Ninguno" && (_t("nodes", o, "diaphragm", te.diaphragm), Y++), Y === 0) {
          oe("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let B = document.getElementById("hk-prop-toast");
          B || (B = document.createElement("div"), B.id = "hk-prop-toast", B.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(B)), B.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", B.style.background = "rgba(217,119,6,0.97)", B.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            B && (B.style.opacity = "0");
          }, 3200);
        } else oe(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const _ = it.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      _.addBinding(te, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), _.addBinding(te, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const u = it.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      u.addBinding(te, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), u.addBinding(te, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), u.addBinding(te, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), u.addBinding(te, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), it.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(te, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), it.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(te, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const O = it.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      O.addBinding(te, "relMxI", { label: "Mx I" }), O.addBinding(te, "relMyI", { label: "My I" }), O.addBinding(te, "relMzI", { label: "Mz I" });
      const Y = it.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      Y.addBinding(te, "relMxJ", { label: "Mx J" }), Y.addBinding(te, "relMyJ", { label: "My J" }), Y.addBinding(te, "relMzJ", { label: "Mz J" }), it.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(te, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const A = it.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      A.addBinding(te, "LKx", { label: "LKx", min: 0, step: 100 }), A.addBinding(te, "LKy", { label: "LKy", min: 0, step: 100 }), A.addBinding(te, "LKz", { label: "LKz", min: 0, step: 100 });
      const C = it.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      C.addBinding(te, "qx", { step: 0.1 }), C.addBinding(te, "qy", { step: 0.1 }), C.addBinding(te, "qz", { step: 0.1 }), it.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(te, "massPerM", { label: "m/L", min: 0, step: 1 }), it.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        _t("segs", s, "section", te.section), _t("segs", s, "material", te.material_frame);
        const q = { A: te.A_mod, Iz: te.Iz_mod, Iy: te.Iy_mod, J: te.J_mod };
        (q.A !== 1 || q.Iz !== 1 || q.Iy !== 1 || q.J !== 1) && _t("segs", s, "modifiers", q), te.insertionPoint !== "10 \u2014 Centroid" && _t("segs", s, "insertionPoint", te.insertionPoint), te.beta !== 0 && _t("segs", s, "beta", te.beta);
        const R = [te.relMxI, te.relMyI, te.relMzI], G = [te.relMxJ, te.relMyJ, te.relMzJ];
        (R.some((Me) => Me) || G.some((Me) => Me)) && _t("segs", s, "releases", { i: R, j: G }), te.hinges !== "None" && _t("segs", s, "hinges", te.hinges);
        const ce = [te.LKx, te.LKy, te.LKz];
        ce.some((Me) => Me !== 0) && _t("segs", s, "lineSprings", ce);
        const de = [te.qx, te.qy, te.qz];
        de.some((Me) => Me !== 0) && _t("segs", s, "distLoad", de), te.massPerM !== 0 && _t("segs", s, "massPerM", te.massPerM), oe(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (f) {
      const _ = it.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      _.addBinding(te, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), _.addBinding(te, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), _.addBinding(te, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), it.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(te, "surfLoad", { label: "q", step: 0.1 }), it.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        _t("areas", n, "shellType", te.shellType), _t("areas", n, "thickness", te.thickness), _t("areas", n, "material", te.material_shell), te.surfLoad !== 0 && _t("areas", n, "surfLoad", te.surfLoad), oe(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (w) {
      const _ = it.addFolder({ title: "\u2139 Selecci\xF3n" }), u = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      _.addBinding(u, "msg", { readonly: true, label: "" });
    }
    it.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      me.clear(), Lt();
    }), Rt.style.display = "block", Ps();
  };
  window.__hekatanRefreshPropsPane = Cs;
  let un = null, Rn = false;
  g.addEventListener("pointerdown", (t) => {
    t.button === 2 && (un = { x: t.clientX, y: t.clientY }, Rn = false);
  }), g.addEventListener("pointermove", (t) => {
    if (un && t.buttons & 2 && !Rn) {
      const o = t.clientX - un.x, s = t.clientY - un.y;
      Math.hypot(o, s) > 8 && (Rn = true);
    }
  }), g.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = un !== null && !Rn;
      un = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Bt ? In() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), me.size > 0 && (me.clear(), Lt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), oe(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : oe("\u238B Cancelado (click derecho)");
      }
    }
  }), g.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), g.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (qt = null, Mn = false));
  }), g.addEventListener("pointermove", (t) => {
    if (Bt && t.buttons === 0) {
      const i = t.clientX < Bt.x;
      io(Bt.x, Bt.y, t.clientX, t.clientY, i);
      return;
    }
    if (!qt) return;
    const o = t.clientX - qt.x, s = t.clientY - qt.y, n = Math.hypot(o, s);
    if (!Mn && n < 8) return;
    Mn = true;
    const a = t.clientX < qt.x;
    io(qt.x, qt.y, t.clientX, t.clientY, a);
  }), g.addEventListener("pointerup", (t) => {
    if (!qt) return;
    if (!Mn) {
      qt = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    To(qt.x, qt.y, t.clientX, t.clientY, o), qt = null, Mn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Ut = new nt();
  Ut.visible = false, Ut.frustumCulled = false, d.add(Ut);
  const Io = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, Ro = (t, o, s, n) => {
    var _a2, _b, _c, _d;
    for (; Ut.children.length; ) {
      const r = Ut.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Io[t] ?? 16777215, i = new _e().setFromPoints([new b(-1, -1, 0), new b(1, -1, 0), new b(1, -1, 0), new b(1, 1, 0), new b(1, 1, 0), new b(-1, 1, 0), new b(-1, 1, 0), new b(-1, -1, 0)]);
    Ut.add(new Ht(i, new pt({ color: a, linewidth: 2 }))), Ut.position.set(o, s, n), Ut.visible = true, ro();
  };
  let lo = 4;
  const ro = () => {
    Ut.visible && Ut.scale.setScalar(lo * Ln(Ut.position));
  };
  window.__hekatanOsnapMarkerRef = Ut, window.__hekatanUpdateOsnapScale = ro, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (lo = t, ro(), y()), lo);
  const Dn = () => {
    Ut.visible = false;
  }, zs = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Ot = document.createElement("div");
  Ot.id = "hk-osnap-etiqueta", Ot.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Ot);
  const Do = (t, o, s) => {
    const n = zs[t];
    if (!n) {
      Ot.style.display = "none";
      return;
    }
    Ot.textContent = n, Ot.style.color = "#" + (Io[t] ?? 16777215).toString(16).padStart(6, "0"), Ot.style.left = o + 18 + "px", Ot.style.top = s - 26 + "px", Ot.style.display = "block";
  }, Fs = () => {
    Ot.style.display = "none";
  }, _n = new b(), co = (t, o, s) => {
    const n = h();
    if (!n) return null;
    const a = g.getBoundingClientRect();
    return _n.set(t, o, s).project(n), !isFinite(_n.x) || !isFinite(_n.y) ? null : { x: a.left + (_n.x * 0.5 + 0.5) * a.width, y: a.top + (-_n.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = co;
  const As = (t, o, s, n, a) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, r = e.points.rawVal, f = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let w = null;
    const x = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, S = a, _ = (v, A, C, B) => {
      let q;
      if (S) {
        const G = co(A, C, B);
        if (!G || (q = Math.hypot(G.x - S.x, G.y - S.y), q > vn)) return;
      } else if (q = Math.hypot(A - t, C - o, B - s), q > n) return;
      const R = x[v] ?? 9;
      (!w || R < w.r || R === w.r && q < w.d) && (w = { type: v, x: A, y: C, z: B, d: q, r: R });
    };
    if (i.ori !== false && _("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const v = window.__hekatanGridConfig, A = (v == null ? void 0 : v.minorStep) && v.minorStep > 0 ? v.minorStep : 1, C = ((v == null ? void 0 : v.gridSize) ?? 30) / 2, B = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", q = (G) => Math.round(G / A) * A, R = (G, ce) => Math.abs(G) <= C + 1e-9 && Math.abs(ce) <= C + 1e-9;
      if (B === "xz") {
        const G = q(t), ce = q(s);
        R(G, ce) && _("grid", G, o, ce);
      } else if (B === "yz") {
        const G = q(o), ce = q(s);
        R(G, ce) && _("grid", t, G, ce);
      } else {
        const G = q(t), ce = q(o);
        R(G, ce) && _("grid", G, ce, s);
      }
    }
    (i.node || i.end) && r.forEach((v) => {
      i.node && _("node", v[0], v[1], v[2]);
    });
    for (const v of f) if (!(v.length < 2)) for (let A = 0; A < v.length - 1; A++) {
      const C = r[v[A]], B = r[v[A + 1]];
      if (!(!C || !B) && (i.end && (_("end", C[0], C[1], C[2]), _("end", B[0], B[1], B[2])), i.mid && _("mid", (C[0] + B[0]) / 2, (C[1] + B[1]) / 2, (C[2] + B[2]) / 2), i.nea || i.per)) {
        const q = B[0] - C[0], R = B[1] - C[1], G = B[2] - C[2], ce = q * q + R * R + G * G;
        if (ce < 1e-12) continue;
        const de = Math.max(0, Math.min(1, ((t - C[0]) * q + (o - C[1]) * R + (s - C[2]) * G) / ce)), Me = C[0] + de * q, Oe = C[1] + de * R, Ee = C[2] + de * G;
        i.nea && _("nea", Me, Oe, Ee), i.per && _("per", Me, Oe, Ee);
      }
    }
    if (i.cen) {
      const v = ((_e2 = e.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const A of v) {
        const C = f[A];
        if (!C || C.length < 3) continue;
        const B = C[0] === C[C.length - 1] ? C.slice(0, -1) : C;
        let q = 0, R = 0, G = 0, ce = 0;
        for (const de of B) {
          const Me = r[de];
          Me && (q += Me[0], R += Me[1], G += Me[2], ce++);
        }
        ce >= 3 && _("cen", q / ce, R / ce, G / ce);
      }
    }
    if (i.cen) {
      const v = $n(), A = [...nn];
      for (const C of v) A.some((B) => Math.hypot(B.c[0] - C.c[0], B.c[1] - C.c[1], B.c[2] - C.c[2]) < 1e-6 && Math.abs(B.r - C.r) < 1e-6) || A.push(C);
      for (const C of A) {
        if (!r.some((R) => Math.abs(Math.hypot(R[0] - C.c[0], R[1] - C.c[1], R[2] - C.c[2]) - C.r) < 1e-6)) continue;
        const q = Math.hypot(t - C.c[0], o - C.c[1], s - C.c[2]);
        if (q < n || Math.abs(q - C.r) < n) {
          const R = Math.min(q, n * 0.5), G = 3;
          (!w || G < w.r || G === w.r && R < w.d) && (w = { type: "cen", x: C.c[0], y: C.c[1], z: C.c[2], d: R, r: G });
        }
      }
    }
    if (i.int) {
      const v = [];
      for (const A of f) for (let C = 0; C < A.length - 1; C++) {
        const B = r[A[C]], q = r[A[C + 1]];
        if (!B || !q) continue;
        const R = q[0] - B[0], G = q[1] - B[1], ce = q[2] - B[2], de = R * R + G * G + ce * ce;
        if (de < 1e-12) continue;
        const Me = Math.max(0, Math.min(1, ((t - B[0]) * R + (o - B[1]) * G + (s - B[2]) * ce) / de));
        Math.hypot(B[0] + Me * R - t, B[1] + Me * G - o, B[2] + Me * ce - s) < 3 * n && v.push([B, q]);
      }
      for (let A = 0; A < v.length; A++) for (let C = A + 1; C < v.length; C++) {
        const [B, q] = v[A], [R, G] = v[C], ce = [q[0] - B[0], q[1] - B[1], q[2] - B[2]], de = [G[0] - R[0], G[1] - R[1], G[2] - R[2]], Me = [B[0] - R[0], B[1] - R[1], B[2] - R[2]], Oe = ce[0] * ce[0] + ce[1] * ce[1] + ce[2] * ce[2], Ee = ce[0] * de[0] + ce[1] * de[1] + ce[2] * de[2], et = de[0] * de[0] + de[1] * de[1] + de[2] * de[2], tt = ce[0] * Me[0] + ce[1] * Me[1] + ce[2] * Me[2], lt = de[0] * Me[0] + de[1] * Me[1] + de[2] * Me[2], qe = Oe * et - Ee * Ee;
        if (qe < 1e-12) continue;
        const ze = (Ee * lt - et * tt) / qe, He = (Oe * lt - Ee * tt) / qe;
        if (ze < -1e-6 || ze > 1 + 1e-6 || He < -1e-6 || He > 1 + 1e-6) continue;
        const Ve = [B[0] + ze * ce[0], B[1] + ze * ce[1], B[2] + ze * ce[2]], ge = [R[0] + He * de[0], R[1] + He * de[1], R[2] + He * de[2]];
        if (Math.hypot(Ve[0] - ge[0], Ve[1] - ge[1], Ve[2] - ge[2]) > 1e-4) continue;
        [B, q, R, G].some((Ke) => Math.hypot(Ke[0] - Ve[0], Ke[1] - Ve[1], Ke[2] - Ve[2]) < 1e-6) || _("int", Ve[0], Ve[1], Ve[2]);
      }
    }
    const u = window.__hekatanAxisGrids ?? [], F = window.__hekatanLevels ?? [], j = u.filter((v) => v && v.start && v.end).map((v) => [v.start, v.end]);
    for (const [v, A] of j) {
      i.end && (_("end", v[0], v[1], v[2]), _("end", A[0], A[1], A[2]));
      const C = A[0] - v[0], B = A[1] - v[1], q = A[2] - v[2], R = C * C + B * B + q * q;
      if (R < 1e-12) continue;
      const G = Math.max(0, Math.min(1, ((t - v[0]) * C + (o - v[1]) * B + (s - v[2]) * q) / R));
      if (i.nea && _("nea", v[0] + G * C, v[1] + G * B, v[2] + G * q), i.int && Math.abs(q) > 1e-9) for (const ce of F) {
        const de = (ce.z - v[2]) / q;
        de < -1e-6 || de > 1 + 1e-6 || _("int", v[0] + de * C, v[1] + de * B, ce.z);
      }
    }
    if (i.int || i.node) for (let v = 0; v < j.length; v++) for (let A = v + 1; A < j.length; A++) {
      const [C, B] = j[v], [q, R] = j[A], G = B[0] - C[0], ce = B[1] - C[1], de = R[0] - q[0], Me = R[1] - q[1], Oe = G * Me - ce * de;
      if (Math.abs(Oe) < 1e-12) continue;
      const Ee = C[0] - q[0], et = C[1] - q[1], tt = (de * et - Me * Ee) / Oe, lt = (G * et - ce * Ee) / Oe;
      if (tt < -1e-6 || tt > 1 + 1e-6 || lt < -1e-6 || lt > 1 + 1e-6) continue;
      const qe = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      _("int", C[0] + tt * G, C[1] + tt * ce, typeof qe == "number" ? qe : s);
    }
    const O = window.__hekatanDrawingAuxLines, Y = (O == null ? void 0 : O.rawVal) ?? (O == null ? void 0 : O.val) ?? O ?? [];
    for (const v of Y) {
      if (v.length !== 6) continue;
      const A = [v[0], v[1], v[2]], C = [v[3], v[4], v[5]];
      if (i.end && (_("end", A[0], A[1], A[2]), _("end", C[0], C[1], C[2])), i.mid && _("mid", (A[0] + C[0]) / 2, (A[1] + C[1]) / 2, (A[2] + C[2]) / 2), i.nea || i.per) {
        const B = C[0] - A[0], q = C[1] - A[1], R = C[2] - A[2], G = B * B + q * q + R * R;
        if (G < 1e-12) continue;
        const ce = Math.max(0, Math.min(1, ((t - A[0]) * B + (o - A[1]) * q + (s - A[2]) * R) / G)), de = A[0] + ce * B, Me = A[1] + ce * q, Oe = A[2] + ce * R;
        i.nea && _("nea", de, Me, Oe), i.per && _("per", de, Me, Oe);
      }
    }
    return w ? { type: w.type, x: w.x, y: w.y, z: w.z } : null;
  }, fn = new nt();
  fn.frustumCulled = false, d.add(fn);
  const Bo = new pt({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Xo = 0;
  const Yo = () => {
    var _a2, _b;
    for (const t of fn.children.slice()) fn.remove(t), (_b = (_a2 = t.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (t) => {
    var _a2, _b;
    Yo();
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const a of t || []) {
      const i = String(a).split(":");
      let r = [];
      if (i[0] === "pt") {
        const x = o[+i[1]];
        x && (r = [x, [x[0] + 1e-3, x[1], x[2]]]);
      } else if (i[0] === "seg") {
        const x = s[+i[1]] || [], S = o[x[+i[2]]], _ = o[x[+i[2] + 1]];
        S && _ && (r = [S, _]);
      } else i[0] === "poly" && (r = (s[+i[1]] || []).map((S) => o[S]).filter(Boolean));
      if (r.length < 2) continue;
      const f = new _e().setFromPoints(r.map((x) => new b(x[0], x[1], x[2]))), w = new Pt(f, Bo);
      w.renderOrder = 1200, fn.add(w);
    }
    if (!fn.children.length) return;
    Xo = performance.now() + 900;
    const n = () => {
      const a = Xo - performance.now();
      if (a <= 0) {
        Yo(), y();
        return;
      }
      Bo.opacity = Math.min(1, a / 900) * 0.95, y(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = As, window.__hekatanOsnapShow = Ro, window.__hekatanOsnapHide = Dn;
  let $e = [], gt = 0, sn = 0, kt = null;
  const Sn = document.createElement("div");
  Sn.id = "hk-cad-status", Sn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", Sn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(Sn);
  const Es = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), ct && t.push(`\u{1F512} LOCK ${ct.toUpperCase()}`);
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && t.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, oe = (t) => {
    var _a2;
    const o = t + Es();
    Sn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, Vs = "Comando:", Ts = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = $e.length, a = (i, r = []) => ({ txt: i, ops: r });
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
        return a(kt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return a(kt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return a(kt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${sn > 0 ? ` (distancia ${sn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return me.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return me.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return me.size ? a(`SELECCI\xD3N ${me.size} objeto${me.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a(Vs);
    }
  }, Xt = () => {
    var _a2, _b, _c, _d, _e2;
    try {
      const t = Ts(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !s ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, a, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Xt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    oe(o);
  }, window.__hekatanCadResetPending = () => {
    $e = [], we = [], J.visible = false, po(), kt = null, y(), oe("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Xt();
  };
  function po() {
    if (!e.polylines) return;
    const t = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...t, []];
  }
  window.__hekatanCerrarPolilinea = po;
  const hn = [], Bn = [], uo = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, No = (t) => {
    var _a2;
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), $e = [], fe.visible = false, mt.visible = false, N();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y(), Xt();
  }, Yt = () => {
    hn.push(uo()), hn.length > 100 && hn.shift(), Bn.length = 0;
  }, Xn = () => {
    const t = hn.pop();
    if (!t) {
      oe("\u21B6 Nada para deshacer");
      return;
    }
    Bn.push(uo()), No(t), oe(`\u21B6 Deshacer \u2014 quedan ${hn.length}`);
  }, Uo = () => {
    const t = Bn.pop();
    if (!t) {
      oe("\u21B7 Nada para rehacer");
      return;
    }
    hn.push(uo()), No(t), oe(`\u21B7 Rehacer \u2014 quedan ${Bn.length}`);
  };
  window.__hekatanPushUndo = Yt, window.__hekatanUndo = Xn, window.__hekatanRedo = Uo, document.addEventListener("keydown", (t) => {
    var _a2;
    const o = t.key.toLowerCase();
    if (!((t.ctrlKey || t.metaKey) && (o === "y" || o === "z" && t.shiftKey))) return;
    const n = t.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (t.preventDefault(), t.stopPropagation(), Uo());
  }, { capture: true }), window.__hekatanCadOption = (t) => {
    var _a2, _b, _c, _d, _e2;
    const o = t.trim().toLowerCase(), s = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
    if (s !== "line" && s !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Xn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (a.length < 3) return oe("Cerrar necesita al menos tres puntos."), true;
      Yt(), e.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return fo(), oe(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Xn(), true;
      Yt();
      const i = a[a.length - 1], r = a.slice(0, -1), f = n.some((S, _) => _ !== n.length - 1 && S.includes(i)) || r.includes(i);
      let w = e.points.rawVal, x = [...n.slice(0, -1), r];
      if (!f && i === w.length - 1 && (w = w.slice(0, -1), e.points.val = w), e.polylines.val = x, r.length) {
        const S = w[r[r.length - 1]];
        S && (X = [S[0], S[1], S[2]]);
      } else X = null, fe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return y(), oe(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Xt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (t) => {
    var _a2;
    if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z" && !t.shiftKey) {
      const o = t.target, s = o == null ? void 0 : o.tagName;
      if ((s === "INPUT" || s === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Xn();
    }
  }, { capture: true });
  const fo = () => {
    $e = [], kt = null, po(), ct = null, Ge(), fe.visible = false, mt.visible = false, N(), oe("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), y(), Xt();
  };
  window.__hekatanFinalizeDraw = fo;
  const Zo = () => {
    var _a2, _b, _c;
    $e = [], we = [], J.visible = false;
    let t = false;
    me.size && (me.clear(), Lt(), t = true), fo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    oe(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), y(), Xt();
  };
  window.__hekatanEscapeCancel = Zo;
  const qo = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return me.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (t[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = t[+n[1]] || [], i = a[+n[2]], r = a[+n[2] + 1];
        i != null && o.add(i), r != null && o.add(r);
      }
    }), o;
  }, Ko = (t, o, s) => {
    var _a2;
    const n = qo();
    if (!n.size) return 0;
    Yt();
    const a = e.points.rawVal.map((i, r) => n.has(r) ? [i[0] + t, i[1] + o, i[2] + s] : i);
    e.points.val = a;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Lt(), y(), n.size;
  };
  window.__hekatanMoveSelection = Ko;
  const Go = (t, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!me.size) {
      oe(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Xt();
      return;
    }
    if ($e.push(o), $e.length === 1) {
      X = o, oe(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Xt();
      return;
    }
    const [s, n] = $e, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    $e = [], fe.visible = false;
    let i = 0;
    t === "move" ? i = Ko(a[0], a[1], a[2]) : (i = qo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), oe(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), t === "move" && (me.clear(), Lt()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Xt();
  };
  window.__hekatanPasoMoverCopiar = Go;
  const $s = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, en = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), ho = (t, o, s, n, a, i) => {
    const r = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], f = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], w = [t[0] - s[0], t[1] - s[1], t[2] - s[2]], x = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], S = r[0] * f[0] + r[1] * f[1] + r[2] * f[2], _ = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], u = r[0] * w[0] + r[1] * w[1] + r[2] * w[2], F = f[0] * w[0] + f[1] * w[1] + f[2] * w[2], j = x * _ - S * S;
    if (j < 1e-12) return null;
    const O = (S * F - _ * u) / j, Y = (x * F - S * u) / j;
    if (!a && (O < -1e-6 || O > 1 + 1e-6) || !i && (Y < -1e-6 || Y > 1 + 1e-6)) return null;
    const v = [t[0] + O * r[0], t[1] + O * r[1], t[2] + O * r[2]], A = [s[0] + Y * f[0], s[1] + Y * f[1], s[2] + Y * f[2]];
    return en(v, A) > 1e-4 ? null : v;
  }, Ls = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === t).length, 0);
  }, Is = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Rs = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal, n = e.points.rawVal, a = Is[t];
    if (!kt) {
      if (Je < 0) {
        oe(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      kt = { poly: Je, seg: Math.max(0, Mt) }, oe(t === "offset" ? `DESFASE l\xEDnea #${kt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${sn > 0 ? ` (${sn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Xt();
      return;
    }
    if (t === "offset") {
      const O = kt.poly, Y = s[O];
      if (!Y || Y.length < 2) {
        kt = null, oe("DESFASE: esa polil\xEDnea no tiene tramos."), Xt();
        return;
      }
      const v = Y.length > 2 && Y[0] === Y[Y.length - 1], A = $s(), C = [];
      for (let ze = 0; ze < Y.length - 1; ze++) {
        const He = n[Y[ze]], Ve = n[Y[ze + 1]], ge = [Ve[0] - He[0], Ve[1] - He[1], Ve[2] - He[2]], Ae = Math.hypot(ge[0], ge[1], ge[2]) || 1, Ke = ge[0] / Ae, Tt = ge[1] / Ae, Dt = ge[2] / Ae, $t = [A[1] * Dt - A[2] * Tt, A[2] * Ke - A[0] * Dt, A[0] * Tt - A[1] * Ke], Qt = Math.hypot($t[0], $t[1], $t[2]) || 1;
        C.push({ a: He, b: Ve, n: [$t[0] / Qt, $t[1] / Qt, $t[2] / Qt] });
      }
      let B = 0, q = 1 / 0;
      C.forEach((ze, He) => {
        const Ve = Jt(o[0], o[1], o[2], ze.a[0], ze.a[1], ze.a[2], ze.b[0], ze.b[1], ze.b[2]);
        Ve < q && (q = Ve, B = He);
      });
      const R = C[B], G = Math.sign((o[0] - R.a[0]) * R.n[0] + (o[1] - R.a[1]) * R.n[1] + (o[2] - R.a[2]) * R.n[2]) || 1, ce = sn > 0 ? sn : q;
      if (ce < 1e-6) {
        oe("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const de = C.map((ze) => ({ a: [ze.a[0] + G * ce * ze.n[0], ze.a[1] + G * ce * ze.n[1], ze.a[2] + G * ce * ze.n[2]], b: [ze.b[0] + G * ce * ze.n[0], ze.b[1] + G * ce * ze.n[1], ze.b[2] + G * ce * ze.n[2]] })), Me = de.length, Oe = (ze) => {
        const He = de[(ze - 1 + Me) % Me], Ve = de[ze % Me];
        return ho(He.a, He.b, Ve.a, Ve.b, true, true) ?? Ve.a;
      }, Ee = [], et = v ? Me : Me + 1;
      for (let ze = 0; ze < et; ze++) !v && ze === 0 ? Ee.push(de[0].a) : !v && ze === Me ? Ee.push(de[Me - 1].b) : Ee.push(Oe(ze));
      Yt();
      const tt = n.length;
      e.points.val = [...n, ...Ee];
      const lt = Ee.map((ze, He) => tt + He);
      v && lt.push(tt);
      let qe = s.slice();
      qe.length && qe[qe.length - 1].length === 0 && (qe = qe.slice(0, -1)), e.polylines.val = [...qe, lt, []], kt = null, oe(`\u2713 Desfase a ${ce.toFixed(2)} m \u2014 ${Me} tramo${Me === 1 ? "" : "s"} nuevo${Me === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      y(), Xt();
      return;
    }
    let i = Je, r = Math.max(0, Mt);
    if (i < 0 || i === kt.poly && r === kt.seg) {
      let Y = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, s.forEach((v, A) => {
        for (let C = 0; C < v.length - 1; C++) {
          if (A === kt.poly && C === kt.seg) continue;
          const B = n[v[C]], q = n[v[C + 1]];
          if (!B || !q) continue;
          const R = Jt(o[0], o[1], o[2], B[0], B[1], B[2], q[0], q[1], q[2]);
          R < Y && (Y = R, i = A, r = C);
        }
      }), i < 0) {
        oe(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const f = s[kt.poly], w = n[f[kt.seg]], x = n[f[kt.seg + 1]], S = s[i], _ = S[r], u = S[r + 1];
    if (!w || !x || _ == null || u == null) {
      oe(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const F = n[_], j = n[u];
    if (t === "trim") {
      const O = ho(F, j, w, x, false, false);
      if (!O) {
        oe("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Yt();
      const Y = n.length;
      e.points.val = [...n, O];
      const v = [...S.slice(0, r + 1), Y, ...S.slice(r + 1)];
      e.polylines.val = s.map((C, B) => B === i ? v : C);
      const A = en(o, F) < en(o, j);
      Vn(i, A ? r : r + 1), oe(`\u2713 Recortado en (${O[0].toFixed(2)}, ${O[1].toFixed(2)}, ${O[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const O = ho(F, j, w, x, true, false);
      if (!O) {
        oe("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const v = en(o, F) < en(o, j) ? r : r + 1;
      if (v !== 0 && v !== S.length - 1) {
        oe("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const A = S[v];
      if (en(O, F) + en(O, j) < en(F, j) + 1e-6) {
        oe("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Yt(), Ls(A) > 1) {
        const B = n.length;
        e.points.val = [...n, O];
        const q = S.slice();
        q[v] = B, e.polylines.val = s.map((R, G) => G === i ? q : R);
      } else e.points.val = n.map((B, q) => q === A ? O : B);
      oe(`\u2713 Alargada hasta (${O[0].toFixed(2)}, ${O[1].toFixed(2)}, ${O[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    y(), Xt();
  };
  window.__hekatanSelectionSize = () => me.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return me.clear(), o >= 0 && me.add(`poly:${o}`), Lt(), oe(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), me.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    me.clear();
    const s = /* @__PURE__ */ new Set();
    return t.forEach((n, a) => {
      !n || n.length < 2 || (me.add(`poly:${a}`), n.forEach((i) => s.add(i)));
    }), o.forEach((n, a) => {
      s.has(a) || me.add(`pt:${a}`);
    }), Lt(), oe(`SELECCI\xD3N ${me.size} objetos (todo el modelo) \xB7 Esc suelta`), me.size;
  }, window.__hekatanReplicateSelection = (t, o, s, n, a = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const i = [...me], r = e.points.rawVal, f = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], w = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), x = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Set(), _ = [];
    if (i.forEach((Y) => {
      if (Y.startsWith("pt:")) {
        const v = +Y.slice(3);
        r[v] && x.add(v);
      } else if (Y.startsWith("poly:")) {
        const v = +Y.slice(5);
        if (!f[v] || f[v].length < 2) return;
        S.add(v), f[v].forEach((A) => x.add(A));
      } else if (Y.startsWith("seg:")) {
        const v = Y.split(":"), A = +v[1], C = +v[2], B = f[A] || [], q = B[C], R = B[C + 1];
        q != null && R != null && (_.push([q, R]), x.add(q), x.add(R));
      }
    }), !x.size) return 0;
    Yt();
    const u = [...r];
    let F = f.slice();
    F.length && F[F.length - 1].length === 0 && (F = F.slice(0, -1));
    const j = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], O = [...x];
    for (let Y = 1; Y <= n; Y++) {
      const v = a + Y, A = t * v, C = o * v, B = s * v, q = /* @__PURE__ */ new Map();
      O.forEach((R) => {
        q.set(R, u.length), u.push([r[R][0] + A, r[R][1] + C, r[R][2] + B]);
      }), S.forEach((R) => {
        const G = f[R].map((de) => q.has(de) ? q.get(de) : de), ce = F.length;
        F.push(G), w.has(R) && j.push(ce);
      }), _.forEach(([R, G]) => {
        F.push([q.get(R), q.get(G)]);
      });
    }
    F.push([]), e.points.val = u, e.polylines && (e.polylines.val = F), e.areas && (e.areas.val = j);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return y(), n;
  }, g.addEventListener("click", (t) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: t.clientX, y: t.clientY }, on > 5) {
      on = 0;
      return;
    }
    on = 0;
    const o = M(t);
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
    (t.ctrlKey || t.metaKey) && (n = new b(Math.round(s[0].point.x), Math.round(s[0].point.y), Math.round(s[0].point.z)));
    {
      const a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = a[a.length - 1] ?? [], r = e.points.rawVal ?? [];
      if (i.length > 0) {
        const f = r[i[i.length - 1]];
        if (f) {
          const w = !!window.__hekatanOrthoMode;
          let x = ct;
          if (!x && w) {
            const S = Math.abs(n.x - f[0]), _ = Math.abs(n.y - f[1]), u = Math.abs(n.z - f[2]);
            x = S >= _ && S >= u ? "x" : _ >= u ? "y" : "z";
          }
          x === "x" ? n = new b(n.x, f[1], f[2]) : x === "y" ? n = new b(f[0], n.y, f[2]) : x === "z" && (n = new b(f[0], f[1], n.z));
        }
      }
    }
    if (Nt && Math.abs(t.clientX - Nt.x) <= 3 && Math.abs(t.clientY - Nt.y) <= 3) n = Nt.p.clone();
    else if (ft) n = ft.clone(), oe(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const a = so(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n = new b(i.x, i.y, i.z), oe(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0;
        r && f > 0 && (n = new b(Math.round(n.x / f) * f, Math.round(n.y / f) * f, Math.round(n.z / f) * f));
      }
    }
    Ho(n, t);
  });
  const Ho = (t, o) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (Et) {
        Bt && In();
        const { kind: n, a, b: i } = Et, r = i !== void 0 ? `${n}:${a}:${i}` : `${n}:${a}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || me.clear(), me.has(r) ? me.delete(r) : me.add(r), Lt(), oe(`\u2713 Seleccionados ${me.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), a = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Bt ? (To(Bt.x, Bt.y, a, i, n), Bt = null) : n || (Bt = { x: a, y: i }, oe("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), io(a, i, a + 1, i + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], oe(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const a = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], a);
      oe(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      Go(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "delete") {
      if (Ue >= 0) {
        const n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = Ue;
        if (i >= 0 && i < a.length) {
          Yt();
          const r = a.slice(0, i).concat(a.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = r : window.__hekatanDrawingAuxLines = r, oe(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Ue = -1, Ze.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (Je >= 0) {
        const n = Je, a = Mt;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (rn(n), oe(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : a >= 0 ? (Vn(n, a), oe(`\u{1F5D1} Segmento ${a + 1} de polil\xEDnea #${n + 1} borrado`)) : (rn(n), oe(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else oe("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if ($e.push([t.x, t.y, t.z]), $e.length === 1) {
        oe("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, a] = $e, i = Math.hypot(a[0] - n[0], a[1] - n[1], a[2] - n[2]);
      Math.abs(a[0] - n[0]);
      const r = Math.abs(a[1] - n[1]), w = Math.abs(a[2] - n[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", x = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, x, w), oe(`\u2713 C\xEDrculo dibujado en ${w.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${x} segmentos`), $e = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (s === "arc") {
      if ($e.push([t.x, t.y, t.z]), $e.length === 1) {
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
      if ($e.push([t.x, t.y, t.z]), $e.length === 1) {
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
      if ($e.push([t.x, t.y, t.z]), $e.length === 1) {
        oe("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = $e;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, a), oe(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), $e = [];
      return;
    }
    if (s === "polyarea") {
      we.push([t.x, t.y, t.z]), J.geometry.setFromPoints(we.map((n) => new b(n[0], n[1], n[2]))), J.visible = we.length >= 1, oe(`\u25B0 \xC1rea libre \u2014 ${we.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), y();
      return;
    }
    if (s === "plane3") {
      if ($e.push([t.x, t.y, t.z]), $e.length < 3) {
        oe(`\u25E3 Plano inclinado \u2014 punto ${$e.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, a, i] = $e, r = (_o2 = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o2.call(window, n, a, i);
      oe(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), $e = [];
      return;
    }
    if (s === "col") {
      Yt();
      const n = t.z, a = gt && gt > 0 ? gt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + a]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], gt = 0, oe(`\u258C Columna creada \u2014 h=${a.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if ($e.push([t.x, t.y, t.z]), $e.length === 1) {
        oe("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, a] = $e, i = gt && gt > 0 ? gt : 3;
      Yt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [a[0], a[1], a[2]], [a[0], a[1], a[2] + i], [n[0], n[1], n[2] + i]];
      const f = e.polylines.rawVal;
      if (f.length - 1, e.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const w = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, w];
      }
      oe(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), $e = [], gt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      Yt();
      const n = gt && gt > 0 ? gt : 3, a = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, a], [t.x, t.y, a + n]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], gt = 0, oe(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, a = jt(t.x, t.y, t.z, n);
      if (!a) {
        oe("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, r = e.points.rawVal, f = i[a.polyIdx], w = r[f[a.segIdx]], x = r[f[a.segIdx + 1]];
      if (!w || !x) {
        oe("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const S = gt && gt > 0 ? gt : 3;
      Yt();
      const _ = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [w[0], w[1], w[2]], [x[0], x[1], x[2]], [x[0], x[1], x[2] + S], [w[0], w[1], w[2] + S]];
      const u = e.polylines.rawVal;
      if (e.polylines.val = [...u.slice(0, -1), ...u[u.length - 1].length > 0 ? [u[u.length - 1]] : [], [_, _ + 1, _ + 2, _ + 3, _], []], e.areas) {
        const F = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, F];
      }
      gt = 0, oe(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${S.toFixed(2)}m`);
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
      oe(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if ($e.push([t.x, t.y, t.z]), $e.length === 1) {
        oe("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, a] = $e, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const S = i.rawVal ?? i.val ?? [];
        i.val = [...S, [n[0], n[1], n[2], a[0], a[1], a[2]]];
      }
      const r = a[0] - n[0], f = a[1] - n[1], w = a[2] - n[2], x = Math.sqrt(r * r + f * f + w * w);
      oe(`\u2713 L\xEDnea auxiliar creada \u2014 L=${x.toFixed(2)}m (cyan, no FEM)`), $e = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Rs(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "chaflan") {
      if ($e.push([t.x, t.y, t.z]), $e.length === 1) {
        oe("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = $e, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, a, i, r, 6);
      const f = Math.abs(a[0] - n[0]).toFixed(1), w = Math.abs(a[1] - n[1]).toFixed(1);
      oe(`\u2713 Losa con chaflanes dibujada \u2014 ${f}\xD7${w}m, r=${i}m, ${r} seg/chafl\xE1n`), $e = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (T = false, Yt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, a = n.length - 1, i = n[a] ?? [];
      if (s === "line" && i.length >= 2) {
        oe(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, a]), oe("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") oe(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (s === "line") oe("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") oe("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      oe(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  g.addEventListener("click", () => Xt()), g.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && we.length >= 3) {
      t.preventDefault();
      const s = yn();
      oe(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), g.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(z, o);
    const s = ie();
    if (Se.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = r[r.length - 1] ?? [], w = e.points.rawVal ?? [];
        if (f.length > 0) {
          const x = w[f[f.length - 1]];
          if (x) {
            const S = !!window.__hekatanOrthoMode;
            let _ = ct;
            if (!_ && S) {
              const u = Math.abs(n.x - x[0]), F = Math.abs(n.y - x[1]), j = Math.abs(n.z - x[2]);
              _ = u >= F && u >= j ? "x" : F >= j ? "y" : "z";
            }
            _ === "x" ? n.set(n.x, x[1], x[2]) : _ === "y" ? n.set(x[0], n.y, x[2]) : _ === "z" && n.set(x[0], x[1], n.z);
          }
        }
      }
      const a = so(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0.5;
        r && f > 0 && (n.x = Math.round(n.x / f) * f, n.y = Math.round(n.y / f) * f, n.z = Math.round(n.z / f) * f);
      }
      Se.geometry.setAttribute("position", new St(n.toArray(), 3));
    }
    y();
  }), g.addEventListener("pointermove", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(z, o);
    let s = false;
    const n = k.intersectObject(ee), a = ie();
    if (n.length && a.length) {
      const i = new b(...e.points.rawVal[n[0].index]), r = new b(...a[0].point), f = i.sub(r), w = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      w.transformDirection(H.matrixWorld), Math.abs(f.dot(w)) < 1e-4 && (s = true);
    }
    Se.visible = !s;
  });
  let mo = false, wo;
  g.addEventListener("pointermove", (t) => {
    var _a2;
    if (!on) return;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(z, o);
    let s = false;
    const n = k.intersectObject(ee), a = ie();
    if (n.length && a.length) {
      const r = new b(...e.points.rawVal[n[0].index]), f = new b(...a[0].point), w = r.sub(f), x = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      x.transformDirection(H.matrixWorld), Math.abs(w.dot(x)) < 1e-4 && (s = true);
    }
    if (s && on < 5 && (mo = true, c.enabled = false, wo = n[0].index), !mo || on % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (wo !== void 0) {
      let r = a[0].point;
      (t.ctrlKey || t.metaKey) && (r = new b(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[wo] = r.toArray();
    }
    e.points.val = i;
  }), g.addEventListener("pointerup", () => {
    c.enabled = true, mo = false;
  }), g.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(z, o);
    let s = false;
    const n = k.intersectObject(ee), a = ie();
    if (n.length && a.length) {
      const f = new b(...e.points.rawVal[n[0].index]), w = new b(...a[0].point), x = f.sub(w), S = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      S.transformDirection(H.matrixWorld), Math.abs(x.dot(S)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((f) => f.filter((w) => w !== n[0].index)).map((f) => f.map((w) => w > n[0].index ? w - 1 : w)).filter((f) => f.length);
    r.push([]), e.polylines.val = r;
  });
}
function Ca(e, l, d) {
  const m = Math.round(14.999999999999998), p = { position: e.position.clone(), quaternion: e.quaternion.clone() }, g = setInterval(k, 1e3 / 30);
  let y = 0;
  function k() {
    y++;
    const z = y / m;
    e.position.lerpVectors(p.position, l.position, z), e.quaternion.slerpQuaternions(p.quaternion, l.quaternion, z), d && d(), y == m && clearInterval(g);
  }
}
function za(e, l, d, h) {
  const c = aa(d, e.elements, h);
  return W.derive(() => {
    c.visible = l.shellResults.val != "none";
  }), c;
}
const Fa = 6, ko = 10, Aa = 0.012;
function Ea(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Va(e, l, d, h) {
  if (!d && !h) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && d) {
    const m = d[e];
    if (m && m.has(l)) return m.get(l);
  }
  return null;
}
function Ta(e, l, d, h) {
  const c = new nt(), m = new xs();
  m.setColorMap("rainbow");
  const p = new Kt(), g = W.state([]);
  return W.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const y = d.val, k = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], z = Ea(l.frameResults.val);
    if (c.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), c.clear(), !z || k.length === 0 || y.length === 0) {
      g.val = [];
      return;
    }
    const M = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, H = (_c = e.deformOutputs) == null ? void 0 : _c.val, le = [], pe = [];
    for (let $ = 0; $ < k.length; $++) {
      if (k[$].length !== 2) continue;
      const he = Va(z, $, M, H);
      he && (le.push(he[0], he[1]), pe.push({ idx: $, vals: he }));
    }
    if (le.length === 0) {
      g.val = [];
      return;
    }
    const ae = Math.min(...le), E = Math.max(...le);
    m.setMin(ae), m.setMax(E), g.val = le;
    const ie = [1 / 0, 1 / 0, 1 / 0], ee = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of y) for (let ne = 0; ne < 3; ne++) ie[ne] = Math.min(ie[ne], $[ne]), ee[ne] = Math.max(ee[ne], $[ne]);
    const ve = Math.max(ee[0] - ie[0], ee[1] - ie[1], ee[2] - ie[2], 1) * Aa, U = [], X = [], K = [];
    let T = 0;
    for (const { idx: $, vals: ne } of pe) {
      const he = k[$], re = y[he[0]], se = y[he[1]];
      if (!re || !se) continue;
      const D = new b(se[0] - re[0], se[1] - re[1], se[2] - re[2]), fe = D.length();
      if (fe < 1e-10) continue;
      D.normalize();
      const J = Math.abs(D.y) < 0.99 ? new b(0, 1, 0) : new b(1, 0, 0), we = new b().crossVectors(D, J).normalize(), ye = new b().crossVectors(D, we).normalize(), Le = ko + 1, ke = Fa;
      for (let Ye = 0; Ye < Le; Ye++) {
        const Qe = Ye / ko, mt = re[0] + D.x * fe * Qe, Ft = re[1] + D.y * fe * Qe, P = re[2] + D.z * fe * Qe, L = ne[0] + (ne[1] - ne[0]) * Qe, Q = m.getColor(L) ?? new Kt(0, 0, 0);
        p.copy(Q).convertSRGBToLinear();
        for (let I = 0; I < ke; I++) {
          const ue = I / ke * Math.PI * 2, xe = Math.cos(ue), be = Math.sin(ue);
          U.push(mt + (we.x * xe + ye.x * be) * ve, Ft + (we.y * xe + ye.y * be) * ve, P + (we.z * xe + ye.z * be) * ve), X.push(p.r, p.g, p.b);
        }
      }
      for (let Ye = 0; Ye < ko; Ye++) for (let Qe = 0; Qe < ke; Qe++) {
        const mt = (Qe + 1) % ke, Ft = T + Ye * ke + Qe, P = T + Ye * ke + mt, L = T + (Ye + 1) * ke + Qe, Q = T + (Ye + 1) * ke + mt;
        K.push(Ft, P, Q), K.push(Ft, Q, L);
      }
      T += Le * ke;
    }
    if (U.length === 0) return;
    const V = new _e();
    V.setAttribute("position", new St(U, 3)), V.setAttribute("color", new St(X, 3)), V.setIndex(K), V.computeVertexNormals();
    const Z = new rt({ vertexColors: true, side: zt }), N = new ot(V, Z);
    N.frustumCulled = false, c.add(N);
  }), c.__colorMapValues = g, c;
}
function $a() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const La = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Ia = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Ra = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function vt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Da = 16755200, ds = 56831, Ba = 56831, Xa = 56831, Gn = 65382;
function Ya(e) {
  const l = new nt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const d = new mn(1, 16, 16), h = new rt({ color: Da, transparent: true, opacity: 0.85, depthTest: false }), c = new ot(d, h);
  c.visible = false, c.renderOrder = 100, l.add(c);
  const m = new _e(), p = new pt({ color: ds, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), g = new Ht(m, p);
  g.visible = false, g.renderOrder = 100, l.add(g);
  const y = new rt({ color: ds, transparent: true, opacity: 0.7, depthTest: false }), k = new ot(new as(1, 1, 1, 12), y);
  k.visible = false, k.renderOrder = 100, l.add(k);
  const z = new _e(), M = new rt({ color: Ba, transparent: true, opacity: 0.45, side: zt, depthTest: false }), H = new ot(z, M);
  H.visible = false, H.renderOrder = 100, l.add(H);
  const le = new _e(), pe = new pt({ color: Xa, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), ae = new Ht(le, pe);
  ae.visible = false, ae.renderOrder = 100, l.add(ae);
  const E = new rt({ color: Gn, transparent: true, opacity: 0.95, depthTest: false }), ie = new rt({ color: Gn, transparent: true, opacity: 0.85, depthTest: false }), ee = new as(1, 1, 1, 12), Se = new rt({ color: Gn, transparent: true, opacity: 0.55, side: zt, depthTest: false }), ve = new pt({ color: Gn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), U = [];
  window.__hekatanModelSelection = U;
  const X = new nt();
  X.renderOrder = 101, l.add(X);
  const K = document.createElement("div");
  Object.assign(K.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), K.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(K);
  }, 0);
  function T(P) {
    const L = e.derivedNodes.rawVal;
    return !L || P < 0 || P >= L.length ? null : new b(L[P][0], L[P][1], L[P][2]);
  }
  function V(P, L) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s;
    const Q = e.getActiveCamera();
    if (!Q || !e.mesh) return null;
    const I = e.rendererElm.getBoundingClientRect(), ue = P - I.left, xe = L - I.top, be = e.derivedNodes.rawVal, Pe = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!be || !Pe) return null;
    const Te = /* @__PURE__ */ new Map(), Re = (Ge) => {
      if (Te.has(Ge)) return Te.get(Ge);
      const Be = T(Ge);
      if (!Be) return Te.set(Ge, null), null;
      const Ce = Be.clone().project(Q), We = (Ce.x * 0.5 + 0.5) * I.width, Fe = (-Ce.y * 0.5 + 0.5) * I.height, Ze = { x: We, y: Fe, z: Ce.z };
      return Te.set(Ge, Ze), Ze;
    }, Xe = /* @__PURE__ */ new Set();
    for (const Ge of Pe) if (Ge) for (const Be of Ge) Xe.add(Be);
    const De = 8;
    let Ne = -1, ut = De;
    for (let Ge = 0; Ge < be.length; Ge++) {
      if (!Xe.has(Ge)) continue;
      const Be = Re(Ge);
      if (!Be || Be.z < -1 || Be.z > 1) continue;
      const Ce = Be.x - ue, We = Be.y - xe, Fe = Math.sqrt(Ce * Ce + We * We);
      Fe < ut && (ut = Fe, Ne = Ge);
    }
    const Ie = $a(), wt = Ia[Ie.dispUnit] ?? 1e3, je = La[Ie.forceUnit] ?? 1;
    if (Ne >= 0) {
      const Ge = be[Ne];
      let Be = `Nodo ${Ne}
(${Ge[0].toFixed(3)}, ${Ge[1].toFixed(3)}, ${Ge[2].toFixed(3)})`;
      const Ce = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Ce == null ? void 0 : Ce.deformations) {
        const We = Ce.deformations.get(Ne);
        if (We && (Be += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Be += `
Ux = ${vt(We[0] * wt, 3)} ${Ie.dispUnit}`, Be += `
Uy = ${vt(We[1] * wt, 3)} ${Ie.dispUnit}`, Be += `
Uz = ${vt(We[2] * wt, 3)} ${Ie.dispUnit}`, (Math.abs(We[3]) > 1e-9 || Math.abs(We[4]) > 1e-9 || Math.abs(We[5]) > 1e-9) && (Be += `
Rx = ${vt(We[3] * 1e3, 3)} mrad`, Be += `
Ry = ${vt(We[4] * 1e3, 3)} mrad`, Be += `
Rz = ${vt(We[5] * 1e3, 3)} mrad`)), Ce.reactions) {
          const Fe = Ce.reactions.get(Ne);
          Fe && (Math.abs(Fe[0]) > 1e-9 || Math.abs(Fe[1]) > 1e-9 || Math.abs(Fe[2]) > 1e-9 || Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Be += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Be += `
Fx = ${vt(Fe[0] * je)} ${Ie.forceUnit}`, Be += `
Fy = ${vt(Fe[1] * je)} ${Ie.forceUnit}`, Be += `
Fz = ${vt(Fe[2] * je)} ${Ie.forceUnit}`, (Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Be += `
Mx = ${vt(Fe[3] * je)} ${Ie.forceUnit}\xB7m`, Be += `
My = ${vt(Fe[4] * je)} ${Ie.forceUnit}\xB7m`, Be += `
Mz = ${vt(Fe[5] * je)} ${Ie.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ne, info: Be };
    }
    const ct = 5;
    let ft = -1, Nt = ct, st = "frame";
    for (let Ge = 0; Ge < Pe.length; Ge++) {
      const Be = Pe[Ge];
      if (!(!Be || Be.length < 2)) {
        if (Be.length === 2) {
          const Ce = Re(Be[0]), We = Re(Be[1]);
          if (!Ce || !We || Ce.z < -1 || Ce.z > 1 || We.z < -1 || We.z > 1) continue;
          const Fe = Na(ue, xe, Ce.x, Ce.y, We.x, We.y);
          Fe < Nt && (Nt = Fe, ft = Ge, st = "frame");
        } else if (Be.length === 3 || Be.length === 4) {
          const Ce = [];
          let We = true;
          for (const Fe of Be) {
            const Ze = Re(Fe);
            if (!Ze || Ze.z < -1 || Ze.z > 1) {
              We = false;
              break;
            }
            Ce.push(Ze);
          }
          if (!We) continue;
          if (Ua(ue, xe, Ce)) {
            const Ze = Ce.reduce((Je, Mt) => Je + Mt.z, 0) / Ce.length * 1e-3;
            Ze < Nt && (Nt = Ze, ft = Ge, st = "shell");
          }
        } else if (Be.length === 8) {
          const Ce = [];
          let We = true;
          for (const Ue of Be) {
            const me = Re(Ue);
            if (!me || me.z < -1 || me.z > 1) {
              We = false;
              break;
            }
            Ce.push(me);
          }
          if (!We) continue;
          const Fe = Math.min(...Ce.map((Ue) => Ue.x)), Ze = Math.max(...Ce.map((Ue) => Ue.x)), Je = Math.min(...Ce.map((Ue) => Ue.y)), Mt = Math.max(...Ce.map((Ue) => Ue.y));
          if (ue >= Fe && ue <= Ze && xe >= Je && xe <= Mt) {
            const me = Ce.reduce((dt, at) => dt + at.z, 0) / Ce.length * 1e-3;
            me < Nt && (Nt = me, ft = Ge, st = "solid");
          }
        }
      }
    }
    if (ft >= 0) {
      const Ge = Pe[ft];
      let Ce = `${st === "frame" ? "Frame" : st === "shell" ? "Shell" : "Solid"} ${ft}`;
      const We = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Fe = (_g = (_f = We == null ? void 0 : We.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, ft);
      if (Fe) {
        Fe.name && (Ce += `
  \u{1F4CB} ${Fe.name}`), Fe.shape && (Ce += `
  Shape: ${Fe.shape}`);
        const Ze = /concrete|hormig|rect.*sólida/i.test(Fe.shape || ""), Je = Ze ? 100 : 1e3, Mt = Ze ? "cm" : "mm", Ue = (dt) => {
          const at = dt * Je;
          return Math.abs(at - Math.round(at)) < 0.05 ? `${Math.round(at)}` : `${at.toFixed(1)}`;
        }, me = [];
        if (Fe.D != null && me.push(`D=${Ue(Fe.D)}`), Fe.B != null && me.push(`B=${Ue(Fe.B)}`), Fe.TF != null && me.push(`TF=${Ue(Fe.TF)}`), Fe.TW != null && me.push(`TW=${Ue(Fe.TW)}`), Fe.t != null && me.push(`t=${Ue(Fe.t)}`), me.length && (Ce += `
  Dim: ${me.join(" ")} ${Mt}`), Fe.material) {
          let dt = Fe.material;
          Fe.fillMaterial && (dt += ` + FILL "${Fe.fillMaterial}"`), Ce += `
  Mat: ${dt}`;
        }
      } else {
        const Ze = (_i = (_h = We == null ? void 0 : We.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, ft), Je = (_k = (_j = We == null ? void 0 : We.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, ft);
        Ze ? (Ce += `
  ${Ze}`, Je && !Ze.includes(Je) && (Ce += `  (${Je})`)) : Je && (Ce += `
  Material: ${Je}`);
      }
      if (Ce += `
nodos: [${Ge.join(", ")}]`, st === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Ze = e.mesh.analyzeOutputs.rawVal, Je = Ra[Ie.stressUnit] ?? 1, Mt = [["bendingXX", "Mxx", je, `${Ie.forceUnit}\xB7m/m`], ["bendingYY", "Myy", je, `${Ie.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", je, `${Ie.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", je, `${Ie.forceUnit}/m`], ["membraneYY", "Nyy", je, `${Ie.forceUnit}/m`], ["membraneXY", "Nxy", je, `${Ie.forceUnit}/m`], ["shearX", "Qx", je, `${Ie.forceUnit}/m`], ["shearY", "Qy", je, `${Ie.forceUnit}/m`], ["vonMises", "\u03C3VM", Je, Ie.stressUnit], ["pressure", "p", Je, Ie.stressUnit]], Ue = [];
        for (const [me, dt, at, Gt] of Mt) {
          const Wt = Ze == null ? void 0 : Ze[me];
          if (Wt && Wt instanceof Map) {
            const yt = Wt.get(ft);
            if (yt != null) {
              if (typeof yt == "number") Ue.push(`${dt} = ${vt(yt * at, 3)} ${Gt}`);
              else if (Array.isArray(yt)) {
                let bt = yt[0];
                for (const Et of yt) Math.abs(Et) > Math.abs(bt) && (bt = Et);
                Ue.push(`${dt} = ${vt(bt * at, 3)} ${Gt}`);
              }
            }
          }
        }
        Ue.length > 0 && (Ce += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ue.slice(0, 8).join(`
`));
      }
      if (st === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const Ze = e.mesh.deformOutputs.rawVal, Je = e.mesh.elementInputs.rawVal, Mt = Ze == null ? void 0 : Ze.deformations;
        if (Mt && Ge.length === 2) {
          const Ue = Mt.get(Ge[0]), me = Mt.get(Ge[1]), dt = be[Ge[0]], at = be[Ge[1]];
          if (Ue && me && dt && at) {
            const Gt = at[0] - dt[0], Wt = at[1] - dt[1], yt = at[2] - dt[2], bt = Math.sqrt(Gt * Gt + Wt * Wt + yt * yt);
            if (bt > 1e-9) {
              const Et = Gt / bt, An = Wt / bt, Lt = yt / bt, Jt = (me[0] - Ue[0]) * Et + (me[1] - Ue[1]) * An + (me[2] - Ue[2]) * Lt, jt = ((_n = Je.elasticities) == null ? void 0 : _n.get(ft)) ?? 0, En = ((_o2 = Je.areas) == null ? void 0 : _o2.get(ft)) ?? 0, eo = ((_p = Je.momentsOfInertiaY) == null ? void 0 : _p.get(ft)) ?? 0, to = ((_q = Je.momentsOfInertiaZ) == null ? void 0 : _q.get(ft)) ?? 0, rn = ((_r = Je.torsionalConstants) == null ? void 0 : _r.get(ft)) ?? 0, Vn = ((_s = Je.shearModuli) == null ? void 0 : _s.get(ft)) ?? jt / 2.6, nn = jt * En * (Jt / bt), Tn = (me[3] - Ue[3]) * Et + (me[4] - Ue[4]) * An + (me[5] - Ue[5]) * Lt, wn = Vn * rn * (Tn / bt), $n = me[4] - Ue[4], yn = me[5] - Ue[5], It = jt * eo * $n / bt, Zt = jt * to * yn / bt;
              Ce += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ce += `
L = ${vt(bt, 3)} m`, Ce += `
\u0394L = ${vt(Jt * wt, 3)} ${Ie.dispUnit}`, Ce += `
\u03B5 = ${vt(Jt / bt, 6)}`, Math.abs(nn) > 1e-6 && (Ce += `
N \u2248 ${vt(nn * je)} ${Ie.forceUnit}`), Math.abs(wn) > 1e-6 && (Ce += `
T \u2248 ${vt(wn * je)} ${Ie.forceUnit}\xB7m`), Math.abs(It) > 1e-6 && (Ce += `
My \u2248 ${vt(It * je)} ${Ie.forceUnit}\xB7m`), Math.abs(Zt) > 1e-6 && (Ce += `
Mz \u2248 ${vt(Zt * je)} ${Ie.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: st, idx: ft, info: Ce };
    }
    return null;
  }
  function Z(P, L, Q) {
    var _a2, _b, _c;
    if (c.visible = false, g.visible = false, k.visible = false, H.visible = false, ae.visible = false, !P || !e.mesh) {
      K.style.display = "none", e.render();
      return;
    }
    const I = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (P.type === "node") {
      const Pe = T(P.idx);
      if (Pe) {
        const Te = e.derivedNodes.rawVal ?? [];
        let Re = 1;
        if (Te.length >= 2) {
          let Ne = [1 / 0, 1 / 0, 1 / 0], ut = [-1 / 0, -1 / 0, -1 / 0];
          for (const Ie of Te) for (let wt = 0; wt < 3; wt++) Ie[wt] < Ne[wt] && (Ne[wt] = Ie[wt]), Ie[wt] > ut[wt] && (ut[wt] = Ie[wt]);
          Re = Math.max(ut[0] - Ne[0], ut[1] - Ne[1], ut[2] - Ne[2], 0.1);
        }
        const Xe = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, De = 0.021 * Re * Xe;
        c.position.copy(Pe), c.scale.setScalar(De), c.visible = true;
      }
    } else if (P.type === "frame" && I) {
      const Pe = I[P.idx], Te = T(Pe[0]), Re = T(Pe[1]);
      if (Te && Re) {
        const Xe = Te.clone().add(Re).multiplyScalar(0.5), De = Re.clone().sub(Te), Ne = De.length(), wt = e.getActiveCamera().position.distanceTo(Xe) * 35e-4;
        k.position.copy(Xe);
        const je = new b(0, 1, 0), ct = je.clone().cross(De).normalize(), ft = je.angleTo(De);
        k.quaternion.setFromAxisAngle(ct, ft), k.scale.set(wt, Ne, wt), k.visible = true;
      }
    } else if (P.type === "shell" && I) {
      const Pe = I[P.idx], Te = [], Re = [];
      for (const Xe of Pe) {
        const De = T(Xe);
        if (!De) return;
        Te.push(De.x, De.y, De.z);
      }
      Pe.length === 4 ? Re.push(0, 1, 2, 0, 2, 3) : Pe.length === 3 && Re.push(0, 1, 2), z.setAttribute("position", new St(Te, 3)), z.setIndex(Re), z.computeVertexNormals(), H.visible = true;
    } else if (P.type === "solid" && I) {
      const Pe = I[P.idx], Te = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Re = [];
      for (const [Xe, De] of Te) {
        const Ne = T(Pe[Xe]), ut = T(Pe[De]);
        Ne && ut && Re.push(Ne.x, Ne.y, Ne.z, ut.x, ut.y, ut.z);
      }
      le.setAttribute("position", new St(Re, 3)), ae.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      K.style.display = "none", e.render();
      return;
    }
    K.textContent = P.info, K.style.whiteSpace = "pre-line", K.style.display = "block";
    const xe = e.rendererElm.getBoundingClientRect(), be = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? xe;
    K.style.left = `${L - be.left}px`, K.style.top = `${Q - be.top}px`, e.render();
  }
  let N = "", $ = 0, ne = 0;
  const he = window.__hekatanHoverDebug ?? false, re = (P) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const L = V(P.clientX, P.clientY);
      if (he && ne < 5) {
        const I = e.derivedNodes.rawVal, ue = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${P.clientX}, ${P.clientY}) nodes=${(I == null ? void 0 : I.length) ?? 0} elems=${(ue == null ? void 0 : ue.length) ?? 0} hover=`, L), ne++;
      }
      const Q = L ? `${L.type}:${L.idx}` : "";
      if (Q !== N) N = Q, Z(L, P.clientX, P.clientY);
      else if (L) {
        const I = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        K.style.left = `${P.clientX - I.left}px`, K.style.top = `${P.clientY - I.top}px`;
      }
    });
  };
  let se = null;
  const D = () => {
    N = "", c.visible = false, g.visible = false, k.visible = false, H.visible = false, ae.visible = false, K.style.display = "none", e.render();
  }, fe = (P) => {
    const L = e.rendererElm.getBoundingClientRect(), Q = P.clientX - L.left, I = P.clientY - L.top;
    (Q < -2 || I < -2 || Q > L.width + 2 || I > L.height + 2) && (se && clearTimeout(se), se = window.setTimeout(D, 200));
  }, J = () => {
    se && (clearTimeout(se), se = null);
  };
  e.rendererElm.addEventListener("pointermove", re), e.rendererElm.addEventListener("pointerleave", fe), e.rendererElm.addEventListener("pointerenter", J);
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
    const L = P.clientX - ye.x, Q = P.clientY - ye.y;
    if (ye = null, L * L + Q * Q > 9 || !we()) return;
    const I = V(P.clientX, P.clientY);
    I ? (mt({ type: I.type, idx: I.idx }, P.shiftKey), Qe()) : Ft();
  }), window.addEventListener("keydown", (P) => {
    if (P.key !== "Escape" || !U.length) return;
    const L = document.activeElement, Q = !!L && (L.id === "hk3-cmd-input" || L.id === "hk-dyn-input") && L.value === "";
    L && (L.tagName === "INPUT" || L.tagName === "TEXTAREA" || L.isContentEditable) && !Q || Ft();
  }, { capture: true });
  function Le() {
    for (const P of X.children.slice()) {
      X.remove(P);
      const L = P.geometry;
      L && L !== d && L !== ee && L.dispose();
    }
  }
  const ke = (P) => {
    var _a2;
    const L = e.getActiveCamera(), Q = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return L.isOrthographicCamera ? (L.top - L.bottom) / (L.zoom || 1) / Q : 2 * L.position.distanceTo(P) * Math.tan((L.fov || 50) * Math.PI / 180 / 2) / Q;
  };
  function Ye(P, L) {
    var _a2, _b;
    const Q = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (P.type === "node") {
      const I = T(P.idx);
      if (!I) return;
      const ue = new ot(d, E);
      ue.position.copy(I), ue.scale.setScalar(Math.max(1e-4, 7 * ke(I))), ue.renderOrder = 101, X.add(ue);
    } else if (P.type === "frame" && Q) {
      const I = Q[P.idx], ue = T(I[0]), xe = T(I[1]);
      if (!ue || !xe) return;
      const be = ue.clone().add(xe).multiplyScalar(0.5), Pe = xe.clone().sub(ue), Te = Pe.length(), Re = e.getActiveCamera().position.distanceTo(be), Xe = new ot(ee, ie);
      Xe.position.copy(be);
      const De = new b(0, 1, 0);
      Xe.quaternion.setFromAxisAngle(De.clone().cross(Pe).normalize(), De.angleTo(Pe)), Xe.scale.set(Re * 35e-4, Te, Re * 35e-4), Xe.renderOrder = 101, X.add(Xe);
    } else if (P.type === "shell" && Q) {
      const I = Q[P.idx], ue = [], xe = [];
      for (const Te of I) {
        const Re = T(Te);
        if (!Re) return;
        ue.push(Re.x, Re.y, Re.z);
      }
      I.length === 4 ? xe.push(0, 1, 2, 0, 2, 3) : I.length === 3 && xe.push(0, 1, 2);
      const be = new _e();
      be.setAttribute("position", new St(ue, 3)), be.setIndex(xe), be.computeVertexNormals();
      const Pe = new ot(be, Se);
      Pe.renderOrder = 101, X.add(Pe);
    } else if (P.type === "solid" && Q) {
      const I = Q[P.idx], ue = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], xe = [];
      for (const [Te, Re] of ue) {
        const Xe = T(I[Te]), De = T(I[Re]);
        Xe && De && xe.push(Xe.x, Xe.y, Xe.z, De.x, De.y, De.z);
      }
      const be = new _e();
      be.setAttribute("position", new St(xe, 3));
      const Pe = new Ht(be, ve);
      Pe.renderOrder = 101, X.add(Pe);
    }
  }
  function Qe() {
    if (Le(), !U.length || !e.mesh) {
      e.render();
      return;
    }
    const P = e.derivedNodes.rawVal ?? [];
    if (P.length >= 2) {
      const L = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
      for (const I of P) for (let ue = 0; ue < 3; ue++) I[ue] < L[ue] && (L[ue] = I[ue]), I[ue] > Q[ue] && (Q[ue] = I[ue]);
      Math.max(Q[0] - L[0], Q[1] - L[1], Q[2] - L[2], 0.1);
    }
    for (const L of U) Ye(L);
    e.render();
  }
  function mt(P, L) {
    const Q = U.findIndex((I) => I.type === P.type && I.idx === P.idx);
    Q >= 0 ? U.splice(Q, 1) : L || U.push(P), U.length && U[U.length - 1];
  }
  function Ft() {
    U.length = 0, Qe();
  }
  return W.derive(() => {
    e.derivedNodes.val, U.length && Qe();
  }), l;
}
function Na(e, l, d, h, c, m) {
  const p = c - d, g = m - h, y = p * p + g * g;
  if (y < 1e-9) {
    const pe = e - d, ae = l - h;
    return Math.sqrt(pe * pe + ae * ae);
  }
  let k = ((e - d) * p + (l - h) * g) / y;
  k = Math.max(0, Math.min(1, k));
  const z = d + k * p, M = h + k * g, H = e - z, le = l - M;
  return Math.sqrt(H * H + le * le);
}
function Ua(e, l, d) {
  let h = false;
  for (let c = 0, m = d.length - 1; c < d.length; m = c++) {
    const p = d[c].x, g = d[c].y, y = d[m].x, k = d[m].y;
    g > l != k > l && e < (y - p) * (l - g) / (k - g + 1e-12) + p && (h = !h);
  }
  return h;
}
function ps(e, l = 8) {
  const d = document.createElement("div");
  d.id = "legend", d.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    W.derive(() => {
      Qn.val, d.style.background = sa();
    });
  });
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", d.appendChild(h), setTimeout(() => {
    W.derive(() => {
      h.textContent = Co.val ? `[${Co.val}]` : "";
    });
  });
  const c = Array.from({ length: l + 1 }, (y, k) => k / l).reverse();
  let m, p;
  c.forEach((y, k) => {
    m = document.createElement("div"), m.id = `marker-${k}`, m.className = "marker", m.style.marginTop = k == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", p = document.createElement("p"), p.id = `marker-text-${k}`, m.append(p), d.append(m);
  });
  const g = [];
  return d.querySelectorAll("p").forEach((y) => g.push(y)), setTimeout(() => {
    W.derive(() => {
      c.forEach((y, k) => {
        const z = g[k];
        z && (z.innerText = Za(e.val, y).toString());
      });
    });
  }), d;
}
function Za(e, l) {
  const d = Fn.val;
  if (d) return us(d[0] + l * (d[1] - d[0]));
  const h = e.filter((p) => Number.isFinite(p));
  if (h.length === 0) return "0";
  const [c, m] = Fo(h);
  return us(c + l * (m - c));
}
function us(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function ni({ mesh: e, settingsObj: l, drawingObj: d, objects3D: h, solids: c }) {
  ta.DEFAULT_UP = new b(0, 0, 1);
  const m = document.createElement("div"), p = new Js(), g = new Qs(45, 1, 0.1, 2 * 1e6), y = new js(-10, 10, 10, -10, -1e3, 2e6);
  let k = g;
  const z = new ea({ antialias: true });
  z.localClippingEnabled = true;
  const M = new is(g, z.domElement);
  M.enableDamping = true, M.dampingFactor = 0.1, M.screenSpacePanning = true, M.zoomSpeed = 0.8, M.panSpeed = 1.2, M.rotateSpeed = 0.9, M.keyPanSpeed = 12, M.listenToKeyEvents(window), M.touches = { ONE: qn.ROTATE, TWO: qn.DOLLY_PAN }, z.domElement.addEventListener("wheel", (P) => {
    if (!P.ctrlKey && Math.abs(P.deltaX) > Math.abs(P.deltaY) * 1.5) {
      P.preventDefault();
      const L = M.target, Q = new b().subVectors(g.position, L), I = new b();
      I.crossVectors(g.up, Q).normalize();
      const xe = Q.length() * 1e-3 * M.panSpeed;
      L.addScaledVector(I, P.deltaX * xe), g.position.addScaledVector(I, P.deltaX * xe), M.update();
    }
  }, { passive: false });
  const H = new bo(new b(-1, 0, 0), 0), le = new bo(new b(0, -1, 0), 0), pe = new bo(new b(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function ae() {
    const P = window.__hekatanClip, L = [];
    P.enableX && (H.normal.set(P.invertX ? 1 : -1, 0, 0), H.constant = P.invertX ? -P.posX : P.posX, L.push(H)), P.enableY && (le.normal.set(0, P.invertY ? 1 : -1, 0), le.constant = P.invertY ? -P.posY : P.posY, L.push(le)), P.enableZ && (pe.normal.set(0, 0, P.invertZ ? 1 : -1), pe.constant = P.invertZ ? -P.posZ : P.posZ, L.push(pe)), z.clippingPlanes = L, p.traverse((I) => {
      const ue = I;
      if (ue.material) {
        const xe = Array.isArray(ue.material) ? ue.material : [ue.material];
        for (const be of xe) be.clippingPlanes = L, be.needsUpdate = true;
      }
    });
    const Q = window.__hekatanPanes ?? [];
    for (const I of Q) try {
      I && typeof I.refresh == "function" && I.refresh();
    } catch {
    }
    z.render(p, k);
  }
  ae(), window.__hekatanClipApply = ae;
  const E = la(l), ie = W.derive(() => Math.pow(10, E.displayScale.val / 10)), ee = qa(e, E), Se = () => {
    const P = [];
    return E.gridXY.rawVal && P.push("xy"), E.gridXZ.rawVal && P.push("xz"), E.gridYZ.rawVal && P.push("yz"), P;
  }, ve = () => {
    const P = E.gridStep.rawVal, L = Math.max(P, E.gridMajor.rawVal);
    return { planes: Se(), majorStep: L, minorStep: P };
  };
  let U = So(E.gridSize.rawVal, ve());
  U.visible = E.gridVisible.rawVal, window.__hekatanSnap2D = E.cursorSnap.rawVal;
  const X = () => {
    const P = Math.max(0, Math.min(1, E.gridOpacity.rawVal));
    U.traverse((L) => {
      const Q = L.material;
      if (!Q || !("opacity" in Q)) return;
      const I = L.name ?? "";
      let ue = 0.55;
      I.includes("border") ? ue = 1 : I.includes("major") && (ue = 0.95), Q.opacity = P * ue;
    });
  };
  X(), m.appendChild(ia(E, e, c)), m.setAttribute("id", "viewer"), m.appendChild(z.domElement), z.setPixelRatio(window.devicePixelRatio);
  const K = ln();
  z.setClearColor(K.background, 1);
  const T = E.gridSize.rawVal, V = T * 0.5 + T * 0.5 / Math.tan(45 * 0.5);
  g.position.set(0, 0, V), g.up.set(0, 1, 0), M.target.set(0, 0, 0), M.minDistance = 0.1, M.maxDistance = 1e4, m.__settings = E, M.zoomSpeed = 1, M._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, M.update();
  let Z = rs(E.gridSize.rawVal, E.flipAxes.rawVal);
  p.add(U, Z), W.derive(() => {
    window.__hekatanGridPlaneXY = E.gridXY.val, window.__hekatanGridPlaneXZ = E.gridXZ.val, window.__hekatanGridPlaneYZ = E.gridYZ.val;
  });
  let N = true;
  W.derive(() => {
    const P = E.gridVisible.val;
    if (N) {
      N = false;
      return;
    }
    U.visible = P, J();
  });
  let $ = true;
  W.derive(() => {
    if (E.gridOpacity.val, $) {
      $ = false;
      return;
    }
    X(), J();
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
    p.remove(U), (_a2 = U.traverse) == null ? void 0 : _a2.call(U, (ue) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ue.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ue.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), U = So(P, ve()), U.visible = E.gridVisible.rawVal, p.add(U), X(), p.remove(Z), Z.traverse((ue) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ue.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ue.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Z = rs(P, L), p.add(Z);
    const Q = P * 0.5 + P * 0.5 / Math.tan(45 * 0.5);
    g.position.distanceTo(M.target), Math.abs(g.position.x) < 0.1 && Math.abs(g.position.y) < 0.1 && g.position.z > 0 ? g.position.set(0, 0, Q) : g.position.set(0.5 * P, -Q, 0.5 * P), M.target.set(0, 0, 0), M.minDistance = Math.max(0.05, P * 0.01), M.maxDistance = Math.max(50, P * 50), M.update(), J();
  }), new ResizeObserver((P) => {
    var _a2, _b;
    for (const L of P) {
      const Q = (_a2 = L.target) == null ? void 0 : _a2.clientWidth, I = (_b = L.target) == null ? void 0 : _b.clientHeight;
      if (Q === 0 || I === 0) continue;
      const xe = (re ? Q / 2 : Q) / I;
      g.aspect = xe, g.updateProjectionMatrix();
      const be = y.top;
      if (y.left = -be * xe, y.right = be * xe, y.updateProjectionMatrix(), se && se.isPerspectiveCamera) se.aspect = xe, se.updateProjectionMatrix();
      else if (se && se.isOrthographicCamera) {
        const Pe = se, Te = Pe.top;
        Pe.left = -Te * xe, Pe.right = Te * xe, Pe.updateProjectionMatrix();
      }
      z.setSize(Q, I), J();
    }
  }).observe(m), M.addEventListener("change", J), W.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e2 = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e2.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, E.displayScale.val, E.nodes.val, E.elements.val, (_g = E.edges) == null ? void 0 : _g.val, E.elemColumns.val, E.elemBeams.val, E.nodesIndexes.val, E.elementsIndexes.val, E.orientations.val, E.sections.val, E.secColumns.val, E.secBeams.val, E.secFloor.val, E.supports.val, E.loads.val, E.deformedShape.val, E.nodeResults.val, E.frameResults.val, E.shellResults.val, (_h = E.solidResults) == null ? void 0 : _h.val, (_i = E.extruded) == null ? void 0 : _i.val, setTimeout(J);
  });
  let re = false, se = null, D = null, fe = false;
  function J() {
    const P = m.clientWidth || 1, L = m.clientHeight || 1;
    if (!re || !se) {
      z.setScissorTest(false), z.setViewport(0, 0, P, L), z.render(p, k);
      return;
    }
    const Q = P / 2;
    z.setScissorTest(true), z.setViewport(0, 0, Q, L), z.setScissor(0, 0, Q, L), z.render(p, k), z.setViewport(Q, 0, Q, L), z.setScissor(Q, 0, Q, L), z.render(p, se), z.setScissorTest(false);
  }
  function we(P) {
    k = P, M.object = P, M.update(), J();
  }
  function ye(P, L) {
    re = P, L && (se = L);
    const Q = m.clientWidth || 1, I = m.clientHeight || 1, xe = (P ? Q / 2 : Q) / I;
    g.isPerspectiveCamera && (g.aspect = xe, g.updateProjectionMatrix());
    const be = y.top;
    if (y.left = -be * xe, y.right = be * xe, y.updateProjectionMatrix(), P && se) {
      if (D ? (D.object = se, D.update()) : (D = new is(se, z.domElement), D.enableDamping = true, D.dampingFactor = 0.1, D.screenSpacePanning = true, D.zoomSpeed = 0.8, D.panSpeed = 1.2, D.rotateSpeed = 0.9, D.touches = { ONE: qn.ROTATE, TWO: qn.DOLLY_PAN }, D.target.copy(M.target), D.addEventListener("change", J), D.enabled = false), !fe) {
        const Pe = (Te) => {
          if (!re || !D) return;
          const Re = z.domElement.getBoundingClientRect(), Xe = Te.clientX - Re.left, De = Re.width / 2, Ne = Xe >= De;
          M.enabled = !Ne, D.enabled = Ne;
        };
        z.domElement.addEventListener("pointerdown", Pe, true), z.domElement.addEventListener("wheel", Pe, { capture: true, passive: true }), fe = true;
      }
    } else P || (M.enabled = true, D && (D.enabled = false));
    m.__splitMode = P, window.__hekatanSplitMode = P, window.__hekatanSplitCamera = P ? se : null, J();
  }
  if (e) {
    p.add(ra(E, ee, ie), na(e, E, ee), pa(E, ee, ie), ua(e, E, ee, ie), ca(e, E, ee, ie), da(e, E, ee, ie), ma(e, E, ee, ie), ya(e, E, ee, ie), Ma(e, E, ee), ka(e, E, ee, ie), ba(e, E, ee, ie));
    const P = Ya({ scene: p, rendererElm: z.domElement, getActiveCamera: () => k, derivedNodes: ee, derivedDisplayScale: ie, mesh: e, settings: E, render: J });
    p.add(P);
    const L = Ja(e, E), Q = za(e, E, ee, L), I = ps(L);
    p.add(Q), m.appendChild(I);
    const ue = Ta(e, E, ee);
    p.add(ue);
    const xe = ue.__colorMapValues, be = ps(xe);
    be.id = "frame-legend", m.appendChild(be), W.derive(() => {
      var _a2;
      const Pe = E.shellResults.val != "none", Te = (((_a2 = E.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Re = Pe || Te, Xe = E.frameResults.val.startsWith("contour:"), De = L.val.some((Ne) => Number.isFinite(Ne));
      I.hidden = !Re || !De, Q.visible = Re, be.hidden = !Xe;
    });
  }
  if (c) {
    const P = new ws(16777215, 0.5);
    p.add(P);
    const L = new Jn(16777215, 0.5);
    L.position.set(30, 25, -10), L.shadow.mapSize.width = 1024, L.shadow.mapSize.height = 1024, p.add(L);
    const Q = 10;
    L.shadow.camera.left = -Q, L.shadow.camera.right = Q, L.shadow.camera.top = Q, L.shadow.camera.bottom = -Q, L.shadow.camera.far = 1e3;
    const I = new Jn(16777215, 0.5);
    I.color.setHSL(11, 43, 96), I.position.set(-10, 0, 30), p.add(I), W.derive(() => {
      (c == null ? void 0 : c.val.length) && (p.remove(...c.oldVal), p.add(...c.rawVal), J());
    }), W.derive(() => {
      c.rawVal.forEach((ue) => ue.visible = E.solids.val), J();
    });
  }
  if (h) {
    const P = [], L = (I) => {
      var _a2;
      return ((_a2 = I == null ? void 0 : I.userData) == null ? void 0 : _a2.isCota) ? E.showCotas.val : E.custom3D.val;
    }, Q = () => {
      for (const I of P) I.visible = L(I);
      J();
    };
    W.derive(() => {
      const I = h.val;
      P.length && (p.remove(...P), P.length = 0), I.length && (p.add(...I), P.push(...I), Q()), J();
    }), W.derive(() => {
      E.custom3D.val, Q();
    }), W.derive(() => {
      E.showCotas.val, Q();
    });
  }
  d && Pa({ drawingObj: d, gridObj: U, scene: p, getActiveCamera: () => k, controls: M, gridSize: T, derivedDisplayScale: ie, rendererElm: z.domElement, viewerRender: J }), hs((P, L) => {
    var _a2;
    z.setClearColor(L.background, 1), p.remove(U), (_a2 = U.traverse) == null ? void 0 : _a2.call(U, (Q) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Q.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Q.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), U = So(E.gridSize.rawVal, { planes: Se() }), p.add(U), m.style.setProperty("--awatif-legend-color", L.legendMarker), J();
  });
  const Le = { scene: p, perspCamera: g, orthoCamera: y, get camera() {
    return k;
  }, controls: M, renderer: z, rendererElm: z.domElement, render: J, setActiveCamera: we, setSplitMode: ye, get splitMode() {
    return re;
  }, get splitCamera() {
    return se;
  }, settings: E };
  m.__ctx = Le;
  const ke = document.createElement("div");
  ke.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Ye = (P, L, Q) => {
    const I = document.createElement("button");
    return I.textContent = P, I.title = L, I.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), I.onmouseenter = () => {
      I.style.background = "rgba(70,70,70,0.9)";
    }, I.onmouseleave = () => {
      I.style.background = "rgba(40,40,40,0.85)";
    }, I.onclick = (ue) => {
      ue.preventDefault(), Q();
    }, I;
  }, Qe = (P, L) => {
    const Q = M.target, I = new b().subVectors(k.position, Q), ue = I.length(), xe = new b(), be = new b();
    xe.crossVectors(k.up, I).normalize(), be.copy(k.up).normalize();
    const Pe = ue * 0.05;
    Q.addScaledVector(xe, -P * Pe), Q.addScaledVector(be, L * Pe), k.position.addScaledVector(xe, -P * Pe), k.position.addScaledVector(be, L * Pe), M.update(), J();
  }, mt = (P) => {
    const L = new b().subVectors(k.position, M.target);
    L.multiplyScalar(P), k.position.copy(M.target).add(L), M.update(), J();
  }, Ft = () => {
    const P = document.createElement("div");
    return P.style.cssText = "width:32px;height:32px;", P;
  };
  return ke.append(Ft()), ke.append(Ye("\u2191", "Pan arriba", () => Qe(0, 1))), ke.append(Ye("\u2295", "Zoom in", () => mt(0.85))), ke.append(Ye("\u2190", "Pan izquierda", () => Qe(-1, 0))), ke.append(Ye("\u2302", "Reset vista", () => {
    M.reset(), J();
  })), ke.append(Ye("\u2192", "Pan derecha", () => Qe(1, 0))), ke.append(Ye("\u2296", "Zoom out", () => mt(1.18))), ke.append(Ye("\u2193", "Pan abajo", () => Qe(0, -1))), ke.append(Ft()), getComputedStyle(m).position === "static" && (m.style.position = "relative"), m.appendChild(ke), m;
}
function qa(e, l) {
  return W.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const d = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || d.length === 0) return d;
    const c = l.deformScale.val, m = l.deformScale.val * l.deformScaleZ.val, p = Number.isFinite(c) ? c : 1, g = Number.isFinite(m) ? m : 1;
    return d.map((y, k) => {
      var _a3;
      const z = ((_a3 = h.get(k)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], M = Number.isFinite(z[0]) ? z[0] : 0, H = Number.isFinite(z[1]) ? z[1] : 0, le = Number.isFinite(z[2]) ? z[2] : 0;
      return [y[0] + M * p, y[1] + H * p, y[2] + le * g];
    });
  });
}
const Fn = W.state(null), Co = W.state(""), Ka = W.state("kN"), Ga = W.state("mm"), Ha = W.state("kN/m\xB2"), Wa = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, fs = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Oa = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Ja(e, l) {
  const d = W.state([]);
  let h;
  return ((c) => {
    c.bendingXX = "bendingXX", c.bendingYY = "bendingYY", c.bendingXY = "bendingXY", c.membraneXX = "membraneXX", c.membraneYY = "membraneYY", c.membraneXY = "membraneXY", c.tranverseShearX = "tranverseShearX", c.tranverseShearY = "tranverseShearY", c.membranePrincipalMax = "membranePrincipalMax", c.membranePrincipalMin = "membranePrincipalMin", c.bendingPrincipalMax = "bendingPrincipalMax", c.bendingPrincipalMin = "bendingPrincipalMin", c.transverseShearMax = "transverseShearMax", c.vonMises = "vonMises", c.pressure = "pressure", c.displacementX = "displacementX", c.displacementY = "displacementY", c.displacementZ = "displacementZ";
  })(h || (h = {})), W.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const c = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), pe = (L, Q) => {
      L == null ? void 0 : L.forEach((I, ue) => {
        const xe = e.elements.val[ue];
        if (xe) for (let be = 0; be < xe.length; be++) Q.set(xe[be], [I[be] ?? I[0]]);
      });
    };
    pe((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), pe((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, m), pe((_f = (_e2 = e.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, p), pe((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, g), pe((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, y), pe((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, k), pe((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, z), pe((_p = (_o2 = e.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, M), pe((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, H), pe((_t = (_s = e.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t.pressure, le);
    const ae = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), ve = (L, Q, I, ue, xe) => {
      L.forEach((be, Pe) => {
        var _a3, _b2;
        const Te = be[0] ?? 0, Re = ((_a3 = Q.get(Pe)) == null ? void 0 : _a3[0]) ?? 0, Xe = ((_b2 = I.get(Pe)) == null ? void 0 : _b2[0]) ?? 0, De = (Te + Re) / 2, Ne = Math.hypot((Te - Re) / 2, Xe);
        ue.set(Pe, [De + Ne]), xe.set(Pe, [De - Ne]);
      });
    };
    ve(g, y, k, ae, E), ve(c, m, p, ie, ee), z.forEach((L, Q) => {
      var _a3;
      Se.set(Q, [Math.hypot(L[0] ?? 0, ((_a3 = M.get(Q)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const U = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, X = (_w = l.solidResults) == null ? void 0 : _w.val, T = X && X !== "none" ? X : l.shellResults.val, V = U == null ? void 0 : U[T], Z = { bendingXX: [c, 0], bendingYY: [m, 0], bendingXY: [p, 0], membraneXX: [g, 0], membraneYY: [y, 0], membraneXY: [k, 0], tranverseShearX: [z, 0], tranverseShearY: [M, 0], membranePrincipalMax: [ae, 0], membranePrincipalMin: [E, 0], bendingPrincipalMax: [ie, 0], bendingPrincipalMin: [ee, 0], transverseShearMax: [Se, 0], vonMises: [H, 0], pressure: [le, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, N = l.shellResults.val, $ = Ka.val, ne = Ga.val, he = N === "displacementX" || N === "displacementY" || N === "displacementZ", re = N === "bendingXX" || N === "bendingYY" || N === "bendingXY" || N === "bendingPrincipalMax" || N === "bendingPrincipalMin", se = N === "membraneXX" || N === "membraneYY" || N === "membraneXY" || N === "membranePrincipalMax" || N === "membranePrincipalMin", D = N === "vonMises" || N === "pressure", fe = N === "tranverseShearX" || N === "tranverseShearY" || N === "transverseShearMax", J = (_D = l.solidResults) == null ? void 0 : _D.val, we = J === "vonMises" || J === "sigmaXX" || J === "sigmaYY" || J === "sigmaZZ" || J === "tauXY" || J === "tauYZ" || J === "tauXZ", ye = J === "ux" || J === "uy" || J === "uz", Le = Ha.val, ke = we ? Oa[Le] : ye || he ? fs[ne] : re || se || D || fe ? 1 / Wa[$] : 1, Ye = we ? Le : ye || he ? ne : re ? `${$}\xB7m/m` : se ? `${$}/m\xB2` : D ? `${$}/m\xB2` : fe ? `${$}/m` : "";
    Co.val = Ye, Fn.val = Array.isArray(V) && V.length === 2 ? [V[0] * ke, V[1] * ke] : null;
    const Qe = vs.val, Ft = J && J !== "none" ? [H, 0] : Z[N], P = [];
    if (e.nodes.val.forEach((L, Q) => {
      const I = Ft;
      if (!I || !I[0] || typeof I[0].has != "function") return;
      if (!I[0].has(Q)) {
        P.push(Number.NaN);
        return;
      }
      const ue = I[0].get(Q), xe = ue ? ue[I[1]] ?? 0 : 0;
      P.push(xe * ke);
    }), !Fn.val && Qe !== "auto") {
      const L = e.nodes.val, Q = /* @__PURE__ */ new Set(), I = (xe, be) => {
        var _a3;
        const Pe = (_a3 = L[xe[0]]) == null ? void 0 : _a3[be];
        return xe.every((Te) => {
          var _a4;
          return Math.abs((((_a4 = L[Te]) == null ? void 0 : _a4[be]) ?? NaN) - Pe) < 1e-6;
        });
      };
      for (const xe of e.elements.val) {
        if (xe.length !== 4) continue;
        const be = I(xe, 2), Pe = !be && I(xe, 0), Te = !be && I(xe, 1);
        if (Qe === "losas" ? be : Qe === "muros" ? Pe || Te : Qe === "murosX" ? Pe : Qe === "murosY" ? Te : false) for (const De of xe) Q.add(De);
      }
      const ue = [];
      for (const xe of Q) {
        const be = P[xe];
        Number.isFinite(be) && ue.push(be);
      }
      ue.length && (Fn.val = Fo(ue));
    }
    d.val = P;
  }), d;
}
export {
  aa as a,
  ps as b,
  Ka as c,
  Ga as d,
  Ha as e,
  ni as g
};
