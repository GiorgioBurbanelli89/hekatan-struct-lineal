import { N as Zt, a6 as Bn, q as Es, v as G, a7 as Vs, D as kt, M as et, B as Me, F as vt, a8 as Ts, x as pt, a9 as $s, aa as Ls, h as qo, ab as Ko, r as an, ac as Un, ad as Zn, a4 as is, _ as je, a as ct, L as Kt, w as ls, b as Is, ae as Rs, f as it, V as b, $ as sn, af as ho, H as bo, d as _t, c as mo, Y as rs, Z as Kn, G as Bs, z as Pn, A as Ds, ag as qn, t as Xs, o as Ns, I as en, a2 as Sn, E as Go, S as xn, m as Dn, ah as kn, g as Ho, i as Wo, j as Jo, C as Oo, K as Ys, U as Us, W as Zs, X as qs, T as Xn, P as wo, O as Ks } from "./theme-Dxpmbnyd.js";
import { T as St, O as Qo } from "./Text-DxjkL_3A.js";
import { P as cs } from "./tweakpane-BXg6ZhiP.js";
import { e as Gs } from "./styles-Ce_UnsFA.js";
class ds {
  constructor(l, p = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, p);
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
  setColorMap(l, p = 32) {
    this.map = yo[l] || yo.rainbow, this.n = p;
    const h = 1 / this.n, c = new Zt(), m = new Zt();
    this.lut.length = 0, this.lut.push(new Zt(this.map[0][1]));
    for (let f = 1; f < p; f++) {
      const g = f * h;
      for (let y = 0; y < this.map.length - 1; y++) if (g > this.map[y][0] && g <= this.map[y + 1][0]) {
        const S = this.map[y][0], A = this.map[y + 1][0];
        c.setHex(this.map[y][1], Bn), m.setHex(this.map[y + 1][1], Bn);
        const M = new Zt().lerpColors(c, m, (g - S) / (A - S));
        this.lut.push(M);
      }
    }
    return this.lut.push(new Zt(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Es.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const p = Math.round(l * this.n);
    return this.lut[p];
  }
  addColorMap(l, p) {
    return yo[l] = p, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const p = l.getContext("2d", { alpha: false }), h = p.getImageData(0, 0, 1, this.n), c = h.data;
    let m = 0;
    const f = 1 / this.n, g = new Zt(), y = new Zt(), S = new Zt();
    for (let A = 1; A >= 0; A -= f) for (let M = this.map.length - 1; M >= 0; M--) if (A < this.map[M][0] && A >= this.map[M - 1][0]) {
      const K = this.map[M - 1][0], ie = this.map[M][0];
      g.setHex(this.map[M - 1][1], Bn), y.setHex(this.map[M][1], Bn), S.lerpColors(g, y, (A - K) / (ie - K)), c[m * 4] = Math.round(S.r * 255), c[m * 4 + 1] = Math.round(S.g * 255), c[m * 4 + 2] = Math.round(S.b * 255), c[m * 4 + 3] = 255, m += 1;
    }
    return p.putImageData(h, 0, 0), l;
  }
}
const yo = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ps = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Hs = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ps, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Gn = G.state("safe"), us = G.state("auto");
function fs(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Hs[Gn.val] ?? ps;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, m, f, g] = l[h], [y, S, A, M] = l[h + 1];
    if (e <= y) {
      const K = (e - c) / (y - c);
      return [m + (S - m) * K, f + (A - f) * K, g + (M - g) * K];
    }
  }
  const p = l[l.length - 1];
  return [p[1], p[2], p[3]];
}
function jo() {
  const l = new Uint8Array(1024);
  for (let h = 0; h < 256; h++) {
    const c = h / 255, [m, f, g] = fs(c);
    l[h * 4 + 0] = m, l[h * 4 + 1] = f, l[h * 4 + 2] = g, l[h * 4 + 3] = 255;
  }
  const p = new $s(l, 256, 1, Ls);
  return p.minFilter = qo, p.magFilter = qo, p.wrapS = Ko, p.wrapT = Ko, p.needsUpdate = true, p;
}
function Ws() {
  const l = [];
  for (let p = 0; p <= 12; p++) {
    const h = 1 - p / 12, [c, m, f] = fs(h);
    l.push(`rgb(${c | 0},${m | 0},${f | 0}) ${(p / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function _o(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((m, f) => m - f), p = (m) => l[Math.min(l.length - 1, Math.max(0, Math.round(m * (l.length - 1))))];
  let h = l.length >= 20 ? p(0.01) : l[0], c = l.length >= 20 ? p(0.99) : l[l.length - 1];
  return h >= 0 && c > 0 && (h = 0), c <= 0 && h < 0 && (c = 0), [h, c];
}
function Js(e, l, p) {
  new ds();
  const h = jo(), c = new Vs({ uniforms: { cmap: { value: h }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: kt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  G.derive(() => {
    var _a2;
    Gn.val;
    const f = c.uniforms.cmap.value;
    c.uniforms.cmap.value = jo(), (_a2 = f == null ? void 0 : f.dispose) == null ? void 0 : _a2.call(f);
  });
  const m = new et(new Me(), c);
  return m.renderOrder = -1, m.frustumCulled = false, m.userData.isShellArea = true, m.name = "__hekatan_shell_colormap", G.derive(() => {
    m.geometry.setAttribute("position", new vt(e.val.flat(), 3));
    const f = [], g = [], y = [];
    l.val.forEach((Q, be) => {
      Q.length === 3 ? (f.push(Q[0], Q[1], Q[2]), g.push(be), y.push(0)) : Q.length === 4 && (f.push(Q[0], Q[1], Q[2]), f.push(Q[0], Q[2], Q[3]), g.push(be, be), y.push(0, 1));
    }), m.geometry.setIndex(new Ts(f, 1)), m.userData.faceToElem = g, m.userData.faceLocal = y;
    const S = p.val.filter((Q) => Number.isFinite(Q));
    let A, M;
    const K = zn.val;
    if (K ? (M = K[0], A = K[1]) : [M, A] = _o(S), A === M) {
      const Q = Math.max(Math.abs(A) * 1e-6, 1e-9);
      A += Q, M -= Q;
    }
    const ie = K && K[0] > K[1], ce = Math.min(M, A), se = Math.max(M, A), V = se - ce, ae = new Float32Array(p.val.length);
    for (let Q = 0; Q < p.val.length; Q++) {
      const be = p.val[Q];
      if (!Number.isFinite(be)) {
        ae[Q] = -1;
        continue;
      }
      const N = ((ie ? se + ce - be : be) - ce) / V;
      ae[Q] = Math.max(0, Math.min(1, N));
    }
    m.geometry.setAttribute("scalar", new pt(ae, 1));
  }), m;
}
function Os(e, l, p) {
  const h = document.createElement("div"), c = new cs({ title: "Settings", expanded: true, container: h });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(c), h.setAttribute("id", "settings");
  const m = "hk_settingsPos";
  let f = null;
  try {
    const M = localStorage.getItem(m);
    M && (f = JSON.parse(M));
  } catch {
  }
  h.style.cssText = ["position:fixed", f ? `left:${f.left}px` : "left:8px", f ? `top:${f.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const g = () => {
    const M = h.querySelector(".tp-rotv_b");
    if (!M) {
      setTimeout(g, 200);
      return;
    }
    M.style.cursor = "move", M.style.userSelect = "none";
    let K = false, ie = 0, ce = 0, se = 0, V = 0;
    M.addEventListener("mousedown", (ae) => {
      K = true, ie = ae.clientX, ce = ae.clientY;
      const Q = h.getBoundingClientRect();
      se = Q.left, V = Q.top, h.style.left = `${se}px`, h.style.top = `${V}px`;
    }), window.addEventListener("mousemove", (ae) => {
      if (!K) return;
      const Q = ae.clientX - ie, be = ae.clientY - ce, ye = Math.max(0, Math.min(window.innerWidth - 40, se + Q)), N = Math.max(0, Math.min(window.innerHeight - 40, V + be));
      h.style.left = `${ye}px`, h.style.top = `${N}px`;
    }), window.addEventListener("mouseup", () => {
      if (K) {
        K = false;
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
    const K = M.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    K.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), K.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), K.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), K.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), K.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ie = c.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ie.addBinding(e.nodes, "val", { label: "Nodes" }), ie.addBinding(e.elements, "val", { label: "Elements" }), ie.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ie.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ie.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ie.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ie.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ie.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ie.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ie.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ie.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ie.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ie.addBinding(e.orientations, "val", { label: "Orientations" }), ie.addBinding(e.sections, "val", { label: "Sections" }), ie.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ie.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ie.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ie.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ie.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const M = c.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    M.addBinding(e.supports, "val", { label: "Supports" }), M.addBinding(e.loads, "val", { label: "Loads" }), M.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), M.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const M = c.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = M, M.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), M.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), M.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), M.addBinding(Gn, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), M.addBinding(us, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), M.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), M.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), M.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), M.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  p && c.addBinding(e.solids, "val", { label: "Solids" });
  const y = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), S = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), A = () => {
    const M = window.__hekatanClipApply;
    typeof M == "function" && M();
  };
  return y.addBinding(S, "enableX", { label: "Cortar X" }).on("change", A), y.addBinding(S, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", A), y.addBinding(S, "invertX", { label: "  invertir X" }).on("change", A), y.addBinding(S, "enableY", { label: "Cortar Y" }).on("change", A), y.addBinding(S, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", A), y.addBinding(S, "invertY", { label: "  invertir Y" }).on("change", A), y.addBinding(S, "enableZ", { label: "Cortar Z" }).on("change", A), y.addBinding(S, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", A), y.addBinding(S, "invertZ", { label: "  invertir Z" }).on("change", A), h;
}
function Qs(e) {
  return { gridSize: G.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: G.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: G.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: G.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: G.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: G.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: G.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: G.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: G.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: G.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: G.state((e == null ? void 0 : e.nodes) ?? true), elements: G.state((e == null ? void 0 : e.elements) ?? true), edges: G.state((e == null ? void 0 : e.edges) ?? true), faces: G.state((e == null ? void 0 : e.faces) ?? true), elemColumns: G.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: G.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: G.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: G.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: G.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: G.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: G.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: G.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: G.state((e == null ? void 0 : e.orientations) ?? false), sections: G.state((e == null ? void 0 : e.sections) ?? true), extruded: G.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: G.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: G.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: G.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: G.state((e == null ? void 0 : e.secFloor) ?? -1), supports: G.state((e == null ? void 0 : e.supports) ?? true), loads: G.state((e == null ? void 0 : e.loads) ?? false), deformedShape: G.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: G.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: G.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: G.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: G.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: G.state((e == null ? void 0 : e.flipAxes) ?? false), solids: G.state((e == null ? void 0 : e.solids) ?? true), custom3D: G.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: G.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: G.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: G.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function js(e, l, p) {
  const h = an(), c = new Un(new Me(), new Zn({ color: h.nodePoint }));
  return is((m, f) => {
    c.material.color.setHex(f.nodePoint);
  }), c.frustumCulled = false, G.derive(() => {
    e.nodes.val && c.geometry.setAttribute("position", new vt(l.val.flat(), 3));
  }), G.derive(() => {
    if (p.val, l.val, !e.nodes.rawVal) return;
    const m = l.rawVal ?? [];
    let f = e.gridSize.val * 0.5;
    if (m.length >= 2) {
      const y = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
      for (const A of m) for (let M = 0; M < 3; M++) y[M] = Math.min(y[M], A[M]), S[M] = Math.max(S[M], A[M]);
      f = Math.max(S[0] - y[0], S[1] - y[1], S[2] - y[2], 0.1);
    }
    const g = 0.03 * f;
    c.material.size = g * p.rawVal;
  }), G.derive(() => {
    c.visible = e.nodes.val;
  }), c;
}
function xo(e, l) {
  const p = an(), h = new je();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let m = (l == null ? void 0 : l.majorStep) ?? 1, f = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (m <= 0 && (m = 1), f <= 0 && (f = 0.1); e / f > 500; ) f *= 2;
  for (; e / m > 100; ) m *= 2;
  const g = e / 2;
  m = Math.max(f, Math.round(m / f) * f);
  const S = new Zt(p.grid).multiplyScalar(1.3), A = new Zt(p.grid).multiplyScalar(0.8), M = (se, V, ae, Q) => {
    const be = [], ye = se === "xy" ? (T, Y) => [T, Y, 0] : se === "xz" ? (T, Y) => [T, 0, Y] : (T, Y) => [0, T, Y], N = Math.floor(g / V);
    for (let T = -N; T <= N; T++) {
      const Y = T * V, D = ye(Y, -g), L = ye(Y, g);
      be.push(...D, ...L);
    }
    for (let T = -N; T <= N; T++) {
      const Y = T * V, D = ye(-g, Y), L = ye(g, Y);
      be.push(...D, ...L);
    }
    const B = new Me();
    B.setAttribute("position", new vt(be, 3));
    const Z = new ct({ color: ae, transparent: true, opacity: Q, depthWrite: false }), $ = new Kt(B, Z);
    return $.name = `grid-${se}-${V === f ? "minor" : "major"}`, $;
  }, K = (se, V, ae) => {
    const Q = se === "xy" ? ($, T) => [$, T, 0] : se === "xz" ? ($, T) => [$, 0, T] : ($, T) => [0, $, T], be = [[-g, -g], [g, -g], [g, g], [-g, g]], ye = [];
    for (const [$, T] of be) ye.push(...Q($, T));
    const N = new Me();
    N.setAttribute("position", new vt(ye, 3));
    const B = new ct({ color: V, transparent: true, opacity: ae, depthWrite: false }), Z = new ls(N, B);
    return Z.name = `grid-${se}-border`, Z.renderOrder = 1, Z;
  }, ie = (se, V, ae) => {
    const Q = se === "xy" ? (B, Z) => [B, Z, 0] : se === "xz" ? (B, Z) => [B, 0, Z] : (B, Z) => [0, B, Z], be = V === "u" ? [...Q(-g, 0), ...Q(g, 0)] : [...Q(0, -g), ...Q(0, g)], ye = new Me();
    ye.setAttribute("position", new vt(be, 3));
    const N = new Kt(ye, new ct({ color: ae, transparent: true, opacity: 0.45, depthWrite: false }));
    return N.name = `grid-${se}-eje-${V}`, N.renderOrder = 1, N;
  }, ce = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of c) {
    h.add(M(se, f, A, 0.12)), h.add(M(se, m, S, 0.4));
    const [V, ae] = ce[se];
    h.add(ie(se, "u", V)), h.add(ie(se, "v", ae)), h.add(K(se, S, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: m, minorStep: f, gridSize: e, planes: [...c] }, h;
}
function ea(e, l, p, h) {
  const c = new je(), m = new Is(0.5, 0.5, 0.5), f = new Rs(0.45, 0.7, 4);
  f.rotateX(Math.PI / 2), f.translate(0, 0, -0.35);
  const g = new it({ color: 10166822 }), y = new it({ color: 2792847 }), S = new it({ color: 3835647 }), A = () => {
    const ie = p.rawVal ?? [];
    if (ie.length < 2) return l.gridSize.val * 0.5;
    let ce = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const V of ie) for (let ae = 0; ae < 3; ae++) V[ae] < ce[ae] && (ce[ae] = V[ae]), V[ae] > se[ae] && (se[ae] = V[ae]);
    return Math.max(se[0] - ce[0], se[1] - ce[1], se[2] - ce[2], 0.1);
  }, M = () => 0.08 * A(), K = () => h.rawVal;
  return G.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const ie = M();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((ce, se) => {
      const V = p.val[se];
      if (!V) return;
      const ae = ce ?? [], Q = (ae[0] ? 1 : 0) + (ae[1] ? 1 : 0) + (ae[2] ? 1 : 0), be = (ae[3] ? 1 : 0) + (ae[4] ? 1 : 0) + (ae[5] ? 1 : 0);
      let ye;
      Q >= 3 && be >= 3 ? ye = new et(m, g) : Q >= 3 && be === 0 ? ye = new et(f, y) : ye = new et(f, S), ye.position.set(V[0], V[1], V[2]);
      const N = ie * K();
      ye.scale.set(N, N, N), c.add(ye);
    });
  }), G.derive(() => {
    if (h.val, !l.supports.rawVal) return;
    const ce = M() * K();
    c.children.forEach((se) => se.scale.set(ce, ce, ce));
  }), G.derive(() => {
    c.visible = l.supports.val;
  }), c;
}
function ta(e, l, p, h) {
  const c = new je();
  c.name = "loadsGroup";
  function m(f) {
    if (f.length < 2) return 0.12 * l.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], y = [-1 / 0, -1 / 0, -1 / 0];
    for (const A of f) for (let M = 0; M < 3; M++) g[M] = Math.min(g[M], A[M]), y[M] = Math.max(y[M], A[M]);
    return 0.08 * Math.max(y[0] - g[0], y[1] - g[1], y[2] - g[2], 0.1);
  }
  return G.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((M) => M.dispose()), c.clear();
    const f = p.val, g = m(f), y = 240, S = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((M, K) => {
      f[K] && M.slice(0, 3).some((ie) => Math.abs(ie) > 1e-15) && S.push(K);
    });
    let A = S;
    if (S.length > y) {
      const M = S.map(($) => f[$][0]), K = S.map(($) => f[$][1]), ie = Math.min(...M), ce = Math.max(...M), se = Math.min(...K), V = Math.max(...K), ae = S.map(($) => f[$][2]), Q = Math.max(1e-6, (Math.max(...ae) - Math.min(...ae)) / 40), be = ($) => Math.round($ / Q), ye = new Set(ae.map(be)), N = Math.max(4, Math.floor(y / Math.max(1, ye.size))), B = Math.max(2, Math.round(Math.sqrt(N))), Z = /* @__PURE__ */ new Map();
      for (const $ of S) {
        const T = ce - ie < 1e-9 ? 0 : (f[$][0] - ie) / (ce - ie), Y = V - se < 1e-9 ? 0 : (f[$][1] - se) / (V - se), D = Math.min(B - 1, Math.floor(T * B)), L = Math.min(B - 1, Math.floor(Y * B)), te = `${D},${L},${be(f[$][2])}`, ue = Math.hypot(T * B - (D + 0.5), Y * B - (L + 0.5)), re = Z.get(te);
        (!re || ue < re.d) && Z.set(te, { i: $, d: ue });
      }
      A = [...Z.values()].map(($) => $.i);
    }
    for (const M of A) {
      const K = e.nodeInputs.val.loads.get(M), ie = f[M];
      if (!ie) continue;
      const ce = new b(...K.slice(0, 3));
      if (ce.lengthSq() < 1e-30) continue;
      ce.normalize();
      const se = new sn(ce, new b(...ie), 1, 15637248, 0.3, 0.3), V = g * h.rawVal;
      se.scale.set(V, V, V), c.add(se);
    }
  }), G.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const g = m(p.rawVal) * h.rawVal;
    c.children.forEach((y) => y.scale.set(g, g, g));
  }), G.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function na(e, l, p) {
  const h = new je();
  return G.derive(() => {
    if (!e.nodesIndexes.val) return;
    h.children.forEach((m) => m.dispose()), h.clear();
    const c = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((m, f) => {
      const g = new St(`${f}`);
      g.position.set(...m), g.updateScale(c * p.rawVal), h.add(g);
    });
  }), G.derive(() => {
    if (p.val, !e.nodesIndexes.rawVal) return;
    const c = 0.05 * e.gridSize.val * 0.6;
    h.children.forEach((m) => m.updateScale(c * p.rawVal));
  }), G.derive(() => {
    h.visible = e.nodesIndexes.val;
  }), h;
}
function oa(e, l, p, h) {
  const c = new je();
  return G.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    c.children.forEach((f) => f.dispose()), c.clear();
    const m = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((f, g) => {
      const y = new St(`${g}`, void 0, "#001219");
      y.position.set(...sa(f.map((S) => p.rawVal[S]))), y.updateScale(m * h.rawVal), c.add(y);
    });
  }), G.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const m = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((f) => f.updateScale(m * h.rawVal));
  }), G.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function sa(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function es(e, l) {
  const p = new je(), h = Math.min(0.05 * e, 0.6), c = an(), m = new St("X", "red", "transparent"), f = new St(l ? "Z" : "Y", "green", "transparent"), g = new St(l ? "Y" : "Z", "blue", "transparent"), y = new sn(new b(1, 0, 0), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), S = new sn(new b(0, 1, 0), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), A = new sn(new b(0, 0, 1), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return m.position.set(1.3 * h, 0, 0), f.position.set(0, 1.3 * h, 0), g.position.set(0, 0, 1.3 * h), m.updateScale(0.4 * h), f.updateScale(0.4 * h), g.updateScale(0.4 * h), y.scale.set(h, h, h), S.scale.set(h, h, h), A.scale.set(h, h, h), p.add(y, S, A, m, f, g), p;
}
function Hn(e, l) {
  const p = new b(...e), c = new b(...l).clone().sub(p), m = c.length(), f = c.dot(new b(1, 0, 0)) / m, g = c.dot(new b(0, 1, 0)) / m, y = c.dot(new b(0, 0, 1)) / m, S = Math.sqrt(f ** 2 + g ** 2);
  let A = new ho().fromArray([[f, g, y], [-g / S, f / S, 0], [-f * y / S, -g * y / S, S]].flat());
  return y === 1 && (A = new ho().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), y === -1 && (A = new ho().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new bo().setFromMatrix3(A);
}
function vo(e, l) {
  return e == null ? void 0 : e.map((p, h) => (9 * p + l[h]) / 10);
}
function Cn(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function aa(e, l, p) {
  const h = Cn([l, p]), c = Cn([e, p]), m = Cn([e, l]), f = new b(...h).sub(new b(...c)).normalize(), g = new b(...p).sub(new b(...m)).normalize(), y = f.clone().cross(g).normalize(), S = y.clone().cross(f).normalize();
  return new bo().makeBasis(f, S, y);
}
function ia(e, l, p, h) {
  const c = new je(), m = new Me(), f = new ct({ vertexColors: true }), g = [0, 0, 0], y = [1, 0, 0], S = [0, 1, 0], A = [0, 0, 1];
  m.setAttribute("position", new vt([...g, ...y, ...g, ...S, ...g, ...A], 3));
  const M = [255, 0, 0], K = [0, 255, 0], ie = [0, 0, 255];
  return m.setAttribute("color", new vt([...M, ...M, ...K, ...K, ...ie, ...ie], 3)), G.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((ce) => {
      const se = new Kt(m, f), V = p.rawVal[ce[0]], ae = p.rawVal[ce[1]];
      if (ce.length === 2 && (se.position.set(...vo(V, ae)), se.rotation.setFromRotationMatrix(Hn(V, ae))), ce.length === 3) {
        const ye = p.rawVal[ce[2]];
        se.position.set(...Cn([V, ae, ye])), se.rotation.setFromRotationMatrix(aa(V, ae, ye));
      }
      const be = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      se.scale.set(be, be, be), c.add(se);
    }));
  }), G.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((V) => V.scale.set(se, se, se));
  }), G.derive(() => {
    c.visible = l.orientations.val;
  }), c;
}
function la(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), p = (e.h * 100).toFixed(0);
    return `${l}x${p}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ra(e, l, p, h) {
  const c = new je(), m = new je();
  c.add(m);
  function f(B, Z) {
    const $ = B / 2, T = Z / 2, Y = new Float32Array([0, -$, -T, 0, $, -T, 0, $, T, 0, -$, -T, 0, $, T, 0, -$, T]), D = new Me();
    D.setAttribute("position", new pt(Y, 3));
    const L = new Float32Array([0, -$, -T, 0, $, -T, 0, $, T, 0, -$, T, 0, -$, -T]), te = new Me();
    return te.setAttribute("position", new pt(L, 3)), { fill: D, outline: te };
  }
  function g(B, Z = 24) {
    const $ = B / 2, T = new Float32Array(Z * 9);
    for (let te = 0; te < Z; te++) {
      const ue = te / Z * Math.PI * 2, re = (te + 1) / Z * Math.PI * 2;
      T[te * 9] = 0, T[te * 9 + 1] = 0, T[te * 9 + 2] = 0, T[te * 9 + 3] = 0, T[te * 9 + 4] = $ * Math.cos(ue), T[te * 9 + 5] = $ * Math.sin(ue), T[te * 9 + 6] = 0, T[te * 9 + 7] = $ * Math.cos(re), T[te * 9 + 8] = $ * Math.sin(re);
    }
    const Y = new Me();
    Y.setAttribute("position", new pt(T, 3));
    const D = new Float32Array((Z + 1) * 3);
    for (let te = 0; te <= Z; te++) {
      const ue = te / Z * Math.PI * 2;
      D[te * 3] = 0, D[te * 3 + 1] = $ * Math.cos(ue), D[te * 3 + 2] = $ * Math.sin(ue);
    }
    const L = new Me();
    return L.setAttribute("position", new pt(D, 3)), { fill: Y, outline: L };
  }
  function y(B, Z, $, T) {
    const Y = $ ?? Z * 0.08, D = T ?? B * 0.07, L = B / 2, te = Z / 2, ue = te - Y, re = D / 2, oe = [];
    function R(he, $e, _e, De) {
      oe.push(0, he, $e, 0, _e, $e, 0, _e, De, 0, he, $e, 0, _e, De, 0, he, De);
    }
    R(-L, -te, L, -ue), R(-re, -ue, re, ue), R(-L, ue, L, te);
    const pe = new Me();
    pe.setAttribute("position", new pt(new Float32Array(oe), 3));
    const W = new Float32Array([0, -L, -te, 0, L, -te, 0, L, -ue, 0, re, -ue, 0, re, ue, 0, L, ue, 0, L, te, 0, -L, te, 0, -L, ue, 0, -re, ue, 0, -re, -ue, 0, -L, -ue, 0, -L, -te]), fe = new Me();
    return fe.setAttribute("position", new pt(W, 3)), { fill: pe, outline: fe };
  }
  function S(B, Z, $) {
    const T = B / 2, Y = Z / 2, D = T - $, L = Y - $, te = [];
    function ue(pe, W, fe, he) {
      te.push(0, pe, W, 0, fe, W, 0, fe, he, 0, pe, W, 0, fe, he, 0, pe, he);
    }
    ue(-T, -Y, T, -L), ue(-T, L, T, Y), ue(-T, -L, -D, L), ue(D, -L, T, L);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(te), 3));
    const oe = new Float32Array([0, -T, -Y, 0, T, -Y, 0, T, -Y, 0, T, Y, 0, T, Y, 0, -T, Y, 0, -T, Y, 0, -T, -Y, 0, -D, -L, 0, D, -L, 0, D, -L, 0, D, L, 0, D, L, 0, -D, L, 0, -D, L, 0, -D, -L]), R = new Me();
    return R.setAttribute("position", new pt(oe, 3)), { fill: re, outline: R };
  }
  function A(B, Z, $) {
    const T = B / 2, Y = Z / 2, D = T - $, L = Y - $, te = new Me(), ue = new Float32Array([0, -D, -L, 0, D, -L, 0, D, L, 0, -D, -L, 0, D, L, 0, -D, L]);
    te.setAttribute("position", new pt(ue, 3));
    const re = [];
    function oe(fe, he, $e, _e) {
      re.push(0, fe, he, 0, $e, he, 0, $e, _e, 0, fe, he, 0, $e, _e, 0, fe, _e);
    }
    oe(-T, -Y, T, -L), oe(-T, L, T, Y), oe(-T, -L, -D, L), oe(D, -L, T, L);
    const R = new Me();
    R.setAttribute("position", new pt(new Float32Array(re), 3));
    const pe = new Float32Array([0, -T, -Y, 0, T, -Y, 0, T, -Y, 0, T, Y, 0, T, Y, 0, -T, Y, 0, -T, Y, 0, -T, -Y, 0, -D, -L, 0, D, -L, 0, D, -L, 0, D, L, 0, D, L, 0, -D, L, 0, -D, L, 0, -D, -L]), W = new Me();
    return W.setAttribute("position", new pt(pe, 3)), { concFill: te, steelFillGeom: R, outline: W };
  }
  function M(B, Z, $) {
    const T = [], Y = [[0, -B / 2, -Z / 2], [0, -B / 2 + $, -Z / 2], [0, -B / 2 + $, Z / 2 - $], [0, B / 2, Z / 2 - $], [0, B / 2, Z / 2], [0, -B / 2, Z / 2]], D = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const re of D) T.push(...Y[re]);
    const L = new Me();
    L.setAttribute("position", new pt(new Float32Array(T), 3));
    const te = [];
    for (let re = 0; re < Y.length; re++) {
      const oe = (re + 1) % Y.length;
      te.push(...Y[re], ...Y[oe]);
    }
    const ue = new Me();
    return ue.setAttribute("position", new pt(new Float32Array(te), 3)), { fill: L, outline: ue };
  }
  function K(B, Z, $, T) {
    const Y = T / 2, D = [], L = [[0, -B - Y, -Z / 2], [0, -$ - Y, -Z / 2], [0, -$ - Y, Z / 2 - $], [0, -Y, Z / 2 - $], [0, -Y, Z / 2], [0, -B - Y, Z / 2]], te = [[0, Y, -Z / 2], [0, Y + $, -Z / 2], [0, Y + $, Z / 2 - $], [0, B + Y, Z / 2 - $], [0, B + Y, Z / 2], [0, Y, Z / 2]], ue = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of ue) D.push(...L[pe]);
    for (const pe of ue) D.push(...te[pe]);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(D), 3));
    const oe = [];
    for (const pe of [L, te]) for (let W = 0; W < pe.length; W++) {
      const fe = (W + 1) % pe.length;
      oe.push(...pe[W], ...pe[fe]);
    }
    const R = new Me();
    return R.setAttribute("position", new pt(new Float32Array(oe), 3)), { fill: re, outline: R };
  }
  function ie(B, Z, $, T) {
    const Y = Z / 2, D = B, L = [[0, -D, -Y], [0, -D, -Y + $], [0, -T, -Y + $], [0, -T, Y - $], [0, -D, Y - $], [0, -D, Y], [0, 0, Y], [0, 0, -Y]], te = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], ue = [];
    for (const pe of te) ue.push(...L[pe]);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(ue), 3));
    const oe = [];
    for (let pe = 0; pe < L.length; pe++) {
      const W = (pe + 1) % L.length;
      oe.push(...L[pe], ...L[W]);
    }
    const R = new Me();
    return R.setAttribute("position", new pt(new Float32Array(oe), 3)), { fill: re, outline: R };
  }
  function ce(B, Z, $, T, Y) {
    const D = Z / 2, L = Y / 2, te = [], ue = [[0, -B, -D], [0, -B, -D + $], [0, -L - T, -D + $], [0, -L - T, D - $], [0, -B, D - $], [0, -B, D], [0, -L, D], [0, -L, -D]], re = ue.map((fe) => [fe[0], -fe[1], fe[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const fe of oe) te.push(...ue[fe]);
    for (const fe of oe) te.push(...re[fe]);
    const R = new Me();
    R.setAttribute("position", new pt(new Float32Array(te), 3));
    const pe = [];
    for (const fe of [ue, re]) for (let he = 0; he < fe.length; he++) {
      const $e = (he + 1) % fe.length;
      pe.push(...fe[he], ...fe[$e]);
    }
    const W = new Me();
    return W.setAttribute("position", new pt(new Float32Array(pe), 3)), { fill: R, outline: W };
  }
  function se(B, Z, $, T) {
    const Y = B / 2, D = Z / 2, L = T / 2, te = [[0, -L, -D], [0, L, -D], [0, L, D - $], [0, Y, D - $], [0, Y, D], [0, -Y, D], [0, -Y, D - $], [0, -L, D - $]], ue = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], re = [];
    for (const W of ue) re.push(...te[W]);
    const oe = new Me();
    oe.setAttribute("position", new pt(new Float32Array(re), 3));
    const R = [];
    for (let W = 0; W < te.length; W++) {
      const fe = (W + 1) % te.length;
      R.push(...te[W], ...te[fe]);
    }
    const pe = new Me();
    return pe.setAttribute("position", new pt(new Float32Array(R), 3)), { fill: oe, outline: pe };
  }
  function V(B, Z, $ = 24) {
    const T = B / 2, Y = T - Z, D = [];
    for (let re = 0; re < $; re++) {
      const oe = re / $ * Math.PI * 2, R = (re + 1) / $ * Math.PI * 2, pe = Math.cos(oe), W = Math.sin(oe), fe = Math.cos(R), he = Math.sin(R);
      D.push(0, T * pe, T * W, 0, T * fe, T * he, 0, Y * fe, Y * he), D.push(0, T * pe, T * W, 0, Y * fe, Y * he, 0, Y * pe, Y * W);
    }
    const L = new Me();
    L.setAttribute("position", new pt(new Float32Array(D), 3));
    const te = [];
    for (let re = 0; re < $; re++) {
      const oe = re / $ * Math.PI * 2, R = (re + 1) / $ * Math.PI * 2;
      te.push(0, T * Math.cos(oe), T * Math.sin(oe), 0, T * Math.cos(R), T * Math.sin(R)), te.push(0, Y * Math.cos(oe), Y * Math.sin(oe), 0, Y * Math.cos(R), Y * Math.sin(R));
    }
    const ue = new Me();
    return ue.setAttribute("position", new pt(new Float32Array(te), 3)), { fill: L, outline: ue };
  }
  const ae = new it({ color: 52479, transparent: true, opacity: 0.35, side: kt, depthWrite: false }), Q = new ct({ color: 52479 }), be = new it({ color: 16750848, transparent: true, opacity: 0.4, side: kt, depthWrite: false }), ye = new ct({ color: 16750848 });
  function N(B, Z) {
    const $ = Math.abs(Z[0] - B[0]), T = Math.abs(Z[1] - B[1]), Y = Math.abs(Z[2] - B[2]);
    return Y > $ && Y > T || T > $ && T > Y;
  }
  return G.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const B = l.secColumns.rawVal, Z = l.secBeams.rawVal;
    if (!B && !Z) {
      c.children.forEach((L) => {
        L instanceof St && L.dispose();
      }), c.clear();
      return;
    }
    c.children.forEach((L) => {
      L instanceof St && L.dispose();
    }), c.clear();
    const $ = (_a2 = e.elements) == null ? void 0 : _a2.val, T = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!$ || !T) return;
    const Y = T.sectionShapes, D = l.secFloor.rawVal;
    $.forEach((L, te) => {
      if (L.length !== 2) return;
      const ue = p.rawVal[L[0]], re = p.rawVal[L[1]];
      if (!ue || !re) return;
      const oe = N(ue, re);
      if (oe && !B || !oe && !Z) return;
      if (D >= 0) {
        const he = Math.min(ue[1], re[1]);
        Math.max(ue[1], re[1]);
        const $e = l.gridSize.rawVal || 3;
        if (Math.floor(he / $e + 0.01) !== D) return;
      }
      const R = Y == null ? void 0 : Y.get(te);
      if (!R) return;
      const pe = [(ue[0] + re[0]) / 2, (ue[1] + re[1]) / 2, (ue[2] + re[2]) / 2], W = Hn(ue, re);
      if (R.type === "CFT") {
        const he = A(R.b, R.h, R.tw ?? R.b * 0.05), $e = new et(he.concFill, ae);
        $e.position.set(...pe), $e.rotation.setFromRotationMatrix(W), c.add($e);
        const _e = new et(he.steelFillGeom, be);
        _e.position.set(...pe), _e.rotation.setFromRotationMatrix(W), c.add(_e);
        const De = new _t(he.outline, ye);
        De.position.set(...pe), De.rotation.setFromRotationMatrix(W), c.add(De);
      } else {
        let he, $e, _e;
        switch (R.type) {
          case "rect":
            he = f(R.b, R.h), $e = ae, _e = Q;
            break;
          case "circ":
            he = g(R.d), $e = ae, _e = Q;
            break;
          case "I":
            he = y(R.b, R.h, R.tf, R.tw), $e = be, _e = ye;
            break;
          case "HSS":
            he = S(R.b, R.h, R.tw ?? R.b * 0.05), $e = be, _e = ye;
            break;
          case "CFT":
            he = A(R.b, R.h, R.tw ?? R.b * 0.05), $e = be, _e = ye;
            break;
          case "L":
            he = M(R.b ?? R.h, R.h, R.t ?? R.tw ?? 3e-3), $e = be, _e = ye;
            break;
          case "2L":
            he = K(R.b ?? R.h, R.h, R.t ?? R.tw ?? 3e-3, R.dis ?? 0.01), $e = be, _e = ye;
            break;
          case "C":
          case "coldC":
            he = ie(R.b, R.h, R.tf ?? R.t ?? 3e-3, R.tw ?? R.t ?? 3e-3), $e = be, _e = ye;
            break;
          case "2C":
            he = ce(R.b, R.h, R.tf ?? 5e-3, R.tw ?? 5e-3, R.dis ?? 0.01), $e = be, _e = ye;
            break;
          case "T":
            he = se(R.b, R.h, R.tf ?? 0.01, R.tw ?? 6e-3), $e = be, _e = ye;
            break;
          case "pipe":
            he = V(R.d, R.tw ?? R.d * 0.05), $e = be, _e = ye;
            break;
          default:
            return;
        }
        const De = new et(he.fill, $e);
        De.position.set(...pe), De.rotation.setFromRotationMatrix(W), c.add(De);
        const Oe = new _t(he.outline, _e);
        Oe.position.set(...pe), Oe.rotation.setFromRotationMatrix(W), c.add(Oe);
      }
      const fe = la(R);
      if (fe) {
        const $e = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(R.type) ? "#ff9900" : "#00ccff", _e = new St(fe, $e, "transparent");
        _e.position.set(pe[0], pe[1], pe[2]);
        const De = 0.05 * l.gridSize.rawVal * 0.5;
        _e.updateScale(De * ((h == null ? void 0 : h.rawVal) ?? 1)), m.add(_e);
      }
    });
  }), h && G.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const B = 0.05 * l.gridSize.val * 0.5;
    m.children.forEach((Z) => {
      Z instanceof St && Z.updateScale(B * h.rawVal);
    });
  }), G.derive(() => {
    c.visible = l.sections.val;
  }), G.derive(() => {
    m.visible = l.sectionLabels.val;
  }), c;
}
function ca(e) {
  if (!e) return null;
  const l = e.type, p = (A, M) => [A, M], h = (A, M) => [p(-A / 2, -M / 2), p(A / 2, -M / 2), p(A / 2, M / 2), p(-A / 2, M / 2)], c = (A, M = 24) => {
    const K = A / 2, ie = [];
    for (let ce = 0; ce < M; ce++) {
      const se = 2 * Math.PI * ce / M;
      ie.push(p(K * Math.cos(se), K * Math.sin(se)));
    }
    return ie;
  }, m = e.b ?? 0, f = e.h ?? 0, g = e.d ?? 0, y = e.tw ?? e.t ?? 0, S = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return m && f ? { contorno: h(m, f) } : null;
    case "circ":
      return g ? { contorno: c(g) } : null;
    case "pipe":
      return g && y ? { contorno: c(g), huecos: [c(g - 2 * y).reverse()] } : null;
    case "HSS":
      return m && f && y ? { contorno: h(m, f), huecos: [h(m - 2 * y, f - 2 * (S || y)).reverse()] } : null;
    case "CFT":
      return m && f ? { contorno: h(m, f) } : null;
    case "I":
      return m && f && y && S ? { contorno: [p(-m / 2, -f / 2), p(m / 2, -f / 2), p(m / 2, -f / 2 + S), p(y / 2, -f / 2 + S), p(y / 2, f / 2 - S), p(m / 2, f / 2 - S), p(m / 2, f / 2), p(-m / 2, f / 2), p(-m / 2, f / 2 - S), p(-y / 2, f / 2 - S), p(-y / 2, -f / 2 + S), p(-m / 2, -f / 2 + S)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return m && f && y && S ? { contorno: [p(-m / 2, -f / 2), p(m / 2, -f / 2), p(m / 2, -f / 2 + S), p(-m / 2 + y, -f / 2 + S), p(-m / 2 + y, f / 2 - S), p(m / 2, f / 2 - S), p(m / 2, f / 2), p(-m / 2, f / 2)] } : null;
    case "T":
      return m && f && y && S ? { contorno: [p(-y / 2, -f / 2), p(y / 2, -f / 2), p(y / 2, f / 2 - S), p(m / 2, f / 2 - S), p(m / 2, f / 2), p(-m / 2, f / 2), p(-m / 2, f / 2 - S), p(-y / 2, f / 2 - S)] } : null;
    case "L":
    case "2L":
      return m && f && y ? { contorno: [p(-m / 2, -f / 2), p(m / 2, -f / 2), p(m / 2, -f / 2 + y), p(-m / 2 + y, -f / 2 + y), p(-m / 2 + y, f / 2), p(-m / 2, f / 2)] } : null;
    default:
      return m && f ? { contorno: h(m, f) } : g ? { contorno: c(g) } : null;
  }
}
function da(e, l, p) {
  if (!e || e <= 0 || !l || !p || l <= 0 || p <= 0) return null;
  const h = Math.sqrt(Math.sqrt(p / l)), c = Math.sqrt(e / h), m = e / c;
  return !isFinite(c) || !isFinite(m) || c <= 0 || m <= 0 ? null : { contorno: [[-c / 2, -m / 2], [c / 2, -m / 2], [c / 2, m / 2], [-c / 2, m / 2]] };
}
function pa(e) {
  const l = new Pn();
  e.contorno.forEach(([p, h], c) => c ? l.lineTo(p, h) : l.moveTo(p, h)), l.closePath();
  for (const p of e.huecos ?? []) {
    const h = new Ds();
    p.forEach(([c, m], f) => f ? h.lineTo(c, m) : h.moveTo(c, m)), h.closePath(), l.holes.push(h);
  }
  return l;
}
function ua(e, l, p) {
  const h = new je();
  h.name = "extrusion";
  const c = new mo({ color: 8369151, transparent: true, opacity: 0.92, side: kt }), m = new mo({ color: 12623968, transparent: true, opacity: 0.85, side: kt }), f = new mo({ color: 11583173, transparent: true, opacity: 0.85, side: kt }), g = new je();
  g.add(new rs(16777215, 0.55));
  const y = new Kn(16777215, 0.75);
  y.position.set(30, 25, 40);
  const S = new Kn(16777215, 0.35);
  S.position.set(-25, -20, 15), g.add(y, S);
  let A = 0;
  return G.derive(() => {
    var _a2, _b, _c, _d, _e;
    const M = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++A, on: M }, h.visible = M;
    for (const Q of [...h.children]) Q !== g && (h.remove(Q), (_c = (_b = Q.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(g) || h.add(g), !M) return;
    const K = p.val ?? [], ie = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], ce = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = ce.sectionShapes ?? /* @__PURE__ */ new Map(), V = ce.thicknesses ?? /* @__PURE__ */ new Map();
    let ae = "";
    try {
      ie.forEach((Q, be) => {
        var _a3, _b2, _c2;
        if (Q.length === 2) {
          let ye = ca(se.get(be)), N = true;
          if (ye || (ye = da((_a3 = ce.areas) == null ? void 0 : _a3.get(be), (_b2 = ce.momentsOfInertiaY) == null ? void 0 : _b2.get(be), (_c2 = ce.momentsOfInertiaZ) == null ? void 0 : _c2.get(be)), N = false), !ye) return;
          const B = K[Q[0]], Z = K[Q[1]];
          if (!B || !Z) return;
          const $ = Math.hypot(Z[0] - B[0], Z[1] - B[1], Z[2] - B[2]);
          if ($ < 1e-9) return;
          const T = new Bs(pa(ye), { depth: $, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new bo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const Y = new et(T, N ? c : m);
          Y.position.set(B[0], B[1], B[2]), Y.rotation.setFromRotationMatrix(Hn(B, Z)), h.add(Y);
          return;
        }
        if (Q.length === 3 || Q.length === 4) {
          const ye = V.get(be);
          if (!ye || ye <= 0) return;
          const N = Q.map((W) => K[W]).filter(Boolean);
          if (N.length < 3) return;
          const B = [N[1][0] - N[0][0], N[1][1] - N[0][1], N[1][2] - N[0][2]], Z = [N[2][0] - N[0][0], N[2][1] - N[0][1], N[2][2] - N[0][2]], $ = B[1] * Z[2] - B[2] * Z[1], T = B[2] * Z[0] - B[0] * Z[2], Y = B[0] * Z[1] - B[1] * Z[0], D = Math.hypot($, T, Y);
          if (D < 1e-12) return;
          const L = [$ / D, T / D, Y / D], te = [], ue = (W) => N.map((fe) => [fe[0] + L[0] * W, fe[1] + L[1] * W, fe[2] + L[2] * W]), re = ue(+ye / 2), oe = ue(-ye / 2), R = (W, fe, he) => te.push(...W, ...fe, ...he);
          for (const W of [re, oe]) R(W[0], W[1], W[2]), W.length === 4 && R(W[0], W[2], W[3]);
          for (let W = 0; W < N.length; W++) {
            const fe = (W + 1) % N.length;
            R(re[W], oe[W], oe[fe]), R(re[W], oe[fe], re[fe]);
          }
          const pe = new Me();
          pe.setAttribute("position", new vt(te, 3)), pe.computeVertexNormals(), h.add(new et(pe, f));
        }
      });
    } catch (Q) {
      ae = String((Q == null ? void 0 : Q.message) ?? Q);
    }
    globalThis.__extrusionDebug = { corridas: A, on: M, fallo: ae, nElementos: ie.length, nFormas: se.size, nEspesores: V.size, mallas: h.children.length - 1 };
  }), h;
}
class Nn extends je {
  constructor(l, p, h, c, m, f, g) {
    super();
    const y = new Pn().moveTo(0, 0).lineTo(0, f[1]).lineTo(h, f[1]).lineTo(h, 0).lineTo(0, 0), S = y.getPoints(), A = new Me().setFromPoints(S);
    this.lines = new _t(A, new ct({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const M = new qn(y), K = new it({ color: f[1] > 0 ? 24435 : 11411474, side: kt });
    this.mesh = new et(M, K), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new St(`${m[1].toFixed(4)}`), this.normalizedResult = f, this.textPosition = Cn([l, p]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class ts extends je {
  constructor(l, p, h, c, m, f, g) {
    super();
    const y = m[0] * h / (m[0] + m[1]), S = m[0] * m[1] > 0;
    if (this.text = new St(`${m[0].toFixed(4)}`), this.text2 = new St(`${(m[1] * -1).toFixed(4)}`), this.normalizedResult = f, this.textPosition = vo(l, p), this.text2Position = vo(p, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), S) {
      const A = new Pn().moveTo(0, 0).lineTo(0, f[0]).lineTo(y, 0).lineTo(0, 0), M = new Pn().moveTo(y, 0).lineTo(h, -f[1]).lineTo(h, 0).lineTo(y, 0), K = A.getPoints(), ie = M.getPoints(), ce = new Me().setFromPoints(K), se = new Me().setFromPoints(ie), V = new ct({ color: an().resultOutline });
      this.lines = new _t(ce, V), this.lines2 = new _t(se, V), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), g && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ae = new qn(A), Q = new qn(M), be = new it({ color: f[0] > 0 ? 24435 : 11411474, side: kt }), ye = new it({ color: -f[1] > 0 ? 24435 : 11411474, side: kt });
      this.mesh = new et(ae, be), this.mesh2 = new et(Q, ye), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), g && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const A = new Pn().moveTo(0, 0).lineTo(0, f[0]).lineTo(h, -f[1]).lineTo(h, 0).lineTo(0, 0), M = A.getPoints(), K = new Me().setFromPoints(M);
      this.lines = new _t(K, new ct({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ie = new qn(A), ce = new it({ color: f[0] > 0 ? 24435 : 11411474, side: kt });
      this.mesh = new et(ie, ce), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var hs = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(hs || {});
function fa(e, l, p, h) {
  const c = () => {
    const g = p.rawVal;
    if (!(g == null ? void 0 : g.length)) return 0.05 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
    for (const M of g) for (let K = 0; K < 3; K++) M[K] < y[K] && (y[K] = M[K]), M[K] > S[K] && (S[K] = M[K]);
    const A = Math.hypot(S[0] - y[0], S[1] - y[1], S[2] - y[2]);
    return !isFinite(A) || A <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * A;
  }, m = new je(), f = { normals: Nn, shearsY: Nn, shearsZ: Nn, torsions: Nn, bendingsY: ts, bendingsZ: ts };
  return G.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, p.val, l.frameResults.val == "none") return;
    m.children.forEach((y) => y.dispose()), m.clear();
    const g = hs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[g]) == null ? void 0 : _b.forEach((y, S) => {
      var _a3, _b2;
      const A = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[S]) ?? [0, 1], M = p.rawVal[A[0]], K = p.rawVal[A[1]];
      if (!M || !K) return;
      const ie = new b(...K).distanceTo(new b(...M)), ce = ha((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[g]), se = y == null ? void 0 : y.map((Q) => Q / (ce === 0 ? 1 : ce)), V = Hn(M, K), ae = new f[g](M, K, ie, V, y ?? [0, 0], se ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(g));
      ae.updateScale(c() * h.rawVal), m.add(ae);
    });
  }), G.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const g = c();
    m.children.forEach((y) => y.updateScale(g * h.rawVal));
  }), G.derive(() => {
    m.visible = l.frameResults.val != "none";
  }), m;
}
function ha(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((p) => {
    const h = Math.max(...(p ?? [0, 0]).map((c) => Math.abs(c)));
    h > l && (l = h);
  }), l;
}
class ma extends je {
  constructor(l, p, h) {
    super();
    const c = p === So.reactions;
    h[0] && (this.xText1 = new St(`${c ? "Fx" : "Dx"}: ` + h[0].toFixed(4))), h[3] && (this.xText2 = new St(`${c ? "Mx" : "Rx"}: ` + h[3].toFixed(4))), h[1] && (this.yText1 = new St(`${c ? "Fy" : "Dy"}: ` + h[1].toFixed(4))), h[4] && (this.yText2 = new St(`${c ? "My" : "Ry"}: ` + h[4].toFixed(4))), h[2] && (this.zText1 = new St(`${c ? "Fz" : "Dz"}: ` + h[2].toFixed(4))), h[5] && (this.zText2 = new St(`${c ? "Mz" : "Rz"}: ` + h[5].toFixed(4))), (h[0] || h[3]) && (this.xArrow = new sn(new b(1, 0, 0), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[1] || h[4]) && (this.yArrow = new sn(new b(0, 1, 0), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[2] || h[5]) && (this.zArrow = new sn(new b(0, 0, 1), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
var So = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(So || {});
function wa(e, l, p, h) {
  const c = new je();
  return G.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    c.children.forEach((g) => g.dispose()), c.clear();
    const m = So[l.nodeResults.rawVal], f = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[m]) == null ? void 0 : _b.forEach((g, y) => {
      const S = new ma(p.rawVal[y], m, g ?? [0, 0, 0, 0, 0, 0]);
      S.updateScale(f * h.rawVal), c.add(S);
    });
  }), G.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const m = 0.05 * l.gridSize.val;
    c.children.forEach((f) => f.updateScale(m * h.rawVal));
  }), G.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function ya({ drawingObj: e, gridObj: l, scene: p, getActiveCamera: h, controls: c, gridSize: m, derivedDisplayScale: f, rendererElm: g, viewerRender: y }) {
  const S = new Xs(), A = new Ns(), M = (t) => {
    const o = g.getBoundingClientRect(), a = t.clientX - o.left, n = t.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const d = s / 2;
      if (a >= d) return A.x = (a - d) / d * 2 - 1, A.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      A.x = a / d * 2 - 1;
    } else A.x = a / s * 2 - 1;
    return A.y = -(n / i) * 2 + 1, h();
  }, K = new et(new en(1e4, 1e4), new it({ side: kt, transparent: true, opacity: 0, depthWrite: false }));
  K.visible = true, K.frustumCulled = false, p.add(K);
  const ie = (t, o, a) => {
    const n = new et(new en(1e4, 1e4), new it({ side: kt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, a), n.visible = false, n.frustumCulled = false, p.add(n), n;
  }, ce = ie(Math.PI / 2, 0, 0), se = ie(0, Math.PI / 2, 0);
  let V = false;
  const ae = () => {
    if (V) return S.intersectObjects([K], false);
    if (ce.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ce.visible) {
      const a = S.intersectObjects([Ce, Ne, Le], false);
      if (a.length > 0) return a;
    }
    const o = [K];
    return ce.visible && o.push(ce), se.visible && o.push(se), qt.visible && Ht.length > 0 && o.push(...Ht), S.intersectObjects(o, false);
  }, Q = new Un(new Me(), new Zn()), be = new Un(new Me(), new Zn({ color: "gray", sizeAttenuation: false, size: 6 })), ye = new Un(new Me(), new Zn({ color: "orange", sizeAttenuation: false, size: 5 }));
  p.add(ye);
  const N = document.createElement("input");
  N.id = "hk-rubber-label", N.type = "text", N.spellcheck = false, N.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, N.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(N);
  let B = null, Z = null, $ = false;
  const T = new b(), Y = (t, o, a, n, s, i) => {
    const r = n - t, d = s - o, v = i - a, w = Math.hypot(r, d, v);
    if (w < 0.01) {
      N.style.display = "none";
      return;
    }
    B = [t, o, a], Z = [r / w, d / w, v / w], T.set((t + n) / 2, (o + s) / 2, (a + i) / 2), T.project(h());
    const _ = g.getBoundingClientRect(), z = _.left + (T.x * 0.5 + 0.5) * _.width, u = _.top + (-T.y * 0.5 + 0.5) * _.height;
    if (N.style.left = z + "px", N.style.top = u + "px", N.style.display = "block", !$) {
      if (N.value = `${w.toFixed(2)} m`, document.activeElement !== N) {
        const E = document.activeElement;
        E && (E.tagName === "INPUT" || E.tagName === "TEXTAREA") && E !== N || N.focus({ preventScroll: true });
      }
      try {
        N.select();
      } catch {
      }
    }
  }, D = () => {
    N.style.display = "none", B = null, Z = null, $ = false, document.activeElement === N && N.blur();
  }, L = (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      nn = t, ne(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), N.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ve.length === 1) {
      const _ = Ve[0];
      Ve = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, _[0], _[1], _[2], t), ne(`\u2713 C\xEDrculo r=${t} m en (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}).`);
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
      mt = t, ne(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), N.blur();
      return;
    }
    if (!B || !Z || !e.polylines) return;
    let a = Z[0], n = Z[1], s = Z[2];
    Ie === "x" ? (a = Math.sign(a) || 1, n = 0, s = 0) : Ie === "y" ? (a = 0, n = Math.sign(n) || 1, s = 0) : Ie === "z" && (a = 0, n = 0, s = Math.sign(s) || 1);
    const i = B[0] + a * t, r = B[1] + n * t, d = B[2] + s * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, d]];
    const v = e.polylines.rawVal, w = v.length ? v[v.length - 1] : [];
    e.polylines.val = [...v.slice(0, -1), [...w, e.points.rawVal.length - 1]], N.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    y();
  }, te = (t) => {
    let o = t.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const a = o.startsWith("@");
    if (a && (o = o.slice(1)), o.includes("<")) {
      const s = o.split("<").map((i) => parseFloat(i.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [i, r] = s;
        return a ? { kind: "relPolar", L: i, ang: r } : { kind: "absPolar", L: i, ang: r };
      }
      if (s.length === 3 && a) {
        const [i, r, d] = s;
        return { kind: "relSpherical", L: i, az: r, el: d };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((v) => parseFloat(v.trim()));
      if (s.some(isNaN)) return null;
      const [i, r, d = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: r, dz: d } : { kind: "absCart", x: i, y: r, z: d };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, ue = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return B ? [B[0] + t.dx, B[1] + t.dy, B[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!B) return null;
      const o = t.ang * Math.PI / 180;
      return [B[0] + t.L * Math.cos(o), B[1] + t.L * Math.sin(o), B[2]];
    }
    if (t.kind === "relSpherical") {
      if (!B) return null;
      const o = t.az * Math.PI / 180, a = t.el * Math.PI / 180, n = t.L * Math.cos(a);
      return [B[0] + n * Math.cos(o), B[1] + n * Math.sin(o), B[2] + t.L * Math.sin(a)];
    }
    return null;
  }, re = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], B = t, N.blur();
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
    const o = te(t);
    if (!o) return false;
    if (o.kind === "length") return L(o.L), true;
    const a = ue(o);
    if (!a) return false;
    Xo(new b(a[0], a[1], a[2]), null), B = a, N.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, N.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const a = te(N.value);
      if (!a) return;
      if ($ = false, a.kind === "length") L(a.L), ne(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = ue(a);
        if (!n) return;
        re(n);
        const s = a.kind;
        ne(`\u270F ${s} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), $ = false, N.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!$ && N.style.display === "block") try {
          N.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && ($ = true);
  }), window.addEventListener("keydown", (t) => {
    if (!B || !Z || document.activeElement === N) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (N.value = t.key, N.focus(), N.setSelectionRange(1, 1), t.preventDefault());
  });
  const oe = document.createElement("div");
  oe.id = "hk-coord-readout", oe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", oe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(oe);
  const R = document.createElement("div");
  R.id = "hk-coord-fixed", R.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", R.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(R);
  const pe = new _t(new Me().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), new Sn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", p.add(pe), window.__hekatanRubberBand = pe;
  const W = new _t(new Me(), new ct({ color: 2282478, transparent: true, opacity: 0.9 }));
  W.frustumCulled = false, W.visible = false, p.add(W);
  let fe = [];
  const he = new je(), $e = new et(new en(1, 1), new it({ color: 2282478, transparent: true, opacity: 0.08, side: kt, depthWrite: false })), _e = new Kt(new Go(new en(1, 1)), new ct({ color: 2282478, transparent: true, opacity: 0.85 })), De = new Kt(new Me(), new ct({ color: 2282478, transparent: true, opacity: 0.3 })), Oe = (t, o) => {
    const a = [], n = Math.ceil(t / o);
    for (let s = -n; s <= n; s++) {
      const i = s * o;
      a.push(-t, i, 0, t, i, 0), a.push(i, -t, 0, i, t, 0);
    }
    De.geometry.dispose(), De.geometry = new Me(), De.geometry.setAttribute("position", new vt(a, 3));
  };
  he.add($e, _e, De), he.visible = false, he.frustumCulled = false, p.add(he);
  const ut = new je();
  ut.frustumCulled = false, ut.visible = false, p.add(ut);
  const Ft = (t) => {
    const o = new Me().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), a = new Sn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new _t(o, a);
  }, k = Ft(16711680), I = Ft(65280), J = Ft(35071);
  ut.add(k, I, J);
  const X = (t) => {
    const o = new Me().setFromPoints([new b(0, 0, 0), new b(0, 0, 0), new b(0, 0, 0), new b(0, 0, 0)]), a = new ct({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new ls(o, a);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, de = X(3462041), me = X(16724804), xe = X(6333946), ge = new je();
  ge.frustumCulled = false, ge.visible = false, p.add(ge), ge.add(de, me, xe);
  const Xe = (t) => {
    const o = new en(1, 1), a = new it({ color: t, transparent: true, opacity: 0.06, side: kt, depthWrite: false }), n = new et(o, a);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ce = Xe(3462041), Ne = Xe(16724804), Le = Xe(6333946);
  ge.add(Ce, Ne, Le);
  const Ze = (t, o, a, n) => {
    t.scale.set(2 * n, 2 * n, 1), a === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : a === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, lt = document.createElement("div");
  lt.id = "hk-refplane-badge", lt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(lt), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, ge.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      ot(de, i, "xy", r), ot(me, i, "xz", r), ot(xe, i, "yz", r), Ze(Ce, i, "xy", r), Ze(Ne, i, "xz", r), Ze(Le, i, "yz", r), Ce.material.opacity = 0.05, Ne.material.opacity = 0.05, Le.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    y();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !ge.visible) {
      y();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0];
    ot(de, i, "xy", t), ot(me, i, "xz", t), ot(xe, i, "yz", t), Ze(Ce, i, "xy", t), Ze(Ne, i, "xz", t), Ze(Le, i, "yz", t), y();
  };
  const We = (t) => {
    if (Ce.material.opacity = t === "xy" ? 0.09 : 0.025, Ne.material.opacity = t === "xz" ? 0.09 : 0.025, Le.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      lt.style.background = s.bg, lt.style.color = s.text, lt.textContent = `\u25A6 Plano ${t.toUpperCase()}`, lt.style.display = "block";
    } else lt.style.display = "none";
  }, ot = (t, o, a, n) => {
    let s;
    a === "xy" ? s = [new b(o[0] - n, o[1] - n, o[2]), new b(o[0] + n, o[1] - n, o[2]), new b(o[0] + n, o[1] + n, o[2]), new b(o[0] - n, o[1] + n, o[2]), new b(o[0] - n, o[1] - n, o[2])] : a === "xz" ? s = [new b(o[0] - n, o[1], o[2] - n), new b(o[0] + n, o[1], o[2] - n), new b(o[0] + n, o[1], o[2] + n), new b(o[0] - n, o[1], o[2] + n), new b(o[0] - n, o[1], o[2] - n)] : s = [new b(o[0], o[1] - n, o[2] - n), new b(o[0], o[1] + n, o[2] - n), new b(o[0], o[1] + n, o[2] + n), new b(o[0], o[1] - n, o[2] + n), new b(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(s);
  };
  let Ie = null;
  window.__hekatanAxisLock = () => Ie;
  let Jt = null;
  const qe = document.createElement("div");
  qe.id = "hk-axis-lock-badge", qe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(qe);
  const Gt = () => {
    if (!Ie) {
      qe.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    qe.style.background = "rgba(15,23,42,0.92)", qe.style.color = t[Ie], qe.style.border = `1.5px solid ${t[Ie]}`, qe.textContent = `\u{1F512} LOCK ${Ie.toUpperCase()}`, qe.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== N) return;
    const a = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && fe.length >= 3) {
      const s = un();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Ie = Ie === a ? null : a, Gt(), t.preventDefault();
    else if (t.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), Io(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Ln(), ne(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (ut.visible = false), ne(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a2;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const t = window.__hekatanOrthoMode;
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = t ? "block" : "none";
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = t ? "block" : "none";
    }
  };
  const Dt = new b(), Ge = new b(), Ye = new b(), ze = (t) => {
    if (!Ie) return null;
    const o = t[0], a = t[1], n = t[2];
    return Ie === "x" ? (Dt.set(o - 1e4, a, n), Ge.set(o + 1e4, a, n)) : Ie === "y" ? (Dt.set(o, a - 1e4, n), Ge.set(o, a + 1e4, n)) : (Dt.set(o, a, n - 1e4), Ge.set(o, a, n + 1e4)), S.ray.distanceSqToSegment(Dt, Ge, null, Ye), Ye;
  };
  window.__hekatanProjectOnAxis = ze;
  const Ee = new _t(new Me().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), new ct({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Ee.renderOrder = 998, Ee.frustumCulled = false, Ee.visible = false, p.add(Ee);
  let ve = -1, Je = -1, Qe = -1;
  const ke = /* @__PURE__ */ new Set();
  window.__hekatanSelection = ke;
  const Be = new _t(new Me().setFromPoints([new b(), new b()]), new ct({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Be.renderOrder = 997, Be.frustumCulled = false, Be.visible = false, p.add(Be);
  const Ue = new et(new xn(0.02, 12, 12), new it({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Ue.renderOrder = 998, Ue.visible = false, p.add(Ue);
  const yt = (t) => {
    const o = h();
    if (o.isOrthographicCamera) {
      const n = o, s = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(t);
    return Math.max(0.05, a / 10);
  }, Pt = () => {
    Ue.visible && Ue.scale.setScalar(yt(Ue.position));
  }, Ct = new je();
  Ct.frustumCulled = false, p.add(Ct);
  const Yt = 2282478;
  let ht = null;
  const At = (t, o, a, n) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, r = n;
    for (let d = 0; d < s.length; d++) {
      const v = s[d];
      if (!v) continue;
      const w = Math.hypot(t - v[0], o - v[1], a - v[2]);
      w < r && (r = w, i = d);
    }
    return i;
  }, Mt = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; Ct.children.length; ) {
      const r = Ct.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of ke) {
      const [d, ...v] = r.split(":");
      if (d === "pt") {
        const w = t[+v[0]];
        if (!w) continue;
        const _ = new et(new xn(0.025, 12, 12), new it({ color: Yt, transparent: true, opacity: 0.9, depthTest: false }));
        _.position.set(w[0], w[1], w[2]), _.renderOrder = 999, _.__isSelectionPt = true, Ct.add(_);
      } else if (d === "seg") {
        const w = o[+v[0]], _ = t[w == null ? void 0 : w[+v[1]]], z = t[w == null ? void 0 : w[+v[1] + 1]];
        if (!_ || !z) continue;
        const u = new Me().setFromPoints([new b(_[0], _[1], _[2]), new b(z[0], z[1], z[2])]), E = new _t(u, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        E.renderOrder = 999, Ct.add(E);
      } else if (d === "poly") {
        const _ = o[+v[0]].map((E) => {
          const ee = t[E];
          return ee ? new b(ee[0], ee[1], ee[2]) : null;
        }).filter(Boolean);
        if (_.length < 2) continue;
        const z = new Me().setFromPoints(_), u = new _t(z, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        u.renderOrder = 999, Ct.add(u);
      } else if (d === "aux") {
        const w = n[+v[0]];
        if (!w || w.length !== 6) continue;
        const _ = new Me().setFromPoints([new b(w[0], w[1], w[2]), new b(w[3], w[4], w[5])]), z = new _t(_, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        z.renderOrder = 999, Ct.add(z);
      }
    }
    const s = window.__hekatanUpdateSelectionPtScale;
    s && s();
    const i = window.__hekatanRefreshPropsPane;
    i && i();
    try {
      (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
    } catch {
    }
    y();
  };
  window.__hekatanRefreshSelection = Mt, window.__hekatanClearSelection = () => {
    ke.clear(), Mt();
  };
  const Ot = (t, o, a, n, s, i, r, d, v) => {
    const w = r - n, _ = d - s, z = v - i, u = w * w + _ * _ + z * z;
    if (u < 1e-12) return Math.hypot(t - n, o - s, a - i);
    let E = ((t - n) * w + (o - s) * _ + (a - i) * z) / u;
    E = Math.max(0, Math.min(1, E));
    const ee = n + E * w, C = s + E * _, P = i + E * z;
    return Math.hypot(t - ee, o - C, a - P);
  }, ln = (t, o, a, n) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, d = -1, v = n;
    for (let w = 0; w < s.length; w++) {
      const _ = s[w];
      for (let z = 0; z < _.length - 1; z++) {
        const u = i[_[z]], E = i[_[z + 1]];
        if (!u || !E) continue;
        const ee = Ot(t, o, a, u[0], u[1], u[2], E[0], E[1], E[2]);
        ee < v && (v = ee, r = w, d = z);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: d, dist: v } : null;
  }, rn = (t, o, a, n) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let r = -1, d = n;
    for (let v = 0; v < i.length; v++) {
      const w = i[v];
      if (!w || w.length !== 6) continue;
      const _ = Ot(t, o, a, w[0], w[1], w[2], w[3], w[4], w[5]);
      _ < d && (d = _, r = v);
    }
    return r;
  }, cn = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      Ee.visible = false;
      return;
    }
    Ee.geometry.setFromPoints([new b(n[0], n[1], n[2]), new b(n[3], n[4], n[5])]), Ee.visible = true;
  }, Wn = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!a || a.length < 2) {
      Ee.visible = false;
      return;
    }
    const s = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const r of a) {
      const d = n[r];
      d && i.push(new b(d[0], d[1], d[2]));
    }
    else {
      const r = n[a[o]], d = n[a[o + 1]];
      r && i.push(new b(r[0], r[1], r[2])), d && i.push(new b(d[0], d[1], d[2]));
    }
    Ee.geometry.setFromPoints(i), Ee.visible = true;
  }, dn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const a = o.filter((v, w) => w !== t), n = /* @__PURE__ */ new Set();
    for (const v of a) for (const w of v) n.add(w);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let v = 0; v < s.length; v++) n.has(v) && (i.set(v, r.length), r.push(s[v]));
    const d = a.map((v) => v.map((w) => i.get(w)).filter((w) => w !== void 0));
    e.points.val = r, e.polylines.val = d, e.areas && (e.areas.val = e.areas.rawVal.filter((v) => v !== t).map((v) => v > t ? v - 1 : v)), Ee.visible = false, ve = -1, Je = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, Fn = (t, o) => {
    var _a2, _b, _c;
    if (!e.polylines) return;
    const a = e.polylines.rawVal;
    if (t < 0 || t >= a.length) return;
    if (((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false) {
      dn(t);
      return;
    }
    const s = a[t];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      dn(t);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const r = [...a.slice(0, t), ...i, ...a.slice(t + 1)], d = /* @__PURE__ */ new Set();
    for (const u of r) for (const E of u) d.add(E);
    const v = e.points.rawVal, w = /* @__PURE__ */ new Map(), _ = [];
    for (let u = 0; u < v.length; u++) d.has(u) && (w.set(u, _.length), _.push(v[u]));
    const z = r.map((u) => u.map((E) => w.get(E)).filter((E) => E !== void 0));
    if (e.points.val = _, e.polylines.val = z, e.areas) {
      const u = i.length - 1;
      e.areas.val = e.areas.rawVal.map((E) => E > t ? E + u : E);
    }
    Ee.visible = false, ve = -1, Je = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Q.geometry.setAttribute("position", new vt(e.points.rawVal.flat(), 3)), Q.geometry.computeBoundingSphere(), Q.frustumCulled = false, be.frustumCulled = false, p.add(be), K.position.set(0, 0, 0), K.rotateX(Math.PI / 2), K.geometry.rotateX(Math.PI / 2), K.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, a) => {
    if (e.points.val = [...e.points.rawVal, [t, o, a]], e.polylines) {
      const n = e.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
      e.polylines.val = [...n.slice(0, -1), [...s, e.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a2;
    if (!e.polylines) return;
    const t = e.polylines.rawVal;
    ((_a2 = t[t.length - 1]) == null ? void 0 : _a2.length) !== 0 && (e.polylines.val = [...t, []]);
  };
  const pn = [];
  window.__hekatanCirculos = pn;
  let An = [], gn = "";
  const En = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${t.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === gn) return An;
    gn = a;
    const n = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const r = s.slice(0, i - 1).map((_) => t[_]).filter(Boolean);
      if (r.length < 5) continue;
      const d = [0, 1, 2].map((_) => r.reduce((z, u) => z + u[_], 0) / r.length), v = r.map((_) => Math.hypot(_[0] - d[0], _[1] - d[1], _[2] - d[2])), w = v.reduce((_, z) => _ + z, 0) / v.length;
      w < 1e-9 || v.some((_) => Math.abs(_ - w) > 5e-3 * w) || n.push({ c: d, r: w });
    }
    return An = n;
  };
  window.__hekatanCentrosDeducidos = En, window.__hekatanDrawCircle = (t, o, a, n, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(s)), d = e.points.rawVal.length, v = [];
    for (let w = 0; w < r; w++) {
      const _ = 2 * Math.PI * w / r, z = n * Math.cos(_), u = n * Math.sin(_);
      let E;
      i === "xy" ? E = [t + z, o + u, a] : i === "xz" ? E = [t + z, o, a + u] : E = [t, o + z, a + u], v.push(E);
    }
    if (e.points.val = [...e.points.rawVal, ...v], pn.push({ c: [t, o, a], r: n }), e.polylines) {
      const w = [...v.map((z, u) => d + u), d], _ = e.polylines.rawVal;
      ((_a2 = _[_.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [..._, w, []] : e.polylines.val = [..._.slice(0, -1), w, []];
    }
  }, window.__hekatanDrawArc = (t, o, a, n = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(n)), i = new b(...t), r = new b(...o), d = new b(...a), v = new b().subVectors(r, i), w = new b().subVectors(d, i), _ = new b().crossVectors(v, w).normalize(), z = new b().addVectors(i, r).multiplyScalar(0.5), u = new b().addVectors(r, d).multiplyScalar(0.5), E = new b().crossVectors(v, _).normalize(), ee = new b().crossVectors(new b().subVectors(d, r), _).normalize(), C = new b().subVectors(u, z), P = E.x * ee.y - E.y * ee.x;
    let x;
    if (Math.abs(P) > 1e-9) {
      const Se = (C.x * ee.y - C.y * ee.x) / P;
      x = new b().addVectors(z, E.clone().multiplyScalar(Se));
    } else x = z.clone();
    const F = i.distanceTo(x), H = new b().subVectors(i, x), U = new b().subVectors(d, x), le = Math.acos(Math.max(-1, Math.min(1, H.dot(U) / (F * F)))), q = e.points.rawVal.length, O = [], Ae = _.clone();
    for (let Se = 0; Se <= s; Se++) {
      const Fe = Se / s, Re = le * Fe, Ke = new Dn().setFromAxisAngle(Ae, Re), tt = H.clone().applyQuaternion(Ke).add(x);
      O.push([tt.x, tt.y, tt.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...O], pn.push({ c: [x.x, x.y, x.z], r: F }), e.polylines) {
      const Se = O.map((Re, Ke) => q + Ke), Fe = e.polylines.rawVal;
      e.polylines.val = [...Fe.slice(0, -1), Se, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, a = 1, n = 6, s = 6) => {
    const i = Math.min(t[0], o[0]), r = Math.max(t[0], o[0]), d = Math.min(t[1], o[1]), v = Math.max(t[1], o[1]), w = (t[2] + o[2]) / 2, _ = r - i, z = v - d, u = Math.min(a, _ / 2 - 0.01, z / 2 - 0.01);
    if (u <= 0) return;
    const E = e.points.rawVal.length, ee = [], C = [], P = (x, F) => {
      ee.push([x, F, w]), C.push(E + ee.length - 1);
    };
    for (let x = 0; x <= s; x++) P(i + u + (_ - 2 * u) * x / s, d);
    for (let x = 1; x <= n; x++) {
      const F = -Math.PI / 2 + Math.PI / 2 * x / n;
      P(r - u + u * Math.cos(F), d + u + u * Math.sin(F));
    }
    for (let x = 1; x <= s; x++) P(r, d + u + (z - 2 * u) * x / s);
    for (let x = 1; x <= n; x++) {
      const F = 0 + Math.PI / 2 * x / n;
      P(r - u + u * Math.cos(F), v - u + u * Math.sin(F));
    }
    for (let x = 1; x <= s; x++) P(r - u - (_ - 2 * u) * x / s, v);
    for (let x = 1; x <= n; x++) {
      const F = Math.PI / 2 + Math.PI / 2 * x / n;
      P(i + u + u * Math.cos(F), v - u + u * Math.sin(F));
    }
    for (let x = 1; x <= s; x++) P(i, v - u - (z - 2 * u) * x / s);
    for (let x = 1; x <= n; x++) {
      const F = Math.PI + Math.PI / 2 * x / n;
      P(i + u + u * Math.cos(F), d + u + u * Math.sin(F));
    }
    if (C.push(E), e.points.val = [...e.points.rawVal, ...ee], e.polylines) {
      const x = e.polylines.rawVal;
      e.polylines.val = [...x.slice(0, -1), C, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], r = o[0], d = o[1], v = o[2];
    let w;
    if (Math.abs(i - v) < 1e-6 ? w = [[n, s, i], [r, s, i], [r, d, i], [n, d, i]] : Math.abs(s - d) < 1e-6 ? w = [[n, s, i], [r, s, i], [r, s, v], [n, s, v]] : w = [[n, s, i], [n, d, i], [n, d, v], [n, s, v]], e.points.val = [...e.points.rawVal, ...w], e.polylines) {
      const _ = [a, a + 1, a + 2, a + 3, a], z = e.polylines.rawVal;
      e.polylines.val = [...z.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], r = o[0], d = o[1], v = o[2];
    let w;
    if (V && e.gridTarget) {
      const _ = e.gridTarget.rawVal, z = new kn(..._.rotation), u = new b(1, 0, 0).applyEuler(z), E = new b(0, 1, 0).applyEuler(z), ee = new b(..._.position), C = new b(n, s, i), P = new b(r, d, v), x = C.clone().sub(ee).dot(u), F = C.clone().sub(ee).dot(E), H = P.clone().sub(ee).dot(u), U = P.clone().sub(ee).dot(E), le = (q, O) => ee.clone().addScaledVector(u, q).addScaledVector(E, O).toArray();
      w = [le(x, F), le(H, F), le(H, U), le(x, U)];
    } else Math.abs(i - v) < 1e-6 ? w = [[n, s, i], [r, s, i], [r, d, i], [n, d, i]] : Math.abs(s - d) < 1e-6 ? w = [[n, s, i], [r, s, i], [r, s, v], [n, s, v]] : w = [[n, s, i], [n, d, i], [n, d, v], [n, s, v]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...w], e.polylines) {
      const _ = e.polylines.rawVal, z = _.length - 1, u = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [..._.slice(0, -1), u, []], e.areas && (e.areas.val = [...e.areas.rawVal, z]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y();
  }, window.__hekatanMeshPolyArea = (t, o) => {
    var _a2;
    const a = t.length;
    if (a < 3) return 0;
    let n = 0, s = 0, i = 0;
    for (let we = 0; we < a; we++) {
      const Te = t[we], nt = t[(we + 1) % a];
      n += (Te[1] - nt[1]) * (Te[2] + nt[2]), s += (Te[2] - nt[2]) * (Te[0] + nt[0]), i += (Te[0] - nt[0]) * (Te[1] + nt[1]);
    }
    const r = Math.hypot(n, s, i) || 1;
    n /= r, s /= r, i /= r;
    let d = t[1][0] - t[0][0], v = t[1][1] - t[0][1], w = t[1][2] - t[0][2];
    const _ = Math.hypot(d, v, w) || 1;
    d /= _, v /= _, w /= _;
    let z = s * w - i * v, u = i * d - n * w, E = n * v - s * d;
    const ee = Math.hypot(z, u, E) || 1;
    z /= ee, u /= ee, E /= ee;
    const C = t[0], P = (we) => [(we[0] - C[0]) * d + (we[1] - C[1]) * v + (we[2] - C[2]) * w, (we[0] - C[0]) * z + (we[1] - C[1]) * u + (we[2] - C[2]) * E], x = (we, Te) => [C[0] + we * d + Te * z, C[1] + we * v + Te * u, C[2] + we * w + Te * E], F = t.map(P);
    let H = 1 / 0, U = -1 / 0, le = 1 / 0, q = -1 / 0;
    for (const [we, Te] of F) we < H && (H = we), we > U && (U = we), Te < le && (le = Te), Te > q && (q = Te);
    const O = U - H, Ae = q - le;
    if (O < 1e-6 || Ae < 1e-6) return 0;
    let Se = o && o > 0 ? o : 0.5;
    for (; O / Se * (Ae / Se) > 2500; ) Se *= 2;
    Se = Math.min(Se, Math.min(O, Ae));
    const Fe = (we, Te) => {
      let nt = false;
      for (let Vt = 0, $t = F.length - 1; Vt < F.length; $t = Vt++) {
        const [Nt, Wt] = F[Vt], [po, on] = F[$t];
        Wt > Te != on > Te && we < (po - Nt) * (Te - Wt) / (on - Wt) + Nt && (nt = !nt);
      }
      return nt;
    }, Re = Math.max(1, Math.round(O / Se)), Ke = Math.max(1, Math.round(Ae / Se)), tt = O / Re, dt = Ae / Ke, rt = /* @__PURE__ */ new Map(), ft = [], Pe = e.points.rawVal.length, He = (we, Te) => {
      const nt = we + "," + Te, Vt = rt.get(nt);
      if (Vt !== void 0) return Vt;
      const $t = Pe + ft.length;
      return ft.push(x(H + we * tt, le + Te * dt)), rt.set(nt, $t), $t;
    }, at = [];
    for (let we = 0; we < Re; we++) for (let Te = 0; Te < Ke; Te++) {
      if (!Fe(H + (we + 0.5) * tt, le + (Te + 0.5) * dt)) continue;
      const nt = He(we, Te), Vt = He(we + 1, Te), $t = He(we + 1, Te + 1), Nt = He(we, Te + 1);
      at.push([nt, Vt, $t, Nt]);
    }
    if (!at.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...ft], e.polylines && e.areas) {
      let we = e.polylines.rawVal.slice();
      we.length && we[we.length - 1].length === 0 && (we = we.slice(0, -1));
      const Te = [];
      for (const nt of at) Te.push(we.length), we.push([nt[0], nt[1], nt[2], nt[3], nt[0]]);
      we.push([]), e.polylines.val = we, e.areas.val = [...e.areas.rawVal, ...Te];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), at.length;
  };
  const un = () => {
    if (fe.length < 3) return fe = [], W.visible = false, y(), 0;
    const t = window.__hekatanMeshPolyArea(fe.slice());
    return fe = [], W.visible = false, y(), t;
  };
  window.__hekatanFinalizePolyArea = un, window.__hekatanSetInclinedPlaneFrom3 = (t, o, a) => {
    var _a2;
    const n = new b(t[0], t[1], t[2]), s = new b(o[0], o[1], o[2]), i = new b(a[0], a[1], a[2]), r = new b().subVectors(s, n).cross(new b().subVectors(i, n));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const d = new Dn().setFromUnitVectors(new b(0, 0, 1), r), v = new kn().setFromQuaternion(d);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [v.x, v.y, v.z] }), V = true;
    const w = new b().addVectors(n, s).add(i).multiplyScalar(1 / 3), _ = Math.max(n.distanceTo(s), n.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, z = _ / 2;
    $e.geometry.dispose(), $e.geometry = new en(_, _), _e.geometry.dispose(), _e.geometry = new Go(new en(_, _)), Oe(z, 1), he.position.copy(w), he.quaternion.copy(d), he.scale.set(1, 1, 1), he.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), V = false, he.visible = false, y();
  };
  const Lt = new je();
  Lt.visible = false, p.add(Lt), window.__hekatanShowAxes = (t, o, a = 12, n = 2) => {
    var _a2, _b;
    for (; Lt.children.length; ) {
      const _ = Lt.children.pop();
      (_a2 = _.geometry) == null ? void 0 : _a2.dispose(), (_b = _.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const s = Math.min(...o) - n, i = Math.max(...o) + n, r = Math.min(...t) - n, d = Math.max(...t) + n, v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", w = (_, z, u, E, ee) => {
      const C = document.createElement("canvas");
      C.width = 64, C.height = 32;
      const P = C.getContext("2d");
      P.fillStyle = ee, P.font = "bold 22px sans-serif", P.textAlign = "center", P.fillText(_, 32, 26);
      const x = new Ho(C), F = new Wo({ map: x, transparent: true }), H = new Jo(F);
      return H.position.set(z, u, E), H.scale.set(1.2, 0.6, 1), H;
    };
    t.forEach((_, z) => {
      const u = z < v.length ? v[z] : `X${z}`, E = new Me().setFromPoints([new b(_, s, 0), new b(_, i, 0), new b(_, s, 0), new b(_, s, a)]), ee = new Sn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), C = new Kt(E, ee);
      C.computeLineDistances(), Lt.add(C), Lt.add(w(u, _, s - 0.5, 0, "#60a5fa")), Lt.add(w(u, _, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((_, z) => {
      const u = `${z + 1}`, E = new Me().setFromPoints([new b(r, _, 0), new b(d, _, 0), new b(r, _, 0), new b(r, _, a)]), ee = new Sn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), C = new Kt(E, ee);
      C.computeLineDistances(), Lt.add(C), Lt.add(w(u, r - 0.5, _, 0, "#fb7185")), Lt.add(w(u, d + 0.5, _, 0, "#fb7185"));
    }), Lt.visible = true, y();
  }, window.__hekatanHideAxes = () => {
    Lt.visible = false, y();
  };
  const qt = new je();
  qt.visible = false, p.add(qt);
  let Ht = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, a = 0, n = 0) => {
    var _a2, _b;
    for (; qt.children.length; ) {
      const i = qt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    Ht.forEach((i) => {
      p.remove(i), i.geometry.dispose(), i.material.dispose();
    }), Ht = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, r) => {
      const d = s[r % s.length], v = o / 2, w = [new b(a - v, n - v, i), new b(a + v, n - v, i), new b(a + v, n + v, i), new b(a - v, n + v, i), new b(a - v, n - v, i)], _ = new Me().setFromPoints(w), z = new ct({ color: d, transparent: true, opacity: 0.55 });
      qt.add(new _t(_, z));
      const u = document.createElement("canvas");
      u.width = 128, u.height = 32;
      const E = u.getContext("2d");
      E.fillStyle = `#${d.toString(16).padStart(6, "0")}`, E.font = "bold 18px sans-serif", E.fillText(`Z = ${i} m`, 4, 22);
      const ee = new Ho(u), C = new Wo({ map: ee, transparent: true }), P = new Jo(C);
      P.position.set(a - v - 1.5, n - v - 1.5, i), P.scale.set(2.5, 0.6, 1), qt.add(P);
      const x = new en(1e4, 1e4), F = new it({ visible: false, side: kt }), H = new et(x, F);
      H.position.set(0, 0, i), H.frustumCulled = false, H.userData = { refPlaneZ: i }, p.add(H), Ht.push(H);
    }), qt.visible = true, y();
  }, window.__hekatanHideRefPlanes = () => {
    qt.visible = false, Ht.forEach((t) => {
      t.visible = false;
    }), y();
  };
  const Qt = new je();
  Qt.frustumCulled = false, p.add(Qt);
  const ms = () => {
    var _a2, _b, _c, _d;
    for (; Qt.children.length; ) {
      const a = Qt.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const n = new Me().setFromPoints([new b(a[0], a[1], a[2]), new b(a[3], a[4], a[5])]), s = new Sn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new _t(n, s);
      i.computeLineDistances(), Qt.add(i);
    }
  };
  G.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, ms(), y());
  });
  const fn = new je();
  fn.frustumCulled = false, p.add(fn);
  const ko = () => {
    var _a2, _b, _c, _d;
    for (; fn.children.length; ) {
      const a = fn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const n = new et(new xn(0.025, 12, 12), new it({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(a[0], a[1], a[2]), n.renderOrder = 996, n.scale.setScalar(yt(n.position)), fn.add(n);
    }
  };
  G.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, ko(), y());
  }), c.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(yt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = ko;
  const xt = new je(), ws = new et(new xn(0.01, 12, 12), new it({ color: 16724804, transparent: true, opacity: 0.95 })), ys = new et(new xn(0.015, 12, 12), new it({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  xt.add(ws, ys);
  const hn = 0.08, Jn = (t, o, a) => {
    const n = new Me().setFromPoints([new b(...t), new b(...o)]);
    return new _t(n, new ct({ color: a, transparent: true, opacity: 0.7 }));
  };
  xt.add(Jn([-hn, 0, 0], [hn, 0, 0], 16711680)), xt.add(Jn([0, -hn, 0], [0, hn, 0], 65280)), xt.add(Jn([0, 0, -hn], [0, 0, hn], 35071)), xt.visible = false, xt.frustumCulled = false, p.add(xt);
  let On = 2;
  const Vn = (t) => {
    const o = h(), a = (g == null ? void 0 : g.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, vn = () => {
    if (!xt.visible) return;
    const t = On * Vn(xt.position) / 0.015;
    xt.scale.setScalar(Math.max(1e-4, Math.min(1e5, t)));
  };
  let Qn = 10;
  const jn = (t) => Math.max(1e-4, Qn * Vn(t));
  window.__hekatanAperturaPx = (t) => (typeof t == "number" && t > 0 && (Qn = t), Qn), window.__hekatanUpdateSnapScale = vn, window.__hekatanSnapMarker = xt, window.__hekatanMetrosPorPixel = Vn, window.__hekatanSnapPx = (t) => (typeof t == "number" && t > 0 && (On = t, vn(), y()), On);
  const Po = () => {
    Ct.children.length !== 0 && Ct.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(yt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Po, c.addEventListener("change", () => {
    var _a2;
    vn(), Ue.visible && Pt(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Po();
  }), window.__hekatanShowSnap = (t, o, a) => {
    xt.position.set(t, o, a), xt.visible = true, vn(), y();
  }, window.__hekatanHideSnap = () => {
    xt.visible = false, y();
  }, g.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    const a = ae();
    if (a.length) {
      const n = a[0].point, s = t.altKey, i = jn(n), r = s ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i);
      if (r) Ao(r.type, r.x, r.y, r.z), xt.position.set(r.x, r.y, r.z), xt.visible = true, n.set(r.x, r.y, r.z);
      else {
        Ln();
        const z = !s && window.__hekatanSnapEnabled !== false, u = window.__hekatanSnap2D ?? 0.5;
        z && u > 0 && (n.x = Math.round(n.x / u) * u, n.y = Math.round(n.y / u) * u, n.z = Math.round(n.z / u) * u), xt.position.copy(n), xt.visible = true;
      }
      vn();
      const d = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (d === "select" || !d) {
        const z = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = At(n.x, n.y, n.z, z), E = ln(n.x, n.y, n.z, z), ee = rn(n.x, n.y, n.z, z);
        if (u >= 0) {
          const F = e.points.rawVal[u];
          Ue.position.set(F[0], F[1], F[2]), Ue.visible = true, Pt(), Be.visible = false, ht = { kind: "pt", a: u };
        } else if (E) {
          const F = e.points.rawVal, H = e.polylines.rawVal[E.polyIdx], U = F[H[E.segIdx]], le = F[H[E.segIdx + 1]];
          Be.geometry.setFromPoints([new b(U[0], U[1], U[2]), new b(le[0], le[1], le[2])]), Be.visible = true, Ue.visible = false, ht = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(E.polyIdx)) ?? false ? { kind: "poly", a: E.polyIdx } : { kind: "seg", a: E.polyIdx, b: E.segIdx };
        } else if (ee >= 0) {
          const H = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[ee];
          H && (Be.geometry.setFromPoints([new b(H[0], H[1], H[2]), new b(H[3], H[4], H[5])]), Be.visible = true, Ue.visible = false, ht = { kind: "aux", a: ee });
        } else Be.visible = false, Ue.visible = false, ht = null;
        oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
        let C = n;
        if ((ht == null ? void 0 : ht.kind) === "pt") {
          const F = e.points.rawVal[ht.a];
          F && (C = new b(F[0], F[1], F[2]));
        }
        const P = `X=${C.x.toFixed(2)} Y=${C.y.toFixed(2)} Z=${C.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [C.x, C.y, C.z], ht) {
          const F = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          oe.textContent = `${P}  \xB7  \u{1F5B1} Click \u2192 ${F[ht.kind]}`;
        } else oe.textContent = P;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = P), pe.visible = false, ut.visible = false, y();
        return;
      }
      if (d === "delete" || d === "trim" || d === "extend" || d === "offset") {
        const z = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = ln(n.x, n.y, n.z, z), E = rn(n.x, n.y, n.z, z);
        let ee = false;
        if (E >= 0) if (!u) ee = true;
        else {
          const F = window.__hekatanDrawingAuxLines, U = ((F == null ? void 0 : F.rawVal) ?? (F == null ? void 0 : F.val) ?? F ?? [])[E];
          Ot(n.x, n.y, n.z, U[0], U[1], U[2], U[3], U[4], U[5]) < u.dist && (ee = true);
        }
        ee ? (Qe = E, ve = -1, Je = -1, cn(E)) : u ? (ve = u.polyIdx, Je = u.segIdx, Qe = -1, Wn(u.polyIdx, u.segIdx)) : (ve = -1, Je = -1, Qe = -1, Ee.visible = false), pe.visible = false, ut.visible = false, D(), oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
        const C = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let P = "";
        ee ? P = `\u{1F5D1} l\xEDnea aux #${Qe + 1}` : u ? P = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(u.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${u.polyIdx + 1}` : `\u{1F5D1} seg ${u.segIdx + 1} / poly #${u.polyIdx + 1}` : P = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", oe.textContent = `${C}  \xB7  ${P}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = C), y();
        return;
      } else Ee.visible = false, ve = -1, Qe = -1;
      oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
      const v = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], w = v[v.length - 1] ?? [], _ = e.points.rawVal ?? [];
      if (w.length > 0 && _[w[w.length - 1]]) {
        const z = w[w.length - 1], u = _[z];
        let E = Ie;
        if (Jt = null, !E && window.__hekatanAxisSnap !== false) {
          const Re = g.getBoundingClientRect(), Ke = t.clientX, tt = t.clientY, dt = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, rt = new b(u[0], u[1], u[2]), ft = [["x", new b(1, 0, 0)], ["y", new b(0, 1, 0)], ["z", new b(0, 0, 1)]], Pe = (at) => {
            const we = at.clone().project(o);
            return { x: (we.x * 0.5 + 0.5) * Re.width + Re.left, y: (-we.y * 0.5 + 0.5) * Re.height + Re.top };
          };
          let He = null;
          for (const [at, we] of ft) {
            const Te = Pe(rt.clone().addScaledVector(we, -dt)), nt = Pe(rt.clone().addScaledVector(we, dt)), Vt = nt.x - Te.x, $t = nt.y - Te.y, Nt = Ke - Te.x, Wt = tt - Te.y, po = Vt * Vt + $t * $t || 1;
            let on = (Nt * Vt + Wt * $t) / po;
            on = Math.max(0, Math.min(1, on));
            const No = Math.hypot(Ke - (Te.x + on * Vt), tt - (Te.y + on * $t));
            if (He === null || No < He.dpx) {
              const uo = S.ray, Yo = rt.clone().sub(uo.origin), fo = we.dot(uo.direction), Uo = we.dot(Yo), Fs = uo.direction.dot(Yo), Zo = 1 - fo * fo, As = Math.abs(Zo) < 1e-6 ? -Uo : (fo * Fs - Uo) / Zo;
              He = { axis: at, dpx: No, pt: rt.clone().addScaledVector(we, As) };
            }
          }
          He && He.dpx <= 12 && (n.copy(He.pt), E = He.axis, Jt = He.pt.clone());
        }
        const ee = !!window.__hekatanOrthoMode;
        if (!E && ee) {
          const Re = Math.abs(n.x - u[0]), Ke = Math.abs(n.y - u[1]), tt = Math.abs(n.z - u[2]), dt = (_l = a[0]) == null ? void 0 : _l.object;
          let rt = null;
          dt === Ce ? rt = "xy" : dt === Ne ? rt = "xz" : dt === Le && (rt = "yz"), rt === "xy" ? E = Re >= Ke ? "x" : "y" : rt === "xz" ? E = Re >= tt ? "x" : "z" : rt === "yz" ? E = Ke >= tt ? "y" : "z" : E = Re >= Ke && Re >= tt ? "x" : Ke >= tt ? "y" : "z";
        }
        const C = window.__hekatanPolarTrack !== false;
        if (!E && C) {
          const Re = n.x - u[0], Ke = n.y - u[1], tt = n.z - u[2], dt = Math.hypot(Re, Ke, tt);
          if (dt > 1e-3) {
            const ft = Math.tan(6 * Math.PI / 180) * dt, Pe = Math.hypot(Ke, tt), He = Math.hypot(Re, tt), at = Math.hypot(Re, Ke), we = [["x", Pe], ["y", He], ["z", at]];
            we.sort((Te, nt) => Te[1] - nt[1]), we[0][1] <= ft && (E = we[0][0]);
          }
        }
        if (E) {
          const Re = u[0], Ke = u[1], tt = u[2];
          E === "x" ? n.set(n.x, Ke, tt) : E === "y" ? n.set(Re, n.y, tt) : n.set(Re, Ke, n.z);
          const dt = !!Ie, ft = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[E];
          qe.style.background = "rgba(15,23,42,0.92)", qe.style.color = ft, qe.style.border = `1.5px solid ${ft}`;
          const Pe = (_m = a[0]) == null ? void 0 : _m.object;
          let He = null;
          Pe === Ce ? He = "xy" : Pe === Ne ? He = "xz" : Pe === Le && (He = "yz");
          const at = He ? ` (plano ${He.toUpperCase()})` : "";
          qe.textContent = dt ? `\u{1F512} LOCK ${E.toUpperCase()}${at}` : `\u22A5 ORTO ${E.toUpperCase()}${at}`, qe.style.left = t.clientX + 20 + "px", qe.style.top = t.clientY + 18 + "px", qe.style.transform = "none", qe.style.display = "block";
        } else Ie || (qe.style.display = "none");
        const P = Math.hypot(n.x - u[0], n.y - u[1], n.z - u[2]), x = Math.atan2(n.y - u[1], n.x - u[0]) * 180 / Math.PI, F = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        oe.textContent = `${F} | \u0394L=${P.toFixed(2)}m ${x.toFixed(0)}\xB0`;
        const H = document.getElementById("hk-coord-fixed");
        H && (H.textContent = F), pe.geometry.setFromPoints([new b(u[0], u[1], u[2]), new b(n.x, n.y, n.z)]), (_n2 = pe.computeLineDistances) == null ? void 0 : _n2.call(pe), pe.visible = true, Y(u[0], u[1], u[2], n.x, n.y, n.z);
        const U = window.__hekatanOrthoExt ?? 8, le = window.__hekatanShowOrthoPlanes !== false;
        ge.visible = le, le || We(null), le && (ot(de, u, "xy", U), ot(me, u, "xz", U), ot(xe, u, "yz", U), Ze(Ce, u, "xy", U), Ze(Ne, u, "xz", U), Ze(Le, u, "yz", U));
        const q = le ? S.intersectObjects([Ce, Ne, Le], false) : [];
        let O = null;
        if (q.length > 0) {
          const Re = q[0].object;
          Re === Ce ? O = "xy" : Re === Ne ? O = "xz" : Re === Le && (O = "yz");
        }
        We(O), O && (lt.style.left = t.clientX + "px", lt.style.top = t.clientY + "px"), k.geometry.setFromPoints([new b(u[0] - U, u[1], u[2]), new b(u[0] + U, u[1], u[2])]), (_o2 = k.computeLineDistances) == null ? void 0 : _o2.call(k), I.geometry.setFromPoints([new b(u[0], u[1] - U, u[2]), new b(u[0], u[1] + U, u[2])]), (_p = I.computeLineDistances) == null ? void 0 : _p.call(I), J.geometry.setFromPoints([new b(u[0], u[1], u[2] - U), new b(u[0], u[1], u[2] + U)]), (_q = J.computeLineDistances) == null ? void 0 : _q.call(J), ut.visible = true;
        const Ae = k.material, Se = I.material, Fe = J.material;
        E === "x" ? (Ae.opacity = 0.95, Se.opacity = 0.1, Fe.opacity = 0.1) : E === "y" ? (Ae.opacity = 0.1, Se.opacity = 0.95, Fe.opacity = 0.1) : E === "z" ? (Ae.opacity = 0.1, Se.opacity = 0.1, Fe.opacity = 0.95) : (Ae.opacity = 0.5, Se.opacity = 0.5, Fe.opacity = 0.5);
      } else {
        const z = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        oe.textContent = z;
        const u = document.getElementById("hk-coord-fixed");
        if (u && (u.textContent = z), pe.visible = false, ut.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(d)) {
          if (B = null, Z = null, N.style.left = t.clientX + 20 + "px", N.style.top = t.clientY - 28 + "px", N.style.display = "block", !$) {
            N.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const ee = document.activeElement;
            !(ee && (ee.tagName === "INPUT" || ee.tagName === "TEXTAREA") && ee !== N) && document.activeElement !== N && N.focus({ preventScroll: true });
            try {
              N.select();
            } catch {
            }
          }
        } else D();
      }
      y();
    } else Ln(), oe.style.display = "none", xt.visible = false, pe.visible = false, ut.visible = false, D(), y();
  }), G.derive(() => {
    if (!e.gridTarget) return;
    const t = new Dn().setFromEuler(new kn(...e.gridTarget.val.rotation)), o = new Dn().setFromAxisAngle(new b(1, 0, 0), Math.PI / 2);
    xa(l, { position: new b(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, y), K.position.set(...e.gridTarget.val.position), K.quaternion.setFromEuler(new kn(...e.gridTarget.val.rotation)), K.updateMatrixWorld();
    const a = new b(0, 0, 1).applyEuler(new kn(...e.gridTarget.val.rotation));
    V = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  }), G.derive(() => {
    Q.geometry.setAttribute("position", new vt(e.points.val.flat(), 3)), Q.geometry.computeBoundingSphere();
  }), G.derive(() => {
    const t = 0.05 * m * 0.5 * f.val;
    S.params.Points.threshold = 0.4 * t;
  }), G.derive(() => {
    var _a2;
    const t = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of a) {
      const [r, d, v] = t[i];
      n.push(r, d, v);
    }
    const s = new Me();
    s.setAttribute("position", new vt(n, 3)), ye.geometry.dispose(), ye.geometry = s;
  });
  let eo = false, tn = 0;
  g.addEventListener("pointerdown", () => {
    eo = true;
  }), g.addEventListener("pointerup", () => {
    eo = false;
  }), g.addEventListener("pointermove", () => {
    eo && tn++;
  });
  const Et = document.createElement("div");
  Et.id = "hk-window-select", Et.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Et);
  let Ut = null, Mn = false, It = null;
  const to = (t, o, a, n, s) => {
    s ? (Et.style.borderColor = "#34d399", Et.style.borderStyle = "dashed", Et.style.background = "rgba(52, 211, 153, 0.10)") : (Et.style.borderColor = "#22d3ee", Et.style.borderStyle = "solid", Et.style.background = "rgba(34, 211, 238, 0.10)"), Et.style.left = Math.min(t, a) + "px", Et.style.top = Math.min(o, n) + "px", Et.style.width = Math.abs(a - t) + "px", Et.style.height = Math.abs(n - o) + "px", Et.style.display = "block";
  }, Co = (t, o, a, n, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, a), r = Math.max(t, a), d = Math.min(o, n), v = Math.max(o, n), w = a < t, _ = g.getBoundingClientRect(), z = h();
    z.updateMatrixWorld();
    const u = (q) => {
      const O = new b(q[0], q[1], q[2]);
      return O.project(z), { x: _.left + (O.x * 0.5 + 0.5) * _.width, y: _.top + (-O.y * 0.5 + 0.5) * _.height };
    }, E = (q) => q.x >= i && q.x <= r && q.y >= d && q.y <= v, ee = (q, O) => !(q.x < i && O.x < i || q.x > r && O.x > r || q.y < d && O.y < d || q.y > v && O.y > v);
    s || ke.clear();
    let C = 0;
    const P = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let q = 0; q < P.length; q++) {
      const O = P[q];
      O && E(u(O)) && (ke.add(`pt:${q}`), C++);
    }
    const x = (q, O) => w ? E(q) || E(O) || ee(q, O) : E(q) && E(O), F = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], H = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let q = 0; q < F.length; q++) {
      const O = F[q];
      if (H.includes(q)) {
        let Se;
        if (!w) Se = O.every((Fe) => {
          const Re = P[Fe];
          return !!Re && E(u(Re));
        });
        else {
          Se = false;
          for (let Fe = 0; Fe < O.length - 1; Fe++) {
            const Re = P[O[Fe]], Ke = P[O[Fe + 1]];
            if (!(!Re || !Ke) && x(u(Re), u(Ke))) {
              Se = true;
              break;
            }
          }
        }
        Se && (ke.add(`poly:${q}`), C++);
      } else for (let Se = 0; Se < O.length - 1; Se++) {
        const Fe = P[O[Se]], Re = P[O[Se + 1]];
        !Fe || !Re || x(u(Fe), u(Re)) && (ke.add(`seg:${q}:${Se}`), C++);
      }
    }
    const le = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let q = 0; q < le.length; q++) {
      const O = le[q];
      if (!O || O.length !== 6) continue;
      const Ae = u([O[0], O[1], O[2]]), Se = u([O[3], O[4], O[5]]);
      x(Ae, Se) && (ke.add(`aux:${q}`), C++);
    }
    Mt(), ne(`${w ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${C} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${ke.size})`), Et.style.display = "none";
  }, Tn = () => {
    It && (It = null, Et.style.display = "none", ne("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Tn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && It && Tn();
  });
  const zo = () => {
    var _a2, _b, _c, _d;
    if (ke.size === 0) return false;
    const t = [...ke], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], r = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Set();
    for (const ee of t) {
      const [C, ...P] = ee.split(":");
      if (C === "pt") r.add(+P[0]);
      else if (C === "poly") d.add(+P[0]);
      else if (C === "seg") {
        const x = +P[0], F = +P[1];
        v.has(x) || v.set(x, /* @__PURE__ */ new Set()), v.get(x).add(F);
      } else C === "aux" && w.add(+P[0]);
    }
    let _ = 0, z = [], u = [];
    const E = /* @__PURE__ */ new Map();
    for (let ee = 0; ee < a.length; ee++) {
      if (d.has(ee)) {
        _++;
        continue;
      }
      E.set(ee, z.length);
      const C = v.get(ee);
      if (C && C.size > 0) {
        let P = [];
        for (let x = 0; x < a[ee].length; x++) P.push(a[ee][x]), x < a[ee].length - 1 && C.has(x) && (P.length >= 2 && z.push(P), P = [], _++);
        (P.length >= 2 || P.length === 1) && z.push(P);
      } else z.push([...a[ee]]);
    }
    if (r.size > 0) {
      const ee = [], C = /* @__PURE__ */ new Map();
      for (let x = 0; x < o.length; x++) {
        if (r.has(x)) {
          _++;
          continue;
        }
        C.set(x, ee.length), ee.push([...o[x]]);
      }
      const P = [];
      for (const x of z) {
        let F = [];
        for (const H of x) {
          const U = C.get(H);
          U === void 0 ? (F.length >= 2 && P.push(F), F = []) : F.push(U);
        }
        F.length >= 2 && P.push(F);
      }
      z = P, e.points.val = ee;
    }
    for (const ee of n) {
      const C = E.get(ee);
      C !== void 0 && C < z.length && u.push(C);
    }
    if (e.polylines && (e.polylines.val = z), e.areas && (e.areas.val = u), w.size > 0 && s) {
      const ee = i.filter((C, P) => !w.has(P));
      "val" in s ? s.val = ee : window.__hekatanDrawingAuxLines = ee, _ += w.size;
    }
    ke.clear(), Mt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ne(`\u{1F5D1} ${_} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = zo, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || ke.size !== 0 && (t.preventDefault(), zo());
  });
  const Tt = document.createElement("div");
  Tt.id = "hk-properties-pane";
  const Fo = "hk-props-pane-pos";
  let bn = null;
  try {
    const t = localStorage.getItem(Fo);
    t && (bn = JSON.parse(t));
  } catch {
  }
  Tt.style.cssText = ["position:fixed", bn ? `left:${bn.left}px` : "left:14px", bn ? `top:${bn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Tt);
  const xs = () => {
    const t = Tt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, a = 0, n = 0, s = 0, i = 0;
    t.addEventListener("mousedown", (r) => {
      o = true, a = r.clientX, n = r.clientY;
      const d = Tt.getBoundingClientRect();
      s = d.left, i = d.top, Tt.style.transform = "none", Tt.style.left = `${s}px`, Tt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const d = r.clientX - a, v = r.clientY - n, w = Math.max(0, Math.min(window.innerWidth - 80, s + d)), _ = Math.max(0, Math.min(window.innerHeight - 40, i + v));
      Tt.style.left = `${w}px`, Tt.style.top = `${_}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Fo, JSON.stringify({ left: parseFloat(Tt.style.left), top: parseFloat(Tt.style.top) }));
        } catch {
        }
      }
    });
  }, j = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, zt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let st = null;
  const gt = (t, o, a, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: a, value: n } }));
  }, gs = () => {
    if (st && (st.dispose(), st = null), ke.size === 0) {
      Tt.style.display = "none";
      return;
    }
    const t = [...ke], o = t.filter((z) => z.startsWith("pt:")), a = t.filter((z) => z.startsWith("seg:")), n = t.filter((z) => z.startsWith("poly:")), s = t.filter((z) => z.startsWith("aux:")), i = o.length > 0, r = a.length > 0, d = n.length > 0, v = !i && !r && !d, w = [];
    o.length && w.push(`\u{1F535} ${o.length} nodo(s)`), a.length && w.push(`\u{1F4CF} ${a.length} segmento(s)`), n.length && w.push(`\u25AD ${n.length} \xE1rea(s)`), s.length && w.push(`\u250A ${s.length} aux`);
    const _ = `\u{1F3AF} ${ke.size} item(s) \u2014 ${w.join(", ")}`;
    st = new cs({ container: Tt, title: _ });
    {
      const z = st.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      z.addBinding(zt, "dx", { label: "\u0394x (m)", step: 0.1 }), z.addBinding(zt, "dy", { label: "\u0394y (m)", step: 0.1 }), z.addBinding(zt, "dz", { label: "\u0394z (m)", step: 0.1 }), z.addBinding(zt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), z.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const E = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, zt.copias);
        ne(E ? `\u29C9 Replicado \xD7${E} (\u0394 ${zt.dx},${zt.dy},${zt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), z.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const E = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, 1);
        ne(E ? `\u2192 Copia desplazada \u0394 ${zt.dx},${zt.dy},${zt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const u = z.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      u.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), u.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ne(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const z = st.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      z.addBinding(j, "Ux"), z.addBinding(j, "Uy"), z.addBinding(j, "Uz"), z.addBinding(j, "Rx"), z.addBinding(j, "Ry"), z.addBinding(j, "Rz");
      const u = st.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      u.addBinding(j, "Kx", { label: "Kx", min: 0, step: 100 }), u.addBinding(j, "Ky", { label: "Ky", min: 0, step: 100 }), u.addBinding(j, "Kz", { label: "Kz", min: 0, step: 100 }), u.addBinding(j, "Krx", { label: "Krx", min: 0, step: 1e3 }), u.addBinding(j, "Kry", { label: "Kry", min: 0, step: 1e3 }), u.addBinding(j, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const E = st.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      E.addBinding(j, "Fx", { step: 0.1 }), E.addBinding(j, "Fy", { step: 0.1 }), E.addBinding(j, "Fz", { step: 0.1 }), E.addBinding(j, "Mx", { step: 0.1 }), E.addBinding(j, "My", { step: 0.1 }), E.addBinding(j, "Mz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(j, "mass", { label: "m", min: 0, step: 1 }), st.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(j, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), st.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let P = 0;
        const x = [j.Ux, j.Uy, j.Uz, j.Rx, j.Ry, j.Rz];
        x.some((U) => U) && (gt("nodes", o, "supports", x), P++);
        const F = [j.Fx, j.Fy, j.Fz, j.Mx, j.My, j.Mz];
        F.some((U) => U !== 0) && (gt("nodes", o, "loads", F), P++);
        const H = [j.Kx, j.Ky, j.Kz, j.Krx, j.Kry, j.Krz];
        if (H.some((U) => U !== 0) && (gt("nodes", o, "springs", H), P++), j.mass !== 0 && (gt("nodes", o, "mass", j.mass), P++), j.diaphragm !== "Ninguno" && (gt("nodes", o, "diaphragm", j.diaphragm), P++), P === 0) {
          ne("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let U = document.getElementById("hk-prop-toast");
          U || (U = document.createElement("div"), U.id = "hk-prop-toast", U.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(U)), U.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", U.style.background = "rgba(217,119,6,0.97)", U.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            U && (U.style.opacity = "0");
          }, 3200);
        } else ne(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const z = st.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      z.addBinding(j, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), z.addBinding(j, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const u = st.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      u.addBinding(j, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), u.addBinding(j, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), u.addBinding(j, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), u.addBinding(j, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), st.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(j, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), st.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(j, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const C = st.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      C.addBinding(j, "relMxI", { label: "Mx I" }), C.addBinding(j, "relMyI", { label: "My I" }), C.addBinding(j, "relMzI", { label: "Mz I" });
      const P = st.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      P.addBinding(j, "relMxJ", { label: "Mx J" }), P.addBinding(j, "relMyJ", { label: "My J" }), P.addBinding(j, "relMzJ", { label: "Mz J" }), st.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(j, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const F = st.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      F.addBinding(j, "LKx", { label: "LKx", min: 0, step: 100 }), F.addBinding(j, "LKy", { label: "LKy", min: 0, step: 100 }), F.addBinding(j, "LKz", { label: "LKz", min: 0, step: 100 });
      const H = st.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      H.addBinding(j, "qx", { step: 0.1 }), H.addBinding(j, "qy", { step: 0.1 }), H.addBinding(j, "qz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(j, "massPerM", { label: "m/L", min: 0, step: 1 }), st.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        gt("segs", a, "section", j.section), gt("segs", a, "material", j.material_frame);
        const le = { A: j.A_mod, Iz: j.Iz_mod, Iy: j.Iy_mod, J: j.J_mod };
        (le.A !== 1 || le.Iz !== 1 || le.Iy !== 1 || le.J !== 1) && gt("segs", a, "modifiers", le), j.insertionPoint !== "10 \u2014 Centroid" && gt("segs", a, "insertionPoint", j.insertionPoint), j.beta !== 0 && gt("segs", a, "beta", j.beta);
        const q = [j.relMxI, j.relMyI, j.relMzI], O = [j.relMxJ, j.relMyJ, j.relMzJ];
        (q.some((Fe) => Fe) || O.some((Fe) => Fe)) && gt("segs", a, "releases", { i: q, j: O }), j.hinges !== "None" && gt("segs", a, "hinges", j.hinges);
        const Ae = [j.LKx, j.LKy, j.LKz];
        Ae.some((Fe) => Fe !== 0) && gt("segs", a, "lineSprings", Ae);
        const Se = [j.qx, j.qy, j.qz];
        Se.some((Fe) => Fe !== 0) && gt("segs", a, "distLoad", Se), j.massPerM !== 0 && gt("segs", a, "massPerM", j.massPerM), ne(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (d) {
      const z = st.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      z.addBinding(j, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), z.addBinding(j, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), z.addBinding(j, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), st.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(j, "surfLoad", { label: "q", step: 0.1 }), st.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        gt("areas", n, "shellType", j.shellType), gt("areas", n, "thickness", j.thickness), gt("areas", n, "material", j.material_shell), j.surfLoad !== 0 && gt("areas", n, "surfLoad", j.surfLoad), ne(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (v) {
      const z = st.addFolder({ title: "\u2139 Selecci\xF3n" }), u = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      z.addBinding(u, "msg", { readonly: true, label: "" });
    }
    st.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      ke.clear(), Mt();
    }), Tt.style.display = "block", xs();
  };
  window.__hekatanRefreshPropsPane = gs;
  let mn = null, $n = false;
  g.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, $n = false);
  }), g.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !$n) {
      const o = t.clientX - mn.x, a = t.clientY - mn.y;
      Math.hypot(o, a) > 8 && ($n = true);
    }
  }), g.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !$n;
      mn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (It ? Tn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), ke.size > 0 && (ke.clear(), Mt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, s = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), ne(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ne("\u238B Cancelado (click derecho)");
      }
    }
  }), g.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), g.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Ut = null, Mn = false));
  }), g.addEventListener("pointermove", (t) => {
    if (It && t.buttons === 0) {
      const i = t.clientX < It.x;
      to(It.x, It.y, t.clientX, t.clientY, i);
      return;
    }
    if (!Ut) return;
    const o = t.clientX - Ut.x, a = t.clientY - Ut.y, n = Math.hypot(o, a);
    if (!Mn && n < 8) return;
    Mn = true;
    const s = t.clientX < Ut.x;
    to(Ut.x, Ut.y, t.clientX, t.clientY, s);
  }), g.addEventListener("pointerup", (t) => {
    if (!Ut) return;
    if (!Mn) {
      Ut = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    Co(Ut.x, Ut.y, t.clientX, t.clientY, o), Ut = null, Mn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true };
  const Xt = new je();
  Xt.visible = false, Xt.frustumCulled = false, p.add(Xt);
  const vs = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496 }, Ao = (t, o, a, n) => {
    var _a2, _b, _c, _d;
    for (; Xt.children.length; ) {
      const r = Xt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = vs[t] ?? 16777215, i = new Me().setFromPoints([new b(-1, -1, 0), new b(1, -1, 0), new b(1, -1, 0), new b(1, 1, 0), new b(1, 1, 0), new b(-1, 1, 0), new b(-1, 1, 0), new b(-1, -1, 0)]);
    Xt.add(new Kt(i, new ct({ color: s, linewidth: 2 }))), Xt.position.set(o, a, n), Xt.visible = true, oo();
  };
  let no = 4;
  const oo = () => {
    Xt.visible && Xt.scale.setScalar(no * Vn(Xt.position));
  };
  window.__hekatanOsnapMarkerRef = Xt, window.__hekatanUpdateOsnapScale = oo, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (no = t, oo(), y()), no);
  const Ln = () => {
    Xt.visible = false;
  }, Ms = (t, o, a, n) => {
    var _a2, _b, _c, _d;
    const s = window.__hekatanOsnap, i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let d = null;
    const v = { end: 0, node: 0, int: 1, mid: 2, cen: 3, per: 4, nea: 5 }, w = (C, P, x, F) => {
      const H = Math.hypot(P - t, x - o, F - a);
      if (H > n) return;
      const U = v[C] ?? 9;
      (!d || U < d.r || U === d.r && H < d.d) && (d = { type: C, x: P, y: x, z: F, d: H, r: U });
    };
    (s.node || s.end) && i.forEach((C) => {
      s.node && w("node", C[0], C[1], C[2]);
    });
    for (const C of r) if (!(C.length < 2)) for (let P = 0; P < C.length - 1; P++) {
      const x = i[C[P]], F = i[C[P + 1]];
      if (!(!x || !F) && (s.end && (w("end", x[0], x[1], x[2]), w("end", F[0], F[1], F[2])), s.mid && w("mid", (x[0] + F[0]) / 2, (x[1] + F[1]) / 2, (x[2] + F[2]) / 2), s.nea || s.per)) {
        const H = F[0] - x[0], U = F[1] - x[1], le = F[2] - x[2], q = H * H + U * U + le * le;
        if (q < 1e-12) continue;
        const O = Math.max(0, Math.min(1, ((t - x[0]) * H + (o - x[1]) * U + (a - x[2]) * le) / q)), Ae = x[0] + O * H, Se = x[1] + O * U, Fe = x[2] + O * le;
        s.nea && w("nea", Ae, Se, Fe), s.per && w("per", Ae, Se, Fe);
      }
    }
    if (s.cen) {
      const C = En(), P = [...pn];
      for (const x of C) P.some((F) => Math.hypot(F.c[0] - x.c[0], F.c[1] - x.c[1], F.c[2] - x.c[2]) < 1e-6 && Math.abs(F.r - x.r) < 1e-6) || P.push(x);
      for (const x of P) {
        if (!i.some((U) => Math.abs(Math.hypot(U[0] - x.c[0], U[1] - x.c[1], U[2] - x.c[2]) - x.r) < 1e-6)) continue;
        const H = Math.hypot(t - x.c[0], o - x.c[1], a - x.c[2]);
        if (H < n || Math.abs(H - x.r) < n) {
          const U = Math.min(H, n * 0.5), le = 3;
          (!d || le < d.r || le === d.r && U < d.d) && (d = { type: "cen", x: x.c[0], y: x.c[1], z: x.c[2], d: U, r: le });
        }
      }
    }
    if (s.int) {
      const C = [];
      for (const P of r) for (let x = 0; x < P.length - 1; x++) {
        const F = i[P[x]], H = i[P[x + 1]];
        if (!F || !H) continue;
        const U = H[0] - F[0], le = H[1] - F[1], q = H[2] - F[2], O = U * U + le * le + q * q;
        if (O < 1e-12) continue;
        const Ae = Math.max(0, Math.min(1, ((t - F[0]) * U + (o - F[1]) * le + (a - F[2]) * q) / O));
        Math.hypot(F[0] + Ae * U - t, F[1] + Ae * le - o, F[2] + Ae * q - a) < 3 * n && C.push([F, H]);
      }
      for (let P = 0; P < C.length; P++) for (let x = P + 1; x < C.length; x++) {
        const [F, H] = C[P], [U, le] = C[x], q = [H[0] - F[0], H[1] - F[1], H[2] - F[2]], O = [le[0] - U[0], le[1] - U[1], le[2] - U[2]], Ae = [F[0] - U[0], F[1] - U[1], F[2] - U[2]], Se = q[0] * q[0] + q[1] * q[1] + q[2] * q[2], Fe = q[0] * O[0] + q[1] * O[1] + q[2] * O[2], Re = O[0] * O[0] + O[1] * O[1] + O[2] * O[2], Ke = q[0] * Ae[0] + q[1] * Ae[1] + q[2] * Ae[2], tt = O[0] * Ae[0] + O[1] * Ae[1] + O[2] * Ae[2], dt = Se * Re - Fe * Fe;
        if (dt < 1e-12) continue;
        const rt = (Fe * tt - Re * Ke) / dt, ft = (Se * tt - Fe * Ke) / dt;
        if (rt < -1e-6 || rt > 1 + 1e-6 || ft < -1e-6 || ft > 1 + 1e-6) continue;
        const Pe = [F[0] + rt * q[0], F[1] + rt * q[1], F[2] + rt * q[2]], He = [U[0] + ft * O[0], U[1] + ft * O[1], U[2] + ft * O[2]];
        if (Math.hypot(Pe[0] - He[0], Pe[1] - He[1], Pe[2] - He[2]) > 1e-4) continue;
        [F, H, U, le].some((we) => Math.hypot(we[0] - Pe[0], we[1] - Pe[1], we[2] - Pe[2]) < 1e-6) || w("int", Pe[0], Pe[1], Pe[2]);
      }
    }
    const _ = window.__hekatanAxisGrids ?? [], z = window.__hekatanLevels ?? [], u = _.filter((C) => C && C.start && C.end).map((C) => [C.start, C.end]);
    for (const [C, P] of u) {
      s.end && (w("end", C[0], C[1], C[2]), w("end", P[0], P[1], P[2]));
      const x = P[0] - C[0], F = P[1] - C[1], H = P[2] - C[2], U = x * x + F * F + H * H;
      if (U < 1e-12) continue;
      const le = Math.max(0, Math.min(1, ((t - C[0]) * x + (o - C[1]) * F + (a - C[2]) * H) / U));
      if (s.nea && w("nea", C[0] + le * x, C[1] + le * F, C[2] + le * H), s.int && Math.abs(H) > 1e-9) for (const q of z) {
        const O = (q.z - C[2]) / H;
        O < -1e-6 || O > 1 + 1e-6 || w("int", C[0] + O * x, C[1] + O * F, q.z);
      }
    }
    if (s.int || s.node) for (let C = 0; C < u.length; C++) for (let P = C + 1; P < u.length; P++) {
      const [x, F] = u[C], [H, U] = u[P], le = F[0] - x[0], q = F[1] - x[1], O = U[0] - H[0], Ae = U[1] - H[1], Se = le * Ae - q * O;
      if (Math.abs(Se) < 1e-12) continue;
      const Fe = x[0] - H[0], Re = x[1] - H[1], Ke = (O * Re - Ae * Fe) / Se, tt = (le * Re - q * Fe) / Se;
      if (Ke < -1e-6 || Ke > 1 + 1e-6 || tt < -1e-6 || tt > 1 + 1e-6) continue;
      const dt = (_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workZ;
      w("int", x[0] + Ke * le, x[1] + Ke * q, typeof dt == "number" ? dt : a);
    }
    const E = window.__hekatanDrawingAuxLines, ee = (E == null ? void 0 : E.rawVal) ?? (E == null ? void 0 : E.val) ?? E ?? [];
    for (const C of ee) {
      if (C.length !== 6) continue;
      const P = [C[0], C[1], C[2]], x = [C[3], C[4], C[5]];
      if (s.end && (w("end", P[0], P[1], P[2]), w("end", x[0], x[1], x[2])), s.mid && w("mid", (P[0] + x[0]) / 2, (P[1] + x[1]) / 2, (P[2] + x[2]) / 2), s.nea || s.per) {
        const F = x[0] - P[0], H = x[1] - P[1], U = x[2] - P[2], le = F * F + H * H + U * U;
        if (le < 1e-12) continue;
        const q = Math.max(0, Math.min(1, ((t - P[0]) * F + (o - P[1]) * H + (a - P[2]) * U) / le)), O = P[0] + q * F, Ae = P[1] + q * H, Se = P[2] + q * U;
        s.nea && w("nea", O, Ae, Se), s.per && w("per", O, Ae, Se);
      }
    }
    return d ? { type: d.type, x: d.x, y: d.y, z: d.z } : null;
  }, wn = new je();
  wn.frustumCulled = false, p.add(wn);
  const Eo = new ct({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Vo = 0;
  const To = () => {
    var _a2, _b;
    for (const t of wn.children.slice()) wn.remove(t), (_b = (_a2 = t.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (t) => {
    var _a2, _b;
    To();
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of t || []) {
      const i = String(s).split(":");
      let r = [];
      if (i[0] === "pt") {
        const w = o[+i[1]];
        w && (r = [w, [w[0] + 1e-3, w[1], w[2]]]);
      } else if (i[0] === "seg") {
        const w = a[+i[1]] || [], _ = o[w[+i[2]]], z = o[w[+i[2] + 1]];
        _ && z && (r = [_, z]);
      } else i[0] === "poly" && (r = (a[+i[1]] || []).map((_) => o[_]).filter(Boolean));
      if (r.length < 2) continue;
      const d = new Me().setFromPoints(r.map((w) => new b(w[0], w[1], w[2]))), v = new _t(d, Eo);
      v.renderOrder = 1200, wn.add(v);
    }
    if (!wn.children.length) return;
    Vo = performance.now() + 900;
    const n = () => {
      const s = Vo - performance.now();
      if (s <= 0) {
        To(), y();
        return;
      }
      Eo.opacity = Math.min(1, s / 900) * 0.95, y(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Ms, window.__hekatanOsnapShow = Ao, window.__hekatanOsnapHide = Ln;
  let Ve = [], mt = 0, nn = 0, bt = null;
  const _n = document.createElement("div");
  _n.id = "hk-cad-status", _n.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", _n.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(_n);
  const bs = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), Ie && t.push(`\u{1F512} LOCK ${Ie.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && t.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, ne = (t) => {
    var _a2;
    const o = t + bs();
    _n.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, _s = "Comando:", Ss = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], n = Ve.length, s = (i, r = []) => ({ txt: i, ops: r });
    switch (t) {
      case "line":
        return a.length >= 2 ? s("L\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : a.length === 1 ? s("L\xCDNEA Precise punto siguiente o", ["desHacer"]) : s("L\xCDNEA Precise primer punto:");
      case "polyline":
        return a.length >= 2 ? s("POLIL\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : a.length === 1 ? s("POLIL\xCDNEA Precise punto siguiente o", ["desHacer"]) : s("POLIL\xCDNEA Precise punto inicial:");
      case "node":
        return s("NUDO Precise punto:");
      case "area":
        return s(`LOSA Precise v\xE9rtice ${Math.min(a.length + 1, 4)} de 4 (en orden, antihorario):`);
      case "rectarea":
        return s(n ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea":
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${fe.length + 1} (Enter o clic derecho cierra y malla):`);
      case "rect":
        return s(n ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(n ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(n === 0 ? "ARCO Precise punto inicial:" : n === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${mt > 0 ? mt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${mt > 0 ? mt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(bt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(bt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(bt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${nn > 0 ? ` (distancia ${nn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
      case "axis":
        return s("EJE Precise el primer punto del eje:");
      case "aux":
        return s(n ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
      case "auxp":
        return s("PUNTO AUXILIAR Precise punto:");
      case "chaflan":
        return s(n ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
      case "delete":
        return s("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move":
        return ke.size ? s(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return ke.size ? s(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return ke.size ? s(`SELECCI\xD3N ${ke.size} objeto${ke.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(_s);
    }
  }, Rt = () => {
    var _a2;
    try {
      const t = Ss();
      (_a2 = window.__hekatanCadPrompt) == null ? void 0 : _a2.call(window, t.txt, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Rt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    ne(o);
  }, window.__hekatanCadResetPending = () => {
    Ve = [], fe = [], W.visible = false, so(), bt = null, y(), ne("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Rt();
  };
  function so() {
    if (!e.polylines) return;
    const t = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...t, []];
  }
  window.__hekatanCerrarPolilinea = so;
  const yn = [], In = [], ao = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, $o = (t) => {
    var _a2;
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Ve = [], pe.visible = false, ut.visible = false, D();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y(), Rt();
  }, Bt = () => {
    yn.push(ao()), yn.length > 100 && yn.shift(), In.length = 0;
  }, Rn = () => {
    const t = yn.pop();
    if (!t) {
      ne("\u21B6 Nada para deshacer");
      return;
    }
    In.push(ao()), $o(t), ne(`\u21B6 Deshacer \u2014 quedan ${yn.length}`);
  }, Lo = () => {
    const t = In.pop();
    if (!t) {
      ne("\u21B7 Nada para rehacer");
      return;
    }
    yn.push(ao()), $o(t), ne(`\u21B7 Rehacer \u2014 quedan ${In.length}`);
  };
  window.__hekatanPushUndo = Bt, window.__hekatanUndo = Rn, window.__hekatanRedo = Lo, document.addEventListener("keydown", (t) => {
    var _a2;
    const o = t.key.toLowerCase();
    if (!((t.ctrlKey || t.metaKey) && (o === "y" || o === "z" && t.shiftKey))) return;
    const n = t.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (t.preventDefault(), t.stopPropagation(), Lo());
  }, { capture: true }), window.__hekatanCadOption = (t) => {
    var _a2, _b, _c, _d, _e2;
    const o = t.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Rn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ne("Cerrar necesita al menos tres puntos."), true;
      Bt(), e.polylines.val = [...n.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return io(), ne(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Rn(), true;
      Bt();
      const i = s[s.length - 1], r = s.slice(0, -1), d = n.some((_, z) => z !== n.length - 1 && _.includes(i)) || r.includes(i);
      let v = e.points.rawVal, w = [...n.slice(0, -1), r];
      if (!d && i === v.length - 1 && (v = v.slice(0, -1), e.points.val = v), e.polylines.val = w, r.length) {
        const _ = v[r[r.length - 1]];
        _ && (B = [_[0], _[1], _[2]]);
      } else B = null, pe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return y(), ne(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Rt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (t) => {
    var _a2;
    if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z" && !t.shiftKey) {
      const o = t.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Rn();
    }
  }, { capture: true });
  const io = () => {
    Ve = [], bt = null, so(), Ie = null, Gt(), pe.visible = false, ut.visible = false, D(), ne("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), y(), Rt();
  };
  window.__hekatanFinalizeDraw = io;
  const Io = () => {
    var _a2, _b, _c;
    Ve = [], fe = [], W.visible = false;
    let t = false;
    ke.size && (ke.clear(), Mt(), t = true), io();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ne(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), y(), Rt();
  };
  window.__hekatanEscapeCancel = Io;
  const Ro = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return ke.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (t[+a.slice(5)] || []).forEach((n) => o.add(n));
      else if (a.startsWith("seg:")) {
        const n = a.split(":"), s = t[+n[1]] || [], i = s[+n[2]], r = s[+n[2] + 1];
        i != null && o.add(i), r != null && o.add(r);
      }
    }), o;
  }, Bo = (t, o, a) => {
    var _a2;
    const n = Ro();
    if (!n.size) return 0;
    Bt();
    const s = e.points.rawVal.map((i, r) => n.has(r) ? [i[0] + t, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Mt(), y(), n.size;
  };
  window.__hekatanMoveSelection = Bo;
  const Do = (t, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!ke.size) {
      ne(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Rt();
      return;
    }
    if (Ve.push(o), Ve.length === 1) {
      B = o, ne(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Rt();
      return;
    }
    const [a, n] = Ve, s = [n[0] - a[0], n[1] - a[1], n[2] - a[2]];
    Ve = [], pe.visible = false;
    let i = 0;
    t === "move" ? i = Bo(s[0], s[1], s[2]) : (i = Ro().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ne(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), t === "move" && (ke.clear(), Mt()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Rt();
  };
  window.__hekatanPasoMoverCopiar = Do;
  const ks = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), lo = (t, o, a, n, s, i) => {
    const r = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], d = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], v = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], w = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], _ = r[0] * d[0] + r[1] * d[1] + r[2] * d[2], z = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], u = r[0] * v[0] + r[1] * v[1] + r[2] * v[2], E = d[0] * v[0] + d[1] * v[1] + d[2] * v[2], ee = w * z - _ * _;
    if (ee < 1e-12) return null;
    const C = (_ * E - z * u) / ee, P = (w * E - _ * u) / ee;
    if (!s && (C < -1e-6 || C > 1 + 1e-6) || !i && (P < -1e-6 || P > 1 + 1e-6)) return null;
    const x = [t[0] + C * r[0], t[1] + C * r[1], t[2] + C * r[2]], F = [a[0] + P * d[0], a[1] + P * d[1], a[2] + P * d[2]];
    return jt(x, F) > 1e-4 ? null : x;
  }, Ps = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((n) => n === t).length, 0);
  }, Cs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, zs = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, n = e.points.rawVal, s = Cs[t];
    if (!bt) {
      if (ve < 0) {
        ne(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      bt = { poly: ve, seg: Math.max(0, Je) }, ne(t === "offset" ? `DESFASE l\xEDnea #${bt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${nn > 0 ? ` (${nn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Rt();
      return;
    }
    if (t === "offset") {
      const C = bt.poly, P = a[C];
      if (!P || P.length < 2) {
        bt = null, ne("DESFASE: esa polil\xEDnea no tiene tramos."), Rt();
        return;
      }
      const x = P.length > 2 && P[0] === P[P.length - 1], F = ks(), H = [];
      for (let Pe = 0; Pe < P.length - 1; Pe++) {
        const He = n[P[Pe]], at = n[P[Pe + 1]], we = [at[0] - He[0], at[1] - He[1], at[2] - He[2]], Te = Math.hypot(we[0], we[1], we[2]) || 1, nt = we[0] / Te, Vt = we[1] / Te, $t = we[2] / Te, Nt = [F[1] * $t - F[2] * Vt, F[2] * nt - F[0] * $t, F[0] * Vt - F[1] * nt], Wt = Math.hypot(Nt[0], Nt[1], Nt[2]) || 1;
        H.push({ a: He, b: at, n: [Nt[0] / Wt, Nt[1] / Wt, Nt[2] / Wt] });
      }
      let U = 0, le = 1 / 0;
      H.forEach((Pe, He) => {
        const at = Ot(o[0], o[1], o[2], Pe.a[0], Pe.a[1], Pe.a[2], Pe.b[0], Pe.b[1], Pe.b[2]);
        at < le && (le = at, U = He);
      });
      const q = H[U], O = Math.sign((o[0] - q.a[0]) * q.n[0] + (o[1] - q.a[1]) * q.n[1] + (o[2] - q.a[2]) * q.n[2]) || 1, Ae = nn > 0 ? nn : le;
      if (Ae < 1e-6) {
        ne("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const Se = H.map((Pe) => ({ a: [Pe.a[0] + O * Ae * Pe.n[0], Pe.a[1] + O * Ae * Pe.n[1], Pe.a[2] + O * Ae * Pe.n[2]], b: [Pe.b[0] + O * Ae * Pe.n[0], Pe.b[1] + O * Ae * Pe.n[1], Pe.b[2] + O * Ae * Pe.n[2]] })), Fe = Se.length, Re = (Pe) => {
        const He = Se[(Pe - 1 + Fe) % Fe], at = Se[Pe % Fe];
        return lo(He.a, He.b, at.a, at.b, true, true) ?? at.a;
      }, Ke = [], tt = x ? Fe : Fe + 1;
      for (let Pe = 0; Pe < tt; Pe++) !x && Pe === 0 ? Ke.push(Se[0].a) : !x && Pe === Fe ? Ke.push(Se[Fe - 1].b) : Ke.push(Re(Pe));
      Bt();
      const dt = n.length;
      e.points.val = [...n, ...Ke];
      const rt = Ke.map((Pe, He) => dt + He);
      x && rt.push(dt);
      let ft = a.slice();
      ft.length && ft[ft.length - 1].length === 0 && (ft = ft.slice(0, -1)), e.polylines.val = [...ft, rt, []], bt = null, ne(`\u2713 Desfase a ${Ae.toFixed(2)} m \u2014 ${Fe} tramo${Fe === 1 ? "" : "s"} nuevo${Fe === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      y(), Rt();
      return;
    }
    let i = ve, r = Math.max(0, Je);
    if (i < 0 || i === bt.poly && r === bt.seg) {
      let P = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((x, F) => {
        for (let H = 0; H < x.length - 1; H++) {
          if (F === bt.poly && H === bt.seg) continue;
          const U = n[x[H]], le = n[x[H + 1]];
          if (!U || !le) continue;
          const q = Ot(o[0], o[1], o[2], U[0], U[1], U[2], le[0], le[1], le[2]);
          q < P && (P = q, i = F, r = H);
        }
      }), i < 0) {
        ne(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const d = a[bt.poly], v = n[d[bt.seg]], w = n[d[bt.seg + 1]], _ = a[i], z = _[r], u = _[r + 1];
    if (!v || !w || z == null || u == null) {
      ne(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const E = n[z], ee = n[u];
    if (t === "trim") {
      const C = lo(E, ee, v, w, false, false);
      if (!C) {
        ne("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Bt();
      const P = n.length;
      e.points.val = [...n, C];
      const x = [..._.slice(0, r + 1), P, ..._.slice(r + 1)];
      e.polylines.val = a.map((H, U) => U === i ? x : H);
      const F = jt(o, E) < jt(o, ee);
      Fn(i, F ? r : r + 1), ne(`\u2713 Recortado en (${C[0].toFixed(2)}, ${C[1].toFixed(2)}, ${C[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const C = lo(E, ee, v, w, true, false);
      if (!C) {
        ne("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const x = jt(o, E) < jt(o, ee) ? r : r + 1;
      if (x !== 0 && x !== _.length - 1) {
        ne("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const F = _[x];
      if (jt(C, E) + jt(C, ee) < jt(E, ee) + 1e-6) {
        ne("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Bt(), Ps(F) > 1) {
        const U = n.length;
        e.points.val = [...n, C];
        const le = _.slice();
        le[x] = U, e.polylines.val = a.map((q, O) => O === i ? le : q);
      } else e.points.val = n.map((U, le) => le === F ? C : U);
      ne(`\u2713 Alargada hasta (${C[0].toFixed(2)}, ${C[1].toFixed(2)}, ${C[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    y(), Rt();
  };
  window.__hekatanSelectionSize = () => ke.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return ke.clear(), o >= 0 && ke.add(`poly:${o}`), Mt(), ne(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), ke.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    ke.clear();
    const a = /* @__PURE__ */ new Set();
    return t.forEach((n, s) => {
      !n || n.length < 2 || (ke.add(`poly:${s}`), n.forEach((i) => a.add(i)));
    }), o.forEach((n, s) => {
      a.has(s) || ke.add(`pt:${s}`);
    }), Mt(), ne(`SELECCI\xD3N ${ke.size} objetos (todo el modelo) \xB7 Esc suelta`), ke.size;
  }, window.__hekatanReplicateSelection = (t, o, a, n, s = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), s = Math.max(0, Math.round(s || 0));
    const i = [...ke], r = e.points.rawVal, d = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], v = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), w = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), z = [];
    if (i.forEach((P) => {
      if (P.startsWith("pt:")) {
        const x = +P.slice(3);
        r[x] && w.add(x);
      } else if (P.startsWith("poly:")) {
        const x = +P.slice(5);
        if (!d[x] || d[x].length < 2) return;
        _.add(x), d[x].forEach((F) => w.add(F));
      } else if (P.startsWith("seg:")) {
        const x = P.split(":"), F = +x[1], H = +x[2], U = d[F] || [], le = U[H], q = U[H + 1];
        le != null && q != null && (z.push([le, q]), w.add(le), w.add(q));
      }
    }), !w.size) return 0;
    Bt();
    const u = [...r];
    let E = d.slice();
    E.length && E[E.length - 1].length === 0 && (E = E.slice(0, -1));
    const ee = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], C = [...w];
    for (let P = 1; P <= n; P++) {
      const x = s + P, F = t * x, H = o * x, U = a * x, le = /* @__PURE__ */ new Map();
      C.forEach((q) => {
        le.set(q, u.length), u.push([r[q][0] + F, r[q][1] + H, r[q][2] + U]);
      }), _.forEach((q) => {
        const O = d[q].map((Se) => le.has(Se) ? le.get(Se) : Se), Ae = E.length;
        E.push(O), v.has(q) && ee.push(Ae);
      }), z.forEach(([q, O]) => {
        E.push([le.get(q), le.get(O)]);
      });
    }
    E.push([]), e.points.val = u, e.polylines && (e.polylines.val = E), e.areas && (e.areas.val = ee);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return y(), n;
  }, g.addEventListener("click", (t) => {
    var _a2, _b;
    if (tn > 5) {
      tn = 0;
      return;
    }
    tn = 0;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    const a = ae();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(c.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), r = a[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(s * 12, 300)) {
        ne("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = a[0].point;
    (t.ctrlKey || t.metaKey) && (n = new b(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = s[s.length - 1] ?? [], r = e.points.rawVal ?? [];
      if (i.length > 0) {
        const d = r[i[i.length - 1]];
        if (d) {
          const v = !!window.__hekatanOrthoMode;
          let w = Ie;
          if (!w && v) {
            const _ = Math.abs(n.x - d[0]), z = Math.abs(n.y - d[1]), u = Math.abs(n.z - d[2]);
            w = _ >= z && _ >= u ? "x" : z >= u ? "y" : "z";
          }
          w === "x" ? n = new b(n.x, d[1], d[2]) : w === "y" ? n = new b(d[0], n.y, d[2]) : w === "z" && (n = new b(d[0], d[1], n.z));
        }
      }
    }
    if (Jt) n = Jt.clone(), ne(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const s = jn(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s);
      if (i) n = new b(i.x, i.y, i.z), ne(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0;
        r && d > 0 && (n = new b(Math.round(n.x / d) * d, Math.round(n.y / d) * d, Math.round(n.z / d) * d));
      }
    }
    Xo(n, t);
  });
  const Xo = (t, o) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (ht) {
        It && Tn();
        const { kind: n, a: s, b: i } = ht, r = i !== void 0 ? `${n}:${s}:${i}` : `${n}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || ke.clear(), ke.has(r) ? ke.delete(r) : ke.add(r), Mt(), ne(`\u2713 Seleccionados ${ke.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        It ? (Co(It.x, It.y, s, i, n), It = null) : n || (It = { x: s, y: i }, ne("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), to(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], ne(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], s);
      ne(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      Do(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "delete") {
      if (Qe >= 0) {
        const n = window.__hekatanDrawingAuxLines, s = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = Qe;
        if (i >= 0 && i < s.length) {
          Bt();
          const r = s.slice(0, i).concat(s.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = r : window.__hekatanDrawingAuxLines = r, ne(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Qe = -1, Ee.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (ve >= 0) {
        const n = ve, s = Je;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (dn(n), ne(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : s >= 0 ? (Fn(n, s), ne(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${n + 1} borrado`)) : (dn(n), ne(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else ne("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        ne("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, s] = Ve, i = Math.hypot(s[0] - n[0], s[1] - n[1], s[2] - n[2]);
      Math.abs(s[0] - n[0]);
      const r = Math.abs(s[1] - n[1]), v = Math.abs(s[2] - n[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", w = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, w, v), ne(`\u2713 C\xEDrculo dibujado en ${v.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${w} segmentos`), Ve = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        ne("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ve.length === 2) {
        ne("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, s, i] = Ve, r = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, s, i, r), ne(`\u2713 Arco dibujado \u2014 ${r} segmentos`), Ve = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        ne("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ve;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, s), ne(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ve = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        ne("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ve;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, s), ne(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ve = [];
      return;
    }
    if (a === "polyarea") {
      fe.push([t.x, t.y, t.z]), W.geometry.setFromPoints(fe.map((n) => new b(n[0], n[1], n[2]))), W.visible = fe.length >= 1, ne(`\u25B0 \xC1rea libre \u2014 ${fe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), y();
      return;
    }
    if (a === "plane3") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length < 3) {
        ne(`\u25E3 Plano inclinado \u2014 punto ${Ve.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, s, i] = Ve, r = (_o2 = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o2.call(window, n, s, i);
      ne(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ve = [];
      return;
    }
    if (a === "col") {
      Bt();
      const n = t.z, s = mt && mt > 0 ? mt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + s]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], mt = 0, ne(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        ne("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, s] = Ve, i = mt && mt > 0 ? mt : 3;
      Bt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [n[0], n[1], n[2] + i]];
      const d = e.polylines.rawVal;
      if (d.length - 1, e.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const v = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, v];
      }
      ne(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ve = [], mt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Bt();
      const n = mt && mt > 0 ? mt : 3, s = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, s], [t.x, t.y, s + n]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], mt = 0, ne(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = ln(t.x, t.y, t.z, n);
      if (!s) {
        ne("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, r = e.points.rawVal, d = i[s.polyIdx], v = r[d[s.segIdx]], w = r[d[s.segIdx + 1]];
      if (!v || !w) {
        ne("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const _ = mt && mt > 0 ? mt : 3;
      Bt();
      const z = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [v[0], v[1], v[2]], [w[0], w[1], w[2]], [w[0], w[1], w[2] + _], [v[0], v[1], v[2] + _]];
      const u = e.polylines.rawVal;
      if (e.polylines.val = [...u.slice(0, -1), ...u[u.length - 1].length > 0 ? [u[u.length - 1]] : [], [z, z + 1, z + 2, z + 3, z], []], e.areas) {
        const E = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, E];
      }
      mt = 0, ne(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${_.toFixed(2)}m`);
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "auxp") {
      const n = window.__hekatanDrawingAuxPoints;
      if (n) {
        const s = n.rawVal ?? n.val ?? [];
        n.val = [...s, [t.x, t.y, t.z]];
      }
      ne(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        ne("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, s] = Ve, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const _ = i.rawVal ?? i.val ?? [];
        i.val = [..._, [n[0], n[1], n[2], s[0], s[1], s[2]]];
      }
      const r = s[0] - n[0], d = s[1] - n[1], v = s[2] - n[2], w = Math.sqrt(r * r + d * d + v * v);
      ne(`\u2713 L\xEDnea auxiliar creada \u2014 L=${w.toFixed(2)}m (cyan, no FEM)`), Ve = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      zs(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "chaflan") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        ne("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ve, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, s, i, r, 6);
      const d = Math.abs(s[0] - n[0]).toFixed(1), v = Math.abs(s[1] - n[1]).toFixed(1);
      ne(`\u2713 Losa con chaflanes dibujada \u2014 ${d}\xD7${v}m, r=${i}m, ${r} seg/chafl\xE1n`), Ve = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if ($ = false, Bt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, s = n.length - 1, i = n[s] ?? [];
      if (a === "line" && i.length >= 2) {
        ne(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), ne("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") ne(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (a === "line") ne("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") ne("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      ne(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  g.addEventListener("click", () => Rt()), g.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && fe.length >= 3) {
      t.preventDefault();
      const a = un();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), g.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    const a = ae();
    if (be.geometry.deleteAttribute("position"), a.length) {
      let n = a[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], d = r[r.length - 1] ?? [], v = e.points.rawVal ?? [];
        if (d.length > 0) {
          const w = v[d[d.length - 1]];
          if (w) {
            const _ = !!window.__hekatanOrthoMode;
            let z = Ie;
            if (!z && _) {
              const u = Math.abs(n.x - w[0]), E = Math.abs(n.y - w[1]), ee = Math.abs(n.z - w[2]);
              z = u >= E && u >= ee ? "x" : E >= ee ? "y" : "z";
            }
            z === "x" ? n.set(n.x, w[1], w[2]) : z === "y" ? n.set(w[0], n.y, w[2]) : z === "z" && n.set(w[0], w[1], n.z);
          }
        }
      }
      const s = jn(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s);
      if (i) n.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0.5;
        r && d > 0 && (n.x = Math.round(n.x / d) * d, n.y = Math.round(n.y / d) * d, n.z = Math.round(n.z / d) * d);
      }
      be.geometry.setAttribute("position", new vt(n.toArray(), 3));
    }
    y();
  }), g.addEventListener("pointermove", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    let a = false;
    const n = S.intersectObject(Q), s = ae();
    if (n.length && s.length) {
      const i = new b(...e.points.rawVal[n[0].index]), r = new b(...s[0].point), d = i.sub(r), v = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      v.transformDirection(K.matrixWorld), Math.abs(d.dot(v)) < 1e-4 && (a = true);
    }
    be.visible = !a;
  });
  let ro = false, co;
  g.addEventListener("pointermove", (t) => {
    var _a2;
    if (!tn) return;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    let a = false;
    const n = S.intersectObject(Q), s = ae();
    if (n.length && s.length) {
      const r = new b(...e.points.rawVal[n[0].index]), d = new b(...s[0].point), v = r.sub(d), w = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      w.transformDirection(K.matrixWorld), Math.abs(v.dot(w)) < 1e-4 && (a = true);
    }
    if (a && tn < 5 && (ro = true, c.enabled = false, co = n[0].index), !ro || tn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (co !== void 0) {
      let r = s[0].point;
      (t.ctrlKey || t.metaKey) && (r = new b(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[co] = r.toArray();
    }
    e.points.val = i;
  }), g.addEventListener("pointerup", () => {
    c.enabled = true, ro = false;
  }), g.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    let a = false;
    const n = S.intersectObject(Q), s = ae();
    if (n.length && s.length) {
      const d = new b(...e.points.rawVal[n[0].index]), v = new b(...s[0].point), w = d.sub(v), _ = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      _.transformDirection(K.matrixWorld), Math.abs(w.dot(_)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((d) => d.filter((v) => v !== n[0].index)).map((d) => d.map((v) => v > n[0].index ? v - 1 : v)).filter((d) => d.length);
    r.push([]), e.polylines.val = r;
  });
}
function xa(e, l, p) {
  const m = Math.round(14.999999999999998), f = { position: e.position.clone(), quaternion: e.quaternion.clone() }, g = setInterval(S, 1e3 / 30);
  let y = 0;
  function S() {
    y++;
    const A = y / m;
    e.position.lerpVectors(f.position, l.position, A), e.quaternion.slerpQuaternions(f.quaternion, l.quaternion, A), p && p(), y == m && clearInterval(g);
  }
}
function ga(e, l, p, h) {
  const c = Js(p, e.elements, h);
  return G.derive(() => {
    c.visible = l.shellResults.val != "none";
  }), c;
}
const va = 6, go = 10, Ma = 0.012;
function ba(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function _a(e, l, p, h) {
  if (!p && !h) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && p) {
    const m = p[e];
    if (m && m.has(l)) return m.get(l);
  }
  return null;
}
function Sa(e, l, p, h) {
  const c = new je(), m = new ds();
  m.setColorMap("rainbow");
  const f = new Zt(), g = G.state([]);
  return G.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const y = p.val, S = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], A = ba(l.frameResults.val);
    if (c.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), c.clear(), !A || S.length === 0 || y.length === 0) {
      g.val = [];
      return;
    }
    const M = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, K = (_c = e.deformOutputs) == null ? void 0 : _c.val, ie = [], ce = [];
    for (let L = 0; L < S.length; L++) {
      if (S[L].length !== 2) continue;
      const ue = _a(A, L, M, K);
      ue && (ie.push(ue[0], ue[1]), ce.push({ idx: L, vals: ue }));
    }
    if (ie.length === 0) {
      g.val = [];
      return;
    }
    const se = Math.min(...ie), V = Math.max(...ie);
    m.setMin(se), m.setMax(V), g.val = ie;
    const ae = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of y) for (let te = 0; te < 3; te++) ae[te] = Math.min(ae[te], L[te]), Q[te] = Math.max(Q[te], L[te]);
    const ye = Math.max(Q[0] - ae[0], Q[1] - ae[1], Q[2] - ae[2], 1) * Ma, N = [], B = [], Z = [];
    let $ = 0;
    for (const { idx: L, vals: te } of ce) {
      const ue = S[L], re = y[ue[0]], oe = y[ue[1]];
      if (!re || !oe) continue;
      const R = new b(oe[0] - re[0], oe[1] - re[1], oe[2] - re[2]), pe = R.length();
      if (pe < 1e-10) continue;
      R.normalize();
      const W = Math.abs(R.y) < 0.99 ? new b(0, 1, 0) : new b(1, 0, 0), fe = new b().crossVectors(R, W).normalize(), he = new b().crossVectors(R, fe).normalize(), $e = go + 1, _e = va;
      for (let De = 0; De < $e; De++) {
        const Oe = De / go, ut = re[0] + R.x * pe * Oe, Ft = re[1] + R.y * pe * Oe, k = re[2] + R.z * pe * Oe, I = te[0] + (te[1] - te[0]) * Oe, J = m.getColor(I) ?? new Zt(0, 0, 0);
        f.copy(J).convertSRGBToLinear();
        for (let X = 0; X < _e; X++) {
          const de = X / _e * Math.PI * 2, me = Math.cos(de), xe = Math.sin(de);
          N.push(ut + (fe.x * me + he.x * xe) * ye, Ft + (fe.y * me + he.y * xe) * ye, k + (fe.z * me + he.z * xe) * ye), B.push(f.r, f.g, f.b);
        }
      }
      for (let De = 0; De < go; De++) for (let Oe = 0; Oe < _e; Oe++) {
        const ut = (Oe + 1) % _e, Ft = $ + De * _e + Oe, k = $ + De * _e + ut, I = $ + (De + 1) * _e + Oe, J = $ + (De + 1) * _e + ut;
        Z.push(Ft, k, J), Z.push(Ft, J, I);
      }
      $ += $e * _e;
    }
    if (N.length === 0) return;
    const T = new Me();
    T.setAttribute("position", new vt(N, 3)), T.setAttribute("color", new vt(B, 3)), T.setIndex(Z), T.computeVertexNormals();
    const Y = new it({ vertexColors: true, side: kt }), D = new et(T, Y);
    D.frustumCulled = false, c.add(D);
  }), c.__colorMapValues = g, c;
}
function ka() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Pa = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Ca = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, za = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function wt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Fa = 16755200, ns = 56831, Aa = 56831, Ea = 56831, Yn = 65382;
function Va(e) {
  const l = new je();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const p = new xn(1, 16, 16), h = new it({ color: Fa, transparent: true, opacity: 0.85, depthTest: false }), c = new et(p, h);
  c.visible = false, c.renderOrder = 100, l.add(c);
  const m = new Me(), f = new ct({ color: ns, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), g = new Kt(m, f);
  g.visible = false, g.renderOrder = 100, l.add(g);
  const y = new it({ color: ns, transparent: true, opacity: 0.7, depthTest: false }), S = new et(new Oo(1, 1, 1, 12), y);
  S.visible = false, S.renderOrder = 100, l.add(S);
  const A = new Me(), M = new it({ color: Aa, transparent: true, opacity: 0.45, side: kt, depthTest: false }), K = new et(A, M);
  K.visible = false, K.renderOrder = 100, l.add(K);
  const ie = new Me(), ce = new ct({ color: Ea, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new Kt(ie, ce);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const V = new it({ color: Yn, transparent: true, opacity: 0.95, depthTest: false }), ae = new it({ color: Yn, transparent: true, opacity: 0.85, depthTest: false }), Q = new Oo(1, 1, 1, 12), be = new it({ color: Yn, transparent: true, opacity: 0.55, side: kt, depthTest: false }), ye = new ct({ color: Yn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), N = [];
  window.__hekatanModelSelection = N;
  const B = new je();
  B.renderOrder = 101, l.add(B);
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function $(k) {
    const I = e.derivedNodes.rawVal;
    return !I || k < 0 || k >= I.length ? null : new b(I[k][0], I[k][1], I[k][2]);
  }
  function T(k, I) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s;
    const J = e.getActiveCamera();
    if (!J || !e.mesh) return null;
    const X = e.rendererElm.getBoundingClientRect(), de = k - X.left, me = I - X.top, xe = e.derivedNodes.rawVal, ge = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!xe || !ge) return null;
    const Xe = /* @__PURE__ */ new Map(), Ce = (Ge) => {
      if (Xe.has(Ge)) return Xe.get(Ge);
      const Ye = $(Ge);
      if (!Ye) return Xe.set(Ge, null), null;
      const ze = Ye.clone().project(J), Ee = (ze.x * 0.5 + 0.5) * X.width, ve = (-ze.y * 0.5 + 0.5) * X.height, Je = { x: Ee, y: ve, z: ze.z };
      return Xe.set(Ge, Je), Je;
    }, Ne = /* @__PURE__ */ new Set();
    for (const Ge of ge) if (Ge) for (const Ye of Ge) Ne.add(Ye);
    const Le = 8;
    let Ze = -1, lt = Le;
    for (let Ge = 0; Ge < xe.length; Ge++) {
      if (!Ne.has(Ge)) continue;
      const Ye = Ce(Ge);
      if (!Ye || Ye.z < -1 || Ye.z > 1) continue;
      const ze = Ye.x - de, Ee = Ye.y - me, ve = Math.sqrt(ze * ze + Ee * Ee);
      ve < lt && (lt = ve, Ze = Ge);
    }
    const We = ka(), ot = Ca[We.dispUnit] ?? 1e3, Ie = Pa[We.forceUnit] ?? 1;
    if (Ze >= 0) {
      const Ge = xe[Ze];
      let Ye = `Nodo ${Ze}
(${Ge[0].toFixed(3)}, ${Ge[1].toFixed(3)}, ${Ge[2].toFixed(3)})`;
      const ze = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (ze == null ? void 0 : ze.deformations) {
        const Ee = ze.deformations.get(Ze);
        if (Ee && (Ye += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ye += `
Ux = ${wt(Ee[0] * ot, 3)} ${We.dispUnit}`, Ye += `
Uy = ${wt(Ee[1] * ot, 3)} ${We.dispUnit}`, Ye += `
Uz = ${wt(Ee[2] * ot, 3)} ${We.dispUnit}`, (Math.abs(Ee[3]) > 1e-9 || Math.abs(Ee[4]) > 1e-9 || Math.abs(Ee[5]) > 1e-9) && (Ye += `
Rx = ${wt(Ee[3] * 1e3, 3)} mrad`, Ye += `
Ry = ${wt(Ee[4] * 1e3, 3)} mrad`, Ye += `
Rz = ${wt(Ee[5] * 1e3, 3)} mrad`)), ze.reactions) {
          const ve = ze.reactions.get(Ze);
          ve && (Math.abs(ve[0]) > 1e-9 || Math.abs(ve[1]) > 1e-9 || Math.abs(ve[2]) > 1e-9 || Math.abs(ve[3]) > 1e-6 || Math.abs(ve[4]) > 1e-6 || Math.abs(ve[5]) > 1e-6) && (Ye += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ye += `
Fx = ${wt(ve[0] * Ie)} ${We.forceUnit}`, Ye += `
Fy = ${wt(ve[1] * Ie)} ${We.forceUnit}`, Ye += `
Fz = ${wt(ve[2] * Ie)} ${We.forceUnit}`, (Math.abs(ve[3]) > 1e-6 || Math.abs(ve[4]) > 1e-6 || Math.abs(ve[5]) > 1e-6) && (Ye += `
Mx = ${wt(ve[3] * Ie)} ${We.forceUnit}\xB7m`, Ye += `
My = ${wt(ve[4] * Ie)} ${We.forceUnit}\xB7m`, Ye += `
Mz = ${wt(ve[5] * Ie)} ${We.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ze, info: Ye };
    }
    const Jt = 5;
    let qe = -1, Gt = Jt, Dt = "frame";
    for (let Ge = 0; Ge < ge.length; Ge++) {
      const Ye = ge[Ge];
      if (!(!Ye || Ye.length < 2)) {
        if (Ye.length === 2) {
          const ze = Ce(Ye[0]), Ee = Ce(Ye[1]);
          if (!ze || !Ee || ze.z < -1 || ze.z > 1 || Ee.z < -1 || Ee.z > 1) continue;
          const ve = Ta(de, me, ze.x, ze.y, Ee.x, Ee.y);
          ve < Gt && (Gt = ve, qe = Ge, Dt = "frame");
        } else if (Ye.length === 3 || Ye.length === 4) {
          const ze = [];
          let Ee = true;
          for (const ve of Ye) {
            const Je = Ce(ve);
            if (!Je || Je.z < -1 || Je.z > 1) {
              Ee = false;
              break;
            }
            ze.push(Je);
          }
          if (!Ee) continue;
          if ($a(de, me, ze)) {
            const Je = ze.reduce((Qe, ke) => Qe + ke.z, 0) / ze.length * 1e-3;
            Je < Gt && (Gt = Je, qe = Ge, Dt = "shell");
          }
        } else if (Ye.length === 8) {
          const ze = [];
          let Ee = true;
          for (const Be of Ye) {
            const Ue = Ce(Be);
            if (!Ue || Ue.z < -1 || Ue.z > 1) {
              Ee = false;
              break;
            }
            ze.push(Ue);
          }
          if (!Ee) continue;
          const ve = Math.min(...ze.map((Be) => Be.x)), Je = Math.max(...ze.map((Be) => Be.x)), Qe = Math.min(...ze.map((Be) => Be.y)), ke = Math.max(...ze.map((Be) => Be.y));
          if (de >= ve && de <= Je && me >= Qe && me <= ke) {
            const Ue = ze.reduce((yt, Pt) => yt + Pt.z, 0) / ze.length * 1e-3;
            Ue < Gt && (Gt = Ue, qe = Ge, Dt = "solid");
          }
        }
      }
    }
    if (qe >= 0) {
      const Ge = ge[qe];
      let ze = `${Dt === "frame" ? "Frame" : Dt === "shell" ? "Shell" : "Solid"} ${qe}`;
      const Ee = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, ve = (_g = (_f = Ee == null ? void 0 : Ee.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, qe);
      if (ve) {
        ve.name && (ze += `
  \u{1F4CB} ${ve.name}`), ve.shape && (ze += `
  Shape: ${ve.shape}`);
        const Je = /concrete|hormig|rect.*sólida/i.test(ve.shape || ""), Qe = Je ? 100 : 1e3, ke = Je ? "cm" : "mm", Be = (yt) => {
          const Pt = yt * Qe;
          return Math.abs(Pt - Math.round(Pt)) < 0.05 ? `${Math.round(Pt)}` : `${Pt.toFixed(1)}`;
        }, Ue = [];
        if (ve.D != null && Ue.push(`D=${Be(ve.D)}`), ve.B != null && Ue.push(`B=${Be(ve.B)}`), ve.TF != null && Ue.push(`TF=${Be(ve.TF)}`), ve.TW != null && Ue.push(`TW=${Be(ve.TW)}`), ve.t != null && Ue.push(`t=${Be(ve.t)}`), Ue.length && (ze += `
  Dim: ${Ue.join(" ")} ${ke}`), ve.material) {
          let yt = ve.material;
          ve.fillMaterial && (yt += ` + FILL "${ve.fillMaterial}"`), ze += `
  Mat: ${yt}`;
        }
      } else {
        const Je = (_i = (_h = Ee == null ? void 0 : Ee.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, qe), Qe = (_k = (_j = Ee == null ? void 0 : Ee.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, qe);
        Je ? (ze += `
  ${Je}`, Qe && !Je.includes(Qe) && (ze += `  (${Qe})`)) : Qe && (ze += `
  Material: ${Qe}`);
      }
      if (ze += `
nodos: [${Ge.join(", ")}]`, Dt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Je = e.mesh.analyzeOutputs.rawVal, Qe = za[We.stressUnit] ?? 1, ke = [["bendingXX", "Mxx", Ie, `${We.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ie, `${We.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ie, `${We.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ie, `${We.forceUnit}/m`], ["membraneYY", "Nyy", Ie, `${We.forceUnit}/m`], ["membraneXY", "Nxy", Ie, `${We.forceUnit}/m`], ["shearX", "Qx", Ie, `${We.forceUnit}/m`], ["shearY", "Qy", Ie, `${We.forceUnit}/m`], ["vonMises", "\u03C3VM", Qe, We.stressUnit], ["pressure", "p", Qe, We.stressUnit]], Be = [];
        for (const [Ue, yt, Pt, Ct] of ke) {
          const Yt = Je == null ? void 0 : Je[Ue];
          if (Yt && Yt instanceof Map) {
            const ht = Yt.get(qe);
            if (ht != null) {
              if (typeof ht == "number") Be.push(`${yt} = ${wt(ht * Pt, 3)} ${Ct}`);
              else if (Array.isArray(ht)) {
                let At = ht[0];
                for (const Mt of ht) Math.abs(Mt) > Math.abs(At) && (At = Mt);
                Be.push(`${yt} = ${wt(At * Pt, 3)} ${Ct}`);
              }
            }
          }
        }
        Be.length > 0 && (ze += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Be.slice(0, 8).join(`
`));
      }
      if (Dt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const Je = e.mesh.deformOutputs.rawVal, Qe = e.mesh.elementInputs.rawVal, ke = Je == null ? void 0 : Je.deformations;
        if (ke && Ge.length === 2) {
          const Be = ke.get(Ge[0]), Ue = ke.get(Ge[1]), yt = xe[Ge[0]], Pt = xe[Ge[1]];
          if (Be && Ue && yt && Pt) {
            const Ct = Pt[0] - yt[0], Yt = Pt[1] - yt[1], ht = Pt[2] - yt[2], At = Math.sqrt(Ct * Ct + Yt * Yt + ht * ht);
            if (At > 1e-9) {
              const Mt = Ct / At, Ot = Yt / At, ln = ht / At, rn = (Ue[0] - Be[0]) * Mt + (Ue[1] - Be[1]) * Ot + (Ue[2] - Be[2]) * ln, cn = ((_n = Qe.elasticities) == null ? void 0 : _n.get(qe)) ?? 0, Wn = ((_o2 = Qe.areas) == null ? void 0 : _o2.get(qe)) ?? 0, dn = ((_p = Qe.momentsOfInertiaY) == null ? void 0 : _p.get(qe)) ?? 0, Fn = ((_q = Qe.momentsOfInertiaZ) == null ? void 0 : _q.get(qe)) ?? 0, pn = ((_r = Qe.torsionalConstants) == null ? void 0 : _r.get(qe)) ?? 0, An = ((_s = Qe.shearModuli) == null ? void 0 : _s.get(qe)) ?? cn / 2.6, gn = cn * Wn * (rn / At), En = (Ue[3] - Be[3]) * Mt + (Ue[4] - Be[4]) * Ot + (Ue[5] - Be[5]) * ln, un = An * pn * (En / At), Lt = Ue[4] - Be[4], qt = Ue[5] - Be[5], Ht = cn * dn * Lt / At, Qt = cn * Fn * qt / At;
              ze += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, ze += `
L = ${wt(At, 3)} m`, ze += `
\u0394L = ${wt(rn * ot, 3)} ${We.dispUnit}`, ze += `
\u03B5 = ${wt(rn / At, 6)}`, Math.abs(gn) > 1e-6 && (ze += `
N \u2248 ${wt(gn * Ie)} ${We.forceUnit}`), Math.abs(un) > 1e-6 && (ze += `
T \u2248 ${wt(un * Ie)} ${We.forceUnit}\xB7m`), Math.abs(Ht) > 1e-6 && (ze += `
My \u2248 ${wt(Ht * Ie)} ${We.forceUnit}\xB7m`), Math.abs(Qt) > 1e-6 && (ze += `
Mz \u2248 ${wt(Qt * Ie)} ${We.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Dt, idx: qe, info: ze };
    }
    return null;
  }
  function Y(k, I, J) {
    var _a2, _b, _c;
    if (c.visible = false, g.visible = false, S.visible = false, K.visible = false, se.visible = false, !k || !e.mesh) {
      Z.style.display = "none", e.render();
      return;
    }
    const X = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (k.type === "node") {
      const ge = $(k.idx);
      if (ge) {
        const Xe = e.derivedNodes.rawVal ?? [];
        let Ce = 1;
        if (Xe.length >= 2) {
          let Ze = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const We of Xe) for (let ot = 0; ot < 3; ot++) We[ot] < Ze[ot] && (Ze[ot] = We[ot]), We[ot] > lt[ot] && (lt[ot] = We[ot]);
          Ce = Math.max(lt[0] - Ze[0], lt[1] - Ze[1], lt[2] - Ze[2], 0.1);
        }
        const Ne = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Le = 0.021 * Ce * Ne;
        c.position.copy(ge), c.scale.setScalar(Le), c.visible = true;
      }
    } else if (k.type === "frame" && X) {
      const ge = X[k.idx], Xe = $(ge[0]), Ce = $(ge[1]);
      if (Xe && Ce) {
        const Ne = Xe.clone().add(Ce).multiplyScalar(0.5), Le = Ce.clone().sub(Xe), Ze = Le.length(), ot = e.getActiveCamera().position.distanceTo(Ne) * 35e-4;
        S.position.copy(Ne);
        const Ie = new b(0, 1, 0), Jt = Ie.clone().cross(Le).normalize(), qe = Ie.angleTo(Le);
        S.quaternion.setFromAxisAngle(Jt, qe), S.scale.set(ot, Ze, ot), S.visible = true;
      }
    } else if (k.type === "shell" && X) {
      const ge = X[k.idx], Xe = [], Ce = [];
      for (const Ne of ge) {
        const Le = $(Ne);
        if (!Le) return;
        Xe.push(Le.x, Le.y, Le.z);
      }
      ge.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && Ce.push(0, 1, 2), A.setAttribute("position", new vt(Xe, 3)), A.setIndex(Ce), A.computeVertexNormals(), K.visible = true;
    } else if (k.type === "solid" && X) {
      const ge = X[k.idx], Xe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Ne, Le] of Xe) {
        const Ze = $(ge[Ne]), lt = $(ge[Le]);
        Ze && lt && Ce.push(Ze.x, Ze.y, Ze.z, lt.x, lt.y, lt.z);
      }
      ie.setAttribute("position", new vt(Ce, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      Z.style.display = "none", e.render();
      return;
    }
    Z.textContent = k.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const me = e.rendererElm.getBoundingClientRect(), xe = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? me;
    Z.style.left = `${I - xe.left}px`, Z.style.top = `${J - xe.top}px`, e.render();
  }
  let D = "", L = 0, te = 0;
  const ue = window.__hekatanHoverDebug ?? false, re = (k) => {
    L && cancelAnimationFrame(L), L = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const I = T(k.clientX, k.clientY);
      if (ue && te < 5) {
        const X = e.derivedNodes.rawVal, de = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${k.clientX}, ${k.clientY}) nodes=${(X == null ? void 0 : X.length) ?? 0} elems=${(de == null ? void 0 : de.length) ?? 0} hover=`, I), te++;
      }
      const J = I ? `${I.type}:${I.idx}` : "";
      if (J !== D) D = J, Y(I, k.clientX, k.clientY);
      else if (I) {
        const X = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        Z.style.left = `${k.clientX - X.left}px`, Z.style.top = `${k.clientY - X.top}px`;
      }
    });
  };
  let oe = null;
  const R = () => {
    D = "", c.visible = false, g.visible = false, S.visible = false, K.visible = false, se.visible = false, Z.style.display = "none", e.render();
  }, pe = (k) => {
    const I = e.rendererElm.getBoundingClientRect(), J = k.clientX - I.left, X = k.clientY - I.top;
    (J < -2 || X < -2 || J > I.width + 2 || X > I.height + 2) && (oe && clearTimeout(oe), oe = window.setTimeout(R, 200));
  }, W = () => {
    oe && (clearTimeout(oe), oe = null);
  };
  e.rendererElm.addEventListener("pointermove", re), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", W);
  function fe() {
    var _a2, _b, _c;
    const k = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return k === "select" || k === "none" || !k;
  }
  let he = null;
  e.rendererElm.addEventListener("pointerdown", (k) => {
    k.button === 0 && (he = { x: k.clientX, y: k.clientY });
  }), e.rendererElm.addEventListener("pointerup", (k) => {
    if (k.button !== 0 || !he) return;
    const I = k.clientX - he.x, J = k.clientY - he.y;
    if (he = null, I * I + J * J > 9 || !fe()) return;
    const X = T(k.clientX, k.clientY);
    X ? (ut({ type: X.type, idx: X.idx }, k.shiftKey), Oe()) : Ft();
  }), window.addEventListener("keydown", (k) => {
    if (k.key !== "Escape" || !N.length) return;
    const I = document.activeElement, J = !!I && (I.id === "hk3-cmd-input" || I.id === "hk-dyn-input") && I.value === "";
    I && (I.tagName === "INPUT" || I.tagName === "TEXTAREA" || I.isContentEditable) && !J || Ft();
  }, { capture: true });
  function $e() {
    for (const k of B.children.slice()) {
      B.remove(k);
      const I = k.geometry;
      I && I !== p && I !== Q && I.dispose();
    }
  }
  const _e = (k) => {
    var _a2;
    const I = e.getActiveCamera(), J = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return I.isOrthographicCamera ? (I.top - I.bottom) / (I.zoom || 1) / J : 2 * I.position.distanceTo(k) * Math.tan((I.fov || 50) * Math.PI / 180 / 2) / J;
  };
  function De(k, I) {
    var _a2, _b;
    const J = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (k.type === "node") {
      const X = $(k.idx);
      if (!X) return;
      const de = new et(p, V);
      de.position.copy(X), de.scale.setScalar(Math.max(1e-4, 7 * _e(X))), de.renderOrder = 101, B.add(de);
    } else if (k.type === "frame" && J) {
      const X = J[k.idx], de = $(X[0]), me = $(X[1]);
      if (!de || !me) return;
      const xe = de.clone().add(me).multiplyScalar(0.5), ge = me.clone().sub(de), Xe = ge.length(), Ce = e.getActiveCamera().position.distanceTo(xe), Ne = new et(Q, ae);
      Ne.position.copy(xe);
      const Le = new b(0, 1, 0);
      Ne.quaternion.setFromAxisAngle(Le.clone().cross(ge).normalize(), Le.angleTo(ge)), Ne.scale.set(Ce * 35e-4, Xe, Ce * 35e-4), Ne.renderOrder = 101, B.add(Ne);
    } else if (k.type === "shell" && J) {
      const X = J[k.idx], de = [], me = [];
      for (const Xe of X) {
        const Ce = $(Xe);
        if (!Ce) return;
        de.push(Ce.x, Ce.y, Ce.z);
      }
      X.length === 4 ? me.push(0, 1, 2, 0, 2, 3) : X.length === 3 && me.push(0, 1, 2);
      const xe = new Me();
      xe.setAttribute("position", new vt(de, 3)), xe.setIndex(me), xe.computeVertexNormals();
      const ge = new et(xe, be);
      ge.renderOrder = 101, B.add(ge);
    } else if (k.type === "solid" && J) {
      const X = J[k.idx], de = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], me = [];
      for (const [Xe, Ce] of de) {
        const Ne = $(X[Xe]), Le = $(X[Ce]);
        Ne && Le && me.push(Ne.x, Ne.y, Ne.z, Le.x, Le.y, Le.z);
      }
      const xe = new Me();
      xe.setAttribute("position", new vt(me, 3));
      const ge = new Kt(xe, ye);
      ge.renderOrder = 101, B.add(ge);
    }
  }
  function Oe() {
    if ($e(), !N.length || !e.mesh) {
      e.render();
      return;
    }
    const k = e.derivedNodes.rawVal ?? [];
    if (k.length >= 2) {
      const I = [1 / 0, 1 / 0, 1 / 0], J = [-1 / 0, -1 / 0, -1 / 0];
      for (const X of k) for (let de = 0; de < 3; de++) X[de] < I[de] && (I[de] = X[de]), X[de] > J[de] && (J[de] = X[de]);
      Math.max(J[0] - I[0], J[1] - I[1], J[2] - I[2], 0.1);
    }
    for (const I of N) De(I);
    e.render();
  }
  function ut(k, I) {
    const J = N.findIndex((X) => X.type === k.type && X.idx === k.idx);
    J >= 0 ? N.splice(J, 1) : I || N.push(k), N.length && N[N.length - 1];
  }
  function Ft() {
    N.length = 0, Oe();
  }
  return G.derive(() => {
    e.derivedNodes.val, N.length && Oe();
  }), l;
}
function Ta(e, l, p, h, c, m) {
  const f = c - p, g = m - h, y = f * f + g * g;
  if (y < 1e-9) {
    const ce = e - p, se = l - h;
    return Math.sqrt(ce * ce + se * se);
  }
  let S = ((e - p) * f + (l - h) * g) / y;
  S = Math.max(0, Math.min(1, S));
  const A = p + S * f, M = h + S * g, K = e - A, ie = l - M;
  return Math.sqrt(K * K + ie * ie);
}
function $a(e, l, p) {
  let h = false;
  for (let c = 0, m = p.length - 1; c < p.length; m = c++) {
    const f = p[c].x, g = p[c].y, y = p[m].x, S = p[m].y;
    g > l != S > l && e < (y - f) * (l - g) / (S - g + 1e-12) + f && (h = !h);
  }
  return h;
}
function os(e, l = 8) {
  const p = document.createElement("div");
  p.id = "legend", p.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    G.derive(() => {
      Gn.val, p.style.background = Ws();
    });
  });
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", p.appendChild(h), setTimeout(() => {
    G.derive(() => {
      h.textContent = Mo.val ? `[${Mo.val}]` : "";
    });
  });
  const c = Array.from({ length: l + 1 }, (y, S) => S / l).reverse();
  let m, f;
  c.forEach((y, S) => {
    m = document.createElement("div"), m.id = `marker-${S}`, m.className = "marker", m.style.marginTop = S == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", f = document.createElement("p"), f.id = `marker-text-${S}`, m.append(f), p.append(m);
  });
  const g = [];
  return p.querySelectorAll("p").forEach((y) => g.push(y)), setTimeout(() => {
    G.derive(() => {
      c.forEach((y, S) => {
        const A = g[S];
        A && (A.innerText = La(e.val, y).toString());
      });
    });
  }), p;
}
function La(e, l) {
  const p = zn.val;
  if (p) return ss(p[0] + l * (p[1] - p[0]));
  const h = e.filter((f) => Number.isFinite(f));
  if (h.length === 0) return "0";
  const [c, m] = _o(h);
  return ss(c + l * (m - c));
}
function ss(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function Ga({ mesh: e, settingsObj: l, drawingObj: p, objects3D: h, solids: c }) {
  Ks.DEFAULT_UP = new b(0, 0, 1);
  const m = document.createElement("div"), f = new Ys(), g = new Us(45, 1, 0.1, 2 * 1e6), y = new Zs(-10, 10, 10, -10, -1e3, 2e6);
  let S = g;
  const A = new qs({ antialias: true });
  A.localClippingEnabled = true;
  const M = new Qo(g, A.domElement);
  M.enableDamping = true, M.dampingFactor = 0.1, M.screenSpacePanning = true, M.zoomSpeed = 0.8, M.panSpeed = 1.2, M.rotateSpeed = 0.9, M.keyPanSpeed = 12, M.listenToKeyEvents(window), M.touches = { ONE: Xn.ROTATE, TWO: Xn.DOLLY_PAN }, A.domElement.addEventListener("wheel", (k) => {
    if (!k.ctrlKey && Math.abs(k.deltaX) > Math.abs(k.deltaY) * 1.5) {
      k.preventDefault();
      const I = M.target, J = new b().subVectors(g.position, I), X = new b();
      X.crossVectors(g.up, J).normalize();
      const me = J.length() * 1e-3 * M.panSpeed;
      I.addScaledVector(X, k.deltaX * me), g.position.addScaledVector(X, k.deltaX * me), M.update();
    }
  }, { passive: false });
  const K = new wo(new b(-1, 0, 0), 0), ie = new wo(new b(0, -1, 0), 0), ce = new wo(new b(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const k = window.__hekatanClip, I = [];
    k.enableX && (K.normal.set(k.invertX ? 1 : -1, 0, 0), K.constant = k.invertX ? -k.posX : k.posX, I.push(K)), k.enableY && (ie.normal.set(0, k.invertY ? 1 : -1, 0), ie.constant = k.invertY ? -k.posY : k.posY, I.push(ie)), k.enableZ && (ce.normal.set(0, 0, k.invertZ ? 1 : -1), ce.constant = k.invertZ ? -k.posZ : k.posZ, I.push(ce)), A.clippingPlanes = I, f.traverse((X) => {
      const de = X;
      if (de.material) {
        const me = Array.isArray(de.material) ? de.material : [de.material];
        for (const xe of me) xe.clippingPlanes = I, xe.needsUpdate = true;
      }
    });
    const J = window.__hekatanPanes ?? [];
    for (const X of J) try {
      X && typeof X.refresh == "function" && X.refresh();
    } catch {
    }
    A.render(f, S);
  }
  se(), window.__hekatanClipApply = se;
  const V = Qs(l), ae = G.derive(() => Math.pow(10, V.displayScale.val / 10)), Q = Ia(e, V), be = () => {
    const k = [];
    return V.gridXY.rawVal && k.push("xy"), V.gridXZ.rawVal && k.push("xz"), V.gridYZ.rawVal && k.push("yz"), k;
  }, ye = () => {
    const k = V.gridStep.rawVal, I = Math.max(k, V.gridMajor.rawVal);
    return { planes: be(), majorStep: I, minorStep: k };
  };
  let N = xo(V.gridSize.rawVal, ye());
  N.visible = V.gridVisible.rawVal, window.__hekatanSnap2D = V.cursorSnap.rawVal;
  const B = () => {
    const k = Math.max(0, Math.min(1, V.gridOpacity.rawVal));
    N.traverse((I) => {
      const J = I.material;
      if (!J || !("opacity" in J)) return;
      const X = I.name ?? "";
      let de = 0.55;
      X.includes("border") ? de = 1 : X.includes("major") && (de = 0.95), J.opacity = k * de;
    });
  };
  B(), m.appendChild(Os(V, e, c)), m.setAttribute("id", "viewer"), m.appendChild(A.domElement), A.setPixelRatio(window.devicePixelRatio);
  const Z = an();
  A.setClearColor(Z.background, 1);
  const $ = V.gridSize.rawVal, T = $ * 0.5 + $ * 0.5 / Math.tan(45 * 0.5);
  g.position.set(0, 0, T), g.up.set(0, 1, 0), M.target.set(0, 0, 0), M.minDistance = 0.1, M.maxDistance = 1e4, m.__settings = V, M.zoomSpeed = 1, M._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, M.update();
  let Y = es(V.gridSize.rawVal, V.flipAxes.rawVal);
  f.add(N, Y), G.derive(() => {
    window.__hekatanGridPlaneXY = V.gridXY.val, window.__hekatanGridPlaneXZ = V.gridXZ.val, window.__hekatanGridPlaneYZ = V.gridYZ.val;
  });
  let D = true;
  G.derive(() => {
    const k = V.gridVisible.val;
    if (D) {
      D = false;
      return;
    }
    N.visible = k, W();
  });
  let L = true;
  G.derive(() => {
    if (V.gridOpacity.val, L) {
      L = false;
      return;
    }
    B(), W();
  }), G.derive(() => {
    const k = V.cursorSnap.val;
    window.__hekatanSnap2D = k;
  });
  let te = true;
  G.derive(() => {
    var _a2;
    const k = V.gridSize.val, I = V.flipAxes.val;
    if (V.gridXY.val, V.gridXZ.val, V.gridYZ.val, V.gridStep.val, V.gridMajor.val, te) {
      te = false;
      return;
    }
    f.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (de) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = de.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = de.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = xo(k, ye()), N.visible = V.gridVisible.rawVal, f.add(N), B(), f.remove(Y), Y.traverse((de) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = de.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = de.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Y = es(k, I), f.add(Y);
    const J = k * 0.5 + k * 0.5 / Math.tan(45 * 0.5);
    g.position.distanceTo(M.target), Math.abs(g.position.x) < 0.1 && Math.abs(g.position.y) < 0.1 && g.position.z > 0 ? g.position.set(0, 0, J) : g.position.set(0.5 * k, -J, 0.5 * k), M.target.set(0, 0, 0), M.minDistance = Math.max(0.05, k * 0.01), M.maxDistance = Math.max(50, k * 50), M.update(), W();
  }), new ResizeObserver((k) => {
    var _a2, _b;
    for (const I of k) {
      const J = (_a2 = I.target) == null ? void 0 : _a2.clientWidth, X = (_b = I.target) == null ? void 0 : _b.clientHeight;
      if (J === 0 || X === 0) continue;
      const me = (re ? J / 2 : J) / X;
      g.aspect = me, g.updateProjectionMatrix();
      const xe = y.top;
      if (y.left = -xe * me, y.right = xe * me, y.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = me, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const ge = oe, Xe = ge.top;
        ge.left = -Xe * me, ge.right = Xe * me, ge.updateProjectionMatrix();
      }
      A.setSize(J, X), W();
    }
  }).observe(m), M.addEventListener("change", W), G.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e2 = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e2.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, V.displayScale.val, V.nodes.val, V.elements.val, (_g = V.edges) == null ? void 0 : _g.val, V.elemColumns.val, V.elemBeams.val, V.nodesIndexes.val, V.elementsIndexes.val, V.orientations.val, V.sections.val, V.secColumns.val, V.secBeams.val, V.secFloor.val, V.supports.val, V.loads.val, V.deformedShape.val, V.nodeResults.val, V.frameResults.val, V.shellResults.val, (_h = V.solidResults) == null ? void 0 : _h.val, (_i = V.extruded) == null ? void 0 : _i.val, setTimeout(W);
  });
  let re = false, oe = null, R = null, pe = false;
  function W() {
    const k = m.clientWidth || 1, I = m.clientHeight || 1;
    if (!re || !oe) {
      A.setScissorTest(false), A.setViewport(0, 0, k, I), A.render(f, S);
      return;
    }
    const J = k / 2;
    A.setScissorTest(true), A.setViewport(0, 0, J, I), A.setScissor(0, 0, J, I), A.render(f, S), A.setViewport(J, 0, J, I), A.setScissor(J, 0, J, I), A.render(f, oe), A.setScissorTest(false);
  }
  function fe(k) {
    S = k, M.object = k, M.update(), W();
  }
  function he(k, I) {
    re = k, I && (oe = I);
    const J = m.clientWidth || 1, X = m.clientHeight || 1, me = (k ? J / 2 : J) / X;
    g.isPerspectiveCamera && (g.aspect = me, g.updateProjectionMatrix());
    const xe = y.top;
    if (y.left = -xe * me, y.right = xe * me, y.updateProjectionMatrix(), k && oe) {
      if (R ? (R.object = oe, R.update()) : (R = new Qo(oe, A.domElement), R.enableDamping = true, R.dampingFactor = 0.1, R.screenSpacePanning = true, R.zoomSpeed = 0.8, R.panSpeed = 1.2, R.rotateSpeed = 0.9, R.touches = { ONE: Xn.ROTATE, TWO: Xn.DOLLY_PAN }, R.target.copy(M.target), R.addEventListener("change", W), R.enabled = false), !pe) {
        const ge = (Xe) => {
          if (!re || !R) return;
          const Ce = A.domElement.getBoundingClientRect(), Ne = Xe.clientX - Ce.left, Le = Ce.width / 2, Ze = Ne >= Le;
          M.enabled = !Ze, R.enabled = Ze;
        };
        A.domElement.addEventListener("pointerdown", ge, true), A.domElement.addEventListener("wheel", ge, { capture: true, passive: true }), pe = true;
      }
    } else k || (M.enabled = true, R && (R.enabled = false));
    m.__splitMode = k, window.__hekatanSplitMode = k, window.__hekatanSplitCamera = k ? oe : null, W();
  }
  if (e) {
    f.add(js(V, Q, ae), Gs(e, V, Q), na(V, Q, ae), oa(e, V, Q, ae), ea(e, V, Q, ae), ta(e, V, Q, ae), ia(e, V, Q, ae), ra(e, V, Q, ae), ua(e, V, Q), wa(e, V, Q, ae), fa(e, V, Q, ae));
    const k = Va({ scene: f, rendererElm: A.domElement, getActiveCamera: () => S, derivedNodes: Q, derivedDisplayScale: ae, mesh: e, settings: V, render: W });
    f.add(k);
    const I = Ya(e, V), J = ga(e, V, Q, I), X = os(I);
    f.add(J), m.appendChild(X);
    const de = Sa(e, V, Q);
    f.add(de);
    const me = de.__colorMapValues, xe = os(me);
    xe.id = "frame-legend", m.appendChild(xe), G.derive(() => {
      var _a2;
      const ge = V.shellResults.val != "none", Xe = (((_a2 = V.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ce = ge || Xe, Ne = V.frameResults.val.startsWith("contour:"), Le = I.val.some((Ze) => Number.isFinite(Ze));
      X.hidden = !Ce || !Le, J.visible = Ce, xe.hidden = !Ne;
    });
  }
  if (c) {
    const k = new rs(16777215, 0.5);
    f.add(k);
    const I = new Kn(16777215, 0.5);
    I.position.set(30, 25, -10), I.shadow.mapSize.width = 1024, I.shadow.mapSize.height = 1024, f.add(I);
    const J = 10;
    I.shadow.camera.left = -J, I.shadow.camera.right = J, I.shadow.camera.top = J, I.shadow.camera.bottom = -J, I.shadow.camera.far = 1e3;
    const X = new Kn(16777215, 0.5);
    X.color.setHSL(11, 43, 96), X.position.set(-10, 0, 30), f.add(X), G.derive(() => {
      (c == null ? void 0 : c.val.length) && (f.remove(...c.oldVal), f.add(...c.rawVal), W());
    }), G.derive(() => {
      c.rawVal.forEach((de) => de.visible = V.solids.val), W();
    });
  }
  if (h) {
    const k = [], I = (X) => {
      var _a2;
      return ((_a2 = X == null ? void 0 : X.userData) == null ? void 0 : _a2.isCota) ? V.showCotas.val : V.custom3D.val;
    }, J = () => {
      for (const X of k) X.visible = I(X);
      W();
    };
    G.derive(() => {
      const X = h.val;
      k.length && (f.remove(...k), k.length = 0), X.length && (f.add(...X), k.push(...X), J()), W();
    }), G.derive(() => {
      V.custom3D.val, J();
    }), G.derive(() => {
      V.showCotas.val, J();
    });
  }
  p && ya({ drawingObj: p, gridObj: N, scene: f, getActiveCamera: () => S, controls: M, gridSize: $, derivedDisplayScale: ae, rendererElm: A.domElement, viewerRender: W }), is((k, I) => {
    var _a2;
    A.setClearColor(I.background, 1), f.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (J) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = J.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = J.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = xo(V.gridSize.rawVal, { planes: be() }), f.add(N), m.style.setProperty("--awatif-legend-color", I.legendMarker), W();
  });
  const $e = { scene: f, perspCamera: g, orthoCamera: y, get camera() {
    return S;
  }, controls: M, renderer: A, rendererElm: A.domElement, render: W, setActiveCamera: fe, setSplitMode: he, get splitMode() {
    return re;
  }, get splitCamera() {
    return oe;
  }, settings: V };
  m.__ctx = $e;
  const _e = document.createElement("div");
  _e.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const De = (k, I, J) => {
    const X = document.createElement("button");
    return X.textContent = k, X.title = I, X.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), X.onmouseenter = () => {
      X.style.background = "rgba(70,70,70,0.9)";
    }, X.onmouseleave = () => {
      X.style.background = "rgba(40,40,40,0.85)";
    }, X.onclick = (de) => {
      de.preventDefault(), J();
    }, X;
  }, Oe = (k, I) => {
    const J = M.target, X = new b().subVectors(S.position, J), de = X.length(), me = new b(), xe = new b();
    me.crossVectors(S.up, X).normalize(), xe.copy(S.up).normalize();
    const ge = de * 0.05;
    J.addScaledVector(me, -k * ge), J.addScaledVector(xe, I * ge), S.position.addScaledVector(me, -k * ge), S.position.addScaledVector(xe, I * ge), M.update(), W();
  }, ut = (k) => {
    const I = new b().subVectors(S.position, M.target);
    I.multiplyScalar(k), S.position.copy(M.target).add(I), M.update(), W();
  }, Ft = () => {
    const k = document.createElement("div");
    return k.style.cssText = "width:32px;height:32px;", k;
  };
  return _e.append(Ft()), _e.append(De("\u2191", "Pan arriba", () => Oe(0, 1))), _e.append(De("\u2295", "Zoom in", () => ut(0.85))), _e.append(De("\u2190", "Pan izquierda", () => Oe(-1, 0))), _e.append(De("\u2302", "Reset vista", () => {
    M.reset(), W();
  })), _e.append(De("\u2192", "Pan derecha", () => Oe(1, 0))), _e.append(De("\u2296", "Zoom out", () => ut(1.18))), _e.append(De("\u2193", "Pan abajo", () => Oe(0, -1))), _e.append(Ft()), getComputedStyle(m).position === "static" && (m.style.position = "relative"), m.appendChild(_e), m;
}
function Ia(e, l) {
  return G.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const p = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || p.length === 0) return p;
    const c = l.deformScale.val, m = l.deformScale.val * l.deformScaleZ.val, f = Number.isFinite(c) ? c : 1, g = Number.isFinite(m) ? m : 1;
    return p.map((y, S) => {
      var _a3;
      const A = ((_a3 = h.get(S)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], M = Number.isFinite(A[0]) ? A[0] : 0, K = Number.isFinite(A[1]) ? A[1] : 0, ie = Number.isFinite(A[2]) ? A[2] : 0;
      return [y[0] + M * f, y[1] + K * f, y[2] + ie * g];
    });
  });
}
const zn = G.state(null), Mo = G.state(""), Ra = G.state("kN"), Ba = G.state("mm"), Da = G.state("kN/m\xB2"), Xa = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, as = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Na = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Ya(e, l) {
  const p = G.state([]);
  let h;
  return ((c) => {
    c.bendingXX = "bendingXX", c.bendingYY = "bendingYY", c.bendingXY = "bendingXY", c.membraneXX = "membraneXX", c.membraneYY = "membraneYY", c.membraneXY = "membraneXY", c.tranverseShearX = "tranverseShearX", c.tranverseShearY = "tranverseShearY", c.membranePrincipalMax = "membranePrincipalMax", c.membranePrincipalMin = "membranePrincipalMin", c.bendingPrincipalMax = "bendingPrincipalMax", c.bendingPrincipalMin = "bendingPrincipalMin", c.transverseShearMax = "transverseShearMax", c.vonMises = "vonMises", c.pressure = "pressure", c.displacementX = "displacementX", c.displacementY = "displacementY", c.displacementZ = "displacementZ";
  })(h || (h = {})), G.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const c = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = (I, J) => {
      I == null ? void 0 : I.forEach((X, de) => {
        const me = e.elements.val[de];
        if (me) for (let xe = 0; xe < me.length; xe++) J.set(me[xe], [X[xe] ?? X[0]]);
      });
    };
    ce((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), ce((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, m), ce((_f = (_e2 = e.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, f), ce((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, g), ce((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, y), ce((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, S), ce((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, A), ce((_p = (_o2 = e.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, M), ce((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, K), ce((_t2 = (_s = e.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t2.pressure, ie);
    const se = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map(), ye = (I, J, X, de, me) => {
      I.forEach((xe, ge) => {
        var _a3, _b2;
        const Xe = xe[0] ?? 0, Ce = ((_a3 = J.get(ge)) == null ? void 0 : _a3[0]) ?? 0, Ne = ((_b2 = X.get(ge)) == null ? void 0 : _b2[0]) ?? 0, Le = (Xe + Ce) / 2, Ze = Math.hypot((Xe - Ce) / 2, Ne);
        de.set(ge, [Le + Ze]), me.set(ge, [Le - Ze]);
      });
    };
    ye(g, y, S, se, V), ye(c, m, f, ae, Q), A.forEach((I, J) => {
      var _a3;
      be.set(J, [Math.hypot(I[0] ?? 0, ((_a3 = M.get(J)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const N = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, B = (_w = l.solidResults) == null ? void 0 : _w.val, $ = B && B !== "none" ? B : l.shellResults.val, T = N == null ? void 0 : N[$], Y = { bendingXX: [c, 0], bendingYY: [m, 0], bendingXY: [f, 0], membraneXX: [g, 0], membraneYY: [y, 0], membraneXY: [S, 0], tranverseShearX: [A, 0], tranverseShearY: [M, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [V, 0], bendingPrincipalMax: [ae, 0], bendingPrincipalMin: [Q, 0], transverseShearMax: [be, 0], vonMises: [K, 0], pressure: [ie, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, D = l.shellResults.val, L = Ra.val, te = Ba.val, ue = D === "displacementX" || D === "displacementY" || D === "displacementZ", re = D === "bendingXX" || D === "bendingYY" || D === "bendingXY" || D === "bendingPrincipalMax" || D === "bendingPrincipalMin", oe = D === "membraneXX" || D === "membraneYY" || D === "membraneXY" || D === "membranePrincipalMax" || D === "membranePrincipalMin", R = D === "vonMises" || D === "pressure", pe = D === "tranverseShearX" || D === "tranverseShearY" || D === "transverseShearMax", W = (_D = l.solidResults) == null ? void 0 : _D.val, fe = W === "vonMises" || W === "sigmaXX" || W === "sigmaYY" || W === "sigmaZZ" || W === "tauXY" || W === "tauYZ" || W === "tauXZ", he = W === "ux" || W === "uy" || W === "uz", $e = Da.val, _e = fe ? Na[$e] : he || ue ? as[te] : re || oe || R || pe ? 1 / Xa[L] : 1, De = fe ? $e : he || ue ? te : re ? `${L}\xB7m/m` : oe ? `${L}/m\xB2` : R ? `${L}/m\xB2` : pe ? `${L}/m` : "";
    Mo.val = De, zn.val = Array.isArray(T) && T.length === 2 ? [T[0] * _e, T[1] * _e] : null;
    const Oe = us.val, Ft = W && W !== "none" ? [K, 0] : Y[D], k = [];
    if (e.nodes.val.forEach((I, J) => {
      const X = Ft;
      if (!X || !X[0] || typeof X[0].has != "function") return;
      if (!X[0].has(J)) {
        k.push(Number.NaN);
        return;
      }
      const de = X[0].get(J), me = de ? de[X[1]] ?? 0 : 0;
      k.push(me * _e);
    }), !zn.val && Oe !== "auto") {
      const I = e.nodes.val, J = /* @__PURE__ */ new Set(), X = (me, xe) => {
        var _a3;
        const ge = (_a3 = I[me[0]]) == null ? void 0 : _a3[xe];
        return me.every((Xe) => {
          var _a4;
          return Math.abs((((_a4 = I[Xe]) == null ? void 0 : _a4[xe]) ?? NaN) - ge) < 1e-6;
        });
      };
      for (const me of e.elements.val) {
        if (me.length !== 4) continue;
        const xe = X(me, 2), ge = !xe && X(me, 0), Xe = !xe && X(me, 1);
        if (Oe === "losas" ? xe : Oe === "muros" ? ge || Xe : Oe === "murosX" ? ge : Oe === "murosY" ? Xe : false) for (const Le of me) J.add(Le);
      }
      const de = [];
      for (const me of J) {
        const xe = k[me];
        Number.isFinite(xe) && de.push(xe);
      }
      de.length && (zn.val = _o(de));
    }
    p.val = k;
  }), p;
}
export {
  Js as a,
  os as b,
  Ra as c,
  Ba as d,
  Da as e,
  Ga as g
};
