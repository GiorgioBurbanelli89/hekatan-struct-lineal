import { N as Zt, a6 as Rn, q as Ps, v as q, a7 as Cs, D as Ct, M as Oe, B as Pe, F as bt, a8 as zs, x as ft, a9 as Fs, aa as As, h as Xo, ab as No, r as an, ac as Nn, ad as Yn, a4 as ts, _ as tt, a as ht, L as Kt, w as ns, b as Es, ae as Ts, f as it, V as S, $ as sn, af as uo, H as Mo, d as Ft, c as fo, Y as os, Z as Zn, G as Vs, z as Pn, A as $s, ag as Un, t as Ls, o as Is, I as Qt, a2 as Sn, E as Yo, S as hn, m as ho, ah as kn, g as Uo, i as Zo, j as qo, C as Ko, K as Rs, U as Bs, W as Ds, X as Xs, T as Bn, P as mo, O as Ns } from "./theme-U-6D_qyI.js";
import { T as Pt, O as Go } from "./Text-CUW6lNkV.js";
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
        const P = this.map[v][0], z = this.map[v + 1][0];
        c.setHex(this.map[v][1], Rn), m.setHex(this.map[v + 1][1], Rn);
        const _ = new Zt().lerpColors(c, m, (x - P) / (z - P));
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
    const d = 1 / this.n, x = new Zt(), v = new Zt(), P = new Zt();
    for (let z = 1; z >= 0; z -= d) for (let _ = this.map.length - 1; _ >= 0; _--) if (z < this.map[_][0] && z >= this.map[_ - 1][0]) {
      const ee = this.map[_ - 1][0], ae = this.map[_][0];
      x.setHex(this.map[_ - 1][1], Rn), v.setHex(this.map[_][1], Rn), P.lerpColors(x, v, (z - ee) / (ae - ee)), c[m * 4] = Math.round(P.r * 255), c[m * 4 + 1] = Math.round(P.g * 255), c[m * 4 + 2] = Math.round(P.b * 255), c[m * 4 + 3] = 255, m += 1;
    }
    return p.putImageData(h, 0, 0), l;
  }
}
const wo = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, is = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Us = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: is, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, qn = q.state("safe"), ls = q.state("auto");
function rs(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Us[qn.val] ?? is;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, m, d, x] = l[h], [v, P, z, _] = l[h + 1];
    if (e <= v) {
      const ee = (e - c) / (v - c);
      return [m + (P - m) * ee, d + (z - d) * ee, x + (_ - x) * ee];
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
    `, side: Ct, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  q.derive(() => {
    var _a2;
    qn.val;
    const d = c.uniforms.cmap.value;
    c.uniforms.cmap.value = Ho(), (_a2 = d == null ? void 0 : d.dispose) == null ? void 0 : _a2.call(d);
  });
  const m = new Oe(new Pe(), c);
  return m.renderOrder = -1, m.frustumCulled = false, m.userData.isShellArea = true, m.name = "__hekatan_shell_colormap", q.derive(() => {
    m.geometry.setAttribute("position", new bt(e.val.flat(), 3));
    const d = [], x = [], v = [];
    l.val.forEach((W, Se) => {
      W.length === 3 ? (d.push(W[0], W[1], W[2]), x.push(Se), v.push(0)) : W.length === 4 && (d.push(W[0], W[1], W[2]), d.push(W[0], W[2], W[3]), x.push(Se, Se), v.push(0, 1));
    }), m.geometry.setIndex(new zs(d, 1)), m.userData.faceToElem = x, m.userData.faceLocal = v;
    const P = p.val.filter((W) => Number.isFinite(W));
    let z, _;
    const ee = zn.val;
    if (ee ? (_ = ee[0], z = ee[1]) : [_, z] = bo(P), z === _) {
      const W = Math.max(Math.abs(z) * 1e-6, 1e-9);
      z += W, _ -= W;
    }
    const ae = ee && ee[0] > ee[1], de = Math.min(_, z), se = Math.max(_, z), A = se - de, ie = new Float32Array(p.val.length);
    for (let W = 0; W < p.val.length; W++) {
      const Se = p.val[W];
      if (!Number.isFinite(Se)) {
        ie[W] = -1;
        continue;
      }
      const X = ((ae ? se + de - Se : Se) - de) / A;
      ie[W] = Math.max(0, Math.min(1, X));
    }
    m.geometry.setAttribute("scalar", new ft(ie, 1));
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
    let ee = false, ae = 0, de = 0, se = 0, A = 0;
    _.addEventListener("mousedown", (ie) => {
      ee = true, ae = ie.clientX, de = ie.clientY;
      const W = h.getBoundingClientRect();
      se = W.left, A = W.top, h.style.left = `${se}px`, h.style.top = `${A}px`;
    }), window.addEventListener("mousemove", (ie) => {
      if (!ee) return;
      const W = ie.clientX - ae, Se = ie.clientY - de, Me = Math.max(0, Math.min(window.innerWidth - 40, se + W)), X = Math.max(0, Math.min(window.innerHeight - 40, A + Se));
      h.style.left = `${Me}px`, h.style.top = `${X}px`;
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
    window.__hekatanOutputsFolder = _, _.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), _.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), _.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), _.addBinding(qn, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), _.addBinding(ls, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), _.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), _.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), _.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), _.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  p && c.addBinding(e.solids, "val", { label: "Solids" });
  const v = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), P = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), z = () => {
    const _ = window.__hekatanClipApply;
    typeof _ == "function" && _();
  };
  return v.addBinding(P, "enableX", { label: "Cortar X" }).on("change", z), v.addBinding(P, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", z), v.addBinding(P, "invertX", { label: "  invertir X" }).on("change", z), v.addBinding(P, "enableY", { label: "Cortar Y" }).on("change", z), v.addBinding(P, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", z), v.addBinding(P, "invertY", { label: "  invertir Y" }).on("change", z), v.addBinding(P, "enableZ", { label: "Cortar Z" }).on("change", z), v.addBinding(P, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", z), v.addBinding(P, "invertZ", { label: "  invertir Z" }).on("change", z), h;
}
function Gs(e) {
  return { gridSize: q.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: q.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: q.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: q.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: q.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: q.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: q.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: q.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: q.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: q.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: q.state((e == null ? void 0 : e.nodes) ?? true), elements: q.state((e == null ? void 0 : e.elements) ?? true), edges: q.state((e == null ? void 0 : e.edges) ?? true), faces: q.state((e == null ? void 0 : e.faces) ?? true), elemColumns: q.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: q.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: q.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: q.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: q.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: q.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: q.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: q.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: q.state((e == null ? void 0 : e.orientations) ?? false), sections: q.state((e == null ? void 0 : e.sections) ?? true), extruded: q.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: q.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: q.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: q.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: q.state((e == null ? void 0 : e.secFloor) ?? -1), supports: q.state((e == null ? void 0 : e.supports) ?? true), loads: q.state((e == null ? void 0 : e.loads) ?? false), deformedShape: q.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: q.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: q.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: q.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: q.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: q.state((e == null ? void 0 : e.flipAxes) ?? false), solids: q.state((e == null ? void 0 : e.solids) ?? true), custom3D: q.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: q.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: q.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: q.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function Hs(e, l, p) {
  const h = an(), c = new Nn(new Pe(), new Yn({ color: h.nodePoint }));
  return ts((m, d) => {
    c.material.color.setHex(d.nodePoint);
  }), c.frustumCulled = false, q.derive(() => {
    e.nodes.val && c.geometry.setAttribute("position", new bt(l.val.flat(), 3));
  }), q.derive(() => {
    if (p.val, l.val, !e.nodes.rawVal) return;
    const m = l.rawVal ?? [];
    let d = e.gridSize.val * 0.5;
    if (m.length >= 2) {
      const v = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
      for (const z of m) for (let _ = 0; _ < 3; _++) v[_] = Math.min(v[_], z[_]), P[_] = Math.max(P[_], z[_]);
      d = Math.max(P[0] - v[0], P[1] - v[1], P[2] - v[2], 0.1);
    }
    const x = 0.03 * d;
    c.material.size = x * p.rawVal;
  }), q.derive(() => {
    c.visible = e.nodes.val;
  }), c;
}
function yo(e, l) {
  const p = an(), h = new tt();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let m = (l == null ? void 0 : l.majorStep) ?? 1, d = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (m <= 0 && (m = 1), d <= 0 && (d = 0.1); e / d > 500; ) d *= 2;
  for (; e / m > 100; ) m *= 2;
  const x = e / 2;
  m = Math.max(d, Math.round(m / d) * d);
  const P = new Zt(p.grid), z = new Zt(p.grid).multiplyScalar(0.45), _ = (se, A, ie, W) => {
    const Se = [], Me = se === "xy" ? (T, N) => [T, N, 0] : se === "xz" ? (T, N) => [T, 0, N] : (T, N) => [0, T, N], X = Math.floor(x / A);
    for (let T = -X; T <= X; T++) {
      const N = T * A, B = Me(N, -x), $ = Me(N, x);
      Se.push(...B, ...$);
    }
    for (let T = -X; T <= X; T++) {
      const N = T * A, B = Me(-x, N), $ = Me(x, N);
      Se.push(...B, ...$);
    }
    const I = new Pe();
    I.setAttribute("position", new bt(Se, 3));
    const U = new ht({ color: ie, transparent: true, opacity: W, depthWrite: false }), V = new Kt(I, U);
    return V.name = `grid-${se}-${A === d ? "minor" : "major"}`, V;
  }, ee = (se, A, ie) => {
    const W = se === "xy" ? (V, T) => [V, T, 0] : se === "xz" ? (V, T) => [V, 0, T] : (V, T) => [0, V, T], Se = [[-x, -x], [x, -x], [x, x], [-x, x]], Me = [];
    for (const [V, T] of Se) Me.push(...W(V, T));
    const X = new Pe();
    X.setAttribute("position", new bt(Me, 3));
    const I = new ht({ color: A, transparent: true, opacity: ie, depthWrite: false }), U = new ns(X, I);
    return U.name = `grid-${se}-border`, U.renderOrder = 1, U;
  }, ae = (se, A, ie) => {
    const W = se === "xy" ? (I, U) => [I, U, 0] : se === "xz" ? (I, U) => [I, 0, U] : (I, U) => [0, I, U], Se = A === "u" ? [...W(-x, 0), ...W(x, 0)] : [...W(0, -x), ...W(0, x)], Me = new Pe();
    Me.setAttribute("position", new bt(Se, 3));
    const X = new Kt(Me, new ht({ color: ie, transparent: true, opacity: 0.45, depthWrite: false }));
    return X.name = `grid-${se}-eje-${A}`, X.renderOrder = 1, X;
  }, de = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of c) {
    h.add(_(se, d, z, 0.12)), h.add(_(se, m, P, 0.4));
    const [A, ie] = de[se];
    h.add(ae(se, "u", A)), h.add(ae(se, "v", ie)), h.add(ee(se, P, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: m, minorStep: d, gridSize: e, planes: [...c] }, h;
}
function Ws(e, l, p, h) {
  const c = new tt(), m = new Es(0.5, 0.5, 0.5), d = new Ts(0.45, 0.7, 4);
  d.rotateX(Math.PI / 2), d.translate(0, 0, -0.35);
  const x = new it({ color: 10166822 }), v = new it({ color: 2792847 }), P = new it({ color: 3835647 }), z = () => {
    const ae = p.rawVal ?? [];
    if (ae.length < 2) return l.gridSize.val * 0.5;
    let de = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const A of ae) for (let ie = 0; ie < 3; ie++) A[ie] < de[ie] && (de[ie] = A[ie]), A[ie] > se[ie] && (se[ie] = A[ie]);
    return Math.max(se[0] - de[0], se[1] - de[1], se[2] - de[2], 0.1);
  }, _ = () => 0.08 * z(), ee = () => h.rawVal;
  return q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const ae = _();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((de, se) => {
      const A = p.val[se];
      if (!A) return;
      const ie = de ?? [], W = (ie[0] ? 1 : 0) + (ie[1] ? 1 : 0) + (ie[2] ? 1 : 0), Se = (ie[3] ? 1 : 0) + (ie[4] ? 1 : 0) + (ie[5] ? 1 : 0);
      let Me;
      W >= 3 && Se >= 3 ? Me = new Oe(m, x) : W >= 3 && Se === 0 ? Me = new Oe(d, v) : Me = new Oe(d, P), Me.position.set(A[0], A[1], A[2]);
      const X = ae * ee();
      Me.scale.set(X, X, X), c.add(Me);
    });
  }), q.derive(() => {
    if (h.val, !l.supports.rawVal) return;
    const de = _() * ee();
    c.children.forEach((se) => se.scale.set(de, de, de));
  }), q.derive(() => {
    c.visible = l.supports.val;
  }), c;
}
function Js(e, l, p, h) {
  const c = new tt();
  c.name = "loadsGroup";
  function m(d) {
    if (d.length < 2) return 0.12 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], v = [-1 / 0, -1 / 0, -1 / 0];
    for (const z of d) for (let _ = 0; _ < 3; _++) x[_] = Math.min(x[_], z[_]), v[_] = Math.max(v[_], z[_]);
    return 0.08 * Math.max(v[0] - x[0], v[1] - x[1], v[2] - x[2], 0.1);
  }
  return q.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((_) => _.dispose()), c.clear();
    const d = p.val, x = m(d), v = 240, P = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((_, ee) => {
      d[ee] && _.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && P.push(ee);
    });
    let z = P;
    if (P.length > v) {
      const _ = P.map((V) => d[V][0]), ee = P.map((V) => d[V][1]), ae = Math.min(..._), de = Math.max(..._), se = Math.min(...ee), A = Math.max(...ee), ie = P.map((V) => d[V][2]), W = Math.max(1e-6, (Math.max(...ie) - Math.min(...ie)) / 40), Se = (V) => Math.round(V / W), Me = new Set(ie.map(Se)), X = Math.max(4, Math.floor(v / Math.max(1, Me.size))), I = Math.max(2, Math.round(Math.sqrt(X))), U = /* @__PURE__ */ new Map();
      for (const V of P) {
        const T = de - ae < 1e-9 ? 0 : (d[V][0] - ae) / (de - ae), N = A - se < 1e-9 ? 0 : (d[V][1] - se) / (A - se), B = Math.min(I - 1, Math.floor(T * I)), $ = Math.min(I - 1, Math.floor(N * I)), j = `${B},${$},${Se(d[V][2])}`, he = Math.hypot(T * I - (B + 0.5), N * I - ($ + 0.5)), le = U.get(j);
        (!le || he < le.d) && U.set(j, { i: V, d: he });
      }
      z = [...U.values()].map((V) => V.i);
    }
    for (const _ of z) {
      const ee = e.nodeInputs.val.loads.get(_), ae = d[_];
      if (!ae) continue;
      const de = new S(...ee.slice(0, 3));
      if (de.lengthSq() < 1e-30) continue;
      de.normalize();
      const se = new sn(de, new S(...ae), 1, 15637248, 0.3, 0.3), A = x * h.rawVal;
      se.scale.set(A, A, A), c.add(se);
    }
  }), q.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const x = m(p.rawVal) * h.rawVal;
    c.children.forEach((v) => v.scale.set(x, x, x));
  }), q.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function Os(e, l, p) {
  const h = new tt();
  return q.derive(() => {
    if (!e.nodesIndexes.val) return;
    h.children.forEach((m) => m.dispose()), h.clear();
    const c = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((m, d) => {
      const x = new Pt(`${d}`);
      x.position.set(...m), x.updateScale(c * p.rawVal), h.add(x);
    });
  }), q.derive(() => {
    if (p.val, !e.nodesIndexes.rawVal) return;
    const c = 0.05 * e.gridSize.val * 0.6;
    h.children.forEach((m) => m.updateScale(c * p.rawVal));
  }), q.derive(() => {
    h.visible = e.nodesIndexes.val;
  }), h;
}
function Qs(e, l, p, h) {
  const c = new tt();
  return q.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    c.children.forEach((d) => d.dispose()), c.clear();
    const m = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((d, x) => {
      const v = new Pt(`${x}`, void 0, "#001219");
      v.position.set(...js(d.map((P) => p.rawVal[P]))), v.updateScale(m * h.rawVal), c.add(v);
    });
  }), q.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const m = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((d) => d.updateScale(m * h.rawVal));
  }), q.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function js(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function Wo(e, l) {
  const p = new tt(), h = Math.min(0.05 * e, 0.6), c = an(), m = new Pt("X", "red", "transparent"), d = new Pt(l ? "Z" : "Y", "green", "transparent"), x = new Pt(l ? "Y" : "Z", "blue", "transparent"), v = new sn(new S(1, 0, 0), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), P = new sn(new S(0, 1, 0), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), z = new sn(new S(0, 0, 1), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return m.position.set(1.3 * h, 0, 0), d.position.set(0, 1.3 * h, 0), x.position.set(0, 0, 1.3 * h), m.updateScale(0.4 * h), d.updateScale(0.4 * h), x.updateScale(0.4 * h), v.scale.set(h, h, h), P.scale.set(h, h, h), z.scale.set(h, h, h), p.add(v, P, z, m, d, x), p;
}
function Kn(e, l) {
  const p = new S(...e), c = new S(...l).clone().sub(p), m = c.length(), d = c.dot(new S(1, 0, 0)) / m, x = c.dot(new S(0, 1, 0)) / m, v = c.dot(new S(0, 0, 1)) / m, P = Math.sqrt(d ** 2 + x ** 2);
  let z = new uo().fromArray([[d, x, v], [-x / P, d / P, 0], [-d * v / P, -x * v / P, P]].flat());
  return v === 1 && (z = new uo().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), v === -1 && (z = new uo().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Mo().setFromMatrix3(z);
}
function go(e, l) {
  return e == null ? void 0 : e.map((p, h) => (9 * p + l[h]) / 10);
}
function Cn(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function ea(e, l, p) {
  const h = Cn([l, p]), c = Cn([e, p]), m = Cn([e, l]), d = new S(...h).sub(new S(...c)).normalize(), x = new S(...p).sub(new S(...m)).normalize(), v = d.clone().cross(x).normalize(), P = v.clone().cross(d).normalize();
  return new Mo().makeBasis(d, P, v);
}
function ta(e, l, p, h) {
  const c = new tt(), m = new Pe(), d = new ht({ vertexColors: true }), x = [0, 0, 0], v = [1, 0, 0], P = [0, 1, 0], z = [0, 0, 1];
  m.setAttribute("position", new bt([...x, ...v, ...x, ...P, ...x, ...z], 3));
  const _ = [255, 0, 0], ee = [0, 255, 0], ae = [0, 0, 255];
  return m.setAttribute("color", new bt([..._, ..._, ...ee, ...ee, ...ae, ...ae], 3)), q.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((de) => {
      const se = new Kt(m, d), A = p.rawVal[de[0]], ie = p.rawVal[de[1]];
      if (de.length === 2 && (se.position.set(...go(A, ie)), se.rotation.setFromRotationMatrix(Kn(A, ie))), de.length === 3) {
        const Me = p.rawVal[de[2]];
        se.position.set(...Cn([A, ie, Me])), se.rotation.setFromRotationMatrix(ea(A, ie, Me));
      }
      const Se = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      se.scale.set(Se, Se, Se), c.add(se);
    }));
  }), q.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((A) => A.scale.set(se, se, se));
  }), q.derive(() => {
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
  const c = new tt(), m = new tt();
  c.add(m);
  function d(I, U) {
    const V = I / 2, T = U / 2, N = new Float32Array([0, -V, -T, 0, V, -T, 0, V, T, 0, -V, -T, 0, V, T, 0, -V, T]), B = new Pe();
    B.setAttribute("position", new ft(N, 3));
    const $ = new Float32Array([0, -V, -T, 0, V, -T, 0, V, T, 0, -V, T, 0, -V, -T]), j = new Pe();
    return j.setAttribute("position", new ft($, 3)), { fill: B, outline: j };
  }
  function x(I, U = 24) {
    const V = I / 2, T = new Float32Array(U * 9);
    for (let j = 0; j < U; j++) {
      const he = j / U * Math.PI * 2, le = (j + 1) / U * Math.PI * 2;
      T[j * 9] = 0, T[j * 9 + 1] = 0, T[j * 9 + 2] = 0, T[j * 9 + 3] = 0, T[j * 9 + 4] = V * Math.cos(he), T[j * 9 + 5] = V * Math.sin(he), T[j * 9 + 6] = 0, T[j * 9 + 7] = V * Math.cos(le), T[j * 9 + 8] = V * Math.sin(le);
    }
    const N = new Pe();
    N.setAttribute("position", new ft(T, 3));
    const B = new Float32Array((U + 1) * 3);
    for (let j = 0; j <= U; j++) {
      const he = j / U * Math.PI * 2;
      B[j * 3] = 0, B[j * 3 + 1] = V * Math.cos(he), B[j * 3 + 2] = V * Math.sin(he);
    }
    const $ = new Pe();
    return $.setAttribute("position", new ft(B, 3)), { fill: N, outline: $ };
  }
  function v(I, U, V, T) {
    const N = V ?? U * 0.08, B = T ?? I * 0.07, $ = I / 2, j = U / 2, he = j - N, le = B / 2, oe = [];
    function L(xe, $e, ke, Ie) {
      oe.push(0, xe, $e, 0, ke, $e, 0, ke, Ie, 0, xe, $e, 0, ke, Ie, 0, xe, Ie);
    }
    L(-$, -j, $, -he), L(-le, -he, le, he), L(-$, he, $, j);
    const pe = new Pe();
    pe.setAttribute("position", new ft(new Float32Array(oe), 3));
    const G = new Float32Array([0, -$, -j, 0, $, -j, 0, $, -he, 0, le, -he, 0, le, he, 0, $, he, 0, $, j, 0, -$, j, 0, -$, he, 0, -le, he, 0, -le, -he, 0, -$, -he, 0, -$, -j]), we = new Pe();
    return we.setAttribute("position", new ft(G, 3)), { fill: pe, outline: we };
  }
  function P(I, U, V) {
    const T = I / 2, N = U / 2, B = T - V, $ = N - V, j = [];
    function he(pe, G, we, xe) {
      j.push(0, pe, G, 0, we, G, 0, we, xe, 0, pe, G, 0, we, xe, 0, pe, xe);
    }
    he(-T, -N, T, -$), he(-T, $, T, N), he(-T, -$, -B, $), he(B, -$, T, $);
    const le = new Pe();
    le.setAttribute("position", new ft(new Float32Array(j), 3));
    const oe = new Float32Array([0, -T, -N, 0, T, -N, 0, T, -N, 0, T, N, 0, T, N, 0, -T, N, 0, -T, N, 0, -T, -N, 0, -B, -$, 0, B, -$, 0, B, -$, 0, B, $, 0, B, $, 0, -B, $, 0, -B, $, 0, -B, -$]), L = new Pe();
    return L.setAttribute("position", new ft(oe, 3)), { fill: le, outline: L };
  }
  function z(I, U, V) {
    const T = I / 2, N = U / 2, B = T - V, $ = N - V, j = new Pe(), he = new Float32Array([0, -B, -$, 0, B, -$, 0, B, $, 0, -B, -$, 0, B, $, 0, -B, $]);
    j.setAttribute("position", new ft(he, 3));
    const le = [];
    function oe(we, xe, $e, ke) {
      le.push(0, we, xe, 0, $e, xe, 0, $e, ke, 0, we, xe, 0, $e, ke, 0, we, ke);
    }
    oe(-T, -N, T, -$), oe(-T, $, T, N), oe(-T, -$, -B, $), oe(B, -$, T, $);
    const L = new Pe();
    L.setAttribute("position", new ft(new Float32Array(le), 3));
    const pe = new Float32Array([0, -T, -N, 0, T, -N, 0, T, -N, 0, T, N, 0, T, N, 0, -T, N, 0, -T, N, 0, -T, -N, 0, -B, -$, 0, B, -$, 0, B, -$, 0, B, $, 0, B, $, 0, -B, $, 0, -B, $, 0, -B, -$]), G = new Pe();
    return G.setAttribute("position", new ft(pe, 3)), { concFill: j, steelFillGeom: L, outline: G };
  }
  function _(I, U, V) {
    const T = [], N = [[0, -I / 2, -U / 2], [0, -I / 2 + V, -U / 2], [0, -I / 2 + V, U / 2 - V], [0, I / 2, U / 2 - V], [0, I / 2, U / 2], [0, -I / 2, U / 2]], B = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const le of B) T.push(...N[le]);
    const $ = new Pe();
    $.setAttribute("position", new ft(new Float32Array(T), 3));
    const j = [];
    for (let le = 0; le < N.length; le++) {
      const oe = (le + 1) % N.length;
      j.push(...N[le], ...N[oe]);
    }
    const he = new Pe();
    return he.setAttribute("position", new ft(new Float32Array(j), 3)), { fill: $, outline: he };
  }
  function ee(I, U, V, T) {
    const N = T / 2, B = [], $ = [[0, -I - N, -U / 2], [0, -V - N, -U / 2], [0, -V - N, U / 2 - V], [0, -N, U / 2 - V], [0, -N, U / 2], [0, -I - N, U / 2]], j = [[0, N, -U / 2], [0, N + V, -U / 2], [0, N + V, U / 2 - V], [0, I + N, U / 2 - V], [0, I + N, U / 2], [0, N, U / 2]], he = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of he) B.push(...$[pe]);
    for (const pe of he) B.push(...j[pe]);
    const le = new Pe();
    le.setAttribute("position", new ft(new Float32Array(B), 3));
    const oe = [];
    for (const pe of [$, j]) for (let G = 0; G < pe.length; G++) {
      const we = (G + 1) % pe.length;
      oe.push(...pe[G], ...pe[we]);
    }
    const L = new Pe();
    return L.setAttribute("position", new ft(new Float32Array(oe), 3)), { fill: le, outline: L };
  }
  function ae(I, U, V, T) {
    const N = U / 2, B = I, $ = [[0, -B, -N], [0, -B, -N + V], [0, -T, -N + V], [0, -T, N - V], [0, -B, N - V], [0, -B, N], [0, 0, N], [0, 0, -N]], j = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], he = [];
    for (const pe of j) he.push(...$[pe]);
    const le = new Pe();
    le.setAttribute("position", new ft(new Float32Array(he), 3));
    const oe = [];
    for (let pe = 0; pe < $.length; pe++) {
      const G = (pe + 1) % $.length;
      oe.push(...$[pe], ...$[G]);
    }
    const L = new Pe();
    return L.setAttribute("position", new ft(new Float32Array(oe), 3)), { fill: le, outline: L };
  }
  function de(I, U, V, T, N) {
    const B = U / 2, $ = N / 2, j = [], he = [[0, -I, -B], [0, -I, -B + V], [0, -$ - T, -B + V], [0, -$ - T, B - V], [0, -I, B - V], [0, -I, B], [0, -$, B], [0, -$, -B]], le = he.map((we) => [we[0], -we[1], we[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const we of oe) j.push(...he[we]);
    for (const we of oe) j.push(...le[we]);
    const L = new Pe();
    L.setAttribute("position", new ft(new Float32Array(j), 3));
    const pe = [];
    for (const we of [he, le]) for (let xe = 0; xe < we.length; xe++) {
      const $e = (xe + 1) % we.length;
      pe.push(...we[xe], ...we[$e]);
    }
    const G = new Pe();
    return G.setAttribute("position", new ft(new Float32Array(pe), 3)), { fill: L, outline: G };
  }
  function se(I, U, V, T) {
    const N = I / 2, B = U / 2, $ = T / 2, j = [[0, -$, -B], [0, $, -B], [0, $, B - V], [0, N, B - V], [0, N, B], [0, -N, B], [0, -N, B - V], [0, -$, B - V]], he = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], le = [];
    for (const G of he) le.push(...j[G]);
    const oe = new Pe();
    oe.setAttribute("position", new ft(new Float32Array(le), 3));
    const L = [];
    for (let G = 0; G < j.length; G++) {
      const we = (G + 1) % j.length;
      L.push(...j[G], ...j[we]);
    }
    const pe = new Pe();
    return pe.setAttribute("position", new ft(new Float32Array(L), 3)), { fill: oe, outline: pe };
  }
  function A(I, U, V = 24) {
    const T = I / 2, N = T - U, B = [];
    for (let le = 0; le < V; le++) {
      const oe = le / V * Math.PI * 2, L = (le + 1) / V * Math.PI * 2, pe = Math.cos(oe), G = Math.sin(oe), we = Math.cos(L), xe = Math.sin(L);
      B.push(0, T * pe, T * G, 0, T * we, T * xe, 0, N * we, N * xe), B.push(0, T * pe, T * G, 0, N * we, N * xe, 0, N * pe, N * G);
    }
    const $ = new Pe();
    $.setAttribute("position", new ft(new Float32Array(B), 3));
    const j = [];
    for (let le = 0; le < V; le++) {
      const oe = le / V * Math.PI * 2, L = (le + 1) / V * Math.PI * 2;
      j.push(0, T * Math.cos(oe), T * Math.sin(oe), 0, T * Math.cos(L), T * Math.sin(L)), j.push(0, N * Math.cos(oe), N * Math.sin(oe), 0, N * Math.cos(L), N * Math.sin(L));
    }
    const he = new Pe();
    return he.setAttribute("position", new ft(new Float32Array(j), 3)), { fill: $, outline: he };
  }
  const ie = new it({ color: 52479, transparent: true, opacity: 0.35, side: Ct, depthWrite: false }), W = new ht({ color: 52479 }), Se = new it({ color: 16750848, transparent: true, opacity: 0.4, side: Ct, depthWrite: false }), Me = new ht({ color: 16750848 });
  function X(I, U) {
    const V = Math.abs(U[0] - I[0]), T = Math.abs(U[1] - I[1]), N = Math.abs(U[2] - I[2]);
    return N > V && N > T || T > V && T > N;
  }
  return q.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const I = l.secColumns.rawVal, U = l.secBeams.rawVal;
    if (!I && !U) {
      c.children.forEach(($) => {
        $ instanceof Pt && $.dispose();
      }), c.clear();
      return;
    }
    c.children.forEach(($) => {
      $ instanceof Pt && $.dispose();
    }), c.clear();
    const V = (_a2 = e.elements) == null ? void 0 : _a2.val, T = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!V || !T) return;
    const N = T.sectionShapes, B = l.secFloor.rawVal;
    V.forEach(($, j) => {
      if ($.length !== 2) return;
      const he = p.rawVal[$[0]], le = p.rawVal[$[1]];
      if (!he || !le) return;
      const oe = X(he, le);
      if (oe && !I || !oe && !U) return;
      if (B >= 0) {
        const xe = Math.min(he[1], le[1]);
        Math.max(he[1], le[1]);
        const $e = l.gridSize.rawVal || 3;
        if (Math.floor(xe / $e + 0.01) !== B) return;
      }
      const L = N == null ? void 0 : N.get(j);
      if (!L) return;
      const pe = [(he[0] + le[0]) / 2, (he[1] + le[1]) / 2, (he[2] + le[2]) / 2], G = Kn(he, le);
      if (L.type === "CFT") {
        const xe = z(L.b, L.h, L.tw ?? L.b * 0.05), $e = new Oe(xe.concFill, ie);
        $e.position.set(...pe), $e.rotation.setFromRotationMatrix(G), c.add($e);
        const ke = new Oe(xe.steelFillGeom, Se);
        ke.position.set(...pe), ke.rotation.setFromRotationMatrix(G), c.add(ke);
        const Ie = new Ft(xe.outline, Me);
        Ie.position.set(...pe), Ie.rotation.setFromRotationMatrix(G), c.add(Ie);
      } else {
        let xe, $e, ke;
        switch (L.type) {
          case "rect":
            xe = d(L.b, L.h), $e = ie, ke = W;
            break;
          case "circ":
            xe = x(L.d), $e = ie, ke = W;
            break;
          case "I":
            xe = v(L.b, L.h, L.tf, L.tw), $e = Se, ke = Me;
            break;
          case "HSS":
            xe = P(L.b, L.h, L.tw ?? L.b * 0.05), $e = Se, ke = Me;
            break;
          case "CFT":
            xe = z(L.b, L.h, L.tw ?? L.b * 0.05), $e = Se, ke = Me;
            break;
          case "L":
            xe = _(L.b ?? L.h, L.h, L.t ?? L.tw ?? 3e-3), $e = Se, ke = Me;
            break;
          case "2L":
            xe = ee(L.b ?? L.h, L.h, L.t ?? L.tw ?? 3e-3, L.dis ?? 0.01), $e = Se, ke = Me;
            break;
          case "C":
          case "coldC":
            xe = ae(L.b, L.h, L.tf ?? L.t ?? 3e-3, L.tw ?? L.t ?? 3e-3), $e = Se, ke = Me;
            break;
          case "2C":
            xe = de(L.b, L.h, L.tf ?? 5e-3, L.tw ?? 5e-3, L.dis ?? 0.01), $e = Se, ke = Me;
            break;
          case "T":
            xe = se(L.b, L.h, L.tf ?? 0.01, L.tw ?? 6e-3), $e = Se, ke = Me;
            break;
          case "pipe":
            xe = A(L.d, L.tw ?? L.d * 0.05), $e = Se, ke = Me;
            break;
          default:
            return;
        }
        const Ie = new Oe(xe.fill, $e);
        Ie.position.set(...pe), Ie.rotation.setFromRotationMatrix(G), c.add(Ie);
        const Qe = new Ft(xe.outline, ke);
        Qe.position.set(...pe), Qe.rotation.setFromRotationMatrix(G), c.add(Qe);
      }
      const we = na(L);
      if (we) {
        const $e = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(L.type) ? "#ff9900" : "#00ccff", ke = new Pt(we, $e, "transparent");
        ke.position.set(pe[0], pe[1], pe[2]);
        const Ie = 0.05 * l.gridSize.rawVal * 0.5;
        ke.updateScale(Ie * ((h == null ? void 0 : h.rawVal) ?? 1)), m.add(ke);
      }
    });
  }), h && q.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const I = 0.05 * l.gridSize.val * 0.5;
    m.children.forEach((U) => {
      U instanceof Pt && U.updateScale(I * h.rawVal);
    });
  }), q.derive(() => {
    c.visible = l.sections.val;
  }), q.derive(() => {
    m.visible = l.sectionLabels.val;
  }), c;
}
function sa(e) {
  if (!e) return null;
  const l = e.type, p = (z, _) => [z, _], h = (z, _) => [p(-z / 2, -_ / 2), p(z / 2, -_ / 2), p(z / 2, _ / 2), p(-z / 2, _ / 2)], c = (z, _ = 24) => {
    const ee = z / 2, ae = [];
    for (let de = 0; de < _; de++) {
      const se = 2 * Math.PI * de / _;
      ae.push(p(ee * Math.cos(se), ee * Math.sin(se)));
    }
    return ae;
  }, m = e.b ?? 0, d = e.h ?? 0, x = e.d ?? 0, v = e.tw ?? e.t ?? 0, P = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return m && d ? { contorno: h(m, d) } : null;
    case "circ":
      return x ? { contorno: c(x) } : null;
    case "pipe":
      return x && v ? { contorno: c(x), huecos: [c(x - 2 * v).reverse()] } : null;
    case "HSS":
      return m && d && v ? { contorno: h(m, d), huecos: [h(m - 2 * v, d - 2 * (P || v)).reverse()] } : null;
    case "CFT":
      return m && d ? { contorno: h(m, d) } : null;
    case "I":
      return m && d && v && P ? { contorno: [p(-m / 2, -d / 2), p(m / 2, -d / 2), p(m / 2, -d / 2 + P), p(v / 2, -d / 2 + P), p(v / 2, d / 2 - P), p(m / 2, d / 2 - P), p(m / 2, d / 2), p(-m / 2, d / 2), p(-m / 2, d / 2 - P), p(-v / 2, d / 2 - P), p(-v / 2, -d / 2 + P), p(-m / 2, -d / 2 + P)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return m && d && v && P ? { contorno: [p(-m / 2, -d / 2), p(m / 2, -d / 2), p(m / 2, -d / 2 + P), p(-m / 2 + v, -d / 2 + P), p(-m / 2 + v, d / 2 - P), p(m / 2, d / 2 - P), p(m / 2, d / 2), p(-m / 2, d / 2)] } : null;
    case "T":
      return m && d && v && P ? { contorno: [p(-v / 2, -d / 2), p(v / 2, -d / 2), p(v / 2, d / 2 - P), p(m / 2, d / 2 - P), p(m / 2, d / 2), p(-m / 2, d / 2), p(-m / 2, d / 2 - P), p(-v / 2, d / 2 - P)] } : null;
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
  const h = new tt();
  h.name = "extrusion";
  const c = new fo({ color: 8369151, transparent: true, opacity: 0.92, side: Ct }), m = new fo({ color: 12623968, transparent: true, opacity: 0.85, side: Ct }), d = new fo({ color: 11583173, transparent: true, opacity: 0.85, side: Ct }), x = new tt();
  x.add(new os(16777215, 0.55));
  const v = new Zn(16777215, 0.75);
  v.position.set(30, 25, 40);
  const P = new Zn(16777215, 0.35);
  P.position.set(-25, -20, 15), x.add(v, P);
  let z = 0;
  return q.derive(() => {
    var _a2, _b, _c, _d, _e;
    const _ = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++z, on: _ }, h.visible = _;
    for (const W of [...h.children]) W !== x && (h.remove(W), (_c = (_b = W.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(x) || h.add(x), !_) return;
    const ee = p.val ?? [], ae = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], de = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = de.sectionShapes ?? /* @__PURE__ */ new Map(), A = de.thicknesses ?? /* @__PURE__ */ new Map();
    let ie = "";
    try {
      ae.forEach((W, Se) => {
        var _a3, _b2, _c2;
        if (W.length === 2) {
          let Me = sa(se.get(Se)), X = true;
          if (Me || (Me = aa((_a3 = de.areas) == null ? void 0 : _a3.get(Se), (_b2 = de.momentsOfInertiaY) == null ? void 0 : _b2.get(Se), (_c2 = de.momentsOfInertiaZ) == null ? void 0 : _c2.get(Se)), X = false), !Me) return;
          const I = ee[W[0]], U = ee[W[1]];
          if (!I || !U) return;
          const V = Math.hypot(U[0] - I[0], U[1] - I[1], U[2] - I[2]);
          if (V < 1e-9) return;
          const T = new Vs(ia(Me), { depth: V, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new Mo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const N = new Oe(T, X ? c : m);
          N.position.set(I[0], I[1], I[2]), N.rotation.setFromRotationMatrix(Kn(I, U)), h.add(N);
          return;
        }
        if (W.length === 3 || W.length === 4) {
          const Me = A.get(Se);
          if (!Me || Me <= 0) return;
          const X = W.map((G) => ee[G]).filter(Boolean);
          if (X.length < 3) return;
          const I = [X[1][0] - X[0][0], X[1][1] - X[0][1], X[1][2] - X[0][2]], U = [X[2][0] - X[0][0], X[2][1] - X[0][1], X[2][2] - X[0][2]], V = I[1] * U[2] - I[2] * U[1], T = I[2] * U[0] - I[0] * U[2], N = I[0] * U[1] - I[1] * U[0], B = Math.hypot(V, T, N);
          if (B < 1e-12) return;
          const $ = [V / B, T / B, N / B], j = [], he = (G) => X.map((we) => [we[0] + $[0] * G, we[1] + $[1] * G, we[2] + $[2] * G]), le = he(+Me / 2), oe = he(-Me / 2), L = (G, we, xe) => j.push(...G, ...we, ...xe);
          for (const G of [le, oe]) L(G[0], G[1], G[2]), G.length === 4 && L(G[0], G[2], G[3]);
          for (let G = 0; G < X.length; G++) {
            const we = (G + 1) % X.length;
            L(le[G], oe[G], oe[we]), L(le[G], oe[we], le[we]);
          }
          const pe = new Pe();
          pe.setAttribute("position", new bt(j, 3)), pe.computeVertexNormals(), h.add(new Oe(pe, d));
        }
      });
    } catch (W) {
      ie = String((W == null ? void 0 : W.message) ?? W);
    }
    globalThis.__extrusionDebug = { corridas: z, on: _, fallo: ie, nElementos: ae.length, nFormas: se.size, nEspesores: A.size, mallas: h.children.length - 1 };
  }), h;
}
class Dn extends tt {
  constructor(l, p, h, c, m, d, x) {
    super();
    const v = new Pn().moveTo(0, 0).lineTo(0, d[1]).lineTo(h, d[1]).lineTo(h, 0).lineTo(0, 0), P = v.getPoints(), z = new Pe().setFromPoints(P);
    this.lines = new Ft(z, new ht({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const _ = new Un(v), ee = new it({ color: d[1] > 0 ? 24435 : 11411474, side: Ct });
    this.mesh = new Oe(_, ee), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Pt(`${m[1].toFixed(4)}`), this.normalizedResult = d, this.textPosition = Cn([l, p]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Jo extends tt {
  constructor(l, p, h, c, m, d, x) {
    super();
    const v = m[0] * h / (m[0] + m[1]), P = m[0] * m[1] > 0;
    if (this.text = new Pt(`${m[0].toFixed(4)}`), this.text2 = new Pt(`${(m[1] * -1).toFixed(4)}`), this.normalizedResult = d, this.textPosition = go(l, p), this.text2Position = go(p, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), P) {
      const z = new Pn().moveTo(0, 0).lineTo(0, d[0]).lineTo(v, 0).lineTo(0, 0), _ = new Pn().moveTo(v, 0).lineTo(h, -d[1]).lineTo(h, 0).lineTo(v, 0), ee = z.getPoints(), ae = _.getPoints(), de = new Pe().setFromPoints(ee), se = new Pe().setFromPoints(ae), A = new ht({ color: an().resultOutline });
      this.lines = new Ft(de, A), this.lines2 = new Ft(se, A), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), x && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ie = new Un(z), W = new Un(_), Se = new it({ color: d[0] > 0 ? 24435 : 11411474, side: Ct }), Me = new it({ color: -d[1] > 0 ? 24435 : 11411474, side: Ct });
      this.mesh = new Oe(ie, Se), this.mesh2 = new Oe(W, Me), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), x && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const z = new Pn().moveTo(0, 0).lineTo(0, d[0]).lineTo(h, -d[1]).lineTo(h, 0).lineTo(0, 0), _ = z.getPoints(), ee = new Pe().setFromPoints(_);
      this.lines = new Ft(ee, new ht({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ae = new Un(z), de = new it({ color: d[0] > 0 ? 24435 : 11411474, side: Ct });
      this.mesh = new Oe(ae, de), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
  const c = new tt(), m = { normals: Dn, shearsY: Dn, shearsZ: Dn, torsions: Dn, bendingsY: Jo, bendingsZ: Jo };
  return q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, p.val, l.frameResults.val == "none") return;
    c.children.forEach((x) => x.dispose()), c.clear();
    const d = cs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[d]) == null ? void 0 : _b.forEach((x, v) => {
      var _a3, _b2;
      const P = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[v]) ?? [0, 1], z = p.rawVal[P[0]], _ = p.rawVal[P[1]], ee = new S(..._).distanceTo(new S(...z)), ae = ca((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[d]), de = x == null ? void 0 : x.map((W) => W / (ae === 0 ? 1 : ae)), se = Kn(z, _), A = new m[d](z, _, ee, se, x ?? [0, 0], de ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(d)), ie = 0.05 * l.gridSize.rawVal;
      A.updateScale(ie * h.rawVal), c.add(A);
    });
  }), q.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    const d = 0.05 * l.gridSize.val;
    c.children.forEach((x) => x.updateScale(d * h.rawVal));
  }), q.derive(() => {
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
class da extends tt {
  constructor(l, p, h) {
    super();
    const c = p === _o.reactions;
    h[0] && (this.xText1 = new Pt(`${c ? "Fx" : "Dx"}: ` + h[0].toFixed(4))), h[3] && (this.xText2 = new Pt(`${c ? "Mx" : "Rx"}: ` + h[3].toFixed(4))), h[1] && (this.yText1 = new Pt(`${c ? "Fy" : "Dy"}: ` + h[1].toFixed(4))), h[4] && (this.yText2 = new Pt(`${c ? "My" : "Ry"}: ` + h[4].toFixed(4))), h[2] && (this.zText1 = new Pt(`${c ? "Fz" : "Dz"}: ` + h[2].toFixed(4))), h[5] && (this.zText2 = new Pt(`${c ? "Mz" : "Rz"}: ` + h[5].toFixed(4))), (h[0] || h[3]) && (this.xArrow = new sn(new S(1, 0, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[1] || h[4]) && (this.yArrow = new sn(new S(0, 1, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[2] || h[5]) && (this.zArrow = new sn(new S(0, 0, 1), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
  const c = new tt();
  return q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    c.children.forEach((x) => x.dispose()), c.clear();
    const m = _o[l.nodeResults.rawVal], d = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[m]) == null ? void 0 : _b.forEach((x, v) => {
      const P = new da(p.rawVal[v], m, x ?? [0, 0, 0, 0, 0, 0]);
      P.updateScale(d * h.rawVal), c.add(P);
    });
  }), q.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const m = 0.05 * l.gridSize.val;
    c.children.forEach((d) => d.updateScale(m * h.rawVal));
  }), q.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function ua({ drawingObj: e, gridObj: l, scene: p, getActiveCamera: h, controls: c, gridSize: m, derivedDisplayScale: d, rendererElm: x, viewerRender: v }) {
  const P = new Ls(), z = new Is(), _ = (n) => {
    const o = x.getBoundingClientRect(), a = n.clientX - o.left, t = n.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const f = s / 2;
      if (a >= f) return z.x = (a - f) / f * 2 - 1, z.y = -(t / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      z.x = a / f * 2 - 1;
    } else z.x = a / s * 2 - 1;
    return z.y = -(t / i) * 2 + 1, h();
  }, ee = new Oe(new Qt(1e4, 1e4), new it({ side: Ct, transparent: true, opacity: 0, depthWrite: false }));
  ee.visible = true, ee.frustumCulled = false, p.add(ee);
  const ae = (n, o, a) => {
    const t = new Oe(new Qt(1e4, 1e4), new it({ side: Ct, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(n, o, a), t.visible = false, t.frustumCulled = false, p.add(t), t;
  }, de = ae(Math.PI / 2, 0, 0), se = ae(0, Math.PI / 2, 0);
  let A = false;
  const ie = () => {
    if (A) return P.intersectObjects([ee], false);
    if (de.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ve.visible) {
      const a = P.intersectObjects([Ve, De, Xe], false);
      if (a.length > 0) return a;
    }
    const o = [ee];
    return de.visible && o.push(de), se.visible && o.push(se), Nt.visible && Ht.length > 0 && o.push(...Ht), P.intersectObjects(o, false);
  }, W = new Nn(new Pe(), new Yn()), Se = new Nn(new Pe(), new Yn({ color: "gray", sizeAttenuation: false, size: 6 })), Me = new Nn(new Pe(), new Yn({ color: "orange", sizeAttenuation: false, size: 5 }));
  p.add(Me);
  const X = document.createElement("input");
  X.id = "hk-rubber-label", X.type = "text", X.spellcheck = false, X.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, X.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(X);
  let I = null, U = null, V = false;
  const T = new S(), N = (n, o, a, t, s, i) => {
    const r = t - n, f = s - o, y = i - a, g = Math.hypot(r, f, y);
    if (g < 0.01) {
      X.style.display = "none";
      return;
    }
    I = [n, o, a], U = [r / g, f / g, y / g], T.set((n + t) / 2, (o + s) / 2, (a + i) / 2), T.project(h());
    const b = x.getBoundingClientRect(), u = b.left + (T.x * 0.5 + 0.5) * b.width, M = b.top + (-T.y * 0.5 + 0.5) * b.height;
    if (X.style.left = u + "px", X.style.top = M + "px", X.style.display = "block", !V) {
      if (X.value = `${g.toFixed(2)} m`, document.activeElement !== X) {
        const R = document.activeElement;
        R && (R.tagName === "INPUT" || R.tagName === "TEXTAREA") && R !== X || X.focus({ preventScroll: true });
      }
      try {
        X.select();
      } catch {
      }
    }
  }, B = () => {
    X.style.display = "none", I = null, U = null, V = false, document.activeElement === X && X.blur();
  }, $ = (n) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      on = n, ne(`\u21C9 DESFASE distancia ${n} m \u2014 designe la l\xEDnea y luego el lado.`), X.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Te.length === 1) {
      const b = Te[0];
      Te = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, b[0], b[1], b[2], n), ne(`\u2713 C\xEDrculo r=${n} m en (${b[0].toFixed(2)}, ${b[1].toFixed(2)}, ${b[2].toFixed(2)}).`);
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
      wt = n, ne(`\u{1F4D0} Altura ${n}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), X.blur();
      return;
    }
    if (!I || !U || !e.polylines) return;
    let a = U[0], t = U[1], s = U[2];
    lt === "x" ? (a = Math.sign(a) || 1, t = 0, s = 0) : lt === "y" ? (a = 0, t = Math.sign(t) || 1, s = 0) : lt === "z" && (a = 0, t = 0, s = Math.sign(s) || 1);
    const i = I[0] + a * n, r = I[1] + t * n, f = I[2] + s * n;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, f]];
    const y = e.polylines.rawVal, g = y.length ? y[y.length - 1] : [];
    e.polylines.val = [...y.slice(0, -1), [...g, e.points.rawVal.length - 1]], X.blur();
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
  }, he = (n) => {
    if (!n) return null;
    if (n.kind === "absCart") return [n.x, n.y, n.z];
    if (n.kind === "relCart") return I ? [I[0] + n.dx, I[1] + n.dy, I[2] + n.dz] : null;
    if (n.kind === "absPolar") {
      const o = n.ang * Math.PI / 180;
      return [n.L * Math.cos(o), n.L * Math.sin(o), 0];
    }
    if (n.kind === "relPolar") {
      if (!I) return null;
      const o = n.ang * Math.PI / 180;
      return [I[0] + n.L * Math.cos(o), I[1] + n.L * Math.sin(o), I[2]];
    }
    if (n.kind === "relSpherical") {
      if (!I) return null;
      const o = n.az * Math.PI / 180, a = n.el * Math.PI / 180, t = n.L * Math.cos(a);
      return [I[0] + t * Math.cos(o), I[1] + t * Math.sin(o), I[2] + n.L * Math.sin(a)];
    }
    return null;
  }, le = (n) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, n];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], I = n, X.blur();
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
    const a = he(o);
    if (!a) return false;
    Io(new S(a[0], a[1], a[2]), null), I = a, X.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, X.addEventListener("keydown", (n) => {
    if (n.key === "Enter") {
      n.preventDefault();
      const a = j(X.value);
      if (!a) return;
      if (V = false, a.kind === "length") $(a.L), ne(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const t = he(a);
        if (!t) return;
        le(t);
        const s = a.kind;
        ne(`\u270F ${s} \u2192 (${t[0].toFixed(2)}, ${t[1].toFixed(2)}, ${t[2].toFixed(2)})`);
      }
      return;
    }
    if (n.key === "Escape") {
      n.preventDefault(), V = false, X.blur();
      return;
    }
    const o = n.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      n.preventDefault(), setTimeout(() => {
        if (!V && X.style.display === "block") try {
          X.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(n.key) || n.key === "Backspace" || n.key === "Delete") && (V = true);
  }), window.addEventListener("keydown", (n) => {
    if (!I || !U || document.activeElement === X) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(n.key) && (X.value = n.key, X.focus(), X.setSelectionRange(1, 1), n.preventDefault());
  });
  const oe = document.createElement("div");
  oe.id = "hk-coord-readout", oe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", oe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(oe);
  const L = document.createElement("div");
  L.id = "hk-coord-fixed", L.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", L.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(L);
  const pe = new Ft(new Pe().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new Sn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", p.add(pe), window.__hekatanRubberBand = pe;
  const G = new Ft(new Pe(), new ht({ color: 2282478, transparent: true, opacity: 0.9 }));
  G.frustumCulled = false, G.visible = false, p.add(G);
  let we = [];
  const xe = new tt(), $e = new Oe(new Qt(1, 1), new it({ color: 2282478, transparent: true, opacity: 0.08, side: Ct, depthWrite: false })), ke = new Kt(new Yo(new Qt(1, 1)), new ht({ color: 2282478, transparent: true, opacity: 0.85 })), Ie = new Kt(new Pe(), new ht({ color: 2282478, transparent: true, opacity: 0.3 })), Qe = (n, o) => {
    const a = [], t = Math.ceil(n / o);
    for (let s = -t; s <= t; s++) {
      const i = s * o;
      a.push(-n, i, 0, n, i, 0), a.push(i, -n, 0, i, n, 0);
    }
    Ie.geometry.dispose(), Ie.geometry = new Pe(), Ie.geometry.setAttribute("position", new bt(a, 3));
  };
  xe.add($e, ke, Ie), xe.visible = false, xe.frustumCulled = false, p.add(xe);
  const pt = new tt();
  pt.frustumCulled = false, pt.visible = false, p.add(pt);
  const re = (n) => {
    const o = new Pe().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), a = new Sn({ color: n, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Ft(o, a);
  }, E = re(16711680), K = re(65280), Y = re(35071);
  pt.add(E, K, Y);
  const Q = (n) => {
    const o = new Pe().setFromPoints([new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0)]), a = new ht({ color: n, transparent: true, opacity: 0.2, depthTest: false }), t = new ns(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, ce = Q(3462041), ye = Q(16724804), me = Q(6333946), Ce = new tt();
  Ce.frustumCulled = false, Ce.visible = false, p.add(Ce), Ce.add(ce, ye, me);
  const Ae = (n) => {
    const o = new Qt(1, 1), a = new it({ color: n, transparent: true, opacity: 0.06, side: Ct, depthWrite: false }), t = new Oe(o, a);
    return t.frustumCulled = false, t.renderOrder = 996, t;
  }, Ve = Ae(3462041), De = Ae(16724804), Xe = Ae(6333946);
  Ce.add(Ve, De, Xe);
  const Ge = (n, o, a, t) => {
    n.scale.set(2 * t, 2 * t, 1), a === "xy" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, 0, 0)) : a === "xz" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(Math.PI / 2, 0, 0)) : (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, Math.PI / 2, 0));
  }, Le = document.createElement("div");
  Le.id = "hk-refplane-badge", Le.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Le), window.__hekatanSetOrthoPlanes = (n) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = n, Ce.visible = n, n) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      He(ce, i, "xy", r), He(ye, i, "xz", r), He(me, i, "yz", r), Ge(Ve, i, "xy", r), Ge(De, i, "xz", r), Ge(Xe, i, "yz", r), Ve.material.opacity = 0.05, De.material.opacity = 0.05, Xe.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    v();
  }, window.__hekatanSetOrthoExt = (n) => {
    var _a2;
    if (window.__hekatanOrthoExt = n, !Ce.visible) {
      v();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0];
    He(ce, i, "xy", n), He(ye, i, "xz", n), He(me, i, "yz", n), Ge(Ve, i, "xy", n), Ge(De, i, "xz", n), Ge(Xe, i, "yz", n), v();
  };
  const mt = (n) => {
    if (Ve.material.opacity = n === "xy" ? 0.09 : 0.025, De.material.opacity = n === "xz" ? 0.09 : 0.025, Xe.material.opacity = n === "yz" ? 0.09 : 0.025, n) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[n];
      Le.style.background = s.bg, Le.style.color = s.text, Le.textContent = `\u25A6 Plano ${n.toUpperCase()}`, Le.style.display = "block";
    } else Le.style.display = "none";
  }, He = (n, o, a, t) => {
    let s;
    a === "xy" ? s = [new S(o[0] - t, o[1] - t, o[2]), new S(o[0] + t, o[1] - t, o[2]), new S(o[0] + t, o[1] + t, o[2]), new S(o[0] - t, o[1] + t, o[2]), new S(o[0] - t, o[1] - t, o[2])] : a === "xz" ? s = [new S(o[0] - t, o[1], o[2] - t), new S(o[0] + t, o[1], o[2] - t), new S(o[0] + t, o[1], o[2] + t), new S(o[0] - t, o[1], o[2] + t), new S(o[0] - t, o[1], o[2] - t)] : s = [new S(o[0], o[1] - t, o[2] - t), new S(o[0], o[1] + t, o[2] - t), new S(o[0], o[1] + t, o[2] + t), new S(o[0], o[1] - t, o[2] + t), new S(o[0], o[1] - t, o[2] - t)], n.geometry.setFromPoints(s);
  };
  let lt = null;
  window.__hekatanAxisLock = () => lt;
  let ut = null;
  const rt = document.createElement("div");
  rt.id = "hk-axis-lock-badge", rt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(rt);
  const qt = () => {
    if (!lt) {
      rt.style.display = "none";
      return;
    }
    const n = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    rt.style.background = "rgba(15,23,42,0.92)", rt.style.color = n[lt], rt.style.border = `1.5px solid ${n[lt]}`, rt.textContent = `\u{1F512} LOCK ${lt.toUpperCase()}`, rt.style.display = "block";
  };
  window.addEventListener("keydown", (n) => {
    var _a2, _b, _c, _d, _e, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== X) return;
    const a = n.key.toLowerCase(), t = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (n.key === "Enter" && t === "polyarea" && we.length >= 3) {
      const s = yn();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), n.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") lt = lt === a ? null : a, qt(), n.preventDefault();
    else if (n.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), To(), n.preventDefault();
    } else n.key === "F3" ? (n.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : n.key === "F10" ? (n.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : n.key === "F8" && (n.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const n = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = n, n || $n(), ne(`\u{1F9F2} OSNAP ${n ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const n = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = n, n || (pt.visible = false), ne(`\u25C8 POLAR ${n ? "ON" : "OFF"} (F10)`);
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
  const Ue = new S(), Re = new S(), Fe = new S(), Ke = (n) => {
    if (!lt) return null;
    const o = n[0], a = n[1], t = n[2];
    return lt === "x" ? (Ue.set(o - 1e4, a, t), Re.set(o + 1e4, a, t)) : lt === "y" ? (Ue.set(o, a - 1e4, t), Re.set(o, a + 1e4, t)) : (Ue.set(o, a, t - 1e4), Re.set(o, a, t + 1e4)), P.ray.distanceSqToSegment(Ue, Re, null, Fe), Fe;
  };
  window.__hekatanProjectOnAxis = Ke;
  const ge = new Ft(new Pe().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new ht({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  ge.renderOrder = 998, ge.frustumCulled = false, ge.visible = false, p.add(ge);
  let qe = -1, We = -1, xt = -1;
  const fe = /* @__PURE__ */ new Set();
  window.__hekatanSelection = fe;
  const Ne = new Ft(new Pe().setFromPoints([new S(), new S()]), new ht({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Ne.renderOrder = 997, Ne.frustumCulled = false, Ne.visible = false, p.add(Ne);
  const nt = new Oe(new hn(0.02, 12, 12), new it({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  nt.renderOrder = 998, nt.visible = false, p.add(nt);
  const gt = (n) => {
    const o = h();
    if (o.isOrthographicCamera) {
      const t = o, s = (t.top - t.bottom) / t.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(n);
    return Math.max(0.05, a / 10);
  }, Gt = () => {
    nt.visible && nt.scale.setScalar(gt(nt.position));
  }, _t = new tt();
  _t.frustumCulled = false, p.add(_t);
  const Tt = 2282478;
  let ct = null;
  const jt = (n, o, a, t) => {
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
  }, Vt = () => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    for (; _t.children.length; ) {
      const r = _t.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = ((_e = e.points) == null ? void 0 : _e.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], t = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of fe) {
      const [f, ...y] = r.split(":");
      if (f === "pt") {
        const g = n[+y[0]];
        if (!g) continue;
        const b = new Oe(new hn(0.025, 12, 12), new it({ color: Tt, transparent: true, opacity: 0.9, depthTest: false }));
        b.position.set(g[0], g[1], g[2]), b.renderOrder = 999, b.__isSelectionPt = true, _t.add(b);
      } else if (f === "seg") {
        const g = o[+y[0]], b = n[g == null ? void 0 : g[+y[1]]], u = n[g == null ? void 0 : g[+y[1] + 1]];
        if (!b || !u) continue;
        const M = new Pe().setFromPoints([new S(b[0], b[1], b[2]), new S(u[0], u[1], u[2])]), R = new Ft(M, new ht({ color: Tt, transparent: true, opacity: 0.95, depthTest: false }));
        R.renderOrder = 999, _t.add(R);
      } else if (f === "poly") {
        const b = o[+y[0]].map((R) => {
          const te = n[R];
          return te ? new S(te[0], te[1], te[2]) : null;
        }).filter(Boolean);
        if (b.length < 2) continue;
        const u = new Pe().setFromPoints(b), M = new Ft(u, new ht({ color: Tt, transparent: true, opacity: 0.95, depthTest: false }));
        M.renderOrder = 999, _t.add(M);
      } else if (f === "aux") {
        const g = t[+y[0]];
        if (!g || g.length !== 6) continue;
        const b = new Pe().setFromPoints([new S(g[0], g[1], g[2]), new S(g[3], g[4], g[5])]), u = new Ft(b, new ht({ color: Tt, transparent: true, opacity: 0.95, depthTest: false }));
        u.renderOrder = 999, _t.add(u);
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
  window.__hekatanRefreshSelection = Vt, window.__hekatanClearSelection = () => {
    fe.clear(), Vt();
  };
  const Jt = (n, o, a, t, s, i, r, f, y) => {
    const g = r - t, b = f - s, u = y - i, M = g * g + b * b + u * u;
    if (M < 1e-12) return Math.hypot(n - t, o - s, a - i);
    let R = ((n - t) * g + (o - s) * b + (a - i) * u) / M;
    R = Math.max(0, Math.min(1, R));
    const te = t + R * g, k = s + R * b, C = i + R * u;
    return Math.hypot(n - te, o - k, a - C);
  }, en = (n, o, a, t) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, f = -1, y = t;
    for (let g = 0; g < s.length; g++) {
      const b = s[g];
      for (let u = 0; u < b.length - 1; u++) {
        const M = i[b[u]], R = i[b[u + 1]];
        if (!M || !R) continue;
        const te = Jt(n, o, a, M[0], M[1], M[2], R[0], R[1], R[2]);
        te < y && (y = te, r = g, f = u);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: f, dist: y } : null;
  }, tn = (n, o, a, t) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let r = -1, f = t;
    for (let y = 0; y < i.length; y++) {
      const g = i[y];
      if (!g || g.length !== 6) continue;
      const b = Jt(n, o, a, g[0], g[1], g[2], g[3], g[4], g[5]);
      b < f && (f = b, r = y);
    }
    return r;
  }, Gn = (n) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[n];
    if (!t || t.length !== 6) {
      ge.visible = false;
      return;
    }
    ge.geometry.setFromPoints([new S(t[0], t[1], t[2]), new S(t[3], t[4], t[5])]), ge.visible = true;
  }, Hn = (n, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[n], t = e.points.rawVal;
    if (!a || a.length < 2) {
      ge.visible = false;
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
    ge.geometry.setFromPoints(i), ge.visible = true;
  }, ln = (n) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (n < 0 || n >= o.length) return;
    const a = o.filter((y, g) => g !== n), t = /* @__PURE__ */ new Set();
    for (const y of a) for (const g of y) t.add(g);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let y = 0; y < s.length; y++) t.has(y) && (i.set(y, r.length), r.push(s[y]));
    const f = a.map((y) => y.map((g) => i.get(g)).filter((g) => g !== void 0));
    e.points.val = r, e.polylines.val = f, e.areas && (e.areas.val = e.areas.rawVal.filter((y) => y !== n).map((y) => y > n ? y - 1 : y)), ge.visible = false, qe = -1, We = -1;
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
      ln(n);
      return;
    }
    const s = a[n];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      ln(n);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const r = [...a.slice(0, n), ...i, ...a.slice(n + 1)], f = /* @__PURE__ */ new Set();
    for (const M of r) for (const R of M) f.add(R);
    const y = e.points.rawVal, g = /* @__PURE__ */ new Map(), b = [];
    for (let M = 0; M < y.length; M++) f.has(M) && (g.set(M, b.length), b.push(y[M]));
    const u = r.map((M) => M.map((R) => g.get(R)).filter((R) => R !== void 0));
    if (e.points.val = b, e.polylines.val = u, e.areas) {
      const M = i.length - 1;
      e.areas.val = e.areas.rawVal.map((R) => R > n ? R + M : R);
    }
    ge.visible = false, qe = -1, We = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  W.geometry.setAttribute("position", new bt(e.points.rawVal.flat(), 3)), W.geometry.computeBoundingSphere(), W.frustumCulled = false, Se.frustumCulled = false, p.add(Se), ee.position.set(0, 0, 0), ee.rotateX(Math.PI / 2), ee.geometry.rotateX(Math.PI / 2), ee.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (n, o, a) => {
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
  const rn = [];
  window.__hekatanCirculos = rn;
  let mn = [], An = "";
  const wn = () => {
    var _a2;
    const n = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${n.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === An) return mn;
    An = a;
    const t = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const r = s.slice(0, i - 1).map((b) => n[b]).filter(Boolean);
      if (r.length < 5) continue;
      const f = [0, 1, 2].map((b) => r.reduce((u, M) => u + M[b], 0) / r.length), y = r.map((b) => Math.hypot(b[0] - f[0], b[1] - f[1], b[2] - f[2])), g = y.reduce((b, u) => b + u, 0) / y.length;
      g < 1e-9 || y.some((b) => Math.abs(b - g) > 5e-3 * g) || t.push({ c: f, r: g });
    }
    return mn = t;
  };
  window.__hekatanCentrosDeducidos = wn, window.__hekatanDrawCircle = (n, o, a, t, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(s)), f = e.points.rawVal.length, y = [];
    for (let g = 0; g < r; g++) {
      const b = 2 * Math.PI * g / r, u = t * Math.cos(b), M = t * Math.sin(b);
      let R;
      i === "xy" ? R = [n + u, o + M, a] : i === "xz" ? R = [n + u, o, a + M] : R = [n, o + u, a + M], y.push(R);
    }
    if (e.points.val = [...e.points.rawVal, ...y], rn.push({ c: [n, o, a], r: t }), e.polylines) {
      const g = [...y.map((u, M) => f + M), f], b = e.polylines.rawVal;
      ((_a2 = b[b.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...b, g, []] : e.polylines.val = [...b.slice(0, -1), g, []];
    }
  }, window.__hekatanDrawArc = (n, o, a, t = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(t)), i = new S(...n), r = new S(...o), f = new S(...a), y = new S().subVectors(r, i), g = new S().subVectors(f, i), b = new S().crossVectors(y, g).normalize(), u = new S().addVectors(i, r).multiplyScalar(0.5), M = new S().addVectors(r, f).multiplyScalar(0.5), R = new S().crossVectors(y, b).normalize(), te = new S().crossVectors(new S().subVectors(f, r), b).normalize(), k = new S().subVectors(M, u), C = R.x * te.y - R.y * te.x;
    let w;
    if (Math.abs(C) > 1e-9) {
      const ze = (k.x * te.y - k.y * te.x) / C;
      w = new S().addVectors(u, R.clone().multiplyScalar(ze));
    } else w = u.clone();
    const F = i.distanceTo(w), D = new S().subVectors(i, w), Z = new S().subVectors(f, w), ue = Math.acos(Math.max(-1, Math.min(1, D.dot(Z) / (F * F)))), H = e.points.rawVal.length, O = [], Ee = b.clone();
    for (let ze = 0; ze <= s; ze++) {
      const ve = ze / s, Ze = ue * ve, Ye = new ho().setFromAxisAngle(Ee, Ze), st = D.clone().applyQuaternion(Ye).add(w);
      O.push([st.x, st.y, st.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...O], rn.push({ c: [w.x, w.y, w.z], r: F }), e.polylines) {
      const ze = O.map((Ze, Ye) => H + Ye), ve = e.polylines.rawVal;
      e.polylines.val = [...ve.slice(0, -1), ze, []];
    }
  }, window.__hekatanDrawSlabChaflan = (n, o, a = 1, t = 6, s = 6) => {
    const i = Math.min(n[0], o[0]), r = Math.max(n[0], o[0]), f = Math.min(n[1], o[1]), y = Math.max(n[1], o[1]), g = (n[2] + o[2]) / 2, b = r - i, u = y - f, M = Math.min(a, b / 2 - 0.01, u / 2 - 0.01);
    if (M <= 0) return;
    const R = e.points.rawVal.length, te = [], k = [], C = (w, F) => {
      te.push([w, F, g]), k.push(R + te.length - 1);
    };
    for (let w = 0; w <= s; w++) C(i + M + (b - 2 * M) * w / s, f);
    for (let w = 1; w <= t; w++) {
      const F = -Math.PI / 2 + Math.PI / 2 * w / t;
      C(r - M + M * Math.cos(F), f + M + M * Math.sin(F));
    }
    for (let w = 1; w <= s; w++) C(r, f + M + (u - 2 * M) * w / s);
    for (let w = 1; w <= t; w++) {
      const F = 0 + Math.PI / 2 * w / t;
      C(r - M + M * Math.cos(F), y - M + M * Math.sin(F));
    }
    for (let w = 1; w <= s; w++) C(r - M - (b - 2 * M) * w / s, y);
    for (let w = 1; w <= t; w++) {
      const F = Math.PI / 2 + Math.PI / 2 * w / t;
      C(i + M + M * Math.cos(F), y - M + M * Math.sin(F));
    }
    for (let w = 1; w <= s; w++) C(i, y - M - (u - 2 * M) * w / s);
    for (let w = 1; w <= t; w++) {
      const F = Math.PI + Math.PI / 2 * w / t;
      C(i + M + M * Math.cos(F), f + M + M * Math.sin(F));
    }
    if (k.push(R), e.points.val = [...e.points.rawVal, ...te], e.polylines) {
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
    if (A && e.gridTarget) {
      const b = e.gridTarget.rawVal, u = new kn(...b.rotation), M = new S(1, 0, 0).applyEuler(u), R = new S(0, 1, 0).applyEuler(u), te = new S(...b.position), k = new S(t, s, i), C = new S(r, f, y), w = k.clone().sub(te).dot(M), F = k.clone().sub(te).dot(R), D = C.clone().sub(te).dot(M), Z = C.clone().sub(te).dot(R), ue = (H, O) => te.clone().addScaledVector(M, H).addScaledVector(R, O).toArray();
      g = [ue(w, F), ue(D, F), ue(D, Z), ue(w, Z)];
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
    for (let be = 0; be < a; be++) {
      const Be = n[be], et = n[(be + 1) % a];
      t += (Be[1] - et[1]) * (Be[2] + et[2]), s += (Be[2] - et[2]) * (Be[0] + et[0]), i += (Be[0] - et[0]) * (Be[1] + et[1]);
    }
    const r = Math.hypot(t, s, i) || 1;
    t /= r, s /= r, i /= r;
    let f = n[1][0] - n[0][0], y = n[1][1] - n[0][1], g = n[1][2] - n[0][2];
    const b = Math.hypot(f, y, g) || 1;
    f /= b, y /= b, g /= b;
    let u = s * g - i * y, M = i * f - t * g, R = t * y - s * f;
    const te = Math.hypot(u, M, R) || 1;
    u /= te, M /= te, R /= te;
    const k = n[0], C = (be) => [(be[0] - k[0]) * f + (be[1] - k[1]) * y + (be[2] - k[2]) * g, (be[0] - k[0]) * u + (be[1] - k[1]) * M + (be[2] - k[2]) * R], w = (be, Be) => [k[0] + be * f + Be * u, k[1] + be * y + Be * M, k[2] + be * g + Be * R], F = n.map(C);
    let D = 1 / 0, Z = -1 / 0, ue = 1 / 0, H = -1 / 0;
    for (const [be, Be] of F) be < D && (D = be), be > Z && (Z = be), Be < ue && (ue = Be), Be > H && (H = Be);
    const O = Z - D, Ee = H - ue;
    if (O < 1e-6 || Ee < 1e-6) return 0;
    let ze = o && o > 0 ? o : 0.5;
    for (; O / ze * (Ee / ze) > 2500; ) ze *= 2;
    ze = Math.min(ze, Math.min(O, Ee));
    const ve = (be, Be) => {
      let et = false;
      for (let Et = 0, Ut = F.length - 1; Et < F.length; Ut = Et++) {
        const [Xt, Wt] = F[Et], [fn, _n] = F[Ut];
        Wt > Be != _n > Be && be < (fn - Xt) * (Be - Wt) / (_n - Wt) + Xt && (et = !et);
      }
      return et;
    }, Ze = Math.max(1, Math.round(O / ze)), Ye = Math.max(1, Math.round(Ee / ze)), st = O / Ze, at = Ee / Ye, kt = /* @__PURE__ */ new Map(), dt = [], _e = e.points.rawVal.length, je = (be, Be) => {
      const et = be + "," + Be, Et = kt.get(et);
      if (Et !== void 0) return Et;
      const Ut = _e + dt.length;
      return dt.push(w(D + be * st, ue + Be * at)), kt.set(et, Ut), Ut;
    }, Je = [];
    for (let be = 0; be < Ze; be++) for (let Be = 0; Be < Ye; Be++) {
      if (!ve(D + (be + 0.5) * st, ue + (Be + 0.5) * at)) continue;
      const et = je(be, Be), Et = je(be + 1, Be), Ut = je(be + 1, Be + 1), Xt = je(be, Be + 1);
      Je.push([et, Et, Ut, Xt]);
    }
    if (!Je.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...dt], e.polylines && e.areas) {
      let be = e.polylines.rawVal.slice();
      be.length && be[be.length - 1].length === 0 && (be = be.slice(0, -1));
      const Be = [];
      for (const et of Je) Be.push(be.length), be.push([et[0], et[1], et[2], et[3], et[0]]);
      be.push([]), e.polylines.val = be, e.areas.val = [...e.areas.rawVal, ...Be];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return v(), Je.length;
  };
  const yn = () => {
    if (we.length < 3) return we = [], G.visible = false, v(), 0;
    const n = window.__hekatanMeshPolyArea(we.slice());
    return we = [], G.visible = false, v(), n;
  };
  window.__hekatanFinalizePolyArea = yn, window.__hekatanSetInclinedPlaneFrom3 = (n, o, a) => {
    var _a2;
    const t = new S(n[0], n[1], n[2]), s = new S(o[0], o[1], o[2]), i = new S(a[0], a[1], a[2]), r = new S().subVectors(s, t).cross(new S().subVectors(i, t));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const f = new ho().setFromUnitVectors(new S(0, 0, 1), r), y = new kn().setFromQuaternion(f);
    e.gridTarget && (e.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [y.x, y.y, y.z] }), A = true;
    const g = new S().addVectors(t, s).add(i).multiplyScalar(1 / 3), b = Math.max(t.distanceTo(s), t.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, u = b / 2;
    $e.geometry.dispose(), $e.geometry = new Qt(b, b), ke.geometry.dispose(), ke.geometry = new Yo(new Qt(b, b)), Qe(u, 1), xe.position.copy(g), xe.quaternion.copy(f), xe.scale.set(1, 1, 1), xe.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return v(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] }), A = false, xe.visible = false, v();
  };
  const Lt = new tt();
  Lt.visible = false, p.add(Lt), window.__hekatanShowAxes = (n, o, a = 12, t = 2) => {
    var _a2, _b;
    for (; Lt.children.length; ) {
      const b = Lt.children.pop();
      (_a2 = b.geometry) == null ? void 0 : _a2.dispose(), (_b = b.material) == null ? void 0 : _b.dispose();
    }
    if (!n.length || !o.length) return;
    const s = Math.min(...o) - t, i = Math.max(...o) + t, r = Math.min(...n) - t, f = Math.max(...n) + t, y = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", g = (b, u, M, R, te) => {
      const k = document.createElement("canvas");
      k.width = 64, k.height = 32;
      const C = k.getContext("2d");
      C.fillStyle = te, C.font = "bold 22px sans-serif", C.textAlign = "center", C.fillText(b, 32, 26);
      const w = new Uo(k), F = new Zo({ map: w, transparent: true }), D = new qo(F);
      return D.position.set(u, M, R), D.scale.set(1.2, 0.6, 1), D;
    };
    n.forEach((b, u) => {
      const M = u < y.length ? y[u] : `X${u}`, R = new Pe().setFromPoints([new S(b, s, 0), new S(b, i, 0), new S(b, s, 0), new S(b, s, a)]), te = new Sn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new Kt(R, te);
      k.computeLineDistances(), Lt.add(k), Lt.add(g(M, b, s - 0.5, 0, "#60a5fa")), Lt.add(g(M, b, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((b, u) => {
      const M = `${u + 1}`, R = new Pe().setFromPoints([new S(r, b, 0), new S(f, b, 0), new S(r, b, 0), new S(r, b, a)]), te = new Sn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new Kt(R, te);
      k.computeLineDistances(), Lt.add(k), Lt.add(g(M, r - 0.5, b, 0, "#fb7185")), Lt.add(g(M, f + 0.5, b, 0, "#fb7185"));
    }), Lt.visible = true, v();
  }, window.__hekatanHideAxes = () => {
    Lt.visible = false, v();
  };
  const Nt = new tt();
  Nt.visible = false, p.add(Nt);
  let Ht = [];
  window.__hekatanShowRefPlanes = (n = [0, 3, 6, 9, 12], o = 20, a = 0, t = 0) => {
    var _a2, _b;
    for (; Nt.children.length; ) {
      const i = Nt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    Ht.forEach((i) => {
      p.remove(i), i.geometry.dispose(), i.material.dispose();
    }), Ht = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    n.forEach((i, r) => {
      const f = s[r % s.length], y = o / 2, g = [new S(a - y, t - y, i), new S(a + y, t - y, i), new S(a + y, t + y, i), new S(a - y, t + y, i), new S(a - y, t - y, i)], b = new Pe().setFromPoints(g), u = new ht({ color: f, transparent: true, opacity: 0.55 });
      Nt.add(new Ft(b, u));
      const M = document.createElement("canvas");
      M.width = 128, M.height = 32;
      const R = M.getContext("2d");
      R.fillStyle = `#${f.toString(16).padStart(6, "0")}`, R.font = "bold 18px sans-serif", R.fillText(`Z = ${i} m`, 4, 22);
      const te = new Uo(M), k = new Zo({ map: te, transparent: true }), C = new qo(k);
      C.position.set(a - y - 1.5, t - y - 1.5, i), C.scale.set(2.5, 0.6, 1), Nt.add(C);
      const w = new Qt(1e4, 1e4), F = new it({ visible: false, side: Ct }), D = new Oe(w, F);
      D.position.set(0, 0, i), D.frustumCulled = false, D.userData = { refPlaneZ: i }, p.add(D), Ht.push(D);
    }), Nt.visible = true, v();
  }, window.__hekatanHideRefPlanes = () => {
    Nt.visible = false, Ht.forEach((n) => {
      n.visible = false;
    }), v();
  };
  const xn = new tt();
  xn.frustumCulled = false, p.add(xn);
  const ds = () => {
    var _a2, _b, _c, _d;
    for (; xn.children.length; ) {
      const a = xn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxLines, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const t = new Pe().setFromPoints([new S(a[0], a[1], a[2]), new S(a[3], a[4], a[5])]), s = new Sn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new Ft(t, s);
      i.computeLineDistances(), xn.add(i);
    }
  };
  q.derive(() => {
    const n = window.__hekatanDrawingAuxLines;
    (n == null ? void 0 : n.val) && (n.val, ds(), v());
  });
  const cn = new tt();
  cn.frustumCulled = false, p.add(cn);
  const So = () => {
    var _a2, _b, _c, _d;
    for (; cn.children.length; ) {
      const a = cn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxPoints, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const t = new Oe(new hn(0.025, 12, 12), new it({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      t.position.set(a[0], a[1], a[2]), t.renderOrder = 996, t.scale.setScalar(gt(t.position)), cn.add(t);
    }
  };
  q.derive(() => {
    const n = window.__hekatanDrawingAuxPoints;
    (n == null ? void 0 : n.val) !== void 0 && (n.val, So(), v());
  }), c.addEventListener("change", () => {
    cn.children.forEach((n) => {
      n.scale.setScalar(gt(n.position));
    });
  }), window.__hekatanRenderAuxPoints = So;
  const vt = new tt(), ps = new Oe(new hn(0.01, 12, 12), new it({ color: 16724804, transparent: true, opacity: 0.95 })), us = new Oe(new hn(0.015, 12, 12), new it({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  vt.add(ps, us);
  const dn = 0.08, Wn = (n, o, a) => {
    const t = new Pe().setFromPoints([new S(...n), new S(...o)]);
    return new Ft(t, new ht({ color: a, transparent: true, opacity: 0.7 }));
  };
  vt.add(Wn([-dn, 0, 0], [dn, 0, 0], 16711680)), vt.add(Wn([0, -dn, 0], [0, dn, 0], 65280)), vt.add(Wn([0, 0, -dn], [0, 0, dn], 35071)), vt.visible = false, vt.frustumCulled = false, p.add(vt);
  let Jn = 2;
  const En = (n) => {
    const o = h(), a = (x == null ? void 0 : x.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(n) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, gn = () => {
    if (!vt.visible) return;
    const n = Jn * En(vt.position) / 0.015;
    vt.scale.setScalar(Math.max(1e-4, Math.min(1e5, n)));
  };
  let On = 10;
  const Qn = (n) => Math.max(1e-4, On * En(n));
  window.__hekatanAperturaPx = (n) => (typeof n == "number" && n > 0 && (On = n), On), window.__hekatanUpdateSnapScale = gn, window.__hekatanSnapMarker = vt, window.__hekatanMetrosPorPixel = En, window.__hekatanSnapPx = (n) => (typeof n == "number" && n > 0 && (Jn = n, gn(), v()), Jn);
  const ko = () => {
    _t.children.length !== 0 && _t.children.forEach((n) => {
      if (!n.__isSelectionPt) return;
      const o = n;
      o.scale.setScalar(gt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = ko, c.addEventListener("change", () => {
    var _a2;
    gn(), nt.visible && Gt(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), ko();
  }), window.__hekatanShowSnap = (n, o, a) => {
    vt.position.set(n, o, a), vt.visible = true, gn(), v();
  }, window.__hekatanHideSnap = () => {
    vt.visible = false, v();
  }, x.addEventListener("pointermove", (n) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(z, o);
    const a = ie();
    if (a.length) {
      const t = a[0].point, s = Qn(t), i = (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, t.x, t.y, t.z, s);
      if (i) Fo(i.type, i.x, i.y, i.z), vt.position.set(i.x, i.y, i.z), vt.visible = true, t.set(i.x, i.y, i.z);
      else {
        $n();
        const b = window.__hekatanSnapEnabled !== false, u = window.__hekatanSnap2D ?? 0.5;
        b && u > 0 && (t.x = Math.round(t.x / u) * u, t.y = Math.round(t.y / u) * u, t.z = Math.round(t.z / u) * u), vt.position.copy(t), vt.visible = true;
      }
      gn();
      const r = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (r === "select" || !r) {
        const b = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = jt(t.x, t.y, t.z, b), M = en(t.x, t.y, t.z, b), R = tn(t.x, t.y, t.z, b);
        if (u >= 0) {
          const w = e.points.rawVal[u];
          nt.position.set(w[0], w[1], w[2]), nt.visible = true, Gt(), Ne.visible = false, ct = { kind: "pt", a: u };
        } else if (M) {
          const w = e.points.rawVal, F = e.polylines.rawVal[M.polyIdx], D = w[F[M.segIdx]], Z = w[F[M.segIdx + 1]];
          Ne.geometry.setFromPoints([new S(D[0], D[1], D[2]), new S(Z[0], Z[1], Z[2])]), Ne.visible = true, nt.visible = false, ct = ((_f = (_e = e.areas) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
        } else if (R >= 0) {
          const F = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[R];
          F && (Ne.geometry.setFromPoints([new S(F[0], F[1], F[2]), new S(F[3], F[4], F[5])]), Ne.visible = true, nt.visible = false, ct = { kind: "aux", a: R });
        } else Ne.visible = false, nt.visible = false, ct = null;
        oe.style.left = n.clientX + "px", oe.style.top = n.clientY + "px", oe.style.display = "block";
        let te = t;
        if ((ct == null ? void 0 : ct.kind) === "pt") {
          const w = e.points.rawVal[ct.a];
          w && (te = new S(w[0], w[1], w[2]));
        }
        const k = `X=${te.x.toFixed(2)} Y=${te.y.toFixed(2)} Z=${te.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [te.x, te.y, te.z], ct) {
          const w = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          oe.textContent = `${k}  \xB7  \u{1F5B1} Click \u2192 ${w[ct.kind]}`;
        } else oe.textContent = k;
        const C = document.getElementById("hk-coord-fixed");
        C && (C.textContent = k), pe.visible = false, pt.visible = false, v();
        return;
      }
      if (r === "delete" || r === "trim" || r === "extend" || r === "offset") {
        const b = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = en(t.x, t.y, t.z, b), M = tn(t.x, t.y, t.z, b);
        let R = false;
        if (M >= 0) if (!u) R = true;
        else {
          const w = window.__hekatanDrawingAuxLines, D = ((w == null ? void 0 : w.rawVal) ?? (w == null ? void 0 : w.val) ?? w ?? [])[M];
          Jt(t.x, t.y, t.z, D[0], D[1], D[2], D[3], D[4], D[5]) < u.dist && (R = true);
        }
        R ? (xt = M, qe = -1, We = -1, Gn(M)) : u ? (qe = u.polyIdx, We = u.segIdx, xt = -1, Hn(u.polyIdx, u.segIdx)) : (qe = -1, We = -1, xt = -1, ge.visible = false), pe.visible = false, pt.visible = false, B(), oe.style.left = n.clientX + "px", oe.style.top = n.clientY + "px", oe.style.display = "block";
        const te = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        let k = "";
        R ? k = `\u{1F5D1} l\xEDnea aux #${xt + 1}` : u ? k = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(u.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${u.polyIdx + 1}` : `\u{1F5D1} seg ${u.segIdx + 1} / poly #${u.polyIdx + 1}` : k = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", oe.textContent = `${te}  \xB7  ${k}`;
        const C = document.getElementById("hk-coord-fixed");
        C && (C.textContent = te), v();
        return;
      } else ge.visible = false, qe = -1, xt = -1;
      oe.style.left = n.clientX + "px", oe.style.top = n.clientY + "px", oe.style.display = "block";
      const f = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], y = f[f.length - 1] ?? [], g = e.points.rawVal ?? [];
      if (y.length > 0 && g[y[y.length - 1]]) {
        const b = y[y.length - 1], u = g[b];
        let M = lt;
        if (ut = null, !M && window.__hekatanAxisSnap !== false) {
          const ve = x.getBoundingClientRect(), Ze = n.clientX, Ye = n.clientY, st = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, at = new S(u[0], u[1], u[2]), kt = [["x", new S(1, 0, 0)], ["y", new S(0, 1, 0)], ["z", new S(0, 0, 1)]], dt = (je) => {
            const Je = je.clone().project(o);
            return { x: (Je.x * 0.5 + 0.5) * ve.width + ve.left, y: (-Je.y * 0.5 + 0.5) * ve.height + ve.top };
          };
          let _e2 = null;
          for (const [je, Je] of kt) {
            const be = dt(at.clone().addScaledVector(Je, -st)), Be = dt(at.clone().addScaledVector(Je, st)), et = Be.x - be.x, Et = Be.y - be.y, Ut = Ze - be.x, Xt = Ye - be.y, Wt = et * et + Et * Et || 1;
            let fn = (Ut * et + Xt * Et) / Wt;
            fn = Math.max(0, Math.min(1, fn));
            const _n2 = Math.hypot(Ze - (be.x + fn * et), Ye - (be.y + fn * Et));
            if (_e2 === null || _n2 < _e2.dpx) {
              const co = P.ray, Ro = at.clone().sub(co.origin), po = Je.dot(co.direction), Bo = Je.dot(Ro), Ss = co.direction.dot(Ro), Do = 1 - po * po, ks = Math.abs(Do) < 1e-6 ? -Bo : (po * Ss - Bo) / Do;
              _e2 = { axis: je, dpx: _n2, pt: at.clone().addScaledVector(Je, ks) };
            }
          }
          _e2 && _e2.dpx <= 12 && (t.copy(_e2.pt), M = _e2.axis, ut = _e2.pt.clone());
        }
        const R = !!window.__hekatanOrthoMode;
        if (!M && R) {
          const ve = Math.abs(t.x - u[0]), Ze = Math.abs(t.y - u[1]), Ye = Math.abs(t.z - u[2]), st = (_l = a[0]) == null ? void 0 : _l.object;
          let at = null;
          st === Ve ? at = "xy" : st === De ? at = "xz" : st === Xe && (at = "yz"), at === "xy" ? M = ve >= Ze ? "x" : "y" : at === "xz" ? M = ve >= Ye ? "x" : "z" : at === "yz" ? M = Ze >= Ye ? "y" : "z" : M = ve >= Ze && ve >= Ye ? "x" : Ze >= Ye ? "y" : "z";
        }
        const te = window.__hekatanPolarTrack !== false;
        if (!M && te) {
          const ve = t.x - u[0], Ze = t.y - u[1], Ye = t.z - u[2], st = Math.hypot(ve, Ze, Ye);
          if (st > 1e-3) {
            const kt = Math.tan(6 * Math.PI / 180) * st, dt = Math.hypot(Ze, Ye), _e2 = Math.hypot(ve, Ye), je = Math.hypot(ve, Ze), Je = [["x", dt], ["y", _e2], ["z", je]];
            Je.sort((be, Be) => be[1] - Be[1]), Je[0][1] <= kt && (M = Je[0][0]);
          }
        }
        if (M) {
          const ve = u[0], Ze = u[1], Ye = u[2];
          M === "x" ? t.set(t.x, Ze, Ye) : M === "y" ? t.set(ve, t.y, Ye) : t.set(ve, Ze, t.z);
          const st = !!lt, kt = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          rt.style.background = "rgba(15,23,42,0.92)", rt.style.color = kt, rt.style.border = `1.5px solid ${kt}`;
          const dt = (_m = a[0]) == null ? void 0 : _m.object;
          let _e2 = null;
          dt === Ve ? _e2 = "xy" : dt === De ? _e2 = "xz" : dt === Xe && (_e2 = "yz");
          const je = _e2 ? ` (plano ${_e2.toUpperCase()})` : "";
          rt.textContent = st ? `\u{1F512} LOCK ${M.toUpperCase()}${je}` : `\u22A5 ORTO ${M.toUpperCase()}${je}`, rt.style.left = n.clientX + 20 + "px", rt.style.top = n.clientY + 18 + "px", rt.style.transform = "none", rt.style.display = "block";
        } else lt || (rt.style.display = "none");
        const k = Math.hypot(t.x - u[0], t.y - u[1], t.z - u[2]), C = Math.atan2(t.y - u[1], t.x - u[0]) * 180 / Math.PI, w = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        oe.textContent = `${w} | \u0394L=${k.toFixed(2)}m ${C.toFixed(0)}\xB0`;
        const F = document.getElementById("hk-coord-fixed");
        F && (F.textContent = w), pe.geometry.setFromPoints([new S(u[0], u[1], u[2]), new S(t.x, t.y, t.z)]), (_n = pe.computeLineDistances) == null ? void 0 : _n.call(pe), pe.visible = true, N(u[0], u[1], u[2], t.x, t.y, t.z);
        const D = window.__hekatanOrthoExt ?? 8, Z = window.__hekatanShowOrthoPlanes !== false;
        Ce.visible = Z, Z || mt(null), Z && (He(ce, u, "xy", D), He(ye, u, "xz", D), He(me, u, "yz", D), Ge(Ve, u, "xy", D), Ge(De, u, "xz", D), Ge(Xe, u, "yz", D));
        const ue = Z ? P.intersectObjects([Ve, De, Xe], false) : [];
        let H = null;
        if (ue.length > 0) {
          const ve = ue[0].object;
          ve === Ve ? H = "xy" : ve === De ? H = "xz" : ve === Xe && (H = "yz");
        }
        mt(H), H && (Le.style.left = n.clientX + "px", Le.style.top = n.clientY + "px"), E.geometry.setFromPoints([new S(u[0] - D, u[1], u[2]), new S(u[0] + D, u[1], u[2])]), (_o2 = E.computeLineDistances) == null ? void 0 : _o2.call(E), K.geometry.setFromPoints([new S(u[0], u[1] - D, u[2]), new S(u[0], u[1] + D, u[2])]), (_p = K.computeLineDistances) == null ? void 0 : _p.call(K), Y.geometry.setFromPoints([new S(u[0], u[1], u[2] - D), new S(u[0], u[1], u[2] + D)]), (_q = Y.computeLineDistances) == null ? void 0 : _q.call(Y), pt.visible = true;
        const O = E.material, Ee = K.material, ze = Y.material;
        M === "x" ? (O.opacity = 0.95, Ee.opacity = 0.1, ze.opacity = 0.1) : M === "y" ? (O.opacity = 0.1, Ee.opacity = 0.95, ze.opacity = 0.1) : M === "z" ? (O.opacity = 0.1, Ee.opacity = 0.1, ze.opacity = 0.95) : (O.opacity = 0.5, Ee.opacity = 0.5, ze.opacity = 0.5);
      } else {
        const b = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        oe.textContent = b;
        const u = document.getElementById("hk-coord-fixed");
        if (u && (u.textContent = b), pe.visible = false, pt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(r)) {
          if (I = null, U = null, X.style.left = n.clientX + 20 + "px", X.style.top = n.clientY - 28 + "px", X.style.display = "block", !V) {
            X.value = `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}`;
            const R = document.activeElement;
            !(R && (R.tagName === "INPUT" || R.tagName === "TEXTAREA") && R !== X) && document.activeElement !== X && X.focus({ preventScroll: true });
            try {
              X.select();
            } catch {
            }
          }
        } else B();
      }
      v();
    } else $n(), oe.style.display = "none", vt.visible = false, pe.visible = false, pt.visible = false, B(), v();
  }), q.derive(() => {
    if (!e.gridTarget) return;
    fa(l, { position: new S(...e.gridTarget.val.position), quaternion: new ho().setFromEuler(new kn(...e.gridTarget.val.rotation)) }, v), ee.position.set(...e.gridTarget.val.position), ee.quaternion.setFromEuler(new kn(...e.gridTarget.val.rotation)), ee.updateMatrixWorld();
    const n = new S(0, 0, 1).applyEuler(new kn(...e.gridTarget.val.rotation));
    A = !(Math.abs(n.x) > 0.999 || Math.abs(n.y) > 0.999 || Math.abs(n.z) > 0.999);
  }), q.derive(() => {
    W.geometry.setAttribute("position", new bt(e.points.val.flat(), 3)), W.geometry.computeBoundingSphere();
  }), q.derive(() => {
    const n = 0.05 * m * 0.5 * d.val;
    P.params.Points.threshold = 0.4 * n;
  }), q.derive(() => {
    var _a2;
    const n = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], t = [];
    for (const i of a) {
      const [r, f, y] = n[i];
      t.push(r, f, y);
    }
    const s = new Pe();
    s.setAttribute("position", new bt(t, 3)), Me.geometry.dispose(), Me.geometry = s;
  });
  let jn = false, nn = 0;
  x.addEventListener("pointerdown", () => {
    jn = true;
  }), x.addEventListener("pointerup", () => {
    jn = false;
  }), x.addEventListener("pointermove", () => {
    jn && nn++;
  });
  const At = document.createElement("div");
  At.id = "hk-window-select", At.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(At);
  let Yt = null, vn = false, It = null;
  const eo = (n, o, a, t, s) => {
    s ? (At.style.borderColor = "#34d399", At.style.borderStyle = "dashed", At.style.background = "rgba(52, 211, 153, 0.10)") : (At.style.borderColor = "#22d3ee", At.style.borderStyle = "solid", At.style.background = "rgba(34, 211, 238, 0.10)"), At.style.left = Math.min(n, a) + "px", At.style.top = Math.min(o, t) + "px", At.style.width = Math.abs(a - n) + "px", At.style.height = Math.abs(t - o) + "px", At.style.display = "block";
  }, Po = (n, o, a, t, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(n, a), r = Math.max(n, a), f = Math.min(o, t), y = Math.max(o, t), g = a < n, b = x.getBoundingClientRect(), u = h();
    u.updateMatrixWorld();
    const M = (H) => {
      const O = new S(H[0], H[1], H[2]);
      return O.project(u), { x: b.left + (O.x * 0.5 + 0.5) * b.width, y: b.top + (-O.y * 0.5 + 0.5) * b.height };
    }, R = (H) => H.x >= i && H.x <= r && H.y >= f && H.y <= y, te = (H, O) => !(H.x < i && O.x < i || H.x > r && O.x > r || H.y < f && O.y < f || H.y > y && O.y > y);
    s || fe.clear();
    let k = 0;
    const C = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let H = 0; H < C.length; H++) {
      const O = C[H];
      O && R(M(O)) && (fe.add(`pt:${H}`), k++);
    }
    const w = (H, O) => g ? R(H) || R(O) || te(H, O) : R(H) && R(O), F = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], D = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let H = 0; H < F.length; H++) {
      const O = F[H];
      if (D.includes(H)) {
        let ze;
        if (!g) ze = O.every((ve) => {
          const Ze = C[ve];
          return !!Ze && R(M(Ze));
        });
        else {
          ze = false;
          for (let ve = 0; ve < O.length - 1; ve++) {
            const Ze = C[O[ve]], Ye = C[O[ve + 1]];
            if (!(!Ze || !Ye) && w(M(Ze), M(Ye))) {
              ze = true;
              break;
            }
          }
        }
        ze && (fe.add(`poly:${H}`), k++);
      } else for (let ze = 0; ze < O.length - 1; ze++) {
        const ve = C[O[ze]], Ze = C[O[ze + 1]];
        !ve || !Ze || w(M(ve), M(Ze)) && (fe.add(`seg:${H}:${ze}`), k++);
      }
    }
    const ue = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let H = 0; H < ue.length; H++) {
      const O = ue[H];
      if (!O || O.length !== 6) continue;
      const Ee = M([O[0], O[1], O[2]]), ze = M([O[3], O[4], O[5]]);
      w(Ee, ze) && (fe.add(`aux:${H}`), k++);
    }
    Vt(), ne(`${g ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${k} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${fe.size})`), At.style.display = "none";
  }, Tn = () => {
    It && (It = null, At.style.display = "none", ne("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Tn, window.addEventListener("keydown", (n) => {
    n.key === "Escape" && It && Tn();
  });
  const Co = () => {
    var _a2, _b, _c, _d;
    if (fe.size === 0) return false;
    const n = [...fe], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], r = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
    for (const te of n) {
      const [k, ...C] = te.split(":");
      if (k === "pt") r.add(+C[0]);
      else if (k === "poly") f.add(+C[0]);
      else if (k === "seg") {
        const w = +C[0], F = +C[1];
        y.has(w) || y.set(w, /* @__PURE__ */ new Set()), y.get(w).add(F);
      } else k === "aux" && g.add(+C[0]);
    }
    let b = 0, u = [], M = [];
    const R = /* @__PURE__ */ new Map();
    for (let te = 0; te < a.length; te++) {
      if (f.has(te)) {
        b++;
        continue;
      }
      R.set(te, u.length);
      const k = y.get(te);
      if (k && k.size > 0) {
        let C = [];
        for (let w = 0; w < a[te].length; w++) C.push(a[te][w]), w < a[te].length - 1 && k.has(w) && (C.length >= 2 && u.push(C), C = [], b++);
        (C.length >= 2 || C.length === 1) && u.push(C);
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
      const C = [];
      for (const w of u) {
        let F = [];
        for (const D of w) {
          const Z = k.get(D);
          Z === void 0 ? (F.length >= 2 && C.push(F), F = []) : F.push(Z);
        }
        F.length >= 2 && C.push(F);
      }
      u = C, e.points.val = te;
    }
    for (const te of t) {
      const k = R.get(te);
      k !== void 0 && k < u.length && M.push(k);
    }
    if (e.polylines && (e.polylines.val = u), e.areas && (e.areas.val = M), g.size > 0 && s) {
      const te = i.filter((k, C) => !g.has(C));
      "val" in s ? s.val = te : window.__hekatanDrawingAuxLines = te, b += g.size;
    }
    fe.clear(), Vt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ne(`\u{1F5D1} ${b} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Co, window.addEventListener("keydown", (n) => {
    if (n.key !== "Delete" && n.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || fe.size !== 0 && (n.preventDefault(), Co());
  });
  const $t = document.createElement("div");
  $t.id = "hk-properties-pane";
  const zo = "hk-props-pane-pos";
  let Mn = null;
  try {
    const n = localStorage.getItem(zo);
    n && (Mn = JSON.parse(n));
  } catch {
  }
  $t.style.cssText = ["position:fixed", Mn ? `left:${Mn.left}px` : "left:14px", Mn ? `top:${Mn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild($t);
  const fs = () => {
    const n = $t.querySelector(".tp-rotv_b");
    if (!n || n.__hkDragWired) return;
    n.__hkDragWired = true, n.style.cursor = "move", n.style.userSelect = "none";
    let o = false, a = 0, t = 0, s = 0, i = 0;
    n.addEventListener("mousedown", (r) => {
      o = true, a = r.clientX, t = r.clientY;
      const f = $t.getBoundingClientRect();
      s = f.left, i = f.top, $t.style.transform = "none", $t.style.left = `${s}px`, $t.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const f = r.clientX - a, y = r.clientY - t, g = Math.max(0, Math.min(window.innerWidth - 80, s + f)), b = Math.max(0, Math.min(window.innerHeight - 40, i + y));
      $t.style.left = `${g}px`, $t.style.top = `${b}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(zo, JSON.stringify({ left: parseFloat($t.style.left), top: parseFloat($t.style.top) }));
        } catch {
        }
      }
    });
  }, J = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, zt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let ot = null;
  const Mt = (n, o, a, t) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: n, ids: o, prop: a, value: t } }));
  }, hs = () => {
    if (ot && (ot.dispose(), ot = null), fe.size === 0) {
      $t.style.display = "none";
      return;
    }
    const n = [...fe], o = n.filter((u) => u.startsWith("pt:")), a = n.filter((u) => u.startsWith("seg:")), t = n.filter((u) => u.startsWith("poly:")), s = n.filter((u) => u.startsWith("aux:")), i = o.length > 0, r = a.length > 0, f = t.length > 0, y = !i && !r && !f, g = [];
    o.length && g.push(`\u{1F535} ${o.length} nodo(s)`), a.length && g.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && g.push(`\u25AD ${t.length} \xE1rea(s)`), s.length && g.push(`\u250A ${s.length} aux`);
    const b = `\u{1F3AF} ${fe.size} item(s) \u2014 ${g.join(", ")}`;
    ot = new ss({ container: $t, title: b });
    {
      const u = ot.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      u.addBinding(zt, "dx", { label: "\u0394x (m)", step: 0.1 }), u.addBinding(zt, "dy", { label: "\u0394y (m)", step: 0.1 }), u.addBinding(zt, "dz", { label: "\u0394z (m)", step: 0.1 }), u.addBinding(zt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), u.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const R = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, zt.copias);
        ne(R ? `\u29C9 Replicado \xD7${R} (\u0394 ${zt.dx},${zt.dy},${zt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), u.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const R = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, 1);
        ne(R ? `\u2192 Copia desplazada \u0394 ${zt.dx},${zt.dy},${zt.dz} m` : "\u26A0 Nada seleccionado");
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
      const u = ot.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      u.addBinding(J, "Ux"), u.addBinding(J, "Uy"), u.addBinding(J, "Uz"), u.addBinding(J, "Rx"), u.addBinding(J, "Ry"), u.addBinding(J, "Rz");
      const M = ot.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      M.addBinding(J, "Kx", { label: "Kx", min: 0, step: 100 }), M.addBinding(J, "Ky", { label: "Ky", min: 0, step: 100 }), M.addBinding(J, "Kz", { label: "Kz", min: 0, step: 100 }), M.addBinding(J, "Krx", { label: "Krx", min: 0, step: 1e3 }), M.addBinding(J, "Kry", { label: "Kry", min: 0, step: 1e3 }), M.addBinding(J, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const R = ot.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      R.addBinding(J, "Fx", { step: 0.1 }), R.addBinding(J, "Fy", { step: 0.1 }), R.addBinding(J, "Fz", { step: 0.1 }), R.addBinding(J, "Mx", { step: 0.1 }), R.addBinding(J, "My", { step: 0.1 }), R.addBinding(J, "Mz", { step: 0.1 }), ot.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(J, "mass", { label: "m", min: 0, step: 1 }), ot.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(J, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ot.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let C = 0;
        const w = [J.Ux, J.Uy, J.Uz, J.Rx, J.Ry, J.Rz];
        w.some((Z) => Z) && (Mt("nodes", o, "supports", w), C++);
        const F = [J.Fx, J.Fy, J.Fz, J.Mx, J.My, J.Mz];
        F.some((Z) => Z !== 0) && (Mt("nodes", o, "loads", F), C++);
        const D = [J.Kx, J.Ky, J.Kz, J.Krx, J.Kry, J.Krz];
        if (D.some((Z) => Z !== 0) && (Mt("nodes", o, "springs", D), C++), J.mass !== 0 && (Mt("nodes", o, "mass", J.mass), C++), J.diaphragm !== "Ninguno" && (Mt("nodes", o, "diaphragm", J.diaphragm), C++), C === 0) {
          ne("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let Z = document.getElementById("hk-prop-toast");
          Z || (Z = document.createElement("div"), Z.id = "hk-prop-toast", Z.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(Z)), Z.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", Z.style.background = "rgba(217,119,6,0.97)", Z.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            Z && (Z.style.opacity = "0");
          }, 3200);
        } else ne(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const u = ot.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      u.addBinding(J, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), u.addBinding(J, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const M = ot.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      M.addBinding(J, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), M.addBinding(J, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), M.addBinding(J, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), M.addBinding(J, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ot.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(J, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ot.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(J, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const k = ot.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      k.addBinding(J, "relMxI", { label: "Mx I" }), k.addBinding(J, "relMyI", { label: "My I" }), k.addBinding(J, "relMzI", { label: "Mz I" });
      const C = ot.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      C.addBinding(J, "relMxJ", { label: "Mx J" }), C.addBinding(J, "relMyJ", { label: "My J" }), C.addBinding(J, "relMzJ", { label: "Mz J" }), ot.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(J, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const F = ot.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      F.addBinding(J, "LKx", { label: "LKx", min: 0, step: 100 }), F.addBinding(J, "LKy", { label: "LKy", min: 0, step: 100 }), F.addBinding(J, "LKz", { label: "LKz", min: 0, step: 100 });
      const D = ot.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      D.addBinding(J, "qx", { step: 0.1 }), D.addBinding(J, "qy", { step: 0.1 }), D.addBinding(J, "qz", { step: 0.1 }), ot.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(J, "massPerM", { label: "m/L", min: 0, step: 1 }), ot.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Mt("segs", a, "section", J.section), Mt("segs", a, "material", J.material_frame);
        const ue = { A: J.A_mod, Iz: J.Iz_mod, Iy: J.Iy_mod, J: J.J_mod };
        (ue.A !== 1 || ue.Iz !== 1 || ue.Iy !== 1 || ue.J !== 1) && Mt("segs", a, "modifiers", ue), J.insertionPoint !== "10 \u2014 Centroid" && Mt("segs", a, "insertionPoint", J.insertionPoint), J.beta !== 0 && Mt("segs", a, "beta", J.beta);
        const H = [J.relMxI, J.relMyI, J.relMzI], O = [J.relMxJ, J.relMyJ, J.relMzJ];
        (H.some((ve) => ve) || O.some((ve) => ve)) && Mt("segs", a, "releases", { i: H, j: O }), J.hinges !== "None" && Mt("segs", a, "hinges", J.hinges);
        const Ee = [J.LKx, J.LKy, J.LKz];
        Ee.some((ve) => ve !== 0) && Mt("segs", a, "lineSprings", Ee);
        const ze = [J.qx, J.qy, J.qz];
        ze.some((ve) => ve !== 0) && Mt("segs", a, "distLoad", ze), J.massPerM !== 0 && Mt("segs", a, "massPerM", J.massPerM), ne(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (f) {
      const u = ot.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      u.addBinding(J, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), u.addBinding(J, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), u.addBinding(J, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ot.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(J, "surfLoad", { label: "q", step: 0.1 }), ot.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Mt("areas", t, "shellType", J.shellType), Mt("areas", t, "thickness", J.thickness), Mt("areas", t, "material", J.material_shell), J.surfLoad !== 0 && Mt("areas", t, "surfLoad", J.surfLoad), ne(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (y) {
      const u = ot.addFolder({ title: "\u2139 Selecci\xF3n" }), M = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      u.addBinding(M, "msg", { readonly: true, label: "" });
    }
    ot.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      fe.clear(), Vt();
    }), $t.style.display = "block", fs();
  };
  window.__hekatanRefreshPropsPane = hs;
  let pn = null, Vn = false;
  x.addEventListener("pointerdown", (n) => {
    n.button === 2 && (pn = { x: n.clientX, y: n.clientY }, Vn = false);
  }), x.addEventListener("pointermove", (n) => {
    if (pn && n.buttons & 2 && !Vn) {
      const o = n.clientX - pn.x, a = n.clientY - pn.y;
      Math.hypot(o, a) > 8 && (Vn = true);
    }
  }), x.addEventListener("pointerup", (n) => {
    var _a2, _b, _c;
    if (n.button === 2) {
      const o = pn !== null && !Vn;
      pn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (It ? Tn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), fe.size > 0 && (fe.clear(), Vt()), e.polylines) {
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
    if (It && n.buttons === 0) {
      const i = n.clientX < It.x;
      eo(It.x, It.y, n.clientX, n.clientY, i);
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
  const Dt = new tt();
  Dt.visible = false, Dt.frustumCulled = false, p.add(Dt);
  const ms = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496 }, Fo = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    for (; Dt.children.length; ) {
      const r = Dt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = ms[n] ?? 16777215, i = new Pe().setFromPoints([new S(-1, -1, 0), new S(1, -1, 0), new S(1, -1, 0), new S(1, 1, 0), new S(1, 1, 0), new S(-1, 1, 0), new S(-1, 1, 0), new S(-1, -1, 0)]);
    Dt.add(new Kt(i, new ht({ color: s, linewidth: 2 }))), Dt.position.set(o, a, t), Dt.visible = true, no();
  };
  let to = 4;
  const no = () => {
    Dt.visible && Dt.scale.setScalar(to * En(Dt.position));
  };
  window.__hekatanOsnapMarkerRef = Dt, window.__hekatanUpdateOsnapScale = no, window.__hekatanOsnapPx = (n) => (typeof n == "number" && n > 0 && (to = n, no(), v()), to);
  const $n = () => {
    Dt.visible = false;
  }, ws = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    const s = window.__hekatanOsnap, i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let f = null;
    const y = { end: 0, node: 0, int: 1, mid: 2, cen: 3, per: 4, nea: 5 }, g = (k, C, w, F) => {
      const D = Math.hypot(C - n, w - o, F - a);
      if (D > t) return;
      const Z = y[k] ?? 9;
      (!f || Z < f.r || Z === f.r && D < f.d) && (f = { type: k, x: C, y: w, z: F, d: D, r: Z });
    };
    (s.node || s.end) && i.forEach((k) => {
      s.node && g("node", k[0], k[1], k[2]);
    });
    for (const k of r) if (!(k.length < 2)) for (let C = 0; C < k.length - 1; C++) {
      const w = i[k[C]], F = i[k[C + 1]];
      if (!(!w || !F) && (s.end && (g("end", w[0], w[1], w[2]), g("end", F[0], F[1], F[2])), s.mid && g("mid", (w[0] + F[0]) / 2, (w[1] + F[1]) / 2, (w[2] + F[2]) / 2), s.nea || s.per)) {
        const D = F[0] - w[0], Z = F[1] - w[1], ue = F[2] - w[2], H = D * D + Z * Z + ue * ue;
        if (H < 1e-12) continue;
        const O = Math.max(0, Math.min(1, ((n - w[0]) * D + (o - w[1]) * Z + (a - w[2]) * ue) / H)), Ee = w[0] + O * D, ze = w[1] + O * Z, ve = w[2] + O * ue;
        s.nea && g("nea", Ee, ze, ve), s.per && g("per", Ee, ze, ve);
      }
    }
    if (s.cen) {
      const k = wn(), C = [...rn];
      for (const w of k) C.some((F) => Math.hypot(F.c[0] - w.c[0], F.c[1] - w.c[1], F.c[2] - w.c[2]) < 1e-6 && Math.abs(F.r - w.r) < 1e-6) || C.push(w);
      for (const w of C) {
        if (!i.some((Z) => Math.abs(Math.hypot(Z[0] - w.c[0], Z[1] - w.c[1], Z[2] - w.c[2]) - w.r) < 1e-6)) continue;
        const D = Math.hypot(n - w.c[0], o - w.c[1], a - w.c[2]);
        if (D < t || Math.abs(D - w.r) < t) {
          const Z = Math.min(D, t * 0.5), ue = 3;
          (!f || ue < f.r || ue === f.r && Z < f.d) && (f = { type: "cen", x: w.c[0], y: w.c[1], z: w.c[2], d: Z, r: ue });
        }
      }
    }
    if (s.int) {
      const k = [];
      for (const C of r) for (let w = 0; w < C.length - 1; w++) {
        const F = i[C[w]], D = i[C[w + 1]];
        if (!F || !D) continue;
        const Z = D[0] - F[0], ue = D[1] - F[1], H = D[2] - F[2], O = Z * Z + ue * ue + H * H;
        if (O < 1e-12) continue;
        const Ee = Math.max(0, Math.min(1, ((n - F[0]) * Z + (o - F[1]) * ue + (a - F[2]) * H) / O));
        Math.hypot(F[0] + Ee * Z - n, F[1] + Ee * ue - o, F[2] + Ee * H - a) < 3 * t && k.push([F, D]);
      }
      for (let C = 0; C < k.length; C++) for (let w = C + 1; w < k.length; w++) {
        const [F, D] = k[C], [Z, ue] = k[w], H = [D[0] - F[0], D[1] - F[1], D[2] - F[2]], O = [ue[0] - Z[0], ue[1] - Z[1], ue[2] - Z[2]], Ee = [F[0] - Z[0], F[1] - Z[1], F[2] - Z[2]], ze = H[0] * H[0] + H[1] * H[1] + H[2] * H[2], ve = H[0] * O[0] + H[1] * O[1] + H[2] * O[2], Ze = O[0] * O[0] + O[1] * O[1] + O[2] * O[2], Ye = H[0] * Ee[0] + H[1] * Ee[1] + H[2] * Ee[2], st = O[0] * Ee[0] + O[1] * Ee[1] + O[2] * Ee[2], at = ze * Ze - ve * ve;
        if (at < 1e-12) continue;
        const kt = (ve * st - Ze * Ye) / at, dt = (ze * st - ve * Ye) / at;
        if (kt < -1e-6 || kt > 1 + 1e-6 || dt < -1e-6 || dt > 1 + 1e-6) continue;
        const _e = [F[0] + kt * H[0], F[1] + kt * H[1], F[2] + kt * H[2]], je = [Z[0] + dt * O[0], Z[1] + dt * O[1], Z[2] + dt * O[2]];
        if (Math.hypot(_e[0] - je[0], _e[1] - je[1], _e[2] - je[2]) > 1e-4) continue;
        [F, D, Z, ue].some((be) => Math.hypot(be[0] - _e[0], be[1] - _e[1], be[2] - _e[2]) < 1e-6) || g("int", _e[0], _e[1], _e[2]);
      }
    }
    const b = window.__hekatanAxisGrids ?? [], u = window.__hekatanLevels ?? [], M = b.filter((k) => k && k.start && k.end).map((k) => [k.start, k.end]);
    for (const [k, C] of M) {
      s.end && (g("end", k[0], k[1], k[2]), g("end", C[0], C[1], C[2]));
      const w = C[0] - k[0], F = C[1] - k[1], D = C[2] - k[2], Z = w * w + F * F + D * D;
      if (Z < 1e-12) continue;
      const ue = Math.max(0, Math.min(1, ((n - k[0]) * w + (o - k[1]) * F + (a - k[2]) * D) / Z));
      if (s.nea && g("nea", k[0] + ue * w, k[1] + ue * F, k[2] + ue * D), s.int && Math.abs(D) > 1e-9) for (const H of u) {
        const O = (H.z - k[2]) / D;
        O < -1e-6 || O > 1 + 1e-6 || g("int", k[0] + O * w, k[1] + O * F, H.z);
      }
    }
    if (s.int || s.node) for (let k = 0; k < M.length; k++) for (let C = k + 1; C < M.length; C++) {
      const [w, F] = M[k], [D, Z] = M[C], ue = F[0] - w[0], H = F[1] - w[1], O = Z[0] - D[0], Ee = Z[1] - D[1], ze = ue * Ee - H * O;
      if (Math.abs(ze) < 1e-12) continue;
      const ve = w[0] - D[0], Ze = w[1] - D[1], Ye = (O * Ze - Ee * ve) / ze, st = (ue * Ze - H * ve) / ze;
      if (Ye < -1e-6 || Ye > 1 + 1e-6 || st < -1e-6 || st > 1 + 1e-6) continue;
      const at = (_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workZ;
      g("int", w[0] + Ye * ue, w[1] + Ye * H, typeof at == "number" ? at : a);
    }
    const R = window.__hekatanDrawingAuxLines, te = (R == null ? void 0 : R.rawVal) ?? (R == null ? void 0 : R.val) ?? R ?? [];
    for (const k of te) {
      if (k.length !== 6) continue;
      const C = [k[0], k[1], k[2]], w = [k[3], k[4], k[5]];
      if (s.end && (g("end", C[0], C[1], C[2]), g("end", w[0], w[1], w[2])), s.mid && g("mid", (C[0] + w[0]) / 2, (C[1] + w[1]) / 2, (C[2] + w[2]) / 2), s.nea || s.per) {
        const F = w[0] - C[0], D = w[1] - C[1], Z = w[2] - C[2], ue = F * F + D * D + Z * Z;
        if (ue < 1e-12) continue;
        const H = Math.max(0, Math.min(1, ((n - C[0]) * F + (o - C[1]) * D + (a - C[2]) * Z) / ue)), O = C[0] + H * F, Ee = C[1] + H * D, ze = C[2] + H * Z;
        s.nea && g("nea", O, Ee, ze), s.per && g("per", O, Ee, ze);
      }
    }
    return f ? { type: f.type, x: f.x, y: f.y, z: f.z } : null;
  };
  window.__hekatanOsnapCompute = ws, window.__hekatanOsnapShow = Fo, window.__hekatanOsnapHide = $n;
  let Te = [], wt = 0, on = 0, St = null;
  const bn = document.createElement("div");
  bn.id = "hk-cad-status", bn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", bn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(bn);
  const ys = () => {
    var _a2, _b, _c;
    const n = [];
    window.__hekatanOrthoMode && n.push("\u22A5 ORTO ON (F8)"), lt && n.push(`\u{1F512} LOCK ${lt.toUpperCase()}`);
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
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${we.length + 1} (Enter o clic derecho cierra y malla):`);
      case "rect":
        return s(t ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(t ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(t === 0 ? "ARCO Precise punto inicial:" : t === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${wt > 0 ? wt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(t ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${wt > 0 ? wt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${t + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(St ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(St ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(St ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${on > 0 ? ` (distancia ${on} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return fe.size ? s(t ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return fe.size ? s(t ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return fe.size ? s(`SELECCI\xD3N ${fe.size} objeto${fe.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(xs);
    }
  }, Rt = () => {
    var _a2;
    try {
      const n = gs();
      (_a2 = window.__hekatanCadPrompt) == null ? void 0 : _a2.call(window, n.txt, n.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Rt, window.__hekatanRefreshStatus = () => {
    const n = window.__hekatanCadStatusText ?? "", o = n.split("   |   ")[0] ?? n;
    ne(o);
  }, window.__hekatanCadResetPending = () => {
    Te = [], we = [], G.visible = false, oo(), St = null, v(), ne("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Rt();
  };
  function oo() {
    if (!e.polylines) return;
    const n = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...n, []];
  }
  window.__hekatanCerrarPolilinea = oo;
  const un = [], Ln = [], so = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, Ao = (n) => {
    var _a2;
    e.points.val = n.p, e.polylines && (e.polylines.val = n.l), e.areas && (e.areas.val = n.a), Te = [], pe.visible = false, pt.visible = false, B();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    v(), Rt();
  }, Bt = () => {
    un.push(so()), un.length > 100 && un.shift(), Ln.length = 0;
  }, In = () => {
    const n = un.pop();
    if (!n) {
      ne("\u21B6 Nada para deshacer");
      return;
    }
    Ln.push(so()), Ao(n), ne(`\u21B6 Deshacer \u2014 quedan ${un.length}`);
  }, Eo = () => {
    const n = Ln.pop();
    if (!n) {
      ne("\u21B7 Nada para rehacer");
      return;
    }
    un.push(so()), Ao(n), ne(`\u21B7 Rehacer \u2014 quedan ${Ln.length}`);
  };
  window.__hekatanPushUndo = Bt, window.__hekatanUndo = In, window.__hekatanRedo = Eo, document.addEventListener("keydown", (n) => {
    var _a2;
    const o = n.key.toLowerCase();
    if (!((n.ctrlKey || n.metaKey) && (o === "y" || o === "z" && n.shiftKey))) return;
    const t = n.target;
    t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA") && t.type !== "checkbox" && t.type !== "range" && (((_a2 = t.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (n.preventDefault(), n.stopPropagation(), Eo());
  }, { capture: true }), window.__hekatanCadOption = (n) => {
    var _a2, _b, _c, _d, _e;
    const o = n.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const t = e.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (In(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ne("Cerrar necesita al menos tres puntos."), true;
      Bt(), e.polylines.val = [...t.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return ao(), ne(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return In(), true;
      Bt();
      const i = s[s.length - 1], r = s.slice(0, -1), f = t.some((b, u) => u !== t.length - 1 && b.includes(i)) || r.includes(i);
      let y = e.points.rawVal, g = [...t.slice(0, -1), r];
      if (!f && i === y.length - 1 && (y = y.slice(0, -1), e.points.val = y), e.polylines.val = g, r.length) {
        const b = y[r[r.length - 1]];
        b && (I = [b[0], b[1], b[2]]);
      } else I = null, pe.visible = false;
      try {
        (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
      } catch {
      }
      return v(), ne(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Rt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (n) => {
    var _a2;
    if ((n.ctrlKey || n.metaKey) && n.key.toLowerCase() === "z" && !n.shiftKey) {
      const o = n.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      n.preventDefault(), n.stopPropagation(), In();
    }
  }, { capture: true });
  const ao = () => {
    Te = [], St = null, oo(), lt = null, qt(), pe.visible = false, pt.visible = false, B(), ne("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), v(), Rt();
  };
  window.__hekatanFinalizeDraw = ao;
  const To = () => {
    var _a2, _b, _c;
    Te = [], we = [], G.visible = false;
    let n = false;
    fe.size && (fe.clear(), Vt(), n = true), ao();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ne(n ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), v(), Rt();
  };
  window.__hekatanEscapeCancel = To;
  const Vo = () => {
    var _a2;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return fe.forEach((a) => {
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
    Bt();
    const s = e.points.rawVal.map((i, r) => t.has(r) ? [i[0] + n, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Vt(), v(), t.size;
  };
  window.__hekatanMoveSelection = $o;
  const Lo = (n, o) => {
    var _a2, _b, _c, _d, _e;
    if (!fe.size) {
      ne(`${n === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Rt();
      return;
    }
    if (Te.push(o), Te.length === 1) {
      I = o, ne(`${n === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Rt();
      return;
    }
    const [a, t] = Te, s = [t[0] - a[0], t[1] - a[1], t[2] - a[2]];
    Te = [], pe.visible = false;
    let i = 0;
    n === "move" ? i = $o(s[0], s[1], s[2]) : (i = Vo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ne(`\u2713 ${n === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), n === "move" && (fe.clear(), Vt()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Rt();
  };
  window.__hekatanPasoMoverCopiar = Lo;
  const vs = () => {
    var _a2, _b, _c;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return n === "xz" ? [0, 1, 0] : n === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Ot = (n, o) => Math.hypot(n[0] - o[0], n[1] - o[1], n[2] - o[2]), io = (n, o, a, t, s, i) => {
    const r = [o[0] - n[0], o[1] - n[1], o[2] - n[2]], f = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], y = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], g = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], b = r[0] * f[0] + r[1] * f[1] + r[2] * f[2], u = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], M = r[0] * y[0] + r[1] * y[1] + r[2] * y[2], R = f[0] * y[0] + f[1] * y[1] + f[2] * y[2], te = g * u - b * b;
    if (te < 1e-12) return null;
    const k = (b * R - u * M) / te, C = (g * R - b * M) / te;
    if (!s && (k < -1e-6 || k > 1 + 1e-6) || !i && (C < -1e-6 || C > 1 + 1e-6)) return null;
    const w = [n[0] + k * r[0], n[1] + k * r[1], n[2] + k * r[2]], F = [a[0] + C * f[0], a[1] + C * f[1], a[2] + C * f[2]];
    return Ot(w, F) > 1e-4 ? null : w;
  }, Ms = (n) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((t) => t === n).length, 0);
  }, bs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, _s = (n, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, t = e.points.rawVal, s = bs[n];
    if (!St) {
      if (qe < 0) {
        ne(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      St = { poly: qe, seg: Math.max(0, We) }, ne(n === "offset" ? `DESFASE l\xEDnea #${St.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${on > 0 ? ` (${on} m)` : ""}.` : n === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Rt();
      return;
    }
    if (n === "offset") {
      const k = St.poly, C = a[k];
      if (!C || C.length < 2) {
        St = null, ne("DESFASE: esa polil\xEDnea no tiene tramos."), Rt();
        return;
      }
      const w = C.length > 2 && C[0] === C[C.length - 1], F = vs(), D = [];
      for (let _e = 0; _e < C.length - 1; _e++) {
        const je = t[C[_e]], Je = t[C[_e + 1]], be = [Je[0] - je[0], Je[1] - je[1], Je[2] - je[2]], Be = Math.hypot(be[0], be[1], be[2]) || 1, et = be[0] / Be, Et = be[1] / Be, Ut = be[2] / Be, Xt = [F[1] * Ut - F[2] * Et, F[2] * et - F[0] * Ut, F[0] * Et - F[1] * et], Wt = Math.hypot(Xt[0], Xt[1], Xt[2]) || 1;
        D.push({ a: je, b: Je, n: [Xt[0] / Wt, Xt[1] / Wt, Xt[2] / Wt] });
      }
      let Z = 0, ue = 1 / 0;
      D.forEach((_e, je) => {
        const Je = Jt(o[0], o[1], o[2], _e.a[0], _e.a[1], _e.a[2], _e.b[0], _e.b[1], _e.b[2]);
        Je < ue && (ue = Je, Z = je);
      });
      const H = D[Z], O = Math.sign((o[0] - H.a[0]) * H.n[0] + (o[1] - H.a[1]) * H.n[1] + (o[2] - H.a[2]) * H.n[2]) || 1, Ee = on > 0 ? on : ue;
      if (Ee < 1e-6) {
        ne("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const ze = D.map((_e) => ({ a: [_e.a[0] + O * Ee * _e.n[0], _e.a[1] + O * Ee * _e.n[1], _e.a[2] + O * Ee * _e.n[2]], b: [_e.b[0] + O * Ee * _e.n[0], _e.b[1] + O * Ee * _e.n[1], _e.b[2] + O * Ee * _e.n[2]] })), ve = ze.length, Ze = (_e) => {
        const je = ze[(_e - 1 + ve) % ve], Je = ze[_e % ve];
        return io(je.a, je.b, Je.a, Je.b, true, true) ?? Je.a;
      }, Ye = [], st = w ? ve : ve + 1;
      for (let _e = 0; _e < st; _e++) !w && _e === 0 ? Ye.push(ze[0].a) : !w && _e === ve ? Ye.push(ze[ve - 1].b) : Ye.push(Ze(_e));
      Bt();
      const at = t.length;
      e.points.val = [...t, ...Ye];
      const kt = Ye.map((_e, je) => at + je);
      w && kt.push(at);
      let dt = a.slice();
      dt.length && dt[dt.length - 1].length === 0 && (dt = dt.slice(0, -1)), e.polylines.val = [...dt, kt, []], St = null, ne(`\u2713 Desfase a ${Ee.toFixed(2)} m \u2014 ${ve} tramo${ve === 1 ? "" : "s"} nuevo${ve === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      v(), Rt();
      return;
    }
    let i = qe, r = Math.max(0, We);
    if (i < 0 || i === St.poly && r === St.seg) {
      let C = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((w, F) => {
        for (let D = 0; D < w.length - 1; D++) {
          if (F === St.poly && D === St.seg) continue;
          const Z = t[w[D]], ue = t[w[D + 1]];
          if (!Z || !ue) continue;
          const H = Jt(o[0], o[1], o[2], Z[0], Z[1], Z[2], ue[0], ue[1], ue[2]);
          H < C && (C = H, i = F, r = D);
        }
      }), i < 0) {
        ne(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const f = a[St.poly], y = t[f[St.seg]], g = t[f[St.seg + 1]], b = a[i], u = b[r], M = b[r + 1];
    if (!y || !g || u == null || M == null) {
      ne(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const R = t[u], te = t[M];
    if (n === "trim") {
      const k = io(R, te, y, g, false, false);
      if (!k) {
        ne("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Bt();
      const C = t.length;
      e.points.val = [...t, k];
      const w = [...b.slice(0, r + 1), C, ...b.slice(r + 1)];
      e.polylines.val = a.map((D, Z) => Z === i ? w : D);
      const F = Ot(o, R) < Ot(o, te);
      Fn(i, F ? r : r + 1), ne(`\u2713 Recortado en (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const k = io(R, te, y, g, true, false);
      if (!k) {
        ne("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const w = Ot(o, R) < Ot(o, te) ? r : r + 1;
      if (w !== 0 && w !== b.length - 1) {
        ne("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const F = b[w];
      if (Ot(k, R) + Ot(k, te) < Ot(R, te) + 1e-6) {
        ne("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Bt(), Ms(F) > 1) {
        const Z = t.length;
        e.points.val = [...t, k];
        const ue = b.slice();
        ue[w] = Z, e.polylines.val = a.map((H, O) => O === i ? ue : H);
      } else e.points.val = t.map((Z, ue) => ue === F ? k : Z);
      ne(`\u2713 Alargada hasta (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    v(), Rt();
  };
  window.__hekatanSelectionSize = () => fe.size, window.__hekatanSelectLast = () => {
    var _a2;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = n.length - 1;
    for (; o >= 0 && (!n[o] || n[o].length < 2); ) o--;
    return fe.clear(), o >= 0 && fe.add(`poly:${o}`), Vt(), ne(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), fe.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    fe.clear();
    const a = /* @__PURE__ */ new Set();
    return n.forEach((t, s) => {
      !t || t.length < 2 || (fe.add(`poly:${s}`), t.forEach((i) => a.add(i)));
    }), o.forEach((t, s) => {
      a.has(s) || fe.add(`pt:${s}`);
    }), Vt(), ne(`SELECCI\xD3N ${fe.size} objetos (todo el modelo) \xB7 Esc suelta`), fe.size;
  }, window.__hekatanReplicateSelection = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1));
    const s = [...fe], i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), y = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), b = [];
    if (s.forEach((k) => {
      if (k.startsWith("pt:")) y.add(+k.slice(3));
      else if (k.startsWith("poly:")) {
        const C = +k.slice(5);
        g.add(C), (r[C] || []).forEach((w) => y.add(w));
      } else if (k.startsWith("seg:")) {
        const C = k.split(":"), w = +C[1], F = +C[2], D = r[w] || [], Z = D[F], ue = D[F + 1];
        Z != null && ue != null && (b.push([Z, ue]), y.add(Z), y.add(ue));
      }
    }), !y.size) return 0;
    Bt();
    const u = [...i];
    let M = r.slice();
    M.length && M[M.length - 1].length === 0 && (M = M.slice(0, -1));
    const R = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], te = [...y];
    for (let k = 1; k <= t; k++) {
      const C = n * k, w = o * k, F = a * k, D = /* @__PURE__ */ new Map();
      te.forEach((Z) => {
        D.set(Z, u.length), u.push([i[Z][0] + C, i[Z][1] + w, i[Z][2] + F]);
      }), g.forEach((Z) => {
        const ue = r[Z].map((O) => D.has(O) ? D.get(O) : O), H = M.length;
        M.push(ue), f.has(Z) && R.push(H);
      }), b.forEach(([Z, ue]) => {
        M.push([D.get(Z), D.get(ue)]);
      });
    }
    M.push([]), e.points.val = u, e.polylines && (e.polylines.val = M), e.areas && (e.areas.val = R);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return v(), t;
  }, x.addEventListener("click", (n) => {
    var _a2, _b;
    if (nn > 5) {
      nn = 0;
      return;
    }
    nn = 0;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(z, o);
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
          let g = lt;
          if (!g && y) {
            const b = Math.abs(t.x - f[0]), u = Math.abs(t.y - f[1]), M = Math.abs(t.z - f[2]);
            g = b >= u && b >= M ? "x" : u >= M ? "y" : "z";
          }
          g === "x" ? t = new S(t.x, f[1], f[2]) : g === "y" ? t = new S(f[0], t.y, f[2]) : g === "z" && (t = new S(f[0], f[1], t.z));
        }
      }
    }
    if (ut) t = ut.clone(), ne(`\u{1F4D0} Eje \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
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
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (ct) {
        It && Tn();
        const { kind: t, a: s, b: i } = ct, r = i !== void 0 ? `${t}:${s}:${i}` : `${t}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || fe.clear(), fe.has(r) ? fe.delete(r) : fe.add(r), Vt(), ne(`\u2713 Seleccionados ${fe.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const t = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        It ? (Po(It.x, It.y, s, i, t), It = null) : t || (It = { x: s, y: i }, ne("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), eo(s, i, s + 1, i + 1, false));
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
      if (xt >= 0) {
        const t = window.__hekatanDrawingAuxLines, s = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [], i = xt;
        if (i >= 0 && i < s.length) {
          Bt();
          const r = s.slice(0, i).concat(s.slice(i + 1));
          t && typeof t == "object" && "val" in t ? t.val = r : window.__hekatanDrawingAuxLines = r, ne(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), xt = -1, ge.visible = false;
          try {
            (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
          } catch {
          }
        }
      } else if (qe >= 0) {
        const t = qe, s = We;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(t)) ?? false ? (ln(t), ne(`\u{1F5D1} \xC1rea #${t + 1} (shell Q4) borrada`)) : s >= 0 ? (Fn(t, s), ne(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${t + 1} borrado`)) : (ln(t), ne(`\u{1F5D1} Polil\xEDnea #${t + 1} borrada`));
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
      we.push([n.x, n.y, n.z]), G.geometry.setFromPoints(we.map((t) => new S(t[0], t[1], t[2]))), G.visible = we.length >= 1, ne(`\u25B0 \xC1rea libre \u2014 ${we.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), v();
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
      Bt();
      const t = n.z, s = wt && wt > 0 ? wt : 3;
      e.points.val = [...e.points.rawVal, [n.x, n.y, t], [n.x, n.y, t + s]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], wt = 0, ne(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
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
      const [t, s] = Te, i = wt && wt > 0 ? wt : 3;
      Bt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [t[0], t[1], t[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [t[0], t[1], t[2] + i]];
      const f = e.polylines.rawVal;
      if (f.length - 1, e.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const y = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, y];
      }
      ne(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Te = [], wt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Bt();
      const t = wt && wt > 0 ? wt : 3, s = n.z;
      e.points.val = [...e.points.rawVal, [n.x, n.y, s], [n.x, n.y, s + t]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], wt = 0, ne(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${t.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const t = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = en(n.x, n.y, n.z, t);
      if (!s) {
        ne("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, r = e.points.rawVal, f = i[s.polyIdx], y = r[f[s.segIdx]], g = r[f[s.segIdx + 1]];
      if (!y || !g) {
        ne("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const b = wt && wt > 0 ? wt : 3;
      Bt();
      const u = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [y[0], y[1], y[2]], [g[0], g[1], g[2]], [g[0], g[1], g[2] + b], [y[0], y[1], y[2] + b]];
      const M = e.polylines.rawVal;
      if (e.polylines.val = [...M.slice(0, -1), ...M[M.length - 1].length > 0 ? [M[M.length - 1]] : [], [u, u + 1, u + 2, u + 3, u], []], e.areas) {
        const R = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, R];
      }
      wt = 0, ne(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${b.toFixed(2)}m`);
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
    if (V = false, Bt(), e.points.val = [...e.points.rawVal, n.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
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
  x.addEventListener("click", () => Rt()), x.addEventListener("contextmenu", (n) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && we.length >= 3) {
      n.preventDefault();
      const a = yn();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), x.addEventListener("pointermove", (n) => {
    var _a2, _b;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(z, o);
    const a = ie();
    if (Se.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (n.ctrlKey || n.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = r[r.length - 1] ?? [], y = e.points.rawVal ?? [];
        if (f.length > 0) {
          const g = y[f[f.length - 1]];
          if (g) {
            const b = !!window.__hekatanOrthoMode;
            let u = lt;
            if (!u && b) {
              const M = Math.abs(t.x - g[0]), R = Math.abs(t.y - g[1]), te = Math.abs(t.z - g[2]);
              u = M >= R && M >= te ? "x" : R >= te ? "y" : "z";
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
      Se.geometry.setAttribute("position", new bt(t.toArray(), 3));
    }
    v();
  }), x.addEventListener("pointermove", (n) => {
    var _a2;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(z, o);
    let a = false;
    const t = P.intersectObject(W), s = ie();
    if (t.length && s.length) {
      const i = new S(...e.points.rawVal[t[0].index]), r = new S(...s[0].point), f = i.sub(r), y = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      y.transformDirection(ee.matrixWorld), Math.abs(f.dot(y)) < 1e-4 && (a = true);
    }
    Se.visible = !a;
  });
  let lo = false, ro;
  x.addEventListener("pointermove", (n) => {
    var _a2;
    if (!nn) return;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(z, o);
    let a = false;
    const t = P.intersectObject(W), s = ie();
    if (t.length && s.length) {
      const r = new S(...e.points.rawVal[t[0].index]), f = new S(...s[0].point), y = r.sub(f), g = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      g.transformDirection(ee.matrixWorld), Math.abs(y.dot(g)) < 1e-4 && (a = true);
    }
    if (a && nn < 5 && (lo = true, c.enabled = false, ro = t[0].index), !lo || nn % 2 !== 0) return;
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
    P.setFromCamera(z, o);
    let a = false;
    const t = P.intersectObject(W), s = ie();
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
  const m = Math.round(14.999999999999998), d = { position: e.position.clone(), quaternion: e.quaternion.clone() }, x = setInterval(P, 1e3 / 30);
  let v = 0;
  function P() {
    v++;
    const z = v / m;
    e.position.lerpVectors(d.position, l.position, z), e.quaternion.slerpQuaternions(d.quaternion, l.quaternion, z), p && p(), v == m && clearInterval(x);
  }
}
function ha(e, l, p, h) {
  const c = qs(p, e.elements, h);
  return q.derive(() => {
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
  const c = new tt(), m = new as();
  m.setColorMap("rainbow");
  const d = new Zt(), x = q.state([]);
  return q.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const v = p.val, P = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], z = ya(l.frameResults.val);
    if (c.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), c.clear(), !z || P.length === 0 || v.length === 0) {
      x.val = [];
      return;
    }
    const _ = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, ee = (_c = e.deformOutputs) == null ? void 0 : _c.val, ae = [], de = [];
    for (let $ = 0; $ < P.length; $++) {
      if (P[$].length !== 2) continue;
      const he = xa(z, $, _, ee);
      he && (ae.push(he[0], he[1]), de.push({ idx: $, vals: he }));
    }
    if (ae.length === 0) {
      x.val = [];
      return;
    }
    const se = Math.min(...ae), A = Math.max(...ae);
    m.setMin(se), m.setMax(A), x.val = ae;
    const ie = [1 / 0, 1 / 0, 1 / 0], W = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of v) for (let j = 0; j < 3; j++) ie[j] = Math.min(ie[j], $[j]), W[j] = Math.max(W[j], $[j]);
    const Me = Math.max(W[0] - ie[0], W[1] - ie[1], W[2] - ie[2], 1) * wa, X = [], I = [], U = [];
    let V = 0;
    for (const { idx: $, vals: j } of de) {
      const he = P[$], le = v[he[0]], oe = v[he[1]];
      if (!le || !oe) continue;
      const L = new S(oe[0] - le[0], oe[1] - le[1], oe[2] - le[2]), pe = L.length();
      if (pe < 1e-10) continue;
      L.normalize();
      const G = Math.abs(L.y) < 0.99 ? new S(0, 1, 0) : new S(1, 0, 0), we = new S().crossVectors(L, G).normalize(), xe = new S().crossVectors(L, we).normalize(), $e = xo + 1, ke = ma;
      for (let Ie = 0; Ie < $e; Ie++) {
        const Qe = Ie / xo, pt = le[0] + L.x * pe * Qe, re = le[1] + L.y * pe * Qe, E = le[2] + L.z * pe * Qe, K = j[0] + (j[1] - j[0]) * Qe, Y = m.getColor(K) ?? new Zt(0, 0, 0);
        d.copy(Y).convertSRGBToLinear();
        for (let Q = 0; Q < ke; Q++) {
          const ce = Q / ke * Math.PI * 2, ye = Math.cos(ce), me = Math.sin(ce);
          X.push(pt + (we.x * ye + xe.x * me) * Me, re + (we.y * ye + xe.y * me) * Me, E + (we.z * ye + xe.z * me) * Me), I.push(d.r, d.g, d.b);
        }
      }
      for (let Ie = 0; Ie < xo; Ie++) for (let Qe = 0; Qe < ke; Qe++) {
        const pt = (Qe + 1) % ke, re = V + Ie * ke + Qe, E = V + Ie * ke + pt, K = V + (Ie + 1) * ke + Qe, Y = V + (Ie + 1) * ke + pt;
        U.push(re, E, Y), U.push(re, Y, K);
      }
      V += $e * ke;
    }
    if (X.length === 0) return;
    const T = new Pe();
    T.setAttribute("position", new bt(X, 3)), T.setAttribute("color", new bt(I, 3)), T.setIndex(U), T.computeVertexNormals();
    const N = new it({ vertexColors: true, side: Ct }), B = new Oe(T, N);
    B.frustumCulled = false, c.add(B);
  }), c.__colorMapValues = x, c;
}
function va() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ma = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, ba = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, _a = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function yt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Sa = 16755200, Oo = 56831, ka = 56831, Pa = 56831, Xn = 65382;
function Ca(e) {
  const l = new tt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const p = new hn(1, 16, 16), h = new it({ color: Sa, transparent: true, opacity: 0.85, depthTest: false }), c = new Oe(p, h);
  c.visible = false, c.renderOrder = 100, l.add(c);
  const m = new Pe(), d = new ht({ color: Oo, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), x = new Kt(m, d);
  x.visible = false, x.renderOrder = 100, l.add(x);
  const v = new it({ color: Oo, transparent: true, opacity: 0.7, depthTest: false }), P = new Oe(new Ko(1, 1, 1, 12), v);
  P.visible = false, P.renderOrder = 100, l.add(P);
  const z = new Pe(), _ = new it({ color: ka, transparent: true, opacity: 0.45, side: Ct, depthTest: false }), ee = new Oe(z, _);
  ee.visible = false, ee.renderOrder = 100, l.add(ee);
  const ae = new Pe(), de = new ht({ color: Pa, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new Kt(ae, de);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const A = new it({ color: Xn, transparent: true, opacity: 0.95, depthTest: false }), ie = new it({ color: Xn, transparent: true, opacity: 0.85, depthTest: false }), W = new Ko(1, 1, 1, 12), Se = new it({ color: Xn, transparent: true, opacity: 0.55, side: Ct, depthTest: false }), Me = new ht({ color: Xn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), X = [];
  window.__hekatanModelSelection = X;
  const I = new tt();
  I.renderOrder = 101, l.add(I);
  const U = document.createElement("div");
  Object.assign(U.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), U.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(U);
  }, 0);
  function V(re) {
    const E = e.derivedNodes.rawVal;
    return !E || re < 0 || re >= E.length ? null : new S(E[re][0], E[re][1], E[re][2]);
  }
  function T(re, E) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s;
    const K = e.getActiveCamera();
    if (!K || !e.mesh) return null;
    const Y = e.rendererElm.getBoundingClientRect(), Q = re - Y.left, ce = E - Y.top, ye = e.derivedNodes.rawVal, me = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!ye || !me) return null;
    const Ce = /* @__PURE__ */ new Map(), Ae = (Ue) => {
      if (Ce.has(Ue)) return Ce.get(Ue);
      const Re = V(Ue);
      if (!Re) return Ce.set(Ue, null), null;
      const Fe = Re.clone().project(K), Ke = (Fe.x * 0.5 + 0.5) * Y.width, ge = (-Fe.y * 0.5 + 0.5) * Y.height, qe = { x: Ke, y: ge, z: Fe.z };
      return Ce.set(Ue, qe), qe;
    }, Ve = /* @__PURE__ */ new Set();
    for (const Ue of me) if (Ue) for (const Re of Ue) Ve.add(Re);
    const De = 8;
    let Xe = -1, Ge = De;
    for (let Ue = 0; Ue < ye.length; Ue++) {
      if (!Ve.has(Ue)) continue;
      const Re = Ae(Ue);
      if (!Re || Re.z < -1 || Re.z > 1) continue;
      const Fe = Re.x - Q, Ke = Re.y - ce, ge = Math.sqrt(Fe * Fe + Ke * Ke);
      ge < Ge && (Ge = ge, Xe = Ue);
    }
    const Le = va(), mt = ba[Le.dispUnit] ?? 1e3, He = Ma[Le.forceUnit] ?? 1;
    if (Xe >= 0) {
      const Ue = ye[Xe];
      let Re = `Nodo ${Xe}
(${Ue[0].toFixed(3)}, ${Ue[1].toFixed(3)}, ${Ue[2].toFixed(3)})`;
      const Fe = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Fe == null ? void 0 : Fe.deformations) {
        const Ke = Fe.deformations.get(Xe);
        if (Ke && (Re += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Re += `
Ux = ${yt(Ke[0] * mt, 3)} ${Le.dispUnit}`, Re += `
Uy = ${yt(Ke[1] * mt, 3)} ${Le.dispUnit}`, Re += `
Uz = ${yt(Ke[2] * mt, 3)} ${Le.dispUnit}`, (Math.abs(Ke[3]) > 1e-9 || Math.abs(Ke[4]) > 1e-9 || Math.abs(Ke[5]) > 1e-9) && (Re += `
Rx = ${yt(Ke[3] * 1e3, 3)} mrad`, Re += `
Ry = ${yt(Ke[4] * 1e3, 3)} mrad`, Re += `
Rz = ${yt(Ke[5] * 1e3, 3)} mrad`)), Fe.reactions) {
          const ge = Fe.reactions.get(Xe);
          ge && (Math.abs(ge[0]) > 1e-9 || Math.abs(ge[1]) > 1e-9 || Math.abs(ge[2]) > 1e-9 || Math.abs(ge[3]) > 1e-6 || Math.abs(ge[4]) > 1e-6 || Math.abs(ge[5]) > 1e-6) && (Re += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Re += `
Fx = ${yt(ge[0] * He)} ${Le.forceUnit}`, Re += `
Fy = ${yt(ge[1] * He)} ${Le.forceUnit}`, Re += `
Fz = ${yt(ge[2] * He)} ${Le.forceUnit}`, (Math.abs(ge[3]) > 1e-6 || Math.abs(ge[4]) > 1e-6 || Math.abs(ge[5]) > 1e-6) && (Re += `
Mx = ${yt(ge[3] * He)} ${Le.forceUnit}\xB7m`, Re += `
My = ${yt(ge[4] * He)} ${Le.forceUnit}\xB7m`, Re += `
Mz = ${yt(ge[5] * He)} ${Le.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Xe, info: Re };
    }
    const lt = 5;
    let ut = -1, rt = lt, qt = "frame";
    for (let Ue = 0; Ue < me.length; Ue++) {
      const Re = me[Ue];
      if (!(!Re || Re.length < 2)) {
        if (Re.length === 2) {
          const Fe = Ae(Re[0]), Ke = Ae(Re[1]);
          if (!Fe || !Ke || Fe.z < -1 || Fe.z > 1 || Ke.z < -1 || Ke.z > 1) continue;
          const ge = za(Q, ce, Fe.x, Fe.y, Ke.x, Ke.y);
          ge < rt && (rt = ge, ut = Ue, qt = "frame");
        } else if (Re.length === 3 || Re.length === 4) {
          const Fe = [];
          let Ke = true;
          for (const ge of Re) {
            const qe = Ae(ge);
            if (!qe || qe.z < -1 || qe.z > 1) {
              Ke = false;
              break;
            }
            Fe.push(qe);
          }
          if (!Ke) continue;
          if (Fa(Q, ce, Fe)) {
            const qe = Fe.reduce((We, xt) => We + xt.z, 0) / Fe.length * 1e-3;
            qe < rt && (rt = qe, ut = Ue, qt = "shell");
          }
        } else if (Re.length === 8) {
          const Fe = [];
          let Ke = true;
          for (const fe of Re) {
            const Ne = Ae(fe);
            if (!Ne || Ne.z < -1 || Ne.z > 1) {
              Ke = false;
              break;
            }
            Fe.push(Ne);
          }
          if (!Ke) continue;
          const ge = Math.min(...Fe.map((fe) => fe.x)), qe = Math.max(...Fe.map((fe) => fe.x)), We = Math.min(...Fe.map((fe) => fe.y)), xt = Math.max(...Fe.map((fe) => fe.y));
          if (Q >= ge && Q <= qe && ce >= We && ce <= xt) {
            const Ne = Fe.reduce((nt, gt) => nt + gt.z, 0) / Fe.length * 1e-3;
            Ne < rt && (rt = Ne, ut = Ue, qt = "solid");
          }
        }
      }
    }
    if (ut >= 0) {
      const Ue = me[ut];
      let Fe = `${qt === "frame" ? "Frame" : qt === "shell" ? "Shell" : "Solid"} ${ut}`;
      const Ke = (_e = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, ge = (_g = (_f = Ke == null ? void 0 : Ke.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, ut);
      if (ge) {
        ge.name && (Fe += `
  \u{1F4CB} ${ge.name}`), ge.shape && (Fe += `
  Shape: ${ge.shape}`);
        const qe = /concrete|hormig|rect.*sólida/i.test(ge.shape || ""), We = qe ? 100 : 1e3, xt = qe ? "cm" : "mm", fe = (nt) => {
          const gt = nt * We;
          return Math.abs(gt - Math.round(gt)) < 0.05 ? `${Math.round(gt)}` : `${gt.toFixed(1)}`;
        }, Ne = [];
        if (ge.D != null && Ne.push(`D=${fe(ge.D)}`), ge.B != null && Ne.push(`B=${fe(ge.B)}`), ge.TF != null && Ne.push(`TF=${fe(ge.TF)}`), ge.TW != null && Ne.push(`TW=${fe(ge.TW)}`), ge.t != null && Ne.push(`t=${fe(ge.t)}`), Ne.length && (Fe += `
  Dim: ${Ne.join(" ")} ${xt}`), ge.material) {
          let nt = ge.material;
          ge.fillMaterial && (nt += ` + FILL "${ge.fillMaterial}"`), Fe += `
  Mat: ${nt}`;
        }
      } else {
        const qe = (_i = (_h = Ke == null ? void 0 : Ke.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, ut), We = (_k = (_j = Ke == null ? void 0 : Ke.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, ut);
        qe ? (Fe += `
  ${qe}`, We && !qe.includes(We) && (Fe += `  (${We})`)) : We && (Fe += `
  Material: ${We}`);
      }
      if (Fe += `
nodos: [${Ue.join(", ")}]`, qt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const qe = e.mesh.analyzeOutputs.rawVal, We = _a[Le.stressUnit] ?? 1, xt = [["bendingXX", "Mxx", He, `${Le.forceUnit}\xB7m/m`], ["bendingYY", "Myy", He, `${Le.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", He, `${Le.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", He, `${Le.forceUnit}/m`], ["membraneYY", "Nyy", He, `${Le.forceUnit}/m`], ["membraneXY", "Nxy", He, `${Le.forceUnit}/m`], ["shearX", "Qx", He, `${Le.forceUnit}/m`], ["shearY", "Qy", He, `${Le.forceUnit}/m`], ["vonMises", "\u03C3VM", We, Le.stressUnit], ["pressure", "p", We, Le.stressUnit]], fe = [];
        for (const [Ne, nt, gt, Gt] of xt) {
          const _t = qe == null ? void 0 : qe[Ne];
          if (_t && _t instanceof Map) {
            const Tt = _t.get(ut);
            if (Tt != null) {
              if (typeof Tt == "number") fe.push(`${nt} = ${yt(Tt * gt, 3)} ${Gt}`);
              else if (Array.isArray(Tt)) {
                let ct = Tt[0];
                for (const jt of Tt) Math.abs(jt) > Math.abs(ct) && (ct = jt);
                fe.push(`${nt} = ${yt(ct * gt, 3)} ${Gt}`);
              }
            }
          }
        }
        fe.length > 0 && (Fe += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + fe.slice(0, 8).join(`
`));
      }
      if (qt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const qe = e.mesh.deformOutputs.rawVal, We = e.mesh.elementInputs.rawVal, xt = qe == null ? void 0 : qe.deformations;
        if (xt && Ue.length === 2) {
          const fe = xt.get(Ue[0]), Ne = xt.get(Ue[1]), nt = ye[Ue[0]], gt = ye[Ue[1]];
          if (fe && Ne && nt && gt) {
            const Gt = gt[0] - nt[0], _t = gt[1] - nt[1], Tt = gt[2] - nt[2], ct = Math.sqrt(Gt * Gt + _t * _t + Tt * Tt);
            if (ct > 1e-9) {
              const jt = Gt / ct, Vt = _t / ct, Jt = Tt / ct, en = (Ne[0] - fe[0]) * jt + (Ne[1] - fe[1]) * Vt + (Ne[2] - fe[2]) * Jt, tn = ((_n = We.elasticities) == null ? void 0 : _n.get(ut)) ?? 0, Gn = ((_o2 = We.areas) == null ? void 0 : _o2.get(ut)) ?? 0, Hn = ((_p = We.momentsOfInertiaY) == null ? void 0 : _p.get(ut)) ?? 0, ln = ((_q = We.momentsOfInertiaZ) == null ? void 0 : _q.get(ut)) ?? 0, Fn = ((_r = We.torsionalConstants) == null ? void 0 : _r.get(ut)) ?? 0, rn = ((_s = We.shearModuli) == null ? void 0 : _s.get(ut)) ?? tn / 2.6, mn = tn * Gn * (en / ct), An = (Ne[3] - fe[3]) * jt + (Ne[4] - fe[4]) * Vt + (Ne[5] - fe[5]) * Jt, wn = rn * Fn * (An / ct), yn = Ne[4] - fe[4], Lt = Ne[5] - fe[5], Nt = tn * Hn * yn / ct, Ht = tn * ln * Lt / ct;
              Fe += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Fe += `
L = ${yt(ct, 3)} m`, Fe += `
\u0394L = ${yt(en * mt, 3)} ${Le.dispUnit}`, Fe += `
\u03B5 = ${yt(en / ct, 6)}`, Math.abs(mn) > 1e-6 && (Fe += `
N \u2248 ${yt(mn * He)} ${Le.forceUnit}`), Math.abs(wn) > 1e-6 && (Fe += `
T \u2248 ${yt(wn * He)} ${Le.forceUnit}\xB7m`), Math.abs(Nt) > 1e-6 && (Fe += `
My \u2248 ${yt(Nt * He)} ${Le.forceUnit}\xB7m`), Math.abs(Ht) > 1e-6 && (Fe += `
Mz \u2248 ${yt(Ht * He)} ${Le.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: qt, idx: ut, info: Fe };
    }
    return null;
  }
  function N(re, E, K) {
    var _a2, _b, _c;
    if (c.visible = false, x.visible = false, P.visible = false, ee.visible = false, se.visible = false, !re || !e.mesh) {
      U.style.display = "none", e.render();
      return;
    }
    const Y = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (re.type === "node") {
      const me = V(re.idx);
      if (me) {
        const Ce = e.derivedNodes.rawVal ?? [];
        let Ae = 1;
        if (Ce.length >= 2) {
          let Xe = [1 / 0, 1 / 0, 1 / 0], Ge = [-1 / 0, -1 / 0, -1 / 0];
          for (const Le of Ce) for (let mt = 0; mt < 3; mt++) Le[mt] < Xe[mt] && (Xe[mt] = Le[mt]), Le[mt] > Ge[mt] && (Ge[mt] = Le[mt]);
          Ae = Math.max(Ge[0] - Xe[0], Ge[1] - Xe[1], Ge[2] - Xe[2], 0.1);
        }
        const Ve = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, De = 0.021 * Ae * Ve;
        c.position.copy(me), c.scale.setScalar(De), c.visible = true;
      }
    } else if (re.type === "frame" && Y) {
      const me = Y[re.idx], Ce = V(me[0]), Ae = V(me[1]);
      if (Ce && Ae) {
        const Ve = Ce.clone().add(Ae).multiplyScalar(0.5), De = Ae.clone().sub(Ce), Xe = De.length(), mt = e.getActiveCamera().position.distanceTo(Ve) * 35e-4;
        P.position.copy(Ve);
        const He = new S(0, 1, 0), lt = He.clone().cross(De).normalize(), ut = He.angleTo(De);
        P.quaternion.setFromAxisAngle(lt, ut), P.scale.set(mt, Xe, mt), P.visible = true;
      }
    } else if (re.type === "shell" && Y) {
      const me = Y[re.idx], Ce = [], Ae = [];
      for (const Ve of me) {
        const De = V(Ve);
        if (!De) return;
        Ce.push(De.x, De.y, De.z);
      }
      me.length === 4 ? Ae.push(0, 1, 2, 0, 2, 3) : me.length === 3 && Ae.push(0, 1, 2), z.setAttribute("position", new bt(Ce, 3)), z.setIndex(Ae), z.computeVertexNormals(), ee.visible = true;
    } else if (re.type === "solid" && Y) {
      const me = Y[re.idx], Ce = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ae = [];
      for (const [Ve, De] of Ce) {
        const Xe = V(me[Ve]), Ge = V(me[De]);
        Xe && Ge && Ae.push(Xe.x, Xe.y, Xe.z, Ge.x, Ge.y, Ge.z);
      }
      ae.setAttribute("position", new bt(Ae, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      U.style.display = "none", e.render();
      return;
    }
    U.textContent = re.info, U.style.whiteSpace = "pre-line", U.style.display = "block";
    const ce = e.rendererElm.getBoundingClientRect(), ye = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? ce;
    U.style.left = `${E - ye.left}px`, U.style.top = `${K - ye.top}px`, e.render();
  }
  let B = "", $ = 0, j = 0;
  const he = window.__hekatanHoverDebug ?? false, le = (re) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const E = T(re.clientX, re.clientY);
      if (he && j < 5) {
        const Y = e.derivedNodes.rawVal, Q = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${re.clientX}, ${re.clientY}) nodes=${(Y == null ? void 0 : Y.length) ?? 0} elems=${(Q == null ? void 0 : Q.length) ?? 0} hover=`, E), j++;
      }
      const K = E ? `${E.type}:${E.idx}` : "";
      if (K !== B) B = K, N(E, re.clientX, re.clientY);
      else if (E) {
        const Y = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        U.style.left = `${re.clientX - Y.left}px`, U.style.top = `${re.clientY - Y.top}px`;
      }
    });
  };
  let oe = null;
  const L = () => {
    B = "", c.visible = false, x.visible = false, P.visible = false, ee.visible = false, se.visible = false, U.style.display = "none", e.render();
  }, pe = (re) => {
    const E = e.rendererElm.getBoundingClientRect(), K = re.clientX - E.left, Y = re.clientY - E.top;
    (K < -2 || Y < -2 || K > E.width + 2 || Y > E.height + 2) && (oe && clearTimeout(oe), oe = window.setTimeout(L, 200));
  }, G = () => {
    oe && (clearTimeout(oe), oe = null);
  };
  e.rendererElm.addEventListener("pointermove", le), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", G);
  function we() {
    var _a2, _b, _c;
    const re = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return re === "select" || re === "none" || !re;
  }
  let xe = null;
  e.rendererElm.addEventListener("pointerdown", (re) => {
    re.button === 0 && (xe = { x: re.clientX, y: re.clientY });
  }), e.rendererElm.addEventListener("pointerup", (re) => {
    if (re.button !== 0 || !xe) return;
    const E = re.clientX - xe.x, K = re.clientY - xe.y;
    if (xe = null, E * E + K * K > 9 || !we()) return;
    const Y = T(re.clientX, re.clientY);
    Y ? (Qe({ type: Y.type, idx: Y.idx }, re.shiftKey), Ie()) : pt();
  }), window.addEventListener("keydown", (re) => {
    if (re.key !== "Escape" || !X.length) return;
    const E = document.activeElement, K = !!E && (E.id === "hk3-cmd-input" || E.id === "hk-dyn-input") && E.value === "";
    E && (E.tagName === "INPUT" || E.tagName === "TEXTAREA" || E.isContentEditable) && !K || pt();
  }, { capture: true });
  function $e() {
    for (const re of I.children.slice()) {
      I.remove(re);
      const E = re.geometry;
      E && E !== p && E !== W && E.dispose();
    }
  }
  function ke(re, E) {
    var _a2, _b, _c;
    const K = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (re.type === "node") {
      const Y = V(re.idx);
      if (!Y) return;
      const Q = ((_c = e.derivedDisplayScale) == null ? void 0 : _c.rawVal) ?? 1, ce = new Oe(p, A);
      ce.position.copy(Y), ce.scale.setScalar(0.025 * E * Q), ce.renderOrder = 101, I.add(ce);
    } else if (re.type === "frame" && K) {
      const Y = K[re.idx], Q = V(Y[0]), ce = V(Y[1]);
      if (!Q || !ce) return;
      const ye = Q.clone().add(ce).multiplyScalar(0.5), me = ce.clone().sub(Q), Ce = me.length(), Ae = e.getActiveCamera().position.distanceTo(ye), Ve = new Oe(W, ie);
      Ve.position.copy(ye);
      const De = new S(0, 1, 0);
      Ve.quaternion.setFromAxisAngle(De.clone().cross(me).normalize(), De.angleTo(me)), Ve.scale.set(Ae * 35e-4, Ce, Ae * 35e-4), Ve.renderOrder = 101, I.add(Ve);
    } else if (re.type === "shell" && K) {
      const Y = K[re.idx], Q = [], ce = [];
      for (const Ce of Y) {
        const Ae = V(Ce);
        if (!Ae) return;
        Q.push(Ae.x, Ae.y, Ae.z);
      }
      Y.length === 4 ? ce.push(0, 1, 2, 0, 2, 3) : Y.length === 3 && ce.push(0, 1, 2);
      const ye = new Pe();
      ye.setAttribute("position", new bt(Q, 3)), ye.setIndex(ce), ye.computeVertexNormals();
      const me = new Oe(ye, Se);
      me.renderOrder = 101, I.add(me);
    } else if (re.type === "solid" && K) {
      const Y = K[re.idx], Q = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], ce = [];
      for (const [Ce, Ae] of Q) {
        const Ve = V(Y[Ce]), De = V(Y[Ae]);
        Ve && De && ce.push(Ve.x, Ve.y, Ve.z, De.x, De.y, De.z);
      }
      const ye = new Pe();
      ye.setAttribute("position", new bt(ce, 3));
      const me = new Kt(ye, Me);
      me.renderOrder = 101, I.add(me);
    }
  }
  function Ie() {
    if ($e(), !X.length || !e.mesh) {
      e.render();
      return;
    }
    const re = e.derivedNodes.rawVal ?? [];
    let E = 1;
    if (re.length >= 2) {
      const K = [1 / 0, 1 / 0, 1 / 0], Y = [-1 / 0, -1 / 0, -1 / 0];
      for (const Q of re) for (let ce = 0; ce < 3; ce++) Q[ce] < K[ce] && (K[ce] = Q[ce]), Q[ce] > Y[ce] && (Y[ce] = Q[ce]);
      E = Math.max(Y[0] - K[0], Y[1] - K[1], Y[2] - K[2], 0.1);
    }
    for (const K of X) ke(K, E);
    e.render();
  }
  function Qe(re, E) {
    const K = X.findIndex((Y) => Y.type === re.type && Y.idx === re.idx);
    K >= 0 ? X.splice(K, 1) : E || X.push(re), X.length && X[X.length - 1];
  }
  function pt() {
    X.length = 0, Ie();
  }
  return q.derive(() => {
    e.derivedNodes.val, X.length && Ie();
  }), l;
}
function za(e, l, p, h, c, m) {
  const d = c - p, x = m - h, v = d * d + x * x;
  if (v < 1e-9) {
    const de = e - p, se = l - h;
    return Math.sqrt(de * de + se * se);
  }
  let P = ((e - p) * d + (l - h) * x) / v;
  P = Math.max(0, Math.min(1, P));
  const z = p + P * d, _ = h + P * x, ee = e - z, ae = l - _;
  return Math.sqrt(ee * ee + ae * ae);
}
function Fa(e, l, p) {
  let h = false;
  for (let c = 0, m = p.length - 1; c < p.length; m = c++) {
    const d = p[c].x, x = p[c].y, v = p[m].x, P = p[m].y;
    x > l != P > l && e < (v - d) * (l - x) / (P - x + 1e-12) + d && (h = !h);
  }
  return h;
}
function Qo(e, l = 8) {
  const p = document.createElement("div");
  p.id = "legend", p.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    q.derive(() => {
      qn.val, p.style.background = Zs();
    });
  });
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", p.appendChild(h), setTimeout(() => {
    q.derive(() => {
      h.textContent = vo.val ? `[${vo.val}]` : "";
    });
  });
  const c = Array.from({ length: l + 1 }, (v, P) => P / l).reverse();
  let m, d;
  c.forEach((v, P) => {
    m = document.createElement("div"), m.id = `marker-${P}`, m.className = "marker", m.style.marginTop = P == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", d = document.createElement("p"), d.id = `marker-text-${P}`, m.append(d), p.append(m);
  });
  const x = [];
  return p.querySelectorAll("p").forEach((v) => x.push(v)), setTimeout(() => {
    q.derive(() => {
      c.forEach((v, P) => {
        const z = x[P];
        z && (z.innerText = Aa(e.val, v).toString());
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
  let P = x;
  const z = new Xs({ antialias: true });
  z.localClippingEnabled = true;
  const _ = new Go(x, z.domElement);
  _.enableDamping = true, _.dampingFactor = 0.1, _.screenSpacePanning = true, _.zoomSpeed = 0.8, _.panSpeed = 1.2, _.rotateSpeed = 0.9, _.keyPanSpeed = 12, _.listenToKeyEvents(window), _.touches = { ONE: Bn.ROTATE, TWO: Bn.DOLLY_PAN }, z.domElement.addEventListener("wheel", (E) => {
    if (!E.ctrlKey && Math.abs(E.deltaX) > Math.abs(E.deltaY) * 1.5) {
      E.preventDefault();
      const K = _.target, Y = new S().subVectors(x.position, K), Q = new S();
      Q.crossVectors(x.up, Y).normalize();
      const ye = Y.length() * 1e-3 * _.panSpeed;
      K.addScaledVector(Q, E.deltaX * ye), x.position.addScaledVector(Q, E.deltaX * ye), _.update();
    }
  }, { passive: false });
  const ee = new mo(new S(-1, 0, 0), 0), ae = new mo(new S(0, -1, 0), 0), de = new mo(new S(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const E = window.__hekatanClip, K = [];
    E.enableX && (ee.normal.set(E.invertX ? 1 : -1, 0, 0), ee.constant = E.invertX ? -E.posX : E.posX, K.push(ee)), E.enableY && (ae.normal.set(0, E.invertY ? 1 : -1, 0), ae.constant = E.invertY ? -E.posY : E.posY, K.push(ae)), E.enableZ && (de.normal.set(0, 0, E.invertZ ? 1 : -1), de.constant = E.invertZ ? -E.posZ : E.posZ, K.push(de)), z.clippingPlanes = K, d.traverse((Q) => {
      const ce = Q;
      if (ce.material) {
        const ye = Array.isArray(ce.material) ? ce.material : [ce.material];
        for (const me of ye) me.clippingPlanes = K, me.needsUpdate = true;
      }
    });
    const Y = window.__hekatanPanes ?? [];
    for (const Q of Y) try {
      Q && typeof Q.refresh == "function" && Q.refresh();
    } catch {
    }
    z.render(d, P);
  }
  se(), window.__hekatanClipApply = se;
  const A = Gs(l), ie = q.derive(() => Math.pow(10, A.displayScale.val / 10)), W = Ea(e, A), Se = () => {
    const E = [];
    return A.gridXY.rawVal && E.push("xy"), A.gridXZ.rawVal && E.push("xz"), A.gridYZ.rawVal && E.push("yz"), E;
  }, Me = () => {
    const E = A.gridStep.rawVal, K = Math.max(E, A.gridMajor.rawVal);
    return { planes: Se(), majorStep: K, minorStep: E };
  };
  let X = yo(A.gridSize.rawVal, Me());
  X.visible = A.gridVisible.rawVal, window.__hekatanSnap2D = A.cursorSnap.rawVal;
  const I = () => {
    const E = Math.max(0, Math.min(1, A.gridOpacity.rawVal));
    X.traverse((K) => {
      const Y = K.material;
      if (!Y || !("opacity" in Y)) return;
      const Q = K.name ?? "";
      let ce = 0.35;
      Q.includes("border") ? ce = 1 : Q.includes("major") && (ce = 0.75), Y.opacity = E * ce;
    });
  };
  I(), m.appendChild(Ks(A, e, c)), m.setAttribute("id", "viewer"), m.appendChild(z.domElement), z.setPixelRatio(window.devicePixelRatio);
  const U = an();
  z.setClearColor(U.background, 1);
  const V = A.gridSize.rawVal, T = V * 0.5 + V * 0.5 / Math.tan(45 * 0.5);
  x.position.set(0, 0, T), x.up.set(0, 1, 0), _.target.set(0, 0, 0), _.minDistance = 0.1, _.maxDistance = 1e4, m.__settings = A, _.zoomSpeed = 1, _._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, _.update();
  let N = Wo(A.gridSize.rawVal, A.flipAxes.rawVal);
  d.add(X, N), q.derive(() => {
    window.__hekatanGridPlaneXY = A.gridXY.val, window.__hekatanGridPlaneXZ = A.gridXZ.val, window.__hekatanGridPlaneYZ = A.gridYZ.val;
  });
  let B = true;
  q.derive(() => {
    const E = A.gridVisible.val;
    if (B) {
      B = false;
      return;
    }
    X.visible = E, G();
  });
  let $ = true;
  q.derive(() => {
    if (A.gridOpacity.val, $) {
      $ = false;
      return;
    }
    I(), G();
  }), q.derive(() => {
    const E = A.cursorSnap.val;
    window.__hekatanSnap2D = E;
  });
  let j = true;
  q.derive(() => {
    var _a2;
    const E = A.gridSize.val, K = A.flipAxes.val;
    if (A.gridXY.val, A.gridXZ.val, A.gridYZ.val, A.gridStep.val, A.gridMajor.val, j) {
      j = false;
      return;
    }
    d.remove(X), (_a2 = X.traverse) == null ? void 0 : _a2.call(X, (ce) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ce.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), X = yo(E, Me()), X.visible = A.gridVisible.rawVal, d.add(X), I(), d.remove(N), N.traverse((ce) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ce.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = Wo(E, K), d.add(N);
    const Y = E * 0.5 + E * 0.5 / Math.tan(45 * 0.5);
    x.position.distanceTo(_.target), Math.abs(x.position.x) < 0.1 && Math.abs(x.position.y) < 0.1 && x.position.z > 0 ? x.position.set(0, 0, Y) : x.position.set(0.5 * E, -Y, 0.5 * E), _.target.set(0, 0, 0), _.minDistance = Math.max(0.05, E * 0.01), _.maxDistance = Math.max(50, E * 50), _.update(), G();
  }), new ResizeObserver((E) => {
    var _a2, _b;
    for (const K of E) {
      const Y = (_a2 = K.target) == null ? void 0 : _a2.clientWidth, Q = (_b = K.target) == null ? void 0 : _b.clientHeight;
      if (Y === 0 || Q === 0) continue;
      const ye = (le ? Y / 2 : Y) / Q;
      x.aspect = ye, x.updateProjectionMatrix();
      const me = v.top;
      if (v.left = -me * ye, v.right = me * ye, v.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = ye, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Ce = oe, Ae = Ce.top;
        Ce.left = -Ae * ye, Ce.right = Ae * ye, Ce.updateProjectionMatrix();
      }
      z.setSize(Y, Q), G();
    }
  }).observe(m), _.addEventListener("change", G), q.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, A.displayScale.val, A.nodes.val, A.elements.val, (_g = A.edges) == null ? void 0 : _g.val, A.elemColumns.val, A.elemBeams.val, A.nodesIndexes.val, A.elementsIndexes.val, A.orientations.val, A.sections.val, A.secColumns.val, A.secBeams.val, A.secFloor.val, A.supports.val, A.loads.val, A.deformedShape.val, A.nodeResults.val, A.frameResults.val, A.shellResults.val, (_h = A.solidResults) == null ? void 0 : _h.val, (_i = A.extruded) == null ? void 0 : _i.val, setTimeout(G);
  });
  let le = false, oe = null, L = null, pe = false;
  function G() {
    const E = m.clientWidth || 1, K = m.clientHeight || 1;
    if (!le || !oe) {
      z.setScissorTest(false), z.setViewport(0, 0, E, K), z.render(d, P);
      return;
    }
    const Y = E / 2;
    z.setScissorTest(true), z.setViewport(0, 0, Y, K), z.setScissor(0, 0, Y, K), z.render(d, P), z.setViewport(Y, 0, Y, K), z.setScissor(Y, 0, Y, K), z.render(d, oe), z.setScissorTest(false);
  }
  function we(E) {
    P = E, _.object = E, _.update(), G();
  }
  function xe(E, K) {
    le = E, K && (oe = K);
    const Y = m.clientWidth || 1, Q = m.clientHeight || 1, ye = (E ? Y / 2 : Y) / Q;
    x.isPerspectiveCamera && (x.aspect = ye, x.updateProjectionMatrix());
    const me = v.top;
    if (v.left = -me * ye, v.right = me * ye, v.updateProjectionMatrix(), E && oe) {
      if (L ? (L.object = oe, L.update()) : (L = new Go(oe, z.domElement), L.enableDamping = true, L.dampingFactor = 0.1, L.screenSpacePanning = true, L.zoomSpeed = 0.8, L.panSpeed = 1.2, L.rotateSpeed = 0.9, L.touches = { ONE: Bn.ROTATE, TWO: Bn.DOLLY_PAN }, L.target.copy(_.target), L.addEventListener("change", G), L.enabled = false), !pe) {
        const Ce = (Ae) => {
          if (!le || !L) return;
          const Ve = z.domElement.getBoundingClientRect(), De = Ae.clientX - Ve.left, Xe = Ve.width / 2, Ge = De >= Xe;
          _.enabled = !Ge, L.enabled = Ge;
        };
        z.domElement.addEventListener("pointerdown", Ce, true), z.domElement.addEventListener("wheel", Ce, { capture: true, passive: true }), pe = true;
      }
    } else E || (_.enabled = true, L && (L.enabled = false));
    m.__splitMode = E, window.__hekatanSplitMode = E, window.__hekatanSplitCamera = E ? oe : null, G();
  }
  if (e) {
    d.add(Hs(A, W, ie), Ys(e, A, W), Os(A, W, ie), Qs(e, A, W, ie), Ws(e, A, W, ie), Js(e, A, W, ie), ta(e, A, W, ie), oa(e, A, W, ie), la(e, A, W), pa(e, A, W, ie), ra(e, A, W, ie));
    const E = Ca({ scene: d, rendererElm: z.domElement, getActiveCamera: () => P, derivedNodes: W, derivedDisplayScale: ie, mesh: e, settings: A, render: G });
    d.add(E);
    const K = Ra(e, A), Y = ha(e, A, W, K), Q = Qo(K);
    d.add(Y), m.appendChild(Q);
    const ce = ga(e, A, W);
    d.add(ce);
    const ye = ce.__colorMapValues, me = Qo(ye);
    me.id = "frame-legend", m.appendChild(me), q.derive(() => {
      var _a2;
      const Ce = A.shellResults.val != "none", Ae = (((_a2 = A.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ve = Ce || Ae, De = A.frameResults.val.startsWith("contour:"), Xe = K.val.some((Ge) => Number.isFinite(Ge));
      Q.hidden = !Ve || !Xe, Y.visible = Ve, me.hidden = !De;
    });
  }
  if (c) {
    const E = new os(16777215, 0.5);
    d.add(E);
    const K = new Zn(16777215, 0.5);
    K.position.set(30, 25, -10), K.shadow.mapSize.width = 1024, K.shadow.mapSize.height = 1024, d.add(K);
    const Y = 10;
    K.shadow.camera.left = -Y, K.shadow.camera.right = Y, K.shadow.camera.top = Y, K.shadow.camera.bottom = -Y, K.shadow.camera.far = 1e3;
    const Q = new Zn(16777215, 0.5);
    Q.color.setHSL(11, 43, 96), Q.position.set(-10, 0, 30), d.add(Q), q.derive(() => {
      (c == null ? void 0 : c.val.length) && (d.remove(...c.oldVal), d.add(...c.rawVal), G());
    }), q.derive(() => {
      c.rawVal.forEach((ce) => ce.visible = A.solids.val), G();
    });
  }
  if (h) {
    const E = [], K = (Q) => {
      var _a2;
      return ((_a2 = Q == null ? void 0 : Q.userData) == null ? void 0 : _a2.isCota) ? A.showCotas.val : A.custom3D.val;
    }, Y = () => {
      for (const Q of E) Q.visible = K(Q);
      G();
    };
    q.derive(() => {
      const Q = h.val;
      E.length && (d.remove(...E), E.length = 0), Q.length && (d.add(...Q), E.push(...Q), Y()), G();
    }), q.derive(() => {
      A.custom3D.val, Y();
    }), q.derive(() => {
      A.showCotas.val, Y();
    });
  }
  p && ua({ drawingObj: p, gridObj: X, scene: d, getActiveCamera: () => P, controls: _, gridSize: V, derivedDisplayScale: ie, rendererElm: z.domElement, viewerRender: G }), ts((E, K) => {
    var _a2;
    z.setClearColor(K.background, 1), d.remove(X), (_a2 = X.traverse) == null ? void 0 : _a2.call(X, (Y) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Y.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Y.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), X = yo(A.gridSize.rawVal, { planes: Se() }), d.add(X), m.style.setProperty("--awatif-legend-color", K.legendMarker), G();
  });
  const $e = { scene: d, perspCamera: x, orthoCamera: v, get camera() {
    return P;
  }, controls: _, renderer: z, rendererElm: z.domElement, render: G, setActiveCamera: we, setSplitMode: xe, get splitMode() {
    return le;
  }, get splitCamera() {
    return oe;
  }, settings: A };
  m.__ctx = $e;
  const ke = document.createElement("div");
  ke.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Ie = (E, K, Y) => {
    const Q = document.createElement("button");
    return Q.textContent = E, Q.title = K, Q.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), Q.onmouseenter = () => {
      Q.style.background = "rgba(70,70,70,0.9)";
    }, Q.onmouseleave = () => {
      Q.style.background = "rgba(40,40,40,0.85)";
    }, Q.onclick = (ce) => {
      ce.preventDefault(), Y();
    }, Q;
  }, Qe = (E, K) => {
    const Y = _.target, Q = new S().subVectors(P.position, Y), ce = Q.length(), ye = new S(), me = new S();
    ye.crossVectors(P.up, Q).normalize(), me.copy(P.up).normalize();
    const Ce = ce * 0.05;
    Y.addScaledVector(ye, -E * Ce), Y.addScaledVector(me, K * Ce), P.position.addScaledVector(ye, -E * Ce), P.position.addScaledVector(me, K * Ce), _.update(), G();
  }, pt = (E) => {
    const K = new S().subVectors(P.position, _.target);
    K.multiplyScalar(E), P.position.copy(_.target).add(K), _.update(), G();
  }, re = () => {
    const E = document.createElement("div");
    return E.style.cssText = "width:32px;height:32px;", E;
  };
  return ke.append(re()), ke.append(Ie("\u2191", "Pan arriba", () => Qe(0, 1))), ke.append(Ie("\u2295", "Zoom in", () => pt(0.85))), ke.append(Ie("\u2190", "Pan izquierda", () => Qe(-1, 0))), ke.append(Ie("\u2302", "Reset vista", () => {
    _.reset(), G();
  })), ke.append(Ie("\u2192", "Pan derecha", () => Qe(1, 0))), ke.append(Ie("\u2296", "Zoom out", () => pt(1.18))), ke.append(Ie("\u2193", "Pan abajo", () => Qe(0, -1))), ke.append(re()), getComputedStyle(m).position === "static" && (m.style.position = "relative"), m.appendChild(ke), m;
}
function Ea(e, l) {
  return q.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const p = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || p.length === 0) return p;
    const c = l.deformScale.val, m = l.deformScale.val * l.deformScaleZ.val, d = Number.isFinite(c) ? c : 1, x = Number.isFinite(m) ? m : 1;
    return p.map((v, P) => {
      var _a3;
      const z = ((_a3 = h.get(P)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], _ = Number.isFinite(z[0]) ? z[0] : 0, ee = Number.isFinite(z[1]) ? z[1] : 0, ae = Number.isFinite(z[2]) ? z[2] : 0;
      return [v[0] + _ * d, v[1] + ee * d, v[2] + ae * x];
    });
  });
}
const zn = q.state(null), vo = q.state(""), Ta = q.state("kN"), Va = q.state("mm"), $a = q.state("kN/m\xB2"), La = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, es = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Ia = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Ra(e, l) {
  const p = q.state([]);
  let h;
  return ((c) => {
    c.bendingXX = "bendingXX", c.bendingYY = "bendingYY", c.bendingXY = "bendingXY", c.membraneXX = "membraneXX", c.membraneYY = "membraneYY", c.membraneXY = "membraneXY", c.tranverseShearX = "tranverseShearX", c.tranverseShearY = "tranverseShearY", c.membranePrincipalMax = "membranePrincipalMax", c.membranePrincipalMin = "membranePrincipalMin", c.bendingPrincipalMax = "bendingPrincipalMax", c.bendingPrincipalMin = "bendingPrincipalMin", c.transverseShearMax = "transverseShearMax", c.vonMises = "vonMises", c.pressure = "pressure", c.displacementX = "displacementX", c.displacementY = "displacementY", c.displacementZ = "displacementZ";
  })(h || (h = {})), q.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const c = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), de = (K, Y) => {
      K == null ? void 0 : K.forEach((Q, ce) => {
        const ye = e.elements.val[ce];
        if (ye) for (let me = 0; me < ye.length; me++) Y.set(ye[me], [Q[me] ?? Q[0]]);
      });
    };
    de((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), de((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, m), de((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, d), de((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, x), de((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, v), de((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, P), de((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, z), de((_p = (_o2 = e.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, _), de((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ee), de((_t = (_s = e.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t.pressure, ae);
    const se = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Me = (K, Y, Q, ce, ye) => {
      K.forEach((me, Ce) => {
        var _a3, _b2;
        const Ae = me[0] ?? 0, Ve = ((_a3 = Y.get(Ce)) == null ? void 0 : _a3[0]) ?? 0, De = ((_b2 = Q.get(Ce)) == null ? void 0 : _b2[0]) ?? 0, Xe = (Ae + Ve) / 2, Ge = Math.hypot((Ae - Ve) / 2, De);
        ce.set(Ce, [Xe + Ge]), ye.set(Ce, [Xe - Ge]);
      });
    };
    Me(x, v, P, se, A), Me(c, m, d, ie, W), z.forEach((K, Y) => {
      var _a3;
      Se.set(Y, [Math.hypot(K[0] ?? 0, ((_a3 = _.get(Y)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const X = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, I = (_w = l.solidResults) == null ? void 0 : _w.val, V = I && I !== "none" ? I : l.shellResults.val, T = X == null ? void 0 : X[V], N = { bendingXX: [c, 0], bendingYY: [m, 0], bendingXY: [d, 0], membraneXX: [x, 0], membraneYY: [v, 0], membraneXY: [P, 0], tranverseShearX: [z, 0], tranverseShearY: [_, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [A, 0], bendingPrincipalMax: [ie, 0], bendingPrincipalMin: [W, 0], transverseShearMax: [Se, 0], vonMises: [ee, 0], pressure: [ae, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, B = l.shellResults.val, $ = Ta.val, j = Va.val, he = B === "displacementX" || B === "displacementY" || B === "displacementZ", le = B === "bendingXX" || B === "bendingYY" || B === "bendingXY" || B === "bendingPrincipalMax" || B === "bendingPrincipalMin", oe = B === "membraneXX" || B === "membraneYY" || B === "membraneXY" || B === "membranePrincipalMax" || B === "membranePrincipalMin", L = B === "vonMises" || B === "pressure", pe = B === "tranverseShearX" || B === "tranverseShearY" || B === "transverseShearMax", G = (_D = l.solidResults) == null ? void 0 : _D.val, we = G === "vonMises" || G === "sigmaXX" || G === "sigmaYY" || G === "sigmaZZ" || G === "tauXY" || G === "tauYZ" || G === "tauXZ", xe = G === "ux" || G === "uy" || G === "uz", $e = $a.val, ke = we ? Ia[$e] : xe || he ? es[j] : le || oe || L || pe ? 1 / La[$] : 1, Ie = we ? $e : xe || he ? j : le ? `${$}\xB7m/m` : oe ? `${$}/m\xB2` : L ? `${$}/m\xB2` : pe ? `${$}/m` : "";
    vo.val = Ie, zn.val = Array.isArray(T) && T.length === 2 ? [T[0] * ke, T[1] * ke] : null;
    const Qe = ls.val, re = G && G !== "none" ? [ee, 0] : N[B], E = [];
    if (e.nodes.val.forEach((K, Y) => {
      const Q = re;
      if (!Q || !Q[0] || typeof Q[0].has != "function") return;
      if (!Q[0].has(Y)) {
        E.push(Number.NaN);
        return;
      }
      const ce = Q[0].get(Y), ye = ce ? ce[Q[1]] ?? 0 : 0;
      E.push(ye * ke);
    }), !zn.val && Qe !== "auto") {
      const K = e.nodes.val, Y = /* @__PURE__ */ new Set(), Q = (ye, me) => {
        var _a3;
        const Ce = (_a3 = K[ye[0]]) == null ? void 0 : _a3[me];
        return ye.every((Ae) => {
          var _a4;
          return Math.abs((((_a4 = K[Ae]) == null ? void 0 : _a4[me]) ?? NaN) - Ce) < 1e-6;
        });
      };
      for (const ye of e.elements.val) {
        if (ye.length !== 4) continue;
        const me = Q(ye, 2), Ce = !me && Q(ye, 0), Ae = !me && Q(ye, 1);
        if (Qe === "losas" ? me : Qe === "muros" ? Ce || Ae : Qe === "murosX" ? Ce : Qe === "murosY" ? Ae : false) for (const Xe of ye) Y.add(Xe);
      }
      const ce = [];
      for (const ye of Y) {
        const me = E[ye];
        Number.isFinite(me) && ce.push(me);
      }
      ce.length && (zn.val = bo(ce));
    }
    p.val = E;
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
