import { N as Gt, a6 as Kn, q as Us, v as Q, a7 as qs, D as Ct, M as lt, B as Se, F as _t, a8 as Ks, x as ht, a9 as Gs, aa as Hs, h as os, ab as ss, r as dn, ac as Qn, ad as jn, a4 as xs, _ as it, a as ft, L as Ht, w as gs, b as Ws, ae as Js, f as ut, V as k, $ as cn, af as ko, H as Vo, d as St, c as So, Y as vs, Z as to, G as Os, z as En, A as Qs, ag as eo, t as js, o as ea, I as jt, a2 as Fn, E as as, S as xn, m as Gn, ah as An, g as is, i as ls, j as rs, C as cs, K as ta, U as na, W as oa, X as sa, T as Hn, P as Po, O as aa } from "./theme-Dxpmbnyd.js";
import { T as Pt, O as ds } from "./Text-DxjkL_3A.js";
import { P as Ms } from "./tweakpane-BXg6ZhiP.js";
import { e as ia } from "./styles-DjzQZscE.js";
class bs {
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
    const p = 1 / this.n, u = new Gt(), w = new Gt();
    this.lut.length = 0, this.lut.push(new Gt(this.map[0][1]));
    for (let f = 1; f < c; f++) {
      const M = f * p;
      for (let y = 0; y < this.map.length - 1; y++) if (M > this.map[y][0] && M <= this.map[y + 1][0]) {
        const S = this.map[y][0], E = this.map[y + 1][0];
        u.setHex(this.map[y][1], Kn), w.setHex(this.map[y + 1][1], Kn);
        const x = new Gt().lerpColors(u, w, (M - S) / (E - S));
        this.lut.push(x);
      }
    }
    return this.lut.push(new Gt(this.map[this.map.length - 1][1])), this;
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
    const f = 1 / this.n, M = new Gt(), y = new Gt(), S = new Gt();
    for (let E = 1; E >= 0; E -= f) for (let x = this.map.length - 1; x >= 0; x--) if (E < this.map[x][0] && E >= this.map[x - 1][0]) {
      const K = this.map[x - 1][0], ne = this.map[x][0];
      M.setHex(this.map[x - 1][1], Kn), y.setHex(this.map[x][1], Kn), S.lerpColors(M, y, (E - K) / (ne - K)), u[w * 4] = Math.round(S.r * 255), u[w * 4 + 1] = Math.round(S.g * 255), u[w * 4 + 2] = Math.round(S.b * 255), u[w * 4 + 3] = 255, w += 1;
    }
    return c.putImageData(p, 0, 0), l;
  }
}
const Co = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, _s = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], la = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: _s, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, no = Q.state("safe"), ks = Q.state("auto");
function Ss(e) {
  e = Math.max(0, Math.min(1, e));
  const l = la[no.val] ?? _s;
  for (let p = 0; p < l.length - 1; p++) {
    const [u, w, f, M] = l[p], [y, S, E, x] = l[p + 1];
    if (e <= y) {
      const K = (e - u) / (y - u);
      return [w + (S - w) * K, f + (E - f) * K, M + (x - M) * K];
    }
  }
  const c = l[l.length - 1];
  return [c[1], c[2], c[3]];
}
function ps() {
  const l = new Uint8Array(1024);
  for (let p = 0; p < 256; p++) {
    const u = p / 255, [w, f, M] = Ss(u);
    l[p * 4 + 0] = w, l[p * 4 + 1] = f, l[p * 4 + 2] = M, l[p * 4 + 3] = 255;
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
  new bs();
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
    `, side: Ct, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  Q.derive(() => {
    var _a2;
    no.val;
    const f = u.uniforms.cmap.value;
    u.uniforms.cmap.value = ps(), (_a2 = f == null ? void 0 : f.dispose) == null ? void 0 : _a2.call(f);
  });
  const w = new lt(new Se(), u);
  return w.renderOrder = -1, w.frustumCulled = false, w.userData.isShellArea = true, w.name = "__hekatan_shell_colormap", Q.derive(() => {
    w.geometry.setAttribute("position", new _t(e.val.flat(), 3));
    const f = [], M = [], y = [];
    l.val.forEach((J, be) => {
      J.length === 3 ? (f.push(J[0], J[1], J[2]), M.push(be), y.push(0)) : J.length === 4 && (f.push(J[0], J[1], J[2]), f.push(J[0], J[2], J[3]), M.push(be, be), y.push(0, 1));
    }), w.geometry.setIndex(new Ks(f, 1)), w.userData.faceToElem = M, w.userData.faceLocal = y;
    const S = c.val.filter((J) => Number.isFinite(J));
    let E, x;
    const K = Tn.val;
    if (K ? (x = K[0], E = K[1]) : [x, E] = To(S), E === x) {
      const J = Math.max(Math.abs(E) * 1e-6, 1e-9);
      E += J, x -= J;
    }
    const ne = K && K[0] > K[1], ie = Math.min(x, E), j = Math.max(x, E), F = j - ie, de = new Float32Array(c.val.length);
    for (let J = 0; J < c.val.length; J++) {
      const be = c.val[J];
      if (!Number.isFinite(be)) {
        de[J] = -1;
        continue;
      }
      const N = ((ne ? j + ie - be : be) - ie) / F;
      de[J] = Math.max(0, Math.min(1, N));
    }
    w.geometry.setAttribute("scalar", new ht(de, 1));
  }), w;
}
function da(e, l, c) {
  const p = document.createElement("div"), u = new Ms({ title: "Settings", expanded: true, container: p });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(u), p.setAttribute("id", "settings");
  const w = "hk_settingsPos";
  let f = null;
  try {
    const x = localStorage.getItem(w);
    x && (f = JSON.parse(x));
  } catch {
  }
  p.style.cssText = ["position:fixed", f ? `left:${f.left}px` : "left:8px", f ? `top:${f.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const M = () => {
    const x = p.querySelector(".tp-rotv_b");
    if (!x) {
      setTimeout(M, 200);
      return;
    }
    x.style.cursor = "move", x.style.userSelect = "none";
    let K = false, ne = 0, ie = 0, j = 0, F = 0;
    x.addEventListener("mousedown", (de) => {
      K = true, ne = de.clientX, ie = de.clientY;
      const J = p.getBoundingClientRect();
      j = J.left, F = J.top, p.style.left = `${j}px`, p.style.top = `${F}px`;
    }), window.addEventListener("mousemove", (de) => {
      if (!K) return;
      const J = de.clientX - ne, be = de.clientY - ie, _e = Math.max(0, Math.min(window.innerWidth - 40, j + J)), N = Math.max(0, Math.min(window.innerHeight - 40, F + be));
      p.style.left = `${_e}px`, p.style.top = `${N}px`;
    }), window.addEventListener("mouseup", () => {
      if (K) {
        K = false;
        try {
          localStorage.setItem(w, JSON.stringify({ left: parseFloat(p.style.left), top: parseFloat(p.style.top) }));
        } catch {
        }
      }
    });
  };
  if (M(), l == null ? void 0 : l.nodes) {
    u.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const x = u.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    x.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), x.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), x.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), x.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const K = x.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    K.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), K.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), K.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), K.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), K.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ne = u.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ne.addBinding(e.nodes, "val", { label: "Nodes" }), ne.addBinding(e.elements, "val", { label: "Elements" }), ne.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ne.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ne.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ne.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ne.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ne.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ne.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ne.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ne.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ne.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ne.addBinding(e.orientations, "val", { label: "Orientations" }), ne.addBinding(e.sections, "val", { label: "Sections" }), ne.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ne.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ne.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ne.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ne.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const x = u.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    x.addBinding(e.supports, "val", { label: "Supports" }), x.addBinding(e.loads, "val", { label: "Loads" }), x.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), x.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const x = u.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = x, x.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), x.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), x.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), x.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), x.addBinding(no, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), x.addBinding(ks, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), x.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), x.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), x.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), x.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  c && u.addBinding(e.solids, "val", { label: "Solids" });
  const y = u.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), S = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), E = () => {
    const x = window.__hekatanClipApply;
    typeof x == "function" && x();
  };
  return y.addBinding(S, "enableX", { label: "Cortar X" }).on("change", E), y.addBinding(S, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", E), y.addBinding(S, "invertX", { label: "  invertir X" }).on("change", E), y.addBinding(S, "enableY", { label: "Cortar Y" }).on("change", E), y.addBinding(S, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", E), y.addBinding(S, "invertY", { label: "  invertir Y" }).on("change", E), y.addBinding(S, "enableZ", { label: "Cortar Z" }).on("change", E), y.addBinding(S, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", E), y.addBinding(S, "invertZ", { label: "  invertir Z" }).on("change", E), p;
}
function pa(e) {
  return { gridSize: Q.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: Q.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: Q.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: Q.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: Q.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: Q.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: Q.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: Q.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: Q.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: Q.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: Q.state((e == null ? void 0 : e.nodes) ?? true), elements: Q.state((e == null ? void 0 : e.elements) ?? true), edges: Q.state((e == null ? void 0 : e.edges) ?? true), faces: Q.state((e == null ? void 0 : e.faces) ?? true), elemColumns: Q.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: Q.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: Q.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: Q.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: Q.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: Q.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: Q.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: Q.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: Q.state((e == null ? void 0 : e.orientations) ?? false), sections: Q.state((e == null ? void 0 : e.sections) ?? true), extruded: Q.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: Q.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: Q.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: Q.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: Q.state((e == null ? void 0 : e.secFloor) ?? -1), supports: Q.state((e == null ? void 0 : e.supports) ?? true), loads: Q.state((e == null ? void 0 : e.loads) ?? false), deformedShape: Q.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: Q.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: Q.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: Q.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: Q.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: Q.state((e == null ? void 0 : e.flipAxes) ?? false), solids: Q.state((e == null ? void 0 : e.solids) ?? true), custom3D: Q.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: Q.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: Q.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: Q.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function ua(e, l, c) {
  const p = dn(), u = new Qn(new Se(), new jn({ color: p.nodePoint }));
  return xs((w, f) => {
    u.material.color.setHex(f.nodePoint);
  }), u.frustumCulled = false, Q.derive(() => {
    e.nodes.val && u.geometry.setAttribute("position", new _t(l.val.flat(), 3));
  }), Q.derive(() => {
    if (c.val, l.val, !e.nodes.rawVal) return;
    const w = l.rawVal ?? [];
    let f = e.gridSize.val * 0.5;
    if (w.length >= 2) {
      const y = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
      for (const E of w) for (let x = 0; x < 3; x++) y[x] = Math.min(y[x], E[x]), S[x] = Math.max(S[x], E[x]);
      f = Math.max(S[0] - y[0], S[1] - y[1], S[2] - y[2], 0.1);
    }
    const M = 0.03 * f;
    u.material.size = M * c.rawVal;
  }), Q.derive(() => {
    u.visible = e.nodes.val;
  }), u;
}
function zo(e, l) {
  const c = dn(), p = new it();
  p.name = "hekatan-grid";
  const u = (l == null ? void 0 : l.planes) ?? ["xy"];
  let w = (l == null ? void 0 : l.majorStep) ?? 1, f = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (w <= 0 && (w = 1), f <= 0 && (f = 0.1); e / f > 500; ) f *= 2;
  for (; e / w > 100; ) w *= 2;
  const M = e / 2;
  w = Math.max(f, Math.round(w / f) * f);
  const S = new Gt(c.grid).multiplyScalar(1.3), E = new Gt(c.grid).multiplyScalar(0.8), x = (j, F, de, J) => {
    const be = [], _e = j === "xy" ? (T, G) => [T, G, 0] : j === "xz" ? (T, G) => [T, 0, G] : (T, G) => [0, T, G], N = Math.floor(M / F);
    for (let T = -N; T <= N; T++) {
      const G = T * F, Z = _e(G, -M), L = _e(G, M);
      be.push(...Z, ...L);
    }
    for (let T = -N; T <= N; T++) {
      const G = T * F, Z = _e(-M, G), L = _e(M, G);
      be.push(...Z, ...L);
    }
    const U = new Se();
    U.setAttribute("position", new _t(be, 3));
    const W = new ft({ color: de, transparent: true, opacity: J, depthWrite: false }), $ = new Ht(U, W);
    return $.name = `grid-${j}-${F === f ? "minor" : "major"}`, $;
  }, K = (j, F, de) => {
    const J = j === "xy" ? ($, T) => [$, T, 0] : j === "xz" ? ($, T) => [$, 0, T] : ($, T) => [0, $, T], be = [[-M, -M], [M, -M], [M, M], [-M, M]], _e = [];
    for (const [$, T] of be) _e.push(...J($, T));
    const N = new Se();
    N.setAttribute("position", new _t(_e, 3));
    const U = new ft({ color: F, transparent: true, opacity: de, depthWrite: false }), W = new gs(N, U);
    return W.name = `grid-${j}-border`, W.renderOrder = 1, W;
  }, ne = (j, F, de) => {
    const J = j === "xy" ? (U, W) => [U, W, 0] : j === "xz" ? (U, W) => [U, 0, W] : (U, W) => [0, U, W], be = F === "u" ? [...J(-M, 0), ...J(M, 0)] : [...J(0, -M), ...J(0, M)], _e = new Se();
    _e.setAttribute("position", new _t(be, 3));
    const N = new Ht(_e, new ft({ color: de, transparent: true, opacity: 0.45, depthWrite: false }));
    return N.name = `grid-${j}-eje-${F}`, N.renderOrder = 1, N;
  }, ie = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const j of u) {
    p.add(x(j, f, E, 0.12)), p.add(x(j, w, S, 0.4));
    const [F, de] = ie[j];
    p.add(ne(j, "u", F)), p.add(ne(j, "v", de)), p.add(K(j, S, 0.55));
  }
  return p.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: w, minorStep: f, gridSize: e, planes: [...u] }, p;
}
function fa(e, l, c, p) {
  const u = new it(), w = new Ws(0.5, 0.5, 0.5), f = new Js(0.45, 0.7, 4);
  f.rotateX(Math.PI / 2), f.translate(0, 0, -0.35);
  const M = new ut({ color: 10166822 }), y = new ut({ color: 2792847 }), S = new ut({ color: 3835647 }), E = () => {
    const ne = c.rawVal ?? [];
    if (ne.length < 2) return l.gridSize.val * 0.5;
    let ie = [1 / 0, 1 / 0, 1 / 0], j = [-1 / 0, -1 / 0, -1 / 0];
    for (const F of ne) for (let de = 0; de < 3; de++) F[de] < ie[de] && (ie[de] = F[de]), F[de] > j[de] && (j[de] = F[de]);
    return Math.max(j[0] - ie[0], j[1] - ie[1], j[2] - ie[2], 0.1);
  }, x = () => 0.08 * E(), K = () => p.rawVal;
  return Q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    u.clear();
    const ne = x();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((ie, j) => {
      const F = c.val[j];
      if (!F) return;
      const de = ie ?? [], J = (de[0] ? 1 : 0) + (de[1] ? 1 : 0) + (de[2] ? 1 : 0), be = (de[3] ? 1 : 0) + (de[4] ? 1 : 0) + (de[5] ? 1 : 0);
      let _e;
      J >= 3 && be >= 3 ? _e = new lt(w, M) : J >= 3 && be === 0 ? _e = new lt(f, y) : _e = new lt(f, S), _e.position.set(F[0], F[1], F[2]);
      const N = ne * K();
      _e.scale.set(N, N, N), u.add(_e);
    });
  }), Q.derive(() => {
    if (p.val, !l.supports.rawVal) return;
    const ie = x() * K();
    u.children.forEach((j) => j.scale.set(ie, ie, ie));
  }), Q.derive(() => {
    u.visible = l.supports.val;
  }), u;
}
function ha(e, l, c, p) {
  const u = new it();
  u.name = "loadsGroup";
  function w(f) {
    if (f.length < 2) return 0.12 * l.gridSize.rawVal;
    const M = [1 / 0, 1 / 0, 1 / 0], y = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of f) for (let x = 0; x < 3; x++) M[x] = Math.min(M[x], E[x]), y[x] = Math.max(y[x], E[x]);
    return 0.08 * Math.max(y[0] - M[0], y[1] - M[1], y[2] - M[2], 0.1);
  }
  return Q.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    u.children.forEach((x) => x.dispose()), u.clear();
    const f = c.val, M = w(f), y = 240, S = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((x, K) => {
      f[K] && x.slice(0, 3).some((ne) => Math.abs(ne) > 1e-15) && S.push(K);
    });
    let E = S;
    if (S.length > y) {
      const x = S.map(($) => f[$][0]), K = S.map(($) => f[$][1]), ne = Math.min(...x), ie = Math.max(...x), j = Math.min(...K), F = Math.max(...K), de = S.map(($) => f[$][2]), J = Math.max(1e-6, (Math.max(...de) - Math.min(...de)) / 40), be = ($) => Math.round($ / J), _e = new Set(de.map(be)), N = Math.max(4, Math.floor(y / Math.max(1, _e.size))), U = Math.max(2, Math.round(Math.sqrt(N))), W = /* @__PURE__ */ new Map();
      for (const $ of S) {
        const T = ie - ne < 1e-9 ? 0 : (f[$][0] - ne) / (ie - ne), G = F - j < 1e-9 ? 0 : (f[$][1] - j) / (F - j), Z = Math.min(U - 1, Math.floor(T * U)), L = Math.min(U - 1, Math.floor(G * U)), se = `${Z},${L},${be(f[$][2])}`, he = Math.hypot(T * U - (Z + 0.5), G * U - (L + 0.5)), pe = W.get(se);
        (!pe || he < pe.d) && W.set(se, { i: $, d: he });
      }
      E = [...W.values()].map(($) => $.i);
    }
    for (const x of E) {
      const K = e.nodeInputs.val.loads.get(x), ne = f[x];
      if (!ne) continue;
      const ie = new k(...K.slice(0, 3));
      if (ie.lengthSq() < 1e-30) continue;
      ie.normalize();
      const j = new cn(ie, new k(...ne), 1, 15637248, 0.3, 0.3), F = M * p.rawVal;
      j.scale.set(F, F, F), u.add(j);
    }
  }), Q.derive(() => {
    if (p.val, !l.loads.rawVal) return;
    const M = w(c.rawVal) * p.rawVal;
    u.children.forEach((y) => y.scale.set(M, M, M));
  }), Q.derive(() => {
    u.visible = l.loads.val;
  }), u;
}
function ma(e, l, c) {
  const p = new it();
  return Q.derive(() => {
    if (!e.nodesIndexes.val) return;
    p.children.forEach((w) => w.dispose()), p.clear();
    const u = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((w, f) => {
      const M = new Pt(`${f}`);
      M.position.set(...w), M.updateScale(u * c.rawVal), p.add(M);
    });
  }), Q.derive(() => {
    if (c.val, !e.nodesIndexes.rawVal) return;
    const u = 0.05 * e.gridSize.val * 0.6;
    p.children.forEach((w) => w.updateScale(u * c.rawVal));
  }), Q.derive(() => {
    p.visible = e.nodesIndexes.val;
  }), p;
}
function wa(e, l, c, p) {
  const u = new it();
  return Q.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    u.children.forEach((f) => f.dispose()), u.clear();
    const w = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((f, M) => {
      const y = new Pt(`${M}`, void 0, "#001219");
      y.position.set(...ya(f.map((S) => c.rawVal[S]))), y.updateScale(w * p.rawVal), u.add(y);
    });
  }), Q.derive(() => {
    if (p.val, !l.elementsIndexes.rawVal) return;
    const w = 0.05 * l.gridSize.val * 0.6;
    u.children.forEach((f) => f.updateScale(w * p.rawVal));
  }), Q.derive(() => {
    u.visible = l.elementsIndexes.val;
  }), u;
}
function ya(e) {
  const l = e.reduce((p, u) => [p[0] + u[0], p[1] + u[1], p[2] + u[2]], [0, 0, 0]), c = e.length;
  return [l[0] / c, l[1] / c, l[2] / c];
}
function us(e, l) {
  const c = new it(), p = Math.min(0.05 * e, 0.6), u = dn(), w = new Pt("X", "red", "transparent"), f = new Pt(l ? "Z" : "Y", "green", "transparent"), M = new Pt(l ? "Y" : "Z", "blue", "transparent"), y = new cn(new k(1, 0, 0), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), S = new cn(new k(0, 1, 0), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), E = new cn(new k(0, 0, 1), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2);
  return w.position.set(1.3 * p, 0, 0), f.position.set(0, 1.3 * p, 0), M.position.set(0, 0, 1.3 * p), w.updateScale(0.4 * p), f.updateScale(0.4 * p), M.updateScale(0.4 * p), y.scale.set(p, p, p), S.scale.set(p, p, p), E.scale.set(p, p, p), c.add(y, S, E, w, f, M), c;
}
function oo(e, l) {
  const c = new k(...e), u = new k(...l).clone().sub(c), w = u.length(), f = u.dot(new k(1, 0, 0)) / w, M = u.dot(new k(0, 1, 0)) / w, y = u.dot(new k(0, 0, 1)) / w, S = Math.sqrt(f ** 2 + M ** 2);
  let E = new ko().fromArray([[f, M, y], [-M / S, f / S, 0], [-f * y / S, -M * y / S, S]].flat());
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
  const p = Vn([l, c]), u = Vn([e, c]), w = Vn([e, l]), f = new k(...p).sub(new k(...u)).normalize(), M = new k(...c).sub(new k(...w)).normalize(), y = f.clone().cross(M).normalize(), S = y.clone().cross(f).normalize();
  return new Vo().makeBasis(f, S, y);
}
function ga(e, l, c, p) {
  const u = new it(), w = new Se(), f = new ft({ vertexColors: true }), M = [0, 0, 0], y = [1, 0, 0], S = [0, 1, 0], E = [0, 0, 1];
  w.setAttribute("position", new _t([...M, ...y, ...M, ...S, ...M, ...E], 3));
  const x = [255, 0, 0], K = [0, 255, 0], ne = [0, 0, 255];
  return w.setAttribute("color", new _t([...x, ...x, ...K, ...K, ...ne, ...ne], 3)), Q.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (u.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((ie) => {
      const j = new Ht(w, f), F = c.rawVal[ie[0]], de = c.rawVal[ie[1]];
      if (ie.length === 2 && (j.position.set(...Ao(F, de)), j.rotation.setFromRotationMatrix(oo(F, de))), ie.length === 3) {
        const _e = c.rawVal[ie[2]];
        j.position.set(...Vn([F, de, _e])), j.rotation.setFromRotationMatrix(xa(F, de, _e));
      }
      const be = 0.05 * l.gridSize.rawVal * 0.75 * p.rawVal;
      j.scale.set(be, be, be), u.add(j);
    }));
  }), Q.derive(() => {
    if (p.val, !l.orientations.rawVal) return;
    const j = 0.05 * l.gridSize.val * 0.75 * p.rawVal;
    u.children.forEach((F) => F.scale.set(j, j, j));
  }), Q.derive(() => {
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
function Ma(e, l, c, p) {
  const u = new it(), w = new it();
  u.add(w);
  function f(U, W) {
    const $ = U / 2, T = W / 2, G = new Float32Array([0, -$, -T, 0, $, -T, 0, $, T, 0, -$, -T, 0, $, T, 0, -$, T]), Z = new Se();
    Z.setAttribute("position", new ht(G, 3));
    const L = new Float32Array([0, -$, -T, 0, $, -T, 0, $, T, 0, -$, T, 0, -$, -T]), se = new Se();
    return se.setAttribute("position", new ht(L, 3)), { fill: Z, outline: se };
  }
  function M(U, W = 24) {
    const $ = U / 2, T = new Float32Array(W * 9);
    for (let se = 0; se < W; se++) {
      const he = se / W * Math.PI * 2, pe = (se + 1) / W * Math.PI * 2;
      T[se * 9] = 0, T[se * 9 + 1] = 0, T[se * 9 + 2] = 0, T[se * 9 + 3] = 0, T[se * 9 + 4] = $ * Math.cos(he), T[se * 9 + 5] = $ * Math.sin(he), T[se * 9 + 6] = 0, T[se * 9 + 7] = $ * Math.cos(pe), T[se * 9 + 8] = $ * Math.sin(pe);
    }
    const G = new Se();
    G.setAttribute("position", new ht(T, 3));
    const Z = new Float32Array((W + 1) * 3);
    for (let se = 0; se <= W; se++) {
      const he = se / W * Math.PI * 2;
      Z[se * 3] = 0, Z[se * 3 + 1] = $ * Math.cos(he), Z[se * 3 + 2] = $ * Math.sin(he);
    }
    const L = new Se();
    return L.setAttribute("position", new ht(Z, 3)), { fill: G, outline: L };
  }
  function y(U, W, $, T) {
    const G = $ ?? W * 0.08, Z = T ?? U * 0.07, L = U / 2, se = W / 2, he = se - G, pe = Z / 2, le = [];
    function Y(ge, $e, ve, Ne) {
      le.push(0, ge, $e, 0, ve, $e, 0, ve, Ne, 0, ge, $e, 0, ve, Ne, 0, ge, Ne);
    }
    Y(-L, -se, L, -he), Y(-pe, -he, pe, he), Y(-L, he, L, se);
    const me = new Se();
    me.setAttribute("position", new ht(new Float32Array(le), 3));
    const O = new Float32Array([0, -L, -se, 0, L, -se, 0, L, -he, 0, pe, -he, 0, pe, he, 0, L, he, 0, L, se, 0, -L, se, 0, -L, he, 0, -pe, he, 0, -pe, -he, 0, -L, -he, 0, -L, -se]), ye = new Se();
    return ye.setAttribute("position", new ht(O, 3)), { fill: me, outline: ye };
  }
  function S(U, W, $) {
    const T = U / 2, G = W / 2, Z = T - $, L = G - $, se = [];
    function he(me, O, ye, ge) {
      se.push(0, me, O, 0, ye, O, 0, ye, ge, 0, me, O, 0, ye, ge, 0, me, ge);
    }
    he(-T, -G, T, -L), he(-T, L, T, G), he(-T, -L, -Z, L), he(Z, -L, T, L);
    const pe = new Se();
    pe.setAttribute("position", new ht(new Float32Array(se), 3));
    const le = new Float32Array([0, -T, -G, 0, T, -G, 0, T, -G, 0, T, G, 0, T, G, 0, -T, G, 0, -T, G, 0, -T, -G, 0, -Z, -L, 0, Z, -L, 0, Z, -L, 0, Z, L, 0, Z, L, 0, -Z, L, 0, -Z, L, 0, -Z, -L]), Y = new Se();
    return Y.setAttribute("position", new ht(le, 3)), { fill: pe, outline: Y };
  }
  function E(U, W, $) {
    const T = U / 2, G = W / 2, Z = T - $, L = G - $, se = new Se(), he = new Float32Array([0, -Z, -L, 0, Z, -L, 0, Z, L, 0, -Z, -L, 0, Z, L, 0, -Z, L]);
    se.setAttribute("position", new ht(he, 3));
    const pe = [];
    function le(ye, ge, $e, ve) {
      pe.push(0, ye, ge, 0, $e, ge, 0, $e, ve, 0, ye, ge, 0, $e, ve, 0, ye, ve);
    }
    le(-T, -G, T, -L), le(-T, L, T, G), le(-T, -L, -Z, L), le(Z, -L, T, L);
    const Y = new Se();
    Y.setAttribute("position", new ht(new Float32Array(pe), 3));
    const me = new Float32Array([0, -T, -G, 0, T, -G, 0, T, -G, 0, T, G, 0, T, G, 0, -T, G, 0, -T, G, 0, -T, -G, 0, -Z, -L, 0, Z, -L, 0, Z, -L, 0, Z, L, 0, Z, L, 0, -Z, L, 0, -Z, L, 0, -Z, -L]), O = new Se();
    return O.setAttribute("position", new ht(me, 3)), { concFill: se, steelFillGeom: Y, outline: O };
  }
  function x(U, W, $) {
    const T = [], G = [[0, -U / 2, -W / 2], [0, -U / 2 + $, -W / 2], [0, -U / 2 + $, W / 2 - $], [0, U / 2, W / 2 - $], [0, U / 2, W / 2], [0, -U / 2, W / 2]], Z = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of Z) T.push(...G[pe]);
    const L = new Se();
    L.setAttribute("position", new ht(new Float32Array(T), 3));
    const se = [];
    for (let pe = 0; pe < G.length; pe++) {
      const le = (pe + 1) % G.length;
      se.push(...G[pe], ...G[le]);
    }
    const he = new Se();
    return he.setAttribute("position", new ht(new Float32Array(se), 3)), { fill: L, outline: he };
  }
  function K(U, W, $, T) {
    const G = T / 2, Z = [], L = [[0, -U - G, -W / 2], [0, -$ - G, -W / 2], [0, -$ - G, W / 2 - $], [0, -G, W / 2 - $], [0, -G, W / 2], [0, -U - G, W / 2]], se = [[0, G, -W / 2], [0, G + $, -W / 2], [0, G + $, W / 2 - $], [0, U + G, W / 2 - $], [0, U + G, W / 2], [0, G, W / 2]], he = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const me of he) Z.push(...L[me]);
    for (const me of he) Z.push(...se[me]);
    const pe = new Se();
    pe.setAttribute("position", new ht(new Float32Array(Z), 3));
    const le = [];
    for (const me of [L, se]) for (let O = 0; O < me.length; O++) {
      const ye = (O + 1) % me.length;
      le.push(...me[O], ...me[ye]);
    }
    const Y = new Se();
    return Y.setAttribute("position", new ht(new Float32Array(le), 3)), { fill: pe, outline: Y };
  }
  function ne(U, W, $, T) {
    const G = W / 2, Z = U, L = [[0, -Z, -G], [0, -Z, -G + $], [0, -T, -G + $], [0, -T, G - $], [0, -Z, G - $], [0, -Z, G], [0, 0, G], [0, 0, -G]], se = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], he = [];
    for (const me of se) he.push(...L[me]);
    const pe = new Se();
    pe.setAttribute("position", new ht(new Float32Array(he), 3));
    const le = [];
    for (let me = 0; me < L.length; me++) {
      const O = (me + 1) % L.length;
      le.push(...L[me], ...L[O]);
    }
    const Y = new Se();
    return Y.setAttribute("position", new ht(new Float32Array(le), 3)), { fill: pe, outline: Y };
  }
  function ie(U, W, $, T, G) {
    const Z = W / 2, L = G / 2, se = [], he = [[0, -U, -Z], [0, -U, -Z + $], [0, -L - T, -Z + $], [0, -L - T, Z - $], [0, -U, Z - $], [0, -U, Z], [0, -L, Z], [0, -L, -Z]], pe = he.map((ye) => [ye[0], -ye[1], ye[2]]), le = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const ye of le) se.push(...he[ye]);
    for (const ye of le) se.push(...pe[ye]);
    const Y = new Se();
    Y.setAttribute("position", new ht(new Float32Array(se), 3));
    const me = [];
    for (const ye of [he, pe]) for (let ge = 0; ge < ye.length; ge++) {
      const $e = (ge + 1) % ye.length;
      me.push(...ye[ge], ...ye[$e]);
    }
    const O = new Se();
    return O.setAttribute("position", new ht(new Float32Array(me), 3)), { fill: Y, outline: O };
  }
  function j(U, W, $, T) {
    const G = U / 2, Z = W / 2, L = T / 2, se = [[0, -L, -Z], [0, L, -Z], [0, L, Z - $], [0, G, Z - $], [0, G, Z], [0, -G, Z], [0, -G, Z - $], [0, -L, Z - $]], he = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], pe = [];
    for (const O of he) pe.push(...se[O]);
    const le = new Se();
    le.setAttribute("position", new ht(new Float32Array(pe), 3));
    const Y = [];
    for (let O = 0; O < se.length; O++) {
      const ye = (O + 1) % se.length;
      Y.push(...se[O], ...se[ye]);
    }
    const me = new Se();
    return me.setAttribute("position", new ht(new Float32Array(Y), 3)), { fill: le, outline: me };
  }
  function F(U, W, $ = 24) {
    const T = U / 2, G = T - W, Z = [];
    for (let pe = 0; pe < $; pe++) {
      const le = pe / $ * Math.PI * 2, Y = (pe + 1) / $ * Math.PI * 2, me = Math.cos(le), O = Math.sin(le), ye = Math.cos(Y), ge = Math.sin(Y);
      Z.push(0, T * me, T * O, 0, T * ye, T * ge, 0, G * ye, G * ge), Z.push(0, T * me, T * O, 0, G * ye, G * ge, 0, G * me, G * O);
    }
    const L = new Se();
    L.setAttribute("position", new ht(new Float32Array(Z), 3));
    const se = [];
    for (let pe = 0; pe < $; pe++) {
      const le = pe / $ * Math.PI * 2, Y = (pe + 1) / $ * Math.PI * 2;
      se.push(0, T * Math.cos(le), T * Math.sin(le), 0, T * Math.cos(Y), T * Math.sin(Y)), se.push(0, G * Math.cos(le), G * Math.sin(le), 0, G * Math.cos(Y), G * Math.sin(Y));
    }
    const he = new Se();
    return he.setAttribute("position", new ht(new Float32Array(se), 3)), { fill: L, outline: he };
  }
  const de = new ut({ color: 52479, transparent: true, opacity: 0.35, side: Ct, depthWrite: false }), J = new ft({ color: 52479 }), be = new ut({ color: 16750848, transparent: true, opacity: 0.4, side: Ct, depthWrite: false }), _e = new ft({ color: 16750848 });
  function N(U, W) {
    const $ = Math.abs(W[0] - U[0]), T = Math.abs(W[1] - U[1]), G = Math.abs(W[2] - U[2]);
    return G > $ && G > T || T > $ && T > G;
  }
  return Q.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const U = l.secColumns.rawVal, W = l.secBeams.rawVal;
    if (!U && !W) {
      u.children.forEach((L) => {
        L instanceof Pt && L.dispose();
      }), u.clear();
      return;
    }
    u.children.forEach((L) => {
      L instanceof Pt && L.dispose();
    }), u.clear();
    const $ = (_a2 = e.elements) == null ? void 0 : _a2.val, T = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!$ || !T) return;
    const G = T.sectionShapes, Z = l.secFloor.rawVal;
    $.forEach((L, se) => {
      if (L.length !== 2) return;
      const he = c.rawVal[L[0]], pe = c.rawVal[L[1]];
      if (!he || !pe) return;
      const le = N(he, pe);
      if (le && !U || !le && !W) return;
      if (Z >= 0) {
        const ge = Math.min(he[1], pe[1]);
        Math.max(he[1], pe[1]);
        const $e = l.gridSize.rawVal || 3;
        if (Math.floor(ge / $e + 0.01) !== Z) return;
      }
      const Y = G == null ? void 0 : G.get(se);
      if (!Y) return;
      const me = [(he[0] + pe[0]) / 2, (he[1] + pe[1]) / 2, (he[2] + pe[2]) / 2], O = oo(he, pe);
      if (Y.type === "CFT") {
        const ge = E(Y.b, Y.h, Y.tw ?? Y.b * 0.05), $e = new lt(ge.concFill, de);
        $e.position.set(...me), $e.rotation.setFromRotationMatrix(O), u.add($e);
        const ve = new lt(ge.steelFillGeom, be);
        ve.position.set(...me), ve.rotation.setFromRotationMatrix(O), u.add(ve);
        const Ne = new St(ge.outline, _e);
        Ne.position.set(...me), Ne.rotation.setFromRotationMatrix(O), u.add(Ne);
      } else {
        let ge, $e, ve;
        switch (Y.type) {
          case "rect":
            ge = f(Y.b, Y.h), $e = de, ve = J;
            break;
          case "circ":
            ge = M(Y.d), $e = de, ve = J;
            break;
          case "I":
            ge = y(Y.b, Y.h, Y.tf, Y.tw), $e = be, ve = _e;
            break;
          case "HSS":
            ge = S(Y.b, Y.h, Y.tw ?? Y.b * 0.05), $e = be, ve = _e;
            break;
          case "CFT":
            ge = E(Y.b, Y.h, Y.tw ?? Y.b * 0.05), $e = be, ve = _e;
            break;
          case "L":
            ge = x(Y.b ?? Y.h, Y.h, Y.t ?? Y.tw ?? 3e-3), $e = be, ve = _e;
            break;
          case "2L":
            ge = K(Y.b ?? Y.h, Y.h, Y.t ?? Y.tw ?? 3e-3, Y.dis ?? 0.01), $e = be, ve = _e;
            break;
          case "C":
          case "coldC":
            ge = ne(Y.b, Y.h, Y.tf ?? Y.t ?? 3e-3, Y.tw ?? Y.t ?? 3e-3), $e = be, ve = _e;
            break;
          case "2C":
            ge = ie(Y.b, Y.h, Y.tf ?? 5e-3, Y.tw ?? 5e-3, Y.dis ?? 0.01), $e = be, ve = _e;
            break;
          case "T":
            ge = j(Y.b, Y.h, Y.tf ?? 0.01, Y.tw ?? 6e-3), $e = be, ve = _e;
            break;
          case "pipe":
            ge = F(Y.d, Y.tw ?? Y.d * 0.05), $e = be, ve = _e;
            break;
          default:
            return;
        }
        const Ne = new lt(ge.fill, $e);
        Ne.position.set(...me), Ne.rotation.setFromRotationMatrix(O), u.add(Ne);
        const Ke = new St(ge.outline, ve);
        Ke.position.set(...me), Ke.rotation.setFromRotationMatrix(O), u.add(Ke);
      }
      const ye = va(Y);
      if (ye) {
        const $e = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(Y.type) ? "#ff9900" : "#00ccff", ve = new Pt(ye, $e, "transparent");
        ve.position.set(me[0], me[1], me[2]);
        const Ne = 0.05 * l.gridSize.rawVal * 0.5;
        ve.updateScale(Ne * ((p == null ? void 0 : p.rawVal) ?? 1)), w.add(ve);
      }
    });
  }), p && Q.derive(() => {
    if (p.val, !l.sections.rawVal) return;
    const U = 0.05 * l.gridSize.val * 0.5;
    w.children.forEach((W) => {
      W instanceof Pt && W.updateScale(U * p.rawVal);
    });
  }), Q.derive(() => {
    u.visible = l.sections.val;
  }), Q.derive(() => {
    w.visible = l.sectionLabels.val;
  }), u;
}
function ba(e) {
  if (!e) return null;
  const l = e.type, c = (E, x) => [E, x], p = (E, x) => [c(-E / 2, -x / 2), c(E / 2, -x / 2), c(E / 2, x / 2), c(-E / 2, x / 2)], u = (E, x = 24) => {
    const K = E / 2, ne = [];
    for (let ie = 0; ie < x; ie++) {
      const j = 2 * Math.PI * ie / x;
      ne.push(c(K * Math.cos(j), K * Math.sin(j)));
    }
    return ne;
  }, w = e.b ?? 0, f = e.h ?? 0, M = e.d ?? 0, y = e.tw ?? e.t ?? 0, S = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return w && f ? { contorno: p(w, f) } : null;
    case "circ":
      return M ? { contorno: u(M) } : null;
    case "pipe":
      return M && y ? { contorno: u(M), huecos: [u(M - 2 * y).reverse()] } : null;
    case "HSS":
      return w && f && y ? { contorno: p(w, f), huecos: [p(w - 2 * y, f - 2 * (S || y)).reverse()] } : null;
    case "CFT":
      return w && f ? { contorno: p(w, f) } : null;
    case "I":
      return w && f && y && S ? { contorno: [c(-w / 2, -f / 2), c(w / 2, -f / 2), c(w / 2, -f / 2 + S), c(y / 2, -f / 2 + S), c(y / 2, f / 2 - S), c(w / 2, f / 2 - S), c(w / 2, f / 2), c(-w / 2, f / 2), c(-w / 2, f / 2 - S), c(-y / 2, f / 2 - S), c(-y / 2, -f / 2 + S), c(-w / 2, -f / 2 + S)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return w && f && y && S ? { contorno: [c(-w / 2, -f / 2), c(w / 2, -f / 2), c(w / 2, -f / 2 + S), c(-w / 2 + y, -f / 2 + S), c(-w / 2 + y, f / 2 - S), c(w / 2, f / 2 - S), c(w / 2, f / 2), c(-w / 2, f / 2)] } : null;
    case "T":
      return w && f && y && S ? { contorno: [c(-y / 2, -f / 2), c(y / 2, -f / 2), c(y / 2, f / 2 - S), c(w / 2, f / 2 - S), c(w / 2, f / 2), c(-w / 2, f / 2), c(-w / 2, f / 2 - S), c(-y / 2, f / 2 - S)] } : null;
    case "L":
    case "2L":
      return w && f && y ? { contorno: [c(-w / 2, -f / 2), c(w / 2, -f / 2), c(w / 2, -f / 2 + y), c(-w / 2 + y, -f / 2 + y), c(-w / 2 + y, f / 2), c(-w / 2, f / 2)] } : null;
    default:
      return w && f ? { contorno: p(w, f) } : M ? { contorno: u(M) } : null;
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
  const p = new it();
  p.name = "extrusion";
  const u = new So({ color: 8369151, transparent: true, opacity: 0.92, side: Ct }), w = new So({ color: 12623968, transparent: true, opacity: 0.85, side: Ct }), f = new So({ color: 11583173, transparent: true, opacity: 0.85, side: Ct }), M = new it();
  M.add(new vs(16777215, 0.55));
  const y = new to(16777215, 0.75);
  y.position.set(30, 25, 40);
  const S = new to(16777215, 0.35);
  S.position.set(-25, -20, 15), M.add(y, S);
  let E = 0;
  return Q.derive(() => {
    var _a2, _b, _c, _d, _e;
    const x = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++E, on: x }, p.visible = x;
    for (const J of [...p.children]) J !== M && (p.remove(J), (_c = (_b = J.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (p.children.includes(M) || p.add(M), !x) return;
    const K = c.val ?? [], ne = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], ie = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, j = ie.sectionShapes ?? /* @__PURE__ */ new Map(), F = ie.thicknesses ?? /* @__PURE__ */ new Map();
    let de = "";
    try {
      ne.forEach((J, be) => {
        var _a3, _b2, _c2;
        if (J.length === 2) {
          let _e2 = ba(j.get(be)), N = true;
          if (_e2 || (_e2 = _a((_a3 = ie.areas) == null ? void 0 : _a3.get(be), (_b2 = ie.momentsOfInertiaY) == null ? void 0 : _b2.get(be), (_c2 = ie.momentsOfInertiaZ) == null ? void 0 : _c2.get(be)), N = false), !_e2) return;
          const U = K[J[0]], W = K[J[1]];
          if (!U || !W) return;
          const $ = Math.hypot(W[0] - U[0], W[1] - U[1], W[2] - U[2]);
          if ($ < 1e-9) return;
          const T = new Os(ka(_e2), { depth: $, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new Vo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const G = new lt(T, N ? u : w);
          G.position.set(U[0], U[1], U[2]), G.rotation.setFromRotationMatrix(oo(U, W)), p.add(G);
          return;
        }
        if (J.length === 3 || J.length === 4) {
          const _e2 = F.get(be);
          if (!_e2 || _e2 <= 0) return;
          const N = J.map((O) => K[O]).filter(Boolean);
          if (N.length < 3) return;
          const U = [N[1][0] - N[0][0], N[1][1] - N[0][1], N[1][2] - N[0][2]], W = [N[2][0] - N[0][0], N[2][1] - N[0][1], N[2][2] - N[0][2]], $ = U[1] * W[2] - U[2] * W[1], T = U[2] * W[0] - U[0] * W[2], G = U[0] * W[1] - U[1] * W[0], Z = Math.hypot($, T, G);
          if (Z < 1e-12) return;
          const L = [$ / Z, T / Z, G / Z], se = [], he = (O) => N.map((ye) => [ye[0] + L[0] * O, ye[1] + L[1] * O, ye[2] + L[2] * O]), pe = he(+_e2 / 2), le = he(-_e2 / 2), Y = (O, ye, ge) => se.push(...O, ...ye, ...ge);
          for (const O of [pe, le]) Y(O[0], O[1], O[2]), O.length === 4 && Y(O[0], O[2], O[3]);
          for (let O = 0; O < N.length; O++) {
            const ye = (O + 1) % N.length;
            Y(pe[O], le[O], le[ye]), Y(pe[O], le[ye], pe[ye]);
          }
          const me = new Se();
          me.setAttribute("position", new _t(se, 3)), me.computeVertexNormals(), p.add(new lt(me, f));
        }
      });
    } catch (J) {
      de = String((J == null ? void 0 : J.message) ?? J);
    }
    globalThis.__extrusionDebug = { corridas: E, on: x, fallo: de, nElementos: ne.length, nFormas: j.size, nEspesores: F.size, mallas: p.children.length - 1 };
  }), p;
}
class Wn extends it {
  constructor(l, c, p, u, w, f, M) {
    super();
    const y = new En().moveTo(0, 0).lineTo(0, f[1]).lineTo(p, f[1]).lineTo(p, 0).lineTo(0, 0), S = y.getPoints(), E = new Se().setFromPoints(S);
    this.lines = new St(E, new ft({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), M && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const x = new eo(y), K = new ut({ color: f[1] > 0 ? 24435 : 11411474, side: Ct });
    this.mesh = new lt(x, K), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), M && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Pt(`${w[1].toFixed(4)}`), this.normalizedResult = f, this.textPosition = Vn([l, c]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(u), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class fs extends it {
  constructor(l, c, p, u, w, f, M) {
    super();
    const y = w[0] * p / (w[0] + w[1]), S = w[0] * w[1] > 0;
    if (this.text = new Pt(`${w[0].toFixed(4)}`), this.text2 = new Pt(`${(w[1] * -1).toFixed(4)}`), this.normalizedResult = f, this.textPosition = Ao(l, c), this.text2Position = Ao(c, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(u), this.text2.rotation.setFromRotationMatrix(u), this.add(this.text, this.text2), S) {
      const E = new En().moveTo(0, 0).lineTo(0, f[0]).lineTo(y, 0).lineTo(0, 0), x = new En().moveTo(y, 0).lineTo(p, -f[1]).lineTo(p, 0).lineTo(y, 0), K = E.getPoints(), ne = x.getPoints(), ie = new Se().setFromPoints(K), j = new Se().setFromPoints(ne), F = new ft({ color: dn().resultOutline });
      this.lines = new St(ie, F), this.lines2 = new St(j, F), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), this.lines2.rotation.setFromRotationMatrix(u), M && this.lines.rotateX(Math.PI / 2), M && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const de = new eo(E), J = new eo(x), be = new ut({ color: f[0] > 0 ? 24435 : 11411474, side: Ct }), _e = new ut({ color: -f[1] > 0 ? 24435 : 11411474, side: Ct });
      this.mesh = new lt(de, be), this.mesh2 = new lt(J, _e), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), this.mesh2.rotation.setFromRotationMatrix(u), M && this.mesh.rotateX(Math.PI / 2), M && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const E = new En().moveTo(0, 0).lineTo(0, f[0]).lineTo(p, -f[1]).lineTo(p, 0).lineTo(0, 0), x = E.getPoints(), K = new Se().setFromPoints(x);
      this.lines = new St(K, new ft({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), M && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ne = new eo(E), ie = new ut({ color: f[0] > 0 ? 24435 : 11411474, side: Ct });
      this.mesh = new lt(ne, ie), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), M && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
    const M = c.rawVal;
    if (!(M == null ? void 0 : M.length)) return 0.05 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
    for (const x of M) for (let K = 0; K < 3; K++) x[K] < y[K] && (y[K] = x[K]), x[K] > S[K] && (S[K] = x[K]);
    const E = Math.hypot(S[0] - y[0], S[1] - y[1], S[2] - y[2]);
    return !isFinite(E) || E <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * E;
  }, w = new it(), f = { normals: Wn, shearsY: Wn, shearsZ: Wn, torsions: Wn, bendingsY: fs, bendingsZ: fs };
  return Q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, c.val, l.frameResults.val == "none") return;
    w.children.forEach((y) => y.dispose()), w.clear();
    const M = Ps[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[M]) == null ? void 0 : _b.forEach((y, S) => {
      var _a3, _b2;
      const E = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[S]) ?? [0, 1], x = c.rawVal[E[0]], K = c.rawVal[E[1]];
      if (!x || !K) return;
      const ne = new k(...K).distanceTo(new k(...x)), ie = Ca((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[M]), j = y == null ? void 0 : y.map((J) => J / (ie === 0 ? 1 : ie)), F = oo(x, K), de = new f[M](x, K, ne, F, y ?? [0, 0], j ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(M));
      de.updateScale(u() * p.rawVal), w.add(de);
    });
  }), Q.derive(() => {
    if (p.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const M = u();
    w.children.forEach((y) => y.updateScale(M * p.rawVal));
  }), Q.derive(() => {
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
class za extends it {
  constructor(l, c, p) {
    super();
    const u = c === $o.reactions;
    p[0] && (this.xText1 = new Pt(`${u ? "Fx" : "Dx"}: ` + p[0].toFixed(4))), p[3] && (this.xText2 = new Pt(`${u ? "Mx" : "Rx"}: ` + p[3].toFixed(4))), p[1] && (this.yText1 = new Pt(`${u ? "Fy" : "Dy"}: ` + p[1].toFixed(4))), p[4] && (this.yText2 = new Pt(`${u ? "My" : "Ry"}: ` + p[4].toFixed(4))), p[2] && (this.zText1 = new Pt(`${u ? "Fz" : "Dz"}: ` + p[2].toFixed(4))), p[5] && (this.zText2 = new Pt(`${u ? "Mz" : "Rz"}: ` + p[5].toFixed(4))), (p[0] || p[3]) && (this.xArrow = new cn(new k(1, 0, 0), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[1] || p[4]) && (this.yArrow = new cn(new k(0, 1, 0), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[2] || p[5]) && (this.zArrow = new cn(new k(0, 0, 1), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
  const u = new it();
  return Q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    u.children.forEach((M) => M.dispose()), u.clear();
    const w = $o[l.nodeResults.rawVal], f = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[w]) == null ? void 0 : _b.forEach((M, y) => {
      const S = new za(c.rawVal[y], w, M ?? [0, 0, 0, 0, 0, 0]);
      S.updateScale(f * p.rawVal), u.add(S);
    });
  }), Q.derive(() => {
    if (p.val, l.nodeResults.rawVal == "none") return;
    const w = 0.05 * l.gridSize.val;
    u.children.forEach((f) => f.updateScale(w * p.rawVal));
  }), Q.derive(() => {
    u.visible = l.nodeResults.val != "none";
  }), u;
}
function Aa({ drawingObj: e, gridObj: l, scene: c, getActiveCamera: p, controls: u, gridSize: w, derivedDisplayScale: f, rendererElm: M, viewerRender: y }) {
  const S = new js(), E = new ea(), x = (t) => {
    const o = M.getBoundingClientRect(), s = t.clientX - o.left, n = t.clientY - o.top, a = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const h = a / 2;
      if (s >= h) return E.x = (s - h) / h * 2 - 1, E.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? p();
      E.x = s / h * 2 - 1;
    } else E.x = s / a * 2 - 1;
    return E.y = -(n / i) * 2 + 1, p();
  }, K = new lt(new jt(1e4, 1e4), new ut({ side: Ct, transparent: true, opacity: 0, depthWrite: false }));
  K.visible = true, K.frustumCulled = false, c.add(K);
  const ne = (t, o, s) => {
    const n = new lt(new jt(1e4, 1e4), new ut({ side: Ct, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, s), n.visible = false, n.frustumCulled = false, c.add(n), n;
  }, ie = ne(Math.PI / 2, 0, 0), j = ne(0, Math.PI / 2, 0);
  let F = false;
  const de = () => {
    if (F) return S.intersectObjects([K], false);
    if (ie.visible = !!window.__hekatanGridPlaneXZ, j.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ie.visible) {
      const s = S.intersectObjects([Ie, nt, Be], false);
      if (s.length > 0) return s;
    }
    const o = [K];
    return ie.visible && o.push(ie), j.visible && o.push(j), Jt.visible && un.length > 0 && o.push(...un), S.intersectObjects(o, false);
  }, J = new Qn(new Se(), new jn()), be = new Qn(new Se(), new jn({ color: "gray", sizeAttenuation: false, size: 6 })), _e = new Qn(new Se(), new jn({ color: "orange", sizeAttenuation: false, size: 5 }));
  c.add(_e);
  const N = document.createElement("input");
  N.id = "hk-rubber-label", N.type = "text", N.spellcheck = false, N.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, N.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(N);
  let U = null, W = null, $ = false;
  const T = new k(), G = (t, o, s, n, a, i) => {
    const r = n - t, h = a - o, m = i - s, g = Math.hypot(r, h, m);
    if (g < 0.01) {
      N.style.display = "none";
      return;
    }
    U = [t, o, s], W = [r / g, h / g, m / g], T.set((t + n) / 2, (o + a) / 2, (s + i) / 2), T.project(p());
    const b = M.getBoundingClientRect(), _ = b.left + (T.x * 0.5 + 0.5) * b.width, d = b.top + (-T.y * 0.5 + 0.5) * b.height;
    if (N.style.left = _ + "px", N.style.top = d + "px", N.style.display = "block", !$) {
      if (N.value = `${g.toFixed(2)} m`, document.activeElement !== N) {
        const V = document.activeElement;
        V && (V.tagName === "INPUT" || V.tagName === "TEXTAREA") && V !== N || N.focus({ preventScroll: true });
      }
      try {
        N.select();
      } catch {
      }
    }
  }, Z = () => {
    N.style.display = "none", U = null, W = null, $ = false, document.activeElement === N && N.blur();
  }, L = (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      ln = t, ce(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), N.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Xe.length === 1) {
      const b = Xe[0];
      Xe = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, b[0], b[1], b[2], t), ce(`\u2713 C\xEDrculo r=${t} m en (${b[0].toFixed(2)}, ${b[1].toFixed(2)}, ${b[2].toFixed(2)}).`);
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
      gt = t, ce(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), N.blur();
      return;
    }
    if (!U || !W || !e.polylines) return;
    let s = W[0], n = W[1], a = W[2];
    ot === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : ot === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : ot === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const i = U[0] + s * t, r = U[1] + n * t, h = U[2] + a * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, h]];
    const m = e.polylines.rawVal, g = m.length ? m[m.length - 1] : [];
    e.polylines.val = [...m.slice(0, -1), [...g, e.points.rawVal.length - 1]], N.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    y();
  }, se = (t) => {
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
  }, he = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return U ? [U[0] + t.dx, U[1] + t.dy, U[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!U) return null;
      const o = t.ang * Math.PI / 180;
      return [U[0] + t.L * Math.cos(o), U[1] + t.L * Math.sin(o), U[2]];
    }
    if (t.kind === "relSpherical") {
      if (!U) return null;
      const o = t.az * Math.PI / 180, s = t.el * Math.PI / 180, n = t.L * Math.cos(s);
      return [U[0] + n * Math.cos(o), U[1] + n * Math.sin(o), U[2] + t.L * Math.sin(s)];
    }
    return null;
  }, pe = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...s, e.points.rawVal.length - 1]], U = t, N.blur();
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
    const o = se(t);
    if (!o) return false;
    if (o.kind === "length") return L(o.L), true;
    const s = he(o);
    if (!s) return false;
    Qo(new k(s[0], s[1], s[2]), null), U = s, N.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, N.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const s = se(N.value);
      if (!s) return;
      if ($ = false, s.kind === "length") L(s.L), ce(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = he(s);
        if (!n) return;
        pe(n);
        const a = s.kind;
        ce(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
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
    if (!U || !W || document.activeElement === N) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (N.value = t.key, N.focus(), N.setSelectionRange(1, 1), t.preventDefault());
  });
  const le = document.createElement("div");
  le.id = "hk-coord-readout", le.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", le.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(le);
  const Y = document.createElement("div");
  Y.id = "hk-coord-fixed", Y.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Y.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Y);
  const me = new St(new Se().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), new Fn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  me.frustumCulled = false, me.visible = false, me.name = "rubberBand", c.add(me), window.__hekatanRubberBand = me;
  const O = new St(new Se(), new ft({ color: 2282478, transparent: true, opacity: 0.9 }));
  O.frustumCulled = false, O.visible = false, c.add(O);
  let ye = [];
  const ge = new it(), $e = new lt(new jt(1, 1), new ut({ color: 2282478, transparent: true, opacity: 0.08, side: Ct, depthWrite: false })), ve = new Ht(new as(new jt(1, 1)), new ft({ color: 2282478, transparent: true, opacity: 0.85 })), Ne = new Ht(new Se(), new ft({ color: 2282478, transparent: true, opacity: 0.3 })), Ke = (t, o) => {
    const s = [], n = Math.ceil(t / o);
    for (let a = -n; a <= n; a++) {
      const i = a * o;
      s.push(-t, i, 0, t, i, 0), s.push(i, -t, 0, i, t, 0);
    }
    Ne.geometry.dispose(), Ne.geometry = new Se(), Ne.geometry.setAttribute("position", new _t(s, 3));
  };
  ge.add($e, ve, Ne), ge.visible = false, ge.frustumCulled = false, c.add(ge);
  const rt = new it();
  rt.frustumCulled = false, rt.visible = false, c.add(rt);
  const yt = (t) => {
    const o = new Se().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), s = new Fn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new St(o, s);
  }, P = yt(16711680), I = yt(65280), te = yt(35071);
  rt.add(P, I, te);
  const C = [], oe = (t) => t.traverse((o) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = o.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), re = yt(16761856);
  re.material.dashSize = 0.28, re.material.gapSize = 0.16, re.material.opacity = 0.9, re.frustumCulled = false, re.visible = false, re.renderOrder = 98, c.add(re);
  const we = (t) => {
    const o = new Se().setFromPoints([new k(0, 0, 0), new k(0, 0, 0), new k(0, 0, 0), new k(0, 0, 0)]), s = new ft({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new gs(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, xe = we(3462041), Le = we(16724804), Ae = we(6333946), De = new it();
  De.frustumCulled = false, De.visible = false, c.add(De), De.add(xe, Le, Ae);
  const Ze = (t) => {
    const o = new jt(1, 1), s = new ut({ color: t, transparent: true, opacity: 0.06, side: Ct, depthWrite: false }), n = new lt(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ie = Ze(3462041), nt = Ze(16724804), Be = Ze(6333946);
  De.add(Ie, nt, Be);
  const tt = (t, o, s, n) => {
    t.scale.set(2 * n, 2 * n, 1), s === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : s === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, Ge = document.createElement("div");
  Ge.id = "hk-refplane-badge", Ge.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ge), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, De.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      st(xe, i, "xy", r), st(Le, i, "xz", r), st(Ae, i, "yz", r), tt(Ie, i, "xy", r), tt(nt, i, "xz", r), tt(Be, i, "yz", r), Ie.material.opacity = 0.05, nt.material.opacity = 0.05, Be.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    y();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !De.visible) {
      y();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    st(xe, i, "xy", t), st(Le, i, "xz", t), st(Ae, i, "yz", t), tt(Ie, i, "xy", t), tt(nt, i, "xz", t), tt(Be, i, "yz", t), y();
  };
  const en = (t) => {
    if (Ie.material.opacity = t === "xy" ? 0.09 : 0.025, nt.material.opacity = t === "xz" ? 0.09 : 0.025, Be.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      Ge.style.background = a.bg, Ge.style.color = a.text, Ge.textContent = `\u25A6 Plano ${t.toUpperCase()}`, Ge.style.display = "block";
    } else Ge.style.display = "none";
  }, st = (t, o, s, n) => {
    let a;
    s === "xy" ? a = [new k(o[0] - n, o[1] - n, o[2]), new k(o[0] + n, o[1] - n, o[2]), new k(o[0] + n, o[1] + n, o[2]), new k(o[0] - n, o[1] + n, o[2]), new k(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new k(o[0] - n, o[1], o[2] - n), new k(o[0] + n, o[1], o[2] - n), new k(o[0] + n, o[1], o[2] + n), new k(o[0] - n, o[1], o[2] + n), new k(o[0] - n, o[1], o[2] - n)] : a = [new k(o[0], o[1] - n, o[2] - n), new k(o[0], o[1] + n, o[2] - n), new k(o[0], o[1] + n, o[2] + n), new k(o[0], o[1] - n, o[2] + n), new k(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(a);
  };
  let ot = null;
  window.__hekatanAxisLock = () => ot;
  let Yt = null, Ue = null;
  const Ce = document.createElement("div");
  Ce.id = "hk-axis-lock-badge", Ce.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ce);
  const Ee = () => {
    if (!ot) {
      Ce.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = t[ot], Ce.style.border = `1.5px solid ${t[ot]}`, Ce.textContent = `\u{1F512} LOCK ${ot.toUpperCase()}`, Ce.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== N) return;
    const s = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && ye.length >= 3) {
      const a = pn();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") ot = ot === s ? null : s, Ee(), t.preventDefault();
    else if (t.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Ho(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Nn(), ce(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (rt.visible = false), ce(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
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
  const Je = new k(), ze = new k(), pt = new k(), mt = (t) => {
    if (!ot) return null;
    const o = t[0], s = t[1], n = t[2];
    return ot === "x" ? (Je.set(o - 1e4, s, n), ze.set(o + 1e4, s, n)) : ot === "y" ? (Je.set(o, s - 1e4, n), ze.set(o, s + 1e4, n)) : (Je.set(o, s, n - 1e4), ze.set(o, s, n + 1e4)), S.ray.distanceSqToSegment(Je, ze, null, pt), pt;
  };
  window.__hekatanProjectOnAxis = mt;
  const ct = new St(new Se().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), new ft({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  ct.renderOrder = 998, ct.frustumCulled = false, ct.visible = false, c.add(ct);
  let Ye = -1, Oe = -1, wt = -1;
  const Pe = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Pe;
  const zt = new St(new Se().setFromPoints([new k(), new k()]), new ft({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  zt.renderOrder = 997, zt.frustumCulled = false, zt.visible = false, c.add(zt);
  const Mt = new lt(new xn(0.02, 12, 12), new ut({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Mt.renderOrder = 998, Mt.visible = false, c.add(Mt);
  const It = (t) => {
    const o = p();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(t);
    return Math.max(0.05, s / 10);
  }, Ft = () => {
    Mt.visible && Mt.scale.setScalar(It(Mt.position));
  }, Vt = new it();
  Vt.frustumCulled = false, c.add(Vt);
  const tn = 2282478;
  let Zt = null;
  const gn = (t, o, s, n) => {
    if (!e.points) return -1;
    const a = e.points.rawVal;
    let i = -1, r = n;
    for (let h = 0; h < a.length; h++) {
      const m = a[h];
      if (!m) continue;
      const g = Math.hypot(t - m[0], o - m[1], s - m[2]);
      g < r && (r = g, i = h);
    }
    return i;
  }, At = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; Vt.children.length; ) {
      const r = Vt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of Pe) {
      const [h, ...m] = r.split(":");
      if (h === "pt") {
        const g = t[+m[0]];
        if (!g) continue;
        const b = new lt(new xn(0.025, 12, 12), new ut({ color: tn, transparent: true, opacity: 0.9, depthTest: false }));
        b.position.set(g[0], g[1], g[2]), b.renderOrder = 999, b.__isSelectionPt = true, Vt.add(b);
      } else if (h === "seg") {
        const g = o[+m[0]], b = t[g == null ? void 0 : g[+m[1]]], _ = t[g == null ? void 0 : g[+m[1] + 1]];
        if (!b || !_) continue;
        const d = new Se().setFromPoints([new k(b[0], b[1], b[2]), new k(_[0], _[1], _[2])]), V = new St(d, new ft({ color: tn, transparent: true, opacity: 0.95, depthTest: false }));
        V.renderOrder = 999, Vt.add(V);
      } else if (h === "poly") {
        const b = o[+m[0]].map((V) => {
          const ee = t[V];
          return ee ? new k(ee[0], ee[1], ee[2]) : null;
        }).filter(Boolean);
        if (b.length < 2) continue;
        const _ = new Se().setFromPoints(b), d = new St(_, new ft({ color: tn, transparent: true, opacity: 0.95, depthTest: false }));
        d.renderOrder = 999, Vt.add(d);
      } else if (h === "aux") {
        const g = n[+m[0]];
        if (!g || g.length !== 6) continue;
        const b = new Se().setFromPoints([new k(g[0], g[1], g[2]), new k(g[3], g[4], g[5])]), _ = new St(b, new ft({ color: tn, transparent: true, opacity: 0.95, depthTest: false }));
        _.renderOrder = 999, Vt.add(_);
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
  window.__hekatanRefreshSelection = At, window.__hekatanClearSelection = () => {
    Pe.clear(), At();
  };
  const nn = (t, o, s, n, a, i, r, h, m) => {
    const g = r - n, b = h - a, _ = m - i, d = g * g + b * b + _ * _;
    if (d < 1e-12) return Math.hypot(t - n, o - a, s - i);
    let V = ((t - n) * g + (o - a) * b + (s - i) * _) / d;
    V = Math.max(0, Math.min(1, V));
    const ee = n + V * g, X = a + V * b, R = i + V * _;
    return Math.hypot(t - ee, o - X, s - R);
  }, vn = (t, o, s, n) => {
    if (!e.polylines) return null;
    const a = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, h = -1, m = n;
    for (let g = 0; g < a.length; g++) {
      const b = a[g];
      for (let _ = 0; _ < b.length - 1; _++) {
        const d = i[b[_]], V = i[b[_ + 1]];
        if (!d || !V) continue;
        const ee = nn(t, o, s, d[0], d[1], d[2], V[0], V[1], V[2]);
        ee < m && (m = ee, r = g, h = _);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: h, dist: m } : null;
  }, $n = (t, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let r = -1, h = n;
    for (let m = 0; m < i.length; m++) {
      const g = i[m];
      if (!g || g.length !== 6) continue;
      const b = nn(t, o, s, g[0], g[1], g[2], g[3], g[4], g[5]);
      b < h && (h = b, r = m);
    }
    return r;
  }, so = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      ct.visible = false;
      return;
    }
    ct.geometry.setFromPoints([new k(n[0], n[1], n[2]), new k(n[3], n[4], n[5])]), ct.visible = true;
  }, ao = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!s || s.length < 2) {
      ct.visible = false;
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
    ct.geometry.setFromPoints(i), ct.visible = true;
  }, on = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const s = o.filter((m, g) => g !== t), n = /* @__PURE__ */ new Set();
    for (const m of s) for (const g of m) n.add(g);
    const a = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let m = 0; m < a.length; m++) n.has(m) && (i.set(m, r.length), r.push(a[m]));
    const h = s.map((m) => m.map((g) => i.get(g)).filter((g) => g !== void 0));
    e.points.val = r, e.polylines.val = h, e.areas && (e.areas.val = e.areas.rawVal.filter((m) => m !== t).map((m) => m > t ? m - 1 : m)), ct.visible = false, Ye = -1, Oe = -1;
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
      on(t);
      return;
    }
    const a = s[t];
    if (o < 0 || o >= a.length - 1) return;
    if (a.length === 2) {
      on(t);
      return;
    }
    let i;
    o === 0 ? i = [a.slice(1)] : o === a.length - 2 ? i = [a.slice(0, -1)] : i = [a.slice(0, o + 1), a.slice(o + 1)];
    const r = [...s.slice(0, t), ...i, ...s.slice(t + 1)], h = /* @__PURE__ */ new Set();
    for (const d of r) for (const V of d) h.add(V);
    const m = e.points.rawVal, g = /* @__PURE__ */ new Map(), b = [];
    for (let d = 0; d < m.length; d++) h.has(d) && (g.set(d, b.length), b.push(m[d]));
    const _ = r.map((d) => d.map((V) => g.get(V)).filter((V) => V !== void 0));
    if (e.points.val = b, e.polylines.val = _, e.areas) {
      const d = i.length - 1;
      e.areas.val = e.areas.rawVal.map((V) => V > t ? V + d : V);
    }
    ct.visible = false, Ye = -1, Oe = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  J.geometry.setAttribute("position", new _t(e.points.rawVal.flat(), 3)), J.geometry.computeBoundingSphere(), J.frustumCulled = false, be.frustumCulled = false, c.add(be), K.position.set(0, 0, 0), K.rotateX(Math.PI / 2), K.geometry.rotateX(Math.PI / 2), K.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, s) => {
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
  const sn = [];
  window.__hekatanCirculos = sn;
  let In = [], Rn = "";
  const Mn = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], s = `${t.length}|${o.length}|${o.reduce((a, i) => a + i.length, 0)}`;
    if (s === Rn) return In;
    Rn = s;
    const n = [];
    for (const a of o) {
      const i = a.length;
      if (i < 6 || a[0] !== a[i - 1]) continue;
      const r = a.slice(0, i - 1).map((b) => t[b]).filter(Boolean);
      if (r.length < 5) continue;
      const h = [0, 1, 2].map((b) => r.reduce((_, d) => _ + d[b], 0) / r.length), m = r.map((b) => Math.hypot(b[0] - h[0], b[1] - h[1], b[2] - h[2])), g = m.reduce((b, _) => b + _, 0) / m.length;
      g < 1e-9 || m.some((b) => Math.abs(b - g) > 5e-3 * g) || n.push({ c: h, r: g });
    }
    return In = n;
  };
  window.__hekatanCentrosDeducidos = Mn, window.__hekatanDrawCircle = (t, o, s, n, a = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(a)), h = e.points.rawVal.length, m = [];
    for (let g = 0; g < r; g++) {
      const b = 2 * Math.PI * g / r, _ = n * Math.cos(b), d = n * Math.sin(b);
      let V;
      i === "xy" ? V = [t + _, o + d, s] : i === "xz" ? V = [t + _, o, s + d] : V = [t, o + _, s + d], m.push(V);
    }
    if (e.points.val = [...e.points.rawVal, ...m], sn.push({ c: [t, o, s], r: n }), e.polylines) {
      const g = [...m.map((_, d) => h + d), h], b = e.polylines.rawVal;
      ((_a2 = b[b.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...b, g, []] : e.polylines.val = [...b.slice(0, -1), g, []];
    }
  }, window.__hekatanDrawArc = (t, o, s, n = window.__hekatanArcSegs ?? 12) => {
    const a = Math.max(4, Math.round(n)), i = new k(...t), r = new k(...o), h = new k(...s), m = new k().subVectors(r, i), g = new k().subVectors(h, i), b = new k().crossVectors(m, g).normalize(), _ = new k().addVectors(i, r).multiplyScalar(0.5), d = new k().addVectors(r, h).multiplyScalar(0.5), V = new k().crossVectors(m, b).normalize(), ee = new k().crossVectors(new k().subVectors(h, r), b).normalize(), X = new k().subVectors(d, _), R = V.x * ee.y - V.y * ee.x;
    let v;
    if (Math.abs(R) > 1e-9) {
      const fe = (X.x * ee.y - X.y * ee.x) / R;
      v = new k().addVectors(_, V.clone().multiplyScalar(fe));
    } else v = _.clone();
    const z = i.distanceTo(v), A = new k().subVectors(i, v), D = new k().subVectors(h, v), q = Math.acos(Math.max(-1, Math.min(1, A.dot(D) / (z * z)))), B = e.points.rawVal.length, H = [], ue = b.clone();
    for (let fe = 0; fe <= a; fe++) {
      const ke = fe / a, He = q * ke, Ve = new Gn().setFromAxisAngle(ue, He), et = A.clone().applyQuaternion(Ve).add(v);
      H.push([et.x, et.y, et.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...H], sn.push({ c: [v.x, v.y, v.z], r: z }), e.polylines) {
      const fe = H.map((He, Ve) => B + Ve), ke = e.polylines.rawVal;
      e.polylines.val = [...ke.slice(0, -1), fe, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, s = 1, n = 6, a = 6) => {
    const i = Math.min(t[0], o[0]), r = Math.max(t[0], o[0]), h = Math.min(t[1], o[1]), m = Math.max(t[1], o[1]), g = (t[2] + o[2]) / 2, b = r - i, _ = m - h, d = Math.min(s, b / 2 - 0.01, _ / 2 - 0.01);
    if (d <= 0) return;
    const V = e.points.rawVal.length, ee = [], X = [], R = (v, z) => {
      ee.push([v, z, g]), X.push(V + ee.length - 1);
    };
    for (let v = 0; v <= a; v++) R(i + d + (b - 2 * d) * v / a, h);
    for (let v = 1; v <= n; v++) {
      const z = -Math.PI / 2 + Math.PI / 2 * v / n;
      R(r - d + d * Math.cos(z), h + d + d * Math.sin(z));
    }
    for (let v = 1; v <= a; v++) R(r, h + d + (_ - 2 * d) * v / a);
    for (let v = 1; v <= n; v++) {
      const z = 0 + Math.PI / 2 * v / n;
      R(r - d + d * Math.cos(z), m - d + d * Math.sin(z));
    }
    for (let v = 1; v <= a; v++) R(r - d - (b - 2 * d) * v / a, m);
    for (let v = 1; v <= n; v++) {
      const z = Math.PI / 2 + Math.PI / 2 * v / n;
      R(i + d + d * Math.cos(z), m - d + d * Math.sin(z));
    }
    for (let v = 1; v <= a; v++) R(i, m - d - (_ - 2 * d) * v / a);
    for (let v = 1; v <= n; v++) {
      const z = Math.PI + Math.PI / 2 * v / n;
      R(i + d + d * Math.cos(z), h + d + d * Math.sin(z));
    }
    if (X.push(V), e.points.val = [...e.points.rawVal, ...ee], e.polylines) {
      const v = e.polylines.rawVal;
      e.polylines.val = [...v.slice(0, -1), X, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], r = o[0], h = o[1], m = o[2];
    let g;
    if (Math.abs(i - m) < 1e-6 ? g = [[n, a, i], [r, a, i], [r, h, i], [n, h, i]] : Math.abs(a - h) < 1e-6 ? g = [[n, a, i], [r, a, i], [r, a, m], [n, a, m]] : g = [[n, a, i], [n, h, i], [n, h, m], [n, a, m]], e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const b = [s, s + 1, s + 2, s + 3, s], _ = e.polylines.rawVal;
      e.polylines.val = [..._.slice(0, -1), b, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], r = o[0], h = o[1], m = o[2];
    let g;
    if (F && e.gridTarget) {
      const b = e.gridTarget.rawVal, _ = new An(...b.rotation), d = new k(1, 0, 0).applyEuler(_), V = new k(0, 1, 0).applyEuler(_), ee = new k(...b.position), X = new k(n, a, i), R = new k(r, h, m), v = X.clone().sub(ee).dot(d), z = X.clone().sub(ee).dot(V), A = R.clone().sub(ee).dot(d), D = R.clone().sub(ee).dot(V), q = (B, H) => ee.clone().addScaledVector(d, B).addScaledVector(V, H).toArray();
      g = [q(v, z), q(A, z), q(A, D), q(v, D)];
    } else Math.abs(i - m) < 1e-6 ? g = [[n, a, i], [r, a, i], [r, h, i], [n, h, i]] : Math.abs(a - h) < 1e-6 ? g = [[n, a, i], [r, a, i], [r, a, m], [n, a, m]] : g = [[n, a, i], [n, h, i], [n, h, m], [n, a, m]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const b = e.polylines.rawVal, _ = b.length - 1, d = [s, s + 1, s + 2, s + 3, s];
      e.polylines.val = [...b.slice(0, -1), d, []], e.areas && (e.areas.val = [...e.areas.rawVal, _]);
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
    for (let Me = 0; Me < s; Me++) {
      const Te = t[Me], We = t[(Me + 1) % s];
      n += (Te[1] - We[1]) * (Te[2] + We[2]), a += (Te[2] - We[2]) * (Te[0] + We[0]), i += (Te[0] - We[0]) * (Te[1] + We[1]);
    }
    const r = Math.hypot(n, a, i) || 1;
    n /= r, a /= r, i /= r;
    let h = t[1][0] - t[0][0], m = t[1][1] - t[0][1], g = t[1][2] - t[0][2];
    const b = Math.hypot(h, m, g) || 1;
    h /= b, m /= b, g /= b;
    let _ = a * g - i * m, d = i * h - n * g, V = n * m - a * h;
    const ee = Math.hypot(_, d, V) || 1;
    _ /= ee, d /= ee, V /= ee;
    const X = t[0], R = (Me) => [(Me[0] - X[0]) * h + (Me[1] - X[1]) * m + (Me[2] - X[2]) * g, (Me[0] - X[0]) * _ + (Me[1] - X[1]) * d + (Me[2] - X[2]) * V], v = (Me, Te) => [X[0] + Me * h + Te * _, X[1] + Me * m + Te * d, X[2] + Me * g + Te * V], z = t.map(R);
    let A = 1 / 0, D = -1 / 0, q = 1 / 0, B = -1 / 0;
    for (const [Me, Te] of z) Me < A && (A = Me), Me > D && (D = Me), Te < q && (q = Te), Te > B && (B = Te);
    const H = D - A, ue = B - q;
    if (H < 1e-6 || ue < 1e-6) return 0;
    let fe = o && o > 0 ? o : 0.5;
    for (; H / fe * (ue / fe) > 2500; ) fe *= 2;
    fe = Math.min(fe, Math.min(H, ue));
    const ke = (Me, Te) => {
      let We = false;
      for (let $t = 0, Bt = z.length - 1; $t < z.length; Bt = $t++) {
        const [Lt, Ot] = z[$t], [Mo, Un] = z[Bt];
        Ot > Te != Un > Te && Me < (Mo - Lt) * (Te - Ot) / (Un - Ot) + Lt && (We = !We);
      }
      return We;
    }, He = Math.max(1, Math.round(H / fe)), Ve = Math.max(1, Math.round(ue / fe)), et = H / He, Qe = ue / Ve, at = /* @__PURE__ */ new Map(), qe = [], Fe = e.points.rawVal.length, je = (Me, Te) => {
      const We = Me + "," + Te, $t = at.get(We);
      if ($t !== void 0) return $t;
      const Bt = Fe + qe.length;
      return qe.push(v(A + Me * et, q + Te * Qe)), at.set(We, Bt), Bt;
    }, Re = [];
    for (let Me = 0; Me < He; Me++) for (let Te = 0; Te < Ve; Te++) {
      if (!ke(A + (Me + 0.5) * et, q + (Te + 0.5) * Qe)) continue;
      const We = je(Me, Te), $t = je(Me + 1, Te), Bt = je(Me + 1, Te + 1), Lt = je(Me, Te + 1);
      Re.push([We, $t, Bt, Lt]);
    }
    if (!Re.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...qe], e.polylines && e.areas) {
      let Me = e.polylines.rawVal.slice();
      Me.length && Me[Me.length - 1].length === 0 && (Me = Me.slice(0, -1));
      const Te = [];
      for (const We of Re) Te.push(Me.length), Me.push([We[0], We[1], We[2], We[3], We[0]]);
      Me.push([]), e.polylines.val = Me, e.areas.val = [...e.areas.rawVal, ...Te];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), Re.length;
  };
  const pn = () => {
    if (ye.length < 3) return ye = [], O.visible = false, y(), 0;
    const t = window.__hekatanMeshPolyArea(ye.slice());
    return ye = [], O.visible = false, y(), t;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, s) => {
    var _a2;
    const n = new k(t[0], t[1], t[2]), a = new k(o[0], o[1], o[2]), i = new k(s[0], s[1], s[2]), r = new k().subVectors(a, n).cross(new k().subVectors(i, n));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const h = new Gn().setFromUnitVectors(new k(0, 0, 1), r), m = new An().setFromQuaternion(h);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [m.x, m.y, m.z] }), F = true;
    const g = new k().addVectors(n, a).add(i).multiplyScalar(1 / 3), b = Math.max(n.distanceTo(a), n.distanceTo(i), a.distanceTo(i)) * 2.2 + 4, _ = b / 2;
    $e.geometry.dispose(), $e.geometry = new jt(b, b), ve.geometry.dispose(), ve.geometry = new as(new jt(b, b)), Ke(_, 1), ge.position.copy(g), ge.quaternion.copy(h), ge.scale.set(1, 1, 1), ge.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), F = false, ge.visible = false, y();
  };
  const qt = new it();
  qt.visible = false, c.add(qt), window.__hekatanShowAxes = (t, o, s = 12, n = 2) => {
    var _a2, _b;
    for (; qt.children.length; ) {
      const b = qt.children.pop();
      (_a2 = b.geometry) == null ? void 0 : _a2.dispose(), (_b = b.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const a = Math.min(...o) - n, i = Math.max(...o) + n, r = Math.min(...t) - n, h = Math.max(...t) + n, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", g = (b, _, d, V, ee) => {
      const X = document.createElement("canvas");
      X.width = 64, X.height = 32;
      const R = X.getContext("2d");
      R.fillStyle = ee, R.font = "bold 22px sans-serif", R.textAlign = "center", R.fillText(b, 32, 26);
      const v = new is(X), z = new ls({ map: v, transparent: true }), A = new rs(z);
      return A.position.set(_, d, V), A.scale.set(1.2, 0.6, 1), A;
    };
    t.forEach((b, _) => {
      const d = _ < m.length ? m[_] : `X${_}`, V = new Se().setFromPoints([new k(b, a, 0), new k(b, i, 0), new k(b, a, 0), new k(b, a, s)]), ee = new Fn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), X = new Ht(V, ee);
      X.computeLineDistances(), qt.add(X), qt.add(g(d, b, a - 0.5, 0, "#60a5fa")), qt.add(g(d, b, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((b, _) => {
      const d = `${_ + 1}`, V = new Se().setFromPoints([new k(r, b, 0), new k(h, b, 0), new k(r, b, 0), new k(r, b, s)]), ee = new Fn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), X = new Ht(V, ee);
      X.computeLineDistances(), qt.add(X), qt.add(g(d, r - 0.5, b, 0, "#fb7185")), qt.add(g(d, h + 0.5, b, 0, "#fb7185"));
    }), qt.visible = true, y();
  }, window.__hekatanHideAxes = () => {
    qt.visible = false, y();
  };
  const Jt = new it();
  Jt.visible = false, c.add(Jt);
  let un = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, s = 0, n = 0) => {
    var _a2, _b;
    for (; Jt.children.length; ) {
      const i = Jt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    un.forEach((i) => {
      c.remove(i), i.geometry.dispose(), i.material.dispose();
    }), un = [];
    const a = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, r) => {
      const h = a[r % a.length], m = o / 2, g = [new k(s - m, n - m, i), new k(s + m, n - m, i), new k(s + m, n + m, i), new k(s - m, n + m, i), new k(s - m, n - m, i)], b = new Se().setFromPoints(g), _ = new ft({ color: h, transparent: true, opacity: 0.55 });
      Jt.add(new St(b, _));
      const d = document.createElement("canvas");
      d.width = 128, d.height = 32;
      const V = d.getContext("2d");
      V.fillStyle = `#${h.toString(16).padStart(6, "0")}`, V.font = "bold 18px sans-serif", V.fillText(`Z = ${i} m`, 4, 22);
      const ee = new is(d), X = new ls({ map: ee, transparent: true }), R = new rs(X);
      R.position.set(s - m - 1.5, n - m - 1.5, i), R.scale.set(2.5, 0.6, 1), Jt.add(R);
      const v = new jt(1e4, 1e4), z = new ut({ visible: false, side: Ct }), A = new lt(v, z);
      A.position.set(0, 0, i), A.frustumCulled = false, A.userData = { refPlaneZ: i }, c.add(A), un.push(A);
    }), Jt.visible = true, y();
  }, window.__hekatanHideRefPlanes = () => {
    Jt.visible = false, un.forEach((t) => {
      t.visible = false;
    }), y();
  };
  const bn = new it();
  bn.frustumCulled = false, c.add(bn);
  const Cs = () => {
    var _a2, _b, _c, _d;
    for (; bn.children.length; ) {
      const s = bn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new Se().setFromPoints([new k(s[0], s[1], s[2]), new k(s[3], s[4], s[5])]), a = new Fn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new St(n, a);
      i.computeLineDistances(), bn.add(i);
    }
  };
  Q.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, Cs(), y());
  });
  const fn = new it();
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
      const n = new lt(new xn(0.025, 12, 12), new ut({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(It(n.position)), fn.add(n);
    }
  };
  Q.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Lo(), y());
  }), u.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(It(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Lo;
  const xt = new it(), zs = new lt(new xn(0.01, 12, 12), new ut({ color: 16724804, transparent: true, opacity: 0.95 })), Fs = new lt(new xn(0.015, 12, 12), new ut({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  xt.add(zs, Fs);
  const hn = 0.08, io = (t, o, s) => {
    const n = new Se().setFromPoints([new k(...t), new k(...o)]);
    return new St(n, new ft({ color: s, transparent: true, opacity: 0.7 }));
  };
  xt.add(io([-hn, 0, 0], [hn, 0, 0], 16711680)), xt.add(io([0, -hn, 0], [0, hn, 0], 65280)), xt.add(io([0, 0, -hn], [0, 0, hn], 35071)), xt.visible = false, xt.frustumCulled = false, c.add(xt);
  let lo = 2;
  const Dn = (t) => {
    const o = p(), s = (M == null ? void 0 : M.clientHeight) || 700;
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
    Vt.children.length !== 0 && Vt.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(It(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Io, u.addEventListener("change", () => {
    var _a2;
    _n(), Mt.visible && Ft(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Io();
  }), window.__hekatanShowSnap = (t, o, s) => {
    xt.position.set(t, o, s), xt.visible = true, _n(), y();
  }, window.__hekatanHideSnap = () => {
    xt.visible = false, y();
  }, M.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r;
    window.__hekatanCursorPx = { x: t.clientX, y: t.clientY };
    const o = x(t);
    if (!o) return;
    S.setFromCamera(E, o);
    const s = de();
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
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, d = gn(n.x, n.y, n.z, _), V = vn(n.x, n.y, n.z, _), ee = $n(n.x, n.y, n.z, _);
        if (d >= 0) {
          const z = e.points.rawVal[d];
          Mt.position.set(z[0], z[1], z[2]), Mt.visible = true, Ft(), zt.visible = false, Zt = { kind: "pt", a: d };
        } else if (V) {
          const z = e.points.rawVal, A = e.polylines.rawVal[V.polyIdx], D = z[A[V.segIdx]], q = z[A[V.segIdx + 1]];
          zt.geometry.setFromPoints([new k(D[0], D[1], D[2]), new k(q[0], q[1], q[2])]), zt.visible = true, Mt.visible = false, Zt = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(V.polyIdx)) ?? false ? { kind: "poly", a: V.polyIdx } : { kind: "seg", a: V.polyIdx, b: V.segIdx };
        } else if (ee >= 0) {
          const A = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[ee];
          A && (zt.geometry.setFromPoints([new k(A[0], A[1], A[2]), new k(A[3], A[4], A[5])]), zt.visible = true, Mt.visible = false, Zt = { kind: "aux", a: ee });
        } else zt.visible = false, Mt.visible = false, Zt = null;
        le.style.left = t.clientX + "px", le.style.top = t.clientY + "px", le.style.display = "block";
        let X = n;
        if ((Zt == null ? void 0 : Zt.kind) === "pt") {
          const z = e.points.rawVal[Zt.a];
          z && (X = new k(z[0], z[1], z[2]));
        }
        const R = `X=${X.x.toFixed(2)} Y=${X.y.toFixed(2)} Z=${X.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [X.x, X.y, X.z], Zt) {
          const z = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          le.textContent = `${R}  \xB7  \u{1F5B1} Click \u2192 ${z[Zt.kind]}`;
        } else le.textContent = R;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = R), Ue = { p: X.clone(), x: t.clientX, y: t.clientY }, me.visible = false, rt.visible = false, re.visible = false, y();
        return;
      }
      if (h === "delete" || h === "trim" || h === "extend" || h === "offset") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, d = vn(n.x, n.y, n.z, _), V = $n(n.x, n.y, n.z, _);
        let ee = false;
        if (V >= 0) if (!d) ee = true;
        else {
          const z = window.__hekatanDrawingAuxLines, D = ((z == null ? void 0 : z.rawVal) ?? (z == null ? void 0 : z.val) ?? z ?? [])[V];
          nn(n.x, n.y, n.z, D[0], D[1], D[2], D[3], D[4], D[5]) < d.dist && (ee = true);
        }
        ee ? (wt = V, Ye = -1, Oe = -1, so(V)) : d ? (Ye = d.polyIdx, Oe = d.segIdx, wt = -1, ao(d.polyIdx, d.segIdx)) : (Ye = -1, Oe = -1, wt = -1, ct.visible = false), me.visible = false, rt.visible = false, re.visible = false, Z(), le.style.left = t.clientX + "px", le.style.top = t.clientY + "px", le.style.display = "block";
        const X = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let R = "";
        ee ? R = `\u{1F5D1} l\xEDnea aux #${wt + 1}` : d ? R = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(d.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${d.polyIdx + 1}` : `\u{1F5D1} seg ${d.segIdx + 1} / poly #${d.polyIdx + 1}` : R = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", le.textContent = `${X}  \xB7  ${R}`;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = X), y();
        return;
      } else ct.visible = false, Ye = -1, wt = -1;
      le.style.left = t.clientX + "px", le.style.top = t.clientY + "px", le.style.display = "block";
      const m = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], g = m[m.length - 1] ?? [], b = e.points.rawVal ?? [];
      if (g.length > 0 && b[g[g.length - 1]]) {
        const _ = g[g.length - 1], d = b[_];
        let V = ot;
        if (Yt = null, !V && window.__hekatanAxisSnap !== false) {
          const Ve = M.getBoundingClientRect(), et = t.clientX, Qe = t.clientY, at = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, qe = new k(d[0], d[1], d[2]), Fe = [["x", new k(1, 0, 0)], ["y", new k(0, 1, 0)], ["z", new k(0, 0, 1)]], je = (Me) => {
            const Te = Me.clone().project(o);
            return { x: (Te.x * 0.5 + 0.5) * Ve.width + Ve.left, y: (-Te.y * 0.5 + 0.5) * Ve.height + Ve.top };
          };
          let Re = null;
          for (const [Me, Te] of Fe) {
            const We = je(qe.clone().addScaledVector(Te, -at)), $t = je(qe.clone().addScaledVector(Te, at)), Bt = $t.x - We.x, Lt = $t.y - We.y, Ot = et - We.x, Mo = Qe - We.y, Un = Bt * Bt + Lt * Lt || 1;
            let qn = (Ot * Bt + Mo * Lt) / Un;
            qn = Math.max(0, Math.min(1, qn));
            const jo = Math.hypot(et - (We.x + qn * Bt), Qe - (We.y + qn * Lt));
            if (Re === null || jo < Re.dpx) {
              const bo = S.ray, es = qe.clone().sub(bo.origin), _o2 = Te.dot(bo.direction), ts = Te.dot(es), Ys = bo.direction.dot(es), ns = 1 - _o2 * _o2, Zs = Math.abs(ns) < 1e-6 ? -ts : (_o2 * Ys - ts) / ns;
              Re = { axis: Me, dpx: jo, pt: qe.clone().addScaledVector(Te, Zs) };
            }
          }
          Re && Re.dpx <= 12 && (n.copy(Re.pt), V = Re.axis, Yt = Re.pt.clone());
        }
        const ee = !!window.__hekatanOrthoMode;
        if (!V && ee) {
          const Ve = Math.abs(n.x - d[0]), et = Math.abs(n.y - d[1]), Qe = Math.abs(n.z - d[2]), at = (_l = s[0]) == null ? void 0 : _l.object;
          let qe = null;
          at === Ie ? qe = "xy" : at === nt ? qe = "xz" : at === Be && (qe = "yz"), qe === "xy" ? V = Ve >= et ? "x" : "y" : qe === "xz" ? V = Ve >= Qe ? "x" : "z" : qe === "yz" ? V = et >= Qe ? "y" : "z" : V = Ve >= et && Ve >= Qe ? "x" : et >= Qe ? "y" : "z";
        }
        const X = window.__hekatanPolarTrack !== false;
        if (!V && X) {
          const Ve = n.x - d[0], et = n.y - d[1], Qe = n.z - d[2], at = Math.hypot(Ve, et, Qe);
          if (at > 1e-3) {
            const Fe = Math.tan(6 * Math.PI / 180) * at, je = Math.hypot(et, Qe), Re = Math.hypot(Ve, Qe), Me = Math.hypot(Ve, et), Te = [["x", je], ["y", Re], ["z", Me]];
            Te.sort((We, $t) => We[1] - $t[1]), Te[0][1] <= Fe && (V = Te[0][0]);
          }
        }
        if (V) {
          const Ve = d[0], et = d[1], Qe = d[2];
          V === "x" ? n.set(n.x, et, Qe) : V === "y" ? n.set(Ve, n.y, Qe) : n.set(Ve, et, n.z);
          const at = !!ot, Fe = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[V];
          Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = Fe, Ce.style.border = `1.5px solid ${Fe}`;
          const je = (_m = s[0]) == null ? void 0 : _m.object;
          let Re = null;
          je === Ie ? Re = "xy" : je === nt ? Re = "xz" : je === Be && (Re = "yz");
          const Me = Re ? ` (plano ${Re.toUpperCase()})` : "";
          Ce.textContent = at ? `\u{1F512} LOCK ${V.toUpperCase()}${Me}` : `\u22A5 ORTO ${V.toUpperCase()}${Me}`, Ce.style.left = t.clientX + 20 + "px", Ce.style.top = t.clientY + 18 + "px", Ce.style.transform = "none", Ce.style.display = "block";
        } else ot || (Ce.style.display = "none");
        let R = null;
        if (!a && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ve = e.points.rawVal, et = V ? [V] : ["z", "x", "y"], Qe = { x: t.clientX, y: t.clientY };
          let at = 1 / 0;
          for (const qe of Ve) if (!(Math.abs(qe[0] - d[0]) < 1e-9 && Math.abs(qe[1] - d[1]) < 1e-9 && Math.abs(qe[2] - d[2]) < 1e-9)) for (const Fe of et) {
            const je = new k(Fe === "x" ? qe[0] : n.x, Fe === "y" ? qe[1] : n.y, Fe === "z" ? qe[2] : n.z), Re = ho(je.x, je.y, je.z);
            if (!Re) continue;
            const Me = Math.hypot(Re.x - Qe.x, Re.y - Qe.y);
            Me < kn && Me < at && (at = Me, R = { q: qe, eje: Fe });
          }
        }
        R ? (R.eje === "x" ? n.x = R.q[0] : R.eje === "y" ? n.y = R.q[1] : n.z = R.q[2], re.geometry.setFromPoints([new k(R.q[0], R.q[1], R.q[2]), new k(n.x, n.y, n.z)]), (_n2 = re.computeLineDistances) == null ? void 0 : _n2.call(re), re.visible = true, xt.position.set(n.x, n.y, n.z), xt.visible = true, Yo("track", t.clientX, t.clientY)) : re.visible = false, Ue = { p: n.clone(), x: t.clientX, y: t.clientY };
        const v = Math.hypot(n.x - d[0], n.y - d[1], n.z - d[2]), z = Math.atan2(n.y - d[1], n.x - d[0]) * 180 / Math.PI, A = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        le.textContent = `${A} | \u0394L=${v.toFixed(2)}m ${z.toFixed(0)}\xB0`;
        const D = document.getElementById("hk-coord-fixed");
        D && (D.textContent = A), me.geometry.setFromPoints([new k(d[0], d[1], d[2]), new k(n.x, n.y, n.z)]), (_o = me.computeLineDistances) == null ? void 0 : _o.call(me), me.visible = true, G(d[0], d[1], d[2], n.x, n.y, n.z);
        const q = window.__hekatanOrthoExt ?? 8, B = window.__hekatanShowOrthoPlanes !== false;
        De.visible = B, B || en(null), B && (st(xe, d, "xy", q), st(Le, d, "xz", q), st(Ae, d, "yz", q), tt(Ie, d, "xy", q), tt(nt, d, "xz", q), tt(Be, d, "yz", q));
        const H = B ? S.intersectObjects([Ie, nt, Be], false) : [];
        let ue = null;
        if (H.length > 0) {
          const Ve = H[0].object;
          Ve === Ie ? ue = "xy" : Ve === nt ? ue = "xz" : Ve === Be && (ue = "yz");
        }
        en(ue), ue && (Ge.style.left = t.clientX + "px", Ge.style.top = t.clientY + "px"), P.geometry.setFromPoints([new k(d[0] - q, d[1], d[2]), new k(d[0] + q, d[1], d[2])]), (_p = P.computeLineDistances) == null ? void 0 : _p.call(P), I.geometry.setFromPoints([new k(d[0], d[1] - q, d[2]), new k(d[0], d[1] + q, d[2])]), (_q = I.computeLineDistances) == null ? void 0 : _q.call(I), te.geometry.setFromPoints([new k(d[0], d[1], d[2] - q), new k(d[0], d[1], d[2] + q)]), (_r = te.computeLineDistances) == null ? void 0 : _r.call(te), rt.visible = true;
        const fe = P.material, ke = I.material, He = te.material;
        V === "x" ? (fe.opacity = 0.95, ke.opacity = 0.1, He.opacity = 0.1) : V === "y" ? (fe.opacity = 0.1, ke.opacity = 0.95, He.opacity = 0.1) : V === "z" ? (fe.opacity = 0.1, ke.opacity = 0.1, He.opacity = 0.95) : (fe.opacity = 0.5, ke.opacity = 0.5, He.opacity = 0.5);
      } else {
        const _ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        le.textContent = _;
        const d = document.getElementById("hk-coord-fixed");
        if (d && (d.textContent = _), me.visible = false, rt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(h)) {
          if (U = null, W = null, N.style.left = t.clientX + 20 + "px", N.style.top = t.clientY - 28 + "px", N.style.display = "block", !$) {
            N.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const ee = document.activeElement;
            !(ee && (ee.tagName === "INPUT" || ee.tagName === "TEXTAREA") && ee !== N) && document.activeElement !== N && N.focus({ preventScroll: true });
            try {
              N.select();
            } catch {
            }
          }
        } else Z();
      }
      y();
    } else Nn(), le.style.display = "none", xt.visible = false, me.visible = false, rt.visible = false, Z(), y();
  }), Q.derive(() => {
    var _a2;
    if (!e.gridTarget) return;
    const t = new Gn().setFromEuler(new An(...e.gridTarget.val.rotation)), o = new Gn().setFromAxisAngle(new k(1, 0, 0), Math.PI / 2);
    Ea(l, { position: new k(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, y);
    {
      const n = e.gridTarget.val.position[2], a = Math.abs(t.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of C) c.remove(i), oe(i);
      if (C.length = 0, a) {
        const i = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], r = /* @__PURE__ */ new Set([0]);
        for (const m of i) r.add(+m[2].toFixed(3));
        for (const m of window.__hekatanLevels ?? []) isFinite(m == null ? void 0 : m.z) && r.add(+m.z.toFixed(3));
        const h = [...r].sort((m, g) => m - g).slice(0, 24);
        for (const m of h) {
          if (Math.abs(m - n) < 1e-6) continue;
          const g = l.clone(true);
          g.name = `hekatan-grid-nivel-${m}`, g.traverse((b) => {
            b.material && (b.material = b.material.clone(), b.material.transparent = true, b.material.opacity = (b.material.opacity ?? 1) * (Math.abs(m) < 1e-6 ? 0.5 : 0.22));
          }), g.position.set(0, 0, m), g.quaternion.copy(o), c.add(g), C.push(g);
        }
      }
    }
    K.position.set(...e.gridTarget.val.position), K.quaternion.setFromEuler(new An(...e.gridTarget.val.rotation)), K.updateMatrixWorld();
    const s = new k(0, 0, 1).applyEuler(new An(...e.gridTarget.val.rotation));
    F = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), Q.derive(() => {
    J.geometry.setAttribute("position", new _t(e.points.val.flat(), 3)), J.geometry.computeBoundingSphere();
  }), Q.derive(() => {
    const t = 0.05 * w * 0.5 * f.val;
    S.params.Points.threshold = 0.4 * t;
  }), Q.derive(() => {
    var _a2;
    const t = e.points.val ?? [], s = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of s) {
      const [r, h, m] = t[i];
      n.push(r, h, m);
    }
    const a = new Se();
    a.setAttribute("position", new _t(n, 3)), _e.geometry.dispose(), _e.geometry = a;
  });
  let co = false, an = 0;
  M.addEventListener("pointerdown", () => {
    co = true;
  }), M.addEventListener("pointerup", () => {
    co = false;
  }), M.addEventListener("pointermove", () => {
    co && an++;
  });
  const Tt = document.createElement("div");
  Tt.id = "hk-window-select", Tt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Tt);
  let Kt = null, Sn = false, Xt = null;
  const po = (t, o, s, n, a) => {
    a ? (Tt.style.borderColor = "#34d399", Tt.style.borderStyle = "dashed", Tt.style.background = "rgba(52, 211, 153, 0.10)") : (Tt.style.borderColor = "#22d3ee", Tt.style.borderStyle = "solid", Tt.style.background = "rgba(34, 211, 238, 0.10)"), Tt.style.left = Math.min(t, s) + "px", Tt.style.top = Math.min(o, n) + "px", Tt.style.width = Math.abs(s - t) + "px", Tt.style.height = Math.abs(n - o) + "px", Tt.style.display = "block";
  }, Ro = (t, o, s, n, a) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, s), r = Math.max(t, s), h = Math.min(o, n), m = Math.max(o, n), g = s < t, b = M.getBoundingClientRect(), _ = p();
    _.updateMatrixWorld();
    const d = (B) => {
      const H = new k(B[0], B[1], B[2]);
      return H.project(_), { x: b.left + (H.x * 0.5 + 0.5) * b.width, y: b.top + (-H.y * 0.5 + 0.5) * b.height };
    }, V = (B) => B.x >= i && B.x <= r && B.y >= h && B.y <= m, ee = (B, H) => !(B.x < i && H.x < i || B.x > r && H.x > r || B.y < h && H.y < h || B.y > m && H.y > m);
    a || Pe.clear();
    let X = 0;
    const R = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let B = 0; B < R.length; B++) {
      const H = R[B];
      H && V(d(H)) && (Pe.add(`pt:${B}`), X++);
    }
    const v = (B, H) => g ? V(B) || V(H) || ee(B, H) : V(B) && V(H), z = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], A = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let B = 0; B < z.length; B++) {
      const H = z[B];
      if (A.includes(B)) {
        let fe;
        if (!g) fe = H.every((ke) => {
          const He = R[ke];
          return !!He && V(d(He));
        });
        else {
          fe = false;
          for (let ke = 0; ke < H.length - 1; ke++) {
            const He = R[H[ke]], Ve = R[H[ke + 1]];
            if (!(!He || !Ve) && v(d(He), d(Ve))) {
              fe = true;
              break;
            }
          }
        }
        fe && (Pe.add(`poly:${B}`), X++);
      } else for (let fe = 0; fe < H.length - 1; fe++) {
        const ke = R[H[fe]], He = R[H[fe + 1]];
        !ke || !He || v(d(ke), d(He)) && (Pe.add(`seg:${B}:${fe}`), X++);
      }
    }
    const q = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let B = 0; B < q.length; B++) {
      const H = q[B];
      if (!H || H.length !== 6) continue;
      const ue = d([H[0], H[1], H[2]]), fe = d([H[3], H[4], H[5]]);
      v(ue, fe) && (Pe.add(`aux:${B}`), X++);
    }
    At(), ce(X === 0 && !g ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${g ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${X} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${Pe.size})`), Tt.style.display = "none";
  }, Bn = () => {
    Xt && (Xt = null, Tt.style.display = "none", ce("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Bn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && Xt && Bn();
  });
  const Do = () => {
    var _a2, _b, _c, _d;
    if (Pe.size === 0) return false;
    const t = [...Pe], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? [], r = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
    for (const ee of t) {
      const [X, ...R] = ee.split(":");
      if (X === "pt") r.add(+R[0]);
      else if (X === "poly") h.add(+R[0]);
      else if (X === "seg") {
        const v = +R[0], z = +R[1];
        m.has(v) || m.set(v, /* @__PURE__ */ new Set()), m.get(v).add(z);
      } else X === "aux" && g.add(+R[0]);
    }
    let b = 0, _ = [], d = [];
    const V = /* @__PURE__ */ new Map();
    for (let ee = 0; ee < s.length; ee++) {
      if (h.has(ee)) {
        b++;
        continue;
      }
      V.set(ee, _.length);
      const X = m.get(ee);
      if (X && X.size > 0) {
        let R = [];
        for (let v = 0; v < s[ee].length; v++) R.push(s[ee][v]), v < s[ee].length - 1 && X.has(v) && (R.length >= 2 && _.push(R), R = [], b++);
        (R.length >= 2 || R.length === 1) && _.push(R);
      } else _.push([...s[ee]]);
    }
    if (r.size > 0) {
      const ee = [], X = /* @__PURE__ */ new Map();
      for (let v = 0; v < o.length; v++) {
        if (r.has(v)) {
          b++;
          continue;
        }
        X.set(v, ee.length), ee.push([...o[v]]);
      }
      const R = [];
      for (const v of _) {
        let z = [];
        for (const A of v) {
          const D = X.get(A);
          D === void 0 ? (z.length >= 2 && R.push(z), z = []) : z.push(D);
        }
        z.length >= 2 && R.push(z);
      }
      _ = R, e.points.val = ee;
    }
    for (const ee of n) {
      const X = V.get(ee);
      X !== void 0 && X < _.length && d.push(X);
    }
    if (e.polylines && (e.polylines.val = _), e.areas && (e.areas.val = d), g.size > 0 && a) {
      const ee = i.filter((X, R) => !g.has(R));
      "val" in a ? a.val = ee : window.__hekatanDrawingAuxLines = ee, b += g.size;
    }
    Pe.clear(), At();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ce(`\u{1F5D1} ${b} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Do, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || Pe.size !== 0 && (t.preventDefault(), Do());
  });
  const Rt = document.createElement("div");
  Rt.id = "hk-properties-pane";
  const Bo = "hk-props-pane-pos";
  let Pn = null;
  try {
    const t = localStorage.getItem(Bo);
    t && (Pn = JSON.parse(t));
  } catch {
  }
  Rt.style.cssText = ["position:fixed", Pn ? `left:${Pn.left}px` : "left:14px", Pn ? `top:${Pn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Rt);
  const As = () => {
    const t = Rt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, i = 0;
    t.addEventListener("mousedown", (r) => {
      o = true, s = r.clientX, n = r.clientY;
      const h = Rt.getBoundingClientRect();
      a = h.left, i = h.top, Rt.style.transform = "none", Rt.style.left = `${a}px`, Rt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const h = r.clientX - s, m = r.clientY - n, g = Math.max(0, Math.min(window.innerWidth - 80, a + h)), b = Math.max(0, Math.min(window.innerHeight - 40, i + m));
      Rt.style.left = `${g}px`, Rt.style.top = `${b}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Bo, JSON.stringify({ left: parseFloat(Rt.style.left), top: parseFloat(Rt.style.top) }));
        } catch {
        }
      }
    });
  }, ae = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Et = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let dt = null;
  const bt = (t, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: s, value: n } }));
  }, Es = () => {
    if (dt && (dt.dispose(), dt = null), Pe.size === 0) {
      Rt.style.display = "none";
      return;
    }
    const t = [...Pe], o = t.filter((_) => _.startsWith("pt:")), s = t.filter((_) => _.startsWith("seg:")), n = t.filter((_) => _.startsWith("poly:")), a = t.filter((_) => _.startsWith("aux:")), i = o.length > 0, r = s.length > 0, h = n.length > 0, m = !i && !r && !h, g = [];
    o.length && g.push(`\u{1F535} ${o.length} nodo(s)`), s.length && g.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && g.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && g.push(`\u250A ${a.length} aux`);
    const b = `\u{1F3AF} ${Pe.size} item(s) \u2014 ${g.join(", ")}`;
    dt = new Ms({ container: Rt, title: b });
    {
      const _ = dt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      _.addBinding(Et, "dx", { label: "\u0394x (m)", step: 0.1 }), _.addBinding(Et, "dy", { label: "\u0394y (m)", step: 0.1 }), _.addBinding(Et, "dz", { label: "\u0394z (m)", step: 0.1 }), _.addBinding(Et, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), _.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const X = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Et.dx, Et.dy, Et.dz, Et.copias);
        ce(X ? `\u29C9 Replicado \xD7${X} (\u0394 ${Et.dx},${Et.dy},${Et.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const d = { vuelo: 1.5, losa: true, borde: true, ambos: true }, V = _.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      V.addBinding(d, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), V.addBinding(d, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), V.addBinding(d, "borde", { label: "con viga de borde" }), V.addBinding(d, "ambos", { label: "a los dos lados" }), V.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a2;
        const X = (_a2 = window.__hekatanVoladoSelection) == null ? void 0 : _a2.call(window, d.vuelo, { losa: d.losa, vigaBorde: d.borde, lados: d.ambos ? "ambos" : "afuera" });
        ce(X ? `\u2310 Volado de ${d.vuelo} m en ${X} pa\xF1o(s)` + (d.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), _.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const X = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Et.dx, Et.dy, Et.dz, 1);
        ce(X ? `\u2192 Copia desplazada \u0394 ${Et.dx},${Et.dy},${Et.dz} m` : "\u26A0 Nada seleccionado");
      });
      const ee = _.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      ee.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), ee.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ce(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const _ = dt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      _.addBinding(ae, "Ux"), _.addBinding(ae, "Uy"), _.addBinding(ae, "Uz"), _.addBinding(ae, "Rx"), _.addBinding(ae, "Ry"), _.addBinding(ae, "Rz");
      const d = dt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      d.addBinding(ae, "Kx", { label: "Kx", min: 0, step: 100 }), d.addBinding(ae, "Ky", { label: "Ky", min: 0, step: 100 }), d.addBinding(ae, "Kz", { label: "Kz", min: 0, step: 100 }), d.addBinding(ae, "Krx", { label: "Krx", min: 0, step: 1e3 }), d.addBinding(ae, "Kry", { label: "Kry", min: 0, step: 1e3 }), d.addBinding(ae, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const V = dt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      V.addBinding(ae, "Fx", { step: 0.1 }), V.addBinding(ae, "Fy", { step: 0.1 }), V.addBinding(ae, "Fz", { step: 0.1 }), V.addBinding(ae, "Mx", { step: 0.1 }), V.addBinding(ae, "My", { step: 0.1 }), V.addBinding(ae, "Mz", { step: 0.1 }), dt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ae, "mass", { label: "m", min: 0, step: 1 }), dt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ae, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), dt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let R = 0;
        const v = [ae.Ux, ae.Uy, ae.Uz, ae.Rx, ae.Ry, ae.Rz];
        v.some((D) => D) && (bt("nodes", o, "supports", v), R++);
        const z = [ae.Fx, ae.Fy, ae.Fz, ae.Mx, ae.My, ae.Mz];
        z.some((D) => D !== 0) && (bt("nodes", o, "loads", z), R++);
        const A = [ae.Kx, ae.Ky, ae.Kz, ae.Krx, ae.Kry, ae.Krz];
        if (A.some((D) => D !== 0) && (bt("nodes", o, "springs", A), R++), ae.mass !== 0 && (bt("nodes", o, "mass", ae.mass), R++), ae.diaphragm !== "Ninguno" && (bt("nodes", o, "diaphragm", ae.diaphragm), R++), R === 0) {
          ce("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let D = document.getElementById("hk-prop-toast");
          D || (D = document.createElement("div"), D.id = "hk-prop-toast", D.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(D)), D.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", D.style.background = "rgba(217,119,6,0.97)", D.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            D && (D.style.opacity = "0");
          }, 3200);
        } else ce(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const _ = dt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      _.addBinding(ae, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), _.addBinding(ae, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const d = dt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      d.addBinding(ae, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), d.addBinding(ae, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), d.addBinding(ae, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), d.addBinding(ae, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), dt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ae, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), dt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ae, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const X = dt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      X.addBinding(ae, "relMxI", { label: "Mx I" }), X.addBinding(ae, "relMyI", { label: "My I" }), X.addBinding(ae, "relMzI", { label: "Mz I" });
      const R = dt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      R.addBinding(ae, "relMxJ", { label: "Mx J" }), R.addBinding(ae, "relMyJ", { label: "My J" }), R.addBinding(ae, "relMzJ", { label: "Mz J" }), dt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ae, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const z = dt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      z.addBinding(ae, "LKx", { label: "LKx", min: 0, step: 100 }), z.addBinding(ae, "LKy", { label: "LKy", min: 0, step: 100 }), z.addBinding(ae, "LKz", { label: "LKz", min: 0, step: 100 });
      const A = dt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      A.addBinding(ae, "qx", { step: 0.1 }), A.addBinding(ae, "qy", { step: 0.1 }), A.addBinding(ae, "qz", { step: 0.1 }), dt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ae, "massPerM", { label: "m/L", min: 0, step: 1 }), dt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        bt("segs", s, "section", ae.section), bt("segs", s, "material", ae.material_frame);
        const q = { A: ae.A_mod, Iz: ae.Iz_mod, Iy: ae.Iy_mod, J: ae.J_mod };
        (q.A !== 1 || q.Iz !== 1 || q.Iy !== 1 || q.J !== 1) && bt("segs", s, "modifiers", q), ae.insertionPoint !== "10 \u2014 Centroid" && bt("segs", s, "insertionPoint", ae.insertionPoint), ae.beta !== 0 && bt("segs", s, "beta", ae.beta);
        const B = [ae.relMxI, ae.relMyI, ae.relMzI], H = [ae.relMxJ, ae.relMyJ, ae.relMzJ];
        (B.some((ke) => ke) || H.some((ke) => ke)) && bt("segs", s, "releases", { i: B, j: H }), ae.hinges !== "None" && bt("segs", s, "hinges", ae.hinges);
        const ue = [ae.LKx, ae.LKy, ae.LKz];
        ue.some((ke) => ke !== 0) && bt("segs", s, "lineSprings", ue);
        const fe = [ae.qx, ae.qy, ae.qz];
        fe.some((ke) => ke !== 0) && bt("segs", s, "distLoad", fe), ae.massPerM !== 0 && bt("segs", s, "massPerM", ae.massPerM), ce(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (h) {
      const _ = dt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      _.addBinding(ae, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), _.addBinding(ae, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), _.addBinding(ae, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), dt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ae, "surfLoad", { label: "q", step: 0.1 }), dt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        bt("areas", n, "shellType", ae.shellType), bt("areas", n, "thickness", ae.thickness), bt("areas", n, "material", ae.material_shell), ae.surfLoad !== 0 && bt("areas", n, "surfLoad", ae.surfLoad), ce(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (m) {
      const _ = dt.addFolder({ title: "\u2139 Selecci\xF3n" }), d = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      _.addBinding(d, "msg", { readonly: true, label: "" });
    }
    dt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Pe.clear(), At();
    }), Rt.style.display = "block", As();
  };
  window.__hekatanRefreshPropsPane = Es;
  let mn = null, Xn = false;
  M.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, Xn = false);
  }), M.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !Xn) {
      const o = t.clientX - mn.x, s = t.clientY - mn.y;
      Math.hypot(o, s) > 8 && (Xn = true);
    }
  }), M.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !Xn;
      mn = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Xt ? Bn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Pe.size > 0 && (Pe.clear(), At()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), ce(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : ce("\u238B Cancelado (click derecho)");
      }
    }
  }), M.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), M.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Kt = null, Sn = false));
  }), M.addEventListener("pointermove", (t) => {
    if (Xt && t.buttons === 0) {
      const i = t.clientX < Xt.x;
      po(Xt.x, Xt.y, t.clientX, t.clientY, i);
      return;
    }
    if (!Kt) return;
    const o = t.clientX - Kt.x, s = t.clientY - Kt.y, n = Math.hypot(o, s);
    if (!Sn && n < 8) return;
    Sn = true;
    const a = t.clientX < Kt.x;
    po(Kt.x, Kt.y, t.clientX, t.clientY, a);
  }), M.addEventListener("pointerup", (t) => {
    if (!Kt) return;
    if (!Sn) {
      Kt = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    Ro(Kt.x, Kt.y, t.clientX, t.clientY, o), Kt = null, Sn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Ut = new it();
  Ut.visible = false, Ut.frustumCulled = false, c.add(Ut);
  const Xo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, No = (t, o, s, n) => {
    var _a2, _b, _c, _d;
    for (; Ut.children.length; ) {
      const r = Ut.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Xo[t] ?? 16777215, i = new Se().setFromPoints([new k(-1, -1, 0), new k(1, -1, 0), new k(1, -1, 0), new k(1, 1, 0), new k(1, 1, 0), new k(-1, 1, 0), new k(-1, 1, 0), new k(-1, -1, 0)]);
    Ut.add(new Ht(i, new ft({ color: a, linewidth: 2 }))), Ut.position.set(o, s, n), Ut.visible = true, fo();
  };
  let uo = 4;
  const fo = () => {
    Ut.visible && Ut.scale.setScalar(uo * Dn(Ut.position));
  };
  window.__hekatanOsnapMarkerRef = Ut, window.__hekatanUpdateOsnapScale = fo, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (uo = t, fo(), y()), uo);
  const Nn = () => {
    Ut.visible = false;
  }, Vs = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Wt = document.createElement("div");
  Wt.id = "hk-osnap-etiqueta", Wt.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Wt);
  const Yo = (t, o, s) => {
    const n = Vs[t];
    if (!n) {
      Wt.style.display = "none";
      return;
    }
    Wt.textContent = n, Wt.style.color = "#" + (Xo[t] ?? 16777215).toString(16).padStart(6, "0"), Wt.style.left = o + 18 + "px", Wt.style.top = s - 26 + "px", Wt.style.display = "block";
  }, Ts = () => {
    Wt.style.display = "none";
  }, Cn = new k(), ho = (t, o, s) => {
    const n = p();
    if (!n) return null;
    const a = M.getBoundingClientRect();
    return Cn.set(t, o, s).project(n), !isFinite(Cn.x) || !isFinite(Cn.y) ? null : { x: a.left + (Cn.x * 0.5 + 0.5) * a.width, y: a.top + (-Cn.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = ho;
  const $s = (t, o, s, n, a) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, r = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let m = null;
    const g = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, b = a, _ = (v, z, A, D) => {
      let q;
      if (b) {
        const H = ho(z, A, D);
        if (!H || (q = Math.hypot(H.x - b.x, H.y - b.y), q > kn)) return;
      } else if (q = Math.hypot(z - t, A - o, D - s), q > n) return;
      const B = g[v] ?? 9;
      (!m || B < m.r || B === m.r && q < m.d) && (m = { type: v, x: z, y: A, z: D, d: q, r: B });
    };
    if (i.ori !== false && _("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const v = window.__hekatanGridConfig, z = (v == null ? void 0 : v.minorStep) && v.minorStep > 0 ? v.minorStep : 1, A = ((v == null ? void 0 : v.gridSize) ?? 30) / 2, D = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", q = (H) => Math.round(H / z) * z, B = (H, ue) => Math.abs(H) <= A + 1e-9 && Math.abs(ue) <= A + 1e-9;
      if (D === "xz") {
        const H = q(t), ue = q(s);
        B(H, ue) && _("grid", H, o, ue);
      } else if (D === "yz") {
        const H = q(o), ue = q(s);
        B(H, ue) && _("grid", t, H, ue);
      } else {
        const H = q(t), ue = q(o);
        B(H, ue) && _("grid", H, ue, s);
      }
    }
    (i.node || i.end) && r.forEach((v) => {
      i.node && _("node", v[0], v[1], v[2]);
    });
    for (const v of h) if (!(v.length < 2)) for (let z = 0; z < v.length - 1; z++) {
      const A = r[v[z]], D = r[v[z + 1]];
      if (!(!A || !D) && (i.end && (_("end", A[0], A[1], A[2]), _("end", D[0], D[1], D[2])), i.mid && _("mid", (A[0] + D[0]) / 2, (A[1] + D[1]) / 2, (A[2] + D[2]) / 2), i.nea || i.per)) {
        const q = D[0] - A[0], B = D[1] - A[1], H = D[2] - A[2], ue = q * q + B * B + H * H;
        if (ue < 1e-12) continue;
        const fe = Math.max(0, Math.min(1, ((t - A[0]) * q + (o - A[1]) * B + (s - A[2]) * H) / ue)), ke = A[0] + fe * q, He = A[1] + fe * B, Ve = A[2] + fe * H;
        i.nea && _("nea", ke, He, Ve), i.per && _("per", ke, He, Ve);
      }
    }
    if (i.cen) {
      const v = ((_e2 = e.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const z of v) {
        const A = h[z];
        if (!A || A.length < 3) continue;
        const D = A[0] === A[A.length - 1] ? A.slice(0, -1) : A;
        let q = 0, B = 0, H = 0, ue = 0;
        for (const fe of D) {
          const ke = r[fe];
          ke && (q += ke[0], B += ke[1], H += ke[2], ue++);
        }
        ue >= 3 && _("cen", q / ue, B / ue, H / ue);
      }
    }
    if (i.cen) {
      const v = Mn(), z = [...sn];
      for (const A of v) z.some((D) => Math.hypot(D.c[0] - A.c[0], D.c[1] - A.c[1], D.c[2] - A.c[2]) < 1e-6 && Math.abs(D.r - A.r) < 1e-6) || z.push(A);
      for (const A of z) {
        if (!r.some((B) => Math.abs(Math.hypot(B[0] - A.c[0], B[1] - A.c[1], B[2] - A.c[2]) - A.r) < 1e-6)) continue;
        const q = Math.hypot(t - A.c[0], o - A.c[1], s - A.c[2]);
        if (q < n || Math.abs(q - A.r) < n) {
          const B = Math.min(q, n * 0.5), H = 3;
          (!m || H < m.r || H === m.r && B < m.d) && (m = { type: "cen", x: A.c[0], y: A.c[1], z: A.c[2], d: B, r: H });
        }
      }
    }
    if (i.int) {
      const v = [];
      for (const z of h) for (let A = 0; A < z.length - 1; A++) {
        const D = r[z[A]], q = r[z[A + 1]];
        if (!D || !q) continue;
        const B = q[0] - D[0], H = q[1] - D[1], ue = q[2] - D[2], fe = B * B + H * H + ue * ue;
        if (fe < 1e-12) continue;
        const ke = Math.max(0, Math.min(1, ((t - D[0]) * B + (o - D[1]) * H + (s - D[2]) * ue) / fe));
        Math.hypot(D[0] + ke * B - t, D[1] + ke * H - o, D[2] + ke * ue - s) < 3 * n && v.push([D, q]);
      }
      for (let z = 0; z < v.length; z++) for (let A = z + 1; A < v.length; A++) {
        const [D, q] = v[z], [B, H] = v[A], ue = [q[0] - D[0], q[1] - D[1], q[2] - D[2]], fe = [H[0] - B[0], H[1] - B[1], H[2] - B[2]], ke = [D[0] - B[0], D[1] - B[1], D[2] - B[2]], He = ue[0] * ue[0] + ue[1] * ue[1] + ue[2] * ue[2], Ve = ue[0] * fe[0] + ue[1] * fe[1] + ue[2] * fe[2], et = fe[0] * fe[0] + fe[1] * fe[1] + fe[2] * fe[2], Qe = ue[0] * ke[0] + ue[1] * ke[1] + ue[2] * ke[2], at = fe[0] * ke[0] + fe[1] * ke[1] + fe[2] * ke[2], qe = He * et - Ve * Ve;
        if (qe < 1e-12) continue;
        const Fe = (Ve * at - et * Qe) / qe, je = (He * at - Ve * Qe) / qe;
        if (Fe < -1e-6 || Fe > 1 + 1e-6 || je < -1e-6 || je > 1 + 1e-6) continue;
        const Re = [D[0] + Fe * ue[0], D[1] + Fe * ue[1], D[2] + Fe * ue[2]], Me = [B[0] + je * fe[0], B[1] + je * fe[1], B[2] + je * fe[2]];
        if (Math.hypot(Re[0] - Me[0], Re[1] - Me[1], Re[2] - Me[2]) > 1e-4) continue;
        [D, q, B, H].some((We) => Math.hypot(We[0] - Re[0], We[1] - Re[1], We[2] - Re[2]) < 1e-6) || _("int", Re[0], Re[1], Re[2]);
      }
    }
    const d = window.__hekatanAxisGrids ?? [], V = window.__hekatanLevels ?? [], ee = d.filter((v) => v && v.start && v.end).map((v) => [v.start, v.end]);
    for (const [v, z] of ee) {
      i.end && (_("end", v[0], v[1], v[2]), _("end", z[0], z[1], z[2]));
      const A = z[0] - v[0], D = z[1] - v[1], q = z[2] - v[2], B = A * A + D * D + q * q;
      if (B < 1e-12) continue;
      const H = Math.max(0, Math.min(1, ((t - v[0]) * A + (o - v[1]) * D + (s - v[2]) * q) / B));
      if (i.nea && _("nea", v[0] + H * A, v[1] + H * D, v[2] + H * q), i.int && Math.abs(q) > 1e-9) for (const ue of V) {
        const fe = (ue.z - v[2]) / q;
        fe < -1e-6 || fe > 1 + 1e-6 || _("int", v[0] + fe * A, v[1] + fe * D, ue.z);
      }
    }
    if (i.int || i.node) for (let v = 0; v < ee.length; v++) for (let z = v + 1; z < ee.length; z++) {
      const [A, D] = ee[v], [q, B] = ee[z], H = D[0] - A[0], ue = D[1] - A[1], fe = B[0] - q[0], ke = B[1] - q[1], He = H * ke - ue * fe;
      if (Math.abs(He) < 1e-12) continue;
      const Ve = A[0] - q[0], et = A[1] - q[1], Qe = (fe * et - ke * Ve) / He, at = (H * et - ue * Ve) / He;
      if (Qe < -1e-6 || Qe > 1 + 1e-6 || at < -1e-6 || at > 1 + 1e-6) continue;
      const qe = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      _("int", A[0] + Qe * H, A[1] + Qe * ue, typeof qe == "number" ? qe : s);
    }
    const X = window.__hekatanDrawingAuxLines, R = (X == null ? void 0 : X.rawVal) ?? (X == null ? void 0 : X.val) ?? X ?? [];
    for (const v of R) {
      if (v.length !== 6) continue;
      const z = [v[0], v[1], v[2]], A = [v[3], v[4], v[5]];
      if (i.end && (_("end", z[0], z[1], z[2]), _("end", A[0], A[1], A[2])), i.mid && _("mid", (z[0] + A[0]) / 2, (z[1] + A[1]) / 2, (z[2] + A[2]) / 2), i.nea || i.per) {
        const D = A[0] - z[0], q = A[1] - z[1], B = A[2] - z[2], H = D * D + q * q + B * B;
        if (H < 1e-12) continue;
        const ue = Math.max(0, Math.min(1, ((t - z[0]) * D + (o - z[1]) * q + (s - z[2]) * B) / H)), fe = z[0] + ue * D, ke = z[1] + ue * q, He = z[2] + ue * B;
        i.nea && _("nea", fe, ke, He), i.per && _("per", fe, ke, He);
      }
    }
    return m ? { type: m.type, x: m.x, y: m.y, z: m.z } : null;
  }, wn = new it();
  wn.frustumCulled = false, c.add(wn);
  const Zo = new ft({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
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
        const g = o[+i[1]];
        g && (r = [g, [g[0] + 1e-3, g[1], g[2]]]);
      } else if (i[0] === "seg") {
        const g = s[+i[1]] || [], b = o[g[+i[2]]], _ = o[g[+i[2] + 1]];
        b && _ && (r = [b, _]);
      } else i[0] === "poly" && (r = (s[+i[1]] || []).map((b) => o[b]).filter(Boolean));
      if (r.length < 2) continue;
      const h = new Se().setFromPoints(r.map((g) => new k(g[0], g[1], g[2]))), m = new St(h, Zo);
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
  let Xe = [], gt = 0, ln = 0, kt = null;
  const zn = document.createElement("div");
  zn.id = "hk-cad-status", zn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", zn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(zn);
  const Ls = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), ot && t.push(`\u{1F512} LOCK ${ot.toUpperCase()}`);
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && t.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, ce = (t) => {
    var _a2;
    const o = t + Ls();
    zn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, Is = "Comando:", Rs = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = Xe.length, a = (i, r = []) => ({ txt: i, ops: r });
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
        return a(`\xC1REA LIBRE Precise v\xE9rtice ${ye.length + 1} (Enter o clic derecho cierra y malla):`);
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
        return a(kt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${ln > 0 ? ` (distancia ${ln} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Pe.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Pe.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Pe.size ? a(`SELECCI\xD3N ${Pe.size} objeto${Pe.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a(Is);
    }
  }, Nt = () => {
    var _a2, _b, _c, _d, _e2;
    try {
      const t = Rs(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !s ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, a, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Nt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    ce(o);
  }, window.__hekatanCadResetPending = () => {
    Xe = [], ye = [], O.visible = false, mo(), kt = null, y(), ce("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Nt();
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
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Xe = [], me.visible = false, rt.visible = false, Z();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y(), Nt();
  }, Dt = () => {
    yn.push(wo()), yn.length > 100 && yn.shift(), Yn.length = 0;
  }, Zn = () => {
    const t = yn.pop();
    if (!t) {
      ce("\u21B6 Nada para deshacer");
      return;
    }
    Yn.push(wo()), Ko(t), ce(`\u21B6 Deshacer \u2014 quedan ${yn.length}`);
  }, Go = () => {
    const t = Yn.pop();
    if (!t) {
      ce("\u21B7 Nada para rehacer");
      return;
    }
    yn.push(wo()), Ko(t), ce(`\u21B7 Rehacer \u2014 quedan ${Yn.length}`);
  };
  window.__hekatanPushUndo = Dt, window.__hekatanUndo = Zn, window.__hekatanRedo = Go, document.addEventListener("keydown", (t) => {
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
      if (a.length < 3) return ce("Cerrar necesita al menos tres puntos."), true;
      Dt(), e.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return yo(), ce(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Zn(), true;
      Dt();
      const i = a[a.length - 1], r = a.slice(0, -1), h = n.some((b, _) => _ !== n.length - 1 && b.includes(i)) || r.includes(i);
      let m = e.points.rawVal, g = [...n.slice(0, -1), r];
      if (!h && i === m.length - 1 && (m = m.slice(0, -1), e.points.val = m), e.polylines.val = g, r.length) {
        const b = m[r[r.length - 1]];
        b && (U = [b[0], b[1], b[2]]);
      } else U = null, me.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return y(), ce(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Nt(), true;
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
    Xe = [], kt = null, mo(), ot = null, Ee(), me.visible = false, rt.visible = false, Z(), ce("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), y(), Nt();
  };
  window.__hekatanFinalizeDraw = yo;
  const Ho = () => {
    var _a2, _b, _c;
    Xe = [], ye = [], O.visible = false;
    let t = false;
    Pe.size && (Pe.clear(), At(), t = true), yo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ce(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), y(), Nt();
  };
  window.__hekatanEscapeCancel = Ho;
  const Wo = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Pe.forEach((s) => {
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
    Dt();
    const a = e.points.rawVal.map((i, r) => n.has(r) ? [i[0] + t, i[1] + o, i[2] + s] : i);
    e.points.val = a;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return At(), y(), n.size;
  };
  window.__hekatanMoveSelection = Jo;
  const Oo = (t, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!Pe.size) {
      ce(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Nt();
      return;
    }
    if (Xe.push(o), Xe.length === 1) {
      U = o, ce(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Nt();
      return;
    }
    const [s, n] = Xe, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    Xe = [], me.visible = false;
    let i = 0;
    t === "move" ? i = Jo(a[0], a[1], a[2]) : (i = Wo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), ce(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), t === "move" && (Pe.clear(), At()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Nt();
  };
  window.__hekatanPasoMoverCopiar = Oo;
  const Ds = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Qt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), xo = (t, o, s, n, a, i) => {
    const r = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], h = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], m = [t[0] - s[0], t[1] - s[1], t[2] - s[2]], g = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], b = r[0] * h[0] + r[1] * h[1] + r[2] * h[2], _ = h[0] * h[0] + h[1] * h[1] + h[2] * h[2], d = r[0] * m[0] + r[1] * m[1] + r[2] * m[2], V = h[0] * m[0] + h[1] * m[1] + h[2] * m[2], ee = g * _ - b * b;
    if (ee < 1e-12) return null;
    const X = (b * V - _ * d) / ee, R = (g * V - b * d) / ee;
    if (!a && (X < -1e-6 || X > 1 + 1e-6) || !i && (R < -1e-6 || R > 1 + 1e-6)) return null;
    const v = [t[0] + X * r[0], t[1] + X * r[1], t[2] + X * r[2]], z = [s[0] + R * h[0], s[1] + R * h[1], s[2] + R * h[2]];
    return Qt(v, z) > 1e-4 ? null : v;
  }, Bs = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === t).length, 0);
  }, Xs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Ns = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal, n = e.points.rawVal, a = Xs[t];
    if (!kt) {
      if (Ye < 0) {
        ce(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      kt = { poly: Ye, seg: Math.max(0, Oe) }, ce(t === "offset" ? `DESFASE l\xEDnea #${kt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${ln > 0 ? ` (${ln} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Nt();
      return;
    }
    if (t === "offset") {
      const X = kt.poly, R = s[X];
      if (!R || R.length < 2) {
        kt = null, ce("DESFASE: esa polil\xEDnea no tiene tramos."), Nt();
        return;
      }
      const v = R.length > 2 && R[0] === R[R.length - 1], z = Ds(), A = [];
      for (let Fe = 0; Fe < R.length - 1; Fe++) {
        const je = n[R[Fe]], Re = n[R[Fe + 1]], Me = [Re[0] - je[0], Re[1] - je[1], Re[2] - je[2]], Te = Math.hypot(Me[0], Me[1], Me[2]) || 1, We = Me[0] / Te, $t = Me[1] / Te, Bt = Me[2] / Te, Lt = [z[1] * Bt - z[2] * $t, z[2] * We - z[0] * Bt, z[0] * $t - z[1] * We], Ot = Math.hypot(Lt[0], Lt[1], Lt[2]) || 1;
        A.push({ a: je, b: Re, n: [Lt[0] / Ot, Lt[1] / Ot, Lt[2] / Ot] });
      }
      let D = 0, q = 1 / 0;
      A.forEach((Fe, je) => {
        const Re = nn(o[0], o[1], o[2], Fe.a[0], Fe.a[1], Fe.a[2], Fe.b[0], Fe.b[1], Fe.b[2]);
        Re < q && (q = Re, D = je);
      });
      const B = A[D], H = Math.sign((o[0] - B.a[0]) * B.n[0] + (o[1] - B.a[1]) * B.n[1] + (o[2] - B.a[2]) * B.n[2]) || 1, ue = ln > 0 ? ln : q;
      if (ue < 1e-6) {
        ce("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const fe = A.map((Fe) => ({ a: [Fe.a[0] + H * ue * Fe.n[0], Fe.a[1] + H * ue * Fe.n[1], Fe.a[2] + H * ue * Fe.n[2]], b: [Fe.b[0] + H * ue * Fe.n[0], Fe.b[1] + H * ue * Fe.n[1], Fe.b[2] + H * ue * Fe.n[2]] })), ke = fe.length, He = (Fe) => {
        const je = fe[(Fe - 1 + ke) % ke], Re = fe[Fe % ke];
        return xo(je.a, je.b, Re.a, Re.b, true, true) ?? Re.a;
      }, Ve = [], et = v ? ke : ke + 1;
      for (let Fe = 0; Fe < et; Fe++) !v && Fe === 0 ? Ve.push(fe[0].a) : !v && Fe === ke ? Ve.push(fe[ke - 1].b) : Ve.push(He(Fe));
      Dt();
      const Qe = n.length;
      e.points.val = [...n, ...Ve];
      const at = Ve.map((Fe, je) => Qe + je);
      v && at.push(Qe);
      let qe = s.slice();
      qe.length && qe[qe.length - 1].length === 0 && (qe = qe.slice(0, -1)), e.polylines.val = [...qe, at, []], kt = null, ce(`\u2713 Desfase a ${ue.toFixed(2)} m \u2014 ${ke} tramo${ke === 1 ? "" : "s"} nuevo${ke === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      y(), Nt();
      return;
    }
    let i = Ye, r = Math.max(0, Oe);
    if (i < 0 || i === kt.poly && r === kt.seg) {
      let R = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, s.forEach((v, z) => {
        for (let A = 0; A < v.length - 1; A++) {
          if (z === kt.poly && A === kt.seg) continue;
          const D = n[v[A]], q = n[v[A + 1]];
          if (!D || !q) continue;
          const B = nn(o[0], o[1], o[2], D[0], D[1], D[2], q[0], q[1], q[2]);
          B < R && (R = B, i = z, r = A);
        }
      }), i < 0) {
        ce(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const h = s[kt.poly], m = n[h[kt.seg]], g = n[h[kt.seg + 1]], b = s[i], _ = b[r], d = b[r + 1];
    if (!m || !g || _ == null || d == null) {
      ce(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const V = n[_], ee = n[d];
    if (t === "trim") {
      const X = xo(V, ee, m, g, false, false);
      if (!X) {
        ce("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Dt();
      const R = n.length;
      e.points.val = [...n, X];
      const v = [...b.slice(0, r + 1), R, ...b.slice(r + 1)];
      e.polylines.val = s.map((A, D) => D === i ? v : A);
      const z = Qt(o, V) < Qt(o, ee);
      Ln(i, z ? r : r + 1), ce(`\u2713 Recortado en (${X[0].toFixed(2)}, ${X[1].toFixed(2)}, ${X[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const X = xo(V, ee, m, g, true, false);
      if (!X) {
        ce("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const v = Qt(o, V) < Qt(o, ee) ? r : r + 1;
      if (v !== 0 && v !== b.length - 1) {
        ce("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const z = b[v];
      if (Qt(X, V) + Qt(X, ee) < Qt(V, ee) + 1e-6) {
        ce("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Dt(), Bs(z) > 1) {
        const D = n.length;
        e.points.val = [...n, X];
        const q = b.slice();
        q[v] = D, e.polylines.val = s.map((B, H) => H === i ? q : B);
      } else e.points.val = n.map((D, q) => q === z ? X : D);
      ce(`\u2713 Alargada hasta (${X[0].toFixed(2)}, ${X[1].toFixed(2)}, ${X[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    y(), Nt();
  };
  window.__hekatanSelectionSize = () => Pe.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return Pe.clear(), o >= 0 && Pe.add(`poly:${o}`), At(), ce(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Pe.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Pe.clear();
    const s = /* @__PURE__ */ new Set();
    return t.forEach((n, a) => {
      !n || n.length < 2 || (Pe.add(`poly:${a}`), n.forEach((i) => s.add(i)));
    }), o.forEach((n, a) => {
      s.has(a) || Pe.add(`pt:${a}`);
    }), At(), ce(`SELECCI\xD3N ${Pe.size} objetos (todo el modelo) \xB7 Esc suelta`), Pe.size;
  }, window.__hekatanReplicateSelection = (t, o, s, n, a = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const i = [...Pe], r = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), g = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), _ = [];
    if (i.forEach((R) => {
      if (R.startsWith("pt:")) {
        const v = +R.slice(3);
        r[v] && g.add(v);
      } else if (R.startsWith("poly:")) {
        const v = +R.slice(5);
        if (!h[v] || h[v].length < 2) return;
        b.add(v), h[v].forEach((z) => g.add(z));
      } else if (R.startsWith("seg:")) {
        const v = R.split(":"), z = +v[1], A = +v[2], D = h[z] || [], q = D[A], B = D[A + 1];
        q != null && B != null && (_.push([q, B]), g.add(q), g.add(B));
      }
    }), !g.size) return 0;
    Dt();
    const d = [...r];
    let V = h.slice();
    V.length && V[V.length - 1].length === 0 && (V = V.slice(0, -1));
    const ee = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], X = [...g];
    for (let R = 1; R <= n; R++) {
      const v = a + R, z = t * v, A = o * v, D = s * v, q = /* @__PURE__ */ new Map();
      X.forEach((B) => {
        q.set(B, d.length), d.push([r[B][0] + z, r[B][1] + A, r[B][2] + D]);
      }), b.forEach((B) => {
        const H = h[B].map((fe) => q.has(fe) ? q.get(fe) : fe), ue = V.length;
        V.push(H), m.has(B) && ee.push(ue);
      }), _.forEach(([B, H]) => {
        V.push([q.get(B), q.get(H)]);
      });
    }
    V.push([]), e.points.val = d, e.polylines && (e.polylines.val = V), e.areas && (e.areas.val = ee);
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
    if ([...Pe].forEach((X) => {
      if (X.startsWith("seg:")) {
        const R = X.split(":"), v = +R[1], z = +R[2], A = h[v] || [], D = A[z], q = A[z + 1];
        D != null && q != null && m.push([D, q]);
      } else if (X.startsWith("poly:")) {
        const R = h[+X.slice(5)] || [];
        for (let v = 0; v + 1 < R.length; v++) m.push([R[v], R[v + 1]]);
      }
    }), !m.length) return 0;
    let g = 0, b = 0;
    for (const X of r) g += X[0], b += X[1];
    g /= Math.max(1, r.length), b /= Math.max(1, r.length), Dt();
    const _ = [...r];
    let d = h.slice();
    d.length && d[d.length - 1].length === 0 && (d = d.slice(0, -1));
    const V = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let ee = 0;
    for (const [X, R] of m) {
      const v = r[X], z = r[R];
      if (!v || !z) continue;
      const A = z[0] - v[0], D = z[1] - v[1], q = Math.hypot(A, D);
      if (q < 1e-6) continue;
      let B = -D / q, H = A / q;
      const ue = (v[0] + z[0]) / 2, fe = (v[1] + z[1]) / 2;
      (ue - g) * B + (fe - b) * H < 0 && (B = -B, H = -H);
      const ke = i === "ambos" ? [1, -1] : [1];
      for (const He of ke) {
        const Ve = B * s * He, et = H * s * He, Qe = _.length;
        _.push([v[0] + Ve, v[1] + et, v[2]]);
        const at = _.length;
        _.push([z[0] + Ve, z[1] + et, z[2]]), d.push([X, Qe]), d.push([R, at]), a && d.push([Qe, at]), n && (V.push(d.length), d.push([X, R, at, Qe, X])), ee++;
      }
    }
    if (!ee) return 0;
    d.push([]), e.points.val = _, e.polylines && (e.polylines.val = d), e.areas && (e.areas.val = V);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return y(), ee;
  }, M.addEventListener("click", (t) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: t.clientX, y: t.clientY }, an > 5) {
      an = 0;
      return;
    }
    an = 0;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(E, o);
    const s = de();
    if (!s.length) return;
    {
      const a = o.position.distanceTo(u.target) || 1, i = s[0].distance ?? o.position.distanceTo(s[0].point), r = s[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(a * 12, 300)) {
        ce("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
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
          let g = ot;
          if (!g && m) {
            const b = Math.abs(n.x - h[0]), _ = Math.abs(n.y - h[1]), d = Math.abs(n.z - h[2]);
            g = b >= _ && b >= d ? "x" : _ >= d ? "y" : "z";
          }
          g === "x" ? n = new k(n.x, h[1], h[2]) : g === "y" ? n = new k(h[0], n.y, h[2]) : g === "z" && (n = new k(h[0], h[1], n.z));
        }
      }
    }
    if (Ue && Math.abs(t.clientX - Ue.x) <= 3 && Math.abs(t.clientY - Ue.y) <= 3) n = Ue.p.clone();
    else if (Yt) n = Yt.clone(), ce(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n = new k(i.x, i.y, i.z), ce(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
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
      if (Zt) {
        Xt && Bn();
        const { kind: n, a, b: i } = Zt, r = i !== void 0 ? `${n}:${a}:${i}` : `${n}:${a}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Pe.clear(), Pe.has(r) ? Pe.delete(r) : Pe.add(r), At(), ce(`\u2713 Seleccionados ${Pe.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), a = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Xt ? (Ro(Xt.x, Xt.y, a, i, n), Xt = null) : n || (Xt = { x: a, y: i }, ce("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), po(a, i, a + 1, i + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], ce(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const a = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], a);
      ce(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      Oo(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "delete") {
      if (wt >= 0) {
        const n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = wt;
        if (i >= 0 && i < a.length) {
          Dt();
          const r = a.slice(0, i).concat(a.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = r : window.__hekatanDrawingAuxLines = r, ce(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), wt = -1, ct.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (Ye >= 0) {
        const n = Ye, a = Oe;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (on(n), ce(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : a >= 0 ? (Ln(n, a), ce(`\u{1F5D1} Segmento ${a + 1} de polil\xEDnea #${n + 1} borrado`)) : (on(n), ce(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else ce("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if (Xe.push([t.x, t.y, t.z]), Xe.length === 1) {
        ce("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, a] = Xe, i = Math.hypot(a[0] - n[0], a[1] - n[1], a[2] - n[2]);
      Math.abs(a[0] - n[0]);
      const r = Math.abs(a[1] - n[1]), m = Math.abs(a[2] - n[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", g = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, g, m), ce(`\u2713 C\xEDrculo dibujado en ${m.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${g} segmentos`), Xe = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (s === "arc") {
      if (Xe.push([t.x, t.y, t.z]), Xe.length === 1) {
        ce("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Xe.length === 2) {
        ce("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, a, i] = Xe, r = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, a, i, r), ce(`\u2713 Arco dibujado \u2014 ${r} segmentos`), Xe = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (s === "rect") {
      if (Xe.push([t.x, t.y, t.z]), Xe.length === 1) {
        ce("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Xe;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, a), ce(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Xe = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if (Xe.push([t.x, t.y, t.z]), Xe.length === 1) {
        ce("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Xe;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, a), ce(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Xe = [];
      return;
    }
    if (s === "polyarea") {
      ye.push([t.x, t.y, t.z]), O.geometry.setFromPoints(ye.map((n) => new k(n[0], n[1], n[2]))), O.visible = ye.length >= 1, ce(`\u25B0 \xC1rea libre \u2014 ${ye.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), y();
      return;
    }
    if (s === "plane3") {
      if (Xe.push([t.x, t.y, t.z]), Xe.length < 3) {
        ce(`\u25E3 Plano inclinado \u2014 punto ${Xe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, a, i] = Xe, r = (_o = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o.call(window, n, a, i);
      ce(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Xe = [];
      return;
    }
    if (s === "col") {
      Dt();
      const n = t.z, a = gt && gt > 0 ? gt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + a]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], gt = 0, ce(`\u258C Columna creada \u2014 h=${a.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if (Xe.push([t.x, t.y, t.z]), Xe.length === 1) {
        ce("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, a] = Xe, i = gt && gt > 0 ? gt : 3;
      Dt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [a[0], a[1], a[2]], [a[0], a[1], a[2] + i], [n[0], n[1], n[2] + i]];
      const h = e.polylines.rawVal;
      if (h.length - 1, e.polylines.val = [...h.slice(0, -1), ...h[h.length - 1].length > 0 ? [h[h.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const m = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, m];
      }
      ce(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Xe = [], gt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      Dt();
      const n = gt && gt > 0 ? gt : 3, a = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, a], [t.x, t.y, a + n]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], gt = 0, ce(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, a = vn(t.x, t.y, t.z, n);
      if (!a) {
        ce("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, r = e.points.rawVal, h = i[a.polyIdx], m = r[h[a.segIdx]], g = r[h[a.segIdx + 1]];
      if (!m || !g) {
        ce("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const b = gt && gt > 0 ? gt : 3;
      Dt();
      const _ = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [m[0], m[1], m[2]], [g[0], g[1], g[2]], [g[0], g[1], g[2] + b], [m[0], m[1], m[2] + b]];
      const d = e.polylines.rawVal;
      if (e.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [_, _ + 1, _ + 2, _ + 3, _], []], e.areas) {
        const V = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, V];
      }
      gt = 0, ce(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${b.toFixed(2)}m`);
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
      ce(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if (Xe.push([t.x, t.y, t.z]), Xe.length === 1) {
        ce("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, a] = Xe, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const b = i.rawVal ?? i.val ?? [];
        i.val = [...b, [n[0], n[1], n[2], a[0], a[1], a[2]]];
      }
      const r = a[0] - n[0], h = a[1] - n[1], m = a[2] - n[2], g = Math.sqrt(r * r + h * h + m * m);
      ce(`\u2713 L\xEDnea auxiliar creada \u2014 L=${g.toFixed(2)}m (cyan, no FEM)`), Xe = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Ns(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "chaflan") {
      if (Xe.push([t.x, t.y, t.z]), Xe.length === 1) {
        ce("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Xe, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, a, i, r, 6);
      const h = Math.abs(a[0] - n[0]).toFixed(1), m = Math.abs(a[1] - n[1]).toFixed(1);
      ce(`\u2713 Losa con chaflanes dibujada \u2014 ${h}\xD7${m}m, r=${i}m, ${r} seg/chafl\xE1n`), Xe = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if ($ = false, Dt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, a = n.length - 1, i = n[a] ?? [];
      if (s === "line" && i.length >= 2) {
        ce(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, a]), ce("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") ce(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (s === "line") ce("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") ce("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      ce(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  M.addEventListener("click", () => Nt()), M.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && ye.length >= 3) {
      t.preventDefault();
      const s = pn();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), M.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(E, o);
    const s = de();
    if (be.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], h = r[r.length - 1] ?? [], m = e.points.rawVal ?? [];
        if (h.length > 0) {
          const g = m[h[h.length - 1]];
          if (g) {
            const b = !!window.__hekatanOrthoMode;
            let _ = ot;
            if (!_ && b) {
              const d = Math.abs(n.x - g[0]), V = Math.abs(n.y - g[1]), ee = Math.abs(n.z - g[2]);
              _ = d >= V && d >= ee ? "x" : V >= ee ? "y" : "z";
            }
            _ === "x" ? n.set(n.x, g[1], g[2]) : _ === "y" ? n.set(g[0], n.y, g[2]) : _ === "z" && n.set(g[0], g[1], n.z);
          }
        }
      }
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0.5;
        r && h > 0 && (n.x = Math.round(n.x / h) * h, n.y = Math.round(n.y / h) * h, n.z = Math.round(n.z / h) * h);
      }
      be.geometry.setAttribute("position", new _t(n.toArray(), 3));
    }
    y();
  }), M.addEventListener("pointermove", (t) => {
    var _a2;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(E, o);
    let s = false;
    const n = S.intersectObject(J), a = de();
    if (n.length && a.length) {
      const i = new k(...e.points.rawVal[n[0].index]), r = new k(...a[0].point), h = i.sub(r), m = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      m.transformDirection(K.matrixWorld), Math.abs(h.dot(m)) < 1e-4 && (s = true);
    }
    be.visible = !s;
  });
  let go = false, vo;
  M.addEventListener("pointermove", (t) => {
    var _a2;
    if (!an) return;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(E, o);
    let s = false;
    const n = S.intersectObject(J), a = de();
    if (n.length && a.length) {
      const r = new k(...e.points.rawVal[n[0].index]), h = new k(...a[0].point), m = r.sub(h), g = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      g.transformDirection(K.matrixWorld), Math.abs(m.dot(g)) < 1e-4 && (s = true);
    }
    if (s && an < 5 && (go = true, u.enabled = false, vo = n[0].index), !go || an % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (vo !== void 0) {
      let r = a[0].point;
      (t.ctrlKey || t.metaKey) && (r = new k(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[vo] = r.toArray();
    }
    e.points.val = i;
  }), M.addEventListener("pointerup", () => {
    u.enabled = true, go = false;
  }), M.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(E, o);
    let s = false;
    const n = S.intersectObject(J), a = de();
    if (n.length && a.length) {
      const h = new k(...e.points.rawVal[n[0].index]), m = new k(...a[0].point), g = h.sub(m), b = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      b.transformDirection(K.matrixWorld), Math.abs(g.dot(b)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((h) => h.filter((m) => m !== n[0].index)).map((h) => h.map((m) => m > n[0].index ? m - 1 : m)).filter((h) => h.length);
    r.push([]), e.polylines.val = r;
  });
}
function Ea(e, l, c) {
  const w = Math.round(14.999999999999998), f = { position: e.position.clone(), quaternion: e.quaternion.clone() }, M = setInterval(S, 1e3 / 30);
  let y = 0;
  function S() {
    y++;
    const E = y / w;
    e.position.lerpVectors(f.position, l.position, E), e.quaternion.slerpQuaternions(f.quaternion, l.quaternion, E), c && c(), y == w && clearInterval(M);
  }
}
function Va(e, l, c, p) {
  const u = ca(c, e.elements, p);
  return Q.derive(() => {
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
  const u = new it(), w = new bs();
  w.setColorMap("rainbow");
  const f = new Gt(), M = Q.state([]);
  return Q.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const y = c.val, S = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], E = La(l.frameResults.val);
    if (u.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), u.clear(), !E || S.length === 0 || y.length === 0) {
      M.val = [];
      return;
    }
    const x = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, K = (_c = e.deformOutputs) == null ? void 0 : _c.val, ne = [], ie = [];
    for (let L = 0; L < S.length; L++) {
      if (S[L].length !== 2) continue;
      const he = Ia(E, L, x, K);
      he && (ne.push(he[0], he[1]), ie.push({ idx: L, vals: he }));
    }
    if (ne.length === 0) {
      M.val = [];
      return;
    }
    const j = Math.min(...ne), F = Math.max(...ne);
    w.setMin(j), w.setMax(F), M.val = ne;
    const de = [1 / 0, 1 / 0, 1 / 0], J = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of y) for (let se = 0; se < 3; se++) de[se] = Math.min(de[se], L[se]), J[se] = Math.max(J[se], L[se]);
    const _e = Math.max(J[0] - de[0], J[1] - de[1], J[2] - de[2], 1) * $a, N = [], U = [], W = [];
    let $ = 0;
    for (const { idx: L, vals: se } of ie) {
      const he = S[L], pe = y[he[0]], le = y[he[1]];
      if (!pe || !le) continue;
      const Y = new k(le[0] - pe[0], le[1] - pe[1], le[2] - pe[2]), me = Y.length();
      if (me < 1e-10) continue;
      Y.normalize();
      const O = Math.abs(Y.y) < 0.99 ? new k(0, 1, 0) : new k(1, 0, 0), ye = new k().crossVectors(Y, O).normalize(), ge = new k().crossVectors(Y, ye).normalize(), $e = Fo + 1, ve = Ta;
      for (let Ne = 0; Ne < $e; Ne++) {
        const Ke = Ne / Fo, rt = pe[0] + Y.x * me * Ke, yt = pe[1] + Y.y * me * Ke, P = pe[2] + Y.z * me * Ke, I = se[0] + (se[1] - se[0]) * Ke, te = w.getColor(I) ?? new Gt(0, 0, 0);
        f.copy(te).convertSRGBToLinear();
        for (let C = 0; C < ve; C++) {
          const oe = C / ve * Math.PI * 2, re = Math.cos(oe), we = Math.sin(oe);
          N.push(rt + (ye.x * re + ge.x * we) * _e, yt + (ye.y * re + ge.y * we) * _e, P + (ye.z * re + ge.z * we) * _e), U.push(f.r, f.g, f.b);
        }
      }
      for (let Ne = 0; Ne < Fo; Ne++) for (let Ke = 0; Ke < ve; Ke++) {
        const rt = (Ke + 1) % ve, yt = $ + Ne * ve + Ke, P = $ + Ne * ve + rt, I = $ + (Ne + 1) * ve + Ke, te = $ + (Ne + 1) * ve + rt;
        W.push(yt, P, te), W.push(yt, te, I);
      }
      $ += $e * ve;
    }
    if (N.length === 0) return;
    const T = new Se();
    T.setAttribute("position", new _t(N, 3)), T.setAttribute("color", new _t(U, 3)), T.setIndex(W), T.computeVertexNormals();
    const G = new ut({ vertexColors: true, side: Ct }), Z = new lt(T, G);
    Z.frustumCulled = false, u.add(Z);
  }), u.__colorMapValues = M, u;
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
  const l = new it();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const c = new xn(1, 16, 16), p = new ut({ color: Ya, transparent: true, opacity: 0.85, depthTest: false }), u = new lt(c, p);
  u.visible = false, u.renderOrder = 100, l.add(u);
  const w = new Se(), f = new ft({ color: hs, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), M = new Ht(w, f);
  M.visible = false, M.renderOrder = 100, l.add(M);
  const y = new ut({ color: hs, transparent: true, opacity: 0.7, depthTest: false }), S = new lt(new cs(1, 1, 1, 12), y);
  S.visible = false, S.renderOrder = 100, l.add(S);
  const E = new Se(), x = new ut({ color: Za, transparent: true, opacity: 0.45, side: Ct, depthTest: false }), K = new lt(E, x);
  K.visible = false, K.renderOrder = 100, l.add(K);
  const ne = new Se(), ie = new ft({ color: Ua, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), j = new Ht(ne, ie);
  j.visible = false, j.renderOrder = 100, l.add(j);
  const F = new ut({ color: Jn, transparent: true, opacity: 0.95, depthTest: false }), de = new ut({ color: Jn, transparent: true, opacity: 0.85, depthTest: false }), J = new cs(1, 1, 1, 12), be = new ut({ color: Jn, transparent: true, opacity: 0.55, side: Ct, depthTest: false }), _e = new ft({ color: Jn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), N = [];
  window.__hekatanModelSelection = N;
  const U = new it();
  U.renderOrder = 101, l.add(U);
  const W = document.createElement("div");
  Object.assign(W.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), W.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(W);
  }, 0);
  function $(P) {
    const I = e.derivedNodes.rawVal;
    return !I || P < 0 || P >= I.length ? null : new k(I[P][0], I[P][1], I[P][2]);
  }
  function T(P, I) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const te = e.getActiveCamera();
    if (!te || !e.mesh) return null;
    const C = e.rendererElm.getBoundingClientRect(), oe = P - C.left, re = I - C.top, we = e.derivedNodes.rawVal, xe = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!we || !xe) return null;
    const Le = /* @__PURE__ */ new Map(), Ae = (Ue) => {
      if (Le.has(Ue)) return Le.get(Ue);
      const Ce = $(Ue);
      if (!Ce) return Le.set(Ue, null), null;
      const Ee = Ce.clone().project(te), Je = (Ee.x * 0.5 + 0.5) * C.width, ze = (-Ee.y * 0.5 + 0.5) * C.height, pt = { x: Je, y: ze, z: Ee.z };
      return Le.set(Ue, pt), pt;
    }, De = /* @__PURE__ */ new Set();
    for (const Ue of xe) if (Ue) for (const Ce of Ue) De.add(Ce);
    const Ze = 8;
    let Ie = -1, nt = Ze;
    for (let Ue = 0; Ue < we.length; Ue++) {
      if (!De.has(Ue)) continue;
      const Ce = Ae(Ue);
      if (!Ce || Ce.z < -1 || Ce.z > 1) continue;
      const Ee = Ce.x - oe, Je = Ce.y - re, ze = Math.sqrt(Ee * Ee + Je * Je);
      ze < nt && (nt = ze, Ie = Ue);
    }
    const Be = Da(), tt = Xa[Be.dispUnit] ?? 1e3, Ge = Ba[Be.forceUnit] ?? 1;
    if (Ie >= 0) {
      const Ue = we[Ie];
      let Ce = `Nodo ${Ie}
(${Ue[0].toFixed(3)}, ${Ue[1].toFixed(3)}, ${Ue[2].toFixed(3)})`;
      const Ee = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Ee == null ? void 0 : Ee.deformations) {
        const Je = Ee.deformations.get(Ie);
        if (Je && (Ce += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ce += `
Ux = ${vt(Je[0] * tt, 3)} ${Be.dispUnit}`, Ce += `
Uy = ${vt(Je[1] * tt, 3)} ${Be.dispUnit}`, Ce += `
Uz = ${vt(Je[2] * tt, 3)} ${Be.dispUnit}`, (Math.abs(Je[3]) > 1e-9 || Math.abs(Je[4]) > 1e-9 || Math.abs(Je[5]) > 1e-9) && (Ce += `
Rx = ${vt(Je[3] * 1e3, 3)} mrad`, Ce += `
Ry = ${vt(Je[4] * 1e3, 3)} mrad`, Ce += `
Rz = ${vt(Je[5] * 1e3, 3)} mrad`)), Ee.reactions) {
          const ze = Ee.reactions.get(Ie);
          ze && (Math.abs(ze[0]) > 1e-9 || Math.abs(ze[1]) > 1e-9 || Math.abs(ze[2]) > 1e-9 || Math.abs(ze[3]) > 1e-6 || Math.abs(ze[4]) > 1e-6 || Math.abs(ze[5]) > 1e-6) && (Ce += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ce += `
Fx = ${vt(ze[0] * Ge)} ${Be.forceUnit}`, Ce += `
Fy = ${vt(ze[1] * Ge)} ${Be.forceUnit}`, Ce += `
Fz = ${vt(ze[2] * Ge)} ${Be.forceUnit}`, (Math.abs(ze[3]) > 1e-6 || Math.abs(ze[4]) > 1e-6 || Math.abs(ze[5]) > 1e-6) && (Ce += `
Mx = ${vt(ze[3] * Ge)} ${Be.forceUnit}\xB7m`, Ce += `
My = ${vt(ze[4] * Ge)} ${Be.forceUnit}\xB7m`, Ce += `
Mz = ${vt(ze[5] * Ge)} ${Be.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ie, info: Ce };
    }
    const en = 5;
    let st = -1, ot = en, Yt = "frame";
    for (let Ue = 0; Ue < xe.length; Ue++) {
      const Ce = xe[Ue];
      if (!(!Ce || Ce.length < 2)) {
        if (Ce.length === 2) {
          const Ee = Ae(Ce[0]), Je = Ae(Ce[1]);
          if (!Ee || !Je || Ee.z < -1 || Ee.z > 1 || Je.z < -1 || Je.z > 1) continue;
          const ze = Ka(oe, re, Ee.x, Ee.y, Je.x, Je.y);
          ze < ot && (ot = ze, st = Ue, Yt = "frame");
        } else if (Ce.length === 3 || Ce.length === 4) {
          const Ee = [];
          let Je = true;
          for (const ze of Ce) {
            const pt = Ae(ze);
            if (!pt || pt.z < -1 || pt.z > 1) {
              Je = false;
              break;
            }
            Ee.push(pt);
          }
          if (!Je) continue;
          if (Ga(oe, re, Ee)) {
            const pt = Ee.reduce((mt, ct) => mt + ct.z, 0) / Ee.length * 1e-3;
            pt < ot && (ot = pt, st = Ue, Yt = "shell");
          }
        } else if (Ce.length === 8) {
          const Ee = [];
          let Je = true;
          for (const Ye of Ce) {
            const Oe = Ae(Ye);
            if (!Oe || Oe.z < -1 || Oe.z > 1) {
              Je = false;
              break;
            }
            Ee.push(Oe);
          }
          if (!Je) continue;
          const ze = Math.min(...Ee.map((Ye) => Ye.x)), pt = Math.max(...Ee.map((Ye) => Ye.x)), mt = Math.min(...Ee.map((Ye) => Ye.y)), ct = Math.max(...Ee.map((Ye) => Ye.y));
          if (oe >= ze && oe <= pt && re >= mt && re <= ct) {
            const Oe = Ee.reduce((wt, Pe) => wt + Pe.z, 0) / Ee.length * 1e-3;
            Oe < ot && (ot = Oe, st = Ue, Yt = "solid");
          }
        }
      }
    }
    if (st >= 0) {
      const Ue = xe[st];
      let Ee = `${Yt === "frame" ? "Frame" : Yt === "shell" ? "Shell" : "Solid"} ${st}`;
      const Je = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, ze = (_g = (_f = Je == null ? void 0 : Je.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, st);
      if (ze) {
        ze.name && (Ee += `
  \u{1F4CB} ${ze.name}`), ze.shape && (Ee += `
  Shape: ${ze.shape}`);
        const pt = /concrete|hormig|rect.*sólida/i.test(ze.shape || ""), mt = pt ? 100 : 1e3, ct = pt ? "cm" : "mm", Ye = (wt) => {
          const Pe = wt * mt;
          return Math.abs(Pe - Math.round(Pe)) < 0.05 ? `${Math.round(Pe)}` : `${Pe.toFixed(1)}`;
        }, Oe = [];
        if (ze.D != null && Oe.push(`D=${Ye(ze.D)}`), ze.B != null && Oe.push(`B=${Ye(ze.B)}`), ze.TF != null && Oe.push(`TF=${Ye(ze.TF)}`), ze.TW != null && Oe.push(`TW=${Ye(ze.TW)}`), ze.t != null && Oe.push(`t=${Ye(ze.t)}`), Oe.length && (Ee += `
  Dim: ${Oe.join(" ")} ${ct}`), ze.material) {
          let wt = ze.material;
          ze.fillMaterial && (wt += ` + FILL "${ze.fillMaterial}"`), Ee += `
  Mat: ${wt}`;
        }
      } else {
        const pt = (_i = (_h = Je == null ? void 0 : Je.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, st), mt = (_k = (_j = Je == null ? void 0 : Je.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, st);
        pt ? (Ee += `
  ${pt}`, mt && !pt.includes(mt) && (Ee += `  (${mt})`)) : mt && (Ee += `
  Material: ${mt}`);
      }
      if (Ee += `
nodos: [${Ue.join(", ")}]`, Yt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const pt = e.mesh.analyzeOutputs.rawVal, mt = Na[Be.stressUnit] ?? 1, ct = [["bendingXX", "Mxx", Ge, `${Be.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ge, `${Be.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ge, `${Be.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ge, `${Be.forceUnit}/m`], ["membraneYY", "Nyy", Ge, `${Be.forceUnit}/m`], ["membraneXY", "Nxy", Ge, `${Be.forceUnit}/m`], ["shearX", "Qx", Ge, `${Be.forceUnit}/m`], ["shearY", "Qy", Ge, `${Be.forceUnit}/m`], ["vonMises", "\u03C3VM", mt, Be.stressUnit], ["pressure", "p", mt, Be.stressUnit]], Ye = [];
        for (const [Oe, wt, Pe, zt] of ct) {
          const Mt = pt == null ? void 0 : pt[Oe];
          if (Mt && Mt instanceof Map) {
            const It = Mt.get(st);
            if (It != null) {
              if (typeof It == "number") Ye.push(`${wt} = ${vt(It * Pe, 3)} ${zt}`);
              else if (Array.isArray(It)) {
                let Ft = It[0];
                for (const Vt of It) Math.abs(Vt) > Math.abs(Ft) && (Ft = Vt);
                Ye.push(`${wt} = ${vt(Ft * Pe, 3)} ${zt}`);
              }
            }
          }
        }
        Ye.length > 0 && (Ee += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ye.slice(0, 8).join(`
`));
      }
      if (Yt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const pt = e.mesh.deformOutputs.rawVal, mt = e.mesh.elementInputs.rawVal, ct = pt == null ? void 0 : pt.deformations;
        if (ct && Ue.length === 2) {
          const Ye = ct.get(Ue[0]), Oe = ct.get(Ue[1]), wt = we[Ue[0]], Pe = we[Ue[1]];
          if (Ye && Oe && wt && Pe) {
            const zt = Pe[0] - wt[0], Mt = Pe[1] - wt[1], It = Pe[2] - wt[2], Ft = Math.sqrt(zt * zt + Mt * Mt + It * It);
            if (Ft > 1e-9) {
              const Vt = zt / Ft, tn = Mt / Ft, Zt = It / Ft, gn = (Oe[0] - Ye[0]) * Vt + (Oe[1] - Ye[1]) * tn + (Oe[2] - Ye[2]) * Zt, At = ((_n = mt.elasticities) == null ? void 0 : _n.get(st)) ?? 0, nn = ((_o = mt.areas) == null ? void 0 : _o.get(st)) ?? 0, vn = ((_p = mt.momentsOfInertiaY) == null ? void 0 : _p.get(st)) ?? 0, $n = ((_q = mt.momentsOfInertiaZ) == null ? void 0 : _q.get(st)) ?? 0, so = ((_r = mt.torsionalConstants) == null ? void 0 : _r.get(st)) ?? 0, ao = ((_s2 = mt.shearModuli) == null ? void 0 : _s2.get(st)) ?? At / 2.6, on = At * nn * (gn / Ft), Ln = (Oe[3] - Ye[3]) * Vt + (Oe[4] - Ye[4]) * tn + (Oe[5] - Ye[5]) * Zt, sn = ao * so * (Ln / Ft), In = Oe[4] - Ye[4], Rn = Oe[5] - Ye[5], Mn = At * vn * In / Ft, pn = At * $n * Rn / Ft;
              Ee += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ee += `
L = ${vt(Ft, 3)} m`, Ee += `
\u0394L = ${vt(gn * tt, 3)} ${Be.dispUnit}`, Ee += `
\u03B5 = ${vt(gn / Ft, 6)}`, Math.abs(on) > 1e-6 && (Ee += `
N \u2248 ${vt(on * Ge)} ${Be.forceUnit}`), Math.abs(sn) > 1e-6 && (Ee += `
T \u2248 ${vt(sn * Ge)} ${Be.forceUnit}\xB7m`), Math.abs(Mn) > 1e-6 && (Ee += `
My \u2248 ${vt(Mn * Ge)} ${Be.forceUnit}\xB7m`), Math.abs(pn) > 1e-6 && (Ee += `
Mz \u2248 ${vt(pn * Ge)} ${Be.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Yt, idx: st, info: Ee };
    }
    return null;
  }
  function G(P, I, te) {
    var _a2, _b, _c;
    if (u.visible = false, M.visible = false, S.visible = false, K.visible = false, j.visible = false, !P || !e.mesh) {
      W.style.display = "none", e.render();
      return;
    }
    const C = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (P.type === "node") {
      const xe = $(P.idx);
      if (xe) {
        const Le = e.derivedNodes.rawVal ?? [];
        let Ae = 1;
        if (Le.length >= 2) {
          let Ie = [1 / 0, 1 / 0, 1 / 0], nt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Be of Le) for (let tt = 0; tt < 3; tt++) Be[tt] < Ie[tt] && (Ie[tt] = Be[tt]), Be[tt] > nt[tt] && (nt[tt] = Be[tt]);
          Ae = Math.max(nt[0] - Ie[0], nt[1] - Ie[1], nt[2] - Ie[2], 0.1);
        }
        const De = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Ze = 0.021 * Ae * De;
        u.position.copy(xe), u.scale.setScalar(Ze), u.visible = true;
      }
    } else if (P.type === "frame" && C) {
      const xe = C[P.idx], Le = $(xe[0]), Ae = $(xe[1]);
      if (Le && Ae) {
        const De = Le.clone().add(Ae).multiplyScalar(0.5), Ze = Ae.clone().sub(Le), Ie = Ze.length(), tt = e.getActiveCamera().position.distanceTo(De) * 35e-4;
        S.position.copy(De);
        const Ge = new k(0, 1, 0), en = Ge.clone().cross(Ze).normalize(), st = Ge.angleTo(Ze);
        S.quaternion.setFromAxisAngle(en, st), S.scale.set(tt, Ie, tt), S.visible = true;
      }
    } else if (P.type === "shell" && C) {
      const xe = C[P.idx], Le = [], Ae = [];
      for (const De of xe) {
        const Ze = $(De);
        if (!Ze) return;
        Le.push(Ze.x, Ze.y, Ze.z);
      }
      xe.length === 4 ? Ae.push(0, 1, 2, 0, 2, 3) : xe.length === 3 && Ae.push(0, 1, 2), E.setAttribute("position", new _t(Le, 3)), E.setIndex(Ae), E.computeVertexNormals(), K.visible = true;
    } else if (P.type === "solid" && C) {
      const xe = C[P.idx], Le = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ae = [];
      for (const [De, Ze] of Le) {
        const Ie = $(xe[De]), nt = $(xe[Ze]);
        Ie && nt && Ae.push(Ie.x, Ie.y, Ie.z, nt.x, nt.y, nt.z);
      }
      ne.setAttribute("position", new _t(Ae, 3)), j.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      W.style.display = "none", e.render();
      return;
    }
    W.textContent = P.info, W.style.whiteSpace = "pre-line", W.style.display = "block";
    const re = e.rendererElm.getBoundingClientRect(), we = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? re;
    W.style.left = `${I - we.left}px`, W.style.top = `${te - we.top}px`, e.render();
  }
  let Z = "", L = 0, se = 0;
  const he = window.__hekatanHoverDebug ?? false, pe = (P) => {
    L && cancelAnimationFrame(L), L = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const I = T(P.clientX, P.clientY);
      if (he && se < 5) {
        const C = e.derivedNodes.rawVal, oe = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${P.clientX}, ${P.clientY}) nodes=${(C == null ? void 0 : C.length) ?? 0} elems=${(oe == null ? void 0 : oe.length) ?? 0} hover=`, I), se++;
      }
      const te = I ? `${I.type}:${I.idx}` : "";
      if (te !== Z) Z = te, G(I, P.clientX, P.clientY);
      else if (I) {
        const C = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        W.style.left = `${P.clientX - C.left}px`, W.style.top = `${P.clientY - C.top}px`;
      }
    });
  };
  let le = null;
  const Y = () => {
    Z = "", u.visible = false, M.visible = false, S.visible = false, K.visible = false, j.visible = false, W.style.display = "none", e.render();
  }, me = (P) => {
    const I = e.rendererElm.getBoundingClientRect(), te = P.clientX - I.left, C = P.clientY - I.top;
    (te < -2 || C < -2 || te > I.width + 2 || C > I.height + 2) && (le && clearTimeout(le), le = window.setTimeout(Y, 200));
  }, O = () => {
    le && (clearTimeout(le), le = null);
  };
  e.rendererElm.addEventListener("pointermove", pe), e.rendererElm.addEventListener("pointerleave", me), e.rendererElm.addEventListener("pointerenter", O);
  function ye() {
    var _a2, _b, _c;
    const P = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return P === "select" || P === "none" || !P;
  }
  let ge = null;
  e.rendererElm.addEventListener("pointerdown", (P) => {
    P.button === 0 && (ge = { x: P.clientX, y: P.clientY });
  }), e.rendererElm.addEventListener("pointerup", (P) => {
    if (P.button !== 0 || !ge) return;
    const I = P.clientX - ge.x, te = P.clientY - ge.y;
    if (ge = null, I * I + te * te > 9 || !ye()) return;
    const C = T(P.clientX, P.clientY);
    C ? (rt({ type: C.type, idx: C.idx }, P.shiftKey), Ke()) : yt();
  }), window.addEventListener("keydown", (P) => {
    if (P.key !== "Escape" || !N.length) return;
    const I = document.activeElement, te = !!I && (I.id === "hk3-cmd-input" || I.id === "hk-dyn-input") && I.value === "";
    I && (I.tagName === "INPUT" || I.tagName === "TEXTAREA" || I.isContentEditable) && !te || yt();
  }, { capture: true });
  function $e() {
    for (const P of U.children.slice()) {
      U.remove(P);
      const I = P.geometry;
      I && I !== c && I !== J && I.dispose();
    }
  }
  const ve = (P) => {
    var _a2;
    const I = e.getActiveCamera(), te = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return I.isOrthographicCamera ? (I.top - I.bottom) / (I.zoom || 1) / te : 2 * I.position.distanceTo(P) * Math.tan((I.fov || 50) * Math.PI / 180 / 2) / te;
  };
  function Ne(P, I) {
    var _a2, _b;
    const te = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (P.type === "node") {
      const C = $(P.idx);
      if (!C) return;
      const oe = new lt(c, F);
      oe.position.copy(C), oe.scale.setScalar(Math.max(1e-4, 7 * ve(C))), oe.renderOrder = 101, U.add(oe);
    } else if (P.type === "frame" && te) {
      const C = te[P.idx], oe = $(C[0]), re = $(C[1]);
      if (!oe || !re) return;
      const we = oe.clone().add(re).multiplyScalar(0.5), xe = re.clone().sub(oe), Le = xe.length(), Ae = e.getActiveCamera().position.distanceTo(we), De = new lt(J, de);
      De.position.copy(we);
      const Ze = new k(0, 1, 0);
      De.quaternion.setFromAxisAngle(Ze.clone().cross(xe).normalize(), Ze.angleTo(xe)), De.scale.set(Ae * 35e-4, Le, Ae * 35e-4), De.renderOrder = 101, U.add(De);
    } else if (P.type === "shell" && te) {
      const C = te[P.idx], oe = [], re = [];
      for (const Le of C) {
        const Ae = $(Le);
        if (!Ae) return;
        oe.push(Ae.x, Ae.y, Ae.z);
      }
      C.length === 4 ? re.push(0, 1, 2, 0, 2, 3) : C.length === 3 && re.push(0, 1, 2);
      const we = new Se();
      we.setAttribute("position", new _t(oe, 3)), we.setIndex(re), we.computeVertexNormals();
      const xe = new lt(we, be);
      xe.renderOrder = 101, U.add(xe);
    } else if (P.type === "solid" && te) {
      const C = te[P.idx], oe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], re = [];
      for (const [Le, Ae] of oe) {
        const De = $(C[Le]), Ze = $(C[Ae]);
        De && Ze && re.push(De.x, De.y, De.z, Ze.x, Ze.y, Ze.z);
      }
      const we = new Se();
      we.setAttribute("position", new _t(re, 3));
      const xe = new Ht(we, _e);
      xe.renderOrder = 101, U.add(xe);
    }
  }
  function Ke() {
    if ($e(), !N.length || !e.mesh) {
      e.render();
      return;
    }
    const P = e.derivedNodes.rawVal ?? [];
    if (P.length >= 2) {
      const I = [1 / 0, 1 / 0, 1 / 0], te = [-1 / 0, -1 / 0, -1 / 0];
      for (const C of P) for (let oe = 0; oe < 3; oe++) C[oe] < I[oe] && (I[oe] = C[oe]), C[oe] > te[oe] && (te[oe] = C[oe]);
      Math.max(te[0] - I[0], te[1] - I[1], te[2] - I[2], 0.1);
    }
    for (const I of N) Ne(I);
    e.render();
  }
  function rt(P, I) {
    const te = N.findIndex((C) => C.type === P.type && C.idx === P.idx);
    te >= 0 ? N.splice(te, 1) : I || N.push(P), N.length && N[N.length - 1];
  }
  function yt() {
    N.length = 0, Ke();
  }
  return Q.derive(() => {
    e.derivedNodes.val, N.length && Ke();
  }), l;
}
function Ka(e, l, c, p, u, w) {
  const f = u - c, M = w - p, y = f * f + M * M;
  if (y < 1e-9) {
    const ie = e - c, j = l - p;
    return Math.sqrt(ie * ie + j * j);
  }
  let S = ((e - c) * f + (l - p) * M) / y;
  S = Math.max(0, Math.min(1, S));
  const E = c + S * f, x = p + S * M, K = e - E, ne = l - x;
  return Math.sqrt(K * K + ne * ne);
}
function Ga(e, l, c) {
  let p = false;
  for (let u = 0, w = c.length - 1; u < c.length; w = u++) {
    const f = c[u].x, M = c[u].y, y = c[w].x, S = c[w].y;
    M > l != S > l && e < (y - f) * (l - M) / (S - M + 1e-12) + f && (p = !p);
  }
  return p;
}
const Ha = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Wa = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, rn = 1e-3;
function On(e, l) {
  return l === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : l === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function Ja(e, l) {
  const c = Math.abs(l[0] - e[0]);
  return Math.abs(l[1] - e[1]) < rn ? { plano: "XZ", en: e[1] } : c < rn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function Oa(e, l) {
  var _a2, _b;
  let c = null, p = { plano: "XZ", en: 0 };
  const u = () => {
    var _a3, _b2;
    const x = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !x || x === "none" ? null : String(x).replace(/^contour:/, "");
  }, w = (x) => {
    var _a3, _b2;
    const K = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ne = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], ie = /* @__PURE__ */ new Set();
    for (const j of ne) {
      if (j.length !== 2) continue;
      const F = K[j[0]], de = K[j[1]];
      if (!F || !de) continue;
      const J = On(F, x), be = On(de, x);
      Math.abs(J.fuera - be.fuera) < rn && ie.add(Math.round(J.fuera * 1e3) / 1e3);
    }
    return [...ie].sort((j, F) => j - F);
  };
  function f(x) {
    var _a3, _b2;
    if (x == null ? void 0 : x.plano) p = { plano: x.plano, en: x.en ?? w(x.plano)[0] ?? 0 };
    else {
      const ne = [...window.__hekatanModelSelection ?? []].reverse().find((F) => F.type === "frame"), ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], j = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      ne && j[ne.idx] && ie[j[ne.idx][0]] && ie[j[ne.idx][1]] ? p = Ja(ie[j[ne.idx][0]], ie[j[ne.idx][1]]) : p = { plano: "XZ", en: w("XZ")[0] ?? 0 };
    }
    c || M(), c.hidden = false, y();
  }
  function M() {
    c = document.createElement("div"), c.id = "hk-diagrama-2d", c.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), c.innerHTML = `
      <div class="hk-d2-bar" style="display:flex;align-items:center;gap:10px;padding:7px 10px;
           background:#141a24;border-bottom:1px solid #2f3b50;cursor:move;user-select:none">
        <b style="color:#e6c463">\u{1F4D0} Diagrama 2D</b>
        <span class="hk-d2-tit" style="color:#9fb0c6"></span>
        <label style="margin-left:auto">plano
          <select class="hk-d2-plano" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px">
            <option value="XZ">Alzado XZ</option><option value="YZ">Alzado YZ</option><option value="XY">Planta XY</option>
          </select></label>
        <label>en <select class="hk-d2-en" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"></select></label>
        <button class="hk-d2-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button>
      </div>
      <svg class="hk-d2-svg" style="flex:1;width:100%;height:100%"></svg>
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(c), c.querySelector(".hk-d2-x").addEventListener("click", () => {
      c.hidden = true;
    });
    const x = c.querySelector(".hk-d2-plano"), K = c.querySelector(".hk-d2-en");
    x.addEventListener("change", () => {
      p = { plano: x.value, en: w(x.value)[0] ?? 0 }, y();
    }), K.addEventListener("change", () => {
      p.en = Number(K.value), y();
    });
    const ne = c.querySelector(".hk-d2-bar");
    let ie = null;
    ne.addEventListener("pointerdown", (j) => {
      if (j.target.closest("select,button")) return;
      const F = c.getBoundingClientRect();
      ie = { x: j.clientX, y: j.clientY, l: F.left, t: F.top }, c.style.transform = "none", c.style.left = F.left + "px", c.style.top = F.top + "px";
    }), window.addEventListener("pointermove", (j) => {
      !ie || !c || (c.style.left = ie.l + j.clientX - ie.x + "px", c.style.top = ie.t + j.clientY - ie.y + "px");
    }), window.addEventListener("pointerup", () => {
      ie = null;
    }), new ResizeObserver(() => {
      c && !c.hidden && y();
    }).observe(c);
  }
  function y() {
    var _a3, _b2, _c, _d;
    if (!c || c.hidden) return;
    const x = c.querySelector(".hk-d2-svg"), K = c.querySelector(".hk-d2-tit"), ne = c.querySelector(".hk-d2-pie"), ie = c.querySelector(".hk-d2-plano"), j = c.querySelector(".hk-d2-en");
    ie.value = p.plano;
    const F = w(p.plano), de = p.plano === "XZ" ? "y" : p.plano === "YZ" ? "x" : "z";
    j.innerHTML = F.map((C) => `<option value="${C}" ${Math.abs(C - p.en) < rn ? "selected" : ""}>${de} = ${C.toFixed(2)} m</option>`).join("");
    const J = u(), be = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], _e = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], N = J ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[J] : null;
    x.innerHTML = "";
    const U = x.clientWidth || 880, W = x.clientHeight || 480, $ = [];
    if (_e.forEach((C, oe) => {
      if (C.length !== 2) return;
      const re = be[C[0]], we = be[C[1]];
      if (!re || !we) return;
      const xe = On(re, p.plano), Le = On(we, p.plano);
      Math.abs(xe.fuera - p.en) < rn && Math.abs(Le.fuera - p.en) < rn && $.push({ i: oe, a: xe, b: Le });
    }), !$.length) {
      ne.textContent = "No hay barras en este plano.", K.textContent = "";
      return;
    }
    let T = 1 / 0, G = -1 / 0, Z = 1 / 0, L = -1 / 0;
    for (const C of $) for (const oe of [C.a, C.b]) T = Math.min(T, oe.u), G = Math.max(G, oe.u), Z = Math.min(Z, oe.v), L = Math.max(L, oe.v);
    const se = G - T || 1, he = L - Z || 1, pe = 70, le = Math.min((U - 2 * pe) / se, (W - 2 * pe) / he), Y = (U - se * le) / 2, me = (W - he * le) / 2, O = (C) => Y + (C - T) * le, ye = (C) => W - (me + (C - Z) * le), ge = "http://www.w3.org/2000/svg", $e = (C, oe, re) => {
      const we = document.createElementNS(ge, C);
      for (const xe in oe) we.setAttribute(xe, String(oe[xe]));
      return re != null && (we.textContent = re), x.appendChild(we), we;
    };
    let ve = 0;
    if (N) for (const C of $) {
      const oe = N instanceof Map ? N.get(C.i) : N[C.i];
      oe && (ve = Math.max(ve, Math.abs(oe[0] ?? 0), Math.abs(oe[1] ?? 0)));
    }
    const Ne = 0.12 * Math.max(se, he) * le, Ke = ve > 0 ? Ne / ve : 0, rt = J === "bendingsY" || J === "bendingsZ", yt = (C) => Math.abs(C) >= 100 ? C.toFixed(1) : Math.abs(C) >= 10 ? C.toFixed(2) : C.toFixed(3), P = [];
    for (const C of $) {
      const oe = O(C.a.u), re = ye(C.a.v), we = O(C.b.u), xe = ye(C.b.v), Le = Math.hypot(we - oe, xe - re) || 1;
      let Ae = (xe - re) / Le, De = -(we - oe) / Le;
      rt && De < 0 && (Ae = -Ae, De = -De);
      const Ze = N ? N instanceof Map ? N.get(C.i) : N[C.i] : null, Ie = Ze ? Number(Ze[0] ?? 0) : 0, nt = Ze ? -Number(Ze[1] ?? 0) : 0;
      if (Ze && Ke > 0) {
        const tt = [oe + Ae * Ie * Ke * 1, re + De * Ie * Ke * 1], Ge = [we + Ae * nt * Ke * 1, xe + De * nt * Ke * 1], ot = Ie + nt >= 0 ? "#3fa7d6" : "#d9534f";
        $e("polygon", { points: `${oe},${re} ${tt[0]},${tt[1]} ${Ge[0]},${Ge[1]} ${we},${xe}`, fill: ot, "fill-opacity": 0.38, stroke: ot, "stroke-width": 1.2 }), P.push({ x: tt[0] + Ae * 12, y: tt[1] + De * 12, t: yt(Ie), peso: Math.abs(Ie) }), P.push({ x: Ge[0] + Ae * 12, y: Ge[1] + De * 12, t: yt(nt), peso: Math.abs(nt) });
      }
      $e("line", { x1: oe, y1: re, x2: we, y2: xe, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" });
    }
    for (const C of $) for (const oe of [C.a, C.b]) p.plano !== "XY" && Math.abs(oe.v - Z) < rn && $e("rect", { x: O(oe.u) - 6, y: ye(oe.v), width: 12, height: 7, fill: "#b03a3a" });
    const I = [];
    P.sort((C, oe) => oe.peso - C.peso);
    for (const C of P) C.peso < 0.02 * ve || I.some((oe) => Math.hypot(oe.x - C.x, oe.y - C.y) < 34) || (I.push(C), $e("text", { x: C.x, y: C.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, C.t));
    const te = J ? Ha[J] ?? J : "sin resultado";
    K.textContent = `${te} \xB7 ${p.plano === "XY" ? "planta" : "alzado"} ${p.plano} en ${de} = ${p.en.toFixed(2)} m`, ne.textContent = J ? `${$.length} barras en el plano \xB7 m\xE1ximo ${yt(ve)} ${Wa[J] ?? ""}` + (rt ? " \xB7 el momento va del lado de la tracci\xF3n" : "") : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const S = () => {
    try {
      y();
    } catch {
    }
  };
  (l == null ? void 0 : l.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    l.frameResults.val, S();
  }));
  let E = null;
  return setInterval(() => {
    var _a3, _b2;
    const x = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, K = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, ne = [x, K];
    E && E[0] === x && E[1] === K || (E = ne, S());
  }, 400), window.__hekatanDiagrama2D = f, { abrir: f };
}
function ms(e, l = 8) {
  const c = document.createElement("div");
  c.id = "legend", c.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    Q.derive(() => {
      no.val, c.style.background = ra();
    });
  });
  const p = document.createElement("div");
  p.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", c.appendChild(p), setTimeout(() => {
    Q.derive(() => {
      p.textContent = Eo.val ? `[${Eo.val}]` : "";
    });
  });
  const u = Array.from({ length: l + 1 }, (y, S) => S / l).reverse();
  let w, f;
  u.forEach((y, S) => {
    w = document.createElement("div"), w.id = `marker-${S}`, w.className = "marker", w.style.marginTop = S == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", f = document.createElement("p"), f.id = `marker-text-${S}`, w.append(f), c.append(w);
  });
  const M = [];
  return c.querySelectorAll("p").forEach((y) => M.push(y)), setTimeout(() => {
    Q.derive(() => {
      u.forEach((y, S) => {
        const E = M[S];
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
  const w = document.createElement("div"), f = new ta(), M = new na(45, 1, 0.1, 2 * 1e6), y = new oa(-10, 10, 10, -10, -1e3, 2e6);
  let S = M;
  const E = new sa({ antialias: true });
  E.localClippingEnabled = true;
  const x = new ds(M, E.domElement);
  x.enableDamping = true, x.dampingFactor = 0.1, x.screenSpacePanning = true, x.zoomSpeed = 0.8, x.panSpeed = 1.2, x.rotateSpeed = 0.9, x.keyPanSpeed = 12, x.listenToKeyEvents(window), x.touches = { ONE: Hn.ROTATE, TWO: Hn.DOLLY_PAN }, E.domElement.addEventListener("wheel", (P) => {
    if (!P.ctrlKey && Math.abs(P.deltaX) > Math.abs(P.deltaY) * 1.5) {
      P.preventDefault();
      const I = x.target, te = new k().subVectors(M.position, I), C = new k();
      C.crossVectors(M.up, te).normalize();
      const re = te.length() * 1e-3 * x.panSpeed;
      I.addScaledVector(C, P.deltaX * re), M.position.addScaledVector(C, P.deltaX * re), x.update();
    }
  }, { passive: false });
  const K = new Po(new k(-1, 0, 0), 0), ne = new Po(new k(0, -1, 0), 0), ie = new Po(new k(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function j() {
    const P = window.__hekatanClip, I = [];
    P.enableX && (K.normal.set(P.invertX ? 1 : -1, 0, 0), K.constant = P.invertX ? -P.posX : P.posX, I.push(K)), P.enableY && (ne.normal.set(0, P.invertY ? 1 : -1, 0), ne.constant = P.invertY ? -P.posY : P.posY, I.push(ne)), P.enableZ && (ie.normal.set(0, 0, P.invertZ ? 1 : -1), ie.constant = P.invertZ ? -P.posZ : P.posZ, I.push(ie)), E.clippingPlanes = I, f.traverse((C) => {
      const oe = C;
      if (oe.material) {
        const re = Array.isArray(oe.material) ? oe.material : [oe.material];
        for (const we of re) we.clippingPlanes = I, we.needsUpdate = true;
      }
    });
    const te = window.__hekatanPanes ?? [];
    for (const C of te) try {
      C && typeof C.refresh == "function" && C.refresh();
    } catch {
    }
    E.render(f, S);
  }
  j(), window.__hekatanClipApply = j;
  const F = pa(l), de = Q.derive(() => Math.pow(10, F.displayScale.val / 10)), J = ja(e, F), be = () => {
    const P = [];
    return F.gridXY.rawVal && P.push("xy"), F.gridXZ.rawVal && P.push("xz"), F.gridYZ.rawVal && P.push("yz"), P;
  }, _e = () => {
    const P = F.gridStep.rawVal, I = Math.max(P, F.gridMajor.rawVal);
    return { planes: be(), majorStep: I, minorStep: P };
  };
  let N = zo(F.gridSize.rawVal, _e());
  N.visible = F.gridVisible.rawVal, window.__hekatanSnap2D = F.cursorSnap.rawVal;
  const U = () => {
    const P = Math.max(0, Math.min(1, F.gridOpacity.rawVal));
    N.traverse((I) => {
      const te = I.material;
      if (!te || !("opacity" in te)) return;
      const C = I.name ?? "";
      let oe = 0.55;
      C.includes("border") ? oe = 1 : C.includes("major") && (oe = 0.95), te.opacity = P * oe;
    });
  };
  U(), w.appendChild(da(F, e, u)), w.setAttribute("id", "viewer"), w.appendChild(E.domElement), E.setPixelRatio(window.devicePixelRatio);
  const W = dn();
  E.setClearColor(W.background, 1);
  const $ = F.gridSize.rawVal, T = $ * 0.5 + $ * 0.5 / Math.tan(45 * 0.5);
  M.position.set(0, 0, T), M.up.set(0, 1, 0), x.target.set(0, 0, 0), x.minDistance = 0.1, x.maxDistance = 1e4, w.__settings = F, x.zoomSpeed = 1, x._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, x.update();
  let G = us(F.gridSize.rawVal, F.flipAxes.rawVal);
  f.add(N, G), Q.derive(() => {
    window.__hekatanGridPlaneXY = F.gridXY.val, window.__hekatanGridPlaneXZ = F.gridXZ.val, window.__hekatanGridPlaneYZ = F.gridYZ.val;
  });
  let Z = true;
  Q.derive(() => {
    const P = F.gridVisible.val;
    if (Z) {
      Z = false;
      return;
    }
    N.visible = P, O();
  });
  let L = true;
  Q.derive(() => {
    if (F.gridOpacity.val, L) {
      L = false;
      return;
    }
    U(), O();
  }), Q.derive(() => {
    const P = F.cursorSnap.val;
    window.__hekatanSnap2D = P;
  });
  let se = true;
  Q.derive(() => {
    var _a2, _b, _c;
    const P = F.gridSize.val, I = F.flipAxes.val;
    if (F.gridXY.val, F.gridXZ.val, F.gridYZ.val, F.gridStep.val, F.gridMajor.val, se) {
      se = false;
      return;
    }
    f.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (re) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = re.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = re.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), N = zo(P, _e()), N.visible = F.gridVisible.rawVal, f.add(N), U(), f.remove(G), G.traverse((re) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = re.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = re.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), G = us(P, I), f.add(G);
    const te = P * 0.5 + P * 0.5 / Math.tan(45 * 0.5);
    M.position.distanceTo(x.target);
    const C = Math.abs(M.position.x) < 0.1 && Math.abs(M.position.y) < 0.1 && M.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (C ? M.position.set(0, 0, te) : M.position.set(0.5 * P, -te, 0.5 * P), x.target.set(0, 0, 0)), x.minDistance = Math.max(0.05, P * 0.01), x.maxDistance = Math.max(50, P * 50), x.update(), O();
  }), new ResizeObserver((P) => {
    var _a2, _b;
    for (const I of P) {
      const te = (_a2 = I.target) == null ? void 0 : _a2.clientWidth, C = (_b = I.target) == null ? void 0 : _b.clientHeight;
      if (te === 0 || C === 0) continue;
      const re = (pe ? te / 2 : te) / C;
      M.aspect = re, M.updateProjectionMatrix();
      const we = y.top;
      if (y.left = -we * re, y.right = we * re, y.updateProjectionMatrix(), le && le.isPerspectiveCamera) le.aspect = re, le.updateProjectionMatrix();
      else if (le && le.isOrthographicCamera) {
        const xe = le, Le = xe.top;
        xe.left = -Le * re, xe.right = Le * re, xe.updateProjectionMatrix();
      }
      E.setSize(te, C), O();
    }
  }).observe(w), x.addEventListener("change", O), Q.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e2 = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e2.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, F.displayScale.val, F.nodes.val, F.elements.val, (_g = F.edges) == null ? void 0 : _g.val, F.elemColumns.val, F.elemBeams.val, F.nodesIndexes.val, F.elementsIndexes.val, F.orientations.val, F.sections.val, F.secColumns.val, F.secBeams.val, F.secFloor.val, F.supports.val, F.loads.val, F.deformedShape.val, F.nodeResults.val, F.frameResults.val, F.shellResults.val, (_h = F.solidResults) == null ? void 0 : _h.val, (_i = F.extruded) == null ? void 0 : _i.val, setTimeout(O);
  });
  let pe = false, le = null, Y = null, me = false;
  function O() {
    const P = w.clientWidth || 1, I = w.clientHeight || 1;
    if (!pe || !le) {
      E.setScissorTest(false), E.setViewport(0, 0, P, I), E.render(f, S);
      return;
    }
    const te = P / 2;
    E.setScissorTest(true), E.setViewport(0, 0, te, I), E.setScissor(0, 0, te, I), E.render(f, S), E.setViewport(te, 0, te, I), E.setScissor(te, 0, te, I), E.render(f, le), E.setScissorTest(false);
  }
  function ye(P) {
    S = P, x.object = P, x.update(), O();
  }
  function ge(P, I) {
    pe = P, I && (le = I);
    const te = w.clientWidth || 1, C = w.clientHeight || 1, re = (P ? te / 2 : te) / C;
    M.isPerspectiveCamera && (M.aspect = re, M.updateProjectionMatrix());
    const we = y.top;
    if (y.left = -we * re, y.right = we * re, y.updateProjectionMatrix(), P && le) {
      if (Y ? (Y.object = le, Y.update()) : (Y = new ds(le, E.domElement), Y.enableDamping = true, Y.dampingFactor = 0.1, Y.screenSpacePanning = true, Y.zoomSpeed = 0.8, Y.panSpeed = 1.2, Y.rotateSpeed = 0.9, Y.touches = { ONE: Hn.ROTATE, TWO: Hn.DOLLY_PAN }, Y.target.copy(x.target), Y.addEventListener("change", O), Y.enabled = false), !me) {
        const xe = (Le) => {
          if (!pe || !Y) return;
          const Ae = E.domElement.getBoundingClientRect(), De = Le.clientX - Ae.left, Ze = Ae.width / 2, Ie = De >= Ze;
          x.enabled = !Ie, Y.enabled = Ie;
        };
        E.domElement.addEventListener("pointerdown", xe, true), E.domElement.addEventListener("wheel", xe, { capture: true, passive: true }), me = true;
      }
    } else P || (x.enabled = true, Y && (Y.enabled = false));
    w.__splitMode = P, window.__hekatanSplitMode = P, window.__hekatanSplitCamera = P ? le : null, O();
  }
  if (e) {
    f.add(ua(F, J, de), ia(e, F, J), ma(F, J, de), wa(e, F, J, de), fa(e, F, J, de), ha(e, F, J, de), ga(e, F, J, de), Ma(e, F, J, de), Sa(e, F, J), Fa(e, F, J, de), Pa(e, F, J, de)), window.__hekatanDiagrama2D || (Oa(e, F), E.domElement.addEventListener("dblclick", () => {
      var _a2;
      const xe = (_a2 = F.frameResults) == null ? void 0 : _a2.rawVal;
      !xe || xe === "none" || !(window.__hekatanModelSelection ?? []).some((Ae) => Ae.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const P = qa({ scene: f, rendererElm: E.domElement, getActiveCamera: () => S, derivedNodes: J, derivedDisplayScale: de, mesh: e, settings: F, render: O });
    f.add(P);
    const I = ai(e, F), te = Va(e, F, J, I), C = ms(I);
    f.add(te), w.appendChild(C);
    const oe = Ra(e, F, J);
    f.add(oe);
    const re = oe.__colorMapValues, we = ms(re);
    we.id = "frame-legend", w.appendChild(we), Q.derive(() => {
      var _a2;
      const xe = F.shellResults.val != "none", Le = (((_a2 = F.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ae = xe || Le, De = F.frameResults.val.startsWith("contour:"), Ze = I.val.some((Ie) => Number.isFinite(Ie));
      C.hidden = !Ae || !Ze, te.visible = Ae, we.hidden = !De;
    });
  }
  if (u) {
    const P = new vs(16777215, 0.5);
    f.add(P);
    const I = new to(16777215, 0.5);
    I.position.set(30, 25, -10), I.shadow.mapSize.width = 1024, I.shadow.mapSize.height = 1024, f.add(I);
    const te = 10;
    I.shadow.camera.left = -te, I.shadow.camera.right = te, I.shadow.camera.top = te, I.shadow.camera.bottom = -te, I.shadow.camera.far = 1e3;
    const C = new to(16777215, 0.5);
    C.color.setHSL(11, 43, 96), C.position.set(-10, 0, 30), f.add(C), Q.derive(() => {
      (u == null ? void 0 : u.val.length) && (f.remove(...u.oldVal), f.add(...u.rawVal), O());
    }), Q.derive(() => {
      u.rawVal.forEach((oe) => oe.visible = F.solids.val), O();
    });
  }
  if (p) {
    const P = [], I = (C) => {
      var _a2;
      return ((_a2 = C == null ? void 0 : C.userData) == null ? void 0 : _a2.isCota) ? F.showCotas.val : F.custom3D.val;
    }, te = () => {
      for (const C of P) C.visible = I(C);
      O();
    };
    Q.derive(() => {
      const C = p.val;
      P.length && (f.remove(...P), P.length = 0), C.length && (f.add(...C), P.push(...C), te()), O();
    }), Q.derive(() => {
      F.custom3D.val, te();
    }), Q.derive(() => {
      F.showCotas.val, te();
    });
  }
  c && Aa({ drawingObj: c, gridObj: N, scene: f, getActiveCamera: () => S, controls: x, gridSize: $, derivedDisplayScale: de, rendererElm: E.domElement, viewerRender: O }), xs((P, I) => {
    var _a2;
    E.setClearColor(I.background, 1), f.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (te) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = te.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = te.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = zo(F.gridSize.rawVal, { planes: be() }), f.add(N), w.style.setProperty("--awatif-legend-color", I.legendMarker), O();
  });
  const $e = { scene: f, perspCamera: M, orthoCamera: y, get camera() {
    return S;
  }, controls: x, renderer: E, rendererElm: E.domElement, render: O, setActiveCamera: ye, setSplitMode: ge, get splitMode() {
    return pe;
  }, get splitCamera() {
    return le;
  }, settings: F };
  w.__ctx = $e;
  const ve = document.createElement("div");
  ve.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Ne = (P, I, te) => {
    const C = document.createElement("button");
    return C.textContent = P, C.title = I, C.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), C.onmouseenter = () => {
      C.style.background = "rgba(70,70,70,0.9)";
    }, C.onmouseleave = () => {
      C.style.background = "rgba(40,40,40,0.85)";
    }, C.onclick = (oe) => {
      oe.preventDefault(), te();
    }, C;
  }, Ke = (P, I) => {
    const te = x.target, C = new k().subVectors(S.position, te), oe = C.length(), re = new k(), we = new k();
    re.crossVectors(S.up, C).normalize(), we.copy(S.up).normalize();
    const xe = oe * 0.05;
    te.addScaledVector(re, -P * xe), te.addScaledVector(we, I * xe), S.position.addScaledVector(re, -P * xe), S.position.addScaledVector(we, I * xe), x.update(), O();
  }, rt = (P) => {
    const I = new k().subVectors(S.position, x.target);
    I.multiplyScalar(P), S.position.copy(x.target).add(I), x.update(), O();
  }, yt = () => {
    const P = document.createElement("div");
    return P.style.cssText = "width:32px;height:32px;", P;
  };
  return ve.append(yt()), ve.append(Ne("\u2191", "Pan arriba", () => Ke(0, 1))), ve.append(Ne("\u2295", "Zoom in", () => rt(0.85))), ve.append(Ne("\u2190", "Pan izquierda", () => Ke(-1, 0))), ve.append(Ne("\u2302", "Reset vista", () => {
    x.reset(), O();
  })), ve.append(Ne("\u2192", "Pan derecha", () => Ke(1, 0))), ve.append(Ne("\u2296", "Zoom out", () => rt(1.18))), ve.append(Ne("\u2193", "Pan abajo", () => Ke(0, -1))), ve.append(yt()), getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(ve), w;
}
function ja(e, l) {
  return Q.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const c = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], p = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!p || c.length === 0) return c;
    const u = l.deformScale.val, w = l.deformScale.val * l.deformScaleZ.val, f = Number.isFinite(u) ? u : 1, M = Number.isFinite(w) ? w : 1;
    return c.map((y, S) => {
      var _a3;
      const E = ((_a3 = p.get(S)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], x = Number.isFinite(E[0]) ? E[0] : 0, K = Number.isFinite(E[1]) ? E[1] : 0, ne = Number.isFinite(E[2]) ? E[2] : 0;
      return [y[0] + x * f, y[1] + K * f, y[2] + ne * M];
    });
  });
}
const Tn = Q.state(null), Eo = Q.state(""), ei = Q.state("kN"), ti = Q.state("mm"), ni = Q.state("kN/m\xB2"), oi = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, ys = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, si = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ai(e, l) {
  const c = Q.state([]);
  let p;
  return ((u) => {
    u.bendingXX = "bendingXX", u.bendingYY = "bendingYY", u.bendingXY = "bendingXY", u.membraneXX = "membraneXX", u.membraneYY = "membraneYY", u.membraneXY = "membraneXY", u.tranverseShearX = "tranverseShearX", u.tranverseShearY = "tranverseShearY", u.membranePrincipalMax = "membranePrincipalMax", u.membranePrincipalMin = "membranePrincipalMin", u.bendingPrincipalMax = "bendingPrincipalMax", u.bendingPrincipalMin = "bendingPrincipalMin", u.transverseShearMax = "transverseShearMax", u.vonMises = "vonMises", u.pressure = "pressure", u.displacementX = "displacementX", u.displacementY = "displacementY", u.displacementZ = "displacementZ";
  })(p || (p = {})), Q.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const u = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), ie = (I, te) => {
      I == null ? void 0 : I.forEach((C, oe) => {
        const re = e.elements.val[oe];
        if (re) for (let we = 0; we < re.length; we++) te.set(re[we], [C[we] ?? C[0]]);
      });
    };
    ie((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, u), ie((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, w), ie((_f = (_e2 = e.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, f), ie((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, M), ie((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, y), ie((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, S), ie((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, E), ie((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, x), ie((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, K), ie((_t2 = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t2.pressure, ne);
    const j = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map(), _e = (I, te, C, oe, re) => {
      I.forEach((we, xe) => {
        var _a3, _b2;
        const Le = we[0] ?? 0, Ae = ((_a3 = te.get(xe)) == null ? void 0 : _a3[0]) ?? 0, De = ((_b2 = C.get(xe)) == null ? void 0 : _b2[0]) ?? 0, Ze = (Le + Ae) / 2, Ie = Math.hypot((Le - Ae) / 2, De);
        oe.set(xe, [Ze + Ie]), re.set(xe, [Ze - Ie]);
      });
    };
    _e(M, y, S, j, F), _e(u, w, f, de, J), E.forEach((I, te) => {
      var _a3;
      be.set(te, [Math.hypot(I[0] ?? 0, ((_a3 = x.get(te)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const N = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, U = (_w = l.solidResults) == null ? void 0 : _w.val, $ = U && U !== "none" ? U : l.shellResults.val, T = N == null ? void 0 : N[$], G = { bendingXX: [u, 0], bendingYY: [w, 0], bendingXY: [f, 0], membraneXX: [M, 0], membraneYY: [y, 0], membraneXY: [S, 0], tranverseShearX: [E, 0], tranverseShearY: [x, 0], membranePrincipalMax: [j, 0], membranePrincipalMin: [F, 0], bendingPrincipalMax: [de, 0], bendingPrincipalMin: [J, 0], transverseShearMax: [be, 0], vonMises: [K, 0], pressure: [ne, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, Z = l.shellResults.val, L = ei.val, se = ti.val, he = Z === "displacementX" || Z === "displacementY" || Z === "displacementZ", pe = Z === "bendingXX" || Z === "bendingYY" || Z === "bendingXY" || Z === "bendingPrincipalMax" || Z === "bendingPrincipalMin", le = Z === "membraneXX" || Z === "membraneYY" || Z === "membraneXY" || Z === "membranePrincipalMax" || Z === "membranePrincipalMin", Y = Z === "vonMises" || Z === "pressure", me = Z === "tranverseShearX" || Z === "tranverseShearY" || Z === "transverseShearMax", O = (_D = l.solidResults) == null ? void 0 : _D.val, ye = O === "vonMises" || O === "sigmaXX" || O === "sigmaYY" || O === "sigmaZZ" || O === "tauXY" || O === "tauYZ" || O === "tauXZ", ge = O === "ux" || O === "uy" || O === "uz", $e = ni.val, ve = ye ? si[$e] : ge || he ? ys[se] : pe || le || Y || me ? 1 / oi[L] : 1, Ne = ye ? $e : ge || he ? se : pe ? `${L}\xB7m/m` : le ? `${L}/m\xB2` : Y ? `${L}/m\xB2` : me ? `${L}/m` : "";
    Eo.val = Ne, Tn.val = Array.isArray(T) && T.length === 2 ? [T[0] * ve, T[1] * ve] : null;
    const Ke = ks.val, yt = O && O !== "none" ? [K, 0] : G[Z], P = [];
    if (e.nodes.val.forEach((I, te) => {
      const C = yt;
      if (!C || !C[0] || typeof C[0].has != "function") return;
      if (!C[0].has(te)) {
        P.push(Number.NaN);
        return;
      }
      const oe = C[0].get(te), re = oe ? oe[C[1]] ?? 0 : 0;
      P.push(re * ve);
    }), !Tn.val && Ke !== "auto") {
      const I = e.nodes.val, te = /* @__PURE__ */ new Set(), C = (re, we) => {
        var _a3;
        const xe = (_a3 = I[re[0]]) == null ? void 0 : _a3[we];
        return re.every((Le) => {
          var _a4;
          return Math.abs((((_a4 = I[Le]) == null ? void 0 : _a4[we]) ?? NaN) - xe) < 1e-6;
        });
      };
      for (const re of e.elements.val) {
        if (re.length !== 4) continue;
        const we = C(re, 2), xe = !we && C(re, 0), Le = !we && C(re, 1);
        if (Ke === "losas" ? we : Ke === "muros" ? xe || Le : Ke === "murosX" ? xe : Ke === "murosY" ? Le : false) for (const Ze of re) te.add(Ze);
      }
      const oe = [];
      for (const re of te) {
        const we = P[re];
        Number.isFinite(we) && oe.push(we);
      }
      oe.length && (Tn.val = To(oe));
    }
    c.val = P;
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
