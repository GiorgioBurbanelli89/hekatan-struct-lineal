import { N as Zt, a6 as Bn, q as Ps, v as K, a7 as Cs, D as St, M as je, B as ke, F as gt, a8 as zs, x as dt, a9 as Fs, aa as As, h as Xo, ab as No, r as sn, ac as Yn, ad as Un, a4 as ts, _ as nt, a as pt, L as Kt, w as ns, b as Es, ae as Ts, f as lt, V as S, $ as on, af as uo, H as Mo, d as zt, c as fo, Y as os, Z as qn, G as Vs, z as Pn, A as $s, ag as Zn, t as Ls, o as Is, I as en, a2 as Sn, E as Yo, S as yn, m as ho, ah as kn, g as Uo, i as Zo, j as qo, C as Ko, K as Rs, U as Bs, W as Ds, X as Xs, T as Dn, P as mo, O as Ns } from "./theme-U-6D_qyI.js";
import { T as _t, O as Go } from "./Text-CUW6lNkV.js";
import { P as ss } from "./tweakpane-BXg6ZhiP.js";
import { e as Ys } from "./styles-SbI03m7S.js";
class as {
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
    this.map = wo[l] || wo.rainbow, this.n = p;
    const h = 1 / this.n, c = new Zt(), m = new Zt();
    this.lut.length = 0, this.lut.push(new Zt(this.map[0][1]));
    for (let d = 1; d < p; d++) {
      const x = d * h;
      for (let v = 0; v < this.map.length - 1; v++) if (x > this.map[v][0] && x <= this.map[v + 1][0]) {
        const C = this.map[v][0], F = this.map[v + 1][0];
        c.setHex(this.map[v][1], Bn), m.setHex(this.map[v + 1][1], Bn);
        const _ = new Zt().lerpColors(c, m, (x - C) / (F - C));
        this.lut.push(_);
      }
    }
    return this.lut.push(new Zt(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Ps.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const p = Math.round(l * this.n);
    return this.lut[p];
  }
  addColorMap(l, p) {
    return wo[l] = p, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const p = l.getContext("2d", { alpha: false }), h = p.getImageData(0, 0, 1, this.n), c = h.data;
    let m = 0;
    const d = 1 / this.n, x = new Zt(), v = new Zt(), C = new Zt();
    for (let F = 1; F >= 0; F -= d) for (let _ = this.map.length - 1; _ >= 0; _--) if (F < this.map[_][0] && F >= this.map[_ - 1][0]) {
      const ee = this.map[_ - 1][0], ae = this.map[_][0];
      x.setHex(this.map[_ - 1][1], Bn), v.setHex(this.map[_][1], Bn), C.lerpColors(x, v, (F - ee) / (ae - ee)), c[m * 4] = Math.round(C.r * 255), c[m * 4 + 1] = Math.round(C.g * 255), c[m * 4 + 2] = Math.round(C.b * 255), c[m * 4 + 3] = 255, m += 1;
    }
    return p.putImageData(h, 0, 0), l;
  }
}
const wo = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, is = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Us = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: is, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Kn = K.state("safe"), ls = K.state("auto");
function rs(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Us[Kn.val] ?? is;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, m, d, x] = l[h], [v, C, F, _] = l[h + 1];
    if (e <= v) {
      const ee = (e - c) / (v - c);
      return [m + (C - m) * ee, d + (F - d) * ee, x + (_ - x) * ee];
    }
  }
  const p = l[l.length - 1];
  return [p[1], p[2], p[3]];
}
function Ho() {
  const l = new Uint8Array(1024);
  for (let h = 0; h < 256; h++) {
    const c = h / 255, [m, d, x] = rs(c);
    l[h * 4 + 0] = m, l[h * 4 + 1] = d, l[h * 4 + 2] = x, l[h * 4 + 3] = 255;
  }
  const p = new Fs(l, 256, 1, As);
  return p.minFilter = Xo, p.magFilter = Xo, p.wrapS = No, p.wrapT = No, p.needsUpdate = true, p;
}
function Zs() {
  const l = [];
  for (let p = 0; p <= 12; p++) {
    const h = 1 - p / 12, [c, m, d] = rs(h);
    l.push(`rgb(${c | 0},${m | 0},${d | 0}) ${(p / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function bo(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((m, d) => m - d), p = (m) => l[Math.min(l.length - 1, Math.max(0, Math.round(m * (l.length - 1))))];
  let h = l.length >= 20 ? p(0.01) : l[0], c = l.length >= 20 ? p(0.99) : l[l.length - 1];
  return h >= 0 && c > 0 && (h = 0), c <= 0 && h < 0 && (c = 0), [h, c];
}
function qs(e, l, p) {
  new as();
  const h = Ho(), c = new Cs({ uniforms: { cmap: { value: h }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: St, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  K.derive(() => {
    var _a2;
    Kn.val;
    const d = c.uniforms.cmap.value;
    c.uniforms.cmap.value = Ho(), (_a2 = d == null ? void 0 : d.dispose) == null ? void 0 : _a2.call(d);
  });
  const m = new je(new ke(), c);
  return m.renderOrder = -1, m.frustumCulled = false, m.userData.isShellArea = true, m.name = "__hekatan_shell_colormap", K.derive(() => {
    m.geometry.setAttribute("position", new gt(e.val.flat(), 3));
    const d = [], x = [], v = [];
    l.val.forEach((J, _e) => {
      J.length === 3 ? (d.push(J[0], J[1], J[2]), x.push(_e), v.push(0)) : J.length === 4 && (d.push(J[0], J[1], J[2]), d.push(J[0], J[2], J[3]), x.push(_e, _e), v.push(0, 1));
    }), m.geometry.setIndex(new zs(d, 1)), m.userData.faceToElem = x, m.userData.faceLocal = v;
    const C = p.val.filter((J) => Number.isFinite(J));
    let F, _;
    const ee = zn.val;
    if (ee ? (_ = ee[0], F = ee[1]) : [_, F] = bo(C), F === _) {
      const J = Math.max(Math.abs(F) * 1e-6, 1e-9);
      F += J, _ -= J;
    }
    const ae = ee && ee[0] > ee[1], ce = Math.min(_, F), se = Math.max(_, F), E = se - ce, ie = new Float32Array(p.val.length);
    for (let J = 0; J < p.val.length; J++) {
      const _e = p.val[J];
      if (!Number.isFinite(_e)) {
        ie[J] = -1;
        continue;
      }
      const Y = ((ae ? se + ce - _e : _e) - ce) / E;
      ie[J] = Math.max(0, Math.min(1, Y));
    }
    m.geometry.setAttribute("scalar", new dt(ie, 1));
  }), m;
}
function Ks(e, l, p) {
  const h = document.createElement("div"), c = new ss({ title: "Settings", expanded: true, container: h });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(c), h.setAttribute("id", "settings");
  const m = "hk_settingsPos";
  let d = null;
  try {
    const _ = localStorage.getItem(m);
    _ && (d = JSON.parse(_));
  } catch {
  }
  h.style.cssText = ["position:fixed", d ? `left:${d.left}px` : "left:8px", d ? `top:${d.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const x = () => {
    const _ = h.querySelector(".tp-rotv_b");
    if (!_) {
      setTimeout(x, 200);
      return;
    }
    _.style.cursor = "move", _.style.userSelect = "none";
    let ee = false, ae = 0, ce = 0, se = 0, E = 0;
    _.addEventListener("mousedown", (ie) => {
      ee = true, ae = ie.clientX, ce = ie.clientY;
      const J = h.getBoundingClientRect();
      se = J.left, E = J.top, h.style.left = `${se}px`, h.style.top = `${E}px`;
    }), window.addEventListener("mousemove", (ie) => {
      if (!ee) return;
      const J = ie.clientX - ae, _e = ie.clientY - ce, ye = Math.max(0, Math.min(window.innerWidth - 40, se + J)), Y = Math.max(0, Math.min(window.innerHeight - 40, E + _e));
      h.style.left = `${ye}px`, h.style.top = `${Y}px`;
    }), window.addEventListener("mouseup", () => {
      if (ee) {
        ee = false;
        try {
          localStorage.setItem(m, JSON.stringify({ left: parseFloat(h.style.left), top: parseFloat(h.style.top) }));
        } catch {
        }
      }
    });
  };
  if (x(), l == null ? void 0 : l.nodes) {
    c.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const _ = c.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    _.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), _.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), _.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), _.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const ee = _.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    ee.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), ee.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), ee.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), ee.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), ee.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ae = c.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ae.addBinding(e.nodes, "val", { label: "Nodes" }), ae.addBinding(e.elements, "val", { label: "Elements" }), ae.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ae.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ae.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ae.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ae.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ae.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ae.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ae.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ae.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ae.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ae.addBinding(e.orientations, "val", { label: "Orientations" }), ae.addBinding(e.sections, "val", { label: "Sections" }), ae.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ae.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ae.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ae.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ae.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const _ = c.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    _.addBinding(e.supports, "val", { label: "Supports" }), _.addBinding(e.loads, "val", { label: "Loads" }), _.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), _.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const _ = c.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = _, _.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), _.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), _.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), _.addBinding(Kn, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), _.addBinding(ls, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), _.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), _.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), _.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), _.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  p && c.addBinding(e.solids, "val", { label: "Solids" });
  const v = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), C = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), F = () => {
    const _ = window.__hekatanClipApply;
    typeof _ == "function" && _();
  };
  return v.addBinding(C, "enableX", { label: "Cortar X" }).on("change", F), v.addBinding(C, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", F), v.addBinding(C, "invertX", { label: "  invertir X" }).on("change", F), v.addBinding(C, "enableY", { label: "Cortar Y" }).on("change", F), v.addBinding(C, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", F), v.addBinding(C, "invertY", { label: "  invertir Y" }).on("change", F), v.addBinding(C, "enableZ", { label: "Cortar Z" }).on("change", F), v.addBinding(C, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", F), v.addBinding(C, "invertZ", { label: "  invertir Z" }).on("change", F), h;
}
function Gs(e) {
  return { gridSize: K.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: K.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: K.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: K.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: K.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: K.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: K.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: K.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: K.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: K.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: K.state((e == null ? void 0 : e.nodes) ?? true), elements: K.state((e == null ? void 0 : e.elements) ?? true), edges: K.state((e == null ? void 0 : e.edges) ?? true), faces: K.state((e == null ? void 0 : e.faces) ?? true), elemColumns: K.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: K.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: K.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: K.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: K.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: K.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: K.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: K.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: K.state((e == null ? void 0 : e.orientations) ?? false), sections: K.state((e == null ? void 0 : e.sections) ?? true), extruded: K.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: K.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: K.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: K.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: K.state((e == null ? void 0 : e.secFloor) ?? -1), supports: K.state((e == null ? void 0 : e.supports) ?? true), loads: K.state((e == null ? void 0 : e.loads) ?? false), deformedShape: K.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: K.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: K.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: K.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: K.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: K.state((e == null ? void 0 : e.flipAxes) ?? false), solids: K.state((e == null ? void 0 : e.solids) ?? true), custom3D: K.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: K.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: K.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: K.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function Hs(e, l, p) {
  const h = sn(), c = new Yn(new ke(), new Un({ color: h.nodePoint }));
  return ts((m, d) => {
    c.material.color.setHex(d.nodePoint);
  }), c.frustumCulled = false, K.derive(() => {
    e.nodes.val && c.geometry.setAttribute("position", new gt(l.val.flat(), 3));
  }), K.derive(() => {
    if (p.val, l.val, !e.nodes.rawVal) return;
    const m = l.rawVal ?? [];
    let d = e.gridSize.val * 0.5;
    if (m.length >= 2) {
      const v = [1 / 0, 1 / 0, 1 / 0], C = [-1 / 0, -1 / 0, -1 / 0];
      for (const F of m) for (let _ = 0; _ < 3; _++) v[_] = Math.min(v[_], F[_]), C[_] = Math.max(C[_], F[_]);
      d = Math.max(C[0] - v[0], C[1] - v[1], C[2] - v[2], 0.1);
    }
    const x = 0.03 * d;
    c.material.size = x * p.rawVal;
  }), K.derive(() => {
    c.visible = e.nodes.val;
  }), c;
}
function yo(e, l) {
  const p = sn(), h = new nt();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let m = (l == null ? void 0 : l.majorStep) ?? 1, d = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (m <= 0 && (m = 1), d <= 0 && (d = 0.1); e / d > 500; ) d *= 2;
  for (; e / m > 100; ) m *= 2;
  const x = e / 2;
  m = Math.max(d, Math.round(m / d) * d);
  const C = new Zt(p.grid), F = new Zt(p.grid).multiplyScalar(0.45), _ = (se, E, ie, J) => {
    const _e = [], ye = se === "xy" ? (T, U) => [T, U, 0] : se === "xz" ? (T, U) => [T, 0, U] : (T, U) => [0, T, U], Y = Math.floor(x / E);
    for (let T = -Y; T <= Y; T++) {
      const U = T * E, D = ye(U, -x), $ = ye(U, x);
      _e.push(...D, ...$);
    }
    for (let T = -Y; T <= Y; T++) {
      const U = T * E, D = ye(-x, U), $ = ye(x, U);
      _e.push(...D, ...$);
    }
    const R = new ke();
    R.setAttribute("position", new gt(_e, 3));
    const Z = new pt({ color: ie, transparent: true, opacity: J, depthWrite: false }), V = new Kt(R, Z);
    return V.name = `grid-${se}-${E === d ? "minor" : "major"}`, V;
  }, ee = (se, E, ie) => {
    const J = se === "xy" ? (V, T) => [V, T, 0] : se === "xz" ? (V, T) => [V, 0, T] : (V, T) => [0, V, T], _e = [[-x, -x], [x, -x], [x, x], [-x, x]], ye = [];
    for (const [V, T] of _e) ye.push(...J(V, T));
    const Y = new ke();
    Y.setAttribute("position", new gt(ye, 3));
    const R = new pt({ color: E, transparent: true, opacity: ie, depthWrite: false }), Z = new ns(Y, R);
    return Z.name = `grid-${se}-border`, Z.renderOrder = 1, Z;
  }, ae = (se, E, ie) => {
    const J = se === "xy" ? (R, Z) => [R, Z, 0] : se === "xz" ? (R, Z) => [R, 0, Z] : (R, Z) => [0, R, Z], _e = E === "u" ? [...J(-x, 0), ...J(x, 0)] : [...J(0, -x), ...J(0, x)], ye = new ke();
    ye.setAttribute("position", new gt(_e, 3));
    const Y = new Kt(ye, new pt({ color: ie, transparent: true, opacity: 0.45, depthWrite: false }));
    return Y.name = `grid-${se}-eje-${E}`, Y.renderOrder = 1, Y;
  }, ce = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of c) {
    h.add(_(se, d, F, 0.12)), h.add(_(se, m, C, 0.4));
    const [E, ie] = ce[se];
    h.add(ae(se, "u", E)), h.add(ae(se, "v", ie)), h.add(ee(se, C, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: m, minorStep: d, gridSize: e, planes: [...c] }, h;
}
function Ws(e, l, p, h) {
  const c = new nt(), m = new Es(0.5, 0.5, 0.5), d = new Ts(0.45, 0.7, 4);
  d.rotateX(Math.PI / 2), d.translate(0, 0, -0.35);
  const x = new lt({ color: 10166822 }), v = new lt({ color: 2792847 }), C = new lt({ color: 3835647 }), F = () => {
    const ae = p.rawVal ?? [];
    if (ae.length < 2) return l.gridSize.val * 0.5;
    let ce = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of ae) for (let ie = 0; ie < 3; ie++) E[ie] < ce[ie] && (ce[ie] = E[ie]), E[ie] > se[ie] && (se[ie] = E[ie]);
    return Math.max(se[0] - ce[0], se[1] - ce[1], se[2] - ce[2], 0.1);
  }, _ = () => 0.08 * F(), ee = () => h.rawVal;
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const ae = _();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((ce, se) => {
      const E = p.val[se];
      if (!E) return;
      const ie = ce ?? [], J = (ie[0] ? 1 : 0) + (ie[1] ? 1 : 0) + (ie[2] ? 1 : 0), _e = (ie[3] ? 1 : 0) + (ie[4] ? 1 : 0) + (ie[5] ? 1 : 0);
      let ye;
      J >= 3 && _e >= 3 ? ye = new je(m, x) : J >= 3 && _e === 0 ? ye = new je(d, v) : ye = new je(d, C), ye.position.set(E[0], E[1], E[2]);
      const Y = ae * ee();
      ye.scale.set(Y, Y, Y), c.add(ye);
    });
  }), K.derive(() => {
    if (h.val, !l.supports.rawVal) return;
    const ce = _() * ee();
    c.children.forEach((se) => se.scale.set(ce, ce, ce));
  }), K.derive(() => {
    c.visible = l.supports.val;
  }), c;
}
function Js(e, l, p, h) {
  const c = new nt();
  c.name = "loadsGroup";
  function m(d) {
    if (d.length < 2) return 0.12 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], v = [-1 / 0, -1 / 0, -1 / 0];
    for (const F of d) for (let _ = 0; _ < 3; _++) x[_] = Math.min(x[_], F[_]), v[_] = Math.max(v[_], F[_]);
    return 0.08 * Math.max(v[0] - x[0], v[1] - x[1], v[2] - x[2], 0.1);
  }
  return K.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((_) => _.dispose()), c.clear();
    const d = p.val, x = m(d), v = 240, C = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((_, ee) => {
      d[ee] && _.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && C.push(ee);
    });
    let F = C;
    if (C.length > v) {
      const _ = C.map((V) => d[V][0]), ee = C.map((V) => d[V][1]), ae = Math.min(..._), ce = Math.max(..._), se = Math.min(...ee), E = Math.max(...ee), ie = C.map((V) => d[V][2]), J = Math.max(1e-6, (Math.max(...ie) - Math.min(...ie)) / 40), _e = (V) => Math.round(V / J), ye = new Set(ie.map(_e)), Y = Math.max(4, Math.floor(v / Math.max(1, ye.size))), R = Math.max(2, Math.round(Math.sqrt(Y))), Z = /* @__PURE__ */ new Map();
      for (const V of C) {
        const T = ce - ae < 1e-9 ? 0 : (d[V][0] - ae) / (ce - ae), U = E - se < 1e-9 ? 0 : (d[V][1] - se) / (E - se), D = Math.min(R - 1, Math.floor(T * R)), $ = Math.min(R - 1, Math.floor(U * R)), j = `${D},${$},${_e(d[V][2])}`, ue = Math.hypot(T * R - (D + 0.5), U * R - ($ + 0.5)), le = Z.get(j);
        (!le || ue < le.d) && Z.set(j, { i: V, d: ue });
      }
      F = [...Z.values()].map((V) => V.i);
    }
    for (const _ of F) {
      const ee = e.nodeInputs.val.loads.get(_), ae = d[_];
      if (!ae) continue;
      const ce = new S(...ee.slice(0, 3));
      if (ce.lengthSq() < 1e-30) continue;
      ce.normalize();
      const se = new on(ce, new S(...ae), 1, 15637248, 0.3, 0.3), E = x * h.rawVal;
      se.scale.set(E, E, E), c.add(se);
    }
  }), K.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const x = m(p.rawVal) * h.rawVal;
    c.children.forEach((v) => v.scale.set(x, x, x));
  }), K.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function Os(e, l, p) {
  const h = new nt();
  return K.derive(() => {
    if (!e.nodesIndexes.val) return;
    h.children.forEach((m) => m.dispose()), h.clear();
    const c = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((m, d) => {
      const x = new _t(`${d}`);
      x.position.set(...m), x.updateScale(c * p.rawVal), h.add(x);
    });
  }), K.derive(() => {
    if (p.val, !e.nodesIndexes.rawVal) return;
    const c = 0.05 * e.gridSize.val * 0.6;
    h.children.forEach((m) => m.updateScale(c * p.rawVal));
  }), K.derive(() => {
    h.visible = e.nodesIndexes.val;
  }), h;
}
function Qs(e, l, p, h) {
  const c = new nt();
  return K.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    c.children.forEach((d) => d.dispose()), c.clear();
    const m = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((d, x) => {
      const v = new _t(`${x}`, void 0, "#001219");
      v.position.set(...js(d.map((C) => p.rawVal[C]))), v.updateScale(m * h.rawVal), c.add(v);
    });
  }), K.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const m = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((d) => d.updateScale(m * h.rawVal));
  }), K.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function js(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function Wo(e, l) {
  const p = new nt(), h = Math.min(0.05 * e, 0.6), c = sn(), m = new _t("X", "red", "transparent"), d = new _t(l ? "Z" : "Y", "green", "transparent"), x = new _t(l ? "Y" : "Z", "blue", "transparent"), v = new on(new S(1, 0, 0), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), C = new on(new S(0, 1, 0), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), F = new on(new S(0, 0, 1), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return m.position.set(1.3 * h, 0, 0), d.position.set(0, 1.3 * h, 0), x.position.set(0, 0, 1.3 * h), m.updateScale(0.4 * h), d.updateScale(0.4 * h), x.updateScale(0.4 * h), v.scale.set(h, h, h), C.scale.set(h, h, h), F.scale.set(h, h, h), p.add(v, C, F, m, d, x), p;
}
function Gn(e, l) {
  const p = new S(...e), c = new S(...l).clone().sub(p), m = c.length(), d = c.dot(new S(1, 0, 0)) / m, x = c.dot(new S(0, 1, 0)) / m, v = c.dot(new S(0, 0, 1)) / m, C = Math.sqrt(d ** 2 + x ** 2);
  let F = new uo().fromArray([[d, x, v], [-x / C, d / C, 0], [-d * v / C, -x * v / C, C]].flat());
  return v === 1 && (F = new uo().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), v === -1 && (F = new uo().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Mo().setFromMatrix3(F);
}
function go(e, l) {
  return e == null ? void 0 : e.map((p, h) => (9 * p + l[h]) / 10);
}
function Cn(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function ea(e, l, p) {
  const h = Cn([l, p]), c = Cn([e, p]), m = Cn([e, l]), d = new S(...h).sub(new S(...c)).normalize(), x = new S(...p).sub(new S(...m)).normalize(), v = d.clone().cross(x).normalize(), C = v.clone().cross(d).normalize();
  return new Mo().makeBasis(d, C, v);
}
function ta(e, l, p, h) {
  const c = new nt(), m = new ke(), d = new pt({ vertexColors: true }), x = [0, 0, 0], v = [1, 0, 0], C = [0, 1, 0], F = [0, 0, 1];
  m.setAttribute("position", new gt([...x, ...v, ...x, ...C, ...x, ...F], 3));
  const _ = [255, 0, 0], ee = [0, 255, 0], ae = [0, 0, 255];
  return m.setAttribute("color", new gt([..._, ..._, ...ee, ...ee, ...ae, ...ae], 3)), K.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((ce) => {
      const se = new Kt(m, d), E = p.rawVal[ce[0]], ie = p.rawVal[ce[1]];
      if (ce.length === 2 && (se.position.set(...go(E, ie)), se.rotation.setFromRotationMatrix(Gn(E, ie))), ce.length === 3) {
        const ye = p.rawVal[ce[2]];
        se.position.set(...Cn([E, ie, ye])), se.rotation.setFromRotationMatrix(ea(E, ie, ye));
      }
      const _e = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      se.scale.set(_e, _e, _e), c.add(se);
    }));
  }), K.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((E) => E.scale.set(se, se, se));
  }), K.derive(() => {
    c.visible = l.orientations.val;
  }), c;
}
function na(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), p = (e.h * 100).toFixed(0);
    return `${l}x${p}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function oa(e, l, p, h) {
  const c = new nt(), m = new nt();
  c.add(m);
  function d(R, Z) {
    const V = R / 2, T = Z / 2, U = new Float32Array([0, -V, -T, 0, V, -T, 0, V, T, 0, -V, -T, 0, V, T, 0, -V, T]), D = new ke();
    D.setAttribute("position", new dt(U, 3));
    const $ = new Float32Array([0, -V, -T, 0, V, -T, 0, V, T, 0, -V, T, 0, -V, -T]), j = new ke();
    return j.setAttribute("position", new dt($, 3)), { fill: D, outline: j };
  }
  function x(R, Z = 24) {
    const V = R / 2, T = new Float32Array(Z * 9);
    for (let j = 0; j < Z; j++) {
      const ue = j / Z * Math.PI * 2, le = (j + 1) / Z * Math.PI * 2;
      T[j * 9] = 0, T[j * 9 + 1] = 0, T[j * 9 + 2] = 0, T[j * 9 + 3] = 0, T[j * 9 + 4] = V * Math.cos(ue), T[j * 9 + 5] = V * Math.sin(ue), T[j * 9 + 6] = 0, T[j * 9 + 7] = V * Math.cos(le), T[j * 9 + 8] = V * Math.sin(le);
    }
    const U = new ke();
    U.setAttribute("position", new dt(T, 3));
    const D = new Float32Array((Z + 1) * 3);
    for (let j = 0; j <= Z; j++) {
      const ue = j / Z * Math.PI * 2;
      D[j * 3] = 0, D[j * 3 + 1] = V * Math.cos(ue), D[j * 3 + 2] = V * Math.sin(ue);
    }
    const $ = new ke();
    return $.setAttribute("position", new dt(D, 3)), { fill: U, outline: $ };
  }
  function v(R, Z, V, T) {
    const U = V ?? Z * 0.08, D = T ?? R * 0.07, $ = R / 2, j = Z / 2, ue = j - U, le = D / 2, oe = [];
    function I(he, Ve, Se, Be) {
      oe.push(0, he, Ve, 0, Se, Ve, 0, Se, Be, 0, he, Ve, 0, Se, Be, 0, he, Be);
    }
    I(-$, -j, $, -ue), I(-le, -ue, le, ue), I(-$, ue, $, j);
    const de = new ke();
    de.setAttribute("position", new dt(new Float32Array(oe), 3));
    const G = new Float32Array([0, -$, -j, 0, $, -j, 0, $, -ue, 0, le, -ue, 0, le, ue, 0, $, ue, 0, $, j, 0, -$, j, 0, -$, ue, 0, -le, ue, 0, -le, -ue, 0, -$, -ue, 0, -$, -j]), fe = new ke();
    return fe.setAttribute("position", new dt(G, 3)), { fill: de, outline: fe };
  }
  function C(R, Z, V) {
    const T = R / 2, U = Z / 2, D = T - V, $ = U - V, j = [];
    function ue(de, G, fe, he) {
      j.push(0, de, G, 0, fe, G, 0, fe, he, 0, de, G, 0, fe, he, 0, de, he);
    }
    ue(-T, -U, T, -$), ue(-T, $, T, U), ue(-T, -$, -D, $), ue(D, -$, T, $);
    const le = new ke();
    le.setAttribute("position", new dt(new Float32Array(j), 3));
    const oe = new Float32Array([0, -T, -U, 0, T, -U, 0, T, -U, 0, T, U, 0, T, U, 0, -T, U, 0, -T, U, 0, -T, -U, 0, -D, -$, 0, D, -$, 0, D, -$, 0, D, $, 0, D, $, 0, -D, $, 0, -D, $, 0, -D, -$]), I = new ke();
    return I.setAttribute("position", new dt(oe, 3)), { fill: le, outline: I };
  }
  function F(R, Z, V) {
    const T = R / 2, U = Z / 2, D = T - V, $ = U - V, j = new ke(), ue = new Float32Array([0, -D, -$, 0, D, -$, 0, D, $, 0, -D, -$, 0, D, $, 0, -D, $]);
    j.setAttribute("position", new dt(ue, 3));
    const le = [];
    function oe(fe, he, Ve, Se) {
      le.push(0, fe, he, 0, Ve, he, 0, Ve, Se, 0, fe, he, 0, Ve, Se, 0, fe, Se);
    }
    oe(-T, -U, T, -$), oe(-T, $, T, U), oe(-T, -$, -D, $), oe(D, -$, T, $);
    const I = new ke();
    I.setAttribute("position", new dt(new Float32Array(le), 3));
    const de = new Float32Array([0, -T, -U, 0, T, -U, 0, T, -U, 0, T, U, 0, T, U, 0, -T, U, 0, -T, U, 0, -T, -U, 0, -D, -$, 0, D, -$, 0, D, -$, 0, D, $, 0, D, $, 0, -D, $, 0, -D, $, 0, -D, -$]), G = new ke();
    return G.setAttribute("position", new dt(de, 3)), { concFill: j, steelFillGeom: I, outline: G };
  }
  function _(R, Z, V) {
    const T = [], U = [[0, -R / 2, -Z / 2], [0, -R / 2 + V, -Z / 2], [0, -R / 2 + V, Z / 2 - V], [0, R / 2, Z / 2 - V], [0, R / 2, Z / 2], [0, -R / 2, Z / 2]], D = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const le of D) T.push(...U[le]);
    const $ = new ke();
    $.setAttribute("position", new dt(new Float32Array(T), 3));
    const j = [];
    for (let le = 0; le < U.length; le++) {
      const oe = (le + 1) % U.length;
      j.push(...U[le], ...U[oe]);
    }
    const ue = new ke();
    return ue.setAttribute("position", new dt(new Float32Array(j), 3)), { fill: $, outline: ue };
  }
  function ee(R, Z, V, T) {
    const U = T / 2, D = [], $ = [[0, -R - U, -Z / 2], [0, -V - U, -Z / 2], [0, -V - U, Z / 2 - V], [0, -U, Z / 2 - V], [0, -U, Z / 2], [0, -R - U, Z / 2]], j = [[0, U, -Z / 2], [0, U + V, -Z / 2], [0, U + V, Z / 2 - V], [0, R + U, Z / 2 - V], [0, R + U, Z / 2], [0, U, Z / 2]], ue = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const de of ue) D.push(...$[de]);
    for (const de of ue) D.push(...j[de]);
    const le = new ke();
    le.setAttribute("position", new dt(new Float32Array(D), 3));
    const oe = [];
    for (const de of [$, j]) for (let G = 0; G < de.length; G++) {
      const fe = (G + 1) % de.length;
      oe.push(...de[G], ...de[fe]);
    }
    const I = new ke();
    return I.setAttribute("position", new dt(new Float32Array(oe), 3)), { fill: le, outline: I };
  }
  function ae(R, Z, V, T) {
    const U = Z / 2, D = R, $ = [[0, -D, -U], [0, -D, -U + V], [0, -T, -U + V], [0, -T, U - V], [0, -D, U - V], [0, -D, U], [0, 0, U], [0, 0, -U]], j = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], ue = [];
    for (const de of j) ue.push(...$[de]);
    const le = new ke();
    le.setAttribute("position", new dt(new Float32Array(ue), 3));
    const oe = [];
    for (let de = 0; de < $.length; de++) {
      const G = (de + 1) % $.length;
      oe.push(...$[de], ...$[G]);
    }
    const I = new ke();
    return I.setAttribute("position", new dt(new Float32Array(oe), 3)), { fill: le, outline: I };
  }
  function ce(R, Z, V, T, U) {
    const D = Z / 2, $ = U / 2, j = [], ue = [[0, -R, -D], [0, -R, -D + V], [0, -$ - T, -D + V], [0, -$ - T, D - V], [0, -R, D - V], [0, -R, D], [0, -$, D], [0, -$, -D]], le = ue.map((fe) => [fe[0], -fe[1], fe[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const fe of oe) j.push(...ue[fe]);
    for (const fe of oe) j.push(...le[fe]);
    const I = new ke();
    I.setAttribute("position", new dt(new Float32Array(j), 3));
    const de = [];
    for (const fe of [ue, le]) for (let he = 0; he < fe.length; he++) {
      const Ve = (he + 1) % fe.length;
      de.push(...fe[he], ...fe[Ve]);
    }
    const G = new ke();
    return G.setAttribute("position", new dt(new Float32Array(de), 3)), { fill: I, outline: G };
  }
  function se(R, Z, V, T) {
    const U = R / 2, D = Z / 2, $ = T / 2, j = [[0, -$, -D], [0, $, -D], [0, $, D - V], [0, U, D - V], [0, U, D], [0, -U, D], [0, -U, D - V], [0, -$, D - V]], ue = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], le = [];
    for (const G of ue) le.push(...j[G]);
    const oe = new ke();
    oe.setAttribute("position", new dt(new Float32Array(le), 3));
    const I = [];
    for (let G = 0; G < j.length; G++) {
      const fe = (G + 1) % j.length;
      I.push(...j[G], ...j[fe]);
    }
    const de = new ke();
    return de.setAttribute("position", new dt(new Float32Array(I), 3)), { fill: oe, outline: de };
  }
  function E(R, Z, V = 24) {
    const T = R / 2, U = T - Z, D = [];
    for (let le = 0; le < V; le++) {
      const oe = le / V * Math.PI * 2, I = (le + 1) / V * Math.PI * 2, de = Math.cos(oe), G = Math.sin(oe), fe = Math.cos(I), he = Math.sin(I);
      D.push(0, T * de, T * G, 0, T * fe, T * he, 0, U * fe, U * he), D.push(0, T * de, T * G, 0, U * fe, U * he, 0, U * de, U * G);
    }
    const $ = new ke();
    $.setAttribute("position", new dt(new Float32Array(D), 3));
    const j = [];
    for (let le = 0; le < V; le++) {
      const oe = le / V * Math.PI * 2, I = (le + 1) / V * Math.PI * 2;
      j.push(0, T * Math.cos(oe), T * Math.sin(oe), 0, T * Math.cos(I), T * Math.sin(I)), j.push(0, U * Math.cos(oe), U * Math.sin(oe), 0, U * Math.cos(I), U * Math.sin(I));
    }
    const ue = new ke();
    return ue.setAttribute("position", new dt(new Float32Array(j), 3)), { fill: $, outline: ue };
  }
  const ie = new lt({ color: 52479, transparent: true, opacity: 0.35, side: St, depthWrite: false }), J = new pt({ color: 52479 }), _e = new lt({ color: 16750848, transparent: true, opacity: 0.4, side: St, depthWrite: false }), ye = new pt({ color: 16750848 });
  function Y(R, Z) {
    const V = Math.abs(Z[0] - R[0]), T = Math.abs(Z[1] - R[1]), U = Math.abs(Z[2] - R[2]);
    return U > V && U > T || T > V && T > U;
  }
  return K.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const R = l.secColumns.rawVal, Z = l.secBeams.rawVal;
    if (!R && !Z) {
      c.children.forEach(($) => {
        $ instanceof _t && $.dispose();
      }), c.clear();
      return;
    }
    c.children.forEach(($) => {
      $ instanceof _t && $.dispose();
    }), c.clear();
    const V = (_a2 = e.elements) == null ? void 0 : _a2.val, T = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!V || !T) return;
    const U = T.sectionShapes, D = l.secFloor.rawVal;
    V.forEach(($, j) => {
      if ($.length !== 2) return;
      const ue = p.rawVal[$[0]], le = p.rawVal[$[1]];
      if (!ue || !le) return;
      const oe = Y(ue, le);
      if (oe && !R || !oe && !Z) return;
      if (D >= 0) {
        const he = Math.min(ue[1], le[1]);
        Math.max(ue[1], le[1]);
        const Ve = l.gridSize.rawVal || 3;
        if (Math.floor(he / Ve + 0.01) !== D) return;
      }
      const I = U == null ? void 0 : U.get(j);
      if (!I) return;
      const de = [(ue[0] + le[0]) / 2, (ue[1] + le[1]) / 2, (ue[2] + le[2]) / 2], G = Gn(ue, le);
      if (I.type === "CFT") {
        const he = F(I.b, I.h, I.tw ?? I.b * 0.05), Ve = new je(he.concFill, ie);
        Ve.position.set(...de), Ve.rotation.setFromRotationMatrix(G), c.add(Ve);
        const Se = new je(he.steelFillGeom, _e);
        Se.position.set(...de), Se.rotation.setFromRotationMatrix(G), c.add(Se);
        const Be = new zt(he.outline, ye);
        Be.position.set(...de), Be.rotation.setFromRotationMatrix(G), c.add(Be);
      } else {
        let he, Ve, Se;
        switch (I.type) {
          case "rect":
            he = d(I.b, I.h), Ve = ie, Se = J;
            break;
          case "circ":
            he = x(I.d), Ve = ie, Se = J;
            break;
          case "I":
            he = v(I.b, I.h, I.tf, I.tw), Ve = _e, Se = ye;
            break;
          case "HSS":
            he = C(I.b, I.h, I.tw ?? I.b * 0.05), Ve = _e, Se = ye;
            break;
          case "CFT":
            he = F(I.b, I.h, I.tw ?? I.b * 0.05), Ve = _e, Se = ye;
            break;
          case "L":
            he = _(I.b ?? I.h, I.h, I.t ?? I.tw ?? 3e-3), Ve = _e, Se = ye;
            break;
          case "2L":
            he = ee(I.b ?? I.h, I.h, I.t ?? I.tw ?? 3e-3, I.dis ?? 0.01), Ve = _e, Se = ye;
            break;
          case "C":
          case "coldC":
            he = ae(I.b, I.h, I.tf ?? I.t ?? 3e-3, I.tw ?? I.t ?? 3e-3), Ve = _e, Se = ye;
            break;
          case "2C":
            he = ce(I.b, I.h, I.tf ?? 5e-3, I.tw ?? 5e-3, I.dis ?? 0.01), Ve = _e, Se = ye;
            break;
          case "T":
            he = se(I.b, I.h, I.tf ?? 0.01, I.tw ?? 6e-3), Ve = _e, Se = ye;
            break;
          case "pipe":
            he = E(I.d, I.tw ?? I.d * 0.05), Ve = _e, Se = ye;
            break;
          default:
            return;
        }
        const Be = new je(he.fill, Ve);
        Be.position.set(...de), Be.rotation.setFromRotationMatrix(G), c.add(Be);
        const Je = new zt(he.outline, Se);
        Je.position.set(...de), Je.rotation.setFromRotationMatrix(G), c.add(Je);
      }
      const fe = na(I);
      if (fe) {
        const Ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(I.type) ? "#ff9900" : "#00ccff", Se = new _t(fe, Ve, "transparent");
        Se.position.set(de[0], de[1], de[2]);
        const Be = 0.05 * l.gridSize.rawVal * 0.5;
        Se.updateScale(Be * ((h == null ? void 0 : h.rawVal) ?? 1)), m.add(Se);
      }
    });
  }), h && K.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const R = 0.05 * l.gridSize.val * 0.5;
    m.children.forEach((Z) => {
      Z instanceof _t && Z.updateScale(R * h.rawVal);
    });
  }), K.derive(() => {
    c.visible = l.sections.val;
  }), K.derive(() => {
    m.visible = l.sectionLabels.val;
  }), c;
}
function sa(e) {
  if (!e) return null;
  const l = e.type, p = (F, _) => [F, _], h = (F, _) => [p(-F / 2, -_ / 2), p(F / 2, -_ / 2), p(F / 2, _ / 2), p(-F / 2, _ / 2)], c = (F, _ = 24) => {
    const ee = F / 2, ae = [];
    for (let ce = 0; ce < _; ce++) {
      const se = 2 * Math.PI * ce / _;
      ae.push(p(ee * Math.cos(se), ee * Math.sin(se)));
    }
    return ae;
  }, m = e.b ?? 0, d = e.h ?? 0, x = e.d ?? 0, v = e.tw ?? e.t ?? 0, C = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return m && d ? { contorno: h(m, d) } : null;
    case "circ":
      return x ? { contorno: c(x) } : null;
    case "pipe":
      return x && v ? { contorno: c(x), huecos: [c(x - 2 * v).reverse()] } : null;
    case "HSS":
      return m && d && v ? { contorno: h(m, d), huecos: [h(m - 2 * v, d - 2 * (C || v)).reverse()] } : null;
    case "CFT":
      return m && d ? { contorno: h(m, d) } : null;
    case "I":
      return m && d && v && C ? { contorno: [p(-m / 2, -d / 2), p(m / 2, -d / 2), p(m / 2, -d / 2 + C), p(v / 2, -d / 2 + C), p(v / 2, d / 2 - C), p(m / 2, d / 2 - C), p(m / 2, d / 2), p(-m / 2, d / 2), p(-m / 2, d / 2 - C), p(-v / 2, d / 2 - C), p(-v / 2, -d / 2 + C), p(-m / 2, -d / 2 + C)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return m && d && v && C ? { contorno: [p(-m / 2, -d / 2), p(m / 2, -d / 2), p(m / 2, -d / 2 + C), p(-m / 2 + v, -d / 2 + C), p(-m / 2 + v, d / 2 - C), p(m / 2, d / 2 - C), p(m / 2, d / 2), p(-m / 2, d / 2)] } : null;
    case "T":
      return m && d && v && C ? { contorno: [p(-v / 2, -d / 2), p(v / 2, -d / 2), p(v / 2, d / 2 - C), p(m / 2, d / 2 - C), p(m / 2, d / 2), p(-m / 2, d / 2), p(-m / 2, d / 2 - C), p(-v / 2, d / 2 - C)] } : null;
    case "L":
    case "2L":
      return m && d && v ? { contorno: [p(-m / 2, -d / 2), p(m / 2, -d / 2), p(m / 2, -d / 2 + v), p(-m / 2 + v, -d / 2 + v), p(-m / 2 + v, d / 2), p(-m / 2, d / 2)] } : null;
    default:
      return m && d ? { contorno: h(m, d) } : x ? { contorno: c(x) } : null;
  }
}
function aa(e, l, p) {
  if (!e || e <= 0 || !l || !p || l <= 0 || p <= 0) return null;
  const h = Math.sqrt(Math.sqrt(p / l)), c = Math.sqrt(e / h), m = e / c;
  return !isFinite(c) || !isFinite(m) || c <= 0 || m <= 0 ? null : { contorno: [[-c / 2, -m / 2], [c / 2, -m / 2], [c / 2, m / 2], [-c / 2, m / 2]] };
}
function ia(e) {
  const l = new Pn();
  e.contorno.forEach(([p, h], c) => c ? l.lineTo(p, h) : l.moveTo(p, h)), l.closePath();
  for (const p of e.huecos ?? []) {
    const h = new $s();
    p.forEach(([c, m], d) => d ? h.lineTo(c, m) : h.moveTo(c, m)), h.closePath(), l.holes.push(h);
  }
  return l;
}
function la(e, l, p) {
  const h = new nt();
  h.name = "extrusion";
  const c = new fo({ color: 8369151, transparent: true, opacity: 0.92, side: St }), m = new fo({ color: 12623968, transparent: true, opacity: 0.85, side: St }), d = new fo({ color: 11583173, transparent: true, opacity: 0.85, side: St }), x = new nt();
  x.add(new os(16777215, 0.55));
  const v = new qn(16777215, 0.75);
  v.position.set(30, 25, 40);
  const C = new qn(16777215, 0.35);
  C.position.set(-25, -20, 15), x.add(v, C);
  let F = 0;
  return K.derive(() => {
    var _a2, _b, _c, _d, _e;
    const _ = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++F, on: _ }, h.visible = _;
    for (const J of [...h.children]) J !== x && (h.remove(J), (_c = (_b = J.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(x) || h.add(x), !_) return;
    const ee = p.val ?? [], ae = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], ce = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = ce.sectionShapes ?? /* @__PURE__ */ new Map(), E = ce.thicknesses ?? /* @__PURE__ */ new Map();
    let ie = "";
    try {
      ae.forEach((J, _e2) => {
        var _a3, _b2, _c2;
        if (J.length === 2) {
          let ye = sa(se.get(_e2)), Y = true;
          if (ye || (ye = aa((_a3 = ce.areas) == null ? void 0 : _a3.get(_e2), (_b2 = ce.momentsOfInertiaY) == null ? void 0 : _b2.get(_e2), (_c2 = ce.momentsOfInertiaZ) == null ? void 0 : _c2.get(_e2)), Y = false), !ye) return;
          const R = ee[J[0]], Z = ee[J[1]];
          if (!R || !Z) return;
          const V = Math.hypot(Z[0] - R[0], Z[1] - R[1], Z[2] - R[2]);
          if (V < 1e-9) return;
          const T = new Vs(ia(ye), { depth: V, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new Mo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const U = new je(T, Y ? c : m);
          U.position.set(R[0], R[1], R[2]), U.rotation.setFromRotationMatrix(Gn(R, Z)), h.add(U);
          return;
        }
        if (J.length === 3 || J.length === 4) {
          const ye = E.get(_e2);
          if (!ye || ye <= 0) return;
          const Y = J.map((G) => ee[G]).filter(Boolean);
          if (Y.length < 3) return;
          const R = [Y[1][0] - Y[0][0], Y[1][1] - Y[0][1], Y[1][2] - Y[0][2]], Z = [Y[2][0] - Y[0][0], Y[2][1] - Y[0][1], Y[2][2] - Y[0][2]], V = R[1] * Z[2] - R[2] * Z[1], T = R[2] * Z[0] - R[0] * Z[2], U = R[0] * Z[1] - R[1] * Z[0], D = Math.hypot(V, T, U);
          if (D < 1e-12) return;
          const $ = [V / D, T / D, U / D], j = [], ue = (G) => Y.map((fe) => [fe[0] + $[0] * G, fe[1] + $[1] * G, fe[2] + $[2] * G]), le = ue(+ye / 2), oe = ue(-ye / 2), I = (G, fe, he) => j.push(...G, ...fe, ...he);
          for (const G of [le, oe]) I(G[0], G[1], G[2]), G.length === 4 && I(G[0], G[2], G[3]);
          for (let G = 0; G < Y.length; G++) {
            const fe = (G + 1) % Y.length;
            I(le[G], oe[G], oe[fe]), I(le[G], oe[fe], le[fe]);
          }
          const de = new ke();
          de.setAttribute("position", new gt(j, 3)), de.computeVertexNormals(), h.add(new je(de, d));
        }
      });
    } catch (J) {
      ie = String((J == null ? void 0 : J.message) ?? J);
    }
    globalThis.__extrusionDebug = { corridas: F, on: _, fallo: ie, nElementos: ae.length, nFormas: se.size, nEspesores: E.size, mallas: h.children.length - 1 };
  }), h;
}
class Xn extends nt {
  constructor(l, p, h, c, m, d, x) {
    super();
    const v = new Pn().moveTo(0, 0).lineTo(0, d[1]).lineTo(h, d[1]).lineTo(h, 0).lineTo(0, 0), C = v.getPoints(), F = new ke().setFromPoints(C);
    this.lines = new zt(F, new pt({ color: sn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const _ = new Zn(v), ee = new lt({ color: d[1] > 0 ? 24435 : 11411474, side: St });
    this.mesh = new je(_, ee), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new _t(`${m[1].toFixed(4)}`), this.normalizedResult = d, this.textPosition = Cn([l, p]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Jo extends nt {
  constructor(l, p, h, c, m, d, x) {
    super();
    const v = m[0] * h / (m[0] + m[1]), C = m[0] * m[1] > 0;
    if (this.text = new _t(`${m[0].toFixed(4)}`), this.text2 = new _t(`${(m[1] * -1).toFixed(4)}`), this.normalizedResult = d, this.textPosition = go(l, p), this.text2Position = go(p, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), C) {
      const F = new Pn().moveTo(0, 0).lineTo(0, d[0]).lineTo(v, 0).lineTo(0, 0), _ = new Pn().moveTo(v, 0).lineTo(h, -d[1]).lineTo(h, 0).lineTo(v, 0), ee = F.getPoints(), ae = _.getPoints(), ce = new ke().setFromPoints(ee), se = new ke().setFromPoints(ae), E = new pt({ color: sn().resultOutline });
      this.lines = new zt(ce, E), this.lines2 = new zt(se, E), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), x && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ie = new Zn(F), J = new Zn(_), _e = new lt({ color: d[0] > 0 ? 24435 : 11411474, side: St }), ye = new lt({ color: -d[1] > 0 ? 24435 : 11411474, side: St });
      this.mesh = new je(ie, _e), this.mesh2 = new je(J, ye), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), x && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const F = new Pn().moveTo(0, 0).lineTo(0, d[0]).lineTo(h, -d[1]).lineTo(h, 0).lineTo(0, 0), _ = F.getPoints(), ee = new ke().setFromPoints(_);
      this.lines = new zt(ee, new pt({ color: sn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ae = new Zn(F), ce = new lt({ color: d[0] > 0 ? 24435 : 11411474, side: St });
      this.mesh = new je(ae, ce), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var cs = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(cs || {});
function ra(e, l, p, h) {
  const c = new nt(), m = { normals: Xn, shearsY: Xn, shearsZ: Xn, torsions: Xn, bendingsY: Jo, bendingsZ: Jo };
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, p.val, l.frameResults.val == "none") return;
    c.children.forEach((x) => x.dispose()), c.clear();
    const d = cs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[d]) == null ? void 0 : _b.forEach((x, v) => {
      var _a3, _b2;
      const C = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[v]) ?? [0, 1], F = p.rawVal[C[0]], _ = p.rawVal[C[1]], ee = new S(..._).distanceTo(new S(...F)), ae = ca((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[d]), ce = x == null ? void 0 : x.map((J) => J / (ae === 0 ? 1 : ae)), se = Gn(F, _), E = new m[d](F, _, ee, se, x ?? [0, 0], ce ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(d)), ie = 0.05 * l.gridSize.rawVal;
      E.updateScale(ie * h.rawVal), c.add(E);
    });
  }), K.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    const d = 0.05 * l.gridSize.val;
    c.children.forEach((x) => x.updateScale(d * h.rawVal));
  }), K.derive(() => {
    c.visible = l.frameResults.val != "none";
  }), c;
}
function ca(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((p) => {
    const h = Math.max(...p ?? [0, 0]);
    h > l && (l = h);
  }), l;
}
class da extends nt {
  constructor(l, p, h) {
    super();
    const c = p === _o.reactions;
    h[0] && (this.xText1 = new _t(`${c ? "Fx" : "Dx"}: ` + h[0].toFixed(4))), h[3] && (this.xText2 = new _t(`${c ? "Mx" : "Rx"}: ` + h[3].toFixed(4))), h[1] && (this.yText1 = new _t(`${c ? "Fy" : "Dy"}: ` + h[1].toFixed(4))), h[4] && (this.yText2 = new _t(`${c ? "My" : "Ry"}: ` + h[4].toFixed(4))), h[2] && (this.zText1 = new _t(`${c ? "Fz" : "Dz"}: ` + h[2].toFixed(4))), h[5] && (this.zText2 = new _t(`${c ? "Mz" : "Rz"}: ` + h[5].toFixed(4))), (h[0] || h[3]) && (this.xArrow = new on(new S(1, 0, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[1] || h[4]) && (this.yArrow = new on(new S(0, 1, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[2] || h[5]) && (this.zArrow = new on(new S(0, 0, 1), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
var _o = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(_o || {});
function pa(e, l, p, h) {
  const c = new nt();
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    c.children.forEach((x) => x.dispose()), c.clear();
    const m = _o[l.nodeResults.rawVal], d = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[m]) == null ? void 0 : _b.forEach((x, v) => {
      const C = new da(p.rawVal[v], m, x ?? [0, 0, 0, 0, 0, 0]);
      C.updateScale(d * h.rawVal), c.add(C);
    });
  }), K.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const m = 0.05 * l.gridSize.val;
    c.children.forEach((d) => d.updateScale(m * h.rawVal));
  }), K.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function ua({ drawingObj: e, gridObj: l, scene: p, getActiveCamera: h, controls: c, gridSize: m, derivedDisplayScale: d, rendererElm: x, viewerRender: v }) {
  const C = new Ls(), F = new Is(), _ = (n) => {
    const o = x.getBoundingClientRect(), a = n.clientX - o.left, t = n.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const f = s / 2;
      if (a >= f) return F.x = (a - f) / f * 2 - 1, F.y = -(t / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      F.x = a / f * 2 - 1;
    } else F.x = a / s * 2 - 1;
    return F.y = -(t / i) * 2 + 1, h();
  }, ee = new je(new en(1e4, 1e4), new lt({ side: St, transparent: true, opacity: 0, depthWrite: false }));
  ee.visible = true, ee.frustumCulled = false, p.add(ee);
  const ae = (n, o, a) => {
    const t = new je(new en(1e4, 1e4), new lt({ side: St, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(n, o, a), t.visible = false, t.frustumCulled = false, p.add(t), t;
  }, ce = ae(Math.PI / 2, 0, 0), se = ae(0, Math.PI / 2, 0);
  let E = false;
  const ie = () => {
    if (E) return C.intersectObjects([ee], false);
    if (ce.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && ze.visible) {
      const a = C.intersectObjects([ze, Xe, $e], false);
      if (a.length > 0) return a;
    }
    const o = [ee];
    return ce.visible && o.push(ce), se.visible && o.push(se), qt.visible && Ht.length > 0 && o.push(...Ht), C.intersectObjects(o, false);
  }, J = new Yn(new ke(), new Un()), _e = new Yn(new ke(), new Un({ color: "gray", sizeAttenuation: false, size: 6 })), ye = new Yn(new ke(), new Un({ color: "orange", sizeAttenuation: false, size: 5 }));
  p.add(ye);
  const Y = document.createElement("input");
  Y.id = "hk-rubber-label", Y.type = "text", Y.spellcheck = false, Y.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, Y.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(Y);
  let R = null, Z = null, V = false;
  const T = new S(), U = (n, o, a, t, s, i) => {
    const r = t - n, f = s - o, y = i - a, g = Math.hypot(r, f, y);
    if (g < 0.01) {
      Y.style.display = "none";
      return;
    }
    R = [n, o, a], Z = [r / g, f / g, y / g], T.set((n + t) / 2, (o + s) / 2, (a + i) / 2), T.project(h());
    const b = x.getBoundingClientRect(), u = b.left + (T.x * 0.5 + 0.5) * b.width, M = b.top + (-T.y * 0.5 + 0.5) * b.height;
    if (Y.style.left = u + "px", Y.style.top = M + "px", Y.style.display = "block", !V) {
      if (Y.value = `${g.toFixed(2)} m`, document.activeElement !== Y) {
        const B = document.activeElement;
        B && (B.tagName === "INPUT" || B.tagName === "TEXTAREA") && B !== Y || Y.focus({ preventScroll: true });
      }
      try {
        Y.select();
      } catch {
      }
    }
  }, D = () => {
    Y.style.display = "none", R = null, Z = null, V = false, document.activeElement === Y && Y.blur();
  }, $ = (n) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      nn = n, ne(`\u21C9 DESFASE distancia ${n} m \u2014 designe la l\xEDnea y luego el lado.`), Y.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Te.length === 1) {
      const b = Te[0];
      Te = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, b[0], b[1], b[2], n), ne(`\u2713 C\xEDrculo r=${n} m en (${b[0].toFixed(2)}, ${b[1].toFixed(2)}, ${b[2].toFixed(2)}).`);
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
      ht = n, ne(`\u{1F4D0} Altura ${n}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), Y.blur();
      return;
    }
    if (!R || !Z || !e.polylines) return;
    let a = Z[0], t = Z[1], s = Z[2];
    Le === "x" ? (a = Math.sign(a) || 1, t = 0, s = 0) : Le === "y" ? (a = 0, t = Math.sign(t) || 1, s = 0) : Le === "z" && (a = 0, t = 0, s = Math.sign(s) || 1);
    const i = R[0] + a * n, r = R[1] + t * n, f = R[2] + s * n;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, f]];
    const y = e.polylines.rawVal, g = y.length ? y[y.length - 1] : [];
    e.polylines.val = [...y.slice(0, -1), [...g, e.points.rawVal.length - 1]], Y.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    v();
  }, j = (n) => {
    let o = n.trim().toLowerCase().replace(/m$/g, "").trim();
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
        const [i, r, f] = s;
        return { kind: "relSpherical", L: i, az: r, el: f };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((y) => parseFloat(y.trim()));
      if (s.some(isNaN)) return null;
      const [i, r, f = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: r, dz: f } : { kind: "absCart", x: i, y: r, z: f };
    }
    const t = parseFloat(o);
    return isNaN(t) || t <= 0 ? null : { kind: "length", L: t };
  }, ue = (n) => {
    if (!n) return null;
    if (n.kind === "absCart") return [n.x, n.y, n.z];
    if (n.kind === "relCart") return R ? [R[0] + n.dx, R[1] + n.dy, R[2] + n.dz] : null;
    if (n.kind === "absPolar") {
      const o = n.ang * Math.PI / 180;
      return [n.L * Math.cos(o), n.L * Math.sin(o), 0];
    }
    if (n.kind === "relPolar") {
      if (!R) return null;
      const o = n.ang * Math.PI / 180;
      return [R[0] + n.L * Math.cos(o), R[1] + n.L * Math.sin(o), R[2]];
    }
    if (n.kind === "relSpherical") {
      if (!R) return null;
      const o = n.az * Math.PI / 180, a = n.el * Math.PI / 180, t = n.L * Math.cos(a);
      return [R[0] + t * Math.cos(o), R[1] + t * Math.sin(o), R[2] + n.L * Math.sin(a)];
    }
    return null;
  }, le = (n) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, n];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], R = n, Y.blur();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    v();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (n) => {
    var _a2;
    const o = j(n);
    if (!o) return false;
    if (o.kind === "length") return $(o.L), true;
    const a = ue(o);
    if (!a) return false;
    Io(new S(a[0], a[1], a[2]), null), R = a, Y.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, Y.addEventListener("keydown", (n) => {
    if (n.key === "Enter") {
      n.preventDefault();
      const a = j(Y.value);
      if (!a) return;
      if (V = false, a.kind === "length") $(a.L), ne(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const t = ue(a);
        if (!t) return;
        le(t);
        const s = a.kind;
        ne(`\u270F ${s} \u2192 (${t[0].toFixed(2)}, ${t[1].toFixed(2)}, ${t[2].toFixed(2)})`);
      }
      return;
    }
    if (n.key === "Escape") {
      n.preventDefault(), V = false, Y.blur();
      return;
    }
    const o = n.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      n.preventDefault(), setTimeout(() => {
        if (!V && Y.style.display === "block") try {
          Y.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(n.key) || n.key === "Backspace" || n.key === "Delete") && (V = true);
  }), window.addEventListener("keydown", (n) => {
    if (!R || !Z || document.activeElement === Y) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(n.key) && (Y.value = n.key, Y.focus(), Y.setSelectionRange(1, 1), n.preventDefault());
  });
  const oe = document.createElement("div");
  oe.id = "hk-coord-readout", oe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", oe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(oe);
  const I = document.createElement("div");
  I.id = "hk-coord-fixed", I.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", I.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(I);
  const de = new zt(new ke().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new Sn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  de.frustumCulled = false, de.visible = false, de.name = "rubberBand", p.add(de), window.__hekatanRubberBand = de;
  const G = new zt(new ke(), new pt({ color: 2282478, transparent: true, opacity: 0.9 }));
  G.frustumCulled = false, G.visible = false, p.add(G);
  let fe = [];
  const he = new nt(), Ve = new je(new en(1, 1), new lt({ color: 2282478, transparent: true, opacity: 0.08, side: St, depthWrite: false })), Se = new Kt(new Yo(new en(1, 1)), new pt({ color: 2282478, transparent: true, opacity: 0.85 })), Be = new Kt(new ke(), new pt({ color: 2282478, transparent: true, opacity: 0.3 })), Je = (n, o) => {
    const a = [], t = Math.ceil(n / o);
    for (let s = -t; s <= t; s++) {
      const i = s * o;
      a.push(-n, i, 0, n, i, 0), a.push(i, -n, 0, i, n, 0);
    }
    Be.geometry.dispose(), Be.geometry = new ke(), Be.geometry.setAttribute("position", new gt(a, 3));
  };
  he.add(Ve, Se, Be), he.visible = false, he.frustumCulled = false, p.add(he);
  const ut = new nt();
  ut.frustumCulled = false, ut.visible = false, p.add(ut);
  const Ft = (n) => {
    const o = new ke().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), a = new Sn({ color: n, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new zt(o, a);
  }, P = Ft(16711680), L = Ft(65280), H = Ft(35071);
  ut.add(P, L, H);
  const N = (n) => {
    const o = new ke().setFromPoints([new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0)]), a = new pt({ color: n, transparent: true, opacity: 0.2, depthTest: false }), t = new ns(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, re = N(3462041), me = N(16724804), ve = N(6333946), Me = new nt();
  Me.frustumCulled = false, Me.visible = false, p.add(Me), Me.add(re, me, ve);
  const De = (n) => {
    const o = new en(1, 1), a = new lt({ color: n, transparent: true, opacity: 0.06, side: St, depthWrite: false }), t = new je(o, a);
    return t.frustumCulled = false, t.renderOrder = 996, t;
  }, ze = De(3462041), Xe = De(16724804), $e = De(6333946);
  Me.add(ze, Xe, $e);
  const Ue = (n, o, a, t) => {
    n.scale.set(2 * t, 2 * t, 1), a === "xy" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, 0, 0)) : a === "xz" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(Math.PI / 2, 0, 0)) : (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, Math.PI / 2, 0));
  }, rt = document.createElement("div");
  rt.id = "hk-refplane-badge", rt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(rt), window.__hekatanSetOrthoPlanes = (n) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = n, Me.visible = n, n) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      ot(re, i, "xy", r), ot(me, i, "xz", r), ot(ve, i, "yz", r), Ue(ze, i, "xy", r), Ue(Xe, i, "xz", r), Ue($e, i, "yz", r), ze.material.opacity = 0.05, Xe.material.opacity = 0.05, $e.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    v();
  }, window.__hekatanSetOrthoExt = (n) => {
    var _a2;
    if (window.__hekatanOrthoExt = n, !Me.visible) {
      v();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0];
    ot(re, i, "xy", n), ot(me, i, "xz", n), ot(ve, i, "yz", n), Ue(ze, i, "xy", n), Ue(Xe, i, "xz", n), Ue($e, i, "yz", n), v();
  };
  const He = (n) => {
    if (ze.material.opacity = n === "xy" ? 0.09 : 0.025, Xe.material.opacity = n === "xz" ? 0.09 : 0.025, $e.material.opacity = n === "yz" ? 0.09 : 0.025, n) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[n];
      rt.style.background = s.bg, rt.style.color = s.text, rt.textContent = `\u25A6 Plano ${n.toUpperCase()}`, rt.style.display = "block";
    } else rt.style.display = "none";
  }, ot = (n, o, a, t) => {
    let s;
    a === "xy" ? s = [new S(o[0] - t, o[1] - t, o[2]), new S(o[0] + t, o[1] - t, o[2]), new S(o[0] + t, o[1] + t, o[2]), new S(o[0] - t, o[1] + t, o[2]), new S(o[0] - t, o[1] - t, o[2])] : a === "xz" ? s = [new S(o[0] - t, o[1], o[2] - t), new S(o[0] + t, o[1], o[2] - t), new S(o[0] + t, o[1], o[2] + t), new S(o[0] - t, o[1], o[2] + t), new S(o[0] - t, o[1], o[2] - t)] : s = [new S(o[0], o[1] - t, o[2] - t), new S(o[0], o[1] + t, o[2] - t), new S(o[0], o[1] + t, o[2] + t), new S(o[0], o[1] - t, o[2] + t), new S(o[0], o[1] - t, o[2] - t)], n.geometry.setFromPoints(s);
  };
  let Le = null;
  window.__hekatanAxisLock = () => Le;
  let Jt = null;
  const Ze = document.createElement("div");
  Ze.id = "hk-axis-lock-badge", Ze.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ze);
  const Gt = () => {
    if (!Le) {
      Ze.style.display = "none";
      return;
    }
    const n = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ze.style.background = "rgba(15,23,42,0.92)", Ze.style.color = n[Le], Ze.style.border = `1.5px solid ${n[Le]}`, Ze.textContent = `\u{1F512} LOCK ${Le.toUpperCase()}`, Ze.style.display = "block";
  };
  window.addEventListener("keydown", (n) => {
    var _a2, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== Y) return;
    const a = n.key.toLowerCase(), t = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (n.key === "Enter" && t === "polyarea" && fe.length >= 3) {
      const s = pn();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), n.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Le = Le === a ? null : a, Gt(), n.preventDefault();
    else if (n.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), To(), n.preventDefault();
    } else n.key === "F3" ? (n.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : n.key === "F10" ? (n.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : n.key === "F8" && (n.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const n = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = n, n || Ln(), ne(`\u{1F9F2} OSNAP ${n ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const n = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = n, n || (ut.visible = false), ne(`\u25C8 POLAR ${n ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a2;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const n = window.__hekatanOrthoMode;
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = n ? "block" : "none";
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = n ? "block" : "none";
    }
  };
  const Bt = new S(), Ke = new S(), Ne = new S(), Fe = (n) => {
    if (!Le) return null;
    const o = n[0], a = n[1], t = n[2];
    return Le === "x" ? (Bt.set(o - 1e4, a, t), Ke.set(o + 1e4, a, t)) : Le === "y" ? (Bt.set(o, a - 1e4, t), Ke.set(o, a + 1e4, t)) : (Bt.set(o, a, t - 1e4), Ke.set(o, a, t + 1e4)), C.ray.distanceSqToSegment(Bt, Ke, null, Ne), Ne;
  };
  window.__hekatanProjectOnAxis = Fe;
  const Ae = new zt(new ke().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new pt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Ae.renderOrder = 998, Ae.frustumCulled = false, Ae.visible = false, p.add(Ae);
  let be = -1, We = -1, Oe = -1;
  const Pe = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Pe;
  const Ie = new zt(new ke().setFromPoints([new S(), new S()]), new pt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Ie.renderOrder = 997, Ie.frustumCulled = false, Ie.visible = false, p.add(Ie);
  const Ye = new je(new yn(0.02, 12, 12), new lt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Ye.renderOrder = 998, Ye.visible = false, p.add(Ye);
  const wt = (n) => {
    const o = h();
    if (o.isOrthographicCamera) {
      const t = o, s = (t.top - t.bottom) / t.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(n);
    return Math.max(0.05, a / 10);
  }, kt = () => {
    Ye.visible && Ye.scale.setScalar(wt(Ye.position));
  }, Pt = new nt();
  Pt.frustumCulled = false, p.add(Pt);
  const Nt = 2282478;
  let ft = null;
  const At = (n, o, a, t) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, r = t;
    for (let f = 0; f < s.length; f++) {
      const y = s[f];
      if (!y) continue;
      const g = Math.hypot(n - y[0], o - y[1], a - y[2]);
      g < r && (r = g, i = f);
    }
    return i;
  }, vt = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; Pt.children.length; ) {
      const r = Pt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], t = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of Pe) {
      const [f, ...y] = r.split(":");
      if (f === "pt") {
        const g = n[+y[0]];
        if (!g) continue;
        const b = new je(new yn(0.025, 12, 12), new lt({ color: Nt, transparent: true, opacity: 0.9, depthTest: false }));
        b.position.set(g[0], g[1], g[2]), b.renderOrder = 999, b.__isSelectionPt = true, Pt.add(b);
      } else if (f === "seg") {
        const g = o[+y[0]], b = n[g == null ? void 0 : g[+y[1]]], u = n[g == null ? void 0 : g[+y[1] + 1]];
        if (!b || !u) continue;
        const M = new ke().setFromPoints([new S(b[0], b[1], b[2]), new S(u[0], u[1], u[2])]), B = new zt(M, new pt({ color: Nt, transparent: true, opacity: 0.95, depthTest: false }));
        B.renderOrder = 999, Pt.add(B);
      } else if (f === "poly") {
        const b = o[+y[0]].map((B) => {
          const te = n[B];
          return te ? new S(te[0], te[1], te[2]) : null;
        }).filter(Boolean);
        if (b.length < 2) continue;
        const u = new ke().setFromPoints(b), M = new zt(u, new pt({ color: Nt, transparent: true, opacity: 0.95, depthTest: false }));
        M.renderOrder = 999, Pt.add(M);
      } else if (f === "aux") {
        const g = t[+y[0]];
        if (!g || g.length !== 6) continue;
        const b = new ke().setFromPoints([new S(g[0], g[1], g[2]), new S(g[3], g[4], g[5])]), u = new zt(b, new pt({ color: Nt, transparent: true, opacity: 0.95, depthTest: false }));
        u.renderOrder = 999, Pt.add(u);
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
    v();
  };
  window.__hekatanRefreshSelection = vt, window.__hekatanClearSelection = () => {
    Pe.clear(), vt();
  };
  const Ot = (n, o, a, t, s, i, r, f, y) => {
    const g = r - t, b = f - s, u = y - i, M = g * g + b * b + u * u;
    if (M < 1e-12) return Math.hypot(n - t, o - s, a - i);
    let B = ((n - t) * g + (o - s) * b + (a - i) * u) / M;
    B = Math.max(0, Math.min(1, B));
    const te = t + B * g, k = s + B * b, z = i + B * u;
    return Math.hypot(n - te, o - k, a - z);
  }, an = (n, o, a, t) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, f = -1, y = t;
    for (let g = 0; g < s.length; g++) {
      const b = s[g];
      for (let u = 0; u < b.length - 1; u++) {
        const M = i[b[u]], B = i[b[u + 1]];
        if (!M || !B) continue;
        const te = Ot(n, o, a, M[0], M[1], M[2], B[0], B[1], B[2]);
        te < y && (y = te, r = g, f = u);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: f, dist: y } : null;
  }, ln = (n, o, a, t) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let r = -1, f = t;
    for (let y = 0; y < i.length; y++) {
      const g = i[y];
      if (!g || g.length !== 6) continue;
      const b = Ot(n, o, a, g[0], g[1], g[2], g[3], g[4], g[5]);
      b < f && (f = b, r = y);
    }
    return r;
  }, rn = (n) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[n];
    if (!t || t.length !== 6) {
      Ae.visible = false;
      return;
    }
    Ae.geometry.setFromPoints([new S(t[0], t[1], t[2]), new S(t[3], t[4], t[5])]), Ae.visible = true;
  }, Hn = (n, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[n], t = e.points.rawVal;
    if (!a || a.length < 2) {
      Ae.visible = false;
      return;
    }
    const s = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(n)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const r of a) {
      const f = t[r];
      f && i.push(new S(f[0], f[1], f[2]));
    }
    else {
      const r = t[a[o]], f = t[a[o + 1]];
      r && i.push(new S(r[0], r[1], r[2])), f && i.push(new S(f[0], f[1], f[2]));
    }
    Ae.geometry.setFromPoints(i), Ae.visible = true;
  }, cn = (n) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (n < 0 || n >= o.length) return;
    const a = o.filter((y, g) => g !== n), t = /* @__PURE__ */ new Set();
    for (const y of a) for (const g of y) t.add(g);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let y = 0; y < s.length; y++) t.has(y) && (i.set(y, r.length), r.push(s[y]));
    const f = a.map((y) => y.map((g) => i.get(g)).filter((g) => g !== void 0));
    e.points.val = r, e.polylines.val = f, e.areas && (e.areas.val = e.areas.rawVal.filter((y) => y !== n).map((y) => y > n ? y - 1 : y)), Ae.visible = false, be = -1, We = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, Fn = (n, o) => {
    var _a2, _b, _c;
    if (!e.polylines) return;
    const a = e.polylines.rawVal;
    if (n < 0 || n >= a.length) return;
    if (((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(n)) ?? false) {
      cn(n);
      return;
    }
    const s = a[n];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      cn(n);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const r = [...a.slice(0, n), ...i, ...a.slice(n + 1)], f = /* @__PURE__ */ new Set();
    for (const M of r) for (const B of M) f.add(B);
    const y = e.points.rawVal, g = /* @__PURE__ */ new Map(), b = [];
    for (let M = 0; M < y.length; M++) f.has(M) && (g.set(M, b.length), b.push(y[M]));
    const u = r.map((M) => M.map((B) => g.get(B)).filter((B) => B !== void 0));
    if (e.points.val = b, e.polylines.val = u, e.areas) {
      const M = i.length - 1;
      e.areas.val = e.areas.rawVal.map((B) => B > n ? B + M : B);
    }
    Ae.visible = false, be = -1, We = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  J.geometry.setAttribute("position", new gt(e.points.rawVal.flat(), 3)), J.geometry.computeBoundingSphere(), J.frustumCulled = false, _e.frustumCulled = false, p.add(_e), ee.position.set(0, 0, 0), ee.rotateX(Math.PI / 2), ee.geometry.rotateX(Math.PI / 2), ee.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (n, o, a) => {
    if (e.points.val = [...e.points.rawVal, [n, o, a]], e.polylines) {
      const t = e.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
      e.polylines.val = [...t.slice(0, -1), [...s, e.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a2;
    if (!e.polylines) return;
    const n = e.polylines.rawVal;
    ((_a2 = n[n.length - 1]) == null ? void 0 : _a2.length) !== 0 && (e.polylines.val = [...n, []]);
  };
  const dn = [];
  window.__hekatanCirculos = dn;
  let An = [], xn = "";
  const En = () => {
    var _a2;
    const n = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${n.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === xn) return An;
    xn = a;
    const t = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const r = s.slice(0, i - 1).map((b) => n[b]).filter(Boolean);
      if (r.length < 5) continue;
      const f = [0, 1, 2].map((b) => r.reduce((u, M) => u + M[b], 0) / r.length), y = r.map((b) => Math.hypot(b[0] - f[0], b[1] - f[1], b[2] - f[2])), g = y.reduce((b, u) => b + u, 0) / y.length;
      g < 1e-9 || y.some((b) => Math.abs(b - g) > 5e-3 * g) || t.push({ c: f, r: g });
    }
    return An = t;
  };
  window.__hekatanCentrosDeducidos = En, window.__hekatanDrawCircle = (n, o, a, t, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(s)), f = e.points.rawVal.length, y = [];
    for (let g = 0; g < r; g++) {
      const b = 2 * Math.PI * g / r, u = t * Math.cos(b), M = t * Math.sin(b);
      let B;
      i === "xy" ? B = [n + u, o + M, a] : i === "xz" ? B = [n + u, o, a + M] : B = [n, o + u, a + M], y.push(B);
    }
    if (e.points.val = [...e.points.rawVal, ...y], dn.push({ c: [n, o, a], r: t }), e.polylines) {
      const g = [...y.map((u, M) => f + M), f], b = e.polylines.rawVal;
      ((_a2 = b[b.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...b, g, []] : e.polylines.val = [...b.slice(0, -1), g, []];
    }
  }, window.__hekatanDrawArc = (n, o, a, t = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(t)), i = new S(...n), r = new S(...o), f = new S(...a), y = new S().subVectors(r, i), g = new S().subVectors(f, i), b = new S().crossVectors(y, g).normalize(), u = new S().addVectors(i, r).multiplyScalar(0.5), M = new S().addVectors(r, f).multiplyScalar(0.5), B = new S().crossVectors(y, b).normalize(), te = new S().crossVectors(new S().subVectors(f, r), b).normalize(), k = new S().subVectors(M, u), z = B.x * te.y - B.y * te.x;
    let w;
    if (Math.abs(z) > 1e-9) {
      const Ce = (k.x * te.y - k.y * te.x) / z;
      w = new S().addVectors(u, B.clone().multiplyScalar(Ce));
    } else w = u.clone();
    const A = i.distanceTo(w), X = new S().subVectors(i, w), q = new S().subVectors(f, w), pe = Math.acos(Math.max(-1, Math.min(1, X.dot(q) / (A * A)))), W = e.points.rawVal.length, Q = [], Ee = b.clone();
    for (let Ce = 0; Ce <= s; Ce++) {
      const we = Ce / s, Ge = pe * we, qe = new ho().setFromAxisAngle(Ee, Ge), at = X.clone().applyQuaternion(qe).add(w);
      Q.push([at.x, at.y, at.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...Q], dn.push({ c: [w.x, w.y, w.z], r: A }), e.polylines) {
      const Ce = Q.map((Ge, qe) => W + qe), we = e.polylines.rawVal;
      e.polylines.val = [...we.slice(0, -1), Ce, []];
    }
  }, window.__hekatanDrawSlabChaflan = (n, o, a = 1, t = 6, s = 6) => {
    const i = Math.min(n[0], o[0]), r = Math.max(n[0], o[0]), f = Math.min(n[1], o[1]), y = Math.max(n[1], o[1]), g = (n[2] + o[2]) / 2, b = r - i, u = y - f, M = Math.min(a, b / 2 - 0.01, u / 2 - 0.01);
    if (M <= 0) return;
    const B = e.points.rawVal.length, te = [], k = [], z = (w, A) => {
      te.push([w, A, g]), k.push(B + te.length - 1);
    };
    for (let w = 0; w <= s; w++) z(i + M + (b - 2 * M) * w / s, f);
    for (let w = 1; w <= t; w++) {
      const A = -Math.PI / 2 + Math.PI / 2 * w / t;
      z(r - M + M * Math.cos(A), f + M + M * Math.sin(A));
    }
    for (let w = 1; w <= s; w++) z(r, f + M + (u - 2 * M) * w / s);
    for (let w = 1; w <= t; w++) {
      const A = 0 + Math.PI / 2 * w / t;
      z(r - M + M * Math.cos(A), y - M + M * Math.sin(A));
    }
    for (let w = 1; w <= s; w++) z(r - M - (b - 2 * M) * w / s, y);
    for (let w = 1; w <= t; w++) {
      const A = Math.PI / 2 + Math.PI / 2 * w / t;
      z(i + M + M * Math.cos(A), y - M + M * Math.sin(A));
    }
    for (let w = 1; w <= s; w++) z(i, y - M - (u - 2 * M) * w / s);
    for (let w = 1; w <= t; w++) {
      const A = Math.PI + Math.PI / 2 * w / t;
      z(i + M + M * Math.cos(A), f + M + M * Math.sin(A));
    }
    if (k.push(B), e.points.val = [...e.points.rawVal, ...te], e.polylines) {
      const w = e.polylines.rawVal;
      e.polylines.val = [...w.slice(0, -1), k, []];
    }
  }, window.__hekatanDrawRect = (n, o) => {
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], r = o[0], f = o[1], y = o[2];
    let g;
    if (Math.abs(i - y) < 1e-6 ? g = [[t, s, i], [r, s, i], [r, f, i], [t, f, i]] : Math.abs(s - f) < 1e-6 ? g = [[t, s, i], [r, s, i], [r, s, y], [t, s, y]] : g = [[t, s, i], [t, f, i], [t, f, y], [t, s, y]], e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const b = [a, a + 1, a + 2, a + 3, a], u = e.polylines.rawVal;
      e.polylines.val = [...u.slice(0, -1), b, []];
    }
  }, window.__hekatanDrawRectArea = (n, o) => {
    var _a2;
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], r = o[0], f = o[1], y = o[2];
    let g;
    if (E && e.gridTarget) {
      const b = e.gridTarget.rawVal, u = new kn(...b.rotation), M = new S(1, 0, 0).applyEuler(u), B = new S(0, 1, 0).applyEuler(u), te = new S(...b.position), k = new S(t, s, i), z = new S(r, f, y), w = k.clone().sub(te).dot(M), A = k.clone().sub(te).dot(B), X = z.clone().sub(te).dot(M), q = z.clone().sub(te).dot(B), pe = (W, Q) => te.clone().addScaledVector(M, W).addScaledVector(B, Q).toArray();
      g = [pe(w, A), pe(X, A), pe(X, q), pe(w, q)];
    } else Math.abs(i - y) < 1e-6 ? g = [[t, s, i], [r, s, i], [r, f, i], [t, f, i]] : Math.abs(s - f) < 1e-6 ? g = [[t, s, i], [r, s, i], [r, s, y], [t, s, y]] : g = [[t, s, i], [t, f, i], [t, f, y], [t, s, y]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const b = e.polylines.rawVal, u = b.length - 1, M = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [...b.slice(0, -1), M, []], e.areas && (e.areas.val = [...e.areas.rawVal, u]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    v();
  }, window.__hekatanMeshPolyArea = (n, o) => {
    var _a2;
    const a = n.length;
    if (a < 3) return 0;
    let t = 0, s = 0, i = 0;
    for (let xe = 0; xe < a; xe++) {
      const Re = n[xe], tt = n[(xe + 1) % a];
      t += (Re[1] - tt[1]) * (Re[2] + tt[2]), s += (Re[2] - tt[2]) * (Re[0] + tt[0]), i += (Re[0] - tt[0]) * (Re[1] + tt[1]);
    }
    const r = Math.hypot(t, s, i) || 1;
    t /= r, s /= r, i /= r;
    let f = n[1][0] - n[0][0], y = n[1][1] - n[0][1], g = n[1][2] - n[0][2];
    const b = Math.hypot(f, y, g) || 1;
    f /= b, y /= b, g /= b;
    let u = s * g - i * y, M = i * f - t * g, B = t * y - s * f;
    const te = Math.hypot(u, M, B) || 1;
    u /= te, M /= te, B /= te;
    const k = n[0], z = (xe) => [(xe[0] - k[0]) * f + (xe[1] - k[1]) * y + (xe[2] - k[2]) * g, (xe[0] - k[0]) * u + (xe[1] - k[1]) * M + (xe[2] - k[2]) * B], w = (xe, Re) => [k[0] + xe * f + Re * u, k[1] + xe * y + Re * M, k[2] + xe * g + Re * B], A = n.map(z);
    let X = 1 / 0, q = -1 / 0, pe = 1 / 0, W = -1 / 0;
    for (const [xe, Re] of A) xe < X && (X = xe), xe > q && (q = xe), Re < pe && (pe = Re), Re > W && (W = Re);
    const Q = q - X, Ee = W - pe;
    if (Q < 1e-6 || Ee < 1e-6) return 0;
    let Ce = o && o > 0 ? o : 0.5;
    for (; Q / Ce * (Ee / Ce) > 2500; ) Ce *= 2;
    Ce = Math.min(Ce, Math.min(Q, Ee));
    const we = (xe, Re) => {
      let tt = false;
      for (let Tt = 0, Ut = A.length - 1; Tt < A.length; Ut = Tt++) {
        const [Xt, Wt] = A[Tt], [wn, _n] = A[Ut];
        Wt > Re != _n > Re && xe < (wn - Xt) * (Re - Wt) / (_n - Wt) + Xt && (tt = !tt);
      }
      return tt;
    }, Ge = Math.max(1, Math.round(Q / Ce)), qe = Math.max(1, Math.round(Ee / Ce)), at = Q / Ge, it = Ee / qe, bt = /* @__PURE__ */ new Map(), ct = [], ge = e.points.rawVal.length, et = (xe, Re) => {
      const tt = xe + "," + Re, Tt = bt.get(tt);
      if (Tt !== void 0) return Tt;
      const Ut = ge + ct.length;
      return ct.push(w(X + xe * at, pe + Re * it)), bt.set(tt, Ut), Ut;
    }, Qe = [];
    for (let xe = 0; xe < Ge; xe++) for (let Re = 0; Re < qe; Re++) {
      if (!we(X + (xe + 0.5) * at, pe + (Re + 0.5) * it)) continue;
      const tt = et(xe, Re), Tt = et(xe + 1, Re), Ut = et(xe + 1, Re + 1), Xt = et(xe, Re + 1);
      Qe.push([tt, Tt, Ut, Xt]);
    }
    if (!Qe.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...ct], e.polylines && e.areas) {
      let xe = e.polylines.rawVal.slice();
      xe.length && xe[xe.length - 1].length === 0 && (xe = xe.slice(0, -1));
      const Re = [];
      for (const tt of Qe) Re.push(xe.length), xe.push([tt[0], tt[1], tt[2], tt[3], tt[0]]);
      xe.push([]), e.polylines.val = xe, e.areas.val = [...e.areas.rawVal, ...Re];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return v(), Qe.length;
  };
  const pn = () => {
    if (fe.length < 3) return fe = [], G.visible = false, v(), 0;
    const n = window.__hekatanMeshPolyArea(fe.slice());
    return fe = [], G.visible = false, v(), n;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (n, o, a) => {
    var _a2;
    const t = new S(n[0], n[1], n[2]), s = new S(o[0], o[1], o[2]), i = new S(a[0], a[1], a[2]), r = new S().subVectors(s, t).cross(new S().subVectors(i, t));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const f = new ho().setFromUnitVectors(new S(0, 0, 1), r), y = new kn().setFromQuaternion(f);
    e.gridTarget && (e.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [y.x, y.y, y.z] }), E = true;
    const g = new S().addVectors(t, s).add(i).multiplyScalar(1 / 3), b = Math.max(t.distanceTo(s), t.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, u = b / 2;
    Ve.geometry.dispose(), Ve.geometry = new en(b, b), Se.geometry.dispose(), Se.geometry = new Yo(new en(b, b)), Je(u, 1), he.position.copy(g), he.quaternion.copy(f), he.scale.set(1, 1, 1), he.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return v(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] }), E = false, he.visible = false, v();
  };
  const $t = new nt();
  $t.visible = false, p.add($t), window.__hekatanShowAxes = (n, o, a = 12, t = 2) => {
    var _a2, _b;
    for (; $t.children.length; ) {
      const b = $t.children.pop();
      (_a2 = b.geometry) == null ? void 0 : _a2.dispose(), (_b = b.material) == null ? void 0 : _b.dispose();
    }
    if (!n.length || !o.length) return;
    const s = Math.min(...o) - t, i = Math.max(...o) + t, r = Math.min(...n) - t, f = Math.max(...n) + t, y = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", g = (b, u, M, B, te) => {
      const k = document.createElement("canvas");
      k.width = 64, k.height = 32;
      const z = k.getContext("2d");
      z.fillStyle = te, z.font = "bold 22px sans-serif", z.textAlign = "center", z.fillText(b, 32, 26);
      const w = new Uo(k), A = new Zo({ map: w, transparent: true }), X = new qo(A);
      return X.position.set(u, M, B), X.scale.set(1.2, 0.6, 1), X;
    };
    n.forEach((b, u) => {
      const M = u < y.length ? y[u] : `X${u}`, B = new ke().setFromPoints([new S(b, s, 0), new S(b, i, 0), new S(b, s, 0), new S(b, s, a)]), te = new Sn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new Kt(B, te);
      k.computeLineDistances(), $t.add(k), $t.add(g(M, b, s - 0.5, 0, "#60a5fa")), $t.add(g(M, b, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((b, u) => {
      const M = `${u + 1}`, B = new ke().setFromPoints([new S(r, b, 0), new S(f, b, 0), new S(r, b, 0), new S(r, b, a)]), te = new Sn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new Kt(B, te);
      k.computeLineDistances(), $t.add(k), $t.add(g(M, r - 0.5, b, 0, "#fb7185")), $t.add(g(M, f + 0.5, b, 0, "#fb7185"));
    }), $t.visible = true, v();
  }, window.__hekatanHideAxes = () => {
    $t.visible = false, v();
  };
  const qt = new nt();
  qt.visible = false, p.add(qt);
  let Ht = [];
  window.__hekatanShowRefPlanes = (n = [0, 3, 6, 9, 12], o = 20, a = 0, t = 0) => {
    var _a2, _b;
    for (; qt.children.length; ) {
      const i = qt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    Ht.forEach((i) => {
      p.remove(i), i.geometry.dispose(), i.material.dispose();
    }), Ht = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    n.forEach((i, r) => {
      const f = s[r % s.length], y = o / 2, g = [new S(a - y, t - y, i), new S(a + y, t - y, i), new S(a + y, t + y, i), new S(a - y, t + y, i), new S(a - y, t - y, i)], b = new ke().setFromPoints(g), u = new pt({ color: f, transparent: true, opacity: 0.55 });
      qt.add(new zt(b, u));
      const M = document.createElement("canvas");
      M.width = 128, M.height = 32;
      const B = M.getContext("2d");
      B.fillStyle = `#${f.toString(16).padStart(6, "0")}`, B.font = "bold 18px sans-serif", B.fillText(`Z = ${i} m`, 4, 22);
      const te = new Uo(M), k = new Zo({ map: te, transparent: true }), z = new qo(k);
      z.position.set(a - y - 1.5, t - y - 1.5, i), z.scale.set(2.5, 0.6, 1), qt.add(z);
      const w = new en(1e4, 1e4), A = new lt({ visible: false, side: St }), X = new je(w, A);
      X.position.set(0, 0, i), X.frustumCulled = false, X.userData = { refPlaneZ: i }, p.add(X), Ht.push(X);
    }), qt.visible = true, v();
  }, window.__hekatanHideRefPlanes = () => {
    qt.visible = false, Ht.forEach((n) => {
      n.visible = false;
    }), v();
  };
  const Qt = new nt();
  Qt.frustumCulled = false, p.add(Qt);
  const ds = () => {
    var _a2, _b, _c, _d;
    for (; Qt.children.length; ) {
      const a = Qt.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxLines, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const t = new ke().setFromPoints([new S(a[0], a[1], a[2]), new S(a[3], a[4], a[5])]), s = new Sn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new zt(t, s);
      i.computeLineDistances(), Qt.add(i);
    }
  };
  K.derive(() => {
    const n = window.__hekatanDrawingAuxLines;
    (n == null ? void 0 : n.val) && (n.val, ds(), v());
  });
  const un = new nt();
  un.frustumCulled = false, p.add(un);
  const So = () => {
    var _a2, _b, _c, _d;
    for (; un.children.length; ) {
      const a = un.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxPoints, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const t = new je(new yn(0.025, 12, 12), new lt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      t.position.set(a[0], a[1], a[2]), t.renderOrder = 996, t.scale.setScalar(wt(t.position)), un.add(t);
    }
  };
  K.derive(() => {
    const n = window.__hekatanDrawingAuxPoints;
    (n == null ? void 0 : n.val) !== void 0 && (n.val, So(), v());
  }), c.addEventListener("change", () => {
    un.children.forEach((n) => {
      n.scale.setScalar(wt(n.position));
    });
  }), window.__hekatanRenderAuxPoints = So;
  const yt = new nt(), ps = new je(new yn(0.01, 12, 12), new lt({ color: 16724804, transparent: true, opacity: 0.95 })), us = new je(new yn(0.015, 12, 12), new lt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  yt.add(ps, us);
  const fn = 0.08, Wn = (n, o, a) => {
    const t = new ke().setFromPoints([new S(...n), new S(...o)]);
    return new zt(t, new pt({ color: a, transparent: true, opacity: 0.7 }));
  };
  yt.add(Wn([-fn, 0, 0], [fn, 0, 0], 16711680)), yt.add(Wn([0, -fn, 0], [0, fn, 0], 65280)), yt.add(Wn([0, 0, -fn], [0, 0, fn], 35071)), yt.visible = false, yt.frustumCulled = false, p.add(yt);
  let Jn = 2;
  const Tn = (n) => {
    const o = h(), a = (x == null ? void 0 : x.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(n) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, gn = () => {
    if (!yt.visible) return;
    const n = Jn * Tn(yt.position) / 0.015;
    yt.scale.setScalar(Math.max(1e-4, Math.min(1e5, n)));
  };
  let On = 10;
  const Qn = (n) => Math.max(1e-4, On * Tn(n));
  window.__hekatanAperturaPx = (n) => (typeof n == "number" && n > 0 && (On = n), On), window.__hekatanUpdateSnapScale = gn, window.__hekatanSnapMarker = yt, window.__hekatanMetrosPorPixel = Tn, window.__hekatanSnapPx = (n) => (typeof n == "number" && n > 0 && (Jn = n, gn(), v()), Jn);
  const ko = () => {
    Pt.children.length !== 0 && Pt.children.forEach((n) => {
      if (!n.__isSelectionPt) return;
      const o = n;
      o.scale.setScalar(wt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = ko, c.addEventListener("change", () => {
    var _a2;
    gn(), Ye.visible && kt(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), ko();
  }), window.__hekatanShowSnap = (n, o, a) => {
    yt.position.set(n, o, a), yt.visible = true, gn(), v();
  }, window.__hekatanHideSnap = () => {
    yt.visible = false, v();
  }, x.addEventListener("pointermove", (n) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q;
    const o = _(n);
    if (!o) return;
    C.setFromCamera(F, o);
    const a = ie();
    if (a.length) {
      const t = a[0].point, s = Qn(t), i = (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, t.x, t.y, t.z, s);
      if (i) Fo(i.type, i.x, i.y, i.z), yt.position.set(i.x, i.y, i.z), yt.visible = true, t.set(i.x, i.y, i.z);
      else {
        Ln();
        const b = window.__hekatanSnapEnabled !== false, u = window.__hekatanSnap2D ?? 0.5;
        b && u > 0 && (t.x = Math.round(t.x / u) * u, t.y = Math.round(t.y / u) * u, t.z = Math.round(t.z / u) * u), yt.position.copy(t), yt.visible = true;
      }
      gn();
      const r = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (r === "select" || !r) {
        const b = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = At(t.x, t.y, t.z, b), M = an(t.x, t.y, t.z, b), B = ln(t.x, t.y, t.z, b);
        if (u >= 0) {
          const w = e.points.rawVal[u];
          Ye.position.set(w[0], w[1], w[2]), Ye.visible = true, kt(), Ie.visible = false, ft = { kind: "pt", a: u };
        } else if (M) {
          const w = e.points.rawVal, A = e.polylines.rawVal[M.polyIdx], X = w[A[M.segIdx]], q = w[A[M.segIdx + 1]];
          Ie.geometry.setFromPoints([new S(X[0], X[1], X[2]), new S(q[0], q[1], q[2])]), Ie.visible = true, Ye.visible = false, ft = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
        } else if (B >= 0) {
          const A = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[B];
          A && (Ie.geometry.setFromPoints([new S(A[0], A[1], A[2]), new S(A[3], A[4], A[5])]), Ie.visible = true, Ye.visible = false, ft = { kind: "aux", a: B });
        } else Ie.visible = false, Ye.visible = false, ft = null;
        oe.style.left = n.clientX + "px", oe.style.top = n.clientY + "px", oe.style.display = "block";
        let te = t;
        if ((ft == null ? void 0 : ft.kind) === "pt") {
          const w = e.points.rawVal[ft.a];
          w && (te = new S(w[0], w[1], w[2]));
        }
        const k = `X=${te.x.toFixed(2)} Y=${te.y.toFixed(2)} Z=${te.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [te.x, te.y, te.z], ft) {
          const w = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          oe.textContent = `${k}  \xB7  \u{1F5B1} Click \u2192 ${w[ft.kind]}`;
        } else oe.textContent = k;
        const z = document.getElementById("hk-coord-fixed");
        z && (z.textContent = k), de.visible = false, ut.visible = false, v();
        return;
      }
      if (r === "delete" || r === "trim" || r === "extend" || r === "offset") {
        const b = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = an(t.x, t.y, t.z, b), M = ln(t.x, t.y, t.z, b);
        let B = false;
        if (M >= 0) if (!u) B = true;
        else {
          const w = window.__hekatanDrawingAuxLines, X = ((w == null ? void 0 : w.rawVal) ?? (w == null ? void 0 : w.val) ?? w ?? [])[M];
          Ot(t.x, t.y, t.z, X[0], X[1], X[2], X[3], X[4], X[5]) < u.dist && (B = true);
        }
        B ? (Oe = M, be = -1, We = -1, rn(M)) : u ? (be = u.polyIdx, We = u.segIdx, Oe = -1, Hn(u.polyIdx, u.segIdx)) : (be = -1, We = -1, Oe = -1, Ae.visible = false), de.visible = false, ut.visible = false, D(), oe.style.left = n.clientX + "px", oe.style.top = n.clientY + "px", oe.style.display = "block";
        const te = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        let k = "";
        B ? k = `\u{1F5D1} l\xEDnea aux #${Oe + 1}` : u ? k = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(u.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${u.polyIdx + 1}` : `\u{1F5D1} seg ${u.segIdx + 1} / poly #${u.polyIdx + 1}` : k = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", oe.textContent = `${te}  \xB7  ${k}`;
        const z = document.getElementById("hk-coord-fixed");
        z && (z.textContent = te), v();
        return;
      } else Ae.visible = false, be = -1, Oe = -1;
      oe.style.left = n.clientX + "px", oe.style.top = n.clientY + "px", oe.style.display = "block";
      const f = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], y = f[f.length - 1] ?? [], g = e.points.rawVal ?? [];
      if (y.length > 0 && g[y[y.length - 1]]) {
        const b = y[y.length - 1], u = g[b];
        let M = Le;
        if (Jt = null, !M && window.__hekatanAxisSnap !== false) {
          const we = x.getBoundingClientRect(), Ge = n.clientX, qe = n.clientY, at = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, it = new S(u[0], u[1], u[2]), bt = [["x", new S(1, 0, 0)], ["y", new S(0, 1, 0)], ["z", new S(0, 0, 1)]], ct = (et) => {
            const Qe = et.clone().project(o);
            return { x: (Qe.x * 0.5 + 0.5) * we.width + we.left, y: (-Qe.y * 0.5 + 0.5) * we.height + we.top };
          };
          let ge = null;
          for (const [et, Qe] of bt) {
            const xe = ct(it.clone().addScaledVector(Qe, -at)), Re = ct(it.clone().addScaledVector(Qe, at)), tt = Re.x - xe.x, Tt = Re.y - xe.y, Ut = Ge - xe.x, Xt = qe - xe.y, Wt = tt * tt + Tt * Tt || 1;
            let wn = (Ut * tt + Xt * Tt) / Wt;
            wn = Math.max(0, Math.min(1, wn));
            const _n2 = Math.hypot(Ge - (xe.x + wn * tt), qe - (xe.y + wn * Tt));
            if (ge === null || _n2 < ge.dpx) {
              const co = C.ray, Ro = it.clone().sub(co.origin), po = Qe.dot(co.direction), Bo = Qe.dot(Ro), Ss = co.direction.dot(Ro), Do = 1 - po * po, ks = Math.abs(Do) < 1e-6 ? -Bo : (po * Ss - Bo) / Do;
              ge = { axis: et, dpx: _n2, pt: it.clone().addScaledVector(Qe, ks) };
            }
          }
          ge && ge.dpx <= 12 && (t.copy(ge.pt), M = ge.axis, Jt = ge.pt.clone());
        }
        const B = !!window.__hekatanOrthoMode;
        if (!M && B) {
          const we = Math.abs(t.x - u[0]), Ge = Math.abs(t.y - u[1]), qe = Math.abs(t.z - u[2]), at = (_l = a[0]) == null ? void 0 : _l.object;
          let it = null;
          at === ze ? it = "xy" : at === Xe ? it = "xz" : at === $e && (it = "yz"), it === "xy" ? M = we >= Ge ? "x" : "y" : it === "xz" ? M = we >= qe ? "x" : "z" : it === "yz" ? M = Ge >= qe ? "y" : "z" : M = we >= Ge && we >= qe ? "x" : Ge >= qe ? "y" : "z";
        }
        const te = window.__hekatanPolarTrack !== false;
        if (!M && te) {
          const we = t.x - u[0], Ge = t.y - u[1], qe = t.z - u[2], at = Math.hypot(we, Ge, qe);
          if (at > 1e-3) {
            const bt = Math.tan(6 * Math.PI / 180) * at, ct = Math.hypot(Ge, qe), ge = Math.hypot(we, qe), et = Math.hypot(we, Ge), Qe = [["x", ct], ["y", ge], ["z", et]];
            Qe.sort((xe, Re) => xe[1] - Re[1]), Qe[0][1] <= bt && (M = Qe[0][0]);
          }
        }
        if (M) {
          const we = u[0], Ge = u[1], qe = u[2];
          M === "x" ? t.set(t.x, Ge, qe) : M === "y" ? t.set(we, t.y, qe) : t.set(we, Ge, t.z);
          const at = !!Le, bt = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          Ze.style.background = "rgba(15,23,42,0.92)", Ze.style.color = bt, Ze.style.border = `1.5px solid ${bt}`;
          const ct = (_m = a[0]) == null ? void 0 : _m.object;
          let ge = null;
          ct === ze ? ge = "xy" : ct === Xe ? ge = "xz" : ct === $e && (ge = "yz");
          const et = ge ? ` (plano ${ge.toUpperCase()})` : "";
          Ze.textContent = at ? `\u{1F512} LOCK ${M.toUpperCase()}${et}` : `\u22A5 ORTO ${M.toUpperCase()}${et}`, Ze.style.left = n.clientX + 20 + "px", Ze.style.top = n.clientY + 18 + "px", Ze.style.transform = "none", Ze.style.display = "block";
        } else Le || (Ze.style.display = "none");
        const k = Math.hypot(t.x - u[0], t.y - u[1], t.z - u[2]), z = Math.atan2(t.y - u[1], t.x - u[0]) * 180 / Math.PI, w = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        oe.textContent = `${w} | \u0394L=${k.toFixed(2)}m ${z.toFixed(0)}\xB0`;
        const A = document.getElementById("hk-coord-fixed");
        A && (A.textContent = w), de.geometry.setFromPoints([new S(u[0], u[1], u[2]), new S(t.x, t.y, t.z)]), (_n = de.computeLineDistances) == null ? void 0 : _n.call(de), de.visible = true, U(u[0], u[1], u[2], t.x, t.y, t.z);
        const X = window.__hekatanOrthoExt ?? 8, q = window.__hekatanShowOrthoPlanes !== false;
        Me.visible = q, q || He(null), q && (ot(re, u, "xy", X), ot(me, u, "xz", X), ot(ve, u, "yz", X), Ue(ze, u, "xy", X), Ue(Xe, u, "xz", X), Ue($e, u, "yz", X));
        const pe = q ? C.intersectObjects([ze, Xe, $e], false) : [];
        let W = null;
        if (pe.length > 0) {
          const we = pe[0].object;
          we === ze ? W = "xy" : we === Xe ? W = "xz" : we === $e && (W = "yz");
        }
        He(W), W && (rt.style.left = n.clientX + "px", rt.style.top = n.clientY + "px"), P.geometry.setFromPoints([new S(u[0] - X, u[1], u[2]), new S(u[0] + X, u[1], u[2])]), (_o2 = P.computeLineDistances) == null ? void 0 : _o2.call(P), L.geometry.setFromPoints([new S(u[0], u[1] - X, u[2]), new S(u[0], u[1] + X, u[2])]), (_p = L.computeLineDistances) == null ? void 0 : _p.call(L), H.geometry.setFromPoints([new S(u[0], u[1], u[2] - X), new S(u[0], u[1], u[2] + X)]), (_q = H.computeLineDistances) == null ? void 0 : _q.call(H), ut.visible = true;
        const Q = P.material, Ee = L.material, Ce = H.material;
        M === "x" ? (Q.opacity = 0.95, Ee.opacity = 0.1, Ce.opacity = 0.1) : M === "y" ? (Q.opacity = 0.1, Ee.opacity = 0.95, Ce.opacity = 0.1) : M === "z" ? (Q.opacity = 0.1, Ee.opacity = 0.1, Ce.opacity = 0.95) : (Q.opacity = 0.5, Ee.opacity = 0.5, Ce.opacity = 0.5);
      } else {
        const b = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        oe.textContent = b;
        const u = document.getElementById("hk-coord-fixed");
        if (u && (u.textContent = b), de.visible = false, ut.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(r)) {
          if (R = null, Z = null, Y.style.left = n.clientX + 20 + "px", Y.style.top = n.clientY - 28 + "px", Y.style.display = "block", !V) {
            Y.value = `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}`;
            const B = document.activeElement;
            !(B && (B.tagName === "INPUT" || B.tagName === "TEXTAREA") && B !== Y) && document.activeElement !== Y && Y.focus({ preventScroll: true });
            try {
              Y.select();
            } catch {
            }
          }
        } else D();
      }
      v();
    } else Ln(), oe.style.display = "none", yt.visible = false, de.visible = false, ut.visible = false, D(), v();
  }), K.derive(() => {
    if (!e.gridTarget) return;
    fa(l, { position: new S(...e.gridTarget.val.position), quaternion: new ho().setFromEuler(new kn(...e.gridTarget.val.rotation)) }, v), ee.position.set(...e.gridTarget.val.position), ee.quaternion.setFromEuler(new kn(...e.gridTarget.val.rotation)), ee.updateMatrixWorld();
    const n = new S(0, 0, 1).applyEuler(new kn(...e.gridTarget.val.rotation));
    E = !(Math.abs(n.x) > 0.999 || Math.abs(n.y) > 0.999 || Math.abs(n.z) > 0.999);
  }), K.derive(() => {
    J.geometry.setAttribute("position", new gt(e.points.val.flat(), 3)), J.geometry.computeBoundingSphere();
  }), K.derive(() => {
    const n = 0.05 * m * 0.5 * d.val;
    C.params.Points.threshold = 0.4 * n;
  }), K.derive(() => {
    var _a2;
    const n = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], t = [];
    for (const i of a) {
      const [r, f, y] = n[i];
      t.push(r, f, y);
    }
    const s = new ke();
    s.setAttribute("position", new gt(t, 3)), ye.geometry.dispose(), ye.geometry = s;
  });
  let jn = false, tn = 0;
  x.addEventListener("pointerdown", () => {
    jn = true;
  }), x.addEventListener("pointerup", () => {
    jn = false;
  }), x.addEventListener("pointermove", () => {
    jn && tn++;
  });
  const Et = document.createElement("div");
  Et.id = "hk-window-select", Et.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Et);
  let Yt = null, vn = false, Lt = null;
  const eo = (n, o, a, t, s) => {
    s ? (Et.style.borderColor = "#34d399", Et.style.borderStyle = "dashed", Et.style.background = "rgba(52, 211, 153, 0.10)") : (Et.style.borderColor = "#22d3ee", Et.style.borderStyle = "solid", Et.style.background = "rgba(34, 211, 238, 0.10)"), Et.style.left = Math.min(n, a) + "px", Et.style.top = Math.min(o, t) + "px", Et.style.width = Math.abs(a - n) + "px", Et.style.height = Math.abs(t - o) + "px", Et.style.display = "block";
  }, Po = (n, o, a, t, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(n, a), r = Math.max(n, a), f = Math.min(o, t), y = Math.max(o, t), g = a < n, b = x.getBoundingClientRect(), u = h();
    u.updateMatrixWorld();
    const M = (W) => {
      const Q = new S(W[0], W[1], W[2]);
      return Q.project(u), { x: b.left + (Q.x * 0.5 + 0.5) * b.width, y: b.top + (-Q.y * 0.5 + 0.5) * b.height };
    }, B = (W) => W.x >= i && W.x <= r && W.y >= f && W.y <= y, te = (W, Q) => !(W.x < i && Q.x < i || W.x > r && Q.x > r || W.y < f && Q.y < f || W.y > y && Q.y > y);
    s || Pe.clear();
    let k = 0;
    const z = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let W = 0; W < z.length; W++) {
      const Q = z[W];
      Q && B(M(Q)) && (Pe.add(`pt:${W}`), k++);
    }
    const w = (W, Q) => g ? B(W) || B(Q) || te(W, Q) : B(W) && B(Q), A = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], X = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let W = 0; W < A.length; W++) {
      const Q = A[W];
      if (X.includes(W)) {
        let Ce;
        if (!g) Ce = Q.every((we) => {
          const Ge = z[we];
          return !!Ge && B(M(Ge));
        });
        else {
          Ce = false;
          for (let we = 0; we < Q.length - 1; we++) {
            const Ge = z[Q[we]], qe = z[Q[we + 1]];
            if (!(!Ge || !qe) && w(M(Ge), M(qe))) {
              Ce = true;
              break;
            }
          }
        }
        Ce && (Pe.add(`poly:${W}`), k++);
      } else for (let Ce = 0; Ce < Q.length - 1; Ce++) {
        const we = z[Q[Ce]], Ge = z[Q[Ce + 1]];
        !we || !Ge || w(M(we), M(Ge)) && (Pe.add(`seg:${W}:${Ce}`), k++);
      }
    }
    const pe = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let W = 0; W < pe.length; W++) {
      const Q = pe[W];
      if (!Q || Q.length !== 6) continue;
      const Ee = M([Q[0], Q[1], Q[2]]), Ce = M([Q[3], Q[4], Q[5]]);
      w(Ee, Ce) && (Pe.add(`aux:${W}`), k++);
    }
    vt(), ne(`${g ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${k} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Pe.size})`), Et.style.display = "none";
  }, Vn = () => {
    Lt && (Lt = null, Et.style.display = "none", ne("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Vn, window.addEventListener("keydown", (n) => {
    n.key === "Escape" && Lt && Vn();
  });
  const Co = () => {
    var _a2, _b, _c, _d;
    if (Pe.size === 0) return false;
    const n = [...Pe], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], r = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
    for (const te of n) {
      const [k, ...z] = te.split(":");
      if (k === "pt") r.add(+z[0]);
      else if (k === "poly") f.add(+z[0]);
      else if (k === "seg") {
        const w = +z[0], A = +z[1];
        y.has(w) || y.set(w, /* @__PURE__ */ new Set()), y.get(w).add(A);
      } else k === "aux" && g.add(+z[0]);
    }
    let b = 0, u = [], M = [];
    const B = /* @__PURE__ */ new Map();
    for (let te = 0; te < a.length; te++) {
      if (f.has(te)) {
        b++;
        continue;
      }
      B.set(te, u.length);
      const k = y.get(te);
      if (k && k.size > 0) {
        let z = [];
        for (let w = 0; w < a[te].length; w++) z.push(a[te][w]), w < a[te].length - 1 && k.has(w) && (z.length >= 2 && u.push(z), z = [], b++);
        (z.length >= 2 || z.length === 1) && u.push(z);
      } else u.push([...a[te]]);
    }
    if (r.size > 0) {
      const te = [], k = /* @__PURE__ */ new Map();
      for (let w = 0; w < o.length; w++) {
        if (r.has(w)) {
          b++;
          continue;
        }
        k.set(w, te.length), te.push([...o[w]]);
      }
      const z = [];
      for (const w of u) {
        let A = [];
        for (const X of w) {
          const q = k.get(X);
          q === void 0 ? (A.length >= 2 && z.push(A), A = []) : A.push(q);
        }
        A.length >= 2 && z.push(A);
      }
      u = z, e.points.val = te;
    }
    for (const te of t) {
      const k = B.get(te);
      k !== void 0 && k < u.length && M.push(k);
    }
    if (e.polylines && (e.polylines.val = u), e.areas && (e.areas.val = M), g.size > 0 && s) {
      const te = i.filter((k, z) => !g.has(z));
      "val" in s ? s.val = te : window.__hekatanDrawingAuxLines = te, b += g.size;
    }
    Pe.clear(), vt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ne(`\u{1F5D1} ${b} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Co, window.addEventListener("keydown", (n) => {
    if (n.key !== "Delete" && n.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || Pe.size !== 0 && (n.preventDefault(), Co());
  });
  const Vt = document.createElement("div");
  Vt.id = "hk-properties-pane";
  const zo = "hk-props-pane-pos";
  let Mn = null;
  try {
    const n = localStorage.getItem(zo);
    n && (Mn = JSON.parse(n));
  } catch {
  }
  Vt.style.cssText = ["position:fixed", Mn ? `left:${Mn.left}px` : "left:14px", Mn ? `top:${Mn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Vt);
  const fs = () => {
    const n = Vt.querySelector(".tp-rotv_b");
    if (!n || n.__hkDragWired) return;
    n.__hkDragWired = true, n.style.cursor = "move", n.style.userSelect = "none";
    let o = false, a = 0, t = 0, s = 0, i = 0;
    n.addEventListener("mousedown", (r) => {
      o = true, a = r.clientX, t = r.clientY;
      const f = Vt.getBoundingClientRect();
      s = f.left, i = f.top, Vt.style.transform = "none", Vt.style.left = `${s}px`, Vt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const f = r.clientX - a, y = r.clientY - t, g = Math.max(0, Math.min(window.innerWidth - 80, s + f)), b = Math.max(0, Math.min(window.innerHeight - 40, i + y));
      Vt.style.left = `${g}px`, Vt.style.top = `${b}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(zo, JSON.stringify({ left: parseFloat(Vt.style.left), top: parseFloat(Vt.style.top) }));
        } catch {
        }
      }
    });
  }, O = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Ct = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let st = null;
  const xt = (n, o, a, t) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: n, ids: o, prop: a, value: t } }));
  }, hs = () => {
    if (st && (st.dispose(), st = null), Pe.size === 0) {
      Vt.style.display = "none";
      return;
    }
    const n = [...Pe], o = n.filter((u) => u.startsWith("pt:")), a = n.filter((u) => u.startsWith("seg:")), t = n.filter((u) => u.startsWith("poly:")), s = n.filter((u) => u.startsWith("aux:")), i = o.length > 0, r = a.length > 0, f = t.length > 0, y = !i && !r && !f, g = [];
    o.length && g.push(`\u{1F535} ${o.length} nodo(s)`), a.length && g.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && g.push(`\u25AD ${t.length} \xE1rea(s)`), s.length && g.push(`\u250A ${s.length} aux`);
    const b = `\u{1F3AF} ${Pe.size} item(s) \u2014 ${g.join(", ")}`;
    st = new ss({ container: Vt, title: b });
    {
      const u = st.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      u.addBinding(Ct, "dx", { label: "\u0394x (m)", step: 0.1 }), u.addBinding(Ct, "dy", { label: "\u0394y (m)", step: 0.1 }), u.addBinding(Ct, "dz", { label: "\u0394z (m)", step: 0.1 }), u.addBinding(Ct, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), u.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const B = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Ct.dx, Ct.dy, Ct.dz, Ct.copias);
        ne(B ? `\u29C9 Replicado \xD7${B} (\u0394 ${Ct.dx},${Ct.dy},${Ct.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), u.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const B = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Ct.dx, Ct.dy, Ct.dz, 1);
        ne(B ? `\u2192 Copia desplazada \u0394 ${Ct.dx},${Ct.dy},${Ct.dz} m` : "\u26A0 Nada seleccionado");
      });
      const M = u.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      M.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), M.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ne(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const u = st.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      u.addBinding(O, "Ux"), u.addBinding(O, "Uy"), u.addBinding(O, "Uz"), u.addBinding(O, "Rx"), u.addBinding(O, "Ry"), u.addBinding(O, "Rz");
      const M = st.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      M.addBinding(O, "Kx", { label: "Kx", min: 0, step: 100 }), M.addBinding(O, "Ky", { label: "Ky", min: 0, step: 100 }), M.addBinding(O, "Kz", { label: "Kz", min: 0, step: 100 }), M.addBinding(O, "Krx", { label: "Krx", min: 0, step: 1e3 }), M.addBinding(O, "Kry", { label: "Kry", min: 0, step: 1e3 }), M.addBinding(O, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const B = st.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      B.addBinding(O, "Fx", { step: 0.1 }), B.addBinding(O, "Fy", { step: 0.1 }), B.addBinding(O, "Fz", { step: 0.1 }), B.addBinding(O, "Mx", { step: 0.1 }), B.addBinding(O, "My", { step: 0.1 }), B.addBinding(O, "Mz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(O, "mass", { label: "m", min: 0, step: 1 }), st.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(O, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), st.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let z = 0;
        const w = [O.Ux, O.Uy, O.Uz, O.Rx, O.Ry, O.Rz];
        w.some((q) => q) && (xt("nodes", o, "supports", w), z++);
        const A = [O.Fx, O.Fy, O.Fz, O.Mx, O.My, O.Mz];
        A.some((q) => q !== 0) && (xt("nodes", o, "loads", A), z++);
        const X = [O.Kx, O.Ky, O.Kz, O.Krx, O.Kry, O.Krz];
        if (X.some((q) => q !== 0) && (xt("nodes", o, "springs", X), z++), O.mass !== 0 && (xt("nodes", o, "mass", O.mass), z++), O.diaphragm !== "Ninguno" && (xt("nodes", o, "diaphragm", O.diaphragm), z++), z === 0) {
          ne("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let q = document.getElementById("hk-prop-toast");
          q || (q = document.createElement("div"), q.id = "hk-prop-toast", q.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(q)), q.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", q.style.background = "rgba(217,119,6,0.97)", q.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            q && (q.style.opacity = "0");
          }, 3200);
        } else ne(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const u = st.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      u.addBinding(O, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), u.addBinding(O, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const M = st.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      M.addBinding(O, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), M.addBinding(O, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), M.addBinding(O, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), M.addBinding(O, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), st.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(O, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), st.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(O, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const k = st.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      k.addBinding(O, "relMxI", { label: "Mx I" }), k.addBinding(O, "relMyI", { label: "My I" }), k.addBinding(O, "relMzI", { label: "Mz I" });
      const z = st.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      z.addBinding(O, "relMxJ", { label: "Mx J" }), z.addBinding(O, "relMyJ", { label: "My J" }), z.addBinding(O, "relMzJ", { label: "Mz J" }), st.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(O, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const A = st.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      A.addBinding(O, "LKx", { label: "LKx", min: 0, step: 100 }), A.addBinding(O, "LKy", { label: "LKy", min: 0, step: 100 }), A.addBinding(O, "LKz", { label: "LKz", min: 0, step: 100 });
      const X = st.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      X.addBinding(O, "qx", { step: 0.1 }), X.addBinding(O, "qy", { step: 0.1 }), X.addBinding(O, "qz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(O, "massPerM", { label: "m/L", min: 0, step: 1 }), st.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        xt("segs", a, "section", O.section), xt("segs", a, "material", O.material_frame);
        const pe = { A: O.A_mod, Iz: O.Iz_mod, Iy: O.Iy_mod, J: O.J_mod };
        (pe.A !== 1 || pe.Iz !== 1 || pe.Iy !== 1 || pe.J !== 1) && xt("segs", a, "modifiers", pe), O.insertionPoint !== "10 \u2014 Centroid" && xt("segs", a, "insertionPoint", O.insertionPoint), O.beta !== 0 && xt("segs", a, "beta", O.beta);
        const W = [O.relMxI, O.relMyI, O.relMzI], Q = [O.relMxJ, O.relMyJ, O.relMzJ];
        (W.some((we) => we) || Q.some((we) => we)) && xt("segs", a, "releases", { i: W, j: Q }), O.hinges !== "None" && xt("segs", a, "hinges", O.hinges);
        const Ee = [O.LKx, O.LKy, O.LKz];
        Ee.some((we) => we !== 0) && xt("segs", a, "lineSprings", Ee);
        const Ce = [O.qx, O.qy, O.qz];
        Ce.some((we) => we !== 0) && xt("segs", a, "distLoad", Ce), O.massPerM !== 0 && xt("segs", a, "massPerM", O.massPerM), ne(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (f) {
      const u = st.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      u.addBinding(O, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), u.addBinding(O, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), u.addBinding(O, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), st.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(O, "surfLoad", { label: "q", step: 0.1 }), st.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        xt("areas", t, "shellType", O.shellType), xt("areas", t, "thickness", O.thickness), xt("areas", t, "material", O.material_shell), O.surfLoad !== 0 && xt("areas", t, "surfLoad", O.surfLoad), ne(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (y) {
      const u = st.addFolder({ title: "\u2139 Selecci\xF3n" }), M = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      u.addBinding(M, "msg", { readonly: true, label: "" });
    }
    st.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Pe.clear(), vt();
    }), Vt.style.display = "block", fs();
  };
  window.__hekatanRefreshPropsPane = hs;
  let hn = null, $n = false;
  x.addEventListener("pointerdown", (n) => {
    n.button === 2 && (hn = { x: n.clientX, y: n.clientY }, $n = false);
  }), x.addEventListener("pointermove", (n) => {
    if (hn && n.buttons & 2 && !$n) {
      const o = n.clientX - hn.x, a = n.clientY - hn.y;
      Math.hypot(o, a) > 8 && ($n = true);
    }
  }), x.addEventListener("pointerup", (n) => {
    var _a2, _b, _c;
    if (n.button === 2) {
      const o = hn !== null && !$n;
      hn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (Lt ? Vn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Pe.size > 0 && (Pe.clear(), vt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const t = window.__hekatanCadState, s = (_b = (_a2 = t == null ? void 0 : t.get) == null ? void 0 : _a2.call(t)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = t == null ? void 0 : t.setTool) == null ? void 0 : _c.call(t, "select"), ne(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ne("\u238B Cancelado (click derecho)");
      }
    }
  }), x.addEventListener("contextmenu", (n) => {
    n.preventDefault(), n.stopPropagation();
  }, { capture: true }), x.addEventListener("pointerdown", (n) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || n.button === 0 && (window.__hekatanBloquearVentana || n.pointerType !== "touch" && (Yt = null, vn = false));
  }), x.addEventListener("pointermove", (n) => {
    if (Lt && n.buttons === 0) {
      const i = n.clientX < Lt.x;
      eo(Lt.x, Lt.y, n.clientX, n.clientY, i);
      return;
    }
    if (!Yt) return;
    const o = n.clientX - Yt.x, a = n.clientY - Yt.y, t = Math.hypot(o, a);
    if (!vn && t < 8) return;
    vn = true;
    const s = n.clientX < Yt.x;
    eo(Yt.x, Yt.y, n.clientX, n.clientY, s);
  }), x.addEventListener("pointerup", (n) => {
    if (!Yt) return;
    if (!vn) {
      Yt = null;
      return;
    }
    const o = n.ctrlKey || n.metaKey || n.shiftKey;
    Po(Yt.x, Yt.y, n.clientX, n.clientY, o), Yt = null, vn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true };
  const Dt = new nt();
  Dt.visible = false, Dt.frustumCulled = false, p.add(Dt);
  const ms = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496 }, Fo = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    for (; Dt.children.length; ) {
      const r = Dt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = ms[n] ?? 16777215, i = new ke().setFromPoints([new S(-1, -1, 0), new S(1, -1, 0), new S(1, -1, 0), new S(1, 1, 0), new S(1, 1, 0), new S(-1, 1, 0), new S(-1, 1, 0), new S(-1, -1, 0)]);
    Dt.add(new Kt(i, new pt({ color: s, linewidth: 2 }))), Dt.position.set(o, a, t), Dt.visible = true, no();
  };
  let to = 4;
  const no = () => {
    Dt.visible && Dt.scale.setScalar(to * Tn(Dt.position));
  };
  window.__hekatanOsnapMarkerRef = Dt, window.__hekatanUpdateOsnapScale = no, window.__hekatanOsnapPx = (n) => (typeof n == "number" && n > 0 && (to = n, no(), v()), to);
  const Ln = () => {
    Dt.visible = false;
  }, ws = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    const s = window.__hekatanOsnap, i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let f = null;
    const y = { end: 0, node: 0, int: 1, mid: 2, cen: 3, per: 4, nea: 5 }, g = (k, z, w, A) => {
      const X = Math.hypot(z - n, w - o, A - a);
      if (X > t) return;
      const q = y[k] ?? 9;
      (!f || q < f.r || q === f.r && X < f.d) && (f = { type: k, x: z, y: w, z: A, d: X, r: q });
    };
    (s.node || s.end) && i.forEach((k) => {
      s.node && g("node", k[0], k[1], k[2]);
    });
    for (const k of r) if (!(k.length < 2)) for (let z = 0; z < k.length - 1; z++) {
      const w = i[k[z]], A = i[k[z + 1]];
      if (!(!w || !A) && (s.end && (g("end", w[0], w[1], w[2]), g("end", A[0], A[1], A[2])), s.mid && g("mid", (w[0] + A[0]) / 2, (w[1] + A[1]) / 2, (w[2] + A[2]) / 2), s.nea || s.per)) {
        const X = A[0] - w[0], q = A[1] - w[1], pe = A[2] - w[2], W = X * X + q * q + pe * pe;
        if (W < 1e-12) continue;
        const Q = Math.max(0, Math.min(1, ((n - w[0]) * X + (o - w[1]) * q + (a - w[2]) * pe) / W)), Ee = w[0] + Q * X, Ce = w[1] + Q * q, we = w[2] + Q * pe;
        s.nea && g("nea", Ee, Ce, we), s.per && g("per", Ee, Ce, we);
      }
    }
    if (s.cen) {
      const k = En(), z = [...dn];
      for (const w of k) z.some((A) => Math.hypot(A.c[0] - w.c[0], A.c[1] - w.c[1], A.c[2] - w.c[2]) < 1e-6 && Math.abs(A.r - w.r) < 1e-6) || z.push(w);
      for (const w of z) {
        if (!i.some((q) => Math.abs(Math.hypot(q[0] - w.c[0], q[1] - w.c[1], q[2] - w.c[2]) - w.r) < 1e-6)) continue;
        const X = Math.hypot(n - w.c[0], o - w.c[1], a - w.c[2]);
        if (X < t || Math.abs(X - w.r) < t) {
          const q = Math.min(X, t * 0.5), pe = 3;
          (!f || pe < f.r || pe === f.r && q < f.d) && (f = { type: "cen", x: w.c[0], y: w.c[1], z: w.c[2], d: q, r: pe });
        }
      }
    }
    if (s.int) {
      const k = [];
      for (const z of r) for (let w = 0; w < z.length - 1; w++) {
        const A = i[z[w]], X = i[z[w + 1]];
        if (!A || !X) continue;
        const q = X[0] - A[0], pe = X[1] - A[1], W = X[2] - A[2], Q = q * q + pe * pe + W * W;
        if (Q < 1e-12) continue;
        const Ee = Math.max(0, Math.min(1, ((n - A[0]) * q + (o - A[1]) * pe + (a - A[2]) * W) / Q));
        Math.hypot(A[0] + Ee * q - n, A[1] + Ee * pe - o, A[2] + Ee * W - a) < 3 * t && k.push([A, X]);
      }
      for (let z = 0; z < k.length; z++) for (let w = z + 1; w < k.length; w++) {
        const [A, X] = k[z], [q, pe] = k[w], W = [X[0] - A[0], X[1] - A[1], X[2] - A[2]], Q = [pe[0] - q[0], pe[1] - q[1], pe[2] - q[2]], Ee = [A[0] - q[0], A[1] - q[1], A[2] - q[2]], Ce = W[0] * W[0] + W[1] * W[1] + W[2] * W[2], we = W[0] * Q[0] + W[1] * Q[1] + W[2] * Q[2], Ge = Q[0] * Q[0] + Q[1] * Q[1] + Q[2] * Q[2], qe = W[0] * Ee[0] + W[1] * Ee[1] + W[2] * Ee[2], at = Q[0] * Ee[0] + Q[1] * Ee[1] + Q[2] * Ee[2], it = Ce * Ge - we * we;
        if (it < 1e-12) continue;
        const bt = (we * at - Ge * qe) / it, ct = (Ce * at - we * qe) / it;
        if (bt < -1e-6 || bt > 1 + 1e-6 || ct < -1e-6 || ct > 1 + 1e-6) continue;
        const ge = [A[0] + bt * W[0], A[1] + bt * W[1], A[2] + bt * W[2]], et = [q[0] + ct * Q[0], q[1] + ct * Q[1], q[2] + ct * Q[2]];
        if (Math.hypot(ge[0] - et[0], ge[1] - et[1], ge[2] - et[2]) > 1e-4) continue;
        [A, X, q, pe].some((xe) => Math.hypot(xe[0] - ge[0], xe[1] - ge[1], xe[2] - ge[2]) < 1e-6) || g("int", ge[0], ge[1], ge[2]);
      }
    }
    const b = window.__hekatanAxisGrids ?? [], u = window.__hekatanLevels ?? [], M = b.filter((k) => k && k.start && k.end).map((k) => [k.start, k.end]);
    for (const [k, z] of M) {
      s.end && (g("end", k[0], k[1], k[2]), g("end", z[0], z[1], z[2]));
      const w = z[0] - k[0], A = z[1] - k[1], X = z[2] - k[2], q = w * w + A * A + X * X;
      if (q < 1e-12) continue;
      const pe = Math.max(0, Math.min(1, ((n - k[0]) * w + (o - k[1]) * A + (a - k[2]) * X) / q));
      if (s.nea && g("nea", k[0] + pe * w, k[1] + pe * A, k[2] + pe * X), s.int && Math.abs(X) > 1e-9) for (const W of u) {
        const Q = (W.z - k[2]) / X;
        Q < -1e-6 || Q > 1 + 1e-6 || g("int", k[0] + Q * w, k[1] + Q * A, W.z);
      }
    }
    if (s.int || s.node) for (let k = 0; k < M.length; k++) for (let z = k + 1; z < M.length; z++) {
      const [w, A] = M[k], [X, q] = M[z], pe = A[0] - w[0], W = A[1] - w[1], Q = q[0] - X[0], Ee = q[1] - X[1], Ce = pe * Ee - W * Q;
      if (Math.abs(Ce) < 1e-12) continue;
      const we = w[0] - X[0], Ge = w[1] - X[1], qe = (Q * Ge - Ee * we) / Ce, at = (pe * Ge - W * we) / Ce;
      if (qe < -1e-6 || qe > 1 + 1e-6 || at < -1e-6 || at > 1 + 1e-6) continue;
      const it = (_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workZ;
      g("int", w[0] + qe * pe, w[1] + qe * W, typeof it == "number" ? it : a);
    }
    const B = window.__hekatanDrawingAuxLines, te = (B == null ? void 0 : B.rawVal) ?? (B == null ? void 0 : B.val) ?? B ?? [];
    for (const k of te) {
      if (k.length !== 6) continue;
      const z = [k[0], k[1], k[2]], w = [k[3], k[4], k[5]];
      if (s.end && (g("end", z[0], z[1], z[2]), g("end", w[0], w[1], w[2])), s.mid && g("mid", (z[0] + w[0]) / 2, (z[1] + w[1]) / 2, (z[2] + w[2]) / 2), s.nea || s.per) {
        const A = w[0] - z[0], X = w[1] - z[1], q = w[2] - z[2], pe = A * A + X * X + q * q;
        if (pe < 1e-12) continue;
        const W = Math.max(0, Math.min(1, ((n - z[0]) * A + (o - z[1]) * X + (a - z[2]) * q) / pe)), Q = z[0] + W * A, Ee = z[1] + W * X, Ce = z[2] + W * q;
        s.nea && g("nea", Q, Ee, Ce), s.per && g("per", Q, Ee, Ce);
      }
    }
    return f ? { type: f.type, x: f.x, y: f.y, z: f.z } : null;
  };
  window.__hekatanOsnapCompute = ws, window.__hekatanOsnapShow = Fo, window.__hekatanOsnapHide = Ln;
  let Te = [], ht = 0, nn = 0, Mt = null;
  const bn = document.createElement("div");
  bn.id = "hk-cad-status", bn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", bn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(bn);
  const ys = () => {
    var _a2, _b, _c;
    const n = [];
    window.__hekatanOrthoMode && n.push("\u22A5 ORTO ON (F8)"), Le && n.push(`\u{1F512} LOCK ${Le.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && n.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && n.push("\u25A6 Planos XY/XZ/YZ"), n.length > 0 ? `   |   ${n.join("  \xB7  ")}` : "";
  }, ne = (n) => {
    var _a2;
    const o = n + ys();
    bn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, n);
    } catch {
    }
  }, xs = "Comando:", gs = () => {
    var _a2, _b, _c, _d;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], t = Te.length, s = (i, r = []) => ({ txt: i, ops: r });
    switch (n) {
      case "line":
        return a.length >= 2 ? s("L\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : a.length === 1 ? s("L\xCDNEA Precise punto siguiente o", ["desHacer"]) : s("L\xCDNEA Precise primer punto:");
      case "polyline":
        return a.length >= 2 ? s("POLIL\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : a.length === 1 ? s("POLIL\xCDNEA Precise punto siguiente o", ["desHacer"]) : s("POLIL\xCDNEA Precise punto inicial:");
      case "node":
        return s("NUDO Precise punto:");
      case "area":
        return s(`LOSA Precise v\xE9rtice ${Math.min(a.length + 1, 4)} de 4 (en orden, antihorario):`);
      case "rectarea":
        return s(t ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea":
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${fe.length + 1} (Enter o clic derecho cierra y malla):`);
      case "rect":
        return s(t ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(t ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(t === 0 ? "ARCO Precise punto inicial:" : t === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${ht > 0 ? ht : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(t ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${ht > 0 ? ht : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${t + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(Mt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(Mt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(Mt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${nn > 0 ? ` (distancia ${nn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
      case "axis":
        return s("EJE Precise el primer punto del eje:");
      case "aux":
        return s(t ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
      case "auxp":
        return s("PUNTO AUXILIAR Precise punto:");
      case "chaflan":
        return s(t ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
      case "delete":
        return s("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move":
        return Pe.size ? s(t ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Pe.size ? s(t ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Pe.size ? s(`SELECCI\xD3N ${Pe.size} objeto${Pe.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(xs);
    }
  }, It = () => {
    var _a2;
    try {
      const n = gs();
      (_a2 = window.__hekatanCadPrompt) == null ? void 0 : _a2.call(window, n.txt, n.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = It, window.__hekatanRefreshStatus = () => {
    const n = window.__hekatanCadStatusText ?? "", o = n.split("   |   ")[0] ?? n;
    ne(o);
  }, window.__hekatanCadResetPending = () => {
    Te = [], fe = [], G.visible = false, oo(), Mt = null, v(), ne("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), It();
  };
  function oo() {
    if (!e.polylines) return;
    const n = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...n, []];
  }
  window.__hekatanCerrarPolilinea = oo;
  const mn = [], In = [], so = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, Ao = (n) => {
    var _a2;
    e.points.val = n.p, e.polylines && (e.polylines.val = n.l), e.areas && (e.areas.val = n.a), Te = [], de.visible = false, ut.visible = false, D();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    v(), It();
  }, Rt = () => {
    mn.push(so()), mn.length > 100 && mn.shift(), In.length = 0;
  }, Rn = () => {
    const n = mn.pop();
    if (!n) {
      ne("\u21B6 Nada para deshacer");
      return;
    }
    In.push(so()), Ao(n), ne(`\u21B6 Deshacer \u2014 quedan ${mn.length}`);
  }, Eo = () => {
    const n = In.pop();
    if (!n) {
      ne("\u21B7 Nada para rehacer");
      return;
    }
    mn.push(so()), Ao(n), ne(`\u21B7 Rehacer \u2014 quedan ${In.length}`);
  };
  window.__hekatanPushUndo = Rt, window.__hekatanUndo = Rn, window.__hekatanRedo = Eo, document.addEventListener("keydown", (n) => {
    var _a2;
    const o = n.key.toLowerCase();
    if (!((n.ctrlKey || n.metaKey) && (o === "y" || o === "z" && n.shiftKey))) return;
    const t = n.target;
    t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA") && t.type !== "checkbox" && t.type !== "range" && (((_a2 = t.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (n.preventDefault(), n.stopPropagation(), Eo());
  }, { capture: true }), window.__hekatanCadOption = (n) => {
    var _a2, _b, _c, _d, _e2;
    const o = n.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const t = e.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Rn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ne("Cerrar necesita al menos tres puntos."), true;
      Rt(), e.polylines.val = [...t.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return ao(), ne(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Rn(), true;
      Rt();
      const i = s[s.length - 1], r = s.slice(0, -1), f = t.some((b, u) => u !== t.length - 1 && b.includes(i)) || r.includes(i);
      let y = e.points.rawVal, g = [...t.slice(0, -1), r];
      if (!f && i === y.length - 1 && (y = y.slice(0, -1), e.points.val = y), e.polylines.val = g, r.length) {
        const b = y[r[r.length - 1]];
        b && (R = [b[0], b[1], b[2]]);
      } else R = null, de.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return v(), ne(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), It(), true;
    }
    return false;
  }, document.addEventListener("keydown", (n) => {
    var _a2;
    if ((n.ctrlKey || n.metaKey) && n.key.toLowerCase() === "z" && !n.shiftKey) {
      const o = n.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      n.preventDefault(), n.stopPropagation(), Rn();
    }
  }, { capture: true });
  const ao = () => {
    Te = [], Mt = null, oo(), Le = null, Gt(), de.visible = false, ut.visible = false, D(), ne("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), v(), It();
  };
  window.__hekatanFinalizeDraw = ao;
  const To = () => {
    var _a2, _b, _c;
    Te = [], fe = [], G.visible = false;
    let n = false;
    Pe.size && (Pe.clear(), vt(), n = true), ao();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ne(n ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), v(), It();
  };
  window.__hekatanEscapeCancel = To;
  const Vo = () => {
    var _a2;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Pe.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (n[+a.slice(5)] || []).forEach((t) => o.add(t));
      else if (a.startsWith("seg:")) {
        const t = a.split(":"), s = n[+t[1]] || [], i = s[+t[2]], r = s[+t[2] + 1];
        i != null && o.add(i), r != null && o.add(r);
      }
    }), o;
  }, $o = (n, o, a) => {
    var _a2;
    const t = Vo();
    if (!t.size) return 0;
    Rt();
    const s = e.points.rawVal.map((i, r) => t.has(r) ? [i[0] + n, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return vt(), v(), t.size;
  };
  window.__hekatanMoveSelection = $o;
  const Lo = (n, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!Pe.size) {
      ne(`${n === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), It();
      return;
    }
    if (Te.push(o), Te.length === 1) {
      R = o, ne(`${n === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), It();
      return;
    }
    const [a, t] = Te, s = [t[0] - a[0], t[1] - a[1], t[2] - a[2]];
    Te = [], de.visible = false;
    let i = 0;
    n === "move" ? i = $o(s[0], s[1], s[2]) : (i = Vo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ne(`\u2713 ${n === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), n === "move" && (Pe.clear(), vt()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), It();
  };
  window.__hekatanPasoMoverCopiar = Lo;
  const vs = () => {
    var _a2, _b, _c;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return n === "xz" ? [0, 1, 0] : n === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (n, o) => Math.hypot(n[0] - o[0], n[1] - o[1], n[2] - o[2]), io = (n, o, a, t, s, i) => {
    const r = [o[0] - n[0], o[1] - n[1], o[2] - n[2]], f = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], y = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], g = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], b = r[0] * f[0] + r[1] * f[1] + r[2] * f[2], u = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], M = r[0] * y[0] + r[1] * y[1] + r[2] * y[2], B = f[0] * y[0] + f[1] * y[1] + f[2] * y[2], te = g * u - b * b;
    if (te < 1e-12) return null;
    const k = (b * B - u * M) / te, z = (g * B - b * M) / te;
    if (!s && (k < -1e-6 || k > 1 + 1e-6) || !i && (z < -1e-6 || z > 1 + 1e-6)) return null;
    const w = [n[0] + k * r[0], n[1] + k * r[1], n[2] + k * r[2]], A = [a[0] + z * f[0], a[1] + z * f[1], a[2] + z * f[2]];
    return jt(w, A) > 1e-4 ? null : w;
  }, Ms = (n) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((t) => t === n).length, 0);
  }, bs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, _s = (n, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, t = e.points.rawVal, s = bs[n];
    if (!Mt) {
      if (be < 0) {
        ne(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Mt = { poly: be, seg: Math.max(0, We) }, ne(n === "offset" ? `DESFASE l\xEDnea #${Mt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${nn > 0 ? ` (${nn} m)` : ""}.` : n === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), It();
      return;
    }
    if (n === "offset") {
      const k = Mt.poly, z = a[k];
      if (!z || z.length < 2) {
        Mt = null, ne("DESFASE: esa polil\xEDnea no tiene tramos."), It();
        return;
      }
      const w = z.length > 2 && z[0] === z[z.length - 1], A = vs(), X = [];
      for (let ge = 0; ge < z.length - 1; ge++) {
        const et = t[z[ge]], Qe = t[z[ge + 1]], xe = [Qe[0] - et[0], Qe[1] - et[1], Qe[2] - et[2]], Re = Math.hypot(xe[0], xe[1], xe[2]) || 1, tt = xe[0] / Re, Tt = xe[1] / Re, Ut = xe[2] / Re, Xt = [A[1] * Ut - A[2] * Tt, A[2] * tt - A[0] * Ut, A[0] * Tt - A[1] * tt], Wt = Math.hypot(Xt[0], Xt[1], Xt[2]) || 1;
        X.push({ a: et, b: Qe, n: [Xt[0] / Wt, Xt[1] / Wt, Xt[2] / Wt] });
      }
      let q = 0, pe = 1 / 0;
      X.forEach((ge, et) => {
        const Qe = Ot(o[0], o[1], o[2], ge.a[0], ge.a[1], ge.a[2], ge.b[0], ge.b[1], ge.b[2]);
        Qe < pe && (pe = Qe, q = et);
      });
      const W = X[q], Q = Math.sign((o[0] - W.a[0]) * W.n[0] + (o[1] - W.a[1]) * W.n[1] + (o[2] - W.a[2]) * W.n[2]) || 1, Ee = nn > 0 ? nn : pe;
      if (Ee < 1e-6) {
        ne("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const Ce = X.map((ge) => ({ a: [ge.a[0] + Q * Ee * ge.n[0], ge.a[1] + Q * Ee * ge.n[1], ge.a[2] + Q * Ee * ge.n[2]], b: [ge.b[0] + Q * Ee * ge.n[0], ge.b[1] + Q * Ee * ge.n[1], ge.b[2] + Q * Ee * ge.n[2]] })), we = Ce.length, Ge = (ge) => {
        const et = Ce[(ge - 1 + we) % we], Qe = Ce[ge % we];
        return io(et.a, et.b, Qe.a, Qe.b, true, true) ?? Qe.a;
      }, qe = [], at = w ? we : we + 1;
      for (let ge = 0; ge < at; ge++) !w && ge === 0 ? qe.push(Ce[0].a) : !w && ge === we ? qe.push(Ce[we - 1].b) : qe.push(Ge(ge));
      Rt();
      const it = t.length;
      e.points.val = [...t, ...qe];
      const bt = qe.map((ge, et) => it + et);
      w && bt.push(it);
      let ct = a.slice();
      ct.length && ct[ct.length - 1].length === 0 && (ct = ct.slice(0, -1)), e.polylines.val = [...ct, bt, []], Mt = null, ne(`\u2713 Desfase a ${Ee.toFixed(2)} m \u2014 ${we} tramo${we === 1 ? "" : "s"} nuevo${we === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      v(), It();
      return;
    }
    let i = be, r = Math.max(0, We);
    if (i < 0 || i === Mt.poly && r === Mt.seg) {
      let z = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((w, A) => {
        for (let X = 0; X < w.length - 1; X++) {
          if (A === Mt.poly && X === Mt.seg) continue;
          const q = t[w[X]], pe = t[w[X + 1]];
          if (!q || !pe) continue;
          const W = Ot(o[0], o[1], o[2], q[0], q[1], q[2], pe[0], pe[1], pe[2]);
          W < z && (z = W, i = A, r = X);
        }
      }), i < 0) {
        ne(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const f = a[Mt.poly], y = t[f[Mt.seg]], g = t[f[Mt.seg + 1]], b = a[i], u = b[r], M = b[r + 1];
    if (!y || !g || u == null || M == null) {
      ne(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const B = t[u], te = t[M];
    if (n === "trim") {
      const k = io(B, te, y, g, false, false);
      if (!k) {
        ne("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Rt();
      const z = t.length;
      e.points.val = [...t, k];
      const w = [...b.slice(0, r + 1), z, ...b.slice(r + 1)];
      e.polylines.val = a.map((X, q) => q === i ? w : X);
      const A = jt(o, B) < jt(o, te);
      Fn(i, A ? r : r + 1), ne(`\u2713 Recortado en (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const k = io(B, te, y, g, true, false);
      if (!k) {
        ne("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const w = jt(o, B) < jt(o, te) ? r : r + 1;
      if (w !== 0 && w !== b.length - 1) {
        ne("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const A = b[w];
      if (jt(k, B) + jt(k, te) < jt(B, te) + 1e-6) {
        ne("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Rt(), Ms(A) > 1) {
        const q = t.length;
        e.points.val = [...t, k];
        const pe = b.slice();
        pe[w] = q, e.polylines.val = a.map((W, Q) => Q === i ? pe : W);
      } else e.points.val = t.map((q, pe) => pe === A ? k : q);
      ne(`\u2713 Alargada hasta (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    v(), It();
  };
  window.__hekatanSelectionSize = () => Pe.size, window.__hekatanSelectLast = () => {
    var _a2;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = n.length - 1;
    for (; o >= 0 && (!n[o] || n[o].length < 2); ) o--;
    return Pe.clear(), o >= 0 && Pe.add(`poly:${o}`), vt(), ne(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Pe.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Pe.clear();
    const a = /* @__PURE__ */ new Set();
    return n.forEach((t, s) => {
      !t || t.length < 2 || (Pe.add(`poly:${s}`), t.forEach((i) => a.add(i)));
    }), o.forEach((t, s) => {
      a.has(s) || Pe.add(`pt:${s}`);
    }), vt(), ne(`SELECCI\xD3N ${Pe.size} objetos (todo el modelo) \xB7 Esc suelta`), Pe.size;
  }, window.__hekatanReplicateSelection = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1));
    const s = [...Pe], i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), y = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), b = [];
    if (s.forEach((k) => {
      if (k.startsWith("pt:")) y.add(+k.slice(3));
      else if (k.startsWith("poly:")) {
        const z = +k.slice(5);
        g.add(z), (r[z] || []).forEach((w) => y.add(w));
      } else if (k.startsWith("seg:")) {
        const z = k.split(":"), w = +z[1], A = +z[2], X = r[w] || [], q = X[A], pe = X[A + 1];
        q != null && pe != null && (b.push([q, pe]), y.add(q), y.add(pe));
      }
    }), !y.size) return 0;
    Rt();
    const u = [...i];
    let M = r.slice();
    M.length && M[M.length - 1].length === 0 && (M = M.slice(0, -1));
    const B = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], te = [...y];
    for (let k = 1; k <= t; k++) {
      const z = n * k, w = o * k, A = a * k, X = /* @__PURE__ */ new Map();
      te.forEach((q) => {
        X.set(q, u.length), u.push([i[q][0] + z, i[q][1] + w, i[q][2] + A]);
      }), g.forEach((q) => {
        const pe = r[q].map((Q) => X.has(Q) ? X.get(Q) : Q), W = M.length;
        M.push(pe), f.has(q) && B.push(W);
      }), b.forEach(([q, pe]) => {
        M.push([X.get(q), X.get(pe)]);
      });
    }
    M.push([]), e.points.val = u, e.polylines && (e.polylines.val = M), e.areas && (e.areas.val = B);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return v(), t;
  }, x.addEventListener("click", (n) => {
    var _a2, _b;
    if (tn > 5) {
      tn = 0;
      return;
    }
    tn = 0;
    const o = _(n);
    if (!o) return;
    C.setFromCamera(F, o);
    const a = ie();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(c.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), r = a[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(s * 12, 300)) {
        ne("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let t = a[0].point;
    (n.ctrlKey || n.metaKey) && (t = new S(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = s[s.length - 1] ?? [], r = e.points.rawVal ?? [];
      if (i.length > 0) {
        const f = r[i[i.length - 1]];
        if (f) {
          const y = !!window.__hekatanOrthoMode;
          let g = Le;
          if (!g && y) {
            const b = Math.abs(t.x - f[0]), u = Math.abs(t.y - f[1]), M = Math.abs(t.z - f[2]);
            g = b >= u && b >= M ? "x" : u >= M ? "y" : "z";
          }
          g === "x" ? t = new S(t.x, f[1], f[2]) : g === "y" ? t = new S(f[0], t.y, f[2]) : g === "z" && (t = new S(f[0], f[1], t.z));
        }
      }
    }
    if (Jt) t = Jt.clone(), ne(`\u{1F4D0} Eje \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else {
      const s = Qn(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s);
      if (i) t = new S(i.x, i.y, i.z), ne(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0;
        r && f > 0 && (t = new S(Math.round(t.x / f) * f, Math.round(t.y / f) * f, Math.round(t.z / f) * f));
      }
    }
    Io(t, n);
  });
  const Io = (n, o) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (ft) {
        Lt && Vn();
        const { kind: t, a: s, b: i } = ft, r = i !== void 0 ? `${t}:${s}:${i}` : `${t}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Pe.clear(), Pe.has(r) ? Pe.delete(r) : Pe.add(r), vt(), ne(`\u2713 Seleccionados ${Pe.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const t = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Lt ? (Po(Lt.x, Lt.y, s, i, t), Lt = null) : t || (Lt = { x: s, y: i }, ne("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), eo(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const t = window.__hekatanAxisDraw;
      if (!t) return;
      if (!t.pendingStart) {
        t.pendingStart = [n.x, n.y, n.z], ne(`\u{1F4CD} Eje \u2014 click 1 OK en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = t.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, t.pendingStart, [n.x, n.y, n.z], s);
      ne(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      Lo(a, [n.x, n.y, n.z]);
      return;
    }
    if (a === "delete") {
      if (Oe >= 0) {
        const t = window.__hekatanDrawingAuxLines, s = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [], i = Oe;
        if (i >= 0 && i < s.length) {
          Rt();
          const r = s.slice(0, i).concat(s.slice(i + 1));
          t && typeof t == "object" && "val" in t ? t.val = r : window.__hekatanDrawingAuxLines = r, ne(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Oe = -1, Ae.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (be >= 0) {
        const t = be, s = We;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(t)) ?? false ? (cn(t), ne(`\u{1F5D1} \xC1rea #${t + 1} (shell Q4) borrada`)) : s >= 0 ? (Fn(t, s), ne(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${t + 1} borrado`)) : (cn(t), ne(`\u{1F5D1} Polil\xEDnea #${t + 1} borrada`));
      } else ne("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Te.push([n.x, n.y, n.z]), Te.length === 1) {
        ne("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [t, s] = Te, i = Math.hypot(s[0] - t[0], s[1] - t[1], s[2] - t[2]);
      Math.abs(s[0] - t[0]);
      const r = Math.abs(s[1] - t[1]), y = Math.abs(s[2] - t[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", g = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, t[0], t[1], t[2], i, g, y), ne(`\u2713 C\xEDrculo dibujado en ${y.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${g} segmentos`), Te = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (Te.push([n.x, n.y, n.z]), Te.length === 1) {
        ne("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Te.length === 2) {
        ne("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [t, s, i] = Te, r = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, t, s, i, r), ne(`\u2713 Arco dibujado \u2014 ${r} segmentos`), Te = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Te.push([n.x, n.y, n.z]), Te.length === 1) {
        ne("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Te;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, t, s), ne(`\u2713 Rect\xE1ngulo dibujado \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Te = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Te.push([n.x, n.y, n.z]), Te.length === 1) {
        ne("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Te;
      (_n = window.__hekatanDrawRectArea) == null ? void 0 : _n.call(window, t, s), ne(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Te = [];
      return;
    }
    if (a === "polyarea") {
      fe.push([n.x, n.y, n.z]), G.geometry.setFromPoints(fe.map((t) => new S(t[0], t[1], t[2]))), G.visible = fe.length >= 1, ne(`\u25B0 \xC1rea libre \u2014 ${fe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), v();
      return;
    }
    if (a === "plane3") {
      if (Te.push([n.x, n.y, n.z]), Te.length < 3) {
        ne(`\u25E3 Plano inclinado \u2014 punto ${Te.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [t, s, i] = Te, r = (_o2 = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o2.call(window, t, s, i);
      ne(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Te = [];
      return;
    }
    if (a === "col") {
      Rt();
      const t = n.z, s = ht && ht > 0 ? ht : 3;
      e.points.val = [...e.points.rawVal, [n.x, n.y, t], [n.x, n.y, t + s]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], ht = 0, ne(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Te.push([n.x, n.y, n.z]), Te.length === 1) {
        ne("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [t, s] = Te, i = ht && ht > 0 ? ht : 3;
      Rt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [t[0], t[1], t[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [t[0], t[1], t[2] + i]];
      const f = e.polylines.rawVal;
      if (f.length - 1, e.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const y = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, y];
      }
      ne(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Te = [], ht = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Rt();
      const t = ht && ht > 0 ? ht : 3, s = n.z;
      e.points.val = [...e.points.rawVal, [n.x, n.y, s], [n.x, n.y, s + t]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], ht = 0, ne(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${t.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const t = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = an(n.x, n.y, n.z, t);
      if (!s) {
        ne("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, r = e.points.rawVal, f = i[s.polyIdx], y = r[f[s.segIdx]], g = r[f[s.segIdx + 1]];
      if (!y || !g) {
        ne("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const b = ht && ht > 0 ? ht : 3;
      Rt();
      const u = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [y[0], y[1], y[2]], [g[0], g[1], g[2]], [g[0], g[1], g[2] + b], [y[0], y[1], y[2] + b]];
      const M = e.polylines.rawVal;
      if (e.polylines.val = [...M.slice(0, -1), ...M[M.length - 1].length > 0 ? [M[M.length - 1]] : [], [u, u + 1, u + 2, u + 3, u], []], e.areas) {
        const B = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, B];
      }
      ht = 0, ne(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${b.toFixed(2)}m`);
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "auxp") {
      const t = window.__hekatanDrawingAuxPoints;
      if (t) {
        const s = t.rawVal ?? t.val ?? [];
        t.val = [...s, [n.x, n.y, n.z]];
      }
      ne(`\u2726 Punto auxiliar agregado en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Te.push([n.x, n.y, n.z]), Te.length === 1) {
        ne("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [t, s] = Te, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const b = i.rawVal ?? i.val ?? [];
        i.val = [...b, [t[0], t[1], t[2], s[0], s[1], s[2]]];
      }
      const r = s[0] - t[0], f = s[1] - t[1], y = s[2] - t[2], g = Math.sqrt(r * r + f * f + y * y);
      ne(`\u2713 L\xEDnea auxiliar creada \u2014 L=${g.toFixed(2)}m (cyan, no FEM)`), Te = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      _s(a, [n.x, n.y, n.z]);
      return;
    }
    if (a === "chaflan") {
      if (Te.push([n.x, n.y, n.z]), Te.length === 1) {
        ne("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Te, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, t, s, i, r, 6);
      const f = Math.abs(s[0] - t[0]).toFixed(1), y = Math.abs(s[1] - t[1]).toFixed(1);
      ne(`\u2713 Losa con chaflanes dibujada \u2014 ${f}\xD7${y}m, r=${i}m, ${r} seg/chafl\xE1n`), Te = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (V = false, Rt(), e.points.val = [...e.points.rawVal, n.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const t = e.polylines.rawVal, s = t.length - 1, i = t[s] ?? [];
      if (a === "line" && i.length >= 2) {
        ne(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...t.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), ne("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") ne(`\u25CF Nodo creado en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else if (a === "line") ne("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") ne("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const t = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      ne(`\u25A6 \xC1rea \u2014 click ${t.length}/4. Marc\xE1 ${4 - t.length} v\xE9rtice${4 - t.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  x.addEventListener("click", () => It()), x.addEventListener("contextmenu", (n) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && fe.length >= 3) {
      n.preventDefault();
      const a = pn();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), x.addEventListener("pointermove", (n) => {
    var _a2, _b;
    const o = _(n);
    if (!o) return;
    C.setFromCamera(F, o);
    const a = ie();
    if (_e.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (n.ctrlKey || n.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = r[r.length - 1] ?? [], y = e.points.rawVal ?? [];
        if (f.length > 0) {
          const g = y[f[f.length - 1]];
          if (g) {
            const b = !!window.__hekatanOrthoMode;
            let u = Le;
            if (!u && b) {
              const M = Math.abs(t.x - g[0]), B = Math.abs(t.y - g[1]), te = Math.abs(t.z - g[2]);
              u = M >= B && M >= te ? "x" : B >= te ? "y" : "z";
            }
            u === "x" ? t.set(t.x, g[1], g[2]) : u === "y" ? t.set(g[0], t.y, g[2]) : u === "z" && t.set(g[0], g[1], t.z);
          }
        }
      }
      const s = Qn(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s);
      if (i) t.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0.5;
        r && f > 0 && (t.x = Math.round(t.x / f) * f, t.y = Math.round(t.y / f) * f, t.z = Math.round(t.z / f) * f);
      }
      _e.geometry.setAttribute("position", new gt(t.toArray(), 3));
    }
    v();
  }), x.addEventListener("pointermove", (n) => {
    var _a2;
    const o = _(n);
    if (!o) return;
    C.setFromCamera(F, o);
    let a = false;
    const t = C.intersectObject(J), s = ie();
    if (t.length && s.length) {
      const i = new S(...e.points.rawVal[t[0].index]), r = new S(...s[0].point), f = i.sub(r), y = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      y.transformDirection(ee.matrixWorld), Math.abs(f.dot(y)) < 1e-4 && (a = true);
    }
    _e.visible = !a;
  });
  let lo = false, ro;
  x.addEventListener("pointermove", (n) => {
    var _a2;
    if (!tn) return;
    const o = _(n);
    if (!o) return;
    C.setFromCamera(F, o);
    let a = false;
    const t = C.intersectObject(J), s = ie();
    if (t.length && s.length) {
      const r = new S(...e.points.rawVal[t[0].index]), f = new S(...s[0].point), y = r.sub(f), g = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      g.transformDirection(ee.matrixWorld), Math.abs(y.dot(g)) < 1e-4 && (a = true);
    }
    if (a && tn < 5 && (lo = true, c.enabled = false, ro = t[0].index), !lo || tn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (ro !== void 0) {
      let r = s[0].point;
      (n.ctrlKey || n.metaKey) && (r = new S(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[ro] = r.toArray();
    }
    e.points.val = i;
  }), x.addEventListener("pointerup", () => {
    c.enabled = true, lo = false;
  }), x.addEventListener("contextmenu", (n) => {
    var _a2;
    const o = _(n);
    if (!o) return;
    C.setFromCamera(F, o);
    let a = false;
    const t = C.intersectObject(J), s = ie();
    if (t.length && s.length) {
      const f = new S(...e.points.rawVal[t[0].index]), y = new S(...s[0].point), g = f.sub(y), b = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      b.transformDirection(ee.matrixWorld), Math.abs(g.dot(b)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(t[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((f) => f.filter((y) => y !== t[0].index)).map((f) => f.map((y) => y > t[0].index ? y - 1 : y)).filter((f) => f.length);
    r.push([]), e.polylines.val = r;
  });
}
function fa(e, l, p) {
  const m = Math.round(14.999999999999998), d = { position: e.position.clone(), quaternion: e.quaternion.clone() }, x = setInterval(C, 1e3 / 30);
  let v = 0;
  function C() {
    v++;
    const F = v / m;
    e.position.lerpVectors(d.position, l.position, F), e.quaternion.slerpQuaternions(d.quaternion, l.quaternion, F), p && p(), v == m && clearInterval(x);
  }
}
function ha(e, l, p, h) {
  const c = qs(p, e.elements, h);
  return K.derive(() => {
    c.visible = l.shellResults.val != "none";
  }), c;
}
const ma = 6, xo = 10, wa = 0.012;
function ya(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function xa(e, l, p, h) {
  if (!p && !h) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && p) {
    const m = p[e];
    if (m && m.has(l)) return m.get(l);
  }
  return null;
}
function ga(e, l, p, h) {
  const c = new nt(), m = new as();
  m.setColorMap("rainbow");
  const d = new Zt(), x = K.state([]);
  return K.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const v = p.val, C = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], F = ya(l.frameResults.val);
    if (c.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), c.clear(), !F || C.length === 0 || v.length === 0) {
      x.val = [];
      return;
    }
    const _ = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, ee = (_c = e.deformOutputs) == null ? void 0 : _c.val, ae = [], ce = [];
    for (let $ = 0; $ < C.length; $++) {
      if (C[$].length !== 2) continue;
      const ue = xa(F, $, _, ee);
      ue && (ae.push(ue[0], ue[1]), ce.push({ idx: $, vals: ue }));
    }
    if (ae.length === 0) {
      x.val = [];
      return;
    }
    const se = Math.min(...ae), E = Math.max(...ae);
    m.setMin(se), m.setMax(E), x.val = ae;
    const ie = [1 / 0, 1 / 0, 1 / 0], J = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of v) for (let j = 0; j < 3; j++) ie[j] = Math.min(ie[j], $[j]), J[j] = Math.max(J[j], $[j]);
    const ye = Math.max(J[0] - ie[0], J[1] - ie[1], J[2] - ie[2], 1) * wa, Y = [], R = [], Z = [];
    let V = 0;
    for (const { idx: $, vals: j } of ce) {
      const ue = C[$], le = v[ue[0]], oe = v[ue[1]];
      if (!le || !oe) continue;
      const I = new S(oe[0] - le[0], oe[1] - le[1], oe[2] - le[2]), de = I.length();
      if (de < 1e-10) continue;
      I.normalize();
      const G = Math.abs(I.y) < 0.99 ? new S(0, 1, 0) : new S(1, 0, 0), fe = new S().crossVectors(I, G).normalize(), he = new S().crossVectors(I, fe).normalize(), Ve = xo + 1, Se = ma;
      for (let Be = 0; Be < Ve; Be++) {
        const Je = Be / xo, ut = le[0] + I.x * de * Je, Ft = le[1] + I.y * de * Je, P = le[2] + I.z * de * Je, L = j[0] + (j[1] - j[0]) * Je, H = m.getColor(L) ?? new Zt(0, 0, 0);
        d.copy(H).convertSRGBToLinear();
        for (let N = 0; N < Se; N++) {
          const re = N / Se * Math.PI * 2, me = Math.cos(re), ve = Math.sin(re);
          Y.push(ut + (fe.x * me + he.x * ve) * ye, Ft + (fe.y * me + he.y * ve) * ye, P + (fe.z * me + he.z * ve) * ye), R.push(d.r, d.g, d.b);
        }
      }
      for (let Be = 0; Be < xo; Be++) for (let Je = 0; Je < Se; Je++) {
        const ut = (Je + 1) % Se, Ft = V + Be * Se + Je, P = V + Be * Se + ut, L = V + (Be + 1) * Se + Je, H = V + (Be + 1) * Se + ut;
        Z.push(Ft, P, H), Z.push(Ft, H, L);
      }
      V += Ve * Se;
    }
    if (Y.length === 0) return;
    const T = new ke();
    T.setAttribute("position", new gt(Y, 3)), T.setAttribute("color", new gt(R, 3)), T.setIndex(Z), T.computeVertexNormals();
    const U = new lt({ vertexColors: true, side: St }), D = new je(T, U);
    D.frustumCulled = false, c.add(D);
  }), c.__colorMapValues = x, c;
}
function va() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ma = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, ba = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, _a = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function mt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Sa = 16755200, Oo = 56831, ka = 56831, Pa = 56831, Nn = 65382;
function Ca(e) {
  const l = new nt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const p = new yn(1, 16, 16), h = new lt({ color: Sa, transparent: true, opacity: 0.85, depthTest: false }), c = new je(p, h);
  c.visible = false, c.renderOrder = 100, l.add(c);
  const m = new ke(), d = new pt({ color: Oo, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), x = new Kt(m, d);
  x.visible = false, x.renderOrder = 100, l.add(x);
  const v = new lt({ color: Oo, transparent: true, opacity: 0.7, depthTest: false }), C = new je(new Ko(1, 1, 1, 12), v);
  C.visible = false, C.renderOrder = 100, l.add(C);
  const F = new ke(), _ = new lt({ color: ka, transparent: true, opacity: 0.45, side: St, depthTest: false }), ee = new je(F, _);
  ee.visible = false, ee.renderOrder = 100, l.add(ee);
  const ae = new ke(), ce = new pt({ color: Pa, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new Kt(ae, ce);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const E = new lt({ color: Nn, transparent: true, opacity: 0.95, depthTest: false }), ie = new lt({ color: Nn, transparent: true, opacity: 0.85, depthTest: false }), J = new Ko(1, 1, 1, 12), _e = new lt({ color: Nn, transparent: true, opacity: 0.55, side: St, depthTest: false }), ye = new pt({ color: Nn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), Y = [];
  window.__hekatanModelSelection = Y;
  const R = new nt();
  R.renderOrder = 101, l.add(R);
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function V(P) {
    const L = e.derivedNodes.rawVal;
    return !L || P < 0 || P >= L.length ? null : new S(L[P][0], L[P][1], L[P][2]);
  }
  function T(P, L) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s;
    const H = e.getActiveCamera();
    if (!H || !e.mesh) return null;
    const N = e.rendererElm.getBoundingClientRect(), re = P - N.left, me = L - N.top, ve = e.derivedNodes.rawVal, Me = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!ve || !Me) return null;
    const De = /* @__PURE__ */ new Map(), ze = (Ke) => {
      if (De.has(Ke)) return De.get(Ke);
      const Ne = V(Ke);
      if (!Ne) return De.set(Ke, null), null;
      const Fe = Ne.clone().project(H), Ae = (Fe.x * 0.5 + 0.5) * N.width, be = (-Fe.y * 0.5 + 0.5) * N.height, We = { x: Ae, y: be, z: Fe.z };
      return De.set(Ke, We), We;
    }, Xe = /* @__PURE__ */ new Set();
    for (const Ke of Me) if (Ke) for (const Ne of Ke) Xe.add(Ne);
    const $e = 8;
    let Ue = -1, rt = $e;
    for (let Ke = 0; Ke < ve.length; Ke++) {
      if (!Xe.has(Ke)) continue;
      const Ne = ze(Ke);
      if (!Ne || Ne.z < -1 || Ne.z > 1) continue;
      const Fe = Ne.x - re, Ae = Ne.y - me, be = Math.sqrt(Fe * Fe + Ae * Ae);
      be < rt && (rt = be, Ue = Ke);
    }
    const He = va(), ot = ba[He.dispUnit] ?? 1e3, Le = Ma[He.forceUnit] ?? 1;
    if (Ue >= 0) {
      const Ke = ve[Ue];
      let Ne = `Nodo ${Ue}
(${Ke[0].toFixed(3)}, ${Ke[1].toFixed(3)}, ${Ke[2].toFixed(3)})`;
      const Fe = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Fe == null ? void 0 : Fe.deformations) {
        const Ae = Fe.deformations.get(Ue);
        if (Ae && (Ne += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ne += `
Ux = ${mt(Ae[0] * ot, 3)} ${He.dispUnit}`, Ne += `
Uy = ${mt(Ae[1] * ot, 3)} ${He.dispUnit}`, Ne += `
Uz = ${mt(Ae[2] * ot, 3)} ${He.dispUnit}`, (Math.abs(Ae[3]) > 1e-9 || Math.abs(Ae[4]) > 1e-9 || Math.abs(Ae[5]) > 1e-9) && (Ne += `
Rx = ${mt(Ae[3] * 1e3, 3)} mrad`, Ne += `
Ry = ${mt(Ae[4] * 1e3, 3)} mrad`, Ne += `
Rz = ${mt(Ae[5] * 1e3, 3)} mrad`)), Fe.reactions) {
          const be = Fe.reactions.get(Ue);
          be && (Math.abs(be[0]) > 1e-9 || Math.abs(be[1]) > 1e-9 || Math.abs(be[2]) > 1e-9 || Math.abs(be[3]) > 1e-6 || Math.abs(be[4]) > 1e-6 || Math.abs(be[5]) > 1e-6) && (Ne += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ne += `
Fx = ${mt(be[0] * Le)} ${He.forceUnit}`, Ne += `
Fy = ${mt(be[1] * Le)} ${He.forceUnit}`, Ne += `
Fz = ${mt(be[2] * Le)} ${He.forceUnit}`, (Math.abs(be[3]) > 1e-6 || Math.abs(be[4]) > 1e-6 || Math.abs(be[5]) > 1e-6) && (Ne += `
Mx = ${mt(be[3] * Le)} ${He.forceUnit}\xB7m`, Ne += `
My = ${mt(be[4] * Le)} ${He.forceUnit}\xB7m`, Ne += `
Mz = ${mt(be[5] * Le)} ${He.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ue, info: Ne };
    }
    const Jt = 5;
    let Ze = -1, Gt = Jt, Bt = "frame";
    for (let Ke = 0; Ke < Me.length; Ke++) {
      const Ne = Me[Ke];
      if (!(!Ne || Ne.length < 2)) {
        if (Ne.length === 2) {
          const Fe = ze(Ne[0]), Ae = ze(Ne[1]);
          if (!Fe || !Ae || Fe.z < -1 || Fe.z > 1 || Ae.z < -1 || Ae.z > 1) continue;
          const be = za(re, me, Fe.x, Fe.y, Ae.x, Ae.y);
          be < Gt && (Gt = be, Ze = Ke, Bt = "frame");
        } else if (Ne.length === 3 || Ne.length === 4) {
          const Fe = [];
          let Ae = true;
          for (const be of Ne) {
            const We = ze(be);
            if (!We || We.z < -1 || We.z > 1) {
              Ae = false;
              break;
            }
            Fe.push(We);
          }
          if (!Ae) continue;
          if (Fa(re, me, Fe)) {
            const We = Fe.reduce((Oe, Pe) => Oe + Pe.z, 0) / Fe.length * 1e-3;
            We < Gt && (Gt = We, Ze = Ke, Bt = "shell");
          }
        } else if (Ne.length === 8) {
          const Fe = [];
          let Ae = true;
          for (const Ie of Ne) {
            const Ye = ze(Ie);
            if (!Ye || Ye.z < -1 || Ye.z > 1) {
              Ae = false;
              break;
            }
            Fe.push(Ye);
          }
          if (!Ae) continue;
          const be = Math.min(...Fe.map((Ie) => Ie.x)), We = Math.max(...Fe.map((Ie) => Ie.x)), Oe = Math.min(...Fe.map((Ie) => Ie.y)), Pe = Math.max(...Fe.map((Ie) => Ie.y));
          if (re >= be && re <= We && me >= Oe && me <= Pe) {
            const Ye = Fe.reduce((wt, kt) => wt + kt.z, 0) / Fe.length * 1e-3;
            Ye < Gt && (Gt = Ye, Ze = Ke, Bt = "solid");
          }
        }
      }
    }
    if (Ze >= 0) {
      const Ke = Me[Ze];
      let Fe = `${Bt === "frame" ? "Frame" : Bt === "shell" ? "Shell" : "Solid"} ${Ze}`;
      const Ae = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, be = (_g = (_f = Ae == null ? void 0 : Ae.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, Ze);
      if (be) {
        be.name && (Fe += `
  \u{1F4CB} ${be.name}`), be.shape && (Fe += `
  Shape: ${be.shape}`);
        const We = /concrete|hormig|rect.*sólida/i.test(be.shape || ""), Oe = We ? 100 : 1e3, Pe = We ? "cm" : "mm", Ie = (wt) => {
          const kt = wt * Oe;
          return Math.abs(kt - Math.round(kt)) < 0.05 ? `${Math.round(kt)}` : `${kt.toFixed(1)}`;
        }, Ye = [];
        if (be.D != null && Ye.push(`D=${Ie(be.D)}`), be.B != null && Ye.push(`B=${Ie(be.B)}`), be.TF != null && Ye.push(`TF=${Ie(be.TF)}`), be.TW != null && Ye.push(`TW=${Ie(be.TW)}`), be.t != null && Ye.push(`t=${Ie(be.t)}`), Ye.length && (Fe += `
  Dim: ${Ye.join(" ")} ${Pe}`), be.material) {
          let wt = be.material;
          be.fillMaterial && (wt += ` + FILL "${be.fillMaterial}"`), Fe += `
  Mat: ${wt}`;
        }
      } else {
        const We = (_i = (_h = Ae == null ? void 0 : Ae.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, Ze), Oe = (_k = (_j = Ae == null ? void 0 : Ae.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, Ze);
        We ? (Fe += `
  ${We}`, Oe && !We.includes(Oe) && (Fe += `  (${Oe})`)) : Oe && (Fe += `
  Material: ${Oe}`);
      }
      if (Fe += `
nodos: [${Ke.join(", ")}]`, Bt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const We = e.mesh.analyzeOutputs.rawVal, Oe = _a[He.stressUnit] ?? 1, Pe = [["bendingXX", "Mxx", Le, `${He.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Le, `${He.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Le, `${He.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Le, `${He.forceUnit}/m`], ["membraneYY", "Nyy", Le, `${He.forceUnit}/m`], ["membraneXY", "Nxy", Le, `${He.forceUnit}/m`], ["shearX", "Qx", Le, `${He.forceUnit}/m`], ["shearY", "Qy", Le, `${He.forceUnit}/m`], ["vonMises", "\u03C3VM", Oe, He.stressUnit], ["pressure", "p", Oe, He.stressUnit]], Ie = [];
        for (const [Ye, wt, kt, Pt] of Pe) {
          const Nt = We == null ? void 0 : We[Ye];
          if (Nt && Nt instanceof Map) {
            const ft = Nt.get(Ze);
            if (ft != null) {
              if (typeof ft == "number") Ie.push(`${wt} = ${mt(ft * kt, 3)} ${Pt}`);
              else if (Array.isArray(ft)) {
                let At = ft[0];
                for (const vt of ft) Math.abs(vt) > Math.abs(At) && (At = vt);
                Ie.push(`${wt} = ${mt(At * kt, 3)} ${Pt}`);
              }
            }
          }
        }
        Ie.length > 0 && (Fe += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ie.slice(0, 8).join(`
`));
      }
      if (Bt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const We = e.mesh.deformOutputs.rawVal, Oe = e.mesh.elementInputs.rawVal, Pe = We == null ? void 0 : We.deformations;
        if (Pe && Ke.length === 2) {
          const Ie = Pe.get(Ke[0]), Ye = Pe.get(Ke[1]), wt = ve[Ke[0]], kt = ve[Ke[1]];
          if (Ie && Ye && wt && kt) {
            const Pt = kt[0] - wt[0], Nt = kt[1] - wt[1], ft = kt[2] - wt[2], At = Math.sqrt(Pt * Pt + Nt * Nt + ft * ft);
            if (At > 1e-9) {
              const vt = Pt / At, Ot = Nt / At, an = ft / At, ln = (Ye[0] - Ie[0]) * vt + (Ye[1] - Ie[1]) * Ot + (Ye[2] - Ie[2]) * an, rn = ((_n = Oe.elasticities) == null ? void 0 : _n.get(Ze)) ?? 0, Hn = ((_o2 = Oe.areas) == null ? void 0 : _o2.get(Ze)) ?? 0, cn = ((_p = Oe.momentsOfInertiaY) == null ? void 0 : _p.get(Ze)) ?? 0, Fn = ((_q = Oe.momentsOfInertiaZ) == null ? void 0 : _q.get(Ze)) ?? 0, dn = ((_r = Oe.torsionalConstants) == null ? void 0 : _r.get(Ze)) ?? 0, An = ((_s = Oe.shearModuli) == null ? void 0 : _s.get(Ze)) ?? rn / 2.6, xn = rn * Hn * (ln / At), En = (Ye[3] - Ie[3]) * vt + (Ye[4] - Ie[4]) * Ot + (Ye[5] - Ie[5]) * an, pn = An * dn * (En / At), $t = Ye[4] - Ie[4], qt = Ye[5] - Ie[5], Ht = rn * cn * $t / At, Qt = rn * Fn * qt / At;
              Fe += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Fe += `
L = ${mt(At, 3)} m`, Fe += `
\u0394L = ${mt(ln * ot, 3)} ${He.dispUnit}`, Fe += `
\u03B5 = ${mt(ln / At, 6)}`, Math.abs(xn) > 1e-6 && (Fe += `
N \u2248 ${mt(xn * Le)} ${He.forceUnit}`), Math.abs(pn) > 1e-6 && (Fe += `
T \u2248 ${mt(pn * Le)} ${He.forceUnit}\xB7m`), Math.abs(Ht) > 1e-6 && (Fe += `
My \u2248 ${mt(Ht * Le)} ${He.forceUnit}\xB7m`), Math.abs(Qt) > 1e-6 && (Fe += `
Mz \u2248 ${mt(Qt * Le)} ${He.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Bt, idx: Ze, info: Fe };
    }
    return null;
  }
  function U(P, L, H) {
    var _a2, _b, _c;
    if (c.visible = false, x.visible = false, C.visible = false, ee.visible = false, se.visible = false, !P || !e.mesh) {
      Z.style.display = "none", e.render();
      return;
    }
    const N = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (P.type === "node") {
      const Me = V(P.idx);
      if (Me) {
        const De = e.derivedNodes.rawVal ?? [];
        let ze = 1;
        if (De.length >= 2) {
          let Ue = [1 / 0, 1 / 0, 1 / 0], rt = [-1 / 0, -1 / 0, -1 / 0];
          for (const He of De) for (let ot = 0; ot < 3; ot++) He[ot] < Ue[ot] && (Ue[ot] = He[ot]), He[ot] > rt[ot] && (rt[ot] = He[ot]);
          ze = Math.max(rt[0] - Ue[0], rt[1] - Ue[1], rt[2] - Ue[2], 0.1);
        }
        const Xe = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, $e = 0.021 * ze * Xe;
        c.position.copy(Me), c.scale.setScalar($e), c.visible = true;
      }
    } else if (P.type === "frame" && N) {
      const Me = N[P.idx], De = V(Me[0]), ze = V(Me[1]);
      if (De && ze) {
        const Xe = De.clone().add(ze).multiplyScalar(0.5), $e = ze.clone().sub(De), Ue = $e.length(), ot = e.getActiveCamera().position.distanceTo(Xe) * 35e-4;
        C.position.copy(Xe);
        const Le = new S(0, 1, 0), Jt = Le.clone().cross($e).normalize(), Ze = Le.angleTo($e);
        C.quaternion.setFromAxisAngle(Jt, Ze), C.scale.set(ot, Ue, ot), C.visible = true;
      }
    } else if (P.type === "shell" && N) {
      const Me = N[P.idx], De = [], ze = [];
      for (const Xe of Me) {
        const $e = V(Xe);
        if (!$e) return;
        De.push($e.x, $e.y, $e.z);
      }
      Me.length === 4 ? ze.push(0, 1, 2, 0, 2, 3) : Me.length === 3 && ze.push(0, 1, 2), F.setAttribute("position", new gt(De, 3)), F.setIndex(ze), F.computeVertexNormals(), ee.visible = true;
    } else if (P.type === "solid" && N) {
      const Me = N[P.idx], De = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], ze = [];
      for (const [Xe, $e] of De) {
        const Ue = V(Me[Xe]), rt = V(Me[$e]);
        Ue && rt && ze.push(Ue.x, Ue.y, Ue.z, rt.x, rt.y, rt.z);
      }
      ae.setAttribute("position", new gt(ze, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      Z.style.display = "none", e.render();
      return;
    }
    Z.textContent = P.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const me = e.rendererElm.getBoundingClientRect(), ve = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? me;
    Z.style.left = `${L - ve.left}px`, Z.style.top = `${H - ve.top}px`, e.render();
  }
  let D = "", $ = 0, j = 0;
  const ue = window.__hekatanHoverDebug ?? false, le = (P) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const L = T(P.clientX, P.clientY);
      if (ue && j < 5) {
        const N = e.derivedNodes.rawVal, re = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${P.clientX}, ${P.clientY}) nodes=${(N == null ? void 0 : N.length) ?? 0} elems=${(re == null ? void 0 : re.length) ?? 0} hover=`, L), j++;
      }
      const H = L ? `${L.type}:${L.idx}` : "";
      if (H !== D) D = H, U(L, P.clientX, P.clientY);
      else if (L) {
        const N = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        Z.style.left = `${P.clientX - N.left}px`, Z.style.top = `${P.clientY - N.top}px`;
      }
    });
  };
  let oe = null;
  const I = () => {
    D = "", c.visible = false, x.visible = false, C.visible = false, ee.visible = false, se.visible = false, Z.style.display = "none", e.render();
  }, de = (P) => {
    const L = e.rendererElm.getBoundingClientRect(), H = P.clientX - L.left, N = P.clientY - L.top;
    (H < -2 || N < -2 || H > L.width + 2 || N > L.height + 2) && (oe && clearTimeout(oe), oe = window.setTimeout(I, 200));
  }, G = () => {
    oe && (clearTimeout(oe), oe = null);
  };
  e.rendererElm.addEventListener("pointermove", le), e.rendererElm.addEventListener("pointerleave", de), e.rendererElm.addEventListener("pointerenter", G);
  function fe() {
    var _a2, _b, _c;
    const P = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return P === "select" || P === "none" || !P;
  }
  let he = null;
  e.rendererElm.addEventListener("pointerdown", (P) => {
    P.button === 0 && (he = { x: P.clientX, y: P.clientY });
  }), e.rendererElm.addEventListener("pointerup", (P) => {
    if (P.button !== 0 || !he) return;
    const L = P.clientX - he.x, H = P.clientY - he.y;
    if (he = null, L * L + H * H > 9 || !fe()) return;
    const N = T(P.clientX, P.clientY);
    N ? (ut({ type: N.type, idx: N.idx }, P.shiftKey), Je()) : Ft();
  }), window.addEventListener("keydown", (P) => {
    if (P.key !== "Escape" || !Y.length) return;
    const L = document.activeElement, H = !!L && (L.id === "hk3-cmd-input" || L.id === "hk-dyn-input") && L.value === "";
    L && (L.tagName === "INPUT" || L.tagName === "TEXTAREA" || L.isContentEditable) && !H || Ft();
  }, { capture: true });
  function Ve() {
    for (const P of R.children.slice()) {
      R.remove(P);
      const L = P.geometry;
      L && L !== p && L !== J && L.dispose();
    }
  }
  const Se = (P) => {
    var _a2;
    const L = e.getActiveCamera(), H = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return L.isOrthographicCamera ? (L.top - L.bottom) / (L.zoom || 1) / H : 2 * L.position.distanceTo(P) * Math.tan((L.fov || 50) * Math.PI / 180 / 2) / H;
  };
  function Be(P, L) {
    var _a2, _b;
    const H = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (P.type === "node") {
      const N = V(P.idx);
      if (!N) return;
      const re = new je(p, E);
      re.position.copy(N), re.scale.setScalar(Math.max(1e-4, 7 * Se(N))), re.renderOrder = 101, R.add(re);
    } else if (P.type === "frame" && H) {
      const N = H[P.idx], re = V(N[0]), me = V(N[1]);
      if (!re || !me) return;
      const ve = re.clone().add(me).multiplyScalar(0.5), Me = me.clone().sub(re), De = Me.length(), ze = e.getActiveCamera().position.distanceTo(ve), Xe = new je(J, ie);
      Xe.position.copy(ve);
      const $e = new S(0, 1, 0);
      Xe.quaternion.setFromAxisAngle($e.clone().cross(Me).normalize(), $e.angleTo(Me)), Xe.scale.set(ze * 35e-4, De, ze * 35e-4), Xe.renderOrder = 101, R.add(Xe);
    } else if (P.type === "shell" && H) {
      const N = H[P.idx], re = [], me = [];
      for (const De of N) {
        const ze = V(De);
        if (!ze) return;
        re.push(ze.x, ze.y, ze.z);
      }
      N.length === 4 ? me.push(0, 1, 2, 0, 2, 3) : N.length === 3 && me.push(0, 1, 2);
      const ve = new ke();
      ve.setAttribute("position", new gt(re, 3)), ve.setIndex(me), ve.computeVertexNormals();
      const Me = new je(ve, _e);
      Me.renderOrder = 101, R.add(Me);
    } else if (P.type === "solid" && H) {
      const N = H[P.idx], re = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], me = [];
      for (const [De, ze] of re) {
        const Xe = V(N[De]), $e = V(N[ze]);
        Xe && $e && me.push(Xe.x, Xe.y, Xe.z, $e.x, $e.y, $e.z);
      }
      const ve = new ke();
      ve.setAttribute("position", new gt(me, 3));
      const Me = new Kt(ve, ye);
      Me.renderOrder = 101, R.add(Me);
    }
  }
  function Je() {
    if (Ve(), !Y.length || !e.mesh) {
      e.render();
      return;
    }
    const P = e.derivedNodes.rawVal ?? [];
    if (P.length >= 2) {
      const L = [1 / 0, 1 / 0, 1 / 0], H = [-1 / 0, -1 / 0, -1 / 0];
      for (const N of P) for (let re = 0; re < 3; re++) N[re] < L[re] && (L[re] = N[re]), N[re] > H[re] && (H[re] = N[re]);
      Math.max(H[0] - L[0], H[1] - L[1], H[2] - L[2], 0.1);
    }
    for (const L of Y) Be(L);
    e.render();
  }
  function ut(P, L) {
    const H = Y.findIndex((N) => N.type === P.type && N.idx === P.idx);
    H >= 0 ? Y.splice(H, 1) : L || Y.push(P), Y.length && Y[Y.length - 1];
  }
  function Ft() {
    Y.length = 0, Je();
  }
  return K.derive(() => {
    e.derivedNodes.val, Y.length && Je();
  }), l;
}
function za(e, l, p, h, c, m) {
  const d = c - p, x = m - h, v = d * d + x * x;
  if (v < 1e-9) {
    const ce = e - p, se = l - h;
    return Math.sqrt(ce * ce + se * se);
  }
  let C = ((e - p) * d + (l - h) * x) / v;
  C = Math.max(0, Math.min(1, C));
  const F = p + C * d, _ = h + C * x, ee = e - F, ae = l - _;
  return Math.sqrt(ee * ee + ae * ae);
}
function Fa(e, l, p) {
  let h = false;
  for (let c = 0, m = p.length - 1; c < p.length; m = c++) {
    const d = p[c].x, x = p[c].y, v = p[m].x, C = p[m].y;
    x > l != C > l && e < (v - d) * (l - x) / (C - x + 1e-12) + d && (h = !h);
  }
  return h;
}
function Qo(e, l = 8) {
  const p = document.createElement("div");
  p.id = "legend", p.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    K.derive(() => {
      Kn.val, p.style.background = Zs();
    });
  });
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", p.appendChild(h), setTimeout(() => {
    K.derive(() => {
      h.textContent = vo.val ? `[${vo.val}]` : "";
    });
  });
  const c = Array.from({ length: l + 1 }, (v, C) => C / l).reverse();
  let m, d;
  c.forEach((v, C) => {
    m = document.createElement("div"), m.id = `marker-${C}`, m.className = "marker", m.style.marginTop = C == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", d = document.createElement("p"), d.id = `marker-text-${C}`, m.append(d), p.append(m);
  });
  const x = [];
  return p.querySelectorAll("p").forEach((v) => x.push(v)), setTimeout(() => {
    K.derive(() => {
      c.forEach((v, C) => {
        const F = x[C];
        F && (F.innerText = Aa(e.val, v).toString());
      });
    });
  }), p;
}
function Aa(e, l) {
  const p = zn.val;
  if (p) return jo(p[0] + l * (p[1] - p[0]));
  const h = e.filter((d) => Number.isFinite(d));
  if (h.length === 0) return "0";
  const [c, m] = bo(h);
  return jo(c + l * (m - c));
}
function jo(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function Ya({ mesh: e, settingsObj: l, drawingObj: p, objects3D: h, solids: c }) {
  Ns.DEFAULT_UP = new S(0, 0, 1);
  const m = document.createElement("div"), d = new Rs(), x = new Bs(45, 1, 0.1, 2 * 1e6), v = new Ds(-10, 10, 10, -10, -1e3, 2e6);
  let C = x;
  const F = new Xs({ antialias: true });
  F.localClippingEnabled = true;
  const _ = new Go(x, F.domElement);
  _.enableDamping = true, _.dampingFactor = 0.1, _.screenSpacePanning = true, _.zoomSpeed = 0.8, _.panSpeed = 1.2, _.rotateSpeed = 0.9, _.keyPanSpeed = 12, _.listenToKeyEvents(window), _.touches = { ONE: Dn.ROTATE, TWO: Dn.DOLLY_PAN }, F.domElement.addEventListener("wheel", (P) => {
    if (!P.ctrlKey && Math.abs(P.deltaX) > Math.abs(P.deltaY) * 1.5) {
      P.preventDefault();
      const L = _.target, H = new S().subVectors(x.position, L), N = new S();
      N.crossVectors(x.up, H).normalize();
      const me = H.length() * 1e-3 * _.panSpeed;
      L.addScaledVector(N, P.deltaX * me), x.position.addScaledVector(N, P.deltaX * me), _.update();
    }
  }, { passive: false });
  const ee = new mo(new S(-1, 0, 0), 0), ae = new mo(new S(0, -1, 0), 0), ce = new mo(new S(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const P = window.__hekatanClip, L = [];
    P.enableX && (ee.normal.set(P.invertX ? 1 : -1, 0, 0), ee.constant = P.invertX ? -P.posX : P.posX, L.push(ee)), P.enableY && (ae.normal.set(0, P.invertY ? 1 : -1, 0), ae.constant = P.invertY ? -P.posY : P.posY, L.push(ae)), P.enableZ && (ce.normal.set(0, 0, P.invertZ ? 1 : -1), ce.constant = P.invertZ ? -P.posZ : P.posZ, L.push(ce)), F.clippingPlanes = L, d.traverse((N) => {
      const re = N;
      if (re.material) {
        const me = Array.isArray(re.material) ? re.material : [re.material];
        for (const ve of me) ve.clippingPlanes = L, ve.needsUpdate = true;
      }
    });
    const H = window.__hekatanPanes ?? [];
    for (const N of H) try {
      N && typeof N.refresh == "function" && N.refresh();
    } catch {
    }
    F.render(d, C);
  }
  se(), window.__hekatanClipApply = se;
  const E = Gs(l), ie = K.derive(() => Math.pow(10, E.displayScale.val / 10)), J = Ea(e, E), _e = () => {
    const P = [];
    return E.gridXY.rawVal && P.push("xy"), E.gridXZ.rawVal && P.push("xz"), E.gridYZ.rawVal && P.push("yz"), P;
  }, ye = () => {
    const P = E.gridStep.rawVal, L = Math.max(P, E.gridMajor.rawVal);
    return { planes: _e(), majorStep: L, minorStep: P };
  };
  let Y = yo(E.gridSize.rawVal, ye());
  Y.visible = E.gridVisible.rawVal, window.__hekatanSnap2D = E.cursorSnap.rawVal;
  const R = () => {
    const P = Math.max(0, Math.min(1, E.gridOpacity.rawVal));
    Y.traverse((L) => {
      const H = L.material;
      if (!H || !("opacity" in H)) return;
      const N = L.name ?? "";
      let re = 0.35;
      N.includes("border") ? re = 1 : N.includes("major") && (re = 0.75), H.opacity = P * re;
    });
  };
  R(), m.appendChild(Ks(E, e, c)), m.setAttribute("id", "viewer"), m.appendChild(F.domElement), F.setPixelRatio(window.devicePixelRatio);
  const Z = sn();
  F.setClearColor(Z.background, 1);
  const V = E.gridSize.rawVal, T = V * 0.5 + V * 0.5 / Math.tan(45 * 0.5);
  x.position.set(0, 0, T), x.up.set(0, 1, 0), _.target.set(0, 0, 0), _.minDistance = 0.1, _.maxDistance = 1e4, m.__settings = E, _.zoomSpeed = 1, _._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, _.update();
  let U = Wo(E.gridSize.rawVal, E.flipAxes.rawVal);
  d.add(Y, U), K.derive(() => {
    window.__hekatanGridPlaneXY = E.gridXY.val, window.__hekatanGridPlaneXZ = E.gridXZ.val, window.__hekatanGridPlaneYZ = E.gridYZ.val;
  });
  let D = true;
  K.derive(() => {
    const P = E.gridVisible.val;
    if (D) {
      D = false;
      return;
    }
    Y.visible = P, G();
  });
  let $ = true;
  K.derive(() => {
    if (E.gridOpacity.val, $) {
      $ = false;
      return;
    }
    R(), G();
  }), K.derive(() => {
    const P = E.cursorSnap.val;
    window.__hekatanSnap2D = P;
  });
  let j = true;
  K.derive(() => {
    var _a2;
    const P = E.gridSize.val, L = E.flipAxes.val;
    if (E.gridXY.val, E.gridXZ.val, E.gridYZ.val, E.gridStep.val, E.gridMajor.val, j) {
      j = false;
      return;
    }
    d.remove(Y), (_a2 = Y.traverse) == null ? void 0 : _a2.call(Y, (re) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = re.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = re.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Y = yo(P, ye()), Y.visible = E.gridVisible.rawVal, d.add(Y), R(), d.remove(U), U.traverse((re) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = re.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = re.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), U = Wo(P, L), d.add(U);
    const H = P * 0.5 + P * 0.5 / Math.tan(45 * 0.5);
    x.position.distanceTo(_.target), Math.abs(x.position.x) < 0.1 && Math.abs(x.position.y) < 0.1 && x.position.z > 0 ? x.position.set(0, 0, H) : x.position.set(0.5 * P, -H, 0.5 * P), _.target.set(0, 0, 0), _.minDistance = Math.max(0.05, P * 0.01), _.maxDistance = Math.max(50, P * 50), _.update(), G();
  }), new ResizeObserver((P) => {
    var _a2, _b;
    for (const L of P) {
      const H = (_a2 = L.target) == null ? void 0 : _a2.clientWidth, N = (_b = L.target) == null ? void 0 : _b.clientHeight;
      if (H === 0 || N === 0) continue;
      const me = (le ? H / 2 : H) / N;
      x.aspect = me, x.updateProjectionMatrix();
      const ve = v.top;
      if (v.left = -ve * me, v.right = ve * me, v.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = me, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Me = oe, De = Me.top;
        Me.left = -De * me, Me.right = De * me, Me.updateProjectionMatrix();
      }
      F.setSize(H, N), G();
    }
  }).observe(m), _.addEventListener("change", G), K.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e2 = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e2.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, E.displayScale.val, E.nodes.val, E.elements.val, (_g = E.edges) == null ? void 0 : _g.val, E.elemColumns.val, E.elemBeams.val, E.nodesIndexes.val, E.elementsIndexes.val, E.orientations.val, E.sections.val, E.secColumns.val, E.secBeams.val, E.secFloor.val, E.supports.val, E.loads.val, E.deformedShape.val, E.nodeResults.val, E.frameResults.val, E.shellResults.val, (_h = E.solidResults) == null ? void 0 : _h.val, (_i = E.extruded) == null ? void 0 : _i.val, setTimeout(G);
  });
  let le = false, oe = null, I = null, de = false;
  function G() {
    const P = m.clientWidth || 1, L = m.clientHeight || 1;
    if (!le || !oe) {
      F.setScissorTest(false), F.setViewport(0, 0, P, L), F.render(d, C);
      return;
    }
    const H = P / 2;
    F.setScissorTest(true), F.setViewport(0, 0, H, L), F.setScissor(0, 0, H, L), F.render(d, C), F.setViewport(H, 0, H, L), F.setScissor(H, 0, H, L), F.render(d, oe), F.setScissorTest(false);
  }
  function fe(P) {
    C = P, _.object = P, _.update(), G();
  }
  function he(P, L) {
    le = P, L && (oe = L);
    const H = m.clientWidth || 1, N = m.clientHeight || 1, me = (P ? H / 2 : H) / N;
    x.isPerspectiveCamera && (x.aspect = me, x.updateProjectionMatrix());
    const ve = v.top;
    if (v.left = -ve * me, v.right = ve * me, v.updateProjectionMatrix(), P && oe) {
      if (I ? (I.object = oe, I.update()) : (I = new Go(oe, F.domElement), I.enableDamping = true, I.dampingFactor = 0.1, I.screenSpacePanning = true, I.zoomSpeed = 0.8, I.panSpeed = 1.2, I.rotateSpeed = 0.9, I.touches = { ONE: Dn.ROTATE, TWO: Dn.DOLLY_PAN }, I.target.copy(_.target), I.addEventListener("change", G), I.enabled = false), !de) {
        const Me = (De) => {
          if (!le || !I) return;
          const ze = F.domElement.getBoundingClientRect(), Xe = De.clientX - ze.left, $e = ze.width / 2, Ue = Xe >= $e;
          _.enabled = !Ue, I.enabled = Ue;
        };
        F.domElement.addEventListener("pointerdown", Me, true), F.domElement.addEventListener("wheel", Me, { capture: true, passive: true }), de = true;
      }
    } else P || (_.enabled = true, I && (I.enabled = false));
    m.__splitMode = P, window.__hekatanSplitMode = P, window.__hekatanSplitCamera = P ? oe : null, G();
  }
  if (e) {
    d.add(Hs(E, J, ie), Ys(e, E, J), Os(E, J, ie), Qs(e, E, J, ie), Ws(e, E, J, ie), Js(e, E, J, ie), ta(e, E, J, ie), oa(e, E, J, ie), la(e, E, J), pa(e, E, J, ie), ra(e, E, J, ie));
    const P = Ca({ scene: d, rendererElm: F.domElement, getActiveCamera: () => C, derivedNodes: J, derivedDisplayScale: ie, mesh: e, settings: E, render: G });
    d.add(P);
    const L = Ra(e, E), H = ha(e, E, J, L), N = Qo(L);
    d.add(H), m.appendChild(N);
    const re = ga(e, E, J);
    d.add(re);
    const me = re.__colorMapValues, ve = Qo(me);
    ve.id = "frame-legend", m.appendChild(ve), K.derive(() => {
      var _a2;
      const Me = E.shellResults.val != "none", De = (((_a2 = E.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", ze = Me || De, Xe = E.frameResults.val.startsWith("contour:"), $e = L.val.some((Ue) => Number.isFinite(Ue));
      N.hidden = !ze || !$e, H.visible = ze, ve.hidden = !Xe;
    });
  }
  if (c) {
    const P = new os(16777215, 0.5);
    d.add(P);
    const L = new qn(16777215, 0.5);
    L.position.set(30, 25, -10), L.shadow.mapSize.width = 1024, L.shadow.mapSize.height = 1024, d.add(L);
    const H = 10;
    L.shadow.camera.left = -H, L.shadow.camera.right = H, L.shadow.camera.top = H, L.shadow.camera.bottom = -H, L.shadow.camera.far = 1e3;
    const N = new qn(16777215, 0.5);
    N.color.setHSL(11, 43, 96), N.position.set(-10, 0, 30), d.add(N), K.derive(() => {
      (c == null ? void 0 : c.val.length) && (d.remove(...c.oldVal), d.add(...c.rawVal), G());
    }), K.derive(() => {
      c.rawVal.forEach((re) => re.visible = E.solids.val), G();
    });
  }
  if (h) {
    const P = [], L = (N) => {
      var _a2;
      return ((_a2 = N == null ? void 0 : N.userData) == null ? void 0 : _a2.isCota) ? E.showCotas.val : E.custom3D.val;
    }, H = () => {
      for (const N of P) N.visible = L(N);
      G();
    };
    K.derive(() => {
      const N = h.val;
      P.length && (d.remove(...P), P.length = 0), N.length && (d.add(...N), P.push(...N), H()), G();
    }), K.derive(() => {
      E.custom3D.val, H();
    }), K.derive(() => {
      E.showCotas.val, H();
    });
  }
  p && ua({ drawingObj: p, gridObj: Y, scene: d, getActiveCamera: () => C, controls: _, gridSize: V, derivedDisplayScale: ie, rendererElm: F.domElement, viewerRender: G }), ts((P, L) => {
    var _a2;
    F.setClearColor(L.background, 1), d.remove(Y), (_a2 = Y.traverse) == null ? void 0 : _a2.call(Y, (H) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = H.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = H.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Y = yo(E.gridSize.rawVal, { planes: _e() }), d.add(Y), m.style.setProperty("--awatif-legend-color", L.legendMarker), G();
  });
  const Ve = { scene: d, perspCamera: x, orthoCamera: v, get camera() {
    return C;
  }, controls: _, renderer: F, rendererElm: F.domElement, render: G, setActiveCamera: fe, setSplitMode: he, get splitMode() {
    return le;
  }, get splitCamera() {
    return oe;
  }, settings: E };
  m.__ctx = Ve;
  const Se = document.createElement("div");
  Se.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Be = (P, L, H) => {
    const N = document.createElement("button");
    return N.textContent = P, N.title = L, N.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), N.onmouseenter = () => {
      N.style.background = "rgba(70,70,70,0.9)";
    }, N.onmouseleave = () => {
      N.style.background = "rgba(40,40,40,0.85)";
    }, N.onclick = (re) => {
      re.preventDefault(), H();
    }, N;
  }, Je = (P, L) => {
    const H = _.target, N = new S().subVectors(C.position, H), re = N.length(), me = new S(), ve = new S();
    me.crossVectors(C.up, N).normalize(), ve.copy(C.up).normalize();
    const Me = re * 0.05;
    H.addScaledVector(me, -P * Me), H.addScaledVector(ve, L * Me), C.position.addScaledVector(me, -P * Me), C.position.addScaledVector(ve, L * Me), _.update(), G();
  }, ut = (P) => {
    const L = new S().subVectors(C.position, _.target);
    L.multiplyScalar(P), C.position.copy(_.target).add(L), _.update(), G();
  }, Ft = () => {
    const P = document.createElement("div");
    return P.style.cssText = "width:32px;height:32px;", P;
  };
  return Se.append(Ft()), Se.append(Be("\u2191", "Pan arriba", () => Je(0, 1))), Se.append(Be("\u2295", "Zoom in", () => ut(0.85))), Se.append(Be("\u2190", "Pan izquierda", () => Je(-1, 0))), Se.append(Be("\u2302", "Reset vista", () => {
    _.reset(), G();
  })), Se.append(Be("\u2192", "Pan derecha", () => Je(1, 0))), Se.append(Be("\u2296", "Zoom out", () => ut(1.18))), Se.append(Be("\u2193", "Pan abajo", () => Je(0, -1))), Se.append(Ft()), getComputedStyle(m).position === "static" && (m.style.position = "relative"), m.appendChild(Se), m;
}
function Ea(e, l) {
  return K.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const p = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || p.length === 0) return p;
    const c = l.deformScale.val, m = l.deformScale.val * l.deformScaleZ.val, d = Number.isFinite(c) ? c : 1, x = Number.isFinite(m) ? m : 1;
    return p.map((v, C) => {
      var _a3;
      const F = ((_a3 = h.get(C)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], _ = Number.isFinite(F[0]) ? F[0] : 0, ee = Number.isFinite(F[1]) ? F[1] : 0, ae = Number.isFinite(F[2]) ? F[2] : 0;
      return [v[0] + _ * d, v[1] + ee * d, v[2] + ae * x];
    });
  });
}
const zn = K.state(null), vo = K.state(""), Ta = K.state("kN"), Va = K.state("mm"), $a = K.state("kN/m\xB2"), La = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, es = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Ia = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Ra(e, l) {
  const p = K.state([]);
  let h;
  return ((c) => {
    c.bendingXX = "bendingXX", c.bendingYY = "bendingYY", c.bendingXY = "bendingXY", c.membraneXX = "membraneXX", c.membraneYY = "membraneYY", c.membraneXY = "membraneXY", c.tranverseShearX = "tranverseShearX", c.tranverseShearY = "tranverseShearY", c.membranePrincipalMax = "membranePrincipalMax", c.membranePrincipalMin = "membranePrincipalMin", c.bendingPrincipalMax = "bendingPrincipalMax", c.bendingPrincipalMin = "bendingPrincipalMin", c.transverseShearMax = "transverseShearMax", c.vonMises = "vonMises", c.pressure = "pressure", c.displacementX = "displacementX", c.displacementY = "displacementY", c.displacementZ = "displacementZ";
  })(h || (h = {})), K.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const c = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ce = (L, H) => {
      L == null ? void 0 : L.forEach((N, re) => {
        const me = e.elements.val[re];
        if (me) for (let ve = 0; ve < me.length; ve++) H.set(me[ve], [N[ve] ?? N[0]]);
      });
    };
    ce((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), ce((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, m), ce((_f = (_e2 = e.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, d), ce((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, x), ce((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, v), ce((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, C), ce((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, F), ce((_p = (_o2 = e.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, _), ce((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ee), ce((_t2 = (_s = e.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t2.pressure, ae);
    const se = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), _e = /* @__PURE__ */ new Map(), ye = (L, H, N, re, me) => {
      L.forEach((ve, Me) => {
        var _a3, _b2;
        const De = ve[0] ?? 0, ze = ((_a3 = H.get(Me)) == null ? void 0 : _a3[0]) ?? 0, Xe = ((_b2 = N.get(Me)) == null ? void 0 : _b2[0]) ?? 0, $e = (De + ze) / 2, Ue = Math.hypot((De - ze) / 2, Xe);
        re.set(Me, [$e + Ue]), me.set(Me, [$e - Ue]);
      });
    };
    ye(x, v, C, se, E), ye(c, m, d, ie, J), F.forEach((L, H) => {
      var _a3;
      _e.set(H, [Math.hypot(L[0] ?? 0, ((_a3 = _.get(H)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const Y = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, R = (_w = l.solidResults) == null ? void 0 : _w.val, V = R && R !== "none" ? R : l.shellResults.val, T = Y == null ? void 0 : Y[V], U = { bendingXX: [c, 0], bendingYY: [m, 0], bendingXY: [d, 0], membraneXX: [x, 0], membraneYY: [v, 0], membraneXY: [C, 0], tranverseShearX: [F, 0], tranverseShearY: [_, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [E, 0], bendingPrincipalMax: [ie, 0], bendingPrincipalMin: [J, 0], transverseShearMax: [_e, 0], vonMises: [ee, 0], pressure: [ae, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, D = l.shellResults.val, $ = Ta.val, j = Va.val, ue = D === "displacementX" || D === "displacementY" || D === "displacementZ", le = D === "bendingXX" || D === "bendingYY" || D === "bendingXY" || D === "bendingPrincipalMax" || D === "bendingPrincipalMin", oe = D === "membraneXX" || D === "membraneYY" || D === "membraneXY" || D === "membranePrincipalMax" || D === "membranePrincipalMin", I = D === "vonMises" || D === "pressure", de = D === "tranverseShearX" || D === "tranverseShearY" || D === "transverseShearMax", G = (_D = l.solidResults) == null ? void 0 : _D.val, fe = G === "vonMises" || G === "sigmaXX" || G === "sigmaYY" || G === "sigmaZZ" || G === "tauXY" || G === "tauYZ" || G === "tauXZ", he = G === "ux" || G === "uy" || G === "uz", Ve = $a.val, Se = fe ? Ia[Ve] : he || ue ? es[j] : le || oe || I || de ? 1 / La[$] : 1, Be = fe ? Ve : he || ue ? j : le ? `${$}\xB7m/m` : oe ? `${$}/m\xB2` : I ? `${$}/m\xB2` : de ? `${$}/m` : "";
    vo.val = Be, zn.val = Array.isArray(T) && T.length === 2 ? [T[0] * Se, T[1] * Se] : null;
    const Je = ls.val, Ft = G && G !== "none" ? [ee, 0] : U[D], P = [];
    if (e.nodes.val.forEach((L, H) => {
      const N = Ft;
      if (!N || !N[0] || typeof N[0].has != "function") return;
      if (!N[0].has(H)) {
        P.push(Number.NaN);
        return;
      }
      const re = N[0].get(H), me = re ? re[N[1]] ?? 0 : 0;
      P.push(me * Se);
    }), !zn.val && Je !== "auto") {
      const L = e.nodes.val, H = /* @__PURE__ */ new Set(), N = (me, ve) => {
        var _a3;
        const Me = (_a3 = L[me[0]]) == null ? void 0 : _a3[ve];
        return me.every((De) => {
          var _a4;
          return Math.abs((((_a4 = L[De]) == null ? void 0 : _a4[ve]) ?? NaN) - Me) < 1e-6;
        });
      };
      for (const me of e.elements.val) {
        if (me.length !== 4) continue;
        const ve = N(me, 2), Me = !ve && N(me, 0), De = !ve && N(me, 1);
        if (Je === "losas" ? ve : Je === "muros" ? Me || De : Je === "murosX" ? Me : Je === "murosY" ? De : false) for (const $e of me) H.add($e);
      }
      const re = [];
      for (const me of H) {
        const ve = P[me];
        Number.isFinite(ve) && re.push(ve);
      }
      re.length && (zn.val = bo(re));
    }
    p.val = P;
  }), p;
}
export {
  qs as a,
  Qo as b,
  Ta as c,
  Va as d,
  $a as e,
  Ya as g
};
