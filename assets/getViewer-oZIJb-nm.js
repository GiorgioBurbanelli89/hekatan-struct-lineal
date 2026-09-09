import { N as Zt, a6 as In, q as Ss, v as K, a7 as ks, D as Ct, M as Oe, B as Pe, F as bt, a8 as Ps, x as ft, a9 as Cs, aa as zs, h as Do, ab as Bo, r as an, ac as Xn, ad as Nn, a4 as jo, _ as tt, a as ht, L as Kt, w as es, b as Fs, ae as As, f as it, V as S, $ as sn, af as co, H as go, d as Ft, c as po, Y as ts, Z as Un, G as Es, z as Pn, A as Ts, ag as Yn, t as Vs, o as $s, I as Qt, a2 as Sn, E as Xo, S as hn, m as uo, ah as kn, g as No, i as Yo, j as Uo, C as Zo, K as Ls, U as Is, W as Rs, X as Ds, T as Rn, P as fo, O as Bs } from "./theme-U-6D_qyI.js";
import { T as Pt, O as qo } from "./Text-CUW6lNkV.js";
import { P as ns } from "./tweakpane-BXg6ZhiP.js";
import { e as Xs } from "./styles-SbI03m7S.js";
class os {
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
    this.map = ho[l] || ho.rainbow, this.n = p;
    const h = 1 / this.n, c = new Zt(), m = new Zt();
    this.lut.length = 0, this.lut.push(new Zt(this.map[0][1]));
    for (let d = 1; d < p; d++) {
      const x = d * h;
      for (let v = 0; v < this.map.length - 1; v++) if (x > this.map[v][0] && x <= this.map[v + 1][0]) {
        const P = this.map[v][0], z = this.map[v + 1][0];
        c.setHex(this.map[v][1], In), m.setHex(this.map[v + 1][1], In);
        const b = new Zt().lerpColors(c, m, (x - P) / (z - P));
        this.lut.push(b);
      }
    }
    return this.lut.push(new Zt(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Ss.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const p = Math.round(l * this.n);
    return this.lut[p];
  }
  addColorMap(l, p) {
    return ho[l] = p, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const p = l.getContext("2d", { alpha: false }), h = p.getImageData(0, 0, 1, this.n), c = h.data;
    let m = 0;
    const d = 1 / this.n, x = new Zt(), v = new Zt(), P = new Zt();
    for (let z = 1; z >= 0; z -= d) for (let b = this.map.length - 1; b >= 0; b--) if (z < this.map[b][0] && z >= this.map[b - 1][0]) {
      const q = this.map[b - 1][0], xe = this.map[b][0];
      x.setHex(this.map[b - 1][1], In), v.setHex(this.map[b][1], In), P.lerpColors(x, v, (z - q) / (xe - q)), c[m * 4] = Math.round(P.r * 255), c[m * 4 + 1] = Math.round(P.g * 255), c[m * 4 + 2] = Math.round(P.b * 255), c[m * 4 + 3] = 255, m += 1;
    }
    return p.putImageData(h, 0, 0), l;
  }
}
const ho = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ss = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Ns = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ss, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Zn = K.state("safe"), as = K.state("auto");
function is(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Ns[Zn.val] ?? ss;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, m, d, x] = l[h], [v, P, z, b] = l[h + 1];
    if (e <= v) {
      const q = (e - c) / (v - c);
      return [m + (P - m) * q, d + (z - d) * q, x + (b - x) * q];
    }
  }
  const p = l[l.length - 1];
  return [p[1], p[2], p[3]];
}
function Ko() {
  const l = new Uint8Array(1024);
  for (let h = 0; h < 256; h++) {
    const c = h / 255, [m, d, x] = is(c);
    l[h * 4 + 0] = m, l[h * 4 + 1] = d, l[h * 4 + 2] = x, l[h * 4 + 3] = 255;
  }
  const p = new Cs(l, 256, 1, zs);
  return p.minFilter = Do, p.magFilter = Do, p.wrapS = Bo, p.wrapT = Bo, p.needsUpdate = true, p;
}
function Ys() {
  const l = [];
  for (let p = 0; p <= 12; p++) {
    const h = 1 - p / 12, [c, m, d] = is(h);
    l.push(`rgb(${c | 0},${m | 0},${d | 0}) ${(p / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function vo(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((m, d) => m - d), p = (m) => l[Math.min(l.length - 1, Math.max(0, Math.round(m * (l.length - 1))))];
  let h = l.length >= 20 ? p(0.01) : l[0], c = l.length >= 20 ? p(0.99) : l[l.length - 1];
  return h >= 0 && c > 0 && (h = 0), c <= 0 && h < 0 && (c = 0), [h, c];
}
function Us(e, l, p) {
  new os();
  const h = Ko(), c = new ks({ uniforms: { cmap: { value: h }, ambient: { value: 0.95 } }, vertexShader: `
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
  K.derive(() => {
    var _a2;
    Zn.val;
    const d = c.uniforms.cmap.value;
    c.uniforms.cmap.value = Ko(), (_a2 = d == null ? void 0 : d.dispose) == null ? void 0 : _a2.call(d);
  });
  const m = new Oe(new Pe(), c);
  return m.renderOrder = -1, m.frustumCulled = false, m.userData.isShellArea = true, m.name = "__hekatan_shell_colormap", K.derive(() => {
    m.geometry.setAttribute("position", new bt(e.val.flat(), 3));
    const d = [], x = [], v = [];
    l.val.forEach((J, Se) => {
      J.length === 3 ? (d.push(J[0], J[1], J[2]), x.push(Se), v.push(0)) : J.length === 4 && (d.push(J[0], J[1], J[2]), d.push(J[0], J[2], J[3]), x.push(Se, Se), v.push(0, 1));
    }), m.geometry.setIndex(new Ps(d, 1)), m.userData.faceToElem = x, m.userData.faceLocal = v;
    const P = p.val.filter((J) => Number.isFinite(J));
    let z, b;
    const q = zn.val;
    if (q ? (b = q[0], z = q[1]) : [b, z] = vo(P), z === b) {
      const J = Math.max(Math.abs(z) * 1e-6, 1e-9);
      z += J, b -= J;
    }
    const xe = q && q[0] > q[1], ce = Math.min(b, z), se = Math.max(b, z), A = se - ce, ae = new Float32Array(p.val.length);
    for (let J = 0; J < p.val.length; J++) {
      const Se = p.val[J];
      if (!Number.isFinite(Se)) {
        ae[J] = -1;
        continue;
      }
      const X = ((xe ? se + ce - Se : Se) - ce) / A;
      ae[J] = Math.max(0, Math.min(1, X));
    }
    m.geometry.setAttribute("scalar", new ft(ae, 1));
  }), m;
}
function Zs(e, l, p) {
  const h = document.createElement("div"), c = new ns({ title: "Settings", expanded: true, container: h });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(c), h.setAttribute("id", "settings");
  const m = "hk_settingsPos";
  let d = null;
  try {
    const b = localStorage.getItem(m);
    b && (d = JSON.parse(b));
  } catch {
  }
  h.style.cssText = ["position:fixed", d ? `left:${d.left}px` : "left:8px", d ? `top:${d.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const x = () => {
    const b = h.querySelector(".tp-rotv_b");
    if (!b) {
      setTimeout(x, 200);
      return;
    }
    b.style.cursor = "move", b.style.userSelect = "none";
    let q = false, xe = 0, ce = 0, se = 0, A = 0;
    b.addEventListener("mousedown", (ae) => {
      q = true, xe = ae.clientX, ce = ae.clientY;
      const J = h.getBoundingClientRect();
      se = J.left, A = J.top, h.style.left = `${se}px`, h.style.top = `${A}px`;
    }), window.addEventListener("mousemove", (ae) => {
      if (!q) return;
      const J = ae.clientX - xe, Se = ae.clientY - ce, Me = Math.max(0, Math.min(window.innerWidth - 40, se + J)), X = Math.max(0, Math.min(window.innerHeight - 40, A + Se));
      h.style.left = `${Me}px`, h.style.top = `${X}px`;
    }), window.addEventListener("mouseup", () => {
      if (q) {
        q = false;
        try {
          localStorage.setItem(m, JSON.stringify({ left: parseFloat(h.style.left), top: parseFloat(h.style.top) }));
        } catch {
        }
      }
    });
  };
  if (x(), l == null ? void 0 : l.nodes) {
    c.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const b = c.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    b.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), b.addBinding(e.gridStep, "val", { label: "Separaci\xF3n grid (m)", min: 0.05, max: 5, step: 0.05 }), b.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), b.addBinding(e.cursorSnap, "val", { label: "Paso cursor (m)", min: 0.05, max: 5, step: 0.05 }), b.addBinding(e.gridVisible, "val", { label: "Mostrar" }), b.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 }), b.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), b.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), b.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const q = c.addFolder({ title: "\u{1F441} Ver", expanded: false });
    q.addBinding(e.nodes, "val", { label: "Nodes" }), q.addBinding(e.elements, "val", { label: "Elements" }), q.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), q.addBinding(e.faces, "val", { label: "  Caras (fill)" }), q.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), q.addBinding(e.elemColumns, "val", { label: "    Columnas" }), q.addBinding(e.elemBeams, "val", { label: "    Vigas" }), q.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), q.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), q.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), q.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), q.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), q.addBinding(e.orientations, "val", { label: "Orientations" }), q.addBinding(e.sections, "val", { label: "Sections" }), q.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), q.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), q.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), q.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), q.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const b = c.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    b.addBinding(e.supports, "val", { label: "Supports" }), b.addBinding(e.loads, "val", { label: "Loads" }), b.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), b.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const b = c.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = b, b.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), b.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), b.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), b.addBinding(Zn, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), b.addBinding(as, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), b.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), b.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), b.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), b.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  p && c.addBinding(e.solids, "val", { label: "Solids" });
  const v = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), P = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), z = () => {
    const b = window.__hekatanClipApply;
    typeof b == "function" && b();
  };
  return v.addBinding(P, "enableX", { label: "Cortar X" }).on("change", z), v.addBinding(P, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", z), v.addBinding(P, "invertX", { label: "  invertir X" }).on("change", z), v.addBinding(P, "enableY", { label: "Cortar Y" }).on("change", z), v.addBinding(P, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", z), v.addBinding(P, "invertY", { label: "  invertir Y" }).on("change", z), v.addBinding(P, "enableZ", { label: "Cortar Z" }).on("change", z), v.addBinding(P, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", z), v.addBinding(P, "invertZ", { label: "  invertir Z" }).on("change", z), h;
}
function qs(e) {
  return { gridSize: K.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: K.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: K.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: K.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: K.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: K.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: K.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: K.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: K.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: K.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: K.state((e == null ? void 0 : e.nodes) ?? true), elements: K.state((e == null ? void 0 : e.elements) ?? true), edges: K.state((e == null ? void 0 : e.edges) ?? true), faces: K.state((e == null ? void 0 : e.faces) ?? true), elemColumns: K.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: K.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: K.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: K.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: K.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: K.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: K.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: K.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: K.state((e == null ? void 0 : e.orientations) ?? false), sections: K.state((e == null ? void 0 : e.sections) ?? true), extruded: K.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: K.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: K.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: K.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: K.state((e == null ? void 0 : e.secFloor) ?? -1), supports: K.state((e == null ? void 0 : e.supports) ?? true), loads: K.state((e == null ? void 0 : e.loads) ?? false), deformedShape: K.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: K.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: K.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: K.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: K.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: K.state((e == null ? void 0 : e.flipAxes) ?? false), solids: K.state((e == null ? void 0 : e.solids) ?? true), custom3D: K.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: K.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: K.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: K.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function Ks(e, l, p) {
  const h = an(), c = new Xn(new Pe(), new Nn({ color: h.nodePoint }));
  return jo((m, d) => {
    c.material.color.setHex(d.nodePoint);
  }), c.frustumCulled = false, K.derive(() => {
    e.nodes.val && c.geometry.setAttribute("position", new bt(l.val.flat(), 3));
  }), K.derive(() => {
    if (p.val, l.val, !e.nodes.rawVal) return;
    const m = l.rawVal ?? [];
    let d = e.gridSize.val * 0.5;
    if (m.length >= 2) {
      const v = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
      for (const z of m) for (let b = 0; b < 3; b++) v[b] = Math.min(v[b], z[b]), P[b] = Math.max(P[b], z[b]);
      d = Math.max(P[0] - v[0], P[1] - v[1], P[2] - v[2], 0.1);
    }
    const x = 0.03 * d;
    c.material.size = x * p.rawVal;
  }), K.derive(() => {
    c.visible = e.nodes.val;
  }), c;
}
function mo(e, l) {
  const p = an(), h = new tt();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let m = (l == null ? void 0 : l.majorStep) ?? 1, d = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (m <= 0 && (m = 1), d <= 0 && (d = 0.1); e / d > 500; ) d *= 2;
  for (; e / m > 100; ) m *= 2;
  const x = e / 2;
  m = Math.max(d, Math.round(m / d) * d);
  const P = new Zt(p.grid), z = new Zt(p.grid).multiplyScalar(0.45), b = (se, A, ae, J) => {
    const Se = [], Me = se === "xy" ? (T, N) => [T, N, 0] : se === "xz" ? (T, N) => [T, 0, N] : (T, N) => [0, T, N], X = Math.floor(x / A);
    for (let T = -X; T <= X; T++) {
      const N = T * A, D = Me(N, -x), $ = Me(N, x);
      Se.push(...D, ...$);
    }
    for (let T = -X; T <= X; T++) {
      const N = T * A, D = Me(-x, N), $ = Me(x, N);
      Se.push(...D, ...$);
    }
    const I = new Pe();
    I.setAttribute("position", new bt(Se, 3));
    const U = new ht({ color: ae, transparent: true, opacity: J, depthWrite: false }), V = new Kt(I, U);
    return V.name = `grid-${se}-${A === d ? "minor" : "major"}`, V;
  }, q = (se, A, ae) => {
    const J = se === "xy" ? (V, T) => [V, T, 0] : se === "xz" ? (V, T) => [V, 0, T] : (V, T) => [0, V, T], Se = [[-x, -x], [x, -x], [x, x], [-x, x]], Me = [];
    for (const [V, T] of Se) Me.push(...J(V, T));
    const X = new Pe();
    X.setAttribute("position", new bt(Me, 3));
    const I = new ht({ color: A, transparent: true, opacity: ae, depthWrite: false }), U = new es(X, I);
    return U.name = `grid-${se}-border`, U.renderOrder = 1, U;
  }, xe = (se, A, ae) => {
    const J = se === "xy" ? (I, U) => [I, U, 0] : se === "xz" ? (I, U) => [I, 0, U] : (I, U) => [0, I, U], Se = A === "u" ? [...J(-x, 0), ...J(x, 0)] : [...J(0, -x), ...J(0, x)], Me = new Pe();
    Me.setAttribute("position", new bt(Se, 3));
    const X = new Kt(Me, new ht({ color: ae, transparent: true, opacity: 0.45, depthWrite: false }));
    return X.name = `grid-${se}-eje-${A}`, X.renderOrder = 1, X;
  }, ce = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of c) {
    h.add(b(se, d, z, 0.12)), h.add(b(se, m, P, 0.4));
    const [A, ae] = ce[se];
    h.add(xe(se, "u", A)), h.add(xe(se, "v", ae)), h.add(q(se, P, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: m, minorStep: d, gridSize: e, planes: [...c] }, h;
}
function Gs(e, l, p, h) {
  const c = new tt(), m = new Fs(0.5, 0.5, 0.5), d = new As(0.45, 0.7, 4);
  d.rotateX(Math.PI / 2), d.translate(0, 0, -0.35);
  const x = new it({ color: 10166822 }), v = new it({ color: 2792847 }), P = new it({ color: 3835647 }), z = () => {
    const xe = p.rawVal ?? [];
    if (xe.length < 2) return l.gridSize.val * 0.5;
    let ce = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const A of xe) for (let ae = 0; ae < 3; ae++) A[ae] < ce[ae] && (ce[ae] = A[ae]), A[ae] > se[ae] && (se[ae] = A[ae]);
    return Math.max(se[0] - ce[0], se[1] - ce[1], se[2] - ce[2], 0.1);
  }, b = () => 0.08 * z(), q = () => h.rawVal;
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const xe = b();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((ce, se) => {
      const A = p.val[se];
      if (!A) return;
      const ae = ce ?? [], J = (ae[0] ? 1 : 0) + (ae[1] ? 1 : 0) + (ae[2] ? 1 : 0), Se = (ae[3] ? 1 : 0) + (ae[4] ? 1 : 0) + (ae[5] ? 1 : 0);
      let Me;
      J >= 3 && Se >= 3 ? Me = new Oe(m, x) : J >= 3 && Se === 0 ? Me = new Oe(d, v) : Me = new Oe(d, P), Me.position.set(A[0], A[1], A[2]);
      const X = xe * q();
      Me.scale.set(X, X, X), c.add(Me);
    });
  }), K.derive(() => {
    if (h.val, !l.supports.rawVal) return;
    const ce = b() * q();
    c.children.forEach((se) => se.scale.set(ce, ce, ce));
  }), K.derive(() => {
    c.visible = l.supports.val;
  }), c;
}
function Hs(e, l, p, h) {
  const c = new tt();
  c.name = "loadsGroup";
  function m(d) {
    if (d.length < 2) return 0.12 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], v = [-1 / 0, -1 / 0, -1 / 0];
    for (const z of d) for (let b = 0; b < 3; b++) x[b] = Math.min(x[b], z[b]), v[b] = Math.max(v[b], z[b]);
    return 0.08 * Math.max(v[0] - x[0], v[1] - x[1], v[2] - x[2], 0.1);
  }
  return K.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((b) => b.dispose()), c.clear();
    const d = p.val, x = m(d), v = 240, P = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((b, q) => {
      d[q] && b.slice(0, 3).some((xe) => Math.abs(xe) > 1e-15) && P.push(q);
    });
    let z = P;
    if (P.length > v) {
      const b = P.map((V) => d[V][0]), q = P.map((V) => d[V][1]), xe = Math.min(...b), ce = Math.max(...b), se = Math.min(...q), A = Math.max(...q), ae = P.map((V) => d[V][2]), J = Math.max(1e-6, (Math.max(...ae) - Math.min(...ae)) / 40), Se = (V) => Math.round(V / J), Me = new Set(ae.map(Se)), X = Math.max(4, Math.floor(v / Math.max(1, Me.size))), I = Math.max(2, Math.round(Math.sqrt(X))), U = /* @__PURE__ */ new Map();
      for (const V of P) {
        const T = ce - xe < 1e-9 ? 0 : (d[V][0] - xe) / (ce - xe), N = A - se < 1e-9 ? 0 : (d[V][1] - se) / (A - se), D = Math.min(I - 1, Math.floor(T * I)), $ = Math.min(I - 1, Math.floor(N * I)), ee = `${D},${$},${Se(d[V][2])}`, fe = Math.hypot(T * I - (D + 0.5), N * I - ($ + 0.5)), ie = U.get(ee);
        (!ie || fe < ie.d) && U.set(ee, { i: V, d: fe });
      }
      z = [...U.values()].map((V) => V.i);
    }
    for (const b of z) {
      const q = e.nodeInputs.val.loads.get(b), xe = d[b];
      if (!xe) continue;
      const ce = new S(...q.slice(0, 3));
      if (ce.lengthSq() < 1e-30) continue;
      ce.normalize();
      const se = new sn(ce, new S(...xe), 1, 15637248, 0.3, 0.3), A = x * h.rawVal;
      se.scale.set(A, A, A), c.add(se);
    }
  }), K.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const x = m(p.rawVal) * h.rawVal;
    c.children.forEach((v) => v.scale.set(x, x, x));
  }), K.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function Ws(e, l, p) {
  const h = new tt();
  return K.derive(() => {
    if (!e.nodesIndexes.val) return;
    h.children.forEach((m) => m.dispose()), h.clear();
    const c = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((m, d) => {
      const x = new Pt(`${d}`);
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
function Js(e, l, p, h) {
  const c = new tt();
  return K.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    c.children.forEach((d) => d.dispose()), c.clear();
    const m = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((d, x) => {
      const v = new Pt(`${x}`, void 0, "#001219");
      v.position.set(...Os(d.map((P) => p.rawVal[P]))), v.updateScale(m * h.rawVal), c.add(v);
    });
  }), K.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const m = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((d) => d.updateScale(m * h.rawVal));
  }), K.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function Os(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function Go(e, l) {
  const p = new tt(), h = Math.min(0.05 * e, 0.6), c = an(), m = new Pt("X", "red", "transparent"), d = new Pt(l ? "Z" : "Y", "green", "transparent"), x = new Pt(l ? "Y" : "Z", "blue", "transparent"), v = new sn(new S(1, 0, 0), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), P = new sn(new S(0, 1, 0), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), z = new sn(new S(0, 0, 1), new S(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return m.position.set(1.3 * h, 0, 0), d.position.set(0, 1.3 * h, 0), x.position.set(0, 0, 1.3 * h), m.updateScale(0.4 * h), d.updateScale(0.4 * h), x.updateScale(0.4 * h), v.scale.set(h, h, h), P.scale.set(h, h, h), z.scale.set(h, h, h), p.add(v, P, z, m, d, x), p;
}
function qn(e, l) {
  const p = new S(...e), c = new S(...l).clone().sub(p), m = c.length(), d = c.dot(new S(1, 0, 0)) / m, x = c.dot(new S(0, 1, 0)) / m, v = c.dot(new S(0, 0, 1)) / m, P = Math.sqrt(d ** 2 + x ** 2);
  let z = new co().fromArray([[d, x, v], [-x / P, d / P, 0], [-d * v / P, -x * v / P, P]].flat());
  return v === 1 && (z = new co().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), v === -1 && (z = new co().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new go().setFromMatrix3(z);
}
function yo(e, l) {
  return e == null ? void 0 : e.map((p, h) => (9 * p + l[h]) / 10);
}
function Cn(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function Qs(e, l, p) {
  const h = Cn([l, p]), c = Cn([e, p]), m = Cn([e, l]), d = new S(...h).sub(new S(...c)).normalize(), x = new S(...p).sub(new S(...m)).normalize(), v = d.clone().cross(x).normalize(), P = v.clone().cross(d).normalize();
  return new go().makeBasis(d, P, v);
}
function js(e, l, p, h) {
  const c = new tt(), m = new Pe(), d = new ht({ vertexColors: true }), x = [0, 0, 0], v = [1, 0, 0], P = [0, 1, 0], z = [0, 0, 1];
  m.setAttribute("position", new bt([...x, ...v, ...x, ...P, ...x, ...z], 3));
  const b = [255, 0, 0], q = [0, 255, 0], xe = [0, 0, 255];
  return m.setAttribute("color", new bt([...b, ...b, ...q, ...q, ...xe, ...xe], 3)), K.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((ce) => {
      const se = new Kt(m, d), A = p.rawVal[ce[0]], ae = p.rawVal[ce[1]];
      if (ce.length === 2 && (se.position.set(...yo(A, ae)), se.rotation.setFromRotationMatrix(qn(A, ae))), ce.length === 3) {
        const Me = p.rawVal[ce[2]];
        se.position.set(...Cn([A, ae, Me])), se.rotation.setFromRotationMatrix(Qs(A, ae, Me));
      }
      const Se = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      se.scale.set(Se, Se, Se), c.add(se);
    }));
  }), K.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((A) => A.scale.set(se, se, se));
  }), K.derive(() => {
    c.visible = l.orientations.val;
  }), c;
}
function ea(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), p = (e.h * 100).toFixed(0);
    return `${l}x${p}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ta(e, l, p, h) {
  const c = new tt(), m = new tt();
  c.add(m);
  function d(I, U) {
    const V = I / 2, T = U / 2, N = new Float32Array([0, -V, -T, 0, V, -T, 0, V, T, 0, -V, -T, 0, V, T, 0, -V, T]), D = new Pe();
    D.setAttribute("position", new ft(N, 3));
    const $ = new Float32Array([0, -V, -T, 0, V, -T, 0, V, T, 0, -V, T, 0, -V, -T]), ee = new Pe();
    return ee.setAttribute("position", new ft($, 3)), { fill: D, outline: ee };
  }
  function x(I, U = 24) {
    const V = I / 2, T = new Float32Array(U * 9);
    for (let ee = 0; ee < U; ee++) {
      const fe = ee / U * Math.PI * 2, ie = (ee + 1) / U * Math.PI * 2;
      T[ee * 9] = 0, T[ee * 9 + 1] = 0, T[ee * 9 + 2] = 0, T[ee * 9 + 3] = 0, T[ee * 9 + 4] = V * Math.cos(fe), T[ee * 9 + 5] = V * Math.sin(fe), T[ee * 9 + 6] = 0, T[ee * 9 + 7] = V * Math.cos(ie), T[ee * 9 + 8] = V * Math.sin(ie);
    }
    const N = new Pe();
    N.setAttribute("position", new ft(T, 3));
    const D = new Float32Array((U + 1) * 3);
    for (let ee = 0; ee <= U; ee++) {
      const fe = ee / U * Math.PI * 2;
      D[ee * 3] = 0, D[ee * 3 + 1] = V * Math.cos(fe), D[ee * 3 + 2] = V * Math.sin(fe);
    }
    const $ = new Pe();
    return $.setAttribute("position", new ft(D, 3)), { fill: N, outline: $ };
  }
  function v(I, U, V, T) {
    const N = V ?? U * 0.08, D = T ?? I * 0.07, $ = I / 2, ee = U / 2, fe = ee - N, ie = D / 2, oe = [];
    function L(ye, $e, ke, Ie) {
      oe.push(0, ye, $e, 0, ke, $e, 0, ke, Ie, 0, ye, $e, 0, ke, Ie, 0, ye, Ie);
    }
    L(-$, -ee, $, -fe), L(-ie, -fe, ie, fe), L(-$, fe, $, ee);
    const de = new Pe();
    de.setAttribute("position", new ft(new Float32Array(oe), 3));
    const H = new Float32Array([0, -$, -ee, 0, $, -ee, 0, $, -fe, 0, ie, -fe, 0, ie, fe, 0, $, fe, 0, $, ee, 0, -$, ee, 0, -$, fe, 0, -ie, fe, 0, -ie, -fe, 0, -$, -fe, 0, -$, -ee]), me = new Pe();
    return me.setAttribute("position", new ft(H, 3)), { fill: de, outline: me };
  }
  function P(I, U, V) {
    const T = I / 2, N = U / 2, D = T - V, $ = N - V, ee = [];
    function fe(de, H, me, ye) {
      ee.push(0, de, H, 0, me, H, 0, me, ye, 0, de, H, 0, me, ye, 0, de, ye);
    }
    fe(-T, -N, T, -$), fe(-T, $, T, N), fe(-T, -$, -D, $), fe(D, -$, T, $);
    const ie = new Pe();
    ie.setAttribute("position", new ft(new Float32Array(ee), 3));
    const oe = new Float32Array([0, -T, -N, 0, T, -N, 0, T, -N, 0, T, N, 0, T, N, 0, -T, N, 0, -T, N, 0, -T, -N, 0, -D, -$, 0, D, -$, 0, D, -$, 0, D, $, 0, D, $, 0, -D, $, 0, -D, $, 0, -D, -$]), L = new Pe();
    return L.setAttribute("position", new ft(oe, 3)), { fill: ie, outline: L };
  }
  function z(I, U, V) {
    const T = I / 2, N = U / 2, D = T - V, $ = N - V, ee = new Pe(), fe = new Float32Array([0, -D, -$, 0, D, -$, 0, D, $, 0, -D, -$, 0, D, $, 0, -D, $]);
    ee.setAttribute("position", new ft(fe, 3));
    const ie = [];
    function oe(me, ye, $e, ke) {
      ie.push(0, me, ye, 0, $e, ye, 0, $e, ke, 0, me, ye, 0, $e, ke, 0, me, ke);
    }
    oe(-T, -N, T, -$), oe(-T, $, T, N), oe(-T, -$, -D, $), oe(D, -$, T, $);
    const L = new Pe();
    L.setAttribute("position", new ft(new Float32Array(ie), 3));
    const de = new Float32Array([0, -T, -N, 0, T, -N, 0, T, -N, 0, T, N, 0, T, N, 0, -T, N, 0, -T, N, 0, -T, -N, 0, -D, -$, 0, D, -$, 0, D, -$, 0, D, $, 0, D, $, 0, -D, $, 0, -D, $, 0, -D, -$]), H = new Pe();
    return H.setAttribute("position", new ft(de, 3)), { concFill: ee, steelFillGeom: L, outline: H };
  }
  function b(I, U, V) {
    const T = [], N = [[0, -I / 2, -U / 2], [0, -I / 2 + V, -U / 2], [0, -I / 2 + V, U / 2 - V], [0, I / 2, U / 2 - V], [0, I / 2, U / 2], [0, -I / 2, U / 2]], D = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ie of D) T.push(...N[ie]);
    const $ = new Pe();
    $.setAttribute("position", new ft(new Float32Array(T), 3));
    const ee = [];
    for (let ie = 0; ie < N.length; ie++) {
      const oe = (ie + 1) % N.length;
      ee.push(...N[ie], ...N[oe]);
    }
    const fe = new Pe();
    return fe.setAttribute("position", new ft(new Float32Array(ee), 3)), { fill: $, outline: fe };
  }
  function q(I, U, V, T) {
    const N = T / 2, D = [], $ = [[0, -I - N, -U / 2], [0, -V - N, -U / 2], [0, -V - N, U / 2 - V], [0, -N, U / 2 - V], [0, -N, U / 2], [0, -I - N, U / 2]], ee = [[0, N, -U / 2], [0, N + V, -U / 2], [0, N + V, U / 2 - V], [0, I + N, U / 2 - V], [0, I + N, U / 2], [0, N, U / 2]], fe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const de of fe) D.push(...$[de]);
    for (const de of fe) D.push(...ee[de]);
    const ie = new Pe();
    ie.setAttribute("position", new ft(new Float32Array(D), 3));
    const oe = [];
    for (const de of [$, ee]) for (let H = 0; H < de.length; H++) {
      const me = (H + 1) % de.length;
      oe.push(...de[H], ...de[me]);
    }
    const L = new Pe();
    return L.setAttribute("position", new ft(new Float32Array(oe), 3)), { fill: ie, outline: L };
  }
  function xe(I, U, V, T) {
    const N = U / 2, D = I, $ = [[0, -D, -N], [0, -D, -N + V], [0, -T, -N + V], [0, -T, N - V], [0, -D, N - V], [0, -D, N], [0, 0, N], [0, 0, -N]], ee = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], fe = [];
    for (const de of ee) fe.push(...$[de]);
    const ie = new Pe();
    ie.setAttribute("position", new ft(new Float32Array(fe), 3));
    const oe = [];
    for (let de = 0; de < $.length; de++) {
      const H = (de + 1) % $.length;
      oe.push(...$[de], ...$[H]);
    }
    const L = new Pe();
    return L.setAttribute("position", new ft(new Float32Array(oe), 3)), { fill: ie, outline: L };
  }
  function ce(I, U, V, T, N) {
    const D = U / 2, $ = N / 2, ee = [], fe = [[0, -I, -D], [0, -I, -D + V], [0, -$ - T, -D + V], [0, -$ - T, D - V], [0, -I, D - V], [0, -I, D], [0, -$, D], [0, -$, -D]], ie = fe.map((me) => [me[0], -me[1], me[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const me of oe) ee.push(...fe[me]);
    for (const me of oe) ee.push(...ie[me]);
    const L = new Pe();
    L.setAttribute("position", new ft(new Float32Array(ee), 3));
    const de = [];
    for (const me of [fe, ie]) for (let ye = 0; ye < me.length; ye++) {
      const $e = (ye + 1) % me.length;
      de.push(...me[ye], ...me[$e]);
    }
    const H = new Pe();
    return H.setAttribute("position", new ft(new Float32Array(de), 3)), { fill: L, outline: H };
  }
  function se(I, U, V, T) {
    const N = I / 2, D = U / 2, $ = T / 2, ee = [[0, -$, -D], [0, $, -D], [0, $, D - V], [0, N, D - V], [0, N, D], [0, -N, D], [0, -N, D - V], [0, -$, D - V]], fe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], ie = [];
    for (const H of fe) ie.push(...ee[H]);
    const oe = new Pe();
    oe.setAttribute("position", new ft(new Float32Array(ie), 3));
    const L = [];
    for (let H = 0; H < ee.length; H++) {
      const me = (H + 1) % ee.length;
      L.push(...ee[H], ...ee[me]);
    }
    const de = new Pe();
    return de.setAttribute("position", new ft(new Float32Array(L), 3)), { fill: oe, outline: de };
  }
  function A(I, U, V = 24) {
    const T = I / 2, N = T - U, D = [];
    for (let ie = 0; ie < V; ie++) {
      const oe = ie / V * Math.PI * 2, L = (ie + 1) / V * Math.PI * 2, de = Math.cos(oe), H = Math.sin(oe), me = Math.cos(L), ye = Math.sin(L);
      D.push(0, T * de, T * H, 0, T * me, T * ye, 0, N * me, N * ye), D.push(0, T * de, T * H, 0, N * me, N * ye, 0, N * de, N * H);
    }
    const $ = new Pe();
    $.setAttribute("position", new ft(new Float32Array(D), 3));
    const ee = [];
    for (let ie = 0; ie < V; ie++) {
      const oe = ie / V * Math.PI * 2, L = (ie + 1) / V * Math.PI * 2;
      ee.push(0, T * Math.cos(oe), T * Math.sin(oe), 0, T * Math.cos(L), T * Math.sin(L)), ee.push(0, N * Math.cos(oe), N * Math.sin(oe), 0, N * Math.cos(L), N * Math.sin(L));
    }
    const fe = new Pe();
    return fe.setAttribute("position", new ft(new Float32Array(ee), 3)), { fill: $, outline: fe };
  }
  const ae = new it({ color: 52479, transparent: true, opacity: 0.35, side: Ct, depthWrite: false }), J = new ht({ color: 52479 }), Se = new it({ color: 16750848, transparent: true, opacity: 0.4, side: Ct, depthWrite: false }), Me = new ht({ color: 16750848 });
  function X(I, U) {
    const V = Math.abs(U[0] - I[0]), T = Math.abs(U[1] - I[1]), N = Math.abs(U[2] - I[2]);
    return N > V && N > T || T > V && T > N;
  }
  return K.derive(() => {
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
    const N = T.sectionShapes, D = l.secFloor.rawVal;
    V.forEach(($, ee) => {
      if ($.length !== 2) return;
      const fe = p.rawVal[$[0]], ie = p.rawVal[$[1]];
      if (!fe || !ie) return;
      const oe = X(fe, ie);
      if (oe && !I || !oe && !U) return;
      if (D >= 0) {
        const ye = Math.min(fe[1], ie[1]);
        Math.max(fe[1], ie[1]);
        const $e = l.gridSize.rawVal || 3;
        if (Math.floor(ye / $e + 0.01) !== D) return;
      }
      const L = N == null ? void 0 : N.get(ee);
      if (!L) return;
      const de = [(fe[0] + ie[0]) / 2, (fe[1] + ie[1]) / 2, (fe[2] + ie[2]) / 2], H = qn(fe, ie);
      if (L.type === "CFT") {
        const ye = z(L.b, L.h, L.tw ?? L.b * 0.05), $e = new Oe(ye.concFill, ae);
        $e.position.set(...de), $e.rotation.setFromRotationMatrix(H), c.add($e);
        const ke = new Oe(ye.steelFillGeom, Se);
        ke.position.set(...de), ke.rotation.setFromRotationMatrix(H), c.add(ke);
        const Ie = new Ft(ye.outline, Me);
        Ie.position.set(...de), Ie.rotation.setFromRotationMatrix(H), c.add(Ie);
      } else {
        let ye, $e, ke;
        switch (L.type) {
          case "rect":
            ye = d(L.b, L.h), $e = ae, ke = J;
            break;
          case "circ":
            ye = x(L.d), $e = ae, ke = J;
            break;
          case "I":
            ye = v(L.b, L.h, L.tf, L.tw), $e = Se, ke = Me;
            break;
          case "HSS":
            ye = P(L.b, L.h, L.tw ?? L.b * 0.05), $e = Se, ke = Me;
            break;
          case "CFT":
            ye = z(L.b, L.h, L.tw ?? L.b * 0.05), $e = Se, ke = Me;
            break;
          case "L":
            ye = b(L.b ?? L.h, L.h, L.t ?? L.tw ?? 3e-3), $e = Se, ke = Me;
            break;
          case "2L":
            ye = q(L.b ?? L.h, L.h, L.t ?? L.tw ?? 3e-3, L.dis ?? 0.01), $e = Se, ke = Me;
            break;
          case "C":
          case "coldC":
            ye = xe(L.b, L.h, L.tf ?? L.t ?? 3e-3, L.tw ?? L.t ?? 3e-3), $e = Se, ke = Me;
            break;
          case "2C":
            ye = ce(L.b, L.h, L.tf ?? 5e-3, L.tw ?? 5e-3, L.dis ?? 0.01), $e = Se, ke = Me;
            break;
          case "T":
            ye = se(L.b, L.h, L.tf ?? 0.01, L.tw ?? 6e-3), $e = Se, ke = Me;
            break;
          case "pipe":
            ye = A(L.d, L.tw ?? L.d * 0.05), $e = Se, ke = Me;
            break;
          default:
            return;
        }
        const Ie = new Oe(ye.fill, $e);
        Ie.position.set(...de), Ie.rotation.setFromRotationMatrix(H), c.add(Ie);
        const Qe = new Ft(ye.outline, ke);
        Qe.position.set(...de), Qe.rotation.setFromRotationMatrix(H), c.add(Qe);
      }
      const me = ea(L);
      if (me) {
        const $e = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(L.type) ? "#ff9900" : "#00ccff", ke = new Pt(me, $e, "transparent");
        ke.position.set(de[0], de[1], de[2]);
        const Ie = 0.05 * l.gridSize.rawVal * 0.5;
        ke.updateScale(Ie * ((h == null ? void 0 : h.rawVal) ?? 1)), m.add(ke);
      }
    });
  }), h && K.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const I = 0.05 * l.gridSize.val * 0.5;
    m.children.forEach((U) => {
      U instanceof Pt && U.updateScale(I * h.rawVal);
    });
  }), K.derive(() => {
    c.visible = l.sections.val;
  }), K.derive(() => {
    m.visible = l.sectionLabels.val;
  }), c;
}
function na(e) {
  if (!e) return null;
  const l = e.type, p = (z, b) => [z, b], h = (z, b) => [p(-z / 2, -b / 2), p(z / 2, -b / 2), p(z / 2, b / 2), p(-z / 2, b / 2)], c = (z, b = 24) => {
    const q = z / 2, xe = [];
    for (let ce = 0; ce < b; ce++) {
      const se = 2 * Math.PI * ce / b;
      xe.push(p(q * Math.cos(se), q * Math.sin(se)));
    }
    return xe;
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
function oa(e, l, p) {
  if (!e || e <= 0 || !l || !p || l <= 0 || p <= 0) return null;
  const h = Math.sqrt(Math.sqrt(p / l)), c = Math.sqrt(e / h), m = e / c;
  return !isFinite(c) || !isFinite(m) || c <= 0 || m <= 0 ? null : { contorno: [[-c / 2, -m / 2], [c / 2, -m / 2], [c / 2, m / 2], [-c / 2, m / 2]] };
}
function sa(e) {
  const l = new Pn();
  e.contorno.forEach(([p, h], c) => c ? l.lineTo(p, h) : l.moveTo(p, h)), l.closePath();
  for (const p of e.huecos ?? []) {
    const h = new Ts();
    p.forEach(([c, m], d) => d ? h.lineTo(c, m) : h.moveTo(c, m)), h.closePath(), l.holes.push(h);
  }
  return l;
}
function aa(e, l, p) {
  const h = new tt();
  h.name = "extrusion";
  const c = new po({ color: 8369151, transparent: true, opacity: 0.92, side: Ct }), m = new po({ color: 12623968, transparent: true, opacity: 0.85, side: Ct }), d = new po({ color: 11583173, transparent: true, opacity: 0.85, side: Ct }), x = new tt();
  x.add(new ts(16777215, 0.55));
  const v = new Un(16777215, 0.75);
  v.position.set(30, 25, 40);
  const P = new Un(16777215, 0.35);
  P.position.set(-25, -20, 15), x.add(v, P);
  let z = 0;
  return K.derive(() => {
    var _a2, _b, _c, _d, _e;
    const b = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++z, on: b }, h.visible = b;
    for (const J of [...h.children]) J !== x && (h.remove(J), (_c = (_b = J.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(x) || h.add(x), !b) return;
    const q = p.val ?? [], xe = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], ce = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = ce.sectionShapes ?? /* @__PURE__ */ new Map(), A = ce.thicknesses ?? /* @__PURE__ */ new Map();
    let ae = "";
    try {
      xe.forEach((J, Se) => {
        var _a3, _b2, _c2;
        if (J.length === 2) {
          let Me = na(se.get(Se)), X = true;
          if (Me || (Me = oa((_a3 = ce.areas) == null ? void 0 : _a3.get(Se), (_b2 = ce.momentsOfInertiaY) == null ? void 0 : _b2.get(Se), (_c2 = ce.momentsOfInertiaZ) == null ? void 0 : _c2.get(Se)), X = false), !Me) return;
          const I = q[J[0]], U = q[J[1]];
          if (!I || !U) return;
          const V = Math.hypot(U[0] - I[0], U[1] - I[1], U[2] - I[2]);
          if (V < 1e-9) return;
          const T = new Es(sa(Me), { depth: V, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new go().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const N = new Oe(T, X ? c : m);
          N.position.set(I[0], I[1], I[2]), N.rotation.setFromRotationMatrix(qn(I, U)), h.add(N);
          return;
        }
        if (J.length === 3 || J.length === 4) {
          const Me = A.get(Se);
          if (!Me || Me <= 0) return;
          const X = J.map((H) => q[H]).filter(Boolean);
          if (X.length < 3) return;
          const I = [X[1][0] - X[0][0], X[1][1] - X[0][1], X[1][2] - X[0][2]], U = [X[2][0] - X[0][0], X[2][1] - X[0][1], X[2][2] - X[0][2]], V = I[1] * U[2] - I[2] * U[1], T = I[2] * U[0] - I[0] * U[2], N = I[0] * U[1] - I[1] * U[0], D = Math.hypot(V, T, N);
          if (D < 1e-12) return;
          const $ = [V / D, T / D, N / D], ee = [], fe = (H) => X.map((me) => [me[0] + $[0] * H, me[1] + $[1] * H, me[2] + $[2] * H]), ie = fe(+Me / 2), oe = fe(-Me / 2), L = (H, me, ye) => ee.push(...H, ...me, ...ye);
          for (const H of [ie, oe]) L(H[0], H[1], H[2]), H.length === 4 && L(H[0], H[2], H[3]);
          for (let H = 0; H < X.length; H++) {
            const me = (H + 1) % X.length;
            L(ie[H], oe[H], oe[me]), L(ie[H], oe[me], ie[me]);
          }
          const de = new Pe();
          de.setAttribute("position", new bt(ee, 3)), de.computeVertexNormals(), h.add(new Oe(de, d));
        }
      });
    } catch (J) {
      ae = String((J == null ? void 0 : J.message) ?? J);
    }
    globalThis.__extrusionDebug = { corridas: z, on: b, fallo: ae, nElementos: xe.length, nFormas: se.size, nEspesores: A.size, mallas: h.children.length - 1 };
  }), h;
}
class Dn extends tt {
  constructor(l, p, h, c, m, d, x) {
    super();
    const v = new Pn().moveTo(0, 0).lineTo(0, d[1]).lineTo(h, d[1]).lineTo(h, 0).lineTo(0, 0), P = v.getPoints(), z = new Pe().setFromPoints(P);
    this.lines = new Ft(z, new ht({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const b = new Yn(v), q = new it({ color: d[1] > 0 ? 24435 : 11411474, side: Ct });
    this.mesh = new Oe(b, q), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Pt(`${m[1].toFixed(4)}`), this.normalizedResult = d, this.textPosition = Cn([l, p]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Ho extends tt {
  constructor(l, p, h, c, m, d, x) {
    super();
    const v = m[0] * h / (m[0] + m[1]), P = m[0] * m[1] > 0;
    if (this.text = new Pt(`${m[0].toFixed(4)}`), this.text2 = new Pt(`${(m[1] * -1).toFixed(4)}`), this.normalizedResult = d, this.textPosition = yo(l, p), this.text2Position = yo(p, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), P) {
      const z = new Pn().moveTo(0, 0).lineTo(0, d[0]).lineTo(v, 0).lineTo(0, 0), b = new Pn().moveTo(v, 0).lineTo(h, -d[1]).lineTo(h, 0).lineTo(v, 0), q = z.getPoints(), xe = b.getPoints(), ce = new Pe().setFromPoints(q), se = new Pe().setFromPoints(xe), A = new ht({ color: an().resultOutline });
      this.lines = new Ft(ce, A), this.lines2 = new Ft(se, A), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), x && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ae = new Yn(z), J = new Yn(b), Se = new it({ color: d[0] > 0 ? 24435 : 11411474, side: Ct }), Me = new it({ color: -d[1] > 0 ? 24435 : 11411474, side: Ct });
      this.mesh = new Oe(ae, Se), this.mesh2 = new Oe(J, Me), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), x && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const z = new Pn().moveTo(0, 0).lineTo(0, d[0]).lineTo(h, -d[1]).lineTo(h, 0).lineTo(0, 0), b = z.getPoints(), q = new Pe().setFromPoints(b);
      this.lines = new Ft(q, new ht({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const xe = new Yn(z), ce = new it({ color: d[0] > 0 ? 24435 : 11411474, side: Ct });
      this.mesh = new Oe(xe, ce), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var ls = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(ls || {});
function ia(e, l, p, h) {
  const c = new tt(), m = { normals: Dn, shearsY: Dn, shearsZ: Dn, torsions: Dn, bendingsY: Ho, bendingsZ: Ho };
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, p.val, l.frameResults.val == "none") return;
    c.children.forEach((x) => x.dispose()), c.clear();
    const d = ls[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[d]) == null ? void 0 : _b.forEach((x, v) => {
      var _a3, _b2;
      const P = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[v]) ?? [0, 1], z = p.rawVal[P[0]], b = p.rawVal[P[1]], q = new S(...b).distanceTo(new S(...z)), xe = la((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[d]), ce = x == null ? void 0 : x.map((J) => J / (xe === 0 ? 1 : xe)), se = qn(z, b), A = new m[d](z, b, q, se, x ?? [0, 0], ce ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(d)), ae = 0.05 * l.gridSize.rawVal;
      A.updateScale(ae * h.rawVal), c.add(A);
    });
  }), K.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    const d = 0.05 * l.gridSize.val;
    c.children.forEach((x) => x.updateScale(d * h.rawVal));
  }), K.derive(() => {
    c.visible = l.frameResults.val != "none";
  }), c;
}
function la(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((p) => {
    const h = Math.max(...p ?? [0, 0]);
    h > l && (l = h);
  }), l;
}
class ra extends tt {
  constructor(l, p, h) {
    super();
    const c = p === Mo.reactions;
    h[0] && (this.xText1 = new Pt(`${c ? "Fx" : "Dx"}: ` + h[0].toFixed(4))), h[3] && (this.xText2 = new Pt(`${c ? "Mx" : "Rx"}: ` + h[3].toFixed(4))), h[1] && (this.yText1 = new Pt(`${c ? "Fy" : "Dy"}: ` + h[1].toFixed(4))), h[4] && (this.yText2 = new Pt(`${c ? "My" : "Ry"}: ` + h[4].toFixed(4))), h[2] && (this.zText1 = new Pt(`${c ? "Fz" : "Dz"}: ` + h[2].toFixed(4))), h[5] && (this.zText2 = new Pt(`${c ? "Mz" : "Rz"}: ` + h[5].toFixed(4))), (h[0] || h[3]) && (this.xArrow = new sn(new S(1, 0, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[1] || h[4]) && (this.yArrow = new sn(new S(0, 1, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[2] || h[5]) && (this.zArrow = new sn(new S(0, 0, 1), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
var Mo = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(Mo || {});
function ca(e, l, p, h) {
  const c = new tt();
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    c.children.forEach((x) => x.dispose()), c.clear();
    const m = Mo[l.nodeResults.rawVal], d = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[m]) == null ? void 0 : _b.forEach((x, v) => {
      const P = new ra(p.rawVal[v], m, x ?? [0, 0, 0, 0, 0, 0]);
      P.updateScale(d * h.rawVal), c.add(P);
    });
  }), K.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const m = 0.05 * l.gridSize.val;
    c.children.forEach((d) => d.updateScale(m * h.rawVal));
  }), K.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function da({ drawingObj: e, gridObj: l, scene: p, getActiveCamera: h, controls: c, gridSize: m, derivedDisplayScale: d, rendererElm: x, viewerRender: v }) {
  const P = new Vs(), z = new $s(), b = (n) => {
    const o = x.getBoundingClientRect(), a = n.clientX - o.left, t = n.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const f = s / 2;
      if (a >= f) return z.x = (a - f) / f * 2 - 1, z.y = -(t / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      z.x = a / f * 2 - 1;
    } else z.x = a / s * 2 - 1;
    return z.y = -(t / i) * 2 + 1, h();
  }, q = new Oe(new Qt(1e4, 1e4), new it({ side: Ct, transparent: true, opacity: 0, depthWrite: false }));
  q.visible = true, q.frustumCulled = false, p.add(q);
  const xe = (n, o, a) => {
    const t = new Oe(new Qt(1e4, 1e4), new it({ side: Ct, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(n, o, a), t.visible = false, t.frustumCulled = false, p.add(t), t;
  }, ce = xe(Math.PI / 2, 0, 0), se = xe(0, Math.PI / 2, 0);
  let A = false;
  const ae = () => {
    if (A) return P.intersectObjects([q], false);
    if (ce.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ve.visible) {
      const a = P.intersectObjects([Ve, Be, Xe], false);
      if (a.length > 0) return a;
    }
    const o = [q];
    return ce.visible && o.push(ce), se.visible && o.push(se), Nt.visible && Ht.length > 0 && o.push(...Ht), P.intersectObjects(o, false);
  }, J = new Xn(new Pe(), new Nn()), Se = new Xn(new Pe(), new Nn({ color: "gray", sizeAttenuation: false, size: 6 })), Me = new Xn(new Pe(), new Nn({ color: "orange", sizeAttenuation: false, size: 5 }));
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
    const _ = x.getBoundingClientRect(), u = _.left + (T.x * 0.5 + 0.5) * _.width, M = _.top + (-T.y * 0.5 + 0.5) * _.height;
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
  }, D = () => {
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
      const _ = Te[0];
      Te = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, _[0], _[1], _[2], n), ne(`\u2713 C\xEDrculo r=${n} m en (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}).`);
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
  }, ee = (n) => {
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
  }, fe = (n) => {
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
  }, ie = (n) => {
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
    const o = ee(n);
    if (!o) return false;
    if (o.kind === "length") return $(o.L), true;
    const a = fe(o);
    if (!a) return false;
    $o(new S(a[0], a[1], a[2]), null), I = a, X.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, X.addEventListener("keydown", (n) => {
    if (n.key === "Enter") {
      n.preventDefault();
      const a = ee(X.value);
      if (!a) return;
      if (V = false, a.kind === "length") $(a.L), ne(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const t = fe(a);
        if (!t) return;
        ie(t);
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
  const de = new Ft(new Pe().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new Sn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  de.frustumCulled = false, de.visible = false, de.name = "rubberBand", p.add(de), window.__hekatanRubberBand = de;
  const H = new Ft(new Pe(), new ht({ color: 2282478, transparent: true, opacity: 0.9 }));
  H.frustumCulled = false, H.visible = false, p.add(H);
  let me = [];
  const ye = new tt(), $e = new Oe(new Qt(1, 1), new it({ color: 2282478, transparent: true, opacity: 0.08, side: Ct, depthWrite: false })), ke = new Kt(new Xo(new Qt(1, 1)), new ht({ color: 2282478, transparent: true, opacity: 0.85 })), Ie = new Kt(new Pe(), new ht({ color: 2282478, transparent: true, opacity: 0.3 })), Qe = (n, o) => {
    const a = [], t = Math.ceil(n / o);
    for (let s = -t; s <= t; s++) {
      const i = s * o;
      a.push(-n, i, 0, n, i, 0), a.push(i, -n, 0, i, n, 0);
    }
    Ie.geometry.dispose(), Ie.geometry = new Pe(), Ie.geometry.setAttribute("position", new bt(a, 3));
  };
  ye.add($e, ke, Ie), ye.visible = false, ye.frustumCulled = false, p.add(ye);
  const pt = new tt();
  pt.frustumCulled = false, pt.visible = false, p.add(pt);
  const le = (n) => {
    const o = new Pe().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), a = new Sn({ color: n, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Ft(o, a);
  }, E = le(16711680), G = le(65280), Y = le(35071);
  pt.add(E, G, Y);
  const j = (n) => {
    const o = new Pe().setFromPoints([new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0)]), a = new ht({ color: n, transparent: true, opacity: 0.2, depthTest: false }), t = new es(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, re = j(3462041), we = j(16724804), he = j(6333946), Ce = new tt();
  Ce.frustumCulled = false, Ce.visible = false, p.add(Ce), Ce.add(re, we, he);
  const Ae = (n) => {
    const o = new Qt(1, 1), a = new it({ color: n, transparent: true, opacity: 0.06, side: Ct, depthWrite: false }), t = new Oe(o, a);
    return t.frustumCulled = false, t.renderOrder = 996, t;
  }, Ve = Ae(3462041), Be = Ae(16724804), Xe = Ae(6333946);
  Ce.add(Ve, Be, Xe);
  const Ge = (n, o, a, t) => {
    n.scale.set(2 * t, 2 * t, 1), a === "xy" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, 0, 0)) : a === "xz" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(Math.PI / 2, 0, 0)) : (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, Math.PI / 2, 0));
  }, Le = document.createElement("div");
  Le.id = "hk-refplane-badge", Le.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Le), window.__hekatanSetOrthoPlanes = (n) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = n, Ce.visible = n, n) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      He(re, i, "xy", r), He(we, i, "xz", r), He(he, i, "yz", r), Ge(Ve, i, "xy", r), Ge(Be, i, "xz", r), Ge(Xe, i, "yz", r), Ve.material.opacity = 0.05, Be.material.opacity = 0.05, Xe.material.opacity = 0.05;
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
    He(re, i, "xy", n), He(we, i, "xz", n), He(he, i, "yz", n), Ge(Ve, i, "xy", n), Ge(Be, i, "xz", n), Ge(Xe, i, "yz", n), v();
  };
  const mt = (n) => {
    if (Ve.material.opacity = n === "xy" ? 0.09 : 0.025, Be.material.opacity = n === "xz" ? 0.09 : 0.025, Xe.material.opacity = n === "yz" ? 0.09 : 0.025, n) {
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
    if (n.key === "Enter" && t === "polyarea" && me.length >= 3) {
      const s = yn();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), n.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") lt = lt === a ? null : a, qt(), n.preventDefault();
    else if (n.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), Ao(), n.preventDefault();
    } else n.key === "F3" ? (n.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : n.key === "F10" ? (n.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : n.key === "F8" && (n.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const n = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = n, n || Vn(), ne(`\u{1F9F2} OSNAP ${n ? "ON" : "OFF"} (F3)`);
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
  const ue = /* @__PURE__ */ new Set();
  window.__hekatanSelection = ue;
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
    for (const r of ue) {
      const [f, ...y] = r.split(":");
      if (f === "pt") {
        const g = n[+y[0]];
        if (!g) continue;
        const _ = new Oe(new hn(0.025, 12, 12), new it({ color: Tt, transparent: true, opacity: 0.9, depthTest: false }));
        _.position.set(g[0], g[1], g[2]), _.renderOrder = 999, _.__isSelectionPt = true, _t.add(_);
      } else if (f === "seg") {
        const g = o[+y[0]], _ = n[g == null ? void 0 : g[+y[1]]], u = n[g == null ? void 0 : g[+y[1] + 1]];
        if (!_ || !u) continue;
        const M = new Pe().setFromPoints([new S(_[0], _[1], _[2]), new S(u[0], u[1], u[2])]), R = new Ft(M, new ht({ color: Tt, transparent: true, opacity: 0.95, depthTest: false }));
        R.renderOrder = 999, _t.add(R);
      } else if (f === "poly") {
        const _ = o[+y[0]].map((R) => {
          const te = n[R];
          return te ? new S(te[0], te[1], te[2]) : null;
        }).filter(Boolean);
        if (_.length < 2) continue;
        const u = new Pe().setFromPoints(_), M = new Ft(u, new ht({ color: Tt, transparent: true, opacity: 0.95, depthTest: false }));
        M.renderOrder = 999, _t.add(M);
      } else if (f === "aux") {
        const g = t[+y[0]];
        if (!g || g.length !== 6) continue;
        const _ = new Pe().setFromPoints([new S(g[0], g[1], g[2]), new S(g[3], g[4], g[5])]), u = new Ft(_, new ht({ color: Tt, transparent: true, opacity: 0.95, depthTest: false }));
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
    ue.clear(), Vt();
  };
  const Jt = (n, o, a, t, s, i, r, f, y) => {
    const g = r - t, _ = f - s, u = y - i, M = g * g + _ * _ + u * u;
    if (M < 1e-12) return Math.hypot(n - t, o - s, a - i);
    let R = ((n - t) * g + (o - s) * _ + (a - i) * u) / M;
    R = Math.max(0, Math.min(1, R));
    const te = t + R * g, k = s + R * _, C = i + R * u;
    return Math.hypot(n - te, o - k, a - C);
  }, en = (n, o, a, t) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, f = -1, y = t;
    for (let g = 0; g < s.length; g++) {
      const _ = s[g];
      for (let u = 0; u < _.length - 1; u++) {
        const M = i[_[u]], R = i[_[u + 1]];
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
      const _ = Jt(n, o, a, g[0], g[1], g[2], g[3], g[4], g[5]);
      _ < f && (f = _, r = y);
    }
    return r;
  }, Kn = (n) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[n];
    if (!t || t.length !== 6) {
      ge.visible = false;
      return;
    }
    ge.geometry.setFromPoints([new S(t[0], t[1], t[2]), new S(t[3], t[4], t[5])]), ge.visible = true;
  }, Gn = (n, o = -1) => {
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
    const y = e.points.rawVal, g = /* @__PURE__ */ new Map(), _ = [];
    for (let M = 0; M < y.length; M++) f.has(M) && (g.set(M, _.length), _.push(y[M]));
    const u = r.map((M) => M.map((R) => g.get(R)).filter((R) => R !== void 0));
    if (e.points.val = _, e.polylines.val = u, e.areas) {
      const M = i.length - 1;
      e.areas.val = e.areas.rawVal.map((R) => R > n ? R + M : R);
    }
    ge.visible = false, qe = -1, We = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  J.geometry.setAttribute("position", new bt(e.points.rawVal.flat(), 3)), J.geometry.computeBoundingSphere(), J.frustumCulled = false, Se.frustumCulled = false, p.add(Se), q.position.set(0, 0, 0), q.rotateX(Math.PI / 2), q.geometry.rotateX(Math.PI / 2), q.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (n, o, a) => {
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
      const r = s.slice(0, i - 1).map((_) => n[_]).filter(Boolean);
      if (r.length < 5) continue;
      const f = [0, 1, 2].map((_) => r.reduce((u, M) => u + M[_], 0) / r.length), y = r.map((_) => Math.hypot(_[0] - f[0], _[1] - f[1], _[2] - f[2])), g = y.reduce((_, u) => _ + u, 0) / y.length;
      g < 1e-9 || y.some((_) => Math.abs(_ - g) > 5e-3 * g) || t.push({ c: f, r: g });
    }
    return mn = t;
  };
  window.__hekatanCentrosDeducidos = wn, window.__hekatanDrawCircle = (n, o, a, t, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(s)), f = e.points.rawVal.length, y = [];
    for (let g = 0; g < r; g++) {
      const _ = 2 * Math.PI * g / r, u = t * Math.cos(_), M = t * Math.sin(_);
      let R;
      i === "xy" ? R = [n + u, o + M, a] : i === "xz" ? R = [n + u, o, a + M] : R = [n, o + u, a + M], y.push(R);
    }
    if (e.points.val = [...e.points.rawVal, ...y], rn.push({ c: [n, o, a], r: t }), e.polylines) {
      const g = [...y.map((u, M) => f + M), f], _ = e.polylines.rawVal;
      ((_a2 = _[_.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [..._, g, []] : e.polylines.val = [..._.slice(0, -1), g, []];
    }
  }, window.__hekatanDrawArc = (n, o, a, t = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(t)), i = new S(...n), r = new S(...o), f = new S(...a), y = new S().subVectors(r, i), g = new S().subVectors(f, i), _ = new S().crossVectors(y, g).normalize(), u = new S().addVectors(i, r).multiplyScalar(0.5), M = new S().addVectors(r, f).multiplyScalar(0.5), R = new S().crossVectors(y, _).normalize(), te = new S().crossVectors(new S().subVectors(f, r), _).normalize(), k = new S().subVectors(M, u), C = R.x * te.y - R.y * te.x;
    let w;
    if (Math.abs(C) > 1e-9) {
      const ze = (k.x * te.y - k.y * te.x) / C;
      w = new S().addVectors(u, R.clone().multiplyScalar(ze));
    } else w = u.clone();
    const F = i.distanceTo(w), B = new S().subVectors(i, w), Z = new S().subVectors(f, w), pe = Math.acos(Math.max(-1, Math.min(1, B.dot(Z) / (F * F)))), W = e.points.rawVal.length, Q = [], Ee = _.clone();
    for (let ze = 0; ze <= s; ze++) {
      const ve = ze / s, Ze = pe * ve, Ye = new uo().setFromAxisAngle(Ee, Ze), st = B.clone().applyQuaternion(Ye).add(w);
      Q.push([st.x, st.y, st.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...Q], rn.push({ c: [w.x, w.y, w.z], r: F }), e.polylines) {
      const ze = Q.map((Ze, Ye) => W + Ye), ve = e.polylines.rawVal;
      e.polylines.val = [...ve.slice(0, -1), ze, []];
    }
  }, window.__hekatanDrawSlabChaflan = (n, o, a = 1, t = 6, s = 6) => {
    const i = Math.min(n[0], o[0]), r = Math.max(n[0], o[0]), f = Math.min(n[1], o[1]), y = Math.max(n[1], o[1]), g = (n[2] + o[2]) / 2, _ = r - i, u = y - f, M = Math.min(a, _ / 2 - 0.01, u / 2 - 0.01);
    if (M <= 0) return;
    const R = e.points.rawVal.length, te = [], k = [], C = (w, F) => {
      te.push([w, F, g]), k.push(R + te.length - 1);
    };
    for (let w = 0; w <= s; w++) C(i + M + (_ - 2 * M) * w / s, f);
    for (let w = 1; w <= t; w++) {
      const F = -Math.PI / 2 + Math.PI / 2 * w / t;
      C(r - M + M * Math.cos(F), f + M + M * Math.sin(F));
    }
    for (let w = 1; w <= s; w++) C(r, f + M + (u - 2 * M) * w / s);
    for (let w = 1; w <= t; w++) {
      const F = 0 + Math.PI / 2 * w / t;
      C(r - M + M * Math.cos(F), y - M + M * Math.sin(F));
    }
    for (let w = 1; w <= s; w++) C(r - M - (_ - 2 * M) * w / s, y);
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
      const _ = [a, a + 1, a + 2, a + 3, a], u = e.polylines.rawVal;
      e.polylines.val = [...u.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRectArea = (n, o) => {
    var _a2;
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], r = o[0], f = o[1], y = o[2];
    let g;
    if (A && e.gridTarget) {
      const _ = e.gridTarget.rawVal, u = new kn(..._.rotation), M = new S(1, 0, 0).applyEuler(u), R = new S(0, 1, 0).applyEuler(u), te = new S(..._.position), k = new S(t, s, i), C = new S(r, f, y), w = k.clone().sub(te).dot(M), F = k.clone().sub(te).dot(R), B = C.clone().sub(te).dot(M), Z = C.clone().sub(te).dot(R), pe = (W, Q) => te.clone().addScaledVector(M, W).addScaledVector(R, Q).toArray();
      g = [pe(w, F), pe(B, F), pe(B, Z), pe(w, Z)];
    } else Math.abs(i - y) < 1e-6 ? g = [[t, s, i], [r, s, i], [r, f, i], [t, f, i]] : Math.abs(s - f) < 1e-6 ? g = [[t, s, i], [r, s, i], [r, s, y], [t, s, y]] : g = [[t, s, i], [t, f, i], [t, f, y], [t, s, y]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const _ = e.polylines.rawVal, u = _.length - 1, M = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [..._.slice(0, -1), M, []], e.areas && (e.areas.val = [...e.areas.rawVal, u]);
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
      const De = n[be], et = n[(be + 1) % a];
      t += (De[1] - et[1]) * (De[2] + et[2]), s += (De[2] - et[2]) * (De[0] + et[0]), i += (De[0] - et[0]) * (De[1] + et[1]);
    }
    const r = Math.hypot(t, s, i) || 1;
    t /= r, s /= r, i /= r;
    let f = n[1][0] - n[0][0], y = n[1][1] - n[0][1], g = n[1][2] - n[0][2];
    const _ = Math.hypot(f, y, g) || 1;
    f /= _, y /= _, g /= _;
    let u = s * g - i * y, M = i * f - t * g, R = t * y - s * f;
    const te = Math.hypot(u, M, R) || 1;
    u /= te, M /= te, R /= te;
    const k = n[0], C = (be) => [(be[0] - k[0]) * f + (be[1] - k[1]) * y + (be[2] - k[2]) * g, (be[0] - k[0]) * u + (be[1] - k[1]) * M + (be[2] - k[2]) * R], w = (be, De) => [k[0] + be * f + De * u, k[1] + be * y + De * M, k[2] + be * g + De * R], F = n.map(C);
    let B = 1 / 0, Z = -1 / 0, pe = 1 / 0, W = -1 / 0;
    for (const [be, De] of F) be < B && (B = be), be > Z && (Z = be), De < pe && (pe = De), De > W && (W = De);
    const Q = Z - B, Ee = W - pe;
    if (Q < 1e-6 || Ee < 1e-6) return 0;
    let ze = o && o > 0 ? o : 0.5;
    for (; Q / ze * (Ee / ze) > 2500; ) ze *= 2;
    ze = Math.min(ze, Math.min(Q, Ee));
    const ve = (be, De) => {
      let et = false;
      for (let Et = 0, Ut = F.length - 1; Et < F.length; Ut = Et++) {
        const [Xt, Wt] = F[Et], [fn, _n] = F[Ut];
        Wt > De != _n > De && be < (fn - Xt) * (De - Wt) / (_n - Wt) + Xt && (et = !et);
      }
      return et;
    }, Ze = Math.max(1, Math.round(Q / ze)), Ye = Math.max(1, Math.round(Ee / ze)), st = Q / Ze, at = Ee / Ye, kt = /* @__PURE__ */ new Map(), dt = [], _e = e.points.rawVal.length, je = (be, De) => {
      const et = be + "," + De, Et = kt.get(et);
      if (Et !== void 0) return Et;
      const Ut = _e + dt.length;
      return dt.push(w(B + be * st, pe + De * at)), kt.set(et, Ut), Ut;
    }, Je = [];
    for (let be = 0; be < Ze; be++) for (let De = 0; De < Ye; De++) {
      if (!ve(B + (be + 0.5) * st, pe + (De + 0.5) * at)) continue;
      const et = je(be, De), Et = je(be + 1, De), Ut = je(be + 1, De + 1), Xt = je(be, De + 1);
      Je.push([et, Et, Ut, Xt]);
    }
    if (!Je.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...dt], e.polylines && e.areas) {
      let be = e.polylines.rawVal.slice();
      be.length && be[be.length - 1].length === 0 && (be = be.slice(0, -1));
      const De = [];
      for (const et of Je) De.push(be.length), be.push([et[0], et[1], et[2], et[3], et[0]]);
      be.push([]), e.polylines.val = be, e.areas.val = [...e.areas.rawVal, ...De];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return v(), Je.length;
  };
  const yn = () => {
    if (me.length < 3) return me = [], H.visible = false, v(), 0;
    const n = window.__hekatanMeshPolyArea(me.slice());
    return me = [], H.visible = false, v(), n;
  };
  window.__hekatanFinalizePolyArea = yn, window.__hekatanSetInclinedPlaneFrom3 = (n, o, a) => {
    var _a2;
    const t = new S(n[0], n[1], n[2]), s = new S(o[0], o[1], o[2]), i = new S(a[0], a[1], a[2]), r = new S().subVectors(s, t).cross(new S().subVectors(i, t));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const f = new uo().setFromUnitVectors(new S(0, 0, 1), r), y = new kn().setFromQuaternion(f);
    e.gridTarget && (e.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [y.x, y.y, y.z] }), A = true;
    const g = new S().addVectors(t, s).add(i).multiplyScalar(1 / 3), _ = Math.max(t.distanceTo(s), t.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, u = _ / 2;
    $e.geometry.dispose(), $e.geometry = new Qt(_, _), ke.geometry.dispose(), ke.geometry = new Xo(new Qt(_, _)), Qe(u, 1), ye.position.copy(g), ye.quaternion.copy(f), ye.scale.set(1, 1, 1), ye.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return v(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] }), A = false, ye.visible = false, v();
  };
  const Lt = new tt();
  Lt.visible = false, p.add(Lt), window.__hekatanShowAxes = (n, o, a = 12, t = 2) => {
    var _a2, _b;
    for (; Lt.children.length; ) {
      const _ = Lt.children.pop();
      (_a2 = _.geometry) == null ? void 0 : _a2.dispose(), (_b = _.material) == null ? void 0 : _b.dispose();
    }
    if (!n.length || !o.length) return;
    const s = Math.min(...o) - t, i = Math.max(...o) + t, r = Math.min(...n) - t, f = Math.max(...n) + t, y = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", g = (_, u, M, R, te) => {
      const k = document.createElement("canvas");
      k.width = 64, k.height = 32;
      const C = k.getContext("2d");
      C.fillStyle = te, C.font = "bold 22px sans-serif", C.textAlign = "center", C.fillText(_, 32, 26);
      const w = new No(k), F = new Yo({ map: w, transparent: true }), B = new Uo(F);
      return B.position.set(u, M, R), B.scale.set(1.2, 0.6, 1), B;
    };
    n.forEach((_, u) => {
      const M = u < y.length ? y[u] : `X${u}`, R = new Pe().setFromPoints([new S(_, s, 0), new S(_, i, 0), new S(_, s, 0), new S(_, s, a)]), te = new Sn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new Kt(R, te);
      k.computeLineDistances(), Lt.add(k), Lt.add(g(M, _, s - 0.5, 0, "#60a5fa")), Lt.add(g(M, _, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((_, u) => {
      const M = `${u + 1}`, R = new Pe().setFromPoints([new S(r, _, 0), new S(f, _, 0), new S(r, _, 0), new S(r, _, a)]), te = new Sn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new Kt(R, te);
      k.computeLineDistances(), Lt.add(k), Lt.add(g(M, r - 0.5, _, 0, "#fb7185")), Lt.add(g(M, f + 0.5, _, 0, "#fb7185"));
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
      const f = s[r % s.length], y = o / 2, g = [new S(a - y, t - y, i), new S(a + y, t - y, i), new S(a + y, t + y, i), new S(a - y, t + y, i), new S(a - y, t - y, i)], _ = new Pe().setFromPoints(g), u = new ht({ color: f, transparent: true, opacity: 0.55 });
      Nt.add(new Ft(_, u));
      const M = document.createElement("canvas");
      M.width = 128, M.height = 32;
      const R = M.getContext("2d");
      R.fillStyle = `#${f.toString(16).padStart(6, "0")}`, R.font = "bold 18px sans-serif", R.fillText(`Z = ${i} m`, 4, 22);
      const te = new No(M), k = new Yo({ map: te, transparent: true }), C = new Uo(k);
      C.position.set(a - y - 1.5, t - y - 1.5, i), C.scale.set(2.5, 0.6, 1), Nt.add(C);
      const w = new Qt(1e4, 1e4), F = new it({ visible: false, side: Ct }), B = new Oe(w, F);
      B.position.set(0, 0, i), B.frustumCulled = false, B.userData = { refPlaneZ: i }, p.add(B), Ht.push(B);
    }), Nt.visible = true, v();
  }, window.__hekatanHideRefPlanes = () => {
    Nt.visible = false, Ht.forEach((n) => {
      n.visible = false;
    }), v();
  };
  const xn = new tt();
  xn.frustumCulled = false, p.add(xn);
  const rs = () => {
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
  K.derive(() => {
    const n = window.__hekatanDrawingAuxLines;
    (n == null ? void 0 : n.val) && (n.val, rs(), v());
  });
  const cn = new tt();
  cn.frustumCulled = false, p.add(cn);
  const bo = () => {
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
  K.derive(() => {
    const n = window.__hekatanDrawingAuxPoints;
    (n == null ? void 0 : n.val) !== void 0 && (n.val, bo(), v());
  }), c.addEventListener("change", () => {
    cn.children.forEach((n) => {
      n.scale.setScalar(gt(n.position));
    });
  }), window.__hekatanRenderAuxPoints = bo;
  const vt = new tt(), cs = new Oe(new hn(0.01, 12, 12), new it({ color: 16724804, transparent: true, opacity: 0.95 })), ds = new Oe(new hn(0.015, 12, 12), new it({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  vt.add(cs, ds);
  const dn = 0.08, Hn = (n, o, a) => {
    const t = new Pe().setFromPoints([new S(...n), new S(...o)]);
    return new Ft(t, new ht({ color: a, transparent: true, opacity: 0.7 }));
  };
  vt.add(Hn([-dn, 0, 0], [dn, 0, 0], 16711680)), vt.add(Hn([0, -dn, 0], [0, dn, 0], 65280)), vt.add(Hn([0, 0, -dn], [0, 0, dn], 35071)), vt.visible = false, vt.frustumCulled = false, p.add(vt);
  let Wn = 2;
  const Jn = (n) => {
    const o = h(), a = (x == null ? void 0 : x.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(n) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, gn = () => {
    if (!vt.visible) return;
    const n = Wn * Jn(vt.position) / 0.015;
    vt.scale.setScalar(Math.max(1e-4, Math.min(1e5, n)));
  };
  window.__hekatanUpdateSnapScale = gn, window.__hekatanSnapMarker = vt, window.__hekatanMetrosPorPixel = Jn, window.__hekatanSnapPx = (n) => (typeof n == "number" && n > 0 && (Wn = n, gn(), v()), Wn);
  const _o = () => {
    _t.children.length !== 0 && _t.children.forEach((n) => {
      if (!n.__isSelectionPt) return;
      const o = n;
      o.scale.setScalar(gt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = _o, c.addEventListener("change", () => {
    var _a2;
    gn(), nt.visible && Gt(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), _o();
  }), window.__hekatanShowSnap = (n, o, a) => {
    vt.position.set(n, o, a), vt.visible = true, gn(), v();
  }, window.__hekatanHideSnap = () => {
    vt.visible = false, v();
  }, x.addEventListener("pointermove", (n) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q;
    const o = b(n);
    if (!o) return;
    P.setFromCamera(z, o);
    const a = ae();
    if (a.length) {
      const t = a[0].point, s = (window.__hekatanSnap2D ?? 0.5) * 1.2, i = (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, t.x, t.y, t.z, s);
      if (i) Co(i.type, i.x, i.y, i.z), vt.position.set(i.x, i.y, i.z), vt.visible = true, t.set(i.x, i.y, i.z);
      else {
        Vn();
        const _ = window.__hekatanSnapEnabled !== false, u = window.__hekatanSnap2D ?? 0.5;
        _ && u > 0 && (t.x = Math.round(t.x / u) * u, t.y = Math.round(t.y / u) * u, t.z = Math.round(t.z / u) * u), vt.position.copy(t), vt.visible = true;
      }
      gn();
      const r = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (r === "select" || !r) {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = jt(t.x, t.y, t.z, _), M = en(t.x, t.y, t.z, _), R = tn(t.x, t.y, t.z, _);
        if (u >= 0) {
          const w = e.points.rawVal[u];
          nt.position.set(w[0], w[1], w[2]), nt.visible = true, Gt(), Ne.visible = false, ct = { kind: "pt", a: u };
        } else if (M) {
          const w = e.points.rawVal, F = e.polylines.rawVal[M.polyIdx], B = w[F[M.segIdx]], Z = w[F[M.segIdx + 1]];
          Ne.geometry.setFromPoints([new S(B[0], B[1], B[2]), new S(Z[0], Z[1], Z[2])]), Ne.visible = true, nt.visible = false, ct = ((_f = (_e = e.areas) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
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
        C && (C.textContent = k), de.visible = false, pt.visible = false, v();
        return;
      }
      if (r === "delete" || r === "trim" || r === "extend" || r === "offset") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = en(t.x, t.y, t.z, _), M = tn(t.x, t.y, t.z, _);
        let R = false;
        if (M >= 0) if (!u) R = true;
        else {
          const w = window.__hekatanDrawingAuxLines, B = ((w == null ? void 0 : w.rawVal) ?? (w == null ? void 0 : w.val) ?? w ?? [])[M];
          Jt(t.x, t.y, t.z, B[0], B[1], B[2], B[3], B[4], B[5]) < u.dist && (R = true);
        }
        R ? (xt = M, qe = -1, We = -1, Kn(M)) : u ? (qe = u.polyIdx, We = u.segIdx, xt = -1, Gn(u.polyIdx, u.segIdx)) : (qe = -1, We = -1, xt = -1, ge.visible = false), de.visible = false, pt.visible = false, D(), oe.style.left = n.clientX + "px", oe.style.top = n.clientY + "px", oe.style.display = "block";
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
        const _ = y[y.length - 1], u = g[_];
        let M = lt;
        if (ut = null, !M && window.__hekatanAxisSnap !== false) {
          const ve = x.getBoundingClientRect(), Ze = n.clientX, Ye = n.clientY, st = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, at = new S(u[0], u[1], u[2]), kt = [["x", new S(1, 0, 0)], ["y", new S(0, 1, 0)], ["z", new S(0, 0, 1)]], dt = (je) => {
            const Je = je.clone().project(o);
            return { x: (Je.x * 0.5 + 0.5) * ve.width + ve.left, y: (-Je.y * 0.5 + 0.5) * ve.height + ve.top };
          };
          let _e2 = null;
          for (const [je, Je] of kt) {
            const be = dt(at.clone().addScaledVector(Je, -st)), De = dt(at.clone().addScaledVector(Je, st)), et = De.x - be.x, Et = De.y - be.y, Ut = Ze - be.x, Xt = Ye - be.y, Wt = et * et + Et * Et || 1;
            let fn = (Ut * et + Xt * Et) / Wt;
            fn = Math.max(0, Math.min(1, fn));
            const _n2 = Math.hypot(Ze - (be.x + fn * et), Ye - (be.y + fn * Et));
            if (_e2 === null || _n2 < _e2.dpx) {
              const lo = P.ray, Lo = at.clone().sub(lo.origin), ro = Je.dot(lo.direction), Io = Je.dot(Lo), bs = lo.direction.dot(Lo), Ro = 1 - ro * ro, _s = Math.abs(Ro) < 1e-6 ? -Io : (ro * bs - Io) / Ro;
              _e2 = { axis: je, dpx: _n2, pt: at.clone().addScaledVector(Je, _s) };
            }
          }
          _e2 && _e2.dpx <= 12 && (t.copy(_e2.pt), M = _e2.axis, ut = _e2.pt.clone());
        }
        const R = !!window.__hekatanOrthoMode;
        if (!M && R) {
          const ve = Math.abs(t.x - u[0]), Ze = Math.abs(t.y - u[1]), Ye = Math.abs(t.z - u[2]), st = (_l = a[0]) == null ? void 0 : _l.object;
          let at = null;
          st === Ve ? at = "xy" : st === Be ? at = "xz" : st === Xe && (at = "yz"), at === "xy" ? M = ve >= Ze ? "x" : "y" : at === "xz" ? M = ve >= Ye ? "x" : "z" : at === "yz" ? M = Ze >= Ye ? "y" : "z" : M = ve >= Ze && ve >= Ye ? "x" : Ze >= Ye ? "y" : "z";
        }
        const te = window.__hekatanPolarTrack !== false;
        if (!M && te) {
          const ve = t.x - u[0], Ze = t.y - u[1], Ye = t.z - u[2], st = Math.hypot(ve, Ze, Ye);
          if (st > 1e-3) {
            const kt = Math.tan(6 * Math.PI / 180) * st, dt = Math.hypot(Ze, Ye), _e2 = Math.hypot(ve, Ye), je = Math.hypot(ve, Ze), Je = [["x", dt], ["y", _e2], ["z", je]];
            Je.sort((be, De) => be[1] - De[1]), Je[0][1] <= kt && (M = Je[0][0]);
          }
        }
        if (M) {
          const ve = u[0], Ze = u[1], Ye = u[2];
          M === "x" ? t.set(t.x, Ze, Ye) : M === "y" ? t.set(ve, t.y, Ye) : t.set(ve, Ze, t.z);
          const st = !!lt, kt = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          rt.style.background = "rgba(15,23,42,0.92)", rt.style.color = kt, rt.style.border = `1.5px solid ${kt}`;
          const dt = (_m = a[0]) == null ? void 0 : _m.object;
          let _e2 = null;
          dt === Ve ? _e2 = "xy" : dt === Be ? _e2 = "xz" : dt === Xe && (_e2 = "yz");
          const je = _e2 ? ` (plano ${_e2.toUpperCase()})` : "";
          rt.textContent = st ? `\u{1F512} LOCK ${M.toUpperCase()}${je}` : `\u22A5 ORTO ${M.toUpperCase()}${je}`, rt.style.left = n.clientX + 20 + "px", rt.style.top = n.clientY + 18 + "px", rt.style.transform = "none", rt.style.display = "block";
        } else lt || (rt.style.display = "none");
        const k = Math.hypot(t.x - u[0], t.y - u[1], t.z - u[2]), C = Math.atan2(t.y - u[1], t.x - u[0]) * 180 / Math.PI, w = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        oe.textContent = `${w} | \u0394L=${k.toFixed(2)}m ${C.toFixed(0)}\xB0`;
        const F = document.getElementById("hk-coord-fixed");
        F && (F.textContent = w), de.geometry.setFromPoints([new S(u[0], u[1], u[2]), new S(t.x, t.y, t.z)]), (_n = de.computeLineDistances) == null ? void 0 : _n.call(de), de.visible = true, N(u[0], u[1], u[2], t.x, t.y, t.z);
        const B = window.__hekatanOrthoExt ?? 8, Z = window.__hekatanShowOrthoPlanes !== false;
        Ce.visible = Z, Z || mt(null), Z && (He(re, u, "xy", B), He(we, u, "xz", B), He(he, u, "yz", B), Ge(Ve, u, "xy", B), Ge(Be, u, "xz", B), Ge(Xe, u, "yz", B));
        const pe = Z ? P.intersectObjects([Ve, Be, Xe], false) : [];
        let W = null;
        if (pe.length > 0) {
          const ve = pe[0].object;
          ve === Ve ? W = "xy" : ve === Be ? W = "xz" : ve === Xe && (W = "yz");
        }
        mt(W), W && (Le.style.left = n.clientX + "px", Le.style.top = n.clientY + "px"), E.geometry.setFromPoints([new S(u[0] - B, u[1], u[2]), new S(u[0] + B, u[1], u[2])]), (_o2 = E.computeLineDistances) == null ? void 0 : _o2.call(E), G.geometry.setFromPoints([new S(u[0], u[1] - B, u[2]), new S(u[0], u[1] + B, u[2])]), (_p = G.computeLineDistances) == null ? void 0 : _p.call(G), Y.geometry.setFromPoints([new S(u[0], u[1], u[2] - B), new S(u[0], u[1], u[2] + B)]), (_q = Y.computeLineDistances) == null ? void 0 : _q.call(Y), pt.visible = true;
        const Q = E.material, Ee = G.material, ze = Y.material;
        M === "x" ? (Q.opacity = 0.95, Ee.opacity = 0.1, ze.opacity = 0.1) : M === "y" ? (Q.opacity = 0.1, Ee.opacity = 0.95, ze.opacity = 0.1) : M === "z" ? (Q.opacity = 0.1, Ee.opacity = 0.1, ze.opacity = 0.95) : (Q.opacity = 0.5, Ee.opacity = 0.5, ze.opacity = 0.5);
      } else {
        const _ = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        oe.textContent = _;
        const u = document.getElementById("hk-coord-fixed");
        if (u && (u.textContent = _), de.visible = false, pt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(r)) {
          if (I = null, U = null, X.style.left = n.clientX + 20 + "px", X.style.top = n.clientY - 28 + "px", X.style.display = "block", !V) {
            X.value = `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}`;
            const R = document.activeElement;
            !(R && (R.tagName === "INPUT" || R.tagName === "TEXTAREA") && R !== X) && document.activeElement !== X && X.focus({ preventScroll: true });
            try {
              X.select();
            } catch {
            }
          }
        } else D();
      }
      v();
    } else Vn(), oe.style.display = "none", vt.visible = false, de.visible = false, pt.visible = false, D(), v();
  }), K.derive(() => {
    if (!e.gridTarget) return;
    pa(l, { position: new S(...e.gridTarget.val.position), quaternion: new uo().setFromEuler(new kn(...e.gridTarget.val.rotation)) }, v), q.position.set(...e.gridTarget.val.position), q.quaternion.setFromEuler(new kn(...e.gridTarget.val.rotation)), q.updateMatrixWorld();
    const n = new S(0, 0, 1).applyEuler(new kn(...e.gridTarget.val.rotation));
    A = !(Math.abs(n.x) > 0.999 || Math.abs(n.y) > 0.999 || Math.abs(n.z) > 0.999);
  }), K.derive(() => {
    J.geometry.setAttribute("position", new bt(e.points.val.flat(), 3)), J.geometry.computeBoundingSphere();
  }), K.derive(() => {
    const n = 0.05 * m * 0.5 * d.val;
    P.params.Points.threshold = 0.4 * n;
  }), K.derive(() => {
    var _a2;
    const n = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], t = [];
    for (const i of a) {
      const [r, f, y] = n[i];
      t.push(r, f, y);
    }
    const s = new Pe();
    s.setAttribute("position", new bt(t, 3)), Me.geometry.dispose(), Me.geometry = s;
  });
  let On = false, nn = 0;
  x.addEventListener("pointerdown", () => {
    On = true;
  }), x.addEventListener("pointerup", () => {
    On = false;
  }), x.addEventListener("pointermove", () => {
    On && nn++;
  });
  const At = document.createElement("div");
  At.id = "hk-window-select", At.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(At);
  let Yt = null, vn = false, It = null;
  const Qn = (n, o, a, t, s) => {
    s ? (At.style.borderColor = "#34d399", At.style.borderStyle = "dashed", At.style.background = "rgba(52, 211, 153, 0.10)") : (At.style.borderColor = "#22d3ee", At.style.borderStyle = "solid", At.style.background = "rgba(34, 211, 238, 0.10)"), At.style.left = Math.min(n, a) + "px", At.style.top = Math.min(o, t) + "px", At.style.width = Math.abs(a - n) + "px", At.style.height = Math.abs(t - o) + "px", At.style.display = "block";
  }, So = (n, o, a, t, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(n, a), r = Math.max(n, a), f = Math.min(o, t), y = Math.max(o, t), g = a < n, _ = x.getBoundingClientRect(), u = h();
    u.updateMatrixWorld();
    const M = (W) => {
      const Q = new S(W[0], W[1], W[2]);
      return Q.project(u), { x: _.left + (Q.x * 0.5 + 0.5) * _.width, y: _.top + (-Q.y * 0.5 + 0.5) * _.height };
    }, R = (W) => W.x >= i && W.x <= r && W.y >= f && W.y <= y, te = (W, Q) => !(W.x < i && Q.x < i || W.x > r && Q.x > r || W.y < f && Q.y < f || W.y > y && Q.y > y);
    s || ue.clear();
    let k = 0;
    const C = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let W = 0; W < C.length; W++) {
      const Q = C[W];
      Q && R(M(Q)) && (ue.add(`pt:${W}`), k++);
    }
    const w = (W, Q) => g ? R(W) || R(Q) || te(W, Q) : R(W) && R(Q), F = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], B = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let W = 0; W < F.length; W++) {
      const Q = F[W];
      if (B.includes(W)) {
        let ze;
        if (!g) ze = Q.every((ve) => {
          const Ze = C[ve];
          return !!Ze && R(M(Ze));
        });
        else {
          ze = false;
          for (let ve = 0; ve < Q.length - 1; ve++) {
            const Ze = C[Q[ve]], Ye = C[Q[ve + 1]];
            if (!(!Ze || !Ye) && w(M(Ze), M(Ye))) {
              ze = true;
              break;
            }
          }
        }
        ze && (ue.add(`poly:${W}`), k++);
      } else for (let ze = 0; ze < Q.length - 1; ze++) {
        const ve = C[Q[ze]], Ze = C[Q[ze + 1]];
        !ve || !Ze || w(M(ve), M(Ze)) && (ue.add(`seg:${W}:${ze}`), k++);
      }
    }
    const pe = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let W = 0; W < pe.length; W++) {
      const Q = pe[W];
      if (!Q || Q.length !== 6) continue;
      const Ee = M([Q[0], Q[1], Q[2]]), ze = M([Q[3], Q[4], Q[5]]);
      w(Ee, ze) && (ue.add(`aux:${W}`), k++);
    }
    Vt(), ne(`${g ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${k} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${ue.size})`), At.style.display = "none";
  }, En = () => {
    It && (It = null, At.style.display = "none", ne("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = En, window.addEventListener("keydown", (n) => {
    n.key === "Escape" && It && En();
  });
  const ko = () => {
    var _a2, _b, _c, _d;
    if (ue.size === 0) return false;
    const n = [...ue], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], r = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
    for (const te of n) {
      const [k, ...C] = te.split(":");
      if (k === "pt") r.add(+C[0]);
      else if (k === "poly") f.add(+C[0]);
      else if (k === "seg") {
        const w = +C[0], F = +C[1];
        y.has(w) || y.set(w, /* @__PURE__ */ new Set()), y.get(w).add(F);
      } else k === "aux" && g.add(+C[0]);
    }
    let _ = 0, u = [], M = [];
    const R = /* @__PURE__ */ new Map();
    for (let te = 0; te < a.length; te++) {
      if (f.has(te)) {
        _++;
        continue;
      }
      R.set(te, u.length);
      const k = y.get(te);
      if (k && k.size > 0) {
        let C = [];
        for (let w = 0; w < a[te].length; w++) C.push(a[te][w]), w < a[te].length - 1 && k.has(w) && (C.length >= 2 && u.push(C), C = [], _++);
        (C.length >= 2 || C.length === 1) && u.push(C);
      } else u.push([...a[te]]);
    }
    if (r.size > 0) {
      const te = [], k = /* @__PURE__ */ new Map();
      for (let w = 0; w < o.length; w++) {
        if (r.has(w)) {
          _++;
          continue;
        }
        k.set(w, te.length), te.push([...o[w]]);
      }
      const C = [];
      for (const w of u) {
        let F = [];
        for (const B of w) {
          const Z = k.get(B);
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
      "val" in s ? s.val = te : window.__hekatanDrawingAuxLines = te, _ += g.size;
    }
    ue.clear(), Vt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ne(`\u{1F5D1} ${_} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = ko, window.addEventListener("keydown", (n) => {
    if (n.key !== "Delete" && n.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || ue.size !== 0 && (n.preventDefault(), ko());
  });
  const $t = document.createElement("div");
  $t.id = "hk-properties-pane";
  const Po = "hk-props-pane-pos";
  let Mn = null;
  try {
    const n = localStorage.getItem(Po);
    n && (Mn = JSON.parse(n));
  } catch {
  }
  $t.style.cssText = ["position:fixed", Mn ? `left:${Mn.left}px` : "left:14px", Mn ? `top:${Mn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild($t);
  const ps = () => {
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
      const f = r.clientX - a, y = r.clientY - t, g = Math.max(0, Math.min(window.innerWidth - 80, s + f)), _ = Math.max(0, Math.min(window.innerHeight - 40, i + y));
      $t.style.left = `${g}px`, $t.style.top = `${_}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Po, JSON.stringify({ left: parseFloat($t.style.left), top: parseFloat($t.style.top) }));
        } catch {
        }
      }
    });
  }, O = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, zt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let ot = null;
  const Mt = (n, o, a, t) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: n, ids: o, prop: a, value: t } }));
  }, us = () => {
    if (ot && (ot.dispose(), ot = null), ue.size === 0) {
      $t.style.display = "none";
      return;
    }
    const n = [...ue], o = n.filter((u) => u.startsWith("pt:")), a = n.filter((u) => u.startsWith("seg:")), t = n.filter((u) => u.startsWith("poly:")), s = n.filter((u) => u.startsWith("aux:")), i = o.length > 0, r = a.length > 0, f = t.length > 0, y = !i && !r && !f, g = [];
    o.length && g.push(`\u{1F535} ${o.length} nodo(s)`), a.length && g.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && g.push(`\u25AD ${t.length} \xE1rea(s)`), s.length && g.push(`\u250A ${s.length} aux`);
    const _ = `\u{1F3AF} ${ue.size} item(s) \u2014 ${g.join(", ")}`;
    ot = new ns({ container: $t, title: _ });
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
      u.addBinding(O, "Ux"), u.addBinding(O, "Uy"), u.addBinding(O, "Uz"), u.addBinding(O, "Rx"), u.addBinding(O, "Ry"), u.addBinding(O, "Rz");
      const M = ot.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      M.addBinding(O, "Kx", { label: "Kx", min: 0, step: 100 }), M.addBinding(O, "Ky", { label: "Ky", min: 0, step: 100 }), M.addBinding(O, "Kz", { label: "Kz", min: 0, step: 100 }), M.addBinding(O, "Krx", { label: "Krx", min: 0, step: 1e3 }), M.addBinding(O, "Kry", { label: "Kry", min: 0, step: 1e3 }), M.addBinding(O, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const R = ot.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      R.addBinding(O, "Fx", { step: 0.1 }), R.addBinding(O, "Fy", { step: 0.1 }), R.addBinding(O, "Fz", { step: 0.1 }), R.addBinding(O, "Mx", { step: 0.1 }), R.addBinding(O, "My", { step: 0.1 }), R.addBinding(O, "Mz", { step: 0.1 }), ot.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(O, "mass", { label: "m", min: 0, step: 1 }), ot.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(O, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ot.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let C = 0;
        const w = [O.Ux, O.Uy, O.Uz, O.Rx, O.Ry, O.Rz];
        w.some((Z) => Z) && (Mt("nodes", o, "supports", w), C++);
        const F = [O.Fx, O.Fy, O.Fz, O.Mx, O.My, O.Mz];
        F.some((Z) => Z !== 0) && (Mt("nodes", o, "loads", F), C++);
        const B = [O.Kx, O.Ky, O.Kz, O.Krx, O.Kry, O.Krz];
        if (B.some((Z) => Z !== 0) && (Mt("nodes", o, "springs", B), C++), O.mass !== 0 && (Mt("nodes", o, "mass", O.mass), C++), O.diaphragm !== "Ninguno" && (Mt("nodes", o, "diaphragm", O.diaphragm), C++), C === 0) {
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
      u.addBinding(O, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), u.addBinding(O, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const M = ot.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      M.addBinding(O, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), M.addBinding(O, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), M.addBinding(O, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), M.addBinding(O, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ot.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(O, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ot.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(O, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const k = ot.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      k.addBinding(O, "relMxI", { label: "Mx I" }), k.addBinding(O, "relMyI", { label: "My I" }), k.addBinding(O, "relMzI", { label: "Mz I" });
      const C = ot.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      C.addBinding(O, "relMxJ", { label: "Mx J" }), C.addBinding(O, "relMyJ", { label: "My J" }), C.addBinding(O, "relMzJ", { label: "Mz J" }), ot.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(O, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const F = ot.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      F.addBinding(O, "LKx", { label: "LKx", min: 0, step: 100 }), F.addBinding(O, "LKy", { label: "LKy", min: 0, step: 100 }), F.addBinding(O, "LKz", { label: "LKz", min: 0, step: 100 });
      const B = ot.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      B.addBinding(O, "qx", { step: 0.1 }), B.addBinding(O, "qy", { step: 0.1 }), B.addBinding(O, "qz", { step: 0.1 }), ot.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(O, "massPerM", { label: "m/L", min: 0, step: 1 }), ot.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Mt("segs", a, "section", O.section), Mt("segs", a, "material", O.material_frame);
        const pe = { A: O.A_mod, Iz: O.Iz_mod, Iy: O.Iy_mod, J: O.J_mod };
        (pe.A !== 1 || pe.Iz !== 1 || pe.Iy !== 1 || pe.J !== 1) && Mt("segs", a, "modifiers", pe), O.insertionPoint !== "10 \u2014 Centroid" && Mt("segs", a, "insertionPoint", O.insertionPoint), O.beta !== 0 && Mt("segs", a, "beta", O.beta);
        const W = [O.relMxI, O.relMyI, O.relMzI], Q = [O.relMxJ, O.relMyJ, O.relMzJ];
        (W.some((ve) => ve) || Q.some((ve) => ve)) && Mt("segs", a, "releases", { i: W, j: Q }), O.hinges !== "None" && Mt("segs", a, "hinges", O.hinges);
        const Ee = [O.LKx, O.LKy, O.LKz];
        Ee.some((ve) => ve !== 0) && Mt("segs", a, "lineSprings", Ee);
        const ze = [O.qx, O.qy, O.qz];
        ze.some((ve) => ve !== 0) && Mt("segs", a, "distLoad", ze), O.massPerM !== 0 && Mt("segs", a, "massPerM", O.massPerM), ne(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (f) {
      const u = ot.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      u.addBinding(O, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), u.addBinding(O, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), u.addBinding(O, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ot.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(O, "surfLoad", { label: "q", step: 0.1 }), ot.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Mt("areas", t, "shellType", O.shellType), Mt("areas", t, "thickness", O.thickness), Mt("areas", t, "material", O.material_shell), O.surfLoad !== 0 && Mt("areas", t, "surfLoad", O.surfLoad), ne(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (y) {
      const u = ot.addFolder({ title: "\u2139 Selecci\xF3n" }), M = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      u.addBinding(M, "msg", { readonly: true, label: "" });
    }
    ot.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      ue.clear(), Vt();
    }), $t.style.display = "block", ps();
  };
  window.__hekatanRefreshPropsPane = us;
  let pn = null, Tn = false;
  x.addEventListener("pointerdown", (n) => {
    n.button === 2 && (pn = { x: n.clientX, y: n.clientY }, Tn = false);
  }), x.addEventListener("pointermove", (n) => {
    if (pn && n.buttons & 2 && !Tn) {
      const o = n.clientX - pn.x, a = n.clientY - pn.y;
      Math.hypot(o, a) > 8 && (Tn = true);
    }
  }), x.addEventListener("pointerup", (n) => {
    var _a2, _b, _c;
    if (n.button === 2) {
      const o = pn !== null && !Tn;
      pn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (It ? En() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), ue.size > 0 && (ue.clear(), Vt()), e.polylines) {
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
      Qn(It.x, It.y, n.clientX, n.clientY, i);
      return;
    }
    if (!Yt) return;
    const o = n.clientX - Yt.x, a = n.clientY - Yt.y, t = Math.hypot(o, a);
    if (!vn && t < 8) return;
    vn = true;
    const s = n.clientX < Yt.x;
    Qn(Yt.x, Yt.y, n.clientX, n.clientY, s);
  }), x.addEventListener("pointerup", (n) => {
    if (!Yt) return;
    if (!vn) {
      Yt = null;
      return;
    }
    const o = n.ctrlKey || n.metaKey || n.shiftKey;
    So(Yt.x, Yt.y, n.clientX, n.clientY, o), Yt = null, vn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true };
  const Bt = new tt();
  Bt.visible = false, Bt.frustumCulled = false, p.add(Bt);
  const fs = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496 }, Co = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    for (; Bt.children.length; ) {
      const r = Bt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = fs[n] ?? 16777215, i = new Pe().setFromPoints([new S(-1, -1, 0), new S(1, -1, 0), new S(1, -1, 0), new S(1, 1, 0), new S(1, 1, 0), new S(-1, 1, 0), new S(-1, 1, 0), new S(-1, -1, 0)]);
    Bt.add(new Kt(i, new ht({ color: s, linewidth: 2 }))), Bt.position.set(o, a, t), Bt.visible = true, eo();
  };
  let jn = 4;
  const eo = () => {
    Bt.visible && Bt.scale.setScalar(jn * Jn(Bt.position));
  };
  window.__hekatanOsnapMarkerRef = Bt, window.__hekatanUpdateOsnapScale = eo, window.__hekatanOsnapPx = (n) => (typeof n == "number" && n > 0 && (jn = n, eo(), v()), jn);
  const Vn = () => {
    Bt.visible = false;
  }, hs = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    const s = window.__hekatanOsnap, i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let f = null;
    const y = { end: 0, node: 0, int: 1, mid: 2, cen: 3, per: 4, nea: 5 }, g = (k, C, w, F) => {
      const B = Math.hypot(C - n, w - o, F - a);
      if (B > t) return;
      const Z = y[k] ?? 9;
      (!f || Z < f.r || Z === f.r && B < f.d) && (f = { type: k, x: C, y: w, z: F, d: B, r: Z });
    };
    (s.node || s.end) && i.forEach((k) => {
      s.node && g("node", k[0], k[1], k[2]);
    });
    for (const k of r) if (!(k.length < 2)) for (let C = 0; C < k.length - 1; C++) {
      const w = i[k[C]], F = i[k[C + 1]];
      if (!(!w || !F) && (s.end && (g("end", w[0], w[1], w[2]), g("end", F[0], F[1], F[2])), s.mid && g("mid", (w[0] + F[0]) / 2, (w[1] + F[1]) / 2, (w[2] + F[2]) / 2), s.nea || s.per)) {
        const B = F[0] - w[0], Z = F[1] - w[1], pe = F[2] - w[2], W = B * B + Z * Z + pe * pe;
        if (W < 1e-12) continue;
        const Q = Math.max(0, Math.min(1, ((n - w[0]) * B + (o - w[1]) * Z + (a - w[2]) * pe) / W)), Ee = w[0] + Q * B, ze = w[1] + Q * Z, ve = w[2] + Q * pe;
        s.nea && g("nea", Ee, ze, ve), s.per && g("per", Ee, ze, ve);
      }
    }
    if (s.cen) {
      const k = wn(), C = [...rn];
      for (const w of k) C.some((F) => Math.hypot(F.c[0] - w.c[0], F.c[1] - w.c[1], F.c[2] - w.c[2]) < 1e-6 && Math.abs(F.r - w.r) < 1e-6) || C.push(w);
      for (const w of C) {
        if (!i.some((Z) => Math.abs(Math.hypot(Z[0] - w.c[0], Z[1] - w.c[1], Z[2] - w.c[2]) - w.r) < 1e-6)) continue;
        const B = Math.hypot(n - w.c[0], o - w.c[1], a - w.c[2]);
        if (B < t || Math.abs(B - w.r) < t) {
          const Z = Math.min(B, t * 0.5), pe = 3;
          (!f || pe < f.r || pe === f.r && Z < f.d) && (f = { type: "cen", x: w.c[0], y: w.c[1], z: w.c[2], d: Z, r: pe });
        }
      }
    }
    if (s.int) {
      const k = [];
      for (const C of r) for (let w = 0; w < C.length - 1; w++) {
        const F = i[C[w]], B = i[C[w + 1]];
        if (!F || !B) continue;
        const Z = B[0] - F[0], pe = B[1] - F[1], W = B[2] - F[2], Q = Z * Z + pe * pe + W * W;
        if (Q < 1e-12) continue;
        const Ee = Math.max(0, Math.min(1, ((n - F[0]) * Z + (o - F[1]) * pe + (a - F[2]) * W) / Q));
        Math.hypot(F[0] + Ee * Z - n, F[1] + Ee * pe - o, F[2] + Ee * W - a) < 3 * t && k.push([F, B]);
      }
      for (let C = 0; C < k.length; C++) for (let w = C + 1; w < k.length; w++) {
        const [F, B] = k[C], [Z, pe] = k[w], W = [B[0] - F[0], B[1] - F[1], B[2] - F[2]], Q = [pe[0] - Z[0], pe[1] - Z[1], pe[2] - Z[2]], Ee = [F[0] - Z[0], F[1] - Z[1], F[2] - Z[2]], ze = W[0] * W[0] + W[1] * W[1] + W[2] * W[2], ve = W[0] * Q[0] + W[1] * Q[1] + W[2] * Q[2], Ze = Q[0] * Q[0] + Q[1] * Q[1] + Q[2] * Q[2], Ye = W[0] * Ee[0] + W[1] * Ee[1] + W[2] * Ee[2], st = Q[0] * Ee[0] + Q[1] * Ee[1] + Q[2] * Ee[2], at = ze * Ze - ve * ve;
        if (at < 1e-12) continue;
        const kt = (ve * st - Ze * Ye) / at, dt = (ze * st - ve * Ye) / at;
        if (kt < -1e-6 || kt > 1 + 1e-6 || dt < -1e-6 || dt > 1 + 1e-6) continue;
        const _e = [F[0] + kt * W[0], F[1] + kt * W[1], F[2] + kt * W[2]], je = [Z[0] + dt * Q[0], Z[1] + dt * Q[1], Z[2] + dt * Q[2]];
        if (Math.hypot(_e[0] - je[0], _e[1] - je[1], _e[2] - je[2]) > 1e-4) continue;
        [F, B, Z, pe].some((be) => Math.hypot(be[0] - _e[0], be[1] - _e[1], be[2] - _e[2]) < 1e-6) || g("int", _e[0], _e[1], _e[2]);
      }
    }
    const _ = window.__hekatanAxisGrids ?? [], u = window.__hekatanLevels ?? [], M = _.filter((k) => k && k.start && k.end).map((k) => [k.start, k.end]);
    for (const [k, C] of M) {
      s.end && (g("end", k[0], k[1], k[2]), g("end", C[0], C[1], C[2]));
      const w = C[0] - k[0], F = C[1] - k[1], B = C[2] - k[2], Z = w * w + F * F + B * B;
      if (Z < 1e-12) continue;
      const pe = Math.max(0, Math.min(1, ((n - k[0]) * w + (o - k[1]) * F + (a - k[2]) * B) / Z));
      if (s.nea && g("nea", k[0] + pe * w, k[1] + pe * F, k[2] + pe * B), s.int && Math.abs(B) > 1e-9) for (const W of u) {
        const Q = (W.z - k[2]) / B;
        Q < -1e-6 || Q > 1 + 1e-6 || g("int", k[0] + Q * w, k[1] + Q * F, W.z);
      }
    }
    if (s.int || s.node) for (let k = 0; k < M.length; k++) for (let C = k + 1; C < M.length; C++) {
      const [w, F] = M[k], [B, Z] = M[C], pe = F[0] - w[0], W = F[1] - w[1], Q = Z[0] - B[0], Ee = Z[1] - B[1], ze = pe * Ee - W * Q;
      if (Math.abs(ze) < 1e-12) continue;
      const ve = w[0] - B[0], Ze = w[1] - B[1], Ye = (Q * Ze - Ee * ve) / ze, st = (pe * Ze - W * ve) / ze;
      if (Ye < -1e-6 || Ye > 1 + 1e-6 || st < -1e-6 || st > 1 + 1e-6) continue;
      const at = (_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workZ;
      g("int", w[0] + Ye * pe, w[1] + Ye * W, typeof at == "number" ? at : a);
    }
    const R = window.__hekatanDrawingAuxLines, te = (R == null ? void 0 : R.rawVal) ?? (R == null ? void 0 : R.val) ?? R ?? [];
    for (const k of te) {
      if (k.length !== 6) continue;
      const C = [k[0], k[1], k[2]], w = [k[3], k[4], k[5]];
      if (s.end && (g("end", C[0], C[1], C[2]), g("end", w[0], w[1], w[2])), s.mid && g("mid", (C[0] + w[0]) / 2, (C[1] + w[1]) / 2, (C[2] + w[2]) / 2), s.nea || s.per) {
        const F = w[0] - C[0], B = w[1] - C[1], Z = w[2] - C[2], pe = F * F + B * B + Z * Z;
        if (pe < 1e-12) continue;
        const W = Math.max(0, Math.min(1, ((n - C[0]) * F + (o - C[1]) * B + (a - C[2]) * Z) / pe)), Q = C[0] + W * F, Ee = C[1] + W * B, ze = C[2] + W * Z;
        s.nea && g("nea", Q, Ee, ze), s.per && g("per", Q, Ee, ze);
      }
    }
    return f ? { type: f.type, x: f.x, y: f.y, z: f.z } : null;
  };
  window.__hekatanOsnapCompute = hs, window.__hekatanOsnapShow = Co, window.__hekatanOsnapHide = Vn;
  let Te = [], wt = 0, on = 0, St = null;
  const bn = document.createElement("div");
  bn.id = "hk-cad-status", bn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", bn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(bn);
  const ms = () => {
    var _a2, _b, _c;
    const n = [];
    window.__hekatanOrthoMode && n.push("\u22A5 ORTO ON (F8)"), lt && n.push(`\u{1F512} LOCK ${lt.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && n.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && n.push("\u25A6 Planos XY/XZ/YZ"), n.length > 0 ? `   |   ${n.join("  \xB7  ")}` : "";
  }, ne = (n) => {
    var _a2;
    const o = n + ms();
    bn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, n);
    } catch {
    }
  }, ws = "Comando:", ys = () => {
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
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${me.length + 1} (Enter o clic derecho cierra y malla):`);
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
        return ue.size ? s(t ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return ue.size ? s(t ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return ue.size ? s(`SELECCI\xD3N ${ue.size} objeto${ue.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(ws);
    }
  }, Rt = () => {
    var _a2;
    try {
      const n = ys();
      (_a2 = window.__hekatanCadPrompt) == null ? void 0 : _a2.call(window, n.txt, n.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Rt, window.__hekatanRefreshStatus = () => {
    const n = window.__hekatanCadStatusText ?? "", o = n.split("   |   ")[0] ?? n;
    ne(o);
  }, window.__hekatanCadResetPending = () => {
    Te = [], me = [], H.visible = false, to(), St = null, v(), ne("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Rt();
  };
  function to() {
    if (!e.polylines) return;
    const n = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...n, []];
  }
  window.__hekatanCerrarPolilinea = to;
  const un = [], $n = [], no = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, zo = (n) => {
    var _a2;
    e.points.val = n.p, e.polylines && (e.polylines.val = n.l), e.areas && (e.areas.val = n.a), Te = [], de.visible = false, pt.visible = false, D();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    v(), Rt();
  }, Dt = () => {
    un.push(no()), un.length > 100 && un.shift(), $n.length = 0;
  }, Ln = () => {
    const n = un.pop();
    if (!n) {
      ne("\u21B6 Nada para deshacer");
      return;
    }
    $n.push(no()), zo(n), ne(`\u21B6 Deshacer \u2014 quedan ${un.length}`);
  }, Fo = () => {
    const n = $n.pop();
    if (!n) {
      ne("\u21B7 Nada para rehacer");
      return;
    }
    un.push(no()), zo(n), ne(`\u21B7 Rehacer \u2014 quedan ${$n.length}`);
  };
  window.__hekatanPushUndo = Dt, window.__hekatanUndo = Ln, window.__hekatanRedo = Fo, document.addEventListener("keydown", (n) => {
    var _a2;
    const o = n.key.toLowerCase();
    if (!((n.ctrlKey || n.metaKey) && (o === "y" || o === "z" && n.shiftKey))) return;
    const t = n.target;
    t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA") && t.type !== "checkbox" && t.type !== "range" && (((_a2 = t.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (n.preventDefault(), n.stopPropagation(), Fo());
  }, { capture: true }), window.__hekatanCadOption = (n) => {
    var _a2, _b, _c, _d, _e;
    const o = n.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const t = e.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Ln(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ne("Cerrar necesita al menos tres puntos."), true;
      Dt(), e.polylines.val = [...t.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return oo(), ne(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Ln(), true;
      Dt();
      const i = s[s.length - 1], r = s.slice(0, -1), f = t.some((_, u) => u !== t.length - 1 && _.includes(i)) || r.includes(i);
      let y = e.points.rawVal, g = [...t.slice(0, -1), r];
      if (!f && i === y.length - 1 && (y = y.slice(0, -1), e.points.val = y), e.polylines.val = g, r.length) {
        const _ = y[r[r.length - 1]];
        _ && (I = [_[0], _[1], _[2]]);
      } else I = null, de.visible = false;
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
      n.preventDefault(), n.stopPropagation(), Ln();
    }
  }, { capture: true });
  const oo = () => {
    Te = [], St = null, to(), lt = null, qt(), de.visible = false, pt.visible = false, D(), ne("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), v(), Rt();
  };
  window.__hekatanFinalizeDraw = oo;
  const Ao = () => {
    var _a2, _b, _c;
    Te = [], me = [], H.visible = false;
    let n = false;
    ue.size && (ue.clear(), Vt(), n = true), oo();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ne(n ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), v(), Rt();
  };
  window.__hekatanEscapeCancel = Ao;
  const Eo = () => {
    var _a2;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return ue.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (n[+a.slice(5)] || []).forEach((t) => o.add(t));
      else if (a.startsWith("seg:")) {
        const t = a.split(":"), s = n[+t[1]] || [], i = s[+t[2]], r = s[+t[2] + 1];
        i != null && o.add(i), r != null && o.add(r);
      }
    }), o;
  }, To = (n, o, a) => {
    var _a2;
    const t = Eo();
    if (!t.size) return 0;
    Dt();
    const s = e.points.rawVal.map((i, r) => t.has(r) ? [i[0] + n, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Vt(), v(), t.size;
  };
  window.__hekatanMoveSelection = To;
  const Vo = (n, o) => {
    var _a2, _b, _c, _d, _e;
    if (!ue.size) {
      ne(`${n === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Rt();
      return;
    }
    if (Te.push(o), Te.length === 1) {
      I = o, ne(`${n === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Rt();
      return;
    }
    const [a, t] = Te, s = [t[0] - a[0], t[1] - a[1], t[2] - a[2]];
    Te = [], de.visible = false;
    let i = 0;
    n === "move" ? i = To(s[0], s[1], s[2]) : (i = Eo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ne(`\u2713 ${n === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), n === "move" && (ue.clear(), Vt()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Rt();
  };
  window.__hekatanPasoMoverCopiar = Vo;
  const xs = () => {
    var _a2, _b, _c;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return n === "xz" ? [0, 1, 0] : n === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Ot = (n, o) => Math.hypot(n[0] - o[0], n[1] - o[1], n[2] - o[2]), so = (n, o, a, t, s, i) => {
    const r = [o[0] - n[0], o[1] - n[1], o[2] - n[2]], f = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], y = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], g = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], _ = r[0] * f[0] + r[1] * f[1] + r[2] * f[2], u = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], M = r[0] * y[0] + r[1] * y[1] + r[2] * y[2], R = f[0] * y[0] + f[1] * y[1] + f[2] * y[2], te = g * u - _ * _;
    if (te < 1e-12) return null;
    const k = (_ * R - u * M) / te, C = (g * R - _ * M) / te;
    if (!s && (k < -1e-6 || k > 1 + 1e-6) || !i && (C < -1e-6 || C > 1 + 1e-6)) return null;
    const w = [n[0] + k * r[0], n[1] + k * r[1], n[2] + k * r[2]], F = [a[0] + C * f[0], a[1] + C * f[1], a[2] + C * f[2]];
    return Ot(w, F) > 1e-4 ? null : w;
  }, gs = (n) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((t) => t === n).length, 0);
  }, vs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Ms = (n, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, t = e.points.rawVal, s = vs[n];
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
      const w = C.length > 2 && C[0] === C[C.length - 1], F = xs(), B = [];
      for (let _e = 0; _e < C.length - 1; _e++) {
        const je = t[C[_e]], Je = t[C[_e + 1]], be = [Je[0] - je[0], Je[1] - je[1], Je[2] - je[2]], De = Math.hypot(be[0], be[1], be[2]) || 1, et = be[0] / De, Et = be[1] / De, Ut = be[2] / De, Xt = [F[1] * Ut - F[2] * Et, F[2] * et - F[0] * Ut, F[0] * Et - F[1] * et], Wt = Math.hypot(Xt[0], Xt[1], Xt[2]) || 1;
        B.push({ a: je, b: Je, n: [Xt[0] / Wt, Xt[1] / Wt, Xt[2] / Wt] });
      }
      let Z = 0, pe = 1 / 0;
      B.forEach((_e, je) => {
        const Je = Jt(o[0], o[1], o[2], _e.a[0], _e.a[1], _e.a[2], _e.b[0], _e.b[1], _e.b[2]);
        Je < pe && (pe = Je, Z = je);
      });
      const W = B[Z], Q = Math.sign((o[0] - W.a[0]) * W.n[0] + (o[1] - W.a[1]) * W.n[1] + (o[2] - W.a[2]) * W.n[2]) || 1, Ee = on > 0 ? on : pe;
      if (Ee < 1e-6) {
        ne("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const ze = B.map((_e) => ({ a: [_e.a[0] + Q * Ee * _e.n[0], _e.a[1] + Q * Ee * _e.n[1], _e.a[2] + Q * Ee * _e.n[2]], b: [_e.b[0] + Q * Ee * _e.n[0], _e.b[1] + Q * Ee * _e.n[1], _e.b[2] + Q * Ee * _e.n[2]] })), ve = ze.length, Ze = (_e) => {
        const je = ze[(_e - 1 + ve) % ve], Je = ze[_e % ve];
        return so(je.a, je.b, Je.a, Je.b, true, true) ?? Je.a;
      }, Ye = [], st = w ? ve : ve + 1;
      for (let _e = 0; _e < st; _e++) !w && _e === 0 ? Ye.push(ze[0].a) : !w && _e === ve ? Ye.push(ze[ve - 1].b) : Ye.push(Ze(_e));
      Dt();
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
        for (let B = 0; B < w.length - 1; B++) {
          if (F === St.poly && B === St.seg) continue;
          const Z = t[w[B]], pe = t[w[B + 1]];
          if (!Z || !pe) continue;
          const W = Jt(o[0], o[1], o[2], Z[0], Z[1], Z[2], pe[0], pe[1], pe[2]);
          W < C && (C = W, i = F, r = B);
        }
      }), i < 0) {
        ne(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const f = a[St.poly], y = t[f[St.seg]], g = t[f[St.seg + 1]], _ = a[i], u = _[r], M = _[r + 1];
    if (!y || !g || u == null || M == null) {
      ne(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const R = t[u], te = t[M];
    if (n === "trim") {
      const k = so(R, te, y, g, false, false);
      if (!k) {
        ne("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Dt();
      const C = t.length;
      e.points.val = [...t, k];
      const w = [..._.slice(0, r + 1), C, ..._.slice(r + 1)];
      e.polylines.val = a.map((B, Z) => Z === i ? w : B);
      const F = Ot(o, R) < Ot(o, te);
      Fn(i, F ? r : r + 1), ne(`\u2713 Recortado en (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const k = so(R, te, y, g, true, false);
      if (!k) {
        ne("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const w = Ot(o, R) < Ot(o, te) ? r : r + 1;
      if (w !== 0 && w !== _.length - 1) {
        ne("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const F = _[w];
      if (Ot(k, R) + Ot(k, te) < Ot(R, te) + 1e-6) {
        ne("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Dt(), gs(F) > 1) {
        const Z = t.length;
        e.points.val = [...t, k];
        const pe = _.slice();
        pe[w] = Z, e.polylines.val = a.map((W, Q) => Q === i ? pe : W);
      } else e.points.val = t.map((Z, pe) => pe === F ? k : Z);
      ne(`\u2713 Alargada hasta (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    v(), Rt();
  };
  window.__hekatanSelectionSize = () => ue.size, window.__hekatanSelectLast = () => {
    var _a2;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = n.length - 1;
    for (; o >= 0 && (!n[o] || n[o].length < 2); ) o--;
    return ue.clear(), o >= 0 && ue.add(`poly:${o}`), Vt(), ne(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), ue.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    ue.clear();
    const a = /* @__PURE__ */ new Set();
    return n.forEach((t, s) => {
      !t || t.length < 2 || (ue.add(`poly:${s}`), t.forEach((i) => a.add(i)));
    }), o.forEach((t, s) => {
      a.has(s) || ue.add(`pt:${s}`);
    }), Vt(), ne(`SELECCI\xD3N ${ue.size} objetos (todo el modelo) \xB7 Esc suelta`), ue.size;
  }, window.__hekatanReplicateSelection = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1));
    const s = [...ue], i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), y = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), _ = [];
    if (s.forEach((k) => {
      if (k.startsWith("pt:")) y.add(+k.slice(3));
      else if (k.startsWith("poly:")) {
        const C = +k.slice(5);
        g.add(C), (r[C] || []).forEach((w) => y.add(w));
      } else if (k.startsWith("seg:")) {
        const C = k.split(":"), w = +C[1], F = +C[2], B = r[w] || [], Z = B[F], pe = B[F + 1];
        Z != null && pe != null && (_.push([Z, pe]), y.add(Z), y.add(pe));
      }
    }), !y.size) return 0;
    Dt();
    const u = [...i];
    let M = r.slice();
    M.length && M[M.length - 1].length === 0 && (M = M.slice(0, -1));
    const R = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], te = [...y];
    for (let k = 1; k <= t; k++) {
      const C = n * k, w = o * k, F = a * k, B = /* @__PURE__ */ new Map();
      te.forEach((Z) => {
        B.set(Z, u.length), u.push([i[Z][0] + C, i[Z][1] + w, i[Z][2] + F]);
      }), g.forEach((Z) => {
        const pe = r[Z].map((Q) => B.has(Q) ? B.get(Q) : Q), W = M.length;
        M.push(pe), f.has(Z) && R.push(W);
      }), _.forEach(([Z, pe]) => {
        M.push([B.get(Z), B.get(pe)]);
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
    const o = b(n);
    if (!o) return;
    P.setFromCamera(z, o);
    const a = ae();
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
            const _ = Math.abs(t.x - f[0]), u = Math.abs(t.y - f[1]), M = Math.abs(t.z - f[2]);
            g = _ >= u && _ >= M ? "x" : u >= M ? "y" : "z";
          }
          g === "x" ? t = new S(t.x, f[1], f[2]) : g === "y" ? t = new S(f[0], t.y, f[2]) : g === "z" && (t = new S(f[0], f[1], t.z));
        }
      }
    }
    if (ut) t = ut.clone(), ne(`\u{1F4D0} Eje \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else {
      const s = (window.__hekatanSnap2D ?? 0.5) * 1.2, i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s);
      if (i) t = new S(i.x, i.y, i.z), ne(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0;
        r && f > 0 && (t = new S(Math.round(t.x / f) * f, Math.round(t.y / f) * f, Math.round(t.z / f) * f));
      }
    }
    $o(t, n);
  });
  const $o = (n, o) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s, _t2, _u, _v, _w, _x;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (ct) {
        It && En();
        const { kind: t, a: s, b: i } = ct, r = i !== void 0 ? `${t}:${s}:${i}` : `${t}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || ue.clear(), ue.has(r) ? ue.delete(r) : ue.add(r), Vt(), ne(`\u2713 Seleccionados ${ue.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const t = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        It ? (So(It.x, It.y, s, i, t), It = null) : t || (It = { x: s, y: i }, ne("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Qn(s, i, s + 1, i + 1, false));
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
      Vo(a, [n.x, n.y, n.z]);
      return;
    }
    if (a === "delete") {
      if (xt >= 0) {
        const t = window.__hekatanDrawingAuxLines, s = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [], i = xt;
        if (i >= 0 && i < s.length) {
          Dt();
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
      me.push([n.x, n.y, n.z]), H.geometry.setFromPoints(me.map((t) => new S(t[0], t[1], t[2]))), H.visible = me.length >= 1, ne(`\u25B0 \xC1rea libre \u2014 ${me.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), v();
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
      Dt();
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
      Dt();
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
      Dt();
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
      const _ = wt && wt > 0 ? wt : 3;
      Dt();
      const u = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [y[0], y[1], y[2]], [g[0], g[1], g[2]], [g[0], g[1], g[2] + _], [y[0], y[1], y[2] + _]];
      const M = e.polylines.rawVal;
      if (e.polylines.val = [...M.slice(0, -1), ...M[M.length - 1].length > 0 ? [M[M.length - 1]] : [], [u, u + 1, u + 2, u + 3, u], []], e.areas) {
        const R = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, R];
      }
      wt = 0, ne(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${_.toFixed(2)}m`);
      try {
        (_s = window.__hekatanRebuild) == null ? void 0 : _s.call(window);
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
        const _ = i.rawVal ?? i.val ?? [];
        i.val = [..._, [t[0], t[1], t[2], s[0], s[1], s[2]]];
      }
      const r = s[0] - t[0], f = s[1] - t[1], y = s[2] - t[2], g = Math.sqrt(r * r + f * f + y * y);
      ne(`\u2713 L\xEDnea auxiliar creada \u2014 L=${g.toFixed(2)}m (cyan, no FEM)`), Te = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      Ms(a, [n.x, n.y, n.z]);
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
    if (V = false, Dt(), e.points.val = [...e.points.rawVal, n.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
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
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && me.length >= 3) {
      n.preventDefault();
      const a = yn();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), x.addEventListener("pointermove", (n) => {
    var _a2, _b;
    const o = b(n);
    if (!o) return;
    P.setFromCamera(z, o);
    const a = ae();
    if (Se.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (n.ctrlKey || n.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = r[r.length - 1] ?? [], y = e.points.rawVal ?? [];
        if (f.length > 0) {
          const g = y[f[f.length - 1]];
          if (g) {
            const _ = !!window.__hekatanOrthoMode;
            let u = lt;
            if (!u && _) {
              const M = Math.abs(t.x - g[0]), R = Math.abs(t.y - g[1]), te = Math.abs(t.z - g[2]);
              u = M >= R && M >= te ? "x" : R >= te ? "y" : "z";
            }
            u === "x" ? t.set(t.x, g[1], g[2]) : u === "y" ? t.set(g[0], t.y, g[2]) : u === "z" && t.set(g[0], g[1], t.z);
          }
        }
      }
      const s = (window.__hekatanSnap2D ?? 0.5) * 1.2, i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s);
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
    const o = b(n);
    if (!o) return;
    P.setFromCamera(z, o);
    let a = false;
    const t = P.intersectObject(J), s = ae();
    if (t.length && s.length) {
      const i = new S(...e.points.rawVal[t[0].index]), r = new S(...s[0].point), f = i.sub(r), y = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      y.transformDirection(q.matrixWorld), Math.abs(f.dot(y)) < 1e-4 && (a = true);
    }
    Se.visible = !a;
  });
  let ao = false, io;
  x.addEventListener("pointermove", (n) => {
    var _a2;
    if (!nn) return;
    const o = b(n);
    if (!o) return;
    P.setFromCamera(z, o);
    let a = false;
    const t = P.intersectObject(J), s = ae();
    if (t.length && s.length) {
      const r = new S(...e.points.rawVal[t[0].index]), f = new S(...s[0].point), y = r.sub(f), g = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      g.transformDirection(q.matrixWorld), Math.abs(y.dot(g)) < 1e-4 && (a = true);
    }
    if (a && nn < 5 && (ao = true, c.enabled = false, io = t[0].index), !ao || nn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (io !== void 0) {
      let r = s[0].point;
      (n.ctrlKey || n.metaKey) && (r = new S(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[io] = r.toArray();
    }
    e.points.val = i;
  }), x.addEventListener("pointerup", () => {
    c.enabled = true, ao = false;
  }), x.addEventListener("contextmenu", (n) => {
    var _a2;
    const o = b(n);
    if (!o) return;
    P.setFromCamera(z, o);
    let a = false;
    const t = P.intersectObject(J), s = ae();
    if (t.length && s.length) {
      const f = new S(...e.points.rawVal[t[0].index]), y = new S(...s[0].point), g = f.sub(y), _ = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      _.transformDirection(q.matrixWorld), Math.abs(g.dot(_)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(t[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((f) => f.filter((y) => y !== t[0].index)).map((f) => f.map((y) => y > t[0].index ? y - 1 : y)).filter((f) => f.length);
    r.push([]), e.polylines.val = r;
  });
}
function pa(e, l, p) {
  const m = Math.round(14.999999999999998), d = { position: e.position.clone(), quaternion: e.quaternion.clone() }, x = setInterval(P, 1e3 / 30);
  let v = 0;
  function P() {
    v++;
    const z = v / m;
    e.position.lerpVectors(d.position, l.position, z), e.quaternion.slerpQuaternions(d.quaternion, l.quaternion, z), p && p(), v == m && clearInterval(x);
  }
}
function ua(e, l, p, h) {
  const c = Us(p, e.elements, h);
  return K.derive(() => {
    c.visible = l.shellResults.val != "none";
  }), c;
}
const fa = 6, wo = 10, ha = 0.012;
function ma(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function wa(e, l, p, h) {
  if (!p && !h) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && p) {
    const m = p[e];
    if (m && m.has(l)) return m.get(l);
  }
  return null;
}
function ya(e, l, p, h) {
  const c = new tt(), m = new os();
  m.setColorMap("rainbow");
  const d = new Zt(), x = K.state([]);
  return K.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const v = p.val, P = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], z = ma(l.frameResults.val);
    if (c.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), c.clear(), !z || P.length === 0 || v.length === 0) {
      x.val = [];
      return;
    }
    const b = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, q = (_c = e.deformOutputs) == null ? void 0 : _c.val, xe = [], ce = [];
    for (let $ = 0; $ < P.length; $++) {
      if (P[$].length !== 2) continue;
      const fe = wa(z, $, b, q);
      fe && (xe.push(fe[0], fe[1]), ce.push({ idx: $, vals: fe }));
    }
    if (xe.length === 0) {
      x.val = [];
      return;
    }
    const se = Math.min(...xe), A = Math.max(...xe);
    m.setMin(se), m.setMax(A), x.val = xe;
    const ae = [1 / 0, 1 / 0, 1 / 0], J = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of v) for (let ee = 0; ee < 3; ee++) ae[ee] = Math.min(ae[ee], $[ee]), J[ee] = Math.max(J[ee], $[ee]);
    const Me = Math.max(J[0] - ae[0], J[1] - ae[1], J[2] - ae[2], 1) * ha, X = [], I = [], U = [];
    let V = 0;
    for (const { idx: $, vals: ee } of ce) {
      const fe = P[$], ie = v[fe[0]], oe = v[fe[1]];
      if (!ie || !oe) continue;
      const L = new S(oe[0] - ie[0], oe[1] - ie[1], oe[2] - ie[2]), de = L.length();
      if (de < 1e-10) continue;
      L.normalize();
      const H = Math.abs(L.y) < 0.99 ? new S(0, 1, 0) : new S(1, 0, 0), me = new S().crossVectors(L, H).normalize(), ye = new S().crossVectors(L, me).normalize(), $e = wo + 1, ke = fa;
      for (let Ie = 0; Ie < $e; Ie++) {
        const Qe = Ie / wo, pt = ie[0] + L.x * de * Qe, le = ie[1] + L.y * de * Qe, E = ie[2] + L.z * de * Qe, G = ee[0] + (ee[1] - ee[0]) * Qe, Y = m.getColor(G) ?? new Zt(0, 0, 0);
        d.copy(Y).convertSRGBToLinear();
        for (let j = 0; j < ke; j++) {
          const re = j / ke * Math.PI * 2, we = Math.cos(re), he = Math.sin(re);
          X.push(pt + (me.x * we + ye.x * he) * Me, le + (me.y * we + ye.y * he) * Me, E + (me.z * we + ye.z * he) * Me), I.push(d.r, d.g, d.b);
        }
      }
      for (let Ie = 0; Ie < wo; Ie++) for (let Qe = 0; Qe < ke; Qe++) {
        const pt = (Qe + 1) % ke, le = V + Ie * ke + Qe, E = V + Ie * ke + pt, G = V + (Ie + 1) * ke + Qe, Y = V + (Ie + 1) * ke + pt;
        U.push(le, E, Y), U.push(le, Y, G);
      }
      V += $e * ke;
    }
    if (X.length === 0) return;
    const T = new Pe();
    T.setAttribute("position", new bt(X, 3)), T.setAttribute("color", new bt(I, 3)), T.setIndex(U), T.computeVertexNormals();
    const N = new it({ vertexColors: true, side: Ct }), D = new Oe(T, N);
    D.frustumCulled = false, c.add(D);
  }), c.__colorMapValues = x, c;
}
function xa() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const ga = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, va = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Ma = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function yt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const ba = 16755200, Wo = 56831, _a = 56831, Sa = 56831, Bn = 65382;
function ka(e) {
  const l = new tt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const p = new hn(1, 16, 16), h = new it({ color: ba, transparent: true, opacity: 0.85, depthTest: false }), c = new Oe(p, h);
  c.visible = false, c.renderOrder = 100, l.add(c);
  const m = new Pe(), d = new ht({ color: Wo, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), x = new Kt(m, d);
  x.visible = false, x.renderOrder = 100, l.add(x);
  const v = new it({ color: Wo, transparent: true, opacity: 0.7, depthTest: false }), P = new Oe(new Zo(1, 1, 1, 12), v);
  P.visible = false, P.renderOrder = 100, l.add(P);
  const z = new Pe(), b = new it({ color: _a, transparent: true, opacity: 0.45, side: Ct, depthTest: false }), q = new Oe(z, b);
  q.visible = false, q.renderOrder = 100, l.add(q);
  const xe = new Pe(), ce = new ht({ color: Sa, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new Kt(xe, ce);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const A = new it({ color: Bn, transparent: true, opacity: 0.95, depthTest: false }), ae = new it({ color: Bn, transparent: true, opacity: 0.85, depthTest: false }), J = new Zo(1, 1, 1, 12), Se = new it({ color: Bn, transparent: true, opacity: 0.55, side: Ct, depthTest: false }), Me = new ht({ color: Bn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), X = [];
  window.__hekatanModelSelection = X;
  const I = new tt();
  I.renderOrder = 101, l.add(I);
  const U = document.createElement("div");
  Object.assign(U.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), U.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(U);
  }, 0);
  function V(le) {
    const E = e.derivedNodes.rawVal;
    return !E || le < 0 || le >= E.length ? null : new S(E[le][0], E[le][1], E[le][2]);
  }
  function T(le, E) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    const G = e.getActiveCamera();
    if (!G || !e.mesh) return null;
    const Y = e.rendererElm.getBoundingClientRect(), j = le - Y.left, re = E - Y.top, we = e.derivedNodes.rawVal, he = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!we || !he) return null;
    const Ce = /* @__PURE__ */ new Map(), Ae = (Ue) => {
      if (Ce.has(Ue)) return Ce.get(Ue);
      const Re = V(Ue);
      if (!Re) return Ce.set(Ue, null), null;
      const Fe = Re.clone().project(G), Ke = (Fe.x * 0.5 + 0.5) * Y.width, ge = (-Fe.y * 0.5 + 0.5) * Y.height, qe = { x: Ke, y: ge, z: Fe.z };
      return Ce.set(Ue, qe), qe;
    }, Ve = /* @__PURE__ */ new Set();
    for (const Ue of he) if (Ue) for (const Re of Ue) Ve.add(Re);
    const Be = 8;
    let Xe = -1, Ge = Be;
    for (let Ue = 0; Ue < we.length; Ue++) {
      if (!Ve.has(Ue)) continue;
      const Re = Ae(Ue);
      if (!Re || Re.z < -1 || Re.z > 1) continue;
      const Fe = Re.x - j, Ke = Re.y - re, ge = Math.sqrt(Fe * Fe + Ke * Ke);
      ge < Ge && (Ge = ge, Xe = Ue);
    }
    const Le = xa(), mt = va[Le.dispUnit] ?? 1e3, He = ga[Le.forceUnit] ?? 1;
    if (Xe >= 0) {
      const Ue = we[Xe];
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
    for (let Ue = 0; Ue < he.length; Ue++) {
      const Re = he[Ue];
      if (!(!Re || Re.length < 2)) {
        if (Re.length === 2) {
          const Fe = Ae(Re[0]), Ke = Ae(Re[1]);
          if (!Fe || !Ke || Fe.z < -1 || Fe.z > 1 || Ke.z < -1 || Ke.z > 1) continue;
          const ge = Pa(j, re, Fe.x, Fe.y, Ke.x, Ke.y);
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
          if (Ca(j, re, Fe)) {
            const qe = Fe.reduce((We, xt) => We + xt.z, 0) / Fe.length * 1e-3;
            qe < rt && (rt = qe, ut = Ue, qt = "shell");
          }
        } else if (Re.length === 8) {
          const Fe = [];
          let Ke = true;
          for (const ue of Re) {
            const Ne = Ae(ue);
            if (!Ne || Ne.z < -1 || Ne.z > 1) {
              Ke = false;
              break;
            }
            Fe.push(Ne);
          }
          if (!Ke) continue;
          const ge = Math.min(...Fe.map((ue) => ue.x)), qe = Math.max(...Fe.map((ue) => ue.x)), We = Math.min(...Fe.map((ue) => ue.y)), xt = Math.max(...Fe.map((ue) => ue.y));
          if (j >= ge && j <= qe && re >= We && re <= xt) {
            const Ne = Fe.reduce((nt, gt) => nt + gt.z, 0) / Fe.length * 1e-3;
            Ne < rt && (rt = Ne, ut = Ue, qt = "solid");
          }
        }
      }
    }
    if (ut >= 0) {
      const Ue = he[ut];
      let Fe = `${qt === "frame" ? "Frame" : qt === "shell" ? "Shell" : "Solid"} ${ut}`;
      const Ke = (_e = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, ge = (_g = (_f = Ke == null ? void 0 : Ke.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, ut);
      if (ge) {
        ge.name && (Fe += `
  \u{1F4CB} ${ge.name}`), ge.shape && (Fe += `
  Shape: ${ge.shape}`);
        const qe = /concrete|hormig|rect.*sólida/i.test(ge.shape || ""), We = qe ? 100 : 1e3, xt = qe ? "cm" : "mm", ue = (nt) => {
          const gt = nt * We;
          return Math.abs(gt - Math.round(gt)) < 0.05 ? `${Math.round(gt)}` : `${gt.toFixed(1)}`;
        }, Ne = [];
        if (ge.D != null && Ne.push(`D=${ue(ge.D)}`), ge.B != null && Ne.push(`B=${ue(ge.B)}`), ge.TF != null && Ne.push(`TF=${ue(ge.TF)}`), ge.TW != null && Ne.push(`TW=${ue(ge.TW)}`), ge.t != null && Ne.push(`t=${ue(ge.t)}`), Ne.length && (Fe += `
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
        const qe = e.mesh.analyzeOutputs.rawVal, We = Ma[Le.stressUnit] ?? 1, xt = [["bendingXX", "Mxx", He, `${Le.forceUnit}\xB7m/m`], ["bendingYY", "Myy", He, `${Le.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", He, `${Le.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", He, `${Le.forceUnit}/m`], ["membraneYY", "Nyy", He, `${Le.forceUnit}/m`], ["membraneXY", "Nxy", He, `${Le.forceUnit}/m`], ["shearX", "Qx", He, `${Le.forceUnit}/m`], ["shearY", "Qy", He, `${Le.forceUnit}/m`], ["vonMises", "\u03C3VM", We, Le.stressUnit], ["pressure", "p", We, Le.stressUnit]], ue = [];
        for (const [Ne, nt, gt, Gt] of xt) {
          const _t = qe == null ? void 0 : qe[Ne];
          if (_t && _t instanceof Map) {
            const Tt = _t.get(ut);
            if (Tt != null) {
              if (typeof Tt == "number") ue.push(`${nt} = ${yt(Tt * gt, 3)} ${Gt}`);
              else if (Array.isArray(Tt)) {
                let ct = Tt[0];
                for (const jt of Tt) Math.abs(jt) > Math.abs(ct) && (ct = jt);
                ue.push(`${nt} = ${yt(ct * gt, 3)} ${Gt}`);
              }
            }
          }
        }
        ue.length > 0 && (Fe += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + ue.slice(0, 8).join(`
`));
      }
      if (qt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const qe = e.mesh.deformOutputs.rawVal, We = e.mesh.elementInputs.rawVal, xt = qe == null ? void 0 : qe.deformations;
        if (xt && Ue.length === 2) {
          const ue = xt.get(Ue[0]), Ne = xt.get(Ue[1]), nt = we[Ue[0]], gt = we[Ue[1]];
          if (ue && Ne && nt && gt) {
            const Gt = gt[0] - nt[0], _t = gt[1] - nt[1], Tt = gt[2] - nt[2], ct = Math.sqrt(Gt * Gt + _t * _t + Tt * Tt);
            if (ct > 1e-9) {
              const jt = Gt / ct, Vt = _t / ct, Jt = Tt / ct, en = (Ne[0] - ue[0]) * jt + (Ne[1] - ue[1]) * Vt + (Ne[2] - ue[2]) * Jt, tn = ((_n = We.elasticities) == null ? void 0 : _n.get(ut)) ?? 0, Kn = ((_o = We.areas) == null ? void 0 : _o.get(ut)) ?? 0, Gn = ((_p = We.momentsOfInertiaY) == null ? void 0 : _p.get(ut)) ?? 0, ln = ((_q = We.momentsOfInertiaZ) == null ? void 0 : _q.get(ut)) ?? 0, Fn = ((_r = We.torsionalConstants) == null ? void 0 : _r.get(ut)) ?? 0, rn = ((_s = We.shearModuli) == null ? void 0 : _s.get(ut)) ?? tn / 2.6, mn = tn * Kn * (en / ct), An = (Ne[3] - ue[3]) * jt + (Ne[4] - ue[4]) * Vt + (Ne[5] - ue[5]) * Jt, wn = rn * Fn * (An / ct), yn = Ne[4] - ue[4], Lt = Ne[5] - ue[5], Nt = tn * Gn * yn / ct, Ht = tn * ln * Lt / ct;
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
  function N(le, E, G) {
    var _a2, _b, _c;
    if (c.visible = false, x.visible = false, P.visible = false, q.visible = false, se.visible = false, !le || !e.mesh) {
      U.style.display = "none", e.render();
      return;
    }
    const Y = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (le.type === "node") {
      const he = V(le.idx);
      if (he) {
        const Ce = e.derivedNodes.rawVal ?? [];
        let Ae = 1;
        if (Ce.length >= 2) {
          let Xe = [1 / 0, 1 / 0, 1 / 0], Ge = [-1 / 0, -1 / 0, -1 / 0];
          for (const Le of Ce) for (let mt = 0; mt < 3; mt++) Le[mt] < Xe[mt] && (Xe[mt] = Le[mt]), Le[mt] > Ge[mt] && (Ge[mt] = Le[mt]);
          Ae = Math.max(Ge[0] - Xe[0], Ge[1] - Xe[1], Ge[2] - Xe[2], 0.1);
        }
        const Ve = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Be = 0.021 * Ae * Ve;
        c.position.copy(he), c.scale.setScalar(Be), c.visible = true;
      }
    } else if (le.type === "frame" && Y) {
      const he = Y[le.idx], Ce = V(he[0]), Ae = V(he[1]);
      if (Ce && Ae) {
        const Ve = Ce.clone().add(Ae).multiplyScalar(0.5), Be = Ae.clone().sub(Ce), Xe = Be.length(), mt = e.getActiveCamera().position.distanceTo(Ve) * 35e-4;
        P.position.copy(Ve);
        const He = new S(0, 1, 0), lt = He.clone().cross(Be).normalize(), ut = He.angleTo(Be);
        P.quaternion.setFromAxisAngle(lt, ut), P.scale.set(mt, Xe, mt), P.visible = true;
      }
    } else if (le.type === "shell" && Y) {
      const he = Y[le.idx], Ce = [], Ae = [];
      for (const Ve of he) {
        const Be = V(Ve);
        if (!Be) return;
        Ce.push(Be.x, Be.y, Be.z);
      }
      he.length === 4 ? Ae.push(0, 1, 2, 0, 2, 3) : he.length === 3 && Ae.push(0, 1, 2), z.setAttribute("position", new bt(Ce, 3)), z.setIndex(Ae), z.computeVertexNormals(), q.visible = true;
    } else if (le.type === "solid" && Y) {
      const he = Y[le.idx], Ce = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ae = [];
      for (const [Ve, Be] of Ce) {
        const Xe = V(he[Ve]), Ge = V(he[Be]);
        Xe && Ge && Ae.push(Xe.x, Xe.y, Xe.z, Ge.x, Ge.y, Ge.z);
      }
      xe.setAttribute("position", new bt(Ae, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      U.style.display = "none", e.render();
      return;
    }
    U.textContent = le.info, U.style.whiteSpace = "pre-line", U.style.display = "block";
    const re = e.rendererElm.getBoundingClientRect(), we = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? re;
    U.style.left = `${E - we.left}px`, U.style.top = `${G - we.top}px`, e.render();
  }
  let D = "", $ = 0, ee = 0;
  const fe = window.__hekatanHoverDebug ?? false, ie = (le) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const E = T(le.clientX, le.clientY);
      if (fe && ee < 5) {
        const Y = e.derivedNodes.rawVal, j = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${le.clientX}, ${le.clientY}) nodes=${(Y == null ? void 0 : Y.length) ?? 0} elems=${(j == null ? void 0 : j.length) ?? 0} hover=`, E), ee++;
      }
      const G = E ? `${E.type}:${E.idx}` : "";
      if (G !== D) D = G, N(E, le.clientX, le.clientY);
      else if (E) {
        const Y = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        U.style.left = `${le.clientX - Y.left}px`, U.style.top = `${le.clientY - Y.top}px`;
      }
    });
  };
  let oe = null;
  const L = () => {
    D = "", c.visible = false, x.visible = false, P.visible = false, q.visible = false, se.visible = false, U.style.display = "none", e.render();
  }, de = (le) => {
    const E = e.rendererElm.getBoundingClientRect(), G = le.clientX - E.left, Y = le.clientY - E.top;
    (G < -2 || Y < -2 || G > E.width + 2 || Y > E.height + 2) && (oe && clearTimeout(oe), oe = window.setTimeout(L, 200));
  }, H = () => {
    oe && (clearTimeout(oe), oe = null);
  };
  e.rendererElm.addEventListener("pointermove", ie), e.rendererElm.addEventListener("pointerleave", de), e.rendererElm.addEventListener("pointerenter", H);
  function me() {
    var _a2, _b, _c;
    const le = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return le === "select" || le === "none" || !le;
  }
  let ye = null;
  e.rendererElm.addEventListener("pointerdown", (le) => {
    le.button === 0 && (ye = { x: le.clientX, y: le.clientY });
  }), e.rendererElm.addEventListener("pointerup", (le) => {
    if (le.button !== 0 || !ye) return;
    const E = le.clientX - ye.x, G = le.clientY - ye.y;
    if (ye = null, E * E + G * G > 9 || !me()) return;
    const Y = T(le.clientX, le.clientY);
    Y ? (Qe({ type: Y.type, idx: Y.idx }, le.shiftKey), Ie()) : pt();
  }), window.addEventListener("keydown", (le) => {
    if (le.key !== "Escape" || !X.length) return;
    const E = document.activeElement, G = !!E && (E.id === "hk3-cmd-input" || E.id === "hk-dyn-input") && E.value === "";
    E && (E.tagName === "INPUT" || E.tagName === "TEXTAREA" || E.isContentEditable) && !G || pt();
  }, { capture: true });
  function $e() {
    for (const le of I.children.slice()) {
      I.remove(le);
      const E = le.geometry;
      E && E !== p && E !== J && E.dispose();
    }
  }
  function ke(le, E) {
    var _a2, _b, _c;
    const G = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (le.type === "node") {
      const Y = V(le.idx);
      if (!Y) return;
      const j = ((_c = e.derivedDisplayScale) == null ? void 0 : _c.rawVal) ?? 1, re = new Oe(p, A);
      re.position.copy(Y), re.scale.setScalar(0.025 * E * j), re.renderOrder = 101, I.add(re);
    } else if (le.type === "frame" && G) {
      const Y = G[le.idx], j = V(Y[0]), re = V(Y[1]);
      if (!j || !re) return;
      const we = j.clone().add(re).multiplyScalar(0.5), he = re.clone().sub(j), Ce = he.length(), Ae = e.getActiveCamera().position.distanceTo(we), Ve = new Oe(J, ae);
      Ve.position.copy(we);
      const Be = new S(0, 1, 0);
      Ve.quaternion.setFromAxisAngle(Be.clone().cross(he).normalize(), Be.angleTo(he)), Ve.scale.set(Ae * 35e-4, Ce, Ae * 35e-4), Ve.renderOrder = 101, I.add(Ve);
    } else if (le.type === "shell" && G) {
      const Y = G[le.idx], j = [], re = [];
      for (const Ce of Y) {
        const Ae = V(Ce);
        if (!Ae) return;
        j.push(Ae.x, Ae.y, Ae.z);
      }
      Y.length === 4 ? re.push(0, 1, 2, 0, 2, 3) : Y.length === 3 && re.push(0, 1, 2);
      const we = new Pe();
      we.setAttribute("position", new bt(j, 3)), we.setIndex(re), we.computeVertexNormals();
      const he = new Oe(we, Se);
      he.renderOrder = 101, I.add(he);
    } else if (le.type === "solid" && G) {
      const Y = G[le.idx], j = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], re = [];
      for (const [Ce, Ae] of j) {
        const Ve = V(Y[Ce]), Be = V(Y[Ae]);
        Ve && Be && re.push(Ve.x, Ve.y, Ve.z, Be.x, Be.y, Be.z);
      }
      const we = new Pe();
      we.setAttribute("position", new bt(re, 3));
      const he = new Kt(we, Me);
      he.renderOrder = 101, I.add(he);
    }
  }
  function Ie() {
    if ($e(), !X.length || !e.mesh) {
      e.render();
      return;
    }
    const le = e.derivedNodes.rawVal ?? [];
    let E = 1;
    if (le.length >= 2) {
      const G = [1 / 0, 1 / 0, 1 / 0], Y = [-1 / 0, -1 / 0, -1 / 0];
      for (const j of le) for (let re = 0; re < 3; re++) j[re] < G[re] && (G[re] = j[re]), j[re] > Y[re] && (Y[re] = j[re]);
      E = Math.max(Y[0] - G[0], Y[1] - G[1], Y[2] - G[2], 0.1);
    }
    for (const G of X) ke(G, E);
    e.render();
  }
  function Qe(le, E) {
    const G = X.findIndex((Y) => Y.type === le.type && Y.idx === le.idx);
    G >= 0 ? X.splice(G, 1) : E || X.push(le), X.length && X[X.length - 1];
  }
  function pt() {
    X.length = 0, Ie();
  }
  return K.derive(() => {
    e.derivedNodes.val, X.length && Ie();
  }), l;
}
function Pa(e, l, p, h, c, m) {
  const d = c - p, x = m - h, v = d * d + x * x;
  if (v < 1e-9) {
    const ce = e - p, se = l - h;
    return Math.sqrt(ce * ce + se * se);
  }
  let P = ((e - p) * d + (l - h) * x) / v;
  P = Math.max(0, Math.min(1, P));
  const z = p + P * d, b = h + P * x, q = e - z, xe = l - b;
  return Math.sqrt(q * q + xe * xe);
}
function Ca(e, l, p) {
  let h = false;
  for (let c = 0, m = p.length - 1; c < p.length; m = c++) {
    const d = p[c].x, x = p[c].y, v = p[m].x, P = p[m].y;
    x > l != P > l && e < (v - d) * (l - x) / (P - x + 1e-12) + d && (h = !h);
  }
  return h;
}
function Jo(e, l = 8) {
  const p = document.createElement("div");
  p.id = "legend", p.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    K.derive(() => {
      Zn.val, p.style.background = Ys();
    });
  });
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", p.appendChild(h), setTimeout(() => {
    K.derive(() => {
      h.textContent = xo.val ? `[${xo.val}]` : "";
    });
  });
  const c = Array.from({ length: l + 1 }, (v, P) => P / l).reverse();
  let m, d;
  c.forEach((v, P) => {
    m = document.createElement("div"), m.id = `marker-${P}`, m.className = "marker", m.style.marginTop = P == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", d = document.createElement("p"), d.id = `marker-text-${P}`, m.append(d), p.append(m);
  });
  const x = [];
  return p.querySelectorAll("p").forEach((v) => x.push(v)), setTimeout(() => {
    K.derive(() => {
      c.forEach((v, P) => {
        const z = x[P];
        z && (z.innerText = za(e.val, v).toString());
      });
    });
  }), p;
}
function za(e, l) {
  const p = zn.val;
  if (p) return Oo(p[0] + l * (p[1] - p[0]));
  const h = e.filter((d) => Number.isFinite(d));
  if (h.length === 0) return "0";
  const [c, m] = vo(h);
  return Oo(c + l * (m - c));
}
function Oo(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function Xa({ mesh: e, settingsObj: l, drawingObj: p, objects3D: h, solids: c }) {
  Bs.DEFAULT_UP = new S(0, 0, 1);
  const m = document.createElement("div"), d = new Ls(), x = new Is(45, 1, 0.1, 2 * 1e6), v = new Rs(-10, 10, 10, -10, -1e3, 2e6);
  let P = x;
  const z = new Ds({ antialias: true });
  z.localClippingEnabled = true;
  const b = new qo(x, z.domElement);
  b.enableDamping = true, b.dampingFactor = 0.1, b.screenSpacePanning = true, b.zoomSpeed = 0.8, b.panSpeed = 1.2, b.rotateSpeed = 0.9, b.keyPanSpeed = 12, b.listenToKeyEvents(window), b.touches = { ONE: Rn.ROTATE, TWO: Rn.DOLLY_PAN }, z.domElement.addEventListener("wheel", (E) => {
    if (!E.ctrlKey && Math.abs(E.deltaX) > Math.abs(E.deltaY) * 1.5) {
      E.preventDefault();
      const G = b.target, Y = new S().subVectors(x.position, G), j = new S();
      j.crossVectors(x.up, Y).normalize();
      const we = Y.length() * 1e-3 * b.panSpeed;
      G.addScaledVector(j, E.deltaX * we), x.position.addScaledVector(j, E.deltaX * we), b.update();
    }
  }, { passive: false });
  const q = new fo(new S(-1, 0, 0), 0), xe = new fo(new S(0, -1, 0), 0), ce = new fo(new S(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const E = window.__hekatanClip, G = [];
    E.enableX && (q.normal.set(E.invertX ? 1 : -1, 0, 0), q.constant = E.invertX ? -E.posX : E.posX, G.push(q)), E.enableY && (xe.normal.set(0, E.invertY ? 1 : -1, 0), xe.constant = E.invertY ? -E.posY : E.posY, G.push(xe)), E.enableZ && (ce.normal.set(0, 0, E.invertZ ? 1 : -1), ce.constant = E.invertZ ? -E.posZ : E.posZ, G.push(ce)), z.clippingPlanes = G, d.traverse((j) => {
      const re = j;
      if (re.material) {
        const we = Array.isArray(re.material) ? re.material : [re.material];
        for (const he of we) he.clippingPlanes = G, he.needsUpdate = true;
      }
    });
    const Y = window.__hekatanPanes ?? [];
    for (const j of Y) try {
      j && typeof j.refresh == "function" && j.refresh();
    } catch {
    }
    z.render(d, P);
  }
  se(), window.__hekatanClipApply = se;
  const A = qs(l), ae = K.derive(() => Math.pow(10, A.displayScale.val / 10)), J = Fa(e, A), Se = () => {
    const E = [];
    return A.gridXY.rawVal && E.push("xy"), A.gridXZ.rawVal && E.push("xz"), A.gridYZ.rawVal && E.push("yz"), E;
  }, Me = () => {
    const E = A.gridStep.rawVal, G = Math.max(E, A.gridMajor.rawVal);
    return { planes: Se(), majorStep: G, minorStep: E };
  };
  let X = mo(A.gridSize.rawVal, Me());
  X.visible = A.gridVisible.rawVal, window.__hekatanSnap2D = A.cursorSnap.rawVal;
  const I = () => {
    const E = Math.max(0, Math.min(1, A.gridOpacity.rawVal));
    X.traverse((G) => {
      const Y = G.material;
      if (!Y || !("opacity" in Y)) return;
      const j = G.name ?? "";
      let re = 0.35;
      j.includes("border") ? re = 1 : j.includes("major") && (re = 0.75), Y.opacity = E * re;
    });
  };
  I(), m.appendChild(Zs(A, e, c)), m.setAttribute("id", "viewer"), m.appendChild(z.domElement), z.setPixelRatio(window.devicePixelRatio);
  const U = an();
  z.setClearColor(U.background, 1);
  const V = A.gridSize.rawVal, T = V * 0.5 + V * 0.5 / Math.tan(45 * 0.5);
  x.position.set(0, 0, T), x.up.set(0, 1, 0), b.target.set(0, 0, 0), b.minDistance = 0.1, b.maxDistance = 1e4, m.__settings = A, b.zoomSpeed = 1, b._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, b.update();
  let N = Go(A.gridSize.rawVal, A.flipAxes.rawVal);
  d.add(X, N), K.derive(() => {
    window.__hekatanGridPlaneXY = A.gridXY.val, window.__hekatanGridPlaneXZ = A.gridXZ.val, window.__hekatanGridPlaneYZ = A.gridYZ.val;
  });
  let D = true;
  K.derive(() => {
    const E = A.gridVisible.val;
    if (D) {
      D = false;
      return;
    }
    X.visible = E, H();
  });
  let $ = true;
  K.derive(() => {
    if (A.gridOpacity.val, $) {
      $ = false;
      return;
    }
    I(), H();
  }), K.derive(() => {
    const E = A.cursorSnap.val;
    window.__hekatanSnap2D = E;
  });
  let ee = true;
  K.derive(() => {
    var _a2;
    const E = A.gridSize.val, G = A.flipAxes.val;
    if (A.gridXY.val, A.gridXZ.val, A.gridYZ.val, A.gridStep.val, A.gridMajor.val, ee) {
      ee = false;
      return;
    }
    d.remove(X), (_a2 = X.traverse) == null ? void 0 : _a2.call(X, (re) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = re.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = re.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), X = mo(E, Me()), X.visible = A.gridVisible.rawVal, d.add(X), I(), d.remove(N), N.traverse((re) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = re.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = re.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = Go(E, G), d.add(N);
    const Y = E * 0.5 + E * 0.5 / Math.tan(45 * 0.5);
    x.position.distanceTo(b.target), Math.abs(x.position.x) < 0.1 && Math.abs(x.position.y) < 0.1 && x.position.z > 0 ? x.position.set(0, 0, Y) : x.position.set(0.5 * E, -Y, 0.5 * E), b.target.set(0, 0, 0), b.minDistance = Math.max(0.05, E * 0.01), b.maxDistance = Math.max(50, E * 50), b.update(), H();
  }), new ResizeObserver((E) => {
    var _a2, _b;
    for (const G of E) {
      const Y = (_a2 = G.target) == null ? void 0 : _a2.clientWidth, j = (_b = G.target) == null ? void 0 : _b.clientHeight;
      if (Y === 0 || j === 0) continue;
      const we = (ie ? Y / 2 : Y) / j;
      x.aspect = we, x.updateProjectionMatrix();
      const he = v.top;
      if (v.left = -he * we, v.right = he * we, v.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = we, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Ce = oe, Ae = Ce.top;
        Ce.left = -Ae * we, Ce.right = Ae * we, Ce.updateProjectionMatrix();
      }
      z.setSize(Y, j), H();
    }
  }).observe(m), b.addEventListener("change", H), K.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, A.displayScale.val, A.nodes.val, A.elements.val, (_g = A.edges) == null ? void 0 : _g.val, A.elemColumns.val, A.elemBeams.val, A.nodesIndexes.val, A.elementsIndexes.val, A.orientations.val, A.sections.val, A.secColumns.val, A.secBeams.val, A.secFloor.val, A.supports.val, A.loads.val, A.deformedShape.val, A.nodeResults.val, A.frameResults.val, A.shellResults.val, (_h = A.solidResults) == null ? void 0 : _h.val, (_i = A.extruded) == null ? void 0 : _i.val, setTimeout(H);
  });
  let ie = false, oe = null, L = null, de = false;
  function H() {
    const E = m.clientWidth || 1, G = m.clientHeight || 1;
    if (!ie || !oe) {
      z.setScissorTest(false), z.setViewport(0, 0, E, G), z.render(d, P);
      return;
    }
    const Y = E / 2;
    z.setScissorTest(true), z.setViewport(0, 0, Y, G), z.setScissor(0, 0, Y, G), z.render(d, P), z.setViewport(Y, 0, Y, G), z.setScissor(Y, 0, Y, G), z.render(d, oe), z.setScissorTest(false);
  }
  function me(E) {
    P = E, b.object = E, b.update(), H();
  }
  function ye(E, G) {
    ie = E, G && (oe = G);
    const Y = m.clientWidth || 1, j = m.clientHeight || 1, we = (E ? Y / 2 : Y) / j;
    x.isPerspectiveCamera && (x.aspect = we, x.updateProjectionMatrix());
    const he = v.top;
    if (v.left = -he * we, v.right = he * we, v.updateProjectionMatrix(), E && oe) {
      if (L ? (L.object = oe, L.update()) : (L = new qo(oe, z.domElement), L.enableDamping = true, L.dampingFactor = 0.1, L.screenSpacePanning = true, L.zoomSpeed = 0.8, L.panSpeed = 1.2, L.rotateSpeed = 0.9, L.touches = { ONE: Rn.ROTATE, TWO: Rn.DOLLY_PAN }, L.target.copy(b.target), L.addEventListener("change", H), L.enabled = false), !de) {
        const Ce = (Ae) => {
          if (!ie || !L) return;
          const Ve = z.domElement.getBoundingClientRect(), Be = Ae.clientX - Ve.left, Xe = Ve.width / 2, Ge = Be >= Xe;
          b.enabled = !Ge, L.enabled = Ge;
        };
        z.domElement.addEventListener("pointerdown", Ce, true), z.domElement.addEventListener("wheel", Ce, { capture: true, passive: true }), de = true;
      }
    } else E || (b.enabled = true, L && (L.enabled = false));
    m.__splitMode = E, window.__hekatanSplitMode = E, window.__hekatanSplitCamera = E ? oe : null, H();
  }
  if (e) {
    d.add(Ks(A, J, ae), Xs(e, A, J), Ws(A, J, ae), Js(e, A, J, ae), Gs(e, A, J, ae), Hs(e, A, J, ae), js(e, A, J, ae), ta(e, A, J, ae), aa(e, A, J), ca(e, A, J, ae), ia(e, A, J, ae));
    const E = ka({ scene: d, rendererElm: z.domElement, getActiveCamera: () => P, derivedNodes: J, derivedDisplayScale: ae, mesh: e, settings: A, render: H });
    d.add(E);
    const G = La(e, A), Y = ua(e, A, J, G), j = Jo(G);
    d.add(Y), m.appendChild(j);
    const re = ya(e, A, J);
    d.add(re);
    const we = re.__colorMapValues, he = Jo(we);
    he.id = "frame-legend", m.appendChild(he), K.derive(() => {
      var _a2;
      const Ce = A.shellResults.val != "none", Ae = (((_a2 = A.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ve = Ce || Ae, Be = A.frameResults.val.startsWith("contour:"), Xe = G.val.some((Ge) => Number.isFinite(Ge));
      j.hidden = !Ve || !Xe, Y.visible = Ve, he.hidden = !Be;
    });
  }
  if (c) {
    const E = new ts(16777215, 0.5);
    d.add(E);
    const G = new Un(16777215, 0.5);
    G.position.set(30, 25, -10), G.shadow.mapSize.width = 1024, G.shadow.mapSize.height = 1024, d.add(G);
    const Y = 10;
    G.shadow.camera.left = -Y, G.shadow.camera.right = Y, G.shadow.camera.top = Y, G.shadow.camera.bottom = -Y, G.shadow.camera.far = 1e3;
    const j = new Un(16777215, 0.5);
    j.color.setHSL(11, 43, 96), j.position.set(-10, 0, 30), d.add(j), K.derive(() => {
      (c == null ? void 0 : c.val.length) && (d.remove(...c.oldVal), d.add(...c.rawVal), H());
    }), K.derive(() => {
      c.rawVal.forEach((re) => re.visible = A.solids.val), H();
    });
  }
  if (h) {
    const E = [], G = (j) => {
      var _a2;
      return ((_a2 = j == null ? void 0 : j.userData) == null ? void 0 : _a2.isCota) ? A.showCotas.val : A.custom3D.val;
    }, Y = () => {
      for (const j of E) j.visible = G(j);
      H();
    };
    K.derive(() => {
      const j = h.val;
      E.length && (d.remove(...E), E.length = 0), j.length && (d.add(...j), E.push(...j), Y()), H();
    }), K.derive(() => {
      A.custom3D.val, Y();
    }), K.derive(() => {
      A.showCotas.val, Y();
    });
  }
  p && da({ drawingObj: p, gridObj: X, scene: d, getActiveCamera: () => P, controls: b, gridSize: V, derivedDisplayScale: ae, rendererElm: z.domElement, viewerRender: H }), jo((E, G) => {
    var _a2;
    z.setClearColor(G.background, 1), d.remove(X), (_a2 = X.traverse) == null ? void 0 : _a2.call(X, (Y) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Y.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Y.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), X = mo(A.gridSize.rawVal, { planes: Se() }), d.add(X), m.style.setProperty("--awatif-legend-color", G.legendMarker), H();
  });
  const $e = { scene: d, perspCamera: x, orthoCamera: v, get camera() {
    return P;
  }, controls: b, renderer: z, rendererElm: z.domElement, render: H, setActiveCamera: me, setSplitMode: ye, get splitMode() {
    return ie;
  }, get splitCamera() {
    return oe;
  }, settings: A };
  m.__ctx = $e;
  const ke = document.createElement("div");
  ke.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Ie = (E, G, Y) => {
    const j = document.createElement("button");
    return j.textContent = E, j.title = G, j.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), j.onmouseenter = () => {
      j.style.background = "rgba(70,70,70,0.9)";
    }, j.onmouseleave = () => {
      j.style.background = "rgba(40,40,40,0.85)";
    }, j.onclick = (re) => {
      re.preventDefault(), Y();
    }, j;
  }, Qe = (E, G) => {
    const Y = b.target, j = new S().subVectors(P.position, Y), re = j.length(), we = new S(), he = new S();
    we.crossVectors(P.up, j).normalize(), he.copy(P.up).normalize();
    const Ce = re * 0.05;
    Y.addScaledVector(we, -E * Ce), Y.addScaledVector(he, G * Ce), P.position.addScaledVector(we, -E * Ce), P.position.addScaledVector(he, G * Ce), b.update(), H();
  }, pt = (E) => {
    const G = new S().subVectors(P.position, b.target);
    G.multiplyScalar(E), P.position.copy(b.target).add(G), b.update(), H();
  }, le = () => {
    const E = document.createElement("div");
    return E.style.cssText = "width:32px;height:32px;", E;
  };
  return ke.append(le()), ke.append(Ie("\u2191", "Pan arriba", () => Qe(0, 1))), ke.append(Ie("\u2295", "Zoom in", () => pt(0.85))), ke.append(Ie("\u2190", "Pan izquierda", () => Qe(-1, 0))), ke.append(Ie("\u2302", "Reset vista", () => {
    b.reset(), H();
  })), ke.append(Ie("\u2192", "Pan derecha", () => Qe(1, 0))), ke.append(Ie("\u2296", "Zoom out", () => pt(1.18))), ke.append(Ie("\u2193", "Pan abajo", () => Qe(0, -1))), ke.append(le()), getComputedStyle(m).position === "static" && (m.style.position = "relative"), m.appendChild(ke), m;
}
function Fa(e, l) {
  return K.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const p = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || p.length === 0) return p;
    const c = l.deformScale.val, m = l.deformScale.val * l.deformScaleZ.val, d = Number.isFinite(c) ? c : 1, x = Number.isFinite(m) ? m : 1;
    return p.map((v, P) => {
      var _a3;
      const z = ((_a3 = h.get(P)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], b = Number.isFinite(z[0]) ? z[0] : 0, q = Number.isFinite(z[1]) ? z[1] : 0, xe = Number.isFinite(z[2]) ? z[2] : 0;
      return [v[0] + b * d, v[1] + q * d, v[2] + xe * x];
    });
  });
}
const zn = K.state(null), xo = K.state(""), Aa = K.state("kN"), Ea = K.state("mm"), Ta = K.state("kN/m\xB2"), Va = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Qo = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, $a = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function La(e, l) {
  const p = K.state([]);
  let h;
  return ((c) => {
    c.bendingXX = "bendingXX", c.bendingYY = "bendingYY", c.bendingXY = "bendingXY", c.membraneXX = "membraneXX", c.membraneYY = "membraneYY", c.membraneXY = "membraneXY", c.tranverseShearX = "tranverseShearX", c.tranverseShearY = "tranverseShearY", c.membranePrincipalMax = "membranePrincipalMax", c.membranePrincipalMin = "membranePrincipalMin", c.bendingPrincipalMax = "bendingPrincipalMax", c.bendingPrincipalMin = "bendingPrincipalMin", c.transverseShearMax = "transverseShearMax", c.vonMises = "vonMises", c.pressure = "pressure", c.displacementX = "displacementX", c.displacementY = "displacementY", c.displacementZ = "displacementZ";
  })(h || (h = {})), K.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const c = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), ce = (G, Y) => {
      G == null ? void 0 : G.forEach((j, re) => {
        const we = e.elements.val[re];
        if (we) for (let he = 0; he < we.length; he++) Y.set(we[he], [j[he] ?? j[0]]);
      });
    };
    ce((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), ce((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, m), ce((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, d), ce((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, x), ce((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, v), ce((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, P), ce((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, z), ce((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, b), ce((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, q), ce((_t = (_s = e.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t.pressure, xe);
    const se = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Me = (G, Y, j, re, we) => {
      G.forEach((he, Ce) => {
        var _a3, _b2;
        const Ae = he[0] ?? 0, Ve = ((_a3 = Y.get(Ce)) == null ? void 0 : _a3[0]) ?? 0, Be = ((_b2 = j.get(Ce)) == null ? void 0 : _b2[0]) ?? 0, Xe = (Ae + Ve) / 2, Ge = Math.hypot((Ae - Ve) / 2, Be);
        re.set(Ce, [Xe + Ge]), we.set(Ce, [Xe - Ge]);
      });
    };
    Me(x, v, P, se, A), Me(c, m, d, ae, J), z.forEach((G, Y) => {
      var _a3;
      Se.set(Y, [Math.hypot(G[0] ?? 0, ((_a3 = b.get(Y)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const X = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, I = (_w = l.solidResults) == null ? void 0 : _w.val, V = I && I !== "none" ? I : l.shellResults.val, T = X == null ? void 0 : X[V], N = { bendingXX: [c, 0], bendingYY: [m, 0], bendingXY: [d, 0], membraneXX: [x, 0], membraneYY: [v, 0], membraneXY: [P, 0], tranverseShearX: [z, 0], tranverseShearY: [b, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [A, 0], bendingPrincipalMax: [ae, 0], bendingPrincipalMin: [J, 0], transverseShearMax: [Se, 0], vonMises: [q, 0], pressure: [xe, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, D = l.shellResults.val, $ = Aa.val, ee = Ea.val, fe = D === "displacementX" || D === "displacementY" || D === "displacementZ", ie = D === "bendingXX" || D === "bendingYY" || D === "bendingXY" || D === "bendingPrincipalMax" || D === "bendingPrincipalMin", oe = D === "membraneXX" || D === "membraneYY" || D === "membraneXY" || D === "membranePrincipalMax" || D === "membranePrincipalMin", L = D === "vonMises" || D === "pressure", de = D === "tranverseShearX" || D === "tranverseShearY" || D === "transverseShearMax", H = (_D = l.solidResults) == null ? void 0 : _D.val, me = H === "vonMises" || H === "sigmaXX" || H === "sigmaYY" || H === "sigmaZZ" || H === "tauXY" || H === "tauYZ" || H === "tauXZ", ye = H === "ux" || H === "uy" || H === "uz", $e = Ta.val, ke = me ? $a[$e] : ye || fe ? Qo[ee] : ie || oe || L || de ? 1 / Va[$] : 1, Ie = me ? $e : ye || fe ? ee : ie ? `${$}\xB7m/m` : oe ? `${$}/m\xB2` : L ? `${$}/m\xB2` : de ? `${$}/m` : "";
    xo.val = Ie, zn.val = Array.isArray(T) && T.length === 2 ? [T[0] * ke, T[1] * ke] : null;
    const Qe = as.val, le = H && H !== "none" ? [q, 0] : N[D], E = [];
    if (e.nodes.val.forEach((G, Y) => {
      const j = le;
      if (!j || !j[0] || typeof j[0].has != "function") return;
      if (!j[0].has(Y)) {
        E.push(Number.NaN);
        return;
      }
      const re = j[0].get(Y), we = re ? re[j[1]] ?? 0 : 0;
      E.push(we * ke);
    }), !zn.val && Qe !== "auto") {
      const G = e.nodes.val, Y = /* @__PURE__ */ new Set(), j = (we, he) => {
        var _a3;
        const Ce = (_a3 = G[we[0]]) == null ? void 0 : _a3[he];
        return we.every((Ae) => {
          var _a4;
          return Math.abs((((_a4 = G[Ae]) == null ? void 0 : _a4[he]) ?? NaN) - Ce) < 1e-6;
        });
      };
      for (const we of e.elements.val) {
        if (we.length !== 4) continue;
        const he = j(we, 2), Ce = !he && j(we, 0), Ae = !he && j(we, 1);
        if (Qe === "losas" ? he : Qe === "muros" ? Ce || Ae : Qe === "murosX" ? Ce : Qe === "murosY" ? Ae : false) for (const Xe of we) Y.add(Xe);
      }
      const re = [];
      for (const we of Y) {
        const he = E[we];
        Number.isFinite(he) && re.push(he);
      }
      re.length && (zn.val = vo(re));
    }
    p.val = E;
  }), p;
}
export {
  Us as a,
  Jo as b,
  Aa as c,
  Ea as d,
  Ta as e,
  Xa as g
};
